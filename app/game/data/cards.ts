import type { Card, CardTarget, DeckCard, Element, OperatorClass, PartyMember, SkillKind } from "../types/game";

// 카드 비용(에너지): 기본 1 / 배틀 2 / 연계 1 / 궁극 3
export const CARD_COST: Record<SkillKind, number> = { attack: 1, "battle-skill": 2, "link-skill": 1, ultimate: 3 };
// 카드별 불균형치(적 불균형 게이지 누적).
export const CARD_STAGGER: Record<SkillKind, number> = { attack: 14, "battle-skill": 34, "link-skill": 10, ultimate: 55 };
export const TACTICAL_STAGGER = 16;

// 카드 삭제 비용(상점): 삭제할수록 점점 비싸진다.
export const CARD_REMOVE_BASE = 40;
export const CARD_REMOVE_STEP = 35;
export function cardRemovalCost(removedCount: number): number {
  return CARD_REMOVE_BASE + removedCount * CARD_REMOVE_STEP;
}
export const MIN_DECK_SIZE = 5;
// ===== 정예화(Elite Promotion): 카드 강화 0차(기본)/1차/2차 =====
// 엔드필드 정예화 컨셉을 카드로. 위력 + 불균형치(콤보 엔진)를 단계별로 강화한다.
export const MAX_ELITE = 2;
// 정예화는 단순 딜증가가 아니라 오퍼 컨셉 강화(전투 로직에서 아키타입별 보너스). 플랫 위력은 완만하게.
export const ELITE_POWER = [1, 1.2, 1.4]; // 단계별 위력 배수
export const ELITE_STAGGER = [1, 1.2, 1.4]; // 단계별 불균형치 배수(빌더 컨셉)
const upPow = (n: number, lv = 0) => Math.ceil(n * (ELITE_POWER[lv] ?? 1));
const upStag = (n: number, lv = 0) => Math.round(n * (ELITE_STAGGER[lv] ?? 1));
export const eliteSuffix = (lv = 0) => (lv >= 2 ? "++" : lv === 1 ? "+" : "");

// ===== 기본 카드(시작 덱: 공격/방어) =====
// 오퍼와 무관한 중립 카드. 고정 위력, 치명/패시브 없음. 약하지만 안정적 — 오퍼 스킬 습득의 발판.
type BasicDef = { name: string; element: Element; cost: number; power: number; stagger: number; effect?: "shield"; target: CardTarget };
export const BASIC_CARDS: Record<string, BasicDef> = {
  "basic:strike": { name: "공격", element: "physical", cost: 1, power: 12, stagger: CARD_STAGGER.attack, target: "enemy" },
  "basic:defend": { name: "방어", element: "cryo", cost: 1, power: 12, stagger: 0, effect: "shield", target: "party" },
};
// 시작 덱(공격 4 · 방어 2 = 6장). 4명 파티 드래프트로 덱이 커지므로 시작은 슬림하게 → 덱 순환·핵심 카드 빈도↑
export const STARTING_DECK_SPECS: string[] = ["basic:strike", "basic:strike", "basic:strike", "basic:strike", "basic:defend", "basic:defend"];

export function makeBasicCard(ref: string, uid: string, elite = 0): Card {
  const def = BASIC_CARDS[ref];
  const power = upPow(def.power, elite);
  return {
    uid,
    operatorId: "basic",
    operatorName: "기본",
    element: def.element,
    kind: "attack",
    cost: def.cost,
    power,
    stagger: upStag(def.stagger, elite),
    name: `${def.name}${eliteSuffix(elite)}`,
    icon: "",
    description: "기본 카드",
    effectLine: def.effect === "shield" ? `파티 보호막 +${power}` : `${power} 피해`,
    target: def.target,
    effect: def.effect,
    tactical: true,
    eliteLevel: elite,
  };
}

