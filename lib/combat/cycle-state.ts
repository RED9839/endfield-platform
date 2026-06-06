import type { ArtsAttachmentIconKey } from "@/data/combat-icon-paths";

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

export function resolveCycleStates<TStep extends { artsEffects?: unknown; physicalEffects?: unknown }>(
  cycle: TStep[],
): ResolvedCycleStep<TStep>[] {
  let artsState: CycleAttachmentState | null = null;
  let defenseBreakStacks = 0;

  return cycle.map((step) => {
    const appliedArts = getAppliedArtsAttachment(step.artsEffects);

    if (appliedArts) {
      artsState =
        artsState?.element === appliedArts.element
          ? {
              element: appliedArts.element,
              stacks: Math.min(4, artsState.stacks + appliedArts.stacks),
            }
          : {
              element: appliedArts.element,
              stacks: Math.min(4, appliedArts.stacks),
            };
    }

    for (const effect of getPhysicalEffects(step.physicalEffects)) {
      if (effect.operation === "applyDefenseBreak") {
        defenseBreakStacks = Math.min(4, defenseBreakStacks + normalizeStacks(effect.stacks));
        continue;
      }

      if (effect.operation === "consumeDefenseBreak") {
        defenseBreakStacks = 0;
        continue;
      }

      if (effect.operation !== "applyPhysicalStatus") continue;

      if (effect.status === "launch" || effect.status === "knockdown") {
        defenseBreakStacks = Math.min(4, defenseBreakStacks + 1);
      }

      if (effect.status === "smash" || effect.status === "armorBreak") {
        defenseBreakStacks = defenseBreakStacks > 0 ? 0 : 1;
      }
    }

    return {
      step,
      artsState,
      physicalState:
        defenseBreakStacks > 0 ? { defenseBreakStacks } : null,
    };
  });
}

function getAppliedArtsAttachment(effects: unknown): CycleAttachmentState | null {
  if (!Array.isArray(effects)) return null;

  const effect = effects.find((item: any) => {
    return (
      (item?.operation === "apply" || item?.operation === "enableAttachment") &&
      Array.isArray(item?.elements)
    );
  }) as any;

  const element = effect?.elements?.find((value: unknown) =>
    ["heat", "electric", "cryo", "nature"].includes(String(value))
  ) as ArtsAttachmentIconKey | undefined;

  if (!element) return null;

  return { element, stacks: normalizeStacks(effect?.stacks) };
}

function getPhysicalEffects(effects: unknown) {
  return Array.isArray(effects) ? (effects as any[]) : [];
}

function normalizeStacks(value: unknown) {
  const rawStacks = Number(value ?? 1);
  return Number.isFinite(rawStacks)
    ? Math.min(4, Math.max(1, Math.trunc(rawStacks)))
    : 1;
}
