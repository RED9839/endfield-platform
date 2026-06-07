"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Checkbox from "@/app/components/common/Checkbox";
import NumberInput from "@/app/components/common/NumberInput";
import {
  ADVANCED_BOX_NAME,
  CARD_BG,
  FARMABLE_MATERIAL_NAMES,
  MATERIALS,
  MATERIAL_ORDER,
  ORIGINIUM_COST_TABLE,
  RECOVERY_ITEMS,
  YELLOW_BORDER,
  YELLOW_BORDER_SOFT,
  YELLOW_MAIN,
  type DiscountKey,
} from "@/data/farming/farm-data";
import {
  calculateFarming,
  type DiscountStock,
  type FarmingSettings,
  type MaterialAmount,
  type RecoveryState,
} from "@/lib/farming/calculate-farming";
import {
  clearFarmingTransferStorage,
  readFarmingTransferFromStorage,
  readFarmingTransferFromUrl,
  saveFarmingTransferPayload,
} from "@/lib/farming/farming-transfer";
import { applyOwnedMaterials, type OwnedMaterialMap } from "@/app/simulator/_lib/simulator-utils";

const FARMING_STATE_KEY = "endfield:farming-page-state";
const USER_MATERIAL_INVENTORY_API = "/api/user/material-inventory";
const YELLOW_TEXT = "#ffdc70";
const PANEL_BG = "#05070b";

type ModalMode = "target" | "owned" | null;

type FarmingPageState = {
  targets: MaterialAmount[];
  ownedMaterials: MaterialAmount[];
  settings: FarmingSettings;
};

const DEFAULT_RECOVERY: RecoveryState = {
  "이성 회복제": 0,
  "응급 이성 강화제": 0,
  "응급 이성 농축액": 0,
  "이성 정수 약제": 0,
};

const DEFAULT_DISCOUNTS: DiscountStock[] = [
  { name: "고급 인지 매개체", enabled: false, stock: 0 },
  { name: "무기 점검 세트", enabled: false, stock: 0 },
  { name: "탈로시안 화폐", enabled: false, stock: 0 },
  { name: "고급 작전 기록", enabled: false, stock: 0 },
];

const DISCOUNT_MAX_STOCK: Record<DiscountKey, number> = {
  "고급 인지 매개체": 5,
  "무기 점검 세트": 8,
  "탈로시안 화폐": 5,
  "고급 작전 기록": 5,
};

const DEFAULT_SETTINGS: FarmingSettings = {
  useDailyQuest: true,
  useWeeklyQuest: true,
  hasMonthlyCard: false,
  dailyOriginiumRefreshCount: 0,
  useToken: false,
  useAllToken: false,
  ownedToken: 0,
  advancedBoxCount: 0,
  recovery: DEFAULT_RECOVERY,
  discounts: DEFAULT_DISCOUNTS,
};

const HIDDEN_OWNED_MATERIALS = new Set([
  "오로베릴",
  "무기고 징표",
  "작전 경험",
  "통행증 경험치",
]);

function materialImage(name: string) {
  return `/materials/${name}.webp`;
}

function orderIndex(name: string) {
  const index = MATERIAL_ORDER.indexOf(name);
  return index === -1 ? 9999 : index;
}

function sortMaterials<T extends { name: string }>(items: T[]) {
  return [...items].sort((a, b) => orderIndex(a.name) - orderIndex(b.name));
}

function normalizeItems(items: MaterialAmount[]) {
  const map = new Map<string, number>();

  items.forEach((item) => {
    const name = item.name.trim();
    const amount = Number(item.amount);
    if (!name || !Number.isFinite(amount) || amount <= 0) return;
    map.set(name, (map.get(name) ?? 0) + amount);
  });

  return sortMaterials(
    Array.from(map.entries()).map(([name, amount]) => ({ name, amount })),
  );
}

function normalizeFarmableTargets(items: MaterialAmount[]) {
  return normalizeItems(items).filter((item) =>
    FARMABLE_MATERIAL_NAMES.includes(item.name),
  );
}

function normalizeSettings(settings?: Partial<FarmingSettings>): FarmingSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(settings ?? {}),
    useWeeklyQuest: settings?.useWeeklyQuest ?? DEFAULT_SETTINGS.useWeeklyQuest,
    recovery: {
      ...DEFAULT_RECOVERY,
      ...(settings?.recovery ?? {}),
    },
    discounts: settings?.discounts ?? DEFAULT_DISCOUNTS,
  };
}

