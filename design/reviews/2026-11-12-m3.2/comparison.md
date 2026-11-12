# M3.2 comparisons

Generated with `node design/reviews/2026-11-12-m3.2/compare.mjs`. Historical evidence is read only. Automated policies are not human engagement, difficulty or build-diversity evidence.

Content provenance: M3.1 SHA-256 4fc722f15236b4591c113a6ff206fc4ddad6ffc137be2dc98bf6ba2056552dbb; M3.2 dde229eb806ab08866aaf184c33e6bd935fc2f479bb6482f0d02e01f426304ce. Only version and four tower specialization definitions change. Base tower costs/stats, upgrades, armor/resists, all waves/schedules, income and every other content field are identical. File hashes identify bytes; the outcomes below measure gameplay. Current seven policies explicitly choose Focus/Sustained control when eligible; old reports used linear upgrades. Other purchase rules and scenarios are unchanged.

## Compared with M3.1

Mechanic/rejected-save probes match exactly (terminal 1/1, Titan cooldown 5000/shield 0, disabled aura 1, snapshot isolation).

| Scenario/policy | Old → new result | Lives/leaks | Combat seconds | End D/B/A | First-five leaks / seconds |
|---|---|---|---|---|---|
| easy-campaign/existing | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 390.033 → 387.933 | 2604/4979/3712 → 2604/4979/3712 | 0 / 78.183 → 0 / 78.183 |
| easy-campaign/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 391.250 → 379.600 | 2307/5611/4029 → 2307/5611/4029 | 0 / 69.450 → 0 / 69.417 |
| easy-campaign/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 400.450 → 395.883 | 2602/5039/3742 → 2602/5039/3742 | 0 / 78.300 → 0 / 80.117 |
| easy-campaign/expansion-heavy | VICTORY w20 → VICTORY w20 | 16/1 → 16/1 | 519.267 → 519.267 | 8996/5487/3946 → 8996/5487/3946 | 0 / 66.917 → 0 / 66.917 |
| easy-campaign/upgrade-heavy | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 394.500 → 390.367 | 2608/5039/3742 → 2608/5039/3742 | 0 / 79.433 → 0 / 80.183 |
| easy-campaign/weak-placement | GAME_OVER w3 → GAME_OVER w3 | 0/20 → 0/20 | 85.467 → 85.467 | 46/75/113 → 46/75/113 | 20 / 85.467 → 20 / 85.467 |
| easy-campaign/counter-aware | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 390.033 → 387.933 | 2604/4979/3712 → 2604/4979/3712 | 0 / 78.183 → 0 / 78.183 |
| normal-campaign/existing | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 418.167 → 408.617 | 2391/4372/3394 → 2391/4372/3394 | 0 / 87.733 → 0 / 87.733 |
| normal-campaign/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 432.500 → 400.283 | 2094/5004/3711 → 2094/5004/3711 | 0 / 72.367 → 0 / 72.183 |
| normal-campaign/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 438.067 → 421.533 | 2389/4432/3424 → 2389/4432/3424 | 0 / 88.133 → 0 / 87.550 |
| normal-campaign/expansion-heavy | VICTORY w20 → VICTORY w20 | 10/2 → 10/2 | 541.017 → 541.017 | 7724/4788/3567 → 7724/4788/3567 | 0 / 74.217 → 0 / 74.217 |
| normal-campaign/upgrade-heavy | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 422.850 → 413.667 | 1982/4432/3424 → 1982/4432/3424 | 0 / 90.333 → 0 / 89.483 |
| normal-campaign/weak-placement | GAME_OVER w3 → GAME_OVER w3 | 0/20 → 0/20 | 75.117 → 75.117 | 46/75/113 → 46/75/113 | 20 / 75.117 → 20 / 75.117 |
| normal-campaign/counter-aware | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 418.167 → 408.617 | 2391/4372/3394 → 2391/4372/3394 | 0 / 87.733 → 0 / 87.733 |
| hard-campaign/existing | VICTORY w20 → VICTORY w20 | 19/1 → 20/0 | 482.867 → 449.967 | 2051/3851/2905 → 2074/3864/2915 | 0 / 95.467 → 0 / 95.467 |
| hard-campaign/firewall-only | VICTORY w20 → VICTORY w20 | 9/11 → 20/0 | 483.233 → 444.650 | 1508/4346/3116 → 1777/4496/3232 | 0 / 89.283 → 0 / 88.067 |
| hard-campaign/no-support | VICTORY w20 → VICTORY w20 | 19/1 → 20/0 | 491.067 → 465.183 | 2049/3911/2935 → 2072/3924/2945 | 0 / 95.400 → 0 / 95.400 |
| hard-campaign/expansion-heavy | GAME_OVER w20 → GAME_OVER w20 | 0/4 → 0/4 | 552.183 → 552.183 | 5743/3965/2879 → 5743/3965/2879 | 0 / 85.867 → 0 / 85.867 |
| hard-campaign/upgrade-heavy | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 478.300 → 449.500 | 1951/4213/3090 → 1951/4213/3090 | 0 / 94.600 → 0 / 94.600 |
| hard-campaign/weak-placement | GAME_OVER w3 → GAME_OVER w3 | 0/20 → 0/20 | 67.467 → 67.467 | 46/75/113 → 46/75/113 | 20 / 67.467 → 20 / 67.467 |
| hard-campaign/counter-aware | VICTORY w20 → VICTORY w20 | 19/1 → 20/0 | 482.867 → 449.967 | 2051/3851/2905 → 2074/3864/2915 | 0 / 95.467 → 0 / 95.467 |

