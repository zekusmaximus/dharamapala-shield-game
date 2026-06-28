import { ACTIVE_TOWER_TYPES, PHASES } from '../commands.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function finite(value) {
  return Number.isFinite(value);
}

export function validateBalance(balance) {
  assert(balance && typeof balance === 'object', 'Balance data must be an object');
  assert(typeof balance.version === 'string', 'Balance version is required');
  for (const type of ACTIVE_TOWER_TYPES) {
    const tower = balance.towers?.[type];
    assert(tower, `Missing active tower: ${type}`);
    assert(finite(tower.cost?.dharma), `${type} has an invalid cost`);
    assert(finite(tower.range) && tower.range > 0, `${type} has an invalid range`);
  }
  assert(Array.isArray(balance.waves) && balance.waves.length > 0, 'Waves are required');
  for (const wave of balance.waves) {
    assert(Number.isInteger(wave.wave), 'Wave number must be an integer');
    for (const group of wave.enemies || []) {
      assert(
        balance.enemies?.[group.id] || balance.bosses?.[group.id],
        `Wave ${wave.wave} references unknown enemy ${group.id}`
      );
      assert(Number.isInteger(group.count) && group.count > 0, 'Enemy count is invalid');
      assert(finite(group.interval) && group.interval >= 0, 'Spawn interval is invalid');
    }
  }
  return balance;
}

export function validateSnapshot(snapshot, balance) {
  assert(snapshot && typeof snapshot === 'object', 'Save is not an object');
  assert(snapshot.schemaVersion === 2, 'Unsupported save schema');
  assert(snapshot.balanceVersion === balance.version, 'Save uses another balance version');
  assert(Object.values(PHASES).includes(snapshot.state?.phase), 'Save phase is invalid');
  assert(finite(snapshot.state?.gameTimeMs), 'Save game time is invalid');
  assert(Number.isInteger(snapshot.state?.waveNumber), 'Save wave number is invalid');
  assert(Array.isArray(snapshot.state?.defenses), 'Save defenses are invalid');
  assert(Array.isArray(snapshot.state?.enemies), 'Save enemies are invalid');
  assert(Array.isArray(snapshot.state?.projectiles), 'Save projectiles are invalid');

  const ids = new Set();
  for (const defense of snapshot.state.defenses) {
    assert(balance.towers[defense.type], `Save contains unknown tower ${defense.type}`);
    assert(!ids.has(defense.id), `Save contains duplicate id ${defense.id}`);
    ids.add(defense.id);
  }
  for (const enemy of snapshot.state.enemies) {
    assert(
      balance.enemies[enemy.type] || balance.bosses[enemy.type],
      `Save contains unknown enemy ${enemy.type}`
    );
    assert(!ids.has(enemy.id), `Save contains duplicate id ${enemy.id}`);
    ids.add(enemy.id);
  }
  for (const value of Object.values(snapshot.state.resources || {})) {
    assert(finite(value) && value >= 0, 'Save resources are invalid');
  }
  return snapshot;
}
