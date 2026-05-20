import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { operatorDetails } from "@/data/operators-detail-data";
import { weaponDetails } from "@/data/weapons-detail-data";
import { prisma } from "@/lib/prisma";

type SettingType = "solo" | "party";
type SortType = "latest" | "popular" | "views";

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

function getSettingNickname(setting: any) {
  return String(setting.nickname ?? setting.user?.nickname ?? "").trim();
}

function getSettingOperatorSlugs(slots: any) {
  return Array.from(
    new Set(
      [
        slots?.main?.operatorSlug,
        slots?.member1?.operatorSlug,
        slots?.member2?.operatorSlug,
        slots?.member3?.operatorSlug,
      ]
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  );
}

function getSettingWeaponSlug(slots: any) {
  return String(slots?.main?.form?.weaponSlug ?? "").trim();
}

function getSettingSearchText(setting: any) {
  const operatorSlugs = getSettingOperatorSlugs(setting.slots);
  const operators = operatorSlugs
    .map((slug) => operatorDetails.find((operator: any) => operator.slug === slug))
    .filter(Boolean) as any[];
  const weaponSlug = getSettingWeaponSlug(setting.slots);
  const weapon = weaponDetails.find((item: any) => item.slug === weaponSlug) as any;

  return [
    getSettingNickname(setting),
    setting.title,
    setting.description,
    ...operatorSlugs,
    ...operators.flatMap((operator) => [operator.name, operator.enName, operator.slug]),
    weapon?.name,
    weapon?.enName,
    weapon?.slug,
  ]
    .join(" ")
    .toLowerCase();
}

function sortSettings(settings: any[], sortType: SortType) {
  return [...settings].sort((a, b) => {
    const aCreatedAt = String(a.createdAt ?? "");
    const bCreatedAt = String(b.createdAt ?? "");

    if (sortType === "popular") {
      return (
        Number(b.likeCount ?? b.likes ?? 0) -
          Number(a.likeCount ?? a.likes ?? 0) || bCreatedAt.localeCompare(aCreatedAt)
      );
    }

    if (sortType === "views") {
      return (
        Number(b.viewCount ?? b.views ?? 0) -
          Number(a.viewCount ?? a.views ?? 0) || bCreatedAt.localeCompare(aCreatedAt)
      );
    }

    return bCreatedAt.localeCompare(aCreatedAt);
  });
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
  const { searchParams } = new URL(request.url);
  const keyword = cleanSearchParam(searchParams.get("keyword"));
  const typeParam = cleanSearchParam(searchParams.get("type"));
  const sortParam = cleanSearchParam(searchParams.get("sort"));
  const operatorFilters = splitListParam(searchParams.get("operators"));
  const weaponFilter = cleanSearchParam(searchParams.get("weapon"));

  const settingType: SettingType | "all" =
    typeParam === "solo" || typeParam === "party" ? typeParam : "all";
  const sortType: SortType =
    sortParam === "popular" || sortParam === "views" ? sortParam : "latest";
  const keywordQueries = keyword
    .split("/")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

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

  const filteredSettings = settings.filter((setting) => {
    const operatorSlugs = getSettingOperatorSlugs(setting.slots);
    const weaponSlug = getSettingWeaponSlug(setting.slots);
    const searchableText = getSettingSearchText(setting);

    const matchesKeyword =
      keywordQueries.length === 0 ||
      keywordQueries.every((query) => searchableText.includes(query));
    const matchesType = settingType === "all" || setting.type === settingType;
    const matchesOperator =
      operatorFilters.length === 0 ||
      operatorFilters.some((operatorSlug) => operatorSlugs.includes(operatorSlug));
    const matchesWeapon = !weaponFilter || weaponSlug === weaponFilter;

    return matchesKeyword && matchesType && matchesOperator && matchesWeapon;
  });

  return NextResponse.json({
    ok: true,
    total: filteredSettings.length,
    settings: sortSettings(filteredSettings, sortType).map((setting) => ({
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
