export class SpawnScheduler {
  constructor() {
    this.events = [];
    this.cursor = 0;
    this.elapsedMs = 0;
    this.generation = 0;
  }

  load(events, generation) {
    this.events = events
      .map((event, index) => ({ ...event, order: event.order ?? index }))
      .sort((a, b) => a.dueAtMs - b.dueAtMs || a.order - b.order);
    this.cursor = 0;
    this.elapsedMs = 0;
    this.generation = generation;
  }

  advance(deltaMs, generation, release) {
    if (generation !== this.generation) {
      return 0;
    }
    this.elapsedMs += deltaMs;
    let released = 0;
    while (
      this.cursor < this.events.length &&
      this.events[this.cursor].dueAtMs <= this.elapsedMs + Number.EPSILON
    ) {
      const event = this.events[this.cursor];
      this.cursor += 1;
      release(event);
      released += 1;
    }
    return released;
  }

  register(event, generation) {
    if (generation !== this.generation) {
      return false;
    }
    const normalized = {
      ...event,
      dueAtMs: Math.max(this.elapsedMs, Number(event.dueAtMs) || this.elapsedMs),
      order: event.order ?? this.events.length
    };
    this.events.push(normalized);
    const resolved = this.events.slice(0, this.cursor);
    const pending = this.events
      .slice(this.cursor)
      .sort((a, b) => a.dueAtMs - b.dueAtMs || a.order - b.order);
    this.events = resolved.concat(pending);
    return true;
  }

  get complete() {
    return this.cursor >= this.events.length;
  }

  clear() {
    this.events = [];
    this.cursor = 0;
    this.elapsedMs = 0;
    this.generation += 1;
  }

  snapshot() {
    return {
      events: this.events.map((event) => ({ ...event })),
      cursor: this.cursor,
      elapsedMs: this.elapsedMs,
      generation: this.generation
    };
  }

  restore(snapshot) {
    this.events = snapshot.events.map((event) => ({ ...event }));
    this.cursor = snapshot.cursor;
    this.elapsedMs = snapshot.elapsedMs;
    this.generation = snapshot.generation;
  }
}
