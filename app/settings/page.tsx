"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import CommonSelectPanel from "@/app/components/select/CommonSelectPanel";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const FILTER_BG = "#071019";

type SettingType = "solo" | "party";
type SortType = "popular" | "latest" | "views";

type PartyMember = {
  name: string;
  image: string;
  elementIcon?: string;
};

type SettingItem = {
  id: string;
  title: string;
  description: string;
  nickname: string;

  operatorName: string;
  operatorEnName: string;
  operatorSlug: string;

  weaponName: string;
  weaponSlug: string;
  weaponImage?: string;

  type: SettingType;
  likes: number;
  views: number;
  createdAt: string;

  image: string;
  elementIcon?: string;
  partyMembers?: PartyMember[];
};

const mockSettings: SettingItem[] = [
  {
    id: "1",
    title: "용조의 불꽃",
    description: "열기 피해와 치명타 피해를 같이 챙기는 메인 딜러 세팅입니다.",
    nickname: "3-H",
    operatorName: "로시",
    operatorEnName: "Rossi",
    operatorSlug: "rossi",
    weaponName: "용조의 불꽃",
    weaponSlug: "flame-of-draco",
    weaponImage: "/weapons/flame-of-draco.webp",
    type: "solo",
    likes: 322,
    views: 1540,
    createdAt: "2026.05.10",
    image: "/operators/rossi/avatar.webp",
    elementIcon: "/icons/elements/heat.webp",
  },
  {
    id: "2",
    title: "Controlled Ember Team Build",
    description:
      "열기 속성 중심 파티입니다. 메인 딜러 화력과 서포터 버프를 같이 사용합니다.",
    nickname: "Late Game",
    operatorName: "로시",
    operatorEnName: "Rossi",
    operatorSlug: "rossi",
    weaponName: "용조의 불꽃",
    weaponSlug: "flame-of-draco",
    weaponImage: "/weapons/flame-of-draco.webp",
    type: "party",
    likes: 302,
    views: 1880,
    createdAt: "2026.05.09",
    image: "/operators/rossi/avatar.webp",
    elementIcon: "/icons/elements/heat.webp",
    partyMembers: [
      {
        name: "로시",
        image: "/operators/rossi/avatar.webp",
        elementIcon: "/icons/elements/heat.webp",
      },
      {
        name: "질베르타",
        image: "/operators/gilberta/avatar.webp",
        elementIcon: "/icons/elements/electric.webp",
      },
      {
        name: "관리자",
        image: "/operators/administrator/avatar.webp",
        elementIcon: "/icons/elements/physical.webp",
      },
      {
        name: "자이히",
        image: "/operators/xaihi/avatar.webp",
        elementIcon: "/icons/elements/nature.webp",
      },
    ],
  },
  {
    id: "3",
    title: "황무지의 방랑자",
    description:
      "궁극기 충전 효율과 전기 피해를 중심으로 구성한 솔로 세팅입니다.",
    nickname: "Boss",
    operatorName: "질베르타",
    operatorEnName: "Gilberta",
    operatorSlug: "gilberta",
    weaponName: "황무지의 방랑자",
    weaponSlug: "wanderer-of-wasteland",
    weaponImage: "/weapons/wanderer-of-wasteland.webp",
    type: "solo",
    likes: 237,
    views: 1280,
    createdAt: "2026.05.08",
    image: "/operators/gilberta/avatar.webp",
    elementIcon: "/icons/elements/electric.webp",
  },
];

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const [settingType, setSettingType] = useState<SettingType | "all">("all");
  const [sortType, setSortType] = useState<SortType>("popular");

  const [operatorFilter, setOperatorFilter] = useState("");
  const [operatorFilterName, setOperatorFilterName] = useState("");

  const [weaponFilter, setWeaponFilter] = useState("");
  const [weaponFilterName, setWeaponFilterName] = useState("");

  const [selectPanel, setSelectPanel] = useState<"operator" | "weapon" | null>(
    null,
  );

  const filteredSettings = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return mockSettings
      .filter((setting) => {
        const matchesKeyword =
          q === "" ||
          setting.nickname.toLowerCase().includes(q) ||
          setting.operatorName.toLowerCase().includes(q) ||
          setting.operatorEnName.toLowerCase().includes(q) ||
          setting.title.toLowerCase().includes(q) ||
          setting.description.toLowerCase().includes(q);

        const matchesType =
          settingType === "all" || setting.type === settingType;

        const matchesOperator =
          !operatorFilter || setting.operatorSlug === operatorFilter;

        const matchesWeapon =
          !weaponFilter || setting.weaponSlug === weaponFilter;

        return (
          matchesKeyword && matchesType && matchesOperator && matchesWeapon
        );
      })
      .sort((a, b) => {
        if (sortType === "popular") return b.likes - a.likes;
        if (sortType === "views") return b.views - a.views;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [keyword, settingType, sortType, operatorFilter, weaponFilter]);

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white md:px-6">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-5 rounded-[24px] bg-[#05070b] p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                ENDFIELD SUPPORT PLATFORM
              </p>

              <h1
                className="mt-2 text-4xl font-black tracking-tight"
                style={{ color: YELLOW_TEXT }}
              >
                OPERATOR SETTINGS
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                유저 오퍼레이터 세팅 목록
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/settings/party"
                className="rounded-xl px-5 py-2 text-sm font-black text-black transition hover:brightness-110"
                style={{ background: YELLOW_MAIN }}
              >
                오퍼레이터 세팅 등록
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                홈으로
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside
            className="sticky top-5 flex max-h-[calc(100vh-40px)] flex-col overflow-hidden rounded-[24px] bg-[#05070b]"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="shrink-0 bg-[#05070b] p-4"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <h2
                className="mb-2 text-[11px] font-black tracking-[0.2em]"
                style={{ color: YELLOW_TEXT }}
              >
                검색
              </h2>

              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="닉네임 / 제목 / 오퍼레이터 검색"
                className="h-9 w-full rounded-xl border border-white/20 bg-[#071019] px-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-yellow-400/50"
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <FilterGroup title="오퍼레이터">
                {operatorFilter ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOperatorFilter("");
                      setOperatorFilterName("");
                    }}
                    className="h-8 rounded-lg border border-white/10 bg-black px-3 text-left text-[11px] font-bold text-zinc-400 hover:border-yellow-400/40 hover:text-yellow-300"
                  >
                    선택 취소
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setSelectPanel("operator")}
                  className="h-[38px] w-full rounded-xl border px-3 text-left text-[12px] font-black transition hover:bg-[#101923]"
                  style={{
                    borderColor: operatorFilter
                      ? YELLOW_MAIN
                      : "rgba(255, 204, 77, 0.18)",
                    background: operatorFilter ? `${YELLOW_MAIN}22` : FILTER_BG,
                    color: operatorFilter ? "#ffffff" : "#d4d4d8",
                  }}
                >
                  {operatorFilterName || "오퍼레이터 선택"}
                </button>
              </FilterGroup>

              <FilterGroup title="무기">
                {weaponFilter ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWeaponFilter("");
                      setWeaponFilterName("");
                    }}
                    className="h-8 rounded-lg border border-white/10 bg-black px-3 text-left text-[11px] font-bold text-zinc-400 hover:border-yellow-400/40 hover:text-yellow-300"
                  >
                    선택 취소
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setSelectPanel("weapon")}
                  className="h-[38px] w-full rounded-xl border px-3 text-left text-[12px] font-black transition hover:bg-[#101923]"
                  style={{
                    borderColor: weaponFilter
                      ? YELLOW_MAIN
                      : "rgba(255, 204, 77, 0.18)",
                    background: weaponFilter ? `${YELLOW_MAIN}22` : FILTER_BG,
                    color: weaponFilter ? "#ffffff" : "#d4d4d8",
                  }}
                >
                  {weaponFilterName || "무기 선택"}
                </button>
              </FilterGroup>

              <FilterGroup title="세팅 유형">
                <FilterButton
                  active={settingType === "all"}
                  label="전체"
                  onClick={() => setSettingType("all")}
                />
                <FilterButton
                  active={settingType === "solo"}
                  label="Solo"
                  onClick={() => setSettingType("solo")}
                />
                <FilterButton
                  active={settingType === "party"}
                  label="Party"
                  onClick={() => setSettingType("party")}
                />
              </FilterGroup>

              <FilterGroup title="정렬" last>
                <FilterButton
                  active={sortType === "popular"}
                  label="인기순"
                  onClick={() => setSortType("popular")}
                />
                <FilterButton
                  active={sortType === "latest"}
                  label="최신순"
                  onClick={() => setSortType("latest")}
                />
                <FilterButton
                  active={sortType === "views"}
                  label="조회순"
                  onClick={() => setSortType("views")}
                />
              </FilterGroup>
            </div>
          </aside>

          <section
            className="min-w-0 rounded-[24px] bg-[#05070b] p-3"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div
              className="mb-3 flex items-center justify-between pb-3"
              style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              <p className="text-sm text-zinc-400">
                총{" "}
                <span className="font-black" style={{ color: YELLOW_TEXT }}>
                  {filteredSettings.length}
                </span>
                개 세팅
              </p>
            </div>

            {filteredSettings.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,220px)] justify-between gap-y-5">
                {filteredSettings.map((setting) => (
                  <SettingCard key={setting.id} setting={setting} />
                ))}
              </div>
            ) : (
              <div className="flex h-[420px] items-center justify-center rounded-[18px] border border-white/10 bg-black text-sm text-zinc-500">
                조건에 맞는 세팅이 없습니다.
              </div>
            )}
          </section>
        </div>
      </div>

      {selectPanel ? (
        <CommonSelectPanel
          kind={selectPanel}
          title={selectPanel === "operator" ? "오퍼레이터 선택" : "무기 선택"}
          selectedSlug={selectPanel === "operator" ? operatorFilter : weaponFilter}
          onClose={() => setSelectPanel(null)}
          onSelectOperator={(slug: string) => {
            const matched = operatorDetails.find(
              (operator) => operator.slug === slug,
            );

            setOperatorFilter(slug);
            setOperatorFilterName(matched?.name ?? slug);
            setSelectPanel(null);
          }}
          onSelectWeapon={(slug: string) => {
            const matched = weaponDetails.find((weapon) => weapon.slug === slug);

            setWeaponFilter(slug);
            setWeaponFilterName(matched?.name ?? slug);
            setSelectPanel(null);
          }}
          onSelectGear={() => {}}
        />
      ) : null}
    </main>
  );
}

