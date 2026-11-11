# Dharmapala Shield: code and playability review

Reviewed 2026-11-11 at commit `58f0853` with balance `1.0.0`.
The resulting work plan is [ROADMAP.md](../ROADMAP.md).

The game has a useful foundation: one session owns gameplay, browser and simulator
share the engine, and all existing checks pass. The next investment should make
placement, spending, and counterplay matter. Adding more waves or towers before
that would extend the same decisions without establishing enough new ones.

There are also release blockers that passing tests conceal. Portrait controls are
covered by an overlay; Escape can strand onboarding or pause; malformed saves can
be accepted and crash on the next tick. Fix these before changing the balance.

## Scope and evidence

Reviewed all active first-party JavaScript modules, HTML/CSS, balance data, build
and serving scripts, simulator/tuner, tests, current documentation, and the legacy
design brief. Archived implementations were considered as possible source
material, not certified as working features. Dependencies and remote GitHub issue
history were not audited.

Validation used Node `24.22.1` and Playwright `1.61.1` / Chromium. The declared
minimum is Node 22; this was not a separate Node-22 compatibility run.

| Check | Result |
| --- | --- |
| `npm run build` | Pass |
| `npm run test:unit` | 22 passed |
| `npm run test:integration` | 4 passed |
| `npm run test:sim` | 2 passed |
| `npm run test:e2e` | 11 passed |
| `npm run test:a11y` | 3 passed |
| `npm run tune` | 15 victories with 20 lives remaining, across all difficulties |
| Additional policy runs | Reference, no-support, Firewall-only, and opening-only strategies on all three difficulties |
| Additional browser checks | Portrait hit testing and actual click, dialog Escape, inspector text, restart/save state, settings reset |
| Additional engine probes | Invalid saves, same-tick terminal transition, shield recovery, disabled aura, snapshot aliasing |

Chromium was initially absent. After installing it with `npx playwright install
chromium`, both browser suites passed. No gameplay source or balance values were
changed during this review. A read-only [diagnostic script](../tools/review/baseline.mjs)
and its [recorded output](reviews/2026-11-11/baseline.json) make the engine and policy
observations reproducible:

```bash
node tools/review/baseline.mjs
```

Browser checks included 1280×720, 390×844, 844×390, and an additional 360×640 portrait
inspection. These are Chromium desktop emulations, not physical-device,
cross-browser, screen-reader, or human difficulty studies. Engagement judgments
below are design recommendations supported by code and scripted play, not player
research findings.

## What is actually implemented

| Area | Current state | Assessment |
| --- | --- | --- |
| Architecture | `GameSession`, command methods, fixed-step clock, scheduler, seeded RNG, shared rules | Implemented; preserve this structure. Edge-case guarantees need work. |
| Campaign | One fixed path, 20 authored waves, six regular enemies, two boss types, three numerical difficulties | Playable by scripted policy; not a multi-level campaign. |
| Towers | Firewall damage, Encryption slow/vulnerability and late chain, Distributor aura/income; five linear levels; sell | Mechanics exist. Strategic necessity and upgrade value are not established. |
| Combat | Central projectile collision, armor/resists, shields, status effects, boss minions and EMP | Implemented with correctness and communication gaps below. |
| Saves | Local v2 snapshots, candidate-session load, v1 migration/refunds, corrupt-payload preservation | Happy path works. Validation, recovery UI, compatibility policy, and save lifecycle are incomplete. |
| UI/input | Semantic HTML menus/HUD/dialogs, canvas battlefield, pointer and keyboard build controls | Desktop smoke flows work. Portrait and dialog cancellation need fixes. |
| Art | One loaded SVG sheet covering all 11 active entity types, fallback shapes, DPR-aware canvas | Implemented static sprites; no sprite animation or level appearance. |
| Audio | An unused `AudioController` with an empty `play()` | Placeholder, not a sound system. |
| Achievements | First kill and first boss emit toast events | Partial; no achievement collection, durable unlocks, or progress screen. |
| Replay/progression | Difficulty selector and restart | No map selection, branching upgrades, challenges, local records, or persistent campaign progression. |
| Tooling | Clean static copy build, real-engine simulator, summary reporter named `tune` | Useful baseline. The tuner does not optimize values; no checked-in CI workflow. |

