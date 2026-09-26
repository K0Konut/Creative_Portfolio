const CONTEXTS = ["About", "ProjectEnd"];
const LAYOUTS = ["Wide", "Compact"];
const STATES = ["Normal", "Partial", "Success", "Error"];
const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  muted: "#474747",
  border: "#827F76",
  violet: "#4B3CFF",
};
const REVIEW_ADDRESS = "email-public@a-confirmer.example";
const COPY = {
  FR: {
    About: {
      title: "Me contacter",
      intro: "Email et LinkedIn pour échanger, GitHub pour consulter le profil technique.",
      linksTitle: "Profils externes",
      unavailableTitle: "GitHub non publié",
      unavailableBody: "Le lien reste absent tant que son URL n'est pas vérifiée.",
    },
    ProjectEnd: {
      title: "Poursuivre l'échange",
      intro: "Choisissez librement l'email ou LinkedIn.",
      linksTitle: "Autre moyen de contact",
      unavailableTitle: "LinkedIn non publié",
      unavailableBody: "Le lien reste absent tant que son URL n'est pas vérifiée. L'email reste disponible.",
    },
    emailTitle: "Email",
    emailContext: "Adresse visible, sélectionnable et copiable.",
    emailAction: "Envoyer un email",
    copyAction: "Copier l'adresse",
    copySuccess: "Adresse copiée",
    copyError: "Copie impossible",
    linkedin: "LinkedIn",
    github: "GitHub",
    successTitle: "Adresse copiée",
    successBody: "L'adresse est disponible dans le presse-papiers.",
    errorTitle: "Copie impossible",
    errorBody: "Sélectionnez l'adresse affichée pour la copier manuellement.",
  },
  EN: {
    About: {
      title: "Contact me",
      intro: "Email and LinkedIn to connect, GitHub to review the technical profile.",
      linksTitle: "External profiles",
      unavailableTitle: "GitHub not published",
      unavailableBody: "The link stays hidden until its URL has been verified.",
    },
    ProjectEnd: {
      title: "Continue the conversation",
      intro: "Choose either email or LinkedIn.",
      linksTitle: "Another contact option",
      unavailableTitle: "LinkedIn not published",
      unavailableBody: "The link stays hidden until its URL has been verified. Email remains available.",
    },
    emailTitle: "Email",
    emailContext: "Visible, selectable and copyable address.",
    emailAction: "Write an email",
    copyAction: "Copy the address",
    copySuccess: "Address copied",
    copyError: "Copy failed",
    linkedin: "LinkedIn",
    github: "GitHub",
    successTitle: "Address copied",
    successBody: "The address is available in the clipboard.",
    errorTitle: "Copy failed",
    errorBody: "Select the displayed address to copy it manually.",
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

function externalLink(iconLinkSet, label, width, name) {
  const instance = requiredVariant(
    iconLinkSet,
    "Purpose=External, State=Default",
  ).createInstance();
  instance.name = `COMP-002 · ${name}`;
  instance.setProperties({ [property(instance, "Label")]: label });
  instance.resize(width, instance.height);
  return instance;
}

function emailState(state) {
  if (state === "Success") return "Success";
  if (state === "Error") return "Error";
  return "Normal";
}

function emailContact(emailSet, layout, state, width) {
  const instance = requiredVariant(
    emailSet,
    `Layout=${layout}, State=${emailState(state)}`,
  ).createInstance();
  instance.name = "COMP-216 · Email contact";
  instance.resize(width, instance.height);
  return instance;
}

function unavailableMessage(messageSet, context, width) {
  const instance = requiredVariant(
    messageSet,
    "Kind=Unavailable, Size=Inline",
  ).createInstance();
  instance.name = `COMP-003 · ${context} unavailable destination`;
  instance.setProperties({
    [property(instance, "Title · Unavailable")]: COPY.FR[context].unavailableTitle,
    [property(instance, "Body · Unavailable")]: COPY.FR[context].unavailableBody,
  });
  instance.resize(width, instance.height);
  return instance;
}

async function createHeader(component, context, layout) {
  const compact = layout === "Compact";
  const header = figma.createFrame();
  header.name = "Contact introduction";
  component.appendChild(header);
  header.resize(compact ? 320 : 900, 180);
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  const padding = compact ? 24 : 32;
  const paddingToken = compact ? "space/6" : "space/8";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    header[field] = padding;
    header.setBoundVariable(field, variable("Primitives/Space", paddingToken));
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
    `Title · ${context}`,
    COPY.FR[context].title,
    compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large",
    "text/primary",
    COLORS.ink,
  );
  await editableText(
    component,
    header,
    `Intro · ${context}`,
    COPY.FR[context].intro,
    "Type/Body/MD/Large",
    "text/secondary",
    COLORS.muted,
  );
}

async function createExternalGroup(component, context, layout, state, iconLinkSet, messageSet) {
  const compact = layout === "Compact";
  const outerWidth = compact ? 320 : 900;
  const innerWidth = compact ? 272 : 836;
  const group = figma.createFrame();
  group.name = "External contact options";
  component.appendChild(group);
  group.resize(outerWidth, 260);
  group.layoutMode = "VERTICAL";
  group.primaryAxisSizingMode = "AUTO";
  group.counterAxisSizingMode = "FIXED";
  const padding = compact ? 24 : 32;
  const paddingToken = compact ? "space/6" : "space/8";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    group[field] = padding;
    group.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  }
  group.itemSpacing = 16;
  group.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/4"));
  group.fills = [];
  group.strokes = [];
  group.clipsContent = false;
  group.layoutSizingHorizontal = "FILL";

  const label = await styledText(
    COPY.FR[context].linksTitle,
    "Type/Label/MD/Large",
    "text/primary",
    COLORS.ink,
  );
  label.name = "External options label";
  group.appendChild(label);
  label.layoutSizingHorizontal = "FILL";

  const actions = figma.createFrame();
  actions.name = "External links";
  group.appendChild(actions);
  actions.resize(innerWidth, 120);
  actions.layoutMode = compact ? "VERTICAL" : "HORIZONTAL";
  actions.primaryAxisSizingMode = "AUTO";
  actions.counterAxisSizingMode = "FIXED";
  actions.itemSpacing = 12;
  actions.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/3"));
  actions.fills = [];
  actions.strokes = [];
  actions.clipsContent = false;
  actions.layoutSizingHorizontal = "FILL";

  const isPartial = state === "Partial";
  const links = context === "About"
    ? isPartial
      ? [{ label: COPY.FR.linkedin, name: "LinkedIn" }]
      : [
          { label: COPY.FR.linkedin, name: "LinkedIn" },
          { label: COPY.FR.github, name: "GitHub" },
        ]
    : isPartial
      ? []
      : [{ label: COPY.FR.linkedin, name: "LinkedIn" }];
  const linkWidth = compact || links.length < 2 ? innerWidth : 412;
  for (const link of links) {
    actions.appendChild(externalLink(iconLinkSet, link.label, linkWidth, link.name));
  }
  if (links.length === 0) actions.visible = false;
  if (isPartial) group.appendChild(unavailableMessage(messageSet, context, innerWidth));
}

