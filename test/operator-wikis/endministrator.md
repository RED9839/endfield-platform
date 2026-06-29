# 관리자 (Endministrator) — 물리 / 가드 ★?

※ 위키 원문 배율표는 미보유(구현 기반 복원). 스킬 설명은 게임 데이터 기준.
오리지늄 결정 부착 → 소모(현실 정지: 결정 부착 적 받는 물리↑) 사이클. physBreak **consume/crush**(강타형).

## 스킬
- **배틀 구성 시퀀스** (AoE): 전방 범위 물리 + **강타**(방어 불능 소모).
- **연계 봉인 시퀀스** (cond: 아군 연계 피해 시): 돌진 물리 + **오리지늄 결정 부착** + 봉인.
- **궁극 폭격 시퀀스**: 전방 부채꼴 대량 물리. **결정 부착 적이면 결정 소모 + 추가 물리 1회**.

## 재능
- **본질 붕괴**: 오리지늄 결정 소모 시 공격력 누적↑.
- **현실 정지**: 결정 부착 적 받는 물리 +20%.

## 🎮 현재 구현
- passive: `{ essenceStack: 0.08 }` — 본질 붕괴(강타/갑옷파괴·결정 소모 시 공격력 누적)
- 현실 정지 = getStatusBonus의 crystal 처리(결정 부착 적 물리 +20%, `getStatusBonus`에서 `!arts && crystal → +0.2`)
- 결정 사이클(useRunState endministrator 블록): 연계 = "crystal" 부착 / 배틀·궁 = 결정 소모(배틀 ×0.9, 궁 ×1.2 추가 물리 + crystalConsumed)
- physBreak consume/crush. ULT_ENERGY 100
