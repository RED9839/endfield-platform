"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const settingTypeLabelMap: Record<string, string> = {
  solo: "단일",
  party: "파티",
};

type PopularOperatorItem = {
  slug: string;
  name: string;
  enName: string;
  avatar?: string;
  image?: string;
  element?: string;
  elementKey?: string;
  attribute?: string;
};

type PopularWeaponItem = {
  slug: string;
  name: string;
  image?: string;
  avatar?: string;
};

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
  isDefaultSetting?: boolean;
  slotsSummary?: {
    mainOperatorSlug?: string;
    memberOperatorSlugs?: string[];
    mainWeaponSlug?: string;
  };
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
  isDefaultSetting: boolean;
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

function toSettingCardItem(
  setting: PopularSetting,
  fallbackOperatorSlug: string,
  operatorBySlug: Map<string, PopularOperatorItem>,
  weaponBySlug: Map<string, PopularWeaponItem>,
): SettingCardItem {
  const mainSlot = setting.slots?.main;
  const mainOperatorSlug = String(
    setting.slotsSummary?.mainOperatorSlug ??
      mainSlot?.operatorSlug ??
      fallbackOperatorSlug ??
      "",
  ).trim();
  const mainWeaponSlug = String(
    setting.slotsSummary?.mainWeaponSlug ?? mainSlot?.form?.weaponSlug ?? "",
  ).trim();
  const mainOperator = operatorBySlug.get(mainOperatorSlug) as any;
  const weapon = weaponBySlug.get(mainWeaponSlug) as any;

  const memberOperatorSlugs =
    setting.slotsSummary?.memberOperatorSlugs ??
    [
      setting.slots?.member1?.operatorSlug,
      setting.slots?.member2?.operatorSlug,
      setting.slots?.member3?.operatorSlug,
    ];

  const partyMembers = memberOperatorSlugs
    .map((operatorSlug) => String(operatorSlug ?? "").trim())
    .filter(Boolean)
    .map((operatorSlug) => {
      const operator = operatorBySlug.get(operatorSlug) as any;
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
    isDefaultSetting: Boolean(setting.isDefaultSetting),
  };
}

export default function PopularOperatorSettingsPanel({
  operatorSlug,
  operatorName,
  operators,
  weapons,
}: {
  operatorSlug: string;
  operatorName: string;
  operators: PopularOperatorItem[];
  weapons: PopularWeaponItem[];
  accent?: string;
}) {
  const [settings, setSettings] = useState<PopularSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const operatorBySlug = new Map(
    operators.map((operator) => [operator.slug, operator]),
  );
  const weaponBySlug = new Map(
    weapons.map((weapon) => [weapon.slug, weapon]),
  );

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          operators: operatorSlug,
          sort: "popular",
          limit: "3",
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
    <section
      className="relative mb-3 min-w-0 overflow-hidden border border-ef-line bg-ef-card p-3 sm:p-4"
      style={CUT}
    >
      <span
        className="absolute left-0 top-0 h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }}
      />
      <div className="mb-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.26em] text-ef-accent-soft">
              Popular Settings
            </p>
            <span className="border border-ef-line px-1.5 py-0.5 font-mono text-[9px] font-black text-ef-muted" style={CUT_SM}>
              TOP 3
            </span>
          </div>
          <p className="mt-1.5 truncate text-xs text-ef-muted">
            {operatorName} 인기 세팅
          </p>
        </div>

        <Link
          href={`/settings?operators=${encodeURIComponent(operatorSlug)}`}
          className="inline-flex min-h-9 shrink-0 items-center border border-ef-line bg-ef-card2 px-3 text-xs font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
          style={CUT_SM}
        >
          전체 보기
        </Link>
      </div>

      {loading ? (
        <div className="border border-ef-line bg-ef-card2 p-3 text-xs font-bold text-ef-muted" style={CUT_SM}>
          인기 세팅을 불러오는 중입니다.
        </div>
      ) : settings.length === 0 ? (
        <div className="border border-ef-line bg-ef-card2 p-3 text-xs text-ef-muted" style={CUT_SM}>
          아직 등록된 {operatorName} 세팅이 없습니다.
          <div className="mt-2">
            <Link
              href="/settings/party"
              className="inline-flex px-3 py-1.5 text-xs font-black text-black transition hover:brightness-110"
              style={{ ...CUT_SM, background: PRIMARY }}
            >
              첫 세팅 등록하기
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {settings.map((setting) => (
            <SettingCard
              key={setting.id}
              setting={toSettingCardItem(
                setting,
                operatorSlug,
                operatorBySlug,
                weaponBySlug,
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SettingCard({ setting }: { setting: SettingCardItem }) {
  return (
    <Link
      href={`/settings/${setting.id}`}
      className="group block min-w-0 overflow-hidden border border-ef-line bg-black transition hover:-translate-y-0.5 hover:border-ef-accent/45"
      style={CUT_SM}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        <Image
          src={setting.image}
          alt={setting.operatorName}
          fill
          sizes="(max-width: 1024px) 30vw, 180px"
          className="object-cover object-center transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

        <div className="absolute left-1.5 top-1.5 flex items-center gap-1">
          {setting.elementIcon ? (
            <div className="flex h-5 w-5 items-center justify-center">
              <Image
                src={setting.elementIcon}
                alt="속성"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
          ) : null}

          <span
            className={[
              "border px-1 py-0.5 font-mono text-[8px] font-black uppercase tracking-wide backdrop-blur-sm sm:text-[9px]",
              setting.type === "solo"
                ? "border-ef-accent/40 text-ef-accent"
                : "border-sky-300/40 text-sky-200",
            ].join(" ")}
            style={{ ...CUT_SM, background: setting.type === "solo" ? "rgba(255,210,74,0.15)" : "rgba(125,211,252,0.15)" }}
          >
            {settingTypeLabelMap[setting.type]}
          </span>
        </div>

        {setting.type === "party" && setting.partyMembers?.length ? (
          <div className="absolute right-1.5 top-1.5 flex gap-0.5">
            {setting.partyMembers.slice(0, 2).map((member) => (
              <div
                key={member.operatorSlug}
                className="relative h-6 w-6 overflow-hidden border border-ef-line bg-black sm:h-7 sm:w-7"
                style={CUT_SM}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="28px"
                  className="object-cover"
                />

                {member.elementIcon ? (
                  <Image src={member.elementIcon} alt="" width={10} height={10} className="absolute bottom-0 right-0 bg-black/80" />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {setting.weaponImage ? (
          <div className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center border border-ef-line bg-black/50 backdrop-blur-sm" style={CUT_SM}>
            <Image
              src={setting.weaponImage}
              alt={setting.weaponName}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        ) : null}

        <div className="absolute bottom-0 left-0 right-8 px-2 py-1.5">
          <h3 className="truncate text-[10px] font-black text-white drop-shadow sm:text-xs">
            {setting.operatorName}
          </h3>
        </div>
      </div>

      <div className="flex min-h-[68px] flex-col border-t border-ef-line bg-ef-card2 p-2">
        <h2 className="line-clamp-2 text-[10px] font-black leading-[14px] text-ef-accent sm:text-[11px] sm:leading-[15px]">
          {setting.title}
        </h2>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-1 pt-1.5 text-[8px] font-bold sm:text-[9px]">
          <span className="truncate text-ef-muted">{setting.nickname}</span>
          <span className="shrink-0 text-ef-accent-soft">
            추천 {setting.likes} · 조회 {setting.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
