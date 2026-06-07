import assert from "node:assert/strict";
import test from "node:test";

import { isEnvCheckEnabled } from "../lib/env-check";

test("environment checks are disabled in production", () => {
  assert.equal(isEnvCheckEnabled("production"), false);
  assert.equal(isEnvCheckEnabled("development"), true);
  assert.equal(isEnvCheckEnabled("test"), true);
});
