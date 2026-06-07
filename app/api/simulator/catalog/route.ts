import { NextResponse } from "next/server";

import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    ok: true,
    operators: operatorDetails.map((operator) => ({
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
    weapons: weaponDetails.map((weapon) => ({
      slug: weapon.slug,
      name: weapon.name,
      enName: weapon.enName,
      rarity: weapon.rarity,
      weaponType: weapon.weaponType,
      image: weapon.image,
      series: weapon.series,
    })),
  });
}
