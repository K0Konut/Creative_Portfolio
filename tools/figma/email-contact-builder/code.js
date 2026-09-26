const LAYOUTS = ["Wide", "Compact"];
const STATES = ["Normal", "Copying", "Success", "Error"];
const COLORS = { canvas: "#F5F1E8", subtle: "#E8E1D4", ink: "#101113", muted: "#474747", border: "#827F76", violet: "#4B3CFF" };
const REVIEW_ADDRESS = "email-public@a-confirmer.example";
const COPY = {
  FR: {
    title: "Email",
    context: "Adresse visible, sélectionnable et copiable.",
    email: "Envoyer un email",
    copy: "Copier l'adresse",
    copying: "Copie en cours…",
    success: "Adresse copiée",
    error: "Copie impossible",
    successLabel: "CONFIRMATION",
    successTitle: "Adresse copiée",
    successBody: "L'adresse est disponible dans le presse-papiers.",
    errorLabel: "ERREUR",
    errorTitle: "Copie impossible",
    errorBody: "Sélectionnez l'adresse affichée pour la copier manuellement.",
  },
  EN: {
    title: "Email",
    context: "Visible, selectable and copyable address.",
    email: "Write an email",
    copy: "Copy the address",
    copying: "Copying…",
    success: "Address copied",
    error: "Copy failed",
    successLabel: "CONFIRMATION",
    successTitle: "Address copied",
    successBody: "The address is available in the clipboard.",
    errorLabel: "ERROR",
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
function property(instance, name) {
  const key = Object.keys(instance.componentProperties).find((entry) => entry.startsWith(`${name}#`));
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

function iconLink(iconLinkSet, purpose, state, label, width) {
  const instance = requiredVariant(iconLinkSet, `Purpose=${purpose}, State=${state}`).createInstance();
  instance.name = `COMP-002 · ${purpose} action`;
  instance.setProperties({ [property(instance, "Label")]: label });
  instance.resize(width, instance.height);
  return instance;
}

function statusMessage(messageSet, state, width) {
  const kind = state === "Success" ? "Success" : "Error";
  const instance = requiredVariant(messageSet, `Kind=${kind}, Size=Inline`).createInstance();
  instance.name = `COMP-003 · Copy ${state.toLowerCase()} status`;
  instance.setProperties({
    [property(instance, `Title · ${kind}`)]: state === "Success" ? COPY.FR.successTitle : COPY.FR.errorTitle,
    [property(instance, `Body · ${kind}`)]: state === "Success" ? COPY.FR.successBody : COPY.FR.errorBody,
  });
  instance.resize(width, instance.height);
  return instance;
}

async function createVariant(layout, state, parent, iconLinkSet, messageSet) {
  const compact = layout === "Compact";
  const component = figma.createComponent();
  component.name = `Layout=${layout}, State=${state}`;
  parent.appendChild(component);
  component.resize(compact ? 320 : 900, 620);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  const padding = compact ? 24 : 32;
  const paddingToken = compact ? "space/6" : "space/8";
  for (const field of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom"]) {
    component[field] = padding;
    component.setBoundVariable(field, variable("Primitives/Space", paddingToken));
  }
  component.itemSpacing = compact ? 20 : 24;
  component.setBoundVariable("itemSpacing", variable("Primitives/Space", compact ? "space/5" : "space/6"));
  component.fills = [boundColor("surface/canvas", COLORS.canvas)];
  component.strokes = [boundColor("border/default", COLORS.border)];
  component.strokeWeight = 1;
  component.setBoundVariable("strokeWeight", variable("Primitives/Shape", "stroke/control"));
  component.strokeAlign = "INSIDE";
  component.cornerRadius = 0;
  component.setBoundVariable("cornerRadius", variable("Primitives/Shape", "radius/none"));
  component.clipsContent = false;

  const content = figma.createFrame();
  content.name = "Email content";
  component.appendChild(content);
  content.resize(compact ? 272 : 836, 240);
  content.layoutMode = "VERTICAL";
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.itemSpacing = 12;
  content.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/3"));
  content.fills = [];
  content.strokes = [];
  content.clipsContent = false;
  content.layoutSizingHorizontal = "FILL";
  await editableText(component, content, "Title", COPY.FR.title, "Type/Heading/MD/Large", "text/primary", COLORS.ink);
  await editableText(component, content, "Context", COPY.FR.context, "Type/Body/MD/Large", "text/secondary", COLORS.muted);
  await editableText(component, content, "Address", REVIEW_ADDRESS, compact ? "Type/Heading/MD/Large" : "Type/Heading/LG/Large", "text/primary", COLORS.ink);

  const actions = figma.createFrame();
  actions.name = "Email actions";
  component.appendChild(actions);
  actions.resize(compact ? 272 : 836, 120);
  actions.layoutMode = compact ? "VERTICAL" : "HORIZONTAL";
  actions.primaryAxisSizingMode = "AUTO";
  actions.counterAxisSizingMode = "FIXED";
  actions.itemSpacing = 12;
  actions.setBoundVariable("itemSpacing", variable("Primitives/Space", "space/3"));
  actions.fills = [];
  actions.strokes = [];
  actions.clipsContent = false;
  actions.layoutSizingHorizontal = "FILL";
  const width = compact ? 272 : 270;
  actions.appendChild(iconLink(iconLinkSet, "Email", "Default", COPY.FR.email, width));
  const copyState = state === "Copying" ? "Active" : state === "Success" ? "Success" : state === "Error" ? "Error" : "Default";
  const copyLabel = state === "Copying" ? COPY.FR.copying : state === "Success" ? COPY.FR.success : state === "Error" ? COPY.FR.error : COPY.FR.copy;
  actions.appendChild(iconLink(iconLinkSet, "Copy", copyState, copyLabel, width));
  if (state === "Success" || state === "Error") component.appendChild(statusMessage(messageSet, state, compact ? 272 : 836));
  component.description = `COMP-216 · ${layout}/${state}. Adresse visible et sélectionnable, lien Email et bouton Copy via COMP-002. ${state === "Success" || state === "Error" ? "COMP-003 annonce le résultat sans déplacer le focus." : "Aucun retour artificiel."} Adresse de revue non publiable.`;
  return component;
}

function infoFrame(name, y, height, fill, lines) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(2000, height);
  frame.x = 0;
  frame.y = y;
  frame.fills = [solid(fill)];
  for (const [value, size, color, x, textY] of lines) plainText(frame, `Line ${textY}`, value, x, textY, 1900 - x, size, color);
  return frame;
}
function documentationFrame() {
  const frame = infoFrame("_Generated/Email Contact · Documentation", 0, 220, COLORS.canvas, [
    ["COMP-216 · FEATURE · PREMIÈRE PASSE", 14, COLORS.violet, 48, 36],
    ["Contact email", 42, COLORS.ink, 48, 68],
    ["Une adresse visible, un envoi direct et une copie avec retour accessible. Adresse réelle à fournir.", 18, COLORS.muted, 48, 136],
  ]);
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  return frame;
}
function previewSurface(page) {
  const frame = figma.createFrame();
  frame.name = "_Generated/Email Contact · Preview surface";
  frame.resize(2000, 3000);
  frame.x = 0;
  frame.y = 250;
  frame.fills = [solid(COLORS.canvas)];
  frame.strokes = [solid(COLORS.ink)];
  frame.strokeWeight = 1;
  frame.clipsContent = false;
  page.insertChild(0, frame);
  plainText(page, "Wide heading", "LARGE · 900 PX", 190, 320, 500, 15, COLORS.violet);
  plainText(page, "Compact heading", "COMPACT · 320 PX", 1390, 320, 500, 15, COLORS.violet);
  STATES.forEach((state, index) => plainText(page, `State ${state}`, state.toUpperCase(), 22, 470 + index * 650, 140, 14, COLORS.ink));
  plainText(page, "English heading", "ENGLISH · REVIEW EXAMPLES", 190, 3340, 700, 16, COLORS.violet);
}
function notesFrame() {
  return infoFrame("_Generated/Email Contact · Usage notes", 4050, 450, COLORS.subtle, [
    ["USAGE · Enfant de COMP-215 sur À propos et en fin de projet ; le pied de page garde un simple lien textuel.", 16, COLORS.ink, 40, 24],
    ["ADRESSE · Toujours visible et sélectionnable ; remplacer le placeholder uniquement par l'email public vérifié.", 16, COLORS.ink, 40, 86],
    ["ACTIONS · Email prépare un message ; Copy utilise un bouton natif. Aucun envoi n'est simulé.", 16, COLORS.ink, 40, 148],
    ["RETOUR · Copying, Success et Error sont annoncés sans déplacement du focus ; l'adresse reste accessible manuellement.", 16, COLORS.ink, 40, 210],
    ["ACCESSIBILITÉ · Libellés explicites, cibles natives, zone de statut et focus fourni par COMP-002.", 16, COLORS.ink, 40, 272],
    ["RESPONSIVE · Adresse longue refluée et actions empilées à 320 px, sans masquer leur libellé.", 16, COLORS.ink, 40, 334],
    ["VÉRITÉ · L'adresse .example est une donnée de revue non publiable et aucune destination réelle n'est liée.", 16, COLORS.ink, 40, 396],
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
    [property(instance, "Address")]: REVIEW_ADDRESS,
  });
  const email = instance.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · Email action");
  const copyAction = instance.findOne((entry) => entry.type === "INSTANCE" && entry.name === "COMP-002 · Copy action");
  if (!email || !copyAction) throw new Error("Actions email ou copie absentes");
  email.setProperties({ [property(email, "Label")]: copy.email });
  copyAction.setProperties({ [property(copyAction, "Label")]: state === "Copying" ? copy.copying : state === "Success" ? copy.success : state === "Error" ? copy.error : copy.copy });
  if (state === "Success" || state === "Error") {
    const kind = state;
    const status = instance.findOne((entry) => entry.type === "INSTANCE" && entry.name === `COMP-003 · Copy ${state.toLowerCase()} status`);
    if (!status) throw new Error(`Retour ${state} absent`);
    status.setProperties({
      [property(status, `Title · ${kind}`)]: state === "Success" ? copy.successTitle : copy.errorTitle,
      [property(status, `Body · ${kind}`)]: state === "Success" ? copy.successBody : copy.errorBody,
    });
    await overrideText(status, "Kind label", state === "Success" ? copy.successLabel : copy.errorLabel);
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

function syncApprovedCv(set) {
  if (set.children.length !== 8 || ["Wide", "Compact"].some((layout) => ["Default", "Focus", "Active", "Unavailable"].some((state) => !set.children.some((entry) => entry.name === `Layout=${layout}, State=${state}`)))) throw new Error("COMP-214 modifié : validation non synchronisée");
  set.description = "COMP-214 · 8 variantes Wide/Compact × Default/Focus/Active/Unavailable approuvées par Costa comme base structurelle de première passe le 2026-09-22. Aucun fichier réel ; seconde passe globale prévue.";
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  const card = index && index.children.find((entry) => entry.name === "Index · COMP-214 · Téléchargement du CV");
  const status = card && card.children.find((entry) => entry.type === "TEXT" && entry.name === "Status");
  if (status) status.characters = "APPROUVÉ EN PREMIÈRE PASSE · 8 VARIANTES";
}
function updateIndex() {
  const page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  const index = page && page.children.find((entry) => entry.name === "_Generated/Components index");
  if (!index) return;
  index.resize(1440, Math.max(index.height, 5820));
  let card = index.children.find((entry) => entry.name === "Index · COMP-216 · Contact email");
  if (!card) {
    card = figma.createFrame();
    card.name = "Index · COMP-216 · Contact email";
    index.appendChild(card);
  }
  card.resize(1344, 174);
  card.x = 48;
  card.y = 5450;
  card.fills = [solid(COLORS.canvas)];
  card.strokes = [solid(COLORS.ink)];
  card.strokeWeight = 1;
  for (const child of [...card.children]) child.remove();
  plainText(card, "Title", "COMP-216 · Contact email", 28, 20, 900, 28, COLORS.ink);
  plainText(card, "Status", "À VALIDER · 8 VARIANTES", 28, 65, 900, 14, COLORS.violet);
  plainText(card, "Description", "Large/compact · normal/copie/succès/erreur · adresse visible · COMP-002 et COMP-003.", 28, 105, 1110, 16, COLORS.muted, false);
  plainText(card, "Page", "02.25 — Email Contact", 1040, 65, 270, 15, COLORS.violet);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  for (const name of ["surface/canvas", "text/primary", "text/secondary", "border/default"]) variable("Semantic/Color", name);
  for (const name of ["space/3", "space/5", "space/6", "space/8"]) variable("Primitives/Space", name);
  for (const name of ["radius/none", "stroke/control"]) variable("Primitives/Shape", name);
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
  figma.notify("Préparation de COMP-216 Contact email…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  const iconLinkPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.3 — Icon Link");
  const iconLinkSet = iconLinkPage && iconLinkPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Icon link");
  const messagePage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message");
  const messageSet = messagePage && messagePage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Status message");
  const cvPage = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.24 — CV Download");
  const cvSet = cvPage && cvPage.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "CV download");
  if (!iconLinkSet || !messageSet || !cvSet) throw new Error("COMP-002, COMP-003 ou COMP-214 absent : générer les dépendances avant COMP-216");
  for (const name of ["Purpose=Email, State=Default", "Purpose=Copy, State=Default", "Purpose=Copy, State=Active", "Purpose=Copy, State=Success", "Purpose=Copy, State=Error"]) requiredVariant(iconLinkSet, name);
  requiredVariant(messageSet, "Kind=Success, Size=Inline");
  requiredVariant(messageSet, "Kind=Error, Size=Inline");

  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.25 — Email Contact");
  if (!page) {
    page = figma.createPage();
    page.name = "02.25 — Email Contact";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Email contact");
  if (existing) {
    if (existing.children.length !== 8 || LAYOUTS.some((layout) => STATES.some((state) => !existing.children.some((entry) => entry.name === `Layout=${layout}, State=${state}`)))) throw new Error("COMP-216 modifié : arrêt sans remplacement");
    syncApprovedCv(cvSet);
    updateIndex();
    figma.currentPage.selection = [existing];
    figma.viewport.scrollAndZoomIntoView([existing]);
    figma.closePlugin("COMP-216 préservé · 8 variantes à revoir");
    return;
  }
  for (const stale of page.children.filter((entry) => entry.name === "_Generated/Email Contact Draft")) stale.remove();
  const staging = figma.createFrame();
  staging.name = "_Generated/Email Contact Draft";
  staging.resize(1, 1);
  staging.x = -3000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = [];
  for (const layout of LAYOUTS) for (const state of STATES) components.push(await createVariant(layout, state, staging, iconLinkSet, messageSet));
  const set = figma.combineAsVariants(components, page);
  set.name = "Email contact";
  set.description = "COMP-216 · Première passe à revoir. Wide/Compact × Normal/Copying/Success/Error ; adresse .example, actions COMP-002 et retours COMP-003. Aucune destination réelle.";
  set.x = 190;
  set.y = 520;
  STATES.forEach((state, index) => {
    const wide = requiredVariant(set, `Layout=Wide, State=${state}`);
    wide.x = 0;
    wide.y = index * 650;
    const compact = requiredVariant(set, `Layout=Compact, State=${state}`);
    compact.x = 1200;
    compact.y = index * 650;
  });
  set.resizeWithoutConstraints(1520, 2660);
  staging.remove();
  page.appendChild(documentationFrame());
  previewSurface(page);
  await reviewInstance(requiredVariant(set, "Layout=Wide, State=Normal"), "Normal", "EN", page, 190, 3400);
  await reviewInstance(requiredVariant(set, "Layout=Compact, State=Error"), "Error", "EN", page, 1390, 3400);
  page.appendChild(notesFrame());
  syncApprovedCv(cvSet);
  updateIndex();
  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  figma.closePlugin("COMP-216 créé · 8 variantes et références FR/EN à revoir");
}

main().catch((error) => {
  figma.notify(`Erreur Email Contact Builder : ${error.message}`, { error: true, timeout: 10000 });
  console.error(error);
});
