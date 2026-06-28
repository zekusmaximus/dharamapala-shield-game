export const PHASES = Object.freeze({
  LOADING: 'LOADING',
  MENU: 'MENU',
  TUTORIAL: 'TUTORIAL',
  BUILDING: 'BUILDING',
  WAVE: 'WAVE',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
});

export const ENEMY_OUTCOMES = Object.freeze({
  KILLED: 'KILLED',
  LEAKED: 'LEAKED'
});

export const TERMINAL_PHASES = new Set([PHASES.GAME_OVER, PHASES.VICTORY]);
export const ACTIVE_TOWER_TYPES = Object.freeze([
  'firewall',
  'encryption',
  'distributor'
]);
export const DEFERRED_TOWER_TYPES = new Set(['decoy', 'mirror', 'anonymity']);

export function commandResult(ok, code, details = {}) {
  return Object.freeze({ ok, code, ...details });
}
