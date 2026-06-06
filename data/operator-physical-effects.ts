import type { OperatorSkillKey } from "./operator-arts-effects";

export type PhysicalStatus =
  | "defenseBreak"
  | "launch"
  | "knockdown"
  | "smash"
  | "armorBreak";

export type PhysicalEffect =
  | {
      operation: "applyDefenseBreak";
      stacks: number;
      condition?: string;
      notes?: string;
    }
  | {
      operation: "consumeDefenseBreak";
      stacks: "all";
      condition?: string;
      notes?: string;
    }
  | {
      operation: "requireDefenseBreak";
      minimumStacks: number;
      condition?: string;
      notes?: string;
    }
  | {
      operation: "applyPhysicalStatus";
      status: Exclude<PhysicalStatus, "defenseBreak">;
      forced?: boolean;
      condition?: string;
      notes?: string;
    }
  | {
      operation: "requirePhysicalStatus";
      statuses: PhysicalStatus[] | "any";
      condition?: string;
      notes?: string;
    }
  | {
      operation: "reapplyPhysicalStatus";
      statuses: PhysicalStatus[] | "current";
      condition?: string;
      notes?: string;
    };

export type OperatorPhysicalEffectData = Record<
  string,
  Partial<Record<OperatorSkillKey, PhysicalEffect[]>>
>;

// Base skill descriptions only. Potentials and talents are intentionally excluded.
// Non-forced physical abnormalities apply one defense-break stack if none exists.
// If defense-break is present, the abnormality activates; smash/armor break consume stacks.
export const operatorPhysicalEffects: OperatorPhysicalEffectData = {
  rossi: {
    battleSkill: [{ operation: "applyPhysicalStatus", status: "launch" }],
    comboSkill: [
      { operation: "requireDefenseBreak", minimumStacks: 1 },
      { operation: "applyPhysicalStatus", status: "launch", condition: "second hit" },
      {
        operation: "applyDefenseBreak",
        stacks: 1,
        condition: "second hit connects with correct timing",
      },
    ],
  },
  tangtang: {},
  lifeng: {
    battleSkill: [{ operation: "applyPhysicalStatus", status: "knockdown" }],
    comboSkill: [
      { operation: "requirePhysicalStatus", statuses: ["armorBreak"] },
    ],
    ultimate: [
      {
        operation: "applyPhysicalStatus",
        status: "knockdown",
        condition: "initial ground slam",
      },
      {
        operation: "applyPhysicalStatus",
        status: "knockdown",
        condition: "delayed second hit while the target remains in range",
      },
    ],
  },
  ember: {
    battleSkill: [{ operation: "applyPhysicalStatus", status: "knockdown" }],
    comboSkill: [{ operation: "applyPhysicalStatus", status: "knockdown" }],
  },
  gilberta: {
    comboSkill: [
      { operation: "applyPhysicalStatus", status: "launch", forced: true },
    ],
    ultimate: [
      {
        operation: "requirePhysicalStatus",
        statuses: ["defenseBreak", "launch"],
        notes: "Defense break increases Arts vulnerability; launched targets are held.",
      },
    ],
  },
  ardelia: {
    comboSkill: [
      {
        operation: "requirePhysicalStatus",
        statuses: ["defenseBreak"],
        condition: "The target must not already have defense break or Arts attachment.",
      },
    ],
  },
  pogranichnik: {
    battleSkill: [{ operation: "applyPhysicalStatus", status: "armorBreak" }],
    comboSkill: [
      {
        operation: "requirePhysicalStatus",
        statuses: ["smash", "armorBreak"],
        condition: "After defense-break stacks are consumed by smash or armor break.",
      },
    ],
    ultimate: [{ operation: "requirePhysicalStatus", statuses: "any" }],
  },
  laevatain: {},
  yvonne: {},
  lastrite: {},
  chenqianyu: {
    battleSkill: [{ operation: "applyPhysicalStatus", status: "launch" }],
    comboSkill: [
      { operation: "requireDefenseBreak", minimumStacks: 1 },
      { operation: "applyPhysicalStatus", status: "launch" },
    ],
  },
  snowshine: {},
  xaihi: {},
  perlica: {},
  wulfgard: {},
  arclight: {},
  alesh: {},
  avywenna: {},
  dapan: {
    battleSkill: [{ operation: "applyPhysicalStatus", status: "launch" }],
    comboSkill: [
      { operation: "requireDefenseBreak", minimumStacks: 4 },
      { operation: "applyPhysicalStatus", status: "smash" },
    ],
    ultimate: [
      { operation: "applyPhysicalStatus", status: "launch", forced: true },
      { operation: "applyPhysicalStatus", status: "knockdown", forced: true },
    ],
  },
  estella: {
    comboSkill: [
      {
        operation: "applyPhysicalStatus",
        status: "launch",
        forced: true,
        condition: "Hits a frozen target.",
      },
    ],
    ultimate: [
      {
        operation: "applyPhysicalStatus",
        status: "launch",
        forced: true,
        condition: "The target has physical vulnerability.",
      },
    ],
  },
  catcher: {
    battleSkill: [
      {
        operation: "applyDefenseBreak",
        stacks: 1,
        condition: "A block counter hits.",
      },
    ],
    ultimate: [{ operation: "applyPhysicalStatus", status: "knockdown" }],
  },
  antal: {
    comboSkill: [
      { operation: "requirePhysicalStatus", statuses: "any" },
      {
        operation: "reapplyPhysicalStatus",
        statuses: "current",
        notes: "Reapplies the focused physical abnormality or Arts attachment.",
      },
    ],
  },
  fluorite: {},
  akekuri: {},
  endministrator: {
    battleSkill: [{ operation: "applyPhysicalStatus", status: "smash" }],
    comboSkill: [
      {
        operation: "requirePhysicalStatus",
        statuses: "any",
        notes: "Physical abnormality or defense break consumes Originium Crystal.",
      },
    ],
  },
  zhuangfangyi: {},
  mifu: {
    battleSkill: [
      {
        operation: "applyPhysicalStatus",
        status: "smash",
        condition: "Zhuxing and Kaitian forms.",
      },
    ],
    comboSkill: [{ operation: "requireDefenseBreak", minimumStacks: 3 }],
    ultimate: [
      { operation: "applyPhysicalStatus", status: "launch", forced: true },
      { operation: "applyPhysicalStatus", status: "knockdown", forced: true },
    ],
  },
};

export function getOperatorSkillPhysicalEffects(
  operatorSlug: string,
  skillKey: OperatorSkillKey,
) {
  return operatorPhysicalEffects[operatorSlug]?.[skillKey] ?? [];
}