function readState(): FarmingPageState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(FARMING_STATE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<FarmingPageState>;

    return {
      targets: normalizeFarmableTargets(parsed.targets ?? []),
      ownedMaterials: normalizeItems(parsed.ownedMaterials ?? []),
      settings: normalizeSettings(parsed.settings),
    };
  } catch {
    return null;
  }
}

function saveState(state: FarmingPageState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FARMING_STATE_KEY, JSON.stringify(state));
}

function clearState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FARMING_STATE_KEY);
  clearFarmingTransferStorage();
}

function materialAmountsToRecord(items: MaterialAmount[]) {
  return normalizeItems(items).reduce<Record<string, number>>((acc, item) => {
    acc[item.name] = item.amount;
    return acc;
  }, {});
}

function recordToMaterialAmounts(materials: Record<string, number>) {
  return normalizeItems(
    Object.entries(materials).map(([name, amount]) => ({
      name,
      amount: Number(amount ?? 0),
    })),
  );
}

function materialAmountsToOwnedMap(items: MaterialAmount[]): OwnedMaterialMap {
  return normalizeItems(items).reduce<OwnedMaterialMap>((acc, item) => {
    acc[item.name] = item.amount;
    return acc;
  }, {});
}

function applyExpOwnedMaterialsToTargets(
  targetItems: MaterialAmount[],
  ownedItems: MaterialAmount[],
): MaterialAmount[] {
  const ownedMap = materialAmountsToOwnedMap(ownedItems);
  const deficitItems = applyOwnedMaterials(
    normalizeFarmableTargets(targetItems).map((item) => ({
      name: item.name,
      count: item.amount,
      icon: materialImage(item.name),
    })),
    ownedMap,
  );

  return normalizeFarmableTargets(
    deficitItems
      .filter((item) => Number(item.lacking ?? 0) > 0)
      .map((item) => ({
        name: item.name,
        amount: Number(item.lacking ?? 0),
      })),
  );
}

async function readUserMaterialInventory() {
  try {
    const response = await fetch(USER_MATERIAL_INVENTORY_API, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      ok?: boolean;
      materials?: Record<string, number> | null;
    };
    return payload.materials ? recordToMaterialAmounts(payload.materials) : null;
  } catch {
    return null;
  }
}

function saveUserMaterialInventory(items: MaterialAmount[]) {
  fetch(USER_MATERIAL_INVENTORY_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materials: materialAmountsToRecord(items) }),
  }).catch(() => {});
}

function getRecoverySanity(settings: FarmingSettings) {
  return RECOVERY_ITEMS.reduce((sum, item) => {
    return sum + (settings.recovery[item.name] ?? 0) * item.sanity;
  }, 0);
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-[24px] bg-[#05070b] p-4 shadow-[0_18px_64px_rgba(0,0,0,0.30)]"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,210,74,0.08),transparent_30%)]" />
      <div className="relative mb-3 flex items-end justify-between gap-3">
        <div>
          <h2
            className="text-lg font-black tracking-[-0.04em]"
            style={{ color: YELLOW_MAIN }}
          >
            {title}
          </h2>
        </div>
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div
      className="min-h-[104px] rounded-[22px] border bg-[linear-gradient(180deg,rgba(9,13,20,0.96),rgba(0,0,0,0.82))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
      style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
    >
      <div className="text-[10px] font-black tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div
        className="mt-3 text-3xl font-black leading-none tracking-[-0.06em]"
        style={{ color: YELLOW_MAIN }}
      >
        {Math.max(0, Math.ceil(value)).toLocaleString()}
        {suffix ? <span className="ml-1 text-sm">{suffix}</span> : null}
      </div>
    </div>
  );
}

