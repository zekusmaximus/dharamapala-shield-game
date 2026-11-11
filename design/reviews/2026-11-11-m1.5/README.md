# M1.5 CI verification

Based on latest main `45f4025` (M1.4, PR #17). No applicable `AGENTS.md` files
were present. Historical review evidence and M1.1–M1.4 verification files are
unchanged. This evidence concerns M1.5 only; M2 has not begun.

## Pipeline

`.github/workflows/ci.yml` checks out the pull request, installs the locked npm
dependencies and Chromium with its Ubuntu system dependencies, builds fresh
`dist/`, then runs unit, integration, simulation, end-to-end and accessibility
suites. `scripts/build.mjs` deletes `dist/` before copying current source.
Playwright starts its own server in CI instead of attaching to an existing one.
Failed browser tests retain traces and screenshots; CI writes an HTML report and
uploads `test-results/` and `playwright-report/` on job failure for 14 days.

## Clean-checkout validation

A detached worktree at `15f85e4` began without `node_modules/` or `dist/`.
Node 24.22.1, npm 11.9.0, Playwright 1.61.1 and headless Chromium
149.0.7827.55 were used locally. The documented validation sequence passed:

| Command | Result |
| --- | --- |
| `npm ci` | Pass; local sandbox used `--cache /tmp/dharamapala-m1-5-npm-cache` because its default npm cache was not writable |
| `npx playwright install chromium` | Pass; local sandbox used a writable `PLAYWRIGHT_BROWSERS_PATH` |
| `npm run build` | Pass; created `dist/` in the clean worktree |
| `npm run test:unit` | 63 passed |
| `npm run test:integration` | 18 passed |
| `npm run test:sim` | 2 passed |
| `npm run test:e2e` | 43 passed with `CI=1`, including M1.1 mobile, M1.2 dialog, M1.3 save and M1.4 browser regressions |
| `npm run test:a11y` | 7 passed with `CI=1`, including menu, build, dialogs and recovery scans |

The local environment already had Chromium's system libraries. The GitHub
Actions runner uses `npx playwright install --with-deps chromium` to install
them. The local browser suites ran against current built output, with the CI
server setting and report configuration enabled.

The PR CI result will be recorded here after it completes. These browser
results use headless Chromium pointer and touch emulation, keyboard input and
axe scans that exclude the gameplay canvas. They do not establish physical
device, screen-reader, Safari/Firefox, manual gesture, full-campaign combat or
human playtest results.
