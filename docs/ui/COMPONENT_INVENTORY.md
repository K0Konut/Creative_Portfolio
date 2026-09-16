# Inventaire des composants — Portfolio de Costa Maskulov

## 1. Métadonnées

| Champ | Valeur |
|---|---|
| Produit | Portfolio personnel de Costa Maskulov |
| Version | 0.2.0 |
| Statut | Validé |
| Dernière mise à jour | 2026-09-16 |
| Date de validation | 2026-09-16 |
| Périmètre | V1 bilingue français–anglais |
| Source produit | `docs/product/PRD.md` v0.2.1, validé le 2026-09-14 |
| Source UX | `docs/ux/USER_FLOWS.md` v0.3.1, validé le 2026-09-15 |
| Source pages | `docs/ux/PAGE_ARCHITECTURE.md` v0.1.1, validé le 2026-09-15 |
| Source complémentaire | Entretien d'inventaire des composants avec Costa, 2026-09-15 |
| Responsable de validation | Costa Maskulov |

## 2. Finalité et niveau d'abstraction

Ce document définit le vocabulaire de composants nécessaire pour maquetter les quatre pages V1 et la page introuvable sans ambiguïté majeure. Il décrit leurs responsabilités, compositions, variantes, états, interactions, contraintes accessibles et comportements responsive.

L'inventaire reste conceptuel : il ne choisit ni framework, ni API Vue, ni structure de fichiers, ni propriétés techniques. Les couleurs, typographies, espacements, grilles, formes, iconographies et courbes de mouvement sont définis dans `docs/ui/DESIGN_SYSTEM.md` et `docs/ui/MOTION_GUIDELINES.md` ; leur traduction visuelle sera vérifiée pendant la maquette Figma.

### Frontières confirmées

- Les composants couvrent `PAGE-001` à `PAGE-004` et `SYS-001`.
- SideQuest reste un mock fictif non réalisé et son statut doit être perceptible avant toute ambiguïté.
- La V1 ne contient ni page Contact, ni formulaire, ni filtre ou tri de projets, ni réglage manuel de réduction du mouvement.
- Le contenu, les actions et les retours essentiels existent en français et en anglais.
- Les composants animés conservent un état complet et utilisable avec `prefers-reduced-motion: reduce`.
- Une section éditoriale unique reste une composition de page lorsqu'aucune responsabilité réutilisable ne justifie un composant autonome.

## 3. Décisions confirmées pendant l'entretien

| ID | Décision |
|---|---|
| CI-DEC-001 | Sur mobile, la navigation s'ouvre dans un panneau compact plutôt que dans un menu plein écran. |
| CI-DEC-002 | Le sélecteur de langue est visible directement dans l'en-tête desktop et placé dans le panneau de navigation mobile. |
| CI-DEC-003 | L'aperçu de projet est un composant commun avec les variantes `mise en avant` et `collection`. |
| CI-DEC-004 | Les entrées de la timeline restent entièrement visibles en V1 ; une version repliable est reportée après la V1. |
| CI-DEC-005 | Le bandeau de stacks reste statique à toutes les largeurs en V1 ; il se recompose avec la grille sans défilement automatique ni duplication de contenu. |
| CI-DEC-006 | Le CV utilise un composant de mise en avant sur À propos, tandis que le pied de page contient un simple lien de téléchargement. |
| CI-DEC-007 | Un groupe de contacts est partagé entre À propos et la fin du détail projet ; le pied de page conserve de simples liens. |
| CI-DEC-008 | Le statut d'un projet est un composant métier avec une variante courte sur les aperçus et une variante explicative sur le détail. |
| CI-DEC-009 | Les métadonnées d'un projet forment un composant partagé avec une variante compacte et une variante détaillée. |
| CI-DEC-010 | Un élément de stack commun alimente le bandeau synthétique de l'accueil et la liste détaillée de la page À propos. |
| CI-DEC-011 | Le carrousel accepte uniquement des images en V1 ; la vidéo est reportée à une version future. |
| CI-DEC-012 | Le sélecteur de langue présente deux options visibles `FR` et `EN`, dont l'état actif est explicite. |
| CI-DEC-013 | Toute la surface de l'aperçu de projet constitue une cible unique, accompagnée d'un libellé d'action visible. |
| CI-DEC-014 | La manière de travailler est présentée sous forme de plusieurs principes courts et répétables. |
| CI-DEC-015 | Le carrousel combine miniatures cliquables, commandes précédente/suivante et indication textuelle de position. |
| CI-DEC-016 | Les actions du groupe de contacts utilisent une icône accompagnée d'un libellé textuel. |

Le comportement automatique du carrousel n'a pas été rouvert : le contrat validé dans les parcours et l'architecture des pages reste la source de vérité.

## 4. Vue d'ensemble

### 4.1 Design system

| ID | Nom | Responsabilité principale |
|---|---|---|
| `COMP-001` | Action | Déclencher une action ou mener vers une destination avec une hiérarchie perceptible. |
| `COMP-002` | Lien avec icône | Associer une destination ou une action à une icône et un libellé explicite. |
| `COMP-003` | Message d'état | Expliquer une indisponibilité, une erreur, un état vide ou une réussite utile. |
| `COMP-004` | Cadre média | Afficher une image avec son alternative, son ratio et sa récupération d'erreur. |

### 4.2 Layout global

| ID | Nom | Responsabilité principale |
|---|---|---|
| `COMP-101` | En-tête du site | Porter l'identité, le retour à l'accueil et l'accès à la navigation. |
| `COMP-102` | Navigation principale | Donner accès aux destinations globales et indiquer la page courante. |
| `COMP-103` | Panneau de navigation mobile | Exposer navigation et langues dans un panneau compact contrôlable. |
| `COMP-104` | Sélecteur de langue | Changer de langue sans perdre la destination logique. |
| `COMP-105` | Pied de page | Répéter les destinations, contacts et téléchargements essentiels. |

### 4.3 Features

| ID | Nom | Responsabilité principale |
|---|---|---|
| `COMP-201` | Aperçu de projet | Résumer un projet et ouvrir son détail depuis une cible unique. |
| `COMP-202` | Statut du projet | Rendre explicite la nature réelle, fictive ou future d'un projet. |
| `COMP-203` | Métadonnées du projet | Associer les informations structurées disponibles à un projet. |
| `COMP-204` | Collection de projets | Ordonner les aperçus sans simuler un catalogue plus riche qu'il ne l'est. |
| `COMP-205` | Carrousel d'images du projet | Parcourir les médias d'un projet avec contrôle manuel et automatique maîtrisé. |
| `COMP-206` | Miniature de média | Prévisualiser et sélectionner une image du carrousel. |
| `COMP-207` | Élément de stack | Nommer une technologie ou compétence sans dépendre d'un logo seul. |
| `COMP-208` | Bandeau de stacks | Présenter une sélection synthétique et statique de stacks sur l'accueil. |
| `COMP-209` | Liste de stacks | Organiser les stacks et compétences détaillées par groupes pertinents. |
| `COMP-210` | Timeline du parcours | Présenter formation et expériences dans une chronologie unifiée. |
| `COMP-211` | Entrée de timeline | Décrire un événement de parcours et sa catégorie. |
| `COMP-212` | Liste de principes de travail | Regrouper les principes courts décrivant la manière de travailler. |
| `COMP-213` | Principe de travail | Exprimer un principe autonome et concret. |
| `COMP-214` | Téléchargement du CV | Mettre en avant le CV correspondant à la langue active. |
| `COMP-215` | Groupe de contacts | Donner accès aux contacts prioritaires avec icône et libellé. |
| `COMP-216` | Contact email | Afficher, copier ou utiliser l'adresse email avec un retour accessible. |
| `COMP-217` | Fin de projet conditionnelle | Choisir entre suggestions réelles et invitation de contact. |

