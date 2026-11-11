import { test, expect } from '@playwright/test';
import { clickWorld, enterBuildPhase, openFresh } from './helpers.js';

test('loads the real game without console errors and keeps wave 1 idle', async ({
  page
}) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await openFresh(page);
  await enterBuildPhase(page);
  await page.waitForTimeout(150);
  const state = await page.evaluate(() => ({
    phase: gameApplication.session.state.phase,
    enemies: gameApplication.session.state.enemies.size,
    spawned: gameApplication.session.state.wave.spawned
  }));
  expect(state).toEqual({ phase: 'BUILDING', enemies: 0, spawned: 0 });
  expect(errors).toEqual([]);
});

test('loads the sprite sheet and maps every active rendered entity', async ({
  page
}) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await openFresh(page);
  const inventory = await page.evaluate(() => {
    const assets = gameApplication.renderer.spriteAssets;
    const ids = [
      ...Object.keys(gameApplication.balance.towers),
      ...Object.keys(gameApplication.balance.enemies),
      ...Object.keys(gameApplication.balance.bosses)
    ];
    return {
      summary: assets.summary(),
      sprites: ids.map((id) => {
        const sprite = assets.get(id);
        return {
          id,
          mapped: Boolean(sprite),
          naturalWidth: sprite?.image.naturalWidth || 0,
          naturalHeight: sprite?.image.naturalHeight || 0
        };
      })
    };
  });
  expect(inventory.summary).toEqual({
    total: 1,
    ready: 1,
    failed: 0,
    loading: 0
  });
  expect(inventory.sprites).toHaveLength(11);
  expect(inventory.sprites.every((sprite) => sprite.mapped)).toBe(true);
  expect(inventory.sprites.every((sprite) => sprite.naturalWidth === 2816)).toBe(
    true
  );
  expect(inventory.sprites.every((sprite) => sprite.naturalHeight === 256)).toBe(
    true
  );
  expect(errors).toEqual([]);
});

test('keeps the sprite canvas sharp at device scale factor 2', async ({
  browser
}) => {
  const page = await browser.newPage({
    viewport: { width: 844, height: 390 },
    deviceScaleFactor: 2
  });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await openFresh(page, { width: 844, height: 390 });
  await enterBuildPhase(page);
  const dimensions = await page.evaluate(() => {
    const canvas = gameApplication.camera.canvas;
    const rect = canvas.getBoundingClientRect();
    return {
      dpr: gameApplication.camera.dpr,
      cssWidth: rect.width,
      cssHeight: rect.height,
      backingWidth: canvas.width,
      backingHeight: canvas.height,
      sprites: gameApplication.renderer.spriteAssets.summary()
    };
  });
  expect(dimensions.dpr).toBe(2);
  expect(dimensions.backingWidth).toBe(Math.round(dimensions.cssWidth * 2));
  expect(dimensions.backingHeight).toBe(Math.round(dimensions.cssHeight * 2));
  expect(dimensions.sprites.ready).toBe(1);
  expect(errors).toEqual([]);
  await page.close();
});

