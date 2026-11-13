# M4.2 versus M4.1 production comparison

The 1.6.0 report compares with immutable M4.1 1.5.0 using the same seven policies, three difficulty configurations and seed. Each run repeats exactly. All authored wave groups/rewards, non-Raid combat values and the first four production waves match. The old and new reports contain full event schedules and individual tower ledgers; `comparison.json` pairs every reached wave for all 21 runs.

## Exact boss content edit

Raid retains the 66% immediate 260-unit, 1.5 s EMP. Its second 33% EMP is removed; the same four reinforcements now all follow the first trigger at 0/250/500/750 ms. Titan numbers and recovery rule, Agent brace, all waves and every price are unchanged. Balance 1.5.0 → 1.6.0; schema remains v4.


## All policy and difficulty outcomes

| Run | Phase / finishing wave | Lives old → new | Typed leaks old → new | Dharma / Bandwidth old → new | Boss outcomes old → new | Combat s old → new |
| --- | --- | ---: | --- | --- | --- | ---: |
| easy-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2418/4414 → 2418/4414 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 347.5 → 342.9 |
| easy-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2525/5476 → 2525/5476 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 337.6 → 328.8 |
| easy-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2386/4474 → 2386/4474 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 365.7 → 350.6 |
| easy-campaign/expansion-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 9039/5476 → 9039/5476 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 475.7 → 474.1 |
| easy-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2419/4474 → 2419/4474 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 347.4 → 341.3 |
| easy-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 85.5 → 85.5 |
| easy-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2418/4414 → 2418/4414 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 347.5 → 342.9 |
| normal-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2237/3832 → 2237/3832 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 381.0 → 375.2 |
| normal-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1910/4894 → 1910/4894 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 371.0 → 369.0 |
| normal-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2205/3892 → 2205/3892 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 399.3 → 392.0 |
| normal-campaign/expansion-heavy | VICTORY 20 → VICTORY 20 | 10 → 10 | megaCorpTitan×2 → megaCorpTitan×2 | 7540/4678 → 7540/4678 | megaCorpTitan:killed×2, megaCorpTitan:leaked×2, raidTeam:killed×3 → megaCorpTitan:killed×2, megaCorpTitan:leaked×2, raidTeam:killed×3 | 508.8 → 506.3 |
| normal-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2220/3892 → 2220/3892 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 368.8 → 364.3 |
| normal-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 75.1 → 75.1 |
| normal-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2237/3832 → 2237/3832 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 381.0 → 375.2 |
| hard-campaign/existing | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1946/3332 → 1946/3332 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 411.3 → 408.1 |
| hard-campaign/firewall-only | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 2053/4394 → 2053/4394 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 408.9 → 407.0 |
| hard-campaign/no-support | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1914/3392 → 1914/3392 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 431.7 → 426.2 |
| hard-campaign/expansion-heavy | GAME_OVER 20 → GAME_OVER 20 | 0 → 0 | megaCorpTitan×4 → megaCorpTitan×4 | 5677/3909 → 5677/3909 | megaCorpTitan:leaked×4, raidTeam:killed×3 → megaCorpTitan:leaked×4, raidTeam:killed×3 | 524.4 → 523.0 |
| hard-campaign/upgrade-heavy | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1793/3898 → 1793/3898 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 413.7 → 405.2 |
| hard-campaign/weak-placement | GAME_OVER 3 → GAME_OVER 3 | 0 → 0 | scriptKiddie×20 → scriptKiddie×20 | 46/60 → 46/60 | — → — | 67.5 → 67.5 |
| hard-campaign/counter-aware | VICTORY 20 → VICTORY 20 | 20 → 20 | — → — | 1946/3332 → 1946/3332 | megaCorpTitan:killed×4, raidTeam:killed×3 → megaCorpTitan:killed×4, raidTeam:killed×3 | 411.3 → 408.1 |

## Per-wave pressure: existing policy

All old/new banks, lives, typed leaks, boss phases and support/control measures for **every** policy/wave are paired in `comparison.json`. The table below shows the two most demanding configurations of the fixed existing policy; Easy and the other policies are in the JSON. `Peak` counts live enemies, including dynamic reinforcements.

