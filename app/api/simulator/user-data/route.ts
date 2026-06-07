import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { formatServerTiming } from "@/lib/http/server-timing";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startedAt = performance.now();
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, state: null, materials: {} },
      { status: 401 },
    );
  }

  const dbStartedAt = performance.now();
  const [savedState, inventory] = await Promise.all([
    prisma.simulatorState.findUnique({
      where: { userId: session.user.id },
      select: { state: true, updatedAt: true },
    }),
    prisma.userMaterialInventory.findMany({
      where: { userId: session.user.id },
      select: { material: true, quantity: true },
    }),
  ]);
  const dbFinishedAt = performance.now();

  return NextResponse.json(
    {
      ok: true,
      state: savedState?.state ?? null,
      stateUpdatedAt: savedState?.updatedAt ?? null,
      materials: Object.fromEntries(
        inventory.map((item) => [item.material, item.quantity]),
      ),
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "Server-Timing": formatServerTiming([
          {
            name: "db",
            duration: dbFinishedAt - dbStartedAt,
            description: "simulator user data",
          },
          {
            name: "total",
            duration: performance.now() - startedAt,
            description: "request total",
          },
        ]),
      },
    },
  );
}
