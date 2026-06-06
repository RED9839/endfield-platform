import * as cheerio from "cheerio";
import { prisma } from "@/lib/prisma";

export type HomeNoticeType = "notice" | "event" | "news";
export type WeaponGroup = "normal" | "special";

export type ParsedItem = {
  id?: string;
  title: string;
  date: string;
  type: HomeNoticeType;
  href: string;
  image: string;
  detailImage?: string;
  bannerImage?: string;
  articleImage?: string;
  thumbnail?: string;
};

export type WeaponStackItem = {
  id: string;
  title: string;
  stack: number;
  group: WeaponGroup;
  image: string;
  href: string;
  publishedAt: string;
  createdAt: string;
  detailImage?: string;
  bannerImage?: string;
  articleImage?: string;
  thumbnail?: string;
};

export type HomeApiResponse = {
  ok: boolean;
  source: "official-news-list";
  fetchedAt: string;
  latest: ParsedItem[];
  notice: ParsedItem[];
  event: ParsedItem[];
  news: ParsedItem[];
  weaponStack: WeaponStackItem[];
  debug: {
    parsedCount: number;
    cache: "hit" | "miss";
    normalWeaponCount: number;
    specialWeaponCount: number;
    stackOperatorTitle: string;
  };
  message?: string;
};

type CheerioRoot = ReturnType<typeof cheerio.load>;
type CheerioAcceptedElement = Parameters<CheerioRoot>[0];
type CheerioNode = ReturnType<CheerioRoot>;

export const HOME_EDGE_CACHE_SECONDS = 300;
export const HOME_STALE_WHILE_REVALIDATE_SECONDS = 600;

const SITE = "https://endfield.gryphline.com";
const NEWS_URL = `${SITE}/ko-kr/news`;
const CACHE_TTL = 5 * 60 * 1000;

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
  Referer: SITE,
};

const WEAPON_A_IMAGE =
  "https://web-static.hg-cdn.com/upload/image/20260415/c08b7435381e80dba80b70453daf22d4.jpg";

const WEAPON_B_IMAGE =
  "https://web-static.hg-cdn.com/upload/image/20260325/46d8dbd41c064a8d1c469d9f3f8aa49e.png";

const WEAPON_C_IMAGE =
  "https://web-static.hg-cdn.com/upload/image/20260310/29486c6dc4d5ff64fb685d039d46d6b4.png";

const DEFAULT_NORMAL_WEAPON_STACK: WeaponStackItem[] = [
  {
    id: "weapon-a",
    title: "신아 신청",
    stack: 0,
    group: "normal",
    image: WEAPON_A_IMAGE,
    detailImage: WEAPON_A_IMAGE,
    bannerImage: WEAPON_A_IMAGE,
    articleImage: WEAPON_A_IMAGE,
    thumbnail: WEAPON_A_IMAGE,
    href: NEWS_URL,
    publishedAt: "2026.04.16",
    createdAt: "2026-04-16T00:00:00.000Z",
  },
  {
    id: "weapon-b",
    title: "적옥 신청",
    stack: 1,
    group: "normal",
    image: WEAPON_B_IMAGE,
    detailImage: WEAPON_B_IMAGE,
    bannerImage: WEAPON_B_IMAGE,
    articleImage: WEAPON_B_IMAGE,
    thumbnail: WEAPON_B_IMAGE,
    href: NEWS_URL,
    publishedAt: "2026.03.28",
    createdAt: "2026-03-28T00:00:00.000Z",
  },
  {
    id: "weapon-c",
    title: "항해 신청",
    stack: 2,
    group: "normal",
    image: WEAPON_C_IMAGE,
    detailImage: WEAPON_C_IMAGE,
    bannerImage: WEAPON_C_IMAGE,
    articleImage: WEAPON_C_IMAGE,
    thumbnail: WEAPON_C_IMAGE,
    href: NEWS_URL,
    publishedAt: "2026.03.11",
    createdAt: "2026-03-11T00:00:00.000Z",
  },
];

let cachedResponse: HomeApiResponse | null = null;
let cachedAt = 0;
let normalWeaponStack: WeaponStackItem[] = [];
let specialWeaponStack: WeaponStackItem[] = [];
let lastStackOperatorTitle = "";

