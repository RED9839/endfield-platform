import { NextResponse } from "next/server";

import { gearSummaries } from "@/data/gear-summary-data";
import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    ok: true,
    operators: operatorSummaries.map((operator) => ({
      slug: operator.slug,
      name: operator.name,
      enName: operator.enName,
      rarity: operator.rarity,
      element: operator.element,
      class: operator.class,
      weapon: operator.weapon,
      avatar: operator.avatar,
      avatarSecondary:
        operator.slug === "endministrator" ? operator.avatarSecondary : undefined,
    })),
    weapons: weaponSummaries.map((weapon) => ({
      slug: weapon.slug,
      name: weapon.name,
      enName: weapon.enName,
      rarity: weapon.rarity,
      weaponType: weapon.weaponType,
      image: weapon.image,
      series: weapon.series,
    })),
    gears: gearSummaries.map((gear) => ({
      slug: gear.slug,
      name: gear.name,
      enName: gear.enName,
      image: gear.image,
      level: gear.level,
      quality: gear.quality,
      category: gear.category,
      setName: gear.setName,
      abilityTypes: gear.abilityTypes,
      attributeTypes: gear.attributeTypes,
      attributeLabel: gear.attributeLabel,
    })),
  });
}
