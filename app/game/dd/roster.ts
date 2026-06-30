// ===== DD류 물리 4인 + 적 정의 (프로토타입) =====
// 스킬은 위키 매핑. 사용 요구(requires)가 카드 모델에서 깨지던 "연계 조건"을 DD류에선 자연 흡수.
import { bumpVuln, vulnFor, setTimer, applyBuff, ELEMENTS, type DDClass, type DDSkill, type DDUnit } from "./combat";

export const SKILLS: Record<string, DDSkill[]> = {
  // 진천우: 최고 방불 누적 + 고계수 단일 누커(보스 삭제기). 빠른 선딜(차지 캔슬)·평타 속도.
  // 재능: 칼날 베기(스킬마다 공격력 +8%, 최대 5스택=+40%, rampAtk) · 흐름 끊기(차지 끊기 추가 불균형, 차지 미모델).
  chenqianyu: [
    // 귀궁우(배틀 169%, 불균형 10): 올려치기 띄우기. 자체 방불 빌드.
    { id: "cqy-b", name: "귀궁우", kind: "battle", fromPos: [1, 2, 3, 4], target: "single-front", power: 1.69, element: "physical", staggerVal: 10, anomaly: "launch", note: "올려치기·띄우기(자체 빌드)" },
    // 견천하(연계 120%, 쿨 16초): 방어 불능 적일 때. 관통 돌진(경로 모든 적) 띄우기. 게이지 무소모.
    { id: "cqy-l", name: "견천하", kind: "link", fromPos: [1, 2, 3, 4], target: "row", power: 1.2, element: "physical", staggerVal: 10, cooldown: 3, anomaly: "launch", requires: (t) => !!t && t.physBreak > 0, requiresText: "방어 불능 적", note: "관통 돌진·띄우기" },
    // 예풍상(궁 671%=36×6+455, 불균형 35, 게이지 70): 7단 단일 누킹. 보스 삭제기(현 최고 단일 계수).
    { id: "cqy-u", name: "예풍상", kind: "ult", fromPos: [1, 2], target: "single-lowhp", power: 6.71, element: "physical", staggerVal: 35, selfUlt: true, note: "7단 단일 누킹(보스 삭제기)" },
  ],
  // 여풍: 물리 파티 올라운더(가드). 넘어뜨리기로 방불 빌드 + 물리취약(딜버프) + 복마 추가타 + 연타 궁 폭딜.
  // 재능: 돈오(지능+의지→공격력, attack에 baked) · 복마(넘어뜨리기마다 +공격력 100% 물리, selfPhysBonus).
  lifeng: [
    // 신체 정화(배틀 38+38+119%=1.95, 불균형 10): 전방 AoE + 넘어뜨리기. 방불 없는 적에게만 물리취약 5%(위키 조건).
    { id: "lf-b", name: "신체 정화", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 1.95, element: "physical", staggerVal: 10, anomaly: "knockdown", selfPhysBonus: 1.0,
      apply: (t) => { if (t.physBreak === 0) bumpVuln(t, "physical", 0.05); }, note: "AoE 넘어뜨리기+물리취약(방불 0일 때)+복마" },
    // 분노의 형상(연계 47+167%=2.14, 불균형 10, 쿨 16초): 물리취약/갑옷파괴 적 강일 시. 20초 연타 획득.
    { id: "lf-l", name: "분노의 형상", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.14, element: "physical", staggerVal: 10, cooldown: 3,
      requires: (t) => !!t && (vulnFor(t, "physical") > 0 || t.statuses.includes("armor-break")), requiresText: "물리취약/갑옷파괴 적",
      apply: (_t, self) => { self.multiHit = Math.min(4, self.multiHit + 1); }, note: "연타 획득" },
    // 움직이지 않는 마음(궁 178+178%=3.56, 불균형 15): 광역 넘어뜨리기 몹몰이. 연타 소모 추가 267%(엔진 MH_ULT). 복마.
    { id: "lf-u", name: "움직이지 않는 마음", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 3.56, element: "physical", staggerVal: 15, anomaly: "knockdown", selfPhysBonus: 1.0, selfUlt: true, note: "광역 넘어뜨리기 몹몰이 + 연타 소모 폭딜 + 복마" },
  ],
  // 관리자: 페이오프(가드의 탈을 쓴 물리 스트라이커). 자체 방불 부여 전무 → 팀이 쌓은 방불을 강타로 터트림.
  // 봉인(연계, 아군 연계 후 사용)으로 오리지늄 결정 부착 → 강타/궁극/물리이상으로 결정 파괴(추가 물리) + 본질 붕괴(+30%).
  // 재능: 본질 붕괴(결정 소모 시 공격력 +30%, 엔진) · 현실 정지(결정 부착 적 물리 +20%, 엔진).
  endministrator: [
    // 구성 시퀀스(배틀 156%, 불균형 10): 강타. 방불 스택 소모 대량 물리(아츠 강도=공격력 비례, 연타 미적용).
    { id: "adm-b", name: "구성 시퀀스", kind: "battle", fromPos: [1, 2, 3, 4], target: "row", power: 1.56, element: "physical", staggerVal: 10, anomaly: "crush", note: "강타: 방불 소모 대량 물리(주력기)" },
    // 봉인 시퀀스(연계 45%, 불균형 10, 결정 파괴 178%): 아군 연계가 피해를 줄 때만 사용. 결정 부착·봉인. 자체 방불 부여 없음.
    { id: "adm-l", name: "봉인 시퀀스", kind: "link", fromPos: [1, 2, 3, 4], target: "single-front", power: 0.45, element: "physical", staggerVal: 10, crystal: true,
      requires: (_t, self, s) => !!s.lastLinkAlly && s.lastLinkAlly !== self.id, requiresText: "아군 연계 후",
      note: "오리지늄 결정 부착·봉인" },
    // 폭격 시퀀스(궁 356% + 결정 파괴 267%, 불균형 25): 광역 대량 물리 + 결정 파괴 추가 물리(엔진).
    { id: "adm-u", name: "폭격 시퀀스", kind: "ult", fromPos: [1, 2, 3, 4], target: "all", power: 3.56, element: "physical", staggerVal: 25, selfUlt: true, note: "광역 대량 물리 + 결정 파괴" },
  ],
  // 에스텔라: 냉기/가드. 냉기 부착 + 동결→쇄빙(강제 띄우기) + 물리취약 + 방불. 동결 파트너 의존(자체 동결 불가).
  // 재능: 공감(쇄빙 시 게이지 반환 — 미구현) · 이유 있는 게으름(냉기 면역 — 미구현). 주스탯 의지.
  estella: [
    // 서스테인(배틀 150%, 불균형 10): 일직선 냉기 + 냉기 부착.
    { id: "est-b", name: "서스테인", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 1.5, element: "cryo", attach: "cryo", staggerVal: 10, note: "일직선 냉기 + 냉기 부착" },
    // 디스토션(연계 동결적 280%, 물취 10%, 쿨 18초): 동결 적일 때. 강제 띄우기(물리) → 동결 적이면 쇄빙(엔진) + 물리취약.
    { id: "est-l", name: "디스토션", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.8, element: "physical", staggerVal: 10, cooldown: 4, anomaly: "launch",
      requires: (t) => !!t && t.frozen > 0, requiresText: "동결 적",
      apply: (t) => bumpVuln(t, "physical", 0.1), note: "강제 띄우기 → 쇄빙 + 물리취약" },
    // 트레몰로(궁 489%, 불균형 15, 게이지 70): 원형 AoE 물리 + (물리취약 적)강제 띄우기.
    { id: "est-u", name: "트레몰로", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 4.89, element: "physical", staggerVal: 15, anomaly: "launch", selfUlt: true, note: "원형 AoE + 강제 띄우기" },
  ],
  // 로시: 물리/열기 하이브리드 가드(★6). 띄우기 방불 + 열기 부착 + 늑대의 발톱(DoT·취약) + 치명타 빌드.
  // ⚠ 치명타·회복(끓어오르는 피) 미모델 → 치명 버프는 atkBuff 근사. 방불+아츠부착 이중 조건이라 하이브리드 파티 필요.
  rossi: [
    // 붉은색의 그림자(배틀 85%, 불균형 5): 돌진 띄우기. 방불 적이면 진주(열기) + 절흔(늑대의 발톱: DoT+물리/열기 취약).
    { id: "ros-b", name: "붉은색의 그림자", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 0.85, element: "physical", staggerVal: 5, anomaly: "launch",
      // 진주 조건 = "이미 방불 보유"(띄우기 전). 띄우기가 항상 +1이므로 post>1 ⟺ pre≥1.
      apply: (t, self) => { if (t.physBreak > 1) { t.dot = Math.round(self.attack * (1 + (self.atkBuff || 0)) * 0.3); setTimer(t, "dot", 5); bumpVuln(t, "physical", 0.12); bumpVuln(t, "heat", 0.12); } },
      note: "돌진 띄우기 + (이미 방불 적)진주·늑대의 발톱(DoT 30%/턴 + 물리/열기 취약 12%)" },
    // 그림자가 타오르는 순간(연계 67+133%+소모비례 80%/스택, 쿨 15초): 방불+아츠부착 적. 아츠 소모 물리·띄우기 + 치명 버프.
    { id: "ros-l", name: "그림자가 타오르는 순간", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.5, element: "physical", staggerVal: 5, cooldown: 3, anomaly: "launch",
      requires: (t) => !!t && t.physBreak > 0 && ELEMENTS.some((e) => t.arts[e] > 0), requiresText: "방불+아츠부착 적",
      apply: (t, self) => { ELEMENTS.forEach((e) => (t.arts[e] = 0)); self.critRate = 0.3; self.critDmg = 1.0; setTimer(self, "critRate", 3); setTimer(self, "critDmg", 3); }, // 아츠 소모 + 치확+25%/치피+50%(15초)
      note: "아츠 소모 물리·띄우기 + 치명 버프(치확 30%/치피 100%)" },
    // 기습 '날카로운 발톱'(궁 275+111+333=719%, 불균형 25, 게이지 110): 다단 열기 누킹 + 열기 부착.
    { id: "ros-u", name: "기습 '날카로운 발톱'", kind: "ult", fromPos: [1, 2], target: "single-front", power: 7.19, element: "heat", attach: "heat", staggerVal: 25, selfUlt: true, note: "다단 열기 단일 누킹 + 열기 부착" },
  ],
  // 미브: 물리/양손검 가드. 청파 삼형(단운→추형→개천 3스탠스) + 물리취약 연계 + 방불 부여 궁.
  // 재능: 냉정(개천이 물취/불균형 적에 ×1.2) · 분노(연계 후 보호막 — 보호막 근사). 자체 방불 부여는 궁뿐 → 팀 방불 보조 필요.
  mifu: [
    // 단운(배틀, 게이지 100·환불 50): 포승줄 몹몰이. → 추형(스탠스 1) 전환.
    { id: "mf-b1", name: "청파 삼형·단운", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 0.67, element: "physical", staggerVal: 5, gaugeRefund: 50, setStanceTo: 1, note: "몹몰이 + 추형 전환(게이지 50 반환)" },
    // 추형(배틀, 게이지 50, 스탠스 1 요구): 강타. 방불 3+ 소모 시 → 개천(스탠스 2).
    { id: "mf-b2", name: "청파 삼형·추형", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 0.89, element: "physical", staggerVal: 5, gaugeCost: 50, requiresStance: 1, anomaly: "crush", stanceFromCrush: true, note: "강타 + (방불 3+ 소모)개천 전환" },
    // 개천(배틀, 게이지 50, 스탠스 2 요구): 주력 딜(강타 간주). 냉정: 물취/불균형 적 ×1.2.
    { id: "mf-b3", name: "청파 삼형·개천", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 4.0, element: "physical", staggerVal: 10, gaugeCost: 50, requiresStance: 2, vsWeak: 0.2, note: "주력 딜(강타 간주) · 냉정 ×1.2" },
    // 후회 없는 주먹(연계 111%, 쿨 20초): 방불 3+ 적. 물리취약 + 추형 전환.
    { id: "mf-l", name: "후회 없는 주먹", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.11, element: "physical", staggerVal: 10, cooldown: 4, setStanceTo: 1,
      requires: (t) => !!t && t.physBreak >= 3, requiresText: "방불 3+ 적", apply: (t) => bumpVuln(t, "physical", 0.05), note: "물리취약 + 추형 전환" },
    // 절심(궁 311%, 게이지 80): 강제 띄우기+넘어뜨리기(방불 부여) + 추형 전환.
    { id: "mf-u", name: "절심", kind: "ult", fromPos: [1, 2, 3], target: "single-front", power: 3.11, element: "physical", staggerVal: 20, selfUlt: true, anomaly: "knockdown", setStanceTo: 1, note: "방불 부여(넘어뜨리기) + 추형 전환" },
  ],
  // 카뮤: 열기/장병기 뱅가드(★6 한정, "다 떡칠"). 열기 부착+취약+허약 + 게이지 + 연타 + 회복 + 핏빛날개(배회 디버프).
  // 재능: 죄를 쫓는 자(연계가 날개 적 명중 시 회복+연타) · 혈류 소생(자기 회복 시 팀 열기 증폭). 주스탯 민첩.
  camu: [
    // 사르는 불꽃(배틀 89%, 불균형 10): 열기 + 열기 부착. 핏빛 날개 배회 → 허약 5% + 열기취약 5% + 날개 마킹.
    { id: "camu-b", name: "사르는 불꽃", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 0.89, element: "heat", attach: "heat", staggerVal: 10,
      apply: (t) => { applyBuff(t, "weaken", 0.05); bumpVuln(t, "heat", 0.05); if (!t.statuses.includes("wing")) t.statuses.push("wing"); setTimer(t, "wing", 8); }, note: "열기 부착 + 허약/열기취약 + 핏빛 날개" },
    // 영혼의 가시(연계 133%, 쿨 20초): 열기 부착 소모/흡수 후. 게이지 16. 죄를 쫓는 자(날개 적 → 회복+연타).
    { id: "camu-l", name: "영혼의 가시", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.33, element: "heat", staggerVal: 10, cooldown: 4, gaugeGain: 16,
      requires: (_t, _s, st) => !!st.anomalyConsumed, requiresText: "열기 부착 소모됨", note: "게이지 수급 + (날개 적)회복/연타" },
    // 선혈의 비(궁 267%, 게이지 130): 광역 열기 + 열기 부착 + 게이지. 추적 교체(근사).
    { id: "camu-u", name: "선혈의 비", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 2.67, element: "heat", staggerVal: 15, attach: "heat", selfUlt: true, gaugeGain: 32, note: "광역 열기 부착 + 게이지" },
  ],
  // 아케쿠리: 열기/한손검 뱅가드(★4, 탈4성 범용). 속성 무관 게이지 수급 — 불균형 조건 연계 + 무딜 궁(게이지 대량 회복) + 연타.
  // 재능: 승리의 함성(연계 게이지 +지능→장비등급) · 몰입의 시간(궁 지속 중 연타). 열기 부착도 보유.
  akekuri: [
    // 열정 분출(배틀 142%, 불균형 10): 열기 + 열기 부착.
    { id: "ake-b", name: "열정 분출", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.42, element: "heat", attach: "heat", staggerVal: 10, note: "열기 부착" },
    // 섬광 돌진(연계 80×2=160%, 쿨 10초): 불균형 상태/불균형 지점 적. 게이지 15(승리의 함성으로 증가).
    { id: "ake-l", name: "섬광 돌진", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.6, element: "physical", staggerVal: 10, cooldown: 2, gaugeGain: 15,
      requires: (t) => !!t && t.staggered, requiresText: "불균형 적", note: "딜타임 직전 게이지 수급(승리의 함성)" },
    // 소대, 집합!(궁, 게이지 120): 무딜. 게이지 대량 회복(58) + 연타 획득(몰입의 시간).
    { id: "ake-u", name: "소대, 집합!", kind: "ult", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, selfUlt: true, gaugeGain: 58, grantsMultiHit: 1, note: "게이지 대량 회복 + 연타(몰입의 시간, 소모 후 부여)" },
  ],
  // 알레쉬: 냉기/한손검 뱅가드(★5). 강제 동결(냉기 단독 동결!) + 게이지 수급 + 아츠이상/결정 소모 연계 + 린수 확률.
  // → 에스텔라 쇄빙 파티 핵심(동결 공급). 재능: 급속 냉동(동결 시 궁충) · 낚시의 달인(린수 확률, 지능→장비등급).
  alesh: [
    // 비정규 루어(배틀 200%, 불균형 10): 물리. 냉기 부착 적이면 냉기 소모 + 강제 동결 + 게이지(10/20/30/40).
    { id: "ale-b", name: "비정규 루어", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 2.0, element: "physical", staggerVal: 10, forceFreeze: true, note: "냉기 부착 적 → 강제 동결 + 게이지" },
    // 얼음 낚시 기술(연계 133%, 쿨 9초≈2턴): 아츠이상/결정 소모됐을 때. 게이지 10 + 린수 확률(강화 213% + 게이지).
    { id: "ale-l", name: "얼음 낚시 기술", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.33, element: "physical", staggerVal: 10, cooldown: 2, gaugeGain: 10, lure: { power: 2.13, gauge: 10 },
      requires: (_t, _s, st) => !!st.anomalyConsumed, requiresText: "아츠이상/결정 소모됨", note: "게이지 수급 + 린수 확률 강화" },
    // 월척이다!(궁 436%, 게이지 100): 광역 냉기 + 냉기 부착 + 게이지. 처치 시 추가 게이지.
    { id: "ale-u", name: "월척이다!", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 4.36, element: "cryo", staggerVal: 20, attach: "cryo", selfUlt: true, gaugeGain: 20, note: "광역 냉기 부착 + 게이지" },
  ],
  // 아크라이트: 전기/한손검 뱅가드(★5). 감전 소모 + 초단쿨(3초) 연계 게이지 수급 + 팀 전기 증폭(지능 비례, 근사).
  // 재능: 황무지의 방랑자(질풍 3회 발동 시 팀 전기 피해↑ — 미구현 근사) · 만물의 지혜(아츠 부착 면역 — 미구현).
  arclight: [
    // 질풍 섬광(배틀 45+45%, 불균형 10): 2회 베기. 감전 적이면 감전 소모 추가 전기(180%) + 게이지 30.
    { id: "arc-b", name: "질풍 섬광", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 0.9, element: "physical", staggerVal: 10, shockBonus: { power: 1.8, gauge: 30 }, note: "감전 적이면 추가 전기 + 게이지 수급" },
    // 천둥의 울림(연계 155%, 쿨 3초≈1턴): 감전 적/감전 소모됐을 때. 게이지 8 + 궁 에너지. ← 핵심(초단쿨 수급)
    { id: "arc-l", name: "천둥의 울림", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.55, element: "physical", staggerVal: 5, cooldown: 1, gaugeGain: 8,
      requires: (t) => !!t && t.statuses.includes("shock"), requiresText: "감전 적", note: "초단쿨 연계 게이지 수급" },
    // 천둥번개(궁 156+244%=400%, 게이지 90): 돌진 전기 + 전기 부착 → 폭파. 전기 부착 적이면 강제 감전.
    { id: "arc-u", name: "천둥번개", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 4.0, element: "electric", staggerVal: 7, attach: "electric", forceShock: true, selfUlt: true, note: "전기 부착 + 강제 감전" },
  ],
  // 포그라니치니크: 물리/한손검 뱅가드(유일 6성 뱅가드). 갑옷 파괴(유일) + 스킬 게이지 수급 + 불균형 누적.
  // 재능: 생존의 깃발(게이지 80 회복마다 사기 격양 — 미구현 근사) · 전술 지도. 자체 방불 부여는 궁뿐 → 팀 빌더 의존.
  pogranichnik: [
    // 전선 분쇄(배틀 86+106%=192%, 불균형 10): 갑옷 파괴(유일) + 방불 소모량 비례 게이지 회복(5/10/20/30).
    { id: "pg-b", name: "전선 분쇄", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 1.92, element: "physical", staggerVal: 10, anomaly: "armor-break", gaugeOnConsume: [5, 10, 20, 30], note: "갑옷 파괴 + 방불 소모 비례 게이지 회복" },
    // 보름달 참격(연계 42+54+66%=162%, 쿨 18초): 강타/갑옷파괴로 방불 소모됐을 때. 게이지 회복.
    { id: "pg-l", name: "보름달 참격", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.62, element: "physical", staggerVal: 11, cooldown: 4, gaugeGain: 25,
      requires: (t) => !!t && t.statuses.includes("armor-break"), requiresText: "갑옷파괴(방불 소모) 적", note: "단계별 베기 + 게이지 회복" },
    // 방패병 부대, 전진(궁 133%, 게이지 90): 몹몰이 진군 + 넘어뜨리기(방불) + 철의 서약 5포인트 부여(물리이상마다 교란/최후의 승부).
    { id: "pg-u", name: "방패병 부대, 전진", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 1.33, element: "physical", staggerVal: 10, anomaly: "knockdown", selfUlt: true, grantsIronOath: 5, note: "진군 몹몰이 + 방불 + 철의 서약 5(추가타 체인)" },
  ],
  // 엠버: 열기/양손검 디펜더(첫 6성 디펜더, "열기 탈을 쓴 물리 디펜더"). 넘어뜨리기 방불 + 치유·비호·팀 보호막. 느린 공속·수동적 피격 운용.
  // 재능: 전진의 결의(배틀/연계 시 50% 비호) · 강철에는 강철로(피격 시 공격력 +9%, 최대 3스택). 주스탯 힘·보조 의지(→장비등급, 치유 스케일).
  ember: [
    // 진군(배틀 173%, 불균형 10): 전방 부채꼴 열기 + 넘어뜨리기. 전진의 결의(비호). ⚠ 시전 중 피격 추가 불균형 미모델.
    { id: "emb-b", name: "진군", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 1.73, element: "heat", staggerVal: 10, anomaly: "knockdown", note: "부채꼴 열기 + 넘어뜨리기 + 비호" },
    // 전선에서의 지원(연계 102%, 쿨 19초≈4턴): 아군 피격 시. 넘어뜨리기 + 최저 체력 아군 치유(300+장비등급×0.7) + 비호.
    { id: "emb-l", name: "전선에서의 지원", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.02, element: "physical", staggerVal: 10, cooldown: 4, anomaly: "knockdown",
      requires: (_t, _s, st) => !!st.allyHit, requiresText: "아군 피격 후", note: "넘어뜨리기 + 아군 치유 + 비호" },
    // 다시 불타오르는 맹세(궁 289%, 불균형 25, 게이지 100): 광역 열기 + 팀 전체 보호막(엠버 최대 생명력 18%, 10초).
    { id: "emb-u", name: "다시 불타오르는 맹세", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 2.89, element: "heat", staggerVal: 25, selfUlt: true, note: "광역 열기 + 팀 보호막(최대 생명력 18%)" },
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
    { id: "snow-u", name: "살얼음 추위", kind: "ult", fromPos: [1, 2, 3], target: "row", power: 2.0, element: "cryo", staggerVal: 15, selfUlt: true, freezeZone: 1, note: "광역 냉기 + 강제 동결(부착 무관, 쇄빙 보조)" },
  ],
  // 카치르: 물리/양손검 디펜더(★4 배포). 정석 패링 탱커 — 반격 방어 불능 부여 + 보호막 + 허약/넘어뜨리기 궁. 엠버 하위 호환이나 2디펜더 안정성.
  // 재능: 강인한 방어선(의지→방어력, 보호막 스케일) · 전장을 꿰뚫는 통찰(궁 마지막 3회 충격파 ×45%). 주스탯 힘·보조 의지.
  catcher: [
    // 강력한 저지(배틀 178%, 게이지 100·반환 30): 자신+주변 90% 비호 + 반격 태세. 피격 시 반격 → 방어 불능 1스택(엔진).
    { id: "cat-b", name: "강력한 저지", kind: "battle", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, gaugeRefund: 30, note: "90% 비호 + 게이지 반환 + 반격 태세(피격 시 방어 불능)" },
    // 실시간 억제(연계 25+100%=125%, 쿨 35초≈7턴): 아군 HP 40% 이하/적 차지 시. 물리 + 자신+아군 보호막(360+방어력×2.25).
    { id: "cat-l", name: "실시간 억제", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.25, element: "physical", staggerVal: 10, cooldown: 7,
      requires: (_t, _self, st) => st.units.some((u) => u.side === "ally" && u.hp > 0 && u.hp / u.maxHp <= 0.4), requiresText: "아군 HP 40% 이하", note: "물리 + 자신+아군 보호막(방어력 비례)" },
    // 교과서적인 맹공(궁 89+120+178=387% + 충격파 3×45%=135% → 522%, 게이지 80): 다단 물리 + 허약 20% + 광역 넘어뜨리기.
    { id: "cat-u", name: "교과서적인 맹공", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 5.22, element: "physical", staggerVal: 20, selfUlt: true, anomaly: "knockdown",
      apply: (t) => applyBuff(t, "weaken", 0.2), note: "다단 물리 + 허약 + 광역 넘어뜨리기(전장을 꿰뚫는 통찰 충격파 포함)" },
  ],
  // 아델리아: 자연/아츠 유닛 서포터(★6 배포, 만능). 부식 셋업→소모로 물리+아츠 취약(30초) + 돌리 그림자 회복. 아츠 부착 없어 부착 파티와 무충돌.
  // 재능: 친구의 그림자(배틀/궁 명중 시 최저 체력 아군 회복) · 마운틴 서퍼(부식 소모 시 추가 배틀 1회, 근사). 주스탯 지능·보조 의지.
  ardelia: [
    // 질주하는 돌리(배틀 142%): 자연 돌진. 부식 적이면 소모 → 물리+아츠 취약 12%(30초≈6턴). 친구의 그림자(명중 시 회복).
    { id: "ard-b", name: "질주하는 돌리", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.42, element: "nature", staggerVal: 10,
      apply: (t) => { if (t.statuses.includes("corrosion")) { t.statuses = t.statuses.filter((x) => x !== "corrosion"); delete t.vuln.all; bumpVuln(t, "physical", 0.12, 6); bumpVuln(t, "arts", 0.12, 6); } }, note: "자연 + 부식 소모 → 물리/아츠 취약 + 회복(친구의 그림자)" },
    // 화산 분화(연계 45+111%=156%, 쿨 18초≈4턴): 방불·아츠부착 없는 적에 강일 후. 자연 + 주변 강제 부식 7초(취약 셋업).
    { id: "ard-l", name: "화산 분화", kind: "link", fromPos: [1, 2, 3], target: "all", power: 1.56, element: "nature", staggerVal: 10, cooldown: 4,
      requires: (t) => !!t && t.physBreak === 0 && ELEMENTS.every((e) => t.arts[e] === 0), requiresText: "방불·아츠부착 없는 적",
      apply: (t) => { bumpVuln(t, "all", 0.12, 3); if (!t.statuses.includes("corrosion")) t.statuses.push("corrosion"); }, note: "자연 + 강제 부식(취약 셋업)" },
    // 복슬복슬 파티(궁 73%×3≈219%, 게이지 90): 광역 다단 자연 + 확률 회복(친구의 그림자).
    { id: "ard-u", name: "복슬복슬 파티", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 2.19, element: "nature", staggerVal: 2, selfUlt: true, note: "광역 다단 자연 + 회복" },
  ],
  // 자이히: 냉기/아츠 유닛 서포터(★5, "냉기 파티의 꽃·7성"). 퓨어 힐 + 오버힐 아츠 증폭 + 냉기/자연 증폭궁 + 냉기 부착 연계. 강일 트리거(메인 의존).
  // 재능: 가동 프로세스(연계가 냉기/동결 적 명중 시 냉기 취약) · 프리징 프로토콜(궁이 팀 냉기부착/동결 정화 — 휴면). 주스탯 의지·보조 지능.
  xaihi: [
    // 디도스(배틀, 게이지 100): 지원 결정체 — 메인 치유(144+의지×0.34). 오버힐 시 아츠 증폭 9%(25초). 연계 활성(엔진 id훅).
    { id: "xai-b", name: "디도스", kind: "battle", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, note: "치유 + 오버힐 시 아츠 증폭 + 연계 활성" },
    // 스트레스 테스트(연계 200%, 쿨 8초≈2턴): 디도스 활성 시. 냉기 + 냉기 부착 + 가동 프로세스(냉기/동결 적 → 냉기 취약 10%).
    { id: "xai-l", name: "스트레스 테스트", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 2.0, element: "cryo", attach: "cryo", staggerVal: 10, cooldown: 2,
      requires: (_t, self) => (self.timers.didos || 0) > 0, requiresText: "디도스 활성",
      apply: (t) => { if (t.arts.cryo > 0 || t.frozen > 0) bumpVuln(t, "cryo", 0.1, 1); }, note: "냉기 부착 + 가동 프로세스(냉기 취약)" },
    // 스택 오버플로(궁, 게이지 80): 팀 전체 냉기 증폭 + 자연 증폭(12초, 지능→장비등급 비례, 상한 30%).
    { id: "xai-u", name: "스택 오버플로", kind: "ult", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, selfUlt: true, note: "팀 냉기/자연 증폭" },
  ],
  // 안탈: 전기/아츠 유닛 서포터(★4 범용, 초고성능). 전기+열기 취약(60초 단일 장지속) + 전기/열기 증폭궁 + 증폭 팀원 회복. 열기/전기팟 필수.
  // 재능: 즉흥적인 천재성(증폭 아군 스킬 피해 시 회복) · 무의식(30% 물리 면역 — 휴면). 주스탯 지능·보조 힘.
  antal: [
    // 지정 연구 대상(배틀 89%): 전기 단일 포커싱 + 전기 취약 + 열기 취약(60초≈12턴 장지속). 단일 1명 한정.
    { id: "ant-b", name: "지정 연구 대상", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 0.89, element: "electric", staggerVal: 10,
      apply: (t) => { bumpVuln(t, "electric", 0.05, 12); bumpVuln(t, "heat", 0.05, 12); }, note: "전기/열기 취약(60초 장지속)" },
    // 자기 폭풍 실험장(연계 151%, 쿨 25초≈5턴): 포커싱 적 물리이상/아츠부착 시. 전기 + 이상/부착 재부여(지속 갱신, 엔진 id훅).
    { id: "ant-l", name: "자기 폭풍 실험장", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.51, element: "electric", staggerVal: 10, cooldown: 5,
      requires: (t) => !!t && (t.physBreak > 0 || ELEMENTS.some((e) => t.arts[e] > 0)), requiresText: "물리이상/아츠부착 적", note: "전기 + 아츠부착/물리이상 갱신(폭발 유닛 시너지)" },
    // 오버클럭 타임(궁, 게이지 100): 팀 전체 전기 증폭 + 열기 증폭(12초). 즉발·저비용.
    { id: "ant-u", name: "오버클럭 타임", kind: "ult", fromPos: [1, 2, 3], target: "self", power: 0, staggerVal: 0, selfUlt: true, note: "팀 전기/열기 증폭" },
  ],
  // 질베르타: 자연/아츠 유닛 서포터(★6 한정, "서포터 1황"). 최고 아츠 취약궁(방불 비례) + 유일 배틀 몹몰이 + 강제 띄우기 연계 + 궁충 효율 재능. 누킹 딜러 시너지.
  // 재능: 전달자의 노래(필드 시 가드/캐스터/서포터 궁충 +7%, 엔진) · 뒤늦은 편지(배틀/연계 2+ 명중 시 회복). 주스탯 의지·보조 지능.
  gilberta: [
    // 중력 모드(배틀 인력97+폭발58=155%): 몹몰이 광역 자연 + 자연 부착. 뒤늦은 편지(2+ 명중 회복).
    { id: "gil-b", name: "비전 지팡이 · 중력 모드", kind: "battle", fromPos: [1, 2, 3], target: "all", power: 1.55, element: "nature", attach: "nature", staggerVal: 10, note: "몹몰이 광역 자연 + 자연 부착 + 회복(2+ 명중)" },
    // 매트릭스 이동(연계 140%, 쿨 20초≈4턴): 아츠 이상 적 있을 때. 광역 끌어당김 + 강제 띄우기(방불). 뒤늦은 편지.
    { id: "gil-l", name: "비전 지팡이 · 매트릭스 이동", kind: "link", fromPos: [1, 2, 3], target: "all", power: 1.4, element: "nature", staggerVal: 5, cooldown: 4, anomaly: "launch",
      requires: (t) => !!t && (t.frozen > 0 || t.dot > 0 || t.statuses.includes("shock") || t.statuses.includes("corrosion") || t.statuses.includes("combustion")), requiresText: "아츠 이상 적",
      note: "광역 강제 띄우기(방불) + 회복(2+ 명중)" },
    // 중력장(궁 333%, 게이지 90): 광역 자연 + 자연 부착 + 최고 아츠 취약(기초 18% + 방불 1스택당 1.75%) + 감속.
    { id: "gil-u", name: "비전 지팡이 · 중력장", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 3.33, element: "nature", attach: "nature", staggerVal: 20, selfUlt: true,
      apply: (t) => { bumpVuln(t, "arts", 0.18 + Math.min(4, t.physBreak) * 0.0175, 1); t.speedMod = (t.speedMod || 0) - 30; setTimer(t, "speedMod", 1); }, note: "광역 자연 부착 + 최고 아츠 취약(방불 비례) + 감속" },
  ],
  // 펠리카: 전기/아츠 유닛 캐스터(★5, 첫 캐스터·타이틀 히로인). 즉발 전기 부착 + 강제 감전 연계(아츠 취약) + 깡딜 궁 + 불균형 추가딜. 범용 아츠 서포터/서브딜.
  // 재능: 오블리터레이션 프로토콜(불균형 적 +30%, 엔진) · 순환 프로토콜(연계가 방불 적 추가 튕김 — 근사). 주스탯 지능·보조 의지.
  perlica: [
    // 프로토콜ω·뇌격(배틀 178%): 즉발 전기 + 전기 부착(좁은 범위, 빠른 발동).
    { id: "prl-b", name: "프로토콜ω · 뇌격", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.78, element: "electric", attach: "electric", staggerVal: 10, note: "즉발 전기 부착" },
    // 실시간 프로토콜·연쇄 섬광(연계 80%, 쿨 20초≈4턴): 메인 강일 후(상시). 전기 + 강제 감전(부착 무관 아츠 취약 12%).
    { id: "prl-l", name: "실시간 프로토콜 · 연쇄 섬광", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 0.8, element: "electric", staggerVal: 10, cooldown: 4, forceShock: true, note: "강제 감전(아츠 취약, 부착 무관)" },
    // 프로토콜ε·70.41κ(궁 445%, 게이지 80): 광역 깡딜 전기. 불균형 적엔 오블리터레이션 +30%.
    { id: "prl-u", name: "프로토콜ε · 70.41κ", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 4.45, element: "electric", staggerVal: 20, selfUlt: true, note: "광역 깡딜 전기(불균형 적 +30%)" },
  ],
  // 울프가드: 열기/권총 캐스터(★5, 로시의 오빠). 열기 부착 + 연소/감전 소모 추가타(고배율) + 강제 연소 궁 + 불타는 송곳니(연소 부여 시 열기 증폭). 레바테인/로시 열기팟 핵심.
  // 재능: 불타는 송곳니(연소 부여마다 자기 열기 +30%, 엔진) · 절제의 원칙(연소/감전 소모 시 게이지 +10, 엔진). 주스탯 힘·보조 민첩.
  wulfgard: [
    // 탄흔의 열기(배틀 102% + 추가 378%): 열기 + 마지막 열기 부착. 연소/감전 적이면 부착 대신 소모 → 대량 추가타 + 게이지.
    { id: "wlf-b", name: "탄흔의 열기", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.02, element: "heat", attach: "heat", staggerVal: 5, burnShockConsume: 3.78, note: "열기 부착 / 연소·감전 소모 대량 추가타" },
    // 폭렬 수류탄·β형(연계 60%, 쿨 20초≈4턴): 아츠 부착 적 있을 때. 범위 열기 + 열기 부착.
    { id: "wlf-l", name: "폭렬 수류탄 · β형", kind: "link", fromPos: [1, 2, 3], target: "row", power: 0.6, element: "heat", attach: "heat", staggerVal: 10, cooldown: 4,
      requires: (t) => !!t && ELEMENTS.some((e) => t.arts[e] > 0), requiresText: "아츠 부착 적", note: "범위 열기 부착(부착 셋업)" },
    // 늑대의 분노(궁 32%×5=160%, 게이지 90): 광역 다단 열기 + 강제 연소 + 불타는 송곳니.
    { id: "wlf-u", name: "늑대의 분노", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 1.6, element: "heat", staggerVal: 15, selfUlt: true, forceBurn: true, note: "광역 열기 + 강제 연소" },
  ],
  // 플루라이트: 자연/권총 캐스터(★4, Z7). 무료 다중 아츠 부착(연계/궁 게이지 무소모) + 감속 + 자연 부착. 다중 부착형 스트라이커(라스트 라이트) 보조. 긴 연계 쿨이 약점.
  // 재능: 몰락의 조력자(감속 적 +20%, 엔진) · 종잡을 수 없는 자(20% 아츠 면역+공격력 — 휴면). 주스탯 민첩·보조 지능.
  fluorite: [
    // 서프라이즈?(배틀 187%): 수제 폭탄 → 범위 자연 + 자연 부착 + 30% 감속.
    { id: "flr-b", name: "서프라이즈?", kind: "battle", fromPos: [1, 2, 3], target: "single-front", power: 1.87, element: "nature", attach: "nature", staggerVal: 10,
      apply: (t) => { t.speedMod = (t.speedMod || 0) - 30; setTimer(t, "speedMod", 2); }, note: "자연 부착 + 감속" },
    // 특별 보너스(연계 169%, 쿨 40초≈8턴 최장): 냉기/자연 2부착+ 적. 자연 + 같은 부착 1스택 추가(무료 부착 지원).
    { id: "flr-l", name: "특별 보너스", kind: "link", fromPos: [1, 2, 3], target: "single-front", power: 1.69, element: "nature", staggerVal: 10, cooldown: 8,
      requires: (t) => !!t && (t.arts.cryo >= 2 || t.arts.nature >= 2), requiresText: "냉기/자연 2부착+ 적", note: "자연 + 무료 아츠 부착(스택 추가)" },
    // 난장판으로 만들어주지(궁 111%×4=444%, 게이지 100): 광역 다단 자연. 2부착+ 적이면 같은 부착 추가.
    { id: "flr-u", name: "난장판으로 만들어주지", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 4.44, element: "nature", staggerVal: 20, selfUlt: true, note: "광역 다단 자연 + 무료 아츠 부착" },
  ],
  // 탕탕: 냉기/권총 캐스터(★6 한정). 즉발 냉기 부착(용오름) + 용오름 개수 비례 아츠 취약 + 와류(가속/감속) + 시간 정지 궁 + 준수한 서브딜. 냉기팟 핵심(라스트 라이트/이본 부착 보조).
  // 재능: 의기투합(와류 주변 아군 가속/적 감속, 엔진) · 풍랑의 주재자(낙하 공격 용오름 — 미모델). 주스탯 민첩·보조 힘.
  tangtang: [
    // 우당탕탕 파도!(배틀 사격 80% + 용오름 133% = 213%): 즉발 냉기 부착 + 용오름(와류 소모로 개수↑ → 아츠 취약·지속 냉기·게이지). 엔진 id훅.
    { id: "tt-b", name: "우당탕탕 파도!", kind: "battle", fromPos: [1, 2, 3], target: "row", power: 2.13, element: "cryo", attach: "cryo", staggerVal: 10, note: "즉발 냉기 부착 + 용오름(아츠 취약·지속 냉기·게이지)" },
    // 야, 강물! 도와줘!(연계 107%, 쿨 14초≈3턴): 냉기 부착/아츠 폭발 적. 냉기 관통 + 와류 생성 + 의기투합(가속/감속).
    { id: "tt-l", name: "야, 강물! 도와줘!", kind: "link", fromPos: [1, 2, 3], target: "row", power: 1.07, element: "cryo", staggerVal: 10, cooldown: 3,
      requires: (t, _s, st) => !!t && (t.arts.cryo > 0 || !!st.anomalyConsumed), requiresText: "냉기 부착/아츠 폭발 적", note: "냉기 관통 + 와류 생성 + 의기투합" },
    // 대당가께서 지켜보고 계신다!(궁 거대 파도 311%, 게이지 90): 시간 정지(행동 불가) + 거대 파도 + 지속 냉기.
    { id: "tt-u", name: "대당가께서 지켜보고 계신다!", kind: "ult", fromPos: [1, 2, 3], target: "all", power: 3.11, element: "cryo", staggerVal: 20, selfUlt: true, note: "시간 정지(행동 불가) + 거대 파도 + 지속 냉기" },
  ],
};

