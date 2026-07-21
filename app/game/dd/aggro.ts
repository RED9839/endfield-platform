// 적 타겟팅 어그로 가중 — 리프 모듈(임포트 없음). sim(전투)과 RosterSelect(편성 표시)가 함께 쓴다.
// 전열/후열 개념이 없으므로 시선을 끄는 건 위치가 아니라 직군이다.
// 무지향("any") 적 61종(전체 83종)이 이 가중으로 대상을 뽑는다.
// 저체력 우선(wounded 14종)·최고위협 우선(threat 8종)은 이 표와 무관하다.
export const CLASS_AGGRO: Record<string, number> = {
  defender: 2.5, vanguard: 1.8, guard: 1.4, striker: 1, caster: 0.8, supporter: 0.8,
};
export const aggroWeight = (cls?: string) => CLASS_AGGRO[cls ?? ""] ?? 1;

// 편성 인원의 피격 확률(무지향 적 기준). 합계 1.
export function aggroShares(classes: (string | undefined)[]): number[] {
  const w = classes.map(aggroWeight);
  const sum = w.reduce((a, b) => a + b, 0);
  return sum > 0 ? w.map((x) => x / sum) : w.map(() => 0);
}
