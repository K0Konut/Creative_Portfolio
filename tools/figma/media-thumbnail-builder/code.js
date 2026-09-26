const SELECTIONS = ["Other", "Current"];
const INTERACTIONS = ["Default", "Hover", "Focus", "Active"];
const LOCALES = ["FR", "EN"];
const COLORS = {
  canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747",
  border: "#827F76", violet: "#4B3CFF", activeViolet: "#17105B",
};

let collections = [];
let variables = [];
let labelStyle;
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

async function thumbnailLabel(value) {
  const node = figma.createText();
  node.name = "Media position · editable";
  node.fontName = labelStyle.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(labelStyle.id);
  node.fills = [boundColor("text/primary", COLORS.ink)];
  node.resize(160, node.height);
  node.textAutoResize = "HEIGHT";
  return node;
}

function setOutline(component, token, fallback, weight) {
  component.strokes = [boundColor(token, fallback)];
  component.strokeWeight = weight;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", weight === 2 ? "stroke/emphasis" : "stroke/control"));
  component.strokeAlign = "INSIDE";
}

function focusRing(component, name, inset, token, fallback, weightToken) {
  const ring = figma.createRectangle();
  ring.name = name;
  component.appendChild(ring);
  ring.resize(component.width + inset * 2, component.height + inset * 2);
  ring.x = -inset;
  ring.y = -inset;
  ring.fills = [];
  ring.strokes = [boundColor(token, fallback)];
  ring.strokeWeight = 2;
  ring.setBoundVariable("strokeWeight", variable("Primitives/Shape", weightToken));
  ring.strokeAlign = "INSIDE";
  ring.cornerRadius = 8 + inset;
}

async function createVariant(selection, interaction, locale, parent, mediaSet) {
  const current = selection === "Current";
  const component = figma.createComponent();
  component.name = `Selection=${selection}, Interaction=${interaction}, Locale=${locale}`;
  parent.appendChild(component);
  component.resize(184, 148);
  const raised = interaction === "Active" || (current && interaction === "Hover");
  component.fills = [boundColor(raised ? "surface/subtle" : "surface/canvas", raised ? COLORS.subtle : COLORS.canvas)];
  component.cornerRadius = 8;
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/control"));
  component.clipsContent = false;
  setOutline(component, current ? "surface/brand" : "border/default", current ? COLORS.violet : COLORS.border, current ? 2 : 1);

  const media = requiredVariant(mediaSet, "Usage=Thumbnail, State=Loaded").createInstance();
  media.name = "COMP-004 · Review thumbnail";
  component.appendChild(media);
  media.rescale(160 / media.width);
  media.x = 12;
  media.y = 12;

  const copy = current ? (locale === "FR" ? "Image 1 · actuelle" : "Image 1 · current") : "Image 1";
  const label = await thumbnailLabel(copy);
  component.appendChild(label);
  label.x = 12;
  label.y = 118;

  if (interaction === "Hover") setOutline(component, current ? "surface/brand" : "border/strong", current ? COLORS.violet : COLORS.ink, 2);
  if (interaction === "Active") setOutline(component, current ? "surface/action-secondary-active" : "border/strong", current ? COLORS.activeViolet : COLORS.ink, 2);
  if (interaction === "Focus") {
    focusRing(component, "Focus inner ring", 2, "focus/inner", COLORS.canvas, "stroke/focus-inner");
    focusRing(component, "Focus outer ring", 4, "focus/outer", COLORS.ink, "stroke/focus-outer");
  }
  component.description = `COMP-206 · ${selection}/${interaction}/${locale}. Une seule commande pour sélectionner l'image correspondante ; le libellé visible indique la position${current ? " et l'image courante" : ""}. Nom accessible et numéro à renseigner avec les vrais médias ; sélection temporairement suspend l'autoplay du carrousel.`;
  return component;
}

function refineCurrentInteractions(set) {
  for (const locale of LOCALES) {
    const hover = requiredVariant(set, `Selection=Current, Interaction=Hover, Locale=${locale}`);
    const active = requiredVariant(set, `Selection=Current, Interaction=Active, Locale=${locale}`);
    for (const component of [hover, active]) {
      if (component.width !== 184 || component.height !== 148 ||
          !component.children.some((entry) => entry.name === "Media position · editable") ||
          !component.children.some((entry) => entry.name === "COMP-004 · Review thumbnail")) {
        throw new Error(`Variante courante ${component.name} modifiée : arrêt sans remplacement`);
      }
    }
    hover.fills = [boundColor("surface/subtle", COLORS.subtle)];
    active.fills = [boundColor("surface/subtle", COLORS.subtle)];
    setOutline(active, "surface/action-secondary-active", COLORS.activeViolet, 2);
  }
}

