# État et workflow du projet

## Métadonnées

| Champ | Valeur |
|---|---|
| Projet | Portfolio de Costa Maskulov |
| Dernière mise à jour | 2026-09-16 |
| Phase actuelle | Revue documentaire transversale — à reprendre |
| Prochaine action | Relire intégralement et croiser le PRD, les parcours, l'architecture des pages, l'inventaire des composants, les fondations et la motion avant de démarrer Figma |
| Décision récente | `docs/ui/DESIGN_SYSTEM.md` v0.11.0 validé globalement par Costa le 2026-09-16 après réussite de la revue finale |
| État Git | `dev` synchronisée avec `origin/dev` sur `78d96a1` après fusion de l'inventaire ; documents de travail non committés sur `docs/dev/create-design-system-foundations` |

## État des phases

| # | Phase | État | Preuve | Manque ou décision attendue |
|---|---|---|---|---|
| 1 | Cadrage du besoin | Validée | Entretien consolidé et approuvé par Costa le 2026-09-14 | Aucune |
| 2 | PRD | Validée | `docs/product/PRD.md` v0.2.1 approuvé explicitement par Costa le 2026-09-14 | Toute modification substantielle exigera une nouvelle validation |
| 3 | Utilisateurs, fonctionnalités et contraintes | Validée | Sections 6, 11, 12, 13 et 17 du PRD incluses dans l'approbation v0.2.1 | Aucune pour démarrer les parcours |
| 4 | Parcours utilisateurs | Validée | `docs/ux/USER_FLOWS.md` v0.3.1 approuvé explicitement par Costa le 2026-09-15 | Toute modification substantielle exigera une nouvelle validation |
| 5 | Architecture des pages | Validée | `docs/ux/PAGE_ARCHITECTURE.md` v0.1.1 ; correction éditoriale sans changement fonctionnel de la v0.1.0 approuvée par Costa le 2026-09-15 | Toute modification substantielle exigera une nouvelle validation |
| 6 | Inventaire des composants | Validée | `docs/ui/COMPONENT_INVENTORY.md` v0.2.0 ; bandeau de stacks statique autorisé par Costa le 2026-09-16 | Toute nouvelle modification substantielle exigera une validation |
| 7 | Fondations du design system | Validée | `docs/ui/DESIGN_SYSTEM.md` v0.11.0 validé globalement par Costa le 2026-09-16 ; `docs/ui/MOTION_GUIDELINES.md` v0.2.1 validé | Revue transversale demandée avant la phase Figma |
| 8 | Maquette Figma | Non commencée | Références et contrat Figma–code documentés | Terminer la revue transversale des documents validés |
| 9 | Validation UX/UI | Non commencée | Aucune maquette à approuver | Approbation humaine requise avant implémentation |
| 10 | Architecture technique | Non commencée | Stack et hébergement non décidés | Attendre le produit et l'UX/UI validés |
| 11 | Initialisation du projet | Non commencée | Dépôt Git disponible, mais aucun code ni manifeste | Attendre l'architecture technique avant d'initialiser l'application |
| 12 | Implémentation du design system | Non commencée | Aucun code UI | Attendre fondations et maquette validées |
| 13 | Développement par feature | Non commencée | Aucun code | Attendre les contrats amont validés |
| 14 | Tests fonctionnels et techniques | Non commencée | Aucun projet exécutable | Définir après architecture et implémentation |
| 15 | Audit accessibilité | Non commencée | Objectif WCAG 2.2 AA inscrit au PRD | Exécuter sur un produit testable |
| 16 | Vérification responsive et visuelle | Non commencée | Exigence responsive inscrite au PRD | Comparer à la maquette validée sur un produit testable |
| 17 | Build de production | Non commencée | Aucun projet exécutable | Attendre la validation qualité |
| 18 | Préparation de la livraison GitHub | Non commencée | Dépôt disponible, aucune livraison préparée | Attendre un build validé ; aucune action distante sans autorisation explicite |

## Workflow retenu

