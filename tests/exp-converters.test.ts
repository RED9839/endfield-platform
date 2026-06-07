import assert from "node:assert/strict";
import test from "node:test";

import {
  convertWeaponExpToItems,
  getOperatorLevelCurrencyDelta,
  getOperatorLevelExpDelta,
  getWeaponLevelCurrencyDelta,
  getWeaponLevelExpDelta,
} from "../app/simulator/_lib/exp-converters";

test("level deltas use cumulative costs and do not become negative", () => {
  assert.equal(getOperatorLevelExpDelta(20, 40), 248600);
  assert.equal(getOperatorLevelCurrencyDelta(20, 40), 12540);
  assert.equal(getWeaponLevelExpDelta(40, 80), 1098170);
  assert.equal(getWeaponLevelCurrencyDelta(40, 80), 113450);
  assert.equal(getWeaponLevelExpDelta(80, 60), 0);
});

test("weapon experience conversion rounds the smallest unit up", () => {
  assert.deepEqual(
    convertWeaponExpToItems(11201).map(({ count }) => count),
    [2, 1, 1],
  );
});
