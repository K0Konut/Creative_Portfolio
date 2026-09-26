const KINDS = [
  { name: "Info", tag: "INFORMATION", title: "À savoir", body: "Cette information complète le contenu sans interrompre la lecture.", surface: ["surface/info", "#E7E9FF"], accent: ["text/info", "#17105B"] },
  { name: "Empty", tag: "ÉTAT VIDE", title: "Aucun élément à afficher", body: "Cette section ne contient aucun élément.", surface: ["surface/subtle", "#E8E1D4"], accent: ["text/primary", "#101113"] },
  { name: "Error", tag: "ERREUR", title: "Un problème est survenu", body: "Le contenu n'a pas pu être chargé. Réessayez plus tard.", surface: ["surface/error", "#FDE7E2"], accent: ["text/error", "#8A1C12"] },
  { name: "Unavailable", tag: "INDISPONIBLE", title: "Ressource indisponible", body: "Cette ressource ne peut pas être ouverte pour le moment.", surface: ["surface/warning", "#FFF1C7"], accent: ["text/warning", "#6B4500"] },
  { name: "Success", tag: "CONFIRMATION", title: "Adresse copiée", body: "L'adresse est dans le presse-papiers.", surface: ["surface/success", "#DDF4E4"], accent: ["text/success", "#14532D"] },
];
const SIZES = ["Inline", "Section"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", violet: "#4B3CFF" };
const APPROVED_ICON_LINK_DESCRIPTION = "COMP-002 · 19 variantes Purpose × State validées par Costa le 2026-09-21. Label TEXT. Icônes déterminées par Purpose et State ; instances imbriquées échangeables individuellement. Contrat visuel COMP-001 Action, focus englobant icône et texte.";

let collections = [];
let variables = [];
let styles = new Map();
let font = { family: "Manrope", style: "Bold" };

function rgb(hex) {
  const value = hex.replace("#", "");
  return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
}

function solid(hex) {
  return { type: "SOLID", color: rgb(hex) };
}

function variable(collectionName, name) {
  const collection = collections.find((entry) => entry.name === collectionName);
  if (!collection) throw new Error(`Collection absente : ${collectionName}`);
  const token = variables.find((entry) => entry.variableCollectionId === collection.id && entry.name === name);
  if (!token) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return token;
}

function boundColor(name, fallback) {
  return figma.variables.setBoundVariableForPaint(solid(fallback), "color", variable("Semantic/Color", name));
}

function makeText(value, size, hex) {
  const node = figma.createText();
  node.fontName = font;
  node.characters = value;
  node.fontSize = size;
  node.lineHeight = { unit: "PERCENT", value: 120 };
  node.fills = [solid(hex)];
  node.textAutoResize = "HEIGHT";
  return node;
}

async function styledText(value, styleName, colorName, fallback) {
  const style = styles.get(styleName);
  const node = figma.createText();
  node.fontName = style.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(style.id);
  node.fills = [boundColor(colorName, fallback)];
  node.textAutoResize = "HEIGHT";
  return node;
}

async function createVariant(kind, size, parent) {
  const section = size === "Section";
  const component = figma.createComponent();
  component.name = `Kind=${kind.name}, Size=${size}`;
  parent.appendChild(component);
  component.resize(section ? 930 : 520, 160);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "MIN";
  component.counterAxisAlignItems = "MIN";
  component.paddingLeft = section ? 32 : 20;
  component.paddingRight = section ? 32 : 20;
  component.paddingTop = section ? 32 : 20;
  component.paddingBottom = section ? 32 : 20;
  component.itemSpacing = section ? 16 : 8;
  component.cornerRadius = 0;
  component.clipsContent = false;
  const space = section ? "space/8" : "space/5";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component.setBoundVariable(field, variable("Primitives/Space", space));
  }
  component.setBoundVariable("itemSpacing", variable("Primitives/Space", section ? "space/4" : "space/2"));
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/none"));
  component.fills = [boundColor(kind.surface[0], kind.surface[1])];
  component.strokes = [boundColor("border/strong", COLORS.ink)];
  component.strokeWeight = 1;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/control"));
  component.strokeAlign = "INSIDE";

  const tag = await styledText(kind.tag, "Type/Label/SM/Large", kind.accent[0], kind.accent[1]);
  tag.name = "Kind label";
  component.appendChild(tag);
  tag.layoutSizingHorizontal = "FILL";

  const title = await styledText(kind.title, section ? "Type/Heading/MD/Large" : "Type/Label/MD/Large", "text/primary", COLORS.ink);
  title.name = "Title";
  component.appendChild(title);
  title.layoutSizingHorizontal = "FILL";
  const titleKey = component.addComponentProperty("Title", "TEXT", kind.title);
  const showTitleKey = component.addComponentProperty("Show title", "BOOLEAN", true);
  title.componentPropertyReferences = { characters: titleKey, visible: showTitleKey };

  const body = await styledText(kind.body, section ? "Type/Body/MD/Large" : "Type/Body/MD/Compact", "text/primary", COLORS.ink);
  body.name = "Body";
  component.appendChild(body);
  body.layoutSizingHorizontal = "FILL";
  const bodyKey = component.addComponentProperty("Body", "TEXT", kind.body);
  body.componentPropertyReferences = { characters: bodyKey };
  component.description = `COMP-003 · ${kind.name} / ${size}. Texte exemple à localiser. Action réelle COMP-001 à composer au niveau de l'écran si nécessaire. Ne pas déplacer le focus automatiquement.`;
  return component;
}

