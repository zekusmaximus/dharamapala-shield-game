# Dharmapala Shield

Dharmapala Shield is a client-only, deterministic tower-defense game. The browser
owns the session, rendering, and local save; Node is used for static builds,
headless simulation, and tests.

## Development status and next work

See the [current roadmap](ROADMAP.md) for priorities, milestone status, and
completion gates, and the [2026-11-11 code review](design/CODE_REVIEW_2026-11-11.md)
for evidence and known issues. M1 is complete. M2.1 adds rule-derived tower and
enemy inspection; combat feedback, wave reports, and the five-wave design
milestone remain in the roadmap.

The earlier [implementation plan](implementation.md) remains an architecture
reference; it is not the current backlog. The
[handoff prompt](design/ROADMAP_HANDOFF.md) records the earlier M1.1 task.

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
  Raid Team EMP temporarily disables its active fire-rate aura. The passive
  wave-clear bonus counts installed Distributors even if EMP is active when a
  wave ends. The aura resumes at the exact disable expiry time.

Use a tower's **Info** button to compare an unplaced tower's first two levels,
even when it is unaffordable or a wave is active. Select a placed tower to compare
its current and next level, active support benefit, total investment, and refund.
During building, it can be upgraded through five levels or sold for 70% of the
total invested resources. The wave roster opens enemy armor, active damage
resistances, implemented abilities, and counter hints. During waves, towers and
live enemies can be inspected on the battlefield, while building, upgrades, and
selling remain locked.

Pointer and touch input work on the battlefield. For keyboard placement or wave
inspection, focus the canvas, move the cursor with the arrow keys, and press
Enter or Space. The wave roster and tower Info buttons are also reachable by Tab.

## Architecture

`GameSession` is the only owner of mutable gameplay state. Runtime Maps use stable
IDs; snapshots serialize them to data-only arrays and validate a candidate
before replacing the active session on load.

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
refunded. M1.4 keeps balance version `1.0.0`, so valid v2 runs continue with the
corrected combat rules. A narrow load repair reconciles older game-over saves
with the former same-tick leak mismatch; unrelated invalid saves still use the
export/reset recovery flow. See [deferred tower concepts](design/FUTURE_TOWERS.md).

## Validation

From a clean checkout with Node.js 22 or newer, run:

```bash
npm ci
npx playwright install chromium
npm run build
npm run test:unit
npm run test:integration
npm run test:sim
npm run test:e2e
npm run test:a11y
```

The suites cover phase transitions, fixed scheduling, combat and income rules,
terminal state agreement, Titan shield recovery, Raid Team EMP support, save
validation and continued combat after restore. Browser checks exercise actual
pointer, emulated touch and keyboard flows across desktop, portrait and landscape
sizes, corrected tower descriptions, and local persistence. Axe checks menu,
build, dialogs and recovery controls for serious/critical findings, excluding
canvas. These checks do not establish physical-device, screen-reader, full-campaign
combat or human playtest results; see the roadmap and milestone evidence.

The CI workflow runs this sequence on Ubuntu for every pull request and on
`main` pushes, installing Chromium's system libraries with Playwright's
`--with-deps` option. The build removes and recreates `dist/` before either
browser suite; browser tests start their own server in CI. Failed Playwright
tests keep traces and screenshots in `test-results/`, and CI also writes an
HTML report. The workflow uploads those artifacts for 14 days when a job fails.

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
