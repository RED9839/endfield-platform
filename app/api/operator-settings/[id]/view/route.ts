import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
