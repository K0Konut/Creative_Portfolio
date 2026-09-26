# COMP-216 — Contact email

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Email Contact Builder**.

La page `02.25 — Email Contact` contient le set `Email contact` : `Layout=Wide|Compact` × `State=Normal|Copying|Success|Error` (8 variantes). Chaque variante garde l'adresse visible et sélectionnable, compose un lien `COMP-002 Email` et une commande `COMP-002 Copy`. Les états Success et Error ajoutent un retour `COMP-003` sans déplacer le focus. Le titre, le contexte et l'adresse sont éditables ; les références FR/EN vérifient la localisation et le reflow à 320 px.

L'adresse `email-public@a-confirmer.example` est un placeholder réservé à la revue. Elle ne doit jamais être publiée ou utilisée comme destination. L'adresse publique finale reste à fournir et à vérifier. Le composant ne simule aucun envoi, ne contient aucun formulaire et ne stocke aucune donnée.

Le plugin synchronise l'approbation de première passe de `COMP-214` dans son set et le sommaire Figma. Une relance préserve `COMP-216` et ses instances.

**Statut :** base structurelle de première passe validée explicitement par Costa le 2026-09-22. La capture montre les quatre états FR en 900 et 320 px : l'adresse reste visible, les actions refluées restent accessibles et les retours Success/Error conservent la solution de copie manuelle. Le libellé « Copie en cours… » revient sur deux lignes et sera réévalué pendant la seconde passe. Les références anglaises générées ne figurent pas dans la capture reçue et restent à contrôler. Cette validation ne fige pas le composant, qui sera rouvert pendant la seconde passe globale.
