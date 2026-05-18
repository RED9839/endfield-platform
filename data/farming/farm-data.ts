export type MaterialItem = {
  name: string;
  category:
    | "currency"
    | "operatorExp"
    | "operatorAscension"
    | "skill"
    | "weaponExp"
    | "weaponAscension"
    | "advanced"
    | "recovery"
    | "token";
};

export type FarmStage = {
  id: string;
  name: string;
  sanityCost: number;
  rewards: Record<string, number>;
};

export type TokenShopItem = {
  id: string;
  name: string;
  rewardName: string;
  rewardAmount: number;
  tokenCost: number;
  stock?: number;
  discountKey?: DiscountKey;
};

export type DiscountKey =
  | "고급 인지 매개체"
  | "무기 점검 세트"
  | "탈로시안 화폐"
  | "고급 작전 기록";

export const YELLOW_MAIN = "#ffd24a";
export const YELLOW_TEXT = "#ffdc70";
export const YELLOW_BORDER = "rgba(255,196,74,0.14)";
export const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
export const PANEL_BG = "#05070b";
export const CARD_BG = "#090d14";

export const ADVANCED_MATERIALS = [
  "초거리 빛 반사 파이프",
  "D96강 시제품 4번",
  "타키온 차폐 구조체",
  "정합용 유체",
  "3상 나노 플레이크 칩",
] as const;

export const ADVANCED_BOX_NAME = "고급 육성 선택 상자 I";
export const ADVANCED_BOX_VALUE = 2;

export const RECOVERY_ITEMS = [
  { name: "이성 회복제", sanity: 40 },
  { name: "응급 이성 강화제", sanity: 40 },
  { name: "응급 이성 농축액", sanity: 100 },
  { name: "이성 정수 약제", sanity: 120 },
] as const;

export const DAILY_QUEST_RECOVERY_NAME = "응급 이성 강화제";
export const DAILY_NATURAL_SANITY = 240;
export const MONTHLY_CARD_SANITY = 40;
export const ORIGINIUM_REFRESH_SANITY = 40;
export const ORIGINIUM_COST_TABLE = [1, 1, 2, 2, 2, 4, 4, 4, 4, 4];

export const DAILY_QUEST_REWARDS: Record<string, number> = {
  "통행증 경험치": 2000,
  "오로베릴": 200,
  "탈로시안 화폐": 9000,
  [DAILY_QUEST_RECOVERY_NAME]: 1,
  "고급 작전 기록": 1,
  "프로토콜 프리즘": 5,
  "무기 점검 세트": 2,
  "작전 경험": 1150,
};

export const WEEKLY_QUEST_REWARDS: Record<string, number> = {
  "오로베릴": 500,
  "고급 작전 기록": 8,
  "무기 점검 세트": 8,
  "프로토콜 프리즘 세트": 8,
  "고급 인지 매개체": 6,
  "무기고 징표": 100,
  "탈로시안 화폐": 40000,
};

