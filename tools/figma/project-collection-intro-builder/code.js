const VIEWPORTS = ["Wide", "Medium", "Compact"];
const LOCALES = ["FR", "EN"];
const PROFILE_STATES = ["Normal", "Incomplete"];
const SPECS = {
  Wide: {
    width: 1440,
    padding: 64,
    paddingToken: "space/16",
    gap: 24,
    gapToken: "space/6",
    content: 840,
    context: 448,
    panelPadding: 48,
    panelPaddingToken: "space/12",
    contextPadding: 48,
    contextPaddingToken: "space/12",
  },
  Medium: {
    width: 768,
    padding: 32,
    paddingToken: "space/8",
    gap: 16,
    gapToken: "space/4",
    content: 704,
    context: 704,
    panelPadding: 32,
    panelPaddingToken: "space/8",
    contextPadding: 32,
    contextPaddingToken: "space/8",
  },
  Compact: {
    width: 375,
    padding: 20,
    paddingToken: "space/5",
    gap: 16,
    gapToken: "space/4",
    content: 335,
    context: 335,
    panelPadding: 24,
    panelPaddingToken: "space/6",
    contextPadding: 16,
    contextPaddingToken: "space/4",
  },
};
const COPY = {
  FR: {
    eyebrow: "COLLECTION · PROJETS",
    title: "Projets sélectionnés",
    intro: "Une sélection volontairement resserrée pour donner à chaque projet son contexte et un espace éditorial clair.",
    contextLabel: "CONTEXTE DE LA SÉLECTION",
    contextTitle: "UNE PREMIÈRE ÉTUDE DE CONCEPT",
    contextBody: "SideQuest ouvre cette collection V1. Son statut reste explicite avant tout aperçu ou accès au détail.",
  },
  EN: {
    eyebrow: "COLLECTION · PROJECTS",
    title: "Selected projects",
    intro: "A deliberately focused selection giving each project clear context and dedicated editorial space.",
    contextLabel: "COLLECTION CONTEXT",
    contextTitle: "A FIRST CONCEPT STUDY",
    contextBody: "SideQuest opens this V1 collection. Its status remains explicit before any preview or detail access.",
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

function applyPanelStyle(panel, fillName, fillFallback, borderName, borderFallback) {
  panel.fills = [boundColor(fillName, fillFallback)];
  panel.strokes = [boundColor(borderName, borderFallback)];
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
}

async function createEditorialPanel(component, spec) {
  const config = SPECS[spec.viewport];
  const compact = spec.viewport === "Compact";
  const medium = spec.viewport === "Medium";
  const copy = COPY[spec.locale];
  const panel = figma.createFrame();
  panel.name = "Collection introduction · reading order";
  component.appendChild(panel);
  panel.resize(config.content, 600);
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.itemSpacing = compact ? 16 : 20;
  panel.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/4" : "space/5"),
  );
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    panel[field] = config.panelPadding;
    panel.setBoundVariable(
      field,
      variable("Primitives/Space", config.panelPaddingToken),
    );
  }
  applyPanelStyle(panel, "surface/canvas", COLORS.canvas, "border/strong", COLORS.ink);

  const eyebrow = await styledText(
    copy.eyebrow,
    "Type/Label/SM/Large",
    "text/secondary",
    COLORS.muted,
  );
  eyebrow.name = "Collection eyebrow";
  panel.appendChild(eyebrow);
  eyebrow.layoutSizingHorizontal = "FILL";
  await editableText(
    component,
    panel,
    "Page title",
    copy.title,
    compact || medium ? "Type/Display/Hero/Compact" : "Type/Display/Page/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    panel,
    "Introduction",
    copy.intro,
    compact || medium ? "Type/Body/MD/Compact" : "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  );
  return panel;
}

function inverseRule(parent) {
  const rule = figma.createRectangle();
  rule.name = "Inverse rule";
  parent.appendChild(rule);
  rule.resize(100, 1);
  rule.fills = [boundColor("border/inverse", COLORS.canvas)];
  rule.strokes = [];
  rule.layoutSizingHorizontal = "FILL";
}

async function createContextPanel(component, spec, statusSet) {
  const config = SPECS[spec.viewport];
  const compact = spec.viewport === "Compact";
  const copy = COPY[spec.locale];
  const panel = figma.createFrame();
  panel.name = "Collection context · essential transparency";
  component.appendChild(panel);
  panel.resize(config.context, 520);
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.itemSpacing = compact ? 16 : 20;
  panel.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/4" : "space/5"),
  );
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    panel[field] = config.contextPadding;
    panel.setBoundVariable(
      field,
      variable("Primitives/Space", config.contextPaddingToken),
    );
  }
  applyPanelStyle(panel, "surface/brand", COLORS.violet, "border/strong", COLORS.ink);

  const label = await styledText(
    copy.contextLabel,
    "Type/Label/SM/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  label.name = "Collection context label";
  panel.appendChild(label);
  label.layoutSizingHorizontal = "FILL";
  inverseRule(panel);
  const title = await styledText(
    copy.contextTitle,
    compact ? "Type/Display/Section/Compact" : "Type/Display/Section/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  title.name = "Collection context title";
  panel.appendChild(title);
  title.layoutSizingHorizontal = "FILL";
  const body = await styledText(
    copy.contextBody,
    compact ? "Type/Body/MD/Compact" : "Type/Body/MD/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  body.name = "Collection context explanation";
  panel.appendChild(body);
  body.layoutSizingHorizontal = "FILL";
  const status = requiredVariant(
    statusSet,
    `Locale=${spec.locale}, Format=Compact`,
  ).createInstance();
  status.name = "COMP-202 · SideQuest status";
  panel.appendChild(status);
  return panel;
}

function variantSpecs() {
  return LOCALES.flatMap((locale) =>
    VIEWPORTS.map((viewport) => ({ viewport, locale })),
  );
}

function variantName({ viewport, locale }) {
  return `Viewport=${viewport}, Locale=${locale}`;
}

async function createVariant(spec, parent, statusSet) {
  const config = SPECS[spec.viewport];
  const horizontal = spec.viewport === "Wide";
  const component = figma.createComponent();
  component.name = variantName(spec);
  parent.appendChild(component);
  component.resize(config.width, 900);
  component.layoutMode = horizontal ? "HORIZONTAL" : "VERTICAL";
  component.primaryAxisSizingMode = horizontal ? "FIXED" : "AUTO";
  component.counterAxisSizingMode = horizontal ? "AUTO" : "FIXED";
  component.itemSpacing = config.gap;
  component.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", config.gapToken),
  );
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = config.padding;
    component.setBoundVariable(
      field,
      variable("Primitives/Space", config.paddingToken),
    );
  }
  applyPanelStyle(component, "surface/subtle", COLORS.subtle, "border/default", COLORS.border);
  await createEditorialPanel(component, spec);
  await createContextPanel(component, spec, statusSet);
  component.description = `COMP-304 · ${spec.viewport}/${spec.locale}. Introduction statique de PAGE-002 : titre principal, texte de revue et COMP-202 Compact avant la collection. Aucun filtre, tri, pagination ou action.`;
  return component;
}

