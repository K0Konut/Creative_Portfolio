const LOCALES = ["FR", "EN"];
const PLACEMENTS = ["Featured", "Collection"];
const STATES = ["Default", "Hover", "Focus", "Active", "MediaLoading", "MediaError"];
const ROWS = { FR: 80, EN: 660 };
const COLUMNS = { Featured: 0, Collection: 1180 };
const COMPACT_COLUMNS = { Featured: 0, Collection: 490 };
const COMPACT_WIDTH = 375;
const COMPACT_HEIGHT = 636;
const SIZES = {
  Featured: { width: 1120, height: 500, inset: 32, copyX: 550, mediaY: 150, titleY: 154, metadataY: 276, actionY: 406 },
  Collection: { width: 920, height: 460, inset: 24, copyX: 530, mediaY: 125, titleY: 133, metadataY: 242, actionY: 356 },
};
const COPY = {
  FR: { title: "SideQuest", action: "Découvrir le concept" },
  EN: { title: "SideQuest", action: "Explore the concept" },
};
const MEDIA_COPY_EN = {
  MediaLoading: { "Loading label": "Loading media…" },
  MediaError: { "Error title": "Media unavailable", "Error explanation": "Text content remains accessible." },
};
const COLORS = {
  canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747",
  border: "#827F76", violet: "#4B3CFF", lime: "#C7FF00",
};
const APPROVED_METADATA_DESCRIPTION = "COMP-203 · Structure FR/EN × Compact/Detail validée par Costa le 2026-09-21. Année et type principal restent des valeurs de revue, à remplacer par les données réelles ; aucun rôle SideQuest.";

let collections = [];
let variables = [];
let textStyles = new Map();

