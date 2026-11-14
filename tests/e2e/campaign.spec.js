// Earned UI campaigns. Keep synthetic lifecycle/presentation fixtures in game.spec.js.
import { test, expect } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { clickWorld } from './helpers.js';
import { getWavePreview } from '../../js/core/rules/waves.js';

const json = async path => JSON.parse(await readFile(new URL(path, import.meta.url)));
const balance = await json('../../design/balance.json');
const m43 = await json('../../design/reviews/2026-11-13-m4.3/scenarios-after.json');
const recovery = m43.recovery.find(r => r.difficulty === 'Normal' && r.response === 'save');
const report = await json('../../design/reviews/2026-11-13-m4.3/results.json');
const weak = report.runs.find(r => r.scenario === 'normal-campaign' && r.policy === 'weak-placement');
const snapshot = page => page.evaluate(() => gameApplication.session.toSnapshot());
const withoutDate = ({ savedAt, ...rest }) => rest;

// The same earned driver serves pointer and touch. Synthetic fixtures stay separate.
const touchPages = new WeakSet();
const portrait = { width: 390, height: 844 };
const landscape = { width: 844, height: 390 };
const activate = (page, locator) => touchPages.has(page) ? locator.tap() : locator.click();
async function world(page, x, y) {
  if (!touchPages.has(page)) return clickWorld(page, x, y);
  await page.locator('#game-canvas').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => {
    const { camera } = gameApplication;
    return Math.abs(camera.cssWidth - camera.canvas.getBoundingClientRect().width);
  })).toBeLessThan(1);
  const point = await page.evaluate(({ x, y }) => {
    const { camera } = gameApplication, rect = camera.canvas.getBoundingClientRect();
    return { x: rect.left + camera.offsetX + x * camera.scale,
      y: rect.top + camera.offsetY + y * camera.scale };
  }, { x, y });
  await page.touchscreen.tap(point.x, point.y);
}

async function observe(page, previous = { bosses: [], spawns: [] }) {
  // Subscribers only read production events/entities; they never wrap commands or combat.
  await page.evaluate(previous => {
    globalThis.campaignAudit = previous;
    const s = gameApplication.session;
    s.events.on('enemy-spawned', event => {
      const e = s.state.enemies.get(event.enemyId);
      campaignAudit.spawns.push({ wave: s.state.waveNumber, type: e.type, time: s.state.gameTimeMs });
      if (e.kind === 'boss') campaignAudit.bosses.push({ id: e.id, wave: s.state.waveNumber,
        type: e.type, outcome: 'unresolved', phases: [] });
    });
    s.events.on('boss-phase', event => campaignAudit.bosses.find(b => b.id === event.enemyId)?.phases.push(event.phase));
    for (const [event, outcome] of [['enemy-killed', 'killed'], ['enemy-leaked', 'leaked']]) {
      s.events.on(event, e => {
        const boss = campaignAudit.bosses.find(b => b.id === e.enemyId);
        if (boss) boss.outcome = outcome;
      });
    }
  }, previous);
}

async function fresh(page, touch = false, viewport = null) {
  if (touch) {
    touchPages.add(page);
    page.setDefaultTimeout(10_000);
  }
  await page.setViewportSize(viewport || (touch ? portrait : { width: 1280, height: 720 }));
  // Virtual browser time schedules every RAF. Production frame -> tick -> GameClock
  // -> fixed steps, rendering, UI refresh and autosave remain installed and unmodified.
  await page.clock.install({ time: new Date('2026-11-14T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-11-14T00:00:01Z'));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'New game', exact: true })).toBeVisible();
  await activate(page, page.getByRole('button', { name: 'New game', exact: true }));
  await expect(page.getByRole('dialog', { name: 'Protect the endpoint' })).toBeVisible();
  await activate(page, page.getByRole('button', { name: 'Skip tutorial' }));
  await expect(page.getByRole('button', { name: 'Start wave 1', exact: true })).toBeEnabled();
  if (touch) expect(await page.evaluate(() => navigator.maxTouchPoints)).toBeGreaterThan(0);
  const initial = await snapshot(page);
  expect(initial.balanceVersion).toBe('1.7.0');
  expect(initial.schemaVersion).toBe(4);
  expect(initial.state.resources).toEqual({ dharma: 130, bandwidth: 60, anonymity: 0 });
  expect(initial.state.lives).toBe(20);
  expect(initial.state.difficulty).toBe('Normal');
  await observe(page);
}

