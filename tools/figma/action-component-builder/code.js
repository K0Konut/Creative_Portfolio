const COLLECTIONS = {
  semanticColor: "Semantic/Color",
  space: "Primitives/Space",
  size: "Primitives/Size",
  shape: "Primitives/Shape",
};

const STYLES = ["Primary", "Secondary", "Text", "Control"];
const STATES = ["Default", "Hover", "Focus", "Active", "Disabled"];
const LABELS = {
  Primary: "Voir les projets",
  Secondary: "Découvrir le projet",
  Text: "À propos",
  Control: "Précédent",
};
const ACTION_DESCRIPTION = "COMP-001 · Action V1, taille standard. Style × State, 20 variantes et rayon de 8 px validés par Costa le 2026-09-21. Libellé éditable ; variante avec icône après validation du set fonctionnel.";

const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  violet: "#4B3CFF",
  violetHover: "#3D2EE8",
  violetActive: "#17105B",
  lime: "#C7FF00",
  limeHover: "#B0E600",
  limeActive: "#98CC00",
  ink: "#101113",
  muted: "#474747",
  border: "#827E76",
};

let collections = [];
let variables = [];
let textStyles = [];
let font = { family: "Manrope", style: "Bold" };

function rgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function solid(hex, opacity = 1) {
  return { type: "SOLID", color: rgb(hex), opacity };
}

function variable(collectionName, name) {
  const collection = collections.find((entry) => entry.name === collectionName);
  if (!collection) throw new Error(`Collection absente : ${collectionName}`);
  const value = variables.find((entry) => entry.variableCollectionId === collection.id && entry.name === name);
  if (!value) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return value;
}

function bindPaint(collectionName, name, hex) {
  return figma.variables.setBoundVariableForPaint(solid(hex), "color", variable(collectionName, name));
}

function setFill(node, name, hex) {
  node.fills = [bindPaint(COLLECTIONS.semanticColor, name, hex)];
}

function setStroke(node, name, hex, weightToken) {
  node.strokes = [bindPaint(COLLECTIONS.semanticColor, name, hex)];
  node.strokeWeight = weightToken === "stroke/focus-inner" ? 2 : weightToken === "stroke/emphasis" ? 2 : 1;
  node.setBoundVariable("strokeWeight", variable(COLLECTIONS.shape, weightToken));
  node.strokeAlign = "OUTSIDE";
}

function ensureFocusOuterRing(component) {
  let ring = component.children.find((entry) => entry.name === "Focus outer ring");
  if (!ring) {
    ring = figma.createRectangle();
    ring.name = "Focus outer ring";
    component.appendChild(ring);
  }
  ring.layoutPositioning = "ABSOLUTE";
  ring.resize(component.width + 4, component.height + 4);
  ring.x = -2;
  ring.y = -2;
  ring.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
  ring.cornerRadius = 10;
  ring.fills = [];
  ring.strokes = [bindPaint(COLLECTIONS.semanticColor, "focus/outer", COLORS.ink)];
  ring.strokeWeight = 2;
  ring.setBoundVariable("strokeWeight", variable(COLLECTIONS.shape, "stroke/focus-outer"));
  ring.strokeAlign = "OUTSIDE";
  component.effects = [];
}

function makeText(value, size, color) {
  const text = figma.createText();
  text.fontName = font;
  text.characters = value;
  text.fontSize = size;
  text.lineHeight = { unit: "PERCENT", value: 120 };
  text.fills = [solid(color)];
  text.textAutoResize = "HEIGHT";
  return text;
}

