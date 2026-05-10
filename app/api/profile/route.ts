import { NextResponse } from "next/server";

type UserProfile = {
  uid: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
};

const tempProfiles = new Map<string, UserProfile>();

function getTempUserId() {
  // 나중에 구글 로그인 붙이면 여기에서 session.user.id 같은 값으로 교체하면 됩니다.
  return "temp-user";
}

export async function GET() {
  const uid = getTempUserId();
  const profile = tempProfiles.get(uid) ?? null;

  return NextResponse.json({
    ok: true,
    profile,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nickname = String(body.nickname ?? "").trim();

    if (!nickname) {
      return NextResponse.json(
        { ok: false, message: "닉네임을 입력해주세요." },
        { status: 400 },
      );
    }

    if (nickname.length < 2 || nickname.length > 12) {
      return NextResponse.json(
        { ok: false, message: "닉네임은 2~12자 사이로 입력해주세요." },
        { status: 400 },
      );
    }

    const uid = getTempUserId();
    const now = new Date().toISOString();

    const profile: UserProfile = {
      uid,
      nickname,
      createdAt: tempProfiles.get(uid)?.createdAt ?? now,
      updatedAt: now,
    };

    tempProfiles.set(uid, profile);

    return NextResponse.json({
      ok: true,
      profile: {
        nickname: profile.nickname,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "잘못된 요청입니다." },
      { status: 400 },
    );
  }
}