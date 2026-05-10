"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import SettingEditor from "@/app/components/settings/SettingEditor";
import { operatorDetails } from "@/data/operators-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

const OPERATOR_SETTING_DRAFT_KEY = "endfield-operator-setting-draft-v1";
const SOLO_EDITOR_STORAGE_KEY = "endfield-operator-setting-form-v1";

type SlotKey = "main" | "member2" | "member3" | "member4";

type SavedSlotSetting = {
  operatorSlug: string;
  form: any;
};

type OperatorSettingDraft = {
  title: string;
  description: string;
  slots: Record<SlotKey, SavedSlotSetting | null>;
};

const defaultDraft: OperatorSettingDraft = {
  title: "",
  description: "",
  slots: {
    main: null,
    member2: null,
    member3: null,
    member4: null,
  },
};

const slotLabelMap: Record<SlotKey, string> = {
  main: "메인 오퍼레이터",
  member2: "파티원 2",
  member3: "파티원 3",
  member4: "파티원 4",
};

function loadDraft(): OperatorSettingDraft {
  if (typeof window === "undefined") return defaultDraft;

  try {
    const saved = window.localStorage.getItem(OPERATOR_SETTING_DRAFT_KEY);
    if (!saved) return defaultDraft;

    const parsed = JSON.parse(saved);

    return {
      ...defaultDraft,
      ...parsed,
      slots: {
        ...defaultDraft.slots,
        ...(parsed.slots ?? {}),
      },
    };
  } catch {
    return defaultDraft;
  }
}

function readEditorForm() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SOLO_EDITOR_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeEditorForm(form: any | null) {
  if (typeof window === "undefined") return;

  if (!form) {
    window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SOLO_EDITOR_STORAGE_KEY, JSON.stringify(form));
}

function getOperatorImage(operator: any) {
  return (
    operator?.avatar ??
    operator?.image ??
    `/operators/${operator?.slug}/avatar.webp`
  );
}

function getOperatorFullImage(operator: any) {
  return operator?.fullImage ?? `/operators/${operator?.slug}/full.webp`;
}

function getOperatorElementIcon(operator: any) {
  const element = operator?.element ?? operator?.elementKey ?? operator?.attribute;
  return element ? `/icons/elements/${element}.webp` : "";
}

