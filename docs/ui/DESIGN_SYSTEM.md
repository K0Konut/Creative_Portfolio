# Fondations du design system — Portfolio de Costa Maskulov

## 1. Métadonnées

| Champ | Valeur |
|---|---|
| Produit | Portfolio personnel de Costa Maskulov |
| Version | 0.11.0 |
| Statut | Validé par Costa le 2026-09-16 |
| Dernière mise à jour | 2026-09-16 |
| Date de validation | 2026-09-16 |
| Périmètre | Fondations visuelles, responsive, accessibles et motion de la V1 bilingue |
| Source produit | `docs/product/PRD.md` v0.2.1, validé le 2026-09-14 |
| Source UX | `docs/ux/USER_FLOWS.md` v0.3.1, validé le 2026-09-15 |
| Source pages | `docs/ux/PAGE_ARCHITECTURE.md` v0.1.1, validé le 2026-09-15 |
| Source composants | `docs/ui/COMPONENT_INVENTORY.md` v0.2.0, validé le 2026-09-16 |
| Source complémentaire | Brief `$impeccable shape` validé par Costa le 2026-09-16, tirage `fbe634a4`, mode `Experience` |
| Composition de référence | `.impeccable/mocks/decision/model-pick-modular-studio.png`, sélectionnée en mode comp-led |
| Décision typographique | League Gothic, Manrope et Fraunces Italic validées par Costa le 2026-09-16 |
| Échelle typographique | Bornes responsive et règles de composition validées par Costa le 2026-09-16 |
| Décision chromatique | Palette sémantique et matrice de contraste validées par Costa le 2026-09-16 |
| Décision spatiale | Échelle d'espacement et dimensions fonctionnelles validées par Costa le 2026-09-16 |
| Décision responsive | Grille, conteneurs et règles de reflow validés par Costa le 2026-09-16 |
| Décision géométrique | Surfaces, contours, rayons et élévations validés par Costa le 2026-09-16 |
| Décision iconographique | Set fonctionnel, marques éditoriales et règles média validés par Costa le 2026-09-16 |
| Décision motion | Tokens, comportements, interruptions et mouvement réduit validés par Costa le 2026-09-16 |
| Approbateur attendu | Costa Maskulov |

## 2. Finalité et statut

Ce document définit les fondations visuelles nécessaires à la future maquette Figma : couleurs, typographies, espacements, grilles, iconographie, surfaces, bordures, ombres, responsive, accessibilité et principes de motion. Il fixe des rôles, des aliases et des règles d'usage avant la création des variables et composants Figma.

La revue documentaire d'accessibilité, de cohérence des aliases et de couverture des états est terminée. Costa a validé explicitement la version 0.11.0 le 2026-09-16. Cette validation clôt les fondations V1 ; une revue transversale de tous les documents validés sera néanmoins réalisée avant de démarrer la maquette Figma. Elle n'autorise encore ni l'architecture technique ni l'implémentation.

## 3. Contraintes validées héritées

- L'expérience doit évoquer un mini studio digital personnel : créatif, moderne, interactif, professionnel et mémorable.
- La direction doit rester « créative assumée, mais maîtrisée ».
- Les projets, les contenus de recrutement et la lisibilité restent prioritaires sur les effets décoratifs.
- La V1 doit viser WCAG 2.2 niveau AA, rester utilisable au clavier, supporter le zoom et le reflow et ne transmettre aucune information par la couleur seule.
- Les compositions doivent fonctionner sur mobile, tablette et desktop sans débordement horizontal non intentionnel.
- Toute motion doit avoir une fonction, rester non bloquante et proposer un comportement compatible avec `prefers-reduced-motion`.
- Les interfaces génériques, le CV froid ou scolaire, le corporate trop sage, l'expérimentation illisible, le néo-brutalisme copié, le custom cursor et la surcharge visuelle sont des anti-références.

### Résultat perceptif prioritaire

Si un recruteur ne consulte que le premier écran, il doit retenir que **Costa est un développeur full-stack qui sait créer des expériences web singulières**. La future direction devra démontrer cette association entre capacité technique et création dès la première vue, sans la réduire à une affirmation promotionnelle ni donner l'impression d'une agence.

## 4. Direction visuelle validée — Studio graphique modulaire

Costa a sélectionné la direction **Studio graphique modulaire** sur la planche Impeccable, puis validé son brief le 2026-09-16. Cette décision fixe le monde visuel, la logique de composition et les principes d'interaction. La composition choisie reste une north star : elle ne valide pas encore les valeurs exactes, les composants, les adaptations responsive ni les écrans Figma.

### 4.1 Intention et preuve attendue

Le portfolio se comporte comme un studio personnel qui expose ses projets sous forme d'épreuves et de fiches de production. La grille structurée rend perceptible la rigueur full-stack ; la typographie, les couleurs assumées et les annotations éditoriales expriment la sensibilité UI/UX.

Le premier écran doit réunir sans ambiguïté :

- le nom et le positionnement de Costa ;
- une promesse courte centrée sur les expériences web singulières ;
- une action principale vers la collection Projets ;
- un module SideQuest dominant et explicitement marqué « mock fictif — application non réalisée » ;
- une navigation directe vers Projets, À propos et le changement de langue.

### 4.2 Grammaire de composition

| Dimension | Règle validée | Limite |
|---|---|---|
| Grille | Composition asymétrique et modulaire, inspirée des murs d'épreuves et fiches de production | L'ordre de lecture et les actions ne dépendent jamais du placement décoratif |
| Surface | Crème comme toile principale de lecture ; grands modules violets pour les moments identitaires | Aucun thème sombre global n'est créé sans besoin validé |
| Couleurs d'accent | Lime réservé aux actions principales et états prioritaires ; rose réservé aux annotations et accents éditoriaux | Aucun état ni statut n'est transmis par la couleur seule |
| Typographie | Display condensée monumentale, sans-serif fonctionnelle et serif italique ponctuelle | Les voix expressives ne portent pas les informations longues ou critiques |
| Projet | SideQuest occupe un module central avec statut, contexte, métadonnées et action lisibles sans survol | Aucun faux résultat, client, rôle, dépôt ou déploiement |
| Matière | Papier subtil, traits d'impression, repères de coupe et étiquettes de production utilisés avec parcimonie | Aucun collage désordonné, néo-brutalisme copié ou effet qui concurrence le contenu |

### 4.3 Interaction, responsive et motion

- La transition signature réorganise la grille comme une planche de production lorsqu'un projet est ouvert ; elle accompagne le changement de contexte sans masquer le contenu.
- Les modules se recomposent selon la largeur disponible en préservant l'ordre éditorial, les statuts, les actions prioritaires et la navigation clavier.
- La version mobile conserve une hiérarchie intentionnelle ; elle ne se réduit pas à un empilement arbitraire de la grille desktop.
- Avec `prefers-reduced-motion: reduce`, la réorganisation devient directe ou utilise une transition courte sans déplacement spatial important.
- Les états focus, actif, erreur, chargement et média indisponible restent visibles dans la même grammaire graphique.

## 5. Fondations visuelles

Les éléments ci-dessous traduisent la direction validée en fondations. La typographie, la palette, l'échelle spatiale, la grille, la géométrie, l'iconographie et les fondations de motion sont validées. Leur contrat accessible et leur correspondance Figma–code ont passé la revue documentaire finale et l'ensemble du livrable est approuvé pour la V1.

