import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import { prisma } from "@/lib/prisma";

type SettingType = "solo" | "party";
type SortType = "latest" | "popular" | "views";

type OperatorSettingListItem = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  slots: any;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  viewCount: number;
  nickname: string | null;
  user: {
    nickname: string | null;
  } | null;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;
const DEFAULT_SETTING_NICKNAME = "red9839";

const operatorSearchMap = new Map(
  operatorDetails.map((operator: any) => [
    operator.slug,
    [operator.name, operator.enName, operator.slug].filter(Boolean).join(" "),
  ]),
);

const weaponSearchMap = new Map(
  weaponDetails.map((weapon: any) => [
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

function getPageParam(value: string | null) {
  const page = Number(value ?? DEFAULT_PAGE);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : DEFAULT_PAGE;
}

function getLimitParam(value: string | null) {
  const limit = Number(value ?? DEFAULT_LIMIT);
  if (!Number.isFinite(limit) || limit <= 0) return DEFAULT_LIMIT;
  return Math.min(Math.floor(limit), MAX_LIMIT);
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

function getSettingSearchText(setting: OperatorSettingListItem) {
  const operatorSlugs = getSettingOperatorSlugs(setting.slots);
  const weaponSlug = getSettingWeaponSlug(setting.slots);

  return [
    getSettingNickname(setting),
    setting.title,
    setting.description,
    ...operatorSlugs,
    ...operatorSlugs.map((slug) => operatorSearchMap.get(slug)),
    weaponSlug,
    weaponSearchMap.get(weaponSlug),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function sortSettings(settings: OperatorSettingListItem[], sortType: SortType) {
  return [...settings].sort((a, b) => {
    const defaultPriority = Number(isDefaultSetting(a)) - Number(isDefaultSetting(b));
    if (defaultPriority !== 0) return defaultPriority;

    const aCreatedAt = a.createdAt.toISOString();
    const bCreatedAt = b.createdAt.toISOString();

    if (sortType === "popular") {
      return b.likeCount - a.likeCount || bCreatedAt.localeCompare(aCreatedAt);
    }

    if (sortType === "views") {
      return b.viewCount - a.viewCount || bCreatedAt.localeCompare(aCreatedAt);
    }

    return bCreatedAt.localeCompare(aCreatedAt);
  });
}

function toListResponseItem(setting: OperatorSettingListItem) {
  const nickname = setting.nickname ?? setting.user?.nickname ?? null;

  return {
    id: setting.id,
    type: normalizeSettingType(setting.type),
    title: setting.title,
    description: setting.description,
    slots: setting.slots,
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt,
    likeCount: setting.likeCount,
    viewCount: setting.viewCount,
    nickname,
    userNickname: nickname,
    isDefaultSetting: isDefaultSetting(setting),
  };
}

const listSelect = {
  id: true,
  type: true,
  title: true,
  description: true,
  slots: true,
  createdAt: true,
  updatedAt: true,
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
    return [{ likeCount: "desc" as const }, { createdAt: "desc" as const }];
  }

  if (sortType === "views") {
    return [{ viewCount: "desc" as const }, { createdAt: "desc" as const }];
  }

  return [{ createdAt: "desc" as const }];
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

async function getPagedSettingsWithoutClientFilters({
  settingType,
  sortType,
  page,
  limit,
}: {
  settingType: SettingType | "all";
  sortType: SortType;
  page: number;
  limit: number;
}) {
  const baseWhere = getBaseWhere(settingType);
  const nonDefaultWhere = {
    ...baseWhere,
    ...getNicknameWhere(false),
  };
  const defaultWhere = {
    ...baseWhere,
    ...getNicknameWhere(true),
  };
  const orderBy = getOrderBy(sortType);
  const start = (page - 1) * limit;

  const [nonDefaultTotal, defaultTotal] = await Promise.all([
    prisma.userOperatorSetting.count({ where: nonDefaultWhere }),
    prisma.userOperatorSetting.count({ where: defaultWhere }),
  ]);

  const total = nonDefaultTotal + defaultTotal;
  const nonDefaultTake = Math.max(
    0,
    Math.min(limit, nonDefaultTotal - Math.min(start, nonDefaultTotal)),
  );
  const defaultTake = limit - nonDefaultTake;

  const nonDefaultSettings =
    nonDefaultTake > 0
      ? await prisma.userOperatorSetting.findMany({
          where: nonDefaultWhere,
          orderBy,
          skip: Math.min(start, nonDefaultTotal),
          take: nonDefaultTake,
          select: listSelect,
        })
      : [];

  const defaultStart = Math.max(0, start - nonDefaultTotal);
  const defaultSettings =
    defaultTake > 0
      ? await prisma.userOperatorSetting.findMany({
          where: defaultWhere,
          orderBy,
          skip: defaultStart,
          take: defaultTake,
          select: listSelect,
        })
      : [];

  return {
    total,
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
  const { searchParams } = new URL(request.url);
  const keyword = cleanSearchParam(searchParams.get("keyword"));
  const typeParam = cleanSearchParam(searchParams.get("type"));
  const sortParam = cleanSearchParam(searchParams.get("sort"));
  const operatorFilters = splitListParam(searchParams.get("operators"));
  const weaponFilter = cleanSearchParam(searchParams.get("weapon"));
  const page = getPageParam(searchParams.get("page"));
  const limit = getLimitParam(searchParams.get("limit"));

  const settingType: SettingType | "all" =
    typeParam === "solo" || typeParam === "party" ? typeParam : "all";
  const sortType: SortType =
    sortParam === "popular" || sortParam === "views" ? sortParam : "latest";
  const keywordQueries = keyword
    .split("/")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const hasClientOnlyFilters =
    keywordQueries.length > 0 || operatorFilters.length > 0 || Boolean(weaponFilter);

  if (!hasClientOnlyFilters) {
    const start = (page - 1) * limit;
    const result = await getPagedSettingsWithoutClientFilters({
      settingType,
      sortType,
      page,
      limit,
    });

    return NextResponse.json({
      ok: true,
      page,
      limit,
      total: result.total,
      hasMore: start + limit < result.total,
      settings: result.settings.map(toListResponseItem),
    });
  }

  const settings = await prisma.userOperatorSetting.findMany({
    where: settingType === "all" ? undefined : { type: settingType },
    orderBy: { updatedAt: "desc" },
    select: listSelect,
  });

  const filteredSettings = settings.filter((setting) => {
    const operatorSlugs = getSettingOperatorSlugs(setting.slots);
    const weaponSlug = getSettingWeaponSlug(setting.slots);
    const searchableText = getSettingSearchText(setting);

    const matchesKeyword =
      keywordQueries.length === 0 ||
      keywordQueries.every((query) => searchableText.includes(query));
    const matchesOperator =
      operatorFilters.length === 0 ||
      operatorFilters.some((operatorSlug) => operatorSlugs.includes(operatorSlug));
    const matchesWeapon = !weaponFilter || weaponSlug === weaponFilter;

    return matchesKeyword && matchesOperator && matchesWeapon;
  });

  const total = filteredSettings.length;
  const start = (page - 1) * limit;
  const pagedSettings = sortSettings(filteredSettings, sortType).slice(
    start,
    start + limit,
  );

  return NextResponse.json({
    ok: true,
    page,
    limit,
    total,
    hasMore: start + limit < total,
    settings: pagedSettings.map(toListResponseItem),
  });
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
  const title = String(body?.title ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const slots = body?.slots;
  const cycle = Array.isArray(body?.cycle) ? body.cycle : [];
  const bodyNickname = String(
    body?.userNickname ?? body?.authorNickname ?? body?.nickname ?? "",
  ).trim();
  const nickname = bodyNickname || getUserNickname(user) || null;

  if (!title) {
    return NextResponse.json(
      { ok: false, message: "세팅 제목을 입력해주세요." },
      { status: 400 },
    );
  }

  if (!slots?.main?.operatorSlug) {
    return NextResponse.json(
      { ok: false, message: "메인 오퍼레이터를 먼저 등록해주세요." },
      { status: 400 },
    );
  }

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
