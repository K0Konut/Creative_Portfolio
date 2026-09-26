const LOCALES = ["FR", "EN"];
const LAYOUTS = ["Wide", "Compact"];
const CONTENT_STATES = ["One", "Empty", "MediaUnavailable"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", violet: "#4B3CFF" };
const EMPTY_COPY = {
  FR: { kind: "ÉTAT VIDE", title: "Aucun projet publié", body: "Aucun projet n'est disponible pour le moment. Vous pouvez découvrir mon profil ou me contacter." },
  EN: { kind: "EMPTY STATE", title: "No projects published", body: "No projects are available at the moment. You can explore my profile or get in touch." },
};
const ERROR_COPY_EN = { "Error title": "Media unavailable", "Error explanation": "Text content remains accessible." };

let collections = [];
let variables = [];
let boldFont = { family: "Manrope", style: "Bold" };

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

function requiredVariant(set, name) {
  const component = set.children.find((entry) => entry.type === "COMPONENT" && entry.name === name);
  if (!component) throw new Error(`Variante absente de ${set.name} : ${name}`);
  return component;
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

async function overrideText(instance, name, value) {
  const node = instance.findOne((entry) => entry.type === "TEXT" && entry.name === name);
  if (!node) throw new Error(`Texte à personnaliser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}

async function addEmpty(component, layout, locale, messageSet) {
  const compact = layout === "Compact";
  const message = requiredVariant(messageSet, `Kind=Empty, Size=${compact ? "Inline" : "Section"}`).createInstance();
  message.name = "COMP-003 · Empty collection";
  component.appendChild(message);
  if (compact) message.resize(375, message.height);
  const copy = EMPTY_COPY[locale];
  await overrideText(message, "Kind label", copy.kind);
  const properties = {};
  for (const [name, value] of [["Title · Empty", copy.title], ["Body · Empty", copy.body]]) {
    const key = Object.keys(message.componentProperties).find((entry) => entry.startsWith(`${name}#`));
    if (!key) throw new Error(`Propriété COMP-003 absente : ${name}`);
    properties[key] = value;
  }
  message.setProperties(properties);
  message.x = compact ? 0 : 95;
  message.y = compact ? 0 : 64;
  component.resizeWithoutConstraints(compact ? 375 : 1120, compact ? Math.max(280, message.height + 48) : Math.max(360, message.height + 128));
}

async function addProject(component, layout, locale, state, wideSet, compactSet, mediaSet) {
  const compact = layout === "Compact";
  const source = compact
    ? requiredVariant(compactSet, `Placement=Collection, Locale=${locale}`)
    : requiredVariant(wideSet, `Placement=Collection, Locale=${locale}, State=${state === "MediaUnavailable" ? "MediaError" : "Default"}`);
  const card = source.createInstance();
  card.name = "COMP-201 · SideQuest · one project";
  component.appendChild(card);
  card.x = compact ? 0 : 100;
  card.y = compact ? 0 : 40;
  if (compact && state === "MediaUnavailable") {
    const media = card.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-004 · Review media");
    if (!media) throw new Error("Média compact COMP-201 absent : état indisponible impossible");
    media.swapComponent(requiredVariant(mediaSet, "Usage=Preview, State=Error"));
    media.name = "COMP-004 · Review media";
    if (locale === "EN") {
      for (const [name, value] of Object.entries(ERROR_COPY_EN)) await overrideText(media, name, value);
    }
  }
  component.resizeWithoutConstraints(compact ? 375 : 1120, compact ? card.height : card.height + 80);
}

async function createVariant(layout, locale, state, parent, wideSet, compactSet, messageSet, mediaSet) {
  const component = figma.createComponent();
  component.name = `Layout=${layout}, Locale=${locale}, Content=${state}`;
  parent.appendChild(component);
  component.resize(layout === "Compact" ? 375 : 1120, layout === "Compact" ? 680 : 540);
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
  component.strokes = [];
  component.clipsContent = false;
  if (state === "Empty") await addEmpty(component, layout, locale, messageSet);
  else await addProject(component, layout, locale, state, wideSet, compactSet, mediaSet);
  component.description = `COMP-204 · ${layout}/${locale}/${state}. Collection V1 en liste : un projet réel publiable ou un message vide. ${state === "MediaUnavailable" ? "Le média échoue, mais le texte et l'accès au détail restent présents." : "Aucune case ou entrée fictive."} La navigation et les actions de sortie sont composées dans l'écran.`;
  return component;
}

function frameWithLines(name, width, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
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
  const frame = frameWithLines("_Generated/Project Collection · Documentation", 2100, 0, 220, COLORS.canvas, [
    ["COMP-204 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Collection de projets", 42, COLORS.ink, 48, 68],
    ["Un seul projet en V1, sans remplissage fictif. Un média indisponible ne retire ni le contenu ni l'accès au détail.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Project Collection · Usage notes", 2100, 5220, 460, COLORS.subtle, [
    ["STRUCTURE · Liste d'un seul COMP-201 SideQuest en V1 ; future grille multi-projets hors de cette passe.", 16, COLORS.ink, 40, 24],
    ["ÉTAT VIDE · COMP-003 explique l'absence ; ajouter dans l'écran de vrais liens vers À propos et le contact.", 16, COLORS.ink, 40, 86],
    ["MÉDIA INDISPONIBLE · Conserver la carte et son accès au détail quand seul le visuel échoue ; retirer un projet non publiable.", 16, COLORS.ink, 40, 148],
    ["ACCESSIBILITÉ · Liste sémantique ; ordre de lecture et de focus identiques ; une seule cible par carte.", 16, COLORS.ink, 40, 210],
    ["RESPONSIVE · Références 1120 et 375 px ; contrôler 320 px, zoom 200 % et contenus FR/EN dans les écrans.", 16, COLORS.ink, 40, 272],
    ["VÉRITÉ · Année, type, médias et destination SideQuest à confirmer avant publication ; aucun autre projet inventé.", 16, COLORS.ink, 40, 334],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Project Collection · Preview surface";
  board.resize(2100, 4800);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const [value, x] of [["LARGE · 1120 PX", 240], ["COMPACT · 375 PX", 1480]]) {
    const node = plainText(value, 15, COLORS.violet);
    node.x = x;
    node.y = 330;
    page.appendChild(node);
  }
  for (const state of CONTENT_STATES) {
    for (const locale of LOCALES) {
      const node = plainText(`${state.toUpperCase()} · ${locale}`, 15, COLORS.ink);
      node.x = 28;
      node.y = 520 + (CONTENT_STATES.indexOf(state) * 2 + LOCALES.indexOf(locale)) * 740;
      page.appendChild(node);
    }
  }
}

function syncApprovedPreview(wideSet, compactSet) {
  wideSet.description = "COMP-201 · 24 variantes larges validées explicitement par Costa le 2026-09-22. Featured/Collection × FR/EN × états interactifs et média. Carte à lien unique ; contenu SideQuest final et reflow en contexte encore ouverts.";
  compactSet.description = "COMP-201 · 4 références compactes 375 px validées explicitement par Costa le 2026-09-22. Featured/Collection × FR/EN ; états et reflow à 320 px et zoom 200 % à vérifier dans les écrans.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-201 · Aperçu de projet");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 3) {
    fields[1].characters = "VALIDÉ · 24 ÉTATS + 4 RÉFÉRENCES COMPACTES";
    fields[2].characters = "FR/EN · mise en avant et collection ; contenus réels et reflow en contexte à confirmer.";
  }
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 3100));
  let card = index.children.find((entry) => entry.name === "Index · COMP-204 · Collection de projets");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-204 · Collection de projets";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 2852;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-204 · Collection de projets", 28, COLORS.ink, 28, 20],
    ["À VALIDER · 12 VARIANTES", 14, COLORS.violet, 28, 65],
    ["FR/EN · un projet, vide ou média indisponible · large et compact.", 16, COLORS.muted, 28, 105],
    ["02.14 — Project Collection", 16, COLORS.violet, 960, 65],
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
  variable("Semantic/Color", "surface/canvas");
  await figma.loadFontAsync(boldFont);
}

