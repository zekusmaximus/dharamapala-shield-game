import test from 'node:test';
import assert from 'node:assert/strict';
import { SpawnScheduler } from '../../js/core/SpawnScheduler.js';

test('scheduler preserves stable ordering and accepts zero intervals', () => {
  const scheduler = new SpawnScheduler();
  scheduler.load(
    [
      { dueAtMs: 0, enemyType: 'first' },
      { dueAtMs: 0, enemyType: 'second' },
      { dueAtMs: 10, enemyType: 'third' }
    ],
    7
  );
  const released = [];
  scheduler.advance(0, 7, (event) => released.push(event.enemyType));
  assert.deepEqual(released, ['first', 'second']);
  scheduler.advance(10, 7, (event) => released.push(event.enemyType));
  assert.deepEqual(released, ['first', 'second', 'third']);
  assert.equal(scheduler.complete, true);
});

test('scheduler rejects stale generations and clear invalidates pending work', () => {
  const scheduler = new SpawnScheduler();
  scheduler.load([{ dueAtMs: 0, enemyType: 'ghost' }], 3);
  const released = [];
  scheduler.advance(100, 2, (event) => released.push(event));
  assert.equal(released.length, 0);
  scheduler.clear();
  scheduler.advance(100, 3, (event) => released.push(event));
  assert.equal(released.length, 0);
});
