const LAYOUTS = ["Wide", "Compact"];
const ROWS = { Wide: 80, Compact: 540 };
const COLORS = { canvas: "#F5F1E8", brand: "#4B3CFF", ink: "#101113", paper: "#F5F1E8", muted: "#474747", subtle: "#E8E1D4" };
const APPROVED_HEADER_DESCRIPTION = "COMP-101 · 4 variantes Configuration validées par Costa le 2026-09-21. 1440/1024 px en large, 320 px mobile fermé/ouvert. Commandes mobiles espacées de 7 px du trait inférieur. Signature vers l'accueil ; routes, lien d'évitement et focus à implémenter.";

let collections = [];
let variables = [];
let font = { family: "Manrope", style: "Bold" };
const logoFont = { family: "League Gothic", style: "Regular" };

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
  const result = variables.find((entry) => entry.variableCollectionId === collection.id && entry.name === name);
  if (!result) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return result;
}

function boundColor(name, fallback) {
  return figma.variables.setBoundVariableForPaint(solid(fallback), "color", variable("Semantic/Color", name));
}

function textNode(value, size, colorName, fallback, typeface = font) {
  const node = figma.createText();
  node.fontName = typeface;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 120 };
  node.fills = [boundColor(colorName, fallback)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function plainText(value, size, hex) {
  const node = figma.createText();
  node.fontName = font;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 120 };
  node.fills = [solid(hex)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function addText(parent, name, value, x, y, size, colorName = "text/on-brand", fallback = COLORS.paper, typeface = font) {
  const node = textNode(value, size, colorName, fallback, typeface);
  node.name = name;
  parent.appendChild(node);
  node.x = x;
  node.y = y;
  return node;
}

function addRule(parent, x, y, width) {
  const rule = figma.createRectangle();
  rule.name = "Footer rule";
  parent.appendChild(rule);
  rule.resize(width, 1);
  rule.x = x;
  rule.y = y;
  rule.fills = [boundColor("border/inverse", COLORS.paper)];
  rule.strokes = [];
}

function createVariant(layout, parent) {
  const compact = layout === "Compact";
  const width = compact ? 320 : 1440;
  const height = compact ? 610 : 370;
  const component = figma.createComponent();
  component.name = `Layout=${layout}`;
  parent.appendChild(component);
  component.resize(width, height);
  component.fills = [boundColor("surface/brand", COLORS.brand)];
  component.strokes = [];
  component.clipsContent = false;

  addText(component, "Identity", "COSTA\nMASKULOV", compact ? 20 : 64, compact ? 24 : 52, compact ? 48 : 68, "text/on-brand", COLORS.paper, logoFont);
  const navX = compact ? 20 : 550;
  const navY = compact ? 150 : 72;
  addText(component, "Navigation heading", "NAVIGATION", navX, navY, 14);
  for (const [index, value] of ["Accueil", "Projets", "À propos"].entries()) {
    const link = addText(component, `Navigation · ${value}`, value, navX, navY + 40 + index * 42, 20);
    link.textDecoration = "UNDERLINE";
  }

  const resourceX = compact ? 20 : 920;
  const resourceY = compact ? 332 : 72;
  addText(component, "Resources heading", "RESSOURCES · À CONFIRMER", resourceX, resourceY, 14);
  for (const [index, value] of ["Email", "LinkedIn", "GitHub", "CV FR / EN"].entries()) {
    addText(component, `Resource placeholder · ${value}`, value, resourceX, resourceY + 40 + index * 38, compact ? 17 : 18);
  }
  addText(component, "Email address placeholder", "Adresse à confirmer", resourceX, resourceY + 202, 14);
  const ruleY = compact ? 574 : 326;
  addRule(component, compact ? 20 : 64, ruleY, compact ? 280 : 1312);
  addText(component, "Footer signature", "COSTA MASKULOV · PORTFOLIO", compact ? 20 : 64, ruleY + 13, compact ? 11 : 12);
  component.description = `COMP-105 · ${layout} · Structure à valider. Navigation de rappel et emplacements des ressources ; adresse, URLs, CV FR/EN et éventuelles mentions finales manquants. Aucun placeholder n'est une destination active.`;
  return component;
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
  const frame = frameWithLines("_Generated/Site Footer · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-105 · LAYOUT GLOBAL", 14, COLORS.brand, 48, 36],
    ["Pied de page", 42, COLORS.ink, 48, 68],
    ["Navigation de rappel et ressources essentielles. Composition structurelle : coordonnées et liens encore à confirmer.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Site Footer · Usage notes", 1750, 410, COLORS.subtle, [
    ["CONTENU · Adresse email, URLs LinkedIn/GitHub, CV FR/EN et mentions finales à recevoir avant validation définitive.", 16, COLORS.ink, 40, 24],
    ["USAGE · Même pied de page sur toutes les destinations ; Accueil, Projets et À propos répètent les routes locales.", 16, COLORS.ink, 40, 78],
    ["RESSOURCES · Les libellés sont des placeholders visuels, pas des liens actifs ; supprimer toute destination réellement absente.", 16, COLORS.ink, 40, 132],
    ["ACCESSIBILITÉ · Repère de pied de page ; adresse email finale visible et sélectionnable ; liens natifs nommés et réels.", 16, COLORS.ink, 40, 186],
    ["RESPONSIVE · Groupes en colonnes à 1440 px, reflow vertical à 320 px sans perte ni débordement horizontal.", 16, COLORS.ink, 40, 240],
    ["EXCLUSIONS · Pas de groupe de contacts riche ni de composant CV détaillé dans le pied de page.", 16, COLORS.ink, 40, 294],
    ["SUITE · Revoir composition et contenu dans les écrans FR/EN ; ne pas publier de lien sans destination.", 16, COLORS.ink, 40, 348],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Site Footer · Preview surface";
  board.resize(1800, 1380);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const layout of LAYOUTS) {
    const node = plainText(layout === "Wide" ? "LARGE · 1440 PX" : "COMPACT · 320 PX", 15, COLORS.brand);
    node.name = `Label · ${layout}`;
    node.x = 28;
    node.y = 416 + ROWS[layout];
    page.appendChild(node);
  }
}

function syncApprovedHeader(headerSet) {
  headerSet.description = APPROVED_HEADER_DESCRIPTION;
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-101 · En-tête du site");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "VALIDÉ · 4 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 2284));
  let card = index.children.find((entry) => entry.name === "Index · COMP-105 · Pied de page");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-105 · Pied de page";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 2062;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-105 · Pied de page", 28, COLORS.ink, 28, 20],
    ["STRUCTURE À VALIDER · 2 VARIANTES", 14, COLORS.brand, 28, 65],
    ["Navigation de rappel · ressources non liées en attente des contenus réels.", 16, COLORS.muted, 28, 105],
    ["02.10 — Site Footer", 16, COLORS.brand, 1010, 65],
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
  for (const name of ["surface/brand", "text/on-brand", "border/inverse"]) variable("Semantic/Color", name);
  const styles = await figma.getLocalTextStylesAsync();
  const labelStyle = styles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(labelStyle.fontName);
  await figma.loadFontAsync(logoFont);
  font = labelStyle.fontName;
}

