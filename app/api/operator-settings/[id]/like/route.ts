import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const email = session.user.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.user.id },
        ...(email
          ? [{ email: { equals: email, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const setting = await prisma.userOperatorSetting.findUnique({
      where: { id },
      select: { id: true, likeCount: true },
    });

    if (!setting) {
      return NextResponse.json(
        { ok: false, message: "세팅을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const existingLike = await prisma.userOperatorSettingLike.findUnique({
      where: {
        userId_settingId: {
          userId,
          settingId: id,
        },
      },
      select: { id: true },
    });

    if (existingLike) {
      const updated = await prisma.$transaction(async (tx) => {
        await tx.userOperatorSettingLike.delete({
          where: { id: existingLike.id },
        });

        return tx.userOperatorSetting.update({
          where: { id },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
          select: { likeCount: true },
        });
      });

      return NextResponse.json({
        ok: true,
        liked: false,
        likeCount: Math.max(0, updated.likeCount),
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.userOperatorSettingLike.create({
        data: {
          userId,
          settingId: id,
        },
      });

      return tx.userOperatorSetting.update({
        where: { id },
        data: {
          likeCount: {
            increment: 1,
          },
        },
        select: { likeCount: true },
      });
    });

    return NextResponse.json({
      ok: true,
      liked: true,
      likeCount: updated.likeCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, message: "추천 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