test('places, selects, upgrades, sells, and restores a tower save', async ({
  page
}) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await clickWorld(page, 210, 210);
  await expect(page.getByRole('heading', { name: 'Tower details' })).toBeVisible();
  await page.getByRole('button', { name: /Upgrade/ }).click();
  expect(
    await page.evaluate(
      () => [...gameApplication.session.state.defenses.values()][0].level
    )
  ).toBe(2);

  await page.getByRole('link', { name: 'Dharmapala Shield home' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  expect(
    await page.evaluate(
      () => [...gameApplication.session.state.defenses.values()][0].level
    )
  ).toBe(2);

  await page.getByRole('button', { name: /Sell/ }).click();
  await expect(page.getByRole('dialog', { name: 'Sell this tower?' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm sale' }).click();
  expect(
    await page.evaluate(() => gameApplication.session.state.defenses.size)
  ).toBe(0);
});

test('upgraded Firewall inspector describes only its applied combat status', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await page.locator('[data-tower-type="firewall"]').click();
  await clickWorld(page, 210, 210);
  await page.getByRole('button', { name: /Upgrade/ }).click();

  const inspector = page.locator('#inspector-content');
  await expect(inspector).toContainText('Firewall Fortress');
  await expect(inspector).toContainText('Level 2');
  await expect(inspector).toContainText('Direct damage');
  await expect(inspector).not.toContainText(/\bslow\b/i);
});

test('Distributor inspector explains support and EMP without a targeting claim', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await page.locator('[data-tower-type="distributor"]').click();
  await clickWorld(page, 210, 210);

  const inspector = page.locator('#inspector-content');
  await expect(inspector).toContainText('Dharma Distributor');
  await expect(inspector).toContainText('fire-rate aura');
  await expect(inspector).toContainText('Does not attack');
  await expect(inspector).toContainText('EMP pauses the aura');
  await expect(inspector).toContainText('wave-clear bonus');
  await expect(inspector).not.toContainText('Targets the active threat');
  await expect(inspector).not.toContainText(/\bslow\b/i);
});

test('pause freezes simulation and restart removes all old state', async ({
  page
}) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await clickWorld(page, 210, 210);
  await page.getByRole('button', { name: 'Start wave 1' }).click();
  await page.waitForTimeout(100);
  await page.getByRole('button', { name: 'Pause game' }).click();
  await expect(page.getByRole('dialog', { name: 'Paused' })).toBeVisible();
  const pausedAt = await page.evaluate(
    () => gameApplication.session.state.gameTimeMs
  );
  await page.waitForTimeout(200);
  expect(
    await page.evaluate(() => gameApplication.session.state.gameTimeMs)
  ).toBe(pausedAt);

  await page.getByRole('button', { name: 'Restart run' }).click();
  const restarted = await page.evaluate(() => ({
    phase: gameApplication.session.state.phase,
    defenses: gameApplication.session.state.defenses.size,
    enemies: gameApplication.session.state.enemies.size,
    projectiles: gameApplication.session.state.projectiles.size,
    spawned: gameApplication.session.state.wave.spawned
  }));
  expect(restarted).toEqual({
    phase: 'BUILDING',
    defenses: 0,
    enemies: 0,
    projectiles: 0,
    spawned: 0
  });
});

test('keyboard-only build flow can place a tower and start a wave', async ({
  page
}) => {
  await openFresh(page);
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: 'New game' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Skip tutorial' }).focus();
  await page.keyboard.press('Enter');
  const canvas = page.locator('#game-canvas');
  await canvas.focus();
  await page.keyboard.press('Enter');
  expect(
    await page.evaluate(() => gameApplication.session.state.defenses.size)
  ).toBe(1);
  await page.getByRole('button', { name: 'Start wave 1' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
});

for (const viewport of [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'small portrait', width: 360, height: 640 },
  { name: 'portrait', width: 390, height: 844 },
  { name: 'small landscape', width: 640, height: 360 },
  { name: 'landscape', width: 844, height: 390 }
]) {
  test(`${viewport.name} layout keeps battlefield and primary controls in the viewport`, async ({
    page
  }) => {
    await openFresh(page, viewport);
    await enterBuildPhase(page);
    const boxes = await page.evaluate(() => {
      const canvas = document.getElementById('game-canvas').getBoundingClientRect();
      const start = document
        .getElementById('start-wave-button')
        .getBoundingClientRect();
      return {
        canvas: {
          left: canvas.left,
          top: canvas.top,
          right: canvas.right,
          bottom: canvas.bottom,
          width: canvas.width,
          height: canvas.height
        },
        start: {
          left: start.left,
          top: start.top,
          right: start.right,
          bottom: start.bottom,
          width: start.width,
          height: start.height
        },
        viewport: { width: innerWidth, height: innerHeight }
      };
    });
    expect(boxes.canvas.width).toBeGreaterThan(0);
    expect(boxes.canvas.height).toBeGreaterThan(0);
    expect(boxes.start.width).toBeGreaterThanOrEqual(44);
    expect(boxes.start.height).toBeGreaterThanOrEqual(44);
    expect(boxes.start.right).toBeLessThanOrEqual(boxes.viewport.width + 1);
    expect(boxes.start.bottom).toBeLessThanOrEqual(boxes.viewport.height + 1);
  });
}

test('terminal dialogs block play and expose final results', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await page.evaluate(() => gameApplication.session.enterTerminal('GAME_OVER'));
  await expect(page.getByRole('dialog', { name: 'Game over' })).toBeVisible();
  await expect(page.getByText(/defeated, 0 leaked/)).toBeVisible();
});

test('same-tick game over persists matching live and final results', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await page.getByRole('button', { name: 'Start wave 1' }).click();
  const live = await page.evaluate(async () => {
    const { PATH_METRICS, pointAtPathDistance } = await import('/js/core/world.js');
    const session = gameApplication.session;
    session.state.lives = 1;
    const distance = PATH_METRICS.totalLength - 0.01;
    for (let index = 0; index < 2; index += 1) {
      const enemy = session.spawnEnemy({ enemyType: 'scriptKiddie', hpMultiplier: 1 });
      enemy.pathDistance = distance;
      Object.assign(enemy, pointAtPathDistance(distance));
    }
    session.tick(250);
    return {
      phase: session.state.phase,
      leaks: session.state.statistics.leaks,
      finalLeaks: session.state.finalStatistics?.leaks,
      remainingEnemies: session.state.enemies.size
    };
  });
  expect(live).toMatchObject({ phase: 'GAME_OVER', leaks: 1, finalLeaks: 1 });
  expect(live.remainingEnemies).toBeGreaterThanOrEqual(1);
  await expect.poll(() => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')).state;
    return {
      phase: state.phase,
      leaks: state.statistics.leaks,
      finalLeaks: state.finalStatistics?.leaks,
      remainingEnemies: state.enemies.length
    };
  })).toEqual(live);
});