### 5.1 Palette de référence

| Rôle envisagé | Valeur de référence | Statut |
|---|---:|---|
| Primary / fond Hero | `#4B3CFF` | Validée comme `violet/500` |
| Accent 1 / CTA principal | `#C7FF00` | Validée comme `lime/500` |
| Accent 2 / stickers | `#FF6BD6` | Validée comme `pink/500` |
| Background dark | `#101113` | Validée comme `neutral/950` |
| Gris secondaire / muted | `#474747` | Validée comme `neutral/700` |
| Texte clair / crème | `#F5F1E8` | Validée comme `neutral/50` |
| Doodles / violet profond | `#17105B` | Validée comme `violet/700` |
| Surface crème secondaire | `#E8E1D4` | Validée comme `neutral/100` |
| Surface sombre secondaire | `#2A2A2D` | Non retenue : aucun rôle distinct de `surface/inverse` en V1 |

Relations chromatiques confirmées :

- violet et crème pour les zones fortes ;
- lime et noir pour les actions principales ;
- rose et noir pour les stickers ou accents éditoriaux.

Les contrastes numériques sont vérifiés dans la palette sémantique en section 5.4. Ils devront être contrôlés de nouveau sur les composants et compositions réels, notamment pour le texte, les actions, les bordures, les états interactifs et le focus.

La palette finale préserve l'identité **violet–crème–lime–rose** et les rôles associés. Toute évolution future d'une primitive exigera de recalculer ses paires de contraste et de vérifier ses alias consommateurs.

### 5.2 Système typographique validé

Le système conserve trois voix complémentaires : **impact** pour le display, **lisibilité** pour le texte et l'interface, **personnalité** pour l'accent éditorial.

| Fonction | Famille finale | Configuration retenue | Usage principal |
|---|---|---|---|
| Display | League Gothic | Variable `wdth` 75–100, graisse 400 | Hero, titres de page, titres de section courts et mots d'impact |
| Texte et interface | Manrope | Variable `wght` 200–800 ; graisses consommées 400, 500 et 700 | Paragraphes, navigation, actions, cartes, tags, statuts et métadonnées |
| Accent éditorial | Fraunces Italic | Variable `SOFT`, `WONK`, `opsz`, `wght` ; graisse cible 500 | Expressions courtes, annotations et accents éditoriaux |

Les trois familles sont distribuées sous SIL Open Font License 1.1, comprennent les sous-ensembles `latin` et `latin-ext` nécessaires au français et à l'anglais et peuvent être auto-hébergées avec le produit. Sources de référence : [League Gothic](https://github.com/google/fonts/tree/main/ofl/leaguegothic), [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope) et [Fraunces](https://github.com/google/fonts/tree/main/ofl/fraunces).

HUMANE et Satoshi restent des références de caractère, mais ne sont pas retenues comme dépendances finales. Leur licence ITF FFL autorise l'usage web tout en interdisant le font serving autonome sans accord préalable ; elle ne répond donc pas au besoin d'auto-hébergement maîtrisé dans le dépôt.

Règles d'usage :

- League Gothic reste strictement réservée aux textes courts et expressifs. Elle ne porte jamais une information fonctionnelle, un paragraphe, une action, un statut ou une métadonnée.
- Manrope porte tout contenu indispensable à la compréhension ou à l'interaction. La graisse 400 sert le texte courant, 500 les emphases modérées et 700 les titres fonctionnels et libellés prioritaires.
- Fraunces Italic intervient ponctuellement. Elle ne remplace jamais Manrope pour un message critique et ne s'utilise pas dans un paragraphe long.
- Aucun faux gras ou faux italique n'est autorisé. Une variante absente est remplacée par la variante prévue la plus proche.
- L'implémentation chargera uniquement les variantes réellement utilisées, en `woff2`, avec `font-display: swap` et une pile de secours adaptée. Les fichiers de licence accompagneront les fontes auto-hébergées.

### 5.3 Échelle typographique validée

Les valeurs « mobile » et « large » sont les bornes du système. Entre les deux, les styles display, heading et editorial évoluent de manière fluide ; les textes fonctionnels restent plus stables afin de préserver la lecture et le zoom.

| Token sémantique | Famille | Mobile | Large | Graisse / largeur | Interligne | Usage |
|---|---|---:|---:|---|---:|---|
| `display/hero` | League Gothic | 80 px | 192 px | 400 / `wdth` 75 | 0,82 | Signature principale de la hero, deux lignes maximum |
| `display/page` | League Gothic | 64 px | 128 px | 400 / `wdth` 78 | 0,84 | Titre d'une page |
| `display/section` | League Gothic | 48 px | 80 px | 400 / `wdth` 82 | 0,88 | Titre court d'une grande section |
| `heading/xl` | Manrope | 32 px | 48 px | 700 | 1,08 | Titre fonctionnel majeur ou introduction |
| `heading/lg` | Manrope | 28 px | 36 px | 700 | 1,15 | Titre de module ou de projet |
| `heading/md` | Manrope | 22 px | 24 px | 700 | 1,25 | Sous-section et carte |
| `body/lg` | Manrope | 18 px | 20 px | 400 | 1,60 | Introduction et texte éditorial mis en avant |
| `body/md` | Manrope | 16 px | 18 px | 400 | 1,60 | Texte courant |
| `body/sm` | Manrope | 14 px | 14 px | 500 | 1,50 | Texte secondaire non critique |
| `label/md` | Manrope | 15 px | 16 px | 700 | 1,20 | Navigation, bouton, onglet et contrôle |
| `label/sm` | Manrope | 13 px | 14 px | 700 | 1,30 | Tag, statut et métadonnée courte |
| `editorial/lg` | Fraunces Italic | 32 px | 56 px | 500 | 1,00 | Accent éditorial isolé |
| `editorial/md` | Fraunces Italic | 22 px | 32 px | 500 | 1,15 | Annotation ou sticker textuel court |

Règles de composition :

- Les tailles intermédiaires sont interpolées selon la largeur disponible ; elles ne changent pas brutalement à un breakpoint arbitraire.
- Un titre display occupe au maximum deux lignes sur grand écran et trois lignes sur mobile. Les retours sont composés et validés séparément en français et en anglais.
- La césure automatique est désactivée pour le display. Aucun mot n'est artificiellement compressé pour entrer dans un module.
- Le texte courant vise 60 à 72 caractères par ligne ; une largeur supérieure nécessite une justification éditoriale.
- Les libellés fonctionnels ne descendent jamais sous 15 px. Le style `label/sm` est réservé aux statuts et métadonnées courtes qui ne constituent pas l'action principale.
- L'usage des capitales reste ponctuel. Lorsqu'elles sont retenues pour un label court, l'espacement des lettres est compris entre `0.04em` et `0.06em` et la formulation reste immédiatement compréhensible.
- Les valeurs seront contrôlées à 200 % de zoom, en reflow à 320 px CSS et avec les contenus FR/EN réels avant validation finale.
- Les conteneurs textuels doivent accepter sans perte de contenu ni de fonctionnalité un interligne de 1,5 fois la taille du texte, un espace après paragraphe de 2 fois cette taille, un espacement des lettres de 0,12 fois et des mots de 0,16 fois. Les hauteurs fixes, troncatures et chevauchements qui empêchent ces ajustements sont interdits, conformément à [WCAG 2.2 AA 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing).

