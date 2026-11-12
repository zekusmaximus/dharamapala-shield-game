# Scripted balance results

Generated from results.json by tools/balance/summary.mjs. Resources are Dharma/Bandwidth/Anonymity. Time is simulated wave time, excluding preparation and report CPU time. These are fixed-policy observations, not human difficulty or win rates.

| Scenario | Policy | Outcome (last played wave) | Lives / leaks | Boss killed/leaked/unresolved | Seconds | End resources | Spent | Bounty | Clear (includes passive) | Passive Dharma |
|---|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 390.033 | 2604/4979/3712 | 10113/632/317 | 8655/4398/3163 | 3932/1153/766 | 102 |
| easy-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 391.250 | 2307/5611/4029 | 10308/0/0 | 8655/4398/3163 | 3830/1153/766 | 0 |
| easy-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 400.450 | 2602/5039/3742 | 10013/572/287 | 8655/4398/3163 | 3830/1153/766 | 0 |
| easy-campaign | expansion-heavy | VICTORY (20) | 16 / 1 | 6/1/0 | 519.267 | 8996/5487/3946 | 3360/0/0 | 8396/4274/3080 | 3830/1153/766 | 0 |
| easy-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 394.500 | 2608/5039/3742 | 10007/572/287 | 8655/4398/3163 | 3830/1153/766 | 0 |
| easy-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 85.467 | 46/75/113 | 199/20/10 | 0/0/0 | 115/35/23 | 0 |
| easy-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 390.033 | 2604/4979/3712 | 10113/632/317 | 8655/4398/3163 | 3932/1153/766 | 102 |
| normal-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 418.167 | 2391/4372/3394 | 9245/632/317 | 7574/3791/2845 | 3932/1153/766 | 102 |
| normal-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 432.500 | 2094/5004/3711 | 9440/0/0 | 7574/3791/2845 | 3830/1153/766 | 0 |
| normal-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 438.067 | 2389/4432/3424 | 9145/572/287 | 7574/3791/2845 | 3830/1153/766 | 0 |
| normal-campaign | expansion-heavy | VICTORY (20) | 10 / 2 | 5/2/0 | 541.017 | 7724/4788/3567 | 3360/0/0 | 7124/3575/2701 | 3830/1153/766 | 0 |
| normal-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 422.850 | 1982/4432/3424 | 9552/572/287 | 7574/3791/2845 | 3830/1153/766 | 0 |
| normal-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 75.117 | 46/75/113 | 199/20/10 | 0/0/0 | 115/35/23 | 0 |
| normal-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 418.167 | 2391/4372/3394 | 9245/632/317 | 7574/3791/2845 | 3932/1153/766 | 102 |
| hard-campaign | existing | VICTORY (20) | 19 / 1 | 7/0/0 | 482.867 | 2051/3851/2905 | 8377/632/317 | 6366/3270/2356 | 3932/1153/766 | 102 |
| hard-campaign | firewall-only | VICTORY (20) | 9 / 11 | 7/0/0 | 483.233 | 1508/4346/3116 | 8572/0/0 | 6120/3133/2250 | 3830/1153/766 | 0 |
| hard-campaign | no-support | VICTORY (20) | 19 / 1 | 7/0/0 | 491.067 | 2049/3911/2935 | 8277/572/287 | 6366/3270/2356 | 3830/1153/766 | 0 |
| hard-campaign | expansion-heavy | GAME_OVER (20) | 0 / 4 | 2/4/1 | 552.183 | 5743/3965/2879 | 3360/0/0 | 5533/2869/2091 | 3440/1036/688 | 0 |
| hard-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 478.300 | 1951/4213/3090 | 8398/283/142 | 6389/3283/2366 | 3830/1153/766 | 0 |
| hard-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 67.467 | 46/75/113 | 199/20/10 | 0/0/0 | 115/35/23 | 0 |
| hard-campaign | counter-aware | VICTORY (20) | 19 / 1 | 7/0/0 | 482.867 | 2051/3851/2905 | 8377/632/317 | 6366/3270/2356 | 3932/1153/766 | 102 |