test('zoom is not disabled and interactive elements have accessible names', async ({
  page
}) => {
  await openFresh(page);
  const viewport = await page
    .locator('meta[name="viewport"]')
    .getAttribute('content');
  expect(viewport).not.toContain('user-scalable=no');
  expect(viewport).not.toContain('maximum-scale=1');
  const unnamed = await page.locator('button:not([aria-label])').evaluateAll(
    (buttons) =>
      buttons.filter((button) => !button.textContent.trim()).map((button) => button.id)
  );
  expect(unnamed).toEqual([]);
});

test('portrait preview does not intercept palette selection', async ({ page }) => {
  await openFresh(page, { width: 360, height: 640 });
  await enterBuildPhase(page);
  await page.locator('[data-tower-type="firewall"]').click({ timeout: 2000 });
  await clickWorld(page, 210, 210);
  expect(await page.evaluate(() => gameApplication.session.state.defenses.size)).toBe(1);
  await page.getByRole('button', { name: 'Start wave 1' }).click({ timeout: 2000 });
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
});

// These fixtures choose real production preview data; gameplay actions below
// always travel through the DOM and the normal input controller.
async function largestPreview(page) {
  return page.evaluate(() => {
    const { session, ui } = gameApplication;
    let largest = { wave: 1, count: 0 };
    for (let wave = 1; wave <= session.balance.waves.length; wave++) {
      session.state.waveNumber = wave;
      const count = session.getReadModel().preview.enemies.length;
      if (count >= largest.count) largest = { wave, count };
    }
    session.state.waveNumber = largest.wave;
    ui.update(session);
    return largest;
  });
}

async function activateWorld(page, method, x, y) {
  await expect.poll(() => page.evaluate(() => {
    const { camera } = gameApplication;
    return Math.abs(camera.cssWidth - camera.canvas.getBoundingClientRect().width);
  })).toBeLessThan(1);
  const point = await page.evaluate(({ x, y }) => {
    const { camera } = gameApplication;
    const rect = camera.canvas.getBoundingClientRect();
    return { x: rect.left + camera.offsetX + x * camera.scale,
      y: rect.top + camera.offsetY + y * camera.scale };
  }, { x, y });
  if (method === 'tap') await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
}

