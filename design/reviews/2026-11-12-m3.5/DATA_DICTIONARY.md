# M3.5 session record dictionary

Copy `session-template.json` once per **real, consented** session. No populated
record exists in this directory. An empty array means no item was recorded;
`null` means unknown, unobserved, declined or not applicable, with the reason in
`missingEvidenceAndReason`. Never fill an unknown with zero or infer a quote from
game state. A practice entry, if ever needed, belongs outside `real-sessions/`
and must carry `recordType: "practice-example"`.

## Session envelope

| Field | Meaning / allowed values |
| --- | --- |
| `recordType` | `real-human-session` only for an actual, consented player. Never use for a dry run, bot or facilitator test. |
| `sessionId` | Anonymous, stable ID such as `N01` or `R01`; no identity data. |
| `cohort` | `first_time` or `returning`. First-time means no prior play of this game; returning requires `priorSessionId` and recorded earlier play on the same build. |
| `priorSessionId` | Earlier record ID for a returning player; `null` for first-time. Do not substitute an immediate retry for a returning session. |
| `protocolVersion` | `m3.5-pilot-1`; change this explicitly if task wording or facilitation changes. |
| `build` | Exact archive/source commit, balance and save schema. Do not overwrite these fields when testing another build; create a new record and note the revision. |
| `consent` | Four independent booleans: observation, screen capture, audio capture, quote use. `null` before the choice is known. No raw capture or personal details go in Git. |
| `context` | Local date and IANA time zone; device/OS/browser/viewport, input, voluntarily disclosed assistive technology, difficulty, prior game exposure, return interval, in-person/remote mode and deviations. Use `null` for unknown. |
| `timing` | ISO start/end wall time, seconds elapsed from playable menu to first meaningful build/spending choice, first wave start and first wave-5 result. `stopReason` distinguishes completion, loss, voluntary stop and technical stop. No time limit is applied. |
| `attempts` | One object per start-to-loss/stop/wave-5 result. See below. An immediate retry is a new attempt within the same session. |
| `records` | Four separate provenance arrays defined below. Do not mix them into one narrative. |
| `facilitatorInterventions` | Every navigation hint or other intervention, including exact words, elapsed time and effect on unaided status. Empty if none. |
| `coverageIndex` | IDs of records answering each required question. Empty/null identifies missing evidence and cannot be scored as success. |
| `evidenceReferences` | Anonymous local IDs and types for consented notes, screenshots, save/report exports or recording held in the approved private location. No public personal-media URL. |
| `missingEvidenceAndReason` | Array of `{field, reason}` objects, for example declined capture, view obstructed, no affordable level-3 option, early stop. |

An `attempts[]` item is `{id, startElapsedSeconds, endElapsedSeconds,
maxWaveReached, waveFiveOutcome, livesAtEnd, leaksByType,
preAttemptPlanExplanationId}`. `waveFiveOutcome` is `cleared`, `lost`,
`not_reached` or `stopped`; `leaksByType` maps enemy IDs to counts from a visible
report when available. If a number was not visible, use `null` and say why.

## Provenance arrays

All record IDs are unique within a session. Every elapsed time is a nonnegative
wall-clock second from the playable menu; wave is 1–5 or `null`; phase is the
visible build, wave, pause, menu or result phase. Use an evidence reference when
there is a capture; timestamped written notes are still direct observation.

| Array / item fields | What may be recorded |
| --- | --- |
| `directObservations[]`: `{id, elapsedSeconds, attemptId, wave, phase, kind, description, resourcesBefore, resourcesAfter, price, affordability, evidenceRef}` | Visible action or state only: placement coordinates/tower, spend/sale, preview/inspector use, warning/report, confusion behavior, request for help, wave result, typed leak, loss, retry, specialization offered/chosen, replay action. `resourcesBefore/After` have numeric `dharma` and `bandwidth` or are `null`; Anonymity is retired from active play. `price` uses the same active-resource keys. `affordability` is `affordable`, `blocked_dharma`, `blocked_bandwidth`, `blocked_both`, `phase_locked`, or `not_visible` when applicable. |
| `participantExplanations[]`: `{id, elapsedSeconds, question, wording, verbatim, relatedObservationIds}` | What the player actually said or wrote about confusion, loss, intended retry, counter, next adjustment, specialization and replay. `verbatim` is a boolean; if false, label as facilitator paraphrase and do not use quotation marks. Capture uncertainty and “I don't know.” The question itself is retained to expose prompting. |
| `facilitatorInterpretations[]`: `{id, claim, basisIds, alternativeOrUncertainty}` | A hypothesis about understanding, causation or intent, citing direct observations and/or participant explanations. It cannot replace a missing observation or quote. |
| `automatedMeasurements[]`: `{id, instrument, version, buildCommit, method, output, units, evidenceRef, limitation}` | Instrumented measurements only, such as a consented recording timestamp analysis or a save/report parser. Include method, exact output, units and limits. Historical simulator, Chromium and axe outputs stay in their own automated evidence, never as a human-session record. |

Suggested `kind` values for direct observations: `menu_action`, `tutorial`,
`build_place`, `build_upgrade`, `build_sell`, `build_unspent`,
`specialization_offered`, `specialization_chosen`, `inspect`, `start_wave`,
`speed_change`, `pause`, `warning`, `confusion`, `help_request`, `leak`,
`wave_result`, `loss`, `retry`, `stop`, `replay_action`, `technical_failure`.
Record an offered but unaffordable branch with its exact bank/price and blocker.
Do not count it as a chosen specialization. Record build/spending choices for
every attempt, including a conscious decision to save if the player says so.

`coverageIndex` links the first confusion, **all** build/spend and loss events,
pre-retry explanations, counterplay explanations, specialization events and
reasons, and replay-willingness explanation. A participant who never sees an
affordable specialization has an empty choice index and a missing-evidence reason,
not a guessed preference. Willingness to replay is a stated intention; actual
voluntary replay is a separate direct observation.

Timing rules: first meaningful choice is the first placed tower, upgrade,
sale, or explicit spending/saving decision with a visible consequence. Merely
selecting a palette tab or dismissing the tutorial is not that choice. Wave-5
result is the first actual wave-5 clear/loss on that attempt, not a simulated
report or an estimated 2× conversion. Record ordinary pauses and retries; do not
subtract them from the session clock. Simulated combat time, if read from a
report, must have its own `automatedMeasurements`/direct-observation entry and
cannot replace wall time.
