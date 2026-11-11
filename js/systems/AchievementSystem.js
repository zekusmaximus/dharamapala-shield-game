import { PHASES } from '../core/commands.js';

export class AchievementSystem {
  onEnemyKilled(session, enemy) {
    if (session.state.phase !== PHASES.WAVE) return;
    if (session.state.statistics.kills === 1) {
      session.events.emit('achievement', {
        id: 'first-defense',
        title: 'First Defense'
      });
    }
    if (session.state.phase !== PHASES.WAVE) return;
    if (enemy.kind === 'boss' && session.state.statistics.bossesKilled === 1) {
      session.events.emit('achievement', {
        id: 'boss-breaker',
        title: 'Boss Breaker'
      });
    }
  }
}
