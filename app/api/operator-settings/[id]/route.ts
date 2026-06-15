import { NextResponse } from "next/server";

import { getSessionUserId } from "@/lib/auth/get-current-user";
import { enforceRateLimit } from "@/lib/http/rate-limit";
import { validateOperatorSettingInput } from "@/lib/operator-settings/validation";
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getSessionUserId();

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
  const userId = await getSessionUserId();

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
  const validation = validateOperatorSettingInput(body);

  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, message: validation.message },
      { status: 400 },
    );
  }

  const rateLimit = await enforceRateLimit({
    scope: "operator-settings:update",
    identifier: userId,
    limit: 20,
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

  const title = validation.data.title;
  const description = validation.data.description;
  const cycle = normalizeCycle(validation.data.cycle);
  const slots = normalizeSlots(validation.data.slots);

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
  const userId = await getSessionUserId();

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

  const rateLimit = await enforceRateLimit({
    scope: "operator-settings:delete",
    identifier: userId,
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

  await prisma.userOperatorSettingLike.deleteMany({
    where: { settingId: id },
  });

  await prisma.userOperatorSetting.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
