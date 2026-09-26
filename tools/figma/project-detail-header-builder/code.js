const VIEWPORTS = ["Wide", "Medium", "Compact"];
const LOCALES = ["FR", "EN"];
const PROJECTS = ["Mock", "Real"];
const STATES = ["Normal", "TranslationUnavailable"];
const SPECS = {
  Wide: {
    width: 1440,
    padding: 64,
    paddingToken: "space/16",
    panelPadding: 48,
    panelPaddingToken: "space/12",
    gap: 24,
    gapToken: "space/6",
    statusWidth: 760,
  },
  Medium: {
    width: 768,
    padding: 32,
    paddingToken: "space/8",
    panelPadding: 32,
    panelPaddingToken: "space/8",
    gap: 20,
    gapToken: "space/5",
    statusWidth: 300,
  },
  Compact: {
    width: 375,
    padding: 20,
    paddingToken: "space/5",
    panelPadding: 24,
    panelPaddingToken: "space/6",
    gap: 16,
    gapToken: "space/4",
    statusWidth: 287,
  },
};
const COPY = {
  FR: {
    eyebrow: {
      Mock: "DÉTAIL · ÉTUDE DE CONCEPT",
      Real: "DÉTAIL · PROJET RÉEL",
    },
    title: {
      Mock: "SideQuest",
      Real: "Nom du projet à fournir",
    },
    back: "Retour aux projets",
    unavailableTag: "TRADUCTION INDISPONIBLE",
    unavailableTitle: "Contenu indisponible en français",
    unavailableBody: "Cette version linguistique n'est pas encore disponible. Revenez à la collection pour poursuivre la navigation.",
  },
  EN: {
    eyebrow: {
      Mock: "DETAIL · CONCEPT STUDY",
      Real: "DETAIL · REAL PROJECT",
    },
    title: {
      Mock: "SideQuest",
      Real: "Project name to be provided",
    },
    back: "Back to projects",
    unavailableTag: "TRANSLATION UNAVAILABLE",
    unavailableTitle: "Content unavailable in English",
    unavailableBody: "This language version is not available yet. Return to the collection to continue browsing.",
  },
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

function backAction(actionSet, locale) {
  const action = requiredVariant(
    actionSet,
    "Style=Text, State=Default",
  ).createInstance();
  action.name = "COMP-001 · Back to project collection";
  action.setProperties({
    [property(action, "Label")]: COPY[locale].back,
  });
  return action;
}

function projectStatus(statusSet, spec) {
  const format = spec.viewport === "Wide" ? "Explanatory" : "Compact";
  const instance = requiredVariant(
    statusSet,
    `Locale=${spec.locale}, Format=${format}`,
  ).createInstance();
  instance.name = `COMP-202 · ${format} project status`;
  if (format === "Compact") {
    instance.resize(SPECS[spec.viewport].statusWidth, instance.height);
  }
  return instance;
}

async function unavailableNotice(messageSet, spec) {
  const size = spec.viewport === "Wide" ? "Section" : "Inline";
  const notice = requiredVariant(
    messageSet,
    `Kind=Unavailable, Size=${size}`,
  ).createInstance();
  notice.name = "COMP-003 · Translation unavailable";
  const copy = COPY[spec.locale];
  await overrideText(notice, "Kind label", copy.unavailableTag);
  notice.setProperties({
    [property(notice, "Title · Unavailable")]: copy.unavailableTitle,
    [property(notice, "Body · Unavailable")]: copy.unavailableBody,
  });
  return notice;
}

function accentRule(parent) {
  const rule = figma.createRectangle();
  rule.name = "Project header accent";
  parent.appendChild(rule);
  rule.resize(100, 8);
  rule.fills = [boundColor("surface/brand", COLORS.violet)];
  rule.strokes = [];
  rule.layoutSizingHorizontal = "FILL";
}

async function createContent(component, spec, actionSet, statusSet, messageSet) {
  const config = SPECS[spec.viewport];
  const compact = spec.viewport === "Compact";
  const copy = COPY[spec.locale];
  const panel = figma.createFrame();
  panel.name = "Project detail heading · reading order";
  component.appendChild(panel);
  panel.resize(config.width - config.padding * 2, 700);
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.itemSpacing = config.gap;
  panel.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", config.gapToken),
  );
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    panel[field] = config.panelPadding;
    panel.setBoundVariable(
      field,
      variable("Primitives/Space", config.panelPaddingToken),
    );
  }
  panel.fills = [boundColor("surface/canvas", COLORS.canvas)];
  panel.strokes = [boundColor("border/strong", COLORS.ink)];
  panel.strokeWeight = 1;
  panel.setBoundVariable(
    "strokeWeight",
    variable("Primitives/Shape", "stroke/control"),
  );
  panel.strokeAlign = "INSIDE";
  panel.cornerRadius = 0;
  panel.setBoundVariable(
    "cornerRadius",
    variable("Primitives/Shape", "radius/none"),
  );
  panel.clipsContent = false;

  const action = backAction(actionSet, spec.locale);
  panel.appendChild(action);
  const eyebrow = await styledText(
    copy.eyebrow[spec.project],
    "Type/Label/SM/Large",
    "text/secondary",
    COLORS.muted,
  );
  eyebrow.name = "Project detail eyebrow";
  panel.appendChild(eyebrow);
  eyebrow.layoutSizingHorizontal = "FILL";
  accentRule(panel);
  await editableText(
    component,
    panel,
    "Project title",
    copy.title[spec.project],
    compact || spec.viewport === "Medium"
      ? "Type/Display/Page/Compact"
      : "Type/Display/Page/Large",
    "text/primary",
    COLORS.ink,
  );
  if (spec.project === "Mock") {
    const status = projectStatus(statusSet, spec);
    panel.appendChild(status);
  }
  if (spec.state === "TranslationUnavailable") {
    const notice = await unavailableNotice(messageSet, spec);
    panel.appendChild(notice);
    notice.layoutSizingHorizontal = "FILL";
  }
  return panel;
}

