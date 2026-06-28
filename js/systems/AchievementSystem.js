export class AchievementSystem {
  onEnemyKilled(session, enemy) {
    if (session.state.statistics.kills === 1) {
      session.events.emit('achievement', {
        id: 'first-defense',
        title: 'First Defense'
      });
    }
    if (enemy.kind === 'boss' && session.state.statistics.bossesKilled === 1) {
      session.events.emit('achievement', {
        id: 'boss-breaker',
        title: 'Boss Breaker'
      });
    }
  }
}
