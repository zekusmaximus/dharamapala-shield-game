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
  { name: 'portrait', width: 390, height: 844 },
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
