import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { PATH_METRICS, pointAtPathDistance } from '../../js/core/world.js';
import { BrowserSaveRepository, SAVE_KEY } from '../../js/platform/BrowserSaveRepository.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

function twoEnemiesAtExit() {
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame({ tutorialCompleted: true });
  session.startWave();
  for (let frame = 0; frame < 61; frame += 1) session.tick(1000 / 60);
  assert.equal(session.state.enemies.size, 2);
  session.state.lives = 1;
  const distance = PATH_METRICS.totalLength - 0.01;
  for (const enemy of session.state.enemies.values()) {
    enemy.pathDistance = distance;
    Object.assign(enemy, pointAtPathDistance(distance));
  }
  // The setup is a valid continuing combat save, including its scheduler.
  GameSession.fromSnapshot(balance, session.toSnapshot());
  return session;
}

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key)
  };
}

test('same-tick exits stop at game over and live, captured, persisted results agree', () => {
  const session = twoEnemiesAtExit();
  const remainingId = [...session.state.enemies.keys()][1];
  let eventSnapshot;
  session.events.on('game-over', () => {
    eventSnapshot = session.toSnapshot();
    GameSession.fromSnapshot(balance, eventSnapshot);
  });

  assert.deepEqual(session.tick(250), { steps: 1, alpha: 0 });
  assert.equal(session.state.phase, PHASES.GAME_OVER);
  assert.equal(session.state.enemies.size, 1);
  assert.equal(session.state.enemies.has(remainingId), true);
  assert.equal(session.state.wave.resolved, 1);
  assert.equal(session.state.wave.leaked, 1);
  assert.equal(session.state.statistics.leaks, 1);
  assert.deepEqual(session.state.finalStatistics, {
    ...session.state.statistics,
    score: session.state.score,
    lives: session.state.lives,
    waveNumber: session.state.waveNumber
  });
  assert.deepEqual(eventSnapshot.state, session.toSnapshot().state);

  const repository = new BrowserSaveRepository(memoryStorage());
  assert.equal(repository.save(session).ok, true);
  const loaded = repository.load(balance);
  assert.equal(loaded.ok, true);
  assert.deepEqual(loaded.session.toSnapshot().state, session.toSnapshot().state);

  const frozen = session.toSnapshot();
  assert.equal(session.resolveEnemy(remainingId, 'LEAKED').code, 'INVALID_PHASE');
  assert.equal(session.resolveEnemy(remainingId, 'KILLED').code, 'INVALID_PHASE');
  assert.equal(session.completeWave().code, 'INVALID_PHASE');
  assert.equal(session.step(1000 / 60), false);
  assert.deepEqual(session.tick(250), { steps: 0, alpha: 0 });
  session.systems.enemy.update(session, 1000 / 60);
  assert.deepEqual(session.toSnapshot().state, frozen.state);
  assert.deepEqual(session.toSnapshot().runtime, frozen.runtime);
});

test('restored continuing combat reaches the same terminal result', () => {
  const uninterrupted = twoEnemiesAtExit();
  const restored = GameSession.fromSnapshot(balance, uninterrupted.toSnapshot());
  assert.deepEqual(uninterrupted.tick(250), restored.tick(250));
  assert.deepEqual(uninterrupted.toSnapshot().state, restored.toSnapshot().state);
  assert.deepEqual(uninterrupted.toSnapshot().runtime, restored.toSnapshot().runtime);
});

test('a resolution listener can enter terminal and save before resolution returns', () => {
  const session = twoEnemiesAtExit();
  let eventSnapshot;
  let terminalEvents = 0;
  session.events.on('game-over', () => { terminalEvents += 1; });
  session.events.on('enemy-leaked', () => {
    assert.equal(session.enterTerminal(PHASES.GAME_OVER), true);
    eventSnapshot = session.toSnapshot();
    GameSession.fromSnapshot(balance, eventSnapshot);
  });

  session.tick(250);
  assert.equal(terminalEvents, 1);
  assert.equal(session.state.statistics.leaks, 1);
  assert.equal(session.state.enemies.size, 1);
  assert.deepEqual(session.toSnapshot().state, eventSnapshot.state);
  assert.deepEqual(session.toSnapshot().runtime, eventSnapshot.runtime);
});

test('terminal saves reject any disagreement in captured statistics', () => {
  const session = twoEnemiesAtExit();
  session.tick(250);
  const snapshot = session.toSnapshot();
  snapshot.state.finalStatistics.leaks += 1;
  assert.throws(() => GameSession.fromSnapshot(balance, snapshot), /Results disagree/);
});

test('old 1.0.0 game-over saves with extra same-tick leaks are recovered on load', () => {
  const session = twoEnemiesAtExit();
  session.tick(250);
  const oldSnapshot = session.toSnapshot();
  oldSnapshot.state.enemies.pop();
  oldSnapshot.state.wave.resolved += 1;
  oldSnapshot.state.wave.leaked += 1;
  oldSnapshot.state.statistics.leaks += 1;
  // The old terminal capture had already happened after the first leak.
  assert.equal(oldSnapshot.state.finalStatistics.leaks, 1);

  // Historical rule coverage stays pinned to its own balance version. Current
  // content retires these saves through recovery, tested separately.
  const oldBalance = { ...balance, version: '1.0.0' };
  oldSnapshot.balanceVersion = oldSnapshot.state.balanceVersion = '1.0.0';
  const repository = new BrowserSaveRepository(memoryStorage());
  repository.storage.setItem(SAVE_KEY, JSON.stringify(oldSnapshot));
  const loaded = repository.load(oldBalance);
  assert.equal(loaded.ok, true);
  assert.equal(loaded.session.state.statistics.leaks, 2);
  assert.equal(loaded.session.state.finalStatistics.leaks, 2);
  assert.equal(oldSnapshot.state.finalStatistics.leaks, 1);
  GameSession.fromSnapshot(oldBalance, loaded.session.toSnapshot());

  const unrelated = structuredClone(oldSnapshot);
  unrelated.state.finalStatistics.kills += 1;
  assert.throws(() => GameSession.fromSnapshot(oldBalance, unrelated), /Results disagree/);
});

test('a terminal transition during an achievement stops later resolution events', () => {
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame();
  session.state.waveNumber = 5;
  session.startWave();
  session.step(1000 / 60);
  const boss = [...session.state.enemies.values()].find(enemy => enemy.type === 'raidTeam');
  assert.ok(boss);

  const seen = [];
  session.events.on('achievement', event => {
    seen.push(event.id);
    session.state.lives = 0;
    assert.equal(session.enterTerminal(PHASES.GAME_OVER), true);
    GameSession.fromSnapshot(balance, session.toSnapshot());
  });
  session.events.on('enemy-killed', () => seen.push('enemy-killed'));
  assert.equal(session.resolveEnemy(boss.id, 'KILLED').ok, true);
  assert.deepEqual(seen, ['first-defense']);
  assert.equal(session.state.statistics.kills, 1);
  assert.equal(session.state.statistics.bossesKilled, 1);
  assert.deepEqual(session.state.finalStatistics, {
    ...session.state.statistics,
    score: session.state.score,
    lives: 0,
    waveNumber: session.state.waveNumber
  });
});
