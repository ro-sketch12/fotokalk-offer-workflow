const DEFAULT_DOOR_AREA_M2 = 1.89;
const DEFAULT_WINDOW_AREA_M2 = 1.44;

export const demoPriceList = Object.freeze({
  wallPaintPerM2: 9.5,
  ceilingPaintPerM2: 11.25,
  prepPerM2: 2.4,
  hourlyRate: 52,
});

function toPositiveNumber(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`${label} must be a positive number`);
  }
  return n;
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
    measuredFrom: room.measuredFrom || "manual-input",
    needsMeasurementReview: room.measuredFrom !== "verified-measurement",
  };
}

export function buildOfferDraft(input) {
  const priceList = { ...demoPriceList, ...(input.priceList || {}) };
  const rooms = (input.rooms || []).map(calculateRoomAreas);
  const totalWallArea = round2(rooms.reduce((sum, room) => sum + room.wallAreaM2, 0));
  const totalCeilingArea = round2(rooms.reduce((sum, room) => sum + room.ceilingAreaM2, 0));

  const prepArea = input.includePrepWork ? totalWallArea + totalCeilingArea : 0;
  const lineItems = [
    {
      code: "WALL-PAINT",
      label: "Wandflächen streichen",
      quantity: totalWallArea,
      unit: "m2",
      unitPrice: priceList.wallPaintPerM2,
      source: "room-measurements",
    },
    {
      code: "CEILING-PAINT",
      label: "Deckenflächen streichen",
      quantity: totalCeilingArea,
      unit: "m2",
      unitPrice: priceList.ceilingPaintPerM2,
      source: "room-measurements",
    },
  ];

  if (prepArea > 0) {
    lineItems.push({
      code: "PREP",
      label: "Untergrund vorbereiten",
      quantity: round2(prepArea),
      unit: "m2",
      unitPrice: priceList.prepPerM2,
      source: "context-note",
    });
  }

  const subtotal = round2(lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
  const reviewFlags = buildReviewFlags(input, rooms);

  return {
    project: input.project || "Demo-Projekt",
    customer: input.customer || "Max Mustermann",
    rooms,
    lineItems: lineItems.map((item) => ({
      ...item,
      total: round2(item.quantity * item.unitPrice),
    })),
    subtotal,
    currency: "EUR",
    reviewRequired: true,
    reviewFlags,
    publicSafety: {
      usesDemoData: true,
      containsCustomerData: false,
      containsApiDetails: false,
    },
  };
}

export function summarizeDraft(draft) {
  return {
    project: draft.project,
    positions: draft.lineItems.length,
    subtotal: draft.subtotal,
    reviewRequired: draft.reviewRequired,
    blockingReviewFlags: draft.reviewFlags.filter((flag) => flag.severity === "blocker").length,
  };
}

function buildReviewFlags(input, rooms) {
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

  return flags;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

