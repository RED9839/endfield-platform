import { NextResponse } from "next/server";

import { gearDetails } from "@/data/gear-detail-data";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";

const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800";

const operatorBySlug = new Map(operatorDetails.map((item) => [item.slug, item]));
const weaponBySlug = new Map(weaponDetails.map((item) => [item.slug, item]));
const gearBySlug = new Map(gearDetails.map((item) => [item.slug, item]));

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

function pickBySlug<T>(slugs: string[], source: Map<string, T>) {
  return slugs
    .map((slug) => source.get(slug))
    .filter((item): item is T => Boolean(item));
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const operatorSlugs = splitSlugs(searchParams.get("operators"));
  const weaponSlugs = splitSlugs(searchParams.get("weapons"));
  const gearSlugs = splitSlugs(searchParams.get("gears"));

  return NextResponse.json(
    {
      ok: true,
      operators: pickBySlug(operatorSlugs, operatorBySlug),
      weapons: pickBySlug(weaponSlugs, weaponBySlug),
      gears: pickBySlug(gearSlugs, gearBySlug),
    },
    { headers: { "Cache-Control": CACHE_CONTROL } },
  );
}
