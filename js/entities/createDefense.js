export function createDefense(type, position, id) {
  return {
    id,
    type,
    x: position.x,
    y: position.y,
    radius: 20,
    level: 1,
    cooldownMs: 0,
    disabledUntilMs: 0,
    totalDamage: 0,
    kills: 0
  };
}
