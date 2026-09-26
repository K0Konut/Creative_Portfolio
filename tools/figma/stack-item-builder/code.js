const FORMATS = ["Summary", "Detail"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", border: "#827F76", violet: "#4B3CFF" };
const REVIEW = {
  FR: { name: "Nom de technologie", context: "Contexte à renseigner avec des faits vérifiés." },
  EN: { name: "Technology name", context: "Add context only when supported by verified facts." },
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
function property(instance, name) {
  const key = Object.keys(instance.componentProperties).find((entry) => entry.startsWith(`${name}#`));
  if (!key) throw new Error(`Propriété ${name} absente de ${instance.name}`);
  return key;
}
async function createVariant(format, parent) {
  const summary = format === "Summary";
  const component = figma.createComponent();
  component.name = `Format=${format}`;
  parent.appendChild(component);
  component.resize(summary ? 260 : 440, summary ? 64 : 148);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "MIN";
  component.paddingLeft = summary ? 16 : 24;
  component.paddingRight = summary ? 16 : 24;
  component.paddingTop = summary ? 16 : 24;
  component.paddingBottom = summary ? 16 : 24;
  component.itemSpacing = summary ? 0 : 12;
  const paddingToken = summary ? "space/4" : "space/6";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) component.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  component.setBoundVariable("itemSpacing", variable("Primitives/Space", summary ? "space/0" : "space/3"));
  component.cornerRadius = 0;
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/none"));
  component.clipsContent = false;
  component.fills = [boundColor(summary ? "surface/subtle" : "surface/canvas", summary ? COLORS.subtle : COLORS.canvas)];
  component.strokes = [boundColor("border/default", COLORS.border)];
  component.strokeWeight = 1;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/control"));
  component.strokeAlign = "INSIDE";

  const name = await styledText(REVIEW.FR.name, summary ? "Type/Label/MD/Large" : "Type/Heading/MD/Large", "text/primary", COLORS.ink);
  name.name = "Technology name · editable";
  component.appendChild(name);
  name.layoutSizingHorizontal = "FILL";
  const nameKey = component.addComponentProperty("Name", "TEXT", REVIEW.FR.name);
  name.componentPropertyReferences = { characters: nameKey };
  if (!summary) {
    const context = await styledText(REVIEW.FR.context, "Type/Body/MD/Large", "text/secondary", COLORS.muted);
    context.name = "Verified context · optional";
    component.appendChild(context);
    context.layoutSizingHorizontal = "FILL";
    const contextKey = component.addComponentProperty("Context", "TEXT", REVIEW.FR.context);
    const showContextKey = component.addComponentProperty("Show context", "BOOLEAN", true);
    context.componentPropertyReferences = { characters: contextKey, visible: showContextKey };
  }
  component.description = `COMP-207 · ${format}. Élément statique non interactif. Name obligatoire et éditable ; ${summary ? "le parent gère le regroupement et la densité" : "Context facultatif, à afficher uniquement avec un fait vérifié"}. Aucun niveau, logo ou lien supposé. Nom textuel conservé même si un logo officiel est ajouté plus tard.`;
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
  const frame = infoFrame("_Generated/Stack Item · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-207 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Élément de stack", 42, COLORS.ink, 48, 68],
    ["Un nom lisible, un contexte facultatif et vérifié. Aucun niveau, lien ou logo supposé.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}
function notesFrame() {
  return infoFrame("_Generated/Stack Item · Usage notes", 1420, 390, COLORS.subtle, [
    ["USAGE · Summary dans COMP-208, Detail dans COMP-209 et le corps de projet ; composant toujours statique.", 16, COLORS.ink, 40, 24],
    ["CONTENU · Name obligatoire. Context facultatif et uniquement fondé sur des faits vérifiés ; catégorie gérée par le parent.", 16, COLORS.ink, 40, 84],
    ["LOGO · Différé jusqu'à l'obtention d'une ressource officielle ; le nom textuel restera visible.", 16, COLORS.ink, 40, 144],
    ["ACCESSIBILITÉ · Aucun niveau ou sens transmis par la couleur ; ni filtre, ni lien, ni état hover.", 16, COLORS.ink, 40, 204],
    ["RESPONSIVE · Texte non tronqué ; vérifier les vrais noms, FR/EN, 320 px et zoom 200 % dans les compositions.", 16, COLORS.ink, 40, 264],
    ["VÉRITÉ · Les noms et contextes de la planche sont des placeholders de revue, pas des compétences attribuées à Costa.", 16, COLORS.ink, 40, 324],
  ]);
}
function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Stack Item · Preview surface";
  frame.resize(1800, 1120);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  plainText(page, "Summary heading", "SYNTHÉTIQUE · BANDEAU", 200, 322, 380, 15, COLORS.violet);
  plainText(page, "Detail heading", "DÉTAILLÉ · LISTE", 670, 322, 400, 15, COLORS.violet);
  plainText(page, "Review heading", "EXEMPLES DE REVUE · PROPRIÉTÉS TEXTE", 200, 780, 1000, 16, COLORS.violet);
  plainText(page, "FR label", "FRANÇAIS", 200, 840, 300, 14, COLORS.ink);
  plainText(page, "EN label", "ENGLISH", 670, 840, 300, 14, COLORS.ink);
  plainText(page, "Compact label", "DÉTAIL · 280 PX", 1190, 840, 360, 14, COLORS.ink);
}
function reviewInstance(source, locale, showContext, width, page, x, y) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · ${locale}${width ? ` · ${width}px` : ""}`;
  page.appendChild(instance);
  const props = { [property(instance, "Name")]: REVIEW[locale].name };
  if (source.name === "Format=Detail") {
    props[property(instance, "Context")] = REVIEW[locale].context;
    props[property(instance, "Show context")] = showContext;
  }
  instance.setProperties(props);
  if (width) instance.resize(width, instance.height);
  instance.x = x;
  instance.y = y;
  return instance;
}
function syncApprovedCarousel(wideSet, compactSet) {
  if (wideSet.children.length !== 20 || compactSet.children.length !== 4) throw new Error("COMP-205 modifié : validation non synchronisée");
  wideSet.description = "COMP-205 · 20 variantes larges FR/EN × 10 états approuvées individuellement par Costa le 2026-09-22. Médias et nombre d'images de revue uniquement ; seconde passe globale prévue.";
  compactSet.description = "COMP-205 · 4 références compactes FR/EN × Ready/ReducedMotion approuvées individuellement par Costa le 2026-09-22. Reflow 320 px et zoom 200 % à vérifier dans les écrans ; seconde passe globale prévue.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-205 · Carrousel d'images du projet");
  if (!card) return;
  const status = card.children.find((entry) => entry.type === "TEXT" && entry.name === "Status");
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 20 LARGES + 4 COMPACTES";
}
function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 3720));
  let card = index.children.find((entry) => entry.name === "Index · COMP-207 · Élément de stack");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-207 · Élément de stack";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 3450;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-207 · Élément de stack", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 2 FORMES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Summary ou Detail · nom éditable, contexte facultatif et vérifié ; aucune interaction.", 28, 105, 1050, 16, COLORS.muted, false);
  plainText(card, "Page", "02.17 — Stack Item", 1020, 65, 280, 15, COLORS.violet);
}
async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "surface/subtle", "text/primary", "text/secondary", "border/default"]) variable("Semantic/Color", name);
  for (const name of ["space/0", "space/3", "space/4", "space/6"]) variable("Primitives/Space", name);
  for (const name of ["radius/none", "stroke/control"]) variable("Primitives/Shape", name);
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Label/MD/Large", "Type/Heading/MD/Large", "Type/Body/MD/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}
async function main() {
  figma.notify("Préparation de COMP-207 Élément de stack…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const carouselPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.16 — Project Carousel");
  const wideSet = carouselPage && carouselPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project carousel · Wide");
  const compactSet = carouselPage && carouselPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project carousel · Compact references");
  if (!wideSet || !compactSet) throw new Error("COMP-205 absent : générer le carrousel avant COMP-207");
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.17 — Stack Item");
  if (!page) {
    page = figma.createPage();
    page.name = "02.17 — Stack Item";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Stack item");
  if (existing) {
    if (existing.children.length !== 2 || FORMATS.some((format) => !existing.children.some((entry) => entry.name === `Format=${format}`))) throw new Error("COMP-207 modifié : arrêt sans remplacement");
    syncApprovedCarousel(wideSet, compactSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-207 préservé · 2 formes à revoir");
    return;
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Stack Item Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const format of FORMATS) components.push(await createVariant(format, staging));
  const set = figma.combineAsVariants(components, page);
  set.name = "Stack item";
  set.description = "COMP-207 · Première passe à revoir. Format Summary/Detail ; nom textuel obligatoire, contexte facultatif. Contenus réels et logos officiels non fournis.";
  set.x = 200;
  set.y = 430;
  requiredVariant(set, "Format=Summary").x = 0;
  requiredVariant(set, "Format=Summary").y = 0;
  requiredVariant(set, "Format=Detail").x = 470;
  requiredVariant(set, "Format=Detail").y = 0;
  set.resizeWithoutConstraints(930, 270);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page);
  const summary = requiredVariant(set, "Format=Summary");
  const detail = requiredVariant(set, "Format=Detail");
  reviewInstance(summary, "FR", false, null, page, 200, 890);
  reviewInstance(summary, "EN", false, null, page, 670, 890);
  reviewInstance(detail, "FR", true, 280, page, 1190, 890);
  reviewInstance(detail, "EN", true, 440, page, 670, 1030);
  reviewInstance(detail, "FR", false, 440, page, 200, 1030);
  page.appendChild(notesFrame());
  syncApprovedCarousel(wideSet, compactSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-207 créé · 2 formes et références FR/EN à revoir");
}
main().catch((error) => {
  figma.notify(`Erreur Stack Item Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
