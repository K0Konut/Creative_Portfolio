const LOCALES = ["FR", "EN"];
const FORMATS = ["Compact", "Explanatory"];
const ROWS = { FR: 80, EN: 320 };
const COLUMNS = { Compact: 0, Explanatory: 440 };
const COPY = {
  FR: {
    title: "Mock fictif — application non réalisée",
    body: "SideQuest est une présentation de concept. Aucune application n'a été développée.",
  },
  EN: {
    title: "Fictional mockup — app not built",
    body: "SideQuest is a concept mockup. The app has not been built.",
  },
};
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", pink: "#FF6BD6", violet: "#4B3CFF" };
const APPROVED_FOOTER_DESCRIPTION = "COMP-105 · Structure Wide/Compact validée par Costa le 2026-09-21. Navigation de rappel et emplacements des ressources. Adresse email, URLs des profils, CV FR/EN et mentions finales en attente ; placeholders non liés, validation de contenu encore ouverte.";

let collections = [];
let variables = [];
let boldFont = { family: "Manrope", style: "Bold" };
let regularFont = { family: "Manrope", style: "Regular" };

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

function textNode(value, size, colorName, fallback, typeface = boldFont, width) {
  const node = figma.createText();
  node.fontName = typeface;
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

function createVariant(locale, format, parent) {
  const compact = format === "Compact";
  const component = figma.createComponent();
  component.name = `Locale=${locale}, Format=${format}`;
  parent.appendChild(component);
  component.resize(compact ? 300 : 760, compact ? 80 : 154);
  component.fills = [boundColor(compact ? "surface/editorial" : "surface/subtle", compact ? COLORS.pink : COLORS.subtle)];
  component.strokes = [boundColor("border/strong", COLORS.ink)];
  component.strokeWeight = 1;
  component.strokeAlign = "INSIDE";
  component.clipsContent = false;
  if (compact) {
    const title = textNode(COPY[locale].title, 15, "text/on-accent", COLORS.ink, boldFont, 260);
    title.name = "Status · title";
    component.appendChild(title);
    title.x = 20;
    title.y = 18;
  } else {
    const stripe = figma.createRectangle();
    stripe.name = "Editorial accent";
    component.appendChild(stripe);
    stripe.resize(8, 154);
    stripe.x = 0;
    stripe.y = 0;
    stripe.fills = [boundColor("surface/editorial", COLORS.pink)];
    stripe.strokes = [];
    const tag = textNode(locale === "FR" ? "STATUT DU PROJET" : "PROJECT STATUS", 13, "text/primary", COLORS.ink);
    tag.name = "Status · kicker";
    component.appendChild(tag);
    tag.x = 32;
    tag.y = 22;
    const title = textNode(COPY[locale].title, 22, "text/primary", COLORS.ink, boldFont, 690);
    title.name = "Status · title";
    component.appendChild(title);
    title.x = 32;
    title.y = 48;
    const body = textNode(COPY[locale].body, 16, "text/primary", COLORS.ink, regularFont, 690);
    body.name = "Status · explanation";
    component.appendChild(body);
    body.x = 32;
    body.y = 95;
  }
  component.description = `COMP-202 · ${locale}/${format}. Statut textuel non interactif à placer avant tout contenu ambigu. Traduction EN et explication à relire ; ne pas afficher pour un projet réel sans statut particulier.`;
  return component;
}

function updateEnglishCopy(set) {
  const oldTitle = "Fictional mock — application not built";
  const oldBody = "SideQuest is a concept presentation. No application has been developed.";
  const updates = [];
  for (const format of FORMATS) {
    const component = set.children.find((entry) => entry.name === `Locale=EN, Format=${format}`);
    const title = component.children.find((entry) => entry.type === "TEXT" && entry.name === "Status · title");
    if (!title || ![oldTitle, COPY.EN.title].includes(title.characters)) {
      throw new Error(`Titre EN ${format} absent ou modifié manuellement : arrêt sans remplacement`);
    }
    updates.push([title, COPY.EN.title]);
    if (format === "Explanatory") {
      const body = component.children.find((entry) => entry.type === "TEXT" && entry.name === "Status · explanation");
      if (!body || ![oldBody, COPY.EN.body].includes(body.characters)) {
        throw new Error("Explication EN absente ou modifiée manuellement : arrêt sans remplacement");
      }
      updates.push([body, COPY.EN.body]);
    }
  }
  for (const [node, value] of updates) node.characters = value;
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
  const frame = frameWithLines("_Generated/Project Status · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-202 · FEATURE", 14, COLORS.violet, 48, 36],
    ["Statut du projet", 42, COLORS.ink, 48, 68],
    ["SideQuest est présenté comme un mock fictif non réalisé, avant toute description pouvant suggérer une réalisation.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Project Status · Usage notes", 1120, 390, COLORS.subtle, [
    ["USAGE · Format compact dans COMP-201 ; format explicatif avant le contenu du détail dans COMP-305.", 16, COLORS.ink, 40, 24],
    ["VÉRITÉ · « Mock fictif — application non réalisée » doit être perceptible avant toute image ou texte ambigu.", 16, COLORS.ink, 40, 78],
    ["LOCALISATION · FR issu du contrat validé ; traduction EN et corps explicatif proposés, à relire avant finalisation.", 16, COLORS.ink, 40, 132],
    ["ACCESSIBILITÉ · Texte explicite, sans dépendre du rose ; aucun rôle de bouton, lien, filtre ou badge de projet réel.", 16, COLORS.ink, 40, 186],
    ["RESPONSIVE · Le format compact accepte deux lignes ; aucune troncature de « fictif » ou « non réalisée ».", 16, COLORS.ink, 40, 240],
    ["EXCLUSIONS · Pas d'état hover/focus ; composant absent des projets réels sans statut particulier documenté.", 16, COLORS.ink, 40, 294],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Project Status · Preview surface";
  board.resize(1800, 780);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const format of FORMATS) {
    const node = plainText(format === "Compact" ? "COMPACT · APERÇU" : "EXPLICATIF · DÉTAIL", 15, COLORS.violet);
    node.x = 170 + COLUMNS[format];
    node.y = 310;
    page.appendChild(node);
  }
  for (const locale of LOCALES) {
    const node = plainText(locale === "FR" ? "FRANÇAIS" : "ENGLISH", 15, COLORS.ink);
    node.x = 28;
    node.y = 412 + ROWS[locale];
    page.appendChild(node);
  }
}

function syncApprovedFooter(footerSet) {
  footerSet.description = APPROVED_FOOTER_DESCRIPTION;
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-105 · Pied de page");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "STRUCTURE VALIDÉE · CONTENU EN ATTENTE";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 2488));
  let card = index.children.find((entry) => entry.name === "Index · COMP-202 · Statut du projet");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-202 · Statut du projet";
    index.appendChild(card);
  }
  const approved = card.children.some((entry) => entry.type === "TEXT" && entry.characters === "VALIDÉ · 4 VARIANTES");
  card.resize(1344, 174);
  card.x = 48;
  card.y = 2266;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-202 · Statut du projet", 28, COLORS.ink, 28, 20],
    [approved ? "VALIDÉ · 4 VARIANTES" : "À VALIDER · 4 VARIANTES", 14, COLORS.violet, 28, 65],
    ["FR/EN · compact et explicatif ; statut fictif transmis par le texte.", 16, COLORS.muted, 28, 105],
    ["02.11 — Project Status", 16, COLORS.violet, 960, 65],
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
  for (const name of ["surface/editorial", "surface/subtle", "text/on-accent", "text/primary", "border/strong"]) variable("Semantic/Color", name);
  const styles = await figma.getLocalTextStylesAsync();
  const labelStyle = styles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(labelStyle.fontName);
  await figma.loadFontAsync(regularFont);
  boldFont = labelStyle.fontName;
}

async function main() {
  figma.notify("Préparation de COMP-202 Statut du projet…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const footerPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.10 — Site Footer");
  const footerSet = footerPage && footerPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Site footer");
  if (!footerSet || footerSet.children.length !== 2) throw new Error("COMP-105 Pied de page absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.11 — Project Status");
  if (!page) {
    page = figma.createPage();
    page.name = "02.11 — Project Status";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project status");
  if (existing) {
    const expected = LOCALES.flatMap((locale) => FORMATS.map((format) => `Locale=${locale}, Format=${format}`));
    const actual = existing.children.map((entry) => entry.name);
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Project status incomplet ou altéré (${actual.length}/4) : arrêt sans remplacement`);
    }
    updateEnglishCopy(existing);
    syncApprovedFooter(footerSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-202 mis à jour · 4 variantes préservées");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Project Status Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const locale of LOCALES) {
    for (const format of FORMATS) components.push(createVariant(locale, format, staging));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Project status";
  set.description = "COMP-202 · À valider. Locale FR/EN × Format Compact/Explanatory. Statut textuel non interactif ; rédaction anglaise et explication à confirmer.";
  set.x = 160;
  set.y = 400;
  components.forEach((component, index) => {
    const locale = LOCALES[Math.floor(index / FORMATS.length)];
    const format = FORMATS[index % FORMATS.length];
    component.x = COLUMNS[format];
    component.y = ROWS[locale];
  });
  set.resizeWithoutConstraints(1280, 570);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedFooter(footerSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-202 créé · 4 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Project Status Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