### 5.4 Palette sémantique validée

La palette conserve le monde violet–crème–lime–rose validé. Les valeurs primitives décrivent la matière ; les écrans et composants consommeront les alias sémantiques, jamais une primitive sans rôle explicite. Aucun mode sombre global n'est créé : `surface/inverse` désigne seulement les modules sombres nécessaires à la composition.

#### Valeurs primitives

| Primitive | Valeur | Fonction |
|---|---:|---|
| `neutral/950` | `#101113` | Encre principale et surface inverse |
| `neutral/700` | `#474747` | Texte secondaire |
| `neutral/500` | `#827E76` | Contour perceptible sur les deux surfaces crème |
| `neutral/100` | `#E8E1D4` | Surface crème secondaire |
| `neutral/50` | `#F5F1E8` | Toile principale et texte clair |
| `violet/700` | `#17105B` | Violet profond, lien actif et état appuyé |
| `violet/600` | `#3D2EE8` | État survolé du violet |
| `violet/500` | `#4B3CFF` | Identité principale |
| `lime/700` | `#98CC00` | Action principale active |
| `lime/600` | `#B0E600` | Action principale survolée |
| `lime/500` | `#C7FF00` | Action principale |
| `pink/700` | `#D640AC` | Accent éditorial actif |
| `pink/600` | `#EB55C3` | Accent éditorial survolé |
| `pink/500` | `#FF6BD6` | Accent éditorial |
| `feedback/error-strong` | `#8A1C12` | Texte et icône d'erreur |
| `feedback/error-subtle` | `#FDE7E2` | Surface d'erreur |
| `feedback/success-strong` | `#14532D` | Texte et icône de réussite |
| `feedback/success-subtle` | `#DDF4E4` | Surface de réussite |
| `feedback/warning-strong` | `#6B4500` | Texte et icône d'avertissement |
| `feedback/warning-subtle` | `#FFF1C7` | Surface d'avertissement |
| `feedback/info-subtle` | `#E7E9FF` | Surface d'information ; premier plan `violet/700` |

#### Alias et usages

| Alias sémantique | Primitive ou valeur | Usage autorisé |
|---|---|---|
| `surface/canvas` | `neutral/50` | Fond principal de lecture |
| `surface/subtle` | `neutral/100` | Groupe secondaire, panneau ou alternance éditoriale |
| `surface/brand` | `violet/500` | Grand module identitaire |
| `surface/inverse` | `neutral/950` | Média, panneau ponctuel ou contraste fonctionnel |
| `surface/action-primary` | `lime/500` | CTA principal uniquement |
| `surface/action-primary-hover` | `lime/600` | Survol du CTA principal |
| `surface/action-primary-active` | `lime/700` | Activation du CTA principal |
| `surface/action-secondary` | `violet/500` | Action secondaire sur surface claire |
| `surface/action-secondary-hover` | `violet/600` | Survol de l'action secondaire |
| `surface/action-secondary-active` | `violet/700` | Activation de l'action secondaire |
| `surface/editorial` | `pink/500` | Sticker, annotation ou accent non critique |
| `surface/editorial-hover` | `pink/600` | Survol d'un accent éditorial interactif autorisé |
| `surface/editorial-active` | `pink/700` | Activation d'un accent éditorial interactif autorisé |
| `surface/paper` | `neutral/50` | Note, fiche ou légende superposée ; le papier secondaire utilise `surface/subtle` |
| `surface/disabled` | `neutral/100` | Contrôle natif réellement indisponible |
| `surface/error` | `feedback/error-subtle` | Message ou groupe en erreur |
| `surface/success` | `feedback/success-subtle` | Confirmation utile |
| `surface/warning` | `feedback/warning-subtle` | Avertissement non bloquant |
| `surface/info` | `feedback/info-subtle` | Information contextuelle |
| `text/primary` | `neutral/950` | Texte essentiel sur surfaces claires |
| `text/secondary` | `neutral/700` | Information secondaire sur surfaces claires |
| `text/on-brand` | `neutral/50` | Texte sur violet |
| `text/on-inverse` | `neutral/50` | Texte sur surface sombre |
| `text/on-accent` | `neutral/950` | Texte sur lime ou rose |
| `text/link` | `violet/500` | Lien dans une surface claire ; soulignement ou autre indice obligatoire |
| `text/link-active` | `violet/700` | Survol, focus ou état actif du lien |
| `text/disabled` | `neutral/700` | Libellé lisible d'un contrôle réellement indisponible ; jamais seul indice d'état |
| `text/error` | `feedback/error-strong` | Texte et icône d'erreur sur `surface/error` |
| `text/success` | `feedback/success-strong` | Texte et icône de réussite sur `surface/success` |
| `text/warning` | `feedback/warning-strong` | Texte et icône d'avertissement sur `surface/warning` |
| `text/info` | `violet/700` | Texte et icône d'information sur `surface/info` |
| `border/default` | `neutral/500` | Contour fonctionnel sur surfaces crème |
| `border/strong` | `neutral/950` | Séparation forte ou composant prioritaire |
| `border/inverse` | `neutral/50` | Contour fonctionnel sur violet ou sombre |
| `focus/inner` | `neutral/50` | Anneau intérieur du focus bicolore |
| `focus/outer` | `neutral/950` | Anneau extérieur du focus bicolore |

Le texte conserve son alias prévu pendant les transitions d'état. Un contrôle `disabled` n'est utilisé que lorsqu'une action temporairement indisponible doit rester perceptible ; un lien sans destination est retiré ou remplacé par une information. L'état ne repose jamais sur une baisse d'opacité seule : libellé, attribut sémantique et absence d'interaction restent cohérents.

#### Matrice de contraste contrôlée

| Premier plan / arrière-plan | Ratio | Usage | Résultat WCAG 2.2 AA |
|---|---:|---|---|
| `neutral/950` / `neutral/50` | 16,76:1 | Texte principal sur toile | Conforme texte |
| `neutral/700` / `neutral/50` | 8,24:1 | Texte secondaire sur toile | Conforme texte |
| `neutral/950` / `neutral/100` | 14,53:1 | Texte principal sur surface secondaire | Conforme texte |
| `violet/500` / `neutral/50` | 5,50:1 | Lien sur toile | Conforme texte |
| `violet/500` / `neutral/100` | 4,77:1 | Lien sur surface secondaire | Conforme texte |
| `neutral/50` / `violet/500` | 5,50:1 | Texte sur module identitaire | Conforme texte |
| `neutral/950` / `lime/500` | 15,95:1 | CTA principal | Conforme texte |
| `neutral/950` / `lime/600` | 12,74:1 | CTA principal survolé | Conforme texte |
| `neutral/950` / `lime/700` | 9,87:1 | CTA principal actif | Conforme texte |
| `neutral/950` / `pink/500` | 7,49:1 | Texte sur accent éditorial | Conforme texte |
| `neutral/950` / `pink/600` | 5,96:1 | Accent éditorial survolé | Conforme texte |
| `neutral/950` / `pink/700` | 4,67:1 | Accent éditorial actif | Conforme texte |
| `neutral/500` / `neutral/100` | 3,11:1 | Contour fonctionnel | Conforme non-texte |
| `neutral/500` / `neutral/50` | 3,59:1 | Contour fonctionnel sur toile | Conforme non-texte |
| `text/disabled` / `surface/disabled` | 7,15:1 | Libellé d'un contrôle indisponible | Conforme texte |
| `text/error` / `surface/error` | 7,85:1 | Message et état d'erreur | Conforme texte |
| `text/success` / `surface/success` | 7,87:1 | Message et état de succès | Conforme texte |
| `text/warning` / `surface/warning` | 7,53:1 | Message et état d'attention | Conforme texte |
| `text/info` / `surface/info` | 13,87:1 | Message informatif | Conforme texte |

