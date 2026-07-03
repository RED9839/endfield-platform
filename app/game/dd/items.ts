// ===== DD 전투 소모품(전술 아이템) — warfarin.wiki 데이터마인 원본 값 =====
// 실제 게임 전술 아이템은 대부분 회복 계열: 즉시 회복(heal_potion_1) / 회복+보호막(heal_potion_2, value2) /
// 재생(heal_moss, triggerheal/틱·duration6·최대5스택) / 궁 에너지(ultsp_potion). 값·조건·재사용은 datamine 그대로.
// condParams "0.6 lt" = 대상(최저 체력 아군) HP 60% 미만일 때만 사용 가능(원본 사용 조건). 개별 부위 스탯은 gearGrade로 추상화.
// 재생 duration(초)/스택 → DD 라운드 매핑만 불가피한 스케일 변환(3라운드). 틱당 회복량은 원본 그대로.
import { applyBuff, healUnit, living, setTimer, type DDState, type DDUnit } from "./combat";

export type ItemKind = "heal" | "heal-shield" | "regen" | "ult" | "revive" | "buff";
// 사용 조건(원본 condParams / 아이템 성격): hp=최저 아군 HP<below / dead=전투 불능 아군 존재 / always=무조건
export type ItemCond = { type: "hp"; below: number } | { type: "dead" } | { type: "always" };
export type ItemDef = {
  id: string; name: string; kind: ItemKind;
  desc: string;
  cond: ItemCond;
  run: (s: DDState, caster: DDUnit) => void;
};

const lowestAlly = (s: DDState) => living(s, "ally").sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
const deadAlly = (s: DDState) => s.units.find((u) => u.side === "ally" && u.hp <= 0);
const REGEN_TURNS = 3; // datamine duration 6초·5스택 → DD 라운드 매핑

// 즉시 회복(heal_potion_1): 고정 HP
const heal = (v: number): ItemDef["run"] => (s) => { const t = lowestAlly(s); if (t) healUnit(t, v, s, s.log); };
// 회복 + 보호막(heal_potion_2): 고정 HP + value2×maxHp 보호막
const healShield = (v: number, v2: number): ItemDef["run"] => (s) => { const t = lowestAlly(s); if (!t) return; healUnit(t, v, s, s.log); applyBuff(t, "shield", Math.round(t.maxHp * v2), undefined, 4); };
// 재생(heal_moss): triggerheal/라운드 × REGEN_TURNS (+ triggerheal2×maxHp 즉시)
const regen = (tick: number, pctExtra = 0): ItemDef["run"] => (s) => { const t = lowestAlly(s); if (!t) return; t.regen = Math.round(tick); t.regenTurns = REGEN_TURNS; if (pctExtra > 0) healUnit(t, Math.round(t.maxHp * pctExtra), s, s.log); s.log.push(`→ ${t.name} 재생 부여(${Math.round(tick)}/라운드)`); };
// 궁 에너지(ultsp_potion): 궁에 가장 가까운 아군 궁 게이지 +value×ultCost
const ult = (v: number): ItemDef["run"] => (s) => { const t = living(s, "ally").sort((a, b) => b.ultCharge / b.ultCost - a.ultCharge / a.ultCost)[0]; if (!t) return; t.ultCharge = Math.min(t.ultCost, t.ultCharge + t.ultCost * v); s.log.push(`→ ${t.name} 궁 에너지 +${Math.round(v * 100)}%`); };
// 부활(아츠를 각인한 병): 전투 불능 아군 1명 즉시 부활 + 최대 HP pct 회복
const revive = (pct: number): ItemDef["run"] => (s) => { const d = deadAlly(s); if (!d) return; d.hp = Math.round(d.maxHp * pct); s.log.push(`→ ${d.name} 부활! HP ${d.hp}/${d.maxHp}`); };
// 전투력 버프(아츠가 부여된 병): 사용자(caster) 주는 모든 피해 +pct, 300초≈전투 지속
const dmgBuff = (pct: number): ItemDef["run"] => (s, c) => { c.amp.all = (c.amp.all ?? 0) + pct; setTimer(c, "amp:all", 99); s.log.push(`→ ${c.name} 모든 피해 +${Math.round(pct * 100)}%`); };

