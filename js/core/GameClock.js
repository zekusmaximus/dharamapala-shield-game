export class GameClock {
  constructor({ stepMs = 1000 / 60, maxFrameMs = 250 } = {}) {
    this.stepMs = stepMs;
    this.maxFrameMs = maxFrameMs;
    this.accumulatorMs = 0;
  }

  advance(realDeltaMs, step) {
    const finiteDelta = Number.isFinite(realDeltaMs) ? realDeltaMs : 0;
    this.accumulatorMs += Math.max(0, Math.min(finiteDelta, this.maxFrameMs));
    let steps = 0;
    while (this.accumulatorMs + Number.EPSILON >= this.stepMs) {
      step(this.stepMs);
      this.accumulatorMs -= this.stepMs;
      steps += 1;
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
