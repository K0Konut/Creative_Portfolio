const COLLECTION_SPECS = [
  ["Primitives/Color", "Value"],
  ["Semantic/Color", "Value"],
  ["Primitives/Space", "Value"],
  ["Semantic/Space/Compact", "Compact"],
  ["Semantic/Space/Large", "Large"],
  ["Primitives/Size", "Value"],
  ["Primitives/Shape", "Value"],
  ["Primitives/Motion", "Value"],
];

const COLOR_PRIMITIVES = [
  ["neutral/950", "#101113"],
  ["neutral/700", "#474747"],
  ["neutral/500", "#827E76"],
  ["neutral/100", "#E8E1D4"],
  ["neutral/50", "#F5F1E8"],
  ["violet/700", "#17105B"],
  ["violet/600", "#3D2EE8"],
  ["violet/500", "#4B3CFF"],
  ["lime/700", "#98CC00"],
  ["lime/600", "#B0E600"],
  ["lime/500", "#C7FF00"],
  ["pink/700", "#D640AC"],
  ["pink/600", "#EB55C3"],
  ["pink/500", "#FF6BD6"],
  ["feedback/error-strong", "#8A1C12"],
  ["feedback/error-subtle", "#FDE7E2"],
  ["feedback/success-strong", "#14532D"],
  ["feedback/success-subtle", "#DDF4E4"],
  ["feedback/warning-strong", "#6B4500"],
  ["feedback/warning-subtle", "#FFF1C7"],
  ["feedback/info-subtle", "#E7E9FF"],
];

const COLOR_GROUPS = [
  {
    title: "Palette de référence · 8 teintes",
    description: "Les couleurs d'identité et les neutres explicitement retenus pour la direction visuelle V1.",
    columns: 4,
    names: ["violet/500", "lime/500", "pink/500", "neutral/950", "neutral/700", "neutral/50", "violet/700", "neutral/100"],
  },
  {
    title: "Variantes fonctionnelles · 6 teintes",
    description: "Survol, état actif et contour : elles prolongent la palette sans devenir de nouveaux accents de marque.",
    columns: 6,
    names: ["neutral/500", "violet/600", "lime/600", "lime/700", "pink/600", "pink/700"],
  },
  {
    title: "Feedback · 7 teintes",
    description: "Erreur, succès, avertissement et information : ces couleurs portent des messages d'interface, toujours avec un texte explicite.",
    columns: 7,
    names: ["feedback/error-strong", "feedback/error-subtle", "feedback/success-strong", "feedback/success-subtle", "feedback/warning-strong", "feedback/warning-subtle", "feedback/info-subtle"],
  },
];

