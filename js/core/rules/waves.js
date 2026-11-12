export function getWaveDefinition(balance, waveNumber) {
  return balance.waves.find((wave) => wave.wave === waveNumber) || null;
}

// An offset is absolute simulated milliseconds after deliberate Start Wave.
// Without one, retain the legacy next-group start (including its trailing interval).
function groupWindows(wave) {
  let nextStartMs = 0;
  return wave.enemies.map(group => {
    const startMs = group.offsetMs ?? nextStartMs;
    const endMs = startMs + (group.count - 1) * group.interval;
    nextStartMs = startMs + group.count * group.interval;
    return { group, startMs, endMs };
  });
}

export function compileSpawnSchedule(balance, waveNumber) {
  const wave = getWaveDefinition(balance, waveNumber);
  if (!wave) throw new Error(`Unknown wave: ${waveNumber}`);
  const events = groupWindows(wave).flatMap(({ group, startMs }) =>
    Array.from({ length: group.count }, (_, index) => ({
      dueAtMs: startMs + index * group.interval,
      enemyType: group.id,
      hpMultiplier: group.hpMult,
      dynamic: false
    }))
  );
  // Stable ties follow authored group/index order; order is chronological and
  // contiguous so scheduler snapshots and dynamic insertions share one contract.
  return events.sort((a, b) => a.dueAtMs - b.dueAtMs)
    .map((event, order) => ({ ...event, order }));
}

export function getWavePreview(balance, waveNumber) {
  const definition = getWaveDefinition(balance, waveNumber);
  if (!definition) return null;
  const enemies = new Map();
  for (const { group, startMs, endMs } of groupWindows(definition)) {
    const enemy = balance.enemies[group.id] || balance.bosses[group.id];
    if (!enemies.has(group.id)) enemies.set(group.id, {
      id: group.id, name: enemy.name, icon: enemy.icon, count: 0, windows: []
    });
    const entry = enemies.get(group.id);
    entry.count += group.count;
    entry.windows.push({ startMs, endMs, intervalMs: group.interval, count: group.count });
  }
  const schedule = compileSpawnSchedule(balance, waveNumber);
  const gaps = [];
  for (let i = 1; i < schedule.length; i++) {
    if (schedule[i].dueAtMs - schedule[i - 1].dueAtMs >= 2000) {
      gaps.push({ startMs: schedule[i - 1].dueAtMs, endMs: schedule[i].dueAtMs });
    }
  }
  return {
    wave: waveNumber,
    isBossWave: definition.enemies.some(group => Boolean(balance.bosses[group.id])),
    enemies: [...enemies.values()],
    gaps
  };
}
