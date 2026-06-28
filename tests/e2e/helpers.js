import { expect } from '@playwright/test';

export async function openFresh(page, viewport = { width: 1280, height: 720 }) {
  await page.setViewportSize(viewport);
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole('button', { name: 'New game' })).toBeVisible();
}

export async function enterBuildPhase(page) {
  await page.getByRole('button', { name: 'New game' }).click();
  await expect(page.getByRole('dialog', { name: 'Protect the endpoint' })).toBeVisible();
  await page.getByRole('button', { name: 'Skip tutorial' }).click();
  await expect(page.getByRole('button', { name: 'Start wave 1' })).toBeEnabled();
}

export async function clickWorld(page, x, y) {
  const point = await page.evaluate(
    ({ worldX, worldY }) => {
      const app = globalThis.gameApplication;
      const rect = app.camera.canvas.getBoundingClientRect();
      return {
        x: rect.left + app.camera.offsetX + worldX * app.camera.scale,
        y: rect.top + app.camera.offsetY + worldY * app.camera.scale
      };
    },
    { worldX: x, worldY: y }
  );
  await page.mouse.click(point.x, point.y);
}
