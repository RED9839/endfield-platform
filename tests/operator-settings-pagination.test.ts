import assert from "node:assert/strict";
import test from "node:test";

import {
  getGroupedPageWindow,
  getSettingsLimit,
  getSettingsPage,
} from "../lib/operator-settings/pagination";

test("settings pagination parameters reject invalid values and cap limits", () => {
  assert.equal(getSettingsPage(null), 1);
  assert.equal(getSettingsPage("-2"), 1);
  assert.equal(getSettingsPage("2.9"), 2);
  assert.equal(getSettingsLimit("0"), 24);
  assert.equal(getSettingsLimit("1000"), 60);
});

test("grouped pagination fills a page across the group boundary", () => {
  assert.deepEqual(
    getGroupedPageWindow({
      page: 2,
      limit: 10,
      primaryTotal: 14,
      secondaryTotal: 9,
    }),
    {
      total: 23,
      hasMore: true,
      primarySkip: 10,
      primaryTake: 4,
      secondarySkip: 0,
      secondaryTake: 6,
    },
  );
});

test("grouped pagination skips directly into the secondary group", () => {
  assert.deepEqual(
    getGroupedPageWindow({
      page: 3,
      limit: 10,
      primaryTotal: 4,
      secondaryTotal: 30,
    }),
    {
      total: 34,
      hasMore: true,
      primarySkip: 4,
      primaryTake: 0,
      secondarySkip: 16,
      secondaryTake: 10,
    },
  );
});
