# PLAN.md — O Tarô de Maluca browser game pass

## Goal
Turn the existing Vite SPA into a cleaner browser-game build pass by stabilizing the modal surfaces, adding a compact live ritual status HUD, preserving the mobile-first tarot table aesthetic, and verifying the result with Playwright.

## Architecture
Static Vite app with code-native UI and local browser state:

- `index.html` owns semantic game screens, dialogs, and static document metadata.
- `style.css` owns the tarot/woodcut visual system and responsive layout.
- `app.js` owns game state, turn flow, card draw, confession handling, modal actions, and UI rendering.
- `assets/` owns browser-loadable visual assets.
- `artifacts/concept-gameplay-screen-2026-06-27.png` is a design reference generated with Image Gen, not a runtime UI screenshot.
- `.logs/work-2026-06-27.md` records execution decisions, commands, and evidence.

## Tech Stack
Vite 6, plain JavaScript modules, HTML dialog elements, CSS custom properties, CSS animation, Web Audio API, Playwright browser automation.

## Baseline / Authority Refs
- User request: “Use $playwright-interactive, $imagegen, and $openai-docs to plan and build a browser game in this repo. Implement PLAN.md, and log your work under `.logs/`.”
- Existing implementation plan: `artifacts/implementation_plan.md`.
- Existing walkthrough: `artifacts/walkthrough.md`.
- Image Gen concept: `artifacts/concept-gameplay-screen-2026-06-27.png`.
- OpenAI docs check: official Image Generation guide confirms `gpt-image-2` does not currently support transparent backgrounds, so this pass avoids native-transparent generated assets.
- Baseline command already run: `npm install`, then `npm run build`.

## Compatibility Boundary
- Preserve the existing game name, modes, card database, default players, themes, generated tarot assets, custom-card forge, grimorio history, sound controls, and Vite static deployment model.
- Keep UI text and controls code-native.
- Do not add an API dependency or require `OPENAI_API_KEY`.
- Do not replace existing card art with the concept image.
- Keep persistent state limited to the existing `tarot_custom_cards` localStorage key.

## Verification
Run these commands and checks after implementation:

1. `npm run build`
2. Start local server with `npm run dev -- --host 127.0.0.1 --port 5173`
3. Use Playwright to:
   - load `http://127.0.0.1:5173/`
   - open the Grimório and confirm it is visible
   - open and close the Forjar Arcano dialog
   - start the game, draw a card, submit a confession, and confirm the ritual status HUD updates
   - capture desktop and mobile screenshots
4. Inspect the generated concept and latest browser screenshot with `view_image`.

## Tasks

### Task 1 — Stabilize document metadata and dialogs
Files:
- `index.html`
- `assets/favicon.svg`

Steps:
- Add a lightweight SVG favicon link so the browser no longer requests missing `/favicon.ico`.
- Close `#custom-card-dialog` before declaring `#grimoire-dialog`, making both dialogs direct body children.
- Verify through Playwright that `#grimoire-dialog` has `BODY` as parent, opens with non-zero dimensions, and closes cleanly.

### Task 2 — Add a compact ritual status HUD
Files:
- `index.html`
- `style.css`
- `app.js`

Steps:
- Add a `#ritual-status-bar` and `#last-omen-strip` to the gameplay screen, near the active player announcement and outside the central deck area.
- Add state fields for total cards in session, revealed card count, and last omen text.
- Render mode, revealed count, remaining deck count, and last omen after setup, draw, confession submit, and turn preparation.
- Keep the HUD compact so it does not cover the deck or confession controls on mobile.

### Task 3 — Add keyboard-friendly draw support
Files:
- `app.js`
- `style.css`

Steps:
- Allow `Enter` or `Space` to draw a card only when the gameplay screen is active, no dialog is open, and focus is not inside a text field.
- Add a visible focus style for the deck button.
- Keep pointer/touch draw behavior unchanged.

### Task 4 — Log and verify
Files:
- `.logs/work-2026-06-27.md`

Steps:
- Record the generated concept path, OpenAI docs decision, build commands, Playwright checks, screenshots, and residual risk.
- Run the verification commands listed above.
- Capture final screenshots under `artifacts/`.
