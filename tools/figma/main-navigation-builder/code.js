const LAYOUTS = ["Horizontal", "Vertical"];
const DESTINATIONS = [
  { id: "Home", fr: "Accueil" },
  { id: "Projects", fr: "Projets" },
  { id: "About", fr: "À propos" },
];
const STATES = ["Default", "Hover", "Focus", "Pressed"];
const COLUMNS = { Default: 0, Hover: 390, Focus: 780, Pressed: 1170 };
const ROWS = { Horizontal: { Home: 70, Projects: 310, About: 550 }, Vertical: { Home: 820, Projects: 1090, About: 1360 } };
const SET_X = 210;
const COLORS = {
  canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747",
  violet: "#4B3CFF", border: "#827E76", paper: "#F5F1E8",
};
const APPROVED_LANGUAGE_DESCRIPTION = "COMP-104 · 8 variantes Locale × State validées par Costa le 2026-09-21. FR et EN visibles ; langue courante signalée par contour et soulignement. Cibles 48 px. Noms accessibles complets et routes équivalentes à implémenter.";

let collections = [];
let variables = [];
let labelStyle;
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
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

async function styledLabel(value, colorName, fallback) {
  const node = figma.createText();
  node.fontName = labelStyle.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(labelStyle.id);
  node.fills = [boundColor(colorName, fallback)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function outline(node, colorName, fallback, token) {
  node.strokes = [boundColor(colorName, fallback)];
  node.strokeWeight = token === "stroke/control" ? 1 : 2;
  node.setBoundVariable("strokeWeight", variable("Primitives/Shape", token));
  node.strokeAlign = "INSIDE";
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
  const frame = frameWithLines("_Generated/Main Navigation · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-102 · LAYOUT GLOBAL", 14, COLORS.violet, 48, 36],
    ["Navigation principale", 42, COLORS.ink, 48, 68],
    ["Trois destinations réelles, une page courante perceptible et deux dispositions selon le contexte.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Main Navigation · Usage notes", 2190, 410, COLORS.subtle, [
    ["USAGE · Accueil, Projets et À propos uniquement ; même navigation en en-tête large et panneau compact, sans doublon actif.", 16, COLORS.ink, 40, 24],
    ["CURRENT · Contour et soulignement sur la seule page courante ; le futur lien natif porte aria-current=page.", 16, COLORS.ink, 40, 78],
    ["ÉTATS · Hover, Focus et Pressed sont montrés sur le premier lien non courant ; les autres liens suivent la même règle.", 16, COLORS.ink, 40, 132],
    ["ACCESSIBILITÉ · Navigation nommée, ordre Accueil → Projets → À propos, cibles de 48 px et focus bicolore non coupé.", 16, COLORS.ink, 40, 186],
    ["LOCALISATION · Propriétés de texte Accueil/Projets/À propos à remplacer par Home/Projects/About en EN ; routes localisées.", 16, COLORS.ink, 40, 240],
    ["RESPONSIVE · À partir de 1024 px : horizontale ; en dessous : verticale dans COMP-103, sans entrée cachée au clavier.", 16, COLORS.ink, 40, 294],
    ["MOTION · Couleur et bordure : 120 ms ; focus immédiat ; état direct avec prefers-reduced-motion.", 16, COLORS.ink, 40, 348],
  ]);
}

function linkPosition(layout, index) {
  return layout === "Horizontal" ? { x: 4 + index * 112, y: 4, width: 104 } : { x: 4, y: 4 + index * 56, width: 328 };
}

async function addLink(component, destination, index, layout, current, state, target) {
  const pos = linkPosition(layout, index);
  const isCurrent = destination.id === current;
  const interactive = destination.id === target;
  if (interactive && state === "Focus") {
    const ring = figma.createRectangle();
    ring.name = `${destination.id} · Focus outer ring`;
    component.appendChild(ring);
    ring.resize(pos.width + 8, 56);
    ring.x = pos.x - 4;
    ring.y = pos.y - 4;
    ring.fills = [];
    ring.cornerRadius = 12;
    outline(ring, "focus/outer", COLORS.ink, "stroke/focus-outer");
  }
  const control = figma.createFrame();
  control.name = `${destination.id} · ${isCurrent ? "Current" : interactive ? state : "Default"}`;
  component.appendChild(control);
  control.resize(pos.width, 48);
  control.x = pos.x;
  control.y = pos.y;
  control.fills = [boundColor("surface/paper", COLORS.paper)];
  control.clipsContent = false;
  control.cornerRadius = 8;
  control.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/control"));
  let textColor = ["text/primary", COLORS.ink];
  if (isCurrent) {
    outline(control, "border/strong", COLORS.ink, "stroke/emphasis");
  } else if (interactive && state === "Hover") {
    control.fills = [boundColor("surface/subtle", COLORS.subtle)];
    outline(control, "border/strong", COLORS.ink, "stroke/control");
  } else if (interactive && state === "Focus") {
    outline(control, "focus/inner", COLORS.paper, "stroke/focus-inner");
  } else if (interactive && state === "Pressed") {
    control.fills = [boundColor("surface/brand", COLORS.violet)];
    outline(control, "border/strong", COLORS.ink, "stroke/control");
    textColor = ["text/on-brand", COLORS.paper];
  } else {
    outline(control, "border/default", COLORS.border, "stroke/control");
  }
  const text = await styledLabel(destination.fr, textColor[0], textColor[1]);
  text.name = `${destination.id} label`;
  control.appendChild(text);
  text.x = layout === "Horizontal" ? Math.round((pos.width - text.width) / 2) : 20;
  text.y = Math.round((48 - text.height) / 2);
  if (isCurrent) {
    const underline = figma.createRectangle();
    underline.name = "Current underline";
    control.appendChild(underline);
    underline.resize(layout === "Horizontal" ? 64 : 88, 2);
    underline.x = layout === "Horizontal" ? 20 : 20;
    underline.y = 41;
    underline.fills = [boundColor("text/primary", COLORS.ink)];
    underline.strokes = [];
  }
  const key = component.addComponentProperty(`Label ${destination.id}`, "TEXT", destination.fr);
  text.componentPropertyReferences = { characters: key };
}

async function createVariant(layout, current, state, parent) {
  const component = figma.createComponent();
  component.name = `Layout=${layout}, Current=${current}, State=${state}`;
  parent.appendChild(component);
  component.resize(344, layout === "Horizontal" ? 56 : 168);
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;
  const target = current === "Home" ? "Projects" : "Home";
  for (let index = 0; index < DESTINATIONS.length; index++) {
    await addLink(component, DESTINATIONS[index], index, layout, current, state, target);
  }
  component.description = `COMP-102 · ${layout} ; page courante ${current} ; ${state} montré sur ${target}. Propriétés de texte localisables ; navigation réelle et aria-current=page à implémenter.`;
  return component;
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Main Navigation · Preview surface";
  board.resize(1800, 1860);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const state of STATES) {
    const node = plainText(state.toUpperCase(), 15, COLORS.violet);
    node.x = SET_X + 12 + COLUMNS[state];
    node.y = 310;
    page.appendChild(node);
  }
  for (const layout of LAYOUTS) {
    const title = plainText(layout === "Horizontal" ? "HORIZONTAL · EN-TÊTE LARGE" : "VERTICAL · PANNEAU COMPACT", 17, COLORS.violet);
    title.x = 38;
    title.y = layout === "Horizontal" ? 440 : 1185;
    page.appendChild(title);
    for (const destination of DESTINATIONS) {
      const row = plainText(`${destination.fr.toUpperCase()} COURANT`, 13, COLORS.ink);
      row.x = 24;
      row.y = 414 + ROWS[layout][destination.id];
      page.appendChild(row);
    }
  }
}

function repairPreviewLayout(page, set) {
  set.x = SET_X;
  for (const child of page.children) {
    if (child.type !== "TEXT") continue;
    const state = STATES.find((entry) => child.characters === entry.toUpperCase());
    if (state && child.y < 400) {
      child.x = SET_X + 12 + COLUMNS[state];
      child.y = 310;
    }
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
  labelStyle = styles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(labelStyle.fontName);
  font = labelStyle.fontName;
}

function syncApprovedLanguage(languageSet) {
  languageSet.description = APPROVED_LANGUAGE_DESCRIPTION;
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-104 · Sélecteur de langue");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "VALIDÉ · 8 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 1672));
  let card = index.children.find((entry) => entry.name === "Index · COMP-102 · Navigation principale");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-102 · Navigation principale";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 1450;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-102 · Navigation principale", 28, COLORS.ink, 28, 20],
    ["À VALIDER · 24 VARIANTES", 14, COLORS.violet, 28, 65],
    ["Horizontale/verticale · 3 pages courantes · 4 états d'interaction.", 16, COLORS.muted, 28, 105],
    ["02.7 — Main Navigation", 16, COLORS.violet, 925, 65],
  ]) {
    const node = plainText(value, size, color);
    card.appendChild(node);
    node.x = x;
    node.y = y;
  }
}

