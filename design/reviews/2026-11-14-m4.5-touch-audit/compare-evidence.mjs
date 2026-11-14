// Gameplay is exact. Native compositor scroll offsets are observations. Browser
// RAF alignment can sample a checkpoint one fixed tick earlier/later; each run
// still compares its complete paused snapshot to its own reload/Continue bytes.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const actual = await read(process.argv[2]);
const expected = await read(new URL('./touch-recovery.json', import.meta.url));
const sampled = [];
function deterministic({ scrolls, checkpoints, rotations, ...rest }) {
  const time = ms => { sampled.push(ms); return null; };
  return { ...rest,
    checkpoints: checkpoints.map(({ combatMs, ...checkpoint }) => ({ ...checkpoint, combatMs: time(combatMs) })),
    rotations: rotations.map(({ combatMsBefore, views, ...rotation }) => ({ ...rotation,
      combatMsBefore: time(combatMsBefore), views: views.map(({ combatMs, ...view }) => ({ ...view, combatMs: time(combatMs) })) })) };
}
assert.deepEqual(deterministic(actual), deterministic(expected));
const half = sampled.length / 2;
for (let i = 0; i < half; i++) assert.ok(Math.abs(sampled[i] - sampled[i + half]) <= 1000 / 60 + 1e-6,
  `observed checkpoint ${i} differs by more than one production fixed tick`);
const desktop = await read(new URL('../2026-11-14-m4.5-ui-audit/recovery.json', import.meta.url));
for (const key of ['balanceVersion', 'schemaVersion', 'commands', 'waves', 'bosses', 'spawns', 'phase', 'lives', 'resources', 'combatMs', 'errors']) {
  assert.deepEqual(actual[key], desktop[key], `touch vs merged pointer ${key}`);
}
assert.equal(actual.scrolls.length, 3);
for (const scroll of actual.scrolls) assert.notEqual(scroll.before, scroll.after);
console.log('Touch gameplay matches exactly; sampled checkpoint times within one fixed tick. All commands, waves, ledgers, bosses, spawns and terminal equal merged desktop. Three native scrolls moved.');
const oldCss = execFileSync('git', ['show', 'f46d2ba:css/styles.css'], { encoding: 'utf8' });
assert.equal(await readFile(new URL('../../../css/styles.css', import.meta.url), 'utf8'),
  oldCss.replace('.toast {\n', '.toast {\n  pointer-events: none;\n'));
console.log('Only production change: passive toast pointer hit testing.');
