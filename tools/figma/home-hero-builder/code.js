const VIEWPORTS = ["Wide", "Medium", "Compact"];
const LOCALES = ["FR", "EN"];
const DECORATIONS = ["Editorial", "None"];
const SPECS = {
  Wide: {
    width: 1440,
    padding: 64,
    paddingToken: "space/16",
    gap: 24,
    gapToken: "space/6",
    decoratedContent: 840,
    decoration: 448,
  },
  Medium: {
    width: 768,
    padding: 32,
    paddingToken: "space/8",
    gap: 16,
    gapToken: "space/4",
    decoratedContent: 430,
    decoration: 258,
  },
  Compact: {
    width: 375,
    padding: 20,
    paddingToken: "space/5",
    gap: 24,
    gapToken: "space/6",
    decoratedContent: 335,
    decoration: 335,
  },
};
const COPY = {
  FR: {
    name: "COSTA\nMASKULOV",
    role: "DÉVELOPPEUR FULL-STACK CRÉATIF",
    promise: "Des expériences web singulières.",
    primary: "Découvrir mes projets",
    secondary: "À propos",
    studio: "STUDIO PERSONNEL",
    words: "IDÉES\nCODE\nIMPACT",
    note: "Des idées qui prennent vie en ligne.",
    markers: "CRÉER · APPRENDRE · TRANSMETTRE",
  },
  EN: {
    name: "COSTA\nMASKULOV",
    role: "CREATIVE FULL-STACK DEVELOPER",
    promise: "Distinctive web experiences.",
    primary: "Explore my projects",
    secondary: "About",
    studio: "PERSONAL STUDIO",
    words: "IDEAS\nCODE\nIMPACT",
    note: "Ideas brought to life online.",
    markers: "CREATE · LEARN · SHARE",
  },
};
const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  muted: "#474747",
  border: "#827F76",
  violet: "#4B3CFF",
  pink: "#FF6BD6",
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

function variantSpecs() {
  return VIEWPORTS.flatMap((viewport) =>
    LOCALES.flatMap((locale) =>
      DECORATIONS.map((decoration) => ({ viewport, locale, decoration })),
    ),
  );
}

function variantName({ viewport, locale, decoration }) {
  return `Viewport=${viewport}, Locale=${locale}, Decoration=${decoration}`;
}

function rule(parent, name, colorName, fallback) {
  const node = figma.createRectangle();
  node.name = name;
  parent.appendChild(node);
  node.resize(100, 1);
  node.fills = [boundColor(colorName, fallback)];
  node.strokes = [];
  node.layoutSizingHorizontal = "FILL";
  return node;
}

function actionInstance(actionSet, style, label, name) {
  const instance = requiredVariant(
    actionSet,
    `Style=${style}, State=Default`,
  ).createInstance();
  instance.name = `COMP-001 · ${name}`;
  instance.setProperties({ [property(instance, "Label")]: label });
  return instance;
}

async function createActions(parent, viewport, locale, actionSet, width) {
  const compact = viewport === "Compact";
  const actions = figma.createFrame();
  actions.name = "Hero actions · Projects then About";
  parent.appendChild(actions);
  actions.resize(width, 120);
  actions.layoutMode = compact ? "VERTICAL" : "HORIZONTAL";
  actions.primaryAxisSizingMode = "AUTO";
  actions.counterAxisSizingMode = compact ? "FIXED" : "AUTO";
  actions.counterAxisAlignItems = compact ? "MIN" : "CENTER";
  actions.itemSpacing = compact ? 12 : 24;
  actions.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/3" : "space/6"),
  );
  actions.fills = [];
  actions.strokes = [];
  actions.clipsContent = false;
  actions.layoutSizingHorizontal = "FILL";
  const primary = actionInstance(
    actionSet,
    "Primary",
    COPY[locale].primary,
    "Projects primary link",
  );
  const secondary = actionInstance(
    actionSet,
    "Text",
    COPY[locale].secondary,
    "About secondary link",
  );
  actions.appendChild(primary);
  actions.appendChild(secondary);
  if (compact) {
    primary.layoutSizingHorizontal = "FILL";
    secondary.layoutSizingHorizontal = "FILL";
  }
}

