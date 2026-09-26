const LAYOUTS = ["Wide", "Compact"];
const STATES = ["Normal", "Incomplete"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", border: "#827F76", violet: "#4B3CFF" };
const COPY = {
  FR: {
    title: "Parcours",
    intro: "Du plus récent au plus ancien · contenu à vérifier.",
    noticeLabel: "INFORMATION",
    noticeTitle: "Parcours à compléter",
    noticeBody: "Certaines informations restent à confirmer avant publication.",
  },
  EN: {
    title: "Journey",
    intro: "Newest to oldest · content to verify.",
    noticeLabel: "INFORMATION",
    noticeTitle: "Journey to complete",
    noticeBody: "Some information still needs confirmation before publication.",
  },
};
const ENTRY_REVIEW = {
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
async function addEditableText(component, name, value, styleName, colorName, fallback) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = `${name} · editable`;
  component.appendChild(node);
  node.layoutSizingHorizontal = "FILL";
  const key = component.addComponentProperty(name, "TEXT", value);
  node.componentPropertyReferences = { characters: key };
  return node;
}
function setEntryCopy(instance, category, locale, hideOptional) {
  const copy = ENTRY_REVIEW[locale][category];
  const props = {};
  for (const [field, value] of Object.entries({ "Category label": copy.category, Period: copy.period, Title: copy.title, Organization: copy.organization, Description: copy.description })) {
    props[property(instance, `${field} · ${category}`)] = value;
  }
  props[property(instance, `Show Organization · ${category}`)] = !hideOptional;
  props[property(instance, `Show Description · ${category}`)] = !hideOptional;
  instance.setProperties(props);
}
async function addNotice(component, layout, messageSet) {
  const compact = layout === "Compact";
  const notice = requiredVariant(messageSet, `Kind=Info, Size=${compact ? "Inline" : "Section"}`).createInstance();
  notice.name = "COMP-003 · Incomplete timeline notice";
  component.appendChild(notice);
  notice.resize(compact ? 272 : 1056, notice.height);
  notice.setProperties({
    [property(notice, "Title · Info")]: COPY.FR.noticeTitle,
    [property(notice, "Body · Info")]: COPY.FR.noticeBody,
  });
}
async function createVariant(layout, state, parent, entrySet, messageSet) {
  const compact = layout === "Compact";
  const component = figma.createComponent();
  component.name = `Layout=${layout}, State=${state}`;
  parent.appendChild(component);
  component.resize(compact ? 320 : 1120, 1500);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "MIN";
  const paddingToken = compact ? "space/6" : "space/8";
  const padding = compact ? 24 : 32;
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = padding;
    component.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  }
  component.itemSpacing = compact ? 16 : 24;
  component.setBoundVariable("itemSpacing", variable("Primitives/Space", compact ? "space/4" : "space/6"));
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
  component.strokes = [boundColor("border/default", COLORS.border)];
  component.strokeWeight = 1;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/control"));
  component.strokeAlign = "INSIDE";
  component.cornerRadius = 0;
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/none"));
  component.clipsContent = false;

  await addEditableText(component, "Title", COPY.FR.title, compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large", "text/primary", COLORS.ink);
  await addEditableText(component, "Intro", COPY.FR.intro, "Type/Body/MD/Large", "text/secondary", COLORS.muted);
  if (state === "Incomplete") await addNotice(component, layout, messageSet);

  const list = figma.createFrame();
  list.name = "Event list · newest first";
  component.appendChild(list);
  list.resize(compact ? 272 : 1056, 1100);
  list.layoutMode = "VERTICAL";
  list.primaryAxisSizingMode = "AUTO";
  list.counterAxisSizingMode = "FIXED";
  list.itemSpacing = compact ? 16 : 24;
  list.setBoundVariable("itemSpacing", variable("Primitives/Space", compact ? "space/4" : "space/6"));
  list.fills = [];
  list.strokes = [];
  list.clipsContent = false;
  list.layoutSizingHorizontal = "FILL";
  const categories = state === "Normal" ? ["Experience", "Education", "Experience"] : ["Experience", "Education"];
  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    const source = requiredVariant(entrySet, `Category=${category}, Layout=${layout}`);
    const entry = source.createInstance();
    entry.name = `COMP-211 · Event ${index + 1} · ${category}`;
    list.appendChild(entry);
    entry.resize(compact ? 272 : 1056, entry.height);
    setEntryCopy(entry, category, "FR", state === "Incomplete");
  }
  component.description = `COMP-210 · ${layout}/${state}. Timeline entièrement déployée, ordre linéaire du plus récent au plus ancien, sans accordéon ni alternance. ${state === "Incomplete" ? "COMP-003 signale les informations manquantes ; les champs facultatifs restent masqués." : "Trois emplacements de revue, nombre final à confirmer."} Tous les événements sont des placeholders non publiables.`;
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
  const frame = infoFrame("_Generated/Timeline · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-210 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Timeline du parcours", 42, COLORS.ink, 48, 68],
    ["Une seule chronologie visible, du plus récent au plus ancien. Les événements réels restent à fournir.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}
function notesFrame() {
  return infoFrame("_Generated/Timeline · Usage notes", 6000, 470, COLORS.subtle, [
    ["USAGE · Page À propos uniquement ; une chronologie commune pour formation, expériences et petits emplois pertinents.", 16, COLORS.ink, 40, 24],
    ["ORDRE · Du plus récent au plus ancien dans le DOM et visuellement ; aucune alternance gauche-droite.", 16, COLORS.ink, 40, 88],
    ["CONTENU · Trois puis deux emplacements de revue ; dates, événements et nombre final ne sont pas confirmés.", 16, COLORS.ink, 40, 152],
    ["INCOMPLET · Message explicite et champs facultatifs masqués ; ne jamais combler une période ou un événement manquant.", 16, COLORS.ink, 40, 216],
    ["ACCESSIBILITÉ · Liste sémantique ; catégories textuelles ; aucune information réservée à une ligne ou un repère décoratif.", 16, COLORS.ink, 40, 280],
    ["RESPONSIVE · Large 1120 px et compact 320 px ; ordre linéaire identique et texte intégral.", 16, COLORS.ink, 40, 344],
    ["INTERACTION · Entièrement déployée et statique : ni accordéon, ni lien automatique, ni contenu révélé par mouvement.", 16, COLORS.ink, 40, 408],
  ]);
}
function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Timeline · Preview surface";
  board.resize(2200, 5600);
  board.x = 0;
  board.y = 250;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const [value, x] of [["LARGE · 1120 PX", 190], ["COMPACT · 320 PX", 1590]]) plainText(page, value, value, x, 310, 500, 15, COLORS.violet);
  for (const [value, y] of [["NORMAL · FR", 390], ["CONTENU INCOMPLET · FR", 2780], ["ENGLISH · REVIEW", 4580]]) plainText(page, value, value, 35, y, 650, 15, COLORS.ink);
}
async function overrideText(instance, name, value) {
  const node = instance.findOne((entry) => entry.type === "TEXT" && entry.name === name);
  if (!node) throw new Error(`Texte à localiser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}
async function localizeReview(instance, state, locale) {
  const copy = COPY[locale];
  instance.setProperties({ [property(instance, "Title")]: copy.title, [property(instance, "Intro")]: copy.intro });
  if (state === "Incomplete") {
    const notice = instance.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-003 · Incomplete timeline notice");
    if (!notice) throw new Error("Message de contenu incomplet absent");
    notice.setProperties({ [property(notice, "Title · Info")]: copy.noticeTitle, [property(notice, "Body · Info")]: copy.noticeBody });
    await overrideText(notice, "Kind label", copy.noticeLabel);
  }
  const entries = instance.findAll((entry) => entry.type === "INSTANCE" && entry.name.startsWith("COMP-211 · Event "))
    .sort((first, second) => first.name.localeCompare(second.name));
  for (const entry of entries) {
    const category = entry.name.endsWith("Education") ? "Education" : "Experience";
    setEntryCopy(entry, category, locale, state === "Incomplete");
  }
}
async function reviewInstance(source, state, locale, page, x, y) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · ${locale}`;
  page.appendChild(instance);
  await localizeReview(instance, state, locale);
  instance.x = x;
  instance.y = y;
  return instance;
}
function syncApprovedEntry(set) {
  if (set.children.length !== 4 || ["Education", "Experience"].some((category) => LAYOUTS.some((layout) => !set.children.some((entry) => entry.name === `Category=${category}, Layout=${layout}`)))) throw new Error("COMP-211 modifié : validation non synchronisée");
  set.description = "COMP-211 · 4 variantes Education/Experience × Wide/Compact approuvées individuellement par Costa le 2026-09-22. Contenus de revue uniquement ; seconde passe globale prévue.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-211 · Entrée de timeline");
  if (!card) return;
  const status = card.children.find((entry) => entry.type === "TEXT" && entry.name === "Status");
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 4 VARIANTES";
}
function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 4620));
  let card = index.children.find((entry) => entry.name === "Index · COMP-210 · Timeline du parcours");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-210 · Timeline du parcours";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 4250;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-210 · Timeline du parcours", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 4 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Large/compact · normal/incomplet · ordre du plus récent au plus ancien.", 28, 105, 1060, 16, COLORS.muted, false);
  plainText(card, "Page", "02.21 — Timeline", 1020, 65, 290, 15, COLORS.violet);
}
async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) variable("Semantic/Color", name);
  for (const name of ["space/4", "space/6", "space/8"]) variable("Primitives/Space", name);
  for (const name of ["radius/none", "stroke/control"]) variable("Primitives/Shape", name);
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Heading/MD/Large", "Type/Heading/LG/Large", "Type/Body/MD/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}
async function main() {
  figma.notify("Préparation de COMP-210 Timeline du parcours…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const entryPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.20 — Timeline Entry");
  const entrySet = entryPage && entryPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Timeline entry");
  const messagePage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message");
  const messageSet = messagePage && messagePage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message");
  if (!entrySet || !messageSet) throw new Error("COMP-211 ou COMP-003 absent : générer les dépendances avant COMP-210");
  requiredVariant(messageSet, "Kind=Info, Size=Inline");
  requiredVariant(messageSet, "Kind=Info, Size=Section");
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.21 — Timeline");
  if (!page) {
    page = figma.createPage();
    page.name = "02.21 — Timeline";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Timeline");
  if (existing) {
    if (existing.children.length !== 4 || LAYOUTS.some((layout) => STATES.some((state) => !existing.children.some((entry) => entry.name === `Layout=${layout}, State=${state}`)))) throw new Error("COMP-210 modifié : arrêt sans remplacement");
    syncApprovedEntry(entrySet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-210 préservé · 4 variantes à revoir");
    return;
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Timeline Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const layout of LAYOUTS) for (const state of STATES) components.push(await createVariant(layout, state, staging, entrySet, messageSet));
  const set = figma.combineAsVariants(components, page);
  set.name = "Timeline";
  set.description = "COMP-210 · Première passe à revoir. Wide/Compact × Normal/Incomplete ; entièrement déployée, ordre linéaire, événements de revue non publiables.";
  set.x = 190;
  set.y = 470;
  const positions = { "Wide/Normal": [0, 0], "Compact/Normal": [1400, 0], "Wide/Incomplete": [0, 2390], "Compact/Incomplete": [1400, 2390] };
  for (const layout of LAYOUTS) for (const state of STATES) {
    const component = requiredVariant(set, `Layout=${layout}, State=${state}`);
    const [x, y] = positions[`${layout}/${state}`];
    component.x = x;
    component.y = y;
  }
  set.resizeWithoutConstraints(1720, 4300);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page);
  await reviewInstance(requiredVariant(set, "Layout=Wide, State=Normal"), "Normal", "EN", page, 190, 4660);
  await reviewInstance(requiredVariant(set, "Layout=Compact, State=Incomplete"), "Incomplete", "EN", page, 1590, 4660);
  page.appendChild(notesFrame());
  syncApprovedEntry(entrySet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-210 créé · 4 variantes et références FR/EN à revoir");
}
main().catch((error) => {
  figma.notify(`Erreur Timeline Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
