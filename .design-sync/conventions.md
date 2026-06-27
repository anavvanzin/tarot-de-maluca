# O Tarô de Maluca — Design System

A mystical, candle-lit **woodcut tarot** aesthetic: obsidian grimoire surfaces,
gold-foil accents, aged-parchment cards, crimson for danger/loss. This is a
**CSS class** design system (no React/JS components) — you build with semantic
HTML and the classes below.

## Setup — load order & the woodcut filter (read this first)

1. **Link `styles.css` once.** It `@import`s the Google Fonts (Cinzel Decorative,
   Cinzel, Almendra) and the full component stylesheet. Everything else depends
   on it.
2. **Include the woodcut SVG filter once per page.** Many components use
   `filter: url(#woodcut-roughness)` for their hand-carved ink edge. That filter
   is an inline SVG, not CSS — if it is missing the components still work but lose
   the rough edge. Paste this block once near the top of `<body>`:
   ```html
   <svg style="position:absolute;width:0;height:0" aria-hidden="true"><defs>
     <filter id="woodcut-roughness" x="-20%" y="-20%" width="140%" height="140%">
       <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
       <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
     </filter>
   </defs></svg>
   ```
3. Put content on the dark background: `background: var(--color-velvet)` (or wrap
   in the obsidian `.app-container`).

## The styling idiom

- **Style via these classes**, not ad-hoc CSS. For your own layout glue, use the
  tokens — never hard-code hex or font names.
- **Tokens** (on `:root`): colors `--color-velvet · --color-obsidian ·
  --color-ink · --color-gold · --color-gold-dark · --color-crimson ·
  --color-paper · --color-paper-dark`; fonts `--font-heading-fancy ·
  --font-heading · --font-body`; timing `--transition-slow/medium/fast`.
- **Contrasts**: gold-on-ink and ink-on-gold are primary; crimson is reserved for
  danger / loss / "doomed". Display type is Cinzel Decorative; UI chrome is
  UPPERCASE letter-spaced Cinzel; prose is italic Almendra.

## Component vocabulary (class → what it is)

- **Actions**: `.btn-mystic` (+ `.btn-large`, `disabled`) primary CTA · `.btn-icon`
  round icon button.
- **Forms**: `.lobby-form` + `.input-group` + `input[type=text]` parchment field
  (the `.lobby-form` wrapper is required) · `.archetype-selector` /
  `.radio-label` / `.custom-radio` segmented radio toggle.
- **Cards**: `.tarot-card-3d` (`.flipped`) with `.card-side.front/.back`,
  `.arcana-num`, `.arcana-name`, `.card-illustration`, `.statement-text` ·
  `.card-deck-visual` with `.deck-card-layer` (`.layer-1/2/3`, `.top-card`).
- **Game**: `.player-badge` (`.player-icon`, `.remove-player-btn`) ·
  `.score-item` (`.active-turn`) with `.chalice-icon` (`.lost`) ·
  `.confession-btn` (`.confessed`, `.confession-mark`) · `.ranking-item` with
  `.ranking-title-badge` (`.pure` / `.doomed`).
- **Surfaces & type**: `.intro-box`, `.standings-box`, `.confession-panel`,
  `.game-scoreboard` containers · `.mystic-title` (`.large`), `.mystic-subtitle`,
  `.section-title`, `.active-player-title` headings.

## Where the truth lives

Read `styles.css` and `_ds_bundle.css` (the real compiled CSS — tokens in
`:root`, every class above) before styling, and the per-component
`components/<group>/<Name>/<Name>.prompt.md` for usage and gotchas.

## Idiomatic snippet

```html
<svg style="position:absolute;width:0;height:0" aria-hidden="true"><defs>
  <filter id="woodcut-roughness" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs></svg>

<section style="background:var(--color-obsidian);padding:2rem;border:3px double var(--color-gold)">
  <h2 class="section-title">O Círculo Invocado</h2>
  <ul class="players-list-badge">
    <li class="player-badge"><span class="player-icon">🐕</span> Andressa</li>
  </ul>
  <button class="btn-mystic btn-large">Iniciar a Leitura</button>
</section>
```
