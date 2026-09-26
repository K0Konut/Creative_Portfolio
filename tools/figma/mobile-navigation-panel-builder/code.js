const PANELS = ["Closed", "Open"];
const TRIGGERS = ["Default", "Hover", "Focus", "Active"];
const COLUMNS = { Default: 0, Hover: 380, Focus: 760, Active: 1140 };
const ROWS = { Closed: 72, Open: 280 };
const COLORS = {
  canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113",
  muted: "#474747", violet: "#4B3CFF",
};
const APPROVED_NAV_DESCRIPTION = "COMP-102 · 24 variantes Layout × Current × State validées par Costa le 2026-09-21. Accueil, Projets et À propos ; page courante indiquée par contour et soulignement. Labels TEXT localisables ; navigation nommée et aria-current=page à implémenter.";

let font = { family: "Manrope", style: "Bold" };
let effectStyle;

function rgb(hex) {
  const value = hex.slice(1);
  return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
}

function solid(hex) {
  return { type: "SOLID", color: rgb(hex) };
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
  const frame = frameWithLines("_Generated/Mobile Navigation Panel · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-103 · LAYOUT GLOBAL", 14, COLORS.violet, 48, 36],
    ["Panneau de navigation mobile", 42, COLORS.ink, 48, 68],
    ["Une commande explicite ouvre navigation et langues dans un panneau compact, sans recouvrir toute la page.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Mobile Navigation Panel · Usage notes", 1220, 460, COLORS.subtle, [
    ["USAGE · Sous 1024 px, la navigation et la langue sont dans ce panneau ; à partir de 1024 px, elles sont directes en en-tête.", 16, COLORS.ink, 40, 24],
    ["COMPOSITION · Instances COMP-001, COMP-102 verticale et COMP-104 FR. Le contenu EN et la page courante suivent la route.", 16, COLORS.ink, 40, 82],
    ["TAILLE · Panneau de 280 px ; tient à 320 px CSS avec 20 px de marge latérale, sans réduire le texte ni les cibles.", 16, COLORS.ink, 40, 140],
    ["ACCESSIBILITÉ · Commande nommée, aria-expanded et relation au panneau ; Escape ferme ; focus rendu à la commande si nécessaire.", 16, COLORS.ink, 40, 198],
    ["CLAVIER · Panneau fermé retiré de l'ordre de focus ; ouvert : commande, Accueil, Projets, À propos, FR puis EN.", 16, COLORS.ink, 40, 256],
    ["MOTION · Ouverture 280 ms au maximum, interruptible ; immédiate avec prefers-reduced-motion ; aucun focus masqué.", 16, COLORS.ink, 40, 314],
    ["À VÉRIFIER · Reflow à 320 px, zoom 200 %, libellés anglais et fermeture après navigation dans les écrans réels.", 16, COLORS.ink, 40, 372],
  ]);
}

function actionVariant(actionSet, state) {
  const node = actionSet.children.find((entry) => entry.type === "COMPONENT" && entry.name === `Style=Control, State=${state}`);
  if (!node) throw new Error(`COMP-001 Action Control/${state} absent`);
  return node;
}

function navigationVariant(navSet) {
  const node = navSet.children.find((entry) => entry.type === "COMPONENT" && entry.name === "Layout=Vertical, Current=Home, State=Default");
  if (!node) throw new Error("COMP-102 Navigation verticale/Accueil/Default absente");
  return node;
}

function languageVariant(languageSet) {
  const node = languageSet.children.find((entry) => entry.type === "COMPONENT" && entry.name === "Locale=FR, State=Default");
  if (!node) throw new Error("COMP-104 Sélecteur FR/Default absent");
  return node;
}

function ensureNavigationStretch(navSet) {
  for (const component of navSet.children) {
    if (component.type !== "COMPONENT" || !component.name.startsWith("Layout=Vertical,")) continue;
    for (const child of component.children) {
      if (child.type === "FRAME" || child.name.endsWith("Focus outer ring")) {
        child.constraints = { horizontal: "STRETCH", vertical: "MIN" };
      }
    }
  }
}

function overrideActionLabel(instance, value) {
  const key = Object.keys(instance.componentProperties).find((name) => name === "Label" || name.startsWith("Label#"));
  if (!key) throw new Error("Propriété Label de COMP-001 absente");
  instance.setProperties({ [key]: value });
}

function addTrigger(component, actionSet, panel, trigger) {
  const action = actionVariant(actionSet, trigger).createInstance();
  action.name = panel === "Open" ? "Fermer le menu · COMP-001" : "Ouvrir le menu · COMP-001";
  component.appendChild(action);
  overrideActionLabel(action, panel === "Open" ? "Fermer" : "Menu");
  action.x = 148;
  action.y = 8;
  return action;
}

function addPanel(component, navSet, languageSet) {
  const panel = figma.createFrame();
  panel.name = "Navigation panel · expanded";
  component.appendChild(panel);
  panel.resize(280, 296);
  panel.x = 0;
  panel.y = 72;
  panel.fills = [solid(COLORS.canvas)];
  panel.strokes = [solid(COLORS.ink)];
  panel.strokeWeight = 1;
  panel.strokeAlign = "INSIDE";
  panel.cornerRadius = 0;
  panel.clipsContent = false;
  panel.effects = effectStyle.effects;

  const navigation = navigationVariant(navSet).createInstance();
  navigation.name = "COMP-102 · Vertical navigation";
  panel.appendChild(navigation);
  navigation.resize(232, 168);
  navigation.x = 24;
  navigation.y = 24;

  const language = languageVariant(languageSet).createInstance();
  language.name = "COMP-104 · Language switcher";
  panel.appendChild(language);
  language.x = 24;
  language.y = 216;
}