// ===== 오퍼레이터 스킬 카드(습득) =====
// 연계 스킬로 '스킬 게이지를 회복'하는 오퍼(실제 설명) → 카드 사용 시 전투 에너지 환급.
// 아크라이트 「천둥의 울림」, 카뮤 「영혼의 가시」, 알레쉬 「얼음낚시 기술」 등 게이지 수급형 연계.
export const LINK_ENERGY_REFUND: Record<string, number> = { arclight: 1, camu: 1, alesh: 1 };
export function makeCard(op: PartyMember, kind: SkillKind, uid: string, elite = 0): Card {
  const basePower = kind === "attack" ? op.attack : kind === "battle-skill" ? op.battleSkillPower : kind === "link-skill" ? op.linkSkillPower : op.ultimatePower;
  // 디펜더는 일반공격에 체력 계수 소폭 혼합(저공격 보완 — 단단할수록 평타가 강해짐).
  const hpMix = kind === "attack" && op.className === "디펜더" ? Math.round(op.maxHp * DEFENDER_HP_COEF) : 0;
  const power = upPow(basePower, elite) + hpMix;
  // 일반공격 카드명은 "일반공격"으로 통일(스킬 카드는 실제 스킬명 유지).
  const skillName = kind === "battle-skill" ? op.battleSkillName : kind === "link-skill" ? op.linkSkillName : op.ultimateName;
  const name = kind === "attack" ? `일반공격${eliteSuffix(elite)}` : `${skillName}${eliteSuffix(elite)}`;
  const icon = kind === "attack" ? op.normalAttackIcon : kind === "battle-skill" ? op.battleSkillIcon : kind === "link-skill" ? op.linkSkillIcon : op.ultimateIcon;
  const description = kind === "attack" ? op.normalAttackDescription : kind === "battle-skill" ? op.battleSkillDescription : kind === "link-skill" ? op.linkSkillDescription : op.ultimateDescription;
  // 광역 판정(오퍼 컨셉): 궁극=기본 광역(ultSingle 예외) · 배틀/연계=플래그 또는 전기 연계
  const aoe = (kind === "ultimate" && !op.ultSingle)
    || (kind === "battle-skill" && !!op.battleAoe)
    || (kind === "link-skill" && (!!op.linkAoe || op.skillMechanic === "electric-attachment"));
  // 아델리아(corrosion-support)는 스킬로 자연 피해를 줘 부식 부착을 거는 디버퍼다. 회복은 재능(healOnCast)으로 처리 → 스킬은 데미지 카드.
  const effect = op.skillMechanic === "protective-arts" && kind !== "attack" ? "shield" : undefined;
  const effectLine = effect === "shield"
    ? "파티 보호막"
    : effect === "heal"
      ? "파티 회복"
      : kind === "ultimate"
        ? `전체 · ${power} 피해`
        : kind === "link-skill"
          ? `${power} · 불균형 시 강타(×1.5)`
          : kind === "battle-skill"
            ? `${power} · 불균형 누적${op.physBreak === "build" ? " · 방어불능+" : op.physBreak === "consume" ? " · 강타 소모" : ""}`
            : `${power} 피해`;
  // 불균형치 역할 차등(재분배 — 평균 유지): 물리 빌더 ×1.2, 소비형 ×1.0, 그 외(캐스터·서포터 등) ×0.85.
  const staggerMod = op.physBreak === "build" ? 1.2 : op.physBreak === "consume" ? 1.0 : 0.85;
  const stagger = effect ? 0 : Math.round(upStag(CARD_STAGGER[kind], elite) * staggerMod);
  // 보호막/회복 effect는 파티 대상 — 광역 판정보다 우선(표시·타깃 일관성).
  const energyRefund = kind === "link-skill" ? LINK_ENERGY_REFUND[op.id] : undefined;
  return { uid, operatorId: op.id, operatorName: op.name, element: op.element, kind, cost: CARD_COST[kind], power, stagger, name, icon, description, effectLine, target: effect ? "party" : aoe ? "all-enemies" : "enemy", effect, energyRefund, eliteLevel: elite };
}

// ===== 전술 카드(습득) =====
export type CardRarity = "normal" | "rare" | "epic";
export const RARITY_WEIGHT: Record<CardRarity, number> = { normal: 3, rare: 2, epic: 1 };

