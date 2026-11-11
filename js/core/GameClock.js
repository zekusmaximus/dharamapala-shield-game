export class GameClock {
  constructor({ stepMs = 1000 / 60, maxFrameMs = 250 } = {}) {
    this.stepMs = stepMs;
    this.maxFrameMs = maxFrameMs;
    this.accumulatorMs = 0;
  }

  advance(realDeltaMs, step, speed = 1) {
    if (speed !== 1 && speed !== 2) {
      throw new RangeError('Wave speed must be 1× or 2×');
    }
    const finiteDelta = Number.isFinite(realDeltaMs) ? realDeltaMs : 0;
    // Clamp wall time first. The accumulator is always simulated time, so a
    // speed change leaves already earned fractional time untouched.
    this.accumulatorMs += Math.max(0, Math.min(finiteDelta, this.maxFrameMs)) * speed;
    let steps = 0;
    while (this.accumulatorMs + 1e-9 >= this.stepMs) {
      // Bound floating-point cancellation at exact step boundaries.
      this.accumulatorMs = Math.max(0, this.accumulatorMs - this.stepMs);
      steps += 1;
      if (step(this.stepMs) === false) {
        this.reset();
        break;
      }
    }
    return {
      steps,
      alpha: this.accumulatorMs / this.stepMs
    };
  }

  reset() {
    this.accumulatorMs = 0;
  }

  snapshot() {
    return { accumulatorMs: this.accumulatorMs };
  }

  restore(snapshot) {
    this.accumulatorMs = Number(snapshot?.accumulatorMs) || 0;
  }
}