function variantSpecs() {
  return PROJECTS.flatMap((project) =>
    STATES.flatMap((state) =>
      LOCALES.flatMap((locale) =>
        VIEWPORTS.map((viewport) => ({ viewport, locale, project, state })),
      ),
    ),
  );
}

function variantName({ viewport, locale, project, state }) {
  return `Viewport=${viewport}, Locale=${locale}, Project=${project}, State=${state}`;
}

async function createVariant(spec, parent, actionSet, statusSet, messageSet) {
  const config = SPECS[spec.viewport];
  const component = figma.createComponent();
  component.name = variantName(spec);
  parent.appendChild(component);
  component.resize(config.width, 900);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = config.padding;
    component.setBoundVariable(
      field,
      variable("Primitives/Space", config.paddingToken),
    );
  }
  component.fills = [boundColor("surface/subtle", COLORS.subtle)];
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
  await createContent(component, spec, actionSet, statusSet, messageSet);
  component.description = `COMP-305 · ${spec.viewport}/${spec.locale}/${spec.project}/${spec.state}. Retour COMP-001 puis titre principal. ${spec.project === "Mock" ? "COMP-202 précède tout contenu ambigu." : "Aucun statut fictif sur le projet réel de revue."} ${spec.state === "TranslationUnavailable" ? "COMP-003 explique l'absence de traduction sans mélanger les langues." : "État normal."}`;
  return component;
}

