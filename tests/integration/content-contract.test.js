import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../js/core/GameSession.js';
import { pointAtPathDistance } from '../../js/core/world.js';
import { clone, loadBalance } from '../helpers/loadBalance.js';

const shipped = await loadBalance();
const stepMs = 1000 / 60;

function startAt(balance, wave) {
  const session = new GameSession(balance, { tutorialCompleted: true });
  assert.equal(session.newGame().ok, true);
  session.state.waveNumber = wave; // Scenario setup; this is not campaign evidence.
  assert.equal(session.startWave().ok, true);
  session.step(stepMs);
  return session;
}

test('configured slow and vulnerability reach actual projectiles and enemy movement', () => {
  const balance = clone(shipped);
  Object.assign(balance.towers.encryption.status, {
    slowPct: 0.3, slowDuration: 900,
    vulnerabilityPct: 0.2, vulnerabilityDuration: 900
  });
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame();
  assert.equal(session.placeDefense('encryption', { x: 210, y: 210 }).ok, true);
  assert.equal(session.startWave().ok, true);
  let slowed;
  for (let i = 0; i < 2000 && session.state.phase === 'WAVE'; i += 1) {
    session.step(stepMs);
    slowed = [...session.state.enemies.values()].find((enemy) => enemy.slowPct > 0);
    if (slowed) break;
  }
  assert.ok(slowed, 'production targeting, firing and impact applied the configured status');
  assert.equal(slowed.slowPct, 0.3);
  assert.equal(slowed.vulnerabilityPct, 0.2);
  const before = slowed.pathDistance;
  session.step(stepMs);
  assert.ok(Math.abs(slowed.pathDistance - before - slowed.speed * 0.7 * stepMs / 1000) < 1e-8);
});

test('configured Raid Team threshold, radius, duration and minions drive production phase handling and a valid save', () => {
  const balance = clone(shipped);
  const { emp, reinforcements } = balance.bosses.raidTeam.abilities;
  emp.thresholds = [0.7, 0.25];
  emp.radius = 150;
  emp.durationMs = 900;
  reinforcements.byPhase = [['federalAgent', 'scriptKiddie'], ['scriptKiddie']];
  reinforcements.intervalMs = 400;
  reinforcements.hpMultiplierPerWave = 0.03;
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame();
  session.state.resources = { dharma: 1000, bandwidth: 1000, anonymity: 1000 };
  assert.equal(session.placeDefense('distributor', { x: 270, y: 210 }).ok, true);
  assert.equal(session.placeDefense('firewall', { x: 270, y: 330 }).ok, true);
  session.state.waveNumber = 5; // Controlled boss scenario, not a full campaign.
  assert.equal(session.startWave().ok, true);
  session.step(stepMs);
  const boss = [...session.state.enemies.values()].find((enemy) => enemy.type === 'raidTeam');
  assert.ok(boss);
  boss.pathDistance = 200;
  Object.assign(boss, pointAtPathDistance(200));
  boss.health = boss.maxHealth * 0.69; // Above the shipped 66% trigger.
  session.systems.enemy.updateBosses(session);
  assert.deepEqual(boss.firedPhases, [1]);
  const [support, outside] = [...session.state.defenses.values()];
  assert.equal(support.disabledUntilMs, session.state.gameTimeMs + 900);
  assert.equal(outside.disabledUntilMs, 0, 'the configured 150-unit radius excludes a legal 164-unit tower');
  const dynamic = session.scheduler.events.filter((event) => event.dynamic);
  assert.deepEqual(dynamic.map((event) => event.enemyType), ['federalAgent', 'scriptKiddie']);
  assert.equal(dynamic[0].hpMultiplier, 1 + 5 * 0.03);
  assert.equal(dynamic[1].dueAtMs - dynamic[0].dueAtMs, 400);
  const saved = session.toSnapshot();
  const restored = GameSession.fromSnapshot(balance, saved);
  assert.deepEqual(restored.toSnapshot().state, saved.state);
  assert.deepEqual(restored.toSnapshot().runtime, saved.runtime);
  const staleMultiplier = structuredClone(saved);
  staleMultiplier.runtime.scheduler.events.find((event) => event.dynamic).hpMultiplier = 1 + 5 * 0.02;
  assert.throws(() => GameSession.fromSnapshot(balance, staleMultiplier), /Invalid reinforcement/);
  session.step(stepMs);
  assert.ok([...session.state.enemies.values()].some((enemy) => enemy.type === 'federalAgent'));
});

test('configured Titan shield ratio, recovery delay and rate drive production hit and recovery', () => {
  const balance = clone(shipped);
  const shield = balance.bosses.megaCorpTitan.abilities.shield;
  Object.assign(shield, { healthRatio: 0.5, regenRatioPerSec: 0.1, recoveryDelayMs: 500 });
  const session = startAt(balance, 15);
  const titan = [...session.state.enemies.values()].find((enemy) => enemy.type === 'megaCorpTitan');
  assert.ok(titan);
  assert.equal(titan.shieldMax, Math.round(titan.maxHealth * 0.5));
  assert.equal(titan.shieldRegenPerSec, titan.shieldMax * 0.1);
  session.systems.combat.applyHit(session, {
    damage: 100, damageType: 'physical', sourceId: 'untracked',
    slowDurationMs: 0, vulnerabilityDurationMs: 0, critical: false
  }, titan, 1);
  const afterHit = titan.shield;
  assert.equal(titan.shieldCooldownUntilMs, session.state.gameTimeMs + 500);
  session.step(500);
  assert.equal(titan.shield, afterHit, 'no regeneration at the exact deadline');
  session.step(1000);
  assert.equal(titan.shield, Math.min(titan.shieldMax, afterHit + titan.shieldRegenPerSec));
});

test('configured chain radius and secondary multiplier drive the production impact path', () => {
  const balance = clone(shipped);
  balance.combat.chain.radius = 200;
  balance.combat.chain.damageMultiplier = 0.4;
  const session = startAt(balance, 1);
  const primary = [...session.state.enemies.values()][0];
  const secondary = session.spawnEnemy({ enemyType: 'scriptKiddie', hpMultiplier: 10 });
  secondary.x = primary.x + 150; // Positioned target fixture for impact geometry.
  secondary.y = primary.y;
  const before = secondary.health;
  session.systems.combat.resolveImpact(session, {
    damage: 20, damageType: 'physical', sourceId: 'untracked',
    aoeRadius: 0, chainTargets: 1, hitIds: [],
    slowDurationMs: 0, vulnerabilityDurationMs: 0, critical: false
  }, primary);
  assert.equal(before - secondary.health, 8);
});
