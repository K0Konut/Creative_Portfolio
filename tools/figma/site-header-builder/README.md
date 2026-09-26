# COMP-101 — En-tête du site

Plugin local pour créer la planche de l'en-tête global dans le fichier Figma V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Site Header Builder**.

Le plugin vérifie les sets `COMP-102 Navigation principale`, `COMP-103 Panneau de navigation mobile` et `COMP-104 Sélecteur de langue`. Il ajoute `02.9 — Site Header` et un set `Site header` de quatre variantes : `Configuration=Wide1440|Large1024|CompactClosed|CompactOpen`. Les deux formats larges ont une hauteur de 72 px et affichent directement la navigation horizontale et les langues. Les deux formats compacts mesurent 320 × 64 px et placent le panneau mobile fermé ou ouvert à droite de la signature « COSTA MASKULOV ». La signature représente un retour à l'accueil dans la langue active ; sa destination sera reliée dans le code.

Les instances imbriquées réutilisent les composants validés. Le composant ne contient ni CV ni contacts. Le lien d'évitement, l'état de page courante, l'ordre du focus, la fermeture du panneau et la gestion du focus sous un éventuel en-tête sticky relèvent des écrans et du futur code. Aucun état de défilement n'est décidé à ce stade.

Le plugin synchronise la validation de `COMP-103` dans le sommaire et sa description. Une relance conserve le set créé et ses instances. La commande mobile est remontée de 8 px afin de ménager un espace visible avec le trait inférieur ; le panneau ouvert reste sous l'en-tête. **Statut : planche `COMP-101` validée par Costa le 2026-09-21 ; le plugin `COMP-105` synchronisera cette approbation dans Figma.**