export type TacticalDef = {
  id: string;
  name: string;
  element: Element;
  cost: number;
  power: number;
  effect?: Card["effect"];
  target: "enemy" | "all-enemies" | "party";
  description: string;
  effectLine: string;
  faction?: number; // 0~4 세력 전용(미지정=중립, 모든 세력 풀에 등장)
  rarity: CardRarity;
};

export const TACTICAL_CARDS: Record<string, TacticalDef> = {
  // 중립(모든 세력 풀)
  "tac-supply": { id: "tac-supply", name: "긴급 보급", element: "nature", cost: 0, power: 2, effect: "energy", target: "party", description: "즉시 에너지를 보충한다.", effectLine: "에너지 +2", rarity: "normal" },
  "tac-regroup": { id: "tac-regroup", name: "재정비", element: "electric", cost: 1, power: 2, effect: "draw", target: "party", description: "전열을 정비해 카드를 더 뽑는다.", effectLine: "카드 2장 드로우", rarity: "normal" },
  "tac-cover": { id: "tac-cover", name: "엄폐 전개", element: "cryo", cost: 1, power: 16, effect: "shield", target: "party", description: "파티 전원에게 보호막을 전개한다.", effectLine: "파티 보호막 +16", rarity: "normal" },
  "tac-firstaid": { id: "tac-firstaid", name: "응급 처치", element: "nature", cost: 1, power: 18, effect: "heal", target: "party", description: "파티 전원을 회복한다.", effectLine: "파티 회복 +18", rarity: "normal" },
  "tac-focusfire": { id: "tac-focusfire", name: "화력 집중", element: "heat", cost: 2, power: 34, target: "enemy", description: "단일 대상에 강력한 포화를 집중한다.", effectLine: "단일 34 피해", rarity: "rare" },
  "tac-barrage": { id: "tac-barrage", name: "융단 포화", element: "physical", cost: 2, power: 18, target: "all-enemies", description: "전선 전체에 폭격을 가한다.", effectLine: "전체 18 피해", rarity: "rare" },
  "tac-counter": { id: "tac-counter", name: "전술 회피", element: "physical", cost: 1, power: 0, effect: "delay", target: "party", description: "전선을 재정비해 모든 적의 다음 행동을 지연시킨다.", effectLine: "모든 적 행동 지연", rarity: "rare" },
  // 세력 0 — 탈로스 광석수 무리(야수·물리)
  "tac-f0-rend": { id: "tac-f0-rend", name: "야수 강타", element: "physical", cost: 2, power: 28, target: "enemy", description: "야수의 본능을 모방한 강타.", effectLine: "단일 28 피해", faction: 0, rarity: "rare" },
  "tac-f0-swarm": { id: "tac-f0-swarm", name: "무리 사냥", element: "physical", cost: 2, power: 16, target: "all-enemies", description: "무리를 풀어 전선을 짓밟는다.", effectLine: "전체 16 피해", faction: 0, rarity: "normal" },
  // 세력 1 — 아겔로이 강습 군세(정렬·방벽)
  "tac-f1-volley": { id: "tac-f1-volley", name: "정렬 일제사격", element: "cryo", cost: 2, power: 20, target: "all-enemies", description: "정렬된 화망의 일제사격.", effectLine: "전체 20 피해", faction: 1, rarity: "rare" },
  "tac-f1-barrier": { id: "tac-f1-barrier", name: "전열 방벽", element: "cryo", cost: 1, power: 22, effect: "shield", target: "party", description: "전열에 방벽을 전개한다.", effectLine: "파티 보호막 +22", faction: 1, rarity: "normal" },
  // 세력 2 — 무릉 조석 아겔로이(침식·조류)
  "tac-f2-erode": { id: "tac-f2-erode", name: "침식 포화", element: "nature", cost: 2, power: 30, target: "enemy", description: "침식성 포화로 대상을 녹인다.", effectLine: "단일 30 피해", faction: 2, rarity: "rare" },
  "tac-f2-surge": { id: "tac-f2-surge", name: "조류 정비", element: "electric", cost: 1, power: 2, effect: "draw", target: "party", description: "조류의 흐름을 읽어 손패를 정비.", effectLine: "카드 2장 드로우", faction: 2, rarity: "normal" },
  // 세력 3 — 변경 무법 본크러셔(약탈·저격)
  "tac-f3-snipe": { id: "tac-f3-snipe", name: "약탈 저격", element: "heat", cost: 2, power: 42, target: "enemy", description: "무법자의 일격필살 저격.", effectLine: "단일 42 피해", faction: 3, rarity: "epic" },
  "tac-f3-loot": { id: "tac-f3-loot", name: "전리품 회수", element: "electric", cost: 0, power: 2, effect: "energy", target: "party", description: "약탈한 자원으로 에너지를 충전.", effectLine: "에너지 +2", faction: 3, rarity: "normal" },
  // 세력 4 — 청파채 무법단(질풍·운보)
  "tac-f4-gale": { id: "tac-f4-gale", name: "질풍 연격", element: "physical", cost: 2, power: 32, target: "enemy", description: "운객의 쾌속 연격으로 빈틈을 베어낸다.", effectLine: "단일 32 피해", faction: 4, rarity: "rare" },
  "tac-f4-step": { id: "tac-f4-step", name: "운보", element: "physical", cost: 1, power: 0, effect: "delay", target: "party", description: "구름 위를 걷듯 적의 진격을 흘려보낸다.", effectLine: "모든 적 행동 지연", faction: 4, rarity: "normal" },
};

