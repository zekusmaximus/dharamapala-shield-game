import test from 'node:test';
import assert from 'node:assert/strict';
import { GameSession } from '../../js/core/GameSession.js';
import { getTowerStats } from '../../js/core/rules/towers.js';
import { compileSpawnSchedule } from '../../js/core/rules/waves.js';
import { loadBalance as loadTestBalance } from '../helpers/loadBalance.js';
import {
  loadBalance as loadSimulatorBalance,
  simulateCampaign
} from '../../tools/sim/run.mjs';

test('runtime and simulator consume the same balance and pure rules', async () => {
  const runtimeBalance = await loadTestBalance();
  const simulatorBalance = await loadSimulatorBalance();
  assert.deepEqual(simulatorBalance, runtimeBalance);
  assert.deepEqual(
    getTowerStats(simulatorBalance, 'firewall', 3),
    getTowerStats(runtimeBalance, 'firewall', 3)
  );
  assert.deepEqual(
    compileSpawnSchedule(simulatorBalance, 5),
    compileSpawnSchedule(runtimeBalance, 5)
  );
  assert.ok(new GameSession(simulatorBalance));
});

test('headless policy executes the real GameSession deterministically', async () => {
  const first = await simulateCampaign({
    difficulty: 'Normal',
    seed: 1337,
    finalWave: 5
  });
  const second = await simulateCampaign({
    difficulty: 'Normal',
    seed: 1337,
    finalWave: 5
  });
  assert.deepEqual(first, second);
  assert.equal(first.statistics.wavesCompleted, 5);
  assert.ok(['BUILDING', 'VICTORY'].includes(first.phase));
});