### 4.4 Pages et compositions

| ID | Nom | Responsabilité principale |
|---|---|---|
| `COMP-301` | Hero d'accueil | Présenter immédiatement Costa et orienter d'abord vers les projets. |
| `COMP-302` | Sélection de projet d'accueil | Mettre SideQuest en avant sans remplacer l'accès à la collection. |
| `COMP-303` | Aperçu du profil | Résumer le positionnement personnel et mener vers À propos. |
| `COMP-304` | Introduction de collection | Expliquer la sélection limitée et son statut transparent. |
| `COMP-305` | En-tête de détail projet | Nommer le projet et annoncer son statut avant les contenus ambigus. |
| `COMP-306` | Corps éditorial de projet | Ordonner description, stacks et liens réels éventuels. |
| `COMP-307` | Introduction À propos | Introduire le parcours et la personnalité avant les informations détaillées. |
| `COMP-308` | Page introuvable | Expliquer l'erreur et proposer des destinations valides. |

### 4.5 Décorations non interactives

Aucun composant décoratif autonome n'est figé à ce stade. Les éléments de la hero ou des compositions pourront être ajoutés en phase Figma uniquement s'ils ne portent aucune information indispensable, restent ignorés des technologies d'assistance et possèdent une alternative sans mouvement.

## 5. Fiches — Design system

### COMP-001 — Action

- **Catégorie :** design system.
- **Responsabilité :** matérialiser une action principale, secondaire ou discrète et rendre sa destination ou son résultat compréhensible.
- **Pages et parcours :** toutes les pages ; `FLOW-001` à `FLOW-007` selon le contexte.
- **Contenu ou données :** libellé localisé obligatoire, destination ou résultat attendu, indication externe ou téléchargeable lorsque nécessaire.
- **Composition :** libellé ; icône facultative et jamais porteuse du sens à elle seule.
- **Variantes :** principale, secondaire, textuelle, contrôle d'interface. La sémantique lien ou bouton dépend de l'intention, pas de l'apparence.
- **Tailles :** standard et compacte seulement si Figma confirme un besoin de densité ; la zone d'activation reste suffisante.
- **États :** normal, hover, focus, active et disabled uniquement lorsqu'une action momentanément indisponible doit rester perceptible. Un lien sans destination réelle est retiré plutôt que désactivé.
- **Interactions et événements conceptuels :** ouvrir une destination, télécharger une ressource ou commander une interface ; retour visible immédiat sans masquer le focus.
- **Accessibilité :** nom accessible explicite, focus visible, activation clavier native, indication compréhensible des changements de contexte.
- **Responsive :** le libellé essentiel n'est ni tronqué ni remplacé par une icône seule ; les actions prioritaires restent visibles.
- **Dépendances et réutilisation :** fondations de couleur, typographie, espacement, focus et motion ; réutilisable partout sans porter de logique métier.
- **Exclusions :** ne décide ni de la navigation, ni de la langue, ni du fichier CV, ni d'une action métier.
- **Questions ouvertes :** hiérarchie visuelle et tailles exactes à définir dans Figma.

### COMP-002 — Lien avec icône

- **Catégorie :** design system.
- **Responsabilité :** rendre une action ou destination rapidement identifiable par une icône accompagnée d'un texte.
- **Pages et parcours :** `PAGE-003`, `PAGE-004` ; `FLOW-004`, `FLOW-005`.
- **Contenu ou données :** icône reconnue, libellé localisé et destination valide.
- **Composition :** `COMP-001` dans une présentation associant icône et libellé.
- **Variantes :** externe, email, copie et téléchargement si requis hors du pied de page.
- **Tailles :** standard ; une version compacte n'est ajoutée que si la maquette la justifie sans supprimer le libellé.
- **États :** ceux de `COMP-001`, plus réussite ou erreur pour la copie.
- **Interactions et événements conceptuels :** ouvrir une ressource externe, préparer un email, copier une adresse ou télécharger un document.
- **Accessibilité :** l'icône est décorative lorsque le libellé porte déjà le sens ; tout changement de contexte est annoncé dans le nom ou le contexte.
- **Responsive :** icône et libellé restent associés et la cible conserve une taille suffisante.
- **Dépendances et réutilisation :** dépend de `COMP-001` et du set d'icônes fonctionnelles défini dans `docs/ui/DESIGN_SYSTEM.md` ; sert notamment `COMP-215` et `COMP-216`.
- **Exclusions :** ne valide pas les coordonnées ni les ressources.
- **Questions ouvertes :** aucune question structurelle.

### COMP-003 — Message d'état

- **Catégorie :** design system.
- **Responsabilité :** expliquer un état qui empêche ou modifie la consultation et proposer une récupération utile.
- **Pages et parcours :** toutes les pages ; états transversaux de `FLOW-001` à `FLOW-007`.
- **Contenu ou données :** titre ou message localisé, contexte utile et action de récupération facultative.
- **Composition :** message, éventuel `COMP-001`, illustration décorative facultative.
- **Variantes :** information, vide, erreur, indisponible et succès utile.
- **Tailles :** inline et section.
- **États :** la variante représente l'état ; un message peut lui-même apparaître ou disparaître sans transition obligatoire.
- **Interactions et événements conceptuels :** réessayer, revenir ou poursuivre vers une destination valide.
- **Accessibilité :** rôle d'alerte réservé aux erreurs urgentes ; succès de copie annoncé dans une zone de statut ; focus non déplacé sans nécessité.
- **Responsive :** texte lisible sans débordement et action disponible en disposition verticale.
- **Dépendances et réutilisation :** contenu localisé et action de récupération réelle.
- **Exclusions :** ne remplace pas un contenu absent par une promesse fictive et ne simule aucun succès externe.
- **Questions ouvertes :** ton éditorial des messages à définir avec les contenus.

### COMP-004 — Cadre média

- **Catégorie :** design system.
- **Responsabilité :** réserver et afficher une image sans déstabiliser la mise en page, avec alternative ou récupération d'erreur.
- **Pages et parcours :** `PAGE-001`, `PAGE-002`, `PAGE-003` ; `FLOW-002`, `FLOW-003`.
- **Contenu ou données :** image, dimensions ou ratio, texte alternatif ou statut décoratif, légende facultative.
- **Composition :** média, légende éventuelle et `COMP-003` si l'image informative échoue sans remplacement.
- **Variantes :** aperçu de projet, média de carrousel et miniature.
- **Tailles :** déterminées par la composition et non par une échelle autonome.
- **États :** loading, loaded et error.
- **Interactions et événements conceptuels :** aucune par défaut ; la sélection appartient au composant parent.
- **Accessibilité :** alternative adaptée à l'intention ; média décoratif ignoré ; légende liée à l'image.
- **Responsive :** ratio maîtrisé, recadrage sans perte d'information importante et aucun débordement horizontal.
- **Dépendances et réutilisation :** médias SideQuest et alternatives validées.
- **Exclusions :** ne porte ni destination de projet ni logique de carrousel.
- **Questions ouvertes :** ratios et règles de recadrage à définir dans Figma après réception des médias.

## 6. Fiches — Layout global

### COMP-101 — En-tête du site

