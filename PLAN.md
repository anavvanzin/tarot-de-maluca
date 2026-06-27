# PLAN.md — O Tarô de Maluca browser game

## Goal

Finish the Vite browser game as a mobile-first Sueca/iPuke-style party game: a table draws tarot cards, resolves confessions, dares, votes, targets, group drinks, and rules, while the UI uses the generated player portraits instead of emoji identities.

The current game direction is **Sueca de Maluca**, not survival elimination.

## Current Design Direction

- The first screen is the playable lobby, not a landing page.
- Default players use real illustrated portraits:
  - Lobby and card surfaces use `assets/{player}-classic.png`.
  - Selected/active player states use `assets/{player}-cosmic.png`.
  - `gold` remains available as a theme/style asset, but is not the default player-state language.
- Guest players use a typographic initial fallback.
- Structural emoji are avoided in game UI; symbolic controls use text glyphs such as `✦`, `✺`, `☾`, `◇`, and `†`.
- UI controls keep stable touch targets and avoid layout shifts on mobile.

## Architecture

Static Vite app with code-native UI and local browser state:

- `index.html` owns semantic game screens, dialogs, manual content, and static document metadata.
- `style.css` owns the tarot/woodcut visual system, responsive layout, modal layout, avatar sizing, and mobile reveal positioning.
- `app.js` owns game state, turn flow, deck construction, temperament effects, card resolution, dialog actions, sound, and UI rendering.
- `assets/` owns browser-loadable runtime assets.
- `public/assets/` mirrors runtime assets for Vite static serving.
- `tarot_medias/illustrations/` keeps the source illustration set provided by Ana.
- `artifacts/` keeps generated concepts, screenshots, recordings, and verification evidence.
- `.logs/work-2026-06-27.md` records execution decisions, commands, and evidence.

## Runtime Mechanics

### Core Loop

1. Lobby starts with Sabrina, Shai, Andressa, Patricia, and Ana.
2. Player can add named players or choose `Outra pessoa no role`.
3. Each added player receives the currently selected temperament.
4. Start game, draw a card, resolve it, then pass to the next player.
5. Game ends when the deck runs out.

### Card Kinds

- `confession`: mark who has done the statement; marked players drink and gain points.
- `dare`: active player chooses to fulfill, drink, or do both.
- `target`: active player chooses who drinks.
- `group`: the whole table resolves a shared drink.
- `rule`: active player creates a temporary table rule and gains points.
- `vote`: table votes who drinks.

### Temperaments

- `Labrador`: reduces every card-driven drink by 1 gole, minimum 0.
- `Gato Preto`: gains +1 extra point whenever drinking because of a card.

These effects are applied centrally through `applyDrink()` so the resolver UI, scoreboard, history, and actual score state match.

## UI Requirements Implemented

- Player identity uses portraits, not emoji.
- Lobby portraits are larger than the earlier low-resolution badge layout.
- Temperament selector sits below the invoked-player circle.
- Temperament effects are visible in the selector, lobby badges, and card resolver buttons.
- Grimorio contains a compact manual explaining the rules, scoring, and temperaments.
- Gameplay and reveal screens hide the large header so the card does not render too low on mobile.
- Reveal card and resolver fit within a `393x852` mobile viewport in the verified path.
- Custom-card forge uses typographic symbols instead of emoji options.

## Verification Checklist

Run before calling the game finished:

1. `npm run build`
2. Start or reuse local server:
   - `npm run dev -- --host 127.0.0.1 --port 5173`
3. Playwright mobile viewport `393x852`:
   - load `http://127.0.0.1:5173/`
   - confirm lobby avatars are image assets and at least `62x62`
   - confirm lobby uses `assets/*-classic.png`
   - confirm temperament panel is visible below the player circle
   - click `Outra pessoa no role` and confirm guest initial fallback
   - open Grimorio and confirm `Manual rapido` is visible and centered
   - open Forjar Arcano and confirm symbols are typographic glyphs
   - start game, draw a card, and confirm:
     - header is hidden on gameplay/reveal
     - reveal card starts near the top of the viewport
     - resolver remains inside the viewport
     - scoreboard starts at `0 goles`
     - Labrador can show `+0` on a 1-gole card
     - selected player avatar switches from `classic` to `cosmic`
4. Confirm no emoji-range glyphs remain in `index.html`, `app.js`, or `style.css`.
5. Capture final screenshot evidence under `artifacts/`.

## Evidence

- Build: `npm run build` passed on 2026-06-27 after the final UI cleanup.
- Final screenshot: `artifacts/tarot-final-mobile-2026-06-27.png`.
- Previous temperament/manual screenshot: `artifacts/tarot-temperamento-manual-mobile-2026-06-27.png`.
- Earlier screenshot: `artifacts/tarot-reveal-layout-assets-2026-06-27.png`.
- Work log: `.logs/work-2026-06-27.md`.
- Context checkpoint: `/Users/ana/.gstack/projects/anavvanzin-tarot-de-maluca/checkpoints/20260627-115625-tarot-ui-temperamento-manual.md`.
