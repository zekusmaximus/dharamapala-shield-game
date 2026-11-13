# M4.1 versus M3.4 / M4.4 production comparison

M4.4 regenerated the M3.4 1.4.0 report byte for byte. The new 1.5.0 report and this comparison use the same seven policies, three difficulty configurations and seed. Each run repeats exactly. First-five wave objects match exactly for every reached run. The new and old reports contain full event schedules and individual tower ledgers; `comparison.json` pairs the important per-wave observations for all 21 runs.

## Exact authored edits

Notation: `type×count@offset/interval`, simulated milliseconds; `seq` means the old implicit sequential start. Wave 1–5 definitions, reward bonuses, all other balance fields and boss rules are identical.

| Wave | 1.4.0 groups | 1.5.0 groups |
| ---: | --- | --- |
| 6 | federalAgent×7@seq/1000; corporateSaboteur×3@seq/1500 | federalAgent×7@0/1100; corporateSaboteur×3@5000/1300 |
| 7 | scriptKiddie×10@seq/700; federalAgent×5@seq/1100; corporateSaboteur×4@seq/1400 | scriptKiddie×5@0/450; federalAgent×5@900/1100; corporateSaboteur×4@5600/1100; scriptKiddie×5@6100/450 |
| 8 | corporateSaboteur×8@seq/1000; aiSurveillance×2@seq/2000 | corporateSaboteur×4@0/900; aiSurveillance×2@2200/2000; corporateSaboteur×4@7000/900 |
| 9 | federalAgent×8@seq/900; corporateSaboteur×6@seq/1200; aiSurveillance×3@seq/1800 | federalAgent×8@0/900; aiSurveillance×3@3500/2000; corporateSaboteur×6@5000/1000 |
| 10 | raidTeam×1@seq/0; aiSurveillance×5@seq/1500; corporateSaboteur×10@seq/800 | raidTeam×1@0/0; corporateSaboteur×5@1200/800; aiSurveillance×5@3000/1500; corporateSaboteur×5@10500/800 |
| 11 | aiSurveillance×6@seq/1200; quantumHacker×2@seq/2000 | aiSurveillance×6@0/1200; quantumHacker×2@4500/2000 |
| 12 | corporateSaboteur×10@seq/800; aiSurveillance×5@seq/1300; quantumHacker×3@seq/1800 | corporateSaboteur×10@0/800; aiSurveillance×5@2800/1300; quantumHacker×3@7000/1800 |
| 13 | quantumHacker×5@seq/1400; corruptedMonk×2@seq/2500 | quantumHacker×5@0/1400; corruptedMonk×2@4200/2500 |
| 14 | aiSurveillance×8@seq/1100; quantumHacker×4@seq/1500; corruptedMonk×2@seq/2200 | federalAgent×3@0/1100; aiSurveillance×6@1800/1100; quantumHacker×4@4000/1500; corruptedMonk×2@7000/2200 |
| 15 | megaCorpTitan×1@seq/0; quantumHacker×8@seq/1000; corruptedMonk×3@seq/2000 | megaCorpTitan×1@0/0; quantumHacker×8@1600/1000; corruptedMonk×3@5400/2000 |
| 16 | corruptedMonk×5@seq/1800; quantumHacker×10@seq/900 | corruptedMonk×5@0/1800; quantumHacker×10@4000/900 |
| 17 | quantumHacker×12@seq/800; corruptedMonk×5@seq/1600; aiSurveillance×8@seq/1000 | quantumHacker×12@0/800; corruptedMonk×5@2800/1600; aiSurveillance×6@5500/1000; corporateSaboteur×2@8000/1200 |
| 18 | corruptedMonk×6@seq/1500; quantumHacker×10@seq/900; megaCorpTitan×1@seq/5000 | corruptedMonk×6@0/1500; quantumHacker×8@2500/900; federalAgent×2@5200/1300; megaCorpTitan×1@7000/5000 |
| 19 | quantumHacker×15@seq/700; corruptedMonk×8@seq/1400; aiSurveillance×10@seq/1000 | quantumHacker×14@0/900; corruptedMonk×7@4500/1700; aiSurveillance×8@8500/1200; corporateSaboteur×4@16000/900 |
| 20 | megaCorpTitan×2@seq/8000; raidTeam×1@seq/4000; corruptedMonk×10@seq/1200; quantumHacker×20@seq/600 | megaCorpTitan×2@0/14000; corruptedMonk×10@3000/1200; quantumHacker×8@4500/600; raidTeam×1@7000/4000; federalAgent×4@10500/1000; quantumHacker×8@14500/600 |

