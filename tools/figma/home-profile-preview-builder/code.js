const VIEWPORTS = ["Wide", "Medium", "Compact"];
const LOCALES = ["FR", "EN"];
const STATES = ["Normal", "Incomplete"];
const SPECS = {
  Wide: {
    width: 1440,
    padding: 64,
    paddingToken: "space/16",
    gap: 24,
    gapToken: "space/6",
    content: 840,
    decoration: 448,
    panelPadding: 48,
    panelPaddingToken: "space/12",
  },
  Medium: {
    width: 768,
    padding: 32,
    paddingToken: "space/8",
    gap: 16,
    gapToken: "space/4",
    content: 704,
    decoration: 704,
    panelPadding: 32,
    panelPaddingToken: "space/8",
  },
  Compact: {
    width: 375,
    padding: 20,
    paddingToken: "space/5",
    gap: 16,
    gapToken: "space/4",
    content: 335,
    decoration: 335,
    panelPadding: 24,
    panelPaddingToken: "space/6",
  },
};
const COPY = {
  FR: {
    eyebrow: "APERÇU · PROFIL",
    title: "À propos de mon parcours",
    intro: "Texte de revue — la biographie courte de Costa reste à fournir.",
    method: "Le positionnement et la méthode de travail seront résumés ici sans dupliquer la page À propos.",
    action: "Découvrir mon parcours",
    noticeLabel: "INFORMATION",
    noticeTitle: "Aperçu du profil à compléter",
    noticeBody: "La biographie courte, le positionnement et le résumé de méthode restent à confirmer avant publication.",
    studio: "RÉCIT PERSONNEL",
    words: "PROFIL\nPARCOURS\nMÉTHODE",
    note: "Une vue courte avant le récit complet.",
  },
  EN: {
    eyebrow: "PREVIEW · PROFILE",
    title: "About my journey",
    intro: "Review copy — Costa's short biography still needs to be provided.",
    method: "Positioning and working method will be summarized here without duplicating the About page.",
    action: "Explore my journey",
    noticeLabel: "INFORMATION",
    noticeTitle: "Profile preview to complete",
    noticeBody: "The short biography, positioning and method summary still need confirmation before publication.",
    studio: "PERSONAL STORY",
    words: "PROFILE\nJOURNEY\nMETHOD",
    note: "A short view before the full story.",
  },
};
const PROJECT_SELECTION_STAGE = {
  FR: {
    old: "SÉLECTION 01 · APERÇU VERS LE DÉTAIL",
    corrected: "SÉLECTION 01 · DESTINATION INDISPONIBLE",
  },
  EN: {
    old: "SELECTION 01 · PREVIEW OPENS THE DETAIL",
    corrected: "SELECTION 01 · DESTINATION UNAVAILABLE",
  },
};
const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  muted: "#474747",
  border: "#827F76",
  violet: "#4B3CFF",
  pink: "#FF6BD6",
};

let collections = [];
let variables = [];
let textStyles = new Map();
const boldFont = { family: "Manrope", style: "Bold" };
const regularFont = { family: "Manrope", style: "Regular" };

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
  const result = variables.find(
    (entry) => entry.variableCollectionId === collection.id && entry.name === name,
  );
  if (!result) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return result;
}

function boundColor(name, fallback) {
  return figma.variables.setBoundVariableForPaint(
    solid(fallback),
    "color",
    variable("Semantic/Color", name),
  );
}

function requiredVariant(set, name) {
  const component = set.children.find(
    (entry) => entry.type === "COMPONENT" && entry.name === name,
  );
  if (!component) throw new Error(`Variante absente de ${set.name} : ${name}`);
  return component;
}

function property(instance, name) {
  const key = Object.keys(instance.componentProperties).find((entry) =>
    entry.startsWith(`${name}#`),
  );
  if (!key) throw new Error(`Propriété ${name} absente de ${instance.name}`);
  return key;
}