function styleFor(styleName, state) {
  if (state === "Disabled") {
    return {
      fill: styleName === "Text" ? null : ["surface/disabled", COLORS.subtle],
      text: ["text/disabled", COLORS.muted],
      border: styleName === "Text" ? null : ["border/default", COLORS.border],
    };
  }
  if (styleName === "Primary") {
    const fills = {
      Default: ["surface/action-primary", COLORS.lime],
      Hover: ["surface/action-primary-hover", COLORS.limeHover],
      Focus: ["surface/action-primary", COLORS.lime],
      Active: ["surface/action-primary-active", COLORS.limeActive],
    };
    return { fill: fills[state], text: ["text/on-accent", COLORS.ink], border: ["border/strong", COLORS.ink] };
  }
  if (styleName === "Secondary") {
    const fills = {
      Default: ["surface/action-secondary", COLORS.violet],
      Hover: ["surface/action-secondary-hover", COLORS.violetHover],
      Focus: ["surface/action-secondary", COLORS.violet],
      Active: ["surface/action-secondary-active", COLORS.violetActive],
    };
    return { fill: fills[state], text: ["text/on-brand", COLORS.canvas], border: ["border/inverse", COLORS.canvas] };
  }
  if (styleName === "Text") {
    return {
      fill: null,
      text: state === "Default" ? ["text/link", COLORS.violet] : ["text/link-active", COLORS.violetActive],
      border: null,
    };
  }
  return {
    fill: state === "Hover" || state === "Active" ? ["surface/subtle", COLORS.subtle] : ["surface/canvas", COLORS.canvas],
    text: ["text/primary", COLORS.ink],
    border: ["border/strong", COLORS.ink],
  };
}

async function createActionVariant(styleName, state, parent, labelTextStyle) {
  const appearance = styleFor(styleName, state);
  const component = figma.createComponent();
  component.name = `Style=${styleName}, State=${state}`;
  parent.appendChild(component);
  component.resize(224, 48);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.primaryAxisAlignItems = "CENTER";
  component.counterAxisAlignItems = "CENTER";
  component.paddingLeft = 20;
  component.paddingRight = 20;
  component.paddingTop = 12;
  component.paddingBottom = 12;
  component.minHeight = 48;
  component.itemSpacing = 8;
  component.cornerRadius = 8;
  component.clipsContent = false;
  component.setBoundVariable("paddingLeft", variable(COLLECTIONS.space, "space/5"));
  component.setBoundVariable("paddingRight", variable(COLLECTIONS.space, "space/5"));
  component.setBoundVariable("paddingTop", variable(COLLECTIONS.space, "space/3"));
  component.setBoundVariable("paddingBottom", variable(COLLECTIONS.space, "space/3"));
  component.setBoundVariable("itemSpacing", variable(COLLECTIONS.space, "space/2"));
  component.setBoundVariable("minHeight", variable(COLLECTIONS.size, "control/standard"));
  component.setBoundVariable("cornerRadius", variable(COLLECTIONS.shape, "radius/control"));

  if (appearance.fill) {
    setFill(component, appearance.fill[0], appearance.fill[1]);
  } else {
    component.fills = [];
  }
  if (appearance.border) {
    setStroke(component, appearance.border[0], appearance.border[1], state === "Active" && styleName === "Control" ? "stroke/emphasis" : "stroke/control");
  } else {
    component.strokes = [];
  }

  if (state === "Focus") {
    setStroke(component, "focus/inner", COLORS.canvas, "stroke/focus-inner");
  }

  const label = makeText(LABELS[styleName], 16, appearance.text[1]);
  label.name = "Label";
  component.appendChild(label);
  await label.setTextStyleIdAsync(labelTextStyle.id);
  label.fills = [bindPaint(COLLECTIONS.semanticColor, appearance.text[0], appearance.text[1])];
  if (styleName === "Text" && state !== "Disabled") label.textDecoration = "UNDERLINE";
  const labelKey = component.addComponentProperty("Label", "TEXT", LABELS[styleName]);
  label.componentPropertyReferences = { characters: labelKey };
  if (state === "Focus") ensureFocusOuterRing(component);
  component.description = `COMP-001 · Action ${styleName} / ${state}. Libellé obligatoire. Élément HTML : lien pour une destination, bouton pour une action. Focus immédiat, réduction du mouvement respectée.`;
  return component;
}

