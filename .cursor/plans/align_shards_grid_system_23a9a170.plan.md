---
name: Align shards grid system
overview: "Update the shards home page and CSS to match Sigil's grid patterns: layout tokens with widescreen scaling, fixed-width sidebars with fluid center, token-based gaps, and numeric spacing scale."
todos:
  - id: layout-tokens
    content: Add Sigil layout tokens (--layout-content-sm/md/lg), numeric spacing scale, and widescreen scaling breakpoints to globals.css
    status: pending
  - id: grid-classes
    content: Rewrite .shards-grid and .shards-grid--hub to use fixed-sidebar + fluid-center pattern with token-based gaps
    status: pending
  - id: home-page
    content: Update page.tsx to use CSS grid classes instead of inline Tailwind, add xl:grid-cols-3 for cards
    status: pending
  - id: verify-hubframe
    content: Verify HubFrame.tsx works with new grid definitions, adjust if needed
    status: pending
isProject: false
---

# Align Shards Grid System With Sigil

## Problem

The shards hub page uses ad-hoc fractional grids (`1.25fr / 0.75fr`), a single content width (1240px), and clamped gaps. Sigil and other Thoughtform repos use fixed-width sidebars, layout tokens with widescreen scaling, and token-based gaps from the 8px spacing scale.

## Changes

### 1. Add Sigil's layout tokens and widescreen scaling to `[globals.css](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\app\globals.css)`

- Replace `--content-max-width: 1240px` with Sigil's three-tier layout tokens:

```css
--layout-content-sm: 960px;
--layout-content-md: 1200px;
--layout-content-lg: 1400px;
--layout-card-min: 200px;
```

- Add the numeric spacing scale (`--space-0` through `--space-13`) that Sigil uses alongside the existing semantic aliases.
- Add widescreen scaling breakpoints at 1536px, 1920px, and 2560px (matching Sigil exactly).

### 2. Rewrite `.shards-grid` classes in `[globals.css](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\app\globals.css)`

Replace the current fractional column definitions:

```css
/* Current (fractional — not Thoughtform pattern) */
.shards-grid--hub {
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
}
```

With Sigil's fixed-sidebar + fluid-center pattern:

```css
/* New (fixed aside, fluid main — matches Sigil dashboard) */
.shards-grid--hub {
  grid-template-columns: 1fr 320px;
  gap: var(--space-xl);
  max-width: var(--layout-content-lg);
}
```

- Update `.shards-shell` to use `--layout-content-lg` instead of `--content-max-width`.
- Change `.shards-grid` gap from `clamp(16px, 2vw, 24px)` to `var(--space-lg)`.
- Responsive collapse at 920px stays (single column).

### 3. Update `[HubFrame.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\components\hub\HubFrame.tsx)`

- The masthead/aside grid already uses `.shards-grid--hub` -- no structural changes needed, but verify the markup still works with the new column definition.

### 4. Update the home page `[page.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\app\page.tsx)`

- Replace the inline two-column grid (`lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]`) with the CSS class `.shards-grid .shards-grid--hub` for consistency.
- Update the card grid from `md:grid-cols-2` to `md:grid-cols-2 xl:grid-cols-3` to match Sigil's Projects/Journeys pattern.
- Replace `gap-5` with `gap-[var(--space-lg)]` to use tokens.

### 5. Keep what already works

- Color tokens (void, dawn, gold, atreides) already match Sigil.
- Corner brackets, HUD readouts, gold links, surface panels are correct.
- Semantic spacing aliases already align.
- Bodoni Moda (display font) is intentionally different from Sigil's display font -- this is fine for the experiment hub identity.

## Files to modify

- `[app/globals.css](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\app\globals.css)` -- layout tokens, spacing scale, grid classes, widescreen scaling
- `[app/page.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\app\page.tsx)` -- swap inline grid for CSS classes, expand card columns
- `[components/hub/HubFrame.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\components\hub\HubFrame.tsx)` -- verify/adjust markup if needed