async function main() {
  figma.notify("Préparation de COMP-105 Pied de page…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const headerPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.9 — Site Header");
  const headerSet = headerPage && headerPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Site header");
  if (!headerSet || headerSet.children.length !== 4) throw new Error("COMP-101 En-tête validé absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.10 — Site Footer");
  if (!page) {
    page = figma.createPage();
    page.name = "02.10 — Site Footer";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Site footer");
  if (existing) {
    const expected = LAYOUTS.map((layout) => `Layout=${layout}`);
    const actual = existing.children.map((entry) => entry.name);
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Site footer incomplet ou altéré (${actual.length}/2) : arrêt sans remplacement`);
    }
    syncApprovedHeader(headerSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-105 déjà présent · 2 variantes préservées");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Site Footer Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = LAYOUTS.map((layout) => createVariant(layout, staging));
  const set = figma.combineAsVariants(components, page);
  set.name = "Site footer";
  set.description = "COMP-105 · Structure à valider. Layout Wide/Compact. Adresse, URLs des profils et CV localisé absents ; placeholders non interactifs et à remplacer avant validation finale.";
  set.x = 160;
  set.y = 400;
  components.forEach((component, index) => {
    component.x = 0;
    component.y = ROWS[LAYOUTS[index]];
  });
  set.resizeWithoutConstraints(1480, 1200);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedHeader(headerSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-105 créé · structure à revoir, contenu à confirmer");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Site Footer Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
