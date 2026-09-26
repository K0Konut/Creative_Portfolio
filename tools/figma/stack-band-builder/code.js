const LAYOUTS = ["Wide", "Compact"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", violet: "#4B3CFF" };
const REVIEW = {
  FR: ["Nom de technologie A", "Nom de technologie B", "Nom de technologie C", "Nom de technologie D"],
  EN: ["Technology name A", "Technology name B", "Technology name C", "Technology name D"],
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
function itemChildren(node) {
  return node.findAll((entry) => entry.type === "INSTANCE" && entry.name.startsWith("COMP-207 · Item "))
    .sort((first, second) => first.name.localeCompare(second.name));
}
async function createVariant(layout, parent, itemSource) {
  const compact = layout === "Compact";
  const width = compact ? 320 : 1120;
  const inset = compact ? 24 : 32;
  const gap = compact ? 12 : 16;
  const component = figma.createComponent();
  component.name = `Layout=${layout}`;
  parent.appendChild(component);
  component.resize(width, 440);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "MIN";
  component.paddingLeft = inset;
  component.paddingRight = inset;
  component.paddingTop = inset;
  component.paddingBottom = inset;
  component.itemSpacing = compact ? 24 : 32;
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) component.setBoundVariable(field, variable("Primitives/Space", compact ? "space/6" : "space/8"));
  component.setBoundVariable("itemSpacing", variable("Primitives/Space", compact ? "space/6" : "space/8"));
  component.fills = [boundColor("surface/brand", COLORS.violet)];
  component.strokes = [];
  component.cornerRadius = 0;
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/none"));
  component.clipsContent = false;

  const title = await styledText("Technologies", compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large", "text/on-brand", COLORS.canvas);
  title.name = "Section title · editable";
  component.appendChild(title);
  title.layoutSizingHorizontal = "FILL";
  const titleKey = component.addComponentProperty("Title", "TEXT", "Technologies");
  title.componentPropertyReferences = { characters: titleKey };

  const sequence = figma.createFrame();
  sequence.name = "Single sequence · COMP-207 instances";
  component.appendChild(sequence);
  sequence.resize(width - inset * 2, compact ? 300 : 100);
  sequence.layoutMode = compact ? "VERTICAL" : "HORIZONTAL";
  sequence.primaryAxisSizingMode = compact ? "AUTO" : "FIXED";
  sequence.counterAxisSizingMode = compact ? "FIXED" : "AUTO";
  sequence.primaryAxisAlignItems = "MIN";
  sequence.counterAxisAlignItems = "MIN";
  sequence.itemSpacing = gap;
  sequence.setBoundVariable("itemSpacing", variable("Primitives/Space", compact ? "space/3" : "space/4"));
  sequence.fills = [];
  sequence.strokes = [];
  sequence.clipsContent = false;
  sequence.layoutSizingHorizontal = "FILL";
  const itemWidth = compact ? width - inset * 2 : (width - inset * 2 - gap * 3) / 4;
  for (let index = 0; index < 4; index++) {
    const item = itemSource.createInstance();
    item.name = `COMP-207 · Item ${index + 1}`;
    sequence.appendChild(item);
    item.setProperties({ [property(item, "Name")]: REVIEW.FR[index] });
    item.resize(itemWidth, item.height);
  }
  component.description = `COMP-208 · ${layout}. Bandeau statique sans lien ni défilement ; quatre COMP-207 de revue en une séquence. Titre et noms éditables. En HTML : section titrée avec une seule liste, nombre et noms issus des contenus vérifiés.`;
  return component;
}
function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(2200, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) plainText(frame, `Line ${textY}`, value, x, textY, 2080 - x, size, color);
  return frame;
}
function documentationFrame() {
  const frame = infoFrame("_Generated/Stack Band · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-208 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Bandeau de stacks", 42, COLORS.ink, 48, 68],
    ["Un aperçu statique : chaque nom apparaît une seule fois et reste visible quelle que soit la largeur.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}
function notesFrame() {
  return infoFrame("_Generated/Stack Band · Usage notes", 2360, 470, COLORS.subtle, [
    ["USAGE · Accueil uniquement ; aperçu des stacks principales, sans se substituer à COMP-209 Liste de stacks.", 16, COLORS.ink, 40, 24],
    ["CONTENU · Quatre entrées fictives pour la revue de densité ; sélection, ordre et nombre réels à confirmer.", 16, COLORS.ink, 40, 88],
    ["STRUCTURE · Un titre de section et une seule liste sémantique de COMP-207 ; aucune copie pour simuler un défilement.", 16, COLORS.ink, 40, 152],
    ["INTERACTION · Aucune : pas de lien, filtre, marquee, autoplay ni contrôle de pause dans cette V1.", 16, COLORS.ink, 40, 216],
    ["RESPONSIVE · Wide 1120 px et Compact 320 px ; reflow vertical compact sans débordement horizontal.", 16, COLORS.ink, 40, 280],
    ["ACCESSIBILITÉ · Ordre de lecture identique, tous les noms textuels visibles ; vérifier les contenus réels à zoom 200 %.", 16, COLORS.ink, 40, 344],
    ["MOTION · Le bandeau reste statique même avec mouvement réduit ; aucun contenu n'attend une animation.", 16, COLORS.ink, 40, 408],
  ]);
}
function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Stack Band · Preview surface";
  frame.resize(2200, 2060);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  for (const [value, x] of [["ÉTENDU · 1120 PX", 200], ["COMPACT · 320 PX", 1570]]) plainText(page, value, value, x, 310, 500, 15, COLORS.violet);
  for (const [value, y] of [["FRANÇAIS · EXEMPLES DE REVUE", 940], ["ENGLISH · REVIEW EXAMPLES", 1540]]) plainText(page, value, value, 200, y, 900, 16, COLORS.violet);
}
function reviewInstance(source, locale, page, x, y) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · ${locale}`;
  page.appendChild(instance);
  instance.setProperties({ [property(instance, "Title")]: "Technologies" });
  const items = itemChildren(instance);
  if (items.length !== 4) throw new Error(`COMP-208 : ${items.length} éléments de revue au lieu de 4`);
  for (let index = 0; index < 4; index++) items[index].setProperties({ [property(items[index], "Name")]: REVIEW[locale][index] });
  instance.x = x;
  instance.y = y;
  return instance;
}
function syncApprovedItem(set) {
  if (set.children.length !== 2 || ["Summary", "Detail"].some((format) => !set.children.some((entry) => entry.name === `Format=${format}`))) throw new Error("COMP-207 modifié : validation non synchronisée");
  set.description = "COMP-207 · Summary/Detail approuvé individuellement par Costa le 2026-09-22. Noms et contextes de revue uniquement ; seconde passe globale prévue.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-207 · Élément de stack");
  if (!card) return;
  const status = card.children.find((entry) => entry.type === "TEXT" && entry.name === "Status");
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 2 FORMES";
}
function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 3950));
  let card = index.children.find((entry) => entry.name === "Index · COMP-208 · Bandeau de stacks");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-208 · Bandeau de stacks";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 3650;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-208 · Bandeau de stacks", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 2 FORMES STATIQUES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Une séquence de COMP-207 ; 4 noms de revue, reflow compact sans défilement.", 28, 105, 1060, 16, COLORS.muted, false);
  plainText(card, "Page", "02.18 — Stack Band", 1020, 65, 290, 15, COLORS.violet);
}
async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/brand", "text/on-brand"]) variable("Semantic/Color", name);
  for (const name of ["space/3", "space/4", "space/6", "space/8"]) variable("Primitives/Space", name);
  variable("Primitives/Shape", "radius/none");
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Heading/MD/Large", "Type/Heading/LG/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}
async function main() {
  figma.notify("Préparation de COMP-208 Bandeau de stacks…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const itemPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.17 — Stack Item");
  const itemSet = itemPage && itemPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Stack item");
  if (!itemSet) throw new Error("COMP-207 absent : générer l'élément de stack avant COMP-208");
  const itemSource = requiredVariant(itemSet, "Format=Summary");
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.18 — Stack Band");
  if (!page) {
    page = figma.createPage();
    page.name = "02.18 — Stack Band";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Stack band");
  if (existing) {
    if (existing.children.length !== 2 || LAYOUTS.some((layout) => !existing.children.some((entry) => entry.name === `Layout=${layout}`))) throw new Error("COMP-208 modifié : arrêt sans remplacement");
    syncApprovedItem(itemSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-208 préservé · 2 formes à revoir");
    return;
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Stack Band Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const layout of LAYOUTS) components.push(await createVariant(layout, staging, itemSource));
  const set = figma.combineAsVariants(components, page);
  set.name = "Stack band";
  set.description = "COMP-208 · Première passe à revoir. Deux dispositions statiques ; quatre noms fictifs pour juger la densité. Sélection et nombre finaux à confirmer.";
  set.x = 200;
  set.y = 430;
  requiredVariant(set, "Layout=Wide").x = 0;
  requiredVariant(set, "Layout=Wide").y = 0;
  requiredVariant(set, "Layout=Compact").x = 1370;
  requiredVariant(set, "Layout=Compact").y = 0;
  set.resizeWithoutConstraints(1690, 450);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page);
  const wide = requiredVariant(set, "Layout=Wide");
  const compact = requiredVariant(set, "Layout=Compact");
  reviewInstance(wide, "FR", page, 200, 990);
  reviewInstance(compact, "FR", page, 1570, 990);
  reviewInstance(wide, "EN", page, 200, 1590);
  reviewInstance(compact, "EN", page, 1570, 1590);
  page.appendChild(notesFrame());
  syncApprovedItem(itemSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-208 créé · deux formes statiques et exemples FR/EN à revoir");
}
main().catch((error) => {
  figma.notify(`Erreur Stack Band Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
