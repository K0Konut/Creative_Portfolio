# Creative Portfolio — Foundations Builder

Ce plugin local complète dans Figma les fondations V1 définies par :

- `docs/ui/DESIGN_SYSTEM.md` v0.12.0 ;
- `docs/ui/MOTION_GUIDELINES.md` v0.2.1.

Il ne nécessite ni dépendance, ni compilation, ni accès réseau. Il est prévu pour
le fichier **Creative Portfolio — Design System & Screens V1** et peut être lancé
plusieurs fois : les variables et styles existants sont mis à jour, tandis que les
planches portant le préfixe `_Generated/` sont reconstruites.

## Prérequis

L'import d'un plugin local depuis `manifest.json` exige **Figma Desktop pour
Windows ou macOS**. Le menu Development n'est pas disponible dans Figma ouvert
dans un navigateur. Figma ne fournit pas d'application Desktop officielle pour
Linux ; sur Linux, cette méthode ne peut donc pas être utilisée telle quelle.

## Exécution dans Figma Desktop

1. Ouvrir le fichier Figma cible.
2. Ouvrir le menu Figma en haut à gauche, puis **Plugins → Development → Import
   new plugin from manifest…**. Le même import est parfois accessible par clic
   droit sur le canevas, **Plugins → Development → Import plugin from manifest**.
3. Sélectionner ce fichier `manifest.json`.
4. Lancer **Plugins → Development → Creative Portfolio — Foundations Builder**.
5. Attendre le message `Fondations V1 synchronisées · rayon Action à revoir`.

Si Figma affiche `Erreur du builder`, relever le texte exact du message.

Le plugin crée ou met à jour :

- 8 collections compatibles avec la limite d'un mode du plan Starter ;
- 126 variables primitives et sémantiques, dont `radius/control` à 8 px ;
- 25 styles typographiques responsives ;
- 3 styles d'effet ;
- 4 styles de grille ;
- les pages Cover, Foundations, Components, Screens et Prototype ;
- les planches de documentation nécessaires à la revue humaine des fondations.

La section Color sépare visuellement les 8 teintes de référence, les 6 variantes
fonctionnelles et les 7 teintes de feedback. Cette organisation ne change aucune
valeur du contrat V1.

Les collections `Semantic/Space/Compact` et `Semantic/Space/Large` remplacent les
deux modes d'une collection unique, indisponibles sur le plan Starter. Cette
adaptation conserve les mêmes noms et valeurs de tokens.

## Périmètre

Le plugin s'arrête aux fondations. Le rayon des contrôles reste en revue ; les
composants et les écrans sont conçus et validés séparément.
