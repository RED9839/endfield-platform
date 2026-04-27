import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

type HomeNoticeType = "notice" | "event" | "news";

type ParsedItem = {
  title: string;
  date: string;
  type: HomeNoticeType;
  href: string;
  image: string;
};

type WeaponStackItem = {
  id: string;
  title: string;
  stack: number;
  image: string;
  href: string;
  publishedAt: string;
  createdAt: string;
};

type OperatorState = {
  currentOperatorId: string;
};

type HomeApiResponse = {
  ok: boolean;
  source: "official-news";
  fetchedAt: string;
  latest: ParsedItem[];
  notice: ParsedItem[];
  event: ParsedItem[];
  news: ParsedItem[];
  weaponStack: WeaponStackItem[];
  debug: {
    parsedCount: number;
    cache: "hit" | "miss";
  };
  message?: string;
};

type CheerioRoot = ReturnType<typeof cheerio.load>;
type CheerioAcceptedElement = Parameters<CheerioRoot>[0];
type CheerioNode = ReturnType<CheerioRoot>;

const NEWS_URL = "https://endfield.gryphline.com/ko-kr/news";
const SITE = "https://endfield.gryphline.com";
const CACHE_TTL = 1000 * 60 * 5;

const DEFAULT_WEAPON_STACK: WeaponStackItem[] = [
  {
    id: "hanghae",
    title: "항해 신청",
    stack: 0,
    image:
      "https://web-static.hg-cdn.com/upload/image/20260415/c08b7435381e80dba80b70453daf22d4.jpg",
    href: `${SITE}/ko-kr/news/0751`,
    publishedAt: "2026.04.16",
    createdAt: "2026-04-16T00:00:00.000Z",
  },
  {
    id: "jeogok",
    title: "적옥 신청",
    stack: 1,
    image:
      "https://web-static.hg-cdn.com/upload/image/20260321/995797e6ffe60b02202749600a8ac9cd.jpg",
    href: `${SITE}/ko-kr/news/2660`,
    publishedAt: "2026.03.28",
    createdAt: "2026-03-28T00:00:00.000Z",
  },
  {
    id: "sina",
    title: "신아 신청",
    stack: 2,
    image:
      "https://web-static.hg-cdn.com/upload/image/20260309/94336f5ca612a44896b0288d0ea841cc.jpg",
    href: `${SITE}/ko-kr/news/5213`,
    publishedAt: "2026.03.11",
    createdAt: "2026-03-11T00:00:00.000Z",
  },
];

let cachedResponse: HomeApiResponse | null = null;
let cachedAt = 0;
let memoryWeaponStack: WeaponStackItem[] = [...DEFAULT_WEAPON_STACK];
let memoryOperatorState: OperatorState = { currentOperatorId: "" };

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

