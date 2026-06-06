# Creative AI Workshop · Starter Kit

A portable workshop package. Drop the folder into Claude Cowork and ask
it to set you up. Inside is everything needed to run, deliver, or
re-deliver a workshop on using AI across the creative process.

## What this is

A second-brain seed for teams whose work is creative production
(video, copy, design, presentations, briefs, landing pages). Not a
finished system. A scaffold you adapt to how your team actually works,
populated with worked examples and installable Skills.

The narrative the kit carries: AI is **a speed layer on the creative
process**, not a salvage operation for bad work. The gains are around
the work, not in the output. Three motions, in order: **Navigate**,
**Encode**, **Build**.

## How to use it (with Claude Cowork)

Cowork runs Claude on your desktop, against local files. The fastest
way to use this kit:

1. Move this whole folder somewhere stable (Desktop, Documents, a
   project folder).
2. Open Claude Cowork.
3. Point it at this folder and say:

   > Set me up. Read the README. Walk me through what's here.
   > Install the example Skills, open the deck, and outline the agenda.

4. Cowork will:
   - Read this `README.md` and the files in `docs/`
   - Open `presentation/index.html` for the deck
   - Surface the Skills under `skills/` for you to install
   - Walk you through `docs/build-a-skill.md` if you ask it to

You can also cherry-pick: run the deck without Cowork, install the
Skills directly into Claude.ai, or read the docs as plain markdown.

## Folder map

```
creative-ai-workshop/
├── README.md                           ← you are here
├── presentation/
│   └── index.html                      ← self-contained deck (offline OK)
├── skills/
│   ├── strategy-template/              ← skeleton for your own strategy Skill
│   │   ├── SKILL.md
│   │   └── references/
│   ├── tone-of-voice/                  ← worked example: a Skill, fully filled in
│   │   ├── SKILL.md
│   │   └── references/
│   └── examples/                       ← installable .skill bundles
│       ├── frontend-design.skill
│       ├── plain-english.skill
│       ├── creating-presentations.skill
│       └── ai-adoption-loop.skill
└── docs/
    ├── agenda.md                       ← run-of-show
    ├── navigate-encode-build.md        ← the flywheel, condensed
    └── build-a-skill.md                ← the live exercise
```

## Installing the example Skills

Each `.skill` file under `skills/examples/` is a zipped Skill bundle
that Claude.ai accepts directly. Two paths:

- **Cloud (Claude.ai)**: Open Claude.ai → Skills → Upload → drop the
  `.skill` file. Available in chat under the Skill toggle.
- **Local (Claude Code / Cowork)**: Unzip the bundle into
  `~/.claude/skills/<skill-name>/`. The Skill is then available to any
  Claude agent on this machine.

The two unpacked Skills (`strategy-template/` and `tone-of-voice/`) are
left expanded on purpose. They are templates and examples you read and
edit. Once you fill `strategy-template/` with your team's actual content,
it becomes your own Skill.

## Opening the deck

`presentation/index.html` is self-contained. Double-click it; it opens
in any browser, fills the viewport, and scrolls section-by-section
like a deck. Use the spacebar, arrow keys, or the scroll wheel to
advance. Print to PDF for static slides.

The deck works offline. The only thing that loads from the network is
the typeface (system fonts kick in if you're offline; the fallback is
clean).

## Adapting the kit to your team

The scaffold is reusable. To fit a different team:

1. Open `skills/strategy-template/SKILL.md` and replace every `<placeholder>`
   with your team's actual content.
2. Add or rewrite reference files under `skills/strategy-template/references/`
   to capture the worldview, the operating model, the calibration.
3. Edit `presentation/index.html` directly. The narrative arc stays;
   the receipts swap.
4. Update `docs/agenda.md` to the running shape of your session.

## Built by

Vince Buyssens · Thoughtform · vince@thoughtform.studio

The kit ships with the AI Adoption playbook used at Loop Earplugs
(`skills/examples/ai-adoption-loop.skill`) as a worked example of how a
strategy Skill looks once it has been used in production for months.
