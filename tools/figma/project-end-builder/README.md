# COMP-217 — Fin de projet conditionnelle

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Project End Builder**.

La page `02.27 — Project End` contient le set `Project end` avec 12 variantes utiles :

- `Mode=Suggestions` × `Layout=Wide|Compact` × `Locale=FR|EN` × `State=Default` ;
- `Mode=Contact` × `Layout=Wide|Compact` × `Locale=FR|EN` × `State=Default|Partial`.

`Suggestions` compose une instance de `COMP-201 Aperçu de projet`. SideQuest y sert uniquement de référence structurelle sur la planche de revue : cette variante ne doit pas être publiée à la fin de SideQuest tant qu'aucun autre projet réel n'existe.

`Contact` compose `COMP-215 Groupe de contacts` dans son contexte `ProjectEnd`. L'état `Partial` retire LinkedIn lorsqu'aucune URL vérifiée n'est disponible et conserve l'email visible. Les retours Success/Error de copie restent gérés à l'intérieur de `COMP-215` et `COMP-216`, sans multiplier les états du parent.

Le plugin synchronise dans Figma l'approbation de première passe de `COMP-215`. Il ne corrige pas encore les réserves conservées pour la seconde passe globale. La disposition de la planche calcule la hauteur réelle de chaque ligne afin d'éviter un chevauchement entre variantes.

**Statut :** Costa a validé explicitement `COMP-217` comme base structurelle de première passe le 2026-09-23 après revue par captures de ses 12 variantes. Aucun chevauchement ou débordement n'est apparent ; les modes, langues, dispositions et l'état Contact Partial restent lisibles. Le double niveau de titre du mode Contact, le retour à la ligne anglais de « Copy the address », la référence SideQuest strictement structurelle et l'équilibre email/LinkedIn restent ouverts pour la seconde passe globale. Le prochain plugin synchronisera cette approbation dans Figma.