function documentationFrame() {
  const frame = figma.createFrame();
  frame.name = "_Generated/Status Message · Documentation";
  frame.resize(1800, 220);
  frame.x = 0;
  frame.y = 0;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  const lines = [
    ["COMP-003 · DESIGN SYSTEM", 14, COLORS.violet, 48, 36],
    ["Message d'état", 42, COLORS.ink, 48, 68],
    ["Informer, expliquer ou confirmer sans masquer le contenu ni déplacer le focus. Exemples de contenu à revoir dans les écrans.", 18, COLORS.muted, 48, 132],
  ];
  for (const [value, size, hex, x, y] of lines) {
    const node = makeText(value, size, hex);
    node.x = x;
    node.y = y;
    frame.appendChild(node);
  }
  return frame;
}

function notesFrame() {
  const frame = figma.createFrame();
  frame.name = "_Generated/Status Message · Usage notes";
  frame.resize(1800, 300);
  frame.x = 0;
  frame.y = 1730;
  frame.fills = [solid(COLORS.subtle)];
  const notes = [
    "USAGE · Information, état vide, erreur, indisponibilité ou réussite réelle. Aucun état ne promet une ressource absente.",
    "ANATOMIE · Kind et Size en variantes ; Title et Body éditables ; titre facultatif. Le texte final dépend du contexte FR/EN.",
    "ACTION · Ajouter COMP-001 dans l'écran seulement avec une destination ou commande réelle. Aucune action factice dans ce set.",
    "ACCESSIBILITÉ · role=alert pour erreur urgente seulement ; succès de copie via status ; pas de déplacement automatique du focus.",
    "RESPONSIVE · Hauteur intrinsèque et texte reflué. Vérifier 320 px, 200 % de texte et les libellés français/anglais en contexte.",
    "MOTION · Apparition facultative, sans délai de lecture ; prefers-reduced-motion donne immédiatement le même message.",
  ];
  notes.forEach((value, index) => {
    const node = makeText(value, 15, COLORS.ink);
    node.x = 40;
    node.y = 24 + index * 43;
    frame.appendChild(node);
  });
  return frame;
}

function previewSurface(page) {
  const board = figma.createFrame();
  board.name = "_Generated/Status Message · Preview surface";
  board.resize(1800, 1380);
  board.x = 0;
  board.y = 300;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const [label, x] of [["INLINE", 185], ["SECTION", 765]]) {
    const node = makeText(label, 14, COLORS.violet);
    node.x = x;
    node.y = 345;
    page.appendChild(node);
  }
  KINDS.forEach((kind, index) => {
    const node = makeText(kind.name.toUpperCase(), 14, COLORS.ink);
    node.x = 32;
    node.y = 474 + index * 220;
    page.appendChild(node);
  });
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const [collection, name] of [
    ["Primitives/Space", "space/2"], ["Primitives/Space", "space/4"], ["Primitives/Space", "space/5"], ["Primitives/Space", "space/8"],
    ["Primitives/Shape", "radius/none"], ["Primitives/Shape", "stroke/control"],
    ["Semantic/Color", "border/strong"], ["Semantic/Color", "text/primary"],
  ]) variable(collection, name);
  for (const kind of KINDS) {
    variable("Semantic/Color", kind.surface[0]);
    variable("Semantic/Color", kind.accent[0]);
  }
  const localStyles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Label/SM/Large", "Type/Label/MD/Large", "Type/Heading/MD/Large", "Type/Body/MD/Compact", "Type/Body/MD/Large"]) {
    const style = localStyles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    styles.set(name, style);
  }
  const fontNames = new Map([...styles.values()].map((style) => [`${style.fontName.family}/${style.fontName.style}`, style.fontName]));
  for (const name of fontNames.values()) await figma.loadFontAsync(name);
  font = styles.get("Type/Label/MD/Large").fontName;
}

