# Scripted balance results

Generated from results.json by tools/balance/summary.mjs. Resources are Dharma/Bandwidth/Anonymity. Time is simulated wave time, excluding preparation and report CPU time. These are fixed-policy observations, not human difficulty or win rates.

| Scenario | Policy | Outcome (last played wave) | Lives / leaks | Boss killed/leaked/unresolved | Seconds | End resources | Spent | Bounty | Clear (includes passive) | Passive Dharma |
|---|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 342.850 | 2418/4414/0 | 10083/1062/0 | 8439/4263/0 | 3932/1153/0 | 102 |
| easy-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 328.750 | 2525/5476/0 | 9874/0/0 | 8439/4263/0 | 3830/1153/0 | 0 |
| easy-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 350.550 | 2386/4474/0 | 10013/1002/0 | 8439/4263/0 | 3830/1153/0 | 0 |
| easy-campaign | expansion-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 474.050 | 9039/5476/0 | 3360/0/0 | 8439/4263/0 | 3830/1153/0 | 0 |
| easy-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 341.267 | 2419/4474/0 | 9980/1002/0 | 8439/4263/0 | 3830/1153/0 | 0 |
| easy-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 85.467 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| easy-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 342.850 | 2418/4414/0 | 10083/1062/0 | 8439/4263/0 | 3932/1153/0 | 102 |
| normal-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 381.100 | 2237/3832/0 | 9215/1062/0 | 7390/3681/0 | 3932/1153/0 | 102 |
| normal-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 375.583 | 1910/4894/0 | 9440/0/0 | 7390/3681/0 | 3830/1153/0 | 0 |
| normal-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 404.200 | 2205/3892/0 | 9145/1002/0 | 7390/3681/0 | 3830/1153/0 | 0 |
| normal-campaign | expansion-heavy | VICTORY (20) | 5 / 3 | 4/3/0 | 519.067 | 7315/4570/0 | 3360/0/0 | 6715/3357/0 | 3830/1153/0 | 0 |
| normal-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 373.783 | 2220/3892/0 | 9130/1002/0 | 7390/3681/0 | 3830/1153/0 | 0 |
| normal-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 72.867 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| normal-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 381.100 | 2237/3832/0 | 9215/1062/0 | 7390/3681/0 | 3932/1153/0 | 102 |
| hard-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 413.133 | 1946/3332/0 | 8347/1062/0 | 6231/3181/0 | 3932/1153/0 | 102 |
| hard-campaign | firewall-only | VICTORY (20) | 19 / 1 | 7/0/0 | 415.517 | 2030/4381/0 | 8138/0/0 | 6208/3168/0 | 3830/1153/0 | 0 |
| hard-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 427.500 | 1914/3392/0 | 8277/1002/0 | 6231/3181/0 | 3830/1153/0 | 0 |
| hard-campaign | expansion-heavy | GAME_OVER (20) | 0 / 3 | 3/3/1 | 511.233 | 5677/3909/0 | 3360/0/0 | 5467/2813/0 | 3440/1036/0 | 0 |
| hard-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 409.800 | 1793/3898/0 | 8398/496/0 | 6231/3181/0 | 3830/1153/0 | 0 |
| hard-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 67.467 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| hard-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 413.133 | 1946/3332/0 | 8347/1062/0 | 6231/3181/0 | 3932/1153/0 | 102 |

## Observed tower activity

Aggregated by type; detailed per-wave tower IDs, levels, positions and typed leak coverage are in results.json. Health/shield removal and final hits do not allocate causal benefit from status or support. Aura-present shots may overlap.

| Scenario | Policy | Type | Health removed | Shield removed | Final hits | Shots | Slow applications | Vulnerability applications | Aura-present shots |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | encryption | 5342.309 | 254.356 | 53 | 380 | 191 | 191 | 0 |
| easy-campaign | existing | firewall | 47660.566 | 2583.696 | 267 | 1217 | 0 | 0 | 0 |
| easy-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 712 |
| easy-campaign | firewall-only | firewall | 53002.875 | 2506.972 | 320 | 1357 | 0 | 0 | 0 |
| easy-campaign | no-support | encryption | 4897.494 | 270.830 | 65 | 352 | 187 | 187 | 0 |
| easy-campaign | no-support | firewall | 48105.381 | 2303.634 | 255 | 1134 | 0 | 0 | 0 |
| easy-campaign | expansion-heavy | firewall | 53002.875 | 1817 | 320 | 10498 | 0 | 0 | 0 |
| easy-campaign | upgrade-heavy | encryption | 4435.985 | 168.020 | 41 | 329 | 169 | 169 | 0 |
| easy-campaign | upgrade-heavy | firewall | 48566.890 | 2464.012 | 279 | 1516 | 0 | 0 | 0 |
| easy-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| easy-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| easy-campaign | counter-aware | encryption | 5342.309 | 254.356 | 53 | 380 | 191 | 191 | 0 |
| easy-campaign | counter-aware | firewall | 47660.566 | 2583.696 | 267 | 1217 | 0 | 0 | 0 |
| easy-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 712 |
| normal-campaign | existing | encryption | 7702.894 | 129.476 | 40 | 429 | 261 | 261 | 0 |
| normal-campaign | existing | firewall | 70034.656 | 3651.548 | 280 | 1576 | 0 | 0 | 0 |
| normal-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1002 |
| normal-campaign | firewall-only | firewall | 77737.550 | 3778.218 | 320 | 1892 | 0 | 0 | 0 |
| normal-campaign | no-support | encryption | 7088.115 | 313.172 | 52 | 413 | 254 | 254 | 0 |
| normal-campaign | no-support | firewall | 70649.435 | 3368.664 | 268 | 1664 | 0 | 0 | 0 |
| normal-campaign | expansion-heavy | firewall | 76070.550 | 3264 | 317 | 12549 | 0 | 0 | 0 |
| normal-campaign | upgrade-heavy | encryption | 5971.460 | 95.320 | 46 | 364 | 223 | 223 | 0 |
| normal-campaign | upgrade-heavy | firewall | 71766.090 | 3350.096 | 274 | 1942 | 0 | 0 | 0 |
| normal-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| normal-campaign | weak-placement | firewall | 126 | 0 | 0 | 5 | 0 | 0 | 0 |
| normal-campaign | counter-aware | encryption | 7702.894 | 129.476 | 40 | 429 | 261 | 261 | 0 |
| normal-campaign | counter-aware | firewall | 70034.656 | 3651.548 | 280 | 1576 | 0 | 0 | 0 |
| normal-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1002 |
| hard-campaign | existing | encryption | 9094.820 | 441.554 | 46 | 463 | 309 | 309 | 0 |
| hard-campaign | existing | firewall | 88430.470 | 4109.558 | 274 | 1947 | 0 | 0 | 0 |
| hard-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1328 |
| hard-campaign | firewall-only | firewall | 97342.170 | 4436.314 | 319 | 2376 | 0 | 0 | 0 |
| hard-campaign | no-support | encryption | 8770.065 | 394.908 | 30 | 433 | 291 | 291 | 0 |
| hard-campaign | no-support | firewall | 88755.225 | 3611.212 | 290 | 1963 | 0 | 0 | 0 |
| hard-campaign | expansion-heavy | firewall | 93283.290 | 4139 | 316 | 13087 | 0 | 0 | 0 |
| hard-campaign | upgrade-heavy | encryption | 7038.631 | 221.164 | 35 | 404 | 257 | 257 | 0 |
| hard-campaign | upgrade-heavy | firewall | 90486.659 | 4045.782 | 285 | 2292 | 0 | 0 | 0 |
| hard-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hard-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| hard-campaign | counter-aware | encryption | 9094.820 | 441.554 | 46 | 463 | 309 | 309 | 0 |
| hard-campaign | counter-aware | firewall | 88430.470 | 4109.558 | 274 | 1947 | 0 | 0 | 0 |
| hard-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1328 |

