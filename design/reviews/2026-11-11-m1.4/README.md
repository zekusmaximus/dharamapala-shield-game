# M1.4 combat state and description verification

Verified 2026-11-11 on `fix/m1.4-combat-state`, based on main `63d59a2`
(M1.3, PR #16). No applicable `AGENTS.md` was present in the checkout or
workspace parent. The historical review and M1.1–M1.3 evidence are unchanged.
This completes M1.4 only; M1.5 CI remains, so M1 is still partial.

## Findings checked before changes

- **R05:** Two enemies at the exit with one life produced two live leaks from one
  step but only one captured final leak. The enemy loop continued after game over.
- **R06:** A Titan with no shield hit at game time 2000 ms retained its old 1000 ms
  cooldown and regenerated 13.32 shield during the next one-second update.
  Raid Team EMP could mark a Distributor disabled while its nearby attacker's
  fire-rate aura remained 1.12×. Wave-clear income still counted the disabled
  Distributor.
- **R07:** A level-2 Firewall derived a nonzero slow percentage with zero slow
  duration, and its inspector advertised `4% slow`. Generic scaling gave
  Distributors inert status percentages; the inspector claimed they targeted an
  enemy instead of describing their support role.

## Corrected rules

Terminal transitions stop the current fixed-clock advance, remaining systems,
enemy, projectile and tower loops, and future ticks. Resolution and wave-clear
commands reject a terminal phase. Captured final statistics include the exact
live counters, and terminal save validation checks all of them. Deterministic
regressions cover two same-tick exits, repeated resolution, later ticks, an
observer-time snapshot, repository save/load, browser local persistence, and a
continuing combat snapshot restored before game over. Event-listener regressions
also verify that leak, lethal-hit and achievement callbacks cannot leave a
partly resolved terminal snapshot or continue later resolution events.

Any effective hit to a Titan shield or health refreshes its three-second shield
cooldown. Recovery occurs only for the portion of an update after that deadline;
it is zero at the exact boundary. Tests cover absorption, depletion with health
overflow, repeated health hits, the boundary, subsequent recovery, and continued
combat after a damaged-shield save/restore.

Raid Team EMP disables active Distributor fire-rate support while the tower is
disabled (`disabledUntilMs > gameTimeMs`); the aura returns at expiry. The
Distributor's capped wave-clear resource bonus is passive ownership income and
still counts an installed Distributor even when disabled at clearance. Runtime
fire timing uses the shared time-aware aura rule, so the simulator uses the same
behavior. A real Raid Team phase, fire cooldown, expiry, passive income and
continued wave-result equivalence are tested. The rule is stated in the balance
description, inspector and player README.

Derived slow/vulnerability percentages now stay zero when their application
duration is zero; this does not add a combat effect. Browser interactions place
and upgrade a Firewall to level 2 and confirm that the visible inspector says
`Direct damage` without a slow claim. A separately placed Distributor is shown
as non-attacking support with its fire-rate aura, EMP behavior and wave-clear
bonus; it no longer claims to target an enemy. The broader inspector and combat
feedback work remains in M2.

## Save and balance compatibility

Balance version remains `1.0.0`, save schema remains v2, and no numeric reward,
HP, tower-power or other balance value changed. Existing valid saves continue
under corrected combat rules; their later outcomes can differ from the old buggy
runtime. Bumping the balance version without a migration would reject all valid
in-progress v2 runs, so no version bump is made for this corrective milestone.

An old `1.0.0` game-over save can contain more live leaks than captured leaks
because of R05. Loading repairs only that known same-wave discrepancy when the
other final fields agree, clones the input, then validates the entire candidate.
New saves always agree. Unrelated invalid payloads still use M1.3's preserved
raw-payload export/reset recovery rather than being silently accepted.

## Validation

Node 24.22.1, Playwright 1.61.1, headless Chromium 149.0.7827.55. Chromium was
installed in a writable workspace cache. The client was rebuilt before browser
testing.

| Command | Result |
| --- | --- |
| `npm run build` | Pass |
| `npm run test:unit` | 63 passed |
| `npm run test:integration` | 18 passed |
| `npm run test:sim` | 2 passed |
| `npm run test:e2e` | 43 passed, including normal browser interactions for corrected inspector text and same-tick terminal persistence |
| `npm run test:a11y` | 7 passed; existing menu, build, dialog and recovery scans retained |
| `node tools/review/baseline.mjs` | Completed; [current diagnostics](baseline.json) compared with M1.3 and historical review snapshots below |
| `git diff --check` | Pass |

The corrected mechanics probes are now: same-tick terminal live/final leaks
`1/1` (previously `2/1`), Titan cooldown `5000 ms` with shield `0` after a
recent health hit (previously `1000 ms` and `13.32` shield), and disabled support
multiplier `1` (previously `1.12`). The five malformed-save diagnostic results
and input snapshot isolation result did not change.

All 12 scripted policy/difficulty campaign results retain their victory/defeat
outcome and finishing wave. Eight campaign records are identical. Four changed:
Easy Firewall-only simulated time `391.833 → 391.217` seconds; Normal reference
`413.217 → 409.7`; Normal no-support `438.483 → 438.283`; and Hard no-support
`487.567 → 485.15`. Hard no-support also finishes with 19 rather than 16 lives,
one rather than four leaks, 318 rather than 315 kills, and resources
`2049/3911/2935` rather than `1964/3865/2899` (Dharma/Bandwidth/Anonymity).
The no-support policies cannot receive a Distributor aura, so their changes
follow the corrected Titan shield timing. To check attribution, the diagnostic
was also run in temporary copies of main `63d59a2`: one with only the new
CombatSystem/EnemySystem files (shield path and their phase guards), and one with
only the new tower-rule/DefenseSystem files (EMP path). The shield-path copy
reproduced the Easy Firewall-only, Normal no-support, and Hard no-support changes;
the EMP-path copy reproduced Normal reference's `409.7` seconds. Neither copy
changed the other three records. The temporary copies were removed after the
comparison. These are deterministic policy observations, not balance targets or
human win rates; known-bug outcomes were not locked in.

Browser results use headless Chromium pointer and touch emulation, keyboard
input, and axe scans of semantic UI outside the gameplay canvas. They do not
establish physical-device, screen-reader, Safari/Firefox, manual gesture or
human playtest behavior. M1.5 CI, M2 inspector/combat feedback, full-campaign
combat validation and broader device checks remain separate roadmap work.
