import { reportFixture } from './helpers.js';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { combatFixture, clickWorld, enterBuildPhase, openFresh } from './helpers.js';

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

test('tutorial, settings, pause, sale and terminal dialogs have no serious accessibility violations', async ({ page }) => {
  const scan = async () => {
    const results = await new AxeBuilder({ page }).exclude('canvas').analyze();
    expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
  };
  await openFresh(page);
  await page.locator('#new-game-button').click();
  await scan();
  await page.keyboard.press('Escape');
  await page.locator('#settings-button').click();
  await scan();
  await page.keyboard.press('Escape');
  await page.locator('#pause-button').click();
  await scan();
  await page.keyboard.press('Escape');
  await clickWorld(page, 210, 210);
  await page.locator('#sell-button').click();
  await scan();
  await page.keyboard.press('Escape');
  for (const phase of ['GAME_OVER', 'VICTORY']) {
    await page.evaluate((phase) => { const s=gameApplication.session; if(phase==='GAME_OVER') s.state.lives=0; else { s.state.waveNumber=s.state.maxWaves; s.state.statistics.wavesCompleted=s.state.maxWaves; } s.enterTerminal(phase); }, phase);
    await scan();
    await page.locator('#terminal-restart-button').click();
  }
});

test('save recovery controls have no serious accessibility violations', async ({page}) => {
  await openFresh(page);
  await page.evaluate(()=>localStorage.setItem('dharmapala-shield/save/v2','broken'));
  await page.reload();
  await expect(page.getByRole('region',{name:'Local save recovery'})).toBeVisible();
  const results=await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
});

test('portrait support and enemy inspectors remain accessible during a wave', async ({ page }) => {
  await openFresh(page, { width: 360, height: 640 });
  await enterBuildPhase(page);
  await clickWorld(page, 210, 210);
  await page.locator('[data-tower-type="distributor"]').click();
  await clickWorld(page, 270, 210);
  await page.locator('[data-inspect-tower-type="encryption"]').click();
  await page.locator('[data-enemy-type="scriptKiddie"]').click();
  await page.getByRole('button', { name: 'Start wave 1' }).click();
  await expect(page.locator('#tower-inspector')).toHaveAttribute('open', '');
  await expect(page.locator('#tower-blueprint')).toHaveAttribute('open', '');
  await expect(page.locator('#enemy-inspector')).toHaveAttribute('open', '');
  const results = await new AxeBuilder({ page }).exclude('canvas').analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact))).toEqual([]);
});

test('combat boss warnings and status text have no serious accessibility violations', async ({page}) => {
  await openFresh(page,{width:360,height:640}); await enterBuildPhase(page);
  await clickWorld(page,210,210);
  for (const wave of [5,15]) {
    if (wave === 15) {
      await page.evaluate(() => {
        const s=gameApplication.session; s.restart();
      });
    }
    await combatFixture(page,wave);
    await expect(page.locator('#combat-state')).toContainText('Health');
    const results = await new AxeBuilder({page}).exclude('canvas').analyze();
    expect(results.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
  }
});

test('wave report semantic UI passes axe in building and terminal portrait states', async ({page}) => {
  await openFresh(page,{width:360,height:640}); await enterBuildPhase(page); await reportFixture(page);
  await page.locator('#wave-reports summary').click();
  let results=await new AxeBuilder({page}).exclude('canvas').analyze();
  expect(results.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
  await page.evaluate(()=>gameApplication.session.restart());
  await reportFixture(page,true);
  await page.locator('#terminal-reports summary').click();
  results=await new AxeBuilder({page}).exclude('canvas').analyze();
  expect(results.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
});

test('overlap and Raid timing previews pass axe with both reduced-motion preferences', async ({page}) => {
  await openFresh(page,{width:360,height:640}); await enterBuildPhase(page);
  for (const wave of [4,5]) for (const reducedMotion of [false,true]) {
    // Presentation-only setup: no claim of fighting these waves in this scan.
    await page.evaluate(({wave,reducedMotion})=>{
      const s=gameApplication.session; s.state.waveNumber=wave; s.state.settings.reducedMotion=reducedMotion;
      gameApplication.ui.update(s);
    },{wave,reducedMotion});
    await expect(page.locator('#wave-preview-section')).toHaveAttribute('open','');
    await expect(page.locator('#wave-preview-list')).toContainText('every');
    const results=await new AxeBuilder({page}).exclude('canvas').analyze();
    expect(results.violations.filter(v=>['serious','critical'].includes(v.impact))).toEqual([]);
  }
});