type Base = { id: string; name: string; cls: DDClass; hp: number; attack: number; speed: number; ultCost: number; rampAtk?: number; artsImmune?: number };
const OP_BASE: Record<string, Base> = {
  chenqianyu: { id: "chenqianyu", name: "진천우", cls: "guard", hp: 2689, attack: 95, speed: 86, ultCost: 70, rampAtk: 0.08 }, // 칼날 베기
  lifeng: { id: "lifeng", name: "여풍", cls: "guard", hp: 2689, attack: 110, speed: 69, ultCost: 90 },
  endministrator: { id: "endministrator", name: "관리자", cls: "guard", hp: 2689, attack: 110, speed: 69, ultCost: 80 }, // 위키: 가드(가드의 탈을 쓴 물리 스트라이커)
  estella: { id: "estella", name: "에스텔라", cls: "guard", hp: 2689, attack: 110, speed: 47, ultCost: 70 }, // 냉기/가드, 주스탯 의지·민첩 낮음
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
  gilberta: { id: "gilberta", name: "질베르타", cls: "supporter", hp: 2689, attack: 110, speed: 62, ultCost: 90 }, // 자연 서포터★6 한정(1황). 최고 아츠 취약궁+몹몰이+강제 띄우기+궁충 효율. 주스탯 의지·보조 지능
  perlica: { id: "perlica", name: "펠리카", cls: "caster", hp: 2689, attack: 110, speed: 66, ultCost: 80 }, // 전기 캐스터★5(첫 캐스터). 전기 부착+강제 감전(아츠 취약)+깡딜 궁+불균형 추가딜. 주스탯 지능·보조 의지
  wulfgard: { id: "wulfgard", name: "울프가드", cls: "caster", hp: 2689, attack: 110, speed: 70, ultCost: 90 }, // 열기 캐스터★5. 열기 부착+연소/감전 소모 추가타+강제 연소 궁+불타는 송곳니. 주스탯 힘·보조 민첩
  fluorite: { id: "fluorite", name: "플루라이트", cls: "caster", hp: 2689, attack: 110, speed: 72, ultCost: 100 }, // 자연 캐스터★4. 무료 다중 아츠 부착(연계/궁)+감속+자연 부착. 주스탯 민첩·보조 지능
  tangtang: { id: "tangtang", name: "탕탕", cls: "caster", hp: 2689, attack: 110, speed: 74, ultCost: 90 }, // 냉기 캐스터★6 한정. 즉발 냉기 부착(용오름)+아츠 취약+와류 가속/감속+시간정지 궁+서브딜. 주스탯 민첩·보조 힘
};

