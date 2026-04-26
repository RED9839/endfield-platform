import type { FarmStage } from "@/lib/farming/calculate-farming";

export const farmStages: FarmStage[] = [
  // 프로토콜 공간 · 오퍼레이터 경험치
  { id: "operator-exp-1-high", name: "오퍼레이터 경험치 1레벨", material: "고급 작전 기록", amount: 4, cost: 40, costType: "sanity" },
  { id: "operator-exp-2-high", name: "오퍼레이터 경험치 2레벨", material: "고급 작전 기록", amount: 6, cost: 50, costType: "sanity" },
  { id: "operator-exp-3-high", name: "오퍼레이터 경험치 3레벨", material: "고급 작전 기록", amount: 9, cost: 60, costType: "sanity" },
  { id: "operator-exp-4-high", name: "오퍼레이터 경험치 4레벨", material: "고급 작전 기록", amount: 13, cost: 70, costType: "sanity" },
  { id: "operator-exp-5-high", name: "오퍼레이터 경험치 5레벨", material: "고급 작전 기록", amount: 17, cost: 80, costType: "sanity" },
  { id: "operator-exp-3-cognition", name: "오퍼레이터 경험치 3레벨 · 인지 매개체", material: "고급 인지 매개체", amount: 4, cost: 60, costType: "sanity" },
  { id: "operator-exp-4-cognition", name: "오퍼레이터 경험치 4레벨 · 인지 매개체", material: "고급 인지 매개체", amount: 5, cost: 70, costType: "sanity" },
  { id: "operator-exp-5-cognition", name: "오퍼레이터 경험치 5레벨 · 인지 매개체", material: "고급 인지 매개체", amount: 6, cost: 80, costType: "sanity" },

  // 화폐
  { id: "currency-1", name: "화폐 수집 1레벨", material: "탈로시안 화폐", amount: 8500, cost: 40, costType: "sanity" },
  { id: "currency-2", name: "화폐 수집 2레벨", material: "탈로시안 화폐", amount: 13500, cost: 50, costType: "sanity" },
  { id: "currency-3", name: "화폐 수집 3레벨", material: "탈로시안 화폐", amount: 19500, cost: 60, costType: "sanity" },
  { id: "currency-4", name: "화폐 수집 4레벨", material: "탈로시안 화폐", amount: 27500, cost: 70, costType: "sanity" },
  { id: "currency-5", name: "화폐 수집 5레벨", material: "탈로시안 화폐", amount: 34000, cost: 80, costType: "sanity" },

  // 스킬
  { id: "skill-1", name: "스킬 업그레이드 1레벨", material: "프로토콜 프리즘", amount: 21, cost: 40, costType: "sanity" },
  { id: "skill-2", name: "스킬 업그레이드 2레벨", material: "프로토콜 프리즘", amount: 35, cost: 50, costType: "sanity" },
  { id: "skill-3", name: "스킬 업그레이드 3레벨", material: "프로토콜 프리즘", amount: 50, cost: 60, costType: "sanity" },
  { id: "skill-4", name: "스킬 업그레이드 4레벨", material: "프로토콜 프리즘", amount: 69, cost: 70, costType: "sanity" },
  { id: "skill-5", name: "스킬 업그레이드 5레벨", material: "프로토콜 프리즘", amount: 85, cost: 80, costType: "sanity" },
  { id: "skill-set-3", name: "스킬 업그레이드 3레벨 · 세트", material: "프로토콜 프리즘 세트", amount: 10, cost: 60, costType: "sanity" },
  { id: "skill-set-4", name: "스킬 업그레이드 4레벨 · 세트", material: "프로토콜 프리즘 세트", amount: 14, cost: 70, costType: "sanity" },
  { id: "skill-set-5", name: "스킬 업그레이드 5레벨 · 세트", material: "프로토콜 프리즘 세트", amount: 17, cost: 80, costType: "sanity" },

  // 오퍼레이터 돌파
  { id: "operator-asc-1", name: "오퍼레이터 돌파 1레벨", material: "프로토콜 디스크", amount: 8, cost: 40, costType: "sanity" },
  { id: "operator-asc-2", name: "오퍼레이터 돌파 2레벨", material: "프로토콜 디스크", amount: 14, cost: 50, costType: "sanity" },
  { id: "operator-asc-3", name: "오퍼레이터 돌파 3레벨", material: "프로토콜 디스크", amount: 20, cost: 60, costType: "sanity" },
  { id: "operator-asc-4", name: "오퍼레이터 돌파 4레벨", material: "프로토콜 디스크", amount: 27, cost: 70, costType: "sanity" },
  { id: "operator-asc-5", name: "오퍼레이터 돌파 5레벨", material: "프로토콜 디스크", amount: 34, cost: 80, costType: "sanity" },
  { id: "operator-asc-set-3", name: "오퍼레이터 돌파 3레벨 · 세트", material: "프로토콜 디스크 세트", amount: 8, cost: 60, costType: "sanity" },
  { id: "operator-asc-set-4", name: "오퍼레이터 돌파 4레벨 · 세트", material: "프로토콜 디스크 세트", amount: 11, cost: 70, costType: "sanity" },
  { id: "operator-asc-set-5", name: "오퍼레이터 돌파 5레벨 · 세트", material: "프로토콜 디스크 세트", amount: 14, cost: 80, costType: "sanity" },

  // 무기 경험치
  { id: "weapon-exp-1", name: "무기 경험치 1레벨", material: "무기 점검 세트", amount: 4, cost: 40, costType: "sanity" },
  { id: "weapon-exp-2", name: "무기 경험치 2레벨", material: "무기 점검 세트", amount: 6, cost: 50, costType: "sanity" },
  { id: "weapon-exp-3", name: "무기 경험치 3레벨", material: "무기 점검 세트", amount: 9, cost: 60, costType: "sanity" },
  { id: "weapon-exp-4", name: "무기 경험치 4레벨", material: "무기 점검 세트", amount: 12, cost: 70, costType: "sanity" },
  { id: "weapon-exp-5", name: "무기 경험치 5레벨", material: "무기 점검 세트", amount: 16, cost: 80, costType: "sanity" },

  // 무기 돌파
  { id: "weapon-asc-1", name: "무기 돌파 1레벨", material: "모형 틀", amount: 8, cost: 40, costType: "sanity" },
  { id: "weapon-asc-2", name: "무기 돌파 2레벨", material: "모형 틀", amount: 14, cost: 50, costType: "sanity" },
  { id: "weapon-asc-3", name: "무기 돌파 3레벨", material: "모형 틀", amount: 20, cost: 60, costType: "sanity" },
  { id: "weapon-asc-4", name: "무기 돌파 4레벨", material: "모형 틀", amount: 27, cost: 70, costType: "sanity" },
  { id: "weapon-asc-5", name: "무기 돌파 5레벨", material: "모형 틀", amount: 34, cost: 80, costType: "sanity" },
  { id: "weapon-asc-mid-3", name: "무기 돌파 3레벨 · 중형", material: "중형 모형 틀", amount: 8, cost: 60, costType: "sanity" },
  { id: "weapon-asc-mid-4", name: "무기 돌파 4레벨 · 중형", material: "중형 모형 틀", amount: 11, cost: 70, costType: "sanity" },
  { id: "weapon-asc-mid-5", name: "무기 돌파 5레벨 · 중형", material: "중형 모형 틀", amount: 14, cost: 80, costType: "sanity" },

  // 고급 육성 / 위험한 재현
  { id: "advanced-pipe", name: "프로토콜 공간 · 고급 육성 II", material: "초거리 빛 반사 파이프", amount: 6, cost: 80, costType: "sanity" },
  { id: "advanced-d96", name: "프로토콜 공간 · 고급 육성 I", material: "D96강 시제품 4번", amount: 6, cost: 80, costType: "sanity" },
  { id: "advanced-tachyon", name: "프로토콜 공간 · 고급 육성 III", material: "타키온 차폐 구조체", amount: 6, cost: 80, costType: "sanity" },
  { id: "advanced-fluid", name: "프로토콜 공간 · 고급 육성 IV", material: "정합용 유체", amount: 6, cost: 80, costType: "sanity" },
  { id: "advanced-nano", name: "프로토콜 공간 · 고급 육성 V", material: "3상 나노 플레이크 칩", amount: 6, cost: 80, costType: "sanity" },
  { id: "danger-pipe", name: "위험한 재현 · 로댄", material: "초거리 빛 반사 파이프", amount: 9, cost: 120, costType: "sanity" },
  { id: "danger-d96", name: "위험한 재현 · 트리아겔로스", material: "D96강 시제품 4번", amount: 9, cost: 120, costType: "sanity" },
  { id: "danger-tachyon", name: "위험한 재현 · 마블 아겔로미레", material: "타키온 차폐 구조체", amount: 9, cost: 120, costType: "sanity" },
  { id: "danger-fluid", name: "위험한 재현 · 원일", material: "정합용 유체", amount: 9, cost: 120, costType: "sanity" },
  { id: "danger-nano", name: "위험한 재현 · 네파리스", material: "3상 나노 플레이크 칩", amount: 9, cost: 120, costType: "sanity" },

  // 통합 징표 거래 · 할인
  { id: "token-discount-cognition", name: "할인 통합 징표 거래 · 고급 인지 매개체", material: "고급 인지 매개체", amount: 5, cost: 30, costType: "token", isDiscount: true, stock: 0 },
  { id: "token-discount-weapon-set", name: "할인 통합 징표 거래 · 무기 점검 세트", material: "무기 점검 세트", amount: 6, cost: 15, costType: "token", isDiscount: true, stock: 0 },
  { id: "token-discount-currency", name: "할인 통합 징표 거래 · 탈로시안 화폐", material: "탈로시안 화폐", amount: 12000, cost: 15, costType: "token", isDiscount: true, stock: 0 },
  { id: "token-discount-exp", name: "할인 통합 징표 거래 · 고급 작전 기록", material: "고급 작전 기록", amount: 6, cost: 15, costType: "token", isDiscount: true, stock: 0 },

  // 통합 징표 거래 · 일반
  { id: "token-cognition", name: "통합 징표 거래 · 고급 인지 매개체", material: "고급 인지 매개체", amount: 5, cost: 40, costType: "token", stock: "infinite" },
  { id: "token-pipe", name: "통합 징표 거래 · 초거리 빛 반사 파이프", material: "초거리 빛 반사 파이프", amount: 5, cost: 40, costType: "token", stock: "infinite" },
  { id: "token-d96", name: "통합 징표 거래 · D96강 시제품 4번", material: "D96강 시제품 4번", amount: 5, cost: 40, costType: "token", stock: "infinite" },
  { id: "token-tachyon", name: "통합 징표 거래 · 타키온 차폐 구조체", material: "타키온 차폐 구조체", amount: 5, cost: 40, costType: "token", stock: "infinite" },
  { id: "token-fluid", name: "통합 징표 거래 · 정합용 유체", material: "정합용 유체", amount: 5, cost: 40, costType: "token", stock: "infinite" },
  { id: "token-nano", name: "통합 징표 거래 · 3상 나노 플레이크 칩", material: "3상 나노 플레이크 칩", amount: 5, cost: 40, costType: "token", stock: "infinite" },
  { id: "token-weapon-set", name: "통합 징표 거래 · 무기 점검 세트", material: "무기 점검 세트", amount: 6, cost: 20, costType: "token", stock: "infinite" },
  { id: "token-prism-set", name: "통합 징표 거래 · 프로토콜 프리즘 세트", material: "프로토콜 프리즘 세트", amount: 6, cost: 20, costType: "token", stock: "infinite" },
  { id: "token-disk-set", name: "통합 징표 거래 · 프로토콜 디스크 세트", material: "프로토콜 디스크 세트", amount: 6, cost: 24, costType: "token", stock: "infinite" },
  { id: "token-mid-mold", name: "통합 징표 거래 · 중형 모형 틀", material: "중형 모형 틀", amount: 6, cost: 24, costType: "token", stock: "infinite" },
  { id: "token-currency", name: "통합 징표 거래 · 탈로시안 화폐", material: "탈로시안 화폐", amount: 12000, cost: 20, costType: "token", stock: "infinite" },
  { id: "token-exp", name: "통합 징표 거래 · 고급 작전 기록", material: "고급 작전 기록", amount: 6, cost: 20, costType: "token", stock: "infinite" },
  { id: "token-prism", name: "통합 징표 거래 · 프로토콜 프리즘", material: "프로토콜 프리즘", amount: 30, cost: 20, costType: "token", stock: "infinite" },
  { id: "token-disk", name: "통합 징표 거래 · 프로토콜 디스크", material: "프로토콜 디스크", amount: 8, cost: 16, costType: "token", stock: "infinite" },
  { id: "token-mold", name: "통합 징표 거래 · 모형 틀", material: "모형 틀", amount: 8, cost: 16, costType: "token", stock: "infinite" },
];

export const farmableMaterialNames = Array.from(
  new Set(farmStages.filter((stage) => stage.costType === "sanity").map((stage) => stage.material))
).sort((a, b) => a.localeCompare(b, "ko"));

export const tokenShopMaterialNames = Array.from(
  new Set(farmStages.filter((stage) => stage.costType === "token").map((stage) => stage.material))
).sort((a, b) => a.localeCompare(b, "ko"));
