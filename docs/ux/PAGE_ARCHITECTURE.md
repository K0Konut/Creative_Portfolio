# Architecture des pages — Portfolio de Costa Maskulov

## 1. Métadonnées

| Champ | Valeur |
|---|---|
| Produit | Portfolio personnel de Costa Maskulov |
| Version | 0.1.0 |
| Statut | Validé |
| Dernière mise à jour | 2026-09-15 |
| Date de validation | 2026-09-15 |
| Périmètre | V1 bilingue français–anglais |
| Source produit | `docs/product/PRD.md` v0.2.1, validé le 2026-09-14 |
| Source UX | `docs/ux/USER_FLOWS.md` v0.3.1, validé le 2026-09-15 |
| Source complémentaire | Entretien d'architecture des pages avec Costa, 2026-09-15 |
| Responsable de validation | Costa Maskulov |

## 2. Finalité et limites

Ce document projette les sept parcours V1 dans une structure de quatre pages publiques, cohérente, bilingue et directement exploitable pour préparer l'inventaire des composants puis la maquette Figma.

Il définit les responsabilités des pages, la hiérarchie des contenus, les transitions, les états, les priorités responsive et les contraintes accessibles. Il ne choisit ni direction artistique détaillée, ni grille graphique, ni composants techniques, ni framework.

### Frontières confirmées

- La V1 contient quatre pages principales : Accueil, Projets, Détail d'un projet et À propos.
- Il n'existe ni page Contact, ni formulaire, ni compte utilisateur, ni back-office.
- SideQuest est l'unique contenu projet de la V1 et reste présenté comme un mock fictif non réalisé.
- Les contenus essentiels, métadonnées, actions et pages existent en français et en anglais.
- La première visite commence en français ; le choix de langue n'est conservé que pendant la visite en cours.
- Une destination système « page introuvable » peut exister sans être comptée parmi les quatre pages de contenu.

### Intentions réservées aux phases UI et Figma

- La hero de l'accueil doit être très créative tout en préservant la compréhension immédiate du positionnement et des actions.
- La collection de projets doit pouvoir évoluer vers une composition de type Bento Grid lorsque plusieurs projets réels seront disponibles.
- Les choix de composition, de couleur, de typographie, d'iconographie et de motion seront définis dans les fondations visuelles et la maquette.

## 3. Décisions d'architecture validées pendant l'entretien

| ID | Décision |
|---|---|
| PA-DEC-001 | L'en-tête global expose le retour à l'accueil, Projets, À propos et le changement de langue. |
| PA-DEC-002 | Le CV et les moyens de contact restent accessibles dans les contenus pertinents et dans le pied de page, pas dans une page Contact. |
| PA-DEC-003 | L'accueil enchaîne hero créative, sélection de projets, aperçu du profil, bandeau de stacks, puis pied de page. |
| PA-DEC-004 | Dans la hero, « Découvrir mes projets » est l'action principale et « À propos » l'action secondaire. |
| PA-DEC-005 | La collection V1 donne à SideQuest une présence éditoriale large et prépare une future composition en Bento Grid sans afficher de cases artificiellement vides. |
| PA-DEC-006 | Le détail ordonne ses contenus ainsi : carrousel, métadonnées disponibles, description, stacks, puis fin de page conditionnelle. |
| PA-DEC-007 | Le champ « Rôle » appartient au modèle des projets réels mais est entièrement absent de SideQuest. |
| PA-DEC-008 | La fin d'un détail suggère d'autres projets lorsqu'ils existent ; sinon, elle invite à contacter Costa par email ou LinkedIn. |
| PA-DEC-009 | La page À propos contient une introduction, une timeline unifiée formation–expériences, les stacks et compétences, la manière de travailler, le CV et la prise de contact. |
| PA-DEC-010 | Les URL sont localisées et le changement de langue conserve la destination logique exacte. |
| PA-DEC-011 | La timeline unifiée présente les événements du plus récent au plus ancien. |
| PA-DEC-012 | Le CTA principal de la hero mène à la collection ; l'aperçu SideQuest de l'accueil mène directement à son détail. |

