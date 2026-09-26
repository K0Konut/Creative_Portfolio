# COMP-102 — Navigation principale

Plugin local pour créer la planche de navigation principale dans le fichier Figma V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Main Navigation Builder**.

Le plugin vérifie le set `COMP-104 Sélecteur de langue`, puis ajoute la page `02.7 — Main Navigation` et un set `Main navigation` de 24 variantes : `Layout=Horizontal|Vertical` × `Current=Home|Projects|About` × `State=Default|Hover|Focus|Pressed`. Chaque variante contient Accueil, Projets et À propos ; l'état d'interaction est montré sur le premier lien non courant. La destination courante reste indiquée par contour et soulignement. Les trois libellés sont des propriétés de texte communes, modifiables en `Home`, `Projects`, `About` pour les écrans anglais ; les routes sont à fournir dans le futur code.

La disposition horizontale sert à l'en-tête large ; la verticale sera composée dans le panneau compact. Le même ensemble de destinations change de place selon le viewport, sans doublon interactif. Les cibles font au moins 48 px de haut et le focus englobe chaque lien. Le futur code emploiera une navigation nommée, des liens natifs et `aria-current="page"` sur le seul lien courant ; les états Figma ne représentent pas une navigation fonctionnelle.

Le plugin synchronise la validation de `COMP-104` dans le sommaire et sa description. Une relance conserve le set créé et ses instances ; elle repositionne les en-têtes de la planche pour dégager le nom du set et les libellés de ligne. **Statut : planche `COMP-102` validée par Costa le 2026-09-21 ; le plugin `COMP-103` synchronisera cette approbation dans Figma.**
