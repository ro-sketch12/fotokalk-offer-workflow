import test from "node:test";
import assert from "node:assert/strict";
import { buildOfferDraft, calculateRoomAreas, summarizeDraft } from "../src/offer-flow.mjs";

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
  assert.equal(area.needsMeasurementReview, true);
});

test("builds a reviewable offer draft from demo room data", () => {
  const draft = buildOfferDraft({
    project: "Wohnung Mustermann",
    customer: "Max Mustermann",
    includePrepWork: true,
    photos: ["baustelle-demo.jpg"],
    rooms: [
      { name: "Wohnzimmer", lengthM: 5, widthM: 4, heightM: 2.5, doors: 1, windows: 2 },
      { name: "Flur", lengthM: 3, widthM: 1.8, heightM: 2.5, doors: 3, windows: 0 },
    ],
  });

  assert.equal(draft.publicSafety.containsCustomerData, false);
  assert.equal(draft.publicSafety.containsApiDetails, false);
  assert.equal(draft.reviewRequired, true);
  assert.equal(draft.lineItems.length, 3);
  assert.ok(draft.subtotal > 0);
  assert.ok(draft.reviewFlags.some((flag) => flag.field === "measurements"));
  assert.ok(draft.reviewFlags.some((flag) => flag.field === "photos"));
});

test("summarizes draft for a compact UI or README proof", () => {
  const draft = buildOfferDraft({
    rooms: [{ name: "Büro", lengthM: 4, widthM: 3, heightM: 2.5, doors: 1, windows: 1 }],
  });

  assert.deepEqual(summarizeDraft(draft), {
    project: "Demo-Projekt",
    positions: 2,
    subtotal: draft.subtotal,
    reviewRequired: true,
    blockingReviewFlags: 0,
  });
});