async function overrideText(instance, name, value) {
  const node = instance.findOne(
    (entry) => entry.type === "TEXT" && entry.name === name,
  );
  if (!node) throw new Error(`Texte à personnaliser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}

async function styledText(value, styleName, colorName, fallback) {
  const style = textStyles.get(styleName);
  if (!style) throw new Error(`Style texte absent : ${styleName}`);
  const node = figma.createText();
  node.fontName = style.fontName;
  node.characters = value;
  await node.setTextStyleIdAsync(style.id);
  node.fills = [boundColor(colorName, fallback)];
  node.textAutoResize = "HEIGHT";
  return node;
}

async function editableText(component, parent, name, value, styleName, colorName, fallback) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = `${name} · editable`;
  component.appendChild(node);
  node.layoutSizingHorizontal = "FILL";
  const key = component.addComponentProperty(name, "TEXT", value);
  node.componentPropertyReferences = { characters: key };
  parent.appendChild(node);
  return node;
}

function plainText(parent, name, value, x, y, width, size, hex, bold = true) {
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

function actionInstance(actionSet, locale) {
  const instance = requiredVariant(
    actionSet,
    "Style=Secondary, State=Default",
  ).createInstance();
  instance.name = "COMP-001 · About profile link";
  instance.setProperties({
    [property(instance, "Label")]: COPY[locale].action,
  });
  return instance;
}

async function incompleteNotice(messageSet, viewport, locale) {
  const size = viewport === "Wide" ? "Section" : "Inline";
  const notice = requiredVariant(
    messageSet,
    `Kind=Info, Size=${size}`,
  ).createInstance();
  notice.name = "COMP-003 · Incomplete profile preview notice";
  const copy = COPY[locale];
  await overrideText(notice, "Kind label", copy.noticeLabel);
  notice.setProperties({
    [property(notice, "Title · Info")]: copy.noticeTitle,
    [property(notice, "Body · Info")]: copy.noticeBody,
  });
  return notice;
}

async function createContentPanel(component, spec, actionSet, messageSet) {
  const config = SPECS[spec.viewport];
  const compact = spec.viewport === "Compact";
  const medium = spec.viewport === "Medium";
  const copy = COPY[spec.locale];
  const panel = figma.createFrame();
  panel.name = "Essential profile preview · reading order";
  component.appendChild(panel);
  panel.resize(config.content, 720);
  panel.layoutMode = "VERTICAL";
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  panel.itemSpacing = compact ? 16 : 20;
  panel.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/4" : "space/5"),
  );
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    panel[field] = config.panelPadding;
    panel.setBoundVariable(
      field,
      variable("Primitives/Space", config.panelPaddingToken),
    );
  }
  panel.fills = [boundColor("surface/canvas", COLORS.canvas)];
  panel.strokes = [boundColor("border/strong", COLORS.ink)];
  panel.strokeWeight = 1;
  panel.setBoundVariable(
    "strokeWeight",
    variable("Primitives/Shape", "stroke/control"),
  );
  panel.strokeAlign = "INSIDE";
  panel.cornerRadius = 0;
  panel.setBoundVariable(
    "cornerRadius",
    variable("Primitives/Shape", "radius/none"),
  );
  panel.clipsContent = false;

  const eyebrow = await styledText(
    copy.eyebrow,
    "Type/Label/SM/Large",
    "text/secondary",
    COLORS.muted,
  );
  eyebrow.name = "Profile preview eyebrow";
  panel.appendChild(eyebrow);
  eyebrow.layoutSizingHorizontal = "FILL";

  await editableText(
    component,
    panel,
    "Section title",
    copy.title,
    compact || medium ? "Type/Display/Section/Compact" : "Type/Display/Section/Large",
    "text/primary",
    COLORS.ink,
  );
  if (spec.state === "Incomplete") {
    const notice = await incompleteNotice(messageSet, spec.viewport, spec.locale);
    panel.appendChild(notice);
    notice.layoutSizingHorizontal = "FILL";
  }
  await editableText(
    component,
    panel,
    "Biography preview",
    copy.intro,
    compact || medium ? "Type/Body/MD/Compact" : "Type/Body/MD/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    panel,
    "Method preview",
    copy.method,
    compact || medium ? "Type/Body/MD/Compact" : "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  );
  const action = actionInstance(actionSet, spec.locale);
  panel.appendChild(action);
  if (compact) action.layoutSizingHorizontal = "FILL";
  return panel;
}

function rule(parent) {
  const node = figma.createRectangle();
  node.name = "Decorative inverse rule";
  parent.appendChild(node);
  node.resize(100, 1);
  node.fills = [boundColor("border/inverse", COLORS.canvas)];
  node.strokes = [];
  node.layoutSizingHorizontal = "FILL";
}

async function createDecoration(component, spec) {
  const config = SPECS[spec.viewport];
  const compact = spec.viewport === "Compact";
  const medium = spec.viewport === "Medium";
  const copy = COPY[spec.locale];
  const board = figma.createFrame();
  board.name = "Editorial profile module · decorative · aria-hidden";
  component.appendChild(board);
  board.resize(config.decoration, 540);
  board.layoutMode = "VERTICAL";
  board.primaryAxisSizingMode = "AUTO";
  board.counterAxisSizingMode = "FIXED";
  const padding = config.panelPadding;
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    board[field] = padding;
    board.setBoundVariable(
      field,
      variable("Primitives/Space", config.panelPaddingToken),
    );
  }
  board.itemSpacing = compact ? 16 : 20;
  board.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/4" : "space/5"),
  );
  board.fills = [boundColor("surface/brand", COLORS.violet)];
  board.strokes = [boundColor("border/strong", COLORS.ink)];
  board.strokeWeight = 1;
  board.setBoundVariable(
    "strokeWeight",
    variable("Primitives/Shape", "stroke/control"),
  );
  board.strokeAlign = "INSIDE";
  board.cornerRadius = 0;
  board.setBoundVariable(
    "cornerRadius",
    variable("Primitives/Shape", "radius/none"),
  );
  board.clipsContent = false;

  const studio = await styledText(
    copy.studio,
    "Type/Label/SM/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  studio.name = "Decorative profile label";
  board.appendChild(studio);
  studio.layoutSizingHorizontal = "FILL";
  rule(board);

  const words = await styledText(
    copy.words,
    compact || medium ? "Type/Display/Section/Compact" : "Type/Display/Section/Large",
    "text/on-brand",
    COLORS.canvas,
  );
  words.name = "Decorative profile words";
  board.appendChild(words);
  words.layoutSizingHorizontal = "FILL";

  const note = figma.createFrame();
  note.name = "Editorial note · decorative";
  board.appendChild(note);
  note.resize(config.decoration - padding * 2, 160);
  note.layoutMode = "VERTICAL";
  note.primaryAxisSizingMode = "AUTO";
  note.counterAxisSizingMode = "FIXED";
  const notePadding = compact || medium ? 16 : 24;
  const notePaddingToken = compact || medium ? "space/4" : "space/6";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    note[field] = notePadding;
    note.setBoundVariable(
      field,
      variable("Primitives/Space", notePaddingToken),
    );
  }
  note.fills = [boundColor("surface/editorial", COLORS.pink)];
  note.strokes = [];
  note.layoutSizingHorizontal = "FILL";
  const noteText = await styledText(
    copy.note,
    compact || medium ? "Type/Editorial/MD/Compact" : "Type/Editorial/MD/Large",
    "text/on-accent",
    COLORS.ink,
  );
  noteText.name = "Decorative editorial note";
  note.appendChild(noteText);
  noteText.layoutSizingHorizontal = "FILL";
  return board;
}

function variantSpecs() {
  return STATES.flatMap((state) =>
    LOCALES.flatMap((locale) =>
      VIEWPORTS.map((viewport) => ({ viewport, locale, state })),
    ),
  );
}

function variantName({ viewport, locale, state }) {
  return `Viewport=${viewport}, Locale=${locale}, State=${state}`;
}

async function createVariant(spec, parent, actionSet, messageSet) {
  const config = SPECS[spec.viewport];
  const horizontal = spec.viewport === "Wide";
  const component = figma.createComponent();
  component.name = variantName(spec);
  parent.appendChild(component);
  component.resize(config.width, 1000);
  component.layoutMode = horizontal ? "HORIZONTAL" : "VERTICAL";
  component.primaryAxisSizingMode = horizontal ? "FIXED" : "AUTO";
  component.counterAxisSizingMode = horizontal ? "AUTO" : "FIXED";
  component.itemSpacing = config.gap;
  component.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", config.gapToken),
  );
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = config.padding;
    component.setBoundVariable(
      field,
      variable("Primitives/Space", config.paddingToken),
    );
  }
  component.fills = [boundColor("surface/subtle", COLORS.subtle)];
  component.strokes = [boundColor("border/default", COLORS.border)];
  component.strokeWeight = 1;
  component.setBoundVariable(
    "strokeWeight",
    variable("Primitives/Shape", "stroke/control"),
  );
  component.strokeAlign = "INSIDE";
  component.cornerRadius = 0;
  component.setBoundVariable(
    "cornerRadius",
    variable("Primitives/Shape", "radius/none"),
  );
  component.clipsContent = false;
  await createContentPanel(component, spec, actionSet, messageSet);
  await createDecoration(component, spec);
  component.description = `COMP-303 · ${spec.viewport}/${spec.locale}/${spec.state}. Le contenu essentiel, puis COMP-001 vers À propos, précèdent toujours la décoration. ${spec.state === "Incomplete" ? "COMP-003 signale explicitement les contenus manquants." : "Les deux paragraphes sont des textes de revue non publiables."} Aucun parcours, emploi, compétence ou principe personnel n'est inventé.`;
  return component;
}

function repairWideSizing(set) {
  let repaired = 0;
  for (const state of STATES) {
    for (const locale of LOCALES) {
      const component = requiredVariant(
        set,
        variantName({ viewport: "Wide", locale, state }),
      );
      const expectedChildren = [
        "Essential profile preview · reading order",
        "Editorial profile module · decorative · aria-hidden",
      ];
      if (expectedChildren.some(
        (name) => !component.children.some((entry) => entry.name === name),
      )) {
        throw new Error(`Variante Wide personnalisée : ${component.name} · arrêt sans remplacement`);
      }
      const needsRepair =
        component.layoutMode !== "HORIZONTAL" ||
        Math.abs(component.width - SPECS.Wide.width) > 0.5 ||
        component.primaryAxisSizingMode !== "FIXED" ||
        component.counterAxisSizingMode !== "AUTO";
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisSizingMode = "FIXED";
      component.resize(SPECS.Wide.width, component.height);
      component.counterAxisSizingMode = "AUTO";
      if (needsRepair) repaired += 1;
    }
  }
  return repaired;
}

function arrangeSet(set) {
  const columns = [
    { viewport: "Wide", x: 0 },
    { viewport: "Medium", x: 1600 },
    { viewport: "Compact", x: 2528 },
  ];
  const rows = STATES.flatMap((state) =>
    LOCALES.map((locale) => ({ state, locale })),
  );
  const rowPositions = [];
  let y = 0;
  for (const row of rows) {
    const members = [];
    for (const column of columns) {
      const name = variantName({ ...row, viewport: column.viewport });
      const component = set.children.find(
        (entry) => entry.type === "COMPONENT" && entry.name === name,
      );
      if (!component) throw new Error(`Variante COMP-303 absente : ${name}`);
      component.x = column.x;
      component.y = y;
      members.push(component);
    }
    rowPositions.push({ ...row, y });
    y += Math.max(...members.map((entry) => entry.height)) + 180;
  }
  const height = Math.max(1, y - 180);
  set.resizeWithoutConstraints(2903, height);
  return { columns, rowPositions, height };
}

function infoFrame(name, width, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    plainText(frame, `Line ${textY}`, value, x, textY, width - x - 40, size, color);
  }
  return frame;
}

