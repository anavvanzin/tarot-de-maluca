# IconButton

Compact circular utility button — obsidian fill, gold ring, gold glyph. Used for
the floating sound toggle and other single-glyph controls.

## Class API
- `.btn-icon` — 42×42 round button. Put a single emoji/glyph (ideally wrapped in
  a `<span>`) inside. Hover scales up with a gold glow.

## Usage
```html
<button class="btn-icon" aria-label="Alternar som"><span>🔔</span></button>
```

Always give an `aria-label` — the glyph alone is not an accessible name.

## Requires
`#woodcut-roughness` SVG filter present in the page (see README).
