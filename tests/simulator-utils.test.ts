import assert from "node:assert/strict";
import test from "node:test";

import {
  applyOwnedMaterials,
  buildProgressSummary,
  clampLevel,
  mergeMaterials,
  normalizeMaterials,
} from "../app/simulator/_lib/simulator-utils";

test("normalizeMaterials parses abbreviated and formatted counts", () => {
  assert.deepEqual(
    normalizeMaterials([
      { name: "Alpha", count: "1.5k" },
      { name: "Beta", count: "2,500" },
      { name: "Ignored", count: "0" },
    ]),
    [
      { name: "Alpha", count: 1500, icon: "/materials/Alpha.webp" },
      { name: "Beta", count: 2500, icon: "/materials/Beta.webp" },
    ],
  );
});

test("mergeMaterials combines duplicate material names across steps", () => {
  const merged = mergeMaterials([
    {
      label: "one",
      materials: [{ name: "Alpha", count: 2 }],
    },
    {
      label: "two",
      materials: [
        { name: "Alpha", count: 3, icon: "/custom.webp" },
        { name: "Beta", count: 1 },
      ],
    },
  ]);

  assert.deepEqual(merged, [
    { name: "Alpha", count: 5, icon: "/materials/Alpha.webp" },
    { name: "Beta", count: 1, icon: "/materials/Beta.webp" },
  ]);
});

test("applyOwnedMaterials preserves inventory while capping lacking at zero", () => {
  assert.deepEqual(
    applyOwnedMaterials(
      [{ name: "Alpha", count: 3 }],
      { Alpha: 10 },
    ),
    [{ name: "Alpha", count: 3, owned: 10, lacking: 0 }],
  );
});

test("buildProgressSummary reports calculable and impossible materials", () => {
  const summary = buildProgressSummary({
    requiredItems: [
      { name: "Alpha", count: 10 },
      { name: "Beta", count: 5 },
    ],
    ownedMaterials: { Alpha: 2 },
    dailyIncome: { Alpha: 3 },
    excludedNames: [],
  });

  assert.equal(summary.maxDays, 3);
  assert.equal(summary.cappedDays, null);
  assert.deepEqual(summary.impossibleItems, ["Beta"]);
  assert.deepEqual(
    summary.items.map(({ name, lacking, days }) => ({ name, lacking, days })),
    [
      { name: "Alpha", lacking: 8, days: 3 },
      { name: "Beta", lacking: 5, days: null },
    ],
  );
});

test("clampLevel keeps values inside the supplied range", () => {
  assert.equal(clampLevel(-1, 1, 90), 1);
  assert.equal(clampLevel(45, 1, 90), 45);
  assert.equal(clampLevel(100, 1, 90), 90);
});
