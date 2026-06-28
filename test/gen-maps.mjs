// 맵 생성기: 엔드필드 실제 적 세력 5개(스토리 기반) × 20층 3계층. 적 티어 드랍 연동.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const enemiesSrc = readFileSync(join(root, "app/game/data/enemies.ts"), "utf8");

// enemy id → tier
const tierOf = {};
{ const re = /"id": "([^"]+)"[\s\S]*?"tier": "([^"]+)"/g; let m; while ((m = re.exec(enemiesSrc))) tierOf[m[1]] = m[2]; }

// ===== 엔드필드 본편 스토리 기반 적 세력(보스 = 실제 본편 보스로 검증) =====
//  무대: Chapter1 발리 IV / Chapter2 무릉. 각 세력의 boss는 위키에서 확인한 실제 스토리 보스.
//  · 광석수: 탈로스 II 토착 감염수 무리. 보스 Craghowler(야생 정예 보스).
//  · 아겔로이: Ankhors가 자연물+헤일로로 빚은 구조체 군세. 보스 Triaggelos(Ch1-P3 지령의 요람).
//  · 침식 아겔로이: 네파리스가 블라이트로 빚어낸 마블 변이체 + Tidewalker 부식 변종.
//      보스 Marble Aggelomoirai(Ch1-P4 꺼지지 않는 잔불, 네파리스 외형 모방).
//  · 랜드브레이커: Jakub의 유산을 잇는 최흉 본크러셔. 두목 Nefarith(Ch2-P5)·우장 Rhodagn(Ch1-P1).
//  · 청파채(Cangzei): 무릉성과 앙숙인 녹림풍 산채 무법단(염국 파생). 두목 원일(탕탕의 오빠)=1.1 최종보스.
const FACTIONS = [
  {
    name: "탈로스 광석수 무리", short: "광석수",
    ids: ["rockhowler", "waterlamp", "acid-originium-slug", "acid-originium-slug-alpha", "firemist-originium-slug", "blazemist-originium-slug", "indigenous-pincerbeast", "brutal-pincerbeast", "hazefyre-tuskbeast", "imbued-quillbeast", "quillbeast", "tunneling-nidwyrm", "armored-manglerbeast", "glaring-rakerbeast", "axe-armorbeast", "spotted-rakerbeast", "skydrummer", "hazefyre-axe-armorbeast", "craghowler"],
    boss: "craghowler",
  },
  {
    // 4번 협곡(Valley IV) 아겔로스 — 위키 2.1.1 형성 모델. 보스 트리아겔로스 + 마블 아겔로미레.
    name: "아겔로이 강습 군세", short: "아겔로이",
    ids: ["ram", "ram-alpha", "sting", "sting-alpha", "falsewings", "falsewings-alpha", "heavy-ram", "heavy-ram-alpha", "heavy-sting", "heavy-sting-alpha", "walking-chrysopolis", "effigy", "sentinel", "marble-appendage", "marble-aggelomoirai", "marble-aggelomoirai-awakened", "triaggelos"],
    boss: "triaggelos",
  },
  {
    // 무릉(Wuling) 아겔로스 — 위키 2.1.2 형성 모델(탁류·수정·굴절·조류). 보스 파조의 상.
    name: "무릉 조석 아겔로이", short: "조석",
    ids: ["mudflow", "mudflow-delta", "hedron", "hedron-delta", "prism", "tidewalker", "tidewalker-delta", "tidalklast"],
    boss: "tidalklast",
  },
  {
    name: "변경 무법 본크러셔", short: "본크러셔",
    ids: ["bonekrusher-ambusher", "bonekrusher-infiltrator", "bonekrusher-raider", "bonekrusher-ripptusk", "bonekrusher-vanguard", "elite-ambusher", "elite-raider", "elite-ripptusk", "hazefyre-claw", "bonekrusher-arsonist", "bonekrusher-pyromancer", "bonekrusher-ballista", "bonekrusher-executioner", "bonekrusher-siegeknuckles", "elite-executioner", "nefarith-bonekrusher", "nefarith-conqueror", "rhodagn-the-bonekrushing-fist"],
    boss: "nefarith-conqueror",
  },
  {
    name: "청파채 무법단", short: "청파채",
    ids: ["grove-archer", "highway-reaver", "road-plunderer", "sweeping-wind", "cloud-stalker", "nimbus-razor", "breaking-gust", "cloud-obliterator", "hill-smasher", "ruan-yi"],
    boss: "ruan-yi",
  },
];

// 세력별 풀을 티어로 버킷팅
const pools = FACTIONS.map((f) => {
  const b = { Common: [], Normal: [], Enhanced: [], Advanced: [], Alpha: [], Elite: [], Boss: [] };
  for (const id of f.ids) { const t = tierOf[id]; if (t && b[t]) b[t].push(id); }
  return b;
});

function mulberry(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (arr, rng, n = 1) => { const a = arr.slice(); const out = []; for (let i = 0; i < n && a.length; i++) out.push(a.splice(Math.floor(rng() * a.length), 1)[0]); return out; };

// 일반 전투 티어: 부드러운 램프. Elite는 제외(정예 노드 전용) — 후반 전투가 보스보다 어려운 절벽 방지.
const LAYER_TIERS = { outer: ["Common", "Normal"], core: ["Normal", "Enhanced", "Advanced"], deep: ["Enhanced", "Advanced", "Alpha"] };
function poolFor(f, tiers) {
  const out = [];
  for (const t of tiers) out.push(...pools[f][t]);
  if (out.length) return out;
  // 폴백도 Elite/Boss 제외(전투 노드가 정예급으로 튀지 않게)
  for (const t of ["Advanced", "Enhanced", "Normal", "Alpha", "Common"]) if (pools[f][t].length) return pools[f][t];
  return [FACTIONS[f].ids[0]];
}
const eliteFor = (f) => (pools[f].Elite.length ? pools[f].Elite : poolFor(f, ["Enhanced", "Advanced", "Alpha"]));

// 떠도는 야생 생물(광석수): 스토리상 모든 지역에 출몰 → 세력 1~4 전투에 1마리씩 섞어 다양성 확보.
const WILD = {
  outer: ["rockhowler", "waterlamp", "acid-originium-slug", "firemist-originium-slug", "indigenous-pincerbeast", "blazemist-originium-slug", "acid-originium-slug-alpha", "brutal-pincerbeast", "hazefyre-tuskbeast", "aethillu", "imbued-quillbeast", "quillbeast", "tunneling-nidwyrm"],
  core: ["imbued-quillbeast", "quillbeast", "tunneling-nidwyrm", "brutal-pincerbeast", "hazefyre-tuskbeast", "armored-manglerbeast", "glaring-rakerbeast", "spotted-rakerbeast"],
  deep: ["armored-manglerbeast", "glaring-rakerbeast", "axe-armorbeast", "hazefyre-axe-armorbeast", "skydrummer", "spotted-rakerbeast"],
};
const wildFor = (layer) => WILD[layer];
// 전투 야생 슬롯: Elite/Boss 티어 제외(정예급 야생이 일반 전투에 섞이는 것 방지). 비면 원본 폴백.
const wildBattle = (layer) => { const w = WILD[layer].filter((id) => !["Elite", "Boss"].includes(tierOf[id])); return w.length ? w : WILD[layer]; };
const layerOf = (floor) => (floor <= 7 ? "outer" : floor <= 14 ? "core" : "deep");
const rewardTierOf = (floor, type) => (type === "boss" ? "boss" : type === "elite" ? (floor <= 7 ? "mid" : floor <= 14 ? "late" : "elite") : floor <= 7 ? "early" : floor <= 14 ? "mid" : "late");

// 카제나식 다채로운 필드: 전투/정예/이벤트/정비소(shop) + 보물(treasure)·미지(unknown,?) 노드 + 다분기.
//  treasure = 무전투 보상(장비·유물) · unknown = 입장 시 전투/이벤트/보물 중 랜덤 해소.
const PLAN = [
  ["battle", "battle"], ["battle", "unknown", "event"], ["battle", "treasure"], ["shop"],
  ["battle", "elite", "unknown"], ["unknown", "event"], ["battle", "treasure", "battle"], ["shop"],
  ["elite", "unknown", "event"], ["battle", "treasure"], ["shop"], ["battle", "elite"],
  ["unknown", "event", "battle"], ["treasure", "shop"], ["battle", "elite"], ["unknown", "event"],
  ["shop"], ["elite", "battle", "unknown"], ["shop"], ["boss"],
];
const COLS = [0, 4, 2, 1, 3];
const titleOf = (type, short) => type === "boss" ? `${short} 심층부 · 최종` : type === "elite" ? "정예 교전" : type === "event" ? "조우 신호" : type === "shop" ? "델랑 보급소" : type === "camp" ? "전선 캠프" : type === "treasure" ? "보급 캐시" : type === "unknown" ? "미지 신호" : "교전";

const nodes = [];
const factionMeta = [];
for (let f = 0; f < FACTIONS.length; f++) {
  const rng = mulberry(1000 + f * 131);
  const floors = [];
  for (let fl = 1; fl <= 20; fl++) {
    const plan = PLAN[fl - 1];
    const ids = [];
    plan.forEach((type, i) => {
      const col = plan.length === 1 ? 2 : COLS[i % COLS.length];
      const id = `f${f}-${fl}-${i}`;
      const layer = layerOf(fl);
      let enemyIds;
      if (type === "elite") {
        // 정예: 세력 정예 1 + (세력 1~4는 떠도는 야생 정예, 세력 0은 동일 계층 1)
        const second = f !== 0 ? wildFor(layer) : poolFor(f, LAYER_TIERS[layer]);
        enemyIds = [...pick(eliteFor(f), rng, 1), ...pick(second, rng, 1)];
      } else if (type === "battle" || type === "unknown") {
        // 교전/미지: 세력 적 다수 + 떠도는 야생 1마리(세력 1~4)로 매 전투 구성 다양화. unknown은 입장 시 전투/이벤트/보물로 해소.
        const total = layer === "outer" ? 2 : 3;
        const facCount = f === 0 ? total : total - 1;
        enemyIds = pick(poolFor(f, LAYER_TIERS[layer]), rng, facCount);
        if (f !== 0) enemyIds.push(...pick(wildBattle(layer), rng, 1));
      } else if (type === "boss") {
        // 보스 동반 적: 세력 무관 Advanced/Alpha로 통일(Elite 동반 시 보스보다 어려워지는 편차 방지).
        enemyIds = [FACTIONS[f].boss, ...pick(poolFor(f, ["Advanced", "Alpha"]), rng, 1)];
      }
      nodes.push({ id, chapter: f, floor: fl, column: col, type, title: titleOf(type, FACTIONS[f].short), subtitle: layer === "outer" ? "외곽" : layer === "core" ? "중심부" : "심층부", enemyIds, rewardTier: rewardTierOf(fl, type), next: [] });
      ids.push(id);
    });
    floors.push(ids);
  }
  for (let fl = 0; fl < 19; fl++) {
    const cur = floors[fl].map((id) => nodes.find((n) => n.id === id));
    const nxt = floors[fl + 1].map((id) => nodes.find((n) => n.id === id));
    for (const c of cur) {
      if (nxt.length === 1) { c.next = [nxt[0].id]; continue; }
      const sorted = nxt.slice().sort((a, b) => Math.abs(a.column - c.column) - Math.abs(b.column - c.column));
      c.next = sorted.slice(0, rng() < 0.5 ? 1 : 2).map((n) => n.id);
    }
    for (const n of nxt) if (!cur.some((c) => c.next.includes(n.id))) { cur.slice().sort((a, b) => Math.abs(a.column - n.column) - Math.abs(b.column - n.column))[0].next.push(n.id); }
  }
  factionMeta.push({ index: f, name: FACTIONS[f].name, short: FACTIONS[f].short, startNodeIds: floors[0], bossNodeId: floors[19][0] });
}

const out = `import type { MapNode } from "../types/game";

// 자동 생성: test/gen-maps.mjs — 엔드필드 실제 적 세력 ${FACTIONS.length}개 × 20층 3계층. 적 티어 드랍 연동.
const allFactionNodes: MapNode[] = ${JSON.stringify(nodes, null, 2)};

export const mapNodes = allFactionNodes;
export type FactionMeta = { index: number; name: string; short: string; startNodeIds: string[]; bossNodeId: string };
export const factions: FactionMeta[] = ${JSON.stringify(factionMeta, null, 2)};
export const chapters = factions;
export const startingNodeIds = factions[0].startNodeIds;
export function getFactionStart(index: number) { return factions[index]?.startNodeIds ?? []; }
export function getMapNode(id: string) {
  const node = mapNodes.find((n) => n.id === id);
  if (!node) throw new Error(\`Unknown map node: \${id}\`);
  return node;
}
`;
writeFileSync(join(root, "app/game/data/maps.ts"), out);
console.log(`맵 생성: ${FACTIONS.length}세력 · ${nodes.length}노드`);
FACTIONS.forEach((f, i) => { const c = {}; for (const t of Object.keys(pools[i])) if (pools[i][t].length) c[t] = pools[i][t].length; console.log(`  ${f.short}: ${JSON.stringify(c)}`); });