Ces décisions ont été confirmées individuellement le 2026-09-15. Le document complet reste toutefois « À valider » jusqu'à sa relecture globale.

## 4. Sitemap fonctionnelle

```text
Entrée sans langue (/)
└── Français par défaut (/fr)
    ├── PAGE-001 — Accueil
    ├── PAGE-002 — Projets
    │   └── PAGE-003 — Détail d'un projet
    └── PAGE-004 — À propos

Équivalents anglais (/en)
├── PAGE-001 — Home
├── PAGE-002 — Projects
│   └── PAGE-003 — Project detail
└── PAGE-004 — About

Destination système
└── SYS-001 — Page introuvable dans la langue active
```

Toutes les pages partagent l'en-tête, le pied de page et le changement de langue. Les liens email, LinkedIn, GitHub et CV sont des sorties vers des ressources externes ou téléchargeables, pas des pages du portfolio.

## 5. Inventaire des destinations et URL

| ID | Destination | URL française | URL anglaise | Indexation | Rôle principal |
|---|---|---|---|---|---|
| PAGE-001 | Accueil | `/fr` | `/en` | Oui | Présenter Costa et orienter vers ses projets. |
| PAGE-002 | Projets | `/fr/projets` | `/en/projects` | Oui | Présenter la collection sans inventer de contenu. |
| PAGE-003 | Détail projet | `/fr/projets/:slug` | `/en/projects/:slug` | Oui si publié | Expliquer un projet ou un mock avec son contexte complet. |
| PAGE-004 | À propos | `/fr/a-propos` | `/en/about` | Oui | Présenter le parcours, les compétences et la manière de travailler. |
| SYS-001 | Page introuvable | URL demandée | URL demandée | Non | Expliquer l'erreur et ramener vers une destination valide. |

### Règles d'URL et de langue

- `/` mène à la version française de l'accueil lors d'une nouvelle visite.
- Le changement de langue établit une correspondance exacte entre les deux URL d'une même destination logique.
- Pour un projet, le même identifiant de contenu relie les deux versions du détail même si les segments de route sont localisés.
- Une route sans équivalent traduit ne mélange pas les langues : elle conserve une destination valide, explique l'indisponibilité et propose une reprise.
- Les URL finales, redirections et balises alternatives seront précisées techniquement sans modifier cette architecture fonctionnelle.

## 6. Navigation transversale

### En-tête global

Présent sur les quatre pages :

1. Nom ou signature de Costa, avec retour à l'accueil de la langue active.
2. Accès « Projets ».
3. Accès « À propos ».
4. Sélecteur français–anglais indiquant explicitement la langue active.

L'en-tête ne porte pas toute la conversion : le CV et les contacts sont proposés dans les contenus et le pied de page. Sur petit écran, la présentation peut devenir compacte, mais toutes les destinations restent disponibles au clavier sans dépendre d'un geste complexe.

### Pied de page global

Le pied de page fournit :

- une navigation de rappel vers Accueil, Projets et À propos ;
- l'adresse email visible, sélectionnable et copiable, ainsi qu'une action d'envoi direct ;
- LinkedIn et GitHub avec leur destination annoncée clairement ;
- le téléchargement du CV correspondant à la langue active, avec langue et format identifiables ;
- les informations légales ou de signature strictement nécessaires.

Si une ressource n'est pas encore disponible ou vérifiée, son contrôle n'est pas publié comme lien cassé.

### Navigation contextuelle

- L'action principale de la hero mène à la collection ; l'aperçu SideQuest de l'accueil mène directement à son détail.
- Une entrée de collection mène au détail du projet sélectionné.
- Le détail permet un retour explicite à la collection.
- La page À propos mène au CV, aux projets et aux moyens de contact.
- La fin du détail mène soit vers d'autres projets existants, soit vers l'email et LinkedIn.

