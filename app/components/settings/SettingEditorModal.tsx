"use client";

import dynamic from "next/dynamic";

const SettingEditor = dynamic(
  () => import("@/app/components/settings/SettingEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[520px] items-center justify-center text-sm font-bold text-ef-muted">
        설정 에디터를 불러오는 중...
      </div>
    ),
  },
);

const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

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
        className="relative mx-auto flex h-full max-w-[1760px] flex-col overflow-hidden border border-ef-line bg-ef-card2"
        style={CUT}
      >
        <span className="block h-0.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
        <div className="safe-top flex shrink-0 items-center justify-between gap-3 border-b border-ef-line px-3 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-4 w-1 shrink-0" style={{ background: PRIMARY }} />
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-ef-muted sm:text-[11px] sm:tracking-[0.35em]">
                {subtitle}
              </p>
              <h2 className="mt-1 text-lg font-black tracking-tight text-white sm:text-2xl">
                {title}
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => {
                onApply?.();
                onClose();
              }}
              className="min-h-11 px-3 py-2 text-xs font-black text-black transition hover:brightness-110 sm:px-5 sm:text-sm"
              style={{ ...CUT_SM, background: ACCENT }}
            >
              적용
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-11 border border-ef-line bg-ef-card px-3 py-2 text-xs font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft sm:px-4 sm:text-sm"
              style={CUT_SM}
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