| Difficulty / wave | Authored count old → new | Last authored s old → new | Peak old → new | Combat s old → new | Lives old → new | Dharma / Bandwidth after old → new | Shield removed old → new | Slow hits old → new | Aura shots old → new |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| normal 1 | 8 → 8 | 8.6 → 8.6 | 4 → 4 | 15.7 → 15.7 | 20 → 20 | 110/56 → 110/56 | 0.0 → 0.0 | 9 → 9 | 0 → 0 |
| normal 2 | 10 → 10 | 6.8 → 6.8 | 8 → 8 | 16.7 → 16.7 | 20 → 20 | 166/96 → 166/96 | 0.0 → 0.0 | 9 → 9 | 0 → 0 |
| normal 3 | 11 → 11 | 7.7 → 7.7 | 6 → 6 | 15.8 → 15.8 | 20 → 20 | 185/80 → 185/80 | 66.0 → 66.0 | 10 → 10 | 0 → 0 |
| normal 4 | 11 → 11 | 7.2 → 7.2 | 7 → 7 | 16.2 → 16.2 | 20 → 20 | 232/81 → 232/81 | 122.5 → 122.5 | 13 → 13 | 19 → 19 |
| normal 5 | 13 → 13 | 8.0 → 8.0 | 9 → 11 | 27.1 → 24.7 | 20 → 20 | 402/205 → 402/205 | 73.0 → 0.0 | 14 → 14 | 65 → 65 |
| normal 6 | 10 → 10 | 7.6 → 7.6 | 4 → 4 | 11.6 → 11.6 | 20 → 20 | 329/154 → 329/154 | 76.0 → 76.0 | 9 → 9 | 23 → 24 |
| normal 7 | 19 → 19 | 8.9 → 8.9 | 11 → 11 | 17.8 → 16.9 | 20 → 20 | 304/259 → 304/259 | 395.0 → 395.0 | 9 → 10 | 50 → 44 |
| normal 8 | 10 → 10 | 9.7 → 9.7 | 3 → 3 | 11.2 → 11.2 | 20 → 20 | 382/370 → 382/370 | 0.0 → 0.0 | 4 → 6 | 17 → 16 |
| normal 9 | 17 → 17 | 10.0 → 10.0 | 9 → 9 | 17.6 → 17.7 | 20 → 20 | 563/515 → 563/515 | 258.0 → 258.0 | 12 → 10 | 39 → 40 |
| normal 10 | 16 → 16 | 13.7 → 13.7 | 10 → 12 | 27.5 → 25.0 | 20 → 20 | 765/484 → 765/484 | 79.0 → 0.0 | 17 → 14 | 69 → 72 |
| normal 11 | 8 → 8 | 6.5 → 6.5 | 5 → 4 | 11.4 → 10.0 | 20 → 20 | 482/625 → 482/625 | 0.0 → 0.0 | 9 → 5 | 25 → 21 |
| normal 12 | 18 → 18 | 10.6 → 10.6 | 9 → 9 | 17.9 → 17.2 | 20 → 20 | 565/837 → 565/837 | 0.0 → 0.0 | 13 → 13 | 51 → 44 |
| normal 13 | 7 → 7 | 6.7 → 6.7 | 3 → 3 | 9.5 → 10.1 | 20 → 20 | 593/1024 → 593/1024 | 0.0 → 0.0 | 6 → 7 | 19 → 21 |
| normal 14 | 15 → 15 | 9.2 → 9.2 | 7 → 8 | 17.5 → 17.0 | 20 → 20 | 731/1267 → 731/1267 | 0.0 → 0.0 | 12 → 12 | 39 → 39 |
| normal 15 | 12 → 12 | 9.4 → 9.4 | 7 → 7 | 19.3 → 18.9 | 20 → 20 | 949/1648 → 949/1648 | 349.9 → 341.7 | 14 → 14 | 41 → 40 |
| normal 16 | 15 → 15 | 12.1 → 12.1 | 6 → 6 | 18.1 → 18.5 | 20 → 20 | 992/1485 → 992/1485 | 0.0 → 0.0 | 12 → 13 | 45 → 48 |
| normal 17 | 25 → 25 | 10.5 → 10.5 | 15 → 16 | 22.1 → 22.6 | 20 → 20 | 1110/1929 → 1110/1929 | 0.0 → 0.0 | 15 → 18 | 83 → 95 |
| normal 18 | 17 → 17 | 8.8 → 8.8 | 10 → 10 | 20.2 → 20.7 | 20 → 20 | 1273/2390 → 1273/2390 | 597.0 → 597.0 | 17 → 14 | 50 → 51 |
| normal 19 | 33 → 33 | 18.7 → 18.7 | 14 → 16 | 29.1 → 29.5 | 20 → 20 | 1633/2949 → 1633/2949 | 0.0 → 0.0 | 23 → 18 | 116 → 134 |
| normal 20 | 33 → 33 | 18.7 → 18.7 | 18 → 18 | 38.5 → 39.2 | 20 → 20 | 2237/3832 → 2237/3832 | 1710.8 → 1607.0 | 27 → 30 | 174 → 187 |
| hard 1 | 8 → 8 | 8.6 → 8.6 | 4 → 4 | 16.0 → 16.0 | 20 → 20 | 102/56 → 102/56 | 0.0 → 0.0 | 10 → 10 | 0 → 0 |
| hard 2 | 10 → 10 | 6.8 → 6.8 | 8 → 8 | 18.1 → 18.1 | 20 → 20 | 148/96 → 148/96 | 0.0 → 0.0 | 11 → 11 | 0 → 0 |
| hard 3 | 11 → 11 | 7.7 → 7.7 | 6 → 6 | 16.3 → 16.3 | 20 → 20 | 156/77 → 156/77 | 66.0 → 66.0 | 12 → 12 | 0 → 0 |
| hard 4 | 11 → 11 | 7.2 → 7.2 | 7 → 7 | 17.3 → 17.3 | 20 → 20 | 192/73 → 192/73 | 94.0 → 94.0 | 11 → 11 | 27 → 27 |
| hard 5 | 13 → 13 | 8.0 → 8.0 | 7 → 7 | 29.3 → 28.0 | 20 → 20 | 330/188 → 330/188 | 0.0 → 0.0 | 19 → 20 | 73 → 74 |
| hard 6 | 10 → 10 | 7.6 → 7.6 | 6 → 5 | 14.6 → 13.6 | 20 → 20 | 241/127 → 241/127 | 298.4 → 204.0 | 13 → 12 | 34 → 30 |
| hard 7 | 19 → 19 | 8.9 → 8.9 | 13 → 12 | 18.3 → 18.8 | 20 → 20 | 303/223 → 303/223 | 321.0 → 357.1 | 11 → 14 | 59 → 61 |
| hard 8 | 10 → 10 | 9.7 → 9.7 | 3 → 3 | 11.3 → 12.0 | 20 → 20 | 351/324 → 351/324 | 0.0 → 0.0 | 8 → 8 | 22 → 24 |
| hard 9 | 17 → 17 | 10.0 → 10.0 | 10 → 9 | 18.0 → 17.6 | 20 → 20 | 383/452 → 383/452 | 384.1 → 348.0 | 12 → 13 | 54 → 51 |
| hard 10 | 16 → 16 | 13.7 → 13.7 | 10 → 12 | 28.5 → 25.9 | 20 → 20 | 520/397 → 520/397 | 107.0 → 0.0 | 17 → 17 | 79 → 80 |
| hard 11 | 8 → 8 | 6.5 → 6.5 | 5 → 5 | 11.5 → 12.4 | 20 → 20 | 433/528 → 433/528 | 0.0 → 0.0 | 8 → 10 | 24 → 26 |
| hard 12 | 18 → 18 | 10.6 → 10.6 | 10 → 9 | 18.8 → 18.6 | 20 → 20 | 681/719 → 681/719 | 0.0 → 0.0 | 14 → 12 | 69 → 66 |
| hard 13 | 7 → 7 | 6.7 → 6.7 | 3 → 3 | 11.1 → 10.8 | 20 → 20 | 453/890 → 453/890 | 0.0 → 0.0 | 8 → 8 | 24 → 24 |
| hard 14 | 15 → 15 | 9.2 → 9.2 | 10 → 9 | 19.2 → 18.7 | 20 → 20 | 540/1110 → 540/1110 | 0.0 → 0.0 | 15 → 11 | 73 → 65 |
| hard 15 | 12 → 12 | 9.4 → 9.4 | 7 → 7 | 23.1 → 23.2 | 20 → 20 | 893/1450 → 893/1450 | 653.0 → 600.0 | 17 → 20 | 54 → 54 |
| hard 16 | 15 → 15 | 12.1 → 12.1 | 7 → 8 | 19.3 → 19.2 | 20 → 20 | 706/1758 → 706/1758 | 0.0 → 0.0 | 14 → 11 | 72 → 73 |
| hard 17 | 25 → 25 | 10.5 → 10.5 | 17 → 18 | 23.9 → 25.8 | 20 → 20 | 1151/2155 → 1151/2155 | 0.0 → 0.0 | 19 → 18 | 127 → 145 |
| hard 18 | 17 → 17 | 8.8 → 8.8 | 11 → 11 | 23.6 → 23.9 | 20 → 20 | 1349/2058 → 1349/2058 | 673.0 → 673.0 | 18 → 22 | 86 → 92 |
| hard 19 | 33 → 33 | 18.7 → 18.7 | 17 → 17 | 30.5 → 31.2 | 20 → 20 | 1134/2556 → 1134/2556 | 0.0 → 0.0 | 26 → 24 | 176 → 181 |
| hard 20 | 33 → 33 | 18.7 → 18.7 | 20 → 20 | 42.8 → 40.7 | 20 → 20 | 1946/3332 → 1946/3332 | 1884.0 → 1868.9 | 30 → 38 | 265 → 253 |

Shield is capped absorbed damage (and can include Titan regeneration), slow hits include applications and refreshes, and aura shots mean support was present. None is causal credit for damage prevented, lives saved or player understanding. Timing is simulated combat only; no build or player time is included.
