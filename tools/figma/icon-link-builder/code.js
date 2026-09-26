const PURPOSES = [
  { name: "External", icon: "ExternalLink", label: "Ouvrir le projet" },
  { name: "Email", icon: "Mail", label: "Envoyer un email" },
  { name: "Copy", icon: "Copy", label: "Copier l'adresse" },
  { name: "Download", icon: "Download", label: "Télécharger le CV" },
];
const STATES = ["Default", "Hover", "Focus", "Active"];
const COPY_EXTRA = ["Disabled", "Success", "Error"];
const ICON_MAPPING_NOTE = "Icônes déterminées par Purpose et State ; instances imbriquées échangeables individuellement.";
const APPROVED_DESCRIPTION = `COMP-002 · 19 variantes Purpose × State validées par Costa le 2026-09-21. Label TEXT. ${ICON_MAPPING_NOTE} Contrat visuel COMP-001 Action, focus englobant icône et texte.`;
const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  muted: "#474747",
  violet: "#4B3CFF",
  errorSurface: "#FDE7E2",
  errorText: "#8A1C12",
  successSurface: "#DDF4E4",
  successText: "#14532D",
};

let collections = [];
let variables = [];
let font = { family: "Manrope", style: "Bold" };

function rgb(hex) {
  const value = hex.replace("#", "");
  return { r: parseInt(value.slice(0, 2), 16) / 255, g: parseInt(value.slice(2, 4), 16) / 255, b: parseInt(value.slice(4, 6), 16) / 255 };
}

function solid(hex) {
  return { type: "SOLID", color: rgb(hex) };
}

function variable(collectionName, name) {
  const collection = collections.find((item) => item.name === collectionName);
  if (!collection) throw new Error(`Collection absente : ${collectionName}`);
  const token = variables.find((item) => item.variableCollectionId === collection.id && item.name === name);
  if (!token) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return token;
}

function color(name, hex) {
  return figma.variables.setBoundVariableForPaint(solid(hex), "color", variable("Semantic/Color", name));
}

function appearance(state) {
  if (state === "Disabled") return { surface: ["surface/disabled", COLORS.subtle], text: ["text/disabled", COLORS.muted], border: ["border/default", "#827E76"] };
  if (state === "Success") return { surface: ["surface/success", COLORS.successSurface], text: ["text/success", COLORS.successText], border: ["border/strong", COLORS.ink] };
  if (state === "Error") return { surface: ["surface/error", COLORS.errorSurface], text: ["text/error", COLORS.errorText], border: ["border/strong", COLORS.ink] };
  if (state === "Hover" || state === "Active") return { surface: ["surface/subtle", COLORS.subtle], text: ["text/primary", COLORS.ink], border: ["border/strong", COLORS.ink] };
  return { surface: ["surface/canvas", COLORS.canvas], text: ["text/primary", COLORS.ink], border: ["border/strong", COLORS.ink] };
}

function iconNameForVariant(variantName) {
  const match = /^Purpose=(External|Email|Copy|Download), State=(Default|Hover|Focus|Active|Disabled|Success|Error)$/.exec(variantName);
  if (!match) throw new Error(`Variante non reconnue : ${variantName}`);
  const [, purposeName, state] = match;
  if (state === "Success") return "Check";
  if (state === "Error") return "Alert";
  const purpose = PURPOSES.find((entry) => entry.name === purposeName);
  return purpose.icon;
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

function addFocus(component) {
  component.strokes = [color("focus/inner", COLORS.canvas)];
  component.strokeWeight = 2;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/focus-inner"));
  component.strokeAlign = "OUTSIDE";
  const outer = figma.createRectangle();
  outer.name = "Focus outer ring";
  component.appendChild(outer);
  outer.layoutPositioning = "ABSOLUTE";
  outer.resize(component.width + 4, component.height + 4);
  outer.x = -2;
  outer.y = -2;
  outer.cornerRadius = 10;
  outer.fills = [];
  outer.strokes = [color("focus/outer", COLORS.ink)];
  outer.strokeWeight = 2;
  outer.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/focus-outer"));
  outer.strokeAlign = "OUTSIDE";
}

function bindIconColor(instance, name) {
  const nodes = instance.findAll((node) => "fills" in node || "strokes" in node);
  for (const node of nodes) {
    if ("fills" in node && Array.isArray(node.fills) && node.fills.length) {
      node.fills = node.fills.map((paint) => paint.type === "SOLID"
        ? figma.variables.setBoundVariableForPaint(paint, "color", variable("Semantic/Color", name))
        : paint);
    }
    if ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length) {
      node.strokes = node.strokes.map((paint) => paint.type === "SOLID"
        ? figma.variables.setBoundVariableForPaint(paint, "color", variable("Semantic/Color", name))
        : paint);
    }
  }
}

