"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  SelectOperatorItem,
  SelectWeaponItem,
} from "@/app/components/select/CommonSelectPanel";

// ===== 오퍼레이터/무기/장비 목록과 통일한 Endfield SF 디자인 토큰 =====
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

const MAX_OPERATOR_FILTERS = 4;
const SETTINGS_PAGE_LIMIT = 24;

const CommonSelectPanel = dynamic(
  () => import("@/app/components/select/CommonSelectPanel"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 text-sm font-bold text-ef-muted backdrop-blur-sm">
        선택 패널을 불러오는 중...
      </div>
    ),
  },
);

type SettingType = "solo" | "party";
type SortType = "latest" | "popular" | "views";

const settingTypeLabelMap: Record<SettingType, string> = {
  solo: "단일",
  party: "파티",
};

type PartyMember = {
  name: string;
  image: string;
  operatorSlug: string;
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
  operatorSlugs: string[];
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
  isDefaultSetting: boolean;
};

type ApiSetting = {
  id: string;
  type: SettingType;
  title: string;
  description?: string | null;
  slots?: any;
  createdAt: string;
  likeCount?: number | null;
  viewCount?: number | null;
  likes?: number | null;
  views?: number | null;
  nickname?: string | null;
  userNickname?: string | null;
  authorNickname?: string | null;
  userName?: string | null;
  authorName?: string | null;
  user?: {
    nickname?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  author?: {
    nickname?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  profile?: { nickname?: string | null; name?: string | null } | null;
  isDefaultSetting?: boolean;
  slotsSummary?: {
    mainOperatorSlug?: string;
    memberOperatorSlugs?: string[];
    mainWeaponSlug?: string;
  };
};

function getOperatorImage(operator: any) {
  return (
    operator?.avatar ??
    operator?.image ??
    `/operators/${operator?.slug}/avatar.webp`
  );
}

function getOperatorElementIcon(operator: any) {
  const element =
    operator?.element ?? operator?.elementKey ?? operator?.attribute;
  return element ? `/icons/elements/${element}.webp` : "";
}

function getSettingNickname(setting: ApiSetting) {
  return String(
    setting.nickname ??
      setting.userNickname ??
      setting.authorNickname ??
      setting.userName ??
      setting.authorName ??
      setting.user?.nickname ??
      setting.user?.name ??
      setting.author?.nickname ??
      setting.author?.name ??
      setting.profile?.nickname ??
      setting.profile?.name ??
      "저장된 세팅",
  );
}

function toSettingItem(
  setting: ApiSetting,
  operatorBySlug: Map<string, SelectOperatorItem>,
  weaponBySlug: Map<string, SelectWeaponItem>,
): SettingItem {
  const mainSlot = setting.slots?.main;
  const mainOperatorSlug = String(
    setting.slotsSummary?.mainOperatorSlug ?? mainSlot?.operatorSlug ?? "",
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

  const operatorSlugs = Array.from(
    new Set(
      [
        mainOperator?.slug ?? mainOperatorSlug,
        ...partyMembers.map((member) => member.operatorSlug),
      ].filter(Boolean),
    ),
  );

  return {
    id: setting.id,
    title: setting.title,
    description: setting.description ?? "",
    nickname: getSettingNickname(setting),
    operatorName: mainOperator?.name ?? mainSlot?.operatorSlug ?? "오퍼레이터",
    operatorEnName: mainOperator?.enName ?? "",
    operatorSlug: mainOperator?.slug ?? mainSlot?.operatorSlug ?? "",
    operatorSlugs,
    weaponName: weapon?.name ?? "무기 미등록",
    weaponSlug: weapon?.slug ?? mainSlot?.form?.weaponSlug ?? "",
    weaponImage: weapon?.image ?? weapon?.avatar,
    type: setting.type,
    likes: Number(setting.likeCount ?? setting.likes ?? 0),
    views: Number(setting.viewCount ?? setting.views ?? 0),
    createdAt: setting.createdAt,
    image: mainOperator
      ? getOperatorImage(mainOperator)
      : "/operators/rossi/avatar.webp",
    elementIcon: mainOperator
      ? getOperatorElementIcon(mainOperator)
      : undefined,
    partyMembers,
    isDefaultSetting: Boolean(setting.isDefaultSetting),
  };
}

function buildSettingsApiUrl({
  keyword,
  settingType,
  sortType,
  operatorFilters,
  weaponFilter,
  page,
}: {
  keyword: string;
  settingType: SettingType | "all";
  sortType: SortType;
  operatorFilters: string[];
  weaponFilter: string;
  page: number;
}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(SETTINGS_PAGE_LIMIT));

  if (keyword.trim()) params.set("keyword", keyword.trim());
  if (settingType !== "all") params.set("type", settingType);
  if (sortType !== "latest") params.set("sort", sortType);
  if (operatorFilters.length) params.set("operators", operatorFilters.join(","));
  if (weaponFilter) params.set("weapon", weaponFilter);
  return `/api/operator-settings?${params.toString()}`;
}

type InitialSettingsData = {
  settings: ApiSetting[];
  total: number;
  hasMore: boolean;
  page: number;
};

type SettingsPageClientProps = {
  operators: SelectOperatorItem[];
  weapons: SelectWeaponItem[];
  initialOperatorFilters?: string[];
  initialData?: InitialSettingsData;
};

export default function SettingsPageClient({
  operators,
  weapons,
  initialOperatorFilters = [],
  initialData,
}: SettingsPageClientProps) {
  const operatorBySlug = useMemo(
    () => new Map(operators.map((operator) => [operator.slug, operator])),
    [operators],
  );
  const weaponBySlug = useMemo(
    () => new Map(weapons.map((weapon) => [weapon.slug, weapon])),
    [weapons],
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [settingType, setSettingType] = useState<SettingType | "all">("all");
  const [sortType, setSortType] = useState<SortType>("latest");
  const [settings, setSettings] = useState<SettingItem[]>(() =>
    (initialData?.settings ?? []).map((setting) =>
      toSettingItem(setting, operatorBySlug, weaponBySlug),
    ),
  );
  const [totalCount, setTotalCount] = useState(initialData?.total ?? 0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(Boolean(initialData?.hasMore));
  const [loading, setLoading] = useState(!initialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [operatorFilters, setOperatorFilters] = useState<string[]>(
    initialOperatorFilters,
  );
  const [operatorFilterNames, setOperatorFilterNames] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      initialOperatorFilters.map((slug) => [
        slug,
        operatorBySlug.get(slug)?.name ?? slug,
      ]),
    ),
  );

  const [weaponFilter, setWeaponFilter] = useState("");
  const [weaponFilterName, setWeaponFilterName] = useState("");

  const [selectPanel, setSelectPanel] = useState<"operator" | "weapon" | null>(
    null,
  );
  const settingsRequestRef = useRef<AbortController | null>(null);
  // 서버에서 1페이지를 프리페치했으면 마운트 시 첫 fetch를 건너뛴다(필터 변경 시에만 재요청).
  const skipInitialLoadRef = useRef(Boolean(initialData));

  const loadSettings = useCallback(
    async (targetPage: number, mode: "replace" | "append") => {
      settingsRequestRef.current?.abort();
      const controller = new AbortController();
      settingsRequestRef.current = controller;

      if (mode === "replace") setLoading(true);
      else setLoadingMore(true);
      try {
        const response = await fetch(
          buildSettingsApiUrl({
            keyword: debouncedKeyword,
            settingType,
            sortType,
            operatorFilters,
            weaponFilter,
            page: targetPage,
          }),
          { cache: "no-store", signal: controller.signal },
        );
        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.ok) {
          if (mode === "replace") {
            setSettings([]);
            setTotalCount(0);
            setPage(1);
            setHasMore(false);
          }
          return;
        }

        const nextSettings = (data.settings ?? []).map((setting: ApiSetting) =>
          toSettingItem(setting, operatorBySlug, weaponBySlug),
        );

        setSettings((prev) =>
          mode === "append" ? [...prev, ...nextSettings] : nextSettings,
        );
        setTotalCount(Number(data.total ?? nextSettings.length));
        setPage(Number(data.page ?? targetPage));
        setHasMore(Boolean(data.hasMore));
      } catch {
        if (controller.signal.aborted) return;

        if (mode === "replace") {
          setSettings([]);
          setTotalCount(0);
          setPage(1);
          setHasMore(false);
        }
      } finally {
        if (settingsRequestRef.current !== controller) return;
        settingsRequestRef.current = null;

        if (mode === "replace") setLoading(false);
        else setLoadingMore(false);
      }
    },
    [
      debouncedKeyword,
      settingType,
      sortType,
      operatorFilters,
      weaponFilter,
      operatorBySlug,
      weaponBySlug,
    ],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    if (skipInitialLoadRef.current) {
      skipInitialLoadRef.current = false;
      return;
    }

    loadSettings(1, "replace");

    return () => {
      settingsRequestRef.current?.abort();
    };
  }, [loadSettings]);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);

        if (!mounted) return;
        setIsLoggedIn(Boolean(data?.user));
      } catch {
        if (mounted) setIsLoggedIn(false);
      }
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const activeFilterCount = [
    keyword.trim() ? 1 : 0,
    settingType !== "all" ? 1 : 0,
    sortType !== "latest" ? 1 : 0,
    operatorFilters.length,
    weaponFilter ? 1 : 0,
  ].reduce((sum, value) => sum + value, 0);

  function addOperatorFilter(slug: string) {
    const matched = operatorBySlug.get(slug) as any;

    setOperatorFilters((prev) => {
      if (prev.includes(slug)) return prev;
      if (prev.length >= MAX_OPERATOR_FILTERS) return prev;
      return [...prev, slug];
    });

    setOperatorFilterNames((prev) => ({
      ...prev,
      [slug]: matched?.name ?? slug,
    }));
  }

  function removeOperatorFilter(slug: string) {
    setOperatorFilters((prev) => prev.filter((item) => item !== slug));
    setOperatorFilterNames((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-ef-ink sm:px-4 md:px-6 md:py-5">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative z-10 mx-auto max-w-[1840px] overflow-x-clip">
        <header
          className="relative mb-3 overflow-hidden border border-ef-line bg-ef-card2 p-4 sm:mb-5 sm:p-5"
          style={CUT}
        >
          <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
          <div className="flex items-start justify-between gap-3 max-[419px]:flex-col">
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ef-muted">
                User Settings
              </p>

              <h1 className="mt-1.5 break-keep text-2xl font-black leading-[0.95] tracking-tight text-white sm:text-4xl">
                오퍼레이터 세팅
              </h1>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2 max-[419px]:w-full sm:flex sm:flex-wrap sm:justify-end">
              {isLoggedIn ? (
                <Link
                  href="/settings/party"
                  className="flex min-h-11 items-center justify-center px-3 py-2 text-xs font-black text-black transition hover:brightness-110 sm:px-5 sm:text-sm"
                  style={{ ...CUT_SM, background: ACCENT }}
                >
                  <span className="sm:hidden">등록</span>
                  <span className="hidden sm:inline">오퍼레이터 세팅 등록</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex min-h-11 items-center justify-center border border-ef-line bg-ef-card px-3 py-2 text-xs font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft sm:px-5 sm:text-sm"
                  style={CUT_SM}
                >
                  <span className="sm:hidden">로그인</span>
                  <span className="hidden sm:inline">로그인 후 세팅 등록</span>
                </Link>
              )}

              <Link
                href="/"
                className="flex min-h-11 items-center justify-center border border-ef-line bg-ef-card px-3 py-2 text-xs font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft sm:px-4 sm:text-sm"
                style={CUT_SM}
              >
                홈
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5">
          <aside
            className="sticky top-2 z-30 border border-ef-line bg-ef-card2 lg:top-5 lg:flex lg:max-h-[calc(100vh-40px)] lg:flex-col lg:overflow-hidden"
            style={CUT}
          >
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 border-b border-ef-line px-4 py-3 text-left lg:hidden"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                  Search / Filter
                </span>

                <span className="mt-1 block truncate text-xs text-ef-muted">
                  닉네임, 제목, 오퍼레이터, 무기, 유형, 정렬
                  {activeFilterCount > 0 ? ` · 적용 ${activeFilterCount}` : ""}
                </span>
              </span>

              <span
                className={[
                  "shrink-0 text-lg font-black text-ef-accent transition-transform",
                  isFilterOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                ▼
              </span>
            </button>

            <div
              className={isFilterOpen ? "block lg:block" : "hidden lg:block"}
            >
              <div className="shrink-0 border-b border-ef-line p-3 sm:p-4">
                <h2 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                  검색
                </h2>

                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="닉네임 / 제목 / 오퍼레이터 검색"
                  className="h-10 w-full border border-ef-line bg-ef-card px-3 text-xs text-white outline-none placeholder:text-ef-muted/70 focus:border-ef-accent/50 sm:h-9"
                  style={CUT_SM}
                />
              </div>

              <div className="p-3 sm:p-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                <FilterGroup
                  title={`오퍼레이터 (${operatorFilters.length}/${MAX_OPERATOR_FILTERS})`}
                >
                  {operatorFilters.length ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setOperatorFilters([]);
                          setOperatorFilterNames({});
                        }}
                        className="h-[36px] min-w-0 border border-ef-line bg-ef-card px-3 text-left text-[11px] font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft lg:h-[38px]"
                        style={CUT_SM}
                      >
                        전체 선택 취소
                      </button>

                      {operatorFilters.map((slug) => (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => removeOperatorFilter(slug)}
                          className="h-[36px] min-w-0 border px-3 text-left text-[11px] font-black text-white transition hover:brightness-110 lg:h-[38px] lg:w-full"
                          style={{
                            ...CUT_SM,
                            borderColor: ACCENT,
                            background: `${ACCENT}22`,
                          }}
                          title="클릭하면 선택 취소"
                        >
                          <span className="block truncate">
                            × {operatorFilterNames[slug] ?? slug}
                          </span>
                        </button>
                      ))}
                    </>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setSelectPanel("operator")}
                    disabled={operatorFilters.length >= MAX_OPERATOR_FILTERS}
                    className="h-[36px] min-w-0 border px-3 text-left text-[12px] font-black transition hover:border-ef-accent/40 disabled:cursor-not-allowed disabled:opacity-45 lg:h-[38px] lg:w-full"
                    style={
                      operatorFilters.length
                        ? { ...CUT_SM, borderColor: ACCENT, background: `${ACCENT}22`, color: "#ffffff" }
                        : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }
                    }
                  >
                    <span className="block truncate">
                      {operatorFilters.length >= MAX_OPERATOR_FILTERS
                        ? "최대 4명 선택됨"
                        : "오퍼레이터 추가"}
                    </span>
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
                      className="h-[36px] min-w-0 border border-ef-line bg-ef-card px-3 text-left text-[11px] font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft lg:h-[38px]"
                      style={CUT_SM}
                    >
                      선택 취소
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setSelectPanel("weapon")}
                    className="h-[36px] min-w-0 border px-3 text-left text-[12px] font-black transition hover:border-ef-accent/40 lg:h-[38px] lg:w-full"
                    style={
                      weaponFilter
                        ? { ...CUT_SM, borderColor: ACCENT, background: `${ACCENT}22`, color: "#ffffff" }
                        : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }
                    }
                  >
                    <span className="block truncate">
                      {weaponFilterName || "무기 선택"}
                    </span>
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
                    label="단일"
                    onClick={() => setSettingType("solo")}
                  />
                  <FilterButton
                    active={settingType === "party"}
                    label="파티"
                    onClick={() => setSettingType("party")}
                  />
                </FilterGroup>

                <FilterGroup title="정렬" last>
                  <FilterButton
                    active={sortType === "latest"}
                    label="최신순"
                    onClick={() => setSortType("latest")}
                  />
                  <FilterButton
                    active={sortType === "popular"}
                    label="인기순"
                    onClick={() => setSortType("popular")}
                  />
                  <FilterButton
                    active={sortType === "views"}
                    label="조회순"
                    onClick={() => setSortType("views")}
                  />
                </FilterGroup>
              </div>
            </div>
          </aside>

          <section
            className="min-w-0 border border-ef-line bg-ef-card2 p-3"
            style={CUT}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-ef-line pb-3">
              <p className="text-sm text-ef-muted">
                총{" "}
                <span className="font-mono font-black tabular-nums" style={{ color: ACCENT }}>
                  {totalCount}
                </span>
                개 세팅
              </p>

              {settings.length > 0 ? (
                <p className="text-xs text-ef-muted">
                  <span className="font-mono tabular-nums" style={{ color: ACCENT }}>{settings.length}</span>개 표시 중
                </p>
              ) : null}
            </div>

            {loading ? (
              <div className="flex h-[300px] items-center justify-center border border-ef-line bg-ef-card text-sm text-ef-muted sm:h-[420px]" style={CUT_SM}>
                세팅 목록 불러오는 중...
              </div>
            ) : settings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(190px,220px))] sm:justify-between lg:gap-y-5">
                  {settings.map((setting) => (
                    <SettingCard key={setting.id} setting={setting} />
                  ))}
                </div>

                {hasMore ? (
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={() => loadSettings(page + 1, "append")}
                      disabled={loadingMore}
                      className="px-5 py-2.5 text-sm font-black text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ ...CUT_SM, background: ACCENT }}
                    >
                      {loadingMore ? "불러오는 중..." : "더 보기"}
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex h-[300px] items-center justify-center border border-ef-line bg-ef-card text-sm text-ef-muted sm:h-[420px]" style={CUT_SM}>
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
          operators={operators}
          weapons={weapons}
          gears={[]}
          selectedSlug={
            selectPanel === "operator"
              ? (operatorFilters[operatorFilters.length - 1] ?? "")
              : weaponFilter
          }
          requiredWeaponType={selectPanel === "weapon" ? "" : undefined}
          allowAllWeapons={selectPanel === "weapon"}
          onClose={() => setSelectPanel(null)}
          onSelectOperator={(slug: string) => {
            addOperatorFilter(slug);
            setSelectPanel(null);
          }}
          onSelectWeapon={(slug: string) => {
            const matched = weaponBySlug.get(slug) as any;
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
      className="group block w-full overflow-hidden border border-ef-line bg-ef-card2 transition hover:-translate-y-1 hover:border-ef-accent/40"
      style={CUT_SM}
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
              "border px-1.5 py-1 font-mono text-[9px] font-black uppercase backdrop-blur-sm sm:px-2 sm:text-[10px]",
              setting.type === "solo"
                ? "border-ef-accent/40 bg-ef-accent/15 text-ef-accent"
                : "border-sky-300/40 bg-sky-300/15 text-sky-200",
            ].join(" ")}
            style={CUT_SM}
          >
            {settingTypeLabelMap[setting.type]}
          </span>
        </div>

        {setting.type === "party" && setting.partyMembers?.length ? (
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            {setting.partyMembers.slice(0, 3).map((member) => (
              <div
                key={member.operatorSlug}
                className="relative h-8 w-8 overflow-hidden border border-ef-line bg-black sm:h-10 sm:w-10"
                style={CUT_SM}
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
          <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center border border-ef-line bg-black/50 backdrop-blur-sm sm:h-10 sm:w-10" style={CUT_SM}>
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

      <div className="flex min-h-[146px] flex-col border-t border-ef-line bg-ef-card px-2.5 pb-2 pt-2 sm:min-h-[158px] sm:px-3">
        <h2 className="line-clamp-2 text-[12px] font-black leading-[17px] text-ef-accent sm:text-[13px] sm:leading-[18px]">
          {setting.title}
        </h2>

        <p className="mt-1 line-clamp-5 break-words text-[10px] leading-[16px] text-ef-muted sm:text-[11px] sm:leading-[17px]">
          {setting.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1 pt-2 text-[9px] font-black sm:text-[10px]">
          <span className="max-w-full truncate text-ef-ink">
            {setting.nickname}
          </span>
          {setting.isDefaultSetting ? (
            <span className="border border-ef-accent/30 bg-ef-accent/10 px-1 font-mono uppercase text-ef-accent" style={CUT_SM}>
              기본 세팅
            </span>
          ) : null}
          <span className="text-ef-muted/50">|</span>
          <span className="font-mono tabular-nums text-ef-accent-soft">추천 {setting.likes}</span>
          <span className="text-ef-muted/50">|</span>
          <span className="font-mono tabular-nums text-ef-accent-soft">조회 {setting.views}</span>
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
      className="flex h-[36px] min-w-0 shrink-0 items-center gap-2 border px-3 text-left text-[12px] font-bold transition hover:border-ef-accent/40 lg:h-[38px] lg:w-full"
      style={
        active
          ? { ...CUT_SM, borderColor: ACCENT, background: `${ACCENT}22`, color: "#ffffff" }
          : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }
      }
    >
      <span className="shrink-0" style={{ color: active ? ACCENT : PRIMARY }}>
        ◆
      </span>
      <span className="min-w-0 truncate">{label}</span>
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
    <div className={last ? "" : "mb-4 lg:mb-5"}>
      <h2 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
        {title}
      </h2>

      <div className="flex flex-wrap gap-2 lg:flex-col">{children}</div>
    </div>
  );
}
