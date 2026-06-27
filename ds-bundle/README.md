<!-- This README's top section is the conventions header (.design-sync/conventions.md). -->

# O Tarô de Maluca — Design System

A mystical, candle-lit **woodcut tarot** aesthetic: obsidian grimoire surfaces,
gold-foil accents, aged-parchment cards, crimson for danger/loss. This is a
**CSS class** design system (no React/JS components) — you build with semantic
HTML and the classes documented per component.

## Setup — load order & the woodcut filter (read this first)

1. **Link `styles.css` once.** It `@import`s the Google Fonts (Cinzel Decorative,
   Cinzel, Almendra) and the full component stylesheet (`_ds_bundle.css`).
2. **Include the woodcut SVG filter once per page.** Many components use
   `filter: url(#woodcut-roughness)` — an inline SVG, not CSS. Missing it only
   drops the rough edge, but include it for fidelity:
   ```html
   <svg style="position:absolute;width:0;height:0" aria-hidden="true"><defs>
     <filter id="woodcut-roughness" x="-20%" y="-20%" width="140%" height="140%">
       <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
       <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
     </filter>
   </defs></svg>
   ```
3. Put content on the dark background: `background: var(--color-velvet)`.

## Tokens

Colors `--color-velvet · --color-obsidian · --color-ink · --color-gold ·
--color-gold-dark · --color-crimson · --color-paper · --color-paper-dark`;
fonts `--font-heading-fancy · --font-heading · --font-body`; timing
`--transition-slow/medium/fast`. Reference via `var(--*)` — never hard-code.

## Components

| Group | Component | Class entry point |
|---|---|---|
| Foundations | Colors | `:root` color tokens |
| Foundations | Typography | `:root` font tokens |
| Actions | MysticButton | `.btn-mystic` |
| Actions | IconButton | `.btn-icon` |
| Forms | TextInput | `.lobby-form input[type=text]` |
| Forms | ArchetypeSelector | `.archetype-selector` |
| Cards | TarotCard | `.tarot-card-3d` |
| Cards | CardDeck | `.card-deck-visual` |
| Game | PlayerBadge | `.player-badge` |
| Game | ScoreItem | `.score-item` |
| Game | ConfessionButton | `.confession-btn` |
| Game | RankingItem | `.ranking-item` |
| Surfaces | Panel | `.intro-box` / `.standings-box` |
| Surfaces | Heading | `.mystic-title` / `.section-title` |

Each component folder holds a `<Name>.html` preview card and a `<Name>.prompt.md`
usage doc. Read `styles.css` / `_ds_bundle.css` for the source of truth.

## Layout

```
ds-bundle/
  styles.css              entry — @imports fonts + _ds_bundle.css
  _ds_bundle.css          the real compiled component CSS (tokens + classes)
  assets/                 card art (card-back.png, arcana-*.png)
  tokens/<Name>/          Colors, Typography foundation cards
  components/<group>/<Name>/   preview .html + .prompt.md per component
  gallery.html            all components on one page (human preview)
```

## Preview

Open `gallery.html` in a browser to see every component rendered together.
