"use client";

import { buildFarmingHref, saveFarmingTransferPayload } from "@/lib/farming/farming-transfer";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NumberInput from "@/app/components/common/NumberInput";
import type {
  SelectOperatorItem,
  SelectWeaponItem,
} from "@/app/components/select/CommonSelectPanel";
import type { OperatorDetail } from "@/data/operators-detail-data";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";
import InfoPanel from "./_components/InfoPanel";
import GrowthSection from "./_components/GrowthSection";
import GrowthTabs, {
  type GrowthTabKey,
} from "./_components/GrowthTabs";
import MaterialTabs, {
  type MaterialTabKey,
} from "./_components/MaterialTabs";
import RangeSelector from "./_components/RangeSelector";
import SimulatorStageSection from "./_components/SimulatorStageSection";
import SimulatorSkillPanel from "./_components/SimulatorSkillPanel";
import SimulatorLevelPanel from "./_components/SimulatorLevelPanel";
import { MATERIALS as FARMING_MATERIALS } from "@/data/farming/farm-data";
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
  applyOwnedMaterials,
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

const CommonSelectPanel = dynamic(
  () => import("@/app/components/select/CommonSelectPanel"),
  {
    ssr: false,
    loading: () => null,
  },
);

function getOperatorHeroImage(operator: OperatorDetail | null) {
  if (!operator) return "";

  const raw = operator as any;
  const slug = String(raw.slug ?? "");

  if (slug === "endministrator") {
    return "/operators/endministrator/full1.webp";
  }

  return (
    raw.fullImage ||
    raw.full ||
    raw.image ||
    raw.avatar ||
    `/operators/${slug}/full.webp`
  );
}

function getWeaponHeroImage(weapon: SourceWeaponDetail | null) {
  if (!weapon) return "";

  const raw = weapon as any;
  const slug = String(raw.slug ?? "");

  return (
    raw.fullImage ||
    raw.full ||
    raw.image ||
    raw.avatar ||
    `/weapons/${slug}/avatar.webp`
  );
}

// ===== 오퍼레이터/무기/장비 상세와 통일한 Endfield SF 디자인 토큰 =====
const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

const SIMULATOR_OPERATOR_STORAGE_KEY = "simulator:selectedOperatorSlug";
const SIMULATOR_WEAPON_STORAGE_KEY = "simulator:selectedWeaponSlug";
const LEGACY_SIMULATOR_SELECTION_KEY = "endfield:simulator-selection";

const SIMULATOR_FORM_STORAGE_KEY = "simulator:formState";
const SIMULATOR_SELECT_CONTEXT_KEY = "endfield-simulator-select-context-v1";
const USER_SIMULATOR_STATE_API = "/api/user/simulator-state";
const USER_MATERIAL_INVENTORY_API = "/api/user/material-inventory";
const USER_SIMULATOR_DATA_API = "/api/simulator/user-data";

type SimulatorDetailPayload = {
  ok?: boolean;
  operator?: OperatorDetail | null;
  weapon?: SourceWeaponDetail | null;
};

const simulatorDetailRequests = new Map<
  string,
  Promise<SimulatorDetailPayload>
>();
const MAX_SIMULATOR_DETAIL_CACHE_ENTRIES = 16;

function loadSimulatorDetails(operatorSlug: string, weaponSlug: string) {
  const normalizedOperatorSlug = operatorSlug.trim();
  const normalizedWeaponSlug = weaponSlug.trim();
  const key = `${normalizedOperatorSlug}|${normalizedWeaponSlug}`;
  const cached = simulatorDetailRequests.get(key);

  if (cached) {
    simulatorDetailRequests.delete(key);
    simulatorDetailRequests.set(key, cached);
    return cached;
  }

  const params = new URLSearchParams();
  if (normalizedOperatorSlug) params.set("operator", normalizedOperatorSlug);
  if (normalizedWeaponSlug) params.set("weapon", normalizedWeaponSlug);

  const request = fetch(`/api/simulator/detail?${params.toString()}`)
    .then(async (response) => {
      if (!response.ok) return { ok: false } as SimulatorDetailPayload;
      return (await response.json()) as SimulatorDetailPayload;
    })
    .catch(() => {
      simulatorDetailRequests.delete(key);
      return { ok: false } as SimulatorDetailPayload;
    });

  simulatorDetailRequests.set(key, request);

  if (simulatorDetailRequests.size > MAX_SIMULATOR_DETAIL_CACHE_ENTRIES) {
    const oldestKey = simulatorDetailRequests.keys().next().value;
    if (oldestKey) simulatorDetailRequests.delete(oldestKey);
  }

  return request;
}

type SimulatorFormState = {
  operatorSlug: string;
  weaponSlug: string;
  operatorCurrentLevel: number;
  operatorTargetLevel: number;
  weaponCurrentLevel: WeaponCurrentLevel;
  weaponTargetLevel: WeaponTargetLevel;
  eliteRange: RangeState;
  weaponBreakthroughRange: RangeState;
  trustRange: RangeState;
  combatSkillState: CombatSkillState;
  talentRanges: Record<number, RangeState>;
  infrastructureRanges: Record<number, RangeState>;
  ownedMaterials: Record<string, number>;
};

function readLocalSimulatorFormState(): Partial<SimulatorFormState> | null {
  if (typeof window === "undefined") return null;

  const raw =
    window.sessionStorage.getItem(SIMULATOR_FORM_STORAGE_KEY) ??
    window.localStorage.getItem(SIMULATOR_FORM_STORAGE_KEY) ??
    "";

  if (!raw) return null;

  try {
    return JSON.parse(raw) as Partial<SimulatorFormState>;
  } catch {
    return null;
  }
}

function writeLocalSimulatorFormState(state: Partial<SimulatorFormState>) {
  if (typeof window === "undefined") return;

  const raw = JSON.stringify(state);
  window.sessionStorage.setItem(SIMULATOR_FORM_STORAGE_KEY, raw);
  window.localStorage.setItem(SIMULATOR_FORM_STORAGE_KEY, raw);
}

function writeSimulatorSelectOperatorContext(operatorSlug: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    SIMULATOR_SELECT_CONTEXT_KEY,
    JSON.stringify({ operatorSlug }),
  );
}

function getSelectedOperatorWeaponType(operator: OperatorDetail | null) {
  if (!operator) return "";

  const raw = operator as any;

  return String(
    raw.weaponType ??
      raw.weapon ??
      raw.weaponKey ??
      raw.weaponClass ??
      raw.weaponCategory ??
      "",
  );
}

async function readUserSimulatorData(): Promise<{
  state: Partial<SimulatorFormState> | null;
  materials: Record<string, number> | null;
} | null> {
  try {
    const response = await fetch(USER_SIMULATOR_DATA_API, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      ok?: boolean;
      state?: Partial<SimulatorFormState> | null;
      materials?: Record<string, number> | null;
    };

    return {
      state: payload.state ?? null,
      materials: payload.materials ?? null,
    };
  } catch {
    return null;
  }
}