Legacy diagnostic campaigns (12):

| Difficulty/policy | Result | Lives/leaks | Seconds | End D/B/A |
|---|---|---|---|---|
| Easy/reference | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 390.033 → 387.933 | 2604/4979/3712 → 2604/4979/3712 |
| Easy/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 400.45 → 395.883 | 2602/5039/3742 → 2602/5039/3742 |
| Easy/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 391.25 → 379.6 | 2307/5611/4029 → 2307/5611/4029 |
| Easy/opening-only | GAME_OVER w15 → GAME_OVER w15 | 0/14 → 0/14 | 443.467 → 443.467 | 4447/1798/1260 → 4447/1798/1260 |
| Normal/reference | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 418.167 → 408.617 | 2391/4372/3394 → 2391/4372/3394 |
| Normal/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 438.067 → 421.533 | 2389/4432/3424 → 2389/4432/3424 |
| Normal/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 432.5 → 400.283 | 2094/5004/3711 → 2094/5004/3711 |
| Normal/opening-only | GAME_OVER w11 → GAME_OVER w11 | 0/12 → 0/12 | 301.333 → 301.333 | 2294/898/650 → 2294/898/650 |
| Hard/reference | VICTORY w20 → VICTORY w20 | 19/1 → 20/0 | 482.867 → 449.967 | 2051/3851/2905 → 2074/3864/2915 |
| Hard/no-support | VICTORY w20 → VICTORY w20 | 19/1 → 20/0 | 491.067 → 465.183 | 2049/3911/2935 → 2072/3924/2945 |
| Hard/firewall-only | VICTORY w20 → VICTORY w20 | 9/11 → 20/0 | 483.233 → 444.65 | 1508/4346/3116 → 1777/4496/3232 |
| Hard/opening-only | GAME_OVER w9 → GAME_OVER w9 | 0/15 → 0/15 | 234.883 → 234.883 | 1411/571/416 → 1411/571/416 |
## Compared with Corrected M2.4 / M1.4

Mechanic/rejected-save probes match exactly (terminal 1/1, Titan cooldown 5000/shield 0, disabled aura 1, snapshot isolation).

