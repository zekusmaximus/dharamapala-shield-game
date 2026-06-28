# Dharmapala Shield

Dharmapala Shield is a client-only, deterministic tower-defense game. The browser
owns the session, rendering, and local save; Node is used for static builds,
headless simulation, and tests.

## Play

Requires Node.js 22 or newer.

```bash
npm install
npm start
```

Open <http://localhost:3000>.

New games enter a guided build phase. Place towers on clear grid cells, inspect the
incoming composition, then activate **Start Wave**. Nothing spawns during building
or pause.

The active tower roster is deliberately small:

- **Firewall Fortress** — reliable single-target damage.
- **Encryption Monastery** — slow and vulnerability control, with a late chain
  upgrade.
- **Dharma Distributor** — nearby fire-rate support and a capped wave-clear bonus.

Select a placed tower during building to see current/next stats, upgrade it through
five levels, or sell it for 70% of the total invested resources.

Pointer and touch input work on the battlefield. For keyboard placement, focus the
canvas, move the build cursor with the arrow keys, and press Enter or Space.

## Architecture

`GameSession` is the only owner of mutable gameplay state. Runtime Maps use stable
IDs; snapshots serialize them to data-only arrays and reconstruct them after full
validation.

```text
js/
├── bootstrap.js
├── core/                 # session, clock, scheduler, commands, pure rules
├── systems/              # wave, defense, enemy, combat, achievements
├── entities/             # plain-data entity factories
├── platform/             # saves, input, presentation adapters
├── render/               # battlefield-only canvas and camera
└── ui/                   # semantic HTML controllers
```

The fixed-step game clock is the only source of gameplay time. Spawning uses
serializable scheduler events; pause, restart, menu, game over, and victory cannot
leave wall-clock callbacks behind. `CombatSystem` alone applies collision outcomes.
Leaks and kills go through one idempotent resolution command.

Balance is loaded from `design/balance.json` by both the browser and Node tools.
The simulator runs the production `GameSession` and issues the same build/start
commands as the UI.

Local saves use `dharmapala-shield/save/v2`. Corrupt payloads are preserved for
recovery. Version-1 saves are migrated into building mode; removed tower IDs are
refunded. See [deferred tower concepts](design/FUTURE_TOWERS.md).

## Validation

```bash
npm run build
npm run test:unit
npm run test:integration
npm run test:sim
npm run test:e2e
npm run test:a11y
```

The suites cover phase transitions, fixed scheduling, kill/leak economy, boss
phases, snapshot migration and round trips, wave-20 victory, forced game over,
runtime/simulator parity, pointer and keyboard flows, save/continue, pause/restart,
the 1280×720, 390×844, and 844×390 layouts, and serious/critical axe findings.

Useful simulation commands:

```bash
npm run sim:easy
npm run sim:normal
npm run sim:hard
npm run tune
```

Production dependencies remain empty; Playwright and axe are test-only.