const SEMANTIC_COLORS = [
  ["surface/canvas", "neutral/50", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/subtle", "neutral/100", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/brand", "violet/500", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/inverse", "neutral/950", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/action-primary", "lime/500", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/action-primary-hover", "lime/600", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/action-primary-active", "lime/700", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/action-secondary", "violet/500", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/action-secondary-hover", "violet/600", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/action-secondary-active", "violet/700", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/editorial", "pink/500", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/editorial-hover", "pink/600", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/editorial-active", "pink/700", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/paper", "neutral/50", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/disabled", "neutral/100", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/error", "feedback/error-subtle", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/success", "feedback/success-subtle", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/warning", "feedback/warning-subtle", ["FRAME_FILL", "SHAPE_FILL"]],
  ["surface/info", "feedback/info-subtle", ["FRAME_FILL", "SHAPE_FILL"]],
  ["text/primary", "neutral/950", ["TEXT_FILL"]],
  ["text/secondary", "neutral/700", ["TEXT_FILL"]],
  ["text/on-brand", "neutral/50", ["TEXT_FILL"]],
  ["text/on-inverse", "neutral/50", ["TEXT_FILL"]],
  ["text/on-accent", "neutral/950", ["TEXT_FILL"]],
  ["text/link", "violet/500", ["TEXT_FILL"]],
  ["text/link-active", "violet/700", ["TEXT_FILL"]],
  ["text/disabled", "neutral/700", ["TEXT_FILL"]],
  ["text/error", "feedback/error-strong", ["TEXT_FILL"]],
  ["text/success", "feedback/success-strong", ["TEXT_FILL"]],
  ["text/warning", "feedback/warning-strong", ["TEXT_FILL"]],
  ["text/info", "violet/700", ["TEXT_FILL"]],
  ["border/default", "neutral/500", ["STROKE_COLOR"]],
  ["border/strong", "neutral/950", ["STROKE_COLOR"]],
  ["border/inverse", "neutral/50", ["STROKE_COLOR"]],
  ["focus/inner", "neutral/50", ["STROKE_COLOR"]],
  ["focus/outer", "neutral/950", ["STROKE_COLOR"]],
];

const SPACE_PRIMITIVES = [
  ["space/0", 0], ["space/1", 4], ["space/2", 8], ["space/3", 12],
  ["space/4", 16], ["space/5", 20], ["space/6", 24], ["space/8", 32],
  ["space/10", 40], ["space/12", 48], ["space/16", 64], ["space/20", 80],
  ["space/24", 96], ["space/32", 128], ["space/40", 160],
];

const SEMANTIC_SPACE = [
  ["gap/icon-label", 8, 8],
  ["gap/inline-group", 12, 12],
  ["gap/control-group", 16, 16],
  ["gap/content-group", 24, 24],
  ["gap/module", 32, 48],
  ["gap/block", 40, 64],
  ["gap/section", 64, 128],
  ["inset/card", 20, 32],
  ["inset/panel", 24, 48],
];

const SIZE_PRIMITIVES = [
  ["target/aa-min", 24],
  ["target/project-min", 44],
  ["control/compact", 44],
  ["control/standard", 48],
  ["control/large", 56],
  ["icon/sm", 16],
  ["icon/md", 20],
  ["icon/lg", 24],
  ["header/mobile", 64],
  ["header/large", 72],
  ["container/layout-max", 1440],
];

const SHAPE_PRIMITIVES = [
  ["stroke/hairline", 1, ["STROKE_FLOAT"]],
  ["stroke/control", 1, ["STROKE_FLOAT"]],
  ["stroke/emphasis", 2, ["STROKE_FLOAT"]],
  ["stroke/inverse", 1, ["STROKE_FLOAT"]],
  ["stroke/focus-inner", 2, ["STROKE_FLOAT"]],
  ["stroke/focus-outer", 2, ["STROKE_FLOAT"]],
  ["radius/none", 0, ["CORNER_RADIUS"]],
  ["radius/control", 8, ["CORNER_RADIUS"]],
  ["radius/full", 999, ["CORNER_RADIUS"]],
];

const MOTION_FLOATS = [
  ["motion/duration/instant", 0, "ms"],
  ["motion/duration/reduced", 100, "ms"],
  ["motion/duration/feedback", 120, "ms"],
  ["motion/duration/control", 160, "ms"],
  ["motion/duration/content", 240, "ms"],
  ["motion/duration/panel", 280, "ms"],
  ["motion/duration/media", 320, "ms"],
  ["motion/duration/layout", 360, "ms"],
  ["motion/duration/signature", 480, "ms"],
  ["motion/distance/xs", 4, "px"],
  ["motion/distance/sm", 8, "px"],
  ["motion/distance/md", 16, "px"],
  ["motion/distance/lg", 24, "px"],
];

const MOTION_STRINGS = [
  ["motion/ease/standard", "cubic-bezier(0.2, 0, 0, 1)"],
  ["motion/ease/enter", "cubic-bezier(0.16, 1, 0.3, 1)"],
  ["motion/ease/exit", "cubic-bezier(0.4, 0, 1, 1)"],
];

const TYPE_SPECS = [
  ["Display/Hero", "display/hero", "League Gothic", "Regular", 80, 192, 82, "wdth 75 · Hero, deux lignes maximum"],
  ["Display/Page", "display/page", "League Gothic", "Regular", 64, 128, 84, "wdth 78 · Titre de page"],
  ["Display/Section", "display/section", "League Gothic", "Regular", 48, 80, 88, "wdth 82 · Grande section"],
  ["Heading/XL", "heading/xl", "Manrope", "Bold", 32, 48, 108, "Titre fonctionnel majeur"],
  ["Heading/LG", "heading/lg", "Manrope", "Bold", 28, 36, 115, "Titre de module ou projet"],
  ["Heading/MD", "heading/md", "Manrope", "Bold", 22, 24, 125, "Sous-section et carte"],
  ["Body/LG", "body/lg", "Manrope", "Regular", 18, 20, 160, "Introduction et texte éditorial"],
  ["Body/MD", "body/md", "Manrope", "Regular", 16, 18, 160, "Texte courant"],
  ["Body/SM", "body/sm", "Manrope", "Medium", 14, 14, 150, "Texte secondaire non critique"],
  ["Label/MD", "label/md", "Manrope", "Bold", 15, 16, 120, "Navigation, bouton et contrôle"],
  ["Label/SM", "label/sm", "Manrope", "Bold", 13, 14, 130, "Tag, statut et métadonnée"],
  ["Editorial/LG", "editorial/lg", "Fraunces", "EDITORIAL", 32, 56, 100, "Accent éditorial isolé"],
  ["Editorial/MD", "editorial/md", "Fraunces", "EDITORIAL", 22, 32, 115, "Annotation courte"],
];

const GRID_SPECS = [
  ["Grid/Compact", 375, 4, 20, 12, "≤ 639 px"],
  ["Grid/Medium", 768, 8, 32, 16, "640–1023 px"],
  ["Grid/Large", 1200, 12, 48, 24, "1024–1439 px"],
  ["Grid/Wide", 1440, 12, 64, 24, "≥ 1440 px · contenu plafonné à 1440 px"],
];

const HEX = {
  ink: "#101113",
  muted: "#474747",
  border: "#827E76",
  subtle: "#E8E1D4",
  canvas: "#F5F1E8",
  violetDeep: "#17105B",
  violet: "#4B3CFF",
  lime: "#C7FF00",
  pink: "#FF6BD6",
  info: "#E7E9FF",
};

let collections = [];
let variables = [];
let fonts = {};
let fontAxes = {};

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

function cssName(name, prefix = "") {
  return `var(--${prefix}${name.replaceAll("/", "-")})`;
}

function findCollection(name) {
  return collections.find((collection) => collection.name === name);
}

function findVariable(collectionName, name) {
  const collection = findCollection(collectionName);
  return collection
    ? variables.find((variable) => variable.variableCollectionId === collection.id && variable.name === name)
    : undefined;
}

function boundPaint(collectionName, variableName, fallbackHex, opacity = 1) {
  const variable = findVariable(collectionName, variableName);
  const paint = solid(fallbackHex, opacity);
  if (!variable || !figma.variables.setBoundVariableForPaint) return paint;
  try {
    return figma.variables.setBoundVariableForPaint(paint, "color", variable);
  } catch (_error) {
    return paint;
  }
}

async function ensureCollections() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  for (const [name, modeName] of COLLECTION_SPECS) {
    let collection = collections.find((entry) => entry.name === name);
    if (!collection) {
      collection = figma.variables.createVariableCollection(name);
      collections.push(collection);
    }
    const firstMode = collection.modes[0];
    if (firstMode && firstMode.name !== modeName) collection.renameMode(firstMode.modeId, modeName);
  }
}

function ensureVariable(collectionName, name, type, value, scopes, description, codeSyntax) {
  const collection = findCollection(collectionName);
  if (!collection) throw new Error(`Collection introuvable : ${collectionName}`);
  let variable = findVariable(collectionName, name);
  if (!variable) {
    variable = figma.variables.createVariable(name, collection, type);
    variables.push(variable);
  }
  variable.scopes = scopes;
  variable.description = description;
  variable.setValueForMode(collection.modes[0].modeId, value);
  variable.setVariableCodeSyntax("WEB", codeSyntax);
  return variable;
}

