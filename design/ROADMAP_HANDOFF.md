# Start the next roadmap task

Paste the following into a new coding chat with
`zekusmaximus/dharamapala-shield-game` attached. It scopes the first implementation
to M1.1 so the result can be tested and reviewed independently. Later tasks remain
in [ROADMAP.md](../ROADMAP.md).

```text
Start implementing the roadmap for zekusmaximus/dharamapala-shield-game.

Read applicable AGENTS.md instructions, ROADMAP.md, and
design/CODE_REVIEW_2026-11-11.md. Fetch the latest main, inspect the current state,
and create a dedicated branch. The review is a historical baseline; verify the
defect against current code before changing it.

Complete M1.1: repair portrait controls. The review's R01 found that the fixed
wave-preview/inspector sheets cover the tower palette and Start Wave button.
Existing layout tests pass because they check bounds rather than interactions.

Reproduce the failure with a browser regression, then implement explicit sheet
visibility/dismissal and a layout that keeps primary actions reachable. Preserve
the current deterministic engine, tower rules, balance, semantic HTML, keyboard
support, and deliberate build phases.

Verify normal, unforced pointer/touch interactions for selecting and placing a
tower, starting a wave, inspecting, upgrading, and selling at 360x640, 390x844,
640x360, 844x390, and 1280x720. Include rotation, open inspector/preview sheets,
and the largest wave preview. Check focus and keyboard access. Bounding boxes or
force-clicks alone do not establish that controls work.

Run the build, unit, integration, simulation, end-to-end, and accessibility suites.
Install Chromium if needed. Reuse the review diagnostics where relevant. Keep
historical review evidence unchanged; record new results separately. Distinguish
browser emulation from physical-device and screen-reader testing.

Update ROADMAP.md with M1.1's actual completion status and evidence. Commit the
implementation and tests, push the branch, and open a focused pull request with
validation results and remaining limitations. Leave it ready for review. Finish
this task before proceeding to M1.2; do not mark the whole M1 milestone complete.
```
