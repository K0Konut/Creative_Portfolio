# PRD — Portfolio de Costa Maskulov

## 1. Métadonnées

| Champ | Valeur |
|---|---|
| Produit | Portfolio personnel de Costa Maskulov |
| Titre public français | `Costa Maskulov — Développeur full-stack créatif` |
| Titre public anglais | `Costa Maskulov — Creative Full-Stack Developer` |
| Version | 0.3.1 |
| Statut | Révisé — objectif professionnel, cible, stack et statut des projets alignés |
| Dernière mise à jour | 2026-10-01 |
| Responsable produit | Costa Maskulov |
| Contributeur | Codex |
| Approbateur | Costa Maskulov |

### Sources consultées

- Entretien de cadrage avec Costa Maskulov, 2026-09-14.
- Revue du PRD et demande de révision par Costa Maskulov, 2026-10-01.
- Séminaire « Trajectoire professionnelle » 5A : stage de 5A déjà trouvé à la CNAM et évolution visée vers un profil full-stack sensible à l’UI/UX, 2026-09-23.
- Moodboard fourni par Costa : [The Flow Party](https://www.joinflowparty.com/), [SUB:BIO STUDIOS](https://sub-bio-studios.com.au/), [Brosti](https://brosti.com/), [Encoder](https://encoder.digital/) et [Digital Mosaik](https://www.digitalmosaik.com/).
- [WCAG 2.2 du W3C](https://www.w3.org/TR/WCAG22/).
- [Seuils Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds).

### Statut des informations

- **Fait fourni** : information communiquée explicitement par Costa.
- **Décision validée** : choix confirmé pendant le cadrage du 2026-09-14.
- **Hypothèse** : proposition à confirmer avant qu'elle engage la conception.
- **Question ouverte** : information manquante susceptible de modifier le produit.

### Décisions validées

| ID | Date | Décision |
|---|---|---|
| DEC-001 | 2026-09-14 | Décision historique : le portfolio préparait initialement de futures candidatures à un stage. Cette orientation est remplacée par DEC-008. |
| DEC-002 | 2026-09-14 | Le titre français est « Costa Maskulov — Développeur full-stack créatif ». |
| DEC-003 | 2026-09-14 | Le titre anglais est « Costa Maskulov — Creative Full-Stack Developer ». |
| DEC-004 | 2026-09-14 | SideQuest est un projet de démonstration servant à composer et valider l’expérience du portfolio ; il ne doit jamais être présenté comme une réalisation réelle de Costa. |
| DEC-005 | 2026-09-14 | La nature de démonstration de SideQuest doit être indiquée explicitement dans la V1. |
| DEC-006 | 2026-09-14 | Le formulaire et la page Contact sont entièrement reportés en V2. |
| DEC-007 | 2026-10-01 | La stack frontend V1 est fixée à Vue 3, Vite et TypeScript. Les autres choix d’architecture restent traités pendant la phase technique. |
| DEC-008 | 2026-10-01 | Le stage de 5A à la CNAM étant déjà trouvé, le portfolio ne vise plus prioritairement l’obtention d’un stage ; il prépare la suite du parcours vers un poste junior full-stack avec une forte sensibilité UI/UX. |
| DEC-009 | 2026-10-01 | La cible prioritaire comprend les recruteurs et décideurs techniques évaluant un profil junior full-stack ; les développeurs, designers et contacts professionnels constituent une cible secondaire. |
| DEC-010 | 2026-10-01 | La Hero expose deux CTA : « Voir mes projets » en primaire et « Me contacter » en secondaire. Le téléchargement du CV reste accessible ailleurs dans le site mais n’est pas un CTA de Hero. |
| DEC-011 | 2026-10-01 | Le portfolio distingue explicitement les projets réels de Costa et les projets de démonstration. SideQuest appartient à la catégorie démonstration ; les réalisations réelles sont les seules à servir de preuves d’expérience et de résultats. |

## 2. Résumé du produit

Le produit est un portfolio personnel bilingue français–anglais destiné en priorité aux recruteurs et décideurs techniques qui évaluent un profil junior full-stack. Costa a déjà trouvé son stage de 5A à la CNAM : le portfolio n’a donc plus pour objectif principal d’obtenir un stage. Il doit consolider son positionnement de développeur full-stack avec une sensibilité UI/UX, mettre en valeur ses réalisations et préparer son entrée dans un poste junior après sa formation, avec à plus long terme une possible évolution vers la coordination technique.

La V1 comprend une page d'accueil, une liste de projets, une page de détail pour chaque projet et une page À propos. Elle est développée avec Vue 3, Vite et TypeScript. Le catalogue peut contenir des projets réels et des projets de démonstration, mais leur statut doit être immédiatement compréhensible. SideQuest est exclusivement un projet de démonstration destiné à valider la présentation et l’expérience du portfolio ; il ne constitue pas une preuve de réalisation. Les projets réels documentent uniquement du travail effectivement réalisé par Costa et peuvent servir de preuves professionnelles. La V1 permet également de télécharger le CV et d’accéder à des moyens de contact directs. Le futur CRM est un produit séparé : son intégration interviendra seulement après la réalisation indépendante du frontend et du CRM.

## 3. Problème et opportunité

### Situation actuelle

Le portfolio existant remplit une fonction de présentation, mais sa direction artistique ne représente pas suffisamment Costa. Son rendu est perçu comme générique, proche d'un résultat produit par IA et dépourvu de personnalité distinctive.

### Conséquences

- Le portfolio différencie insuffisamment Costa parmi d'autres profils juniors full-stack.
- Il ne démontre pas assez sa sensibilité UI/UX et sa maîtrise du développement créatif.
- Les recruteurs disposent de moins de preuves concernant son raisonnement technique.
- La frontière entre contenu de démonstration et réalisations réelles doit être explicite pour préserver la crédibilité du portfolio.

### Opportunité

Transformer le portfolio en démonstration par l'exemple : l'expérience du site doit soutenir la crédibilité du profil, tandis que les études de cas expliquent les problèmes traités, les décisions techniques et la qualité d'exécution.

## 4. Objectifs

| ID | Objectif | Résultat recherché |
|---|---|---|
| OBJ-001 | Construire un showroom de projets évolutif | La V1 peut réunir réalisations réelles et démonstrations, avec un statut explicite pour chacune ; les projets réels restent le cœur de la preuve professionnelle. |
| OBJ-002 | Démontrer le raisonnement technique avec des preuves réelles | Les détails des projets réels expliquent problème, rôle, choix, compromis, apprentissages et résultats vérifiables ; SideQuest sert uniquement à valider la structure et la direction de présentation. |
| OBJ-003 | Construire une identité professionnelle distinctive | L'expérience est créative et mémorable sans réduire la lisibilité ni reléguer les projets au second plan. |
| OBJ-004 | Présenter le parcours et la personnalité | La page À propos relie formation, expériences, méthode de travail, compétences et personnalité. |
| OBJ-005 | Préparer l’insertion professionnelle après la 5A | Le portfolio soutient le positionnement de Costa comme développeur full-stack junior sensible à l’UI/UX et facilite les prises de contact pour des opportunités professionnelles après la formation. |
| OBJ-006 | Servir un public francophone et anglophone | Les contenus essentiels et le CV sont accessibles dans les deux langues dès la V1. |

## 5. Non-objectifs

- Faire du portfolio un CV en ligne exhaustif.
- Donner l'impression d'une agence ou d'une équipe fictive.
- Revendiquer de faux clients, résultats commerciaux ou responsabilités.
- Présenter SideQuest comme une application réellement conçue, développée ou déployée par Costa.
- Développer SideQuest dans le cadre du portfolio V1.
- Maximiser le nombre d'effets visuels au détriment du contenu.
- Concevoir ou développer le CRM dans ce dépôt.
- Mesurer le comportement des visiteurs dès la V1.

## 6. Utilisateurs cibles et besoins

### USER-001 — Recruteur technique ou généraliste

- **Contexte — Fait fourni :** découvre le profil spontanément ou l’évalue pour une opportunité junior après la 5A.
- **Besoins :** comprendre rapidement le positionnement full-stack, vérifier les réalisations réelles, distinguer les démonstrations, accéder au CV et contacter Costa.
- **Difficultés à éviter :** navigation déroutante, démonstration présentée comme une mission réelle, contenu technique superficiel, animations qui ralentissent la lecture.
- **Résultat attendu :** déterminer si le profil correspond à une opportunité et s’il mérite un échange approfondi.

### USER-002 — Tech Lead, Engineering Manager ou membre d'une équipe produit

- **Contexte — Hypothèse :** intervient dans l'évaluation technique ou dans la décision de recrutement.
- **Besoins :** consulter les preuves disponibles, comprendre les décisions d'architecture, identifier le rôle réel de Costa et évaluer sa capacité à travailler sur l’ensemble d’un produit.
- **Résultat attendu :** évaluer la rigueur, la capacité de raisonnement, la maintenabilité du travail et la sensibilité produit/UI/UX.

### USER-003 — Développeur, designer ou contact professionnel

- **Statut :** cible secondaire de la V1.
- **Besoins :** découvrir le travail, comprendre le positionnement et disposer d’un point d’entrée clair pour échanger ou partager le profil.
- **Résultat attendu :** identifier rapidement les domaines de compétence de Costa et les projets réellement réalisés.

### USER-004 — Client potentiel

- **Statut :** utilisateur secondaire futur, non prioritaire pour la V1.
- **Besoin futur :** juger la capacité de Costa à créer des applications et sites internet originaux et fiables.

## 7. Proposition de valeur

Pour un recruteur ou un décideur technique recherchant un profil junior full-stack capable de dépasser une exécution purement fonctionnelle, le portfolio démontre cette ambition par sa propre expérience, sa structure, son accessibilité et sa qualité d’exécution. Les projets réels apportent les preuves professionnelles — contexte, rôle, choix, code ou livrables disponibles et résultats vérifiables — tandis que SideQuest permet d’explorer une direction créative sans être confondu avec une réalisation.

## 8. Périmètre V1

### Pages confirmées

- Accueil.
- Liste des projets.
- Détail d'un projet.
- À propos.

### Capacités confirmées

- Expérience intégralement disponible en français et en anglais.
- Catalogue capable d’afficher des projets réels et des projets de démonstration avec une distinction visuelle et éditoriale explicite.
- Présentation de SideQuest comme projet de démonstration non réalisé, sans lui attribuer de rôle, client, résultat, code ou déploiement réel.
- Présentation des projets réels à partir d’informations vérifiables : contexte, contribution de Costa, stack réellement utilisée, décisions, livrables, médias et liens disponibles selon le projet.
- Visuels de démonstration suffisants pour valider le rendu des pages Liste et Détail sans être confondus avec des captures de produit réel.
- Présentation du parcours scolaire, des expériences professionnelles et petits emplois, d'une biographie courte, des stacks et de la manière de travailler.
- Hero avec CTA primaire « Voir mes projets » et CTA secondaire « Me contacter » ; le CV reste accessible hors Hero.
- Téléchargement du CV.
- Accès direct à l'email, à LinkedIn et à GitHub.
- Responsive mobile, tablette et desktop.
- Accessibilité visée : WCAG 2.2 niveau AA.
- Animations compatibles avec `prefers-reduced-motion`.
- Aucun outil d'analytics ni suivi comportemental.

### Limites opérationnelles

- Le contenu des projets est stocké statiquement dans le frontend en V1.
- La liste exacte des projets réels publiés en première version reste à arrêter ; l’interface doit rester cohérente avec un nombre faible de projets sans simuler artificiellement un catalogue plus vaste.
- SideQuest n'a ni application fonctionnelle, ni dépôt de code, ni résultats utilisateurs à produire dans le cadre de cette V1.
- Les projets réels ne peuvent afficher que des informations, liens, médias et résultats que Costa peut effectivement justifier.
- Le CRM n'est ni développé ni déployé dans ce projet.
- La page Contact dédiée n'appartient pas à la V1.

## 9. Évolutions futures envisagées

- V2 : enrichissement progressif du catalogue réel avec de nouveaux projets et, selon les preuves disponibles, davantage de code, captures, vidéos, prototypes Figma et liens.
- V2 : page Contact dédiée et formulaire de contact.
- V2 : analytics respectueux de la vie privée, après définition des mesures et des obligations associées.
- V2/V3 : connexion du frontend à un CRM développé dans un projet indépendant.
- V2/V3 : gestion dynamique des projets et médias depuis ce CRM.
- Évolution de la cible vers des clients potentiels dans la création de sites et d'applications.

Ces éléments sont des intentions, pas une feuille de route validée.

### Jalons de validation et de diffusion

- **V1 de validation :** SideQuest sert à vérifier la composition des pages, la navigation et les interactions. Cette validation ne constitue pas une preuve de développement de SideQuest.
- **Crédibilité professionnelle :** la première version destinée à être partagée comme portfolio professionnel doit comporter au moins une réalisation réelle suffisamment documentée pour apporter une preuve de travail effectivement réalisé.
- **Publication initiale :** la sélection exacte des projets réels à publier reste ouverte (OPEN-010), mais SideQuest ne peut pas constituer à lui seul le contenu de preuve du portfolio.

## 10. Hors périmètre de la V1

- Développement du CRM ou d'un back-office.
- Authentification et comptes utilisateurs.
- Administration du contenu depuis le portfolio.
- Analytics, cookies marketing et suivi comportemental.
- Page Contact dédiée.
- Formulaire de contact.
- Blog.
- Témoignages ou logos de clients fictifs.
- Développement, dépôt GitHub ou déploiement de SideQuest.
- Faux liens vers une démo, un prototype ou du code SideQuest.
- Custom cursor et effets purement gadgets.

## 11. Fonctionnalités priorisées

| ID | Priorité | Fonctionnalité | Besoin couvert | Dépendances |
|---|---|---|---|---|
| FEAT-001 | Must | Accueil de positionnement | Comprendre rapidement le profil, la spécialité et la proposition de valeur | Contenu d'introduction bilingue |
| FEAT-002 | Must | Liste des projets | Parcourir les réalisations réelles et les démonstrations sans ambiguïté | Métadonnées communes et statut explicite de chaque projet |
| FEAT-003 | Must | Détail de projet | Présenter une étude de cas réelle ou une démonstration selon le statut du projet | Contenu vérifiable pour les projets réels ; règles de transparence pour SideQuest |
| FEAT-004 | Must | Page À propos | Comprendre le parcours, la personnalité, les compétences et la méthode | Biographie, parcours, stack |
| FEAT-005 | Must | Expérience bilingue FR/EN | Servir les recruteurs francophones et anglophones | Contenus et CV dans les deux langues |
| FEAT-006 | Must | Téléchargement du CV | Faciliter l'évaluation et la candidature | Deux fichiers CV à jour |
| FEAT-007 | Must | Contact direct et profils externes | Permettre une prise de contact immédiate | Email, LinkedIn, GitHub |
| FEAT-009 | Must | Médias projet | Illustrer les projets avec des médias cohérents avec leur statut | Médias réels pour les réalisations ; visuels explicitement démonstratifs pour SideQuest |
| FEAT-010 | Must | Motion expressive et maîtrisée | Renforcer la personnalité et la mémorisation | Direction motion, performances, réduction du mouvement |
| FEAT-011 | Must | Modèle de contenu statique structuré | Séparer le contenu de la présentation et faciliter son évolution | Structure locale à définir pendant l’architecture technique |
| FEAT-012 | Could | Définition du contrat de données du futur CRM | Préparer une migration ultérieure si le besoin est confirmé | Architecture du CRM indépendant ; aucune intégration en V1 |

## 12. Exigences fonctionnelles

| ID | Fonctionnalité | Exigence |
|---|---|---|
| FR-001 | FEAT-001 | L'accueil présente le nom de Costa, son titre professionnel et son positionnement. La Hero expose le CTA primaire « Voir mes projets » vers la collection de projets et le CTA secondaire « Me contacter » vers les moyens de contact directs. |
| FR-002 | FEAT-001 | L'accueil permet d'accéder à la page À propos, au CV et aux moyens de contact principaux ; le téléchargement du CV n'est pas présenté comme CTA de Hero en V1. |
| FR-003 | FEAT-002 | La liste affiche les projets réellement sélectionnés pour publication, sans faux contenu de remplissage ni compteur trompeur, et distingue explicitement les réalisations réelles des démonstrations. |
| FR-004 | FEAT-002 | Chaque entrée fournit assez de contexte pour comprendre le type de projet, son statut « projet réel » ou « démonstration » et sa nature avant d'ouvrir son détail. |
| FR-005 | FEAT-003 | La liste et le détail identifient explicitement SideQuest comme projet de démonstration non réalisé, en français et en anglais, avant tout contenu pouvant être interprété comme une preuve de réalisation. |
| FR-006 | FEAT-003 | Le détail adapte son contenu au statut du projet : un projet réel décrit uniquement des faits et décisions effectivement liés au travail de Costa ; SideQuest utilise un contenu illustratif sans présenter de raisonnement fictif comme une décision réellement mise en œuvre. |
| FR-007 | FEAT-003 | Le détail n'attribue à SideQuest aucun client, rôle réalisé, code, résultat utilisateur, résultat commercial ou déploiement réel. |
| FR-008 | FEAT-003 | Le détail SideQuest n'affiche aucun lien vers un dépôt, une démo ou un prototype inexistant ; les emplacements futurs peuvent être représentés comme indisponibles uniquement si leur état est explicite et non interactif. |
| FR-009 | FEAT-004 | La page À propos couvre parcours scolaire, expériences et petits emplois pertinents, biographie, stacks et manière de travailler. |
| FR-010 | FEAT-005 | Le visiteur peut changer de langue depuis toutes les pages en conservant la page ou le projet consulté. Le contenu, la navigation, les métadonnées et le CV proposé correspondent à la langue active. |
| FR-011 | FEAT-005 | Les deux versions transmettent les mêmes informations essentielles et utilisent les termes professionnels appropriés à chaque langue. |
| FR-012 | FEAT-006 | Le CV français et le CV anglais peuvent être téléchargés dans un format courant et lisible. |
| FR-013 | FEAT-007 | Les liens email, LinkedIn et GitHub sont accessibles sans passer par une page Contact dédiée. |
| FR-015 | FEAT-009 | Les médias reflètent le statut du projet : les visuels SideQuest disposent d'un contexte textuel et ne sont jamais présentés comme des captures d'une application fonctionnelle ; les médias des projets réels doivent provenir du travail effectivement réalisé ou être explicitement présentés comme reconstitutions. |
| FR-016 | FEAT-010 | Les animations servent la hiérarchie, la compréhension ou les transitions et n'empêchent jamais l'accès au contenu. |
| FR-017 | — | La V1 ne charge aucun outil d'analytics ni traceur comportemental. |
| FR-018 | FEAT-011 | Les données des projets sont stockées dans un modèle local structuré et séparé des composants de présentation. Leur accès est centralisé afin de permettre une évolution de la source sans dupliquer la logique dans les pages. Aucun contrat distant ni intégration CRM n’est requis en V1. |
| FR-019 | — | Chaque page publique est accessible par son URL directe et reste accessible après rechargement, dans les deux langues. |
| FR-020 | — | Une URL inconnue ou un identifiant de projet inexistant affiche une page 404 compréhensible avec un accès à l’accueil ou à la liste des projets. Le statut HTTP et la stratégie de langue des URL inconnues sont définis pendant l’architecture technique. |

## 13. Exigences non fonctionnelles

| ID | Domaine | Niveau attendu | Vérification prévue |
|---|---|---|---|
| NFR-001 | Accessibilité | Viser la conformité WCAG 2.2 AA sur l'ensemble des pages et variantes responsive | Audit automatisé et manuel, clavier, focus, lecteurs d'écran sur parcours critiques |
| NFR-002 | Responsive | Contenu utilisable sans débordement horizontal sur mobile, tablette et desktop | Vérification sur viewports représentatifs, zoom et reflow |
| NFR-003 | Performance | Viser les seuils Core Web Vitals « Good » : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 au 75e percentile des visites, avec évaluation distincte mobile et desktop | Avant livraison : mesures de laboratoire et tests d’interaction selon un protocole documenté. Après publication : validation terrain à partir de données publiques si leur volume est suffisant ; sinon, statut terrain non vérifié. Les mesures de laboratoire ne prouvent pas à elles seules l’atteinte des seuils terrain. Aucun analytics n’est ajouté en V1. |
| NFR-004 | Médias | Images, vidéos et animations ne doivent pas bloquer la consultation du contenu principal | Formats adaptés, chargement différé pertinent, test sur connexion limitée |
| NFR-005 | Motion | Respecter `prefers-reduced-motion`; aucune information indispensable ne dépend d'une animation | Test système avec réduction des mouvements activée |
| NFR-006 | Navigation | Toutes les actions principales sont utilisables au clavier avec un focus visible | Parcours manuel complet au clavier |
| NFR-007 | Internationalisation | Aucun contenu essentiel, libellé, métadonnée ou message fonctionnel ne reste dans la mauvaise langue | Revue des deux locales et tests des routes/états |
| NFR-008 | SEO | Chaque page publique possède un titre, une description et une structure sémantique adaptés ; les pages utiles sont indexables | Audit du rendu HTML, métadonnées, sitemap et robots |
| NFR-009 | Compatibilité | Fonctionnement sur versions courantes de Chrome, Firefox, Safari et Edge | Matrice de tests à préciser dans la stratégie qualité |
| NFR-010 | Maintenabilité | Contenu, présentation et comportement restent séparés ; les composants partagés ne contiennent pas de logique métier | Revue de code et contrôles TypeScript/lint selon la stack validée |
| NFR-011 | Lisibilité | La créativité visuelle ne masque pas le projet, les appels à l'action ou les informations de recrutement | Tests utilisateurs légers et revue UX/UI avant implémentation |

## 14. Parcours critiques à documenter pendant la phase UX

| ID | Acteur et déclencheur | Résultat attendu | Échecs à couvrir |
|---|---|---|---|
| FLOW-001 | Un recruteur arrive sur l'accueil depuis un CV, un profil public ou un lien partagé | Il comprend le positionnement et peut choisir « Voir mes projets » ou « Me contacter » | Proposition de valeur imprécise, CTA invisible, animation bloquante |
| FLOW-002 | Un recruteur consulte la liste | Il distingue immédiatement les projets réels des démonstrations et peut ouvrir le projet pertinent | Statut ambigu, catalogue artificiel, hiérarchie qui met la démonstration au même niveau de preuve qu’une réalisation |
| FLOW-003 | Un visiteur ouvre le détail d’un projet | Il comprend le statut du projet ; un projet réel apporte des preuves vérifiables, tandis que SideQuest montre une structure de démonstration sans être interprété comme une réalisation | Faux lien, faux résultat, rôle inventé, formulation laissant croire à une implémentation réelle |
| FLOW-004 | Un recruteur veut vérifier le parcours | Il consulte À propos puis télécharge le CV correspondant à sa langue | CV absent, obsolète ou mauvaise langue |
| FLOW-005 | Un recruteur veut contacter Costa | Il utilise l'email ou LinkedIn | Lien invalide ou moyen de contact difficile à trouver |
| FLOW-006 | Un visiteur change de langue | Il poursuit sa consultation avec un contenu équivalent | Route inexistante, état ou libellé non traduit |
| FLOW-007 | Un visiteur préfère moins de mouvement | Il bénéficie de la même information sans effets gênants | Contenu masqué ou interaction dépendante de l'animation |

## 15. Critères d'acceptation

| ID | Exigence | Critère vérifiable |
|---|---|---|
| AC-FR-001-01 | FR-001 | Étant donné une arrivée directe sur l'accueil, le nom et le positionnement full-stack sont identifiables sans ouvrir le menu ; les CTA « Voir mes projets » et « Me contacter » sont visibles, libellés sans ambiguïté et conduisent à leur destination prévue. |
| AC-FR-003-01 | FR-003 | La liste ne contient que les projets réellement sélectionnés pour publication ; chaque carte affiche un statut compréhensible et aucune carte de remplissage n’est ajoutée pour simuler un catalogue plus vaste. |
| AC-FR-005-01 | FR-005 | La liste et le détail affichent pour SideQuest une mention équivalente à « projet de démonstration — application non réalisée » dans la langue active avant tout contenu descriptif pouvant être interprété comme une preuve de réalisation. |
| AC-FR-006-01 | FR-006 | Toute décision ou solution décrite pour SideQuest est formulée comme hypothèse de démonstration et non comme travail réellement effectué ; pour un projet réel, les éléments présentés sont traçables à une expérience, un dépôt, un livrable ou une source réellement disponible. |
| AC-FR-007-01 | FR-007 | Une revue éditoriale ne trouve aucun faux client, faux rôle, faux dépôt, faux témoignage, fausse métrique d'usage ou résultat inventé. |
| AC-FR-008-01 | FR-008 | Aucun contrôle actif du détail SideQuest ne prétend ouvrir une ressource inexistante. |
| AC-FR-009-01 | FR-009 | La page À propos permet de retrouver formation, expériences pertinentes, biographie, stack et méthode de travail. |
| AC-FR-010-01 | FR-010 | Depuis chaque type de page V1, le changement de langue ouvre son équivalent et conserve l’identité du projet consulté. Les contenus, libellés, métadonnées et liens de CV correspondent à la langue active. |
| AC-FR-011-01 | FR-011 | Une revue éditoriale confirme que les deux langues couvrent les mêmes informations essentielles sans traduction automatique non relue. |
| AC-FR-012-01 | FR-012 | Chaque locale propose le téléchargement du CV correspondant, et chaque fichier s'ouvre sans erreur. |
| AC-FR-013-01 | FR-013 | Les liens email, LinkedIn et GitHub sont atteignables au clavier et ouvrent la destination attendue. |
| AC-FR-015-01 | FR-015 | Les visuels informatifs possèdent un texte alternatif pertinent ; leur légende ou contexte permet d’identifier leur nature réelle ou démonstrative lorsqu’une ambiguïté est possible. |
| AC-FR-016-01 | FR-016 | Désactiver les animations ne masque aucun texte, lien ou contrôle et n'empêche aucun parcours critique. |
| AC-FR-017-01 | FR-017 | L’audit réseau de production ne détecte aucun script ou appel d’analytics. |
| AC-FR-018-01 | FR-018 | La revue de code confirme que les contenus des projets sont définis dans une source locale structurée, consultée par un accès centralisé, sans intégration CRM ni copie du contenu dans les composants partagés. |
| AC-FR-019-01 | FR-019 | Pour chaque page publique et chaque langue, l’ouverture de l’URL dans une nouvelle session puis le rechargement affichent la page attendue. |
| AC-FR-020-01 | FR-020 | Une route inconnue et un identifiant de projet inexistant affichent un état 404 explicite ; le visiteur peut rejoindre une page valide au clavier. |
| AC-NFR-001-01 | NFR-001 | Une revue automatisée et manuelle couvre les critères WCAG 2.2 de niveaux A et AA applicables à toutes les pages V1, dans les deux langues et leurs états responsive pertinents. Aucune non-conformité identifiée ne subsiste à la validation. Les résultats et limites de l’audit sont documentés ; la seule absence de défaut bloquant sur les parcours critiques ne suffit pas à conclure à la conformité AA. |
| AC-NFR-003-01 | NFR-003 | Avant livraison, un rapport consigne les pages testées, l’appareil ou son émulation, le navigateur, les conditions réseau, les interactions et les résultats de laboratoire. Il distingue ces résultats de la validation terrain au 75e percentile, laissée non vérifiée en l’absence de données suffisantes. |
| AC-NFR-002-01 | NFR-002 | Les quatre pages restent utilisables sans défilement horizontal non intentionnel sur les viewports retenus par la stratégie de test. |
| AC-NFR-005-01 | NFR-005 | Avec `prefers-reduced-motion: reduce`, les mouvements non indispensables sont supprimés ou fortement réduits. |
| AC-NFR-006-01 | NFR-006 | Un utilisateur peut parcourir la navigation, changer de langue, ouvrir le projet, télécharger le CV et contacter Costa au clavier avec un focus visible. |

## 16. Mesures de succès

| ID | Objectif lié | Mesure | V1 | Limite ou cible |
|---|---|---|---|---|
| KPI-001 | OBJ-001, OBJ-002 | Compréhension de la navigation et de la distinction entre projets réels et SideQuest | Test manuel en V1 | Aucun participant ne doit interpréter SideQuest comme une réalisation réelle ; les projets réels doivent être identifiés comme tels |
| KPI-002 | OBJ-005 | Prises de contact, demandes d'entretien ou opportunités junior liées au profil full-stack | Suivi manuel par Costa | Mesure qualitative au démarrage ; aucune cible chiffrée imposée en V1 |
| KPI-003 | OBJ-001 | Consultation de la liste et du détail projet | Non mesurable en V1 sans analytics | À activer en V2 seulement après décision explicite |
| KPI-004 | OBJ-006 | Absence de contenu essentiel manquant dans une locale | Revue éditoriale avant livraison | 100 % des contenus essentiels disponibles en FR et EN |
| KPI-005 | OBJ-003 | Perception « créatif, technique, professionnel et mémorable » | Tests qualitatifs avec quelques personnes représentatives | Méthode et seuil à définir en phase UX/UI |

## 17. Contraintes

### Confirmées

- La stack frontend confirmée pour la V1 est Vue 3 + Vite + TypeScript. Les choix complémentaires — routage, internationalisation, organisation des données, qualité, hébergement et déploiement — sont précisés pendant l’architecture technique.
- Aucun calendrier, budget ou hébergement n’est imposé à ce stade.
- Le site doit être bilingue dès la V1.
- Le CRM reste un projet indépendant.
- La créativité doit rester maîtrisée : le site surprend sans désorienter.
- Les projets restent prioritaires par rapport aux effets et à la décoration.
- À éviter : template développeur générique, CV froid et scolaire, corporate trop sage, expérimentation illisible, animations inutiles, néo-brutalisme copié, custom cursor et surcharge visuelle.

### Direction de marque fournie

- **Identité :** créative, moderne, interactive, professionnelle et mémorable.
- **Positionnement :** mini studio digital personnel, avec une vraie sensibilité UI/UX.
- **Éléments appréciés :** compositions graphiques originales, stickers ou badges, couleurs assumées, animations modernes et expérience vivante.
- **Principe directeur :** « créatif assumé, mais maîtrisé ».

Ces éléments sont des contraintes produit et de marque. Leur traduction en palette, typographie, layout, composants et motion appartient aux phases UI/Figma ultérieures.

## 18. Dépendances

| ID | Dépendance | État | Effet sur la V1 |
|---|---|---|---|
| DEP-001 | Contenu SideQuest servant de démonstration | Concept retenu, contenu à rédiger | Nécessaire pour valider la présentation de FEAT-002 et FEAT-003 sans constituer une preuve professionnelle |
| DEP-002 | Visuels de démonstration SideQuest | À produire pendant la conception | Nécessaires pour valider la composition, sans développement de SideQuest |
| DEP-003 | Biographie, parcours, stack et méthode de travail | À rédiger | Bloque le contenu final de la page À propos |
| DEP-004 | CV français et anglais à jour | À fournir | Bloque FEAT-006 |
| DEP-005 | URL LinkedIn, URL GitHub et email public | À fournir | Bloque FEAT-007 |
| DEP-006 | Traduction et relecture humaine des deux langues | À organiser | Conditionne la qualité de FEAT-005 |
| DEP-007 | Architecture UX et maquette Figma validées | Non commencées | Entrées obligatoires avant implémentation |
| DEP-008 | Sélection et documentation des projets réels V1 | À confirmer | Nécessaire à la crédibilité de la première version publiée comme portfolio professionnel |

## 19. Risques et mitigations

| ID | Risque | Impact | Mitigation proposée |
|---|---|---|---|
| RISK-001 | Le mock SideQuest est perçu comme une réalisation ou une fausse référence client | Perte de confiance | Employer une mention explicite « mock fictif — application non réalisée » sur la liste et le détail ; ne publier aucune preuve ou métrique inventée |
| RISK-002 | SideQuest prend trop de place par rapport aux réalisations réelles | Valeur professionnelle réduite et confusion sur les preuves | Donner la priorité éditoriale aux projets réels et conserver SideQuest comme démonstration clairement secondaire |
| RISK-003 | La direction créative prend le dessus sur les preuves techniques | Objectif de recrutement affaibli | Faire du projet et du raisonnement le centre de la hiérarchie ; tester la compréhension auprès de recruteurs |
| RISK-004 | Les animations dégradent performance ou accessibilité | Abandon, inconfort, échec qualité | Budgets de performance, progressive enhancement, réduction du mouvement et tests sur appareils modestes |
| RISK-005 | Le bilingue double la charge éditoriale | Contenus incohérents ou obsolètes | Modèle de contenu commun, parité contrôlée et relecture des deux langues |
| RISK-007 | Anticiper excessivement le CRM complexifie la V1 | Retard et sur-ingénierie | Limiter la préparation à un modèle de données propre et statique ; aucune intégration réseau en V1 |
| RISK-008 | L'absence d'analytics empêche de mesurer les consultations | KPI-003 indisponible | Utiliser des retours qualitatifs en V1 et définir l'instrumentation seulement en V2 |

## 20. Hypothèses

| ID | Hypothèse | Impact | Validation attendue |
|---|---|---|---|
| HYP-001 | Le recruteur est prêt à consulter une étude de cas approfondie après une introduction courte | Structure et hiérarchie du contenu | Tests de parcours pendant la phase UX |
| HYP-002 | SideQuest suffit comme démonstration pour valider la structure et la direction créative du portfolio, mais pas pour démontrer l’expérience professionnelle | Périmètre de conception distinct du contenu de preuve | Revue UX/UI puis validation de la distinction avec de vrais projets |
| HYP-003 | Les visiteurs anglophones et francophones ont besoin du même périmètre fonctionnel | Charge de traduction et architecture de contenu | Revue des deux versions avant validation UX |

## 21. Questions ouvertes

| ID | Question | Impact | Phase bloquée |
|---|---|---|---|
| OPEN-005 | Qui rédige et qui relit les contenus français et anglais ? | Qualité et planning éditorial | UX/UI et livraison |
| OPEN-006 | Quel email, quelles URL LinkedIn/GitHub et quels fichiers CV seront publiés ? | Contact et téléchargement | Contenu avant implémentation |
| OPEN-007 | Quelle URL permet d'examiner le portfolio actuel en tant qu'anti-référence ? | Audit de l'existant et continuité éventuelle | Direction visuelle |
| OPEN-008 | Quels choix complémentaires à Vue 3 + Vite + TypeScript — notamment routage, internationalisation, stratégie de rendu, hébergement et domaine — seront retenus ? | Architecture technique, SEO et déploiement | Phase technique, pas le PRD |
| OPEN-009 | Quelle méthode qualitative permettra de juger que l’expérience est mémorable sans gêner la lecture ? | KPI-005 et validation UX/UI | Stratégie de validation UX |
| OPEN-010 | Quels projets réels seront inclus dans la première publication et quelles preuves, captures, liens ou résultats peuvent être montrés pour chacun ? | Crédibilité professionnelle, contenu public et hiérarchie de la page Projets | Contenu avant publication ; ne bloque pas la conception du système |

## 22. Historique des validations

| Version | Date | Personne | Décision | Réserves |
|---|---|---|---|---|
| 0.1.0 | 2026-09-14 | — | À travailler | Première synthèse issue du cadrage ; OPEN-001 à OPEN-003 empêchent encore la proposition de validation finale |
| 0.1.1 | 2026-09-14 | Costa Maskulov | À travailler | Titres bilingues validés et absence de recherche active consignée ; le concept du projet reste à choisir |
| 0.2.0 | 2026-09-14 | Costa Maskulov | À valider | SideQuest retenu uniquement comme mock V1 ; toute exigence impliquant son développement ou de fausses preuves a été retirée |
| 0.2.1 | 2026-09-14 | Costa Maskulov | À valider | Mention explicite du mock confirmée ; `FEAT-008`, `FR-014`, `NFR-012`, `DEP-008`, `RISK-006` et `HYP-005` retirés de la V1 avec le formulaire reporté en V2 |
| 0.2.1 | 2026-09-14 | Costa Maskulov | Approuvé | Validation explicite sans réserve dans la conversation |
| 0.3.0 | 2026-10-01 | Costa Maskulov | Révision demandée | Vue.js confirmé ; modèle statique obligatoire et contrat CRM optionnel distingués ; langue, routes, 404 et critères qualité précisés. La stratégie de publication reste ouverte (OPEN-010) ; aucune nouvelle approbation finale n’est consignée. |
| 0.3.1 | 2026-10-01 | Costa Maskulov | Révisé | Objectif professionnel actualisé après obtention du stage de 5A à la CNAM ; cible recentrée sur les opportunités junior ; stack fixée à Vue 3 + Vite + TypeScript ; CTA Hero fixés à « Voir mes projets » / « Me contacter » ; distinction structurante entre projets réels et SideQuest de démonstration. |