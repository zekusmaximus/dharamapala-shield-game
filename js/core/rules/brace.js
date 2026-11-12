// One-use self shield. Absolute simulated deadlines persist through pause/reload.
export function bracePhase(brace, nowMs) {
  if (!brace) return null;
  return nowMs < brace.activatesAtMs ? 'warning' : nowMs < brace.expiresAtMs ? 'active' : 'spent';
}

export function updateBrace(enemy, nowMs) {
  if (!enemy.brace || enemy.resolution) return;
  const phase = bracePhase(enemy.brace, nowMs);
  if (phase === 'active' && !enemy.brace.activated) {
    enemy.shield = enemy.shieldMax;
    enemy.brace.activated = true;
  } else if (phase === 'spent') {
    enemy.shield = 0;
    enemy.brace.activated = true;
  }
}

export function braceDescription(definition) {
  const b = definition.brace;
  return b ? `Shield brace: warns for ${b.windupMs / 1000} s after spawning, then gains a one-use self shield worth ${Math.round(b.healthRatio * 100)}% of maximum health for ${b.durationMs / 1000} s. Remaining shield expires; no regeneration. Damage overflows to health; slow and vulnerability still apply. Kill before activation, break it with sustained damage, or cover the route after expiry.` : null;
}
