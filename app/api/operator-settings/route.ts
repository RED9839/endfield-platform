import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";
import { formatServerTiming } from "@/lib/http/server-timing";
import { enforceRateLimit } from "@/lib/http/rate-limit";
import {
  getGroupedPageWindow,
  getSettingsLimit,
  getSettingsPage,
} from "@/lib/operator-settings/pagination";
import { prisma } from "@/lib/prisma";
import { validateOperatorSettingInput } from "@/lib/operator-settings/validation";

type SettingType = "solo" | "party";
type SortType = "latest" | "popular" | "views";

type OperatorSettingListItem = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  slots: any;
  createdAt: Date;
  likeCount: number;
  viewCount: number;
  nickname: string | null;
  user: {
    nickname: string | null;
  } | null;
};

const DEFAULT_SETTING_NICKNAME = "red9839";

const operatorSearchMap = new Map(
  operatorSummaries.map((operator) => [
    operator.slug,
    [operator.name, operator.enName, operator.slug].filter(Boolean).join(" "),
  ]),
);

const weaponSearchMap = new Map(
  weaponSummaries.map((weapon) => [
    weapon.slug,
    [weapon.name, weapon.enName, weapon.slug].filter(Boolean).join(" "),
  ]),
);

function normalizeSettingType(type: string): SettingType {
  return type === "party" ? "party" : "solo";
}

function countRegisteredSlots(slots: any) {
  return [slots?.main, slots?.member1, slots?.member2, slots?.member3].filter(
    (slot) => Boolean(slot?.operatorSlug),
  ).length;
}

function getUserNickname(user: {
  nickname?: string | null;
  name?: string | null;
  email?: string | null;
}) {
  return String(user.nickname ?? "").trim();
}

function cleanSearchParam(value: string | null) {
  return String(value ?? "").trim();
}

function splitListParam(value: string | null) {
  return cleanSearchParam(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSettingNickname(setting: Pick<OperatorSettingListItem, "nickname" | "user">) {
  return String(setting.nickname ?? setting.user?.nickname ?? "").trim();
}

function isDefaultSetting(setting: Pick<OperatorSettingListItem, "nickname" | "user">) {
  return getSettingNickname(setting).toLowerCase() === DEFAULT_SETTING_NICKNAME;
}

function getSettingOperatorSlugs(slots: any) {
  return Array.from(
    new Set(
      [
        slots?.main?.operatorSlug,
        slots?.member1?.operatorSlug,
        slots?.member2?.operatorSlug,
        slots?.member3?.operatorSlug,
      ]
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  );
}

function getSettingWeaponSlug(slots: any) {
  return String(slots?.main?.form?.weaponSlug ?? "").trim();
}

function getMatchingSlugs(searchMap: Map<string, string>, query: string) {
  return Array.from(searchMap.entries())
    .filter(([, searchText]) => searchText.toLowerCase().includes(query))
    .map(([slug]) => slug);
}

function getKeywordWhere(query: string) {
  const matchingOperatorSlugs = getMatchingSlugs(operatorSearchMap, query);
  const matchingWeaponSlugs = getMatchingSlugs(weaponSearchMap, query);
  const insensitiveContains = {
    contains: query,
    mode: "insensitive" as const,
  };

  return {
    OR: [
      { title: insensitiveContains },
      { description: insensitiveContains },
      { nickname: insensitiveContains },
      {
        user: {
          is: {
            nickname: insensitiveContains,
          },
        },
      },
      ...getOperatorSlugFilters(matchingOperatorSlugs),
      ...getWeaponSlugFilters(matchingWeaponSlugs),
    ],
  };
}

const SLOT_KEYS = ["main", "member1", "member2", "member3"] as const;

function getOperatorSlugFilters(slugs: string[]) {
  return slugs.flatMap((slug) =>
    SLOT_KEYS.map((slotKey) => ({
      slots: {
        path: [slotKey, "operatorSlug"],
        equals: slug,
      },
    })),
  );
}

function getWeaponSlugFilters(slugs: string[]) {
  return slugs.map((slug) => ({
    slots: {
      path: ["main", "form", "weaponSlug"],
      equals: slug,
    },
  }));
}

function toListResponseItem(setting: OperatorSettingListItem) {
  const nickname = setting.nickname ?? setting.user?.nickname ?? null;
  const slots = setting.slots ?? {};

  return {
    id: setting.id,
    type: normalizeSettingType(setting.type),
    title: setting.title,
    description: setting.description,
    createdAt: setting.createdAt,
    likeCount: setting.likeCount,
    viewCount: setting.viewCount,
    nickname,
    userNickname: nickname,
    isDefaultSetting: isDefaultSetting(setting),
    slotsSummary: {
      mainOperatorSlug: String(slots?.main?.operatorSlug ?? ""),
      memberOperatorSlugs: [
        slots?.member1?.operatorSlug,
        slots?.member2?.operatorSlug,
        slots?.member3?.operatorSlug,
      ]
        .map((slug) => String(slug ?? "").trim())
        .filter(Boolean),
      mainWeaponSlug: String(slots?.main?.form?.weaponSlug ?? ""),
    },
  };
}

const listSelect = {
  id: true,
  type: true,
  title: true,
  description: true,
  slots: true,
  createdAt: true,
  likeCount: true,
  viewCount: true,
  nickname: true,
  user: {
    select: {
      nickname: true,
    },
  },
} as const;

function getOrderBy(sortType: SortType) {
  if (sortType === "popular") {
    return [
      { likeCount: "desc" as const },
      { createdAt: "desc" as const },
      { id: "desc" as const },
    ];
  }

  if (sortType === "views") {
    return [
      { viewCount: "desc" as const },
      { createdAt: "desc" as const },
      { id: "desc" as const },
    ];
  }

  return [{ createdAt: "desc" as const }, { id: "desc" as const }];
}

function getBaseWhere(settingType: SettingType | "all") {
  return settingType === "all" ? {} : { type: settingType };
}

function getNicknameWhere(defaultSetting: boolean) {
  const nickname = {
    equals: DEFAULT_SETTING_NICKNAME,
    mode: "insensitive" as const,
  };
  const defaultNicknameWhere = {
    OR: [
      { nickname },
      {
        user: {
          is: {
            nickname,
          },
        },
      },
    ],
  };

  return defaultSetting ? defaultNicknameWhere : { NOT: defaultNicknameWhere };
}

async function getPagedSettings({
  settingType,
  sortType,
  page,
  limit,
  filters,
}: {
  settingType: SettingType | "all";
  sortType: SortType;
  page: number;
  limit: number;
  filters?: Record<string, unknown>;
}) {
  const baseWhere = {
    ...getBaseWhere(settingType),
    ...filters,
  };
  const nonDefaultWhere = {
    ...baseWhere,
    ...getNicknameWhere(false),
  };
  const defaultWhere = {
    ...baseWhere,
    ...getNicknameWhere(true),
  };
  const orderBy = getOrderBy(sortType);
  const [nonDefaultTotal, defaultTotal] = await Promise.all([
    prisma.userOperatorSetting.count({ where: nonDefaultWhere }),
    prisma.userOperatorSetting.count({ where: defaultWhere }),
  ]);
  const window = getGroupedPageWindow({
    page,
    limit,
    primaryTotal: nonDefaultTotal,
    secondaryTotal: defaultTotal,
  });
  const [nonDefaultSettings, defaultSettings] = await Promise.all([
    window.primaryTake > 0
      ? prisma.userOperatorSetting.findMany({
          where: nonDefaultWhere,
          orderBy,
          skip: window.primarySkip,
          take: window.primaryTake,
          select: listSelect,
        })
      : Promise.resolve([]),
    window.secondaryTake > 0
      ? prisma.userOperatorSetting.findMany({
          where: defaultWhere,
          orderBy,
          skip: window.secondarySkip,
          take: window.secondaryTake,
          select: listSelect,
        })
      : Promise.resolve([]),
  ]);

  return {
    total: window.total,
    hasMore: window.hasMore,
    nonDefaultTotal,
    defaultTotal,
    settings: [...nonDefaultSettings, ...defaultSettings],
  };
}

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const sessionEmail = session.user.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.user.id },
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: {
      id: true,
      nickname: true,
      name: true,
      email: true,
    },
  });

  return user;
}

