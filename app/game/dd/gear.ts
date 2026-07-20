// ===== DD 장비/세트 시스템 (카드게임 game-gears.ts 구조 포팅) =====
// 3슬롯(방어구/장갑/부품) 각각 세트 1개 장착 → 같은 세트 2부위 이상이면 세트 효과 발동.
// 효과는 기존 전투 메커니즘(강타/갑옷파괴=불균형, 부착=아츠, 감전/부식/동결, 치명, 궁충)과 연동.
// namu.wiki 장비 문서 3.1 캐논 효과 반영. 개별 부위 스탯은 gearGrade로 추상화(카드게임과 동일 방침).
import type { DDUnit, Element, GearBonus } from "./combat";
import { ELEMENTS, attrResists } from "./combat";
import gearPiecesData from "./data/gear-pieces.json";
import { gearSummaries } from "@/data/gear-summary-data";

// 장비 능력치를 attrs에 합산한 뒤 파생 스탯(민첩→속도)을 다시 계산해야 한다.
// roster를 직접 import하면 순환(gear→roster→combat→weapons→roster)이라 주입 방식.
let applyAttrsHook: ((u: DDUnit) => void) | null = null;
export const setApplyAttrs = (f: (u: DDUnit) => void) => { applyAttrsHook = f; };
// 주요/보조 능력치는 오퍼별 고정(공략 시트 「주,부옵」). 상위 2개 추론은 4명이 어긋난다 → roster가 주입.
let attrBonusHook: ((id: string, a: any) => number) | null = null;
export const setAttrBonus = (f: (id: string, a: any) => number) => { attrBonusHook = f; };
// 오퍼별 주/부옵 키(roster.OP_MAINSUB) — "주요/보조 능력치 +N%" 부가옵이 어느 능력치에 붙는지 알아야 한다.
let mainSubHook: ((id: string) => [string, string] | undefined) | null = null;
export const setMainSub = (f: (id: string) => [string, string] | undefined) => { mainSubHook = f; };

// 원작 장착칸은 방어구·장갑·부품 I·부품 II 4칸이고 세트 효과는 3피스에서 발동한다.
// 피스 분류(장비 데이터 category)는 3종 그대로 두고 로드아웃만 4슬롯으로 분리 —
// 부품 두 칸에 서로 다른 피스를 낄 수 있다(공략 시트 「부품 I / 부품 II」 열과 1:1).
export type GearSlot = "armor" | "gloves" | "kit";                                // 피스 분류
export type LoadoutSlot = "armor" | "gloves" | "kit1" | "kit2";                    // 장착칸
export type Loadout = Partial<Record<LoadoutSlot, string>>;
export const GEAR_SLOTS: GearSlot[] = ["armor", "gloves", "kit"];
export const LOADOUT_SLOTS: LoadoutSlot[] = ["armor", "gloves", "kit1", "kit2"];
export const pieceSlotOf = (s: LoadoutSlot): GearSlot => (s === "kit1" || s === "kit2" ? "kit" : s);
export const SET_PIECES = 3; // 세트 효과 발동 부위 수(원작 3피스)
const SLOT_KO: Record<GearSlot, string> = { armor: "방어구", gloves: "장갑", kit: "부품" };
const LOADOUT_KO: Record<LoadoutSlot, string> = { armor: "방어구", gloves: "장갑", kit1: "부품 I", kit2: "부품 II" };
export const gearSlotName = (s: GearSlot | LoadoutSlot) => (LOADOUT_KO as Record<string, string>)[s] ?? (SLOT_KO as Record<string, string>)[s];

// 세트 효과 타입(카드게임 SetEffect 포팅 — DD 스킬 kind/아츠에 정합)
export type SetEffect =
  | { type: "dmgVs"; cond: "broken" | "vulnerable" | "arts"; pct: number } // 불균형/취약/아츠부착 적 추가 피해
  | { type: "kindDmg"; kind: "attack" | "battle" | "link" | "ult" | "all"; pct: number } // 스킬 종류별 피해
  | { type: "elementDmg"; element: Element | "all"; pct: number } // 아츠 피해
  | { type: "critRate"; v: number }
  | { type: "critDmg"; v: number }
  | { type: "startShield"; v: number } // 전투 시작 보호막(장착 오퍼, maxHp 비례 %)
  | { type: "startHeal"; v: number }   // 전투 시작 회복(maxHp 비례 %)
  | { type: "startEnergy"; v: number } // 전투 시작 파티 스킬 게이지
  | { type: "breakEnergy" }            // 불균형 돌파 시 궁 충전
  | { type: "stagger"; pct: number }   // 불균형 누적 증가
  | { type: "selfHpDmg"; dmgType: "physical" | "arts"; pct: number } // 자신 HP 50%↑ 시 물리/아츠 피해(전달자·침식 차단)
  | { type: "selfHpReduce"; pct: number } // 자신 HP 50%↓ 시 받는 피해 감소(중장갑 전달자)
  | { type: "healEff"; pct: number }      // 치유 효율 +N%(생체 보조)
  | { type: "healGuard"; pct: number }    // 치유한 대상이 받는 피해 -N%(생체 보조)
  | { type: "anomalyHit"; pct: number }   // 물리 이상 부여 후 공격력 N% 추가 물리(검술사)
  | { type: "onKill"; effect: "heal" | "atk"; pct: number }         // 적 처치 시 회복/공격력(통합형)
  | { type: "atkPct"; pct: number }                                 // 공격력 % 보너스(공식 1.1: 공격력×(1+공격력%))
  | { type: "hp"; v: number }                                       // 생명력 능력치(식양의 숨결 +1000 등 실측)
  | { type: "def"; v: number }                                      // 방어력 능력치(방어형 세트 옵션, mitigate에 작용)
  | { type: "artsStr"; v: number }                                  // 오리지늄 아츠 강도(열작업/펄스 +30) — 물리/아츠 이상 피해 ×(1+강도/100)
  | { type: "linkCd"; pct: number }                                 // 연계 스킬 쿨타임 감소(청파/개척 +15%)
  | { type: "speed"; v: number }                                    // 속도(턴 순서) 부옵 — 빠른 세트가 선공 유리
  | { type: "trigger"; desc: string };                              // 조건부 발동(원작 그대로) — 실제 적용은 combat.ts gearTrigger가 세트명으로 처리

