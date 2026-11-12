# Dharmapala Shield

Dharmapala Shield is a client-only, deterministic tower-defense game. The browser
owns the session, rendering, and local save; Node is used for static builds,
headless simulation, and tests.

## Development status and next work

See the [current roadmap](ROADMAP.md) for priorities, milestone status, and
completion gates, and the [2026-11-11 code review](design/CODE_REVIEW_2026-11-11.md)
for historical baseline evidence. M1 and M2.1–M2.6 are complete within their
documented verification scope. M2 includes inspection, combat feedback,
persistent wave reports, a reproducible balance report, wave-speed controls and
[validated runtime content](design/CONTENT_SCHEMA.md). M3.1 adds authored first-five-wave spawn windows and preview timing. Balance
`1.4.0` and snapshot schema v4 retire prior 1.3.0/v3 and older runs through the existing export/reset recovery
flow; export before resetting. Independent preferences remain compatible.
M3.3 retires Anonymity and measures earned-resource choices; Dharma funds all towers,
while Bandwidth also constrains control/support. M3.2 specialization retention
remains provisional. M3.4 adds one telegraphed, expiring Agent self shield with
early damage, sustained fire and later coverage responses. Human difficulty and engagement validation remain open.

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

The **Wave speed** buttons beside Start Wave select **1×** or **2×**. They are also
available in the Pause and in-run Settings dialogs. A new run starts at 1×. The
selection can be made while building, but combat still waits for Start Wave. It
persists through wave clears, pause and settings, and applies when combat resumes.
Opening Settings during a wave pauses it. Pause, settings, building and terminal
screens do not advance combat time. Terminal screens lock the controls; restarting
or starting a new run resets to 1×. Menu Settings do not select a run speed.

Both speeds use the same 60 Hz combat step. At 2× the clock credits twice as much
simulated time per real frame; it never changes a spawn interval, projectile step
or combat value. A real frame is capped at 250 ms before speed is applied, so a
long frame credits at most 250 ms at 1× or 500 ms at 2×. Fractional simulated
time remains in the clock when speed changes or play pauses, and is saved with
the run. Continue restores the chosen speed and fraction; older valid v2 saves
default to 1×. Returning to the menu saves the departing run. A hidden tab
pauses instead of catching up unseen combat when it becomes visible again.
Wave speed is run state, separate from persistent presentation preferences.

The active tower roster is deliberately small:

- **Firewall Fortress** — single-target damage with a provisional level-3 focus or coverage choice.
- **Encryption Monastery** — slow and vulnerability control, with a provisional level-3 choice of sustained control or chain reach.
- **Dharma Distributor** — nearby fire-rate support and a capped wave-clear bonus.
  Raid Team EMP temporarily disables its active fire-rate aura. The passive
  wave-clear bonus counts installed Distributors even if EMP is active when a
  wave ends. The aura resumes at the exact disable expiry time.

Use a tower's **Info** button to compare an unplaced tower's first two levels,
even when it is unaffordable or a wave is active. Select a placed tower to compare
its current and next level, active support benefit, total investment, and refund.
During building, it can be upgraded through five levels or sold for 70% of the
total invested resources. The wave roster opens enemy armor, active damage
resistances, implemented abilities, and counter hints. At level 3, attacking towers require one permanent specialization; later upgrades
retain it. The inspector compares both alternatives before purchase. This prototype
awaits actual player observations before a retention decision. During waves, towers and
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

Local saves use snapshot schema v4 in the existing `dharmapala-shield/save/v2`
storage slot, so prior payloads are discovered and protected. Balance `1.4.0`
requires exact schema/content compatibility. Prior 1.3.0/v3 and older runs are retained for export
and explicit reset; they are never silently assigned a specialization. Preferences
remain compatible. Pre-v2 legacy imports also require recovery under the retired economy.
See [the content and recovery contract](design/CONTENT_SCHEMA.md) and
[M3.4 evidence](design/reviews/2026-11-12-m3.4/README.md).

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
validation, continued combat after restore and 1×/2× wave equivalence. Browser checks exercise actual
pointer, emulated touch and keyboard flows across desktop, portrait and landscape
sizes, M2.1 tower and enemy inspection, and local persistence. Axe checks menu,
build, wave inspector, dialogs and recovery controls for serious/critical findings,
excluding canvas. Simulation checks now include actual full-campaign combat for the
M2.4 policies/configurations and reconcile production accounting. These checks do
not establish physical-device, screen-reader, arbitrary-strategy coverage or human
playtest results; see the roadmap and milestone evidence.

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
npm run balance:report -- --output=/tmp/balance-report.json
```

`tune` is a compatibility alias for `balance:report`, not a parameter search.
The reporter compares seven explicit policies across three difficulty configurations,
with exact repeats used only for reproducibility. See [M2.4 definitions, results and
attribution limits](design/reviews/2026-11-11-m2.4/README.md). For unchanged
legacy diagnostic probes:

```bash
node tools/review/baseline.mjs
```

Production dependencies remain empty; Playwright and axe are test-only.
