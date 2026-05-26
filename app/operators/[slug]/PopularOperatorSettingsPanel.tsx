"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

const settingTypeLabelMap: Record<string, string> = {
  solo: "단일",
  party: "파티",
};

type PopularSetting = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  createdAt?: string;
  likeCount?: number | null;
  viewCount?: number | null;
  nickname?: string | null;
  userNickname?: string | null;
};

type ApiResponse = {
  ok?: boolean;
  settings?: PopularSetting[];
};

function getNickname(setting: PopularSetting) {
  return String(setting.nickname ?? setting.userNickname ?? "저장된 세팅").trim();
}

function formatNumber(value: number | null | undefined) {
  return Number(value ?? 0).toLocaleString("ko-KR");
}

export default function PopularOperatorSettingsPanel({
  operatorSlug,
  operatorName,
  operatorAvatar,
}: {
  operatorSlug: string;
  operatorName: string;
  operatorAvatar: string;
}) {
  const [settings, setSettings] = useState<PopularSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const settingsListHref = `/settings?operators=${encodeURIComponent(operatorSlug)}&sort=popular`;

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          operators: operatorSlug,
          sort: "popular",
          limit: "4",
          page: "1",
        });

        const response = await fetch(`/api/operator-settings?${params.toString()}`, {
          cache: "no-store",
        });
        const data = (await response.json().catch(() => null)) as ApiResponse | null;

        if (!mounted) return;

        if (!response.ok || !data?.ok) {
          setSettings([]);
          return;
        }

        setSettings(data.settings ?? []);
      } catch {
        if (mounted) setSettings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, [operatorSlug]);

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p
            className="text-[10px] font-black tracking-[0.24em] sm:text-[11px]"
            style={{ color: YELLOW_TEXT }}
          >
            POPULAR SETTINGS
          </p>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            유저들이 등록한 {operatorName} 인기 세팅입니다.
          </p>
        </div>

        <Link
          href={settingsListHref}
          className="rounded-xl bg-black px-3 py-2 text-xs font-black text-zinc-200 transition hover:border-yellow-400/40 hover:text-yellow-300 sm:px-4 sm:text-sm"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          이 오퍼레이터 세팅 목록 보기
        </Link>
      </div>

      {loading ? (
        <div
          className="rounded-2xl bg-black/35 p-4 text-sm font-bold text-zinc-500"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          인기 세팅을 불러오는 중입니다.
        </div>
      ) : settings.length === 0 ? (
        <div
          className="rounded-2xl bg-black/35 p-4 text-sm text-zinc-500"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          아직 등록된 {operatorName} 세팅이 없습니다.
          <div className="mt-3">
            <Link
              href="/settings/party"
              className="inline-flex rounded-xl px-3 py-2 text-xs font-black text-black transition hover:brightness-110"
              style={{ background: YELLOW_MAIN }}
            >
              첫 세팅 등록하기
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {settings.map((setting, index) => (
            <Link
              key={setting.id}
              href={`/settings/${setting.id}`}
              className="group min-w-0 overflow-hidden rounded-[20px] bg-black/35 transition hover:-translate-y-0.5 hover:bg-[#0b1018] hover:shadow-[0_16px_34px_rgba(0,0,0,0.35)]"
              style={{ border: `1px solid ${YELLOW_BORDER}` }}
            >
              <div className="relative h-32 overflow-hidden bg-[#050505] sm:h-36">
                <Image
                  src={operatorAvatar}
                  alt={operatorName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-contain object-center p-2 opacity-85 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                <div className="absolute left-3 top-3 rounded-full border border-yellow-400/30 bg-yellow-400/15 px-2 py-1 text-[10px] font-black text-yellow-100">
                  인기 {index + 1}
                </div>

                <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] font-black text-zinc-200">
                  {settingTypeLabelMap[setting.type] ?? "세팅"}
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500">
                  <span className="min-w-0 truncate font-bold">{getNickname(setting)}</span>
                  <span className="shrink-0" style={{ color: YELLOW_TEXT }}>
                    ♥ {formatNumber(setting.likeCount)}
                  </span>
                </div>

                <h3 className="mt-2 line-clamp-2 min-h-[40px] break-keep text-sm font-black text-zinc-100 transition group-hover:text-yellow-100">
                  {setting.title || `${operatorName} 세팅`}
                </h3>

                {setting.description ? (
                  <p className="mt-2 line-clamp-2 min-h-[34px] text-xs leading-relaxed text-zinc-500">
                    {setting.description}
                  </p>
                ) : (
                  <p className="mt-2 min-h-[34px] text-xs leading-relaxed text-zinc-600">
                    설명이 등록되지 않았습니다.
                  </p>
                )}

                <div
                  className="mt-3 flex items-center justify-between border-t pt-3 text-[11px] font-bold text-zinc-500"
                  style={{ borderColor: YELLOW_BORDER_SOFT }}
                >
                  <span>조회 {formatNumber(setting.viewCount)}</span>
                  <span className="text-yellow-200">상세 보기 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
