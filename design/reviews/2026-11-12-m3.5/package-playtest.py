#!/usr/bin/env python3
"""Build the unchanged M3.4 client as a self-contained M3.5 playtest archive."""

import hashlib
import json
import subprocess
from pathlib import Path
from zipfile import ZIP_STORED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
BASE = "fc43adf7f944b2fd8d82b4738e2dae4f90eb0cf1"
ARCHIVE = HERE / "playtest-build-fc43adf-1.4.0.zip"
SOURCE_PATHS = [
    "index.html",
    "favicon.svg",
    "robots.txt",
    "design/balance.json",
    "assets",
    "css",
    "js",
    "package.json",
    "scripts/build.mjs",
]


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, check=True, capture_output=True, text=True).stdout.strip()


def add_bytes(archive, name, payload):
    info = ZipInfo(name, (1980, 1, 1, 0, 0, 0))
    info.compress_type = ZIP_STORED
    info.external_attr = 0o100644 << 16
    archive.writestr(info, payload)


if git("rev-parse", BASE) != BASE:
    raise SystemExit("The pinned M3.4 commit is unavailable")
subprocess.run(["git", "diff", "--quiet", BASE, "--", *SOURCE_PATHS], cwd=ROOT, check=True)
if git("ls-files", "--others", "--exclude-standard", "--", *SOURCE_PATHS):
    raise SystemExit("Untracked client/build source would make the package ambiguous")
balance = json.loads((ROOT / "design/balance.json").read_bytes())
if balance["version"] != "1.4.0":
    raise SystemExit("Expected balance 1.4.0")

subprocess.run(["npm", "run", "build"], cwd=ROOT, check=True)
files = sorted(path for path in (ROOT / "dist").rglob("*") if path.is_file())
if not files:
    raise SystemExit("Build produced no files")
checksums = []
for path in files:
    name = path.relative_to(ROOT / "dist").as_posix()
    checksums.append(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {name}")

metadata = {
    "sourceCommit": BASE,
    "sourceTree": git("rev-parse", f"{BASE}^{{tree}}"),
    "balanceVersion": "1.4.0",
    "saveSchemaVersion": 4,
    "saveStorageSlot": "dharmapala-shield/save/v2",
    "balanceSha256": hashlib.sha256((ROOT / "design/balance.json").read_bytes()).hexdigest(),
    "fileCount": len(files),
    "scope": "Unmodified static M3.4 client for M3.5 human sessions",
}
run = (
    "# Run this playtest build\n\n"
    "Extract the archive into an empty directory. In that directory, run "
    "`python3 -m http.server 8765` and open `http://127.0.0.1:8765/`. "
    "A static HTTP server is required; opening index.html as a file is unsupported.\n\n"
    "Use a fresh browser profile for each participant. Do not substitute a "
    "later build without recording its commit, balance version and save schema. "
    "See the accompanying M3.5 facilitator guide for neutral tasks and recording.\n"
)

with ZipFile(ARCHIVE, "w") as archive:
    for path in files:
        add_bytes(archive, path.relative_to(ROOT / "dist").as_posix(), path.read_bytes())
    add_bytes(archive, "PLAYTEST_FILES.sha256", ("\n".join(checksums) + "\n").encode())
    add_bytes(archive, "PLAYTEST_BUILD_INFO.json", (json.dumps(metadata, indent=2) + "\n").encode())
    add_bytes(archive, "PLAYTEST_RUN.md", run.encode())

print(ARCHIVE)
print(f"sha256 {hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()}")
print(f"{len(files)} client files; balance {metadata['balanceVersion']}; schema v4; source {BASE}")
