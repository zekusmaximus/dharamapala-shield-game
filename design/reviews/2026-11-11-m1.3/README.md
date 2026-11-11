# M1.3 saves and preferences verification

Based on main `3a0745f` (PR #15), with M1.1 from PR #14 / `5a58d36`.
No applicable AGENTS.md files were found in the checkout or workspace parents.
Historical review, M1.1 and M1.2 evidence remains unchanged.

## Verification and implementation

R02 was reconfirmed against main before modifying the validator: required
resources, lives, wave bounds, levels and scheduler content were unchecked, and
restore shallow-copied nested arrays. The isolated original-main probes in
[r02-before.txt](r02-before.txt) reproduce acceptance and the next-tick exception,
and show restored boss phases mutating the source save. R04 was reconfirmed in
bootstrap's save-event list and createState/restart/menu code: new/restarted,
wave-start and terminal transitions were not durable, and range/motion settings
were recreated from defaults. Browser regressions now exercise those transitions.

The validator checks balance inputs and derived costs/stats, full required save
structures, resources, allocated and unique entity IDs, build positions and
spacing, tower levels, enemy path positions and balance-derived runtime values,
projectile references/status fields, boss phase arrays, scheduler content/order/
cursor/time/generation, wave accounting, clock, random state, preferences, phases,
and result structures. Dead projectile targets and reinforcement sources may be
absent from the live enemy map; their IDs must still be valid allocated IDs.
Effects are currently unused and nonempty effect payloads are rejected.
Reconstruction validates and copies the entire candidate before application
session replacement; exports also deep-copy all nested mutable state.

Run autosaves include new/tutorial runs, restart, wave start, resume, build
changes, pause, wave completion and terminal transitions. Wave-completion and terminal persistence
runs in a microtask after the current synchronous tick finishes, avoiding a
partially processed combat-loop snapshot. Menu navigation saves the departing
run, without replacing it with an empty menu save. Terminal combat correctness
(including the known final-statistics same-tick defect) remains M1.4; no combat
rule or balance value was changed here.

Preferences use `dharmapala-shield/preferences/v1`, separately from the v2 run.
New games, restart and menu preserve all three preferences. On Continue, the
independent preference record takes precedence; older v2 saves supply fallback
preferences when no preference record exists. The old tutorial-completed key
remains readable. Preference writes do not require an active run.

## Recovery and compatibility

Only schema 2 with an exact balance-version match resumes. A new balance version
must explicitly migrate a run or retire it through this recovery flow; never
silently reinterpret its combat state. No balance migration is claimed. Existing
legacy refund migration remains, and its candidate now passes current validation
before acceptance. Its original legacy key is retained until explicit reset.

Startup probes the saved candidate before any new run can overwrite it. Invalid
JSON, invalid state and incompatible versions preserve the exact original raw
payload under the original key, archive a recovery copy where storage permits,
and keep an in-memory copy. Saving is blocked until explicit Reset saved run.
The visible recovery region offers a downloadable JSON copy and reset; reset
removes current/legacy runs and leaves preferences and the archived recovery copy.
Export before reset is recommended in the UI. The archive is a single most-recent
rejected payload, not a versioned backup service; downloads remain the durable
user-controlled recovery copy. Storage acquisition, reads, writes and removal
failures are caught. Play remains available, with a visible warning that progress
or preferences may be lost on reload. In-memory recovery cannot survive reload
when the browser denies durable storage entirely.

## Regression scope

29 malformed-save cases and eight malformed-balance cases cover required fields,
invalid ranges/references, conflicting counters and runtime state. Repository
checks cover denied storage, blocked overwrite and archive retention after reset.
Continuation fixtures use production combat at waves 1, 5 and 15. They reach an
actual fired Raid Team phase / damaged Titan shield, restore, then advance both
sessions with the same varying frame deltas through the remaining combat. State
and runtime are compared every 60 frames and at completion; source-save isolation
is checked after combat. These are continued-combat checks, not merely immediate
snapshot comparisons, and not a full-campaign equivalence claim. Terminal navigation fixtures set coherent lives/wave completion before entering
results, preserving their interaction assertions. The old lifecycle
fixture now synchronizes its cursor after directly advancing the scheduler so it
represents a valid snapshot; its original assertions remain.

Browser checks use normal clicks, keys, downloads, reload and Continue to verify
restart/results/new-run/tutorial durability, completed-clock-frame saves, independent preferences, rejection before
session swap, exact corrupt-payload export, reset and denied storage. All M1.1
and M1.2 interaction regressions remain. Visibility loss on reload may persist building as PAUSED; Continue then Resume
returns to the restarted build phase. Terminal fixtures directly enter results;
they verify persistence/navigation, not winning a campaign. Axe additionally scans
the recovery region. Chromium installation was required.

Validation results are recorded in validation.txt. Policy diagnostics in
[baseline.json](baseline.json) preserve all 12 historical campaign outcomes.
The diagnostic's boss save setup now steps the actual runtime instead of manually
spawning an unaccounted enemy; the historical JSON remains untouched. R02 probes
now reject malformed candidates and restored boss phases leave the source alone.

These checks use headless Chromium keyboard/pointer/touch emulation and axe
(no serious/critical violations; canvas excluded in gameplay scans). They do not
establish physical-device, screen-reader, Safari/Firefox or human playtest results.
M1.4 and M1.5 remain planned; M1 as a whole is incomplete.
