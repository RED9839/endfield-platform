import { Suspense } from "react";
import { gearSummaries } from "@/data/gear-summary-data";
import GearPageClient, {
  type GearListItem,
} from "./_components/GearPageClient";
import "./gear-list-overrides.css";

// searchParams를 서버에서 읽지 않으므로 async가 아님 → 정적 렌더링(CDN 캐시 가능).
// `?set=` 딥링크 해석은 GearPageClient가 useSearchParams로 처리한다.
export default function GearPage() {
  const gears: GearListItem[] = gearSummaries.map((gear) => ({
    slug: gear.slug,
    name: gear.name,
    enName: gear.enName,
    category: gear.category,
    level: gear.level,
    quality: gear.quality,
    setName: gear.setName,
    image: gear.image,
    abilityTypes: gear.abilityTypes,
    attributeTypes: gear.attributeTypes,
    attributeLabel: gear.attributeLabel,
  }));

  // useSearchParams를 쓰는 클라이언트 컴포넌트는 Suspense로 감싸야 정적 생성이 유지된다.
  return (
    <Suspense fallback={null}>
      <GearPageClient gears={gears} />
    </Suspense>
  );
}
