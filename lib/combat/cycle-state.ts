import type {
  ArtsAttachmentIconKey,
  ArtsReactionIconKey,
  PhysicalCombatIconKey,
} from "@/data/combat-icon-paths";
import {
  getOperatorSkillArtsEffects,
  type OperatorSkillKey,
} from "@/data/operator-arts-effects";
import { getOperatorSkillPhysicalEffects } from "@/data/operator-physical-effects";

type CycleAttachmentState = {
  element: ArtsAttachmentIconKey;
  stacks: number;
};

type CyclePhysicalState = {
  defenseBreakStacks: number;
  status: PhysicalStatusIconKey | null;
};

type PhysicalStatusIconKey = Exclude<
  PhysicalCombatIconKey,
  "physical" | "defenseBreak"
>;

type CycleReactionState = {
  reaction: ArtsReactionIconKey;
};

export type ResolvedCycleStep<TStep = any> = {
  step: TStep;
  artsState: CycleAttachmentState | null;
  reactionState: CycleReactionState | null;
  physicalState: CyclePhysicalState | null;
};

export function resolveCycleStates<
  TStep extends {
    artsEffects?: unknown;
    physicalEffects?: unknown;
    operatorSlug?: string;
    skillKey?: string;
  },
>(
  cycle: TStep[],
): ResolvedCycleStep<TStep>[] {
  let artsState: CycleAttachmentState | null = null;
  let reactionState: CycleReactionState | null = null;
  let physicalState: CyclePhysicalState = {
    defenseBreakStacks: 0,
    status: null,
  };

  return cycle.map((step) => {
    const skillKey = toOperatorSkillKey(step.skillKey);
    const artsEffects =
      Array.isArray(step.artsEffects) && step.artsEffects.length > 0
        ? step.artsEffects
        : step.operatorSlug && skillKey
          ? getOperatorSkillArtsEffects(step.operatorSlug, skillKey)
          : [];
    const physicalEffects =
      Array.isArray(step.physicalEffects) && step.physicalEffects.length > 0
        ? step.physicalEffects
        : step.operatorSlug && skillKey
          ? getOperatorSkillPhysicalEffects(step.operatorSlug, skillKey)
          : [];
    const resolvedArts = resolveArtsState(artsState, reactionState, artsEffects);
    artsState = resolvedArts.artsState;
    reactionState = resolvedArts.reactionState;

    physicalState = resolvePhysicalState(
      physicalState,
      physicalEffects,
    );
    if (reactionState?.reaction === "frozen" && triggersShatter(physicalEffects)) {
      reactionState = { reaction: "shatter" };
    }

    return {
      step,
      artsState,
      reactionState,
      physicalState:
        physicalState.defenseBreakStacks > 0 || physicalState.status
          ? physicalState
          : null,
    };
  });
}

function resolveArtsState(
  currentState: CycleAttachmentState | null,
  currentReactionState: CycleReactionState | null,
  effects: unknown,
) {
  if (!Array.isArray(effects)) {
    return {
      artsState: currentState,
      reactionState: currentReactionState,
    };
  }

  let nextState = currentState;
  let nextReactionState = currentReactionState;

  for (const effect of effects) {
    if (effect?.operation === "apply" || effect?.operation === "enableAttachment") {
      const element = getFirstArtsElement(effect.elements);
      if (!element) continue;

      if (nextState && nextState.element !== element) {
        nextReactionState = { reaction: getReactionByAppliedElement(element) };
        nextState = null;
        continue;
      }

      const stacks = nextState
        ? Math.min(4, nextState.stacks + normalizeStacks(effect.stacks))
        : normalizeStacks(effect.stacks);

      nextState = { element, stacks };
      if (stacks >= 2) {
        nextReactionState = { reaction: getBurstByElement(element) };
      }
      continue;
    }

    if (effect?.operation === "applyReaction") {
      const reaction = getArtsReaction(effect.reaction);
      if (reaction) {
        nextReactionState = { reaction };
        nextState = null;
      }
      continue;
    }

    if (effect?.operation === "consumeReaction") {
      if (!nextReactionState) continue;

      if (getArtsReactions(effect.reactions).includes(nextReactionState.reaction)) {
        nextReactionState = null;
      }
      continue;
    }

    if (effect?.operation === "consume") {
      if (!nextState) continue;

      if (
        effect.elements === "any" ||
        getArtsElements(effect.elements).includes(nextState.element)
      ) {
        nextState = null;
      }
      continue;
    }

    if (effect?.operation === "reapply") {
      if (!nextState) continue;

      if (
        effect.elements === "current" ||
        getArtsElements(effect.elements).includes(nextState.element)
      ) {
        nextState = {
          element: nextState.element,
          stacks: Math.min(4, nextState.stacks + 1),
        };
      }
    }
  }

  return {
    artsState: nextState,
    reactionState: nextReactionState,
  };
}

