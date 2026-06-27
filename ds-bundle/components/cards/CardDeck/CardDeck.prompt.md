# CardDeck

A stacked, tappable draw pile. Four layered card faces create depth; the top
card shows the back art and a prompt label. Lifts and tilts on hover.

## Class API
- `.deck-area` — centering stage (gives the deck breathing room / min-height).
- `.deck-container` — fixed 170×250 perspective box.
- `.card-deck-visual` — the interactive stack (`role="button"` + `aria-label`).
- `.deck-card-layer` — a card face. Use `.layer-1` / `.layer-2` / `.layer-3` for
  the receding shadow cards (rotated, fading opacity) and `.top-card` for the
  front one.
- Inside `.top-card`: `.deck-back-art` (fills with `assets/card-back.png`) and
  `.deck-prompt-text` (the "Toque para Tirar" caption).

## Usage
```html
<div class="deck-area"><div class="deck-container">
  <div class="card-deck-visual" role="button" aria-label="Tirar uma carta">
    <div class="deck-card-layer layer-1"></div>
    <div class="deck-card-layer layer-2"></div>
    <div class="deck-card-layer layer-3"></div>
    <div class="deck-card-layer top-card">
      <div class="deck-back-art"></div>
      <div class="deck-prompt-text">Toque para Tirar</div>
    </div>
  </div>
</div></div>
```

## Requires
`assets/card-back.png`.
