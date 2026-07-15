// 오퍼레이터 시그니처 무기(엔드필드식) — 실제 무기 타입(위키 헤더 실측) + 6★ 공격력 + 타입 고유효과.
// 개별 무기 수치/패시브는 소스 미공개 → 타입은 실데이터, 효과는 위키 타입 역할(양손검=불균형↑·아츠유닛=아츠·권총=아츠반응·한손검=근접치명·장병기=스킬) 기반 모델.
import type { DDUnit } from "./combat";
import { setTimer, pushSrc, popSrc } from "./combat";
import { applyAttrs, attrBonusOf, OP_MAINSUB } from "./roster";
import { weaponSummaries } from "@/data/weapons-summary-data";
import { OP_WEAPON_SERIES } from "./weapon-series";
import type { WeaponType } from "./weapon-type";
import { OP_WEAPON, WEAPON_KO } from "./weapon-type";

export type { WeaponType } from "./weapon-type";
export { WEAPON_KO, WEAPON_ICON, OP_WEAPON, WEAPON_SPEED, speedOf } from "./weapon-type";

export const WEAPON_EFFECT_KO: Record<WeaponType, string> = {
  sword: "속도 72 · 치명 확률 +8%",
  greatsword: "속도 48 · 불균형 누적 +25%",
  polearm: "속도 58 · 배틀 스킬 피해 +15%",
  handcannon: "속도 70 · 전 피해 +10%",
  artsunit: "속도 62 · 원소 피해 +12%",
};

// 오퍼별 실제 전무(전용무기) — 커뮤니티 빌드 시트 기준(각 오퍼 첫 추천무기 = 전무, 딜/서폿 분리는 2개).
// code = 주,부옵(지=지능·힘·민=민첩·의=의지·주=주스탯 / 공=공격력·궁=궁극·치=치명·생=생명·열/냉/전/아/물=피해 등).
export type Jeonmu = { name: string; code: string; role?: string };
export const OP_JEONMU: Record<string, Jeonmu[]> = {
  laevatain: [{ name: "용조의 불꽃", code: "지공어" }],
  ember: [{ name: "모범", code: "주공억", role: "딜" }, { name: "과거의 일품", code: "의생효", role: "폿" }],
  wulfgard: [{ name: "클래니벌", code: "주아고" }],
  akekuri: [{ name: "테르밋 커터", code: "의공흐" }],
  camu: [{ name: "붉게 물든 가호", code: "민열흐" }],
  yvonne: [{ name: "예술의 폭군", code: "지치골" }],
  lastrite: [{ name: "헤라펜거", code: "힘공방" }],
  tangtang: [{ name: "반항", code: "민공방" }],
  snowshine: [{ name: "과거의 일품", code: "의생효" }],
  xaihi: [{ name: "기사도 정신", code: "의생의" }],
  alesh: [{ name: "테르밋 커터", code: "의공흐" }],
  estella: [{ name: "O.B.J. 스파이크", code: "의물고" }],
  zhuangfangyi: [{ name: "고독한 나룻배", code: "의공억" }],
  avywenna: [{ name: "J.E.T.", code: "주공억" }],
  perlica: [{ name: "망각", code: "지아어" }],
  arclight: [{ name: "테르밋 커터", code: "의공흐" }],
  antal: [{ name: "폭발 유닛", code: "주오방" }],
  gilberta: [{ name: "사명의 길", code: "의궁추" }],
  ardelia: [{ name: "바다와 별의 꿈", code: "지치고" }],
  fluorite: [{ name: "O.B.J. 벨로시투스", code: "민궁방" }],
  pogranichnik: [{ name: "테르밋 커터", code: "의공흐" }],
  lifeng: [{ name: "산의 지배자", code: "민물효" }],
  endministrator: [{ name: "장대한 염원", code: "민공고" }],
  rossi: [{ name: "늑대의 혈흔", code: "민치골" }],
  chenqianyu: [{ name: "부요", code: "주치어" }],
  dapan: [{ name: "모범", code: "주공억" }],
  catcher: [{ name: "과거의 일품", code: "의생효" }],
  mifu: [{ name: "적영", code: "힘공기" }],
};
export const jeonmuOf = (id: string): Jeonmu[] => OP_JEONMU[id] ?? [];

