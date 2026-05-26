"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

const settingTypeLabelMap: Record<string, string> = {
  solo: "단일",
  party: "파티",
};

const operatorBySlug = new Map(
  operatorDetails.map((operator: any) => [operator.slug, operator]),
);

const weaponBySlug = new Map(
  weaponDetails.map((weapon: any) => [weapon.slug, weapon]),
);

type PartyMember = {
  name: string;
  image: string;
  operatorSlug: string;
  elementIcon?: string;
};

type PopularSetting = {
  id: string;
  type: "solo" | "party";
  title: string;
  description?: string | null;
  slots?: any;
  createdAt?: string;
  likeCount?: number | null;
  viewCount?: number | null;
  likes?: number | null;
  views?: number | null;
  nickname?: string | null;
  userNickname?: string | null;
};

type SettingCardItem = {
  id: string;
  title: string;
  description: string;
  nickname: string;
  operatorName: string;
  operatorSlug: string;
  weaponName: string;
  weaponImage?: string;
  type: "solo" | "party";
  likes: number;
  views: number;
  image: string;
  elementIcon?: string;
  partyMembers?: PartyMember[];
};

type ApiResponse = {
  ok?: boolean;
  settings?: PopularSetting[];
};

function getOperatorImage(operator: any) {
  return (
    operator?.avatar ??
    operator?.image ??
    `/operators/${operator?.slug}/avatar.webp`
  );
}

function getOperatorElementIcon(operator: any) {
  const element = operator?.element ?? operator?.elementKey ?? operator?.attribute;
  return element ? `/icons/elements/${element}.webp` : "";
}

function getNickname(setting: PopularSetting) {
  return String(setting.nickname ?? setting.userNickname ?? "저장된 세팅").trim();
}

function toSettingCardItem(setting: PopularSetting, fallbackOperatorSlug: string): SettingCardItem {
  const mainSlot = setting.slots?.main;
  const mainOperatorSlug = String(mainSlot?.operatorSlug ?? fallbackOperatorSlug ?? "").trim();
  const mainOperator = operatorBySlug.get(mainOperatorSlug) as any;
  const weapon = weaponBySlug.get(mainSlot?.form?.weaponSlug) as any;

  const memberSlots = [
    setting.slots?.member1,
    setting.slots?.member2,
    setting.slots?.member3,
  ].filter(Boolean);

  const partyMembers = memberSlots
    .map((slot: any) => {
      const operator = operatorBySlug.get(slot?.operatorSlug) as any;
      if (!operator) return null;

      return {
        name: operator.name,
        operatorSlug: operator.slug,
        image: getOperatorImage(operator),
        elementIcon: getOperatorElementIcon(operator),
      };
    })
    .filter(Boolean) as PartyMember[];

  return {
    id: setting.id,
    title: setting.title,
    description: setting.description ?? "",
    nickname: getNickname(setting),
    operatorName: mainOperator?.name ?? mainOperatorSlug ?? "오퍼레이터",
    operatorSlug: mainOperator?.slug ?? mainOperatorSlug,
    weaponName: weapon?.name ?? "무기 미등록",
    weaponImage: weapon?.image ?? weapon?.avatar,
    type: setting.type === "party" ? "party" : "solo",
    likes: Number(setting.likeCount ?? setting.likes ?? 0),
    views: Number(setting.viewCount ?? setting.views ?? 0),
    image: mainOperator ? getOperatorImage(mainOperator) : `/operators/${fallbackOperatorSlug}/avatar.webp`,
    elementIcon: mainOperator ? getOperatorElementIcon(mainOperator) : undefined,
    partyMembers,
  };
}

export default function PopularOperatorSettingsPanel({
  operatorSlug,
  operatorName,
}: {
  operatorSlug: string;
  operatorName: string;
  operatorAvatar: string;
}) {
  const [settings, setSettings] = useState<PopularSetting[]>([]);
  const [loading, setLoading] = useState(true);

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
          href="/settings"
          className="rounded-xl bg-black px-3 py-2 text-xs font-black text-zinc-200 transition hover:border-yellow-400/40 hover:text-yellow-300 sm:px-4 sm:text-sm"
          style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          전체 오퍼레이터 세팅 보러가기
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
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(190px,220px))] sm:justify-between sm:gap-3 lg:gap-y-5">
          {settings.map((setting) => (
            <SettingCard
              key={setting.id}
              setting={toSettingCardItem(setting, operatorSlug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SettingCard({ setting }: { setting: SettingCardItem }) {
  return (
    <Link
      href={`/settings/${setting.id}`}
      className="group block w-full overflow-hidden rounded-[16px] border border-white/10 bg-black transition hover:-translate-y-1 hover:border-yellow-400/40 sm:rounded-[18px]"
    >
      <div className="relative aspect-[220/255] overflow-hidden bg-black">
        <Image
          src={setting.image}
          alt={setting.operatorName}
          fill
          sizes="(max-width: 640px) 46vw, 220px"
          className="object-cover object-center transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

        <div className="absolute left-2 top-2 flex items-center gap-1">
          {setting.elementIcon ? (
            <div className="flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8">
              <Image
                src={setting.elementIcon}
                alt="속성"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
          ) : null}

          <span
            className={[
              "rounded-md border px-1.5 py-1 text-[9px] font-black backdrop-blur-sm sm:px-2 sm:text-[10px]",
              setting.type === "solo"
                ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-200"
                : "border-sky-300/40 bg-sky-300/15 text-sky-200",
            ].join(" ")}
          >
            {settingTypeLabelMap[setting.type]}
          </span>
        </div>

        {setting.type === "party" && setting.partyMembers?.length ? (
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            {setting.partyMembers.slice(0, 3).map((member) => (
              <div
                key={member.operatorSlug}
                className="relative h-8 w-8 overflow-hidden rounded-md border border-white/20 bg-black sm:h-10 sm:w-10"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />

                {member.elementIcon ? (
                  <Image
                    src={member.elementIcon}
                    alt=""
                    width={13}
                    height={13}
                    className="absolute bottom-0 right-0 rounded-sm bg-black/80"
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {setting.weaponImage ? (
          <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-black/50 backdrop-blur-sm sm:h-10 sm:w-10">
            <Image
              src={setting.weaponImage}
              alt={setting.weaponName}
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 sm:px-3">
          <h3 className="line-clamp-1 text-[13px] font-black text-white drop-shadow sm:text-[15px]">
            {setting.operatorName}
          </h3>
        </div>
      </div>

      <div className="flex min-h-[124px] flex-col border-t border-yellow-500/10 bg-black px-2.5 pb-2 pt-2 sm:min-h-[138px] sm:px-3">
        <h2 className="line-clamp-2 text-[12px] font-black leading-[17px] text-yellow-300 sm:text-[13px] sm:leading-[18px]">
          {setting.title}
        </h2>

        <p className="mt-1 line-clamp-2 text-[10px] leading-[16px] text-zinc-300 sm:text-[11px] sm:leading-[17px]">
          {setting.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1 pt-2 text-[9px] font-black sm:text-[10px]">
          <span className="max-w-full truncate text-white">{setting.nickname}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#ffdc70]">추천 {setting.likes}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#ffdc70]">조회 {setting.views}</span>
        </div>
      </div>
    </Link>
  );
}
