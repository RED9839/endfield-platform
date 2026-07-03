// ===== 오퍼레이터 성장 시스템 (DD식) =====
// 3축: 정예화(promotion, 스탯) · 스킬 단조(skillRank = M0~M3, 딜) · 장비 단조(gearLevel, 능력치).
// 스킬 베이스 레벨은 9로 고정(변동 X). 성장은 그 위의 단조 M1~M3만. M0 = 9레벨 = ×1.8(현 밸런스 기준선).

export type OpProgress = { promotion: number; skillRank: number; gearLevel: number };

export const PROMO_MAX = 4; // 정예화 0 ~ IV
export const SKILL_MAX = 3; // 스킬 단조 M0 ~ M3 (베이스 9레벨 위)
export const GEAR_MAX = 3;  // 장비 단조 0 ~ 3단계

// 기본(밸런스 기준선). makeAlly 기본값 = 여기(정예화 IV·스킬 9레벨/M0·장비 단조0).
export const DEFAULT_PROGRESS: OpProgress = { promotion: PROMO_MAX, skillRank: 0, gearLevel: 0 };
export const MAX_PROGRESS: OpProgress = { promotion: PROMO_MAX, skillRank: SKILL_MAX, gearLevel: GEAR_MAX }; // 풀강
export const clampProgress = (p: OpProgress): OpProgress => ({
  promotion: Math.max(0, Math.min(PROMO_MAX, p.promotion)),
  skillRank: Math.max(0, Math.min(SKILL_MAX, p.skillRank)),
  gearLevel: Math.max(0, Math.min(GEAR_MAX, p.gearLevel)),
});

// 정예화 0~IV → 기초 스탯(HP·공격력) 배율. IV = 1.0(Lv90 풀 정예화 = 현재값).
const PROMO_MULT = [0.55, 0.68, 0.8, 0.9, 1.0];
export const promoMult = (p: number) => PROMO_MULT[Math.max(0, Math.min(PROMO_MAX, p))];
export const PROMO_LABEL = ["0", "I", "II", "III", "IV"];

// 스킬 단조 M0~M3 → 스킬 딜 배율. 나무위키 배율표(변화의 숨결 Lv1=160 기준):
//  M0=9레벨 288(×1.8) · M1=308(×1.925) · M2=332(×2.075) · M3=360(×2.25).
const SKILL_MULT = [1.8, 1.925, 2.075, 2.25];
export const skillMult = (m: number) => SKILL_MULT[Math.max(0, Math.min(SKILL_MAX, m))];
export const skillLabel = (m: number) => (m <= 0 ? "9Lv" : `M${Math.min(SKILL_MAX, m)}`);

// 스킬 단조 → 유틸 배율(취약·증폭·회복·게이지·지속 등). 딜(×1.8~2.25)과 별개로 M0=1.0 → M3=1.20.
const SKILL_UTIL = [1.0, 1.07, 1.13, 1.2];
export const skillUtilMult = (m: number) => SKILL_UTIL[Math.max(0, Math.min(SKILL_MAX, m))];

// 장비 단조 0~3 → 능력치(gearGrade = 힘/민첩/지능/의지 통합값) 상승. 단계당 +12(명함 60 → 단조3이면 96).
// gearGrade는 저항(내구)·능력치 비례 재능(전기 증폭·회복 등)에 작용 → 원작 "장비 능력치 단조".
export const gearGradeBonus = (l: number) => 12 * Math.max(0, Math.min(GEAR_MAX, l));
export const gearLabel = (l: number) => `단조 ${Math.max(0, Math.min(GEAR_MAX, l))}`;

// 강화 비용(런 자원). 현재 단계 → 다음 단계.
export const promoCost = (cur: number) => [60, 120, 200, 320][cur] ?? Infinity;           // 0→I→II→III→IV
export const skillCost = (cur: number) => [100, 160, 240][cur] ?? Infinity;               // 스킬 단조 M0→M1→M2→M3
export const gearCost = (cur: number) => [60, 120, 200][cur] ?? Infinity;                 // 장비 단조 0→1→2→3
