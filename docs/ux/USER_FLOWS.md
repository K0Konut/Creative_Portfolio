# Parcours utilisateurs — Portfolio de Costa Maskulov

## 1. Métadonnées

| Champ | Valeur |
|---|---|
| Produit | Portfolio personnel de Costa Maskulov |
| Version | 0.2.0 |
| Statut | Validé |
| Dernière mise à jour | 2026-09-14 |
| Date de validation | 2026-09-14 |
| Périmètre | V1 bilingue français–anglais |
| Source produit | `docs/product/PRD.md` v0.2.1 validé le 2026-09-14 |
| Source complémentaire | Entretien de revue des parcours avec Costa, 2026-09-14 |
| Responsable de validation | Costa Maskulov |

## 2. Finalité et périmètre

Ce document décrit les parcours critiques permettant à un visiteur de comprendre le positionnement de Costa, d'examiner la présentation du projet fictif SideQuest, de vérifier son parcours, de télécharger son CV, de le contacter, de changer de langue et de consulter le site avec moins de mouvement.

Les parcours couvrent en priorité `USER-001` — recruteur technique ou généraliste. Ils couvrent aussi tout visiteur lorsque le besoin ne dépend pas d'un rôle particulier et peuvent servir à `USER-002` — responsable technique ou membre d'une équipe produit — dans les limites du contenu disponible en V1. `USER-003` — client potentiel — reste hors du périmètre prioritaire de cette version.

Les parcours restent au niveau des intentions, réponses observables, décisions et sorties. Le placement exact des actions, la navigation détaillée, les routes et la composition des pages seront décidés dans `docs/ux/PAGE_ARCHITECTURE.md` après validation de ce document.

## 3. Règles transversales validées

- Tout le contenu de la V1 est public ; aucun compte, rôle applicatif ou consentement n'est requis.
- Toute nouvelle visite commence en français. Un changement vers l'anglais reste actif pendant la visite en cours, mais n'est pas mémorisé pour une visite ultérieure.
- Les mêmes informations essentielles et les mêmes capacités sont disponibles en français et en anglais.
- SideQuest est toujours présenté comme un « mock fictif — application non réalisée » ou une formulation strictement équivalente dans la langue active.
- Aucun faux client, rôle, dépôt, prototype, déploiement, résultat utilisateur, résultat commercial ou raisonnement présenté comme réellement exécuté n'est attribué à SideQuest.
- Aucun contrôle actif ne mène vers une ressource SideQuest inexistante.
- L'email et LinkedIn sont proposés comme moyens de contact de priorité équivalente, sans page Contact dédiée. GitHub sert principalement à l'évaluation technique.
- L'adresse email est visible et copiable en plus de l'action permettant d'écrire directement.
- Chaque projet possède une adresse directe et partageable qui fournit le contexte nécessaire sans passage préalable par l'accueil ou la collection.
- La collection V1 présente, pour chaque projet, son nom, une image d'aperçu, son année et un seul type principal. Les types complémentaires apparaissent dans le détail.
- Aucun tri ni filtre n'est proposé dans la collection V1 limitée à SideQuest.
- Le détail commence par un carrousel, puis présente la description, les stacks, le rôle et l'année. Les liens GitHub et démo ne sont affichés que lorsqu'ils existent réellement.
- Le carrousel automatique fournit une commande « Pause / Lecture » permettant un arrêt durable en plus de sa navigation manuelle.
- Le téléchargement du CV intervient après la présentation du parcours et fournit directement le fichier correspondant à la langue active.
- Les animations ne conditionnent ni la compréhension ni l'accès à une action ; la préférence système `prefers-reduced-motion` est respectée.
- Les actions principales restent utilisables au clavier, avec un focus visible et un nom accessible compréhensible.
- Aucun parcours ne dépend d'analytics, de cookies marketing ou d'un suivi comportemental.

## 4. Vue d'ensemble et traçabilité

| ID | Priorité | Acteur principal | Objectif | Entrée logique | Sortie logique | Sources principales |
|---|---|---|---|---|---|---|
| FLOW-001 | Critique | `USER-001` | Comprendre le positionnement et commencer l'exploration des projets | Arrivée directe sur le portfolio | `FLOW-002` | `FEAT-001`, `FR-001`, `FR-002` |
| FLOW-002 | Critique | `USER-001` | Comprendre l'offre de projets malgré un catalogue limité à un mock | Accès à la collection de projets | `FLOW-003` | `FEAT-002`, `FR-003`, `FR-004`, `FR-005` |
| FLOW-003 | Critique | Visiteur | Examiner la structure d'une étude de cas sans confondre le mock avec une réalisation | Sélection de SideQuest | Poursuite vers le profil, le CV ou le contact | `FEAT-003`, `FEAT-009`, `FR-005` à `FR-008`, `FR-015` |
| FLOW-004 | Critique | `USER-001` | Vérifier le parcours de Costa et récupérer le bon CV | Besoin d'approfondir le profil | CV correspondant à la langue téléchargé | `FEAT-004`, `FEAT-006`, `FR-009`, `FR-012` |
| FLOW-005 | Critique | `USER-001` | Contacter Costa ou consulter ses profils publics | Intention d'échanger ou d'approfondir le profil | Moyen externe choisi ouvert | `FEAT-007`, `FR-013` |
| FLOW-006 | Transversal critique | Visiteur | Continuer la consultation dans l'autre langue | Changement de langue depuis une destination V1 | Destination logique équivalente dans la langue choisie | `FEAT-005`, `FR-010`, `FR-011` |
| FLOW-007 | Transversal critique | Visiteur | Accéder à la même information avec moins de mouvement | Préférence système de réduction du mouvement | Parcours poursuivi sans animation gênante | `FEAT-010`, `FR-016`, `NFR-005` |

