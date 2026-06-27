# ScoreItem (Scoreboard)

A tile tracking one player's remaining "essence" as a row of chalices. Lives in
a responsive grid under a scoreboard heading; the active player's tile is
gold-ringed and glowing.

## Class API
- `.game-scoreboard` — section wrapper (gold top rule).
- `.scoreboard-title` — small uppercase gold caption.
- `.scoreboard-grid` — auto-fit grid of tiles (`minmax(130px, 1fr)`).
- `.score-item` — one tile. Add `.active-turn` to highlight the current player.
  - `.score-name` — name (ellipsised), optionally a leading glyph.
  - `.score-lives` — row of chalices:
    - `.chalice-icon` — a remaining chalice (crimson, glowing).
    - `.chalice-icon.lost` — a spent chalice (greyed, shrunk, rotated).

## Usage
```html
<div class="game-scoreboard">
  <h4 class="scoreboard-title">Cálices de Essência</h4>
  <div class="scoreboard-grid">
    <div class="score-item active-turn">
      <span class="score-name">🐕 Andressa</span>
      <span class="score-lives">
        <span class="chalice-icon">🍷</span>
        <span class="chalice-icon">🍷</span>
        <span class="chalice-icon lost">🍷</span>
      </span>
    </div>
  </div>
</div>
```

## Requires
`#woodcut-roughness` SVG filter in the page (see README).
