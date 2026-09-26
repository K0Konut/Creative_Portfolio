const CONFIGURATIONS = ["Wide1440", "Large1024", "CompactClosed", "CompactOpen"];
const ROWS = { Wide1440: 90, Large1024: 270, CompactClosed: 470, CompactOpen: 680 };
const COLORS = { canvas: "#F5F1E8", ink: "#101113", muted: "#474747", violet: "#4B3CFF", border: "#827E76", subtle: "#E8E1D4" };
const APPROVED_PANEL_DESCRIPTION = "COMP-103 · 8 variantes Panel × Trigger validées par Costa le 2026-09-21. Panneau compact de 280 px avec instances COMP-001, COMP-102 verticale et COMP-104. Commande nommée, aria-expanded, Escape et retour du focus à implémenter.";

let font = { family: "Manrope", style: "Bold" };
const logoFont = { family: "League Gothic", style: "Regular" };
let collections = [];
let variables = [];

function rgb(hex) {
  const value = hex.slice(1);
  return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
}

function solid(hex) {
  return { type: "SOLID", color: rgb(hex) };
}

function variable(collectionName, name) {
  const collection = collections.find((entry) => entry.name === collectionName);
  if (!collection) throw new Error(`Collection absente : ${collectionName}`);
  const token = variables.find((entry) => entry.variableCollectionId === collection.id && entry.name === name);
  if (!token) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return token;
}

function boundColor(name, fallback) {
  return figma.variables.setBoundVariableForPaint(solid(fallback), "color", variable("Semantic/Color", name));
}

function plainText(value, size, hex, customFont = font) {
  const node = figma.createText();
  node.fontName = customFont;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 100 };
  node.fills = [solid(hex)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function frameWithLines(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(1800, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    const node = plainText(value, size, color);
    frame.appendChild(node);
    node.x = x;
    node.y = textY;
  }
  return frame;
}

function documentationFrame() {
  const frame = frameWithLines("_Generated/Site Header · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-101 · LAYOUT GLOBAL", 14, COLORS.violet, 48, 36],
    ["En-tête du site", 42, COLORS.ink, 48, 68],
    ["Identité et destinations globales : accès direct en large, panneau contrôlé sur écran compact.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Site Header · Usage notes", 1640, 460, COLORS.subtle, [
    ["USAGE · Même en-tête sur toutes les pages ; la signature renvoie à l'accueil dans la langue active.", 16, COLORS.ink, 40, 24],
    ["LARGE · Dès 1024 px : navigation COMP-102 horizontale et sélecteur COMP-104 visibles, sans panneau actif.", 16, COLORS.ink, 40, 82],
    ["COMPACT · Sous 1024 px : signature et COMP-103 ; navigation et langues uniquement dans le panneau ouvert.", 16, COLORS.ink, 40, 140],
    ["TAILLES · 72 px en large ; 64 px en compact. Revoir les contenus FR/EN et le zoom dans les écrans réels.", 16, COLORS.ink, 40, 198],
    ["ACCESSIBILITÉ · Repère d'en-tête, lien d'accueil nommé, lien d'évitement et ordre de focus cohérent à implémenter.", 16, COLORS.ink, 40, 256],
    ["FOCUS · Un éventuel en-tête sticky ne masque jamais l'élément focalisé ; défilement et offset à définir dans les écrans.", 16, COLORS.ink, 40, 314],
    ["EXCLUSIONS · Ni CV ni contacts prioritaires ; aucun état au défilement ajouté sans besoin constaté.", 16, COLORS.ink, 40, 372],
  ]);
}

function findVariant(set, name) {
  const node = set.children.find((entry) => entry.type === "COMPONENT" && entry.name === name);
  if (!node) throw new Error(`Variante absente : ${set.name} / ${name}`);
  return node;
}

function addSignature(component, compact) {
  const signature = figma.createFrame();
  signature.name = "Home link · Costa Maskulov";
  component.appendChild(signature);
  signature.resize(compact ? 128 : 180, compact ? 56 : 64);
  signature.x = compact ? 20 : 48;
  signature.y = compact ? 4 : 4;
  signature.fills = [];
  signature.strokes = [];
  signature.clipsContent = false;
  const text = plainText("COSTA\nMASKULOV", compact ? 25 : 28, COLORS.ink, logoFont);
  text.name = "Costa Maskulov";
  text.fills = [boundColor("text/primary", COLORS.ink)];
  signature.appendChild(text);
  text.x = 0;
  text.y = compact ? 5 : 5;
}

function addBottomRule(component, width, height) {
  const rule = figma.createRectangle();
  rule.name = "Header baseline";
  component.appendChild(rule);
  rule.resize(width, 1);
  rule.x = 0;
  rule.y = height - 1;
  rule.fills = [boundColor("border/default", COLORS.border)];
  rule.strokes = [];
}

function createVariant(configuration, parent, navSet, languageSet, panelSet) {
  const compact = configuration.startsWith("Compact");
  const width = compact ? 320 : configuration === "Large1024" ? 1024 : 1440;
  const height = compact ? 64 : 72;
  const component = figma.createComponent();
  component.name = `Configuration=${configuration}`;
  parent.appendChild(component);
  component.resize(width, height);
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
  component.strokes = [];
  component.clipsContent = false;
  addSignature(component, compact);
  addBottomRule(component, width, height);
  if (compact) {
    const panelName = configuration === "CompactOpen" ? "Panel=Open, Trigger=Default" : "Panel=Closed, Trigger=Default";
    const panel = findVariant(panelSet, panelName).createInstance();
    panel.name = "COMP-103 · Mobile navigation panel";
    component.appendChild(panel);
    panel.x = 20;
    panel.y = 0;
  } else {
    const navigation = findVariant(navSet, "Layout=Horizontal, Current=Home, State=Default").createInstance();
    navigation.name = "COMP-102 · Main navigation";
    component.appendChild(navigation);
    navigation.x = width - 644;
    navigation.y = 8;
    const language = findVariant(languageSet, "Locale=FR, State=Default").createInstance();
    language.name = "COMP-104 · Language switcher";
    component.appendChild(language);
    language.x = width - 276;
    language.y = 8;
  }
  component.description = `COMP-101 · ${configuration}. Signature vers l'accueil ; ${compact ? "COMP-103 mobile" : "COMP-102 et COMP-104 visibles"}. Lien d'évitement, routes FR/EN et focus à implémenter.`;
  return component;
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Site Header · Preview surface";
  board.resize(1800, 1270);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const configuration of CONFIGURATIONS) {
    const node = plainText(configuration.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase(), 15, COLORS.violet);
    node.name = `Label · ${configuration}`;
    node.x = 30;
    node.y = 430 + ROWS[configuration];
    page.appendChild(node);
  }
}

