"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import NumberInput from "@/app/components/common/NumberInput";
import type { OperatorDetail } from "@/data/operators-detail-data";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";

export type OwnedMaterialItem = {
  name: string;
  icon?: string;
  owned: number;
};

const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function isEndministrator(operator: OperatorDetail | null) {
  const slug = String(operator?.slug ?? "").toLowerCase();
  const id = String((operator as any)?.id ?? "").toLowerCase();
  return slug === "endministrator" || id === "endministrator";
}

function getOperatorImage(operator: OperatorDetail | null) {
  if (!operator) return "";
  if (isEndministrator(operator)) return "/operators/endministrator/full1.webp";
  return operator.fullImage || operator.avatar || `/operators/${operator.slug}/full.webp`;
}

function getOperatorImageSecondary(operator: OperatorDetail | null) {
  if (!operator) return "";
  if (isEndministrator(operator)) return "/operators/endministrator/full2.webp";
  return (
    (operator as (OperatorDetail & { fullImageSecondary?: string }) | null)
      ?.fullImageSecondary || ""
  );
}

export default function SimulatorShowcaseHero({
  operator,
  weapon,
  ownedItems,
  isOwnedPanelOpen,
  onOpenOwnedPanel,
  onCloseOwnedPanel,
  onChangeOwned,
  farmingHref = "/farming",
  onMoveToFarming,
}: {
  operator: OperatorDetail | null;
  weapon: SourceWeaponDetail | null;
  ownedItems: OwnedMaterialItem[];
  isOwnedPanelOpen: boolean;
  onOpenOwnedPanel: () => void;
  onCloseOwnedPanel: () => void;
  onChangeOwned: (name: string, value: number) => void;
  farmingHref?: string;
  onMoveToFarming?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [adminAlt, setAdminAlt] = useState(false);
  const [ownedSearch, setOwnedSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const operatorImage = getOperatorImage(operator);
  const operatorImageSecondary = getOperatorImageSecondary(operator);
  const weaponImage = weapon?.fullImage || weapon?.image || "";
  const isAdmin = isEndministrator(operator);
  const isDualOperator = Boolean(operator && operatorImage && operatorImageSecondary);

  const filteredOwnedItems = useMemo(() => {
    const q = ownedSearch.trim().toLowerCase();
    if (!q) return ownedItems;

    return ownedItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [ownedItems, ownedSearch]);

  if (!mounted) {
    return (
      <section className="relative overflow-hidden rounded-[28px] border border-yellow-500/15 bg-[#05070b]">
        <div className="min-h-[560px]" />
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-[28px] border border-yellow-500/15 bg-[#05070b]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#2b2104_0%,#0a0d12_45%,#05070b_100%)]" />

        {operator ? (
          <>
            {isDualOperator ? (
              isAdmin ? (
                <div className="pointer-events-none absolute inset-0 opacity-95">
                  <Image
                    src="/operators/endministrator/full1.webp"
                    alt={`${operator.name} 1`}
                    fill
                    sizes="100vw"
                    className={`object-contain object-bottom transition-opacity duration-500 ${
                      adminAlt ? "opacity-0" : "opacity-100"
                    }`}
                    priority
                  />
                  <Image
                    src="/operators/endministrator/full2.webp"
                    alt={`${operator.name} 2`}
                    fill
                    sizes="100vw"
                    className={`object-contain object-bottom transition-opacity duration-500 ${
                      adminAlt ? "opacity-100" : "opacity-0"
                    }`}
                    priority
                  />
                </div>
              ) : (
                <>
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 overflow-hidden opacity-90">
                    <div className="relative h-full w-[120%] -translate-x-[4%]">
                      <Image
                        src={operatorImage}
                        alt={operator.name}
                        fill
                        sizes="50vw"
                        className="object-contain object-bottom"
                        priority
                      />
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden opacity-90">
                    <div className="relative h-full w-[120%] -translate-x-[16%]">
                      <Image
                        src={operatorImageSecondary}
                        alt={`${operator.name} secondary`}
                        fill
                        sizes="50vw"
                        className="object-contain object-bottom"
                        priority
                      />
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-y-0 left-1/2 z-[2] w-px -translate-x-1/2 bg-yellow-400/45 shadow-[0_0_20px_rgba(250,204,21,0.4)]" />
                </>
              )
            ) : (
              <div className="pointer-events-none absolute inset-0 opacity-95">
                <Image
                  src={operatorImage}
                  alt={operator.name}
                  fill
                  sizes="100vw"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070b]/50 via-transparent to-[#05070b]/60" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070b] via-[#05070b]/20 to-transparent" />
          </>
        ) : null}

        <div className="relative z-10 min-h-[560px] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <Link
              href="/simulator/select/operator"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black/75 px-4 text-sm font-semibold text-white backdrop-blur transition hover:border-yellow-400/40 hover:text-yellow-300"
            >
              오퍼레이터 선택
            </Link>

            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
              <button
                type="button"
                onClick={onOpenOwnedPanel}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black/75 px-4 text-sm font-semibold text-white backdrop-blur transition hover:border-yellow-400/40 hover:text-yellow-300"
              >
                보유 재화 입력
              </button>

              <Link
                href={farmingHref}
                onClick={onMoveToFarming}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-yellow-500/25 bg-black/75 px-4 text-sm font-black text-white no-underline backdrop-blur transition hover:border-yellow-400/50 hover:bg-yellow-400/5"
              >
                재화 파밍 계산기로 이동
              </Link>
            </div>
          </div>

          <div className="absolute bottom-7 left-8 z-20 max-w-[520px]">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
              {operator?.name ?? "오퍼레이터 미선택"}
            </h2>
            <div className="mt-2 text-sm font-medium uppercase tracking-[0.24em] text-zinc-400">
              {operator?.enName ?? ""}
            </div>

            {!operator ? (
              <p className="mt-5 max-w-[420px] text-sm leading-6 text-zinc-500">
                오퍼레이터를 선택하시면 이미지와 육성 시뮬레이션 정보가 표시됩니다.
              </p>
            ) : null}

            {isAdmin ? (
              <button
                type="button"
                onClick={() => setAdminAlt((prev) => !prev)}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black/75 px-4 text-sm font-semibold text-white backdrop-blur transition hover:border-yellow-400/40 hover:text-yellow-300"
              >
                이미지 변경
              </button>
            ) : null}
          </div>

          <div className="absolute bottom-6 right-6 z-20">
            <Link
              href="/simulator/select/weapon"
              className="group block w-[240px] overflow-hidden rounded-[22px] border border-yellow-500/20 bg-black/70 backdrop-blur transition hover:border-yellow-400/40"
            >
              <div className="relative h-[136px] overflow-hidden">
                {weapon ? (
                  <>
                    <div className="absolute inset-0 opacity-90">
                      <Image
                        src={weaponImage}
                        alt={weapon.name}
                        fill
                        sizes="240px"
                        className="object-contain p-4 transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.22)_45%,rgba(0,0,0,0.9)_100%)]" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#191202_0%,#0d1017_45%,#06080d_100%)]" />
                )}

                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-[11px] tracking-[0.24em] text-yellow-400/70">
                    WEAPON
                  </div>
                  <div className="mt-2 text-lg font-black tracking-[-0.04em] text-white">
                    {weapon?.name ?? "무기 미선택"}
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    클릭하여 무기를 선택해 주세요.
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {isOwnedPanelOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[1180px] overflow-hidden rounded-[26px] border border-yellow-500/20 bg-[#05070b] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-yellow-500/10 px-5 py-4">
              <div>
                <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
                  보유 재화 입력
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  재화명을 검색하고 현재 보유량을 입력한다.
                </p>
              </div>

              <button
                type="button"
                onClick={onCloseOwnedPanel}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-500/20 bg-black text-[28px] text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
              >
                ×
              </button>
            </div>

            <div className="border-b border-yellow-500/10 p-4">
              <input
                value={ownedSearch}
                onChange={(event) => setOwnedSearch(event.target.value)}
                placeholder="재화 검색"
                className="h-12 w-full rounded-2xl border border-yellow-500/15 bg-black px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400/40"
              />
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="grid gap-3 lg:grid-cols-3">
                {filteredOwnedItems.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-3 rounded-2xl border border-yellow-500/10 bg-[#090d14] px-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-yellow-500/10 bg-black/50">
                        <Image
                          src={item.icon ?? `/materials/${item.name}.webp`}
                          alt={item.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">
                          현재 보유량
                        </div>
                      </div>
                    </div>

                    <NumberInput
                      value={item.owned}
                      onChange={(value) => onChangeOwned(item.name, value)}
                      min={0}
                      className="h-11 rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
