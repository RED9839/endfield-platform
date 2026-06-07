import { NextResponse } from "next/server";

import {
  consumeRateLimit,
  getRequestIdentifier,
} from "@/lib/http/rate-limit";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rateLimit = consumeRateLimit({
    scope: `operator-settings:view:${id}`,
    identifier: getRequestIdentifier(request),
    limit: 1,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: true, counted: false },
      {
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rateLimit.retryAfter),
        },
      },
    );
  }

  const result = await prisma.userOperatorSetting.updateMany({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  return NextResponse.json(
    { ok: true, counted: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