async function buildVariables() {
  variables = await figma.variables.getLocalVariablesAsync();

  for (const [name, hex] of COLOR_PRIMITIVES) {
    ensureVariable(
      "Primitives/Color",
      name,
      "COLOR",
      rgb(hex),
      [],
      `Couleur primitive ${hex}`,
      cssName(name, "color-"),
    );
  }

  for (const [name, target, scopes] of SEMANTIC_COLORS) {
    const primitive = findVariable("Primitives/Color", target);
    if (!primitive) throw new Error(`Primitive couleur introuvable : ${target}`);
    ensureVariable(
      "Semantic/Color",
      name,
      "COLOR",
      { type: "VARIABLE_ALIAS", id: primitive.id },
      scopes,
      `Alias sémantique vers ${target}`,
      cssName(name),
    );
  }

  for (const [name, value] of SPACE_PRIMITIVES) {
    ensureVariable("Primitives/Space", name, "FLOAT", value, [], `${value} px`, cssName(name));
  }

  for (const [name, compact, large] of SEMANTIC_SPACE) {
    const compactPrimitive = findVariable("Primitives/Space", `space/${compact / 4}`);
    const largePrimitive = findVariable("Primitives/Space", `space/${large / 4}`);
    if (!compactPrimitive || !largePrimitive) throw new Error(`Primitive d'espacement introuvable pour ${name}`);
    ensureVariable(
      "Semantic/Space/Compact",
      name,
      "FLOAT",
      { type: "VARIABLE_ALIAS", id: compactPrimitive.id },
      ["GAP"],
      `Valeur Compact · ${compact} px · équivalent au mode Compact`,
      cssName(name),
    );
    ensureVariable(
      "Semantic/Space/Large",
      name,
      "FLOAT",
      { type: "VARIABLE_ALIAS", id: largePrimitive.id },
      ["GAP"],
      `Valeur Large · ${large} px · équivalent au mode Large`,
      cssName(name),
    );
  }

  for (const [name, value] of SIZE_PRIMITIVES) {
    ensureVariable("Primitives/Size", name, "FLOAT", value, ["WIDTH_HEIGHT"], `${value} px`, cssName(name, "size-"));
  }

  for (const [name, value, scopes] of SHAPE_PRIMITIVES) {
    ensureVariable("Primitives/Shape", name, "FLOAT", value, scopes, `${value} px`, cssName(name));
  }

  for (const [name, value, unit] of MOTION_FLOATS) {
    ensureVariable("Primitives/Motion", name, "FLOAT", value, [], `${value} ${unit}`, cssName(name));
  }

  for (const [name, value] of MOTION_STRINGS) {
    ensureVariable("Primitives/Motion", name, "STRING", value, [], value, cssName(name));
  }
}

async function chooseFonts() {
  const available = await figma.listAvailableFontsAsync();
  const has = (family, style) => available.some((font) => font.fontName.family === family && font.fontName.style === style);
  const choose = (family, candidates) => {
    const style = candidates.find((candidate) => has(family, candidate));
    if (!style) throw new Error(`Police indisponible : ${family} (${candidates.join(", ")})`);
    return { family, style };
  };
  fonts = {
    display: choose("League Gothic", ["Regular"]),
    regular: choose("Manrope", ["Regular"]),
    medium: choose("Manrope", ["Medium", "Regular"]),
    bold: choose("Manrope", ["Bold", "ExtraBold", "SemiBold"]),
    editorial: choose("Fraunces", ["Medium Italic", "SemiBold Italic", "Italic"]),
  };
  fontAxes = {
    "League Gothic": figma.getFontFamilyVariationAxes("League Gothic") || [],
    Fraunces: figma.getFontFamilyVariationAxes("Fraunces") || [],
  };
  await Promise.all(Object.values(fonts).map((font) => figma.loadFontAsync(font)));
}

function fontFor(family, style, width) {
  if (family === "League Gothic") {
    return width && fontAxes[family].includes("wdth")
      ? { ...fonts.display, variationSettings: { wdth: width } }
      : fonts.display;
  }
  if (family === "Fraunces") {
    return fontAxes[family].includes("wght")
      ? { ...fonts.editorial, variationSettings: { wght: 500 } }
      : fonts.editorial;
  }
  if (style === "Bold") return fonts.bold;
  if (style === "Medium") return fonts.medium;
  return fonts.regular;
}

async function buildTextStyles() {
  const styles = await figma.getLocalTextStylesAsync();
  for (const [path, token, family, styleName, compact, large, lineHeight, usage] of TYPE_SPECS) {
    const variants = compact === large ? [[null, compact]] : [["Compact", compact], ["Large", large]];
    for (const [variant, size] of variants) {
      const name = `Type/${path}${variant ? `/${variant}` : ""}`;
      let style = styles.find((entry) => entry.name === name);
      if (!style) {
        style = figma.createTextStyle();
        styles.push(style);
      }
      style.name = name;
      const displayWidth = token === "display/hero" ? 75 : token === "display/page" ? 78 : token === "display/section" ? 82 : undefined;
      style.fontName = fontFor(family, styleName, displayWidth);
      style.fontSize = size;
      style.lineHeight = { unit: "PERCENT", value: lineHeight };
      style.letterSpacing = { unit: "PERCENT", value: 0 };
      style.paragraphSpacing = 0;
      style.description = `${token} · ${variant || "Compact + Large"} · ${size}px / ${lineHeight}% · ${usage}`;
    }
  }
}

