import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../js/core/GameSession.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

test('a saved Titan fight retains health-hit cooldown and identical later recovery', () => {
  const live = new GameSession(balance, { tutorialCompleted: true });
  live.newGame();
  live.state.waveNumber = 15;
  live.startWave();
  live.step(1000 / 60); // Spawn the real scheduled Titan.
  const titan = [...live.state.enemies.values()].find((enemy) => enemy.type === 'megaCorpTitan');
  assert.ok(titan);
  const hit = (damage) => live.systems.combat.applyHit(live, {
    damage,
    damageType: 'physical',
    sourceId: 'untracked',
    slowDurationMs: 0,
    vulnerabilityDurationMs: 0,
    critical: false
  }, titan, 1);

  hit(500); // Depletes the shield, with a little overflow into health.
  assert.equal(titan.shield, 0);
  live.step(2000);
  hit(100); // Health damage refreshes the recovery deadline.
  const deadline = titan.shieldCooldownUntilMs;
  assert.equal(deadline, live.state.gameTimeMs + 3000);
  const saved = live.toSnapshot();
  const restored = GameSession.fromSnapshot(balance, saved);

  for (const deltaMs of [2999, 1, 500, 200, 1000]) {
    live.step(deltaMs);
    restored.step(deltaMs);
    assert.deepEqual(restored.toSnapshot().state, live.toSnapshot().state);
    assert.deepEqual(restored.toSnapshot().runtime, live.toSnapshot().runtime);
    if (live.state.gameTimeMs <= deadline) {
      assert.equal(titan.shield, 0);
    }
  }
  assert.ok(titan.shield > 0);
  assert.equal(live.state.phase, 'WAVE');
  assert.equal(saved.state.enemies.find((enemy) => enemy.id === titan.id).shield, 0);
});