### Évitement et focus

- Un mécanisme d'évitement permet d'atteindre directement le contenu principal.
- La page courante est perceptible dans la navigation sans dépendre uniquement de la couleur.
- Le changement de page place le focus de manière prévisible ; le changement de langue ne fait pas perdre le contexte logique.
- Tous les contrôles possèdent un focus visible et un nom accessible explicite.

## 7. Couverture des parcours par page

| Parcours | PAGE-001 | PAGE-002 | PAGE-003 | PAGE-004 | Éléments globaux |
|---|---:|---:|---:|---:|---:|
| FLOW-001 — Comprendre le positionnement | Principal | Suite | — | Secondaire | En-tête, pied de page |
| FLOW-002 — Parcourir la collection | Entrée | Principal | Suite | — | Navigation |
| FLOW-003 — Examiner SideQuest | Entrée possible | Entrée | Principal | Suite possible | Navigation, contact |
| FLOW-004 — Vérifier le parcours et obtenir le CV | Entrée | — | Entrée possible | Principal | Pied de page, téléchargement |
| FLOW-005 — Contacter Costa | Entrée | Sortie possible | Sortie conditionnelle | Sortie principale | Pied de page |
| FLOW-006 — Changer de langue | Oui | Oui | Oui | Oui | Sélecteur global |
| FLOW-007 — Réduire le mouvement | Oui | Oui | Oui | Oui | Contrat transversal |

## 8. PAGE-001 — Accueil

### Nom et rôle

**Accueil / Home.** Présenter immédiatement Costa comme développeur full-stack créatif, démontrer une personnalité visuelle maîtrisée et orienter prioritairement vers les projets.

### Utilisateurs et parcours

- Utilisateurs : `USER-001`, `USER-002` et tout visiteur.
- Parcours : `FLOW-001`, puis entrées vers `FLOW-002`, `FLOW-003`, `FLOW-004`, `FLOW-005`, `FLOW-006` et `FLOW-007`.

### Entrées et sorties

- Entrées : arrivée principale, lien de CV ou candidature, signature globale, retour d'une autre page.
- Sortie principale : PAGE-002 Projets.
- Sorties secondaires : PAGE-003 SideQuest depuis son aperçu, PAGE-004 À propos, CV, email, LinkedIn et GitHub.

### Hiérarchie de contenu

1. **Hero créative**
   - nom de Costa ;
   - titre professionnel dans la langue active ;
   - proposition de valeur concise ;
   - action principale « Découvrir mes projets » vers PAGE-002 ;
   - action secondaire « À propos » vers PAGE-004.
2. **Sélection de projets**
   - aperçu éditorial de SideQuest comme unique suggestion V1 ;
   - mention visible « mock fictif — application non réalisée » ;
   - image, année et type principal lorsque disponibles ;
   - activation de l'aperçu SideQuest vers PAGE-003 ;
   - la hero conserve l'accès principal à PAGE-002, que cette section ne remplace pas.
3. **Aperçu du profil**
   - biographie courte ou angle personnel ;
   - résumé du positionnement et de la manière de travailler ;
   - accès à PAGE-004.
4. **Bandeau des stacks**
   - aperçu synthétique des technologies et compétences principales ;
   - contenu informatif, sans créer de filtre ou de destination inexistante.
5. **Pied de page global**

### États et récupération

- **Chargement :** le nom, le titre et les actions restent disponibles sans attendre les médias ou animations de la hero.
- **Projet indisponible :** la sélection explique l'indisponibilité sans carte cassée et conserve les accès au profil et au contact.
- **Erreur de média :** le contexte textuel et l'action restent utilisables.
- **CV ou contact indisponible :** le contrôle concerné est masqué ou annoncé comme temporairement indisponible ; les autres moyens restent présents.

### Responsive

