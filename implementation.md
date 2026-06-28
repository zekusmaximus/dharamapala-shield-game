# Dharmapala Shield Implementation Plan

## Status

Proposed implementation roadmap for turning the current browser prototype into a
deterministic, testable, responsive, and end-to-end playable tower-defense game.

This plan assumes the client-only architecture remains in place: the browser owns
the game session, rendering, and local saves; Node is used only for static builds,
the simulator, and automated tests.

## Goals

1. Establish one authoritative `GameSession` as the only owner of mutable game
   state.
2. Make waves, spawning, pausing, restarting, game over, and victory deterministic.
3. Fix boss, leak, collision, save, and progression behavior.
4. Introduce a deliberate build phase and usable tower-management loop.
5. Ship three complete, strategically distinct towers instead of six incomplete
   ones.
6. Move menus and HUD into accessible semantic HTML while retaining canvas for the
   battlefield.
7. Make runtime play and simulation use the same combat and economy rules.
8. Add automated coverage through the first boss wave and final victory.

## Non-goals

- Multiplayer, accounts, cloud saves, or a server-authoritative game.
- A new rendering engine or third-party UI framework.
- Restoring the removed Next.js, Socket.IO, Prisma, Tailwind, or shadcn scaffold.
- Rebalancing every number before the underlying runtime and simulator agree.
- Reintroducing the three deferred tower types during this implementation.

## Current Problems to Eliminate

- `Game` and `Level` both own wave state.
- `Game` and `DefenseManager` both own defense collections.
- `Projectile` and `Game` both resolve collisions.
- `setTimeout` callbacks spawn enemies outside the game clock and survive pause or
  restart.
- Paused, terminal, and menu states are handled as scattered conditionals rather
  than legal transitions.
- Boss definitions and enemy construction use incompatible registries.
- Leaked enemies are marked dead and can receive kill rewards.
- Save/load has competing interfaces and cannot reconstruct browser ES modules
  reliably.
- Canvas-rendered menus and HUD have no semantic structure and overlap at mobile
  sizes.
- The simulator reimplements combat instead of exercising shared rules.

## Architectural Principles

### One owner, explicit collaborators

`GameSession` owns all mutable session state. Systems may mutate that state only
through documented `GameSession` commands or system methods called by the session.
Renderers and UI controllers receive immutable read models and dispatch commands;
they never mutate entity arrays, resources, or phase directly.

### Deterministic game time

Gameplay advances from a game clock, not wall-clock callbacks. A seeded random
source is injected into all code that needs randomness. Given the same balance
version, seed, commands, and ticks, runtime and headless execution must produce the
same result.

### Pure rules, stateful orchestration

Combat formulas, costs, rewards, upgrades, sell values, wave schedules, and
difficulty modifiers are pure functions. `GameSession` and its systems orchestrate
those rules over state. Canvas and DOM code do not contain game rules.

### Terminal states are terminal

Once the session enters `GAME_OVER` or `VICTORY`, no spawn, movement, combat,
resource, or wave update may run. A new session or explicit restart is required to
resume play.

## Target Module Layout

```text
js/
├── bootstrap.js
├── core/
│   ├── GameSession.js
│   ├── GameClock.js
│   ├── SpawnScheduler.js
│   ├── SessionEvents.js
│   ├── commands.js
│   ├── ids.js
│   └── rules/
│       ├── combat.js
│       ├── economy.js
│       ├── towers.js
│       ├── waves.js
│       └── validation.js
├── systems/
│   ├── WaveSystem.js
│   ├── CombatSystem.js
│   ├── DefenseSystem.js
│   ├── EnemySystem.js
│   └── AchievementSystem.js
├── entities/
│   ├── createEnemy.js
│   ├── createDefense.js
│   └── createProjectile.js
├── platform/
│   ├── BrowserSaveRepository.js
│   ├── AudioController.js
│   └── InputController.js
├── render/
│   ├── CanvasRenderer.js
│   ├── Camera.js
│   └── effects/
└── ui/
    ├── GameUI.js
    ├── MenuController.js
    ├── HudController.js
    ├── TowerPanelController.js
    └── TutorialController.js

tests/
├── unit/
├── integration/
├── fixtures/
└── e2e/
```

