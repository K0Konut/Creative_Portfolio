const LOCALES = ["FR", "EN"];
const FORMATS = ["Compact", "Detail"];
const ROWS = { FR: 80, EN: 290 };
const COLUMNS = { Compact: 0, Detail: 430 };
const COPY = {
  FR: { yearLabel: "ANNÉE", typeLabel: "TYPE PRINCIPAL", pending: "À confirmer" },
  EN: { yearLabel: "YEAR", typeLabel: "PRIMARY TYPE", pending: "To be confirmed" },
};
const COLORS = {
  canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113",
  muted: "#474747", border: "#827F76", violet: "#4B3CFF",
};
const APPROVED_STATUS_DESCRIPTION = "COMP-202 · Validé par Costa le 2026-09-21 après revue des quatre variantes FR/EN × Compact/Explanatory et de la rédaction bilingue. Statut textuel non interactif ; ne pas afficher pour un projet réel sans statut particulier.";

let collections = [];
let variables = [];
let boldFont = { family: "Manrope", style: "Bold" };
let regularFont = { family: "Manrope", style: "Regular" };

function rgb(hex) {
  const value = hex.slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
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

function textNode(value, size, colorName, fallback, fontName, width) {
  const node = figma.createText();
  node.fontName = fontName;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 130 };
  node.fills = [boundColor(colorName, fallback)];
  if (width) {
    node.resize(width, size * 1.3);
    node.textAutoResize = "HEIGHT";
  } else {
    node.textAutoResize = "WIDTH_AND_HEIGHT";
  }
  return node;
}

function plainText(value, size, hex) {
  const node = figma.createText();
  node.fontName = boldFont;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 120 };
  node.fills = [solid(hex)];
  node.textAutoResize = "WIDTH_AND_HEIGHT";
  return node;
}

function addPair(component, name, label, value, x, width, format, locale) {
  const group = figma.createFrame();
  group.name = `Metadata · ${name}`;
  component.appendChild(group);
  group.resize(width, format === "Compact" ? 62 : 78);
  group.x = x;
  group.y = 20;
  group.fills = [];
  group.strokes = [];
  group.clipsContent = false;

  const caption = textNode(label, 13, "text/secondary", COLORS.muted, boldFont, width);
  caption.name = `${name} · label`;
  group.appendChild(caption);
  caption.x = 0;
  caption.y = 0;

  const content = textNode(value, format === "Compact" ? 16 : 20, "text/primary", COLORS.ink, regularFont, width);
  content.name = `${name} · value`;
  group.appendChild(content);
  content.x = 0;
  content.y = format === "Compact" ? 26 : 34;
  const key = component.addComponentProperty(`${name} ${locale}`, "TEXT", value);
  content.componentPropertyReferences = { characters: key };
}

