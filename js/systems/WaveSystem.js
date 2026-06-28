export class WaveSystem {
  update(session) {
    if (
      session.scheduler.complete &&
      session.state.enemies.size === 0 &&
      session.state.projectiles.size === 0
    ) {
      session.completeWave();
    }
  }
}
