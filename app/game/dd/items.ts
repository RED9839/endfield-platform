// ===== DD 전투 소모품(전술 아이템) — warfarin.wiki 실제 카탈로그(사용할 수 있는 아이템·전술 아이템) 정합 =====
// 실 게임 전술 아이템 계열 그대로: 메밀꽃(즉시 회복)·금초(대형 즉시 회복)·시트론(재생)·야침(재생 강)·
// 회복제/냉차(회복+보호막)·혼합제/스프레이(재생+추가)·아츠 각인 병(부활)·아츠 부여 병(피해 버프)·고기들의 회의(궁 에너지).
// 등급(rarity) r2 가루 → r3 기본 → r4 고급/대 → r6 특/대(대). 회복량은 datamine 패턴 스케일.
import { applyBuff, healUnit, living, setTimer, type DDState, type DDUnit } from "./combat";

export type ItemKind = "heal" | "heal-shield" | "regen" | "ult" | "revive" | "buff";
// 사용 조건: hp=최저 아군 HP<below / dead=전투 불능 아군 존재 / always=무조건
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

const H60 = { type: "hp", below: 0.6 } as const; // 회복류: 최저 HP<60%
const H50 = { type: "hp", below: 0.5 } as const; // 재생류: 최저 HP<50%

// 실 카탈로그(전술 아이템) 정합 로스터
export const ITEMS: Record<string, ItemDef> = {
  // ── 메밀꽃 계열: 즉시 회복(heal_potion_1) ──
  "powder-heal": { id: "powder-heal", name: "메밀꽃 가루", kind: "heal", rarity: 2, cond: H60, desc: "즉시 회복 300", run: heal(300) },
  "heal-cap-1": { id: "heal-cap-1", name: "메밀꽃 치유 캡슐", kind: "heal", rarity: 3, cond: H60, desc: "즉시 회복 470", run: heal(470) },
  "heal-cap-2": { id: "heal-cap-2", name: "메밀꽃 치유 캡슐(중)", kind: "heal", rarity: 3, cond: H60, desc: "즉시 회복 655", run: heal(655) },
  "heal-cap-3": { id: "heal-cap-3", name: "메밀꽃 치유 캡슐(대)", kind: "heal", rarity: 4, cond: H60, desc: "즉시 회복 891", run: heal(891) },
  // ── 금초 계열: 대형 즉시 회복 ──
  "powder-drink": { id: "powder-drink", name: "금초 가루", kind: "heal", rarity: 2, cond: H60, desc: "즉시 회복 760", run: heal(760) },
  "drink-1": { id: "drink-1", name: "금초 청량음료", kind: "heal", rarity: 3, cond: H60, desc: "즉시 회복 1278", run: heal(1278) },
  "drink-2": { id: "drink-2", name: "고급 금초 청량음료", kind: "heal", rarity: 4, cond: H60, desc: "즉시 회복 1564", run: heal(1564) },
  // ── 시트론 계열: 재생(heal_moss_1) ──
  "powder-can": { id: "powder-can", name: "시트론 가루", kind: "regen", rarity: 2, cond: H50, desc: "재생 80/라운드(3라운드)", run: regen(80) },
  "can-1": { id: "can-1", name: "시트론 통조림", kind: "regen", rarity: 3, cond: H50, desc: "재생 117/라운드(3라운드)", run: regen(117) },
  "can-2": { id: "can-2", name: "시트론 통조림(중)", kind: "regen", rarity: 3, cond: H50, desc: "재생 164/라운드(3라운드)", run: regen(164) },
  "can-3": { id: "can-3", name: "시트론 통조림(대)", kind: "regen", rarity: 4, cond: H50, desc: "재생 223/라운드(3라운드)", run: regen(223) },
  // ── 야침 계열: 재생 강(heal_moss_1 상위) ──
  "powder-inject": { id: "powder-inject", name: "야침 가루", kind: "regen", rarity: 2, cond: H50, desc: "재생 220/라운드(3라운드)", run: regen(220) },
  "inject-1": { id: "inject-1", name: "야침 주사약", kind: "regen", rarity: 3, cond: H50, desc: "재생 320/라운드(3라운드)", run: regen(320) },
  "inject-2": { id: "inject-2", name: "고급 야침 주사약", kind: "regen", rarity: 4, cond: H50, desc: "재생 391/라운드(3라운드)", run: regen(391) },
  // ── 메밀꽃 회복제: 회복 + 보호막(heal_potion_2, value2) ──
  "recov-1": { id: "recov-1", name: "메밀꽃 회복제(소)", kind: "heal-shield", rarity: 4, cond: H60, desc: "즉시 회복 655 + 보호막(최대 HP 20%)", run: healShield(655, 0.2) },
  "recov-2": { id: "recov-2", name: "메밀꽃 회복제(대)", kind: "heal-shield", rarity: 4, cond: H60, desc: "즉시 회복 891 + 보호막(최대 HP 22%)", run: healShield(891, 0.22) },
  "recov-3": { id: "recov-3", name: "메밀꽃 회복제(특)", kind: "heal-shield", rarity: 6, cond: H60, desc: "즉시 회복 1200 + 보호막(최대 HP 28%)", run: healShield(1200, 0.28) },
  // ── 금초 냉차: 대형 회복 + 보호막 ──
  "coldtea-1": { id: "coldtea-1", name: "금초 냉차", kind: "heal-shield", rarity: 4, cond: H60, desc: "즉시 회복 1564 + 보호막(최대 HP 20%)", run: healShield(1564, 0.2) },
  "coldtea-2": { id: "coldtea-2", name: "금초 냉차(대)", kind: "heal-shield", rarity: 6, cond: H60, desc: "즉시 회복 1900 + 보호막(최대 HP 28%)", run: healShield(1900, 0.28) },
  // ── 시트론 혼합제: 재생 + 즉시 추가 회복(heal_moss_2, triggerheal2) ──
  "mix-1": { id: "mix-1", name: "시트론 혼합제(소)", kind: "regen", rarity: 4, cond: H50, desc: "재생 164/라운드 + 즉시 5%", run: regen(164, 0.05) },
  "mix-2": { id: "mix-2", name: "시트론 혼합제(대)", kind: "regen", rarity: 4, cond: H50, desc: "재생 223/라운드 + 즉시 5%", run: regen(223, 0.05) },
  "mix-3": { id: "mix-3", name: "시트론 혼합제(특)", kind: "regen", rarity: 6, cond: H50, desc: "재생 340/라운드 + 즉시 8%", run: regen(340, 0.08) },
  // ── 야침 스프레이: 재생 강 + 즉시 추가 회복 ──
  "spray-1": { id: "spray-1", name: "야침 스프레이", kind: "regen", rarity: 4, cond: H50, desc: "재생 391/라운드 + 즉시 5%", run: regen(391, 0.05) },
  "spray-2": { id: "spray-2", name: "야침 스프레이(대)", kind: "regen", rarity: 6, cond: H50, desc: "재생 500/라운드 + 즉시 8%", run: regen(500, 0.08) },
  // ── 아츠를 각인한 병: 부활 ──
  "revive-1": { id: "revive-1", name: "아츠를 각인한 병", kind: "revive", rarity: 3, cond: { type: "dead" }, desc: "전투 불능 아군 부활 + 최대 HP 30%", run: revive(0.3) },
  "revive-2": { id: "revive-2", name: "아츠를 각인한 금속 병", kind: "revive", rarity: 4, cond: { type: "dead" }, desc: "전투 불능 아군 부활 + 최대 HP 50%", run: revive(0.5) },
  // ── 아츠가 부여된 병: 피해 버프 ──
  "power-1": { id: "power-1", name: "아츠가 부여된 병", kind: "buff", rarity: 3, cond: { type: "always" }, desc: "사용자 주는 모든 피해 +15%(전투 지속)", run: dmgBuff(0.15) },
  "power-2": { id: "power-2", name: "아츠가 부여된 금속 병", kind: "buff", rarity: 4, cond: { type: "always" }, desc: "사용자 주는 모든 피해 +25%(전투 지속)", run: dmgBuff(0.25) },
  // ── 고기들의 회의: 궁 에너지(ultsp_potion) ──
  "ult-1": { id: "ult-1", name: "고기들의 회의", kind: "ult", rarity: 2, cond: H50, desc: "궁 게이지 +20%(궁에 가까운 아군)", run: ult(0.2) },
};

