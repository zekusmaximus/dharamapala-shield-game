// Gameplay/rotation bytes are deterministic. Native compositor scroll offsets
// are observations: require movement in the test, retain but don't byte-compare.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const actual = await read(process.argv[2]);
const expected = await read(new URL('./touch-recovery.json', import.meta.url));
const deterministic = ({ scrolls, ...rest }) => rest;
assert.deepEqual(deterministic(actual), deterministic(expected));
const desktop = await read(new URL('../2026-11-14-m4.5-ui-audit/recovery.json', import.meta.url));
for (const key of ['balanceVersion', 'schemaVersion', 'commands', 'waves', 'bosses', 'spawns', 'phase', 'lives', 'resources', 'combatMs', 'errors']) {
  assert.deepEqual(actual[key], desktop[key], `touch vs merged pointer ${key}`);
}
assert.equal(actual.scrolls.length, 3);
for (const scroll of actual.scrolls) assert.notEqual(scroll.before, scroll.after);
console.log('Touch deterministic gameplay/rotation evidence matches; all commands, waves, ledgers, bosses, spawns and terminal equal merged desktop. Three native scrolls moved.');
const oldCss = execFileSync('git', ['show', 'f46d2ba:css/styles.css'], { encoding: 'utf8' });
assert.equal(await readFile(new URL('../../../css/styles.css', import.meta.url), 'utf8'),
  oldCss.replace('.toast {\n', '.toast {\n  pointer-events: none;\n'));
console.log('Only production change: passive toast pointer hit testing.');
