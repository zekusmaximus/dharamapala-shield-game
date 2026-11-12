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

// Presentation fixture: production boss spawn, frozen frames, explicit state only.
export async function combatFixture(page, wave = 5) {
  await page.evaluate((wave) => {
    const app = gameApplication;
    const s = app.session;
    s.state.waveNumber = wave;
    s.startWave();
    s.step(1000 / 60);
    s.tick = () => {}; // freeze only this browser fixture for stable inspection
    const boss = [...s.state.enemies.values()].find(e => e.kind === 'boss');
    boss.slowPct = 0.2; boss.slowUntilMs = s.state.gameTimeMs + 1800;
    boss.vulnerabilityPct = 0.12; boss.vulnerabilityUntilMs = s.state.gameTimeMs + 1800;
    if (boss.shieldMax) boss.shield = boss.shieldMax / 2;
    const tower = [...s.state.defenses.values()][0];
    if (tower) tower.disabledUntilMs = s.state.gameTimeMs + 1500;
    app.ui.update(s);
  }, wave);
}

// Accelerated production wave, not a fixture that awards kills or clears directly.
export async function reportFixture(page, defeat = false) {
  await page.evaluate((defeat) => {
    const s = gameApplication.session;
    s.tick = () => {}; // disable RAF while synchronous fixed steps advance combat
    if (defeat) s.state.lives = 1;
    s.startWave();
    for (let i = 0; i < 30000 && s.state.phase === 'WAVE'; i++) s.step(1000 / 60);
    gameApplication.ui.update(s);
  }, defeat);
}

// Funded inspector fixture, not a fresh campaign: no combat outcome is implied.
export async function specializationFixture(page, type = 'firewall', funded = true) {
  await page.locator(`[data-tower-type="${type}"]`).click();
  await clickWorld(page, 210, 210);
  await page.evaluate(() => {
    gameApplication.session.state.resources = {dharma:2000,bandwidth:2000,anonymity:2000};
    gameApplication.ui.update(gameApplication.session);
  });
  await page.locator('#upgrade-button').click();
  if (!funded) await page.evaluate(() => {
    gameApplication.session.state.resources = {dharma:0,bandwidth:0,anonymity:0};
    gameApplication.ui.update(gameApplication.session);
  });
}

// Skipped-wave presentation fixture, no funding or earned-run combat claim.
export async function braceFixture(page, speed=1) {
  await page.evaluate(speed=>{
    const app=gameApplication,s=app.session;s.tick=()=>{};
    s.state.waveNumber=3;s.setWaveSpeed(speed);app.ui.update(s);
  },speed);
}
export async function braceFrame(page, phase) {
  return page.evaluate(phase=>{
    const app=gameApplication,s=app.session;
    if(s.state.phase==='BUILDING'){s.startWave();s.step(1000/60);}
    const e=[...s.state.enemies.values()].find(e=>e.brace);
    const target=phase==='warning'?e.brace.activatesAtMs-1000:phase==='active'?e.brace.activatesAtMs:e.brace.expiresAtMs;
    while(s.state.gameTimeMs<target)s.step(1000/60);
    app.ui.update(s);app.renderer.render(s);
    return {time:s.state.gameTimeMs,brace:structuredClone(e.brace),shield:e.shield};
  },phase);
}
