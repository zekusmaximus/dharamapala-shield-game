import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canAfford,
  getSellValue,
  getUpgradeCost
} from '../../js/core/rules/economy.js';
import { getTowerStats } from '../../js/core/rules/towers.js';
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
