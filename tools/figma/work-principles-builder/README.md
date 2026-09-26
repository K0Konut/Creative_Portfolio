# COMP-212 — Liste de principes de travail

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Work Principles Builder**.

La page `02.23 — Work Principles` contient le set `Work principles` : `Layout=Wide|Compact` × `State=Normal|Incomplete` (4 variantes). La disposition large organise quatre instances `COMP-213` en deux colonnes ; la disposition compacte conserve le même ordre dans une seule colonne. L'état Incomplete montre deux emplacements et un message `COMP-003` explicite. Le titre et l'introduction sont éditables. Les références FR/EN servent à vérifier la localisation et la lecture linéaire à 320 px.

Les quatre principes et leurs formulations sont des exemples de densité. Ils ne décrivent pas encore la manière de travailler réelle de Costa, ne constituent ni promesse ni témoignage et ne doivent pas être publiés. Leur nombre, leur ordre et leur contenu final restent à définir avec des faits vérifiables. La future implémentation utilisera une structure de liste lorsque l'organisation éditoriale le justifie et conservera le même ordre dans le DOM et visuellement.

Le plugin synchronise l'approbation de première passe de `COMP-213` dans son set et le sommaire Figma. Une relance préserve `COMP-212` et ses instances.

**Statut :** première passe générée, captures françaises revues et `COMP-212` validé explicitement par Costa comme base structurelle le 2026-09-22. Les dispositions large/compacte et les états Normal/Incomplete restent lisibles sans chevauchement apparent. Les références anglaises générées ne sont pas visibles dans les captures reçues et restent à contrôler. Cette validation ne fige pas le composant, qui restera ouvert à la seconde passe globale.
