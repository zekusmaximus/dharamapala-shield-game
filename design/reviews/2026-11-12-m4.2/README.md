# M4.2 focused bosses · automated evidence

Started from fetched main `601c1ea` (PR #32, M4.1) on
`m4.2-boss-identity-fairness`. No applicable `AGENTS.md` was present and
`gh pr list --state all` plus `git ls-remote --heads origin` showed no M4.2
work. The roadmap, runtime content schema, [human deferral](../2026-11-12-human-validation-deferral/README.md),
[M4.1 evidence](../2026-11-12-m4.1/README.md) and
[M4.4 evidence](../2026-11-12-m4.4/README.md) were read. No participant-record
search or new M3.5 kit was undertaken. [Current boss preparation and the
production observation before editing](CURRENT_DESIGN.md) preceded this change.

## Decision and scope

The 1.5.0 production [boss trace](boss-trace-before.json) covers all 21 fresh
policy/difficulty campaigns with legal purchases, default funds/lives, authored
waves in order and actual 60 Hz combat. All 18 reached Raid encounters at each
of waves 5, 10 and 20 fired both phases. The wave-5 and wave-10 pairs were at
least 4.17 s and 4.75 s apart. In wave 20, **10 of 18** second bursts occurred
within the first 1.5 s disable (50–400 ms apart); successful plans often had
the same 11–15 attackers in range of both. The second immediate EMP therefore
often extended an existing disable without a new preparation choice. Titan's
three-second hit-free recovery did operate: 15/18 wave-15 Titans and 12/36
wave-20 Titans regained shield. The Raid preview warned of reinforcements but
did not name them; Titan's live text had no recovery countdown. These are
production observations and a design rationale, not observations of players.

Balance **1.6.0** keeps Raid's warned 66% immediate EMP, 260-unit range and
1.5 s disable, removes its 33% repeat, and dispatches the same four minions
after the single trigger at 0/250/500/750 ms: three Script Kiddies and one
Federal Agent. The Agent retains its exact one-use 3 s warning, 4 s shield at
60% health and no refill. The preview warning now names the threshold, radius,
duration, exact reinforcements and spacing; it clears when the EMP is spent.
Live text and the canvas no longer claim a three-phase Raid. Titan's 35%
initial shield, 4%-of-shield-capacity-per-second regeneration, three-second
hit-free recovery and absence of health phases are unchanged. Its live text
shows the remaining delay or active regeneration beside shield health.

The M4.1 four-act schedule is byte-identical: every wave group, offset, count,
HP multiplier and reward remains. Wave 20 retains the two Titans at 0/14 s,
Raid at 7 s and its authored screen. Tower roles, branch choices, prices,
resources, enemy values, difficulty, shared schedule compiler, deliberate
starts, pause/Continue and 1×/2× clock are unchanged. The [comparison
script](compare.mjs) asserts the exact content scope against `601c1ea`.

## Fresh combat, comparisons and continuation

[results.json](results.json) is the new 21-run production report (seven fixed
policies × Easy/Normal/Hard, seed 1337). It starts fresh with default funds and
lives, buys through legal commands and plays authored waves in order. Each run
was repeated exactly and its hashes match. Eighteen runs reached wave 20;
three weak-placement runs naturally lost on wave 3. Of those reaching wave 20,
Hard expansion-heavy naturally lost; the other 17 won. No grants, direct hits,
skipped waves or synthetic clears establish these outcomes.

[comparison.json](comparison.json) pairs **all 369 reached waves** with
immutable [M4.1 results](../2026-11-12-m4.1/results.json), including lives,
typed leaks, banks before/after purchases, bounties, clear rewards, spent
resources, boss phases/resolutions, spawn pressure, timing and tower activity.
[comparison.md](comparison.md) lists all 21 final outcomes and the Normal/Hard
existing-policy per-wave detail. All 21 keep the same final phase/wave,
**lives, typed leaks, resources and boss kill/leak outcomes**. Every reached
wave also has the same resources, lives, spawned types and authored count. The
three weak-placement runs still lose to 20 Script Kiddie leaks on wave 3;
Normal expansion-heavy still leaks two Titans and ends with 10 lives; Hard
expansion-heavy still loses to four Titan leaks. The other policies leak none.
All 54 reached Raids now fire exactly one EMP and dispatch four minions; all
are killed as before. Of 72 reached Titans, 66 are killed and six leak, as
before. This is outcome stability for fixed plans, not a difficulty target.

Simulated total combat time shortens by 1.4–15.2 s in the 18 runs that reach
wave 20; the three wave-3 defeats are identical. Existing-policy totals are
Easy 347.5→342.9 s, Normal 381.0→375.2 s, Hard 411.3→408.1 s. Individual
later wave durations and peak live counts can rise or fall as earlier Raid
timing changes targeting. The [after trace](boss-trace-after.json) has one
affected EMP and four spawned minions per reached Raid, and Titan recovery in
15/18 wave-15 and 12/36 wave-20 encounters. Total observed Titan regeneration
changes 1,290→1,098 shield on wave 15 and 5,803→5,733 on wave 20; wave 18
has zero in both. Titan content itself did not change.

Health removal is identical for successful plans and can vary slightly on a
leaking Titan (Normal/Hard expansion-heavy +19/+20 capped health removal).
Shield removal shifts between −536.5 and +218.7 across the 21 plans because
brace timing, Titan recovery and tower targeting change. For the Normal
existing policy, shield removal is 3,727.2→3,463.1, slow/vulnerability hits
254→248, aura-present shots 925→960 and passive Dharma stays 102. For Hard
existing, those values are 4,480.5→4,211.0, 293→302, 1,318→1,326 and 102.
Across all plans, slow/vulnerability differences range −7 to +9 applications,
aura-present shots −4 to +35 and passive income is unchanged. Per-wave and
per-plan activity is retained in the comparison; these are counts and capped
damage accounting, not causal credit for prevented leaks.

The adapted [M4.4 full-run continuation test](../../../tests/sim/campaign-continuation.test.js)
passes 4/4 against the new report. Its unchanged four lanes per case are
production 1×, 2×, mixed 1×/2× with pause, and mixed speed with paused JSON
restore. They replay equal accepted commands and compare full state/runtime,
reports, resources, lives, typed leaks, hit accounting, terminal freezing and
deliberate starts after earned build/Raid/Titan/defeat checkpoints.

| Case | Outcome | Credited / consumed simulated ms | Accepted commands | JSON checkpoints |
| --- | --- | ---: | ---: | --- |
| Easy existing | Victory, 20 lives | 344421 / 342850 | 59 | Build 3; Raid 5 |
| Normal existing | Victory, 20 lives | 377194 / 375166.667 | 57 | Raid 10; Titan 15; Build 16 |
| Hard existing | Victory, 20 lives | 409811 / 408100 | 55 | Titan 20 |
| Hard weak placement | Defeat, wave 3 | 67556 / 67466.667 | 5 | Build 3; live wave 3 |

## Compatibility and checks

The changed Raid meaning requires balance **1.6.0**. State and wrapper remain
**schema v4**, since phase, fired phases, scheduler and all other saved fields
retain their shape. The storage slot remains `dharmapala-shield/save/v2` and
retired Anonymity remains a numeric key with zero active supply/prices. A real
paused 1.5.0 Raid phase-two [save fixture](old-1.5.0-v4-save.json) was captured
with [this script](capture-old-save.mjs) from immutable `601c1ea` content after
earned Normal waves 1–4 and real wave-5 combat. Current validation rejects
old bytes before session swap, keeps them verbatim, blocks overwrite, permits
export and requires explicit Reset saved run. Preferences and the latest
recovery archive survive reset; export before reset for durable retention.
Falsely relabeling those phase-two bytes as 1.6.0 fails phase validation.
Old runs need their matching build to continue. The pinned 1.4.0 M3.5 archive
and all historical evidence remain unchanged.

Focused Node checks and eight browser checks of the boss cues, old-save flow
and prior combat status pass. [verify.sh](verify.sh) runs the clean-checkout
locked install, Chromium install, fresh build, five CI suites, exact current
report/summary/trace/fixture regeneration, historical economy/tradeoff checks,
prior-artifact preservation and pinned M3.5 archive hash. Its complete log is
retained in [validation.txt](validation.txt); hosted PR results are recorded
separately in [ci.txt](ci.txt).

From the repository root, the evidence commands are:

```bash
node design/reviews/2026-11-12-m4.2/trace-bosses.mjs /tmp/m42-bosses-before.json --old
node design/reviews/2026-11-12-m4.2/trace-bosses.mjs /tmp/m42-bosses-after.json
npm run balance:report -- --output=/tmp/m42-results.json
node tools/balance/summary.mjs /tmp/m42-results.json /tmp/m42-summary.md
node design/reviews/2026-11-12-m4.2/capture-old-save.mjs /tmp/m42-old-save.json
node design/reviews/2026-11-12-m4.2/compare.mjs
node --test tests/sim/campaign-continuation.test.js
bash design/reviews/2026-11-12-m4.2/verify.sh > /tmp/m42-validation.txt 2>&1
```

The final command requires a detached clean checkout without `node_modules`
or `dist`; it regenerates and compares all recorded bytes and then checks the
checkout is still clean.

M3.2 specialization retention, M3.5 collection, the human M3 gate, M4 player
acceptance and later M4.3/M4.5 remain open. Deterministic repeats, geometry,
combat activity, reports, Chromium and axe cannot establish player
understanding, difficulty, build diversity, physical-device or screen-reader
usability. M5 and M6 are outside this work.
