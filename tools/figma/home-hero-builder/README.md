# COMP-301 — Hero d'accueil

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Home Hero Builder**.

La page `03.1 — Home Hero` contient le set `Home hero` avec 12 références : `Viewport=Wide|Medium|Compact` × `Locale=FR|EN` × `Decoration=Editorial|None`.

- `Wide` utilise la référence 1440 px et une composition asymétrique inspirée de la direction validée « Studio graphique modulaire ».
- `Medium` utilise 768 px avec une structure 5+3 lorsque la décoration est présente.
- `Compact` utilise 375 px et conserve l'ordre nom, positionnement, proposition de valeur, action principale, action secondaire, puis décoration facultative.
- `Editorial` ajoute un module violet et une note rose strictement décoratifs ; `None` les retire sans modifier le contenu ni les actions.

La hero compose `COMP-001 Action` en `Primary` vers la collection Projets et en `Text` vers À propos. Les instances n'ont volontairement aucune URL ou interaction de prototype : leurs destinations sont documentées mais devront être reliées dans les écrans. Le CTA principal ne mène jamais directement à SideQuest.

Le nom et les titres professionnels sont validés. La proposition de valeur « Des expériences web singulières » et sa traduction servent de contenu de revue éditable ; elles restent à confirmer avant publication. Les éléments décoratifs sont destinés à être ignorés par les technologies d'assistance et ne contiennent aucune information indispensable.

Le plugin synchronise dans Figma l'approbation de première passe de `COMP-217`. Il ne corrige pas les réserves conservées pour la seconde passe globale.

**Statut :** générateur exécuté et 12 références revues par captures. Costa a validé `COMP-301` comme base structurelle de première passe le 2026-09-26. La proposition de valeur reste à confirmer avant publication ; le retour de `FULL-STACK` à 320 px et avec texte agrandi, l'équilibre des références Wide sans décoration, ainsi que les contrôles clavier, focus, zoom et ordre accessible réel restent à vérifier dans les écrans ou pendant la seconde passe globale.
