// warfarin.wiki /kr/items 페이지 HTML을 파싱해 items-data.ts 생성.
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync(new URL("./wf_items.html", import.meta.url), "utf8");

// 희귀도 색 → 등급(1~6)
const RARITY = {
  "#A0A0A0": 1,
  "#DCDC00": 2,
  "#26BBFD": 3,
  "#9452FA": 4,
  "#FE5A00": 5,
  "#FFBB03": 6,
};

// HTML 엔티티 디코딩(&#x27; 등)
function decodeEntities(s) {
  return s
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

// 실제 아이템 카테고리 헤딩(그리드가 뒤따르는 h2/h3)만 추출.
const headingRe = /<h[23][^>]*>([^<]+)<\/h[23]><div class="grid/g;
const headings = [];
let hm;
while ((hm = headingRe.exec(html))) {
  headings.push({ name: hm[1].trim(), index: hm.index });
}

// 각 아이템 앵커.
const anchorRe = /<a [^>]*href="\/kr\/items\/([^"]+)"[^>]*>(.*?)<\/a>/gs;
const items = [];
let am;
while ((am = anchorRe.exec(html))) {
  const slug = am[1];
  const inner = am[2];
  const img = inner.match(/<img src="([^"]+)"/);
  // 첫 span = 이름, muted span = 유형
  const nameM = inner.match(/<span style="[^"]*">([^<]+)<\/span>/);
  const typeM = inner.match(/<span class="text-muted-foreground">([^<]*)<\/span>/);
  const colorM = inner.match(/background-color:(#[0-9A-Fa-f]{6})/);
  if (!nameM) continue;
  // 카테고리 = 가장 가까운 앞 헤딩
  let category = "기타";
  for (const h of headings) {
    if (h.index < am.index) category = h.name;
    else break;
  }
  items.push({
    slug,
    name: decodeEntities(nameM[1].trim()),
    type: typeM ? decodeEntities(typeM[1].trim()) : "",
    category,
    rarity: colorM ? RARITY[colorM[1].toUpperCase()] ?? 1 : 1,
    rarityColor: colorM ? colorM[1].toUpperCase() : "#A0A0A0",
    remoteImage: img ? img[1] : "",
  });
}

// 중복 slug 제거(첫 등장 우선)
const seen = new Set();
const unique = items.filter((it) => (seen.has(it.slug) ? false : seen.add(it.slug)));

// 한국어 파일명 부여(파일시스템 안전화 + 동명 충돌 시 -2, -3 …). image = 로컬 경로.
function sanitize(name) {
  return name.replace(/[\\/:*?"<>|]/g, "").trim();
}
const nameUse = new Map();
for (const it of unique) {
  const base = sanitize(it.name);
  const n = (nameUse.get(base) ?? 0) + 1;
  nameUse.set(base, n);
  const fileName = n === 1 ? base : `${base}-${n}`;
  it.fileName = `${fileName}.webp`;
  it.image = `/items/${fileName}.webp`;
}

// 카테고리 집계
const byCat = {};
for (const it of unique) byCat[it.category] = (byCat[it.category] ?? 0) + 1;
console.log("총 아이템:", unique.length);
console.log("카테고리:", JSON.stringify(byCat, null, 2));

// 카테고리 순서(등장 순)
const catOrder = [...new Set(unique.map((i) => i.category))];

const header = `// 출처: warfarin.wiki/kr/items — Arknights: Endfield 아이템 카탈로그.
// 생성 스크립트: test/parse-items.mjs (수동 편집 대신 재생성 권장).

export type ItemCategory =
${catOrder.map((c) => `  | ${JSON.stringify(c)}`).join("\n")};

export type ItemSummary = {
  slug: string;
  name: string;
  type: string; // 게임 내 분류 부제(예: "오퍼레이터 육성 재료")
  category: ItemCategory;
  rarity: number; // 1~6 (희귀도 바 색 기준)
  rarityColor: string;
  image: string; // 로컬 경로(/items/{한국어이름}.webp)
  remoteImage: string; // warfarin.wiki 원본(재다운로드용)
};

export const itemCategories: ItemCategory[] = ${JSON.stringify(catOrder, null, 0)};

export const itemSummaries: ItemSummary[] = [
${unique
  .map((it) => "  " + JSON.stringify({ slug: it.slug, name: it.name, type: it.type, category: it.category, rarity: it.rarity, rarityColor: it.rarityColor, image: it.image, remoteImage: it.remoteImage }))
  .join(",\n")},
];

export function getItemsByCategory(category: ItemCategory): ItemSummary[] {
  return itemSummaries.filter((item) => item.category === category);
}

export function getItem(slug: string): ItemSummary | undefined {
  return itemSummaries.find((item) => item.slug === slug);
}
`;

writeFileSync(new URL("../data/items-data.ts", import.meta.url), header);
console.log("written data/items-data.ts");