// 밸런스: 2부위 = 강력한 조건부 1개(15~25%) 또는 중간 2개. 카드게임 밸런스 계승.
export const GEAR_SETS: Record<string, SetEffect[]> = {
  // ── 세트 3피스 — 상시 옵션 + 턴제 조건부 발동(combat.ts gearTrigger). 지속·쿨은 전부 턴 단위. ──
  "고검의 잔향": [{ type: "atkPct", pct: 0.08 }, { type: "trigger", desc: "강타·갑옷파괴 시 물리 피해 +6%/스택(최대 +24%, 2턴)" }],
  "식양의 흐름": [{ type: "atkPct", pct: 0.10 }, { type: "trigger", desc: "감전·부식 소모 시 전기·자연 피해 +15%/스택(최대 3스택, 5턴)" }],
  "청파": [{ type: "linkCd", pct: 0.15 }, { type: "trigger", desc: "연계 후 모든 스킬 피해 +20%(최대 2스택, 3턴)" }],
  "식양의 숨결": [{ type: "hp", v: 1000 }, { type: "trigger", desc: "증폭·비호·취약·허약 부여 후 다른 팀원 피해 +16% (3턴)" }], // 지원 세트: 생명력 + 팀 피해 버프(combat.ts gearTrigger 외 처리)
  "조류의 물결": [{ type: "kindDmg", kind: "all", pct: 0.20 }, { type: "trigger", desc: "아츠 2부착 후 아츠 피해 +35%(2턴)" }],
  "응룡 50식": [{ type: "atkPct", pct: 0.15 }, { type: "trigger", desc: "배틀 후 다음 연계 피해 +20%(최대 3스택, 3턴)" }],
  "M. I. 경찰용": [{ type: "critRate", v: 0.05 }, { type: "atkPct", pct: 0.08 }], // 치명 스택 → 상시 공격력으로 환산
  "열 작업용": [{ type: "artsStr", v: 30 }, { type: "trigger", desc: "연소 후 열기 피해 +50%(2턴)" }, { type: "trigger", desc: "부식 후 자연 피해 +50%(2턴)" }],
  "개척": [{ type: "linkCd", pct: 0.15 }, { type: "trigger", desc: "스킬 게이지 회복 후 팀 전체 피해 +16% (3턴)" }], // 팀 피해 버프(combat.ts gearTrigger 외 처리)
  "펄스식": [{ type: "artsStr", v: 30 }, { type: "trigger", desc: "감전 후 전기 피해 +50%(2턴)" }, { type: "trigger", desc: "동결 후 냉기 피해 +50%(2턴)" }],
  "본 크러셔": [{ type: "atkPct", pct: 0.15 }, { type: "trigger", desc: "연계 후 다음 배틀 피해 +30%(2턴)" }],
  "경량 초자연": [{ type: "atkPct", pct: 0.08 }, { type: "trigger", desc: "방어 불능 부여 후 물리 피해 +16%/스택(최대 +48%, 2턴)" }],
  "생체 보조": [{ type: "healEff", pct: 0.20 }, { type: "healGuard", pct: 0.15 }], // 원문: 치유 효율 +20% · 치유 후 대상 받는 피해 -15%
  "검술사": [{ type: "stagger", pct: 0.20 }, { type: "anomalyHit", pct: 2.5 }], // 원문: 불균형 효율 +20% · 물리 이상 부여 후 공격력 250% 추가 물리(쿨 3턴)
  // ── Lv50 이하 세트(재앙 방호·아부레이·침식·전달자·통합형)는 전면 제거 — Lv70 세트만 운용 ──
};

const ELEMENT_KO: Record<Element | "all", string> = { heat: "열기", electric: "전기", cryo: "냉기", nature: "자연", all: "전 속성" };
const KIND_KO: Record<"attack" | "battle" | "link" | "ult" | "all", string> = { attack: "기본", battle: "배틀", link: "연계", ult: "궁극", all: "모든 스킬" };
export function effectText(e: SetEffect): string {
  switch (e.type) {
    case "dmgVs": return `${e.cond === "broken" ? "불균형" : e.cond === "vulnerable" ? "취약" : "아츠부착"} 적 피해 +${Math.round(e.pct * 100)}%`;
    case "kindDmg": return `${KIND_KO[e.kind]} 피해 +${Math.round(e.pct * 100)}%`;
    case "elementDmg": return `${ELEMENT_KO[e.element]} 피해 +${Math.round(e.pct * 100)}%`;
    case "critRate": return `치명타 확률 +${Math.round(e.v * 100)}%`;
    case "critDmg": return `치명타 피해 +${Math.round(e.v * 100)}%`;
    case "startShield": return `전투 시작 보호막 +${Math.round(e.v * 100)}%`;
    case "startHeal": return `전투 시작 회복 +${Math.round(e.v * 100)}%`;
    case "healEff": return `치유 효율 +${Math.round(e.pct * 100)}%`;
    case "healGuard": return `치유한 대상 받는 피해 -${Math.round(e.pct * 100)}%(2턴)`;
    case "anomalyHit": return `물리 이상 부여 후 공격력 ${Math.round(e.pct * 100)}% 추가 물리(쿨 3턴)`;
    case "startEnergy": return `전투 시작 게이지 +${e.v}`;
    case "artsStr": return `오리지늄 아츠 강도 +${e.v}`;
    case "linkCd": return `연계 쿨타임 -1턴`; // 원작 -15%의 턴제 환산(쿨 2턴 이상 -1턴)
    case "speed": return `속도 +${e.v}`;
    case "breakEnergy": return "불균형 돌파 시 궁 충전";
    case "stagger": return `불균형 누적 +${Math.round(e.pct * 100)}%`;
    case "selfHpDmg": return `고체력 시 ${e.dmgType === "physical" ? "물리" : "아츠"} 피해 +${Math.round(e.pct * 100)}%`;
    case "selfHpReduce": return `저체력 시 받는 피해 -${Math.round(e.pct * 100)}%`;
    case "onKill": return `적 처치 시 ${e.effect === "heal" ? `회복 +${Math.round(e.pct * 100)}%` : `공격력 +${Math.round(e.pct * 100)}%`}`;
    case "atkPct": return `공격력 +${Math.round(e.pct * 100)}%`;
    case "hp": return `생명력 +${e.v}`;
    case "def": return `방어력 +${e.v}`;
    case "trigger": return e.desc;
  }
}
// 시트(공략 빌드) 기준 오퍼별 추천 세트 — recSet 기본값·프리셋 로드아웃의 단일 소스.
// 공략 시트(구글) 1순위 빌드 기준 — 오퍼별 추천 세트(2부위 세트명).
export const OP_RECOMMENDED_SET: Record<string, string> = {
  laevatain: "열 작업용", ember: "경량 초자연", wulfgard: "식양의 숨결", akekuri: "개척", camu: "개척",
  yvonne: "M. I. 경찰용", lastrite: "조류의 물결", tangtang: "청파", snowshine: "식양의 숨결", xaihi: "식양의 숨결",
  alesh: "개척", estella: "식양의 숨결", zhuangfangyi: "식양의 흐름", avywenna: "본 크러셔", perlica: "펄스식",
  arclight: "개척", antal: "식양의 숨결", gilberta: "식양의 숨결", ardelia: "식양의 숨결", fluorite: "식양의 숨결",
  pogranichnik: "응룡 50식", lifeng: "식양의 숨결", endministrator: "고검의 잔향", rossi: "M. I. 경찰용",
  chenqianyu: "응룡 50식", dapan: "검술사", catcher: "식양의 숨결", mifu: "고검의 잔향",
  arcane: "열 작업용",
};
// 오퍼 추천 세트(시트 우선, 없으면 직군·속성 폴백)
export function recommendedSet(id: string, cls: string, element: string): string {
  if (OP_RECOMMENDED_SET[id]) return OP_RECOMMENDED_SET[id];
  if (cls === "supporter") return "식양의 숨결";
  if (cls === "defender") return "생체 보조";
  if (element === "heat") return "열 작업용";
  if (element === "electric" || element === "cryo") return "펄스식";
  if (element === "nature") return "식양의 흐름";
  return "검술사";
}

