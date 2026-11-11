import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';
import { createPolicy } from '../../tools/balance/policies.mjs';

const balance = await loadBalance();
const fixedStepMs = 1000 / 60;
const frameDeltas = [17, 31, 8, 19, 300, 5, 41, 100];

function scenario(wave, { towers = true, policy = false } = {}) {
  const session = new GameSession(balance, { tutorialCompleted: true });
  assert.equal(session.newGame().ok, true);
  // Scenario setup: jump to an authored wave and grant build funds. All ensuing
  // spawning, movement, impacts, status, resolution and accounting are production.
  session.state.waveNumber = wave;
  if (wave === 20) session.state.statistics.wavesCompleted = 19;
  if (towers) {
    session.state.resources = { dharma: 3000, bandwidth: 3000, anonymity: 3000 };
    if (policy) createPolicy('existing').build(session);
    else {
      for (const position of [
        { x: 210, y: 210 }, { x: 270, y: 210 }, { x: 450, y: 270 },
        { x: 510, y: 270 }, { x: 750, y: 270 }
      ]) assert.equal(session.placeDefense('firewall', position).ok, true);
      assert.equal(session.placeDefense('encryption', { x: 450, y: 150 }).ok, true);
      assert.equal(session.placeDefense('distributor', { x: 270, y: 150 }).ok, true);
    }
  }
  assert.equal(session.startWave().ok, true);
  return session;
}

function comparable(session) {
  const snapshot = session.toSnapshot();
  delete snapshot.state.waveSpeed;
  return { state: snapshot.state, runtime: snapshot.runtime };
}

function assertCombatEqual(one, two) {
  assert.deepEqual(comparable(two), comparable(one));
}

function observe(session, seen) {
  const enemies = [...session.state.enemies.values()];
  seen.spawned ||= session.state.wave.spawned > 0;
  seen.projectile ||= session.state.projectiles.size > 0;
  seen.slow ||= enemies.some((enemy) => enemy.slowPct > 0);
  seen.expired ||= enemies.some((enemy) => enemy.slowUntilMs > 0 && enemy.slowPct === 0);
  seen.bossPhase ||= enemies.some((enemy) => enemy.firedPhases.length > 0);
  seen.shieldHit ||= enemies.some((enemy) => enemy.shieldMax > 0 && enemy.shield < enemy.shieldMax);
}

function runEqualTime(one, two, seen, limit = 5000) {
  let frames = 0;
  while (one.state.phase === PHASES.WAVE && frames < limit) {
    const realDelta = frameDeltas[frames % frameDeltas.length];
    const creditedMs = Math.min(realDelta, 250);
    one.tick(realDelta);
    two.tick(creditedMs / 2);
    observe(one, seen);
    if (frames < 20 || frames % 20 === 0 || one.state.phase !== PHASES.WAVE) {
      assertCombatEqual(one, two);
    }
    frames++;
  }
  assert.ok(frames < limit, 'production wave resolved');
  assert.notEqual(one.state.phase, PHASES.WAVE);
  assert.equal(two.state.phase, one.state.phase);
  assertCombatEqual(one, two);
  assert.deepEqual(two.state.reports.pending, one.state.reports.pending);
  return frames;
}

for (const wave of [5, 15]) {
  test(`1× and 2× reach identical production combat and reports on wave ${wave}`, () => {
    const one = scenario(wave);
    const two = GameSession.fromSnapshot(balance, one.toSnapshot());
    assert.equal(two.setWaveSpeed(2).ok, true);
    const seen = {};
    runEqualTime(one, two, seen);
    assert.equal(seen.spawned, true);
    assert.equal(seen.projectile, true);
    assert.equal(seen.slow, true);
    assert.equal(seen.expired, true);
    assert.equal(wave === 5 ? seen.bossPhase : seen.shieldHit, true);
    assert.ok(one.state.reports.pending[0].towers);
    assert.ok(one.state.reports.pending[0].bounty.dharma > 0);
    assert.deepEqual(one.state.resources, two.state.resources);
  });
}

