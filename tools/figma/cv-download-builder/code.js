const LAYOUTS = ["Wide", "Compact"];
const STATES = ["Default", "Focus", "Active", "Unavailable"];
const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  muted: "#474747",
  border: "#827F76",
  violet: "#4B3CFF",
};
const COPY = {
  FR: {
    title: "Mon CV",
    context: "Téléchargez le document correspondant à la langue active.",
    details: "Français · format et taille à confirmer",
    action: "Télécharger le CV",
    unavailableLabel: "INDISPONIBLE",
    unavailableTitle: "CV temporairement indisponible",
    unavailableBody: "Le fichier français sera proposé après vérification.",
  },
  EN: {
    title: "My CV",
    context: "Download the document matching the active language.",
    details: "English · format and size to be confirmed",
    action: "Download the CV",
    unavailableLabel: "UNAVAILABLE",
    unavailableTitle: "CV temporarily unavailable",
    unavailableBody: "The English file will be offered after verification.",
  },
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

function actionInstance(actionSet, state, width) {
  const action = requiredVariant(actionSet, `Style=Secondary, State=${state}`).createInstance();
  action.name = "COMP-001 · CV download action";
  action.setProperties({ [property(action, "Label")]: COPY.FR.action });
  action.resize(width, action.height);
  return action;
}

function unavailableInstance(messageSet, width) {
  const notice = requiredVariant(messageSet, "Kind=Unavailable, Size=Inline").createInstance();
  notice.name = "COMP-003 · CV unavailable notice";
  notice.setProperties({
    [property(notice, "Title · Unavailable")]: COPY.FR.unavailableTitle,
    [property(notice, "Body · Unavailable")]: COPY.FR.unavailableBody,
  });
  notice.resize(width, notice.height);
  return notice;
}

async function createVariant(layout, state, parent, actionSet, messageSet) {
  const compact = layout === "Compact";
  const unavailable = state === "Unavailable";
  const component = figma.createComponent();
  component.name = `Layout=${layout}, State=${state}`;
  parent.appendChild(component);
  component.resize(compact ? 320 : 900, 420);
  component.layoutMode = compact ? "VERTICAL" : "HORIZONTAL";
  component.primaryAxisSizingMode = compact ? "AUTO" : "FIXED";
  component.counterAxisSizingMode = compact ? "FIXED" : "AUTO";
  component.primaryAxisAlignItems = compact ? "MIN" : "SPACE_BETWEEN";
  component.counterAxisAlignItems = compact ? "MIN" : "CENTER";
  const padding = compact ? 24 : 32;
  const paddingToken = compact ? "space/6" : "space/8";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = padding;
    component.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  }
  component.itemSpacing = compact ? 24 : 40;
  component.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/6" : "space/10"),
  );
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
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

  const content = figma.createFrame();
  content.name = "CV context";
  component.appendChild(content);
  content.resize(compact ? 272 : 500, 220);
  content.layoutMode = "VERTICAL";
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.itemSpacing = 12;
  content.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/3"));
  content.fills = [];
  content.strokes = [];
  content.clipsContent = false;
  if (compact) content.layoutSizingHorizontal = "FILL";

  await editableText(
    component,
    content,
    "Title",
    COPY.FR.title,
    compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    content,
    "Context",
    COPY.FR.context,
    "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  );
  await editableText(
    component,
    content,
    "Document details",
    COPY.FR.details,
    "Type/Label/SM/Large",
    "text/primary",
    COLORS.ink,
  );

  const controlWidth = compact ? 272 : 276;
  const control = unavailable
    ? unavailableInstance(messageSet, controlWidth)
    : actionInstance(actionSet, state, controlWidth);
  component.appendChild(control);
  if (compact) control.layoutSizingHorizontal = "FILL";
  component.description = `COMP-214 · ${layout}/${state}. Le contexte, la langue et les détails du document précèdent ou accompagnent l'action. ${unavailable ? "Aucune action : COMP-003 explique l'indisponibilité." : "Instance COMP-001 Secondary ; aucune destination n'est liée dans cette planche."} Le fichier réel doit correspondre à la langue active et être vérifié avant publication.`;
  return component;
}

function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(2000, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    plainText(frame, `Line ${textY}`, value, x, textY, 1900 - x, size, color);
  }
  return frame;
}