Existing classes can be adapted into this layout incrementally; this is not a
requirement to rewrite every renderer or entity at once.

## Authoritative GameSession

### State model

`GameSession` will own a serializable state object with this conceptual shape:

```js
{
  schemaVersion: 2,
  balanceVersion: "1.0.0",
  sessionId: "generated-id",
  seed: 1337,
  phase: "BUILDING",
  resumePhase: null,
  gameTimeMs: 0,
  waveNumber: 1,
  maxWaves: 20,
  lives: 20,
  resources: {
    dharma: 130,
    bandwidth: 60,
    anonymity: 100
  },
  score: 0,
  statistics: {
    kills: 0,
    leaks: 0,
    bossesKilled: 0,
    wavesCompleted: 0
  },
  wave: {
    scheduled: 0,
    spawned: 0,
    resolved: 0,
    killed: 0,
    leaked: 0,
    spawnCursor: 0,
    startedAtMs: null
  },
  defenses: new Map(),
  enemies: new Map(),
  projectiles: new Map(),
  effects: new Map(),
  selectedDefenseId: null,
  selectedTowerType: "firewall"
}
```

Maps are used at runtime for stable IDs and O(1) lookup. Save serialization converts
them to arrays; load reconstruction converts them back to Maps. No manager keeps a
shadow copy.

### Commands

UI and input code communicate with the session through a small command surface:

```text
newGame(options)
startWave()
pause()
resume()
restart()
placeDefense(type, worldPosition)
selectDefense(id)
upgradeDefense(id)
sellDefense(id)
save()
load(snapshot)
returnToMenu()
tick(realDeltaMs)
```

Every command validates the current phase. For example, placement, upgrade, and sell
are legal only in `BUILDING`; `startWave` is legal only when the spawn schedule is
ready and no enemies or projectiles remain.

### Phase machine

Use constants rather than free-form strings:

```text
LOADING
MENU
TUTORIAL
BUILDING
WAVE
PAUSED
GAME_OVER
VICTORY
```

The required transition rules are:

| From | Event | To | Required effects |
| --- | --- | --- | --- |
| `LOADING` | content loaded | `MENU` | publish menu read model |
| `MENU` | new game | `TUTORIAL` or `BUILDING` | create fresh state and seed |
| `TUTORIAL` | complete/skip | `BUILDING` | persist tutorial preference |
| `BUILDING` | start wave | `WAVE` | compile spawn schedule, reset wave counters |
| `BUILDING` | pause | `PAUSED` | set `resumePhase = BUILDING` |
| `WAVE` | pause | `PAUSED` | set `resumePhase = WAVE` |
| `PAUSED` | resume | prior phase | clear `resumePhase` |
| `WAVE` | lives reach zero | `GAME_OVER` | cancel schedule, freeze simulation |
| `WAVE` | non-final wave resolves | `BUILDING` | award bonus, increment wave once |
| `WAVE` | final wave resolves | `VICTORY` | award final results, freeze simulation |
| any non-loading state | restart | `BUILDING` | dispose old state and scheduler |
| terminal state | return to menu | `MENU` | dispose session entities |

Invalid transitions return a structured failure and do not partially mutate state.
Unit tests must cover every allowed and rejected transition.

### Pause semantics

`PAUSED` is an explicit state with `resumePhase`; it is not a boolean layered over a
running phase. During pause:

- `gameTimeMs` does not advance.
- The scheduler does not release spawn events.
- Entity movement, cooldowns, buffs, projectiles, and particles do not advance.
- DOM menus remain interactive.
- Save and return-to-menu remain available.

## Game Clock and Spawn Scheduling

### Fixed-step clock

`GameClock` uses an accumulator and a fixed simulation step, initially 16.667 ms.
Real frame deltas are capped to prevent a hidden tab from producing a huge catch-up
step. Rendering may interpolate, but rules update only on fixed steps.

```text
real requestAnimationFrame delta
        ↓ cap and accumulate
zero or more fixed simulation ticks
        ↓
one render using the latest state
```

The clock calls `session.step(fixedDeltaMs)` only while the active phase is `WAVE`.
Animations permitted in menus or building mode use presentation time rather than
mutating game state.

### SpawnScheduler

At `startWave`, the wave definition is flattened into serializable spawn events:

```js
[
  { dueAtMs: 0, enemyType: "raidTeam", hpMultiplier: 1.0 },
  { dueAtMs: 1000, enemyType: "scriptKiddie", hpMultiplier: 1.2 }
]
```

The scheduler owns:

- ordered events;
- the next event cursor;
- the wave-local elapsed game time;
- a generation/session ID used to reject stale work.

Each simulation step drains all events whose `dueAtMs` has passed. An interval of
zero must be legal and must not create division or scheduling errors.

`pause()` naturally stops scheduling because game time stops. `restart()`,
`returnToMenu()`, `GAME_OVER`, and `VICTORY` call `scheduler.clear()` and replace the
generation ID. Gameplay code must contain no `setTimeout` or `setInterval`.

### Wave completion invariant

A wave is complete only when all three conditions are true:

1. `spawnCursor === spawnEvents.length`;
2. `enemies.size === 0`;
3. no unresolved combat action can create another enemy.

Boss minions are registered as dynamic wave enemies and increment both `scheduled`
and `spawned` counters when created. Progress is:

```text
resolved enemies / total scheduled enemies
```

The UI may also show `spawned / scheduled` and live enemy count separately.

## Combat, Leaks, Bosses, and Victory

### One collision system

`CombatSystem` is the only module allowed to resolve collisions or apply hit
outcomes.

- Projectiles update position and expose collision geometry; they do not call
  `target.takeDamage()`.
- The game loop does not contain a second collision pass.
- `CombatSystem` gathers candidate pairs, resolves each projectile at most once per
  step unless it is explicitly piercing, and emits structured hit events.
- A piercing projectile stores IDs already hit and may not damage the same enemy
  again.
- Splash damage is resolved once from the impact point.
- Dead or leaked enemies are removed before the next collision pass.

Start with a simple deterministic broad-phase grid. The map is already grid-based,
and this prevents a future return to nested all-projectile/all-enemy loops.

### Unified enemy definitions

Replace separate incompatible construction paths with one normalized registry:

```js
{
  id: "raidTeam",
  kind: "boss",
  health: 600,
  speed: 30,
  size: 40,
  reward: { ... },
  behavior: "raidTeam",
  phases: [...]
}
```

`createEnemy(definition, context)` handles regular and boss units. Boss behavior is
composition, not an `Enemy` constructor call with missing config:

- Raid Team: phase transitions, scheduler-owned minion spawning, telegraphed EMP.
- MegaCorp Titan: serializable shield state and deterministic shield regeneration.

Boss phase changes are derived from health thresholds and may fire exactly once.
Boss rewards are granted only on a `KILLED` resolution.

### Enemy resolution

All enemy exits use one idempotent method:

```js
resolveEnemy(enemyId, outcome) // outcome is KILLED or LEAKED
```

For `KILLED`:

- increment kills and score;
- grant bounty after difficulty and economy multipliers;
- update achievements;
- emit kill/death presentation events.

For `LEAKED`:

- decrement lives by leak damage;
- increment leaks;
- grant no bounty, kill, or score credit;
- emit leak/life-lost events.

An enemy has a terminal `resolution` field. A second resolution attempt is ignored
in production and throws in tests.

### Game over and victory

- After any leak, if lives are zero or lower, clamp lives to zero and transition to
  `GAME_OVER` immediately.
- `GAME_OVER` clears pending spawn events and prevents subsequent steps.
- After resolving the final enemy in wave 20, transition to `VICTORY` exactly once.
- Victory depends on the scheduler and entity invariants, not a timer or displayed
  counter.
- Final statistics are captured before rendering the terminal dialog.

Integration tests must run a deterministic wave-5 boss fixture and a deterministic
20-wave campaign to terminal states.

## Save and Continue

### Versioned snapshot

Use one `BrowserSaveRepository` with one storage key:

```text
dharmapala-shield/save/v2
```

A snapshot includes:

- schema and balance versions;
- phase and `resumePhase`;
- clock and wave scheduler cursor;
- resources, lives, score, and statistics;
- defenses, enemies, projectiles, buffs, cooldowns, boss phases, and shields;
- selected tower/defense;
- seed and random-source state;
- tutorial completion and settings.

Snapshots contain data only: no functions, class instances, callbacks, DOM nodes,
or audio objects.

### Validation and migration