function syncApprovedPanel(panelSet) {
  panelSet.description = APPROVED_PANEL_DESCRIPTION;
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-103 · Panneau mobile");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "VALIDÉ · 8 VARIANTES";
}

function repairCompactSpacing(set) {
  for (const configuration of ["CompactClosed", "CompactOpen"]) {
    const variant = findVariant(set, `Configuration=${configuration}`);
    const panel = variant.children.find((entry) => entry.type === "INSTANCE" && entry.name === "COMP-103 · Mobile navigation panel");
    if (!panel) throw new Error(`Instance COMP-103 absente dans ${configuration} : arrêt sans modification`);
    panel.y = 0;
  }
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 2080));
  let card = index.children.find((entry) => entry.name === "Index · COMP-101 · En-tête du site");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-101 · En-tête du site";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 1858;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-101 · En-tête du site", 28, COLORS.ink, 28, 20],
    ["À VALIDER · 4 VARIANTES", 14, COLORS.violet, 28, 65],
    ["1440/1024 px en large · 320 px compact, panneau fermé/ouvert.", 16, COLORS.muted, 28, 105],
    ["02.9 — Site Header", 16, COLORS.violet, 1010, 65],
  ]) {
    const node = plainText(value, size, color);
    card.appendChild(node);
    node.x = x;
    node.y = y;
  }
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "border/default"]) variable("Semantic/Color", name);
  const styles = await figma.getLocalTextStylesAsync();
  const labelStyle = styles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(labelStyle.fontName);
  await figma.loadFontAsync(logoFont);
  font = labelStyle.fontName;
}

async function main() {
  figma.notify("Préparation de COMP-101 En-tête du site…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const findSet = (pageName, setName) => {
    const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === pageName);
    return page && page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === setName);
  };
  const navSet = findSet("02.7 — Main Navigation", "Main navigation");
  const languageSet = findSet("02.6 — Language Switcher", "Language switcher");
  const panelSet = findSet("02.8 — Mobile Navigation Panel", "Mobile navigation panel");
  if (!navSet || navSet.children.length !== 24) throw new Error("COMP-102 Navigation principale absent ou incomplet");
  if (!languageSet || languageSet.children.length !== 8) throw new Error("COMP-104 Sélecteur de langue absent ou incomplet");
  if (!panelSet || panelSet.children.length !== 8) throw new Error("COMP-103 Panneau mobile absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.9 — Site Header");
  if (!page) {
    page = figma.createPage();
    page.name = "02.9 — Site Header";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Site header");
  if (existing) {
    const expected = CONFIGURATIONS.map((configuration) => `Configuration=${configuration}`);
    const actual = existing.children.map((entry) => entry.name);
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Site header incomplet ou altéré (${actual.length}/4) : arrêt sans remplacement`);
    }
    repairCompactSpacing(existing);
    syncApprovedPanel(panelSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-101 déjà présent · 4 variantes préservées");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Site Header Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = CONFIGURATIONS.map((configuration) => createVariant(configuration, staging, navSet, languageSet, panelSet));
  const set = figma.combineAsVariants(components, page);
  set.name = "Site header";
  set.description = "COMP-101 · À valider. Configuration Wide1440/Large1024/CompactClosed/CompactOpen. Signature vers l'accueil, navigation et langue imbriquées ; routes et focus à implémenter.";
  set.x = 150;
  set.y = 400;
  components.forEach((component, index) => {
    component.x = 0;
    component.y = ROWS[CONFIGURATIONS[index]];
  });
  set.resizeWithoutConstraints(1480, 1120);
  set.clipsContent = false;
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedPanel(panelSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-101 créé · 4 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Site Header Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