function documentationFrame() {
  const frame = infoFrame("_Generated/CV Download · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-214 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Téléchargement du CV", 42, COLORS.ink, 48, 68],
    ["Le document de la langue active après le récit du profil. Aucun fichier n'est encore fourni.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/CV Download · Preview surface";
  frame.resize(2000, 2600);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  plainText(page, "Wide heading", "LARGE · 900 PX", 190, 320, 500, 15, COLORS.violet);
  plainText(page, "Compact heading", "COMPACT · 320 PX", 1390, 320, 500, 15, COLORS.violet);
  const labels = ["DEFAULT", "FOCUS", "ACTIVE", "INDISPONIBLE"];
  labels.forEach((label, index) => plainText(page, `State ${label}`, label, 30, 470 + index * 540, 130, 14, COLORS.ink));
  plainText(page, "English heading", "ENGLISH · REVIEW EXAMPLES", 190, 2940, 700, 16, COLORS.violet);
}

function notesFrame() {
  return infoFrame("_Generated/CV Download · Usage notes", 3650, 450, COLORS.subtle, [
    ["USAGE · Page À propos après le récit du profil ; le lien simple du pied de page reste distinct.", 16, COLORS.ink, 40, 24],
    ["LANGUE · Le fichier suit uniquement la langue active ; aucun choix automatique d'une autre langue.", 16, COLORS.ink, 40, 86],
    ["DOCUMENT · Langue et format annoncés ; taille ajoutée uniquement lorsqu'elle est connue et vérifiée.", 16, COLORS.ink, 40, 148],
    ["INDISPONIBLE · Retirer l'action et expliquer la situation ; ne jamais publier de lien cassé ou contrôle ambigu.", 16, COLORS.ink, 40, 210],
    ["ACCESSIBILITÉ · Action nommée, focus visible, document et langue compréhensibles avant activation.", 16, COLORS.ink, 40, 272],
    ["RESPONSIVE · Contexte puis action en disposition verticale à 320 px, sans débordement horizontal.", 16, COLORS.ink, 40, 334],
    ["VÉRITÉ · Aucun fichier, format, taille ou URL de cette planche n'est une donnée publiable.", 16, COLORS.ink, 40, 396],
  ]);
}

async function overrideText(instance, name, value) {
  const node = instance.findOne((entry) => entry.type === "TEXT" && entry.name === name);
  if (!node) throw new Error(`Texte à localiser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}

async function localizeReview(instance, state, locale) {
  const copy = COPY[locale];
  instance.setProperties({
    [property(instance, "Title")]: copy.title,
    [property(instance, "Context")]: copy.context,
    [property(instance, "Document details")]: copy.details,
  });
  if (state === "Unavailable") {
    const notice = instance.findOne(
      (entry) => entry.type === "INSTANCE" && entry.name === "COMP-003 · CV unavailable notice",
    );
    if (!notice) throw new Error("Message de CV indisponible absent");
    notice.setProperties({
      [property(notice, "Title · Unavailable")]: copy.unavailableTitle,
      [property(notice, "Body · Unavailable")]: copy.unavailableBody,
    });
    await overrideText(notice, "Kind label", copy.unavailableLabel);
  } else {
    const action = instance.findOne(
      (entry) => entry.type === "INSTANCE" && entry.name === "COMP-001 · CV download action",
    );
    if (!action) throw new Error("Action de téléchargement absente");
    action.setProperties({ [property(action, "Label")]: copy.action });
  }
}

async function reviewInstance(source, state, locale, page, x, y) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · ${locale}`;
  page.appendChild(instance);
  await localizeReview(instance, state, locale);
  instance.x = x;
  instance.y = y;
  return instance;
}

function syncApprovedPrinciples(set) {
  if (
    set.children.length !== 4 ||
    ["Wide", "Compact"].some((layout) =>
      ["Normal", "Incomplete"].some(
        (state) =>
          !set.children.some(
            (entry) => entry.name === `Layout=${layout}, State=${state}`,
          ),
      ),
    )
  ) {
    throw new Error("COMP-212 modifié : validation non synchronisée");
  }
  set.description = "COMP-212 · 4 variantes Wide/Compact × Normal/Incomplete approuvées par Costa comme base structurelle de première passe le 2026-09-22. Contenus de revue uniquement ; seconde passe globale prévue.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-212 · Liste de principes de travail",
  );
  if (!card) return;
  const status = card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 4 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  if (!index) return;
  index.resize(1440, Math.max(index.height, 5420));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-214 · Téléchargement du CV",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-214 · Téléchargement du CV";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 5050;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-214 · Téléchargement du CV", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 8 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Large/compact · défaut/focus/active/indisponible · fichier de la langue active.", 28, 105, 1090, 16, COLORS.muted, false);
  plainText(card, "Page", "02.24 — CV Download", 1040, 65, 270, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) {
    variable("Semantic/Color", name);
  }
  for (const name of ["space/3", "space/6", "space/8", "space/10"]) {
    variable("Primitives/Space", name);
  }
  for (const name of ["radius/none", "stroke/control"]) {
    variable("Primitives/Shape", name);
  }
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of [
    "Type/Label/SM/Large",
    "Type/Heading/MD/Large",
    "Type/Heading/LG/Large",
    "Type/Body/MD/Large",
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
  figma.notify("Préparation de COMP-214 Téléchargement du CV…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const actionPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.1 — Action",
  );
  const actionSet = actionPage && actionPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Action",
  );
  const messagePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message",
  );
  const messageSet = messagePage && messagePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message",
  );
  const principlesPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.23 — Work Principles",
  );
  const principlesSet = principlesPage && principlesPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Work principles",
  );
  if (!actionSet || !messageSet || !principlesSet) {
    throw new Error("COMP-001, COMP-003 ou COMP-212 absent : générer les dépendances avant COMP-214");
  }
  for (const state of ["Default", "Focus", "Active"]) {
    requiredVariant(actionSet, `Style=Secondary, State=${state}`);
  }
  requiredVariant(messageSet, "Kind=Unavailable, Size=Inline");

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.24 — CV Download",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "02.24 — CV Download";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "CV download",
  );
  if (existing) {
    if (
      existing.children.length !== 8 ||
      LAYOUTS.some((layout) =>
        STATES.some(
          (state) =>
            !existing.children.some(
              (entry) => entry.name === `Layout=${layout}, State=${state}`,
            ),
        ),
      )
    ) {
      throw new Error("COMP-214 modifié : arrêt sans remplacement");
    }
    syncApprovedPrinciples(principlesSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-214 préservé · 8 variantes à revoir");
    return;
  }

  for (const staleDraft of page.children.filter(
    (entry) => entry.name === "_Generated/CV Download Draft",
  )) {
    staleDraft.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/CV Download Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const layout of LAYOUTS) {
    for (const state of STATES) {
      components.push(await createVariant(layout, state, staging, actionSet, messageSet));
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "CV download";
  set.description = "COMP-214 · Première passe à revoir. Wide/Compact × Default/Focus/Active/Unavailable ; action COMP-001 ou message COMP-003. Aucun fichier ni lien réel n'est associé.";
  set.x = 190;
  set.y = 520;
  const positions = {};
  STATES.forEach((state, index) => {
    positions[`Wide/${state}`] = [0, index * 540];
    positions[`Compact/${state}`] = [1200, index * 540];
  });
  for (const layout of LAYOUTS) {
    for (const state of STATES) {
      const component = requiredVariant(set, `Layout=${layout}, State=${state}`);
      const [x, y] = positions[`${layout}/${state}`];
      component.x = x;
      component.y = y;
    }
  }
  set.resizeWithoutConstraints(1520, 2200);
  staging.remove();

  page.appendChild(documentationFrame());
  previewSurface(page);
  await reviewInstance(
    requiredVariant(set, "Layout=Wide, State=Default"),
    "Default",
    "EN",
    page,
    190,
    3000,
  );
  await reviewInstance(
    requiredVariant(set, "Layout=Compact, State=Unavailable"),
    "Unavailable",
    "EN",
    page,
    1390,
    3000,
  );
  page.appendChild(notesFrame());
  syncApprovedPrinciples(principlesSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-214 créé · 8 variantes et références FR/EN à revoir");
}

main().catch((error) => {
  figma.notify(`Erreur CV Download Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