const controlViewports = [
  { width: 360, height: 640 }, { width: 390, height: 844 },
  { width: 640, height: 360 }, { width: 844, height: 390 },
  { width: 1280, height: 720 }
];
for (const viewport of controlViewports) {
  for (const method of ['click', 'tap']) {
    test(`${viewport.width}x${viewport.height} ${method}: open panels allow building and waves`, async ({ browser }, testInfo) => {
      const context = await browser.newContext({ viewport, hasTouch: true });
      const page = await context.newPage();
      await openFresh(page, viewport);
      await enterBuildPhase(page);
      const largest = await largestPreview(page);
      expect(largest.count).toBeGreaterThan(1);
      await expect(page.locator('#wave-preview-list li')).toHaveCount(largest.count);
      const act = async (locator) => locator[method]();
      // Leave the largest preview expanded while selecting every tower role.
      for (const type of ['distributor', 'encryption', 'firewall']) {
        await act(page.locator(`[data-tower-type="${type}"]`));
        await expect(page.locator(`[data-tower-type="${type}"]`)).toHaveAttribute('aria-pressed', 'true');
      }
      await activateWorld(page, method, 210, 210);
      await expect(page.getByRole('button', { name: /Upgrade/ })).toBeVisible();
      // Palette remains usable with inspector open, and canvas accepts another build.
      await act(page.locator('[data-tower-type="firewall"]'));
      await activateWorld(page, method, 270, 210);
      expect(await page.evaluate(() => gameApplication.session.state.defenses.size)).toBe(2);
      await activateWorld(page, method, 210, 210);
      await act(page.getByRole('button', { name: /Upgrade/ }));
      expect(await page.evaluate(() => [...gameApplication.session.state.defenses.values()][0].level)).toBe(2);
      await act(page.getByRole('button', { name: 'Hide tower details' }));
      await expect(page.locator('#inspector-title')).toBeFocused();
      await expect(page.locator('#tower-inspector')).not.toHaveAttribute('open');
      // Reselect the same tower to reopen details, then sell it normally.
      await activateWorld(page, method, 210, 210);
      await act(page.getByRole('button', { name: /Sell ·/ }));
      await act(page.getByRole('button', { name: 'Confirm sale' }));
      expect(await page.evaluate(() => gameApplication.session.state.defenses.size)).toBe(1);
      await expect(page.locator('#game-canvas')).toBeFocused();
      await act(page.getByRole('button', { name: 'Hide wave preview' }));
      await expect(page.locator('#wave-preview-title')).toBeFocused();
      await act(page.locator('#wave-preview-title'));
      await activateWorld(page, method, 210, 210);
      // Both panels are expanded, and the inspector has real tower content.
      await expect(page.locator('#tower-inspector')).toHaveAttribute('open', '');
      await expect(page.locator('#wave-preview-section')).toHaveAttribute('open', '');
      const start = page.getByRole('button', { name: `Start wave ${largest.wave}` });
      await expect(start).toBeInViewport({ ratio: 1 });
      await page.screenshot({ path: testInfo.outputPath('open-panels.png') });
      await testInfo.attach('open-panels', { path: testInfo.outputPath('open-panels.png'), contentType: 'image/png' });
      await act(page.getByRole('button', { name: `Start wave ${largest.wave}` }));
      await expect(page.locator('#phase-label')).toHaveText('Wave active');
      await context.close();
    });
  }
}

