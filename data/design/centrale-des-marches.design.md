# DESIGN.md — Centrale des marchés

> Brand substrate for the Centrale des marchés. One file the team and the AI
> both read from. Drop it next to a `frame.md` to direct video; load it into
> Claude or the HyperFrames / Remotion Video Studio to brief decks, one-pagers,
> and testimonial cuts.
>
> This is a working template grounded in the live site
> (https://www.centraledesmarches.be/accueil). Refine the tokens against the
> brand book before shipping production assets.

---

## 1. Brand essence

- **Nom** — Centrale des marchés
- **Promesse** — *Votre partenaire en matière de marchés publics.*
- **Caractère** — *Minutieux. Fiable.*
- **Mission** — Décharger les autorités adjudicatrices belges des marchés
  publics : produire des accords-cadres correctement menés, contrôlés par
  des instances externes, et les mettre à disposition de leurs membres.
- **Bénéfice membre** — Gagner du temps et de l'argent, écarter le risque
  juridique, acheter directement auprès du fournisseur sans relancer un
  appel d'offres.
- **Public** — Pouvoirs adjudicateurs au sens de l'article 2 de la loi du
  17 juin 2016 : communes, zones de police et de secours, hôpitaux, CPAS,
  intercommunales, administrations régionales et fédérales.
- **Cadre légal** — Loi du 17 juin 2016 relative aux marchés publics
  (Belgique). Toute communication doit rester compatible avec ce cadre.

## 2. Positioning lines (FR, source of truth)

Use these verbatim where possible. They are the published voice of the
organisation and the canonical anchor for the AI to write around.

- *Centrale des marchés — Votre partenaire en matière de marchés publics.*
- *Minutieux, Fiable.*
- *Économisez à la fois du temps et de l'argent.*
- *Nous créons des contrats-cadres afin que vous n'ayez plus besoin de
  passer des appels d'offres.*
- *Adhérez à un accord-cadre déjà attribué — sans relancer un marché
  public.*
- *Gratuit et sans engagement pour les autorités adjudicatrices.*

## 3. Voice and tone

- **Register** — Institutionnel, factuel, rassurant. Pas commercial.
  Toujours respectueux du vocabulaire juridique (marché public, accord-
  cadre, pouvoir adjudicateur, attribution).
- **Person** — Vouvoiement systématique. Le sujet est presque toujours
  *l'autorité adjudicatrice* ou *le membre*, jamais *vous, particulier*.
- **Sentences** — Courtes. Une idée par phrase. Préférer l'indicatif
  présent. Éviter le futur sauf pour une étape de procédure.
- **Bannir** — *Révolutionnaire, disruptif, easy, fun, smart, nouveau
  paradigme*. Pas d'exclamation. Pas d'emoji. Pas d'anglicisme évitable
  (préférer *appel d'offres* à *RFP*, *accord-cadre* à *framework*).
- **Preuves** — Citer le cadre légal, l'attribution, le contrôle externe.
  Quand un chiffre est utilisé, le sourcer.
- **Langues** — FR primaire (Wallonie + Bruxelles). NL équivalent
  (Vlaanderen). EN seulement pour matériel international.

### Tone scale

| Surface                         | Tone                          | Example                                            |
|---------------------------------|-------------------------------|----------------------------------------------------|
| Site institutionnel             | Sobre, factuel                | *Votre partenaire en matière de marchés publics.*  |
| Brochure adhésion               | Pédagogique, rassurant        | *L'adhésion est gratuite et sans engagement.*      |
| Témoignage vidéo                | Conversationnel, posé         | *L'adhésion à la centrale, c'est quelques jours.*  |
| Communication juridique         | Précis, neutre                | *Au sens de l'article 2 de la loi du 17/06/2016.*  |
| Réseaux sociaux                 | Bref, informatif              | *Nouvel accord-cadre attribué. Détails en lien.*   |

## 4. Color tokens

Sober institutional palette. Navy as the trust anchor, warm gold as the
accent (signals the framework agreement / award), neutral slate for body
copy, paper white for surfaces. Validate against the brand book before
ship; treat the hex values below as a working starting point.

```yaml
color:
  brand:
    navy:         "#0B2A4A"   # Primary. Headers, logo, hero.
    navy_deep:    "#06192E"   # Hover / pressed.
    gold:         "#C9A24B"   # Accent. Awards, framework agreement badges.
    gold_soft:    "#E8D6A6"   # Tints, dividers, callouts.
  neutral:
    ink:          "#101418"   # Body copy.
    slate:        "#3B4654"   # Secondary copy, captions.
    rule:         "#D7DBE0"   # Hairlines.
    paper:        "#FFFFFF"   # Surfaces.
    paper_2:      "#F5F4EF"   # Calm secondary surface.
  semantic:
    success:      "#2E7D5B"   # Adhésion validée.
    warning:      "#B7791F"   # Action requise.
    error:        "#8E2A2A"   # Risque juridique évité.
```

Usage rules:

- Body copy is always `neutral.ink` on `neutral.paper`. Never gold on white
  body. Never navy on gold.
- Gold is a punctuation colour. Limit to one element per viewport (an
  underline, a small badge, a number).
- Charts and infographics: navy as series 1, gold as series 2, slate as
  series 3. No third bright colour.

## 5. Typography

Pair one quiet serif with one neutral grotesk. Both are widely available
on Google Fonts, so AI-generated decks and HTML one-pagers render
identically to print.

```yaml
typography:
  display:        "Source Serif 4, 'Source Serif Pro', Georgia, serif"
  body:           "Inter, 'Helvetica Neue', Arial, sans-serif"
  mono:           "JetBrains Mono, 'IBM Plex Mono', ui-monospace, monospace"
  scale:
    h1:           { size: 48, line: 56, weight: 600, tracking: -0.01 }
    h2:           { size: 32, line: 40, weight: 600, tracking: -0.01 }
    h3:           { size: 22, line: 30, weight: 600, tracking:  0    }
    eyebrow:      { size: 12, line: 16, weight: 500, tracking:  0.16, case: upper }
    body:         { size: 16, line: 26, weight: 400 }
    body_small:   { size: 14, line: 22, weight: 400 }
    caption:      { size: 12, line: 18, weight: 500 }
```

- Headlines in serif, never in mono.
- Quotes (témoignages) in display serif italic, attribution in eyebrow.
- Legal mentions in `body_small`, never in caption.

## 6. Layout and spacing

```yaml
grid:
  columns:        12
  gutter:         24
  max_width:      1200
  side_padding:   { mobile: 20, tablet: 40, desktop: 64 }
space:
  0: 0
  1: 4
  2: 8
  3: 12
  4: 16
  5: 24
  6: 32
  7: 48
  8: 64
  9: 96
radii:
  none:           0
  card:           6
  pill:           999
elevation:
  card:           "0 1px 2px rgba(11, 42, 74, 0.06), 0 8px 24px rgba(11, 42, 74, 0.06)"
```

- Pages breathe. Default vertical rhythm between sections is `space.8`
  (64) on desktop, `space.7` (48) on tablet.
- Cards are flat with a 1 px `neutral.rule` border and the `card`
  elevation. No drop shadows on text.
- Tables are the primary data surface (not chart-first). Stripe rows
  with `paper_2`, never with gold.

## 7. Imagery and iconography

- **Photography** — Architectural, documentary. Buildings publics (hôtels
  de ville, hôpitaux, casernes), bureaux d'agents administratifs, mains
  qui signent. Pas de stock americain. Lumière naturelle, palette froide,
  pas de saturation poussée.
- **Talents** — Représentation réaliste des agents publics belges. Pas
  d'uniformes mis en scène. Toujours nommer la fonction sous le portrait.
- **Iconographie** — Pictos linéaires 1.5 px, coins arrondis 2 px,
  noir `ink` ou navy. Jamais pleins, jamais multicolores.
- **Documents** — Quand on montre un accord-cadre à l'écran ou en vidéo,
  flouter les noms de fournisseurs sauf consentement explicite.

## 8. Logo

- Espace de protection minimal : hauteur du symbole sur les quatre côtés.
- Versions : couleur navy sur fond clair (primaire), blanc sur navy
  (inverse), navy sur gold pour sceaux d'accord-cadre uniquement.
- Ne pas inscrire le logo dans un cadre, ne pas l'incliner, ne pas
  l'animer en open / close au-delà d'un fade simple.

## 9. Motion (UI)

```yaml
motion:
  duration:
    instant:      120
    base:         200
    slow:         320
  easing:
    standard:     "cubic-bezier(0.2, 0.0, 0.0, 1.0)"
    enter:        "cubic-bezier(0.16, 1, 0.3, 1)"
    exit:         "cubic-bezier(0.4, 0, 1, 1)"
```

UI motion is functional, not decorative. Pages do not parallax. Hover
states translate at most 1 px. Modal entries fade plus 8 px rise.

## 10. frame.md — Video direction (HyperFrames)

This block is consumed by HyperFrames to compose the 16:9 testimonial
cut. The same constraints apply when an editor uses the Video Studio.

```yaml
frame:
  aspect:         "16:9"
  resolution:     "1920x1080"
  fps:            30
  background:     "neutral.paper"   # never pure black
  safe_margin:    "5%"              # respect on titles and lower thirds

pace:
  base_shot:      3.5    # seconds
  testimonial:    8.0    # interview B-roll cuts allowed at this length
  intro_logo:     1.6
  outro_cta:      4.0
  cut_floor:      1.2    # no shot shorter than this

dwell:
  title_card:     2.0
  lower_third:    2.4
  data_card:      3.2
  quote_card:     3.8

motion_video:
  type:           "documentary"
  camera:         "static or slow truck (≤ 6 px/s in 1080p)"
  push_in:        "5% over 6s on emotional beats only"
  zoom:           "forbidden during interview audio"
  transitions:    "hard cuts; cross-dissolve only on chapter breaks (12 frames)"

audio:
  vo_level:       -14    # LUFS
  music_bed:      -22    # LUFS, ducks -6 under VO
  mood:           "calm, institutional, mid-tempo strings or felt piano"
  forbidden:      ["EDM", "lo-fi hip hop", "stingers", "whoosh SFX"]

typography_video:
  title:          "Source Serif 4 Semibold 64 / 72"
  lower_third:    "Inter Medium 28 / 34, eyebrow caps 14"
  legal:          "Inter Regular 14"
  language:       "FR primary, NL or EN subtitles in 22px Inter Regular"

palette_video:
  base:           "neutral.paper"
  ink:            "neutral.ink"
  accent:         "brand.gold"      # single accent per shot
  badges:         "brand.navy"

lower_third:
  position:       "bottom-left, 5% safe"
  layout:         "[name] / [function, organisation]"
  duration:       2.4
  enter:          "8px rise + fade, 240ms ease-out"

testimonial_recipe:
  intent:         "Why we work with Monizze through the framework agreement."
  speakers:
    - { name: "Déborah Mécriet", role: "Communication Manager Secteur Public, Monizze" }
    - { name: "John",            role: "Juriste & Account Manager, Centrale des marchés" }
  structure:
    - chapter: "Setup"
      beats:   ["Logo intro 1.6s", "Title card: Adhérer à un accord-cadre"]
    - chapter: "Le partenariat"
      beats:   ["John explains framework agreement", "Lower thirds appear"]
    - chapter: "Deux options"
      beats:   ["Option 1: appel d'offres — risque, charge admin",
                "Option 2: adhésion à la centrale — gain de temps"]
    - chapter: "Éligibilité"
      beats:   ["Liste pouvoirs adjudicateurs", "Article 2 — loi 17/06/2016"]
    - chapter: "Onboarding"
      beats:   ["Déborah détaille le parcours d'adhésion",
                "Quelques jours, gratuit, sans engagement"]
    - chapter: "Outro"
      beats:   ["URLs: monizze.be / centraledesmarches.be/accueil",
                "Logo Centrale + Monizze, fade 12 frames"]
  end_card:
    primary:      "centraledesmarches.be/accueil"
    secondary:    "monizze.be"
    cta:          "Adhérez gratuitement, sans engagement."
```

## 11. Asset recipes

Briefs ready to paste into Claude or the Video Studio. Each recipe
assumes this `design.md` is loaded as context.

### 11.1 Testimonial cut (V2 of the Centrale × Monizze video)

> Brief — Re-edit the existing iPhone footage of Déborah Mécriet
> (Monizze) and John (Centrale des marchés) into a 90-second testimonial
> cut for the Centrale des marchés homepage. Respect the `frame.md`
> block above: documentary pace, 3.5 s base shot, hard cuts, two
> cross-dissolves at chapter breaks. Open on the logo card (1.6 s),
> introduce the partnership, contrast the two options for contracting
> authorities, ground in the eligibility frame (article 2, loi du
> 17/06/2016), close on the onboarding promise and the two URLs.

### 11.2 One-pager (PDF)

> Brief — Generate a one-page PDF titled *Adhérer à la Centrale des
> marchés en quelques jours*. Three blocks: (1) Promesse, (2) Deux
> options (appel d'offres vs adhésion), (3) Procédure d'adhésion. Use
> the typography scale above, navy as block titles, gold as a single
> badge on block (2) labelled *Recommandé*. No images. Print-safe
> margins.

### 11.3 Slide deck (intake meeting)

> Brief — Six-slide PPTX intake deck for a contracting authority
> evaluating the framework agreement. 1: cover, 2: problème (manque
> d'acheteurs, manque de temps), 3: notre proposition (accords-cadres
> attribués), 4: éligibilité, 5: parcours d'adhésion, 6: contacts.
> Honour the colour and motion tokens. Use the `quote_card` dwell for
> the testimonial slide.

### 11.4 Social card (LinkedIn, 1080×1350)

> Brief — Square portrait card announcing a new framework agreement.
> Headline in Source Serif 4 Semibold 56, eyebrow `NOUVEL ACCORD-CADRE`
> in Inter Medium 14 tracked 16. Single gold underline under the
> headline. Logo bottom-left, URL bottom-right. No photo.

## 12. Editorial guardrails

- Always name the legal basis when claiming the procurement shortcut
  (loi du 17/06/2016, article 2). Otherwise the claim reads as
  marketing.
- Always state that adhesion is *gratuite et sans engagement* in any
  acquisition surface.
- Never compare members to non-members by name.
- Never quote a private supplier's price without their written
  authorisation.

## 13. File and naming conventions

- `centrale-des-marches.design.md` — this file.
- `frame.md` — sits next to a video project, references this design.md.
- Final exports: `cdm--{kind}--{slug}--{yyyy-mm-dd}.{ext}` where `kind`
  is `video | deck | onepager | social` and `slug` is kebab-case.

## 14. Source

- https://www.centraledesmarches.be/accueil
- Loi du 17 juin 2016 relative aux marchés publics
- Témoignage vidéo Centrale des marchés × Monizze (Déborah Mécriet, John)

> Tokens marked with hex values are a working starting point informed by
> the live site. Validate against the official brand book before
> production use.
