# COMP-304 — Introduction de collection

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Project Collection Intro Builder**.

La page `03.4 — Project Collection Intro` contient le set `Project collection intro` avec six références : `Viewport=Wide|Medium|Compact` × `Locale=FR|EN`.

- Le contenu essentiel présente la collection limitée avec un titre principal et une introduction éditable.
- Le contexte SideQuest réemploie `COMP-202 Compact`, dont le texte validé indique explicitement qu'il s'agit d'un mock fictif et que l'application n'a pas été réalisée.
- Le composant reste statique : aucun filtre, tri, pagination ou action n'est ajouté.
- Wide place l'introduction avant le module de contexte dans une composition horizontale ; Medium et Compact conservent le même ordre dans une composition verticale.

Les textes d'introduction sont des propositions de revue à remplacer ou confirmer avant publication. Le plugin vérifie la correction de hauteur des quatre références Wide de `COMP-303`, puis synchronise son approbation de première passe dans Figma.

**Statut :** les six références ont été générées et revues le 2026-09-26. Medium et Compact sont cohérents. La première référence Wide FR coupait le mot « sélectionnés » à cause de l'échelle `display/hero` ; le plugin a appliqué `display/page` uniquement aux deux titres Wide et réorganisé la planche sans remplacer les contenus. Les nouvelles captures Wide FR/EN confirment des mots complets, une hiérarchie lisible et l'absence de débordement apparent. Costa a validé explicitement `COMP-304` comme base structurelle de première passe le 2026-09-26. Le plugin `project-detail-header-builder` synchronise cette approbation dans Figma à son lancement.
