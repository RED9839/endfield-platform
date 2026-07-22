// ===== DD류 물리 4인 + 적 정의 (프로토타입) =====
// 스킬은 위키 매핑. 사용 요구(requires)가 카드 모델에서 깨지던 "연계 조건"을 DD류에선 자연 흡수.
import { setApplyAttrs, setAttrBonus, setMainSub } from "./gear";
import { bumpVuln, bumpRecv, vulnFor, setTimer, applyBuff, ELEMENTS, attrResists, ATTR_AVG, attrBonus, hasLinkEvent, type DDClass, type DDSkill, type DDUnit, type Element, arcaneForm } from "./combat";
import { promoMult, skillMult, skillUtilMult, DEFAULT_PROGRESS, type OpProgress } from "./progress";
import { ENEMY_TRAITS } from "./enemy-traits";

export const SKILLS: Record<string, DDSkill[]> = {
  // 진천우: 최고 방어 불능 누적 + 고계수 단일 누커(보스 삭제기). 빠른 선딜(차지 캔슬)·평타 속도.
  // 재능: 칼날 베기(스킬마다 공격력 +8%, 최대 5스택=+40%, rampAtk) · 흐름 끊기(차지 끊기 추가 불균형, 차지 미모델).
  chenqianyu: [
    // 귀궁우(배틀 169%, 불균형 10): 올려치기 띄우기. 자체 방어 불능 빌드.
    { id: "cqy-b", name: "귀궁우", kind: "battle", fromPos: [1, 2, 3, 4], target: "single-front", power: 3.04, mst: [3.25, 3.5, 3.8], element: "physical", staggerVal: 10, anomaly: "launch", note: "올려치기 + 띄우기(방어 불능 누적)" },
    // 견천하(연계 120%, 쿨 16초): 방어 불능 적일 때. 관통 돌진(경로 모든 적) 띄우기. 게이지 무소모.
    { id: "cqy-l", name: "견천하", kind: "link", fromPos: [1, 2, 3, 4], target: "row", power: 2.16, mst: [2.31, 2.49, 2.7], element: "physical", staggerVal: 10, cooldown: 3, anomaly: "launch", requires: (t) => !!t && t.physBreak > 0, requiresText: "방어 불능 적", note: "관통 돌진·띄우기(원문 무조건)" },
    // 예풍상(궁 671%=36×6+455, 불균형 35, 게이지 70): 7단 단일 누킹. 보스 삭제기(현 최고 단일 계수).
    { id: "cqy-u", name: "예풍상", kind: "ult", fromPos: [1, 2], target: "single-lowhp", power: 12.08, mst: [12.91, 13.93, 15.1], hits: [0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 4.55], element: "physical", staggerVal: 35, selfUlt: true, note: "7단 단일 대량 물리" },
  ],
  // 여풍: 물리 파티 올라운더(가드). 넘어뜨리기로 방어 불능 빌드 + 물리취약(딜버프) + 복마 추가타 + 연타 궁 폭딜.
  // 재능: 돈오(지능+의지→공격력, attack에 baked) · 복마(넘어뜨리기마다 +공격력 100% 물리, selfPhysBonus).
  lifeng: [
    // 신체 정화(배틀 38+38+119%=1.95, 불균형 10): 전방 광역 + 넘어뜨리기. 방어 불능 없는 적에게만 물리취약 5%(위키 조건).
    { id: "lf-b", name: "신체 정화", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 3.52, mst: [3.75, 4.05, 4.4], hits: [0.38, 0.38, 1.19], element: "physical", staggerVal: 10, anomaly: "knockdown", selfPhysBonus: 1.0,
      apply: (t) => { if (t.physBreak === 0) bumpVuln(t, "physical", 0.05); }, note: "광역 넘어뜨리기+물리취약(방어 불능 0일 때)+복마" },
    // 분노의 형상(연계 47+167%=2.14, 불균형 10, 쿨 16초): 물리취약/갑옷파괴 적 강일 시. 20초 연타 획득.
    { id: "lf-l", name: "분노의 형상", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 3.84, mst: [4.11, 4.43, 4.8], hits: [0.47, 1.67], element: "physical", staggerVal: 10, cooldown: 3,
      requires: (t) => !!t && (vulnFor(t, "physical") > 0 || t.statuses.includes("armor-break")), requiresText: "물리 취약 또는 갑옷 파괴된 적", apply: (_t, self) => { self.multiHit = Math.min(4, self.multiHit + 1); }, note: "연타 획득" },
    // 움직이지 않는 마음(궁 178+178%=3.56, 불균형 15): 광역 넘어뜨리기 광역 몰이. 연타 소모 추가 267%(엔진 MH_ULT). 복마.
    { id: "lf-u", name: "움직이지 않는 마음", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 6.4, mst: [6.84, 7.38, 8], hits: [1.78, 1.78], element: "physical", staggerVal: 15, anomaly: "knockdown", selfPhysBonus: 1.0, selfUlt: true, note: "광역 넘어뜨리기 광역 몰이 + 연타 소모 폭딜 + 복마" },
  ],
  // 관리자: 페이오프(가드의 탈을 쓴 물리 스트라이커). 자체 방어 불능 부여 전무 → 팀이 쌓은 방어 불능을 강타로 터트림.
  // 봉인(연계, 아군 연계 후 사용)으로 오리지늄 결정 부착 → 강타/궁극/물리이상으로 결정 파괴(추가 물리) + 본질 붕괴(+30%).
  // 재능: 본질 붕괴(결정 소모 시 공격력 +30%, 엔진) · 현실 정지(결정 부착 적 물리 +20%, 엔진).
  endministrator: [
    // 구성 시퀀스(배틀 156%, 불균형 10): 강타. 방어 불능 스택 소모 대량 물리(아츠 강도=공격력 비례, 연타 미적용).
    { id: "adm-b", name: "구성 시퀀스", kind: "battle", fromPos: [1, 2, 3, 4], target: "row", power: 2.8, mst: [3, 3.23, 3.5], element: "physical", staggerVal: 10, anomaly: "crush", note: "강타: 방어 불능 소모 대량 물리(주력기)" },
    // 봉인 시퀀스(연계 45%, 불균형 10, 결정 파괴 178%): 아군 연계가 피해를 줄 때만 사용. 결정 부착·봉인. 자체 방어 불능 부여 없음.
    { id: "adm-l", name: "봉인 시퀀스", kind: "link", fromPos: [1, 2, 3, 4], target: "single-front", power: 0.8, mst: [0.86, 0.93, 1], element: "physical", staggerVal: 10, crystal: true, cooldown: 3,
      requires: (_t, self, s) => !!s.lastLinkAlly && s.lastLinkAlly !== self.id, requiresText: "다른 아군 연계 피해 후", note: "오리지늄 결정 부착·봉인" },
    // 폭격 시퀀스(궁 356% + 결정 파괴 267%, 불균형 25): 광역 대량 물리 + 결정 파괴 추가 물리(엔진).
    { id: "adm-u", name: "폭격 시퀀스", kind: "ult", fromPos: [1, 2, 3, 4], target: "all", power: 6.4, mst: [6.84, 7.38, 8], element: "physical", staggerVal: 25, selfUlt: true, note: "광역 대량 물리 + 결정 파괴" },
  ],
  // 에스텔라: 냉기/가드. 냉기 부착 + 동결→쇄빙(강제 띄우기) + 물리취약 + 방어 불능. 동결 파트너 의존(자체 동결 불가).
  // 재능: 공감(쇄빙 시 게이지 반환 +15, 엔진) · 이유 있는 게으름(냉기 부착 면역, 엔진 cryoImmune). 주스탯 의지.
  estella: [
    // 서스테인(배틀 150%, 불균형 10): 일직선 냉기 + 냉기 부착.
    { id: "est-b", name: "서스테인", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 2.8, mst: [3, 3.23, 3.5], element: "cryo", attach: "cryo", staggerVal: 10, note: "일직선 냉기 + 냉기 부착(실측 Lv1 156%)" },
    // 디스토션(연계 동결적 280%, 물취 10%, 쿨 18초): 동결 적일 때. 강제 띄우기(물리) → 동결 적이면 쇄빙(엔진) + 물리취약.
    { id: "est-l", name: "디스토션", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 5.04, mst: [5.39, 5.81, 6.3], element: "physical", staggerVal: 10, cooldown: 4, anomaly: "launch",
      // 원문: 게이트 없음. "동결 적 명중 시 추가 피해 + 물리 취약"은 조건이 아니라 보너스다.
      requires: (t) => !!t && t.frozen > 0, requiresText: "동결 적", apply: (t) => { if (t.frozen > 0) bumpVuln(t, "physical", 0.1); }, note: "강제 띄우기 → 쇄빙 + 물리취약" },
    // 트레몰로(궁 489%, 불균형 15, 게이지 70): 원형 광역 물리 + (물리취약 적)강제 띄우기.
    { id: "est-u", name: "트레몰로", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 8.8, mst: [9.41, 10.14, 11], element: "physical", staggerVal: 15, anomaly: "launch", selfUlt: true, note: "원형 광역 + 강제 띄우기" },
  ],
  // 로시: 물리/열기 하이브리드 가드(★6). 띄우기 방어 불능 + 열기 부착 + 늑대의 발톱(DoT·취약) + 치명타 빌드.
  // ⚠ 치명타·회복(끓어오르는 피) 미모델 → 치명 버프는 atkBuff 근사. 방어 불능+아츠부착 이중 조건이라 하이브리드 파티 필요.
  rossi: [
    // 붉은색의 그림자(배틀 85%, 불균형 5): 돌진 띄우기. 방어 불능 적이면 진주(열기) + 절흔(늑대의 발톱: 지속피해+물리/열기 취약).
    { id: "ros-b", name: "붉은색의 그림자", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 3.84, mst: [4.1, 4.42, 4.8], hits: [0.85, 1.28], element: "physical", staggerVal: 5, anomaly: "launch",
      // 진주 조건 = "이미 방어 불능 보유"(띄우기 전). 띄우기가 항상 +1이므로 post>1 ⟺ pre≥1.
      apply: (t, self) => { if (t.physBreak > 1) { t.dot = Math.round(self.attack * (1 + (self.atkBuff || 0)) * 0.3); setTimer(t, "dot", 5); bumpVuln(t, "physical", 0.12); bumpVuln(t, "heat", 0.12); } },
      note: "돌진 띄우기 + (이미 방어 불능 적)진주·늑대의 발톱(지속피해 30%/턴 + 물리/열기 취약 12%)" },
    // 그림자가 타오르는 순간(연계 67+133%+소모비례 80%/스택, 쿨 15초): 방어 불능+아츠부착 적. 아츠 소모 물리·띄우기 + 치명 버프.
    // 1단 67% + 2단 133%. 아츠 소모 비례(스택당 +80%)와 치확/치피는 combat.ts 엔진 훅에서 — apply는 raw를 못 건드림.
    { id: "ros-l", name: "그림자가 타오르는 순간", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.2, mst: [1.28, 1.38, 1.5], element: "physical", staggerVal: 5, cooldown: 3, anomaly: "launch",
      requires: (t) => !!t && t.physBreak > 0 && ELEMENTS.some((e) => t.arts[e] > 0), requiresText: "방어 불능 + 아츠 부착된 적", note: "아츠 소모 물리·띄우기 + 치명 버프(치확 30%/치피 100%)" },
    // 기습 '날카로운 발톱'(궁 275+111+333=719%, 불균형 25, 게이지 110): 다단 열기 누킹 + 열기 부착.
    // 실측 Lv9: 찌르기 475%(성장비 ×1.727 예외) + 베기1 200% + 베기2 600% = 1275% → hits=Lv9/180.
    { id: "ros-u", name: "기습 '날카로운 발톱'", kind: "ult", fromPos: [1, 2], target: "single-front", power: 12.74, mst: [13.81, 14.73, 16], hits: [2.64, 1.11, 3.33], element: "heat", attach: "heat", staggerVal: 25, selfUlt: true, note: "다단 열기 단일 누킹 + 열기 부착(실측 Lv9 475+200+600)" },
  ],
  // 미브: 물리/양손검 가드. 청파 삼형(단운→추형→개천 3스탠스) + 물리취약 연계 + 방어 불능 부여 궁.
  // 재능: 냉정(개천이 물취/불균형 적에 ×1.2, vsWeak) · 분노(연계 후 최대 HP 30% 보호막, 엔진). 자체 방어 불능 부여는 궁뿐 → 팀 방어 불능 보조 필요.
  mifu: [
    // 단운(배틀, 게이지 100·환불 50): 포승줄 광역 몰이. → 추형(스탠스 1) 전환.
    { id: "mf-b1", name: "청파 삼형·단운", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 1.2, mst: [1.28, 1.38, 1.5], element: "physical", staggerVal: 5, gaugeRefund: 50, setStanceTo: 1, note: "광역 몰이 + 추형 전환(게이지 50 반환)" },
    // 추형(배틀, 게이지 50, 스탠스 1 요구): 강타. 방어 불능 3+ 소모 시 → 개천(스탠스 2).
    { id: "mf-b2", name: "청파 삼형·추형", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.6, mst: [1.72, 1.85, 2], element: "physical", staggerVal: 5, gaugeCost: 50, requiresStance: 1, anomaly: "crush", stanceFromCrush: true, note: "강타 + (방어 불능 3+ 소모)개천 전환" },
    // 개천(배틀, 게이지 50, 스탠스 2 요구): 주력 딜(강타 간주). 냉정: 물취/불균형 적 ×1.2.
    // 개천은 Lv1 400%→Lv9 528%로 성장비 ×1.32(타 스킬 ×1.8 예외, warfarin 실측). power=528/180이라야 ×1.8 적용 시 실측 Lv9.
    { id: "mf-b3", name: "청파 삼형·개천", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 5.28, mst: [5.48, 5.72, 6], element: "physical", staggerVal: 10, gaugeCost: 50, requiresStance: 2, vsWeak: 0.2, countsAsCrush: true, setStanceTo: 0, note: "주력 딜(강타 간주) · 실측 Lv9 528%·M3 600% · 냉정: 물취/불균형 ×1.2 · 사용 후 단운으로" },
    // 후회 없는 주먹(연계 111%, 쿨 20초): 방어 불능 3+ 적. 물리취약 + 추형 전환.
    { id: "mf-l", name: "후회 없는 주먹", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2, mst: [2.14, 2.3, 2.5], element: "physical", staggerVal: 10, cooldown: 4, setStanceTo: 1,
      requires: (t) => !!t && t.physBreak >= 3, requiresText: "방어 불능 3스택 이상인 적", apply: (t) => bumpVuln(t, "physical", 0.05), note: "물리취약 + 추형 전환" },
    // 절심(궁 311%, 게이지 80): 강제 띄우기+넘어뜨리기(방어 불능 부여) + 추형 전환.
    { id: "mf-u", name: "절심", kind: "ult", fromPos: [1, 2, 3], target: "single-front", power: 5.6, mst: [5.99, 6.45, 7], element: "physical", staggerVal: 20, selfUlt: true, anomaly: "knockdown", setStanceTo: 1, note: "방어 불능 부여(넘어뜨리기) + 추형 전환" },
  ],
  // 카뮤: 열기/장병기 뱅가드(★6 한정, "다 떡칠"). 열기 부착+취약+허약 + 게이지 + 연타 + 회복 + 핏빛날개(배회 디버프).
  // 재능: 죄를 쫓는 자(연계가 날개 적 명중 시 회복+연타) · 혈류 소생(자기 회복 시 팀 열기 증폭). 주스탯 민첩.
  camu: [
    // 사르는 불꽃(배틀 89%, 불균형 10): 열기 + 열기 부착. 핏빛 날개 배회 → 허약 5% + 열기취약 5% + 날개 마킹.
    { id: "camu-b", name: "사르는 불꽃", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.6, mst: [1.72, 1.85, 2], hits: [0.45, 0.44], element: "heat", attach: "heat", staggerVal: 10,
      requires: (_t, self) => !((self.timers.chase || 0) > 0), requiresText: "추적 상태가 아닐 때", // 궁 후 15초는 배틀이 추적으로 "교체"됨
      apply: (t) => { applyBuff(t, "weaken", 0.05); bumpVuln(t, "heat", 0.05); if (!t.statuses.includes("wing")) t.statuses.push("wing"); setTimer(t, "wing", 8); }, note: "열기 부착 + 허약/열기취약 + 핏빛 날개" },
    // 영혼의 가시(연계 133%, 쿨 20초): 열기 부착 소모/흡수 후. 게이지 16. 죄를 쫓는 자(날개 적 → 회복+연타).
    { id: "camu-l", name: "영혼의 가시", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.4, mst: [2.56, 2.76, 3], element: "heat", staggerVal: 10, cooldown: 4, gaugeGain: 18,
      requires: (_t, _s, st) => !!st.anomalyConsumed, requiresText: "열기 부착 소모·흡수 후", note: "열기 부착 소모 후 발동 · 핏빛 날개 적 명중 시 회복 + 연타 획득" },
    // 추적(궁 후 배틀 슬롯 교체, 게이지 무소모): 궁 「선혈의 비」 후 15초(≈3턴) 배틀이 이걸로 교체(연계 아님 — 원작 "다음 배틀=추적").
    // kind:"battle" + gaugeCost:0 → 배틀 슬롯에서 camu-b와 교체 표시(상호배타), 무소모. gaugeGain 32로 뱅가드 수급.
    { id: "camu-chase", name: "추적", kind: "battle", gaugeCost: 0, fromPos: [1, 2, 3], target: "single-front", power: 4, mst: [4.28, 4.61, 5], element: "heat", staggerVal: 20, gaugeGain: 32,
      requires: (_t, self) => (self.timers.chase || 0) > 0, requiresText: "추적 상태(궁 후 3턴)", note: "궁 후 배틀 교체 · 게이지 무소모 + 32 회복" },
    // 선혈의 비(궁 267%, 게이지 130): 광역 열기 + 열기 부착 + 게이지. 사용 후 추적 상태 15초(≈3턴).
    { id: "camu-u", name: "선혈의 비", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 4.8, mst: [5.13, 5.53, 6], element: "heat", staggerVal: 15, attach: "heat", selfUlt: true, gaugeGain: 32,
      apply: (_t, self) => { setTimer(self, "chase", 3); }, note: "광역 열기 부착 + 게이지 · 이후 3턴 배틀→추적 교체" },
  ],
  // 아케쿠리: 열기/한손검 뱅가드(★4, 탈4성 범용). 속성 무관 게이지 수급 — 불균형 조건 연계 + 무딜 궁(게이지 대량 회복) + 연타.
  // 재능: 승리의 함성(연계 게이지 +지능→장비등급) · 몰입의 시간(궁 지속 중 연타). 열기 부착도 보유.
  akekuri: [
    // 열정 분출(배틀 142%, 불균형 10): 열기 + 열기 부착.
    { id: "ake-b", name: "열정 분출", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 2.56, mst: [2.74, 2.95, 3.2], element: "heat", attach: "heat", staggerVal: 10, note: "열기 부착" },
    // 섬광 돌진(연계 80×2=160%, 쿨 10초): 불균형 상태/불균형 지점 적. 게이지 15(승리의 함성으로 증가).
    { id: "ake-l", name: "섬광 돌진", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.88, mst: [3.08, 3.32, 3.6], hits: [0.8, 0.8], element: "physical", staggerVal: 10, cooldown: 2, gaugeGain: 15,
      requires: (t) => !!t && (t.staggered || (t.staggerMax > 0 && t.stagger >= t.staggerMax * 0.5)), requiresText: "불균형 상태인 적", note: "게이지 대량 수급(승리의 함성)" },
    // 소대, 집합!(궁, 게이지 120): 무딜. 게이지 대량 회복(58) + 연타 획득(몰입의 시간).
    { id: "ake-u", name: "소대, 집합!", kind: "ult", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, selfUlt: true, gaugeGain: 74, grantsMultiHit: 1, note: "게이지 대량 회복 + 연타(몰입의 시간, 소모 후 부여)" },
  ],
  // 알레쉬: 냉기/한손검 뱅가드(★5). 강제 동결(냉기 단독 동결!) + 게이지 수급 + 아츠이상/결정 소모 연계 + 린수 확률.
  // → 에스텔라 쇄빙 파티 핵심(동결 공급). 재능: 급속 냉동(동결 시 궁충) · 낚시의 달인(린수 확률, 지능→장비등급).
  alesh: [
    // 비정규 루어(배틀 200%, 불균형 10): 물리. 냉기 부착 적이면 냉기 소모 + 강제 동결 + 게이지(10/20/30/40).
    { id: "ale-b", name: "비정규 루어", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 3.6, mst: [3.85, 4.15, 4.5], element: "physical", staggerVal: 10, forceFreeze: true, note: "냉기 부착 적 → 강제 동결 + 게이지" },
    // 얼음 낚시 기술(연계 133%, 쿨 9초≈2턴): 아츠이상/결정 소모됐을 때. 게이지 10 + 린수 확률(강화 213% + 게이지).
    { id: "ale-l", name: "얼음 낚시 기술", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.4, mst: [2.57, 2.77, 3], element: "physical", staggerVal: 10, cooldown: 2, gaugeGain: 12, lure: { power: 3.83, gauge: 10 }, /* Lv9 213%×1.8 */
      requires: (_t, _s, st) => !!st.anomalyConsumed, requiresText: "아츠 이상 또는 결정을 소모한 뒤", note: "게이지 수급 + 린수 확률 강화" },
    // 월척이다!(궁 436%, 게이지 100): 광역 냉기 + 냉기 부착 + 게이지. 처치 시 추가 게이지.
    { id: "ale-u", name: "월척이다!", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 7.84, mst: [8.39, 9.04, 9.8], element: "cryo", staggerVal: 20, attach: "cryo", selfUlt: true, gaugeGain: 20, note: "광역 냉기 부착 + 게이지" },
  ],
  // 아크라이트: 전기/한손검 뱅가드(★5). 감전 소모 + 초단쿨(3초) 연계 게이지 수급 + 팀 전기 증폭(지능 비례, 근사).
  // 재능: 황무지의 방랑자(질풍 3회 발동 시 팀 전기 피해↑ — 근사) · 만물의 지혜(아츠 부착 50% 면역, 엔진 artsImmune).
  arclight: [
    // 질풍 섬광(배틀 45+45%, 불균형 10): 2회 베기. 감전 적이면 감전 소모 추가 전기(180%) + 게이지 30.
    { id: "arc-b", name: "질풍 섬광", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.62, mst: [1.74, 1.86, 2.02], hits: [0.45, 0.45], element: "physical", staggerVal: 10, gaugeGain: 35, shockBonus: { power: 1.8, gauge: 30 }, note: "감전 적이면 추가 전기 + 게이지 수급" },
    // 천둥의 울림(연계 155%, 쿨 3초≈1턴): 감전 적/감전 소모됐을 때. 게이지 8 + 궁 에너지. ← 핵심(초단쿨 수급)
    { id: "arc-l", name: "천둥의 울림", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.8, mst: [2.99, 3.22, 3.5], element: "physical", staggerVal: 5, cooldown: 1, gaugeGain: 9,
      requires: (t) => !!t && t.statuses.includes("shock"), requiresText: "감전 적", note: "초단쿨 연계 게이지 수급" },
    // 천둥번개(궁 156+244%=400%, 게이지 90): 돌진 전기 + 전기 부착 → 폭파. 전기 부착 적이면 강제 감전.
    { id: "arc-u", name: "천둥번개", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 7.2, mst: [7.7, 8.3, 9], hits: [1.56, 2.44], element: "electric", staggerVal: 7, attach: "electric", forceShock: true, selfUlt: true, note: "전기 부착 + 강제 감전" },
  ],
  // 포그라니치니크: 물리/한손검 뱅가드(유일 6성 뱅가드). 갑옷 파괴(유일) + 스킬 게이지 수급 + 불균형 누적.
  // 재능: 생존의 깃발(팀 게이지 80 회복마다 사기 격양=팀 공격력 +6%/3턴, 엔진 gaugeUp) · 전술 지도. 자체 방어 불능 부여는 궁뿐 → 팀 빌더 의존.
  pogranichnik: [
    // 전선 분쇄(배틀 86+106%=192%, 불균형 10): 갑옷 파괴(유일) + 방어 불능 소모량 비례 게이지 회복(5/10/20/30).
    { id: "pg-b", name: "전선 분쇄", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 3.44, mst: [3.68, 3.96, 4.3], hits: [0.86, 1.06], element: "physical", staggerVal: 10, anomaly: "armor-break", gaugeOnConsume: [5, 10, 20, 30], note: "갑옷 파괴 + 방어 불능 소모 비례 게이지 회복" },
    // 보름달 참격(연계 42+54+66%=162%, 쿨 18초): 강타/갑옷파괴로 방어 불능 소모됐을 때. 게이지 회복.
    { id: "pg-l", name: "보름달 참격", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.92, mst: [3.12, 3.36, 3.66], hits: [0.42, 0.54, 0.66], element: "physical", staggerVal: 11, cooldown: 4, gaugeGain: 25,
      requires: (t) => !!t && t.statuses.includes("armor-break"), requiresText: "강타·갑옷 파괴로 방어 불능 소모 후", note: "단계별 베기 + 게이지 회복" },
    // 방패병 부대, 전진(궁 133%, 게이지 90): 광역 몰이 진군 + 넘어뜨리기(방어 불능) + 철의 서약 5포인트 부여(물리이상마다 교란/최후의 승부).
    { id: "pg-u", name: "방패병 부대, 전진", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 2.4, mst: [2.56, 2.76, 3], element: "physical", staggerVal: 10, anomaly: "knockdown", selfUlt: true, grantsIronOath: 5, note: "진군 광역 몰이 + 방어 불능 + 철의 서약 5(추가타 체인)" },
  ],
  // 엠버: 열기/양손검 디펜더(첫 6성 디펜더, "열기 탈을 쓴 물리 디펜더"). 넘어뜨리기 방어 불능 + 치유·비호·팀 보호막. 느린 공속·수동적 피격 운용.
  // 재능: 전진의 결의(배틀/연계 시 50% 비호) · 강철에는 강철로(피격 시 공격력 +9%, 최대 3스택). 주스탯 힘·보조 의지(→장비등급, 치유 스케일).
  ember: [
    // 진군(배틀 173%, 불균형 10): 전방 부채꼴 열기 + 넘어뜨리기. 전진의 결의(비호). ⚠ 시전 중 피격 추가 불균형 미모델.
    { id: "emb-b", name: "진군", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 3.12, mst: [3.34, 3.6, 3.9], element: "heat", staggerVal: 10, anomaly: "knockdown", note: "부채꼴 열기 + 넘어뜨리기 + 비호" },
    // 전선에서의 지원(연계 102%, 쿨 19초≈4턴): 아군 피격 시. 넘어뜨리기 + 최저 체력 아군 치유(300+장비등급×0.7) + 비호.
    { id: "emb-l", name: "전선에서의 지원", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.84, mst: [1.96, 2.12, 2.3], element: "physical", staggerVal: 10, cooldown: 4, anomaly: "knockdown",
      requires: (_t, _s, st) => !!st.allyHit, requiresText: "아군 피격 후", note: "넘어뜨리기 + 아군 치유 + 비호" },
    // 다시 불타오르는 맹세(궁 289%, 불균형 25, 게이지 100): 광역 열기 + 팀 전체 보호막(엠버 최대 생명력 18%, 10초).
    { id: "emb-u", name: "다시 불타오르는 맹세", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 5.2, mst: [5.56, 5.99, 6.5], element: "heat", staggerVal: 25, selfUlt: true, note: "광역 열기 + 팀 보호막(최대 생명력 18%)" },
  ],
  // 스노우샤인: 냉기/양손검 디펜더(★5 배포). 저비용 냉기 부착(반격) + 비호 + 치유 + 궁 강제 동결(부착 무관). 쇄빙 보조.
  // 재능: 극지 생존(저체력 치유 +25%) · 구조 전문가(반격 시 궁 +10). 주스탯 힘·보조 의지(→장비등급, 치유 스케일).
  snowshine: [
    // 포화성 방어(배틀 200%, 게이지 100·반환 30): 자신+주변 90% 비호 + 반격 태세. 피격 시 반격 → 냉기 부착(엔진).
    { id: "snow-b", name: "포화성 방어", kind: "battle", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, gaugeRefund: 30, note: "90% 비호 + 게이지 반환 + 반격 태세(피격 시 냉기 부착)" },
    // 극지 구조(연계, 쿨 25초≈5턴): 아군 HP 60% 이하일 때. 대량 치유(96+장비등급×0.22) + 지속 치유(근사). 무피해.
    { id: "snow-l", name: "극지 구조", kind: "link", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, cooldown: 5,
      requires: (_t, _self, st) => st.units.some((u) => u.side === "ally" && u.hp > 0 && u.hp / u.maxHp <= 0.6), requiresText: "아군 HP 60% 이하", note: "아군 대량 치유(저체력 +25%)" },
    // 살얼음 추위(궁 200%, 불균형 15, 게이지 80): 광역 냉기 + 빙설 지대 강제 동결(냉기 부착 미소모) + 지속 냉기.
    { id: "snow-u", name: "살얼음 추위", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 3.6, mst: [3.85, 4.15, 4.5], element: "cryo", staggerVal: 15, selfUlt: true, freezeZone: 1, note: "광역 냉기 + 강제 동결(부착 무관, 쇄빙 보조)" },
  ],
  // 카치르: 물리/양손검 디펜더(★4 배포). 정석 패링 탱커 — 반격 방어 불능 부여 + 보호막 + 허약/넘어뜨리기 궁. 엠버 하위 호환이나 2디펜더 안정성.
  // 재능: 강인한 방어선(의지→방어력 baked + 보호막 스케일) · 전장을 꿰뚫는 통찰(궁 마지막 3회 충격파 ×45%). 주스탯 힘·보조 의지.
  catcher: [
    // 강력한 저지(배틀 178%, 게이지 100·반환 30): 자신+주변 90% 비호 + 반격 태세. 피격 시 반격 → 방어 불능 1스택(엔진).
    { id: "cat-b", name: "강력한 저지", kind: "battle", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, gaugeRefund: 30, note: "90% 비호 + 게이지 반환 + 반격 태세(피격 시 방어 불능)" },
    // 실시간 억제(연계 25+100%=125%, 쿨 35초≈7턴): 아군 HP 40% 이하/적 차지 시. 물리 + 자신+아군 보호막(360+방어력×2.25).
    { id: "cat-l", name: "실시간 억제", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.25, mst: [2.4, 2.59, 2.8], hits: [0.25, 1], element: "physical", staggerVal: 10, cooldown: 7,
      requires: (_t, _self, st) => st.units.some((u) => (u.side === "ally" && u.hp > 0 && u.hp / u.maxHp <= 0.4) || (u.side === "enemy" && (u.charging ?? 0) > 0)), requiresText: "적 차징 중 또는 아군 HP 40% 이하", note: "물리 + 자신+아군 보호막(방어력 비례)" },
    // 교과서적인 맹공(궁 89+120+178=387% + 충격파 3×45%=135% → 522%, 게이지 80): 다단 물리 + 허약 20% + 광역 넘어뜨리기.
    { id: "cat-u", name: "교과서적인 맹공", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 6.96, mst: [7.45, 8.03, 8.7], hits: [0.89, 1.2, 1.78], element: "physical", staggerVal: 20, selfUlt: true, anomaly: "knockdown",
      apply: (t) => applyBuff(t, "weaken", 0.2), note: "다단 물리 + 허약 + 광역 넘어뜨리기(전장을 꿰뚫는 통찰 충격파 포함)" },
  ],
  // 아델리아: 자연/아츠 유닛 서포터(★6 배포, 만능). 부식 셋업→소모로 물리+아츠 취약(30초) + 돌리 그림자 회복. 아츠 부착 없어 부착 파티와 무충돌.
  // 재능: 친구의 그림자(배틀/궁 명중 시 최저 체력 아군 회복) · 마운틴 서퍼(부식 소모 시 추가 배틀 1회, 근사). 주스탯 지능·보조 의지.
  ardelia: [
    // 질주하는 돌리(배틀 142%): 자연 돌진. 부식 적이면 소모 → 물리+아츠 취약 12%(30초≈6턴). 친구의 그림자(명중 시 회복).
    { id: "ard-b", name: "질주하는 돌리", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 2.56, mst: [2.74, 2.95, 3.2], element: "nature", staggerVal: 10,
      apply: (t) => { if (t.statuses.includes("corrosion")) { t.statuses = t.statuses.filter((x) => x !== "corrosion"); t.resShred = 0; bumpVuln(t, "physical", 0.12, 6); bumpVuln(t, "arts", 0.12, 6); } }, note: "자연 + 부식 소모 → 물리/아츠 취약 + 회복(친구의 그림자)" },
    // 화산 분화(연계 45+111%=156%, 쿨 18초≈4턴): 방어 불능·아츠부착 없는 적에 강일 후. 자연 + 주변 강제 부식 7초(취약 셋업).
    { id: "ard-l", name: "화산 분화", kind: "link", fromPos: [1, 2, 3], target: "all", power: 2.81, mst: [3, 3.23, 3.5], hits: [0.45, 1.11], element: "nature", staggerVal: 10, cooldown: 4,
      requires: (t, _self, st) => !!t && hasLinkEvent(st, "_strike") && t.physBreak === 0 && ELEMENTS.every((e) => t.arts[e] === 0), requiresText: "메인 강타 후 · 방어 불능도 부착도 없는 적", apply: (t) => { t.resShred = Math.min(0.24, (t.resShred || 0) + 0.12); setTimer(t, "resShred", 3); if (!t.statuses.includes("corrosion")) t.statuses.push("corrosion"); }, note: "자연 부착 + 강제 부식(전 속성 저항↓)" },
    // 복슬복슬 파티(궁 73%×3≈219%, 게이지 90): 광역 다단 자연 + 확률 회복(친구의 그림자).
    { id: "ard-u", name: "복슬복슬 파티", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 1.32, mst: [1.41, 1.52, 1.65], element: "nature", staggerVal: 2, selfUlt: true, note: "광역 다단 자연 + 회복" },
  ],
  // 자이히: 냉기/아츠 유닛 서포터(★5, "냉기 파티의 꽃·7성"). 퓨어 힐 + 오버힐 아츠 증폭 + 냉기/자연 증폭궁 + 냉기 부착 연계. 강일 트리거(메인 의존).
  // 재능: 가동 프로세스(연계가 냉기/동결 적 명중 시 냉기 취약) · 프리징 프로토콜(궁이 팀 냉기부착/동결 정화 — 휴면). 주스탯 의지·보조 지능.
  xaihi: [
    // 디도스(배틀, 게이지 100): 지원 결정체 — 메인 치유(144+의지×0.34). 오버힐 시 아츠 증폭 9%(25초). 연계 활성(엔진 id훅).
    { id: "xai-b", name: "디도스", kind: "battle", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, grants: "디도스", note: "치유 + 오버힐 시 아츠 증폭 + 연계 활성" },
    // 스트레스 테스트(연계 200%, 쿨 8초≈2턴): 디도스 활성 시. 냉기 + 냉기 부착 + 가동 프로세스(냉기/동결 적 → 냉기 취약 10%).
    { id: "xai-l", name: "스트레스 테스트", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 3.6, mst: [3.85, 4.15, 4.5], element: "cryo", attach: "cryo", staggerVal: 10, cooldown: 2,
      requires: (_t, self) => (self.didosUsed || 0) >= 2, requiresText: "디도스 회복 2회 소진",
      apply: (t) => { if (t.arts.cryo > 0 || t.frozen > 0) bumpRecv(t, "cryo", 0.1, 1); }, note: "냉기 부착 + 가동 프로세스(냉기 취약)" },
    // 스택 오버플로(궁, 게이지 80): 팀 전체 냉기 증폭 + 자연 증폭(12초, 지능→장비등급 비례, 상한 30%).
    { id: "xai-u", name: "스택 오버플로", kind: "ult", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, selfUlt: true, note: "팀 냉기/자연 증폭" },
  ],
  // 안탈: 전기/아츠 유닛 서포터(★4 범용, 초고성능). 전기+열기 취약(60초 단일 장지속) + 전기/열기 증폭궁 + 증폭 팀원 회복. 열기/전기팟 필수.
  // 재능: 즉흥적인 천재성(증폭 아군 스킬 피해 시 회복) · 무의식(30% 물리 면역 — 휴면). 주스탯 지능·보조 힘.
  antal: [
    // 지정 연구 대상(배틀 89%): 전기 단일 포커싱 + 전기 취약 + 열기 취약(60초≈12턴 장지속). 단일 1명 한정.
    { id: "ant-b", name: "지정 연구 대상", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.6, mst: [1.71, 1.85, 2], element: "electric", staggerVal: 10,
      apply: (t) => { bumpVuln(t, "electric", 0.05, 12); bumpVuln(t, "heat", 0.05, 12); }, note: "전기/열기 취약(12턴 장지속)" },
    // 자기 폭풍 실험장(연계 151%, 쿨 25초≈5턴): 포커싱 적 물리이상/아츠부착 시. 전기 + 이상/부착 재부여(지속 갱신, 엔진 id훅).
    { id: "ant-l", name: "자기 폭풍 실험장", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.72, mst: [2.91, 3.13, 3.4], element: "electric", staggerVal: 10, cooldown: 5,
      requires: (t) => !!t && (t.physBreak > 0 || ELEMENTS.some((e) => t.arts[e] > 0)), requiresText: "물리 이상 또는 아츠 부착된 적", note: "전기 + 아츠부착/물리이상 갱신(폭발 유닛 시너지)" },
    // 오버클럭 타임(궁, 게이지 100): 팀 전체 전기 증폭 + 열기 증폭(12초). 즉발·저비용.
    { id: "ant-u", name: "오버클럭 타임", kind: "ult", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, selfUlt: true, note: "팀 전기/열기 증폭" },
  ],
  // 질베르타: 자연/아츠 유닛 서포터(★6 한정, "서포터 1황"). 최고 아츠 취약궁(방어 불능 비례) + 유일 배틀 광역 몰이 + 강제 띄우기 연계 + 궁충 효율 재능. 누킹 딜러 시너지.
  // 재능: 전달자의 노래(필드 시 가드/캐스터/서포터 궁충 +7%, 엔진) · 뒤늦은 편지(배틀/연계 2+ 명중 시 회복). 주스탯 의지·보조 지능.
  gilberta: [
    // 중력 모드(배틀 인력97+폭발58=155%): 광역 몰이 광역 자연 + 자연 부착. 뒤늦은 편지(2+ 명중 회복).
    { id: "gil-b", name: "비전 지팡이 · 중력 모드", kind: "battle", fromPos: [1, 2, 3], target: "all", power: 2.79, mst: [2.98, 3.22, 3.49], hits: [0.97, 0.58], element: "nature", attach: "nature", staggerVal: 10, note: "광역 몰이 광역 자연 + 자연 부착 + 회복(2+ 명중)" },
    // 매트릭스 이동(연계 140%, 쿨 20초≈4턴): 아츠 이상 적 있을 때. 광역 끌어당김 + 강제 띄우기(방어 불능). 뒤늦은 편지.
    { id: "gil-l", name: "비전 지팡이 · 매트릭스 이동", kind: "link", fromPos: [1, 2, 3], target: "all", power: 2.52, mst: [2.7, 2.91, 3.15], element: "nature", staggerVal: 5, cooldown: 4, anomaly: "launch",
      requires: (t) => !!t && (t.frozen > 0 || t.dot > 0 || t.statuses.includes("shock") || t.statuses.includes("corrosion") || t.statuses.includes("combustion")), requiresText: "아츠 이상 적",
      note: "광역 강제 띄우기(방어 불능) + 회복(2+ 명중)" },
    // 중력장(궁 333%, 게이지 90): 광역 자연 + 자연 부착 + 최고 아츠 취약(기초 18% + 방어 불능 1스택당 1.75%) + 감속.
    { id: "gil-u", name: "비전 지팡이 · 중력장", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 6, mst: [6.42, 6.92, 7.5], element: "nature", attach: "nature", staggerVal: 20, selfUlt: true,
      apply: (t) => { bumpVuln(t, "arts", 0.18 + Math.min(4, t.physBreak) * 0.0175, 1); t.speedMod = (t.speedMod || 0) - 30; setTimer(t, "speedMod", 1); }, note: "광역 자연 부착 + 최고 아츠 취약(방어 불능 비례) + 감속" },
  ],
  // 펠리카: 전기/아츠 유닛 캐스터(★5, 첫 캐스터·타이틀 히로인). 즉발 전기 부착 + 강제 감전 연계(아츠 취약) + 깡딜 궁 + 불균형 추가딜. 범용 아츠 서포터/서브딜.
  // 재능: 오블리터레이션 프로토콜(불균형 적 +30%, 엔진) · 순환 프로토콜(연계가 방어 불능 적 추가 튕김 — 근사). 주스탯 지능·보조 의지.
  perlica: [
    // 프로토콜ω·뇌격(배틀 178%): 즉발 전기 + 전기 부착(좁은 범위, 빠른 발동).
    { id: "prl-b", name: "프로토콜ω · 뇌격", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 3.2, mst: [3.42, 3.69, 4], element: "electric", attach: "electric", staggerVal: 10, note: "즉발 전기 부착" },
    // 실시간 프로토콜·연쇄 섬광(연계 80%, 쿨 20초≈4턴): 메인 강일 후(상시). 전기 + 강제 감전(부착 무관 아츠 취약 12%).
    { id: "prl-l", name: "실시간 프로토콜 · 연쇄 섬광", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.44, mst: [1.54, 1.66, 1.8], element: "electric", staggerVal: 10, cooldown: 4, forceShock: true, requires: (_t, _self, st) => hasLinkEvent(st, "_strike"), requiresText: "메인 오퍼 강타 후", note: "강제 감전(아츠 취약, 부착 무관)" },
    // 프로토콜ε·70.41κ(궁 445%, 게이지 80): 광역 깡딜 전기. 불균형 적엔 오블리터레이션 +30%.
    { id: "prl-u", name: "프로토콜ε · 70.41κ", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 8, mst: [8.56, 9.23, 10], element: "electric", staggerVal: 20, selfUlt: true, note: "광역 깡딜 전기(불균형 적 +30%)" },
  ],
  // 울프가드: 열기/권총 캐스터(★5, 로시의 오빠). 열기 부착 + 연소/감전 소모 추가타(고배율) + 강제 연소 궁 + 불타는 송곳니(연소 부여 시 열기 증폭). 레바테인/로시 열기팟 핵심.
  // 재능: 불타는 송곳니(연소 부여마다 자기 열기 +30%, 엔진) · 절제의 원칙(연소/감전 소모 시 게이지 +10, 엔진). 주스탯 힘·보조 민첩.
  wulfgard: [
    // 탄흔의 열기(배틀 102% + 추가 378%): 열기 + 마지막 열기 부착. 연소/감전 적이면 부착 대신 소모 → 대량 추가타 + 게이지.
    { id: "wlf-b", name: "탄흔의 열기", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.84, mst: [1.96, 2.12, 2.3], element: "heat", attach: "heat", staggerVal: 5, burnShockConsume: 3.78, note: "열기 부착 / 연소·감전 소모 대량 추가타" },
    // 폭렬 수류탄·β형(연계 60%, 쿨 20초≈4턴): 아츠 부착 적 있을 때. 범위 열기 + 열기 부착.
    { id: "wlf-l", name: "폭렬 수류탄 · β형", kind: "link", fromPos: [1, 2, 3], target: "row", power: 1.08, mst: [1.16, 1.25, 1.35], element: "heat", attach: "heat", staggerVal: 10, cooldown: 4,
      requires: (t) => !!t && ELEMENTS.some((e) => t.arts[e] > 0), requiresText: "아츠 부착 적", note: "범위 열기 부착" },
    // 늑대의 분노(궁 32%×5=160%, 게이지 90): 광역 다단 열기 + 강제 연소 + 불타는 송곳니.
    { id: "wlf-u", name: "늑대의 분노", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 2.88, mst: [3.08, 3.32, 3.6], hits: [0.32, 0.32, 0.32, 0.32, 0.32], element: "heat", staggerVal: 15, selfUlt: true, forceBurn: true, note: "광역 열기 + 강제 연소" },
  ],
  // 플루라이트: 자연/권총 캐스터(★4, Z7). 무료 다중 아츠 부착(연계/궁 게이지 무소모) + 감속 + 자연 부착. 다중 부착형 스트라이커(라스트 라이트) 보조. 긴 연계 쿨이 약점.
  // 재능: 몰락의 조력자(감속 적 +20%, 엔진) · 종잡을 수 없는 자(20% 아츠 면역+공격력 — 휴면). 주스탯 민첩·보조 지능.
  fluorite: [
    // 서프라이즈?(배틀 187%): 수제 폭탄 → 범위 자연 + 자연 부착 + 30% 감속.
    { id: "flr-b", name: "서프라이즈?", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 3.36, mst: [3.6, 3.88, 4.2], element: "nature", attach: "nature", staggerVal: 10,
      apply: (t) => { t.speedMod = (t.speedMod || 0) - 30; setTimer(t, "speedMod", 2); }, note: "자연 부착 + 감속" },
    // 특별 보너스(연계 169%, 쿨 40초≈8턴 최장): 냉기/자연 2부착+ 적. 자연 + 같은 부착 1스택 추가(무료 부착 지원).
    { id: "flr-l", name: "특별 보너스", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 3.04, mst: [3.25, 3.51, 3.8], element: "nature", staggerVal: 10, cooldown: 8,
      requires: (t) => !!t && (t.arts.cryo >= 2 || t.arts.nature >= 2), requiresText: "냉기·자연 2스택 이상 부착된 적", note: "자연 + 무료 아츠 부착(스택 추가)" },
    // 난장판으로 만들어주지(궁 111%×4=444%, 게이지 100): 광역 다단 자연. 2부착+ 적이면 같은 부착 추가.
    { id: "flr-u", name: "난장판으로 만들어주지", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 7.99, mst: [8.56, 9.24, 10], hits: [1.11, 1.11, 1.11, 1.11], element: "nature", staggerVal: 20, selfUlt: true, note: "광역 다단 자연 + 무료 아츠 부착" },
  ],
  // 탕탕: 냉기/권총 캐스터(★6 한정). 즉발 냉기 부착(용오름) + 용오름 개수 비례 아츠 취약 + 와류(가속/감속) + 시간 정지 궁 + 준수한 서브딜. 냉기팟 핵심(라스트 라이트/이본 부착 보조).
  // 재능: 의기투합(와류 주변 아군 가속/적 감속, 엔진) · 풍랑의 주재자(배틀 스킬 와류→용오름 강화, 엔진). 주스탯 민첩·보조 힘.
  tangtang: [
    // 우당탕탕 파도!(배틀 사격 80% + 용오름 133% = 213%): 즉발 냉기 부착 + 용오름(와류 소모로 개수↑ → 아츠 취약·지속 냉기·게이지). 엔진 id훅.
    { id: "tt-b", name: "우당탕탕 파도!", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 3.84, mst: [4.11, 4.43, 4.8], hits: [0.8, 1.33], element: "cryo", attach: "cryo", staggerVal: 10, note: "즉발 냉기 부착 + 용오름(아츠 취약·지속 냉기·게이지)" },
    // 야, 강물! 도와줘!(연계 107%, 쿨 14초≈3턴): 냉기 부착/아츠 폭발 적. 냉기 관통 + 와류 생성 + 의기투합(가속/감속).
    { id: "tt-l", name: "야, 강물! 도와줘!", kind: "link", fromPos: [1, 2, 3], target: "row", power: 1.92, mst: [2.05, 2.21, 2.4], element: "cryo", staggerVal: 10, cooldown: 3,
      requires: (t, _s, st) => !!t && (t.arts.cryo > 0 || !!st.anomalyConsumed), requiresText: "냉기 부착 또는 아츠 폭발한 적", note: "냉기 관통 + 와류 생성 + 의기투합" },
    // 대당가께서 지켜보고 계신다!(궁 거대 파도 311%, 게이지 90): 시간 정지(행동 불가) + 거대 파도 + 지속 냉기.
    // 실측: 지속 피해 142% + 거대한 파도(기본) 178% = 320%. 311%는 낙하공격 조기발동판(엔진 미구현)이라 기본값 채택.
    { id: "tt-u", name: "대당가께서 지켜보고 계신다!", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 5.76, mst: [6.16, 6.64, 7.2], element: "cryo", staggerVal: 20, selfUlt: true, note: "시간 정지(행동 불가) + 지속 냉기 142% + 거대 파도 178%" },
  ],
  // 라스트 라이트(라라): 냉기/양손검 스트라이커(★6 한정, 첫 스트라이커). 냉기 부착 3+ 소모 단일 누킹 + 저체온증 냉기 취약 + 저온 취성(궁 취약 1.5배) + 자기 충전 궁(240). 대보스 특화·다수전 약점.
  // 재능: 저체온증(아츠 부착 소모 시 냉기 취약 ×4%, 엔진) · 저온 취성(궁 냉기/아츠 취약 1.5배, 엔진). 궁은 배틀/연계로만 충전. 주스탯 힘·보조 의지.
  lastrite: [
    // 세쉬카의 비전(배틀 환영 추격 142%, 게이지 100·반환 30): 냉기 + 냉기 부착(환영) + 궁 에너지 16(자기 충전).
    { id: "lr-b", name: "세쉬카의 비전", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 2.56, mst: [2.74, 2.95, 3.2], element: "cryo", attach: "cryo", staggerVal: 10, gaugeRefund: 30, note: "냉기 부착(환영 추격) + 궁 에너지 자기 충전" },
    // 겨울 포식자(연계 얼음송곳71+베기71=142% + 스택당 107%, 쿨 9초≈2턴): 냉기 부착 3스택+ 적. 전부 소모 → 스택 누킹 + 냉기 취약 + 강제 정지.
    { id: "lr-l", name: "겨울 포식자", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.56, mst: [2.74, 2.94, 3.2], hits: [0.71, 0.71], element: "cryo", staggerVal: 15, cooldown: 2, cryoNuke: 1.07,
      requires: (t) => !!t && t.arts.cryo >= 3, requiresText: "냉기 3스택 이상 부착된 적", note: "냉기 소모 누킹 + 저체온증 냉기 취약 + 강제 정지" },
    // 마지막 인사(궁 178+178+356=712%, 게이지 240): 단일 3연 베기 누킹(시전 중 피해 면역) + 저온 취성(냉기/아츠 취약 1.5배).
    { id: "lr-u", name: "마지막 인사", kind: "ult", fromPos: [1, 2], target: "single-front", power: 12.8, mst: [13.68, 14.76, 16], hits: [1.78, 1.78, 3.56], element: "cryo", staggerVal: 20, selfUlt: true, note: "단일 3연 베기 누킹 + 저온 취성(취약 1.5배)" },
  ],
  // 아비웨나: 전기/장병기 스트라이커(★5). 썬더랜스(투창)를 연계/궁으로 필드에 설치(30초) → 배틀로 전부 회수하며 수 비례 중복 폭딜. 전기 부착/감전 미소모(연계 조건일 뿐). 전기팟 핵심.
  // 재능: 고효율 배송(투창 설치/회수 명중 시 궁 +4, 엔진) · 완곡한 수단(궁 명중 시 전기 취약, 엔진). 평타는 물리. 주스탯 의지·보조 민첩.
  avywenna: [
    // 썬더랜스·가로채기(배틀 본체 67%, 게이지 100): 모든 썬더랜스 회수 → 투창 수 비례 중복 전기타(일반 75%/강력 192%·전기 부착). 회수 = 배틀 피해.
    { id: "avy-b", name: "썬더랜스 · 가로채기", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.2, mst: [1.28, 1.38, 1.5], element: "electric", staggerVal: 5, lanceRecover: true, note: "투창 전부 회수 → 수 비례 중복 폭딜 + 강력 투창 전기 부착" },
    // 썬더랜스·번개 타격(연계 169%, 쿨 13초≈3턴): 전기 부착/감전 적에 강일 후(미소모). 전기 + 일반 썬더랜스 3개 설치(30초).
    { id: "avy-l", name: "썬더랜스 · 번개 타격", kind: "link", fromPos: [1, 2, 3], target: "row", power: 3.04, mst: [3.25, 3.5, 3.8], element: "electric", staggerVal: 10, cooldown: 3,
      requires: (t) => !!t && (t.arts.electric > 0 || t.statuses.includes("shock")), requiresText: "전기 부착 또는 감전된 적", note: "전기 + 썬더랜스 3개 설치(부착 미소모)" },
    // 썬더랜스·결전의 떨림(궁 422%, 게이지 100): 강력 썬더랜스 1개 설치 + 광역 전기 + 완곡한 수단(전기 취약 10%).
    { id: "avy-u", name: "썬더랜스 · 결전의 떨림", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 7.6, mst: [8.13, 8.76, 9.5], element: "electric", staggerVal: 15, selfUlt: true,
      apply: (t) => bumpVuln(t, "electric", 0.1, 2), note: "광역 전기 + 강력 썬더랜스 설치 + 전기 취약" },
  ],
  // 판: 물리/양손검 스트라이커(★5, 유일 비6성 물리 스트라이커). 방어 불능 4스택 강타 단발 누커(관리자 유사). 띄우기/넘어뜨리기 방어 불능 빌더 + 강타 화력 몰빵.
  // 재능: 전분 풀기(방어 불능 소모 시 물리 +6%/스택, 엔진) · 간 맞추기(궁 후 연계 쿨 40% 단축, 엔진). 주스탯 힘·보조 의지.
  dapan: [
    // 뒤집어 주지!(배틀 133%): 웍 던져 물리 + 띄우기(방어 불능 빌더).
    { id: "dp-b", name: "뒤집어 주지!", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 2.4, mst: [2.56, 2.76, 3], element: "physical", staggerVal: 10, anomaly: "launch", note: "물리 + 띄우기(방어 불능 누적)" },
    // 조미료 뿌리기!(연계 289% + 강타, 쿨 20초≈4턴): 방어 불능 4스택 적. 대량 물리 + 강타(추가 강타 +10%) + 전분 풀기. SP 무소모.
    { id: "dp-l", name: "조미료 뿌리기!", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 5.2, mst: [5.56, 5.99, 6.5], element: "physical", staggerVal: 15, cooldown: 4, anomaly: "crush", crushAmp: 1.1,
      requires: (t) => !!t && t.physBreak >= 4, requiresText: "방어 불능 4스택", note: "대량 물리 + 강타(추가 +10%) + 전분 풀기" },
    // 채 썰어 웍에 넣기!(궁 6단22%+178%=310%, 게이지 90): 강제 띄우기+넘어뜨리기(방어 불능 2스택) + 광역 물리.
    { id: "dp-u", name: "채 썰어 웍에 넣기!", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 5.58, mst: [5.97, 6.43, 6.98], hits: [0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 1.78], element: "physical", staggerVal: 20, selfUlt: true, anomaly: "launch",
      apply: (t) => { if (t.hp > 0) { t.physBreak = Math.min(4, t.physBreak + 1); setTimer(t, "physBreak", 4); } }, note: "강제 띄우기+넘어뜨리기(방어 불능 2스택) + 광역 물리" },
  ],
  // 레바테인: 열기/한손검 스트라이커(★6 한정, 수르트 리컨비너). 열기 부착 흡수 → 녹아내린 불꽃 4스택 → 강화 배틀 폭발 + 궁 +100 → 버프형 궁(300 최고). 부활의 불씨로 최고 안정성·광역 특화.
  // 재능: 불꽃의 심장(열기 부착 흡수→녹아내린 불꽃, 4스택 열기 저항 무시) · 부활의 불씨(HP 40%↓ 90% 비호+회복). 주스탯 지능·보조 힘.
  laevatain: [
    // 불타오르는 화염(배틀 초기 62%): 열기 + (불꽃의 심장)열기 부착 흡수 → 녹아내린 불꽃. 4스택 시 강화 폭발(추가 342% + 강제 연소 + 궁 +100). 흡수는 일반공격/배틀/연계 공통(엔진 id훅).
    { id: "lae-b", name: "불타오르는 화염", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.12, mst: [1.2, 1.29, 1.4], element: "heat", staggerVal: 10, gaugeCost: 100, note: "열기 + 주변 열기 부착 흡수(녹아내린 불꽃) · 4스택 시 강화 폭발 + 강제 연소 + 궁 +100" },
    // 열화(연계 240%, 쿨 10초≈2턴): 연소/부식 적. 광역 열기 + 녹아내린 불꽃(명중당) + 궁충(명중 수 비례).
    { id: "lae-l", name: "열화", kind: "link", fromPos: [1, 2, 3], target: "row", power: 4.32, mst: [4.62, 4.98, 5.4], element: "heat", staggerVal: 10, cooldown: 2,
      requires: (t) => !!t && (t.statuses.includes("combustion") || t.statuses.includes("corrosion")), requiresText: "연소 또는 부식된 적", note: "광역 열기 + 녹아내린 불꽃 + 궁충" },
    // 황혼(궁, 게이지 300 최고): 변신 — 즉발 도마 내리찍기(열기 부착) + 15초간 일반공격 ×3·배틀 ×2.5 강화(엔진 twilight). 딜 지분은 변신 중 강화 평타.
    { id: "lae-u", name: "황혼", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 0, element: "heat", attach: "heat", staggerVal: 20, selfUlt: true, note: "변신(3턴): 일반 공격/배틀 강화 + 즉발 열기 부착" },
  ],
  // 이본: 냉기/권총 스트라이커(★6 한정). 냉기/자연 부착 소모 강제 동결(배틀) + 치명타 변신 말뚝딜 궁(아이스 슈터) + 빙점(냉기/동결 적 치피). 간결한 부착-배틀-동결-궁 구조. 쇄빙 파티 동결 공급.
  // 재능: 빙점(냉기 적 치피 +20%, 동결 ×2=+40%, 엔진) · 하이테크 버스트(동결 후 즉발 강일 — 근사). 주스탯 지능·보조 민첩.
  yvonne: [
    // 얼음 폭탄·β형(배틀 111%): 냉기. 냉기/자연 부착 적이면 전부 소모 → 강제 동결 + 스택 비례 냉기 + 궁충(엔진 iceBomb).
    { id: "yv-b", name: "얼음 폭탄 · β형", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 2, mst: [2.14, 2.3, 2.5], element: "cryo", staggerVal: 10, iceBomb: true, note: "냉기/자연 소모 → 강제 동결 + 궁충" },
    // 꽁꽁이·υ37(연계 충격파45+폭발89=134%, 쿨 20초≈4턴): 동결 적 강일 후. 광역 냉기 + 광역 몰이 + 자폭 강제 동결 + 궁충.
    { id: "yv-l", name: "꽁꽁이 · υ37", kind: "link", fromPos: [1, 2, 3], target: "row", power: 2.41, mst: [2.58, 2.78, 3.01], hits: [0.45, 0.89], element: "cryo", staggerVal: 10, cooldown: 4,
      requires: (t) => !!t && t.frozen > 0, requiresText: "동결 적",
      apply: (t) => { if (t.hp > 0) { t.frozen = Math.max(t.frozen, 1); if (!t.statuses.includes("stun")) t.statuses.push("stun"); setTimer(t, "frozen", 2); } }, note: "광역 냉기 + 광역 몰이 + 자폭 강제 동결" },
    // 아이스 슈터(궁 변신 말뚝딜, 게이지 220): 치명타 변신(치확 +30%·치피 +60%) + 동결 소모 추가 267%. 단일 누킹.
    { id: "yv-u", name: "아이스 슈터", kind: "ult", fromPos: [1, 2], target: "single-front", power: 2.4, mst: [2.56, 2.76, 3], element: "cryo", staggerVal: 20, selfUlt: true, note: "변신(2턴): 강화 평타 · 평타마다 치확 +3%(최대 +30%) · 만스택 시 치피 +60% · 동결 적 추가 냉기" },
  ],
  // 장방이: 전기/아츠 유닛 스트라이커(★6 한정, 무릉 책임자). 청뢰검(감전 소모→검 생성, 최대 9, 수 비례 뇌격·궁충) + 변신 궁(천리의 경지: 평타/배틀 강화·방해 면역·연계 쿨 4배). 6성 최고 다수전·지속딜. 레바테인 상위.
  // 재능: 천지의 조화(배틀 시 전기 증폭, 엔진) · 하늘의 가호(청뢰검 비례 피해 면역 — 근사). 주스탯 의지·보조 지능.
  zhuangfangyi: [
    // 뇌정의 부름(배틀): 감전 소모 → 청뢰검 생성(최대 9) + 청뢰검 수 비례 뇌격(마지막 ×6) + 궁충. 변신 중 강화. 엔진 id훅.
    { id: "zfy-b", name: "뇌정의 부름", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 0, element: "electric", staggerVal: 15,
      // 원문: 근처 청뢰검이 각각 유도 뇌격 → 타수 = 청뢰검 수(1~9), 마지막 뇌격만 ×6.
      // 피해 총량은 엔진 훅이 per×(청뢰검+5)로 이미 계산하므로 여기선 표시용 분배 비율만 준다.
      hitsOf: (self) => { const n = Math.max(1, Math.min(9, self.procCount || 1)); return [...Array(n - 1).fill(1), 6]; }, note: "감전 소모 → 청뢰검 생성 + 뇌격(청뢰검 비례) + 궁충" },
    // 변화의 숨결(연계 160%, 쿨 18초≈4턴): 전기 부착 적 강일 후. 전기 + 전기 부착 소모 → 강제 감전(레벨↑) + 궁충.
    { id: "zfy-l", name: "변화의 숨결", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.88, mst: [3.08, 3.32, 3.6], element: "electric", staggerVal: 10, cooldown: 4,
      requires: (_t, _self, s) => hasLinkEvent(s, "zhuangfangyi"), requiresText: "감전 적 강타 후", note: "전기 + 전기 부착 소모 강제 감전 + 궁충" },
    // 심판의 폭풍(궁 변신, 게이지 240): 천리의 경지 — 평타/배틀 강화 + 방해 면역 + 첫 배틀 3검. 25초 지속딜.
    { id: "zfy-u", name: "심판의 폭풍", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 0, element: "electric", staggerVal: 20, selfUlt: true, note: "천리의 경지 변신: 평타/배틀 강화 + 첫 배틀 3검" },
  ],
  // 결: 자연 캐스터★6. 재능 「전략 수립」이 지능≥의지면 진결·지혜(딜), 의지>지능이면 진결·의지(서폿)로 스킬을 통째로 바꾼다.
  // 결의 고유 능력치는 지능 176 > 의지 121 → 상시 **진결·지혜** 폼. 배율·효과 전부 지혜 기준으로 등록한다.
  // (진결·의지 배율은 배틀 300%/궁 깨달음 360%로 딜이 절반 이하 — 우리 게임엔 능력치 재배분 수단이 없어 폼 전환이 불가능하다.)
  arcane: [
    // 결정 파쇄 그리드(배틀): 지혜 500% / 의지 300%. 의지 폼은 딜 대신 끌어당김(광역 몰이).
    { id: "arcn-b", name: "결정 파쇄 그리드", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 4, mst: [4.28, 4.61, 5],
      powerOf: (self) => (arcaneForm(self) === "wisdom" ? 4.0 : 2.39), // Lv9(지혜 400%/의지 240%)
      element: "nature", attach: "nature", staggerVal: 10,
      // 의지 폼 배틀은 원문상 "피해를 줄 때, 범위 내의 적을 중심으로 끌어당깁니다" — 끌어당김만이다.
      // (부착 추가는 연계·궁에만 있다. 위키 총평의 "모든 스킬이 …추가 부착"은 폼 전체 성격 서술)
      apply: (t, self) => { if (arcaneForm(self) === "will") { t.speedMod = (t.speedMod || 0) - 15; setTimer(t, "speedMod", 2); } },
      note: "광역 자연 부착 · 지혜=피해↑ / 의지=끌어당김" },
    // 응룡 4식(연계 200%, 쿨 4턴): 지혜=자연/2스택 부착 조건 · 의지=아츠 부착이면 발동(조건 완화) + 취약이 의지 비례로 커짐.
    { id: "arcn-l", name: "응룡 4식", kind: "link", fromPos: [1, 2, 3], target: "row", power: 1.6, mst: [1.71, 1.84, 2], hits: [0.36, 0.53], element: "nature", staggerVal: 10, cooldown: 4, gaugeGain: 10,
      requires: (t, self) => !!t && (arcaneForm(self) === "wisdom"
        ? (t.arts.nature > 0 || ELEMENTS.some((e) => t.arts[e] >= 2))   // 지혜: 자연 부착 또는 2스택 아츠 부착
        : ELEMENTS.some((e) => t.arts[e] > 0)),                          // 의지: 아츠 부착만 있으면 발동
      requiresText: "자연 부착 2스택 이상인 적",
      apply: (t, self) => {
        // 의지 폼은 의지 수치에 비례해 취약이 커진다(원작: 기초 4% + 의지 640까지 최대 +8%).
        const wil = (self.panelAttrs ?? self.attrs)?.wil ?? 0;
        const v = arcaneForm(self) === "wisdom" ? 0.04 : 0.04 + Math.min(0.08, (wil / 640) * 0.08);
        bumpVuln(t, "nature", v, arcaneForm(self) === "wisdom" ? 4 : 6);
        bumpVuln(t, "cryo", v, arcaneForm(self) === "wisdom" ? 4 : 6);
        // 의지 폼은 전술 분신이 아츠 부착까지 부여한다. 원작 정체성이 "이미 부착된 아츠 부착에 추가 부착 —
        // 속성을 가리지 않는 전천후 아츠 부착 지원"이므로, 자연 고정이 아니라 **이미 붙어 있는 속성**을 올린다.
        // (장방이=전기, 레바테인=열기, 이본/라스트=냉기 파티에 그대로 얹히는 게 의지 폼의 존재 이유)
        if (arcaneForm(self) === "will") {
          const on = ELEMENTS.filter((e) => t.arts[e] > 0);
          for (const e of (on.length ? on : ["nature" as const])) { t.arts[e] = Math.min(4, t.arts[e] + 1); setTimer(t, "arts:" + e, 4); }
        }
        t.speedMod = (t.speedMod || 0) - 20; setTimer(t, "speedMod", 4); // 구속: 모든 행동이 느려진다
        setTimer(t, "bound", 3); // 구속 상태 — 지혜 폼 배틀이 여기 명중하면 조기 종료 + 폭발/추가타(combat.ts)
      },
      note: "전술 분신 구속(쿨 12초≈2턴) — 취약 + 감속. 지혜 폼은 배틀로 조기 폭발" },
    // 어스름 파훼(궁): 지혜 진180+집중360+깨달음1440=1980% / 의지 진180+집중360+깨달음360=900%.
    // 지혜=강제 부식(전 피해 취약) / 의지=아츠 부착 재부여(팀 반응 재점화).
    // 원문(나무위키 레벨표 Lv1): 진 80% · 집중 공격 총피해 160%(최대 2회) · 깨달음 640%.
    // 구조는 폼별 배율 차이가 아니라 **순차 전환**이다 —
    //   시전 시 「어스름 파훼의 진」 생성(80%) → 진 안의 적이 처형/강일을 받으면 집중 공격(160%) 최대 2회
    //   → 2회 소화 후 궁이 「어스름 파훼의 깨달음」으로 전환되어 다음 궁이 640%가 된다.
    // 진결·지혜는 배율이 아니라 "진 생성 시 강제 부식 15초"를 추가할 뿐이다.
    // (기존엔 80+160+640을 한 방 880%로 뭉치고 폼별 배율까지 붙여, 지혜/의지 값이 뒤섞여 있었다)
    { id: "arcn-u", name: "어스름 파훼", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 7.2, mst: [7.7, 8.3, 9], hits: [0.8, 1.6, 1.6],
      powerOf: (self) => ((self.timers.duskAwaken || 0) > 0 ? 11.52 : 7.2), // Lv9(깨달음 1152%/기본 720%)
      hitsOf: (self) => ((self.timers.duskAwaken || 0) > 0 ? [6.4] : undefined),
      element: "nature", staggerVal: 20, selfUlt: true,
      apply: (t, self) => {
        if (arcaneForm(self) === "wisdom") {
          // 강제 부식 15초 + 재능 「무장 강화」(부식 지속·저항 감소 강화)
          if (!t.statuses.includes("corrosion")) t.statuses.push("corrosion");
          t.resShred = Math.min(0.24, (t.resShred || 0) + 0.15); setTimer(t, "resShred", 3); // 부식 = 저항 포인트 감소
          // 재능 「전략 수립」 2단계(지혜): 궁 지속 중 자신이 아츠 증폭 24%
          for (const e of ELEMENTS) self.amp[e] = Math.max(self.amp[e] || 0, 0.24);
          setTimer(self, "amp:nature", 4);
        }
        else {
          for (const e of ELEMENTS) if (t.arts[e] > 0) { t.arts[e] = Math.min(4, t.arts[e] + 1); setTimer(t, "arts:" + e, 4); } // 부착 재부여
          // 재능 2단계(의지): 궁이 피해를 줄 때 [의지×0.02%] 자연·냉기 취약(최대 12.8%), 2턴.
          const w = (self.panelAttrs ?? self.attrs)?.wil ?? 0;
          const tv = Math.min(0.128, w * 0.0002);
          bumpVuln(t, "nature", tv, 2); bumpVuln(t, "cryo", tv, 2);
        }
      },
      note: "3단 광역 누킹 · 지혜=강제 부식 / 의지=아츠 부착 재부여" },
  ],
};

