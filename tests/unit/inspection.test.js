import test from 'node:test';
import assert from 'node:assert/strict';
import { getTowerBlueprint, getTowerInspection, getEnemyInspection } from '../../js/core/rules/inspection.js';
import { getAuraMultiplier, getTowerStats } from '../../js/core/rules/towers.js';
import { getSellValue, getTotalInvested, getUpgradeCost } from '../../js/core/rules/economy.js';
import { getWavePreview } from '../../js/core/rules/waves.js';
import { loadBalance } from '../helpers/loadBalance.js';

const balance = await loadBalance();
const defense = (id, type, level, x, y, disabledUntilMs = 0) =>
  ({ id, type, level, x, y, disabledUntilMs });

test('unplaced blueprints use the same level, cost and refund rules', () => {
  const control = getTowerBlueprint(balance, 'encryption');
  assert.equal(control.current.damage, getTowerStats(balance, 'encryption', 1).damage);
  assert.equal(control.next.ratePerSec, getTowerStats(balance, 'encryption', 2).ratePerSec);
  assert.equal(control.next.slowDurationMs, getTowerStats(balance, 'encryption', 2).slowDurationMs);
  assert.equal(control.chainUnlockLevel, 4);
  assert.deepEqual(control.buildCost, balance.towers.encryption.cost);
  assert.deepEqual(control.upgradeCost, getUpgradeCost(balance, 'encryption', 1));
  assert.deepEqual(control.sellValue, getSellValue(balance, 'encryption', 1));
  const support = getTowerBlueprint(balance, 'distributor');
  assert.equal(support.current.damage, 0);
  assert.equal(support.current.auraFireRatePct, getTowerStats(balance, 'distributor', 1).auraFireRatePct);
  assert.equal(support.waveBonusDharma, 6);
  assert.equal(support.waveBonusCapDharma, 30);
});

test('attacker comparison uses combat stats, active aura, upgrade cost and refund rules', () => {
  const attacker = defense('attack', 'encryption', 3, 210, 210);
  const support = defense('support', 'distributor', 1, 270, 210);
  const towers = [attacker, support];
  const info = getTowerInspection(balance, attacker, towers, 1000, 4);
  assert.equal(info.current.damage, getTowerStats(balance, 'encryption', 3).damage);
  assert.equal(info.next.damage, getTowerStats(balance, 'encryption', 4).damage);
  assert.equal(info.current.ratePerSec, getTowerStats(balance, 'encryption', 3).ratePerSec);
  assert.equal(info.next.ratePerSec, getTowerStats(balance, 'encryption', 4).ratePerSec);
  assert.equal(info.current.slowDurationMs, getTowerStats(balance, 'encryption', 3).slowDurationMs);
  assert.equal(info.next.vulnerabilityDurationMs, getTowerStats(balance, 'encryption', 4).vulnerabilityDurationMs);
  assert.equal(info.current.vulnerabilityPct, getTowerStats(balance, 'encryption', 3).vulnerabilityPct);
  assert.equal(info.current.chainTargets, 0);
  assert.equal(info.next.chainTargets, 1);
  assert.equal(info.chainUnlockLevel, 4);
  assert.equal(info.current.effectiveRatePerSec,
    info.current.ratePerSec * getAuraMultiplier(balance, attacker, towers, 1000));
  assert.equal(info.next.effectiveRatePerSec,
    info.next.ratePerSec * getAuraMultiplier(balance, { ...attacker, level: 4 }, [{ ...attacker, level: 4 }, support], 1000));
  assert.deepEqual(info.upgradeCost, getUpgradeCost(balance, 'encryption', 3));
  assert.deepEqual(info.totalInvested, getTotalInvested(balance, 'encryption', 3));
  assert.deepEqual(info.sellValue, getSellValue(balance, 'encryption', 3));
});

test('max-level direct attacker has no invented status or next upgrade', () => {
  const tower = defense('firewall', 'firewall', 5, 210, 210);
  const info = getTowerInspection(balance, tower, [tower], 0, 1);
  assert.equal(info.next, null);
  assert.equal(info.upgradeCost, null);
  assert.equal(info.chainUnlockLevel, null);
  assert.equal(info.current.slowDurationMs, 0);
  assert.equal(info.current.vulnerabilityDurationMs, 0);
  assert.equal(info.current.effectiveRatePerSec, info.current.ratePerSec);
});

