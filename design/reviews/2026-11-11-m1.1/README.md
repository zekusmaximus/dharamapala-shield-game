# M1.1 portrait control verification

Verified 2026-11-11 from main `c80543e`. Historical review evidence in
`../2026-11-11/` is unchanged. This change completes M1.1 only; M1.2–M1.5 remain.

## Reproduction and repair

Before changing production code, added the `portrait preview does not intercept
palette selection` browser regression, built main, and ran it in Chromium at
360×640. Its normal palette click timed out: `wave-preview-section intercepts
pointer events`. Chromium had to be installed with `npx playwright install chromium`.

Preview and inspector now use native `details`/`summary` disclosures and explicit
Hide buttons. They occupy the build panel's scrolling content instead of fixed
screen overlays. The palette fits three columns in portrait and can be reached
by scrolling that content; Start Wave has a separate, nonshrinking area. The
battlefield retains its own space. Inspector selection opens details, while
ordinary updates preserve the player's dismissal. Hide returns focus to the
summary; a confirmed sale returns focus to the canvas. Disclosure state survives
rotation without depending on a media-query check during a session update.

## Interaction evidence

`tests/e2e/game.spec.js` runs both normal locator clicks and touchscreen taps at:

| Viewport | Pointer | Emulated touch |
| --- | --- | --- |
| 360×640 | Pass | Pass |
| 390×844 | Pass | Pass |
| 640×360 | Pass | Pass |
| 844×390 | Pass | Pass |
| 1280×720 | Pass | Pass |

Each matrix case selects all three palette roles, places two towers with preview
and inspector expanded, selects an existing tower, upgrades, dismisses/reopens
its inspector, sells through confirmation, dismisses/reopens preview, rebuilds,
and starts a wave with both panels expanded. Assertions verify the tower count,
upgrade level, selection, disclosure state, focus, and actual wave transition.
Start Wave must also be fully within the viewport. No force clicks, dispatched
synthetic DOM events, or direct engine build/upgrade/sell/start commands are used.
Playwright performs ordinary scrolling to reach controls inside the content area.

The preview fixture examines the actual production wave data and chooses the
largest composition (latest tie: wave 20, four enemy entries and a boss warning).
Only the wave-number setup and UI refresh bypass normal gameplay to reach this
late-wave layout without a campaign wait. Resources and prices remain unchanged.

Touch rotation tests cover 360×640 → 640×360 → 360×640 and
390×844 → 844×390 → 390×844, retaining expanded preview/inspector, upgrading,
opening/cancelling a sale, selecting, and starting. Coordinate helpers wait for
camera sizing after rotation. A separate keyboard test uses actual Tab,
Shift-Tab, and Enter navigation without programmatic focus to build, toggle both
panels, upgrade and start. Hide-button focus restoration is asserted.

Representative captures: [portrait](portrait.png), [landscape](landscape.png).
Both disclosures are expanded; content scrolls independently above Start Wave.
The tests also attach screenshots for each viewport/input combination.

## Checks

Node 24.22.1, Playwright 1.61.1, headless Chromium 149.0.7827.55:

| Command | Result |
| --- | --- |
| `npm run build` | Pass, rebuilt before browser checks |
| `npm run test:unit` | 22 passed |
| `npm run test:integration` | 4 passed |
| `npm run test:sim` | 2 passed |
| `npm run test:e2e` | 27 passed |
| `npm run test:a11y` | 5 passed; menu and build with expanded inspector, all five viewports |
| `node tools/review/baseline.mjs` | JSON deeply equals historical baseline, including all 12 policy/difficulty campaign outcomes |
| `git diff --check` | Pass |

No engine, combat, economy, wave data, or balance version changed. The diagnostic
comparison also preserves known defects assigned to subsequent M1 items; it does
not certify those behaviors as correct.

These are Chromium pointer/touch emulation and keyboard checks, plus axe scans
excluding canvas and checking serious/critical violations. They are not physical
phone, Safari/Firefox, screen-reader, manual swipe, or human playtest evidence.
Those broader checks remain in M6. Native dialog Escape/cancel behavior remains
M1.2 and was not changed here.
