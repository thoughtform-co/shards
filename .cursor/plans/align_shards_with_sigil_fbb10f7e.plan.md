---
name: Align shards with Sigil
overview: "Update shards home page to match Sigil's visual system: add rails with tick marks, adopt Sigil's grid/layout tokens, replace overused corner brackets with viewport-only corners, and restyle section labels to match Sigil's gold section-label pattern."
todos:
  - id: layout-tokens
    content: Add Sigil layout tokens, numeric spacing scale, hud-padding, and widescreen scaling breakpoints to globals.css
    status: completed
  - id: rails
    content: Add left/right tick-mark rails to HubFrame (48px, 25 ticks, gradient line, hidden below 1100px)
    status: completed
  - id: corners
    content: Move corner brackets to viewport-level only (24x24, gold, fixed). Remove corner brackets from inner panels.
    status: completed
  - id: section-labels
    content: Replace .hud-readout with .sigil-section-label (gold labels, dawn-50 bearings). Update all label references in page.tsx.
    status: completed
  - id: flatten-panels
    content: Change surface-panel from gradient background to flat var(--surface-0)
    status: completed
  - id: grid-rewrite
    content: Rewrite .shards-grid classes to use fixed sidebar + fluid center, token-based gaps, and layout-content-lg max-width
    status: completed
  - id: home-page-markup
    content: "Update page.tsx: remove inner corners, restyle labels, use CSS grid classes, add xl:grid-cols-3 for cards"
    status: completed
isProject: false
---

# Align Shards With Sigil's Visual System

## What's Wrong Now

Looking at the screenshot, the shards hub page has several deviations from Sigil:

- **Corner brackets on every panel** -- Sigil only puts corners on the outermost viewport frame. Shards puts them on HubFrame AND the aside panel, doubling the motif.
- **No rails** -- Sigil has left/right tick-mark rails (48px, 25 ticks, gradient line). Shards has a simple text-label rail with no ticks.
- **Section labels are too dim** -- Shards uses `dawn-30` (text-muted) for labels. Sigil uses **gold** for section labels with bearings in `dawn-50`.
- **Gradient panel backgrounds** -- Sigil uses flat `var(--surface-0)` or transparent. Shards uses gradient backgrounds that add visual weight.
- **Fractional grid columns** instead of Sigil's fixed-sidebar + fluid pattern.
- **No widescreen scaling** -- missing layout tokens and breakpoints at 1536/1920/2560px.

---

## Changes

### 1. Add Sigil-style rails to the shell -- `[globals.css](app/globals.css)` + `[HubFrame.tsx](components/hub/HubFrame.tsx)`

Port Sigil's rail pattern:

- Left and right rails, 48px wide, positioned inside the HUD padding area
- Vertical gradient line: `linear-gradient(to bottom, transparent 0%, var(--dawn-30) 10%, var(--dawn-30) 90%, transparent 100%)`
- 25 tick marks, 3 major ticks (indices 6, 12, 18) with numeric labels
- Major ticks: 20px wide, `var(--gold)`. Minor ticks: 10px wide, `var(--gold-30)`
- Hidden below 1100px via media query

Since shards is lighter than Sigil (no journey navigation, no nav spine), the rails live directly in `HubFrame` rather than a separate `NavigationFrame`. No top nav bar or breadcrumb needed.

### 2. Fix corner brackets -- `[globals.css](app/globals.css)` + `[HubFrame.tsx](components/hub/HubFrame.tsx)` + `[page.tsx](app/page.tsx)`

- **Keep** 4 viewport-level corner brackets on the outermost `HubFrame` shell (matching Sigil's fixed `hud-corner` pattern: 24x24px, gold, at `var(--hud-padding)` inset)
- **Remove** corner brackets from inner panels (the aside "System Notes" panel currently has its own `.corner-brackets` div)
- Panels get simple `1px solid var(--dawn-08)` borders only, no corner decoration

### 3. Restyle section labels -- `[globals.css](app/globals.css)` + `[page.tsx](app/page.tsx)`

Replace `.hud-readout` styling to match Sigil's `.sigil-section-label`:

```css
.sigil-section-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}
```

Bearing numbers ("00", "01", "02") render in `dawn-50`, label text in gold. This is brighter and more intentional than the current `dawn-30` muted style.

### 4. Flatten panel backgrounds -- `[globals.css](app/globals.css)`

Change `.surface-panel` from gradient to flat:

```css
.surface-panel {
  border: 1px solid var(--dawn-08);
  background: var(--surface-0);
}
```

This matches Sigil's card/panel treatment -- flat surfaces, no gradients.

### 5. Add layout tokens and widescreen scaling -- `[globals.css](app/globals.css)`

Replace `--content-max-width: 1240px` with Sigil's layout token system:

```css
--layout-content-sm: 960px;
--layout-content-md: 1200px;
--layout-content-lg: 1400px;
--layout-card-min: 200px;
```

Add widescreen breakpoints at 1536px, 1920px, 2560px that scale these values up (matching Sigil exactly). Add the numeric spacing scale (`--space-0` through `--space-13`).

### 6. Rewrite grid classes -- `[globals.css](app/globals.css)` + `[page.tsx](app/page.tsx)`

Replace fractional columns with Sigil's fixed-sidebar pattern:

```css
.shards-grid--hub {
  grid-template-columns: 1fr 320px;
  gap: var(--space-xl);
  max-width: var(--layout-content-lg);
}
```

- Use `var(--space-lg)` for `.shards-grid` base gap
- Update card grid from `md:grid-cols-2` to `md:grid-cols-2 xl:grid-cols-3`
- Add `--hud-padding: clamp(24px, 4vw, 56px)` for content inset (matching Sigil)

### 7. Update home page markup -- `[page.tsx](app/page.tsx)`

- Remove `corner-brackets` div from the aside panel
- Switch section labels from `.hud-readout` class to `.sigil-section-label` with bearing/label split
- Replace inline grid Tailwind classes with the CSS grid classes
- Expand card grid to `xl:grid-cols-3`

---

## Files to modify

- `[app/globals.css](app/globals.css)` -- layout tokens, rails CSS, corner fixes, section label class, panel backgrounds, widescreen scaling
- `[components/hub/HubFrame.tsx](components/hub/HubFrame.tsx)` -- add rail markup, move corners to viewport-level, add hud-padding
- `[app/page.tsx](app/page.tsx)` -- remove inner corner brackets, restyle labels, use CSS grid classes

