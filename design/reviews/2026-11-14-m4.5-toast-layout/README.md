# M4.5 passive toast visual separation · automated evidence

Started from fetched latest main `9ea756419b23977f98389ab981ebd66bad0371cb`
(PR #36), on `m4.5-toast-layout`. Checked local/remote branches, all recent
PRs and hosted test runs before implementation. PRs #35/#36 were merged and
green; no overlapping open work was found. No applicable AGENTS.md exists in
the checkout, workspace or parents. Read ROADMAP.md, CONTENT_SCHEMA.md,
the human-validation deferral, M4.1–M4.4 evidence including M4.3's continuation
audit, and both merged M4.5 UI/touch audits. Existing tests, campaign driver,
comparison scripts and CI pipeline were inspected before adding coverage.

Only the remaining **visual toast/control overlap** is addressed. No participant
records were sought, no pinned kit was recreated and no M5/M6 work was started.
M3.2 specialization retention, M3.5 collection, the human M3 gate, human M4.5
collection and M4 acceptance remain open under the existing
[deferral](../2026-11-12-human-validation-deferral/README.md).

## Fresh reproduction before the fix

Inspected historical PR #36 [toast-before.png](../2026-11-14-m4.5-touch-audit/toast-before.png)
and [build-portrait.png](../2026-11-14-m4.5-touch-audit/build-portrait.png), then
ran the merged earned wave driver on unchanged main production bytes at
390×844 with touch emulation. New game starts with Normal, seed 1337,
130/60/0 funds and 20 lives. All three opening purchases use palette/canvas
taps; wave 1 uses deliberate Start and the production RAF → tick → fixed clock.
It naturally kills all eight enemies, clearing in 16300 simulated combat ms,
with 20 lives and 110/56/0 resources. No grants, wave skips, entity edits,
direct hits, synthetic kills or direct clears establish this result.

The actual notification reads **“Wave 1 held: 8 defeated, 0 leaked.”** and
remains visible during capture and geometric assertions. [Fresh capture](reproduction.png),
[bounds/report/commands](reproduction.json) and [failure log](reproduction.txt)
record the overlap: toast `(97.5, 756.40625, 195, 71.59375)` at 390×844;
2× intersection **611.1875 px²**, Start intersection **7961.279052734375 px²**.
`pointer-events:none` already works; this failure is visual obstruction.
The initial launch lacked Chromium and failed before play
([setup log](browser-missing.txt)); installation preceded fresh reproduction.

## Presentation decision and implementation

The only production edits are in CSS. Portrait now places the notification
above the 240 px build-panel track, including the existing safe-bottom inset
and spacing. Short landscape centers it over the battlefield and bounds its
width outside the 230 px side panel. Those existing panel dimensions are shared
CSS variables, used by both layout and toast offsets, so the notification follows
the responsive layout without measuring DOM in JavaScript. Desktop positioning
is unchanged. No control dimensions change.

This uses the battlefield as temporary notification space rather than covering
speed/Start labels. The notification remains fully within the viewport with
unclipped text; it may briefly cover battlefield pixels. It is still passive,
and expires on the original timer. Text, `role=status`, `aria-live=polite`,
3200 ms lifetime, pointer-events:none and focus behavior remain unchanged.
No notification is hidden, disabled or waited out to establish control access.
No runtime JavaScript, HTML, content, combat, clock or save implementation changes.

## Bounded earned coverage

Five focused cases in [campaign.spec.js](../../../tests/e2e/campaign.spec.js)
reuse the merged driver and immutable M4.3 Normal save-recovery opening.
Each earns only wave 1, inspects the still-visible toast, scrolls through
ordinary native touch gestures (phone sizes) or wheel input (desktop), taps/
clicks both speeds and Start wave 2 before dismissal. Each phone-sized case
rotates to its paired orientation and back with ordinary scheduled frames;
build state/runtime equality is exact (except savedAt). These are focused
layout checkpoints, not five additional full campaigns or a policy matrix.

The tests check rendered toast/control rectangles before/after scroll, after
both rotations and after starting wave 2. They require zero intersection with
all header and speed/Start controls, full viewport containment, control height
at least 44 px and no toast text overflow. Captures retain each checked state.
The first earned wave's full report, ledger and duration match merged desktop
bytes, not merely an approximate outcome. Start is actually activated while
the toast is visible. Production time then advances to 3199 ms (still visible)
and 3200 ms (hidden). Notification appearance retains speed-button focus;
dismissal preserves the post-Start focus. Disabled Start naturally releases
focus in Chromium; the notification never receives it.

[Focused log](focused.txt): **5/5 pass**. Bounds, exact earned report/commands,
native scroll observations and lifetime transitions are retained in
[360×640](toast-360x640.json), [390×844](toast-390x844.json),
[640×360](toast-640x360.json), [844×390](toast-844x390.json) and
[1280×720](toast-1280x720.json). [Captures](captures/) include all five sizes,
scroll, paired rotations and active Start results. Inspected captures show the
notification text and primary labels separately visible.

Two harness corrections required no further product change:
[initial-focused.txt](initial-focused.txt) assumed disabled Start retained focus;
[lifetime-harness.txt](lifetime-harness.txt) timed from the earlier earned First
Defense achievement instead of the wave-clear notification. The final observer
selects the wave-clear text and verifies its own exact lifetime. Earlier
achievement notifications continue unchanged.

## Commands and preservation

```bash
# Before the CSS change, with main production bytes and the added regression:
npm run build
CI=1 CAMPAIGN_AUDIT_OUTPUT=/tmp/m45-toast-before npx playwright test tests/e2e/campaign.spec.js --project=e2e --grep 'earned toast layout 390' --workers=1
# After the CSS presentation change and harness corrections:
CI=1 CAMPAIGN_AUDIT_OUTPUT=/tmp/m45-toast-focused npx playwright test tests/e2e/campaign.spec.js --project=e2e --grep 'earned toast layout' --workers=1
# In a new detached implementation checkout without node_modules or dist:
bash design/reviews/2026-11-14-m4.5-toast-layout/verify.sh > /tmp/m45-toast-validation.txt 2>&1
```

[verify.sh](verify.sh) retains the clean-checkout pipeline, original desktop
recovery and natural-defeat/retry exact byte comparisons, 390×844 full touch
campaign comparison, all four M4.4 full-campaign clock/JSON cases and immutable
M4.3 regeneration. The [campaign comparator](compare-campaign.mjs) preserves
PR #36's exact gameplay checks and permits only one fixed tick in sampled
checkpoint/rotation instants. It omits PR #36's historical CSS scope assertion,
which describes that earlier PR's sole pointer-events edit. Historical scripts
and artifacts are not modified. Within-run paused reload snapshot equality and
all full-campaign clock/JSON invariants remain exact. [Layout comparator](compare-layout.mjs)
checks exact wave-1 gameplay, live geometric separation, native scroll movement
and 3200 ms lifetime in each regenerated focused result. Native scroll offsets,
rendered rectangles, screenshots and automation wall times remain observations.

The original recovery must remain victory with **18 lives**, two wave-3 Script
Kiddie leaks, seven bosses killed, **2227/3828/0** final resources and
**385733.3333334162 ms** simulated combat (385.733 s). Reports, ledgers,
commands, spawns, bosses, per-wave duration and final combat time stay exact.
Balance remains **1.7.0**, schema **v4**. PR #35's inspector metadata/identity
fixes and PR #36's passive hit testing remain. Explicit branches, Agent's one-use
3-second warning / 4-second 60%-health shield, Raid's single warned 66% EMP and
four reinforcements, Titan recovery, numeric retired Anonymity, shared scheduling,
clock/save behavior, historical evidence and pinned M3.5 build are preserved.

## Completed clean-checkout validation

A new detached checkout at **`7ec826335fbe15074450aba5d0ef9ce044a05b3a`**
started without dependencies or build output and passed the entire script:

```bash
git worktree add --detach /tmp/dharamapala-m45-toast-clean 7ec8263
cd /tmp/dharamapala-m45-toast-clean
bash design/reviews/2026-11-14-m4.5-toast-layout/verify.sh > /tmp/m45-toast-validation.txt 2>&1
```

[Full validation log](validation.txt): Node 24.22.1, npm 11.9.0,
Chromium 149.0.7827.55. Hosted PR CI is a separate Node 22 pipeline.

| Clean-checkout check | Result |
| --- | --- |
| Locked install, Chromium install, fresh build | Pass |
| Unit / integration / simulation | 143 / 66 / 13 passed |
| Browser / accessibility | 112 / 14 passed |
| Desktop recovery and natural-defeat/retry JSON | Byte-identical to PR #35 |
| Full touch gameplay, reports, ledgers, commands, spawns, bosses, per-wave/final combat time | Exact vs PR #36 and merged desktop |
| Sampled touch checkpoint/rotation instants | Within the existing one-fixed-tick allowance; all other fields exact |
| Within-run pause/reload snapshots and existing full-campaign clock/JSON matrix | Exact / all four cases pass |
| Five regenerated focused earned layout results | Exact wave-1 gameplay; no toast/control intersections, scroll moved, lifetime 3200 ms |
| M4.3 diagnostics, 21-run report/summary, counterplay, targeted old/current scenarios, old save and comparison | Byte-identical |
| Historical economy/tradeoffs, prior evidence, content/runtime/tooling, pinned M3.5 archive | Preserved / pass |
| Whitespace and detached worktree cleanliness | Pass |

[Clean layout observations](clean-layout-observations.json) retain live bounds,
lifetime and native scroll samples; [clean touch observations](clean-touch-observations.json)
retain campaign checkpoint/rotation/scroll samples. [Automation timings](clean-automation-timings.json)
are machine-dependent host wall times, separate from simulated combat and
unmeasured player time. The five added browser tests are bounded wave-1 layout
cases; the existing three full/defeat campaign tests remain intact.

The initial earned captures have these toast rectangles (CSS px); every header
and speed/Start intersection is zero, and all text remains inside its box:

| Viewport | Toast x / y / width / height |
| --- | --- |
| 360×640 | 90 / 312.40625 / 180 / 71.59375 |
| 390×844 | 97.5 / 516.40625 / 195 / 71.59375 |
| 640×360 | 57.09375 / 294.40625 / 289.40625 / 49.59375 |
| 844×390 | 159.09375 / 324.40625 / 289.40625 / 49.59375 |
| 1280×720 | 495.296875 / 654.40625 / 289.40625 / 49.59375 |

The subsequent validation-record commit changes only this evidence directory
and the roadmap. Production CSS, tests and comparator/verification bytes stay
at the tested implementation commit. All human gates remain open.

## Limits

Simulated combat time counts production combat only. Separate timing JSON records
host automation wall time, including rendering/assertions and accelerated browser
scheduling. Neither measures player deliberation or observed play time. Touch
emulation is not physical-device or human validation. Automated results establish
no player understanding, difficulty, build diversity, confusion, replay intent,
screen-reader usability or observed play time. All human gates remain open.