// 매 유닛 신선한 상태 객체(중첩 객체 공유 참조 방지). defense/resist 기본 0 → 밸런스 무변.
const zero = () => ({ physBreak: 0, stagger: 0, staggered: false, staggerTimer: 0, statuses: [] as DDUnit["statuses"], dot: 0, multiHit: 0, ultCharge: 0, atkBuff: 0, critRate: 0.05, critDmg: 0.5, arts: { heat: 0, electric: 0, cryo: 0, nature: 0 }, frozen: 0, amp: {}, vuln: {}, weakenMul: 1, protection: 0, shield: 0, speedMod: 0, timers: {}, linkCd: 0, defense: 0, resist: { physical: 0, arts: 0 }, stance: 0, ironOath: 0, gaugeRecovered: 0, gearGrade: 60, procCount: 0 });

export function makeAlly(id: string, pos: number): DDUnit {
  const b = OP_BASE[id];
  const u: DDUnit = { ...b, side: "ally", pos, maxHp: b.hp, staggerMax: 0, ...zero() }; // 아군은 불균형 없음
  if (b.artsImmune) u.artsImmune = b.artsImmune; // 만물의 지혜(아크라이트): 아츠 부착 확률 면역
  return u;
}

export function alliesPhysical(): DDUnit[] {
  // 포지션 퍼즐: 포그·여풍은 전열/중열(pos1~3)에서만, 관리자는 후열(pos4) 가능. 진천우는 어디서나(궁극만 pos1~2).
  return [makeAlly("chenqianyu", 1), makeAlly("lifeng", 2), makeAlly("pogranichnik", 3), makeAlly("endministrator", 4)];
}

// 적: 간단한 단일 공격 AI(전열 아군 타격). staggerMax = 불균형 게이지 용량.
export type EnemyDef = { id: string; name: string; hp: number; attack: number; speed: number; staggerMax: number };
export function makeEnemy(def: EnemyDef, pos: number): DDUnit {
  return { ...def, side: "enemy", pos, maxHp: def.hp, ultCost: 999, ...zero() };
}
export const ENEMY_DEFS: Record<string, EnemyDef> = {
  mob: { id: "mob", name: "아겔로스 잡병", hp: 1200, attack: 130, speed: 40, staggerMax: 50 },
  brute: { id: "brute", name: "중장 아겔로스", hp: 2600, attack: 220, speed: 55, staggerMax: 110 },
  boss: { id: "boss", name: "보스: 티시로슨", hp: 9000, attack: 320, speed: 60, staggerMax: 260 },
};
