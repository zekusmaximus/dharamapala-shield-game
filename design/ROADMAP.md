# Dharmapala Shield: review and roadmap

Review date: 2026-11-10, against `main` at `58f0853`.

This document replaces `implementation.md` as the forward plan. That plan was
carried out and produced a sound engine. What it produced is not yet a game worth
playing more than once. The work ahead is mostly design, content, and
presentation, in that order.

## 1. Assessment

### What is solid and should not be rewritten

- One `GameSession` owns all mutable state; systems and pure rule functions
  operate on it. Fixed-step clock, seeded RNG, serializable scheduler.
- The simulator runs the production session, so balance claims can be measured.
- 28 Node tests and 14 Playwright/axe tests pass. Zero production dependencies.
- Semantic HTML HUD, keyboard placement, versioned saves with legacy migration.

### Evidence gathered for this review

Headless campaign runs on the current `design/balance.json`:

| Policy | Normal | Hard |
|---|---|---|
| Reference policy (buys and upgrades greedily) | Victory, 20/20 lives | Victory, 20/20 lives |
| 3 firewalls, upgraded, nothing else | First leak on wave 18, dies on 20 | First leak on wave 10, dies on 18 |
| 2 firewalls, upgraded | First leak on wave 16 | First leak on wave 10 |
| 6 firewalls, never upgraded | Dies on wave 14 | Dies on wave 11 |

Other measurements:

- Score is 38,200 on Easy, Normal, and Hard alike.
- The reference policy ends Normal holding 4,372 bandwidth and 3,394 anonymity
  it never needed.
- The tuner's five seeds produce identical runs: the only random draw is the
  crit roll, and every tower has `critChance: 0`.
- A boss wave with 11 towers holds 60 fps; performance is not a current problem.

### Shortcomings, by severity

**A. The game is not fun yet.**

1. **No decisions during a wave.** Placing, upgrading, selling, and selecting
   towers are all rejected outside `BUILDING`. A wave is 25–50 seconds of
   watching, with no speed control.
2. **No challenge.** Three upgraded firewalls carry Normal to wave 18. Difficulty
   settings change nothing a competent player will notice.
3. **One dominant strategy.** Upgrades are linear (+35% damage, +15% range, +12%
   rate per level); spamming and upgrading the cheapest tower is optimal.
4. **Enemies differ only in numbers.** `special` (erratic, stealth, adaptive,
   teleport), `phases`, and the Corrupted Monk's implied healing exist in data
   and are read by no code. Resistances to `fire` are defined; no tower deals
   fire.
5. **Two of three resources are decorative.** Bandwidth and anonymity are only
   extra price tags and accumulate without limit.
6. **Thin content.** One map, three towers, two bosses with one ability each,
   two achievements, 20 fixed waves, no reason to replay.
7. **No targeting control.** Every tower targets the enemy furthest along the
   path.

**B. The game does not look or sound like anything.**

8. **No audio.** `AudioController.play()` is an empty method.
9. **No feedback.** No hit flash, death effect, damage numbers, muzzle flash,
   projectile trail, or screen response to a leak. `state.effects` is allocated
   and never used. Slow and vulnerability have no visual.
10. **No identity.** The Buddhist-cyberpunk premise is absent from the screen:
    flat navy rectangles, a grey path, system fonts, and a dashboard layout. The
    battlefield heading reads "The network path".
11. **Static sprites.** Towers do not aim or animate; enemies do not face their
    direction of travel; a boss is barely larger than a tower.
12. **Weak phone layout.** In 390×844 portrait the battlefield occupies about
    40% of the screen with dead space above and below, towers render at roughly
    14 px, and HUD labels clip ("BANDWIDTH", "ANONYMITY").

**C. Code and project issues.**

13. **Content is hardcoded in systems.** `megaCorpTitan` shield logic appears in
    three files, `raidTeam` phases in `EnemySystem`, the encryption chain in
    `towers.js`, minion lists in `GameSession`. The map is a constant in
    `world.js`. Adding a tower, enemy, or map means editing engine code.
14. **Boss minions spawn at the path entrance,** not at the boss, because
    `createEnemy` always starts at distance 0.
15. **Balance patches invalidate saves.** `validateSnapshot` requires an exact
    `balanceVersion` match.
16. **Dead data.** `burnDps`, `aoeRadius`, `critChance`, `interestPct`, and the
    whole `balance.balance` block (`targetTTK*`, `hpGrowthRate`, …) are unused.
17. **`GameUI.js` is a 575-line monolith.** The planned Menu/HUD/TowerPanel/
    Tutorial controllers were never split out.
