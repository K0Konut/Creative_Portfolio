# PRD — Portfolio de Costa Maskulov

## 1. Métadonnées

| Champ | Valeur |
|---|---|
| Produit | Portfolio personnel de Costa Maskulov |
| Titre public français | `Costa Maskulov — Développeur full-stack créatif` |
| Titre public anglais | `Costa Maskulov — Creative Full-Stack Developer` |
| Version | 0.2.1 |
| Statut | Validé |
| Dernière mise à jour | 2026-09-14 |
| Responsable produit | Costa Maskulov |
| Contributeur | Codex |
| Approbateur | Costa Maskulov |

### Sources consultées

- Entretien de cadrage avec Costa Maskulov, 2026-09-14.
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
| DEC-001 | 2026-09-14 | Costa n'est pas en recherche active ; le portfolio prépare sa visibilité et ses futures candidatures à un stage. |
| DEC-002 | 2026-09-14 | Le titre français est « Costa Maskulov — Développeur full-stack créatif ». |
| DEC-003 | 2026-09-14 | Le titre anglais est « Costa Maskulov — Creative Full-Stack Developer ». |
| DEC-004 | 2026-09-14 | SideQuest est uniquement le mock de projet utilisé pour composer et valider le portfolio V1 ; SideQuest ne sera pas développé dans ce périmètre. |
| DEC-005 | 2026-09-14 | La nature de mock de SideQuest doit être indiquée explicitement dans la V1. |
| DEC-006 | 2026-09-14 | Le formulaire et la page Contact sont entièrement reportés en V2. |

## 2. Résumé du produit

Le produit est un portfolio personnel bilingue français–anglais destiné en priorité aux recruteurs, sans campagne de recherche active au lancement. Il doit présenter Costa Maskulov, étudiant en bac+5 spécialisé en software engineering full-stack, préparer ses futures candidatures à un stage, mettre en valeur ses projets comme dans un showroom et démontrer directement sa capacité à concevoir des expériences web créatives, maintenables et techniquement sérieuses.

La V1 comprend une page d'accueil, une liste de projets, une page de détail pour chaque projet et une page À propos. Elle utilise SideQuest comme contenu fictif temporaire afin de composer et valider l'expérience du portfolio ; elle ne prétend pas que SideQuest a été développé. Elle permet également de télécharger le CV et offre des moyens de contact directs. Le futur CRM est un produit séparé : son intégration interviendra seulement après la réalisation indépendante du frontend et du CRM.

## 3. Problème et opportunité

### Situation actuelle

Le portfolio existant remplit une fonction de présentation, mais sa direction artistique ne représente pas suffisamment Costa. Son rendu est perçu comme générique, proche d'un résultat produit par IA et dépourvu de personnalité distinctive.

### Conséquences

- Le portfolio différencie insuffisamment Costa parmi d'autres profils juniors full-stack.
- Il ne démontre pas assez sa sensibilité UI/UX et sa maîtrise du développement créatif.
- Les recruteurs disposent de moins de preuves concernant son raisonnement technique.

### Opportunité

Transformer le portfolio en démonstration par l'exemple : l'expérience du site doit soutenir la crédibilité du profil, tandis que les études de cas expliquent les problèmes traités, les décisions techniques et la qualité d'exécution.

## 4. Objectifs

| ID | Objectif | Résultat recherché |
|---|---|---|
| OBJ-001 | Construire un showroom de projets évolutif | La V1 valide la présentation avec un mock ; les versions suivantes remplacent ou complètent ce mock avec de vrais projets. |
| OBJ-002 | Préparer la démonstration du raisonnement technique | La structure du détail prévoit le problème, les choix, les compromis et les apprentissages sans inventer ces preuves pour le mock V1. |
| OBJ-003 | Construire une identité professionnelle distinctive | L'expérience est créative et mémorable sans réduire la lisibilité ni reléguer les projets au second plan. |
| OBJ-004 | Présenter le parcours et la personnalité | La page À propos relie formation, expériences, méthode de travail, compétences et personnalité. |
| OBJ-005 | Préparer de futures opportunités de stage | Le portfolio est prêt à être partagé lorsque Costa commencera ses candidatures et permet déjà une prise de contact spontanée. |
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

