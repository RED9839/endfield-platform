import assert from "node:assert/strict";
import test from "node:test";

import { resolveCycleStates } from "../lib/combat/cycle-state";

test("same Arts attachment stacks trigger an Arts burst without consuming stacks", () => {
  const result = resolveCycleStates([
    { artsEffects: [{ operation: "apply", elements: ["heat"], stacks: 1 }] },
    { artsEffects: [{ operation: "apply", elements: ["heat"], stacks: 1 }] },
  ]);

  assert.deepEqual(result[1].artsState, { element: "heat", stacks: 2 });
  assert.deepEqual(result[1].reactionState, { reaction: "heatBurst" });
});

test("a different Arts attachment consumes attachments and triggers its abnormality", () => {
  const result = resolveCycleStates([
    { artsEffects: [{ operation: "apply", elements: ["heat"], stacks: 2 }] },
    {
      artsEffects: [
        { operation: "apply", elements: ["electric"], stacks: 1 },
      ],
    },
  ]);

  assert.equal(result[1].artsState, null);
  assert.deepEqual(result[1].reactionState, { reaction: "electrified" });
});

test("current operator Arts data overrides a stale saved cycle snapshot", () => {
  const [result] = resolveCycleStates([
    {
      operatorSlug: "rossi",
      skillKey: "ultimate",
      artsEffects: [{ operation: "apply", elements: ["cryo"], stacks: 2 }],
    },
  ]);

  assert.deepEqual(result.artsState, { element: "heat", stacks: 1 });
});

test("launch and knockdown add defense-break stacks on repeated applications", () => {
  const result = resolveCycleStates([
    {
      physicalEffects: [
        { operation: "applyPhysicalStatus", status: "launch" },
      ],
    },
    {
      physicalEffects: [
        { operation: "applyPhysicalStatus", status: "knockdown" },
      ],
    },
  ]);

  assert.equal(result[0].physicalState?.defenseBreakStacks, 1);
  assert.equal(result[1].physicalState?.defenseBreakStacks, 2);
  assert.equal(result[1].physicalState?.status, "knockdown");
});

test("smash consumes all accumulated defense-break stacks", () => {
  const result = resolveCycleStates([
    { physicalEffects: [{ operation: "applyDefenseBreak", stacks: 3 }] },
    {
      physicalEffects: [
        { operation: "applyPhysicalStatus", status: "smash" },
      ],
    },
  ]);

  assert.deepEqual(result[1].physicalState, {
    defenseBreakStacks: 0,
    status: "smash",
  });
});

test("shatter is displayed once after frozen receives a physical effect", () => {
  const result = resolveCycleStates([
    {
      artsEffects: [
        { operation: "applyReaction", reaction: "frozen", forced: true },
      ],
    },
    { physicalEffects: [{ operation: "applyDefenseBreak", stacks: 1 }] },
    {},
  ]);

  assert.deepEqual(result[1].reactionState, { reaction: "shatter" });
  assert.equal(result[2].reactionState, null);
});

test("Lifeng ultimate applies knockdown twice and reaches two stacks", () => {
  const [result] = resolveCycleStates([
    { operatorSlug: "lifeng", skillKey: "ultimate" },
  ]);

  assert.equal(result.physicalState?.defenseBreakStacks, 2);
  assert.equal(result.physicalState?.status, "knockdown");
});

test("Mifu ultimate adds one stack from launch but none from knockdown", () => {
  const [, result] = resolveCycleStates([
    { physicalEffects: [{ operation: "applyDefenseBreak", stacks: 1 }] },
    { operatorSlug: "mifu", skillKey: "ultimate" },
  ]);

  assert.equal(result.physicalState?.defenseBreakStacks, 2);
  assert.equal(result.physicalState?.status, "knockdown");
});
