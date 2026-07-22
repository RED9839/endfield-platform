// ===== DD 전투 소모품(전술 아이템) — 지역별 테마 + 깊이별 품질 =====
// 닥던식: 지역(세력)은 아이템 "계열(허브)" 테마만 결정, "품질"은 깊이(난이도)가 결정 → 지역 간 동일 파워.
// 4계열: 메밀꽃·금초(즉시 회복) / 시트론·야침(재생). 등급별 값을 정규화해 어느 지역이든 같은 깊이면 동급.
// r2 가루 → r3 기본 → r4 상급(회복+보호막/재생+추가) → r6 특(보스). 이름은 warfarin 실 카탈로그.
import { applyBuff, healUnit, living, setTimer, type DDState, type DDUnit } from "./combat";

export type ItemKind = "heal" | "heal-shield" | "regen" | "ult" | "revive" | "buff";
export type ItemCond = { type: "hp"; below: number } | { type: "dead" } | { type: "always" };
export type ItemDef = {
  id: string; name: string; kind: ItemKind; rarity: number;
  desc: string;
  cond: ItemCond;
  run: (s: DDState, caster: DDUnit) => void;
};

const lowestAlly = (s: DDState) => living(s, "ally").sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
const deadAlly = (s: DDState) => s.units.find((u) => u.side === "ally" && u.hp <= 0);
const REGEN_TURNS = 3;

const heal = (v: number): ItemDef["run"] => (s) => { const t = lowestAlly(s); if (t) healUnit(t, v, s, s.log); };
const healShield = (v: number, v2: number): ItemDef["run"] => (s) => { const t = lowestAlly(s); if (!t) return; healUnit(t, v, s, s.log); applyBuff(t, "shield", Math.round(t.maxHp * v2), undefined, 4); };
const regen = (tick: number, pctExtra = 0): ItemDef["run"] => (s) => { const t = lowestAlly(s); if (!t) return; t.regen = Math.round(tick); t.regenTurns = REGEN_TURNS; if (pctExtra > 0) healUnit(t, Math.round(t.maxHp * pctExtra), s, s.log); s.log.push(`→ ${t.name} 재생 부여(${Math.round(tick)}/라운드)`); };
const ult = (v: number): ItemDef["run"] => (s) => { const t = living(s, "ally").sort((a, b) => b.ultCharge / b.ultCost - a.ultCharge / a.ultCost)[0]; if (!t) return; t.ultCharge = Math.min(t.ultCost, t.ultCharge + t.ultCost * v); s.log.push(`→ ${t.name} 궁 에너지 +${Math.round(v * 100)}%`); };
const revive = (pct: number): ItemDef["run"] => (s) => { const d = deadAlly(s); if (!d) return; d.hp = Math.round(d.maxHp * pct); s.log.push(`→ ${d.name} 부활! HP ${d.hp}/${d.maxHp}`); };
const dmgBuff = (pct: number): ItemDef["run"] => (s, c) => { c.amp.all = (c.amp.all ?? 0) + pct; setTimer(c, "amp:all", 99); s.log.push(`→ ${c.name} 모든 피해 +${Math.round(pct * 100)}%`); };

// 사용 게이트: 부대가 강해 60%↓로 잘 안 떨어져 소비템이 사실상 봉인됐던 문제 완화.
// 즉시회복=95%↓(피해 조금만 받아도 사용 가능), 재생=90%↓(살짝 더 여유). 만피 낭비만 방지.
const H60 = { type: "hp", below: 0.95 } as const;
const H50 = { type: "hp", below: 0.9 } as const;