Le focus utilise deux anneaux simultanés, crème à l'intérieur et sombre à l'extérieur. Cette combinaison garantit qu'au moins un anneau reste contrasté sur le crème, le sombre, le violet, le lime et le rose. Une couleur de feedback est toujours accompagnée d'un libellé, d'une icône ou d'une structure explicite ; elle ne porte jamais seule le sens.

### 5.5 Espacements et dimensions validés

Le rythme repose sur une unité de 4 px sans imposer toutes ses multiplications possibles. Les primitives suivantes couvrent les composants et compositions V1 identifiés ; toute valeur supplémentaire devra répondre à un usage réel.

#### Échelle primitive

| Token | Valeur | Usage dominant |
|---|---:|---|
| `space/0` | 0 px | Suppression explicite d'un espace |
| `space/1` | 4 px | Ajustement optique et séparation très fine |
| `space/2` | 8 px | Icône–libellé et éléments fortement liés |
| `space/3` | 12 px | Petit groupe inline et padding compact |
| `space/4` | 16 px | Groupe de contrôles et rythme courant |
| `space/5` | 20 px | Padding horizontal d'une action standard |
| `space/6` | 24 px | Groupe de contenu et inset mobile |
| `space/8` | 32 px | Module ou carte compacte |
| `space/10` | 40 px | Bloc éditorial intermédiaire |
| `space/12` | 48 px | Module ample et séparation structurante |
| `space/16` | 64 px | Section mobile ou grand bloc |
| `space/20` | 80 px | Respiration de composition large |
| `space/24` | 96 px | Séparation de grandes zones |
| `space/32` | 128 px | Section desktop |
| `space/40` | 160 px | Respiration exceptionnelle de hero, à utiliser seulement si la composition le justifie |

#### Alias sémantiques

| Alias | Mobile | Large | Consommateurs |
|---|---:|---:|---|
| `gap/icon-label` | 8 px | 8 px | Action, lien avec icône, statut, commande de carrousel |
| `gap/inline-group` | 12 px | 12 px | Tags, métadonnées et sélecteur de langue |
| `gap/control-group` | 16 px | 16 px | Navigation, groupes d'actions et commandes du carrousel |
| `gap/content-group` | 24 px | 24 px | Titre, texte, média et action d'un même ensemble |
| `gap/module` | 32 px | 48 px | Parties d'une carte, d'un projet ou d'un panneau |
| `gap/block` | 40 px | 64 px | Blocs éditoriaux successifs |
| `gap/section` | 64 px | 128 px | Sections principales d'une page |
| `inset/card` | 20 px | 32 px | Aperçu de projet, message d'état et module compact |
| `inset/panel` | 24 px | 48 px | Panneau mobile, module identitaire et bloc éditorial majeur |

Les valeurs mobile et large sont des bornes. `gap/module`, `gap/block`, `gap/section`, `inset/card` et `inset/panel` peuvent évoluer fluidement entre elles ; les petits espacements restent fixes afin de conserver des relations visuelles prévisibles.

#### Dimensions fonctionnelles

| Token | Valeur | Règle |
|---|---:|---|
| `target/aa-min` | 24 × 24 px | Plancher WCAG 2.2 AA, réservé aux exceptions documentées ou liens inline |
| `target/project-min` | 44 × 44 px | Minimum du projet pour toute commande autonome |
| `control/compact` | 44 px | Langue, miniature et contrôle d'interface compact |
| `control/standard` | 48 px | Action, navigation et commande courantes |
| `control/large` | 56 px | CTA principal ou action isolée importante |
| `icon/sm` | 16 px | Icône secondaire accompagnée d'un libellé |
| `icon/md` | 20 px | Icône standard d'action ou de statut |
| `icon/lg` | 24 px | Commande visuelle forte, toujours dans une cible de 44 px minimum |
| `header/mobile` | 64 px | En-tête compact avec identité et commande de menu |
| `header/large` | 72 px | En-tête avec navigation et sélecteur de langue visibles |

