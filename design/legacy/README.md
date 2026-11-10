# Legacy material

Reference material preserved from the two earlier attempts at this game before
their repositories were archived. Nothing here is loaded by the game, copied into
`dist/`, or covered by the test suites. Treat it as source material to port from,
not code to import.

| Source | Repository | Commit | Active |
|---|---|---|---|
| v1 | `zekusmaximus/Dharmapala-Shield` | `1fe6024` | July 2025 |
| v2 | `zekusmaximus/Dharmapala-Shield1` | `b526ba4` | July 2025 – June 2026 |

## Contents

- `original-design-brief.md` — the original concept document (v1,
  `backup/Pasted_content_02.txt`). The only copy of the founding premise:
  Karmic Protocol headsets, distribution goals, the full six-tower and
  five-enemy roster.
- `v1-roadmap.md` — the v1 phase checklist (`todo.md`).
- `art/v1/` — v1 painted sprites and `game_background.webp`, the temple and
  lotus backdrop that exists nowhere else.
- `art/v2/` — v2 sprites, a different render of the same subjects, plus
  `boss_corrupted_monk_phase1.webp`, which exists only in v2.
- `reference/` — v2 source files, unmodified:
  - `audioManager.js` — Web Audio implementation; the starting point for
    filling in `js/platform/AudioController.js`.
  - `config.js` — `LEVEL_PATHS` (multiple levels across cyber, urban, and
    forest themes), `UPGRADE_TREES`, enemy and boss definitions including
    `megaCorp`.
  - `achievementManager.js` — eleven achievement definitions.
  - `defense.js`, `enemy.js`, `Boss.js` — behaviour of the decoy, mirror, and
    anonymity towers deferred in `../FUTURE_TOWERS.md`, enemy abilities, and
    boss phases.
- `tools/optimize_images.py` — the v1 Pillow script for producing optimized
  PNG and WebP output.

## Notes on use

- All art was converted from the original 1.0–2.3 MB PNGs to WebP at quality 90,
  full resolution (1024×1024; background 1536×1024). The lossless originals
  remain in the archived repositories.
- The reference files assume v2's module layout and global singletons. They will
  not run here as-is; port the logic into `GameSession` rules and systems so the
  simulator and runtime stay in parity.
- Art lives under `design/` rather than `assets/` deliberately: the build copies
  all of `assets/` into `dist/`.
