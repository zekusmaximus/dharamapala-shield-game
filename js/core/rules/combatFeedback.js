// Presentation derives from combat state; no timers or mutations.
import { RAID_EMP } from './combat.js';
export const EMP_WARNING = 'EMP warning: bursts immediately at 66% and 33% health, disabling towers within 260 units for 1.5 s and calling reinforcements. No timed wind-up.';

export function enemyCombatFeedback(enemy, nowMs) {
  const statuses = [];
  if (enemy.slowUntilMs > nowMs && enemy.slowPct > 0) {
    statuses.push({ marker: '↓', text: `Slow: ${Math.round(Math.min(0.8, enemy.slowPct) * 100)}% less speed` });
  }
  if (enemy.vulnerabilityUntilMs > nowMs && enemy.vulnerabilityPct > 0) {
    statuses.push({ marker: '◇', text: `Vulnerable: +${Math.round(enemy.vulnerabilityPct * 100)}% damage before resistance/armor` });
  }
  const nextPhase = enemy.type === 'raidTeam'
    ? RAID_EMP.thresholds.findIndex((_, index) => !enemy.firedPhases.includes(index + 1))
    : -1;
  return {
    statuses,
    nextEmp: nextPhase < 0 ? null : RAID_EMP.thresholds[nextPhase],
    phase: enemy.type === 'raidTeam'
      ? `Phase ${enemy.phase + 1} / 3`
      : enemy.type === 'megaCorpTitan' ? 'Shield boss · no health-triggered phases' : null
  };
}

export function disabledFeedback(defense, nowMs) {
  return defense.disabledUntilMs > nowMs
    ? `× EMP disabled: ${((defense.disabledUntilMs - nowMs) / 1000).toFixed(1)} s remaining; ${defense.type === 'distributor' ? 'aura paused, passive income retained' : 'cannot fire'}`
    : null;
}