export const FARM_STAGES: FarmStage[] = [
  {
    id: "operator-exp-5",
    name: "프로토콜 공간 · 오퍼레이터 경험치 5레벨",
    sanityCost: 80,
    rewards: { "고급 작전 기록": 17 },
  },
  {
    id: "operator-cognition-5",
    name: "프로토콜 공간 · 오퍼레이터 경험치 5레벨",
    sanityCost: 80,
    rewards: { "고급 인지 매개체": 6, "초급 인지 매개체": 8 },
  },
  {
    id: "operator-ascension-5-disk",
    name: "프로토콜 공간 · 오퍼레이터 돌파 5레벨",
    sanityCost: 80,
    rewards: { "프로토콜 디스크": 34 },
  },
  {
    id: "operator-ascension-5-disk-set",
    name: "프로토콜 공간 · 오퍼레이터 돌파 5레벨",
    sanityCost: 80,
    rewards: { "프로토콜 디스크 세트": 14 },
  },
  {
    id: "currency-5",
    name: "화폐 수집 5레벨",
    sanityCost: 80,
    rewards: { "탈로시안 화폐": 34000 },
  },
  {
    id: "skill-5-prism",
    name: "스킬 업그레이드 5레벨",
    sanityCost: 80,
    rewards: { "프로토콜 프리즘": 85 },
  },
  {
    id: "skill-5-prism-set",
    name: "스킬 업그레이드 5레벨",
    sanityCost: 80,
    rewards: { "프로토콜 프리즘 세트": 17 },
  },
  {
    id: "weapon-exp-5",
    name: "프로토콜 공간 · 무기 경험치 5레벨",
    sanityCost: 80,
    rewards: { "무기 점검 장치": 10, "무기 점검 세트": 16 },
  },
  {
    id: "weapon-ascension-5-mold",
    name: "프로토콜 공간 · 무기 돌파 5레벨",
    sanityCost: 80,
    rewards: { "모형 틀": 34 },
  },
  {
    id: "weapon-ascension-5-medium-mold",
    name: "프로토콜 공간 · 무기 돌파 5레벨",
    sanityCost: 80,
    rewards: { "중형 모형 틀": 14 },
  },
  {
    id: "advanced-i",
    name: "프로토콜 공간 · 고급 육성 I",
    sanityCost: 80,
    rewards: { "D96강 시제품 4번": 6 },
  },
  {
    id: "advanced-ii",
    name: "프로토콜 공간 · 고급 육성 II",
    sanityCost: 80,
    rewards: { "초거리 빛 반사 파이프": 6 },
  },
  {
    id: "advanced-iii",
    name: "프로토콜 공간 · 고급 육성 III",
    sanityCost: 80,
    rewards: { "타키온 차폐 구조체": 6 },
  },
  {
    id: "advanced-iv",
    name: "프로토콜 공간 · 고급 육성 IV",
    sanityCost: 80,
    rewards: { "정합용 유체": 6 },
  },
  {
    id: "advanced-v",
    name: "프로토콜 공간 · 고급 육성 V",
    sanityCost: 80,
    rewards: { "3상 나노 플레이크 칩": 6 },
  },
];