export const ITEM_LIST = Object.values(ITEMS);
export const getItem = (id: string) => ITEMS[id];
// 실제 인게임 아이템 아이콘(warfarin 카탈로그, public/items/{이름}.webp)
export const itemImage = (id: string) => { const it = ITEMS[id]; return it ? `/items/${encodeURIComponent(it.name)}.webp` : ""; };

export function canUseItem(s: DDState, id: string): boolean {
  const it = ITEMS[id]; if (!it) return false;
  if (!living(s, "ally").length) return false;
  if (it.cond.type === "always") return true;
  if (it.cond.type === "dead") return !!deadAlly(s);
  const t = lowestAlly(s); if (!t) return false;
  return t.hp / t.maxHp < it.cond.below;
}
export function condText(c: ItemCond): string {
  return c.type === "hp" ? `HP<${Math.round(c.below * 100)}%` : c.type === "dead" ? "전투 불능 시" : "상시";
}
export function useItem(s: DDState, id: string, caster: DDUnit): boolean {
  const item = ITEMS[id]; if (!item) return false;
  item.run(s, caster); return true;
}

// ── 드랍테이블: 노드 티어별 등급 정합 (일반 r2~3 · 정예 r4 · 보스 r6+상위 r4). 보스 전용 풀 분리(고급 보장). ──
const POOL_NORMAL = ["powder-heal", "heal-cap-1", "heal-cap-2", "drink-1", "powder-can", "can-1", "can-2", "inject-1", "ult-1", "revive-1", "power-1"];
const POOL_ELITE = ["heal-cap-3", "drink-2", "can-3", "inject-2", "recov-1", "recov-2", "coldtea-1", "mix-1", "mix-2", "spray-1", "revive-2", "power-2"];
const POOL_BOSS = ["recov-3", "coldtea-2", "mix-3", "spray-2", "revive-2", "power-2", "drink-2", "inject-2"];
export function rewardItemPool(nodeKind: string): string[] {
  if (nodeKind === "boss") return POOL_BOSS;
  if (nodeKind === "elite") return POOL_ELITE;
  return POOL_NORMAL;
}
export function itemColor(kind: ItemKind): string {
  return kind === "heal" ? "#86efac" : kind === "heal-shield" ? "#38bdf8" : kind === "regen" ? "#5eead4"
    : kind === "revive" ? "#f0abfc" : kind === "buff" ? "#f87171" : "#ffd24a";
}