async function buildEffectStyles() {
  const styles = await figma.getLocalEffectStylesAsync();
  const specs = [
    ["Effect/None", [], "Aucun effet"],
    ["Effect/Paper", [{
      type: "DROP_SHADOW",
      color: { ...rgb(HEX.ink), a: 0.18 },
      offset: { x: 4, y: 6 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    }], "Papier · 4 / 6 / 0 / 0 · neutral/950 à 18 %"],
    ["Effect/Overlay", [{
      type: "DROP_SHADOW",
      color: { ...rgb(HEX.ink), a: 0.18 },
      offset: { x: 0, y: 12 },
      radius: 32,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    }], "Superposition · 0 / 12 / 32 / 0 · neutral/950 à 18 %"],
  ];
  for (const [name, effects, description] of specs) {
    let style = styles.find((entry) => entry.name === name);
    if (!style) {
      style = figma.createEffectStyle();
      styles.push(style);
    }
    style.name = name;
    style.effects = effects;
    style.description = description;
  }
}

async function buildGridStyles() {
  const styles = await figma.getLocalGridStylesAsync();
  for (const [name, width, count, margin, gutter, range] of GRID_SPECS) {
    let style = styles.find((entry) => entry.name === name);
    if (!style) {
      style = figma.createGridStyle();
      styles.push(style);
    }
    style.name = name;
    style.layoutGrids = [{
      pattern: "COLUMNS",
      alignment: "STRETCH",
      gutterSize: gutter,
      count,
      offset: margin,
      visible: true,
      color: { ...rgb(HEX.violet), a: 0.10 },
    }];
    style.description = `${range} · référence ${width}px · ${count} colonnes · marge ${margin}px · gouttière ${gutter}px`;
  }
}

function createFrame(name, width, direction = "VERTICAL", gap = 24, padding = 32, fill = HEX.canvas) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.resize(width, 100);
  frame.primaryAxisSizingMode = direction === "VERTICAL" ? "AUTO" : "FIXED";
  frame.counterAxisSizingMode = direction === "VERTICAL" ? "FIXED" : "AUTO";
  frame.itemSpacing = gap;
  frame.paddingTop = padding;
  frame.paddingRight = padding;
  frame.paddingBottom = padding;
  frame.paddingLeft = padding;
  frame.fills = [solid(fill)];
  frame.clipsContent = false;
  return frame;
}

function createText(content, font, size, color = HEX.ink, lineHeight = 140) {
  const text = figma.createText();
  text.fontName = font;
  text.characters = content;
  text.fontSize = size;
  text.lineHeight = { unit: "PERCENT", value: lineHeight };
  text.fills = [solid(color)];
  text.textAutoResize = "HEIGHT";
  return text;
}

function makeTextFill(text, semanticName, fallback) {
  text.fills = [boundPaint("Semantic/Color", semanticName, fallback)];
  return text;
}

function makeSurfaceFill(node, semanticName, fallback) {
  node.fills = [boundPaint("Semantic/Color", semanticName, fallback)];
  return node;
}

function appendFill(parent, child) {
  parent.appendChild(child);
  child.layoutSizingHorizontal = "FILL";
  return child;
}

function titleBlock(kicker, title, description, dark = false) {
  const block = createFrame(`Title · ${title}`, 1344, "VERTICAL", 12, 0, dark ? HEX.violet : HEX.canvas);
  block.fills = [];
  const kickerNode = createText(kicker.toUpperCase(), fonts.bold, 13, dark ? HEX.lime : HEX.violet, 130);
  kickerNode.letterSpacing = { unit: "PERCENT", value: 6 };
  appendFill(block, kickerNode);
  appendFill(block, createText(title, fonts.bold, 36, dark ? HEX.canvas : HEX.ink, 110));
  appendFill(block, createText(description, fonts.regular, 16, dark ? HEX.canvas : HEX.muted, 160));
  return block;
}

function removeGenerated(page) {
  for (const child of [...page.children]) {
    if (child.name.startsWith("_Generated/")) child.remove();
  }
}

function findOrCreatePage(name) {
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === name);
  if (!page) {
    const unnamed = figma.root.children.find((entry) => entry.type === "PAGE" && /^Page\s+1$/i.test(entry.name));
    if (unnamed && name.startsWith("00")) {
      unnamed.name = name;
      page = unnamed;
    } else {
      page = figma.createPage();
      page.name = name;
    }
  }
  return page;
}

function createStatusChip(label, fill, textColor = HEX.ink) {
  const chip = createFrame(`Status · ${label}`, 240, "HORIZONTAL", 8, 12, fill);
  chip.primaryAxisSizingMode = "AUTO";
  chip.counterAxisSizingMode = "AUTO";
  chip.cornerRadius = 999;
  const text = createText(label.toUpperCase(), fonts.bold, 13, textColor, 120);
  text.letterSpacing = { unit: "PERCENT", value: 4 };
  chip.appendChild(text);
  return chip;
}

function createCoverBoard() {
  const board = createFrame("_Generated/Cover & Handoff", 1440, "VERTICAL", 48, 64, HEX.canvas);
  board.x = 0;
  board.y = 0;

  const masthead = createFrame("Masthead", 1312, "VERTICAL", 24, 48, HEX.violet);
  makeSurfaceFill(masthead, "surface/brand", HEX.violet);
  appendFill(masthead, createText("CREATIVE PORTFOLIO · FIGMA V1", fonts.bold, 14, HEX.lime, 120));
  const hero = createText("STUDIO\nGRAPHIQUE\nMODULAIRE", fontFor("League Gothic", "Regular", 75), 132, HEX.canvas, 82);
  makeTextFill(hero, "text/on-brand", HEX.canvas);
  appendFill(masthead, hero);
  const signature = createText("Un portfolio de développeur full-stack qui compose des expériences web singulières.", fonts.editorial, 36, HEX.canvas, 115);
  makeTextFill(signature, "text/on-brand", HEX.canvas);
  appendFill(masthead, signature);
  board.appendChild(masthead);

  const statusRow = createFrame("Status", 1312, "HORIZONTAL", 16, 0, HEX.canvas);
  statusRow.fills = [];
  statusRow.appendChild(createStatusChip("Fondations · Rayon Action en revue", HEX.lime));
  statusRow.appendChild(createStatusChip("V1 · 2026-09-21", HEX.pink));
  statusRow.appendChild(createStatusChip("WCAG 2.2 AA", HEX.info));
  board.appendChild(statusRow);

  const notes = createFrame("Handoff", 1312, "HORIZONTAL", 24, 0, HEX.canvas);
  notes.fills = [];
  const left = createFrame("Sources", 644, "VERTICAL", 16, 32, HEX.subtle);
  appendFill(left, createText("SOURCES DE VÉRITÉ", fonts.bold, 13, HEX.violet, 120));
  appendFill(left, createText("DESIGN_SYSTEM.md · v0.12.0\nMOTION_GUIDELINES.md · v0.2.1\nCOMPONENT_INVENTORY.md · v0.2.0", fonts.regular, 18, HEX.ink, 160));
  notes.appendChild(left);
  const right = createFrame("Workflow", 644, "VERTICAL", 16, 32, HEX.ink);
  appendFill(right, createText("PROCHAINE DÉCISION", fonts.bold, 13, HEX.lime, 120));
  appendFill(right, createText("Construire et valider les composants Figma avant de composer les écrans.", fonts.regular, 18, HEX.canvas, 160));
  notes.appendChild(right);
  board.appendChild(notes);
  return board;
}