async function createVariant(context, layout, state, parent, emailSet, iconLinkSet, messageSet) {
  const compact = layout === "Compact";
  const width = compact ? 320 : 900;
  const component = figma.createComponent();
  component.name = `Context=${context}, Layout=${layout}, State=${state}`;
  parent.appendChild(component);
  component.resize(width, 1200);
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

  await createHeader(component, context, layout);
  component.appendChild(emailContact(emailSet, layout, state, width));
  await createExternalGroup(
    component,
    context,
    layout,
    state,
    iconLinkSet,
    messageSet,
  );
  component.description = `COMP-215 · ${context}/${layout}/${state}. Compose COMP-216 et les destinations externes réellement disponibles. ${state === "Partial" ? "Le lien non vérifié est retiré et son absence est expliquée avec COMP-003." : "Les libellés LinkedIn/GitHub restent des références sans URL."} Aucun formulaire ni stockage.`;
  return component;
}

function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(3300, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) {
    plainText(frame, `Line ${textY}`, value, x, textY, 3200 - x, size, color);
  }
  return frame;
}

function documentationFrame() {
  const frame = infoFrame("_Generated/Contact Group · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-215 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Groupe de contacts", 42, COLORS.ink, 48, 68],
    ["Email visible et copiable, LinkedIn prioritaire pour l'échange et GitHub réservé à l'évaluation technique.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}

function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Contact Group · Preview surface";
  frame.resize(3300, 3700);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  for (const [label, x] of [
    ["ABOUT · LARGE", 190],
    ["ABOUT · COMPACT", 1240],
    ["PROJECT END · LARGE", 1640],
    ["PROJECT END · COMPACT", 2690],
  ]) {
    plainText(page, `Heading · ${label}`, label, x, 320, 500, 15, COLORS.violet);
  }
  STATES.forEach((state, index) => {
    plainText(page, `State · ${state}`, state.toUpperCase(), 22, 470 + index * 850, 150, 14, COLORS.ink);
  });
  plainText(page, "English heading", "ENGLISH · REVIEW EXAMPLES", 190, 4020, 700, 16, COLORS.violet);
}

function notesFrame() {
  return infoFrame("_Generated/Contact Group · Usage notes", 5200, 470, COLORS.subtle, [
    ["USAGE · About contient Email, LinkedIn et GitHub ; ProjectEnd contient Email et LinkedIn sans page Contact.", 16, COLORS.ink, 40, 24],
    ["HIÉRARCHIE · Email et LinkedIn servent la prise de contact ; GitHub sert principalement l'évaluation technique.", 16, COLORS.ink, 40, 86],
    ["PARTIAL · Retirer toute destination non vérifiée ; ne jamais laisser un lien cassé ou un contrôle désactivé sans issue.", 16, COLORS.ink, 40, 148],
    ["RETOUR · Success et Error appartiennent à la copie email et sont annoncés sans déplacement du focus.", 16, COLORS.ink, 40, 210],
    ["ACCESSIBILITÉ · Icône avec libellé, noms de destination explicites, focus COMP-002 et adresse sélectionnable.", 16, COLORS.ink, 40, 272],
    ["RESPONSIVE · Les actions externes s'empilent à 320 px ; aucun libellé n'est remplacé par une icône seule.", 16, COLORS.ink, 40, 334],
    ["VÉRITÉ · L'adresse .example et les profils sont des placeholders non publiables, sans URL ni interaction réelle.", 16, COLORS.ink, 40, 396],
  ]);
}

async function overrideText(instance, name, value) {
  const node = instance.findOne(
    (entry) => entry.type === "TEXT" && entry.name === name,
  );
  if (!node) throw new Error(`Texte à localiser absent : ${name}`);
  await figma.loadFontAsync(node.fontName);
  node.characters = value;
}

async function localizeEmail(instance, state, copy) {
  instance.setProperties({
    [property(instance, "Title")]: copy.emailTitle,
    [property(instance, "Context")]: copy.emailContext,
    [property(instance, "Address")]: REVIEW_ADDRESS,
  });
  const email = instance.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · Email action",
  );
  const copyAction = instance.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · Copy action",
  );
  if (!email || !copyAction) throw new Error("Actions email ou copie absentes");
  email.setProperties({ [property(email, "Label")]: copy.emailAction });
  copyAction.setProperties({
    [property(copyAction, "Label")]: state === "Success"
      ? copy.copySuccess
      : state === "Error"
        ? copy.copyError
        : copy.copyAction,
  });
  if (state === "Success" || state === "Error") {
    const status = instance.findOne(
      (entry) => entry.type === "INSTANCE" && entry.name === `COMP-003 · Copy ${state.toLowerCase()} status`,
    );
    if (!status) throw new Error(`Retour ${state} absent dans COMP-216`);
    status.setProperties({
      [property(status, `Title · ${state}`)]: state === "Success" ? copy.successTitle : copy.errorTitle,
      [property(status, `Body · ${state}`)]: state === "Success" ? copy.successBody : copy.errorBody,
    });
    await overrideText(status, "Kind label", state === "Success" ? "CONFIRMATION" : "ERROR");
  }
}