export const getSetEffects = (setName: string): SetEffect[] => GEAR_SETS[setName] ?? [];
export const hasSetEffect = (setName: string) => Boolean(GEAR_SETS[setName]);
export const setEffectText = (setName: string) => hasSetEffect(setName) ? `${SET_PIECES}부위: ${GEAR_SETS[setName].map(effectText).join(" · ")}` : "세트 효과 없음";
export const SET_NAMES = Object.keys(GEAR_SETS);

// 피스명 → 실제 장비 이미지(gear-summary-data). 변형 마커(· I/II) 제거 후 매칭.
const GEAR_IMG_BY_NAME: Record<string, string> = {};
for (const g of gearSummaries) GEAR_IMG_BY_NAME[g.name] = g.image;
export const pieceImage = (name: string): string => GEAR_IMG_BY_NAME[name] ?? GEAR_IMG_BY_NAME[name.replace(/\s*·\s*(I{1,3}|IV|V)$/, "").trim()] ?? "";

// 로드아웃 → 슬롯별 착용 피스(방어구/장갑/부품). ref가 피스 id면 그 피스, 세트명이면 세트 대표 피스.
export function loadoutPieces(loadout: Loadout | undefined): { slot: LoadoutSlot; slotName: string; name: string; set: string; image: string; grade: number; def: number; dmg?: { kind: string; base: number }; slots: number }[] {
  return LOADOUT_SLOTS.map((slot) => {
    const ref = loadout?.[slot];
    const p = ref ? (GEAR_PIECE_BY_ID[ref] ?? GEAR_SET_CANON[ref]?.[pieceSlotOf(slot)]) : undefined;
    const m = 1; // 부품이 실제 2칸이 되었으므로 배수 없음
    return { slot, slotName: gearSlotName(slot), name: p?.name ?? "없음", set: p?.set ?? "", image: p ? pieceImage(p.name) : "", grade: (p?.grade.base ?? 0) * m, def: (p?.def ?? 0) * m, dmg: p?.dmg ? { kind: p.dmg.kind, base: +(p.dmg.base * m).toFixed(4) } : undefined, slots: m };
  });
}

// 같은 세트 3피스 이상 장착 시 발동(원작 3개 세트 효과)
export function activeSets(loadout: Loadout): string[] {
  const counts: Record<string, number> = {};
  for (const slot of LOADOUT_SLOTS) { const s = loadout[slot]; if (s) { const set = refSet(s); counts[set] = (counts[set] ?? 0) + 1; } } // 피스 id는 소속 세트로 집계
  return Object.entries(counts).filter(([name, n]) => n >= SET_PIECES && hasSetEffect(name)).map(([name]) => name);
}

function emptyBonus(): GearBonus {
  return { kindDmg: {}, elemDmg: {}, vsBroken: 0, vsDefBreak: 0, healGuard: 0, anomalyHit: 0, dmgReduce: 0, vsVuln: 0, vsArts: 0, staggerMul: 0, breakEnergy: false, selfHpHighPhys: 0, selfHpHighArts: 0, selfHpLowReduce: 0, onKillHeal: 0, onKillAtk: 0 };
}

// 로드아웃 → 활성 세트 효과를 유닛에 적용(전투 배율은 unit.gear에, 즉시 효과는 스탯에 반영). 시작 게이지 총량 반환.
// 부위별 개별 방어력 — warfarin gear.data 실측(베이스 스탯=방어 attrType 3, T-max 강화). 부위마다 다름·세트 발동 무관.
export const GEAR_DEFENSE: Record<GearSlot, number> = { armor: 56, gloves: 42, kit: 21 };
export const GEAR_DEFENSE_PER_SLOT = GEAR_DEFENSE.armor; // (하위호환) 참조용

