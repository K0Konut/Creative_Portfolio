const USAGES = [
  { name: "Preview", label: "APERÇU DE PROJET", width: 480, height: 300, x: 24 },
  { name: "Carousel", label: "MÉDIA DE CARROUSEL", width: 620, height: 350, x: 568 },
  { name: "Thumbnail", label: "MINIATURE", width: 240, height: 150, x: 1252 },
];
const STATES = ["Loading", "Loaded", "Error"];
const ROWS = { Loading: 80, Loaded: 490, Error: 900 };
const COLORS = {
  canvas: "#F5F1E8", ink: "#101113", muted: "#474747", cream: "#F5F1E8",
  violet: "#4B3CFF", pink: "#FF6BD6", error: "#FDE7E2", errorInk: "#8A1C12",
};
const STATUS_DESCRIPTION = "COMP-003 · 10 variantes Kind × Size validées visuellement par Costa le 2026-09-21. Title et Body éditables par type, sans propagation entre types ; Show title facultatif. Exemples localisables, sans action fictive.";
const MEDIA_DESCRIPTION = "COMP-004 · 9 variantes Usage × State, structure et états validés par Costa le 2026-09-21. Les visuels sont des mocks de revue ; ratios, recadrages, points focaux et alternatives définitifs restent à décider sur les médias réels.";

let collections = [];
let variables = [];
let textStyles = new Map();
let labelFont = { family: "Manrope", style: "Bold" };
let bodyFont = { family: "Manrope", style: "Regular" };

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

function plainText(value, size, hex, bold = false) {
  const node = figma.createText();
  node.fontName = bold ? labelFont : bodyFont;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 125 };
  node.fills = [solid(hex)];
  node.textAutoResize = "HEIGHT";
  return node;
}

async function styledText(value, styleName, colorName, fallback) {
  const style = textStyles.get(styleName);
  const node = figma.createText();
  node.fontName = style.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(style.id);
  node.fills = [boundColor(colorName, fallback)];
  node.textAutoResize = "HEIGHT";
  return node;
}

function rectangle(parent, name, x, y, width, height, colorName, fallback) {
  const node = figma.createRectangle();
  node.name = name;
  node.resize(width, height);
  parent.appendChild(node);
  node.x = x;
  node.y = y;
  node.fills = [boundColor(colorName, fallback)];
  node.strokes = [];
  node.cornerRadius = 0;
  return node;
}

async function textAt(parent, name, value, styleName, colorName, fallback, x, y, maxWidth) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = name;
  parent.appendChild(node);
  node.x = x;
  node.y = y;
  node.resize(maxWidth, node.height);
  return node;
}

async function loadingState(component, usage) {
  const small = usage.name === "Thumbnail";
  const inset = small ? 18 : 32;
  const barWidth = Math.min(usage.width - inset * 2, small ? 118 : 240);
  rectangle(component, "Static loading bar", inset, usage.height / 2 - 24, barWidth, 8, "surface/brand", COLORS.violet);
  rectangle(component, "Static loading track", inset, usage.height / 2 - 8, usage.width - inset * 2, 2, "border/inverse", COLORS.cream);
  await textAt(component, "Loading label", small ? "Chargement…" : "Chargement du média…", "Type/Label/SM/Large", "text/on-inverse", COLORS.cream, inset, usage.height / 2 + 12, usage.width - inset * 2);
}

async function loadedState(component, usage) {
  const small = usage.name === "Thumbnail";
  const inset = small ? 10 : 16;
  const width = usage.width - inset * 2;
  const height = usage.height - inset * 2;
  const asset = figma.createFrame();
  asset.name = "Review asset · replace whole frame with approved media";
  component.appendChild(asset);
  asset.resize(width, height);
  asset.x = inset;
  asset.y = inset;
  asset.fills = [boundColor("surface/brand", COLORS.violet)];
  asset.clipsContent = true;
  asset.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
  rectangle(asset, "Review graphic · paper", width * 0.13, height * 0.16, width * 0.64, height * 0.56, "surface/paper", COLORS.cream);
  rectangle(asset, "Review graphic · editorial", width * 0.61, height * 0.27, width * 0.2, height * 0.41, "surface/editorial", COLORS.pink);
  rectangle(asset, "Review graphic · dark mark", width * 0.19, height * 0.28, width * 0.26, Math.max(4, height * 0.04), "surface/inverse", COLORS.ink);
  rectangle(asset, "Review graphic · dark rule", width * 0.19, height * 0.39, width * 0.34, Math.max(4, height * 0.04), "surface/inverse", COLORS.ink);
  rectangle(asset, "Review watermark ground", 0, height - (small ? 30 : 42), width, small ? 30 : 42, "surface/inverse", COLORS.ink);
  await textAt(asset, "Review watermark", small ? "MOCK · REVUE" : "MOCK · VISUEL DE REVUE", "Type/Label/SM/Large", "text/on-inverse", COLORS.cream, 12, height - (small ? 25 : 34), width - 24);
}