for (const portrait of controlViewports.slice(0, 2)) {
  test(`touch rotation from ${portrait.width}x${portrait.height} preserves open panel access`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: portrait, hasTouch: true });
    const page = await context.newPage();
    await openFresh(page, portrait);
    await enterBuildPhase(page);
    await largestPreview(page);
    await activateWorld(page, 'tap', 210, 210);
    for (const viewport of [{ width: portrait.height, height: portrait.width }, portrait]) {
      await page.setViewportSize(viewport);
      if (viewport.width > viewport.height) {
        await page.getByRole('button', { name: /Upgrade/ }).tap();
      } else {
        await page.getByRole('button', { name: /Sell ·/ }).tap();
        await page.getByRole('button', { name: 'Cancel', exact: true }).tap();
      }
      await page.locator('[data-tower-type="firewall"]').tap();
      await activateWorld(page, 'tap', 210, 210);
      await expect(page.locator('#tower-inspector')).toHaveAttribute('open', '');
    }
    await page.getByRole('button', { name: /Start wave/ }).tap();
    await expect(page.locator('#phase-label')).toHaveText('Wave active');
    await context.close();
  });
}

async function tabTo(page, locator, backwards = false) {
  for (let count = 0; count < 40; count++) {
    if (await locator.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press(backwards ? 'Shift+Tab' : 'Tab');
  }
  throw new Error(`Control not reachable by Tab: ${locator}`);
}

test('portrait disclosures and building work with real Tab navigation', async ({ page }) => {
  await openFresh(page, { width: 360, height: 640 });
  await tabTo(page, page.getByRole('button', { name: 'New game' }));
  await page.keyboard.press('Enter');
  await tabTo(page, page.getByRole('button', { name: 'Skip tutorial' }));
  await page.keyboard.press('Enter');
  await tabTo(page, page.locator('#wave-preview-title'), true);
  await page.keyboard.press('Enter');
  await expect(page.locator('#wave-preview-section')).not.toHaveAttribute('open');
  await page.keyboard.press('Enter');
  await tabTo(page, page.locator('[data-tower-type="firewall"]'), true);
  await page.keyboard.press('Enter');
  await expect(page.locator('#game-canvas')).toBeFocused();
  await page.keyboard.press('Enter');
  await tabTo(page, page.getByRole('button', { name: /Upgrade/ }));
  await page.keyboard.press('Enter');
  await tabTo(page, page.getByRole('button', { name: 'Hide tower details' }));
  await page.keyboard.press('Enter');
  await expect(page.locator('#inspector-title')).toBeFocused();
  await page.keyboard.press('Enter');
  await tabTo(page, page.getByRole('button', { name: 'Start wave 1' }));
  await page.keyboard.press('Enter');
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
});

// M1.2 uses browser key input throughout; tabTo observes focus but never sets it.
async function keyActivate(page, id, backwards = false) {
  await tabTo(page, page.locator(`#${id}`), backwards);
  await page.keyboard.press('Enter');
}

async function expectPhase(page, phase) {
  await expect.poll(() => page.evaluate(() => gameApplication.session.state.phase)).toBe(phase);
}

test('Escape skips tutorial without stranding TUTORIAL (R03)', async ({ page }) => {
  await openFresh(page);
  await keyActivate(page, 'new-game-button');
  await expectPhase(page, 'TUTORIAL');
  await page.keyboard.press('Escape');
  await expect(page.locator('#tutorial-dialog')).not.toBeVisible();
  await expectPhase(page, 'BUILDING');
  await expect(page.locator('#start-wave-button')).toBeFocused();
  await expect(page.locator('#start-wave-button')).toBeEnabled();
});

async function frozenState(page) {
  return page.evaluate(() => {
    const s = gameApplication.session.state;
    return { time: s.gameTimeMs, wave: s.wave,
      enemies: [...s.enemies.values()], projectiles: [...s.projectiles.values()] };
  });
}

async function expectFrozen(page) {
  const before = await frozenState(page);
  await page.waitForTimeout(180);
  expect(await frozenState(page)).toEqual(before);
  return before.time;
}

for (const viewport of [{ width: 1280, height: 720 }, { width: 360, height: 640 }]) {
  test(`${viewport.width} keyboard tutorial skip, replay and guided exit`, async ({ page }) => {
    await openFresh(page, viewport);
    await keyActivate(page, 'new-game-button');
    // Traverse both ways within the modal, then use its explicit Skip action.
    await keyActivate(page, 'tutorial-next-button');
    await keyActivate(page, 'skip-tutorial-button', true);
    await expectPhase(page, 'BUILDING');
    await expect(page.locator('#start-wave-button')).toBeFocused();
    await expectFrozen(page);
    await keyActivate(page, 'settings-button', true);
    await keyActivate(page, 'replay-tutorial-button');
    await expectPhase(page, 'TUTORIAL');
    await expect(page.locator('#settings-dialog')).not.toBeVisible();
    await page.keyboard.press('Escape');
    await expectPhase(page, 'BUILDING');
    await expect(page.locator('#start-wave-button')).toBeFocused();
    await keyActivate(page, 'settings-button', true);
    await keyActivate(page, 'replay-tutorial-button');
    await keyActivate(page, 'tutorial-next-button');
    await page.keyboard.press('Enter'); // Choose a Firewall; canvas build exercise.
    await expectPhase(page, 'BUILDING');
    await expect(page.locator('#game-canvas')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#tutorial-dialog')).toBeVisible();
    await page.keyboard.press('Escape'); // Exit the post-placement tutorial too.
    await expect(page.locator('#tutorial-dialog')).not.toBeVisible();
    await expect(page.locator('#start-wave-button')).toBeFocused();
    expect(await page.evaluate(() => gameApplication.ui.tutorialActive)).toBe(false);
    await expectFrozen(page);
  });

  test(`${viewport.width} keyboard settings, pause and sale cancellation preserve play`, async ({ page }) => {
    await openFresh(page, viewport);
    await keyActivate(page, 'new-game-button');
    await page.keyboard.press('Escape');
    for (const exit of ['Escape', 'Done']) {
      await keyActivate(page, 'settings-button', true);
      await expectPhase(page, 'PAUSED');
      await expect(page.locator('#settings-dialog')).toBeVisible();
      await expect(page.locator('#pause-dialog')).not.toBeVisible();
      await expectFrozen(page);
      if (exit === 'Escape') await page.keyboard.press('Escape');
      else await keyActivate(page, 'close-settings-button', true);
      await expectPhase(page, 'BUILDING');
      await expect(page.locator('#settings-button')).toBeFocused();
      await expect(page.locator('dialog[open]')).toHaveCount(0);
    }
    await keyActivate(page, 'game-canvas'); // Enter places the default Firewall.
    const towers = await page.evaluate(() => [...gameApplication.session.state.defenses.values()]);
    for (const exit of ['Escape', 'Cancel']) {
      await keyActivate(page, 'sell-button');
      await expect(page.locator('#sell-dialog')).toBeVisible();
      if (exit === 'Escape') await page.keyboard.press('Escape');
      else await keyActivate(page, 'cancel-sell-button', true);
      await expect(page.locator('#sell-dialog')).not.toBeVisible();
      await expect(page.locator('#sell-button')).toBeFocused();
      await expectPhase(page, 'BUILDING');
      expect(await page.evaluate(() => [...gameApplication.session.state.defenses.values()])).toEqual(towers);
    }
    await keyActivate(page, 'pause-button', true);
    await expectPhase(page, 'PAUSED');
    await expectFrozen(page);
    await page.keyboard.press('Escape');
    await expectPhase(page, 'BUILDING');
    await expect(page.locator('#pause-button')).toBeFocused();
    await keyActivate(page, 'start-wave-button');
    await expectPhase(page, 'WAVE');
    for (const exit of ['Escape', 'Done']) {
      await keyActivate(page, 'settings-button', true);
      await expectPhase(page, 'PAUSED');
      await expect(page.locator('#replay-tutorial-button')).toBeDisabled();
      const time = await expectFrozen(page);
      if (exit === 'Escape') await page.keyboard.press('Escape');
      else await keyActivate(page, 'close-settings-button', true);
      await expectPhase(page, 'WAVE');
      await expect(page.locator('#settings-button')).toBeFocused();
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => gameApplication.session.state.gameTimeMs)).toBeGreaterThan(time);
    }
    for (const exit of ['Escape', 'Resume']) {
      await keyActivate(page, 'pause-button', true);
      await expect(page.locator('#pause-dialog')).toBeVisible();
      await expectPhase(page, 'PAUSED');
      const time = await expectFrozen(page);
      // Exercise reverse traversal in the pause modal too.
      await tabTo(page, page.locator('#menu-button'), true);
      if (exit === 'Escape') await page.keyboard.press('Escape');
      else await keyActivate(page, 'resume-button');
      await expectPhase(page, 'WAVE');
      await expect(page.locator('#pause-button')).toBeFocused();
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      await expect.poll(() => page.evaluate(() => gameApplication.session.state.gameTimeMs)).toBeGreaterThan(time);
    }
  });
}

