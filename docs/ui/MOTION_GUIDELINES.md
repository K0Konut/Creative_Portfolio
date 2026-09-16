# Principes de motion — Portfolio de Costa Maskulov

## 1. Métadonnées

| Champ | Valeur |
|---|---|
| Produit | Portfolio personnel de Costa Maskulov |
| Version | 0.2.1 |
| Statut | Validé par Costa le 2026-09-16 |
| Dernière mise à jour | 2026-09-16 |
| Direction | Studio graphique modulaire |
| Source principale | `docs/ui/DESIGN_SYSTEM.md` v0.11.0 |
| Sources UX | `docs/ux/USER_FLOWS.md` v0.3.1 et `docs/ui/COMPONENT_INVENTORY.md` v0.2.0 |
| Périmètre | Tokens, comportements, interruptions, autoplay et mouvement réduit de la V1 |

## 2. Finalité

La motion doit expliquer une relation spatiale, rendre un changement d'état perceptible ou confirmer une action. Elle ne constitue pas une couche décorative autonome et ne retarde jamais l'accès au contenu, à une destination ou au focus.

La signature du produit est une **réorganisation de planche de production** : les modules se replacent comme des fiches sur une table de travail lorsqu'un projet est ouvert. Cette continuité doit renforcer la compréhension entre aperçu et détail, sans simuler une interface physique ni transformer chaque navigation en spectacle.

## 3. Principes validés

- Animer uniquement lorsqu'un mouvement améliore la continuité, la causalité ou le retour d'action.
- Garder le focus visible immédiatement ; aucun délai, fondu ou déplacement ne précède son affichage.
- Préférer les changements d'opacité et de transformation aux animations de dimensions ou de position de mise en page.
- Garder les déplacements ordinaires entre 4 et 24 px. La transition signature peut réorganiser plusieurs modules, mais reste contenue dans 480 ms.
- Ne jamais déclencher plusieurs chorégraphies concurrentes sur la même vue.
- Toute animation répond immédiatement à une nouvelle entrée et peut être annulée ou inversée depuis son état visuel courant.
- Aucun contenu essentiel n'apparaît uniquement après une animation ou un délai.
- Sont exclus : parallaxe, custom cursor, rebond, ressort excessif, marquee, clignotement, rotation continue, scroll hijacking et révélations systématiques au défilement.

## 4. Tokens

### 4.1 Durées

| Token | Valeur | Usage |
|---|---:|---|
| `motion/duration/instant` | 0 ms | Focus, contenu critique et état réduit direct |
| `motion/duration/reduced` | 100 ms | Fondu facultatif sans déplacement en mouvement réduit |
| `motion/duration/feedback` | 120 ms | Couleur, bordure, soulignement et retour immédiat |
| `motion/duration/control` | 160 ms | Icône, flèche, pression et petit contrôle |
| `motion/duration/content` | 240 ms | Apparition locale ou remplacement de contenu |
| `motion/duration/panel` | 280 ms | Ouverture et fermeture du panneau mobile |
| `motion/duration/media` | 320 ms | Changement manuel ou automatique de média |
| `motion/duration/layout` | 360 ms | Recomposition locale d'un module |
| `motion/duration/signature` | 480 ms | Transition entre aperçu et détail projet |

Une animation ne choisit pas une durée intermédiaire arbitraire. Une durée plus longue exige un nouveau besoin validé et une mise à jour de ce document.

### 4.2 Courbes

