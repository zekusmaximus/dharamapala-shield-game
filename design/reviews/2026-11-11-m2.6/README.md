# M2.6 content contract verification

Started from latest main `133bf9f` (M2.5, PR #23) on dedicated branch
`feat/m2-6-content-contract`. No applicable `AGENTS.md` exists in the checkout
or workspace parents. ROADMAP.md, the historical 2026-11-11 code review, and
the M1.1–M1.5 / M2.1–M2.5 verification READMEs were read. The code review is
historical evidence; earlier review files are unchanged. This completes M2.6
only. No M3/M6 work or balance tuning was done.

## Contract and compatibility

The [runtime content contract](../../CONTENT_SCHEMA.md) lists the active
definitions and removed inert fields. `validateBalance` checks runtime-used
numeric, text, color, ID and reference fields, ordered waves, EMP phases,
reinforcement composition, Titan shield settings, status strengths/durations,
chain settings, and derived tower stats. Unknown properties are rejected so
metadata cannot appear to control a nonexistent mechanic. The pre-existing
`special` labels, boss `phases`, burn, interest, growth/TTK and delay metadata
were removed from current content. Raid Team EMP and minions, Titan shield,
status progression and chain parameters now come from validated shared
definitions used by combat, saves and presentation as appropriate. The exact
pre-M2.6 numbers were retained.

Balance remains `1.0.0`; save schema v2, save key, settings and preference key
are unchanged. Existing valid v2 saves continue with the same derived numeric
state. The corrected M1.4 diagnostic result below also checks continuation
probes. Future gameplay or derived-stat changes require a new balance version
and explicit migration or the existing export/reset recovery flow. Neither was
needed for this structural content change.

## Focused tests and evidence limits

- Twenty-two malformed-content fixtures exercise required display/economy/wave
  fields, invalid boss/status/chain parameters and reintroduced inert metadata.
  They prove rejection and input isolation, not combat behavior.
- Four integration checks run production targeting, firing, impacts, movement,
  boss phase handling, scheduling, shield recovery and save validation with
  deliberately changed **test-only** definitions. They show that the runtime
  reads the shared definitions. These controlled scenarios skip to waves 5/15,
  position entities or set boss health to reach an ability, and construct some
  impacts directly. They do not establish full-campaign outcomes or human play.
- The unchanged M2.4 reporter runs all seven policies on fresh Easy, Normal and
  Hard 20-wave production campaigns, with an exact repeat per combination.
  Current results match its recorded gameplay and repeat hashes. Its three
  difficulty configurations share one map/roster; repeats are reproducibility
  checks, not independent challenges or player win rates. M2.3 attribution
  limits still apply to reports.
- Existing M1/M2 browser checks cover inspection, combat text, semantic wave
  reports, save/preferences, deliberate starts, speed controls, portrait and
  landscape interactions. Axe checks scanned semantic HTML outside the canvas.
  These are automated headless Chromium pointer, emulated touch, keyboard and
  axe checks. They are not physical-device touch, screen-reader, Safari/Firefox,
  manual accessibility, performance or human difficulty/engagement evidence.

## Clean-checkout results

A fresh detached worktree at implementation commit `7e29d94` began without
`node_modules/` or `dist/`. Node 24.22.1, npm 11.9.0, Playwright 1.61.1 and
Chromium 149.0.7827.55 were used. Locked npm install used
`/tmp/dharamapala-m26-npm-cache`. Playwright installed/reused Chromium at
`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`; local system
libraries were already present. Browser suites ran with `CI=1`, their own
server and freshly built output. [Full passing output](validation.txt) records:

| Command | Result |
| --- | --- |
| `npm ci --cache /tmp/dharamapala-m26-npm-cache` | Pass |
| `npx playwright install chromium` | Pass |
| `npm run build` | Pass, fresh `dist/` |
| `npm run test:unit` | 100 passed |
| `npm run test:integration` | 35 passed |
| `npm run test:sim` | 7 passed |
| `CI=1 npm run test:e2e` | 69 passed |
| `CI=1 npm run test:a11y` | 10 passed, no serious/critical axe findings in scanned UI |
| `git diff --check` | Pass |

The [initial clean attempt](initial-validation.txt) reached simulation testing
with the new content hash and failed one M2.4 evidence assertion that compared
the entire historical JSON, including that hash. The other six simulation
checks passed. The assertion now verifies the current content bytes' hash
independently and compares all gameplay fields with M2.4; historical evidence
was not edited. The detached worktree was recreated from the corrected
implementation commit before the passing sequence above.

After the pipeline, the same clean worktree ran:

```bash
node tools/review/baseline.mjs > /tmp/m26-baseline.json
cmp /tmp/m26-baseline.json design/reviews/2026-11-11-m1.4/baseline.json
npm run balance:report -- --output=/tmp/m26-results.json
node tools/balance/summary.mjs /tmp/m26-results.json /tmp/m26-summary.md
# Parse both report JSON files; compare after omitting only balanceSha256.
cmp /tmp/m26-summary.md design/reviews/2026-11-11-m2.4/summary.md
sha256sum design/balance.json /tmp/m26-baseline.json /tmp/m26-results.json /tmp/m26-summary.md
```

The exact Node comparison command and output are in validation.txt. The legacy
diagnostic is byte-identical to the corrected M1.4 baseline (SHA-256
`63f3f0133cfa2b0c926493f1d6c7d737e93ec2df52524d39d62fff5a12034bbc`).
The M2.4 report's old `balanceSha256` was
`8a177078049779085d695c27f80c434de7bb27092215ff6b22ec58e6e708cca3`;
the new content file hashes to
`77d0377e30da378f50ebc1fa10ea61921cb024ef2bdfb19fd2b34e551eed7c10`.
Every other report field, including all 21 policy/configuration runs, their
waves, ledgers and repeat digests, matches M2.4. The regenerated report file
hashes to `5bfa2aedba0091c67e082b73b156c67377e3c934b62a3c97407e622a3defc94a`.
The derived summary is byte-identical to M2.4 (SHA-256
`a7cd9ac0cf1c60f61f4b72c06eb5ee458f5c737141b33c30e3f8c7bf9fa709eb`).
The content hash difference is structural data provenance, not a gameplay
result.