1. Finaliser le cadrage et le PRD, puis obtenir la validation explicite de Costa.
2. Documenter les parcours utilisateurs prioritaires.
3. Définir l'architecture des pages et la navigation.
4. Établir l'inventaire des composants et de leurs états.
5. Établir le contexte Impeccable, sélectionner la direction visuelle en mode `Experience`, puis définir les fondations visuelles et les règles de motion.
6. Concevoir les écrans et variantes utiles dans Figma.
7. Faire valider explicitement l'UX et la direction artistique.
8. Choisir et documenter l'architecture technique, la stack et le futur contrat de données du CRM.
9. Initialiser le dépôt et le projet sur une branche de travail conforme au workflow Git.
10. Implémenter les fondations puis développer verticalement, fonctionnalité par fonctionnalité.
11. Exécuter les tests fonctionnels, techniques, accessibles, responsive et visuels.
12. Vérifier le build de production et préparer la livraison GitHub, sans push, PR ni merge non demandé.

## Rôle des outils et skills dans ce workflow

- `costa-product-specification` : cadrage et maintien du PRD.
- `costa-project-workflow` : suivi des phases, preuves, validations et dépendances.
- `costa-ux-architecture` : parcours, architecture des pages et inventaire conceptuel des composants après validation du PRD.
- `$impeccable init` : `PRODUCT.md` créé comme synthèse opérationnelle du PRD et des livrables validés, sans remplacer leur niveau de détail.
- `$impeccable shape` : atelier terminé avec la direction « Studio graphique modulaire », la composition `.impeccable/mocks/decision/model-pick-modular-studio.png` et le mode comp-led ; aucune implémentation n'a été lancée.
- `costa-figma-design` et les outils Figma : fondations, bibliothèque, écrans, prototype et handoff.
- Skill d'ingénierie correspondant à la stack retenue : architecture d'implémentation et développement.
- `costa-quality-gate`, audits et tests navigateur : validation avant livraison.

## Garde-fous de transition

- Ne pas commencer les parcours détaillés avant validation du PRD.
- Ne pas commencer la maquette avant validation des parcours, de l'architecture des pages et de l'inventaire des composants.
- Ne pas commencer Figma sur la seule validation de la direction ; finaliser et faire valider l'ensemble des fondations dans `docs/ui/DESIGN_SYSTEM.md`.
- Ne pas commencer Figma avant validation explicite de `docs/ui/DESIGN_SYSTEM.md`.
- Pour cette reprise, effectuer la revue transversale complète demandée par Costa avant toute écriture dans Figma.
- Ne pas commencer l'implémentation avant validation du PRD, de l'architecture des pages, des composants et de l'UX/UI.
- Ne pas considérer un fichier existant comme validé sans approbation humaine explicite.
- Conserver le CRM hors de ce dépôt ; seule une future interface de données pourra relier les deux produits.
- Préserver la lisibilité, l'accessibilité et les performances comme limites non négociables de l'expérimentation visuelle.

## Modèle Git prévu

Le dépôt existe ; le PRD, les parcours utilisateurs, l'architecture des pages et l'inventaire des composants v0.1.0 ont été intégrés dans `dev`. Les fondations du design system sont préparées sur `docs/dev/create-design-system-foundations`. Lors de la phase d'initialisation applicative, le modèle attendu sera :

- `main` pour les versions destinées aux releases ;
- `dev` pour l'intégration ;
- branches de travail comme `docs/dev/create-product-prd`, `feat/dev/project-showcase` ou `feat/dev/about-page` ;
- Conventional Commits avec descriptions en français ;
- toute fusion par pull request validée et `Squash and merge` ;
- aucun commit, push, PR ou merge sans demande explicite.

## Décisions et blocages actuels

