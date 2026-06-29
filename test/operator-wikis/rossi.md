# 로시 (Rossi) — 물리 / 가드 ★? (열기 하이브리드)

※ 위키 원문 배율표는 미보유(구현 기반 복원). 물리 띄우기 + 열기 + 출혈 + 취약. 단일 누킹 궁. physBreak **build/launch**.

## 스킬
- **배틀 붉은색의 그림자** (단일): 돌진 물리 + **띄우기**. 이미 방어 불능 적이면 **울프팀의 진주 발동**(추가 돌진 열기).
- **연계 그림자가 타오르는 순간** (cond: 방어 불능 + 아츠 부착 동시, 2연속 발동): 물리.
- **궁극 기습 '날카로운 발톱'** (단일): 다단 열기 → 2단 베기 대량 열기 + 열기 부착. 치명 시 추가.

## 재능
- **절흔(늑대발톱)**: 받는 물리/열기 +12% + 출혈 DoT(울프팀의 진주).
- **끓어오르는 피**: 치명 시 추가 열기딜 + 회복.

## 🎮 현재 구현
- passive: `{ targetVuln: 0.12, crit: 0.10, healOnCast: 6, bleed: 0.3 }`
  - `targetVuln 0.12` = 절흔(받는 물리/열기↑) / `bleed 0.3` = 절흔 출혈(배틀이 방어 불능 적 칠 때 공격력 ×0.3 /턴)
  - `crit 0.10` = 끓어오르는 피 치명 / `healOnCast 6` = 끓어오르는 피 회복
- operators: `ultSingle: true`, ultimatePower 110, artsAttachment "열기", physAnomaly launch
- physBreak build/launch. ULT_ENERGY 110