- Validate required fields, enum values, finite numbers, entity IDs, and known
  definition IDs before modifying the live session.
- Load into a new candidate session; swap it into the app only after complete
  validation.
- Corrupt saves show a recoverable message and preserve the bad payload for manual
  export rather than crashing startup.
- Treat the existing version-1 save format as best-effort migration. Import
  recognized defenses/resources, refund removed tower types at their recorded base
  cost, and resume in `BUILDING`. If migration is unsafe, explain that the old save
  cannot be resumed and offer a reset.

### Save triggers

Save after:

- entering `BUILDING`;
- placement, upgrade, or sell;
- pause;
- wave completion;
- browser visibility loss;
- a throttled interval during `WAVE`, driven by game state rather than duplicate
  intervals.

Tests cover round-trip equality in `BUILDING`, mid-`WAVE`, `PAUSED`, and after boss
phase changes.

## Player Flow and Tower Management

### Pre-wave build phase

A new game enters `TUTORIAL` once, then `BUILDING` for wave 1. No enemies spawn
until the player activates the clearly labeled **Start Wave** control.

The build phase provides:

- upcoming wave number and enemy composition;
- enemy icons, counts, notable abilities, and boss warning;
- current resources and affordability;
- path and legal build tiles;
- tower placement, selection, upgrade, and sell;
- optional speed and settings controls;
- save/continue status.

After a wave, show a concise result summary before returning control to the same
build interface.

### Tutorial

The tutorial is a four-step, dismissible HTML coach flow:

1. Explain the protected endpoint, path, lives, and leak consequence.
2. Explain the three resources and tower affordability.
3. Require selecting and placing a Firewall Fortress on a highlighted legal tile.
4. Explain enemy preview and require pressing **Start Wave**.

Persist `tutorialCompleted`; provide **Replay Tutorial** in settings. Tutorial
instructions must be keyboard-operable and must not trap touch users.

### Tower roster decision

Ship three complete towers:

1. **Firewall Fortress — damage**
   - Reliable single-target damage.
   - Prioritizes enemies closest to the endpoint.
   - Upgrades improve damage, fire rate, and range.
   - Description must not claim physical blocking unless a barrier mechanic is
     implemented later.

2. **Encryption Monastery — control**
   - Lower direct damage.
   - Applies a deterministic slow and vulnerability debuff.
   - Upgrades improve debuff strength/duration and eventually allow limited chain
     application.

3. **Dharma Distributor — support/economy**
   - Does not pretend to be a primary damage tower.
   - Buffs nearby tower fire rate within a visible aura.
   - Generates a capped wave-completion resource bonus while active.
   - Multiple distributors use an explicit stacking rule and cap.

Remove Decoy Temple, Mirror Server, and Anonymity Shroud from the active balance
registry, selection UI, simulator policy, and new saves. Preserve their IDs in save
migration code so existing placements can be refunded. Document them as potential
future towers, each requiring a real mechanic and automated tests before return.

### Upgrade and sell controls

Selecting a placed tower opens an HTML inspector with:

- name, level, role, target priority, and status;
- current and next-level stats;
- upgrade cost and disabled reason;
- sell value and confirmation;
- range toggle for touch users.

Use five linear levels for the first release to match existing balance data. Sell
value is a shared economy rule, initially 70% of total invested cost. Upgrade and
sell are allowed only in `BUILDING`.

## Semantic HTML UI and Responsive Layout

### Canvas responsibility

Canvas renders only:

- map background and grid;
- enemy path and endpoints;
- defenses, enemies, projectiles, and effects;
- placement preview, tower range, and battlefield targeting indicators.

Canvas does not render menus, buttons, resource text, settings, tower cards,
notifications, tutorial content, pause/game-over/victory dialogs, or keyboard help.

### HTML structure

Use native elements wherever possible:

```html
<header>...</header>
<main>
  <section aria-labelledby="battlefield-title">
    <canvas aria-describedby="battlefield-description"></canvas>
  </section>
  <aside aria-label="Build controls">...</aside>
</main>
<footer>...</footer>
<dialog id="pause-dialog">...</dialog>
<div role="status" aria-live="polite"></div>
<div role="alert" aria-live="assertive"></div>
```

Buttons remain actual `<button>` elements. Resource values use text, not emoji
alone. Dialogs restore focus to the control that opened them. Canvas pointer
coordinates are transformed through one `Camera` module.