- **Contexte — Fait fourni :** découvre le profil spontanément ou évalue Costa lors d'une future recherche de stage.
- **Besoins :** comprendre son positionnement, examiner la qualité du portfolio lui-même, parcourir la structure prévue pour les projets, accéder au CV et le contacter.
- **Difficultés à éviter :** navigation déroutante, projet fictif présenté comme une mission réelle, contenu technique superficiel, animations qui ralentissent la lecture.
- **Résultat attendu :** décider rapidement si le profil mérite un échange ou une candidature approfondie.

### USER-002 — Responsable technique ou membre d'une équipe produit

- **Contexte — Hypothèse :** intervient dans l'évaluation technique après une première sélection.
- **Besoins :** consulter le code, comprendre les décisions d'architecture et distinguer précisément le travail réalisé par Costa.
- **Résultat attendu :** évaluer la rigueur, la capacité de raisonnement et la maintenabilité du travail.

### USER-003 — Client potentiel

- **Statut :** utilisateur secondaire futur, non prioritaire pour la V1.
- **Besoin futur :** juger la capacité de Costa à créer des applications et sites internet originaux et fiables.

## 7. Proposition de valeur

Pour un recruteur recherchant un profil full-stack capable de dépasser une exécution purement fonctionnelle, le portfolio démontre d'abord cette ambition par sa propre expérience, sa structure, son accessibilité et sa qualité d'exécution. La V1 prépare aussi le format des futures études de cas, qui montreront le résultat, le code et le raisonnement lorsque de vrais projets seront disponibles.

## 8. Périmètre V1

### Pages confirmées

- Accueil.
- Liste des projets.
- Détail d'un projet.
- À propos.

### Capacités confirmées

- Expérience intégralement disponible en français et en anglais.
- Présentation de SideQuest comme mock fictif temporaire, clairement déclaré comme contenu de démonstration non réalisé.
- Mise en situation de la future structure d'une étude de cas, sans présenter de choix techniques ou de résultats fictifs comme des faits.
- Visuels de démonstration suffisants pour valider le rendu des pages Liste et Détail.
- Présentation du parcours scolaire, des expériences professionnelles et petits emplois, d'une biographie courte, des stacks et de la manière de travailler.
- Téléchargement du CV.
- Accès direct à l'email, à LinkedIn et à GitHub.
- Responsive mobile, tablette et desktop.
- Accessibilité visée : WCAG 2.2 niveau AA.
- Animations compatibles avec `prefers-reduced-motion`.
- Aucun outil d'analytics ni suivi comportemental.

### Limites opérationnelles

- Le contenu des projets est stocké statiquement dans le frontend en V1.
- Il n'existe qu'un mock de projet au lancement ; l'interface doit rester cohérente dans cet état sans simuler un catalogue réel plus vaste.
- SideQuest n'a ni application fonctionnelle, ni dépôt de code, ni résultats utilisateurs à produire dans le cadre de cette V1.
- Le CRM n'est ni développé ni déployé dans ce projet.
- La page Contact dédiée n'appartient pas à la V1.

## 9. Évolutions futures envisagées

- V2 : remplacement ou complément du mock SideQuest par de vrais projets, avec code, captures, vidéo, prototype Figma et liens disponibles selon chaque projet.
- V2 : page Contact dédiée et formulaire de contact.
- V2 : analytics respectueux de la vie privée, après définition des mesures et des obligations associées.
- V2/V3 : connexion du frontend à un CRM développé dans un projet indépendant.
- V2/V3 : gestion dynamique des projets et médias depuis ce CRM.
- Évolution de la cible vers des clients potentiels dans la création de sites et d'applications.