export function makeTacticalCard(id: string, uid: string, elite = 0): Card {
  const def = TACTICAL_CARDS[id];
  const power = def.effect ? def.power : upPow(def.power, elite);
  return {
    uid,
    operatorId: "tactical",
    operatorName: "전술 지령",
    element: def.element,
    kind: "battle-skill",
    cost: def.cost,
    power,
    stagger: def.effect ? 0 : upStag(TACTICAL_STAGGER, elite),
    name: !def.effect ? `${def.name}${eliteSuffix(elite)}` : def.name,
    eliteLevel: elite,
    icon: "",
    description: def.description,
    effectLine: def.effectLine,
    target: def.target,
    effect: def.effect,
    tactical: true,
  };
}

// ===== 직군 유틸 카드 =====
// 오퍼당 1종. 디펜더=실드 · 서포터=회복 · 뱅가드=에너지 · 캐스터=아츠 셋업 · 스트라이커=버프 · 가드=처형격.
type UtilDef = { name: string; effect?: Card["effect"]; cost: number; target: CardTarget; line: string; power: number };
const CLASS_UTIL: Record<OperatorClass, UtilDef> = {
  "디펜더": { name: "방어 태세", effect: "shield", cost: 1, target: "party", line: "파티 보호막 +14", power: 14 },
  "서포터": { name: "응급 지원", effect: "heal", cost: 1, target: "party", line: "파티 회복 +16", power: 16 },
  "뱅가드": { name: "전술 가속", effect: "energy", cost: 0, target: "party", line: "에너지 +2", power: 2 },
  "캐스터": { name: "아츠 점화", effect: "setup", cost: 1, target: "enemy", line: "10 피해 · 원소 아츠 부착", power: 10 },
  "스트라이커": { name: "예열", effect: "buff", cost: 1, target: "party", line: "이번 전투 카드 피해 +15%", power: 15 },
  "가드": { name: "처형격", cost: 1, target: "enemy", line: "강타 · 불균형 특효", power: 0 },
};
export function makeOperatorUtilCard(op: PartyMember, uid: string, elite = 0): Card {
  const u = CLASS_UTIL[op.className];
  const base = op.className === "가드" ? op.attack * 2 : u.power; // 가드 처형격은 공격 비례 강타
  const power = upPow(base, elite);
  const stagger = u.effect && u.effect !== "setup" ? 0 : upStag(CARD_STAGGER["battle-skill"], elite);
  return {
    uid,
    operatorId: op.id,
    operatorName: op.name,
    element: op.element,
    kind: "battle-skill",
    cost: u.cost,
    power,
    stagger,
    name: `${u.name}${eliteSuffix(elite)}`,
    icon: "",
    description: "직군 유틸 카드",
    effectLine: u.line,
    target: u.target,
    effect: u.effect,
    eliteLevel: elite,
  };
}

