"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import NumberInput from "@/app/components/common/NumberInput";
import type { OperatorDetail } from "@/data/operators-detail-data";
import type { SourceWeaponDetail } from "@/data/weapons-detail-data";

export type OwnedMaterialItem = {
  name: string;
  icon?: string;
  owned: number;
};

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

function getWeaponImage(weapon: SourceWeaponDetail | null) {
  if (!weapon) return "";
  return weapon.fullImage || weapon.image || `/weapons/${weapon.slug}.webp`;
}

function EmptyImage({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-[340px] items-center justify-center rounded-[22px] border border-yellow-500/10 bg-black/45 text-sm font-semibold text-zinc-500">
      {label}
    </div>
  );
}

export default function SimulatorShowcaseHero({
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
  farmingHref?: string;
  onMoveToFarming?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [adminAlt, setAdminAlt] = useState(false);
  const [ownedSearch, setOwnedSearch] = useState("");
  const [isOperatorPickerOpen, setIsOperatorPickerOpen] = useState(false);
  const [isWeaponPickerOpen, setIsWeaponPickerOpen] = useState(false);
  const [operatorSearch, setOperatorSearch] = useState("");
  const [weaponSearch, setWeaponSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const operatorImage = getOperatorImage(operator);
  const operatorImageSecondary = getOperatorImageSecondary(operator);
  const weaponImage = getWeaponImage(weapon);
  const isAdmin = isEndministrator(operator);
  const isDualOperator = Boolean(operator && operatorImage && operatorImageSecondary);

  const filteredOwnedItems = useMemo(() => {
    const q = ownedSearch.trim().toLowerCase();
    if (!q) return ownedItems;
    return ownedItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [ownedItems, ownedSearch]);

  const filteredOperators = useMemo(() => {
    const q = operatorSearch.trim().toLowerCase();
    if (!q) return operators;
    return operators.filter((item) => {
      const ko = item.name.toLowerCase();
      const en = String(item.enName ?? "").toLowerCase();
      const slug = String(item.slug ?? "").toLowerCase();
      return ko.includes(q) || en.includes(q) || slug.includes(q);
    });
  }, [operatorSearch, operators]);

  const filteredWeapons = useMemo(() => {
    const q = weaponSearch.trim().toLowerCase();
    if (!q) return weapons;
    return weapons.filter((item) => {
      const ko = item.name.toLowerCase();
      const en = String(item.enName ?? "").toLowerCase();
      const slug = String(item.slug ?? "").toLowerCase();
      return ko.includes(q) || en.includes(q) || slug.includes(q);
    });
  }, [weaponSearch, weapons]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-visible rounded-[28px] border border-yellow-500/15 bg-[#05070b] shadow-[0_18px_70px_rgba(0,0,0,0.36)]">
      <div className="relative min-h-[620px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_35%_20%,rgba(255,210,74,0.14),transparent_34%),linear-gradient(135deg,#05070b,#020305)]">
        {operator ? (
          isDualOperator && isAdmin ? (
            <div className="absolute inset-0 grid grid-cols-2">
              <div className="relative overflow-hidden">
                <Image
                  src={adminAlt ? operatorImageSecondary : operatorImage}
                  alt={`${operator.name} 이미지 1`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src={adminAlt ? operatorImage : operatorImageSecondary}
                  alt={`${operator.name} 이미지 2`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          ) : (
            <Image
              src={operatorImage}
              alt={operator.name}
              fill
              priority
              sizes="100vw"
              className="object-contain object-bottom"
            />
          )
        ) : (
          <div className="absolute inset-4">
            <EmptyImage label="오퍼레이터를 선택해 주세요" />
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.78)),linear-gradient(90deg,rgba(0,0,0,0.76),transparent_58%)]" />

        <div className="absolute left-4 top-4 z-20 md:left-6 md:top-6">
          <button
            type="button"
            onClick={() => setIsOperatorPickerOpen((prev) => !prev)}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-black/65 px-4 text-sm font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-black/80"
          >
            오퍼 선택
          </button>

          {isOperatorPickerOpen ? (
            <div className="mt-3 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/15 bg-black/88 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <input
                value={operatorSearch}
                onChange={(event) => setOperatorSearch(event.target.value)}
                placeholder="오퍼레이터 검색"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none placeholder:text-zinc-500 focus:border-white/30"
              />
              <div className="mt-3 max-h-[360px] overflow-y-auto pr-1">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOperator("");
                      setIsOperatorPickerOpen(false);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    오퍼레이터 선택 해제
                  </button>
                  {filteredOperators.map((item) => {
                    const image = getOperatorImage(item);
                    const active = item.slug === selectedOperatorSlug;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => {
                          onSelectOperator(item.slug);
                          setIsOperatorPickerOpen(false);
                        }}
                        className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                          active
                            ? "border-white/35 bg-white/15"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/70">
                          {image ? (
                            <Image
                              src={image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-contain object-bottom"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-white">
                            {item.name}
                          </div>
                          {item.enName ? (
                            <div className="truncate text-xs font-semibold text-zinc-400">
                              {item.enName}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="absolute right-4 top-4 z-20 flex flex-wrap justify-end gap-2 md:right-6 md:top-6">
          <button
            type="button"
            onClick={onOpenOwnedPanel}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-black/65 px-4 text-sm font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-black/80"
          >
            보유 재화 입력
          </button>
          <button
            type="button"
            onClick={onMoveToFarming}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-black/65 px-4 text-sm font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-black/80"
          >
            재화 파밍 시뮬레이터 이동
          </button>
        </div>

        <div className="absolute bottom-6 right-6 z-20">
          <button
            type="button"
            onClick={() => setIsWeaponPickerOpen((prev) => !prev)}
            className="group grid w-[150px] gap-2 rounded-3xl border border-white/15 bg-black/65 p-3 text-left text-white backdrop-blur transition hover:border-white/30 hover:bg-black/80 sm:w-[180px]"
          >
            <div className="relative h-[96px] overflow-hidden rounded-2xl bg-black/70 sm:h-[120px]">
              {weapon && weaponImage ? (
                <Image
                  src={weaponImage}
                  alt={weapon.name}
                  fill
                  sizes="180px"
                  className="object-contain p-3"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-bold text-zinc-500">
                  무기 없음
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
                WEAPON
              </div>
              <div className="mt-1 truncate text-sm font-black text-white">
                {weapon?.name ?? "무기 선택"}
              </div>
            </div>
          </button>

          {isWeaponPickerOpen ? (
            <div className="absolute bottom-full right-0 mb-3 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/15 bg-black/88 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <input
                value={weaponSearch}
                onChange={(event) => setWeaponSearch(event.target.value)}
                placeholder="무기 검색"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white outline-none placeholder:text-zinc-500 focus:border-white/30"
              />
              <div className="mt-3 max-h-[360px] overflow-y-auto pr-1">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectWeapon("");
                      setIsWeaponPickerOpen(false);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    무기 선택 해제
                  </button>
                  {filteredWeapons.map((item) => {
                    const image = getWeaponImage(item);
                    const active = item.slug === selectedWeaponSlug;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => {
                          onSelectWeapon(item.slug);
                          setIsWeaponPickerOpen(false);
                        }}
                        className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                          active
                            ? "border-white/35 bg-white/15"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/70">
                          {image ? (
                            <Image
                              src={image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-white">
                            {item.name}
                          </div>
                          {item.enName ? (
                            <div className="truncate text-xs font-semibold text-zinc-400">
                              {item.enName}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-[560px]">
            <div className="text-[11px] font-black uppercase tracking-[0.32em] text-yellow-300/80">
              OPERATOR
            </div>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">
              {operator?.name ?? "오퍼레이터 미선택"}
            </h2>
            {operator?.enName ? (
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {operator.enName}
              </p>
            ) : null}
            {!operator ? (
              <p className="mt-4 text-sm font-medium text-zinc-400">
                왼쪽 위 오퍼 선택 버튼을 눌러 오퍼레이터를 선택해 주세요.
              </p>
            ) : null}
            {isAdmin ? (
              <button
                type="button"
                onClick={() => setAdminAlt((prev) => !prev)}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-black/65 px-4 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-black/80"
              >
                이미지 변경
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {isOwnedPanelOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
          <div className="max-h-[86vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#05070b] shadow-[0_22px_90px_rgba(0,0,0,0.56)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
              <h3 className="text-2xl font-black tracking-[-0.04em] text-white">
                보유 재화
              </h3>
              <button
                type="button"
                onClick={onCloseOwnedPanel}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/60 text-lg font-black text-white transition hover:border-white/25 hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 p-5">
              <input
                value={ownedSearch}
                onChange={(event) => setOwnedSearch(event.target.value)}
                placeholder="재화 검색"
                className="h-12 w-full rounded-2xl border border-white/10 bg-black/50 px-4 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-white/25"
              />

              <div className="max-h-[58vh] overflow-y-auto pr-1">
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {filteredOwnedItems.map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-[1fr_88px] items-center gap-3 rounded-2xl border border-white/10 bg-[#090d14] px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {item.icon ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-contain p-1"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0 truncate text-sm font-bold text-white">
                          {item.name}
                        </div>
                      </div>
                      <NumberInput
                        value={item.owned}
                        onChange={(value) => onChangeOwned(item.name, value)}
                        min={0}
                        className="h-10 rounded-xl border-white/10 bg-black/40 text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
