# 미브 (Mifu) — 물리 / 가드 ★?

※ 위키 원문 배율표는 미보유(구현 기반 복원). 청파 삼형 초식 콤보(단운→추형→개천) + 강타 + 취약/불균형 특화. physBreak **build**.

## 스킬
- **배틀 청파 삼형** (AoE): 연속 사용 시 3초식. **단운**(게이지 100 소모, 후 50 반환) → **추형** → **개천**(form≥2는 강타=anomalyOverride:"crush", exhaust).
- **연계 후회 없는 주먹** (cond: 방어 불능 3스택+): 올려치기 물리 + 물리 취약.
- **궁극 절심** (AoE): 돌진 강제 띄우기 → 내리꽂아 넘어뜨리기 + 물리. 사용 후 배틀 = 추형 교체.

## 재능
- **냉정**: 취약/불균형 적에 피해 ×1.2.
- **분노**: 연계 후 보호막 30%.
- (디스토션 물리 취약)

## 🎮 현재 구현
- passive: `{ vsBroken: 0.20, vsVulnerable: 0.20, shieldOnCast: 12, linkPhysVuln: 0.10 }`
  - `vsBroken 0.20` + `vsVulnerable 0.20` = 냉정(불균형/물리 취약 적 특화) / `shieldOnCast 12` = 분노 / `linkPhysVuln 0.10` = 연계 물리 취약
- 청파 삼형 = makeMifuFormCard(MIFU_FORMS 단운/추형/개천), form≥2 강타. 연계·궁 후 추형(2식) 교체
- physBreak **build 유지**(consume로 바꾸면 콤보 깨지고 sim 40%). ULT_ENERGY 80
