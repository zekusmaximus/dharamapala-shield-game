# M3.5 pilot protocol 2 · use with the existing kit

Use this addendum with the original [facilitator guide](../2026-11-12-m3.5/FACILITATOR.md),
[participant card](../2026-11-12-m3.5/PARTICIPANT_TASKS.md),
[observation sheet](../2026-11-12-m3.5/OBSERVATION_SHEET.md), and
[analysis plan](../2026-11-12-m3.5/ANALYSIS_PLAN.md). Their originals remain
historical artifacts. The player card and pinned client are unchanged. Use
`protocolVersion: "m3.5-pilot-2"` for sessions using these clarifications; do not
relabel any older records. There are no real sessions under either protocol yet.

## Enrollment and denominator

Use the header-only [recruitment ledger](recruitment-ledger-template.csv) from
the first invitation. Keep contact details and consent forms privately, outside
Git; the ledger uses anonymous enrollment IDs. Record invited, declined,
scheduled, started, completed, stopped and excluded outcomes, with dates and
reasons. An invitation is not a participant observation. Do not prefill rows
with fictional people. Do not contact participants on the authority of this kit.

Eligibility is no previous play of this game for the new-player group, and a
recorded prior same-build session for the returning group. Establish eligibility
and comparison difficulty before gameplay. Fix the first five eligible,
consenting, started new-player sessions in start order for the four-of-five
gate. Record additional players separately, including any replacement sessions;
do not substitute their successes into that denominator. An early stop, request
for help, loss, technical failure or missing answer must remain in the audit:
unknown is not a pass. A withdrawal of consent takes precedence over data
retention; record only a permitted anonymous missing-data count/reason and do
not silently replace it with a successful result.

Target Normal difficulty; preserve the participant's control of difficulty and
speed. Analyze other difficulties separately and mark the common Normal pilot
incomplete if fewer than five comparable eligible sessions remain. Do not pool
difficulties, protocol revisions or changed clients to reach a threshold.

Recruit two of the new players for separate returning sessions on the same
archive and difficulty, with fresh run/preferences and linked earlier records.
Record elapsed interval and intervening exposure without imposing a delay. An
immediate retry remains an attempt in the original session. Additional returning
sessions are welcome while that group remains smaller than the new-player group.

## Complete the debrief for wins as well as losses

After the original open debrief prompts, ask every player, including players
with no loss: **“If you played again, what is one thing you would change next,
and why?”** Ask before any optional retry. Do not name a tower, branch, enemy,
currency or proposed solution. Record the question, answer (or uncertainty),
its related observed result, and whether the proposed adjustment is legal and
affordable from the observed bank or documented reachable income. The player
need not retry for this explanation to be recorded. A retry still requires a
separate record of the actual change and outcome.

The general opening statement is the only facilitator instruction before an
unaided start. If “Use anything in the game you think may help” or any other
response to a help request is given before Start Wave, log it as an intervention;
score the strict unaided criterion false. Built-in tutorial use is allowed.
This resolves the original guide's ambiguity about that neutral reminder.
Never withhold help to obtain a passing record: help when needed, then retain
the assisted result honestly.

## Judge the gate without supplying a strategy

Use the blank [gate worksheet](GATE_WORKSHEET.md) after sessions, not as a player
task. Each judgment cites observation and explanation IDs, or remains unknown.
The four-of-five conjunction uses the same player's unaided start, explained
successful counter and useful next adjustment. A wave clear alone does not
demonstrate counter understanding. Keep the reported compatible outcome separate
from the player's causal explanation and the facilitator's inference.

For specialization diversity, tabulate **each attacking tower's own choice
pair**: Firewall Focus/Coverage and Encryption Sustained control/Chain reach.
Two people choosing Focus and Sustained control are using different towers;
that alone does not show a tradeoff within either pair. Record all affordable
opportunities, declined choices, reasons, and whether both alternatives were
visible. Look for different defensible choices within a pair under earned
resources and actual placement/threat constraints. Report each pair separately;
evidence for Firewall does not settle Encryption retention. If no such
opportunities arise, record unresolved. Do not fund or steer a branch task
inside the natural first-five pilot. Any later prompted task needs its own
protocol and evidence category.

For each returning player, retain the stated pre-run change, enacted change,
and matched result. Use the original later-wave/lives/leaks comparison. A prior
five-wave clear at 20 lives can create a ceiling: tied perfect results are
inconclusive for improvement. Do not raise difficulty, force a poor first build,
use time alone, or choose a worse prior attempt to manufacture improvement.
State how many of the returning group improved and which comparisons were tied,
worse or unavailable. The roadmap supplies no numerical returning-player
threshold; report group evidence for review rather than inventing one.

Record first meaningful choice and slice wall times exactly as observed. Earlier
than 60 seconds or outside 4–7 minutes is still valid evidence. Include ordinary
reading/building/pauses; record retry and interruption boundaries separately.
Never add waiting or pace instructions to make a target. Preserve all original
resource, report-attribution and evidence-source distinctions.

## Structured recording changes

Copy [session-template.json](session-template.json) for a real, consented session.
It retains the original [dictionary](../2026-11-12-m3.5/DATA_DICTIONARY.md) with
these additions:

| Field | Meaning |
| --- | --- |
| `recordType` | Starts as `unfilled-template`; set `real-human-session` only after actual consented observation. Practice copies must use `practice-example` in a separate practice directory, never `real-sessions/`. |
| `context.servedOrigin` | Actual HTTP(S) origin used, without credentials or private access tokens. |
| `context.freshProfileConfirmed` | Boolean after checking empty run/preferences; null if unknown. Record deviations rather than destroying existing save bytes. |
| `coverageIndex.unaidedStartObservationIds` | Opening legal build and first deliberate start IDs; consult all interventions separately. |
| `coverageIndex.nextAdjustmentExplanationIds` | Player's next-adjustment answers, including a win with no retry. |
| `coverageIndex.resourceConstraintObservationIds` | Actual banks/prices/blockers supporting resource and affordability judgments. |

All other fields retain their meanings. Empty arrays and nulls are missing
evidence, not zero outcomes or passes. Each worksheet assessment cites record
IDs; it is interpretation, not an additional observation. Keep raw capture and
identity data out of this repository. Human observation, automated measurement,
physical-device use and actual screen-reader use must remain separately labelled.