## 5. FLOW-001 — Comprendre le positionnement et commencer l'exploration des projets

### Acteur et objectif

- **Acteur :** `USER-001` — recruteur technique ou généraliste.
- **Objectif :** comprendre rapidement qui est Costa, sa spécialité et la valeur de son profil, puis commencer l'exploration de ses projets.

### Préconditions et déclencheur

- **Préconditions :** le portfolio public est accessible ; une langue active est déterminée ; le contenu d'introduction correspondant est disponible.
- **Déclencheur :** le recruteur arrive directement sur le portfolio depuis un CV, une candidature, un profil public ou un lien partagé.

### Étapes principales

1. Le recruteur arrive sur le portfolio sans contexte supplémentaire obligatoire.
2. Le système présente immédiatement le nom de Costa, son positionnement full-stack créatif et une proposition de valeur compréhensible dans la langue active.
3. Le recruteur identifie une action lui permettant d'examiner le travail présenté sans devoir ouvrir un menu.
4. Le recruteur choisit d'explorer les projets.
5. Le système conserve la langue active et conduit vers la collection afin de laisser le recruteur choisir le projet qu'il souhaite examiner.

### Décisions et embranchements

- **Explorer la collection :** le parcours principal rejoint `FLOW-002`.
- **Approfondir d'abord le profil :** le recruteur peut rejoindre `FLOW-004` sans perdre l'accès aux projets.
- **Contacter directement Costa :** le recruteur peut rejoindre `FLOW-005`.

### Variantes

- Le recruteur arrive depuis un appareil mobile, une tablette ou un ordinateur ; l'ordre logique et les actions essentielles restent identiques.
- Le recruteur change de langue avant d'explorer ; `FLOW-006` s'applique, puis le présent parcours reprend au même objectif.
- Le recruteur abandonne après avoir compris le positionnement ; aucune donnée n'est collectée et aucune confirmation n'est requise.

### Erreurs et sorties d'échec

- **Introduction ambiguë ou incomplète :** l'objectif n'est pas atteint ; le contenu doit être corrigé avant validation UX/UI.
- **Accès au projet indisponible :** le système ne présente pas une action sans issue ; il conserve l'accès aux autres informations utiles et rend l'indisponibilité compréhensible.
- **Animation lente ou défaillante :** le contenu et les actions restent disponibles sans attendre la fin d'un effet.

### Résultat attendu

Le recruteur peut reformuler le positionnement de Costa et a atteint la collection ou une autre destination utile sans confusion.

### Données ou permissions nécessaires

- Nom, titre professionnel et proposition de valeur dans les deux langues.
- Métadonnées minimales permettant d'identifier SideQuest comme mock.
- Aucune permission utilisateur.

### Accessibilité

- Le nom, le positionnement et l'accès au projet sont présents dans l'ordre de lecture et annoncés correctement par un lecteur d'écran.
- L'action principale est atteignable au clavier, possède un focus visible et ne dépend ni du survol ni d'une animation.
- Le zoom, le reflow et la réduction du mouvement ne masquent aucune information essentielle.

### Éléments liés

`OBJ-003`, `OBJ-005`, `FEAT-001`, `FR-001`, `FR-002`, `FR-016`, `AC-FR-001-01`, `NFR-001`, `NFR-002`, `NFR-006`, `NFR-011`, `FLOW-002`, `FLOW-004`, `FLOW-005`, `FLOW-006`, `FLOW-007`.

### Questions ouvertes

Aucune décision produit bloquante pour ce parcours. La destination principale est la collection de projets.

## 6. FLOW-002 — Comprendre la collection limitée et ouvrir SideQuest

### Acteur et objectif

- **Acteur :** `USER-001` — recruteur technique ou généraliste.
- **Objectif :** comprendre qu'un seul contenu de démonstration est disponible en V1, identifier sa nature fictive et décider de l'examiner.

### Préconditions et déclencheur

- **Préconditions :** les métadonnées et le contenu introductif de SideQuest sont disponibles dans la langue active.
- **Déclencheur :** le recruteur choisit d'explorer les projets depuis `FLOW-001` ou rejoint directement la collection.

### Étapes principales