- La proposition de valeur et l'action principale précèdent les éléments décoratifs sur petit écran.
- Les deux actions de la hero restent visibles et opérables sans débordement horizontal.
- L'unique projet conserve une présence éditoriale forte sans simuler une grille incomplète.
- Le bandeau de stacks se réorganise ou défile seulement si toutes les informations restent accessibles sans geste précis obligatoire.

### Accessibilité

- Un seul titre principal décrit la page et le positionnement.
- La créativité de la hero ne modifie pas l'ordre logique de lecture.
- Aucun texte ou contrôle n'est masqué tant qu'une animation n'a pas été jouée.
- Les stacks ne sont pas communiquées par des logos seuls lorsque leur nom est utile.

### Métadonnées et SEO

- Titre FR : `Costa Maskulov — Développeur full-stack créatif`.
- Titre EN : `Costa Maskulov — Creative Full-Stack Developer`.
- Description : synthèse localisée du positionnement et de la valeur du portfolio.
- Données de partage : identité, titre localisé et visuel de portfolio honnête, sans présenter SideQuest comme une réalisation.

### Dépendances

Introduction bilingue, aperçu de profil, liste de stacks, visuel SideQuest et moyens de contact à fournir ou finaliser (`DEP-001` à `DEP-006`).

## 9. PAGE-002 — Projets

### Nom et rôle

**Projets / Projects.** Présenter la collection de projets de manière éditoriale, transparente et évolutive, sans faux remplissage ni mécanisme de catalogue inutile.

### Utilisateurs et parcours

- Utilisateurs : `USER-001`, `USER-002` et tout visiteur.
- Parcours : principal pour `FLOW-002`, transition entre `FLOW-001` et `FLOW-003`, avec `FLOW-005` à `FLOW-007` disponibles.

### Entrées et sorties

- Entrées : action principale de l'accueil, navigation globale ou URL directe.
- Sortie principale : PAGE-003 du projet choisi.
- Sorties secondaires : PAGE-001, PAGE-004 et moyens globaux de contact.

### Hiérarchie de contenu

1. Titre et courte introduction à la sélection.
2. Mention de transparence contextualisant SideQuest dès que nécessaire.
3. Collection éditoriale :
   - une présentation large de SideQuest en V1 ;
   - nom, image d'aperçu, année et un type principal ;
   - mention « mock fictif — application non réalisée » avant toute ambiguïté ;
   - action claire vers son détail.
4. Pied de page global.

### Évolution prévue

- La collection peut devenir une Bento Grid lorsque plusieurs projets réels existent.
- Chaque bloc conserve une destination claire et une hiérarchie compréhensible indépendamment de sa taille visuelle.
- Les filtres et tris restent hors V1 et nécessitent un nouveau cadrage avant ajout.

### États et récupération

- **Un seul projet :** état normal V1, traité comme une sélection éditoriale et non comme une liste incomplète.
- **Collection vide :** explication honnête, accès à À propos et aux contacts ; aucun faux projet n'est généré.
- **Aperçu indisponible :** alternative textuelle et accès au détail conservés si le contenu est publiable.
- **Projet non publiable :** entrée retirée plutôt que laissée cassée.

### Responsive

- La composition à un projet occupe l'espace utile sans créer de colonne vide.
- Une future Bento Grid se replie dans un ordre éditorial cohérent défini par le contenu, pas uniquement par la position desktop.
- Nom, statut fictif, année, type et action restent visibles sans survol.

### Accessibilité

- La collection utilise une structure de liste ou équivalente annoncée correctement.
- Chaque entrée possède un nom accessible distinct ; l'image n'est pas le seul moyen d'ouvrir le détail.
- Le statut fictif appartient au contenu textuel et ne repose pas sur un badge coloré seul.
- L'ordre de focus suit l'ordre éditorial de la collection.

### Métadonnées et SEO

- Titre et description localisés présentant une sélection de projets.
- La page reste indexable avec un seul projet.
- Les données structurées éventuelles ne qualifient pas SideQuest comme produit livré ou mission réelle.