### Dedicated layouts

Define behavior at three explicit layout modes, chosen from both width and height:

#### Desktop

- Battlefield takes the flexible center area.
- Resource/wave HUD sits above the canvas.
- Tower palette and selected-tower inspector use a right sidebar.
- Minimum supported viewport: 1024 × 640.

#### Portrait mobile

- Compact HUD at top.
- Battlefield uses the middle viewport without overlay panels.
- Tower palette is a horizontal bottom tray.
- Selected tower opens a bottom sheet.
- Primary actions remain reachable above safe-area insets.
- Minimum supported viewport: 360 × 640.

#### Landscape mobile

- Battlefield uses the center-left area.
- Compact tower/actions rail sits on the right.
- HUD uses one condensed row.
- Dialogs fit within viewport height and scroll internally.
- Minimum supported viewport: 640 × 360.

Canvas uses device-pixel-ratio backing dimensions and CSS layout dimensions. World
size and path geometry do not shrink merely because the device viewport is small;
the camera scales or letterboxes the world consistently.

### Accessibility acceptance

- Remove `user-scalable=no` and `maximum-scale=1`.
- Every action is reachable by keyboard and touch.
- Visible focus indicators meet contrast requirements.
- Touch targets are at least 44 × 44 CSS pixels.
- Pause, wave start, tower selection, upgrade, sell, and dialogs have accessible
  names.
- Resource, life, wave, save, and error updates use appropriate live regions
  without announcing every animation frame.
- Respect reduced-motion and contrast preferences.
- Provide a concise text battlefield summary for screen-reader users.
- Automated accessibility scans have no serious or critical violations.

## Shared Runtime and Simulator Rules

### Extraction order

Move formulas from entities, managers, and `tools/sim/run.ts` into pure modules:

1. normalized balance validation;
2. difficulty modifiers;
3. tower stats by level;
4. upgrade and sell costs;
5. armor/resistance/effective damage;
6. crit, splash, slow, vulnerability, and aura rules;
7. kill bounty and wave-clear rewards;
8. wave spawn schedule generation;
9. leak damage and victory conditions.

Each function accepts all inputs and returns data without reading DOM, global
`CONFIG`, local storage, `Date.now()`, or `Math.random()`.

### Configuration injection

Browser startup fetches `design/balance.json` and validates it before creating a
session. Node tools read the same file from disk. Both pass the resulting object
into the same rules and `GameSession`; neither converts it into a second legacy
schema.

The simulator may provide:

- a seeded RNG;
- a no-op renderer/audio adapter;
- a deterministic player policy that issues the same commands available to UI;
- accelerated fixed ticks.

The simulator must not define its own `SimulatedTower` or `SimulatedEnemy` combat
formulas. Prefer running the actual headless `GameSession`; if a performance-only
model remains, parity tests must compare it against the session on fixtures.

### Tooling cleanup

- Convert simulator/tuner entry points to standard ESM `.mjs` files or otherwise
  make their runtime format explicit.
- Keep production dependencies empty.
- Add test-only dependencies only when used:
  - `@playwright/test`;
  - `@axe-core/playwright` for accessibility scans.
- Use Node 22's built-in `node:test` and `node:assert/strict` for unit and integration
  tests.

## Automated Test Strategy

### Unit tests

Cover:

- every legal and illegal phase transition;
- pause/resume restoration from `BUILDING` and `WAVE`;
- scheduler ordering, zero intervals, pause, clear, and restart generation IDs;
- one wave counter increment per completed wave;
- one authoritative defense Map through place/upgrade/sell/load;
- collision resolution exactly once;
- piercing and splash deduplication;
- killed versus leaked resolution and rewards;
- boss factory, phase thresholds, minions, shields, and rewards;
- wave completion and final victory invariants;
- tower stats, debuffs, aura caps, upgrade costs, and sell refunds;
- save validation, round-trip, corrupt data, and version-1 migration;
- pure runtime/simulator rule parity.

### Integration tests

Use deterministic fixtures and production balance separately:

1. Start a new session and verify it remains in `BUILDING` indefinitely.
2. Start wave 1, pause before the first spawn, advance real time, and confirm no
   game-time or spawn change.