function arrangeSet(set) {
  const columns = [
    { viewport: "Wide", x: 0 },
    { viewport: "Medium", x: 1600 },
    { viewport: "Compact", x: 2528 },
  ];
  const rowPositions = [];
  let y = 0;
  for (const locale of LOCALES) {
    const members = [];
    for (const column of columns) {
      const component = requiredVariant(
        set,
        variantName({ viewport: column.viewport, locale }),
      );
      component.x = column.x;
      component.y = y;
      members.push(component);
    }
    rowPositions.push({ locale, y });
    y += Math.max(...members.map((entry) => entry.height)) + 180;
  }
  const height = Math.max(1, y - 180);
  set.resizeWithoutConstraints(2903, height);
  return { columns, rowPositions, height };
}

async function repairWideTitleScale(set) {
  const source = textStyles.get("Type/Display/Hero/Large");
  const target = textStyles.get("Type/Display/Page/Large");
  if (!source || !target) throw new Error("Styles de correction du titre Wide absents");
  let repaired = 0;
  for (const locale of LOCALES) {
    const component = requiredVariant(
      set,
      variantName({ viewport: "Wide", locale }),
    );
    const title = component.findOne(
      (entry) => entry.type === "TEXT" && entry.name === "Page title · editable",
    );
    if (!title || ![source.id, target.id].includes(title.textStyleId)) {
      throw new Error(`Titre Wide personnalisé : ${component.name} · arrêt sans remplacement`);
    }
    if (title.textStyleId === source.id) {
      await title.setTextStyleIdAsync(target.id);
      repaired += 1;
    }
  }
  return repaired;
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
    "_Generated/Project Collection Intro · Documentation",
    3300,
    0,
    220,
    COLORS.canvas,
    [
      ["COMP-304 · PAGE COMPOSITION · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
      ["Introduction de collection", 42, COLORS.ink, 48, 68],
      ["Présenter une sélection limitée et contextualiser honnêtement SideQuest avant la collection.", 18, COLORS.muted, 48, 136],
    ],
  );
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page, arrangement) {
  const board = figma.createFrame();
  board.name = "_Generated/Project Collection Intro · Preview surface";
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
      `_Generated/Project Collection Intro · Column · ${column.viewport}`,
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
    "_Generated/Project Collection Intro · Content warning",
    "CONTENU DE REVUE · INTRODUCTION BILINGUE À CONFIRMER AVANT PUBLICATION",
    190,
    365,
    1400,
    13,
    COLORS.muted,
  );
  for (const row of arrangement.rowPositions) {
    plainText(
      page,
      `_Generated/Project Collection Intro · Row · ${row.locale}`,
      row.locale,
      20,
      520 + row.y,
      155,
      14,
      COLORS.ink,
    );
  }
}