### Dépendances

Nom, année, type principal, aperçu et formulation bilingue de transparence pour SideQuest (`DEP-001`, `DEP-002`, `DEP-006`).

## 10. PAGE-003 — Détail d'un projet

### Nom et rôle

**Détail projet / Project detail.** Donner à chaque projet une adresse partageable et présenter son contexte, ses informations et ses médias sans attribuer de preuve inexistante à SideQuest.

### Utilisateurs et parcours

- Utilisateurs : `USER-001`, `USER-002` et tout visiteur.
- Parcours : principal pour `FLOW-003`, avec sorties vers `FLOW-002`, `FLOW-004`, `FLOW-005`, `FLOW-006` et `FLOW-007`.

### Entrées et sorties

- Entrées : PAGE-002, URL partagée, lien interne secondaire.
- Sorties : retour à PAGE-002, autre détail réel lorsqu'une suggestion existe, PAGE-004, email, LinkedIn et navigation globale.

### Hiérarchie de contenu

Un en-tête sémantique compact fournit le nom du projet et, pour SideQuest, sa mention de transparence avant tout contenu ambigu. Le carrousel reste le premier grand bloc de contenu visuel.

1. **Carrousel de médias**
   - images accompagnées d'un contexte et d'alternatives adaptés ;
   - position courante et commandes précédente, suivante, pause et lecture ;
   - nature mockée des visuels SideQuest toujours compréhensible.
2. **Métadonnées disponibles**
   - type principal et types complémentaires pertinents ;
   - année ;
   - rôle pour les projets réellement réalisés uniquement ;
   - aucun champ « Rôle », même vide ou désactivé, pour SideQuest.
3. **Description**
   - contexte et contenu du projet ;
   - pour SideQuest, concept et hypothèses formulés comme démonstration, jamais comme décisions exécutées ou résultats obtenus.
4. **Stacks**
   - technologies réellement utilisées pour un projet réel ;
   - pour SideQuest, stacks uniquement illustratives et explicitement contextualisées comme telles.
5. **Liens réels éventuels**
   - GitHub, démo ou prototype uniquement lorsqu'une ressource réelle existe ;
   - aucun emplacement interactif fictif.
6. **Fin de page conditionnelle**
   - si d'autres projets existent : suggestions pertinentes menant vers leurs détails ;
   - sinon : invitation à contacter Costa avec email et LinkedIn de priorité équivalente ;
   - en V1 SideQuest : invitation de contact, sans prétendre qu'une page Contact existe.
7. Pied de page global.

### Comportement du carrousel

- En mode standard, l'autoplay avance toutes les cinq secondes.
- Toute interaction par pointeur, clavier ou geste tactile le suspend temporairement.
- Il reprend après huit secondes d'inactivité uniquement si le carrousel n'a plus le focus, n'est plus survolé et n'a pas été mis en pause explicitement.
- La commande « Pause / Lecture » conserve une pause explicite sans limite de temps pendant la consultation du détail.
- Avec `prefers-reduced-motion: reduce`, l'autoplay est désactivé dès le chargement et la navigation reste manuelle.

### Règles conditionnelles du modèle projet

| Élément | SideQuest V1 | Futur projet réel |
|---|---|---|
| Statut de mock | Obligatoire et visible | Absent sauf situation réellement équivalente |
| Type | Présent s'il est défini honnêtement | Présent |
| Année | Présente si elle correspond au mock publié | Présente |
| Rôle | Entièrement absent | Présent si documenté |
| Stacks | Illustratives et contextualisées | Technologies réellement utilisées |
| GitHub, démo, prototype | Absents | Affichés seulement si les URL existent |
| Résultats et métriques | Absents | Affichés seulement si vérifiables |
| Fin de page V1 | Invitation email et LinkedIn | Suggestions si disponibles, sinon invitation de contact |