async function purchase(page, command) {
  const before = await snapshot(page);
  const [arg, choice] = command.args;
  if (command.name === 'placeDefense') {
    await activate(page, page.locator(`[data-tower-type="${arg}"]`));
    await world(page, choice.x, choice.y);
    const after = await snapshot(page);
    expect(after.state.defenses).toHaveLength(before.state.defenses.length + 1);
    expect(after.state.defenses.at(-1)).toMatchObject({ type: arg, x: choice.x, y: choice.y, level: 1 });
  } else {
    expect(command.name).toBe('upgradeDefense');
    const tower = before.state.defenses.find(t => t.id === arg);
    expect(tower, `earned tower ${arg}`).toBeTruthy();
    await world(page, tower.x, tower.y);
    if (choice) {
      expect(tower.level).toBe(2);
      await activate(page, page.locator(`[data-specialization="${choice}"]`));
    } else await activate(page, page.locator('#upgrade-button'));
    const after = (await snapshot(page)).state.defenses.find(t => t.id === arg);
    expect(after.level).toBe(tower.level + 1);
    expect(after.specialization).toBe(choice || tower.specialization);
  }
}

async function preview(page, wave, active = false) {
  const model = getWavePreview(balance, wave);
  const panel = page.locator('#wave-preview-section');
  if (await panel.getAttribute('open') === null) await activate(page, panel.locator('summary'));
  await expect(page.locator('#start-wave-button')).toHaveText(active ? 'Wave active' : `Start wave ${wave}`);
  await expect(page.locator('#boss-warning')).toBeVisible({ visible: model.isBossWave });
  for (const enemy of model.enemies) {
    const button = page.locator(`#wave-preview-list [data-enemy-type="${enemy.id}"]`);
    await expect(button).toHaveAccessibleName(`Inspect ${enemy.name}, ${enemy.count} ${active ? 'in this wave' : 'incoming'}`);
    for (const [i, window] of enemy.windows.entries()) {
      const seconds = ms => `${Number((ms / 1000).toFixed(3))} s`;
      const text = window.count === 1 ? `1 at ${seconds(window.startMs)}`
        : `${window.count} from ${seconds(window.startMs)} to ${seconds(window.endMs)}; every ${seconds(window.intervalMs)}`;
      await expect(page.locator(`#spawn-timing-${wave}-${enemy.id}-${i}`)).toHaveText(text);
    }
  }
  const enemy = model.enemies.find(e => balance.bosses[e.id]) || model.enemies[0];
  await activate(page, page.locator(`#wave-preview-list [data-enemy-type="${enemy.id}"]`));
  await expect(page.locator('#enemy-inspector-content')).toContainText(enemy.name);
  if (!active && model.enemies.some(e => e.id === 'raidTeam')) {
    await expect(page.locator('#emp-warning')).toContainText('66%');
    await expect(page.locator('#emp-warning')).toContainText('spaced 0.25 s apart');
  }
  await activate(page, page.locator('#close-enemy-inspector-button'));
  return model;
}

async function readReport(page, wave, terminal = false) {
  const host = page.locator(terminal ? '#terminal-reports' : '#wave-reports');
  const details = host.locator(`details[data-wave="${wave}"]`);
  if (await details.getAttribute('open') === null) await activate(page, details.locator('summary'));
  await expect(details).toContainText('Build/upgrade spent');
  await expect(details).toContainText('Kill income');
  await expect(details).toContainText('Leaks and coverage');
  await expect(details).toContainText('Tower contributions');
  return details;
}

