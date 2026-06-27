# Typography

Three serif faces (loaded from Google Fonts via `styles.css`), exposed as tokens:

| Token | Family | Use |
|---|---|---|
| `--font-heading-fancy` | `'Cinzel Decorative'` | Display titles (`.mystic-title`, `.active-player-title`, `.arcana-name`) |
| `--font-heading` | `'Cinzel'` | Labels, buttons, section titles, captions — usually UPPERCASE with wide `letter-spacing` |
| `--font-body` | `'Almendra'` | Running text, confessions — often `italic` |

Idiom: display in Cinzel Decorative; UI chrome in uppercase letter-spaced Cinzel;
prose in italic Almendra. Reference via `font-family: var(--font-*)`.

## Transition tokens
`--transition-slow` (0.8s, card flips), `--transition-medium` (0.4s, deck
movement), `--transition-fast` (0.2s, hovers).