### États et récupération

- **Chargement des médias :** le titre, le statut, les métadonnées et la description restent consultables.
- **Média indisponible :** le média concerné fournit une alternative ou est retiré ; le carrousel et le texte restent utilisables.
- **Projet introuvable :** passage vers SYS-001 dans la langue active avec retour à la collection.
- **Contenu traduit absent :** aucune langue n'est mélangée silencieusement ; une explication et une destination valide sont proposées.
- **Aucune suggestion :** état normal déclenchant l'invitation de contact, pas un état vide.
- **Contact indisponible :** seul le moyen vérifié reste proposé ; aucun succès externe n'est simulé.

### Responsive

- Le nom et la mention de transparence précèdent le carrousel dans l'ordre de lecture sur tout viewport.
- Les commandes du carrousel restent atteignables et suffisamment espacées sur écran tactile.
- Les métadonnées se replient sans perdre leur relation libellé–valeur.
- Les médias conservent un ratio maîtrisé sans imposer de débordement horizontal.
- La fin conditionnelle garde une action principale évidente même en disposition verticale.

### Accessibilité

- Un titre principal nomme le projet ; la mention de mock est annoncée avant les descriptions ambiguës.
- Le carrousel possède un nom, une position compréhensible, des commandes nommées et une navigation clavier complète.
- Les changements automatiques ne déplacent jamais le focus et peuvent être arrêtés durablement.
- Les alternatives textuelles distinguent médias informatifs et décoratifs.
- Les métadonnées utilisent une structure sémantique qui conserve les associations entre libellés et valeurs.
- Les suggestions et contacts possèdent des intitulés explicites indépendants de leur apparence.

### Métadonnées et SEO

- Titre localisé combinant le nom du projet et Costa Maskulov.
- Description localisée indiquant explicitement la nature de mock pour SideQuest.
- URL canonique et équivalents linguistiques pour chaque projet publié.
- Visuel de partage SideQuest accompagné d'un texte qui n'insinue pas une réalisation réelle.

### Dépendances

Contenu bilingue, année, type, stacks illustratives, médias et légendes SideQuest (`DEP-001`, `DEP-002`, `DEP-006`) ; coordonnées vérifiées pour la fin de page (`DEP-005`).

## 11. PAGE-004 — À propos

### Nom et rôle

**À propos / About.** Relier la personnalité de Costa, sa formation, ses expériences, ses compétences et sa manière de travailler afin d'aider un recruteur à évaluer son profil puis à obtenir le bon CV ou à le contacter.

### Utilisateurs et parcours

- Utilisateurs : principalement `USER-001`, puis `USER-002`.
- Parcours : principal pour `FLOW-004`, avec `FLOW-005`, `FLOW-006` et `FLOW-007` ; sortie possible vers `FLOW-002`.

### Entrées et sorties

- Entrées : navigation globale, hero ou aperçu de profil de PAGE-001, détail projet, URL directe.
- Sorties : CV de la langue active, email, LinkedIn, GitHub, PAGE-002 et navigation globale.

### Hiérarchie de contenu

1. **Introduction personnelle**
   - biographie et positionnement dans la langue active ;
   - éléments de personnalité pertinents pour comprendre le profil.
2. **Timeline unifiée**
   - formation et expériences professionnelles ou petits emplois pertinents dans une seule chronologie ;
   - chaque entrée distingue explicitement sa catégorie, sa période, son contexte et les informations utiles ;
   - les événements sont ordonnés du plus récent au plus ancien.
3. **Stacks et compétences**
   - compétences techniques et transversales regroupées de manière compréhensible ;
   - distinction entre maîtrise, pratique et simple familiarité si le contenu final le nécessite.
4. **Manière de travailler**
   - principes, collaboration, qualité, raisonnement et sensibilité UI/UX ;
   - formulations concrètes sans promesse non démontrable.
5. **CV**
   - téléchargement direct du CV correspondant à la langue active ;
   - langue et format annoncés avant activation.
