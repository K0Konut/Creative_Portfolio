# COMP-215 — Groupe de contacts

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Contact Group Builder**.

La page `02.26 — Contact Group` contient le set `Contact group` : `Context=About|ProjectEnd` × `Layout=Wide|Compact` × `State=Normal|Partial|Success|Error` (16 variantes).

- `About` compose `COMP-216 Contact email`, LinkedIn et GitHub. GitHub reste secondaire et sert à approfondir l'évaluation technique.
- `ProjectEnd` compose `COMP-216 Contact email` et LinkedIn, de priorité éditoriale équivalente pour poursuivre l'échange.
- `Partial` retire la destination externe non vérifiée au lieu d'afficher un lien cassé, puis réutilise `COMP-003 Unavailable` pour expliquer l'absence.
- `Success` et `Error` reprennent les retours de copie de `COMP-216` sans déplacer le focus.

Les libellés LinkedIn et GitHub sont des références de composition, pas des liens actifs. L'email `.example` inclus dans `COMP-216` et toutes les destinations externes doivent être remplacés uniquement après fourniture et vérification des coordonnées réelles. Aucun formulaire, aucune saisie et aucun stockage ne sont ajoutés.

Le plugin synchronise l'approbation de première passe de `COMP-216` dans son set et le sommaire Figma. Une relance préserve `COMP-215` et ses instances ; elle répare aussi le positionnement des références anglaises et des notes de la planche sans toucher au set.

**Statut :** Costa a validé explicitement `COMP-215` comme base structurelle de première passe le 2026-09-23 à partir des captures de ses 16 variantes. Cette validation permet de poursuivre avec `COMP-217`, sans figer la composition finale. Le chevauchement entre les lignes Success et Error de la grille `About · Compact`, dû à l'espacement vertical fixe de la planche de revue, ainsi que l'équilibre visuel entre email et LinkedIn dans `ProjectEnd`, restent à reprendre pendant la seconde passe globale. Le prochain plugin synchronisera cette approbation dans Figma.
