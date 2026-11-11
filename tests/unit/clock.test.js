import test from 'node:test';
import assert from 'node:assert/strict';
import { GameClock } from '../../js/core/GameClock.js';

test('wave speed scales clamped wall time, never the fixed combat step', () => {
  const one = new GameClock();
  const two = new GameClock();
  const oneSteps = [], twoSteps = [];
  one.advance(250, (delta) => oneSteps.push(delta), 1);
  two.advance(125, (delta) => twoSteps.push(delta), 2);
  assert.deepEqual(twoSteps, oneSteps);
  assert.equal(oneSteps.length, 15);
  assert.equal(two.advance(500, (delta) => twoSteps.push(delta), 2).steps, 30);
  assert.equal(twoSteps.length, 45, '250 ms real-frame cap precedes 2× scaling');
  const before = two.snapshot();
  two.advance(-100, () => assert.fail('negative time advanced'), 2);
  two.advance(Infinity, () => assert.fail('nonfinite time advanced'), 2);
  assert.deepEqual(two.snapshot(), before);
  assert.throws(() => two.advance(10, () => {}, 3), RangeError);
});

test('a speed change retains fractional simulated time and a stopped step clears it', () => {
  const clock = new GameClock();
  assert.equal(clock.advance(5, () => {}, 2).steps, 0);
  assert.equal(clock.snapshot().accumulatorMs, 10);
  const restored = new GameClock();
  restored.restore(clock.snapshot());
  assert.equal(restored.advance(10 / 3, () => {}, 2).steps, 1);
  assert.ok(restored.snapshot().accumulatorMs < 1e-9);
  assert.equal(clock.advance(20, () => false, 1).steps, 1);
  assert.equal(clock.snapshot().accumulatorMs, 0);
});