type Base = { id: string; name: string; cls: DDClass; hp: number; attack: number; speed: number; ultCost: number; rampAtk?: number; artsImmune?: number; cryoImmune?: boolean };
const OP_BASE: Record<string, Base> = {
  chenqianyu: { id: "chenqianyu", name: "진천우", cls: "guard", hp: 2689, attack: 95, speed: 86, ultCost: 70, rampAtk: 0.08 }, // 칼날 베기
  lifeng: { id: "lifeng", name: "여풍", cls: "guard", hp: 2689, attack: 110, speed: 69, ultCost: 90 },
  endministrator: { id: "endministrator", name: "관리자", cls: "guard", hp: 2689, attack: 110, speed: 69, ultCost: 80 }, // 위키: 가드(가드의 탈을 쓴 물리 스트라이커)
  estella: { id: "estella", name: "에스텔라", cls: "guard", hp: 2689, attack: 110, speed: 47, ultCost: 70, cryoImmune: true }, // 냉기/가드. 이유 있는 게으름=냉기 면역
  rossi: { id: "rossi", name: "로시", cls: "guard", hp: 2689, attack: 110, speed: 90, ultCost: 110 }, // 물리/열기 하이브리드, 민첩 90(최상위), 궁 게이지 110
  mifu: { id: "mifu", name: "미브", cls: "guard", hp: 2689, attack: 110, speed: 46, ultCost: 80 }, // 물리/양손검 가드(공식). 주스탯 힘·민첩 낮음
  arclight: { id: "arclight", name: "아크라이트", cls: "vanguard", hp: 2689, attack: 110, speed: 71, ultCost: 90, artsImmune: 0.5 }, // 전기 뱅가드★5. 만물의 지혜=아츠 부착 50% 확률 면역
  alesh: { id: "alesh", name: "알레쉬", cls: "vanguard", hp: 2689, attack: 110, speed: 47, ultCost: 100 }, // 냉기 뱅가드★5. 강제 동결, 주스탯 힘·보조 지능
  akekuri: { id: "akekuri", name: "아케쿠리", cls: "vanguard", hp: 2689, attack: 110, speed: 70, ultCost: 120 }, // 열기 뱅가드★4 범용. 무딜 궁(게이지 120), 주스탯 민첩·보조 지능
  camu: { id: "camu", name: "카뮤", cls: "vanguard", hp: 2689, attack: 110, speed: 80, ultCost: 130 }, // 열기 뱅가드★6 한정. 만능 유틸+회복, 민첩 80·궁 130
  pogranichnik: { id: "pogranichnik", name: "포그라니치니크", cls: "vanguard", hp: 2689, attack: 130, speed: 55, ultCost: 90 }, // 뱅가드(갑옷 파괴·게이지 회복). 주스탯 의지·민첩 55
  ember: { id: "ember", name: "엠버", cls: "defender", hp: 2689, attack: 110, speed: 40, ultCost: 100 }, // 열기 디펜더★6(첫 6성). 느린 공속(speed 40 최하위), 주스탯 힘·보조 의지
  snowshine: { id: "snowshine", name: "스노우샤인", cls: "defender", hp: 2689, attack: 110, speed: 44, ultCost: 80 }, // 냉기 디펜더★5 배포. 반격 냉기 부착·궁 강제 동결. 저비용·궁 80, 주스탯 힘·보조 의지
  catcher: { id: "catcher", name: "카치르", cls: "defender", hp: 2689, attack: 110, speed: 42, ultCost: 80 }, // 물리 디펜더★4 배포. 반격 방어 불능·보호막·허약/넘어뜨리기 궁. 주스탯 힘·보조 의지
  ardelia: { id: "ardelia", name: "아델리아", cls: "supporter", hp: 2689, attack: 110, speed: 62, ultCost: 90 }, // 자연 서포터★6 배포(첫 서포터). 부식→물리/아츠 취약 + 회복. 주스탯 지능·보조 의지
  xaihi: { id: "xaihi", name: "자이히", cls: "supporter", hp: 2689, attack: 110, speed: 64, ultCost: 80 }, // 냉기 서포터★5("냉기 파티의 꽃"). 퓨어 힐+아츠 증폭+냉기/자연 증폭궁+냉기 부착. 주스탯 의지·보조 지능
  antal: { id: "antal", name: "안탈", cls: "supporter", hp: 2689, attack: 110, speed: 63, ultCost: 100 }, // 전기 서포터★4 범용. 전기/열기 취약(60초 단일)+전기/열기 증폭궁+증폭 팀원 회복. 주스탯 지능·보조 힘
  gilberta: { id: "gilberta", name: "질베르타", cls: "supporter", hp: 2689, attack: 110, speed: 62, ultCost: 90 }, // 자연 서포터★6 한정(1황). 최고 아츠 취약궁+광역 몰이+강제 띄우기+궁충 효율. 주스탯 의지·보조 지능
  perlica: { id: "perlica", name: "펠리카", cls: "caster", hp: 2689, attack: 110, speed: 66, ultCost: 80 }, // 전기 캐스터★5(첫 캐스터). 전기 부착+강제 감전(아츠 취약)+깡딜 궁+불균형 추가딜. 주스탯 지능·보조 의지
  wulfgard: { id: "wulfgard", name: "울프가드", cls: "caster", hp: 2689, attack: 110, speed: 70, ultCost: 90 }, // 열기 캐스터★5. 열기 부착+연소/감전 소모 추가타+강제 연소 궁+불타는 송곳니. 주스탯 힘·보조 민첩
  fluorite: { id: "fluorite", name: "플루라이트", cls: "caster", hp: 2689, attack: 110, speed: 72, ultCost: 100 }, // 자연 캐스터★4. 무료 다중 아츠 부착(연계/궁)+감속+자연 부착. 주스탯 민첩·보조 지능
  tangtang: { id: "tangtang", name: "탕탕", cls: "caster", hp: 2689, attack: 110, speed: 74, ultCost: 90 }, // 냉기 캐스터★6 한정. 즉발 냉기 부착(용오름)+아츠 취약+와류 가속/감속+시간정지 궁+서브딜. 주스탯 민첩·보조 힘
  lastrite: { id: "lastrite", name: "라스트 라이트", cls: "striker", hp: 2689, attack: 110, speed: 48, ultCost: 240 }, // 냉기 스트라이커★6 한정(첫 스트라이커). 냉기 부착 소모 단일 누킹·자기 충전 궁(240). 주스탯 힘·보조 의지
  avywenna: { id: "avywenna", name: "아비웨나", cls: "striker", hp: 2689, attack: 110, speed: 62, ultCost: 100 }, // 전기 스트라이커★5. 썬더랜스(투창 설치→회수 중복타) 폭딜·부착 미소모. 주스탯 의지·보조 민첩
  dapan: { id: "dapan", name: "판", cls: "striker", hp: 2689, attack: 110, speed: 55, ultCost: 90 }, // 물리 스트라이커★5. 방어 불능 4스택 강타 단발 누커·띄우기/넘어뜨리기 빌더. 주스탯 힘·보조 의지
  laevatain: { id: "laevatain", name: "레바테인", cls: "striker", hp: 2689, attack: 110, speed: 64, ultCost: 300 }, // 열기 스트라이커★6 한정. 열기 부착 흡수→녹아내린 불꽃→강화 배틀·버프형 궁·부활의 불씨. 궁 300은 원문 그대로(warfarin 「황혼」 필요 궁극기 에너지 300 고정) — 배틀 4스택 추가공격 +100, 연계 열화 25~35로 도달한다. 주스탯 지능·보조 힘
  yvonne: { id: "yvonne", name: "이본", cls: "striker", hp: 2689, attack: 110, speed: 66, ultCost: 220 }, // 냉기 스트라이커★6 한정. 강제 동결(냉기/자연 소모)+치명타 변신 말뚝딜 궁(220)+빙점. 주스탯 지능·보조 민첩
  zhuangfangyi: { id: "zhuangfangyi", name: "장방이", cls: "striker", hp: 2689, attack: 110, speed: 62, ultCost: 240 },
  arcane: { id: "arcane", name: "결", cls: "caster", hp: 2689, attack: 110, speed: 67, ultCost: 100 }, // 자연 캐스터★6 한정. 듀얼폼(지능≥의지=진결·지혜 딜폼 고정) 광역 부착·부식 누킹. 주스탯 지능·보조 의지 // 전기 스트라이커★6 한정. 청뢰검(감전 소모→검, 최대9)+변신 궁(천리의 경지)+지속딜. 주스탯 의지·보조 지능
};