function frameWithLines(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(1580, height);
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
  const frame = frameWithLines("_Generated/Media Thumbnail · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-206 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Miniature de média", 42, COLORS.ink, 48, 68],
    ["Une commande par image. Sélection et interaction indépendantes ; la miniature courante reste identifiable par le texte.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function notesFrame() {
  return frameWithLines("_Generated/Media Thumbnail · Usage notes", 1740, 430, COLORS.subtle, [
    ["USAGE · Bouton de sélection d'une image du carrousel ; une seule cible de 184 × 148 px.", 16, COLORS.ink, 40, 24],
    ["ANATOMIE · Instance COMP-004 Thumbnail/Loaded et libellé de position éditable ; visuel marqué MOCK.", 16, COLORS.ink, 40, 82],
    ["SÉLECTION · Libellé « actuelle » / « current » en plus de la bordure ; peut coexister avec hover, focus et active.", 16, COLORS.ink, 40, 140],
    ["ACCESSIBILITÉ · Nommer la commande selon l'image réelle, annoncer la sélection et garder le focus visible sur la cible entière.", 16, COLORS.ink, 40, 198],
    ["RESPONSIVE · Rangée défilable dans COMP-205 ; garder la miniature active visible et les commandes principales accessibles.", 16, COLORS.ink, 40, 256],
    ["CONTENU · Numéro, quantité, images, légendes et alternatives SideQuest à confirmer avant la maquette finale.", 16, COLORS.ink, 40, 314],
  ]);
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Media Thumbnail · Preview surface";
  board.resize(1580, 1380);
  board.x = 0;
  board.y = 280;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const interaction of INTERACTIONS) {
    const node = plainText(interaction.toUpperCase(), 15, COLORS.violet);
    node.x = 175 + INTERACTIONS.indexOf(interaction) * 300;
    node.y = 330;
    page.appendChild(node);
  }
  for (const selection of SELECTIONS) {
    for (const locale of LOCALES) {
      const node = plainText(`${selection.toUpperCase()} · ${locale}`, 15, COLORS.ink);
      node.x = 32;
      node.y = 540 + (SELECTIONS.indexOf(selection) * 2 + LOCALES.indexOf(locale)) * 250;
      page.appendChild(node);
    }
  }
}

function syncApprovedCollection(collectionSet) {
  collectionSet.description = "COMP-204 · 12 variantes Wide/Compact × FR/EN × One/Empty/MediaUnavailable validées explicitement par Costa le 2026-09-22. Un seul SideQuest V1, sans case fictive. Destinations de l'état vide et reflow en contexte à compléter dans les écrans.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-204 · Collection de projets");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "VALIDÉ · 12 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 3300));
  let card = index.children.find((entry) => entry.name === "Index · COMP-206 · Miniature de média");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-206 · Miniature de média";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 3050;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, color, x, y] of [
    ["COMP-206 · Miniature de média", 28, COLORS.ink, 28, 20],
    ["À VALIDER · 16 VARIANTES", 14, COLORS.violet, 28, 65],
    ["FR/EN · autre ou courante × default, hover, focus, active.", 16, COLORS.muted, 28, 105],
    ["02.15 — Media Thumbnail", 16, COLORS.violet, 960, 65],
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
  for (const name of ["surface/canvas", "surface/subtle", "surface/brand", "surface/action-secondary-active", "text/primary", "border/default", "border/strong", "focus/inner", "focus/outer"]) variable("Semantic/Color", name);
  for (const name of ["radius/control", "stroke/control", "stroke/emphasis", "stroke/focus-inner", "stroke/focus-outer"]) variable("Primitives/Shape", name);
  const styles = await figma.getLocalTextStylesAsync();
  labelStyle = styles.find((entry) => entry.name === "Type/Label/SM/Large");
  if (!labelStyle) throw new Error("Style Type/Label/SM/Large absent : relancer Foundations Builder");
  await figma.loadFontAsync(labelStyle.fontName);
  await figma.loadFontAsync(boldFont);
}

async function main() {
  figma.notify("Préparation de COMP-206 Miniature de média…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const mediaPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.5 — Media Frame");
  const collectionPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.14 — Project Collection");
  const mediaSet = mediaPage && mediaPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Media frame");
  const collectionSet = collectionPage && collectionPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project collection");
  if (!mediaSet || !collectionSet) throw new Error("COMP-004 ou COMP-204 absent : générer ces composants avant COMP-206");
  requiredVariant(mediaSet, "Usage=Thumbnail, State=Loaded");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.15 — Media Thumbnail");
  if (!page) {
    page = figma.createPage();
    page.name = "02.15 — Media Thumbnail";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Media thumbnail");
  if (existing) {
    const expected = SELECTIONS.flatMap((selection) => LOCALES.flatMap((locale) => INTERACTIONS.map((interaction) => `Selection=${selection}, Interaction=${interaction}, Locale=${locale}`)));
    if (existing.children.length !== expected.length || existing.children.some((entry) => entry.type !== "COMPONENT" || !expected.includes(entry.name))) {
      throw new Error("Set Media thumbnail modifié : arrêt sans remplacement");
    }
    refineCurrentInteractions(existing);
    syncApprovedCollection(collectionSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-206 préservé · 16 variantes à revoir");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Media Thumbnail Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const selection of SELECTIONS) {
    for (const locale of LOCALES) {
      for (const interaction of INTERACTIONS) {
        components.push(await createVariant(selection, interaction, locale, staging, mediaSet));
      }
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Media thumbnail";
  set.description = "COMP-206 · Première passe à revoir. Selection Other/Current × Interaction Default/Hover/Focus/Active × Locale FR/EN. Sélection textuelle et focus indépendant ; média mock à remplacer.";
  set.x = 150;
  set.y = 430;
  for (const component of components) {
    const selection = component.name.includes("Selection=Current") ? "Current" : "Other";
    const locale = component.name.includes("Locale=FR") ? "FR" : "EN";
    const interaction = INTERACTIONS.find((entry) => component.name.includes(`Interaction=${entry}`));
    component.x = INTERACTIONS.indexOf(interaction) * 300;
    component.y = 80 + (SELECTIONS.indexOf(selection) * 2 + LOCALES.indexOf(locale)) * 250;
  }
  set.resizeWithoutConstraints(1180, 1080);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedCollection(collectionSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-206 créé · 16 variantes à revoir dans Figma");
}

main().catch((error) => {
  figma.notify(`Erreur Media Thumbnail Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