async function createVariant(purpose, state, parent, icons, labelStyle) {
  const spec = appearance(state);
  const iconName = iconNameForVariant(`Purpose=${purpose.name}, State=${state}`);
  const labelText = state === "Success" ? "Adresse copiée" : state === "Error" ? "Copie impossible" : purpose.label;
  const component = figma.createComponent();
  component.name = `Purpose=${purpose.name}, State=${state}`;
  parent.appendChild(component);
  component.resize(270, 48);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = 20;
  component.paddingRight = 20;
  component.paddingTop = 12;
  component.paddingBottom = 12;
  component.itemSpacing = 8;
  component.minHeight = 48;
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.setBoundVariable("paddingLeft", variable("Primitives/Space", "space/5"));
  component.setBoundVariable("paddingRight", variable("Primitives/Space", "space/5"));
  component.setBoundVariable("paddingTop", variable("Primitives/Space", "space/3"));
  component.setBoundVariable("paddingBottom", variable("Primitives/Space", "space/3"));
  component.setBoundVariable("itemSpacing", variable("Semantic/Space/Large", "gap/icon-label"));
  component.setBoundVariable("minHeight", variable("Primitives/Size", "control/standard"));
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/control"));
  component.fills = [color(spec.surface[0], spec.surface[1])];
  component.strokes = [color(spec.border[0], spec.border[1])];
  component.strokeWeight = state === "Active" ? 2 : 1;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", state === "Active" ? "stroke/emphasis" : "stroke/control"));
  component.strokeAlign = "OUTSIDE";

  const icon = icons.get(iconName).createInstance();
  icon.name = `Icon · ${iconName}`;
  component.appendChild(icon);
  if (spec.text[0] !== "text/primary") bindIconColor(icon, spec.text[0]);

  const label = makeText(labelText, 16, spec.text[1]);
  label.name = "Label";
  component.appendChild(label);
  await label.setTextStyleIdAsync(labelStyle.id);
  label.fills = [color(spec.text[0], spec.text[1])];
  const labelKey = component.addComponentProperty("Label", "TEXT", labelText);
  label.componentPropertyReferences = { characters: labelKey };
  if (state === "Focus") addFocus(component);
  component.description = `COMP-002 · ${purpose.name} / ${state}. Cible 48 px, icône décorative si le libellé est explicite. ${purpose.name === "Copy" ? "Bouton natif ; annoncer le résultat de copie." : "Lien natif avec destination réelle ; retirer le lien si elle manque."}`;
  return component;
}