function documentationFrame() {
  const frame = figma.createFrame();
  frame.name = "_Generated/Action · Documentation";
  frame.resize(1600, 220);
  frame.x = 0;
  frame.y = 0;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  const kicker = makeText("COMP-001 · DESIGN SYSTEM", 14, COLORS.violet);
  kicker.name = "Kicker";
  kicker.x = 48;
  kicker.y = 36;
  frame.appendChild(kicker);
  const title = makeText("Action", 42, COLORS.ink);
  title.name = "Title";
  title.x = 48;
  title.y = 68;
  frame.appendChild(title);
  const description = makeText("Une cible claire, un libellé explicite, un état visible. Principal, secondaire, textuel ou contrôle selon la hiérarchie de la page.", 18, COLORS.muted);
  description.name = "Description";
  description.x = 48;
  description.y = 132;
  frame.appendChild(description);
  return frame;
}

function noteFrame() {
  const frame = figma.createFrame();
  frame.name = "_Generated/Action · Usage notes";
  frame.resize(1600, 260);
  frame.x = 0;
  frame.y = 860;
  frame.fills = [solid(COLORS.subtle)];
  const lines = [
    "USAGE · Une seule action principale dominante par contexte. Le lien sans destination réelle est retiré, jamais simulé comme disabled.",
    "ANATOMIE · Libellé éditable obligatoire ; coins adoucis de 8 px. L'icône facultative sera reliée au set d'icônes dans une itération dédiée.",
    "ACCESSIBILITÉ · Cible de 48 px minimum ; focus bicolore crème + sombre de 4 px, visible immédiatement et non coupé.",
    "MOTION · Couleur et bordure : 120 ms. Aucun déplacement de la cible. Avec prefers-reduced-motion, état direct.",
    "RESPONSIVE · Libellé non tronqué, contenu FR/EN à contrôler. La variante compacte attend un besoin vérifié dans les écrans.",
  ];
  lines.forEach((line, index) => {
    const text = makeText(line, 16, COLORS.ink);
    text.name = `Note ${index + 1}`;
    text.resize(1500, 32);
    text.x = 40;
    text.y = 24 + index * 42;
    frame.appendChild(text);
  });
  return frame;
}