// ── 계열별 4등급 정규화 로스터 (즉시회복=메밀꽃·금초 / 재생=시트론·야침, 값은 계열 무관 동일) ──
// 파티 HP 중앙값 ~2806 기준 실효 회복: r2 ~12% · r3 ~22% · r4 ~47%(보호막 포함) · r6 ~67%.
export const ITEMS: Record<string, ItemDef> = {
  // ── 메밀꽃 계열(즉시 회복) ──
  "powder-buck": { id: "powder-buck", name: "메밀꽃 가루", kind: "heal", rarity: 2, cond: H60, desc: "즉시 회복 340", run: heal(340) },
  "heal-cap-1": { id: "heal-cap-1", name: "메밀꽃 치유 캡슐", kind: "heal", rarity: 3, cond: H60, desc: "즉시 회복 620", run: heal(620) },
  "recov-1": { id: "recov-1", name: "메밀꽃 회복제(소)", kind: "heal-shield", rarity: 4, cond: H60, desc: "즉시 회복 700 + 보호막(최대 HP 22%)", run: healShield(700, 0.22) },
  "recov-3": { id: "recov-3", name: "메밀꽃 회복제(특)", kind: "heal-shield", rarity: 6, cond: H60, desc: "즉시 회복 1050 + 보호막(최대 HP 30%)", run: healShield(1050, 0.3) },
  // ── 금초 계열(즉시 회복) ──
  "powder-gold": { id: "powder-gold", name: "금초 가루", kind: "heal", rarity: 2, cond: H60, desc: "즉시 회복 340", run: heal(340) },
  "drink-1": { id: "drink-1", name: "금초 청량음료", kind: "heal", rarity: 3, cond: H60, desc: "즉시 회복 620", run: heal(620) },
  "coldtea-1": { id: "coldtea-1", name: "금초 냉차", kind: "heal-shield", rarity: 4, cond: H60, desc: "즉시 회복 700 + 보호막(최대 HP 22%)", run: healShield(700, 0.22) },
  "coldtea-2": { id: "coldtea-2", name: "금초 냉차(대)", kind: "heal-shield", rarity: 6, cond: H60, desc: "즉시 회복 1050 + 보호막(최대 HP 30%)", run: healShield(1050, 0.3) },
  // ── 시트론 계열(재생) ──
  "powder-cit": { id: "powder-cit", name: "시트론 가루", kind: "regen", rarity: 2, cond: H50, desc: "재생 130/라운드(3라운드)", run: regen(130) },
  "can-1": { id: "can-1", name: "시트론 통조림", kind: "regen", rarity: 3, cond: H50, desc: "재생 210/라운드(3라운드)", run: regen(210) },
  "mix-1": { id: "mix-1", name: "시트론 혼합제(소)", kind: "regen", rarity: 4, cond: H50, desc: "재생 300/라운드 + 즉시 5%", run: regen(300, 0.05) },
  "mix-3": { id: "mix-3", name: "시트론 혼합제(특)", kind: "regen", rarity: 6, cond: H50, desc: "재생 450/라운드 + 즉시 8%", run: regen(450, 0.08) },
  // ── 야침 계열(재생) ──
  "powder-nee": { id: "powder-nee", name: "야침 가루", kind: "regen", rarity: 2, cond: H50, desc: "재생 130/라운드(3라운드)", run: regen(130) },
  "inject-1": { id: "inject-1", name: "야침 주사약", kind: "regen", rarity: 3, cond: H50, desc: "재생 210/라운드(3라운드)", run: regen(210) },
  "spray-1": { id: "spray-1", name: "야침 스프레이", kind: "regen", rarity: 4, cond: H50, desc: "재생 300/라운드 + 즉시 5%", run: regen(300, 0.05) },
  "spray-2": { id: "spray-2", name: "야침 스프레이(대)", kind: "regen", rarity: 6, cond: H50, desc: "재생 450/라운드 + 즉시 8%", run: regen(450, 0.08) },
  // ── 범용(지역 무관): 부활 · 피해 버프 · 궁 에너지 ──
  "revive-1": { id: "revive-1", name: "아츠를 각인한 병", kind: "revive", rarity: 3, cond: { type: "dead" }, desc: "전투 불능 아군 부활 + 최대 HP 30%", run: revive(0.3) },
  "revive-2": { id: "revive-2", name: "아츠를 각인한 금속 병", kind: "revive", rarity: 4, cond: { type: "dead" }, desc: "전투 불능 아군 부활 + 최대 HP 50%", run: revive(0.5) },
  "power-1": { id: "power-1", name: "아츠가 부여된 병", kind: "buff", rarity: 3, cond: { type: "always" }, desc: "사용자 주는 모든 피해 +15%(전투 지속)", run: dmgBuff(0.15) },
  "power-2": { id: "power-2", name: "아츠가 부여된 금속 병", kind: "buff", rarity: 4, cond: { type: "always" }, desc: "사용자 주는 모든 피해 +25%(전투 지속)", run: dmgBuff(0.25) },
  "ult-1": { id: "ult-1", name: "고기들의 회의", kind: "ult", rarity: 2, cond: H50, desc: "궁 게이지 +20%(궁에 가까운 아군)", run: ult(0.2) },
};

export const ITEM_LIST = Object.values(ITEMS);
export const getItem = (id: string) => ITEMS[id];
export const itemImage = (id: string) => { const it = ITEMS[id]; return it ? `/items/${encodeURIComponent(it.name)}.webp` : ""; };

// 런 재화 아이콘 — 원작 아이템 아트(public/items)를 그대로 쓴다.
// 화면마다 Package/◈/💎로 제각각이라 뉴비가 노드의 '◈24'를 부품으로 인지하지 못했다 → 전 화면 통일.
export const RESOURCE_ICON = {
  parts: `/items/${encodeURIComponent("식양 장비 부품")}.webp`,   // 부품
  permits: `/items/${encodeURIComponent("무릉 관리권")}.webp`,    // 관리권
  chips: `/items/${encodeURIComponent("프로토콜 프리즘")}.webp`,   // 프로토콜 프리즘 — 마스터리 전용
  credits: `/items/${encodeURIComponent("탈로시안 화폐")}.webp`,   // 크레딧(상점 통화)
} as const;

