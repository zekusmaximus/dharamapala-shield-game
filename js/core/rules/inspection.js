import { getEnemyDefinition } from '../../entities/createEnemy.js';
import { ACTIVE_TOWER_TYPES } from '../commands.js';
import {
  getSellValue,
  getTotalInvested,
  getUpgradeCost,
  getWaveReward
} from './economy.js';
import { describeTower, getAuraMultiplier, getTowerStats } from './towers.js';

function isActive(defense, nowMs) {
  return !(defense.disabledUntilMs > nowMs);
}

function effectiveAttackRate(balance, defense, allDefenses, nowMs) {
  const stats = getTowerStats(balance, defense.type, defense.level, defense.specialization);
  return isActive(defense, nowMs)
    ? stats.ratePerSec * getAuraMultiplier(balance, defense, allDefenses, nowMs)
    : 0;
}

function supportEffect(balance, distributor, allDefenses, nowMs) {
  const without = allDefenses.filter((candidate) => candidate.id !== distributor.id);
  const withDistributor = [...without, distributor];
  const range = getTowerStats(balance, distributor.type, distributor.level).range;
  const recipients = without
    .filter((candidate) => {
      const stats = getTowerStats(balance, candidate.type, candidate.level, candidate.specialization);
      return stats.damage > 0 && stats.ratePerSec > 0 &&
        Math.hypot(candidate.x - distributor.x, candidate.y - distributor.y) <= range;
    })
    .map((candidate) => {
      const withoutRatePerSec = effectiveAttackRate(balance, candidate, without, nowMs);
      const withRatePerSec = effectiveAttackRate(balance, candidate, withDistributor, nowMs);
      return {
        id: candidate.id,
        type: candidate.type,
        withoutRatePerSec,
        withRatePerSec,
        addedRatePerSec: withRatePerSec - withoutRatePerSec
      };
    });

  return {
    active: isActive(distributor, nowMs),
    coveredCount: recipients.length,
    affectedCount: recipients.filter((recipient) => recipient.addedRatePerSec > 1e-9).length,
    addedRatePerSec: recipients.reduce((total, recipient) => total + recipient.addedRatePerSec, 0),
    recipients
  };
}

function waveBonus(balance, allDefenses, waveNumber) {
  const installed = allDefenses.filter((defense) => defense.type === 'distributor').length;
  // The distributor contribution is independent of a wave's authored rewardBonus.
  // Use the production reward rule to preserve its cap and passive EMP behavior.
  const reward = (count) => getWaveReward(balance, { rewardBonus: 0 }, waveNumber, count).dharma;
  return {
    installed,
    totalDharma: reward(installed) - reward(0),
    marginalDharma: reward(installed) - reward(installed - 1),
    perDistributorDharma: balance.economy.distributorWaveBonus ?? 6,
    capDharma: balance.economy.distributorWaveBonusCap ?? 30
  };
}

function chainUnlockLevel(balance, type) {
  return Array.from({ length: balance.upgrades.maxLevel }, (_, index) => index + 1)
    .find((level) => getTowerStats(balance, type, level).chainTargets > 0) ?? null;
}

export function getSpecializationChoices(balance, type) {
  return Object.entries(balance.towers[type].specializations || {}).map(([id, branch]) => ({
    id, name: branch.name, description: branch.description,
    stats: describeTower(balance, type, 3, id)
  }));
}

/** A position-independent comparison for an unplaced tower. */
export function getTowerBlueprint(balance, type) {
  const current = describeTower(balance, type, 1);
  const next = balance.upgrades.maxLevel > 1 ? describeTower(balance, type, 2) : null;
  const firstWave = { rewardBonus: 0 };
  return {
    current,
    next,
    specializations: getSpecializationChoices(balance, type),
    buildCost: { ...balance.towers[type].cost },
    upgradeCost: next ? getUpgradeCost(balance, type, 1) : null,
    totalInvested: getTotalInvested(balance, type, 1),
    sellValue: getSellValue(balance, type, 1),
    refundPct: balance.economy.sellRefundPct ?? 0.7,
    chainUnlockLevel: chainUnlockLevel(balance, type),
    waveBonusDharma: type === 'distributor'
      ? getWaveReward(balance, firstWave, 1, 1).dharma -
        getWaveReward(balance, firstWave, 1, 0).dharma
      : 0,
    waveBonusCapDharma: type === 'distributor'
      ? balance.economy.distributorWaveBonusCap ?? 30
      : 0
  };
}

