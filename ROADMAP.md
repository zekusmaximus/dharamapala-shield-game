# Dharmapala Shield roadmap

Updated 2026-11-11. Baseline: commit `58f0853`, balance `1.0.0`.

The goal is a tower-defense game that rewards observation, planning, and adapting
after a mistake. The engine is largely in place. The next work should establish
fair, interesting decisions in the first five waves, then carry those decisions
through the campaign.

This is the current plan. [The code review](design/CODE_REVIEW_2026-11-11.md)
records evidence, defects, and validation limits. [implementation.md](implementation.md)
is the earlier architecture specification; [legacy documents](design/legacy/README.md)
are reference material, not a delivery backlog.

## Status and priorities

**Complete** means implemented and verified within the stated scope. **Partial**
means present but missing behavior or acceptance evidence. **Planned** means work
has not begun. Proposed designs and targets below have not been validated with
players. No calendar dates or unattended development schedule are implied.

P0 fixes blocked or unsafe-to-resume play. P1 establishes the core game and its
challenge. P2 adds replay value and release polish after the core works.

| Milestone | Priority | Status | Depends on | Completion evidence |
| --- | --- | --- | --- | --- |
| M0 · Establish the baseline | Foundation | Complete | — | Review, current-state inventory, 42 passing existing tests, balance runs, additional defect probes |
| M1 · Make every run trustworthy | P0, plus related P1 fixes | Complete: M1.1–M1.5 | M0 | Clean checkout and PR #18 CI pass 63 unit, 18 integration, 2 simulation, 43 end-to-end and 7 accessibility checks |
| M2 · Make decisions readable and measurable | P1 | Partial: M2.1–M2.2 complete; M2.3–M2.6 open | M1 | M2.2 clean checkout passes 74 unit, 18 integration, 2 simulation, 57 browser and 9 accessibility checks; wave reports and strategy comparisons remain |
| M3 · Prove an engaging five-wave game | P1 | Planned | M2 | Several viable approaches, meaningful counterplay, first-boss playtest gate |
| M4 · Deliver a challenging twenty-wave campaign | P1 | Partial: existing 20-wave content only | M3 | Complete redesigned pressure curve, distinct bosses, real campaign tests, player validation |
| M5 · Give players a reason to return | P2 | Planned | M4 | Second map, curated challenges, local records, coherent theme and audiovisual feedback |
| M6 · Release and maintain confidently | P2 | Partial: build and test tools exist | M4; M5 for replay-content release | Device/browser checks, performance evidence, hosting/recovery documentation, release checklist |

### Existing capabilities

| Capability | Status | What remains |
| --- | --- | --- |
| Single `GameSession`, fixed clock, serialized spawning, shared runtime/simulator | Complete foundation | Guard same-tick terminal behavior and expand invariant coverage in M1 |
| Build → wave → build; pause, restart, game over, victory | Partial | Dialog cancellation, durable transitions, mobile interactions |
| Three tower roles, upgrades, sell | Partial | M2.1 inspector and support information are tested; meaningful upgrade tradeoffs remain for M3 |
| Twenty waves, six regular enemies, two bosses, three difficulties | Partial | Stronger decisions and pacing; current scripted policy wins all difficulties untouched |
| Local save/continue and legacy refunds | Partial | Full validation, recovery UI, preferences, balance compatibility, continued-combat parity |
| HTML controls, keyboard building, responsive styles, axe checks | Partial | Physical-device touch, dialog cancellation and screen-reader review |
| Entity sprites and fallback rendering | Complete static artwork integration | Status feedback, animation, map identity |
| Audio | Planned | Existing controller is a stub and is not wired into the app |
| Achievements/progression | Partial | Two run-time toasts exist; no persistent collection or records |
| Build/test/simulation tools | Partial | Full combat campaigns, independent strategy/scenario comparisons, performance budgets |

## Design commitments

- **Choices should have visible consequences.** Players can see what a tower
  contributes, what an enemy resists, and why a wave leaked.
- **Challenge should reward adaptation.** Coverage, purchase timing, upgrades,
  support placement, and counters should change outcomes. Raising all enemy HP is
  insufficient by itself.
- **Allow several good plans.** A successful build need not contain every tower.
  Tradeoffs should depend on the scenario rather than a compulsory purchase order.
- **Failure should teach.** Warnings precede dangerous abilities; results explain
  losses; a weak wave leaves a reasonable route to recovery.
