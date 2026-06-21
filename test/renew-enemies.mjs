// 적 스탯 리뉴얼(CRLF 대응, id별 처리): 티어 기반 방어/공격/스태거 재밸런싱. maxHp 유지.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/enemies.ts");
let src = readFileSync(file, "utf8");

const TIER = {
  Common:   { def: 24, atk: 9,  stag: 55 },
  Normal:   { def: 26, atk: 11, stag: 60 },
  Enhanced: { def: 36, atk: 14, stag: 82 },
  Advanced: { def: 40, atk: 16, stag: 90 },
  Alpha:    { def: 42, atk: 17, stag: 95 },
  Elite:    { def: 52, atk: 19, stag: 120 },
  Boss:     { def: 72, atk: 28, stag: 230 },
};
const ARMOR_MECHS = ["armored", "shield", "boss-shield"];
const hash = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

const ids = [...src.matchAll(/"id": "([^"]+)"/g)].map((m) => m[1]);
let count = 0;
for (const id of ids) {
  // id부터 다음 객체 닫힘(  })까지 — CRLF 대응
  const re = new RegExp(`("id": "${id}",[\\s\\S]*?\\r?\\n  \\})`);
  const m = src.match(re);
  if (!m) { console.log("MISS", id); continue; }
  let blk = m[1];
  const tierM = blk.match(/"tier": "([^"]+)"/);
  const t = tierM && TIER[tierM[1]];
  if (!t) { console.log("no-tier", id, tierM?.[1]); continue; }
  const mechBlock = blk.match(/"mechanics": \[([\s\S]*?)\]/)?.[1] ?? "";
  const armored = ARMOR_MECHS.some((mech) => mechBlock.includes(`"${mech}"`));
  const h = hash(id);
  const def = t.def + (armored ? 20 : 0);
  const atk = t.atk + ((h % 5) - 2);
  const stag = Math.max(40, t.stag + ((h % 21) - 10));
  blk = blk.replace(/("attack": )\d+/, `$1${atk}`);
  blk = blk.replace(/("defense": )\d+/, `$1${def}`);
  blk = blk.replace(/("staggerHp": )\d+/, `$1${stag}`);
  src = src.replace(m[1], blk);
  count += 1;
}
writeFileSync(file, src);
console.log(`적 스탯 재조정 ${count}/${ids.length}`);
