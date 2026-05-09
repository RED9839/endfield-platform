import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, materials: null }, { status: 401 });
  }

  const saved = await prisma.userMaterialInventory.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      data: true,
      updatedAt: true,
    },
  });

  if (!saved?.data) {
    return NextResponse.json({ ok: true, materials: null });
  }

  try {
    return NextResponse.json({
      ok: true,
      materials: JSON.parse(saved.data),
      updatedAt: saved.updatedAt,
    });
  } catch {
    return NextResponse.json({ ok: true, materials: null });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const materials = body?.materials;

  if (!materials || typeof materials !== "object") {
    return NextResponse.json(
      { ok: false, message: "저장할 보유 재화 값이 없습니다." },
      { status: 400 },
    );
  }

  await prisma.userMaterialInventory.upsert({
    where: {
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      data: JSON.stringify(materials),
    },
    update: {
      data: JSON.stringify(materials),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await prisma.userMaterialInventory.deleteMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ ok: true });
}