async function reloadCheckpoint(page, label, checkpoints) {
  await activate(page, page.getByRole('button', { name: 'Pause game' }));
  await activate(page, page.getByRole('button', { name: 'Save now', exact: true }));
  const saved = await snapshot(page);
  const observer = await page.evaluate(() => campaignAudit);
  await page.clock.runFor(1000);
  expect(withoutDate(await snapshot(page))).toEqual(withoutDate(saved));
  await page.reload();
  await activate(page, page.getByRole('button', { name: 'Continue', exact: true }));
  await expect(page.getByRole('dialog', { name: 'Paused', exact: true })).toBeVisible();
  expect(withoutDate(await snapshot(page))).toEqual(withoutDate(saved));
  await observe(page, observer);
  checkpoints.push({ label, wave: saved.state.waveNumber, resume: saved.state.resumePhase,
    combatMs: saved.state.gameTimeMs, speed: saved.state.waveSpeed,
    reports: saved.state.reports.pending.length, resources: saved.state.resources,
    enemies: saved.state.enemies.map(e => ({ type: e.type, health: e.health, shield: e.shield, firedPhases: e.firedPhases })) });
  await activate(page, page.getByRole('button', { name: 'Resume', exact: true }));
}

async function speed(page, n) {
  await activate(page, page.locator('[data-wave-speed-context="game"]').getByRole('button', { name: `Wave speed ${n}×` }));
}

async function waveRun(page, wave, checkpoints, combatCheckpoint = false, touchAudit = null) {
  const start = await snapshot(page);
  await page.clock.runFor(1000);
  expect(withoutDate(await snapshot(page))).toEqual(withoutDate(start)); // deliberate start
  // Regression: the noninteractive wave-clear toast must not block a quick tap.
  if (touchPages.has(page) && wave === 2) await expect(page.locator('#toast')).toBeVisible();
  await activate(page, page.getByRole('button', { name: `Start wave ${wave}`, exact: true }));
  await page.clock.runFor(256);
  await expect(page.locator('#phase-label')).toHaveText('Wave active');
  const tower = start.state.defenses[0];
  await world(page, tower.x, tower.y);
  await expect(page.locator('#inspector-content')).toContainText(balance.towers[tower.type].name);
  await expect(page.locator('#upgrade-button')).toBeDisabled();
  await expect(page.locator('#sell-button')).toBeDisabled();
  await expect(page.locator('#inspector-content')).toContainText(`Level ${tower.level}`);
  await activate(page, page.locator('#close-inspector-button'));
  const enemy = page.locator('#wave-preview-list [data-enemy-type]').first();
  await activate(page, enemy);
  await expect(enemy).toHaveAccessibleName(/in this wave/);
  await expect(page.locator('#enemy-inspector-content')).toBeVisible();
  await activate(page, page.locator('#close-enemy-inspector-button'));
  if (wave > 1) {
    await readReport(page, wave - 1);
  }
  let didCheckpoint = false;
  for (let i = 0; i < 150; i++) {
    const current = await snapshot(page);
    if (current.state.phase !== 'WAVE') break;
    if (combatCheckpoint && !didCheckpoint && current.state.enemies.some(e =>
      wave === 10 ? e.type === 'raidTeam' && e.firedPhases.length === 1
        : e.type === 'megaCorpTitan' && e.shield < e.shieldMax)) {
      await expect(page.locator('#combat-state')).toContainText(wave === 10 ? 'EMP spent' : 'Shield');
      if (touchAudit && wave === 10) await rotate(page, 'active wave 10 spent Raid EMP', touchAudit.rotations, touchAudit.testInfo);
      await reloadCheckpoint(page, wave === 10 ? 'spent Raid EMP' : 'damaged Titan shield', checkpoints);
      didCheckpoint = true;
    }
    if (i === 1) await speed(page, 2);
    if (i === 3) await speed(page, 1);
    if (i === 5) await speed(page, 2);
    await page.clock.runFor(combatCheckpoint ? 256 : 1024);
  }
  const end = await snapshot(page);
  expect(end.state.phase).not.toBe('WAVE');
  if (combatCheckpoint) expect(didCheckpoint).toBe(true);
  return { start, end, durationMs: end.state.gameTimeMs - start.state.gameTimeMs };
}

