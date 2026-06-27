# Panel / Surfaces

Container surfaces for grouping content on the obsidian grimoire background.

## Class API
- `.intro-box` — dashed tarnished-gold border, faint translucent fill. For
  intro/explanatory copy. Pair with `.intro-text` (justified italic body) — add
  `.center` to center it.
- `.standings-box` — solid **bright-gold** border with a woodcut edge and darker
  fill. For emphasised result/summary blocks. Usually leads with a
  `.section-title`.
- `.confession-panel` / `.game-scoreboard` — section blocks separated by a gold
  top rule (see ConfessionButton / ScoreItem cards).
- `.section-title` — uppercase, centered, gold, with a thin underline. The
  standard block heading inside surfaces.

## Usage
```html
<div class="intro-box">
  <p class="intro-text">Bem-vindas à mesa do destino…</p>
</div>

<div class="standings-box">
  <h3 class="section-title">Julgamento Final</h3>
  <p class="intro-text center">…</p>
</div>
```

## Requires
`#woodcut-roughness` SVG filter for `.standings-box` (see README).
