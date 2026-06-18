"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function DeleteOperatorSettingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    if (deleting) return;

    const id = params?.id;

    if (!id) {
      setMessage("삭제할 세팅 ID가 없습니다.");
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/operator-settings/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setMessage(data?.message ?? "세팅 삭제에 실패했습니다.");
        return;
      }

      router.replace("/settings");
      router.refresh();
    } catch {
      setMessage("세팅 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ef-bg px-4 text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <section
        className="relative z-10 w-full max-w-[440px] overflow-hidden border border-ef-line bg-ef-card2 p-6"
        style={CUT}
      >
        <span
          className="absolute inset-x-0 top-0 block h-0.5 w-full"
          style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }}
        />
        <div className="flex items-center gap-2">
          <span className="h-4 w-1" style={{ background: PRIMARY }} />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ef-muted">
            Operator Setting
          </p>
        </div>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">세팅 삭제</h1>
        <p className="mt-4 text-sm leading-6 text-ef-muted">
          이 오퍼레이터 세팅을 삭제하시겠습니까? 삭제한 세팅은 복구할 수 없습니다.
        </p>

        {message ? (
          <p
            className="mt-4 border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200"
            style={CUT_SM}
          >
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Link
            href="/settings"
            className="border border-ef-line bg-ef-card px-4 py-2 text-sm font-bold text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT_SM}
          >
            취소
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="border border-red-400/40 bg-red-500/20 px-4 py-2 text-sm font-black text-red-100 transition hover:bg-red-500/30 disabled:cursor-wait disabled:opacity-60"
            style={CUT_SM}
          >
            {deleting ? "삭제 중..." : "삭제하기"}
          </button>
        </div>
      </section>
    </main>
  );
}