1. Le système présente la collection réelle de la V1 sans simuler d'autres entrées, pagination, compteur ou catalogue plus vaste.
2. Le recruteur identifie le nom SideQuest, son image d'aperçu, son année et son type principal avant d'en ouvrir le détail.
3. Le système expose exactement la mention « Mock fictif — application non réalisée » avant tout contenu susceptible d'être interprété comme une preuve de réalisation.
4. Le recruteur choisit d'ouvrir SideQuest sans être distrait par des contrôles de tri ou de filtrage inutiles dans cette collection à un seul élément.
5. Le système conserve la langue active et rejoint `FLOW-003` sur une adresse directe et partageable.

### Décisions et embranchements

- **Ouvrir SideQuest :** poursuite vers `FLOW-003`.
- **Ne pas ouvrir SideQuest :** le recruteur peut poursuivre vers le profil, le CV ou le contact.
- **Changer de langue :** `FLOW-006` s'applique tout en conservant l'objectif d'exploration.

### Variantes

- Un accès direct à la collection produit le même état honnête à un seul élément qu'un accès depuis l'introduction.
- Pendant le chargement de l'image d'aperçu, un skeleton occupe son emplacement sans masquer les informations textuelles.
- Si le chargement de l'image échoue, un fond gris stable la remplace et le projet reste disponible.
- Un seul type principal est affiché dans la collection ; les autres domaines éventuels sont réservés au détail.

### Erreurs et sorties d'échec

- **Statut fictif ambigu :** le parcours échoue ; SideQuest ne doit pas pouvoir être ouvert depuis une présentation qui laisse croire à un projet réalisé.
- **Données SideQuest indisponibles :** le système présente un état explicite et permet de rejoindre les autres contenus ; il n'affiche ni carte vide trompeuse ni faux projet de remplacement.
- **Média en chargement :** le skeleton indique l'attente sans bloquer le nom, l'année, le type principal ou l'accès au projet.
- **Média indisponible :** un fond gris remplace l'image ; l'identité, le contexte et la nature de mock restent compréhensibles sous forme textuelle.

### Résultat attendu

Le recruteur sait qu'il consulte une collection V1 limitée à un mock de démonstration et ouvre SideQuest sans l'interpréter comme une réalisation réelle.

### Données ou permissions nécessaires

- Nom, image d'aperçu, année, type principal et mention de transparence de SideQuest dans les deux langues.
- Aucune permission utilisateur.

### Accessibilité

- La mention de transparence appartient au contenu lisible et annoncé ; elle ne repose pas uniquement sur une couleur, une icône ou une animation.
- L'entrée SideQuest et son action sont identifiables et activables au clavier.
- Le texte alternatif ou le contexte adjacent des médias décrit leur rôle sans les présenter comme des captures d'un produit fonctionnel.

### Éléments liés

`OBJ-001`, `FEAT-002`, `FEAT-003`, `FEAT-009`, `FR-003`, `FR-004`, `FR-005`, `FR-015`, `AC-FR-003-01`, `AC-FR-005-01`, `AC-FR-015-01`, `RISK-001`, `RISK-002`, `FLOW-001`, `FLOW-003`, `FLOW-006`, `FLOW-007`.

### Questions ouvertes

- L'année et le type principal définitifs de SideQuest restent à fournir avec son contenu. Ils ne bloquent pas la validation du parcours.

## 7. FLOW-003 — Examiner le détail SideQuest sans fausse attribution

### Acteur et objectif

- **Acteur :** tout visiteur, notamment `USER-001` et `USER-002`.
- **Objectif :** découvrir la structure prévue pour les futures études de cas tout en distinguant sans ambiguïté le contenu illustratif d'une réalisation effective de Costa.

### Préconditions et déclencheur

- **Préconditions :** le contenu illustratif SideQuest et sa mention de transparence sont disponibles dans la langue active.
- **Déclencheur :** le visiteur sélectionne SideQuest depuis la collection ou arrive sur son adresse directe.

### Étapes principales

1. Le système rappelle avant toute description ambiguë que SideQuest est un mock fictif et une application non réalisée.
2. Le visiteur parcourt d'abord un carrousel d'images accompagné d'un contexte indiquant la nature de mock des visuels.
3. Le système présente ensuite, dans l'ordre, la description du concept, les stacks illustrées, le rôle ou statut du travail et l'année pertinente.
4. Pour SideQuest, le système distingue explicitement les hypothèses de conception des faits et n'attribue aucun rôle réalisé à Costa.
5. Les liens GitHub et démo sont entièrement masqués puisqu'aucune ressource réelle correspondante n'existe.
6. Le détail se termine sans suggérer de faux autre projet ni ajouter un bloc de contact spécifique. La navigation générale reste disponible.

### Décisions et embranchements

- **Approfondir le profil :** poursuite vers `FLOW-004`.
- **Contacter Costa :** poursuite vers `FLOW-005`.
- **Changer de langue :** application de `FLOW-006` sur le même contenu logique.
- **Revenir à la collection :** retour vers la sortie de `FLOW-002` sans perdre la langue active.

### Variantes

