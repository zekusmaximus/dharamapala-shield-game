import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

function buildingSession() {
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame({ tutorialCompleted: true });
  return session;
}

test('phase transitions are explicit and rejected commands do not mutate state', () => {
  const session = new GameSession(balance, { tutorialCompleted: false });
  const before = session.toSnapshot().state;
  assert.equal(session.startWave().ok, false);
  assert.deepEqual(session.toSnapshot().state, before);

  assert.equal(session.newGame().ok, true);
  assert.equal(session.state.phase, PHASES.TUTORIAL);
  assert.equal(session.completeTutorial().ok, true);
  assert.equal(session.state.phase, PHASES.BUILDING);
  assert.equal(session.startWave().ok, true);
  assert.equal(session.state.phase, PHASES.WAVE);
  assert.equal(session.pause().ok, true);
  assert.equal(session.state.resumePhase, PHASES.WAVE);
  assert.equal(session.resume().ok, true);
  assert.equal(session.state.phase, PHASES.WAVE);
});

test('pause freezes game time and spawning', () => {
  const session = buildingSession();
  session.startWave();
  session.pause();
  session.tick(10_000);
  assert.equal(session.state.gameTimeMs, 0);
  assert.equal(session.state.wave.spawned, 0);
  session.resume();
  session.tick(20);
  assert.ok(session.state.gameTimeMs > 0);
  assert.ok(session.state.wave.spawned > 0);
});

test('restart invalidates a partially released schedule', () => {
  const session = buildingSession();
  session.startWave();
  session.tick(20);
  assert.ok(session.state.enemies.size > 0);
  session.restart();
  session.tick(30_000);
  assert.equal(session.state.phase, PHASES.BUILDING);
  assert.equal(session.state.enemies.size, 0);
  assert.equal(session.state.wave.spawned, 0);
});

test('leaks never grant kill rewards and kills reward exactly once', () => {
  const leaked = buildingSession();
  leaked.startWave();
  leaked.tick(20);
  const leakedEnemy = [...leaked.state.enemies.values()][0];
  const resourcesBeforeLeak = { ...leaked.state.resources };
  leaked.resolveEnemy(leakedEnemy.id, 'LEAKED');
  assert.deepEqual(leaked.state.resources, resourcesBeforeLeak);
  assert.equal(leaked.state.statistics.kills, 0);
  assert.equal(leaked.state.statistics.leaks, 1);

  const killed = buildingSession();
  killed.startWave();
  killed.tick(20);
  const killedEnemy = [...killed.state.enemies.values()][0];
  const resourcesBeforeKill = { ...killed.state.resources };
  assert.equal(killed.resolveEnemy(killedEnemy.id, 'KILLED').ok, true);
  assert.ok(killed.state.resources.dharma > resourcesBeforeKill.dharma);
  assert.equal(killed.resolveEnemy(killedEnemy.id, 'KILLED').ok, false);
  assert.equal(killed.state.statistics.kills, 1);
});

test('placement, upgrades, and selling use one authoritative defense Map', () => {
  const session = buildingSession();
  assert.equal(session.placeDefense('firewall', { x: 210, y: 210 }).ok, true);
  const defense = [...session.state.defenses.values()][0];
  session.state.resources.dharma = 500;
  assert.equal(session.upgradeDefense(defense.id).ok, true);
  assert.equal(session.state.defenses.get(defense.id).level, 2);
  assert.equal(session.sellDefense(defense.id).ok, true);
  assert.equal(session.state.defenses.size, 0);
});
