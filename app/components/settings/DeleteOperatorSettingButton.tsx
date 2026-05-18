"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
        className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-black text-red-200 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-60"
      >
        삭제
      </button>

      {open ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[420px] rounded-[24px] border border-yellow-400/15 bg-[#05070b] p-6 text-white shadow-2xl">
            <p className="text-[11px] font-semibold tracking-[0.35em] text-[#ffdc70]">
              OPERATOR SETTING
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#ffdc70]">세팅 삭제</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              이 오퍼레이터 세팅을 삭제하시겠습니까? 삭제한 세팅은 복구할 수 없습니다.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="rounded-xl border border-white/10 bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:text-yellow-300 disabled:cursor-wait disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm font-black text-red-100 transition hover:bg-red-500/30 disabled:cursor-wait disabled:opacity-60"
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