- Le visiteur arrive directement sur le détail par une URL partagée ; la mention de transparence reste visible et compréhensible sans contexte préalable.
- Le visiteur consulte uniquement le texte ; il reçoit la même information essentielle que celui qui consulte les médias.
- Le carrousel avance automatiquement toutes les cinq secondes et fournit une navigation manuelle immédiate.
- Toute interaction par pointeur, clavier ou geste tactile met temporairement l'autoplay en pause. Il reprend après huit secondes d'inactivité uniquement si le carrousel n'a plus le focus, n'est plus survolé et n'a pas été mis en pause explicitement.
- Une commande « Pause / Lecture » permet d'interrompre l'autoplay sans limite de temps puis de le relancer volontairement. Une pause explicite n'est jamais annulée par le délai d'inactivité.
- Avec `prefers-reduced-motion`, l'autoplay est désactivé et le visiteur conserve la navigation manuelle.
- Pour un futur projet réel, plusieurs types peuvent être présentés dans le détail et les liens GitHub ou démo sont affichés seulement lorsqu'ils existent.

### Erreurs et sorties d'échec

- **Formulation assimilable à une réalisation :** le contenu concerné doit être retiré ou reformulé avant publication.
- **Lien ou ressource inexistante :** le contrôle correspondant est entièrement masqué plutôt que désactivé ou remplacé par un faux lien.
- **Média indisponible :** le contexte textuel et la structure restent consultables ; aucun média cassé ne devient une fausse preuve.
- **Autoplay indisponible :** la navigation manuelle reste fonctionnelle et toutes les images demeurent accessibles.
- **Contenu illustratif non traduit :** la version incomplète ne doit pas mélanger silencieusement les langues ; `FLOW-006` définit la récupération.

### Résultat attendu

Le visiteur comprend la structure future d'une étude de cas et peut affirmer sans hésitation que SideQuest est un mock de démonstration non développé par Costa.

### Données ou permissions nécessaires

- Contenu SideQuest bilingue, mentions de transparence, médias mockés, année, type principal, stacks illustrées et contexte associé.
- Pour les futurs projets réels : rôle, types complémentaires et URL GitHub ou démo lorsqu'elles existent.
- Aucune permission utilisateur.

### Accessibilité

- La nature fictive est exposée dans le texte et annoncée avant les passages potentiellement ambigus.
- La hiérarchie sémantique permet de parcourir les sections sans dépendre de la composition visuelle.
- Les médias informatifs disposent d'alternatives pertinentes ; les médias décoratifs ne créent pas de bruit inutile.
- Les contrôles du carrousel sont utilisables au clavier, possèdent des noms accessibles et rendent la position courante compréhensible.
- La commande « Pause / Lecture » expose son état aux technologies d'assistance et conserve le choix explicite du visiteur tant qu'il reste sur le détail.
- Aucun contenu n'est révélé uniquement par défilement animé, survol ou mouvement ; l'autoplay est désactivé lorsque la réduction du mouvement est demandée.

### Éléments liés

`OBJ-001`, `OBJ-002`, `FEAT-003`, `FEAT-009`, `FR-005`, `FR-006`, `FR-007`, `FR-008`, `FR-015`, `AC-FR-005-01`, `AC-FR-006-01`, `AC-FR-007-01`, `AC-FR-008-01`, `AC-FR-015-01`, `KPI-001`, `RISK-001`, `RISK-002`, `FLOW-002`, `FLOW-004`, `FLOW-005`, `FLOW-006`, `FLOW-007`.

### Questions ouvertes

- Le contenu détaillé, l'année, le type principal et les visuels de SideQuest restent à produire pendant la conception (`DEP-001`, `DEP-002`). Cette dépendance bloque la maquette finale, pas la validation du parcours.

## 8. FLOW-004 — Vérifier le parcours et télécharger le CV pertinent

### Acteur et objectif

- **Acteur :** `USER-001` — recruteur technique ou généraliste.
- **Objectif :** comprendre le parcours, les compétences et la manière de travailler de Costa, puis obtenir le CV correspondant à la langue de consultation.

### Préconditions et déclencheur

- **Préconditions :** la biographie, le parcours, les compétences, la méthode de travail et les deux CV sont disponibles et à jour.
- **Déclencheur :** le recruteur souhaite approfondir le profil de Costa depuis l'introduction, un projet ou un accès direct.

### Étapes principales

1. Le système présente une biographie courte dans la langue active.
2. Le recruteur découvre ensuite la formation, puis les expériences professionnelles et petits emplois pertinents.
3. Il consulte les stacks, puis la manière de travailler de Costa.
4. Après avoir parcouru ce récit, le recruteur choisit s'il souhaite télécharger le CV pour approfondir son évaluation.
5. L'action télécharge directement le fichier correspondant à la langue active et fournit un nom de fichier compréhensible.
6. Une note explicite associée à l'action, éventuellement signalée par un astérisque visuel, indique que la langue du CV suit la langue actuelle du site.

### Décisions et embranchements