// 매 유닛 신선한 상태 객체(중첩 객체 공유 참조 방지). defense/resist 기본 0 → 밸런스 무변.
const zero = () => ({ physBreak: 0, stagger: 0, staggered: false, staggerTimer: 0, statuses: [] as DDUnit["statuses"], dot: 0, multiHit: 0, ultCharge: 0, atkBuff: 0, critRate: 0.05, critDmg: 0.5, arts: { heat: 0, electric: 0, cryo: 0, nature: 0 }, frozen: 0, amp: {}, vuln: {}, recv: {}, resShred: 0, weakenMul: 1, protection: 0, shield: 0, speedMod: 0, timers: {}, effectSrc: {}, linkCd: 0, defense: 0, resist: { physical: 0, heat: 0, electric: 0, cryo: 0, nature: 0 }, stance: 0, ironOath: 0, gaugeRecovered: 0, gearGrade: 60, procCount: 0, utilMult: 1, atb: 0 });

// 오퍼레이터 선택 UI용 메타(속성은 스킬의 비물리 아츠 속성에서 추론, 없으면 물리)
export type OpMeta = { id: string; name: string; cls: DDClass; element: "physical" | Element };
// 전투가 끝나도 유지되는 스택(procCount) — 원작에서 전투 밖으로 들고 나가는 것만.
// 레바테인 「녹아내린 불꽃」이 그렇다. 장방이 청뢰검·미브 삼형 같은 건 전투 내 자원이라 제외.
export const STACK_CARRY = new Set(["laevatain"]);

