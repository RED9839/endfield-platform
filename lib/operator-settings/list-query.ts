import { gearSummaries } from "@/data/gear-summary-data";
import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";
import {
  DEFAULT_SETTINGS_LIMIT,
  DEFAULT_SETTINGS_PAGE,
  getGroupedPageWindow,
} from "@/lib/operator-settings/pagination";
import { prisma } from "@/lib/prisma";

// 장비 슬러그 → 세트명.
const gearSetBySlug = new Map(
  gearSummaries.map((gear) => [gear.slug, gear.setName]),
);

// 메인 슬롯 4개 장비(갑옷/장갑/부품1/부품2)에서 같은 세트가 3개 이상이면 활성 세트로 본다.
// 세팅 에디터의 getActiveSetEffect 와 동일한 임계값(>= 3).
function getActiveGearSet(slots: any): string {
  const form = slots?.main?.form ?? {};
  const slugs = [
    form.armorSlug,
    form.glovesSlug,
    form.kit1Slug,
    form.kit2Slug,
  ]
    .map((slug: unknown) => String(slug ?? "").trim())
    .filter(Boolean);

  const counts = new Map<string, number>();
  for (const slug of slugs) {
    const setName = gearSetBySlug.get(slug);
    if (!setName || setName === "세트 없음") continue;
    counts.set(setName, (counts.get(setName) ?? 0) + 1);
  }

  const active = [...counts.entries()].find(([, count]) => count >= 3);
  return active?.[0] ?? "";
}

// 오퍼레이터 세팅 목록 조회 로직. API 라우트(GET)와 서버 페이지 프리페치가 공유한다.

export type SettingType = "solo" | "party";
export type SortType = "latest" | "popular" | "views";

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

function getSettingNickname(
  setting: Pick<OperatorSettingListItem, "nickname" | "user">,
) {
  return String(setting.nickname ?? setting.user?.nickname ?? "").trim();
}

function isDefaultSetting(
  setting: Pick<OperatorSettingListItem, "nickname" | "user">,
) {
  return getSettingNickname(setting).toLowerCase() === DEFAULT_SETTING_NICKNAME;
}

function getMatchingSlugs(searchMap: Map<string, string>, query: string) {
  return Array.from(searchMap.entries())
    .filter(([, searchText]) => searchText.toLowerCase().includes(query))
    .map(([slug]) => slug);
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

function toListResponseItem(setting: OperatorSettingListItem) {
  const nickname = setting.nickname ?? setting.user?.nickname ?? null;
  const slots = setting.slots ?? {};

  return {
    id: setting.id,
    type: normalizeSettingType(setting.type),
    title: setting.title,
    description: setting.description,
    // API(JSON) 응답과 동일하도록 ISO 문자열로 직렬화 → 서버 프리페치 prop과 형태 일치.
    createdAt: setting.createdAt.toISOString(),
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
      // 활성 세트(4슬롯 중 같은 세트 3개 이상). 없으면 빈 문자열.
      gearSetName: getActiveGearSet(slots),
    },
  };
}

export type SettingsListItem = ReturnType<typeof toListResponseItem>;

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

export type SettingsListResult = {
  page: number;
  limit: number;
  total: number;
  nonDefaultTotal: number;
  defaultTotal: number;
  hasMore: boolean;
  settings: SettingsListItem[];
};

export async function getSettingsList(params: {
  keyword?: string;
  type?: string;
  sort?: string;
  page?: number;
  limit?: number;
  operatorFilters?: string[];
  weaponFilter?: string;
}): Promise<SettingsListResult> {
  const keyword = (params.keyword ?? "").trim();
  const settingType: SettingType | "all" =
    params.type === "solo" || params.type === "party" ? params.type : "all";
  const sortType: SortType =
    params.sort === "popular" || params.sort === "views"
      ? params.sort
      : "latest";
  const page = params.page ?? DEFAULT_SETTINGS_PAGE;
  const limit = params.limit ?? DEFAULT_SETTINGS_LIMIT;
  const operatorFilters = params.operatorFilters ?? [];
  const weaponFilter = (params.weaponFilter ?? "").trim();

  const keywordQueries = keyword
    .split("/")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const filterParts = [
    ...keywordQueries.map(getKeywordWhere),
    ...(operatorFilters.length
      ? [{ OR: getOperatorSlugFilters(operatorFilters) }]
      : []),
    ...(weaponFilter ? [{ OR: getWeaponSlugFilters([weaponFilter]) }] : []),
  ];

  const result = await getPagedSettings({
    settingType,
    sortType,
    page,
    limit,
    filters: filterParts.length ? { AND: filterParts } : undefined,
  });

  return {
    page,
    limit,
    total: result.total,
    nonDefaultTotal: result.nonDefaultTotal,
    defaultTotal: result.defaultTotal,
    hasMore: result.hasMore,
    settings: result.settings.map(toListResponseItem),
  };
}
