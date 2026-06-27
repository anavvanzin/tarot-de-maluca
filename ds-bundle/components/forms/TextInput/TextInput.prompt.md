# TextInput

Aged-parchment text field — translucent fill, tarnished-gold border that lights
to bright gold on focus, woodcut edge.

## Class API
The input styling is scoped to a `.lobby-form` ancestor. Wrap fields in a
`<form class="lobby-form">` and group each with `.input-group` (a flex row,
`gap` + bottom margin) for correct spacing.

- `.lobby-form input[type="text"]` — the styled field.
- `.input-group` — row wrapper; place the input (and optionally an adjacent
  button) inside.

## Usage
```html
<form class="lobby-form">
  <div class="input-group">
    <input type="text" placeholder="Nome da jogadora..." maxlength="15">
  </div>
</form>
```

## Requires
`#woodcut-roughness` SVG filter in the page (see README). The `.lobby-form`
wrapper is mandatory — a bare `<input>` will not pick up these styles.