export const TOKEN_SHOP_ITEMS: TokenShopItem[] = [
  {
    id: "discount-cognition",
    name: "할인 고급 인지 매개체",
    rewardName: "고급 인지 매개체",
    rewardAmount: 5,
    tokenCost: 30,
    discountKey: "고급 인지 매개체",
  },
  {
    id: "discount-weapon-set",
    name: "할인 무기 점검 세트",
    rewardName: "무기 점검 세트",
    rewardAmount: 6,
    tokenCost: 15,
    discountKey: "무기 점검 세트",
  },
  {
    id: "discount-currency",
    name: "할인 탈로시안 화폐",
    rewardName: "탈로시안 화폐",
    rewardAmount: 12000,
    tokenCost: 15,
    discountKey: "탈로시안 화폐",
  },
  {
    id: "discount-exp",
    name: "할인 고급 작전 기록",
    rewardName: "고급 작전 기록",
    rewardAmount: 6,
    tokenCost: 15,
    discountKey: "고급 작전 기록",
  },
  {
    id: "token-cognition",
    name: "고급 인지 매개체",
    rewardName: "고급 인지 매개체",
    rewardAmount: 5,
    tokenCost: 40,
  },
  {
    id: "token-pipe",
    name: "초거리 빛 반사 파이프",
    rewardName: "초거리 빛 반사 파이프",
    rewardAmount: 5,
    tokenCost: 40,
  },
  {
    id: "token-d96",
    name: "D96강 시제품 4번",
    rewardName: "D96강 시제품 4번",
    rewardAmount: 5,
    tokenCost: 40,
  },
  {
    id: "token-tachyon",
    name: "타키온 차폐 구조체",
    rewardName: "타키온 차폐 구조체",
    rewardAmount: 5,
    tokenCost: 40,
  },
  {
    id: "token-fluid",
    name: "정합용 유체",
    rewardName: "정합용 유체",
    rewardAmount: 5,
    tokenCost: 40,
  },
  {
    id: "token-nano",
    name: "3상 나노 플레이크 칩",
    rewardName: "3상 나노 플레이크 칩",
    rewardAmount: 5,
    tokenCost: 40,
  },
  {
    id: "token-weapon-set",
    name: "무기 점검 세트",
    rewardName: "무기 점검 세트",
    rewardAmount: 6,
    tokenCost: 20,
  },
  {
    id: "token-prism-set",
    name: "프로토콜 프리즘 세트",
    rewardName: "프로토콜 프리즘 세트",
    rewardAmount: 6,
    tokenCost: 20,
  },
  {
    id: "token-disk-set",
    name: "프로토콜 디스크 세트",
    rewardName: "프로토콜 디스크 세트",
    rewardAmount: 6,
    tokenCost: 24,
  },
  {
    id: "token-medium-mold",
    name: "중형 모형 틀",
    rewardName: "중형 모형 틀",
    rewardAmount: 6,
    tokenCost: 24,
  },
  {
    id: "token-currency",
    name: "탈로시안 화폐",
    rewardName: "탈로시안 화폐",
    rewardAmount: 12000,
    tokenCost: 20,
  },
  {
    id: "token-exp",
    name: "고급 작전 기록",
    rewardName: "고급 작전 기록",
    rewardAmount: 6,
    tokenCost: 20,
  },
  {
    id: "token-prism",
    name: "프로토콜 프리즘",
    rewardName: "프로토콜 프리즘",
    rewardAmount: 30,
    tokenCost: 20,
  },
  {
    id: "token-disk",
    name: "프로토콜 디스크",
    rewardName: "프로토콜 디스크",
    rewardAmount: 8,
    tokenCost: 16,
  },
  {
    id: "token-mold",
    name: "모형 틀",
    rewardName: "모형 틀",
    rewardAmount: 8,
    tokenCost: 16,
  },
];

export const FARMABLE_MATERIAL_NAMES = Array.from(
  new Set(FARM_STAGES.flatMap((stage) => Object.keys(stage.rewards)))
);

export const MATERIAL_ORDER = [
  "탈로시안 화폐",
  "고급 작전 기록",
  "중급 작전 기록",
  "초급 작전 기록",
  "고급 인지 매개체",
  "초급 인지 매개체",
  "프로토콜 프리즘",
  "프로토콜 프리즘 세트",
  "프로토콜 디스크",
  "프로토콜 디스크 세트",
  "모형 틀",
  "중형 모형 틀",
  "무기 점검 유닛",
  "무기 점검 장치",
  "무기 점검 세트",
  "초거리 빛 반사 파이프",
  "D96강 시제품 4번",
  "타키온 차폐 구조체",
  "정합용 유체",
  "3상 나노 플레이크 칩",
  ADVANCED_BOX_NAME,
  "통합 징표",
  "파생 오리지늄",
  "이성 회복제",
  "응급 이성 강화제",
  "응급 이성 농축액",
  "이성 정수 약제",
];

export const MATERIALS: MaterialItem[] = MATERIAL_ORDER.map((name) => ({
  name,
  category: ADVANCED_MATERIALS.includes(name as (typeof ADVANCED_MATERIALS)[number])
    ? "advanced"
    : name.includes("프리즘")
      ? "skill"
      : name.includes("디스크")
        ? "operatorAscension"
        : name.includes("모형")
          ? "weaponAscension"
          : name.includes("무기 점검")
            ? "weaponExp"
            : name.includes("작전 기록") || name.includes("인지")
              ? "operatorExp"
              : name.includes("이성")
                ? "recovery"
                : name === "통합 징표" || name === "무기고 징표"
                  ? "token"
                  : "currency",
}));
