# Engine decision guide

## Decision tree

1. **Does the piece lean on organic motion, particles, effect stacks, or frame-by-frame finesse?** → After Effects. Don't fight it.
2. **Will a designer refine it interactively, and is it explainer-shaped (scenes/elements/keyframes)?** → Motion Lab (motion doc). Brief → draft → timeline → MP4.
3. **Is it programmatic at scale — hundreds of data-driven variants, video-in-video, React components reused from the product?** → Remotion directly.
4. **Is it agent-authored one-offs, web-page-derived video, or a no-license-cost requirement?** → HyperFrames (HTML + GSAP, no build step).
5. Mixed team, long term → author in motion docs; export to whichever renderer the pipeline needs (Motion Lab exports both).

## Licensing & cost (say this out loud in any evaluation)

| Engine | License | Cost reality |
|---|---|---|
| **Remotion** | Source-available. FREE for individuals and companies ≤3 people; **company license required in production for larger companies** | see remotion.pro — per-developer seats. An evaluation/spike is fine; shipping client work at a 4+ person company needs the license |
| **HyperFrames** | Apache 2.0 | free for any use, incl. commercial. Backed by HeyGen |
| **After Effects** | Adobe subscription | per-seat CC cost the team already pays; plugins extra |
| **Motion Lab** | internal tool | uses Remotion for preview/render → inherits the Remotion licensing question for production use |

## Practical constraints

| | Remotion | HyperFrames | AE |
|---|---|---|---|
| Runtime needs | Node 18+ (bundles its own Chrome+FFmpeg) | Node 22+, system FFmpeg, Chrome | Desktop app |
| Render locally | `npx remotion render` / Motion Lab button | `npx hyperframes render` | Render queue |
| Render in CI/cloud | Lambda/GitHub Actions (mature) | AWS Lambda (documented) | Media Encoder farm |
| Preview | React `<Player>`, instant | `hyperframes preview`, live reload | RAM preview |
| Authoring | React/TSX | plain HTML + GSAP timelines | GUI |
| Best asset input | React components, SVG, data | existing web pages/HTML, SVG | PSD/AI files, footage |

## Adoption path for a design team

1. **Week 1** — Motion Lab with the bundled examples: designer learns the vocabulary transfer (keyframes/easing already known; only the notation is new).
2. **First real piece** — one social cut through brief→generate→refine→render. Compare wall-clock honestly against the AE equivalent.
3. **Graduate** — when hitting Motion Lab's v1 walls (masks, paths, audio), take the SAME motion thinking to raw Remotion or HyperFrames with the vendored engine skills.
4. **Verdict point** — after piece #3, decide: parallel track for structured formats (usual outcome), or not worth it for this team's mix. Both are legitimate.