function rgb(hex) {
  const value = hex.slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function solid(hex) {
  return { type: "SOLID", color: rgb(hex) };
}

function variable(collectionName, name) {
  const collection = collections.find((entry) => entry.name === collectionName);
  if (!collection) throw new Error(`Collection absente : ${collectionName}`);
  const result = variables.find((entry) => entry.variableCollectionId === collection.id && entry.name === name);
  if (!result) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return result;
}

function boundColor(name, fallback) {
  return figma.variables.setBoundVariableForPaint(solid(fallback), "color", variable("Semantic/Color", name));
}

async function styledText(value, styleName, colorName, fallback, width) {
  const style = textStyles.get(styleName);
  const node = figma.createText();
  node.fontName = style.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(style.id);
  node.fills = [boundColor(colorName, fallback)];
  if (width) node.resize(width, node.height);
  node.textAutoResize = width ? "HEIGHT" : "WIDTH_AND_HEIGHT";
  return node;
}

function plainText(value, size, hex) {
  const node = figma.createText();
  node.fontName = textStyles.get("Type/Label/MD/Large").fontName;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 120 };
  node.fills = [solid(hex)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function rectangle(parent, name, x, y, width, height, colorName, fallback) {
  const node = figma.createRectangle();
  node.name = name;
  parent.appendChild(node);
  node.resize(width, height);
  node.x = x;
  node.y = y;
  node.fills = [boundColor(colorName, fallback)];
  node.strokes = [];
  return node;
}

function requiredVariant(set, name) {
  const component = set.children.find((entry) => entry.type === "COMPONENT" && entry.name === name);
  if (!component) throw new Error(`Variante absente de ${set.name} : ${name}`);
  return component;
}

function ensureFeaturedMetadataPaper(components) {
  const targets = components.map((component) => {
    const metadata = component.children.find((entry) => entry.name === "COMP-203 · Project metadata · review values");
    const cue = component.children.find((entry) => entry.name === "Visual action cue · part of the single card link");
    const paper = component.children.find((entry) => entry.name === "Metadata paper field");
    if (!metadata || !cue || metadata.x !== SIZES.Featured.copyX || metadata.y !== SIZES.Featured.metadataY ||
        cue.x !== SIZES.Featured.copyX || ![394, SIZES.Featured.actionY].includes(cue.y)) {
      throw new Error(`Composition Featured ${component.name} modifiée manuellement : arrêt sans remplacement`);
    }
    return { component, metadata, cue, paper };
  });
  for (const { component, metadata, cue, paper } of targets) {
    if (!paper) {
      const index = component.children.indexOf(metadata);
      const field = rectangle(component, "Metadata paper field", SIZES.Featured.copyX - 16, SIZES.Featured.metadataY - 12, 332, 122, "surface/canvas", COLORS.canvas);
      component.insertChild(index, field);
    }
    cue.y = SIZES.Featured.actionY;
  }
}

function rowFor(state, locale) {
  return 80 + STATES.indexOf(state) * 1160 + (locale === "EN" ? 580 : 0);
}

function outline(component, weight) {
  component.strokes = [boundColor("border/strong", COLORS.ink)];
  component.strokeWeight = weight;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", weight === 2 ? "stroke/emphasis" : "stroke/control"));
  component.strokeAlign = "INSIDE";
}

function focusRing(component, name, inset, token, fallback, weightToken) {
  let ring = component.children.find((entry) => entry.name === name);
  if (!ring) {
    ring = figma.createRectangle();
    ring.name = name;
    component.appendChild(ring);
  }
  ring.resize(component.width + inset * 2, component.height + inset * 2);
  ring.x = -inset;
  ring.y = -inset;
  ring.fills = [];
  ring.strokes = [boundColor(token, fallback)];
  ring.strokeWeight = 2;
  ring.setBoundVariable("strokeWeight", variable("Primitives/Shape", weightToken));
  ring.strokeAlign = "INSIDE";
}

function localizeMedia(instance, state, locale) {
  if (locale !== "EN" || !MEDIA_COPY_EN[state]) return;
  for (const [name, value] of Object.entries(MEDIA_COPY_EN[state])) {
    const node = instance.findOne((entry) => entry.type === "TEXT" && entry.name === name);
    if (!node) throw new Error(`Texte du média EN absent : ${name}`);
    node.characters = value;
  }
}

function applyState(component, state, locale, placement, mediaSet) {
  const featured = placement === "Featured";
  const cue = component.children.find((entry) => entry.name === "Visual action cue · part of the single card link");
  const media = component.children.find((entry) => entry.name === "COMP-004 · Review media");
  if (!cue || !media || media.type !== "INSTANCE") throw new Error(`Anatomie COMP-201 incomplète : ${component.name}`);
  if (state === "Hover") {
    outline(component, 2);
    cue.fills = [boundColor(featured ? "surface/action-primary-hover" : "surface/action-secondary-hover", featured ? "#B0E600" : "#3D2EE8")];
    if (!featured && !component.children.some((entry) => entry.name === "Hover accent")) {
      rectangle(component, "Hover accent", 0, 0, component.width, 4, "surface/brand", COLORS.violet);
    }
  } else if (state === "Focus") {
    focusRing(component, "Focus inner ring", 2, "focus/inner", COLORS.canvas, "stroke/focus-inner");
    focusRing(component, "Focus outer ring", 4, "focus/outer", COLORS.ink, "stroke/focus-outer");
  } else if (state === "Active") {
    outline(component, 2);
    cue.fills = [boundColor(featured ? "surface/action-primary-active" : "surface/action-secondary-active", featured ? "#98CC00" : "#17105B")];
    const accent = component.children.find((entry) => entry.name === "Featured accent" || entry.name === "Active accent");
    if (accent) accent.fills = [boundColor("surface/action-secondary-active", "#17105B")];
    else rectangle(component, "Active accent", 0, 0, component.width, 4, "surface/action-secondary-active", "#17105B");
  } else if (state === "MediaLoading" || state === "MediaError") {
    media.swapComponent(requiredVariant(mediaSet, `Usage=Preview, State=${state === "MediaLoading" ? "Loading" : "Error"}`));
    media.name = "COMP-004 · Review media";
    localizeMedia(media, state, locale);
  }
  component.description = `COMP-201 · ${placement}/${locale}/${state}. Carte = lien unique ; repère d'action non interactif seul. Statut et texte restent visibles pendant les états média. Format compact et contenu final à contrôler dans les écrans.`;
}

function ensureStateVariants(set, mediaSet) {
  const expected = LOCALES.flatMap((locale) => PLACEMENTS.flatMap((placement) =>
    STATES.map((state) => `Placement=${placement}, Locale=${locale}, State=${state}`)));
  if (set.children.some((entry) => entry.type !== "COMPONENT" || !expected.includes(entry.name))) {
    throw new Error("Set Project preview altéré : arrêt sans remplacement");
  }
  for (const locale of LOCALES) {
    for (const placement of PLACEMENTS) requiredVariant(set, `Placement=${placement}, Locale=${locale}, State=Default`);
  }
  ensureFeaturedMetadataPaper(set.children.filter((entry) => entry.name.startsWith("Placement=Featured,")));
  for (const state of STATES) {
    for (const locale of LOCALES) {
      for (const placement of PLACEMENTS) {
        const name = `Placement=${placement}, Locale=${locale}, State=${state}`;
        let component = set.children.find((entry) => entry.name === name);
        if (!component) {
          component = requiredVariant(set, `Placement=${placement}, Locale=${locale}, State=Default`).clone();
          component.name = name;
          if (component.parent !== set) set.appendChild(component);
        }
        component.x = COLUMNS[placement];
        component.y = rowFor(state, locale);
        if (state !== "Default") applyState(component, state, locale, placement, mediaSet);
      }
    }
  }
  set.resizeWithoutConstraints(2300, 7040);
  set.description = "COMP-201 · États à revoir. Placement Featured/Collection × Locale FR/EN × State Default/Hover/Focus/Active/MediaLoading/MediaError. Lien unique ; statut et texte persistent lors du chargement et de l'erreur. Compact et contenu réel à vérifier.";
}

async function actionCue(component, locale, placement, x, y) {
  const featured = placement === "Featured";
  const cue = figma.createFrame();
  cue.name = "Visual action cue · part of the single card link";
  component.appendChild(cue);
  cue.resize(featured ? 270 : 250, 48);
  cue.x = x;
  cue.y = y;
  cue.fills = [boundColor(featured ? "surface/action-primary" : "surface/action-secondary", featured ? COLORS.lime : COLORS.violet)];
  cue.strokes = [];
  cue.cornerRadius = 8;
  cue.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/control"));
  const label = await styledText(COPY[locale].action, "Type/Label/MD/Large", featured ? "text/on-accent" : "text/on-brand", featured ? COLORS.ink : COLORS.canvas);
  label.name = "Action cue · label";
  cue.appendChild(label);
  label.x = Math.round((cue.width - label.width) / 2);
  label.y = Math.round((cue.height - label.height) / 2);
  const key = component.addComponentProperty(`Action ${locale}`, "TEXT", COPY[locale].action);
  label.componentPropertyReferences = { characters: key };
}

async function createVariant(placement, locale, parent, mediaSet, statusSet, metadataSet) {
  const spec = SIZES[placement];
  const featured = placement === "Featured";
  const component = figma.createComponent();
  component.name = `Placement=${placement}, Locale=${locale}, State=Default`;
  parent.appendChild(component);
  component.resize(spec.width, spec.height);
  component.fills = [boundColor(featured ? "surface/subtle" : "surface/canvas", featured ? COLORS.subtle : COLORS.canvas)];
  component.strokes = [boundColor("border/strong", COLORS.ink)];
  component.strokeWeight = 1;
  component.strokeAlign = "INSIDE";
  component.clipsContent = false;
  if (featured) rectangle(component, "Featured accent", 0, 0, spec.width, 8, "surface/brand", COLORS.violet);

  const status = requiredVariant(statusSet, `Locale=${locale}, Format=Compact`).createInstance();
  status.name = "COMP-202 · Project status";
  component.appendChild(status);
  status.x = spec.inset;
  status.y = spec.inset;

  const media = requiredVariant(mediaSet, "Usage=Preview, State=Loaded").createInstance();
  media.name = "COMP-004 · Review media";
  component.appendChild(media);
  media.x = spec.inset;
  media.y = spec.mediaY;

  const title = await styledText(COPY[locale].title, featured ? "Type/Display/Section/Large" : "Type/Heading/LG/Large", "text/primary", COLORS.ink, spec.width - spec.copyX - 32);
  title.name = "Project title";
  component.appendChild(title);
  title.x = spec.copyX;
  title.y = spec.titleY;
  const titleKey = component.addComponentProperty("Project title", "TEXT", COPY[locale].title);
  title.componentPropertyReferences = { characters: titleKey };

  const metadata = requiredVariant(metadataSet, `Locale=${locale}, Format=Compact`).createInstance();
  metadata.name = "COMP-203 · Project metadata · review values";
  component.appendChild(metadata);
  metadata.x = spec.copyX;
  metadata.y = spec.metadataY;

  await actionCue(component, locale, placement, spec.copyX, spec.actionY);
  if (featured) ensureFeaturedMetadataPaper([component]);
  component.description = `COMP-201 · ${placement}/${locale}, première passe Default. La carte entière est un lien unique vers le détail localisé. Le repère d'action n'est pas un bouton séparé. Média et métadonnées de revue ; états et format compact encore à construire.`;
  return component;
}

async function createCompactVariant(placement, locale, parent, mediaSet, statusSet, metadataSet) {
  const featured = placement === "Featured";
  const component = figma.createComponent();
  component.name = `Placement=${placement}, Locale=${locale}`;
  parent.appendChild(component);
  component.resize(COMPACT_WIDTH, COMPACT_HEIGHT);
  component.fills = [boundColor(featured ? "surface/subtle" : "surface/canvas", featured ? COLORS.subtle : COLORS.canvas)];
  component.strokes = [boundColor("border/strong", COLORS.ink)];
  component.strokeWeight = 1;
  component.strokeAlign = "INSIDE";
  component.clipsContent = false;
  if (featured) rectangle(component, "Featured accent", 0, 0, COMPACT_WIDTH, 8, "surface/brand", COLORS.violet);

  const status = requiredVariant(statusSet, `Locale=${locale}, Format=Compact`).createInstance();
  status.name = "COMP-202 · Project status";
  component.appendChild(status);
  status.x = 24;
  status.y = 24;

  const media = requiredVariant(mediaSet, "Usage=Preview, State=Loaded").createInstance();
  media.name = "COMP-004 · Review media";
  component.appendChild(media);
  media.rescale(327 / media.width);
  media.x = 24;
  media.y = 128;

  const title = await styledText(COPY[locale].title, featured ? "Type/Display/Section/Large" : "Type/Heading/LG/Large", "text/primary", COLORS.ink, 327);
  title.name = "Project title";
  component.appendChild(title);
  title.x = 24;
  title.y = 352;
  const titleKey = component.addComponentProperty("Project title", "TEXT", COPY[locale].title);
  title.componentPropertyReferences = { characters: titleKey };

  if (featured) rectangle(component, "Metadata paper field", 8, 414, 332, 122, "surface/canvas", COLORS.canvas);
  const metadata = requiredVariant(metadataSet, `Locale=${locale}, Format=Compact`).createInstance();
  metadata.name = "COMP-203 · Project metadata · review values";
  component.appendChild(metadata);
  metadata.x = 24;
  metadata.y = 426;

  await actionCue(component, locale, placement, 24, 560);
  if (featured) fixCompactFeaturedSpacing(component);
  component.description = `COMP-201 · Référence compacte de 375 px · ${placement}/${locale}. Ordre statut → média → titre → métadonnées → repère d'action ; carte à lien unique. Reflow à 320 px, zoom 200 %, focus et états média à vérifier dans les écrans.`;
  return component;
}

function fixCompactFeaturedSpacing(component) {
  const title = component.children.find((entry) => entry.name === "Project title" && entry.type === "TEXT");
  const metadata = component.children.find((entry) => entry.name === "COMP-203 · Project metadata · review values");
  const paper = component.children.find((entry) => entry.name === "Metadata paper field");
  const cue = component.children.find((entry) => entry.name === "Visual action cue · part of the single card link");
  if (!title || !metadata || !paper || !cue || title.x !== 24 || title.y !== 352 ||
      metadata.x !== 24 || paper.x !== 8 || cue.x !== 24) {
    throw new Error(`Composition compacte Featured ${component.name} modifiée : arrêt sans remplacement`);
  }
  const metadataY = Math.max(426, Math.ceil(title.y + title.height + 24));
  const paperY = metadataY - 12;
  const actionY = Math.max(560, paperY + paper.height + 24);
  if (![426, metadataY].includes(metadata.y) || ![414, paperY].includes(paper.y) || ![560, actionY].includes(cue.y)) {
    throw new Error(`Espacements compacts Featured ${component.name} modifiés : arrêt sans remplacement`);
  }
  metadata.y = metadataY;
  paper.y = paperY;
  cue.y = actionY;
  component.resizeWithoutConstraints(COMPACT_WIDTH, Math.max(COMPACT_HEIGHT, actionY + cue.height + 24));
}

async function ensureCompactReferences(page, mediaSet, statusSet, metadataSet) {
  const expected = LOCALES.flatMap((locale) => PLACEMENTS.map((placement) => `Placement=${placement}, Locale=${locale}`));
  let set = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview · Compact reference");
  if (set) {
    if (set.children.length !== expected.length || set.children.some((entry) => entry.type !== "COMPONENT" || !expected.includes(entry.name))) {
      throw new Error("Références compactes COMP-201 modifiées : arrêt sans remplacement");
    }
    for (const component of set.children.filter((entry) => entry.name.startsWith("Placement=Featured,"))) {
      fixCompactFeaturedSpacing(component);
    }
    return set;
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Project Preview Compact Draft";
  staging.resize(1, 1);
  staging.x = -3500;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const locale of LOCALES) {
    for (const placement of PLACEMENTS) {
      components.push(await createCompactVariant(placement, locale, staging, mediaSet, statusSet, metadataSet));
    }
  }
  set = figma.combineAsVariants(components, page);
  set.name = "Project preview · Compact reference";
  set.description = "COMP-201 · Référence compacte 375 px, Default seulement : Featured/Collection × FR/EN. Les 24 états larges restent dans Project preview. Contrôle 320 px et zoom 200 % à faire dans les écrans.";
  set.x = 2640;
  set.y = 420;
  for (const component of components) {
    const placement = component.name.includes("Placement=Featured") ? "Featured" : "Collection";
    const locale = component.name.includes("Locale=FR") ? "FR" : "EN";
    component.x = COMPACT_COLUMNS[placement];
    component.y = locale === "FR" ? 80 : 800;
  }
  set.resizeWithoutConstraints(970, 1510);
  staging.remove();
  return set;
}

function frameWithLines(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(2500, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    const node = plainText(value, size, color);
    frame.appendChild(node);
    node.x = x;
    node.y = textY;
  }
  return frame;
}

function documentationFrame() {
  const frame = frameWithLines("_Generated/Project Preview · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-201 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Aperçu de projet", 42, COLORS.ink, 48, 68],
    ["SideQuest : une seule cible vers le détail, statut visible avant le média et données non confirmées signalées comme telles.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Project Preview · Usage notes", 1840, 440, COLORS.subtle, [
    ["COMPOSITION · Mise en avant sur Accueil, collection sur Projets. La carte entière constitue un seul lien.", 16, COLORS.ink, 40, 24],
    ["VÉRITÉ · Statut fictif avant le média ; celui-ci est un mock de revue. Année et type à confirmer avant publication.", 16, COLORS.ink, 40, 82],
    ["ACTION · Le bloc coloré est un repère visuel issu d'Action, pas un bouton imbriqué. Destination et libellé final à confirmer.", 16, COLORS.ink, 40, 140],
    ["SUITE · Ajouter hover, focus bicolore, active, média loading/error et référence compacte avant validation complète.", 16, COLORS.ink, 40, 198],
    ["ACCESSIBILITÉ · Nom de lien distinct, une seule cible clavier ; statut et action accessibles sans survol ni image.", 16, COLORS.ink, 40, 256],
    ["RESPONSIVE · Reflow éditorial à 320 px et zoom 200 % à contrôler dans les écrans ; aucun faux projet adjacent.", 16, COLORS.ink, 40, 314],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Project Preview · Preview surface";
  board.resize(2500, 1500);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const placement of PLACEMENTS) {
    const node = plainText(placement === "Featured" ? "MISE EN AVANT · ACCUEIL" : "COLLECTION · PROJETS", 15, COLORS.violet);
    node.x = 140 + COLUMNS[placement];
    node.y = 320;
    page.appendChild(node);
  }
  for (const locale of LOCALES) {
    const node = plainText(locale === "FR" ? "FRANÇAIS" : "ENGLISH", 15, COLORS.ink);
    node.x = 28;
    node.y = 438 + ROWS[locale];
    page.appendChild(node);
  }
}

function expandReviewBoard(page) {
  const board = page.children.find((entry) => entry.name === "_Generated/Project Preview · Preview surface");
  const notes = page.children.find((entry) => entry.name === "_Generated/Project Preview · Usage notes");
  if (!board || !notes) throw new Error("Planche COMP-201 incomplète : arrêt sans remplacement");
  board.resize(3740, 7200);
  notes.y = 7560;
  const suite = notes.children.find((entry) => entry.type === "TEXT" && entry.characters.startsWith("SUITE ·"));
  if (suite) suite.characters = "ÉTATS · Les vues rapprochées Focus et média FR/EN sont revues ; référence compacte 375 px à valider.";
  const compactLabels = [
    ["_Generated/Project Preview · Compact Featured", "COMPACT 375 · MISE EN AVANT", 2750],
    ["_Generated/Project Preview · Compact Collection", "COMPACT 375 · COLLECTION", 3240],
  ];
  for (const [name, value, x] of compactLabels) {
    if (page.children.some((entry) => entry.name === name)) continue;
    const node = plainText(value, 15, COLORS.violet);
    node.name = name;
    node.x = x;
    node.y = 320;
    page.appendChild(node);
  }
  for (const state of STATES.slice(1)) {
    for (const locale of LOCALES) {
      const name = `_Generated/Project Preview · Row ${state}/${locale}`;
      if (page.children.some((entry) => entry.name === name)) continue;
      const node = plainText(`${state.toUpperCase()} · ${locale}`, 15, COLORS.ink);
      node.name = name;
      node.x = 28;
      node.y = 438 + rowFor(state, locale);
      page.appendChild(node);
    }
  }
}

function syncApprovedMetadata(metadataSet) {
  metadataSet.description = APPROVED_METADATA_DESCRIPTION;
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-203 · Métadonnées du projet");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2 && fields[1].characters === "À VALIDER · 4 VARIANTES") {
    fields[1].characters = "STRUCTURE VALIDÉE · CONTENU EN ATTENTE";
  }
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 2880));
  let card = index.children.find((entry) => entry.name === "Index · COMP-201 · Aperçu de projet");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-201 · Aperçu de projet";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 2654;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-201 · Aperçu de projet", 28, COLORS.ink, 28, 20],
    ["À VALIDER · 24 ÉTATS + 4 RÉFÉRENCES COMPACTES", 14, COLORS.violet, 28, 65],
    ["FR/EN · mise en avant et collection ; référence 375 px et données réelles à confirmer.", 16, COLORS.muted, 28, 105],
    ["02.13 — Project Preview", 16, COLORS.violet, 960, 65],
  ]) {
    const node = plainText(value, size, color);
    card.appendChild(node);
    node.x = x;
    node.y = y;
  }
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of [
    "surface/canvas", "surface/subtle", "surface/brand", "surface/action-primary", "surface/action-secondary",
    "surface/action-primary-hover", "surface/action-secondary-hover", "surface/action-primary-active", "surface/action-secondary-active",
    "text/primary", "text/on-accent", "text/on-brand", "border/strong", "focus/inner", "focus/outer",
  ]) variable("Semantic/Color", name);
  for (const name of ["radius/control", "stroke/control", "stroke/emphasis", "stroke/focus-inner", "stroke/focus-outer"]) variable("Primitives/Shape", name);
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Display/Section/Large", "Type/Heading/LG/Large", "Type/Label/MD/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
  }
  const fonts = new Map([...textStyles.values()].map((style) => [`${style.fontName.family}/${style.fontName.style}`, style.fontName]));
  fonts.set("Manrope/Regular", { family: "Manrope", style: "Regular" });
  for (const font of fonts.values()) await figma.loadFontAsync(font);
}

