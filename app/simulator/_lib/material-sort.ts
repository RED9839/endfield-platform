import type { SimMaterial } from "./simulator-utils";

export const MATERIAL_ORDER = [
  "탈로시안 화폐",
  "초급 작전 기록",
  "중급 작전 기록",
  "고급 작전 기록",
  "초급 인지 매개체",
  "고급 인지 매개체",
  "무기 점검 유닛",
  "무기 점검 장치",
  "무기 점검 세트",
  "프로토콜 디스크",
  "프로토콜 디스크 세트",
  "모형 틀",
  "중형 모형 틀",
  "프로토콜 프리즘",
  "프로토콜 프리즘 세트",
  "연한 붉은 기둥 버섯",
  "보통 붉은 기둥 버섯",
  "진한 붉은 기둥 버섯",
  "스타게이트 버섯",
  "피버섯",
  "연한 흑암석",
  "일반 흑암석",
  "진한 흑암석",
  "무릉석",
  "화염석",
  "칼코덴드라",
  "크리소덴드라",
  "비트로덴드라",
  "바위아겔로스 잎",
  "침식된 옥 잎",
  "존속의 흔적",
  "초거리 빛 반사 파이프",
  "D96강 시제품 4번",
  "타키온 차폐 구조체",
  "정합용 유체",
  "3상 나노 플레이크 칩",
] as const;

const orderMap = new Map<string, number>(
  MATERIAL_ORDER.map((name, index) => [name, index])
);

function normalize(text: string) {
  return String(text ?? "").trim();
}

export function sortSimulatorMaterials({ items }: { items: SimMaterial[] }): SimMaterial[] {
  return [...items].sort((a, b) => {
    const aIndex = orderMap.get(normalize(a.name));
    const bIndex = orderMap.get(normalize(b.name));

    if (aIndex !== undefined && bIndex !== undefined && aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;

    return normalize(a.name).localeCompare(normalize(b.name), "ko");
  });
}
