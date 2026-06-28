export function createProjectile({
  id,
  source,
  targetId,
  stats,
  damage,
  critical,
  nowMs
}) {
  return {
    id,
    sourceId: source.id,
    sourceType: source.type,
    targetId,
    x: source.x,
    y: source.y,
    radius: 5,
    speed: stats.projectileSpeed,
    damage,
    damageType: stats.damageType,
    critical,
    aoeRadius: stats.aoeRadius,
    piercing: false,
    hitIds: [],
    slowPct: stats.slowPct,
    slowDurationMs: stats.slowDurationMs,
    vulnerabilityPct: stats.vulnerabilityPct,
    vulnerabilityDurationMs: stats.vulnerabilityDurationMs,
    chainTargets: stats.chainTargets,
    createdAtMs: nowMs,
    expiresAtMs: nowMs + 5000
  };
}