## All policy and difficulty outcomes

| Run | Phase / finishing wave | Lives old → new | Typed leaks old → new | Dharma / Bandwidth old → new | Boss outcomes old → new | Combat s old → new |
| --- | --- | ---: | --- | --- | --- | ---: |
| easy-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2634/4549 → 2418/4414 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 389.7 → 347.5 |
| easy-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2307/5611 → 2525/5476 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 382.3 → 337.6 |
| easy-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2602/4609 → 2386/4474 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 400.2 → 365.7 |
| easy-campaign/expansion-heavy | VICTORY 20 → VICTORY 20 | 16 → 20 | megaCorpTitan×1 → — | 8996/5487 → 9039/5476 | megaCorpTitan:killed×3, megaCorpTitan:leaked×1, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 521.1 → 475.7 |
| easy-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2231/4609 → 2419/4474 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 389.8 → 347.4 |
| easy-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 85.5 → 85.5 |
| easy-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2634/4549 → 2418/4414 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 389.7 → 347.5 |
| normal-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1987/3942 → 2237/3832 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 412.9 → 381.0 |
| normal-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2094/5004 → 1910/4894 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 404.0 → 371.0 |
| normal-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2389/4002 → 2205/3892 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 432.1 → 399.3 |
| normal-campaign/expansion-heavy | VICTORY 20 → VICTORY 20 | 10 → 10 | megaCorpTitan×2 → megaCorpTitan×2 | 7724/4788 → 7540/4678 | megaCorpTitan:killed×2, megaCorpTitan:leaked×2, raidTeam:killed×3 → megaCorpTitan:killed×2, megaCorpTitan:leaked×2, raidTeam:killed×3 | 545.2 → 508.8 |
| normal-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1979/4002 → 2220/3892 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 406.8 → 368.8 |
| normal-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 75.1 → 75.1 |
| normal-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1987/3942 → 2237/3832 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 412.9 → 381.0 |
| hard-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2104/3434 → 1946/3332 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 458.5 → 411.3 |
| hard-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1777/4496 → 2053/4394 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 448.8 → 408.9 |
| hard-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2072/3494 → 1914/3392 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 477.8 → 431.7 |
| hard-campaign/expansion-heavy | GAME_OVER 20 → GAME_OVER 20 | 0 → 0 | megaCorpTitan×3, raidTeam×1 → megaCorpTitan×4 | 5743/3965 → 5677/3909 | megaCorpTitan:leaked×3, megaCorpTitan:unresolved×1, raidTeam:killed×2, raidTeam:leaked×1 → megaCorpTitan:leaked×4, raidTeam:killed×3 | 554.4 → 524.4 |
| hard-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1951/4000 → 1793/3898 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 449.0 → 413.7 |
| hard-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 67.5 → 67.5 |
| hard-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2104/3434 → 1946/3332 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 458.5 → 411.3 |

## Per-wave pressure: existing policy

All old/new banks, lives, typed leaks, boss phases and support/control measures for **every** policy/wave are paired in `comparison.json`. The table below shows the two most demanding configurations of the fixed existing policy; Easy and the other policies are in the JSON. `Peak` counts live enemies, including dynamic reinforcements.

