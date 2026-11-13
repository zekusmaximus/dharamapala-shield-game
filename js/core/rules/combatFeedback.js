import { bracePhase } from './brace.js';
// Presentation derives from combat state; no timers or mutations.
export function raidReinforcementSummary(balance) {
  return balance.bosses.raidTeam.abilities.reinforcements.byPhase.map((types) => {
    const counts = new Map();
    for (const type of types) counts.set(type, (counts.get(type) || 0) + 1);
    return [...counts].map(([type, count]) =>
      `${count} ${balance.enemies[type].name}${count === 1 ? '' : 's'}`).join(' and ');
  });
}

export function getEmpWarning(balance) {
  const { emp } = balance.bosses.raidTeam.abilities;
  const thresholds = emp.thresholds.map((threshold) => `${Math.round(threshold * 100)}%`).join(' and ');
  const groups = raidReinforcementSummary(balance);
  const reinforcements = groups.map((group, index) =>
    `${Math.round(emp.thresholds[index] * 100)}% calls ${group}`).join('; ');
  const spacing = balance.bosses.raidTeam.abilities.reinforcements.intervalMs / 1000;
  return `EMP warning: ${emp.thresholds.length === 1 ? 'one burst' : 'bursts'} immediately at ${thresholds} health, disabling towers within ${emp.radius} units for ${emp.durationMs / 1000} s. ${reinforcements}, spaced ${spacing} s apart. No timed wind-up.`;
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
      ? emp.thresholds.length === 1 ? 'Disruption boss'
        : `Phase ${enemy.phase + 1} / ${emp.thresholds.length + 1}`
      : enemy.type === 'megaCorpTitan' ? 'Shield boss · no health-triggered phases' : null,
    shieldRecovery: enemy.type !== 'megaCorpTitan' || enemy.shield >= enemy.shieldMax ? null
      : enemy.shieldCooldownUntilMs > nowMs
        ? `Shield recovery in ${((enemy.shieldCooldownUntilMs - nowMs) / 1000).toFixed(1)} s without hits`
        : `Shield regenerating at ${Math.round(balance.bosses.megaCorpTitan.abilities.shield.regenRatioPerSec * 100)}% of capacity per second until hit`
  };
}

export function disabledFeedback(defense, nowMs) {
  return defense.disabledUntilMs > nowMs
    ? `× EMP disabled: ${((defense.disabledUntilMs - nowMs) / 1000).toFixed(1)} s remaining; ${defense.type === 'distributor' ? 'aura paused, passive income retained' : 'cannot fire'}`
    : null;
}