function documentationFrame() {
  const frame = infoFrame(
    "_Generated/Home Profile Preview · Documentation",
    3300,
    0,
    220,
    COLORS.canvas,
    [
      ["COMP-303 · PAGE COMPOSITION · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
      ["Aperçu du profil", 42, COLORS.ink, 48, 68],
      ["Donner un angle personnel puis mener vers À propos, sans inventer la biographie, le parcours ou la méthode de Costa.", 18, COLORS.muted, 48, 136],
    ],
  );
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page, arrangement) {
  const board = figma.createFrame();
  board.name = "_Generated/Home Profile Preview · Preview surface";
  board.resize(3300, arrangement.height + 430);
  board.x = 0;
  board.y = 250;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  board.clipsContent = false;
  page.insertChild(0, board);
  for (const column of arrangement.columns) {
    plainText(
      page,
      `_Generated/Home Profile Preview · Column · ${column.viewport}`,
      `${column.viewport.toUpperCase()} · ${SPECS[column.viewport].width} PX`,
      190 + column.x,
      320,
      SPECS[column.viewport].width,
      15,
      COLORS.violet,
    );
  }
  plainText(
    page,
    "_Generated/Home Profile Preview · Content warning",
    "CONTENU DE REVUE · BIOGRAPHIE, POSITIONNEMENT ET MÉTHODE À FOURNIR",
    190,
    365,
    1400,
    13,
    COLORS.muted,
  );
  for (const row of arrangement.rowPositions) {
    plainText(
      page,
      `_Generated/Home Profile Preview · Row · ${row.state} ${row.locale}`,
      `${row.state.toUpperCase()} · ${row.locale}`,
      20,
      520 + row.y,
      155,
      14,
      COLORS.ink,
    );
  }
}

function syncPreviewLayout(page, arrangement) {
  const board = page.children.find(
    (entry) => entry.name === "_Generated/Home Profile Preview · Preview surface",
  );
  const notes = page.children.find(
    (entry) => entry.name === "_Generated/Home Profile Preview · Usage notes",
  );
  if (!board || !notes) {
    throw new Error("Documentation COMP-303 incomplète : arrêt sans remplacement");
  }
  board.resize(3300, arrangement.height + 430);
  notes.y = 760 + arrangement.height;
  for (const row of arrangement.rowPositions) {
    const label = page.children.find(
      (entry) =>
        entry.name ===
        `_Generated/Home Profile Preview · Row · ${row.state} ${row.locale}`,
    );
    if (!label) {
      throw new Error(`Repère de ligne COMP-303 absent : ${row.state}/${row.locale}`);
    }
    label.y = 520 + row.y;
  }
}

function notesFrame(y) {
  return infoFrame(
    "_Generated/Home Profile Preview · Usage notes",
    3300,
    y,
    520,
    COLORS.subtle,
    [
      ["RESPONSABILITÉ · Donner un angle personnel court et mener vers le récit complet sur À propos.", 16, COLORS.ink, 40, 24],
      ["NAVIGATION · COMP-001 Secondary mène à À propos ; aucune destination CV, contact ou projet n'est ajoutée ici.", 16, COLORS.ink, 40, 86],
      ["VÉRITÉ · Les paragraphes sont des textes de revue ; aucun parcours, emploi, compétence ou principe n'est attribué à Costa.", 16, COLORS.ink, 40, 148],
      ["ÉTATS · Normal éprouve la structure ; Incomplete ajoute COMP-003 et conserve une sortie explicite vers À propos.", 16, COLORS.ink, 40, 210],
      ["RESPONSIVE · Le texte et l'action précèdent la décoration en 1440, 768 et 375 px ; contrôler ensuite 320 px et le zoom.", 16, COLORS.ink, 40, 272],
      ["ACCESSIBILITÉ · Section nommée, ordre linéaire, action explicite et module violet entièrement décoratif et supprimable.", 16, COLORS.ink, 40, 334],
      ["CONTENU · Biographie courte, positionnement, méthode et traduction restent à rédiger et valider avant publication.", 16, COLORS.ink, 40, 396],
      ["VALIDATION · Revoir Normal et Incomplete en FR/EN et Wide/Medium/Compact avant toute approbation de première passe.", 16, COLORS.ink, 40, 458],
    ],
  );
}

async function syncApprovedProjectSelection(set) {
  const expected = VIEWPORTS.flatMap((viewport) =>
    LOCALES.flatMap((locale) =>
      ["Default", "Unavailable", "MediaError"].map(
        (state) => `Viewport=${viewport}, Locale=${locale}, State=${state}`,
      ),
    ),
  );
  if (
    set.children.length !== expected.length ||
    expected.some((name) => !set.children.some((entry) => entry.name === name))
  ) {
    throw new Error("COMP-302 modifié : validation non synchronisée");
  }
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      const component = requiredVariant(
        set,
        `Viewport=${viewport}, Locale=${locale}, State=Unavailable`,
      );
      const label = component.findOne(
        (entry) =>
          entry.type === "TEXT" &&
          entry.name === "Decorative production label · aria-hidden",
      );
      if (!label) throw new Error(`Libellé Unavailable absent : ${component.name}`);
      const values = PROJECT_SELECTION_STAGE[locale];
      if (label.characters !== values.old && label.characters !== values.corrected) {
        throw new Error(`Libellé personnalisé sur ${component.name} : arrêt sans remplacement`);
      }
      if (label.characters === values.old) {
        await figma.loadFontAsync(label.fontName);
        label.characters = values.corrected;
      }
    }
  }
  set.description = "COMP-302 · 18 références Wide/Medium/Compact × FR/EN × Default/Unavailable/MediaError approuvées par Costa comme base structurelle de première passe le 2026-09-26. Les libellés Unavailable indiquent une destination indisponible ; contenus SideQuest, reflow à 320 px, zoom et comportements accessibles réels restent ouverts pour les écrans ou la seconde passe globale.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-302 · Sélection de projet d'accueil",
  );
  const status = card && card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) {
    await figma.loadFontAsync(status.fontName);
    status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 18 RÉFÉRENCES";
  }
}

