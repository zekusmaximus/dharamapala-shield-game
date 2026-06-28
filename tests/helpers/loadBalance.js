import { readFile } from 'node:fs/promises';

export async function loadBalance() {
  const url = new URL('../../design/balance.json', import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
