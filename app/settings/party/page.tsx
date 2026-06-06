"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

const OPERATOR_SETTING_DRAFT_KEY = "endfield-operator-setting-draft-v2";
const SOLO_EDITOR_STORAGE_KEY = "endfield-operator-setting-form-v1";
const EDITING_SETTING_ID_KEY = "endfield-operator-setting-editing-id-v1";

const SettingEditor = dynamic(
  () => import("@/app/components/settings/SettingEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center rounded-[20px] border border-yellow-500/10 bg-black/30 text-sm font-bold text-zinc-500">
        설정 에디터를 불러오는 중...
      </div>
    ),
  },
);

type SlotKey = "main" | "member1" | "member2" | "member3";
type SettingType = "solo" | "party";

type SavedSlotSetting = {
  operatorSlug: string;
  form: any;
};

type OperatorSettingDraft = {
  title: string;
  description: string;
  cycle: any[];
  slots: Record<SlotKey, SavedSlotSetting | null>;
};

type CycleSkillItem = {
  key: string;
  variant?: "normal" | "charged" | "plunge" | "default";
  label: string;
  skill: any;
};

type OperatorSummary = {
  slug: string;
  name: string;
  avatar?: string;
  image?: string;
  element?: string;
  elementKey?: string;
  attribute?: string;
  skills?: Record<
    string,
    { name?: string; icon?: string; artsEffects?: unknown[] } | null
  >;
};

type WeaponSummary = {
  slug: string;
  name: string;
  image?: string;
  avatar?: string;
};

const defaultDraft: OperatorSettingDraft = {
  title: "",
  description: "",
  cycle: [],
  slots: {
    main: null,
    member1: null,
    member2: null,
    member3: null,
  },
};

const slotLabelMap: Record<SlotKey, string> = {
  main: "메인 오퍼레이터",
  member1: "파티원 1",
  member2: "파티원 2",
  member3: "파티원 3",
};

const slotBadgeLabelMap: Record<SlotKey, string> = {
  main: "메인",
  member1: "파티원",
  member2: "파티원",
  member3: "파티원",
};

const settingTypeLabelMap: Record<SettingType, string> = {
  solo: "단일",
  party: "파티",
};