Le critère [WCAG 2.2 AA 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) fixe un minimum de 24 × 24 px, sous réserve de ses exceptions. Le projet adopte 44 × 44 px comme standard plus confortable pour les commandes autonomes, cohérent avec la [technique W3C C44](https://www.w3.org/WAI/WCAG22/Techniques/css/C44).

Règles d'usage :

- Une icône n'est jamais assimilée à sa cible : sa boîte interactive respecte `target/project-min` même si le dessin mesure 16, 20 ou 24 px.
- Les actions compactes conservent un libellé visible lorsqu'il porte le sens ; la densité ne justifie pas une cible plus petite.
- Deux commandes autonomes voisines conservent au moins 8 px entre leurs boîtes interactives.
- Les espacements expriment la relation : 8 à 16 px pour les éléments liés, 24 à 48 px pour les groupes, 64 à 128 px pour les changements de section.
- Les paddings verticaux ne figent pas une hauteur si le texte grossit ou passe sur deux lignes ; `min-height` protège la cible et le composant peut s'agrandir.
- Les marges de page, colonnes, gouttières, largeurs de conteneur et seuils de reflow seront définis avec la grille responsive afin de ne pas confondre rythme interne et structure de page.

### 5.6 Grille, conteneurs et reflow validés

La grille traduit l'asymétrie du studio graphique modulaire sans modifier l'ordre du contenu. Ses seuils correspondent aux moments où la navigation, les modules ou la lecture ne tiennent plus correctement ; ils ne représentent pas des catégories d'appareils.

#### Contextes de grille

| Contexte | Largeur de référence | Colonnes | Marge latérale | Gouttière | Comportement dominant |
|---|---:|---:|---:|---:|---|
| `compact` | Jusqu'à 639 px, contrôle dès 320 px | 4 | 20 px | 12 px | Flux principal linéaire ; modules essentiels sur 4 colonnes |
| `medium` | 640–1023 px | 8 | 32 px | 16 px | Compositions 5+3 ou 4+4 lorsque l'ordre de lecture reste évident |
| `large` | 1024–1439 px | 12 | 48 px | 24 px | Compositions asymétriques 7+5, 8+4 ou 9+3 selon la hiérarchie |
| `wide` | 1440 px et plus | 12 | 64 px minimum, puis centrage | 24 px | Contenu plafonné ; respiration externe accrue sans étirer la lecture |

Les seuils sont des valeurs de conception initiales. Lors de l'implémentation, un seuil peut être déplacé si le contenu FR/EN réel rompt plus tôt, à condition de préserver les quatre comportements documentés.

#### Conteneurs

| Token | Valeur | Usage |
|---|---:|---|
| `container/layout-max` | 1440 px | Limite de la composition principale hors marges externes |
| `container/full` | 100 % de la grille | Hero, projet mis en avant, carrousel et grandes compositions |
| `container/reading` | 72 ch maximum | Paragraphes et corps éditorial long |
| `container/compact-copy` | 48 ch maximum | Introduction, message d'état, annotation et texte d'accompagnement |

Une surface ou une matière peut atteindre le bord du viewport, mais son contenu essentiel revient dans `container/layout-max`. Aucun texte, contrôle, statut ou média indispensable n'est placé dans une zone décorative hors grille.

#### Règles de composition responsive

- En `compact`, la hero, le positionnement, le CTA, le module SideQuest et les éléments de profil suivent un ordre vertical explicite. Une disposition sur deux colonnes n'est admise que pour de petites métadonnées qui restent lisibles et associées.
- En `medium`, un module peut occuper 5 colonnes et son complément 3, ou deux groupes équilibrés peuvent occuper 4+4. Un texte long ne partage pas une ligne avec un module qui le réduit sous sa largeur de lecture utile.
- En `large` et `wide`, les rapports 7+5, 8+4 et 9+3 créent l'asymétrie. Le contenu principal conserve toujours la part la plus large ; les annotations ou métadonnées occupent la part secondaire.
- Les placements visuels ne changent ni l'ordre DOM ni l'ordre du focus. Aucun `order` visuel, chevauchement ou positionnement absolu ne doit rendre la lecture linéaire incohérente.
- Les éléments décoratifs peuvent dépasser un module, mais ne créent jamais de débordement horizontal de page et n'interceptent aucune interaction.
- La navigation complète et le sélecteur de langue sont visibles à partir de `large`. En dessous de 1024 px, ils passent dans le panneau compact validé, sans duplication dans l'ordre de focus.
- Le panneau mobile mesure au maximum la largeur du contenu disponible après les marges `compact`; il reste ajusté à son contenu et ne devient pas un écran plein.
- Le carrousel conserve son média principal dans la grille. Seule la rangée de miniatures peut défiler horizontalement dans sa propre région, avec commandes précédent/suivant et élément sélectionné toujours atteignables.
- Les hauteurs de contenu restent intrinsèques. Aucun module textuel n'utilise une hauteur fixe susceptible de couper le français, l'anglais ou le texte agrandi.
- Un en-tête sticky, un panneau, une notification ou toute autre superposition ne masque jamais entièrement le composant qui reçoit le focus. Le futur code réservera l'espace ou utilisera un décalage de défilement adapté, conformément à [WCAG 2.2 AA 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum).

#### Contrôles de reflow

- À 320 px CSS, toute la page se lit dans une seule direction sans défilement horizontal de page, perte de contenu ni perte d'action.
- À 200 % d'agrandissement du texte, les composants grandissent ou se recomposent ; aucun libellé, statut, panneau ou contrôle n'est tronqué ou masqué.
- À 400 % de zoom depuis une largeur initiale de 1280 px, la composition rejoint le comportement `compact` et reste utilisable dans une largeur équivalente à 320 px CSS.
- Les adresses, URL et chaînes techniques longues peuvent se couper de manière contrôlée ; les titres et libellés ordinaires utilisent un retour naturel sans césure artificielle.
- Les frames Figma de référence seront 375 px, 768 px et 1440 px. Des contrôles complémentaires seront réalisés à 320 px et autour de chaque seuil avant validation des écrans.

Ces contrôles reprennent les exigences [WCAG 2.2 AA 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) et [1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).

### 5.7 Surfaces, contours et élévation validés

La géométrie reprend les aplats francs, les filets et les fiches de production visibles dans la composition de référence. Elle reste majoritairement rectangulaire : la hiérarchie vient de la grille, des couleurs, des bordures et du rythme plutôt que d'une accumulation de cartes arrondies.

#### Rôles de surface

| Rôle | Fondation | Usage | Limite |
|---|---|---|---|
| `surface/canvas` | Crème `neutral/50` | Toile principale et zones de lecture | Ne reçoit pas une carte pour chaque groupe de contenu |
| `surface/subtle` | Crème secondaire `neutral/100` | Alternance éditoriale, groupe discret ou papier secondaire | Ne devient pas un fond systématique |
| `surface/brand` | Violet `violet/500` | Hero secondaire, projet mis en avant et module identitaire | Toujours avec `text/on-brand` ou une paire contrôlée |
| `surface/inverse` | Sombre `neutral/950` | Cadre média, panneau ponctuel et contraste fonctionnel | Aucun thème sombre global |
| `surface/action-primary` | Lime `lime/500` | CTA principal et son état de base | Une seule action principale dominante par contexte |
| `surface/editorial` | Rose `pink/500` | Annotation, sticker et accent non critique | Ne porte jamais seule une information essentielle |
| `surface/paper` | `neutral/50` | Note, fiche ou légende superposée à un module | Usage ponctuel ; `surface/subtle` porte le papier secondaire |

#### Contours et séparateurs

| Token | Épaisseur | Couleur par défaut | Consommateurs |
|---|---:|---|---|
| `stroke/hairline` | 1 px | `border/default` | Grille éditoriale, repère de coupe, séparateur et métadonnée |
| `stroke/control` | 1 px | `border/strong` | Action secondaire, langue, miniature et panneau |
| `stroke/emphasis` | 2 px | `border/strong` | État sélectionné, projet ciblé et limite prioritaire |
| `stroke/inverse` | 1 px | `border/inverse` | Contrôle ou séparation sur violet et sombre |
| `stroke/focus-inner` | 2 px | `focus/inner` | Premier anneau de focus |
| `stroke/focus-outer` | 2 px | `focus/outer` | Second anneau de focus, accolé au premier |

Les filets décoratifs peuvent être plus discrets que les contours fonctionnels, mais un contour nécessaire à l'identification d'un contrôle conserve le contraste minimal déjà validé. Le focus bicolore occupe une enveloppe totale de 4 px et ne doit jamais être coupé par `overflow: hidden`.

#### Rayons

| Token | Valeur | Usage |
|---|---:|---|
| `radius/none` | 0 px | Modules, cartes, actions, panneaux, médias, stickers et statuts |
| `radius/full` | 999 px | Cercle, sceau éditorial ou commande réellement circulaire uniquement |

Aucun niveau intermédiaire n'est créé en V1 faute de consommateur démontré. Un cercle reste exceptionnel ; les badges et statuts textuels conservent par défaut une forme rectangulaire afin d'éviter une esthétique de pills génériques.

#### Ombres et superpositions

| Token | Valeur conceptuelle | Usage |
|---|---|---|
| `shadow/none` | Aucune ombre | État par défaut des modules, cartes, actions et médias |
| `shadow/paper` | Décalage net 4 px × 6 px, encre à 18 % | Note papier, fiche courte ou image imprimée légèrement décollée |
| `shadow/overlay` | 0 × 12 px, diffusion 32 px, encre à 18 % | Panneau de navigation mobile ou superposition temporaire nécessitant une séparation du contenu |

Les ombres n'expriment pas à elles seules un état interactif. `shadow/paper` appartient à la matière éditoriale ; `shadow/overlay` appartient uniquement aux couches temporaires. Les cartes de projet ordinaires restent plates.

#### Matière et gestes graphiques

- Une texture papier monochrome peut être appliquée à `surface/canvas` ou `surface/paper` avec une opacité maximale de 3 %. Elle reste décorative, n'altère pas les contrastes et peut être supprimée sans perte d'information.
- Les repères de coupe, numéros de planche, traits d'impression et croix d'alignement utilisent `stroke/hairline`. Leur densité reste faible et ils sont masqués des technologies d'assistance.
- Une note ou une image éditoriale peut recevoir une inclinaison comprise entre −2° et +2°. Le texte reste lisible sans cette inclinaison, et celle-ci est supprimée lorsqu'elle provoque un débordement à 320 px ou au zoom.
- Aucun contrôle, libellé fonctionnel, paragraphe, statut critique ou carte entière interactive n'est incliné.
- Les superpositions ne masquent ni une action, ni un statut, ni le focus. Leur ordre visuel ne modifie jamais l'ordre de lecture.
- Aucun flou de verre, gradient décoratif, volume 3D ou ombre douce de carte n'est ajouté à cette direction.

### 5.8 Iconographie et illustrations validées

Le système distingue trois familles qui ne se mélangent pas : les icônes fonctionnelles pour agir ou comprendre un état, les marques éditoriales pour donner la texture « fiche de production », et les médias de projet pour démontrer le travail. La V1 utilise un set vectoriel minimal dessiné pour le projet ; aucune bibliothèque complète ni dépendance d'icônes n'est imposée avant l'architecture technique.

#### Icônes fonctionnelles

| Taille | Canevas | Trait | Usage |
|---|---:|---:|---|
| `icon/sm` | 16 × 16 px | 1,5 px | Indice secondaire accompagné d'un libellé |
| `icon/md` | 20 × 20 px | 1,5 px | Action, statut ou lien standard |
| `icon/lg` | 24 × 24 px | 2 px | Commande forte dans une cible d'au moins 44 × 44 px |

Les traits utilisent des extrémités carrées et des jonctions nettes. Les formes restent monochromes, sans remplissage décoratif, et héritent toujours d'un alias de texte ou de contrôle ; aucune couleur n'est incorporée dans le fichier vectoriel.

Set fonctionnel initial :

| Groupe | Icônes nécessaires | Consommateurs principaux |
|---|---|---|
| Navigation | `ArrowRight`, `ArrowLeft`, `Menu`, `Close` | Actions, en-tête et panneau mobile |
| Ressources | `ExternalLink`, `Download`, `Mail`, `Copy`, `Check` | Contacts, profils, CV et confirmation de copie |
| Carrousel | `ChevronLeft`, `ChevronRight`, `Play`, `Pause` | Navigation, autoplay et position du média |
| État et récupération | `Info`, `Alert`, `Retry`, `ImageMissing` | Messages d'état et média indisponible |

Une nouvelle icône n'entre dans le système qu'avec un consommateur identifié. Les flèches de navigation conservent une hampe visible et un dessin plus éditorial ; les chevrons restent réservés aux commandes compactes du carrousel.

#### Marques éditoriales

Le set décoratif comprend uniquement `CropMark`, `RegistrationCross`, `Rule`, `Underline` et `CircleStamp`. Ces marques reprennent `stroke/hairline` ou un trait manuscrit contrôlé, utilisent une couleur sémantique et restent absentes de l'arbre d'accessibilité.

- Une composition n'utilise qu'un petit nombre de marques ; elles ne forment jamais un bruit de fond continu.
- Les marques peuvent dépasser leur module sans provoquer de débordement de page.
- `CircleStamp` peut recevoir une rotation légère, mais aucun sceau ne remplace un statut textuel.
- Les annotations utilisent Fraunces Italic ou Manrope selon leur rôle ; aucune quatrième police « manuscrite » n'est ajoutée.
- Les emojis, cliparts, pictogrammes 3D et mélanges de styles d'icônes sont exclus.

#### Médias et illustrations de projet

- Les captures d'interface conservent leurs couleurs réelles lorsque celles-ci démontrent une décision UI. Aucun filtre identitaire ne doit fausser la lecture d'un écran présenté comme preuve.
- Une photographie ou image d'ambiance peut être monochrome si elle est décorative ou éditoriale. Son traitement ne s'applique pas automatiquement aux captures produit.
- SideQuest reste explicitement identifié comme mock fictif dans le texte adjacent ; aucun média ne suggère un client, un résultat, un dépôt ou une application livrée.
- Le texte informatif reste du texte natif dans Figma puis dans le produit. Une image contenant du texte n'est utilisée que pour une pièce graphique essentielle et reçoit une alternative équivalente.
- Les ratios et recadrages définitifs restent dépendants des médias réels. Chaque image informative possède un point focal, une alternative et un comportement d'erreur documentés avant validation des écrans.
- Les logos de technologies utilisent les ressources officielles disponibles, respectent leurs contraintes de marque et restent accompagnés d'un nom lisible ; aucun logo n'est l'unique moyen d'identifier une technologie.

#### Accessibilité et livraison

- Une icône accompagnée d'un libellé est décorative pour les technologies d'assistance ; le libellé porte le nom accessible.
- Une commande uniquement iconique n'est admise que pour menu, fermeture et carrousel. Elle reçoit un nom accessible explicite et une cible d'au moins 44 × 44 px.
- Aucun drapeau ne représente une langue. `FR` et `EN` restent visibles et les noms complets sont exposés aux technologies d'assistance.
- Un statut associe toujours texte et, si utile, symbole ; jamais couleur ou icône seule.
- Les icônes fonctionnelles sont livrées en SVG éditable avec `viewBox` cohérent. Les marques décoratives et médias sont séparés afin que le futur code puisse appliquer correctement les noms, rôles et alternatives.

Nomenclature Figma prévue : `Icon/Functional/*`, `Mark/Editorial/*`, `Asset/Project/*` et `Logo/Technology/*`.

### 5.9 Fondations de motion validées

La motion accompagne un changement d'état, maintient la continuité spatiale ou confirme une action. Elle ne retarde jamais l'accès au contenu et n'anime pas la page en permanence. La spécification détaillée, les interruptions, le carrousel et la variante réduite sont documentés dans [`docs/ui/MOTION_GUIDELINES.md`](MOTION_GUIDELINES.md).

| Fondation | Valeurs validées | Usage |
|---|---|---|
| Durées | 0, 100, 120, 160, 240, 280, 320, 360 et 480 ms | De l'état réduit à la transition signature |
| Courbes | standard, entrée et sortie | Mouvement naturel sans rebond |
| Distances | 4, 8, 16 et 24 px | Retour d'action, panneau, contenu et média |
| Transition signature | 480 ms maximum | Réorganisation de la grille lors de l'ouverture d'un projet |
| Carrousel | Changement toutes les 5 s, transition 320 ms | Pause manuelle persistante et navigation immédiate |
| Mouvement réduit | Spatialité et autoplay supprimés | États directs ou fondu de 100 ms maximum |

Le focus est toujours immédiat. Les animations sont interruptibles, ne déplacent jamais le focus et n'utilisent ni parallaxe, ni custom cursor, ni rebond, ni marquee, ni révélation systématique au scroll. Le bandeau de stacks reste donc statique à toutes les largeurs en V1.

### 5.10 Contrat de variables Figma et de tokens code

La bibliothèque Figma conservera la séparation entre valeurs brutes et rôles sémantiques. Une variable sémantique pointe vers une primitive ; les composants et écrans ne consomment jamais directement une couleur brute. Aucun mode clair/sombre n'est créé en V1. Les modes `Compact` et `Large` sont réservés aux aliases dont la valeur responsive diffère réellement.

| Fondation | Collection ou style Figma | Rôle et modes | Consommateurs | Futur token code |
|---|---|---|---|---|
| Couleurs brutes | `Primitives/Color` — `neutral/*`, `violet/*`, `lime/*`, `pink/*`, `feedback/*` | Valeurs sources, sans mode | Aliases sémantiques uniquement | `--color-*` |
| Couleurs sémantiques | `Semantic/Color` — `surface/*`, `text/*`, `border/*`, `focus/*` | Rôles d'usage, sans thème global | Composants, pages et états | `--surface-*`, `--text-*`, `--border-*`, `--focus-*` |
| Espacement brut | `Primitives/Space` — `space/*` | Échelle fixe, sans mode | Aliases d'espacement | `--space-*` |
| Espacement sémantique | `Semantic/Space` — `gap/*`, `inset/*` | Modes `Compact` et `Large` uniquement lorsque les bornes diffèrent | Auto-layout des composants et sections | `--gap-*`, `--inset-*` |
| Dimensions | `Primitives/Size` — `target/*`, `control/*`, `icon/*`, `header/*`, `container/*` | Valeur unique par token | Cibles, contrôles, médias et conteneurs | `--target-*`, `--control-*`, `--icon-*`, `--header-*`, `--container-*` |
| Typographie | Styles `Type/Display/*`, `Type/Heading/*`, `Type/Body/*`, `Type/Label/*`, `Type/Editorial/*` | Styles séparés ; bornes responsive documentées, sans mode de thème | Tout texte selon son rôle | `--font-*`, `--text-*` ou mapping TypeScript équivalent |
| Grilles | Styles `Grid/Compact`, `Grid/Medium`, `Grid/Large`, `Grid/Wide` | Un style par contexte responsive | Frames et compositions de page | Breakpoints et variables de layout documentés |
| Forme et élévation | `Primitives/Shape` et styles `Effect/*` — `radius/*`, `stroke/*`, `shadow/*` | Valeurs uniques, sans mode | Composants, focus, papier et overlays | `--radius-*`, `--stroke-*`, `--shadow-*` |
| Motion | `Primitives/Motion` — `motion/duration/*`, `motion/ease/*`, `motion/distance/*` | Tokens standards et variantes réduites explicites | Prototypes et handoff d'interaction | `--motion-*` ou constantes TypeScript équivalentes |
| Assets | Composants `Icon/Functional/*`, `Mark/Editorial/*`, `Asset/Project/*`, `Logo/Technology/*` | Propriétés et variantes selon les consommateurs documentés | Composants et compositions | Assets SVG ou médias nommés de façon équivalente |

Règles de synchronisation :

- la casse et les segments sémantiques restent identiques entre documentation et Figma ; le code transforme uniquement `/` en convention locale sans renommer le rôle ;
- toute valeur isolée découverte pendant la maquette est d'abord rattachée à un token existant ou justifiée comme nouveau besoin dans ce document ;
- les styles typographiques référencent les familles validées et les variables de couleur sémantiques ; ils ne dupliquent pas de couleur ;
- le handoff indique pour chaque composant les aliases consommés, ses états et son comportement responsive ;
- toute divergence temporaire entre documentation, Figma et code est signalée et résolue selon les règles de migration de la section 9.

## 6. Décisions consignées

| ID | Date | Décision | Portée |
|---|---|---|---|
| DS-DEC-001 | 2026-09-15 | Utiliser la palette et le trio typographique fournis comme repères directionnels, sans considérer leurs valeurs ou familles exactes comme validées. | Entretien et exploration des fondations |
| DS-DEC-002 | 2026-09-15 | Préserver le triptyque fonctionnel « impact, lisibilité, personnalité » lors de l'évaluation des typographies finales. | Typographie |
| DS-DEC-003 | 2026-09-15 | Préserver les familles violet–crème–lime–rose et leurs rôles dans la palette finale, tout en autorisant l'ajustement des nuances exactes selon les usages et les contrastes. | Couleurs |
| DS-DEC-004 | 2026-09-15 | Retenir trois voix typographiques distinctes : display condensée et expressive, sans-serif lisible pour le texte et l'interface, serif italique organique pour les accents éditoriaux. | Typographie |
| DS-DEC-005 | 2026-09-15 | Donner à la display un caractère très condensé et monumental, réservé aux grands titres et mots d'impact, avec une adaptation contrôlée aux contenus bilingues et aux petits écrans. | Typographie display |
| DS-DEC-006 | 2026-09-15 | Limiter la sélection finale à des fontes gratuites et légalement auto-hébergeables, avec licence vérifiable, couverture FR/EN et formats web adaptés. | Typographie et performance |
| DS-DEC-007 | 2026-09-15 | Faire retenir dès le premier écran que Costa est un développeur full-stack capable de créer des expériences web singulières. | Direction et hiérarchie |
| DS-DEC-008 | 2026-09-16 | Retenir la direction Impeccable « Studio graphique modulaire », issue du tirage `fbe634a4`, et sa composition de référence. | Direction, composition et interaction |
| DS-DEC-009 | 2026-09-16 | Conserver le parcours comp-led pour approfondir plusieurs compositions dans le monde visuel sélectionné avant la maquette finale. | Workflow de conception |
| DS-DEC-010 | 2026-09-16 | Retenir League Gothic pour le display, Manrope pour le texte et l'interface, et Fraunces Italic pour les accents éditoriaux ; auto-héberger leurs seules variantes utiles sous SIL OFL 1.1. | Typographie, licence et performance |
| DS-DEC-011 | 2026-09-16 | Adopter l'échelle typographique sémantique à bornes mobile et large, avec interpolation fluide pour les styles expressifs et stabilité renforcée pour les textes fonctionnels. | Typographie responsive et accessibilité |
| DS-DEC-012 | 2026-09-16 | Adopter la palette sémantique violet–crème–lime–rose, ses états interactifs, ses couleurs de feedback et son focus bicolore selon la matrice de contraste documentée. | Couleurs et accessibilité |
| DS-DEC-013 | 2026-09-16 | Adopter l'échelle d'espacement fondée sur 4 px, ses alias responsives, les contrôles de 44, 48 et 56 px et une cible autonome minimale de 44 × 44 px. | Espacement, dimensions et accessibilité |
| DS-DEC-014 | 2026-09-16 | Adopter les quatre contextes de grille, le conteneur principal plafonné à 1440 px, les mesures de lecture et les règles de reflow documentées. | Grille, responsive et accessibilité |
| DS-DEC-015 | 2026-09-16 | Adopter une géométrie rectangulaire, des contours de 1 et 2 px, un focus bicolore de 4 px, une approche plate et deux élévations réservées au papier et aux overlays. | Surfaces, contours et élévation |
| DS-DEC-016 | 2026-09-16 | Adopter un set vectoriel fonctionnel minimal sur mesure, séparé des marques éditoriales et des médias de projet, avec les règles accessibles et de livraison documentées. | Iconographie, illustrations et accessibilité |
| DS-DEC-017 | 2026-09-16 | Adopter les tokens de motion, la transition signature, le comportement interruptible, la pause persistante du carrousel et la variante `prefers-reduced-motion` documentés. | Motion et accessibilité |
| DS-DEC-018 | 2026-09-16 | Aligner l'inventaire sur la motion validée : le bandeau de stacks reste statique à toutes les largeurs en V1. | Composants, motion et accessibilité |
| DS-DEC-019 | 2026-09-16 | Fermer les aliases d'état et de feedback, documenter la résilience de l'espacement du texte et du focus, puis fixer le contrat de synchronisation Figma–code. | Tokens, accessibilité et handoff |

## 7. État des fondations et passage vers Figma

| Domaine | État | Prochain contrôle |
|---|---|---|
| Couleurs | Primitives, alias et contrastes validés | Créer les variables Figma, puis confronter la palette aux composants et compositions réels |
| Typographies | Familles, rôles, variantes et échelle validés | Créer les styles correspondants dans Figma, puis contrôler les retours de ligne avec les contenus FR/EN réels |
| Espacements et dimensions | Échelle, alias et dimensions validés | Créer les variables Figma puis vérifier leur consommation dans les composants |
| Grilles et conteneurs | Contextes, colonnes, marges, gouttières et conteneurs validés | Créer les grilles Figma et vérifier les ruptures avec les contenus réels |
| Iconographie et illustrations | Set fonctionnel, marques éditoriales et règles média validés | Construire les assets nécessaires dans Figma sans étendre l'inventaire sans consommateur |
| Surfaces et matières | Rôles, texture et gestes graphiques validés | Créer les styles correspondants puis les contrôler dans les compositions |
| Bordures et rayons | Épaisseurs et géométrie rectangulaire validées | Créer les variables et vérifier focus, sélection et contours fonctionnels |
| Ombres et élévation | Approche plate et deux ombres ciblées validées | Limiter leur consommation aux papiers et overlays documentés |
| Responsive | Grille et comportements structurants validés | Compléter les adaptations propres aux composants pendant la maquette |
| Accessibilité | Contrat documentaire WCAG 2.2 AA défini | Vérifier clavier, lecteur d'écran, contrastes rendus, zoom, reflow, espacement du texte et focus non masqué dans Figma puis dans le produit |
| Motion | Tokens, comportements et variante réduite validés | Prototyper uniquement les mouvements nécessaires dans Figma, puis mesurer leur conformité au handoff |

## 8. Décisions résolues et dépendances restantes

La question typographique `DS-OPEN-002` est résolue par la sélection de League Gothic, Manrope et Fraunces Italic. La question `DS-OPEN-005` est résolue par la direction sélectionnée : le crème domine les surfaces de lecture, le violet porte les grands modules identitaires et le sombre reste ponctuel pour le texte, les médias ou un contraste fonctionnel.

Les décisions de fondation visuelle, responsive, accessible et motion sont résolues pour la V1. Les contenus réels — médias SideQuest, biographie, timeline, stacks, coordonnées et CV bilingues — restent nécessaires pour valider les compositions finales, sans remettre en cause le contrat de fondations. La validation globale est acquise ; conformément à la décision de Costa, la prochaine reprise commencera par une revue transversale complète des documents produit, UX et UI avant la création des variables, styles, composants et écrans Figma.

## 9. Évolution en V2 et V3

La validation actuelle fixe le **contrat de référence de la V1** ; elle ne rend aucune décision immuable. Une V2 ou V3 pourra faire évoluer les familles typographiques, couleurs, espacements, grilles, composants, médias ou comportements de motion si le besoin produit ou la qualité de l'expérience le justifie.

### Niveaux de changement

| Niveau | Exemple | Traitement attendu |
|---|---|---|
| Ajustement compatible | Correction d'une nuance, d'un espacement ou d'une durée sans changer le rôle du token | Incrément mineur, décision consignée et contrôles ciblés |
| Évolution de fondation | Nouvelle primitive, nouvel état ou adaptation responsive conservant les contrats existants | Incrément fonctionnel, validation design et contrôle de tous les consommateurs |
| Rupture | Changement de direction, renommage d'alias publié, nouvelle logique de grille ou remplacement d'une famille | Version majeure, plan de migration et nouvelle validation UX/UI |

### Règles de migration

1. Décrire le besoin et les consommateurs concernés avant de modifier une fondation validée.
2. Préserver les noms sémantiques publiés lorsqu'ils restent justes ; ne jamais renommer ou supprimer silencieusement un token consommé.
3. Lorsqu'un contrat doit disparaître, le marquer comme déprécié, fournir son remplacement et documenter la période de migration.
4. Mettre à jour dans la même évolution la décision, Figma, le handoff et le futur code concernés ; signaler explicitement toute désynchronisation temporaire.
5. Rejouer les contrôles pertinents : contrastes, focus, cibles, zoom, reflow, contenus FR/EN, états, interruptions et mouvement réduit.
6. Obtenir une validation humaine avant d'appliquer au produit une évolution qui modifie la direction, l'expérience ou un contrat partagé.

Les invariants d'honnêteté du contenu, d'accès clavier, de lisibilité, de reflow, de contraste et de réduction du mouvement restent obligatoires dans toutes les versions, sauf remplacement par une exigence plus protectrice.

## 10. Validation

La direction visuelle et chaque famille de fondations ont été validées progressivement. La version 0.11.0 a passé la revue documentaire de cohérence et d'accessibilité : aliases résolus, états couverts, contrat Figma–code défini et contradictions motion supprimées. Costa l'a **validée globalement le 2026-09-16**.

Cette approbation rend possible le démarrage de Figma après la revue transversale demandée, mais ne constitue pas encore une validation de l'interface rendue. Les contrastes réels, retours FR/EN, états, clavier, focus, espacement du texte, zoom, reflow, responsive et motion devront être contrôlés sur les composants et écrans, puis de nouveau dans l'application.

## 11. Historique

| Version | Date | Statut | Évolution |
|---|---|---|---|
| 0.1.0 | 2026-09-15 | Brouillon | Première consolidation de la palette, des rôles typographiques et des contraintes héritées. |
| 0.2.0 | 2026-09-16 | En cours | Intégration du brief Impeccable validé et de la direction « Studio graphique modulaire ». |
| 0.3.0 | 2026-09-16 | En cours | Validation des familles League Gothic, Manrope et Fraunces Italic et proposition de leurs règles d'usage et de l'échelle typographique responsive. |
| 0.4.0 | 2026-09-16 | En cours | Validation de l'échelle typographique et proposition de la palette sémantique avec contrôle des contrastes WCAG 2.2 AA. |
| 0.5.0 | 2026-09-16 | En cours | Validation de la palette sémantique et proposition de l'échelle d'espacement, des dimensions récurrentes et des cibles interactives. |
| 0.6.0 | 2026-09-16 | En cours | Validation des espacements et dimensions, puis proposition de la grille responsive, des conteneurs et des règles de reflow. |
| 0.7.0 | 2026-09-16 | En cours | Validation de la grille responsive et proposition des surfaces, contours, rayons, ombres et gestes de matière. |
| 0.8.0 | 2026-09-16 | En cours | Validation de la géométrie des surfaces et proposition de l'iconographie, des marques éditoriales et du traitement des médias. |
| 0.9.0 | 2026-09-16 | En cours | Validation de l'iconographie et proposition des fondations de motion avec un livrable dédié. |
| 0.10.0 | 2026-09-16 | En cours | Validation des fondations de motion et formalisation des règles d'évolution et de migration pour les futures versions. |
| 0.11.0 | 2026-09-16 | Validé | Revue finale réussie puis validation globale explicite par Costa : bandeau de stacks statique, aliases d'état et de feedback résolus, critères WCAG 1.4.12 et 2.4.11 ajoutés, contrat Figma–code documenté et références obsolètes corrigées. |