function updateIndex() {
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  if (!index) return;
  index.resize(1440, Math.max(index.height, 6480));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-303 · Aperçu du profil",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-303 · Aperçu du profil";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 6270;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-303 · Aperçu du profil", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 12 RÉFÉRENCES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "1440/768/375 · FR/EN · normal/incomplet · compose COMP-001 et COMP-003.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "03.3 — Home Profile Preview", 1030, 65, 280, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of [
    "surface/canvas",
    "surface/subtle",
    "surface/brand",
    "surface/editorial",
    "text/primary",
    "text/secondary",
    "text/on-brand",
    "text/on-accent",
    "border/default",
    "border/strong",
    "border/inverse",
  ]) {
    variable("Semantic/Color", name);
  }
  for (const name of [
    "space/4",
    "space/5",
    "space/6",
    "space/8",
    "space/12",
    "space/16",
  ]) {
    variable("Primitives/Space", name);
  }
  for (const name of ["radius/none", "stroke/control"]) {
    variable("Primitives/Shape", name);
  }
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of [
    "Type/Display/Section/Compact",
    "Type/Display/Section/Large",
    "Type/Body/MD/Compact",
    "Type/Body/MD/Large",
    "Type/Editorial/MD/Compact",
    "Type/Editorial/MD/Large",
    "Type/Label/SM/Large",
  ]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}