// ===== 강력한 일격(강공) — 오퍼 공격 변형: 코스트2·고불균형 빌더 =====
// 엔드필드 '강력한 일격'(불균형 피해)을 카드화. 공격 계열(아츠/콤보 없음)이지만 불균형을 크게 쌓는다.
export const STRONG_COST = 2;
export const STRONG_STAGGER = 28; // 배틀(34) 미만 — 사다리: 일반 < 강공 < 배틀
export const DEFENDER_HP_COEF = 0.07; // 디펜더 일반/강공 체력 계수(저공격 보완)
export function makeStrongCard(op: PartyMember, uid: string, elite = 0): Card {
  // 위력 사다리: 일반공격 2회(공격력×2) 살짝 위, 단 배틀스킬 미만으로 캡.
  const target = Math.round(op.attack * 2.2);
  const base = Math.max(op.attack * 2 + 1, Math.min(target, op.battleSkillPower - 1));
  const hpMix = op.className === "디펜더" ? Math.round(op.maxHp * DEFENDER_HP_COEF) : 0; // 디펜더 체력 계수 혼합
  const power = upPow(base, elite) + hpMix;
  const staggerMod = op.physBreak === "build" ? 1.3 : op.physBreak === "consume" ? 1.1 : 0.9;
  return {
    uid,
    operatorId: op.id,
    operatorName: op.name,
    element: op.element,
    kind: "attack", // 공격 계열(콤보·아츠 없음) — 단순 강타, 일반과 배틀 사이
    cost: STRONG_COST,
    power,
    stagger: Math.round(upStag(STRONG_STAGGER, elite) * staggerMod),
    name: `강공격${eliteSuffix(elite)}`,
    icon: op.normalAttackIcon ?? "",
    description: "강공격 — 일반과 배틀 사이의 단타",
    effectLine: `${power} · 불균형 누적`,
    target: "enemy",
    eliteLevel: elite,
  };
}

// ===== 궁극 변신 카드(레바테인 황혼 · 장방이 천리의 경지) =====
// 변신 시 일반공격·배틀스킬 카드가 강화 광역 버전으로 교체된다(카드 변경 방식).
const TRANSFORM_FORM: Record<string, { atk: string; battle: string }> = {
  laevatain: { atk: "황혼 · 작열참", battle: "황혼 · 천화" },
  zhuangfangyi: { atk: "천뢰 · 섬격", battle: "천뢰 · 뇌옥" },
};
export function isTransformOperator(id: string): boolean {
  return Boolean(TRANSFORM_FORM[id]);
}
export function makeTransformedCard(op: PartyMember, kind: "attack" | "battle-skill", uid: string, elite = 0): Card {
  const form = TRANSFORM_FORM[op.id] ?? { atk: "강화 일격", battle: "강화 작렬" };
  if (kind === "attack") {
    const power = upPow(Math.round(op.attack * 2.5), elite); // 변신 일반 = 광역 강타
    return {
      uid, operatorId: op.id, operatorName: op.name, element: op.element, kind: "attack",
      cost: 1, power, stagger: upStag(Math.round(STRONG_STAGGER * 0.8), elite),
      name: `${form.atk}${eliteSuffix(elite)}`, icon: op.normalAttackIcon ?? "",
      description: "변신 강화 일격(광역)", effectLine: `전체 · ${power} 피해`,
      target: "all-enemies", eliteLevel: elite,
    };
  }
  const power = upPow(Math.round(op.battleSkillPower * 1.5), elite); // 변신 배틀 = 강화 광역
  return {
    uid, operatorId: op.id, operatorName: op.name, element: op.element, kind: "battle-skill",
    cost: 2, power, stagger: upStag(Math.round(CARD_STAGGER["battle-skill"] * 1.3), elite),
    name: `${form.battle}${eliteSuffix(elite)}`, icon: op.battleSkillIcon ?? "",
    description: "변신 강화 스킬(광역·고불균형)", effectLine: `전체 · ${power} 피해 · 고불균형`,
    target: "all-enemies", eliteLevel: elite,
  };
}

