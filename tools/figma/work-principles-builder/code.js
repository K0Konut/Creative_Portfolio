const LAYOUTS = ["Wide", "Compact"];
const STATES = ["Normal", "Incomplete"];
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
    title: "Principes de travail",
    intro: "Exemples de structure · contenu à rédiger et à vérifier.",
    noticeLabel: "INFORMATION",
    noticeTitle: "Principes à compléter",
    noticeBody: "Le nombre et les formulations restent à confirmer avant publication.",
    principles: [
      ["Principe A à définir", "Décrire concrètement ce principe avec un exemple vérifiable."],
      ["Principe B à définir", "Expliquer son application sans formuler de promesse non démontrable."],
      ["Principe C à définir", "Présenter une idée autonome avec un contexte précis et honnête."],
      ["Principe D à définir", "Relier ce principe à une pratique réelle lorsque les faits sont disponibles."],
    ],
  },
  EN: {
    title: "Working principles",
    intro: "Structure examples · content to write and verify.",
    noticeLabel: "INFORMATION",
    noticeTitle: "Principles to complete",
    noticeBody: "The number and wording still need confirmation before publication.",
    principles: [
      ["Principle A to define", "Describe this principle concretely with a verifiable example."],
      ["Principle B to define", "Explain how it applies without making an unsupported promise."],
      ["Principle C to define", "Present one independent idea with precise and honest context."],
      ["Principle D to define", "Connect it to a real practice when verified facts are available."],
    ],
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

async function addEditableText(component, name, value, styleName, colorName, fallback) {
  const node = await styledText(value, styleName, colorName, fallback);
  node.name = `${name} · editable`;
  component.appendChild(node);
  node.layoutSizingHorizontal = "FILL";
  const key = component.addComponentProperty(name, "TEXT", value);
  node.componentPropertyReferences = { characters: key };
  return node;
}

function configurePrinciple(instance, locale, index) {
  const [title, body] = COPY[locale].principles[index];
  instance.setProperties({
    [property(instance, "Title")]: title,
    [property(instance, "Body")]: body,
    [property(instance, "Show accent")]: true,
  });
}

function principleInstance(set, layout, locale, index, width) {
  const instance = requiredVariant(set, `Layout=${layout}`).createInstance();
  instance.name = `COMP-213 · Principle ${index + 1}`;
  configurePrinciple(instance, locale, index);
  instance.resize(width, instance.height);
  return instance;
}

function wideRow(parent, principleSet, locale, indexes) {
  const row = figma.createFrame();
  row.name = `Row · principles ${indexes.map((index) => index + 1).join("–")}`;
  parent.appendChild(row);
  row.resize(1056, 220);
  row.layoutMode = "HORIZONTAL";
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "AUTO";
  row.counterAxisAlignItems = "MIN";
  row.itemSpacing = 16;
  row.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/4"));
  row.fills = [];
  row.strokes = [];
  row.clipsContent = false;
  row.layoutSizingHorizontal = "FILL";
  for (const index of indexes) row.appendChild(principleInstance(principleSet, "Wide", locale, index, 520));
  return row;
}

function principleList(component, layout, state, principleSet, locale) {
  const compact = layout === "Compact";
  const list = figma.createFrame();
  list.name = "Principle list · linear reading order";
  component.appendChild(list);
  list.resize(compact ? 272 : 1056, 1200);
  list.layoutMode = "VERTICAL";
  list.primaryAxisSizingMode = "AUTO";
  list.counterAxisSizingMode = "FIXED";
  list.itemSpacing = 16;
  list.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/4"));
  list.fills = [];
  list.strokes = [];
  list.clipsContent = false;
  list.layoutSizingHorizontal = "FILL";
  const count = state === "Normal" ? 4 : 2;
  if (compact) {
    for (let index = 0; index < count; index++) {
      list.appendChild(principleInstance(principleSet, "Compact", locale, index, 272));
    }
  } else {
    for (let index = 0; index < count; index += 2) {
      wideRow(list, principleSet, locale, [index, index + 1]);
    }
  }
  return list;
}

async function addNotice(component, layout, messageSet) {
  const compact = layout === "Compact";
  const notice = requiredVariant(
    messageSet,
    `Kind=Info, Size=${compact ? "Inline" : "Section"}`,
  ).createInstance();
  notice.name = "COMP-003 · Incomplete principles notice";
  component.appendChild(notice);
  notice.resize(compact ? 272 : 1056, notice.height);
  notice.setProperties({
    [property(notice, "Title · Info")]: COPY.FR.noticeTitle,
    [property(notice, "Body · Info")]: COPY.FR.noticeBody,
  });
  return notice;
}

async function createVariant(layout, state, parent, principleSet, messageSet) {
  const compact = layout === "Compact";
  const component = figma.createComponent();
  component.name = `Layout=${layout}, State=${state}`;
  parent.appendChild(component);
  component.resize(compact ? 320 : 1120, 1500);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "MIN";
  const padding = compact ? 24 : 32;
  const paddingToken = compact ? "space/6" : "space/8";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = padding;
    component.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  }
  component.itemSpacing = compact ? 16 : 24;
  component.setBoundVariable(
    "itemSpacing",
    variable("Primitives/Space", compact ? "space/4" : "space/6"),
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

  await addEditableText(
    component,
    "Title",
    COPY.FR.title,
    compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large",
    "text/primary",
    COLORS.ink,
  );
  await addEditableText(
    component,
    "Intro",
    COPY.FR.intro,
    "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  );
  if (state === "Incomplete") await addNotice(component, layout, messageSet);
  principleList(component, layout, state, principleSet, "FR");
  component.description = `COMP-212 · ${layout}/${state}. Répétition statique de COMP-213 dans un ordre de lecture linéaire. ${state === "Normal" ? "Quatre emplacements de densité, nombre final à confirmer." : "Deux emplacements et un message explicite de contenu incomplet."} Aucun témoignage, métrique ou promesse non démontrable.`;
  return component;
}

function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(2200, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    plainText(frame, `Line ${textY}`, value, x, textY, 2100 - x, size, color);
  }
  return frame;
}

function documentationFrame() {
  const frame = infoFrame("_Generated/Work Principles · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-212 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Liste de principes de travail", 42, COLORS.ink, 48, 68],
    ["Une liste statique et adaptable. Le nombre, l'ordre et les formulations réels restent à définir.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Work Principles · Preview surface";
  frame.resize(2200, 3300);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  plainText(page, "Wide heading", "LARGE · 1120 PX", 190, 320, 500, 15, COLORS.violet);
  plainText(page, "Compact heading", "COMPACT · 320 PX", 1590, 320, 500, 15, COLORS.violet);
  plainText(page, "Normal heading", "NORMAL · FR", 48, 470, 120, 14, COLORS.ink);
  plainText(page, "Incomplete heading", "CONTENU INCOMPLET · FR", 18, 1930, 170, 14, COLORS.ink);
  plainText(page, "English heading", "ENGLISH · REVIEW EXAMPLES", 190, 3590, 700, 16, COLORS.violet);
}

function notesFrame() {
  return infoFrame("_Generated/Work Principles · Usage notes", 4750, 450, COLORS.subtle, [
    ["USAGE · Page À propos uniquement ; COMP-212 regroupe des instances statiques de COMP-213.", 16, COLORS.ink, 40, 24],
    ["ORDRE · Même ordre dans le DOM et visuellement ; la disposition compacte revient à une seule colonne.", 16, COLORS.ink, 40, 86],
    ["CONTENU · Quatre puis deux emplacements de revue ; nombre, ordre et formulations finales non confirmés.", 16, COLORS.ink, 40, 148],
    ["INCOMPLET · Message explicite avant les principes disponibles ; ne jamais inventer les éléments manquants.", 16, COLORS.ink, 40, 210],
    ["ACCESSIBILITÉ · Structure de liste si l'ordre ou le regroupement le justifie ; aucune information portée par la grille.", 16, COLORS.ink, 40, 272],
    ["RESPONSIVE · Une colonne à 320 px, aucune troncature et hauteur déterminée par le contenu de chaque principe.", 16, COLORS.ink, 40, 334],
    ["VÉRITÉ · Aucun témoignage, métrique, promesse ou manière de travailler n'est attribué à Costa dans cette planche.", 16, COLORS.ink, 40, 396],
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
    [property(instance, "Intro")]: copy.intro,
  });
  if (state === "Incomplete") {
    const notice = instance.findOne(
      (entry) => entry.type === "INSTANCE" && entry.name === "COMP-003 · Incomplete principles notice",
    );
    if (!notice) throw new Error("Message de principes incomplets absent");
    notice.setProperties({
      [property(notice, "Title · Info")]: copy.noticeTitle,
      [property(notice, "Body · Info")]: copy.noticeBody,
    });
    await overrideText(notice, "Kind label", copy.noticeLabel);
  }
  const principles = instance
    .findAll(
      (entry) => entry.type === "INSTANCE" && entry.name.startsWith("COMP-213 · Principle "),
    )
    .sort((first, second) => first.name.localeCompare(second.name));
  for (let index = 0; index < principles.length; index++) {
    configurePrinciple(principles[index], locale, index);
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

function syncApprovedPrinciple(set) {
  if (
    set.children.length !== 2 ||
    LAYOUTS.some(
      (layout) => !set.children.some((entry) => entry.name === `Layout=${layout}`),
    )
  ) {
    throw new Error("COMP-213 modifié : validation non synchronisée");
  }
  set.description = "COMP-213 · Deux dispositions Wide/Compact approuvées par Costa comme base structurelle de première passe le 2026-09-22. Contenus de revue uniquement ; seconde passe globale prévue.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-213 · Principe de travail",
  );
  if (!card) return;
  const status = card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 2 DISPOSITIONS";
}

function updateIndex() {
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  if (!index) return;
  index.resize(1440, Math.max(index.height, 5020));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-212 · Liste de principes de travail",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-212 · Liste de principes de travail";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 4650;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-212 · Liste de principes de travail", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 4 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Large/compact · normal/incomplet · instances COMP-213 · lecture linéaire.", 28, 105, 1080, 16, COLORS.muted, false);
  plainText(card, "Page", "02.23 — Work Principles", 1020, 65, 300, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) {
    variable("Semantic/Color", name);
  }
  for (const name of ["space/4", "space/6", "space/8"]) {
    variable("Primitives/Space", name);
  }
  for (const name of ["radius/none", "stroke/control"]) {
    variable("Primitives/Shape", name);
  }
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of ["Type/Heading/MD/Large", "Type/Heading/LG/Large", "Type/Body/MD/Large"]) {
    const style = styles.find((entry) => entry.name === name);
    if (!style) throw new Error(`Style ${name} absent : relancer Foundations Builder`);
    textStyles.set(name, style);
    await figma.loadFontAsync(style.fontName);
  }
  await figma.loadFontAsync(boldFont);
  await figma.loadFontAsync(regularFont);
}

async function main() {
  figma.notify("Préparation de COMP-212 Liste de principes…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const principlePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.22 — Work Principle",
  );
  const principleSet = principlePage && principlePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Work principle",
  );
  const messagePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message",
  );
  const messageSet = messagePage && messagePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message",
  );
  if (!principleSet || !messageSet) {
    throw new Error("COMP-213 ou COMP-003 absent : générer les dépendances avant COMP-212");
  }
  requiredVariant(messageSet, "Kind=Info, Size=Inline");
  requiredVariant(messageSet, "Kind=Info, Size=Section");

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.23 — Work Principles",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "02.23 — Work Principles";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Work principles",
  );
  if (existing) {
    if (
      existing.children.length !== 4 ||
      LAYOUTS.some((layout) =>
        STATES.some(
          (state) =>
            !existing.children.some(
              (entry) => entry.name === `Layout=${layout}, State=${state}`,
            ),
        ),
      )
    ) {
      throw new Error("COMP-212 modifié : arrêt sans remplacement");
    }
    syncApprovedPrinciple(principleSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-212 préservé · 4 variantes à revoir");
    return;
  }

  const staging = figma.createFrame();
  staging.name = "_Generated/Work Principles Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const layout of LAYOUTS) {
    for (const state of STATES) {
      components.push(await createVariant(layout, state, staging, principleSet, messageSet));
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Work principles";
  set.description = "COMP-212 · Première passe à revoir. Wide/Compact × Normal/Incomplete ; répétition statique de COMP-213, ordre linéaire et contenus de revue non publiables.";
  set.x = 190;
  set.y = 520;
  const positions = {
    "Wide/Normal": [0, 0],
    "Compact/Normal": [1400, 0],
    "Wide/Incomplete": [0, 1460],
    "Compact/Incomplete": [1400, 1460],
  };
  for (const layout of LAYOUTS) {
    for (const state of STATES) {
      const component = requiredVariant(set, `Layout=${layout}, State=${state}`);
      const [x, y] = positions[`${layout}/${state}`];
      component.x = x;
      component.y = y;
    }
  }
  set.resizeWithoutConstraints(1720, 2840);
  staging.remove();

  page.appendChild(documentationFrame());
  previewSurface(page);
  await reviewInstance(
    requiredVariant(set, "Layout=Wide, State=Normal"),
    "Normal",
    "EN",
    page,
    190,
    3650,
  );
  await reviewInstance(
    requiredVariant(set, "Layout=Compact, State=Incomplete"),
    "Incomplete",
    "EN",
    page,
    1590,
    3650,
  );
  page.appendChild(notesFrame());
  syncApprovedPrinciple(principleSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-212 créé · 4 variantes et références FR/EN à revoir");
}

main().catch((error) => {
  figma.notify(`Erreur Work Principles Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
