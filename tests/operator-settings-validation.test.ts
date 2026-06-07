import assert from "node:assert/strict";
import test from "node:test";

import { consumeRateLimit } from "../lib/http/rate-limit";
import { validateOperatorSettingInput } from "../lib/operator-settings/validation";

test("operator setting validation trims accepted text", () => {
  const result = validateOperatorSettingInput({
    title: "  Sample  ",
    description: "  Description  ",
    slots: { main: { operatorSlug: "operator-a" } },
    cycle: [],
  });

  assert.deepEqual(result, {
    ok: true,
    data: {
      title: "Sample",
      description: "Description",
      slots: { main: { operatorSlug: "operator-a" } },
      cycle: [],
    },
  });
});

test("operator setting validation rejects missing main slots and oversized text", () => {
  assert.equal(
    validateOperatorSettingInput({
      title: "Sample",
      slots: {},
      cycle: [],
    }).ok,
    false,
  );
  assert.equal(
    validateOperatorSettingInput({
      title: "x".repeat(81),
      slots: { main: { operatorSlug: "operator-a" } },
      cycle: [],
    }).ok,
    false,
  );
});

test("rate limiting blocks requests until the window resets", () => {
  const base = {
    scope: "test",
    identifier: "unique-test-user",
    limit: 2,
    windowMs: 1000,
  };

  assert.equal(consumeRateLimit({ ...base, now: 1000 }).allowed, true);
  assert.equal(consumeRateLimit({ ...base, now: 1100 }).allowed, true);
  assert.equal(consumeRateLimit({ ...base, now: 1200 }).allowed, false);
  assert.equal(consumeRateLimit({ ...base, now: 2001 }).allowed, true);
});