for (const phase of ['GAME_OVER', 'VICTORY']) {
  test(`${phase} keyboard terminal navigation and menu settings cancellation`, async ({ page }) => {
    await openFresh(page);
    await keyActivate(page, 'settings-button');
    await page.keyboard.press('Escape');
    await expectPhase(page, 'MENU');
    await expect(page.locator('#settings-button')).toBeFocused();
    await keyActivate(page, 'new-game-button');
    await page.keyboard.press('Escape');
    for (const exit of ['restart', 'menu', 'Escape']) {
      if (exit === 'Escape') await keyActivate(page, 'new-game-button');
      // Terminal fixture only: do not fake combat or claim campaign coverage.
      await page.evaluate((phase) => { const s=gameApplication.session; if(phase==='GAME_OVER') s.state.lives=0; else { s.state.waveNumber=s.state.maxWaves; s.state.statistics.wavesCompleted=s.state.maxWaves; } s.enterTerminal(phase); }, phase);
      await expectPhase(page, phase);
      await expect(page.locator('#terminal-dialog')).toBeVisible();
      await expectFrozen(page);
      await tabTo(page, page.locator('#terminal-menu-button'), true);
      if (exit === 'Escape') await page.keyboard.press('Escape');
      else await keyActivate(page, exit === 'restart' ? 'terminal-restart-button' : 'terminal-menu-button');
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      await expectPhase(page, exit === 'restart' ? 'BUILDING' : 'MENU');
      await expect(page.locator(exit === 'restart' ? '#start-wave-button' : '#new-game-button')).toBeFocused();
    }
  });
}

