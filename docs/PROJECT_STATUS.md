# État et workflow du projet

## Métadonnées

| Champ | Valeur |
|---|---|
| Projet | Portfolio de Costa Maskulov |
| Dernière mise à jour | 2026-09-14 |
| Phase actuelle | Parcours utilisateurs |
| Prochaine action | Cadrer et documenter les parcours prioritaires dans `docs/ux/USER_FLOWS.md` |
| État Git | Dépôt existant ; branche de travail `docs/dev/create-product-prd` |

## État des phases

| # | Phase | État | Preuve | Manque ou décision attendue |
|---|---|---|---|---|
| 1 | Cadrage du besoin | Validée | Entretien consolidé et approuvé par Costa le 2026-09-14 | Aucune |
| 2 | PRD | Validée | `docs/product/PRD.md` v0.2.1 approuvé explicitement par Costa le 2026-09-14 | Toute modification substantielle exigera une nouvelle validation |
| 3 | Utilisateurs, fonctionnalités et contraintes | Validée | Sections 6, 11, 12, 13 et 17 du PRD incluses dans l'approbation v0.2.1 | Aucune pour démarrer les parcours |
| 4 | Parcours utilisateurs | Non commencée | Parcours critiques seulement identifiés dans le PRD | Détailler après validation produit |
| 5 | Architecture des pages | Non commencée | Quatre pages V1 nommées, sans structure UX | Attendre les parcours validés |
| 6 | Inventaire des composants | Non commencée | Aucune preuve | Attendre l'architecture des pages |
| 7 | Fondations du design system | Non commencée | Moodboard et intentions de marque disponibles | Attendre PRD, UX et inventaire |
| 8 | Maquette Figma | Non commencée | Références externes seulement | Attendre les entrées produit et UX validées |
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
5. Définir les fondations visuelles et les règles de motion.
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
- `$impeccable init` : création future d'un `PRODUCT.md` opérationnel dérivé du PRD validé, afin d'alimenter les outils de design sans créer une seconde source de vérité concurrente.
- `$impeccable shape` et les outils de design/motion disponibles : exploration de l'univers visuel après validation des entrées produit et UX.
- `costa-figma-design` et les outils Figma : fondations, bibliothèque, écrans, prototype et handoff.
- Skill d'ingénierie correspondant à la stack retenue : architecture d'implémentation et développement.
- `costa-quality-gate`, audits et tests navigateur : validation avant livraison.

## Garde-fous de transition

- Ne pas commencer les parcours détaillés avant validation du PRD.
- Ne pas commencer la maquette avant validation des parcours, de l'architecture des pages et de l'inventaire des composants.
- Ne pas commencer l'implémentation avant validation du PRD, de l'architecture des pages, des composants et de l'UX/UI.
- Ne pas considérer un fichier existant comme validé sans approbation humaine explicite.
- Conserver le CRM hors de ce dépôt ; seule une future interface de données pourra relier les deux produits.
- Préserver la lisibilité, l'accessibilité et les performances comme limites non négociables de l'expérimentation visuelle.

## Modèle Git prévu

Le dépôt existe et le travail documentaire courant se trouve sur `docs/dev/create-product-prd`. Lors de la phase d'initialisation applicative, le modèle attendu sera :

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
- La prochaine phase est la documentation des parcours utilisateurs ; elle n'est pas encore commencée.