test('Distributor shows actual marginal support, EMP expiry and passive capped income', () => {
  const firewall = defense('firewall', 'firewall', 1, 210, 210);
  const encryption = defense('encryption', 'encryption', 1, 270, 210);
  const distributor = defense('distributor', 'distributor', 1, 210, 270, 1500);
  const towers = [firewall, encryption, distributor];
  const disabled = getTowerInspection(balance, distributor, towers, 1499, 5);
  assert.equal(disabled.support.current.active, false);
  assert.equal(disabled.support.current.coveredCount, 2);
  assert.equal(disabled.support.current.affectedCount, 0);
  assert.equal(disabled.support.current.addedRatePerSec, 0);
  assert.equal(disabled.support.waveBonus.marginalDharma, 6);
  assert.equal(disabled.support.waveBonus.totalDharma, 6);
  const active = getTowerInspection(balance, distributor, towers, 1500, 5);
  assert.equal(active.support.current.active, true);
  assert.equal(active.support.current.affectedCount, 2);
  assert.ok(Math.abs(active.support.current.addedRatePerSec - (1 + 0.8) * 0.12) < 1e-10);
  assert.equal(active.current.damage, 0);
  assert.equal(active.next.auraFireRatePct, getTowerStats(balance, 'distributor', 2).auraFireRatePct);
  assert.ok(active.support.next.addedRatePerSec > active.support.current.addedRatePerSec);

  const others = [1, 2, 3].map((index) => defense(`other-${index}`, 'distributor', 1, 210 + index * 20, 270));
  const capped = getTowerInspection(balance, distributor, [...towers, ...others], 1500, 5);
  assert.equal(capped.support.current.affectedCount, 0);
  assert.ok(Math.abs(capped.support.current.addedRatePerSec) < 1e-10);
  assert.equal(capped.support.waveBonus.totalDharma, 24);
  assert.equal(capped.support.waveBonus.marginalDharma, 6);
  const fifth = defense('fifth', 'distributor', 1, 310, 270);
  const atIncomeCap = getTowerInspection(balance, distributor, [...towers, ...others, fifth], 1500, 5);
  assert.equal(atIncomeCap.support.waveBonus.totalDharma, 30);
  assert.equal(atIncomeCap.support.waveBonus.marginalDharma, 6);
  const sixth = defense('sixth', 'distributor', 1, 330, 270);
  const overIncomeCap = getTowerInspection(balance, distributor, [...towers, ...others, fifth, sixth], 1500, 5);
  assert.equal(overIncomeCap.support.waveBonus.totalDharma, 30);
  assert.equal(overIncomeCap.support.waveBonus.marginalDharma, 0);
});

test('enemy intel uses active damage types and only implemented abilities', () => {
  for (const [type, definition] of Object.entries(balance.enemies)) {
    const info = getEnemyInspection(balance, type);
    assert.equal(info.armor, definition.armor);
    assert.deepEqual(info.resistances, {
      physical: definition.resists.physical,
      shock: definition.resists.shock
    });
    if (definition.brace) assert.match(info.ability, /Shield brace/);
    else assert.equal(info.ability, null);
    assert.ok(info.counterHint);
    assert.equal(Object.hasOwn(info, 'special'), false);
  }
  const raid = getEnemyInspection(balance, 'raidTeam');
  assert.match(raid.ability, /reinforcements.*EMP/);
  assert.match(raid.ability, /66% health.*3 Script Kiddies and 1 Federal Agent/);
  const titan = getEnemyInspection(balance, 'megaCorpTitan');
  assert.match(titan.ability, /shield.*regenerates/);
  assert.match(titan.ability, /after 3 s without hits at 4%.*35% of health/);
  assert.equal(Object.hasOwn(titan, 'phases'), false);
  assert.equal(Object.hasOwn(getWavePreview(balance, 1).enemies[0], 'ability'), false);
});