export const OPERATORS: OpMeta[] = Object.values(OP_BASE).map((b) => {
  const el = (SKILLS[b.id] ?? []).find((s) => s.element && s.element !== "physical")?.element ?? "physical";
  return { id: b.id, name: b.name, cls: b.cls, element: el as "physical" | Element };
});

// 오퍼별 기본공격(일반 공격) — 실제 명칭·연타/속성(operators-source). 게임 엔진은 공용 BASIC로 처리하되 표시는 고유 이름으로.
export const OP_BASIC: Record<string, { name: string; note: string }> = {
  chenqianyu: { name: "파비하", note: "물리 단타" }, lifeng: { name: "업보 파괴", note: "물리 단타" },
  endministrator: { name: "훼손 시퀀스", note: "물리 단타" }, estella: { name: "노이즈", note: "물리 단타" },
  rossi: { name: "끓어오르는 늑대의 피", note: "물리 단타" }, mifu: { name: "검권 합일", note: "물리 단타" },
  arclight: { name: "추적 사냥", note: "물리 단타" }, alesh: { name: "캐스팅의 기본", note: "물리 단타" },
  akekuri: { name: "진취의 검날", note: "물리 단타" }, camu: { name: "피의 속죄", note: "열기 단타" },
  pogranichnik: { name: "전면 공세", note: "물리 단타" }, ember: { name: "돌진 검술", note: "물리 단타" },
  snowshine: { name: "저체온 강타", note: "물리 단타" }, catcher: { name: "기초 전술", note: "물리 단타" },
  ardelia: { name: "바위의 속삭임", note: "자연 단타" }, xaihi: { name: "쿨타임", note: "냉기 단타" },
  antal: { name: "교환 전류", note: "전기 단타" }, gilberta: { name: "비전 지팡이 · 에너지 제어", note: "자연 단타" },
  perlica: { name: "프로토콜α · 돌파", note: "전기 단타" }, wulfgard: { name: "다중 연사", note: "열기 단타" },
  fluorite: { name: "독자적인 사격술", note: "자연 단타" }, tangtang: { name: "정신 똑바로 차려!", note: "냉기 단타" },
  lastrite: { name: "혹한의 춤", note: "냉기 단타" }, avywenna: { name: "썬더랜스 · 신속 공격", note: "물리 단타" },
  dapan: { name: "돌려가며 썰기!", note: "물리 단타" }, laevatain: { name: "재", note: "열기 단타" },
  yvonne: { name: "점프 트리거", note: "냉기 단타" }, zhuangfangyi: { name: "전격술", note: "전기 단타" },
  arcane: { name: "중화력 요격", note: "자연 5단" },
};

