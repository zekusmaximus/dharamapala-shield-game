import { test, expect } from '@playwright/test';
import { openFresh, enterBuildPhase, specializationFixture, clickWorld } from './helpers.js';

// Funded presentation/command-target regression only. This is deliberately
// separate from campaign.spec.js and supplies no earned outcome evidence.
test('identical tower stats do not reuse another tower specialization handler', async ({ page }) => {
  await openFresh(page); await enterBuildPhase(page);
  await specializationFixture(page); // Firewall at 210,210; level 2, funded
  await page.locator('[data-tower-type="firewall"]').click();
  await clickWorld(page, 270, 210);
  await page.locator('#upgrade-button').click(); // second identical level-2 Firewall
  const towers = await page.evaluate(() => [...gameApplication.session.state.defenses.values()]);
  await clickWorld(page, 210, 210);
  expect(await page.evaluate(() => gameApplication.session.state.selectedDefenseId)).toBe(towers[0].id);
  await page.locator('[data-specialization="focus"]').click();
  const after = await page.evaluate(() => [...gameApplication.session.state.defenses.values()]);
  expect(after[0]).toMatchObject({ level: 3, specialization: 'focus' });
  expect(after[1]).toMatchObject({ level: 2, specialization: null });
  await expect(page.locator('#inspector-content')).toContainText('Chosen: Focus');
});
