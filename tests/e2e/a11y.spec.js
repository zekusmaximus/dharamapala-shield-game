import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { enterBuildPhase, openFresh } from './helpers.js';

for (const viewport of [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'portrait', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 }
]) {
  test(`${viewport.name} menu and build phase have no serious accessibility violations`, async ({
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
