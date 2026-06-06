# Build a Skill · the live exercise

The tangible 30 minutes of the workshop. Walk the room through these
four steps in parallel, with everyone working on their own pre-work
choice. Pause for share-outs after step two and step three.

## What you bring

- **One workflow you do often.** From your pre-work answer.
- **Three good past examples** of that workflow's output.
- **A short, real task** in the same shape as the workflow, so you can
  test the Skill at step three.
- **Claude open.** Cloud (Claude.ai) or Cowork or Code, whichever you
  use. Skills enabled.

## Step 01 · Pick (5 minutes)

Look at the workflow you brought. Sharpen it down to a sentence:

> When I get **<input shape>**, I produce **<output shape>**, by
> applying **<my team's specific judgment>**.

Examples:

- "When I get a recorded interview, I produce a 90-second social cut,
  by picking moments that escalate and deleting filler around them."
- "When I get a designer's brief, I produce a one-pager that an
  external partner can quote against, by anchoring scope and naming
  what is out of scope."
- "When I get a CMF workbook, I produce a supplier-ready brief, by
  generating renders that match the variant grid and structuring the
  intent doc to a fixed format."

If your sentence is fuzzy, the Skill will be fuzzy. Tighten it before
you move on.

## Step 02 · Narrate (10 minutes)

Open Claude. Start a new chat with the Skill creator (`/skill-creator`)
or just paste this scaffold and adapt it:

> I want to build a Skill for the following workflow:
>
> **<your sharpened sentence from step 01>**
>
> Here are three good past examples of the output:
>
> [paste or attach the three examples]
>
> Here is how I think about it when I do it well:
>
> [narrate, in plain language: what you look for, what you cut, what
> you escalate, what you never do, where you copy a pattern from a
> reference doc, where you make a judgment call]
>
> Please draft a SKILL.md that captures this. Use the structure:
> activation (when this Skill applies), rules, examples (link to the
> three I provided), references (anything I mentioned), loops (who
> confirms what).

Claude will draft a Skill back. Read it. It will get parts right and
parts wrong. That is fine.

**Share-out moment.** Pick three people from the room to read their
narration aloud (not the Skill). The narration is more interesting than
the draft; it is the first time the team's tacit knowledge has been
spoken plainly.

## Step 03 · Run (10 minutes)

Take the draft Skill and try it on the **fresh real task** you brought.
Not on one of the three examples; on something the Skill has not seen.

The first run will be wrong in interesting ways. Note where:

- A rule the Skill made up that does not match how you actually work.
- A rule you take for granted that the Skill missed.
- An example you should have included but didn't.
- A judgment call the Skill tried to automate that should have stayed
  with a human.

Edit the Skill to fix the gaps. Run it again. Read both outputs side
by side.

**Share-out moment.** Three more people show "where the first run got
it wrong, and what I added." This is where the room starts seeing the
shape of their team's actual judgment.

## Step 04 · Share (5 minutes)

Export your Skill:

- **Cloud**: Claude.ai → Skills → your Skill → export. You get a
  `.skill` file (it's just a zip).
- **Local**: zip the `SKILL.md` and any `references/` files into
  `<your-skill-name>.skill`.

Drop the bundle in:

- A team Slack channel,
- A shared Drive / Notion page, or
- The team's `~/.claude/skills/` folder if you all use Claude Code.

Whoever picks it up next does not start from zero.

## What goes wrong

- **Trying to encode everything at once.** Pick one workflow. One.
  Multi-Skill packages are downstream work.
- **Encoding the obvious.** "Be on-brand" is not a rule. "Use these
  three opening lines as the pattern; never start with 'In today's'."
  is a rule.
- **Skipping the run.** Without testing on a fresh task, you ship a
  Skill that pattern-matches your three examples and breaks on
  anything else.
- **Locking too early.** First versions of a Skill should run in
  GUIDE mode (format fixed, content has room). Lock it down only when
  the team has used it enough to know what good looks like.

## What good looks like at the end

A draft Skill, in your hands, that:

- Names when it applies (activation rules).
- Lists 3–7 specific rules, not slogans.
- Links to or quotes the three examples.
- Calls out at least one judgment call that stays with a human.
- Has been tested on one real task and refined once.

That is enough. The Skill compounds with use. The first version is
not the finished version; it is the version you start using.
