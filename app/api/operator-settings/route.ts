import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { formatServerTiming } from "@/lib/http/server-timing";
import { enforceRateLimit } from "@/lib/http/rate-limit";
import { getSettingsList } from "@/lib/operator-settings/list-query";
import {
  getSettingsLimit,
  getSettingsPage,
} from "@/lib/operator-settings/pagination";
import { prisma } from "@/lib/prisma";
import { validateOperatorSettingInput } from "@/lib/operator-settings/validation";

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

function cleanSearchParam(value: string | null) {
  return String(value ?? "").trim();
}

function splitListParam(value: string | null) {
  return cleanSearchParam(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

export async function GET(request: Request) {
  const startedAt = performance.now();
  const { searchParams } = new URL(request.url);

  const dbStartedAt = performance.now();
  const result = await getSettingsList({
    keyword: cleanSearchParam(searchParams.get("keyword")),
    type: cleanSearchParam(searchParams.get("type")),
    sort: cleanSearchParam(searchParams.get("sort")),
    operatorFilters: splitListParam(searchParams.get("operators")),
    weaponFilter: cleanSearchParam(searchParams.get("weapon")),
    page: getSettingsPage(searchParams.get("page")),
    limit: getSettingsLimit(searchParams.get("limit")),
  });
  const dbFinishedAt = performance.now();

  return NextResponse.json(
    {
      ok: true,
      ...result,
    },
    {
      headers: {
        // 공개 목록(쿼리 파라미터별 결정적) → CDN에서 짧게 캐시하고 백그라운드 재검증.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Server-Timing": formatServerTiming([
          {
            name: "db",
            duration: dbFinishedAt - dbStartedAt,
            description: "settings queries",
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

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const validation = validateOperatorSettingInput(body);

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, message: validation.message },
      { status: 400 },
    );
  }

  const rateLimit = await enforceRateLimit({
    scope: "operator-settings:create",
    identifier: user.id,
    limit: 10,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      },
    );
  }

  const { title, description, slots, cycle } = validation.data;
  const bodyNickname = String(
    body?.userNickname ?? body?.authorNickname ?? body?.nickname ?? "",
  ).trim();
  const nickname = bodyNickname || getUserNickname(user) || null;

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