async function localizeReview(instance, context, state, locale) {
  const copy = COPY[locale];
  instance.setProperties({
    [property(instance, `Title · ${context}`)]: copy[context].title,
    [property(instance, `Intro · ${context}`)]: copy[context].intro,
  });
  const email = instance.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-216 · Email contact",
  );
  if (!email) throw new Error("Instance COMP-216 absente");
  await localizeEmail(email, state, copy);
  const linkedin = instance.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · LinkedIn",
  );
  const github = instance.findOne(
    (entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · GitHub",
  );
  if (linkedin) linkedin.setProperties({ [property(linkedin, "Label")]: copy.linkedin });
  if (github) github.setProperties({ [property(github, "Label")]: copy.github });
  const groupLabel = instance.findOne(
    (entry) => entry.type === "TEXT" && entry.name === "External options label",
  );
  if (groupLabel) {
    await figma.loadFontAsync(groupLabel.fontName);
    groupLabel.characters = copy[context].linksTitle;
  }
  if (state === "Partial") {
    const notice = instance.findOne(
      (entry) => entry.type === "INSTANCE" && entry.name === `COMP-003 · ${context} unavailable destination`,
    );
    if (!notice) throw new Error("Message Partial absent");
    notice.setProperties({
      [property(notice, "Title · Unavailable")]: copy[context].unavailableTitle,
      [property(notice, "Body · Unavailable")]: copy[context].unavailableBody,
    });
  }
}

