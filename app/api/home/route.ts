import { NextResponse } from "next/server";

import {
  getHomeData,
  HOME_EDGE_CACHE_SECONDS,
  HOME_STALE_WHILE_REVALIDATE_SECONDS,
} from "@/lib/home/get-home-data";

type HomeData = Awaited<ReturnType<typeof getHomeData>>;

function getCompactItems(data: HomeData) {
  const seen = new Set<string>();

  return [...data.latest, ...data.notice, ...data.event, ...data.news].filter(
    (item) => {
      const key = item.id || `${item.title}|${item.image}|${item.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    },
  );
}

function json(data: HomeData, compact: boolean) {
  const payload = compact
    ? {
        ok: data.ok,
        items: getCompactItems(data),
        weaponStack: data.weaponStack,
        message: data.message,
      }
    : data;

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": `public, s-maxage=${HOME_EDGE_CACHE_SECONDS}, stale-while-revalidate=${HOME_STALE_WHILE_REVALIDATE_SECONDS}`,
    },
  });
}

export async function GET(request: Request) {
  const compact = new URL(request.url).searchParams.get("compact") === "1";
  const data = await getHomeData();
  return json(data, compact);
}
