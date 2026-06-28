const RESOURCE_KEYS = Object.freeze(['dharma', 'bandwidth', 'anonymity']);

export function createStartingResources(balance) {
  return {
    dharma: balance.economy.startCash,
    bandwidth: balance.economy.startBandwidth,
    anonymity: balance.economy.startAnonymity
  };
}

export function normalizeResources(resources = {}) {
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [key, Math.max(0, Number(resources[key]) || 0)])
  );
}

export function canAfford(resources, cost) {
  return RESOURCE_KEYS.every((key) => resources[key] >= (cost[key] || 0));
}

export function subtractCost(resources, cost) {
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [key, resources[key] - (cost[key] || 0)])
  );
}

export function addResources(resources, reward, multiplier = 1) {
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [
      key,
      resources[key] + Math.round((reward[key] || 0) * multiplier)
    ])
  );
}

export function getUpgradeCost(balance, towerType, currentLevel) {
  const definition = balance.towers[towerType];
  const multiplier = balance.upgrades.costMultiplierPerLevel ** currentLevel;
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [
      key,
      Math.round((definition.cost[key] || 0) * multiplier)
    ])
  );
}

export function getTotalInvested(balance, towerType, level) {
  let total = normalizeResources(balance.towers[towerType].cost);
  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    total = addResources(total, getUpgradeCost(balance, towerType, currentLevel));
  }
  return total;
}

export function getSellValue(balance, towerType, level) {
  const invested = getTotalInvested(balance, towerType, level);
  const refundRate = balance.economy.sellRefundPct ?? 0.7;
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [key, Math.floor(invested[key] * refundRate)])
  );
}

export function getKillReward(balance, definition, difficultyName) {
  const difficulty = balance.difficulty[difficultyName];
  return Object.fromEntries(
    RESOURCE_KEYS.map((key) => [
      key,
      Math.round(
        (definition.bounty[key] || 0) *
          balance.economy.killIncomeMult *
          difficulty.bountyMult
      )
    ])
  );
}

export function getWaveReward(balance, waveDefinition, waveNumber, distributors) {
  const base =
    balance.economy.waveClearBonus +
    balance.economy.waveClearBonusPerWave * waveNumber +
    (waveDefinition.rewardBonus || 0);
  const perDistributor = balance.economy.distributorWaveBonus ?? 6;
  const distributorCap = balance.economy.distributorWaveBonusCap ?? 30;
  return {
    dharma:
      base + Math.min(distributorCap, Math.max(0, distributors) * perDistributor),
    bandwidth: Math.round(base * 0.3),
    anonymity: Math.round(base * 0.2)
  };
}

export { RESOURCE_KEYS };
