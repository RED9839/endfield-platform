"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { weaponDetails } from "@/data/weapons-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

function getRarityNumber(item: any) {
  const raw = item?.rarity ?? item?.quality ?? item?.star ?? item?.stars ?? 0;
  if (typeof raw === "number") return raw;

  const matched = String(raw).match(/\d+/);
  return matched ? Number(matched[0]) : 0;
}

function getRarityBorderColor(item: any) {
  const rarity = getRarityNumber(item);

  if (rarity >= 6) return "#ff8a1f";
  if (rarity === 5) return "#f0c94a";
  if (rarity === 4) return "#9a63ff";
  if (rarity === 3) return "#4fa3ff";
  return YELLOW_BORDER_SOFT;
}

function getRarityGlow(item: any) {
  const rarity = getRarityNumber(item);

  if (rarity >= 6) return "0 0 20px rgba(255,138,31,0.35)";
  if (rarity === 5) return "0 0 18px rgba(240,201,74,0.30)";
  if (rarity === 4) return "0 0 16px rgba(154,99,255,0.28)";
  if (rarity === 3) return "0 0 14px rgba(79,163,255,0.25)";
  return "none";
}

function getRarityLabel(item: any) {
  const rarity = getRarityNumber(item);
  return rarity > 0 ? `${rarity}★` : "";
}


const SIMULATOR_SELECTION_KEY = "endfield:simulator-selection";

function getWeaponImage(weapon: any) {
  return weapon?.image || weapon?.fullImage || `/weapons/${weapon.slug}.webp`;
}

function saveSelectedWeapon(slug: string) {
  if (typeof window === "undefined") return;

  const storageKeys = [
    "endfield:simulator-selection",
    "endfield:simulator:selected",
    "endfield:simulator-selection-state",
  ];

  const payloadKeys = [
    "selectedWeaponSlug",
    "weaponSlug",
    "selectedWeapon",
  ];

  for (const storageKey of storageKeys) {
    const raw =
      window.localStorage.getItem(storageKey) ||
      window.sessionStorage.getItem(storageKey);

    let previous: Record<string, unknown> = {};

    try {
      previous = raw ? JSON.parse(raw) : {};
    } catch {
      previous = {};
    }

    const next: Record<string, unknown> = {
      ...previous,
    };

    for (const key of payloadKeys) {
      next[key] = slug;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(next));
    window.sessionStorage.setItem(storageKey, JSON.stringify(next));
  }

  window.localStorage.setItem("selectedWeaponSlug", slug);
  window.sessionStorage.setItem("selectedWeaponSlug", slug);

  window.dispatchEvent(
    new CustomEvent("endfield:simulator-selection-change", {
      detail: { selectedWeaponSlug: slug },
    })
  );
}

export default function WeaponSelectPage() {
  const router = useRouter();

  const list = (Object.values(weaponDetails ?? {}) as any[]).sort((a, b) => getRarityNumber(b) - getRarityNumber(a) || String(a.name ?? "").localeCompare(String(b.name ?? ""), "ko"));

  return (
    <main className="mx-auto w-full max-w-[1560px] px-4 py-8 text-white md:px-6 xl:px-8">
      <section
        className="rounded-[28px] border p-5 md:p-6"
        style={{ borderColor: YELLOW_BORDER, background: "#05070b" }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p
              className="text-[11px] font-black uppercase tracking-[0.34em]"
              style={{ color: YELLOW_MAIN }}
            >
              Endfield Data Hub
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">
              무기 선택
            </h1>
          </div>

          <Link
            href="/simulator"
            className="inline-flex h-11 items-center justify-center rounded-2xl border bg-black px-5 text-sm font-black text-white transition hover:border-yellow-400/40 hover:text-yellow-300"
            style={{ borderColor: YELLOW_BORDER }}
          >
            돌아가기
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {list.map((weapon) => (
          <button
            key={weapon.slug ?? weapon.id ?? weapon.name}
            type="button"
            onClick={() => {
              saveSelectedWeapon(String(weapon.slug ?? weapon.id));
              router.push("/simulator");
            }}
            className="group overflow-hidden rounded-[24px] border text-left transition hover:border-yellow-400/40"
            style={{ borderColor: getRarityBorderColor(weapon), background: "#090d14", boxShadow: getRarityGlow(weapon) }}
          >
            <div className="relative h-[132px] overflow-hidden bg-black">
              <Image
                src={getWeaponImage(weapon)}
                alt={weapon.name}
                fill
                sizes="320px"
                className="object-contain p-4 transition duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-white">{weapon.name}</div>
                  <div className="mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    {weapon.enName ?? weapon.englishName ?? ""}
                  </div>
                </div>
                {getRarityLabel(weapon) ? (
                  <span
                    className="shrink-0 rounded-lg border px-2 py-1 text-[10px] font-black"
                    style={{
                      borderColor: getRarityBorderColor(weapon),
                      color: getRarityBorderColor(weapon),
                    }}
                  >
                    {getRarityLabel(weapon)}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}
