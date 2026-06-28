import { pointAtPathDistance } from '../core/world.js';

export function getEnemyDefinition(balance, type) {
  const regular = balance.enemies[type];
  if (regular) {
    return { id: type, kind: 'regular', ...regular };
  }
  const boss = balance.bosses[type];
  if (boss) {
    return { id: type, kind: 'boss', ...boss };
  }
  throw new Error(`Unknown enemy type: ${type}`);
}

export function createEnemy(
  definition,
  { id, hpMultiplier = 1, difficulty, spawnedAtMs = 0 }
) {
  const maxHealth = definition.baseHP * hpMultiplier * difficulty.hpMult;
  const position = pointAtPathDistance(0);
  const shieldMax =
    definition.id === 'megaCorpTitan' ? Math.round(maxHealth * 0.35) : 0;
  return {
    id,
    type: definition.id,
    kind: definition.kind,
    name: definition.name,
    x: position.x,
    y: position.y,
    radius: definition.size / 2,
    pathDistance: 0,
    health: maxHealth,
    maxHealth,
    speed: definition.moveSpeed * difficulty.speedMult,
    resolution: null,
    spawnedAtMs,
    slowPct: 0,
    slowUntilMs: 0,
    vulnerabilityPct: 0,
    vulnerabilityUntilMs: 0,
    phase: 0,
    firedPhases: [],
    empUntilMs: 0,
    shield: shieldMax,
    shieldMax,
    shieldCooldownUntilMs: 0,
    shieldRegenPerSec: shieldMax * 0.04
  };
}
