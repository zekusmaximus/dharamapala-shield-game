# M4.3 continuation audit

Revalidated 2026-11-13–14 UTC.

This M4.3 request found existing work rather than an unimplemented
milestone. GitHub PR search for `M4.3` returned open
[PR #34](https://github.com/zekusmaximus/dharamapala-shield-game/pull/34).
The fetched branch `m4.3-difficulty-calibration` was at
`1ddd54c989e2736faf24603ae0f10193e77de0b4`; its merge base with fetched
`origin/main` was `c4f614e588aba11268df18007cec5427a350b0a0`, still latest
main. The PR was open, unmerged and mergeable. Its existing head's hosted CI
and GitGuardian checks had passed. This continuation reuses that focused PR.

No applicable `AGENTS.md` was found in the checkout, `/workspace` or its
parents. The roadmap, content schema, human-validation deferral, M4.1
pressure plan and comparisons, M4.2 boss evidence and M4.4 continuation
evidence were read before reviewing the existing M4.3 implementation and
its diagnosis, scenario runner, comparison, tests and compatibility fixture.
No participant-record search or M3.5 kit work was performed.

## Audit conclusion

The existing calibration addresses the bounded engineering request. Retain
its four difficulty edits and balance `1.7.0`, schema v4; no further tuning
or production change is warranted by this audit. The scope assertion compares
the complete content object with merged 1.6.0, allowing only the version and
four documented multipliers to change. Economy, tower roster and branches,
every M4.1 wave group/reward, M4.2 bosses and Agent brace remain exact.
The scheduler, deliberate starts, pause/Continue and fixed clock are unchanged.

The baseline diagnosis distinguishes different HP/speed/bounties/boss leak
costs from the identical untouched-policy outcomes and identical regular leak
cost. The earned mixed wave-3 fork measures a cost for postponing preparation;
it does not isolate Agent brace. At 1.7.0, Normal's two leaks are Script
Kiddies. Hard's five wave-3 leaks are four Kiddies and one Agent; its two
earlier wave-2 leaks must not be attributed to wave 3. Later legal purchases
recover both saved openings to victory, at 18 and 13 lives respectively.

The seven policy labels include `counter-aware`, whose commands duplicate
`existing`; they are not seven independent strategies. The full comparison
retains all 21 policy/difficulty runs and 369 reached waves, including naturally
defeated plans, unresolved terminal bosses, typed leaks, ledgers, combat time
and support/control activity. The clock/JSON matrix keeps the original full
state/runtime, accounting, purchase-log and terminal-freezing invariants.
Old 1.6.0 bytes are tested for retained export, blocked overwrite and explicit
reset. Historical evidence and the pinned M3.5 archive remain untouched.

These are scripted engineering findings only. M3.2 specialization retention,
M3.5 collection, the human M3 gate and M4 acceptance remain open. They establish
no player understanding, difficulty, build diversity or observed play time.
M4.5, M5 and M6 were not started.

## Reproduction

A separate detached checkout of `1ddd54c` was created without `node_modules`
or `dist`:

```bash
git worktree add --detach /tmp/dharamapala-m43-revalidate 1ddd54c
cd /tmp/dharamapala-m43-revalidate
bash design/reviews/2026-11-13-m4.3/verify.sh > /tmp/m43-clean-revalidation-2026-11-13.txt 2>&1
```

An initial invocation accidentally ran in the existing working checkout and
stopped at the script's `test ! -d node_modules` precondition, before installing
or running any suite. It is retained separately in
[revalidation-precondition.txt](revalidation-precondition.txt). The command
above uses the intended detached checkout. This was a command-location error,
not a gameplay failure.

The detached run completed successfully. Its complete output is retained in
[revalidation.txt](revalidation.txt), separate from the original
[implementation validation](validation.txt). It used Node 24.22.1, npm
11.9.0 and Chromium 149.0.7827.55.

| Fresh detached check at `1ddd54c` | Result |
| --- | --- |
| No installed dependencies/build output; locked install, Chromium install, fresh build | Pass |
| Unit / integration / simulation | 142 / 66 / 13 passed |
| Browser / accessibility | 103 / 14 passed |
| 21 fresh campaigns and their exact repeats; full-run 1×/2×/mixed-clock and JSON continuation | Match recorded evidence |
| Baseline, campaign report/summary, counterplay, 18 targeted forks and six recoveries per version, old-save fixture, comparison | Byte-identical regeneration |
| Historical economy/tradeoff evidence and copied merged 1.6.0 content | Byte-identical |
| All pre-M4.3 evidence and pinned M3.5 archive SHA-256 | Unchanged / pass |
| Whitespace, regenerated tracked files and detached worktree cleanliness | Pass |

Only this audit, its logs, the M4.3 README link and the roadmap's automated
status note are added by the continuation. Production code, calibration,
tests and all existing result artifacts remain at the audited head's bytes.
The PR stays open and unmerged; this revalidation closes no human gate.
