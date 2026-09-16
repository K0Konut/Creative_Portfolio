# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Décision ouverte : le framework, l'hébergement et le domaine seront choisis pendant la phase d'architecture technique, après validation de l'UX/UI. Aucun choix de stack ne doit être déduit des livrables de conception.

## Users

Le public prioritaire est le recruteur technique ou généraliste qui découvre le profil de Costa ou l'évalue lors d'une future recherche de stage. Il doit comprendre rapidement son positionnement, examiner ses projets, vérifier son parcours, récupérer son CV et le contacter.

Le responsable technique ou membre d'une équipe produit est un public secondaire. Il cherche surtout à évaluer la rigueur, le raisonnement et la maintenabilité du travail présenté. Les clients potentiels constituent une cible future, non prioritaire pour la V1.

## Product Purpose

Creative Portfolio est le portfolio personnel bilingue français–anglais de Costa Maskulov, étudiant en bac+5 spécialisé en software engineering full-stack. Il prépare sa visibilité et ses futures candidatures à un stage sans correspondre à une recherche active au lancement.

Le produit doit présenter Costa, mettre ses projets en valeur comme dans un showroom, expliquer progressivement son parcours et démontrer par sa propre qualité qu'il sait concevoir des expériences web créatives, accessibles, performantes et techniquement sérieuses.

Le succès de la V1 repose d'abord sur une compréhension qualitative : le visiteur identifie correctement le positionnement de Costa, comprend que SideQuest est un mock non réalisé, trouve les contenus utiles et peut poursuivre vers le CV ou un moyen de contact sans confusion.

## Positioning

Le portfolio se positionne comme un mini studio digital personnel, et non comme un CV en ligne générique, une agence fictive ou une démonstration d'effets. Sa différence repose sur l'association visible entre sensibilité UI/UX, créativité maîtrisée et rigueur full-stack, avec les projets et le raisonnement comme preuves centrales.

## Operating Context

- Le site est public et consulté sur mobile, tablette ou ordinateur, souvent depuis un CV, une candidature, un profil public ou un lien partagé.
- Une nouvelle visite commence en français ; le visiteur peut passer au français ou à l'anglais depuis chaque destination sans perdre la page ou le projet consulté.
- L'expérience V1 comporte quatre pages de contenu : Accueil, Projets, Détail d'un projet et À propos, ainsi qu'une destination système pour les pages introuvables.
- Le CV correspondant à la langue active peut être téléchargé après la présentation du parcours et depuis le pied de page lorsqu'il est disponible.
- L'email visible et copiable et LinkedIn constituent les contacts prioritaires ; GitHub sert principalement à l'évaluation technique.

## Capabilities and Constraints

- La V1 est intégralement disponible en français et en anglais, avec parité des informations essentielles.
- SideQuest est l'unique contenu projet de démonstration. Il doit toujours être identifié comme « mock fictif — application non réalisée » ou par une formulation strictement équivalente.
- SideQuest ne doit recevoir aucun faux client, rôle, dépôt, prototype, déploiement, résultat, métrique ou raisonnement présenté comme réellement exécuté.
- La V1 permet de consulter la collection, le détail SideQuest, le parcours, les compétences, la manière de travailler, les CV et les contacts directs.
- Le carrousel projet contient uniquement des images en V1. Son autoplay est contrôlable et désactivé lorsque la réduction du mouvement est demandée.
- Il n'existe en V1 ni page Contact, ni formulaire, ni filtre ou tri, ni réglage interne de réduction du mouvement, ni analytics, ni compte utilisateur, ni back-office.
- Le CRM est un produit indépendant et reste entièrement hors de ce dépôt. Seul un futur contrat de données pourra préparer une intégration ultérieure.
- Les contenus, coordonnées, CV, médias SideQuest et traductions définitives restent des dépendances éditoriales à fournir ou valider avant la maquette finale et l'implémentation concernée.
- La source produit détaillée demeure `docs/product/PRD.md` v0.2.1. Les parcours, pages et composants validés sont documentés respectivement dans `docs/ux/USER_FLOWS.md`, `docs/ux/PAGE_ARCHITECTURE.md` et `docs/ui/COMPONENT_INVENTORY.md`.

## Brand Commitments

- Titres publics : « Costa Maskulov — Développeur full-stack créatif » et « Costa Maskulov — Creative Full-Stack Developer ».
- Personnalité recherchée : créative, moderne, interactive, professionnelle et mémorable.
- Principe directeur : « créatif assumé, mais maîtrisé ».
- Les projets et les contenus de recrutement restent prioritaires sur la décoration ou les effets.
- L'identité doit éviter le template développeur générique, le CV froid et scolaire, le corporate trop sage, l'expérimentation illisible, le néo-brutalisme copié, le custom cursor et la surcharge visuelle.
- Les références de départ citées dans le PRD sont The Flow Party, SUB:BIO STUDIOS, Brosti, Encoder et Digital Mosaik. Elles servent à identifier des qualités précises, jamais à importer leur identité ou leur contenu.

## Evidence on Hand

- `docs/product/PRD.md` v0.2.1, validé explicitement le 2026-09-14.
- `docs/ux/USER_FLOWS.md` v0.3.1, validé explicitement le 2026-09-15.
- `docs/ux/PAGE_ARCHITECTURE.md` v0.1.1, validé explicitement le 2026-09-15.
- `docs/ui/COMPONENT_INVENTORY.md` v0.2.0, dont l'alignement du bandeau de stacks statique a été autorisé explicitement le 2026-09-16.
- `docs/ui/DESIGN_SYSTEM.md` v0.11.0, validé globalement le 2026-09-16 après revue documentaire finale.
- `docs/ui/MOTION_GUIDELINES.md` v0.2.1, validé le 2026-09-16.
- Le concept SideQuest et sa structure de présentation sont disponibles comme support de composition, mais aucun produit fonctionnel ni résultat réel ne doit être fabriqué.
- Les vrais projets, contenus personnels définitifs, CV, coordonnées publiques et médias finaux ne sont pas encore disponibles dans ce dépôt ; les travaux futurs doivent signaler ces absences au lieu d'inventer des preuves.

## Product Principles

1. **Démontrer par l'expérience.** La qualité du portfolio doit rendre crédible le positionnement créatif et technique avant même la lecture détaillée des projets.
2. **Rester radicalement honnête.** Toute preuve, ressource ou attribution doit correspondre à un travail réel ; le mock SideQuest reste explicite dans chaque contexte.
3. **Faire servir l'expression au contenu.** La créativité renforce la hiérarchie, la mémorisation et la compréhension sans détourner l'attention des projets ou des informations de recrutement.
4. **Préserver la continuité des parcours.** Navigation, changement de langue, responsive et réduction du mouvement donnent accès aux mêmes informations et résultats.
5. **Préparer l'évolution sans simuler le futur.** La V1 fonctionne honnêtement avec un seul mock et reste extensible, sans faux catalogue ni complexité prématurée.

## Accessibility & Inclusion

- Objectif : WCAG 2.2 niveau AA sur les pages et parcours critiques.
- Toutes les actions principales doivent être utilisables au clavier avec un focus visible et un nom accessible explicite.
- L'ordre de lecture et de focus doit rester logique lorsque les compositions se réorganisent.
- Aucun contenu ou état ne doit dépendre uniquement de la couleur, d'une icône, d'un survol, d'un geste ou d'un mouvement.
- Le contenu doit rester utilisable au zoom et en reflow, sans débordement horizontal non intentionnel.
- `prefers-reduced-motion` doit supprimer ou réduire fortement les mouvements non essentiels sans masquer de contenu ni bloquer d'interaction.