// 오퍼 얼굴 아이콘 경로 — 관리자만 avatar1.webp, 나머지는 avatar.webp
export const avatarUrl = (id: string) => `/operators/${id}/${id === "endministrator" ? "avatar1" : "avatar"}.webp`;
export const fullUrl = (id: string) => `/operators/${id}/${id === "endministrator" ? "full1" : "full"}.webp`; // 전신 아트(스포트라이트)

// 오퍼 스킬 아이콘(public/operators/{id}/skills). 스킬 종류 → 파일.
const SKILL_ICON_FILE: Record<string, string> = { attack: "normal", battle: "battle", link: "combo", ult: "ultimate" };
export const skillIcon = (opId: string, kind: string) => `/operators/${opId}/skills/${SKILL_ICON_FILE[kind] ?? "normal"}.webp`;

// 적 이미지(public/enemies). id가 곧 slug, 철자/명칭 다른 것만 오버라이드.
const ENEMY_IMG: Record<string, string> = {
  "acid-slug": "acid-originium-slug", "firemist-slug": "firemist-originium-slug",
  "rakerbeast": "spotted-rakerbeast", "manglerbeast": "armored-manglerbeast",
  "bk-raider": "bonekrusher-raider", "bk-pyromancer": "bonekrusher-pyromancer",
  "bk-ballista": "bonekrusher-ballista", "bk-executioner": "bonecrusher-executioner",
  "bk-siege": "bonekrusher-siegeknuckles", "marble-aggelo": "marble-aggelomoirai-awakened",
  "nefarith": "nefarith-bonekrusher",
};
export const enemyImage = (id: string) => { const base = id.split("#")[0]; return `/enemies/${ENEMY_IMG[base] ?? base}.webp`; };

// 아군 저항(공식 1.12): 민첩→물리, 지능→아츠 저항 = 1 − 1/(0.001×스탯+1). 4스탯을 gearGrade로 통합 치환,
// gearGrade(명함 ~60)를 실제 스탯 스케일로 복원(×10)해 원본 오퍼레이터 내구(≈37.5%) 재현. 좋은 장비=높은 저항.
export const allyResistFromGear = (gearGrade: number) => +(1 - 1 / (0.001 * gearGrade * 10 + 1)).toFixed(3);

// 오퍼레이터별 스탯 — warfarin.wiki Lv90 데이터마인 → DD 스케일 환산(평균 HP 2689·공격 110 유지). 직군 배율 폐기.
//  · HP = (기초 6000 + 힘×5) 원작 공식 → 힘 높은 오퍼(디펜더·물리) 탱, 낮은 오퍼 물렁. ×0.4032.
//  · 공격 = 기초 공격력 × (1 + 주요×0.005 + 보조×0.002) [공식 1.1 능력치 보너스] → 주스탯 큰 오퍼 고화력. ×0.1507. 기본 방어 0.
const OP_HP: Record<string, number> = {
  chenqianyu: 2653, lifeng: 2690, endministrator: 2690, estella: 2649, rossi: 2634, mifu: 2799,
  arclight: 2655, alesh: 2765, akekuri: 2661, camu: 2643, pogranichnik: 2641,
  ember: 2806, snowshine: 2759, catcher: 2806,
  ardelia: 2665, xaihi: 2616, antal: 2703, gilberta: 2616,
  perlica: 2621, wulfgard: 2774, fluorite: 2616, tangtang: 2690,
  lastrite: 2759, avywenna: 2655, dapan: 2803, laevatain: 2685, yvonne: 2601, zhuangfangyi: 2636,
  arcane: 2625,
};
const OP_ATTACK: Record<string, number> = {
  chenqianyu: 106, lifeng: 102, endministrator: 107, estella: 106, rossi: 118, mifu: 114,
  arclight: 104, alesh: 108, akekuri: 105, camu: 112, pogranichnik: 115,
  ember: 118, snowshine: 102, catcher: 108,
  ardelia: 109, xaihi: 100, antal: 107, gilberta: 120,
  perlica: 106, wulfgard: 103, fluorite: 108, tangtang: 118,
  lastrite: 114, avywenna: 105, dapan: 108, laevatain: 117, yvonne: 118, zhuangfangyi: 122,
  arcane: 114,
};

// 일반 공격 배율 = warfarin 실측 풀콤보(강평까지 전 단계 Lv9 합) / 100. 평타 1턴 = 콤보 1회.
// 단, "평타는 배틀 스킬보다 강하면 안 된다" 원칙 → 평타 ≤ 오퍼 최강 배틀 스킬 실뎀(base + 추가타/엔진보너스)로 상한.
//   추가타 큰 배틀(아크라이트 감전소모·울가 연소소모·레바 4스택폭발·이본 동결·아비웨나 투창)은 실뎀이 커서 평타 원본 유지.
//   추가타 없는 셋업/유틸 배틀(엠버 진군·아델리아·안탈·판·라라 세쉬카 등)만 그 배틀 배율로 캡.
// combat baseDamage가 BASIC(일반 공격)에 이 값을 쓴다(옛 고정 0.9 대체). 마스터리 비율은 BASIC.mst가 유지.
export const OP_BASIC_ATK: Record<string, number> = {
  chenqianyu: 2.53, lifeng: 2.81, endministrator: 2.78, estella: 2.34, rossi: 3.3, mifu: 3.77,
  camu: 2.86, akekuri: 2.34, alesh: 2.49, arclight: 2.39, pogranichnik: 2.96,
  ember: 3.12, snowshine: 3.84, catcher: 3.57, ardelia: 2.56, xaihi: 2.52, antal: 1.6,
  gilberta: 2.79, perlica: 2.69, wulfgard: 3.39, fluorite: 2.58, tangtang: 3.05,
  lastrite: 2.56, avywenna: 2.5, dapan: 2.4, laevatain: 2.82, yvonne: 3.19, zhuangfangyi: 2.97,
};

