# COMP-105 — Pied de page

Plugin local pour créer une planche de structure du pied de page V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Site Footer Builder**.

Le plugin vérifie `COMP-101 En-tête du site`, puis ajoute `02.10 — Site Footer` et un set `Site footer` de deux variantes, `Layout=Wide` et `Layout=Compact`. La planche montre la signature, la navigation de rappel Accueil/Projets/À propos et les emplacements Email, LinkedIn, GitHub et CV. Une surface violette utilise les alias `surface/brand`, `text/on-brand` et `border/inverse` des fondations. À 320 px, les groupes se réorganisent verticalement sans défilement horizontal.

Les coordonnées, URLs des profils et CV FR/EN ne sont pas encore fournis. La planche affiche donc « Adresse à confirmer » et indique explicitement que les ressources ne sont pas liées. Aucun de ces libellés n'est un lien fonctionnel ou une destination simulée ; ils doivent être remplacés ou retirés selon les données réellement disponibles avant validation finale et mise en écran. Le futur code utilisera un repère de pied de page, des liens natifs avec destination réelle et une adresse email visible et sélectionnable.

Le plugin synchronise la validation de `COMP-101` dans le sommaire et sa description. Une relance conserve le set créé et ses instances. **Statut : structure large/compacte validée par Costa le 2026-09-21 ; contenus et liens finaux toujours en attente. Le plugin `COMP-202` synchronisera cette approbation de structure dans Figma.**
