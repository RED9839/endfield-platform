import { getOperatorDetailByName } from "./operators-detail-data";

export const homeFeaturedOperatorName = "라스트라이트";

export function getHomeFeaturedOperator() {
  const operator = getOperatorDetailByName(homeFeaturedOperatorName);

  if (!operator) {
    throw new Error(
      `홈 배경용 오퍼레이터를 찾을 수 없습니다: ${homeFeaturedOperatorName}`
    );
  }

  return {
    name: operator.name,
    subtitle: "현재 픽업 오퍼레이터",
    description: `${operator.name} 오퍼레이터의 상세 정보, 능력치, 재료 데이터를 바로 확인할 수 있습니다.`,
    slug: operator.slug,
    href: `/operators/${operator.slug}`,
    heroImage: `/operators/${operator.slug}/full1.webp`,
  };
}