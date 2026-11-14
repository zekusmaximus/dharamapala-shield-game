import { test, expect } from '@playwright/test';
import { reportFixture, combatFixture, clickWorld, enterBuildPhase, openFresh } from './helpers.js';

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

for (const viewport of [
  { width: 360, height: 640 }, { width: 390, height: 844 },
  { width: 640, height: 360 }, { width: 844, height: 390 },
  { width: 1280, height: 720 }
]) {
  test(`wave speed and Start Wave remain usable at ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await openFresh(page, viewport);
    await enterBuildPhase(page);
    const controls = page.locator('[data-wave-speed-context="game"]');
    const one = controls.getByRole('button', { name: 'Wave speed 1×' });
    const two = controls.getByRole('button', { name: 'Wave speed 2×' });
    const start = page.getByRole('button', { name: 'Start wave 1' });
    await expect(one).toHaveAttribute('aria-pressed', 'true');
    await expect(two).toBeVisible();
    await two.click();
    await expect(two).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => ({
      phase: gameApplication.session.state.phase,
      speed: gameApplication.session.state.waveSpeed,
      time: gameApplication.session.state.gameTimeMs,
      spawned: gameApplication.session.state.wave.spawned
    }))).toEqual({ phase: 'BUILDING', speed: 2, time: 0, spawned: 0 });
    for (const control of [two, start]) {
      const box = await control.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
    }
    await start.click();
    await expect(page.locator('#phase-label')).toHaveText('Wave active');
    await one.click();
    await expect(one).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => gameApplication.session.state.waveSpeed)).toBe(1);
  });
}

test('keyboard speed choice, pause, settings and Continue retain the chosen wave speed', async ({ page }) => {
  await openFresh(page, { width: 360, height: 640 });
  await enterBuildPhase(page);
  // Skip tutorial returns focus to Start Wave; reverse Tab reaches 2×.
  await expect(page.locator('#start-wave-button')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  const gameSpeed = page.locator('[data-wave-speed-context="game"]');
  await expect(gameSpeed.getByRole('button', { name: 'Wave speed 2×' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(gameSpeed.getByRole('button', { name: 'Wave speed 2×' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Tab');
  await expect(page.locator('#start-wave-button')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
  await page.getByRole('button', { name: 'Pause game' }).click();
  const pausedAt = await page.evaluate(() => gameApplication.session.state.gameTimeMs);
  const pauseSpeed = page.locator('[data-wave-speed-context="pause"]');
  await pauseSpeed.getByRole('button', { name: 'Wave speed 1×' }).click();
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => gameApplication.session.state.gameTimeMs)).toBe(pausedAt);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  const settingsSpeed = page.locator('[data-wave-speed-context="settings"]');
  await settingsSpeed.getByRole('button', { name: 'Wave speed 2×' }).click();
  await expect(settingsSpeed.getByRole('button', { name: 'Wave speed 2×' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
  await page.getByRole('button', { name: 'Pause game' }).click();
  await page.getByRole('button', { name: 'Save now' }).click();
  await page.getByRole('button', { name: 'Return to menu' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('dialog', { name: 'Paused' })).toBeVisible();
  await expect(page.locator('[data-wave-speed-context="pause"]')
    .getByRole('button', { name: 'Wave speed 2×' })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => ({
    phase: gameApplication.session.state.phase,
    resume: gameApplication.session.state.resumePhase,
    speed: gameApplication.session.state.waveSpeed
  }))).toEqual({ phase: 'PAUSED', resume: 'WAVE', speed: 2 });
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
  expect(await page.evaluate(() => gameApplication.session.state.waveSpeed)).toBe(2);
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
  await expect(page.locator('#terminal-summary')).toContainText(/defeated, 0 leaked/);
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

test('tower comparison shows rule-derived status, chain, investment and refund', async ({ page }) => {
  await openFresh(page, { width: 390, height: 844 });
  await enterBuildPhase(page);
  await page.locator('[data-tower-type="encryption"]').click();
  await clickWorld(page, 210, 210);
  const content = page.locator('#inspector-content');
  await expect(content.locator('tr').filter({ hasText: 'Damage per hit' })).toContainText('22.0');
  await expect(content.locator('tr').filter({ hasText: 'Damage per hit' })).toContainText('29.7');
  await expect(content.locator('tr').filter({ hasText: 'Fire rate' }).first()).toContainText('0.80 shots/s');
  await expect(content.locator('tr').filter({ hasText: 'Slow' })).toContainText('20% for 1.80 s');
  await expect(content.locator('tr').filter({ hasText: 'Slow' })).toContainText('24% for 2.07 s');
  await expect(content.locator('tr').filter({ hasText: 'Vulnerability' })).toContainText('12% for 1.80 s');
  await expect(content.locator('tr').filter({ hasText: 'Vulnerability' })).toContainText('15% for 2.07 s');
  await expect(content).toContainText('choose one specialization at level 3');
  await expect(content).toContainText('Total investment: 50 Dharma, 35 Bandwidth');
  await expect(content).toContainText('Refund (70%): 35 Dharma, 24 Bandwidth');
  await expect(content).toContainText('Next upgrade cost: 98 Dharma, 68 Bandwidth');
});

test('Distributor support inspector shows actual benefit and passive income', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await page.locator('[data-tower-type="distributor"]').click();
  await clickWorld(page, 210, 210);
  await page.locator('[data-tower-type="firewall"]').click();
  await clickWorld(page, 270, 210);
  await clickWorld(page, 210, 210);
  const content = page.locator('#inspector-content');
  await expect(content).toContainText('Does not attack');
  await expect(content.locator('tr').filter({ hasText: 'Fire-rate aura' })).toContainText('12%');
  await expect(content.locator('tr').filter({ hasText: 'Fire-rate aura' })).toContainText('16%');
  await expect(content.locator('tr').filter({ hasText: 'Attackers with rate boost' })).toContainText('1 of 1 in range');
  await expect(content.locator('tr').filter({ hasText: 'Rate gain while firing' })).toContainText('0.12 shots/s');
  await expect(content).toContainText('Firewall Fortress: 1.00 shots/s → 1.12 shots/s');
  await expect(content).toContainText('Passive wave-clear bonus: +6 Dharma per installed Distributor, capped at +30');
  await expect(content).toContainText('Total investment: 70 Dharma, 60 Bandwidth');
  await expect(content).toContainText('Refund (70%): 49 Dharma, 42 Bandwidth');
  await expect(content).not.toContainText(/\bslow\b/i);
});

test('keyboard can inspect towers and enemy roster in build and wave phases', async ({ page }) => {
  await openFresh(page, { width: 360, height: 640 });
  await tabTo(page, page.getByRole('button', { name: 'New game' }));
  await page.keyboard.press('Enter');
  await tabTo(page, page.getByRole('button', { name: 'Skip tutorial' }));
  await page.keyboard.press('Enter');
  await tabTo(page, page.locator('#game-canvas'));
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Enter');
  await expect(page.locator('#inspector-content')).toContainText('Firewall Fortress');
  await tabTo(page, page.locator('[data-enemy-type="scriptKiddie"]'));
  await page.keyboard.press('Enter');
  await expect(page.locator('#enemy-inspector-title')).toBeFocused();
  await expect(page.locator('#enemy-inspector-content')).toContainText('No active special ability');
  await expect(page.locator('#enemy-inspector-content')).not.toContainText('erratic');
  await tabTo(page, page.getByRole('button', { name: 'Start wave 1' }));
  await page.keyboard.press('Enter');
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
  await expect(page.locator('[data-enemy-type="scriptKiddie"]')).toHaveAttribute('aria-label', /in this wave/);
  await tabTo(page, page.locator('#game-canvas'));
  await page.keyboard.press('Escape');
  await page.keyboard.press('Enter');
  await expect(page.locator('#tower-inspector')).toHaveAttribute('open', '');
  await expect(page.locator('#upgrade-button')).toBeDisabled();
  await expect(page.locator('#sell-button')).toBeDisabled();
  await tabTo(page, page.locator('[data-enemy-type="scriptKiddie"]'));
  await page.keyboard.press('Enter');
  await expect(page.locator('#enemy-inspector-content')).toContainText('Physical: ×1.00');
  await expect(page.locator('#enemy-inspector-content')).toContainText('Shock: ×1.00');
});

test('pointer inspects live wave enemies and towers without building or selling', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await clickWorld(page, 210, 210);
  await page.getByRole('button', { name: 'Start wave 1' }).click();
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
  await clickWorld(page, 210, 210);
  await expect(page.locator('#inspector-content')).toContainText('Firewall Fortress');
  await expect(page.locator('#upgrade-button')).toBeDisabled();
  await expect(page.locator('#sell-button')).toBeDisabled();
  await expect(page.locator('[data-tower-type="firewall"]')).toBeDisabled();
  await clickWorld(page, 450, 210);
  expect(await page.evaluate(() => gameApplication.session.state.defenses.size)).toBe(1);
  await expect.poll(() => page.evaluate(() => [...gameApplication.session.state.enemies.values()]
    .some((enemy) => enemy.x > 30 && enemy.x < 130))).toBe(true);
  const position = await page.evaluate(() => {
    const app = gameApplication;
    const enemy = [...app.session.state.enemies.values()].find((candidate) => candidate.x > 30 && candidate.x < 130);
    const rect = app.camera.canvas.getBoundingClientRect();
    return {
      x: rect.left + app.camera.offsetX + enemy.x * app.camera.scale,
      y: rect.top + app.camera.offsetY + enemy.y * app.camera.scale
    };
  });
  await page.mouse.click(position.x, position.y);
  await expect(page.locator('#enemy-inspector-content')).toContainText('Script Kiddie');
  await expect(page.locator('#enemy-inspector-content')).toContainText('Armor: 0');
  expect(await page.evaluate(() => gameApplication.session.state.defenses.size)).toBe(1);
});

test('enemy details state implemented abilities without unused phase metadata', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await page.evaluate(() => {
    gameApplication.session.state.waveNumber = 3;
    gameApplication.ui.update(gameApplication.session);
  });
  await page.locator('[data-enemy-type="federalAgent"]').click();
  await expect(page.locator('#enemy-inspector-content')).toContainText('Armor: 5');
  await expect(page.locator('#enemy-inspector-content')).toContainText('Physical: ×0.90');
  await expect(page.locator('#enemy-inspector-content')).toContainText('Shock: ×1.10');
  await expect(page.locator('#enemy-inspector-content')).toContainText('Shield brace: warns for 3 s');
  await expect(page.locator('#enemy-inspector-content')).not.toContainText('persistent');
  await page.locator('[data-enemy-type="scriptKiddie"]').click();
  await expect(page.locator('#enemy-inspector-content')).toContainText('No active special ability');
  await page.evaluate(() => {
    gameApplication.session.state.waveNumber = 5;
    gameApplication.ui.update(gameApplication.session);
  });
  await page.locator('[data-enemy-type="raidTeam"]').click();
  await expect(page.locator('#enemy-inspector-content')).toContainText('reinforcements');
  await expect(page.locator('#enemy-inspector-content')).toContainText('EMP');
  await page.evaluate(() => {
    gameApplication.session.state.waveNumber = 15;
    gameApplication.ui.update(gameApplication.session);
  });
  await page.locator('[data-enemy-type="megaCorpTitan"]').click();
  await expect(page.locator('#enemy-inspector-content')).toContainText('shield that regenerates');
  await expect(page.locator('#enemy-inspector-content')).toContainText('after 3 s without hits at 4%');
  await expect(page.locator('#enemy-inspector-content')).not.toContainText('phase 4');
});

test('unaffordable and wave-locked tower blueprints remain inspectable without build actions', async ({ page }) => {
  await openFresh(page, { width: 360, height: 640 });
  await enterBuildPhase(page);
  await clickWorld(page, 210, 210);
  await page.locator('[data-tower-type="encryption"]').click();
  await clickWorld(page, 270, 210);
  await expect(page.locator('[data-tower-type="distributor"]')).toBeDisabled();
  await page.locator('[data-inspect-tower-type="distributor"]').click();
  await expect(page.locator('#tower-blueprint')).toHaveAttribute('open', '');
  await expect(page.locator('#tower-blueprint-content')).toContainText('Dharma Distributor · Unplaced');
  await expect(page.locator('#tower-blueprint-content')).toContainText('Fire-rate aura');
  await expect(page.locator('#tower-blueprint-content')).toContainText('Build cost: 70 Dharma, 60 Bandwidth');
  await expect(page.locator('#inspector-content')).toContainText('Encryption Monastery');
  await page.getByRole('button', { name: 'Start wave 1' }).click();
  await expect(page.locator('[data-tower-type="firewall"]')).toBeDisabled();
  await tabTo(page, page.locator('[data-inspect-tower-type="firewall"]'));
  await page.keyboard.press('Enter');
  await expect(page.locator('#tower-blueprint-content')).toContainText('Firewall Fortress · Unplaced');
  await expect(page.locator('#tower-blueprint-content')).toContainText('30.0');
  await expect(page.locator('#upgrade-button')).toBeDisabled();
  await expect(page.locator('#sell-button')).toBeDisabled();
  expect(await page.evaluate(() => ({
    count: gameApplication.session.state.defenses.size,
    selectedType: gameApplication.session.state.selectedTowerType
  }))).toEqual({ count: 2, selectedType: 'encryption' });
});

test('wave keyboard cursor visibly moves to and selects another placed tower', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await clickWorld(page, 210, 210);
  await page.locator('[data-tower-type="encryption"]').click();
  await clickWorld(page, 270, 210);
  await page.getByRole('button', { name: 'Start wave 1' }).click();
  await tabTo(page, page.locator('#game-canvas'));
  await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowRight');
  expect(await page.evaluate(() => gameApplication.renderer.inspectionPosition)).toEqual({ x: 270, y: 210 });
  await page.keyboard.press('Enter');
  await expect(page.locator('#inspector-content')).toContainText('Encryption Monastery');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await expect(page.locator('#inspector-content')).toContainText('Firewall Fortress');
  expect(await page.evaluate(() => gameApplication.session.state.defenses.size)).toBe(2);
});

test('wave support benefit refreshes when EMP suppression expires', async ({ page }) => {
  await openFresh(page);
  await enterBuildPhase(page);
  await clickWorld(page, 210, 210);
  await page.locator('[data-tower-type="distributor"]').click();
  await clickWorld(page, 270, 210);
  await page.getByRole('button', { name: 'Start wave 1' }).click();
  await page.evaluate(() => {
    const app = gameApplication;
    const support = [...app.session.state.defenses.values()].find((tower) => tower.type === 'distributor');
    support.disabledUntilMs = app.session.state.gameTimeMs + 1500;
    app.ui.update(app.session);
  });
  const content = page.locator('#inspector-content');
  await expect(content).toContainText('Aura currently suppressed by EMP');
  await expect(content.locator('tr').filter({ hasText: 'Rate gain while firing' })).toContainText('0.00 shots/s');
  await expect(content).not.toContainText('Aura currently suppressed by EMP');
  await expect(content.locator('tr').filter({ hasText: 'Rate gain while firing' })).toContainText('0.12 shots/s');
});

for (const [width, height] of [[360,640],[390,844],[640,360],[844,390],[1280,720]]) {
  test(`combat cues and text stay accessible during waves at ${width}x${height}`, async ({page}) => {
    await openFresh(page, {width,height}); await enterBuildPhase(page);
    await clickWorld(page,210,210);
    await page.evaluate(() => { gameApplication.session.state.waveNumber = 5; gameApplication.ui.update(gameApplication.session); });
    await expect(page.locator('#emp-warning')).toContainText('one burst immediately at 66%');
    await expect(page.locator('#emp-warning')).toContainText('3 Script Kiddies and 1 Federal Agent');
    expect(await page.evaluate(() => gameApplication.session.state.enemies.size)).toBe(0);
    await combatFixture(page);
    await page.getByRole('region',{name:'Combat status'}).click();
    await expect(page.locator('#combat-state')).toContainText('Disruption boss');
    await expect(page.locator('#combat-state')).toContainText('Next EMP at 66%');
    await expect(page.locator('#combat-state')).toContainText('Slow: 20% less speed');
    await expect(page.locator('#combat-state')).toContainText('Vulnerable: +12% damage before resistance/armor');
    await expect(page.locator('#combat-state')).toContainText('cannot fire');
    await tabTo(page,page.locator('#combat-feedback'));
    await expect(page.locator('#combat-feedback')).toBeFocused();
    await tabTo(page,page.locator('#game-canvas'));
    await page.keyboard.press('Escape'); await page.keyboard.press('Enter');
    await expect(page.locator('#inspector-content')).toContainText('Firewall Fortress');
    await expect(page.locator('#upgrade-button')).toBeDisabled();
    await expect(page.locator('#sell-button')).toBeDisabled();
    await clickWorld(page,210,210);
    expect(await page.evaluate(() => gameApplication.session.state.defenses.size)).toBe(1);
    await page.locator('#settings-button').click();
    await page.locator('#motion-toggle').check(); await page.keyboard.press('Escape');
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('#combat-state')).toContainText('Slow: 20%');
    await page.screenshot({path: `test-results/m22-${width}x${height}.png`});
  });
}

test('combat text follows boss phase, shield damage and status expiry without live-region spam', async ({page}) => {
  await openFresh(page); await enterBuildPhase(page);
  await combatFixture(page,15);
  const actual = await page.evaluate(() => {
    const e = [...gameApplication.session.state.enemies.values()].find(e => e.kind === 'boss');
    return {health:Math.ceil(e.health), max:Math.ceil(e.maxHealth), shield:Math.ceil(e.shield), shieldMax:e.shieldMax};
  });
  await expect(page.locator('#combat-state')).toContainText(`Health ${actual.health} / ${actual.max}`);
  await expect(page.locator('#combat-state')).toContainText(`Shield ${actual.shield} / ${actual.shieldMax}`);
  await expect(page.locator('#combat-state')).toContainText('no health-triggered phases');
  await expect(page.locator('#combat-state')).not.toHaveAttribute('aria-live');
  await page.evaluate(() => {
    const s = gameApplication.session;
    s.state.gameTimeMs += 1800; gameApplication.ui.refreshLiveInspection(s);
  });
  await expect(page.locator('#combat-state')).not.toContainText('Slow:');
  await expect(page.locator('#combat-state')).not.toContainText('Vulnerable:');
});

for (const viewport of [{width:360,height:640},{width:390,height:844},{width:640,height:360},{width:844,height:390},{width:1280,height:720}]) {
  test(`wave reports persist and allow pointer and keyboard dismissal at ${viewport.width}x${viewport.height}`, async ({page}) => {
    await openFresh(page, viewport); await enterBuildPhase(page); await reportFixture(page);
    const host=page.locator('#wave-reports');
    const summary=host.locator('summary');
    await summary.click();
    await expect(host).toContainText('Script Kiddie');
    await expect(host).toContainText('No attacking tower range observed');
    await expect(host).toContainText('Build/upgrade spent');
    await expect(page.getByRole('button',{name:'Start wave 2',exact:true})).toBeEnabled();
    await page.reload();
    await page.getByRole('button',{name:'Continue',exact:true}).click();
    if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
    await expect(summary).toBeVisible();
    await page.getByRole('button',{name:'Start wave 2',exact:true}).click();
    await expect(summary).toBeVisible();
    // Reach the disclosure through actual Tab traversal, then open with Enter.
    await page.keyboard.press('Tab');
    for(let i=0;i<80 && !(await summary.evaluate(e=>e===document.activeElement));i++) await page.keyboard.press('Tab');
    await expect(summary).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    const dismiss=host.getByRole('button',{name:'Dismiss wave 1 report'});
    await expect(dismiss).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(summary).toHaveCount(0);
    await expect(page.getByRole('button',{name:'Pause game'})).toBeFocused();
    await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
    if (await page.locator('#resume-button').isVisible()) await page.locator('#resume-button').click();
    await expect(summary).toHaveCount(0);
  });
}

test('defeat reports remain accessible inside the terminal dialog', async ({page}) => {
  await openFresh(page,{width:360,height:640}); await enterBuildPhase(page); await reportFixture(page,true);
  const host=page.locator('#terminal-reports');
  await host.locator('summary').click();
  await expect(host).toContainText('defeat');
  await host.getByRole('button',{name:'Dismiss wave 1 report'}).click();
  await expect(page.getByRole('button',{name:'Play again',exact:true})).toBeFocused();
});

// M3.1 preview setup selects an authored wave only; clicks/keys remain real.
for (const viewport of [
  {width:360,height:640}, {width:390,height:844}, {width:640,height:360},
  {width:844,height:390}, {width:1280,height:720}
]) test(`authored overlap timing remains inspectable with deliberate starts at ${viewport.width}×${viewport.height}`, async ({page}) => {
  await openFresh(page,viewport); await enterBuildPhase(page);
  await page.evaluate(()=>{ gameApplication.session.state.waveNumber=4; gameApplication.ui.update(gameApplication.session); });
  const preview=page.locator('#wave-preview-section');
  await expect(preview).toContainText('simulated seconds after Start Wave');
  const agents=page.locator('#wave-preview-list li').filter({has:page.getByRole('button',{name:/Inspect Federal Agent/})});
  await expect(agents).toContainText('3 from 0 s to 1.8 s; every 0.9 s');
  await expect(agents).toContainText('2 from 6 s to 6.9 s; every 0.9 s');
  await expect(page.locator('#wave-preview-gaps')).toContainText('between 1.8 s and 6 s');
  await expect(page.locator('#wave-preview-gaps')).toContainText('may still be active');
  await page.getByRole('button',{name:/Inspect Federal Agent/}).click();
  await expect(page.locator('#enemy-inspector')).toContainText('Armor');
  await expect(page.locator('#enemy-inspector')).toHaveAttribute('open','');
  await page.getByRole('button',{name:'Hide wave preview'}).click();
  await expect(page.locator('#wave-preview-title')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(preview).toHaveAttribute('open','');
  await page.locator('[data-wave-speed-context="game"]').getByRole('button',{name:'Wave speed 2×'}).click();
  expect(await page.evaluate(()=>({phase:gameApplication.session.state.phase,time:gameApplication.session.state.gameTimeMs,spawned:gameApplication.session.state.wave.spawned})))
    .toEqual({phase:'BUILDING',time:0,spawned:0});
  await expect(agents).toContainText('3 from 0 s to 1.8 s');
  const start=page.getByRole('button',{name:'Start wave 4'});
  const box=await start.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x+box.width).toBeLessThanOrEqual(viewport.width+1);
  expect(box.y+box.height).toBeLessThanOrEqual(viewport.height+1);
  await start.click(); await expect(page.locator('#phase-label')).toHaveText('Wave active');
  await expect(page.locator('[data-tower-type="firewall"]')).toBeDisabled();
});

test('keyboard reads Raid timing and warning, inspects, dismisses and deliberately starts', async ({page}) => {
  await openFresh(page,{width:360,height:640}); await enterBuildPhase(page);
  await page.evaluate(()=>{ gameApplication.session.state.waveNumber=5; gameApplication.ui.update(gameApplication.session); });
  await tabTo(page,page.locator('#wave-preview-title'),true);
  await page.keyboard.press('Enter'); await page.keyboard.press('Enter');
  await expect(page.locator('#wave-preview-list')).toContainText('1 at 0 s');
  await expect(page.locator('#wave-preview-list')).toContainText('6 from 6.5 s to 8 s; every 0.3 s');
  await expect(page.locator('#emp-warning')).toContainText('66%');
  const raid=page.getByRole('button',{name:/Inspect Raid Team/});
  await expect(raid).toHaveAccessibleDescription('1 at 0 s');
  await tabTo(page,raid); await page.keyboard.press('Enter');
  await expect(page.locator('#enemy-inspector-title')).toBeFocused();
  await tabTo(page,page.getByRole('button',{name:'Hide wave preview'}),true); await page.keyboard.press('Enter');
  await expect(page.locator('#wave-preview-title')).toBeFocused();
  await tabTo(page,page.getByRole('button',{name:'Start wave 5'})); await page.keyboard.press('Enter');
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
});

test('later act previews expose mixed packets and final boss timing before Start Wave', async ({page}) => {
  await openFresh(page,{width:360,height:640});await enterBuildPhase(page);
  await page.evaluate(()=>{gameApplication.session.state.waveNumber=7;gameApplication.ui.update(gameApplication.session);});
  const runners=page.locator('#wave-preview-list li').filter({has:page.getByRole('button',{name:/Inspect Script Kiddie/})});
  await expect(runners).toContainText('5 from 0 s to 1.8 s; every 0.45 s');
  await expect(runners).toContainText('5 from 6.1 s to 7.9 s; every 0.45 s');
  await page.evaluate(()=>{gameApplication.session.state.waveNumber=20;gameApplication.ui.update(gameApplication.session);});
  await expect(page.locator('#wave-preview-list li')).toHaveCount(5);
  const titan=page.getByRole('button',{name:/Inspect MegaCorp Titan/});
  await expect(titan).toHaveAccessibleDescription('2 from 0 s to 14 s; every 14 s');
  await expect(page.locator('#wave-preview-list')).toContainText('8 from 14.5 s to 18.7 s; every 0.6 s');
  await tabTo(page,titan,true);await page.keyboard.press('Enter');
  await expect(page.locator('#enemy-inspector-content')).toContainText('shield');
  expect(await page.evaluate(()=>({phase:gameApplication.session.state.phase,time:gameApplication.session.state.gameTimeMs})))
    .toEqual({phase:'BUILDING',time:0});
});

test('new schedule pause/reload/Continue retains pending arrivals, 2× and preferences', async ({page}) => {
  await openFresh(page,{width:360,height:640}); await enterBuildPhase(page); await clickWorld(page,210,210);
  await page.locator('[data-wave-speed-context="game"]').getByRole('button',{name:'Wave speed 2×'}).click();
  await page.getByRole('button',{name:'Start wave 1'}).click();
  await page.evaluate(()=>{
    const s=gameApplication.session; s.tick=()=>{}; // disable RAF only for the checkpoint fixture
    while(s.scheduler.elapsedMs<4000) s.step(1000/60);
    s.updateSetting('showRanges',false); s.updateSetting('reducedMotion',true);
  });
  await page.getByRole('button',{name:'Pause game',exact:true}).click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')));
  expect(saved.balanceVersion).toBe(await page.evaluate(()=>gameApplication.balance.version)); expect(saved.runtime.scheduler.cursor).toBe(4);
  await page.reload(); await page.getByRole('button',{name:'Continue',exact:true}).click();
  expect(await page.evaluate(()=>gameApplication.session.scheduler.snapshot())).toEqual(saved.runtime.scheduler);
  expect(await page.evaluate(()=>gameApplication.session.state.settings)).toEqual(saved.state.settings);
  expect(await page.evaluate(()=>gameApplication.session.state.waveSpeed)).toBe(2);
  await page.getByRole('button',{name:'Resume',exact:true}).click();
  await expect(page.locator('#wave-preview-list')).toContainText('4 from 6.5 s to 8.6 s');
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
});

test('prior balance save exports exact original and reset preserves independent preferences', async ({page}) => {
  const {readFile}=await import('node:fs/promises');
  const raw=await readFile('design/reviews/2026-11-12-m3.1/old-1.0.0-save.json','utf8');
  await openFresh(page);
  await page.evaluate(raw=>{
    localStorage.setItem('dharmapala-shield/save/v2',raw);
    localStorage.setItem('dharmapala-shield/preferences/v1',JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));
  },raw);
  await page.reload();
  await expect(page.getByRole('region',{name:'Local save recovery'})).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('dharmapala-shield/save/v2'))).toBe(raw);
  const waiting=page.waitForEvent('download'); await page.getByRole('button',{name:'Export recovery save'}).click();
  expect(await readFile(await (await waiting).path(),'utf8')).toBe(raw);
  await page.getByRole('button',{name:'Reset saved run'}).click();
  await page.getByRole('button',{name:'New game',exact:true}).click();
  await expect(page.locator('#start-wave-button')).toBeEnabled();
  expect(await page.evaluate(()=>gameApplication.session.state.settings)).toEqual({tutorialCompleted:true,showRanges:false,reducedMotion:true});
});

// M3.2 setup grants funds for inspector interactions; not campaign evidence.
for (const viewport of [{width:360,height:640},{width:390,height:844},{width:640,height:360},{width:844,height:390},{width:1280,height:720}]) {
  for (const [type,choice,label] of [['firewall','coverage','Coverage'],['encryption','reach','Chain reach']]) {
    test(`specialization choice ${type} at ${viewport.width}×${viewport.height} is visible, permanent and saved`,async({page})=>{
      const {specializationFixture}=await import('./helpers.js');
      await openFresh(page,viewport);await enterBuildPhase(page);await specializationFixture(page,type);
      const content=page.locator('#inspector-content');
      await expect(content.getByRole('group',{name:'Choose level-3 specialization (mutually exclusive)'})).toBeVisible();
      await expect(content).toContainText('Human playtest acceptance is pending');
      const button=page.locator(`[data-specialization="${choice}"]`);
      await expect(button).toHaveAttribute('aria-describedby',`specialization-${choice}-description`);
      await button.click();
      await expect(content).toContainText(`Chosen: ${label}`);
      await expect(page.locator('[data-specialization]')).toHaveCount(0);
      await expect(page.locator('#upgrade-button')).toBeFocused();
      await page.locator('#upgrade-button').click();
      await expect(content).toContainText(`Chosen: ${label}`);
      expect(await page.evaluate(()=>[...gameApplication.session.state.defenses.values()][0].level)).toBe(4);
      expect(await page.evaluate(()=>gameApplication.session.state.phase)).toBe('BUILDING');
      await page.reload();await page.getByRole('button',{name:'Continue',exact:true}).click();
      if(await page.locator('#resume-button').isVisible())await page.locator('#resume-button').click();
      await clickWorld(page,210,210);
      await expect(content).toContainText(`Chosen: ${label}`);
      expect(await page.evaluate(()=>gameApplication.session.toSnapshot().schemaVersion)).toBe(4);
      await page.locator('#start-wave-button').click();
      await expect(page.locator('#upgrade-button')).toBeDisabled();
    });
  }
}
for (const [type,choice] of [['firewall','focus'],['encryption','sustain']]) test(`${type} specialization uses actual Tab/Enter with useful focus after choice`,async({page})=>{
  const {specializationFixture}=await import('./helpers.js');
  await openFresh(page,{width:360,height:640});await enterBuildPhase(page);await specializationFixture(page,type);
  const button=page.locator(`[data-specialization="${choice}"]`);
  await tabTo(page,button,true);await page.keyboard.press('Enter');
  await expect(page.locator('#upgrade-button')).toBeFocused();
  expect(await page.evaluate(()=>[...gameApplication.session.state.defenses.values()][0].specialization)).toBe(choice);
});
test('unaffordable and wave-locked level-3 choices explain costs without permitting purchases',async({page})=>{
  const {specializationFixture}=await import('./helpers.js');
  await openFresh(page);await enterBuildPhase(page);await specializationFixture(page,'firewall',false);
  for(const id of ['focus','coverage'])await expect(page.locator(`[data-specialization="${id}"]`)).toBeDisabled();
  await expect(page.locator('#inspector-content')).toContainText('Next upgrade cost: 114 Dharma');
  await page.locator('#start-wave-button').click();
  for(const id of ['focus','coverage'])await expect(page.locator(`[data-specialization="${id}"]`)).toBeDisabled();
});
test('M3.1 save version rejection exports exact bytes and preserves independent preferences',async({page})=>{
  const {readFile}=await import('node:fs/promises');
  const raw=await readFile('design/reviews/2026-11-12-m3.2/old-1.1.0-v2-save.json','utf8');
  await openFresh(page);
  await page.evaluate(raw=>{localStorage.setItem('dharmapala-shield/save/v2',raw);localStorage.setItem('dharmapala-shield/preferences/v1',JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));},raw);
  await page.reload();await expect(page.getByRole('region',{name:'Local save recovery'})).toBeVisible();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery save'}).click();
  const path=await(await download).path();expect(await readFile(path,'utf8')).toBe(raw);
  await page.getByRole('button',{name:'Reset saved run'}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/preferences/v1')).reducedMotion)).toBe(true);
});

for(const viewport of [{width:360,height:640},{width:1280,height:720}])test(`two-resource economy, saving guidance and exact Bandwidth deficit at ${viewport.width}`,async({page})=>{
  await openFresh(page,viewport);await enterBuildPhase(page);
  await expect(page.locator('#hud')).toContainText('Dharma');await expect(page.locator('#hud')).toContainText('Bandwidth');await expect(page.locator('#hud')).not.toContainText('Anonymity');
  await tabTo(page,page.locator('#resource-guide summary'));await page.keyboard.press('Enter');
  await expect(page.locator('#resource-guide')).toContainText('Save either for later waves; there is no interest. Anonymity is retired.');
  await page.locator('[data-tower-type="encryption"]').click();await clickWorld(page,210,210);
  // Real initial resources: 80 Dharma and 25 Bandwidth remain. Both deficits are displayed.
  await expect(page.locator('#inspector-content')).toContainText('Need 18 Dharma and 43 Bandwidth more.');
  await expect(page.locator('#upgrade-button')).toBeDisabled();
  await page.locator('#start-wave-button').click();
  expect(await page.evaluate(()=>gameApplication.session.upgradeDefense([...gameApplication.session.state.defenses.keys()][0]).ok)).toBe(false);
});

test('retired-economy v3 bytes export unchanged and reset preserves preferences',async({page})=>{
  const {readFile}=await import('node:fs/promises');const raw=await readFile('design/reviews/2026-11-12-m3.3/old-1.2.0-v3-save.json','utf8');
  await openFresh(page,{width:360,height:640});
  await page.evaluate(raw=>{localStorage.setItem('dharmapala-shield/save/v2',raw);localStorage.setItem('dharmapala-shield/preferences/v1',JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));},raw);await page.reload();
  await expect(page.locator('#save-recovery')).toBeVisible();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery save'}).click();expect(await readFile(await(await download).path(),'utf8')).toBe(raw);
  await page.getByRole('button',{name:'Reset saved run'}).click();await page.getByRole('button',{name:'New game',exact:true}).click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')));
  expect(saved.schemaVersion).toBe(4);expect(saved.balanceVersion).toBe('1.7.0');expect(saved.state.resources.anonymity).toBe(0);expect(saved.state.settings).toMatchObject({showRanges:false,reducedMotion:true});
});

for(const speed of [1,2])test(`Agent brace cue/text, pause/reload and explicit v4 state at ${speed}×`,async({page})=>{
  const {braceFixture,braceFrame}=await import('./helpers.js');
  await openFresh(page,{width:360,height:640});await enterBuildPhase(page);await braceFixture(page,speed);
  await tabTo(page,page.locator('[data-enemy-type="federalAgent"]'));await page.keyboard.press('Enter');
  await expect(page.locator('#enemy-inspector-content')).toContainText('warns for 3 s');
  await expect(page.locator('#enemy-inspector-content')).toContainText('Kill before activation');
  await expect(page.locator('#enemy-inspector-content')).toContainText('cover the route after expiry');
  for(const phase of ['warning','active','spent']) {
    const frame=await braceFrame(page,phase);
    const expected=phase==='warning'?'Shield brace in':phase==='active'?'expires in':'Shield brace spent';
    await expect(page.locator('#combat-state')).toContainText(expected);
    await tabTo(page,page.locator('#combat-feedback'));await expect(page.locator('#combat-feedback')).toBeFocused();
    await page.locator('#pause-button').click();
    expect(await page.evaluate(()=>gameApplication.session.state.gameTimeMs)).toBe(frame.time);
    await page.reload();await page.getByRole('button',{name:'Continue',exact:true}).click();
    await expect(page.locator('#combat-state')).toContainText(expected);
    const actual=await page.evaluate(()=>{
      const s=gameApplication.session;s.tick=()=>{};
      const e=[...s.state.enemies.values()].find(e=>e.brace);return {time:s.state.gameTimeMs,brace:e.brace,shield:e.shield,speed:s.state.waveSpeed};
    });expect(actual).toEqual({...frame,speed});
    await page.locator('#resume-button').click();
  }
  expect(await page.locator('#combat-feedback').getAttribute('aria-live')).toBeNull();
});
test('M3.3 v3 recovery exports exact bytes before explicit reset and creates v4 with preferences',async({page})=>{
  const {readFile}=await import('node:fs/promises');const raw=await readFile('design/reviews/2026-11-12-m3.4/old-1.3.0-v3-save.json','utf8');
  await openFresh(page);await page.evaluate(raw=>{localStorage.setItem('dharmapala-shield/save/v2',raw);localStorage.setItem('dharmapala-shield/preferences/v1',JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));},raw);await page.reload();
  await expect(page.locator('#save-recovery')).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('dharmapala-shield/save/v2'))).toBe(raw);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery save'}).click();expect(await readFile(await(await download).path(),'utf8')).toBe(raw);
  await page.getByRole('button',{name:'Reset saved run'}).click();await page.getByRole('button',{name:'New game',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')))).toMatchObject({schemaVersion:4,balanceVersion:'1.7.0',state:{settings:{showRanges:false,reducedMotion:true}}});
});

test('M4.1 old 1.4.0/v4 wave bytes export exactly before reset and retain preferences',async({page})=>{
  const {readFile}=await import('node:fs/promises');
  const raw=await readFile('design/reviews/2026-11-12-m4.1/old-1.4.0-v4-save.json','utf8');
  await openFresh(page);await page.evaluate(raw=>{
    localStorage.setItem('dharmapala-shield/save/v2',raw);
    localStorage.setItem('dharmapala-shield/preferences/v1',JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));
  },raw);await page.reload();
  await expect(page.locator('#save-recovery')).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('dharmapala-shield/save/v2'))).toBe(raw);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery save'}).click();
  expect(await readFile(await(await download).path(),'utf8')).toBe(raw);
  await page.getByRole('button',{name:'Reset saved run'}).click();
  await page.getByRole('button',{name:'New game',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')))).toMatchObject({
    schemaVersion:4,balanceVersion:'1.7.0',state:{settings:{showRanges:false,reducedMotion:true}}
  });
});

test('M4.2 old 1.5.0/v4 Raid bytes export exactly before explicit reset',async({page})=>{
  const {readFile}=await import('node:fs/promises');
  const raw=await readFile('design/reviews/2026-11-12-m4.2/old-1.5.0-v4-save.json','utf8');
  await openFresh(page);await page.evaluate(raw=>{
    localStorage.setItem('dharmapala-shield/save/v2',raw);
    localStorage.setItem('dharmapala-shield/preferences/v1',JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));
  },raw);await page.reload();
  await expect(page.locator('#save-recovery')).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('dharmapala-shield/save/v2'))).toBe(raw);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery save'}).click();
  expect(await readFile(await(await download).path(),'utf8')).toBe(raw);
  await page.getByRole('button',{name:'Reset saved run'}).click();
  await page.getByRole('button',{name:'New game',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')))).toMatchObject({
    schemaVersion:4,balanceVersion:'1.7.0',state:{settings:{showRanges:false,reducedMotion:true}}
  });
});

test('M4.3 old 1.6.0/v4 Hard wave bytes export exactly before explicit reset',async({page})=>{
  const {readFile}=await import('node:fs/promises');
  const raw=await readFile('design/reviews/2026-11-13-m4.3/old-1.6.0-v4-save.json','utf8');
  await openFresh(page);await page.evaluate(raw=>{
    localStorage.setItem('dharmapala-shield/save/v2',raw);
    localStorage.setItem('dharmapala-shield/preferences/v1',JSON.stringify({tutorialCompleted:true,showRanges:false,reducedMotion:true}));
  },raw);await page.reload();
  await expect(page.locator('#save-recovery')).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('dharmapala-shield/save/v2'))).toBe(raw);
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery save'}).click();
  expect(await readFile(await(await download).path(),'utf8')).toBe(raw);
  await page.getByRole('button',{name:'Reset saved run'}).click();await page.getByRole('button',{name:'New game',exact:true}).click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('dharmapala-shield/save/v2')))).toMatchObject({
    schemaVersion:4,balanceVersion:'1.7.0',state:{settings:{showRanges:false,reducedMotion:true}}
  });
});

test('M4.2 warning names the reinforcements and clears after the single EMP', async ({page}) => {
  await openFresh(page,{width:390,height:844});await enterBuildPhase(page);
  await page.evaluate(()=>{gameApplication.session.state.waveNumber=5;gameApplication.ui.update(gameApplication.session);});
  await expect(page.locator('#emp-warning')).toContainText('spaced 0.25 s apart');
  await combatFixture(page);
  await page.evaluate(()=>{
    const s=gameApplication.session,boss=[...s.state.enemies.values()].find(e=>e.type==='raidTeam');
    boss.health=boss.maxHealth*0.65;s.systems.enemy.updateBosses(s);gameApplication.ui.update(s);
  });
  await expect(page.locator('#emp-warning')).toHaveText('');
  await expect(page.locator('#combat-state')).toContainText('EMP spent; reinforcements dispatched');
});

test('M4.2 live Titan text gives recovery countdown and active regeneration', async ({page}) => {
  await openFresh(page,{width:390,height:844});await enterBuildPhase(page);
  await page.evaluate(()=>{gameApplication.session.state.waveNumber=15;gameApplication.ui.update(gameApplication.session);});
  await combatFixture(page,15);
  await page.evaluate(()=>{
    const s=gameApplication.session,boss=[...s.state.enemies.values()].find(e=>e.type==='megaCorpTitan');
    boss.shieldCooldownUntilMs=s.state.gameTimeMs+2000;gameApplication.ui.update(s);
  });
  await expect(page.locator('#combat-state')).toContainText('Shield recovery in 2.0 s without hits');
  await page.evaluate(()=>{
    const s=gameApplication.session,boss=[...s.state.enemies.values()].find(e=>e.type==='megaCorpTitan');
    boss.shieldCooldownUntilMs=s.state.gameTimeMs;gameApplication.ui.update(s);
  });
  await expect(page.locator('#combat-state')).toContainText('Shield regenerating at 4% of capacity per second until hit');
});
