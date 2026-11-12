# Scripted balance results

Generated from results.json by tools/balance/summary.mjs. Resources are Dharma/Bandwidth/Anonymity. Time is simulated wave time, excluding preparation and report CPU time. These are fixed-policy observations, not human difficulty or win rates.

| Scenario | Policy | Outcome (last played wave) | Lives / leaks | Boss killed/leaked/unresolved | Seconds | End resources | Spent | Bounty | Clear (includes passive) | Passive Dharma |
|---|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 387.933 | 2604/4979/3712 | 10113/632/317 | 8655/4398/3163 | 3932/1153/766 | 102 |
| easy-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 379.600 | 2307/5611/4029 | 10308/0/0 | 8655/4398/3163 | 3830/1153/766 | 0 |
| easy-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 395.883 | 2602/5039/3742 | 10013/572/287 | 8655/4398/3163 | 3830/1153/766 | 0 |
| easy-campaign | expansion-heavy | VICTORY (20) | 16 / 1 | 6/1/0 | 519.267 | 8996/5487/3946 | 3360/0/0 | 8396/4274/3080 | 3830/1153/766 | 0 |
| easy-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 390.367 | 2608/5039/3742 | 10007/572/287 | 8655/4398/3163 | 3830/1153/766 | 0 |
| easy-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 85.467 | 46/75/113 | 199/20/10 | 0/0/0 | 115/35/23 | 0 |
| easy-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 387.933 | 2604/4979/3712 | 10113/632/317 | 8655/4398/3163 | 3932/1153/766 | 102 |
| normal-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 408.617 | 2391/4372/3394 | 9245/632/317 | 7574/3791/2845 | 3932/1153/766 | 102 |
| normal-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 400.283 | 2094/5004/3711 | 9440/0/0 | 7574/3791/2845 | 3830/1153/766 | 0 |
| normal-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 421.533 | 2389/4432/3424 | 9145/572/287 | 7574/3791/2845 | 3830/1153/766 | 0 |
| normal-campaign | expansion-heavy | VICTORY (20) | 10 / 2 | 5/2/0 | 541.017 | 7724/4788/3567 | 3360/0/0 | 7124/3575/2701 | 3830/1153/766 | 0 |
| normal-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 413.667 | 1982/4432/3424 | 9552/572/287 | 7574/3791/2845 | 3830/1153/766 | 0 |
| normal-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 75.117 | 46/75/113 | 199/20/10 | 0/0/0 | 115/35/23 | 0 |
| normal-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 408.617 | 2391/4372/3394 | 9245/632/317 | 7574/3791/2845 | 3932/1153/766 | 102 |
| hard-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 449.967 | 2074/3864/2915 | 8377/632/317 | 6389/3283/2366 | 3932/1153/766 | 102 |
| hard-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 444.650 | 1777/4496/3232 | 8572/0/0 | 6389/3283/2366 | 3830/1153/766 | 0 |
| hard-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 465.183 | 2072/3924/2945 | 8277/572/287 | 6389/3283/2366 | 3830/1153/766 | 0 |
| hard-campaign | expansion-heavy | GAME_OVER (20) | 0 / 4 | 2/4/1 | 552.183 | 5743/3965/2879 | 3360/0/0 | 5533/2869/2091 | 3440/1036/688 | 0 |
| hard-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 449.500 | 1951/4213/3090 | 8398/283/142 | 6389/3283/2366 | 3830/1153/766 | 0 |
| hard-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 67.467 | 46/75/113 | 199/20/10 | 0/0/0 | 115/35/23 | 0 |
| hard-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 449.967 | 2074/3864/2915 | 8377/632/317 | 6389/3283/2366 | 3932/1153/766 | 102 |

## Observed tower activity

Aggregated by type; detailed per-wave tower IDs, levels, positions and typed leak coverage are in results.json. Health/shield removal and final hits do not allocate causal benefit from status or support. Aura-present shots may overlap.