function normalizeSlot(slot: any): SavedSlotSetting | null {
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

function normalizeDraft(value: any): OperatorSettingDraft {
  return {
    title: String(value?.title ?? ""),
    description: String(value?.description ?? ""),
    cycle: Array.isArray(value?.cycle) ? value.cycle : [],
    slots: {
      main: normalizeSlot(value?.slots?.main),
      member1: normalizeSlot(value?.slots?.member1 ?? value?.slots?.member2),
      member2: normalizeSlot(value?.slots?.member2 ?? value?.slots?.member3),
      member3: normalizeSlot(value?.slots?.member3 ?? value?.slots?.member4),
    },
  };
}

function loadDraft(): OperatorSettingDraft {
  if (typeof window === "undefined") return defaultDraft;

  try {
    const saved = window.localStorage.getItem(OPERATOR_SETTING_DRAFT_KEY);
    if (!saved) return defaultDraft;
    return normalizeDraft(JSON.parse(saved));
  } catch {
    return defaultDraft;
  }
}

function clearCreateDraftIfFromEdit(currentEditId: string) {
  if (typeof window === "undefined") return;

  const previousEditId = window.localStorage.getItem(EDITING_SETTING_ID_KEY);

  if (!currentEditId && previousEditId) {
    window.localStorage.removeItem(OPERATOR_SETTING_DRAFT_KEY);
    window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
    window.localStorage.removeItem(EDITING_SETTING_ID_KEY);
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

function clearAllStoredDraft() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(OPERATOR_SETTING_DRAFT_KEY);
  window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
  window.localStorage.removeItem(EDITING_SETTING_ID_KEY);
}

function getOperatorImage(operator: any) {
  return (
    operator?.avatar ??
    operator?.image ??
    `/operators/${operator?.slug}/avatar.webp`
  );
}

function getOperatorElementIcon(operator: any) {
  const element = operator?.element ?? operator?.elementKey ?? operator?.attribute;
  return element ? `/icons/elements/${element}.webp` : "";
}

function getWeaponImage(weapon: any) {
  return weapon?.image ?? weapon?.avatar ?? `/weapons/${weapon?.slug}/avatar.webp`;
}

function getEditIdFromUrl() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("edit") ?? "";
}

export default function OperatorSettingRegisterPage() {
  const [draft, setDraft] = useState<OperatorSettingDraft>(defaultDraft);
  const [hydrated, setHydrated] = useState(false);
  const [editingSlot, setEditingSlot] = useState<SlotKey | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [mobileModal, setMobileModal] = useState<"cycle" | "preview" | null>(null);
  const [operatorSummaries, setOperatorSummaries] = useState<OperatorSummary[]>([]);
  const [weaponSummaries, setWeaponSummaries] = useState<WeaponSummary[]>([]);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const targetEditId = getEditIdFromUrl();

      clearCreateDraftIfFromEdit(targetEditId);

      if (!targetEditId) {
        setEditId("");
        setDraft(loadDraft());
        setHydrated(true);
        return;
      }

      setEditId(targetEditId);
      setLoadingEdit(true);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(EDITING_SETTING_ID_KEY, targetEditId);
        window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
      }

      try {
        const response = await fetch(`/api/operator-settings/${targetEditId}`, {
          cache: "no-store",
        });
        const data = await response.json().catch(() => null);

        if (!mounted) return;

        if (!response.ok || !data?.ok || !data?.setting) {
          alert(data?.message ?? "수정할 세팅을 불러오지 못했습니다.");
          setDraft(defaultDraft);
          return;
        }

        if (!data?.isOwner) {
          alert("본인이 저장한 세팅만 수정할 수 있습니다.");
          window.location.href = `/settings/${targetEditId}`;
          return;
        }

        setDraft(normalizeDraft(data.setting));
      } catch {
        if (mounted) alert("수정할 세팅을 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (mounted) {
          setLoadingEdit(false);
          setHydrated(true);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSettingSummaries() {
      try {
        const response = await fetch("/api/settings/summary", {
          cache: "force-cache",
        });
        const data = await response.json().catch(() => null);

        if (!mounted || !data?.ok) return;

        setOperatorSummaries(Array.isArray(data.operators) ? data.operators : []);
        setWeaponSummaries(Array.isArray(data.weapons) ? data.weapons : []);
      } catch {
        if (!mounted) return;
        setOperatorSummaries([]);
        setWeaponSummaries([]);
      }
    }

    loadSettingSummaries();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadUserNickname() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const data = await response.json().catch(() => null);

        const nickname = String(
          data?.profile?.nickname ??
            data?.user?.nickname ??
            "",
        ).trim();

        if (mounted) {
          setUserNickname(nickname);
        }
      } catch {
        if (mounted) {
          setUserNickname("");
        }
      }
    }

    loadUserNickname();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (editId) return;

    window.localStorage.setItem(OPERATOR_SETTING_DRAFT_KEY, JSON.stringify(draft));
  }, [draft, hydrated, editId]);

  const operatorsBySlug = useMemo(() => {
    return new Map(operatorSummaries.map((operator) => [operator.slug, operator]));
  }, [operatorSummaries]);

  const weaponsBySlug = useMemo(() => {
    return new Map(weaponSummaries.map((weapon) => [weapon.slug, weapon]));
  }, [weaponSummaries]);

  const mainOperator = operatorsBySlug.get(draft.slots.main?.operatorSlug ?? "");
  const member1 = operatorsBySlug.get(draft.slots.member1?.operatorSlug ?? "");
  const member2 = operatorsBySlug.get(draft.slots.member2?.operatorSlug ?? "");
  const member3 = operatorsBySlug.get(draft.slots.member3?.operatorSlug ?? "");

  const mainWeapon = weaponsBySlug.get(draft.slots.main?.form?.weaponSlug ?? "") ?? null;
  const member1Weapon =
    weaponsBySlug.get(draft.slots.member1?.form?.weaponSlug ?? "") ?? null;
  const member2Weapon =
    weaponsBySlug.get(draft.slots.member2?.form?.weaponSlug ?? "") ?? null;
  const member3Weapon =
    weaponsBySlug.get(draft.slots.member3?.form?.weaponSlug ?? "") ?? null;

  const filledSlots = [
    draft.slots.main,
    draft.slots.member1,
    draft.slots.member2,
    draft.slots.member3,
  ].filter((slot) => Boolean(slot?.operatorSlug));

  const settingType: SettingType = filledSlots.length >= 2 ? "party" : "solo";
  const hasMainSetting = Boolean(draft.slots.main?.operatorSlug);

  const editingPartyForms = useMemo(() => {
    if (!editingSlot) return [];

    return (Object.entries(draft.slots) as [SlotKey, SavedSlotSetting | null][])
      .filter(([slot, setting]) => slot !== editingSlot && Boolean(setting?.form))
      .map(([, setting]) => setting!.form);
  }, [draft.slots, editingSlot]);

  function openSettingModal(slot: SlotKey) {
    if (slot !== "main" && !hasMainSetting) {
      alert("메인 오퍼레이터를 먼저 등록해주세요.");
      return;
    }

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

    const duplicatedSlot = (
      Object.entries(draft.slots) as [SlotKey, SavedSlotSetting | null][]
    ).find(
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

    window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
    setEditingSlot(null);
  }

  function clearSlot(slot: SlotKey) {
    setDraft((prev) => {
      if (slot === "main") return defaultDraft;

      return {
        ...prev,
        slots: {
          ...prev.slots,
          [slot]: null,
        },
      };
    });
  }

  function resetDraft() {
    setDraft(defaultDraft);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(OPERATOR_SETTING_DRAFT_KEY);
      window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);

      if (editId) {
        window.localStorage.setItem(EDITING_SETTING_ID_KEY, editId);
      } else {
        window.localStorage.removeItem(EDITING_SETTING_ID_KEY);
      }
    }
  }

  async function saveOperatorSetting() {
    if (saving) return;

    if (!draft.title.trim()) {
      alert("세팅 제목을 입력해주세요.");
      return;
    }

    if (!draft.slots.main?.operatorSlug) {
      alert("메인 오퍼레이터를 먼저 등록해주세요.");
      return;
    }

    setSaving(true);

    try {
      const isEditMode = Boolean(editId);

      const response = await fetch(
        isEditMode ? `/api/operator-settings/${editId}` : "/api/operator-settings",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: draft.title,
            description: draft.description,
            cycle: draft.cycle,
            slots: draft.slots,
            nickname: userNickname,
            userNickname,
            authorNickname: userNickname,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        alert(data?.message ?? "오퍼레이터 세팅 저장에 실패했습니다.");
        return;
      }

      alert(
        isEditMode
          ? "세팅을 수정했습니다."
          : settingType === "solo"
            ? "단일 세팅으로 저장했습니다."
            : "파티 세팅으로 저장했습니다.",
      );

      clearAllStoredDraft();
      setDraft(defaultDraft);
      window.location.href = `/settings/${data?.setting?.id ?? editId}`;
    } catch {
      alert("오퍼레이터 세팅 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated || loadingEdit) {
    return (
      <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
        <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-zinc-500">
          오퍼레이터 세팅 불러오는 중...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-3 rounded-[20px] bg-[#05070b] p-4 shadow-[0_0_30px_rgba(250,204,21,0.04)] sm:mb-5 sm:rounded-[24px] sm:p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold tracking-[0.28em] sm:text-[11px] sm:tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                엔드필드 지원 플랫폼
              </p>

              <h1
                className="mt-2 text-2xl font-black tracking-tight sm:text-4xl"
                style={{ color: YELLOW_TEXT }}
              >
                {editId ? "오퍼레이터 세팅 수정" : "오퍼레이터 세팅 등록"}
              </h1>

              <p className="mt-1 line-clamp-2 text-xs text-zinc-500 sm:text-sm">
                메인 세팅만 등록하면 단일 세팅, 파티원 세팅까지 등록하면 파티 세팅으로 저장됩니다.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={resetDraft}
                className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                초기화
              </button>

              <button
                type="button"
                onClick={saveOperatorSetting}
                disabled={saving}
                className="rounded-xl px-3 py-2 text-xs font-black text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60 sm:px-5 sm:text-sm"
                style={{ background: YELLOW_MAIN }}
              >
                {saving ? "저장 중" : editId ? "저장" : "저장"}
              </button>

              <Link
                href={editId ? `/settings/${editId}` : "/settings"}
                className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
                onClick={() => {
                  if (typeof window !== "undefined" && editId) {
                    window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
                    window.localStorage.setItem(EDITING_SETTING_ID_KEY, editId);
                  }
                }}
              >
                목록
              </Link>
            </div>
          </div>
        </header>

        <nav className="sticky top-2 z-40 mb-3 rounded-[18px] border border-yellow-500/15 bg-black/90 p-2 backdrop-blur lg:hidden">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <a
              href="#basic"
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              기본 정보
            </a>

            <button
              type="button"
              onClick={() => setMobileModal("cycle")}
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              사이클 등록
            </button>

            <a
              href="#slots"
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              세팅 구성
            </a>

            <button
              type="button"
              onClick={() => setMobileModal("preview")}
              className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200"
            >
              저장 미리보기
            </button>
          </div>
        </nav>

        <section
          id="basic"
          className="mb-3 scroll-mt-24 rounded-[20px] bg-[#05070b] p-4 sm:mb-5 sm:rounded-[24px] sm:p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="grid gap-3 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-4">
            <label className="grid gap-2">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#ffdc70] sm:text-xs">
                제목
              </span>
              <input
                value={draft.title}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="오퍼레이터 세팅 제목"
                className="h-10 rounded-xl border border-white/10 bg-black px-4 text-xs font-bold text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400/40 sm:h-11 sm:text-sm"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] font-black tracking-[0.2em] text-[#ffdc70] sm:text-xs">
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
                className="h-10 rounded-xl border border-white/10 bg-black px-4 text-xs font-bold text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400/40 sm:h-11 sm:text-sm"
              />
            </label>
          </div>
        </section>

        <div className="hidden lg:block">
          <CycleRegisterPanel
            draft={draft}
            setDraft={setDraft}
            operatorsBySlug={operatorsBySlug}
            embedded
          />
        </div>

        <section className="grid gap-3 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div
            id="slots"
            className="scroll-mt-24 rounded-[20px] bg-[#05070b] p-4 sm:rounded-[24px] sm:p-5"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div className="mb-3 grid gap-1 sm:mb-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-lg font-black text-[#ffdc70] sm:text-xl">
                세팅 구성
              </h2>
              <p className="text-xs font-bold text-zinc-500">
                메인 오퍼레이터 등록 후 파티원 세팅을 추가할 수 있습니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <OperatorSettingSlot
                slot="main"
                operator={mainOperator}
                weapon={mainWeapon}
                setting={draft.slots.main}
                primary
                onOpenSetting={() => openSettingModal("main")}
                onClear={() => clearSlot("main")}
              />

              <OperatorSettingSlot
                slot="member1"
                operator={member1}
                weapon={member1Weapon}
                setting={draft.slots.member1}
                disabled={!hasMainSetting}
                onOpenSetting={() => openSettingModal("member1")}
                onClear={() => clearSlot("member1")}
              />

              <OperatorSettingSlot
                slot="member2"
                operator={member2}
                weapon={member2Weapon}
                setting={draft.slots.member2}
                disabled={!hasMainSetting}
                onOpenSetting={() => openSettingModal("member2")}
                onClear={() => clearSlot("member2")}
              />

              <OperatorSettingSlot
                slot="member3"
                operator={member3}
                weapon={member3Weapon}
                setting={draft.slots.member3}
                disabled={!hasMainSetting}
                onOpenSetting={() => openSettingModal("member3")}
                onClear={() => clearSlot("member3")}
              />
            </div>
          </div>

          <aside
            id="preview"
            className="hidden h-fit scroll-mt-24 rounded-[20px] bg-[#05070b] p-4 sm:rounded-[24px] sm:p-5 xl:sticky xl:top-5 lg:block"
            style={{ border: `1px solid ${YELLOW_BORDER}` }}
          >
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="text-lg font-black text-[#ffdc70] sm:text-xl">
                저장 미리보기
              </h2>
            </div>

            <PreviewCard
              mainOperator={mainOperator}
              mainWeapon={mainWeapon}
              memberOperators={[member1, member2, member3].filter(Boolean)}
              draft={draft}
              settingType={settingType}
              userNickname={userNickname}
            />
          </aside>
        </section>
      </div>

      {mobileModal === "cycle" ? (
        <MobilePanelModal title="사이클 등록" onClose={() => setMobileModal(null)}>
          <CycleRegisterPanel
            draft={draft}
            setDraft={setDraft}
            operatorsBySlug={operatorsBySlug}
            embedded
          />
        </MobilePanelModal>
      ) : null}

      {mobileModal === "preview" ? (
        <MobilePanelModal title="저장 미리보기" onClose={() => setMobileModal(null)}>
          <PreviewCard
            mainOperator={mainOperator}
            mainWeapon={mainWeapon}
            memberOperators={[member1, member2, member3].filter(Boolean)}
            draft={draft}
            settingType={settingType}
            userNickname={userNickname}
          />
        </MobilePanelModal>
      ) : null}

      {editingSlot ? (
        <SettingEditorModal
          key={`${editingSlot}-${editorKey}`}
          title={`${slotLabelMap[editingSlot]} 세팅`}
          partyForms={editingPartyForms}
          onApply={applySettingModal}
          onClose={() => {
            window.localStorage.removeItem(SOLO_EDITOR_STORAGE_KEY);
            setEditingSlot(null);
          }}
        />
      ) : null}
    </main>
  );
}

function MobilePanelModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const compact = title.includes("미리보기");
  const cycle = title.includes("사이클");

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 p-3 backdrop-blur-sm lg:hidden">
      <div
        className={[
          "mx-auto flex flex-col overflow-hidden rounded-[22px] bg-[#05070b]",
          compact
            ? "h-auto max-h-[82vh] max-w-[320px]"
            : cycle
              ? "h-auto max-h-[88vh] max-w-[720px]"
              : "h-full max-w-[720px]",
        ].join(" ")}
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-4 py-3"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <h2 className="truncate text-xl font-black text-[#ffdc70]">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 hover:text-yellow-300"
            style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
          >
            닫기
          </button>
        </div>

        <div className={["min-h-0 flex-1 overflow-y-auto", compact ? "p-2" : cycle ? "p-3" : "p-3"].join(" ")}>
          {children}
        </div>
      </div>
    </div>
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
    <div className="fixed inset-0 z-[120] bg-black/80 p-0 backdrop-blur-sm sm:p-4">
      <div
        className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden rounded-none bg-[#05070b] sm:rounded-[24px]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#ffdc70] sm:text-[11px] sm:tracking-[0.35em]">
              오퍼레이터 세팅
            </p>
            <h2 className="mt-1 truncate text-xl font-black text-[#ffdc70] sm:text-2xl">
              {title}
            </h2>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onApply}
              className="rounded-xl bg-[#ffd24a] px-4 py-2 text-xs font-black text-black sm:px-5 sm:text-sm"
            >
              적용
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 hover:text-yellow-300 sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              닫기
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 sm:px-5 sm:py-5">
          <SettingEditor partyForms={partyForms} />
        </div>
      </div>
    </div>
  );
}

function CycleRegisterPanel({
  draft,
  setDraft,
  operatorsBySlug,
  embedded = false,
}: {
  draft: OperatorSettingDraft;
  setDraft: Dispatch<SetStateAction<OperatorSettingDraft>>;
  operatorsBySlug: Map<string, any>;
  embedded?: boolean;
}) {
  const slots = (Object.entries(draft.slots) as [SlotKey, SavedSlotSetting | null][])
    .map(([slotKey, slot]) => {
      if (!slot?.operatorSlug) return null;

      const operator = operatorsBySlug.get(slot.operatorSlug);
      if (!operator) return null;

      return {
        slotKey,
        operator,
        skills: [
          {
            key: "normalAttack",
            variant: "normal",
            label: "평타",
            skill: operator.skills?.normalAttack,
          },
          {
            key: "normalAttack",
            variant: "charged",
            label: "강공",
            skill: operator.skills?.normalAttack,
          },
          {
            key: "normalAttack",
            variant: "plunge",
            label: "낙공",
            skill: operator.skills?.normalAttack,
          },
          {
            key: "battleSkill",
            variant: "default",
            label: "배틀",
            skill: operator.skills?.battleSkill,
          },
          {
            key: "comboSkill",
            variant: "default",
            label: "연계",
            skill: operator.skills?.comboSkill,
          },
          {
            key: "ultimate",
            variant: "default",
            label: "궁극기",
            skill: operator.skills?.ultimate,
          },
        ].filter((item) => item.skill?.icon),
      };
    })
    .filter(Boolean) as {
    slotKey: SlotKey;
    operator: any;
    skills: CycleSkillItem[];
  }[];

  function addCycleStep(operator: any, item: CycleSkillItem) {
    const element =
      operator.element ?? operator.elementKey ?? operator.attribute ?? "physical";
    const variantSuffix =
      item.variant && item.variant !== "normal" ? `-${item.variant}` : "";

    setDraft((prev) => ({
      ...prev,
      cycle: [
        ...(prev.cycle ?? []),
        {
          id: `${operator.slug}-${item.key}${variantSuffix}-${Date.now()}`,
          operatorSlug: operator.slug,
          operatorName: operator.name,
          operatorIcon: getOperatorImage(operator),
          element,
          skillKey: item.key,
          skillVariant: item.variant ?? "normal",
          skillName: item.skill?.name ?? item.label,
          skillLabel: item.label,
          skillIcon: item.skill?.icon,
          artsEffects: item.skill?.artsEffects ?? [],
        },
      ],
    }));
  }

  function removeCycleStep(index: number) {
    setDraft((prev) => ({
      ...prev,
      cycle: (prev.cycle ?? []).filter((_, i) => i !== index),
    }));
  }

  return (
    <section
      id="cycle"
      className={[
        "scroll-mt-24 rounded-[20px] bg-[#05070b]",
        embedded ? "mb-0 p-0" : "mb-3 p-4 sm:mb-5 sm:rounded-[24px] sm:p-5",
      ].join(" ")}
      style={embedded ? undefined : { border: `1px solid ${YELLOW_BORDER}` }}
    >
      <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
        {embedded ? (
          <p className="min-w-0 text-xs font-bold text-zinc-500">
            등록한 오퍼레이터 스킬 아이콘을 눌러 운용 순서를 만드세요.
          </p>
        ) : (
          <div className="min-w-0">
            <h2 className="text-lg font-black text-[#ffdc70] sm:text-xl">
              사이클 등록
            </h2>
            <p className="mt-1 text-xs font-bold text-zinc-500">
              등록한 오퍼레이터 스킬 아이콘을 눌러 운용 순서를 만드세요.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setDraft((prev) => ({ ...prev, cycle: [] }))}
          className="shrink-0 rounded-xl border border-white/10 bg-black px-3 py-2 text-xs font-black text-zinc-300 hover:text-yellow-300"
        >
          초기화
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {slots.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {slots.map((slot) => (
              <div
                key={slot.slotKey}
                className="rounded-2xl border border-white/10 bg-black/40 p-2.5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-black">
                    <Image
                      src={getOperatorImage(slot.operator)}
                      alt={slot.operator.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-black text-white">
                    {slot.operator.name}
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
                  {slot.skills.map((item) => (
                    <CycleSkillButton
                      key={`${slot.operator.slug}-${item.key}-${item.variant ?? "base"}`}
                      operator={slot.operator}
                      item={item}
                      onClick={() => addCycleStep(slot.operator, item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-sm font-bold text-zinc-500">
            먼저 메인 오퍼레이터 세팅을 등록하세요.
          </div>
        )}

        <div className="rounded-2xl border border-yellow-500/15 bg-black/45 p-3 sm:p-4">
          <p className="mb-3 text-sm font-black text-[#ffdc70]">사이클 순서</p>

          {draft.cycle?.length ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
              {draft.cycle.map((step: any, index: number) => (
                <div key={step.id ?? index} className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => removeCycleStep(index)} title="삭제">
                    <CycleStepIcon step={step} />
                  </button>

                  {index < draft.cycle.length - 1 ? (
                    <span className="text-sm font-black text-yellow-300">→</span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-zinc-600">
              아직 등록된 사이클이 없습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function CycleSkillButton({
  operator,
  item,
  onClick,
}: {
  operator: any;
  item: CycleSkillItem;
  onClick: () => void;
}) {
  const element =
    operator.element ?? operator.elementKey ?? operator.attribute ?? "physical";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-black transition hover:scale-105 sm:h-20 sm:w-20 ${getElementBorderClass(
        element,
      )}`}
      title={`${operator.name} - ${item.label}`}
    >
      <Image
        src={item.skill.icon}
        alt={item.skill.name ?? item.label}
        fill
        sizes="(min-width: 640px) 80px, 72px"
        className="object-contain p-2"
      />

      <span
        className={[
          "absolute left-1 top-1 z-20 rounded px-1 py-0.5 text-[9px] font-black leading-none shadow-[0_0_8px_rgba(0,0,0,0.75)] sm:text-[10px]",
          getElementLabelClass(element),
        ].join(" ")}
      >
        {item.label}
      </span>

      <span className="absolute bottom-1 right-1 z-20 h-6 w-6 overflow-hidden rounded-full border border-black bg-black sm:h-7 sm:w-7">
        <Image
          src={getOperatorImage(operator)}
          alt={operator.name}
          fill
          sizes="(min-width: 640px) 28px, 24px"
          className="object-cover"
        />
      </span>
    </button>
  );
}

function getCycleSkillLabel(step: any) {
  const skillVariant = String(step?.skillVariant ?? "");
  const skillKey = String(step?.skillKey ?? "");
  const fallbackLabel = String(step?.skillLabel ?? "");

  if (skillVariant === "charged") return "강공";
  if (skillVariant === "plunge") return "낙공";
  if (skillKey === "normalAttack") return fallbackLabel || "평타";
  if (skillKey === "battleSkill") return "배틀";
  if (skillKey === "comboSkill") return "연계";
  if (skillKey === "ultimate") return "궁극기";

  return fallbackLabel;
}

function getCycleSkillLabelClass(step: any) {
  return getElementLabelClass(step?.element);
}

function CycleStepIcon({ step }: { step: any }) {
  const skillLabel = getCycleSkillLabel(step);
  const labelClass = getCycleSkillLabelClass(step);

  return (
    <span
      className={`relative block h-[72px] w-[72px] overflow-hidden rounded-xl border-2 bg-black sm:h-20 sm:w-20 ${getElementBorderClass(
        step.element,
      )}`}
    >
      <Image
        src={step.skillIcon}
        alt={step.skillName ?? "스킬"}
        fill
        sizes="(min-width: 640px) 80px, 72px"
        className="object-contain p-2"
      />

      {skillLabel ? (
        <span
          className={[
            "absolute left-1 top-1 z-20 rounded px-1 py-0.5 text-[9px] font-black leading-none text-white shadow-[0_0_8px_rgba(0,0,0,0.75)] sm:text-[10px]",
            labelClass,
          ].join(" ")}
        >
          {skillLabel}
        </span>
      ) : null}

      <span className="absolute bottom-1 right-1 z-20 h-6 w-6 overflow-hidden rounded-full border border-black bg-black sm:h-7 sm:w-7">
        <Image
          src={step.operatorIcon}
          alt={step.operatorName ?? "오퍼레이터"}
          fill
          sizes="(min-width: 640px) 28px, 24px"
          className="object-cover"
        />
      </span>
    </span>
  );
}

function PreviewCard({
  mainOperator,
  mainWeapon,
  memberOperators,
  draft,
  settingType,
  userNickname,
}: {
  mainOperator: any;
  mainWeapon: any;
  memberOperators: any[];
  draft: OperatorSettingDraft;
  settingType: SettingType;
  userNickname: string;
}) {
  return (
    <div className="mx-auto w-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-black">
      <div className="relative aspect-[300/320] overflow-hidden bg-black">
        {mainOperator ? (
          <Image
            src={getOperatorImage(mainOperator)}
            alt={mainOperator.name}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-zinc-600">
            메인 오퍼레이터 세팅을 등록하세요
          </div>
        )}

        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

        <div className="absolute left-2 top-2 flex items-center gap-1">
          {mainOperator && getOperatorElementIcon(mainOperator) ? (
            <div className="flex h-8 w-8 items-center justify-center">
              <Image
                src={getOperatorElementIcon(mainOperator)}
                alt="속성"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
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
              {settingTypeLabelMap[settingType]}
            </span>
          ) : null}
        </div>

        {settingType === "party" ? (
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            {memberOperators.map((operator: any) => (
              <div
                key={operator.slug}
                className="relative h-10 w-10 overflow-hidden rounded-md border border-white/20 bg-black sm:h-12 sm:w-12"
              >
                <Image
                  src={getOperatorImage(operator)}
                  alt={operator.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />

                {getOperatorElementIcon(operator) ? (
                  <Image
                    src={getOperatorElementIcon(operator)}
                    alt=""
                    width={15}
                    height={15}
                    className="absolute bottom-0 right-0 rounded-sm bg-black/80"
                  />
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {mainWeapon ? (
          <div className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-black/50 backdrop-blur-sm sm:h-12 sm:w-12">
            <Image
              src={getWeaponImage(mainWeapon)}
              alt={mainWeapon.name ?? "무기"}
              width={42}
              height={42}
              className="object-contain"
            />
          </div>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
          <h3 className="line-clamp-1 text-[16px] font-black text-white drop-shadow sm:text-[17px]">
            {mainOperator?.name ?? "메인 오퍼레이터"}
          </h3>
        </div>
      </div>

      <div className="flex min-h-[108px] flex-col border-t border-yellow-500/10 bg-black px-3 pb-3 pt-3 sm:min-h-[120px] sm:px-4">
        <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-yellow-300 sm:text-[15px]">
          {draft.title || "오퍼레이터 세팅 제목"}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-zinc-300 sm:text-[11px]">
          {draft.description || "세팅 설명이 여기에 표시됩니다."}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-1 pt-3 text-[10px] font-black sm:text-[11px]">
          <span className="text-white">{userNickname || "닉네임 없음"}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#ffdc70]">추천 0</span>
          <span className="text-zinc-600">|</span>
          <span className="text-[#ffdc70]">조회수 0</span>
        </div>
      </div>
    </div>
  );
}

function OperatorSettingSlot({
  slot,
  operator,
  weapon,
  setting,
  primary = false,
  disabled = false,
  onOpenSetting,
  onClear,
}: {
  slot: SlotKey;
  operator?: any;
  weapon?: any;
  setting: SavedSlotSetting | null;
  primary?: boolean;
  disabled?: boolean;
  onOpenSetting: () => void;
  onClear: () => void;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-[16px] border bg-black sm:rounded-[18px]",
        primary ? "border-yellow-400/30" : "border-white/10",
        disabled ? "opacity-45" : "",
      ].join(" ")}
    >
      <div className="relative h-[142px] overflow-hidden bg-black sm:h-[170px]">
        {operator ? (
          <Image
            src={getOperatorImage(operator)}
            alt={operator.name}
            fill
            sizes="(max-width: 640px) 100vw, 420px"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3 text-center text-sm font-black text-zinc-600">
            {disabled ? "메인 오퍼레이터 먼저 등록" : `${slotLabelMap[slot]} 세팅 등록`}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute left-2 top-2 flex items-center gap-1">
          {operator && getOperatorElementIcon(operator) ? (
            <Image
              src={getOperatorElementIcon(operator)}
              alt="속성"
              width={26}
              height={26}
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
            {slotBadgeLabelMap[slot]}
          </span>
        </div>

        {weapon ? (
          <div className="absolute bottom-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-black/50 backdrop-blur-sm">
            <Image
              src={getWeaponImage(weapon)}
              alt={weapon.name ?? "무기"}
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
        ) : null}

        {operator ? (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-3">
            <h3 className="line-clamp-1 text-base font-black text-white drop-shadow sm:text-lg">
              {operator.name}
            </h3>
            <p className="line-clamp-1 text-xs font-bold text-zinc-300 drop-shadow">
              세팅 등록 완료
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-2 border-t border-white/10 bg-black px-3 py-3 sm:flex sm:items-center sm:justify-between">
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
              className="h-9 flex-1 rounded-lg border border-white/10 px-3 text-xs font-bold text-zinc-400 hover:border-yellow-400/40 hover:text-yellow-300 sm:flex-none"
            >
              해제
            </button>
          ) : null}

          <button
            type="button"
            onClick={onOpenSetting}
            disabled={disabled}
            className={[
              "h-9 flex-1 rounded-lg px-3 text-xs font-black disabled:cursor-not-allowed sm:flex-none",
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

function getElementLabelClass(element: any) {
  switch (String(element ?? "physical")) {
    case "heat":
      return "bg-red-500/95 text-white";
    case "electric":
      return "bg-yellow-300/95 text-black";
    case "cryo":
      return "bg-cyan-300/95 text-black";
    case "nature":
      return "bg-green-500/95 text-white";
    case "physical":
    default:
      return "bg-zinc-400/95 text-black";
  }
}

function getElementBorderClass(element: string) {
  switch (element) {
    case "heat":
      return "border-red-400/80";
    case "electric":
      return "border-yellow-300/80";
    case "cryo":
      return "border-cyan-300/80";
    case "nature":
      return "border-green-400/80";
    case "physical":
    default:
      return "border-zinc-300/70";
  }
}