- **Catégorie :** layout global.
- **Responsabilité :** fournir l'identité du site et l'accès constant aux destinations globales.
- **Pages et parcours :** `PAGE-001` à `PAGE-004`, `SYS-001` ; tous les parcours.
- **Contenu ou données :** nom ou signature de Costa, destination d'accueil dans la langue active.
- **Composition :** `COMP-102`, `COMP-103` et `COMP-104` selon le viewport.
- **Variantes :** desktop et mobile.
- **Tailles :** `header/mobile` à 64 px et `header/large` à 72 px selon les fondations ; leur tenue avec les contenus FR/EN sera vérifiée dans Figma.
- **États :** normal, navigation mobile ouverte et éventuel état lié au défilement si Figma le justifie sans masquer les accès.
- **Interactions et événements conceptuels :** retour à l'accueil ; ouverture ou fermeture du panneau mobile.
- **Accessibilité :** repère d'en-tête, lien d'accueil explicite, mécanisme d'évitement vers le contenu, ordre de focus cohérent.
- **Responsive :** navigation et langue sont directes sur desktop ; elles passent dans le panneau compact sur mobile, tandis que l'identité et la commande de menu restent visibles.
- **Dépendances et réutilisation :** routes localisées et libellés bilingues.
- **Exclusions :** ne porte ni CV ni contacts prioritaires.
- **Questions ouvertes :** comportement visuel au défilement à décider en Figma.

### COMP-102 — Navigation principale

- **Catégorie :** layout global.
- **Responsabilité :** donner accès à Accueil, Projets et À propos et indiquer la destination courante.
- **Pages et parcours :** toutes les destinations ; `FLOW-001` à `FLOW-006`.
- **Contenu ou données :** trois libellés et routes localisés.
- **Composition :** liens fondés sur `COMP-001` ; collabore avec `COMP-104`.
- **Variantes :** horizontale desktop et verticale dans `COMP-103`.
- **Tailles :** standard et compacte selon le contexte, sans réduire la cible.
- **États :** normal, hover, focus, active et page courante.
- **Interactions et événements conceptuels :** changer de destination dans la langue active.
- **Accessibilité :** repère de navigation nommé ; page courante annoncée sans dépendre de la couleur ; activation clavier native.
- **Responsive :** passe entièrement dans le panneau mobile sans dupliquer les cibles dans l'ordre de focus.
- **Dépendances et réutilisation :** architecture des URL validée.
- **Exclusions :** ne contient ni liens de contact ni CV.
- **Questions ouvertes :** aucune question structurelle.

### COMP-103 — Panneau de navigation mobile

- **Catégorie :** layout global.
- **Responsabilité :** exposer dans un espace compact la navigation et le changement de langue sur petit écran.
- **Pages et parcours :** toutes les destinations ; `FLOW-001` à `FLOW-007`.
- **Contenu ou données :** libellé de commande, état ouvert ou fermé.
- **Composition :** `COMP-102`, `COMP-104` et commande `COMP-001`.
- **Variantes :** une seule variante mobile compacte, non plein écran.
- **Tailles :** adaptée au contenu ; ne couvre pas inutilement toute la page.
- **États :** fermé, ouvert, hover, focus et active pour sa commande.
- **Interactions et événements conceptuels :** ouvrir, fermer, choisir une destination ou une langue ; fermeture après choix, via la même commande ou avec `Escape`.
- **Accessibilité :** commande nommée avec état exposé ; relation entre commande et panneau ; retour du focus sur la commande à la fermeture ; aucun contenu essentiel uniquement disponible par geste.
- **Responsive :** absent de l'ordre d'interaction desktop ; contenu sans débordement sur mobile et au zoom.
- **Dépendances et réutilisation :** `COMP-101`, `COMP-102`, `COMP-104`, seuil `large` à 1024 px et `motion/duration/panel` définis dans les fondations ; le focus suit le contrat de navigation validé.
- **Exclusions :** ne devient pas une page, un tiroir plein écran ou une source de navigation distincte.
- **Questions ouvertes :** aucune question structurelle.

### COMP-104 — Sélecteur de langue

- **Catégorie :** layout global.
- **Responsabilité :** passer entre français et anglais sans perdre la destination logique.
- **Pages et parcours :** toutes les destinations ; principalement `FLOW-006`.
- **Contenu ou données :** options visibles `FR` et `EN`, langue active et destinations équivalentes.
- **Composition :** deux actions de navigation regroupées et nommées.
- **Variantes :** intégrée à l'en-tête desktop et intégrée au panneau mobile ; contenu et comportement identiques.
- **Tailles :** compacte, avec cibles tactiles suffisantes.
- **États :** normal, hover, focus, active et langue courante.
- **Interactions et événements conceptuels :** changer la langue, mettre à jour l'URL, les contenus, les métadonnées et le CV sans revenir à l'accueil.
- **Accessibilité :** nom complet de la langue disponible pour les technologies d'assistance, langue active annoncée, aucun drapeau comme seule information, focus prévisible après navigation.
- **Responsive :** visible dans l'en-tête desktop ; déplacé sans duplication dans `COMP-103` sur mobile.
- **Dépendances et réutilisation :** correspondance exacte des routes, contenus FR/EN et état de visite.
- **Exclusions :** ne mémorise pas le choix entre deux visites et ne mélange pas les langues si un équivalent manque.
- **Questions ouvertes :** traitement éditorial précis d'un équivalent absent à rédiger.

### COMP-105 — Pied de page

- **Catégorie :** layout global.
- **Responsabilité :** fournir une navigation de rappel et les ressources externes essentielles sans devenir un groupe de contacts riche.
- **Pages et parcours :** toutes les destinations ; `FLOW-001`, `FLOW-004`, `FLOW-005`, `FLOW-006`.
- **Contenu ou données :** liens Accueil, Projets, À propos, email, LinkedIn, GitHub, CV localisé et signature ou mentions nécessaires.
- **Composition :** liens textuels fondés sur `COMP-001` ; `COMP-003` seulement si une indisponibilité doit être expliquée.
- **Variantes :** une structure commune ; ordre ou colonnes adaptés au viewport.
- **Tailles :** non applicable comme variante.
- **États :** états de lien ; ressource absente retirée ou annoncée sans cible cassée.
- **Interactions et événements conceptuels :** naviguer, préparer un email, ouvrir un profil ou télécharger le CV actif.
- **Accessibilité :** repère de pied de page ; adresse email visible et sélectionnable ; destination externe ou document compréhensible ; ordre logique.
- **Responsive :** reflow vertical sans masquer les ressources et sans débordement.
- **Dépendances et réutilisation :** coordonnées, profils et CV vérifiés dans les deux langues.
- **Exclusions :** n'utilise ni `COMP-214` ni `COMP-215` ; ses ressources restent de simples liens.
- **Questions ouvertes :** informations légales ou de signature finales à confirmer.

## 7. Fiches — Features

### COMP-201 — Aperçu de projet

- **Catégorie :** feature.
- **Responsabilité :** présenter honnêtement les informations essentielles d'un projet et ouvrir son détail.
- **Pages et parcours :** `PAGE-001`, `PAGE-002`, éventuellement `PAGE-003` pour les suggestions futures ; `FLOW-002`, `FLOW-003`.
- **Contenu ou données :** nom, image, statut, année, type principal, destination et libellé d'action.
- **Composition :** `COMP-004`, `COMP-202`, `COMP-203` et libellé d'action issu de `COMP-001`.
- **Variantes :** `mise en avant` sur l'accueil et `collection` sur Projets ; une variante de suggestion ne sera ajoutée que lorsqu'un autre projet réel existe.
- **Tailles :** dictées par la composition ; aucune échelle artificielle en V1.
- **États :** normal, hover, focus, active, média loading et média error. Un projet non publiable est retiré.
- **Interactions et événements conceptuels :** toute la surface constitue une cible unique vers le détail ; le libellé d'action reste visible.
- **Accessibilité :** un seul lien, nom accessible distinct, focus visible sur l'ensemble, statut fictif lisible, image non exclusive pour comprendre ou ouvrir le projet.
- **Responsive :** informations et action restent visibles sans survol ; contenu reflué dans un ordre éditorial ; aucune zone vide simulant d'autres projets.
- **Dépendances et réutilisation :** contenu SideQuest, route localisée et composants enfants.
- **Exclusions :** ne contient ni filtre, ni tri, ni rôle SideQuest, ni faux lien GitHub ou démo.
- **Questions ouvertes :** image, année, type et libellé final de SideQuest à fournir.

