import { NextResponse } from "next/server";

import {
  getHomeData,
  HOME_EDGE_CACHE_SECONDS,
  HOME_STALE_WHILE_REVALIDATE_SECONDS,
} from "@/lib/home/get-home-data";

function json(data: Awaited<ReturnType<typeof getHomeData>>) {
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": `public, s-maxage=${HOME_EDGE_CACHE_SECONDS}, stale-while-revalidate=${HOME_STALE_WHILE_REVALIDATE_SECONDS}`,
    },
  });
}

export async function GET() {
  const data = await getHomeData();
  return json(data);
}
