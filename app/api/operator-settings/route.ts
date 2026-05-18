import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function countRegisteredSlots(slots: any) {
  return [slots?.main, slots?.member1, slots?.member2, slots?.member3].filter(
    (slot) => Boolean(slot?.operatorSlug),
  ).length;
}

function getUserNickname(user: {
  nickname?: string | null;
  name?: string | null;
  email?: string | null;
}) {
  return String(user.nickname ?? "").trim();
}

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const sessionEmail = session.user.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: session.user.id },
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: {
      id: true,
      nickname: true,
      name: true,
      email: true,
    },
  });

  return user;
}

export async function GET() {
  const settings = await prisma.userOperatorSetting.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    settings: settings.map((setting) => ({
      ...setting,
      nickname: setting.nickname ?? setting.user?.nickname ?? null,
      userNickname: setting.nickname ?? setting.user?.nickname ?? null,
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const slots = body?.slots;
  const cycle = Array.isArray(body?.cycle) ? body.cycle : [];
  const bodyNickname = String(
    body?.userNickname ?? body?.authorNickname ?? body?.nickname ?? "",
  ).trim();
  const nickname = bodyNickname || getUserNickname(user) || null;

  if (!title) {
    return NextResponse.json(
      { ok: false, message: "세팅 제목을 입력해주세요." },
      { status: 400 },
    );
  }

  if (!slots?.main?.operatorSlug) {
    return NextResponse.json(
      { ok: false, message: "메인 오퍼레이터를 먼저 등록해주세요." },
      { status: 400 },
    );
  }

  const count = countRegisteredSlots(slots);
  const type = count >= 2 ? "party" : "solo";

  const setting = await prisma.userOperatorSetting.create({
    data: {
      userId: user.id,
      type,
      title,
      description: description || null,
      cycle,
      slots,
      nickname,
    },
  });

  return NextResponse.json({ ok: true, setting });
}