async function main() {
  figma.notify("Préparation de COMP-201 Aperçu de projet…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const mediaPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.5 — Media Frame");
  const statusPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.11 — Project Status");
  const metadataPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.12 — Project Metadata");
  const mediaSet = mediaPage && mediaPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Media frame");
  const statusSet = statusPage && statusPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project status");
  const metadataSet = metadataPage && metadataPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project metadata");
  if (!mediaSet || !statusSet || !metadataSet) throw new Error("COMP-004, COMP-202 ou COMP-203 absent : lancer leurs builders avant COMP-201");
  for (const locale of LOCALES) {
    requiredVariant(statusSet, `Locale=${locale}, Format=Compact`);
    requiredVariant(metadataSet, `Locale=${locale}, Format=Compact`);
  }
  for (const state of ["Loaded", "Loading", "Error"]) requiredVariant(mediaSet, `Usage=Preview, State=${state}`);

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.13 — Project Preview");
  if (!page) {
    page = figma.createPage();
    page.name = "02.13 — Project Preview";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview");
  if (existing) {
    ensureStateVariants(existing, mediaSet);
    const compact = await ensureCompactReferences(page, mediaSet, statusSet, metadataSet);
    expandReviewBoard(page);
    syncApprovedMetadata(metadataSet);
    updateIndex();
    figma.currentPage.selection = [compact];
    figma.viewport.scrollAndZoomIntoView([compact]);
    figma.closePlugin("COMP-201 · 24 états et 4 références compactes à revoir");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Project Preview Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const locale of LOCALES) {
    for (const placement of PLACEMENTS) {
      components.push(await createVariant(placement, locale, staging, mediaSet, statusSet, metadataSet));
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Project preview";
  set.description = "COMP-201 · Première passe à revoir. Placement Featured/Collection × Locale FR/EN × State Default. Une seule cible vers le détail ; statut et mock visibles ; états interactifs, média loading/error et compact à construire.";
  set.x = 140;
  set.y = 420;
  components.forEach((component, index) => {
    const locale = LOCALES[Math.floor(index / PLACEMENTS.length)];
    const placement = PLACEMENTS[index % PLACEMENTS.length];
    component.x = COLUMNS[placement];
    component.y = ROWS[locale];
  });
  ensureStateVariants(set, mediaSet);
  const compact = await ensureCompactReferences(page, mediaSet, statusSet, metadataSet);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  expandReviewBoard(page);
  syncApprovedMetadata(metadataSet);
  updateIndex();
  figma.currentPage.selection = [compact];
  figma.viewport.scrollAndZoomIntoView([compact]);
  figma.closePlugin("COMP-201 créé · 24 états et 4 références compactes à revoir");
}

main().catch((error) => {
  figma.notify(`Erreur Project Preview Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