### COMP-202 — Statut du projet

- **Catégorie :** feature.
- **Responsabilité :** empêcher toute confusion entre mock fictif, projet réel et éventuel autre statut honnêtement documenté.
- **Pages et parcours :** `PAGE-001`, `PAGE-002`, `PAGE-003` ; `FLOW-002`, `FLOW-003`.
- **Contenu ou données :** formulation localisée du statut et explication facultative.
- **Composition :** texte ; éventuel symbole décoratif qui ne remplace jamais le libellé.
- **Variantes :** courte dans `COMP-201` et explicative dans `COMP-305`.
- **Tailles :** compacte et étendue selon la variante, pas comme simple changement graphique.
- **États :** normal uniquement ; absent lorsque le statut ne s'applique pas.
- **Interactions et événements conceptuels :** aucun ; information non interactive.
- **Accessibilité :** statut transmis textuellement, placé avant les contenus pouvant créer une ambiguïté, contraste conforme.
- **Responsive :** jamais tronqué au point de perdre la mention « fictif » ou « non réalisé ».
- **Dépendances et réutilisation :** rédaction bilingue validée.
- **Exclusions :** ne devient pas une catégorie filtrable et ne qualifie pas automatiquement les projets réels.
- **Questions ouvertes :** formulation finale française et anglaise à relire.

### COMP-203 — Métadonnées du projet

- **Catégorie :** feature.
- **Responsabilité :** présenter les données factuelles disponibles en maintenant l'association entre libellé et valeur.
- **Pages et parcours :** `PAGE-001`, `PAGE-002`, `PAGE-003` ; `FLOW-002`, `FLOW-003`.
- **Contenu ou données :** année, type principal, types complémentaires éventuels et rôle uniquement s'il est réel et documenté.
- **Composition :** groupes libellé–valeur ; peut intégrer `COMP-207` uniquement si le contexte l'exige, sans confondre stacks et métadonnées.
- **Variantes :** compacte dans les aperçus et détaillée dans le détail.
- **Tailles :** découlent des variantes.
- **États :** normal ; champ facultatif absent plutôt que vide ou désactivé.
- **Interactions et événements conceptuels :** aucune en V1.
- **Accessibilité :** structure sémantique conservant chaque relation libellé–valeur ; ordre stable.
- **Responsive :** reflow sans dissocier libellés et valeurs ; aucun défilement horizontal obligatoire.
- **Dépendances et réutilisation :** métadonnées honnêtes et localisées.
- **Exclusions :** aucun rôle pour SideQuest ; aucun résultat ou métrique non vérifié ; aucun filtre.
- **Questions ouvertes :** année et type SideQuest à confirmer.

### COMP-204 — Collection de projets

- **Catégorie :** feature.
- **Responsabilité :** présenter la collection réelle disponible et gérer honnêtement les états à un projet ou vide.
- **Pages et parcours :** `PAGE-002`, future suggestion sur `PAGE-003` ; `FLOW-002`, `FLOW-003`.
- **Contenu ou données :** liste ordonnée de projets publiables.
- **Composition :** liste de `COMP-201` et `COMP-003` pour l'état vide.
- **Variantes :** sélection éditoriale V1 à un projet ; future composition multi-projets après recadrage.
- **Tailles :** non applicable.
- **États :** un projet comme état normal, empty et contenu partiellement indisponible.
- **Interactions et événements conceptuels :** ouvrir le projet sélectionné.
- **Accessibilité :** structure de liste ; ordre de lecture et de focus identiques à l'ordre éditorial.
- **Responsive :** un projet occupe utilement l'espace ; une future grille refluera sans dépendre de la position desktop.
- **Dépendances et réutilisation :** projets publiables et `COMP-201`.
- **Exclusions :** aucun remplissage fictif, filtre, tri ou pagination en V1.
- **Questions ouvertes :** aucune pour la structure V1.

### COMP-205 — Carrousel d'images du projet

- **Catégorie :** feature.
- **Responsabilité :** présenter les images d'un projet dans un ordre compréhensible avec une navigation contrôlable.
- **Pages et parcours :** `PAGE-003` ; `FLOW-003`, `FLOW-007`.
- **Contenu ou données :** images, ordre, textes alternatifs, légendes, miniature associée et position courante.
- **Composition :** `COMP-004`, liste de `COMP-206`, commandes `COMP-001`, indication textuelle et commande Pause/Lecture.
- **Variantes :** standard avec autoplay ; mouvement réduit avec navigation manuelle uniquement.
- **Tailles :** une composition responsive ; pas de variante de taille autonome.
- **États :** loading, ready, playing, temporarily paused, explicitly paused, focused, hovered, image error et série réduite après retrait d'un média invalide.
- **Interactions et événements conceptuels :** avancer automatiquement toutes les cinq secondes ; suspendre lors d'une interaction ; reprendre après huit secondes d'inactivité uniquement sans focus, sans survol et sans pause explicite ; sélectionner une miniature ; aller à l'image précédente ou suivante ; mettre en pause ou relancer durablement.
- **Accessibilité :** région nommée, position annoncée, commandes nommées, navigation clavier complète, aucun déplacement de focus automatique, pause persistante, autoplay désactivé avec réduction du mouvement.
- **Responsive :** ratio maîtrisé, commandes tactiles accessibles et miniatures horizontalement défilables sans masquer précédent/suivant ni la position.
- **Dépendances et réutilisation :** images SideQuest, alternatives et légendes validées ; règles de motion définies dans `docs/ui/MOTION_GUIDELINES.md`.
- **Exclusions :** images uniquement en V1 ; ni vidéo, ni audio, ni contenu indispensable révélé uniquement par autoplay.
- **Questions ouvertes :** nombre final d'images et stratégie de bouclage à confirmer avec les médias et la maquette.

### COMP-206 — Miniature de média

- **Catégorie :** feature.
- **Responsabilité :** prévisualiser une image et permettre sa sélection directe dans le carrousel.
- **Pages et parcours :** `PAGE-003` ; `FLOW-003`.
- **Contenu ou données :** miniature, position, état courant et nom accessible lié au média.
- **Composition :** `COMP-004` dans une commande `COMP-001`.
- **Variantes :** une seule variante image en V1.
- **Tailles :** compacte, avec cible d'activation suffisante.
- **États :** normal, hover, focus, active et selected.
- **Interactions et événements conceptuels :** sélectionner l'image correspondante et suspendre temporairement l'autoplay.
- **Accessibilité :** position et sélection annoncées ; focus visible ; pas de signification portée par la bordure ou la couleur seule.
- **Responsive :** rangée horizontalement défilable au tactile et au clavier sans masquer l'élément sélectionné.
- **Dépendances et réutilisation :** `COMP-205` et image associée.
- **Exclusions :** ne porte ni lecture vidéo ni navigation indépendante hors carrousel.
- **Questions ouvertes :** aucune question structurelle.

### COMP-207 — Élément de stack