3. Restart during a partially spawned wave and confirm no old enemy appears.
4. Leak an enemy and confirm life loss with no kill reward.
5. Kill an enemy and confirm bounty once.
6. Complete waves 1–4 and verify exactly four increments and four build phases.
7. Run wave 5, spawn Raid Team, exercise a phase/minion/EMP event, and complete the
   wave.
8. Save mid-wave 5, reconstruct a new session, and compare canonical state after
   continued ticks.
9. Run a deterministic 20-wave fixture to `VICTORY` and prove no wave 21 event is
   scheduled.
10. Run a forced-leak fixture to `GAME_OVER` and prove subsequent ticks are inert.

The production-balance campaign test may use the deterministic player policy from
the simulator, but it must execute the actual `GameSession`.

### Playwright tests

Run against the built `dist/` application:

- `/` loads the real game and all required assets without console errors;
- new game opens tutorial, then build phase;
- wave does not start until **Start Wave** is activated;
- pause freezes battlefield and spawn progress; resume continues;
- restart removes all prior defenses, enemies, projectiles, notifications, and
  scheduled spawns;
- save/continue preserves resources, wave, phase, tower upgrades, boss state, and
  selection;
- tower select/upgrade/sell works by pointer and keyboard;
- victory and game-over dialogs block gameplay and restore navigation;
- desktop 1280 × 720 layout;
- portrait 390 × 844 layout;
- landscape 844 × 390 layout;
- no HUD/control overlap at supported minimum sizes;
- keyboard-only smoke flow;
- automated accessibility scan with no serious or critical findings;
- zoom is not disabled and all interactive elements have accessible names.

Screenshots should be retained only for intentional layout assertions, not as the
primary proof of behavior.

## Phased Implementation

### Phase 0 — Characterization and test harness

Work:

- Add Node test and Playwright directory structure.
- Add seeded RNG and deterministic ID helpers.
- Capture current balance fixtures for waves 1, 5, and 20.
- Write failing characterization tests for duplicate collision, leak rewards,
  restart ghosts, boss creation, and save failure.

Exit gate:

- Tests reproduce the known failures before production behavior is changed.
- Static production build remains functional.

### Phase 1 — Shared rules

Work:

- Normalize `balance.json` without the legacy `CONFIG` conversion.
- Extract pure combat, economy, tower, and wave functions.
- Update runtime entities to use the extracted functions without changing UI flow.
- Update the simulator to import the same rules.

Exit gate:

- Runtime and simulator parity fixtures produce identical damage, cost, bounty, and
  schedule results.
- No combat/economy formula remains duplicated in simulator code.

### Phase 2 — GameSession and state machine

Work:

- Add `GameSession`, state constants, commands, events, and read models.
- Move wave number, resources, lives, score, entity Maps, and selection into it.
- Replace duplicated defense arrays with `session.defenses`.
- Adapt renderer and existing managers as temporary system wrappers.
- Enforce transition table and terminal-state behavior.

Exit gate:

- There is one wave field and one defense collection.
- Invalid transitions cannot mutate state.
- Game over and victory stop all simulation.

### Phase 3 — Clock, scheduler, and wave lifecycle

Work:

- Add fixed-step `GameClock`.
- Compile wave definitions into `SpawnScheduler` events.
- Remove gameplay `setTimeout`/`setInterval` usage.
- Implement build-to-wave and wave-to-build transitions.
- Add progress counters and dynamic boss-minion registration.

Exit gate:

- Pause freezes all gameplay time.
- Restart and terminal states clear spawn work.
- Waves 1–5 complete deterministically with no ghost spawns.
- A repository search finds no gameplay spawning through wall-clock callbacks.

### Phase 4 — Combat, bosses, leaks, saves, and victory

Work:

- Move all collision handling into `CombatSystem`.
- Add idempotent enemy resolution.
- Normalize enemy/boss factories and implement serializable boss behavior.
- Implement version-2 saves and version-1 migration/refund.
- Implement final-wave victory invariant.

Exit gate:

- Collision, leak, boss, save, game-over, wave-5, and wave-20 tests pass.
- Save/continue works in building, pause, and mid-wave states.

### Phase 5 — Complete three-tower game loop

Work:

- Remove three deferred tower types from active data and UI.
- Implement Firewall, Encryption, and Distributor roles and upgrades.
- Add build phase, preview, start-wave action, tower inspector, upgrade, and sell.
- Add tutorial and wave-result summary.
- Update balance descriptions so every claim maps to tested behavior.

Exit gate:

- Each tower has a distinct strategic purpose and dedicated tests.
- Every visible tower action works and has clear disabled feedback.
- A first-time player can place a tower and intentionally begin wave 1.

### Phase 6 — Semantic and responsive UI

Work:

- Create HTML app shell, HUD, palette, inspector, notifications, and dialogs.
- Remove menu/HUD drawing and hit testing from canvas managers.
- Add camera scaling and device-pixel-ratio rendering.
- Implement desktop, portrait, and landscape layouts.
- Complete keyboard, touch, focus, live-region, and reduced-motion support.

Exit gate:

- Canvas is battlefield-only.
- Playwright layout and accessibility checks pass at all target viewports.
- No essential control depends on canvas hit testing.

### Phase 7 — Simulator parity, full regression, and cleanup

Work:

- Run the actual `GameSession` headlessly from the simulator policy.
- Remove obsolete `Game`, `Level`, `ScreenManager`, `UIManager`, duplicate managers,
  compatibility configuration, and dead tower code.
- Run Easy, Normal, and Hard simulations across documented seeds.
- Rebalance only after runtime/simulator parity is proven.
- Update README, balance documentation, and controls.

Exit gate:

- Build, unit, integration, simulation, Playwright, and accessibility suites pass.
- No duplicate rules or state ownership remain.
- Normal balance reaches the agreed win-rate/leak targets using the shared engine.

## Pull Request Sequence

Keep changes reviewable with this order:

1. Test harness, RNG, fixtures, and characterization failures.
2. Shared rules and balance validation.
3. `GameSession`, state machine, and single defense collection.
4. Fixed clock, scheduler, and wave lifecycle.
5. Collision, leak, boss, victory, and save fixes.
6. Three-tower roster and build-phase controls.
7. Semantic HTML UI and desktop layout.
8. Portrait/landscape layouts and accessibility.
9. Headless session simulator and balance parity.
10. Legacy cleanup and documentation.

Do not combine the state-engine migration and complete UI rewrite into one pull
request. Temporary adapters are preferable to a big-bang replacement.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Large refactor changes balance accidentally | Extract pure rules first and lock parity fixtures before state migration |
| Frame-rate changes alter outcomes | Fixed-step clock, seeded RNG, and deterministic integration tests |
| Old timers or arrays remain active | Repository checks for `setTimeout`, old wave fields, and duplicate defense collections |
| Mid-wave saves become fragile | Data-only snapshots, candidate-session validation, round-trip tests |
| Mobile work changes world geometry | Stable world coordinates plus camera scaling/letterboxing |
| Three-tower cut breaks old saves | Versioned migration and resource refunds for removed IDs |
| Simulator diverges again | Simulator runs headless `GameSession` and parity tests live in CI |
| Canvas/DOM input conflict | One input controller maps DOM/pointer events into session commands |

## Definition of Done

The implementation is complete when:

- The game has one authoritative `GameSession`, one wave counter, one defense Map,
  and one collision system.
- All gameplay spawning is game-clock-driven and is inert while paused.
- Restart, menu, game over, and victory leave no pending gameplay work.
- Boss wave 5 and final wave 20 complete through automated tests.
- Leaks never grant kill rewards; kills grant them exactly once.
- Save/continue round-trips deterministic state.
- New games begin in a guided build phase.
- Three towers are complete, differentiated, upgradeable, and sellable.
- HUD, menus, tutorial, controls, and dialogs are semantic HTML.
- Desktop, portrait-mobile, and landscape-mobile layouts pass automated checks.
- Runtime and simulator use the same combat/economy/wave rules.
- Unit, integration, simulation, Playwright, and accessibility suites pass from a
  clean install.

## Required CI Commands

The final package scripts should support a clean pipeline equivalent to:

```bash
npm install
npm run build
npm run test:unit
npm run test:integration
npm run test:sim
npm run test:e2e
npm run test:a11y
```

CI should fail on browser console errors, unhandled promise rejections, serious or
critical accessibility violations, deterministic fixture drift, or uncommitted
generated simulation output.