Ces éléments sont des intentions, pas une feuille de route validée.

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
| FEAT-002 | Must | Liste des projets | Valider la présentation du catalogue avec le mock SideQuest | Métadonnées et visuels fictifs explicitement signalés |
| FEAT-003 | Must | Détail de projet mocké | Valider la structure des futures études de cas sans simuler une réalisation | Contenu de démonstration SideQuest et mentions de transparence |
| FEAT-004 | Must | Page À propos | Comprendre le parcours, la personnalité, les compétences et la méthode | Biographie, parcours, stack |
| FEAT-005 | Must | Expérience bilingue FR/EN | Servir les recruteurs francophones et anglophones | Contenus et CV dans les deux langues |
| FEAT-006 | Must | Téléchargement du CV | Faciliter l'évaluation et la candidature | Deux fichiers CV à jour |
| FEAT-007 | Must | Contact direct et profils externes | Permettre une prise de contact immédiate | Email, LinkedIn, GitHub |
| FEAT-009 | Must | Médias mockés | Valider la composition visuelle des pages projet | Visuels SideQuest créés uniquement pour la maquette du portfolio |
| FEAT-010 | Must | Motion expressive et maîtrisée | Renforcer la personnalité et la mémorisation | Direction motion, performances, réduction du mouvement |
| FEAT-011 | Could | Préparation du modèle de contenu au futur CRM | Limiter le coût de migration sans intégrer le CRM | Contrat de données à définir pendant l'architecture technique |

## 12. Exigences fonctionnelles

| ID | Fonctionnalité | Exigence |
|---|---|---|
| FR-001 | FEAT-001 | L'accueil présente le nom de Costa, son titre professionnel, son positionnement et un accès visible au projet. |
| FR-002 | FEAT-001 | L'accueil permet d'accéder à la page À propos, au CV et aux moyens de contact principaux. |
| FR-003 | FEAT-002 | La liste affiche le projet disponible sans faux contenu de remplissage ni compteur trompeur. |
| FR-004 | FEAT-002 | Chaque entrée fournit assez de contexte pour comprendre le type de projet avant d'ouvrir son détail. |
| FR-005 | FEAT-003 | La liste et le détail identifient explicitement SideQuest comme mock fictif non réalisé, en français et en anglais. |
| FR-006 | FEAT-003 | Le détail utilise un contenu illustratif pour matérialiser la future structure d'étude de cas sans présenter de raisonnement technique fictif comme une décision réellement mise en œuvre. |
| FR-007 | FEAT-003 | Le détail n'attribue à SideQuest aucun client, rôle réalisé, code, résultat utilisateur, résultat commercial ou déploiement réel. |
| FR-008 | FEAT-003 | Le détail SideQuest n'affiche aucun lien vers un dépôt, une démo ou un prototype inexistant ; les emplacements futurs peuvent être représentés comme indisponibles uniquement si leur état est explicite et non interactif. |
| FR-009 | FEAT-004 | La page À propos couvre parcours scolaire, expériences et petits emplois pertinents, biographie, stacks et manière de travailler. |
| FR-010 | FEAT-005 | Le visiteur peut passer du français à l'anglais depuis toutes les pages. |
| FR-011 | FEAT-005 | Les deux versions transmettent les mêmes informations essentielles et utilisent les termes professionnels appropriés à chaque langue. |
| FR-012 | FEAT-006 | Le CV français et le CV anglais peuvent être téléchargés dans un format courant et lisible. |
| FR-013 | FEAT-007 | Les liens email, LinkedIn et GitHub sont accessibles sans passer par une page Contact dédiée. |
| FR-015 | FEAT-009 | Les visuels SideQuest disposent d'un contexte textuel et ne sont jamais présentés comme des captures d'une application fonctionnelle. |
| FR-016 | FEAT-010 | Les animations servent la hiérarchie, la compréhension ou les transitions et n'empêchent jamais l'accès au contenu. |
| FR-017 | — | La V1 ne charge aucun outil d'analytics ni traceur comportemental. |
| FR-018 | FEAT-011 | Les données statiques du projet sont structurées de façon à pouvoir être remplacées ultérieurement par une source distante sans intégrer le CRM en V1. |