- **Changer de langue avant le téléchargement :** `FLOW-006` s'applique et le CV proposé devient celui de la nouvelle langue.
- **Ne pas télécharger :** le recruteur peut poursuivre vers les projets ou `FLOW-005`.
- **Approfondir via un profil externe :** poursuite vers GitHub ou LinkedIn dans `FLOW-005`.

### Variantes

- Le recruteur accède directement aux informations de parcours sans passer par l'introduction.
- Le téléchargement reste disponible après le récit du parcours ; la règle de correspondance de langue est identique depuis toute destination où l'architecture des pages déciderait de répéter cette action.

### Erreurs et sorties d'échec

- **CV absent ou temporairement indisponible :** aucune action cassée n'est présentée ; l'indisponibilité est explicite et un moyen de contact reste accessible.
- **CV dans la mauvaise langue :** le téléchargement est considéré comme erroné et doit être corrigé avant publication.
- **Fichier illisible ou téléchargement interrompu :** le recruteur reçoit un retour compréhensible et peut réessayer ou utiliser un moyen de contact.
- **Contenu de profil incomplet :** les champs manquants restent une dépendance éditoriale visible et ne sont pas remplacés par du contenu inventé.

### Résultat attendu

Le recruteur comprend les éléments essentiels du parcours de Costa et, s'il le souhaite, obtient un CV lisible dans la langue active.

### Données ou permissions nécessaires

- Biographie, formation, expériences, petits emplois pertinents, stacks et méthode de travail dans les deux langues (`DEP-003`).
- CV français et anglais à jour (`DEP-004`).
- Aucune permission utilisateur.

### Accessibilité

- Les informations sont structurées pour une navigation par titres et une lecture linéaire cohérente.
- L'action de téléchargement indique sa finalité, sa langue et idéalement son format sans dépendre d'une icône ou d'un astérisque seul.
- La note sur la correspondance de langue est liée de façon compréhensible à l'action pour le lecteur d'écran.
- L'action est utilisable au clavier avec un focus visible et ne déclenche pas de délai animé obligatoire.

### Éléments liés

`OBJ-004`, `OBJ-005`, `FEAT-004`, `FEAT-006`, `FR-002`, `FR-009`, `FR-012`, `AC-FR-009-01`, `AC-FR-012-01`, `DEP-003`, `DEP-004`, `FLOW-001`, `FLOW-003`, `FLOW-005`, `FLOW-006`, `FLOW-007`.

### Questions ouvertes

- Les fichiers CV définitifs restent à fournir (`OPEN-006`). Leur absence bloque le contenu final et l'implémentation du téléchargement, mais pas la validation de ce parcours.

## 9. FLOW-005 — Contacter Costa ou consulter ses profils publics

### Acteur et objectif

- **Acteur :** `USER-001` — recruteur technique ou généraliste ; `USER-002` peut suivre la variante GitHub.
- **Objectif :** initier une prise de contact directe ou poursuivre l'évaluation sur un profil public pertinent.

### Préconditions et déclencheur

- **Préconditions :** l'email public et les URL LinkedIn et GitHub ont été fournis et vérifiés.
- **Déclencheur :** le visiteur souhaite contacter Costa ou approfondir son profil depuis une destination V1.

### Étapes principales

1. Le système expose l'email et LinkedIn avec une importance équivalente, sans imposer le passage par une page Contact ou un formulaire.
2. L'adresse email est visible et copiable en plus de l'action d'envoi direct.
3. Le visiteur choisit librement l'email ou LinkedIn selon ses habitudes ; GitHub reste disponible lorsqu'il souhaite plutôt approfondir l'évaluation technique.
4. Le système identifie clairement la destination avant l'activation.
5. Le service externe ou le client de messagerie prend le relais.
6. Le portfolio reste consultable si le visiteur revient après l'ouverture de la destination externe.

### Décisions et embranchements

- **Email :** le visiteur prépare un message dans son outil de messagerie.
- **Copie de l'email :** le visiteur récupère l'adresse pour l'utiliser dans l'outil de son choix.
- **LinkedIn :** le visiteur poursuit la prise de contact ou la consultation du profil sur LinkedIn.
- **GitHub :** le visiteur poursuit principalement l'évaluation technique sur GitHub.
- **Renoncer :** le visiteur continue librement la consultation du portfolio ; aucune donnée de contact n'est collectée par le site.

### Variantes

- Le visiteur atteint les moyens de contact depuis l'introduction, le profil ou le détail SideQuest.
- Le visiteur utilise un appareil sans client de messagerie configuré et copie alors l'adresse email ou choisit LinkedIn.

### Erreurs et sorties d'échec

- **Lien invalide ou profil indisponible :** la destination concernée ne doit pas rester publiée comme action fonctionnelle ; les autres moyens demeurent accessibles.
- **Aucun client de messagerie disponible :** le visiteur peut copier l'adresse ou choisir LinkedIn ; aucun formulaire V1 n'est créé comme solution de remplacement.
- **Service externe indisponible :** le portfolio ne simule pas un succès et permet de revenir au choix des autres moyens.

### Résultat attendu

