import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {setTimeout} from 'node:timers/promises';
import {openFresh,enterBuildPhase,braceFixture,braceFrame} from '../../../tests/e2e/helpers.js';
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'3001'},stdio:'ignore'});
const browser=await chromium.launch();
try {
 for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:3001')).ok)break;}catch{}await setTimeout(100);}
 for(const [name,width,height,phase] of [['warning-portrait',360,640,'warning'],['active-desktop',1280,720,'active']]){
  const page=await browser.newPage({baseURL:'http://127.0.0.1:3001'});
  await openFresh(page,{width,height});await enterBuildPhase(page);await braceFixture(page);await braceFrame(page,phase);
  await page.locator('#combat-feedback').scrollIntoViewIfNeeded();
  await page.screenshot({path:new URL(`${name}.png`,import.meta.url).pathname});await page.close();
 }
} finally {await browser.close();server.kill();}