function abs(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${SITE}${url}`;
  return `${SITE}/${url}`;
}

function clean(value?: string | null) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function getDate(text: string) {
  return text.match(/\d{4}\.\d{2}\.\d{2}/)?.[0] ?? "";
}

function dateToTime(date: string) {
  const parsed = new Date(`${date.replace(/\./g, "-")}T00:00:00+09:00`);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function getType(text: string): HomeNoticeType | null {
  if (text.includes("공지")) return "notice";
  if (text.includes("이벤트")) return "event";
  if (text.includes("뉴스")) return "news";
  return null;
}

function getImageFromRoot(root: CheerioNode) {
  const imageEl = root.find("img").first();

  return abs(
    imageEl.attr("src") ||
      imageEl.attr("data-src") ||
      imageEl.attr("data-original") ||
      imageEl.attr("data-lazy-src") ||
      imageEl.attr("data-actualsrc") ||
      "",
  );
}

function getTitleFromRoot(root: CheerioNode, fullText: string, date: string) {
  const imageAlt = root.find("img[alt]").first().attr("alt");

  const title =
    clean(root.find(".title").first().text()) ||
    clean(root.find("h3").first().text()) ||
    clean(root.find("h2").first().text()) ||
    clean(root.find("p").first().text()) ||
    clean(imageAlt);

  if (title) return title;

  const lines = fullText
    .split(/\n+/)
    .map((value) => clean(value))
    .filter(Boolean);

  for (const line of lines) {
    if (line === "공지" || line === "이벤트" || line === "뉴스") continue;
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(line)) continue;
    if (!line.includes(date)) return line;
  }

  return "";
}

function makeImageFields(item: {
  image: string;
  title: string;
  date: string;
  type: HomeNoticeType;
  href: string;
}): ParsedItem {
  const id = `${item.title}-${item.date}-${item.type}`.replace(
    /[^\w가-힣]/g,
    "-",
  );

  return {
    id,
    title: item.title,
    date: item.date,
    type: item.type,
    href: item.href,
    image: item.image,
    detailImage: item.image,
    bannerImage: item.image,
    articleImage: item.image,
    thumbnail: item.image,
  };
}

function parseNewsList(html: string): ParsedItem[] {
  const $ = cheerio.load(html);
  const result: ParsedItem[] = [];
  const seenCandidate = new WeakSet<object>();
  const seenItem = new Set<string>();
  const candidates: CheerioAcceptedElement[] = [];

  $("a").each((_, el) => {
    const node = el as object;
    const root = $(el);

    if (root.find("img").length > 0 && !seenCandidate.has(node)) {
      seenCandidate.add(node);
      candidates.push(el);
    }
  });

  $("li, article, section, div").each((_, el) => {
    const node = el as object;
    const root = $(el);
    const text = clean(root.text());

    if (
      root.find("img").length > 0 &&
      (text.includes("공지") ||
        text.includes("이벤트") ||
        text.includes("뉴스") ||
        text.includes("헤드헌팅") ||
        text.includes("신청") ||
        text.includes("버전 업데이트")) &&
      !seenCandidate.has(node)
    ) {
      seenCandidate.add(node);
      candidates.push(el);
    }
  });

  for (const el of candidates) {
    const root = $(el);
    const image = getImageFromRoot(root);
    if (!image) continue;

    const fullText = clean(root.text());
    const date = getDate(fullText);
    const type = getType(fullText);
    if (!date || !type) continue;

    const title = getTitleFromRoot(root, fullText, date);
    if (!title) continue;

    const rawHref =
      root.attr("href") ||
      root.closest("a").attr("href") ||
      root.find("a").first().attr("href") ||
      "";

    const href = abs(rawHref || NEWS_URL);
    const key = `${title}|${date}|${type}`;

    if (seenItem.has(key)) continue;
    seenItem.add(key);

    result.push(
      makeImageFields({
        title,
        date,
        type,
        href,
        image,
      }),
    );
  }

  return result.sort((a, b) => dateToTime(b.date) - dateToTime(a.date));
}

function normalizeWeaponTitle(title: string) {
  return title
    .replace(/[「」]/g, "")
    .replace(/ 기간 한정 판매 설명/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getNormalWeaponMeta(title: string) {
  if (title.includes("헤드헌팅")) return null;
  if (!title.includes("신청")) return null;

  const normalized = normalizeWeaponTitle(title);
  const labelMatch = normalized.match(/([가-힣A-Za-z0-9·\s]+신청)/);
  const label = clean(labelMatch?.[1] || normalized);

  if (!label.includes("신청")) return null;

  return {
    id: label.replace(/[^\w가-힣]/g, "-").toLowerCase(),
    label,
  };
}

function getSpecialWeaponMeta(title: string) {
  if (!title.includes("신청")) return null;
  if (title.includes("헤드헌팅")) return null;
  if (getNormalWeaponMeta(title)) return null;

  const normalized = normalizeWeaponTitle(title);
  const labelMatch = normalized.match(/([가-힣A-Za-z0-9·\s]+신청)/);
  const label = clean(labelMatch?.[1] || normalized);

  if (!label.includes("신청")) return null;

  return {
    id: label.replace(/[^\w가-힣]/g, "-").toLowerCase(),
    label,
  };
}

function isStackCountedOperatorPickup(title: string) {
  return title.includes("특별 허가 헤드헌팅") && !title.includes("특수 헤드헌팅");
}

function getStackOperatorItems(items: ParsedItem[]) {
  return items
    .filter((item) => isStackCountedOperatorPickup(item.title))
    .sort((a, b) => dateToTime(b.date) - dateToTime(a.date));
}

function findCurrentStackOperatorTitle(items: ParsedItem[]) {
  return getStackOperatorItems(items)[0]?.title ?? "";
}

function makeNormalWeaponItem(
  item: ParsedItem,
  meta: NonNullable<ReturnType<typeof getNormalWeaponMeta>>,
  stack: number,
): WeaponStackItem {
  return {
    id: meta.id,
    title: meta.label,
    stack,
    group: "normal",
    image: item.image,
    detailImage: item.image,
    bannerImage: item.image,
    articleImage: item.image,
    thumbnail: item.image,
    href: item.href,
    publishedAt: item.date,
    createdAt: new Date().toISOString(),
  };
}

function makeSpecialWeaponItem(
  item: ParsedItem,
  meta: NonNullable<ReturnType<typeof getSpecialWeaponMeta>>,
  stack: number,
): WeaponStackItem {
  return {
    id: meta.id,
    title: meta.label,
    stack,
    group: "special",
    image: item.image,
    detailImage: item.image,
    bannerImage: item.image,
    articleImage: item.image,
    thumbnail: item.image,
    href: item.href,
    publishedAt: item.date,
    createdAt: new Date().toISOString(),
  };
}

function normalizeStack(items: WeaponStackItem[], max: number) {
  return items.slice(0, max).map((item, index) => ({ ...item, stack: index }));
}

function dedupeById(items: WeaponStackItem[]) {
  const map = new Map<string, WeaponStackItem>();

  for (const item of items) {
    if (!map.has(item.id)) map.set(item.id, item);
  }

  return [...map.values()];
}

function applyWeaponStackOrder(items: WeaponStackItem[]) {
  return dedupeById(items)
    .filter((weapon) => weapon.stack < 3)
    .sort(
      (a, b) =>
        a.stack - b.stack ||
        dateToTime(b.publishedAt) - dateToTime(a.publishedAt),
    );
}

const db = prisma as any;

function toWeaponStackItem(row: any): WeaponStackItem {
  return {
    id: String(row.weaponId ?? row.id ?? ""),
    title: String(row.title ?? ""),
    stack: Number(row.stack ?? 0),
    group: "normal",
    image: String(row.image ?? ""),
    detailImage: row.detailImage ?? row.image ?? "",
    bannerImage: row.bannerImage ?? row.image ?? "",
    articleImage: row.articleImage ?? row.image ?? "",
    thumbnail: row.thumbnail ?? row.image ?? "",
    href: String(row.href ?? NEWS_URL),
    publishedAt: String(row.publishedAt ?? ""),
    createdAt:
      typeof row.createdAt === "string"
        ? row.createdAt
        : row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : new Date().toISOString(),
  };
}

async function loadNormalWeaponStackFromDb() {
  try {
    const rows = await db.homeWeaponStack.findMany({
      orderBy: [{ stack: "asc" }, { publishedAt: "desc" }],
    });

    normalWeaponStack = rows
      .map(toWeaponStackItem)
      .filter((weapon: WeaponStackItem) => weapon.id && weapon.stack < 3);

    const state = await db.homeStackState.findUnique({
      where: { key: "lastStackOperatorTitle" },
    });

    lastStackOperatorTitle = String(state?.value ?? lastStackOperatorTitle ?? "");
  } catch {
    normalWeaponStack = normalWeaponStack.filter((weapon) => weapon.stack < 3);
  }
}

async function saveNormalWeaponStackToDb() {
  const stack = applyWeaponStackOrder(normalWeaponStack);
  const ids = stack.map((weapon) => weapon.id).filter(Boolean);

  normalWeaponStack = stack;

  try {
    await db.$transaction([
      db.homeWeaponStack.deleteMany({
        where: ids.length
          ? {
              OR: [{ stack: { gte: 3 } }, { weaponId: { notIn: ids } }],
            }
          : {},
      }),
      ...stack.map((weapon) =>
        db.homeWeaponStack.upsert({
          where: { weaponId: weapon.id },
          update: {
            title: weapon.title,
            stack: weapon.stack,
            image: weapon.image,
            detailImage: weapon.detailImage,
            bannerImage: weapon.bannerImage,
            articleImage: weapon.articleImage,
            thumbnail: weapon.thumbnail,
            href: weapon.href,
            publishedAt: weapon.publishedAt,
          },
          create: {
            weaponId: weapon.id,
            title: weapon.title,
            stack: weapon.stack,
            group: "normal",
            image: weapon.image,
            detailImage: weapon.detailImage,
            bannerImage: weapon.bannerImage,
            articleImage: weapon.articleImage,
            thumbnail: weapon.thumbnail,
            href: weapon.href,
            publishedAt: weapon.publishedAt,
            createdAt: weapon.createdAt,
          },
        }),
      ),
      db.homeStackState.upsert({
        where: { key: "lastStackOperatorTitle" },
        update: { value: lastStackOperatorTitle },
        create: {
          key: "lastStackOperatorTitle",
          value: lastStackOperatorTitle,
        },
      }),
    ]);
  } catch {
    // DB 저장 실패 시에도 홈 API 자체는 메모리 스택으로 계속 응답합니다.
  }
}

async async function updateNormalWeaponStack(items: ParsedItem[]) {
  await loadNormalWeaponStackFromDb();

  const stackOperatorTitle = findCurrentStackOperatorTitle(items);
  const operatorPickupChanged =
    Boolean(stackOperatorTitle) &&
    Boolean(lastStackOperatorTitle) &&
    stackOperatorTitle !== lastStackOperatorTitle;

  const foundNormalItems = items
    .map((item) => {
      const meta = getNormalWeaponMeta(item.title);
      if (!meta) return null;
      return { item, meta };
    })
    .filter(
      (
        value,
      ): value is {
        item: ParsedItem;
        meta: NonNullable<ReturnType<typeof getNormalWeaponMeta>>;
      } => Boolean(value),
    )
    .sort((a, b) => dateToTime(b.item.date) - dateToTime(a.item.date));

  let stack = [...normalWeaponStack];

  if (operatorPickupChanged) {
    stack = stack
      .map((weapon) => ({
        ...weapon,
        stack: weapon.stack + 1,
      }))
      .filter((weapon) => weapon.stack < 3);
  }

  if (foundNormalItems.length > 0) {
    if (stack.length === 0) {
      stack = foundNormalItems
        .slice(0, 3)
        .map(({ item, meta }, index) => makeNormalWeaponItem(item, meta, index));
    } else {
      const latest = foundNormalItems[0];
      const latestExists = stack.some((weapon) => weapon.id === latest.meta.id);

      if (!latestExists) {
        if (!operatorPickupChanged) {
          stack = stack
            .map((weapon) => ({
              ...weapon,
              stack: weapon.stack + 1,
            }))
            .filter((weapon) => weapon.stack < 3);
        }

        stack.unshift(makeNormalWeaponItem(latest.item, latest.meta, 0));
      }

      stack = stack.map((weapon) => {
        const found = foundNormalItems.find(
          (entry) => entry.meta.id === weapon.id,
        );

        if (!found) return weapon;

        return {
          ...weapon,
          title: found.meta.label,
          image: found.item.image || weapon.image,
          detailImage: found.item.image || weapon.detailImage,
          bannerImage: found.item.image || weapon.bannerImage,
          articleImage: found.item.image || weapon.articleImage,
          thumbnail: found.item.image || weapon.thumbnail,
          href: found.item.href || weapon.href,
          publishedAt: found.item.date || weapon.publishedAt,
        };
      });
    }
  } else if (stack.length === 0) {
    stack = [...DEFAULT_NORMAL_WEAPON_STACK];
  }

  normalWeaponStack = applyWeaponStackOrder(stack);

  if (stackOperatorTitle) {
    lastStackOperatorTitle = stackOperatorTitle;
  }

  await saveNormalWeaponStackToDb();

  return normalWeaponStack;
}

function updateSpecialWeaponStack(items: ParsedItem[]) {
  const foundSpecialItems = items
    .map((item) => {
      const meta = getSpecialWeaponMeta(item.title);
      if (!meta) return null;
      return { item, meta };
    })
    .filter(
      (
        value,
      ): value is {
        item: ParsedItem;
        meta: NonNullable<ReturnType<typeof getSpecialWeaponMeta>>;
      } => Boolean(value),
    )
    .sort((a, b) => dateToTime(b.item.date) - dateToTime(a.item.date));

  let stack = [...specialWeaponStack];

  for (const { item, meta } of foundSpecialItems) {
    stack = stack.filter((weapon) => weapon.id !== meta.id);
    stack.unshift(makeSpecialWeaponItem(item, meta, 0));
  }

  const currentSpecialIds = new Set(foundSpecialItems.map(({ meta }) => meta.id));

  stack = stack.filter((weapon) => currentSpecialIds.has(weapon.id));
  specialWeaponStack = normalizeStack(dedupeById(stack), 2);

  return specialWeaponStack;
}

async function updateWeaponStack(items: ParsedItem[]) {
  const normal = await updateNormalWeaponStack(items);
  const special = updateSpecialWeaponStack(items);
  return applyWeaponStackOrder([...special, ...normal]);
}

async function createErrorPayload(
  message: string,
  statusCache: "hit" | "miss" = "miss",
): Promise<HomeApiResponse> {
  const weaponStack = await updateWeaponStack([]);

  return {
    ok: false,
    source: "official-news-list",
    fetchedAt: new Date().toISOString(),
    latest: [],
    notice: [],
    event: [],
    news: [],
    weaponStack,
    debug: {
      parsedCount: 0,
      cache: statusCache,
      normalWeaponCount: normalWeaponStack.length,
      specialWeaponCount: specialWeaponStack.length,
      stackOperatorTitle: lastStackOperatorTitle,
    },
    message,
  };
}

export async function getHomeData(): Promise<HomeApiResponse> {
  const now = Date.now();

  if (cachedResponse && now - cachedAt < CACHE_TTL) {
    return {
      ...cachedResponse,
      debug: {
        ...cachedResponse.debug,
        cache: "hit",
      },
    };
  }

  try {
    const response = await fetch(NEWS_URL, {
      headers: FETCH_HEADERS,
      next: { revalidate: HOME_EDGE_CACHE_SECONDS },
    });

    if (!response.ok) {
      return await createErrorPayload(
        `공식 소식을 불러오지 못했습니다. 상태 코드: ${response.status}`,
      );
    }

    const html = await response.text();
    const parsed = parseNewsList(html);
    const weaponStack = await updateWeaponStack(parsed);

    const payload: HomeApiResponse = {
      ok: true,
      source: "official-news-list",
      fetchedAt: new Date().toISOString(),
      latest: parsed.slice(0, 10),
      notice: parsed.filter((value) => value.type === "notice"),
      event: parsed.filter((value) => value.type === "event"),
      news: parsed.filter((value) => value.type === "news"),
      weaponStack,
      debug: {
        parsedCount: parsed.length,
        cache: "miss",
        normalWeaponCount: normalWeaponStack.length,
        specialWeaponCount: specialWeaponStack.length,
        stackOperatorTitle: lastStackOperatorTitle,
      },
    };

    cachedResponse = payload;
    cachedAt = now;

    return payload;
  } catch (error) {
    return await createErrorPayload(
      error instanceof Error
        ? `공식 소식을 불러오는 중 오류가 발생했습니다: ${error.message}`
        : "공식 소식을 불러오는 중 알 수 없는 오류가 발생했습니다.",
    );
  }
}