Le visiteur a ouvert le moyen externe correspondant à son intention et sait qu'il a quitté ou complété le contexte du portfolio.

### Données ou permissions nécessaires

- Email public, URL LinkedIn et URL GitHub validés (`DEP-005`).
- Aucune permission utilisateur et aucune donnée saisie ou stockée par le portfolio.

### Accessibilité

- Chaque lien possède un nom accessible spécifique à sa destination.
- L'adresse email visible peut être sélectionnée et copiée sans dépendre d'un geste complexe ; tout retour de copie éventuel est annoncé de façon accessible.
- Tout changement de contexte est compréhensible ; le comportement ne dépend pas d'une icône, d'un survol ou d'un geste précis.
- Les liens sont atteignables au clavier avec un focus visible.

### Éléments liés

`OBJ-005`, `FEAT-007`, `FR-002`, `FR-013`, `AC-FR-013-01`, `DEP-005`, `FLOW-001`, `FLOW-003`, `FLOW-004`, `FLOW-006`, `FLOW-007`.

### Questions ouvertes

- Les coordonnées et URL définitives restent à fournir (`OPEN-006`). Leur absence bloque le contenu final et la vérification des liens, mais pas la validation du parcours.

## 10. FLOW-006 — Changer de langue sans perdre son objectif

### Acteur et objectif

- **Acteur :** tout visiteur.
- **Objectif :** passer du français à l'anglais, ou inversement, et poursuivre la même tâche avec un contenu essentiel équivalent.

### Préconditions et déclencheur

- **Préconditions :** une nouvelle visite commence en français ; les deux versions du contenu logique consulté existent et ont été relues ; la langue active est identifiable.
- **Déclencheur :** le visiteur choisit l'autre langue depuis l'une des destinations de la V1.

### Étapes principales

1. Le visiteur identifie la langue active et l'autre langue disponible.
2. Il active le changement de langue.
3. Le système conserve exactement la destination et le projet consultés, puis charge leur version équivalente plutôt que de renvoyer le visiteur vers l'accueil.
4. Le système met à jour les contenus essentiels, libellés, métadonnées et actions dépendantes de la langue, notamment le CV proposé.
5. Le choix reste actif pendant la visite en cours et le visiteur poursuit son objectif dans la nouvelle langue.

### Décisions et embranchements

- **Depuis l'introduction :** reprise de `FLOW-001` au même niveau logique.
- **Depuis la collection :** reprise de `FLOW-002` avec SideQuest toujours identifié comme mock.
- **Depuis SideQuest :** reprise de `FLOW-003` sur le même contenu logique.
- **Depuis le profil :** reprise de `FLOW-004` avec le CV correspondant à la nouvelle langue.

### Variantes

- Le visiteur change plusieurs fois de langue ; chaque changement produit un état cohérent et prévisible.
- Le visiteur arrive directement sur une version linguistique donnée ; il peut toujours atteindre son équivalent dans l'autre langue.
- Lors d'une nouvelle visite ultérieure, le système repart en français et ne restaure pas le choix de la visite précédente.
- Le changement intervient avec `prefers-reduced-motion` actif ; `FLOW-007` s'applique sans modifier le résultat.

### Erreurs et sorties d'échec

- **Équivalent absent :** le système ne mélange pas silencieusement les langues ; il conserve la version disponible, explique l'indisponibilité et permet de poursuivre ou revenir.
- **Destination linguistique invalide :** le visiteur revient vers une destination valide dans la langue demandée avec une explication, sans boucle ni impasse.
- **Libellé ou contenu essentiel non traduit :** la parité est considérée comme non conforme et doit être corrigée avant validation finale.
- **Mauvais CV après changement :** le téléchargement est bloqué jusqu'à rétablissement de la correspondance de langue.

### Résultat attendu

Le visiteur se trouve sur la destination logique équivalente, comprend la nouvelle langue active et peut poursuivre la même tâche sans perte d'information essentielle.

### Données ou permissions nécessaires

- Contenus, libellés, métadonnées et CV en français et en anglais.
- Correspondance entre chaque contenu logique et ses deux versions.
- État de langue limité à la visite en cours, sans mémorisation entre deux visites.
- Aucune permission utilisateur.

### Accessibilité

- Le contrôle expose le nom complet ou un libellé non ambigu de chaque langue et indique la langue active sans dépendre uniquement de drapeaux.
- Le changement met à jour la langue déclarée du document pour les technologies d'assistance.
- Le focus est géré de manière prévisible et ne disparaît pas après la transition.
- Aucun changement automatique inattendu ne se produit à la seule prise de focus.

### Éléments liés

`OBJ-006`, `FEAT-005`, `FR-010`, `FR-011`, `FR-012`, `AC-FR-010-01`, `AC-FR-011-01`, `AC-FR-012-01`, `NFR-007`, `KPI-004`, `DEP-004`, `DEP-006`, `RISK-005`, `HYP-003`, `FLOW-001` à `FLOW-005`, `FLOW-007`.

### Questions ouvertes