async function errorState(component, usage) {
  const small = usage.name === "Thumbnail";
  const inset = small ? 12 : 24;
  rectangle(component, "Error surface", inset, inset, usage.width - inset * 2, usage.height - inset * 2, "surface/error", COLORS.error);
  rectangle(component, "Error marker", inset + 16, inset + 20, 4, small ? 24 : 36, "text/error", COLORS.errorInk);
  await textAt(component, "Error title", "Média indisponible", small ? "Type/Label/SM/Large" : "Type/Heading/MD/Large", "text/error", COLORS.errorInk, inset + 32, inset + (small ? 22 : 30), usage.width - inset * 2 - 48);
  if (!small) {
    await textAt(component, "Error explanation", "Le contenu textuel reste accessible.", "Type/Body/MD/Large", "text/primary", COLORS.ink, inset + 32, inset + 90, usage.width - inset * 2 - 48);
  }
}

async function createVariant(usage, state, parent) {
  const component = figma.createComponent();
  component.name = `Usage=${usage.name}, State=${state}`;
  parent.appendChild(component);
  component.resize(usage.width, usage.height);
  component.fills = [boundColor("surface/inverse", COLORS.ink)];
  component.strokes = [boundColor("border/strong", COLORS.ink)];
  component.strokeWeight = 1;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/control"));
  component.strokeAlign = "INSIDE";
  component.cornerRadius = 0;
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/none"));
  component.clipsContent = true;
  if (state === "Loading") await loadingState(component, usage);
  if (state === "Loaded") await loadedState(component, usage);
  if (state === "Error") await errorState(component, usage);
  component.description = `COMP-004 · ${usage.name}/${state}. Dimensions d'exemple non contractuelles ; ratio et recadrage à décider sur les médias réels. Média non interactif ; texte alternatif et légende définis dans l'écran.`;
  return component;
}

function frameWithLines(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(1800, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, hex, x, textY, bold] of lines) {
    const node = plainText(value, size, hex, bold);
    frame.appendChild(node);
    node.x = x;
    node.y = textY;
  }
  return frame;
}

function documentationFrame() {
  const frame = frameWithLines("_Generated/Media Frame · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-004 · DESIGN SYSTEM", 14, COLORS.violet, 48, 36, true],
    ["Cadre média", 42, COLORS.ink, 48, 68, true],
    ["Un emplacement stable pour l'image, son chargement et son repli. Ratios et recadrages à décider sur les vrais médias.", 18, COLORS.muted, 48, 136, false],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Media Frame · Usage notes", 1900, 360, "#E8E1D4", [
    ["USAGE · Aperçu, carrousel et miniature ; aucune destination ni commande dans le cadre.", 16, COLORS.ink, 40, 25, true],
    ["DIMENSIONS · Exemples de revue uniquement. Aucun ratio, point focal ni recadrage final validé avant les médias.", 16, COLORS.ink, 40, 76, false],
    ["LOADED · Graphisme de démonstration marqué MOCK. Remplacer par un média approuvé ; garder les couleurs des captures produit.", 16, COLORS.ink, 40, 127, false],
    ["ERROR · Repli lisible ; composer COMP-003 dans l'écran si une image informative échoue sans remplacement.", 16, COLORS.ink, 40, 178, false],
    ["ACCESSIBILITÉ · Alternative selon l'intention, image décorative ignorée, légende associée dans le contexte.", 16, COLORS.ink, 40, 229, false],
    ["RESPONSIVE & MOTION · Préserver le contenu au chargement ; aucun débordement, aucune animation imposée par le cadre.", 16, COLORS.ink, 40, 280, false],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Media Frame · Preview surface";
  board.resize(1800, 1510);
  board.x = 0;
  board.y = 270;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const usage of USAGES) {
    const label = plainText(usage.label, 15, COLORS.violet, true);
    label.name = `_Generated/Media Frame · Column ${usage.name}`;
    label.x = 150 + usage.x;
    label.y = 455;
    page.appendChild(label);
  }
  for (const state of STATES) {
    const label = plainText(state.toUpperCase(), 15, COLORS.ink, true);
    label.x = 28;
    label.y = 420 + ROWS[state] + 28;
    page.appendChild(label);
  }
}