/** A display model based on the same stats, aura, and economy rules as combat. */
export function getTowerInspection(balance, defense, allDefenses, nowMs, waveNumber) {
  const defenses = Array.from(allDefenses);
  const current = {
    ...describeTower(balance, defense.type, defense.level, defense.specialization),
    effectiveRatePerSec: effectiveAttackRate(balance, defense, defenses, nowMs)
  };
  const choices = defense.level === 2 ? getSpecializationChoices(balance, defense.type) : [];
  const nextDefense = !choices.length && defense.level < balance.upgrades.maxLevel
    ? { ...defense, level: defense.level + 1 }
    : null;
  const nextDefenses = nextDefense
    ? defenses.map((candidate) => candidate.id === defense.id ? nextDefense : candidate)
    : null;
  const next = nextDefense
    ? {
        ...describeTower(balance, nextDefense.type, nextDefense.level, nextDefense.specialization),
        effectiveRatePerSec: effectiveAttackRate(balance, nextDefense, nextDefenses, nowMs)
      }
    : null;

  return {
    current,
    next,
    specializations: choices.map(choice => {
      const candidate = { ...defense, level: 3, specialization: choice.id };
      const candidates = defenses.map(tower => tower.id === defense.id ? candidate : tower);
      return { ...choice, stats: { ...choice.stats, effectiveRatePerSec: effectiveAttackRate(balance, candidate, candidates, nowMs) } };
    }),
    chosenSpecialization: balance.towers[defense.type].specializations?.[defense.specialization] || null,
    chainUnlockLevel: defense.specialization ? null : chainUnlockLevel(balance, defense.type),
    upgradeCost: nextDefense || choices.length ? getUpgradeCost(balance, defense.type, defense.level) : null,
    totalInvested: getTotalInvested(balance, defense.type, defense.level),
    sellValue: getSellValue(balance, defense.type, defense.level),
    refundPct: balance.economy.sellRefundPct ?? 0.7,
    support: defense.type === 'distributor'
      ? {
          current: supportEffect(balance, defense, defenses, nowMs),
          next: nextDefense ? supportEffect(balance, nextDefense, nextDefenses, nowMs) : null,
          waveBonus: waveBonus(balance, defenses, waveNumber)
        }
      : null
  };
}

function activeDamageTypes(balance) {
  return [...new Set(ACTIVE_TOWER_TYPES
    .map((type) => getTowerStats(balance, type))
    .filter((stats) => stats.damage > 0 && stats.ratePerSec > 0)
    .map((stats) => stats.damageType))];
}

/** Describe current threats from implemented combat rules. */
export function getEnemyInspection(balance, type) {
  const definition = getEnemyDefinition(balance, type);
  const resistances = Object.fromEntries(activeDamageTypes(balance).map((damageType) => [
    damageType,
    definition.resists?.[damageType] ?? 1
  ]));
  const ability = type === 'raidTeam'
    ? 'At health thresholds, calls reinforcements and emits EMP that briefly disables nearby towers.'
    : type === 'megaCorpTitan'
      ? 'Starts with a shield that regenerates after a pause without taking hits.'
      : null;
  const counterHint = type === 'raidTeam'
    ? 'Spread attackers so one EMP cannot pause every firing lane.'
    : type === 'megaCorpTitan'
      ? 'Keep damaging the Titan to delay shield recovery.'
      : definition.armor > 0
        ? 'Larger hits and vulnerability help overcome armor.'
        : Object.values(resistances).every((multiplier) => multiplier < 1)
          ? 'Sustained coverage and vulnerability help against broad resistance.'
          : 'Overlapping coverage and slow can keep this attacker in range longer.';

  return {
    id: type,
    name: definition.name,
    icon: definition.icon,
    kind: definition.kind,
    armor: definition.armor || 0,
    resistances,
    ability,
    counterHint
  };
}
