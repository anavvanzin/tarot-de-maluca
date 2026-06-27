# TarotCard

The hero element: a 3D-flippable arcana card on aged parchment with a gold-foil
border. Has a back face (card art) and a front face (number, name, woodcut
illustration, and an "Eu nunca…" confession statement).

## Class API
- `.reveal-card-viewport` — perspective stage; center the card in it.
- `.tarot-card-3d` — the flip container. Add `.flipped` to show the **front**
  face (rotateY 180°); without it the **back** face shows.
- `.card-side.back` / `.card-side.front` — the two faces.
- `.card-inner-border` — inner ink frame inside each face.
- Back face: `.card-art-back` (fills with `assets/card-back.png`).
- Front face:
  - `.card-header-info` › `.arcana-num` (roman numeral, crimson) + `.arcana-name`
  - `.card-illustration-container` › `.card-illustration` (set `background-image`
    inline). Add `.placeholder-art` for a 🔮 fallback when no art is set.
  - `.card-statement-container` › `.statement-prefix` ("Eu nunca…") +
    `.statement-text` (the `<blockquote>` confession).

## Usage
```html
<div class="reveal-card-viewport">
  <div class="tarot-card-3d flipped">
    <div class="card-side back"><div class="card-inner-border"><div class="card-art-back"></div></div></div>
    <div class="card-side front">
      <div class="card-inner-border">
        <div class="card-header-info"><span class="arcana-num">XVI</span><h3 class="arcana-name">O DIABO</h3></div>
        <div class="card-illustration-container">
          <div class="card-illustration" style="background-image:url('assets/arcana-devil.png')"></div>
        </div>
        <div class="card-statement-container">
          <p class="statement-prefix">Eu nunca...</p>
          <blockquote class="statement-text">"…"</blockquote>
        </div>
      </div>
    </div>
  </div>
</div>
```
Toggle `.flipped` (e.g. on click) to animate the reveal.

## Requires
Card art assets under `assets/` and the `#woodcut-roughness` SVG filter for any
nested woodcut-edged elements (see README).
