# M2.2 combat feedback verification

Started from latest main `ed15050` (PR #19) on dedicated branch
`feat/m2-2-explain-combat`. No applicable AGENTS.md was found in the
checkout or its workspace parents. ROADMAP.md, the historical code review,
M1.1–M1.5 evidence and M2.1 evidence were read; historical files are unchanged.
This completes M2.2 only. M2 remains partial; M2.3–M2.6 are separate work.

## Rules and presentation

- Static ↓ SLOW and ◇ VULN badges identify active enemy effects; × EMP and a
  slash identify disabled towers. Colors have dark backing and distinct text/
  shapes. Badges retain at least 11 CSS-pixel type as the world scales down.
  New cues do not animate, flash, or depend on either motion preference.
- Titan has a separate outlined shield bar and numeric current/maximum shield.
  Boss badges and the semantic Combat status section show health and phase.
  Raid Team displays its actual phase 1–3; Titan explicitly has no
  health-triggered phases. Unused boss phase metadata is not advertised.
- EMP is instantaneous at 66% and 33% health, not a countdown or delayed attack.
  A persistent warning is available before Start Wave and throughout Raid Team
  waves, including before its scheduled spawn. The live badge/text identifies
  the next unspent threshold and a static dashed 260-unit radius shows the
  current burst area. Both can fire in one update if damage crosses both
  thresholds. The radius disappears after both are spent. No minimum warning
  lead time is promised: a lethal hit can kill the boss without a burst.
- EMP's 1.5-second disable, 260-unit radius and thresholds were named in the
  existing shared combat rules so simulation and presentation use the same
  values. None changed. Combat status lists disabled attackers (cannot fire)
  and Distributors (aura paused, passive income retained).
- Text reports each affected entity by name/ID, slow with the actual 80% speed
  cap, vulnerability before resistance/armor, boss health, shield, pending EMP,
  and disabled duration. Status expiry uses game time. Titan text describes its
  existing three-second hit-free recovery delay.
- Combat status is a named, keyboard-focusable semantic section in the existing
  scrolling build content. It does not replace inspectors or intercept the
  battlefield. Its changing health/status text is deliberately not a live
  region; the concise EMP warning is a deduplicated polite status. Existing
  post-burst announcements remain. Text refreshes on game events and at the
  existing 250 ms live-inspection cadence. Pause freezes combat time.

No balance JSON/version, save schema, preferences, rewards, wave scheduling,
fixed-step combat, or build permissions changed. No wave report or balance tuning
was added.

## Focused coverage and limits

Unit tests compare status text with expiry/caps, exercise real Raid Team threshold
transitions at exact boundaries and across both thresholds, and check canvas
marker labels, half-full shield fill and pending/spent radius. Browser fixtures
use production boss spawning, then freeze frames and set effect/health state for
stable presentation checks; they are not campaign combat or player tests.

New browser checks cover pointer and actual Tab/Enter/Escape inspection during
waves at 360×640, 390×844, 640×360, 844×390 and 1280×720. They assert text
alternatives, pre-wave warning availability, current boss state, reduced-motion
preferences and locked upgrade/sell/build commands. All prior M1 and M2.1
checks remain. Axe scans include both boss/status fixtures in portrait.

These results are headless Chromium keyboard/pointer and touch emulation plus
automated axe scans of semantic HTML (canvas pixels excluded). They do not
establish physical-device, screen-reader, Safari/Firefox, manual gesture,
full-campaign combat, human readability or playtest results. Dense enemy badges
can overlap; the semantic text remains available without relying on pixels.


## Clean-checkout results

A detached worktree at implementation commit `8eef3cb` started without
`node_modules/` or `dist/`. Node 24.22.1, npm 11.9.0, Playwright 1.61.1
and headless Chromium 149.0.7827.55 were used. The first browser attempt in the
working checkout found no Chromium executable; installing Chromium resolved
that setup issue. The clean worktree then ran the full documented sequence:

| Command | Result |
| --- | --- |
| `npm ci --cache /tmp/dharamapala-m22-npm-cache` | Pass |
| `npx playwright install chromium` | Pass, writable `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers` |
| `npm run build` | Pass, fresh dist |
| `npm run test:unit` | 74 passed |
| `npm run test:integration` | 18 passed |
| `npm run test:sim` | 2 passed |
| `npm run test:e2e` | 57 passed |
| `npm run test:a11y` | 9 passed; no serious/critical axe findings in scanned UI |
| `node tools/review/baseline.mjs` | Byte-identical to corrected M1.4 baseline |
| `git diff --check` | Pass |

Browser suites used `CI=1`, their own server, and freshly built output.
[Validation log](validation.txt) records the clean sequence.
The baseline SHA-256 remains
`63f3f0133cfa2b0c926493f1d6c7d737e93ec2df52524d39d62fff5a12034bbc`.

Representative fixtures: [Raid Team desktop](raid-desktop.png),
[Raid Team portrait](raid-portrait.png), [Titan desktop](titan-desktop.png).
These use the production boss spawn with frozen frames, active status fixtures,
one disabled tower, and boss repositioning on the path for an unobstructed view;
Titan has half its shield. Portrait text scrolls in the build content while the
battlefield and wave control retain their reserved space. Captures were visually
inspected; they are not physical-device readability validation.
