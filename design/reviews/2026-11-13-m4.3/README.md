# M4.3 difficulty calibration · automated evidence

Started from fetched `origin/main` **`c4f614e`**, the merge of M4.2 PR #33.
No applicable `AGENTS.md` was present in the checkout or workspace parents.
`gh pr list --state all --search 'M4.3'` and `git ls-remote --heads origin
'*m4.3*'` found no earlier M4.3 work. The roadmap, content schema,
[human-validation deferral](../2026-11-12-human-validation-deferral/README.md),
[M4.1](../2026-11-12-m4.1/README.md),
[M4.2](../2026-11-12-m4.2/README.md), and
[M4.4](../2026-11-12-m4.4/README.md) evidence were read. There was no new
participant-record search and no recreation of the pinned M3.5 kit.

## Diagnosis, decision and exact scope

[The pre-edit diagnosis and proposal](BASELINE_AND_PROPOSAL.md) uses the
immutable 1.6.0 production report and earned wave-3 forks. The existing
difficulties have the same authored composition and timing and the same
starting economy; HP, speed, bounty and leak multipliers differ. The same five
fixed policy labels win untouched at 20 lives across all difficulties; one,
counter-aware, duplicates existing's commands. All three firewall-only and
no-support runs also win untouched. In the earned wave-3 fork, saving instead
of preparing for the introduced Agent packet costs no lives on Easy/Normal
and five on Hard, including one Agent leak. This does **not** isolate the Agent
brace's causal contribution from the accompanying Script Kiddies.

The calibration changes four difficulty values in `design/balance.json`:

| Difficulty | HP | Speed | Bounty | Player leak damage | Decision |
| --- | ---: | ---: | ---: | ---: | --- |
| Easy | 0.75 | 0.85 | 1.15 | 0.80 | Keep existing learning/recovery margin. |
| Normal | 1.00 → **1.10** | 1.00 → **1.04** | 1.00 | 1.00 | Charge a bounded opportunity cost for skipping preparation. |
| Hard | 1.35 → **1.38** | 1.15 | 0.85 | 1.25 → **1.40** | Expose a fast mixed-threat leak and make a default boss leak cost seven lives. |

Default regular leaks still cost one life after rounding on all difficulties;
default boss leaks cost 4/5/7 on Easy/Normal/Hard. This does not retune the
economy: starting funds/lives, tower costs, bounty definitions and multipliers,
clear income, support income and refunds are exact. All M4.1 wave groups,
counts, offsets, intervals, HP group multipliers and rewards are byte-identical.
Their four-act composition and timing continue to provide the choice; the
calibration changes what postponing a response costs. The shared schedule
compiler, previews and deliberate starts are unchanged. So are the explicit
level-3 branches, Agent's one-use 3 s warning / 4 s 60%-health shield, Raid's
single warned 66% EMP with four reinforcements, Titan shield recovery, tower
roster, pause/Continue and the 1×/2× fixed clock. `compare.mjs` asserts this
exact content scope against the copied [1.6.0 bytes](baseline-1.6.0.json).

## Full-campaign production comparison

[New results](results.json) contain seven policy labels × three difficulty
configurations, each repeated with an equal SHA-256 digest. These are fresh
`newGame` runs with seed 1337, default 130 Dharma / 60 Bandwidth / 20 lives,
legal purchase/upgrade commands, deliberate starts, authored waves in order
and real production targeting, movement, damage, boss behavior and natural
terminal states. There are **369 reached waves** per pass; no grants, skips,
direct hits or synthetic kills establish outcomes. The 21 policies/configs
share one map, roster and seed; exact repeats are reproducibility checks, not
independent trials or player win rates.

The [paired comparison](comparison.json) records **every reached wave** against
immutable [M4.2 1.6.0 results](../2026-11-12-m4.2/results.json): authored
schedule, spawn types/HP/shields/peak, lives, typed leaks and damage, resources
before and after purchases and wave income, boss phases/outcomes/times, combat
duration, capped health/shield removal, shots, status applications and support
activity. [The readable comparison](comparison.md) lists all 21 final outcomes
and the Normal/Hard existing-policy wave detail; [the summary](summary.md)
retains all current per-wave ledgers and tower activity.

