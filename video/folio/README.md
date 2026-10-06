# Folio, the launch film

A 26-second fast-cut launch film for `/folio`, in 4:5 (1080 × 1350) and 16:9
(1920 × 1080), 30 fps,
drawn in code with Remotion. Made 2026-10-06 on the `ai-motion-design` route
of Armada: the subject has to be exact, so the screens are the page's own
components (`components/folio/*`), rendered frame by frame and never redrawn,
and nothing that moves is generated.

## The decisions

| Question | Answer |
|---|---|
| Format, length | 4:5, 26 s: 52 beats at 120 BPM, 15 frames a beat, 780 frames (first cut was 20 s). 16:9 added after |
| Call to action | The page's own closer, "Ship it, or buy us.", with the concept line kept on the card |
| Sound | Picture cut to the grid; coded UI sound now (`sound.py`); a licensed 120 BPM track replaces the bed later |
| Pace | Hard and fast, then breathe: act one cuts on half-beats, act two every four to six beats |

**Thesis.** Paying for software already takes one tap; collecting its invoice
is a hunt across a dozen billing pages. Folio makes collecting one tap too.

**Hinge.** The tap. The same press, ripple and label swap pays (beat 2),
approves Folio (beat 30) and sends September to the accountant (beat 42).

**Restraint budget.** White paper, navy ink. One purple, for the tap. The
ribbon is the only colour field and arrives at the switch, never before. Two
faces, the page's (Inter Tight, Source Code Pro, both variable). Three
entrances: words rise, mocks spring up, stacked items drop. Act one pushes
only into the pile-up; act two is never still (a slow push in every scene).

**Copy.** Every on-screen line is the page's own (`content/folio-copy.ts`) or
a cut of one; the film-only lines sit at the top of `FolioLaunch.tsx`.

## The tools

Since 2026-10-06 the page and the film show real tools: twelve Vince pays
for, chosen from his most-billed software and the ones he named (Claude,
Superhuman, Slack, Figma, Google Workspace). What is true and what is not:

- **True, from his own records.** Where each tool keeps its invoice and what
  you meet there, from the portal notes in Ledger, his invoice pipeline:
  Slack's billing history downloads a ZIP, Notion's billing is a modal with
  no URL, Webflow bills per workspace, Google Workspace has one admin console
  per account, Cursor and Midjourney hand over Stripe receipt pages, and so on.
- **Illustration.** Every amount (a public list price where one is well
  known, otherwise invented), the accountant, both cards, every document
  number. His real charges stay in Ledger: none of its database is in this
  repository.
- **Marks.** Vector paths in `content/folio-logos.ts`, generated from LobeHub
  Icons (MIT), Simple Icons (CC0) and SVG Logos (CC0). Google Workspace is
  shown by Google's G; Superhuman has no mark in any open set, so its tile
  carries a letter until its own mark is supplied. Each mark stays its
  owner's trademark and appears only to name the tool; the footer says so.

## The beat sheet

52 beats, 780 frames, 26 seconds, 13 bars. Lengthened on 2026-10-06 from 40
beats after the first viewing: the slabs of type left too fast, the pile-up
wanted weight, and every calm frame wanted a little longer.

| Beats | Frames | Scene | What happens |
|---|---|---|---|
| 0–5 | 0–74 | pay | "Paying takes one tap." The pay card; tap on beat 2. Frame 0 is finished |
| 5–7 | 75–104 | collect | "Now find the invoice.", held two beats |
| 7–11 | 105–164 | hunt | The eight tools whose invoice sits behind a sign-in, one per half-beat, counter 01–08 / 08 |
| 11–15 | 165–224 | twelve | "Twelve tools." two beats, then "Twelve sign-ins." two beats, all twelve marks |
| 15–21 | 225–314 | pile | One notification a beat, dropped from above, shoving the stack with a small overshoot; a knock, a slow push, a darkening edge; the missed call buzzes and rings red twice |
| 21–23 | 315–344 | weeks | "Three weeks of next week." The riser stops dead on 345 |
| 23–26 | 345–389 | fetch | The switch. "If an agent can pay, it can fetch the invoice." Ribbon in |
| 26–33 | 390–494 | approve | The consent sheet; tap on beat 30, "Approved" |
| 33–40 | 495–599 | arrive | Activity: each charge's invoice drops in, then "Download September · 44 PDFs" |
| 40–45 | 600–674 | ask | "One question a month." September is ready; tap on beat 42, "Sent" |
| 45–52 | 675–779 | end | Folio, Concept, "Ship it, or buy us.", the concept line |

The hunt keeps its half-beat cuts: it is the one stretch meant to feel like
too much. The numbers live in `beats.ts`; `sound.py` reads the same frames
through `cues.ts`.

## Two formats

One composition, two frames. `LAYOUT` in `FolioLaunch.tsx` holds every
placement for each; the scenes, beats and sound are shared. Tall (540 × 675
CSS, at 2x) stacks type over the screen. Wide (960 × 540 CSS, at 2x) puts the
type left and the screen right, sets the slabs of type larger, lays the twelve
tiles out six across, and gives the pile-up a caption beside the phone.

## Make it

```bash
export PATH=$HOME/.nvm/versions/node/v22.22.2/bin:$PATH   # Node 22
node video/folio/render.mjs stills [--wide]                # key stills + out/sheet-<format>.jpg
npx tsx video/folio/cues.ts > video/folio/out/cues.json
python3 video/folio/sound.py video/folio/out/cues.json video/folio/out/sound.wav
node video/folio/render.mjs film                           # out/folio-launch-4x5.mp4
node video/folio/render.mjs film --wide                    # out/folio-launch-16x9.mp4
```

`film` renders the picture, then muxes `out/sound.wav` with a two-pass
`loudnorm` (`I=-16:TP=-1.5`, `linear=true`) over the film's own length. `out/`
is not committed: the recipe is, the pixels are not.

## What was checked, and how

- The 16:9: its first sheet ran the pile-up's phone off the bottom edge once
  the push enlarged it; it is set smaller. The 4:5 was re-rendered after the
  layout moved into the table and matched the previous cut (50.9 dB PSNR).
- Round two: the pile-up's cut frame opened on an empty wall twice (the first
  notification faded in on time but slid from above the wall's edge); its
  slide and its fade are now both pre-rolled four frames before the cut.
- Stills before motion: two rounds of key-still sheets. The first found the
  pay, hunt, arrive and ask scenes sitting small over an empty bottom third, and
  a pay ripple that read as a disabled button.
- The whole film sheeted every sixth frame: every cut opened on two or three
  blank white frames, because entrances started at zero on the cut. Entrances
  now begin a few frames before their cut; the cut frames were stilled again.
- The tap frames stilled one by one: the old and new labels crossfaded into a
  ghost. They now swap: the old label out in three frames, the new one in after.
- The delivered files: 780 frames each, at 1080 × 1350 and 1920 × 1080;
  −17.2 LUFS integrated and −1.1 dBFS peak, measured after the AAC encode. Linear normalisation stopped
  short of −16 to hold the peak; the bed is a placeholder until the track.

## Open

- The track. Measure its grid (`praxes/ai-motion-design/scripts/music_window.py`),
  move cuts onto its real kicks in `beats.ts`, keep the effects, drop the pad.
- Not yet seen by a person. Nothing about taste here is settled until it has.
