# COMP-214 — Téléchargement du CV

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — CV Download Builder**.

La page `02.24 — CV Download` contient le set `CV download` : `Layout=Wide|Compact` × `State=Default|Focus|Active|Unavailable` (8 variantes). Les trois états interactifs composent une instance `COMP-001 Secondary` ; l'état Unavailable retire cette action et la remplace par un message `COMP-003`. Le titre, le contexte et les détails du document sont éditables. Les références FR/EN vérifient la localisation et le reflow vertical à 320 px.

Les fichiers CV français et anglais, leur format, leur taille et leurs URL ne sont pas fournis. Les mentions présentes sont des placeholders de revue et aucune instance ne contient de destination. Une action ne pourra être publiée que lorsque le fichier correspondant à la langue active aura été vérifié. L'état indisponible ne doit jamais devenir un lien cassé ou un contrôle désactivé ambigu.

Le plugin synchronise l'approbation de première passe de `COMP-212` dans son set et le sommaire Figma. Une relance préserve `COMP-214` et ses instances.

**Statut :** première passe générée, captures revues et `COMP-214` validé explicitement par Costa comme base structurelle le 2026-09-22, après correction des propriétés `Unavailable` de `COMP-003`. Les huit variantes, le focus, l'état active, le reflow à 320 px et les références FR/EN restent lisibles sans chevauchement apparent. Cette validation ne fige pas le composant, qui restera ouvert à la seconde passe globale.
