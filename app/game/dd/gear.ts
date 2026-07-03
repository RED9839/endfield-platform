// ===== DD 장비/세트 시스템 (카드게임 game-gears.ts 구조 포팅) =====
// 3슬롯(방어구/장갑/부품) 각각 세트 1개 장착 → 같은 세트 2부위 이상이면 세트 효과 발동.
// 효과는 기존 전투 메커니즘(강타/갑옷파괴=불균형, 부착=아츠, 감전/부식/동결, 치명, 궁충)과 연동.
// namu.wiki 장비 문서 3.1 캐논 효과 반영. 개별 부위 스탯은 gearGrade로 추상화(카드게임과 동일 방침).
import type { DDUnit, Element, GearBonus } from "./combat";
import { ELEMENTS } from "./combat";
import gearPiecesData from "./data/gear-pieces.json";

export type GearSlot = "armor" | "gloves" | "kit";
export type Loadout = Partial<Record<GearSlot, string>>; // 슬롯 → 세트명
export const GEAR_SLOTS: GearSlot[] = ["armor", "gloves", "kit"];
const SLOT_KO: Record<GearSlot, string> = { armor: "방어구", gloves: "장갑", kit: "부품" };
export const gearSlotName = (s: GearSlot) => SLOT_KO[s];

// 세트 효과 타입(카드게임 SetEffect 포팅 — DD 스킬 kind/원소에 정합)
export type SetEffect =
  | { type: "dmgVs"; cond: "broken" | "vulnerable" | "arts"; pct: number } // 불균형/취약/아츠부착 적 추가 피해
  | { type: "kindDmg"; kind: "attack" | "battle" | "link" | "ult" | "all"; pct: number } // 스킬 종류별 피해
  | { type: "elementDmg"; element: Element | "all"; pct: number } // 원소 피해
  | { type: "critRate"; v: number }
  | { type: "critDmg"; v: number }
  | { type: "startShield"; v: number } // 전투 시작 보호막(장착 오퍼, maxHp 비례 %)
  | { type: "startHeal"; v: number }   // 전투 시작 회복(maxHp 비례 %)
  | { type: "startEnergy"; v: number } // 전투 시작 파티 스킬 게이지
  | { type: "breakEnergy" }            // 불균형 돌파 시 궁 충전
  | { type: "stagger"; pct: number }   // 불균형 누적 증가
  | { type: "selfHpDmg"; dmgType: "physical" | "arts"; pct: number } // 자신 HP 50%↑ 시 물리/아츠 피해(전달자·침식 차단)
  | { type: "selfHpReduce"; pct: number } // 자신 HP 50%↓ 시 받는 피해 감소(중장갑 전달자)
  | { type: "onKill"; effect: "heal" | "atk"; pct: number }         // 적 처치 시 회복/공격력(통합형)
  | { type: "atkPct"; pct: number }                                 // 공격력 % 보너스(공식 1.1: 공격력×(1+공격력%))
  | { type: "hp"; v: number }                                       // 생명력 능력치(식양의 숨결 +1000 등 실측)
  | { type: "def"; v: number }                                      // 방어력 능력치(방어형 세트 옵션, mitigate에 작용)
  | { type: "trigger"; desc: string };                              // 조건부 발동(원작 그대로) — 실제 적용은 combat.ts gearTrigger가 세트명으로 처리

