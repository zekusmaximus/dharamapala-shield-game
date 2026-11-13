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
| normal-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 375.167 | 2237/3832/0 | 9215/1062/0 | 7390/3681/0 | 3932/1153/0 | 102 |
| normal-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 368.967 | 1910/4894/0 | 9440/0/0 | 7390/3681/0 | 3830/1153/0 | 0 |
| normal-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 391.967 | 2205/3892/0 | 9145/1002/0 | 7390/3681/0 | 3830/1153/0 | 0 |
| normal-campaign | expansion-heavy | VICTORY (20) | 10 / 2 | 5/2/0 | 506.333 | 7540/4678/0 | 3360/0/0 | 6940/3465/0 | 3830/1153/0 | 0 |
| normal-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 364.333 | 2220/3892/0 | 9130/1002/0 | 7390/3681/0 | 3830/1153/0 | 0 |
| normal-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 75.117 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| normal-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 375.167 | 2237/3832/0 | 9215/1062/0 | 7390/3681/0 | 3932/1153/0 | 102 |
| hard-campaign | existing | VICTORY (20) | 20 / 0 | 7/0/0 | 408.100 | 1946/3332/0 | 8347/1062/0 | 6231/3181/0 | 3932/1153/0 | 102 |
| hard-campaign | firewall-only | VICTORY (20) | 20 / 0 | 7/0/0 | 406.950 | 2053/4394/0 | 8138/0/0 | 6231/3181/0 | 3830/1153/0 | 0 |
| hard-campaign | no-support | VICTORY (20) | 20 / 0 | 7/0/0 | 426.183 | 1914/3392/0 | 8277/1002/0 | 6231/3181/0 | 3830/1153/0 | 0 |
| hard-campaign | expansion-heavy | GAME_OVER (20) | 0 / 4 | 3/4/0 | 523.000 | 5677/3909/0 | 3360/0/0 | 5467/2813/0 | 3440/1036/0 | 0 |
| hard-campaign | upgrade-heavy | VICTORY (20) | 20 / 0 | 7/0/0 | 405.217 | 1793/3898/0 | 8398/496/0 | 6231/3181/0 | 3830/1153/0 | 0 |
| hard-campaign | weak-placement | GAME_OVER (3) | 0 / 20 | 0/0/0 | 67.467 | 46/60/0 | 199/35/0 | 0/0/0 | 115/35/0 | 0 |
| hard-campaign | counter-aware | VICTORY (20) | 20 / 0 | 7/0/0 | 408.100 | 1946/3332/0 | 8347/1062/0 | 6231/3181/0 | 3932/1153/0 | 102 |

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
| normal-campaign | existing | encryption | 7440.195 | 225.596 | 44 | 423 | 248 | 248 | 0 |
| normal-campaign | existing | firewall | 63230.305 | 3237.512 | 276 | 1525 | 0 | 0 | 0 |
| normal-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 960 |
| normal-campaign | firewall-only | firewall | 70670.500 | 3002.744 | 320 | 1827 | 0 | 0 | 0 |
| normal-campaign | no-support | encryption | 6915.629 | 183.488 | 32 | 401 | 229 | 229 | 0 |
| normal-campaign | no-support | firewall | 63754.871 | 3232.656 | 288 | 1504 | 0 | 0 | 0 |
| normal-campaign | expansion-heavy | firewall | 69572.500 | 2993 | 318 | 12033 | 0 | 0 | 0 |
| normal-campaign | upgrade-heavy | encryption | 5472.635 | 220.588 | 29 | 354 | 206 | 206 | 0 |
| normal-campaign | upgrade-heavy | firewall | 65197.865 | 3276.462 | 291 | 1780 | 0 | 0 | 0 |
| normal-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| normal-campaign | weak-placement | firewall | 134 | 0 | 0 | 6 | 0 | 0 | 0 |
| normal-campaign | counter-aware | encryption | 7440.195 | 225.596 | 44 | 423 | 248 | 248 | 0 |
| normal-campaign | counter-aware | firewall | 63230.305 | 3237.512 | 276 | 1525 | 0 | 0 | 0 |
| normal-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 960 |
| hard-campaign | existing | encryption | 8775.060 | 336.497 | 48 | 456 | 302 | 302 | 0 |
| hard-campaign | existing | firewall | 86630.115 | 3874.551 | 272 | 1940 | 0 | 0 | 0 |
| hard-campaign | existing | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1326 |
| hard-campaign | firewall-only | firewall | 95405.175 | 4529.183 | 320 | 2268 | 0 | 0 | 0 |
| hard-campaign | no-support | encryption | 8489.552 | 335.278 | 40 | 431 | 288 | 288 | 0 |
| hard-campaign | no-support | firewall | 86915.623 | 3614.942 | 280 | 1973 | 0 | 0 | 0 |
| hard-campaign | expansion-heavy | firewall | 91692.675 | 4081 | 316 | 13271 | 0 | 0 | 0 |
| hard-campaign | upgrade-heavy | encryption | 7308.734 | 287.070 | 43 | 399 | 269 | 269 | 0 |
| hard-campaign | upgrade-heavy | firewall | 88096.441 | 3947.569 | 277 | 2219 | 0 | 0 | 0 |
| hard-campaign | weak-placement | encryption | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| hard-campaign | weak-placement | firewall | 134 | 0 | 0 | 5 | 0 | 0 | 0 |
| hard-campaign | counter-aware | encryption | 8775.060 | 336.497 | 48 | 456 | 302 | 302 | 0 |
| hard-campaign | counter-aware | firewall | 86630.115 | 3874.551 | 272 | 1940 | 0 | 0 | 0 |
| hard-campaign | counter-aware | distributor | 0 | 0 | 0 | 0 | 0 | 0 | 1326 |

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
| normal-campaign | existing | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | existing | 2 | 10 / 6750 | 10 | 630.0 / 0 | 8 | 10 / 0 | 20 | 16.667 |
| normal-campaign | existing | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.850 |
| normal-campaign | existing | 4 | 11 / 7200 | 11 | 991.5 / 0 | 7 | 11 / 0 | 20 | 16.233 |
| normal-campaign | existing | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 11 | 17 / 0 | 20 | 24.667 |
| normal-campaign | existing | 6 | 10 / 7600 | 10 | 1170.5 / 0 | 4 | 10 / 0 | 20 | 11.633 |
| normal-campaign | existing | 7 | 19 / 8900 | 19 | 1839.0 / 0 | 11 | 19 / 0 | 20 | 16.850 |
| normal-campaign | existing | 8 | 10 / 9700 | 10 | 1194.0 / 0 | 3 | 10 / 0 | 20 | 11.150 |
| normal-campaign | existing | 9 | 17 / 10000 | 17 | 2332.0 / 0 | 9 | 17 / 0 | 20 | 17.667 |
| normal-campaign | existing | 10 | 16 / 13700 | 20 | 3383.0 / 0 | 12 | 20 / 0 | 20 | 24.983 |
| normal-campaign | existing | 11 | 8 / 6500 | 8 | 1630.0 / 0 | 4 | 8 / 0 | 20 | 10.017 |
| normal-campaign | existing | 12 | 18 / 10600 | 18 | 3047.3 / 0 | 9 | 18 / 0 | 20 | 17.200 |
| normal-campaign | existing | 13 | 7 / 6700 | 7 | 1776.3 / 0 | 3 | 7 / 0 | 20 | 10.100 |
| normal-campaign | existing | 14 | 15 / 9200 | 15 | 3372.0 / 0 | 8 | 15 / 0 | 20 | 17.033 |
| normal-campaign | existing | 15 | 12 / 9400 | 12 | 4117.5 / 333 | 7 | 12 / 0 | 20 | 18.917 |
| normal-campaign | existing | 16 | 15 / 12100 | 15 | 4630.0 / 0 | 6 | 15 / 0 | 20 | 18.550 |
| normal-campaign | existing | 17 | 25 / 10500 | 25 | 7153.5 / 0 | 16 | 25 / 0 | 20 | 22.633 |
| normal-campaign | existing | 18 | 17 / 8800 | 17 | 6156.0 / 399 | 10 | 17 / 0 | 20 | 20.700 |
| normal-campaign | existing | 19 | 33 / 18700 | 33 | 9873.0 / 0 | 16 | 33 / 0 | 20 | 29.450 |
| normal-campaign | existing | 20 | 33 / 18700 | 37 | 14254.0 / 930 | 18 | 37 / 0 | 20 | 39.200 |
| normal-campaign | firewall-only | 1 | 8 / 8600 | 8 | 480.0 / 0 | 3 | 8 / 0 | 20 | 11.167 |
| normal-campaign | firewall-only | 2 | 10 / 6750 | 10 | 630.0 / 0 | 5 | 10 / 0 | 20 | 10.817 |
| normal-campaign | firewall-only | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 14.067 |
| normal-campaign | firewall-only | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.750 |
| normal-campaign | firewall-only | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 11 | 17 / 0 | 20 | 22.650 |
| normal-campaign | firewall-only | 6 | 10 / 7600 | 10 | 1170.5 / 0 | 5 | 10 / 0 | 20 | 13.333 |
| normal-campaign | firewall-only | 7 | 19 / 8900 | 19 | 1839.0 / 0 | 12 | 19 / 0 | 20 | 17.750 |
| normal-campaign | firewall-only | 8 | 10 / 9700 | 10 | 1194.0 / 0 | 3 | 10 / 0 | 20 | 11.267 |
| normal-campaign | firewall-only | 9 | 17 / 10000 | 17 | 2332.0 / 0 | 9 | 17 / 0 | 20 | 18.000 |
| normal-campaign | firewall-only | 10 | 16 / 13700 | 20 | 3383.0 / 0 | 11 | 20 / 0 | 20 | 23.850 |
| normal-campaign | firewall-only | 11 | 8 / 6500 | 8 | 1630.0 / 0 | 4 | 8 / 0 | 20 | 10.300 |
| normal-campaign | firewall-only | 12 | 18 / 10600 | 18 | 3047.3 / 0 | 9 | 18 / 0 | 20 | 18.100 |
| normal-campaign | firewall-only | 13 | 7 / 6700 | 7 | 1776.3 / 0 | 2 | 7 / 0 | 20 | 8.833 |
| normal-campaign | firewall-only | 14 | 15 / 9200 | 15 | 3372.0 / 0 | 7 | 15 / 0 | 20 | 17.933 |
| normal-campaign | firewall-only | 15 | 12 / 9400 | 12 | 4117.5 / 333 | 6 | 12 / 0 | 20 | 21.600 |
| normal-campaign | firewall-only | 16 | 15 / 12100 | 15 | 4630.0 / 0 | 7 | 15 / 0 | 20 | 19.633 |
| normal-campaign | firewall-only | 17 | 25 / 10500 | 25 | 7153.5 / 0 | 17 | 25 / 0 | 20 | 23.617 |
| normal-campaign | firewall-only | 18 | 17 / 8800 | 17 | 6156.0 / 399 | 11 | 17 / 0 | 20 | 22.933 |
| normal-campaign | firewall-only | 19 | 33 / 18700 | 33 | 9873.0 / 0 | 14 | 33 / 0 | 20 | 29.000 |
| normal-campaign | firewall-only | 20 | 33 / 18700 | 37 | 14254.0 / 930 | 18 | 37 / 0 | 20 | 39.367 |
| normal-campaign | no-support | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | no-support | 2 | 10 / 6750 | 10 | 630.0 / 0 | 8 | 10 / 0 | 20 | 16.667 |
| normal-campaign | no-support | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.850 |
| normal-campaign | no-support | 4 | 11 / 7200 | 11 | 991.5 / 0 | 7 | 11 / 0 | 20 | 16.267 |
| normal-campaign | no-support | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 7 | 17 / 0 | 20 | 25.967 |
| normal-campaign | no-support | 6 | 10 / 7600 | 10 | 1170.5 / 0 | 6 | 10 / 0 | 20 | 15.683 |
| normal-campaign | no-support | 7 | 19 / 8900 | 19 | 1839.0 / 0 | 12 | 19 / 0 | 20 | 19.850 |
| normal-campaign | no-support | 8 | 10 / 9700 | 10 | 1194.0 / 0 | 3 | 10 / 0 | 20 | 11.283 |
| normal-campaign | no-support | 9 | 17 / 10000 | 17 | 2332.0 / 0 | 9 | 17 / 0 | 20 | 18.483 |
| normal-campaign | no-support | 10 | 16 / 13700 | 20 | 3383.0 / 0 | 12 | 20 / 0 | 20 | 23.967 |
| normal-campaign | no-support | 11 | 8 / 6500 | 8 | 1630.0 / 0 | 5 | 8 / 0 | 20 | 11.583 |
| normal-campaign | no-support | 12 | 18 / 10600 | 18 | 3047.3 / 0 | 8 | 18 / 0 | 20 | 16.983 |
| normal-campaign | no-support | 13 | 7 / 6700 | 7 | 1776.3 / 0 | 3 | 7 / 0 | 20 | 10.083 |
| normal-campaign | no-support | 14 | 15 / 9200 | 15 | 3372.0 / 0 | 7 | 15 / 0 | 20 | 17.300 |
| normal-campaign | no-support | 15 | 12 / 9400 | 12 | 4117.5 / 333 | 7 | 12 / 0 | 20 | 22.617 |
| normal-campaign | no-support | 16 | 15 / 12100 | 15 | 4630.0 / 0 | 8 | 15 / 0 | 20 | 19.567 |
| normal-campaign | no-support | 17 | 25 / 10500 | 25 | 7153.5 / 0 | 17 | 25 / 0 | 20 | 23.133 |
| normal-campaign | no-support | 18 | 17 / 8800 | 17 | 6156.0 / 399 | 11 | 17 / 0 | 20 | 23.433 |
| normal-campaign | no-support | 19 | 33 / 18700 | 33 | 9873.0 / 0 | 15 | 33 / 0 | 20 | 28.667 |
| normal-campaign | no-support | 20 | 33 / 18700 | 37 | 14254.0 / 930 | 19 | 37 / 0 | 20 | 38.917 |
| normal-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 480.0 / 0 | 2 | 8 / 0 | 20 | 10.300 |
| normal-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 630.0 / 0 | 5 | 10 / 0 | 20 | 11.800 |
| normal-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 14.033 |
| normal-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.433 |
| normal-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 7 | 17 / 0 | 20 | 26.467 |
| normal-campaign | expansion-heavy | 6 | 10 / 7600 | 10 | 1170.5 / 0 | 3 | 10 / 0 | 20 | 10.233 |
| normal-campaign | expansion-heavy | 7 | 19 / 8900 | 19 | 1839.0 / 0 | 10 | 19 / 0 | 20 | 13.583 |
| normal-campaign | expansion-heavy | 8 | 10 / 9700 | 10 | 1194.0 / 0 | 2 | 10 / 0 | 20 | 10.400 |
| normal-campaign | expansion-heavy | 9 | 17 / 10000 | 17 | 2332.0 / 0 | 7 | 17 / 0 | 20 | 13.150 |
| normal-campaign | expansion-heavy | 10 | 16 / 13700 | 20 | 3383.0 / 0 | 10 | 20 / 0 | 20 | 21.283 |
| normal-campaign | expansion-heavy | 11 | 8 / 6500 | 8 | 1630.0 / 0 | 3 | 8 / 0 | 20 | 8.317 |
| normal-campaign | expansion-heavy | 12 | 18 / 10600 | 18 | 3047.3 / 0 | 8 | 18 / 0 | 20 | 13.250 |
| normal-campaign | expansion-heavy | 13 | 7 / 6700 | 7 | 1776.3 / 0 | 3 | 7 / 0 | 20 | 9.500 |
| normal-campaign | expansion-heavy | 14 | 15 / 9200 | 15 | 3372.0 / 0 | 7 | 15 / 0 | 20 | 14.867 |
| normal-campaign | expansion-heavy | 15 | 12 / 9400 | 12 | 4117.5 / 333 | 6 | 12 / 0 | 20 | 68.333 |
| normal-campaign | expansion-heavy | 16 | 15 / 12100 | 15 | 4630.0 / 0 | 7 | 15 / 0 | 20 | 16.667 |
| normal-campaign | expansion-heavy | 17 | 25 / 10500 | 25 | 7153.5 / 0 | 16 | 25 / 0 | 20 | 22.083 |
| normal-campaign | expansion-heavy | 18 | 17 / 8800 | 17 | 6156.0 / 399 | 11 | 17 / 0 | 20 | 81.900 |
| normal-campaign | expansion-heavy | 19 | 33 / 18700 | 33 | 9873.0 / 0 | 17 | 33 / 0 | 20 | 28.700 |
| normal-campaign | expansion-heavy | 20 | 33 / 18700 | 37 | 14254.0 / 930 | 24 | 35 / 2 | 10 | 97.033 |
| normal-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 630.0 / 0 | 6 | 10 / 0 | 20 | 13.250 |
| normal-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.117 |
| normal-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 991.5 / 0 | 6 | 11 / 0 | 20 | 14.900 |
| normal-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 11 | 17 / 0 | 20 | 23.883 |
| normal-campaign | upgrade-heavy | 6 | 10 / 7600 | 10 | 1170.5 / 0 | 4 | 10 / 0 | 20 | 11.800 |
| normal-campaign | upgrade-heavy | 7 | 19 / 8900 | 19 | 1839.0 / 0 | 11 | 19 / 0 | 20 | 17.800 |
| normal-campaign | upgrade-heavy | 8 | 10 / 9700 | 10 | 1194.0 / 0 | 3 | 10 / 0 | 20 | 11.333 |
| normal-campaign | upgrade-heavy | 9 | 17 / 10000 | 17 | 2332.0 / 0 | 9 | 17 / 0 | 20 | 17.500 |
| normal-campaign | upgrade-heavy | 10 | 16 / 13700 | 20 | 3383.0 / 0 | 11 | 20 / 0 | 20 | 23.650 |
| normal-campaign | upgrade-heavy | 11 | 8 / 6500 | 8 | 1630.0 / 0 | 3 | 8 / 0 | 20 | 9.433 |
| normal-campaign | upgrade-heavy | 12 | 18 / 10600 | 18 | 3047.3 / 0 | 9 | 18 / 0 | 20 | 17.000 |
| normal-campaign | upgrade-heavy | 13 | 7 / 6700 | 7 | 1776.3 / 0 | 2 | 7 / 0 | 20 | 8.917 |
| normal-campaign | upgrade-heavy | 14 | 15 / 9200 | 15 | 3372.0 / 0 | 7 | 15 / 0 | 20 | 16.100 |
| normal-campaign | upgrade-heavy | 15 | 12 / 9400 | 12 | 4117.5 / 333 | 6 | 12 / 0 | 20 | 17.350 |
| normal-campaign | upgrade-heavy | 16 | 15 / 12100 | 15 | 4630.0 / 0 | 7 | 15 / 0 | 20 | 18.783 |
| normal-campaign | upgrade-heavy | 17 | 25 / 10500 | 25 | 7153.5 / 0 | 16 | 25 / 0 | 20 | 23.233 |
| normal-campaign | upgrade-heavy | 18 | 17 / 8800 | 17 | 6156.0 / 399 | 10 | 17 / 0 | 20 | 20.050 |
| normal-campaign | upgrade-heavy | 19 | 33 / 18700 | 33 | 9873.0 / 0 | 15 | 33 / 0 | 20 | 29.417 |
| normal-campaign | upgrade-heavy | 20 | 33 / 18700 | 37 | 14254.0 / 930 | 19 | 37 / 0 | 20 | 39.150 |
| normal-campaign | weak-placement | 1 | 8 / 8600 | 8 | 480.0 / 0 | 8 | 0 / 8 | 12 | 28.117 |
| normal-campaign | weak-placement | 2 | 10 / 6750 | 10 | 630.0 / 0 | 10 | 0 / 10 | 2 | 26.267 |
| normal-campaign | weak-placement | 3 | 11 / 7700 | 11 | 858.0 / 0 | 11 | 0 / 2 | 0 | 20.733 |
| normal-campaign | counter-aware | 1 | 8 / 8600 | 8 | 480.0 / 0 | 4 | 8 / 0 | 20 | 15.667 |
| normal-campaign | counter-aware | 2 | 10 / 6750 | 10 | 630.0 / 0 | 8 | 10 / 0 | 20 | 16.667 |
| normal-campaign | counter-aware | 3 | 11 / 7700 | 11 | 858.0 / 0 | 6 | 11 / 0 | 20 | 15.850 |
| normal-campaign | counter-aware | 4 | 11 / 7200 | 11 | 991.5 / 0 | 7 | 11 / 0 | 20 | 16.233 |
| normal-campaign | counter-aware | 5 | 13 / 8000 | 17 | 1783.0 / 0 | 11 | 17 / 0 | 20 | 24.667 |
| normal-campaign | counter-aware | 6 | 10 / 7600 | 10 | 1170.5 / 0 | 4 | 10 / 0 | 20 | 11.633 |
| normal-campaign | counter-aware | 7 | 19 / 8900 | 19 | 1839.0 / 0 | 11 | 19 / 0 | 20 | 16.850 |
| normal-campaign | counter-aware | 8 | 10 / 9700 | 10 | 1194.0 / 0 | 3 | 10 / 0 | 20 | 11.150 |
| normal-campaign | counter-aware | 9 | 17 / 10000 | 17 | 2332.0 / 0 | 9 | 17 / 0 | 20 | 17.667 |
| normal-campaign | counter-aware | 10 | 16 / 13700 | 20 | 3383.0 / 0 | 12 | 20 / 0 | 20 | 24.983 |
| normal-campaign | counter-aware | 11 | 8 / 6500 | 8 | 1630.0 / 0 | 4 | 8 / 0 | 20 | 10.017 |
| normal-campaign | counter-aware | 12 | 18 / 10600 | 18 | 3047.3 / 0 | 9 | 18 / 0 | 20 | 17.200 |
| normal-campaign | counter-aware | 13 | 7 / 6700 | 7 | 1776.3 / 0 | 3 | 7 / 0 | 20 | 10.100 |
| normal-campaign | counter-aware | 14 | 15 / 9200 | 15 | 3372.0 / 0 | 8 | 15 / 0 | 20 | 17.033 |
| normal-campaign | counter-aware | 15 | 12 / 9400 | 12 | 4117.5 / 333 | 7 | 12 / 0 | 20 | 18.917 |
| normal-campaign | counter-aware | 16 | 15 / 12100 | 15 | 4630.0 / 0 | 6 | 15 / 0 | 20 | 18.550 |
| normal-campaign | counter-aware | 17 | 25 / 10500 | 25 | 7153.5 / 0 | 16 | 25 / 0 | 20 | 22.633 |
| normal-campaign | counter-aware | 18 | 17 / 8800 | 17 | 6156.0 / 399 | 10 | 17 / 0 | 20 | 20.700 |
| normal-campaign | counter-aware | 19 | 33 / 18700 | 33 | 9873.0 / 0 | 16 | 33 / 0 | 20 | 29.450 |
| normal-campaign | counter-aware | 20 | 33 / 18700 | 37 | 14254.0 / 930 | 18 | 37 / 0 | 20 | 39.200 |
| hard-campaign | existing | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | existing | 2 | 10 / 6750 | 10 | 850.5 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | existing | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | existing | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.333 |
| hard-campaign | existing | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 27.967 |
| hard-campaign | existing | 6 | 10 / 7600 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 13.550 |
| hard-campaign | existing | 7 | 19 / 8900 | 19 | 2482.7 / 0 | 12 | 19 / 0 | 20 | 18.833 |
| hard-campaign | existing | 8 | 10 / 9700 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 12.000 |
| hard-campaign | existing | 9 | 17 / 10000 | 17 | 3148.2 / 0 | 9 | 17 / 0 | 20 | 17.650 |
| hard-campaign | existing | 10 | 16 / 13700 | 20 | 4567.0 / 0 | 12 | 20 / 0 | 20 | 25.950 |
| hard-campaign | existing | 11 | 8 / 6500 | 8 | 2200.5 / 0 | 5 | 8 / 0 | 20 | 12.433 |
| hard-campaign | existing | 12 | 18 / 10600 | 18 | 4113.8 / 0 | 9 | 18 / 0 | 20 | 18.583 |
| hard-campaign | existing | 13 | 7 / 6700 | 7 | 2397.9 / 0 | 3 | 7 / 0 | 20 | 10.850 |
| hard-campaign | existing | 14 | 15 / 9200 | 15 | 4552.2 / 0 | 9 | 15 / 0 | 20 | 18.683 |
| hard-campaign | existing | 15 | 12 / 9400 | 12 | 5558.6 / 449 | 7 | 12 / 0 | 20 | 23.183 |
| hard-campaign | existing | 16 | 15 / 12100 | 15 | 6250.5 / 0 | 8 | 15 / 0 | 20 | 19.217 |
| hard-campaign | existing | 17 | 25 / 10500 | 25 | 9657.2 / 0 | 18 | 25 / 0 | 20 | 25.833 |
| hard-campaign | existing | 18 | 17 / 8800 | 17 | 8310.6 / 539 | 11 | 17 / 0 | 20 | 23.867 |
| hard-campaign | existing | 19 | 33 / 18700 | 33 | 13328.6 / 0 | 17 | 33 / 0 | 20 | 31.150 |
| hard-campaign | existing | 20 | 33 / 18700 | 37 | 19242.9 / 1256 | 20 | 37 / 0 | 20 | 40.700 |
| hard-campaign | firewall-only | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 14.983 |
| hard-campaign | firewall-only | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 15.300 |
| hard-campaign | firewall-only | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 15.000 |
| hard-campaign | firewall-only | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 16.333 |
| hard-campaign | firewall-only | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 27.450 |
| hard-campaign | firewall-only | 6 | 10 / 7600 | 10 | 1580.2 / 0 | 6 | 10 / 0 | 20 | 15.800 |
| hard-campaign | firewall-only | 7 | 19 / 8900 | 19 | 2482.7 / 0 | 11 | 19 / 0 | 20 | 19.433 |
| hard-campaign | firewall-only | 8 | 10 / 9700 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 11.200 |
| hard-campaign | firewall-only | 9 | 17 / 10000 | 17 | 3148.2 / 0 | 9 | 17 / 0 | 20 | 17.400 |
| hard-campaign | firewall-only | 10 | 16 / 13700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 23.967 |
| hard-campaign | firewall-only | 11 | 8 / 6500 | 8 | 2200.5 / 0 | 4 | 8 / 0 | 20 | 12.400 |
| hard-campaign | firewall-only | 12 | 18 / 10600 | 18 | 4113.8 / 0 | 10 | 18 / 0 | 20 | 18.867 |
| hard-campaign | firewall-only | 13 | 7 / 6700 | 7 | 2397.9 / 0 | 4 | 7 / 0 | 20 | 13.967 |
| hard-campaign | firewall-only | 14 | 15 / 9200 | 15 | 4552.2 / 0 | 9 | 15 / 0 | 20 | 18.817 |
| hard-campaign | firewall-only | 15 | 12 / 9400 | 12 | 5558.6 / 449 | 8 | 12 / 0 | 20 | 23.933 |
| hard-campaign | firewall-only | 16 | 15 / 12100 | 15 | 6250.5 / 0 | 9 | 15 / 0 | 20 | 20.217 |
| hard-campaign | firewall-only | 17 | 25 / 10500 | 25 | 9657.2 / 0 | 17 | 25 / 0 | 20 | 24.017 |
| hard-campaign | firewall-only | 18 | 17 / 8800 | 17 | 8310.6 / 539 | 12 | 17 / 0 | 20 | 26.200 |
| hard-campaign | firewall-only | 19 | 33 / 18700 | 33 | 13328.6 / 0 | 17 | 33 / 0 | 20 | 29.733 |
| hard-campaign | firewall-only | 20 | 33 / 18700 | 37 | 19242.9 / 1256 | 21 | 37 / 0 | 20 | 41.933 |
| hard-campaign | no-support | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | no-support | 2 | 10 / 6750 | 10 | 850.5 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | no-support | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | no-support | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.283 |
| hard-campaign | no-support | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 29.583 |
| hard-campaign | no-support | 6 | 10 / 7600 | 10 | 1580.2 / 0 | 7 | 10 / 0 | 20 | 16.133 |
| hard-campaign | no-support | 7 | 19 / 8900 | 19 | 2482.7 / 0 | 13 | 19 / 0 | 20 | 19.433 |
| hard-campaign | no-support | 8 | 10 / 9700 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 12.117 |
| hard-campaign | no-support | 9 | 17 / 10000 | 17 | 3148.2 / 0 | 10 | 17 / 0 | 20 | 19.717 |
| hard-campaign | no-support | 10 | 16 / 13700 | 20 | 4567.0 / 0 | 11 | 20 / 0 | 20 | 26.900 |
| hard-campaign | no-support | 11 | 8 / 6500 | 8 | 2200.5 / 0 | 5 | 8 / 0 | 20 | 13.417 |
| hard-campaign | no-support | 12 | 18 / 10600 | 18 | 4113.8 / 0 | 10 | 18 / 0 | 20 | 19.633 |
| hard-campaign | no-support | 13 | 7 / 6700 | 7 | 2397.9 / 0 | 3 | 7 / 0 | 20 | 11.833 |
| hard-campaign | no-support | 14 | 15 / 9200 | 15 | 4552.2 / 0 | 10 | 15 / 0 | 20 | 19.833 |
| hard-campaign | no-support | 15 | 12 / 9400 | 12 | 5558.6 / 449 | 8 | 12 / 0 | 20 | 24.933 |
| hard-campaign | no-support | 16 | 15 / 12100 | 15 | 6250.5 / 0 | 9 | 15 / 0 | 20 | 19.950 |
| hard-campaign | no-support | 17 | 25 / 10500 | 25 | 9657.2 / 0 | 18 | 25 / 0 | 20 | 25.517 |
| hard-campaign | no-support | 18 | 17 / 8800 | 17 | 8310.6 / 539 | 13 | 17 / 0 | 20 | 26.650 |
| hard-campaign | no-support | 19 | 33 / 18700 | 33 | 13328.6 / 0 | 17 | 33 / 0 | 20 | 31.217 |
| hard-campaign | no-support | 20 | 33 / 18700 | 37 | 19242.9 / 1256 | 20 | 37 / 0 | 20 | 41.717 |
| hard-campaign | expansion-heavy | 1 | 8 / 8600 | 8 | 648.0 / 0 | 3 | 8 / 0 | 20 | 11.183 |
| hard-campaign | expansion-heavy | 2 | 10 / 6750 | 10 | 850.5 / 0 | 5 | 10 / 0 | 20 | 11.933 |
| hard-campaign | expansion-heavy | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 14.250 |
| hard-campaign | expansion-heavy | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 6 | 11 / 0 | 20 | 15.067 |
| hard-campaign | expansion-heavy | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 34.850 |
| hard-campaign | expansion-heavy | 6 | 10 / 7600 | 10 | 1580.2 / 0 | 4 | 10 / 0 | 20 | 11.067 |
| hard-campaign | expansion-heavy | 7 | 19 / 8900 | 19 | 2482.7 / 0 | 10 | 19 / 0 | 20 | 13.783 |
| hard-campaign | expansion-heavy | 8 | 10 / 9700 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 10.800 |
| hard-campaign | expansion-heavy | 9 | 17 / 10000 | 17 | 3148.2 / 0 | 8 | 17 / 0 | 20 | 13.583 |
| hard-campaign | expansion-heavy | 10 | 16 / 13700 | 20 | 4567.0 / 0 | 12 | 20 / 0 | 20 | 25.333 |
| hard-campaign | expansion-heavy | 11 | 8 / 6500 | 8 | 2200.5 / 0 | 4 | 8 / 0 | 20 | 9.567 |
| hard-campaign | expansion-heavy | 12 | 18 / 10600 | 18 | 4113.8 / 0 | 9 | 18 / 0 | 20 | 14.417 |
| hard-campaign | expansion-heavy | 13 | 7 / 6700 | 7 | 2397.9 / 0 | 3 | 7 / 0 | 20 | 9.867 |
| hard-campaign | expansion-heavy | 14 | 15 / 9200 | 15 | 4552.2 / 0 | 7 | 15 / 0 | 20 | 15.750 |
| hard-campaign | expansion-heavy | 15 | 12 / 9400 | 12 | 5558.6 / 449 | 7 | 11 / 1 | 14 | 72.200 |
| hard-campaign | expansion-heavy | 16 | 15 / 12100 | 15 | 6250.5 / 0 | 9 | 15 / 0 | 14 | 19.050 |
| hard-campaign | expansion-heavy | 17 | 25 / 10500 | 25 | 9657.2 / 0 | 17 | 25 / 0 | 14 | 23.967 |
| hard-campaign | expansion-heavy | 18 | 17 / 8800 | 17 | 8310.6 / 539 | 13 | 16 / 1 | 8 | 79.183 |
| hard-campaign | expansion-heavy | 19 | 33 / 18700 | 33 | 13328.6 / 0 | 19 | 33 / 0 | 8 | 30.967 |
| hard-campaign | expansion-heavy | 20 | 33 / 18700 | 37 | 19242.9 / 1256 | 24 | 35 / 2 | 0 | 86.183 |
| hard-campaign | upgrade-heavy | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | upgrade-heavy | 2 | 10 / 6750 | 10 | 850.5 / 0 | 7 | 10 / 0 | 20 | 15.267 |
| hard-campaign | upgrade-heavy | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | upgrade-heavy | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 15.767 |
| hard-campaign | upgrade-heavy | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 28.350 |
| hard-campaign | upgrade-heavy | 6 | 10 / 7600 | 10 | 1580.2 / 0 | 6 | 10 / 0 | 20 | 15.583 |
| hard-campaign | upgrade-heavy | 7 | 19 / 8900 | 19 | 2482.7 / 0 | 13 | 19 / 0 | 20 | 19.033 |
| hard-campaign | upgrade-heavy | 8 | 10 / 9700 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 12.117 |
| hard-campaign | upgrade-heavy | 9 | 17 / 10000 | 17 | 3148.2 / 0 | 10 | 17 / 0 | 20 | 19.000 |
| hard-campaign | upgrade-heavy | 10 | 16 / 13700 | 20 | 4567.0 / 0 | 13 | 20 / 0 | 20 | 26.200 |
| hard-campaign | upgrade-heavy | 11 | 8 / 6500 | 8 | 2200.5 / 0 | 5 | 8 / 0 | 20 | 13.700 |
| hard-campaign | upgrade-heavy | 12 | 18 / 10600 | 18 | 4113.8 / 0 | 10 | 18 / 0 | 20 | 18.383 |
| hard-campaign | upgrade-heavy | 13 | 7 / 6700 | 7 | 2397.9 / 0 | 3 | 7 / 0 | 20 | 10.083 |
| hard-campaign | upgrade-heavy | 14 | 15 / 9200 | 15 | 4552.2 / 0 | 7 | 15 / 0 | 20 | 18.200 |
| hard-campaign | upgrade-heavy | 15 | 12 / 9400 | 12 | 5558.6 / 449 | 6 | 12 / 0 | 20 | 22.533 |
| hard-campaign | upgrade-heavy | 16 | 15 / 12100 | 15 | 6250.5 / 0 | 8 | 15 / 0 | 20 | 19.133 |
| hard-campaign | upgrade-heavy | 17 | 25 / 10500 | 25 | 9657.2 / 0 | 17 | 25 / 0 | 20 | 23.667 |
| hard-campaign | upgrade-heavy | 18 | 17 / 8800 | 17 | 8310.6 / 539 | 11 | 17 / 0 | 20 | 23.600 |
| hard-campaign | upgrade-heavy | 19 | 33 / 18700 | 33 | 13328.6 / 0 | 17 | 33 / 0 | 20 | 30.967 |
| hard-campaign | upgrade-heavy | 20 | 33 / 18700 | 37 | 19242.9 / 1256 | 20 | 37 / 0 | 20 | 41.367 |
| hard-campaign | weak-placement | 1 | 8 / 8600 | 8 | 648.0 / 0 | 8 | 0 / 8 | 12 | 25.567 |
| hard-campaign | weak-placement | 2 | 10 / 6750 | 10 | 850.5 / 0 | 10 | 0 / 10 | 2 | 23.717 |
| hard-campaign | weak-placement | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 11 | 0 / 2 | 0 | 18.183 |
| hard-campaign | counter-aware | 1 | 8 / 8600 | 8 | 648.0 / 0 | 4 | 8 / 0 | 20 | 16.000 |
| hard-campaign | counter-aware | 2 | 10 / 6750 | 10 | 850.5 / 0 | 8 | 10 / 0 | 20 | 18.050 |
| hard-campaign | counter-aware | 3 | 11 / 7700 | 11 | 1158.3 / 0 | 6 | 11 / 0 | 20 | 16.267 |
| hard-campaign | counter-aware | 4 | 11 / 7200 | 11 | 1338.5 / 0 | 7 | 11 / 0 | 20 | 17.333 |
| hard-campaign | counter-aware | 5 | 13 / 8000 | 17 | 2407.1 / 0 | 7 | 17 / 0 | 20 | 27.967 |
| hard-campaign | counter-aware | 6 | 10 / 7600 | 10 | 1580.2 / 0 | 5 | 10 / 0 | 20 | 13.550 |
| hard-campaign | counter-aware | 7 | 19 / 8900 | 19 | 2482.7 / 0 | 12 | 19 / 0 | 20 | 18.833 |
| hard-campaign | counter-aware | 8 | 10 / 9700 | 10 | 1611.9 / 0 | 3 | 10 / 0 | 20 | 12.000 |
| hard-campaign | counter-aware | 9 | 17 / 10000 | 17 | 3148.2 / 0 | 9 | 17 / 0 | 20 | 17.650 |
| hard-campaign | counter-aware | 10 | 16 / 13700 | 20 | 4567.0 / 0 | 12 | 20 / 0 | 20 | 25.950 |
| hard-campaign | counter-aware | 11 | 8 / 6500 | 8 | 2200.5 / 0 | 5 | 8 / 0 | 20 | 12.433 |
| hard-campaign | counter-aware | 12 | 18 / 10600 | 18 | 4113.8 / 0 | 9 | 18 / 0 | 20 | 18.583 |
| hard-campaign | counter-aware | 13 | 7 / 6700 | 7 | 2397.9 / 0 | 3 | 7 / 0 | 20 | 10.850 |
| hard-campaign | counter-aware | 14 | 15 / 9200 | 15 | 4552.2 / 0 | 9 | 15 / 0 | 20 | 18.683 |
| hard-campaign | counter-aware | 15 | 12 / 9400 | 12 | 5558.6 / 449 | 7 | 12 / 0 | 20 | 23.183 |
| hard-campaign | counter-aware | 16 | 15 / 12100 | 15 | 6250.5 / 0 | 8 | 15 / 0 | 20 | 19.217 |
| hard-campaign | counter-aware | 17 | 25 / 10500 | 25 | 9657.2 / 0 | 18 | 25 / 0 | 20 | 25.833 |
| hard-campaign | counter-aware | 18 | 17 / 8800 | 17 | 8310.6 / 539 | 11 | 17 / 0 | 20 | 23.867 |
| hard-campaign | counter-aware | 19 | 33 / 18700 | 33 | 13328.6 / 0 | 17 | 33 / 0 | 20 | 31.150 |
| hard-campaign | counter-aware | 20 | 33 / 18700 | 37 | 19242.9 / 1256 | 20 | 37 / 0 | 20 | 40.700 |
