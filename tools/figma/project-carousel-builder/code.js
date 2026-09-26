const LOCALES = ["FR", "EN"];
const WIDE_STATES = ["Loading", "Ready", "Playing", "TemporarilyPaused", "ExplicitlyPaused", "Focused", "Hovered", "ReducedMotion", "MediaError", "SingleMedia"];
const COMPACT_STATES = ["Ready", "ReducedMotion"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", violet: "#4B3CFF" };
const COPY = {
  FR: {
    region: "GALERIE DU PROJET", image: "Image", of: "sur", previous: "Précédent", next: "Suivant",
    pause: "Pause", play: "Lecture", review: "Visuel de revue · média final à confirmer",
    error: "Média indisponible · les autres images restent accessibles",
    states: {
      Loading: "Chargement du média", Ready: "Prêt · lecture automatique", Playing: "Lecture automatique",
      TemporarilyPaused: "Lecture suspendue temporairement", ExplicitlyPaused: "Lecture en pause",
      Focused: "Navigation au clavier", Hovered: "Interaction au pointeur",
      ReducedMotion: "Navigation manuelle · mouvement réduit", MediaError: "Média indisponible",
      SingleMedia: "Une seule image",
    },
  },
  EN: {
    region: "PROJECT GALLERY", image: "Image", of: "of", previous: "Previous", next: "Next",
    pause: "Pause", play: "Play", review: "Review visual · final media to be confirmed",
    error: "Media unavailable · other images remain accessible",
    states: {
      Loading: "Loading media", Ready: "Ready · autoplay on", Playing: "Autoplay on",
      TemporarilyPaused: "Autoplay temporarily paused", ExplicitlyPaused: "Autoplay paused",
      Focused: "Keyboard navigation", Hovered: "Pointer interaction",
      ReducedMotion: "Manual navigation · reduced motion", MediaError: "Media unavailable",
      SingleMedia: "One image only",
    },
  },
};

let collections = [];
let variables = [];
const regularFont = { family: "Manrope", style: "Regular" };
const boldFont = { family: "Manrope", style: "Bold" };

function rgb(hex) {
  const value = hex.slice(1);
  return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
}
function solid(hex) { return { type: "SOLID", color: rgb(hex) }; }
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
function text(parent, name, value, x, y, width, size, bold, token, fallback) {
  const node = figma.createText();
  node.name = name;
  node.fontName = bold ? boldFont : regularFont;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 125 };
  node.fills = [boundColor(token, fallback)];
  node.textAutoResize = "HEIGHT";
  parent.appendChild(node);
  node.resize(width, node.height);
  node.x = x;
  node.y = y;
  return node;
}
function plainText(parent, name, value, x, y, width, size, bold, hex) {
  const node = figma.createText();
  node.name = name;
  node.fontName = bold ? boldFont : regularFont;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 125 };
  node.fills = [solid(hex)];
  node.textAutoResize = "HEIGHT";
  parent.appendChild(node);
  node.resize(width, node.height);
  node.x = x;
  node.y = y;
  return node;
}
async function overrideText(instance, name, value) {
  const node = instance.findOne((entry) => entry.type === "TEXT" && entry.name === name);
  if (!node) throw new Error(`Texte d'instance absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}
function action(actionSet, label, state, parent, x, y) {
  const component = requiredVariant(actionSet, `Style=Control, State=${state}`).createInstance();
  component.name = `COMP-001 · ${label}`;
  parent.appendChild(component);
  const key = Object.keys(component.componentProperties).find((entry) => entry.startsWith("Label#"));
  if (!key) throw new Error("Propriété Label absente de COMP-001");
  component.setProperties({ [key]: label });
  component.x = x;
  component.y = y;
  return component;
}
function media(mediaSet, state, parent, width, x, y) {
  const instance = requiredVariant(mediaSet, `Usage=Carousel, State=${state}`).createInstance();
  instance.name = `COMP-004 · Carousel media · ${state}`;
  parent.appendChild(instance);
  instance.rescale(width / instance.width);
  instance.x = x;
  instance.y = y;
  return instance;
}
async function thumbnails(parent, thumbnailSet, mediaSet, locale, count, currentIndex, compact, y, mediaError) {
  const viewport = figma.createFrame();
  viewport.name = "Scrollable thumbnails · implementation scrolls horizontally";
  parent.appendChild(viewport);
  viewport.resize(compact ? 327 : 852, 156);
  viewport.x = 24;
  viewport.y = y;
  viewport.fills = [];
  viewport.strokes = [];
  viewport.clipsContent = compact;
  const offset = compact && currentIndex > 0 ? -currentIndex * 200 : 0;
  for (let index = 0; index < count; index++) {
    const selection = index === currentIndex ? "Current" : "Other";
    const instance = requiredVariant(thumbnailSet, `Selection=${selection}, Interaction=Default, Locale=${locale}`).createInstance();
    instance.name = `COMP-206 · Review image ${index + 1}`;
    viewport.appendChild(instance);
    instance.x = offset + index * 200;
    instance.y = 4;
    const suffix = selection === "Current" ? (locale === "FR" ? " · actuelle" : " · current") : "";
    await overrideText(instance, "Media position · editable", `Image ${index + 1}${suffix}`);
    if (mediaError && index === currentIndex) {
      const thumbnailMedia = instance.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-004 · Review thumbnail");
      if (!thumbnailMedia) throw new Error("COMP-004 absent de la miniature courante");
      thumbnailMedia.swapComponent(requiredVariant(mediaSet, "Usage=Thumbnail, State=Error"));
      thumbnailMedia.name = "COMP-004 · Review thumbnail";
      if (locale === "EN") await overrideText(thumbnailMedia, "Error title", "Unavailable");
    }
  }
}
function status(state, locale, currentIndex, count) {
  const copy = COPY[locale];
  return `${copy.image} ${currentIndex + 1} ${copy.of} ${count} · ${copy.states[state]}`;
}
async function createVariant(layout, locale, state, parent, sources) {
  const compact = layout === "Compact";
  const copy = COPY[locale];
  const single = state === "SingleMedia";
  const count = single ? 1 : 3;
  const currentIndex = state === "Playing" ? 1 : 0;
  const component = figma.createComponent();
  component.name = `Layout=${layout}, Locale=${locale}, State=${state}`;
  parent.appendChild(component);
  component.resize(compact ? 375 : 900, compact ? 670 : 890);
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
  component.strokes = [boundColor("border/default", "#827F76")];
  component.strokeWeight = 1;
  component.clipsContent = false;

  const width = compact ? 327 : 852;
  text(component, "Region label", copy.region, 24, 20, width, 14, true, "text/link", COLORS.violet);
  const mediaState = state === "Loading" ? "Loading" : state === "MediaError" ? "Error" : "Loaded";
  const mediaInstance = media(sources.mediaSet, mediaState, component, width, 24, compact ? 58 : 62);
  if (mediaState === "Error" && locale === "EN") {
    await overrideText(mediaInstance, "Error title", "Media unavailable");
    await overrideText(mediaInstance, "Error explanation", "Text content remains accessible.");
  }
  if (mediaState === "Loading" && locale === "EN") await overrideText(mediaInstance, "Loading label", "Loading media…");
  const captionY = mediaInstance.y + mediaInstance.height + 14;
  text(component, "Review caption", state === "MediaError" ? copy.error : copy.review, 24, captionY, width, compact ? 13 : 16, false, "text/secondary", COLORS.muted);
  const progressY = captionY + (compact ? 42 : 46);
  const progress = text(component, "Position and playback status", status(state, locale, currentIndex, count), 24, progressY, width, compact ? 14 : 16, true, "text/primary", COLORS.ink);
  const controlsY = Math.max(progressY + 48, progress.y + progress.height + 24);

  let thumbsY;
  if (single) {
    thumbsY = controlsY;
  } else if (compact) {
    const previous = action(sources.actionSet, copy.previous, "Default", component, 24, controlsY);
    action(sources.actionSet, copy.next, "Default", component, 24 + previous.width + 16, controlsY);
    if (state !== "ReducedMotion") action(sources.actionSet, state === "ExplicitlyPaused" ? copy.play : copy.pause, "Default", component, 24, controlsY + 64);
    thumbsY = controlsY + (state === "ReducedMotion" ? 72 : 132);
  } else {
    const previous = action(sources.actionSet, copy.previous, "Default", component, 24, controlsY);
    const nextState = state === "Focused" ? "Focus" : state === "Hovered" ? "Hover" : "Default";
    const next = action(sources.actionSet, copy.next, nextState, component, 24 + previous.width + 16, controlsY);
    if (state !== "ReducedMotion") action(sources.actionSet, state === "ExplicitlyPaused" ? copy.play : copy.pause, "Default", component, next.x + next.width + 16, controlsY);
    thumbsY = controlsY + 82;
  }
  await thumbnails(component, sources.thumbnailSet, sources.mediaSet, locale, count, currentIndex, compact, thumbsY, state === "MediaError");
  component.resizeWithoutConstraints(compact ? 375 : 900, thumbsY + 184);
  component.description = `COMP-205 · ${layout}/${locale}/${state}. Média mock et série de ${count} emplacement${count > 1 ? "s" : ""} de revue uniquement ; nombre et médias SideQuest non confirmés. Region nommée, position annoncée, focus sans déplacement automatique. Autoplay 5 s, reprise après 8 s d'inactivité sans focus ni survol ni pause explicite ; mouvement réduit = navigation manuelle. Contrôles natifs à composer en code.`;
  return component;
}
function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(2200, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) plainText(frame, `Line ${textY}`, value, x, textY, 2100 - x, size, true, color);
  return frame;
}
function documentationFrame() {
  const frame = infoFrame("_Generated/Project Carousel · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-205 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Carrousel d'images du projet", 42, COLORS.ink, 48, 68],
    ["Média, position et commandes persistantes. Les images et leur nombre sont des exemples de revue, pas le contenu SideQuest final.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}
function notesFrame(y) {
  return infoFrame("_Generated/Project Carousel · Usage notes", y, 480, COLORS.subtle, [
    ["COMPOSITION · COMP-004 + COMP-001 + COMP-206 ; position textuelle et région nommée.", 16, COLORS.ink, 40, 25],
    ["LECTURE · Image suivante toutes les 5 s ; interaction suspend ; reprise après 8 s seulement sans focus, survol ou pause explicite.", 16, COLORS.ink, 40, 90],
    ["PAUSE · Commande persistante ; le mode mouvement réduit retire l'autoplay et laisse la navigation manuelle.", 16, COLORS.ink, 40, 155],
    ["ACCESSIBILITÉ · Commandes nommées, position annoncée sans alerte urgente, focus stable et navigation clavier complète.", 16, COLORS.ink, 40, 220],
    ["RESPONSIVE · Média dans la grille ; seule la rangée de miniatures défile horizontalement. Vérifier 320 px et zoom 200 % en écran.", 16, COLORS.ink, 40, 285],
    ["VÉRITÉ · Trois emplacements illustratifs ; nombre, ordre, légendes, alternatives et bouclage à confirmer avec les vrais médias.", 16, COLORS.ink, 40, 350],
    ["ERREUR · Conserver le texte et l'accès aux autres images ; retirer de la série un média réellement invalide.", 16, COLORS.ink, 40, 415],
  ]);
}
function previewSurface(page, height) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Project Carousel · Preview surface";
  frame.resize(2200, height);
  frame.x = 0;
  frame.y = 260;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  plainText(page, "Column FR", "FRANÇAIS · LARGE", 170, 320, 900, 16, true, COLORS.violet);
  plainText(page, "Column EN", "ENGLISH · WIDE", 1200, 320, 900, 16, true, COLORS.violet);
  for (let index = 0; index < WIDE_STATES.length; index++) {
    plainText(page, `Row ${index}`, WIDE_STATES[index].toUpperCase(), 24, 480 + index * 1010, 140, 14, true, COLORS.ink);
  }
  plainText(page, "Compact heading", "COMPACT · 375 PX · READY ET MOUVEMENT RÉDUIT", 170, 10620, 1500, 17, true, COLORS.violet);
}
async function refineExisting(page, wideSet, compactSet, mediaSet) {
  for (const locale of LOCALES) {
    const component = requiredVariant(wideSet, `Layout=Wide, Locale=${locale}, State=MediaError`);
    const thumbnail = component.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-206 · Review image 1");
    const thumbnailMedia = thumbnail && thumbnail.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-004 · Review thumbnail");
    if (!thumbnailMedia) throw new Error(`Miniature d'erreur ${locale} modifiée : arrêt sans remplacement`);
    thumbnailMedia.swapComponent(requiredVariant(mediaSet, "Usage=Thumbnail, State=Error"));
    thumbnailMedia.name = "COMP-004 · Review thumbnail";
    if (locale === "EN") await overrideText(thumbnailMedia, "Error title", "Unavailable");
  }
  for (const state of COMPACT_STATES) for (const locale of LOCALES) {
    const component = requiredVariant(compactSet, `Layout=Compact, Locale=${locale}, State=${state}`);
    const progress = component.children.find((entry) => entry.type === "TEXT" && entry.name === "Position and playback status");
    const viewport = component.children.find((entry) => entry.type === "FRAME" && entry.name === "Scrollable thumbnails · implementation scrolls horizontally");
    const actions = component.children.filter((entry) => entry.type === "INSTANCE" && entry.name.startsWith("COMP-001 · "));
    if (!progress || !viewport || actions.length !== (state === "ReducedMotion" ? 2 : 3)) throw new Error(`Référence compacte ${locale}/${state} modifiée : arrêt sans remplacement`);
    const desiredY = Math.max(progress.y + 48, progress.y + progress.height + 24);
    const firstY = Math.min(...actions.map((entry) => entry.y));
    const shift = Math.max(0, desiredY - firstY);
    if (shift > 0) {
      for (const actionNode of actions) actionNode.y += shift;
      viewport.y += shift;
      component.resizeWithoutConstraints(component.width, component.height + shift);
    }
  }
  compactSet.y = 10780;
  const heading = page.children.find((entry) => entry.type === "TEXT" && entry.name === "Compact heading");
  const board = page.children.find((entry) => entry.type === "FRAME" && entry.name === "_Generated/Project Carousel · Preview surface");
  const notes = page.children.find((entry) => entry.type === "FRAME" && entry.name === "_Generated/Project Carousel · Usage notes");
  if (!heading || !board || !notes) throw new Error("Documentation COMP-205 modifiée : arrêt sans remplacement");
  heading.y = 10620;
  board.resize(board.width, 12200);
  notes.y = 12520;
}
function syncApprovedThumbnail(set) {
  if (set.children.length !== 16) throw new Error("COMP-206 ne contient plus 16 variantes : validation non synchronisée");
  set.description = "COMP-206 · 16 variantes Other/Current × Default/Hover/Focus/Active × FR/EN validées explicitement par Costa le 2026-09-22. Sélection textuelle indépendante du focus ; médias réels et numéro à confirmer.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-206 · Miniature de média");
  if (!card) return;
  const fields = card.children.filter((entry) => entry.type === "TEXT");
  if (fields.length >= 2) fields[1].characters = "VALIDÉ · 16 VARIANTES";
}
function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 3500));
  let card = index.children.find((entry) => entry.name === "Index · COMP-205 · Carrousel d'images du projet");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-205 · Carrousel d'images du projet";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 3250;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-205 · Carrousel d'images du projet", 28, 20, 900, 28, true, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 20 VARIANTES LARGES + 4 COMPACTES", 28, 65, 900, 14, true, COLORS.violet);
  plainText(card, "Description", "FR/EN · lecture, pause, erreur, focus et mouvement réduit ; médias mock à confirmer.", 28, 105, 1050, 16, false, COLORS.muted);
  plainText(card, "Page", "02.16 — Project Carousel", 1010, 65, 300, 15, true, COLORS.violet);
}
async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/link", "text/primary", "text/secondary", "border/default"]) variable("Semantic/Color", name);
  await figma.loadFontAsync(regularFont);
  await figma.loadFontAsync(boldFont);
}
async function main() {
  figma.notify("Préparation de COMP-205 Carrousel…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  function source(pageName, setName) {
    const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === pageName);
    const set = page && page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === setName);
    if (!set) throw new Error(`${setName} absent : générer les composants dépendants avant COMP-205`);
    return set;
  }
  const sources = {
    actionSet: source("02.1 — Action", "Action"),
    mediaSet: source("02.5 — Media Frame", "Media frame"),
    thumbnailSet: source("02.15 — Media Thumbnail", "Media thumbnail"),
  };
  requiredVariant(sources.actionSet, "Style=Control, State=Default");
  requiredVariant(sources.mediaSet, "Usage=Carousel, State=Loaded");
  requiredVariant(sources.thumbnailSet, "Selection=Current, Interaction=Default, Locale=FR");
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.16 — Project Carousel");
  if (!page) {
    page = figma.createPage();
    page.name = "02.16 — Project Carousel";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const wideExisting = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project carousel · Wide");
  const compactExisting = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Project carousel · Compact references");
  if (wideExisting || compactExisting) {
    if (!wideExisting || !compactExisting || wideExisting.children.length !== 20 || compactExisting.children.length !== 4) throw new Error("COMP-205 déjà présent ou modifié : arrêt sans remplacement");
    await refineExisting(page, wideExisting, compactExisting, sources.mediaSet);
    syncApprovedThumbnail(sources.thumbnailSet);
    updateIndex();
    figma.currentPage.selection = [wideExisting];
    figma.viewport.scrollAndZoomIntoView([wideExisting]);
    figma.closePlugin("COMP-205 corrigé · erreur et références compactes à revoir");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Project Carousel Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const wide = [];
  for (const state of WIDE_STATES) for (const locale of LOCALES) wide.push(await createVariant("Wide", locale, state, staging, sources));
  const wideSet = figma.combineAsVariants(wide, page);
  wideSet.name = "Project carousel · Wide";
  wideSet.description = "COMP-205 · Première passe à revoir. FR/EN × 10 états larges ; médias, nombre d'images et bouclage encore à confirmer.";
  wideSet.x = 170;
  wideSet.y = 440;
  for (const component of wide) {
    const locale = component.name.includes("Locale=FR") ? "FR" : "EN";
    const state = WIDE_STATES.find((entry) => component.name.includes(`State=${entry}`));
    component.x = LOCALES.indexOf(locale) * 1030;
    component.y = WIDE_STATES.indexOf(state) * 1010;
  }
  wideSet.resizeWithoutConstraints(1930, 10100);

  const compact = [];
  for (const state of COMPACT_STATES) for (const locale of LOCALES) compact.push(await createVariant("Compact", locale, state, staging, sources));
  const compactSet = figma.combineAsVariants(compact, page);
  compactSet.name = "Project carousel · Compact references";
  compactSet.description = "COMP-205 · Quatre références compactes à revoir, FR/EN × Ready/ReducedMotion. Reflow 320 px et zoom 200 % à vérifier en écran.";
  compactSet.x = 170;
  compactSet.y = 10780;
  for (const component of compact) {
    const locale = component.name.includes("Locale=FR") ? "FR" : "EN";
    const state = COMPACT_STATES.find((entry) => component.name.includes(`State=${entry}`));
    component.x = LOCALES.indexOf(locale) * 500;
    component.y = COMPACT_STATES.indexOf(state) * 790;
  }
  compactSet.resizeWithoutConstraints(875, 1580);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame(12520));
  previewSurface(page, 12200);
  syncApprovedThumbnail(sources.thumbnailSet);
  updateIndex();
  figma.currentPage.selection = [wideSet];
  figma.viewport.scrollAndZoomIntoView([wideSet]);
  figma.closePlugin("COMP-205 créé · 20 variantes larges et 4 références compactes à revoir");
}
main().catch((error) => {
  figma.notify(`Erreur Project Carousel Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