function createColorSection() {
  const section = createFrame("Section · Color", 1472, "VERTICAL", 28, 32, HEX.canvas);
  section.strokes = [solid(HEX.ink)];
  section.strokeWeight = 1;
  appendFill(section, titleBlock("01 · Foundations", "Color", "Huit teintes définissent la direction visuelle. Les autres servent exclusivement aux états fonctionnels et aux messages de feedback. Les écrans consomment les alias sémantiques."));

  const primitiveMap = new Map(COLOR_PRIMITIVES);
  for (const group of COLOR_GROUPS) {
    const block = createFrame(`Palette · ${group.title}`, 1344, "VERTICAL", 12, 0, HEX.canvas);
    block.fills = [];
    appendFill(block, createText(group.title, fonts.bold, 18, HEX.ink, 125));
    appendFill(block, createText(group.description, fonts.regular, 14, HEX.muted, 150));
    const cardWidth = (1344 - 12 * (group.columns - 1)) / group.columns;
    for (let index = 0; index < group.names.length; index += group.columns) {
      const row = createFrame(`Swatches · ${group.title} · ${index / group.columns + 1}`, 1344, "HORIZONTAL", 12, 0, HEX.canvas);
      row.fills = [];
      for (const name of group.names.slice(index, index + group.columns)) {
        const hex = primitiveMap.get(name);
        if (!hex) throw new Error(`Couleur primitive introuvable : ${name}`);
        const card = createFrame(`Color · ${name}`, cardWidth, "VERTICAL", 10, 12, HEX.canvas);
        card.strokes = [solid(HEX.border)];
        card.strokeWeight = 1;
        const sample = figma.createRectangle();
        sample.name = name;
        sample.resize(cardWidth - 24, 80);
        sample.fills = [boundPaint("Primitives/Color", name, hex)];
        if (name === "neutral/50" || name === "neutral/100" || name.endsWith("-subtle")) {
          sample.strokes = [solid(HEX.border, 0.5)];
          sample.strokeWeight = 1;
        }
        card.appendChild(sample);
        appendFill(card, createText(name, fonts.bold, 13, HEX.ink, 130));
        appendFill(card, createText(hex, fonts.regular, 12, HEX.muted, 130));
        row.appendChild(card);
      }
      block.appendChild(row);
    }
    section.appendChild(block);
  }

  const aliases = createFrame("Semantic aliases", 1344, "HORIZONTAL", 16, 24, HEX.subtle);
  const groups = [
    ["SURFACES", SEMANTIC_COLORS.filter(([name]) => name.startsWith("surface/"))],
    ["TEXTES", SEMANTIC_COLORS.filter(([name]) => name.startsWith("text/"))],
    ["BORDURES & FOCUS", SEMANTIC_COLORS.filter(([name]) => name.startsWith("border/") || name.startsWith("focus/"))],
  ];
  const widths = [520, 420, 308];
  groups.forEach(([label, entries], groupIndex) => {
    const column = createFrame(`Aliases · ${label}`, widths[groupIndex], "VERTICAL", 8, 0, HEX.subtle);
    column.fills = [];
    appendFill(column, createText(label, fonts.bold, 13, HEX.violet, 120));
    appendFill(column, createText(entries.map(([name, target]) => `${name}  →  ${target}`).join("\n"), fonts.regular, 13, HEX.ink, 155));
    aliases.appendChild(column);
  });
  section.appendChild(aliases);
  return section;
}

