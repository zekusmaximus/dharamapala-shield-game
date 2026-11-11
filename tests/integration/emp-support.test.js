import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { getAuraMultiplier } from '../../js/core/rules/towers.js';
import { pointAtPathDistance } from '../../js/core/world.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();
const stepMs = 1000 / 60;

function newSession() {
  const session = new GameSession(balance, { tutorialCompleted: true });
  assert.equal(session.newGame().ok, true);
  return session;
}

function raidEmpScenario() {
  const session = newSession();
  session.state.resources = { dharma: 1000, bandwidth: 1000, anonymity: 1000 };
  assert.equal(session.placeDefense('firewall', { x: 450, y: 270 }).ok, true);
  assert.equal(session.placeDefense('distributor', { x: 270, y: 210 }).ok, true);
  session.state.waveNumber = 5;
  assert.equal(session.startWave().ok, true);
  session.step(stepMs); // The production schedule spawns Raid Team and an attacker.

  const boss = [...session.state.enemies.values()].find((enemy) => enemy.type === 'raidTeam');
  const target = [...session.state.enemies.values()].find((enemy) => enemy.type === 'scriptKiddie');
  assert.ok(boss && target);
  // Put the boss within EMP range of support but outside the attacker's EMP
  // range. Keep both positions on the path so the checkpoint remains savable.
  for (const [enemy, distance] of [[boss, 200], [target, 700]]) {
    enemy.pathDistance = distance;
    Object.assign(enemy, pointAtPathDistance(distance));
  }
  boss.health = boss.maxHealth * 0.65;
  session.systems.enemy.updateBosses(session);

  const defenses = [...session.state.defenses.values()];
  const attacker = defenses.find((defense) => defense.type === 'firewall');
  const support = defenses.find((defense) => defense.type === 'distributor');
  assert.deepEqual(boss.firedPhases, [1]);
  assert.ok(support.disabledUntilMs > session.state.gameTimeMs);
  assert.equal(attacker.disabledUntilMs, 0);
  return { session, attacker, support };
}

test('Raid Team EMP suspends the support aura in actual tower fire and restores it at expiry', () => {
  const { session, attacker, support } = raidEmpScenario();
  const defenses = [...session.state.defenses.values()];
  assert.equal(getAuraMultiplier(balance, attacker, defenses, session.state.gameTimeMs), 1);
  session.systems.defense.update(session, stepMs);
  assert.ok(Math.abs(attacker.cooldownMs - (1000 - stepMs)) < 1e-8);

  session.state.gameTimeMs = support.disabledUntilMs;
  attacker.cooldownMs = 0;
  assert.equal(getAuraMultiplier(balance, attacker, defenses, session.state.gameTimeMs), 1.12);
  session.systems.defense.update(session, stepMs);
  assert.ok(Math.abs(attacker.cooldownMs - (1000 / 1.12 - stepMs)) < 1e-8);
});

test('EMP-disabled support and its recovery continue identically after save/restore', () => {
  const { session: live, attacker, support } = raidEmpScenario();
  const snapshot = live.toSnapshot();
  const restored = GameSession.fromSnapshot(balance, snapshot);
  const restoredSupport = restored.state.defenses.get(support.id);
  assert.equal(restoredSupport.disabledUntilMs, support.disabledUntilMs);
  assert.deepEqual(restored.toSnapshot().state, snapshot.state);
  assert.deepEqual(restored.toSnapshot().runtime, snapshot.runtime);

  let sawDisabled = false;
  let sawRecovered = false;
  for (let tick = 0; tick < 150; tick += 1) {
    const deltaMs = [17, 31, 8, 19][tick % 4];
    live.tick(deltaMs);
    restored.tick(deltaMs);
    if (tick % 15 === 0 || tick === 149) {
      assert.deepEqual(restored.toSnapshot().state, live.toSnapshot().state);
      assert.deepEqual(restored.toSnapshot().runtime, live.toSnapshot().runtime);
    }
    const multiplier = getAuraMultiplier(
      balance,
      attacker,
      [...live.state.defenses.values()],
      live.state.gameTimeMs
    );
    sawDisabled ||= multiplier === 1;
    sawRecovered ||= multiplier === 1.12;
  }
  assert.equal(live.state.phase, PHASES.WAVE);
  assert.ok(sawDisabled && sawRecovered);
  for (let tick = 0; tick < 15_000 && live.state.phase === PHASES.WAVE; tick += 1) {
    const deltaMs = [17, 31, 8, 19][tick % 4];
    live.tick(deltaMs);
    restored.tick(deltaMs);
    if (tick % 120 === 0 || live.state.phase !== PHASES.WAVE) {
      assert.deepEqual(restored.toSnapshot().state, live.toSnapshot().state);
      assert.deepEqual(restored.toSnapshot().runtime, live.toSnapshot().runtime);
    }
  }
  assert.notEqual(live.state.phase, PHASES.WAVE, 'continued combat reaches a result');
  assert.equal(restored.state.phase, live.state.phase);
  assert.equal(snapshot.state.defenses.find((defense) => defense.id === support.id).disabledUntilMs, support.disabledUntilMs);
});

test('a Distributor disabled at wave clear still earns its passive income', () => {
  function finishWith(distributor) {
    const session = newSession();
    if (distributor) {
      session.state.resources = { dharma: 1000, bandwidth: 1000, anonymity: 1000 };
      assert.equal(session.placeDefense('distributor', { x: 270, y: 210 }).ok, true);
    }
    assert.equal(session.startWave().ok, true);
    if (distributor) {
      const support = [...session.state.defenses.values()][0];
      support.disabledUntilMs = 100_000;
    }
    for (let tick = 0; tick < 3000 && session.state.phase === PHASES.WAVE; tick += 1) {
      session.tick(stepMs);
    }
    assert.equal(session.state.phase, PHASES.BUILDING, 'wave completed through real leaks');
    return session.state.lastWaveResult.reward;
  }

  const base = finishWith(false);
  const disabledSupport = finishWith(true);
  assert.equal(disabledSupport.dharma - base.dharma, balance.economy.distributorWaveBonus);
  assert.equal(disabledSupport.bandwidth, base.bandwidth);
  assert.equal(disabledSupport.anonymity, base.anonymity);
});
