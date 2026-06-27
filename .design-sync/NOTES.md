# Design Sync — Notes

## Repo shape
- This repo is a finished static web app (`index.html`, `style.css`, `app.js`,
  `assets/`), **not** a component library. There is no `package.json`, build,
  `dist/`, or Storybook, so the design-sync converter (`package-build.mjs`) does
  not apply. The bundle in `ds-bundle/` was authored by hand (off-script).
- It is a **CSS class** design system: "components" are semantic HTML styled by
  classes in `style.css`. No React/JS/TypeScript, so there are no `.d.ts` files —
  each component's API is documented as classes in its `.prompt.md`.

## Bundle
- Source of truth CSS lives in one file: `style.css` (repo root), copied to
  `ds-bundle/_ds_bundle.css`. `ds-bundle/styles.css` is the entry that `@import`s
  Google Fonts + `_ds_bundle.css`.
- Fonts are loaded from Google Fonts (publicly hosted) via `@import` in
  `styles.css`, matching the original app's `<link>`.
- Card art (`assets/*.png`) is copied into `ds-bundle/assets/`.

## Gotcha — woodcut SVG filter
- Many components reference `filter: url(#woodcut-roughness)`, an **inline SVG
  filter** defined in `index.html` (not in CSS). Each preview card embeds the
  filter defs, and the conventions header instructs the design agent to include
  the defs block once per page. Without it, components render but lose the rough
  ink edge.

## Upload status (IMPORTANT)
- The `DesignSync` tool could **not** authenticate in this headless
  claude.ai/code session (login requires an interactive terminal). The bundle was
  built and committed but **not uploaded**, and no Claude Design project was
  created. `config.json` has no `projectId` yet.
- To finish the import: either (a) re-run `/design-sync` in an interactive
  terminal so `/design-login` works, or (b) use Claude Design's
  "Send to Claude Code Web" to seed a project, or (c) upload `ds-bundle/`
  manually. Record the resulting `projectId` in `.design-sync/config.json`.