function createTypographySection() {
  const section = createFrame("Section · Typography", 1472, "VERTICAL", 28, 32, HEX.canvas);
  section.strokes = [solid(HEX.ink)];
  section.strokeWeight = 1;
  appendFill(section, titleBlock("02 · Foundations", "Typography", "Trois voix : League Gothic pour l'impact, Manrope pour l'interface et Fraunces Italic pour l'accent éditorial."));

  const familyRow = createFrame("Type families", 1344, "HORIZONTAL", 16, 0, HEX.canvas);
  familyRow.fills = [];
  const samples = [
    ["LEAGUE GOTHIC", "IMPACT", fonts.display, 64, HEX.violet],
    ["MANROPE", "Clarté fonctionnelle", fonts.bold, 28, HEX.ink],
    ["FRAUNCES ITALIC", "Une note éditoriale", fonts.editorial, 36, HEX.ink],
  ];
  for (const [label, sample, font, size, color] of samples) {
    const card = createFrame(`Family · ${label}`, 437, "VERTICAL", 12, 24, HEX.subtle);
    appendFill(card, createText(label, fonts.bold, 12, HEX.violet, 120));
    appendFill(card, createText(sample, font, size, color, 110));
    familyRow.appendChild(card);
  }
  section.appendChild(familyRow);

  const scale = createFrame("Responsive type scale", 1344, "VERTICAL", 0, 0, HEX.canvas);
  scale.fills = [];
  TYPE_SPECS.forEach(([path, token, family, styleName, compact, large, lineHeight, usage], index) => {
    const row = createFrame(`Type · ${token}`, 1344, "HORIZONTAL", 20, 16, index % 2 === 0 ? HEX.canvas : HEX.subtle);
    const meta = createFrame("Meta", 320, "VERTICAL", 6, 0, index % 2 === 0 ? HEX.canvas : HEX.subtle);
    meta.fills = [];
    appendFill(meta, createText(token, fonts.bold, 14, HEX.violet, 120));
    appendFill(meta, createText(`${compact}px → ${large}px · ${lineHeight}%\n${usage}`, fonts.regular, 12, HEX.muted, 145));
    row.appendChild(meta);
    const displayWidth = token === "display/hero" ? 75 : token === "display/page" ? 78 : token === "display/section" ? 82 : undefined;
    const sampleFont = fontFor(family, styleName, displayWidth);
    const sampleSize = Math.min(compact, 80);
    const sample = createText(token.startsWith("display/") ? "CREATIVE SYSTEM" : token.startsWith("editorial/") ? "Curieux par nature" : "Concevoir avec intention", sampleFont, sampleSize, HEX.ink, lineHeight);
    sample.resize(972, 40);
    sample.textAutoResize = "HEIGHT";
    row.appendChild(sample);
    scale.appendChild(row);
  });
  section.appendChild(scale);

  const note = createFrame("Variable font note", 1344, "VERTICAL", 8, 20, HEX.info);
  appendFill(note, createText("AXES À CONSERVER AU HANDOFF", fonts.bold, 13, HEX.violetDeep, 120));
  appendFill(note, createText("League Gothic utilise wdth 75 / 78 / 82 selon le niveau display. Le plugin applique les axes variables lorsque Figma les expose ; leurs valeurs restent documentées dans les styles et doivent être reportées dans le code.", fonts.regular, 14, HEX.violetDeep, 150));
  section.appendChild(note);
  return section;
}

function createSpacingSection() {
  const section = createFrame("Section · Spacing & Size", 1472, "VERTICAL", 28, 32, HEX.canvas);
  section.strokes = [solid(HEX.ink)];
  section.strokeWeight = 1;
  appendFill(section, titleBlock("03 · Foundations", "Spacing & size", "Une base de 4 px, des rôles sémantiques responsives et des dimensions fonctionnelles explicites."));

  const scale = createFrame("Space scale", 1344, "VERTICAL", 10, 24, HEX.subtle);
  for (const [name, value] of SPACE_PRIMITIVES) {
    const row = createFrame(`Space · ${name}`, 1296, "HORIZONTAL", 16, 0, HEX.subtle);
    row.fills = [];
    const label = createText(`${name} · ${value}px`, fonts.medium, 12, HEX.ink, 120);
    label.resize(180, 20);
    label.textAutoResize = "NONE";
    row.appendChild(label);
    const bar = figma.createRectangle();
    bar.name = name;
    bar.resize(Math.max(value * 4, 2), 12);
    bar.fills = [solid(value >= 64 ? HEX.violet : HEX.pink)];
    row.appendChild(bar);
    scale.appendChild(row);
  }
  section.appendChild(scale);

  const responsive = createFrame("Responsive spacing", 1344, "HORIZONTAL", 16, 0, HEX.canvas);
  responsive.fills = [];
  const compact = createFrame("Compact", 656, "VERTICAL", 10, 24, HEX.ink);
  appendFill(compact, createText("COMPACT", fonts.bold, 13, HEX.lime, 120));
  appendFill(compact, createText(SEMANTIC_SPACE.map(([name, value]) => `${name}  ${value}px`).join("\n"), fonts.regular, 14, HEX.canvas, 155));
  const large = createFrame("Large", 656, "VERTICAL", 10, 24, HEX.violet);
  appendFill(large, createText("LARGE", fonts.bold, 13, HEX.lime, 120));
  appendFill(large, createText(SEMANTIC_SPACE.map(([name, , value]) => `${name}  ${value}px`).join("\n"), fonts.regular, 14, HEX.canvas, 155));
  responsive.appendChild(compact);
  responsive.appendChild(large);
  section.appendChild(responsive);

  const sizes = createFrame("Functional sizes", 1344, "VERTICAL", 10, 24, HEX.info);
  appendFill(sizes, createText("DIMENSIONS FONCTIONNELLES", fonts.bold, 13, HEX.violetDeep, 120));
  appendFill(sizes, createText(SIZE_PRIMITIVES.map(([name, value]) => `${name}: ${value}px`).join("  ·  "), fonts.regular, 14, HEX.violetDeep, 150));
  appendFill(sizes, createText("Conteneurs documentés : full = 100 % · reading = 72ch · compact-copy = 48ch. Ces unités ne sont pas converties en pixels dans les variables.", fonts.medium, 14, HEX.violetDeep, 150));
  section.appendChild(sizes);
  return section;
}

