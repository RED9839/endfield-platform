import { gearSummaries } from "@/data/gear-summary-data";
import type { GearSetName } from "@/data/gear-types";
import GearPageClient, {
  type GearListItem,
} from "./_components/GearPageClient";
import "./gear-list-overrides.css";

export default async function GearPage({
  searchParams,
}: {
  searchParams?: Promise<{ set?: string }>;
}) {
  const query = await searchParams;
  const requestedSet = String(query?.set ?? "").trim();
  const initialSetName = gearSummaries.some(
    (gear) => gear.setName === requestedSet,
  )
    ? (requestedSet as GearSetName)
    : "all";

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

  return <GearPageClient gears={gears} initialSetName={initialSetName} />;
}