| Scenario/policy | Old → new result | Lives/leaks | Combat seconds | End D/B/A | First-five leaks / seconds |
|---|---|---|---|---|---|
| easy-campaign/existing | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 385.600 → 387.933 | 2604/4979/3712 → 2604/4979/3712 | 0 / 73.917 → 0 / 78.183 |
| easy-campaign/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 391.217 → 379.600 | 2307/5611/4029 → 2307/5611/4029 | 0 / 68.767 → 0 / 69.417 |
| easy-campaign/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 397.267 → 395.883 | 2602/5039/3742 → 2602/5039/3742 | 0 / 74.800 → 0 / 80.117 |
| easy-campaign/expansion-heavy | VICTORY w20 → VICTORY w20 | 16/1 → 16/1 | 519.933 → 519.267 | 8996/5487/3946 → 8996/5487/3946 | 0 / 68.067 → 0 / 66.917 |
| easy-campaign/upgrade-heavy | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 390.533 → 390.367 | 2608/5039/3742 → 2608/5039/3742 | 0 / 74.467 → 0 / 80.183 |
| easy-campaign/weak-placement | GAME_OVER w3 → GAME_OVER w3 | 0/20 → 0/20 | 85.017 → 85.467 | 46/75/113 → 46/75/113 | 20 / 85.017 → 20 / 85.467 |
| easy-campaign/counter-aware | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 385.600 → 387.933 | 2604/4979/3712 → 2604/4979/3712 | 0 / 73.917 → 0 / 78.183 |
| normal-campaign/existing | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 409.700 → 408.617 | 2391/4372/3394 → 2391/4372/3394 | 0 / 83.783 → 0 / 87.733 |
| normal-campaign/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 432.100 → 400.283 | 2094/5004/3711 → 2094/5004/3711 | 0 / 71.550 → 0 / 72.183 |
| normal-campaign/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 438.283 → 421.533 | 2389/4432/3424 → 2389/4432/3424 | 0 / 84.950 → 0 / 87.550 |
| normal-campaign/expansion-heavy | VICTORY w20 → VICTORY w20 | 10/2 → 10/2 | 537.600 → 541.017 | 7724/4788/3567 → 7724/4788/3567 | 0 / 70.800 → 0 / 74.217 |
| normal-campaign/upgrade-heavy | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 423.000 → 413.667 | 1982/4432/3424 → 1982/4432/3424 | 0 / 86.950 → 0 / 89.483 |
| normal-campaign/weak-placement | GAME_OVER w3 → GAME_OVER w3 | 0/20 → 0/20 | 74.667 → 75.117 | 46/75/113 → 46/75/113 | 20 / 74.667 → 20 / 75.117 |
| normal-campaign/counter-aware | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 409.700 → 408.617 | 2391/4372/3394 → 2391/4372/3394 | 0 / 83.783 → 0 / 87.733 |
| hard-campaign/existing | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 478.217 → 449.967 | 2074/3864/2915 → 2074/3864/2915 | 0 / 93.183 → 0 / 95.467 |
| hard-campaign/firewall-only | VICTORY w20 → VICTORY w20 | 10/10 → 20/0 | 485.183 → 444.650 | 1531/4359/3126 → 1777/4496/3232 | 0 / 87.150 → 0 / 88.067 |
| hard-campaign/no-support | VICTORY w20 → VICTORY w20 | 19/1 → 20/0 | 485.150 → 465.183 | 2049/3911/2935 → 2072/3924/2945 | 0 / 92.967 → 0 / 95.400 |
| hard-campaign/expansion-heavy | GAME_OVER w20 → GAME_OVER w20 | 0/4 → 0/4 | 549.483 → 552.183 | 5743/3965/2879 → 5743/3965/2879 | 0 / 83.167 → 0 / 85.867 |
| hard-campaign/upgrade-heavy | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 475.133 → 449.500 | 1951/4213/3090 → 1951/4213/3090 | 0 / 91.433 → 0 / 94.600 |
| hard-campaign/weak-placement | GAME_OVER w3 → GAME_OVER w3 | 0/20 → 0/20 | 67.017 → 67.467 | 46/75/113 → 46/75/113 | 20 / 67.017 → 20 / 67.467 |
| hard-campaign/counter-aware | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 478.217 → 449.967 | 2074/3864/2915 → 2074/3864/2915 | 0 / 93.183 → 0 / 95.467 |

Legacy diagnostic campaigns (12):

