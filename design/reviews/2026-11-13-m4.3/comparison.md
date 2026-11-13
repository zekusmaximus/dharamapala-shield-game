# M4.3 versus M4.2 production comparison

The 1.7.0 report compares with immutable M4.2 1.6.0 using the same seven policies, three difficulty configurations and seed. Each run repeats exactly. The old and new reports retain full production event schedules and individual tower ledgers; `comparison.json` pairs every reached wave for all 21 runs.

## Exact difficulty edit

Easy stays 0.75 HP / 0.85 speed / 1.15 bounty / 0.80 leak damage. Normal HP is 1.00 → 1.10 and speed 1.00 → 1.04. Hard HP is 1.35 → 1.38 and leak damage 1.25 → 1.40; speed and bounty are unchanged. Every authored wave group, reward, boss, tower and economy rule remains exact. Balance 1.6.0 → 1.7.0; schema remains v4.


## All policy and difficulty outcomes

| Run | Phase / finishing wave | Lives old → new | Typed leaks old → new | Dharma / Bandwidth old → new | Boss outcomes old → new | Combat s old → new |
| --- | --- | ---: | --- | --- | --- | ---: |
| easy-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2418/4414 → 2418/4414 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 342.9 → 342.9 |
| easy-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2525/5476 → 2525/5476 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 328.8 → 328.8 |
| easy-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2386/4474 → 2386/4474 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 350.6 → 350.6 |
| easy-campaign/expansion-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 9039/5476 → 9039/5476 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 474.1 → 474.1 |
| easy-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2419/4474 → 2419/4474 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 341.3 → 341.3 |
| easy-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 85.5 → 85.5 |
| easy-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2418/4414 → 2418/4414 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 342.9 → 342.9 |
| normal-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2237/3832 → 2237/3832 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 375.2 → 381.1 |
| normal-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1910/4894 → 1910/4894 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 369.0 → 375.6 |
| normal-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2205/3892 → 2205/3892 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 392.0 → 404.2 |
| normal-campaign/expansion-heavy | VICTORY 20 → VICTORY 20 | 10 → 5 | megaCorpTitan×2 → megaCorpTitan×3 | 7540/4678 → 7315/4570 | megaCorpTitan:killed×2, megaCorpTitan:leaked×2, raidTeam:killed×3 → megaCorpTitan:killed×1, megaCorpTitan:leaked×3, raidTeam:killed×3 | 506.3 → 519.1 |
| normal-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2220/3892 → 2220/3892 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 364.3 → 373.8 |
| normal-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 75.1 → 72.9 |
| normal-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2237/3832 → 2237/3832 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 375.2 → 381.1 |
| hard-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1946/3332 → 1946/3332 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 408.1 → 413.1 |
| hard-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 19 | — → quantumHacker×1 | 2053/4394 → 2030/4381 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 407.0 → 415.5 |
| hard-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1914/3392 → 1914/3392 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 426.2 → 427.5 |
| hard-campaign/expansion-heavy | GAME_OVER 20 → GAME_OVER 20 | 0 → 0 | megaCorpTitan×4 → megaCorpTitan×3 | 5677/3909 → 5677/3909 | megaCorpTitan:leaked×4, raidTeam:killed×3 → megaCorpTitan:leaked×3, megaCorpTitan:unresolved×1, raidTeam:killed×3 | 523.0 → 511.2 |
| hard-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1793/3898 → 1793/3898 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 405.2 → 409.8 |
| hard-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 67.5 → 67.5 |
| hard-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1946/3332 → 1946/3332 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 408.1 → 413.1 |

## Per-wave pressure: existing policy

All old/new banks, lives, typed leaks, boss phases and support/control measures for **every** policy/wave are paired in `comparison.json`. The table below shows the Normal and Hard configurations of the fixed existing policy; Easy and the other policies are in the JSON. `Peak` counts live enemies, including dynamic reinforcements.

