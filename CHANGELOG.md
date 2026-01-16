# Changelog

## 0.5.11

- Highlight the top online score and rank other players in the list.

## 0.5.10

- Keep online players in-game after host starts (avoid returning to selection screens).

## 0.5.9

- Move App.vue UI text into a JSON source for reuse.

## 0.5.8

- Use a more readable font for the rules/changelog overlay text.

## 0.5.7

- Make header buttons more readable and reject already-used words as fails.

## 0.5.6

- Make the in-app rules overlay more concise (base flow + bonuses).

## 0.5.5

- Expand the in-app rules overlay with full French gameplay description.

## 0.5.4

- Ensure changelog and rules overlays scroll within the modal.

## 0.5.3

- Add overlay modals for changelog and detailed rules content.

## 0.5.2

- Add header buttons linking to the changelog and detailed rules.

## 0.5.1

- Add create-online game type selection before the online lobby.
- Document the menu flow tree in README.

## 0.5.0

- Split entry flow into "Join" and "Create", with create branching to online or local.

## 0.4.9

- Sync online words and scores via Supabase room state.
- Highlight active online player with per-player scores in list.

## 0.4.8

- Add online player list panel with active turn highlight and ordering.
- Sync online turn index via Supabase room settings.

## 0.4.7

- Add a first-step entry screen to join a room immediately.
- Remove online mode from later mode selection screens.

## 0.4.6

- Add PNG favicon generated from `public/image.png`.

## 0.4.5

- Update AGENT.md to include `git add .` before commits.

## 0.4.4

- Add AGENT.md notes for future project conventions.

## 0.4.3

- Fix online lobby slots by keeping unique player ids per room/session.

## 0.4.2

- Require a player name before joining an online room.
- Add polling fallback to keep online lobby state in sync.
- Restore host privileges on refresh and sync duration changes.
- Fix back navigation for online mode.

## 0.4.1

- Add online lobby prototype (Supabase rooms/players + join by link).

## 0.4.0

- Add Kamoulox game type with combo-based bonuses (tags, length, lemma).
- Add frequency-based bonus (freqForm with lemma fallback).

## 0.3.9

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
