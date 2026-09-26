# COMP-104 — Sélecteur de langue

Plugin local pour créer la planche du sélecteur de langue dans le fichier Figma V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Language Switcher Builder**.

Le plugin vérifie les fondations et le set `COMP-004 Cadre média`. Il ajoute `02.6 — Language Switcher`, avec un set `Language switcher` de huit variantes : `Locale=FR|EN` × `State=Default|Hover|Focus|Pressed`. Les deux options restent visibles dans un contrôle de 48 px de haut. La langue courante est signalée par un contour et un soulignement, pas par la couleur seule ; les états d'interaction portent sur l'autre langue. Le même composant sera placé dans l'en-tête large ou dans le panneau mobile, sans doublon interactif.

Le futur code donnera aux options les noms accessibles « Français » et « English » et annoncera la langue courante. Le changement de langue devra préserver la destination logique, mettre à jour URL, contenus, métadonnées et CV, et expliquer une traduction réellement absente. Les contrôles de la planche ne représentent pas des liens déjà fonctionnels.

Le plugin marque `COMP-004` comme validé pour sa structure dans le sommaire et dans sa description ; ratios et recadrages restent ouverts. Une relance conserve le set créé et ses instances. **Statut : planche `COMP-104` validée par Costa le 2026-09-21 ; le plugin `COMP-102` synchronisera cette approbation dans Figma.**
