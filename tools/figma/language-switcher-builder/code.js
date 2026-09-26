const LOCALES = ["FR", "EN"];
const STATES = ["Default", "Hover", "Focus", "Pressed"];
const COLUMNS = { Default: 60, Hover: 430, Focus: 800, Pressed: 1170 };
const ROWS = { FR: 95, EN: 320 };
const COLORS = {
  canvas: "#F5F1E8", paper: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113",
  muted: "#474747", violet: "#4B3CFF", white: "#F5F1E8", border: "#827E76",
};
const MEDIA_DESCRIPTION = "COMP-004 · 9 variantes Usage × State, structure et états validés par Costa le 2026-09-21. Les visuels sont des mocks de revue ; ratios, recadrages, points focaux et alternatives définitifs restent à décider sur les médias réels.";

let collections = [];
let variables = [];
let textStyle;
let font = { family: "Manrope", style: "Bold" };

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

function plainText(value, size, hex) {
  const node = figma.createText();
  node.fontName = font;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 120 };
  node.fills = [solid(hex)];
  node.textAutoResize = "HEIGHT";
  return node;
}

async function label(value, colorName, fallback) {
  const node = figma.createText();
  node.fontName = textStyle.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(textStyle.id);
  node.fills = [boundColor(colorName, fallback)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function outline(node, colorName, fallback, token, weight) {
  node.strokes = [boundColor(colorName, fallback)];
  node.strokeWeight = weight;
  node.setBoundVariable("strokeWeight", variable("Primitives/Shape", token));
  node.strokeAlign = "INSIDE";
}

function focusRing(component, x) {
  const ring = figma.createRectangle();
  ring.name = "Focus outer ring";
  component.appendChild(ring);
  ring.resize(112, 56);
  ring.x = x - 4;
  ring.y = 0;
  ring.fills = [];
  ring.cornerRadius = 12;
  outline(ring, "focus/outer", COLORS.ink, "stroke/focus-outer", 2);
}

async function option(component, value, x, current, state) {
  if (!current && state === "Focus") focusRing(component, x);
  const control = figma.createFrame();
  control.name = `${value} · ${current ? "Current" : state}`;
  component.appendChild(control);
  control.resize(104, 48);
  control.x = x;
  control.y = 4;
  control.layoutMode = "HORIZONTAL";
  control.primaryAxisSizingMode = "FIXED";
  control.counterAxisSizingMode = "FIXED";
  control.primaryAxisAlignItems = "CENTER";
  control.counterAxisAlignItems = "CENTER";
  control.clipsContent = false;
  control.cornerRadius = 8;
  control.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/control"));
  let textColor = ["text/primary", COLORS.ink];
  if (current) {
    control.fills = [boundColor("surface/paper", COLORS.paper)];
    outline(control, "border/strong", COLORS.ink, "stroke/emphasis", 2);
  } else if (state === "Hover") {
    control.fills = [boundColor("surface/subtle", COLORS.subtle)];
    outline(control, "border/strong", COLORS.ink, "stroke/control", 1);
  } else if (state === "Focus") {
    control.fills = [boundColor("surface/paper", COLORS.paper)];
    outline(control, "focus/inner", COLORS.white, "stroke/focus-inner", 2);
  } else if (state === "Pressed") {
    control.fills = [boundColor("surface/brand", COLORS.violet)];
    outline(control, "border/strong", COLORS.ink, "stroke/control", 1);
    textColor = ["text/on-brand", COLORS.white];
  } else {
    control.fills = [];
    outline(control, "border/default", COLORS.border, "stroke/control", 1);
  }
  const text = await label(value, textColor[0], textColor[1]);
  text.name = `${value} label`;
  control.appendChild(text);
  if (current) {
    const underline = figma.createRectangle();
    underline.name = "Current underline";
    control.appendChild(underline);
    underline.layoutPositioning = "ABSOLUTE";
    underline.resize(48, 2);
    underline.x = 28;
    underline.y = 40;
    underline.fills = [boundColor("text/primary", COLORS.ink)];
    underline.strokes = [];
  }
}

async function createVariant(locale, state, parent) {
  const component = figma.createComponent();
  component.name = `Locale=${locale}, State=${state}`;
  parent.appendChild(component);
  component.resize(228, 56);
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;
  await option(component, "FR", 4, locale === "FR", state);
  await option(component, "EN", 120, locale === "EN", state);
  component.description = `COMP-104 · ${locale} courant, ${state} sur l'autre langue. Cibles 104 × 48 px, mêmes options dans l'en-tête et le panneau mobile ; la sémantique et la destination restent à implémenter.`;
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
  const frame = frameWithLines("_Generated/Language Switcher · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-104 · LAYOUT GLOBAL", 14, COLORS.violet, 48, 36],
    ["Sélecteur de langue", 42, COLORS.ink, 48, 68],
    ["Deux langues visibles, une destination logique conservée. Le contrôle se déplace entre en-tête et panneau mobile.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Language Switcher · Usage notes", 1100, 340, COLORS.subtle, [
    ["USAGE · FR et EN toujours visibles ; même composant en en-tête large et panneau compact, sans doublon actif.", 16, COLORS.ink, 40, 25],
    ["CURRENT · Contour et soulignement rendent la langue courante perceptible sans dépendre de la couleur.", 16, COLORS.ink, 40, 74],
    ["ACCESSIBILITÉ · Noms complets « Français » et « English » ; langue courante annoncée, focus bicolore non coupé.", 16, COLORS.ink, 40, 123],
    ["NAVIGATION · Conserver la destination exacte, l'URL, les contenus, métadonnées et le CV dans la langue choisie.", 16, COLORS.ink, 40, 172],
    ["MANQUANT · Ne pas mélanger les langues ; expliquer un équivalent réellement absent et proposer une issue valide.", 16, COLORS.ink, 40, 221],
    ["MOTION · Retour de couleur/bordure 120 ms ; état direct avec prefers-reduced-motion, sans déplacement de la cible.", 16, COLORS.ink, 40, 270],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Language Switcher · Preview surface";
  board.resize(1800, 760);
  board.x = 0;
  board.y = 270;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const state of STATES) {
    const node = plainText(state.toUpperCase(), 15, COLORS.violet);
    node.x = 150 + COLUMNS[state];
    node.y = 440;
    page.appendChild(node);
  }
  for (const locale of LOCALES) {
    const node = plainText(`${locale} COURANT`, 15, COLORS.ink);
    node.x = 24;
    node.y = 390 + ROWS[locale] + 18;
    page.appendChild(node);
  }
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const [collection, name] of [
    ["Primitives/Shape", "radius/control"], ["Primitives/Shape", "stroke/control"],
    ["Primitives/Shape", "stroke/emphasis"], ["Primitives/Shape", "stroke/focus-inner"],
    ["Primitives/Shape", "stroke/focus-outer"], ["Semantic/Color", "surface/paper"],
    ["Semantic/Color", "surface/subtle"], ["Semantic/Color", "surface/brand"],
    ["Semantic/Color", "text/primary"], ["Semantic/Color", "text/on-brand"],
    ["Semantic/Color", "border/default"], ["Semantic/Color", "border/strong"],
    ["Semantic/Color", "focus/inner"], ["Semantic/Color", "focus/outer"],
  ]) variable(collection, name);
  const styles = await figma.getLocalTextStylesAsync();
  textStyle = styles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!textStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(textStyle.fontName);
  font = textStyle.fontName;
}

function syncApprovedMedia(mediaSet) {
  mediaSet.description = MEDIA_DESCRIPTION;
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-004 · Cadre média");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "VALIDÉ · 9 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 1468));
  let card = index.children.find((entry) => entry.name === "Index · COMP-104 · Sélecteur de langue");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-104 · Sélecteur de langue";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 1246;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-104 · Sélecteur de langue", 28, COLORS.ink, 28, 20],
    ["À VALIDER · 8 VARIANTES", 14, COLORS.violet, 28, 65],
    ["FR/EN · langue courante, survol, focus et pression ; cible 48 px.", 16, COLORS.muted, 28, 105],
    ["02.6 — Language Switcher", 16, COLORS.violet, 940, 65],
  ]) {
    const node = plainText(value, size, color);
    card.appendChild(node);
    node.x = x;
    node.y = y;
  }
}

