import { NextResponse } from "next/server";

import type { HomeSearchItem } from "@/app/components/home/HomeSearchPanel";
import { gearSummaries } from "@/data/gear-summary-data";
import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";

// 정적 데이터에서 파생되는 통합 검색 인덱스. 빌드 시 정적으로 생성되어 CDN에서 서빙된다.
// 홈 초기 payload에 인덱스를 직렬화하지 않고, 검색 사용 시점에만 클라이언트가 지연 로딩한다.
export const dynamic = "force-static";

export function GET() {
  const items: HomeSearchItem[] = [
    ...operatorSummaries.map((item) => ({
      id: `operator-${item.slug}`,
      name: item.name,
      subName: item.enName ?? item.slug,
      image: item.avatar ?? `/operators/${item.slug}/avatar.webp`,
      href: `/operators/${item.slug}`,
      category: "operator" as const,
    })),
    ...weaponSummaries.map((item) => ({
      id: `weapon-${item.slug}`,
      name: item.name,
      subName: item.enName ?? item.slug,
      image: item.image ?? `/weapons/${item.slug}/avatar.webp`,
      href: `/weapons/${item.slug}`,
      category: "weapon" as const,
    })),
    ...gearSummaries.map((item) => ({
      id: `gear-${item.slug}`,
      name: item.name,
      subName: item.enName ?? item.setName ?? item.slug,
      image: item.image ?? `/gear/${item.slug}.webp`,
      href: `/gear/${item.slug}`,
      category: "gear" as const,
    })),
  ];

  return NextResponse.json(items);
}