async function readSimulatorFormState(): Promise<Partial<SimulatorFormState> | null> {
  if (typeof window === "undefined") return null;

  const userData = await readUserSimulatorData();
  const userState = userData?.state ?? null;
  const userMaterials = userData?.materials ?? null;

  if (userState || userMaterials) {
    const mergedState = {
      ...(userState ?? {}),
      ...(userMaterials ? { ownedMaterials: userMaterials } : {}),
    } as Partial<SimulatorFormState>;

    writeLocalSimulatorFormState(mergedState);
    return mergedState;
  }

  return readLocalSimulatorFormState();
}

function saveUserSimulatorState(state: SimulatorFormState) {
  const { ownedMaterials: _ownedMaterials, ...stateWithoutMaterials } = state;

  fetch(USER_SIMULATOR_STATE_API, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: stateWithoutMaterials,
    }),
  }).catch(() => {
    // 비로그인 또는 네트워크 오류는 로컬 저장값으로만 유지합니다.
  });
}

function saveUserMaterialInventory(materials: Record<string, number>) {
  fetch(USER_MATERIAL_INVENTORY_API, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      materials,
    }),
  }).catch(() => {
    // 비로그인 또는 네트워크 오류는 로컬 저장값으로만 유지합니다.
  });
}

function saveSimulatorFormState(state: SimulatorFormState) {
  if (typeof window === "undefined") return;

  // 자동 DB 저장은 하지 않고, 브라우저 로컬 저장만 갱신합니다.
  // DB 저장은 보유 재화 수치를 사용자가 직접 바꿀 때만 실행합니다.
  writeLocalSimulatorFormState(state);
}

function clearSimulatorFormState() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(SIMULATOR_OPERATOR_STORAGE_KEY);
  window.sessionStorage.removeItem(SIMULATOR_WEAPON_STORAGE_KEY);
  window.sessionStorage.removeItem(LEGACY_SIMULATOR_SELECTION_KEY);
  window.sessionStorage.removeItem(SIMULATOR_FORM_STORAGE_KEY);

  window.localStorage.removeItem(LEGACY_SIMULATOR_SELECTION_KEY);
  window.localStorage.removeItem(SIMULATOR_FORM_STORAGE_KEY);
  window.localStorage.removeItem(SIMULATOR_SELECT_CONTEXT_KEY);
  window.localStorage.removeItem("endfield:farming-transfer");
  window.localStorage.removeItem("endfield:farming-page-state");

  fetch(USER_SIMULATOR_STATE_API, { method: "DELETE" }).catch(() => {});
}

function isRangeState(value: unknown): value is RangeState {
  if (!value || typeof value !== "object") return false;
  const range = value as RangeState;
  return Number.isFinite(Number(range.current)) && Number.isFinite(Number(range.target));
}

function normalizeRangeState(value: unknown, fallback: RangeState): RangeState {
  if (!isRangeState(value)) return fallback;
  return {
    current: Number(value.current),
    target: Number(value.target),
  };
}

function normalizeRangeMap(
  value: unknown,
  fallback: Record<number, RangeState>
): Record<number, RangeState> {
  if (!value || typeof value !== "object") return fallback;

  return Object.entries(value as Record<string, unknown>).reduce<
    Record<number, RangeState>
  >((acc, [key, range]) => {
    const id = Number(key);
    if (!Number.isFinite(id)) return acc;
    acc[id] = normalizeRangeState(range, fallback[id] ?? { current: 0, target: 0 });
    return acc;
  }, {});
}


function getStoredSimulatorSlug(kind: "operator" | "weapon") {
  if (typeof window === "undefined") return "";

  const directKey =
    kind === "operator"
      ? SIMULATOR_OPERATOR_STORAGE_KEY
      : SIMULATOR_WEAPON_STORAGE_KEY;

  const directValue = window.sessionStorage.getItem(directKey) ?? "";
  if (directValue) return directValue;

  const legacyValue =
    window.sessionStorage.getItem(LEGACY_SIMULATOR_SELECTION_KEY) ??
    window.localStorage.getItem(LEGACY_SIMULATOR_SELECTION_KEY) ??
    "";

  if (!legacyValue) return "";

  try {
    const parsed = JSON.parse(legacyValue) as Record<string, unknown>;
    const candidates =
      kind === "operator"
        ? [
            parsed.operatorSlug,
            parsed.selectedOperatorSlug,
            parsed.operator,
            parsed.operatorId,
          ]
        : [
            parsed.weaponSlug,
            parsed.selectedWeaponSlug,
            parsed.weapon,
            parsed.weaponId,
          ];

    const found = candidates.find(
      (value) => typeof value === "string" && value.trim().length > 0
    );

    return typeof found === "string" ? found.trim() : "";
  } catch {
    return "";
  }
}


type OperatorTargetLevel = (typeof OPERATOR_TARGET_LEVEL_OPTIONS)[number];

type RangeState = {
  current: number;
  target: number;
};

function toOperatorTargetLevel(level: number): OperatorTargetLevel {
  const levels = OPERATOR_TARGET_LEVEL_OPTIONS as readonly number[];
  return (levels.includes(level) ? level : 90) as OperatorTargetLevel;
}

function normalizeMaterialName(name: unknown) {
  const text = String(name ?? "").trim();

  if (
    text === "T-크레딧" ||
    text === "티 크레딧" ||
    text.toLowerCase() === "t-credit" ||
    text.toLowerCase() === "t-credits"
  ) {
    return "탈로시안 화폐";
  }

  return text;
}

function parseSimulatorAmount(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value ?? "")
    .trim()
    .replace(/,/g, "")
    .toLowerCase();

  if (!raw) return 0;

  const match = raw.match(/^(-?\d+(?:\.\d+)?)(k|m)?$/);
  if (!match) {
    const fallback = Number(raw.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(fallback) ? fallback : 0;
  }

  const base = Number(match[1]);
  const unit = match[2];
  const multiplier = unit === "m" ? 1_000_000 : unit === "k" ? 1_000 : 1;

  return Math.round(base * multiplier);
}

function cleanInfrastructureLabel(label: unknown) {
  return String(label ?? "")
    .replace(/^[\s·:：\-–—|/]+/, "")
    .replace(/[\s·:：\-–—|/]+$/, "")
    .trim();
}

function toSimMaterials(items: any[] = []) {
  return items
    .map((item) => {
      const name = normalizeMaterialName(item?.name);

      return {
        name,
        count: parseSimulatorAmount(item?.count ?? item?.amount ?? item?.quantity ?? 0),
        icon:
          item?.icon ??
          (name ? `/materials/${name}.webp` : undefined),
      };
    })
    .filter((item) => item.name && item.count > 0);
}

function buildStageTokens(prefix: string, current: number, target: number) {
  if (target <= current) return [];
  return Array.from(
    { length: target - current },
    (_, index) => `${prefix}-${current + index + 1}`
  );
} 

function getMaxRangeStage(stages: number[]) {
  return stages.length ? Math.max(...stages) : 0;
}

function buildMaxRangeMap<T extends { id: number; maxStage: number }>(groups: T[]) {
  return groups.reduce<Record<number, RangeState>>((acc, group) => {
    acc[group.id] = { current: 0, target: Math.max(0, Number(group.maxStage ?? 0)) };
    return acc;
  }, {});
}

function getExtraMaterialCandidates(source: any) {
  return [
    source?.materials,
    source?.costs,
    source?.items,
    source?.requiredMaterials,
    source?.costMaterials,
    source?.material,
    source?.cost,
    source?.require,
    source?.requirements,
  ].find((value) => Array.isArray(value)) ?? [];
}

