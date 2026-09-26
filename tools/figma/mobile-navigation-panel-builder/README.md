# COMP-103 — Panneau de navigation mobile

Plugin local pour créer la planche du panneau mobile dans le fichier Figma V1. Dans Figma Desktop, importer [`manifest.json`](./manifest.json) par **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Mobile Navigation Panel Builder**.

Le plugin vérifie les sets `COMP-001 Action`, `COMP-102 Navigation principale` et `COMP-104 Sélecteur de langue`. Il ajoute `02.8 — Mobile Navigation Panel` et un set `Mobile navigation panel` de huit variantes : `Panel=Closed|Open` × `Trigger=Default|Hover|Focus|Active`. Chaque variante utilise une instance du contrôle Action. Le panneau ouvert contient des instances de la navigation verticale et du sélecteur FR/EN ; le panneau fermé ne présente que sa commande. Le panneau mesure 280 px de large, soit la largeur disponible à 320 px CSS avec 20 px de marge de chaque côté.

La navigation verticale validée reste inchangée visuellement à sa largeur d'origine. Le plugin lui ajoute des contraintes horizontales pour que son instance puisse se réduire à 232 px dans le panneau compact, sans réduire la taille du texte ni les cibles. Le résultat réduit doit être contrôlé dans Figma après lancement. À partir de 1024 px, le panneau n'est pas interactif : l'en-tête affichera la navigation horizontale et le sélecteur directement.

Le futur code exposera le nom et l'état de la commande (`aria-expanded`), reliera la commande au panneau, fermera après un choix ou avec `Escape`, et rendra le focus à la commande quand la fermeture l'exige. Les liens et la langue utilisent leurs destinations réelles ; la maquette ne simule pas ces comportements. L'ouverture suit `motion/duration/panel` (280 ms) en mode standard et devient immédiate avec `prefers-reduced-motion`.

Le plugin synchronise la validation de `COMP-102` dans le sommaire et sa description. Une relance conserve le set créé et ses instances. **Statut : planche `COMP-103` validée par Costa le 2026-09-21 ; le plugin `COMP-101` synchronisera cette approbation dans Figma.**