// ── 세트별 실측 부옵 (warfarin gear.data, 세트 대표 피스). 각 피스: 방어(주옵) + 능력치(→gearGrade) + 피해 부옵. ──
// grade = 능력치(힘/민첩/지능/의지) 합(실측), dmg = 피해 부옵(실측%). 단조로 스케일. dmg.kind: ult/battle/link/attack/all(물리)/elem(오퍼속성)/atkPct/hpPct/critRate/critDmg/energy.
type DmgSub = { kind: "ult" | "battle" | "link" | "attack" | "all" | "elem" | "atkPct" | "hpPct" | "critRate" | "critDmg" | "energy" | "artsStr" | "vsBroken" | "ultEff" | "mainPct" | "subPct" | "heal" | "dmgReduce" | "strPct" | "agiPct" | "intPct" | "wilPct"; v: number };
export const GEAR_SET_STATS: Record<string, Partial<Record<GearSlot, { grade: number; dmg?: DmgSub }>>> = {
  "개척": { armor: { grade: 145, dmg: { kind: "ult", v: 0.259 } }, gloves: { grade: 108, dmg: { kind: "atkPct", v: 0.23 } }, kit: { grade: 53, dmg: { kind: "elem", v: 0.414 } } },
  "열 작업용": { armor: { grade: 145, dmg: { kind: "atkPct", v: 0.115 } }, gloves: { grade: 108, dmg: { kind: "hpPct", v: 0.172 } }, kit: { grade: 53, dmg: { kind: "hpPct", v: 0.207 } } },
  "M. I. 경찰용": { armor: { grade: 145, dmg: { kind: "hpPct", v: 0.103 } }, gloves: { grade: 108, dmg: { kind: "all", v: 0.345 } }, kit: { grade: 53, dmg: { kind: "atkPct", v: 0.23 } } },
  "본 크러셔": { armor: { grade: 145, dmg: { kind: "critRate", v: 0.123 } }, gloves: { grade: 108, dmg: { kind: "atkPct", v: 0.192 } }, kit: { grade: 53, dmg: { kind: "all", v: 0.414 } } },
  "식양의 흐름": { armor: { grade: 145, dmg: { kind: "atkPct", v: 0.115 } }, gloves: { grade: 108, dmg: { kind: "atkPct", v: 0.192 } }, kit: { grade: 53, dmg: { kind: "all", v: 0.414 } } },
  "고검의 잔향": { armor: { grade: 145, dmg: { kind: "critDmg", v: 0.115 } }, gloves: { grade: 108, dmg: { kind: "hpPct", v: 0.172 } }, kit: { grade: 53, dmg: { kind: "critDmg", v: 0.23 } } },
  "검술사": { armor: { grade: 145, dmg: { kind: "critRate", v: 0.123 } }, gloves: { grade: 108, dmg: { kind: "critDmg", v: 0.192 } }, kit: { grade: 53, dmg: { kind: "critDmg", v: 0.23 } } },
  "생체 보조": { armor: { grade: 145, dmg: { kind: "battle", v: 0.103 } }, gloves: { grade: 108, dmg: { kind: "critRate", v: 0.205 } }, kit: { grade: 53, dmg: { kind: "atkPct", v: 0.23 } } },
  "식양의 숨결": { armor: { grade: 145, dmg: { kind: "hpPct", v: 0.103 } }, gloves: { grade: 108, dmg: { kind: "critRate", v: 0.205 } }, kit: { grade: 53, dmg: { kind: "critRate", v: 0.246 } } },
  "조류의 물결": { armor: { grade: 145, dmg: { kind: "critRate", v: 0.123 } }, gloves: { grade: 108, dmg: { kind: "atkPct", v: 0.192 } }, kit: { grade: 53, dmg: { kind: "atkPct", v: 0.23 } } },
  "청파": { armor: { grade: 145, dmg: { kind: "critRate", v: 0.123 } }, gloves: { grade: 108, dmg: { kind: "critRate", v: 0.205 } }, kit: { grade: 53, dmg: { kind: "all", v: 0.414 } } },
  "응룡 50식": { armor: { grade: 145, dmg: { kind: "critDmg", v: 0.115 } }, gloves: { grade: 108, dmg: { kind: "elem", v: 0.345 } }, kit: { grade: 53, dmg: { kind: "critDmg", v: 0.23 } } },
  "펄스식": { armor: { grade: 145, dmg: { kind: "hpPct", v: 0.103 } }, gloves: { grade: 108, dmg: { kind: "atkPct", v: 0.192 } }, kit: { grade: 53, dmg: { kind: "hpPct", v: 0.207 } } },
  "재앙 방호": { armor: { grade: 102, dmg: { kind: "ult", v: 0.184 } }, gloves: { grade: 76, dmg: { kind: "hpPct", v: 0.122 } }, kit: { grade: 38, dmg: { kind: "hpPct", v: 0.147 } } },
};
// 장비 능력치 → 오퍼 attrs 환산 계수. 우리 OP_ATTACK은 원작 실수치가 아니라 ×0.1507 축소된 값이라
// 장비 능력치 → 공격력 반영 비율. 원본 그대로면 공격력 ×1.8 폭주라 축소하되, 0.2로는 단조가 딜에 +2%뿐
// (무의미)이라 0.3으로 올려 단조를 살렸다(딜 +3.4%). 그만큼의 폭주는 적 HP 상향(ENEMY_HP_COMP)으로 상쇄.
// 부옵(속성 피해·치명 등)은 건드리지 않고 능력치만 축소.
export const GEAR_ATTR_FACTOR = 0.3;
const GRADE_FACTOR = 0.13; // 실측 능력치 합 → gearGrade 환산(3부위 ≈ +40 → 저항 ~50%)
// 원작은 부품(kit) 2슬롯(방어구·장갑·부품×2 = 4슬롯, 세트 3부위 발동). 본 게임은 3슬롯 모델이라
// 부품 1개가 원작 2개 몫을 하도록 능력치/방어를 2배 환산(부옵은 단일 — 원작 2번째 부품은 통상 다른 부옵).