function expectedNames() {
  return KINDS.flatMap((kind) => SIZES.map((size) => `Kind=${kind.name}, Size=${size}`));
}

function repairExampleProperties(set) {
  const definitions = set.componentPropertyDefinitions;
  const propertyKey = (name) => Object.keys(definitions).find((key) => key.startsWith(`${name}#`));
  const kindPropertyNames = KINDS.flatMap((kind) => [`Title · ${kind.name}`, `Body · ${kind.name}`]);
  const migratedCount = kindPropertyNames.filter((name) => propertyKey(name)).length;
  if (migratedCount > 0) {
    if (migratedCount !== kindPropertyNames.length) throw new Error("Migration des propriétés de texte incomplète : contrôle manuel nécessaire");
    for (const kind of KINDS) {
      for (const size of SIZES) {
        const variant = set.children.find((entry) => entry.name === `Kind=${kind.name}, Size=${size}`);
        const title = variant && variant.children.find((entry) => entry.type === "TEXT" && entry.name === "Title");
        const body = variant && variant.children.find((entry) => entry.type === "TEXT" && entry.name === "Body");
        if (title?.componentPropertyReferences?.characters !== propertyKey(`Title · ${kind.name}`) ||
            body?.componentPropertyReferences?.characters !== propertyKey(`Body · ${kind.name}`)) {
          throw new Error(`Propriétés de texte ${kind.name}/${size} incohérentes : contrôle manuel nécessaire`);
        }
      }
    }
    return 0;
  }

  const rows = [];
  const oldTextKeys = new Set();
  const knownBodies = new Set([...KINDS.map((kind) => kind.body), "Le contenu attendu n'est pas disponible dans cette vue."]);
  for (const kind of KINDS) {
    for (const size of SIZES) {
      const variant = set.children.find((entry) => entry.name === `Kind=${kind.name}, Size=${size}`);
      const title = variant && variant.children.find((entry) => entry.type === "TEXT" && entry.name === "Title");
      const body = variant && variant.children.find((entry) => entry.type === "TEXT" && entry.name === "Body");
      const titleRef = title && title.componentPropertyReferences;
      const bodyRef = body && body.componentPropertyReferences;
      if (!titleRef?.characters || !bodyRef?.characters) throw new Error(`Propriétés de texte ${kind.name}/${size} absentes : arrêt sans modification`);
      if (title.characters !== kind.title || !knownBodies.has(body.characters)) {
        throw new Error(`Texte personnalisé sur ${kind.name}/${size} : arrêt pour ne pas l'écraser`);
      }
      oldTextKeys.add(titleRef.characters);
      oldTextKeys.add(bodyRef.characters);
      rows.push({ kind, title, body, visibilityRef: titleRef.visible });
    }
  }

  // Les propriétés TEXT homonymes sont partagées par le set : modifier l'une
  // d'elles propage sa valeur à tous les types. On les détache avant la copie.
  for (const row of rows) {
    row.title.componentPropertyReferences = row.visibilityRef ? { visible: row.visibilityRef } : {};
    row.body.componentPropertyReferences = {};
  }
  for (const row of rows) {
    row.title.characters = row.kind.title;
    row.body.characters = row.kind.body;
  }

  const keysByKind = new Map();
  for (const kind of KINDS) {
    keysByKind.set(kind.name, {
      title: set.addComponentProperty(`Title · ${kind.name}`, "TEXT", kind.title),
      body: set.addComponentProperty(`Body · ${kind.name}`, "TEXT", kind.body),
    });
  }
  for (const row of rows) {
    const keys = keysByKind.get(row.kind.name);
    row.title.componentPropertyReferences = { characters: keys.title, ...(row.visibilityRef ? { visible: row.visibilityRef } : {}) };
    row.body.componentPropertyReferences = { characters: keys.body };
  }
  for (const row of rows) {
    if (row.title.characters !== row.kind.title || row.body.characters !== row.kind.body) {
      throw new Error(`Texte ${row.kind.name} incohérent après réparation`);
    }
  }
  for (const key of oldTextKeys) {
    if (set.componentPropertyDefinitions[key]) set.deleteComponentProperty(key);
  }
  set.description = "COMP-003 · 10 variantes Kind × Size validées visuellement par Costa le 2026-09-21. Title et Body éditables par type, sans propagation entre types ; Show title facultatif. Exemples localisables, sans action fictive.";
  return rows.length;
}

