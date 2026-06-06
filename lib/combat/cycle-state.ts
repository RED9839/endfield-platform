import type { ArtsAttachmentIconKey } from "@/data/combat-icon-paths";
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
};

export type ResolvedCycleStep<TStep = any> = {
  step: TStep;
  artsState: CycleAttachmentState | null;
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
  let defenseBreakStacks = 0;

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
    artsState = resolveArtsState(artsState, artsEffects);

    defenseBreakStacks = resolveDefenseBreakStacks(
      defenseBreakStacks,
      physicalEffects,
    );

    return {
      step,
      artsState,
      physicalState:
        defenseBreakStacks > 0 ? { defenseBreakStacks } : null,
    };
  });
}

function resolveArtsState(
  currentState: CycleAttachmentState | null,
  effects: unknown,
) {
  if (!Array.isArray(effects)) return currentState;

  let nextState = currentState;

  for (const effect of effects) {
    if (effect?.operation === "apply" || effect?.operation === "enableAttachment") {
      const element = getFirstArtsElement(effect.elements);
      if (!element) continue;

      nextState =
        nextState?.element === element
          ? {
              element,
              stacks: Math.min(4, nextState.stacks + normalizeStacks(effect.stacks)),
            }
          : {
              element,
              stacks: normalizeStacks(effect.stacks),
            };
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

  return nextState;
}

function resolveDefenseBreakStacks(currentStacks: number, effects: unknown) {
  let nextStacks = currentStacks;

  for (const effect of getPhysicalEffects(effects)) {
    if (effect.operation === "applyDefenseBreak") {
      nextStacks = Math.min(4, nextStacks + normalizeStacks(effect.stacks));
      continue;
    }

    if (effect.operation === "consumeDefenseBreak") {
      nextStacks = 0;
      continue;
    }

    if (effect.operation === "reapplyPhysicalStatus") {
      nextStacks = nextStacks > 0 ? Math.min(4, nextStacks + 1) : 0;
      continue;
    }

    if (effect.operation !== "applyPhysicalStatus") continue;

    if (effect.status === "launch" || effect.status === "knockdown") {
      nextStacks = Math.min(4, nextStacks + 1);
    }

    if (effect.status === "smash" || effect.status === "armorBreak") {
      nextStacks = nextStacks > 0 ? 0 : 1;
    }
  }

  return nextStacks;
}

function getPhysicalEffects(effects: unknown) {
  return Array.isArray(effects) ? (effects as any[]) : [];
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
