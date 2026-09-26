const CONTEXTS = ["Project", "Profile"];
const LAYOUTS = ["Wide", "Compact"];
const STATES = ["Normal", "Empty"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", border: "#827F76", violet: "#4B3CFF" };
const COPY = {
  FR: {
    Project: { title: "Technologies du projet", intro: "Exemples de structure · contenu du projet à vérifier.", groups: ["Groupe du projet à définir"], emptyTitle: "Stacks non documentées", emptyBody: "Aucune technologie ne peut être attribuée à ce projet pour le moment." },
    Profile: { title: "Compétences", intro: "Exemples de structure · compétences à vérifier.", groups: ["Groupe A · à définir", "Groupe B · à définir"], emptyTitle: "Compétences à compléter", emptyBody: "La liste de compétences sera publiée après vérification." },
    item: "Nom de technologie", context: "Contexte à renseigner avec des faits vérifiés.", emptyLabel: "ÉTAT VIDE",
  },
  EN: {
    Project: { title: "Project technologies", intro: "Structure example · project content to verify.", groups: ["Project group to define"], emptyTitle: "Project stack not documented", emptyBody: "No technology can be attributed to this project yet." },
    Profile: { title: "Skills", intro: "Structure example · skills to verify.", groups: ["Group A · to define", "Group B · to define"], emptyTitle: "Skills to complete", emptyBody: "The skills list will be published after verification." },
    item: "Technology name", context: "Add context only when supported by verified facts.", emptyLabel: "EMPTY STATE",
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
function attachTextProperty(component, node, name, value) {
  const key = component.addComponentProperty(name, "TEXT", value);
  node.componentPropertyReferences = { characters: key };
}
async function addText(component, name, value, styleName, colorName, fallback) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = `${name} · editable`;
  component.appendChild(node);
  node.layoutSizingHorizontal = "FILL";
  attachTextProperty(component, node, name, value);
  return node;
}
async function addEmpty(component, context, layout, messageSet) {
  const compact = layout === "Compact";
  const source = requiredVariant(messageSet, `Kind=Empty, Size=${compact ? "Inline" : "Section"}`);
  const message = source.createInstance();
  message.name = "COMP-003 · Empty stack list";
  component.appendChild(message);
  message.resize(compact ? 272 : 1056, message.height);
  message.setProperties({
    [property(message, "Title · Empty")]: COPY.FR[context].emptyTitle,
    [property(message, "Body · Empty")]: COPY.FR[context].emptyBody,
  });
}
async function addGroup(component, groups, context, layout, index, itemSource) {
  const compact = layout === "Compact";
  const outerWidth = compact ? 272 : 1056;
  const groupWidth = context === "Profile" && !compact ? (outerWidth - 24) / 2 : outerWidth;
  const group = figma.createFrame();
  group.name = `Group ${index + 1}`;
  groups.appendChild(group);
  group.resize(groupWidth, 300);
  group.layoutMode = "VERTICAL";
  group.primaryAxisSizingMode = "AUTO";
  group.counterAxisSizingMode = "FIXED";
  group.itemSpacing = 16;
  group.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/4"));
  group.fills = [];
  group.strokes = [];
  group.clipsContent = false;
  const title = await styledText(COPY.FR[context].groups[index], "Type/Label/MD/Large", "text/secondary", COLORS.muted);
  title.name = `Group ${index + 1} title · editable`;
  group.appendChild(title);
  title.layoutSizingHorizontal = "FILL";
  attachTextProperty(component, title, `Group ${index + 1} · ${context}`, COPY.FR[context].groups[index]);
  const items = figma.createFrame();
  items.name = `Group ${index + 1} · item list`;
  group.appendChild(items);
  items.resize(groupWidth, 200);
  items.layoutMode = context === "Project" && !compact ? "HORIZONTAL" : "VERTICAL";
  items.primaryAxisSizingMode = context === "Project" && !compact ? "FIXED" : "AUTO";
  items.counterAxisSizingMode = context === "Project" && !compact ? "AUTO" : "FIXED";
  items.itemSpacing = 16;
  items.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/4"));
  items.fills = [];
  items.strokes = [];
  items.clipsContent = false;
  items.layoutSizingHorizontal = "FILL";
  const count = context === "Project" ? 3 : 2;
  const itemWidth = context === "Project" && !compact ? (groupWidth - 32) / 3 : groupWidth;
  for (let itemIndex = 0; itemIndex < count; itemIndex++) {
    const item = itemSource.createInstance();
    item.name = `COMP-207 · Group ${index + 1} item ${itemIndex + 1}`;
    items.appendChild(item);
    item.setProperties({
      [property(item, "Name")]: `${COPY.FR.item} ${index + 1}.${itemIndex + 1}`,
      [property(item, "Context")]: COPY.FR.context,
      [property(item, "Show context")]: context === "Project",
    });
    item.resize(itemWidth, item.height);
  }
}
async function addNormal(component, context, layout, itemSource) {
  const compact = layout === "Compact";
  await addText(component, `Intro · ${context}`, COPY.FR[context].intro, "Type/Body/MD/Large", "text/secondary", COLORS.muted);
  const groups = figma.createFrame();
  groups.name = "Named groups · single reading order";
  component.appendChild(groups);
  groups.resize(compact ? 272 : 1056, 400);
  groups.layoutMode = context === "Profile" && !compact ? "HORIZONTAL" : "VERTICAL";
  groups.primaryAxisSizingMode = context === "Profile" && !compact ? "FIXED" : "AUTO";
  groups.counterAxisSizingMode = context === "Profile" && !compact ? "AUTO" : "FIXED";
  groups.itemSpacing = 24;
  groups.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/6"));
  groups.fills = [];
  groups.strokes = [];
  groups.clipsContent = false;
  groups.layoutSizingHorizontal = "FILL";
  const count = context === "Project" ? 1 : 2;
  for (let index = 0; index < count; index++) await addGroup(component, groups, context, layout, index, itemSource);
}
async function createVariant(context, layout, state, parent, itemSource, messageSet) {
  const compact = layout === "Compact";
  const component = figma.createComponent();
  component.name = `Context=${context}, Layout=${layout}, State=${state}`;
  parent.appendChild(component);
  component.resize(compact ? 320 : 1120, 800);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "MIN";
  const padding = compact ? 24 : 32;
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = padding;
    component.setBoundVariable(field, variable("Primitives/Space", compact ? "space/6" : "space/8"));
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
  await addText(component, `Title · ${context}`, COPY.FR[context].title, compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large", "text/primary", COLORS.ink);
  if (state === "Empty") await addEmpty(component, context, layout, messageSet);
  else await addNormal(component, context, layout, itemSource);
  component.description = `COMP-209 · ${context}/${layout}/${state}. Groupes nommés et éléments COMP-207 en liste sémantique. ${state === "Empty" ? "État vide COMP-003 sans données inventées." : "Noms, groupes et contextes de revue non publiables ; projet et profil demandent des faits distincts."} Aucun filtre, niveau supposé ni chargement bloquant.`;
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
  const frame = infoFrame("_Generated/Stack List · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-209 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Liste de stacks", 42, COLORS.ink, 48, 68],
    ["Projet et profil utilisent des groupes distincts ; tout nom, contexte ou niveau attend des faits vérifiés.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}
function notesFrame() {
  return infoFrame("_Generated/Stack List · Usage notes", 6450, 470, COLORS.subtle, [
    ["USAGE · Project dans le détail du projet ; Profile dans À propos. Le bandeau COMP-208 reste un aperçu distinct.", 16, COLORS.ink, 40, 24],
    ["VÉRITÉ · SideQuest est un concept non développé. Aucune technologie du projet ou compétence personnelle n'est confirmée par ces exemples.", 16, COLORS.ink, 40, 88],
    ["NORMAL · Groupes et noms fictifs de revue ; remplacer ou retirer les contextes tant qu'ils ne reposent pas sur des faits.", 16, COLORS.ink, 40, 152],
    ["EMPTY · COMP-003 explique l'absence si la section reste utile ; l'écran peut aussi l'omettre sans simuler du contenu.", 16, COLORS.ink, 40, 216],
    ["ACCESSIBILITÉ · Titre, groupes nommés et listes sémantiques dans l'ordre visuel ; aucune information transmise par un logo seul.", 16, COLORS.ink, 40, 280],
    ["RESPONSIVE · Large 1120 px, compact 320 px ; une seule colonne en compact et texte intégral sans défilement horizontal.", 16, COLORS.ink, 40, 344],
    ["INTERACTION · Aucune en V1 : pas de filtre, classement, niveau fictif ou chargement bloquant.", 16, COLORS.ink, 40, 408],
  ]);
}
function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Stack List · Preview surface";
  frame.resize(2200, 6100);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  for (const [value, x] of [["LARGE · 1120 PX", 190], ["COMPACT · 320 PX", 1590]]) plainText(page, value, value, x, 310, 500, 15, COLORS.violet);
  for (const [value, y] of [["PROJET · NORMAL", 380], ["PROFIL · NORMAL", 1850], ["PROJET · ÉTAT VIDE", 3360], ["PROFIL · ÉTAT VIDE", 4410], ["ENGLISH · EXEMPLES", 5410]]) plainText(page, value, value, 35, y, 600, 15, COLORS.ink);
}
async function overrideText(instance, name, value) {
  const node = instance.findOne((entry) => entry.type === "TEXT" && entry.name === name);
  if (!node) throw new Error(`Texte à localiser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}
async function reviewInstance(source, context, locale, state, page, x, y) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · ${locale}`;
  page.appendChild(instance);
  const copy = COPY[locale][context];
  const props = { [property(instance, `Title · ${context}`)]: copy.title };
  if (state === "Normal") {
    props[property(instance, `Intro · ${context}`)] = copy.intro;
    for (let index = 0; index < copy.groups.length; index++) props[property(instance, `Group ${index + 1} · ${context}`)] = copy.groups[index];
  }
  instance.setProperties(props);
  if (state === "Empty") {
    const message = instance.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-003 · Empty stack list");
    if (!message) throw new Error("COMP-003 Empty absent de COMP-209");
    message.setProperties({ [property(message, "Title · Empty")]: copy.emptyTitle, [property(message, "Body · Empty")]: copy.emptyBody });
    await overrideText(message, "Kind label", COPY[locale].emptyLabel);
  } else {
    const items = instance.findAll((entry) => entry.type === "INSTANCE" && entry.name.startsWith("COMP-207 · Group "))
      .sort((first, second) => first.name.localeCompare(second.name));
    const expected = context === "Project" ? 3 : 4;
    if (items.length !== expected) throw new Error(`COMP-209 : ${items.length} éléments au lieu de ${expected}`);
    for (let index = 0; index < items.length; index++) {
      items[index].setProperties({
        [property(items[index], "Name")]: `${COPY[locale].item} ${index + 1}`,
        [property(items[index], "Context")]: COPY[locale].context,
      });
    }
  }
  instance.x = x;
  instance.y = y;
  return instance;
}
function syncApprovedBand(set) {
  if (set.children.length !== 2 || LAYOUTS.some((layout) => !set.children.some((entry) => entry.name === `Layout=${layout}`))) throw new Error("COMP-208 modifié : validation non synchronisée");
  set.description = "COMP-208 · Wide/Compact statiques approuvés individuellement par Costa le 2026-09-22. Quatre noms de revue seulement ; seconde passe globale prévue.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-208 · Bandeau de stacks");
  if (!card) return;
  const status = card.children.find((entry) => entry.type === "TEXT" && entry.name === "Status");
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 2 FORMES STATIQUES";
}
function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 4160));
  let card = index.children.find((entry) => entry.name === "Index · COMP-209 · Liste de stacks");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-209 · Liste de stacks";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 3850;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-209 · Liste de stacks", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 8 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Projet ou profil · large/compact · normal/vide ; groupes et noms de revue à vérifier.", 28, 105, 1060, 16, COLORS.muted, false);
  plainText(card, "Page", "02.19 — Stack List", 1020, 65, 290, 15, COLORS.violet);
}
async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) variable("Semantic/Color", name);
  for (const name of ["space/4", "space/6", "space/8"]) variable("Primitives/Space", name);
  for (const name of ["radius/none", "stroke/control"]) variable("Primitives/Shape", name);
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Heading/MD/Large", "Type/Heading/LG/Large", "Type/Body/MD/Large", "Type/Label/MD/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}
async function main() {
  figma.notify("Préparation de COMP-209 Liste de stacks…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const itemPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.17 — Stack Item");
  const itemSet = itemPage && itemPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Stack item");
  const bandPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.18 — Stack Band");
  const bandSet = bandPage && bandPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Stack band");
  const messagePage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message");
  const messageSet = messagePage && messagePage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message");
  if (!itemSet || !bandSet || !messageSet) throw new Error("COMP-207, COMP-208 ou COMP-003 absent : générer les dépendances avant COMP-209");
  const itemSource = requiredVariant(itemSet, "Format=Detail");
  requiredVariant(messageSet, "Kind=Empty, Size=Inline");
  requiredVariant(messageSet, "Kind=Empty, Size=Section");
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.19 — Stack List");
  if (!page) {
    page = figma.createPage();
    page.name = "02.19 — Stack List";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Stack list");
  const expectedNames = CONTEXTS.flatMap((context) => LAYOUTS.flatMap((layout) => STATES.map((state) => `Context=${context}, Layout=${layout}, State=${state}`)));
  if (existing) {
    if (existing.children.length !== 8 || expectedNames.some((name) => !existing.children.some((entry) => entry.name === name))) throw new Error("COMP-209 modifié : arrêt sans remplacement");
    syncApprovedBand(bandSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-209 préservé · 8 variantes à revoir");
    return;
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Stack List Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const context of CONTEXTS) for (const layout of LAYOUTS) for (const state of STATES) components.push(await createVariant(context, layout, state, staging, itemSource, messageSet));
  const set = figma.combineAsVariants(components, page);
  set.name = "Stack list";
  set.description = "COMP-209 · Première passe à revoir. Context Project/Profile × Layout Wide/Compact × State Normal/Empty ; placeholders de revue non publiables.";
  set.x = 190;
  set.y = 430;
  const positions = {
    "Project/Wide/Normal": [0, 0], "Project/Compact/Normal": [1400, 0],
    "Profile/Wide/Normal": [0, 1470], "Profile/Compact/Normal": [1400, 1470],
    "Project/Wide/Empty": [0, 2940], "Project/Compact/Empty": [1400, 2940],
    "Profile/Wide/Empty": [0, 3990], "Profile/Compact/Empty": [1400, 3990],
  };
  for (const context of CONTEXTS) for (const layout of LAYOUTS) for (const state of STATES) {
    const component = requiredVariant(set, `Context=${context}, Layout=${layout}, State=${state}`);
    const [x, y] = positions[`${context}/${layout}/${state}`];
    component.x = x;
    component.y = y;
  }
  set.resizeWithoutConstraints(1720, 4900);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page);
  await reviewInstance(requiredVariant(set, "Context=Project, Layout=Wide, State=Normal"), "Project", "EN", "Normal", page, 190, 5480);
  await reviewInstance(requiredVariant(set, "Context=Profile, Layout=Compact, State=Normal"), "Profile", "EN", "Normal", page, 1590, 5480);
  page.appendChild(notesFrame());
  syncApprovedBand(bandSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-209 créé · 8 variantes et références FR/EN à revoir");
}
main().catch((error) => {
  figma.notify(`Erreur Stack List Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