function syncApprovedIconLink(iconLinkSet) {
  iconLinkSet.description = APPROVED_ICON_LINK_DESCRIPTION;
  const indexPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = indexPage && indexPage.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  const card = index.children.find((entry) => entry.name === "Index · COMP-002 · Lien avec icône");
  if (!card) return;
  const texts = card.children.filter((entry) => entry.type === "TEXT");
  if (texts.length >= 4) {
    texts[1].characters = "VALIDÉ · 19 VARIANTES";
    texts[2].characters = "Quatre usages et 19 états approuvés ; icône liée à Purpose et State.";
    texts[3].characters = "02.3 — Icon Link";
  }
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  if (!page) return;
  const index = page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 1060));
  let card = index.children.find((entry) => entry.name === "Index · COMP-003 · Message d'état");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-003 · Message d'état";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 838;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  for (const [value, size, hex, x, y] of [
    ["COMP-003 · Message d'état", 28, COLORS.ink, 28, 20],
    ["VALIDÉ · 10 VARIANTES", 14, COLORS.violet, 28, 65],
    ["Cinq types de message, formats inline et section ; textes de revue à contextualiser.", 16, COLORS.muted, 28, 105],
    ["02.4 — Status Message", 16, COLORS.violet, 940, 65],
  ]) {
    const node = makeText(value, size, hex);
    node.x = x;
    node.y = y;
    card.appendChild(node);
  }
}

async function main() {
  figma.notify("Préparation de COMP-003 Message d'état…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const actionPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.1 — Action");
  const action = actionPage && actionPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Action");
  if (!action || action.children.length !== 20) throw new Error("Action validé absent ou incomplet");
  const iconLinkPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.3 — Icon Link");
  const iconLink = iconLinkPage && iconLinkPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Icon link");
  if (!iconLink || iconLink.children.length !== 19) throw new Error("Lien avec icône validé absent ou incomplet");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message");
  if (!page) {
    page = figma.createPage();
    page.name = "02.4 — Status Message";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message");
  if (existing) {
    const actual = existing.children.map((entry) => entry.name);
    const expected = expectedNames();
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Status message incomplet ou altéré (${actual.length}/10) : arrêt sans remplacement`);
    }
    const repaired = repairExampleProperties(existing);
    existing.description = "COMP-003 · 10 variantes Kind × Size validées visuellement par Costa le 2026-09-21. Title et Body éditables par type, sans propagation entre types ; Show title facultatif. Exemples localisables, sans action fictive.";
    syncApprovedIconLink(iconLink);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin(`COMP-003 préservé · ${repaired} variante(s) réparée(s)`);
    return;
  }

  const stale = page.children.find((entry) => entry.name === "_Generated/Status Message Draft");
  if (stale) stale.remove();
  const staging = figma.createFrame();
  staging.name = "_Generated/Status Message Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const kind of KINDS) {
    for (const size of SIZES) components.push(await createVariant(kind, size, staging));
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Status message";
  repairExampleProperties(set);
  set.x = 150;
  set.y = 420;
  components.forEach((component, index) => {
    component.x = 24 + (index % 2) * 576;
    component.y = 24 + Math.floor(index / 2) * 220;
  });
  set.resizeWithoutConstraints(1580, 1160);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncApprovedIconLink(iconLink);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-003 créé · 10 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Status Message Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
