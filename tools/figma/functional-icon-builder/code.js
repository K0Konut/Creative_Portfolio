const ICONS = [
  {
    name: "ArrowRight",
    group: "Navigation",
    path: "M2.5 10H17.5 M11.5 4L17.5 10L11.5 16",
  },
  {
    name: "ArrowLeft",
    group: "Navigation",
    path: "M17.5 10H2.5 M8.5 4L2.5 10L8.5 16",
  },
  {
    name: "ExternalLink",
    group: "Ressources",
    path: "M9 3H17V11 M17 3L8.5 11.5 M15 12V17H3V5H8",
  },
  {
    name: "Download",
    group: "Ressources",
    path: "M10 2.5V12.5 M6 9L10 13L14 9 M3 15V17H17V15",
  },
  {
    name: "Mail",
    group: "Ressources",
    path: "M2.5 5H17.5V15H2.5Z M2.5 5L10 10.5L17.5 5",
  },
  {
    name: "Copy",
    group: "Ressources",
    path: "M7 3H17V14H7Z M3 7V17H13",
  },
  {
    name: "Check",
    group: "Ressources",
    path: "M3.5 10L8 14.5L16.5 5.5",
  },
  {
    name: "Alert",
    group: "État",
    path: "M10 2.5L18 17H2Z M10 7V11.5 M10 14.5V14.7",
  },
];

const COLORS = {
  canvas: "#F5F1E8",
  subtle: "#E8E1D4",
  ink: "#101113",
  violet: "#4B3CFF",
  muted: "#474747",
};

let collections = [];
let variables = [];
let font = { family: "Manrope", style: "Bold" };

function rgb(hex) {
  const value = hex.replace("#", "");
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
  const result = variables.find((entry) => entry.variableCollectionId === collection.id && entry.name === name);
  if (!result) throw new Error(`Variable absente : ${collectionName} / ${name}`);
  return result;
}

function boundPaint(paint) {
  return figma.variables.setBoundVariableForPaint(paint, "color", variable("Semantic/Color", "text/primary"));
}

function bindVectorColors(root) {
  let boundCount = 0;
  const nodes = root.findAll((entry) => "fills" in entry || "strokes" in entry);
  for (const node of nodes) {
    if ("fills" in node && Array.isArray(node.fills) && node.fills.length) {
      node.fills = node.fills.map((paint) => {
        if (paint.type !== "SOLID") return paint;
        boundCount += 1;
        return boundPaint(paint);
      });
    }
    if ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length) {
      node.strokes = node.strokes.map((paint) => {
        if (paint.type !== "SOLID") return paint;
        boundCount += 1;
        return boundPaint(paint);
      });
    }
  }
  if (!boundCount) throw new Error(`Aucun trait ni remplissage vectoriel trouvé dans ${root.name}`);
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

function iconSvg(path) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#101113" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><path d="${path}"/></svg>`;
}

function createIcon(spec, staging) {
  const component = figma.createComponent();
  component.name = `Name=${spec.name}`;
  staging.appendChild(component);
  component.resize(20, 20);
  component.fills = [];
  component.strokes = [];
  component.clipsContent = false;
  const art = figma.createNodeFromSvg(iconSvg(spec.path));
  art.name = "Vector · 20 px";
  component.appendChild(art);
  art.x = 0;
  art.y = 0;
  bindVectorColors(art);
  component.setBoundVariable("width", variable("Primitives/Size", "icon/md"));
  component.setBoundVariable("height", variable("Primitives/Size", "icon/md"));
  component.description = `${spec.group} · Icône fonctionnelle 20 × 20 px, trait 1,5 px. Décorative si le libellé porte déjà le sens. Couleur héritée de text/primary.`;
  return component;
}