test('Escape closes settings and restores build phase (R03)', async ({ page }) => {
  await openFresh(page);
  await keyActivate(page, 'new-game-button');
  await keyActivate(page, 'skip-tutorial-button');
  await keyActivate(page, 'settings-button', true);
  await expectPhase(page, 'PAUSED');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expectPhase(page, 'BUILDING');
  await expect(page.locator('#settings-button')).toBeFocused();
});

test('restart, new run and terminal results are durable and preferences survive navigation', async ({ page }) => {
  await openFresh(page); await enterBuildPhase(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.locator('#range-toggle').uncheck(); await page.locator('#motion-toggle').check();
  await page.keyboard.press('Escape');
  await clickWorld(page,210,210);
  await page.getByRole('button', {name:'Pause game'}).click();
  await page.getByRole('button', {name:'Restart run'}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')).state.phase)).toBe('BUILDING');
  await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
  if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
  expect(await page.evaluate(()=>({phase:gameApplication.session.state.phase,count:gameApplication.session.state.defenses.size,settings:gameApplication.session.state.settings}))).toEqual({phase:'BUILDING',count:0,settings:{tutorialCompleted:true,showRanges:false,reducedMotion:true}});
  for (const phase of ['GAME_OVER','VICTORY']) {
    // Navigation fixture, not a claim of full-campaign combat.
    await page.evaluate(phase=>{ const s=gameApplication.session; if(phase==='GAME_OVER') s.state.lives=0; else { s.state.waveNumber=s.state.maxWaves; s.state.statistics.wavesCompleted=s.state.maxWaves; } s.enterTerminal(phase); },phase);
    await expect(page.locator('#terminal-dialog')).toBeVisible();
    await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
  if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
    await expect(page.locator('#terminal-dialog')).toBeVisible();
    expect(await page.evaluate(()=>gameApplication.session.state.phase)).toBe(phase);
    await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'New game',exact:true}).click();
    await expect(page.locator('#start-wave-button')).toBeEnabled();
    await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
  if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
    expect(await page.evaluate(()=>gameApplication.session.state.settings)).toEqual({tutorialCompleted:true,showRanges:false,reducedMotion:true});
  }
});