- Le produit cible en priorité les recruteurs et prépare de futures recherches de stage, sans recherche active au lancement.
- Les titres validés sont « Costa Maskulov — Développeur full-stack créatif » et « Costa Maskulov — Creative Full-Stack Developer ».
- La V1 est bilingue et comporte quatre pages ainsi que SideQuest, utilisé uniquement comme mock fictif temporaire et non comme projet à développer.
- La mention de mock sera explicite ; le formulaire et la page Contact sont reportés en V2.
- L'expérience doit évoquer un mini studio digital personnel : créative, interactive, technique, lisible et professionnelle.
- Le CRM et les analytics sont reportés et ne font pas partie du dépôt V1.
- Le PRD v0.2.1 a été validé explicitement par Costa le 2026-09-14, sans réserve.
- Les sept parcours utilisateurs V1 documentés dans `docs/ux/USER_FLOWS.md` v0.3.1 ont été validés explicitement par Costa le 2026-09-15.
- L'architecture des quatre pages V1 documentée dans `docs/ux/PAGE_ARCHITECTURE.md` v0.1.1 reprend sans changement fonctionnel la v0.1.0 validée explicitement sans réserve par Costa le 2026-09-15.
- L'inventaire conceptuel des composants v0.1.0 a été validé explicitement par Costa le 2026-09-15 ; sa v0.2.0 aligne, avec son autorisation du 2026-09-16, le bandeau de stacks statique sur les fondations de motion.
- `PRODUCT.md` a été approuvé comme synthèse durable des décisions produit validées, avec la stack et l'hébergement laissés à la phase d'architecture technique.
- Le portfolio est traité par Impeccable en mode `Experience` ; la première vue doit faire retenir que Costa est un développeur full-stack capable de créer des expériences web singulières.
- Le workflow Impeccable comp-led a été confirmé pour approfondir les compositions avant la maquette finale ; ce choix ne lance ni Figma ni implémentation pendant la phase documentaire.
- Le tirage Impeccable `fbe634a4` a abouti à la sélection explicite de « Studio graphique modulaire » le 2026-09-16 ; son brief `shape` a ensuite été approuvé par Costa.
- La composition `.impeccable/mocks/decision/model-pick-modular-studio.png` sert de north star, sans valider au pixel près les futurs écrans Figma.
- Le trio typographique final League Gothic–Manrope–Fraunces Italic, ses rôles, ses variantes utiles et son échelle responsive ont été validés explicitement par Costa le 2026-09-16. HUMANE et Satoshi restent uniquement des références de caractère.
- La palette sémantique violet–crème–lime–rose, ses états interactifs, ses couleurs de feedback, son focus bicolore et sa matrice de contraste WCAG 2.2 AA ont été validés explicitement par Costa le 2026-09-16.
- L'échelle d'espacement fondée sur 4 px, ses alias responsives, les dimensions de contrôle et le standard de cible à 44 × 44 px ont été validés explicitement par Costa le 2026-09-16.
- Les quatre contextes de grille, leurs colonnes, marges, gouttières, conteneurs et règles de reflow WCAG 2.2 AA ont été validés explicitement par Costa le 2026-09-16.
- Les surfaces, contours, rayons, deux élévations ciblées et gestes de matière ont été validés explicitement par Costa le 2026-09-16.
- Le set d'icônes fonctionnelles, les marques éditoriales, les règles média et leur contrat accessible ont été validés explicitement par Costa le 2026-09-16.
- Les tokens de motion, la transition signature, le comportement du carrousel, les interruptions et la variante réduite ont été validés explicitement par Costa le 2026-09-16.
- La revue finale des fondations a résolu les aliases d'état et de feedback, la résilience de l'espacement du texte, le focus non masqué, la traçabilité Figma–code et les références documentaires obsolètes ; `docs/ui/DESIGN_SYSTEM.md` v0.11.0 a été validé globalement par Costa le 2026-09-16.
- La prochaine session doit commencer par une revue transversale complète des documents produit, UX et UI avant toute création dans Figma.
- Les fondations constituent le contrat de référence de la V1, sans être immuables : toute évolution V2/V3 suivra les niveaux de changement, règles de migration, vérifications et validations documentés dans le design system.
- Les coordonnées, les CV, le contenu de profil, le contenu SideQuest et la responsabilité de traduction restent des dépendances de contenu ; elles ne bloquent pas la validation de la structure des parcours.
- L'action projet principale mène à la collection ; le changement de langue conserve la destination exacte ; le récit du profil précède le téléchargement direct du CV dans la langue active.
- Le CTA de la hero mène à la collection Projets, tandis que l'aperçu SideQuest de l'accueil ouvre directement son détail.
- Le détail projet place le carrousel puis les métadonnées avant la description et les stacks ; SideQuest n'affiche aucun rôle, et sa fin de page propose le contact tant qu'aucun autre projet n'est disponible.
- Les filtres, tris, suggestions de projets, page Contact et réglage manuel de réduction du mouvement sont reportés après la V1 et devront être cadrés dans une future version du PRD.