// 전무 실측 스탯(data/weapons-source 랭크9 + 최대 기초공격력). buff=능력치버프, sub=부가스탯.
export type WeaponStats = { atk: number; buff: string; buffVal: number; sub: string; subVal: number; subFlat?: boolean; uniq: string };
export const OP_WEAPON_STATS: Record<string, WeaponStats> = {
  laevatain: { atk: 510, buff: "int", buffVal: 156, sub: "atk", subVal: 39, uniq: "어둠 · 울부짖는 불길" },
  ember: { atk: 500, buff: "main", buffVal: 132, sub: "atk", subVal: 39, uniq: "억제 · 다층 절단" },
  wulfgard: { atk: 490, buff: "main", buffVal: 132, sub: "arts", subVal: 43.3, uniq: "고통 · 가차 없는 숙청" },
  akekuri: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  camu: { atk: 500, buff: "agi", buffVal: 156, sub: "elem", subVal: 43.3, uniq: "흐름 · 심판" },
  yvonne: { atk: 505, buff: "int", buffVal: 156, sub: "crit", subVal: 19.5, uniq: "골절 · 예술적 폭론" },
  lastrite: { atk: 505, buff: "str", buffVal: 156, sub: "atk", subVal: 39, uniq: "방출 · 사무치는 추위" },
  tangtang: { atk: 505, buff: "agi", buffVal: 156, sub: "atk", subVal: 39, uniq: "방출 · 토벌의 원한" },
  snowshine: { atk: 495, buff: "wil", buffVal: 156, sub: "hp", subVal: 78, uniq: "효율 · 절개 의료법" },
  xaihi: { atk: 485, buff: "wil", buffVal: 156, sub: "hp", subVal: 78, uniq: "의료 · 침식성 광기의 불꽃" },
  alesh: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  estella: { atk: 411, buff: "wil", buffVal: 124, sub: "phys", subVal: 34.7, uniq: "고통 · 빙산을 넘어서" },
  zhuangfangyi: { atk: 510, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "억제 · 떠도는 번개" },
  avywenna: { atk: 500, buff: "main", buffVal: 132, sub: "atk", subVal: 39, uniq: "억제 · 천체 물리학" },
  perlica: { atk: 495, buff: "int", buffVal: 156, sub: "arts", subVal: 43.3, uniq: "어둠 · 치욕" },
  arclight: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  antal: { atk: 490, buff: "main", buffVal: 132, sub: "arts", subVal: 78, subFlat: true, uniq: "방출 · 우승자의 위세" },
  gilberta: { atk: 500, buff: "wil", buffVal: 156, sub: "energy", subVal: 46.4, uniq: "추격 · 굴하지 않는 사명" },
  ardelia: { atk: 495, buff: "int", buffVal: 156, sub: "heal", subVal: 46.4, uniq: "고통 · 밀물과 썰물의 속삭임" },
  fluorite: { atk: 411, buff: "agi", buffVal: 124, sub: "energy", subVal: 37.1, uniq: "방출 · 신속한 일격" },
  pogranichnik: { atk: 490, buff: "wil", buffVal: 156, sub: "atk", subVal: 39, uniq: "흐름 · 고열 방출" },
  lifeng: { atk: 500, buff: "agi", buffVal: 156, sub: "phys", subVal: 43.3, uniq: "효율 · 하나 되는 자연" },
  endministrator: { atk: 500, buff: "agi", buffVal: 156, sub: "atk", subVal: 39, uniq: "고통 · 간절한 소망" },
  rossi: { atk: 505, buff: "agi", buffVal: 156, sub: "crit", subVal: 19.5, uniq: "골절 · 군랑의 포식" },
  chenqianyu: { atk: 495, buff: "main", buffVal: 132, sub: "crit", subVal: 19.5, uniq: "어둠 · 청운" },
  dapan: { atk: 500, buff: "main", buffVal: 132, sub: "atk", subVal: 39, uniq: "억제 · 다층 절단" },
  catcher: { atk: 495, buff: "wil", buffVal: 156, sub: "hp", subVal: 78, uniq: "효율 · 절개 의료법" },
  mifu: { atk: 510, buff: "str", buffVal: 156, sub: "atk", subVal: 39, uniq: "기예 · 붉은색의 단절" },
};