// ── 전 220 피스 레지스트리 (data/gear-pieces.json). loadout이 피스 id를 참조하면 그 피스 실측 스탯, 세트명이면 대표 피스(GEAR_SET_STATS). ──
export type GearPiece = { id: string; name: string; set: string; slot: GearSlot; rarity: number; def: number; grade: { base: number; enh: number[] }; attrs?: { str?: number; agi?: number; int?: number; wil?: number }; dmg?: { kind: DmgSub["kind"]; base: number; enh: number[] } };
// Lv50 이하(rarity<5) 장비 전면 제거 — Lv70(rarity 5) 세트 장비만 사용.
export const GEAR_PIECES = (gearPiecesData as GearPiece[]).filter((p) => p.rarity >= 5);
export const GEAR_PIECE_BY_ID: Record<string, GearPiece> = Object.fromEntries(GEAR_PIECES.map((p) => [p.id, p]));
export const GEAR_PIECES_BY_SET_SLOT: Record<string, Partial<Record<GearSlot, GearPiece[]>>> = {};
for (const p of GEAR_PIECES) ((GEAR_PIECES_BY_SET_SLOT[p.set] ??= {})[p.slot] ??= []).push(p);
// 세트 대표 피스(변형 마커 ·• 없는 base). 세트명 로드아웃이 실제 이 피스의 실측값을 사용.
export const GEAR_SET_CANON: Record<string, Partial<Record<GearSlot, GearPiece>>> = {};
for (const p of GEAR_PIECES) { if (/[·•]/.test(p.name)) continue; const s = (GEAR_SET_CANON[p.set] ??= {}); if (!s[p.slot]) s[p.slot] = p; }