function MaterialBulkModal({
  mode,
  values,
  onClose,
  onChange,
}: {
  mode: "target" | "owned";
  values: MaterialAmount[];
  onClose: () => void;
  onChange: (name: string, amount: number) => void;
}) {
  const [search, setSearch] = useState("");

  const valueMap = useMemo(() => {
    const map = new Map<string, number>();
    values.forEach((item) => map.set(item.name, item.amount));
    return map;
  }, [values]);

  const list = useMemo(() => {
    const baseNames =
      mode === "target"
        ? FARMABLE_MATERIAL_NAMES
        : MATERIALS.map((item) => item.name).filter(
            (name) => !HIDDEN_OWNED_MATERIALS.has(name),
          );
    const q = search.trim().toLowerCase();

    return sortMaterials(
      baseNames
        .filter((name) => (q ? name.toLowerCase().includes(q) : true))
        .map((name) => ({ name, amount: valueMap.get(name) ?? 0 })),
    );
  }, [mode, search, valueMap]);

  const isTarget = mode === "target";

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="flex h-[92vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-[#05070b] shadow-[0_22px_90px_rgba(0,0,0,0.62)] sm:h-[90vh] sm:w-[min(1180px,calc(100vw-2rem))] sm:rounded-[32px]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-7 sm:py-5"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div>
            <p
              className="text-[11px] font-black tracking-[0.24em]"
              style={{ color: YELLOW_TEXT }}
            >
              {isTarget ? "목표 재화" : "보유 재화"}
            </p>
            <h3 className="mt-1 text-xl font-black tracking-[-0.05em] text-white sm:mt-2 sm:text-3xl">
              {isTarget ? "목표 재화 입력" : "보유 재화 입력"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-xl font-black transition hover:bg-[#0b1018] sm:h-12 sm:w-12 sm:rounded-full sm:text-2xl"
            style={{ border: `1px solid ${YELLOW_BORDER}`, color: YELLOW_TEXT }}
            aria-label="입력창 닫기"
          >
            ×
          </button>
        </div>

        <div
          className="shrink-0 px-4 py-3 sm:px-7 sm:py-5"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="재화 검색"
            className="h-10 w-full rounded-xl border border-white/10 bg-[#071019] px-4 text-xs font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/40 sm:h-12 sm:rounded-2xl sm:text-sm"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-7 sm:py-6">
          <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
            {list.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-[#090d14] p-4"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/55"
                    style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                  >
                    <Image
                      src={materialImage(item.name)}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black" style={{ color: YELLOW_TEXT }}>
                      {item.name}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-500">
                      {isTarget ? "목표 수량" : "현재 보유량"}
                    </div>
                  </div>
                </div>
                <NumberInput
                  value={item.amount}
                  onChange={(value) => onChange(item.name, value)}
                  min={0}
                  className="mt-4 h-11 rounded-xl border-yellow-500/15 bg-black text-yellow-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function MobileSettingsModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="flex h-[86vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-[#05070b] shadow-[0_22px_90px_rgba(0,0,0,0.62)] sm:h-auto sm:max-h-[88vh] sm:w-[min(760px,calc(100vw-2rem))] sm:rounded-[28px]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div className="min-w-0">
            <p
              className="text-[10px] font-black tracking-[0.24em] sm:text-[11px]"
              style={{ color: YELLOW_TEXT }}
            >
              FARMING SETTINGS
            </p>
            <h3 className="mt-1 truncate text-xl font-black text-white sm:text-2xl">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-xl font-black transition hover:bg-[#0b1018]"
            style={{ border: `1px solid ${YELLOW_BORDER}`, color: YELLOW_TEXT }}
            aria-label="설정창 닫기"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function SmallMaterialRow({ item }: { item: MaterialAmount }) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-2xl bg-[#090d14] p-3"
      style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <Image src={materialImage(item.name)} alt={item.name} fill sizes="40px" className="object-contain p-1" />
        </div>
        <span className="truncate text-sm font-bold text-zinc-200">{item.name}</span>
      </div>
      <span className="text-sm font-black" style={{ color: YELLOW_TEXT }}>
        {item.amount.toLocaleString()}
      </span>
    </div>
  );
}

function FarmingCalculatorClientContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [targets, setTargets] = useState<MaterialAmount[]>([]);
  const [ownedMaterials, setOwnedMaterials] = useState<MaterialAmount[]>([]);
  const [settings, setSettings] = useState<FarmingSettings>(DEFAULT_SETTINGS);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [mobileSettingsModal, setMobileSettingsModal] = useState<"token" | "sanity" | null>(null);

  const [discountOpen, setDiscountOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restoreFarmingState() {
      const fromUrl = readFarmingTransferFromUrl(new URLSearchParams(window.location.search));
      const fromStorage = readFarmingTransferFromStorage();
      const saved = readState();
      const userOwnedMaterials = await readUserMaterialInventory();

      if (cancelled) return;

      const requiredRaw = fromUrl.requiredMaterials.length > 0
        ? fromUrl.requiredMaterials
        : fromStorage?.requiredMaterials.length
          ? fromStorage.requiredMaterials
          : saved?.targets ?? [];

      const owned = fromUrl.ownedMaterials.length > 0
        ? fromUrl.ownedMaterials
        : fromStorage?.ownedMaterials.length
          ? fromStorage.ownedMaterials
          : saved?.ownedMaterials.length
            ? saved.ownedMaterials
            : userOwnedMaterials ?? [];

      setTargets(normalizeFarmableTargets(requiredRaw));
      setOwnedMaterials(normalizeItems(owned));
      setSettings(normalizeSettings(saved?.settings));
      setStorageReady(true);
    }

    restoreFarmingState();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    if (!storageReady) return;
    saveState({ targets, ownedMaterials, settings });
    saveFarmingTransferPayload({
      requiredMaterials: normalizeFarmableTargets(targets),
      ownedMaterials,
    });
    saveUserMaterialInventory(ownedMaterials);
  }, [storageReady, targets, ownedMaterials, settings]);

  const effectiveTargets = useMemo(
    () => applyExpOwnedMaterialsToTargets(targets, ownedMaterials),
    [targets, ownedMaterials],
  );

  const result = useMemo(
    () =>
      calculateFarming({
        targets: effectiveTargets,
        ownedMaterials: [],
        settings,
      }),
    [effectiveTargets, settings],
  );
  const recoverySanity = Math.max(result.recoverySanity ?? getRecoverySanity(settings), 0);
  const effectiveRequiredSanity = Math.max(result.netRequiredSanity ?? result.totalRequiredSanity - recoverySanity, 0);
  const farmingDashboardStats = [
    {
      label: "목표 재화",
      value: normalizeFarmableTargets(targets).length.toLocaleString(),
      sub: "파밍 가능한 재화만 계산에 반영됩니다",
    },
    {
      label: "보유 재화",
      value: normalizeItems(ownedMaterials).length.toLocaleString(),
      sub: "성장 시뮬레이션과 공유됩니다",
    },
    {
      label: "추천 스테이지",
      value: result.stagePlans.length.toLocaleString(),
      sub: "필요 이성 기준으로 산출됩니다",
    },
    {
      label: "예상 소요일",
      value: Math.max(0, Math.ceil(result.estimatedDays)).toLocaleString(),
      sub: "일일 회복량과 설정값을 반영합니다",
    },
  ];

  function updateSettings(next: Partial<FarmingSettings>) {
    setSettings((prev) => ({
      ...prev,
      ...next,
      recovery: next.recovery ?? prev.recovery,
      discounts: next.discounts ?? prev.discounts,
    }));
  }

  function setMaterialValue(
    setter: React.Dispatch<React.SetStateAction<MaterialAmount[]>>,
    name: string,
    amount: number,
  ) {
    setter((prev) => {
      const next = new Map(prev.map((item) => [item.name, item.amount]));
      if (amount <= 0) next.delete(name);
      else next.set(name, amount);
      return sortMaterials(
        Array.from(next.entries()).map(([itemName, itemAmount]) => ({
          name: itemName,
          amount: itemAmount,
        })),
      );
    });
  }

  function moveToSimulator() {
    saveState({ targets, ownedMaterials, settings });
    saveFarmingTransferPayload({
      requiredMaterials: normalizeFarmableTargets(targets),
      ownedMaterials,
    });
    router.push("/simulator");
  }

  function resetAndGoHome() {
    clearState();
    saveUserMaterialInventory(ownedMaterials);
    window.location.assign("/");
  }


  const tokenSettingsContent = (
              <div className="space-y-3">
                <div
                  className="flex items-center gap-3 rounded-2xl border p-3"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}`, background: CARD_BG }}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                    <Image src={materialImage(ADVANCED_BOX_NAME)} alt={ADVANCED_BOX_NAME} fill sizes="44px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-white">{ADVANCED_BOX_NAME}</div>
                  </div>
                  <div className="w-[96px]">
                    <NumberInput value={settings.advancedBoxCount} onChange={(value) => updateSettings({ advancedBoxCount: value })} min={0} />
                  </div>
                </div>

                <div className="grid gap-3 rounded-2xl bg-black p-4" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                  <Checkbox checked={settings.useToken} onChange={(checked) => updateSettings({ useToken: checked, useAllToken: checked ? settings.useAllToken : false })} label="통합 징표 사용" />
                  <Checkbox checked={settings.useAllToken} onChange={(checked) => updateSettings({ useAllToken: checked, useToken: checked ? true : settings.useToken })} label="보유 통합 징표 전부 사용" />
                </div>

                <div
                  className="flex items-center gap-3 rounded-2xl border p-3"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}`, background: CARD_BG }}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                    <Image src={materialImage("통합 징표")} alt="통합 징표" fill sizes="44px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1"><div className="text-sm font-bold text-white">보유 통합 징표</div></div>
                  <div className="w-[96px]"><NumberInput value={settings.ownedToken} onChange={(value) => updateSettings({ ownedToken: value })} min={0} /></div>
                </div>

                <div className="rounded-2xl border" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}`, background: CARD_BG }}>
                  <button type="button" onClick={() => setDiscountOpen((prev) => !prev)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                    <span className="block text-sm font-black text-white">할인 품목 설정</span>
                    <span style={{ color: YELLOW_MAIN }}>{discountOpen ? "▲" : "▼"}</span>
                  </button>
                  {discountOpen ? (
                    <div className="grid gap-3 border-t border-yellow-500/10 p-4">
                      {settings.discounts.map((discount, index) => (
                        <div key={discount.name} className="grid grid-cols-[minmax(0,1fr)_86px] items-center gap-3 rounded-2xl border p-3" style={{ borderColor: YELLOW_BORDER_SOFT, background: PANEL_BG }}>
                          <Checkbox checked={discount.enabled} onChange={(checked) => {
                            const next = [...settings.discounts];
                            next[index] = { ...next[index], enabled: checked, stock: checked ? next[index].stock : 0 };
                            updateSettings({ discounts: next });
                          }} label={discount.name} />
                          <NumberInput value={discount.stock} onChange={(value) => {
                            const maxStock = DISCOUNT_MAX_STOCK[discount.name] ?? 0;
                            const next = [...settings.discounts];
                            next[index] = { ...next[index], stock: Math.min(Math.max(value, 0), maxStock), enabled: value > 0 ? true : next[index].enabled };
                            updateSettings({ discounts: next });
                          }} min={0} max={DISCOUNT_MAX_STOCK[discount.name] ?? 0} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
  );

  const sanitySettingsContent = (
              <div className="space-y-3">
                <div className="grid gap-3 rounded-2xl bg-black p-4" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                  <Checkbox checked={settings.useDailyQuest} onChange={(checked) => updateSettings({ useDailyQuest: checked })} label="일일 업무 보상 포함" />
                  <Checkbox checked={settings.useWeeklyQuest === true} onChange={(checked) => updateSettings({ useWeeklyQuest: checked })} label="주간 업무 보상 포함" />
                  <Checkbox checked={settings.hasMonthlyCard} onChange={(checked) => updateSettings({ hasMonthlyCard: checked })} label="월정액 구매 중" />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border p-3" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}`, background: CARD_BG }}>
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                    <Image src={materialImage("파생 오리지늄")} alt="파생 오리지늄" fill sizes="44px" className="object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white">파생 오리지늄 회복</div>
                    <div className="text-xs text-zinc-500">소모 {ORIGINIUM_COST_TABLE.slice(0, settings.dailyOriginiumRefreshCount).reduce((sum, value) => sum + value, 0)}개 / 일</div>
                  </div>
                  <div className="w-[96px]"><NumberInput value={settings.dailyOriginiumRefreshCount} onChange={(value) => updateSettings({ dailyOriginiumRefreshCount: Math.min(value, ORIGINIUM_COST_TABLE.length) })} min={0} max={ORIGINIUM_COST_TABLE.length} /></div>
                </div>

                {RECOVERY_ITEMS.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}>
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                      <Image src={materialImage(item.name)} alt={item.name} fill sizes="44px" className="object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-xs text-zinc-500">{item.sanity} 이성 회복</div>
                    </div>
                    <div className="w-[96px]"><NumberInput value={settings.recovery[item.name] ?? 0} onChange={(value) => updateSettings({ recovery: { ...settings.recovery, [item.name]: value } })} min={0} /></div>
                  </div>
                ))}
              </div>
  );

  return (
    <main className="min-h-screen bg-[#03060b] bg-[radial-gradient(circle_at_top_left,rgba(255,210,74,0.11),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.08),transparent_28%),linear-gradient(180deg,#03060b_0%,#05070b_54%,#020305_100%)] text-white">
      <div className="mx-auto w-full max-w-[1840px] px-3 pb-3 pt-[76px] sm:px-4 md:px-6 md:py-5 xl:px-8 xl:py-8">
        <section
          className="relative overflow-hidden rounded-[24px] bg-[#05070b] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.42)] sm:rounded-[32px] sm:p-6"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,210,74,0.12),transparent_34%),radial-gradient(circle_at_90%_0%,rgba(255,255,255,0.08),transparent_28%)]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black tracking-[0.22em] sm:text-[11px] sm:tracking-[0.24em]" style={{ color: YELLOW_TEXT }}>
                엔드필드 지원 플랫폼
              </p>
              <h1 className="mt-2 truncate text-2xl font-black tracking-[-0.06em] sm:text-4xl" style={{ color: YELLOW_TEXT }}>
                재화 파밍 계산기
              </h1>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 sm:gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => setModalMode("target")}
                className="rounded-2xl bg-[#ffd24a] px-4 py-2.5 text-xs font-black text-black shadow-[0_0_24px_rgba(255,210,74,0.18)] transition hover:brightness-110 sm:text-sm"
              >
                목표 재화 입력
              </button>
              <button
                type="button"
                onClick={() => setModalMode("owned")}
                className="rounded-2xl bg-black/70 px-4 py-2.5 text-xs font-black text-yellow-200 transition hover:bg-black sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER}` }}
              >
                보유 재화 입력
              </button>
              <button
                type="button"
                onClick={moveToSimulator}
                className="rounded-2xl bg-black/70 px-4 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-black hover:text-yellow-200 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER}` }}
              >
                성장 시뮬레이션 이동
              </button>
              <button
                type="button"
                onClick={resetAndGoHome}
                className="rounded-2xl bg-black/70 px-4 py-2.5 text-xs font-bold text-zinc-200 transition hover:bg-black hover:text-yellow-200 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER}` }}
              >
                홈으로
              </button>
            </div>
          </div>
        </section>

        <section className="mt-3 grid gap-3 sm:grid-cols-2 lg:mt-5 xl:grid-cols-4">
          {farmingDashboardStats.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] bg-black/45 p-4 shadow-[0_12px_46px_rgba(0,0,0,0.24)] backdrop-blur"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <p className="text-[10px] font-black tracking-[0.24em] text-zinc-500">
                {item.label}
              </p>
              <p className="mt-2 truncate text-2xl font-black tracking-[-0.05em] text-white">
                {item.value}
              </p>
              <p className="mt-1 line-clamp-1 text-xs font-semibold text-zinc-500">
                {item.sub}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-3 grid items-start gap-3 lg:mt-5 lg:gap-5 xl:grid-cols-[460px_minmax(0,1fr)]">
          <aside className="space-y-3 lg:sticky lg:top-5 lg:space-y-5">
            <section
              className="fixed left-3 right-3 top-3 z-50 rounded-[18px] bg-[#05070b]/95 p-2 shadow-[0_0_24px_rgba(0,0,0,0.45)] backdrop-blur lg:hidden"
              style={{ border: `1px solid ${YELLOW_BORDER}` }}
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  type="button"
                  onClick={() => setModalMode("target")}
                  className="h-9 shrink-0 rounded-xl bg-black px-3 text-[11px] font-black text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-200"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                >
                  목표 재화
                </button>

                <button
                  type="button"
                  onClick={() => setModalMode("owned")}
                  className="h-9 shrink-0 rounded-xl bg-black px-3 text-[11px] font-black text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-200"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                >
                  보유 재화
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSettingsModal("token")}
                  className="h-9 shrink-0 rounded-xl bg-black px-3 text-[11px] font-black text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-200"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                >
                  통합 징표
                </button>

                <button
                  type="button"
                  onClick={() => setMobileSettingsModal("sanity")}
                  className="h-9 shrink-0 rounded-xl bg-black px-3 text-[11px] font-black text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-200"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                >
                  이성 회복
                </button>
              </div>
            </section>

            <div className="hidden lg:block">
              <Panel title="재화 입력">
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setModalMode("target")}
                    className="rounded-xl bg-black px-3 py-2.5 text-left transition hover:bg-[#0b1018]"
                    style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                  >
                    <span className="text-[13px] font-black text-white">목표 재화 입력</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode("owned")}
                    className="rounded-xl bg-black px-3 py-2.5 text-left transition hover:bg-[#0b1018]"
                    style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                  >
                    <span className="text-[13px] font-black text-white">보유 재화 입력</span>
                  </button>
                </div>
              </Panel>
            </div>

            <div className="hidden lg:block">
              <Panel title="통합 징표 · 선택 상자">
                {tokenSettingsContent}
              </Panel>
            </div>

            <div className="hidden lg:block">
              <Panel title="이성 회복 설정">
                {sanitySettingsContent}
              </Panel>
            </div>

          </aside>

          <section className="space-y-3 lg:space-y-5">
            <Panel title="계산 결과">
              <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
                <SummaryCard label="필요 이성" value={effectiveRequiredSanity} />
                <SummaryCard label="회복제 이성" value={recoverySanity} />
                <SummaryCard label="사용 징표" value={result.usedToken} />
                <SummaryCard label="하루 회복" value={result.dailyTotalSanity} />
                <SummaryCard label="예상 소요일" value={result.estimatedDays} suffix="일" />
              </div>
            </Panel>

            <Panel title="추천 이성 소모처">
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                {result.stagePlans.length ? result.stagePlans.map((plan) => (
                  <div key={`${plan.stageId}-${plan.material}`} className="rounded-2xl bg-[#090d14] p-4" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-black" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>
                        <Image src={materialImage(plan.material)} alt={plan.material} fill sizes="44px" className="object-contain p-1" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-black text-white">{plan.material}</div>
                        <div className="truncate text-xs text-zinc-500">{plan.stageName}</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-black p-2"><div className="text-zinc-500">1회 획득</div><b style={{ color: YELLOW_TEXT }}>{plan.rewardPerRun}</b></div>
                      <div className="rounded-xl bg-black p-2"><div className="text-zinc-500">필요 횟수</div><b style={{ color: YELLOW_TEXT }}>{plan.runs}</b></div>
                      <div className="rounded-xl bg-black p-2"><div className="text-zinc-500">필요 이성</div><b style={{ color: YELLOW_TEXT }}>{plan.sanity}</b></div>
                    </div>
                  </div>
                )) : <p className="rounded-2xl bg-black p-5 text-sm text-zinc-500" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>필요한 파밍 재화가 없습니다.</p>}
              </div>
            </Panel>

            <Panel title="통합 징표 · 상자 사용 결과">
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                {result.tokenUses.length === 0 && result.advancedBoxUses.length === 0 ? (
                  <p className="rounded-2xl bg-black p-5 text-sm text-zinc-500" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>사용한 통합 징표 또는 고급 육성 선택 상자가 없습니다.</p>
                ) : (
                  <>
                    {result.advancedBoxUses.map((use) => (
                      <SmallMaterialRow key={`box-${use.material}`} item={{ name: use.material, amount: use.gained }} />
                    ))}
                    {result.tokenUses.map((use) => (
                      <SmallMaterialRow key={`token-${use.itemName}-${use.material}`} item={{ name: use.material, amount: use.amount }} />
                    ))}
                  </>
                )}
              </div>
            </Panel>

            <Panel title="부족한 재화">
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
                {result.shortage.length ? result.shortage.map((item) => <SmallMaterialRow key={item.name} item={item} />) : <p className="rounded-2xl bg-black p-5 text-sm text-zinc-500" style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}>부족한 재화가 없습니다.</p>}
              </div>
            </Panel>
          </section>
        </section>
      </div>

      {modalMode ? (
        <MaterialBulkModal
          mode={modalMode}
          values={modalMode === "target" ? targets : ownedMaterials}
          onClose={() => setModalMode(null)}
          onChange={(name, amount) => setMaterialValue(modalMode === "target" ? setTargets : setOwnedMaterials, name, amount)}
        />
      ) : null}

      {mobileSettingsModal === "token" ? (
        <MobileSettingsModal
          title="통합 징표 · 선택 상자 설정"
          onClose={() => setMobileSettingsModal(null)}
        >
          {tokenSettingsContent}
        </MobileSettingsModal>
      ) : null}

      {mobileSettingsModal === "sanity" ? (
        <MobileSettingsModal
          title="이성 회복 설정"
          onClose={() => setMobileSettingsModal(null)}
        >
          {sanitySettingsContent}
        </MobileSettingsModal>
      ) : null}
    </main>
  );
}

export default function FarmingCalculatorClient() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#03060b] text-white" />}>
      <FarmingCalculatorClientContent />
    </Suspense>
  );
}
