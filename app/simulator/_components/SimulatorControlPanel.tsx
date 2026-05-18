"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { OperatorDetail } from "@/data/operators-detail-data";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";
import SharedSimulatorShowcaseHero from "@/app/components/select/CommonSelectPanel";

const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

type OwnedMaterialItem = {
  name: string;
  icon?: string;
  required: number;
  owned: number;
  lacking: number;
};

function getOperatorImage(operator: OperatorDetail | null) {
  const raw = operator as any;

  if (!raw) return "";

  return (
    raw.fullImage ??
    raw.image ??
    raw.avatar ??
    `/operators/${raw.slug}/full.webp`
  );
}

function getWeaponImage(weapon: SourceWeaponDetail | null) {
  const raw = weapon as any;

  if (!raw) return "";

  return (
    raw.fullImage ??
    raw.image ??
    raw.avatar ??
    `/weapons/${raw.slug}/avatar.webp`
  );
}

function getWeaponTypeText(weapon: SourceWeaponDetail | null) {
  const raw = weapon as any;
  const type = String(raw?.weaponType ?? raw?.type ?? "");

  const map: Record<string, string> = {
    sword: "한손검",
    artsunit: "아츠 유닛",
    artsUnit: "아츠 유닛",
    greatsword: "양손검",
    polearm: "장병기",
    handcannon: "권총",
  };

  return map[type] ?? type;
}