// 장방이 변신 추가: 0코스트 강화 배틀스킬(변신 동안 순환, 종료 시 제거).
export function makeConsumableUltCard(op: PartyMember, uid: string): Card {
  const power = upPow(Math.round(op.battleSkillPower * 2));
  return {
    uid, operatorId: op.id, operatorName: op.name, element: op.element, kind: "battle-skill",
    cost: 0, power, stagger: CARD_STAGGER["battle-skill"],
    name: "천리 · 일격필살", icon: op.battleSkillIcon ?? "",
    description: "변신 강화 배틀(0코스트)", effectLine: `전체 · ${power} 피해`,
    target: "all-enemies", eliteLevel: 0,
  };
}

// 카뮤 궁극 「선혈의 비」 추적 상태: 배틀 스킬이 0코스트 연계 「추적」으로 교체(스킬 게이지 소모 X + 회복).
// 연계 스킬로 간주되어 카뮤 재능(연계 회복·연타 부여)·궁극 충전이 함께 발동한다. 변신 동안 순환, 종료 시 제거.
export function makeChaseCard(op: PartyMember, uid: string): Card {
  const power = upPow(Math.round(op.linkSkillPower * 1.15));
  return {
    uid, operatorId: op.id, operatorName: op.name, element: op.element, kind: "link-skill",
    cost: 0, power, stagger: CARD_STAGGER["link-skill"],
    name: "추적", icon: op.linkSkillIcon ?? "",
    description: "선혈의 비 추적 — 0코스트 연계, 스킬 게이지 회복", effectLine: `전체 · ${power} 피해 · 에너지+1`,
    target: op.battleAoe ? "all-enemies" : "enemy", energyRefund: 1, eliteLevel: 0,
  };
}

// 이본 궁극 「아이스 슈터」 강화 상태: 일반공격이 강화 사격으로 교체(광역 냉기·고위력). 변신 동안 순환, 종료 시 제거.
export function makeYvonneStanceCard(op: PartyMember, uid: string): Card {
  const power = upPow(Math.round(op.attack * 2.3));
  return {
    uid, operatorId: op.id, operatorName: op.name, element: op.element, kind: "attack",
    cost: 1, power, stagger: upStag(Math.round(STRONG_STAGGER * 0.7)),
    name: "아이스 슈터 · 강화 사격", icon: op.normalAttackIcon ?? "",
    description: "아이스 슈터 강화 일반공격(광역·냉기)", effectLine: `전체 · ${power} 피해`,
    target: "all-enemies", eliteLevel: 0,
  };
}

// 미브 「청파 삼형」: 배틀 스킬이 단운→추형→개천 3초식으로 이어진다. 사용 시 다음 초식 카드를 손패에 추가.
// 1식 단운은 덱 배틀 스킬(끌어오기·순환), 2·3식은 추가되는 소멸 카드. 추형·개천은 강타(방불 소모)형.
export const MIFU_FORM_COUNT = 3;
const MIFU_FORMS: Record<number, { name: string; mult: number; cost: number; staggerMult: number; note: string }> = {
  1: { name: "청파 삼형 · 단운", mult: 0.9, cost: 2, staggerMult: 1.0, note: "끌어오기 · 불균형" },
  2: { name: "청파 삼형 · 추형", mult: 1.1, cost: 2, staggerMult: 1.15, note: "강타 소모" },
  3: { name: "청파 삼형 · 개천", mult: 1.45, cost: 1, staggerMult: 1.4, note: "강타 대량딜" },
};
export function makeMifuFormCard(op: PartyMember, form: number, uid: string): Card {
  const f = MIFU_FORMS[form] ?? MIFU_FORMS[1];
  const power = upPow(Math.round(op.battleSkillPower * f.mult));
  return {
    uid, operatorId: op.id, operatorName: op.name, element: op.element, kind: "battle-skill",
    cost: f.cost, power, stagger: Math.round(CARD_STAGGER["battle-skill"] * f.staggerMult),
    name: f.name, icon: op.battleSkillIcon ?? "",
    description: `청파 삼형 ${form}식 — ${f.note}`, effectLine: `${op.battleAoe ? "전체 · " : ""}${power} 피해 · ${f.note}`,
    target: op.battleAoe ? "all-enemies" : "enemy",
    comboForm: form, exhaust: form > 1, eliteLevel: 0,
    // 추형·개천은 강타(방불 소모)형 — 미브 본체는 build지만 이 카드만 강타로 오버라이드(단운·연계·궁극은 영향 없음).
    anomalyOverride: form >= 2 ? "crush" : undefined,
  };
}