## Observed tower activity

Aggregated by type; detailed per-wave tower IDs, levels, positions and typed leak coverage are in results.json. Health/shield removal and final hits do not allocate causal benefit from status or support. Aura-present shots may overlap.

| Scenario | Policy | Type | Health removed | Shield removed | Final hits | Shots | Slow applications | Vulnerability applications | Aura-present shots |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | encryption | 7355.878 | 126.860 | 55 | 410 | 283 | 283 | 0 |
| easy-campaign | existing | firewall | 46999.060 | 1119.140 | 264 | 1903 | 0 | 0 | 0 |
| easy-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 932 |
| easy-campaign | firewall-only | firewall | 54354.938 | 1246 | 319 | 2368 | 0 | 0 | 0 |
| easy-campaign | no-support | encryption | 8218.104 | 132.945 | 49 | 382 | 310 | 310 | 0 |
| easy-campaign | no-support | firewall | 46136.833 | 1114.055 | 270 | 1796 | 0 | 0 | 0 |
| easy-campaign | expansion-heavy | firewall | 54081.438 | 1246 | 318 | 10481 | 0 | 0 | 0 |
| easy-campaign | upgrade-heavy | encryption | 6228.096 | 135.647 | 63 | 363 | 269 | 269 | 0 |
| easy-campaign | upgrade-heavy | firewall | 48126.841 | 1110.353 | 256 | 2121 | 0 | 0 | 0 |
| easy-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| easy-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| easy-campaign | counter-aware | encryption | 7355.878 | 126.860 | 55 | 410 | 283 | 283 | 0 |
| easy-campaign | counter-aware | firewall | 46999.060 | 1119.140 | 264 | 1903 | 0 | 0 | 0 |
| easy-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 932 |
| normal-campaign | existing | encryption | 12198.410 | 136.166 | 58 | 465 | 440 | 440 | 0 |
| normal-campaign | existing | firewall | 60274.840 | 1525.834 | 261 | 2156 | 0 | 0 | 0 |
| normal-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1132 |
| normal-campaign | firewall-only | firewall | 72473.250 | 1662 | 319 | 3096 | 0 | 0 | 0 |
| normal-campaign | no-support | encryption | 12217.367 | 163.476 | 70 | 450 | 452 | 452 | 0 |
| normal-campaign | no-support | firewall | 60255.883 | 1499.524 | 249 | 2132 | 0 | 0 | 0 |
| normal-campaign | expansion-heavy | firewall | 70978.250 | 1662 | 317 | 11889 | 0 | 0 | 0 |
| normal-campaign | upgrade-heavy | encryption | 10517.087 | 136.166 | 59 | 413 | 393 | 393 | 0 |
| normal-campaign | upgrade-heavy | firewall | 61956.163 | 1528.834 | 260 | 2199 | 0 | 0 | 0 |
| normal-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| normal-campaign | weak-placement | firewall | 134 | 0 | 0 | 6 | 0 | 0 | 0 |
| normal-campaign | counter-aware | encryption | 12198.410 | 136.166 | 58 | 465 | 440 | 440 | 0 |
| normal-campaign | counter-aware | firewall | 60274.840 | 1525.834 | 261 | 2156 | 0 | 0 | 0 |
| normal-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1132 |
| hard-campaign | existing | encryption | 14556.748 | 253.978 | 55 | 538 | 542 | 542 | 0 |
| hard-campaign | existing | firewall | 83218.240 | 2007.147 | 263 | 2975 | 0 | 0 | 0 |
| hard-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1835 |
| hard-campaign | firewall-only | firewall | 96623.213 | 2244 | 308 | 3839 | 0 | 0 | 0 |
| hard-campaign | no-support | encryption | 14576.032 | 245.997 | 50 | 497 | 541 | 541 | 0 |
| hard-campaign | no-support | firewall | 83052.015 | 1998.003 | 268 | 2953 | 0 | 0 | 0 |
| hard-campaign | expansion-heavy | firewall | 93378.387 | 2145 | 314 | 12978 | 0 | 0 | 0 |
| hard-campaign | upgrade-heavy | encryption | 11740.290 | 153.728 | 37 | 470 | 471 | 471 | 0 |
| hard-campaign | upgrade-heavy | firewall | 86098.598 | 2091.272 | 282 | 3389 | 0 | 0 | 0 |
| hard-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hard-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| hard-campaign | counter-aware | encryption | 14556.748 | 253.978 | 55 | 538 | 542 | 542 | 0 |
| hard-campaign | counter-aware | firewall | 83218.240 | 2007.147 | 263 | 2975 | 0 | 0 | 0 |
| hard-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1835 |