| Difficulty / wave | Authored count old → new | Last authored s old → new | Peak old → new | Combat s old → new | Lives old → new | Dharma / Bandwidth after old → new | Shield removed old → new | Slow hits old → new | Aura shots old → new |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| normal 1 | 8 → 8 | 8.6 → 8.6 | 4 → 4 | 15.7 → 15.7 | 20 → 20 | 110/56 → 110/56 | 0.0 → 0.0 | 9 → 9 | 0 → 0 |
| normal 2 | 10 → 10 | 6.8 → 6.8 | 8 → 8 | 16.7 → 16.7 | 20 → 20 | 166/96 → 166/96 | 0.0 → 0.0 | 9 → 9 | 0 → 0 |
| normal 3 | 11 → 11 | 7.7 → 7.7 | 6 → 6 | 15.8 → 15.8 | 20 → 20 | 185/80 → 185/80 | 66.0 → 66.0 | 10 → 10 | 0 → 0 |
| normal 4 | 11 → 11 | 7.2 → 7.2 | 7 → 7 | 16.2 → 16.2 | 20 → 20 | 232/81 → 232/81 | 122.5 → 122.5 | 13 → 13 | 19 → 19 |
| normal 5 | 13 → 13 | 8.0 → 8.0 | 9 → 9 | 27.1 → 27.1 | 20 → 20 | 402/205 → 402/205 | 73.0 → 73.0 | 14 → 14 | 65 → 65 |
| normal 6 | 10 → 10 | 10.0 → 7.6 | 2 → 4 | 11.5 → 11.6 | 20 → 20 | 329/154 → 329/154 | 0.0 → 76.0 | 8 → 9 | 22 → 23 |
| normal 7 | 19 → 19 | 16.7 → 8.9 | 5 → 11 | 19.5 → 17.8 | 20 → 20 | 304/259 → 304/259 | 395.0 → 395.0 | 10 → 9 | 39 → 50 |
| normal 8 | 10 → 10 | 10.0 → 9.7 | 2 → 3 | 12.3 → 11.2 | 20 → 20 | 382/370 → 382/370 | 0.0 → 0.0 | 6 → 4 | 23 → 17 |
| normal 9 | 17 → 17 | 18.0 → 10.0 | 3 → 9 | 19.9 → 17.6 | 20 → 20 | 563/515 → 563/515 | 0.0 → 258.0 | 10 → 12 | 38 → 39 |
| normal 10 | 16 → 16 | 14.7 → 13.7 | 9 → 10 | 26.1 → 27.5 | 20 → 20 | 765/484 → 765/484 | 79.0 → 79.0 | 20 → 17 | 62 → 69 |
| normal 11 | 8 → 8 | 9.2 → 6.5 | 2 → 5 | 10.5 → 11.4 | 20 → 20 | 482/625 → 482/625 | 0.0 → 0.0 | 7 → 9 | 21 → 25 |
| normal 12 | 18 → 18 | 18.1 → 10.6 | 3 → 9 | 19.4 → 17.9 | 20 → 20 | 565/837 → 565/837 | 0.0 → 0.0 | 11 → 13 | 41 → 51 |
| normal 13 | 7 → 7 | 9.5 → 6.7 | 1 → 3 | 11.6 → 9.5 | 20 → 20 | 593/1024 → 593/1024 | 0.0 → 0.0 | 7 → 6 | 18 → 19 |
| normal 14 | 14 → 15 | 17.0 → 9.2 | 2 → 7 | 19.0 → 17.5 | 20 → 20 | 742/1273 → 731/1267 | 0.0 → 0.0 | 12 → 12 | 36 → 39 |
| normal 15 | 12 → 12 | 12.0 → 9.4 | 4 → 7 | 16.6 → 19.3 | 20 → 20 | 960/1654 → 949/1648 | 333.0 → 349.9 | 15 → 14 | 37 → 41 |
| normal 16 | 15 → 15 | 17.1 → 12.1 | 3 → 6 | 20.0 → 18.1 | 20 → 20 | 1003/1491 → 992/1485 | 0.0 → 0.0 | 15 → 12 | 42 → 45 |
| normal 17 | 25 → 25 | 24.6 → 10.5 | 4 → 15 | 27.3 → 22.1 | 20 → 20 | 1131/1941 → 1110/1929 | 0.0 → 0.0 | 20 → 15 | 64 → 83 |
| normal 18 | 17 → 17 | 18.0 → 8.8 | 3 → 10 | 24.0 → 20.2 | 20 → 20 | 1330/2424 → 1273/2390 | 399.0 → 597.0 | 19 → 17 | 50 → 50 |
| normal 19 | 33 → 33 | 30.7 → 18.7 | 6 → 14 | 32.6 → 29.1 | 20 → 20 | 1311/3015 → 1633/2949 | 0.0 → 0.0 | 18 → 23 | 82 → 116 |
| normal 20 | 33 → 33 | 43.4 → 18.7 | 10 → 18 | 51.1 → 38.5 | 20 → 20 | 1987/3942 → 2237/3832 | 930.0 → 1710.8 | 35 → 27 | 154 → 174 |
| hard 1 | 8 → 8 | 8.6 → 8.6 | 4 → 4 | 16.0 → 16.0 | 20 → 20 | 102/56 → 102/56 | 0.0 → 0.0 | 10 → 10 | 0 → 0 |
| hard 2 | 10 → 10 | 6.8 → 6.8 | 8 → 8 | 18.1 → 18.1 | 20 → 20 | 148/96 → 148/96 | 0.0 → 0.0 | 11 → 11 | 0 → 0 |
| hard 3 | 11 → 11 | 7.7 → 7.7 | 6 → 6 | 16.3 → 16.3 | 20 → 20 | 156/77 → 156/77 | 66.0 → 66.0 | 12 → 12 | 0 → 0 |
| hard 4 | 11 → 11 | 7.2 → 7.2 | 7 → 7 | 17.3 → 17.3 | 20 → 20 | 192/73 → 192/73 | 94.0 → 94.0 | 11 → 11 | 27 → 27 |
| hard 5 | 13 → 13 | 8.0 → 8.0 | 7 → 7 | 29.3 → 29.3 | 20 → 20 | 330/188 → 330/188 | 0.0 → 0.0 | 19 → 19 | 73 → 73 |
| hard 6 | 10 → 10 | 10.0 → 7.6 | 4 → 6 | 14.3 → 14.6 | 20 → 20 | 241/127 → 241/127 | 306.0 → 298.4 | 14 → 13 | 32 → 34 |
| hard 7 | 19 → 19 | 16.7 → 8.9 | 6 → 13 | 23.0 → 18.3 | 20 → 20 | 303/223 → 303/223 | 428.0 → 321.0 | 12 → 11 | 62 → 59 |
| hard 8 | 10 → 10 | 10.0 → 9.7 | 2 → 3 | 12.0 → 11.3 | 20 → 20 | 351/324 → 351/324 | 0.0 → 0.0 | 8 → 8 | 23 → 22 |
| hard 9 | 17 → 17 | 18.0 → 10.0 | 5 → 10 | 21.4 → 18.0 | 20 → 20 | 383/452 → 383/452 | 348.0 → 384.1 | 14 → 12 | 43 → 54 |
| hard 10 | 16 → 16 | 14.7 → 13.7 | 10 → 10 | 28.5 → 28.5 | 20 → 20 | 520/397 → 520/397 | 107.0 → 107.0 | 19 → 17 | 87 → 79 |
| hard 11 | 8 → 8 | 9.2 → 6.5 | 3 → 5 | 13.9 → 11.5 | 20 → 20 | 433/528 → 433/528 | 0.0 → 0.0 | 9 → 8 | 30 → 24 |
| hard 12 | 18 → 18 | 18.1 → 10.6 | 4 → 10 | 22.4 → 18.8 | 20 → 20 | 681/719 → 681/719 | 0.0 → 0.0 | 15 → 14 | 52 → 69 |
| hard 13 | 7 → 7 | 9.5 → 6.7 | 2 → 3 | 11.9 → 11.1 | 20 → 20 | 453/890 → 453/890 | 0.0 → 0.0 | 10 → 8 | 25 → 24 |
| hard 14 | 14 → 15 | 17.0 → 9.2 | 4 → 10 | 21.0 → 19.2 | 20 → 20 | 548/1117 → 540/1110 | 0.0 → 0.0 | 20 → 15 | 51 → 73 |
| hard 15 | 12 → 12 | 12.0 → 9.4 | 4 → 7 | 21.6 → 23.1 | 20 → 20 | 901/1457 → 893/1450 | 449.0 → 653.0 | 20 → 17 | 52 → 54 |
| hard 16 | 15 → 15 | 17.1 → 12.1 | 5 → 7 | 22.6 → 19.3 | 20 → 20 | 714/1765 → 706/1758 | 0.0 → 0.0 | 14 → 14 | 69 → 72 |
| hard 17 | 25 → 25 | 24.6 → 10.5 | 6 → 17 | 30.5 → 23.9 | 20 → 20 | 1169/2168 → 1151/2155 | 0.0 → 0.0 | 20 → 19 | 93 → 127 |
| hard 18 | 17 → 17 | 18.0 → 8.8 | 5 → 11 | 27.0 → 23.6 | 20 → 20 | 963/2091 → 1349/2058 | 539.0 → 673.0 | 23 → 18 | 65 → 86 |
| hard 19 | 33 → 33 | 30.7 → 18.7 | 8 → 17 | 37.5 → 30.5 | 20 → 20 | 1232/2618 → 1134/2556 | 0.0 → 0.0 | 25 → 26 | 143 → 176 |
| hard 20 | 33 → 33 | 43.4 → 18.7 | 16 → 20 | 53.9 → 42.8 | 20 → 20 | 2104/3434 → 1946/3332 | 1381.0 → 1884.0 | 47 → 30 | 213 → 265 |

Shield is capped absorbed damage (and can include Titan regeneration), slow hits include applications and refreshes, and aura shots mean support was present. None is causal credit for damage prevented, lives saved or player understanding. Timing is simulated combat only; no build or player time is included.
