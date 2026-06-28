export function getWaveDefinition(balance, waveNumber) {
  return balance.waves.find((wave) => wave.wave === waveNumber) || null;
}

export function compileSpawnSchedule(balance, waveNumber) {
  const wave = getWaveDefinition(balance, waveNumber);
  if (!wave) {
    throw new Error(`Unknown wave: ${waveNumber}`);
  }
  const events = [];
  let dueAtMs = 0;
  let order = 0;

  for (const group of wave.enemies) {
    const interval = Math.max(0, Number(group.interval) || 0);
    for (let index = 0; index < group.count; index += 1) {
      events.push({
        dueAtMs,
        enemyType: group.id,
        hpMultiplier: group.hpMult || 1,
        dynamic: false,
        order
      });
      order += 1;
      dueAtMs += interval;
    }
  }
  return events;
}

export function getWavePreview(balance, waveNumber) {
  const definition = getWaveDefinition(balance, waveNumber);
  if (!definition) {
    return null;
  }
  return {
    wave: waveNumber,
    isBossWave: definition.enemies.some((group) => Boolean(balance.bosses[group.id])),
    enemies: definition.enemies.map((group) => {
      const enemy = balance.enemies[group.id] || balance.bosses[group.id];
      return {
        id: group.id,
        name: enemy.name,
        icon: enemy.icon,
        count: group.count,
        ability: enemy.description
      };
    })
  };
}
