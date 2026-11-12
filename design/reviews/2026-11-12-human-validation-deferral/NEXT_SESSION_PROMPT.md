Continue the roadmap in zekusmaximus/dharamapala-shield-game from latest main.

The user has explicitly deferred human playtest collection so engineering can
continue under provisional assumptions. Read the decision record in
design/reviews/2026-11-12-human-validation-deferral/README.md. **Missing human
observations do not block this task.** Do not repeat external searches for
participant records, recreate the M3.5 kit, or produce another preparation-only PR.

M1, M2.1–M2.6, M3.1, M3.3 and M3.4 are complete within their documented automated
scope. PR #29 merged M3.5 preparation at c471f23. M3.5 collection is deferred;
M3.2 specialization retention and the broader human M3 gate remain open. No actual
player observations were available when the deferral was recorded. Deferral is
not completion. Do not infer engagement, difficulty, readability or build diversity
from policies, funded/earned fixtures, Chromium or axe.

Fetch latest main and create a dedicated branch. Read applicable AGENTS.md,
ROADMAP.md, design/CONTENT_SCHEMA.md, design/CODE_REVIEW_2026-11-11.md, and the
M1/M2/M3 verification READMEs. Treat the code review as historical evidence;
current implementation evidence is in design/reviews/2026-11-12-m3.4/. Check
whether M4.4 work already exists before adding coverage.

Work on **M4.4 automated verification of existing complete runs only**. Existing
M2.4/M3.4 tools already run seven policies on three fresh difficulty configurations
and repeat them deterministically. Audit that coverage and the selected-wave /
five-wave speed and continuation tests. Reuse them; add the missing full-campaign
guarantees rather than duplicating the reporter.

Use fresh production games with default resources/lives and authored waves in
order. Purchases, upgrades and specializations must use normal commands. After
Start Wave, use actual clock, spawning, movement, targeting, projectiles, statuses,
boss abilities, kills/leaks, rewards and reports. No grants, wave skips, entity
edits, direct hits, synthetic kills or direct clears may establish campaign
outcomes. Preserve lifecycle fixtures separately.

Cover Easy, Normal and Hard, including successful plans and a naturally defeated
poor plan. Verify:

- Full-run 1×/2× equivalence through the production fixed clock, including speed
  changes and pause, with equal credited simulated time and honest treatment of
  terminal/build boundaries.
- Uninterrupted versus JSON-serialized, paused/restored continuation across
  campaign checkpoints, including earned mid-boss states, subsequent purchases,
  reports and natural terminal outcomes. Check that continued play does not
  mutate source snapshots. Compare meaningful state/runtime; exclude only
  documented incidental fields such as wall-clock save timestamps.
- Repeatability of the same legal command sequence, exact per-wave and total
  resources/lives/typed leaks, capped health/shield accounting, support/control
  activity, terminal freezing and deliberate next-wave starts.

Choose a bounded checkpoint/scenario matrix that closes the gaps without a huge
duplicated Cartesian product. Document its rationale and limits. Repeats show
reproducibility; difficulties share a map/roster and are not independent player
trials. Status applications, aura-present shots and range samples are activity /
geometry measures, not caused damage or prevented leaks.

Preserve balance 1.4.0, snapshot schema v4 in dharmapala-shield/save/v2,
independent preferences and current recovery. Anonymity stays retired from active
supply/prices/UI with its numeric accounting/save key retained. Encryption stays
50 Dharma/35 Bandwidth and Distributor 70/60. Level-3 specializations stay
explicit and provisional. Agent brace warns three simulated seconds, grants 60%
maximum-health shield once for four seconds, then discards the remainder; no
refill or regeneration. Preserve M3.1's shared scheduling compiler, preview
timing/caveats and deliberate starts; preserve all M1/M2, economy/support,
pause/continue and 1×/2× behavior.

Make only narrow runtime fixes for defects reproduced by this verification,
with focused regressions. Do not redesign waves, bosses or the economy, add
speculative mechanics, or begin M4.1–M4.3, M4.5, M5 or M6. Follow the content
contract if changed meaning or derived save state requires explicit versioning
and retained-byte export/reset recovery; never silently reinterpret old runs.

Record commands, results, scenario/checkpoint definitions, comparisons,
attribution limits and remaining gates in a new M4.4 evidence directory. Preserve
historical artifacts and the pinned M3.5 build/kit. Compare current diagnostics
and campaign reports with M3.4 and corrected historical reports. Run the
documented clean-checkout pipeline and required checks. Update ROADMAP.md with
actual automated results only. Do not mark M3.5, specialization retention, the
human M3 gate or M4 as a whole complete.

Commit, push and open a focused PR ready for review after CI passes. Do not merge.
