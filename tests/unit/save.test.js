import test from 'node:test';
import assert from 'node:assert/strict';
import { BrowserSaveRepository, SAVE_KEY } from '../../js/platform/BrowserSaveRepository.js';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

test('v2 repository round-trips paused state and runtime cursors', () => {
  const storage = new MemoryStorage();
  const repository = new BrowserSaveRepository(storage);
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame({ tutorialCompleted: true });
  session.placeDefense('firewall', { x: 210, y: 210 });
  session.startWave();
  session.tick(1100);
  session.pause();
  assert.equal(repository.save(session).ok, true);
  const loaded = repository.load(balance);
  assert.equal(loaded.ok, true);
  assert.equal(loaded.session.state.phase, PHASES.PAUSED);
  assert.deepEqual(loaded.session.toSnapshot().state, session.toSnapshot().state);
  assert.deepEqual(
    loaded.session.toSnapshot().runtime,
    session.toSnapshot().runtime
  );
});

test('corrupt saves are preserved without mutating a live session', () => {
  const storage = new MemoryStorage();
  storage.setItem(SAVE_KEY, '{"schemaVersion":2,"broken":true}');
  const repository = new BrowserSaveRepository(storage);
  const result = repository.load(balance);
  assert.equal(result.ok, false);
  assert.equal(repository.exportCorrupt(), storage.getItem(SAVE_KEY));
});

test('legacy removed towers are refunded and active towers are reconstructed', () => {
  const storage = new MemoryStorage();
  storage.setItem(
    'dharmapala_shield_save_0',
    JSON.stringify({
      version: '1.0.0',
      gameData: {
        resources: { dharma: 10, bandwidth: 10, anonymity: 10 },
        lives: 12,
        wave: 3,
        defenses: [
          { type: 'decoy', x: 90, y: 90, level: 1 },
          { type: 'firewall', x: 210, y: 210, level: 2 }
        ]
      }
    })
  );
  const repository = new BrowserSaveRepository(storage);
  const result = repository.load(balance);
  assert.equal(result.ok, true);
  assert.equal(result.migrated, true);
  assert.equal(result.session.state.phase, PHASES.BUILDING);
  assert.equal(result.session.state.defenses.size, 1);
  assert.deepEqual(result.session.state.resources, {
    dharma: 40,
    bandwidth: 25,
    anonymity: 15
  });
});
