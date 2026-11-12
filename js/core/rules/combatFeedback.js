import { bracePhase } from './brace.js';
// Presentation derives from combat state; no timers or mutations.
export function getEmpWarning(balance) {
  const { emp } = balance.bosses.raidTeam.abilities;
  const thresholds = emp.thresholds.map((threshold) => `${Math.round(threshold * 100)}%`).join(' and ');
  return `EMP warning: bursts immediately at ${thresholds} health, disabling towers within ${emp.radius} units for ${emp.durationMs / 1000} s and calling reinforcements. No timed wind-up.`;
}

export function enemyCombatFeedback(balance, enemy, nowMs) {
  const { emp } = balance.bosses.raidTeam.abilities;
  const statuses = [];
  if (enemy.slowUntilMs > nowMs && enemy.slowPct > 0) {
    statuses.push({ marker: '↓', text: `Slow: ${Math.round(Math.min(balance.combat.status.slowSpeedCap, enemy.slowPct) * 100)}% less speed` });
  }
  if (enemy.vulnerabilityUntilMs > nowMs && enemy.vulnerabilityPct > 0) {
    statuses.push({ marker: '◇', text: `Vulnerable: +${Math.round(enemy.vulnerabilityPct * 100)}% damage before resistance/armor` });
  }
  const nextPhase = enemy.type === 'raidTeam'
    ? emp.thresholds.findIndex((_, index) => !enemy.firedPhases.includes(index + 1))
    : -1;
  return {
    statuses,
    brace: !enemy.brace ? null : (() => {
      const phase = bracePhase(enemy.brace, nowMs);
      return phase === 'warning'
        ? { marker: 'BRACE IN', glyph: '!', text: `Shield brace in ${Math.max(0, (enemy.brace.activatesAtMs-nowMs)/1000).toFixed(1)} s; self shield ${enemy.shieldMax}; damage now or cover after expiry` }
        : phase === 'active'
          ? { marker: enemy.shield > 0 ? 'BRACE' : 'BROKEN', glyph: enemy.shield > 0 ? 'S' : '×', text: `Shield brace ${Math.ceil(enemy.shield)} / ${enemy.shieldMax}; expires in ${Math.max(0, (enemy.brace.expiresAtMs-nowMs)/1000).toFixed(1)} s; no refill; statuses still apply` }
          : { marker: 'SPENT', glyph: '✓', text: 'Shield brace spent; no regeneration' };
    })(),
    nextEmp: nextPhase < 0 ? null : emp.thresholds[nextPhase],
    phase: enemy.type === 'raidTeam'
      ? `Phase ${enemy.phase + 1} / ${emp.thresholds.length + 1}`
      : enemy.type === 'megaCorpTitan' ? 'Shield boss · no health-triggered phases' : null
  };
}

export function disabledFeedback(defense, nowMs) {
  return defense.disabledUntilMs > nowMs
    ? `× EMP disabled: ${((defense.disabledUntilMs - nowMs) / 1000).toFixed(1)} s remaining; ${defense.type === 'distributor' ? 'aura paused, passive income retained' : 'cannot fire'}`
    : null;
}
