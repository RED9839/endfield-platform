"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const PRIMARY = "#ff9a2f";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function DeleteOperatorSettingButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/operator-settings/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        alert(data?.message ?? "세팅 삭제에 실패했습니다.");
        return;
      }

      setOpen(false);
      router.replace("/settings");
      router.refresh();
    } catch {
      alert("세팅 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={deleting}
        style={CUT_SM}
        className="border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-black text-red-300 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-60"
      >
        삭제
      </button>

      {open ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-[420px] overflow-hidden border border-ef-line bg-ef-card2 p-6 text-white"
            style={CUT}
          >
            <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ef-muted">
              OPERATOR SETTING
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white">세팅 삭제</h2>
            <p className="mt-4 text-sm leading-6 text-ef-muted">
              이 오퍼레이터 세팅을 삭제하시겠습니까? 삭제한 세팅은 복구할 수 없습니다.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleting}
                style={CUT_SM}
                className="border border-ef-line bg-ef-card px-4 py-2 text-sm font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft disabled:cursor-wait disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={CUT_SM}
                className="border border-red-500/40 bg-red-500/20 px-4 py-2 text-sm font-black text-red-200 transition hover:bg-red-500/30 disabled:cursor-wait disabled:opacity-60"
              >
                {deleting ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
