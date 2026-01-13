# Changelog

## 0.3.8

- Enforce Grammar War tag validation for all inputs.

## 0.3.7

- Deduct 1 second from the timer on each fail.

## 0.3.6

- Reset prefix-repeat rule after a fail.

## 0.3.5

- Apply +0 only for repeated prefix letters (with minus sound per letter).

## 0.3.4

- Add prefix-repeat rule: repeated starting letters score +0 and play minus sound.

## 0.3.3

- Switch fail sound asset to MP3.

## 0.3.2

- Play fail sound on invalid word.

## 0.3.1

- Added Solo mode (single player with one seeded word).

## 0.3.0

- Added Grammar War flow with game type selection and grammatical tag selection.
- Added tag-aware validation and weighted word picks by grammatical category.
- Added player name entry as a two-step flow (Player 1 then Player 2).
- Added back navigation to all selection screens.
- Component reorg into screens vs game components.
- Mobile layout tweaks (stacking, spacing, type sizes, input focus).
- Word list auto-scroll and visual fade improvements.

## 0.2.3

- Added mode and duration selection screens.
- Added results screen (winner + score).
- Added match timer + Start button.
- Added speed bonus (typing stopwatch).
- Player vs Player mode (no AI, Player 1/2 labels).
- Two-step player name entry (Player 1 then Player 2).
- Frequency dictionary + accent-aware validation; invalid word listed as FAIL.
- UI: reorganized panels, scrollable word list with top/bottom fade, per-player colors.

## 0.2.2

- Added GitHub Pages workflow and environment configuration for deployment.
- Added deploy badge in README.

## 0.2.1

- UI refactor into Vue components + composables (game state and dictionary).

## 0.2.0

- Migration to Vue 3 + Vite + Tailwind.
- Layout and styles refresh.

## 0.0.2

- Added shake on invalid word.
- Added bonus colors and effects.
- Added sounds.
- Added synthwave theme.

## 0.0.1

- first init
