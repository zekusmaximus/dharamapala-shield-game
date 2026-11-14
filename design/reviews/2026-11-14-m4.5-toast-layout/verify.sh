#!/usr/bin/env bash
# Run from a detached clean checkout of the implementation commit; log outside it.
set -eu
export CI=1
export PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH:-${HOME}/.cache/ms-playwright}
run() { echo "+ $*"; "$@"; echo 'exit=0'; }
run git rev-parse HEAD
run node --version
run npm --version
run test ! -d node_modules
run test ! -d dist
run npm ci --cache /tmp/dharamapala-m45-toast-npm-cache
run npx playwright install chromium
run npm run build
run npm run test:unit
run npm run test:integration
run npm run test:sim
export CAMPAIGN_AUDIT_OUTPUT=/tmp/m45-toast-clean-ui
run npm run test:e2e
unset CAMPAIGN_AUDIT_OUTPUT
run cmp /tmp/m45-toast-clean-ui/recovery.json design/reviews/2026-11-14-m4.5-ui-audit/recovery.json
run cmp /tmp/m45-toast-clean-ui/defeat-retry.json design/reviews/2026-11-14-m4.5-ui-audit/defeat-retry.json
run node design/reviews/2026-11-14-m4.5-toast-layout/compare-campaign.mjs /tmp/m45-toast-clean-ui/touch-recovery.json
for size in 360x640 390x844 640x360 844x390 1280x720; do
  run node design/reviews/2026-11-14-m4.5-toast-layout/compare-layout.mjs "/tmp/m45-toast-clean-ui/toast-${size}.json"
done
run npm run test:a11y
run node --input-type=module -e 'import {chromium} from "@playwright/test";const b=await chromium.launch();console.log(b.version());await b.close();'
echo '+ node tools/review/baseline.mjs > /tmp/m45-toast-baseline.json'
node tools/review/baseline.mjs > /tmp/m45-toast-baseline.json
run cmp /tmp/m45-toast-baseline.json design/reviews/2026-11-13-m4.3/baseline.json
run npm run balance:report -- --output=/tmp/m45-toast-results.json
run cmp /tmp/m45-toast-results.json design/reviews/2026-11-13-m4.3/results.json
run node tools/balance/summary.mjs /tmp/m45-toast-results.json /tmp/m45-toast-summary.md
run cmp /tmp/m45-toast-summary.md design/reviews/2026-11-13-m4.3/summary.md
run node tools/balance/counterplay.mjs /tmp/m45-toast-counterplay.json
run cmp /tmp/m45-toast-counterplay.json design/reviews/2026-11-13-m4.3/counterplay.json
run node design/reviews/2026-11-13-m4.3/scenarios.mjs --old /tmp/m45-toast-scenarios-before.json
run cmp /tmp/m45-toast-scenarios-before.json design/reviews/2026-11-13-m4.3/scenarios-before.json
run node design/reviews/2026-11-13-m4.3/scenarios.mjs --current /tmp/m45-toast-scenarios-after.json
run cmp /tmp/m45-toast-scenarios-after.json design/reviews/2026-11-13-m4.3/scenarios-after.json
run node design/reviews/2026-11-13-m4.3/capture-old-save.mjs /tmp/m45-toast-old-save.json
run cmp /tmp/m45-toast-old-save.json design/reviews/2026-11-13-m4.3/old-1.6.0-v4-save.json
run node design/reviews/2026-11-13-m4.3/compare.mjs
run node tools/balance/economy.mjs /tmp/m45-toast-economy.json
run cmp /tmp/m45-toast-economy.json design/reviews/2026-11-12-m3.3/economy.json
run node tools/balance/tradeoffs.mjs /tmp/m45-toast-tradeoffs.json
run cmp /tmp/m45-toast-tradeoffs.json design/reviews/2026-11-12-m3.2/tradeoffs.json
echo '+ verify baseline copy equals merged 1.6.0 content'
git show c4f614e:design/balance.json > /tmp/m45-toast-merged-balance.json
run cmp /tmp/m45-toast-merged-balance.json design/reviews/2026-11-13-m4.3/baseline-1.6.0.json
run git diff --exit-code 9ea7564 -- js index.html tools scripts .github package.json package-lock.json design/balance.json design/CONTENT_SCHEMA.md tests/unit tests/sim tests/integration tests/e2e/game.spec.js tests/e2e/helpers.js tests/e2e/inspector.spec.js tests/e2e/a11y.spec.js playwright.config.js
mapfile -t prior_dirs < <(find design/reviews -mindepth 1 -maxdepth 1 -type d ! -name 2026-11-14-m4.5-toast-layout -print | sort)
run git diff --exit-code 9ea7564 -- "${prior_dirs[@]}"
echo '+ verify pinned M3.5 archive SHA-256'
echo 'c89fd1806dab103d0838be5b3678404c7b984a64e6972e8a6e3544da360f80f5  design/reviews/2026-11-12-m3.5/playtest-build-fc43adf-1.4.0.zip' | sha256sum --check -
run git diff --check 9ea7564 HEAD
run git diff --exit-code
run test -z "$(git status --porcelain)"