## Wave pressure and outcomes

Authored count/due time excludes dynamic Raid reinforcements. Spawn HP and initial shield sum actual production spawns (including reinforcements); neither is a damage requirement or a scalar difficulty score. Peak live count is observed on each spawn. Defeat can leave authored spawns unreleased and live enemies unresolved.

| Scenario | Policy | Wave | Authored count / last due ms | Actual spawns | Spawn HP / initial shield | Peak alive | Kills / leaks | Lives after | Seconds |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | existing | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 14.650 |
| easy-campaign | existing | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.517 |
| easy-campaign | existing | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 13.267 |
| easy-campaign | existing | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 11 | 17 / 0 | 20 | 23.300 |
| easy-campaign | existing | 6 | 10 / 7600 | 10 | 877.9 / 0 | 5 | 10 / 0 | 20 | 10.950 |
| easy-campaign | existing | 7 | 19 / 8900 | 19 | 1379.3 / 0 | 11 | 19 / 0 | 20 | 17.000 |
| easy-campaign | existing | 8 | 10 / 9700 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.233 |
| easy-campaign | existing | 9 | 17 / 10000 | 17 | 1749.0 / 0 | 9 | 17 / 0 | 20 | 16.550 |
| easy-campaign | existing | 10 | 16 / 13700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 21.867 |
| easy-campaign | existing | 11 | 8 / 6500 | 8 | 1222.5 / 0 | 3 | 8 / 0 | 20 | 8.800 |
| easy-campaign | existing | 12 | 18 / 10600 | 18 | 2285.4 / 0 | 8 | 18 / 0 | 20 | 16.250 |
| easy-campaign | existing | 13 | 7 / 6700 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 9.133 |
| easy-campaign | existing | 14 | 15 / 9200 | 15 | 2529.0 / 0 | 7 | 15 / 0 | 20 | 16.217 |
| easy-campaign | existing | 15 | 12 / 9400 | 12 | 3088.1 / 249 | 6 | 12 / 0 | 20 | 16.767 |
| easy-campaign | existing | 16 | 15 / 12100 | 15 | 3472.5 / 0 | 5 | 15 / 0 | 20 | 16.183 |
| easy-campaign | existing | 17 | 25 / 10500 | 25 | 5365.1 / 0 | 15 | 25 / 0 | 20 | 19.733 |
| easy-campaign | existing | 18 | 17 / 8800 | 17 | 4617.0 / 299 | 9 | 17 / 0 | 20 | 17.350 |
| easy-campaign | existing | 19 | 33 / 18700 | 33 | 7404.8 / 0 | 14 | 33 / 0 | 20 | 27.867 |
| easy-campaign | existing | 20 | 33 / 18700 | 37 | 10690.5 / 698 | 17 | 37 / 0 | 20 | 37.767 |
| easy-campaign | firewall-only | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 11.267 |
| easy-campaign | firewall-only | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.917 |
| easy-campaign | firewall-only | 3 | 11 / 7700 | 11 | 643.5 / 0 | 5 | 11 / 0 | 20 | 12.567 |
| easy-campaign | firewall-only | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 12.533 |
| easy-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 11 | 17 / 0 | 20 | 22.150 |
| easy-campaign | firewall-only | 6 | 10 / 7600 | 10 | 877.9 / 0 | 4 | 10 / 0 | 20 | 11.167 |
| easy-campaign | firewall-only | 7 | 19 / 8900 | 19 | 1379.3 / 0 | 10 | 19 / 0 | 20 | 13.567 |
| easy-campaign | firewall-only | 8 | 10 / 9700 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.217 |
| easy-campaign | firewall-only | 9 | 17 / 10000 | 17 | 1749.0 / 0 | 8 | 17 / 0 | 20 | 13.050 |
| easy-campaign | firewall-only | 10 | 16 / 13700 | 20 | 2537.3 / 0 | 11 | 20 / 0 | 20 | 21.417 |
| easy-campaign | firewall-only | 11 | 8 / 6500 | 8 | 1222.5 / 0 | 3 | 8 / 0 | 20 | 8.900 |
| easy-campaign | firewall-only | 12 | 18 / 10600 | 18 | 2285.4 / 0 | 9 | 18 / 0 | 20 | 18.367 |
| easy-campaign | firewall-only | 13 | 7 / 6700 | 7 | 1332.2 / 0 | 3 | 7 / 0 | 20 | 8.883 |
| easy-campaign | firewall-only | 14 | 15 / 9200 | 15 | 2529.0 / 0 | 6 | 15 / 0 | 20 | 14.450 |
| easy-campaign | firewall-only | 15 | 12 / 9400 | 12 | 3088.1 / 249 | 6 | 12 / 0 | 20 | 17.083 |
| easy-campaign | firewall-only | 16 | 15 / 12100 | 15 | 3472.5 / 0 | 6 | 15 / 0 | 20 | 18.617 |
| easy-campaign | firewall-only | 17 | 25 / 10500 | 25 | 5365.1 / 0 | 15 | 25 / 0 | 20 | 21.367 |
| easy-campaign | firewall-only | 18 | 17 / 8800 | 17 | 4617.0 / 299 | 9 | 17 / 0 | 20 | 18.383 |
| easy-campaign | firewall-only | 19 | 33 / 18700 | 33 | 7404.8 / 0 | 12 | 33 / 0 | 20 | 27.350 |
| easy-campaign | firewall-only | 20 | 33 / 18700 | 37 | 10690.5 / 698 | 15 | 37 / 0 | 20 | 35.500 |
| easy-campaign | no-support | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | no-support | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 14.650 |
| easy-campaign | no-support | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.517 |
| easy-campaign | no-support | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 13.950 |
| easy-campaign | no-support | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 11 | 17 / 0 | 20 | 23.667 |
| easy-campaign | no-support | 6 | 10 / 7600 | 10 | 877.9 / 0 | 4 | 10 / 0 | 20 | 11.600 |
| easy-campaign | no-support | 7 | 19 / 8900 | 19 | 1379.3 / 0 | 11 | 19 / 0 | 20 | 17.117 |
| easy-campaign | no-support | 8 | 10 / 9700 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.217 |
| easy-campaign | no-support | 9 | 17 / 10000 | 17 | 1749.0 / 0 | 8 | 17 / 0 | 20 | 15.117 |
| easy-campaign | no-support | 10 | 16 / 13700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 23.733 |
| easy-campaign | no-support | 11 | 8 / 6500 | 8 | 1222.5 / 0 | 3 | 8 / 0 | 20 | 8.617 |
| easy-campaign | no-support | 12 | 18 / 10600 | 18 | 2285.4 / 0 | 8 | 18 / 0 | 20 | 16.733 |
| easy-campaign | no-support | 13 | 7 / 6700 | 7 | 1332.2 / 0 | 3 | 7 / 0 | 20 | 9.100 |
| easy-campaign | no-support | 14 | 15 / 9200 | 15 | 2529.0 / 0 | 8 | 15 / 0 | 20 | 16.450 |
| easy-campaign | no-support | 15 | 12 / 9400 | 12 | 3088.1 / 249 | 6 | 12 / 0 | 20 | 18.800 |
| easy-campaign | no-support | 16 | 15 / 12100 | 15 | 3472.5 / 0 | 7 | 15 / 0 | 20 | 18.950 |
| easy-campaign | no-support | 17 | 25 / 10500 | 25 | 5365.1 / 0 | 15 | 25 / 0 | 20 | 22.133 |
| easy-campaign | no-support | 18 | 17 / 8800 | 17 | 4617.0 / 299 | 10 | 17 / 0 | 20 | 18.867 |
| easy-campaign | no-support | 19 | 33 / 18700 | 33 | 7404.8 / 0 | 12 | 33 / 0 | 20 | 25.783 |
| easy-campaign | no-support | 20 | 33 / 18700 | 37 | 10690.5 / 698 | 16 | 37 / 0 | 20 | 36.100 |
| easy-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 360.0 / 0 | 2 | 8 / 0 | 20 | 10.417 |
| easy-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.933 |
| easy-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 643.5 / 0 | 5 | 11 / 0 | 20 | 10.867 |
| easy-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 12.317 |
| easy-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 11 | 17 / 0 | 20 | 24.150 |
| easy-campaign | expansion-heavy | 6 | 10 / 7600 | 10 | 877.9 / 0 | 3 | 10 / 0 | 20 | 10.383 |
| easy-campaign | expansion-heavy | 7 | 19 / 8900 | 19 | 1379.3 / 0 | 9 | 19 / 0 | 20 | 12.450 |
| easy-campaign | expansion-heavy | 8 | 10 / 9700 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 10.300 |
| easy-campaign | expansion-heavy | 9 | 17 / 10000 | 17 | 1749.0 / 0 | 7 | 17 / 0 | 20 | 12.683 |
| easy-campaign | expansion-heavy | 10 | 16 / 13700 | 20 | 2537.3 / 0 | 11 | 20 / 0 | 20 | 17.983 |
| easy-campaign | expansion-heavy | 11 | 8 / 6500 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 8.000 |
| easy-campaign | expansion-heavy | 12 | 18 / 10600 | 18 | 2285.4 / 0 | 7 | 18 / 0 | 20 | 12.983 |
| easy-campaign | expansion-heavy | 13 | 7 / 6700 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 9.450 |
| easy-campaign | expansion-heavy | 14 | 15 / 9200 | 15 | 2529.0 / 0 | 6 | 15 / 0 | 20 | 14.767 |
| easy-campaign | expansion-heavy | 15 | 12 / 9400 | 12 | 3088.1 / 249 | 6 | 12 / 0 | 20 | 57.733 |
| easy-campaign | expansion-heavy | 16 | 15 / 12100 | 15 | 3472.5 / 0 | 5 | 15 / 0 | 20 | 15.117 |
| easy-campaign | expansion-heavy | 17 | 25 / 10500 | 25 | 5365.1 / 0 | 15 | 25 / 0 | 20 | 19.817 |
| easy-campaign | expansion-heavy | 18 | 17 / 8800 | 17 | 4617.0 / 299 | 11 | 17 / 0 | 20 | 70.683 |
| easy-campaign | expansion-heavy | 19 | 33 / 18700 | 33 | 7404.8 / 0 | 16 | 33 / 0 | 20 | 26.283 |
| easy-campaign | expansion-heavy | 20 | 33 / 18700 | 37 | 10690.5 / 698 | 23 | 37 / 0 | 20 | 106.733 |
| easy-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.933 |
| easy-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.317 |
| easy-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 743.6 / 0 | 5 | 11 / 0 | 20 | 12.317 |
| easy-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 11 | 17 / 0 | 20 | 23.067 |
| easy-campaign | upgrade-heavy | 6 | 10 / 7600 | 10 | 877.9 / 0 | 4 | 10 / 0 | 20 | 10.517 |
| easy-campaign | upgrade-heavy | 7 | 19 / 8900 | 19 | 1379.3 / 0 | 11 | 19 / 0 | 20 | 17.083 |
| easy-campaign | upgrade-heavy | 8 | 10 / 9700 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.217 |
| easy-campaign | upgrade-heavy | 9 | 17 / 10000 | 17 | 1749.0 / 0 | 8 | 17 / 0 | 20 | 15.100 |
| easy-campaign | upgrade-heavy | 10 | 16 / 13700 | 20 | 2537.3 / 0 | 11 | 20 / 0 | 20 | 22.750 |
| easy-campaign | upgrade-heavy | 11 | 8 / 6500 | 8 | 1222.5 / 0 | 4 | 8 / 0 | 20 | 9.667 |
| easy-campaign | upgrade-heavy | 12 | 18 / 10600 | 18 | 2285.4 / 0 | 8 | 18 / 0 | 20 | 14.417 |
| easy-campaign | upgrade-heavy | 13 | 7 / 6700 | 7 | 1332.2 / 0 | 3 | 7 / 0 | 20 | 9.033 |
| easy-campaign | upgrade-heavy | 14 | 15 / 9200 | 15 | 2529.0 / 0 | 6 | 15 / 0 | 20 | 14.067 |
| easy-campaign | upgrade-heavy | 15 | 12 / 9400 | 12 | 3088.1 / 249 | 6 | 12 / 0 | 20 | 15.750 |
| easy-campaign | upgrade-heavy | 16 | 15 / 12100 | 15 | 3472.5 / 0 | 5 | 15 / 0 | 20 | 15.983 |
| easy-campaign | upgrade-heavy | 17 | 25 / 10500 | 25 | 5365.1 / 0 | 15 | 25 / 0 | 20 | 24.167 |
| easy-campaign | upgrade-heavy | 18 | 17 / 8800 | 17 | 4617.0 / 299 | 10 | 17 / 0 | 20 | 20.483 |
| easy-campaign | upgrade-heavy | 19 | 33 / 18700 | 33 | 7404.8 / 0 | 15 | 33 / 0 | 20 | 28.100 |
| easy-campaign | upgrade-heavy | 20 | 33 / 18700 | 37 | 10690.5 / 698 | 19 | 37 / 0 | 20 | 38.850 |
| easy-campaign | weak-placement | 1 | 8 / 8600 | 8 | 360.0 / 0 | 8 | 0 / 8 | 12 | 31.567 |
| easy-campaign | weak-placement | 2 | 10 / 6750 | 10 | 472.5 / 0 | 10 | 0 / 10 | 2 | 29.717 |
| easy-campaign | weak-placement | 3 | 11 / 7700 | 11 | 643.5 / 0 | 11 | 0 / 2 | 0 | 24.183 |
| easy-campaign | counter-aware | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | counter-aware | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 14.650 |
| easy-campaign | counter-aware | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.517 |
| easy-campaign | counter-aware | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 13.267 |
| easy-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 11 | 17 / 0 | 20 | 23.300 |
| easy-campaign | counter-aware | 6 | 10 / 7600 | 10 | 877.9 / 0 | 5 | 10 / 0 | 20 | 10.950 |
| easy-campaign | counter-aware | 7 | 19 / 8900 | 19 | 1379.3 / 0 | 11 | 19 / 0 | 20 | 17.000 |
| easy-campaign | counter-aware | 8 | 10 / 9700 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.233 |
| easy-campaign | counter-aware | 9 | 17 / 10000 | 17 | 1749.0 / 0 | 9 | 17 / 0 | 20 | 16.550 |
| easy-campaign | counter-aware | 10 | 16 / 13700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 21.867 |
| easy-campaign | counter-aware | 11 | 8 / 6500 | 8 | 1222.5 / 0 | 3 | 8 / 0 | 20 | 8.800 |
| easy-campaign | counter-aware | 12 | 18 / 10600 | 18 | 2285.4 / 0 | 8 | 18 / 0 | 20 | 16.250 |
| easy-campaign | counter-aware | 13 | 7 / 6700 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 9.133 |
| easy-campaign | counter-aware | 14 | 15 / 9200 | 15 | 2529.0 / 0 | 7 | 15 / 0 | 20 | 16.217 |
| easy-campaign | counter-aware | 15 | 12 / 9400 | 12 | 3088.1 / 249 | 6 | 12 / 0 | 20 | 16.767 |
| easy-campaign | counter-aware | 16 | 15 / 12100 | 15 | 3472.5 / 0 | 5 | 15 / 0 | 20 | 16.183 |
| easy-campaign | counter-aware | 17 | 25 / 10500 | 25 | 5365.1 / 0 | 15 | 25 / 0 | 20 | 19.733 |
| easy-campaign | counter-aware | 18 | 17 / 8800 | 17 | 4617.0 / 299 | 9 | 17 / 0 | 20 | 17.350 |
| easy-campaign | counter-aware | 19 | 33 / 18700 | 33 | 7404.8 / 0 | 14 | 33 / 0 | 20 | 27.867 |
| easy-campaign | counter-aware | 20 | 33 / 18700 | 37 | 10690.5 / 698 | 17 | 37 / 0 | 20 | 37.767 |
| normal-campaign | existing | 1 | 8 / 8600 | 8 | 528.0 / 0 | 4 | 8 / 0 | 20 | 15.600 |
| normal-campaign | existing | 2 | 10 / 6750 | 10 | 693.0 / 0 | 8 | 10 / 0 | 20 | 16.983 |
| normal-campaign | existing | 3 | 11 / 7700 | 11 | 943.8 / 0 | 6 | 11 / 0 | 20 | 16.133 |
| normal-campaign | existing | 4 | 11 / 7200 | 11 | 1090.6 / 0 | 7 | 11 / 0 | 20 | 16.017 |
| normal-campaign | existing | 5 | 13 / 8000 | 17 | 1961.3 / 0 | 11 | 17 / 0 | 20 | 25.417 |
| normal-campaign | existing | 6 | 10 / 7600 | 10 | 1287.6 / 0 | 4 | 10 / 0 | 20 | 11.750 |
| normal-campaign | existing | 7 | 19 / 8900 | 19 | 2022.9 / 0 | 11 | 19 / 0 | 20 | 17.850 |
| normal-campaign | existing | 8 | 10 / 9700 | 10 | 1313.4 / 0 | 3 | 10 / 0 | 20 | 11.117 |
| normal-campaign | existing | 9 | 17 / 10000 | 17 | 2565.2 / 0 | 9 | 17 / 0 | 20 | 18.100 |
| normal-campaign | existing | 10 | 16 / 13700 | 20 | 3721.3 / 0 | 12 | 20 / 0 | 20 | 23.733 |
| normal-campaign | existing | 11 | 8 / 6500 | 8 | 1793.0 / 0 | 4 | 8 / 0 | 20 | 11.567 |
| normal-campaign | existing | 12 | 18 / 10600 | 18 | 3352.0 / 0 | 8 | 18 / 0 | 20 | 17.817 |
| normal-campaign | existing | 13 | 7 / 6700 | 7 | 1953.9 / 0 | 3 | 7 / 0 | 20 | 10.067 |
| normal-campaign | existing | 14 | 15 / 9200 | 15 | 3709.2 / 0 | 7 | 15 / 0 | 20 | 17.767 |
| normal-campaign | existing | 15 | 12 / 9400 | 12 | 4529.3 / 366 | 7 | 12 / 0 | 20 | 20.050 |
| normal-campaign | existing | 16 | 15 / 12100 | 15 | 5093.0 / 0 | 7 | 15 / 0 | 20 | 19.050 |
| normal-campaign | existing | 17 | 25 / 10500 | 25 | 7868.9 / 0 | 16 | 25 / 0 | 20 | 22.333 |
| normal-campaign | existing | 18 | 17 / 8800 | 17 | 6771.6 / 439 | 10 | 17 / 0 | 20 | 21.000 |
| normal-campaign | existing | 19 | 33 / 18700 | 33 | 10860.3 / 0 | 14 | 33 / 0 | 20 | 29.000 |
| normal-campaign | existing | 20 | 33 / 18700 | 37 | 15679.4 / 1024 | 18 | 37 / 0 | 20 | 39.750 |
| normal-campaign | firewall-only | 1 | 8 / 8600 | 8 | 528.0 / 0 | 4 | 8 / 0 | 20 | 15.483 |
| normal-campaign | firewall-only | 2 | 10 / 6750 | 10 | 693.0 / 0 | 5 | 10 / 0 | 20 | 10.783 |
| normal-campaign | firewall-only | 3 | 11 / 7700 | 11 | 943.8 / 0 | 6 | 11 / 0 | 20 | 14.683 |
| normal-campaign | firewall-only | 4 | 11 / 7200 | 11 | 1090.6 / 0 | 6 | 11 / 0 | 20 | 14.900 |
| normal-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1961.3 / 0 | 11 | 17 / 0 | 20 | 22.850 |
| normal-campaign | firewall-only | 6 | 10 / 7600 | 10 | 1287.6 / 0 | 5 | 10 / 0 | 20 | 13.283 |
| normal-campaign | firewall-only | 7 | 19 / 8900 | 19 | 2022.9 / 0 | 12 | 19 / 0 | 20 | 18.733 |
| normal-campaign | firewall-only | 8 | 10 / 9700 | 10 | 1313.4 / 0 | 3 | 10 / 0 | 20 | 11.250 |
| normal-campaign | firewall-only | 9 | 17 / 10000 | 17 | 2565.2 / 0 | 9 | 17 / 0 | 20 | 17.750 |
| normal-campaign | firewall-only | 10 | 16 / 13700 | 20 | 3721.3 / 0 | 11 | 20 / 0 | 20 | 21.200 |
| normal-campaign | firewall-only | 11 | 8 / 6500 | 8 | 1793.0 / 0 | 4 | 8 / 0 | 20 | 10.400 |
| normal-campaign | firewall-only | 12 | 18 / 10600 | 18 | 3352.0 / 0 | 9 | 18 / 0 | 20 | 17.933 |
| normal-campaign | firewall-only | 13 | 7 / 6700 | 7 | 1953.9 / 0 | 3 | 7 / 0 | 20 | 9.633 |
| normal-campaign | firewall-only | 14 | 15 / 9200 | 15 | 3709.2 / 0 | 7 | 15 / 0 | 20 | 18.167 |
| normal-campaign | firewall-only | 15 | 12 / 9400 | 12 | 4529.3 / 366 | 7 | 12 / 0 | 20 | 22.850 |
| normal-campaign | firewall-only | 16 | 15 / 12100 | 15 | 5093.0 / 0 | 7 | 15 / 0 | 20 | 19.100 |
| normal-campaign | firewall-only | 17 | 25 / 10500 | 25 | 7868.9 / 0 | 15 | 25 / 0 | 20 | 23.267 |
| normal-campaign | firewall-only | 18 | 17 / 8800 | 17 | 6771.6 / 439 | 10 | 17 / 0 | 20 | 24.017 |
| normal-campaign | firewall-only | 19 | 33 / 18700 | 33 | 10860.3 / 0 | 14 | 33 / 0 | 20 | 28.067 |
| normal-campaign | firewall-only | 20 | 33 / 18700 | 37 | 15679.4 / 1024 | 20 | 37 / 0 | 20 | 41.233 |
| normal-campaign | no-support | 1 | 8 / 8600 | 8 | 528.0 / 0 | 4 | 8 / 0 | 20 | 15.600 |
| normal-campaign | no-support | 2 | 10 / 6750 | 10 | 693.0 / 0 | 8 | 10 / 0 | 20 | 16.983 |
| normal-campaign | no-support | 3 | 11 / 7700 | 11 | 943.8 / 0 | 6 | 11 / 0 | 20 | 16.133 |
| normal-campaign | no-support | 4 | 11 / 7200 | 11 | 1090.6 / 0 | 7 | 11 / 0 | 20 | 15.333 |
| normal-campaign | no-support | 5 | 13 / 8000 | 17 | 1961.3 / 0 | 7 | 17 / 0 | 20 | 26.117 |
| normal-campaign | no-support | 6 | 10 / 7600 | 10 | 1287.6 / 0 | 7 | 10 / 0 | 20 | 16.383 |
| normal-campaign | no-support | 7 | 19 / 8900 | 19 | 2022.9 / 0 | 13 | 19 / 0 | 20 | 19.667 |
| normal-campaign | no-support | 8 | 10 / 9700 | 10 | 1313.4 / 0 | 3 | 10 / 0 | 20 | 11.267 |
| normal-campaign | no-support | 9 | 17 / 10000 | 17 | 2565.2 / 0 | 9 | 17 / 0 | 20 | 19.417 |
| normal-campaign | no-support | 10 | 16 / 13700 | 20 | 3721.3 / 0 | 12 | 20 / 0 | 20 | 23.500 |
| normal-campaign | no-support | 11 | 8 / 6500 | 8 | 1793.0 / 0 | 5 | 8 / 0 | 20 | 11.850 |
| normal-campaign | no-support | 12 | 18 / 10600 | 18 | 3352.0 / 0 | 9 | 18 / 0 | 20 | 19.650 |
| normal-campaign | no-support | 13 | 7 / 6700 | 7 | 1953.9 / 0 | 3 | 7 / 0 | 20 | 10.583 |
| normal-campaign | no-support | 14 | 15 / 9200 | 15 | 3709.2 / 0 | 9 | 15 / 0 | 20 | 18.867 |
| normal-campaign | no-support | 15 | 12 / 9400 | 12 | 4529.3 / 366 | 7 | 12 / 0 | 20 | 24.217 |
| normal-campaign | no-support | 16 | 15 / 12100 | 15 | 5093.0 / 0 | 9 | 15 / 0 | 20 | 19.733 |
| normal-campaign | no-support | 17 | 25 / 10500 | 25 | 7868.9 / 0 | 17 | 25 / 0 | 20 | 23.550 |
| normal-campaign | no-support | 18 | 17 / 8800 | 17 | 6771.6 / 439 | 12 | 17 / 0 | 20 | 23.417 |
| normal-campaign | no-support | 19 | 33 / 18700 | 33 | 10860.3 / 0 | 16 | 33 / 0 | 20 | 31.367 |
| normal-campaign | no-support | 20 | 33 / 18700 | 37 | 15679.4 / 1024 | 18 | 37 / 0 | 20 | 40.567 |
| normal-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 528.0 / 0 | 3 | 8 / 0 | 20 | 11.150 |
| normal-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 693.0 / 0 | 5 | 10 / 0 | 20 | 11.567 |
| normal-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 943.8 / 0 | 6 | 11 / 0 | 20 | 14.417 |
| normal-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 1090.6 / 0 | 6 | 11 / 0 | 20 | 14.933 |
| normal-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 1961.3 / 0 | 7 | 17 / 0 | 20 | 28.233 |
| normal-campaign | expansion-heavy | 6 | 10 / 7600 | 10 | 1287.6 / 0 | 3 | 10 / 0 | 20 | 10.167 |
| normal-campaign | expansion-heavy | 7 | 19 / 8900 | 19 | 2022.9 / 0 | 10 | 19 / 0 | 20 | 13.783 |
| normal-campaign | expansion-heavy | 8 | 10 / 9700 | 10 | 1313.4 / 0 | 2 | 10 / 0 | 20 | 10.433 |
| normal-campaign | expansion-heavy | 9 | 17 / 10000 | 17 | 2565.2 / 0 | 8 | 17 / 0 | 20 | 13.183 |
| normal-campaign | expansion-heavy | 10 | 16 / 13700 | 20 | 3721.3 / 0 | 11 | 20 / 0 | 20 | 22.017 |
| normal-campaign | expansion-heavy | 11 | 8 / 6500 | 8 | 1793.0 / 0 | 3 | 8 / 0 | 20 | 8.700 |
| normal-campaign | expansion-heavy | 12 | 18 / 10600 | 18 | 3352.0 / 0 | 7 | 18 / 0 | 20 | 13.167 |
| normal-campaign | expansion-heavy | 13 | 7 / 6700 | 7 | 1953.9 / 0 | 3 | 7 / 0 | 20 | 9.517 |
| normal-campaign | expansion-heavy | 14 | 15 / 9200 | 15 | 3709.2 / 0 | 6 | 15 / 0 | 20 | 15.017 |
| normal-campaign | expansion-heavy | 15 | 12 / 9400 | 12 | 4529.3 / 366 | 6 | 12 / 0 | 20 | 72.500 |
| normal-campaign | expansion-heavy | 16 | 15 / 12100 | 15 | 5093.0 / 0 | 7 | 15 / 0 | 20 | 16.667 |
| normal-campaign | expansion-heavy | 17 | 25 / 10500 | 25 | 7868.9 / 0 | 17 | 25 / 0 | 20 | 23.850 |
| normal-campaign | expansion-heavy | 18 | 17 / 8800 | 17 | 6771.6 / 439 | 11 | 16 / 1 | 15 | 86.817 |
| normal-campaign | expansion-heavy | 19 | 33 / 18700 | 33 | 10860.3 / 0 | 18 | 33 / 0 | 15 | 29.117 |
| normal-campaign | expansion-heavy | 20 | 33 / 18700 | 37 | 15679.4 / 1024 | 24 | 35 / 2 | 5 | 93.833 |
| normal-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 528.0 / 0 | 4 | 8 / 0 | 20 | 15.600 |
| normal-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 693.0 / 0 | 6 | 10 / 0 | 20 | 13.833 |
| normal-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 943.8 / 0 | 6 | 11 / 0 | 20 | 15.100 |
| normal-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 1090.6 / 0 | 6 | 11 / 0 | 20 | 15.333 |
| normal-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1961.3 / 0 | 7 | 17 / 0 | 20 | 24.667 |
| normal-campaign | upgrade-heavy | 6 | 10 / 7600 | 10 | 1287.6 / 0 | 4 | 10 / 0 | 20 | 11.783 |
| normal-campaign | upgrade-heavy | 7 | 19 / 8900 | 19 | 2022.9 / 0 | 13 | 19 / 0 | 20 | 19.650 |
| normal-campaign | upgrade-heavy | 8 | 10 / 9700 | 10 | 1313.4 / 0 | 3 | 10 / 0 | 20 | 11.367 |
| normal-campaign | upgrade-heavy | 9 | 17 / 10000 | 17 | 2565.2 / 0 | 9 | 17 / 0 | 20 | 17.517 |
| normal-campaign | upgrade-heavy | 10 | 16 / 13700 | 20 | 3721.3 / 0 | 11 | 20 / 0 | 20 | 23.750 |
| normal-campaign | upgrade-heavy | 11 | 8 / 6500 | 8 | 1793.0 / 0 | 3 | 8 / 0 | 20 | 9.600 |
| normal-campaign | upgrade-heavy | 12 | 18 / 10600 | 18 | 3352.0 / 0 | 9 | 18 / 0 | 20 | 17.317 |
| normal-campaign | upgrade-heavy | 13 | 7 / 6700 | 7 | 1953.9 / 0 | 3 | 7 / 0 | 20 | 9.383 |
| normal-campaign | upgrade-heavy | 14 | 15 / 9200 | 15 | 3709.2 / 0 | 7 | 15 / 0 | 20 | 16.250 |
| normal-campaign | upgrade-heavy | 15 | 12 / 9400 | 12 | 4529.3 / 366 | 7 | 12 / 0 | 20 | 19.533 |
| normal-campaign | upgrade-heavy | 16 | 15 / 12100 | 15 | 5093.0 / 0 | 7 | 15 / 0 | 20 | 19.000 |
| normal-campaign | upgrade-heavy | 17 | 25 / 10500 | 25 | 7868.9 / 0 | 15 | 25 / 0 | 20 | 22.450 |
| normal-campaign | upgrade-heavy | 18 | 17 / 8800 | 17 | 6771.6 / 439 | 11 | 17 / 0 | 20 | 21.233 |
| normal-campaign | upgrade-heavy | 19 | 33 / 18700 | 33 | 10860.3 / 0 | 16 | 33 / 0 | 20 | 30.233 |
| normal-campaign | upgrade-heavy | 20 | 33 / 18700 | 37 | 15679.4 / 1024 | 20 | 37 / 0 | 20 | 40.183 |
| normal-campaign | weak-placement | 1 | 8 / 8600 | 8 | 528.0 / 0 | 8 | 0 / 8 | 12 | 27.367 |
| normal-campaign | weak-placement | 2 | 10 / 6750 | 10 | 693.0 / 0 | 10 | 0 / 10 | 2 | 25.517 |
| normal-campaign | weak-placement | 3 | 11 / 7700 | 11 | 943.8 / 0 | 11 | 0 / 2 | 0 | 19.983 |
| normal-campaign | counter-aware | 1 | 8 / 8600 | 8 | 528.0 / 0 | 4 | 8 / 0 | 20 | 15.600 |
| normal-campaign | counter-aware | 2 | 10 / 6750 | 10 | 693.0 / 0 | 8 | 10 / 0 | 20 | 16.983 |
| normal-campaign | counter-aware | 3 | 11 / 7700 | 11 | 943.8 / 0 | 6 | 11 / 0 | 20 | 16.133 |
| normal-campaign | counter-aware | 4 | 11 / 7200 | 11 | 1090.6 / 0 | 7 | 11 / 0 | 20 | 16.017 |
| normal-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1961.3 / 0 | 11 | 17 / 0 | 20 | 25.417 |
| normal-campaign | counter-aware | 6 | 10 / 7600 | 10 | 1287.6 / 0 | 4 | 10 / 0 | 20 | 11.750 |
| normal-campaign | counter-aware | 7 | 19 / 8900 | 19 | 2022.9 / 0 | 11 | 19 / 0 | 20 | 17.850 |
| normal-campaign | counter-aware | 8 | 10 / 9700 | 10 | 1313.4 / 0 | 3 | 10 / 0 | 20 | 11.117 |
| normal-campaign | counter-aware | 9 | 17 / 10000 | 17 | 2565.2 / 0 | 9 | 17 / 0 | 20 | 18.100 |
| normal-campaign | counter-aware | 10 | 16 / 13700 | 20 | 3721.3 / 0 | 12 | 20 / 0 | 20 | 23.733 |
| normal-campaign | counter-aware | 11 | 8 / 6500 | 8 | 1793.0 / 0 | 4 | 8 / 0 | 20 | 11.567 |
| normal-campaign | counter-aware | 12 | 18 / 10600 | 18 | 3352.0 / 0 | 8 | 18 / 0 | 20 | 17.817 |
| normal-campaign | counter-aware | 13 | 7 / 6700 | 7 | 1953.9 / 0 | 3 | 7 / 0 | 20 | 10.067 |
| normal-campaign | counter-aware | 14 | 15 / 9200 | 15 | 3709.2 / 0 | 7 | 15 / 0 | 20 | 17.767 |
| normal-campaign | counter-aware | 15 | 12 / 9400 | 12 | 4529.3 / 366 | 7 | 12 / 0 | 20 | 20.050 |
| normal-campaign | counter-aware | 16 | 15 / 12100 | 15 | 5093.0 / 0 | 7 | 15 / 0 | 20 | 19.050 |
| normal-campaign | counter-aware | 17 | 25 / 10500 | 25 | 7868.9 / 0 | 16 | 25 / 0 | 20 | 22.333 |
| normal-campaign | counter-aware | 18 | 17 / 8800 | 17 | 6771.6 / 439 | 10 | 17 / 0 | 20 | 21.000 |
| normal-campaign | counter-aware | 19 | 33 / 18700 | 33 | 10860.3 / 0 | 14 | 33 / 0 | 20 | 29.000 |
| normal-campaign | counter-aware | 20 | 33 / 18700 | 37 | 15679.4 / 1024 | 18 | 37 / 0 | 20 | 39.750 |
| hard-campaign | existing | 1 | 8 / 8600 | 8 | 662.4 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | existing | 2 | 10 / 6750 | 10 | 869.4 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | existing | 3 | 11 / 7700 | 11 | 1184.0 / 0 | 8 | 11 / 0 | 20 | 17.367 |
| hard-campaign | existing | 4 | 11 / 7200 | 11 | 1368.3 / 0 | 7 | 11 / 0 | 20 | 17.333 |
| hard-campaign | existing | 5 | 13 / 8000 | 17 | 2460.5 / 0 | 7 | 17 / 0 | 20 | 28.383 |
| hard-campaign | existing | 6 | 10 / 7600 | 10 | 1615.3 / 0 | 7 | 10 / 0 | 20 | 15.650 |
| hard-campaign | existing | 7 | 19 / 8900 | 19 | 2537.8 / 0 | 12 | 19 / 0 | 20 | 19.033 |
| hard-campaign | existing | 8 | 10 / 9700 | 10 | 1647.7 / 0 | 3 | 10 / 0 | 20 | 11.983 |
| hard-campaign | existing | 9 | 17 / 10000 | 17 | 3218.2 / 0 | 10 | 17 / 0 | 20 | 17.983 |
| hard-campaign | existing | 10 | 16 / 13700 | 20 | 4668.5 / 0 | 12 | 20 / 0 | 20 | 26.533 |
| hard-campaign | existing | 11 | 8 / 6500 | 8 | 2249.4 / 0 | 5 | 8 / 0 | 20 | 13.383 |
| hard-campaign | existing | 12 | 18 / 10600 | 18 | 4205.2 / 0 | 9 | 18 / 0 | 20 | 18.733 |
| hard-campaign | existing | 13 | 7 / 6700 | 7 | 2451.2 / 0 | 3 | 7 / 0 | 20 | 11.517 |
| hard-campaign | existing | 14 | 15 / 9200 | 15 | 4653.4 / 0 | 9 | 15 / 0 | 20 | 18.900 |
| hard-campaign | existing | 15 | 12 / 9400 | 12 | 5682.1 / 459 | 7 | 12 / 0 | 20 | 23.350 |
| hard-campaign | existing | 16 | 15 / 12100 | 15 | 6389.4 / 0 | 7 | 15 / 0 | 20 | 19.283 |
| hard-campaign | existing | 17 | 25 / 10500 | 25 | 9871.8 / 0 | 17 | 25 / 0 | 20 | 23.917 |
| hard-campaign | existing | 18 | 17 / 8800 | 17 | 8495.3 / 551 | 11 | 17 / 0 | 20 | 24.133 |
| hard-campaign | existing | 19 | 33 / 18700 | 33 | 13624.7 / 0 | 17 | 33 / 0 | 20 | 30.150 |
| hard-campaign | existing | 20 | 33 / 18700 | 37 | 19670.5 / 1284 | 20 | 37 / 0 | 20 | 41.450 |
| hard-campaign | firewall-only | 1 | 8 / 8600 | 8 | 662.4 / 0 | 4 | 8 / 0 | 20 | 14.983 |
| hard-campaign | firewall-only | 2 | 10 / 6750 | 10 | 869.4 / 0 | 7 | 10 / 0 | 20 | 15.300 |
| hard-campaign | firewall-only | 3 | 11 / 7700 | 11 | 1184.0 / 0 | 6 | 11 / 0 | 20 | 15.000 |
| hard-campaign | firewall-only | 4 | 11 / 7200 | 11 | 1368.3 / 0 | 7 | 11 / 0 | 20 | 18.067 |
| hard-campaign | firewall-only | 5 | 13 / 8000 | 17 | 2460.5 / 0 | 7 | 17 / 0 | 20 | 27.450 |
| hard-campaign | firewall-only | 6 | 10 / 7600 | 10 | 1615.3 / 0 | 6 | 10 / 0 | 20 | 15.800 |
| hard-campaign | firewall-only | 7 | 19 / 8900 | 19 | 2537.8 / 0 | 11 | 19 / 0 | 20 | 18.533 |
| hard-campaign | firewall-only | 8 | 10 / 9700 | 10 | 1647.7 / 0 | 3 | 10 / 0 | 20 | 11.300 |
| hard-campaign | firewall-only | 9 | 17 / 10000 | 17 | 3218.2 / 0 | 10 | 17 / 0 | 20 | 19.767 |
| hard-campaign | firewall-only | 10 | 16 / 13700 | 20 | 4668.5 / 0 | 11 | 20 / 0 | 20 | 23.517 |
| hard-campaign | firewall-only | 11 | 8 / 6500 | 8 | 2249.4 / 0 | 4 | 8 / 0 | 20 | 12.600 |
| hard-campaign | firewall-only | 12 | 18 / 10600 | 18 | 4205.2 / 0 | 9 | 18 / 0 | 20 | 18.950 |
| hard-campaign | firewall-only | 13 | 7 / 6700 | 7 | 2451.2 / 0 | 4 | 7 / 0 | 20 | 13.417 |
| hard-campaign | firewall-only | 14 | 15 / 9200 | 15 | 4653.4 / 0 | 9 | 15 / 0 | 20 | 19.517 |
| hard-campaign | firewall-only | 15 | 12 / 9400 | 12 | 5682.1 / 459 | 8 | 12 / 0 | 20 | 24.550 |
| hard-campaign | firewall-only | 16 | 15 / 12100 | 15 | 6389.4 / 0 | 9 | 15 / 0 | 20 | 20.267 |
| hard-campaign | firewall-only | 17 | 25 / 10500 | 25 | 9871.8 / 0 | 18 | 25 / 0 | 20 | 25.383 |
| hard-campaign | firewall-only | 18 | 17 / 8800 | 17 | 8495.3 / 551 | 12 | 17 / 0 | 20 | 27.200 |
| hard-campaign | firewall-only | 19 | 33 / 18700 | 33 | 13624.7 / 0 | 18 | 33 / 0 | 20 | 32.217 |
| hard-campaign | firewall-only | 20 | 33 / 18700 | 37 | 19670.5 / 1284 | 21 | 36 / 1 | 19 | 41.700 |
| hard-campaign | no-support | 1 | 8 / 8600 | 8 | 662.4 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | no-support | 2 | 10 / 6750 | 10 | 869.4 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | no-support | 3 | 11 / 7700 | 11 | 1184.0 / 0 | 8 | 11 / 0 | 20 | 17.367 |
| hard-campaign | no-support | 4 | 11 / 7200 | 11 | 1368.3 / 0 | 7 | 11 / 0 | 20 | 17.117 |
| hard-campaign | no-support | 5 | 13 / 8000 | 17 | 2460.5 / 0 | 7 | 17 / 0 | 20 | 29.683 |
| hard-campaign | no-support | 6 | 10 / 7600 | 10 | 1615.3 / 0 | 7 | 10 / 0 | 20 | 16.433 |
| hard-campaign | no-support | 7 | 19 / 8900 | 19 | 2537.8 / 0 | 13 | 19 / 0 | 20 | 19.433 |
| hard-campaign | no-support | 8 | 10 / 9700 | 10 | 1647.7 / 0 | 3 | 10 / 0 | 20 | 12.117 |
| hard-campaign | no-support | 9 | 17 / 10000 | 17 | 3218.2 / 0 | 10 | 17 / 0 | 20 | 21.067 |
| hard-campaign | no-support | 10 | 16 / 13700 | 20 | 4668.5 / 0 | 11 | 20 / 0 | 20 | 26.900 |
| hard-campaign | no-support | 11 | 8 / 6500 | 8 | 2249.4 / 0 | 5 | 8 / 0 | 20 | 13.417 |
| hard-campaign | no-support | 12 | 18 / 10600 | 18 | 4205.2 / 0 | 10 | 18 / 0 | 20 | 19.633 |
| hard-campaign | no-support | 13 | 7 / 6700 | 7 | 2451.2 / 0 | 3 | 7 / 0 | 20 | 11.833 |
| hard-campaign | no-support | 14 | 15 / 9200 | 15 | 4653.4 / 0 | 10 | 15 / 0 | 20 | 19.783 |
| hard-campaign | no-support | 15 | 12 / 9400 | 12 | 5682.1 / 459 | 8 | 12 / 0 | 20 | 24.933 |
| hard-campaign | no-support | 16 | 15 / 12100 | 15 | 6389.4 / 0 | 9 | 15 / 0 | 20 | 19.833 |
| hard-campaign | no-support | 17 | 25 / 10500 | 25 | 9871.8 / 0 | 18 | 25 / 0 | 20 | 24.617 |
| hard-campaign | no-support | 18 | 17 / 8800 | 17 | 8495.3 / 551 | 13 | 17 / 0 | 20 | 26.417 |
| hard-campaign | no-support | 19 | 33 / 18700 | 33 | 13624.7 / 0 | 17 | 33 / 0 | 20 | 31.183 |
| hard-campaign | no-support | 20 | 33 / 18700 | 37 | 19670.5 / 1284 | 20 | 37 / 0 | 20 | 41.683 |
| hard-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 662.4 / 0 | 3 | 8 / 0 | 20 | 11.183 |
| hard-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 869.4 / 0 | 5 | 10 / 0 | 20 | 11.933 |
| hard-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 1184.0 / 0 | 6 | 11 / 0 | 20 | 15.033 |
| hard-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 1368.3 / 0 | 6 | 11 / 0 | 20 | 15.067 |
| hard-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 2460.5 / 0 | 7 | 17 / 0 | 20 | 35.067 |
| hard-campaign | expansion-heavy | 6 | 10 / 7600 | 10 | 1615.3 / 0 | 4 | 10 / 0 | 20 | 11.067 |
| hard-campaign | expansion-heavy | 7 | 19 / 8900 | 19 | 2537.8 / 0 | 10 | 19 / 0 | 20 | 13.783 |
| hard-campaign | expansion-heavy | 8 | 10 / 9700 | 10 | 1647.7 / 0 | 3 | 10 / 0 | 20 | 10.800 |
| hard-campaign | expansion-heavy | 9 | 17 / 10000 | 17 | 3218.2 / 0 | 8 | 17 / 0 | 20 | 13.583 |
| hard-campaign | expansion-heavy | 10 | 16 / 13700 | 20 | 4668.5 / 0 | 13 | 20 / 0 | 20 | 25.767 |
| hard-campaign | expansion-heavy | 11 | 8 / 6500 | 8 | 2249.4 / 0 | 4 | 8 / 0 | 20 | 9.633 |
| hard-campaign | expansion-heavy | 12 | 18 / 10600 | 18 | 4205.2 / 0 | 9 | 18 / 0 | 20 | 14.533 |
| hard-campaign | expansion-heavy | 13 | 7 / 6700 | 7 | 2451.2 / 0 | 3 | 7 / 0 | 20 | 9.867 |
| hard-campaign | expansion-heavy | 14 | 15 / 9200 | 15 | 4653.4 / 0 | 7 | 15 / 0 | 20 | 15.767 |
| hard-campaign | expansion-heavy | 15 | 12 / 9400 | 12 | 5682.1 / 459 | 7 | 11 / 1 | 13 | 72.200 |
| hard-campaign | expansion-heavy | 16 | 15 / 12100 | 15 | 6389.4 / 0 | 9 | 15 / 0 | 13 | 19.150 |
| hard-campaign | expansion-heavy | 17 | 25 / 10500 | 25 | 9871.8 / 0 | 17 | 25 / 0 | 13 | 24.183 |
| hard-campaign | expansion-heavy | 18 | 17 / 8800 | 17 | 8495.3 / 551 | 13 | 16 / 1 | 6 | 79.183 |
| hard-campaign | expansion-heavy | 19 | 33 / 18700 | 33 | 13624.7 / 0 | 19 | 33 / 0 | 6 | 31.250 |
| hard-campaign | expansion-heavy | 20 | 33 / 18700 | 37 | 19670.5 / 1284 | 24 | 35 / 1 | 0 | 72.183 |
| hard-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 662.4 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 869.4 / 0 | 7 | 10 / 0 | 20 | 15.267 |
| hard-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 1184.0 / 0 | 8 | 11 / 0 | 20 | 17.367 |
| hard-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 1368.3 / 0 | 7 | 11 / 0 | 20 | 15.717 |
| hard-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 2460.5 / 0 | 7 | 17 / 0 | 20 | 29.183 |
| hard-campaign | upgrade-heavy | 6 | 10 / 7600 | 10 | 1615.3 / 0 | 6 | 10 / 0 | 20 | 16.183 |
| hard-campaign | upgrade-heavy | 7 | 19 / 8900 | 19 | 2537.8 / 0 | 13 | 19 / 0 | 20 | 19.433 |
| hard-campaign | upgrade-heavy | 8 | 10 / 9700 | 10 | 1647.7 / 0 | 3 | 10 / 0 | 20 | 12.117 |
| hard-campaign | upgrade-heavy | 9 | 17 / 10000 | 17 | 3218.2 / 0 | 12 | 17 / 0 | 20 | 20.767 |
| hard-campaign | upgrade-heavy | 10 | 16 / 13700 | 20 | 4668.5 / 0 | 12 | 20 / 0 | 20 | 25.167 |
| hard-campaign | upgrade-heavy | 11 | 8 / 6500 | 8 | 2249.4 / 0 | 5 | 8 / 0 | 20 | 14.000 |
| hard-campaign | upgrade-heavy | 12 | 18 / 10600 | 18 | 4205.2 / 0 | 10 | 18 / 0 | 20 | 18.983 |
| hard-campaign | upgrade-heavy | 13 | 7 / 6700 | 7 | 2451.2 / 0 | 3 | 7 / 0 | 20 | 10.167 |
| hard-campaign | upgrade-heavy | 14 | 15 / 9200 | 15 | 4653.4 / 0 | 7 | 15 / 0 | 20 | 17.383 |
| hard-campaign | upgrade-heavy | 15 | 12 / 9400 | 12 | 5682.1 / 459 | 6 | 12 / 0 | 20 | 22.533 |
| hard-campaign | upgrade-heavy | 16 | 15 / 12100 | 15 | 6389.4 / 0 | 8 | 15 / 0 | 20 | 19.133 |
| hard-campaign | upgrade-heavy | 17 | 25 / 10500 | 25 | 9871.8 / 0 | 17 | 25 / 0 | 20 | 23.667 |
| hard-campaign | upgrade-heavy | 18 | 17 / 8800 | 17 | 8495.3 / 551 | 11 | 17 / 0 | 20 | 23.850 |
| hard-campaign | upgrade-heavy | 19 | 33 / 18700 | 33 | 13624.7 / 0 | 17 | 33 / 0 | 20 | 30.867 |
| hard-campaign | upgrade-heavy | 20 | 33 / 18700 | 37 | 19670.5 / 1284 | 21 | 37 / 0 | 20 | 42.017 |
| hard-campaign | weak-placement | 1 | 8 / 8600 | 8 | 662.4 / 0 | 8 | 0 / 8 | 12 | 25.567 |
| hard-campaign | weak-placement | 2 | 10 / 6750 | 10 | 869.4 / 0 | 10 | 0 / 10 | 2 | 23.717 |
| hard-campaign | weak-placement | 3 | 11 / 7700 | 11 | 1184.0 / 0 | 11 | 0 / 2 | 0 | 18.183 |
| hard-campaign | counter-aware | 1 | 8 / 8600 | 8 | 662.4 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | counter-aware | 2 | 10 / 6750 | 10 | 869.4 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | counter-aware | 3 | 11 / 7700 | 11 | 1184.0 / 0 | 8 | 11 / 0 | 20 | 17.367 |
| hard-campaign | counter-aware | 4 | 11 / 7200 | 11 | 1368.3 / 0 | 7 | 11 / 0 | 20 | 17.333 |
| hard-campaign | counter-aware | 5 | 13 / 8000 | 17 | 2460.5 / 0 | 7 | 17 / 0 | 20 | 28.383 |
| hard-campaign | counter-aware | 6 | 10 / 7600 | 10 | 1615.3 / 0 | 7 | 10 / 0 | 20 | 15.650 |
| hard-campaign | counter-aware | 7 | 19 / 8900 | 19 | 2537.8 / 0 | 12 | 19 / 0 | 20 | 19.033 |
| hard-campaign | counter-aware | 8 | 10 / 9700 | 10 | 1647.7 / 0 | 3 | 10 / 0 | 20 | 11.983 |
| hard-campaign | counter-aware | 9 | 17 / 10000 | 17 | 3218.2 / 0 | 10 | 17 / 0 | 20 | 17.983 |
| hard-campaign | counter-aware | 10 | 16 / 13700 | 20 | 4668.5 / 0 | 12 | 20 / 0 | 20 | 26.533 |
| hard-campaign | counter-aware | 11 | 8 / 6500 | 8 | 2249.4 / 0 | 5 | 8 / 0 | 20 | 13.383 |
| hard-campaign | counter-aware | 12 | 18 / 10600 | 18 | 4205.2 / 0 | 9 | 18 / 0 | 20 | 18.733 |
| hard-campaign | counter-aware | 13 | 7 / 6700 | 7 | 2451.2 / 0 | 3 | 7 / 0 | 20 | 11.517 |
| hard-campaign | counter-aware | 14 | 15 / 9200 | 15 | 4653.4 / 0 | 9 | 15 / 0 | 20 | 18.900 |
| hard-campaign | counter-aware | 15 | 12 / 9400 | 12 | 5682.1 / 459 | 7 | 12 / 0 | 20 | 23.350 |
| hard-campaign | counter-aware | 16 | 15 / 12100 | 15 | 6389.4 / 0 | 7 | 15 / 0 | 20 | 19.283 |
| hard-campaign | counter-aware | 17 | 25 / 10500 | 25 | 9871.8 / 0 | 17 | 25 / 0 | 20 | 23.917 |
| hard-campaign | counter-aware | 18 | 17 / 8800 | 17 | 8495.3 / 551 | 11 | 17 / 0 | 20 | 24.133 |
| hard-campaign | counter-aware | 19 | 33 / 18700 | 33 | 13624.7 / 0 | 17 | 33 / 0 | 20 | 30.150 |
| hard-campaign | counter-aware | 20 | 33 / 18700 | 37 | 19670.5 / 1284 | 20 | 37 / 0 | 20 | 41.450 |