18. **No render interpolation.** The clock returns `alpha`; the renderer ignores
    it, so motion stutters on 120/144 Hz displays.
19. **No CI.** PRs merge with no automated checks. Playwright is pinned loosely
    (`^1.53.1`) and breaks when the installed browser build differs.
20. **No LICENSE; repository name is misspelled** ("dharamapala").
21. **Wasted shots.** A projectile whose target dies is deleted, and several
    towers commit to the same nearly-dead target.

## 2. Target

"State of the art" for a solo, dependency-free browser game means the standard of
a polished commercial indie tower defense, not a AAA production. Concretely:

- A first-time player understands the game in under two minutes without reading.
- A competent player loses lives on Normal and has to adapt; Hard needs planning.
- Every wave involves at least a few meaningful decisions made under time.
- At least three distinct viable strategies per map.
- The theme is unmistakable in a single screenshot.
- Plays well on a phone held in portrait, a tablet, and a desktop.
- A full campaign takes 2–3 hours; an endless mode and scoring give a reason to
  return.

## 3. Decisions (recommendations; change before Phase 5 if you disagree)

| Decision | Recommendation | Reason |
|---|---|---|
| Renderer | Stay on Canvas 2D | Under 100 entities; glow, trails, and particles are achievable with additive compositing and cached layers. Keeps zero dependencies and the existing tests. Revisit only if profiling on a mid-range phone fails the budget in Phase 5. |
| Art direction | Vector neon-thangka: SVG sprites with glow, over the painted v1 background | The legacy painted sprites are 1024 px single poses from two inconsistent renders and cannot animate or rotate. Vector art can be authored in-repo, scales cleanly, and recolors per upgrade path. The painted backgrounds remain usable as backdrops. |
| Resources | Dharma = currency. Bandwidth = capacity. Anonymity = a meter. | Gives each resource a job; see Phase 3. Matches the original brief ("stealth rating to avoid detection"). |
| Scope | 6 maps, 6 towers, 8 enemy types, 3 bosses, endless mode | Enough for distinct strategies without a content treadmill. |
| Build during waves | Yes | The single largest fun improvement for the least code. |

## 4. Plan

Order matters: mechanics and balance come before art, because polish applied to
a loop that is not fun is wasted. A minimum of feedback (Phase 1) comes first
because it is cheap and makes every later playtest more informative. Sizes are
relative: S is about one focused session, M two to four, L five or more.

### Phase 0 — Foundations (S–M)

- Add GitHub Actions: build, unit, integration, sim, e2e, and a11y on every PR.
  Pin `@playwright/test` to an exact version and install its browser in CI.
- Add a LICENSE. Rename the repository.
- Decouple saves from balance: version the save schema only; on a balance
  change, keep towers and wave number and recompute derived values.
- Make content data-driven:
  - `design/maps/*.json` holding path waypoints, build mask, theme, wave list.
    `world.js` takes a map instead of exporting constants.
  - An ability registry: enemies and towers list ability IDs with parameters;
    systems dispatch on ability, never on entity ID.
  - Delete dead balance fields or implement them (Phase 2 decides which).
- Fix boss minions to spawn at the boss's path distance.
- Split `GameUI.js` into menu, HUD, tower panel, and tutorial controllers.
- Use `alpha` to interpolate entity positions in the renderer.
- Add a schema test that fails when `balance.json` contains a field no code
  reads.

Exit: CI green on a PR; a second map loads from JSON in a test; no entity ID
literals remain in `js/systems` or `js/core`.

### Phase 1 — Make the loop interactive (M)

- Allow place, upgrade, sell, and select during `WAVE`. Commands already route
  through `GameSession`; relax the phase guards and extend the tests.
- Game speed 1×/2×/3× as a clock multiplier (deterministic: more steps per
  frame, same step size). Hotkeys: Space pause, 1/2/3 speed, Q/W/E… tower
  select, U upgrade, S sell.
- "Call next wave early" during a wave's tail for a dharma bonus proportional to
  time saved. Optional auto-start toggle.
- Targeting modes per tower: first, last, strongest, weakest, nearest. Stored on
  the defense, exposed in the tower panel.
- Projectile retargeting when the target dies, plus damage reservation so towers
  do not overkill the same enemy.
- Minimum feedback set through an effects system driven by session events
  (presentation only, never read by simulation): hit flash, death burst, damage
  numbers, leak flash on the endpoint, status tints for slow and vulnerable,
  EMP ring on disabled towers.
- Expose the per-tower `totalDamage` and `kills` already being tracked.

Exit: simulator parity test still passes at 1× and 3×; e2e covers building and
upgrading mid-wave; a wave can be played without waiting.

