import { gearDetails } from "@/data/gear-detail-data";
import GearPageClient, {
  type GearListItem,
} from "./_components/GearPageClient";
import "./gear-list-overrides.css";

export default function GearPage() {
  const gears: GearListItem[] = gearDetails.map((gear) => ({
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
    attributeLabel: gear.attribute.label,
  }));

  return <GearPageClient gears={gears} />;
}
