# RankingItem (Final Standings)

A row in the end-of-game judgement: player name (optionally with an honorific
badge) on the left, remaining lives on the right, separated by a dashed gold
rule.

## Class API
- `.standings-box` — gold-bordered container (woodcut edge). Usually preceded by
  a `.section-title` ("Julgamento Final").
- `.rankings-list` — vertical stack of rows.
- `.ranking-item` — one row (space-between; dashed bottom rule, none on last).
  - `.ranking-player-name` — name + optional badge.
  - `.ranking-title-badge` — honorific chip. Modifiers:
    `.pure` (gold, "A Alma Mais Pura") · `.doomed` (crimson, "A Condenada").
  - `.ranking-lives-info` — remaining chalices count (gold).

## Usage
```html
<div class="standings-box">
  <h3 class="section-title">Julgamento Final</h3>
  <div class="rankings-list">
    <div class="ranking-item">
      <span class="ranking-player-name">Andressa
        <span class="ranking-title-badge pure">A Alma Mais Pura</span></span>
      <span class="ranking-lives-info">3 🍷</span>
    </div>
  </div>
</div>
```

## Requires
`#woodcut-roughness` SVG filter in the page (see README).
