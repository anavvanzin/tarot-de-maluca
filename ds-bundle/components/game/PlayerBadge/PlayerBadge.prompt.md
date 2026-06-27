# PlayerBadge

A chip representing a summoned player. Translucent fill, tarnished-gold border,
hard ink shadow, woodcut edge; pops in when added.

## Class API
- `.players-list-badge` — `<ul>` flex-wrap container for the chips (centered,
  gapped). Use `.empty-list-msg` on an `<li>` for the empty state.
- `.player-badge` — one chip (`<li>`). Compose:
  - `.player-icon` — leading archetype glyph (gold).
  - the player name as text.
  - `.remove-player-btn` — crimson `×` button to dismiss the player.

## Usage
```html
<ul class="players-list-badge">
  <li class="player-badge">
    <span class="player-icon">🐕</span> Andressa
    <button class="remove-player-btn" aria-label="Remover">×</button>
  </li>
  <li class="empty-list-msg">Nenhuma alma invocada ainda...</li>
</ul>
```

## Requires
`#woodcut-roughness` SVG filter in the page (see README).
