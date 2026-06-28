import {
  ACTIVE_TOWER_TYPES,
  DEFERRED_TOWER_TYPES,
  PHASES
} from '../core/commands.js';
import { GameSession } from '../core/GameSession.js';
import { addResources, normalizeResources } from '../core/rules/economy.js';
import { createDefense } from '../entities/createDefense.js';

export const SAVE_KEY = 'dharmapala-shield/save/v2';
const CORRUPT_KEY = `${SAVE_KEY}/corrupt`;
const TUTORIAL_KEY = 'dharmapala-shield/tutorial-completed';
const LEGACY_KEYS = [
  'dharmapala_shield_save_0',
  'dharmapala_shield_save_1',
  'dharmapala_shield_save_2'
];

export class BrowserSaveRepository {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
  }

  hasSave() {
    return Boolean(
      this.storage?.getItem(SAVE_KEY) ||
        LEGACY_KEYS.some((key) => this.storage?.getItem(key))
    );
  }

  save(session) {
    try {
      this.storage.setItem(SAVE_KEY, JSON.stringify(session.toSnapshot()));
      if (session.state.settings.tutorialCompleted) {
        this.storage.setItem(TUTORIAL_KEY, 'true');
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  load(balance) {
    const raw = this.storage?.getItem(SAVE_KEY);
    if (raw) {
      try {
        const snapshot = JSON.parse(raw);
        return {
          ok: true,
          session: GameSession.fromSnapshot(balance, snapshot),
          migrated: false
        };
      } catch (error) {
        this.preserveCorrupt(raw);
        return { ok: false, error: error.message, raw };
      }
    }
    return this.loadLegacy(balance);
  }

  loadLegacy(balance) {
    for (const key of LEGACY_KEYS) {
      const raw = this.storage?.getItem(key);
      if (!raw) {
        continue;
      }
      try {
        const legacy = JSON.parse(raw);
        const session = this.migrateLegacy(balance, legacy);
        this.save(session);
        return { ok: true, session, migrated: true };
      } catch (error) {
        this.preserveCorrupt(raw);
        return { ok: false, error: `Legacy save cannot be resumed: ${error.message}`, raw };
      }
    }
    return { ok: false, error: 'No saved game exists.' };
  }

  migrateLegacy(balance, legacy) {
    const data = legacy.gameData || legacy;
    if (!data.resources || !Array.isArray(data.defenses || [])) {
      throw new Error('required game data is missing');
    }
    const session = new GameSession(balance, {
      seed: 1337,
      tutorialCompleted: true
    });
    session.newGame({ tutorialCompleted: true });
    session.state.phase = PHASES.BUILDING;
    session.state.resources = normalizeResources(data.resources);
    session.state.lives = Math.max(
      1,
      Number(data.lives) || balance.economy.initialLives
    );
    session.state.score = Math.max(0, Number(data.score) || 0);
    session.state.waveNumber = Math.max(
      1,
      Math.min(
        balance.waves.length,
        Number(data.levelData?.currentWave || data.wave || 1)
      )
    );

    for (const oldDefense of data.defenses) {
      if (DEFERRED_TOWER_TYPES.has(oldDefense.type)) {
        const refund = balance.migration?.deferredTowerRefunds?.[oldDefense.type] || {
          dharma: Number(oldDefense.cost) || 30,
          bandwidth: 0,
          anonymity: 0
        };
        session.state.resources = addResources(session.state.resources, refund);
        continue;
      }
      if (!ACTIVE_TOWER_TYPES.includes(oldDefense.type)) {
        continue;
      }
      const defense = createDefense(
        oldDefense.type,
        {
          x: Number(oldDefense.x) || 90,
          y: Number(oldDefense.y) || 90
        },
        session.ids.next('defense')
      );
      defense.level = Math.max(
        1,
        Math.min(balance.upgrades.maxLevel, Number(oldDefense.level) || 1)
      );
      session.state.defenses.set(defense.id, defense);
    }
    return session;
  }

  preserveCorrupt(raw) {
    try {
      this.storage?.setItem(CORRUPT_KEY, raw);
    } catch {
      // The original payload remains under SAVE_KEY if storage is unavailable.
    }
  }

  exportCorrupt() {
    return this.storage?.getItem(CORRUPT_KEY) || null;
  }

  clear() {
    this.storage?.removeItem(SAVE_KEY);
  }

  getTutorialCompleted() {
    return this.storage?.getItem(TUTORIAL_KEY) === 'true';
  }
}