// ===== 무기 시리즈 스킬 (턴제 전용 재설계 — 표시=실제) =====
// 상시 패시브 1 + 조건부 턴 트리거 1. 값은 DD 최종 적용값(은닉 스케일 없음) → 조회창 문구가 실제 발동과 정확히 일치.
// passive.kind: atk(공격%)/crit(치확)/critDmg(치피)/all(전 피해)/arts(아츠)/elem(오퍼속성)/battle(배틀)/heal(치유효율)/energy(시작 궁게이지)/vsBroken(불균형적 피해)/stagger(불균형누적).
// trig.on: ult/battle/link(스킬 종류) · anomaly(아츠이상 소모) · crush(강타) · physBreak(방불 부여). trig.k: atk/all/arts/elem. dur=지속 턴, max=누적 상한(스택).
export type WPassive = { kind: "atk" | "crit" | "critDmg" | "all" | "arts" | "elem" | "battle" | "heal" | "vsBroken" | "stagger" | "energy"; v: number };
export type WTrigEvent = "ult" | "battle" | "link" | "anomaly" | "crush" | "physBreak";
export type WTrig = { on: WTrigEvent; tgt: "self" | "team"; k: "atk" | "all" | "arts" | "elem"; v: number; dur: number; max?: number };
export type WeaponFx = { passive: WPassive; trig?: WTrig };
export const OP_WEAPON_EFFECTS: Record<string, WeaponFx> = {
  // ── 어둠: 궁극기 폭발 ──
  laevatain: { passive: { kind: "elem", v: 0.14 }, trig: { on: "ult", tgt: "self", k: "all", v: 0.30, dur: 3 } },
  perlica: { passive: { kind: "crit", v: 0.14 }, trig: { on: "ult", tgt: "self", k: "arts", v: 0.38, dur: 3 } },
  chenqianyu: { passive: { kind: "vsBroken", v: 0.50 }, trig: { on: "battle", tgt: "self", k: "all", v: 0.15, dur: 2 } },
  // ── 억제: 배틀/궁 명중 누적 ──
  ember: { passive: { kind: "all", v: 0.12 }, trig: { on: "battle", tgt: "self", k: "all", v: 0.14, dur: 3, max: 0.42 } },
  dapan: { passive: { kind: "all", v: 0.12 }, trig: { on: "battle", tgt: "self", k: "all", v: 0.14, dur: 3, max: 0.42 } },
  avywenna: { passive: { kind: "arts", v: 0.14 }, trig: { on: "battle", tgt: "self", k: "arts", v: 0.18, dur: 3 } },
  zhuangfangyi: { passive: { kind: "elem", v: 0.14 }, trig: { on: "battle", tgt: "self", k: "elem", v: 0.25, dur: 3 } },
  // ── 고통: 아츠 이상 소모 / 강타 ──
  wulfgard: { passive: { kind: "arts", v: 0.14 }, trig: { on: "anomaly", tgt: "self", k: "arts", v: 0.25, dur: 3 } },
  estella: { passive: { kind: "elem", v: 0.12 }, trig: { on: "anomaly", tgt: "self", k: "elem", v: 0.25, dur: 3 } },
  ardelia: { passive: { kind: "arts", v: 0.14 }, trig: { on: "link", tgt: "team", k: "arts", v: 0.18, dur: 3 } },
  endministrator: { passive: { kind: "all", v: 0.12 }, trig: { on: "crush", tgt: "self", k: "all", v: 0.30, dur: 3 } },
  // ── 흐름: 스킬 후 팀 공격 ──
  akekuri: { passive: { kind: "atk", v: 0.14 }, trig: { on: "battle", tgt: "team", k: "atk", v: 0.08, dur: 3, max: 0.16 } },
  alesh: { passive: { kind: "atk", v: 0.14 }, trig: { on: "battle", tgt: "team", k: "atk", v: 0.08, dur: 3, max: 0.16 } },
  arclight: { passive: { kind: "atk", v: 0.14 }, trig: { on: "battle", tgt: "team", k: "atk", v: 0.08, dur: 3, max: 0.16 } },
  pogranichnik: { passive: { kind: "atk", v: 0.14 }, trig: { on: "battle", tgt: "team", k: "atk", v: 0.08, dur: 3, max: 0.16 } },
  camu: { passive: { kind: "energy", v: 25 }, trig: { on: "battle", tgt: "team", k: "atk", v: 0.10, dur: 3 } },
  // ── 골절: 배틀 후 원소/공격 누적 ──
  yvonne: { passive: { kind: "elem", v: 0.14 }, trig: { on: "battle", tgt: "self", k: "elem", v: 0.22, dur: 3, max: 0.66 } },
  rossi: { passive: { kind: "atk", v: 0.14 }, trig: { on: "battle", tgt: "self", k: "all", v: 0.12, dur: 3, max: 0.45 } },
  // ── 방출: 부착/스킬 강화 ──
  lastrite: { passive: { kind: "all", v: 0.16 }, trig: { on: "battle", tgt: "self", k: "elem", v: 0.25, dur: 3 } },
  tangtang: { passive: { kind: "elem", v: 0.14 }, trig: { on: "battle", tgt: "self", k: "elem", v: 0.25, dur: 3 } },
  antal: { passive: { kind: "arts", v: 0.14 }, trig: { on: "battle", tgt: "team", k: "arts", v: 0.14, dur: 3 } },
  fluorite: { passive: { kind: "atk", v: 0.12 }, trig: { on: "anomaly", tgt: "self", k: "elem", v: 0.14, dur: 3, max: 0.56 } },
  // ── 효율/의료: 치유·방불 ──
  snowshine: { passive: { kind: "heal", v: 0.20 } },
  catcher: { passive: { kind: "heal", v: 0.20 } },
  lifeng: { passive: { kind: "vsBroken", v: 0.32 }, trig: { on: "physBreak", tgt: "self", k: "all", v: 0.18, dur: 3 } },
  xaihi: { passive: { kind: "heal", v: 0.16 }, trig: { on: "battle", tgt: "team", k: "atk", v: 0.12, dur: 3 } },
  // ── 추격: 연계(띄우기) 후 팀 아츠 ──
  gilberta: { passive: { kind: "elem", v: 0.14 }, trig: { on: "link", tgt: "team", k: "arts", v: 0.18, dur: 3 } },
  // ── 기예: 강타 물리 ──
  mifu: { passive: { kind: "all", v: 0.14 }, trig: { on: "crush", tgt: "self", k: "all", v: 0.25, dur: 3 } },
};
// 오퍼 속성(시리즈 문구·elem 적용용) — roster 순환 import 회피 위해 로컬 보관.
const OP_ELEM: Record<string, "physical" | "heat" | "electric" | "cryo" | "nature"> = {
  laevatain: "heat", rossi: "heat", akekuri: "heat", camu: "heat", ember: "heat", wulfgard: "heat",
  estella: "cryo", alesh: "cryo", snowshine: "cryo", xaihi: "cryo", tangtang: "cryo", lastrite: "cryo", yvonne: "cryo",
  arclight: "electric", antal: "electric", perlica: "electric", avywenna: "electric", zhuangfangyi: "electric",
  ardelia: "nature", gilberta: "nature", fluorite: "nature",
  chenqianyu: "physical", lifeng: "physical", endministrator: "physical", mifu: "physical", pogranichnik: "physical", catcher: "physical", dapan: "physical",
};