async function main() {
  figma.notify("Préparation de COMP-102 Navigation principale…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const languagePage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.6 — Language Switcher");
  const languageSet = languagePage && languagePage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Language switcher");
  if (!languageSet || languageSet.children.length !== 8) throw new Error("COMP-104 Sélecteur de langue validé absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.7 — Main Navigation");
  if (!page) {
    page = figma.createPage();
    page.name = "02.7 — Main Navigation";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Main navigation");
  if (existing) {
    const expected = LAYOUTS.flatMap((layout) => DESTINATIONS.flatMap((destination) => STATES.map((state) => `Layout=${layout}, Current=${destination.id}, State=${state}`)));
    const actual = existing.children.map((entry) => entry.name);
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Main navigation incomplet ou altéré (${actual.length}/24) : arrêt sans remplacement`);
    }
    repairPreviewLayout(page, existing);
    syncApprovedLanguage(languageSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-102 déjà présent · 24 variantes préservées");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Main Navigation Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const layout of LAYOUTS) {
    for (const destination of DESTINATIONS) {
      for (const state of STATES) {
        components.push(await createVariant(layout, destination.id, state, staging));
      }
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Main navigation";
  set.description = "COMP-102 · À valider. Layout Horizontal/Vertical × Current Home/Projects/About × State Default/Hover/Focus/Pressed. Trois labels TEXT localisables. Navigation nommée et aria-current=page à implémenter.";
  set.x = SET_X;
  set.y = 400;
  components.forEach((component, index) => {
    const layout = LAYOUTS[Math.floor(index / (DESTINATIONS.length * STATES.length))];
    const destination = DESTINATIONS[Math.floor((index % (DESTINATIONS.length * STATES.length)) / STATES.length)];
    const state = STATES[index % STATES.length];
    component.x = COLUMNS[state];
    component.y = ROWS[layout][destination.id];
  });
  set.resizeWithoutConstraints(1540, 1700);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedLanguage(languageSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-102 créé · 24 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Main Navigation Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
