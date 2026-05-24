import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDemoInput,
  buildOfferDraft,
  calculateRoomAreas,
  renderOfferMarkdown,
  summarizeDraft,
} from "../src/offer-flow.mjs";

test("calculates wall and ceiling areas with openings", () => {
  const area = calculateRoomAreas({
    name: "Wohnzimmer",
    lengthM: 5,
    widthM: 4,
    heightM: 2.5,
    doors: 1,
    windows: 2,
    measuredFrom: "manual-input",
  });

  assert.equal(area.ceilingAreaM2, 20);
  assert.equal(area.wallAreaM2, 40.23);
  assert.equal(area.openingAreaM2, 4.77);
  assert.equal(area.needsMeasurementReview, true);
});

test("builds a reviewable offer draft from demo room data", () => {
  const draft = buildOfferDraft(buildDemoInput());

  assert.equal(draft.project, "Wohnung Mustermann");
  assert.equal(draft.customer, "Max Mustermann");
  assert.equal(draft.publicSafety.containsCustomerData, false);
  assert.equal(draft.publicSafety.containsApiDetails, false);
  assert.equal(draft.publicSafety.containsSecrets, false);
  assert.equal(draft.reviewRequired, true);
  assert.equal(draft.lineItems.length, 5);
  assert.ok(draft.totals.net > 0);
  assert.ok(draft.totals.gross > draft.totals.net);
  assert.ok(draft.reviewFlags.some((flag) => flag.field === "measurements"));
  assert.ok(draft.reviewFlags.some((flag) => flag.field === "photos"));
});

test("supports custom price lists without changing public-safety guarantees", () => {
  const draft = buildOfferDraft(
    buildDemoInput({
      priceList: {
        wallPaintPerM2: 12,
        ceilingPaintPerM2: 14,
        prepPerM2: 3,
        maskingPerM2: 1.5,
        hourlyRate: 60,
        disposalFlat: 55,
      },
    }),
  );

  assert.equal(draft.reviewFlags.some((flag) => flag.field === "priceList"), false);
  assert.equal(draft.assumptions[0], "Preise stammen aus übergebenen Demo-Preisdaten.");
  assert.equal(draft.publicSafety.usesDemoData, true);
});

test("summarizes draft for a compact UI or README example", () => {
  const draft = buildOfferDraft({
    rooms: [{ name: "Büro", lengthM: 4, widthM: 3, heightM: 2.5, doors: 1, windows: 1 }],
  });

  assert.deepEqual(summarizeDraft(draft), {
    project: "Demo-Projekt",
    positions: 2,
    netTotal: draft.totals.net,
    grossTotal: draft.totals.gross,
    reviewRequired: true,
    blockingReviewFlags: 0,
    reviewFlags: 2,
  });
});

test("renders a markdown offer draft with handoff checklist", () => {
  const markdown = renderOfferMarkdown(buildOfferDraft(buildDemoInput()));

  assert.match(markdown, /# Angebotsentwurf · Wohnung Mustermann/);
  assert.match(markdown, /## Positionen/);
  assert.match(markdown, /Raummaße müssen fachlich geprüft werden/);
  assert.match(markdown, /- \[ \] Raummaße und Öffnungen prüfen/);
});

test("blocks empty room input through review flags", () => {
  const draft = buildOfferDraft({ project: "Leeres Demo-Projekt", rooms: [] });

  assert.equal(draft.reviewFlags.some((flag) => flag.severity === "blocker"), true);
  assert.equal(summarizeDraft(draft).blockingReviewFlags, 1);
});