function createDocumentation(page, components) {
  const heading = figma.createFrame();
  heading.name = "_Generated/Icons · Documentation";
  heading.resize(1440, 210);
  heading.x = 0;
  heading.y = 0;
  heading.fills = [solid(COLORS.canvas)];
  heading.strokes = [solid(COLORS.ink)];
  heading.strokeWeight = 1;
  const kicker = makeText("DESIGN SYSTEM · PRIMITIVES", 14, COLORS.violet);
  kicker.x = 40;
  kicker.y = 28;
  heading.appendChild(kicker);
  const title = makeText("Icônes fonctionnelles", 42, COLORS.ink);
  title.x = 40;
  title.y = 63;
  heading.appendChild(title);
  const description = makeText("Première tranche de 8 pictogrammes pour les actions et les liens avec icône. Vectoriels, éditables et liés au token de texte.", 18, COLORS.muted);
  description.x = 40;
  description.y = 126;
  heading.appendChild(description);
  page.appendChild(heading);

  const board = figma.createFrame();
  board.name = "_Generated/Icons · Review board";
  board.resize(1440, 420);
  board.x = 0;
  board.y = 250;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  page.appendChild(board);
  components.forEach((component, index) => {
    const card = figma.createFrame();
    card.name = `Icon sample · ${ICONS[index].name}`;
    card.resize(320, 160);
    card.x = 32 + (index % 4) * 348;
    card.y = 28 + Math.floor(index / 4) * 190;
    card.fills = [solid(COLORS.subtle)];
    board.appendChild(card);
    const instance = component.createInstance();
    instance.name = "Preview · 20 px";
    instance.x = 24;
    instance.y = 24;
    card.appendChild(instance);
    const titleNode = makeText(ICONS[index].name, 18, COLORS.ink);
    titleNode.x = 24;
    titleNode.y = 64;
    card.appendChild(titleNode);
    const group = makeText(ICONS[index].group.toUpperCase(), 12, COLORS.violet);
    group.x = 24;
    group.y = 108;
    card.appendChild(group);
  });

  const notes = figma.createFrame();
  notes.name = "_Generated/Icons · Usage notes";
  notes.resize(1440, 172);
  notes.x = 0;
  notes.y = 1120;
  notes.fills = [solid(COLORS.subtle)];
  const lines = [
    "TAILLE · 20 × 20 px, trait 1,5 px ; extrémités carrées et jonctions nettes.",
    "COULEUR · text/primary lié aux vecteurs ; l'usage sur violet demandera une variante sémantique adaptée au contexte.",
    "ACCESSIBILITÉ · Icône décorative quand un libellé explicite est présent ; aucun sens essentiel porté par la forme seule.",
    "SUITE · Set validé par Costa le 2026-09-21. Assembler COMP-002 Lien avec icône ; les autres pictogrammes suivront leurs consommateurs.",
  ];
  lines.forEach((line, index) => {
    const node = makeText(line, 15, COLORS.ink);
    node.x = 32;
    node.y = 20 + index * 36;
    notes.appendChild(node);
  });
  page.appendChild(notes);
}

