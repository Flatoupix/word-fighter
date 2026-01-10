# Word Fighter

[![Deploy to GitHub Pages](https://github.com/Flatoupix/word-fighter/actions/workflows/deploy.yml/badge.svg)](https://github.com/Flatoupix/word-fighter/actions/workflows/deploy.yml)

#### Le jeu consiste à entrer une série de mots en marquant le plus de points possible.

## Jeu actuel

---

- Un mot est généré de base dans le but de commencer la partie
- Le mot est testé, un retour est fait si il est validé
- En fonction du nombre de lettres entrées, un calcul de points est fait, comme au scrabble
- Si c'est un palindrome, un bonus est ajouté
- Si le mot est exactement plus petit ou plus grand d'une lettre, il est active le super shrink
- Si la première lettre du mot actuel est consécutive à la première lettre du dernier mot, le bonus Super Suite est activé.

---

## Règles et score (référence)

---

### Déroulé d'une partie

- L'ordinateur démarre avec un mot aléatoire (mock local).
- Le joueur saisit un mot; il est validé via une règle locale (mock).
- Si le mot est valide, il s'affiche dans la liste et se "tape" en lettres animées.
- Le score est ajouté au joueur ou à l'ordinateur selon le tour.
- Pas de condition de fin dans l'état actuel (partie continue).

### Calcul du score

- Points par lettre selon `src/assets/scrabble.json` (distribution/valeurs anglaises).
- Bonus palindrome: +10 si le mot est identique à son inverse.
- Bonus Super Suite: si la première lettre est adjacente à celle du mot précédent.
- Bonus Super Shrink: si la longueur diffère de ±1 par rapport au mot précédent.
- Bonus écart initial: distance alphabétique entre premières lettres (comportement actuel).

### À clarifier pour 2026

- Règles exactes de fin de partie (tours, timer, score cible).
- Dictionnaire de référence et gestion des accents/variantes.
- Définition précise des bonus (seuils, empilement, application du 1er bonus).
- Cohérence des points Scrabble (FR vs EN).
- Sécurité/format des descriptions de mots (HTML).

---

## Backlog produit 2026

---

### P0 - Coeur de jeu

- Spécifier les règles/score et écrire des tests de calcul.
- Stabiliser la validation des mots (cache, fallback local, gestion des erreurs).
- Définir un mode de partie (durée ou manches) + écran de fin.
- Clarifier et expliquer les bonus dans l'UI.
- Sauvegarde locale des scores (profil, historique).

### P1 - Expérience

- Multi-joueurs local (hotseat) puis en ligne.
- Contre-mot: possibilité d'annuler/contrer un mot adverse.
- Bonus temps de saisie + pénalités fautes de frappe.
- Bande-son + contrôle du volume/effets.
- Accessibilité (contrastes, taille de police, clavier).

### P2 - Long terme

- Classements et défis quotidiens.
- Dictionnaires alternatifs (thèmes, langues).
- Mode entraînement + statistiques avancées.
- Customisation visuelle (thèmes, skins).

---

## Dev (Vite + Tailwind)

---

- `yarn install`
- `yarn dev`
- `yarn build`
- `yarn preview`

---

## Changelog

@ 0.0.2

- Ajout d'un shake quand un mot n'est pas bon
- Ajout de couleurs et d'effets de bonus
- Ajout de sons
- Ajout d'un theme synthWave

@ 0.0.1

- first init
