#!/usr/bin/env bash
# Run in a clean detached worktree; redirect output to a log outside the checkout.
set -eu
export CI=1
export PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-/workspace/.playwright-browsers}
run() { echo "+ $*"; "$@"; echo "exit=0"; }
run git rev-parse HEAD
run node --version
run npm --version
run test ! -d node_modules
run test ! -d dist
run npm ci --cache /tmp/dharamapala-m34-npm-cache
run npx playwright install chromium
run npx playwright --version
run npm run build
run npm run test:unit
run npm run test:integration
run npm run test:sim
run npm run test:e2e
run npm run test:a11y
run node --input-type=module -e 'import {chromium} from "@playwright/test";const b=await chromium.launch();console.log(b.version());await b.close();'
echo '+ node tools/review/baseline.mjs > /tmp/m34-check-baseline.json'
node tools/review/baseline.mjs > /tmp/m34-check-baseline.json
run cmp /tmp/m34-check-baseline.json design/reviews/2026-11-12-m3.4/baseline.json
run npm run balance:report -- --output=/tmp/m34-check-results.json
run cmp /tmp/m34-check-results.json design/reviews/2026-11-12-m3.4/results.json
run node tools/balance/summary.mjs /tmp/m34-check-results.json /tmp/m34-check-summary.md
run cmp /tmp/m34-check-summary.md design/reviews/2026-11-12-m3.4/summary.md
run node tools/balance/counterplay.mjs /tmp/m34-check-counterplay.json
run cmp /tmp/m34-check-counterplay.json design/reviews/2026-11-12-m3.4/counterplay.json
run node tools/balance/economy.mjs /tmp/m34-check-historical-economy.json
run cmp /tmp/m34-check-historical-economy.json design/reviews/2026-11-12-m3.3/economy.json
run node tools/balance/tradeoffs.mjs /tmp/m34-check-historical-tradeoffs.json
run cmp /tmp/m34-check-historical-tradeoffs.json design/reviews/2026-11-12-m3.2/tradeoffs.json
run node design/reviews/2026-11-12-m3.4/compare.mjs
run git diff --exit-code fcc4e35 -- design/reviews/2026-11-11 design/reviews/2026-11-11-m* design/reviews/2026-11-12-m3.1 design/reviews/2026-11-12-m3.2 design/reviews/2026-11-12-m3.3
run git diff --check
run git diff --exit-code
run git status --porcelain