function getRawWeaponBreakthroughSources(weapon: any) {
  const candidates = [
    weapon?.breakthrough,
    weapon?.breakthroughs,
    weapon?.breakthroughItems,
    weapon?.breakthroughMaterials,
    weapon?.weaponBreakthrough,
    weapon?.weaponBreakthroughs,
    weapon?.ascensions,
    weapon?.promotions,
    weapon?.limitBreaks,
    weapon?.rankUps,
    weapon?.upgrades,
  ];

  return candidates.flatMap((candidate) => {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      return Object.values(candidate).filter(
        (value) => value && typeof value === "object"
      );
    }
    return [];
  });
}

function getRawWeaponBreakthroughSource(weapon: any, stage: number) {
  return getRawWeaponBreakthroughSources(weapon).find((item: any) => {
    const itemStage = Number(
      item?.stage ??
        item?.level ??
        item?.phase ??
        item?.rank ??
        item?.breakthrough ??
        item?.breakthroughStage
    );

    return itemStage === stage;
  });
}

function getStageCurrencyMaterial(source: any) {
  const directCurrency = parseSimulatorAmount(
    source?.currency ??
      source?.credit ??
      source?.credits ??
      source?.coin ??
      source?.cost ??
      source?.tCredit ??
      source?.tCredits ??
      source?.tCreditCost ??
      source?.tCreditsCost ??
      source?.talosianCurrency ??
      source?.talosianCredits ??
      source?.upgradeCurrency ??
      source?.breakthroughCurrency ??
      source?.talosianCurrencyCost ??
      source?.talosianCost ??
      source?.tCurrency ??
      source?.money ??
      source?.gold ??
      source?.lmd ??
      0
  );

  const nestedCurrency = [
    source?.costInfo,
    source?.currencyCost,
    source?.breakthroughCost,
    source?.upgradeCost,
  ].reduce((total, item) => {
    if (!item || typeof item !== "object") return total;
    return (
      total +
      parseSimulatorAmount(
        item.currency ??
          item.credit ??
          item.credits ??
          item.cost ??
          item.tCredit ??
          item.tCredits ??
          item.tCreditCost ??
          item.tCreditsCost ??
          0
      )
    );
  }, 0);

  const currency = directCurrency + nestedCurrency;

  if (!Number.isFinite(currency) || currency <= 0) return [];

  return [
    {
      name: "탈로시안 화폐",
      count: currency,
      icon: "/materials/탈로시안 화폐.webp",
    },
  ];
}

type SimulatorMaterial = {
  name: string;
  count: number;
  icon?: string;
};

function mergeUniqueSimMaterials(...groups: SimulatorMaterial[]) {
  const seen = new Set<string>();
  const items: SimulatorMaterial[] = [];

  for (const item of groups) {
    const name = normalizeMaterialName(item.name);
    const count = parseSimulatorAmount(item.count);

    if (!name || count <= 0) continue;

    const key = `${name}::${count}`;
    if (seen.has(key)) continue;

    seen.add(key);
    items.push({
      name,
      count,
      icon: item.icon ?? `/materials/${name}.webp`,
    });
  }

  return mergeMaterials([
    {
      label: "중복 제거",
      materials: items,
    },
  ]);
}

function getDedupedBreakthroughMaterials(rawSource: any, rawItem: any) {
  return mergeUniqueSimMaterials(
    ...toSimMaterials(getExtraMaterialCandidates(rawSource)),
    ...toSimMaterials(getExtraMaterialCandidates(rawItem)),
  );
}

function getDedupedBreakthroughCurrency(rawSource: any, rawItem: any) {
  return mergeUniqueSimMaterials(
    ...getStageCurrencyMaterial(rawSource),
    ...getStageCurrencyMaterial(rawItem),
  );
}

function formatRangeSummary(label: string, current: number, target: number) {
  return `${label} ${current} → ${target}`;
}


function materialImage(name: string) {
  return `/materials/${name}.webp`;
}

type OwnedMaterialModalItem = {
  name: string;
  icon?: string;
  owned: number;
};