## 13. Exigences non fonctionnelles

| ID | Domaine | Niveau attendu | Vérification prévue |
|---|---|---|---|
| NFR-001 | Accessibilité | Viser la conformité WCAG 2.2 AA sur l'ensemble des pages et variantes responsive | Audit automatisé et manuel, clavier, focus, lecteurs d'écran sur parcours critiques |
| NFR-002 | Responsive | Contenu utilisable sans débordement horizontal sur mobile, tablette et desktop | Vérification sur viewports représentatifs, zoom et reflow |
| NFR-003 | Performance | Viser les seuils Core Web Vitals « Good » : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 | Mesures en laboratoire avant livraison, puis données terrain publiques si disponibles |
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
| FLOW-001 | Un recruteur arrive sur l'accueil depuis un CV ou une candidature | Il comprend le positionnement et ouvre le projet | Proposition de valeur imprécise, CTA invisible, animation bloquante |
| FLOW-002 | Un recruteur consulte la liste | Il comprend que SideQuest sert de mock temporaire et peut en ouvrir le détail | État à un seul élément mal composé, statut fictif ambigu |
| FLOW-003 | Un visiteur ouvre le détail SideQuest | Il découvre la future structure d'une étude de cas sans interpréter SideQuest comme une réalisation | Faux lien, faux résultat, formulation laissant croire à une implémentation réelle |
| FLOW-004 | Un recruteur veut vérifier le parcours | Il consulte À propos puis télécharge le CV correspondant à sa langue | CV absent, obsolète ou mauvaise langue |
| FLOW-005 | Un recruteur veut contacter Costa | Il utilise l'email ou LinkedIn | Lien invalide ou moyen de contact difficile à trouver |
| FLOW-006 | Un visiteur change de langue | Il poursuit sa consultation avec un contenu équivalent | Route inexistante, état ou libellé non traduit |
| FLOW-007 | Un visiteur préfère moins de mouvement | Il bénéficie de la même information sans effets gênants | Contenu masqué ou interaction dépendante de l'animation |

## 15. Critères d'acceptation

| ID | Exigence | Critère vérifiable |
|---|---|---|
| AC-FR-001-01 | FR-001 | Étant donné une arrivée directe sur l'accueil, le nom, le positionnement full-stack et l'accès au projet sont identifiables sans ouvrir le menu. |
| AC-FR-003-01 | FR-003 | Avec le seul mock SideQuest publié, la liste ne contient ni carte fictive supplémentaire ni zone vide présentée comme une erreur. |
| AC-FR-005-01 | FR-005 | La liste et le détail affichent une mention équivalente à « mock fictif — application non réalisée » dans la langue active avant tout contenu descriptif ambigu. |
| AC-FR-006-01 | FR-006 | Toute décision ou solution décrite pour SideQuest est formulée comme hypothèse de démonstration et non comme travail réellement effectué. |
| AC-FR-007-01 | FR-007 | Une revue éditoriale ne trouve aucun faux client, faux rôle, faux dépôt, faux témoignage, fausse métrique d'usage ou résultat inventé. |
| AC-FR-008-01 | FR-008 | Aucun contrôle actif du détail SideQuest ne prétend ouvrir une ressource inexistante. |
| AC-FR-009-01 | FR-009 | La page À propos permet de retrouver formation, expériences pertinentes, biographie, stack et méthode de travail. |
| AC-FR-010-01 | FR-010 | Depuis chacune des quatre pages de la V1, le visiteur peut basculer vers l'autre langue. |
| AC-FR-011-01 | FR-011 | Une revue éditoriale confirme que les deux langues couvrent les mêmes informations essentielles sans traduction automatique non relue. |
| AC-FR-012-01 | FR-012 | Chaque locale propose le téléchargement du CV correspondant, et chaque fichier s'ouvre sans erreur. |
| AC-FR-013-01 | FR-013 | Les liens email, LinkedIn et GitHub sont atteignables au clavier et ouvrent la destination attendue. |
| AC-FR-015-01 | FR-015 | Les visuels informatifs possèdent un texte alternatif pertinent et leur légende indique leur nature de mock lorsque le contexte pourrait être ambigu. |
| AC-FR-016-01 | FR-016 | Désactiver les animations ne masque aucun texte, lien ou contrôle et n'empêche aucun parcours critique. |
| AC-FR-017-01 | FR-017 | L'audit réseau de production ne détecte aucun script ou appel d'analytics. |
| AC-NFR-001-01 | NFR-001 | Aucun défaut WCAG 2.2 AA bloquant connu ne subsiste sur les parcours critiques au moment de la validation. |
| AC-NFR-002-01 | NFR-002 | Les quatre pages restent utilisables sans défilement horizontal non intentionnel sur les viewports retenus par la stratégie de test. |
| AC-NFR-005-01 | NFR-005 | Avec `prefers-reduced-motion: reduce`, les mouvements non indispensables sont supprimés ou fortement réduits. |
| AC-NFR-006-01 | NFR-006 | Un utilisateur peut parcourir la navigation, changer de langue, ouvrir le projet, télécharger le CV et contacter Costa au clavier avec un focus visible. |