// ===== 토큰 ↔ DeckCard ↔ Card =====
// 토큰: "basic:strike" | "op:<operatorId>:<kind|util|strong>" | "tac:<tacticalId>"
export function parseToken(token: string): { src: DeckCard["src"]; ref: string; kind?: SkillKind | "util" | "strong" } {
  if (token.startsWith("op:")) {
    const parts = token.split(":");
    return { src: "operator", ref: parts[1], kind: parts[2] as SkillKind | "util" | "strong" };
  }
  if (token.startsWith("tac:")) return { src: "tactical", ref: token.slice(4) };
  return { src: "basic", ref: token };
}

export function deckCardFromToken(token: string, uid: string): DeckCard {
  const p = parseToken(token);
  return { uid, src: p.src, ref: p.ref, kind: p.kind };
}

// DeckCard → 실제 Card. battle=true면 전투 불능 오퍼의 스킬 카드는 제외.
export function cardFromDeck(dc: DeckCard, party: PartyMember[], battle: boolean): Card | null {
  const lock = (c: Card | null): Card | null => (c && dc.copyLocked ? { ...c, copyLocked: true } : c);
  if (dc.src === "basic") return lock(makeBasicCard(dc.ref, dc.uid, dc.eliteLevel));
  if (dc.src === "tactical") return TACTICAL_CARDS[dc.ref] ? lock(makeTacticalCard(dc.ref, dc.uid, dc.eliteLevel)) : null;
  const op = party.find((m) => m.id === dc.ref);
  if (!op || !dc.kind) return null;
  if (battle && op.hp <= 0) return null;
  // 변신 상태(레바테인·장방이): 일반공격·배틀스킬 카드를 강화 광역 버전으로 교체.
  if (op.transformed && isTransformOperator(op.id) && (dc.kind === "attack" || dc.kind === "battle-skill")) {
    return lock(makeTransformedCard(op, dc.kind, dc.uid, dc.eliteLevel));
  }
  // 카뮤 추적 상태: 배틀 스킬 → 0코스트 연계 「추적」으로 교체.
  if (op.id === "camu" && op.transformed && dc.kind === "battle-skill") {
    return lock(makeChaseCard(op, dc.uid));
  }
  // 이본 아이스 슈터 상태: 일반공격 → 강화 사격으로 교체.
  if (op.id === "yvonne" && op.transformed && dc.kind === "attack") {
    return lock(makeYvonneStanceCard(op, dc.uid));
  }
  // 미브 청파 삼형: 덱 배틀 스킬은 항상 1식 단운으로 시작(사용 시 다음 초식이 손패에 추가됨).
  if (op.id === "mifu" && dc.kind === "battle-skill") {
    return lock(makeMifuFormCard(op, 1, dc.uid));
  }
  if (dc.kind === "util") return lock(makeOperatorUtilCard(op, dc.uid, dc.eliteLevel));
  if (dc.kind === "strong") return lock(makeStrongCard(op, dc.uid, dc.eliteLevel));
  return lock(makeCard(op, dc.kind, dc.uid, dc.eliteLevel));
}

export function buildDeck(party: PartyMember[], deck: DeckCard[], opts?: { battle?: boolean }): Card[] {
  const battle = opts?.battle ?? false;
  return deck.map((dc) => cardFromDeck(dc, party, battle)).filter((c): c is Card => Boolean(c));
}