## Prioritized findings

P0 means a player can be blocked or a loaded run can fail. P1 means correctness,
strategic depth, or validation needed for the next playable milestone. P2 follows
the core game. All findings are open at this baseline; roadmap IDs identify the
work that closes them.

### R01 · P0 · Portrait panels intercept the primary controls

**Confirmed in Chromium.** After New game → Skip tutorial at 390×844, the fixed
wave-preview sheet covers the palette and Start Wave. A normal Playwright click on
Start wave 1 times out because the preview subtree intercepts pointer events.
The same overlap appears at 360×640. Selecting a tower replaces this with another
fixed sheet, so the layout needs a deliberate open/close model and reserved action
space, not a change to one z-index.

Evidence: [portrait CSS](../css/styles.css#L539-L643),
[inspector visibility](../js/ui/GameUI.js#L325-L331), and
[portrait capture](reviews/2026-11-11/portrait.png). The existing layout test only
checks bounding boxes and sizes; it never activates these controls on mobile.

Close in **M1.1**: exercise the whole build/start/inspect/upgrade/sell sequence
without force-clicks at minimum sizes, with sheets and larger wave previews open.

### R02 · P0 · Save validation accepts state that cannot safely resume

**Confirmed by engine probes.** Saves with missing Bandwidth, negative lives,
wave 999, or a level-zero tower pass `fromSnapshot`. A scheduled enemy changed to
`bogus` is accepted, then throws `Unknown enemy type: bogus` on the next tick.
`validateSnapshot` checks some top-level fields but not required resource keys,
state ranges, projectile IDs/references, scheduler content/cursors, phase
invariants, or runtime consistency.

Related confirmed issue: `mapFrom` shallow-copies entities. Running a restored
Raid Team through its phases changes the input snapshot's `firedPhases` array to
`[1, 2]`. Restored state should not share mutable arrays with its input.

Evidence: [snapshot validation](../js/core/rules/validation.js#L37-L65),
[reconstruction](../js/core/GameSession.js#L635-L657),
[map copying](../js/core/GameSession.js#L67-L69).

Close in **M1.3**: validate the complete candidate, reject before swapping it into
the app, deep-copy mutable data, preserve recoverable payloads, and add malformed
fixtures plus continuation-equivalence checks. Balance validation also needs
stronger ranges and cross-references before new content is authored.

### R03 · P0 · Native dialog cancellation bypasses the game flow

**Confirmed in Chromium.** New game → Escape closes the tutorial while leaving
phase `TUTORIAL` and Start Wave disabled. Settings → Escape leaves phase `PAUSED`
with both settings and pause dialogs closed. Normal controls no longer provide
the expected route forward. Returning home or reopening settings can recover
some cases, but the player should not need that workaround.

Evidence: [dialog methods](../js/ui/GameUI.js#L478-L502) and
[open/close helpers](../js/ui/GameUI.js#L539-L559). There are no `cancel` handlers
that apply the corresponding skip, resume, or navigation behavior.

Close in **M1.2**: define Escape/cancel behavior for every dialog, route it through
the same transition as the visible button, and verify focus restoration. Include
pause, tutorial replay, sale cancellation, and terminal screens.

### R04 · P1 · Restart, terminal results, and preferences lack consistent persistence

**Confirmed by browser checks and event wiring.** Place a tower → Pause → Restart
leaves zero live towers but one tower in the saved `PAUSED` snapshot. A terminal
event does not itself save the terminal state. Until another save trigger, Continue
can restore the previous run state. Visibility loss may save later; it does not
make the transition itself durable.

`createState` also resets `showRanges` and `reducedMotion` on menu/restart/new-game
transitions, preserving only the tutorial flag. Browser storage reads such as
`hasSave()` are not protected against storage access exceptions. Recovery methods
exist internally but the player has no export/reset recovery flow.

Evidence: [autosave event list](../js/bootstrap.js#L110-L127),
[state defaults](../js/core/GameSession.js#L95-L130), and
[save repository](../js/platform/BrowserSaveRepository.js).

Close in **M1.3**: specify save behavior on fresh run, restart, wave start and
terminal transitions; keep user preferences separate from run data; handle denied
storage; expose recovery. Decide how a balance-version change preserves or
explicitly retires old runs before shipping new balance data.

### R05 · P1 · Game over does not stop the current enemy-update loop

**Confirmed by engine probe.** With one life and two enemies at the path end,
one `step(1000 / 60)` enters game over after the first leak, then resolves the
second leak. Live statistics show two leaks while `finalStatistics` records one.
Future ticks are frozen, but the remainder of the current tick is not.

Evidence: [enemy loop](../js/systems/EnemySystem.js#L4-L36),
[resolution and terminal capture](../js/core/GameSession.js#L439-L539).

Close in **M1.4**: stop remaining gameplay work immediately after a terminal
transition, reject inappropriate post-terminal resolution commands, and ensure
live/final state agree. Cover multiple exits in one step as well as future ticks.

### R06 · P1 · Shield and disabled-support rules contradict their apparent behavior

**Confirmed by engine probes.** Titan shield cooldown resets only while a hit
absorbs shield. With zero shield, a recent health hit does not postpone recovery;
the shield can regenerate in the same update despite the description saying it
recovers after avoiding damage. In the probe, a health hit at time 2000 leaves the
cooldown at 1000, followed by 13.32 shield regeneration over one simulated second.

A Distributor marked disabled still supplies its 12% fire-rate aura because
`getAuraMultiplier` never checks disabled state. Wave income similarly counts
all Distributors; whether EMP should affect that bonus is an unspecified rule.

Evidence: [shield damage](../js/systems/CombatSystem.js#L139-L144),
[shield recovery and EMP](../js/systems/EnemySystem.js),
[aura calculation](../js/core/rules/towers.js#L47-L63), and
[income counting](../js/core/GameSession.js#L492-L500).

Close in **M1.4**: document and test damage recovery and EMP scope. Update the
runtime, shared rules, and descriptions together. Address these before tuning
boss HP or tower power.

### R07 · P1 · Tower details report effects that the tower does not apply

**Confirmed in Chromium.** Upgrade a Firewall to level 2: the inspector displays
`4% slow`, although its slow duration is zero and combat applies no slow. Generic
upgrade calculations also give Distributors nonzero slow/vulnerability values;
the inspector's status conditional can hide their actual aura. It describes every
tower as targeting an enemy, including the non-attacking Distributor.

Evidence: [generic status scaling](../js/core/rules/towers.js#L19-L43),
[inspector](../js/ui/GameUI.js#L346-L355).

The inspector omits vulnerability, chain effects, actual support recipients,
effective buffed rate, and much of the next-level change. Enemies cannot be
inspected. Slow/vulnerability and incoming EMP have no readable battlefield
telegraph; the boss phase alert is emitted after the burst has already disabled
towers. These are obstacles to informed decisions.

Close the false claims in **M1.4**, then complete decision feedback in **M2**.

### R08 · P1 · Current difficulty does not demand enough adaptation

**Confirmed scripted outcomes, not human win rates.** The bundled policy buys
using a static path-coverage ranking, grows a mostly-Firewall army, and upgrades
low-level damage towers. It does not react to the upcoming composition or boss
abilities. The following results use seed 1337 and production rules:

| Strategy | Easy | Normal | Hard |
| --- | --- | --- | --- |
| Bundled mixed policy | Victory, 20 lives | Victory, 20 lives | Victory, 20 lives |
| Same policy without Distributors | Victory, 20 lives | Victory, 20 lives | Victory, 16 lives |
| Same growth/upgrade policy using only Firewalls | Victory, 20 lives | Victory, 20 lives | Victory, 10 lives |
| Four level-1 Firewalls at opening; no later spending | Defeat on wave 15 | Defeat on wave 11 | Defeat on wave 9 |

These use good, coverage-ranked positions. They do not establish that every new
player finds Hard easy. They do establish a useful challenge for the next design:
an unchanging purchase policy can win without using most of the available
strategic information.

`npm run tune` repeats the bundled policy with seeds 1000–1004: all 15 runs finish
with 20 lives. Both attacking towers have zero crit chance; no current wave/map
variation depends on the seed. These are repeated deterministic scenarios, not
15 independent challenges or evidence of a population win rate.

Normal's reference run ends with 2,391 Dharma, 4,372 Bandwidth, and 3,394 Anonymity;
Hard ends with 2,074 / 3,864 / 2,915. Bandwidth and Anonymity are mostly extra prices
on the two optional tower types; Firewalls and their upgrades use neither.
Their intended strategic roles are not being realized by this policy.

Upgrade value also deserves explicit comparison: a Firewall goes from 30 raw
DPS for 30 Dharma at level 1 to 106.56 raw DPS for 859 total Dharma at level 5.
Range and armor penetration through larger hits matter, so this is not a complete
efficiency calculation. The game currently gives the player little help comparing
another tower with an upgrade. A base Distributor's +6 Dharma/wave takes about
17 waves to repay its 100-Dharma cost through income alone; its aura must justify
the rest, plus the other currencies.

Evidence: [policy](../tools/sim/run.mjs#L37-L94),
[tuner](../tools/tune/balance_tuner.mjs),
[balance](balance.json), [upgrade/economy rules](../js/core/rules/economy.js).

Close in **M2–M4**: compare several strategies, redesign wave pressure and
opportunity costs, then test whether players can recognize and answer threats.
Do not solve this solely by multiplying health or requiring every tower in every
successful build.

### R09 · P1 · Content variety and replay progression are mostly absent

**Code inspection.** All runs use the same path and scripted groups. Regular
enemies differ in HP, armor, resistance, speed, and bounty. `special` values such
as `stealth`, `adaptive`, and `teleport` are not executed. Fire resistance has no
active fire-damage tower to counter. This is acceptable as simple roster data,
but is not an implemented ability system. Raid Team has threshold-triggered EMP
and minions; Titan has a shield, not the four active phases implied by its unused
`phases: 4` field.

Five linear tower levels mainly scale numbers. There are no target-priority
choices, upgrade branches, map objectives, optional challenges, or campaign
unlocks. Two transient achievement toasts are the extent of progression.
Most of the original Karmic Protocol distribution premise is absent from the
player-facing objective, which is now a generic endpoint.

Evidence: [world](../js/core/world.js), [wave compiler](../js/core/rules/waves.js),
[enemy system](../js/systems/EnemySystem.js), [achievement system](../js/systems/AchievementSystem.js),
[original brief](legacy/original-design-brief.md).

Close in **M3–M5**: prove two or more viable builds and distinct enemy responses
in five waves; extend that lesson across twenty; then add one new map, curated
challenge modifiers, and meaningful local records. Recover the theme through
objectives, art, and concise context. The original fifteen-level campaign,
shipment simulation, tech tree, and global leaderboard remain ideas, not current
requirements.

### R10 · P1 · Coverage names and documentation overstate release confidence

**Code inspection plus the missed defects above.** The twenty-wave integration
test releases every spawn and calls `resolveEnemy(..., 'KILLED')` directly. It is
a useful lifecycle test, not a combat campaign. The simulator's automated test
only plays through wave 5. Boss save tests compare immediate snapshots, not the
eventual outcomes of uninterrupted and restored combat. The keyboard smoke test
focuses elements programmatically rather than traversing the full Tab order.
Accessibility scans cover menu/build in Chromium and exclude canvas; they do not
verify accessible battlefield decisions, all dialogs, or actual assistive use.

No CI workflow is checked in. Direct browser-test commands serve whatever is in
`dist/`, so they can exercise stale files unless the build step is run first.
The old implementation plan still says proposed and has no completion record.

Evidence: [lifecycle test](../tests/integration/session-lifecycle.test.js),
[sim test](../tests/sim/parity.test.js), [browser tests](../tests/e2e/game.spec.js),
[axe scope](../tests/e2e/a11y.spec.js), [Playwright configuration](../playwright.config.js).

Close in **M1–M4**: CI builds before testing; add regressions for the confirmed
failures, real full-campaign combat fixtures, continuation parity, mobile
interactions, and manual accessibility checks. Keep existing lifecycle tests.

### R11 · P2 · Presentation and scaling need deliberate budgets

**Code inspection; no target-device performance claim.** Every spawn, shot, hit,
kill, and state event invokes a full `GameUI.update` synchronously. Each update
constructs the read model, touches HUD/description, checks storage, and may
re-render the inspector because it includes per-tower damage/kills. Signatures
avoid some DOM rebuilding but not all repeated work. The canvas redraws even on
menus and pause. This is a scaling risk as content/effects grow, not a measured
frame-rate failure in this review.

Audio is not wired into bootstrap and `play()` is empty. Sprites have no animation;
there are no hit/death effects, status markers, or durable wave-performance
summary. The reduced-motion setting sets a data attribute that no rendering code
or CSS consumes; the separate operating-system CSS media query works for CSS
motion. Functional feedback belongs early; ornamental polish can follow.

Evidence: [event wiring](../js/bootstrap.js#L110-L127), [UI update](../js/ui/GameUI.js),
[renderer](../js/render/CanvasRenderer.js), [audio](../js/platform/AudioController.js),
[sprite catalog](../js/render/SpriteCatalog.js), [styles](../css/styles.css).

Close readable feedback in **M2**, richer presentation in **M5**, and measured
performance/device budgets in **M6**. Coalesce semantic UI updates, avoid storage
reads per combat event, and profile before adding a more complex engine.

### R12 · P2 · Content tooling and development server need cleanup

**Code inspection.** `tools/tune/balance_tuner.mjs` reports outcomes but neither
searches parameters nor evaluates stated balance targets. The balance metadata
includes unused growth/TTK/delay fields. Boss EMP ranges/durations, shield ratios,
chain radius, and minion composition live in code rather than validated content
definitions. That will make iteration harder unless the boundary is explicit.

The local server decodes a request path outside its `try` block. Malformed
percent-encoding can reject the async request handler; it should return a 400
instead. This is a development-server reliability issue, not evidence of an
exposed production service. The project also lacks a top-level license declaration;
art reuse and distribution rights should be explicit before broader release.

Evidence: [balance reporter](../tools/tune/balance_tuner.mjs),
[content data](balance.json#L470-L477), [server](../scripts/serve.mjs#L20-L51),
[art provenance](../assets/sprites/README.md).

Close in **M2/M6**: name tools honestly, validate used content, remove or document
unused fields, handle bad paths, and document release rights and hosting.

## Design judgment

The best next playable target is five waves in which a player learns the path,
faces a new threat, changes a plan, and can explain the result of the first boss
fight. Three towers are enough to prove that. A larger roster is justified when
it creates a decision the existing roster cannot support.

Keep preparation between waves and deterministic combat. Make challenge come from
coverage, timing, resource tradeoffs, and visible counters. Use boss warnings
before effects, clear status information, and an after-wave explanation. Give
players room to recover from mistakes. Test multiple approaches instead of
rewarding only the designer's preferred build.

The [roadmap](../ROADMAP.md) turns these findings into ordered milestones with
completion gates. Human playtesting is required before calling those changes
engaging or claiming a difficulty target has been met.