function ensurePreviewSurface(page) {
  let frame = page.children.find((entry) => entry.name === "_Generated/Action · Preview surface");
  if (!frame) {
    frame = figma.createFrame();
    frame.name = "_Generated/Action · Preview surface";
  }
  frame.resize(1600, 570);
  frame.x = 0;
  frame.y = 250;
  setFill(frame, "surface/canvas", COLORS.canvas);
  frame.strokes = [bindPaint(COLLECTIONS.semanticColor, "border/strong", COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
}

function ensureGridLabels(page) {
  STATES.forEach((state, index) => {
    const name = `_Generated/Action · State ${state}`;
    let label = page.children.find((entry) => entry.name === name);
    if (!label) {
      label = makeText(state.toUpperCase(), 14, COLORS.violet);
      label.name = name;
      page.appendChild(label);
    }
    label.x = 260 + index * 260;
    label.y = 290;
  });
  STYLES.forEach((styleName, index) => {
    const name = `_Generated/Action · Style ${styleName}`;
    let label = page.children.find((entry) => entry.name === name);
    if (!label) {
      label = makeText(styleName.toUpperCase(), 14, COLORS.ink);
      label.name = name;
      page.appendChild(label);
    }
    label.x = 48;
    label.y = 340 + index * 105;
  });
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  textStyles = await figma.getLocalTextStylesAsync();
  const required = [
    [COLLECTIONS.semanticColor, "focus/inner"],
    [COLLECTIONS.semanticColor, "focus/outer"],
    [COLLECTIONS.space, "space/2"],
    [COLLECTIONS.space, "space/3"],
    [COLLECTIONS.space, "space/5"],
    [COLLECTIONS.size, "control/standard"],
    [COLLECTIONS.shape, "radius/control"],
    [COLLECTIONS.shape, "stroke/control"],
    [COLLECTIONS.shape, "stroke/emphasis"],
    [COLLECTIONS.shape, "stroke/focus-inner"],
    [COLLECTIONS.shape, "stroke/focus-outer"],
  ];
  for (const styleName of STYLES) {
    for (const state of STATES) {
      const appearance = styleFor(styleName, state);
      for (const token of [appearance.fill, appearance.text, appearance.border]) {
        if (token) required.push([COLLECTIONS.semanticColor, token[0]]);
      }
    }
  }
  required.forEach(([collection, name]) => variable(collection, name));
  const labelStyle = textStyles.find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer le Foundations Builder");
  font = labelStyle.fontName;
  const fonts = await figma.listAvailableFontsAsync();
  if (!fonts.some((entry) => entry.fontName.family === font.family && entry.fontName.style === font.style)) {
    throw new Error("Police Manrope Bold indisponible dans Figma");
  }
  await figma.loadFontAsync(font);
  return labelStyle;
}

async function main() {
  figma.notify("Construction du composant Action…", { timeout: 3000 });
  const labelStyle = await prepare();
  await figma.loadAllPagesAsync();
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.1 — Action");
  if (!page) {
    page = figma.createPage();
    page.name = "02.1 — Action";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];

  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Action");
  if (existing) {
    const expectedNames = STYLES.flatMap((styleName) => STATES.map((state) => `Style=${styleName}, State=${state}`));
    const actualNames = existing.children.map((entry) => entry.name);
    if (actualNames.length !== expectedNames.length || expectedNames.some((name) => !actualNames.includes(name))) {
      throw new Error(`Set Action incomplet ou altéré (${actualNames.length}/20). Arrêt sans suppression : transmettre ce message à Codex.`);
    }
    const radius = variable(COLLECTIONS.shape, "radius/control");
    existing.children.forEach((component) => {
      component.cornerRadius = 8;
      component.setBoundVariable("cornerRadius", radius);
      if (component.name.endsWith("State=Focus")) ensureFocusOuterRing(component);
    });
    existing.description = ACTION_DESCRIPTION;
    const notes = page.children.find((entry) => entry.name === "_Generated/Action · Usage notes");
    const anatomy = notes && notes.children.find((entry) => entry.name === "Note 2");
    if (anatomy && anatomy.type === "TEXT") {
      anatomy.characters = "ANATOMIE · Libellé éditable obligatoire ; coins adoucis de 8 px. L'icône facultative sera reliée au set d'icônes dans une itération dédiée.";
    }
    ensurePreviewSurface(page);
    ensureGridLabels(page);
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("Action actualisée · focus bicolore visible");
    return;
  }

  const staleDraft = page.children.find((entry) => entry.name === "_Generated/Action Draft");
  if (staleDraft) staleDraft.remove();
  const staging = figma.createFrame();
  staging.name = "_Generated/Action Draft";
  staging.resize(1, 1);
  staging.x = -4000;
  staging.y = 0;
  staging.fills = [];
  staging.clipsContent = false;

  const components = [];
  for (const styleName of STYLES) {
    for (const state of STATES) {
      components.push(await createActionVariant(styleName, state, staging, labelStyle));
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Action";
  set.description = ACTION_DESCRIPTION;
  set.x = 180;
  set.y = 300;
  components.forEach((component, index) => {
    const row = Math.floor(index / STATES.length);
    const column = index % STATES.length;
    component.x = 24 + column * 260;
    component.y = 24 + row * 105;
  });
  set.resizeWithoutConstraints(1330, 480);
  staging.remove();

  page.appendChild(documentationFrame());
  page.appendChild(noteFrame());
  ensureGridLabels(page);
  ensurePreviewSurface(page);
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("Action créée · 20 variantes prêtes pour revue");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Action Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
