import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canAfford,
  getSellValue,
  getUpgradeCost
} from '../../js/core/rules/economy.js';
import { getAuraMultiplier, getTowerStats } from '../../js/core/rules/towers.js';
import { compileSpawnSchedule } from '../../js/core/rules/waves.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();

test('three active towers have distinct tested roles', () => {
  const firewall = getTowerStats(balance, 'firewall', 1);
  const encryption = getTowerStats(balance, 'encryption', 1);
  const distributor = getTowerStats(balance, 'distributor', 1);
  assert.equal(firewall.role, 'Damage');
  assert.equal(encryption.role, 'Control');
  assert.ok(encryption.slowPct > 0);
  assert.ok(encryption.vulnerabilityPct > 0);
  assert.equal(distributor.damage, 0);
  assert.ok(distributor.auraFireRatePct > 0);
});

test('upgrades never invent status effects without an application duration', () => {
  for (let level = 1; level <= balance.upgrades.maxLevel; level += 1) {
    for (const type of ['firewall', 'distributor']) {
      const stats = getTowerStats(balance, type, level);
      assert.equal(stats.slowPct, 0, `${type} level ${level} slow`);
      assert.equal(stats.slowDurationMs, 0);
      assert.equal(stats.vulnerabilityPct, 0, `${type} level ${level} vulnerability`);
      assert.equal(stats.vulnerabilityDurationMs, 0);
    }
    const encryption = getTowerStats(balance, 'encryption', level);
    assert.ok(encryption.slowPct > 0);
    assert.ok(encryption.slowDurationMs > 0);
    assert.ok(encryption.vulnerabilityPct > 0);
    assert.ok(encryption.vulnerabilityDurationMs > 0);
  }
});

test('only enabled nearby Distributors supply aura, including at the expiry boundary', () => {
  const attacker = { id: 'attacker', type: 'firewall', level: 1, x: 210, y: 210 };
  const support = { id: 'support', type: 'distributor', level: 1, x: 270, y: 210, disabledUntilMs: 1500 };
  assert.equal(getAuraMultiplier(balance, attacker, [attacker, support], 1499), 1);
  assert.equal(getAuraMultiplier(balance, attacker, [attacker, support], 1500), 1.12);
  assert.equal(getAuraMultiplier(balance, attacker, [attacker, support], 1501), 1.12);
  assert.equal(getAuraMultiplier(balance, support, [attacker, support], 1500), 1);
  const distant = { ...support, id: 'distant', x: 900, y: 500, disabledUntilMs: 0 };
  assert.equal(getAuraMultiplier(balance, attacker, [attacker, support, distant], 1499), 1);
  const second = { ...support, id: 'second', x: 210, y: 270, disabledUntilMs: 0 };
  assert.equal(getAuraMultiplier(balance, attacker, [attacker, support, second], 1499), 1.12);
});

test('upgrade and sell values share economy rules', () => {
  const upgrade = getUpgradeCost(balance, 'firewall', 1);
  assert.deepEqual(upgrade, { dharma: 59, bandwidth: 0, anonymity: 0 });
  const sell = getSellValue(balance, 'firewall', 2);
  assert.deepEqual(sell, { dharma: 62, bandwidth: 0, anonymity: 0 });
  assert.equal(canAfford({ dharma: 58, bandwidth: 10, anonymity: 10 }, upgrade), false);
});

test('wave schedules are deterministic and zero intervals stay finite', () => {
  const first = compileSpawnSchedule(balance, 5);
  const second = compileSpawnSchedule(balance, 5);
  assert.deepEqual(first, second);
  assert.equal(first[0].dueAtMs, 0);
  assert.ok(first.every((event) => Number.isFinite(event.dueAtMs)));
});
