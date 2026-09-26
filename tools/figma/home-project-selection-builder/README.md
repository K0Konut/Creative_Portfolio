# COMP-302 — Sélection de projet d'accueil

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Home Project Selection Builder**.

La page `03.2 — Home Project Selection` contient le set `Home project selection` avec 18 références : `Viewport=Wide|Medium|Compact` × `Locale=FR|EN` × `State=Default|Unavailable|MediaError`.

- `Default` compose `COMP-201 Project preview` dans son placement `Featured` et ouvre conceptuellement le détail localisé de SideQuest.
- `MediaError` conserve le statut, le texte, les métadonnées de revue et l'accès au détail ; seul le média passe dans son état d'erreur.
- `Unavailable` retire la carte et toute cible SideQuest, puis compose `COMP-003 Status message` avec une explication localisée. Son bandeau indique « destination indisponible » au lieu de promettre une ouverture du détail. Aucun lien cassé ou projet de remplacement n'est créé.
- `Wide`, `Medium` et `Compact` sont des références de composition à 1440, 768 et 375 px. Le média et les métadonnées SideQuest restent des valeurs de revue non publiables.

La section est nommée dans les deux langues et rappelle explicitement que SideQuest est un mock fictif, application non réalisée. Son aperçu mène directement au détail SideQuest ; il ne remplace pas le CTA principal de la Hero vers la collection Projets. Les textes de section sont éditables et restent à confirmer avant publication.

Le plugin synchronise dans Figma l'approbation de première passe de `COMP-301 Hero d'accueil`. Il conserve les réserves sur la proposition de valeur, le reflow à 320 px, le texte agrandi et l'équilibre de la variante Wide sans décoration.

**Statut :** 18 références générées et revues par captures le 2026-09-26. La première revue a révélé un libellé contradictoire dans les six références `Unavailable` ; la relance corrigée remplace uniquement ce libellé par « destination indisponible » / « destination unavailable » et préserve le set existant. Ces six références restent à contrôler avant toute validation.
