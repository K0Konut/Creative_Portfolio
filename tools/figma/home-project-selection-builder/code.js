const VIEWPORTS = ["Wide", "Medium", "Compact"];
const LOCALES = ["FR", "EN"];
const STATES = ["Default", "Unavailable", "MediaError"];
const SPECS = {
  Wide: {
    width: 1440,
    headerPadding: 64,
    headerPaddingToken: "space/16",
    headerGap: 24,
    headerGapToken: "space/6",
    stagePadding: 48,
    stagePaddingToken: "space/12",
    stageGap: 24,
    stageGapToken: "space/6",
  },
  Medium: {
    width: 768,
    headerPadding: 32,
    headerPaddingToken: "space/8",
    headerGap: 20,
    headerGapToken: "space/5",
    stagePadding: 32,
    stagePaddingToken: "space/8",
    stageGap: 20,
    stageGapToken: "space/5",
  },
  Compact: {
    width: 375,
    headerPadding: 20,
    headerPaddingToken: "space/5",
    headerGap: 16,
    headerGapToken: "space/4",
    stagePadding: 20,
    stagePaddingToken: "space/5",
    stageGap: 16,
    stageGapToken: "space/4",
  },
};
const COPY = {
  FR: {
    eyebrow: "SÉLECTION · ACCUEIL",
    title: "Projet sélectionné",
    context: "SideQuest est présenté comme un mock fictif — application non réalisée.",
    stage: "SÉLECTION 01 · APERÇU VERS LE DÉTAIL",
    stageUnavailable: "SÉLECTION 01 · DESTINATION INDISPONIBLE",
    unavailableTag: "INDISPONIBLE",
    unavailableTitle: "Projet temporairement indisponible",
    unavailableBody: "SideQuest ne peut pas être ouvert pour le moment. Aucun lien cassé ni projet de remplacement n'est affiché.",
  },
  EN: {
    eyebrow: "SELECTION · HOME",
    title: "Featured project",
    context: "SideQuest is presented as a fictional mock — application not built.",
    stage: "SELECTION 01 · PREVIEW OPENS THE DETAIL",
    stageUnavailable: "SELECTION 01 · DESTINATION UNAVAILABLE",
    unavailableTag: "UNAVAILABLE",
    unavailableTitle: "Project temporarily unavailable",
    unavailableBody: "SideQuest cannot be opened at the moment. No broken link or replacement project is displayed.",
  },
};
const MEDIA_COPY_EN = {
  "Error title": "Media unavailable",
  "Error explanation": "Text content remains accessible.",
};
const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  muted: "#474747",
  border: "#827F76",
  violet: "#4B3CFF",
};

let collections = [];
let variables = [];
let textStyles = new Map();
const boldFont = { family: "Manrope", style: "Bold" };
const regularFont = { family: "Manrope", style: "Regular" };

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
  const result = variables.find(
    (entry) => entry.variableCollectionId === collection.id && entry.name === name,
  );
  if (!result) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return result;
}

function boundColor(name, fallback) {
  return figma.variables.setBoundVariableForPaint(
    solid(fallback),
    "color",
    variable("Semantic/Color", name),
  );
}

function requiredVariant(set, name) {
  const component = set.children.find(
    (entry) => entry.type === "COMPONENT" && entry.name === name,
  );
  if (!component) throw new Error(`Variante absente de ${set.name} : ${name}`);
  return component;
}

function property(instance, name) {
  const key = Object.keys(instance.componentProperties).find((entry) =>
    entry.startsWith(`${name}#`),
  );
  if (!key) throw new Error(`Propriété ${name} absente de ${instance.name}`);
  return key;
}