6. **Prise de contact**
   - email visible, copiable et actionnable ;
   - LinkedIn de priorité équivalente ;
   - GitHub pour approfondir l'évaluation technique.
7. Pied de page global.

### États et récupération

- **Contenu de timeline incomplet :** l'information manquante reste une dépendance éditoriale et n'est pas inventée.
- **CV indisponible :** aucun téléchargement cassé ; l'indisponibilité est annoncée et les contacts restent accessibles.
- **Copie de l'email réussie :** retour bref annoncé sans déplacer le focus.
- **Copie impossible :** l'adresse reste sélectionnable manuellement.
- **Profil externe indisponible :** le lien concerné est retiré jusqu'à vérification ; les autres moyens restent disponibles.

### Responsive

- La timeline conserve un ordre de lecture linéaire ; sa compréhension ne dépend pas d'une alternance gauche–droite.
- Les périodes, catégories et descriptions restent associées sur petit écran et au zoom.
- Les stacks se réorganisent sans réduire les noms à des icônes ambiguës.
- Le CV et les contacts restent atteignables sans être repoussés derrière une interaction cachée.

### Accessibilité

- La page possède un titre principal et des titres de section navigables.
- La timeline utilise une liste sémantique ; ses éléments décoratifs sont ignorés des technologies d'assistance.
- Les catégories « Formation » et « Expérience » ne sont pas distinguées par la couleur seule.
- L'action CV annonce le document, sa langue et son format.
- Tout retour de copie de l'email est annoncé dans une zone de statut appropriée.

### Métadonnées et SEO

- Titre et description localisés présentant le parcours et le positionnement de Costa.
- Les informations professionnelles essentielles restent cohérentes avec le CV de la langue active.
- Les données structurées personnelles éventuelles n'exposent que des informations publiques validées.

### Dépendances

Biographie, chronologie formation–expériences, stacks, compétences, manière de travailler (`DEP-003`), CV FR/EN (`DEP-004`), coordonnées et profils vérifiés (`DEP-005`), traduction et relecture (`DEP-006`).

## 12. SYS-001 — Page introuvable

Cette destination technique ne crée pas une cinquième page éditoriale. Elle fournit dans la langue active :

- un titre expliquant que la destination n'existe pas ;
- un retour vers l'accueil ;
- un accès à la collection de projets ;
- la navigation et le changement de langue lorsqu'un équivalent cohérent existe ;
- aucune redirection silencieuse en boucle.

Elle n'est pas indexable et conserve un ordre de focus simple.

## 13. États transversaux

| État | Contrat commun |
|---|---|
| Normal | Contenu, navigation, langue et actions correspondent à la destination demandée. |
| Chargement | Le contenu textuel disponible n'attend pas les médias ou animations ; aucune information essentielle ne dépend d'un squelette animé. |
| Vide | Un état honnête remplace les données absentes et propose une issue vers le profil, les projets ou le contact. |
| Erreur | Un message contextualisé explique l'échec et propose une reprise ou une destination valide. |
| Succès | Réservé aux actions nécessitant un retour, comme la copie de l'email ; la navigation ordinaire n'affiche pas de succès artificiel. |
| Indisponible | Un lien sans destination réelle est masqué ou remplacé par une information non interactive explicite. |
| Permission refusée | Non applicable aux pages V1, qui ne demandent ni compte ni permission applicative. |

## 14. Règles responsive communes

- Les pages restent utilisables sans débordement horizontal non intentionnel sur mobile, tablette et desktop.
- L'ordre DOM suit la priorité de lecture et reste cohérent lorsque la composition visuelle change.
- Navigation, langue, carrousel, CV et contacts restent disponibles sur écran tactile et au zoom.
- Les compositions créatives ou asymétriques se replient sans masquer ni dupliquer une information essentielle.
- Aucun contenu principal ne dépend du survol ; les actions disposent d'un équivalent tactile et clavier.