async function reviewInstance(source, context, state, page, x, y) {
  const instance = source.createInstance();
  instance.name = `Review · ${source.name} · EN`;
  page.appendChild(instance);
  await localizeReview(instance, context, state, "EN");
  instance.x = x;
  instance.y = y;
  return instance;
}

function repairReviewLayout(page) {
  const board = page.children.find(
    (entry) => entry.name === "_Generated/Contact Group · Preview surface",
  );
  if (board) board.resize(3300, 3700);
  const heading = page.children.find((entry) => entry.name === "English heading");
  if (heading) {
    heading.x = 190;
    heading.y = 4020;
  }
  const aboutReview = page.children.find(
    (entry) => entry.name === "Review · Context=About, Layout=Wide, State=Normal · EN",
  );
  if (aboutReview) {
    aboutReview.x = 190;
    aboutReview.y = 4100;
  }
  const projectReview = page.children.find(
    (entry) => entry.name === "Review · Context=ProjectEnd, Layout=Compact, State=Error · EN",
  );
  if (projectReview) {
    projectReview.x = 1240;
    projectReview.y = 4100;
  }
  const notes = page.children.find(
    (entry) => entry.name === "_Generated/Contact Group · Usage notes",
  );
  if (notes) notes.y = 5200;
}

function syncApprovedEmail(set) {
  const expected = LAYOUTS.flatMap((layout) =>
    ["Normal", "Copying", "Success", "Error"].map(
      (state) => `Layout=${layout}, State=${state}`,
    ),
  );
  if (
    set.children.length !== expected.length ||
    expected.some((name) => !set.children.some((entry) => entry.name === name))
  ) {
    throw new Error("COMP-216 modifié : validation non synchronisée");
  }
  set.description = "COMP-216 · 8 variantes Wide/Compact × Normal/Copying/Success/Error approuvées par Costa comme base structurelle de première passe le 2026-09-22. Adresse .example non publiable ; seconde passe globale prévue.";
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  const card = index && index.children.find(
    (entry) => entry.name === "Index · COMP-216 · Contact email",
  );
  const status = card && card.children.find(
    (entry) => entry.type === "TEXT" && entry.name === "Status",
  );
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 8 VARIANTES";
}