| Token | Valeur | Usage |
|---|---|---|
| `motion/ease/standard` | `cubic-bezier(0.2, 0, 0, 1)` | Déplacements et changements d'état courants |
| `motion/ease/enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Élément qui arrive ou panneau qui s'ouvre |
| `motion/ease/exit` | `cubic-bezier(0.4, 0, 1, 1)` | Élément qui disparaît ou panneau qui se ferme |

Les ressorts et rebonds ne font pas partie de la V1.

### 4.3 Distances

| Token | Valeur | Usage |
|---|---:|---|
| `motion/distance/xs` | 4 px | Flèche ou retour tactile visuel |
| `motion/distance/sm` | 8 px | Petit contenu ou panneau compact |
| `motion/distance/md` | 16 px | Bloc local ou message |
| `motion/distance/lg` | 24 px | Média et transition spatiale contenue |

## 5. Comportements

| Comportement | Propriétés | Durée / courbe | Règle |
|---|---|---|---|
| Action hover | Couleur ou bordure ; flèche +4 px | 120–160 ms / standard | Aucun déplacement de la cible elle-même |
| Action active | Couleur et bordure | 120 ms / standard | La cible et le focus restent stables |
| Lien | Soulignement ou trait révélé | 120 ms / standard | Le lien reste identifiable sans survol |
| Panneau mobile | Opacité et translation verticale de 8 px | 280 ms / enter ou exit | Pas de tiroir plein écran ; focus géré séparément |
| Message d'état | Opacité et translation de 8 px | 240 ms / enter | Aucun délai d'annonce accessible |
| Changement de média | Opacité et translation horizontale de 24 px | 320 ms / standard | Commandes disponibles pendant la transition |
| Recomposition locale | Transformation des modules concernés | 360 ms / standard | Ordre DOM et focus inchangés |
| Changement de page ordinaire | Fondu et déplacement maximal de 8 px | 240 ms / standard | Désactivable ; contenu jamais retenu |

Les cartes de projet ne flottent pas et ne se soulèvent pas au survol. Leur état utilise couleur, bordure, média et mouvement de flèche sans modifier la géométrie de la page. Le bandeau de stacks reste statique à toutes les largeurs et ne reçoit aucun comportement de marquee.

## 6. Transition signature — Réorganisation de planche

### Déclencheur et fonction

La transition intervient uniquement lorsqu'un aperçu de projet ouvre son détail. Le module sélectionné reste l'ancre perceptive ; les autres éléments quittent ou réorganisent la planche pour laisser apparaître le contexte détaillé.

### Séquence

1. L'activation confirme immédiatement l'état de l'aperçu sans déplacer le focus.
2. Le module sélectionné conserve sa position apparente pendant que les modules voisins se réorganisent.
3. Le cadre du projet prend sa nouvelle place par transformation, sans animer l'ordre réel du document.
4. Le contenu détaillé apparaît par un fondu court lorsque sa structure est disponible.
5. La destination finale reçoit le focus de manière prévisible conformément à l'architecture UX, après le changement de page et non pendant la chorégraphie.

La séquence complète dure au maximum 480 ms. Elle ne retarde ni le changement d'URL ni la disponibilité du contenu. Si une continuité partagée fiable n'est pas possible, la solution de repli est le changement de page ordinaire de 240 ms.

### Interruption

- Une nouvelle activation annule la cible précédente et honore uniquement la dernière intention.
- Une animation interrompue repart de son état visuel courant ; elle ne revient pas artificiellement au début.
- `Escape`, la navigation arrière ou le changement de route ne sont jamais bloqués par la transition.
- Aucun mouvement n'est mis en file d'attente.

## 7. Carrousel de projet

- L'autoplay change d'image toutes les 5 secondes et utilise `motion/duration/media`.
- Les commandes précédent, suivant, miniature et Pause/Lecture restent utilisables pendant et après la transition.
- Toute interaction au pointeur, au clavier ou au tactile suspend temporairement l'autoplay.
- La reprise intervient après 8 secondes d'inactivité seulement si le carrousel n'a plus le focus, n'est plus survolé et n'a pas été mis en pause explicitement.
- Une pause explicite est persistante pendant toute la consultation de la page et ne peut être annulée que par une activation volontaire de Lecture.
- Le changement d'image ne déplace jamais le focus. La position et le média courant sont annoncés sans transformer chaque tick automatique en alerte urgente.
- Aucun contenu indispensable n'est disponible uniquement grâce à l'autoplay.

La commande persistante répond à [WCAG 2.2 — 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

## 8. Variante `prefers-reduced-motion`

| Comportement standard | Variante réduite |
|---|---|
| Transition signature de 480 ms | Changement direct ou `motion/duration/reduced`, sans déplacement spatial |
| Changement de page de 240 ms | Changement direct ou `motion/duration/reduced` |
| Panneau mobile avec translation | Apparition directe ou `motion/duration/reduced` |
| Changement de média de 320 ms | Remplacement direct ou `motion/duration/reduced` |
| Autoplay du carrousel | Désactivé dès le chargement ; navigation manuelle uniquement |
| Déplacement de flèche ou soulignement animé | État visuel direct |
| Recomposition locale de grille | Nouvelle disposition appliquée directement |

La préférence du système est respectée sans ajouter de réglage manuel V1, conformément au périmètre produit. Les animations non essentielles sont supprimées selon la technique [W3C C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html).

## 9. Loading, erreurs et feedback

- Le chargement utilise un libellé ou un état statique ; aucun shimmer continu n'est prévu.
- Une réussite de copie apparaît en 160 ms maximum, reste lisible suffisamment longtemps et est annoncée dans une zone de statut.
- Une erreur apparaît sans secousse, flash ni vibration visuelle ; couleur, icône et texte restent associés.
- Aucun feedback visuel ne remplace l'annonce accessible ou le changement d'état sémantique.
- Les animations ne clignotent jamais plus de trois fois par seconde et aucun effet de clignotement n'est prévu dans la direction.

## 10. Contrôles avant validation

- Vérifier chaque comportement au clavier, à la souris et au tactile.
- Vérifier les interruptions rapides et la navigation arrière pendant une transition.
- Vérifier qu'aucun focus n'est perdu, déplacé automatiquement ou entièrement masqué par un en-tête sticky, un panneau, une notification ou une autre superposition, conformément à [WCAG 2.2 AA 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum).
- Vérifier le carrousel avec pause explicite, pause temporaire, reprise et série de médias réduite.
- Vérifier `prefers-reduced-motion` dès le chargement et après changement de préférence lorsque l'environnement le permet.
- Vérifier que le contenu reste disponible si toute animation échoue ou si JavaScript est indisponible.
- Comparer les durées et courbes Figma au handoff puis à l'implémentation ; ne pas déclarer la fidélité sans mesure réelle.

## 11. Validation

Ce document est **validé pour la V1**. Cette validation autorise la future création des variables et prototypes de motion dans Figma, mais n'autorise ni l'implémentation applicative ni l'ajout d'une dépendance d'animation. Toute évolution suit les règles de versionnement et de migration définies dans `docs/ui/DESIGN_SYSTEM.md`.

## 12. Historique

| Version | Date | Statut | Évolution |
|---|---|---|---|
| 0.1.0 | 2026-09-16 | À valider | Première spécification des tokens, comportements, interruptions, autoplay et mouvement réduit. |
| 0.2.0 | 2026-09-16 | Validé | Validation explicite par Costa et rattachement aux règles d'évolution V2/V3 du design system. |
| 0.2.1 | 2026-09-16 | Validé | Alignement des sources sur les fondations revues, confirmation du bandeau de stacks statique et précision du contrôle de focus non masqué. |