- **Catégorie :** feature.
- **Responsabilité :** nommer clairement une technologie ou compétence dans plusieurs compositions.
- **Pages et parcours :** `PAGE-001`, `PAGE-003`, `PAGE-004` ; `FLOW-003`, `FLOW-004`.
- **Contenu ou données :** nom, catégorie éventuelle, niveau ou contexte uniquement s'il est honnêtement documenté, logo facultatif.
- **Composition :** texte et logo décoratif ou complémentaire.
- **Variantes :** synthétique et détaillée selon le parent.
- **Tailles :** compacte dans le bandeau et standard dans la liste détaillée.
- **États :** normal uniquement ; non interactif en V1.
- **Interactions et événements conceptuels :** aucune ; ne devient ni filtre ni lien par défaut.
- **Accessibilité :** nom textuel toujours présent lorsque nécessaire ; aucun niveau transmis par couleur seule.
- **Responsive :** nom non tronqué de façon ambiguë et association conservée avec sa catégorie.
- **Dépendances et réutilisation :** contenu de stacks validé ; sert `COMP-208`, `COMP-209` et le corps projet.
- **Exclusions :** ne prétend pas à une maîtrise non démontrée et n'ouvre pas une collection filtrée.
- **Questions ouvertes :** liste, catégories et niveaux à fournir.

### COMP-208 — Bandeau de stacks

- **Catégorie :** feature.
- **Responsabilité :** donner un aperçu synthétique des technologies principales sans ralentir la lecture.
- **Pages et parcours :** `PAGE-001` ; `FLOW-001`, `FLOW-007`.
- **Contenu ou données :** sélection priorisée de stacks.
- **Composition :** séquence unique de `COMP-207`, sans duplication visuelle ou sémantique.
- **Variantes :** compacte et étendue selon la place disponible, toutes deux statiques.
- **Tailles :** adaptées à la densité du viewport.
- **États :** normal uniquement ; aucun état temporel ou interactif en V1.
- **Interactions et événements conceptuels :** aucune ; la consultation ne dépend ni d'un défilement automatique ni d'une commande Pause/Lecture.
- **Accessibilité :** contenu présent une seule fois dans un ordre de lecture naturel ; aucune information dupliquée ou révélée par le mouvement.
- **Responsive :** se reforme sur plusieurs lignes ou modules selon la grille, sans défilement horizontal obligatoire ni geste précis.
- **Dépendances et réutilisation :** `COMP-207`, sélection de stacks et grille responsive du design system.
- **Exclusions :** aucun lien, filtre ou interaction métier.
- **Questions ouvertes :** densité finale à vérifier avec les contenus réels dans Figma, sans modifier le contrat statique.

### COMP-209 — Liste de stacks

- **Catégorie :** feature.
- **Responsabilité :** détailler les technologies et compétences selon des groupes compréhensibles.
- **Pages et parcours :** `PAGE-003`, `PAGE-004` ; `FLOW-003`, `FLOW-004`.
- **Contenu ou données :** groupes, éléments, contexte et niveau éventuel.
- **Composition :** titres de groupe et `COMP-207`.
- **Variantes :** projet et profil ; elles diffèrent par le contexte des données, pas seulement par le style.
- **Tailles :** non applicable.
- **États :** normal et empty si aucun contenu honnête n'est publiable ; pas de loading bloquant pour le contenu statique V1.
- **Interactions et événements conceptuels :** aucune en V1.
- **Accessibilité :** groupes nommés, structure de liste et distinctions non fondées sur la couleur seule.
- **Responsive :** reflow des groupes et éléments sans réduire les noms à des logos.
- **Dépendances et réutilisation :** contenu SideQuest contextualisé ou compétences de profil validées.
- **Exclusions :** pas de filtrage, classement automatique ou niveau inventé.
- **Questions ouvertes :** catégories et hiérarchie de contenu à finaliser.

### COMP-210 — Timeline du parcours

- **Catégorie :** feature.
- **Responsabilité :** ordonner formation et expériences dans une chronologie unique du plus récent au plus ancien.
- **Pages et parcours :** `PAGE-004` ; `FLOW-004`.
- **Contenu ou données :** liste d'événements datés et catégorisés.
- **Composition :** liste de `COMP-211`.
- **Variantes :** une seule variante entièrement déployée en V1.
- **Tailles :** non applicable.
- **États :** normal et contenu incomplet explicite ; aucun état replié en V1.
- **Interactions et événements conceptuels :** aucune interaction requise.
- **Accessibilité :** liste sémantique, ordre DOM chronologique, éléments décoratifs ignorés et catégories textuelles.
- **Responsive :** lecture linéaire ; aucune alternance gauche-droite nécessaire à la compréhension.
- **Dépendances et réutilisation :** parcours, dates, catégories et descriptions bilingues.
- **Exclusions :** pas d'accordéon en V1 ; une version repliable nécessite un recadrage V2.
- **Questions ouvertes :** contenu final des événements à fournir.

### COMP-211 — Entrée de timeline

- **Catégorie :** feature.
- **Responsabilité :** décrire un événement de parcours avec sa période, sa catégorie et son contexte.
- **Pages et parcours :** `PAGE-004` ; `FLOW-004`.
- **Contenu ou données :** catégorie Formation ou Expérience, période, titre, organisation ou contexte et description utile.
- **Composition :** libellé de catégorie, période, titre et texte ; décoration de ligne ou repère facultative.
- **Variantes :** formation et expérience.
- **Tailles :** standard.
- **États :** normal ; information manquante laissée comme dépendance éditoriale, jamais inventée.
- **Interactions et événements conceptuels :** aucune en V1.
- **Accessibilité :** catégorie explicite, titres structurés et décorations ignorées.
- **Responsive :** période et description restent associées ; aucun ordre alterné.
- **Dépendances et réutilisation :** contenu de profil validé.
- **Exclusions :** ne se replie pas et ne contient pas automatiquement de lien externe.
- **Questions ouvertes :** granularité et contenu définitifs à confirmer.

### COMP-212 — Liste de principes de travail

- **Catégorie :** feature.
- **Responsabilité :** présenter plusieurs principes courts décrivant concrètement la manière de travailler.
- **Pages et parcours :** `PAGE-004` ; `FLOW-004`.
- **Contenu ou données :** liste ordonnée ou éditorialement organisée de principes.
- **Composition :** répétition de `COMP-213`.
- **Variantes :** une seule composition V1 ; disposition visuelle adaptable.
- **Tailles :** non applicable.
- **États :** normal et contenu incomplet.
- **Interactions et événements conceptuels :** aucune interaction requise.
- **Accessibilité :** structure de liste lorsque l'ordre ou le regroupement le justifie ; lecture cohérente indépendamment de la grille visuelle.
- **Responsive :** reflow en une colonne sans perte de hiérarchie.
- **Dépendances et réutilisation :** principes rédigés dans les deux langues.
- **Exclusions :** ne contient ni témoignages, ni métriques, ni promesses non démontrables.
- **Questions ouvertes :** nombre et formulation des principes à définir.

### COMP-213 — Principe de travail

- **Catégorie :** feature.
- **Responsabilité :** exprimer une idée autonome sur la collaboration, la qualité, le raisonnement ou la sensibilité UI/UX.
- **Pages et parcours :** `PAGE-004` ; `FLOW-004`.
- **Contenu ou données :** titre court et explication concise ; illustration facultative.
- **Composition :** texte et décoration non essentielle éventuelle.
- **Variantes :** aucune variante métier en V1.
- **Tailles :** standard.
- **États :** normal ; non interactif.
- **Interactions et événements conceptuels :** aucune.
- **Accessibilité :** titre et texte lisibles dans l'ordre ; illustration décorative ignorée.
- **Responsive :** texte non tronqué et hauteur non uniformisée si cela masque du contenu.
- **Dépendances et réutilisation :** contenu bilingue validé.
- **Exclusions :** ne devient pas une carte cliquable sans destination réelle.
- **Questions ouvertes :** composition exacte à décliner dans Figma à partir de la direction validée.

### COMP-214 — Téléchargement du CV

