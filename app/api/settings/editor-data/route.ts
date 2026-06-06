import { NextResponse } from "next/server";

import { gearDetails } from "@/data/gear-detail-data";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    ok: true,
    operators: operatorDetails,
    weapons: weaponDetails,
    gears: gearDetails,
  });
}
