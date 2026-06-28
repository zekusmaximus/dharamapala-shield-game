export class AudioController {
  constructor() {
    this.muted = false;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
  }

  play() {
    // Audio is deliberately presentation-only and never participates in simulation.
  }
}
