import {
  ACTIVE_TOWER_TYPES,
  DEFERRED_TOWER_TYPES,
  PHASES
} from '../core/commands.js';
import { GameSession } from '../core/GameSession.js';
import { addResources, normalizeResources } from '../core/rules/economy.js';
import { createDefense } from '../entities/createDefense.js';

export const SAVE_KEY = 'dharmapala-shield/save/v2';
export const PREFERENCES_KEY = 'dharmapala-shield/preferences/v1';
const CORRUPT_KEY = `${SAVE_KEY}/corrupt`;
const TUTORIAL_KEY = 'dharmapala-shield/tutorial-completed';
const LEGACY_KEYS = [
  'dharmapala_shield_save_0',
  'dharmapala_shield_save_1',
  'dharmapala_shield_save_2'
];

export class BrowserSaveRepository {
  constructor(storage) {
    this.error = null;
    this.recoveryRaw = null;
    this.blocked = false;
    try { this.storage = storage ?? globalThis.localStorage; }
    catch (error) { this.error = error.message; }
  }

  read(key) {
    try { return this.storage?.getItem(key) ?? null; }
    catch (error) { this.error = error.message; return null; }
  }

  hasSave() {
    return Boolean(this.read(SAVE_KEY) || LEGACY_KEYS.some(key => this.read(key)));
  }

  preferences(fallback = {}) {
    let saved = {};
    try { saved = JSON.parse(this.read(PREFERENCES_KEY) || '{}'); } catch { /* defaults */ }
    return Object.fromEntries(Object.entries({ tutorialCompleted: this.getTutorialCompleted(), showRanges: true, reducedMotion: false }).map(([key, value]) => [key, typeof saved?.[key] === 'boolean' ? saved[key] : typeof fallback[key] === 'boolean' ? fallback[key] : value]));
  }

  savePreferences(settings) {
    try {
      if (!this.storage) throw new Error('Local storage is unavailable');
      this.storage.setItem(PREFERENCES_KEY, JSON.stringify(settings));
      return { ok: true };
    } catch (error) { this.error = error.message; return { ok: false, error: error.message }; }
  }

  save(session) {
    if (this.blocked) return { ok: false, error: 'Export or reset the unreadable save before saving a new run.' };
    try {
      if (!this.storage) throw new Error('Local storage is unavailable');
      this.storage.setItem(SAVE_KEY, JSON.stringify(session.toSnapshot()));
      return this.savePreferences(session.state.settings);
    } catch (error) { this.error = error.message; return { ok: false, error: error.message }; }
  }

  load(balance) {
    const raw = this.read(SAVE_KEY);
    if (raw) {
      try {
        const session = GameSession.fromSnapshot(balance, JSON.parse(raw));
        Object.assign(session.state.settings, this.preferences(session.state.settings));
        return { ok: true, session, migrated: false };
      } catch (error) {
        this.preserveCorrupt(raw);
        return { ok: false, error: error.message, raw };
      }
    }
    if (this.error) return { ok: false, error: `Local storage unavailable: ${this.error}` };
    return this.loadLegacy(balance);
  }

  loadLegacy(balance) {
    for (const key of LEGACY_KEYS) {
      const raw = this.read(key);
      if (!raw) {
        continue;
      }
      try {
        const legacy = JSON.parse(raw);
        const session = this.migrateLegacy(balance, legacy);
        GameSession.fromSnapshot(balance, session.toSnapshot());
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
      if (defense.level >= 3 && balance.towers[defense.type].specializations) {
        throw new Error('Legacy level-3 attacker needs an explicit specialization; export/reset this run.');
      }
      session.state.defenses.set(defense.id, defense);
    }
    return session;
  }

  preserveCorrupt(raw) {
    this.recoveryRaw = raw;
    this.blocked = true;
    try {
      this.storage?.setItem(CORRUPT_KEY, raw);
    } catch {
      // The original payload remains under SAVE_KEY if storage is unavailable.
    }
  }

  exportCorrupt() {
    return this.recoveryRaw || this.read(CORRUPT_KEY);
  }

  clear() {
    try {
      if (!this.storage) throw new Error('Local storage is unavailable');
      for (const key of [SAVE_KEY, ...LEGACY_KEYS]) this.storage.removeItem(key);
      this.blocked = false;
      return { ok: true };
    } catch (error) { this.error = error.message; return { ok: false, error: error.message }; }
  }

  getTutorialCompleted() {
    return this.read(TUTORIAL_KEY) === 'true';
  }
}
