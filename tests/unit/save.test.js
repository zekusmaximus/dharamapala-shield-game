import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
import { BrowserSaveRepository, SAVE_KEY, PREFERENCES_KEY } from '../../js/platform/BrowserSaveRepository.js';
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

test('old 1.4.0/v4 wave bytes remain exportable until explicit reset; preferences survive', async () => {
  const raw = await readFile(new URL('../../design/reviews/2026-11-12-m4.1/old-1.4.0-v4-save.json', import.meta.url), 'utf8');
  const old = JSON.parse(raw);
  assert.equal(old.schemaVersion, 4);
  assert.equal(old.balanceVersion, '1.4.0');
  assert.throws(() => GameSession.fromSnapshot(balance, old), /Unsupported save schema or balance version/);
  const relabeled = structuredClone(old);
  relabeled.balanceVersion = relabeled.state.balanceVersion = '1.6.0';
  assert.throws(() => GameSession.fromSnapshot(balance, relabeled),
    'old pending wave-7 events cannot be smuggled through by changing version strings');
  const storage = new MemoryStorage();
  storage.setItem(SAVE_KEY, raw);
  storage.setItem(PREFERENCES_KEY, JSON.stringify({ tutorialCompleted: true, showRanges: false, reducedMotion: true }));
  const repository = new BrowserSaveRepository(storage);
  assert.equal(repository.load(balance).ok, false);
  assert.equal(storage.getItem(SAVE_KEY), raw);
  assert.equal(repository.save(new GameSession(balance)).ok, false);
  assert.equal(repository.exportCorrupt(), raw);
  assert.equal(repository.clear().ok, true);
  assert.equal(storage.getItem(SAVE_KEY), null);
  assert.equal(repository.exportCorrupt(), raw);
  assert.deepEqual(repository.preferences(), { tutorialCompleted: true, showRanges: false, reducedMotion: true });
  const fresh = new GameSession(balance);
  fresh.newGame({ tutorialCompleted: true });
  assert.equal(repository.save(fresh).ok, true);
  assert.equal(JSON.parse(storage.getItem(SAVE_KEY)).schemaVersion, 4);
  assert.equal(JSON.parse(storage.getItem(SAVE_KEY)).balanceVersion, '1.6.0');
});

test('M4.1 1.5.0/v4 Raid phase bytes remain exportable until explicit reset', async () => {
  const raw = await readFile(new URL('../../design/reviews/2026-11-12-m4.2/old-1.5.0-v4-save.json', import.meta.url), 'utf8');
  const old = JSON.parse(raw);
  assert.equal(old.balanceVersion, '1.5.0');
  assert.equal(old.schemaVersion, 4);
  assert.throws(() => GameSession.fromSnapshot(balance, old), /Unsupported save schema or balance version/);
  const relabeled = structuredClone(old);
  relabeled.balanceVersion = relabeled.state.balanceVersion = '1.6.0';
  assert.throws(() => GameSession.fromSnapshot(balance, relabeled), /Invalid boss phases/);
  const storage = new MemoryStorage();
  storage.setItem(SAVE_KEY, raw);
  storage.setItem(PREFERENCES_KEY, JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));
  const repository = new BrowserSaveRepository(storage);
  assert.equal(repository.load(balance).ok, false);
  assert.equal(repository.save(new GameSession(balance)).ok, false);
  assert.equal(storage.getItem(SAVE_KEY), raw);
  assert.equal(repository.exportCorrupt(), raw);
  assert.equal(repository.clear().ok, true);
  assert.equal(storage.getItem(SAVE_KEY), null);
  assert.equal(repository.exportCorrupt(), raw);
  assert.deepEqual(repository.preferences(), {tutorialCompleted:true,showRanges:false,reducedMotion:true});
});

test('historical legacy removed towers are refunded and active towers are reconstructed', async () => {
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
  const result = repository.load(JSON.parse(await readFile(new URL('../../design/reviews/2026-11-12-m3.3/baseline-1.2.0.json',import.meta.url))));
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
