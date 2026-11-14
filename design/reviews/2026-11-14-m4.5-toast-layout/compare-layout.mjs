// Bounds/scroll positions and wall time are observations; gameplay stays exact.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const actual = await read(process.argv[2]);
const expected = await read(new URL('../2026-11-14-m4.5-ui-audit/recovery.json', import.meta.url));
assert.deepEqual(actual.commands, expected.commands.filter(c => c.wave === 1));
assert.deepEqual(actual.wave, expected.waves[0]);
assert.deepEqual(actual.errors, []);
assert.deepEqual(actual.lifetime.map(e => e.visible), [true, false]);
assert.equal(actual.lifetime[1].now - actual.lifetime[0].now, 3200);
assert.equal(actual.scrolls.length, 1);
assert.notEqual(actual.scrolls[0].before, actual.scrolls[0].after);
assert.ok(actual.views.length >= 3);
for (const view of actual.views) {
  assert.equal(view.text, 'Wave 1 held: 8 defeated, 0 leaked.');
  assert.equal(view.pointerEvents, 'none');
  assert.equal(view.overflow, false);
  const t = view.toast, v = view.viewport;
  assert.ok(t.x >= 0 && t.y >= 0 && t.x + t.width <= v.width && t.y + t.height <= v.height);
  for (const c of view.controls) {
    assert.ok(c.height >= 44 && c.x >= 0 && c.y >= 0 && c.x + c.width <= v.width && c.y + c.height <= v.height);
    assert.ok(t.x + t.width <= c.x || c.x + c.width <= t.x || t.y + t.height <= c.y || c.y + c.height <= t.y);
  }
}
console.log('Earned wave-1 gameplay exactly matches merged desktop; live toast/control bounds separated, scroll moved, lifetime 3200 ms.');
