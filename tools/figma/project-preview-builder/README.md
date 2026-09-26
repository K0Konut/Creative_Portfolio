# COMP-201 — Aperçu de projet

Plugin local pour composer la planche d'aperçus SideQuest dans le fichier Figma V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Project Preview Builder**. Une relance conserve les 24 variantes larges et ajoute, si elles sont absentes, les références compactes.

Le plugin vérifie les sets `COMP-004 Cadre média`, `COMP-202 Statut du projet` et `COMP-203 Métadonnées du projet`. La page `02.13 — Project Preview` contient 24 variantes larges : `Featured` ou `Collection` × FR ou EN × `Default`, `Hover`, `Focus`, `Active`, `MediaLoading` ou `MediaError`. Les captures rapprochées du 2026-09-22 montrent le focus autour de la carte entière, la localisation EN des messages média et la persistance du texte, du statut, des métadonnées et de l'action pendant loading/error.

La carte entière représente **un seul lien** vers le détail localisé. Le bloc coloré « Découvrir le concept » / « Explore the concept » est un repère visuel issu d'Action, sans bouton imbriqué. Le titre et le libellé de l'action sont éditables dans chaque variante. Aucune démo, dépôt, métrique ou rôle SideQuest n'est inventé.

Le set **Project preview · Compact reference** contient quatre variantes `Default` de 375 px : les deux placements en FR et EN. Il place le statut avant le média, puis le titre, les métadonnées et le repère d'action. Le média loaded reste un mock de revue ; année et type sont des valeurs à confirmer, non publiables. La première capture a révélé que le grand titre touchait le champ des métadonnées dans Featured FR/EN. La relance corrigée positionne ce champ après la hauteur réelle du titre et décale l'action si nécessaire, sans remplacer les variantes. La nouvelle capture confirme la séparation dans les deux langues. Les états compacts et le reflow à 320 px et au zoom 200 % seront contrôlés dans les écrans.

**Statut :** 24 variantes larges et quatre références compactes validées explicitement par Costa le 2026-09-22. Les données de projet et le reflow en contexte restent à vérifier dans les écrans.