### Phase 2 — Combat depth (L)

Enemies get the behaviours their data already promises:

| Enemy | Ability |
|---|---|
| Script Kiddie | Swarm; speed burst when another dies nearby |
| Federal Agent | Armor that must be stripped; immune to slow while armored |
| Corporate Saboteur | Stealth; untargetable unless revealed |
| AI Surveillance | Adapts: gains resistance to the damage type that last hit it |
| Quantum Hacker | Blinks forward a short distance on a cooldown |
| Corrupted Monk | Heals nearby enemies; priority target |
| New: Courier | Fast, fragile, large anonymity penalty if it leaks |
| New: Botnet Carrier | Splits into Script Kiddies on death |

Towers expand to six, each with a job none of the others does:

| Tower | Role | Damage type |
|---|---|---|
| Firewall Fortress | Single-target burn | fire (damage over time) |
| Encryption Monastery | Slow and vulnerability | shock |
| Dharma Distributor | Fire-rate aura, economy | — |
| Mirror Server | Returns a share of enemy health as area damage; anti-tank | physical |
| Decoy Temple | Taunts: enemies in range stall briefly; breaks stealth | — |
| Anonymity Shroud | Reveals stealth in range; restores the anonymity meter | — |

- Branching upgrades: levels 1–2 are shared, then two exclusive paths per tower
  (for example Firewall: Inferno for area burn, or Sentinel for range and
  armor-piercing single target). Twelve end states instead of three.
- One active ability on a cooldown, charged by kills: a screen-wide "Mandala
  Ward" that slows everything for a few seconds. Gives the player a clutch tool.
- Bosses, each with a full phase script: Raid Team (EMP, reinforcements, a
  final rush), MegaCorp Titan (shield, drone escorts, tower-disabling audit
  beam), and a new final boss, the Panopticon (reveals and disables shrouds,
  spawns surveillance, enrages on a timer).
- Every mechanic lands as a pure rule plus a system dispatch, with unit tests
  and simulator coverage. This is the condition `FUTURE_TOWERS.md` set for the
  deferred towers; update that file as each one returns.

Exit: each enemy has a counter and each tower has a matchup where it is the best
answer, demonstrated by simulator policies that differ only in tower choice.

### Phase 3 — Economy and balance (M)

- **Bandwidth as capacity.** Each tower occupies bandwidth; the cap grows with
  wave clears and Distributor upgrades. Ends tower spam and forces the
  upgrade-versus-build choice.
- **Anonymity as a meter (0–100).** Drops when enemies leak and when the grid is
  dense; restored by Shrouds and clean waves. Below thresholds the next wave
  gains elite "trace" squads; above them, a bounty bonus.
- **Score** that distinguishes runs: difficulty multiplier, lives remaining,
  early-call bonuses, no-leak streaks, unspent-resource penalty.
- **Real randomness with seeds:** wave composition variance within a budget,
  crits on specific upgrade paths. Daily seed for comparable runs.
- **A real tuner.** Replace the 29-line script with:
  - Policy archetypes: novice (few towers, no upgrades), greedy, each mono-tower
    strategy, and a search-based near-optimal policy.
  - Targets, asserted in a `test:balance` suite:

    | Policy | Easy | Normal | Hard |
    |---|---|---|---|
    | Novice | Wins with losses | Dies wave 8–12 | Dies wave 4–7 |
    | Greedy | Wins clean | Wins with 5–12 lives | Dies wave 14–18 |
    | Near-optimal | — | Wins with 15+ lives | Wins with 3–10 lives |
    | Any mono-tower | — | Does not win | Does not win |

  - Per-wave reports of time-to-kill, leak positions, and income curve.

Exit: `test:balance` passes; no policy finishes a campaign with more than one
wave's income unspent.

### Phase 4 — Content and progression (L)

- Six maps across three themes (monastery network, corporate arcology, quantum
  bardo), using the layouts in `design/legacy/reference/config.js` as starting
  points. Vary structure, not just shape: a split path, a path that crosses
  itself, a map with scarce build tiles, a two-entrance map.
- Campaign: maps unlock in order, three difficulty stars each. Towers and enemy
  types are introduced one at a time over the first three maps.
- Endless mode per map with procedurally budgeted waves and a local leaderboard.
- Challenge modifiers (no selling, half bandwidth, stealth-only waves).
- Achievements: port the eleven legacy definitions and add per-map and
  per-strategy goals. Persist them separately from run saves.
- Codex: enemy and tower entries that unlock on first encounter, written in the
  game's voice. This is where the premise from
  `design/legacy/original-design-brief.md` reaches the player.

