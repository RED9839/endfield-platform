"use client";

import { buildFarmingHref, saveFarmingTransferPayload } from "@/lib/farming/farming-transfer";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  operatorDetails,
  type OperatorDetail,
} from "@/data/operators-detail-data";
import {
  weaponDetails,
  type SourceWeaponDetail,
} from "@/data/weapons-detail-data";
import InfoPanel from "./_components/InfoPanel";
import MaterialList from "./_components/MaterialList";
import SimulatorShowcaseHero from "./_components/SimulatorShowcaseHero";
import SimulatorStageSection from "./_components/SimulatorStageSection";
import SimulatorSkillPanel from "./_components/SimulatorSkillPanel";
import SimulatorLevelPanel from "./_components/SimulatorLevelPanel";
import { MATERIAL_ORDER, sortSimulatorMaterials } from "./_lib/material-sort";
import {
  WEAPON_CURRENT_LEVEL_OPTIONS,
  WEAPON_TARGET_LEVEL_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  buildSkillStepsInRange,
  getAvailableTargetLevels,
  getCombatSkillMeta,
  getInfrastructureGroups,
  getInfrastructureTierLabel,
  getTalentGroups,
  getTrustStageInfos,
  getWeaponBreakthroughItems,
  toWeaponTargetLevel,
  type CombatSkillKey,
  type CombatSkillMeta,
  type CombatSkillState,
  type SkillLevel,
  type WeaponCurrentLevel,
  type WeaponTargetLevel,
  type TalentGroup,
  type InfrastructureGroup,
  type TrustStageInfo,
  type WeaponBreakthroughItem,
} from "./_lib/simulator-page-helpers";
import {
  OPERATOR_CURRENT_LEVEL_OPTIONS,
  OPERATOR_TARGET_LEVEL_OPTIONS,
  clampLevel,
  getInfrastructureMaterials,
  getNearestOperatorCurrentLevel,
  getNearestOperatorTargetLevel,
  getOperatorLevelMaterials,
  getWeaponLevelMaterials,
  mergeMaterials,
  type SimStep,
} from "./_lib/simulator-utils";
import {
  convertWeaponExpToItems,
  getWeaponLevelCurrencyDelta,
  getWeaponLevelExpDelta,
} from "./_lib/exp-converters";

const operators = operatorDetails as OperatorDetail[];
const weapons = weaponDetails as SourceWeaponDetail[];

const SIMULATOR_OPERATOR_STORAGE_KEY = "simulator:selectedOperatorSlug";
const SIMULATOR_WEAPON_STORAGE_KEY = "simulator:selectedWeaponSlug";

type OperatorTargetLevel = (typeof OPERATOR_TARGET_LEVEL_OPTIONS)[number];

type RangeState = {
  current: number;
  target: number;
};

function toOperatorTargetLevel(level: number): OperatorTargetLevel {
  const levels = OPERATOR_TARGET_LEVEL_OPTIONS as readonly number[];
  return (levels.includes(level) ? level : 90) as OperatorTargetLevel;
}

function toSimMaterials(items: any[] = []) {
  return items
    .map((item) => ({
      name: String(item?.name ?? ""),
      count: Number(item?.count ?? 0),
      icon:
        item?.icon ??
        (item?.name ? `/materials/${String(item.name)}.webp` : undefined),
    }))
    .filter((item) => item.name && item.count > 0);
}

function buildStageTokens(prefix: string, current: number, target: number) {
  if (target <= current) return [];
  return Array.from(
    { length: target - current },
    (_, index) => `${prefix}-${current + index + 1}`
  );
} 

function RangeSelect({
  value,
  options,
  getLabel,
  onChange,
}: {
  value: number;
  options: number[];
  getLabel: (stage: number) => string;
  onChange: (stage: number) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-11 rounded-xl border border-yellow-500/15 bg-black px-3 text-sm text-white outline-none"
    >
      {options.map((stage) => (
        <option key={stage} value={stage}>
          {getLabel(stage)}
        </option>
      ))}
    </select>
  );
}

function RangeSelector({
  titleCurrent = "?ÑÏû¨",
  titleTarget = "Î™©Ìëú",
  current,
  target,
  stages,
  getLabel,
  onChangeCurrent,
  onChangeTarget,
}: {
  titleCurrent?: string;
  titleTarget?: string;
  current: number;
  target: number;
  stages: number[];
  getLabel: (stage: number) => string;
  onChangeCurrent: (stage: number) => void;
  onChangeTarget: (stage: number) => void;
}) {
  const targetStages = stages.filter((stage) => stage >= current);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="grid gap-2">
        <div className="text-xs font-semibold text-zinc-400">{titleCurrent}</div>
        <RangeSelect
          value={current}
          options={stages}
          getLabel={getLabel}
          onChange={onChangeCurrent}
        />
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-semibold text-zinc-400">{titleTarget}</div>
        <RangeSelect
          value={target}
          options={targetStages}
          getLabel={getLabel}
          onChange={onChangeTarget}
        />
      </div>
    </div>
  );
}

function formatRangeSummary(label: string, current: number, target: number) {
  return `${label} ${current} ??${target}`;
}

function sumMaterialCounts(
  items: Array<{ count: number; lacking?: number }>,
  useLacking = false
) {
  return items.reduce((acc, item) => {
    return acc + (useLacking ? Number(item.lacking ?? 0) : Number(item.count ?? 0));
  }, 0);
}