- La responsabilité de rédaction et de relecture de chaque langue reste à attribuer (`OPEN-005`). Elle bloque la validation éditoriale finale, pas la structure du parcours.
- La stratégie exacte d'URL permettant de partager chaque projet et son équivalent linguistique sera décidée pendant l'architecture des pages puis l'architecture technique.

## 11. FLOW-007 — Consulter le portfolio avec moins de mouvement

### Acteur et objectif

- **Acteur :** tout visiteur ayant demandé une réduction des mouvements au niveau de son système ou de son navigateur.
- **Objectif :** accéder aux mêmes contenus, décisions et résultats sans animation gênante ni information dépendante du mouvement.

### Préconditions et déclencheur

- **Préconditions :** la préférence `prefers-reduced-motion` est disponible pour le navigateur ; chaque contenu animé possède un état lisible sans mouvement non essentiel.
- **Déclencheur :** le visiteur charge le portfolio avec la préférence active ou l'active pendant sa consultation.

### Étapes principales

1. Le système détecte la préférence de réduction du mouvement.
2. Il supprime ou réduit fortement les animations non indispensables avant qu'elles ne retardent ou masquent le contenu.
3. Il désactive notamment l'autoplay des carrousels tout en conservant leur navigation manuelle.
4. Les changements d'état utiles restent perceptibles par des indices statiques ou des retours non dépendants du mouvement.
5. Le visiteur réalise `FLOW-001` à `FLOW-006` avec les mêmes informations et actions.
6. Toute transition conserve un résultat compréhensible sans imposer d'attente animée.

### Décisions et embranchements

- **Préférence active au chargement :** l'expérience réduite s'applique dès le premier rendu utile.
- **Préférence activée pendant la visite :** les mouvements non essentiels encore prévus sont arrêtés ou remplacés sans interrompre la tâche.
- **Préférence inactive :** la motion standard peut s'appliquer, mais reste non bloquante et subordonnée au contenu.

### Variantes

- Les médias statiques restent disponibles lorsque leur alternative animée est réduite.
- Une transition essentielle à la compréhension utilise une version brève et discrète ou un retour statique équivalent.
- Aucun contrôle interne supplémentaire de réduction du mouvement n'est proposé en V1 ; la préférence système constitue le contrat minimal validé.

### Erreurs et sorties d'échec

- **Contenu masqué sans animation :** le parcours concerné est bloqué ; le contenu doit être rendu visible indépendamment de l'effet.
- **Interaction dépendante d'un mouvement ou d'un geste :** une alternative opérable doit être fournie avant validation.
- **Préférence ignorée :** la V1 est non conforme à `NFR-005` et ne peut pas passer la validation UX/UI ou qualité.

### Résultat attendu

Le visiteur obtient les mêmes informations, actions et résultats que dans l'expérience standard, sans mouvement non essentiel ni inconfort imposé.

### Données ou permissions nécessaires

- Préférence système exposée par le navigateur.
- Aucun compte, stockage de préférence ou permission supplémentaire.

### Accessibilité

- La réduction du mouvement est appliquée avant les animations d'entrée susceptibles de masquer le contenu.
- Aucun focus, ordre de lecture, message ou action ne dépend d'une animation.
- Les changements d'état demeurent compréhensibles pour le clavier et les technologies d'assistance.

### Éléments liés

`OBJ-003`, `FEAT-010`, `FR-016`, `AC-FR-016-01`, `AC-NFR-005-01`, `NFR-004`, `NFR-005`, `RISK-004`, `FLOW-001` à `FLOW-006`.

### Questions ouvertes

Aucune décision produit bloquante pour ce parcours. Les effets concernés et leurs variantes réduites seront précisés dans les fondations motion et la maquette.

## 12. États transversaux à préserver

| État | Comportement attendu dans les parcours |
|---|---|
| Normal | Le contenu et les actions correspondent à la langue active et au périmètre réel de la V1. |
| Chargement | L'attente ne masque pas une information déjà disponible et ne dépend pas d'une animation ; les médias ne bloquent pas le contenu principal. |
| Vide | Aucun faux projet ne remplit la collection. Si SideQuest est indisponible, l'état explique la situation et conserve l'accès au profil et au contact. |
| Erreur | Le système décrit l'échec utilement, n'annonce aucun succès fictif et propose une reprise ou une autre destination valide. |
| Succès | La destination ou ressource attendue est atteinte ; aucun message artificiel n'est requis pour une navigation ordinaire. |
| Désactivé ou indisponible | Un lien SideQuest inexistant est masqué ; un CV ou moyen externe manquant ne produit pas de contrôle cassé. |
| Permission refusée | Non applicable au portfolio V1, qui ne demande aucun compte ni permission applicative. Un blocage par un service externe reste sous la responsabilité de ce service. |

## 13. Entrées pour l'architecture des pages

### Points d'entrée logiques

- Arrivée principale sur le positionnement de Costa.
- Accès direct à la collection de projets.
- Accès direct au détail SideQuest depuis un lien partagé.
- Accès direct aux informations de parcours.