function reconcile(row, expected) {
  const { start, end, durationMs } = row;
  const r = end.state.reports.pending.at(-1);
  expect(end.state.lives).toBe(expected.livesAfter);
  expect(durationMs).toBeCloseTo(expected.durationMs, 6);
  expect(end.state.resources).toEqual(expected.after || expected.resourcesAfter);
  expect(start.state.resources).toEqual(expected.atStart || expected.resourcesAtStart);
  for (const key of ['spent', 'bounty', 'clear', 'leaks']) {
    const actual = key === 'leaks' ? r.leaks.map(({ type, damage }) => ({ type, damage })) : r[key];
    const wanted = expected.accounting?.[key] || expected[key];
    expect(actual).toEqual(key === 'leaks' ? wanted.map(({ type, damage }) => ({ type, damage })) : wanted);
  }
  for (const key of ['dharma', 'bandwidth', 'anonymity']) {
    expect(end.state.resources[key]).toBe(start.state.resources[key] + r.bounty[key] + r.clear[key]);
    if (key === 'anonymity') expect(end.state.resources[key]).toBe(0);
  }
  if (expected.accounting) expect(r).toEqual(expected.accounting);
  if (expected.activity) {
    const activity = { health: 0, shield: 0, shots: 0, slowHits: 0, vulnerabilityHits: 0, auraShots: 0, passiveDharma: r.passiveDharma };
    for (const t of Object.values(r.towers)) for (const key of ['health', 'shield', 'shots', 'slowHits', 'vulnerabilityHits', 'auraShots']) activity[key] += t[key];
    expect(activity).toEqual(expected.activity);
  }
  expect(r.partial).toBe(false);
  return { wave: r.waveNumber, durationMs, livesBefore: start.state.lives, livesAfter: end.state.lives,
    atStart: start.state.resources, after: end.state.resources, report: r };
}

async function rotate(page, label, rotations, testInfo) {
  const before = await snapshot(page), views = [];
  for (const viewport of [landscape, portrait]) {
    await page.setViewportSize(viewport);
    // Ordinary scheduled RAF also updates camera size. Combat keeps running.
    await page.clock.runFor(64);
    const tower = before.state.defenses.find(t => t.id === before.state.selectedDefenseId);
    expect(tower).toBeTruthy();
    await world(page, tower.x, tower.y);
    await expect(page.locator('#inspector-content')).toContainText(`Level ${tower.level}`);
    await expect(page.locator('#inspector-content')).toContainText(balance.towers[tower.type].name);
    if (before.state.phase === 'WAVE') {
      await expect(page.locator('#upgrade-button')).toBeDisabled();
      await expect(page.locator('#sell-button')).toBeDisabled();
    } else await expect(page.locator('#sell-button')).toBeEnabled();
    await activate(page, page.locator('#close-inspector-button'));
    await preview(page, before.state.waveNumber, before.state.phase === 'WAVE');
    const start = page.locator('#start-wave-button');
    await expect(start).toBeInViewport({ ratio: 1 });
    await expect(start).toBeEnabled({ enabled: before.state.phase === 'BUILDING' });
    // ResizeObserver can clear the bitmap after the earlier frame. Allow the
    // next ordinary production frames to paint, then verify visible canvas ink.
    await page.clock.runFor(32);
    expect(await page.locator('#game-canvas').evaluate(canvas =>
      canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3])).toBe(255);
    const current = await snapshot(page);
    expect(current.state.phase).toBe(before.state.phase);
    if (before.state.phase === 'BUILDING') expect(current.state.resources).toEqual(before.state.resources);
    expect(current.state.lives).toBe(before.state.lives);
    const identity = towers => towers.map(({ id, type, x, y, level, specialization }) => ({ id, type, x, y, level, specialization }));
    expect(identity(current.state.defenses)).toEqual(identity(before.state.defenses));
    expect(current.state.reports.pending).toEqual(before.state.reports.pending);
    await page.screenshot({ path: testInfo.outputPath(`${label}-${viewport.width}.png`) });
    views.push({ viewport, combatMs: current.state.gameTimeMs, phase: current.state.phase });
  }
  const after = await snapshot(page);
  if (before.state.phase === 'BUILDING') expect(withoutDate(after)).toEqual(withoutDate(before));
  else expect(after.state.gameTimeMs).toBeGreaterThan(before.state.gameTimeMs);
  rotations.push({ label, wave: before.state.waveNumber, combatMsBefore: before.state.gameTimeMs, views });
}

