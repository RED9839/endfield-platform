import { NextResponse } from "next/server";

import { getOperatorDetailBySlug } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const operatorSlug = searchParams.get("operator")?.trim();
  const weaponSlug = searchParams.get("weapon")?.trim();

  const operator = operatorSlug
    ? getOperatorDetailBySlug(operatorSlug) ?? null
    : null;
  const weapon = weaponSlug
    ? weaponDetails.find((item) => item.slug === weaponSlug) ?? null
    : null;

  if ((operatorSlug && !operator) || (weaponSlug && !weapon)) {
    return NextResponse.json(
      { ok: false, message: "Requested simulator data was not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { ok: true, operator, weapon },
    { headers: { "Cache-Control": CACHE_CONTROL } },
  );
}