function SettingCard({ setting }: { setting: SettingItem }) {
  return (
    <Link
      href={`/settings/${setting.id}`}
      className="group block overflow-hidden rounded-[10px] border border-white/10 bg-black transition hover:-translate-y-1 hover:border-yellow-400/40"
      style={{ width: 220 }}
    >
      <div className="relative h-[255px] overflow-hidden bg-black">
        <Image
          src={setting.image}
          alt={setting.operatorName}
          fill
          sizes="220px"
          className="object-cover object-center transition duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        <div className="absolute left-2 top-2 flex items-center gap-1">
          {setting.elementIcon ? (
            <div className="flex h-8 w-8 items-center justify-center">
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
              "rounded-md border px-2 py-1 text-[10px] font-black backdrop-blur-sm",
              setting.type === "solo"
                ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-200"
                : "border-sky-300/40 bg-sky-300/15 text-sky-200",
            ].join(" ")}
          >
            {setting.type === "solo" ? "Solo" : "Party"}
          </span>
        </div>

        {setting.type === "party" && setting.partyMembers?.length ? (
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            {setting.partyMembers.slice(1, 4).map((member) => (
              <div
                key={member.name}
                className="relative h-10 w-10 overflow-hidden rounded-md border border-white/20 bg-black"
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
          <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-black/50 backdrop-blur-sm">
            <Image
              src={setting.weaponImage}
              alt={setting.weaponName}
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
          <h3 className="line-clamp-1 text-[15px] font-black text-white drop-shadow">
            {setting.operatorName}
          </h3>

          <p className="mt-0.5 line-clamp-1 text-[10px] font-bold text-zinc-300 drop-shadow">
            {setting.nickname}
          </p>
        </div>
      </div>

      <div className="flex min-h-[118px] flex-col border-t border-yellow-500/10 bg-black px-3 pb-2 pt-2">
        <h2 className="line-clamp-2 text-[13px] font-black leading-[18px] text-yellow-300">
          {setting.title}
        </h2>

        <p className="mt-1 line-clamp-2 text-[11px] leading-[17px] text-zinc-300">
          {setting.description}
        </p>

        <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-2 text-[11px] text-zinc-500">
          <span>조회 {setting.views}</span>
          <span>추천 {setting.likes}</span>
        </div>
      </div>
    </Link>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[38px] w-full items-center gap-2 rounded-xl border px-3 text-left text-[12px] font-bold transition hover:bg-[#101923]"
      style={{
        borderColor: active ? YELLOW_MAIN : "rgba(255, 204, 77, 0.18)",
        background: active ? `${YELLOW_MAIN}22` : FILTER_BG,
        color: active ? "#ffffff" : "#d4d4d8",
      }}
    >
      <span style={{ color: YELLOW_MAIN }}>◆</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function FilterGroup({
  title,
  children,
  last = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-5"}>
      <h2
        className="mb-2 text-[11px] font-black tracking-[0.2em]"
        style={{ color: YELLOW_TEXT }}
      >
        {title}
      </h2>

      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}