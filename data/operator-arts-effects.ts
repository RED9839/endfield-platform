export type ArtsElement = "heat" | "cryo" | "electric" | "nature";
export type ArtsReaction = "burning" | "frozen" | "electrified" | "corroded";
export type OperatorSkillKey =
  | "normalAttack"
  | "battleSkill"
  | "comboSkill"
  | "ultimate";

export type ArtsEffect =
  | {
      operation: "apply";
      elements: ArtsElement[];
      stacks: number;
      condition?: string;
      inferred?: boolean;
      notes?: string;
    }
  | {
      operation: "consume";
      elements: ArtsElement[] | "any";
      stacks: "all";
      condition?: string;
      notes?: string;
    }
  | {
      operation: "reapply";
      elements: ArtsElement[] | "current";
      stacks: "same";
      condition?: string;
      notes?: string;
    }
  | {
      operation: "require";
      elements: ArtsElement[] | "any";
      minimumStacks?: number;
      condition?: string;
      notes?: string;
    }
  | {
      operation: "applyReaction";
      reaction: ArtsReaction;
      condition?: string;
      forced?: boolean;
      notes?: string;
    }
  | {
      operation: "requireReaction";
      reactions: ArtsReaction[];
      condition?: string;
      notes?: string;
    }
  | {
      operation: "consumeReaction";
      reactions: ArtsReaction[];
      condition?: string;
      notes?: string;
    }
  | {
      operation: "enableAttachment";
      elements: ArtsElement[];
      stacks: number;
      condition: string;
      inferred?: boolean;
      notes?: string;
    };

export type OperatorArtsEffectData = Record<
  string,
  Partial<Record<OperatorSkillKey, ArtsEffect[]>>
>;

