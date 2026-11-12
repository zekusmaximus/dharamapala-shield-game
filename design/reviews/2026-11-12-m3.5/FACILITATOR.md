# M3.5 facilitator guide · first five waves

## Scope and preparation

Recruit **at least five first-time players** with no previous Dharmapala Shield
play and a **smaller returning group of at least two** who have a recorded earlier
session on this same build. A returning session is separate from an immediate
retry; record the time and intervening exposure, without imposing a delay. Record
all invited, started and excluded sessions and the reason for any exclusion. Do
not replace an inconvenient result. This is a small pilot, not a population
sample or a win-rate study.

Use the pinned `playtest-build-fc43adf-1.4.0.zip` and its hash in BUILD.md.
Extract and serve it over HTTP. Start each player in a fresh browser profile with
empty run and preference storage. Use Normal difficulty for the common comparison
unless the participant chooses otherwise; record any deviation and analyze it
separately. Use one participant per session, the same task wording, and no grants,
save editing, scripted policy, forced speed or skipped waves. The player controls
tutorial, 1×/2×, pause, inspections, spending, restarts and stopping. If they
arrive with a save, preserve/export it before any reset and note the deviation.

Ask for consent to observe and to use anonymized notes. Ask separately for screen
or audio recording and verbatim quote use; either may be declined. Use a session
ID in the record, not a name, email or contact details. Keep any raw capture in
the approved private research location, never this repository. If capture is
declined, take timestamped notes. Record device, browser, viewport, input mode,
assistive technology if voluntarily disclosed, difficulty, build hash and any
prior exposure. A physical-device or screen-reader session must be labelled as
such; it is not inferred from Chromium or axe.

## Session flow

1. Show PARTICIPANT_TASKS.md verbatim. Say: “We are learning how the game works
   for players. You are not being tested. Please use the game as you normally
   would. I will mostly stay quiet and ask about your decisions afterward.”
2. Start the wall-clock timer when the playable menu is visible. Let the player
   choose New game and handle the built-in tutorial. Do not identify a control,
   enemy counter, price, or recommended build. Record the first actual build or
   spending decision, first wave start, first confusion, and any request for help.
3. Let play continue through the first five waves, a loss, or a voluntary stop.
   Record each placement, upgrade, sale, specialization, resource bank and price
   when visible, wave result, leaks, and relevant inspection/report use. If a
   player loses, ask “What do you think happened?” and “What would you change if
   you tried again?” **before** a retry. If they choose to retry, record the
   stated adjustment, actual change and result as a separate attempt. Do not
   require a retry or add idle time to meet a duration target.
4. At a natural stopping point, ask the open questions below. Do not offer a
   counter or branch option in a question. Record the exact wording of each
   answer where consent permits; keep your interpretation in its own field.
5. Thank the player and end the session. Archive raw notes/capture under the
   anonymous ID outside the repo. Transfer only consented, de-identified
   records into a copy of session-template.json.

If the player asks for help, first say “Use anything in the game you think may
help.” If they still need help, give the smallest navigation hint needed to
continue, log the exact intervention and time, and mark the relevant unaided
start judgment accordingly. Never coach a counter, purchase or specialization.
If a technical failure occurs, log it, keep the partial session, and state whether
the attempt can be compared. Do not silently restart it.

## Neutral debrief prompts

- “What was the first point that felt unclear? What were you trying to do?”
- “Which wave or enemy changed your plan, if any? What did you try, and what in
  the game told you whether it helped?”
- “What do you think caused each loss or leak you noticed? What would you try
  next?”
- “What purchases did you consider but leave for later? What did the available
  Dharma and Bandwidth allow or prevent?”
- “If you encountered a specialization choice, which options did you consider,
  what did you choose, and why? If you did not encounter one, say so.”
- “Would you choose to play this slice again on your own? Why or why not?”

For a returning session, before play also ask “What result do you remember, and
is there anything you intend to change this time?” Record the answer before
actions. Do not remind them of their prior build or outcome. Afterward ask what
they changed and whether the result matched their expectation.

## Recording rules

Use OBSERVATION_SHEET.md during play and DATA_DICTIONARY.md when transferring
records. **Direct observation** is a visible action, state, timing or exact UI
text. **Participant explanation** is what the player says, including uncertainty.
**Facilitator interpretation** is a labelled inference with cited observations.
**Automated measurement** requires a named instrument, output and build; do not
relabel simulator results as player behavior. Do not turn a quote into a measured
mechanic or a plausible counter into a proven causal effect.

Wall-clock elapsed time includes normal reading, building and pauses. Record
separately the time to first meaningful placement/spending choice and the first
five-wave result; record retries separately. The roadmap's 60–90-second choice
and 4–7-minute slice are **provisional observation targets**, not time limits.
Game simulated seconds and 2× speed are different from wall time. Record both
when available and never insert waiting to make a target.