// 보상 미리보기용(임시 uid)
export function previewCardFromToken(token: string, party: PartyMember[]): Card | null {
  return cardFromDeck({ ...deckCardFromToken(token, `preview-${token}`) }, party, false);
}

// 시작 덱: 파티 각 오퍼의 카드 키트 6장 — 일반공격×2 · 강공 · 쉴드(방어) · 배틀 · 연계.
// 궁극기는 덱에 없음(별도 액티브 게이지). 카드 종류가 풍부해 카제나식 손맛.
export function startingDeck(seqStart: number, party: { id: string }[] = []): { deck: DeckCard[]; seq: number } {
  const specs: string[] = party.length > 0
    ? party.flatMap((op) => [
        `op:${op.id}:attack`,
        `op:${op.id}:attack`,
        `op:${op.id}:strong`,
        "basic:defend",
        `op:${op.id}:battle-skill`,
        `op:${op.id}:link-skill`,
      ])
    : STARTING_DECK_SPECS;
  const deck = specs.map((spec, i) => deckCardFromToken(spec, `c${seqStart + i}`));
  return { deck, seq: seqStart + specs.length };
}

// 카드 등급: 오퍼 스킬은 종류 기반(기본=노멀, 배틀/연계=레어, 궁극=에픽), 전술은 정의값.
const OP_KIND_RARITY: Record<SkillKind, CardRarity> = { attack: "normal", "battle-skill": "rare", "link-skill": "rare", ultimate: "epic" };
export function cardRarity(token: string): CardRarity {
  const p = parseToken(token);
  if (p.src === "operator" && p.kind === "util") return "rare"; // 직군 유틸 = 레어
  if (p.src === "operator" && p.kind) return OP_KIND_RARITY[p.kind as SkillKind] ?? "normal";
  if (p.src === "tactical") return TACTICAL_CARDS[p.ref]?.rarity ?? "normal";
  return "normal";
}

// 카제나식 세력 드래프트: 이번 런 세력 풀(파티 오퍼 스킬 + 중립·해당 세력 전술)에서
// 등급 가중 추첨으로 서로 다른 3장 제시. 에픽일수록 드물게.
// 카제나식 카드 획득:
//  · 흐릿한 기억(일반 전투, vivid=false): 등급 가중 랜덤 3장 드래프트.
//  · 선명한 기억(정예/보스, vivid=true): 파티 오퍼의 모든 스킬(배틀/연계/궁극/유틸)을 펼쳐 확정 선택.
export function cardRewardPool(party: PartyMember[], factionIndex: number, seed: number, vivid = false): string[] {
  const kinds: SkillKind[] = ["battle-skill", "link-skill", "ultimate"];
  if (vivid) {
    // 선명한 기억: 파티 오퍼 고유 스킬 전체를 확정 선택지로 제시(랜덤 X).
    return party.flatMap((op) => [...kinds.map((k) => `op:${op.id}:${k}`), `op:${op.id}:strong`, `op:${op.id}:util`]);
  }
  // 덱 강화: 강공(불균형 빌더)·배틀·연계·궁극·직군 유틸.
  const tokens: string[] = [];
  party.forEach((op) => {
    kinds.forEach((k) => tokens.push(`op:${op.id}:${k}`));
    tokens.push(`op:${op.id}:strong`); // 강공(강력한 일격)
    tokens.push(`op:${op.id}:util`); // 직군 유틸 카드
  });
  Object.values(TACTICAL_CARDS).forEach((t) => {
    if (t.faction == null || t.faction === factionIndex) tokens.push(`tac:${t.id}`);
  });
  // 등급 가중 풀
  const weighted: string[] = [];
  tokens.forEach((t) => {
    const w = RARITY_WEIGHT[cardRarity(t)];
    for (let i = 0; i < w; i += 1) weighted.push(t);
  });
  const out: string[] = [];
  let s = (seed * 2654435761) & 0x7fffffff;
  let guard = 0;
  while (out.length < 3 && guard < 200) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const pick = weighted[s % weighted.length];
    if (!out.includes(pick)) out.push(pick);
    guard += 1;
  }
  return out;
}
