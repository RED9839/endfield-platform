"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  PANEL_BG,
  RECOVERY_ITEMS,
  YELLOW_BORDER,
  YELLOW_BORDER_SOFT,
  YELLOW_MAIN,
  type DiscountKey,
} from "@/data/farming/farm-data";
import {
  calculateFarmingPlan,
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

const FARMING_STATE_KEY = "endfield:farming-page-state";

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
  hasMonthlyCard: false,
  dailyOriginiumRefreshCount: 0,
  useToken: false,
  useAllToken: false,
  ownedToken: 0,
  advancedBoxCount: 0,
  recovery: DEFAULT_RECOVERY,
  discounts: DEFAULT_DISCOUNTS,
};

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
    Array.from(map.entries()).map(([name, amount]) => ({ name, amount }))
  );
}

function normalizeFarmableTargets(items: MaterialAmount[]) {
  return normalizeItems(items).filter((item) =>
    FARMABLE_MATERIAL_NAMES.includes(item.name)
  );
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
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings ?? {}),
        recovery: {
          ...DEFAULT_RECOVERY,
          ...((parsed.settings as Partial<FarmingSettings> | undefined)
            ?.recovery ?? {}),
        },
        discounts:
          (parsed.settings as Partial<FarmingSettings> | undefined)
            ?.discounts ?? DEFAULT_DISCOUNTS,
      },
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