export default function SimulatorPage() {
  const router = useRouter();

    return items
      .map((item) => ({
        name: String(item.name ?? "").trim(),
        amount: Number(item.amount ?? 0),
      }))
      .filter((item) => item.name && Number.isFinite(item.amount) && item.amount > 0);
  }

    

  function resetSimulatorAndGoHome() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("endfield:simulator-selection");
      window.sessionStorage.removeItem("endfield:simulator-selection");
      window.localStorage.removeItem("endfield:farming-transfer");
      window.localStorage.removeItem("endfield:farming-page-state");
    }

    router.push("/");
  }

  const searchParams = useSearchParams();
  const syncKey = searchParams.get("sync") ?? "";

  const [selectedOperatorSlug, setSelectedOperatorSlug] = useState("");
  const [selectedWeaponSlug, setSelectedWeaponSlug] = useState("");
  const [isOwnedPanelOpen, setIsOwnedPanelOpen] = useState(false);

  const [operatorCurrentLevel, setOperatorCurrentLevel] = useState(1);
  const [operatorTargetLevel, setOperatorTargetLevel] =
    useState<OperatorTargetLevel>(90);

  const [weaponCurrentLevel, setWeaponCurrentLevel] =
    useState<WeaponCurrentLevel>(1);
  const [weaponTargetLevel, setWeaponTargetLevel] =
    useState<WeaponTargetLevel>(90);

  const [eliteRange, setEliteRange] = useState<RangeState>({
    current: 0,
    target: 0,
  });
  const [weaponBreakthroughRange, setWeaponBreakthroughRange] =
    useState<RangeState>({
      current: 0,
      target: 0,
    });
  const [trustRange, setTrustRange] = useState<RangeState>({
    current: 0,
    target: 0,
  });

  const [combatSkillState, setCombatSkillState] = useState<CombatSkillState>({
    normal: { current: "1", target: "M3" },
    combo: { current: "1", target: "M3" },
    battle: { current: "1", target: "M3" },
    ultimate: { current: "1", target: "M3" },
  });

  const [talentRanges, setTalentRanges] = useState<Record<number, RangeState>>(
    {}
  );
  const [infrastructureRanges, setInfrastructureRanges] = useState<
    Record<number, RangeState>
  >({});
  const [ownedMaterials, setOwnedMaterials] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedOperatorSlug =
      window.sessionStorage.getItem(SIMULATOR_OPERATOR_STORAGE_KEY) ?? "";
    const storedWeaponSlug =
      window.sessionStorage.getItem(SIMULATOR_WEAPON_STORAGE_KEY) ?? "";

    setSelectedOperatorSlug(
      storedOperatorSlug &&
        operators.some((item: OperatorDetail) => item.slug === storedOperatorSlug)
        ? storedOperatorSlug
        : ""
    );

    setSelectedWeaponSlug(
      storedWeaponSlug &&
        weapons.some((item: SourceWeaponDetail) => item.slug === storedWeaponSlug)
        ? storedWeaponSlug
        : ""
    );
  }, [syncKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (selectedOperatorSlug) {
      window.sessionStorage.setItem(
        SIMULATOR_OPERATOR_STORAGE_KEY,
        selectedOperatorSlug
      );
    } else {
      window.sessionStorage.removeItem(SIMULATOR_OPERATOR_STORAGE_KEY);
    }
  }, [selectedOperatorSlug]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (selectedWeaponSlug) {
      window.sessionStorage.setItem(
        SIMULATOR_WEAPON_STORAGE_KEY,
        selectedWeaponSlug
      );
    } else {
      window.sessionStorage.removeItem(SIMULATOR_WEAPON_STORAGE_KEY);
    }
  }, [selectedWeaponSlug]);

  const selectedOperator = useMemo(
    () =>
      operators.find((item: OperatorDetail) => item.slug === selectedOperatorSlug) ??
      null,
    [selectedOperatorSlug]
  );

  const selectedWeapon = useMemo(
    () =>
      weapons.find((item: SourceWeaponDetail) => item.slug === selectedWeaponSlug) ??
      null,
    [selectedWeaponSlug]
  );

  const isEndministrator = selectedOperator?.slug === "endministrator";

  const safeOperatorCurrentLevel = selectedOperator
    ? getNearestOperatorCurrentLevel(clampLevel(operatorCurrentLevel, 1, 80))
    : 1;

  const safeOperatorTargetLevel = selectedOperator
    ? getNearestOperatorTargetLevel(clampLevel(operatorTargetLevel, 20, 90))
    : 90;

  const safeWeaponCurrentLevel = selectedWeapon ? weaponCurrentLevel : 1;
  const safeWeaponTargetLevel = selectedWeapon ? weaponTargetLevel : 90;

  useEffect(() => {
    if (!selectedOperator) return;

    const validTargets = OPERATOR_TARGET_LEVEL_OPTIONS.filter(
      (level: OperatorTargetLevel) => level > safeOperatorCurrentLevel
    ) as OperatorTargetLevel[];

    const normalizedTarget = toOperatorTargetLevel(safeOperatorTargetLevel);
    const isValidTarget = validTargets.some(
      (level: OperatorTargetLevel) => level === normalizedTarget
    );

    if (!isValidTarget) {
      const fallback = validTargets[validTargets.length - 1] ?? 90;
      setOperatorTargetLevel(toOperatorTargetLevel(fallback));
    }
  }, [selectedOperator, safeOperatorCurrentLevel, safeOperatorTargetLevel]);

  useEffect(() => {
    if (!selectedWeapon) return;

    const validTargets = WEAPON_TARGET_LEVEL_OPTIONS.filter(
      (level: WeaponTargetLevel) => level > safeWeaponCurrentLevel
    );

    if (!validTargets.includes(safeWeaponTargetLevel)) {
      const fallback = validTargets[validTargets.length - 1] ?? 90;
      setWeaponTargetLevel(toWeaponTargetLevel(fallback));
    }
  }, [selectedWeapon, safeWeaponCurrentLevel, safeWeaponTargetLevel]);

  useEffect(() => {
    setEliteRange({ current: 0, target: 0 });
    setTrustRange({ current: 0, target: 0 });
    setTalentRanges({});
    setInfrastructureRanges({});
    setCombatSkillState({
      normal: { current: "1", target: "M3" },
      combo: { current: "1", target: "M3" },
      battle: { current: "1", target: "M3" },
      ultimate: { current: "1", target: "M3" },
    });
  }, [selectedOperatorSlug]);

  useEffect(() => {
    setWeaponBreakthroughRange({ current: 0, target: 0 });
  }, [selectedWeaponSlug]);

  const combatSkillMetas = useMemo(
    () => (selectedOperator ? getCombatSkillMeta(selectedOperator) : []),
    [selectedOperator]
  );

  const talentGroups = useMemo(
    () => (selectedOperator ? getTalentGroups(selectedOperator) : []),
    [selectedOperator]
  );

  const infrastructureGroups = useMemo(
    () => (selectedOperator ? getInfrastructureGroups(selectedOperator) : []),
    [selectedOperator]
  );

  const trustStageInfos = useMemo(
    () => (selectedOperator ? getTrustStageInfos(selectedOperator) : []),
    [selectedOperator]
  );

  const visibleInfrastructureGroups = isEndministrator
    ? []
    : infrastructureGroups;

  const visibleTrustStageInfos = isEndministrator ? [] : trustStageInfos;

  const weaponBreakthroughItems = useMemo(
    () => (selectedWeapon ? getWeaponBreakthroughItems(selectedWeapon) : []),
    [selectedWeapon]
  );

  const skillIndexMap = useMemo(
    () =>
      new Map(
        (SKILL_LEVEL_OPTIONS as readonly SkillLevel[]).map(
          (level: SkillLevel, index: number) => [level, index] as const
        )
      ),
    []
  );

  const operatorCombatSkillSteps = useMemo<SimStep[]>(() => {
    if (!selectedOperator) return [];

    return combatSkillMetas.flatMap((meta: CombatSkillMeta) =>
      buildSkillStepsInRange(
        skillIndexMap,
        SKILL_LEVEL_OPTIONS as readonly SkillLevel[],
        meta.label,
        meta.costs,
        combatSkillState[meta.key].current,
        combatSkillState[meta.key].target
      )
    );
  }, [
    selectedOperator,
    combatSkillMetas,
    combatSkillState,
    skillIndexMap,
  ]);

  const operatorLevelSteps = useMemo<SimStep[]>(() => {
    if (!selectedOperator) return [];

    return getOperatorLevelMaterials(
      selectedOperator,
      safeOperatorCurrentLevel,
      safeOperatorTargetLevel
    );
  }, [
    selectedOperator,
    safeOperatorCurrentLevel,
    safeOperatorTargetLevel,
  ]);

  const eliteSteps = useMemo<SimStep[]>(() => {
    if (!selectedOperator) return [];

    const eliteSource = ((selectedOperator as any).elite ?? []) as Array<{
      phase?: string;
      materials?: any[];
    }>;

    if (eliteRange.target <= eliteRange.current) return [];

    return eliteSource
      .slice(eliteRange.current, eliteRange.target)
      .map((item, index) => ({
        label: item.phase ?? `?ïÏòà??${eliteRange.current + index + 1}`,
        materials: toSimMaterials(item.materials ?? []),
      }))
      .filter((step) => step.materials.length > 0);
  }, [selectedOperator, eliteRange]);

  const talentSteps = useMemo<SimStep[]>(() => {
    if (!selectedOperator) return [];

    const raw = selectedOperator as any;
    const costs = (raw.requiredMaterials?.talents ?? []) as Array<{
      talent: number;
      stage: number;
      materials: any[];
    }>;

    const nameMap = new Map<number, string>(
      talentGroups.map((group) => [group.id, group.name])
    );

    return Object.entries(talentRanges).flatMap(([talentIdText, range]) => {
      const talentId = Number(talentIdText);
      if (range.target <= range.current) return [];

      return costs
        .filter(
          (item) =>
            Number(item.talent) === talentId &&
            Number(item.stage) > range.current &&
            Number(item.stage) <= range.target
        )
        .sort((a, b) => Number(a.stage) - Number(b.stage))
        .map((item) => ({
          label: `${nameMap.get(talentId) ?? `?¨Îä• ?§ÌÇ¨ ${talentId}`} ${Number(
            item.stage
          )}?®Í≥Ñ`,
          materials: toSimMaterials(item.materials ?? []),
        }));
    });
  }, [selectedOperator, talentGroups, talentRanges]);

  const trustSteps = useMemo<SimStep[]>(() => {
    if (!selectedOperator || isEndministrator) return [];
    const raw = selectedOperator as any;
    const trustCosts = (raw.requiredMaterials?.trustBonus ?? []) as Array<{
      stage: number;
      materials: any[];
    }>;

    if (trustRange.target <= trustRange.current) return [];

    return trustCosts
      .filter(
        (item) =>
          Number(item.stage) > trustRange.current &&
          Number(item.stage) <= trustRange.target
      )
      .sort((a, b) => Number(a.stage) - Number(b.stage))
      .map((item) => ({
        label: `?†Î¢∞??${Number(item.stage)}?®Í≥Ñ`,
        materials: toSimMaterials(item.materials ?? []),
      }));
  }, [selectedOperator, trustRange, isEndministrator]);

  const infrastructureSteps = useMemo<SimStep[]>(() => {
    if (!selectedOperator || isEndministrator) return [];

    const allTokens = Object.entries(infrastructureRanges).flatMap(
      ([slot, range]) =>
        buildStageTokens(
          `infra-${slot}`,
          Number(range.current),
          Number(range.target)
        )
    );

    return getInfrastructureMaterials(selectedOperator, allTokens);
  }, [selectedOperator, infrastructureRanges, isEndministrator]);

  const operatorSteps = useMemo<SimStep[]>(() => {
    if (!selectedOperator) return [];

    return [
      ...operatorLevelSteps,
      ...eliteSteps,
      ...talentSteps,
      ...trustSteps,
      ...infrastructureSteps,
      ...operatorCombatSkillSteps,
    ];
  }, [
    selectedOperator,
    operatorLevelSteps,
    eliteSteps,
    talentSteps,
    trustSteps,
    infrastructureSteps,
    operatorCombatSkillSteps,
  ]);

  const weaponLevelSteps = useMemo<SimStep[]>(() => {
    if (!selectedWeapon) return [];

    return getWeaponLevelMaterials(
      selectedWeapon,
      safeWeaponCurrentLevel,
      safeWeaponTargetLevel
    );
  }, [selectedWeapon, safeWeaponCurrentLevel, safeWeaponTargetLevel]);

  const weaponExpSteps = useMemo<SimStep[]>(() => {
    if (!selectedWeapon) return [];

    const expTotal = getWeaponLevelExpDelta(
      safeWeaponCurrentLevel,
      safeWeaponTargetLevel
    );
    const currencyTotal = getWeaponLevelCurrencyDelta(
      safeWeaponCurrentLevel,
      safeWeaponTargetLevel
    );

    const items = convertWeaponExpToItems(expTotal);

    if (currencyTotal > 0) {
      items.unshift({
        name: "?àÎ°ú?úÏïà ?îÌèê",
        count: currencyTotal,
        icon: "/materials/?àÎ°ú?úÏïà ?îÌèê.webp",
      });
    }

    if (!items.length) return [];

    return [
      {
        label: "Î¨¥Í∏∞ ?àÎ≤®??,
        materials: items.map((item) => ({
          name: item.name,
          count: Number(item.count),
          icon: item.icon,
        })),
      },
    ];
  }, [selectedWeapon, safeWeaponCurrentLevel, safeWeaponTargetLevel]);

  const weaponBreakthroughSteps = useMemo<SimStep[]>(() => {
    if (!selectedWeapon) return [];

    if (weaponBreakthroughRange.target <= weaponBreakthroughRange.current) {
      return [];
    }

    return weaponBreakthroughItems
      .filter(
        (item) =>
          item.stage > weaponBreakthroughRange.current &&
          item.stage <= weaponBreakthroughRange.target
      )
      .map((item) => ({
        label: `Î¨¥Í∏∞ ?åÌåå ${item.stage}?®Í≥Ñ`,
        materials: toSimMaterials(item.materials ?? []),
      }))
      .filter((step) => step.materials.length > 0);
  }, [selectedWeapon, weaponBreakthroughItems, weaponBreakthroughRange]);

  const operatorTotalMaterials = useMemo(() => {
    return mergeMaterials(operatorSteps);
  }, [operatorSteps]);

  const sortedOperatorTotalMaterials = useMemo(() => {
    return sortSimulatorMaterials({ items: operatorTotalMaterials });
  }, [operatorTotalMaterials]);

  const weaponTotalMaterials = useMemo(() => {
    return mergeMaterials([
      ...weaponLevelSteps,
      ...weaponExpSteps,
      ...weaponBreakthroughSteps,
    ]);
  }, [weaponLevelSteps, weaponExpSteps, weaponBreakthroughSteps]);

  const sortedWeaponTotalMaterials = useMemo(() => {
    return sortSimulatorMaterials({ items: weaponTotalMaterials });
  }, [weaponTotalMaterials]);

  const combinedTotalMaterials = useMemo(() => {
    return mergeMaterials([
      { label: "operator", materials: sortedOperatorTotalMaterials },
      { label: "weapon", materials: sortedWeaponTotalMaterials },
    ]);
  }, [sortedOperatorTotalMaterials, sortedWeaponTotalMaterials]);

  const sortedCombinedTotalMaterials = useMemo(() => {
    return sortSimulatorMaterials({ items: combinedTotalMaterials });
  }, [combinedTotalMaterials]);

  const ownedMaterialItems = useMemo(() => {
    const iconMap = new Map<string, string | undefined>();

    for (const item of sortedCombinedTotalMaterials) {
      if (!iconMap.has(item.name)) {
        iconMap.set(item.name, item.icon);
      }
    }

    const materialOrderSet = new Set<string>(MATERIAL_ORDER);

    const masterItems = MATERIAL_ORDER.map((name) => ({
      name,
      icon: iconMap.get(name) ?? `/materials/${name}.webp`,
      owned: ownedMaterials[name] ?? 0,
    }));

    const extraItems = sortedCombinedTotalMaterials
      .filter((item) => !materialOrderSet.has(item.name))
      .map((item) => ({
        name: item.name,
        icon: item.icon ?? `/materials/${item.name}.webp`,
        owned: ownedMaterials[item.name] ?? 0,
      }));

    return [...masterItems, ...extraItems];
  }, [sortedCombinedTotalMaterials, ownedMaterials]);

  const operatorMaterialDeficitItems = useMemo(() => {
    return sortedOperatorTotalMaterials.map((item) => {
      const owned = Math.max(0, Number(ownedMaterials[item.name] ?? 0));
      const lacking = Math.max(0, item.count - owned);
      return { ...item, owned, lacking };
    });
  }, [sortedOperatorTotalMaterials, ownedMaterials]);

  const weaponMaterialDeficitItems = useMemo(() => {
    return sortedWeaponTotalMaterials.map((item) => {
      const owned = Math.max(0, Number(ownedMaterials[item.name] ?? 0));
      const lacking = Math.max(0, item.count - owned);
      return { ...item, owned, lacking };
    });
  }, [sortedWeaponTotalMaterials, ownedMaterials]);

  const combinedMaterialDeficitItems = useMemo(() => {
    return sortedCombinedTotalMaterials.map((item) => {
      const owned = Math.max(0, Number(ownedMaterials[item.name] ?? 0));
      const lacking = Math.max(0, item.count - owned);
      return { ...item, owned, lacking };
    });
  }, [sortedCombinedTotalMaterials, ownedMaterials]);

  const handleTalentCurrentChange = (talentId: number, value: number) => {
    setTalentRanges((prev) => {
      const existing = prev[talentId] ?? { current: 0, target: 0 };
      return {
        ...prev,
        [talentId]: {
          current: value,
          target: Math.max(value, existing.target),
        },
      };
    });
  };

  const handleTalentTargetChange = (talentId: number, value: number) => {
    setTalentRanges((prev) => {
      const existing = prev[talentId] ?? { current: 0, target: 0 };
      return {
        ...prev,
        [talentId]: {
          current: existing.current,
          target: Math.max(existing.current, value),
        },
      };
    });
  };

  const handleInfrastructureCurrentChange = (slot: number, value: number) => {
    setInfrastructureRanges((prev) => {
      const existing = prev[slot] ?? { current: 0, target: 0 };
      return {
        ...prev,
        [slot]: {
          current: value,
          target: Math.max(value, existing.target),
        },
      };
    });
  };

  const handleInfrastructureTargetChange = (slot: number, value: number) => {
    setInfrastructureRanges((prev) => {
      const existing = prev[slot] ?? { current: 0, target: 0 };
      return {
        ...prev,
        [slot]: {
          current: existing.current,
          target: Math.max(existing.current, value),
        },
      };
    });
  };

  const handleCombatCurrentChange = (key: CombatSkillKey, value: SkillLevel) => {
    setCombatSkillState((prev: CombatSkillState) => {
      const targetOptions = getAvailableTargetLevels(
        SKILL_LEVEL_OPTIONS as readonly SkillLevel[],
        value
      );
      const currentIndex = (
        SKILL_LEVEL_OPTIONS as readonly SkillLevel[]
      ).findIndex((level: SkillLevel) => level === value);
      const prevTarget = prev[key].target;
      const prevTargetIndex = (
        SKILL_LEVEL_OPTIONS as readonly SkillLevel[]
      ).findIndex((level: SkillLevel) => level === prevTarget);

      const nextTarget =
        prevTargetIndex > currentIndex ? prevTarget : targetOptions[0] ?? value;

      return {
        ...prev,
        [key]: {
          current: value,
          target: nextTarget,
        },
      };
    });
  };

  const handleCombatTargetChange = (key: CombatSkillKey, value: SkillLevel) => {
    setCombatSkillState((prev: CombatSkillState) => ({
      ...prev,
      [key]: {
        ...prev[key],
        target: value,
      },
    }));
  };

  const handleOwnedMaterialChange = (name: string, value: number) => {
    setOwnedMaterials((prev: Record<string, number>) => ({
      ...prev,
      [name]: Math.max(0, value),
    }));
  };

  const handleGoHome = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(SIMULATOR_OPERATOR_STORAGE_KEY);
    window.sessionStorage.removeItem(SIMULATOR_WEAPON_STORAGE_KEY);
  };

  const eliteStages = Array.from(
    { length: ((selectedOperator as any)?.elite?.length ?? 0) + 1 },
    (_, index) => index
  );

  const trustStages = [
    0,
    ...visibleTrustStageInfos.map((item: TrustStageInfo) => item.stage),
  ];

  const weaponBreakthroughStages = [
    0,
    ...weaponBreakthroughItems.map((item: WeaponBreakthroughItem) => item.stage),
  ];

  const levelSummary = [
    selectedOperator
      ? `?§Ìçº?àÏù¥??Lv.${safeOperatorCurrentLevel} ??Lv.${safeOperatorTargetLevel}`
      : null,
    selectedWeapon
      ? `Î¨¥Í∏∞ Lv.${safeWeaponCurrentLevel} ??Lv.${safeWeaponTargetLevel}`
      : null,
  ]
    .filter(Boolean)
    .join(" / ");

  const eliteSummary = selectedOperator
    ? formatRangeSummary("?ïÏòà??, eliteRange.current, eliteRange.target)
    : "?§Ìçº?àÏù¥?∞Î? ?†ÌÉù??Ï£ºÏÑ∏??";

  const weaponBreakthroughSummary = selectedWeapon
    ? formatRangeSummary(
        "Î¨¥Í∏∞ ?åÌåå",
        weaponBreakthroughRange.current,
        weaponBreakthroughRange.target
      )
    : "Î¨¥Í∏∞Î•??†ÌÉù??Ï£ºÏÑ∏??";

  const trustSummary = selectedOperator
    ? visibleTrustStageInfos.length
      ? formatRangeSummary("?†Î¢∞??Î≥¥ÎÑà??, trustRange.current, trustRange.target)
      : "?±Î°ù???†Î¢∞??Î≥¥ÎÑà???∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§."
    : "?§Ìçº?àÏù¥?∞Î? ?†ÌÉù??Ï£ºÏÑ∏??";

  const combatSummary = selectedOperator
    ? combatSkillMetas
        .map((meta) => {
          const state = combatSkillState[meta.key];
          return `${meta.label} ${state.current} ??${state.target}`;
        })
        .join(" / ")
    : "?§Ìçº?àÏù¥?∞Î? ?†ÌÉù??Ï£ºÏÑ∏??";

  const talentSummary = selectedOperator
    ? talentGroups.length
      ? talentGroups
          .map((group) => {
            const range = talentRanges[group.id] ?? { current: 0, target: 0 };
            return `${group.name} ${range.current} ??${range.target}`;
          })
          .join(" / ")
      : "?±Î°ù???¨Îä• ?§ÌÇ¨ ?∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§."
    : "?§Ìçº?àÏù¥?∞Î? ?†ÌÉù??Ï£ºÏÑ∏??";

  const infrastructureSummary = selectedOperator
    ? visibleInfrastructureGroups.length
      ? visibleInfrastructureGroups
          .map((group) => {
            const range = infrastructureRanges[group.id] ?? {
              current: 0,
              target: 0,
            };
            return `${group.name} ${range.current} ??${range.target}`;
          })
          .join(" / ")
      : "?±Î°ù???∏ÌîÑ???§ÌÇ¨ ?∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§."
    : "?§Ìçº?àÏù¥?∞Î? ?†ÌÉù??Ï£ºÏÑ∏??";

  const combinedSummary = selectedOperator || selectedWeapon
    ? `?¨Ìôî ${combinedMaterialDeficitItems.length}Ï¢?/ Ï¥??ÑÏöî ${sumMaterialCounts(
        combinedMaterialDeficitItems
      ).toLocaleString()} / Î∂ÄÏ°?${sumMaterialCounts(
        combinedMaterialDeficitItems,
        true
      ).toLocaleString()}`
    : "?§Ìçº?àÏù¥?∞Ï? Î¨¥Í∏∞Î•??†ÌÉù??Ï£ºÏÑ∏??";

  const operatorMaterialsSummary = selectedOperator
    ? `?¨Ìôî ${operatorMaterialDeficitItems.length}Ï¢?/ Ï¥??ÑÏöî ${sumMaterialCounts(
        operatorMaterialDeficitItems
      ).toLocaleString()} / Î∂ÄÏ°?${sumMaterialCounts(
        operatorMaterialDeficitItems,
        true
      ).toLocaleString()}`
    : "?§Ìçº?àÏù¥?∞Î? ?†ÌÉù??Ï£ºÏÑ∏??";

  const weaponMaterialsSummary = selectedWeapon
    ? `?¨Ìôî ${weaponMaterialDeficitItems.length}Ï¢?/ Ï¥??ÑÏöî ${sumMaterialCounts(
        weaponMaterialDeficitItems
      ).toLocaleString()} / Î∂ÄÏ°?${sumMaterialCounts(
        weaponMaterialDeficitItems,
        true
      ).toLocaleString()}`
    : "Î¨¥Í∏∞Î•??†ÌÉù??Ï£ºÏÑ∏??";




  function normalizeFarmingMaterialList(items: unknown) {
    if (!Array.isArray(items)) return [];

    return items
      .map((item: any) => ({
        name: String(item?.name ?? item?.material ?? "").trim(),
        amount: Number(item?.amount ?? item?.owned ?? item?.value ?? item?.count ?? 0),
      }))
      .filter(
        (item) =>
          item.name.length > 0 &&
          Number.isFinite(item.amount) &&
          item.amount > 0
      );
  }

  function normalizeOwnedMaterialsForFarming(items: unknown) {
    if (Array.isArray(items)) return normalizeFarmingMaterialList(items);

    if (items && typeof items === "object") {
      return Object.entries(items as Record<string, unknown>)
        .map(([name, amount]) => ({
          name,
          amount: Number(amount ?? 0),
        }))
        .filter(
          (item) =>
            item.name.length > 0 &&
            Number.isFinite(item.amount) &&
            item.amount > 0
        );
    }

    return [];
  }

  function handleGoFarmingCalculator() {
  const requiredMaterials = normalizeFarmingMaterialList(
    combinedMaterialDeficitItems
      .filter((item) => Number(item.lacking ?? 0) > 0)
      .map((item) => ({
        name: item.name,
        amount: Number(item.lacking ?? 0),
      }))
  );

  const ownedMaterialsForFarming =
    normalizeOwnedMaterialsForFarming(ownedMaterials);

  const payload = {
    requiredMaterials,
    ownedMaterials: ownedMaterialsForFarming,
  };

  saveFarmingTransferPayload(payload);
  router.push(buildFarmingHref(payload));
}

  return (
    <main className="min-h-screen bg-[#03060b] text-white">
      <div className="mx-auto max-w-[1840px] px-4 py-6 md:px-6 xl:px-8 xl:py-8">
        <div className="grid gap-6">
          <section className="rounded-[24px] border border-yellow-500/15 bg-[#05070b] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[11px] tracking-[0.28em] text-yellow-400/70">
                  ?úÎ??àÏù¥??                </div>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white">
                  ?±Ïû• ?úÎ??àÏù¥??                </h1>
              </div>

              <Link
                href="/"
                onClick={handleGoHome}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black px-4 text-sm font-semibold text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
              >
                ?àÏúºÎ°??¥Îèô
              </Link>
            </div>
          </section>

          <SimulatorShowcaseHero
            operator={selectedOperator}
            weapon={selectedWeapon}
            ownedItems={ownedMaterialItems}
            isOwnedPanelOpen={isOwnedPanelOpen}
            onOpenOwnedPanel={() => setIsOwnedPanelOpen(true)}
            onCloseOwnedPanel={() => setIsOwnedPanelOpen(false)}
            onChangeOwned={handleOwnedMaterialChange}
          />

          <div className="grid items-start gap-6 xl:grid-cols-[560px_minmax(0,1fr)]">
            <div className="grid auto-rows-max content-start gap-6 self-start">
              <InfoPanel title="?àÎ≤®" summary={levelSummary}>
                {selectedOperator || selectedWeapon ? (
                  <SimulatorLevelPanel
                    operatorCurrentLevel={safeOperatorCurrentLevel}
                    operatorTargetLevel={safeOperatorTargetLevel}
                    operatorCurrentOptions={OPERATOR_CURRENT_LEVEL_OPTIONS}
                    operatorTargetOptions={selectedOperator
                      ? OPERATOR_TARGET_LEVEL_OPTIONS.filter(
                          (level: OperatorTargetLevel) =>
                            level > safeOperatorCurrentLevel
                        )
                      : []}
                    weaponCurrentLevel={safeWeaponCurrentLevel}
                    weaponTargetLevel={safeWeaponTargetLevel}
                    weaponCurrentOptions={WEAPON_CURRENT_LEVEL_OPTIONS}
                    weaponTargetOptions={selectedWeapon
                      ? WEAPON_TARGET_LEVEL_OPTIONS.filter(
                          (level: WeaponTargetLevel) =>
                            level > safeWeaponCurrentLevel
                        )
                      : []}
                    onChangeOperatorCurrent={setOperatorCurrentLevel}
                    onChangeOperatorTarget={(value: number) =>
                      setOperatorTargetLevel(toOperatorTargetLevel(value))
                    }
                    onChangeWeaponCurrent={setWeaponCurrentLevel}
                    onChangeWeaponTarget={setWeaponTargetLevel}
                  />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥???êÎäî Î¨¥Í∏∞Î•?Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="?ïÏòà?? summary={eliteSummary}>
                {selectedOperator ? (
                  <RangeSelector
                    current={eliteRange.current}
                    target={eliteRange.target}
                    stages={eliteStages}
                    getLabel={(stage) => (stage === 0 ? "0?®Í≥Ñ" : `${stage}?®Í≥Ñ`)}
                    onChangeCurrent={(stage) =>
                      setEliteRange((prev) => ({
                        current: stage,
                        target: Math.max(stage, prev.target),
                      }))
                    }
                    onChangeTarget={(stage) =>
                      setEliteRange((prev) => ({
                        current: prev.current,
                        target: Math.max(prev.current, stage),
                      }))
                    }
                  />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥?∞Î? Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="Î¨¥Í∏∞ ?åÌåå" summary={weaponBreakthroughSummary}>
                {!selectedWeapon ? (
                  <div className="text-sm text-zinc-500">
                    Î¨¥Í∏∞Î•?Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                ) : weaponBreakthroughItems.length ? (
                  <RangeSelector
                    current={weaponBreakthroughRange.current}
                    target={weaponBreakthroughRange.target}
                    stages={weaponBreakthroughStages}
                    getLabel={(stage) => (stage === 0 ? "0?®Í≥Ñ" : `${stage}?®Í≥Ñ`)}
                    onChangeCurrent={(stage) =>
                      setWeaponBreakthroughRange((prev) => ({
                        current: stage,
                        target: Math.max(stage, prev.target),
                      }))
                    }
                    onChangeTarget={(stage) =>
                      setWeaponBreakthroughRange((prev) => ({
                        current: prev.current,
                        target: Math.max(prev.current, stage),
                      }))
                    }
                  />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?±Î°ù??Î¨¥Í∏∞ ?åÌåå ?∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§.
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="?ÑÌà¨ ?§ÌÇ¨" summary={combatSummary}>
                {selectedOperator ? (
                  <SimulatorSkillPanel
                    metas={combatSkillMetas}
                    state={combatSkillState}
                    skillLevelOptions={SKILL_LEVEL_OPTIONS as readonly SkillLevel[]}
                    getAvailableTargetLevels={(current: SkillLevel) =>
                      getAvailableTargetLevels(
                        SKILL_LEVEL_OPTIONS as readonly SkillLevel[],
                        current
                      )
                    }
                    onChangeCurrent={handleCombatCurrentChange}
                    onChangeTarget={handleCombatTargetChange}
                  />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥?∞Î? Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="?¨Îä• ?§ÌÇ¨" summary={talentSummary}>
                {selectedOperator ? (
                  <SimulatorStageSection
                    emptyText="?±Î°ù???¨Îä• ?§ÌÇ¨ ?∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§."
                    items={talentGroups.map((group: TalentGroup) => ({
                      id: group.id,
                      title: group.name,
                      icon: group.icon,
                      currentStage: talentRanges[group.id]?.current ?? 0,
                      targetStage: talentRanges[group.id]?.target ?? 0,
                      maxStage: group.maxStage,
                      getStageLabel: (stage: number) =>
                        stage === 0 ? "0?®Í≥Ñ" : `${stage}?®Í≥Ñ`,
                      onChangeCurrent: (stage: number) =>
                        handleTalentCurrentChange(group.id, stage),
                      onChangeTarget: (stage: number) =>
                        handleTalentTargetChange(group.id, stage),
                    }))}
                  />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥?∞Î? Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="?∏ÌîÑ???§ÌÇ¨" summary={infrastructureSummary}>
                {selectedOperator ? (
                  <SimulatorStageSection
                    emptyText="?±Î°ù???∏ÌîÑ???§ÌÇ¨ ?∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§."
                    items={visibleInfrastructureGroups.map(
                      (group: InfrastructureGroup) => {
                        const currentStage =
                          infrastructureRanges[group.id]?.current ?? 0;
                        const targetStage =
                          infrastructureRanges[group.id]?.target ?? 0;

                        return {
                          id: group.id,
                          title: group.name,
                          icon: group.icon,
                          currentStage,
                          targetStage,
                          maxStage: group.maxStage,
                          currentRightLabel:
                            currentStage > 0
                              ? getInfrastructureTierLabel(
                                  selectedOperator,
                                  group.id,
                                  currentStage
                                )
                              : undefined,
                          targetRightLabel:
                            targetStage > 0
                              ? getInfrastructureTierLabel(
                                  selectedOperator,
                                  group.id,
                                  targetStage
                                )
                              : undefined,
                          getStageLabel: (stage: number) =>
                            stage === 0
                              ? "0?®Í≥Ñ"
                              : getInfrastructureTierLabel(
                                  selectedOperator,
                                  group.id,
                                  stage
                                ),
                          onChangeCurrent: (stage: number) =>
                            handleInfrastructureCurrentChange(group.id, stage),
                          onChangeTarget: (stage: number) =>
                            handleInfrastructureTargetChange(group.id, stage),
                        };
                      }
                    )}
                  />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥?∞Î? Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="?†Î¢∞??Î≥¥ÎÑà?? summary={trustSummary}>
                {selectedOperator ? (
                  visibleTrustStageInfos.length ? (
                    <RangeSelector
                      current={trustRange.current}
                      target={trustRange.target}
                      stages={trustStages}
                      getLabel={(stage) =>
                        stage === 0 ? "0?®Í≥Ñ" : `${stage}?®Í≥Ñ`
                      }
                      onChangeCurrent={(stage) =>
                        setTrustRange((prev) => ({
                          current: stage,
                          target: Math.max(stage, prev.target),
                        }))
                      }
                      onChangeTarget={(stage) =>
                        setTrustRange((prev) => ({
                          current: prev.current,
                          target: Math.max(prev.current, stage),
                        }))
                      }
                    />
                  ) : (
                    <div className="text-sm text-zinc-500">
                      ?±Î°ù???†Î¢∞??Î≥¥ÎÑà???∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§.
                    </div>
                  )
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥?∞Î? Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                )}
              </InfoPanel>
            </div>

            <div className="grid gap-6">
              <InfoPanel title="Ï¥??ÑÏöî ?¨Ìôî" summary={combinedSummary}>
                {selectedOperator || selectedWeapon ? (
                  <MaterialList items={combinedMaterialDeficitItems} columns={4} />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥?∞Ï? Î¨¥Í∏∞Î•??†ÌÉù?òÏãúÎ©?Ï¥??ÑÏöî ?¨ÌôîÎ•?Î≥¥Ïó¨?úÎ¶Ω?àÎã§.
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="?§Ìçº?àÏù¥???ÑÏöî ?¨Ìôî" summary={operatorMaterialsSummary}>
                {selectedOperator ? (
                  <MaterialList items={operatorMaterialDeficitItems} columns={4} />
                ) : (
                  <div className="text-sm text-zinc-500">
                    ?§Ìçº?àÏù¥?∞Î? Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                )}
              </InfoPanel>

              <InfoPanel title="Î¨¥Í∏∞ ?ÑÏöî ?¨Ìôî" summary={weaponMaterialsSummary}>
                {!selectedWeapon ? (
                  <div className="text-sm text-zinc-500">
                    Î¨¥Í∏∞Î•?Î®ºÏ? ?†ÌÉù??Ï£ºÏÑ∏??
                  </div>
                ) : weaponLevelSteps.length === 0 &&
                  weaponExpSteps.length === 0 &&
                  weaponBreakthroughSteps.length === 0 ? (
                  <div className="rounded-2xl border border-yellow-500/10 bg-[#090d14] p-4 text-sm text-zinc-500">
                    Î¨¥Í∏∞ ?àÎ≤®??/ ?åÌåå ?¨Ìôî ?∞Ïù¥?∞Î? Ï∞æÏ? Î™ªÌñà?µÎãà??
                    <br />
                    ?ÑÏû¨ ?†ÌÉù??Î¨¥Í∏∞ slug:{" "}
                    <span className="text-yellow-300">{selectedWeapon.slug}</span>
                  </div>
                ) : (
                  <MaterialList items={weaponMaterialDeficitItems} columns={4} />
                )}
              </InfoPanel>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



