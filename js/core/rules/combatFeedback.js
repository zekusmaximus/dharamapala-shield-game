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