async function main() {
  figma.notify("Préparation de COMP-204 Collection de projets…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const previewPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.13 — Project Preview");
  const messagePage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message");
  const mediaPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.5 — Media Frame");
  const wideSet = previewPage && previewPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview");
  const compactSet = previewPage && previewPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview · Compact reference");
  const messageSet = messagePage && messagePage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message");
  const mediaSet = mediaPage && mediaPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Media frame");
  if (!wideSet || !compactSet || !messageSet || !mediaSet) throw new Error("COMP-201, COMP-003 ou COMP-004 absent : générer ces composants avant COMP-204");
  for (const locale of LOCALES) {
    requiredVariant(wideSet, `Placement=Collection, Locale=${locale}, State=Default`);
    requiredVariant(wideSet, `Placement=Collection, Locale=${locale}, State=MediaError`);
    requiredVariant(compactSet, `Placement=Collection, Locale=${locale}`);
  }
  for (const size of ["Inline", "Section"]) requiredVariant(messageSet, `Kind=Empty, Size=${size}`);
  requiredVariant(mediaSet, "Usage=Preview, State=Error");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.14 — Project Collection");
  if (!page) {
    page = figma.createPage();
    page.name = "02.14 — Project Collection";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project collection");
  if (existing) {
    const expected = LAYOUTS.flatMap((layout) => LOCALES.flatMap((locale) => CONTENT_STATES.map((state) => `Layout=${layout}, Locale=${locale}, Content=${state}`)));
    if (existing.children.length !== expected.length || existing.children.some((entry) => entry.type !== "COMPONENT" || !expected.includes(entry.name))) {
      throw new Error("Set Project collection modifié : arrêt sans remplacement");
    }
    syncApprovedPreview(wideSet, compactSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-204 préservé · 12 variantes à revoir");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Project Collection Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const state of CONTENT_STATES) {
    for (const locale of LOCALES) {
      for (const layout of LAYOUTS) {
        const component = await createVariant(layout, locale, state, staging, wideSet, compactSet, messageSet, mediaSet);
        component.x = layout === "Wide" ? 0 : 1340;
        component.y = 80 + (CONTENT_STATES.indexOf(state) * 2 + LOCALES.indexOf(locale)) * 740;
        components.push(component);
      }
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Project collection";
  set.description = "COMP-204 · Première passe à revoir. Layout Wide/Compact × Locale FR/EN × Content One/Empty/MediaUnavailable. Un seul projet V1, sans cases fictives ; l'état vide n'invente aucune destination.";
  set.x = 140;
  set.y = 420;
  for (const component of components) {
    const layout = component.name.includes("Layout=Wide") ? "Wide" : "Compact";
    const locale = component.name.includes("Locale=FR") ? "FR" : "EN";
    const state = CONTENT_STATES.find((entry) => component.name.endsWith(`Content=${entry}`));
    component.x = layout === "Wide" ? 0 : 1340;
    component.y = 80 + (CONTENT_STATES.indexOf(state) * 2 + LOCALES.indexOf(locale)) * 740;
  }
  set.resizeWithoutConstraints(1810, 4510);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedPreview(wideSet, compactSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-204 créé · 12 variantes à revoir dans Figma");
}

main().catch((error) => {
  figma.notify(`Erreur Project Collection Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