## 16. Mesures de succès

| ID | Objectif lié | Mesure | V1 | Limite ou cible |
|---|---|---|---|---|
| KPI-001 | OBJ-001, OBJ-002 | Compréhension de la navigation et du statut fictif de SideQuest lors d'une revue qualitative | Test manuel en V1 | Aucun participant ne doit interpréter SideQuest comme une réalisation réelle |
| KPI-002 | OBJ-005 | Prises de contact spontanées, puis demandes d'entretien ou offres de stage lorsque la recherche commencera | Suivi manuel par Costa | Aucune cible tant que Costa n'est pas en recherche active |
| KPI-003 | OBJ-001 | Consultation de la liste et du détail projet | Non mesurable en V1 sans analytics | À activer en V2 seulement après décision explicite |
| KPI-004 | OBJ-006 | Absence de contenu essentiel manquant dans une locale | Revue éditoriale avant livraison | 100 % des contenus essentiels disponibles en FR et EN |
| KPI-005 | OBJ-003 | Perception « créatif, technique, professionnel et mémorable » | Tests qualitatifs avec quelques personnes représentatives | Méthode et seuil à définir en phase UX/UI |

## 17. Contraintes

### Confirmées

- Aucun calendrier, budget, hébergement ou framework n'est imposé à ce stade.
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
| DEP-001 | Contenu fictif SideQuest servant de mock | Concept retenu, contenu à rédiger | Nécessaire pour composer FEAT-002 et FEAT-003 |
| DEP-002 | Visuels mockés SideQuest | À produire pendant la conception | Nécessaires pour valider la composition, sans développement de SideQuest |
| DEP-003 | Biographie, parcours, stack et méthode de travail | À rédiger | Bloque le contenu final de la page À propos |
| DEP-004 | CV français et anglais à jour | À fournir | Bloque FEAT-006 |
| DEP-005 | URL LinkedIn, URL GitHub et email public | À fournir | Bloque FEAT-007 |
| DEP-006 | Traduction et relecture humaine des deux langues | À organiser | Conditionne la qualité de FEAT-005 |
| DEP-007 | Architecture UX et maquette Figma validées | Non commencées | Entrées obligatoires avant implémentation |

## 19. Risques et mitigations