const SUB_KO: Record<string, string> = { atk: "공격력", crit: "치명 확률", hp: "최대 생명력", heal: "치유 효율", energy: "궁충 효율", arts: "아츠 피해", elem: "원소 피해", phys: "물리 피해", skill: "스킬 피해", vsbroken: "방불 적 피해", other: "특수" };
export const weaponEffectText = (id: string): string => { const w = OP_WEAPON_STATS[id]; if (!w) return ""; return `${SUB_KO[w.sub] ?? w.sub} +${w.subVal}${w.subFlat ? "" : "%"}`; };

// 무기 시리즈 이름 — 실제 무기 소스(어둠·울부짖는 불길 등). OP_WEAPON_SERIES(weapon-series.ts).
export const weaponSeriesName = (id: string): string => OP_WEAPON_SERIES[id]?.name ?? OP_WEAPON_STATS[id]?.uniq ?? "";
// 무기 시리즈 설명 — OP_WEAPON_EFFECTS에서 생성(표시=실제 발동). 상시 패시브 + 조건부 턴 트리거.
const ELEM_KO2: Record<string, string> = { heat: "열기", electric: "전기", cryo: "냉기", nature: "자연", physical: "물리" };
const pctW = (v: number) => `${+(v * 100).toFixed(1)}%`;
function passiveText(p: WPassive, el: string): string {
  switch (p.kind) {
    case "atk": return `공격력 +${pctW(p.v)}`;
    case "crit": return `치명타 확률 +${pctW(p.v)}`;
    case "critDmg": return `치명타 피해 +${pctW(p.v)}`;
    case "all": return `전 피해 +${pctW(p.v)}`;
    case "arts": return `아츠 피해 +${pctW(p.v)}`;
    case "elem": return `${ELEM_KO2[el]} 피해 +${pctW(p.v)}`;
    case "battle": return `배틀 스킬 피해 +${pctW(p.v)}`;
    case "heal": return `치유 효율 +${pctW(p.v)}`;
    case "vsBroken": return `불균형 상태 적에게 주는 피해 +${pctW(p.v)}`;
    case "stagger": return `불균형 누적 +${pctW(p.v)}`;
    case "energy": return `전투 시작 시 궁극기 게이지 +${p.v}`;
  }
}
const WEV_KO: Record<WTrigEvent, string> = { ult: "궁극기 사용", battle: "배틀 스킬 사용", link: "연계 스킬 사용", anomaly: "아츠 이상 소모", crush: "강타 명중", physBreak: "방어 불능 부여" };
function trigText(t: WTrig, el: string): string {
  const tgt = t.tgt === "team" ? "팀 전체 " : "";
  const k = t.k === "atk" ? "공격력" : t.k === "arts" ? "아츠 피해" : t.k === "elem" ? `${ELEM_KO2[el]} 피해` : "피해";
  const stack = t.max ? ` (최대 ${Math.round(t.max / t.v)}스택)` : "";
  return `${WEV_KO[t.on]} 후 ${tgt}${k} +${pctW(t.v)}, ${t.dur}턴 지속${stack}`;
}
export const weaponSeriesDesc = (id: string): string => {
  const fx = OP_WEAPON_EFFECTS[id];
  if (!fx) return "";
  const el = OP_ELEM[id] ?? "physical";
  return passiveText(fx.passive, el) + (fx.trig ? `. ${trigText(fx.trig, el)}.` : ".");
};
export const weaponSeriesText = weaponSeriesDesc; // (하위호환 별칭)

