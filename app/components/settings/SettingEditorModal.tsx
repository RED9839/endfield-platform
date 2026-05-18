"use client";

import SettingEditor from "@/app/components/settings/SettingEditor";

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
    <div className="fixed inset-0 z-[120] bg-black/80 px-4 py-5 text-white backdrop-blur-sm">
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
              {subtitle}
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#ffdc70]">
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
              className="rounded-xl bg-[#ffd24a] px-5 py-2 text-sm font-black text-black transition hover:brightness-110"
            >
              적용
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-300"
              style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
            >
              닫기
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <SettingEditor />
        </div>
      </div>
    </div>
  );
}