// 스킬 표시 배율은 base뿐이라 추가타(엔진 보너스)가 숨어 헷갈림 → 표시용 추가타 라벨(%)을 돌려준다.
const EXTRA_HARDCODED: Record<string, string> = {
  "lae-b": "4스택 폭발 +342%",       // 레바테인 화염(불꽃의 심장)
  "mf-b2": "강타 피해",             // 미브 추형
  "mf-b3": "강타(방어 불능 소모)",     // 미브 개천
  "adm-b": "강타(방어 불능 소모 대량)", // 관리자 구성 시퀀스
  "adm-l": "결정 파괴 +178%",        // 관리자 봉인 시퀀스
  "adm-u": "결정 파괴 +267%",        // 관리자 폭격 시퀀스
  "lf-u": "연타 소모 +267%",         // 여풍 궁
  "zfy-b": "청뢰검 비례 뇌격",        // 장방이 뇌정의 부름
  "dp-l": "강타(+10%)",             // 판 조미료
};
export function skillExtraHit(sk: DDSkill): string | null {
  if (sk.shockBonus) return `감전 소모 +${Math.round(sk.shockBonus.power * 100)}%`;   // 아크라이트 질풍
  if (sk.burnShockConsume) return `연소·감전 소모 +${Math.round(sk.burnShockConsume * 100)}%`; // 울가 탄흔
  if (sk.cryoNuke) return `냉기 소모 +${Math.round(sk.cryoNuke * 100)}%/스택`;         // 라라 겨울 포식자
  if (sk.lanceRecover) return "투창 회수(수 비례 폭딜)";                                // 아비웨나 가로채기
  if (sk.iceBomb) return "동결 소모 +냉기(스택 비례)";                                  // 이본 얼음 폭탄
  if (sk.lure) return `린수 강화 ${Math.round(sk.lure.power * 100)}%`;                 // 알레쉬 얼음 낚시
  return EXTRA_HARDCODED[sk.id] ?? null;
}

// 오퍼별 실제 능력치(endfield.wiki.gg Lv90 Elite max 실측). 힘→최대HP·민첩→물리저항·지능→아츠저항·의지→회복량.
export type OpAttrs = { str: number; agi: number; int: number; wil: number };
// 오퍼별 주요/보조 능력치 — **공략 시트 「주,부옵」 컬럼 실측**(고정값).
// 능력치 상위 2개로 추론하면 안 된다: 울프가드(시트 힘,민첩 vs 상위2 힘,의지)·아케쿠리·에스텔라·아비웨나 4명이 어긋난다.
// 원작 공식: 공격력 = 기초 × (1 + 주요×0.005 + 보조×0.002)
export const OP_MAINSUB: Record<string, [keyof OpAttrs, keyof OpAttrs]> = {
  laevatain: ["int", "str"], ember: ["str", "wil"], wulfgard: ["str", "agi"], akekuri: ["agi", "int"], camu: ["agi", "int"],
  yvonne: ["int", "agi"], lastrite: ["str", "wil"], tangtang: ["agi", "str"], snowshine: ["str", "wil"], xaihi: ["wil", "int"],
  alesh: ["str", "int"], estella: ["wil", "str"], zhuangfangyi: ["wil", "int"], avywenna: ["wil", "agi"], perlica: ["int", "wil"],
  arclight: ["agi", "int"], antal: ["int", "str"], gilberta: ["wil", "int"], ardelia: ["int", "wil"], fluorite: ["agi", "int"],
  pogranichnik: ["wil", "agi"], lifeng: ["agi", "str"], endministrator: ["agi", "str"], rossi: ["agi", "int"],
  chenqianyu: ["agi", "str"], dapan: ["str", "wil"], catcher: ["str", "wil"], mifu: ["str", "wil"],
  arcane: ["int", "wil"],
};
// 능력치 → 공격력 보너스(원작 공식). 주/부옵은 OP_MAINSUB 고정.
export const attrBonusOf = (id: string, a: OpAttrs): number => {
  const ms = OP_MAINSUB[id];
  if (!ms) { const s = [a.str, a.agi, a.int, a.wil].sort((x, y) => y - x); return 1 + s[0] * 0.005 + s[1] * 0.002; }
  return 1 + a[ms[0]] * 0.005 + a[ms[1]] * 0.002;
};

export const OP_ATTRS: Record<string, OpAttrs> = {
  laevatain: { str: 121, agi: 99, int: 177, wil: 89 }, ember: { str: 176, agi: 96, int: 86, wil: 120 },
  camu: { str: 102, agi: 160, int: 129, wil: 92 }, wulfgard: { str: 161, agi: 95, int: 92, wil: 111 },
  yvonne: { str: 82, agi: 128, int: 176, wil: 105 }, lastrite: { str: 155, agi: 104, int: 93, wil: 109 },
  zhuangfangyi: { str: 99, agi: 99, int: 123, wil: 184 }, avywenna: { str: 107, agi: 106, int: 110, wil: 148 },
  endministrator: { str: 123, agi: 140, int: 96, wil: 107 }, lifeng: { str: 123, agi: 132, int: 115, wil: 117 },
  mifu: { str: 173, agi: 92, int: 90, wil: 119 }, rossi: { str: 97, agi: 176, int: 118, wil: 89 },
  chenqianyu: { str: 106, agi: 171, int: 85, wil: 93 }, estella: { str: 104, agi: 97, int: 110, wil: 151 },
  snowshine: { str: 154, agi: 104, int: 93, wil: 108 }, catcher: { str: 176, agi: 96, int: 86, wil: 106 },
  ardelia: { str: 112, agi: 93, int: 145, wil: 118 }, gilberta: { str: 89, agi: 92, int: 127, wil: 171 },
  xaihi: { str: 89, agi: 91, int: 127, wil: 150 }, antal: { str: 129, agi: 86, int: 165, wil: 82 },
  tangtang: { str: 123, agi: 179, int: 85, wil: 102 }, perlica: { str: 91, agi: 93, int: 161, wil: 113 },
  fluorite: { str: 90, agi: 168, int: 114, wil: 91 }, dapan: { str: 175, agi: 96, int: 94, wil: 102 },
  pogranichnik: { str: 101, agi: 110, int: 97, wil: 173 }, alesh: { str: 158, agi: 95, int: 125, wil: 89 },
  arclight: { str: 107, agi: 145, int: 123, wil: 100 }, akekuri: { str: 110, agi: 140, int: 106, wil: 108 },
  arcane: { str: 91, agi: 93, int: 176, wil: 121 }, // 지능 176 > 의지 121 → 진결·지혜(딜) 폼 고정
};
// 속도(턴 순서)는 오퍼레이터 개별 값(OP_BASE.speed, 실 민첩 기반) 사용 — makeAlly 참조.

// 능력치 → 파생 스탯. 원작은 능력치가 **공격력 공식 하나로만** 흐른다:
//   공격력 = 기초 × (1 + 주요×0.005 + 보조×0.002)   ← OP_ATTACK에 오퍼 고유분이 이미 반영, 장비/무기분은 gear/weapons가 가산
//   HP     = 6000 + 힘×5                            ← OP_HP에 반영
// 즉 힘/지능/의지에 별도 +알파 배율을 얹을 필요가 없다(중복). 속도만 우리 턴제용 각색.
export function applyAttrs(u: DDUnit): void {
  const a = u.attrs;
  if (!a) return;
  // 속도는 오퍼레이터 **고유 민첩**(OP_ATTRS, 장비·무기 제외)에서 온다. 장비 민첩은 공격력에만 흐르므로
  // 이중 수혜가 없다 — 빠른 오퍼는 타고난 특성이고 빌드로 못 바꾼다. 민첩 86~179 → 속도 55~74.
  u.speed = Math.round((OP_ATTRS[u.id]?.agi ?? 100) * 0.20 + 48);
  u.strMul = 1; u.skillAttrMul = 1; u.wilMul = 1; u.healRecv = 1; // +알파 폐지 — 능력치는 공격력/HP로만
  u.utilMult = u.utilBase ?? u.utilMult ?? 1;
}

setAttrBonus(attrBonusOf); // 장비 능력치 → 공격력 계산에 주/부옵 고정표 사용
setMainSub((id) => OP_MAINSUB[id]); // "주요/보조 능력치 +N%" 부가옵이 붙을 능력치
setApplyAttrs(applyAttrs); // gear가 장비 능력치 합산 후 속도를 다시 계산하도록 주입

export function makeAlly(id: string, pos: number, progress: OpProgress = DEFAULT_PROGRESS): DDUnit {
  const b = OP_BASE[id];
  const pm = promoMult(progress.promotion); // 정예화 → 기초 스탯 배율
  const hp = Math.round((OP_HP[id] ?? b.hp) * pm);
  const u: DDUnit = { ...b, side: "ally", pos, hp, maxHp: hp, staggerMax: 0, ...zero() }; // 불균형 없음. HP=6000+힘×5 환산·방어 0
  u.hp = hp; u.maxHp = hp; // zero()가 hp를 덮지 않도록 재확정
  u.attack = Math.round((OP_ATTACK[id] ?? b.attack) * pm * skillMult(0)); // 공격력 스탯 = 실ATK(Lv90×정예화) × M0(×1.8). mst 스킬 피해는 combat이 realAtk(=÷1.8)로 되돌려 Lv9 배율을 곱한다
  u.basicAtk = OP_BASIC_ATK[id] ?? 0.9; // 일반 공격 실측 풀콤보 배율(강평까지)
  u.skillRanks = { ...progress.skillRanks }; // 기본/배틀/연계/궁 각각의 마스터리 랭크
  u.utilBase = 1; u.utilMult = 1; // 유틸은 act()에서 사용 스킬 종류의 랭크로 매 행동 재설정(의지 배율 포함)
  u.opElement = (SKILLS[id] ?? []).find((s) => s.element && s.element !== "physical")?.element ?? "physical"; // 주력 속성(장비 부품 속성 피해)
  u.attrs = OP_ATTRS[id]; // 실제 능력치(힘/민첩/지능/의지)
  applyAttrs(u); // 능력치 → 역할 배율(힘=기본공격 / 민첩=속도 / 주옵=스킬 / 의지=유틸·궁충)
  if (!u.attrs) u.speed = b.speed;
  if (id === "catcher" && u.attrs) u.defense += Math.round(u.attrs.wil * 0.12); // 카치르 강인한 방어선: 의지 10당 방어력 +1.2
  u.resist = attrResists(u.gearGrade); // 저항은 장비 능력치만 — 오퍼 능력치는 관여 안 함
  if (b.artsImmune) u.artsImmune = b.artsImmune; // 만물의 지혜(아크라이트): 아츠 부착 확률 면역
  if (b.cryoImmune) u.cryoImmune = b.cryoImmune; // 이유 있는 게으름(에스텔라): 냉기 부착 면역
  return u;
}

export function alliesPhysical(): DDUnit[] {
  return [makeAlly("chenqianyu", 1), makeAlly("lifeng", 2), makeAlly("pogranichnik", 3), makeAlly("endministrator", 4)];
}


// ===== 적 데이터: namu.wiki 명일방주 엔드필드 적 문서 정합(세력·저항표·특수능력) =====
//  세력: 아겔로스(4번협곡 + 무릉="수화자")·랜드브레이커(본 크러셔)·청파채(창적)·야외 생물.
//  등급: 일반(normal)/강화(enhanced)/정예(elite~)/두목·우두머리(boss). 위키 Lv90 절대 스탯 대신 DD 스케일 티어 매핑.
//  저항: 속성별(물리/열기/전기/냉기/자연) 위키 저항표 반영 — 무릉=전기·냉기↑, 파조의 상=열기 약점 등.
export type EnemyTier = "common" | "normal" | "enhanced" | "advanced" | "alpha" | "elite" | "boss";
export type EnemyBehavior = "melee" | "snipe" | "aoe" | "heavy" | "heal" | "buff"; // 근접·저격·광역·중장·치유·강화
// 보스 페이즈 1단계. combat이 HP 변화를 보고 전환시킨다.
export type BossPhase = {
  name?: string;                    // 전환 후 표시명(컷신 연출용)
  at?: number;                      // 이 HP 비율 이하로 내려가면 전환
  refill?: boolean;                 // 체력바를 새로 채운다(페이즈별 독립 체력)
  becomes?: string;                 // 다른 EnemyDef로 교체
  summon?: { id: string; n: number; guarded?: boolean }; // 소환(+소환체 생존 중 본체 무적)
  atkMul?: number; spdMul?: number; // 발악 강화
  note?: string;
};
export type EnemyDef = {
  id: string; name: string; faction: string; role: string; tier: EnemyTier;
  element: "physical" | Element; behavior: EnemyBehavior;
  attach?: Element;      // 명중 시 아군에 아츠 부착(수화자 냉기·본크러셔 열기 등)
  bind?: boolean;        // 잡기/속박: 명중 시 확률로 아군 시간 정지 1턴(형상아겔로스·처형자·겁운객)
  resist?: Partial<Record<"physical" | Element, number>>; // 위키 저항표(속성별, 음수=약점). 미지정 속성=0
  // ── 고유 특징(traits) 메커니즘 — warfarin 실측 특징을 DD 근사 ──
  traits?: string[];     // 특징 설명(적 상세 UI 표시)
  freeze?: boolean;      // 명중 시 아군 동결(조류아겔로스 — 냉기 능력)
  selfDestruct?: number; // 사망 시 광역 자폭(배율) + 취약 부착(화염원석충)
  shell?: number;        // 방어 형태(0~1 피해 감소): 은신/웅크림 방어. 강타·갑옷파괴·불균형으로 해제 → 취약(산성원석충·무장 맹글러·삼미아겔로스)
  rage?: boolean;        // 분노: HP 50% 미만 시 공격력↑, 불균형 진입 시 해제(프릭비스트·레이커비스트·거대 록하울러)
  revive?: boolean;      // 부활: 사망 후 1회 재생(잔영)
  pull?: boolean;        // 끌어당김: 고위협 딜러를 강제 타격 + 취약(결정아겔로스)
  summon?: boolean;      // 소환: 전투 중 부하 추가(삼미아겔로스 돌기둥·록하울러 무리 등)
  dotBurst?: boolean;    // 지속+폭발: 명중 시 지속 피해 후 폭발(본 크러셔 사수)
  unstoppable?: boolean; // 끊기 저항: 불균형 지속 단축(본 크러셔 파괴자)
  teleport?: boolean;    // 순간이동/회피: 근접 공격 회피(본 크러셔 염술사·침투자)
  stun?: boolean;        // 속박·기절: 명중 아군 확률 행동 불가(단운수·형상아겔로스·처형자)
  slow?: boolean;        // 감속: 명중 아군 ATB 속도 저하(모방아겔로스·겁운객)
  heal?: boolean;        // 치유: 자기 턴에 아군[적] 최저 체력 회복(겁운객)
  // ── 보스 페이즈(아카라이브 패턴 정리 기준) ──
  // 원작 보스는 호위 잡몹이 아니라 페이즈로 구성된다. 아래 조합으로 실제 구조를 표현한다.
  //  at      = HP 비율이 이 값 이하로 내려가면 전환(로댄 0.7, 마블 발악 0.25)
  //  refill  = 전환 시 체력바를 새로 채운다(트리아겔로스: 페이즈마다 별도 체력바)
  //  becomes = 다른 개체로 교체(본 크러셔 네파리스 → 정복자 네파리스)
  //  summon  = 전환 시 잡몹 소환. guarded면 그들이 살아있는 동안 본체 무적(트리아겔로스 2페)
  //  atkMul/spdMul = 발악 강화(마블 3페)
  phases?: BossPhase[];
  guardedBy?: { id: string; n: number };  // 개전 시 호위 부위가 먼저 나오고, 전부 처치해야 본체를 때릴 수 있다(마블 촉수 4개)
  buff?: boolean;        // 동료 강화: 자기 턴에 다른 적 공격력 강화(굴절아겔로스)
  charge?: boolean;      // 차징: 한 턴 강공 예고 → 다음 턴 강타(끊으면 캔슬)
};

// 티어 기준 스탯(DD 스케일: 아군 hp≈2689·공격≈100 대역에 맞춤)
const TIER_STATS: Record<EnemyTier, { hp: number; attack: number; speed: number; staggerMax: number; defense: number }> = {
  common:   { hp: 418,  attack: 105, speed: 62, staggerMax: 40,  defense: 100 },
  normal:   { hp: 541, attack: 120, speed: 60, staggerMax: 46,  defense: 100 },
  enhanced: { hp: 795, attack: 145, speed: 58, staggerMax: 66,  defense: 100 },
  advanced: { hp: 1144, attack: 168, speed: 55, staggerMax: 96,  defense: 100 },
  alpha:    { hp: 1443, attack: 208, speed: 52, staggerMax: 116, defense: 100 },
  elite:    { hp: 2059, attack: 242, speed: 50, staggerMax: 146, defense: 100 },
  boss:     { hp: 6136, attack: 250, speed: 60, staggerMax: 236, defense: 100 },
};

