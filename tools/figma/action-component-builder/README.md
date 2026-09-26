# Creative Portfolio — Action Builder

Ce plugin local crée une première version du composant Figma `COMP-001 · Action`
dans le fichier **Creative Portfolio — Design System & Screens V1**. Il exige les
fondations créées par `../design-system-builder/` et validées par Costa le
2026-09-21.

## Installation et exécution

1. Ouvrir le fichier cible dans Figma Desktop (Windows ou macOS).
2. Relancer **Creative Portfolio — Foundations Builder** pour créer `radius/control` à 8 px. Cette relance régénère uniquement les planches gérées par ce plugin et conserve la page du composant Action.
3. Relancer **Creative Portfolio — Action Builder**, déjà importé. Attendre `Action actualisée · focus bicolore visible`.

Le plugin vérifie d'abord les variables et le style typographique nécessaires.
Il crée, s'il manque, la page `02.1 — Action` et un component set `Action` de
20 variantes (`Style` × `State`). Si le set existe déjà, il applique le nouveau
rayon aux 20 variantes sans créer de doublon. Un panneau crème est ajouté derrière
la grille pour rendre lisibles les actions textuelles et le focus, indépendamment
de la couleur du canevas Figma.
Le focus utilise deux contours explicites de 2 px : crème au contact du contrôle,
puis sombre à l'extérieur. Le contour externe suit la largeur de son libellé.

Les 20 variantes et le rayon de 8 px ont été validés par Costa le 2026-09-21.
Le contrôle compact n'est pas créé sans besoin
confirmé. La future option d'icône sera reliée à un composant d'icône réutilisable
dans une itération dédiée ; aucune flèche décorative n'est codée en dur ici.
La variante textuelle est transparente et prévue sur une surface claire.

Ce plugin n'implémente aucun bouton HTML et ne change pas le projet applicatif.
