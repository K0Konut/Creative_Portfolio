const LAYOUTS = ["Wide", "Compact"];
const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  muted: "#474747",
  border: "#827F76",
  violet: "#4B3CFF",
  pink: "#D96FD0",
};
const REVIEW = {
  FR: {
    title: "Principe à définir",
    body: "Formulation concrète à rédiger avec un exemple vérifiable.",
  },
  EN: {
    title: "Principle to define",
    body: "Write a concrete statement supported by a verifiable example.",
  },
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

async function editableText(component, name, value, styleName, colorName, fallback) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = `${name} · editable`;
  component.appendChild(node);
  node.layoutSizingHorizontal = "FILL";
  const key = component.addComponentProperty(name, "TEXT", value);
  node.componentPropertyReferences = { characters: key };
  return node;
}

async function createVariant(layout, parent) {
  const compact = layout === "Compact";
  const component = figma.createComponent();
  component.name = `Layout=${layout}`;
  parent.appendChild(component);
  component.resize(compact ? 320 : 560, 220);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = 0;
  component.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/0"));
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

  const accent = figma.createRectangle();
  accent.name = "Editorial accent · decorative";
  component.appendChild(accent);
  accent.resize(compact ? 320 : 560, 8);
  accent.layoutSizingHorizontal = "FILL";
  accent.setBoundVariable("height", variable("Primitives/Space", "space/2"));
  accent.fills = [boundColor("surface/editorial", COLORS.pink)];
  accent.strokes = [];
  const showAccentKey = component.addComponentProperty("Show accent", "BOOLEAN", true);
  accent.componentPropertyReferences = { visible: showAccentKey };

  const content = figma.createFrame();
  content.name = "Text content";
  component.appendChild(content);
  content.resize(compact ? 318 : 558, 180);
  content.layoutMode = "VERTICAL";
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.itemSpacing = compact ? 12 : 16;
  content.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/3" : "space/4"),
  );
  const padding = compact ? 24 : 32;
  const paddingToken = compact ? "space/6" : "space/8";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    content[field] = padding;
    content.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  }
  content.fills = [];
  content.strokes = [];
  content.clipsContent = false;
  content.layoutSizingHorizontal = "FILL";

  await editableText(
    component,
    "Title",
    REVIEW.FR.title,
    "Type/Heading/MD/Large",
    "text/primary",
    COLORS.ink,
  ).then((node) => content.appendChild(node));
  await editableText(
    component,
    "Body",
    REVIEW.FR.body,
    "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  ).then((node) => content.appendChild(node));

  component.description = `COMP-213 · ${layout}. Principe statique : titre court et explication concise. Accent facultatif et purement décoratif. Hauteur dictée par le contenu ; aucune troncature, interaction, promesse ou affirmation non vérifiée.`;
  return component;
}

function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(1800, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    plainText(frame, `Line ${textY}`, value, x, textY, 1700 - x, size, color);
  }
  return frame;
}

