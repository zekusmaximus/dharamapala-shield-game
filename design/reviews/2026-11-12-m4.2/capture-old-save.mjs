// Capture actual 1.5.0/v4 Raid phase-two bytes from immutable M4.1 content.
// This fixture tests recovery, not a new-content outcome.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { GameSession } from '../../../js/core/GameSession.js';
import { createPolicy } from '../../../tools/balance/policies.mjs';

const balance = JSON.parse(execFileSync('git',
  ['show', '601c1ea:design/balance.json'], {encoding:'utf8'}));
assert.equal(balance.version, '1.5.0');
const session = new GameSession(balance);
assert.equal(session.newGame({difficulty:'Normal', seed:1337, tutorialCompleted:true}).ok, true);
const policy = createPolicy('existing');
for (let wave=1; wave<=5; wave++) {
  policy.build(session);
  assert.equal(session.startWave().ok, true);
  let steps=0;
  while (session.state.phase === 'WAVE' && steps++ < 120000) {
    session.step(1000/60);
    if (wave===5 && [...session.state.enemies.values()].some(enemy =>
      enemy.type==='raidTeam' && enemy.firedPhases.length===2)) break;
  }
  if (wave<5) assert.equal(session.state.phase, 'BUILDING');
}
assert.equal(session.state.phase, 'WAVE');
assert.equal(session.pause().ok, true);
const snapshot = session.toSnapshot();
assert.equal(snapshot.schemaVersion, 4);
assert.equal(snapshot.state.schemaVersion, 4);
snapshot.savedAt = '2026-11-12T12:00:00.000Z';
const bytes = JSON.stringify(snapshot,null,2)+'\n';
writeFileSync(process.argv[2] || new URL('old-1.5.0-v4-save.json',import.meta.url),bytes);
assert.deepEqual(GameSession.fromSnapshot(balance,JSON.parse(bytes)).toSnapshot().state,snapshot.state);