// 조건부 게이트 제거 — 소비 아이템은 자기 턴에 조건 없이 상시 사용(자유 행동).
// 부활만 전투 불능 대상이 있어야 의미가 있어 그때만 활성(빈 부활 낭비 방지).
export function canUseItem(s: DDState, id: string): boolean {
  const it = ITEMS[id]; if (!it) return false;
  if (!living(s, "ally").length) return false;
  if (it.kind === "revive") return !!deadAlly(s);
  return true;
}
export function condText(c: ItemCond): string {
  return c.type === "hp" ? `HP<${Math.round(c.below * 100)}%` : c.type === "dead" ? "전투 불능 시" : "상시";
}
// 자동 전투용 소비 아이템 판단 — 플레이어가 할 법한 최소 운용을 규칙화한다.
// 자동에서 아이템을 아예 안 쓰면 수동보다 일방적으로 불리하다(실측: 노힐 파티 보스 승률
// 미브 29->43% · 엠버 43->63% · 로시 86->100%가 아이템 유무만으로 갈렸다).
// 우선순위: 전사자 부활 > 위급(45% 미만) 즉시 회복 > 재생. 여유 있으면 쓰지 않는다.
export function autoItemPick(s: DDState, inv: Record<string, number>): { id: string; target: DDUnit } | null {
  const has = (id: string) => (inv[id] ?? 0) > 0 && canUseItem(s, id);
  const dead = deadAlly(s);
  if (dead) { const rev = Object.keys(inv).find((id) => ITEMS[id]?.kind === "revive" && has(id)); if (rev) return { id: rev, target: dead }; }
  const alive = living(s, "ally");
  const hurt = alive.filter((a) => a.hp / a.maxHp < 0.45).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
  if (!hurt) return null;
  const byKind = (k: string) => Object.keys(inv).filter((id) => ITEMS[id]?.kind === k && has(id))
    .sort((a, b) => (ITEMS[b].rarity ?? 0) - (ITEMS[a].rarity ?? 0))[0];
  const pick = byKind("heal-shield") ?? byKind("heal") ?? byKind("regen");
  return pick ? { id: pick, target: hurt } : null;
}

export function useItem(s: DDState, id: string, caster: DDUnit): boolean {
  const item = ITEMS[id]; if (!item) return false;
  item.run(s, caster); return true;
}

// ===== 지역별 테마 + 깊이별 품질 드랍 =====
// 계열별 등급→아이템 id (즉시회복 2계열·재생 2계열, 값 동일·이름만 다름)
const LINE_TIER: Record<string, Record<number, string>> = {
  "메밀꽃": { 2: "powder-buck", 3: "heal-cap-1", 4: "recov-1", 6: "recov-3" },
  "금초": { 2: "powder-gold", 3: "drink-1", 4: "coldtea-1", 6: "coldtea-2" },
  "시트론": { 2: "powder-cit", 3: "can-1", 4: "mix-1", 6: "mix-3" },
  "야침": { 2: "powder-nee", 3: "inject-1", 4: "spray-1", 6: "spray-2" },
};
// 세력(지역) → 허브 테마(즉시회복 계열 + 재생 계열). 품질은 깊이가 결정하므로 계열 배정은 순수 테마.
const REGION_THEME: Record<string, { heal: string; regen: string }> = {
  "아겔로스": { heal: "메밀꽃", regen: "시트론" },     // 거점 4협곡
  "야외 생물": { heal: "메밀꽃", regen: "야침" },
  "랜드브레이커": { heal: "금초", regen: "야침" },      // 화염
  "수화자": { heal: "금초", regen: "시트론" },          // 무릉(냉기)
  "청파채": { heal: "금초", regen: "야침" },            // 무릉
};
const DEFAULT_THEME = REGION_THEME["아겔로스"];

// 노드 종류 + 깊이 → 아이템 등급(품질). 정예/보스는 상위, 일반은 깊이로 상승.
function itemTier(nodeKind: string, depth: number): number {
  if (nodeKind === "boss") return 6;
  if (nodeKind === "elite") return depth >= 4 ? 6 : 4;
  return depth <= 1 ? 2 : depth <= 3 ? 3 : 4; // 일반
}
// 드랍 후보 풀: 지역 테마(회복+재생) @등급 + 범용(등급대). 전투당 1개 랜덤 획득.
export function rewardItemPool(faction: string, nodeKind: string, depth: number): string[] {
  const tier = itemTier(nodeKind, depth);
  const th = REGION_THEME[faction] ?? DEFAULT_THEME;
  const pool = [LINE_TIER[th.heal][tier], LINE_TIER[th.regen][tier]];
  if (tier <= 2) pool.push("ult-1");             // 저티어: 궁 에너지
  else if (tier === 3) pool.push("revive-1", "power-1"); // 중티어: 기본 부활/버프
  else pool.push("revive-2", "power-2");         // 상위: 금속 병 부활/버프
  return pool.filter(Boolean);
}
export function itemColor(kind: ItemKind): string {
  return kind === "heal" ? "#86efac" : kind === "heal-shield" ? "#38bdf8" : kind === "regen" ? "#5eead4"
    : kind === "revive" ? "#f0abfc" : kind === "buff" ? "#f87171" : "#ffd24a";
}