// 밸런스 스케일(DD 모델은 오퍼 공격 ~110 → 무기 실측 500대를 스케일). 부가/버프는 실값의 일부만 반영해 밸런스 완충.
const W_ATK_SCALE = 0.06;   // 기초공격력 → 오퍼 공격 가산(500×0.06≈30)
const W_BUFF_SCALE = 0.4;   // 능력치 버프 → attrs 가산(156×0.4≈62)
const W_SUB_SCALE = 0.5;    // 부가스탯 % → DD 반영 비율(39%→~20%)

// 무기 적용 — createBattle에서 applyGear 직후 호출. 실측 기초공격력 + 능력치 버프 + 부가스탯.
export function applyWeapon(u: DDUnit): WeaponType | null {
  const t = OP_WEAPON[u.id];
  const w = OP_WEAPON_STATS[u.id];
  if (!t || !w) return t ?? null;
  // 1) 기초공격력(스케일 가산)
  u.attack = Math.round(u.attack + w.atk * W_ATK_SCALE);
  // 2) 능력치 버프 → attrs → 공격력 재계산. 주/부옵은 오퍼별 고정(OP_MAINSUB, 공략 시트 「주,부옵」).
  // (기존엔 상위 2개로 추론 → 울프가드·아케쿠리·에스텔라·아비웨나 4명이 어긋났고, 부옵 버프는 공격력에 반영도 안 됐다)
  if (u.attrs) {
    const b0 = u.attrs;
    const mainKey = (OP_MAINSUB[u.id]?.[0] ?? "str") as "str" | "agi" | "int" | "wil";
    const key = (w.buff === "main" ? mainKey : w.buff) as "str" | "agi" | "int" | "wil";
    const added = Math.round(w.buffVal * W_BUFF_SCALE);
    // 주요 능력치 보너스(엔드필드 공식): 공격력 × (1 + 주요×0.005 + 보조×0.002). 주요 능력치 증가분만큼 공격 상승.
    const next = { ...b0, [key]: b0[key] + added };
    u.attack = Math.round(u.attack * (attrBonusOf(u.id, next) / attrBonusOf(u.id, b0))); // 주옵/부옵 어느 쪽이 올라도 공식대로 반영
    u.attrs = next;
    applyAttrs(u); // 능력치 변동 → 속도·기본공격·스킬·유틸/궁충 배율 재계산(멱등)
  }
  // 3) 부가스탯(실값 × 완충)
  const v = (w.subVal / 100) * W_SUB_SCALE;
  const g = u.gear;
  if (w.sub === "atk") u.attack = Math.round(u.attack * (1 + v));
  else if (w.sub === "crit") u.critRate += v;
  else if (w.sub === "hp") { const h = Math.round(u.maxHp * v); u.maxHp += h; u.hp += h; }
  else if (g && (w.sub === "arts" || w.sub === "elem")) g.elemDmg.all = (g.elemDmg.all ?? 0) + (w.subFlat ? 0.1 : v);
  else if (g && w.sub === "phys") g.kindDmg.all = (g.kindDmg.all ?? 0) + v;
  else if (w.sub === "heal") u.healRecv = +((u.healRecv ?? 1) * (1 + v)).toFixed(2);
  else if (w.sub === "energy") u.ultCharge = Math.min(u.ultCost, u.ultCharge + u.ultCost * v);
  // 4) 시리즈 스킬 — 상시 패시브(최종값, 은닉 스케일 없음). 조건부는 weaponTrigger에서.
  const fx = OP_WEAPON_EFFECTS[u.id];
  if (fx && g) {
    const p = fx.passive;
    switch (p.kind) {
      case "atk": u.attack = Math.round(u.attack * (1 + p.v)); break;
      case "crit": u.critRate += p.v; break;
      case "critDmg": u.critDmg += p.v; break;
      case "all": g.kindDmg.all = (g.kindDmg.all ?? 0) + p.v; break;
      case "battle": g.kindDmg.battle = (g.kindDmg.battle ?? 0) + p.v; break;
      case "arts": g.elemDmg.all = (g.elemDmg.all ?? 0) + p.v; break;
      case "elem": if (u.opElement && u.opElement !== "physical") g.elemDmg[u.opElement] = (g.elemDmg[u.opElement] ?? 0) + p.v; else g.kindDmg.all = (g.kindDmg.all ?? 0) + p.v; break;
      case "vsBroken": g.vsBroken += p.v; break;
      case "stagger": g.staggerMul += p.v; break;
      case "heal": u.healRecv = +((u.healRecv ?? 1) * (1 + p.v)).toFixed(2); break;
      case "energy": u.ultCharge = Math.min(u.ultCost, u.ultCharge + p.v); break;
    }
  }
  return t;
}

