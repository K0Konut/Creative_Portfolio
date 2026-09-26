const LOCALES = ["FR", "EN"];
const LAYOUTS = ["Wide", "Compact"];
const MODES = ["Suggestions", "Contact"];
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
    Suggestions: {
      eyebrow: "AUTRES PROJETS",
      title: "Continuer l'exploration",
      intro: "Découvrez un autre projet publié.",
    },
    Contact: {
      eyebrow: "SUITE DU PARCOURS",
      title: "Envie d'échanger ?",
      intro: "Aucun autre projet n'est publié pour le moment. Vous pouvez contacter Costa directement.",
    },
  },
  EN: {
    Suggestions: {
      eyebrow: "OTHER PROJECTS",
      title: "Continue exploring",
      intro: "Discover another published project.",
    },
    Contact: {
      eyebrow: "NEXT STEP",
      title: "Want to talk?",
      intro: "No other project is published yet. You can contact Costa directly.",
    },
  },
};
const CONTACT_EN = {
  title: "Continue the conversation",
  intro: "Choose either email or LinkedIn.",
  linksTitle: "Another contact option",
  unavailableTitle: "LinkedIn not published",
  unavailableBody: "The link stays hidden until its URL has been verified. Email remains available.",
  emailTitle: "Email",
  emailContext: "Visible, selectable and copyable address.",
  emailAction: "Write an email",
  copyAction: "Copy the address",
  linkedin: "LinkedIn",
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

async function overrideText(instance, name, value) {
  const node = instance.findOne(
    (entry) => entry.type === "TEXT" && entry.name === name,
  );
  if (!node) throw new Error(`Texte à localiser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}

function variantSpecs() {
  const result = [];
  for (const locale of LOCALES) {
    for (const layout of LAYOUTS) {
      result.push({ mode: "Suggestions", layout, locale, state: "Default" });
      result.push({ mode: "Contact", layout, locale, state: "Default" });
      result.push({ mode: "Contact", layout, locale, state: "Partial" });
    }
  }
  return result;
}

function variantName({ mode, layout, locale, state }) {
  return `Mode=${mode}, Layout=${layout}, Locale=${locale}, State=${state}`;
}

async function createHeader(component, mode, layout, locale) {
  const compact = layout === "Compact";
  const copy = COPY[locale][mode];
  const header = figma.createFrame();
  header.name = "Section introduction";
  component.appendChild(header);
  header.resize(compact ? 375 : 1120, 220);
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.paddingLeft = compact ? 24 : 32;
  header.paddingRight = compact ? 24 : 32;
  header.paddingTop = compact ? 24 : 32;
  header.paddingBottom = compact ? 24 : 32;
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    header.setBoundVariable(
      field,
      variable("Primitives/Space", compact ? "space/6" : "space/8"),
    );
  }
  header.itemSpacing = 12;
  header.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/3"));
  header.fills = [];
  header.strokes = [];
  header.clipsContent = false;
  header.layoutSizingHorizontal = "FILL";
  await editableText(
    component,
    header,
    "Eyebrow",
    copy.eyebrow,
    "Type/Label/SM/Large",
    "text/secondary",
    COLORS.muted,
  );
  await editableText(
    component,
    header,
    "Title",
    copy.title,
    compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    header,
    "Intro",
    copy.intro,
    "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  );
}

function divider(parent) {
  const node = figma.createRectangle();
  node.name = "Section divider";
  parent.appendChild(node);
  node.resize(100, 1);
  node.fills = [boundColor("border/default", COLORS.border)];
  node.strokes = [];
  node.layoutSizingHorizontal = "FILL";
  return node;
}

function suggestionInstance(layout, locale, previewSet, compactPreviewSet) {
  const source = layout === "Compact"
    ? requiredVariant(
        compactPreviewSet,
        `Placement=Collection, Locale=${locale}`,
      )
    : requiredVariant(
        previewSet,
        `Placement=Collection, Locale=${locale}, State=Default`,
      );
  const instance = source.createInstance();
  instance.name = "COMP-201 · Structural suggestion reference · not publishable in SideQuest V1";
  return instance;
}

async function localizeContact(instance, state) {
  instance.setProperties({
    [property(instance, "Title · ProjectEnd")]: CONTACT_EN.title,
    [property(instance, "Intro · ProjectEnd")]: CONTACT_EN.intro,
  });
  const email = instance.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-216 · Email contact",
  );
  if (!email) throw new Error("Instance COMP-216 absente de COMP-215");
  email.setProperties({
    [property(email, "Title")]: CONTACT_EN.emailTitle,
    [property(email, "Context")]: CONTACT_EN.emailContext,
  });
  const emailAction = email.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · Email action",
  );
  const copyAction = email.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · Copy action",
  );
  if (!emailAction || !copyAction) throw new Error("Actions email ou copie absentes de COMP-216");
  emailAction.setProperties({
    [property(emailAction, "Label")]: CONTACT_EN.emailAction,
  });
  copyAction.setProperties({
    [property(copyAction, "Label")]: CONTACT_EN.copyAction,
  });
  const linkedin = instance.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · LinkedIn",
  );
  if (linkedin) {
    linkedin.setProperties({
      [property(linkedin, "Label")]: CONTACT_EN.linkedin,
    });
  }
  const groupLabel = instance.findOne(
    (entry) => entry.type === "TEXT" && entry.name === "External options label",
  );
  if (groupLabel) {
    await figma.loadFontAsync(groupLabel.fontName);
    groupLabel.characters = CONTACT_EN.linksTitle;
  }
  if (state === "Partial") {
    const notice = instance.findOne(
      (entry) => entry.type === "INSTANCE" && entry.name === "COMP-003 · ProjectEnd unavailable destination",
    );
    if (!notice) throw new Error("Message Partial absent de COMP-215");
    notice.setProperties({
      [property(notice, "Title · Unavailable")]: CONTACT_EN.unavailableTitle,
      [property(notice, "Body · Unavailable")]: CONTACT_EN.unavailableBody,
    });
    await overrideText(notice, "Kind label", "UNAVAILABLE");
  }
}

async function contactInstance(layout, locale, state, contactSet) {
  const source = requiredVariant(
    contactSet,
    `Context=ProjectEnd, Layout=${layout}, State=${state === "Partial" ? "Partial" : "Normal"}`,
  );
  const instance = source.createInstance();
  instance.name = "COMP-215 · Project end contact";
  if (locale === "EN") await localizeContact(instance, state);
  return instance;
}

async function createContent(
  component,
  mode,
  layout,
  locale,
  state,
  previewSet,
  compactPreviewSet,
  contactSet,
) {
  const compact = layout === "Compact";
  const wrapper = figma.createFrame();
  wrapper.name = mode === "Suggestions" ? "Published project suggestions" : "Contact invitation";
  component.appendChild(wrapper);
  wrapper.resize(compact ? 375 : 1120, 900);
  wrapper.layoutMode = "VERTICAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "FIXED";
  wrapper.counterAxisAlignItems = "CENTER";
  wrapper.paddingTop = compact ? 24 : 32;
  wrapper.paddingBottom = compact ? 24 : 32;
  wrapper.setBoundVariable(
    "paddingTop",
    variable("Primitives/Space", compact ? "space/6" : "space/8"),
  );
  wrapper.setBoundVariable(
    "paddingBottom",
    variable("Primitives/Space", compact ? "space/6" : "space/8"),
  );
  wrapper.fills = [];
  wrapper.strokes = [];
  wrapper.clipsContent = false;
  wrapper.layoutSizingHorizontal = "FILL";
  const content = mode === "Suggestions"
    ? suggestionInstance(layout, locale, previewSet, compactPreviewSet)
    : await contactInstance(layout, locale, state, contactSet);
  wrapper.appendChild(content);
}

async function createVariant(spec, parent, previewSet, compactPreviewSet, contactSet) {
  const compact = spec.layout === "Compact";
  const component = figma.createComponent();
  component.name = variantName(spec);
  parent.appendChild(component);
  component.resize(compact ? 375 : 1120, 1400);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = 0;
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
  await createHeader(component, spec.mode, spec.layout, spec.locale);
  divider(component);
  await createContent(
    component,
    spec.mode,
    spec.layout,
    spec.locale,
    spec.state,
    previewSet,
    compactPreviewSet,
    contactSet,
  );
  component.description = `COMP-217 · ${spec.mode}/${spec.layout}/${spec.locale}/${spec.state}. ${spec.mode === "Suggestions" ? "Référence structurelle avec COMP-201 : ne publier que des projets réels autres que le projet courant." : "Invitation de contact V1 avec COMP-215 ; aucun carrousel vide ni page Contact fictive."}`;
  return component;
}

function arrangeSet(set) {
  const columns = [
    { mode: "Suggestions", layout: "Wide", x: 0 },
    { mode: "Suggestions", layout: "Compact", x: 1280 },
    { mode: "Contact", layout: "Wide", x: 1815 },
    { mode: "Contact", layout: "Compact", x: 3095 },
  ];
  const rows = [
    { locale: "FR", state: "Default" },
    { locale: "EN", state: "Default" },
    { locale: "FR", state: "Partial" },
    { locale: "EN", state: "Partial" },
  ];
  const rowPositions = [];
  let y = 0;
  for (const row of rows) {
    const members = [];
    for (const column of columns) {
      const name = variantName({ ...column, ...row });
      const component = set.children.find(
        (entry) => entry.type === "COMPONENT" && entry.name === name,
      );
      if (!component) continue;
      component.x = column.x;
      component.y = y;
      members.push(component);
    }
    if (members.length === 0) continue;
    rowPositions.push({ ...row, y });
    y += Math.max(...members.map((entry) => entry.height)) + 160;
  }
  const height = Math.max(1, y - 160);
  set.resizeWithoutConstraints(3470, height);
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
    "_Generated/Project End · Documentation",
    3900,
    0,
    220,
    COLORS.canvas,
    [
      ["COMP-217 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
      ["Fin de projet conditionnelle", 42, COLORS.ink, 48, 68],
      ["Suggérer uniquement des projets réellement publiés ; sinon, proposer le contact sans afficher de recommandation vide.", 18, COLORS.muted, 48, 136],
    ],
  );
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page, arrangement) {
  const board = figma.createFrame();
  board.name = "_Generated/Project End · Preview surface";
  board.resize(3900, arrangement.height + 420);
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
      `_Generated/Project End · Column · ${column.mode} ${column.layout}`,
      `${column.mode.toUpperCase()} · ${column.layout.toUpperCase()}`,
      190 + column.x,
      320,
      column.layout === "Wide" ? 800 : 360,
      15,
      COLORS.violet,
    );
  }
  plainText(
    page,
    "_Generated/Project End · Suggestions warning",
    "RÉFÉRENCE STRUCTURELLE UNIQUEMENT · NE PAS PUBLIER À LA FIN DE SIDEQUEST",
    190,
    365,
    1465,
    13,
    COLORS.muted,
  );
  for (const row of arrangement.rowPositions) {
    plainText(
      page,
      `_Generated/Project End · Row · ${row.locale} ${row.state}`,
      `${row.state.toUpperCase()} · ${row.locale}`,
      20,
      520 + row.y,
      150,
      14,
      COLORS.ink,
    );
  }
}

function notesFrame(y) {
  return infoFrame(
    "_Generated/Project End · Usage notes",
    3900,
    y,
    470,
    COLORS.subtle,
    [
      ["V1 · SideQuest utilise Contact : aucun autre projet réel n'est disponible et aucune suggestion fictive n'est publiée.", 16, COLORS.ink, 40, 24],
      ["SUGGESTIONS · COMP-201 sert de référence structurelle ; remplacer SideQuest par un autre projet réel avant toute utilisation.", 16, COLORS.ink, 40, 86],
      ["CONTACT · COMP-215 ProjectEnd conserve email et LinkedIn de priorité équivalente ; Partial retire LinkedIn non vérifié.", 16, COLORS.ink, 40, 148],
      ["ACCESSIBILITÉ · Titre de section explicite, ordre éditorial stable et aucune liste ou carrousel vide annoncé.", 16, COLORS.ink, 40, 210],
      ["RESPONSIVE · Large 1120 px et Compact 375 px ; la hauteur de chaque ligne de revue est calculée depuis son contenu réel.", 16, COLORS.ink, 40, 272],
      ["CONTENU · Coordonnées et futurs projets restent non publiables tant qu'ils ne sont pas fournis puis vérifiés.", 16, COLORS.ink, 40, 334],
      ["SECONDE PASSE · Revoir la hiérarchie email/LinkedIn de COMP-215 et l'intention visuelle globale avant validation UX/UI.", 16, COLORS.ink, 40, 396],
    ],
  );
}

async function syncApprovedContact(set) {
  const contexts = ["About", "ProjectEnd"];
  const states = ["Normal", "Partial", "Success", "Error"];
  const expected = contexts.flatMap((context) =>
    LAYOUTS.flatMap((layout) =>
      states.map((state) => `Context=${context}, Layout=${layout}, State=${state}`),
    ),
  );
  if (
    set.children.length !== expected.length ||
    expected.some((name) => !set.children.some((entry) => entry.name === name))
  ) {
    throw new Error("COMP-215 modifié : validation non synchronisée");
  }
  set.description = "COMP-215 · 16 variantes About/ProjectEnd × Wide/Compact × Normal/Partial/Success/Error approuvées par Costa comme base structurelle de première passe le 2026-09-23. Chevauchement de la grille About Compact et équilibre email/LinkedIn réservés pour la seconde passe globale.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-215 · Groupe de contacts",
  );
  const status = card && card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) {
    await figma.loadFontAsync(status.fontName);
    status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 16 VARIANTES";
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
  index.resize(1440, Math.max(index.height, 5860));
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-217 · Fin de projet conditionnelle",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-217 · Fin de projet conditionnelle";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 5650;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-217 · Fin de projet conditionnelle", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 12 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Suggestions réelles ou contact · FR/EN · large/compact · disponibilité du contact.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "02.27 — Project End", 1040, 65, 270, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) {
    variable("Semantic/Color", name);
  }
  for (const name of ["space/3", "space/6", "space/8"]) {
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
  figma.notify("Préparation de COMP-217 Fin de projet conditionnelle…", {
    timeout: 3000,
  });
  await prepare();
  await figma.loadAllPagesAsync();
  const previewPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.13 — Project Preview",
  );
  const contactPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.26 — Contact Group",
  );
  const previewSet = previewPage && previewPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview",
  );
  const compactPreviewSet = previewPage && previewPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project preview · Compact reference",
  );
  const contactSet = contactPage && contactPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Contact group",
  );
  if (!previewSet || !compactPreviewSet || !contactSet) {
    throw new Error("COMP-201 ou COMP-215 absent : générer puis valider les dépendances avant COMP-217");
  }
  for (const locale of LOCALES) {
    requiredVariant(previewSet, `Placement=Collection, Locale=${locale}, State=Default`);
    requiredVariant(compactPreviewSet, `Placement=Collection, Locale=${locale}`);
  }
  for (const layout of LAYOUTS) {
    for (const state of ["Normal", "Partial"]) {
      requiredVariant(contactSet, `Context=ProjectEnd, Layout=${layout}, State=${state}`);
    }
  }

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.27 — Project End",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "02.27 — Project End";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Project end",
  );
  const expected = variantSpecs().map(variantName);
  if (existing) {
    if (
      existing.children.length !== expected.length ||
      expected.some((name) => !existing.children.some((entry) => entry.name === name))
    ) {
      throw new Error("COMP-217 modifié : arrêt sans remplacement");
    }
    await syncApprovedContact(contactSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-217 préservé · 12 variantes à revoir");
    return;
  }

  for (const stale of page.children.filter(
    (entry) =>
      entry.name === "_Generated/Project End Draft" ||
      entry.name.startsWith("_Generated/Project End ·"),
  )) {
    stale.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Project End Draft";
  staging.resize(1, 1);
  staging.x = -5000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const spec of variantSpecs()) {
    components.push(
      await createVariant(
        spec,
        staging,
        previewSet,
        compactPreviewSet,
        contactSet,
      ),
    );
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Project end";
  set.description = "COMP-217 · Première passe à revoir. Suggestions publie uniquement des COMP-201 réels ; Contact compose COMP-215 lorsque aucune autre suggestion n'existe. FR/EN × Wide/Compact, avec disponibilité partielle du contact.";
  set.x = 190;
  set.y = 520;
  const arrangement = arrangeSet(set);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page, arrangement);
  page.appendChild(notesFrame(750 + arrangement.height));
  await syncApprovedContact(contactSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-217 créé · 12 variantes FR/EN à revoir par captures");
}

main().catch((error) => {
  figma.notify(`Erreur Project End Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
