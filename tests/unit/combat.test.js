import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

function waveSession(waveNumber = 1) {
  const session = new GameSession(balance, { tutorialCompleted: true });
  session.newGame({ tutorialCompleted: true });
  session.state.waveNumber = waveNumber;
  session.startWave();
  return session;
}

function projectileAt(enemy, overrides = {}) {
  return {
    id: `test-projectile-${enemy.id}`,
    sourceId: 'test-source',
    sourceType: 'firewall',
    targetId: enemy.id,
    x: enemy.x,
    y: enemy.y,
    radius: 5,
    speed: 0,
    damage: 10,
    damageType: 'physical',
    critical: false,
    aoeRadius: 0,
    piercing: false,
    hitIds: [],
    slowPct: 0,
    slowDurationMs: 0,
    vulnerabilityPct: 0,
    vulnerabilityDurationMs: 0,
    chainTargets: 0,
    createdAtMs: 0,
    expiresAtMs: 5000,
    ...overrides
  };
}

test('a non-piercing projectile resolves exactly one collision', () => {
  const session = waveSession();
  const enemy = session.spawnEnemy({
    enemyType: 'scriptKiddie',
    hpMultiplier: 10
  });
  const projectile = projectileAt(enemy);
  session.state.projectiles.set(projectile.id, projectile);
  const healthBefore = enemy.health;
  session.systems.combat.update(session, 0);
  const healthAfter = enemy.health;
  session.systems.combat.update(session, 0);
  assert.equal(healthBefore - healthAfter, 10);
  assert.equal(enemy.health, healthAfter);
  assert.equal(session.state.projectiles.has(projectile.id), false);
});

test('piercing hit IDs prevent repeat damage and splash is applied once per target', () => {
  const session = waveSession();
  const first = session.spawnEnemy({
    enemyType: 'scriptKiddie',
    hpMultiplier: 10
  });
  const second = session.spawnEnemy({
    enemyType: 'scriptKiddie',
    hpMultiplier: 10
  });
  second.x += 10;
  const projectile = projectileAt(first, {
    piercing: true,
    aoeRadius: 30
  });
  session.state.projectiles.set(projectile.id, projectile);
  session.systems.combat.update(session, 0);
  const firstAfter = first.health;
  const secondAfter = second.health;
  session.systems.combat.update(session, 0);
  assert.equal(first.health, firstAfter);
  assert.equal(second.health, secondAfter);
  assert.deepEqual(projectile.hitIds, [first.id, second.id]);
});

test('MegaCorp Titan shield recovery waits three seconds after the latest shield or health hit', () => {
  const session = waveSession(15);
  const titan = session.spawnEnemy({
    enemyType: 'megaCorpTitan',
    hpMultiplier: 1
  });
  const hit = (rawDamage) => session.systems.combat.applyHit(
    session, projectileAt(titan, { damage: rawDamage }), titan, 1
  );
  const startingHealth = titan.health;
  const startingShield = titan.shield;

  hit(100); // 100 × 0.75 resistance - 30 armor = 45 shield damage.
  assert.equal(titan.shield, startingShield - 45);
  assert.equal(titan.health, startingHealth);
  assert.equal(titan.shieldCooldownUntilMs, 3000);

  hit(500); // 345 effective damage depletes the remaining 288 shield.
  assert.equal(titan.shield, 0);
  assert.equal(titan.health, startingHealth - 57);
  session.state.gameTimeMs = 2000;
  hit(100); // Direct health damage must postpone shield recovery too.
  assert.equal(titan.health, startingHealth - 102);
  assert.equal(titan.shieldCooldownUntilMs, 5000);

  session.state.gameTimeMs = 4000;
  hit(100); // Another health hit refreshes the cooldown.
  assert.equal(titan.shieldCooldownUntilMs, 7000);
  session.state.gameTimeMs = 6999;
  session.systems.enemy.update(session, 2999);
  assert.equal(titan.shield, 0);
  session.state.gameTimeMs = 7000;
  session.systems.enemy.update(session, 1);
  assert.equal(titan.shield, 0, 'no recovery has elapsed at the boundary');
  session.state.gameTimeMs = 7500;
  session.systems.enemy.update(session, 500);
  assert.ok(Math.abs(titan.shield - titan.shieldRegenPerSec / 2) < 1e-10);
});