function syncPreviewLayout(page, arrangement) {
  const board = page.children.find(
    (entry) => entry.name === "_Generated/Project Collection Intro · Preview surface",
  );
  const notes = page.children.find(
    (entry) => entry.name === "_Generated/Project Collection Intro · Usage notes",
  );
  if (!board || !notes) {
    throw new Error("Documentation COMP-304 incomplète : arrêt sans remplacement");
  }
  board.resize(3300, arrangement.height + 430);
  notes.y = 760 + arrangement.height;
  for (const row of arrangement.rowPositions) {
    const label = page.children.find(
      (entry) =>
        entry.name === `_Generated/Project Collection Intro · Row · ${row.locale}`,
    );
    if (!label) throw new Error(`Repère de ligne COMP-304 absent : ${row.locale}`);
    label.y = 520 + row.y;
  }
}

function notesFrame(y) {
  return infoFrame(
    "_Generated/Project Collection Intro · Usage notes",
    3300,
    y,
    460,
    COLORS.subtle,
    [
      ["RESPONSABILITÉ · Introduire PAGE-002 et expliquer sa sélection volontairement limitée avant COMP-204.", 16, COLORS.ink, 40, 24],
      ["VÉRITÉ · COMP-202 Compact annonce le statut fictif de SideQuest sans répéter son texte dans l'introduction.", 16, COLORS.ink, 40, 86],
      ["ORDRE · Titre principal, introduction, contexte transparent, puis collection ; aucune action n'est ajoutée ici.", 16, COLORS.ink, 40, 148],
      ["RESPONSIVE · L'ordre reste stable en 1440, 768 et 375 px ; contrôler ensuite 320 px, zoom et texte agrandi.", 16, COLORS.ink, 40, 210],
      ["EXCLUSIONS · Aucun filtre, tri, pagination, compteur artificiel ou faux projet ne fait partie de la V1.", 16, COLORS.ink, 40, 272],
      ["CONTENU · Le titre et l'introduction FR/EN sont des propositions de revue à confirmer avant publication.", 16, COLORS.ink, 40, 334],
      ["VALIDATION · Revoir les six références Wide/Medium/Compact × FR/EN avant toute approbation de première passe.", 16, COLORS.ink, 40, 396],
    ],
  );
}

