import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(projectRoot, 'dist');

const files = [
  'index.html',
  'favicon.svg',
  'robots.txt',
  'design/balance.json'
];

const directories = ['css', 'js'];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const directory of directories) {
  await cp(join(projectRoot, directory), join(outputRoot, directory), {
    recursive: true
  });
}

for (const file of files) {
  const destination = join(outputRoot, file);
  await mkdir(dirname(destination), { recursive: true });
  await cp(join(projectRoot, file), destination);
}

console.log(`Built client application in ${outputRoot}`);