export default function OperatorSettingRegisterPage() {
  const [draft, setDraft] = useState<OperatorSettingDraft>(defaultDraft);
  const [hydrated, setHydrated] = useState(false);
  const [editingSlot, setEditingSlot] = useState<SlotKey | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    setDraft(loadDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(OPERATOR_SETTING_DRAFT_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const operatorsBySlug = useMemo(() => {
    return new Map(operatorDetails.map((operator: any) => [operator.slug, operator]));
  }, []);

  const mainOperator = operatorsBySlug.get(draft.slots.main?.operatorSlug);
  const member2 = operatorsBySlug.get(draft.slots.member2?.operatorSlug);
  const member3 = operatorsBySlug.get(draft.slots.member3?.operatorSlug);
  const member4 = operatorsBySlug.get(draft.slots.member4?.operatorSlug);

  const filledSlots = [
    draft.slots.main,
    draft.slots.member2,
    draft.slots.member3,
    draft.slots.member4,
  ].filter(Boolean);

  const settingType = filledSlots.length >= 2 ? "party" : "solo";

  const editingPartyForms = useMemo(() => {
    if (!editingSlot) return [];

    return (Object.entries(draft.slots) as [SlotKey, SavedSlotSetting | null][])
      .filter(([slot, setting]) => slot !== editingSlot && Boolean(setting?.form))
      .map(([, setting]) => setting!.form);
  }, [draft.slots, editingSlot]);

  function openSettingModal(slot: SlotKey) {
    writeEditorForm(draft.slots[slot]?.form ?? null);
    setEditorKey((prev) => prev + 1);
    setEditingSlot(slot);
  }

  function applySettingModal() {
    if (!editingSlot) return;

    const form = readEditorForm();

    if (!form?.operatorSlug) {
      alert("오퍼레이터를 선택한 뒤 적용하세요.");
      return;
    }

    if (!form?.weaponSlug) {
      alert("무기를 선택한 뒤 적용하세요.");
      return;
    }

    const hasAllGear =
      Boolean(form?.armorSlug) &&
      Boolean(form?.glovesSlug) &&
      Boolean(form?.kit1Slug) &&
      Boolean(form?.kit2Slug);

    if (!hasAllGear) {
      alert("방어구, 보호 장갑, 부품 1, 부품 2를 모두 선택한 뒤 적용하세요.");
      return;
    }

    const duplicatedSlot = (Object.entries(draft.slots) as [SlotKey, SavedSlotSetting | null][]).find(
      ([slot, setting]) =>
        slot !== editingSlot && setting?.operatorSlug === form.operatorSlug,
    );

    if (duplicatedSlot) {
      alert(`${slotLabelMap[duplicatedSlot[0]]}에 이미 등록된 오퍼레이터입니다.`);
      return;
    }

    setDraft((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [editingSlot]: {
          operatorSlug: form.operatorSlug,
          form,
        },
      },
    }));

    setEditingSlot(null);
  }

  function clearSlot(slot: SlotKey) {
    setDraft((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [slot]: null,
      },
    }));
  }

  function resetDraft() {
    setDraft(defaultDraft);
    window.localStorage.removeItem(OPERATOR_SETTING_DRAFT_KEY);
    window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-5 text-white">
        <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-zinc-500">
          오퍼레이터 세팅 불러오는 중...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-5 text-white md:px-6">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-5 rounded-[24px] bg-[#05070b] p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                ENDFIELD SUPPORT PLATFORM
              </p>

              <h1
                className="mt-2 text-4xl font-black tracking-tight"
                style={{ color: YELLOW_TEXT }}
              >
                OPERATOR SETTING
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                메인 세팅만 등록하면 솔로, 파티원 세팅까지 등록하면 파티 세팅으로 저장됩니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetDraft}
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                초기화
              </button>

              <button
                type="button"
                className="rounded-xl px-5 py-2 text-sm font-black text-black transition hover:brightness-110"
                style={{ background: YELLOW_MAIN }}
              >
                오퍼레이터 세팅 저장
              </button>

              <Link
                href="/settings"
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                목록으로
              </Link>
            </div>
          </div>
        </header>

        <section
          className="mb-5 rounded-[24px] bg-[#05070b] p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
            <label className="grid gap-2">
              <span className="text-xs font-black tracking-[0.2em] text-[#ffdc70]">
                제목
              </span>

              <input
                value={draft.title}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder="오퍼레이터 세팅 제목"
                className="h-11 rounded-xl border border-white/10 bg-black px-4 text-sm font-bold text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400/40"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black tracking-[0.2em] text-[#ffdc70]">
                설명
              </span>

              <input
                value={draft.description}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="세팅 운용 방식, 추천 상황, 핵심 옵션 등을 입력"
                className="h-11 rounded-xl border border-white/10 bg-black px-4 text-sm font-bold text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400/40"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_420px] 2xl:grid-cols-[minmax(0,1.25fr)_460px]">
          <div
            className="rounded-[24px] bg-[#05070b] p-5"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#ffdc70]">
                세팅 구성
              </h2>

              <p className="text-xs font-bold text-zinc-500">
                세팅 버튼을 눌러 각 슬롯의 오퍼레이터 세팅을 등록합니다.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <OperatorSettingSlot
                slot="main"
                operator={mainOperator}
                setting={draft.slots.main}
                primary
                onOpenSetting={() => openSettingModal("main")}
                onClear={() => clearSlot("main")}
              />

              <OperatorSettingSlot
                slot="member2"
                operator={member2}
                setting={draft.slots.member2}
                onOpenSetting={() => openSettingModal("member2")}
                onClear={() => clearSlot("member2")}
              />

              <OperatorSettingSlot
                slot="member3"
                operator={member3}
                setting={draft.slots.member3}
                onOpenSetting={() => openSettingModal("member3")}
                onClear={() => clearSlot("member3")}
              />

              <OperatorSettingSlot
                slot="member4"
                operator={member4}
                setting={draft.slots.member4}
                onOpenSetting={() => openSettingModal("member4")}
                onClear={() => clearSlot("member4")}
              />
            </div>
          </div>

          <aside
            className="h-fit rounded-[24px] bg-[#05070b] p-5 xl:sticky xl:top-5"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#ffdc70]">
                저장 미리보기
              </h2>

              <span
                className={[
                  "rounded-md border px-2 py-1 text-[10px] font-black backdrop-blur-sm",
                  settingType === "solo"
                    ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-200"
                    : "border-sky-300/40 bg-sky-300/15 text-sky-200",
                ].join(" ")}
              >
                {settingType === "solo" ? "Solo" : "Party"}
              </span>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-white/10 bg-black">
              <div className="relative h-[360px] bg-black">
                {mainOperator ? (
                  <Image
                    src={getOperatorFullImage(mainOperator)}
                    alt={mainOperator.name}
                    fill
                    sizes="460px"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-bold text-zinc-600">
                    메인 오퍼레이터 세팅을 등록하세요
                  </div>
                )}

                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                <div className="absolute left-3 top-3 flex items-center gap-2">
                  {mainOperator && getOperatorElementIcon(mainOperator) ? (
                    <Image
                      src={getOperatorElementIcon(mainOperator)}
                      alt="속성"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  ) : null}

                  {mainOperator ? (
                    <span
                      className={[
                        "rounded-md border px-2 py-1 text-[10px] font-black backdrop-blur-sm",
                        settingType === "solo"
                          ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-200"
                          : "border-sky-300/40 bg-sky-300/15 text-sky-200",
                      ].join(" ")}
                    >
                      {settingType === "solo" ? "Solo" : "Party"}
                    </span>
                  ) : null}
                </div>

                {settingType === "party" ? (
                  <div className="absolute right-3 top-3 flex flex-col gap-1">
                    {[member2, member3, member4]
                      .filter(Boolean)
                      .map((operator: any) => (
                        <div
                          key={operator.slug}
                          className="relative h-11 w-11 overflow-hidden rounded-md border border-white/20 bg-black"
                        >
                          <Image
                            src={getOperatorImage(operator)}
                            alt={operator.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                ) : null}

                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                  <h3 className="line-clamp-1 text-lg font-black text-white drop-shadow">
                    {mainOperator?.name ?? "메인 오퍼레이터"}
                  </h3>

                  <p className="text-xs font-bold text-zinc-300 drop-shadow">
                    임시 작성자
                  </p>
                </div>
              </div>

              <div className="flex min-h-[124px] flex-col border-t border-yellow-500/10 bg-black px-4 py-3">
                <h3 className="line-clamp-2 text-sm font-black leading-5 text-yellow-300">
                  {draft.title || "오퍼레이터 세팅 제목"}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-300">
                  {draft.description || "세팅 설명이 여기에 표시됩니다."}
                </p>

                <div className="mt-auto flex gap-3 border-t border-white/10 pt-2 text-xs text-zinc-500">
                  <span>조회 0</span>
                  <span>추천 0</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>

      {editingSlot ? (
        <SettingEditorModal
          key={`${editingSlot}-${editorKey}`}
          title={`${slotLabelMap[editingSlot]} 세팅`}
          partyForms={editingPartyForms}
          onApply={applySettingModal}
          onClose={() => setEditingSlot(null)}
        />
      ) : null}
    </main>
  );
}

function SettingEditorModal({
  title,
  partyForms,
  onApply,
  onClose,
}: {
  title: string;
  partyForms: any[];
  onApply: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[120] bg-black/80 px-4 py-5 backdrop-blur-sm">
      <div
        className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-[24px] bg-[#05070b]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-5 py-4"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[0.35em] text-[#ffdc70]">
              OPERATOR SETTING
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#ffdc70]">
              {title}
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onApply}
              className="rounded-xl bg-[#ffd24a] px-5 py-2 text-sm font-black text-black"
            >
              적용
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 hover:text-yellow-300"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              닫기
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <SettingEditor partyForms={partyForms} />
        </div>
      </div>
    </div>
  );
}

function OperatorSettingSlot({
  slot,
  operator,
  setting,
  primary = false,
  onOpenSetting,
  onClear,
}: {
  slot: SlotKey;
  operator?: any;
  setting: SavedSlotSetting | null;
  primary?: boolean;
  onOpenSetting: () => void;
  onClear: () => void;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-[18px] border bg-black",
        primary ? "border-yellow-400/30" : "border-white/10",
      ].join(" ")}
    >
      <div className="relative h-[260px] bg-black">
        {operator ? (
          <Image
            src={getOperatorFullImage(operator)}
            alt={operator.name}
            fill
            sizes="360px"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-black text-zinc-600">
            {slotLabelMap[slot]} 세팅 등록
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {operator && getOperatorElementIcon(operator) ? (
            <Image
              src={getOperatorElementIcon(operator)}
              alt="속성"
              width={28}
              height={28}
              className="object-contain"
            />
          ) : null}

          <span
            className={[
              "rounded-md border px-2 py-1 text-[10px] font-black backdrop-blur-sm",
              primary
                ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-200"
                : "border-white/20 bg-white/10 text-zinc-200",
            ].join(" ")}
          >
            {primary ? "Main" : "Member"}
          </span>
        </div>

        {operator ? (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-3">
            <h3 className="line-clamp-1 text-lg font-black text-white drop-shadow">
              {operator.name}
            </h3>

            <p className="line-clamp-1 text-xs font-bold text-zinc-300 drop-shadow">
              세팅 등록 완료
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-black px-3 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[#ffdc70]">
            {slotLabelMap[slot]}
          </p>

          <p className="truncate text-xs text-zinc-500">
            {operator?.name ?? "미등록"}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          {setting ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:border-yellow-400/40 hover:text-yellow-300"
            >
              해제
            </button>
          ) : null}

          <button
            type="button"
            onClick={onOpenSetting}
            className={[
              "rounded-lg px-3 py-1.5 text-xs font-black",
              setting
                ? "border border-white/10 text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
                : "bg-[#ffd24a] text-black",
            ].join(" ")}
          >
            세팅
          </button>
        </div>
      </div>
    </div>
  );
}