test('unreadable saves reject without swapping live play and export/reset through real controls', async ({ page }) => {
  await openFresh(page); await enterBuildPhase(page); await clickWorld(page,210,210);
  await page.evaluate(()=>{
    window.previousSession=gameApplication.session;
    localStorage.setItem('dharmapala-shield/save/v2','{"broken":true}');
    gameApplication.returnToMenu();
    // returnToMenu saves valid progress; replace it with the malformed candidate after navigation.
    localStorage.setItem('dharmapala-shield/save/v2','{"broken":true}');
  });
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
  expect(await page.evaluate(()=>gameApplication.session===window.previousSession && gameApplication.session.state.phase==='MENU')).toBe(true);
  await expect(page.getByRole('region',{name:'Local save recovery'})).toBeVisible();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export recovery save'}).click();
  const download=await downloadPromise;
  const { readFile } = await import('node:fs/promises');
  expect(await readFile(await download.path(),'utf8')).toBe('{"broken":true}');
  await page.getByRole('button',{name:'Reset saved run'}).click();
  await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'New game',exact:true}).click();
  await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
  if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
  await expect(page.locator('#start-wave-button')).toBeEnabled();
  expect(await page.evaluate(()=>localStorage.getItem('dharmapala-shield/save/v2/corrupt'))).toBe('{"broken":true}');
});

test('storage denial leaves menu and play usable with visible recovery status', async ({ page }) => {
  await page.addInitScript(()=>{
    for (const key of ['getItem','setItem','removeItem']) Storage.prototype[key]=()=>{throw new DOMException('Storage denied','SecurityError');};
  });
  await page.goto('/');
  await expect(page.locator('#storage-status')).toContainText('Local storage unavailable');
  await page.getByRole('button',{name:'New game',exact:true}).click();
  await page.getByRole('button',{name:'Skip tutorial'}).click();
  await expect(page.locator('#start-wave-button')).toBeEnabled();
  await page.getByRole('button',{name:'Reset saved run'}).click();
  await expect(page.locator('#storage-status')).toContainText('Local storage unavailable');
});

test('completed wave persists a finished clock frame and reloads into deliberate building', async ({page}) => {
  await openFresh(page); await enterBuildPhase(page);
  await page.getByRole('button',{name:'Start wave 1'}).click();
  // Lifecycle fixture: release/resolve enemies, then let a real multi-step tick complete.
  await page.evaluate(()=>{
    const s=gameApplication.session;
    s.scheduler.advance(100000,s.generation,e=>s.spawnEnemy(e));
    s.state.gameTimeMs=s.scheduler.elapsedMs;
    s.state.wave.spawnCursor=s.scheduler.cursor;
    for(const enemy of [...s.state.enemies.values()]) s.resolveEnemy(enemy.id,'KILLED');
    s.tick(100);
  });
  await expect(page.getByRole('button',{name:'Start wave 2'})).toBeEnabled();
  await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
  if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
  await expect(page.getByRole('button',{name:'Start wave 2'})).toBeEnabled();
  expect(await page.evaluate(()=>gameApplication.session.state.phase)).toBe('BUILDING');
});

test('menu preferences and an uncompleted tutorial survive reload before first placement', async ({page}) => {
  await openFresh(page);
  await page.locator('#settings-button').click();
  await page.locator('#motion-toggle').check();
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('button',{name:'New game',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Protect the endpoint'})).toBeVisible();
  await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'Protect the endpoint'})).toBeVisible();
  expect(await page.evaluate(()=>gameApplication.session.state.settings.reducedMotion)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#start-wave-button')).toBeEnabled();
});