// 밸런스: 2부위 = 강력한 조건부 1개(15~25%) 또는 중간 2개. 카드게임 밸런스 계승.
export const GEAR_SETS: Record<string, SetEffect[]> = {
  // ── Lv70 세트(namu 3.1 원문 그대로) — 상시 스탯 + 조건부 발동(combat.ts gearTrigger가 세트명으로 실행) ──
  "고검의 잔향": [{ type: "atkPct", pct: 0.08 }, { type: "trigger", desc: "강타·갑옷파괴 시 물리 +6%×소모 스택(취약·불균형·결정 시 강화)" }],
  "식양의 흐름": [{ type: "atkPct", pct: 0.10 }, { type: "trigger", desc: "감전·부식 소모 시 전기·자연 +15%(최대 3스택, 25초)" }],
  "청파": [{ type: "trigger", desc: "연계 후 모든 스킬 피해 +20%(최대 2스택, 15초)" }], // 상시: 연계 쿨감 +15%(엔진 미모델)
  "식양의 숨결": [{ type: "hp", v: 1000 }, { type: "trigger", desc: "증폭·비호·취약·허약 부여 후 팀 피해 +16%(15초)" }],
  "조류의 물결": [{ type: "kindDmg", kind: "all", pct: 0.20 }, { type: "trigger", desc: "2스택+ 아츠 부착 후 아츠 피해 +35%(15초)" }],
  "응룡 50식": [{ type: "atkPct", pct: 0.15 }, { type: "trigger", desc: "팀 배틀 시 다음 연계 피해 +20%(최대 3스택)" }],
  "M. I. 경찰용": [{ type: "critRate", v: 0.05 }, { type: "trigger", desc: "치명 후 공격력 +5%(최대 5스택), 최대 시 치확 +5%" }],
  "열 작업용": [{ type: "trigger", desc: "연소 후 열기 +50%(10초)" }, { type: "trigger", desc: "부식 후 자연 +50%(10초)" }], // 상시: 오리지늄 아츠 강도 +30
  "개척": [{ type: "kindDmg", kind: "all", pct: 0.16 }, { type: "trigger", desc: "게이지 회복 후 팀 전체 피해 +16%(15초)" }], // 상시: 연계 쿨감 +15% · 팀 버프를 자기 피해로 근사
  "펄스식": [{ type: "trigger", desc: "감전 후 전기 +50%(10초)" }, { type: "trigger", desc: "동결 후 냉기 +50%(10초)" }], // 상시: 오리지늄 아츠 강도 +30
  "본 크러셔": [{ type: "atkPct", pct: 0.15 }, { type: "trigger", desc: "연계 후 다음 배틀 피해 +30%(최대 2스택)" }],
  "경량 초자연": [{ type: "atkPct", pct: 0.08 }, { type: "trigger", desc: "방어 불능 부여 후 물리 +8%(최대 4스택), 4스택 시 추가 +16%" }],
  "생체 보조": [{ type: "startHeal", v: 0.20 }, { type: "trigger", desc: "치유 시 대상 받는 피해 -15%(초과 치유 시 -30%)" }], // 상시: 치유 효율 +20%
  "검술사": [{ type: "stagger", pct: 0.20 }, { type: "trigger", desc: "물리 이상 부여 후 공격력 250% 추가 물리(15초당 1회)" }],
  // ── Lv50 이하 ──
  "재앙 방호": [{ type: "startEnergy", v: 50 }, { type: "trigger", desc: "궁충 효율 +20% · 배틀 시 게이지 50 반환(전투당 1회)" }],
  "아부레이의 메아리": [{ type: "kindDmg", kind: "all", pct: 0.22 }],
  // ── Lv36~50 침식(자체 HP 조건부, warfarin 데이터마인) ──
  "침식 차단": [{ type: "selfHpDmg", dmgType: "arts", pct: 0.18 }], // 고체력 시 아츠 피해
  "침식 방호": [{ type: "startHeal", v: 0.14 }, { type: "startShield", v: 0.08 }], // 저체력 치유 강화(방어 지원)
  // ── Lv28 전달자·통합형(warfarin) ──
  "순행 전달자": [{ type: "selfHpDmg", dmgType: "physical", pct: 0.15 }], // 고체력 시 물리 피해
  "중장갑 전달자": [{ type: "selfHpReduce", pct: 0.2 }],  // 탱커: 방어력 + 저체력 시 받는 피해 감소
  "통합형 중갑": [{ type: "onKill", effect: "heal", pct: 0.08 }],        // 처치 시 회복
  "통합형 경갑": [{ type: "onKill", effect: "atk", pct: 0.15 }],         // 처치 시 공격력
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
    case "startEnergy": return `전투 시작 게이지 +${e.v}`;
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
export const OP_RECOMMENDED_SET: Record<string, string> = {
  laevatain: "열 작업용", ember: "경량 초자연", wulfgard: "청파", yvonne: "M. I. 경찰용",
  lastrite: "조류의 물결", zhuangfangyi: "식양의 흐름", avywenna: "본 크러셔", perlica: "펄스식",
  dapan: "검술사", chenqianyu: "응룡 50식", rossi: "M. I. 경찰용", mifu: "고검의 잔향", // 시트 교정: 진천우=응룡 50식
  alesh: "개척", arclight: "개척", pogranichnik: "응룡 50식", // 시트 교정: 포그=응룡 50식
  tangtang: "청파", // 시트 기준(냉기 캐스터·향수 무기 행). 이전 파티 이미지의 본 크러셔에서 교정
  ardelia: "식양의 숨결", xaihi: "식양의 숨결", antal: "식양의 숨결", gilberta: "식양의 숨결",
  snowshine: "식양의 숨결", catcher: "식양의 숨결",
  lifeng: "식양의 숨결", endministrator: "고검의 잔향", estella: "식양의 숨결", // 시트: 미등록 3인 추가
  // warfarin gear.data 대조: 개척자=개척(suit_atb01 피스명), 궁극기충전=재앙방호(suit_usp01=ult skill point)
  camu: "개척", akekuri: "재앙 방호", fluorite: "재앙 방호",
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
export const setEffectText = (setName: string) => hasSetEffect(setName) ? `2부위: ${GEAR_SETS[setName].map(effectText).join(" · ")}` : "세트 효과 없음";
export const SET_NAMES = Object.keys(GEAR_SETS);

// 같은 세트 2부위 이상 장착 시 발동
export function activeSets(loadout: Loadout): string[] {
  const counts: Record<string, number> = {};
  for (const slot of GEAR_SLOTS) { const s = loadout[slot]; if (s) { const set = refSet(s); counts[set] = (counts[set] ?? 0) + 1; } } // 피스 id는 소속 세트로 집계
  return Object.entries(counts).filter(([name, n]) => n >= 2 && hasSetEffect(name)).map(([name]) => name);
}

function emptyBonus(): GearBonus {
  return { kindDmg: {}, elemDmg: {}, vsBroken: 0, vsVuln: 0, vsArts: 0, staggerMul: 0, breakEnergy: false, selfHpHighPhys: 0, selfHpHighArts: 0, selfHpLowReduce: 0, onKillHeal: 0, onKillAtk: 0 };
}

// 로드아웃 → 활성 세트 효과를 유닛에 적용(전투 배율은 unit.gear에, 즉시 효과는 스탯에 반영). 시작 게이지 총량 반환.
// 부위별 개별 방어력 — warfarin gear.data 실측(베이스 스탯=방어 attrType 3, T-max 강화). 부위마다 다름·세트 발동 무관.
export const GEAR_DEFENSE: Record<GearSlot, number> = { armor: 56, gloves: 42, kit: 21 };
export const GEAR_DEFENSE_PER_SLOT = GEAR_DEFENSE.armor; // (하위호환) 참조용

// ── 세트별 실측 부옵 (warfarin gear.data, 세트 대표 피스). 각 피스: 방어(주옵) + 능력치(→gearGrade) + 피해 부옵. ──
// grade = 능력치(힘/민첩/지능/의지) 합(실측), dmg = 피해 부옵(실측%). 단조로 스케일. dmg.kind: ult/battle/link/attack/all(물리)/elem(오퍼속성)/atkPct/hpPct/critRate/critDmg/energy.
type DmgSub = { kind: "ult" | "battle" | "link" | "attack" | "all" | "elem" | "atkPct" | "hpPct" | "critRate" | "critDmg" | "energy"; v: number };
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
const GRADE_FACTOR = 0.13; // 실측 능력치 합 → gearGrade 환산(3부위 ≈ +40 → 저항 ~50%)

// ── 전 220 피스 레지스트리 (data/gear-pieces.json). loadout이 피스 id를 참조하면 그 피스 실측 스탯, 세트명이면 대표 피스(GEAR_SET_STATS). ──
export type GearPiece = { id: string; name: string; set: string; slot: GearSlot; rarity: number; def: number; grade: { base: number; enh: number[] }; dmg?: { kind: DmgSub["kind"]; base: number; enh: number[] } };
export const GEAR_PIECES = gearPiecesData as GearPiece[];
export const GEAR_PIECE_BY_ID: Record<string, GearPiece> = Object.fromEntries(GEAR_PIECES.map((p) => [p.id, p]));
export const GEAR_PIECES_BY_SET_SLOT: Record<string, Partial<Record<GearSlot, GearPiece[]>>> = {};
for (const p of GEAR_PIECES) ((GEAR_PIECES_BY_SET_SLOT[p.set] ??= {})[p.slot] ??= []).push(p);
// 세트 대표 피스(변형 마커 ·• 없는 base). 세트명 로드아웃이 실제 이 피스의 실측값을 사용.
export const GEAR_SET_CANON: Record<string, Partial<Record<GearSlot, GearPiece>>> = {};
for (const p of GEAR_PIECES) { if (/[·•]/.test(p.name)) continue; const s = (GEAR_SET_CANON[p.set] ??= {}); if (!s[p.slot]) s[p.slot] = p; }

// 오퍼별 실제 장착 피스(시트 지정 빌드 — 오퍼마다 다른 변형). 누락 슬롯은 recommendedLoadout에서 세트 대표로 폴백.
export const OP_GEAR: Record<string, Loadout> = {
  laevatain: { gloves: "item_equip_t4_suit_fire_natr01_hand_03", kit: "item_equip_t4_suit_fire_natr01_edc_02" },
  ember: { armor: "item_equip_t4_suit_poise01_body_01", gloves: "item_equip_t4_suit_phy01_hand_01", kit: "item_equip_t4_suit_poise01_edc_01" },
  wulfgard: { armor: "item_equip_t4_suit_combo_cd01_body_01", gloves: "item_equip_t4_suit_attri01_hand_01", kit: "item_equip_t4_suit_combo_cd01_edc_02" },
  akekuri: { armor: "item_equip_t4_parts_wuling01_body_02", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_parts_wuling01_edc_03" },
  camu: { armor: "item_equip_t4_suit_atb01_body_05", gloves: "item_equip_t4_suit_atb01_hand_02", kit: "item_equip_t4_suit_atb01_edc_04" },
  yvonne: { armor: "item_equip_t4_suit_criti01_body_04", gloves: "item_equip_t4_suit_criti01_hand_03", kit: "item_equip_t4_suit_criti01_edc_03" },
  lastrite: { armor: "item_equip_t4_suit_phy01_body_01", gloves: "item_equip_t4_suit_burst01_hand_01", kit: "item_equip_t4_suit_burst01_edc_01" },
  tangtang: { armor: "item_equip_t4_suit_combo_cd01_body_01", gloves: "item_equip_t4_suit_criti01_hand_01", kit: "item_equip_t4_suit_combo_cd01_edc_01" },
  snowshine: { armor: "item_equip_t4_suit_heal01_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_01" },
  xaihi: { armor: "item_equip_t4_parts_wuling01_body_02", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_03" },
  alesh: { armor: "item_equip_t4_parts_wuling01_body_02", gloves: "item_equip_t4_suit_atb01_hand_02", kit: "item_equip_t4_suit_atb01_edc_04" },
  estella: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_03" },
  zhuangfangyi: { armor: "item_equip_t4_suit_expend_spell01_body_02", gloves: "item_equip_t4_suit_expend_spell01_hand_02", kit: "item_equip_t4_suit_expend_spell01_edc_02" },
  avywenna: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_attri01_hand_03", kit: "item_equip_t4_suit_attri01_edc_06" },
  perlica: { armor: "item_equip_t4_suit_pulse_cryst01_body_01", gloves: "item_equip_t4_suit_pulse_cryst01_hand_01", kit: "item_equip_t4_suit_pulse_cryst01_edc_02" },
  arclight: { armor: "item_equip_t4_suit_atb01_body_05", gloves: "item_equip_t4_suit_atb01_hand_02", kit: "item_equip_t4_parts_wuling01_edc_03" },
  antal: { armor: "item_equip_t4_suit_burst01_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_01" },
  gilberta: { armor: "item_equip_t4_suit_usp02_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_03" },
  ardelia: { armor: "item_equip_t4_suit_usp02_body_01", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_03" },
  fluorite: { armor: "item_equip_t4_suit_attri01_body_05", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_01" },
  pogranichnik: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_atk02_hand_02", kit: "item_equip_t4_suit_atk02_edc_04" },
  lifeng: { armor: "item_equip_t4_suit_atk02_body_02", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_01" },
  endministrator: { armor: "item_equip_t4_suit_crush_fracture_body_01", gloves: "item_equip_t4_suit_crush_fracture_hand_01", kit: "item_equip_t4_suit_crush_fracture_edc_01" },
  rossi: { armor: "item_equip_t4_suit_criti01_body_06", gloves: "item_equip_t4_parts_wuling01_hand_01", kit: "item_equip_t4_suit_criti01_edc_06" },
  chenqianyu: { armor: "item_equip_t4_suit_atk02_body_02", gloves: "item_equip_t4_parts_wuling01_hand_01", kit: "item_equip_t4_suit_atk02_edc_03" },
  dapan: { armor: "item_equip_t4_suit_phy01_body_01", gloves: "item_equip_t4_suit_fire_natr01_hand_01", kit: "item_equip_t4_suit_phy01_edc_01" },
  catcher: { armor: "item_equip_t4_suit_attri01_body_04", gloves: "item_equip_t4_suit_usp02_hand_01", kit: "item_equip_t4_suit_usp02_edc_01" },
  mifu: { armor: "item_equip_t4_suit_crush_fracture_body_01", gloves: "item_equip_t4_suit_crush_fracture_hand_01", kit: "item_equip_t4_suit_crush_fracture_edc_01" },
};
// 오퍼 실제 로드아웃: OP_GEAR 피스 + 누락 슬롯은 세트 대표 피스 id로 폴백(세트명 아님 → 모든 슬롯이 개별 단조·제작 가능).
export function recommendedLoadout(opId: string, setName: string): Loadout {
  const og = OP_GEAR[opId] ?? {};
  const fallback = (slot: GearSlot): string => GEAR_SET_CANON[setName]?.[slot]?.id ?? setName;
  return { armor: og.armor ?? fallback("armor"), gloves: og.gloves ?? fallback("gloves"), kit: og.kit ?? fallback("kit") };
}

const refSet = (ref: string): string => GEAR_PIECE_BY_ID[ref]?.set ?? ref; // loadout 항목(세트명|피스id) → 소속 세트
function resolveGear(ref: string, slot: GearSlot, lv: number): { def: number; grade: number; dmg?: DmgSub } | null {
  const p = GEAR_PIECE_BY_ID[ref] ?? GEAR_SET_CANON[ref]?.[slot]; // 피스 id 또는 세트명 → 실제 피스(gear-pieces.json 실측값)
  if (!p) return null;
  const grade = lv === 0 ? p.grade.base : p.grade.enh[lv - 1];
  return { def: p.def, grade, dmg: p.dmg ? { kind: p.dmg.kind as DmgSub["kind"], v: lv === 0 ? p.dmg.base : p.dmg.enh[lv - 1] } : undefined };
}

export function applyGear(u: DDUnit, loadout: Loadout | undefined, gearLevel = 0, levels?: Partial<Record<GearSlot, number>>): number {
  if (!loadout) return 0;
  const g = emptyBonus();
  let atkPct = 0, startEnergy = 0, gradeAdd = 0;
  for (const slot of GEAR_SLOTS) if (loadout[slot]) {
    const lv = Math.max(0, Math.min(3, levels?.[slot] ?? gearLevel)); // 부위별 단조(제작) 우선, 없으면 통합 gearLevel
    const r = resolveGear(loadout[slot]!, slot, lv); // 피스 id 또는 세트명 → 실측 스탯(단조 반영)
    if (!r) { u.defense += GEAR_DEFENSE[slot]; continue; }
    u.defense += r.def; // 주옵: 방어(피스별 실측)
    gradeAdd += r.grade * GRADE_FACTOR; // 실측 능력치 → gearGrade
    if (r.dmg) { const v = r.dmg.v, k = r.dmg.kind; // 실측 피해 부옵
      if (k === "atkPct") atkPct += v;
      else if (k === "hpPct") { const h = Math.round(u.maxHp * v); u.maxHp += h; u.hp += h; }
      else if (k === "critRate") u.critRate += v;
      else if (k === "critDmg") u.critDmg += v;
      else if (k === "energy") startEnergy += v;
      else if (k === "all") g.kindDmg.all = (g.kindDmg.all ?? 0) + v;
      else if (k === "elem") { if (u.opElement && u.opElement !== "physical") g.elemDmg[u.opElement] = (g.elemDmg[u.opElement] ?? 0) + v; else g.kindDmg.all = (g.kindDmg.all ?? 0) + v; }
      else g.kindDmg[k] = (g.kindDmg[k] ?? 0) + v; // ult/battle/link/attack
    }
  }
  if (gradeAdd > 0) { u.gearGrade += Math.round(gradeAdd); const rv = +(1 - 1 / (0.01 * u.gearGrade + 1)).toFixed(3); u.resist = { physical: rv, heat: rv, electric: rv, cryo: rv, nature: rv }; } // 실측 능력치 → 저항 재계산
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
      case "startHeal": healPct += e.v; break;
      case "startEnergy": startEnergy += e.v; break;
      case "trigger": break; // 조건부 발동 — combat.ts gearTrigger가 세트명으로 처리(u.gearSets)
    }
  }
  u.gear = g;
  if (atkPct > 0) u.attack = Math.round(u.attack * (1 + atkPct)); // 공식 1.1: 공격력 × (1 + 공격력% 보너스)
  if (shieldPct > 0) u.shield += Math.round(u.maxHp * shieldPct);
  if (healPct > 0) u.hp = Math.min(u.maxHp, u.hp + Math.round(u.maxHp * healPct));
  return startEnergy;
}

// 전투 시 gear 배율(데미지 계산에서 호출): 스킬 종류·원소·조건부(불균형/취약/아츠) 합산.
export function gearDamageBonus(g: GearBonus, kind: "attack" | "battle" | "link" | "ult", elem: "physical" | Element, target: DDUnit): number {
  let b = (g.kindDmg[kind] ?? 0) + (g.kindDmg.all ?? 0);
  if (elem !== "physical") b += (g.elemDmg[elem] ?? 0);
  b += g.elemDmg.all ?? 0;
  if (target.staggered) b += g.vsBroken;
  if ((target.vuln.all ?? 0) > 0 || (target.vuln.physical ?? 0) > 0 || ELEMENTS.some((e) => (target.vuln[e] ?? 0) > 0)) b += g.vsVuln;
  if (ELEMENTS.some((e) => target.arts[e] > 0)) b += g.vsArts;
  return b;
}
