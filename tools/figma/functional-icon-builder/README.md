# Creative Portfolio — Functional Icons Builder

Ce plugin local prépare dans Figma huit icônes fonctionnelles nécessaires aux
composants `COMP-001 Action` et `COMP-002 Lien avec icône` : `ArrowRight`,
`ArrowLeft`, `ExternalLink`, `Download`, `Mail`, `Copy`, `Check` et `Alert`.
Elles font partie du set prévu dans `docs/ui/DESIGN_SYSTEM.md` v0.12.0.

## Exécution

1. Ouvrir le fichier **Creative Portfolio — Design System & Screens V1** dans Figma Desktop.
2. Importer ce `manifest.json` via **Plugins → Development → Import new plugin from manifest…**.
3. Lancer **Creative Portfolio — Functional Icons Builder**.
4. Attendre `Icônes créées · sommaire Components actualisé`.

Le plugin exige les fondations Figma existantes. Il crée une page `02.2 — Functional Icons`,
un set `Functional icon` avec huit variantes `Name`, et une planche de revue.
Il transforme aussi `02 — Components` en sommaire des composants créés et à venir.
Une relance met le sommaire à jour sans dupliquer les icônes ; elle affiche
`Sommaire Components actualisé · icônes validées`.
Les icônes mesurent 20 × 20 px, utilisent des traits de 1,5 px avec extrémités
carrées et héritent du token `text/primary`. Le plugin élargit les scopes Figma
de ce token aux traits et remplissages vectoriels, sans changer sa couleur.

Cette première tranche et son rendu ont été **validés par Costa le 2026-09-21**.
Les neuf autres icônes prévues par le contrat V1 seront créées au
rythme de leurs consommateurs. Le plugin ne crée aucun lien ni comportement HTML.
