#!/usr/bin/env bash
# Run from a detached clean checkout of the implementation commit; log outside it.
set -eu
export CI=1
export PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-/workspace/.playwright-browsers}
run() { echo "+ $*"; "$@"; echo 'exit=0'; }
run git rev-parse HEAD
run node --version
run npm --version
run test ! -d node_modules
run test ! -d dist
run npm ci --cache /tmp/dharamapala-m41-npm-cache
run npx playwright install chromium
run npm run build
run npm run test:unit
run npm run test:integration
run npm run test:sim
run npm run test:e2e
run npm run test:a11y
run node --input-type=module -e 'import {chromium} from "@playwright/test";const b=await chromium.launch();console.log(b.version());await b.close();'
echo '+ node tools/review/baseline.mjs > /tmp/m41-baseline.json'
node tools/review/baseline.mjs > /tmp/m41-baseline.json
run cmp /tmp/m41-baseline.json design/reviews/2026-11-12-m4.1/baseline.json
run npm run balance:report -- --output=/tmp/m41-results.json
run cmp /tmp/m41-results.json design/reviews/2026-11-12-m4.1/results.json
run node tools/balance/summary.mjs /tmp/m41-results.json /tmp/m41-summary.md
run cmp /tmp/m41-summary.md design/reviews/2026-11-12-m4.1/summary.md
run node tools/balance/counterplay.mjs /tmp/m41-counterplay.json
run cmp /tmp/m41-counterplay.json design/reviews/2026-11-12-m3.4/counterplay.json
run node tools/balance/economy.mjs /tmp/m41-economy.json
run cmp /tmp/m41-economy.json design/reviews/2026-11-12-m3.3/economy.json
run node tools/balance/tradeoffs.mjs /tmp/m41-tradeoffs.json
run cmp /tmp/m41-tradeoffs.json design/reviews/2026-11-12-m3.2/tradeoffs.json
run node design/reviews/2026-11-12-m4.1/capture-old-save.mjs /tmp/m41-old-save.json
run cmp /tmp/m41-old-save.json design/reviews/2026-11-12-m4.1/old-1.4.0-v4-save.json
run node design/reviews/2026-11-12-m4.1/compare.mjs
run git diff --exit-code c39b6fe -- design/reviews/2026-11-11 design/reviews/2026-11-11-m1.1 design/reviews/2026-11-11-m1.2 design/reviews/2026-11-11-m1.3 design/reviews/2026-11-11-m1.4 design/reviews/2026-11-11-m1.5 design/reviews/2026-11-11-m2.1 design/reviews/2026-11-11-m2.2 design/reviews/2026-11-11-m2.3 design/reviews/2026-11-11-m2.4 design/reviews/2026-11-11-m2.5 design/reviews/2026-11-11-m2.6 design/reviews/2026-11-12-m3.1 design/reviews/2026-11-12-m3.2 design/reviews/2026-11-12-m3.3 design/reviews/2026-11-12-m3.4 design/reviews/2026-11-12-m3.5 design/reviews/2026-11-12-m3.5-follow-up design/reviews/2026-11-12-human-validation-deferral design/reviews/2026-11-12-m4.4
echo '+ verify pinned M3.5 archive SHA-256'
echo 'c89fd1806dab103d0838be5b3678404c7b984a64e6972e8a6e3544da360f80f5  design/reviews/2026-11-12-m3.5/playtest-build-fc43adf-1.4.0.zip' | sha256sum --check -
run git diff --check c39b6fe HEAD
run git diff --exit-code
run test -z "$(git status --porcelain)"