// 오퍼별 장착 피스 — 공략 시트(구글) 1순위 빌드 3슬롯 전부 지정(방어구/장갑/부품).
export const OP_GEAR: Record<string, Loadout> = {
  laevatain: { armor: "item_equip_t4_suit_fire_natr01_body_02", gloves: "item_equip_t4_suit_fire_natr01_hand_02", kit1: "item_equip_t4_suit_fire_natr01_edc_02", kit2: "item_equip_t4_suit_heal01_edc_03" },
  ember: { armor: "item_equip_t4_suit_poise01_body_01", gloves: "item_equip_t4_suit_phy01_hand_01", kit1: "item_equip_t4_suit_poise01_edc_01", kit2: "item_equip_t4_suit_poise01_edc_01" },
  wulfgard: { armor: "item_equip_t4_suit_heal01_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit1: "item_equip_t4_suit_usp02_edc_03", kit2: "item_equip_t4_suit_usp02_edc_03" },
  akekuri: { armor: "item_equip_t4_parts_wuling01_body_02", gloves: "item_equip_t4_rifttrekkergloves", kit1: "item_equip_t4_parts_wuling01_edc_03", kit2: "item_equip_t4_parts_wuling01_edc_03" },
  camu: { armor: "item_equip_t4_suit_atb01_body_05", gloves: "item_equip_t4_suit_atb01_hand_02", kit1: "item_equip_t4_suit_atb01_edc_04", kit2: "item_equip_t4_parts_wuling01_edc_03" },
  yvonne: { armor: "item_equip_t4_suit_criti01_body_02", gloves: "item_equip_t4_suit_criti01_hand_02", kit1: "item_equip_t4_suit_criti01_edc_03", kit2: "item_equip_t4_suit_criti01_edc_03" },
  lastrite: { armor: "item_equip_t4_suit_phy01_body_01", gloves: "item_equip_t4_suit_burst01_hand_01", kit1: "item_equip_t4_suit_burst01_edc_01", kit2: "item_equip_t4_suit_burst01_edc_01" },
  tangtang: { armor: "item_equip_t4_suit_combo_cd01_body_01", gloves: "item_equip_t4_suit_criti01_hand_01", kit1: "item_equip_t4_suit_combo_cd01_edc_01", kit2: "item_equip_t4_suit_combo_cd01_edc_01" },
  snowshine: { armor: "item_equip_t4_suit_heal01_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit1: "item_equip_t4_suit_usp02_edc_01", kit2: "item_equip_t4_suit_usp02_edc_01" },
  xaihi: { armor: "item_equip_t4_eternalxiranitelightarmort1", gloves: "item_equip_t4_suit_usp02_hand_02", kit1: "item_equip_t4_eternalxiranitereinforcedplate", kit2: "item_equip_t4_suit_atb01_edc_04" },
  alesh: { armor: "item_equip_t4_suit_atb01_body_05", gloves: "item_equip_t4_rifttrekkergloves", kit1: "item_equip_t4_suit_atb01_edc_04", kit2: "item_equip_t4_suit_atb01_edc_04" },
  estella: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_usp02_hand_02", kit1: "item_equip_t4_suit_usp02_edc_03", kit2: "item_equip_t4_suit_usp02_edc_03" },
  zhuangfangyi: { armor: "item_equip_t4_suit_expend_spell01_body_02", gloves: "item_equip_t4_suit_expend_spell01_hand_02", kit1: "item_equip_t4_suit_expend_spell01_edc_02", kit2: "item_equip_t4_suit_usp02_edc_03" },
  avywenna: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_attri01_hand_03", kit1: "item_equip_t4_suit_attri01_edc_03", kit2: "item_equip_t4_suit_heal01_edc_03" },
  perlica: { armor: "item_equip_t4_suit_pulse_cryst01_body_01", gloves: "item_equip_t4_suit_pulse_cryst01_hand_01", kit1: "item_equip_t4_suit_pulse_cryst01_edc_02", kit2: "item_equip_t4_suit_heal01_edc_03" },
  arclight: { armor: "item_equip_t4_suit_atb01_body_05", gloves: "item_equip_t4_suit_atb01_hand_03", kit1: "item_equip_t4_parts_wuling01_edc_03", kit2: "item_equip_t4_suit_atb01_edc_06" },
  antal: { armor: "item_equip_t4_suit_burst01_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit1: "item_equip_t4_suit_usp02_edc_01", kit2: "item_equip_t4_suit_usp02_edc_01" },
  gilberta: { armor: "item_equip_t4_suit_usp02_body_01", gloves: "item_equip_t4_rifttrekkergloves", kit1: "item_equip_t4_suit_usp02_edc_03", kit2: "item_equip_t4_suit_usp02_edc_03" },
  ardelia: { armor: "item_equip_t4_suit_usp02_body_01", gloves: "item_equip_t4_rifttrekkergloves", kit1: "item_equip_t4_suit_usp02_edc_03", kit2: "item_equip_t4_suit_usp02_edc_03" },
  fluorite: { armor: "item_equip_t4_suit_attri01_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit1: "item_equip_t4_suit_usp02_edc_01", kit2: "item_equip_t4_suit_usp02_edc_01" },
  // 결은 빌드가 두 벌이다(위키 4.2). 우리 게임은 전무 42식·척결(지능 +156) 고정이라 패널상 항상
  // 진결·지혜(딜)이므로 **딜러 빌드(열 작업용)**를 목표 장비로 쓴다.
  //   열 작업용 3피스 세트효과 "적에게 부식을 부여한 후 자연 피해 +50%" ↔ 결 지혜 궁의 강제 부식과 정확히 맞물린다.
  //   (서포터 빌드 식양의 숨결은 진결·의지 전용 — 폼을 의지로 돌릴 때 장비 변경에서 고르면 된다)
  arcane: { armor: "item_equip_t4_suit_fire_natr01_body_02", gloves: "item_equip_t4_hotworkprotectivegloves", kit1: "item_equip_t4_hotworkinsulationplate", kit2: "item_equip_t4_suit_heal01_edc_03" },
  pogranichnik: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_atk02_hand_02", kit1: "item_equip_t4_suit_atk02_edc_04", kit2: "item_equip_t4_suit_atk02_edc_04" },
  lifeng: { armor: "item_equip_t4_suit_atk02_body_02", gloves: "item_equip_t4_suit_usp02_hand_01", kit1: "item_equip_t4_suit_usp02_edc_01", kit2: "item_equip_t4_suit_usp02_edc_01" },
  endministrator: { armor: "item_equip_t4_suit_crush_fracture_body_02", gloves: "item_equip_t4_suit_crush_fracture_hand_02", kit1: "item_equip_t4_suit_crush_fracture_edc_02", kit2: "item_equip_t4_suit_phy01_edc_03" },
  rossi: { armor: "item_equip_t4_suit_criti01_body_06", gloves: "item_equip_t4_parts_wuling01_hand_01", kit1: "item_equip_t4_suit_criti01_edc_06", kit2: "item_equip_t4_suit_criti01_edc_06" },
  chenqianyu: { armor: "item_equip_t4_suit_atk02_body_02", gloves: "item_equip_t4_parts_wuling01_hand_01", kit1: "item_equip_t4_suit_atk02_edc_02", kit2: "item_equip_t4_suit_atk02_edc_02" },
  dapan: { armor: "item_equip_t4_suit_phy01_body_01", gloves: "item_equip_t4_suit_fire_natr01_hand_01", kit1: "item_equip_t4_suit_phy01_edc_01", kit2: "item_equip_t4_suit_phy01_edc_01" },
  catcher: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_usp02_hand_02", kit1: "item_equip_t4_suit_usp02_edc_01", kit2: "item_equip_t4_suit_usp02_edc_01" },
  mifu: { armor: "item_equip_t4_suit_crush_fracture_body_01", gloves: "item_equip_t4_suit_crush_fracture_hand_01", kit1: "item_equip_t4_suit_crush_fracture_edc_01", kit2: "item_equip_t4_suit_phy01_edc_01" },
};
// 자유 슬롯(세트 2부위 초과분)에 낄 개별 효율 최고 피스.
// 세트 발동은 2부위면 충분 → 남는 1슬롯은 세트 무관 최고 딜 피스가 정배.
// element 오퍼는 오퍼 속성 피해(elem), 물리 오퍼는 물리 피해(all)를 극대화, 없으면 공격%(atkPct) 폴백.
export function bestFreePiece(slot: GearSlot, element: string): GearPiece | null {
  const want = element === "physical" ? "all" : "elem";
  // 무소속("?") 피스 제외 — 위기 탈출(Redeemer) 계열은 substat 데이터가 시트와 어긋나(elem 오표기 등) 오픽 유발.
  const cands = GEAR_PIECES.filter((p) => p.slot === slot && p.dmg && p.set !== "?");
  const pickMax = (kind: DmgSub["kind"]): GearPiece | null => {
    let best: GearPiece | null = null;
    for (const p of cands) {
      if (p.dmg!.kind !== kind) continue;
      if (!best || p.dmg!.base > best.dmg!.base || (p.dmg!.base === best.dmg!.base && p.grade.base > best.grade.base)) best = p;
    }
    return best;
  };
  return pickMax(want) ?? pickMax("atkPct"); // 속성/물리 딜 피스 → 없으면 공격%
}

// 슬롯 교체 후보(피커용) — 오퍼 속성 딜(elem/all) 우선, 이름 중복 제거, 상위 N개. 무소속 제외.
export function slotOptions(slot: GearSlot, element?: string, n = 16): GearPiece[] {
  const want = element === "physical" ? "all" : "elem";
  const seen = new Set<string>(); const out: GearPiece[] = [];
  const sorted = [...GEAR_PIECES].filter((p) => p.slot === slot && p.dmg && p.set !== "?").sort((a, b) => (a.dmg!.kind === want ? 0 : 1) - (b.dmg!.kind === want ? 0 : 1) || b.dmg!.base - a.dmg!.base);
  for (const p of sorted) { const base = p.name.replace(/\s*·\s*[IVX]+$/, "").trim(); if (seen.has(base)) continue; seen.add(base); out.push(p); }
  return out.slice(0, n);
}

// 오퍼 실제 로드아웃: OP_GEAR 피스 + 누락 슬롯은 세트 대표 피스 id로 폴백(세트명 아님 → 모든 슬롯이 개별 단조·제작 가능).
// element를 주면 「4칸 전부 같은 세트」일 때 부품 II를 개별 효율 최고 피스로 교체 — 나머지 3피스로 세트는 그대로 발동.
export function recommendedLoadout(opId: string, setName: string, element?: string): Loadout {
  const og = OP_GEAR[opId] ?? {};
  const fallback = (slot: LoadoutSlot): string => GEAR_SET_CANON[setName]?.[pieceSlotOf(slot)]?.id ?? setName;
  const lo: Loadout = {
    armor: og.armor ?? fallback("armor"), gloves: og.gloves ?? fallback("gloves"),
    kit1: og.kit1 ?? fallback("kit1"), kit2: og.kit2 ?? og.kit1 ?? fallback("kit2"),
  };
  // 세트 최적화: 시트가 부품 II를 지정하지 않은 오퍼만 자유 슬롯화(시트 지정 빌드는 그대로 존중).
  if (element && !og.kit2) {
    const sets = LOADOUT_SLOTS.map((s) => refSet(lo[s]!));
    if (sets.every((x) => x === sets[0])) { // 4칸 동일 세트 → 1칸 빼도 3피스라 세트 유지
      const bp = bestFreePiece("kit", element);
      const cur = GEAR_PIECE_BY_ID[lo.kit2!] ?? GEAR_SET_CANON[lo.kit2!]?.kit;
      if (bp && refSet(bp.id) !== sets[0] && (bp.dmg?.base ?? 0) > (cur?.dmg?.base ?? 0)) lo.kit2 = bp.id;
    }
  }
  return lo;
}

const refSet = (ref: string): string => GEAR_PIECE_BY_ID[ref]?.set ?? ref; // loadout 항목(세트명|피스id) → 소속 세트
function resolveGear(ref: string, slot: GearSlot, lv: number): { def: number; grade: number; attrs?: Record<string, number>; dmg?: DmgSub } | null {
  const p = GEAR_PIECE_BY_ID[ref] ?? GEAR_SET_CANON[ref]?.[slot]; // 피스 id 또는 세트명 → 실제 피스(gear-pieces.json 실측값)
  if (!p) return null;
  const grade = lv === 0 ? p.grade.base : p.grade.enh[lv - 1];
  // 능력치 속성별 내역(힘/민첩/지능/의지). 단조 시 grade가 오르므로 같은 비율로 스케일(합 = grade 유지).
  let attrs: Record<string, number> | undefined;
  if (p.attrs) { const k = grade / (p.grade.base || 1); attrs = Object.fromEntries(Object.entries(p.attrs).map(([a, v]) => [a, (v as number) * k])); }
  return { def: p.def, grade, attrs, dmg: p.dmg ? { kind: p.dmg.kind as DmgSub["kind"], v: lv === 0 ? p.dmg.base : p.dmg.enh[lv - 1] } : undefined };
}

export function applyGear(u: DDUnit, loadout: Loadout | undefined, gearLevel = 0, levels?: Partial<Record<LoadoutSlot, number>>): number {
  if (!loadout) return 0;
  const g = emptyBonus();
  let atkPct = 0, startEnergy = 0, gradeAdd = 0, mainPct = 0, subPct = 0;
  const attrPct: Record<string, number> = { str: 0, agi: 0, int: 0, wil: 0 }; // 특정 능력치 +N% 부가옵
  const gAttr: Record<string, number> = { str: 0, agi: 0, int: 0, wil: 0 }; // 장비가 주는 능력치 합
  for (const slot of LOADOUT_SLOTS) if (loadout[slot]) {
    const lv = Math.max(0, Math.min(3, levels?.[slot] ?? gearLevel)); // 부위별 단조(제작) 우선, 없으면 통합 gearLevel
    const r = resolveGear(loadout[slot]!, pieceSlotOf(slot), lv); // 피스 id 또는 세트명 → 실측 스탯(단조 반영)
    const m = 1; // 부품 2칸이 각각 계산되므로 배수 없음
    if (!r) { u.defense += GEAR_DEFENSE[pieceSlotOf(slot)] * m; continue; }
    u.defense += r.def * m; // 주옵: 방어(피스별 실측)
    gradeAdd += r.grade * GRADE_FACTOR * m; // 실측 능력치 → gearGrade(저항)
    if (r.attrs) for (const [a, v] of Object.entries(r.attrs)) gAttr[a] += v * m; // 속성별 내역(힘/민첩/지능/의지)
    if (r.dmg) { const v = r.dmg.v * m, k = r.dmg.kind; // 실측 피해 부옵
      if (k === "atkPct") atkPct += v;
      else if (k === "hpPct") { const h = Math.round(u.maxHp * v); u.maxHp += h; u.hp += h; }
      else if (k === "critRate") u.critRate += v;
      else if (k === "critDmg") u.critDmg += v;
      else if (k === "energy") startEnergy += v;
      else if (k === "all") g.kindDmg.all = (g.kindDmg.all ?? 0) + v;
      else if (k === "elem") { if (u.opElement && u.opElement !== "physical") g.elemDmg[u.opElement] = (g.elemDmg[u.opElement] ?? 0) + v; else g.kindDmg.all = (g.kindDmg.all ?? 0) + v; }
      else if (k === "artsStr") u.artsStr = (u.artsStr ?? 0) + v;   // 오리지늄 아츠 강도(피스 실측, 정수값)
      else if (k === "vsBroken") g.vsBroken += v;                    // 불균형 목표 피해 보너스
      else if (k === "mainPct") mainPct += v;                         // 주요 능력치 +N%
      else if (k === "subPct") subPct += v;                           // 보조 능력치 +N%
      else if (k === "heal") u.healRecv = +(((u.healRecv ?? 1) * (1 + v)).toFixed(3)); // 치유 효율 +N%
      else if (k === "dmgReduce") g.dmgReduce = 1 - (1 - (g.dmgReduce ?? 0)) * (1 - v); // 모든 피해 감소 %(곱연산)
      else if (k === "strPct") attrPct.str += v;
      else if (k === "agiPct") attrPct.agi += v;
      else if (k === "intPct") attrPct.int += v;
      else if (k === "wilPct") attrPct.wil += v;
      else if (k === "ultEff") u.ultEffMul = (u.ultEffMul ?? 1) + v; // 궁극기 충전 효율(배틀/연계 궁충에 배율)
      else g.kindDmg[k] = (g.kindDmg[k] ?? 0) + v; // ult/battle/link/attack
    }
  }
  if (gradeAdd > 0) { u.gearGrade += Math.round(gradeAdd); u.resist = attrResists(u.gearGrade); } // 장비 능력치 → 저항 재계산(오퍼 능력치는 관여 안 함)
  // ── 장비 능력치 → 오퍼 주요/보조 능력치에 합산 → 공격력 재계산 ──
  // 원작 공식(1.1 능력치 보너스): 공격력 = 기초 × (1 + 주요×0.005 + 보조×0.002).
  // OP_ATTACK엔 오퍼 고유 능력치가 이미 반영돼 있으므로, 장비분을 더한 뒤 보너스 비율만큼 스케일한다
  // (weapons.ts의 무기 능력치 버프와 같은 방식). 힘 장비를 끼면 힘이 오르고, 그게 주옵이면 공격력이 오른다.
  if (u.attrs && (Object.values(gAttr).some((v) => v > 0) || mainPct > 0 || subPct > 0 || Object.values(attrPct).some((v) => v > 0))) {
    const b0 = u.attrs;
    const bonus = (a: typeof b0) => attrBonusHook ? attrBonusHook(u.id, a) : 1; // 주/부옵 고정표(roster.attrBonusOf)
    const k = GEAR_ATTR_FACTOR;
    const next = { str: b0.str + gAttr.str * k, agi: b0.agi + gAttr.agi * k, int: b0.int + gAttr.int * k, wil: b0.wil + gAttr.wil * k };
    // 패널 표기값은 축소 없이 원본 합산(진결 폼 판정용)
    const pb = u.panelAttrs ?? b0;
    u.panelAttrs = { str: pb.str + gAttr.str, agi: pb.agi + gAttr.agi, int: pb.int + gAttr.int, wil: pb.wil + gAttr.wil };
    // "주요/보조 능력치 +N%"는 그 오퍼의 주/부옵 능력치를 배수로 올린다(합산 아님).
    if (mainPct > 0 || subPct > 0) {
      const ms = mainSubHook?.(u.id);
      if (ms) {
        const [mk, sk] = ms as ["str" | "agi" | "int" | "wil", "str" | "agi" | "int" | "wil"];
        next[mk] *= 1 + mainPct * GEAR_ATTR_FACTOR; next[sk] *= 1 + subPct * GEAR_ATTR_FACTOR; // 피해 계산치는 축소 스케일
        u.panelAttrs[mk] *= 1 + mainPct; u.panelAttrs[sk] *= 1 + subPct;                       // 패널 표기값은 원본
      }
    }
    for (const [ak, av] of Object.entries(attrPct)) if (av > 0) { // 특정 능력치 +N%
      const kk = ak as "str" | "agi" | "int" | "wil";
      next[kk] *= 1 + av * GEAR_ATTR_FACTOR; u.panelAttrs[kk] *= 1 + av;
    }
    u.attack = Math.round(u.attack * (bonus(next) / bonus(b0)));
    u.attrs = next;
    applyAttrsHook?.(u); // 민첩 → 속도 재계산(roster가 주입)
  }
  const sets = activeSets(loadout);
  if (sets.length) u.gearSets = sets; // 조건부 발동 세트(연소 후 열기+ 등) — combat.ts가 트리거 시 참조
  let shieldPct = 0, healPct = 0;
  for (const name of sets) for (const e of getSetEffects(name)) {
    switch (e.type) {
      case "atkPct": atkPct += e.pct; break;
      case "hp": u.maxHp += e.v; u.hp += e.v; break; // 생명력 능력치(식양의 숨결 +1000)
      case "def": u.defense += e.v; break;
      case "dmgVs": if (e.cond === "broken") g.vsBroken += e.pct; else if (e.cond === "vulnerable") g.vsVuln += e.pct; else g.vsArts += e.pct; break;
      case "kindDmg": g.kindDmg[e.kind] = (g.kindDmg[e.kind] ?? 0) + e.pct; break;
      case "elementDmg": g.elemDmg[e.element] = (g.elemDmg[e.element] ?? 0) + e.pct; break;
      case "critRate": u.critRate += e.v; break;
      case "critDmg": u.critDmg += e.v; break;
      case "stagger": g.staggerMul += e.pct; break;
      case "breakEnergy": g.breakEnergy = true; break;
      case "selfHpDmg": if (e.dmgType === "physical") g.selfHpHighPhys += e.pct; else g.selfHpHighArts += e.pct; break;
      case "selfHpReduce": g.selfHpLowReduce += e.pct; break;
      case "onKill": if (e.effect === "heal") g.onKillHeal += e.pct; else g.onKillAtk += e.pct; break;
      case "startShield": shieldPct += e.v; break;
      case "healEff": u.healRecv = +(((u.healRecv ?? 1) * (1 + e.pct)).toFixed(3)); break; // 자신이 받는 회복량
      case "healGuard": g.healGuard = Math.max(g.healGuard ?? 0, e.pct); break;
      case "anomalyHit": g.anomalyHit = Math.max(g.anomalyHit ?? 0, e.pct); break;
      case "startHeal": healPct += e.v; break;
      case "startEnergy": startEnergy += e.v; break;
      case "artsStr": u.artsStr = (u.artsStr || 0) + e.v; break;               // 오리지늄 아츠 강도 → 이상 피해 강화
      case "linkCd": u.linkCdMul = (u.linkCdMul ?? 1) * (1 - e.pct); break;    // 연계 쿨감
      case "speed": u.speed += e.v; break;                                     // 속도 부옵 → 턴 순서 상승
      case "trigger": break; // 조건부 발동 — combat.ts gearTrigger가 세트명으로 처리(u.gearSets)
    }
  }
  u.gear = g;
  if (atkPct > 0) u.attack = Math.round(u.attack * (1 + atkPct)); // 공식 1.1: 공격력 × (1 + 공격력% 보너스)
  if (shieldPct > 0) u.shield += Math.round(u.maxHp * shieldPct);
  if (healPct > 0) u.hp = Math.min(u.maxHp, u.hp + Math.round(u.maxHp * healPct));
  return startEnergy;
}

// 전투 시 gear 배율(데미지 계산에서 호출): 스킬 종류·아츠·조건부(불균형/취약/아츠) 합산.
export function gearDamageBonus(g: GearBonus, kind: "attack" | "battle" | "link" | "ult", elem: "physical" | Element, target: DDUnit): number {
  let b = (g.kindDmg[kind] ?? 0) + (g.kindDmg.all ?? 0);
  if (elem !== "physical") b += (g.elemDmg[elem] ?? 0);
  b += g.elemDmg.all ?? 0;
  if (target.staggered) b += g.vsBroken;
  if (target.physBreak > 0) b += g.vsDefBreak;
  if ((target.vuln.all ?? 0) > 0 || (target.vuln.physical ?? 0) > 0 || ELEMENTS.some((e) => (target.vuln[e] ?? 0) > 0)) b += g.vsVuln;
  if (ELEMENTS.some((e) => target.arts[e] > 0)) b += g.vsArts;
  return b;
}
