---
name: 3D jukebox scene
overview: Replace the current two-panel campus jukebox with a fixed-camera Three.js jukebox cabinet that contains a bottom upload dock and top playlist display, while preserving the existing upload, generation, and audio-preview logic.
todos:
  - id: scene-architecture
    content: Turn the current visualizer into a fixed-camera 3D jukebox cabinet using Three.js primitives, lighting, trims, bulbs, and screen/upload apertures
    status: completed
  - id: overlay-components
    content: Extract a bottom upload dock and top playlist display as DOM overlays aligned to the jukebox scene
    status: completed
  - id: page-controller
    content: Refactor JukeboxPage into a scene-first controller that preserves upload, fetch, playback, and analyser logic while composing the new stage
    status: completed
  - id: stage-layout
    content: Rewrite the CSS from a flat grid into a centered stage with top/bottom overlays, no default desktop scrolling, and subtle ZooMedia atmospheric gradients
    status: completed
  - id: state-animations
    content: Implement distinct idle, generating, and playing cabinet behaviors, including bulb chase and scene-integrated playback visualization
    status: completed
  - id: student-scope
    content: Keep the route student-facing and leave the Shards homepage/admin shell untouched
    status: completed
isProject: false
---

# Build A 3D Campus Jukebox

## Direction

Shift the route from a flat dashboard to a **scene-first 3D jukebox**.

The user should see one fixed-camera jukebox object with real depth, lighting, chrome, and animated lights. The interactive parts stay practical and accessible by living in DOM overlays that are visually embedded into the 3D object:

- **Bottom aperture**: upload/photo dock
- **Top aperture**: generated playlist display/player

This keeps the student experience theatrical without turning file input and playback into brittle 3D UI.

## What stays

Preserve the existing working logic in `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.tsx)`:

- file selection and preview URL lifecycle
- POST to `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\app\api\experiments\image-to-spotify\analyze\route.ts](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\app\api\experiments\image-to-spotify\analyze\route.ts)`
- result/error/loading state
- inline preview playback using `HTMLAudioElement`
- `AudioContext` + `AnalyserNode` hookup

The current API already returns what the scene needs via `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\server\spotify.ts](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\server\spotify.ts)`: `tracks`, `url`, and `previewUrl`.

## New structure

### 1. Make the scene the primary layer

Turn `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxVisualizer.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxVisualizer.tsx)` into the full fixed-camera cabinet renderer rather than a decorative particle background.

Recommended scene graph:

- `cabinetGroup`
- `archGroup`
- `displayGroup`
- `uploadBayGroup`
- `trimGroup`
- `bulbGroup`
- `fxGroup`
- `environmentGroup`

Use plain `three` primitives only for v1:

- `BoxGeometry` for the body/base
- `TorusGeometry` for the arch and chrome trims
- `CylinderGeometry` for side rails / knobs / columns
- `PlaneGeometry` for display glass, screen backplate, upload frame, floor, and backdrop
- `RingGeometry` for playback halos around the top display
- `SphereGeometry` for bulbs

No orbit controls, no drag, no camera rotation.

### 2. Keep the UI surfaces as DOM overlays

Split the current large page component into a scene wrapper plus two overlay components:

- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxUploadDock.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxUploadDock.tsx)`
- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPlaylistDisplay.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPlaylistDisplay.tsx)`

These should be absolutely positioned inside the stage shell and visually aligned to the 3D cabinet’s apertures.

Why DOM instead of 3D UI:

- file input remains reliable and accessible
- scrollable track list stays simple
- play/pause and Spotify links keep normal browser behavior
- no raycasting/focus complexity

### 3. Recompose the page controller

Refactor `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.tsx)` into a controller/composer that:

- owns upload/generation/playback/analyser state
- renders a single `stage` shell
- mounts the 3D scene as the bottom layer
- mounts the top display overlay when results exist
- mounts the bottom upload dock overlay always

This replaces the current literal left/right page grid with one portrait-biased stage.

### 4. Replace the flat two-panel CSS with a stage layout

Rewrite `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.module.css](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.module.css)` around:

- one centered scene shell
- clamped stage width/height for laptop-first composition
- overlay positioning for top display and bottom dock
- no page scrolling in the default desktop view
- a subtle blue/pink atmospheric background behind the stage

The current `.grid`, `.uploadPanel`, and `.outputPanel` structure should be removed in favor of:

- `.stage`
- `.sceneLayer`
- `.displayOverlay`
- `.uploadOverlay`
- `.ambientBackdrop`

### 5. Redesign the visual states of the jukebox

Use the existing `mode` and playback state to drive cabinet behavior.

**Idle**

- low emissive bulb glow
- faint ambient particle drift
- subtle screen glass shimmer

**Generating**

- marquee / bulb chase animation
- a soft internal hum effect expressed visually as moving light sweeps
- animated music-note / orbital / ribbon motion inside the cabinet
- no fake percentage progress, since generation is still one request/response cycle

**Playing**

- analyser-driven halos around the top display
- non-equalizer visual language: orbiting rings, radiating contours, drifting ribbons, or chromatic speaker ripples
- high frequencies can brighten bulbs or trim accents
- low/mid bands can drive ring thickness, scale, and displacement

### 6. Keep the Spotify output custom, not iframe-based

Do not switch to a Spotify embed iframe.

The right implementation is still a **custom playlist display/player** because the current API returns track-level `previewUrl` data rather than a playlist embed object.

The top display overlay should show:

- generated playlist title
- compact track list
- inline play/pause per previewable track
- external Spotify escape hatch per track

Keep handling `previewUrl: null` gracefully.

### 7. Add material richness without heavy assets

The user asked for textures, but scope should stay moderate.

Preferred approach:

- generate lightweight procedural/canvas textures inside the scene for speaker-grille dots, scanlines, brushed metal, and subtle cabinet variation
- use emissive and roughness variation to sell depth
- avoid external GLTF/model dependency for v1

If one or two tiny static textures are needed, place them under:

- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\public\experiments\image-to-spotify\](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\public\experiments\image-to-spotify\)`

## Files to change

- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.tsx)`
Convert from flat layout into controller + stage composition.
- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.module.css](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPage.module.css)`
Replace grid panels with stage/overlay layout and atmospheric background.
- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxVisualizer.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxVisualizer.tsx)`
Turn the particle background into the full fixed-camera 3D jukebox renderer.
- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxUploadDock.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxUploadDock.tsx)`
New overlay for upload/photo interaction.
- `[c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPlaylistDisplay.tsx](c:\Users\buyss\Manifold Delta\Artifacts\.vault\00_shards\experiments\image-to-spotify\ui\JukeboxPlaylistDisplay.tsx)`
New overlay for playlist title, tracks, and inline playback.

## Validation

After implementation, the route should feel like:

- one centered non-rotatable 3D jukebox, not a dashboard
- bottom photo dock integrated into the object
- top playlist display integrated into the object
- lighting and textures that make the cabinet read with depth
- generation state expressed as animated lights and motion
- playback state expressed as a musical WebGL visualization, not a generic equalizer
- student-facing route preserved, admin hub untouched

