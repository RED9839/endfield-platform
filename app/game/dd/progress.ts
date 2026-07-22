// ===== 오퍼레이터 성장 시스템 (DD식) =====
// 3축: 정예화(promotion, 스탯) · 스킬 단조(skillRank = M0~M3, 딜) · 장비 단조(gearLevel, 능력치).
// 스킬 베이스 레벨은 9로 고정(변동 X). 성장은 그 위의 단조 M1~M3만. M0 = 9레벨 = ×1.8(현 밸런스 기준선).

// 스킬 마스터리는 원작대로 기본공격·배틀·연계·궁극기 각각 따로 강화한다(오퍼당 4트랙).
export type SkillKind = "attack" | "battle" | "link" | "ult";
export const SKILL_KINDS: SkillKind[] = ["attack", "battle", "link", "ult"];
export type SkillRanks = Record<SkillKind, number>;
export type OpProgress = { promotion: number; skillRanks: SkillRanks; gearLevel: number };

export const PROMO_MAX = 4; // 정예화 0 ~ IV
export const SKILL_MAX = 3; // 스킬 단조 M0 ~ M3 (베이스 9레벨 위)
export const GEAR_MAX = 3;  // 장비 단조 0 ~ 3단계

const zeroRanks = (): SkillRanks => ({ attack: 0, battle: 0, link: 0, ult: 0 });
const maxRanks = (): SkillRanks => ({ attack: SKILL_MAX, battle: SKILL_MAX, link: SKILL_MAX, ult: SKILL_MAX });
// 기본(밸런스 기준선). makeAlly 기본값 = 여기(정예화 IV·전 스킬 9레벨/M0·장비 단조0).
export const DEFAULT_PROGRESS: OpProgress = { promotion: PROMO_MAX, skillRanks: zeroRanks(), gearLevel: 0 };
export const MAX_PROGRESS: OpProgress = { promotion: PROMO_MAX, skillRanks: maxRanks(), gearLevel: GEAR_MAX }; // 풀강
export const clampProgress = (p: OpProgress): OpProgress => ({
  promotion: Math.max(0, Math.min(PROMO_MAX, p.promotion)),
  skillRanks: { ...zeroRanks(), ...Object.fromEntries(SKILL_KINDS.map((k) => [k, Math.max(0, Math.min(SKILL_MAX, p.skillRanks?.[k] ?? 0))])) } as SkillRanks,
  gearLevel: Math.max(0, Math.min(GEAR_MAX, p.gearLevel)),
});

// 정예화 0~IV → 기초 스탯(HP·공격력) 배율. IV = 1.0(Lv90 풀 정예화 = 현재값).
const PROMO_MULT = [0.55, 0.68, 0.8, 0.9, 1.0];
export const promoMult = (p: number) => PROMO_MULT[Math.max(0, Math.min(PROMO_MAX, p))];
export const PROMO_LABEL = ["0", "I", "II", "III", "IV"];

// 스킬 마스터리 M0(9레벨)→M1→M2→M3 배율. warfarin.wiki 실측(2026-07 v1.4, 헤드리스 렌더).
// mifu·laevatain·arclight·perlica·ardelia·gilberta·xaihi 6+명 × 스킬 40여 개의 배율표에서
// Lv9 대비 M1/M2/M3 비율이 전부 ≈[1.0, 1.069, 1.153, 1.25]로 일치 → 게임 공통 마스터리 곡선.
//  예) 미브 개천 528→548·572·600, 후회없는주먹 200→214·230·250, 처형 720→770·830·900.
// M0 기준선을 ×1.8로 잡아(9레벨=Lv1 배율×1.8, 대부분 스킬의 Lv1→Lv9 성장과 일치) 곱한 값이 SKILL_MULT.
const SKILL_MULT = [1.8, 1.925, 2.075, 2.25]; // ×1.8 × [1, 1.069, 1.153, 1.25]
export const skillMult = (m: number) => SKILL_MULT[Math.max(0, Math.min(SKILL_MAX, m))];
export const skillLabel = (m: number) => (m <= 0 ? "9Lv" : `M${Math.min(SKILL_MAX, m)}`);
// M0(9레벨) 대비 랭크 딜 보너스. 공격력엔 M0 기준(×1.8)만 넣고, 스킬 종류별 랭크는 이 배율로 따로 적용.
export const skillRankDmg = (m: number) => skillMult(m) / SKILL_MULT[0]; // M0=1.0 · M1=1.069 · M2=1.153 · M3=1.25

// 유틸 배율(취약·증폭·회복·게이지 등)도 같은 마스터리 곡선. warfarin 실측: 아델리아 취약 표
//  16%(Lv9)→17·18·20%(M1~M3) = 16×[1.069,1.153,1.25] 정수 반올림 → 딜과 동일한 곡선을 쓴다.
export const skillUtilMult = skillRankDmg;

// 장비 단조 0~3 → 능력치(gearGrade = 힘/민첩/지능/의지 통합값) 상승. 단계당 +12(명함 60 → 단조3이면 96).
// gearGrade는 저항(내구)·능력치 비례 재능(전기 증폭·회복 등)에 작용 → 원작 "장비 능력치 단조".
export const gearGradeBonus = (l: number) => 12 * Math.max(0, Math.min(GEAR_MAX, l));
export const gearLabel = (l: number) => `단조 ${Math.max(0, Math.min(GEAR_MAX, l))}`;

// 강화 비용(런 자원). 현재 단계 → 다음 단계.
export const promoCost = (cur: number) => [60, 120, 200, 320][cur] ?? Infinity;           // 0→I→II→III→IV
export const skillCost = (cur: number) => [100, 160, 240][cur] ?? Infinity;               // 스킬 단조 M0→M1→M2→M3 (트랙 무관 동일)
export const gearCost = (cur: number) => [60, 120, 200][cur] ?? Infinity;                 // 장비 단조 0→1→2→3
