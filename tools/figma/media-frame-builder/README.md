# COMP-004 — Cadre média

Plugin local pour préparer la planche de revue du cadre média dans le fichier Figma V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Media Frame Builder**.

Le plugin exige les fondations et `COMP-003 Message d'état`. Il ajoute la page `02.5 — Media Frame` avec un set `Media frame` de neuf variantes : `Usage=Preview|Carousel|Thumbnail` × `State=Loading|Loaded|Error`. Les dimensions des exemples servent seulement à montrer les trois usages : aucun ratio final ni recadrage n'est fixé avant réception des médias. L'état `Loaded` contient un visuel géométrique marqué **MOCK · VISUEL DE REVUE**, à remplacer par une ressource de projet validée. Aucun visuel ne suggère que SideQuest a été réalisé.

Le cadre réserve la place du média et montre un chargement statique ou un repli textuel. Il ne porte ni lien, ni commande de carrousel, ni légende définitive. Dans un écran, une image informative absente sans remplacement peut être accompagnée de `COMP-003` ; la légende et l'alternative sont définies selon le contexte. Les captures produit conserveront leurs couleurs réelles.

Le plugin synchronise le statut approuvé de `COMP-003` dans sa description et dans le sommaire, puis ajoute `COMP-004` au sommaire. Une relance conserve le set créé et ses instances ; elle peut corriger la position des en-têtes de colonne et des notes d'usage sans recréer les variantes. **Statut : structure et neuf états de `COMP-004` validés par Costa le 2026-09-21 ; ratios et recadrages encore ouverts.**