async function overrideText(instance, name, value) {
  const node = instance.findOne(
    (entry) => entry.type === "TEXT" && entry.name === name,
  );
  if (!node) throw new Error(`Texte à personnaliser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}

async function styledText(value, styleName, colorName, fallback) {
  const style = textStyles.get(styleName);
  if (!style) throw new Error(`Style texte absent : ${styleName}`);
  const node = figma.createText();
  node.fontName = style.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(style.id);
  node.fills = [boundColor(colorName, fallback)];
  node.textAutoResize = "HEIGHT";
  return node;
}

async function editableText(component, parent, name, value, styleName, colorName, fallback) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = `${name} · editable`;
  component.appendChild(node);
  node.layoutSizingHorizontal = "FILL";
  const key = component.addComponentProperty(name, "TEXT", value);
  node.componentPropertyReferences = { characters: key };
  parent.appendChild(node);
  return node;
}

function plainText(parent, name, value, x, y, width, size, hex, bold = true) {
  const node = figma.createText();
  node.name = name;
  node.fontName = bold ? boldFont : regularFont;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 125 };
  node.fills = [solid(hex)];
  node.textAutoResize = "HEIGHT";
  parent.appendChild(node);
  node.resize(width, node.height);
  node.x = x;
  node.y = y;
  return node;
}

function variantSpecs() {
  return STATES.flatMap((state) =>
    LOCALES.flatMap((locale) =>
      VIEWPORTS.map((viewport) => ({ viewport, locale, state })),
    ),
  );
}

function variantName({ viewport, locale, state }) {
  return `Viewport=${viewport}, Locale=${locale}, State=${state}`;
}

async function createHeader(component, spec) {
  const config = SPECS[spec.viewport];
  const compact = spec.viewport === "Compact";
  const medium = spec.viewport === "Medium";
  const copy = COPY[spec.locale];
  const header = figma.createFrame();
  header.name = "Section heading · reading order";
  component.appendChild(header);
  header.resize(config.width, 300);
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.itemSpacing = config.headerGap;
  header.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", config.headerGapToken),
  );
  header.paddingLeft = config.headerPadding;
  header.paddingRight = config.headerPadding;
  header.paddingTop = config.headerPadding;
  header.paddingBottom = config.headerPadding;
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    header.setBoundVariable(
      field,
      variable("Primitives/Space", config.headerPaddingToken),
    );
  }
  header.fills = [];
  header.strokes = [];
  header.clipsContent = false;
  header.layoutSizingHorizontal = "FILL";

  const eyebrow = await styledText(
    copy.eyebrow,
    "Type/Label/SM/Large",
    "text/secondary",
    COLORS.muted,
  );
  eyebrow.name = "Section eyebrow";
  header.appendChild(eyebrow);
  eyebrow.layoutSizingHorizontal = "FILL";

  await editableText(
    component,
    header,
    "Section title",
    copy.title,
    compact || medium ? "Type/Display/Section/Compact" : "Type/Display/Section/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    header,
    "Section context",
    copy.context,
    compact || medium ? "Type/Body/MD/Compact" : "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  );
}

async function compactFeaturedCard(spec, compactSet, mediaSet) {
  const card = requiredVariant(
    compactSet,
    `Placement=Featured, Locale=${spec.locale}`,
  ).createInstance();
  card.name = "COMP-201 · SideQuest · Featured · direct detail link";
  if (spec.state === "MediaError") {
    const media = card.findOne(
      (entry) => entry.type === "INSTANCE" && entry.name === "COMP-004 · Review media",
    );
    if (!media) throw new Error("Média compact COMP-201 absent : état MediaError impossible");
    media.swapComponent(requiredVariant(mediaSet, "Usage=Preview, State=Error"));
    media.name = "COMP-004 · Review media";
    if (spec.locale === "EN") {
      for (const [name, value] of Object.entries(MEDIA_COPY_EN)) {
        await overrideText(media, name, value);
      }
    }
  }
  return card;
}

async function featuredCard(spec, wideSet, compactSet, mediaSet) {
  if (spec.viewport !== "Wide") {
    return compactFeaturedCard(spec, compactSet, mediaSet);
  }
  const sourceState = spec.state === "MediaError" ? "MediaError" : "Default";
  const card = requiredVariant(
    wideSet,
    `Placement=Featured, Locale=${spec.locale}, State=${sourceState}`,
  ).createInstance();
  card.name = "COMP-201 · SideQuest · Featured · direct detail link";
  return card;
}

async function unavailableMessage(spec, messageSet) {
  const compact = spec.viewport === "Compact";
  const size = spec.viewport === "Wide" ? "Section" : "Inline";
  const message = requiredVariant(
    messageSet,
    `Kind=Unavailable, Size=${size}`,
  ).createInstance();
  message.name = "COMP-003 · SideQuest unavailable · no link";
  const copy = COPY[spec.locale];
  await overrideText(message, "Kind label", copy.unavailableTag);
  message.setProperties({
    [property(message, "Title · Unavailable")]: copy.unavailableTitle,
    [property(message, "Body · Unavailable")]: copy.unavailableBody,
  });
  if (compact) message.resize(375, message.height);
  return message;
}

async function createStage(component, spec, wideSet, compactSet, messageSet, mediaSet) {
  const config = SPECS[spec.viewport];
  const stage = figma.createFrame();
  stage.name = "Featured project stage";
  component.appendChild(stage);
  stage.resize(config.width, 900);
  stage.layoutMode = "VERTICAL";
  stage.primaryAxisSizingMode = "AUTO";
  stage.counterAxisSizingMode = "FIXED";
  stage.counterAxisAlignItems = "CENTER";
  stage.itemSpacing = config.stageGap;
  stage.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", config.stageGapToken),
  );
  stage.paddingTop = config.stagePadding;
  stage.paddingBottom = config.stagePadding;
  stage.setBoundVariable(
    "paddingTop",
    variable("Primitives/Space", config.stagePaddingToken),
  );
  stage.setBoundVariable(
    "paddingBottom",
    variable("Primitives/Space", config.stagePaddingToken),
  );
  stage.fills = [boundColor("surface/brand", COLORS.violet)];
  stage.strokes = [boundColor("border/strong", COLORS.ink)];
  stage.strokeWeight = 1;
  stage.setBoundVariable(
    "strokeWeight",
    variable("Primitives/Shape", "stroke/control"),
  );
  stage.strokeAlign = "INSIDE";
  stage.cornerRadius = 0;
  stage.setBoundVariable(
    "cornerRadius",
    variable("Primitives/Shape", "radius/none"),
  );
  stage.clipsContent = false;
  stage.layoutSizingHorizontal = "FILL";

  const label = await styledText(
    spec.state === "Unavailable"
      ? COPY[spec.locale].stageUnavailable
      : COPY[spec.locale].stage,
    "Type/Label/SM/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  label.name = "Decorative production label · aria-hidden";
  stage.appendChild(label);
  label.resize(config.width - config.headerPadding * 2, label.height);
  label.textAutoResize = "HEIGHT";

  const content = spec.state === "Unavailable"
    ? await unavailableMessage(spec, messageSet)
    : await featuredCard(spec, wideSet, compactSet, mediaSet);
  stage.appendChild(content);
}

async function createVariant(spec, parent, wideSet, compactSet, messageSet, mediaSet) {
  const config = SPECS[spec.viewport];
  const component = figma.createComponent();
  component.name = variantName(spec);
  parent.appendChild(component);
  component.resize(config.width, 1200);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = 0;
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
  component.strokes = [boundColor("border/default", COLORS.border)];
  component.strokeWeight = 1;
  component.setBoundVariable(
    "strokeWeight",
    variable("Primitives/Shape", "stroke/control"),
  );
  component.strokeAlign = "INSIDE";
  component.cornerRadius = 0;
  component.setBoundVariable(
    "cornerRadius",
    variable("Primitives/Shape", "radius/none"),
  );
  component.clipsContent = false;
  await createHeader(component, spec);
  await createStage(component, spec, wideSet, compactSet, messageSet, mediaSet);
  component.description = `COMP-302 · ${spec.viewport}/${spec.locale}/${spec.state}. Section nommée puis aperçu SideQuest Featured vers son détail. ${spec.state === "Unavailable" ? "Aucune cible SideQuest : COMP-003 remplace entièrement la carte." : spec.state === "MediaError" ? "Le média échoue ; statut, texte, métadonnées de revue et accès au détail persistent." : "Carte à lien unique vers le détail localisé."} Le CTA de la Hero vers la collection reste distinct. Contenus SideQuest à confirmer avant publication.`;
  return component;
}

function arrangeSet(set) {
  const columns = [
    { viewport: "Wide", x: 0 },
    { viewport: "Medium", x: 1600 },
    { viewport: "Compact", x: 2528 },
  ];
  const rows = STATES.flatMap((state) =>
    LOCALES.map((locale) => ({ state, locale })),
  );
  const rowPositions = [];
  let y = 0;
  for (const row of rows) {
    const members = [];
    for (const column of columns) {
      const name = variantName({ ...row, viewport: column.viewport });
      const component = set.children.find(
        (entry) => entry.type === "COMPONENT" && entry.name === name,
      );
      if (!component) throw new Error(`Variante COMP-302 absente : ${name}`);
      component.x = column.x;
      component.y = y;
      members.push(component);
    }
    rowPositions.push({ ...row, y });
    y += Math.max(...members.map((entry) => entry.height)) + 180;
  }
  const height = Math.max(1, y - 180);
  set.resizeWithoutConstraints(2903, height);
  return { columns, rowPositions, height };
}

function infoFrame(name, width, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    plainText(frame, `Line ${textY}`, value, x, textY, width - x - 40, size, color);
  }
  return frame;
}

function documentationFrame() {
  const frame = infoFrame(
    "_Generated/Home Project Selection · Documentation",
    3300,
    0,
    220,
    COLORS.canvas,
    [
      ["COMP-302 · PAGE COMPOSITION · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
      ["Sélection de projet d'accueil", 42, COLORS.ink, 48, 68],
      ["Présenter SideQuest comme mock fictif et ouvrir directement son détail, sans remplacer le CTA de Hero vers la collection.", 18, COLORS.muted, 48, 136],
    ],
  );
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page, arrangement) {
  const board = figma.createFrame();
  board.name = "_Generated/Home Project Selection · Preview surface";
  board.resize(3300, arrangement.height + 430);
  board.x = 0;
  board.y = 250;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const column of arrangement.columns) {
    plainText(
      page,
      `_Generated/Home Project Selection · Column · ${column.viewport}`,
      `${column.viewport.toUpperCase()} · ${SPECS[column.viewport].width} PX`,
      190 + column.x,
      320,
      SPECS[column.viewport].width,
      15,
      COLORS.violet,
    );
  }
  plainText(
    page,
    "_Generated/Home Project Selection · Content warning",
    "CONTENU DE REVUE · SIDEQUEST RESTE UN MOCK FICTIF NON RÉALISÉ",
    190,
    365,
    1400,
    13,
    COLORS.muted,
  );
  for (const row of arrangement.rowPositions) {
    plainText(
      page,
      `_Generated/Home Project Selection · Row · ${row.state} ${row.locale}`,
      `${row.state.toUpperCase()} · ${row.locale}`,
      20,
      520 + row.y,
      155,
      14,
      COLORS.ink,
    );
  }
}

function notesFrame(y) {
  return infoFrame(
    "_Generated/Home Project Selection · Usage notes",
    3300,
    y,
    520,
    COLORS.subtle,
    [
      ["RESPONSABILITÉ · Nommer la section, présenter SideQuest honnêtement puis ouvrir directement son détail localisé.", 16, COLORS.ink, 40, 24],
      ["NAVIGATION · La carte COMP-201 est une cible unique vers SideQuest ; le CTA de Hero conserve l'accès principal à la collection.", 16, COLORS.ink, 40, 86],
      ["VÉRITÉ · Mention de mock visible ; aucun rôle, résultat, dépôt, démo, métrique ou réalisation n'est attribué à SideQuest.", 16, COLORS.ink, 40, 148],
      ["ÉTATS · Default, MediaError avec contenu persistant, et Unavailable sans carte ni lien cassé grâce à COMP-003.", 16, COLORS.ink, 40, 210],
      ["RESPONSIVE · Références 1440, 768 et 375 px ; contrôler ensuite 320 px, zoom 200 % et texte agrandi dans les écrans.", 16, COLORS.ink, 40, 272],
      ["ACCESSIBILITÉ · Section nommée, statut fictif textuel, une seule cible par carte et ordre de focus identique à l'ordre de lecture.", 16, COLORS.ink, 40, 334],
      ["CONTENU · Titre, contexte, année, type, média et destination finale restent des données de revue à confirmer avant publication.", 16, COLORS.ink, 40, 396],
      ["VALIDATION · Revoir les trois états en FR/EN et Wide/Medium/Compact avant toute approbation de première passe.", 16, COLORS.ink, 40, 458],
    ],
  );
}

async function syncApprovedHero(set) {
  const expected = ["Wide", "Medium", "Compact"].flatMap((viewport) =>
    ["FR", "EN"].flatMap((locale) =>
      ["Editorial", "None"].map(
        (decoration) => `Viewport=${viewport}, Locale=${locale}, Decoration=${decoration}`,
      ),
    ),
  );
  if (
    set.children.length !== expected.length ||
    expected.some((name) => !set.children.some((entry) => entry.name === name))
  ) {
    throw new Error("COMP-301 modifié : validation non synchronisée");
  }
  set.description = "COMP-301 · 12 références Wide/Medium/Compact × FR/EN × Editorial/None approuvées par Costa comme base structurelle de première passe le 2026-09-26. Proposition de valeur, reflow FULL-STACK à 320 px et texte agrandi, équilibre Wide sans décoration, focus, zoom et ordre accessible réel restent ouverts pour les écrans ou la seconde passe globale.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-301 · Hero d'accueil",
  );
  const status = card && card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) {
    await figma.loadFontAsync(status.fontName);
    status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 12 RÉFÉRENCES";
  }
}

async function repairUnavailableStageLabels(set) {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      const component = requiredVariant(
        set,
        `Viewport=${viewport}, Locale=${locale}, State=Unavailable`,
      );
      const label = component.findOne(
        (entry) =>
          entry.type === "TEXT" &&
          entry.name === "Decorative production label · aria-hidden",
      );
      if (!label) {
        throw new Error(`Libellé de production absent : ${component.name}`);
      }
      const previous = COPY[locale].stage;
      const corrected = COPY[locale].stageUnavailable;
      if (label.characters !== previous && label.characters !== corrected) {
        throw new Error(`Libellé personnalisé sur ${component.name} : arrêt sans remplacement`);
      }
      if (label.characters === previous) {
        await figma.loadFontAsync(label.fontName);
        label.characters = corrected;
      }
    }
  }
}

function updateIndex() {
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  if (!index) return;
  index.resize(1440, Math.max(index.height, 6270));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-302 · Sélection de projet d'accueil",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-302 · Sélection de projet d'accueil";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 6060;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-302 · Sélection de projet d'accueil", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 18 RÉFÉRENCES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "1440/768/375 · FR/EN · normal, projet indisponible et média indisponible · compose COMP-201/003.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "03.2 — Home Project Selection", 1010, 65, 300, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of [
    "surface/canvas",
    "surface/brand",
    "text/primary",
    "text/secondary",
    "text/on-brand",
    "border/default",
    "border/strong",
  ]) {
    variable("Semantic/Color", name);
  }
  for (const name of [
    "space/4",
    "space/5",
    "space/6",
    "space/8",
    "space/12",
    "space/16",
  ]) {
    variable("Primitives/Space", name);
  }
  for (const name of ["radius/none", "stroke/control"]) {
    variable("Primitives/Shape", name);
  }
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of [
    "Type/Display/Section/Compact",
    "Type/Display/Section/Large",
    "Type/Body/MD/Compact",
    "Type/Body/MD/Large",
    "Type/Label/SM/Large",
  ]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}

async function main() {
  figma.notify("Préparation de COMP-302 Sélection de projet d'accueil…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const previewPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.13 — Project Preview",
  );
  const messagePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message",
  );
  const mediaPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.5 — Media Frame",
  );
  const heroPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.1 — Home Hero",
  );
  const wideSet = previewPage && previewPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview",
  );
  const compactSet = previewPage && previewPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview · Compact reference",
  );
  const messageSet = messagePage && messagePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message",
  );
  const mediaSet = mediaPage && mediaPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Media frame",
  );
  const heroSet = heroPage && heroPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Home hero",
  );
  if (!wideSet || !compactSet || !messageSet || !mediaSet || !heroSet) {
    throw new Error("COMP-201, COMP-003, COMP-004 ou COMP-301 absent : générer puis valider les dépendances avant COMP-302");
  }
  for (const locale of LOCALES) {
    for (const state of ["Default", "MediaError"]) {
      requiredVariant(wideSet, `Placement=Featured, Locale=${locale}, State=${state}`);
    }
    requiredVariant(compactSet, `Placement=Featured, Locale=${locale}`);
  }
  for (const size of ["Inline", "Section"]) {
    requiredVariant(messageSet, `Kind=Unavailable, Size=${size}`);
  }
  requiredVariant(mediaSet, "Usage=Preview, State=Error");

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.2 — Home Project Selection",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "03.2 — Home Project Selection";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Home project selection",
  );
  const expected = variantSpecs().map(variantName);
  if (existing) {
    if (
      existing.children.length !== expected.length ||
      expected.some((name) => !existing.children.some((entry) => entry.name === name))
    ) {
      throw new Error("COMP-302 modifié : arrêt sans remplacement");
    }
    await repairUnavailableStageLabels(existing);
    await syncApprovedHero(heroSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-302 préservé · libellés Unavailable corrigés · 18 références à revoir");
    return;
  }

  for (const stale of page.children.filter(
    (entry) =>
      entry.name === "_Generated/Home Project Selection Draft" ||
      entry.name.startsWith("_Generated/Home Project Selection ·"),
  )) {
    stale.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Home Project Selection Draft";
  staging.resize(1, 1);
  staging.x = -5000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const spec of variantSpecs()) {
    components.push(
      await createVariant(spec, staging, wideSet, compactSet, messageSet, mediaSet),
    );
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Home project selection";
  set.description = "COMP-302 · Première passe à revoir. Viewport 1440/768/375 × FR/EN × State Default/Unavailable/MediaError. Compose COMP-201 Featured vers le détail SideQuest ou COMP-003 sans cible cassée ; ne remplace pas le CTA Hero vers la collection.";
  set.x = 190;
  set.y = 520;
  const arrangement = arrangeSet(set);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page, arrangement);
  page.appendChild(notesFrame(760 + arrangement.height));
  await syncApprovedHero(heroSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-302 créé · 18 références à revoir par captures");
}

main().catch((error) => {
  figma.notify(`Erreur Home Project Selection Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
