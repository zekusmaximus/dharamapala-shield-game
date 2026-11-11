# M2.4 reproducible balance report

Based on latest main `4211a55` (PR #21), branch `feat/m2-4-balance-report`.
No applicable AGENTS.md exists in the checkout or workspace parents. ROADMAP,
the historical code review and M1.1–M1.5/M2.1–M2.3 verification READMEs were
read before implementation. M2.4 was open; existing M2.3 accounting was reused.
This completes reporting only. M2 stays partial; no M2.5/M2.6 or tuning.

## Reproduction and definitions

From the repository root, with Node >=22:

```bash
npm run balance:report -- --output=design/reviews/2026-11-11-m2.4/results.json
node tools/balance/summary.mjs design/reviews/2026-11-11-m2.4/results.json design/reviews/2026-11-11-m2.4/summary.md
node tools/review/baseline.mjs > /tmp/m24-baseline.json
cmp /tmp/m24-baseline.json design/reviews/2026-11-11-m1.4/baseline.json
```

`npm run tune -- --output=/tmp/report.json` is a compatibility alias to the
same reporter. It does not search values, estimate population win rates, or
write balance data. Invalid arguments fail rather than silently changing scope.

[results.json](results.json) contains the balance version and exact file SHA-256,
fixed timestep, complete policy definitions, explicit scenario setup, each wave's
authored spawn schedule and observed pressure, boss outcomes, lives, resources,
and the unchanged production M2.3 ledger. [summary.md](summary.md) derives readable
outcome, spending, tower activity and per-wave pressure tables from that JSON.
The reporter hashes each run and checks a second exact repeat; no timestamps or
wall-clock performance values enter the results. Deterministic IDs are local to
a run. The baseline JSON is byte-identical to corrected M1.4, SHA-256
`63f3f0133cfa2b0c926493f1d6c7d737e93ec2df52524d39d62fff5a12034bbc`.

All scenarios start a fresh production game at wave 1, with default lives/resources,
seed 1337, tutorial completed and no grants or state edits. They run the authored
20-wave campaign to victory or defeat, using Easy, Normal and Hard respectively.
These are three distinct difficulty configurations of one map/roster, not three
independent random challenges. Each of seven policies is run twice: 21 comparisons
and 21 reproducibility repeats, not 42 independent trials. No seed variation is
used as evidence. Current zero-crit attackers and authored spawns do not supply
independent challenge variation through seeds.

The exact policy definitions are in results.json and `tools/balance/policies.mjs`.
All strong placements use the existing simulator's grid: sample the route every
45 world units, count samples within 205 units, rank descending, tie x then y,
and choose the first free cell at least 45 units from installed towers. Weak
placement ranks the same cells ascending, including zero coverage. Commands
still validate legality and affordability. Each policy acts only in deliberate
build phases. None sells. Expansion-heavy never upgrades; upgrade-heavy upgrades
its initial pair before adding at most one Firewall per preparation. These are
specific extreme heuristics, not representative classes of all expansion or
upgrade strategies. Counter-aware weighs the incoming roster's count × base HP ×
HP multiplier and base armor/resistance-adjusted DPS per Dharma; it ignores status,
range, projectile timing and other currencies. No claim of optimal counters.

## Findings and limits

- Existing and counter-aware win all three difficulties with 20 lives; the latter
  selects the same effective plan here. This does not prove adaptation helps.
- Firewall-only wins all three, ending Hard with 10 lives and 10 leaks.
  No-support wins all three, ending Hard with 19 lives and one leak.
- Upgrade-heavy wins all three untouched. On Hard it takes 475.133 seconds versus
  existing's 478.217 seconds; this comparison concerns these exact purchase rules.
- Expansion-heavy wins Easy with 16 lives and Normal with 10, but loses Hard on
  wave 20 with four leaks. Boss life damage makes leak count alone insufficient.
  Its resource surplus also reflects finite placement slots and no upgrades;
  it does not measure universally available spending efficiency.
- Weak placement loses on wave 3 on all difficulties with 20 leaks. This establishes
  a consequence of the deliberately poor ranking, not a human failure rate.

The table's simulated time excludes preparation/thinking time and CPU runtime.
Wave pressure is a vector: authored due times/counts, actual typed spawns, spawn
HP/initial shield sums, peak live count and boss outcomes. Dynamic reinforcements
are included in actual spawns. HP and initial shields are not a required damage
budget: leaks, shield regeneration and vulnerability matter. Defeat stops combat;
unreleased spawns and unresolved bosses are not recorded as defeated or leaked.
Bosses absent because later waves were never reached have no fabricated outcome.

M2.3 attribution limits remain intact: capped health removal includes vulnerability
but is not causally allocated to its applier; shield removal can repeat after
regeneration. Status counts include refreshes, overlaps and lethal applications,
not unique targets, saved time or prevented leaks. Aura-present shots may count
for overlapping/capped supports; they are not extra shots or caused damage.
Passive Dharma is a shared capped ownership bonus included in clear income, not
an additional gain or per-support credit. Sampled last attacking-range positions
include disabled attackers and do not prove targeting, cooldown readiness or hits.
Typed leak damage is configured life damage; actual lives clamp at zero.

Tests use actual fixed-step production movement, firing, impact, reinforcement,
resolution and economy paths. They reconcile per-wave resource changes, final
hits, leaks/lives and boss counters, check full Hard campaigns twice per policy,
and assert actual victory, shield removal, support activity and poor-placement
leaks. Build-only resource/roster fixtures test constraints and counter selection;
they do not establish combat outcomes. Existing lifecycle fixtures that directly
resolve enemies remain lifecycle tests and supply none of this report's evidence.

Untested: alternate maps/rosters, initial-resource scenarios, optimized policies,
selling, human build timing, human difficulty/engagement, physical devices,
manual accessibility, screen readers, other browser engines and performance
budgets. Chromium emulation/axe regression checks below preserve existing UI
behavior; scripted combat findings are not human playtest evidence.

## Validation

A fresh detached worktree at implementation commit `7c6145f` started without
node_modules or dist. Node 24.22.1 / npm 11.9.0, Playwright 1.61.1 and Chromium
149.0.7827.55 were used. The documented clean-checkout pipeline passed:

| Command | Result |
| --- | --- |
| `npm ci --cache /tmp/dharamapala-m24-npm-cache` | Pass |
| `npx playwright install chromium` | Pass, downloaded to writable `/workspace/.playwright-browsers` |
| `npm run build` | Pass, fresh dist |
| `npm run test:unit` | 74 passed |
| `npm run test:integration` | 25 passed |
| `npm run test:sim` | 7 passed |
| `npm run test:e2e` | 63 passed |
| `npm run test:a11y` | 10 passed, no serious/critical axe findings in scanned UI |
| Legacy diagnostics vs corrected M1.4 | Byte-identical |
| Report and summary regeneration | Both byte-identical to committed evidence |
| `git diff --check` | Pass |

Browser suites used `CI=1`, their own server, freshly built output and
`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`. Local system browser
libraries were already present. [validation.txt](validation.txt) records output
and post-suite commands. The initial focused constraint test compared snapshot
wall-clock save timestamps; it was corrected to compare gameplay state. No
combat rule changed to make a test pass.

[PR #22 CI](https://github.com/zekusmaximus/dharamapala-shield-game/actions/runs/43087364930)
passed on `7c6145f` under Ubuntu / Node 22: locked installation, Chromium plus
system dependencies, fresh build, 74 unit, 25 integration, 7 simulation,
63 end-to-end and 10 accessibility checks. No failure artifacts were needed.
The final documentation/log commit changes no implementation or scenario data.