// 아군 저항(≈37.5%) 도입에 따른 적 공격 보정: 아군 실피해 유지(1/(1−저항)≈1.5). 원본 손맛(큰 raw→저항 경감).
const ENEMY_ATK_COMP = 2.8;
// 아군 스킬9(×1.8) + 풀 장비 + GEAR_ATTR 0.3(단조 반영)으로 파티 딜 상승 → 적 체력 상향으로 도전성 부여.
// 2.65→2.9: GEAR_ATTR를 0.2→0.3으로 올려 단조를 살린 만큼의 딜 폭주를 적 HP로 상쇄(풀장비 승률 92→88%).
const ENEMY_HP_COMP = 3.3;

// 적 컨셉(역할) → 속도 아키타입 + 우선 타겟. 턴 순서·조준을 컨셉에 맞춰 전략성 부여.
//  any=무지향(무작위) / wounded=저체력%(부상 딜러 마무리) / threat=최고위협(강화된 딜러 직격)
// any=무지향(무작위) / wounded=저체력 우선 / threat=최고위협 우선.
// 전열/후열 개념을 없애면서 "front"(위치 낮은 아군 우선)를 "any"로 바꿨다.
export type EnemyTarget = "any" | "wounded" | "threat";
export function enemyArchetype(role: string, behavior: string): { spd: number; tgt: EnemyTarget } {
  const has = (k: string) => role.includes(k);
  // 대구경 포격·포탑·중화기·공성: 굼뜨지만 후방 고위협(딜러) 직격
  if (has("포격") || has("포탑")) return { spd: -15, tgt: "threat" };
  if (has("공성") || has("중화기")) return { spd: -13, tgt: "threat" };
  if (has("중장")) return { spd: -18, tgt: "any" };                                  // 최저속, 무지향
  if (has("저격") || has("사격") || has("투척") || has("처형")) return { spd: 12, tgt: "wounded" }; // 기민, 부상자 저격/처형
  if (has("돌격") || has("포식")) return { spd: 16, tgt: "any" };                     // 최고속 강습
  if (has("근접") || has("약탈") || has("야수")) return { spd: 9, tgt: "any" };        // 빠른 근접
  if (has("증폭")) return { spd: 12, tgt: "any" };                                    // 지원: 빠른 반응
  if (has("연막")) return { spd: 7, tgt: "wounded" };
  if (has("술사")) return { spd: 3, tgt: "any" };
  if (has("자폭")) return { spd: -8, tgt: "any" };                                    // 굼뜬 폭탄
  if (has("원석충")) return { spd: -4, tgt: "wounded" };
  if (has("동결") || has("변신")) return { spd: 0, tgt: "any" };                       // 제어형 중속
  if (has("최종") || has("두목")) return { spd: 13, tgt: "threat" };                     // 보스: 고속 위협
  if (has("우두머리") || has("채주")) return { spd: -9, tgt: "any" };                   // 보스: 둔중
  const byBeh: Record<string, { spd: number; tgt: EnemyTarget }> = {                    // 폴백(behavior)
    heavy: { spd: -14, tgt: "any" }, snipe: { spd: 10, tgt: "wounded" }, aoe: { spd: -4, tgt: "any" },
    heal: { spd: 6, tgt: "wounded" }, buff: { spd: 10, tgt: "any" }, melee: { spd: 6, tgt: "any" },
  };
  return byBeh[behavior] ?? { spd: 0, tgt: "any" };
}

// warfarin 데이터마인 실측(Lv100) — [최대 생명력, 공격력]. 이름으로 매칭한 74종.
// 이 값을 그대로 쓰지 않고 **티어 평균 대비 비율**로만 쓴다(우리 게임의 난이도 밴드를 유지하면서
// 개체 간 상대 강약만 원작과 맞추기 위해서다). makeEnemy가 tier 평균으로 정규화한다.
export const ENEMY_DM: Record<string, [number, number]> = {
  "cloud-obliterator": [1325201, 4620],
  "effigy": [993901, 4620],
  "bk-ballista": [993901, 5081],
  "heavy-ram-alpha": [993901, 5081],
  "rakerbeast": [883467, 4620],
  "heavy-sting-alpha": [872424, 4158],
  "heavy-ram": [662600, 4620],
  "heavy-sting": [585297, 3465],
  "marble-appendage": [187737, 4158],
  "walking-chrysopolis": [1104334, 4158],
  "bk-executioner": [883467, 4620],
  "hill-smasher": [883467, 4158],
  // 마블은 데이터마인에 항목이 2개(1,656,501/2,310 · 3,533,869/5,497) — 코어(1페)와 본체다.
  // 우리는 페이즈 시스템이 상승분을 담당하므로 1페 값을 기준으로 쓴다(큰 값을 쓰면 이중 계산).
  "marble-aggelo": [1656501, 2310],
  "rhodagn-the-bonekrushing-fist": [2760835, 4620],
  "ruan-yi": [2650402, 4620],
  "nefarith-conqueror": [2098235, 2772],
  "nefarith": [1877368, 3234],
  "craghowler": [1601284, 3696],
  "triaggelos": [1104334, 4620],
  "tidalklast": [1104334, 4620],
  "mudflow-delta": [231910, 2079],
  "ram-alpha": [165650, 3234],
  "sting-alpha": [165650, 2541],
  "hedron-delta": [165650, 2079],
  "mudflow": [143563, 1848],
  "falsewings-alpha": [132520, 2079],
  "hedron": [121477, 1848],
  "ram": [110433, 2310],
  "sting": [110433, 1848],
  "falsewings": [88347, 1848],
  "glaring-rakerbeast": [1490851, 5081],
  "tidewalker-delta": [1490851, 5081],
  "hazefyre-axe-armorbeast": [1435634, 5081],
  "elite-executioner": [1325201, 7391],
  "skydrummer": [1325201, 4620],
  "axe-armorbeast": [1104334, 4620],
  "tidewalker": [993901, 4620],
  "bk-siege": [993901, 1848],
  "manglerbeast": [938684, 2310],
  "breaking-gust": [883467, 3927],
  "sentinel": [331300, 3465],
  "quillbeast": [993901, 3118],
  "bonekrusher-arsonist": [662600, 3465],
  "quillbeastx": [662600, 2772],
  "bk-pyromancer": [607384, 3465],
  "cloud-stalker": [607384, 3465],
  "nimbus-razor": [607384, 3465],
  "tunneling-nidwyrm": [552167, 3927],
  "prism": [88347, 1848],
  "enyx": [706774, 2310],
  "highway-reaver": [231910, 3003],
  "elite-raider": [231910, 3465],
  "brutal-pincerbeast": [220867, 2079],
  "blazemist-originium-slug": [215345, 2079],
  "elite-ambusher": [209823, 2656],
  "hazefyre-claw": [198780, 2541],
  "acid-originium-slug-alpha": [198780, 2079],
  "elite-ripptusk": [182215, 2772],
  "bk-raider": [154607, 2541],
  "road-plunderer": [154607, 2310],
  "hazefyre-tuskbeast": [154607, 2310],
  "firemist-slug": [143563, 1848],
  "bonekrusher-ambusher": [143563, 1963],
  "grove-archer": [143563, 1963],
  "bonekrusher-infiltrator": [132520, 2310],
  "indigenous-pincerbeast": [132520, 1848],
  "bonekrusher-vanguard": [132520, 1848],
  "sweeping-wind": [132520, 2310],
  "acid-slug": [121477, 1848],
  "bonekrusher-ripptusk": [121477, 2079],
  "rockhowler": [110433, 924],
  "waterlamp": [88347, 1848],
  "aethillu": [88347, 3465],
  "eny": [1, 1155],
};

// 티어별 데이터마인 평균(HP, 공격) — 이 값으로 정규화해 티어의 난이도 밴드를 유지한다.
const DM_AVG_CACHE: Record<string, [number, number]> = {};
function tierDmAvg(tier: EnemyTier): [number, number] {
  const c = DM_AVG_CACHE[tier];
  if (c) return c;
  const ids = Object.keys(ENEMY_DEFS).filter((k) => ENEMY_DEFS[k].tier === tier && ENEMY_DM[k]);
  const n = Math.max(1, ids.length);
  const hp = ids.reduce((a, k) => a + ENEMY_DM[k][0], 0) / n;
  const atk = ids.reduce((a, k) => a + ENEMY_DM[k][1], 0) / n;
  return (DM_AVG_CACHE[tier] = [hp || 1, atk || 1]);
}

export function makeEnemy(def: EnemyDef, pos: number): DDUnit {
  const b = TIER_STATS[def.tier];
  let { hp, attack, speed, staggerMax, defense } = b;
  hp = Math.round(hp * ENEMY_HP_COMP);
  attack = Math.round(attack * ENEMY_ATK_COMP);
  // 개체별 강약은 behavior 계수가 아니라 **원본 실측 비율**로 정한다.
  // 기존엔 heavy x1.15 / aoe x0.72 같은 임의 계수가 원본과 반대로 작용했다 —
  // 실측상 공격력이 가장 낮은 거대한 록하울러(3696)가 우리 게임에선 최강(805)이 되어 있었다.
  const dm = ENEMY_DM[def.id];
  if (dm) {
    const avg = tierDmAvg(def.tier);
    hp = Math.round(hp * (dm[0] / avg[0]));
    attack = Math.round(attack * (dm[1] / avg[1]));
    if (def.behavior === "heavy") staggerMax = Math.round(staggerMax * 1.25); // 불균형만 역할 보정 유지
  } else {
    // 데이터마인에 없는 개체(자리표시·변형)만 기존 역할 계수로 근사한다.
    if (def.behavior === "heavy") { hp = Math.round(hp * 1.35); attack = Math.round(attack * 1.15); staggerMax = Math.round(staggerMax * 1.25); }
    else if (def.behavior === "snipe") { if (def.tier !== "boss") hp = Math.round(hp * 0.8); }
    else if (def.behavior === "aoe") { attack = Math.round(attack * 0.72); }
    else if (def.behavior === "heal") { attack = Math.round(attack * 0.5); hp = Math.round(hp * 0.9); }
    else if (def.behavior === "buff") { attack = Math.round(attack * 0.7); }
  }
  // 컨셉(역할) 속도 아키타입: 돌격·기민형↑ / 포격·중장형↓ → 턴 순서 전략성 (최저 20)
  speed = Math.max(20, speed + enemyArchetype(def.role, def.behavior).spd);
  const u: DDUnit = { ...zero(), id: `${def.id}#${pos}`, name: def.name, side: "enemy", pos, hp, maxHp: hp, speed, attack, staggerMax, ultCost: 999 };
  // 아군 자동 타겟 처치 우선순위: 지원(치유·증폭)=3 최우선 제거 대상 / 원거리(저격·광역)=2 / 전열(근접·중장)=1
  u.killPriority = def.behavior === "heal" || def.behavior === "buff" ? 3 : def.behavior === "snipe" || def.behavior === "aoe" ? 2 : 1;
  u.defense = defense;
  u.resist = { physical: 0, heat: 0, electric: 0, cryo: 0, nature: 0, ...def.resist };
  const tr = ENEMY_TRAITS[def.name]; // 고유 특징 메커니즘을 유닛에 반영
  if (tr?.selfDestruct) u.selfDestruct = tr.selfDestruct;
  if (tr?.shell) u.shell = tr.shell;
  if (tr?.revive) u.revive = true;
  if (tr?.pull) u.pull = true;
  if (tr?.summon) u.summon = true;
  if (tr?.dotBurst) u.dotBurst = true;
  if (tr?.unstoppable) u.unstoppable = true;
  if (tr?.teleport) u.teleport = true;
  if (tr?.stun) u.stun = true;
  if (tr?.slow) u.slow = true;
  if (tr?.heal) u.heal = true;
  if (tr?.buff) u.buff = true;
  if (tr?.charge) u.charge = true;
  if (def.tier === "alpha" || def.tier === "elite" || def.tier === "boss") u.poiseKnot = true; // 정예·보스: 불균형 지점(게이지 중간 돌파 시 1회 중단)
  if (tr?.attach) u.attachEl = tr.attach;
  return u;
}

// 인스턴스 id(`key#pos`)에서 정의 조회
export const enemyDefFor = (unitId: string): EnemyDef | undefined => {
  const base = ENEMY_DEFS[unitId.split("#")[0]];
  if (!base) return base;
  const tr = ENEMY_TRAITS[base.name]; // 고유 특징(traits + 메커니즘) 병합
  return tr ? { ...base, ...tr } : base;
};

