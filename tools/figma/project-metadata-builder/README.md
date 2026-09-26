# COMP-203 — Métadonnées du projet

Plugin local pour construire la planche des métadonnées de projet dans le fichier Figma V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Project Metadata Builder**.

Le plugin exige `COMP-202 Statut du projet`, conserve son set et inscrit sa validation dans le sommaire. Il crée la page `02.12 — Project Metadata` et un set `Project metadata` de quatre variantes : `Locale=FR|EN` × `Format=Compact|Detail`. Les deux paires libellé–valeur sont l'année et le type principal. Les valeurs sont des **mentions de revue** (« À confirmer » / « To be confirmed »), éditables en propriétés texte ; elles ne représentent pas des données SideQuest confirmées.

Le format compact est destiné aux aperçus ; le format détaillé au détail projet. Aucun champ « Rôle » n'est créé pour SideQuest. Un type complémentaire ou un rôle réel pourra être ajouté à une composition future seulement avec une donnée documentée. En code, chaque paire devra conserver sa relation sémantique (par exemple dans une liste de descriptions), et un champ absent sera entièrement omis. Le reflow à 320 px et les contenus réels seront contrôlés sur les écrans.

Une relance ne remplace pas le set ni ses instances. **Statut : structure des quatre variantes validée par Costa le 2026-09-21.** Les valeurs SideQuest restent à confirmer avant les écrans finaux. Le plugin `project-preview-builder` synchronise cette validation structurelle dans le set et le sommaire Figma à son lancement.