function PanelTitle({ title }: { title: string }) {
  return (
    <div>
      <h2
        className="text-xl font-black tracking-[-0.04em]"
        style={{ color: YELLOW_MAIN }}
      >
        {title}
      </h2>
    </div>
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
      className="rounded-[22px] border p-4"
      style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}
    >
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>
      <div
        className="mt-2 text-3xl font-black leading-none"
        style={{ color: YELLOW_MAIN }}
      >
        {value.toLocaleString()}
        {suffix ? <span className="ml-1 text-base">{suffix}</span> : null}
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
        : MATERIALS.map((item) => item.name);

    const q = search.trim().toLowerCase();

    return sortMaterials(
      baseNames
        .filter((name) => (q ? name.toLowerCase().includes(q) : true))
        .map((name) => ({ name, amount: valueMap.get(name) ?? 0 }))
    );
  }, [mode, search, valueMap]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-[1180px] overflow-hidden rounded-[28px] border shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
        style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
      >
        <div className="flex items-center justify-between border-b border-yellow-500/10 px-5 py-4">
          <div>
            <h3 className="text-2xl font-black tracking-[-0.05em] text-white">
              {mode === "target" ? "목표 재화 입력" : "보유 재화 입력"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-black text-2xl text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
            style={{ borderColor: YELLOW_BORDER }}
          >
            ×
          </button>
        </div>

        <div className="border-b border-yellow-500/10 p-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="재화 검색"
            className="h-12 w-full rounded-2xl border bg-black px-4 text-sm font-bold text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400/40"
            style={{ borderColor: YELLOW_BORDER }}
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <div className="grid gap-3 lg:grid-cols-3">
            {list.map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-[minmax(0,1fr)_92px] items-center gap-3 rounded-2xl border px-3 py-3"
                style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                    style={{ borderColor: YELLOW_BORDER_SOFT }}
                  >
                    <Image
                      src={materialImage(item.name)}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">
                      {item.name}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-500">
                      {mode === "target" ? "목표 수량" : "현재 보유량"}
                    </div>
                  </div>
                </div>

                <NumberInput
                  value={item.amount}
                  onChange={(value) => onChange(item.name, value)}
                  min={0}
                  className="h-10"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FarmingCalculatorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [targets, setTargets] = useState<MaterialAmount[]>([]);
  const [ownedMaterials, setOwnedMaterials] = useState<MaterialAmount[]>([]);
  const [settings, setSettings] = useState<FarmingSettings>(DEFAULT_SETTINGS);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [targetPanelOpen, setTargetPanelOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const fromUrl = readFarmingTransferFromUrl(
        new URLSearchParams(window.location.search)
      );
      const fromStorage = readFarmingTransferFromStorage();
      const saved = readState();

      const requiredRaw =
        fromUrl.requiredMaterials.length > 0
          ? fromUrl.requiredMaterials
          : fromStorage?.requiredMaterials.length
            ? fromStorage.requiredMaterials
            : saved?.targets ?? [];

      const owned =
        fromUrl.ownedMaterials.length > 0
          ? fromUrl.ownedMaterials
          : fromStorage?.ownedMaterials.length
            ? fromStorage.ownedMaterials
            : saved?.ownedMaterials ?? [];

      setTargets(normalizeFarmableTargets(requiredRaw));
      setOwnedMaterials(normalizeItems(owned));

      if (saved?.settings) {
        setSettings(saved.settings);
      }
    };

    sync();

    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);

    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
    };
  }, [searchParams]);

  useEffect(() => {
    saveState({ targets, ownedMaterials, settings });
    saveFarmingTransferPayload({
      requiredMaterials: normalizeFarmableTargets(targets),
      ownedMaterials,
    });
  }, [targets, ownedMaterials, settings]);

  const result = useMemo(() => {
    return calculateFarmingPlan({ targets, ownedMaterials, settings });
  }, [targets, ownedMaterials, settings]);

  const setMaterialValue = (
    setter: React.Dispatch<React.SetStateAction<MaterialAmount[]>>,
    name: string,
    amount: number
  ) => {
    setter((prev) => {
      const next = new Map(prev.map((item) => [item.name, item.amount]));
      if (amount <= 0) next.delete(name);
      else next.set(name, amount);

      return sortMaterials(
        Array.from(next.entries()).map(([itemName, itemAmount]) => ({
          name: itemName,
          amount: itemAmount,
        }))
      );
    });
  };

  function updateSettings(next: Partial<FarmingSettings>) {
    setSettings((prev) => ({
      ...prev,
      ...next,
      recovery: next.recovery ?? prev.recovery,
      discounts: next.discounts ?? prev.discounts,
    }));
  }

  function resetAndGoHome() {
    clearState();
    setTargets([]);
    setOwnedMaterials([]);
    setSettings(DEFAULT_SETTINGS);
    router.push("/");
  }

  return (
    <main className="mx-auto w-full max-w-[1840px] px-4 py-8 text-white md:px-6 xl:px-8">
      <section
        className="rounded-[32px] border p-6 md:p-8"
        style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p
              className="text-[11px] font-black uppercase tracking-[0.34em]"
              style={{ color: YELLOW_MAIN }}
            >
              Endfield Data Hub
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] md:text-5xl">
              재화 파밍 계산기
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/simulator")}
              className="h-12 rounded-2xl border bg-black px-5 text-sm font-black text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
              style={{ borderColor: YELLOW_BORDER }}
            >
              성장 시뮬레이션으로 이동
            </button>

            <button
              type="button"
              onClick={resetAndGoHome}
              className="h-12 rounded-2xl border bg-black px-5 text-sm font-black text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
              style={{ borderColor: YELLOW_BORDER }}
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section
            className="rounded-[28px] border p-5"
            style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
          >
            <PanelTitle title="재화 입력" />

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => setModalMode("target")}
                className="h-12 rounded-2xl border bg-black px-4 text-sm font-black text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
                style={{ borderColor: YELLOW_BORDER }}
              >
                목표 재화 입력
              </button>

              <button
                type="button"
                onClick={() => setModalMode("owned")}
                className="h-12 rounded-2xl border bg-black px-4 text-sm font-black text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
                style={{ borderColor: YELLOW_BORDER }}
              >
                보유 재화 입력
              </button>
            </div>
          </section>

          <section
            className="rounded-[28px] border p-5"
            style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
          >
            <PanelTitle title="통합 징표 설정" />

            <div className="mt-4 space-y-3">
              <div
                className="flex items-center gap-3 rounded-2xl border p-3"
                style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}
              >
                <div
                  className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                  style={{ borderColor: YELLOW_BORDER_SOFT }}
                >
                  <Image
                    src={materialImage(ADVANCED_BOX_NAME)}
                    alt={ADVANCED_BOX_NAME}
                    fill
                    sizes="44px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">
                    {ADVANCED_BOX_NAME}
                  </div>
                  <div className="text-xs text-zinc-500">
                    1개당 원하는 고급 육성 재료 2개
                  </div>
                </div>
                <div className="w-[96px]">
                  <NumberInput
                    value={settings.advancedBoxCount}
                    onChange={(value) =>
                      updateSettings({ advancedBoxCount: value })
                    }
                    min={0}
                  />
                </div>
              </div>

              <Checkbox
                checked={settings.useToken}
                onChange={(checked) =>
                  updateSettings({
                    useToken: checked,
                    useAllToken: checked ? settings.useAllToken : false,
                  })
                }
                label="통합 징표 사용"
              />

              <Checkbox
                checked={settings.useAllToken}
                onChange={(checked) =>
                  updateSettings({
                    useAllToken: checked,
                    useToken: checked ? true : settings.useToken,
                  })
                }
                label="보유 통합 징표 전부 사용"
              />

              <div
                className="flex items-center gap-3 rounded-2xl border p-3"
                style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}
              >
                <div
                  className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                  style={{ borderColor: YELLOW_BORDER_SOFT }}
                >
                  <Image
                    src={materialImage("통합 징표")}
                    alt="통합 징표"
                    fill
                    sizes="44px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white">
                    보유 통합 징표
                  </div>
                </div>
                <div className="w-[96px]">
                  <NumberInput
                    value={settings.ownedToken}
                    onChange={(value) => updateSettings({ ownedToken: value })}
                    min={0}
                  />
                </div>
              </div>

              <div
                className="rounded-2xl border"
                style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}
              >
                <button
                  type="button"
                  onClick={() => setDiscountOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="block text-sm font-black text-white">
                    할인 품목 설정
                  </span>
                  <span style={{ color: YELLOW_MAIN }}>
                    {discountOpen ? "▲" : "▼"}
                  </span>
                </button>

                {discountOpen ? (
                  <div className="grid gap-3 border-t border-yellow-500/10 p-4">
                    {settings.discounts.map((discount, index) => (
                      <div
                        key={discount.name}
                        className="grid grid-cols-[minmax(0,1fr)_86px] items-center gap-3 rounded-2xl border p-3"
                        style={{
                          borderColor: YELLOW_BORDER_SOFT,
                          background: PANEL_BG,
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border bg-black"
                            style={{ borderColor: YELLOW_BORDER_SOFT }}
                          >
                            <Image
                              src={materialImage(discount.name)}
                              alt={discount.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                          <Checkbox
                            checked={discount.enabled}
                            onChange={(checked) => {
                              const next = [...settings.discounts];
                              next[index] = {
                                ...next[index],
                                enabled: checked,
                                stock: checked ? next[index].stock : 0,
                              };
                              updateSettings({ discounts: next });
                            }}
                            label={discount.name}
                          />
                        </div>

                        <NumberInput
                          value={discount.stock}
                          onChange={(value) => {
                            const maxStock =
                              DISCOUNT_MAX_STOCK[discount.name] ?? 0;
                            const clampedValue = Math.min(
                              Math.max(value, 0),
                              maxStock
                            );
                            const next = [...settings.discounts];
                            next[index] = {
                              ...next[index],
                              stock: clampedValue,
                              enabled:
                                clampedValue > 0 ? true : next[index].enabled,
                            };
                            updateSettings({ discounts: next });
                          }}
                          min={0}
                          max={DISCOUNT_MAX_STOCK[discount.name] ?? 0}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section
            className="rounded-[28px] border p-5"
            style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
          >
            <PanelTitle title="이성 회복 설정" />

            <div className="mt-4 space-y-3">
              <Checkbox
                checked={settings.useDailyQuest}
                onChange={(checked) =>
                  updateSettings({ useDailyQuest: checked })
                }
                label="일일 임무 보상 포함"
              />

              <Checkbox
                checked={settings.hasMonthlyCard}
                onChange={(checked) =>
                  updateSettings({ hasMonthlyCard: checked })
                }
                label="월정액 구매 중"
              />

              <div
                className="flex items-center gap-3 rounded-2xl border p-3"
                style={{ borderColor: YELLOW_BORDER_SOFT, background: CARD_BG }}
              >
                <div
                  className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                  style={{ borderColor: YELLOW_BORDER_SOFT }}
                >
                  <Image
                    src={materialImage("파생 오리지늄")}
                    alt="파생 오리지늄"
                    fill
                    sizes="44px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white">
                    파생 오리지늄 회복
                  </div>
                  <div className="text-xs text-zinc-500">
                    소모{" "}
                    {ORIGINIUM_COST_TABLE.slice(
                      0,
                      settings.dailyOriginiumRefreshCount
                    ).reduce((sum, value) => sum + value, 0)}
                    개 / 일
                  </div>
                </div>
                <div className="w-[96px]">
                  <NumberInput
                    value={settings.dailyOriginiumRefreshCount}
                    onChange={(value) =>
                      updateSettings({
                        dailyOriginiumRefreshCount: Math.min(
                          value,
                          ORIGINIUM_COST_TABLE.length
                        ),
                      })
                    }
                    min={0}
                    max={ORIGINIUM_COST_TABLE.length}
                  />
                </div>
              </div>

              {RECOVERY_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 rounded-2xl border p-3"
                  style={{
                    borderColor: YELLOW_BORDER_SOFT,
                    background: CARD_BG,
                  }}
                >
                  <div
                    className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                    style={{ borderColor: YELLOW_BORDER_SOFT }}
                  >
                    <Image
                      src={materialImage(item.name)}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {item.sanity} 이성 회복
                    </div>
                  </div>
                  <div className="w-[96px]">
                    <NumberInput
                      value={settings.recovery[item.name] ?? 0}
                      onChange={(value) =>
                        updateSettings({
                          recovery: {
                            ...settings.recovery,
                            [item.name]: value,
                          },
                        })
                      }
                      min={0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section
            className="rounded-[28px] border p-5"
            style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
          >
            <PanelTitle title="계산 결과" />

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="필요 이성" value={result.totalRequiredSanity} />
              <SummaryCard label="사용 징표" value={result.usedToken} />
              <SummaryCard label="하루 회복" value={result.dailyTotalSanity} />
              <SummaryCard
                label="예상 일수"
                value={result.estimatedDays}
                suffix="일"
              />
            </div>
          </section>

          <section
            className="rounded-[28px] border p-5"
            style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
          >
            <PanelTitle title="추천 이성 소모처" />

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {result.stagePlans.length === 0 ? (
                <div
                  className="rounded-2xl border px-4 py-5 text-sm text-zinc-500"
                  style={{
                    borderColor: YELLOW_BORDER_SOFT,
                    background: CARD_BG,
                  }}
                >
                  추가 이성 파밍이 필요 없다.
                </div>
              ) : (
                result.stagePlans.map((plan) => (
                  <article
                    key={plan.material}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: YELLOW_BORDER_SOFT,
                      background: CARD_BG,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-black"
                        style={{ borderColor: YELLOW_BORDER_SOFT }}
                      >
                        <Image
                          src={materialImage(plan.material)}
                          alt={plan.material}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-white">
                          {plan.material}
                        </div>
                        <div className="mt-1 text-sm text-zinc-500">
                          {plan.stageName}
                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          <div
                            className="rounded-xl border p-3"
                            style={{
                              borderColor: YELLOW_BORDER_SOFT,
                              background: PANEL_BG,
                            }}
                          >
                            <div className="text-xs text-zinc-500">1회 획득</div>
                            <div
                              className="mt-1 font-black"
                              style={{ color: YELLOW_MAIN }}
                            >
                              {plan.rewardPerRun}
                            </div>
                          </div>
                          <div
                            className="rounded-xl border p-3"
                            style={{
                              borderColor: YELLOW_BORDER_SOFT,
                              background: PANEL_BG,
                            }}
                          >
                            <div className="text-xs text-zinc-500">필요 횟수</div>
                            <div
                              className="mt-1 font-black"
                              style={{ color: YELLOW_MAIN }}
                            >
                              {plan.runs}
                            </div>
                          </div>
                          <div
                            className="rounded-xl border p-3"
                            style={{
                              borderColor: YELLOW_BORDER_SOFT,
                              background: PANEL_BG,
                            }}
                          >
                            <div className="text-xs text-zinc-500">필요 이성</div>
                            <div
                              className="mt-1 font-black"
                              style={{ color: YELLOW_MAIN }}
                            >
                              {plan.sanity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section
            className="rounded-[28px] border p-5"
            style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
          >
            <PanelTitle title="통합 징표 사용" />

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {result.tokenUses.length === 0 &&
              result.advancedBoxUses.length === 0 ? (
                <div
                  className="rounded-2xl border px-4 py-5 text-sm text-zinc-500"
                  style={{
                    borderColor: YELLOW_BORDER_SOFT,
                    background: CARD_BG,
                  }}
                >
                  사용한 통합 징표 또는 고급 육성 선택 상자가 없다.
                </div>
              ) : (
                <>
                  {result.tokenUses.map((use) => (
                    <div
                      key={`token-${use.itemName}`}
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: YELLOW_BORDER_SOFT,
                        background: CARD_BG,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                          style={{ borderColor: YELLOW_BORDER_SOFT }}
                        >
                          <Image
                            src={materialImage(use.material)}
                            alt={use.material}
                            fill
                            sizes="44px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-xs font-black uppercase tracking-[0.18em]"
                            style={{ color: YELLOW_MAIN }}
                          >
                            증표 교환
                          </div>
                          <div className="mt-2 text-sm font-black text-white">
                            {use.itemName}
                          </div>
                          <div className="mt-2 text-sm text-zinc-400">
                            {use.count}회 구매 / {use.amount.toLocaleString()}개 획득
                          </div>
                          <div className="mt-1 text-sm text-zinc-400">
                            사용 징표{" "}
                            <span style={{ color: YELLOW_MAIN }}>
                              {use.totalTokenCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {result.advancedBoxUses.map((use) => (
                    <div
                      key={`box-${use.material}`}
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: YELLOW_BORDER_SOFT,
                        background: CARD_BG,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                          style={{ borderColor: YELLOW_BORDER_SOFT }}
                        >
                          <Image
                            src={materialImage(use.material)}
                            alt={use.material}
                            fill
                            sizes="44px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-xs font-black uppercase tracking-[0.18em]"
                            style={{ color: YELLOW_MAIN }}
                          >
                            고급 육성 선택 상자
                          </div>
                          <div className="mt-2 text-sm font-black text-white">
                            {use.material}
                          </div>
                          <div className="mt-2 text-sm text-zinc-400">
                            상자{" "}
                            <span style={{ color: YELLOW_MAIN }}>
                              {use.boxes}
                            </span>
                            개 사용 / {use.gained}개 획득
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>

          <section
            className="rounded-[28px] border p-5"
            style={{ borderColor: YELLOW_BORDER, background: PANEL_BG }}
          >
            <button
              type="button"
              onClick={() => setTargetPanelOpen((prev) => !prev)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <PanelTitle title="목표 재화" />
              <span
                className="text-sm font-black"
                style={{ color: YELLOW_MAIN }}
              >
                {targetPanelOpen ? "▲" : "▼"}
              </span>
            </button>

            {targetPanelOpen ? (
              <div className="mt-4">
                {targets.length === 0 ? (
                  <div
                    className="rounded-2xl border px-4 py-5 text-sm text-zinc-500"
                    style={{
                      borderColor: YELLOW_BORDER_SOFT,
                      background: CARD_BG,
                    }}
                  >
                    목표 재화가 없다.
                  </div>
                ) : (
                  <div className="grid gap-3 lg:grid-cols-3">
                    {targets
                      .filter((item) =>
                        FARMABLE_MATERIAL_NAMES.includes(item.name)
                      )
                      .map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 rounded-2xl border p-3"
                          style={{
                            borderColor: YELLOW_BORDER_SOFT,
                            background: CARD_BG,
                          }}
                        >
                          <div
                            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border bg-black"
                            style={{ borderColor: YELLOW_BORDER_SOFT }}
                          >
                            <Image
                              src={materialImage(item.name)}
                              alt={item.name}
                              fill
                              sizes="44px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-black text-white">
                              {item.name}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: YELLOW_MAIN }}
                            >
                              {item.amount.toLocaleString()}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setMaterialValue(setTargets, item.name, 0)
                            }
                            className="text-zinc-500 transition hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </section>
      </section>

      {modalMode ? (
        <MaterialBulkModal
          mode={modalMode}
          values={modalMode === "target" ? targets : ownedMaterials}
          onClose={() => setModalMode(null)}
          onChange={(name, amount) =>
            setMaterialValue(
              modalMode === "target" ? setTargets : setOwnedMaterials,
              name,
              modalMode === "target" &&
                !FARMABLE_MATERIAL_NAMES.includes(name)
                ? 0
                : amount
            )
          }
        />
      ) : null}
    </main>
  );
}
