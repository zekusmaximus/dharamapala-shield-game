# M2.1 tower and enemy inspection verification

Verified 2026-11-11 from latest main `4ce86e5` (M1 complete, PR #18). The
implementation was committed at `61c4b0a`. No applicable `AGENTS.md` was found
in the checkout or workspace parent. The historical code review and M1.1–M1.5
verification files were read as evidence and are unchanged. This work completes
M2.1 only; M2 remains partial.

## Delivered information and interactions

- A placed attack tower compares current and next damage per hit, base fire rate,
  rate with active support, range, applicable slow and vulnerability strength and
  durations, and the level-4 chain unlock. Rates describe available firing
  cadence when a target exists, not measured shots. The comparison also shows
  the next price, total investment and the exact per-resource refund.
- The Distributor has a support-specific view: current/next aura and range,
  attacking towers in range, actual marginal rate capacity after other auras and
  the cap, and the capped passive wave-clear bonus. It shows EMP suppression and
  refreshes the available benefit when EMP expires. An unplaced tower's Info
  control shows a position-independent blueprint even when the build button is
  unaffordable or disabled during a wave.
- Wave roster buttons and live battlefield hits open enemy armor, physical and
  shock damage multipliers, implemented abilities and a concise counter hint.
  Physical and shock are the current attack types. Fire resistance is configured
  but no active tower deals fire damage, so it is not presented as a live counter.
  Regular `special` labels are not implemented abilities. Raid Team
  reinforcements/EMP and Titan shield recovery are the implemented boss actions;
  unused boss `phases` metadata is not presented.
- Pointer and keyboard can inspect during building and waves. Wave keyboard
  movement has a visible cursor. Palette build buttons, placement, upgrades and
  selling remain phase-guarded. The new semantic disclosures scroll within the
  build panel above the reserved Start Wave control.

## Clean-checkout validation

A detached worktree at `61c4b0a` began without `node_modules/` or `dist/`.
Node 24.22.1, npm 11.9.0, Playwright 1.61.1 and headless Chromium 149.0.7827.55
were used. The locked install used a writable `/tmp` npm cache; Playwright used
a writable workspace browser cache. Chromium was already downloaded into that
cache, and its installation command completed in the clean worktree. Browser
suites used `CI=1`, started their own server and read the freshly built `dist/`.

| Command | Result |
| --- | --- |
| `npm ci` | Pass (`--cache /tmp/dharamapala-m2-1-npm-cache`) |
| `npx playwright install chromium` | Pass (`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`) |
| `npm run build` | Pass; created fresh `dist/` |
| `npm run test:unit` | 70 passed |
| `npm run test:integration` | 18 passed |
| `npm run test:sim` | 2 passed |
| `npm run test:e2e` | 51 passed with `CI=1` |
| `npm run test:a11y` | 8 passed with `CI=1` |
| `node tools/review/baseline.mjs` | JSON byte-identical to the corrected M1.4 `baseline.json` (SHA-256 `63f3f0133cfa2b0c926493f1d6c7d737e93ec2df52524d39d62fff5a12034bbc`) |
| `git diff --check` | Pass |

Focused tests compare displayed values with shared combat and economy rules,
including status duration, chain, EMP expiry, aura and income caps, investment,
and refund. Browser tests exercise normal pointer actions and real Tab, arrow,
Enter and Escape keys in build and wave phases. They cover unaffordable and
wave-locked blueprints, live enemy and placed tower selection, and the M1 mobile
interaction matrix at 360×640, 390×844, 640×360, 844×390 and 1280×720. Existing
dialog, save, preference and terminal regressions remain in the passing suites.

The 8 axe tests found no serious or critical violations in their scanned semantic
UI, including the new blueprint, support and enemy details during a wave. Gameplay
canvas pixels were excluded from axe scans. These are headless Chromium pointer
and touch emulation, keyboard checks, and automated axe results. They do not
establish physical-device, screen-reader, Safari/Firefox, manual gesture or human
playtest behavior. M2.2 combat markers and warnings, M2.3 wave reports, and later
balance work remain separate.
