const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_CYCLE_ITEMS = 100;
const MAX_PAYLOAD_BYTES = 100_000;

type OperatorSettingInput = {
  title: string;
  description: string;
  slots: Prisma.InputJsonObject;
  cycle: Prisma.InputJsonArray;
};

type ValidationResult =
  | { ok: true; data: OperatorSettingInput }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getOperatorSlug(slot: unknown) {
  if (!isRecord(slot)) return "";
  const form = isRecord(slot.form) ? slot.form : null;
  return String(slot.operatorSlug ?? form?.operatorSlug ?? "").trim();
}

export function validateOperatorSettingInput(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return { ok: false, message: "요청 본문이 올바른 JSON 객체가 아닙니다." };
  }

  let serialized = "";
  try {
    serialized = JSON.stringify(body);
  } catch {
    return { ok: false, message: "요청 데이터를 직렬화할 수 없습니다." };
  }

  if (Buffer.byteLength(serialized, "utf8") > MAX_PAYLOAD_BYTES) {
    return { ok: false, message: "세팅 데이터가 너무 큽니다." };
  }

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const slots = body.slots;
  const cycle = body.cycle ?? [];

  if (!title) {
    return { ok: false, message: "세팅 제목을 입력해주세요." };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return {
      ok: false,
      message: `세팅 제목은 ${MAX_TITLE_LENGTH}자 이하여야 합니다.`,
    };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      message: `설명은 ${MAX_DESCRIPTION_LENGTH}자 이하여야 합니다.`,
    };
  }

  if (!isRecord(slots)) {
    return { ok: false, message: "슬롯 정보가 올바르지 않습니다." };
  }

  if (!getOperatorSlug(slots.main)) {
    return {
      ok: false,
      message: "메인 오퍼레이터를 먼저 등록해주세요.",
    };
  }

  if (!Array.isArray(cycle) || cycle.length > MAX_CYCLE_ITEMS) {
    return {
      ok: false,
      message: `사이클은 최대 ${MAX_CYCLE_ITEMS}개까지 저장할 수 있습니다.`,
    };
  }

  return {
    ok: true,
    data: {
      title,
      description,
      slots: slots as Prisma.InputJsonObject,
      cycle: cycle as Prisma.InputJsonArray,
    },
  };
}
import type { Prisma } from "@prisma/client";