// Base skill descriptions only. Potentials and talents are intentionally excluded.
// An omitted stack count in the source description is represented as one inferred stack.
export const operatorArtsEffects: OperatorArtsEffectData = {
  rossi: {
    comboSkill: [
      { operation: "require", elements: "any" },
      { operation: "consume", elements: "any", stacks: "all", condition: "second hit" },
    ],
    ultimate: [
      { operation: "apply", elements: ["heat"], stacks: 1, inferred: true },
    ],
  },
  tangtang: {
    battleSkill: [
      {
        operation: "apply",
        elements: ["cryo"],
        stacks: 1,
        notes: "Multiple whirlwinds do not apply additional cryo stacks.",
      },
    ],
    comboSkill: [
      {
        operation: "require",
        elements: ["cryo"],
        condition: "Triggers when cryo attachment is applied or an Arts burst hits.",
      },
    ],
  },
  lifeng: {},
  ember: {},
  gilberta: {
    battleSkill: [
      { operation: "apply", elements: ["nature"], stacks: 1, inferred: true },
    ],
    ultimate: [
      { operation: "apply", elements: ["nature"], stacks: 1, inferred: true },
    ],
  },
  ardelia: {
    battleSkill: [
      {
        operation: "consumeReaction",
        reactions: ["corroded"],
        condition: "The target is corroded; physical and Arts vulnerability are applied afterward.",
      },
    ],
    comboSkill: [
      {
        operation: "applyReaction",
        reaction: "corroded",
        forced: true,
        condition: "The tracked enemy has neither break nor Arts attachment.",
      },
    ],
  },
  pogranichnik: {},
  laevatain: {
    battleSkill: [
      {
        operation: "applyReaction",
        reaction: "burning",
        forced: true,
        condition: "Molten Flame reaches four stacks.",
      },
    ],
    comboSkill: [
      {
        operation: "requireReaction",
        reactions: ["burning", "corroded"],
        condition: "Requires an enemy with burning or corrosion.",
      },
    ],
    ultimate: [
      {
        operation: "enableAttachment",
        elements: ["heat"],
        stacks: 1,
        condition: "The third enhanced normal attack hits.",
        inferred: true,
      },
    ],
  },
  yvonne: {
    battleSkill: [
      { operation: "require", elements: ["cryo", "nature"] },
      { operation: "consume", elements: "any", stacks: "all" },
      { operation: "applyReaction", reaction: "frozen", forced: true },
    ],
    comboSkill: [
      {
        operation: "applyReaction",
        reaction: "frozen",
        forced: true,
        condition: "The summon expires and self-destructs.",
      },
    ],
    ultimate: [
      {
        operation: "consumeReaction",
        reactions: ["frozen"],
        condition: "The final attack hits a frozen enemy.",
      },
    ],
  },
  lastrite: {
    battleSkill: [
      {
        operation: "apply",
        elements: ["cryo"],
        stacks: 1,
        inferred: true,
        condition: "The next strong strike summons the pursuing phantom.",
      },
    ],
    comboSkill: [
      { operation: "require", elements: ["cryo"], minimumStacks: 3 },
      { operation: "consume", elements: ["cryo"], stacks: "all" },
    ],
  },
  chenqianyu: {},
  snowshine: {
    battleSkill: [
      {
        operation: "apply",
        elements: ["cryo"],
        stacks: 1,
        inferred: true,
        condition: "A block counter hits.",
      },
    ],
    ultimate: [
      {
        operation: "applyReaction",
        reaction: "frozen",
        forced: true,
        condition: "The enemy remains in the snow field long enough.",
      },
    ],
  },
  xaihi: {
    comboSkill: [
      { operation: "apply", elements: ["cryo"], stacks: 1, inferred: true },
    ],
  },
  perlica: {
    battleSkill: [
      { operation: "apply", elements: ["electric"], stacks: 1, inferred: true },
    ],
    comboSkill: [
      { operation: "applyReaction", reaction: "electrified", forced: true },
    ],
  },
  wulfgard: {
    battleSkill: [
      {
        operation: "apply",
        elements: ["heat"],
        stacks: 1,
        inferred: true,
        condition: "The target is neither burning nor electrified.",
      },
      {
        operation: "consumeReaction",
        reactions: ["burning", "electrified"],
        condition: "The target is burning or electrified; heat attachment is not applied.",
      },
    ],
    comboSkill: [
      { operation: "require", elements: "any" },
      { operation: "apply", elements: ["heat"], stacks: 1, inferred: true },
    ],
    ultimate: [
      { operation: "applyReaction", reaction: "burning", forced: true },
    ],
  },
  arclight: {
    battleSkill: [
      {
        operation: "consumeReaction",
        reactions: ["electrified"],
        condition: "The target is electrified.",
      },
    ],
    comboSkill: [
      {
        operation: "requireReaction",
        reactions: ["electrified"],
        condition: "Also triggers immediately after electrified is consumed.",
      },
    ],
    ultimate: [
      { operation: "apply", elements: ["electric"], stacks: 1, inferred: true },
      {
        operation: "consume",
        elements: ["electric"],
        stacks: "all",
        condition: "The delayed arc explosion hits an electrically attached enemy.",
      },
      {
        operation: "applyReaction",
        reaction: "electrified",
        condition: "Electric attachment is consumed by the delayed arc explosion.",
      },
    ],
  },
  alesh: {
    battleSkill: [
      { operation: "require", elements: ["cryo"] },
      { operation: "consume", elements: ["cryo"], stacks: "all" },
      { operation: "applyReaction", reaction: "frozen", forced: true },
    ],
    comboSkill: [
      {
        operation: "requireReaction",
        reactions: ["burning", "frozen", "electrified", "corroded"],
        condition: "Triggers after a nearby Arts abnormality or Originium Crystal is consumed.",
      },
    ],
    ultimate: [
      { operation: "apply", elements: ["cryo"], stacks: 1, inferred: true },
    ],
  },
  avywenna: {
    battleSkill: [
      {
        operation: "apply",
        elements: ["electric"],
        stacks: 1,
        inferred: true,
        condition: "A recalled empowered Thunderlance hits.",
      },
    ],
    comboSkill: [
      {
        operation: "require",
        elements: ["electric"],
        condition: "The target has electric attachment; electrified also satisfies the trigger.",
      },
    ],
  },
  dapan: {},
  estella: {
    battleSkill: [
      { operation: "apply", elements: ["cryo"], stacks: 1, inferred: true },
    ],
    comboSkill: [
      {
        operation: "requireReaction",
        reactions: ["frozen"],
      },
    ],
  },
  catcher: {},
  antal: {
    comboSkill: [
      { operation: "require", elements: "any" },
      {
        operation: "reapply",
        elements: "current",
        stacks: "same",
        notes: "Reapplies the tracked physical abnormality or Arts attachment.",
      },
    ],
  },
  fluorite: {
    battleSkill: [
      { operation: "apply", elements: ["nature"], stacks: 1, inferred: true },
    ],
    comboSkill: [
      { operation: "require", elements: ["cryo", "nature"], minimumStacks: 2 },
      {
        operation: "apply",
        elements: ["nature"],
        stacks: 1,
        inferred: true,
        notes: "The description says Arts attachment; nature is inferred from the skill element.",
      },
    ],
    ultimate: [
      {
        operation: "reapply",
        elements: ["cryo", "nature"],
        stacks: "same",
        condition: "The last hit strikes a target with at least two matching stacks.",
        notes: "Reapplies the existing attachment once; it does not duplicate every stack.",
      },
    ],
  },
  akekuri: {
    battleSkill: [
      { operation: "apply", elements: ["heat"], stacks: 1, inferred: true },
    ],
  },
  endministrator: {},
  zhuangfangyi: {
    battleSkill: [
      {
        operation: "consumeReaction",
        reactions: ["electrified"],
        condition: "Consumes electrified to increase battle skill damage and create extra Thunderlances.",
      },
    ],
    comboSkill: [
      { operation: "require", elements: ["electric"] },
      { operation: "consume", elements: ["electric"], stacks: "all" },
      { operation: "applyReaction", reaction: "electrified", forced: true },
    ],
    ultimate: [
      {
        operation: "enableAttachment",
        elements: ["electric"],
        stacks: 1,
        condition: "The final strike of the enhanced battle skill hits.",
        inferred: true,
      },
    ],
  },
  mifu: {},
};

export function getOperatorSkillArtsEffects(
  operatorSlug: string,
  skillKey: OperatorSkillKey,
) {
  return operatorArtsEffects[operatorSlug]?.[skillKey] ?? [];
}
