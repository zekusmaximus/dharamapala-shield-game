import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { clickWorld, enterBuildPhase, openFresh } from './helpers.js';

for (const viewport of [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'small portrait', width: 360, height: 640 },
  { name: 'portrait', width: 390, height: 844 },
  { name: 'small landscape', width: 640, height: 360 },
  { name: 'landscape', width: 844, height: 390 }
]) {
  test(`${viewport.name} menu and build phase with open inspector have no serious accessibility violations`, async ({
    page
  }) => {
    await openFresh(page, viewport);
    const menuResults = await new AxeBuilder({ page }).analyze();
    expect(
      menuResults.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact)
      )
    ).toEqual([]);

    await enterBuildPhase(page);
    await clickWorld(page, 210, 210);
    const buildResults = await new AxeBuilder({ page })
      .exclude('canvas')
      .analyze();
    expect(
      buildResults.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact)
      )
    ).toEqual([]);
  });
}