function repairReviewLayout(page) {
  const notes = page.children.find((entry) => entry.name === "_Generated/Media Frame · Usage notes");
  const labels = USAGES.map((usage) => ({
    usage,
    node: page.children.find((entry) => entry.type === "TEXT" &&
      (entry.name === `_Generated/Media Frame · Column ${usage.name}` || entry.characters === usage.label)),
  }));
  if (!notes || labels.some((entry) => !entry.node)) {
    throw new Error("Repères de la planche incomplets : arrêt sans déplacement");
  }
  notes.y = 1900;
  for (const { usage, node } of labels) {
    node.name = `_Generated/Media Frame · Column ${usage.name}`;
    node.y = 455;
  }
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const [collection, name] of [
    ["Primitives/Shape", "stroke/control"], ["Primitives/Shape", "radius/none"],
    ["Semantic/Color", "surface/inverse"], ["Semantic/Color", "surface/brand"],
    ["Semantic/Color", "surface/paper"], ["Semantic/Color", "surface/editorial"],
    ["Semantic/Color", "surface/error"], ["Semantic/Color", "border/strong"],
    ["Semantic/Color", "border/inverse"], ["Semantic/Color", "text/on-inverse"],
    ["Semantic/Color", "text/error"], ["Semantic/Color", "text/primary"],
  ]) variable(collection, name);
  const localStyles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Label/SM/Large", "Type/Label/MD/Large", "Type/Heading/MD/Large", "Type/Body/MD/Large"]) {
    const style = localStyles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
  }
  const fonts = new Map([...textStyles.values()].map((style) => [`${style.fontName.family}/${style.fontName.style}`, style.fontName]));
  for (const name of fonts.values()) await figma.loadFontAsync(name);
  labelFont = textStyles.get("Type/Label/SM/Large").fontName;
  bodyFont = textStyles.get("Type/Body/MD/Large").fontName;
}

function syncApprovedStatus(statusSet) {
  statusSet.description = STATUS_DESCRIPTION;
  const indexPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = indexPage && indexPage.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-003 · Message d'état");
  if (!card) return;
  const texts = card.children.filter((entry) => entry.type === "TEXT");
  if (texts.length >= 3) texts[1].characters = "VALIDÉ · 10 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 1264));
  let card = index.children.find((entry) => entry.name === "Index · COMP-004 · Cadre média");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-004 · Cadre média";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 1042;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, hex, x, y] of [
    ["COMP-004 · Cadre média", 28, COLORS.ink, 28, 20],
    ["VALIDÉ · 9 VARIANTES", 14, COLORS.violet, 28, 65],
    ["Trois usages × trois états ; ratios d'exemple en attente des médias.", 16, COLORS.muted, 28, 105],
    ["02.5 — Media Frame", 16, COLORS.violet, 940, 65],
  ]) {
    const node = plainText(value, size, hex);
    card.appendChild(node);
    node.x = x;
    node.y = y;
  }
}

async function main() {
  figma.notify("Préparation de COMP-004 Cadre média…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const statusPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message");
  const statusSet = statusPage && statusPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message");
  if (!statusSet || statusSet.children.length !== 10) throw new Error("COMP-003 Message d'état validé absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.5 — Media Frame");
  if (!page) {
    page = figma.createPage();
    page.name = "02.5 — Media Frame";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Media frame");
  if (existing) {
    const actual = existing.children.map((entry) => entry.name);
    const expected = STATES.flatMap((state) => USAGES.map((usage) => `Usage=${usage.name}, State=${state}`));
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Media frame incomplet ou altéré (${actual.length}/9) : arrêt sans remplacement`);
    }
    repairReviewLayout(page);
    existing.description = MEDIA_DESCRIPTION;
    syncApprovedStatus(statusSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-004 conservé · repères de planche corrigés");
    return;
  }

  const stale = page.children.find((entry) => entry.name === "_Generated/Media Frame Draft");
  if (stale) stale.remove();
  const staging = figma.createFrame();
  staging.name = "_Generated/Media Frame Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const state of STATES) {
    for (const usage of USAGES) components.push(await createVariant(usage, state, staging));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Media frame";
  set.description = MEDIA_DESCRIPTION;
  set.x = 150;
  set.y = 420;
  components.forEach((component, index) => {
    const usage = USAGES[index % USAGES.length];
    const state = STATES[Math.floor(index / USAGES.length)];
    component.x = usage.x;
    component.y = ROWS[state];
  });
  set.resizeWithoutConstraints(1600, 1330);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedStatus(statusSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-004 créé · 9 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Media Frame Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
