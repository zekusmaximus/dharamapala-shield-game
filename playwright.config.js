import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    browserName: 'chromium',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node scripts/serve.mjs',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 15_000
  },
  projects: [
    {
      name: 'e2e',
      testMatch: /game\.spec\.js/
    },
    {
      name: 'a11y',
      testMatch: /a11y\.spec\.js/
    }
  ]
});
