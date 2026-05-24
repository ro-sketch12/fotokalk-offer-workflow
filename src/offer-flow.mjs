const DEFAULT_DOOR_AREA_M2 = 1.89;
const DEFAULT_WINDOW_AREA_M2 = 1.44;
const DEFAULT_VAT_RATE = 0.19;

export const demoPriceList = Object.freeze({
  wallPaintPerM2: 9.5,
  ceilingPaintPerM2: 11.25,
  prepPerM2: 2.4,
  maskingPerM2: 1.35,
  hourlyRate: 52,
  disposalFlat: 45,
});

export function buildDemoInput(overrides = {}) {
  return deepMerge(
    {
      project: "Wohnung Mustermann",
      customer: "Max Mustermann",
      businessProfile: {
        companyName: "Malerbetrieb Demo",
        brandVoice: "klar, freundlich, fachlich vorsichtig",
        defaultHourlyRate: 52,
        vatRate: DEFAULT_VAT_RATE,
      },
      includePrepWork: true,
      includeMasking: true,
      includeDisposal: true,
      notes: [
        "Wohnzimmer und Flur sollen neu gestrichen werden.",
        "Untergrund im Flur wirkt uneben und sollte vor Ort geprüft werden.",
      ],
      photos: [
        { fileName: "wohnzimmer-demo.jpg", note: "Wand mit alten Bohrlöchern" },
        { fileName: "flur-demo.jpg", note: "enger Bereich mit mehreren Türen" },
      ],
      rooms: [
        {
          name: "Wohnzimmer",
          lengthM: 5,
          widthM: 4,
          heightM: 2.5,
          doors: 1,
          windows: 2,
          measuredFrom: "manual-input",
        },
        {
          name: "Flur",
          lengthM: 3,
          widthM: 1.8,
          heightM: 2.5,
          doors: 3,
          windows: 0,
          measuredFrom: "manual-input",
        },
      ],
    },
    overrides,
  );
}

export function buildOfferDraft(input) {
  const businessProfile = normalizeBusinessProfile(input.businessProfile || {});
  const priceList = { ...demoPriceList, ...(input.priceList || {}) };
  const rooms = (input.rooms || []).map(calculateRoomAreas);
  const context = buildProjectContext(input);
  const lineItems = buildLineItems({ input, rooms, priceList });
  const totals = calculateTotals(lineItems, businessProfile.vatRate);
  const reviewFlags = buildReviewFlags(input, rooms, priceList);

  return {
    project: input.project || "Demo-Projekt",
    customer: input.customer || "Max Mustermann",
    businessProfile,
    context,
    rooms,
    lineItems,
    totals,
    assumptions: buildAssumptions(input, priceList),
    reviewRequired: true,
    reviewFlags,
    handoffChecklist: buildHandoffChecklist(reviewFlags),
    publicSafety: {
      usesDemoData: true,
      containsCustomerData: false,
      containsApiDetails: false,
      containsSecrets: false,
    },
  };
}

export function calculateRoomAreas(room) {
  const length = toPositiveNumber(room.lengthM, "lengthM");
  const width = toPositiveNumber(room.widthM, "widthM");
  const height = toPositiveNumber(room.heightM, "heightM");
  const doors = toPositiveNumber(room.doors ?? 0, "doors");
  const windows = toPositiveNumber(room.windows ?? 0, "windows");

  const rawWallArea = 2 * (length + width) * height;
  const openingsArea = doors * DEFAULT_DOOR_AREA_M2 + windows * DEFAULT_WINDOW_AREA_M2;
  const wallAreaM2 = Math.max(0, rawWallArea - openingsArea);
  const ceilingAreaM2 = length * width;

  return {
    room: room.name || "Raum",
    wallAreaM2: round2(wallAreaM2),
    ceilingAreaM2: round2(ceilingAreaM2),
    openingAreaM2: round2(openingsArea),
    measuredFrom: room.measuredFrom || "manual-input",
    needsMeasurementReview: room.measuredFrom !== "verified-measurement",
  };
}

