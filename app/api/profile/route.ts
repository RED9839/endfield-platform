import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) {
    return null;
  }

  const sessionUserId = session.user.id ? String(session.user.id).trim() : "";
  const sessionEmail = session.user.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(sessionUserId ? [{ id: sessionUserId }] : []),
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      nickname: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "로그인이 필요합니다.",
        profile: null,
        user: null,
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    profile: {
      nickname: user.nickname ?? "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickname ?? "",
    },
  });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const nickname = String(body.nickname ?? "").trim();

    if (!nickname) {
      return NextResponse.json(
        { ok: false, message: "닉네임을 입력해주세요." },
        { status: 400 },
      );
    }

    if (nickname.length < 2 || nickname.length > 16) {
      return NextResponse.json(
        { ok: false, message: "닉네임은 2~16자로 입력해주세요." },
        { status: 400 },
      );
    }

    const duplicated = await prisma.user.findFirst({
      where: {
        nickname,
        NOT: {
          id: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicated) {
      return NextResponse.json(
        { ok: false, message: "이미 사용 중인 닉네임입니다." },
        { status: 409 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        nickname,
      },
      select: {
        id: true,
        name: true,
        email: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      profile: {
        nickname: updatedUser.nickname ?? "",
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        nickname: updatedUser.nickname ?? "",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "잘못된 요청입니다." },
      { status: 400 },
    );
  }
}
