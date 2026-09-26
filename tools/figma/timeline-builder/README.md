# COMP-210 — Timeline du parcours

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Timeline Builder**.

La page `02.21 — Timeline` contient le set `Timeline` : `Layout=Wide|Compact` × `State=Normal|Incomplete` (4 variantes). La timeline est entièrement déployée et compose des instances de `COMP-211` dans un ordre linéaire annoncé comme allant du plus récent au plus ancien. L'état Normal montre trois emplacements de revue ; Incomplete en montre deux avec leurs champs facultatifs masqués et un message `COMP-003` explicite. Le titre et l'introduction sont éditables. Les références FR/EN servent à vérifier le reflow à 320 px et la localisation.

Tous les événements, périodes et textes de la planche sont des placeholders. Ils ne décrivent pas le parcours réel de Costa et ne doivent pas être publiés. Le nombre final d'entrées, leur ordre et leur contenu attendent des données vérifiées. La timeline ne propose ni accordéon, ni lien automatique, ni alternance gauche-droite ; l'implémentation future sera une liste sémantique dont l'ordre DOM correspond à l'ordre visuel.

Le plugin synchronise l'approbation individuelle de `COMP-211` dans son set et le sommaire Figma. Une relance préserve `COMP-210` et ses instances.

**Statut :** première passe générée, captures revues et `COMP-210` validé explicitement par Costa comme base structurelle le 2026-09-22. L'ordre linéaire, les dispositions à 1120/320 px, l'état incomplet et les exemples anglais sont lisibles sans chevauchement apparent. Cette validation permet de poursuivre les dépendances ; elle ne fige ni le style, ni la composition, ni les variantes finales. Le composant sera rouvert pendant la seconde passe globale.
