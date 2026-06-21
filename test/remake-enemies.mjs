// 적 전체 개편기 — 나무위키/엔드필드 본편 검증 세력 구조 기준.
//  1) 세력 태그 정리: 11종 난립 → 5개 본편 세력(광석수/아겔로스/침식체/본크러셔/청파채)
//  2) 스탯 재밸런싱: 티어 기준값 × 세력 아키타입 배수
//  3) 기믹 정정: 세력 컨셉에 맞는 기믹 보강
//  4) 신규 적 추가: 랜드브레이커 분파(울프팀/사막도적/그레이운드/그림자해골)·청파 사부·추가 야생/구조체/침식
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "app/game/data/enemies.ts");
const src = readFileSync(file, "utf8");
const data = JSON.parse(src.slice(src.indexOf("= [") + 2, src.lastIndexOf("];") + 1));

// ===== 1) 세력 매핑 =====
// 침식체(블라이트/조석 아겔로이) 전용 id — 나머지 Aggeloi는 아겔로스.
// 무릉(Wuling) 아겔로스 = 침식체(위키 2.1.2: 탁류·수정·굴절·조류·파조의 상). 마블 계열은 4번 협곡(아겔로스).
const CORROSION = new Set(["mudflow", "mudflow-delta", "hedron", "hedron-delta", "prism", "tidewalker", "tidewalker-delta", "tidalklast"]);
const KO = new Set(["광석수", "아겔로스", "침식체", "본크러셔", "청파채"]);
function newFaction(e) {
  const f = e.faction || "";
  if (KO.has(f)) return f; // 이미 개편됨(멱등)
  if (f === "Aggeloi") return CORROSION.has(e.id) ? "침식체" : "아겔로스";
  if (f === "Landbreaker") return "본크러셔";
  if (f === "Outlaw") return "청파채";
  return "광석수"; // 모든 야생/감염/광석/팬텀 계열 통합
}

// ===== 2) 티어 기준 스탯 + 세력 아키타입 =====
const TIER = {
  Common:   { hp: 38,  atk: 9,  def: 30, stag: 42 },
  Normal:   { hp: 55,  atk: 12, def: 40, stag: 60 },
  Enhanced: { hp: 85,  atk: 16, def: 52, stag: 95 },
  Advanced: { hp: 120, atk: 20, def: 62, stag: 135 },
  Alpha:    { hp: 160, atk: 24, def: 72, stag: 175 },
  Elite:    { hp: 240, atk: 30, def: 80, stag: 270 },
  Boss:     { hp: 520, atk: 42, def: 92, stag: 560 },
};
// 세력 아키타입: [hp배수, atk배수, def배수, speed, 컨셉기믹]
const ARCH = {
  "광석수":   { hp: 1.05, atk: 0.95, def: 1.18, spd: 90, traits: ["armored", "acid", "charge", "enrage", "rockfall", "poison"] },
  "아겔로스": { hp: 1.12, atk: 1.0,  def: 1.22, spd: 86, traits: ["armored", "shield", "ranged", "reflect"] },
  "침식체":   { hp: 1.22, atk: 1.0,  def: 0.95, spd: 88, traits: ["poison", "cold", "healer", "summoner", "revive"] },
  "본크러셔": { hp: 0.95, atk: 1.22, def: 0.84, spd: 94, traits: ["flame", "charge", "enrage", "smoke", "sniper", "self-destruct"] },
  "청파채":   { hp: 0.9,  atk: 1.12, def: 0.8,  spd: 99, traits: ["evasive", "charge", "grab", "bind", "sniper"] },
};
const r = (n) => Math.round(n);

function rebalance(e) {
  const fac = newFaction(e);
  const a = ARCH[fac];
  const t = TIER[e.tier] || TIER.Normal;
  const isBoss = e.tier === "Boss" || e.boss;
  const isElite = e.tier === "Elite" || e.elite;
  // 같은 티어 내 개체 편차(id 해시로 결정적 ±8%)
  const h = [...e.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const jitter = 0.92 + (h % 17) / 100; // 0.92~1.08
  e.faction = fac;
  e.maxHp = r(t.hp * a.hp * jitter);
  e.attack = r(t.atk * a.atk * (0.96 + (h % 9) / 100));
  e.defense = r(t.def * a.def);
  e.staggerHp = r(t.stag * a.hp * jitter);
  e.speed = Math.min(100, a.spd + (isBoss ? 0 : (h % 7) - 3));
  if (isBoss) { e.boss = true; e.speed = Math.min(100, a.spd + 2); }
  if (isElite) e.elite = true;
  // 기믹: 기존 유지 + 세력 컨셉 기믹 1~2개 보강(중복 제거, none 제거)
  const keep = e.mechanics.filter((m) => m !== "none");
  const add = a.traits.filter((m) => !keep.includes(m)).slice(0, isBoss ? 3 : isElite ? 2 : 1);
  let mech = [...new Set([...keep, ...add])];
  if (isBoss && !mech.includes("boss-shield")) mech.push("boss-shield");
  if (!mech.length) mech = ["none"];
  e.mechanics = mech;
  return e;
}

// 티어 보정(위키 분포/등급 반영): 파조의 상 = 무릉 아겔로스 네임드 보스.
const TIER_OVERRIDE = { tidalklast: "Boss" };
for (const e of data) if (TIER_OVERRIDE[e.id]) e.tier = TIER_OVERRIDE[e.id];

for (const e of data) rebalance(e);

// ===== 4) 신규 적: 사용자 요청으로 비활성화 — 원본 73마리 유지 =====
const NEW = [];

const existing = new Set(data.map((e) => e.id));
for (const n of NEW) {
  if (existing.has(n.id)) continue; // 이미 추가됨(멱등)
  const t = TIER[n.tier];
  const a = ARCH[n.faction];
  const isElite = n.tier === "Elite";
  const h = [...n.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const jitter = 0.92 + (h % 17) / 100;
  data.push({
    id: n.id,
    name: n.name,
    image: `/enemies/${n.img}.webp`,
    maxHp: r(t.hp * a.hp * jitter),
    attack: r(t.atk * a.atk * (0.96 + (h % 9) / 100)),
    defense: r(t.def * a.def),
    speed: Math.min(100, a.spd + (h % 7) - 3),
    range: n.mech.includes("ranged") || n.mech.includes("sniper") ? 7 : 2,
    weight: 1,
    staggerHp: r(t.stag * a.hp * jitter),
    intent: n.intent,
    faction: n.faction,
    tier: n.tier,
    traits: n.traits,
    mechanics: n.mech,
    ...(isElite ? { elite: true } : {}),
  });
}

// ===== 출력 =====
const helpers = `
export function getEnemy(id: string) {
  const enemy = enemies.find((item) => item.id === id);
  if (!enemy) throw new Error(\`Unknown enemy: \${id}\`);
  return enemy;
}

export function getEnemies(ids: string[]) {
  return ids.map(getEnemy);
}
`;
const out = `import type { Enemy } from "../types/game";\n\nexport const enemies: Enemy[] = ${JSON.stringify(data, null, 2)};\n${helpers}`;
writeFileSync(file, out);

const byFac = {};
for (const e of data) (byFac[e.faction] ??= []).push(e.id);
console.log(`적 개편 완료: ${data.length}마리 (신규 ${NEW.length})`);
for (const f of Object.keys(byFac)) console.log(`  ${f}: ${byFac[f].length}`);
