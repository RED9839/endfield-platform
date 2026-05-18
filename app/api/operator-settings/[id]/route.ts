import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type SlotKey = "main" | "member1" | "member2" | "member3";

const SLOT_KEYS: SlotKey[] = ["main", "member1", "member2", "member3"];

function normalizeSlot(slot: any) {
  const operatorSlug = String(
    slot?.operatorSlug ?? slot?.form?.operatorSlug ?? "",
  ).trim();

  const form = slot?.form ?? null;

  if (!operatorSlug || !form) return null;

  return {
    operatorSlug,
    form: {
      ...form,
      operatorSlug,
    },
  };
}

function normalizeSlots(slots: any): Record<SlotKey, any | null> {
  return {
    main: normalizeSlot(slots?.main),
    member1: normalizeSlot(slots?.member1 ?? slots?.member2),
    member2: normalizeSlot(slots?.member2 ?? slots?.member3),
    member3: normalizeSlot(slots?.member3 ?? slots?.member4),
  };
}

function normalizeCycle(cycle: any) {
  return Array.isArray(cycle) ? cycle : [];
}

function countRegisteredSlots(slots: Record<SlotKey, any | null>) {
  return SLOT_KEYS.filter((slotKey) => Boolean(slots[slotKey]?.operatorSlug))
    .length;
}

async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const sessionUserId = String(session.user.id).trim();
  const sessionEmail = session.user.email?.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: sessionUserId },
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: { id: true },
  });

  return user?.id ?? sessionUserId;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  const setting = await prisma.userOperatorSetting.findUnique({
    where: { id },
  });

  if (!setting) {
    return NextResponse.json(
      { ok: false, message: "세팅을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    isOwner: Boolean(userId && userId === setting.userId),
    setting: {
      ...setting,
      cycle: normalizeCycle((setting as any).cycle),
      slots: normalizeSlots(setting.slots),
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const existing = await prisma.userOperatorSetting.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "수정할 세팅이 없습니다." },
      { status: 404 },
    );
  }

  if (existing.userId !== userId) {
    return NextResponse.json(
      { ok: false, message: "본인이 저장한 세팅만 수정할 수 있습니다." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);

  const title = String(body?.title ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const cycle = normalizeCycle(body?.cycle);
  const slots = normalizeSlots(body?.slots);

  if (!title) {
    return NextResponse.json(
      { ok: false, message: "세팅 제목을 입력해주세요." },
      { status: 400 },
    );
  }

  if (!slots.main?.operatorSlug) {
    return NextResponse.json(
      { ok: false, message: "메인 오퍼레이터를 먼저 등록해주세요." },
      { status: 400 },
    );
  }

  const updated = await prisma.userOperatorSetting.update({
    where: { id },
    data: {
      type: countRegisteredSlots(slots) >= 2 ? "party" : "solo",
      title,
      description: description || null,
      cycle,
      slots,
    },
  });

  return NextResponse.json({
    ok: true,
    setting: {
      ...updated,
      cycle: normalizeCycle((updated as any).cycle),
      slots: normalizeSlots(updated.slots),
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json(
      { ok: false, message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const existing = await prisma.userOperatorSetting.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "삭제할 세팅이 없습니다." },
      { status: 404 },
    );
  }

  if (existing.userId !== userId) {
    return NextResponse.json(
      { ok: false, message: "본인이 저장한 세팅만 삭제할 수 있습니다." },
      { status: 403 },
    );
  }

  await prisma.userOperatorSettingLike.deleteMany({
    where: { settingId: id },
  });

  await prisma.userOperatorSetting.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