| Difficulty/policy | Result | Lives/leaks | Seconds | End D/B/A |
|---|---|---|---|---|
| Easy/reference | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 385.6 → 387.933 | 2604/4979/3712 → 2604/4979/3712 |
| Easy/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 397.267 → 395.883 | 2602/5039/3742 → 2602/5039/3742 |
| Easy/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 391.217 → 379.6 | 2307/5611/4029 → 2307/5611/4029 |
| Easy/opening-only | GAME_OVER w15 → GAME_OVER w15 | 0/14 → 0/14 | 440.733 → 443.467 | 4447/1798/1260 → 4447/1798/1260 |
| Normal/reference | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 409.7 → 408.617 | 2391/4372/3394 → 2391/4372/3394 |
| Normal/no-support | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 438.283 → 421.533 | 2389/4432/3424 → 2389/4432/3424 |
| Normal/firewall-only | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 432.1 → 400.283 | 2094/5004/3711 → 2094/5004/3711 |
| Normal/opening-only | GAME_OVER w11 → GAME_OVER w11 | 0/12 → 0/12 | 292.983 → 301.333 | 2294/898/650 → 2294/898/650 |
| Hard/reference | VICTORY w20 → VICTORY w20 | 20/0 → 20/0 | 478.217 → 449.967 | 2074/3864/2915 → 2074/3864/2915 |
| Hard/no-support | VICTORY w20 → VICTORY w20 | 19/1 → 20/0 | 485.15 → 465.183 | 2049/3911/2935 → 2072/3924/2945 |
| Hard/firewall-only | VICTORY w20 → VICTORY w20 | 10/10 → 20/0 | 485.183 → 444.65 | 1531/4359/3126 → 1777/4496/3232 |
| Hard/opening-only | GAME_OVER w9 → GAME_OVER w9 | 0/15 → 0/15 | 235.517 → 234.883 | 1419/574/418 → 1411/571/416 |

## Controlled wave comparisons against linear M3.1

The identical funded preparation fixture is defined in tools/balance/tradeoffs.mjs and tradeoffs.json. Costs are 420/0/0 expansion, 406/0/0 damage upgrades, 398/135/68 control upgrades plus attackers, 400/60/30 support, 420/80/40 control-support. Same budget, different spend and currency commitments. Layout and wave matter; elapsed time alone does not rank player enjoyment. Unused funds, full tower placements, typed leaks with coverage, capped health/shield removal, shots, status applications, aura-present shots, passive income, boss phases and kills remain in the raw reports. Aura/status activity is not caused damage or prevented leaks.