// 무기 시리즈 조건부 트리거 — act()의 스킬(battle/link/ult)·이상(anomaly)·강타(crush)·방불(physBreak) 훅에서 호출.
// 발동 시 self/team amp(속성/전 피해) 또는 공격 버프. 지속·상한은 무기별(dur/max) — 표시 문구와 동일.
export function weaponTrigger(self: DDUnit, event: string, allies?: DDUnit[]): void {
  const t = OP_WEAPON_EFFECTS[self.id]?.trig;
  if (!t) return;
  const ev = event.startsWith("anomaly") ? "anomaly" : event;
  if (t.on !== ev) return;
  const cap = t.max ?? t.v;
  const prev = pushSrc({ by: self.name, via: weaponSeriesName(self.id), kind: "weapon" }); // 출처를 무기 시리즈로 기록
  const apply = (u: DDUnit) => {
    if (t.k === "atk") { u.atkBuff = Math.min((u.atkBuff || 0) + t.v, cap); setTimer(u, "atkBuff", t.dur); }
    else { const key = t.k === "elem" ? (u.opElement && u.opElement !== "physical" ? u.opElement : "all") : (t.k as "all" | "arts"); u.amp[key] = Math.min((u.amp[key] || 0) + t.v, cap); setTimer(u, "amp:" + key, t.dur); }
  };
  if (t.tgt === "team" && allies) allies.forEach(apply); else apply(self);
  popSrc(prev);
}

export const weaponOf = (id: string): WeaponType | null => OP_WEAPON[id] ?? null;
// 전무 실제 무기 이미지(public/weapons). 전무 이름 → weaponSummaries 매칭.
const WEAPON_IMG: Record<string, string> = Object.fromEntries(weaponSummaries.map((w) => [w.name, w.image]));
export const weaponImage = (id: string): string => { const j = OP_JEONMU[id]?.[0]; return (j && WEAPON_IMG[j.name]) || ""; };
// 전무 이름(시트 실측). 딜/폿 분리(엠버)는 "딜:모범 / 폿:과거의 일품".
export const weaponName = (id: string): string | null => {
  const j = OP_JEONMU[id];
  if (!j?.length) { const t = OP_WEAPON[id]; return t ? `${WEAPON_KO[t]} · 6★` : null; }
  return j.map((w) => (w.role ? `${w.role}:${w.name}` : w.name)).join(" / ");
};
