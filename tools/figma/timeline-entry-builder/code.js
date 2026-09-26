const CATEGORIES = ["Education", "Experience"];
const LAYOUTS = ["Wide", "Compact"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", border: "#827F76", violet: "#4B3CFF" };
const REVIEW = {
  FR: {
    Education: { category: "FORMATION", period: "Période à confirmer", title: "Formation à renseigner", organization: "Établissement à renseigner", description: "Contexte utile à compléter avec des faits vérifiés." },
    Experience: { category: "EXPÉRIENCE", period: "Période à confirmer", title: "Expérience à renseigner", organization: "Organisation à renseigner", description: "Responsabilités ou apprentissages à décrire avec des faits vérifiés." },
  },
  EN: {
    Education: { category: "EDUCATION", period: "Dates to confirm", title: "Education to document", organization: "Institution to document", description: "Add relevant context supported by verified facts." },
    Experience: { category: "EXPERIENCE", period: "Dates to confirm", title: "Experience to document", organization: "Organization to document", description: "Describe responsibilities or learning with verified facts." },
  },
};
let collections = [];
let variables = [];
let textStyles = new Map();
const boldFont = { family: "Manrope", style: "Bold" };
const regularFont = { family: "Manrope", style: "Regular" };

function rgb(hex) {
  const value = hex.slice(1);
  return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
}
function solid(hex) { return { type: "SOLID", color: rgb(hex) }; }
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
function requiredVariant(set, name) {
  const component = set.children.find((entry) => entry.type === "COMPONENT" && entry.name === name);
  if (!component) throw new Error(`Variante absente de ${set.name} : ${name}`);
  return component;
}
function property(instance, name) {
  const key = Object.keys(instance.componentProperties).find((entry) => entry.startsWith(`${name}#`));
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
function attachTextProperty(component, node, name, value, optional = false) {
  const textKey = component.addComponentProperty(name, "TEXT", value);
  if (!optional) {
    node.componentPropertyReferences = { characters: textKey };
    return;
  }
  const visibleKey = component.addComponentProperty(`Show ${name}`, "BOOLEAN", true);
  node.componentPropertyReferences = { characters: textKey, visible: visibleKey };
}
async function addField(component, parent, category, field, value, styleName, colorName, fallback, optional = false) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = `${field} · editable`;
  parent.appendChild(node);
  node.layoutSizingHorizontal = "FILL";
  attachTextProperty(component, node, `${field} · ${category}`, value, optional);
  return node;
}
async function createVariant(category, layout, parent) {
  const compact = layout === "Compact";
  const component = figma.createComponent();
  component.name = `Category=${category}, Layout=${layout}`;
  parent.appendChild(component);
  component.resize(compact ? 320 : 900, 300);
  component.layoutMode = compact ? "VERTICAL" : "HORIZONTAL";
  component.primaryAxisSizingMode = compact ? "AUTO" : "FIXED";
  component.counterAxisSizingMode = compact ? "FIXED" : "AUTO";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = 24;
    component.setBoundVariable(field, variable("Primitives/Space", "space/6"));
  }
  component.itemSpacing = compact ? 16 : 32;
  component.setBoundVariable("itemSpacing", variable("Primitives/Space", compact ? "space/4" : "space/8"));
  component.fills = [boundColor(category === "Education" ? "surface/subtle" : "surface/canvas", category === "Education" ? COLORS.subtle : COLORS.canvas)];
  component.strokes = [boundColor("border/default", COLORS.border)];
  component.strokeWeight = 1;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/control"));
  component.strokeAlign = "INSIDE";
  component.cornerRadius = 0;
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/none"));
  component.clipsContent = false;

  const period = await styledText(REVIEW.FR[category].period, "Type/Label/MD/Large", "text/primary", COLORS.ink);
  period.name = "Period · editable";
  component.appendChild(period);
  period.resize(compact ? 272 : 160, period.height);
  if (compact) period.layoutSizingHorizontal = "FILL";
  attachTextProperty(component, period, `Period · ${category}`, REVIEW.FR[category].period);

  const body = figma.createFrame();
  body.name = "Event content";
  component.appendChild(body);
  body.resize(compact ? 272 : 660, 220);
  body.layoutMode = "VERTICAL";
  body.primaryAxisSizingMode = "AUTO";
  body.counterAxisSizingMode = "FIXED";
  body.itemSpacing = 8;
  body.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/2"));
  body.fills = [];
  body.strokes = [];
  body.clipsContent = false;
  body.layoutSizingHorizontal = "FILL";
  const copy = REVIEW.FR[category];
  await addField(component, body, category, "Category label", copy.category, "Type/Label/SM/Large", "text/primary", COLORS.ink);
  await addField(component, body, category, "Title", copy.title, "Type/Heading/MD/Large", "text/primary", COLORS.ink);
  await addField(component, body, category, "Organization", copy.organization, "Type/Body/MD/Large", "text/secondary", COLORS.muted, true);
  await addField(component, body, category, "Description", copy.description, "Type/Body/MD/Large", "text/secondary", COLORS.muted, true);
  component.description = `COMP-211 · ${category}/${layout}. Catégorie, période et titre requis. Organisation et description facultatives, uniquement vérifiées. Événement statique sans lien ni repli ; la chronologie est gérée par COMP-210.`;
  return component;
}
function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(1800, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) plainText(frame, `Line ${textY}`, value, x, textY, 1700 - x, size, color);
  return frame;
}
function documentationFrame() {
  const frame = infoFrame("_Generated/Timeline Entry · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-211 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Entrée de timeline", 42, COLORS.ink, 48, 68],
    ["Un événement lisible avec catégorie et période explicites. Aucun établissement, emploi ou date supposé.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}
function notesFrame() {
  return infoFrame("_Generated/Timeline Entry · Usage notes", 2180, 410, COLORS.subtle, [
    ["USAGE · COMP-210 ordonne des entrées Formation et Expérience du plus récent au plus ancien.", 16, COLORS.ink, 40, 24],
    ["REQUIS · Catégorie, période et titre documentés. Une entrée incomplète reste une dépendance éditoriale.", 16, COLORS.ink, 40, 84],
    ["OPTIONNEL · Organisation et description visibles seulement si elles sont factuelles et utiles.", 16, COLORS.ink, 40, 144],
    ["ACCESSIBILITÉ · Catégorie annoncée en texte ; aucune lecture nécessaire d'un repère décoratif.", 16, COLORS.ink, 40, 204],
    ["RESPONSIVE · Même ordre de lecture à 900 et 320 px ; période et titre restent associés.", 16, COLORS.ink, 40, 264],
    ["INTERACTION · Aucune en V1 : ni repli, ni lien externe automatique, ni contenu révélé par mouvement.", 16, COLORS.ink, 40, 324],
  ]);
}
function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Timeline Entry · Preview surface";
  board.resize(1800, 1880);
  board.x = 0;
  board.y = 250;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const [value, x] of [["LARGE · 900 PX", 180], ["COMPACT · 320 PX", 1260]]) plainText(page, value, value, x, 310, 460, 15, COLORS.violet);
  for (const [value, y] of [["FORMATION · FR", 430], ["EXPÉRIENCE · FR", 920], ["ENGLISH · REVIEW", 1440]]) plainText(page, value, value, 30, y, 600, 15, COLORS.ink);
}
function reviewInstance(source, category, locale, page, x, y, hideOptional = false) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · ${locale}${hideOptional ? " · no optional text" : ""}`;
  page.appendChild(instance);
  const copy = REVIEW[locale][category];
  const values = {
    "Category label": copy.category,
    Period: copy.period,
    Title: copy.title,
    Organization: copy.organization,
    Description: copy.description,
  };
  const props = {};
  for (const [field, value] of Object.entries(values)) props[property(instance, `${field} · ${category}`)] = value;
  props[property(instance, `Show Organization · ${category}`)] = !hideOptional;
  props[property(instance, `Show Description · ${category}`)] = !hideOptional;
  instance.setProperties(props);
  instance.x = x;
  instance.y = y;
  return instance;
}
function syncApprovedList(set) {
  if (set.children.length !== 8 || ["Project", "Profile"].some((context) => !set.children.some((entry) => entry.name === `Context=${context}, Layout=Wide, State=Normal`))) throw new Error("COMP-209 modifié : validation non synchronisée");
  set.description = "COMP-209 · 8 variantes Project/Profile × Wide/Compact × Normal/Empty approuvées individuellement par Costa le 2026-09-22. Contenus de revue uniquement ; seconde passe globale prévue.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-209 · Liste de stacks");
  if (!card) return;
  const status = card.children.find((entry) => entry.type === "TEXT" && entry.name === "Status");
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 8 VARIANTES";
}
function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 4400));
  let card = index.children.find((entry) => entry.name === "Index · COMP-211 · Entrée de timeline");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-211 · Entrée de timeline";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 4050;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-211 · Entrée de timeline", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 4 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Formation ou Expérience · large/compact · période, titre et contexte textuels.", 28, 105, 1060, 16, COLORS.muted, false);
  plainText(card, "Page", "02.20 — Timeline Entry", 1020, 65, 290, 15, COLORS.violet);
}
async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "surface/subtle", "text/primary", "text/secondary", "border/default"]) variable("Semantic/Color", name);
  for (const name of ["space/2", "space/4", "space/6", "space/8"]) variable("Primitives/Space", name);
  for (const name of ["radius/none", "stroke/control"]) variable("Primitives/Shape", name);
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Label/SM/Large", "Type/Label/MD/Large", "Type/Heading/MD/Large", "Type/Body/MD/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}
async function main() {
  figma.notify("Préparation de COMP-211 Entrée de timeline…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const listPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.19 — Stack List");
  const listSet = listPage && listPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Stack list");
  if (!listSet) throw new Error("COMP-209 absent : générer la liste de stacks avant COMP-211");
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.20 — Timeline Entry");
  if (!page) {
    page = figma.createPage();
    page.name = "02.20 — Timeline Entry";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Timeline entry");
  if (existing) {
    if (existing.children.length !== 4 || CATEGORIES.some((category) => LAYOUTS.some((layout) => !existing.children.some((entry) => entry.name === `Category=${category}, Layout=${layout}`)))) throw new Error("COMP-211 modifié : arrêt sans remplacement");
    syncApprovedList(listSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-211 préservé · 4 variantes à revoir");
    return;
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Timeline Entry Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const category of CATEGORIES) for (const layout of LAYOUTS) components.push(await createVariant(category, layout, staging));
  const set = figma.combineAsVariants(components, page);
  set.name = "Timeline entry";
  set.description = "COMP-211 · Première passe à revoir. Formation/Expérience × Wide/Compact ; textes de revue non publiables, aucun événement attribué à Costa.";
  set.x = 180;
  set.y = 480;
  const positions = { "Education/Wide": [0, 0], "Education/Compact": [1080, 0], "Experience/Wide": [0, 500], "Experience/Compact": [1080, 500] };
  for (const category of CATEGORIES) for (const layout of LAYOUTS) {
    const component = requiredVariant(set, `Category=${category}, Layout=${layout}`);
    const [x, y] = positions[`${category}/${layout}`];
    component.x = x;
    component.y = y;
  }
  set.resizeWithoutConstraints(1400, 920);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page);
  reviewInstance(requiredVariant(set, "Category=Education, Layout=Wide"), "Education", "EN", page, 180, 1540);
  reviewInstance(requiredVariant(set, "Category=Experience, Layout=Compact"), "Experience", "EN", page, 1260, 1540);
  reviewInstance(requiredVariant(set, "Category=Education, Layout=Compact"), "Education", "FR", page, 1260, 1830, true);
  page.appendChild(notesFrame());
  syncApprovedList(listSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-211 créé · 4 variantes et exemples FR/EN à revoir");
}
main().catch((error) => {
  figma.notify(`Erreur Timeline Entry Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