async function syncApprovedProfilePreview(set) {
  const expected = PROFILE_STATES.flatMap((state) =>
    LOCALES.flatMap((locale) =>
      VIEWPORTS.map(
        (viewport) => `Viewport=${viewport}, Locale=${locale}, State=${state}`,
      ),
    ),
  );
  if (
    set.children.length !== expected.length ||
    expected.some((name) => !set.children.some((entry) => entry.name === name))
  ) {
    throw new Error("COMP-303 modifié : validation non synchronisée");
  }
  for (const state of PROFILE_STATES) {
    for (const locale of LOCALES) {
      const component = requiredVariant(
        set,
        `Viewport=Wide, Locale=${locale}, State=${state}`,
      );
      if (
        component.layoutMode !== "HORIZONTAL" ||
        component.primaryAxisSizingMode !== "FIXED" ||
        component.counterAxisSizingMode !== "AUTO"
      ) {
        throw new Error(`Correction Wide absente de COMP-303 : ${component.name}`);
      }
    }
  }
  set.description = "COMP-303 · 12 références Wide/Medium/Compact × FR/EN × Normal/Incomplete approuvées par Costa comme base structurelle de première passe le 2026-09-26 après correction de la hauteur Wide. Biographie, positionnement, méthode, reflow à 320 px, zoom et comportements accessibles réels restent ouverts pour les écrans ou la seconde passe globale.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-303 · Aperçu du profil",
  );
  const status = card && card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) {
    await figma.loadFontAsync(status.fontName);
    status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 12 RÉFÉRENCES";
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
  index.resize(1440, Math.max(index.height, 6690));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-304 · Introduction de collection",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-304 · Introduction de collection";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 6480;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-304 · Introduction de collection", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 6 RÉFÉRENCES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "1440/768/375 · FR/EN · composition statique · compose COMP-202.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "03.4 — Project Collection Intro", 1000, 65, 310, 15, COLORS.violet);
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
    "text/on-brand",
    "border/default",
    "border/strong",
    "border/inverse",
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
    "Type/Display/Hero/Compact",
    "Type/Display/Hero/Large",
    "Type/Display/Page/Large",
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
  figma.notify("Préparation de COMP-304 Introduction de collection…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const statusPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.11 — Project Status",
  );
  const profilePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.3 — Home Profile Preview",
  );
  const statusSet = statusPage && statusPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project status",
  );
  const profileSet = profilePage && profilePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Home profile preview",
  );
  if (!statusSet || !profileSet) {
    throw new Error("COMP-202 ou COMP-303 absent : générer puis valider les dépendances avant COMP-304");
  }
  for (const locale of LOCALES) {
    requiredVariant(statusSet, `Locale=${locale}, Format=Compact`);
  }

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.4 — Project Collection Intro",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "03.4 — Project Collection Intro";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project collection intro",
  );
  const expected = variantSpecs().map(variantName);
  if (existing) {
    if (
      existing.children.length !== expected.length ||
      expected.some((name) => !existing.children.some((entry) => entry.name === name))
    ) {
      throw new Error("COMP-304 modifié : arrêt sans remplacement");
    }
    const repaired = await repairWideTitleScale(existing);
    const arrangement = arrangeSet(existing);
    syncPreviewLayout(page, arrangement);
    existing.description = "COMP-304 · Première passe à revoir. Viewport 1440/768/375 × FR/EN. Le titre Wide utilise display/page afin de préserver les mots complets. Introduction statique de PAGE-002, sans filtre ni tri, avec COMP-202 Compact pour contextualiser SideQuest sans répéter son message.";
    await syncApprovedProfilePreview(profileSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin(
      repaired > 0
        ? `COMP-304 corrigé · échelle ajustée sur ${repaired} titres Wide`
        : "COMP-304 préservé · échelle Wide déjà corrigée",
    );
    return;
  }

  for (const stale of page.children.filter(
    (entry) =>
      entry.name === "_Generated/Project Collection Intro Draft" ||
      entry.name.startsWith("_Generated/Project Collection Intro ·"),
  )) {
    stale.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Project Collection Intro Draft";
  staging.resize(1, 1);
  staging.x = -5000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const spec of variantSpecs()) {
    components.push(await createVariant(spec, staging, statusSet));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Project collection intro";
  set.description = "COMP-304 · Première passe à revoir. Viewport 1440/768/375 × FR/EN. Introduction statique de PAGE-002, sans filtre ni tri, avec COMP-202 Compact pour contextualiser SideQuest sans répéter son message.";
  set.x = 190;
  set.y = 520;
  const arrangement = arrangeSet(set);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page, arrangement);
  page.appendChild(notesFrame(760 + arrangement.height));
  await syncApprovedProfilePreview(profileSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-304 créé · 6 références à revoir par captures");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Project Collection Intro Builder : ${message}`, {
    error: true,
    timeout: 10000,
  });
  figma.closePlugin(`Erreur : ${message}`);
});
