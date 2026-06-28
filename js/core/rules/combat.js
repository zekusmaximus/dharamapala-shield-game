export function getEffectiveDamage(rawDamage, definition, damageType = 'physical') {
  const resistanceMultiplier = definition.resists?.[damageType] ?? 1;
  return Math.max(1, rawDamage * resistanceMultiplier - (definition.armor || 0));
}

export function rollDamage(stats, randomValue) {
  const critical = randomValue < stats.critChance;
  return {
    amount: stats.damage * (critical ? stats.critMult : 1),
    critical
  };
}

export function applyVulnerability(damage, vulnerabilityPct = 0) {
  return damage * (1 + Math.max(0, vulnerabilityPct));
}

export function circlesIntersect(first, second) {
  const radius = first.radius + second.radius;
  return (first.x - second.x) ** 2 + (first.y - second.y) ** 2 <= radius ** 2;
}

export function getLeakDamage(balance, definition, difficultyName) {
  const base = definition.leakDamage || (definition.kind === 'boss' ? 5 : 1);
  return Math.max(
    1,
    Math.round(base * balance.difficulty[difficultyName].damageToPlayerMult)
  );
}