- **Keep runs approachable.** Preserve deliberate building between waves,
  keyboard/pointer access, pause, local saves, and a small understandable roster.
- **Give the setting a purpose.** Protecting the Karmic Protocol distribution
  network should be apparent in mission framing and map objectives. Add mechanical
  complexity only when it improves the decisions.

## M1 · Make every run trustworthy

**Status: Complete — M1.1–M1.5 passed their acceptance gates.** This comes before
balance changes. Findings R01–R07 and R10 in the review describe the baseline
failures. Work in small, independently
reviewable changes, each with a regression for the behavior it fixes.

| Order / work item | Deliverable | Acceptance gate |
| --- | --- | --- |
| M1.1 · Repair portrait controls | Give preview/inspector sheets explicit visibility and dismissal; reserve space for the palette and Start Wave | Normal, unforced pointer/touch interactions can select/place/start/inspect/upgrade/sell at 360×640, 390×844, 640×360, 844×390 and desktop. Include the largest previews and rotation. No primary action is covered. |
| M1.2 · Unify dialog cancellation | Route Escape/native `cancel` through tutorial, settings, pause, sale, and terminal navigation rules | Escape never leaves an unusable `TUTORIAL` or `PAUSED` state. Focus returns to a visible useful control. Entire flow works through actual Tab/Shift-Tab/Enter/Escape. |
| M1.3 · Protect saves and preferences | Validate full snapshots and balance definitions; copy nested data; persist new/restarted/terminal runs; separate settings; add corrupt-save export/reset and unavailable-storage handling | Bad resources, IDs, levels, positions, references, schedules and phases are rejected before session swap. Valid mid-boss saves continue identically to uninterrupted play. Reload reflects restart/results and preserves preferences. Version-change behavior is documented. |
| M1.4 · Align combat state and descriptions | Stop all remaining work at terminal transition; fix shield recovery; specify EMP/support rules; remove false status claims | Two same-tick exits cannot mutate captured final results. Recent Titan health damage delays shield recovery. Disabled support follows the documented rule. A Firewall never advertises an unapplied slow. |
| M1.5 · Automate the release baseline | Add CI with a clean build, Node checks, Chromium installation, browser and accessibility suites; retain useful failure traces | A clean checkout runs the documented pipeline. Browser checks test current build output and include the regressions above. Existing checks stay green. |

**M1.1 complete (2026-11-11):** Reproduced the preview intercepting a normal
360×640 palette click, then replaced fixed overlays with dismissible native
preview/inspector disclosures in scrolling build content and a separate Start
Wave area. Unforced pointer and emulated touch select/place/inspect/upgrade/sell/
start flows pass at all five specified sizes, including the largest production
preview (wave 20), expanded panels, rotation in both phone sizes, and real
Tab/Shift-Tab/Enter access. Build, 22 unit, 4 integration, 2 simulation, 27 e2e,
and 5 accessibility checks pass. Historical policy diagnostics remain identical;
engine and balance are unchanged. [Verification details and captures](design/reviews/2026-11-11-m1.1/README.md)
record scope and limits: Chromium emulation, not physical-device or screen-reader
validation. M1 as a whole remains incomplete.

**M1.2 complete (2026-11-11):** Reconfirmed R03 against main `5a58d36`:
Escape closed tutorial/settings while retaining TUTORIAL/PAUSED. Native cancel
now follows tutorial skip, settings Done, pause Resume, sale Cancel and terminal
Main menu rules, with visible useful focus after transitions. Real
Tab/Shift-Tab/Enter/Escape regressions cover tutorial skip/replay, building/wave
settings, pause/resume, sale cancellation and both terminal outcomes. Build,
22 unit, 4 integration, 2 simulation, 35 e2e (all 27 prior tests preserved), and
6 accessibility checks pass; historical diagnostic JSON is unchanged.
[New evidence and limits](design/reviews/2026-11-11-m1.2/README.md) distinguish
Chromium emulation from physical-device and screen-reader testing. M1 remains incomplete.

