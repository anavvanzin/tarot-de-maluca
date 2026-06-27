# Headings & Titles

The typographic display system. Decorative Cinzel for display titles, Cinzel for
labels/section heads, with gold accents and ink/gold glows.

## Class API
- `.app-header` — header block with a gold bottom rule and a decorative ornament.
  - `.mystic-title` — primary display title (Cinzel Decorative, paper, ink +
    gold glow).
  - `.mystic-subtitle` — uppercase gold tagline under the title.
- `.turn-announcement` — centered turn callout:
  - `.turn-subtitle` — small uppercase gold lead-in.
  - `.active-player-title` — large Cinzel Decorative name.
- `.section-title` — uppercase gold block heading with underline (use inside
  surfaces / lists).

## Usage
```html
<header class="app-header">
  <h1 class="mystic-title">O Tarô de Maluca</h1>
  <p class="mystic-subtitle">Revele seus pecados e sele seu destino</p>
</header>

<h3 class="section-title">O Círculo Invocado</h3>
```
