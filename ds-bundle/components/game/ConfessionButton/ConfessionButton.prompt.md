# ConfessionButton

A two-state toggle used to mark which players confess to the drawn card. Default
is a quiet outlined tile; when `.confessed` it fills crimson with an inner glow
and its mark glyph brightens.

## Class API
- `.confession-grid` — 2-column grid container for the toggles.
- `.confession-btn` — the toggle (`<button>`). Add/remove `.confessed` to flip
  state (typically on click).
  - `.confession-mark` — a leading glyph (e.g. 🔥) that is dimmed/greyed when
    unconfessed and brightens + scales up when `.confessed`.

## Usage
```html
<div class="confession-grid">
  <button class="confession-btn"><span class="confession-mark">🔥</span> Andressa</button>
  <button class="confession-btn confessed"><span class="confession-mark">🔥</span> Sabrina</button>
</div>
```

## Requires
`#woodcut-roughness` SVG filter in the page (see README).
