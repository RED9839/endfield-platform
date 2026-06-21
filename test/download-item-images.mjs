// data/items-data.ts의 remoteImage를 public/items/{한국어이름}.webp 로 내려받는다.
// 재실행 시 이미 받은 파일은 건너뛴다.  실행: node test/download-item-images.mjs
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataTs = readFileSync(join(root, "data/items-data.ts"), "utf8");
const outDir = join(root, "public/items");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// itemSummaries의 JSON 객체 추출
const objs = [...dataTs.matchAll(/\{"slug":.*?\}/g)].map((m) => JSON.parse(m[0]));
console.log("대상:", objs.length, "개");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36";
let ok = 0, skip = 0, fail = 0;
const failures = [];

async function fetchOne(item) {
  const fileName = item.image.replace(/^\/items\//, "");
  const dest = join(outDir, fileName);
  if (existsSync(dest)) { skip += 1; return; }
  try {
    const res = await fetch(item.remoteImage, { headers: { "User-Agent": UA, Referer: "https://warfarin.wiki/" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    ok += 1;
  } catch (e) {
    fail += 1;
    failures.push(`${item.slug} (${item.name}): ${e.message}`);
  }
}

// 동시성 제한 풀
const CONC = 12;
let i = 0;
async function worker() {
  while (i < objs.length) {
    const idx = i++;
    await fetchOne(objs[idx]);
    if ((ok + skip + fail) % 100 === 0) console.log(`진행 ${ok + skip + fail}/${objs.length}`);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

console.log(`\n완료 — 다운로드 ${ok} · 스킵 ${skip} · 실패 ${fail}`);
if (failures.length) console.log("실패 목록:\n" + failures.join("\n"));