export async function GET(request: Request) {
  const startedAt = performance.now();
  const { searchParams } = new URL(request.url);
  const keyword = cleanSearchParam(searchParams.get("keyword"));
  const typeParam = cleanSearchParam(searchParams.get("type"));
  const sortParam = cleanSearchParam(searchParams.get("sort"));
  const operatorFilters = splitListParam(searchParams.get("operators"));
  const weaponFilter = cleanSearchParam(searchParams.get("weapon"));
  const page = getSettingsPage(searchParams.get("page"));
  const limit = getSettingsLimit(searchParams.get("limit"));

  const settingType: SettingType | "all" =
    typeParam === "solo" || typeParam === "party" ? typeParam : "all";
  const sortType: SortType =
    sortParam === "popular" || sortParam === "views" ? sortParam : "latest";
  const keywordQueries = keyword
    .split("/")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const filterParts = [
    ...keywordQueries.map(getKeywordWhere),
    ...(operatorFilters.length
      ? [{ OR: getOperatorSlugFilters(operatorFilters) }]
      : []),
    ...(weaponFilter
      ? [{ OR: getWeaponSlugFilters([weaponFilter]) }]
      : []),
  ];
  const dbStartedAt = performance.now();
  const result = await getPagedSettings({
    settingType,
    sortType,
    page,
    limit,
    filters: filterParts.length ? { AND: filterParts } : undefined,
  });
  const dbFinishedAt = performance.now();

  return NextResponse.json(
    {
      ok: true,
      page,
      limit,
      total: result.total,
      nonDefaultTotal: result.nonDefaultTotal,
      defaultTotal: result.defaultTotal,
      hasMore: result.hasMore,
      settings: result.settings.map(toListResponseItem),
    },
    {
      headers: {
        // 공개 목록(쿼리 파라미터별 결정적) → CDN에서 짧게 캐시하고 백그라운드 재검증.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Server-Timing": formatServerTiming([
          {
            name: "db",
            duration: dbFinishedAt - dbStartedAt,
            description: "settings queries",
          },
          {
            name: "total",
            duration: performance.now() - startedAt,
            description: "request total",
          },
        ]),
      },
    },
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const validation = validateOperatorSettingInput(body);

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, message: validation.message },
      { status: 400 },
    );
  }

  const rateLimit = await enforceRateLimit({
    scope: "operator-settings:create",
    identifier: user.id,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  const { title, description, slots, cycle } = validation.data;
  const bodyNickname = String(
    body?.userNickname ?? body?.authorNickname ?? body?.nickname ?? "",
  ).trim();
  const nickname = bodyNickname || getUserNickname(user) || null;

  const count = countRegisteredSlots(slots);
  const type = count >= 2 ? "party" : "solo";
  const setting = await prisma.userOperatorSetting.create({
    data: {
      userId: user.id,
      type,
      title,
      description: description || null,
      cycle,
      slots,
      nickname,
    },
  });

  return NextResponse.json({ ok: true, setting });
}