test('switching during a Raid Team fight and while paused preserves fractional time across save/continue', () => {
  const one = scenario(5);
  const changing = GameSession.fromSnapshot(balance, one.toSnapshot());
  assert.equal(changing.setWaveSpeed(3).ok, false);
  assert.equal(changing.state.waveSpeed, 1);
  for (let frame = 0; frame < 50; frame++) {
    const delta = [17, 31, 8, 19][frame % 4];
    one.tick(delta); changing.tick(delta);
  }
  assertCombatEqual(one, changing);
  assert.equal(changing.setWaveSpeed(2).ok, true);
  let sawPhase = false;
  for (let frame = 0; frame < 4000 && !sawPhase; frame++) {
    const delta = [80, 33, 42, 19][frame % 4];
    one.tick(delta); changing.tick(delta / 2);
    sawPhase = [...one.state.enemies.values()].some((enemy) => enemy.firedPhases.length > 0);
    if (frame % 25 === 0 || sawPhase) assertCombatEqual(one, changing);
  }
  assert.equal(sawPhase, true, 'production boss fired a phase');
  one.tick(6.5); changing.tick(3.25);
  assert.ok(changing.clock.accumulatorMs > 0);
  assertCombatEqual(one, changing);
  assert.equal(one.pause().ok, true);
  assert.equal(changing.pause().ok, true);
  const paused = changing.toSnapshot();
  const savedCopy = structuredClone(paused);
  assert.equal(paused.state.waveSpeed, 2);
  const restored = GameSession.fromSnapshot(balance, paused);
  assert.equal(restored.state.waveSpeed, 2);
  assert.deepEqual(restored.toSnapshot().runtime, paused.runtime);
  for (const session of [one, changing, restored]) {
    const frozen = comparable(session);
    assert.equal(session.tick(60_000).steps, 0);
    assert.deepEqual(comparable(session), frozen);
  }
  assert.equal(restored.setWaveSpeed(1).ok, true);
  assert.equal(changing.setWaveSpeed(1).ok, true);
  assertCombatEqual(one, restored);
  for (const session of [one, changing, restored]) assert.equal(session.resume().ok, true);
  assertCombatEqual(one, restored);
  let frames = 0;
  while (one.state.phase === PHASES.WAVE && frames < 5000) {
    const delta = frameDeltas[frames % frameDeltas.length];
    one.tick(delta); changing.tick(delta); restored.tick(delta);
    if (frames % 30 === 0 || one.state.phase !== PHASES.WAVE) {
      assertCombatEqual(one, changing);
      assertCombatEqual(one, restored);
    }
    frames++;
  }
  assert.ok(frames < 5000);
  assert.notEqual(one.state.phase, PHASES.WAVE);
  assert.deepEqual(restored.state.reports.pending, one.state.reports.pending);
  assert.deepEqual(paused, savedCopy, 'continued combat cannot mutate the input save');
});

test('natural defeat and victory stop further 2× advancement and lock speed changes', () => {
  for (const [wave, options, expected] of [
    [1, { towers: false }, PHASES.GAME_OVER],
    [20, { policy: true }, PHASES.VICTORY]
  ]) {
    const one = scenario(wave, options);
    if (wave === 1) one.state.lives = 1;
    const two = GameSession.fromSnapshot(balance, one.toSnapshot());
    two.setWaveSpeed(2);
    runEqualTime(one, two, {});
    assert.equal(one.state.phase, expected);
    assert.equal(one.state.finalStatistics.leaks, one.state.statistics.leaks);
    assert.equal(two.clock.accumulatorMs, 0);
    assert.equal(two.setWaveSpeed(1).code, 'INVALID_PHASE');
    const terminal = comparable(two);
    two.tick(20_000);
    assert.deepEqual(comparable(two), terminal);
    assert.ok(two.state.reports.pending.some((report) => report.waveNumber === wave));
  }
});

test('old v2 saves default to 1×, reject invalid speeds, and restart resets speed', () => {
  const session = scenario(1);
  session.setWaveSpeed(2);
  const old = session.toSnapshot();
  delete old.state.waveSpeed;
  assert.equal(GameSession.fromSnapshot(balance, old).state.waveSpeed, 1);
  for (const speed of [0, 3, 1.5, '2', null]) {
    const invalid = structuredClone(old);
    invalid.state.waveSpeed = speed;
    assert.throws(() => GameSession.fromSnapshot(balance, invalid), /Invalid wave speed/);
  }
  session.restart();
  assert.equal(session.state.waveSpeed, 1);
  assert.equal(session.state.phase, PHASES.BUILDING);
  assert.equal(session.tick(1000).steps, 0);
  assert.equal(session.state.wave.spawned, 0);
  assert.ok(Math.abs(fixedStepMs - session.clock.stepMs) < 1e-9);
});

test('2× selection persists across a real clear, while the next wave waits for Start Wave', () => {
  const session = scenario(1);
  assert.equal(session.setWaveSpeed(2).ok, true);
  let frames = 0;
  while (session.state.phase === PHASES.WAVE && frames < 2000) {
    session.tick(100);
    frames++;
  }
  assert.equal(session.state.phase, PHASES.BUILDING);
  assert.equal(session.state.waveNumber, 2);
  assert.equal(session.state.waveSpeed, 2);
  assert.equal(session.state.reports.pending[0].outcome, 'cleared');
  const frozen = comparable(session);
  assert.equal(session.tick(60_000).steps, 0);
  assert.deepEqual(comparable(session), frozen);
  assert.equal(session.startWave().ok, true);
  assert.equal(session.state.waveSpeed, 2);
  session.returnToMenu();
  assert.equal(session.state.waveSpeed, 1);
  session.newGame();
  assert.equal(session.state.waveSpeed, 1);
});
