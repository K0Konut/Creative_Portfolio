# COMP-205 — Carrousel d'images du projet

Plugin local de Figma Desktop. Importer [`manifest.json`](./manifest.json) via **Plugins → Development → Import plugin from manifest**, puis lancer **Creative Portfolio — Project Carousel Builder**. Il nécessite les composants validés `COMP-001 Action`, `COMP-004 Cadre média` et `COMP-206 Miniature de média`.

La page `02.16 — Project Carousel` contient 20 variantes larges (`FR/EN × Loading, Ready, Playing, TemporarilyPaused, ExplicitlyPaused, Focused, Hovered, ReducedMotion, MediaError, SingleMedia`) et quatre références compactes (`FR/EN × Ready/ReducedMotion`). Les composants réutilisent les instances des trois composants précédents. La commande Pause/Lecture disparaît quand la série n'a qu'une image ou que le mouvement est réduit. Le contrôle clavier, le défilement des miniatures et l'autoplay sont documentés comme comportements à implémenter, pas comme interactions actives de cette planche statique.

Les trois emplacements et les visuels répétés servent uniquement à vérifier la composition. Ils ne représentent ni un nombre d'images SideQuest validé ni ses médias définitifs. Les légendes, textes alternatifs, ratios, ordre et stratégie de bouclage seront fixés avec les vrais médias. La référence `SingleMedia` montre l'absence des commandes de navigation et de pause lorsque la série ne contient qu'un élément.

**Statut :** première passe générée et revue sur captures. La relance du plugin corrige trois points sans recréer les composants : espacement du statut compact avant les commandes, séparation du titre compact et du badge Figma, et miniature courante en erreur cohérente avec le média principal (libellé EN inclus). Une nouvelle capture est nécessaire avant la validation de `COMP-205`.
