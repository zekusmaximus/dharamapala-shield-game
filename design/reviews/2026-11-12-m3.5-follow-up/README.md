# M3.5 follow-up · existing preparation, human gates still open

On 2026-11-12 fetched latest main **fc43adf7f944b2fd8d82b4738e2dae4f90eb0cf1**
(M3.4 / PR #28), then created `m3.5-first-five-playtest-preparation` from it.
Discovery found existing open [PR #29](https://github.com/zekusmaximus/dharamapala-shield-game/pull/29),
branch `m3.5-first-five-playtest`, head **0cdba16**. Fast-forwarded to that work
and continued the same PR rather than creating a duplicate. Its existing
[M3.5 kit](../2026-11-12-m3.5/README.md), build archive and verification records
are preserved byte-for-byte. This directory records the follow-up separately.

No applicable AGENTS.md was found in the checkout or workspace parents. Read
ROADMAP.md, CONTENT_SCHEMA.md, the historical 2026-11-11 code review and every
M1/M2/M3 verification README. The code review is historical evidence, not a list
of current defects; [M3.4](../2026-11-12-m3.4/README.md) is the latest implemented
baseline.

## Evidence availability and remaining real sessions

[discovery.txt](discovery.txt) records exact commands/results for main, remote
branches, M3.5 PR search, PR #29 and #28 discussion/reviews, repository issues,
and existing kit inventory. PR #29 already had passing hosted CI, a pinned
archive and blank tools, **no actual observations**. No sessions were supplied
in this conversation, found in those repository sources, or conducted here.
This does not establish that no privately held observations exist elsewhere.
No recruitment messages were sent; no people were invented or simulated.

The next evidence needed is **at least five first-time players**, playing the
unchanged first five waves with real resources, plus a **smaller group of two
or more returning players** in separate sessions linked to their same-build,
same-difficulty earlier results. Immediate retries are recorded within the
initial session. Use the pinned [build instructions](../2026-11-12-m3.5/BUILD.md)
and neutral player card. Record build/spending/saving, first confusion, all
losses and explanations, planned and actual retry changes, counter understanding,
affordable specialization opportunities and reasons, replay intention, and wall
timing. Human collection remains the next action for a facilitator with access
to real participants, not something automation can substitute for.

## Preparation revisions only

The original kit covers the requested preparation. Review identified these
recording ambiguities before anyone used it:

- The original debrief asks what to change after losses/leaks; a player with a
  perfect result also needs an explicit neutral next-adjustment question.
- The original strict unaided criterion and its neutral response to a help
  request leave ambiguity about scoring a reminder before Start Wave.
- Recruitment/exclusion history and final gate judgments need blank worksheets.
- Different choices across different tower types alone cannot establish a
  defensible tradeoff within either specialization pair.

[PROTOCOL_ADDENDUM.md](PROTOCOL_ADDENDUM.md) resolves these as protocol
**m3.5-pilot-2**, with no changed player task or client. Use its
[blank session template](session-template.json),
[header-only recruitment ledger](recruitment-ledger-template.csv) and
[blank gate worksheet](GATE_WORKSHEET.md) alongside the original observation
sheet and analysis plan. The addendum documents the new fields; the original
data dictionary still applies to the rest. No practice or populated human
records are present. A future practice copy must be explicitly labelled and
stored separately from real observations.

## Honest gate assessment

| Roadmap question | Available human evidence / conclusion |
| --- | --- |
| Four of five new players start unaided, explain a successful counter and a useful next adjustment? | Zero observed. Unknown; no pass. Score all three for the same person, with supporting records. |
| Returning players improve through a deliberate change? | Zero paired sessions. Unknown. Record plans before play and actual changes/results; tied perfect runs are inconclusive. |
| Different defensible specialization choices? | No human opportunities, choices or reasons. Both tower pairs remain provisional; funded fixtures and policy choices do not settle retention. |
| Choices and counterplay understandable under real resource constraints? | No human records of banks, blockers and explanations. Unknown. Earned M3.3/M3.4 automation is separate evidence. |

There are no observed human durations: **4–7 minutes** and **60–90 seconds**
remain provisional observation targets. Do not insert waiting, force speed,
coach a purchase, grant funds or exclude unfavorable results. This pilot cannot
yield population win rates or statistically representative engagement claims.

**M3.5, M3.2 specialization retention and the broader M3 gate remain open.**
No observed or reproduced gameplay defect supports a first-five code/content
revision here. No balance/save version change is needed. Served source and
content remain exactly M3.4: balance **1.4.0**, schema **v4** in the existing
`dharmapala-shield/save/v2` slot, independent preferences compatible. Anonymity
is retired from active UI/supply/prices but retained numerically in accounting;
Encryption stays 50/35 and Distributor 70/60. Agent brace still warns three
simulated seconds, grants 60% maximum-health shield once for four seconds and
discards the remainder, with no refill/regeneration. Shared M3.1 scheduling,
preview caveats/deliberate starts, M1/M2 controls/accounting, support/economy,
pause/continue and 1×/2× are unchanged. No waves 6–20 redesign or M4/M6 work.

## Verification and attribution

Run the documented clean-checkout pipeline without changing old evidence:

```bash
# In a fresh detached worktree at the follow-up commit:
bash design/reviews/2026-11-12-m3.4/verify.sh > /tmp/m35-follow-up-validation.txt 2>&1
python3 design/reviews/2026-11-12-m3.5/package-playtest.py
git diff --exit-code
```

Results and exact executed commands are recorded after execution below. No
gameplay regression test is added for a documentation-only protocol addendum.
Existing regressions and byte comparisons check the preserved baseline.

Keep direct visible actions, participant explanations, facilitator inferences
and automated measurements in separate provenance arrays. Existing M2.3 limits
remain: health/shield removal, status refreshes, aura-present shots and sampled
range are activity/geometry, not caused damage or prevented leaks. A player's
explanation is not a controlled causal experiment. Automated tests/simulation,
Chromium and axe, human sessions, physical-device use and actual screen-reader
use must be reported separately. There is no new human, physical-device or
screen-reader evidence in this follow-up.
