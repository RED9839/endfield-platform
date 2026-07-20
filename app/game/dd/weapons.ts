// 오퍼레이터 시그니처 무기(전무) — 전부 실데이터. 타입/기초공격력/능력치·부가 스탯은 위키·무기 소스 실측이고,
// 시리즈 스킬은 data/weapons-source 원문(rank4)을 그대로 등록한다. 무기 타입은 속도도 결정한다(weapon-type.ts).
import type { DDUnit, DmgKey, Element } from "./combat";
import { setTimer, pushSrc, popSrc, bumpVuln } from "./combat";
import { applyAttrs, attrBonusOf, OP_MAINSUB } from "./roster";
import { weaponSummaries } from "@/data/weapons-summary-data";
import { OP_WEAPON_SERIES } from "./weapon-series";
import type { WeaponType } from "./weapon-type";
import { OP_WEAPON, WEAPON_KO } from "./weapon-type";

export type { WeaponType } from "./weapon-type";
export { WEAPON_KO, WEAPON_ICON, OP_WEAPON } from "./weapon-type";

export const WEAPON_EFFECT_KO: Record<WeaponType, string> = {
  sword: "치명 확률 +8%",
  greatsword: "불균형 누적 +25%",
  polearm: "배틀 스킬 피해 +15%",
  handcannon: "전 피해 +10%",
  artsunit: "아츠 피해 +12%",
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
  // 42식 · 척결(아츠 유닛★6) — 결 전무. 기초 505 / 능력치 지능 +156(rank9) / 부가 궁극기 충전 효율 +46.4%.
  arcane: { atk: 505, buff: "int", buffVal: 156, sub: "ultEff", subVal: 46.4, uniq: "방출 · 42식 · 척결" },
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

// ===== 무기 시리즈 스킬 =====
// 원작 원문(data/weapons-source, 시리즈 스킬 rank4)을 그대로 등록한다. 값은 DD 최종 적용값(은닉 스케일 없음)
// → 조회창 문구가 실제 발동과 정확히 일치. 표시 문구는 이 표에서 생성한다(weaponSeriesDesc).
// 시리즈 스킬 상시 패시브. el을 주면 오퍼 주력 속성 대신 그 속성에 고정(엠버 전무는 열기 오퍼인데 물리 피해).
export type WPassiveKind =
  | "atk" | "crit" | "critDmg" | "all" | "arts" | "elem" | "battle" | "heal" | "vsBroken" | "stagger" | "energy"
  | "skillAll"    // 모든 스킬 피해(라스트라이트 「방출 · 사무치는 추위」)
  | "physSkill"   // 배틀+궁이 주는 물리 피해(진천우 「어둠 · 청운」)
  | "sub"         // 보조 능력치 +%(안탈·아델리아)
  | "ultEff"      // 궁극기 충전 효율(카뮤 「흐름 · 심판」)
  | "vsDefBreak"  // 방어 불능 적에게 주는 피해(여풍)
  | "vsFreeze"    // 냉기 부착·동결 적에게 주는 피해(에스텔라)
  | "artsInt";    // 오리지늄 아츠 강도(관리자) — 가산값
export type WPassive = { kind: WPassiveKind; v: number; el?: DmgKey };
export type WTrigEvent =
  | "ult" | "battle" | "link"  // 스킬 사용/명중
  | "anomaly"                  // 아츠 이상(부착) 소모
  | "crush" | "physBreak"      // 강타 / 방어 불능 부여(= 띄우기·넘어뜨리기)
  | "attach"                   // 아츠 부착 부여
  | "gauge"                    // 자신 스킬로 스킬 게이지 회복(또는 연타 획득)
  | "heal";                    // 자신 스킬로 치유
export type WTrigKind =
  | "atk" | "all" | "arts" | "elem"  // 증폭
  | "basic"        // 일반 공격 피해(레바테인) — strMul
  | "battleElem"   // 배틀 스킬이 주는 속성 피해(장방이)
  | "allStats"     // 모든 능력치(여풍) — 능력치는 공격력으로만 흐르므로 공격력 버프로 환산
  | "artsInt"      // 오리지늄 아츠 강도(미브)
  | "recvArts"     // 목표가 받는 아츠 피해
  | "recvElem";    // 목표가 받는 해당 속성 피해
export type WTrig = {
  on: WTrigEvent | WTrigEvent[];
  tgt: "self" | "team" | "target";
  k: WTrigKind;
  v: number; dur: number; max?: number;
  el?: DmgKey;          // 버프가 실릴 속성(미지정 시 오퍼 주력 속성)
  whenEl?: Element;     // 발동 조건 속성 — 이 속성의 부착/이상일 때만(관리자 「동결 부여 시 물리 피해+」처럼 조건≠버프)
  perStack?: boolean;   // v × 소모 스택(플루오라이트 「+8.0%×소모 스택」·미브)
  base?: number;        // perStack의 고정 가산분(미브 「14.4% + 4.8%×스택」)
  viaBattle?: boolean;  // 배틀 스킬로 부여했을 때만(라스트라이트·탕탕)
  needAttach?: boolean; // 해당 부착 상태의 적에게일 때만(라스트라이트 연계)
};
export type WeaponFx = { passive: WPassive | WPassive[]; trig?: WTrig | WTrig[] };
// 전무 시리즈 스킬 — data/weapons-source 원문을 rank4(시리즈 스킬 최대 = 식각 4랭크)로 등록.
// 능력치/속성 스킬은 9랭크(강화)지만 시리즈 스킬은 돌파표에서 "1/4" 고정 = 4랭크가 풀. OP_WEAPON_STATS(rank9)와 짝.
// 초→턴은 5초≈1턴. 실시간 전용 문구("0.1초마다 1회")는 턴제에서 의미가 없어 생략.
export const OP_WEAPON_EFFECTS: Record<string, WeaponFx> = {
  // ── 어둠 ──
  // 열기 피해 +25.6% / 궁극기 사용 시 일반 공격 피해 +120.0%, 20초
  laevatain: { passive: { kind: "elem", v: 0.256 }, trig: { on: "ult", tgt: "self", k: "basic", v: 1.20, dur: 4 } },
  // 치명타 확률 +8.0% / 궁 사용 시 아츠 +38.4%, 15초 · 연계 사용 시 아츠 +19.2%, 15초 (독립·미중첩)
  perlica: { passive: { kind: "crit", v: 0.08 }, trig: [
    { on: "ult", tgt: "self", k: "arts", v: 0.384, dur: 3 },
    { on: "link", tgt: "self", k: "arts", v: 0.192, dur: 3 },
  ] },
  // 배틀·궁이 주는 물리 피해 +24.0% / 불균형 상태 적에게 주는 피해 +56.0% (조건부 없음)
  chenqianyu: { passive: [{ kind: "physSkill", v: 0.24 }, { kind: "vsBroken", v: 0.56 }] },

  // ── 억제 ──
  // 물리 피해 +16.0% / 배틀·궁 명중 시 물리 피해 +16.0%, 30초, 최대 3스택 (엠버는 열기 오퍼지만 전무는 물리 → el 고정)
  ember: { passive: { kind: "elem", v: 0.16, el: "physical" }, trig: { on: ["battle", "ult"], tgt: "self", k: "elem", el: "physical", v: 0.16, dur: 6, max: 0.48 } },
  dapan: { passive: { kind: "elem", v: 0.16, el: "physical" }, trig: { on: ["battle", "ult"], tgt: "self", k: "elem", el: "physical", v: 0.16, dur: 6, max: 0.48 } },
  // 아츠 피해 +19.2% / 배틀 사용 시 아츠 +19.2%, 15초 · 연계 사용 시 아츠 +19.2%, 15초 (독립·미중첩)
  avywenna: { passive: { kind: "arts", v: 0.192 }, trig: [
    { on: "battle", tgt: "self", k: "arts", v: 0.192, dur: 3 },
    { on: "link", tgt: "self", k: "arts", v: 0.192, dur: 3 },
  ] },
  // 전기 피해 +25.6% / 배틀로 아츠 이상 소모 시 배틀 전기 피해 +32.0%, 20초, 최대 2스택 · 궁 후 배틀 전기 피해 +64.0%, 25초
  zhuangfangyi: { passive: { kind: "elem", v: 0.256 }, trig: [
    { on: "anomaly", tgt: "self", k: "battleElem", v: 0.32, dur: 4, max: 0.64, viaBattle: true },
    { on: "ult", tgt: "self", k: "battleElem", v: 0.64, dur: 5 },
  ] },

  // ── 고통 ──
  // 아츠 피해 +19.2% / 아츠 이상 소모 후 목표가 받는 해당 속성 피해 +16.0%, 15초
  wulfgard: { passive: { kind: "arts", v: 0.192 }, trig: { on: "anomaly", tgt: "target", k: "recvElem", v: 0.16, dur: 3 } },
  // 냉기 부착·동결 적에게 주는 피해 +12.8% / 동결 소모 후 공격력 +19.2%, 15초
  estella: { passive: { kind: "vsFreeze", v: 0.128 }, trig: { on: "anomaly", tgt: "self", k: "atk", v: 0.192, dur: 3, whenEl: "cryo" } },
  // 보조 능력치 +25.6% / 부식 소모 후 목표가 받는 아츠 피해 +16.0%, 25초
  ardelia: { passive: { kind: "sub", v: 0.256 }, trig: { on: "anomaly", tgt: "target", k: "recvArts", v: 0.16, dur: 5, whenEl: "nature" } },
  // 오리지늄 아츠 강도 +48 / 오리지늄 결정·동결 부여 시 20초 동안 배틀·궁 물리 피해 +57.6%
  endministrator: { passive: { kind: "artsInt", v: 48 }, trig: { on: "anomaly", tgt: "self", k: "elem", whenEl: "cryo", el: "physical", v: 0.576, dur: 4 } },

  // ── 흐름 ──
  // 공격력 +16.0% / 자신 스킬로 스킬 게이지 회복 or 연타 획득 후 팀 공격력 +8.0%, 20초, 최대 2스택
  akekuri: { passive: { kind: "atk", v: 0.16 }, trig: { on: "gauge", tgt: "team", k: "atk", v: 0.08, dur: 4, max: 0.16 } },
  alesh: { passive: { kind: "atk", v: 0.16 }, trig: { on: "gauge", tgt: "team", k: "atk", v: 0.08, dur: 4, max: 0.16 } },
  arclight: { passive: { kind: "atk", v: 0.16 }, trig: { on: "gauge", tgt: "team", k: "atk", v: 0.08, dur: 4, max: 0.16 } },
  pogranichnik: { passive: { kind: "atk", v: 0.16 }, trig: { on: "gauge", tgt: "team", k: "atk", v: 0.08, dur: 4, max: 0.16 } },
  // 궁극기 충전 효율 +28.8% / 게이지 회복 후 팀 공격력 +9.6%, 20초 · 열기 부착 부여 시 팀 열기 피해 +9.6%, 20초
  camu: { passive: { kind: "ultEff", v: 0.288 }, trig: [
    { on: "gauge", tgt: "team", k: "atk", v: 0.096, dur: 4 },
    { on: "attach", tgt: "team", k: "elem", el: "heat", v: 0.096, dur: 4 },
  ] },

  // ── 골절 ──
  // 냉기 피해 +25.6% / 배틀·연계가 치명타 피해를 준 후 냉기 피해 +22.4%, 30초, 최대 3스택
  yvonne: { passive: { kind: "elem", v: 0.256 }, trig: { on: ["battle", "link"], tgt: "self", k: "elem", v: 0.224, dur: 6, max: 0.672 } },
  // 공격력 +25.6% / 치명타 후 늑대의 피 1스택(물리·열기 +1.6%, 최대 16) — 16스택 시 추가 +38.4% 20초 후 초기화
  rossi: { passive: { kind: "atk", v: 0.256 }, trig: [
    { on: ["battle", "link", "ult"], tgt: "self", k: "elem", el: "physical", v: 0.016, dur: 6, max: 0.256 },
    { on: ["battle", "link", "ult"], tgt: "self", k: "elem", el: "heat", v: 0.016, dur: 6, max: 0.256 },
  ] },

  // ── 방출 ──
  // 모든 스킬 피해 +32.0% / 배틀로 냉기 부착 시 냉기 +16.0%, 15초 · 냉기 부착 적에게 연계 시 냉기 +32.0%, 15초
  lastrite: { passive: { kind: "skillAll", v: 0.32 }, trig: [
    { on: "attach", tgt: "self", k: "elem", el: "cryo", v: 0.16, dur: 3, viaBattle: true },
    { on: "link", tgt: "self", k: "elem", el: "cryo", v: 0.32, dur: 3, needAttach: true },
  ] },
  // 냉기 피해 +25.6% / 배틀·궁으로 냉기 부착 시 냉기 +32.0%, 20초 · 아츠 취약 부여 시 목표 받는 아츠 +9.6%, 20초
  tangtang: { passive: { kind: "elem", v: 0.256 }, trig: [
    { on: "attach", tgt: "self", k: "elem", el: "cryo", v: 0.32, dur: 4 },
    { on: "anomaly", tgt: "target", k: "recvArts", v: 0.096, dur: 4 },
  ] },
  // 보조 능력치 +16.0% / 아츠 폭발 피해 시 목표가 받는 아츠 피해 +14.4%, 15초
  // (「아츠 폭발」은 우리 엔진에 이벤트가 없어 아츠 이상 소모로 대응 — 원작에서 폭발은 이상의 발현이다)
  antal: { passive: { kind: "sub", v: 0.16 }, trig: { on: "anomaly", tgt: "target", k: "recvArts", v: 0.144, dur: 3 } },
  // 공격력 +8.0% / 아츠 부착 소모 후 자연 피해 +[8.0% × 소모 스택], 20초
  fluorite: { passive: { kind: "atk", v: 0.08 }, trig: { on: "anomaly", tgt: "self", k: "elem", v: 0.08, dur: 4, perStack: true, max: 0.32 } },

  // ── 추격 ──
  // 자연 피해 +25.6% / 띄우기 후 팀 아츠 +19.2%, 15초. (「띄우기 적 수 비례 +5.6%, 최대 +16.8%」는 미구현)
  gilberta: { passive: { kind: "elem", v: 0.256 }, trig: { on: "physBreak", tgt: "team", k: "arts", v: 0.192, dur: 3 } },

  // ── 효율 / 의료 ──
  // 치유 효율 +16.0% / 비호 대상 피격 후 [134+의지×1] 회복 — 회복 훅이 없어 상시 치유 효율로만 반영(note)
  snowshine: { passive: { kind: "heal", v: 0.16 } },
  catcher: { passive: { kind: "heal", v: 0.16 } },
  // 치유 효율 +16.0% / 자신 스킬로 치유 후 팀 공격력 +14.4%, 15초
  xaihi: { passive: { kind: "heal", v: 0.16 }, trig: { on: "heal", tgt: "team", k: "atk", v: 0.144, dur: 3 } },
  // 방어 불능 적에게 주는 피해 +32.0% / 배틀로 방불 부여 시 모든 능력치 +12.8%, 15초 · 물리 취약 부여 시 +12.8%, 15초
  lifeng: { passive: { kind: "vsDefBreak", v: 0.32 }, trig: { on: "physBreak", tgt: "self", k: "allStats", v: 0.128, dur: 3 } },

  // ── 기예 ──
  // 물리 피해 +25.6% / 물리 취약 부여 시 아츠 강도 +48, 20초 · 강타 시 물리 피해 +[14.4% + 4.8%×소모 스택], 30초
  mifu: { passive: { kind: "elem", v: 0.256, el: "physical" }, trig: [
    { on: "physBreak", tgt: "self", k: "artsInt", v: 48, dur: 4 },
    { on: "crush", tgt: "self", k: "elem", el: "physical", v: 0.048, base: 0.144, dur: 6, perStack: true },
  ] },
};
// 오퍼 속성(시리즈 문구·elem 적용용) — roster 순환 import 회피 위해 로컬 보관.
const OP_ELEM: Record<string, "physical" | "heat" | "electric" | "cryo" | "nature"> = {
  laevatain: "heat", rossi: "heat", akekuri: "heat", camu: "heat", ember: "heat", wulfgard: "heat",
  estella: "cryo", alesh: "cryo", snowshine: "cryo", xaihi: "cryo", tangtang: "cryo", lastrite: "cryo", yvonne: "cryo",
  arclight: "electric", antal: "electric", perlica: "electric", avywenna: "electric", zhuangfangyi: "electric",
  ardelia: "nature", gilberta: "nature", fluorite: "nature",
  chenqianyu: "physical", lifeng: "physical", endministrator: "physical", mifu: "physical", pogranichnik: "physical", catcher: "physical", dapan: "physical",
};

const SUB_KO: Record<string, string> = { atk: "공격력", crit: "치명 확률", hp: "최대 생명력", heal: "치유 효율", energy: "궁충 효율", arts: "아츠 피해", elem: "아츠 피해", phys: "물리 피해", skill: "스킬 피해", vsbroken: "방불 적 피해", other: "특수" };
export const weaponEffectText = (id: string): string => { const w = OP_WEAPON_STATS[id]; if (!w) return ""; return `${SUB_KO[w.sub] ?? w.sub} +${w.subVal}${w.subFlat ? "" : "%"}`; };

// 무기 시리즈 이름 — 실제 무기 소스(어둠·울부짖는 불길 등). OP_WEAPON_SERIES(weapon-series.ts).
export const weaponSeriesName = (id: string): string => OP_WEAPON_SERIES[id]?.name ?? OP_WEAPON_STATS[id]?.uniq ?? "";
// 무기 시리즈 설명 — OP_WEAPON_EFFECTS에서 생성(표시=실제 발동). 상시 패시브 + 조건부 턴 트리거.
const ELEM_KO2: Record<string, string> = { heat: "열기", electric: "전기", cryo: "냉기", nature: "자연", physical: "물리" };
const pctW = (v: number) => `${+(v * 100).toFixed(1)}%`;
function passiveText(p: WPassive, el: string): string {
  const e = ELEM_KO2[(p.el as string) ?? el] ?? "물리";
  switch (p.kind) {
    case "atk": return `공격력 +${pctW(p.v)}`;
    case "crit": return `치명타 확률 +${pctW(p.v)}`;
    case "critDmg": return `치명타 피해 +${pctW(p.v)}`;
    case "all": return `전 피해 +${pctW(p.v)}`;
    case "arts": return `아츠 피해 +${pctW(p.v)}`;
    case "elem": return `${e} 피해 +${pctW(p.v)}`;
    case "battle": return `배틀 스킬 피해 +${pctW(p.v)}`;
    case "heal": return `치유 효율 +${pctW(p.v)}`;
    case "vsBroken": return `불균형 상태 적에게 주는 피해 +${pctW(p.v)}`;
    case "stagger": return `불균형 누적 +${pctW(p.v)}`;
    case "energy": return `전투 시작 시 궁극기 게이지 +${p.v}`;
    case "skillAll": return `모든 스킬 피해 +${pctW(p.v)}`;
    case "physSkill": return `배틀 스킬과 궁극기가 주는 물리 피해 +${pctW(p.v)}`;
    case "sub": return `보조 능력치 +${pctW(p.v)}`;
    case "ultEff": return `궁극기 충전 효율 +${pctW(p.v)}`;
    case "vsDefBreak": return `방어 불능 상태 적에게 주는 피해 +${pctW(p.v)}`;
    case "vsFreeze": return `냉기 부착·동결 상태 적에게 주는 피해 +${pctW(p.v)}`;
    case "artsInt": return `오리지늄 아츠 강도 +${p.v}`;
  }
}
const WEV_KO: Record<WTrigEvent, string> = {
  ult: "궁극기 사용", battle: "배틀 스킬 사용", link: "연계 스킬 사용",
  anomaly: "아츠 이상 소모", crush: "강타 명중", physBreak: "방어 불능 부여",
  attach: "아츠 부착 부여", gauge: "스킬 게이지 회복", heal: "치유",
};
function trigText(t: WTrig, el: string): string {
  const e = ELEM_KO2[(t.el as string) ?? el] ?? "물리";
  const ev = (Array.isArray(t.on) ? t.on : [t.on]).map((o) => WEV_KO[o]).join(" · ");
  const tgt = t.tgt === "team" ? "팀 전체 " : t.tgt === "target" ? "목표가 받는 " : "";
  const k =
    t.k === "atk" ? "공격력" : t.k === "arts" || t.k === "recvArts" ? "아츠 피해" :
    t.k === "elem" || t.k === "recvElem" ? `${e} 피해` : t.k === "basic" ? "일반 공격 피해" :
    t.k === "battleElem" ? `배틀 스킬이 주는 ${e} 피해` : t.k === "allStats" ? "모든 능력치" :
    t.k === "artsInt" ? "오리지늄 아츠 강도" : "피해";
  const amt = t.k === "artsInt" ? `+${t.v}` : t.perStack ? `+[${t.base ? pctW(t.base) + "＋" : ""}${pctW(t.v)}×소모 스택]` : `+${pctW(t.v)}`;
  const stack = t.max && !t.perStack ? ` (최대 ${Math.round(t.max / t.v)}스택)` : "";
  const cond = t.viaBattle ? "배틀 스킬로 " : t.needAttach ? `${e} 부착 상태의 적에게 ` : "";
  return `${cond}${ev} 후 ${tgt}${k} ${amt}, ${t.dur}턴 지속${stack}`;
}
export const weaponSeriesDesc = (id: string): string => {
  const fx = OP_WEAPON_EFFECTS[id];
  if (!fx) return "";
  const el = OP_ELEM[id] ?? "physical";
  const ps = (Array.isArray(fx.passive) ? fx.passive : [fx.passive]).map((p) => passiveText(p, el));
  const ts = fx.trig ? (Array.isArray(fx.trig) ? fx.trig : [fx.trig]).map((t) => trigText(t, el)) : [];
  return [...ps, ...ts].join(". ") + ".";
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
  else if (w.sub === "ultEff") u.ultEffMul = +((u.ultEffMul ?? 1) * (1 + v)).toFixed(3); // 궁극기 충전 효율(42식 · 척결)
  // 4) 시리즈 스킬 — 상시 패시브(원문 rank4 최종값, 은닉 스케일 없음). 조건부는 weaponTrigger에서.
  const fx = OP_WEAPON_EFFECTS[u.id];
  if (fx && g) {
    for (const p of Array.isArray(fx.passive) ? fx.passive : [fx.passive]) {
      const pel = (p.el ?? u.opElement) as DmgKey | undefined;
      switch (p.kind) {
        case "atk": u.attack = Math.round(u.attack * (1 + p.v)); break;
        case "crit": u.critRate += p.v; break;
        case "critDmg": u.critDmg += p.v; break;
        case "all": g.kindDmg.all = (g.kindDmg.all ?? 0) + p.v; break;
        case "battle": g.kindDmg.battle = (g.kindDmg.battle ?? 0) + p.v; break;
        case "arts": g.elemDmg.all = (g.elemDmg.all ?? 0) + p.v; break;
        case "elem": if (pel && pel !== "physical" && pel !== "all" && pel !== "arts") g.elemDmg[pel] = (g.elemDmg[pel] ?? 0) + p.v; else g.kindDmg.all = (g.kindDmg.all ?? 0) + p.v; break;
        case "vsBroken": g.vsBroken += p.v; break;
        case "stagger": g.staggerMul += p.v; break;
        case "heal": u.healRecv = +((u.healRecv ?? 1) * (1 + p.v)).toFixed(2); break;
        case "energy": u.ultCharge = Math.min(u.ultCost, u.ultCharge + p.v); break;
        // 모든 스킬 피해(라스트라이트) — 평타를 뺀 배틀·연계·궁 전부.
        case "skillAll": for (const k of ["battle", "link", "ult"] as const) g.kindDmg[k] = (g.kindDmg[k] ?? 0) + p.v; break;
        // 배틀+궁이 주는 물리 피해(진천우) — 원문 그대로 두 종류에만.
        case "physSkill": for (const k of ["battle", "ult"] as const) g.kindDmg[k] = (g.kindDmg[k] ?? 0) + p.v; break;
        // 보조 능력치 +%(안탈·아델리아) — 원작 공식대로 부옵을 올려 공격력에 반영.
        case "sub": if (u.attrs) {
          const subKey = (OP_MAINSUB[u.id]?.[1] ?? "wil") as "str" | "agi" | "int" | "wil";
          const b0 = u.attrs;
          const next = { ...b0, [subKey]: Math.round(b0[subKey] * (1 + p.v)) };
          u.attack = Math.round(u.attack * (attrBonusOf(u.id, next) / attrBonusOf(u.id, b0)));
          u.attrs = next; applyAttrs(u);
        } break;
        case "ultEff": u.ultEffMul = +((u.ultEffMul ?? 1) * (1 + p.v)).toFixed(3); break;
        case "vsDefBreak": g.vsBroken += p.v; break;               // 방불 = 우리 엔진의 불균형 취급
        case "vsFreeze": g.elemDmg.cryo = (g.elemDmg.cryo ?? 0) + p.v; // 냉기 부착·동결 적 한정 → 냉기 피해로 근사
          break;
        case "artsInt": u.artsStr = (u.artsStr ?? 0) + p.v; break;
      }
    }
  }
  return t;
}

// 무기 시리즈 조건부 트리거 — combat.ts의 스킬(battle/link/ult)·이상 소모(anomaly)·강타(crush)·방불(physBreak)
// ·부착 부여(attach)·게이지 회복(gauge)·치유(heal) 훅에서 호출. 원문 문구 = 실제 발동.
// ctx: 이벤트 부가 정보(목표·소모 스택 수·부여 수단).
export type WTrigCtx = { target?: DDUnit; stacks?: number; viaBattle?: boolean; el?: Element };
// 발동 계수(오퍼id → 실제 적용 횟수). 문구는 맞는데 코드가 안 도는 사태를 잡기 위한 계측 — 밸런스 심에서 읽는다.
export const W_FIRED: Record<string, number> = {};
export function weaponTrigger(self: DDUnit, event: string, allies?: DDUnit[], ctx?: WTrigCtx): void {
  const fx = OP_WEAPON_EFFECTS[self.id];
  if (!fx?.trig) return;
  const ev = event.startsWith("anomaly") ? "anomaly" : event.startsWith("attach") ? "attach" : event;
  const evEl = (event.includes(":") ? event.split(":")[1] : undefined) as Element | undefined;
  const seriesName = weaponSeriesName(self.id);
  for (const t of Array.isArray(fx.trig) ? fx.trig : [fx.trig]) {
    const ons = Array.isArray(t.on) ? t.on : [t.on];
    if (!ons.includes(ev as WTrigEvent)) continue;
    // 조건: 부여 수단(배틀 한정) / 해당 속성 부착 상태의 적 / 이벤트 속성 일치
    if (t.viaBattle && !ctx?.viaBattle) continue;
    if (t.whenEl && evEl && t.whenEl !== evEl) continue;               // 조건 속성 지정 → 그 속성의 부착/이상일 때만
    const el = (t.el ?? evEl ?? self.opElement ?? "physical") as DmgKey;
    if (t.needAttach && !(ctx?.target && ctx.target.arts[el as Element] > 0)) continue;
    const v = t.perStack ? (t.base ?? 0) + t.v * Math.max(1, ctx?.stacks ?? 1) : t.v;
    const cap = t.max ?? v;
    const prev = pushSrc({ by: self.name, via: seriesName, kind: "weapon" }); // 출처를 무기 시리즈로 기록
    const apply = (u: DDUnit) => {
      switch (t.k) {
        case "atk": case "allStats": // 능력치는 공격력으로만 흐르므로 「모든 능력치 +x%」 = 공격력 버프
          u.atkBuff = Math.min((u.atkBuff || 0) + v, cap); setTimer(u, "atkBuff", t.dur); break;
        case "basic": // 일반 공격 피해(레바테인 「궁 후 평타 +120%」) — strMul이 평타 배율
          u.strMul = 1 + Math.min(v, cap); setTimer(u, "strMul", t.dur); break;
        case "battleElem": // 배틀 스킬이 주는 속성 피해(장방이) — 배틀 한정 증폭
          u.battleAmp = Math.min((u.battleAmp || 0) + v, cap); setTimer(u, "battleAmp", t.dur); break;
        case "artsInt": // 오리지늄 아츠 강도(미브) — 부착/이상 위력. 만료 시 상시값으로 복귀
          u.artsStrBase ??= u.artsStr ?? 0;
          u.artsStr = u.artsStrBase + v; setTimer(u, "artsStrW", t.dur); break;
        case "recvArts": bumpVuln(u, "arts", v, t.dur); break;   // 목표가 받는 아츠 피해
        case "recvElem": bumpVuln(u, el, v, t.dur); break;       // 목표가 받는 해당 속성 피해
        default: { // arts / elem / all — 증폭. amp는 physical도 정식 키(tierSum이 집계)라 접지 않는다.
          const key: DmgKey = t.k === "arts" ? "arts" : t.k === "all" ? "all" : el;
          u.amp[key] = Math.min((u.amp[key] || 0) + v, cap); setTimer(u, "amp:" + key, t.dur);
        }
      }
    };
    if (t.tgt === "target") { if (ctx?.target) apply(ctx.target); else { popSrc(prev); continue; } }
    else if (t.tgt === "team" && allies) allies.forEach(apply);
    else apply(self);
    W_FIRED[self.id] = (W_FIRED[self.id] ?? 0) + 1;
    popSrc(prev);
  }
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