Exit: a new player can go from the menu through map 1 to map 6; every map has a
`test:balance` target row.

### Phase 5 — Presentation (L)

- **Layered renderer:** cached static background, path with animated data-flow
  along it, entities, additive glow layer, effects, UI overlay. Redraw only
  what changes.
- **Art pass (vector neon-thangka):** towers as shrine silhouettes that gain
  ornament per level and recolor per upgrade path, with a rotating or pulsing
  emitter that shows aim; enemies with two- or three-frame motion that face
  their heading; bosses at two to three times tower size with a named health
  bar across the top of the battlefield and an entrance banner.
- **Backdrops:** start from `design/legacy/art/v1/game_background.webp`; one
  per theme, darkened under the play area for contrast.
- **Effects:** projectile trails, type-specific impacts (burn embers, shock
  arcs, mirror shards), mandala ring on area effects, particles pooled and
  capped, screen shake on boss events. All gated by the existing reduced-motion
  setting.
- **HUD redesign:** a display typeface for headings, prayer-flag and mandala
  motifs in the chrome, iconography for the three resources in place of text
  labels, a bottom tower dock replacing the side dashboard, and a radial menu
  on a selected tower.
- **Phone layout:** battlefield fills the width and at least 60% of the height
  in portrait; pinch-zoom and pan; minimum 44 px touch targets; drag-to-place
  with the range ring offset above the finger.
- **Budget:** 60 fps on a mid-range phone with 80 enemies and 200 particles,
  measured in a Playwright performance test with CPU throttling. If Canvas 2D
  misses it, this is the point to evaluate WebGL.

Exit: side-by-side screenshots are recognisably a Buddhist-cyberpunk game; axe
suites still pass; performance test passes.

### Phase 6 — Audio (M)

- Port `design/legacy/reference/audioManager.js` into `AudioController` as a
  subscriber to session events; it never touches simulation.
- Synthesized effects to start (no asset pipeline): per-tower fire, per-type
  impact, leak, build, upgrade, sell, wave start, boss entrance, victory, defeat.
  Rate-limit and pitch-vary repeated sounds.
- Generative ambient score: a drone and singing-bowl layer in build phases,
  with rhythmic layers added by wave intensity and a distinct boss layer.
- Master, music, and effects volume; mute; unlock on first gesture; pause when
  hidden.

Exit: every player action and every major event has a sound; a 20-minute
session is not fatiguing.

### Phase 7 — Onboarding, UX, and release (M)

- Replace the dialog tutorial with a guided first map: one prompt at a time,
  tied to what the player is looking at, ending after the first boss.
- End-of-wave and end-of-run summaries: damage by tower, leaks by enemy type,
  score breakdown.
- Settings: volumes, default speed, colorblind-safe palette, damage numbers
  on/off, reduced motion.
- PWA: manifest, service worker, offline play, install prompt.
- Deploy on every merge to `main` (GitHub Pages or Netlify), with a preview per
  PR.
- Playtest with at least five people who have not seen the game. Record where
  they stall and when they stop; fix the top three issues; repeat once.
- Cross-browser pass: Chrome, Firefox, Safari on desktop; Safari on iOS; Chrome
  on Android.

Exit: public URL, installable, and a stranger completes map 1 unaided.

## 5. Sequencing and risk

| Order | Phase | Size | Depends on |
|---|---|---|---|
| 1 | 0 Foundations | S–M | — |
| 2 | 1 Interactive loop | M | 0 |
| 3 | 2 Combat depth | L | 0, 1 |
| 4 | 3 Economy and balance | M | 2 |
| 5 | 4 Content | L | 2, 3 |
| 6 | 5 Presentation | L | 0; can start in parallel with 3 |
| 7 | 6 Audio | M | 1; can run in parallel with 4 or 5 |
| 8 | 7 Onboarding and release | M | all |

The first playable checkpoint is the end of Phase 3 on the existing map: if the
game is not fun there with placeholder art, more maps and better art will not
fix it, and the design should be revisited before Phases 4 and 5.

Risks:

- **Art is the constraint, not code.** The vector direction is chosen because it
  can be produced consistently in-repo. If hand-painted art is preferred, budget
  for an artist or a consistent generation pipeline before Phase 5.
- **Determinism under new mechanics.** Stealth, blink, healing, and taunts all
  add ordering sensitivity. Keep every rule pure and extend the parity test with
  each ability.
- **Scope.** Phases 2 and 4 are where a project like this stalls. Ship Phase 3
  on one map as a real release before starting Phase 4.
- **Balance drift.** Every content addition must come with a `test:balance`
  row, or the current "three firewalls win" state returns.