function documentationFrame() {
  const frame = figma.createFrame();
  frame.name = "_Generated/Icon Link · Documentation";
  frame.resize(1600, 220);
  frame.x = 0;
  frame.y = 0;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  const lines = [
    ["COMP-002 · DESIGN SYSTEM", 14, COLORS.violet, 48, 36],
    ["Lien avec icône", 42, COLORS.ink, 48, 68],
    ["Une icône fonctionnelle et un libellé dans la même cible. Liens réels et commande de copie, avec retour visible.", 18, COLORS.muted, 48, 132],
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
  frame.name = "_Generated/Icon Link · Usage notes";
  frame.resize(1600, 300);
  frame.x = 0;
  frame.y = 1150;
  frame.fills = [solid(COLORS.subtle)];
  const notes = [
    "USAGE · Lien externe, mailto et téléchargement : destination réelle obligatoire. Copie : bouton natif. Aucun lien factice disabled.",
    "ANATOMIE · Icône 20 px choisie par usage/état, libellé modifiable, espacement 8 px, cible de 48 px et rayon 8 px.",
    "ACCESSIBILITÉ · Focus bicolore de 4 px autour de l'ensemble. L'icône est décorative si le texte porte le sens.",
    "RETOUR · Success et Error concernent la copie ; annoncer le résultat sans déplacer le focus, et laisser l'adresse sélectionnable.",
    "MOTION · Couleur et bordure : 120 ms. État direct avec prefers-reduced-motion ; aucune translation de la cible.",
    "RESPONSIVE · Le libellé FR/EN reste visible et peut s'étendre ; vérifier le reflow sur les écrans réels.",
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
  board.name = "_Generated/Icon Link · Preview surface";
  board.resize(1600, 770);
  board.x = 0;
  board.y = 300;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  STATES.forEach((state, index) => {
    const node = makeText(state.toUpperCase(), 14, COLORS.violet);
    node.name = `_Generated/Icon Link · State ${state}`;
    node.x = 210 + index * 310;
    node.y = 340;
    page.appendChild(node);
  });
  PURPOSES.forEach((purpose, index) => {
    const node = makeText(purpose.name.toUpperCase(), 14, COLORS.ink);
    node.name = `_Generated/Icon Link · Purpose ${purpose.name}`;
    node.x = 40;
    node.y = 438 + index * 105;
    page.appendChild(node);
  });
  const extra = makeText("COPIE · ÉTATS ADDITIONNELS", 14, COLORS.violet);
  extra.name = "_Generated/Icon Link · Copy extra label";
  extra.x = 40;
  extra.y = 810;
  page.appendChild(extra);
}

function positionReview(page, set) {
  set.x = 180;
  set.y = 400;
  const board = page.children.find((entry) => entry.name === "_Generated/Icon Link · Preview surface");
  if (board) {
    board.resize(1600, 770);
    board.x = 0;
    board.y = 300;
  }
  const notes = page.children.find((entry) => entry.name === "_Generated/Icon Link · Usage notes");
  if (notes) {
    notes.y = 1150;
    const anatomy = notes.children.find((entry) => entry.type === "TEXT" && entry.characters.startsWith("ANATOMIE ·"));
    if (anatomy) anatomy.characters = "ANATOMIE · Icône 20 px choisie par usage/état, libellé modifiable, espacement 8 px, cible de 48 px et rayon 8 px.";
  }
  for (let index = 0; index < STATES.length; index++) {
    const label = page.children.find((entry) => entry.name === `_Generated/Icon Link · State ${STATES[index]}`);
    if (label) label.y = 340;
  }
  for (let index = 0; index < PURPOSES.length; index++) {
    const label = page.children.find((entry) => entry.name === `_Generated/Icon Link · Purpose ${PURPOSES[index].name}`);
    if (label) label.y = 438 + index * 105;
  }
  const extra = page.children.find((entry) => entry.name === "_Generated/Icon Link · Copy extra label"
    || entry.type === "TEXT" && entry.characters === "COPIE · ÉTATS ADDITIONNELS");
  if (extra) {
    extra.name = "_Generated/Icon Link · Copy extra label";
    extra.y = 810;
  }
}

function iconLayer(component) {
  const icon = component.children.find((entry) => entry.type === "INSTANCE" && entry.name.startsWith("Icon ·"));
  if (!icon) throw new Error(`Instance d'icône absente dans ${component.name} : arrêt sans remplacement`);
  return icon;
}

async function verifyIconSources(set, icons) {
  for (const component of set.children) {
    const expectedName = iconNameForVariant(component.name);
    const main = await iconLayer(component).getMainComponentAsync();
    if (!main || main.id !== icons.get(expectedName).id) {
      throw new Error(`Icône incorrecte dans ${component.name} : ${expectedName} attendu`);
    }
  }
}

async function repairExisting(page, set, icons) {
  const referencedIconKeys = new Set(set.children
    .map((component) => iconLayer(component).componentPropertyReferences?.mainComponent)
    .filter(Boolean));
  const iconProperties = Object.entries(set.componentPropertyDefinitions)
    .filter(([name, definition]) => definition.type === "INSTANCE_SWAP"
      && (referencedIconKeys.has(name) || name === "Icon" || name.startsWith("Icon#")))
    .map(([name]) => name);
  let needsRepair = iconProperties.length > 0 || referencedIconKeys.size > 0;
  for (const component of set.children) {
    const expectedName = iconNameForVariant(component.name);
    const main = await iconLayer(component).getMainComponentAsync();
    if (!main || main.id !== icons.get(expectedName).id) needsRepair = true;
  }
  if (!needsRepair) return false;

  for (const component of set.children) {
    const icon = iconLayer(component);
    const references = icon.componentPropertyReferences;
    if (references && references.mainComponent) {
      const otherReferences = { ...references };
      delete otherReferences.mainComponent;
      icon.componentPropertyReferences = otherReferences;
    }
  }
  for (const name of iconProperties) set.deleteComponentProperty(name);

  for (const component of set.children) {
    const icon = iconLayer(component);
    const expectedName = iconNameForVariant(component.name);
    icon.mainComponent = icons.get(expectedName);
    icon.name = `Icon · ${expectedName}`;
    const state = component.name.split("State=")[1];
    const spec = appearance(state);
    if (spec.text[0] !== "text/primary") bindIconColor(icon, spec.text[0]);
  }
  await verifyIconSources(set, icons);
  for (const component of set.children) {
    if (iconLayer(component).componentPropertyReferences?.mainComponent) {
      throw new Error(`Ancienne propriété Icon encore liée dans ${component.name}`);
    }
  }
  positionReview(page, set);
  set.description = `COMP-002 · À valider. 19 variantes Purpose × State ; Label TEXT. ${ICON_MAPPING_NOTE} Contrat visuel COMP-001 Action, focus englobant icône et texte.`;
  return true;
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  const required = [
    ["Primitives/Space", "space/3"], ["Primitives/Space", "space/5"],
    ["Semantic/Space/Large", "gap/icon-label"],
    ["Primitives/Size", "control/standard"], ["Primitives/Shape", "radius/control"],
    ["Primitives/Shape", "stroke/control"], ["Primitives/Shape", "stroke/emphasis"],
    ["Primitives/Shape", "stroke/focus-inner"], ["Primitives/Shape", "stroke/focus-outer"],
    ["Semantic/Color", "focus/inner"], ["Semantic/Color", "focus/outer"],
  ];
  for (const state of [...STATES, ...COPY_EXTRA]) {
    const spec = appearance(state);
    required.push(["Semantic/Color", spec.surface[0]], ["Semantic/Color", spec.text[0]], ["Semantic/Color", spec.border[0]]);
  }
  required.forEach(([collection, name]) => variable(collection, name));
  for (const name of ["text/primary", "text/disabled", "text/success", "text/error"]) {
    const token = variable("Semantic/Color", name);
    token.scopes = Array.from(new Set([...token.scopes, "TEXT_FILL", "STROKE_COLOR", "SHAPE_FILL"]));
  }
  const labelStyle = (await figma.getLocalTextStylesAsync()).find((style) => style.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  font = labelStyle.fontName;
  await figma.loadFontAsync(font);
  return labelStyle;
}

function expectedNames() {
  return PURPOSES.flatMap((purpose) => STATES.map((state) => `Purpose=${purpose.name}, State=${state}`))
    .concat(COPY_EXTRA.map((state) => `Purpose=Copy, State=${state}`));
}

function syncIconApproval(iconPage, iconSet) {
  iconSet.description = "8 icônes fonctionnelles approuvées par Costa le 2026-09-21. Variante Name ; taille icon/md 20 px ; couleur liée à text/primary.";
  const notes = iconPage.children.find((entry) => entry.name === "_Generated/Icons · Usage notes");
  const nextStep = notes && notes.children.find((entry) => entry.type === "TEXT" && entry.characters.startsWith("SUITE ·"));
  if (nextStep) nextStep.characters = "SUITE · Set validé par Costa le 2026-09-21. Assembler COMP-002 Lien avec icône ; les autres pictogrammes suivront leurs consommateurs.";
}

function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  if (!page) return;
  const index = page.children.find((entry) => entry.name === "_Generated/Components index");
  const icons = index && index.children.find((entry) => entry.name === "Index · Functional icon");
  if (icons) {
    const fields = icons.children.filter((entry) => entry.type === "TEXT");
    if (fields.length >= 4) {
      fields[1].characters = "VALIDÉ · 8 VARIANTES";
      fields[2].characters = "Première tranche d'icônes vectorielles approuvée pour les actions et les liens avec icône.";
    }
  }
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-002 · Lien avec icône");
  if (!card) return;
  const replacements = new Map([
    ["À CONSTRUIRE", "VALIDÉ · 19 VARIANTES"],
    ["À VALIDER · 19 VARIANTES", "VALIDÉ · 19 VARIANTES"],
    ["Page dédiée à venir", "02.3 — Icon Link"],
    ["Dépend de la validation des icônes et réutilise COMP-001 Action.", "Quatre usages et 19 états approuvés ; icône liée à Purpose et State."],
    ["Contrôle avec icône et libellé ; quatre usages, états interactifs et retour de copie à revoir.", "Quatre usages et 19 états approuvés ; icône liée à Purpose et State."],
  ]);
  for (const node of card.children) {
    if (node.type === "TEXT" && replacements.has(node.characters)) node.characters = replacements.get(node.characters);
  }
}

async function main() {
  figma.notify("Préparation de COMP-002 Lien avec icône…", { timeout: 3000 });
  const labelStyle = await prepare();
  await figma.loadAllPagesAsync();
  const actionPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.1 — Action");
  const action = actionPage && actionPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Action");
  if (!action || action.children.length !== 20) throw new Error("Action validé introuvable ou incomplet : relancer Action Builder");
  const iconPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.2 — Functional Icons");
  const iconSet = iconPage && iconPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Functional icon");
  if (!iconSet) throw new Error("Set Functional icon absent : relancer Functional Icons Builder");
  const icons = new Map(iconSet.children.filter((entry) => entry.type === "COMPONENT").map((entry) => [entry.name.replace("Name=", ""), entry]));
  for (const name of ["ExternalLink", "Mail", "Copy", "Download", "Check", "Alert"]) {
    if (!icons.has(name)) throw new Error(`Icône ${name} absente : relancer Functional Icons Builder`);
  }

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.3 — Icon Link");
  if (!page) {
    page = figma.createPage();
    page.name = "02.3 — Icon Link";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Icon link");
  if (existing) {
    const actual = existing.children.map((entry) => entry.name);
    const expected = expectedNames();
    if (actual.length !== expected.length || expected.some((name) => !actual.includes(name))) {
      throw new Error(`Set Icon link incomplet ou altéré (${actual.length}/19) : arrêt sans remplacement`);
    }
    const repaired = await repairExisting(page, existing, icons);
    existing.description = APPROVED_DESCRIPTION;
    syncIconApproval(iconPage, iconSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin(repaired ? "COMP-002 corrigé · icônes par usage à revoir" : "COMP-002 déjà corrigé · 19 variantes préservées");
    return;
  }

  const stale = page.children.find((entry) => entry.name === "_Generated/Icon Link Draft");
  if (stale) stale.remove();
  const staging = figma.createFrame();
  staging.name = "_Generated/Icon Link Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const purpose of PURPOSES) {
    for (const state of STATES) components.push(await createVariant(purpose, state, staging, icons, labelStyle));
  }
  for (const state of COPY_EXTRA) components.push(await createVariant(PURPOSES[2], state, staging, icons, labelStyle));
  const set = figma.combineAsVariants(components, page);
  set.name = "Icon link";
  set.description = `COMP-002 · À valider. Lien externe, email et téléchargement ; bouton de copie avec Disabled, Success et Error. 19 variantes ; Label TEXT. ${ICON_MAPPING_NOTE} Contrat visuel COMP-001 Action, focus englobant icône et texte.`;
  set.x = 180;
  set.y = 400;
  components.forEach((component, index) => {
    const row = index < 16 ? Math.floor(index / 4) : 4;
    const column = index < 16 ? index % 4 : index - 16;
    component.x = 24 + column * 310;
    component.y = 24 + row * 105;
  });
  set.resizeWithoutConstraints(1320, 570);
  await verifyIconSources(set, icons);
  staging.remove();
  page.appendChild(documentationFrame());
  page.appendChild(notesFrame());
  previewSurface(page);
  syncIconApproval(iconPage, iconSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-002 créé · 19 variantes à revoir dans Figma");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Icon Link Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