async function main() {
  figma.notify("Préparation de COMP-303 Aperçu du profil…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const actionPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.1 — Action",
  );
  const messagePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message",
  );
  const projectSelectionPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.2 — Home Project Selection",
  );
  const actionSet = actionPage && actionPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Action",
  );
  const messageSet = messagePage && messagePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message",
  );
  const projectSelectionSet = projectSelectionPage && projectSelectionPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Home project selection",
  );
  if (!actionSet || !messageSet || !projectSelectionSet) {
    throw new Error("COMP-001, COMP-003 ou COMP-302 absent : générer puis valider les dépendances avant COMP-303");
  }
  requiredVariant(actionSet, "Style=Secondary, State=Default");
  for (const size of ["Inline", "Section"]) {
    requiredVariant(messageSet, `Kind=Info, Size=${size}`);
  }

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "03.3 — Home Profile Preview",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "03.3 — Home Profile Preview";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Home profile preview",
  );
  const expected = variantSpecs().map(variantName);
  if (existing) {
    if (
      existing.children.length !== expected.length ||
      expected.some((name) => !existing.children.some((entry) => entry.name === name))
    ) {
      throw new Error("COMP-303 modifié : arrêt sans remplacement");
    }
    const repaired = repairWideSizing(existing);
    const arrangement = arrangeSet(existing);
    syncPreviewLayout(page, arrangement);
    existing.description = "COMP-303 · Première passe à revoir. Viewport 1440/768/375 × FR/EN × State Normal/Incomplete. La hauteur des quatre variantes Wide suit désormais leur contenu. Compose COMP-001 vers À propos et COMP-003 pour le contenu incomplet ; toute biographie et méthode restent des textes de revue non publiables.";
    await syncApprovedProjectSelection(projectSelectionSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin(
      repaired > 0
        ? `COMP-303 corrigé · hauteur ajustée sur ${repaired} variantes Wide`
        : "COMP-303 préservé · hauteur Wide déjà corrigée",
    );
    return;
  }

  for (const stale of page.children.filter(
    (entry) =>
      entry.name === "_Generated/Home Profile Preview Draft" ||
      entry.name.startsWith("_Generated/Home Profile Preview ·"),
  )) {
    stale.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Home Profile Preview Draft";
  staging.resize(1, 1);
  staging.x = -5000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const spec of variantSpecs()) {
    components.push(
      await createVariant(spec, staging, actionSet, messageSet),
    );
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Home profile preview";
  set.description = "COMP-303 · Première passe à revoir. Viewport 1440/768/375 × FR/EN × State Normal/Incomplete. Compose COMP-001 vers À propos et COMP-003 pour le contenu incomplet ; toute biographie et méthode restent des textes de revue non publiables.";
  set.x = 190;
  set.y = 520;
  const arrangement = arrangeSet(set);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page, arrangement);
  page.appendChild(notesFrame(760 + arrangement.height));
  await syncApprovedProjectSelection(projectSelectionSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-303 créé · 12 références à revoir par captures");
}

main().catch((error) => {
  figma.notify(`Erreur Home Profile Preview Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
