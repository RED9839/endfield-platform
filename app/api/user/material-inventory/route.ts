import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, materials: {} }, { status: 401 });
  }

  const inventory = await prisma.userMaterialInventory.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      material: true,
      quantity: true,
    },
  });

  const materials = Object.fromEntries(
    inventory.map((item) => [item.material, item.quantity]),
  );

  return NextResponse.json({
    ok: true,
    materials,
  });
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
      { ok: false, message: "저장할 보유 재화 정보가 없습니다." },
      { status: 400 },
    );
  }

  await prisma.userMaterialInventory.deleteMany({
    where: {
      userId: session.user.id,
    },
  });

  const entries = Object.entries(materials)
    .map(([material, quantity]) => ({
      userId: session.user.id,
      material,
      quantity: Number(quantity) || 0,
    }))
    .filter((item) => item.quantity > 0);

  if (entries.length > 0) {
    await prisma.userMaterialInventory.createMany({
      data: entries,
    });
  }

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