function updateIndex() {
  const page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02 — Components",
  );
  const index = page && page.children.find(
    (entry) => entry.name === "_Generated/Components index",
  );
  if (!index) return;
  index.resize(1440, Math.max(index.height, 5820));
  const emailCard = index.children.find(
    (entry) => entry.name === "Index · COMP-216 · Contact email",
  );
  if (emailCard) emailCard.y = 5450;
  let card = index.children.find(
    (entry) => entry.name === "Index · COMP-215 · Groupe de contacts",
  );
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-215 · Groupe de contacts";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 5250;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-215 · Groupe de contacts", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 16 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "À propos/fin de projet · large/compact · disponibilité et retour de copie.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "02.26 — Contact Group", 1040, 65, 270, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) {
    variable("Semantic/Color", name);
  }
  for (const name of ["space/3", "space/4", "space/6", "space/8"]) {
    variable("Primitives/Space", name);
  }
  for (const name of ["radius/none", "stroke/control"]) {
    variable("Primitives/Shape", name);
  }
  const styles = await figma.getLocalTextStylesAsync();
  for (const name of [
    "Type/Heading/MD/Large",
    "Type/Heading/LG/Large",
    "Type/Body/MD/Large",
    "Type/Label/MD/Large",
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
  figma.notify("Préparation de COMP-215 Groupe de contacts…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const iconLinkPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.3 — Icon Link",
  );
  const iconLinkSet = iconLinkPage && iconLinkPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Icon link",
  );
  const messagePage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message",
  );
  const messageSet = messagePage && messagePage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message",
  );
  const emailPage = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.25 — Email Contact",
  );
  const emailSet = emailPage && emailPage.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Email contact",
  );
  if (!iconLinkSet || !messageSet || !emailSet) {
    throw new Error("COMP-002, COMP-003 ou COMP-216 absent : générer les dépendances avant COMP-215");
  }
  requiredVariant(iconLinkSet, "Purpose=External, State=Default");
  requiredVariant(messageSet, "Kind=Unavailable, Size=Inline");
  for (const layout of LAYOUTS) {
    for (const state of ["Normal", "Success", "Error"]) {
      requiredVariant(emailSet, `Layout=${layout}, State=${state}`);
    }
  }

  let page = figma.root.children.find(
    (entry) => entry.type === "PAGE" && entry.name === "02.26 — Contact Group",
  );
  if (!page) {
    page = figma.createPage();
    page.name = "02.26 — Contact Group";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find(
    (entry) => entry.type === "COMPONENT_SET" && entry.name === "Contact group",
  );
  if (existing) {
    const expected = CONTEXTS.flatMap((context) =>
      LAYOUTS.flatMap((layout) =>
        STATES.map((state) => `Context=${context}, Layout=${layout}, State=${state}`),
      ),
    );
    if (
      existing.children.length !== expected.length ||
      expected.some((name) => !existing.children.some((entry) => entry.name === name))
    ) {
      throw new Error("COMP-215 modifié : arrêt sans remplacement");
    }
    syncApprovedEmail(emailSet);
    updateIndex();
    repairReviewLayout(page);
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-215 préservé · 16 variantes à revoir");
    return;
  }

  for (const stale of page.children.filter(
    (entry) => entry.name === "_Generated/Contact Group Draft",
  )) {
    stale.remove();
  }
  const staging = figma.createFrame();
  staging.name = "_Generated/Contact Group Draft";
  staging.resize(1, 1);
  staging.x = -4000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const context of CONTEXTS) {
    for (const layout of LAYOUTS) {
      for (const state of STATES) {
        components.push(
          await createVariant(
            context,
            layout,
            state,
            staging,
            emailSet,
            iconLinkSet,
            messageSet,
          ),
        );
      }
    }
  }
  const set = figma.combineAsVariants(components, page);
  set.name = "Contact group";
  set.description = "COMP-215 · Première passe à revoir. About/ProjectEnd × Wide/Compact × Normal/Partial/Success/Error. Compose COMP-216, COMP-002 et COMP-003 ; aucune coordonnée ou URL réelle.";
  set.x = 190;
  set.y = 520;
  const columns = [
    ["About", "Wide", 0],
    ["About", "Compact", 1050],
    ["ProjectEnd", "Wide", 1450],
    ["ProjectEnd", "Compact", 2500],
  ];
  for (const [context, layout, x] of columns) {
    STATES.forEach((state, index) => {
      const variant = requiredVariant(
        set,
        `Context=${context}, Layout=${layout}, State=${state}`,
      );
      variant.x = x;
      variant.y = index * 850;
    });
  }
  set.resizeWithoutConstraints(2820, 3400);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page);
  await reviewInstance(
    requiredVariant(set, "Context=About, Layout=Wide, State=Normal"),
    "About",
    "Normal",
    page,
    190,
    4100,
  );
  await reviewInstance(
    requiredVariant(set, "Context=ProjectEnd, Layout=Compact, State=Error"),
    "ProjectEnd",
    "Error",
    page,
    1240,
    4100,
  );
  page.appendChild(notesFrame());
  repairReviewLayout(page);
  syncApprovedEmail(emailSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-215 créé · 16 variantes et références FR/EN à revoir");
}

main().catch((error) => {
  figma.notify(`Erreur Contact Group Builder : ${error.message}`, {
    error: true,
    timeout: 10000,
  });
  console.error(error);
});
