# COMP-204 — Collection de projets

Plugin local pour générer la première planche du composant `COMP-204` dans Figma Desktop. Importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Project Collection Builder**. Le plugin exige les sets validés `COMP-201 Project preview` et `COMP-003 Status message` ; il crée la page `02.14 — Project Collection` sans modifier leurs variantes.

La planche présente 12 variantes : `Wide` ou `Compact` × FR ou EN × `One`, `Empty` ou `MediaUnavailable`. `One` montre uniquement SideQuest avec une instance de l'aperçu `Collection`. `Empty` reprend `COMP-003` avec un message adapté à une collection sans projet ; les sorties vers À propos et le contact seront de vrais liens composés dans l'écran. `MediaUnavailable` conserve l'aperçu et son accès au détail avec le repli du média. Aucune deuxième carte, case vide, filtre, tri ou pagination n'est ajouté.

La composition large est une référence de 1120 px ; la compacte est une référence de 375 px. Les contrôles à 320 px, au zoom 200 %, la navigation clavier et les destinations exactes devront être effectués dans les écrans. La collection future multi-projets reste hors V1.

Lors du lancement, le plugin inscrit aussi la validation explicite de `COMP-201` du 2026-09-22 dans la description de ses sets et dans le sommaire Figma.

**Statut :** 12 variantes générées et validées explicitement par Costa le 2026-09-22. Les destinations réelles de l'état vide et le reflow en contexte restent à vérifier dans les écrans.