function MaterialOwnedPanel({
  items,
  onClose,
  onChangeOwned,
}: {
  items: OwnedMaterialItem[];
  onClose: () => void;
  onChangeOwned: (name: string, value: number) => void;
}) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!query) return items;

    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
      <section
        className="max-h-[88vh] w-full max-w-[920px] overflow-hidden rounded-[28px] bg-[#05070b] shadow-[0_22px_90px_rgba(0,0,0,0.62)]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <header
          className="flex items-center justify-between gap-4 p-5"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div>
            <p
              className="text-[11px] font-semibold tracking-[0.35em]"
              style={{ color: YELLOW_TEXT }}
            >
              MATERIAL INVENTORY
            </p>
            <h2 className="mt-2 text-3xl font-black" style={{ color: YELLOW_TEXT }}>
              보유 재화 입력
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              이 값은 성장 시뮬레이션과 성장 목표/파밍 계산기에서 공통으로 사용됩니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-lg font-black text-white transition hover:bg-[#0b1018]"
            style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
          >
            ×
          </button>
        </header>

        <div className="p-5">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="재화 이름 검색"
            className="mb-4 h-11 w-full rounded-xl border border-white/10 bg-[#071019] px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400/50"
          />

          <div className="grid max-h-[56vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <label
                key={item.name}
                className="grid grid-cols-[40px_minmax(0,1fr)_100px] items-center gap-3 rounded-xl border border-white/10 bg-black/35 p-3"
              >
                <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#071019]">
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt={item.name}
                      fill
                      sizes="36px"
                      className="object-contain p-1"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 truncate text-xs font-bold text-zinc-300">
                  {item.name}
                </span>
                <input
                  type="number"
                  min={0}
                  value={Number.isFinite(item.owned) ? item.owned : 0}
                  onChange={(event) =>
                    onChangeOwned(item.name, Number(event.target.value) || 0)
                  }
                  className="h-9 rounded-lg border border-white/10 bg-black px-2 text-right text-sm font-black text-yellow-200 outline-none focus:border-yellow-400/50"
                />
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SimulatorControlPanel({
  operator,
  weapon,
  operators,
  weapons,
  selectedOperatorSlug,
  selectedWeaponSlug,
  onSelectOperator,
  onSelectWeapon,
  ownedItems,
  isOwnedPanelOpen,
  onOpenOwnedPanel,
  onCloseOwnedPanel,
  onChangeOwned,
  onMoveToFarming,
}: {
  operator: OperatorDetail | null;
  weapon: SourceWeaponDetail | null;
  operators: OperatorDetail[];
  weapons: SourceWeaponDetail[];
  selectedOperatorSlug: string;
  selectedWeaponSlug: string;
  onSelectOperator: (slug: string) => void;
  onSelectWeapon: (slug: string) => void;
  ownedItems: OwnedMaterialItem[];
  isOwnedPanelOpen: boolean;
  onOpenOwnedPanel: () => void;
  onCloseOwnedPanel: () => void;
  onChangeOwned: (name: string, value: number) => void;
  onMoveToFarming?: () => void;
}) {
  const [picker, setPicker] = useState<"operator" | "weapon" | null>(null);
  const operatorImage = getOperatorImage(operator);
  const weaponImage = getWeaponImage(weapon);

  return (
    <section
      className="relative overflow-hidden rounded-[28px] bg-[#05070b] p-5"
      style={{ border: `1px solid ${YELLOW_BORDER}` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_0%,rgba(255,210,74,0.10),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.62),rgba(0,0,0,0.92))]" />

      <div className="relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid min-h-[300px] gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
          <button
            type="button"
            onClick={() => setPicker("operator")}
            className="relative min-h-[300px] overflow-hidden rounded-3xl bg-black/65 text-left transition hover:bg-black/80"
            style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
          >
            {operatorImage ? (
              <Image
                src={operatorImage}
                alt={operator?.name ?? "operator"}
                fill
                priority
                loading="eager"
                sizes="320px"
                className="object-contain object-bottom opacity-90"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm font-bold text-zinc-600">
                오퍼레이터를 선택해 주세요
              </div>
            )}
          </button>

          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPicker("operator")}
                className="rounded-2xl bg-black/70 px-5 py-3 text-sm font-black text-yellow-200 transition hover:bg-[#111827]"
                style={{ border: `1px solid ${YELLOW_BORDER}` }}
              >
                오퍼 선택
              </button>

              <button
                type="button"
                onClick={() => setPicker("weapon")}
                className="rounded-2xl bg-black/70 px-5 py-3 text-sm font-black text-zinc-200 transition hover:text-yellow-200"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                무기 선택
              </button>

              <button
                type="button"
                onClick={onOpenOwnedPanel}
                className="rounded-2xl bg-black/70 px-5 py-3 text-sm font-black text-zinc-200 transition hover:text-yellow-200"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                보유 재화 입력
              </button>

              {onMoveToFarming ? (
                <button
                  type="button"
                  onClick={onMoveToFarming}
                  className="rounded-2xl bg-black/70 px-5 py-3 text-sm font-black text-zinc-200 transition hover:text-yellow-200"
                  style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                >
                  재화 파밍 계산기로 이동
                </button>
              ) : null}
            </div>

            <div>
              <p className="text-[11px] font-black tracking-[0.35em] text-yellow-300">
                OPERATOR
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                {operator?.name ?? "오퍼레이터 미선택"}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {operator?.enName ?? "왼쪽 위 오퍼 선택 버튼을 눌러 오퍼레이터를 선택해 주세요."}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPicker("weapon")}
          className="grid min-h-[240px] content-between rounded-3xl bg-black/65 p-4 text-left transition hover:bg-black/80"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div className="relative h-36 rounded-2xl bg-black/45">
            {weaponImage ? (
              <Image
                src={weaponImage}
                alt={weapon?.name ?? "weapon"}
                fill
                sizes="300px"
                className="object-contain p-4"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm font-bold text-zinc-600">
                무기 없음
              </div>
            )}
          </div>

          <div>
            <p className="mt-4 text-[11px] font-black tracking-[0.35em] text-yellow-300">
              WEAPON
            </p>
            <h3 className="mt-1 text-xl font-black text-white">
              {weapon?.name ?? "무기 선택"}
            </h3>
            {weapon ? (
              <p className="mt-1 text-xs font-bold text-zinc-500">
                {getWeaponTypeText(weapon)}
              </p>
            ) : null}
          </div>
        </button>
      </div>

      {picker ? (
  <SharedSimulatorShowcaseHero
    kind={picker}
    title={picker === "operator" ? "오퍼레이터 선택" : "무기 선택"}
    selectedSlug={
      picker === "operator" ? selectedOperatorSlug : selectedWeaponSlug
    }
    onSelectOperator={(slug: string) => {
      onSelectOperator(slug);
      setPicker(null);
    }}
    onSelectWeapon={(slug: string) => {
      onSelectWeapon(slug);
      setPicker(null);
    }}
    onSelectGear={() => {}}
    onClose={() => setPicker(null)}
  />
) : null}
    </section>
  );
}
