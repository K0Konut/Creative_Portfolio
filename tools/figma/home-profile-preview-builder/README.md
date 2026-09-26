# COMP-303 — Aperçu du profil

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Home Profile Preview Builder**.

La page `03.3 — Home Profile Preview` contient le set `Home profile preview` avec 12 références : `Viewport=Wide|Medium|Compact` × `Locale=FR|EN` × `State=Normal|Incomplete`.

- `Normal` présente la structure de l'aperçu avec des textes de revue explicitement non publiables, puis une instance `COMP-001 Secondary` vers À propos.
- `Incomplete` conserve la destination À propos et ajoute `COMP-003 Info` pour signaler que la biographie, le positionnement et le résumé de méthode restent à fournir.
- `Wide` place le contenu avant le module éditorial dans une composition horizontale.
- `Medium` et `Compact` placent le contenu et l'action avant toute décoration dans une composition verticale.

Le module violet est décoratif et peut être retiré sans perte d'information. Il reprend uniquement les catégories attendues — profil, parcours et méthode — sans inventer d'expérience, de compétence ou de manière de travailler. Les textes essentiels sont éditables et devront être remplacés par la biographie bilingue validée avant publication.

Le plugin synchronise dans Figma l'approbation de première passe de `COMP-302 Sélection de projet d'accueil`. Il vérifie aussi que les six états `Unavailable` utilisent le libellé corrigé « destination indisponible » / « destination unavailable » avant d'inscrire cette approbation.

**Statut :** les 12 références ont été générées et revues le 2026-09-26. La première revue a révélé une hauteur fixe de 1000 px sur les quatre références Wide ; le plugin a corrigé uniquement leur dimensionnement vertical et réorganisé la planche sans remplacer les contenus existants. Les nouvelles captures Wide FR/EN × Normal/Incomplete confirment la correction, et Costa a validé explicitement `COMP-303` comme base structurelle de première passe le 2026-09-26. Le plugin `project-collection-intro-builder` synchronise cette approbation dans Figma à son lancement.