| Policy result | 1.6.0 → 1.7.0 |
| --- | --- |
| Easy, all seven labels | Every per-run outcome and wave observation is identical. Six labels win at 20 lives; weak placement naturally loses on wave 3. |
| Normal, five winning labels other than expansion-heavy | Still reach wave-20 victory at 20 lives and kill all seven bosses. `counter-aware` is identical to `existing`. |
| Normal expansion-heavy | Two → three Titan leaks; 10 → 5 lives at victory. End bank 7540/4678 → 7315/4570 Dharma/Bandwidth as the third Titan bounty is lost. |
| Hard firewall-only | One wave-20 Quantum Hacker leak; 20 → 19 lives, while all seven bosses are still killed. Bank 2053/4394 → 2030/4381. This is a policy-level cost for the physical-only plan, not proof of a specific player's adaptation. |
| Hard existing, no-support, upgrade-heavy, counter-aware | Still win at 20 lives with all seven bosses killed. Existing and counter-aware use the same commands. |
| Hard expansion-heavy | Defeat on wave 20 after three rather than four Titan leaks: seven damage per leak reaches zero. A fourth Titan is unresolved when terminal freezing stops combat. |
| Weak placement | Still loses on wave 3 on each difficulty to 20 Script Kiddie leaks. |

All 54 reached Raid Team bosses fire exactly one phase and are killed. Across
72 reached Titans, 65 are killed, six leak and one is frozen unresolved on the
Hard expansion-heavy loss. The latter is a terminal consequence, not a Titan
rule change. The four-act authored schedules and rewards compare exactly; the
Normal/Hard production durations and peak counts may shift with HP and speed.
For the existing policy, simulated combat seconds are Normal **375.17 →
381.10** and Hard **408.10 → 413.13**; Easy remains **342.85**. No build or
observed human time is included. Existing-policy end banks stay 2237/3832
and 1946/3332 because those plans still kill the same enemies and make the
same purchases. Normal expansion-heavy loses the third Titan bounty; Hard
firewall-only loses one Hacker bounty.

The Normal existing policy records shield removal **3463.1 → 3781.0**, slow
and vulnerability applications **248 → 261** each, aura-present shots
**960 → 1002**, and passive Dharma **102 → 102**. Hard existing records
shield removal **4211.0 → 4551.1**, slow/vulnerability **302 → 309** each,
aura-present shots **1326 → 1328**, passive Dharma **102 → 102**. These
describe actual combat work under the new HP and speed. Capped shield removal
can include repeat Titan regeneration; status counts include refreshes; aura
shots indicate support presence. None allocates causal credit for lives saved.

## Earned ignored-threat and recovery probes

The [targeted runner](scenarios.mjs) records exact repeats of 18 earned wave-3
responses and six full-campaign continuations under both 1.6.0 and 1.7.0.
[Before](scenarios-before.json) and [after](scenarios-after.json) retain the
legal command logs, every recovery wave's accounts and timing, typed leaks,
seven boss outcomes and support/control activity. The common opening buys two
Firewalls and one Encryption with default funds and plays waves 1–2. `save`
buys nothing at wave 3; `central-expansion` spends 90 earned Dharma on three
Firewalls. Other wave-3 forks try one Firewall upgrade, both affordable level-3
branches and an Encryption upgrade. For recovery, the existing policy resumes
legal purchases from wave 4 through natural terminal. There are no grants,
skipped waves, entity edits or synthetic combat resolutions.

| Earned wave-3 comparison | Save 1.6.0 → 1.7.0 | Central expansion 1.6.0 → 1.7.0 | Later recovery at 1.7.0 |
| --- | --- | --- | --- |
| Easy | 20 → 20 lives, no leaks | 20 → 20, no leaks | Both win at 20; all bosses killed. |
| Normal | 20 → **18**, two Script Kiddies leak | 20 → 20, no leaks | Save recovers to victory at 18; expansion wins at 20. |
| Hard | 15 → **13**, four Kiddies and one Agent leak on wave 3, plus two Kiddies already leaked on wave 2 | 20 → **18** from the two wave-2 leaks, with no added wave-3 leak | Both win with all bosses killed, at 13/18 lives. |