**M1.3 complete (2026-11-11):** Reconfirmed R02/R04 on main `3a0745f`.
Full candidate and balance validation precedes session replacement; nested save
and restored data are isolated. New/tutorial, restarted, wave-start/completed and
terminal runs persist, with completed-tick capture for combat transitions.
Independent preferences survive new games, restart, menu and reload. Recovery
controls export the exact rejected payload and explicitly reset the saved run;
denied storage leaves play usable with a visible warning. Exact balance-version
compatibility and recovery retention limits are documented. Build, 61 unit,
7 integration, 2 simulation, 40 e2e (all 35 prior interactions retained), and
7 accessibility checks pass. Continuation tests advance uninterrupted/restored
wave 1, mid-phase Raid Team and damaged-shield Titan combat through completion;
all 12 historical policy outcomes remain unchanged.
[Evidence and limits](design/reviews/2026-11-11-m1.3/README.md) distinguish Chromium
emulation/axe from physical-device and screen-reader testing. M1.4–M1.5 were
planned at that point; M1 as a whole was incomplete.

**M1.4 complete (2026-11-11):** Reconfirmed R05–R07 on main `63d59a2` before
edits. Terminal transitions now stop the rest of the tick and later ticks;
resolution commands reject post-terminal calls, and live, final and saved results
agree. Titan shield recovery waits three seconds after the latest shield or health
hit, including at the exact cooldown boundary. Raid Team EMP suspends a
Distributor's active fire-rate aura until its disable expires; the installed
Distributor still earns its passive wave-clear bonus. Firewall upgrades no longer
claim an unapplied slow, and Distributor details describe support accurately.
The balance remains `1.0.0`: values and save shape did not change, so valid v2
saves resume under the corrected rules. A narrow load repair reconciles older
game-over saves affected by R05; other rejected payloads retain M1.3 recovery.
Build, 63 unit, 18 integration, 2 simulation, 43 end-to-end and 7 accessibility
checks pass. [New evidence and policy diagnostics](design/reviews/2026-11-11-m1.4/README.md)
record changed scripted outcomes and browser-emulation limits. M1 remains partial
until M1.5 is complete; M2 combat feedback is still separate.

