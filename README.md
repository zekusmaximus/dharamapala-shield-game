# Dharmapala Shield

Dharmapala Shield is a client-only, deterministic tower-defense game. The browser
owns the session, rendering, and local save; Node is used for static builds,
headless simulation, and tests.

## Development status and next work

See the [current roadmap](ROADMAP.md) for priorities, milestone status, and
completion gates, and the [2026-11-11 code review](design/CODE_REVIEW_2026-11-11.md)
for evidence and known issues. The next priorities are portrait controls, dialog
cancellation, and save integrity, followed by combat feedback and a five-wave
design milestone focused on meaningful choices and challenge.

The earlier [implementation plan](implementation.md) remains an architecture
reference; it is not the current backlog.
Use the [new-chat handoff prompt](design/ROADMAP_HANDOFF.md) to begin M1.1.

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
IDs; snapshots serialize them to data-only arrays and reconstruct a candidate
session on load. Completing snapshot validation is a current roadmap priority.

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

The suites cover selected phase transitions, fixed scheduling, kill/leak economy,
boss phases, snapshot migration and immediate round trips, wave-20 lifecycle
victory, forced game over, shared runtime/simulator rules, five-wave headless
combat, pointer and keyboard smoke flows, save/continue, pause/restart, layout
bounds at 1280×720, 390×844, and 844×390, and serious/critical axe findings in menu
and build screens. These do not yet certify full-campaign combat, mobile control
reachability, all save invariants, or complete accessibility; see the review.

Install Chromium with `npx playwright install chromium` before running browser
checks, and build first so the tests exercise current files in `dist/`.

Useful simulation commands:

```bash
npm run sim:easy
npm run sim:normal
npm run sim:hard
npm run tune
```

`tune` currently summarizes a fixed policy across seeds; it does not search
balance parameters. For reproducible strategy comparisons and diagnostic probes:

```bash
node tools/review/baseline.mjs
```

Production dependencies remain empty; Playwright and axe are test-only.
