# 진천우 (Chenqianyu) — 물리 / 가드 ★?

※ 위키 원문 배율표는 미보유(구현 기반 복원). 띄우기(방어 불능) + 누적 화력 + 단일 고배율 궁(예풍상). physBreak **build/launch**.

## 스킬
- **배틀 귀궁우** (단일): 적 올려치기 물리 + **띄우기**.
- **연계 견천하** (cond: 방어 불능 적, AoE): 관통 돌진 베기, 경로 물리 + 띄우기.
- **궁극 예풍상** (단일): 7단 베기, 마지막 대형 피해. (누킹 단일 궁)

## 재능
- **칼날 베기**: 비기본 스킬 명중마다 공격력 +8%(최대 5스택).
- **흐름 끊기**: 적 차지를 끊으면 추가 불균형 +10.

## 🎮 현재 구현
- passive: `{ stackPerHit: 0.08, chargeBreakStagger: 10 }`
  - `stackPerHit 0.08` = 칼날 베기 / `chargeBreakStagger 10` = 흐름 끊기
- operators: `ultSingle: true`, ultimatePower 175(단일 보정), physAnomaly launch
- physBreak build/launch. ULT_ENERGY 70
- ※ 단일 궁으로 조정됨("단일로가자"). 일부 AoE 의존 파티는 약화돼 power 175로 보강
