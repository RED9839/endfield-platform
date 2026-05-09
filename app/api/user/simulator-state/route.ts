import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, state: null }, { status: 401 });
  }

  const saved = await prisma.simulatorState.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      data: true,
      updatedAt: true,
    },
  });

  if (!saved?.data) {
    return NextResponse.json({ ok: true, state: null });
  }

  try {
    return NextResponse.json({
      ok: true,
      state: JSON.parse(saved.data),
      updatedAt: saved.updatedAt,
    });
  } catch {
    return NextResponse.json({ ok: true, state: null });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const state = body?.state;

  if (!state || typeof state !== "object") {
    return NextResponse.json(
      { ok: false, message: "저장할 시뮬레이터 상태가 없습니다." },
      { status: 400 },
    );
  }

  const { ownedMaterials: _ownedMaterials, ...stateWithoutMaterials } = state;

  await prisma.simulatorState.upsert({
    where: {
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      data: JSON.stringify(stateWithoutMaterials),
    },
    update: {
      data: JSON.stringify(stateWithoutMaterials),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await prisma.simulatorState.deleteMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ ok: true });
}