function documentationFrame() {
  const frame = infoFrame("_Generated/Work Principle · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-213 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Principe de travail", 42, COLORS.ink, 48, 68],
    ["Une idée autonome, courte et concrète. Le contenu réel reste à rédiger et à vérifier.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Work Principle · Preview surface";
  frame.resize(1800, 1120);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  plainText(page, "Wide label", "LARGE · 560 PX", 200, 320, 400, 15, COLORS.violet);
  plainText(page, "Compact label", "COMPACT · 320 PX", 1060, 320, 400, 15, COLORS.violet);
  plainText(page, "Review label", "EXEMPLES DE REVUE · FR / EN", 200, 790, 800, 16, COLORS.violet);
  plainText(page, "No accent label", "SANS ACCENT DÉCORATIF", 1060, 790, 500, 14, COLORS.ink);
}

function notesFrame() {
  return infoFrame("_Generated/Work Principle · Usage notes", 1420, 420, COLORS.subtle, [
    ["USAGE · Enfant de COMP-212 sur la page À propos ; une idée autonome par instance.", 16, COLORS.ink, 40, 24],
    ["CONTENU · Titre court et explication concise, avec un exemple vérifiable lorsque pertinent.", 16, COLORS.ink, 40, 84],
    ["OPTIONNEL · L'accent rose est décoratif et peut être masqué sans perte d'information.", 16, COLORS.ink, 40, 144],
    ["INTERACTION · Composant statique ; ne devient pas une carte cliquable sans destination réelle.", 16, COLORS.ink, 40, 204],
    ["ACCESSIBILITÉ · Titre puis texte dans l'ordre ; la décoration est ignorée par l'implémentation.", 16, COLORS.ink, 40, 264],
    ["RESPONSIVE · Hauteur déterminée par le contenu ; aucune troncature ou uniformisation forcée.", 16, COLORS.ink, 40, 324],
    ["VÉRITÉ · Les formulations présentes sont des placeholders de revue, jamais des affirmations à publier.", 16, COLORS.ink, 40, 384],
  ]);
}

function reviewInstance(source, locale, showAccent, page, x, y) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · ${locale}${showAccent ? "" : " · no accent"}`;
  page.appendChild(instance);
  instance.setProperties({
    [property(instance, "Title")]: REVIEW[locale].title,
    [property(instance, "Body")]: REVIEW[locale].body,
    [property(instance, "Show accent")]: showAccent,
  });
  instance.x = x;
  instance.y = y;
  return instance;
}

function syncApprovedTimeline(set) {
  if (
    set.children.length !== 4 ||
    ["Wide", "Compact"].some((layout) =>
      ["Normal", "Incomplete"].some(
        (state) =>
          !set.children.some(
            (entry) => entry.name === `Layout=${layout}, State=${state}`,
          ),
      ),
    )
  ) {
    throw new Error("COMP-210 modifié : validation non synchronisée");
  }
  set.description = "COMP-210 · 4 variantes Wide/Compact × Normal/Incomplete approuvées par Costa comme base structurelle de première passe le 2026-09-22. Le composant reste ouvert à la seconde passe globale.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-210 · Timeline du parcours",
  );
  if (!card) return;
  const status = card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 4 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  if (!index) return;
  index.resize(1440, Math.max(index.height, 4820));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-213 · Principe de travail",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-213 · Principe de travail";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 4450;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-213 · Principe de travail", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 2 DISPOSITIONS", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Large/compact · titre et texte éditables · accent décoratif facultatif · statique.", 28, 105, 1080, 16, COLORS.muted, false);
  plainText(card, "Page", "02.22 — Work Principle", 1020, 65, 300, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of [
    "surface/canvas",
    "surface/editorial",
    "text/primary",
    "text/secondary",
    "border/default",
  ]) {
    variable("Semantic/Color", name);
  }
  for (const name of ["space/0", "space/2", "space/3", "space/4", "space/6", "space/8"]) {
    variable("Primitives/Space", name);
  }
  for (const name of ["radius/none", "stroke/control"]) {
    variable("Primitives/Shape", name);
  }
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Heading/MD/Large", "Type/Body/MD/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}

async function main() {
  figma.notify("Préparation de COMP-213 Principe de travail…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const timelinePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.21 — Timeline",
  );
  const timelineSet = timelinePage && timelinePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Timeline",
  );
  if (!timelineSet) throw new Error("COMP-210 absent : générer la timeline avant COMP-213");

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.22 — Work Principle",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "02.22 — Work Principle";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];

  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Work principle",
  );
  if (existing) {
    if (
      existing.children.length !== 2 ||
      LAYOUTS.some(
        (layout) => !existing.children.some((entry) => entry.name === `Layout=${layout}`),
      )
    ) {
      throw new Error("COMP-213 modifié : arrêt sans remplacement");
    }
    syncApprovedTimeline(timelineSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-213 préservé · 2 dispositions à revoir");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Work Principle Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const layout of LAYOUTS) {
    components.push(await createVariant(layout, staging));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Work principle";
  set.description = "COMP-213 · Première passe à revoir. Deux dispositions Wide/Compact, contenu éditable, accent décoratif facultatif et aucune interaction. Les formulations sont des placeholders non publiables.";
  set.x = 200;
  set.y = 430;
  requiredVariant(set, "Layout=Wide").x = 0;
  requiredVariant(set, "Layout=Wide").y = 0;
  requiredVariant(set, "Layout=Compact").x = 780;
  requiredVariant(set, "Layout=Compact").y = 0;
  set.resizeWithoutConstraints(1120, 340);
  staging.remove();

  page.appendChild(documentationFrame());
  previewSurface(page);
  await reviewInstance(requiredVariant(set, "Layout=Wide"), "EN", true, page, 200, 870);
  await reviewInstance(requiredVariant(set, "Layout=Compact"), "FR", false, page, 1060, 870);
  await reviewInstance(requiredVariant(set, "Layout=Compact"), "EN", true, page, 1420, 870);
  page.appendChild(notesFrame());
  syncApprovedTimeline(timelineSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-213 créé · 2 dispositions et références FR/EN à revoir");
}

main().catch((error) => {
  figma.notify(`Erreur Work Principle Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
