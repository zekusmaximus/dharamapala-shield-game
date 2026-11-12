# Scripted balance results

Generated from results.json by tools/balance/summary.mjs. Resources are Dharma/Bandwidth/Anonymity. Time is simulated wave time, excluding preparation and report CPU time. These are fixed-policy observations, not human difficulty or win rates.

| Scenario | Policy | Outcome (last played wave) | Lives / leaks | Boss killed/leaked/unresolved | Seconds | End resources | Spent | Bounty | Clear (includes passive) | Passive Dharma |
|---|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 389.683 | 2634/4549/0 | 10083/1062/0 | 8655/4398/0 | 3932/1153/0 | 102 |
| easy-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 382.250 | 2307/5611/0 | 10308/0/0 | 8655/4398/0 | 3830/1153/0 | 0 |
| easy-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 400.167 | 2602/4609/0 | 10013/1002/0 | 8655/4398/0 | 3830/1153/0 | 0 |
| easy-campaign | expansion-heavy | VICTORY (20) | 16 / 1 | 6/1/0 | 521.100 | 8996/5487/0 | 3360/0/0 | 8396/4274/0 | 3830/1153/0 | 0 |
| easy-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 389.833 | 2231/4609/0 | 10384/1002/0 | 8655/4398/0 | 3830/1153/0 | 0 |
| easy-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 85.467 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| easy-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 389.683 | 2634/4549/0 | 10083/1062/0 | 8655/4398/0 | 3932/1153/0 | 102 |
| normal-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 412.883 | 1987/3942/0 | 9649/1062/0 | 7574/3791/0 | 3932/1153/0 | 102 |
| normal-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 403.967 | 2094/5004/0 | 9440/0/0 | 7574/3791/0 | 3830/1153/0 | 0 |
| normal-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 432.100 | 2389/4002/0 | 9145/1002/0 | 7574/3791/0 | 3830/1153/0 | 0 |
| normal-campaign | expansion-heavy | VICTORY (20) | 10 / 2 | 5/2/0 | 545.200 | 7724/4788/0 | 3360/0/0 | 7124/3575/0 | 3830/1153/0 | 0 |
| normal-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 406.767 | 1979/4002/0 | 9555/1002/0 | 7574/3791/0 | 3830/1153/0 | 0 |
| normal-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 75.117 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| normal-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 412.883 | 1987/3942/0 | 9649/1062/0 | 7574/3791/0 | 3932/1153/0 | 102 |
| hard-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 458.500 | 2104/3434/0 | 8347/1062/0 | 6389/3283/0 | 3932/1153/0 | 102 |
| hard-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 448.800 | 1777/4496/0 | 8572/0/0 | 6389/3283/0 | 3830/1153/0 | 0 |
| hard-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 477.750 | 2072/3494/0 | 8277/1002/0 | 6389/3283/0 | 3830/1153/0 | 0 |
| hard-campaign | expansion-heavy | GAME_OVER (20) | 0 / 4 | 2/4/1 | 554.367 | 5743/3965/0 | 3360/0/0 | 5533/2869/0 | 3440/1036/0 | 0 |
| hard-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 448.967 | 1951/4000/0 | 8398/496/0 | 6389/3283/0 | 3830/1153/0 | 0 |
| hard-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 67.467 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| hard-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 458.500 | 2104/3434/0 | 8347/1062/0 | 6389/3283/0 | 3932/1153/0 | 102 |

## Observed tower activity

Aggregated by type; detailed per-wave tower IDs, levels, positions and typed leak coverage are in results.json. Health/shield removal and final hits do not allocate causal benefit from status or support. Aura-present shots may overlap.