| Wave/layout/plan | Linear → prototype leaks | Combat seconds | Prototype status applications | Aura-present shots |
|---|---|---|---|---|
| 2/central/expansion | 0 → 0 | 10.317 → 10.317 | 0 | 0 |
| 2/central/focus | 0 → 0 | 14.400 → 12.250 | 0 | 0 |
| 2/central/coverage | 0 → 0 | 14.400 → 13.050 | 0 | 0 |
| 2/central/sustain | 0 → 0 | 11.367 → 11.367 | 10 | 0 |
| 2/central/reach | 0 → 0 | 11.367 → 10.867 | 18 | 0 |
| 2/central/support | 0 → 0 | 11.150 → 11.150 | 0 | 44 |
| 2/central/control-support | 0 → 0 | 11.550 → 11.550 | 3 | 0 |
| 2/spread/expansion | 0 → 0 | 10.633 → 10.633 | 0 | 0 |
| 2/spread/focus | 0 → 0 | 16.050 → 11.433 | 0 | 0 |
| 2/spread/coverage | 0 → 0 | 16.050 → 11.433 | 0 | 0 |
| 2/spread/sustain | 0 → 0 | 11.450 → 11.450 | 11 | 0 |
| 2/spread/reach | 0 → 0 | 11.450 → 9.650 | 20 | 0 |
| 2/spread/support | 0 → 0 | 11.217 → 11.217 | 0 | 52 |
| 2/spread/control-support | 0 → 0 | 11.150 → 11.150 | 7 | 0 |
| 3/central/expansion | 0 → 0 | 11.633 → 11.633 | 0 | 0 |
| 3/central/focus | 0 → 0 | 16.083 → 16.583 | 0 | 0 |
| 3/central/coverage | 0 → 0 | 16.083 → 15.317 | 0 | 0 |
| 3/central/sustain | 0 → 0 | 16.350 → 16.350 | 13 | 0 |
| 3/central/reach | 0 → 0 | 16.350 → 15.000 | 27 | 0 |
| 3/central/support | 0 → 0 | 11.733 → 11.733 | 0 | 50 |
| 3/central/control-support | 0 → 0 | 11.983 → 11.983 | 6 | 0 |
| 3/spread/expansion | 0 → 0 | 10.900 → 10.900 | 0 | 0 |
| 3/spread/focus | 0 → 0 | 20.117 → 16.017 | 0 | 0 |
| 3/spread/coverage | 0 → 0 | 20.117 → 17.533 | 0 | 0 |
| 3/spread/sustain | 0 → 0 | 14.217 → 14.217 | 14 | 0 |
| 3/spread/reach | 0 → 0 | 14.217 → 11.483 | 29 | 0 |
| 3/spread/support | 0 → 0 | 10.667 → 10.667 | 0 | 55 |
| 3/spread/control-support | 0 → 0 | 12.000 → 12.000 | 5 | 0 |
| 4/central/expansion | 0 → 0 | 12.267 → 12.267 | 0 | 0 |
| 4/central/focus | 0 → 0 | 17.633 → 16.600 | 0 | 0 |
| 4/central/coverage | 0 → 0 | 17.633 → 16.917 | 0 | 0 |
| 4/central/sustain | 0 → 0 | 19.333 → 19.317 | 14 | 0 |
| 4/central/reach | 0 → 0 | 19.333 → 17.117 | 30 | 0 |
| 4/central/support | 0 → 0 | 13.483 → 13.483 | 0 | 58 |
| 4/central/control-support | 0 → 0 | 12.933 → 12.933 | 5 | 0 |
| 4/spread/expansion | 0 → 0 | 12.067 → 12.067 | 0 | 0 |
| 4/spread/focus | 0 → 0 | 23.117 → 18.367 | 0 | 0 |
| 4/spread/coverage | 0 → 0 | 23.117 → 18.400 | 0 | 0 |
| 4/spread/sustain | 0 → 0 | 19.017 → 17.800 | 18 | 0 |
| 4/spread/reach | 0 → 0 | 19.017 → 13.017 | 31 | 0 |
| 4/spread/support | 0 → 0 | 12.800 → 12.800 | 0 | 67 |
| 4/spread/control-support | 0 → 0 | 12.333 → 12.333 | 4 | 0 |
| 5/central/expansion | 0 → 0 | 33.900 → 33.900 | 0 | 0 |
| 5/central/focus | 0 → 0 | 35.817 → 30.400 | 0 | 0 |
| 5/central/coverage | 0 → 0 | 35.817 → 34.300 | 0 | 0 |
| 5/central/sustain | 1 → 0 | 60.733 → 40.417 | 32 | 0 |
| 5/central/reach | 1 → 1 | 60.733 → 60.750 | 59 | 0 |
| 5/central/support | 0 → 0 | 37.683 → 37.683 | 0 | 186 |
| 5/central/control-support | 0 → 0 | 32.133 → 32.133 | 16 | 67 |
| 5/spread/expansion | 0 → 0 | 46.350 → 46.350 | 0 | 0 |
| 5/spread/focus | 0 → 0 | 47.150 → 37.983 | 0 | 0 |
| 5/spread/coverage | 0 → 0 | 47.150 → 37.717 | 0 | 0 |
| 5/spread/sustain | 1 → 1 | 60.183 → 64.967 | 31 | 0 |
| 5/spread/reach | 1 → 1 | 60.183 → 62.017 | 69 | 0 |
| 5/spread/support | 1 → 1 | 55.333 → 55.333 | 0 | 155 |
| 5/spread/control-support | 0 → 0 | 48.533 → 48.533 | 20 | 45 |
