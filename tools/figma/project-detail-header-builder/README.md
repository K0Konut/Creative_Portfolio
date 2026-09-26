# COMP-305 — En-tête de détail projet

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Project Detail Header Builder**.

La page `03.5 — Project Detail Header` contient le set `Project detail header` avec 24 références : `Viewport=Wide|Medium|Compact` × `Locale=FR|EN` × `Project=Mock|Real` × `State=Normal|TranslationUnavailable`.

- Toutes les références composent `COMP-001 Text` comme retour explicite vers la collection avant le titre principal.
- `Mock` utilise le nom SideQuest et place `COMP-202` avant tout futur carrousel : format explicatif en Wide, format compact en Medium/Compact.
- `Real` emploie un nom de projet explicitement provisoire et n'affiche aucun statut fictif.
- `TranslationUnavailable` ajoute `COMP-003 Unavailable` localisé sans mélanger silencieusement les langues.

La composition reste volontairement compacte afin que le carrousel demeure le premier grand bloc visuel de la page. Elle ne contient ni métadonnée détaillée, rôle, ressource externe, démo ou dépôt fictif.

Le plugin vérifie l'échelle corrigée des deux titres Wide de `COMP-304`, puis synchronise son approbation de première passe dans Figma. **Statut :** générateur prêt à importer et exécuter ; les 24 références restent à revoir par captures avant toute validation de `COMP-305`.