async function main() {
  figma.notify("Préparation de COMP-104 Sélecteur de langue…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const mediaPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.5 — Media Frame");
  const mediaSet = mediaPage && mediaPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Media frame");
  if (!mediaSet || mediaSet.children.length !== 9) throw new Error("COMP-004 Cadre média validé absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.6 — Language Switcher");
  if (!page) {
    page = figma.createPage();
    page.name = "02.6 — Language Switcher";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Language switcher");
  if (existing) {
    const actual = existing.children.map((entry) => entry.name);
    const expected = LOCALES.flatMap((locale) => STATES.map((state) => `Locale=${locale}, State=${state}`));
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Language switcher incomplet ou altéré (${actual.length}/8) : arrêt sans remplacement`);
    }
    syncApprovedMedia(mediaSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-104 déjà présent · 8 variantes préservées");
    return;
  }

  const stale = page.children.find((entry) => entry.name === "_Generated/Language Switcher Draft");
  if (stale) stale.remove();
  const staging = figma.createFrame();
  staging.name = "_Generated/Language Switcher Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const locale of LOCALES) {
    for (const state of STATES) components.push(await createVariant(locale, state, staging));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Language switcher";
  set.description = "COMP-104 · À valider. Locale FR/EN × State Default/Hover/Focus/Pressed. Même contrôle de 48 px en en-tête et panneau mobile ; langue courante indiquée par contour et soulignement. Noms complets et routes équivalentes à implémenter.";
  set.x = 150;
  set.y = 390;
  components.forEach((component, index) => {
    const locale = LOCALES[Math.floor(index / STATES.length)];
    const state = STATES[index % STATES.length];
    component.x = COLUMNS[state];
    component.y = ROWS[locale];
  });
  set.resizeWithoutConstraints(1520, 520);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedMedia(mediaSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-104 créé · 8 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Language Switcher Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
