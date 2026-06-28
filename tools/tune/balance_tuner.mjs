import { simulateCampaign } from '../sim/run.mjs';

const seeds = [1000, 1001, 1002, 1003, 1004];
const reports = [];

for (const difficulty of ['Easy', 'Normal', 'Hard']) {
  for (const seed of seeds) {
    reports.push(await simulateCampaign({ difficulty, seed }));
  }
}

const summary = Object.fromEntries(
  ['Easy', 'Normal', 'Hard'].map((difficulty) => {
    const runs = reports.filter((report) => report.difficulty === difficulty);
    const victories = runs.filter((report) => report.phase === 'VICTORY').length;
    return [
      difficulty,
      {
        runs: runs.length,
        victories,
        winRate: victories / runs.length,
        averageLives:
          runs.reduce((total, report) => total + report.lives, 0) / runs.length
      }
    ];
  })
);

console.log(JSON.stringify(summary, null, 2));