function OwnedMaterialBulkModal({
  values,
  onClose,
  onChange,
}: {
  values: OwnedMaterialModalItem[];
  onClose: () => void;
  onChange: (name: string, amount: number) => void;
}) {
  const [search, setSearch] = useState("");

  const valueMap = useMemo(() => {
    const map = new Map<string, number>();
    values.forEach((item) => map.set(item.name, item.owned));
    return map;
  }, [values]);

  const iconMap = useMemo(() => {
    const map = new Map<string, string | undefined>();
    values.forEach((item) => map.set(item.name, item.icon));
    return map;
  }, [values]);

  const list = useMemo(() => {
    const baseNames = FARMING_MATERIALS.map((item) => item.name);
    const knownNameSet = new Set(baseNames);
    const extraNames = values
      .map((item) => item.name)
      .filter((name) => name && !knownNameSet.has(name));

    const q = search.trim().toLowerCase();

    return sortSimulatorMaterials({
      items: [...baseNames, ...extraNames]
        .filter((name, index, array) => array.indexOf(name) === index)
        .filter((name) => (q ? name.toLowerCase().includes(q) : true))
        .map((name) => ({
          name,
          icon: iconMap.get(name) ?? materialImage(name),
          count: valueMap.get(name) ?? 0,
        })),
    });
  }, [iconMap, search, valueMap, values]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-4">
      <div
        className="flex h-[92vh] w-[min(1180px,calc(100vw-1.5rem))] flex-col overflow-hidden border border-ef-line bg-ef-card2 sm:h-[90vh] sm:w-[min(1180px,calc(100vw-2rem))]"
        style={CUT}
      >
        <span className="block h-0.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ef-line px-4 py-4 sm:gap-4 sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-1 h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ef-muted">
                Material Inventory
              </p>

              <h3 className="mt-0.5 text-xl font-black tracking-tight text-white sm:text-2xl">
                보유 재화 입력
              </h3>

              <p className="mt-1 text-xs leading-5 text-ef-muted sm:text-sm">
                현재 보유 중인 재화 수량을 입력합니다. 이 값은 성장 시뮬레이션과 재화 파밍 계산기에서 같이 사용됩니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-ef-line bg-ef-card text-xl font-black text-ef-muted transition hover:border-ef-accent/50 hover:text-ef-accent-soft sm:h-11 sm:w-11"
            style={CUT_SM}
            aria-label="보유 재화 입력창 닫기"
          >
            ×
          </button>
        </div>

        <div className="shrink-0 border-b border-ef-line px-4 py-4 sm:px-7 sm:py-5">
          <div className="space-y-2">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
              검색
            </p>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="재화 검색"
              className="h-12 w-full border border-ef-line bg-ef-card px-4 text-sm font-semibold text-white outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
              style={CUT_SM}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-7 sm:py-6">
          {list.length ? (
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] sm:gap-3 sm:[grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
              {list.map((item) => (
                <div
                  key={item.name}
                  className="border border-ef-line bg-ef-card p-3.5"
                  style={CUT_SM}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="relative h-12 w-12 shrink-0 overflow-hidden border border-ef-line bg-black"
                      style={CUT_SM}
                    >
                      <Image
                        src={item.icon ?? materialImage(item.name)}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="truncate text-sm font-black"
                        style={{ color: ACCENT }}
                      >
                        {item.name}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ef-muted">
                        현재 보유량
                      </div>
                    </div>
                  </div>

                  <NumberInput
                    value={Number(item.count ?? 0)}
                    onChange={(value) => onChange(item.name, value)}
                    min={0}
                    className="mt-3.5 h-11 border-ef-line bg-black text-ef-accent"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex min-h-[300px] items-center justify-center border border-ef-line bg-ef-card p-8 text-center text-sm text-ef-muted"
              style={CUT}
            >
              조건에 맞는 재화가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

  function normalizeFarmingTransferItems(items: Array<{ name: string; amount: number }>) {
    return items
      .map((item) => ({
        name: String(item.name ?? "").trim(),
        amount: Number(item.amount ?? 0),
      }))
      .filter((item) => item.name && Number.isFinite(item.amount) && item.amount > 0);
  }

  function goFarmingCalculator(requiredMaterials: Array<{ name: string; amount: number }>, ownedMaterials: Array<{ name: string; amount: number }>) {
    const payload = {
      requiredMaterials: normalizeFarmingTransferItems(requiredMaterials),
      ownedMaterials: normalizeFarmingTransferItems(ownedMaterials),
    };

    saveFarmingTransferPayload(payload);
    router.push(buildFarmingHref(payload));
  }

  function resetSimulatorAndGoHome() {
    window.location.assign("/");
  }

  const searchParams = useSearchParams();
  const syncKey = searchParams.get("sync") ?? "";

  const [operators, setOperators] = useState<SelectOperatorItem[]>([]);
  const [weapons, setWeapons] = useState<SelectWeaponItem[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);
  const [selectedOperatorSlug, setSelectedOperatorSlug] = useState("");
  const [selectedWeaponSlug, setSelectedWeaponSlug] = useState("");
  const [selectedOperator, setSelectedOperator] =
    useState<OperatorDetail | null>(null);
  const [selectedWeapon, setSelectedWeapon] =
    useState<SourceWeaponDetail | null>(null);
  const [isOwnedPanelOpen, setIsOwnedPanelOpen] = useState(false);
  const [selectPanel, setSelectPanel] = useState<
    | { kind: "operator"; title: string; selectedSlug: string }
    | { kind: "weapon"; title: string; selectedSlug: string }
    | null
  >(null);
  const [growthTab, setGrowthTab] = useState<GrowthTabKey>("progression");
  const [materialTab, setMaterialTab] = useState<MaterialTabKey>("all");

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
  const [simulatorStorageReady, setSimulatorStorageReady] = useState(false);
  const operatorRestoreAppliedRef = useRef(false);
  const weaponRestoreAppliedRef = useRef(false);
  const simulatorRestoreAppliedRef = useRef(false);
  const operatorBySlug = useMemo(
    () => new Map(operators.map((operator) => [operator.slug, operator])),
    [operators],
  );
  const weaponBySlug = useMemo(
    () => new Map(weapons.map((weapon) => [weapon.slug, weapon])),
    [weapons],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/simulator/catalog", { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (!data?.ok) return;
        setOperators(Array.isArray(data.operators) ? data.operators : []);
        setWeapons(Array.isArray(data.weapons) ? data.weapons : []);
      })
      .finally(() => setCatalogReady(true))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedOperatorSlug && !selectedWeaponSlug) {
      setSelectedOperator(null);
      setSelectedWeapon(null);
      return;
    }

    let active = true;
    setSelectedOperator(null);
    setSelectedWeapon(null);

    loadSimulatorDetails(selectedOperatorSlug, selectedWeaponSlug)
      .then((data) => {
        if (!active || !data?.ok) return;

        setSelectedOperator(
          data.operator?.slug === selectedOperatorSlug ? data.operator : null,
        );
        setSelectedWeapon(
          data.weapon?.slug === selectedWeaponSlug ? data.weapon : null,
        );
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [selectedOperatorSlug, selectedWeaponSlug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!catalogReady) return;
    if (simulatorRestoreAppliedRef.current && !syncKey) return;

    simulatorRestoreAppliedRef.current = true;

    let cancelled = false;

    async function restoreSimulatorState() {
      const queryOperatorSlug =
        searchParams.get("operator") ?? searchParams.get("operatorSlug") ?? "";
      const queryWeaponSlug =
        searchParams.get("weapon") ?? searchParams.get("weaponSlug") ?? "";

      const storedFormState = await readSimulatorFormState();

      if (cancelled) return;

      const storedOperatorSlug =
        queryOperatorSlug ||
        (typeof storedFormState?.operatorSlug === "string"
          ? storedFormState.operatorSlug
          : "") ||
        getStoredSimulatorSlug("operator");
      const storedWeaponSlug =
        queryWeaponSlug ||
        (typeof storedFormState?.weaponSlug === "string"
          ? storedFormState.weaponSlug
          : "") ||
        getStoredSimulatorSlug("weapon");

      const nextOperatorSlug =
        storedOperatorSlug && operatorBySlug.has(storedOperatorSlug)
          ? storedOperatorSlug
          : "";
      const nextWeaponSlug =
        storedWeaponSlug && weaponBySlug.has(storedWeaponSlug)
          ? storedWeaponSlug
          : "";

      setSelectedOperatorSlug(nextOperatorSlug);
      setSelectedWeaponSlug(nextWeaponSlug);

      if (storedFormState?.operatorSlug === nextOperatorSlug) {
        if (Number.isFinite(Number(storedFormState.operatorCurrentLevel))) {
          setOperatorCurrentLevel(Number(storedFormState.operatorCurrentLevel));
        }
        if (Number.isFinite(Number(storedFormState.operatorTargetLevel))) {
          setOperatorTargetLevel(
            toOperatorTargetLevel(Number(storedFormState.operatorTargetLevel))
          );
        }
      }

      if (storedFormState?.weaponSlug === nextWeaponSlug) {
        if (Number.isFinite(Number(storedFormState.weaponCurrentLevel))) {
          setWeaponCurrentLevel(
            Number(storedFormState.weaponCurrentLevel) as WeaponCurrentLevel
          );
        }
        if (Number.isFinite(Number(storedFormState.weaponTargetLevel))) {
          setWeaponTargetLevel(
            toWeaponTargetLevel(Number(storedFormState.weaponTargetLevel))
          );
        }
      }

      if (
        storedFormState?.ownedMaterials &&
        typeof storedFormState.ownedMaterials === "object"
      ) {
        setOwnedMaterials(storedFormState.ownedMaterials);
      }

      setSimulatorStorageReady(true);
    }

    restoreSimulatorState();

    return () => {
      cancelled = true;
    };
  }, [catalogReady, operatorBySlug, searchParams, syncKey, weaponBySlug]);

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

  useEffect(() => {
    if (!simulatorStorageReady) return;

    const timeoutId = window.setTimeout(() => {
      saveSimulatorFormState({
        operatorSlug: selectedOperatorSlug,
        weaponSlug: selectedWeaponSlug,
        operatorCurrentLevel,
        operatorTargetLevel,
        weaponCurrentLevel,
        weaponTargetLevel,
        eliteRange,
        weaponBreakthroughRange,
        trustRange,
        combatSkillState,
        talentRanges,
        infrastructureRanges,
        ownedMaterials,
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [
    simulatorStorageReady,
    selectedOperatorSlug,
    selectedWeaponSlug,
    operatorCurrentLevel,
    operatorTargetLevel,
    weaponCurrentLevel,
    weaponTargetLevel,
    eliteRange,
    weaponBreakthroughRange,
    trustRange,
    combatSkillState,
    talentRanges,
    infrastructureRanges,
    ownedMaterials,
  ]);

  const selectedOperatorImage = useMemo(
    () => getOperatorHeroImage(selectedOperator),
    [selectedOperator]
  );

  const selectedWeaponImage = useMemo(
    () => getWeaponHeroImage(selectedWeapon),
    [selectedWeapon]
  );

  const handleOperatorSelect = (slug: string) => {
    const resetCombatSkillState: CombatSkillState = {
      normal: { current: "1", target: "M3" },
      combo: { current: "1", target: "M3" },
      battle: { current: "1", target: "M3" },
      ultimate: { current: "1", target: "M3" },
    };

    operatorRestoreAppliedRef.current = false;
    setSelectedOperatorSlug(slug);
    writeSimulatorSelectOperatorContext(slug);
    setOperatorCurrentLevel(1);
    setOperatorTargetLevel(90);
    setCombatSkillState(resetCombatSkillState);
  };

  const handleWeaponSelect = (slug: string) => {
    weaponRestoreAppliedRef.current = false;
    setSelectedWeaponSlug(slug);
    setWeaponCurrentLevel(1);
    setWeaponTargetLevel(90);
  };

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
    if (!selectedOperator) {
      setEliteRange({ current: 0, target: 0 });
      setTrustRange({ current: 0, target: 0 });
      setTalentRanges({});
      setInfrastructureRanges({});
      return;
    }

    const nextEliteMax = ((selectedOperator as any)?.elite?.length ?? 0);
    const nextTrustMax = isEndministrator ? 0 : getMaxRangeStage(
      getTrustStageInfos(selectedOperator).map((item: TrustStageInfo) => item.stage)
    );
    const nextTalentRanges = buildMaxRangeMap(getTalentGroups(selectedOperator));
    const nextInfrastructureRanges = isEndministrator
      ? {}
      : buildMaxRangeMap(getInfrastructureGroups(selectedOperator));

    const storedFormState = readLocalSimulatorFormState();
    if (
      !operatorRestoreAppliedRef.current &&
      storedFormState?.operatorSlug === selectedOperatorSlug
    ) {
      setEliteRange(
        normalizeRangeState(storedFormState.eliteRange, {
          current: 0,
          target: nextEliteMax,
        })
      );
      setTrustRange(
        normalizeRangeState(storedFormState.trustRange, {
          current: 0,
          target: nextTrustMax,
        })
      );
      setTalentRanges(normalizeRangeMap(storedFormState.talentRanges, nextTalentRanges));
      setInfrastructureRanges(
        normalizeRangeMap(storedFormState.infrastructureRanges, nextInfrastructureRanges)
      );
      if (storedFormState.combatSkillState) {
        setCombatSkillState(storedFormState.combatSkillState);
      }
      operatorRestoreAppliedRef.current = true;
      return;
    }

    if (!operatorRestoreAppliedRef.current) {
      setEliteRange({ current: 0, target: nextEliteMax });
      setTrustRange({ current: 0, target: nextTrustMax });
      setTalentRanges(nextTalentRanges);
      setInfrastructureRanges(nextInfrastructureRanges);
      setCombatSkillState({
        normal: { current: "1", target: "M3" },
        combo: { current: "1", target: "M3" },
        battle: { current: "1", target: "M3" },
        ultimate: { current: "1", target: "M3" },
      });
      operatorRestoreAppliedRef.current = true;
    }
  }, [selectedOperator, selectedOperatorSlug, isEndministrator]);

  useEffect(() => {
    if (!selectedWeapon) {
      setWeaponBreakthroughRange({ current: 0, target: 0 });
      return;
    }

    const nextBreakthroughMax = getMaxRangeStage(
      getWeaponBreakthroughItems(selectedWeapon).map(
        (item: WeaponBreakthroughItem) => item.stage
      )
    );

    const storedFormState = readLocalSimulatorFormState();
    if (
      !weaponRestoreAppliedRef.current &&
      storedFormState?.weaponSlug === selectedWeaponSlug
    ) {
      setWeaponBreakthroughRange(
        normalizeRangeState(storedFormState.weaponBreakthroughRange, {
          current: 0,
          target: nextBreakthroughMax,
        })
      );
      weaponRestoreAppliedRef.current = true;
      return;
    }

    if (!weaponRestoreAppliedRef.current) {
      setWeaponBreakthroughRange({ current: 0, target: nextBreakthroughMax });
      weaponRestoreAppliedRef.current = true;
    }
  }, [selectedWeapon, selectedWeaponSlug]);

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
        label: item.phase ?? `정예화 ${eliteRange.current + index + 1}`,
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
          label: `${nameMap.get(talentId) ?? `재능 스킬 ${talentId}`} ${Number(
            item.stage
          )}단계`,
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
        label: `신뢰도 ${Number(item.stage)}단계`,
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
        name: "탈로시안 화폐",
        count: currencyTotal,
        icon: "/materials/탈로시안 화폐.webp",
      });
    }

    if (!items.length) return [];

    return [
      {
        label: "무기 레벨업",
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
      .map((item) => {
        const rawItem = item as any;
        const rawSource = getRawWeaponBreakthroughSource(selectedWeapon, item.stage);

        const currencyMaterials = getDedupedBreakthroughCurrency(rawSource, rawItem);
        const breakthroughMaterials = getDedupedBreakthroughMaterials(rawSource, rawItem);

        const materials = mergeMaterials([
          {
            label: "무기 돌파 화폐",
            materials: currencyMaterials,
          },
          {
            label: "무기 돌파 재화",
            materials: breakthroughMaterials,
          },
        ]);

        return {
          label: `무기 돌파 ${item.stage}단계`,
          materials,
        };
      })
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
    return applyOwnedMaterials(sortedOperatorTotalMaterials, ownedMaterials);
  }, [sortedOperatorTotalMaterials, ownedMaterials]);

  const weaponMaterialDeficitItems = useMemo(() => {
    return applyOwnedMaterials(sortedWeaponTotalMaterials, ownedMaterials);
  }, [sortedWeaponTotalMaterials, ownedMaterials]);

  const combinedMaterialDeficitItems = useMemo(() => {
    return applyOwnedMaterials(sortedCombinedTotalMaterials, ownedMaterials);
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
    setOwnedMaterials((prev: Record<string, number>) => {
      const next = { ...prev };
      const amount = Math.max(0, value);

      if (amount <= 0) delete next[name];
      else next[name] = amount;

      writeLocalSimulatorFormState({
        operatorSlug: selectedOperatorSlug,
        weaponSlug: selectedWeaponSlug,
        operatorCurrentLevel,
        operatorTargetLevel,
        weaponCurrentLevel,
        weaponTargetLevel,
        eliteRange,
        weaponBreakthroughRange,
        trustRange,
        combatSkillState,
        talentRanges,
        infrastructureRanges,
        ownedMaterials: next,
      });

      saveUserMaterialInventory(next);

      return next;
    });
  };

  const handleGoHome = (event?: MouseEvent<HTMLAnchorElement>) => {
    event?.preventDefault();

    saveSimulatorFormState({
      operatorSlug: selectedOperatorSlug,
      weaponSlug: selectedWeaponSlug,
      operatorCurrentLevel,
      operatorTargetLevel,
      weaponCurrentLevel,
      weaponTargetLevel,
      eliteRange,
      weaponBreakthroughRange,
      trustRange,
      combatSkillState,
      talentRanges,
      infrastructureRanges,
      ownedMaterials,
    });

    window.location.assign("/");
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
      ? `오퍼레이터 레벨 ${safeOperatorCurrentLevel} → 레벨 ${safeOperatorTargetLevel}`
      : null,
    selectedWeapon
      ? `무기 레벨 ${safeWeaponCurrentLevel} → 레벨 ${safeWeaponTargetLevel}`
      : null,
  ]
    .filter(Boolean)
    .join(" / ");

  const eliteSummary = selectedOperator
    ? formatRangeSummary("정예화", eliteRange.current, eliteRange.target)
    : "오퍼레이터를 선택해 주세요.";

  const weaponBreakthroughSummary = selectedWeapon
    ? formatRangeSummary(
        "무기 돌파",
        weaponBreakthroughRange.current,
        weaponBreakthroughRange.target
      )
    : "무기를 선택해 주세요.";

  const trustSummary = selectedOperator
    ? visibleTrustStageInfos.length
      ? formatRangeSummary("신뢰도 보너스", trustRange.current, trustRange.target)
      : "등록된 신뢰도 보너스 데이터가 없습니다."
    : "오퍼레이터를 선택해 주세요.";

  const combatSummary = selectedOperator
    ? combatSkillMetas
        .map((meta) => {
          const state = combatSkillState[meta.key];
          return `${meta.label} ${state.current} → ${state.target}`;
        })
        .join(" / ")
    : "오퍼레이터를 선택해 주세요.";

  const talentSummary = selectedOperator
    ? talentGroups.length
      ? talentGroups
          .map((group) => {
            const range = talentRanges[group.id] ?? { current: 0, target: 0 };
            return `${group.name} ${range.current} → ${range.target}`;
          })
          .join(" / ")
      : "등록된 재능 스킬 데이터가 없습니다."
    : "오퍼레이터를 선택해 주세요.";

  const infrastructureSummary = selectedOperator
    ? visibleInfrastructureGroups.length
      ? visibleInfrastructureGroups
          .map((group) => {
            const range = infrastructureRanges[group.id] ?? {
              current: 0,
              target: 0,
            };
            return `${group.name} ${range.current} → ${range.target}`;
          })
          .join(" / ")
      : "등록된 인프라 스킬 데이터가 없습니다."
    : "오퍼레이터를 선택해 주세요.";

  const combinedSummary = selectedOperator || selectedWeapon
    ? `재화 ${combinedMaterialDeficitItems.length}종 / 총 필요 ${sumMaterialCounts(
        combinedMaterialDeficitItems
      ).toLocaleString()} / 부족 ${sumMaterialCounts(
        combinedMaterialDeficitItems,
        true
      ).toLocaleString()}`
    : "오퍼레이터와 무기를 선택해 주세요.";

  const operatorMaterialsSummary = selectedOperator
    ? `재화 ${operatorMaterialDeficitItems.length}종 / 총 필요 ${sumMaterialCounts(
        operatorMaterialDeficitItems
      ).toLocaleString()} / 부족 ${sumMaterialCounts(
        operatorMaterialDeficitItems,
        true
      ).toLocaleString()}`
    : "오퍼레이터를 선택해 주세요.";

  const weaponMaterialsSummary = selectedWeapon
    ? `재화 ${weaponMaterialDeficitItems.length}종 / 총 필요 ${sumMaterialCounts(
        weaponMaterialDeficitItems
      ).toLocaleString()} / 부족 ${sumMaterialCounts(
        weaponMaterialDeficitItems,
        true
      ).toLocaleString()}`
    : "무기를 선택해 주세요.";

  const growthTabs = [
    {
      key: "progression" as const,
      label: "레벨·돌파",
      summary: [levelSummary, eliteSummary, weaponBreakthroughSummary]
        .filter(Boolean)
        .join(" / "),
    },
    { key: "combat" as const, label: "전투 스킬", summary: combatSummary },
    { key: "talent" as const, label: "재능 스킬", summary: talentSummary },
    {
      key: "infrastructure" as const,
      label: "인프라 스킬",
      summary: infrastructureSummary,
    },
    { key: "trust" as const, label: "신뢰도", summary: trustSummary },
  ];

  const materialTabs = [
    {
      key: "all" as const,
      label: "전체",
      summary: combinedSummary,
      items: combinedMaterialDeficitItems,
      enabled: Boolean(selectedOperator || selectedWeapon),
      emptyText:
        "오퍼레이터나 무기를 선택하면 전체 필요 재화를 보여드립니다.",
    },
    {
      key: "operator" as const,
      label: "오퍼레이터",
      summary: operatorMaterialsSummary,
      items: operatorMaterialDeficitItems,
      enabled: Boolean(selectedOperator),
      emptyText: "오퍼레이터를 먼저 선택해 주세요.",
    },
    {
      key: "weapon" as const,
      label: "무기",
      summary: weaponMaterialsSummary,
      items: weaponMaterialDeficitItems,
      enabled: Boolean(selectedWeapon),
      emptyText: "무기를 먼저 선택해 주세요.",
    },
  ];
  function handleGoFarmingCalculator() {
    saveSimulatorFormState({
      operatorSlug: selectedOperatorSlug,
      weaponSlug: selectedWeaponSlug,
      operatorCurrentLevel,
      operatorTargetLevel,
      weaponCurrentLevel,
      weaponTargetLevel,
      eliteRange,
      weaponBreakthroughRange,
      trustRange,
      combatSkillState,
      talentRanges,
      infrastructureRanges,
      ownedMaterials,
    });

    const requiredMaterials = combinedMaterialDeficitItems
      .filter((item) => Number(item.lacking ?? 0) > 0)
      .map((item) => ({
        name: item.name,
        amount: Number(item.lacking ?? 0),
      }));

    const ownedMaterialsForFarming = Object.entries(ownedMaterials)
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

    goFarmingCalculator(requiredMaterials, ownedMaterialsForFarming);
  }

  const sectionLinks = [
    { href: "#select", label: "선택" },
    { href: "#growth", label: "성장 설정" },
    { href: "#materials", label: "필요 재화" },
  ];

  const dashboardStats = [
    {
      label: "오퍼레이터",
      value: selectedOperator?.name ?? "미선택",
      sub: selectedOperator?.enName ?? "먼저 성장 대상을 골라주세요",
    },
    {
      label: "무기",
      value: selectedWeapon?.name ?? "미선택",
      sub: selectedWeapon?.enName ?? "선택 오퍼레이터에 맞춰 필터링됩니다",
    },
    {
      label: "총 필요 재화",
      value: combinedMaterialDeficitItems.length.toLocaleString(),
      sub: combinedSummary,
    },
    {
      label: "보유 재화",
      value: Object.keys(ownedMaterials).length.toLocaleString(),
      sub: "입력값은 파밍 계산기와 공유됩니다",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto hidden max-w-[1720px] items-center justify-between px-4 py-2.5 md:flex md:px-6 xl:px-8">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Growth Sim</span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">// 성장 시뮬레이션</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1720px] px-3 py-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-4 md:px-6 md:pb-5 md:pt-1 xl:px-8">
        <div className="grid gap-3 lg:gap-4">
          <header
            className="relative overflow-hidden border border-ef-line bg-ef-card2 p-4 sm:p-5"
            style={CUT}
          >
            <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ef-muted">
                  Growth Simulation
                </p>

                <h1 className="mt-1.5 break-keep text-2xl font-black leading-[0.95] tracking-tight text-white sm:text-4xl">
                  성장 시뮬레이션
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsOwnedPanelOpen(true)}
                  className="min-h-11 px-3 py-2.5 text-xs font-black text-black transition hover:brightness-110 sm:px-4 sm:text-sm"
                  style={{ ...CUT_SM, background: ACCENT }}
                >
                  보유 재화 입력
                </button>
                <button
                  type="button"
                  onClick={handleGoFarmingCalculator}
                  className="min-h-11 border border-ef-line bg-ef-card px-3 py-2.5 text-xs font-black text-ef-accent-soft transition hover:border-ef-accent/40 sm:px-4 sm:text-sm"
                  style={CUT_SM}
                >
                  파밍 계산기로 이동
                </button>
                <Link
                  href="/"
                  onClick={handleGoHome}
                  className="col-span-2 flex min-h-11 items-center justify-center border border-ef-line bg-ef-card px-4 py-2.5 text-xs font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft sm:col-auto sm:text-sm"
                  style={CUT_SM}
                >
                  홈으로
                </Link>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
            {dashboardStats.map((item) => (
              <div
                key={item.label}
                className="min-w-0 border border-ef-line bg-ef-card2 p-3 sm:p-3.5"
                style={CUT_SM}
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ef-muted">
                  {item.label}
                </p>
                <p className="mt-2 truncate font-mono text-xl font-black tabular-nums text-white sm:text-2xl">
                  {item.value}
                </p>
                <p className="mt-1 line-clamp-1 text-[11px] text-ef-muted">
                  {item.sub}
                </p>
              </div>
            ))}
          </section>

          <nav className="sticky top-2 z-40 border border-ef-line bg-ef-bg/95 p-2 backdrop-blur lg:hidden" style={CUT_SM}>
            <div className="mobile-scroll-row">
              {sectionLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 shrink-0 items-center border border-ef-line bg-ef-card px-3 font-mono text-[11px] font-black uppercase tracking-wide text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
                  style={CUT_SM}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <section
            id="select"
            className="relative scroll-mt-24 overflow-hidden border border-ef-line bg-ef-card2"
            style={CUT}
          >
            <span className="absolute inset-x-0 top-0 z-20 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
            <div className="relative min-h-[390px] overflow-hidden bg-black sm:min-h-[460px] md:min-h-[520px] xl:min-h-[580px]">
              {selectedOperator && selectedOperatorImage ? (
                <Image
                  src={selectedOperatorImage}
                  alt={selectedOperator.name}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain object-center"
                />
              ) : (
                <div className="absolute inset-4 flex items-center justify-center border border-ef-line bg-ef-card text-sm font-semibold text-ef-muted" style={CUT_SM}>
                  오퍼레이터를 선택해 주세요
                </div>
              )}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.68)),linear-gradient(90deg,rgba(0,0,0,0.68),transparent_58%,rgba(0,0,0,0.38))]" />

              <div className="absolute left-4 top-4 z-20 sm:left-5 sm:top-5">
                <button
                  type="button"
                  onClick={() =>
                    setSelectPanel({
                      kind: "operator",
                      title: "오퍼레이터 선택",
                      selectedSlug: selectedOperatorSlug,
                    })
                  }
                  className="inline-flex h-10 items-center justify-center border border-ef-line bg-black/65 px-3 font-mono text-[11px] font-black uppercase tracking-wide text-ef-accent-soft backdrop-blur transition hover:border-ef-accent/50 hover:bg-black/80 sm:h-11 sm:px-4"
                  style={CUT_SM}
                >
                  오퍼레이터 선택
                </button>
              </div>

              <div className="hidden">
                <button
                  type="button"
                  onClick={() => setIsOwnedPanelOpen(true)}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-yellow-500/25 bg-black/65 px-3 text-xs font-black text-yellow-200 backdrop-blur transition hover:border-yellow-400/50 hover:bg-black/80 sm:h-11 sm:px-4 sm:text-sm"
                >
                  보유 재화 입력
                </button>

                <button
                  type="button"
                  onClick={handleGoFarmingCalculator}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-yellow-500/25 bg-black/65 px-3 text-xs font-black text-yellow-200 backdrop-blur transition hover:border-yellow-400/50 hover:bg-black/80 sm:h-11 sm:px-4 sm:text-sm"
                >
                  재화 파밍 계산기 이동
                </button>
              </div>

              <div className="absolute bottom-4 right-4 z-20 sm:bottom-5 sm:right-5">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedOperatorSlug) {
                      writeSimulatorSelectOperatorContext(selectedOperatorSlug);
                    }

                    setSelectPanel({
                      kind: "weapon",
                      title: "무기 선택",
                      selectedSlug: selectedWeaponSlug,
                    });
                  }}
                  className="group grid w-[112px] gap-2 border border-ef-line bg-black/65 p-2.5 text-left text-white backdrop-blur transition hover:border-ef-accent/50 hover:bg-black/80 sm:w-[180px] sm:p-3"
                  style={CUT_SM}
                >
                  <div className="relative h-[78px] overflow-hidden border border-ef-line bg-black sm:h-[120px]" style={CUT_SM}>
                    {selectedWeapon && selectedWeaponImage ? (
                      <Image
                        src={selectedWeaponImage}
                        alt={selectedWeapon.name}
                        fill
                        sizes="180px"
                        className="object-contain p-3"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold text-ef-muted">
                        무기 없음
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: PRIMARY }}>
                      Weapon
                    </p>
                    <h3 className="mt-1 line-clamp-1 text-base font-black text-white">
                      {selectedWeapon?.name ?? "무기 선택"}
                    </h3>
                  </div>
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-[156px] z-20 max-w-[520px] sm:bottom-6 sm:left-6 sm:right-auto">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: PRIMARY }}>
                  Operator
                </p>
                <h1 className="mt-2 break-keep text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl">
                  {selectedOperator?.name ?? "오퍼레이터 미선택"}
                </h1>
                <p className="mt-1 line-clamp-1 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ef-muted sm:text-sm sm:tracking-[0.18em]">
                  {selectedOperator?.enName ?? "오퍼레이터 선택"}
                </p>
              </div>
            </div>
          </section>


          {selectPanel ? (
            <CommonSelectPanel
              kind={selectPanel.kind}
              title={selectPanel.title}
              operators={operators}
              weapons={weapons}
              gears={[]}
              selectedSlug={
                selectPanel.kind === "operator"
                  ? selectedOperatorSlug
                  : selectedWeaponSlug
              }
              requiredWeaponType={
                selectPanel.kind === "weapon"
                  ? getSelectedOperatorWeaponType(selectedOperator)
                  : undefined
              }
              onClose={() => setSelectPanel(null)}
              onSelectOperator={(slug) => {
                handleOperatorSelect(slug);
                setSelectPanel(null);
              }}
              onSelectWeapon={(slug) => {
                handleWeaponSelect(slug);
                setSelectPanel(null);
              }}
            />
          ) : null}

          {isOwnedPanelOpen ? (
            <OwnedMaterialBulkModal
              values={ownedMaterialItems}
              onClose={() => setIsOwnedPanelOpen(false)}
              onChange={handleOwnedMaterialChange}
            />
          ) : null}

          <div className="grid items-start gap-3 lg:gap-5 xl:grid-cols-[560px_minmax(0,1fr)]">
            <div id="growth" className="grid scroll-mt-24 auto-rows-max content-start gap-3 self-start lg:gap-6">
              <InfoPanel
                title="성장 설정"
                summary={
                  growthTabs.find((item) => item.key === growthTab)?.summary
                }
              >
                <GrowthTabs
                  tabs={growthTabs}
                  value={growthTab}
                  onChange={setGrowthTab}
                >
                  <div className="grid gap-4">
                    <GrowthSection title="레벨" summary={levelSummary}>
                      {selectedOperator || selectedWeapon ? (
                        <SimulatorLevelPanel
                          operatorCurrentLevel={safeOperatorCurrentLevel}
                          operatorTargetLevel={safeOperatorTargetLevel}
                          operatorCurrentOptions={OPERATOR_CURRENT_LEVEL_OPTIONS}
                          operatorTargetOptions={selectedOperator
                            ? OPERATOR_TARGET_LEVEL_OPTIONS.filter(
                                (level: OperatorTargetLevel) =>
                                  level > safeOperatorCurrentLevel,
                              )
                            : []}
                          weaponCurrentLevel={safeWeaponCurrentLevel}
                          weaponTargetLevel={safeWeaponTargetLevel}
                          weaponCurrentOptions={WEAPON_CURRENT_LEVEL_OPTIONS}
                          weaponTargetOptions={selectedWeapon
                            ? WEAPON_TARGET_LEVEL_OPTIONS.filter(
                                (level: WeaponTargetLevel) =>
                                  level > safeWeaponCurrentLevel,
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
                        <div className="text-sm text-ef-muted">
                          오퍼레이터 또는 무기를 먼저 선택해 주세요.
                        </div>
                      )}
                    </GrowthSection>

                    <GrowthSection title="정예화" summary={eliteSummary}>
                      {selectedOperator ? (
                        <RangeSelector
                          current={eliteRange.current}
                          target={eliteRange.target}
                          stages={eliteStages}
                          getLabel={(stage) =>
                            stage === 0 ? "0단계" : `${stage}단계`
                          }
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
                        <div className="text-sm text-ef-muted">
                          오퍼레이터를 먼저 선택해 주세요.
                        </div>
                      )}
                    </GrowthSection>

                    <GrowthSection
                      title="무기 돌파"
                      summary={weaponBreakthroughSummary}
                    >
                      {!selectedWeapon ? (
                        <div className="text-sm text-ef-muted">
                          무기를 먼저 선택해 주세요.
                        </div>
                      ) : weaponBreakthroughItems.length ? (
                        <RangeSelector
                          current={weaponBreakthroughRange.current}
                          target={weaponBreakthroughRange.target}
                          stages={weaponBreakthroughStages}
                          getLabel={(stage) =>
                            stage === 0 ? "0단계" : `${stage}단계`
                          }
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
                        <div className="text-sm text-ef-muted">
                          등록된 무기 돌파 데이터가 없습니다.
                        </div>
                      )}
                    </GrowthSection>
                  </div>

              <GrowthSection title="전투 스킬" summary={combatSummary}>
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
                  <div className="text-sm text-ef-muted">
                    오퍼레이터를 먼저 선택해 주세요.
                  </div>
                )}
              </GrowthSection>

              <GrowthSection title="재능 스킬" summary={talentSummary}>
                {selectedOperator ? (
                  <SimulatorStageSection
                    emptyText="등록된 재능 스킬 데이터가 없습니다."
                    items={talentGroups.map((group: TalentGroup) => ({
                      id: group.id,
                      title: group.name,
                      icon: group.icon,
                      currentStage: talentRanges[group.id]?.current ?? 0,
                      targetStage: talentRanges[group.id]?.target ?? 0,
                      maxStage: group.maxStage,
                      getStageLabel: (stage: number) =>
                        stage === 0 ? "0단계" : `${stage}단계`,
                      onChangeCurrent: (stage: number) =>
                        handleTalentCurrentChange(group.id, stage),
                      onChangeTarget: (stage: number) =>
                        handleTalentTargetChange(group.id, stage),
                    }))}
                  />
                ) : (
                  <div className="text-sm text-ef-muted">
                    오퍼레이터를 먼저 선택해 주세요.
                  </div>
                )}
              </GrowthSection>

              <GrowthSection title="인프라 스킬" summary={infrastructureSummary}>
                {selectedOperator ? (
                  <SimulatorStageSection
                    emptyText="등록된 인프라 스킬 데이터가 없습니다."
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
                              ? cleanInfrastructureLabel(
                                  getInfrastructureTierLabel(
                                    selectedOperator,
                                    group.id,
                                    currentStage
                                  )
                                )
                              : undefined,
                          targetRightLabel:
                            targetStage > 0
                              ? cleanInfrastructureLabel(
                                  getInfrastructureTierLabel(
                                    selectedOperator,
                                    group.id,
                                    targetStage
                                  )
                                )
                              : undefined,
                          getStageLabel: (stage: number) =>
                            stage === 0
                              ? "0단계"
                              : cleanInfrastructureLabel(
                                  getInfrastructureTierLabel(
                                    selectedOperator,
                                    group.id,
                                    stage
                                  )
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
                  <div className="text-sm text-ef-muted">
                    오퍼레이터를 먼저 선택해 주세요.
                  </div>
                )}
              </GrowthSection>

              <GrowthSection title="신뢰도 보너스" summary={trustSummary}>
                {selectedOperator ? (
                  visibleTrustStageInfos.length ? (
                    <RangeSelector
                      current={trustRange.current}
                      target={trustRange.target}
                      stages={trustStages}
                      getLabel={(stage) =>
                        stage === 0 ? "0단계" : `${stage}단계`
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
                    <div className="text-sm text-ef-muted">
                      등록된 신뢰도 보너스 데이터가 없습니다.
                    </div>
                  )
                ) : (
                  <div className="text-sm text-ef-muted">
                    오퍼레이터를 먼저 선택해 주세요.
                  </div>
                )}
              </GrowthSection>
                </GrowthTabs>
              </InfoPanel>
            </div>

            <div id="materials" className="grid scroll-mt-24 gap-3 lg:gap-6">
              <InfoPanel
                title="필요 재화"
                summary={
                  materialTabs.find((item) => item.key === materialTab)?.summary
                }
              >
                <MaterialTabs
                  tabs={materialTabs}
                  value={materialTab}
                  onChange={setMaterialTab}
                />
              </InfoPanel>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
