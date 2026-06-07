import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFarmingHref,
  readFarmingTransferFromUrl,
  safeFarmingMaterials,
} from "../lib/farming/farming-transfer";

test("safeFarmingMaterials accepts supported aliases and rejects invalid rows", () => {
  assert.deepEqual(
    safeFarmingMaterials([
      { material: "Alpha", count: "4" },
      { name: "Beta", owned: 2 },
      { name: "", amount: 10 },
      { name: "Gamma", amount: -1 },
      null,
    ]),
    [
      { name: "Alpha", amount: 4 },
      { name: "Beta", amount: 2 },
    ],
  );
});

test("farming payload survives URL serialization", () => {
  const href = buildFarmingHref({
    requiredMaterials: [{ name: "Alpha", amount: 3 }],
    ownedMaterials: [{ name: "Alpha", amount: 1 }],
  });
  const params = new URL(href, "https://example.test").searchParams;

  assert.deepEqual(readFarmingTransferFromUrl(params), {
    requiredMaterials: [{ name: "Alpha", amount: 3 }],
    ownedMaterials: [{ name: "Alpha", amount: 1 }],
  });
});

test("malformed farming URL data resolves to empty arrays", () => {
  const params = new URLSearchParams({
    requiredMaterials: "{invalid",
    ownedMaterials: "null",
  });

  assert.deepEqual(readFarmingTransferFromUrl(params), {
    requiredMaterials: [],
    ownedMaterials: [],
  });
});