| Scenario | Policy | Type | Health removed | Shield removed | Final hits | Shots | Slow applications | Vulnerability applications | Aura-present shots |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | encryption | 5734.435 | 70.246 | 58 | 412 | 202 | 202 | 0 |
| easy-campaign | existing | firewall | 48620.502 | 1192.852 | 261 | 1256 | 0 | 0 | 0 |
| easy-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 700 |
| easy-campaign | firewall-only | firewall | 54354.938 | 1251.976 | 319 | 1447 | 0 | 0 | 0 |
| easy-campaign | no-support | encryption | 5598.119 | 60.245 | 53 | 386 | 194 | 194 | 0 |
| easy-campaign | no-support | firewall | 48756.818 | 1185.755 | 266 | 1186 | 0 | 0 | 0 |
| easy-campaign | expansion-heavy | firewall | 54081.438 | 1246 | 318 | 10481 | 0 | 0 | 0 |
| easy-campaign | upgrade-heavy | encryption | 5153.386 | 70.246 | 58 | 367 | 191 | 191 | 0 |
| easy-campaign | upgrade-heavy | firewall | 49201.551 | 1175.754 | 261 | 1264 | 0 | 0 | 0 |
| easy-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| easy-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| easy-campaign | counter-aware | encryption | 5734.435 | 70.246 | 58 | 412 | 202 | 202 | 0 |
| easy-campaign | counter-aware | firewall | 48620.502 | 1192.852 | 261 | 1256 | 0 | 0 | 0 |
| easy-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 700 |
| normal-campaign | existing | encryption | 8037.828 | 125.139 | 45 | 450 | 266 | 266 | 0 |
| normal-campaign | existing | firewall | 64435.422 | 1536.861 | 274 | 1407 | 0 | 0 | 0 |
| normal-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 800 |
| normal-campaign | firewall-only | firewall | 72473.250 | 1664.664 | 319 | 1696 | 0 | 0 | 0 |
| normal-campaign | no-support | encryption | 8295.167 | 36.720 | 38 | 426 | 266 | 266 | 0 |
| normal-campaign | no-support | firewall | 64178.083 | 1625.280 | 281 | 1337 | 0 | 0 | 0 |
| normal-campaign | expansion-heavy | firewall | 70978.250 | 1662 | 317 | 11889 | 0 | 0 | 0 |
| normal-campaign | upgrade-heavy | encryption | 6936.958 | 142.584 | 34 | 406 | 237 | 237 | 0 |
| normal-campaign | upgrade-heavy | firewall | 65536.292 | 1519.416 | 285 | 1428 | 0 | 0 | 0 |
| normal-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| normal-campaign | weak-placement | firewall | 134 | 0 | 0 | 6 | 0 | 0 | 0 |
| normal-campaign | counter-aware | encryption | 8037.828 | 125.139 | 45 | 450 | 266 | 266 | 0 |
| normal-campaign | counter-aware | firewall | 64435.422 | 1536.861 | 274 | 1407 | 0 | 0 | 0 |
| normal-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 800 |
| hard-campaign | existing | encryption | 9472.830 | 222.304 | 39 | 500 | 323 | 323 | 0 |
| hard-campaign | existing | firewall | 88366.058 | 2021.696 | 280 | 1751 | 0 | 0 | 0 |
| hard-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1083 |
| hard-campaign | firewall-only | firewall | 97838.888 | 2244 | 319 | 2081 | 0 | 0 | 0 |
| hard-campaign | no-support | encryption | 9695.031 | 197.477 | 33 | 473 | 318 | 318 | 0 |
| hard-campaign | no-support | firewall | 88143.857 | 2046.523 | 286 | 1767 | 0 | 0 | 0 |
| hard-campaign | expansion-heavy | firewall | 93378.387 | 2145 | 314 | 12978 | 0 | 0 | 0 |
| hard-campaign | upgrade-heavy | encryption | 7838.389 | 62.894 | 38 | 440 | 279 | 279 | 0 |
| hard-campaign | upgrade-heavy | firewall | 90000.499 | 2207.148 | 281 | 2008 | 0 | 0 | 0 |
| hard-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hard-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| hard-campaign | counter-aware | encryption | 9472.830 | 222.304 | 39 | 500 | 323 | 323 | 0 |
| hard-campaign | counter-aware | firewall | 88366.058 | 2021.696 | 280 | 1751 | 0 | 0 | 0 |
| hard-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1083 |

## Wave pressure and outcomes

Authored count/due time excludes dynamic Raid reinforcements. Spawn HP and initial shield sum actual production spawns (including reinforcements); neither is a damage requirement or a scalar difficulty score. Peak live count is observed on each spawn. Defeat can leave authored spawns unreleased and live enemies unresolved.