**M1.5 complete (2026-11-11):** A clean worktree at `2d0947c`, without
`node_modules/` or `dist/`, installed locked dependencies and Chromium, rebuilt
current output, and passed 63 unit, 18 integration, 2 simulation, 43 end-to-end
and 7 accessibility checks. Browser suites used `CI=1` and their own server.
The [PR #18 CI run](https://github.com/zekusmaximus/dharamapala-shield-game/actions/runs/43029556858)
passed the same suites on an Ubuntu runner with Node 22, including Chromium and
system dependency installation. Its first run exposed a 640×360 landscape
overflow and stale canvas sizing under the runner's fonts; the narrow layout and
canvas resize fixes passed the original interaction regressions locally and in
the rerun. That failed run uploaded traces, screenshots and an HTML report.
[M1.5 evidence](design/reviews/2026-11-11-m1.5/README.md) records the results
and limits. M1 is complete; M2 combat feedback remains separate.

Do not change reward values to compensate for a combat bug. Re-run the policy
baseline after these fixes so subsequent tuning starts from the corrected rules.

**Milestone complete when:** a player can start, leave, resume, lose, restart, and
finish a run without blocked controls, stale transitions, or contradictory state.

## M2 · Make decisions readable and measurable

**Status: Partial.** M2.1 tower/enemy inspection and M2.2 combat feedback are complete. Wave
reports, expanded measurements and the other work below remain planned. M1
establishes trust; this milestone gives the player and developer enough
information to improve the game. Findings R07, R08, R10–R12.

- [x] **M2.1 · Explain towers and enemies.** Show current/next damage, rate,
  relevant status durations, vulnerability, chain unlocks, effective support
  benefit, and investment/refund. Give support its own inspector. Offer enemy
  armor/resistance/ability information and a concise counter hint without
  prescribing one solution. Allow inspection during waves without allowing
  unintended build actions.
- [x] **M2.2 · Explain combat.** Add recognizable slow/vulnerability/disable
  markers, visible shield health, boss health/phase information, and warnings
  before EMP. Provide equivalent concise text feedback. Start with readable
  effects; preserve contrast and reduced-motion behavior.
- [ ] **M2.3 · Make wave results useful.** Show leaks by enemy type, where threats
  escaped coverage, resources gained/spent, and tower contributions. Account for
  shield damage and support/control contribution so the report does not falsely
  credit only direct damage. Keep results accessible until dismissed.
- [ ] **M2.4 · Build a balance report.** Compare the existing policy, Firewall-only,
  no-support, expansion-heavy, upgrade-heavy, weak-placement, and counter-aware
  policies on explicit scenarios. Report wave pressure, lives/leaks, boss outcomes,
  time, resource surpluses, spending and contribution. Distinguish deterministic
  repeats from independent scenarios. Rename or document `tune` as a reporter
  until it actually searches values.
- [ ] **M2.5 · Improve pacing controls.** Add 1×/2× wave speed through fixed clock
  advancement, with pause and save/continue equivalence. Keep wave starts deliberate.
  Make any later fast-forward/auto-start option explicit and opt-in.
- [ ] **M2.6 · Make iteration safe.** Validate used content fields and move tunable
  boss/status parameters into an explicit shared schema where useful. Document or
  remove unused metadata rather than pretending it controls the runtime.

**M2.1 complete (2026-11-11):** From main `4ce86e5`, placed towers now compare
current and next damage, base and support-adjusted fire rate, range, applicable
slow/vulnerability durations and chain unlocks. Distributor details show affected
attackers, available rate gain under the active aura cap and EMP, plus passive
wave-clear income. All towers show investment and refund; unplaced, unaffordable
and wave-locked tower blueprints remain inspectable. Enemy details show armor,
resistance to active damage types, implemented boss abilities and counter hints
without advertising unused special metadata. The wave roster and battlefield
support pointer and keyboard inspection while build commands remain locked.
A detached clean checkout at `61c4b0a` passed the documented install, Chromium,
build, 70 unit, 18 integration, 2 simulation, 51 end-to-end and 8 accessibility
checks. The four-policy diagnostic JSON is byte-identical to the M1.4 corrected
baseline. The [PR #19 CI run](https://github.com/zekusmaximus/dharamapala-shield-game/actions/runs/43075287910)
passed the same suites on an Ubuntu runner with Node 22. Balance `1.0.0`, save
format and combat values are unchanged.
[Verification details and limits](design/reviews/2026-11-11-m2.1/README.md)
distinguish Chromium emulation and axe from physical-device and screen-reader
testing. M2 remains partial; M2.2–M2.6 are open.

**M2.2 complete (2026-11-11):** From main `ed15050` (PR #19), static
slow/vulnerability/EMP markers now have concise per-entity text alternatives.
Titan has visible shield health; bosses show health and implemented phase
information. Raid Team warnings precede Start Wave and show the immediate
66%/33% health triggers, 260-unit burst radius and 1.5-second disable; live
cues track the next unspent trigger without inventing a wind-up. Feedback uses
high-contrast static labels under both reduced-motion preferences. A detached
clean checkout at `8eef3cb` passed install, Chromium, fresh build, 74 unit,
18 integration, 2 simulation, 57 browser and 9 accessibility checks. Policy
diagnostics are byte-identical to the corrected M1.4 baseline. Balance `1.0.0`,
combat values and save format are unchanged.
[Evidence and limits](design/reviews/2026-11-11-m2.2/README.md) distinguish
Chromium emulation/axe from physical-device and screen-reader testing.
The [PR #20 CI run](https://github.com/zekusmaximus/dharamapala-shield-game/actions/runs/43077946553)
passed the same suites on Ubuntu with Node 22. M2 remains partial; M2.3–M2.6
are open.

**Acceptance gate:** a tester can identify an enemy's threat, compare a new tower
with an upgrade, see a boss action coming, and use the wave report to explain a
leak. The developer can reproduce before/after balance results using the same
scenarios and policies. No claim of improved difficulty rests on seed repetition
or on a lifecycle test that directly awards kills.

## M3 · Prove an engaging five-wave game

**Status: Planned.** Focus on the existing map and three tower roles. Findings
R08–R09. This is the first major design gate, not a promise to ship every proposed
mechanic below unchanged.

### First design to test

| Wave | Player lesson | Required decision |
| --- | --- | --- |
| 1 · Hold the route | Clear coverage, damage, and spending feedback | Choose a productive opening position; learn how leaks happen |
| 2 · Cover the gaps | Faster or denser attackers stress an opening | Expand coverage or improve an existing tower |
| 3 · Break the escort | Armor/shield pressure changes the value of control and larger hits | Adapt damage/control investment; avoid absolute immunity or a single mandatory tower |
| 4 · Balance the network | Mixed timing and limited budget reward complementary towers | Choose support placement, another attacker, or an upgrade |
| 5 · Survive the raid | Warned EMP and reinforcements test the prepared layout | Spread key defenses or concentrate stronger coverage with an understood risk |

Implementation work:

- [ ] **M3.1 · Author pressure, not just counts.** Use deliberate spawn offsets and
  overlap to create runners, escorts, recovery windows, and a boss climax. Show
  the relevant timing in the preview. Keep schedules deterministic and serializable.
- [ ] **M3.2 · Establish tower tradeoffs.** Tune coverage, costs, armor interactions,
  slow/vulnerability, and aura value together. Prototype a mutually exclusive
  level-3 specialization for damage and control towers (for example, focus versus
  coverage and sustained control versus chain reach). Compare it with the linear
  baseline and retain it only if players make different defensible choices.
  Persist any specialization through a versioned save change.
- [ ] **M3.3 · Give resources a job.** Measure supply and demand by wave. Make
  support/control spending and saving compete with expansion. Distinguish the
  intended constraints of Bandwidth and Anonymity; simplify a redundant currency
  if it still does not produce an independent decision. Revisit Distributor
  payback and upgrade marginal value using actual contribution, not raw DPS alone.
- [ ] **M3.4 · Add a small counterplay vocabulary.** Start with at most two new
  regular-enemy behaviors, such as a shielded escort and a telegraphed disruptor.
  Each needs a visible cue, more than one practical response, and shared runtime/
  simulator/save coverage. Remove unused ability labels if their behavior is not
  being implemented. Do not implement all legacy abilities at once.
- [ ] **M3.5 · Playtest, revise, and record.** Observe at least five first-time
  players and a smaller returning-player group. Record the build choices, first
  confusion, reason for each loss, changes on retry, and willingness to replay.
  Keep observations separate from statistical population claims.

**Acceptance gate:** at least two materially different builds can beat the slice.
Several waves reward a change in placement, spending, or specialization; an
unchanging policy does not earn the best result everywhere. In the pilot, at
least four of five new players can start unaided and explain one successful
counter and one useful next adjustment. Returning players can improve a result
through a deliberate change rather than repeating the same purchase sequence.

Use a provisional 4–7 minute target for this slice including building, with a
meaningful choice in the first 60–90 seconds. Revise from observation; do not add
empty waiting to hit a duration. Proceed to M4 only after the slice is clear and
worth replaying.

## M4 · Deliver a challenging twenty-wave campaign

**Status: Partial.** Twenty waves and terminal handling already exist; their
presence does not complete the redesigned campaign. Depends on the M3 gate.

- [ ] **M4.1 · Develop four campaign acts.** Waves 1–5 teach and test fundamentals;
  6–10 combine counters and spending choices; 11–15 stress coverage, shields, and
  commitment; 16–20 recombine learned threats in a climax. Give recovery waves a
  purpose and avoid unexplained difficulty spikes.
- [ ] **M4.2 · Make bosses distinct and fair.** Raid Team tests warned disruption
  and reinforcement handling. Titan tests sustained pressure and shield recovery.
  Design the final combination around skills already taught. If an additional
  phase adds no new decision, omit it rather than keep a misleading phase count.
- [ ] **M4.3 · Calibrate difficulty.** Easy gives time to learn and recover. Normal
  rewards several sound approaches and punishes ignored threats. Hard requires
  efficient placement and adaptation while remaining winnable without a hidden
  purchase order. Use composition, timing and opportunity cost as well as numbers.
- [ ] **M4.4 · Verify complete runs.** Add actual combat campaigns for all
  difficulties, an expected-defeat/poor-strategy fixture, repeated-command
  determinism, and uninterrupted-versus-restored boss/campaign equivalence.
  Preserve the fast lifecycle test as a separate check.
- [ ] **M4.5 · Test the full experience.** Record completion, leaks, losses by wave,
  retries, build diversity, confusion, and run time for new and returning players.
  Verify a recoverable mistake does not automatically become an unavoidable loss.

**Acceptance gate:** two distinct strategies can complete Normal; a documented
skilled strategy completes Hard; ignoring introduced threats demonstrably costs
performance. Difficulty results separate both policy/scenario tests and observed
player experience. Losses can be explained from the available information, and
successful retries show an actionable adjustment.

Start with an 8–15 minute full-run target including preparation. Set numerical
human win-rate targets only after a pilot establishes what the sampled players
know; the current bot's 100% result is not that baseline. Publish the measured
balance report and remaining limitations with the milestone.

## M5 · Give players a reason to return

**Status: Planned.** Add this after the core campaign passes M4. Finding R09 and
the presentation parts of R11.

- [ ] **M5.1 · Introduce one genuinely different map.** Move hard-coded world/path
  assumptions into shared map definitions. The new map changes coverage or
  objectives enough to alter good builds. Preview routes and account for map IDs
  in saves, simulation, and results. More maps follow only after this proves useful.
- [ ] **M5.2 · Add curated challenges and local records.** Try a limited-budget,
  minimal-leak, or restricted-build scenario with explicit rules. Track best
  results by map/difficulty/challenge/balance version. Consider seeded daily
  challenges only after seeds actually change a validated scenario.
- [ ] **M5.3 · Make achievements durable.** Persist a small collection rewarding
  different strategies and mastery; show progress and completion. Prefer optional
  challenges or cosmetic recognition to permanent power that undermines balance.
- [ ] **M5.4 · Restore the setting.** Frame the protected endpoint as a Karmic
  Protocol relay with a concrete distribution mission. Use readable map art and
  short context between acts. Reuse legacy assets only after adapting them to the
  current pipeline and checking clarity and rights.
- [ ] **M5.5 · Add sound and restrained animation.** Wire presentation-only audio
  to game events with mute/volume and persisted preferences. Add hit, leak,
  wave-clear and boss cues, then ambient music and restrained entity/effect
  animation. Honor user and OS reduced-motion preferences; every necessary audio
  cue also has a visual/text counterpart.

**Acceptance gate:** the second map/challenge changes a player's plan; records and
achievements survive reload; replay has an understandable goal. Presentation
improves recognition without hiding combat or changing deterministic outcomes.

## M6 · Release and maintain confidently

**Status: Partial.** Static build, local serving and CI work. This
milestone verifies the complete release rather than postponing quality work.

- [ ] **M6.1 · Measure performance.** Profile representative late waves and a
  high-entity stress scenario on a named desktop and mid-range physical phone.
  Coalesce semantic UI updates and cache nonchanging data if measurements justify
  it. Establish a reproducible 60-fps desktop / stable 30-fps mobile starting
  budget, with frame-time and input-latency evidence; adjust scope to the agreed
  device baseline. This review did not measure those targets.
- [ ] **M6.2 · Complete usability/accessibility checks.** Real touch play,
  portrait/landscape rotation, zoom, keyboard navigation, visible focus, screen
  reader use, muted audio, reduced motion, high contrast, all dialogs and recovery
  screens. Check supported Chromium, Firefox, and Safari versions. Axe passing
  alone is insufficient.
- [ ] **M6.3 · Finish release operations.** Build from a clean checkout, test the
  hosted result, document hosting/cache/update behavior and rollback, verify save
  compatibility, handle malformed development-server paths, and clarify code/art
  distribution rights. Document the supported Node/browser/device matrix.
- [ ] **M6.4 · Keep the plan current.** Each merged change updates its item,
  supporting test/playtest evidence, balance version when relevant, and known
  limitations. Re-run the relevant strategy matrix after combat/economy changes.
  Review player feedback before deciding the next content batch.

**Acceptance gate:** a named release candidate passes the pipeline, supported
device/browser and accessibility checks, full campaign validation, and hosted
smoke test. Known limitations and save migration behavior are published. New
content does not ship merely because the application builds.

## Deferred until the core proves itself

- **Decoy, Mirror, and Anonymity towers:** follow
  [FUTURE_TOWERS.md](design/FUTURE_TOWERS.md). Revisit one at a time only when it
  fills a demonstrated strategic gap and has complete rules, readable counters,
  save/simulator support, and tests.
- **A large tech tree or fifteen-level campaign:** validate two maps and a small
  set of meaningful specializations first.
- **Endless mode, random map generation, shipment logistics, and active abilities:**
  possible experiments after M4, not prerequisites for a good initial campaign.
- **Accounts, multiplayer, global leaderboards, cloud saves, or an engine rewrite:**
  no current evidence that these solve the game's main problems.

## Immediate next work

M1.1 portrait interaction, M1.2 dialog cancellation, M1.3 save integrity/lifecycle,
M1.4 combat corrections and M1.5 CI are complete. Next is **M2 feedback and
measurement** for the five-wave design gate.
Move an item to Complete only when its acceptance evidence is recorded here or in
a linked review, test report, or playtest note.