- **Catégorie :** feature.
- **Responsabilité :** mettre en avant le téléchargement du CV correspondant à la langue active après le récit du profil.
- **Pages et parcours :** `PAGE-004` ; `FLOW-004`, `FLOW-006`.
- **Contenu ou données :** titre, court contexte, langue, format, fichier et éventuelle taille.
- **Composition :** contenu éditorial et `COMP-001` ou `COMP-002` pour le téléchargement.
- **Variantes :** une seule variante mise en avant ; le lien du pied de page n'est pas une variante de ce composant.
- **Tailles :** standard.
- **États :** normal, focus, active et indisponible. Aucun contrôle cassé si le fichier manque.
- **Interactions et événements conceptuels :** télécharger le CV de la langue active.
- **Accessibilité :** document, langue et format annoncés ; focus visible ; aucune animation ou attente obligatoire.
- **Responsive :** contexte et action restent associés et visibles en disposition verticale.
- **Dépendances et réutilisation :** CV français et anglais valides et correspondance de langue.
- **Exclusions :** ne choisit pas une autre langue automatiquement et ne remplace pas le récit du profil.
- **Questions ouvertes :** fichiers, formats et tailles définitifs à fournir.

### COMP-215 — Groupe de contacts

- **Catégorie :** feature.
- **Responsabilité :** proposer les moyens de contact pertinents avec une hiérarchie explicite et sans formulaire.
- **Pages et parcours :** `PAGE-003`, `PAGE-004` ; `FLOW-003`, `FLOW-005`.
- **Contenu ou données :** email, LinkedIn et GitHub selon le contexte et la disponibilité réelle.
- **Composition :** `COMP-216` et liens `COMP-002` avec icône et libellé.
- **Variantes :** complète sur À propos ; contextuelle en fin de projet, où email et LinkedIn ont une priorité équivalente.
- **Tailles :** standard ; disposition compacte possible sans retirer les libellés.
- **États :** normal, destination partiellement indisponible et succès ou erreur de copie email.
- **Interactions et événements conceptuels :** préparer un email, copier l'adresse, ouvrir LinkedIn ou approfondir sur GitHub.
- **Accessibilité :** icône accompagnée d'un libellé ; destinations nommées ; changements de contexte compréhensibles ; focus visible.
- **Responsive :** actions refluées verticalement si nécessaire, sans réduire la cible ni masquer un libellé.
- **Dépendances et réutilisation :** coordonnées et URL vérifiées.
- **Exclusions :** aucun formulaire, saisie ou stockage de données ; le pied de page n'utilise pas ce composant.
- **Questions ouvertes :** coordonnées finales à fournir.

### COMP-216 — Contact email

- **Catégorie :** feature.
- **Responsabilité :** rendre l'adresse visible, sélectionnable, copiable et directement utilisable.
- **Pages et parcours :** `PAGE-003`, `PAGE-004` ; `FLOW-005`.
- **Contenu ou données :** adresse validée, libellés d'envoi et de copie.
- **Composition :** adresse textuelle, actions `COMP-002` et retour `COMP-003`.
- **Variantes :** complète dans `COMP-215` ; le pied de page utilise seulement un lien textuel et une adresse sélectionnable.
- **Tailles :** standard.
- **États :** normal, copying, success et error.
- **Interactions et événements conceptuels :** ouvrir le client de messagerie ou copier l'adresse ; annoncer le résultat sans déplacer le focus.
- **Accessibilité :** adresse lisible et sélectionnable ; boutons nommés ; zone de statut pour la copie ; alternative manuelle en cas d'échec.
- **Responsive :** adresse longue refluée sans débordement et actions toujours atteignables.
- **Dépendances et réutilisation :** email public validé et capacité de copie du navigateur.
- **Exclusions :** ne simule pas l'envoi d'un message et ne collecte aucune donnée.
- **Questions ouvertes :** email final à fournir.

### COMP-217 — Fin de projet conditionnelle

- **Catégorie :** feature.
- **Responsabilité :** proposer une suite honnête après le détail selon la disponibilité réelle d'autres projets.
- **Pages et parcours :** `PAGE-003` ; `FLOW-003`, `FLOW-005`.
- **Contenu ou données :** projets suggérés publiables ou invitation de contact localisée.
- **Composition :** futurs `COMP-201` de suggestion ou `COMP-215` contextuel.
- **Variantes :** suggestions et invitation de contact ; la V1 SideQuest utilise l'invitation.
- **Tailles :** non applicable.
- **États :** l'absence de suggestion est un état normal basculant vers le contact ; contact partiellement indisponible géré par `COMP-215`.
- **Interactions et événements conceptuels :** ouvrir un autre projet ou choisir un moyen de contact.
- **Accessibilité :** titre de section explicite et action principale identifiable ; aucun carrousel vide de suggestions.
- **Responsive :** actions ou aperçus reflués dans un ordre éditorial clair.
- **Dépendances et réutilisation :** disponibilité réelle des autres projets et contacts vérifiés.
- **Exclusions :** aucune recommandation fictive, aucun emplacement vide et aucune page Contact.
- **Questions ouvertes :** critères futurs de suggestion à cadrer lorsque plusieurs projets existeront.

## 8. Fiches — Pages et compositions

### COMP-301 — Hero d'accueil

- **Catégorie :** page ou composition.
- **Responsabilité :** présenter Costa, son titre et sa proposition de valeur, puis orienter d'abord vers la collection.
- **Pages et parcours :** `PAGE-001` ; `FLOW-001`, entrées vers `FLOW-002` et `FLOW-004`.
- **Contenu ou données :** nom, titre localisé, proposition de valeur et deux actions.
- **Composition :** action principale vers Projets, action secondaire vers À propos et décoration future non essentielle.
- **Variantes :** une seule composition bilingue ; contenu localisé, structure stable.
- **Tailles :** composition responsive, sans variantes nominales.
- **États :** contenu disponible immédiatement ; médias ou décorations loading ou absents sans bloquer le texte.
- **Interactions et événements conceptuels :** découvrir la collection ou ouvrir À propos.
- **Accessibilité :** titre principal unique, ordre de lecture indépendant de la composition graphique, contenu jamais masqué jusqu'à la fin d'une animation.
- **Responsive :** proposition de valeur et action principale précèdent les décorations ; les deux actions restent visibles.
- **Dépendances et réutilisation :** introduction bilingue et direction « Studio graphique modulaire » définie dans `docs/ui/DESIGN_SYSTEM.md`.
- **Exclusions :** n'ouvre pas directement SideQuest depuis son CTA principal et n'introduit pas de custom cursor.
- **Questions ouvertes :** contenu final à fournir et composition exacte à décliner dans Figma à partir de la direction validée.

### COMP-302 — Sélection de projet d'accueil

- **Catégorie :** page ou composition.
- **Responsabilité :** présenter SideQuest comme sélection éditoriale après la hero et ouvrir directement son détail.
- **Pages et parcours :** `PAGE-001` ; `FLOW-002`, `FLOW-003`.
- **Contenu ou données :** titre de section, éventuel contexte et SideQuest.
- **Composition :** `COMP-201` variante `mise en avant`.
- **Variantes :** une seule composition V1.
- **Tailles :** non applicable.
- **États :** normal, projet indisponible et média error.
- **Interactions et événements conceptuels :** ouvrir le détail SideQuest.
- **Accessibilité :** section nommée, statut fictif perceptible et action indépendante de l'image.
- **Responsive :** présence éditoriale forte sans simuler une grille incomplète.
- **Dépendances et réutilisation :** SideQuest publiable.
- **Exclusions :** ne remplace pas le CTA de hero vers la collection.
- **Questions ouvertes :** contenu éditorial final de la section.

### COMP-303 — Aperçu du profil

