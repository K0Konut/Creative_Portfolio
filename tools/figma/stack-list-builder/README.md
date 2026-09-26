# COMP-209 — Liste de stacks

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Stack List Builder**.

La page `02.19 — Stack List` contient le set `Stack list` : `Context=Project|Profile` × `Layout=Wide|Compact` × `State=Normal|Empty` (8 variantes). Le contexte Project compose un groupe de trois `COMP-207 Detail` de revue ; Profile en compose deux groupes de deux. Les nombres, noms, groupes et contextes sont des exemples de densité, à remplacer par des faits vérifiés. Les titres, introductions et noms de groupe sont éditables ; les noms et contextes des éléments le sont via leurs instances `COMP-207`. La planche inclut des exemples FR/EN et vérifie le reflow à 320 px.

En V1, SideQuest n'est qu'un concept : ne pas présenter les placeholders comme des technologies réellement utilisées. Si aucune donnée publiable n'existe, employer l'état Empty composé avec `COMP-003 Message d'état`, ou omettre la section au niveau de l'écran selon son utilité. Aucun niveau de maîtrise, filtre, tri, chargement bloquant ou interaction n'est ajouté. L'implémentation future emploiera des groupes titrés et des listes sémantiques, dans le même ordre que la planche.

Le plugin synchronise l'approbation individuelle de `COMP-208` dans son set et le sommaire Figma. Une relance préserve `COMP-209` et ses instances.

**Statut :** première passe générée, captures revues et `COMP-209` validé explicitement par Costa le 2026-09-22. Les groupes, les dispositions à 1120/320 px, les états vides FR et les exemples anglais normaux sont lisibles sans chevauchement apparent. Le composant reste inclus dans la seconde passe globale.
