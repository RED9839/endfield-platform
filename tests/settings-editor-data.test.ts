import assert from "node:assert/strict";
import test from "node:test";

import { buildSettingsEditorDataPayload } from "../lib/settings/editor-data";

test("settings editor gear catalog includes picker card metadata", () => {
  const payload = buildSettingsEditorDataPayload();

  assert.equal(payload.ok, true);
  assert.ok(payload.gears.length > 0);

  for (const gear of payload.gears) {
    assert.equal(typeof gear.slug, "string");
    assert.equal(typeof gear.name, "string");
    assert.equal(typeof gear.enName, "string");
    assert.equal(typeof gear.image, "string");
    assert.equal(typeof gear.level, "number");
    assert.equal(typeof gear.quality, "number");
    assert.equal(typeof gear.category, "string");
    assert.equal(typeof gear.setName, "string");
    assert.ok(Array.isArray(gear.abilityTypes));
    assert.ok(Array.isArray(gear.attributeTypes));
    assert.equal(typeof gear.attributeLabel, "string");
  }
});

test("settings editor catalog includes selectable operator and weapon fields", () => {
  const payload = buildSettingsEditorDataPayload();

  assert.ok(payload.operators.length > 0);
  assert.ok(payload.weapons.length > 0);

  for (const operator of payload.operators) {
    assert.equal(typeof operator.slug, "string");
    assert.equal(typeof operator.name, "string");
    assert.equal(typeof operator.enName, "string");
    assert.equal(typeof operator.rarity, "number");
    assert.equal(typeof operator.element, "string");
    assert.equal(typeof operator.class, "string");
    assert.equal(typeof operator.weapon, "string");
    assert.equal(typeof operator.avatar, "string");
  }

  for (const weapon of payload.weapons) {
    assert.equal(typeof weapon.slug, "string");
    assert.equal(typeof weapon.name, "string");
    assert.equal(typeof weapon.enName, "string");
    assert.equal(typeof weapon.rarity, "number");
    assert.equal(typeof weapon.weaponType, "string");
    assert.equal(typeof weapon.image, "string");
  }
});