function createVariant(locale, format, parent) {
  const compact = format === "Compact";
  const component = figma.createComponent();
  component.name = `Locale=${locale}, Format=${format}`;
  parent.appendChild(component);
  component.resize(compact ? 300 : 760, compact ? 98 : 126);
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
  component.strokes = [];
  component.clipsContent = false;

  const rule = figma.createRectangle();
  rule.name = "Metadata · rule";
  component.appendChild(rule);
  rule.resize(compact ? 300 : 760, 1);
  rule.x = 0;
  rule.y = 0;
  rule.fills = [boundColor("border/default", COLORS.border)];
  rule.strokes = [];

  const copy = COPY[locale];
  addPair(component, "Year", copy.yearLabel, copy.pending, 0, compact ? 124 : 220, format, locale);
  addPair(component, "Primary type", copy.typeLabel, copy.pending, compact ? 158 : 300, compact ? 142 : 420, format, locale);
  component.description = `COMP-203 · ${locale}/${format}. Année et type principal éditables ; valeurs de revue à remplacer par les données vérifiées. Aucun rôle SideQuest. Champ absent = groupe entièrement omis dans l'écran et le code.`;
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
  const frame = frameWithLines("_Generated/Project Metadata · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-203 · FEATURE", 14, COLORS.violet, 48, 36],
    ["Métadonnées du projet", 42, COLORS.ink, 48, 68],
    ["Des faits disponibles, chacun lié à son libellé. Les valeurs de la planche attendent le contenu SideQuest vérifié.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Project Metadata · Usage notes", 1080, 420, COLORS.subtle, [
    ["USAGE · Compact dans COMP-201 ; détaillé dans le détail projet. Les paires restent dans le même ordre.", 16, COLORS.ink, 40, 24],
    ["CONTENU · « À confirmer » / « To be confirmed » sont des exemples de revue, jamais des données à publier.", 16, COLORS.ink, 40, 82],
    ["VÉRITÉ · Année et type SideQuest à confirmer ; aucun champ Rôle ni résultat ou métrique inventés.", 16, COLORS.ink, 40, 140],
    ["OPTIONNEL · Si une donnée manque, omettre sa paire entière ; les types complémentaires attendent des faits réels.", 16, COLORS.ink, 40, 198],
    ["ACCESSIBILITÉ · Conserver la relation libellé–valeur dans une structure sémantique ; aucune interaction.", 16, COLORS.ink, 40, 256],
    ["RESPONSIVE · Reflow sans séparer les paires ; vérifier à 320 px et à 200 % de texte sur les écrans réels.", 16, COLORS.ink, 40, 314],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Project Metadata · Preview surface";
  board.resize(1800, 720);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const format of FORMATS) {
    const node = plainText(format === "Compact" ? "COMPACT · APERÇU" : "DÉTAILLÉ · PROJET", 15, COLORS.violet);
    node.x = 170 + COLUMNS[format];
    node.y = 310;
    page.appendChild(node);
  }
  for (const locale of LOCALES) {
    const node = plainText(locale === "FR" ? "FRANÇAIS" : "ENGLISH", 15, COLORS.ink);
    node.x = 28;
    node.y = 420 + ROWS[locale];
    page.appendChild(node);
  }
}

function syncApprovedStatus(statusSet) {
  statusSet.description = APPROVED_STATUS_DESCRIPTION;
  for (const component of statusSet.children) {
    component.description = `COMP-202 · ${component.name}. Statut textuel non interactif validé par Costa le 2026-09-21 ; absent des projets réels sans statut particulier documenté.`;
  }
  const statusPage = statusSet.parent;
  const notes = statusPage.children.find((entry) => entry.name === "_Generated/Project Status · Usage notes");
  const localization = notes && notes.children.find((entry) => entry.type === "TEXT" && entry.characters.startsWith("LOCALISATION ·"));
  if (localization) {
    localization.characters = "LOCALISATION · Formulations FR/EN et corps explicatifs validés par Costa le 2026-09-21.";
  }
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-202 · Statut du projet");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2 && fields[1].characters === "À VALIDER · 4 VARIANTES") {
    fields[1].characters = "VALIDÉ · 4 VARIANTES";
  }
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 2680));
  let card = index.children.find((entry) => entry.name === "Index · COMP-203 · Métadonnées du projet");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-203 · Métadonnées du projet";
    index.appendChild(card);
  }
  const approved = card.children.some((entry) => entry.type === "TEXT" && entry.characters === "STRUCTURE VALIDÉE · CONTENU EN ATTENTE");
  card.resize(1344, 174);
  card.x = 48;
  card.y = 2460;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-203 · Métadonnées du projet", 28, COLORS.ink, 28, 20],
    [approved ? "STRUCTURE VALIDÉE · CONTENU EN ATTENTE" : "À VALIDER · 4 VARIANTES", 14, COLORS.violet, 28, 65],
    ["FR/EN · compact et détaillé ; valeurs SideQuest à confirmer, rôle absent.", 16, COLORS.muted, 28, 105],
    ["02.12 — Project Metadata", 16, COLORS.violet, 960, 65],
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
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) variable("Semantic/Color", name);
  const styles = await figma.getLocalTextStylesAsync();
  const labelStyle = styles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(labelStyle.fontName);
  await figma.loadFontAsync(regularFont);
  boldFont = labelStyle.fontName;
}

async function main() {
  figma.notify("Préparation de COMP-203 Métadonnées du projet…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const statusPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.11 — Project Status");
  const statusSet = statusPage && statusPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project status");
  const expectedStatus = LOCALES.flatMap((locale) => ["Compact", "Explanatory"].map((format) => `Locale=${locale}, Format=${format}`));
  if (!statusSet || statusSet.children.length !== 4 || expectedStatus.some((name) => !statusSet.children.some((entry) => entry.name === name))) {
    throw new Error("COMP-202 Statut du projet absent ou incomplet");
  }

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.12 — Project Metadata");
  if (!page) {
    page = figma.createPage();
    page.name = "02.12 — Project Metadata";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project metadata");
  if (existing) {
    const expected = LOCALES.flatMap((locale) => FORMATS.map((format) => `Locale=${locale}, Format=${format}`));
    const actual = existing.children.map((entry) => entry.name);
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Project metadata incomplet ou altéré (${actual.length}/4) : arrêt sans remplacement`);
    }
    syncApprovedStatus(statusSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-203 déjà présent · 4 variantes préservées");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Project Metadata Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const locale of LOCALES) {
    for (const format of FORMATS) components.push(createVariant(locale, format, staging));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Project metadata";
  set.description = "COMP-203 · À valider. Locale FR/EN × Format Compact/Detail. Paires Année/Type principal éditables. Valeurs de revue à remplacer ; aucun rôle SideQuest ni donnée inventée.";
  set.x = 170;
  set.y = 410;
  components.forEach((component, index) => {
    const locale = LOCALES[Math.floor(index / FORMATS.length)];
    const format = FORMATS[index % FORMATS.length];
    component.x = COLUMNS[format];
    component.y = ROWS[locale];
  });
  set.resizeWithoutConstraints(1260, 520);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedStatus(statusSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-203 créé · 4 variantes à revoir dans Figma");
}

main().catch((error) => {
  figma.notify(`Erreur Project Metadata Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