// 저항값은 warfarin.wiki 데이터마인(damageTakenScalar) 정합: DD resist = 1 − scalar. S=1.0/A=0.8/B=0.5/C=0.2/D=0 저항.
export const ENEMY_DEFS: Record<string, EnemyDef> = {
  // ── 야외 생물: 탈로스 II 야생·감염수. 다수가 물리·자연·냉기·전기 저항 보유 → 열기 약점(열기 오퍼 특효) ──
  rockhowler:       { id: "rockhowler",       name: "록하울러",         faction: "야외 생물", role: "야수",   tier: "normal",   element: "physical", behavior: "melee", resist: { physical: 0.2, nature: 0.2, cryo: 0.2, electric: 0.2 } },
  "acid-slug":      { id: "acid-slug",        name: "산성원석충",       faction: "야외 생물", role: "원석충", tier: "normal",   element: "nature",   behavior: "snipe", attach: "nature" }, // 저항 0
  "firemist-slug":  { id: "firemist-slug",    name: "화염원석충",       faction: "야외 생물", role: "자폭",   tier: "normal",   element: "heat",     behavior: "aoe",   resist: { physical: 0.2, heat: 0.2, nature: 0.2 } },
  quillbeast:       { id: "quillbeast",       name: "활성화된 프릭비스트", faction: "야외 생물", role: "돌격", tier: "enhanced", element: "heat",     behavior: "heavy", resist: { nature: 0.2, cryo: 0.2 } },
  rakerbeast:       { id: "rakerbeast",       name: "백안의 레이커비스트", faction: "야외 생물", role: "포식", tier: "advanced", element: "physical", behavior: "melee", resist: { heat: 0.2, electric: 0.2 } },
  manglerbeast:     { id: "manglerbeast",     name: "무장 맹글러",      faction: "야외 생물", role: "중장",   tier: "elite",    element: "physical", behavior: "heavy", resist: { physical: 0.2, nature: 0.2, cryo: 0.2, electric: 0.2 } }, // 열기 약점
  // ── 아겔로스(4번 협곡): 헤일로 구조체. 일반=저항 0, 강화형부터 물리·열기·자연 0.2. 반사 장갑 ──
  ram:              { id: "ram",              name: "큰뿔아겔로스",     faction: "아겔로스", role: "돌격", tier: "common",   element: "physical", behavior: "heavy" }, // 일반: 저항 0
  sting:            { id: "sting",            name: "일미아겔로스",     faction: "아겔로스", role: "투척", tier: "common",   element: "physical", behavior: "snipe" }, // 일반: 저항 0
  "heavy-sting":    { id: "heavy-sting",      name: "삼미아겔로스",     faction: "아겔로스", role: "포격", tier: "advanced", element: "physical", behavior: "snipe", resist: { physical: 0.2, heat: 0.2, nature: 0.2 } },
  effigy:           { id: "effigy",           name: "형상아겔로스",     faction: "아겔로스", role: "변신", tier: "advanced", element: "physical", behavior: "melee", bind: true, resist: { physical: 0.2, heat: 0.2, nature: 0.2 } },
  sentinel:         { id: "sentinel",         name: "보초아겔로스",     faction: "아겔로스", role: "포탑", tier: "elite",    element: "physical", behavior: "snipe", resist: { physical: 0.2, heat: 0.2, nature: 0.2 } },
  // ── 수화자(무릉 아겔로스): 수생 형성 모델. 전 개체 전기·냉기 0.2 저항(데이터마인 정합). 냉기 부착·보호·동결 ──
  mudflow:          { id: "mudflow",          name: "탁류아겔로스",     faction: "수화자", role: "돌격",   tier: "common",   element: "cryo",     behavior: "snipe", attach: "cryo", resist: { electric: 0.2, cryo: 0.2 } },
  hedron:           { id: "hedron",           name: "수정아겔로스",     faction: "수화자", role: "사격",   tier: "common",   element: "cryo",     behavior: "snipe", attach: "cryo", resist: { electric: 0.2, cryo: 0.2 } },
  prism:            { id: "prism",            name: "굴절아겔로스",     faction: "수화자", role: "증폭",   tier: "enhanced", element: "cryo",     behavior: "buff",  resist: { electric: 0.2, cryo: 0.2 } }, // 주변 아겔로스 보호
  tidewalker:       { id: "tidewalker",       name: "조류아겔로스",     faction: "수화자", role: "동결",   tier: "elite",    element: "cryo",     behavior: "melee", attach: "cryo", resist: { electric: 0.2, cryo: 0.2 } },
  // ── 랜드브레이커(본 크러셔): 무장 약탈 집단. 대부분 무저항, 염술사=자연/파괴자=4속성(데이터마인) ──
  "bk-raider":      { id: "bk-raider",        name: "본 크러셔 약탈자", faction: "랜드브레이커", role: "근접", tier: "normal",   element: "heat", behavior: "melee" }, // 저항 0
  "bk-pyromancer":  { id: "bk-pyromancer",    name: "본 크러셔 염술사", faction: "랜드브레이커", role: "술사", tier: "enhanced", element: "heat", behavior: "aoe",  attach: "heat", resist: { nature: 0.5 } },
  "bk-ballista":    { id: "bk-ballista",      name: "본 크러셔 사수",   faction: "랜드브레이커", role: "저격", tier: "advanced", element: "heat", behavior: "snipe" }, // 저항 0
  "bk-executioner": { id: "bk-executioner",   name: "본 크러셔 처형자", faction: "랜드브레이커", role: "처형", tier: "alpha",    element: "heat", behavior: "melee", bind: true }, // 저항 0
  "bk-siege":       { id: "bk-siege",         name: "본 크러셔 파괴자", faction: "랜드브레이커", role: "공성", tier: "elite",    element: "heat", behavior: "heavy", resist: { physical: 0.2, heat: 0.2, electric: 0.2, cryo: 0.2 } }, // 자연 약점
  // ── 청파채(창적): 홍산 관할 불법 무장 세력. 정예는 4속성 저항 → 물리 약점(데이터마인) ──
  "highway-reaver": { id: "highway-reaver",   name: "막석명",           faction: "청파채", role: "약탈",   tier: "normal",   element: "physical", behavior: "melee" }, // 저항 0
  "cloud-stalker":  { id: "cloud-stalker",    name: "겁운객",           faction: "청파채", role: "연막",   tier: "enhanced", element: "physical", behavior: "heal", resist: { heat: 0.2, electric: 0.2, cryo: 0.2, nature: 0.2 } }, // 물리 약점
  "hill-smasher":   { id: "hill-smasher",     name: "최산장",           faction: "청파채", role: "중화기", tier: "alpha",    element: "heat",     behavior: "aoe",  resist: { heat: 0.2, electric: 0.2, cryo: 0.2, nature: 0.2 } }, // 물리 약점
  "cloud-obliterator": { id: "cloud-obliterator", name: "개천장",       faction: "청파채", role: "중화기", tier: "advanced", element: "heat",     behavior: "aoe",  resist: { heat: 0.2, electric: 0.2, cryo: 0.2, nature: 0.2 } }, // 물리 약점
  // ── 보스: 본편 검증 스토리 보스(저항 데이터마인 정합) ──
  craghowler:       { id: "craghowler",       name: "거대한 록하울러",   faction: "야외 생물", role: "우두머리", tier: "boss", element: "physical", behavior: "heavy", resist: { physical: 0.2, nature: 0.2, cryo: 0.2, electric: 0.2 } }, // 열기 약점
  triaggelos:       { id: "triaggelos",       name: "트리아겔로스",      faction: "아겔로스", role: "삼형태(3P)", tier: "boss", element: "physical", behavior: "aoe", resist: { physical: 0.2, heat: 0.2, nature: 0.2 },
    // 1페 근접·차지 → 2페 잡몹전(소형 아겔로스 소환, 소환체 생존 중 본체 무적) → 3페 은신·원거리.
    // 페이즈마다 체력바가 새로 찬다(원문: "1페이즈의 체력을 전부 깎으면 코어 색이 변하며 2페이즈로").
    phases: [
      { name: "트리아겔로스 · 2페이즈", refill: true, summon: { id: "sting", n: 3, guarded: true }, note: "잡몹전 — 소환체가 남아있는 동안 본체 무적" },
      { name: "트리아겔로스 · 3페이즈", refill: true, spdMul: 1.15, note: "은신·원거리" },
    ] }, // 광맥 구역 보스
  "marble-aggelo":  { id: "marble-aggelo",    name: "마블 아겔로미레",   faction: "아겔로스", role: "4번협곡 최종", tier: "boss", element: "physical", behavior: "snipe",
    // 1페: 촉수 4개를 먼저 처치해야 코어가 노출된다 → 코어 격파 시 2페 본체 → 25%에서 3페 발악.
    guardedBy: { id: "marble-appendage", n: 4 },
    phases: [{ name: "마블 아겔로미레 · 발악", at: 0.25, atkMul: 1.3, spdMul: 1.15, note: "3페이즈 — 호전성 증가, 패턴 강화" }] }, // 저항 0(인간형)
  nefarith:         { id: "nefarith",         name: "'본 크러셔' 네파리스", faction: "랜드브레이커", role: "두목", tier: "boss", element: "electric", behavior: "aoe", attach: "electric",
    // 원작: 본 크러셔 네파리스(1페) → 정복자 네파리스(2페)로 개체가 바뀐다.
    phases: [{ name: "'정복자' 네파리스", becomes: "nefarith-conqueror", refill: true, note: "2페이즈 — 정복자로 각성" }] }, // 저항 0
  "ruan-yi":        { id: "ruan-yi",          name: "원일",             faction: "청파채", role: "채주(탕탕 오빠)", tier: "boss", element: "heat", behavior: "heavy", resist: { heat: 0.2, cryo: 0.2 } },
  // 파조의 상은 원작에서도 "중간보스" — 런을 끝내는 보스가 아니라 정예 조우 급이다.
  tidalklast:       { id: "tidalklast",       name: "파조의 상",         faction: "수화자", role: "중간보스", tier: "elite", element: "cryo", behavior: "aoe", attach: "cryo", resist: { electric: 0.2, cryo: 0.2 } },
  // ── 미등록 44종(warfarin 대조 추가) — 변형은 원본 상속, 신규는 description 속성 + id 접미사 behavior ──
  "tunneling-nidwyrm": { id: "tunneling-nidwyrm", name: "터널링 니드웜", faction: "야외 생물", role: "melee", tier: "enhanced", element: "nature", behavior: "melee", resist: {"heat":0.3} },
  "heavy-ram": { id: "heavy-ram", name: "쌍뿔아겔로스", faction: "아겔로스", role: "heavy", tier: "advanced", element: "physical", behavior: "heavy", resist: {"physical":0.2,"nature":0.2,"heat":0.2} },
  "bonekrusher-ambusher": { id: "bonekrusher-ambusher", name: "본 크러셔 저격수", faction: "랜드브레이커", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "bonekrusher-arsonist": { id: "bonekrusher-arsonist", name: "본 크러셔 집행자", faction: "랜드브레이커", role: "aoe", tier: "enhanced", element: "heat", behavior: "aoe", resist: {"nature":0.5} },
  "bonekrusher-infiltrator": { id: "bonekrusher-infiltrator", name: "본 크러셔 침투자", faction: "랜드브레이커", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "bonekrusher-ripptusk": { id: "bonekrusher-ripptusk", name: "본 크러셔 립터스크", faction: "랜드브레이커", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "rhodagn-the-bonekrushing-fist": { id: "rhodagn-the-bonekrushing-fist", name: "'본 크러셔의 주먹' 로댄", faction: "랜드브레이커", role: "melee", tier: "boss", element: "heat", behavior: "heavy",
    // 원작: HP 70%에서 컷신과 함께 2페이즈 — 등의 화염방사기를 적극 사용한다.
    phases: [{ name: "로댄 · 2페이즈", at: 0.7, atkMul: 1.25, note: "화염방사기 개방" }] },
  "road-plunderer": { id: "road-plunderer", name: "막류재", faction: "청파채", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "eny": { id: "eny", name: "야생의 터스크비스트", faction: "야외 생물", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "hazefyre-tuskbeast": { id: "hazefyre-tuskbeast", name: "안갯불에 물든 터스크비스트", faction: "안갯불", role: "melee", tier: "normal", element: "heat", behavior: "melee", resist: {"physical":0.2,"nature":0.2,"cryo":0.2,"electric":0.2,"heat":0.2} },
  "hazefyre-claw": { id: "hazefyre-claw", name: "안갯불에 물든 랜드브레이커", faction: "랜드브레이커", role: "buff", tier: "normal", element: "heat", behavior: "buff", resist: {"physical":0.2,"nature":0.2,"cryo":0.2,"electric":0.2,"heat":0.2} },
  // 마블 촉수 — 보스 본체가 아니라 파괴 대상 "부위"다. 4개가 동시에 나오므로 보스 티어면 과하다.
  "marble-appendage": { id: "marble-appendage", name: "마블 부속체", faction: "아겔로스", role: "부위", tier: "advanced", element: "physical", behavior: "melee" },
  "ram-alpha": { id: "ram-alpha", name: "큰뿔아겔로스 · α", faction: "아겔로스", role: "heavy", tier: "common", element: "physical", behavior: "heavy" },
  "sting-alpha": { id: "sting-alpha", name: "일미아겔로스 · α", faction: "아겔로스", role: "snipe", tier: "common", element: "physical", behavior: "snipe" },
  "elite-raider": { id: "elite-raider", name: "약탈자 · 정예", faction: "랜드브레이커", role: "melee", tier: "normal", element: "heat", behavior: "melee" },
  "elite-ambusher": { id: "elite-ambusher", name: "저격수 · 정예", faction: "랜드브레이커", role: "melee", tier: "normal", element: "heat", behavior: "melee" },
  "elite-ripptusk": { id: "elite-ripptusk", name: "립터스크 · 정예", faction: "랜드브레이커", role: "melee", tier: "normal", element: "heat", behavior: "melee" },
  "elite-executioner": { id: "elite-executioner", name: "처형자 · 정예", faction: "랜드브레이커", role: "heavy", tier: "elite", element: "heat", behavior: "heavy" },
  "heavy-ram-alpha": { id: "heavy-ram-alpha", name: "쌍뿔아겔로스 · α", faction: "아겔로스", role: "heavy", tier: "advanced", element: "physical", behavior: "heavy", resist: {"physical":0.2,"nature":0.2,"heat":0.2} },
  "heavy-sting-alpha": { id: "heavy-sting-alpha", name: "삼미아겔로스 · α", faction: "아겔로스", role: "snipe", tier: "advanced", element: "physical", behavior: "snipe", resist: {"physical":0.2,"nature":0.2,"heat":0.2} },
  "axe-armorbeast": { id: "axe-armorbeast", name: "엑스 아머비스트", faction: "야외 생물", role: "melee", tier: "elite", element: "physical", behavior: "melee" },
  "indigenous-pincerbeast": { id: "indigenous-pincerbeast", name: "원시 핀서비스트", faction: "야외 생물", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "bonekrusher-vanguard": { id: "bonekrusher-vanguard", name: "본 크러셔 돌격수", faction: "랜드브레이커", role: "heavy", tier: "normal", element: "physical", behavior: "heavy", resist: {"physical":0.2} },
  "falsewings": { id: "falsewings", name: "모방아겔로스", faction: "아겔로스", role: "snipe", tier: "common", element: "physical", behavior: "snipe" },
  "walking-chrysopolis": { id: "walking-chrysopolis", name: "결정아겔로스", faction: "아겔로스", role: "heavy", tier: "alpha", element: "physical", behavior: "heavy", resist: {"physical":0.2,"nature":0.2,"electric":0.2,"heat":0.2} },
  "nefarith-conqueror": { id: "nefarith-conqueror", name: "'정복자' 네파리스", faction: "랜드브레이커", role: "melee", tier: "boss", element: "physical", behavior: "melee" },
  "enyx": { id: "enyx", name: "엘 아이그니스", faction: "야외 생물", role: "aoe", tier: "normal", element: "physical", behavior: "aoe" },
  "skydrummer": { id: "skydrummer", name: "천고", faction: "야외 생물", role: "heavy", tier: "elite", element: "physical", behavior: "heavy" },
  "grove-archer": { id: "grove-archer", name: "천림전", faction: "청파채", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "nimbus-razor": { id: "nimbus-razor", name: "할운옹", faction: "청파채", role: "melee", tier: "enhanced", element: "physical", behavior: "melee", resist: {"physical":0.4,"electric":0.2,"heat":0.2} },
  "quillbeastx": { id: "quillbeastx", name: "프릭비스트", faction: "야외 생물", role: "melee", tier: "enhanced", element: "electric", behavior: "melee", resist: {"nature":0.2,"cryo":0.2} },
  "waterlamp": { id: "waterlamp", name: "수등충", faction: "야외 생물", role: "snipe", tier: "normal", element: "nature", behavior: "snipe", resist: {"cryo":0.2,"heat":0.2} },
  "aethillu": { id: "aethillu", name: "잔영", faction: "아다시르", role: "melee", tier: "normal", element: "physical", behavior: "melee", resist: {"physical":0.2,"nature":0.2,"cryo":0.2,"electric":0.2,"heat":0.2} },
  "hazefyre-axe-armorbeast": { id: "hazefyre-axe-armorbeast", name: "안갯불에 물든 엑스 아머비스트", faction: "야외 생물", role: "melee", tier: "elite", element: "heat", behavior: "melee" },
  "brutal-pincerbeast": { id: "brutal-pincerbeast", name: "브루탈 핀서비스트", faction: "야외 생물", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "acid-originium-slug-alpha": { id: "acid-originium-slug-alpha", name: "산성원석충 · α", faction: "야외 생물", role: "snipe", tier: "normal", element: "nature", behavior: "snipe" },
  "falsewings-alpha": { id: "falsewings-alpha", name: "모방아겔로스 · α", faction: "아겔로스", role: "snipe", tier: "common", element: "physical", behavior: "snipe" },
  "glaring-rakerbeast": { id: "glaring-rakerbeast", name: "분노의 레이커비스트", faction: "야외 생물", role: "melee", tier: "elite", element: "heat", behavior: "melee", resist: {"electric":0.2,"heat":0.2} },
  "sweeping-wind": { id: "sweeping-wind", name: "과당풍", faction: "청파채", role: "melee", tier: "normal", element: "physical", behavior: "melee" },
  "breaking-gust": { id: "breaking-gust", name: "단운수", faction: "청파채", role: "melee", tier: "elite", element: "physical", behavior: "melee", resist: {"physical":0.6,"electric":0.2,"heat":0.2} },
  "mudflow-delta": { id: "mudflow-delta", name: "탁류아겔로스 · δ", faction: "아겔로스", role: "snipe", tier: "common", element: "cryo", behavior: "snipe", resist: {"cryo":0.2,"electric":0.2} },
  "hedron-delta": { id: "hedron-delta", name: "수정아겔로스 · δ", faction: "아겔로스", role: "snipe", tier: "common", element: "cryo", behavior: "snipe", resist: {"cryo":0.2,"electric":0.2} },
  "tidewalker-delta": { id: "tidewalker-delta", name: "조류아겔로스 · δ", faction: "아겔로스", role: "melee", tier: "elite", element: "cryo", behavior: "melee", resist: {"cryo":0.2,"electric":0.2} },
  "blazemist-originium-slug": { id: "blazemist-originium-slug", name: "용암원석충", faction: "야외 생물", role: "aoe", tier: "normal", element: "heat", behavior: "aoe", resist: {"physical":0.2,"nature":0.2,"heat":0.2} },
  // 그림자에 물든(파운데이션·알레이크레오스 세력) — warfarin enemies 1.4. 저항 = 실측/100(전기 저항↑)
  "shadowtusk":     { id: "shadowtusk",     name: "그림자에 물든 터스크비스트", faction: "그림자에 물든", role: "침식 야수", tier: "enhanced", element: "physical", behavior: "melee", resist: { physical: 0.2, electric: 0.35 } },
  "shadowquill":    { id: "shadowquill",    name: "그림자에 물든 프릭비스트",   faction: "그림자에 물든", role: "침식 야수", tier: "enhanced", element: "electric", behavior: "melee", attach: "electric", resist: { physical: 0.2, electric: 0.35 } },
  "shadowraker":    { id: "shadowraker",    name: "그림자에 물든 레이커비스트", faction: "그림자에 물든", role: "침식 야수", tier: "advanced", element: "electric", behavior: "melee", attach: "electric", resist: { physical: 0.2, electric: 0.35 } },
  "shadowthunder":  { id: "shadowthunder",  name: "그림자에 물든 진뢰",         faction: "그림자에 물든", role: "침식 소환수", tier: "advanced", element: "electric", behavior: "heavy", attach: "electric", resist: { physical: 0.2, electric: 0.35 } },
  "shadowyingvan":  { id: "shadowyingvan",  name: "그림자에 물든 응룡 대원 · 선봉", faction: "그림자에 물든", role: "침식 근접병", tier: "normal", element: "physical", behavior: "melee", resist: { physical: 0.2 } },
  "shadowyingelite":{ id: "shadowyingelite",name: "그림자에 물든 응룡 대원 · 정예", faction: "그림자에 물든", role: "침식 정예병", tier: "advanced", element: "physical", behavior: "melee", resist: { physical: 0.2, electric: 0.35 } },
  "shadowyingbrk":  { id: "shadowyingbrk",  name: "그림자에 물든 응룡 대원 · 돌파", faction: "그림자에 물든", role: "침식 돌파병", tier: "enhanced", element: "physical", behavior: "melee", resist: { physical: 0.2 } },
  "shadowyingcap":  { id: "shadowyingcap",  name: "그림자에 물든 응룡 대장",     faction: "그림자에 물든", role: "침식 지휘관", tier: "alpha", element: "electric", behavior: "heavy", attach: "electric", resist: { physical: 0.2, electric: 0.35 } },
  "alleikhreos":    { id: "alleikhreos",    name: "알레이크레오스, 천부장",       faction: "그림자에 물든", role: "천부장(최종보스)", tier: "boss", element: "physical", behavior: "heavy", resist: { physical: 0.2, heat: 0.2, electric: 0.2, cryo: 0.2, nature: 0.2,
},
    // 원작: 최종보스 2페이즈 구성.
    phases: [{ name: "알레이크레오스 · 2페이즈", refill: true, atkMul: 1.2, note: "천부장 각성" }] },
};
