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

  return {
    damage,
    range,
    ratePerSec,
    cooldownMs: ratePerSec > 0 ? 1000 / ratePerSec : Number.POSITIVE_INFINITY,
    projectileSpeed: definition.projectileSpeed || 0,
    aoeRadius: definition.aoeRadius || 0,
    critChance: definition.critChance || 0,
    critMult: definition.critMult || 1,
    slowPct: Math.min(0.65, (status.slowPct || 0) + upgradeIndex * 0.04),
    slowDurationMs: (status.slowDuration || 0) * (1 + upgradeIndex * 0.15),
    vulnerabilityPct: Math.min(
      0.5,
      (status.vulnerabilityPct || 0) + upgradeIndex * 0.03
    ),
    vulnerabilityDurationMs:
      (status.vulnerabilityDuration || status.slowDuration || 0) *
      (1 + upgradeIndex * 0.15),
    chainTargets: towerType === 'encryption' && level >= 4 ? 1 : 0,
    auraFireRatePct:
      towerType === 'distributor'
        ? Math.min(0.35, (definition.support?.fireRatePct || 0.12) + upgradeIndex * 0.04)
        : 0,
    role: ROLE_BY_TYPE[towerType],
    damageType: definition.damageType || 'physical'
  };
}

export function getAuraMultiplier(balance, tower, allTowers) {
  if (tower.type === 'distributor') {
    return 1;
  }
  const cap = balance.economy.distributorAuraCap ?? 0.35;
  let bonus = 0;
  for (const candidate of allTowers) {
    if (candidate.type !== 'distributor' || candidate.id === tower.id) {
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