## 15. Règles d'accessibilité communes

- Structure avec en-tête, navigation, contenu principal et pied de page identifiables.
- Un titre principal unique et une hiérarchie de titres cohérente par page.
- Lien d'évitement vers le contenu principal.
- Ordre de lecture et de focus prévisible, focus visible et cibles opérables au clavier.
- Noms accessibles explicites pour la langue, les contacts, le CV, le carrousel et les projets.
- Contrastes et tailles de cibles conformes à l'objectif WCAG 2.2 AA à vérifier en design puis en qualité.
- Aucun contenu indispensable transmis par la couleur, une icône, un mouvement ou un son seul.
- Avec `prefers-reduced-motion: reduce`, les entrées et transitions non essentielles sont supprimées ou fortement réduites et les carrousels restent manuels.
- Les changements d'état utiles sont annoncés sans créer de bruit excessif pour le lecteur d'écran.

## 16. Contenus et dépendances avant la maquette finale

| Dépendance | Pages concernées | Impact |
|---|---|---|
| Contenu, type, année et description SideQuest | PAGE-001, PAGE-002, PAGE-003 | Nécessaires pour finaliser la hiérarchie éditoriale et les métadonnées. |
| Visuels, légendes et alternatives SideQuest | PAGE-001, PAGE-002, PAGE-003 | Nécessaires pour composer et valider les médias sans fausse attribution. |
| Biographie, timeline, stacks et manière de travailler | PAGE-001, PAGE-004 | Nécessaires pour le contenu final du profil. |
| CV français et anglais | PAGE-001, PAGE-004, pied de page | Nécessaires pour publier les téléchargements. |
| Email, LinkedIn et GitHub | PAGE-001, PAGE-003, PAGE-004, pied de page | Nécessaires pour publier et vérifier les sorties externes. |
| Rédaction et relecture bilingues | Toutes | Nécessaires pour valider la parité de contenu. |

Ces dépendances ne bloquent pas la validation de l'architecture des pages, mais elles bloquent la maquette finale ou l'implémentation des contenus concernés.

## 17. Questions ouvertes non bloquantes

- Quel contenu exact et quelle année honnête seront attribués au mock SideQuest ?
- Quels visuels composeront son carrousel et quelles légendes expliqueront leur nature ?
- Quels contenus de stacks seront prioritaires dans le bandeau d'accueil et développés sur À propos ?
- Qui rédigera et qui relira les versions française et anglaise ?

Ces questions influencent le contenu et la maquette, mais ne créent aucune destination ou transition supplémentaire.

## 18. Critères de validation

L'architecture peut être validée si Costa confirme que :

- les quatre pages et leurs responsabilités correspondent à la V1 ;
- la navigation globale et les URL bilingues rendent chaque destination atteignable et partageable ;
- l'accueil respecte la séquence hero, projets, profil et stacks avec la priorité donnée à la collection ;
- la page Projets assume SideQuest comme unique sélection et prépare une future Bento Grid sans faux remplissage ;
- le détail place les métadonnées avant la description, masque entièrement le rôle pour SideQuest et termine par l'invitation de contact en l'absence d'autres projets ;
- la page À propos utilise une timeline unifiée et place le récit avant le CV et le contact ;
- chaque parcours `FLOW-001` à `FLOW-007` dispose d'une entrée, d'une sortie et d'une récupération cohérentes ;
- les priorités responsive, accessibles, bilingues et de réduction du mouvement sont suffisantes pour guider l'inventaire des composants et Figma ;
- les questions restantes n'empêchent pas la maquette de commencer une fois l'inventaire des composants validé.

## 19. Historique

| Version | Date | État | Évolution |
|---|---|---|---|
| 0.1.0 | 2026-09-15 | Validé | Première architecture complète issue du PRD v0.2.1 et des parcours v0.3.1 ; version approuvée explicitement sans réserve par Costa. |