| Scenario | Policy | Type | Health removed | Shield removed | Final hits | Shots | Slow applications | Vulnerability applications | Aura-present shots |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | encryption | 5706.537 | 124.466 | 61 | 413 | 203 | 203 | 0 |
| easy-campaign | existing | firewall | 48648.400 | 1479.632 | 258 | 1259 | 0 | 0 | 0 |
| easy-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 705 |
| easy-campaign | firewall-only | firewall | 54354.938 | 1561.976 | 319 | 1460 | 0 | 0 | 0 |
| easy-campaign | no-support | encryption | 5752.745 | 86.795 | 65 | 388 | 205 | 205 | 0 |
| easy-campaign | no-support | firewall | 48602.192 | 1562.205 | 254 | 1198 | 0 | 0 | 0 |
| easy-campaign | expansion-heavy | firewall | 54081.438 | 1615 | 318 | 10504 | 0 | 0 | 0 |
| easy-campaign | upgrade-heavy | encryption | 4599.084 | 93.095 | 51 | 354 | 169 | 169 | 0 |
| easy-campaign | upgrade-heavy | firewall | 49755.853 | 1481.905 | 268 | 1464 | 0 | 0 | 0 |
| easy-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| easy-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| easy-campaign | counter-aware | encryption | 5706.537 | 124.466 | 61 | 413 | 203 | 203 | 0 |
| easy-campaign | counter-aware | firewall | 48648.400 | 1479.632 | 258 | 1259 | 0 | 0 | 0 |
| easy-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 705 |
| normal-campaign | existing | encryption | 7936.412 | 263.989 | 45 | 457 | 268 | 268 | 0 |
| normal-campaign | existing | firewall | 64536.838 | 2133.461 | 274 | 1423 | 0 | 0 | 0 |
| normal-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 813 |
| normal-campaign | firewall-only | firewall | 72473.250 | 2200.114 | 319 | 1704 | 0 | 0 | 0 |
| normal-campaign | no-support | encryption | 7632.100 | 291.711 | 43 | 437 | 259 | 259 | 0 |
| normal-campaign | no-support | firewall | 64841.150 | 2277.289 | 276 | 1396 | 0 | 0 | 0 |
| normal-campaign | expansion-heavy | firewall | 70978.250 | 2143 | 317 | 11938 | 0 | 0 | 0 |
| normal-campaign | upgrade-heavy | encryption | 6590.960 | 140.793 | 39 | 389 | 238 | 238 | 0 |
| normal-campaign | upgrade-heavy | firewall | 65882.290 | 1889.207 | 280 | 1684 | 0 | 0 | 0 |
| normal-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| normal-campaign | weak-placement | firewall | 134 | 0 | 0 | 6 | 0 | 0 | 0 |
| normal-campaign | counter-aware | encryption | 7936.412 | 263.989 | 45 | 457 | 268 | 268 | 0 |
| normal-campaign | counter-aware | firewall | 64536.838 | 2133.461 | 274 | 1423 | 0 | 0 | 0 |
| normal-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 813 |
| hard-campaign | existing | encryption | 9594.215 | 423.793 | 50 | 509 | 333 | 333 | 0 |
| hard-campaign | existing | firewall | 88244.673 | 3294.207 | 269 | 1827 | 0 | 0 | 0 |
| hard-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1140 |
| hard-campaign | firewall-only | firewall | 97838.888 | 3647.800 | 319 | 2132 | 0 | 0 | 0 |
| hard-campaign | no-support | encryption | 9807.294 | 520.269 | 46 | 483 | 336 | 336 | 0 |
| hard-campaign | no-support | firewall | 88031.594 | 3109.751 | 273 | 1875 | 0 | 0 | 0 |
| hard-campaign | expansion-heavy | firewall | 93378.387 | 2576 | 314 | 13017 | 0 | 0 | 0 |
| hard-campaign | upgrade-heavy | encryption | 7878.126 | 429.073 | 38 | 440 | 290 | 290 | 0 |
| hard-campaign | upgrade-heavy | firewall | 89960.762 | 3414.488 | 281 | 2031 | 0 | 0 | 0 |
| hard-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hard-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| hard-campaign | counter-aware | encryption | 9594.215 | 423.793 | 50 | 509 | 333 | 333 | 0 |
| hard-campaign | counter-aware | firewall | 88244.673 | 3294.207 | 269 | 1827 | 0 | 0 | 0 |
| hard-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1140 |

## Wave pressure and outcomes

Authored count/due time excludes dynamic Raid reinforcements. Spawn HP and initial shield sum actual production spawns (including reinforcements); neither is a damage requirement or a scalar difficulty score. Peak live count is observed on each spawn. Defeat can leave authored spawns unreleased and live enemies unresolved.