| ID | Risque | Impact | Mitigation proposée |
|---|---|---|---|
| RISK-001 | Le mock SideQuest est perçu comme une réalisation ou une fausse référence client | Perte de confiance | Employer une mention explicite « mock fictif — application non réalisée » sur la liste et le détail ; ne publier aucune preuve ou métrique inventée |
| RISK-002 | Le mock unique donne l'impression d'un portfolio final sans projet réel | Valeur perçue réduite | Présenter la V1 comme une version de validation et remplacer le mock par de vrais projets avant une utilisation intensive pour candidater |
| RISK-003 | La direction créative prend le dessus sur les preuves techniques | Objectif de recrutement affaibli | Faire du projet et du raisonnement le centre de la hiérarchie ; tester la compréhension auprès de recruteurs |
| RISK-004 | Les animations dégradent performance ou accessibilité | Abandon, inconfort, échec qualité | Budgets de performance, progressive enhancement, réduction du mouvement et tests sur appareils modestes |
| RISK-005 | Le bilingue double la charge éditoriale | Contenus incohérents ou obsolètes | Modèle de contenu commun, parité contrôlée et relecture des deux langues |
| RISK-007 | Anticiper excessivement le CRM complexifie la V1 | Retard et sur-ingénierie | Limiter la préparation à un modèle de données propre et statique ; aucune intégration réseau en V1 |
| RISK-008 | L'absence d'analytics empêche de mesurer les consultations | KPI-003 indisponible | Utiliser des retours qualitatifs en V1 et définir l'instrumentation seulement en V2 |

## 20. Hypothèses

| ID | Hypothèse | Impact | Validation attendue |
|---|---|---|---|
| HYP-001 | Le recruteur est prêt à consulter une étude de cas approfondie après une introduction courte | Structure et hiérarchie du contenu | Tests de parcours pendant la phase UX |
| HYP-002 | SideQuest suffit comme mock pour valider la structure et la direction du portfolio V1 | Périmètre de conception, pas crédibilité professionnelle finale | Revue UX/UI avant remplacement par de vrais projets |
| HYP-003 | Les visiteurs anglophones et francophones ont besoin du même périmètre fonctionnel | Charge de traduction et architecture de contenu | Revue des deux versions avant validation UX |

## 21. Questions ouvertes

| ID | Question | Impact | Phase bloquée |
|---|---|---|---|
| OPEN-005 | Qui rédige et qui relit les contenus français et anglais ? | Qualité et planning éditorial | UX/UI et livraison |
| OPEN-006 | Quel email, quelles URL LinkedIn/GitHub et quels fichiers CV seront publiés ? | Contact et téléchargement | Contenu avant implémentation |
| OPEN-007 | Quelle URL permet d'examiner le portfolio actuel en tant qu'anti-référence ? | Audit de l'existant et continuité éventuelle | Direction visuelle |
| OPEN-008 | Quelle stack, quel hébergement et quel domaine seront retenus ? | Architecture technique et déploiement | Phase technique, pas le PRD |
| OPEN-009 | Quelle méthode qualitative permettra de juger que l'expérience est mémorable sans gêner la lecture ? | KPI-005 et validation UX/UI | Stratégie de validation UX |

## 22. Historique des validations

| Version | Date | Personne | Décision | Réserves |
|---|---|---|---|---|
| 0.1.0 | 2026-09-14 | — | À travailler | Première synthèse issue du cadrage ; OPEN-001 à OPEN-003 empêchent encore la proposition de validation finale |
| 0.1.1 | 2026-09-14 | Costa Maskulov | À travailler | Titres bilingues validés et absence de recherche active consignée ; le concept du projet reste à choisir |
| 0.2.0 | 2026-09-14 | Costa Maskulov | À valider | SideQuest retenu uniquement comme mock V1 ; toute exigence impliquant son développement ou de fausses preuves a été retirée |
| 0.2.1 | 2026-09-14 | Costa Maskulov | À valider | Mention explicite du mock confirmée ; `FEAT-008`, `FR-014`, `NFR-012`, `DEP-008`, `RISK-006` et `HYP-005` retirés de la V1 avec le formulaire reporté en V2 |
| 0.2.1 | 2026-09-14 | Costa Maskulov | Approuvé | Validation explicite sans réserve dans la conversation |