function resolvePhysicalState(
  currentState: CyclePhysicalState,
  effects: unknown,
) {
  let nextState: CyclePhysicalState = {
    ...currentState,
    status: null,
  };

  for (const effect of getPhysicalEffects(effects)) {
    if (effect.operation === "applyDefenseBreak") {
      nextState = {
        ...nextState,
        defenseBreakStacks: Math.min(
          4,
          nextState.defenseBreakStacks + normalizeStacks(effect.stacks),
        ),
      };
      continue;
    }

    if (effect.operation === "consumeDefenseBreak") {
      nextState = {
        ...nextState,
        defenseBreakStacks: 0,
      };
      continue;
    }

    if (effect.operation === "reapplyPhysicalStatus") {
      continue;
    }

    if (effect.operation !== "applyPhysicalStatus") continue;

    if (!isPhysicalStatusIconKey(effect.status)) continue;

    if (effect.forced) {
      nextState = applyPhysicalAbnormality(nextState, effect.status);
      continue;
    }

    if (nextState.defenseBreakStacks <= 0) {
      nextState = {
        ...nextState,
        defenseBreakStacks: 1,
        status: null,
      };
      continue;
    }

    nextState = applyPhysicalAbnormality(nextState, effect.status);
  }

  return nextState;
}

function applyPhysicalAbnormality(
  state: CyclePhysicalState,
  status: PhysicalStatusIconKey,
) {
  if (status === "smash" || status === "armorBreak") {
    return {
      defenseBreakStacks: 0,
      status,
    };
  }

  return {
    ...state,
    status,
  };
}

function getPhysicalEffects(effects: unknown) {
  return Array.isArray(effects) ? (effects as any[]) : [];
}

function triggersShatter(effects: unknown) {
  return getPhysicalEffects(effects).some((effect) => {
    return (
      effect.operation === "applyDefenseBreak" ||
      effect.operation === "applyPhysicalStatus"
    );
  });
}

function isPhysicalStatusIconKey(value: unknown): value is PhysicalStatusIconKey {
  return (
    value === "launch" ||
    value === "knockdown" ||
    value === "smash" ||
    value === "armorBreak"
  );
}

function getFirstArtsElement(elements: unknown) {
  return getArtsElements(elements)[0] ?? null;
}

function getArtsElements(elements: unknown) {
  if (!Array.isArray(elements)) return [];

  return elements.filter((value): value is ArtsAttachmentIconKey =>
    ["heat", "electric", "cryo", "nature"].includes(String(value)),
  );
}

function getArtsReaction(reaction: unknown) {
  return [
    "burning",
    "frozen",
    "electrified",
    "corroded",
    "shatter",
    "heatBurst",
    "cryoBurst",
    "electricBurst",
    "natureBurst",
  ].includes(String(reaction))
    ? (reaction as ArtsReactionIconKey)
    : null;
}

function getArtsReactions(reactions: unknown) {
  if (!Array.isArray(reactions)) return [];

  return reactions.filter((reaction): reaction is ArtsReactionIconKey =>
    ["burning", "frozen", "electrified", "corroded", "shatter"].includes(
      String(reaction),
    ),
  );
}

function getReactionByAppliedElement(element: ArtsAttachmentIconKey) {
  switch (element) {
    case "heat":
      return "burning";
    case "electric":
      return "electrified";
    case "cryo":
      return "frozen";
    case "nature":
      return "corroded";
  }
}

function getBurstByElement(element: ArtsAttachmentIconKey) {
  switch (element) {
    case "heat":
      return "heatBurst";
    case "electric":
      return "electricBurst";
    case "cryo":
      return "cryoBurst";
    case "nature":
      return "natureBurst";
  }
}

function normalizeStacks(value: unknown) {
  const rawStacks = Number(value ?? 1);
  return Number.isFinite(rawStacks)
    ? Math.min(4, Math.max(1, Math.trunc(rawStacks)))
    : 1;
}

function toOperatorSkillKey(value: unknown): OperatorSkillKey | null {
  return value === "normalAttack" ||
    value === "battleSkill" ||
    value === "comboSkill" ||
    value === "ultimate"
    ? value
    : null;
}
