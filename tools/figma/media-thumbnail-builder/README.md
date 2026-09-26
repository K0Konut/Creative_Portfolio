# COMP-206 — Miniature de média

Plugin local pour générer les références de `COMP-206` dans Figma Desktop. Importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Media Thumbnail Builder**. Le plugin exige `COMP-004 Cadre média` et réutilise son média `Thumbnail / Loaded` comme mock de revue.

La page `02.15 — Media Thumbnail` présente 16 variantes : `Selection=Other|Current` × `Interaction=Default|Hover|Focus|Active` × `Locale=FR|EN`. La sélection et l'interaction sont indépendantes, afin que la miniature courante puisse aussi recevoir le focus. Le libellé « Image 1 · actuelle » / « Image 1 · current » rend la sélection perceptible sans dépendre de la bordure. Le numéro est un exemple éditable à remplacer selon l'ordre réel des médias.

Chaque miniature correspond à une seule commande de sélection. Sa cible de 184 × 148 px dépasse le minimum fonctionnel ; l'anneau de focus entoure la cible entière. Le composant ne gère ni lecture vidéo, ni navigation indépendante. Le carrousel `COMP-205` fournira la position globale, l'annonce du média courant, la pause et les commandes précédente/suivante. Les médias SideQuest réels, leurs alternatives et leur nombre restent à confirmer.

Lors du lancement, le plugin inscrit la validation explicite de `COMP-204` du 2026-09-22 dans sa description et le sommaire Figma.

**Statut :** les 16 variantes ont été générées et une première capture a été revue. La sélection, le libellé et le focus sont lisibles. Le Hover et l'Active de la miniature courante étaient trop proches du Default ; le plugin ajoute une surface subtile au Hover et un contour violet sombre à l'Active. Relancer le plugin pour corriger les variantes existantes sans recréer le set, puis revoir le résultat dans Figma. `COMP-206` n'est pas encore validé.