## Wave pressure and outcomes

Authored count/due time excludes dynamic Raid reinforcements. Spawn HP and initial shield sum actual production spawns (including reinforcements); neither is a damage requirement or a scalar difficulty score. Peak live count is observed on each spawn. Defeat can leave authored spawns unreleased and live enemies unresolved.

| Scenario | Policy | Wave | Authored count / last due ms | Actual spawns | Spawn HP / initial shield | Peak alive | Kills / leaks | Lives after | Seconds |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | existing | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 12.950 |
| easy-campaign | existing | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 14.150 |
| easy-campaign | existing | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 14.133 |
| easy-campaign | existing | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 24.500 |
| easy-campaign | existing | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 11.033 |
| easy-campaign | existing | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 3 | 19 / 0 | 20 | 17.817 |
| easy-campaign | existing | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.383 |
| easy-campaign | existing | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.367 |
| easy-campaign | existing | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 12 | 20 / 0 | 20 | 23.267 |
| easy-campaign | existing | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.317 |
| easy-campaign | existing | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.317 |
| easy-campaign | existing | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 11.117 |
| easy-campaign | existing | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 3 | 14 / 0 | 20 | 18.867 |
| easy-campaign | existing | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 17.933 |
| easy-campaign | existing | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 18.967 |
| easy-campaign | existing | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 3 | 25 / 0 | 20 | 26.583 |
| easy-campaign | existing | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 24.167 |
| easy-campaign | existing | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 5 | 33 / 0 | 20 | 33.117 |
| easy-campaign | existing | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 8 | 37 / 0 | 20 | 48.600 |
| easy-campaign | firewall-only | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 11.267 |
| easy-campaign | firewall-only | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.917 |
| easy-campaign | firewall-only | 3 | 11 / 7700 | 11 | 643.5 / 0 | 5 | 11 / 0 | 20 | 10.650 |
| easy-campaign | firewall-only | 4 | 11 / 7200 | 11 | 743.6 / 0 | 5 | 11 / 0 | 20 | 11.033 |
| easy-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 25.583 |
| easy-campaign | firewall-only | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 10.667 |
| easy-campaign | firewall-only | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 3 | 19 / 0 | 20 | 17.367 |
| easy-campaign | firewall-only | 8 | 10 / 10000 | 10 | 895.5 / 0 | 1 | 10 / 0 | 20 | 11.367 |
| easy-campaign | firewall-only | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 2 | 17 / 0 | 20 | 19.367 |
| easy-campaign | firewall-only | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 13 | 20 / 0 | 20 | 24.267 |
| easy-campaign | firewall-only | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.083 |
| easy-campaign | firewall-only | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 2 | 18 / 0 | 20 | 18.967 |
| easy-campaign | firewall-only | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 10.850 |
| easy-campaign | firewall-only | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 3 | 14 / 0 | 20 | 18.383 |
| easy-campaign | firewall-only | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 24.717 |
| easy-campaign | firewall-only | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 4 | 15 / 0 | 20 | 21.200 |
| easy-campaign | firewall-only | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 3 | 25 / 0 | 20 | 26.683 |
| easy-campaign | firewall-only | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 27.067 |
| easy-campaign | firewall-only | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 6 | 33 / 0 | 20 | 32.550 |
| easy-campaign | firewall-only | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 8 | 37 / 0 | 20 | 48.267 |
| easy-campaign | no-support | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | no-support | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 12.950 |
| easy-campaign | no-support | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 14.150 |
| easy-campaign | no-support | 4 | 11 / 7200 | 11 | 743.6 / 0 | 5 | 11 / 0 | 20 | 13.400 |
| easy-campaign | no-support | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 25.350 |
| easy-campaign | no-support | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 10.950 |
| easy-campaign | no-support | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 3 | 19 / 0 | 20 | 17.783 |
| easy-campaign | no-support | 8 | 10 / 10000 | 10 | 895.5 / 0 | 1 | 10 / 0 | 20 | 11.383 |
| easy-campaign | no-support | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 2 | 17 / 0 | 20 | 19.383 |
| easy-campaign | no-support | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 13 | 20 / 0 | 20 | 24.467 |
| easy-campaign | no-support | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.583 |
| easy-campaign | no-support | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.317 |
| easy-campaign | no-support | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 11.167 |
| easy-campaign | no-support | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 3 | 14 / 0 | 20 | 18.683 |
| easy-campaign | no-support | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 22.183 |
| easy-campaign | no-support | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 4 | 15 / 0 | 20 | 19.783 |
| easy-campaign | no-support | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 3 | 25 / 0 | 20 | 27.067 |
| easy-campaign | no-support | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 26.050 |
| easy-campaign | no-support | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 4 | 33 / 0 | 20 | 32.600 |
| easy-campaign | no-support | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 10 | 37 / 0 | 20 | 50.750 |
| easy-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 360.0 / 0 | 2 | 8 / 0 | 20 | 10.417 |
| easy-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.933 |
| easy-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 643.5 / 0 | 5 | 11 / 0 | 20 | 9.933 |
| easy-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 10.933 |
| easy-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 24.700 |
| easy-campaign | expansion-heavy | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 10.483 |
| easy-campaign | expansion-heavy | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 17.117 |
| easy-campaign | expansion-heavy | 8 | 10 / 10000 | 10 | 895.5 / 0 | 1 | 10 / 0 | 20 | 11.133 |
| easy-campaign | expansion-heavy | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 2 | 17 / 0 | 20 | 19.133 |
| easy-campaign | expansion-heavy | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 11 | 20 / 0 | 20 | 17.950 |
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
| easy-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 12.950 |
| easy-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 14.483 |
| easy-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 14.083 |
| easy-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 25.467 |
| easy-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 10.833 |
| easy-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 3 | 19 / 0 | 20 | 17.367 |
| easy-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 895.5 / 0 | 1 | 10 / 0 | 20 | 11.383 |
| easy-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.383 |
| easy-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 13 | 20 / 0 | 20 | 25.200 |
| easy-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.617 |
| easy-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.283 |
| easy-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 1 | 7 / 0 | 20 | 11.133 |
| easy-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 3 | 14 / 0 | 20 | 18.517 |
| easy-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 17.817 |
| easy-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.117 |
| easy-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 26.717 |
| easy-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 23.833 |
| easy-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 5 | 33 / 0 | 20 | 32.567 |
| easy-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 10 | 37 / 0 | 20 | 51.300 |
| easy-campaign | weak-placement | 1 | 8 / 8600 | 8 | 360.0 / 0 | 8 | 0 / 8 | 12 | 31.567 |
| easy-campaign | weak-placement | 2 | 10 / 6750 | 10 | 472.5 / 0 | 10 | 0 / 10 | 2 | 29.717 |
| easy-campaign | weak-placement | 3 | 11 / 7700 | 11 | 643.5 / 0 | 11 | 0 / 2 | 0 | 24.183 |
| easy-campaign | counter-aware | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | counter-aware | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 12.950 |
| easy-campaign | counter-aware | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 14.150 |
| easy-campaign | counter-aware | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 14.133 |
| easy-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 24.500 |
| easy-campaign | counter-aware | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 11.033 |
| easy-campaign | counter-aware | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 3 | 19 / 0 | 20 | 17.817 |
| easy-campaign | counter-aware | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.383 |
| easy-campaign | counter-aware | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.367 |
| easy-campaign | counter-aware | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 12 | 20 / 0 | 20 | 23.267 |
| easy-campaign | counter-aware | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.317 |
| easy-campaign | counter-aware | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.317 |
| easy-campaign | counter-aware | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 11.117 |
| easy-campaign | counter-aware | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 3 | 14 / 0 | 20 | 18.867 |
| easy-campaign | counter-aware | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 17.933 |
| easy-campaign | counter-aware | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 18.967 |
| easy-campaign | counter-aware | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 3 | 25 / 0 | 20 | 26.583 |
| easy-campaign | counter-aware | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 24.167 |
| easy-campaign | counter-aware | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 5 | 33 / 0 | 20 | 33.117 |
| easy-campaign | counter-aware | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 8 | 37 / 0 | 20 | 48.600 |
| normal-campaign | existing | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | existing | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 15.400 |
| normal-campaign | existing | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| normal-campaign | existing | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 15.683 |
| normal-campaign | existing | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 25.850 |
| normal-campaign | existing | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.467 |
| normal-campaign | existing | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 17.933 |
| normal-campaign | existing | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 11.433 |
| normal-campaign | existing | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 20.033 |
| normal-campaign | existing | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 25.833 |
| normal-campaign | existing | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.867 |
| normal-campaign | existing | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.950 |
| normal-campaign | existing | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 2 | 7 / 0 | 20 | 11.633 |
| normal-campaign | existing | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 3 | 14 / 0 | 20 | 20.800 |
| normal-campaign | existing | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 21.500 |
| normal-campaign | existing | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 3 | 15 / 0 | 20 | 19.183 |
| normal-campaign | existing | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 5 | 25 / 0 | 20 | 27.617 |
| normal-campaign | existing | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 3 | 17 / 0 | 20 | 26.883 |
| normal-campaign | existing | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 7 | 33 / 0 | 20 | 33.283 |
| normal-campaign | existing | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 13 | 37 / 0 | 20 | 52.017 |
| normal-campaign | firewall-only | 1 | 8 / 8600 | 8 | 480.0 / 0 | 3 | 8 / 0 | 20 | 11.167 |
| normal-campaign | firewall-only | 2 | 10 / 6750 | 10 | 630.0 / 0 | 5 | 10 / 0 | 20 | 10.817 |
| normal-campaign | firewall-only | 3 | 11 / 7700 | 11 | 858.0 / 0 | 5 | 11 / 0 | 20 | 12.017 |
| normal-campaign | firewall-only | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 12.183 |
| normal-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 26.183 |
| normal-campaign | firewall-only | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 4 | 10 / 0 | 20 | 13.050 |
| normal-campaign | firewall-only | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 17.800 |
| normal-campaign | firewall-only | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 11.433 |
| normal-campaign | firewall-only | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 19.433 |
| normal-campaign | firewall-only | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 11 | 20 / 0 | 20 | 25.667 |
| normal-campaign | firewall-only | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 3 | 8 / 0 | 20 | 11.683 |
| normal-campaign | firewall-only | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 20.233 |
| normal-campaign | firewall-only | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 2 | 7 / 0 | 20 | 11.950 |
| normal-campaign | firewall-only | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 4 | 14 / 0 | 20 | 21.850 |
| normal-campaign | firewall-only | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 5 | 12 / 0 | 20 | 26.967 |
| normal-campaign | firewall-only | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 6 | 15 / 0 | 20 | 23.100 |
| normal-campaign | firewall-only | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 8 | 25 / 0 | 20 | 32.533 |
| normal-campaign | firewall-only | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 6 | 17 / 0 | 20 | 32.950 |
| normal-campaign | firewall-only | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 7 | 33 / 0 | 20 | 35.883 |
| normal-campaign | firewall-only | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 16 | 37 / 0 | 20 | 55.600 |
| normal-campaign | no-support | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | no-support | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 15.400 |
| normal-campaign | no-support | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| normal-campaign | no-support | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.317 |
| normal-campaign | no-support | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 7 | 17 / 0 | 20 | 27.617 |
| normal-campaign | no-support | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 5 | 10 / 0 | 20 | 15.617 |
| normal-campaign | no-support | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 18.167 |
| normal-campaign | no-support | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 11.733 |
| normal-campaign | no-support | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 4 | 17 / 0 | 20 | 20.083 |
| normal-campaign | no-support | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 26.100 |
| normal-campaign | no-support | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 3 | 8 / 0 | 20 | 11.467 |
| normal-campaign | no-support | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.900 |
| normal-campaign | no-support | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 2 | 7 / 0 | 20 | 11.800 |
| normal-campaign | no-support | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 4 | 14 / 0 | 20 | 20.800 |
| normal-campaign | no-support | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 5 | 12 / 0 | 20 | 25.100 |
| normal-campaign | no-support | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 4 | 15 / 0 | 20 | 22.317 |
| normal-campaign | no-support | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 6 | 25 / 0 | 20 | 30.550 |
| normal-campaign | no-support | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 5 | 17 / 0 | 20 | 30.067 |
| normal-campaign | no-support | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 6 | 33 / 0 | 20 | 33.833 |
| normal-campaign | no-support | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 12 | 37 / 0 | 20 | 52.400 |
| normal-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 480.0 / 0 | 2 | 8 / 0 | 20 | 10.300 |
| normal-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 630.0 / 0 | 5 | 10 / 0 | 20 | 11.800 |
| normal-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 12.000 |
| normal-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 12.267 |
| normal-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 7 | 17 / 0 | 20 | 27.850 |
| normal-campaign | expansion-heavy | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 10.617 |
| normal-campaign | expansion-heavy | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 17.183 |
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
| normal-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 15.400 |
| normal-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 16.150 |
| normal-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 15.450 |
| normal-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 27.667 |
| normal-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 3 | 10 / 0 | 20 | 12.150 |
| normal-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 17.350 |
| normal-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 1 | 10 / 0 | 20 | 11.783 |
| normal-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 4 | 17 / 0 | 20 | 20.100 |
| normal-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 10 | 20 / 0 | 20 | 26.717 |
| normal-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 11.000 |
| normal-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 20.183 |
| normal-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 2 | 7 / 0 | 20 | 11.450 |
| normal-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 3 | 14 / 0 | 20 | 19.333 |
| normal-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 22.267 |
| normal-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 3 | 15 / 0 | 20 | 19.883 |
| normal-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 4 | 25 / 0 | 20 | 27.517 |
| normal-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 4 | 17 / 0 | 20 | 26.967 |
| normal-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 6 | 33 / 0 | 20 | 33.267 |
| normal-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 12 | 37 / 0 | 20 | 52.550 |
| normal-campaign | weak-placement | 1 | 8 / 8600 | 8 | 480.0 / 0 | 8 | 0 / 8 | 12 | 28.117 |
| normal-campaign | weak-placement | 2 | 10 / 6750 | 10 | 630.0 / 0 | 10 | 0 / 10 | 2 | 26.267 |
| normal-campaign | weak-placement | 3 | 11 / 7700 | 11 | 858.0 / 0 | 11 | 0 / 2 | 0 | 20.733 |
| normal-campaign | counter-aware | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | counter-aware | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 15.400 |
| normal-campaign | counter-aware | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| normal-campaign | counter-aware | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 15.683 |
| normal-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 25.850 |
| normal-campaign | counter-aware | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.467 |
| normal-campaign | counter-aware | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 17.933 |
| normal-campaign | counter-aware | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 11.433 |
| normal-campaign | counter-aware | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 20.033 |
| normal-campaign | counter-aware | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 25.833 |
| normal-campaign | counter-aware | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.867 |
| normal-campaign | counter-aware | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.950 |
| normal-campaign | counter-aware | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 2 | 7 / 0 | 20 | 11.633 |
| normal-campaign | counter-aware | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 3 | 14 / 0 | 20 | 20.800 |
| normal-campaign | counter-aware | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 21.500 |
| normal-campaign | counter-aware | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 3 | 15 / 0 | 20 | 19.183 |
| normal-campaign | counter-aware | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 5 | 25 / 0 | 20 | 27.617 |
| normal-campaign | counter-aware | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 3 | 17 / 0 | 20 | 26.883 |
| normal-campaign | counter-aware | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 7 | 33 / 0 | 20 | 33.283 |
| normal-campaign | counter-aware | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 13 | 37 / 0 | 20 | 52.017 |
| hard-campaign | existing | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | existing | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 17.617 |
| hard-campaign | existing | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.050 |
| hard-campaign | existing | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.483 |
| hard-campaign | existing | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.317 |
| hard-campaign | existing | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.400 |
| hard-campaign | existing | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 5 | 19 / 0 | 20 | 22.167 |
| hard-campaign | existing | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.233 |
| hard-campaign | existing | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 5 | 17 / 0 | 20 | 23.683 |
| hard-campaign | existing | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 10 | 20 / 0 | 20 | 30.817 |
| hard-campaign | existing | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.317 |
| hard-campaign | existing | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 23.033 |
| hard-campaign | existing | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.967 |
| hard-campaign | existing | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 22.333 |
| hard-campaign | existing | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 5 | 12 / 0 | 20 | 26.000 |
| hard-campaign | existing | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 6 | 15 / 0 | 20 | 23.133 |
| hard-campaign | existing | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 7 | 25 / 0 | 20 | 31.967 |
| hard-campaign | existing | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 5 | 17 / 0 | 20 | 32.400 |
| hard-campaign | existing | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 38.850 |
| hard-campaign | existing | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 18 | 36 / 1 | 19 | 58.100 |
| hard-campaign | firewall-only | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 14.983 |
| hard-campaign | firewall-only | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 15.300 |
| hard-campaign | firewall-only | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 14.083 |
| hard-campaign | firewall-only | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| hard-campaign | firewall-only | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.783 |
| hard-campaign | firewall-only | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 15.667 |
| hard-campaign | firewall-only | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 5 | 19 / 0 | 20 | 21.583 |
| hard-campaign | firewall-only | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 11.867 |
| hard-campaign | firewall-only | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 4 | 17 / 0 | 20 | 22.833 |
| hard-campaign | firewall-only | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 29.083 |
| hard-campaign | firewall-only | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.600 |
| hard-campaign | firewall-only | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 3 | 18 / 0 | 20 | 20.733 |
| hard-campaign | firewall-only | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.950 |
| hard-campaign | firewall-only | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 5 | 14 / 0 | 20 | 23.750 |
| hard-campaign | firewall-only | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 6 | 12 / 0 | 20 | 28.283 |
| hard-campaign | firewall-only | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 7 | 15 / 0 | 20 | 24.900 |
| hard-campaign | firewall-only | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 9 | 25 / 0 | 20 | 33.450 |
| hard-campaign | firewall-only | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 8 | 17 / 0 | 20 | 37.500 |
| hard-campaign | firewall-only | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 10 | 33 / 0 | 20 | 39.683 |
| hard-campaign | firewall-only | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 21 | 26 / 11 | 9 | 58.067 |
| hard-campaign | no-support | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | no-support | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 17.617 |
| hard-campaign | no-support | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.050 |
| hard-campaign | no-support | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 15.767 |
| hard-campaign | no-support | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 30.967 |
| hard-campaign | no-support | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.183 |
| hard-campaign | no-support | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 6 | 19 / 0 | 20 | 22.500 |
| hard-campaign | no-support | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.000 |
| hard-campaign | no-support | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 4 | 17 / 0 | 20 | 23.250 |
| hard-campaign | no-support | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 30.350 |
| hard-campaign | no-support | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 14.617 |
| hard-campaign | no-support | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 3 | 18 / 0 | 20 | 22.317 |
| hard-campaign | no-support | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 3 | 7 / 0 | 20 | 13.650 |
| hard-campaign | no-support | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 22.717 |
| hard-campaign | no-support | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 6 | 12 / 0 | 20 | 27.100 |
| hard-campaign | no-support | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 7 | 15 / 0 | 20 | 23.917 |
| hard-campaign | no-support | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 8 | 25 / 0 | 20 | 33.100 |
| hard-campaign | no-support | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 7 | 17 / 0 | 20 | 35.850 |
| hard-campaign | no-support | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 9 | 33 / 0 | 20 | 38.700 |
| hard-campaign | no-support | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 19 | 36 / 1 | 19 | 59.417 |
| hard-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 648.0 / 0 | 3 | 8 / 0 | 20 | 11.183 |
| hard-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 850.5 / 0 | 5 | 10 / 0 | 20 | 11.933 |
| hard-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 13.900 |
| hard-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 13.233 |
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
| hard-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 17.617 |
| hard-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.050 |
| hard-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 15.767 |
| hard-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 30.167 |
| hard-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.067 |
| hard-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 6 | 19 / 0 | 20 | 22.417 |
| hard-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 12.867 |
| hard-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 5 | 17 / 0 | 20 | 23.733 |
| hard-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 10 | 20 / 0 | 20 | 30.533 |
| hard-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.850 |
| hard-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 22.700 |
| hard-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.300 |
| hard-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 3 | 14 / 0 | 20 | 20.217 |
| hard-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 5 | 12 / 0 | 20 | 26.067 |
| hard-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 5 | 15 / 0 | 20 | 22.550 |
| hard-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 7 | 25 / 0 | 20 | 32.150 |
| hard-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 5 | 17 / 0 | 20 | 32.633 |
| hard-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 9 | 33 / 0 | 20 | 38.933 |
| hard-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 22 | 37 / 0 | 20 | 56.683 |
| hard-campaign | weak-placement | 1 | 8 / 8600 | 8 | 648.0 / 0 | 8 | 0 / 8 | 12 | 25.567 |
| hard-campaign | weak-placement | 2 | 10 / 6750 | 10 | 850.5 / 0 | 10 | 0 / 10 | 2 | 23.717 |
| hard-campaign | weak-placement | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 11 | 0 / 2 | 0 | 18.183 |
| hard-campaign | counter-aware | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | counter-aware | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 17.617 |
| hard-campaign | counter-aware | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.050 |
| hard-campaign | counter-aware | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.483 |
| hard-campaign | counter-aware | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.317 |
| hard-campaign | counter-aware | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.400 |
| hard-campaign | counter-aware | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 5 | 19 / 0 | 20 | 22.167 |
| hard-campaign | counter-aware | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.233 |
| hard-campaign | counter-aware | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 5 | 17 / 0 | 20 | 23.683 |
| hard-campaign | counter-aware | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 10 | 20 / 0 | 20 | 30.817 |
| hard-campaign | counter-aware | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.317 |
| hard-campaign | counter-aware | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 23.033 |
| hard-campaign | counter-aware | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.967 |
| hard-campaign | counter-aware | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 22.333 |
| hard-campaign | counter-aware | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 5 | 12 / 0 | 20 | 26.000 |
| hard-campaign | counter-aware | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 6 | 15 / 0 | 20 | 23.133 |
| hard-campaign | counter-aware | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 7 | 25 / 0 | 20 | 31.967 |
| hard-campaign | counter-aware | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 5 | 17 / 0 | 20 | 32.400 |
| hard-campaign | counter-aware | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 38.850 |
| hard-campaign | counter-aware | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 18 | 36 / 1 | 19 | 58.100 |
