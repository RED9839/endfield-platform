"use client";

import dynamic from "next/dynamic";

const SettingEditor = dynamic(
  () => import("@/app/components/settings/SettingEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center text-sm font-bold text-zinc-500">
        설정 에디터를 불러오는 중...
      </div>
    ),
  },
);

const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

type SettingEditorModalProps = {
  open: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onApply?: () => void;
};

export default function SettingEditorModal({
  open,
  title = "메인 오퍼레이터 세팅",
  subtitle = "MAIN OPERATOR SETTING",
  onClose,
  onApply,
}: SettingEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 text-white backdrop-blur-sm sm:px-4 sm:py-5">
      <div
        className="mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden bg-[#05070b] sm:rounded-[24px]"
        style={{ border: `1px solid ${YELLOW_BORDER}` }}
      >
        <div
          className="safe-top flex shrink-0 items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4"
          style={{ borderBottom: `1px solid ${YELLOW_BORDER_SOFT}` }}
        >
          <div>
            <p className="text-[9px] font-semibold tracking-[0.22em] text-[#ffdc70] sm:text-[11px] sm:tracking-[0.35em]">
              {subtitle}
            </p>
            <h2 className="mt-1 text-lg font-black text-[#ffdc70] sm:text-2xl">
              {title}
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onApply?.();
                onClose();
              }}
              className="min-h-11 rounded-xl bg-[#ffd24a] px-3 py-2 text-xs font-black text-black transition hover:brightness-110 sm:px-5 sm:text-sm"
            >
              적용
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-300 sm:px-4 sm:text-sm"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              닫기
            </button>
          </div>
        </div>

        <div className="safe-bottom min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5">
          <SettingEditor />
        </div>
      </div>
    </div>
  );
}