export function summarizeDraft(draft) {
  return {
    project: draft.project,
    positions: draft.lineItems.length,
    netTotal: draft.totals.net,
    grossTotal: draft.totals.gross,
    reviewRequired: draft.reviewRequired,
    blockingReviewFlags: draft.reviewFlags.filter((flag) => flag.severity === "blocker").length,
    reviewFlags: draft.reviewFlags.length,
  };
}

export function renderOfferMarkdown(draft) {
  const roomRows = draft.rooms
    .map(
      (room) =>
        `| ${room.room} | ${formatNumber(room.wallAreaM2)} m2 | ${formatNumber(room.ceilingAreaM2)} m2 | ${
          room.needsMeasurementReview ? "prüfen" : "verifiziert"
        } |`,
    )
    .join("\n");

  const lineRows = draft.lineItems
    .map(
      (item) =>
        `| ${item.code} | ${item.label} | ${formatNumber(item.quantity)} ${item.unit} | ${formatCurrency(
          item.unitPrice,
        )} | ${formatCurrency(item.total)} |`,
    )
    .join("\n");

  const flags = draft.reviewFlags
    .map((flag) => `- ${flag.severity.toUpperCase()}: ${flag.message}`)
    .join("\n");

  const checklist = draft.handoffChecklist.map((item) => `- [ ] ${item}`).join("\n");

  return [
    `# Angebotsentwurf · ${draft.project}`,
    "",
    `Kunde: ${draft.customer}`,
    `Betrieb: ${draft.businessProfile.companyName}`,
    "",
    "> Demo-Auszug: Dieser Entwurf nutzt synthetische Daten und muss fachlich geprüft werden.",
    "",
    "## Kontext",
    "",
    draft.context.summary,
    "",
    "## Räume",
    "",
    "| Raum | Wandfläche | Deckenfläche | Status |",
    "| --- | ---: | ---: | --- |",
    roomRows,
    "",
    "## Positionen",
    "",
    "| Code | Leistung | Menge | Einzelpreis | Summe |",
    "| --- | --- | ---: | ---: | ---: |",
    lineRows,
    "",
    "## Summe",
    "",
    `- Netto: ${formatCurrency(draft.totals.net)}`,
    `- MwSt: ${formatCurrency(draft.totals.vat)}`,
    `- Brutto: ${formatCurrency(draft.totals.gross)}`,
    "",
    "## Prüfhinweise",
    "",
    flags || "- Keine Prüfhinweise.",
    "",
    "## Übergabe an den Maler",
    "",
    checklist,
    "",
  ].join("\n");
}

function normalizeBusinessProfile(profile) {
  return {
    companyName: profile.companyName || "Demo-Betrieb",
    brandVoice: profile.brandVoice || "klar, fachlich, nicht übertrieben",
    defaultHourlyRate: toPositiveNumber(profile.defaultHourlyRate ?? demoPriceList.hourlyRate, "defaultHourlyRate"),
    vatRate: toPositiveNumber(profile.vatRate ?? DEFAULT_VAT_RATE, "vatRate"),
  };
}

function buildProjectContext(input) {
  const notes = Array.isArray(input.notes) ? input.notes.filter(Boolean) : [];
  const photos = Array.isArray(input.photos) ? input.photos : [];

  return {
    notes,
    photos: photos.map((photo) => ({
      fileName: photo.fileName || "demo-photo.jpg",
      note: photo.note || "Demo-Foto ohne echte Kundendaten",
    })),
    summary: [
      notes.length > 0 ? `${notes.length} Notizen` : "keine Notizen",
      photos.length > 0 ? `${photos.length} Foto-Kontexte` : "keine Foto-Kontexte",
      `${(input.rooms || []).length} Räume`,
    ].join(" · "),
  };
}

