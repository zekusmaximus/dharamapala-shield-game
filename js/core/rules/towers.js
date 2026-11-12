const ROLE_BY_TYPE = Object.freeze({
  firewall: 'Damage',
  encryption: 'Control',
  distributor: 'Support / economy'
});

export function getTowerStats(balance, towerType, level = 1) {
  const definition = balance.towers[towerType];
  if (!definition) {
    throw new Error(`Unknown tower type: ${towerType}`);
  }
  const upgradeIndex = Math.max(0, level - 1);
  const damage = definition.baseDamage * (1 + balance.upgrades.damagePerLevel * upgradeIndex);
  const range = definition.range * (1 + balance.upgrades.rangePerLevel * upgradeIndex);
  const ratePerSec =
    definition.ratePerSec * (1 + balance.upgrades.fireRatePerLevel * upgradeIndex);
  const status = definition.status || {};
  const tuning = balance.combat.status;
  const slowDurationMs = (status.slowDuration || 0) * (1 + upgradeIndex * tuning.durationPerLevel);
  const vulnerabilityDurationMs =
    (status.vulnerabilityDuration ?? status.slowDuration ?? 0) *
    (1 + upgradeIndex * tuning.durationPerLevel);

  return {
    damage,
    range,
    ratePerSec,
    cooldownMs: ratePerSec > 0 ? 1000 / ratePerSec : Number.POSITIVE_INFINITY,
    projectileSpeed: definition.projectileSpeed || 0,
    aoeRadius: definition.aoeRadius || 0,
    critChance: definition.critChance || 0,
    critMult: definition.critMult || 1,
    slowPct: slowDurationMs > 0
      ? Math.min(tuning.slowTowerCap, (status.slowPct || 0) + upgradeIndex * tuning.slowPctPerLevel)
      : 0,
    slowDurationMs,
    vulnerabilityPct: vulnerabilityDurationMs > 0
      ? Math.min(tuning.vulnerabilityTowerCap, (status.vulnerabilityPct || 0) + upgradeIndex * tuning.vulnerabilityPctPerLevel)
      : 0,
    vulnerabilityDurationMs,
    chainTargets: towerType === 'encryption' && level >= balance.combat.chain.unlockLevel
      ? balance.combat.chain.targets : 0,
    auraFireRatePct:
      towerType === 'distributor'
        ? Math.min(balance.economy.distributorAuraCap,
          definition.support.fireRatePct + upgradeIndex * definition.support.fireRatePctPerLevel)
        : 0,
    role: ROLE_BY_TYPE[towerType],
    damageType: definition.damageType || 'physical'
  };
}

export function getAuraMultiplier(balance, tower, allTowers, nowMs = 0) {
  if (tower.type === 'distributor') {
    return 1;
  }
  // EMP suppresses this active aura until its expiry. Distributor ownership still
  // grants the separate passive wave-clear income in GameSession.completeWave.
  const cap = balance.economy.distributorAuraCap ?? 0.35;
  let bonus = 0;
  for (const candidate of allTowers) {
    if (
      candidate.type !== 'distributor' ||
      candidate.id === tower.id ||
      candidate.disabledUntilMs > nowMs
    ) {
      continue;
    }
    const stats = getTowerStats(balance, candidate.type, candidate.level);
    const distance = Math.hypot(candidate.x - tower.x, candidate.y - tower.y);
    if (distance <= stats.range) {
      bonus += stats.auraFireRatePct;
    }
  }
  return 1 + Math.min(cap, bonus);
}

export function describeTower(balance, towerType, level = 1) {
  const definition = balance.towers[towerType];
  return {
    type: towerType,
    name: definition.name,
    description: definition.description,
    icon: definition.icon,
    color: definition.color,
    level,
    ...getTowerStats(balance, towerType, level)
  };
}
