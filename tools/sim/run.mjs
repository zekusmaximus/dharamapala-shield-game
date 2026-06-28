import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GameSession, PHASES } from '../../js/core/GameSession.js';
import { canAfford } from '../../js/core/rules/economy.js';
import { isInsideWorld, isNearPath, pointAtPathDistance, PATH_METRICS, WORLD } from '../../js/core/world.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export async function loadBalance() {
  return JSON.parse(await readFile(resolve(root, 'design/balance.json'), 'utf8'));
}

function buildPositions() {
  const samples = [];
  for (let distance = 0; distance <= PATH_METRICS.totalLength; distance += 45) {
    samples.push(pointAtPathDistance(distance));
  }
  const positions = [];
  for (let y = 30; y < WORLD.height; y += WORLD.gridSize) {
    for (let x = 30; x < WORLD.width; x += WORLD.gridSize) {
      const position = { x, y };
      if (!isInsideWorld(position) || isNearPath(position)) {
        continue;
      }
      const coverage = samples.filter(
        (sample) => Math.hypot(sample.x - x, sample.y - y) <= 205
      ).length;
      positions.push({ ...position, coverage });
    }
  }
  return positions.sort((a, b) => b.coverage - a.coverage || a.x - b.x || a.y - b.y);
}

const POLICY_POSITIONS = buildPositions();

export class DeterministicPlayerPolicy {
  build(session) {
    const damageTowers = [...session.state.defenses.values()].filter(
      (tower) => tower.type !== 'distributor'
    );
    if (!damageTowers.some((tower) => tower.type === 'encryption')) {
      this.buy(session, 'encryption');
    }

    const desiredDamageTowers = Math.min(14, 2 + Math.ceil(session.state.waveNumber / 2));
    while (
      [...session.state.defenses.values()].filter(
        (tower) => tower.type !== 'distributor'
      ).length < desiredDamageTowers &&
      canAfford(session.state.resources, session.balance.towers.firewall.cost)
    ) {
      if (!this.buy(session, 'firewall')) {
        break;
      }
    }

    if (
      session.state.waveNumber >= 4 &&
      ![...session.state.defenses.values()].some(
        (tower) => tower.type === 'distributor'
      )
    ) {
      this.buy(session, 'distributor');
    }

    let upgraded = true;
    while (upgraded) {
      upgraded = false;
      const candidates = [...session.state.defenses.values()]
        .filter((tower) => tower.type !== 'distributor')
        .sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));
      for (const tower of candidates) {
        const result = session.upgradeDefense(tower.id);
        if (result.ok) {
          upgraded = true;
          break;
        }
      }
    }
  }

  buy(session, type) {
    const occupied = [...session.state.defenses.values()];
    const position = POLICY_POSITIONS.find(
      (candidate) =>
        !occupied.some(
          (tower) => Math.hypot(tower.x - candidate.x, tower.y - candidate.y) < 45
        )
    );
    if (!position) {
      return false;
    }
    return session.placeDefense(type, position).ok;
  }
}

export function runWave(session, maxSteps = 120_000) {
  session.startWave();
  let steps = 0;
  while (session.state.phase === PHASES.WAVE && steps < maxSteps) {
    session.step(1000 / 60);
    steps += 1;
  }
  if (steps >= maxSteps) {
    throw new Error(`Wave ${session.state.waveNumber} exceeded the deterministic step limit`);
  }
  return steps;
}

export async function simulateCampaign({
  difficulty = 'Normal',
  seed = 1337,
  finalWave = 20
} = {}) {
  const balance = await loadBalance();
  const session = new GameSession(balance, {
    difficulty,
    seed,
    tutorialCompleted: true
  });
  session.newGame({ difficulty, seed, tutorialCompleted: true });
  const policy = new DeterministicPlayerPolicy();
  const waves = [];

  while (
    session.state.phase === PHASES.BUILDING &&
    session.state.waveNumber <= finalWave
  ) {
    const waveNumber = session.state.waveNumber;
    policy.build(session);
    const livesBefore = session.state.lives;
    const steps = runWave(session);
    waves.push({
      wave: waveNumber,
      steps,
      livesBefore,
      livesAfter: session.state.lives,
      killed: session.state.lastWaveResult?.killed ?? session.state.wave.killed,
      leaked: session.state.lastWaveResult?.leaked ?? session.state.wave.leaked,
      defenses: session.state.defenses.size
    });
    if ([PHASES.GAME_OVER, PHASES.VICTORY].includes(session.state.phase)) {
      break;
    }
  }

  return {
    balanceVersion: balance.version,
    seed,
    difficulty,
    phase: session.state.phase,
    waveNumber: session.state.waveNumber,
    lives: session.state.lives,
    score: session.state.score,
    statistics: { ...session.state.statistics },
    resources: { ...session.state.resources },
    waves
  };
}

function parseArguments(args) {
  const difficulty = args.find((arg) => !arg.startsWith('--')) || 'Normal';
  const seed = Number(
    args.find((arg) => arg.startsWith('--seed='))?.split('=')[1] || 1337
  );
  const waveRange =
    args.find((arg) => arg.startsWith('--waves='))?.split('=')[1] || '1-20';
  const finalWave = Number(waveRange.split('-').at(-1));
  const output = args.find((arg) => arg.startsWith('--output='))?.split('=')[1];
  return { difficulty, seed, finalWave, output };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const report = await simulateCampaign(options);
  const json = JSON.stringify(report, null, 2);
  if (options.output) {
    await writeFile(resolve(root, options.output), `${json}\n`);
  }
  console.log(json);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