async function ensureComponentsIndex() {
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02 — Components");
  if (!page) {
    page = figma.createPage();
    page.name = "02 — Components";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  for (const child of [...page.children]) {
    if (child.name === "_Generated/Components" || child.name === "_Generated/Components index") child.remove();
  }

  const board = figma.createFrame();
  board.name = "_Generated/Components index";
  const statusMessageExists = figma.root.children.some((entry) => entry.type === "PAGE" && entry.name === "02.4 — Status Message" && entry.children.some((child) => child.type === "COMPONENT_SET" && child.name === "Status message"));
  board.resize(1440, statusMessageExists ? 1060 : 890);
  board.x = 0;
  board.y = 0;
  board.fills = [solid(COLORS.canvas)];
  board.strokes = [solid(COLORS.ink)];
  board.strokeWeight = 1;
  page.appendChild(board);
  const kicker = makeText("02 · DESIGN SYSTEM", 14, COLORS.violet);
  kicker.x = 48;
  kicker.y = 38;
  board.appendChild(kicker);
  const title = makeText("Composants", 56, COLORS.ink);
  title.x = 48;
  title.y = 78;
  board.appendChild(title);
  const description = makeText("Cette page sert de sommaire. Les composants restent sur des pages dédiées pour conserver leurs variantes, propriétés et notes de revue.", 18, COLORS.muted);
  description.x = 48;
  description.y = 164;
  board.appendChild(description);

  const iconLinkExists = figma.root.children.some((entry) => entry.type === "PAGE" && entry.name === "02.3 — Icon Link" && entry.children.some((child) => child.type === "COMPONENT_SET" && child.name === "Icon link"));
  const entries = [
    ["COMP-001 · Action", "VALIDÉ · 20 VARIANTES", "02.1 — Action", "Actions principales, secondaires, textuelles et de contrôle. Rayon 8 px et focus bicolore approuvés."],
    ["Functional icon", "VALIDÉ · 8 VARIANTES", "02.2 — Functional Icons", "Première tranche d'icônes vectorielles approuvée pour les actions et les liens avec icône."],
    ["COMP-002 · Lien avec icône", iconLinkExists ? "VALIDÉ · 19 VARIANTES" : "À CONSTRUIRE", iconLinkExists ? "02.3 — Icon Link" : "Page dédiée à venir", iconLinkExists ? "Quatre usages et 19 états approuvés ; icône liée à Purpose et State." : "Dépend de la validation des icônes et réutilise COMP-001 Action."],
  ];
  if (statusMessageExists) entries.push(["COMP-003 · Message d'état", "À VALIDER · 10 VARIANTES", "02.4 — Status Message", "Cinq types de message, formats inline et section ; textes de revue à contextualiser."]);
  entries.forEach(([name, status, destination, detail], index) => {
    const card = figma.createFrame();
    card.name = `Index · ${name}`;
    card.resize(1344, 174);
    card.x = 48;
    card.y = 250 + index * 196;
    card.fills = [solid(index % 2 === 0 ? COLORS.subtle : COLORS.canvas)];
    card.strokes = [solid(COLORS.ink)];
    card.strokeWeight = 1;
    board.appendChild(card);
    const heading = makeText(name, 28, COLORS.ink);
    heading.x = 28;
    heading.y = 20;
    card.appendChild(heading);
    const badge = makeText(status, 14, COLORS.violet);
    badge.x = 28;
    badge.y = 65;
    card.appendChild(badge);
    const descriptionNode = makeText(detail, 16, COLORS.muted);
    descriptionNode.x = 28;
    descriptionNode.y = 105;
    card.appendChild(descriptionNode);
    const pageName = makeText(destination, 16, COLORS.violet);
    pageName.x = 940;
    pageName.y = 65;
    card.appendChild(pageName);
  });
  figma.currentPage.selection = [board];
  figma.viewport.scrollAndZoomIntoView([board]);
}

async function prepare() {
  collections = await figma.variables.getLocalVariableCollectionsAsync();
  variables = await figma.variables.getLocalVariablesAsync();
  const color = variable("Semantic/Color", "text/primary");
  variable("Primitives/Size", "icon/md");
  const labelStyle = (await figma.getLocalTextStylesAsync()).find((entry) => entry.name === "Type/Label/MD/Large");
  if (!labelStyle) throw new Error("Style Type/Label/MD/Large absent : relancer Foundations Builder");
  font = labelStyle.fontName;
  await figma.loadFontAsync(font);
  color.scopes = Array.from(new Set([...color.scopes, "TEXT_FILL", "STROKE_COLOR", "SHAPE_FILL"]));
}

async function main() {
  figma.notify("Construction des icônes fonctionnelles…", { timeout: 3000 });
  await prepare();
  await figma.loadAllPagesAsync();
  let page = figma.root.children.find((entry) => entry.type === "PAGE" && entry.name === "02.2 — Functional Icons");
  if (!page) {
    page = figma.createPage();
    page.name = "02.2 — Functional Icons";
  }
  await figma.setCurrentPageAsync(page);
  page.backgrounds = [solid(COLORS.canvas)];
  const existing = page.children.find((entry) => entry.type === "COMPONENT_SET" && entry.name === "Functional icon");
  if (existing) {
    const actual = existing.children.map((entry) => entry.name);
    if (actual.length !== ICONS.length || ICONS.some((spec) => !actual.includes(`Name=${spec.name}`))) {
      throw new Error(`Set d'icônes incomplet (${actual.length}/${ICONS.length}) : arrêter sans suppression et prévenir Codex.`);
    }
    existing.description = "8 icônes fonctionnelles approuvées par Costa le 2026-09-21. Variante Name ; taille icon/md 20 px ; couleur liée à text/primary.";
    const notes = page.children.find((entry) => entry.name === "_Generated/Icons · Usage notes");
    const nextStep = notes && notes.children.find((entry) => entry.type === "TEXT" && entry.characters.startsWith("SUITE ·"));
    if (nextStep) nextStep.characters = "SUITE · Set validé par Costa le 2026-09-21. Assembler COMP-002 Lien avec icône ; les autres pictogrammes suivront leurs consommateurs.";
    await ensureComponentsIndex();
    figma.closePlugin("Sommaire Components actualisé · icônes validées");
    return;
  }

  const staleDraft = page.children.find((entry) => entry.name === "_Generated/Icons Draft");
  if (staleDraft) staleDraft.remove();
  const staging = figma.createFrame();
  staging.name = "_Generated/Icons Draft";
  staging.resize(1, 1);
  staging.x = -2000;
  staging.fills = [];
  staging.clipsContent = false;
  const components = ICONS.map((spec) => createIcon(spec, staging));
  const set = figma.combineAsVariants(components, page);
  set.name = "Functional icon";
  set.description = "8 icônes fonctionnelles approuvées par Costa le 2026-09-21. Variante Name ; taille icon/md 20 px ; couleur liée à text/primary.";
  set.x = 0;
  set.y = 720;
  components.forEach((component, index) => {
    component.x = 24 + (index % 4) * 250;
    component.y = 24 + Math.floor(index / 4) * 125;
  });
  set.resizeWithoutConstraints(1020, 300);
  staging.remove();
  createDocumentation(page, components);
  await ensureComponentsIndex();
  figma.closePlugin("Icônes créées · sommaire Components actualisé");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  figma.notify(`Erreur Functional Icons Builder : ${message}`, { error: true, timeout: 10000 });
  figma.closePlugin(`Erreur : ${message}`);
});
