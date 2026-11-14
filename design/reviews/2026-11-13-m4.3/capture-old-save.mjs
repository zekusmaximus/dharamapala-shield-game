// Preserve real 1.6.0/v4 mid-wave bytes before the M4.3 difficulty change.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { GameSession } from '../../../js/core/GameSession.js';
import { createPolicy } from '../../../tools/balance/policies.mjs';
import { runWave } from '../../../tools/sim/run.mjs';

const balance = JSON.parse(await readFile(new URL('baseline-1.6.0.json', import.meta.url)));
const session = new GameSession(balance);
assert.equal(session.newGame({ difficulty: 'Hard', seed: 1337, tutorialCompleted: true }).ok, true);
const policy = createPolicy('existing');
for (let wave = 1; wave <= 10; wave++) {
  policy.build(session);
  runWave(session);
  assert.equal(session.state.phase, 'BUILDING');
  assert.equal(session.state.waveNumber, wave + 1);
}
policy.build(session);
assert.equal(session.startWave().ok, true);
let steps = 0;
while (session.state.phase === 'WAVE' &&
  ![...session.state.enemies.values()].some(enemy => enemy.type === 'quantumHacker') &&
  steps++ < 120000) session.step(1000 / 60);
assert.equal(session.state.phase, 'WAVE');
assert.ok([...session.state.enemies.values()].some(enemy => enemy.type === 'quantumHacker'));
assert.equal(session.pause().ok, true);
const snapshot = session.toSnapshot();
snapshot.savedAt = '2026-11-13T12:00:00.000Z';
assert.equal(snapshot.balanceVersion, '1.6.0');
assert.equal(snapshot.schemaVersion, 4);
assert.equal(GameSession.fromSnapshot(balance, snapshot).state.phase, 'PAUSED');
assert.ok(process.argv[2], 'Usage: capture-old-save.mjs output.json');
await writeFile(resolve(process.argv[2]), JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Captured earned Hard wave 11 after ${steps} production steps.`);