async function createContent(component, spec, width, actionSet) {
  const compact = spec.viewport === "Compact";
  const medium = spec.viewport === "Medium";
  const copy = COPY[spec.locale];
  const content = figma.createFrame();
  content.name = "Essential hero content · reading order";
  component.appendChild(content);
  content.resize(width, 700);
  content.layoutMode = "VERTICAL";
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.itemSpacing = compact ? 16 : medium ? 20 : 24;
  content.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/4" : medium ? "space/5" : "space/6"),
  );
  content.fills = [];
  content.strokes = [];
  content.clipsContent = false;
  if (spec.decoration === "Editorial") {
    const production = figma.createFrame();
    production.name = "Decorative production mark · aria-hidden";
    content.appendChild(production);
    production.resize(width, 24);
    production.layoutMode = "HORIZONTAL";
    production.primaryAxisSizingMode = "FIXED";
    production.counterAxisSizingMode = "AUTO";
    production.counterAxisAlignItems = "CENTER";
    production.itemSpacing = 12;
    production.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/3"));
    production.fills = [];
    production.strokes = [];
    production.clipsContent = false;
    production.layoutSizingHorizontal = "FILL";
    const index = await styledText("01", "Type/Label/SM/Large", "text/primary", COLORS.ink);
    index.name = "Decorative index";
    production.appendChild(index);
    const line = figma.createRectangle();
    line.name = "Decorative rule";
    production.appendChild(line);
    line.resize(64, 1);
    line.fills = [boundColor("border/strong", COLORS.ink)];
    line.strokes = [];
  }
  await editableText(
    component,
    content,
    "Name",
    copy.name,
    compact || medium ? "Type/Display/Hero/Compact" : "Type/Display/Hero/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    content,
    "Role",
    copy.role,
    compact || medium ? "Type/Heading/XL/Compact" : "Type/Heading/XL/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    content,
    "Value proposition",
    copy.promise,
    compact || medium ? "Type/Editorial/MD/Compact" : "Type/Editorial/LG/Large",
    "text/primary",
    COLORS.ink,
  );
  await createActions(content, spec.viewport, spec.locale, actionSet, width);
  return content;
}

