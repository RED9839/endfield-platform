import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

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

const NEWS_URL = "https://endfield.gryphline.com/ko-kr/news";
const SITE = "https://endfield.gryphline.com";

const STACK_PATH = path.join(process.cwd(), "data/weapon-stack.json");
const OPERATOR_STATE_PATH = path.join(process.cwd(), "data/operator-state.json");

/* =========================
   유틸
========================= */

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

function getType(text: string): HomeNoticeType | null {
  if (text.includes("공지")) return "notice";
  if (text.includes("이벤트")) return "event";
  if (text.includes("뉴스")) return "news";
  return null;
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/* =========================
   제목 / 링크 매핑
========================= */

function normalizeWeaponTitle(title: string) {
  return title
    .replace(/[「」]/g, "")
    .replace(/ 기간 한정 판매 설명/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function weaponId(title: string) {
  const t = normalizeWeaponTitle(title);

  if (t.includes("항해 신청")) return "hanghae";
  if (t.includes("적옥 신청")) return "jeogok";
  if (t.includes("신아 신청")) return "sina";

  return t.replace(/[^\w가-힣]/g, "").toLowerCase();
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

function isVersionUpdateExplanation(title: string) {
  return title.includes("버전 업데이트 설명");
}

function hrefMap(title: string) {
  const cleanTitle = title.replace(/[「」]/g, "").replace(/\s+/g, " ").trim();

  if (cleanTitle.includes("항해 신청")) return `${SITE}/ko-kr/news/0751`;
  if (cleanTitle.includes("적옥 신청")) return `${SITE}/ko-kr/news/2660`;
  if (cleanTitle.includes("신아 신청")) return `${SITE}/ko-kr/news/5213`;

  if (cleanTitle.includes("봄날의 새벽") && cleanTitle.includes("버전 업데이트 설명")) {
    return `${SITE}/ko-kr/news/0751`;
  }

  if (cleanTitle.includes("봄의 천둥, 만물의 소생") && cleanTitle.includes("특별 허가 헤드헌팅")) {
    return `${SITE}/ko-kr/news/0751`;
  }

  if (cleanTitle.includes("리뉴얼 월정액 선물")) {
    return `${SITE}/ko-kr/news/0751`;
  }

  return `${SITE}/ko-kr/news`;
}

/* =========================
   파일 읽기/쓰기
========================= */

function readStack(): WeaponStackItem[] {
  try {
    const raw = fs.readFileSync(STACK_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function writeStack(items: WeaponStackItem[]) {
  ensureDir(STACK_PATH);
  fs.writeFileSync(
    STACK_PATH,
    JSON.stringify(
      {
        version: 1,
        lastUpdated: new Date().toISOString(),
        items,
      },
      null,
      2
    ),
    "utf-8"
  );
}

function readOperatorState(): OperatorState {
  try {
    const raw = fs.readFileSync(OPERATOR_STATE_PATH, "utf-8");
    return JSON.parse(raw) as OperatorState;
  } catch {
    return { currentOperatorId: "" };
  }
}

function writeOperatorState(state: OperatorState) {
  ensureDir(OPERATOR_STATE_PATH);
  fs.writeFileSync(OPERATOR_STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

/* =========================
   초기 시드
========================= */

function seed(stack: WeaponStackItem[]) {
  const map = new Map(stack.map((item) => [item.id, item]));

  const defaults: WeaponStackItem[] = [
    {
      id: "hanghae",
      title: "항해 신청",
      stack: 0,
      image:
        "https://web-static.hg-cdn.com/upload/image/20260415/c08b7435381e80dba80b70453daf22d4.jpg",
      href: `${SITE}/ko-kr/news/0751`,
      publishedAt: "2026.04.16",
      createdAt: new Date().toISOString(),
    },
    {
      id: "jeogok",
      title: "적옥 신청",
      stack: 1,
      image:
        "https://web-static.hg-cdn.com/upload/image/20260321/995797e6ffe60b02202749600a8ac9cd.jpg",
      href: `${SITE}/ko-kr/news/2660`,
      publishedAt: "2026.03.28",
      createdAt: new Date().toISOString(),
    },
    {
      id: "sina",
      title: "신아 신청",
      stack: 2,
      image:
        "https://web-static.hg-cdn.com/upload/image/20260309/94336f5ca612a44896b0288d0ea841cc.jpg",
      href: `${SITE}/ko-kr/news/5213`,
      publishedAt: "2026.03.11",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const item of defaults) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }

  return [...map.values()].sort((a, b) => a.stack - b.stack);
}

/* =========================
   목록 파싱
========================= */

function parse(html: string): ParsedItem[] {
  const $ = cheerio.load(html);
  const result: ParsedItem[] = [];
  const seen = new Set<string>();
  const candidates = new Set<any>();

  $("a").each((_, el) => {
    if ($(el).find("img").length > 0) {
      candidates.add(el);
    }
  });

  $("li, article, div").each((_, el) => {
    const text = clean($(el).text());
    if (
      $(el).find("img").length > 0 &&
      (text.includes("공지") || text.includes("이벤트") || text.includes("뉴스"))
    ) {
      candidates.add(el);
    }
  });

  for (const el of candidates) {
    const root = $(el);

    const img =
      root.find("img").first().attr("src") ||
      root.find("img").first().attr("data-src") ||
      root.find("img").first().attr("data-original") ||
      root.find("img").first().attr("data-lazy-src") ||
      "";

    const image = abs(img);
    if (!image) continue;

    const fullText = clean(root.text());
    const date = getDate(fullText);
    const type = getType(fullText);

    if (!date || !type) continue;

    let title =
      clean(root.find(".title").first().text()) ||
      clean(root.find("h3").first().text()) ||
      clean(root.find("h2").first().text()) ||
      clean(root.find("[alt]").first().attr("alt")) ||
      "";

    if (!title) {
      const lines = fullText
        .split(/\n+/)
        .map((v) => clean(v))
        .filter(Boolean);

      for (const line of lines) {
        if (line === "공지" || line === "이벤트" || line === "뉴스") continue;
        if (/^\d{4}\.\d{2}\.\d{2}$/.test(line)) continue;
        if (!line.includes(date)) {
          title = line;
          break;
        }
      }
    }

    if (!title) continue;

    const rawHref =
      root.attr("href") ||
      root.closest("a").attr("href") ||
      root.find("a").first().attr("href") ||
      "";

    const href = rawHref ? abs(rawHref) : hrefMap(title);

    const key = `${title}-${date}-${type}`;
    if (seen.has(key)) continue;
    seen.add(key);

    result.push({
      title,
      date,
      type,
      href,
      image,
    });
  }

  return result.sort(
    (a, b) =>
      new Date(`${b.date.replace(/\./g, "-")}T00:00:00+09:00`).getTime() -
      new Date(`${a.date.replace(/\./g, "-")}T00:00:00+09:00`).getTime()
  );
}

/* =========================
   무기 스택 업데이트
========================= */

function updateStack(items: ParsedItem[]) {
  const beforeSeed = readStack();
  let stack = seed(beforeSeed);

  const currentCountedOperator = items.find((item) =>
    isStackCountedOperator(item.title)
  );

  const operatorState = readOperatorState();
  const currentOperatorId = currentCountedOperator
    ? currentCountedOperator.title
    : "";

  const shouldAdvance =
    beforeSeed.length > 0 &&
    !!operatorState.currentOperatorId &&
    !!currentOperatorId &&
    operatorState.currentOperatorId !== currentOperatorId;

  if (shouldAdvance) {
    stack = stack
      .map((item) => ({ ...item, stack: item.stack + 1 }))
      .filter((item) => item.stack < 3);
  }

  if (currentOperatorId) {
    writeOperatorState({ currentOperatorId });
  }

  for (const item of items.filter((v) => isWeapon(v.title))) {
    const id = weaponId(item.title);
    if (!id) continue;

    const existing = stack.find((s) => s.id === id);

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

  stack = stack
    .sort((a, b) => a.stack - b.stack)
    .slice(0, 3);

  writeStack(stack);

  return stack;
}

/* =========================
   API
========================= */

export async function GET() {
  try {
    const res = await fetch(NEWS_URL, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
        Referer: SITE,
      },
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        message: `fetch failed: ${res.status}`,
      });
    }

    const html = await res.text();
    const parsed = parse(html);

    return NextResponse.json({
      ok: true,
      latest: parsed.slice(0, 10),
      notice: parsed.filter((v) => v.type === "notice"),
      event: parsed.filter((v) => v.type === "event"),
      news: parsed.filter((v) => v.type === "news"),
      weaponStack: updateStack(parsed),
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: error instanceof Error ? error.message : "unknown error",
    });
  }
}