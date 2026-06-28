export class SeededRandom {
  constructor(seed = 1337) {
    this.state = (Number(seed) >>> 0) || 0x6d2b79f5;
  }

  next() {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state / 0x100000000;
  }

  snapshot() {
    return this.state;
  }

  restore(state) {
    this.state = (Number(state) >>> 0) || 0x6d2b79f5;
  }
}
