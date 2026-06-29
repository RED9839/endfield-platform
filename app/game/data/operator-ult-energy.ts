// 실제 엔드필드 "필요한 궁극기 에너지"(원작 소스 데이터) — 오퍼별 궁극 게이지 만충치.
// 강한·연출 궁극일수록 요구치가 큼(레바테인 300, 라스트라이트·장방이 240, 이본 220 …
// 진천우·에스텔라 70). 게이지는 배틀/연계 사용으로 충전되며 만충 시 액티브 발동.
export const ULT_ENERGY: Record<string, number> = {
  chenqianyu: 70, estella: 70,
  catcher: 80, mifu: 80, perlica: 80, snowshine: 80, xaihi: 80,
  arclight: 90, ardelia: 90, dapan: 90, gilberta: 90, lifeng: 90, pogranichnik: 90, tangtang: 90, wulfgard: 90,
  alesh: 100, antal: 100, avywenna: 100, ember: 100, fluorite: 100, endministrator: 100,
  rossi: 110, akekuri: 120, camu: 130,
  yvonne: 220, lastrite: 240, zhuangfangyi: 240, laevatain: 300,
};
export const ULT_ENERGY_DEFAULT = 100;
export function ultEnergyReq(id: string): number {
  return ULT_ENERGY[id] ?? ULT_ENERGY_DEFAULT;
}

// 실제 "획득하는 궁극기 에너지"(스킬당) — 고에너지 오퍼의 특별 로직 반영.
// 레바테인은 열기 부착 흡수로 스킬당 100을 벌어 300 궁이 빠르게 참. 장방이는 6으로 대기만성.
// 데이터 미명시 오퍼는 기본 10.
export const ULT_GAIN: Record<string, number> = {
  lastrite: 16,
  zhuangfangyi: 6,
  camu: 10, mifu: 10, yvonne: 10,
  // 레바테인은 평소 기본(10), 조건부 대량 충전 → ultGainConditional 참조
};
export const ULT_GAIN_DEFAULT = 10;
export function ultGainSelf(id: string): number {
  return ULT_GAIN[id] ?? ULT_GAIN_DEFAULT;
}

// 조건부 충전: 레바테인 「불꽃의 심장」 — 연소(열기 부착) 적을 쳐서 녹아내린 불꽃 4스택을 흡수한 뒤,
// '배틀스킬'을 쓰면 열기 흡수 대량 충전(100). 평소엔 기본(10). 셋업형 대궁.
export function ultGainConditional(id: string, kind: string, passiveStacks: number): number {
  if (id === "laevatain") return kind === "battle-skill" && passiveStacks >= 4 ? 100 : ULT_GAIN_DEFAULT;
  return ultGainSelf(id);
}

// 아츠 소모 보너스: 배틀/연계 스킬이 '아츠 부착/이상 상태'의 적을 칠 때, 그 상태를 소모하며 추가 궁극 에너지.
// 원작에서 고에너지 대궁(라스트라이트·이본·장방이)이 충전하는 핵심 로직 — 아츠를 깔고 소모해 폭충전.
export const ULT_ARTS_CONSUME: Record<string, number> = {
  lastrite: 30, yvonne: 30, zhuangfangyi: 30, // 대궁: 아츠 소모로 대량 충전
  alesh: 20, wulfgard: 15, // 게이지 회복형
};
export function ultArtsConsumeBonus(id: string): number {
  return ULT_ARTS_CONSUME[id] ?? 0;
}

// 궁극기 유형(실제 엔드필드 동작 반영). 미지정=광역 딜. 변신은 isTransformOperator로 별도.
// 포그라니치니크 「방패병 부대, 전진」은 광역 물리 타격(진군) + 철의 서약 엔진(별도 ironOath 처리) → damage.
export type UltKind = "damage" | "buff" | "zone" | "energy";
// 버프 궁극은 실제로 '팀 전체에 증폭을 부여'하는 궁극만 해당:
//   샤이히 「스택 오버플로」 = 팀 냉기·자연 증폭, 안탈 「오버클록 타임」 = 팀 전기·열기 증폭.
// (아크라이트 「천둥번개」·라스트라이트 「마지막 인사」·울프가드 「늑대의 분노」는 모두 딜 궁극 — 증폭은 재능이지 궁극이 아님.)
export const ULT_KIND: Record<string, UltKind> = {
  xaihi: "buff", antal: "buff", // 팀 원소 증폭 궁극
  gilberta: "zone",             // 중력 혼란 구역 → 범위 디버프(감속·아츠 취약)
  akekuri: "energy",            // 「소대, 집합!」 집결 신호탄 → 스킬 게이지(전투 에너지) 대량 회복
};
export function ultKind(id: string): UltKind {
  return ULT_KIND[id] ?? "damage";
}
