# MysticButton

Primary call-to-action. Gold-foil fill on charcoal ink, uppercase Cinzel, hard
offset shadow and a hand-carved woodcut edge (`filter: url(#woodcut-roughness)`).

## Class API
- `.btn-mystic` — base button. Apply to a `<button>`.
- `.btn-large` — full-width, taller, larger type. For lead actions / form submit.
- `disabled` attr **or** `.disabled` class — dimmed, no shadow, not interactive.

Hover (when not disabled) inverts to ink fill + gold text with a gold glow;
`:active` nudges scale down.

## Usage
```html
<button class="btn-mystic">Invocar no Círculo</button>
<button class="btn-mystic btn-large">Iniciar a Leitura</button>
<button class="btn-mystic" disabled>Aguardando…</button>
```

## Requires
The `#woodcut-roughness` SVG filter must exist once in the page DOM (see the
README "Conventions" section). Without it the button still works but loses its
rough ink edge.