async function swipeScroll(page, scroller, wave, scrolls) {
  // Native Chromium touch gesture in the scrolling content, never the canvas
  // (which intentionally has touch-action:none). No DOM scrollTop mutation.
  const before = await scroller.evaluate(e => ({ top: e.scrollTop, max: e.scrollHeight - e.clientHeight }));
  expect(before.max).toBeGreaterThan(0);
  const box = await scroller.boundingBox();
  const distance = Math.min(120, box.height * 0.6);
  const direction = before.top > distance ? 1 : -1;
  const x = box.x + box.width / 2, y = box.y + box.height / 2 - direction * distance / 2;
  const client = await page.context().newCDPSession(page);
  try {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 8; i++) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + direction * distance * i / 8 }] });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.clock.runFor(256);
    await expect.poll(() => scroller.evaluate(e => e.scrollTop)).not.toBe(before.top);
    scrolls.push({ wave, before: before.top, after: await scroller.evaluate(e => e.scrollTop), max: before.max });
  } finally { await client.detach(); }
}

async function artifact(testInfo, name, value, wallStart) {
  const bytes = JSON.stringify(value, null, 2) + '\n';
  await testInfo.attach(`${name}.json`, { body: bytes, contentType: 'application/json' });
  const dir = process.env.CAMPAIGN_AUDIT_OUTPUT;
  if (dir) {
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/${name}.json`, bytes);
    await writeFile(`${dir}/${name}-timing.json`, JSON.stringify({ automationWallMs: performance.now() - wallStart,
      note: 'Host elapsed test time, not player time. Browser RAF/timers virtualized via Playwright clock.runFor; combat time is production gameTimeMs.' }, null, 2) + '\n');
  }
}

async function runRecovery(page, testInfo, touch = false) {
  test.setTimeout(touch ? 360_000 : 240_000);
  const wallStart = performance.now(), checkpoints = [], waves = [], commands = [], rotations = [], scrolls = [];
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await fresh(page, touch);
  for (let wave = 1; wave <= 20; wave++) {
    await preview(page, wave);
    const before = (await snapshot(page)).state.resources;
    for (const command of recovery.commands.filter(c => c.wave === wave)) {
      await purchase(page, command); commands.push(command);
    }
    expect(before).toEqual(recovery.waves[wave - 1].before);
    if (touch && wave === 4) await rotate(page, 'earned build before wave 4', rotations, testInfo);
    if ([4, 16].includes(wave)) await reloadCheckpoint(page, 'earned build', checkpoints);
    const row = await waveRun(page, wave, checkpoints, [10, 15].includes(wave), touch ? { rotations, testInfo } : null);
    waves.push(reconcile(row, recovery.waves[wave - 1]));
    expect(row.end.state.reports.pending).toHaveLength(wave);
    const details = await readReport(page, wave, wave === 20);
    if (touch && [3, 16, 20].includes(wave)) {
      await swipeScroll(page, wave === 20 ? page.getByRole('dialog', { name: 'Victory', exact: true }) : page.locator('.build-content'), wave, scrolls);
    }
    if (wave === 3) {
      await expect(details).toContainText('Script Kiddie: 2 escaped; 2 configured life damage');
      await expect(details).toContainText('Last observed attacking range');
    }
  }
  const final = await snapshot(page);
  expect(final.state.phase).toBe('VICTORY');
  expect(final.state.lives).toBe(18);
  expect(commands).toEqual(recovery.commands);
  const observer = await page.evaluate(() => campaignAudit);
  expect(observer.bosses.map(({ id, ...b }) => b)).toEqual(recovery.bosses);
  await expect(page.getByRole('dialog', { name: 'Victory', exact: true })).toBeVisible();
  await page.clock.runFor(1000);
  expect(withoutDate(await snapshot(page))).toEqual(withoutDate(final));
  await page.reload();
  await activate(page, page.getByRole('button', { name: 'Continue', exact: true }));
  await expect(page.getByRole('dialog', { name: 'Victory', exact: true })).toBeVisible();
  expect(withoutDate(await snapshot(page))).toEqual(withoutDate(final));
  await readReport(page, 3, true);
  await page.screenshot({ path: testInfo.outputPath(touch ? 'touch-earned-victory.png' : 'earned-victory.png') });
  await activate(page, page.getByRole('button', { name: 'Play again', exact: true }));
  const restart = await snapshot(page);
  expect(restart.state).toMatchObject({ phase: 'BUILDING', waveNumber: 1, lives: 20, resources: recovery.firstFunds });
  expect(restart.state.defenses).toEqual([]);
  expect(restart.state.reports.pending).toEqual([]);
  expect(errors).toEqual([]);
  await artifact(testInfo, touch ? 'touch-recovery' : 'recovery', { ...(touch ? { viewport: portrait, hasTouch: true, rotations, scrolls } : {}), balanceVersion: final.balanceVersion, schemaVersion: final.schemaVersion,
    commands, checkpoints, waves, bosses: observer.bosses, spawns: observer.spawns,
    phase: final.state.phase, lives: final.state.lives, resources: final.state.resources,
    combatMs: final.state.gameTimeMs, errors }, wallStart);
}

test('earned Normal UI mistake recovers through all twenty combat waves', async ({ page }, testInfo) => {
  await runRecovery(page, testInfo);
});

test.describe('portrait touch campaign', () => {
  test.use({ hasTouch: true, viewport: portrait });
  test('earned Normal recovery uses taps, scrolling and rotation through twenty waves', async ({ page }, testInfo) => {
    await runRecovery(page, testInfo, true);
  });
});

// Exactly the existing Normal weak-placement plan, followed by a bounded UI retry.
const place = (wave, type, x, y) => ({ wave, name: 'placeDefense', args: [type, { x, y }] });
const weakCommands = [place(1, 'encryption', 30, 510), place(1, 'firewall', 90, 510),
  place(1, 'firewall', 150, 510), { wave: 2, name: 'upgradeDefense', args: ['defense-2', null] },
  place(3, 'firewall', 810, 450)];
test('natural Normal UI defeat explains coverage and permits a concrete retry', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const wallStart = performance.now(), waves = [], checkpoints = [];
  await fresh(page);
  for (let wave = 1; wave <= 3; wave++) {
    await preview(page, wave);
    for (const c of weakCommands.filter(c => c.wave === wave)) await purchase(page, c);
    const row = await waveRun(page, wave, checkpoints);
    waves.push(reconcile(row, weak.waves[wave - 1]));
  }
  const final = await snapshot(page);
  expect(final.state.phase).toBe('GAME_OVER');
  expect(final.state.lives).toBe(0);
  await expect(page.getByRole('dialog', { name: 'Game over', exact: true })).toBeVisible();
  const details = await readReport(page, 1, true);
  await expect(details).toContainText('No attacking tower range observed');
  await expect(details).toContainText('Script Kiddie: 8 escaped');
  await readReport(page, 3, true);
  await page.screenshot({ path: testInfo.outputPath('natural-defeat.png') });
  await page.clock.runFor(1000);
  expect(withoutDate(await snapshot(page))).toEqual(withoutDate(final));
  await page.reload();
  await activate(page, page.getByRole('button', { name: 'Continue', exact: true }));
  expect(withoutDate(await snapshot(page))).toEqual(withoutDate(final));
  await activate(page, page.getByRole('button', { name: 'Play again', exact: true }));
  // Retry the same wave-1 tower roster and spend, moving only the three placements
  // into the already documented strong coverage cells. No new strategy matrix.
  for (const c of [place(1, 'encryption', 270, 270), place(1, 'firewall', 510, 270), place(1, 'firewall', 210, 210)]) await purchase(page, c);
  const retry = await waveRun(page, 1, checkpoints);
  expect(retry.end.state.lives).toBe(20);
  expect(retry.end.state.reports.pending.at(-1).leaked).toBe(0);
  expect(retry.start.state.resources).toEqual(weak.waves[0].resourcesAtStart);
  await readReport(page, 1);
  await artifact(testInfo, 'defeat-retry', { commands: weakCommands, waves, phase: final.state.phase,
    lives: final.state.lives, resources: final.state.resources, combatMs: final.state.gameTimeMs,
    retry: { durationMs: retry.durationMs, lives: retry.end.state.lives, resources: retry.end.state.resources,
      report: retry.end.state.reports.pending.at(-1) } }, wallStart);
});

// Bounded layout checkpoints reuse the earned campaign opening/driver, not a
// full campaign per viewport. No synthetic toast or combat fixture is used.
const toastViews = [
  { width: 360, height: 640 }, portrait,
  { width: 640, height: 360 }, landscape,
  { width: 1280, height: 720 }
];
async function toastBounds(page) {
  return page.evaluate(() => {
    const rect = e => {
      const { x, y, width, height } = e.getBoundingClientRect();
      return { x, y, width, height };
    };
    const toast = document.querySelector('#toast');
    return { viewport: { width: innerWidth, height: innerHeight },
      toast: rect(toast), text: toast.textContent,
      pointerEvents: getComputedStyle(toast).pointerEvents,
      overflow: toast.scrollWidth > toast.clientWidth || toast.scrollHeight > toast.clientHeight,
      controls: [...document.querySelectorAll('.header-actions button, .wave-actions button')].map(e =>
        ({ name: e.getAttribute('aria-label') || e.textContent.trim(), ...rect(e) })) };
  });
}
function clearBounds(view) {
  const { toast: t, viewport: v } = view;
  expect(t.x).toBeGreaterThanOrEqual(0);
  expect(t.y).toBeGreaterThanOrEqual(0);
  expect(t.x + t.width).toBeLessThanOrEqual(v.width);
  expect(t.y + t.height).toBeLessThanOrEqual(v.height);
  expect(view.pointerEvents).toBe('none');
  expect(view.overflow).toBe(false);
  for (const c of view.controls) {
    expect(c.height, c.name).toBeGreaterThanOrEqual(44);
    expect(c.x, c.name).toBeGreaterThanOrEqual(0);
    expect(c.y, c.name).toBeGreaterThanOrEqual(0);
    expect(c.x + c.width, c.name).toBeLessThanOrEqual(v.width);
    expect(c.y + c.height, c.name).toBeLessThanOrEqual(v.height);
    const overlap = Math.max(0, Math.min(t.x + t.width, c.x + c.width) - Math.max(t.x, c.x)) *
      Math.max(0, Math.min(t.y + t.height, c.y + c.height) - Math.max(t.y, c.y));
    expect(overlap, `toast visually overlaps ${c.name}`).toBe(0);
  }
}
for (const viewport of toastViews) {
  test.describe(`earned toast layout ${viewport.width}x${viewport.height}`, () => {
    const touch = viewport.width !== 1280;
    test.use({ hasTouch: touch, viewport });
    test('keeps live notification and primary controls clear through input and rotation', async ({ page }, testInfo) => {
      test.setTimeout(90_000);
      const wallStart = performance.now(), views = [], scrolls = [], errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await fresh(page, touch, viewport);
      await preview(page, 1);
      const commands = recovery.commands.filter(c => c.wave === 1);
      for (const c of commands) await purchase(page, c);
      await page.evaluate(() => {
        globalThis.toastObservations = [];
        new MutationObserver(records => {
          for (const r of records) if (r.attributeName === 'hidden') {
            const e = r.target;
            toastObservations.push({ visible: !e.hidden, now: performance.now(), text: e.textContent });
          }
        }).observe(document.querySelector('#toast'), { attributes: true, attributeFilter: ['hidden'] });
      });
      const row = await waveRun(page, 1, []);
      const wave = reconcile(row, recovery.waves[0]);
      const toast = page.locator('#toast');
      await expect(toast).toBeVisible();
      await expect(toast).toHaveText('Wave 1 held: 8 defeated, 0 leaked.');
      await expect(toast).toHaveAttribute('role', 'status');
      await expect(toast).toHaveAttribute('aria-live', 'polite');
      await expect(page.locator('[data-wave-speed-context="game"]').getByRole('button', { name: 'Wave speed 2×' })).toBeFocused();
      const capture = async label => {
        await expect(toast).toBeVisible();
        const view = { label, ...await toastBounds(page) };
        views.push(view);
        await page.screenshot({ path: testInfo.outputPath(`${label}.png`) });
        // Retain reproduction even when the first geometric assertion fails.
        await artifact(testInfo, `toast-${viewport.width}x${viewport.height}`, { commands, wave, views, scrolls, errors }, wallStart);
        clearBounds(view);
      };
      await capture('earned-wave-1');
      if (touch) await swipeScroll(page, page.locator('.build-content'), 1, scrolls);
      else {
        const scroller = page.locator('.build-content');
        const before = await scroller.evaluate(e => e.scrollTop);
        await scroller.hover();
        await page.mouse.wheel(0, -180);
        await expect.poll(() => scroller.evaluate(e => e.scrollTop)).not.toBe(before);
        scrolls.push({ before, after: await scroller.evaluate(e => e.scrollTop) });
      }
      await capture('scrolled');
      if (touch) {
        for (const size of [{ width: viewport.height, height: viewport.width }, viewport]) {
          await page.setViewportSize(size);
          await page.clock.runFor(96); // normal RAF/camera/ResizeObserver paint
          await capture(`rotation-${size.width}x${size.height}`);
        }
        expect(withoutDate(await snapshot(page))).toEqual(withoutDate(row.end));
      }
      // Access is established while visible, without waiting out the lifetime.
      await speed(page, 1);
      await expect(toast).toBeVisible();
      await speed(page, 2);
      await activate(page, page.getByRole('button', { name: 'Start wave 2', exact: true }));
      await expect(toast).toBeVisible();
      await expect(page.locator('#phase-label')).toHaveText('Wave active');
      // Starting disables the button and Chromium releases its focus. The toast
      // must neither take focus nor change the resulting focus on dismissal.
      const focusAfterStart = await page.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id }));
      expect(focusAfterStart.id).not.toBe('toast');
      await capture('started-wave-2');
      const remaining = await page.evaluate(() => 3199 - (performance.now() - toastObservations.findLast(e => e.visible && e.text.startsWith('Wave 1 held:')).now));
      expect(remaining).toBeGreaterThan(0);
      await page.clock.runFor(remaining);
      await expect(toast).toBeVisible();
      await page.clock.runFor(1);
      await expect(toast).toBeHidden();
      expect(await page.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id }))).toEqual(focusAfterStart);
      const lifetime = await page.evaluate(() => toastObservations.filter(e => e.text.startsWith('Wave 1 held:')));
      expect(lifetime.map(e => e.visible)).toEqual([true, false]);
      expect(lifetime[1].now - lifetime[0].now).toBe(3200);
      expect(errors).toEqual([]);
      await artifact(testInfo, `toast-${viewport.width}x${viewport.height}`, { commands, wave, views, scrolls, lifetime, errors }, wallStart);
    });
  });
}