- **Catégorie :** page ou composition.
- **Responsabilité :** donner un angle personnel et mener vers le récit complet sur À propos.
- **Pages et parcours :** `PAGE-001` ; `FLOW-001`, `FLOW-004`.
- **Contenu ou données :** biographie courte, positionnement et résumé de méthode.
- **Composition :** contenu éditorial et `COMP-001` vers À propos.
- **Variantes :** une seule composition V1.
- **Tailles :** non applicable.
- **États :** normal et contenu incomplet explicite.
- **Interactions et événements conceptuels :** ouvrir À propos.
- **Accessibilité :** titre de section, ordre de lecture logique et action explicite.
- **Responsive :** texte et action précèdent toute décoration et se réorganisent sans troncature.
- **Dépendances et réutilisation :** biographie bilingue.
- **Exclusions :** ne duplique pas toute la timeline ni le composant CV.
- **Questions ouvertes :** angle et contenu final à rédiger.

### COMP-304 — Introduction de collection

- **Catégorie :** page ou composition.
- **Responsabilité :** présenter la collection limitée et contextualiser honnêtement SideQuest.
- **Pages et parcours :** `PAGE-002` ; `FLOW-002`.
- **Contenu ou données :** titre principal, introduction localisée et formulation de transparence.
- **Composition :** contenu éditorial ; peut collaborer avec `COMP-202` sans répéter inutilement le même message.
- **Variantes :** une seule composition V1.
- **Tailles :** non applicable.
- **États :** normal.
- **Interactions et événements conceptuels :** aucune.
- **Accessibilité :** titre principal et texte explicite avant la collection.
- **Responsive :** longueur de ligne lisible et ordre stable.
- **Dépendances et réutilisation :** rédaction bilingue du contexte SideQuest.
- **Exclusions :** ne crée ni filtre ni tri.
- **Questions ouvertes :** formulation finale à valider.

### COMP-305 — En-tête de détail projet

- **Catégorie :** page ou composition.
- **Responsabilité :** nommer le projet et annoncer son statut avant le carrousel et tout contenu ambigu.
- **Pages et parcours :** `PAGE-003` ; `FLOW-003`.
- **Contenu ou données :** nom, retour vers la collection et statut éventuel.
- **Composition :** titre principal, `COMP-202` explicatif et `COMP-001` de retour.
- **Variantes :** mock et projet réel.
- **Tailles :** compacte afin de laisser le carrousel constituer le premier grand bloc visuel.
- **États :** normal et contenu traduit indisponible.
- **Interactions et événements conceptuels :** revenir à la collection.
- **Accessibilité :** titre principal unique, statut annoncé avant les descriptions ambiguës et retour explicite.
- **Responsive :** nom et statut précèdent toujours le carrousel dans l'ordre de lecture.
- **Dépendances et réutilisation :** données du projet et route de collection localisée.
- **Exclusions :** ne contient ni métadonnées détaillées ni faux liens externes.
- **Questions ouvertes :** aucune question structurelle.

### COMP-306 — Corps éditorial de projet

- **Catégorie :** page ou composition.
- **Responsabilité :** ordonner métadonnées, description, stacks et liens réels éventuels après le carrousel.
- **Pages et parcours :** `PAGE-003` ; `FLOW-003`.
- **Contenu ou données :** informations disponibles et honnêtement contextualisées.
- **Composition :** `COMP-203` détaillé, contenu éditorial, `COMP-209` projet et liens `COMP-002` réels éventuels.
- **Variantes :** SideQuest et projet réel.
- **Tailles :** non applicable.
- **États :** normal, contenu partiel et ressource externe indisponible.
- **Interactions et événements conceptuels :** ouvrir uniquement les ressources réelles disponibles.
- **Accessibilité :** hiérarchie de titres, listes structurées et liens nommés.
- **Responsive :** ordre métadonnées, description puis stacks conservé ; aucune colonne ne change le sens de lecture.
- **Dépendances et réutilisation :** contenu projet, stacks et ressources vérifiées.
- **Exclusions :** aucune métrique, responsabilité, technologie ou ressource fictive.
- **Questions ouvertes :** contenu SideQuest final à produire.

### COMP-307 — Introduction À propos

- **Catégorie :** page ou composition.
- **Responsabilité :** présenter la personnalité et le positionnement avant la timeline, les compétences et les actions.
- **Pages et parcours :** `PAGE-004` ; `FLOW-004`.
- **Contenu ou données :** biographie et éléments personnels pertinents.
- **Composition :** titre principal et contenu éditorial ; décoration facultative.
- **Variantes :** une seule composition bilingue.
- **Tailles :** non applicable.
- **États :** normal et contenu incomplet explicite.
- **Interactions et événements conceptuels :** aucune requise.
- **Accessibilité :** titre principal, texte lisible et décoration ignorée.
- **Responsive :** ordre linéaire et longueur de ligne maîtrisée.
- **Dépendances et réutilisation :** biographie bilingue validée.
- **Exclusions :** ne remplace ni la timeline ni les principes de travail.
- **Questions ouvertes :** contenu final à rédiger.

### COMP-308 — Page introuvable

- **Catégorie :** page ou composition.
- **Responsabilité :** expliquer qu'une destination n'existe pas et permettre une reprise sans redirection silencieuse.
- **Pages et parcours :** `SYS-001` ; récupération liée à tous les parcours.
- **Contenu ou données :** titre, explication localisée et destinations Accueil et Projets.
- **Composition :** `COMP-003`, actions `COMP-001`, `COMP-101` et `COMP-105` selon le contexte validé.
- **Variantes :** française et anglaise, structure identique.
- **Tailles :** non applicable.
- **États :** état système introuvable.
- **Interactions et événements conceptuels :** revenir à l'accueil, ouvrir la collection ou changer de langue lorsqu'un équivalent cohérent existe.
- **Accessibilité :** titre principal, focus initial prévisible, actions explicites et absence de boucle.
- **Responsive :** contenu centré sur la reprise, lisible sans débordement.
- **Dépendances et réutilisation :** routes localisées et stratégie technique future.
- **Exclusions :** n'est pas une cinquième page éditoriale et n'est pas indexable.
- **Questions ouvertes :** traitement précis d'une URL sans langue à décider techniquement.

## 9. Matrice de couverture pages × composants

Légende : `●` composant principal, `○` composant présent ou enfant, `◇` usage futur déjà anticipé, `—` absent.

| Composant | PAGE-001 | PAGE-002 | PAGE-003 | PAGE-004 | SYS-001 |
|---|:---:|:---:|:---:|:---:|:---:|
| COMP-001 Action | ● | ○ | ● | ● | ● |
| COMP-002 Lien avec icône | — | — | ○ | ○ | — |
| COMP-003 Message d'état | ○ | ○ | ○ | ○ | ● |
| COMP-004 Cadre média | ○ | ○ | ● | — | — |
| COMP-101 En-tête du site | ○ | ○ | ○ | ○ | ○ |
| COMP-102 Navigation principale | ○ | ○ | ○ | ○ | ○ |
| COMP-103 Panneau de navigation mobile | ○ | ○ | ○ | ○ | ○ |
| COMP-104 Sélecteur de langue | ○ | ○ | ○ | ○ | ○ |
| COMP-105 Pied de page | ○ | ○ | ○ | ○ | ○ |
| COMP-201 Aperçu de projet | ● | ● | ◇ | — | — |
| COMP-202 Statut du projet | ○ | ○ | ● | — | — |
| COMP-203 Métadonnées du projet | ○ | ○ | ● | — | — |
| COMP-204 Collection de projets | — | ● | ◇ | — | — |
| COMP-205 Carrousel d'images | — | — | ● | — | — |
| COMP-206 Miniature de média | — | — | ○ | — | — |
| COMP-207 Élément de stack | ○ | — | ○ | ○ | — |
| COMP-208 Bandeau de stacks | ● | — | — | — | — |
| COMP-209 Liste de stacks | — | — | ○ | ● | — |
| COMP-210 Timeline du parcours | — | — | — | ● | — |
| COMP-211 Entrée de timeline | — | — | — | ○ | — |
| COMP-212 Liste de principes | — | — | — | ● | — |
| COMP-213 Principe de travail | — | — | — | ○ | — |
| COMP-214 Téléchargement du CV | — | — | — | ● | — |
| COMP-215 Groupe de contacts | — | — | ● | ● | — |
| COMP-216 Contact email | — | — | ○ | ○ | — |
| COMP-217 Fin de projet conditionnelle | — | — | ● | — | — |
| COMP-301 Hero d'accueil | ● | — | — | — | — |
| COMP-302 Sélection de projet | ● | — | — | — | — |
| COMP-303 Aperçu du profil | ● | — | — | — | — |
| COMP-304 Introduction de collection | — | ● | — | — | — |
| COMP-305 En-tête de détail | — | — | ● | — | — |
| COMP-306 Corps éditorial de projet | — | — | ● | — | — |
| COMP-307 Introduction À propos | — | — | — | ● | — |
| COMP-308 Page introuvable | — | — | — | — | ● |