function createVariant(panel, trigger, parent, actionSet, navSet, languageSet) {
  const component = figma.createComponent();
  component.name = `Panel=${panel}, Trigger=${trigger}`;
  parent.appendChild(component);
  component.resize(280, panel === "Open" ? 368 : 64);
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;
  if (panel === "Open") addPanel(component, navSet, languageSet);
  addTrigger(component, actionSet, panel, trigger);
  component.description = `COMP-103 · ${panel}/${trigger}. Commande COMP-001, navigation COMP-102 et langue COMP-104 imbriquées. aria-expanded, Escape, ordre du focus et routes réelles à implémenter.`;
  return component;
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Mobile Navigation Panel · Preview surface";
  board.resize(1800, 870);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const trigger of TRIGGERS) {
    const node = plainText(trigger.toUpperCase(), 15, COLORS.violet);
    node.x = 220 + COLUMNS[trigger];
    node.y = 312;
    page.appendChild(node);
  }
  for (const panel of PANELS) {
    const node = plainText(panel === "Open" ? "OUVERT" : "FERMÉ", 15, COLORS.ink);
    node.x = 30;
    node.y = 412 + ROWS[panel];
    page.appendChild(node);
  }
}

function syncApprovedNavigation(navSet) {
  navSet.description = APPROVED_NAV_DESCRIPTION;
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-102 · Navigation principale");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "VALIDÉ · 24 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 1876));
  let card = index.children.find((entry) => entry.name === "Index · COMP-103 · Panneau mobile");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-103 · Panneau mobile";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 1654;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-103 · Panneau de navigation mobile", 28, COLORS.ink, 28, 20],
    ["À VALIDER · 8 VARIANTES", 14, COLORS.violet, 28, 65],
    ["Fermé/ouvert · commande Action · navigation et langue imbriquées.", 16, COLORS.muted, 28, 105],
    ["02.8 — Mobile Navigation Panel", 16, COLORS.violet, 895, 65],
  ]) {
    const node = plainText(value, size, color);
    card.appendChild(node);
    node.x = x;
    node.y = y;
  }
}

async function prepare() {
  const styles = await figma.getLocalTextStylesAsync();
  const labelStyle = styles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(labelStyle.fontName);
  font = labelStyle.fontName;
  const effects = await figma.getLocalEffectStylesAsync();
  effectStyle = effects.find((entry) => entry.name === "Effect/Overlay");
  if (!effectStyle) throw new Error("Style Effect/Overlay absent : relancer Foundations Builder");
}

async function main() {
  figma.notify("Préparation de COMP-103 Panneau mobile…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const findSet = (pageName, setName) => {
    const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === pageName);
    return page && page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === setName);
  };
  const actionSet = findSet("02.1 — Action", "Action");
  const navSet = findSet("02.7 — Main Navigation", "Main navigation");
  const languageSet = findSet("02.6 — Language Switcher", "Language switcher");
  if (!actionSet || actionSet.children.length !== 20) throw new Error("COMP-001 Action absent ou incomplet");
  if (!navSet || navSet.children.length !== 24) throw new Error("COMP-102 Navigation principale absent ou incomplet");
  if (!languageSet || languageSet.children.length !== 8) throw new Error("COMP-104 Sélecteur de langue absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.8 — Mobile Navigation Panel");
  if (!page) {
    page = figma.createPage();
    page.name = "02.8 — Mobile Navigation Panel";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Mobile navigation panel");
  if (existing) {
    const expected = PANELS.flatMap((panel) => TRIGGERS.map((trigger) => `Panel=${panel}, Trigger=${trigger}`));
    const actual = existing.children.map((entry) => entry.name);
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Mobile navigation panel incomplet ou altéré (${actual.length}/8) : arrêt sans remplacement`);
    }
    syncApprovedNavigation(navSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-103 déjà présent · 8 variantes préservées");
    return;
  }

  ensureNavigationStretch(navSet);
  const staging = figma.createFrame();
  staging.name = "_Generated/Mobile Navigation Panel Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const panel of PANELS) {
    for (const trigger of TRIGGERS) {
      components.push(createVariant(panel, trigger, staging, actionSet, navSet, languageSet));
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Mobile navigation panel";
  set.description = "COMP-103 · À valider. Panel Closed/Open × Trigger Default/Hover/Focus/Active. Instances COMP-001, COMP-102 et COMP-104. Largeur 280 px ; commande nommée, aria-expanded, Escape et focus à implémenter.";
  set.x = 200;
  set.y = 400;
  components.forEach((component, index) => {
    const panel = PANELS[Math.floor(index / TRIGGERS.length)];
    const trigger = TRIGGERS[index % TRIGGERS.length];
    component.x = COLUMNS[trigger];
    component.y = ROWS[panel];
  });
  set.resizeWithoutConstraints(1510, 730);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedNavigation(navSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-103 créé · 8 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Mobile Navigation Panel Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
