import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, materials: {}, message: "로그인이 필요합니다." },
      { status: 401 },
    );
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
    return NextResponse.json(
      { ok: false, message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const materials = body?.materials;

  if (!materials || typeof materials !== "object") {
    return NextResponse.json(
      { ok: false, message: "저장할 보유 재화 정보가 없습니다." },
      { status: 400 },
    );
  }

  const entries = Object.entries(materials)
    .map(([material, quantity]) => ({
      userId: session.user.id,
      material: material.trim(),
      quantity: Number(quantity) || 0,
    }))
    .filter((item) => item.material && item.quantity > 0);
  const retainedMaterials = entries.map((item) => item.material);

  await prisma.$transaction([
    prisma.userMaterialInventory.deleteMany({
      where: {
        userId: session.user.id,
        ...(retainedMaterials.length
          ? { material: { notIn: retainedMaterials } }
          : {}),
      },
    }),
    ...entries.map((item) =>
      prisma.userMaterialInventory.upsert({
        where: {
          userId_material: {
            userId: item.userId,
            material: item.material,
          },
        },
        create: item,
        update: {
          quantity: item.quantity,
        },
      }),
    ),
  ]);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  await prisma.userMaterialInventory.deleteMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ ok: true });
}