## 10. Contrats transversaux

### 10.1 États

- **Normal :** contenu, langue et destinations correspondent à la page demandée.
- **Loading :** les médias peuvent attendre, mais le texte et les actions déjà disponibles restent consultables.
- **Empty :** la collection n'invente aucun projet ; elle explique la situation et conserve une issue.
- **Error :** le composant explique l'échec et propose une reprise réelle.
- **Success :** réservé à un retour utile comme la copie de l'email ; aucune navigation ordinaire ne simule un succès.
- **Disabled ou indisponible :** un lien sans destination réelle est retiré ou remplacé par une information, jamais publié comme contrôle cassé.
- **Permission denied :** non applicable en V1, qui ne demande ni compte ni permission applicative.

### 10.2 Accessibilité

- Chaque action interactive possède un nom accessible, un focus visible et une activation clavier native.
- L'ordre DOM suit l'ordre de lecture et reste cohérent lorsque la composition change.
- La page courante, la langue active, le projet sélectionné et le statut fictif ne dépendent jamais de la couleur seule.
- Les icônes utiles sont accompagnées d'un libellé ; les icônes redondantes sont ignorées par les technologies d'assistance.
- Les images informatives ont une alternative contextualisée ; les décorations sont ignorées.
- Les changements automatiques du carrousel ne déplacent jamais le focus et peuvent être arrêtés durablement.
- Les messages utiles sont annoncés avec une priorité adaptée, sans transformer chaque mise à jour en alerte.

### 10.3 Responsive

- Aucun contenu ou contrôle essentiel ne dépend du survol.
- Les compositions refluées conservent la hiérarchie éditoriale et les relations entre libellés et valeurs.
- Les actions principales, le menu, la langue, les commandes du carrousel, le CV et les contacts restent opérables au tactile et au zoom.
- Les rangées horizontalement défilables restent limitées aux contenus prévus, comme les miniatures, et ne créent pas de débordement global.
- Les libellés essentiels ne sont pas remplacés par des icônes seules sur petit écran.

### 10.4 Mouvement réduit

- `COMP-205` désactive l'autoplay et conserve sa navigation manuelle.
- `COMP-208` est déjà statique dans tous les modes et présente toutes les stacks sans attente.
- `COMP-103` et les autres transitions utilisent une apparition immédiate ou fortement réduite.
- Aucune animation d'entrée ne retarde ou ne masque un contenu.
- Les états focus, sélection, succès et erreur restent perceptibles par des indices statiques.

## 11. Évolutions explicitement reportées

- Timeline repliable ou accordéon : V2 au plus tôt, après cadrage de son utilité.
- Vidéo dans le carrousel : version future avec exigences de lecture, sous-titrage et contrôle à définir.
- Filtres, tris et Bento Grid multi-projets : après ajout de plusieurs projets réels et mise à jour du PRD.
- Réglage manuel de réduction du mouvement : après la V1 ; la préférence système suffit au contrat actuel.
- Variante de suggestion de `COMP-201` et mode suggestions de `COMP-217` : seulement lorsque d'autres projets publiables existent.

## 12. Dépendances et questions ouvertes

| Sujet | Composants concernés | Impact | Bloque la validation de l'inventaire ? |
|---|---|---|---|
| Contenu, année et type SideQuest | COMP-201, COMP-203, COMP-304, COMP-306 | Libellés et densité réels de la maquette | Non |
| Images, miniatures, légendes et alternatives SideQuest | COMP-004, COMP-201, COMP-205, COMP-206 | Ratios, nombre de médias et comportement aux erreurs | Non |
| Biographie et aperçu de profil | COMP-301, COMP-303, COMP-307 | Volume éditorial des compositions | Non |
| Timeline formation–expériences | COMP-210, COMP-211 | Nombre, longueur et catégories d'entrées | Non |
| Stacks, catégories et niveaux | COMP-207 à COMP-209 | Densité du bandeau et de la liste | Non |
| Principes de travail | COMP-212, COMP-213 | Nombre et longueur des éléments | Non |
| CV français et anglais | COMP-105, COMP-214 | États final et indisponible | Non |
| Email, LinkedIn et GitHub | COMP-105, COMP-215, COMP-216, COMP-217 | Destinations et vérification des retours | Non |
| Rédaction et relecture bilingues | Tous les composants textuels | Parité, tailles et validation éditoriale | Non |
| Consommation des fondations validées | Tous | Vérification des variantes, tailles, focus et comportements responsive dans les compositions réelles | Non ; contrôle attendu pendant Figma |

Aucune question ouverte ne modifie actuellement la responsabilité ou la frontière d'un composant V1. Les contenus manquants empêchent la maquette finale et l'implémentation concernée, mais pas la validation conceptuelle de cet inventaire.

## 13. Critères de validation

L'inventaire peut être validé si Costa confirme que :

- les composants couvrent les quatre pages, la page introuvable et les sept parcours V1 ;
- les catégories design system, layout global, feature et composition de page reflètent correctement les responsabilités ;
- le panneau mobile compact, le sélecteur FR/EN et leurs comportements correspondent à l'expérience attendue ;
- l'aperçu de projet commun, ses variantes, son activation complète et ses composants de statut et métadonnées sont cohérents ;
- le carrousel d'images, ses miniatures, son autoplay contrôlable et son mode réduit sont suffisamment définis pour Figma ;
- les stacks partagent un élément commun entre bandeau statique et listes détaillées ;
- la timeline entièrement visible et les principes courts couvrent la page À propos sans interaction superflue ;
- le CV mis en avant et le groupe de contacts restent distincts des simples liens du pied de page ;
- les états critiques, le clavier, le lecteur d'écran, le responsive et la réduction du mouvement disposent d'un responsable clair ;
- les évolutions V2 ne sont pas introduites silencieusement dans la V1 ;
- les dépendances de contenu peuvent être résolues sans restructurer l'inventaire.

Costa a validé explicitement la version 0.1.0 le 2026-09-15, puis a autorisé le 2026-09-16 l'alignement du bandeau de stacks sur les fondations de motion validées. Toute nouvelle modification substantielle de ses responsabilités, variantes ou contrats transversaux exigera une nouvelle validation.

## 14. Historique

| Version | Date | État | Évolution |
|---|---|---|---|
| 0.1.0 | 2026-09-15 | Validé | Première version complète issue du PRD v0.2.1, des parcours v0.3.1, de l'architecture des pages v0.1.1 et de l'entretien avec Costa ; approuvée explicitement par Costa. |
| 0.2.0 | 2026-09-16 | Validé | Alignement autorisé par Costa du bandeau de stacks sur la motion validée : composition statique à toutes les largeurs et résolution des références de fondations devenues obsolètes. |