function createGridSection() {
  const section = createFrame("Section · Grid", 1472, "VERTICAL", 28, 32, HEX.canvas);
  section.strokes = [solid(HEX.ink)];
  section.strokeWeight = 1;
  appendFill(section, titleBlock("04 · Foundations", "Grid & layout", "La grille structure les modules sans dicter l'ordre de lecture. Le reflow préserve contenu, actions et navigation clavier."));
  const row = createFrame("Grid examples", 1344, "HORIZONTAL", 16, 0, HEX.canvas);
  row.fills = [];
  for (const [name, width, count, margin, gutter, range] of GRID_SPECS) {
    const card = createFrame(`Grid preview · ${name}`, 324, "VERTICAL", 12, 20, HEX.subtle);
    appendFill(card, createText(name.replace("Grid/", ""), fonts.bold, 18, HEX.ink, 120));
    appendFill(card, createText(`${range}\n${count} col · m ${margin} · g ${gutter}`, fonts.regular, 12, HEX.muted, 145));
    const preview = figma.createFrame();
    preview.name = `${name} · ${width}px ref`;
    preview.resize(284, 160);
    preview.fills = [solid(HEX.canvas)];
    preview.clipsContent = true;
    const innerWidth = 284 - Math.min(margin / 2, 24) * 2;
    const previewGutter = Math.max(3, gutter / 4);
    const colWidth = (innerWidth - previewGutter * (count - 1)) / count;
    for (let index = 0; index < count; index += 1) {
      const column = figma.createRectangle();
      column.name = `Column ${index + 1}`;
      column.resize(colWidth, 160);
      column.x = Math.min(margin / 2, 24) + index * (colWidth + previewGutter);
      column.y = 0;
      column.fills = [solid(HEX.violet, 0.16)];
      preview.appendChild(column);
    }
    card.appendChild(preview);
    row.appendChild(card);
  }
  section.appendChild(row);
  const rule = createFrame("Reflow rule", 1344, "VERTICAL", 8, 20, HEX.lime);
  appendFill(rule, createText("REFLOW", fonts.bold, 13, HEX.ink, 120));
  appendFill(rule, createText("Mobile intentionnel, ordre éditorial stable, aucun débordement horizontal. Le contenu large reste plafonné à 1440 px.", fonts.medium, 16, HEX.ink, 145));
  section.appendChild(rule);
  return section;
}

function createShapeSection() {
  const section = createFrame("Section · Shape & Effects", 1472, "VERTICAL", 28, 32, HEX.canvas);
  section.strokes = [solid(HEX.ink)];
  section.strokeWeight = 1;
  appendFill(section, titleBlock("05 · Foundations", "Shape & effects", "Surfaces franches, rayons minimaux et matière papier discrète. Les cartes projet ne flottent pas au survol."));
  const row = createFrame("Shape examples", 1344, "HORIZONTAL", 20, 0, HEX.canvas);
  row.fills = [];
  const specs = [
    ["RADIUS / NONE", 0, []],
    ["RADIUS / CONTROL", 8, []],
    ["RADIUS / FULL", 999, []],
    ["EFFECT / PAPER", 0, [{ type: "DROP_SHADOW", color: { ...rgb(HEX.ink), a: 0.18 }, offset: { x: 4, y: 6 }, radius: 0, spread: 0, visible: true, blendMode: "NORMAL" }]],
    ["EFFECT / OVERLAY", 0, [{ type: "DROP_SHADOW", color: { ...rgb(HEX.ink), a: 0.18 }, offset: { x: 0, y: 12 }, radius: 32, spread: 0, visible: true, blendMode: "NORMAL" }]],
  ];
  for (const [label, radius, effects] of specs) {
    const card = createFrame(label, 252, "VERTICAL", 16, 24, HEX.subtle);
    card.cornerRadius = radius;
    card.effects = effects;
    card.strokes = [solid(HEX.ink)];
    card.strokeWeight = label.includes("PAPER") ? 1 : 2;
    appendFill(card, createText(label, fonts.bold, 13, HEX.violet, 120));
    appendFill(card, createText(label.includes("FULL") ? "999 px" : label.includes("CONTROL") ? "8 px" : label.includes("NONE") ? "0 px" : label.includes("PAPER") ? "4 / 6 / 0 · 18 %" : "0 / 12 / 32 · 18 %", fonts.regular, 16, HEX.ink, 145));
    row.appendChild(card);
  }
  section.appendChild(row);
  appendFill(section, createText("Traits : hairline 1 · control 1 · emphasis 2 · inverse 1 · focus inner 2 · focus outer 2", fonts.medium, 14, HEX.ink, 150));
  return section;
}

function createMotionSection() {
  const section = createFrame("Section · Motion", 1472, "VERTICAL", 28, 32, HEX.canvas);
  section.strokes = [solid(HEX.ink)];
  section.strokeWeight = 1;
  appendFill(section, titleBlock("06 · Foundations", "Motion & accessibility", "Le mouvement explique une relation, un changement d'état ou une action. Il ne retarde jamais le contenu ni le focus."));
  const row = createFrame("Motion tokens", 1344, "HORIZONTAL", 16, 0, HEX.canvas);
  row.fills = [];
  const duration = createFrame("Durations", 437, "VERTICAL", 10, 24, HEX.ink);
  appendFill(duration, createText("DURÉES", fonts.bold, 13, HEX.lime, 120));
  appendFill(duration, createText(MOTION_FLOATS.filter(([name]) => name.includes("duration")).map(([name, value]) => `${name.replace("motion/duration/", "")}  ${value}ms`).join("\n"), fonts.regular, 14, HEX.canvas, 155));
  const distance = createFrame("Distances", 437, "VERTICAL", 10, 24, HEX.violet);
  appendFill(distance, createText("DISTANCES", fonts.bold, 13, HEX.lime, 120));
  appendFill(distance, createText(MOTION_FLOATS.filter(([name]) => name.includes("distance")).map(([name, value]) => `${name.replace("motion/distance/", "")}  ${value}px`).join("\n"), fonts.regular, 14, HEX.canvas, 155));
  const easing = createFrame("Easing", 438, "VERTICAL", 10, 24, HEX.pink);
  appendFill(easing, createText("COURBES", fonts.bold, 13, HEX.ink, 120));
  appendFill(easing, createText(MOTION_STRINGS.map(([name, value]) => `${name.replace("motion/ease/", "")}\n${value}`).join("\n\n"), fonts.regular, 13, HEX.ink, 145));
  row.appendChild(duration);
  row.appendChild(distance);
  row.appendChild(easing);
  section.appendChild(row);

  const decisions = createFrame("Motion decisions", 1344, "HORIZONTAL", 16, 0, HEX.canvas);
  decisions.fills = [];
  const signature = createFrame("Signature", 656, "VERTICAL", 10, 24, HEX.info);
  appendFill(signature, createText("SIGNATURE · RÉORGANISATION DE PLANCHE", fonts.bold, 13, HEX.violetDeep, 120));
  appendFill(signature, createText("480 ms maximum. Le projet sélectionné reste l'ancre perceptive. Nouvelle intention = interruption immédiate. Repli à 240 ms si la continuité partagée n'est pas fiable.", fonts.regular, 14, HEX.violetDeep, 150));
  const staticStack = createFrame("Stack banner", 672, "VERTICAL", 10, 24, HEX.lime);
  appendFill(staticStack, createText("BANDEAU DE STACKS · STATIQUE EN V1", fonts.bold, 13, HEX.ink, 120));
  appendFill(staticStack, createText("Aucun marquee, défilement automatique, boucle continue ou révélation systématique. Cette décision pourra être revisitée dans une V2 documentée.", fonts.regular, 14, HEX.ink, 150));
  decisions.appendChild(signature);
  decisions.appendChild(staticStack);
  section.appendChild(decisions);

  const reduced = createFrame("Reduced motion", 1344, "VERTICAL", 10, 24, HEX.ink);
  appendFill(reduced, createText("PREFERS-REDUCED-MOTION", fonts.bold, 13, HEX.lime, 120));
  appendFill(reduced, createText("Changement direct ou 100 ms sans déplacement spatial. Autoplay désactivé au chargement. Focus visible immédiatement. Aucun contenu essentiel ne dépend d'une animation.", fonts.regular, 15, HEX.canvas, 155));
  section.appendChild(reduced);
  return section;
}

