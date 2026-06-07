import { NextResponse } from "next/server";

import { gearDetails } from "@/data/gear-detail-data";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";

function splitSlugs(value: string | null) {
  return Array.from(
    new Set(
      String(value ?? "")
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean),
    ),
  );
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const operatorSlugs = splitSlugs(searchParams.get("operators"));
  const weaponSlugs = splitSlugs(searchParams.get("weapons"));
  const gearSlugs = splitSlugs(searchParams.get("gears"));

  return NextResponse.json(
    {
      ok: true,
      operators: operatorDetails.filter((item) =>
        operatorSlugs.includes(item.slug),
      ),
      weapons: weaponDetails.filter((item) => weaponSlugs.includes(item.slug)),
      gears: gearDetails.filter((item) => gearSlugs.includes(item.slug)),
    },
    { headers: { "Cache-Control": CACHE_CONTROL } },
  );
}
