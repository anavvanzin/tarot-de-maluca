# ArchetypeSelector

Segmented radio group. The native radios are visually hidden; the adjacent
`.custom-radio` chip carries the look and flips to solid gold when its input is
`:checked`.

## Class API
- `.archetype-selector` — bordered container (column: label + options).
- `.selector-label` — small uppercase gold caption.
- `.archetype-options` — flex row of choices.
- `.radio-label` — one choice; wraps a hidden `<input type="radio">` **followed
  by** `.custom-radio` (the visible chip). Order matters — the checked style is
  `input:checked + .custom-radio`.

Give the radios in a group the same `name`.

## Usage
```html
<div class="archetype-selector">
  <span class="selector-label">Temperamento</span>
  <div class="archetype-options">
    <label class="radio-label">
      <input type="radio" name="archetype" value="labrador" checked>
      <span class="custom-radio">🐕 Labrador</span>
    </label>
    <label class="radio-label">
      <input type="radio" name="archetype" value="gato-preto">
      <span class="custom-radio">🐈 Gato Preto</span>
    </label>
  </div>
</div>
```

## Requires
`#woodcut-roughness` SVG filter in the page (see README).
