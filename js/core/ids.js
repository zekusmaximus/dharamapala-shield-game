export class IdSequence {
  constructor(prefix = 'entity', nextValue = 1) {
    this.prefix = prefix;
    this.nextValue = nextValue;
  }

  next(kind = this.prefix) {
    const id = `${kind}-${this.nextValue}`;
    this.nextValue += 1;
    return id;
  }

  snapshot() {
    return { prefix: this.prefix, nextValue: this.nextValue };
  }

  static fromSnapshot(snapshot) {
    return new IdSequence(snapshot?.prefix || 'entity', snapshot?.nextValue || 1);
  }
}

export function createSessionId(seed) {
  return `session-${Number(seed) >>> 0}`;
}