function arrangeSet(set) {
  const columns = [
    { viewport: "Wide", x: 0 },
    { viewport: "Medium", x: 1600 },
    { viewport: "Compact", x: 2528 },
  ];
  const rows = PROJECTS.flatMap((project) =>
    STATES.flatMap((state) =>
      LOCALES.map((locale) => ({ project, state, locale })),
    ),
  );
  const rowPositions = [];
  let y = 0;
  for (const row of rows) {
    const members = [];
    for (const column of columns) {
      const component = requiredVariant(
        set,
        variantName({ ...row, viewport: column.viewport }),
      );
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
    "_Generated/Project Detail Header · Documentation",
    3300,
    0,
    220,
    COLORS.canvas,
    [
      ["COMP-305 · PAGE COMPOSITION · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
      ["En-tête de détail projet", 42, COLORS.ink, 48, 68],
      ["Nommer le projet, annoncer honnêtement son statut et conserver un retour valide avant le carrousel.", 18, COLORS.muted, 48, 136],
    ],
  );
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page, arrangement) {
  const board = figma.createFrame();
  board.name = "_Generated/Project Detail Header · Preview surface";
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
      `_Generated/Project Detail Header · Column · ${column.viewport}`,
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
    "_Generated/Project Detail Header · Content warning",
    "CONTENU DE REVUE · PROJET RÉEL ET TRADUCTIONS À FOURNIR AVANT PUBLICATION",
    190,
    365,
    1500,
    13,
    COLORS.muted,
  );
  for (const row of arrangement.rowPositions) {
    plainText(
      page,
      `_Generated/Project Detail Header · Row · ${row.project} ${row.state} ${row.locale}`,
      `${row.project.toUpperCase()} · ${row.state.toUpperCase()} · ${row.locale}`,
      8,
      520 + row.y,
      175,
      12,
      COLORS.ink,
    );
  }
}

function notesFrame(y) {
  return infoFrame(
    "_Generated/Project Detail Header · Usage notes",
    3300,
    y,
    520,
    COLORS.subtle,
    [
      ["RESPONSABILITÉ · Nommer le projet et annoncer son statut avant le carrousel, qui reste le premier grand bloc visuel.", 16, COLORS.ink, 40, 24],
      ["NAVIGATION · COMP-001 Text retourne à la collection localisée ; aucune autre action n'est ajoutée dans l'en-tête.", 16, COLORS.ink, 40, 86],
      ["VÉRITÉ · Mock compose COMP-202 ; Real n'affiche aucun statut fictif et conserve un nom explicitement provisoire.", 16, COLORS.ink, 40, 148],
      ["TRADUCTION · COMP-003 explique la version absente sans mélanger silencieusement FR et EN.", 16, COLORS.ink, 40, 210],
      ["RESPONSIVE · Retour, nom, statut et message éventuel précèdent toujours le carrousel sur les trois viewports.", 16, COLORS.ink, 40, 272],
      ["EXCLUSIONS · Aucune métadonnée détaillée, rôle, stack, démo, dépôt, métrique ou ressource fictive.", 16, COLORS.ink, 40, 334],
      ["ACCESSIBILITÉ · Un titre principal unique, une destination de retour explicite et des statuts transmis par le texte.", 16, COLORS.ink, 40, 396],
      ["VALIDATION · Revoir 24 références Viewport × Locale × Project × State avant toute approbation de première passe.", 16, COLORS.ink, 40, 458],
    ],
  );
}

async function syncApprovedCollectionIntro(set) {
  const expected = LOCALES.flatMap((locale) =>
    VIEWPORTS.map((viewport) => `Viewport=${viewport}, Locale=${locale}`),
  );
  if (
    set.children.length !== expected.length ||
    expected.some((name) => !set.children.some((entry) => entry.name === name))
  ) {
    throw new Error("COMP-304 modifié : validation non synchronisée");
  }
  const pageStyle = textStyles.get("Type/Display/Page/Large");
  for (const locale of LOCALES) {
    const component = requiredVariant(set, `Viewport=Wide, Locale=${locale}`);
    const title = component.findOne(
      (entry) => entry.type === "TEXT" && entry.name === "Page title · editable",
    );
    if (!title || title.textStyleId !== pageStyle.id) {
      throw new Error(`Correction du titre Wide absente de COMP-304 : ${component.name}`);
    }
  }
  set.description = "COMP-304 · 6 références Wide/Medium/Compact × FR/EN approuvées par Costa comme base structurelle de première passe le 2026-09-26 après correction de l'échelle des titres Wide. Introduction bilingue finale, reflow à 320 px, zoom et comportements accessibles réels restent ouverts pour les écrans ou la seconde passe globale.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-304 · Introduction de collection",
  );
  const status = card && card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) {
    await figma.loadFontAsync(status.fontName);
    status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 6 RÉFÉRENCES";
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
  index.resize(1440, Math.max(index.height, 6900));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-305 · En-tête de détail projet",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-305 · En-tête de détail projet";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 6690;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-305 · En-tête de détail projet", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 24 RÉFÉRENCES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "1440/768/375 · FR/EN · mock/réel · normal/traduction indisponible.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "03.5 — Project Detail Header", 1010, 65, 300, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of [
    "surface/canvas",
    "surface/subtle",
    "surface/brand",
    "text/primary",
    "text/secondary",
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
    "Type/Display/Page/Compact",
    "Type/Display/Page/Large",
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
  figma.notify("Préparation de COMP-305 En-tête de détail projet…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const actionPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.1 — Action",
  );
  const messagePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message",
  );
  const statusPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.11 — Project Status",
  );
  const introPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.4 — Project Collection Intro",
  );
  const actionSet = actionPage && actionPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Action",
  );
  const messageSet = messagePage && messagePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message",
  );
  const statusSet = statusPage && statusPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project status",
  );
  const introSet = introPage && introPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project collection intro",
  );
  if (!actionSet || !messageSet || !statusSet || !introSet) {
    throw new Error("COMP-001, COMP-003, COMP-202 ou COMP-304 absent : générer puis valider les dépendances avant COMP-305");
  }
  requiredVariant(actionSet, "Style=Text, State=Default");
  for (const locale of LOCALES) {
    for (const format of ["Compact", "Explanatory"]) {
      requiredVariant(statusSet, `Locale=${locale}, Format=${format}`);
    }
  }
  for (const size of ["Inline", "Section"]) {
    requiredVariant(messageSet, `Kind=Unavailable, Size=${size}`);
  }

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.5 — Project Detail Header",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "03.5 — Project Detail Header";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project detail header",
  );
  const expected = variantSpecs().map(variantName);
  if (existing) {
    if (
      existing.children.length !== expected.length ||
      expected.some((name) => !existing.children.some((entry) => entry.name === name))
    ) {
      throw new Error("COMP-305 modifié : arrêt sans remplacement");
    }
    await syncApprovedCollectionIntro(introSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-305 préservé · 24 références à revoir");
    return;
  }

  for (const stale of page.children.filter(
    (entry) =>
      entry.name === "_Generated/Project Detail Header Draft" ||
      entry.name.startsWith("_Generated/Project Detail Header ·"),
  )) {
    stale.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Project Detail Header Draft";
  staging.resize(1, 1);
  staging.x = -5000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const spec of variantSpecs()) {
    components.push(
      await createVariant(spec, staging, actionSet, statusSet, messageSet),
    );
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Project detail header";
  set.description = "COMP-305 · Première passe à revoir. Viewport 1440/768/375 × FR/EN × Project Mock/Real × State Normal/TranslationUnavailable. Retour COMP-001, titre unique, COMP-202 pour Mock et COMP-003 lorsque la traduction manque.";
  set.x = 190;
  set.y = 520;
  const arrangement = arrangeSet(set);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page, arrangement);
  page.appendChild(notesFrame(760 + arrangement.height));
  await syncApprovedCollectionIntro(introSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-305 créé · 24 références à revoir par captures");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Project Detail Header Builder : ${message}`, {
    error: true,
    timeout: 10000,
  });
  figma.closePlugin(`Erreur : ${message}`);
});
