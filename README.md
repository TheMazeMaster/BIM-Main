BIM Masterwheel – Master Build Specification (Written Outline)

🧭 Overview

The BIM Masterwheel is a fully modular, data-driven SVG visualization tool representing layered human instincts, behaviors, modifiers, and expressions across 7 concentric tiers (T0–T6). It emphasizes full user control, pixel-level alignment, and a clean separation of data, logic, and rendering. All values are explicitly declared; the engine performs no auto-inference.

🧱 Wheel Architecture

7 Tiers: T0 through T6, drawn center-out

globalDivisionCount: 132 (locked)

Rendering Order: T0 → T6

Draw Logic: Center-out, non-overlapping SVG segments

Rotation Controls: Arrow buttons in `index.html` rotate the wheel in fixed steps
and allow optional animation.

🔧 Global Config Controls

globalDivisionCount: Total radial slices (132)

debugRenderOutlines: When `true`, `main.js` draws thin circle outlines at each tier
boundary for alignment checks. Disable to hide these debug rings.

debugGuides: When `true`, `main.js` renders radial markers for every
`globalDivisionCount` slice. These lines rotate with the wheel to show
current division alignment.

strokeDefaults: Defines normal and wide line width globally

fontDefaults: Base font family and styling defaults


🎨 Color System

T3: Manual 10-color list (one per instinct block)

T4: 33 gradient pairs, defined via start/end hex codes

T5: mode: inherit from T4, with overlay: shade

T6: mode: inherit from T5, with overlay: tint

Transparent color: #00000000 or rgba(0,0,0,0)

Color palettes are defined in config.js for easy adjustment

🔁 Label and Font Logic

All tiers use a labelStyle config object

Supports centered (T0) and arcText or radial (T1–T6)

Font controls per tier: fontSize, fontWeight, anchor, verticalAlign

radiusOffset: Manual tweak value to fix arcText misalignment

All labels can be toggled with showLabels

🛠️ Stroke / Line Controls

Per-tier stroke object:

show: Toggles ring boundary rendering

normal, wide: Thickness settings

every: Applies wide stroke every N divisions

includeFirst: Ensures first line is always drawn

Segment wedges no longer use strokes for their radial boundaries. Bold
dividers are drawn via the `radialLines` overlay using the new
`t4SegmentAngles` list. The faint spreadsheet grid still comes from a
separate overlay.

🎛️ Fill Modes

solid: Flat fill

gradient-global: Gradient across full ring

gradient-manual: One gradient per segment (T4 style)

manual: Per-segment color list (T3)

inherit: Uses prior tier’s color at same index (T5, T6)

🧩 Division Logic

divisionWeights[]: Every tier from T3–T6 uses manual arrays

T3 = 10 weighted instincts (weights sum to 132)

T4 = 33 behaviors × 4 divisions = 132

T5/T6 = 132 divisions

Slice angles are determined per tier by (weight / globalDivisionCount) × 360°, so higher
weights produce wider segments.

No calculations are auto-derived — all index math is hard-defined

🧠 Data Sources

labelList: Local list of strings or generated (e.g. T5 modifiers)

labelListSource: Used in T6 to dynamically switch datasets

availableSources: ["quotes", "emotion", "tone", "behavior", "thriveCounter"]

Data is modular — content can be swapped by toggling source.
Edit `wheelData.js` and the dataset files (`quotes.js`, `emotion.js`,
`tone.js`, `behavior.js`, `thriveCounter.js`) to change or add content.

🧪 T6 Data Switching

T6 label set is dynamic

Button-style UI options allow live toggling between datasets

Entire dataset is pulled via labelListSource key

Each T6 state maps 1:1 with existing 132 segment structure

🔄 Rotation Modes

Rotation is optional, included in MVP

Rotation buttons in `index.html` increment or decrement the wheel in
fixed steps. All tiers (except T0–T2) rotate together
and track the current rotation angle.

T0–T2 have rotationLocked: true

🔍 Zoom Viewport

The wheel is wrapped in a `.wheel-viewport` container that hides any
overflow. `main.js` includes `zoomSlice`, `zoomScale`, and `zoomOffset`
variables and an `updateViewport()` helper that applies a CSS transform so
the chosen slice stays centered. Use the **Toggle Zoom** button in
`index.html` to enable or disable zoom on the first slice. When zoomed
in, the viewport gains a `zoomed` class (1200×500) and the wheel is
anchored to the left edge. When zoomed out, the viewport reverts to a
500×500 square and the wheel is centered automatically.

🖼️ Overlays

T4–T6 can include visual overlays via overlay block

Types: tint, shade

Applied per-tier (not global)

Optional radial overlay for global gradient (post-MVP)

Global overlays also support `ringOutline` and `radialLines` types. These accept
stroke `color`, optional `width` (defaulting to `renderOptions.strokeDefaults.wide`),
and either a `radius` (for ring outlines) or an `angles` array (for radial lines). `radialLines` may also specify `innerRadius` to start lines away from the center.
`radialLines` overlays automatically track the wheel's rotation; each angle is offset by the current rotation value.
All overlay objects accept an optional `visible` flag that defaults to `true`. Set it to `false` to temporarily hide that overlay.

The default configuration uses `radialLines` with `t4SegmentAngles` to draw
bold separators from tier T4 out to T6.

✅ MVP Summary

Fully functioning 7-tier wheel

All tier configurations modular and isolated

Stroke + fill + label + font fully customizable per tier

Rotation logic clear and flexible

Data sources external and switchable

Overlay and color layers locked in for T4–T6
The wheel's configuration is fully defined in `config.js`.
The previous `CONFIG_SPEC.md` snapshot has been removed.

This document is the ground truth blueprint. Feed this to any AI code engine, and it will have zero ambiguity.

Next steps: None. System complete. Ready to build.

🚀 Local Preview

Use a simple HTTP server to view the wheel locally:

```bash
python3 -m http.server
```

Then open [http://localhost:8000/index.html](http://localhost:8000/index.html) in your browser.


🧪 Tests
---------
There are currently no automated tests for this project.
The `npm test` script is intentionally empty and exists only to
prevent errors when running `npm test`.
