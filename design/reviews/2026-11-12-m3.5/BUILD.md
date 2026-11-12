# Pinned runnable build for M3.5 sessions

The [playtest archive](playtest-build-fc43adf-1.4.0.zip) contains the **unchanged**
static M3.4 client: 41 built files plus `PLAYTEST_BUILD_INFO.json`,
`PLAYTEST_FILES.sha256` and `PLAYTEST_RUN.md`. It is a ready-to-serve build, not a
new balance revision or a completed playtest.

| Identity | Value |
| --- | --- |
| Source main commit | `fc43adf7f944b2fd8d82b4738e2dae4f90eb0cf1` (PR #28 merged) |
| Source tree | `b716f639e541a471ac452fafd6e3d7d7a9ddcb46` |
| Balance version | `1.4.0` |
| Balance JSON SHA-256 | `453d1f29af67851e1fb445896ae4350b5bd8fc5e79cee88907529eaaba8aa9af` |
| Snapshot schema / storage slot | v4 / `dharmapala-shield/save/v2` |
| Archive SHA-256 | `c89fd1806dab103d0838be5b3678404c7b984a64e6972e8a6e3544da360f80f5` |

Extract into an empty directory, serve it over HTTP, and open the shown address
in a **fresh browser profile** for each player. Python 3 is sufficient to serve
the archive; Node is needed only to rebuild it from source.

```bash
python3 -m zipfile -e design/reviews/2026-11-12-m3.5/playtest-build-fc43adf-1.4.0.zip /tmp/dharamapala-m35-playtest
python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/dharamapala-m35-playtest
# Open http://127.0.0.1:8765/
```

Opening `index.html` as a `file:` URL is unsupported because the game fetches
its balance JSON. For a remote session, serve the same extracted bytes at an
accessible HTTP(S) origin and record that origin and archive hash; do not swap
builds within a cohort. Browser local storage is origin-specific. A fresh
profile prevents one player's save or preferences from affecting another's
choices. If an existing profile contains an old run, export its raw payload
through the game's recovery UI before any explicit reset; never overwrite it
for a session.

To recreate the archive from a checkout that preserves the pinned client files,
run `python3 design/reviews/2026-11-12-m3.5/package-playtest.py`. It refuses
tracked or untracked client/build source changes relative to `fc43adf`, runs
`npm run build`, and writes a sorted, fixed-timestamp, uncompressed ZIP.
`PLAYTEST_FILES.sha256` lists every served file. Check the archive hash with
`sha256sum` and the internal files with `sha256sum -c PLAYTEST_FILES.sha256`
inside the extracted directory.

Package smoke on 2026-11-12: the archive passed ZIP integrity and all 41 file
hashes; the extracted build returned HTTP 200 for `/` (12,761 bytes) and
`/design/balance.json` (15,631 bytes) from a local Python server. This tests
packaging/serving, not human gameplay or readability. The full clean-checkout
game pipeline is recorded in README.md and `validation.txt`.