| Scenario | Policy | Wave | Authored count / last due ms | Actual spawns | Spawn HP / initial shield | Peak alive | Kills / leaks | Lives after | Seconds |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | existing | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 14.650 |
| easy-campaign | existing | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.517 |
| easy-campaign | existing | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 13.267 |
| easy-campaign | existing | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 25.750 |
| easy-campaign | existing | 6 | 10 / 10000 | 10 | 877.9 / 0 | 3 | 10 / 0 | 20 | 11.367 |
| easy-campaign | existing | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 18.217 |
| easy-campaign | existing | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.567 |
| easy-campaign | existing | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | existing | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 21.700 |
| easy-campaign | existing | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 1 | 8 / 0 | 20 | 10.317 |
| easy-campaign | existing | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.283 |
| easy-campaign | existing | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 11.267 |
| easy-campaign | existing | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.650 |
| easy-campaign | existing | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 14.733 |
| easy-campaign | existing | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 2 | 15 / 0 | 20 | 18.883 |
| easy-campaign | existing | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 26.300 |
| easy-campaign | existing | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 2 | 17 / 0 | 20 | 22.633 |
| easy-campaign | existing | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 4 | 33 / 0 | 20 | 32.600 |
| easy-campaign | existing | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 9 | 37 / 0 | 20 | 51.267 |
| easy-campaign | firewall-only | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 11.267 |
| easy-campaign | firewall-only | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.917 |
| easy-campaign | firewall-only | 3 | 11 / 7700 | 11 | 643.5 / 0 | 5 | 11 / 0 | 20 | 12.567 |
| easy-campaign | firewall-only | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 12.533 |
| easy-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 25.017 |
| easy-campaign | firewall-only | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 11.633 |
| easy-campaign | firewall-only | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 3 | 19 / 0 | 20 | 17.633 |
| easy-campaign | firewall-only | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.633 |
| easy-campaign | firewall-only | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | firewall-only | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 12 | 20 / 0 | 20 | 23.450 |
| easy-campaign | firewall-only | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.517 |
| easy-campaign | firewall-only | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.433 |
| easy-campaign | firewall-only | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 1 | 7 / 0 | 20 | 11.083 |
| easy-campaign | firewall-only | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.667 |
| easy-campaign | firewall-only | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 16.317 |
| easy-campaign | firewall-only | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.517 |
| easy-campaign | firewall-only | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 26.350 |
| easy-campaign | firewall-only | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 2 | 17 / 0 | 20 | 23.167 |
| easy-campaign | firewall-only | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 6 | 33 / 0 | 20 | 32.283 |
| easy-campaign | firewall-only | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 9 | 37 / 0 | 20 | 49.000 |
| easy-campaign | no-support | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | no-support | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 14.650 |
| easy-campaign | no-support | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.517 |
| easy-campaign | no-support | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 13.950 |
| easy-campaign | no-support | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 27.283 |
| easy-campaign | no-support | 6 | 10 / 10000 | 10 | 877.9 / 0 | 3 | 10 / 0 | 20 | 11.717 |
| easy-campaign | no-support | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 18.217 |
| easy-campaign | no-support | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.567 |
| easy-campaign | no-support | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | no-support | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 11 | 20 / 0 | 20 | 24.017 |
| easy-campaign | no-support | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 1 | 8 / 0 | 20 | 10.317 |
| easy-campaign | no-support | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.233 |
| easy-campaign | no-support | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 1 | 7 / 0 | 20 | 11.267 |
| easy-campaign | no-support | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.617 |
| easy-campaign | no-support | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 18.483 |
| easy-campaign | no-support | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.933 |
| easy-campaign | no-support | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 26.717 |
| easy-campaign | no-support | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 23.517 |
| easy-campaign | no-support | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 5 | 33 / 0 | 20 | 32.533 |
| easy-campaign | no-support | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 9 | 37 / 0 | 20 | 50.917 |
| easy-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 360.0 / 0 | 2 | 8 / 0 | 20 | 10.417 |
| easy-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.933 |
| easy-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 643.5 / 0 | 5 | 11 / 0 | 20 | 10.867 |
| easy-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 12.317 |
| easy-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 24.700 |
| easy-campaign | expansion-heavy | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 10.483 |
| easy-campaign | expansion-heavy | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 17.117 |
| easy-campaign | expansion-heavy | 8 | 10 / 10000 | 10 | 895.5 / 0 | 1 | 10 / 0 | 20 | 11.133 |
| easy-campaign | expansion-heavy | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 2 | 17 / 0 | 20 | 19.133 |
| easy-campaign | expansion-heavy | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 17.467 |
| easy-campaign | expansion-heavy | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 1 | 8 / 0 | 20 | 9.667 |
| easy-campaign | expansion-heavy | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 18.583 |
| easy-campaign | expansion-heavy | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 1 | 7 / 0 | 20 | 10.917 |
| easy-campaign | expansion-heavy | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.433 |
| easy-campaign | expansion-heavy | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 55.383 |
| easy-campaign | expansion-heavy | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.483 |
| easy-campaign | expansion-heavy | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 27.717 |
| easy-campaign | expansion-heavy | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 4 | 17 / 0 | 20 | 76.500 |
| easy-campaign | expansion-heavy | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 6 | 33 / 0 | 20 | 34.200 |
| easy-campaign | expansion-heavy | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 27 | 36 / 1 | 16 | 105.650 |
| easy-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.933 |
| easy-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.317 |
| easy-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 743.6 / 0 | 5 | 11 / 0 | 20 | 12.317 |
| easy-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 25.400 |
| easy-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 10.917 |
| easy-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 3 | 19 / 0 | 20 | 17.483 |
| easy-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.450 |
| easy-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 12 | 20 / 0 | 20 | 24.867 |
| easy-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.317 |
| easy-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.233 |
| easy-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 1 | 7 / 0 | 20 | 11.717 |
| easy-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.617 |
| easy-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 14.217 |
| easy-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.183 |
| easy-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 26.517 |
| easy-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 24.167 |
| easy-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 7 | 33 / 0 | 20 | 33.533 |
| easy-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 11 | 37 / 0 | 20 | 51.933 |
| easy-campaign | weak-placement | 1 | 8 / 8600 | 8 | 360.0 / 0 | 8 | 0 / 8 | 12 | 31.567 |
| easy-campaign | weak-placement | 2 | 10 / 6750 | 10 | 472.5 / 0 | 10 | 0 / 10 | 2 | 29.717 |
| easy-campaign | weak-placement | 3 | 11 / 7700 | 11 | 643.5 / 0 | 11 | 0 / 2 | 0 | 24.183 |
| easy-campaign | counter-aware | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | counter-aware | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 14.650 |
| easy-campaign | counter-aware | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 15.517 |
| easy-campaign | counter-aware | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 13.267 |
| easy-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 25.750 |
| easy-campaign | counter-aware | 6 | 10 / 10000 | 10 | 877.9 / 0 | 3 | 10 / 0 | 20 | 11.367 |
| easy-campaign | counter-aware | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 18.217 |
| easy-campaign | counter-aware | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.567 |
| easy-campaign | counter-aware | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | counter-aware | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 21.700 |
| easy-campaign | counter-aware | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 1 | 8 / 0 | 20 | 10.317 |
| easy-campaign | counter-aware | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.283 |
| easy-campaign | counter-aware | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 11.267 |
| easy-campaign | counter-aware | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.650 |
| easy-campaign | counter-aware | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 14.733 |
| easy-campaign | counter-aware | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 2 | 15 / 0 | 20 | 18.883 |
| easy-campaign | counter-aware | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 26.300 |
| easy-campaign | counter-aware | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 2 | 17 / 0 | 20 | 22.633 |
| easy-campaign | counter-aware | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 4 | 33 / 0 | 20 | 32.600 |
| easy-campaign | counter-aware | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 9 | 37 / 0 | 20 | 51.267 |
| normal-campaign | existing | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | existing | 2 | 10 / 6750 | 10 | 630.0 / 0 | 8 | 10 / 0 | 20 | 16.667 |
| normal-campaign | existing | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.850 |
| normal-campaign | existing | 4 | 11 / 7200 | 11 | 991.5 / 0 | 7 | 11 / 0 | 20 | 16.233 |
| normal-campaign | existing | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 27.117 |
| normal-campaign | existing | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.467 |
| normal-campaign | existing | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 5 | 19 / 0 | 20 | 19.500 |
| normal-campaign | existing | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 12.283 |
| normal-campaign | existing | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 19.867 |
| normal-campaign | existing | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 26.100 |
| normal-campaign | existing | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.500 |
| normal-campaign | existing | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.417 |
| normal-campaign | existing | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 1 | 7 / 0 | 20 | 11.617 |
| normal-campaign | existing | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 19.050 |
| normal-campaign | existing | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 16.600 |
| normal-campaign | existing | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 3 | 15 / 0 | 20 | 19.967 |
| normal-campaign | existing | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 4 | 25 / 0 | 20 | 27.267 |
| normal-campaign | existing | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 3 | 17 / 0 | 20 | 24.000 |
| normal-campaign | existing | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 6 | 33 / 0 | 20 | 32.617 |
| normal-campaign | existing | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 10 | 37 / 0 | 20 | 51.100 |
| normal-campaign | firewall-only | 1 | 8 / 8600 | 8 | 480.0 / 0 | 3 | 8 / 0 | 20 | 11.167 |
| normal-campaign | firewall-only | 2 | 10 / 6750 | 10 | 630.0 / 0 | 5 | 10 / 0 | 20 | 10.817 |
| normal-campaign | firewall-only | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 14.067 |
| normal-campaign | firewall-only | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.750 |
| normal-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 25.117 |
| normal-campaign | firewall-only | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 3 | 10 / 0 | 20 | 11.400 |
| normal-campaign | firewall-only | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 17.783 |
| normal-campaign | firewall-only | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 11.717 |
| normal-campaign | firewall-only | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 19.717 |
| normal-campaign | firewall-only | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 13 | 20 / 0 | 20 | 25.550 |
| normal-campaign | firewall-only | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.683 |
| normal-campaign | firewall-only | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 4 | 18 / 0 | 20 | 19.367 |
| normal-campaign | firewall-only | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 1 | 7 / 0 | 20 | 11.200 |
| normal-campaign | firewall-only | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 18.967 |
| normal-campaign | firewall-only | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 21.883 |
| normal-campaign | firewall-only | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 4 | 15 / 0 | 20 | 21.600 |
| normal-campaign | firewall-only | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 5 | 25 / 0 | 20 | 26.650 |
| normal-campaign | firewall-only | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 3 | 17 / 0 | 20 | 25.333 |
| normal-campaign | firewall-only | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 6 | 33 / 0 | 20 | 32.967 |
| normal-campaign | firewall-only | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 11 | 37 / 0 | 20 | 53.233 |
| normal-campaign | no-support | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | no-support | 2 | 10 / 6750 | 10 | 630.0 / 0 | 8 | 10 / 0 | 20 | 16.667 |
| normal-campaign | no-support | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.850 |
| normal-campaign | no-support | 4 | 11 / 7200 | 11 | 991.5 / 0 | 7 | 11 / 0 | 20 | 16.267 |
| normal-campaign | no-support | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 7 | 17 / 0 | 20 | 28.600 |
| normal-campaign | no-support | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 5 | 10 / 0 | 20 | 16.650 |
| normal-campaign | no-support | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 4 | 19 / 0 | 20 | 18.333 |
| normal-campaign | no-support | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 12.283 |
| normal-campaign | no-support | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 20.283 |
| normal-campaign | no-support | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 10 | 20 / 0 | 20 | 28.117 |
| normal-campaign | no-support | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.700 |
| normal-campaign | no-support | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.417 |
| normal-campaign | no-support | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 2 | 7 / 0 | 20 | 11.617 |
| normal-campaign | no-support | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 19.050 |
| normal-campaign | no-support | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 20.433 |
| normal-campaign | no-support | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 5 | 15 / 0 | 20 | 22.867 |
| normal-campaign | no-support | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 4 | 25 / 0 | 20 | 27.833 |
| normal-campaign | no-support | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 5 | 17 / 0 | 20 | 26.050 |
| normal-campaign | no-support | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 7 | 33 / 0 | 20 | 33.933 |
| normal-campaign | no-support | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 11 | 37 / 0 | 20 | 51.483 |
| normal-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 480.0 / 0 | 2 | 8 / 0 | 20 | 10.300 |
| normal-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 630.0 / 0 | 5 | 10 / 0 | 20 | 11.800 |
| normal-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 14.033 |
| normal-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.433 |
| normal-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 7 | 17 / 0 | 20 | 27.833 |
| normal-campaign | expansion-heavy | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 10.617 |
| normal-campaign | expansion-heavy | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 2 | 19 / 0 | 20 | 17.183 |
| normal-campaign | expansion-heavy | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 1 | 10 / 0 | 20 | 11.233 |
| normal-campaign | expansion-heavy | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 2 | 17 / 0 | 20 | 19.233 |
| normal-campaign | expansion-heavy | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 11 | 20 / 0 | 20 | 21.067 |
| normal-campaign | expansion-heavy | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 9.800 |
| normal-campaign | expansion-heavy | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 18.717 |
| normal-campaign | expansion-heavy | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 1 | 7 / 0 | 20 | 11.600 |
| normal-campaign | expansion-heavy | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 19.233 |
| normal-campaign | expansion-heavy | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 66.117 |
| normal-campaign | expansion-heavy | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 4 | 15 / 0 | 20 | 20.033 |
| normal-campaign | expansion-heavy | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 5 | 25 / 0 | 20 | 28.350 |
| normal-campaign | expansion-heavy | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 6 | 17 / 0 | 20 | 88.233 |
| normal-campaign | expansion-heavy | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 7 | 33 / 0 | 20 | 34.367 |
| normal-campaign | expansion-heavy | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 29 | 35 / 2 | 10 | 91.017 |
| normal-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 13.250 |
| normal-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.117 |
| normal-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.900 |
| normal-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 25.750 |
| normal-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.550 |
| normal-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 18.167 |
| normal-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 12.283 |
| normal-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 20.283 |
| normal-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 10 | 20 / 0 | 20 | 26.033 |
| normal-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.450 |
| normal-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.367 |
| normal-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 1 | 7 / 0 | 20 | 11.617 |
| normal-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 18.983 |
| normal-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 16.000 |
| normal-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 3 | 15 / 0 | 20 | 19.950 |
| normal-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 4 | 25 / 0 | 20 | 26.167 |
| normal-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 3 | 17 / 0 | 20 | 23.817 |
| normal-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 6 | 33 / 0 | 20 | 34.417 |
| normal-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 12 | 37 / 0 | 20 | 53.000 |
| normal-campaign | weak-placement | 1 | 8 / 8600 | 8 | 480.0 / 0 | 8 | 0 / 8 | 12 | 28.117 |
| normal-campaign | weak-placement | 2 | 10 / 6750 | 10 | 630.0 / 0 | 10 | 0 / 10 | 2 | 26.267 |
| normal-campaign | weak-placement | 3 | 11 / 7700 | 11 | 858.0 / 0 | 11 | 0 / 2 | 0 | 20.733 |
| normal-campaign | counter-aware | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | counter-aware | 2 | 10 / 6750 | 10 | 630.0 / 0 | 8 | 10 / 0 | 20 | 16.667 |
| normal-campaign | counter-aware | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.850 |
| normal-campaign | counter-aware | 4 | 11 / 7200 | 11 | 991.5 / 0 | 7 | 11 / 0 | 20 | 16.233 |
| normal-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 27.117 |
| normal-campaign | counter-aware | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.467 |
| normal-campaign | counter-aware | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 5 | 19 / 0 | 20 | 19.500 |
| normal-campaign | counter-aware | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 12.283 |
| normal-campaign | counter-aware | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 19.867 |
| normal-campaign | counter-aware | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 26.100 |
| normal-campaign | counter-aware | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.500 |
| normal-campaign | counter-aware | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.417 |
| normal-campaign | counter-aware | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 1 | 7 / 0 | 20 | 11.617 |
| normal-campaign | counter-aware | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 19.050 |
| normal-campaign | counter-aware | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 16.600 |
| normal-campaign | counter-aware | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 3 | 15 / 0 | 20 | 19.967 |
| normal-campaign | counter-aware | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 4 | 25 / 0 | 20 | 27.267 |
| normal-campaign | counter-aware | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 3 | 17 / 0 | 20 | 24.000 |
| normal-campaign | counter-aware | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 6 | 33 / 0 | 20 | 32.617 |
| normal-campaign | counter-aware | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 10 | 37 / 0 | 20 | 51.100 |
| hard-campaign | existing | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | existing | 2 | 10 / 6750 | 10 | 850.5 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | existing | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | existing | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.333 |
| hard-campaign | existing | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.300 |
| hard-campaign | existing | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 4 | 10 / 0 | 20 | 14.300 |
| hard-campaign | existing | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 6 | 19 / 0 | 20 | 22.983 |
| hard-campaign | existing | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.050 |
| hard-campaign | existing | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 5 | 17 / 0 | 20 | 21.367 |
| hard-campaign | existing | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 10 | 20 / 0 | 20 | 28.550 |
| hard-campaign | existing | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.933 |
| hard-campaign | existing | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 22.433 |
| hard-campaign | existing | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 11.883 |
| hard-campaign | existing | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 21.000 |
| hard-campaign | existing | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 4 | 12 / 0 | 20 | 21.633 |
| hard-campaign | existing | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 5 | 15 / 0 | 20 | 22.583 |
| hard-campaign | existing | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 6 | 25 / 0 | 20 | 30.450 |
| hard-campaign | existing | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 5 | 17 / 0 | 20 | 27.000 |
| hard-campaign | existing | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 37.517 |
| hard-campaign | existing | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 16 | 37 / 0 | 20 | 53.867 |
| hard-campaign | firewall-only | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 14.983 |
| hard-campaign | firewall-only | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 15.300 |
| hard-campaign | firewall-only | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.000 |
| hard-campaign | firewall-only | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 16.333 |
| hard-campaign | firewall-only | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 28.767 |
| hard-campaign | firewall-only | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.600 |
| hard-campaign | firewall-only | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 7 | 19 / 0 | 20 | 23.150 |
| hard-campaign | firewall-only | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.033 |
| hard-campaign | firewall-only | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 4 | 17 / 0 | 20 | 20.333 |
| hard-campaign | firewall-only | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 13 | 20 / 0 | 20 | 23.967 |
| hard-campaign | firewall-only | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 2 | 8 / 0 | 20 | 12.267 |
| hard-campaign | firewall-only | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 20.267 |
| hard-campaign | firewall-only | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.317 |
| hard-campaign | firewall-only | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 2 | 14 / 0 | 20 | 19.683 |
| hard-campaign | firewall-only | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 5 | 12 / 0 | 20 | 23.117 |
| hard-campaign | firewall-only | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 6 | 15 / 0 | 20 | 22.633 |
| hard-campaign | firewall-only | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 6 | 25 / 0 | 20 | 30.433 |
| hard-campaign | firewall-only | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 6 | 17 / 0 | 20 | 30.083 |
| hard-campaign | firewall-only | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 7 | 33 / 0 | 20 | 38.017 |
| hard-campaign | firewall-only | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 13 | 37 / 0 | 20 | 53.517 |
| hard-campaign | no-support | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | no-support | 2 | 10 / 6750 | 10 | 850.5 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | no-support | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | no-support | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.283 |
| hard-campaign | no-support | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 31.017 |
| hard-campaign | no-support | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 6 | 10 / 0 | 20 | 17.300 |
| hard-campaign | no-support | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 6 | 19 / 0 | 20 | 23.017 |
| hard-campaign | no-support | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.050 |
| hard-campaign | no-support | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 5 | 17 / 0 | 20 | 21.583 |
| hard-campaign | no-support | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 30.383 |
| hard-campaign | no-support | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 4 | 8 / 0 | 20 | 14.233 |
| hard-campaign | no-support | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 3 | 18 / 0 | 20 | 21.667 |
| hard-campaign | no-support | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.367 |
| hard-campaign | no-support | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 5 | 14 / 0 | 20 | 22.200 |
| hard-campaign | no-support | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 6 | 12 / 0 | 20 | 25.367 |
| hard-campaign | no-support | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 6 | 15 / 0 | 20 | 23.167 |
| hard-campaign | no-support | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 8 | 25 / 0 | 20 | 32.567 |
| hard-campaign | no-support | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 7 | 17 / 0 | 20 | 30.017 |
| hard-campaign | no-support | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 38.217 |
| hard-campaign | no-support | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 15 | 37 / 0 | 20 | 55.000 |
| hard-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 648.0 / 0 | 3 | 8 / 0 | 20 | 11.183 |
| hard-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 850.5 / 0 | 5 | 10 / 0 | 20 | 11.933 |
| hard-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 14.250 |
| hard-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 15.067 |
| hard-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 35.617 |
| hard-campaign | expansion-heavy | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 2 | 10 / 0 | 20 | 10.933 |
| hard-campaign | expansion-heavy | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 3 | 19 / 0 | 20 | 17.317 |
| hard-campaign | expansion-heavy | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 11.767 |
| hard-campaign | expansion-heavy | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 3 | 17 / 0 | 20 | 19.400 |
| hard-campaign | expansion-heavy | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 25.450 |
| hard-campaign | expansion-heavy | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 2 | 8 / 0 | 20 | 10.417 |
| hard-campaign | expansion-heavy | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 3 | 18 / 0 | 20 | 18.950 |
| hard-campaign | expansion-heavy | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 1 | 7 / 0 | 20 | 12.183 |
| hard-campaign | expansion-heavy | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 2 | 14 / 0 | 20 | 19.833 |
| hard-campaign | expansion-heavy | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 4 | 11 / 1 | 14 | 72.200 |
| hard-campaign | expansion-heavy | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 6 | 15 / 0 | 14 | 20.567 |
| hard-campaign | expansion-heavy | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 7 | 25 / 0 | 14 | 29.100 |
| hard-campaign | expansion-heavy | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 8 | 16 / 1 | 8 | 90.200 |
| hard-campaign | expansion-heavy | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 10 | 33 / 0 | 8 | 35.817 |
| hard-campaign | expansion-heavy | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 29 | 34 / 2 | 0 | 72.183 |
| hard-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 15.267 |
| hard-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 15.767 |
| hard-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.933 |
| hard-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.517 |
| hard-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 6 | 19 / 0 | 20 | 22.883 |
| hard-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.117 |
| hard-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 5 | 17 / 0 | 20 | 23.183 |
| hard-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 10 | 20 / 0 | 20 | 27.300 |
| hard-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 12.483 |
| hard-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 5 | 18 / 0 | 20 | 22.983 |
| hard-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 11.750 |
| hard-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 3 | 14 / 0 | 20 | 19.383 |
| hard-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 4 | 12 / 0 | 20 | 20.833 |
| hard-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 4 | 15 / 0 | 20 | 20.850 |
| hard-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 5 | 25 / 0 | 20 | 28.567 |
| hard-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 4 | 17 / 0 | 20 | 26.367 |
| hard-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 37.767 |
| hard-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 15 | 37 / 0 | 20 | 52.750 |
| hard-campaign | weak-placement | 1 | 8 / 8600 | 8 | 648.0 / 0 | 8 | 0 / 8 | 12 | 25.567 |
| hard-campaign | weak-placement | 2 | 10 / 6750 | 10 | 850.5 / 0 | 10 | 0 / 10 | 2 | 23.717 |
| hard-campaign | weak-placement | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 11 | 0 / 2 | 0 | 18.183 |
| hard-campaign | counter-aware | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | counter-aware | 2 | 10 / 6750 | 10 | 850.5 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | counter-aware | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | counter-aware | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.333 |
| hard-campaign | counter-aware | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.300 |
| hard-campaign | counter-aware | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 4 | 10 / 0 | 20 | 14.300 |
| hard-campaign | counter-aware | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 6 | 19 / 0 | 20 | 22.983 |
| hard-campaign | counter-aware | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.050 |
| hard-campaign | counter-aware | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 5 | 17 / 0 | 20 | 21.367 |
| hard-campaign | counter-aware | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 10 | 20 / 0 | 20 | 28.550 |
| hard-campaign | counter-aware | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.933 |
| hard-campaign | counter-aware | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 22.433 |
| hard-campaign | counter-aware | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 11.883 |
| hard-campaign | counter-aware | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 21.000 |
| hard-campaign | counter-aware | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 4 | 12 / 0 | 20 | 21.633 |
| hard-campaign | counter-aware | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 5 | 15 / 0 | 20 | 22.583 |
| hard-campaign | counter-aware | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 6 | 25 / 0 | 20 | 30.450 |
| hard-campaign | counter-aware | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 5 | 17 / 0 | 20 | 27.000 |
| hard-campaign | counter-aware | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 37.517 |
| hard-campaign | counter-aware | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 16 | 37 / 0 | 20 | 53.867 |