function createFoundationsBoard() {
  const board = createFrame("_Generated/Foundations V1", 1600, "VERTICAL", 48, 64, HEX.canvas);
  board.x = 0;
  board.y = 0;
  const header = createFrame("Foundations header", 1472, "VERTICAL", 20, 48, HEX.violet);
  appendFill(header, createText("DESIGN SYSTEM · V1", fonts.bold, 14, HEX.lime, 120));
  appendFill(header, createText("FONDATIONS", fonts.display, 120, HEX.canvas, 82));
  appendFill(header, createText("Fondations V1 validées ; rayon des actions ajusté pour la revue du composant.", fonts.editorial, 32, HEX.canvas, 115));
  header.appendChild(createStatusChip("Rayon Action · À valider", HEX.lime));
  board.appendChild(header);
  board.appendChild(createColorSection());
  board.appendChild(createTypographySection());
  board.appendChild(createSpacingSection());
  board.appendChild(createGridSection());
  board.appendChild(createShapeSection());
  board.appendChild(createMotionSection());
  return board;
}

function createPlaceholderBoard(label, number, purpose) {
  const board = createFrame(`_Generated/${label}`, 1440, "VERTICAL", 36, 64, HEX.canvas);
  board.x = 0;
  board.y = 0;
  appendFill(board, createText(`${number} · ${label.toUpperCase()}`, fonts.bold, 14, HEX.violet, 120));
  appendFill(board, createText(label.toUpperCase(), fonts.display, 120, HEX.ink, 82));
  const panel = createFrame("Status", 1312, "VERTICAL", 16, 32, HEX.subtle);
  appendFill(panel, createText(label === "Components" ? "BIBLIOTHÈQUE EN COURS" : "À CONSTRUIRE APRÈS VALIDATION DES COMPOSANTS", fonts.bold, 16, HEX.violet, 120));
  appendFill(panel, createText(purpose, fonts.regular, 18, HEX.ink, 160));
  panel.appendChild(createStatusChip(label === "Components" ? "Phase en cours" : "Phase suivante", HEX.pink));
  board.appendChild(panel);
  return board;
}

async function buildPages() {
  await figma.loadAllPagesAsync();
  const coverPage = findOrCreatePage("00 — Cover & Handoff");
  const foundationsPage = findOrCreatePage("01 — Foundations");
  const componentsPage = findOrCreatePage("02 — Components");
  const screensPage = findOrCreatePage("03 — Screens");
  const prototypePage = findOrCreatePage("04 — Prototype");

  await figma.setCurrentPageAsync(coverPage);
  removeGenerated(coverPage);
  coverPage.appendChild(createCoverBoard());

  await figma.setCurrentPageAsync(foundationsPage);
  removeGenerated(foundationsPage);
  const foundations = createFoundationsBoard();
  foundationsPage.appendChild(foundations);

  await figma.setCurrentPageAsync(componentsPage);
  if (!componentsPage.children.some((entry) => entry.name === "_Generated/Components index")) {
    removeGenerated(componentsPage);
    componentsPage.appendChild(createPlaceholderBoard("Components", "02", "Construire les composants avec propriétés, variantes et états normal, hover, focus, active, disabled, loading, empty et error lorsque pertinents."));
  }

  await figma.setCurrentPageAsync(screensPage);
  removeGenerated(screensPage);
  screensPage.appendChild(createPlaceholderBoard("Screens", "03", "Composer les écrans de la homepage, des projets et des pages de contenu à partir de la bibliothèque validée."));

  await figma.setCurrentPageAsync(prototypePage);
  removeGenerated(prototypePage);
  prototypePage.appendChild(createPlaceholderBoard("Prototype", "04", "Prototyper les parcours et la réorganisation de planche, puis vérifier les variantes de mouvement réduit."));

  await figma.setCurrentPageAsync(foundationsPage);
  figma.currentPage.selection = [foundations];
  figma.viewport.scrollAndZoomIntoView([foundations]);
}

async function main() {
  figma.notify("Construction des fondations V1…", { timeout: 3000 });
  await ensureCollections();
  await buildVariables();
  await chooseFonts();
  await buildTextStyles();
  await buildEffectStyles();
  await buildGridStyles();
  await buildPages();
  figma.closePlugin("Fondations V1 synchronisées · rayon Action à revoir");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur du builder : ${message}`, { error: true, timeout: 8000 });
  figma.closePlugin(`Erreur : ${message}`);
});