function buildLineItems({ input, rooms, priceList }) {
  const totalWallArea = round2(rooms.reduce((sum, room) => sum + room.wallAreaM2, 0));
  const totalCeilingArea = round2(rooms.reduce((sum, room) => sum + room.ceilingAreaM2, 0));
  const combinedPaintArea = round2(totalWallArea + totalCeilingArea);

  const lineItems = [
    createLineItem("WALL-PAINT", "Wandflächen streichen", totalWallArea, "m2", priceList.wallPaintPerM2, "room-measurements"),
    createLineItem(
      "CEILING-PAINT",
      "Deckenflächen streichen",
      totalCeilingArea,
      "m2",
      priceList.ceilingPaintPerM2,
      "room-measurements",
    ),
  ];

  if (input.includePrepWork) {
    lineItems.push(createLineItem("PREP", "Untergrund vorbereiten", combinedPaintArea, "m2", priceList.prepPerM2, "context-note"));
  }

  if (input.includeMasking) {
    lineItems.push(createLineItem("MASKING", "Abkleben und Schutzarbeiten", combinedPaintArea, "m2", priceList.maskingPerM2, "standard-position"));
  }

  if (input.includeDisposal) {
    lineItems.push(createLineItem("DISPOSAL", "Material- und Entsorgungspauschale", 1, "pauschal", priceList.disposalFlat, "standard-position"));
  }

  return lineItems.filter((item) => item.quantity > 0);
}

function createLineItem(code, label, quantity, unit, unitPrice, source) {
  return {
    code,
    label,
    quantity: round2(quantity),
    unit,
    unitPrice: round2(unitPrice),
    total: round2(quantity * unitPrice),
    source,
  };
}

function calculateTotals(lineItems, vatRate) {
  const net = round2(lineItems.reduce((sum, item) => sum + item.total, 0));
  const vat = round2(net * vatRate);
  return {
    net,
    vat,
    gross: round2(net + vat),
    currency: "EUR",
  };
}

function buildReviewFlags(input, rooms, priceList) {
  const flags = [];

  if (!input.rooms || input.rooms.length === 0) {
    flags.push({
      severity: "blocker",
      field: "rooms",
      message: "Mindestens ein Raum muss erfasst werden.",
    });
  }

  if (rooms.some((room) => room.needsMeasurementReview)) {
    flags.push({
      severity: "review",
      field: "measurements",
      message: "Raummaße müssen fachlich geprüft werden.",
    });
  }

  if (!input.priceList) {
    flags.push({
      severity: "review",
      field: "priceList",
      message: "Demo-Preisliste genutzt; echte Preise müssen geprüft werden.",
    });
  }

  if ((input.photos || []).length > 0) {
    flags.push({
      severity: "review",
      field: "photos",
      message: "Fotos liefern Kontext, ersetzen aber kein Aufmaß.",
    });
  }

  if (priceList.hourlyRate <= 0) {
    flags.push({
      severity: "blocker",
      field: "hourlyRate",
      message: "Stundenlohn muss größer als 0 sein.",
    });
  }

  return flags;
}

function buildAssumptions(input, priceList) {
  return [
    input.priceList ? "Preise stammen aus übergebenen Demo-Preisdaten." : "Es wurde die Demo-Preisliste genutzt.",
    "Raummaße müssen vor Angebotsversand geprüft werden.",
    `Stundenlohn-Basis im Demo-Setup: ${formatCurrency(priceList.hourlyRate)}.`,
  ];
}

function buildHandoffChecklist(reviewFlags) {
  const checklist = [
    "Raummaße und Öffnungen prüfen",
    "Leistungspositionen fachlich prüfen",
    "Preise und Stundenlohn gegen eigene Preislogik prüfen",
    "Formulierungen an Kundenkommunikation anpassen",
  ];

  if (reviewFlags.some((flag) => flag.field === "photos")) {
    checklist.push("Foto-Kontext gegen Vor-Ort-Eindruck abgleichen");
  }

  return checklist;
}

function toPositiveNumber(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`${label} must be a positive number`);
  }
  return n;
}

function deepMerge(base, overrides) {
  const output = { ...base };
  for (const [key, value] of Object.entries(overrides || {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key]) {
      output[key] = deepMerge(base[key], value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

function formatCurrency(value) {
  return `${formatNumber(value)} EUR`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function round2(value) {
  return Math.round(value * 100) / 100;
}