// warfarin datamine 원본 값(buffBBData.value 등)
export const ITEMS: Record<string, ItemDef> = {
  // ── 메밀꽃 치유 캡슐: 즉시 회복(heal_potion_1) ──
  "heal-cap-1": { id: "heal-cap-1", name: "메밀꽃 치유 캡슐", kind: "heal", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 470", run: heal(470) },
  "heal-cap-2": { id: "heal-cap-2", name: "메밀꽃 치유 캡슐(중)", kind: "heal", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 655", run: heal(655) },
  "heal-cap-3": { id: "heal-cap-3", name: "메밀꽃 치유 캡슐(대)", kind: "heal", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 891", run: heal(891) },
  // ── 금초 청량음료: 대형 즉시 회복 ──
  "drink-1": { id: "drink-1", name: "금초 청량음료", kind: "heal", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 1278", run: heal(1278) },
  "drink-2": { id: "drink-2", name: "고급 금초 청량음료", kind: "heal", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 1564", run: heal(1564) },
  // ── 메밀꽃 회복제 / 금초 냉차: 회복 + 보호막(heal_potion_2, value2=0.2) ──
  "recov-1": { id: "recov-1", name: "메밀꽃 회복제(소)", kind: "heal-shield", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 655 + 보호막(최대 HP 20%)", run: healShield(655, 0.2) },
  "coldtea-1": { id: "coldtea-1", name: "금초 냉차", kind: "heal-shield", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 1564 + 보호막(최대 HP 20%)", run: healShield(1564, 0.2) },
  "coldtea-2": { id: "coldtea-2", name: "금초 냉차(대)", kind: "heal-shield", cond: { type: "hp", below: 0.6 }, desc: "즉시 회복 1648 + 보호막(최대 HP 20%)", run: healShield(1648, 0.2) },
  // ── 시트론 통조림: 재생(heal_moss_1) ──
  "can-1": { id: "can-1", name: "시트론 통조림", kind: "regen", cond: { type: "hp", below: 0.5 }, desc: "재생 117/라운드(3라운드)", run: regen(117) },
  "can-3": { id: "can-3", name: "시트론 통조림(대)", kind: "regen", cond: { type: "hp", below: 0.5 }, desc: "재생 223/라운드(3라운드)", run: regen(223) },
  // ── 야침 주사약: 재생(heal_moss_1) ──
  "inject-1": { id: "inject-1", name: "야침 주사약", kind: "regen", cond: { type: "hp", below: 0.5 }, desc: "재생 320/라운드(3라운드)", run: regen(320) },
  "inject-2": { id: "inject-2", name: "고급 야침 주사약", kind: "regen", cond: { type: "hp", below: 0.5 }, desc: "재생 391/라운드(3라운드)", run: regen(391) },
  // ── 시트론 혼합제 / 야침 스프레이: 재생 + 추가 회복(heal_moss_2, triggerheal2=0.05) ──
  "mix-1": { id: "mix-1", name: "시트론 혼합제(소)", kind: "regen", cond: { type: "hp", below: 0.5 }, desc: "재생 164/라운드 + 즉시 5%", run: regen(164, 0.05) },
  "spray-1": { id: "spray-1", name: "야침 스프레이", kind: "regen", cond: { type: "hp", below: 0.5 }, desc: "재생 391/라운드 + 즉시 5%", run: regen(391, 0.05) },
  // ── 고기들의 회의: 궁 에너지(ultsp_potion, value=0.2) ──
  "ult-1": { id: "ult-1", name: "고기들의 회의", kind: "ult", cond: { type: "hp", below: 0.5 }, desc: "궁 게이지 +20%(궁에 가까운 아군)", run: ult(0.2) },
  // ── 아츠를 각인한 (금속) 병: 부활 + 최대 HP 30%(전투 불능 아군, 원본) ──
  "revive-1": { id: "revive-1", name: "아츠를 각인한 금속 병", kind: "revive", cond: { type: "dead" }, desc: "전투 불능 아군 부활 + 최대 HP 30%", run: revive(0.3) },
  // ── 아츠가 부여된 (금속) 병: 사용자 모든 피해 +25%(300초, 원본) ──
  "power-1": { id: "power-1", name: "아츠가 부여된 금속 병", kind: "buff", cond: { type: "always" }, desc: "사용자 주는 모든 피해 +25%(전투 지속)", run: dmgBuff(0.25) },
};

export const ITEM_LIST = Object.values(ITEMS);
export const getItem = (id: string) => ITEMS[id];

// 사용 조건(원본): hp=최저 아군 HP<below · dead=전투 불능 아군 존재 · always=무조건
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

// 전투 승리 보상 후보. 정예=상급 회복/궁, 일반=하급 위주.
export function rewardItemPool(nodeKind: string): string[] {
  if (nodeKind === "elite") return ["heal-cap-3", "drink-2", "coldtea-2", "inject-2", "ult-1", "spray-1", "revive-1", "power-1"];
  return ["heal-cap-1", "heal-cap-1", "heal-cap-2", "can-1", "recov-1", "inject-1", "power-1"];
}
export function itemColor(kind: ItemKind): string {
  return kind === "heal" ? "#86efac" : kind === "heal-shield" ? "#38bdf8" : kind === "regen" ? "#5eead4"
    : kind === "revive" ? "#f0abfc" : kind === "buff" ? "#f87171" : "#ffd24a";
}