### Points de sortie et transitions nécessaires

- Positionnement vers la collection, puis choix du projet par le visiteur.
- Collection vers détail SideQuest.
- Détail SideQuest sans suggestion de projet ni bloc de contact spécifique en V1 ; la navigation générale reste disponible.
- Profil vers CV, projets ou contact.
- Toute destination vers son équivalent linguistique.
- Moyens de contact et profils vers des services externes.

### Décisions structurantes transmises à la phase suivante

- L'action projet principale de l'introduction mène à la collection, jamais directement à SideQuest.
- Chaque entrée de la collection présente le nom, l'aperçu, l'année et un seul type principal ; aucun tri ni filtre n'apparaît en V1.
- Le détail est directement partageable et ordonne les contenus ainsi : carrousel, description, stacks, rôle ou statut, année, puis liens réels éventuels.
- Le changement de langue reste disponible sur les quatre destinations V1 et conserve exactement la destination logique courante.
- Le récit du profil précède le téléchargement direct du CV dans la langue active.
- L'email visible et copiable et LinkedIn possèdent une priorité équivalente, sans page Contact.
- Le détail SideQuest se termine sans recommandation artificielle tant qu'aucun autre projet réel n'existe.
- Le carrousel combine autoplay et navigation manuelle ; il s'arrête temporairement pendant l'interaction, reprend après huit secondes d'inactivité, propose une pause durable explicite et reste manuel avec réduction du mouvement.

## 14. Dépendances et questions ouvertes consolidées

| ID source | Dépendance ou question | Impact | Bloque la validation des parcours ? |
|---|---|---|---|
| `DEP-001`, `DEP-002` | Contenu et visuels SideQuest à produire | Maquette et contenu final de `FLOW-002` et `FLOW-003` | Non |
| `DEP-003` | Biographie, parcours, stack et méthode à rédiger | Contenu final de `FLOW-004` | Non |
| `DEP-004`, `OPEN-006` | CV français et anglais à fournir | Téléchargement final dans `FLOW-004` et correspondance dans `FLOW-006` | Non |
| `DEP-005`, `OPEN-006` | Email et URL LinkedIn/GitHub à fournir | Destinations finales de `FLOW-005` | Non |
| `DEP-006`, `OPEN-005` | Responsables de rédaction et de relecture à définir | Parité éditoriale de `FLOW-006` | Non |
| Contenu SideQuest | Année et type principal à confirmer | Métadonnées visibles dans `FLOW-002` et `FLOW-003` | Non |

Aucune contradiction majeure avec le PRD validé et aucune décision manquante ne bloquent la validation de la structure des parcours. Les dépendances recensées devront être résolues avant la maquette finale ou l'implémentation concernée.

## 15. Critères de validation du livrable

Le document peut être validé si Costa confirme que :

- les sept parcours couvrent les objectifs critiques de la V1 ;
- les entrées, résultats, variantes et récupérations décrivent l'expérience attendue ;
- SideQuest reste présenté honnêtement dans chaque contexte ;
- l'accueil guide d'abord vers la collection et laisse le visiteur choisir son projet ;
- le changement de langue conserve la destination exacte et propose le CV correspondant ;
- le récit du parcours précède le téléchargement direct du CV ;
- l'email copiable et LinkedIn ont une priorité équivalente, sans formulaire ni page Contact en V1 ;
- le carrousel automatique reste contrôlable manuellement, peut être mis en pause durablement et devient statique avec réduction du mouvement ;
- la préférence système de réduction du mouvement suffit comme contrat minimal V1 ;
- les décisions reportées à l'architecture des pages peuvent y être tranchées sans rouvrir le périmètre produit.

Costa a validé explicitement la version 0.2.0 sans réserve le 2026-09-14. Cette version constitue l'entrée validée de l'architecture des pages.

## 16. Intentions explicitement reportées après la V1

Les décisions suivantes ont été exprimées pendant la revue, mais ne modifient pas les parcours V1 ni le PRD v0.2.1 validé :

- ajouter en V2 un ordre alphabétique par défaut, un tri du plus récent au plus ancien et des filtres par type lorsque plusieurs projets réels seront disponibles ;
- suggérer d'autres projets à la fin d'un détail lorsqu'un catalogue réel le permet ;
- remplacer ces suggestions par une invitation à prendre contact lorsqu'aucun autre projet n'est disponible et qu'une page Contact existe ;
- proposer éventuellement en V2 un réglage manuel de réduction du mouvement en complément de la préférence système.

Ces intentions devront être cadrées dans une future mise à jour du PRD avant leur conception ou leur implémentation.

## 17. Historique

| Version | Date | État | Évolution |
|---|---|---|---|
| 0.1.0 | 2026-09-14 | Brouillon | Première formalisation de `FLOW-001` à `FLOW-007` depuis le PRD v0.2.1. |
| 0.2.0 | 2026-09-14 | Validé | Intégration de l'entretien de revue avec Costa, sécurisation du carrousel automatique pour l'accessibilité et validation explicite sans réserve. |