function normalizeWeaponTitle(title: string) {
  return title
    .replace(/[「」]/g, "")
    .replace(/ 기간 한정 판매 설명/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function weaponId(title: string) {
  const normalized = normalizeWeaponTitle(title);

  if (normalized.includes("항해 신청")) return "hanghae";
  if (normalized.includes("적옥 신청")) return "jeogok";
  if (normalized.includes("신아 신청")) return "sina";

  return normalized.replace(/[^\w가-힣]/g, "").toLowerCase();
}

function isWeapon(title: string) {
  return (
    title.includes("신청") &&
    (title.includes("판매 설명") || title.includes("기간 한정"))
  );
}

function isOperatorPickup(title: string) {
  return title.includes("특별 허가 헤드헌팅");
}

function isSpecialHeadHunting(title: string) {
  return title.includes("특수 헤드헌팅");
}

function isStackCountedOperator(title: string) {
  return isOperatorPickup(title) && !isSpecialHeadHunting(title);
}

function hrefMap(title: string) {
  const normalized = title.replace(/[「」]/g, "").replace(/\s+/g, " ").trim();

  if (normalized.includes("항해 신청")) return `${SITE}/ko-kr/news/0751`;
  if (normalized.includes("적옥 신청")) return `${SITE}/ko-kr/news/2660`;
  if (normalized.includes("신아 신청")) return `${SITE}/ko-kr/news/5213`;

  if (
    normalized.includes("봄날의 새벽") &&
    normalized.includes("버전 업데이트 설명")
  ) {
    return `${SITE}/ko-kr/news/0751`;
  }

  if (
    normalized.includes("봄의 천둥, 만물의 소생") &&
    normalized.includes("특별 허가 헤드헌팅")
  ) {
    return `${SITE}/ko-kr/news/0751`;
  }

  if (normalized.includes("리뉴얼 월정액 선물")) {
    return `${SITE}/ko-kr/news/0751`;
  }

  return NEWS_URL;
}

function seedWeaponStack(stack: WeaponStackItem[]) {
  const map = new Map<string, WeaponStackItem>();

  for (const item of DEFAULT_WEAPON_STACK) {
    map.set(item.id, { ...item });
  }

  for (const item of stack) {
    map.set(item.id, { ...item });
  }

  return [...map.values()].sort((a, b) => a.stack - b.stack);
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

  let title =
    clean(root.find(".title").first().text()) ||
    clean(root.find("h3").first().text()) ||
    clean(root.find("h2").first().text()) ||
    clean(imageAlt) ||
    "";

  if (title) return title;

  const lines = fullText
    .split(/\n+/)
    .map((value) => clean(value))
    .filter(Boolean);

  for (const line of lines) {
    if (line === "공지" || line === "이벤트" || line === "뉴스") continue;
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(line)) continue;
    if (!line.includes(date)) {
      title = line;
      break;
    }
  }

  return title;
}

function parseNewsList(html: string): ParsedItem[] {
  const $ = cheerio.load(html);
  const result: ParsedItem[] = [];
  const seenCandidate = new WeakSet<object>();
  const seenItem = new Set<string>();
  const candidates: CheerioAcceptedElement[] = [];

  $("a").each((_, el) => {
    const node = el as object;
    if ($(el).find("img").length > 0 && !seenCandidate.has(node)) {
      seenCandidate.add(node);
      candidates.push(el);
    }
  });

  $("li, article, div").each((_, el) => {
    const node = el as object;
    const root = $(el);
    const text = clean(root.text());

    if (
      root.find("img").length > 0 &&
      (text.includes("공지") || text.includes("이벤트") || text.includes("뉴스")) &&
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

    const href = rawHref ? abs(rawHref) : hrefMap(title);
    const key = `${title}|${date}|${type}`;

    if (seenItem.has(key)) continue;
    seenItem.add(key);

    result.push({
      title,
      date,
      type,
      href,
      image,
    });
  }

  return result.sort((a, b) => dateToTime(b.date) - dateToTime(a.date));
}

function updateWeaponStack(items: ParsedItem[]) {
  let stack = seedWeaponStack(memoryWeaponStack);

  const currentCountedOperator = items.find((item) =>
    isStackCountedOperator(item.title),
  );

  const currentOperatorId = currentCountedOperator?.title ?? "";
  const shouldAdvance =
    memoryWeaponStack.length > 0 &&
    !!memoryOperatorState.currentOperatorId &&
    !!currentOperatorId &&
    memoryOperatorState.currentOperatorId !== currentOperatorId;

  if (shouldAdvance) {
    stack = stack
      .map((item) => ({ ...item, stack: item.stack + 1 }))
      .filter((item) => item.stack < 3);
  }

  if (currentOperatorId) {
    memoryOperatorState = { currentOperatorId };
  }

  for (const item of items.filter((value) => isWeapon(value.title))) {
    const id = weaponId(item.title);
    if (!id) continue;

    const existing = stack.find((value) => value.id === id);

    if (existing) {
      existing.image = item.image || existing.image;
      existing.href = item.href || existing.href;
      existing.publishedAt = item.date || existing.publishedAt;
      continue;
    }

    stack.push({
      id,
      title:
        id === "hanghae"
          ? "항해 신청"
          : id === "jeogok"
            ? "적옥 신청"
            : id === "sina"
              ? "신아 신청"
              : normalizeWeaponTitle(item.title),
      stack: 0,
      image: item.image,
      href: item.href || hrefMap(item.title),
      publishedAt: item.date,
      createdAt: new Date().toISOString(),
    });
  }

  memoryWeaponStack = stack.sort((a, b) => a.stack - b.stack).slice(0, 3);

  return memoryWeaponStack;
}

function json(data: HomeApiResponse, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

export async function GET() {
  const now = Date.now();

  if (cachedResponse && now - cachedAt < CACHE_TTL) {
    return json({
      ...cachedResponse,
      debug: {
        ...cachedResponse.debug,
        cache: "hit",
      },
    });
  }

  try {
    const response = await fetch(NEWS_URL, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        Referer: SITE,
      },
    });

    if (!response.ok) {
      return json(
        {
          ok: false,
          source: "official-news",
          fetchedAt: new Date().toISOString(),
          latest: [],
          notice: [],
          event: [],
          news: [],
          weaponStack: memoryWeaponStack,
          debug: {
            parsedCount: 0,
            cache: "miss",
          },
          message: `fetch failed: ${response.status}`,
        },
        502,
      );
    }

    const html = await response.text();
    const parsed = parseNewsList(html);
    const weaponStack = updateWeaponStack(parsed);

    const payload: HomeApiResponse = {
      ok: true,
      source: "official-news",
      fetchedAt: new Date().toISOString(),
      latest: parsed.slice(0, 10),
      notice: parsed.filter((value) => value.type === "notice"),
      event: parsed.filter((value) => value.type === "event"),
      news: parsed.filter((value) => value.type === "news"),
      weaponStack,
      debug: {
        parsedCount: parsed.length,
        cache: "miss",
      },
    };

    cachedResponse = payload;
    cachedAt = now;

    return json(payload);
  } catch (error) {
    return json(
      {
        ok: false,
        source: "official-news",
        fetchedAt: new Date().toISOString(),
        latest: [],
        notice: [],
        event: [],
        news: [],
        weaponStack: memoryWeaponStack,
        debug: {
          parsedCount: 0,
          cache: "miss",
        },
        message: error instanceof Error ? error.message : "unknown error",
      },
      500,
    );
  }
}