| Scenario | Policy | Wave | Authored count / last due ms | Actual spawns | Spawn HP / initial shield | Peak alive | Kills / leaks | Lives after | Seconds |
|---|---|---|---|---|---|---|---|---|---|
| easy-campaign | existing | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | existing | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 12.950 |
| easy-campaign | existing | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 14.150 |
| easy-campaign | existing | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 14.133 |
| easy-campaign | existing | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 24.500 |
| easy-campaign | existing | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 11.500 |
| easy-campaign | existing | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 18.317 |
| easy-campaign | existing | 8 | 10 / 10000 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.767 |
| easy-campaign | existing | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | existing | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 21.700 |
| easy-campaign | existing | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 1 | 8 / 0 | 20 | 10.317 |
| easy-campaign | existing | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.283 |
| easy-campaign | existing | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 11.100 |
| easy-campaign | existing | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.617 |
| easy-campaign | existing | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 15.617 |
| easy-campaign | existing | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.017 |
| easy-campaign | existing | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 3 | 25 / 0 | 20 | 26.283 |
| easy-campaign | existing | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 22.900 |
| easy-campaign | existing | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 5 | 33 / 0 | 20 | 32.800 |
| easy-campaign | existing | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 9 | 37 / 0 | 20 | 51.267 |
| easy-campaign | firewall-only | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 11.267 |
| easy-campaign | firewall-only | 2 | 10 / 6750 | 10 | 472.5 / 0 | 5 | 10 / 0 | 20 | 10.917 |
| easy-campaign | firewall-only | 3 | 11 / 7700 | 11 | 643.5 / 0 | 5 | 11 / 0 | 20 | 10.650 |
| easy-campaign | firewall-only | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 11.633 |
| easy-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 24.950 |
| easy-campaign | firewall-only | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 11.433 |
| easy-campaign | firewall-only | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 18.233 |
| easy-campaign | firewall-only | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.600 |
| easy-campaign | firewall-only | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | firewall-only | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 12 | 20 / 0 | 20 | 23.450 |
| easy-campaign | firewall-only | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.517 |
| easy-campaign | firewall-only | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.433 |
| easy-campaign | firewall-only | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 1 | 7 / 0 | 20 | 11.083 |
| easy-campaign | firewall-only | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.667 |
| easy-campaign | firewall-only | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 16.317 |
| easy-campaign | firewall-only | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.517 |
| easy-campaign | firewall-only | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 4 | 25 / 0 | 20 | 26.217 |
| easy-campaign | firewall-only | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 2 | 17 / 0 | 20 | 23.300 |
| easy-campaign | firewall-only | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 6 | 33 / 0 | 20 | 32.150 |
| easy-campaign | firewall-only | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 9 | 37 / 0 | 20 | 49.000 |
| easy-campaign | no-support | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | no-support | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 12.950 |
| easy-campaign | no-support | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 14.150 |
| easy-campaign | no-support | 4 | 11 / 7200 | 11 | 743.6 / 0 | 5 | 11 / 0 | 20 | 13.400 |
| easy-campaign | no-support | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 27.167 |
| easy-campaign | no-support | 6 | 10 / 10000 | 10 | 877.9 / 0 | 3 | 10 / 0 | 20 | 11.667 |
| easy-campaign | no-support | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 17.783 |
| easy-campaign | no-support | 8 | 10 / 10000 | 10 | 895.5 / 0 | 2 | 10 / 0 | 20 | 11.500 |
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
| easy-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 26.217 |
| easy-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 11.483 |
| easy-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 5 | 19 / 0 | 20 | 18.383 |
| easy-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.617 |
| easy-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 22.883 |
| easy-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 2 | 8 / 0 | 20 | 10.317 |
| easy-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 4 | 18 / 0 | 20 | 19.233 |
| easy-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 1 | 7 / 0 | 20 | 11.100 |
| easy-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 1 | 14 / 0 | 20 | 18.783 |
| easy-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 15.233 |
| easy-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.117 |
| easy-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 3 | 25 / 0 | 20 | 26.033 |
| easy-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 23.083 |
| easy-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 4 | 33 / 0 | 20 | 32.350 |
| easy-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 10 | 37 / 0 | 20 | 51.300 |
| easy-campaign | weak-placement | 1 | 8 / 8600 | 8 | 360.0 / 0 | 8 | 0 / 8 | 12 | 31.567 |
| easy-campaign | weak-placement | 2 | 10 / 6750 | 10 | 472.5 / 0 | 10 | 0 / 10 | 2 | 29.717 |
| easy-campaign | weak-placement | 3 | 11 / 7700 | 11 | 643.5 / 0 | 11 | 0 / 2 | 0 | 24.183 |
| easy-campaign | counter-aware | 1 | 8 / 8600 | 8 | 360.0 / 0 | 3 | 8 / 0 | 20 | 12.450 |
| easy-campaign | counter-aware | 2 | 10 / 6750 | 10 | 472.5 / 0 | 6 | 10 / 0 | 20 | 12.950 |
| easy-campaign | counter-aware | 3 | 11 / 7700 | 11 | 643.5 / 0 | 6 | 11 / 0 | 20 | 14.150 |
| easy-campaign | counter-aware | 4 | 11 / 7200 | 11 | 743.6 / 0 | 6 | 11 / 0 | 20 | 14.133 |
| easy-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1337.3 / 0 | 9 | 17 / 0 | 20 | 24.500 |
| easy-campaign | counter-aware | 6 | 10 / 10000 | 10 | 877.9 / 0 | 2 | 10 / 0 | 20 | 11.500 |
| easy-campaign | counter-aware | 7 | 19 / 16700 | 19 | 1379.3 / 0 | 4 | 19 / 0 | 20 | 18.317 |
| easy-campaign | counter-aware | 8 | 10 / 10000 | 10 | 895.5 / 0 | 3 | 10 / 0 | 20 | 11.767 |
| easy-campaign | counter-aware | 9 | 17 / 18000 | 17 | 1749.0 / 0 | 3 | 17 / 0 | 20 | 19.267 |
| easy-campaign | counter-aware | 10 | 16 / 14700 | 20 | 2537.3 / 0 | 10 | 20 / 0 | 20 | 21.700 |
| easy-campaign | counter-aware | 11 | 8 / 9200 | 8 | 1222.5 / 0 | 1 | 8 / 0 | 20 | 10.317 |
| easy-campaign | counter-aware | 12 | 18 / 18100 | 18 | 2285.4 / 0 | 3 | 18 / 0 | 20 | 19.283 |
| easy-campaign | counter-aware | 13 | 7 / 9500 | 7 | 1332.2 / 0 | 2 | 7 / 0 | 20 | 11.100 |
| easy-campaign | counter-aware | 14 | 14 / 17000 | 14 | 2543.3 / 0 | 2 | 14 / 0 | 20 | 18.617 |
| easy-campaign | counter-aware | 15 | 12 / 12000 | 12 | 3088.1 / 249 | 4 | 12 / 0 | 20 | 15.617 |
| easy-campaign | counter-aware | 16 | 15 / 17100 | 15 | 3472.5 / 0 | 3 | 15 / 0 | 20 | 19.017 |
| easy-campaign | counter-aware | 17 | 25 / 24600 | 25 | 5511.4 / 0 | 3 | 25 / 0 | 20 | 26.283 |
| easy-campaign | counter-aware | 18 | 17 / 18000 | 17 | 4853.3 / 299 | 3 | 17 / 0 | 20 | 22.900 |
| easy-campaign | counter-aware | 19 | 33 / 30700 | 33 | 7856.1 / 0 | 5 | 33 / 0 | 20 | 32.800 |
| easy-campaign | counter-aware | 20 | 33 / 43400 | 37 | 11194.5 / 698 | 9 | 37 / 0 | 20 | 51.267 |
| normal-campaign | existing | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | existing | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 15.400 |
| normal-campaign | existing | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| normal-campaign | existing | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 15.683 |
| normal-campaign | existing | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 25.850 |
| normal-campaign | existing | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.467 |
| normal-campaign | existing | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 18.167 |
| normal-campaign | existing | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 12.217 |
| normal-campaign | existing | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 19.783 |
| normal-campaign | existing | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 27.117 |
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
| normal-campaign | firewall-only | 3 | 11 / 7700 | 11 | 858.0 / 0 | 5 | 11 / 0 | 20 | 12.017 |
| normal-campaign | firewall-only | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 12.267 |
| normal-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 25.917 |
| normal-campaign | firewall-only | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 3 | 10 / 0 | 20 | 11.550 |
| normal-campaign | firewall-only | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 17.683 |
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
| normal-campaign | no-support | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 15.400 |
| normal-campaign | no-support | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| normal-campaign | no-support | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.317 |
| normal-campaign | no-support | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 7 | 17 / 0 | 20 | 27.033 |
| normal-campaign | no-support | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 5 | 10 / 0 | 20 | 16.050 |
| normal-campaign | no-support | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 4 | 19 / 0 | 20 | 18.233 |
| normal-campaign | no-support | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 12.167 |
| normal-campaign | no-support | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 20.283 |
| normal-campaign | no-support | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 10 | 20 / 0 | 20 | 26.933 |
| normal-campaign | no-support | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.700 |
| normal-campaign | no-support | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.417 |
| normal-campaign | no-support | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 2 | 7 / 0 | 20 | 11.617 |
| normal-campaign | no-support | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 19.050 |
| normal-campaign | no-support | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 20.433 |
| normal-campaign | no-support | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 5 | 15 / 0 | 20 | 22.867 |
| normal-campaign | no-support | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 4 | 25 / 0 | 20 | 26.750 |
| normal-campaign | no-support | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 3 | 17 / 0 | 20 | 25.067 |
| normal-campaign | no-support | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 6 | 33 / 0 | 20 | 32.833 |
| normal-campaign | no-support | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 10 | 37 / 0 | 20 | 51.583 |
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
| normal-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 16.050 |
| normal-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 26.217 |
| normal-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.417 |
| normal-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 4 | 19 / 0 | 20 | 18.000 |
| normal-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 11.583 |
| normal-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 19.783 |
| normal-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 27.417 |
| normal-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 1630.0 / 0 | 2 | 8 / 0 | 20 | 10.667 |
| normal-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 3047.3 / 0 | 3 | 18 / 0 | 20 | 19.583 |
| normal-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 1776.2 / 0 | 1 | 7 / 0 | 20 | 11.050 |
| normal-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 3391.0 / 0 | 2 | 14 / 0 | 20 | 19.150 |
| normal-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 4117.5 / 333 | 4 | 12 / 0 | 20 | 17.933 |
| normal-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 4630.0 / 0 | 3 | 15 / 0 | 20 | 19.683 |
| normal-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 7348.5 / 0 | 5 | 25 / 0 | 20 | 27.300 |
| normal-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 6471.0 / 399 | 4 | 17 / 0 | 20 | 25.467 |
| normal-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 10474.8 / 0 | 7 | 33 / 0 | 20 | 33.483 |
| normal-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 14926.0 / 930 | 10 | 37 / 0 | 20 | 51.667 |
| normal-campaign | weak-placement | 1 | 8 / 8600 | 8 | 480.0 / 0 | 8 | 0 / 8 | 12 | 28.117 |
| normal-campaign | weak-placement | 2 | 10 / 6750 | 10 | 630.0 / 0 | 10 | 0 / 10 | 2 | 26.267 |
| normal-campaign | weak-placement | 3 | 11 / 7700 | 11 | 858.0 / 0 | 11 | 0 / 2 | 0 | 20.733 |
| normal-campaign | counter-aware | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | counter-aware | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 15.400 |
| normal-campaign | counter-aware | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| normal-campaign | counter-aware | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 15.683 |
| normal-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 9 | 17 / 0 | 20 | 25.850 |
| normal-campaign | counter-aware | 6 | 10 / 10000 | 10 | 1170.5 / 0 | 2 | 10 / 0 | 20 | 11.467 |
| normal-campaign | counter-aware | 7 | 19 / 16700 | 19 | 1839.0 / 0 | 3 | 19 / 0 | 20 | 18.167 |
| normal-campaign | counter-aware | 8 | 10 / 10000 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 12.217 |
| normal-campaign | counter-aware | 9 | 17 / 18000 | 17 | 2332.0 / 0 | 3 | 17 / 0 | 20 | 19.783 |
| normal-campaign | counter-aware | 10 | 16 / 14700 | 20 | 3383.0 / 0 | 9 | 20 / 0 | 20 | 27.117 |
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
| hard-campaign | existing | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 17.617 |
| hard-campaign | existing | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.050 |
| hard-campaign | existing | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.483 |
| hard-campaign | existing | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.317 |
| hard-campaign | existing | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 4 | 10 / 0 | 20 | 14.400 |
| hard-campaign | existing | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 5 | 19 / 0 | 20 | 21.850 |
| hard-campaign | existing | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.050 |
| hard-campaign | existing | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 3 | 17 / 0 | 20 | 20.050 |
| hard-campaign | existing | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 27.117 |
| hard-campaign | existing | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.400 |
| hard-campaign | existing | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 3 | 18 / 0 | 20 | 22.317 |
| hard-campaign | existing | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.017 |
| hard-campaign | existing | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 20.800 |
| hard-campaign | existing | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 5 | 12 / 0 | 20 | 21.067 |
| hard-campaign | existing | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 5 | 15 / 0 | 20 | 22.350 |
| hard-campaign | existing | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 6 | 25 / 0 | 20 | 30.267 |
| hard-campaign | existing | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 4 | 17 / 0 | 20 | 26.283 |
| hard-campaign | existing | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 7 | 33 / 0 | 20 | 36.667 |
| hard-campaign | existing | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 16 | 37 / 0 | 20 | 53.867 |
| hard-campaign | firewall-only | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 14.983 |
| hard-campaign | firewall-only | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 15.300 |
| hard-campaign | firewall-only | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 14.083 |
| hard-campaign | firewall-only | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 15.133 |
| hard-campaign | firewall-only | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 28.567 |
| hard-campaign | firewall-only | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.617 |
| hard-campaign | firewall-only | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 5 | 19 / 0 | 20 | 21.600 |
| hard-campaign | firewall-only | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.033 |
| hard-campaign | firewall-only | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 4 | 17 / 0 | 20 | 20.333 |
| hard-campaign | firewall-only | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 12 | 20 / 0 | 20 | 25.567 |
| hard-campaign | firewall-only | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 2 | 8 / 0 | 20 | 11.567 |
| hard-campaign | firewall-only | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 19.283 |
| hard-campaign | firewall-only | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.933 |
| hard-campaign | firewall-only | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 2 | 14 / 0 | 20 | 19.300 |
| hard-campaign | firewall-only | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 6 | 12 / 0 | 20 | 23.767 |
| hard-campaign | firewall-only | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 6 | 15 / 0 | 20 | 23.400 |
| hard-campaign | firewall-only | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 5 | 25 / 0 | 20 | 29.733 |
| hard-campaign | firewall-only | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 5 | 17 / 0 | 20 | 29.267 |
| hard-campaign | firewall-only | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 37.667 |
| hard-campaign | firewall-only | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 13 | 37 / 0 | 20 | 53.517 |
| hard-campaign | no-support | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | no-support | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 17.617 |
| hard-campaign | no-support | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.050 |
| hard-campaign | no-support | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 15.767 |
| hard-campaign | no-support | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 30.967 |
| hard-campaign | no-support | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 16.167 |
| hard-campaign | no-support | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 6 | 19 / 0 | 20 | 22.550 |
| hard-campaign | no-support | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.050 |
| hard-campaign | no-support | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 4 | 17 / 0 | 20 | 20.217 |
| hard-campaign | no-support | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 10 | 20 / 0 | 20 | 26.867 |
| hard-campaign | no-support | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.417 |
| hard-campaign | no-support | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 4 | 18 / 0 | 20 | 23.350 |
| hard-campaign | no-support | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 3 | 7 / 0 | 20 | 12.767 |
| hard-campaign | no-support | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 20.917 |
| hard-campaign | no-support | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 6 | 12 / 0 | 20 | 25.050 |
| hard-campaign | no-support | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 7 | 15 / 0 | 20 | 23.183 |
| hard-campaign | no-support | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 8 | 25 / 0 | 20 | 32.100 |
| hard-campaign | no-support | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 6 | 17 / 0 | 20 | 29.400 |
| hard-campaign | no-support | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 37.633 |
| hard-campaign | no-support | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 15 | 37 / 0 | 20 | 54.117 |
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
| hard-campaign | upgrade-heavy | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 15.667 |
| hard-campaign | upgrade-heavy | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 5 | 19 / 0 | 20 | 22.233 |
| hard-campaign | upgrade-heavy | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 12.583 |
| hard-campaign | upgrade-heavy | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 4 | 17 / 0 | 20 | 20.800 |
| hard-campaign | upgrade-heavy | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 27.917 |
| hard-campaign | upgrade-heavy | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.050 |
| hard-campaign | upgrade-heavy | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 5 | 18 / 0 | 20 | 23.050 |
| hard-campaign | upgrade-heavy | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 11.683 |
| hard-campaign | upgrade-heavy | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 3 | 14 / 0 | 20 | 19.383 |
| hard-campaign | upgrade-heavy | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 4 | 12 / 0 | 20 | 20.833 |
| hard-campaign | upgrade-heavy | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 4 | 15 / 0 | 20 | 20.850 |
| hard-campaign | upgrade-heavy | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 5 | 25 / 0 | 20 | 28.567 |
| hard-campaign | upgrade-heavy | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 5 | 17 / 0 | 20 | 27.450 |
| hard-campaign | upgrade-heavy | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 8 | 33 / 0 | 20 | 38.083 |
| hard-campaign | upgrade-heavy | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 15 | 37 / 0 | 20 | 52.750 |
| hard-campaign | weak-placement | 1 | 8 / 8600 | 8 | 648.0 / 0 | 8 | 0 / 8 | 12 | 25.567 |
| hard-campaign | weak-placement | 2 | 10 / 6750 | 10 | 850.5 / 0 | 10 | 0 / 10 | 2 | 23.717 |
| hard-campaign | weak-placement | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 11 | 0 / 2 | 0 | 18.183 |
| hard-campaign | counter-aware | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | counter-aware | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 17.617 |
| hard-campaign | counter-aware | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.050 |
| hard-campaign | counter-aware | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.483 |
| hard-campaign | counter-aware | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.317 |
| hard-campaign | counter-aware | 6 | 10 / 10000 | 10 | 1580.2 / 0 | 4 | 10 / 0 | 20 | 14.400 |
| hard-campaign | counter-aware | 7 | 19 / 16700 | 19 | 2482.6 / 0 | 5 | 19 / 0 | 20 | 21.850 |
| hard-campaign | counter-aware | 8 | 10 / 10000 | 10 | 1611.9 / 0 | 2 | 10 / 0 | 20 | 12.050 |
| hard-campaign | counter-aware | 9 | 17 / 18000 | 17 | 3148.2 / 0 | 3 | 17 / 0 | 20 | 20.050 |
| hard-campaign | counter-aware | 10 | 16 / 14700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 27.117 |
| hard-campaign | counter-aware | 11 | 8 / 9200 | 8 | 2200.5 / 0 | 3 | 8 / 0 | 20 | 13.400 |
| hard-campaign | counter-aware | 12 | 18 / 18100 | 18 | 4113.8 / 0 | 3 | 18 / 0 | 20 | 22.317 |
| hard-campaign | counter-aware | 13 | 7 / 9500 | 7 | 2397.9 / 0 | 2 | 7 / 0 | 20 | 12.017 |
| hard-campaign | counter-aware | 14 | 14 / 17000 | 14 | 4577.9 / 0 | 4 | 14 / 0 | 20 | 20.800 |
| hard-campaign | counter-aware | 15 | 12 / 12000 | 12 | 5558.6 / 449 | 5 | 12 / 0 | 20 | 21.067 |
| hard-campaign | counter-aware | 16 | 15 / 17100 | 15 | 6250.5 / 0 | 5 | 15 / 0 | 20 | 22.350 |
| hard-campaign | counter-aware | 17 | 25 / 24600 | 25 | 9920.5 / 0 | 6 | 25 / 0 | 20 | 30.267 |
| hard-campaign | counter-aware | 18 | 17 / 18000 | 17 | 8735.9 / 539 | 4 | 17 / 0 | 20 | 26.283 |
| hard-campaign | counter-aware | 19 | 33 / 30700 | 33 | 14140.9 / 0 | 7 | 33 / 0 | 20 | 36.667 |
| hard-campaign | counter-aware | 20 | 33 / 43400 | 37 | 20150.1 / 1256 | 16 | 37 / 0 | 20 | 53.867 |