| Difficulty / wave | Authored count old → new | Last authored s old → new | Peak old → new | Combat s old → new | Lives old → new | Dharma / Bandwidth after old → new | Shield removed old → new | Slow hits old → new | Aura shots old → new |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| normal 1 | 8 → 8 | 8.6 → 8.6 | 4 → 4 | 15.7 → 15.6 | 20 → 20 | 110/56 → 110/56 | 0.0 → 0.0 | 9 → 10 | 0 → 0 |
| normal 2 | 10 → 10 | 6.8 → 6.8 | 8 → 8 | 16.7 → 17.0 | 20 → 20 | 166/96 → 166/96 | 0.0 → 0.0 | 9 → 12 | 0 → 0 |
| normal 3 | 11 → 11 | 7.7 → 7.7 | 6 → 6 | 15.8 → 16.1 | 20 → 20 | 185/80 → 185/80 | 66.0 → 44.0 | 10 → 12 | 0 → 0 |
| normal 4 | 11 → 11 | 7.2 → 7.2 | 7 → 7 | 16.2 → 16.0 | 20 → 20 | 232/81 → 232/81 | 122.5 → 76.0 | 13 → 13 | 19 → 19 |
| normal 5 | 13 → 13 | 8.0 → 8.0 | 11 → 11 | 24.7 → 25.4 | 20 → 20 | 402/205 → 402/205 | 0.0 → 0.0 | 14 → 16 | 65 → 68 |
| normal 6 | 10 → 10 | 7.6 → 7.6 | 4 → 4 | 11.6 → 11.8 | 20 → 20 | 329/154 → 329/154 | 76.0 → 83.0 | 9 → 9 | 24 → 25 |
| normal 7 | 19 → 19 | 8.9 → 8.9 | 11 → 11 | 16.9 → 17.9 | 20 → 20 | 304/259 → 304/259 | 395.0 → 348.0 | 10 → 7 | 44 → 51 |
| normal 8 | 10 → 10 | 9.7 → 9.7 | 3 → 3 | 11.2 → 11.1 | 20 → 20 | 382/370 → 382/370 | 0.0 → 0.0 | 6 → 4 | 16 → 19 |
| normal 9 | 17 → 17 | 10.0 → 10.0 | 9 → 9 | 17.7 → 18.1 | 20 → 20 | 563/515 → 563/515 | 258.0 → 282.0 | 10 → 11 | 40 → 48 |
| normal 10 | 16 → 16 | 13.7 → 13.7 | 12 → 12 | 25.0 → 23.7 | 20 → 20 | 765/484 → 765/484 | 0.0 → 0.0 | 14 → 15 | 72 → 63 |
| normal 11 | 8 → 8 | 6.5 → 6.5 | 4 → 4 | 10.0 → 11.6 | 20 → 20 | 482/625 → 482/625 | 0.0 → 0.0 | 5 → 9 | 21 → 25 |
| normal 12 | 18 → 18 | 10.6 → 10.6 | 9 → 8 | 17.2 → 17.8 | 20 → 20 | 565/837 → 565/837 | 0.0 → 0.0 | 13 → 12 | 44 → 50 |
| normal 13 | 7 → 7 | 6.7 → 6.7 | 3 → 3 | 10.1 → 10.1 | 20 → 20 | 593/1024 → 593/1024 | 0.0 → 0.0 | 7 → 7 | 21 → 21 |
| normal 14 | 15 → 15 | 9.2 → 9.2 | 8 → 7 | 17.0 → 17.8 | 20 → 20 | 731/1267 → 731/1267 | 0.0 → 0.0 | 12 → 12 | 39 → 40 |
| normal 15 | 12 → 12 | 9.4 → 9.4 | 7 → 7 | 18.9 → 20.0 | 20 → 20 | 949/1648 → 949/1648 | 341.7 → 411.4 | 14 → 13 | 40 → 42 |
| normal 16 | 15 → 15 | 12.1 → 12.1 | 6 → 7 | 18.5 → 19.1 | 20 → 20 | 992/1485 → 992/1485 | 0.0 → 0.0 | 13 → 12 | 48 → 61 |
| normal 17 | 25 → 25 | 10.5 → 10.5 | 16 → 16 | 22.6 → 22.3 | 20 → 20 | 1110/1929 → 1110/1929 | 0.0 → 0.0 | 18 → 18 | 95 → 93 |
| normal 18 | 17 → 17 | 8.8 → 8.8 | 10 → 10 | 20.7 → 21.0 | 20 → 20 | 1273/2390 → 1273/2390 | 597.0 → 657.0 | 14 → 16 | 51 → 55 |
| normal 19 | 33 → 33 | 18.7 → 18.7 | 16 → 14 | 29.5 → 29.0 | 20 → 20 | 1633/2949 → 1633/2949 | 0.0 → 0.0 | 18 → 20 | 134 → 120 |
| normal 20 | 33 → 33 | 18.7 → 18.7 | 18 → 18 | 39.2 → 39.8 | 20 → 20 | 2237/3832 → 2237/3832 | 1607.0 → 1879.6 | 30 → 33 | 187 → 202 |
| hard 1 | 8 → 8 | 8.6 → 8.6 | 4 → 4 | 16.0 → 16.0 | 20 → 20 | 102/56 → 102/56 | 0.0 → 0.0 | 10 → 10 | 0 → 0 |
| hard 2 | 10 → 10 | 6.8 → 6.8 | 8 → 8 | 18.1 → 18.1 | 20 → 20 | 148/96 → 148/96 | 0.0 → 0.0 | 11 → 10 | 0 → 0 |
| hard 3 | 11 → 11 | 7.7 → 7.7 | 6 → 8 | 16.3 → 17.4 | 20 → 20 | 156/77 → 156/77 | 66.0 → 22.0 | 12 → 12 | 0 → 0 |
| hard 4 | 11 → 11 | 7.2 → 7.2 | 7 → 7 | 17.3 → 17.3 | 20 → 20 | 192/73 → 192/73 | 94.0 → 96.0 | 11 → 11 | 27 → 27 |
| hard 5 | 13 → 13 | 8.0 → 8.0 | 7 → 7 | 28.0 → 28.4 | 20 → 20 | 330/188 → 330/188 | 0.0 → 0.0 | 20 → 22 | 74 → 76 |
| hard 6 | 10 → 10 | 7.6 → 7.6 | 5 → 7 | 13.6 → 15.7 | 20 → 20 | 241/127 → 241/127 | 204.0 → 451.5 | 12 → 14 | 30 → 38 |
| hard 7 | 19 → 19 | 8.9 → 8.9 | 12 → 12 | 18.8 → 19.0 | 20 → 20 | 303/223 → 303/223 | 357.1 → 436.0 | 14 → 11 | 61 → 60 |
| hard 8 | 10 → 10 | 9.7 → 9.7 | 3 → 3 | 12.0 → 12.0 | 20 → 20 | 351/324 → 351/324 | 0.0 → 0.0 | 8 → 8 | 24 → 24 |
| hard 9 | 17 → 17 | 10.0 → 10.0 | 9 → 10 | 17.6 → 18.0 | 20 → 20 | 383/452 → 383/452 | 348.0 → 231.8 | 13 → 9 | 51 → 53 |
| hard 10 | 16 → 16 | 13.7 → 13.7 | 12 → 12 | 25.9 → 26.5 | 20 → 20 | 520/397 → 520/397 | 0.0 → 0.0 | 17 → 18 | 80 → 84 |
| hard 11 | 8 → 8 | 6.5 → 6.5 | 5 → 5 | 12.4 → 13.4 | 20 → 20 | 433/528 → 433/528 | 0.0 → 0.0 | 10 → 13 | 26 → 28 |
| hard 12 | 18 → 18 | 10.6 → 10.6 | 9 → 9 | 18.6 → 18.7 | 20 → 20 | 681/719 → 681/719 | 0.0 → 0.0 | 12 → 12 | 66 → 68 |
| hard 13 | 7 → 7 | 6.7 → 6.7 | 3 → 3 | 10.8 → 11.5 | 20 → 20 | 453/890 → 453/890 | 0.0 → 0.0 | 8 → 8 | 24 → 26 |
| hard 14 | 15 → 15 | 9.2 → 9.2 | 9 → 9 | 18.7 → 18.9 | 20 → 20 | 540/1110 → 540/1110 | 0.0 → 0.0 | 11 → 13 | 65 → 67 |
| hard 15 | 12 → 12 | 9.4 → 9.4 | 7 → 7 | 23.2 → 23.4 | 20 → 20 | 893/1450 → 893/1450 | 600.0 → 610.0 | 20 → 17 | 54 → 60 |
| hard 16 | 15 → 15 | 12.1 → 12.1 | 8 → 7 | 19.2 → 19.3 | 20 → 20 | 706/1758 → 706/1758 | 0.0 → 0.0 | 11 → 15 | 73 → 72 |
| hard 17 | 25 → 25 | 10.5 → 10.5 | 18 → 17 | 25.8 → 23.9 | 20 → 20 | 1151/2155 → 1151/2155 | 0.0 → 0.0 | 18 → 20 | 145 → 129 |
| hard 18 | 17 → 17 | 8.8 → 8.8 | 11 → 11 | 23.9 → 24.1 | 20 → 20 | 1349/2058 → 1349/2058 | 673.0 → 782.6 | 22 → 23 | 92 → 93 |
| hard 19 | 33 → 33 | 18.7 → 18.7 | 17 → 17 | 31.2 → 30.2 | 20 → 20 | 1134/2556 → 1134/2556 | 0.0 → 0.0 | 24 → 29 | 181 → 157 |
| hard 20 | 33 → 33 | 18.7 → 18.7 | 20 → 20 | 40.7 → 41.5 | 20 → 20 | 1946/3332 → 1946/3332 | 1868.9 → 1921.3 | 38 → 34 | 253 → 266 |

Shield is capped absorbed damage (and can include Titan regeneration), slow hits include applications and refreshes, and aura shots mean support was present. None is causal credit for damage prevented, lives saved or player understanding. Timing is simulated combat only; no build or player time is included.
