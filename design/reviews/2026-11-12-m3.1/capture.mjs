// Automated presentation fixtures only. Requires npm run build first.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../',import.meta.url));
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'3001'},stdio:'ignore'});
let browser;
try {
  for(let i=0;i<100;i++) {
    try {if((await fetch('http://127.0.0.1:3001')).ok)break;} catch {}
    await new Promise(r=>setTimeout(r,50));
  }
  browser=await chromium.launch();
  for(const [name,viewport,wave] of [
    ['escort-portrait',{width:360,height:640},4],
    ['raid-desktop',{width:1280,height:720},5]
  ]) {
    const page=await browser.newPage({viewport});
    await page.goto('http://127.0.0.1:3001');
    await page.getByRole('button',{name:'New game',exact:true}).click();
    await page.getByRole('button',{name:'Skip tutorial'}).click();
    await page.evaluate(wave=>{gameApplication.session.state.waveNumber=wave;gameApplication.ui.update(gameApplication.session);},wave);
    await page.locator(viewport.width < 500 ? '#wave-preview-list' : '#wave-preview-title')
      .evaluate(el => el.scrollIntoView({block:'start'}));
    await page.screenshot({path:fileURLToPath(new URL(`${name}.png`,import.meta.url))});
    await page.close();
  }
} finally {await browser?.close();server.kill();}