async function createDecoration(parent, spec, width) {
  const compact = spec.viewport === "Compact";
  const medium = spec.viewport === "Medium";
  const copy = COPY[spec.locale];
  const board = figma.createFrame();
  board.name = "Editorial studio module · decorative · aria-hidden";
  parent.appendChild(board);
  board.resize(width, 560);
  board.layoutMode = "VERTICAL";
  board.primaryAxisSizingMode = "AUTO";
  board.counterAxisSizingMode = "FIXED";
  const padding = compact ? 24 : medium ? 24 : 32;
  const paddingToken = compact || medium ? "space/6" : "space/8";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    board[field] = padding;
    board.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  }
  board.itemSpacing = compact ? 20 : 24;
  board.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/5" : "space/6"),
  );
  board.fills = [boundColor("surface/brand", COLORS.violet)];
  board.strokes = [boundColor("border/strong", COLORS.ink)];
  board.strokeWeight = 1;
  board.setBoundVariable(
    "strokeWeight",
    variable("Primitives/Shape", "stroke/control"),
  );
  board.strokeAlign = "INSIDE";
  board.cornerRadius = 0;
  board.setBoundVariable(
    "cornerRadius",
    variable("Primitives/Shape", "radius/none"),
  );
  board.clipsContent = false;
  const studio = await styledText(
    copy.studio,
    "Type/Label/SM/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  studio.name = "Decorative studio label";
  board.appendChild(studio);
  studio.layoutSizingHorizontal = "FILL";
  rule(board, "Decorative inverse rule", "border/inverse", COLORS.canvas);
  const words = await styledText(
    copy.words,
    compact || medium ? "Type/Display/Section/Compact" : "Type/Display/Section/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  words.name = "Decorative studio words";
  board.appendChild(words);
  words.layoutSizingHorizontal = "FILL";
  const note = figma.createFrame();
  note.name = "Editorial note · decorative";
  board.appendChild(note);
  note.resize(Math.max(180, width - padding * 2), 180);
  note.layoutMode = "VERTICAL";
  note.primaryAxisSizingMode = "AUTO";
  note.counterAxisSizingMode = "FIXED";
  note.paddingLeft = compact || medium ? 16 : 24;
  note.paddingRight = compact || medium ? 16 : 24;
  note.paddingTop = compact || medium ? 16 : 24;
  note.paddingBottom = compact || medium ? 16 : 24;
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    note.setBoundVariable(
      field,
      variable("Primitives/Space", compact || medium ? "space/4" : "space/6"),
    );
  }
  note.fills = [boundColor("surface/editorial", COLORS.pink)];
  note.strokes = [];
  note.layoutSizingHorizontal = "FILL";
  const noteText = await styledText(
    copy.note,
    compact || medium ? "Type/Editorial/MD/Compact" : "Type/Editorial/MD/Large",
    "text/on-accent",
    COLORS.ink,
  );
  noteText.name = "Decorative editorial note";
  note.appendChild(noteText);
  noteText.layoutSizingHorizontal = "FILL";
  const markers = await styledText(
    copy.markers,
    "Type/Label/SM/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  markers.name = "Decorative studio markers";
  board.appendChild(markers);
  markers.layoutSizingHorizontal = "FILL";
  return board;
}

async function createVariant(spec, parent, actionSet) {
  const config = SPECS[spec.viewport];
  const compact = spec.viewport === "Compact";
  const decorated = spec.decoration === "Editorial";
  const innerWidth = config.width - config.padding * 2;
  const contentWidth = decorated && !compact ? config.decoratedContent : innerWidth;
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
  const body = figma.createFrame();
  body.name = "Responsive hero composition";
  component.appendChild(body);
  body.resize(innerWidth, 760);
  body.layoutMode = compact ? "VERTICAL" : "HORIZONTAL";
  body.primaryAxisSizingMode = compact ? "AUTO" : "FIXED";
  body.counterAxisSizingMode = compact ? "FIXED" : "AUTO";
  body.itemSpacing = config.gap;
  body.setBoundVariable("itemSpacing", variable("Primitives/Space", config.gapToken));
  body.fills = [];
  body.strokes = [];
  body.clipsContent = false;
  body.layoutSizingHorizontal = "FILL";
  await createContent(component, spec, contentWidth, actionSet);
  const content = component.children.find(
    (entry) => entry.name === "Essential hero content · reading order",
  );
  if (!content) throw new Error("Contenu essentiel de la hero absent");
  body.appendChild(content);
  if (decorated) {
    const decoration = await createDecoration(body, spec, config.decoration);
    if (compact) decoration.layoutSizingHorizontal = "FILL";
  }
  component.description = `COMP-301 · ${spec.viewport}/${spec.locale}/${spec.decoration}. Ordre essentiel : nom, titre, proposition, CTA Projets puis À propos. ${decorated ? "Le module éditorial est décoratif et supprimable." : "Aucune décoration : le contenu et les deux sorties restent complets."} Proposition de valeur de revue à confirmer.`;
  return component;
}

function arrangeSet(set) {
  const columns = [
    { viewport: "Wide", x: 0 },
    { viewport: "Medium", x: 1600 },
    { viewport: "Compact", x: 2528 },
  ];
  const rows = [
    { locale: "FR", decoration: "Editorial" },
    { locale: "EN", decoration: "Editorial" },
    { locale: "FR", decoration: "None" },
    { locale: "EN", decoration: "None" },
  ];
  const rowPositions = [];
  let y = 0;
  for (const row of rows) {
    const members = [];
    for (const column of columns) {
      const name = variantName({ ...column, ...row });
      const component = set.children.find(
        (entry) => entry.type === "COMPONENT" && entry.name === name,
      );
      if (!component) throw new Error(`Variante COMP-301 absente : ${name}`);
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
    "_Generated/Home Hero · Documentation",
    3300,
    0,
    220,
    COLORS.canvas,
    [
      ["COMP-301 · PAGE COMPOSITION · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
      ["Hero d'accueil", 42, COLORS.ink, 48, 68],
      ["Présenter Costa immédiatement et orienter d'abord vers la collection, dans la direction Studio graphique modulaire.", 18, COLORS.muted, 48, 136],
    ],
  );
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page, arrangement) {
  const board = figma.createFrame();
  board.name = "_Generated/Home Hero · Preview surface";
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
      `_Generated/Home Hero · Column · ${column.viewport}`,
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
    "_Generated/Home Hero · Content warning",
    "CONTENU DE REVUE · PROPOSITION DE VALEUR À CONFIRMER AVANT PUBLICATION",
    190,
    365,
    1400,
    13,
    COLORS.muted,
  );
  for (const row of arrangement.rowPositions) {
    plainText(
      page,
      `_Generated/Home Hero · Row · ${row.locale} ${row.decoration}`,
      `${row.decoration.toUpperCase()} · ${row.locale}`,
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
    "_Generated/Home Hero · Usage notes",
    3300,
    y,
    520,
    COLORS.subtle,
    [
      ["HIÉRARCHIE · Nom et titre professionnel forment le titre principal ; la proposition et les actions suivent dans l'ordre de lecture.", 16, COLORS.ink, 40, 24],
      ["NAVIGATION · Primary mène à la collection Projets ; Text mène à À propos. Aucun CTA de hero ne mène directement à SideQuest.", 16, COLORS.ink, 40, 86],
      ["RESPONSIVE · Références 1440, 768 et 375 px ; à 375 px, les deux actions précèdent toujours le module décoratif.", 16, COLORS.ink, 40, 148],
      ["DÉCORATION · Module violet, note rose, index et règles sont aria-hidden ; leur retrait ne change ni le sens ni les sorties.", 16, COLORS.ink, 40, 210],
      ["ACCESSIBILITÉ · Un seul h1 logique, ordre DOM identique à l'ordre essentiel et aucun contenu masqué avant une animation.", 16, COLORS.ink, 40, 272],
      ["MOTION · Aucune motion dans ce composant de structure ; toute future entrée reste non bloquante et supprimée en réduction du mouvement.", 16, COLORS.ink, 40, 334],
      ["CONTENU · Nom et titre sont validés ; proposition de valeur et microcopies décoratives restent des textes de revue éditables.", 16, COLORS.ink, 40, 396],
      ["VALIDATION · Contrôler le reflow, les retours display FR/EN, la hiérarchie Primary/Text et l'état sans décoration par captures.", 16, COLORS.ink, 40, 458],
    ],
  );
}

async function syncApprovedProjectEnd(set) {
  const expected = ["Wide", "Compact"].flatMap((layout) =>
    ["FR", "EN"].flatMap((locale) => [
      `Mode=Suggestions, Layout=${layout}, Locale=${locale}, State=Default`,
      `Mode=Contact, Layout=${layout}, Locale=${locale}, State=Default`,
      `Mode=Contact, Layout=${layout}, Locale=${locale}, State=Partial`,
    ]),
  );
  if (
    set.children.length !== expected.length ||
    expected.some((name) => !set.children.some((entry) => entry.name === name))
  ) {
    throw new Error("COMP-217 modifié : validation non synchronisée");
  }
  set.description = "COMP-217 · 12 variantes Suggestions/Contact × FR/EN × Wide/Compact, avec Contact Default/Partial, approuvées par Costa comme base structurelle de première passe le 2026-09-23. Hiérarchie Contact, libellé Copy EN, référence SideQuest et équilibre email/LinkedIn réservés pour la seconde passe globale.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-217 · Fin de projet conditionnelle",
  );
  const status = card && card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) {
    await figma.loadFontAsync(status.fontName);
    status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 12 VARIANTES";
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
  index.resize(1440, Math.max(index.height, 6060));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-301 · Hero d'accueil",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-301 · Hero d'accueil";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 5850;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-301 · Hero d'accueil", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 12 RÉFÉRENCES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "1440/768/375 · FR/EN · décoration éditoriale facultative · deux actions COMP-001.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "03.1 — Home Hero", 1040, 65, 270, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of [
    "surface/canvas",
    "surface/brand",
    "surface/editorial",
    "text/primary",
    "text/on-brand",
    "text/on-accent",
    "border/default",
    "border/strong",
    "border/inverse",
  ]) {
    variable("Semantic/Color", name);
  }
  for (const name of [
    "space/3",
    "space/4",
    "space/5",
    "space/6",
    "space/8",
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
    "Type/Display/Section/Compact",
    "Type/Display/Section/Large",
    "Type/Heading/XL/Compact",
    "Type/Heading/XL/Large",
    "Type/Editorial/LG/Large",
    "Type/Editorial/MD/Compact",
    "Type/Editorial/MD/Large",
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
  figma.notify("Préparation de COMP-301 Hero d'accueil…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const actionPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.1 — Action",
  );
  const projectEndPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.27 — Project End",
  );
  const actionSet = actionPage && actionPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Action",
  );
  const projectEndSet = projectEndPage && projectEndPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project end",
  );
  if (!actionSet || !projectEndSet) {
    throw new Error("COMP-001 ou COMP-217 absent : générer puis valider les dépendances avant COMP-301");
  }
  requiredVariant(actionSet, "Style=Primary, State=Default");
  requiredVariant(actionSet, "Style=Text, State=Default");

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.1 — Home Hero",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "03.1 — Home Hero";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Home hero",
  );
  const expected = variantSpecs().map(variantName);
  if (existing) {
    if (
      existing.children.length !== expected.length ||
      expected.some((name) => !existing.children.some((entry) => entry.name === name))
    ) {
      throw new Error("COMP-301 modifié : arrêt sans remplacement");
    }
    await syncApprovedProjectEnd(projectEndSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-301 préservé · 12 références à revoir");
    return;
  }

  for (const stale of page.children.filter(
    (entry) =>
      entry.name === "_Generated/Home Hero Draft" ||
      entry.name.startsWith("_Generated/Home Hero ·"),
  )) {
    stale.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Home Hero Draft";
  staging.resize(1, 1);
  staging.x = -5000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const spec of variantSpecs()) {
    components.push(await createVariant(spec, staging, actionSet));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Home hero";
  set.description = "COMP-301 · Première passe à revoir. Viewport 1440/768/375 × FR/EN × décoration Editorial/None. Compose COMP-001 Primary vers Projets et Text vers À propos ; contenu toujours disponible, aucune destination réelle ni motion.";
  set.x = 190;
  set.y = 520;
  const arrangement = arrangeSet(set);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page, arrangement);
  page.appendChild(notesFrame(760 + arrangement.height));
  await syncApprovedProjectEnd(projectEndSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-301 créé · 12 références à revoir par captures");
}

main().catch((error) => {
  figma.notify(`Erreur Home Hero Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
