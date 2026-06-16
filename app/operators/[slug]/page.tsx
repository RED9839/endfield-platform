import { notFound } from "next/navigation";
import {
  getOperatorDetailBySlug,
  operatorDetails,
} from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import { gearSummaries } from "@/data/gear-summary-data";

import OperatorDetailView from "./OperatorDetailView";

// 정적 데이터 기반이므로 빌드 시 모든 슬러그를 프리렌더(SSG)한다 → CDN 캐시.
export function generateStaticParams() {
  return operatorDetails.map((operator) => ({ slug: operator.slug }));
}

export default async function OperatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const operator = getOperatorDetailBySlug(slug);
  if (!operator) notFound();

  const operators = operatorDetails.map((item) => ({
    slug: item.slug,
    name: item.name,
    enName: item.enName,
    avatar: item.avatar,
    element: item.element,
  }));
  const weapons = weaponDetails.map((item) => ({
    slug: item.slug,
    name: item.name,
    image: item.image,
  }));
  const gears = gearSummaries.map((item) => ({
    slug: item.slug,
    name: item.name,
    setName: item.setName,
    image: item.image,
  }));

  return (
    <OperatorDetailView
      operator={operator}
      operators={operators}
      weapons={weapons}
      gears={gears}
    />
  );
}