For the 1.7.0 Normal wave-3 fork, saving lasts 26.83 s versus 15.83 s after
central expansion; a single level-2 Firewall or either affordable level-3
Firewall branch also avoids a leak. Hard saving lasts 25.38 s, central
expansion 16.07 s; the central response avoids the additional five wave-3
leaks. These are combat times, not observed player deliberation. The
full-campaign recovery demonstrates a scripted route after a mistake; it does
not show that a player understood the threat or found that route.

## Compatibility, verification and open gates

Combat meaning changes, so the balance version is **1.7.0**. Snapshot wrapper
and state remain **schema v4** in `dharmapala-shield/save/v2`: no saved field
shape changes. Anonymity remains a numeric save/ledger key with zero active
supply and prices. [The captured 1.6.0/v4 paused Hard wave-11
run](old-1.6.0-v4-save.json) was earned through production combat and contains
a live Hacker. Current validation rejects old bytes before session swap,
retains them verbatim, blocks overwrite, permits export and requires explicit
Reset saved run. Preferences and the latest recovery archive survive reset;
export before reset for durable retention. Relabeling old HP/speed to 1.7.0
fails enemy balance validation. Old runs require a matching old build. All
historical evidence and the pinned M3.5 1.4.0 build stay unchanged.

The adapted M4.4 full-campaign simulation replays Easy/Normal/Hard existing
victories and Hard weak-placement natural defeat through production 1×, 2×,
mixed 1×/2×, pause and JSON restore lanes. It checks identical commands,
fixed-clock state/runtime parity, earned build/Raid/Titan/defeat checkpoints,
each report, resources, typed leaks, hit accounting, deliberate starts and
terminal freezing against the current 21-run report. [The clean-checkout
script](verify.sh) runs locked installation, Chromium, fresh build, five test
suites, exact current and targeted evidence regeneration, historical
economy/tradeoff checks and pinned archive preservation. A detached clean
checkout at implementation commit **`d0bd766`** started without
`node_modules` or `dist` and passed the full script. [The complete
log](validation.txt) records Node 24.22.1, npm 11.9.0, Chromium
149.0.7827.55 and every command/result:

| Clean-checkout check | Result |
| --- | --- |
| Locked install, Chromium install, fresh build | Pass |
| Unit / integration / simulation | 142 / 66 / 13 passed |
| Browser / accessibility | 103 / 14 passed; scanned axe views reported no serious or critical findings |
| Current 21-run report, summary, baseline, counterplay, targeted before/after and old-save regeneration | Byte-identical |
| Historical M3.3 economy, M3.2 tradeoffs and copied 1.6.0 content | Byte-identical |
| Prior evidence and pinned M3.5 archive SHA-256 | Preserved |
| Diff whitespace and clean detached worktree | Pass |

[Hosted PR #34 CI](ci.txt) passed the same five suites on Ubuntu / Node 22
at implementation/documentation head `d168661`; GitGuardian also passed. The
run is separate from the detached Node 24 check. The hosted-result note itself
is a later evidence-only commit, whose PR checks are observed separately.

M3.2 specialization retention, M3.5 collection, the human M3 gate and M4
human acceptance remain **open**. Fixed scripts, deterministic repeats,
automated browser checks and activity counts establish no player
understanding, actual difficulty, build diversity, observed play time or
replay intent. Chromium emulation and axe also do not establish physical-device
or screen-reader usability. M4.5, M5 and M6 are outside this change.

## Reproduce

From the repository root:

```bash
node design/reviews/2026-11-13-m4.3/scenarios.mjs --old /tmp/m43-scenarios-before.json
node design/reviews/2026-11-13-m4.3/scenarios.mjs --current /tmp/m43-scenarios-after.json
npm run balance:report -- --output=/tmp/m43-results.json
node tools/balance/summary.mjs /tmp/m43-results.json /tmp/m43-summary.md
node tools/balance/counterplay.mjs /tmp/m43-counterplay.json
node design/reviews/2026-11-13-m4.3/capture-old-save.mjs /tmp/m43-old-save.json
node design/reviews/2026-11-13-m4.3/compare.mjs
node --test tests/sim/campaign-continuation.test.js
bash design/reviews/2026-11-13-m4.3/verify.sh > /tmp/m43-validation.txt 2>&1
```

The last command requires a detached checkout of the implementation commit
without `node_modules` or `dist`. The script compares every regenerated file
with the checked-in evidence and finishes with a clean-worktree check.
