"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <section className="relative z-10 w-full max-w-[440px] rounded-[24px] border border-yellow-400/15 bg-[#05070b] p-6 shadow-2xl">
        <p className="text-[11px] font-semibold tracking-[0.35em] text-[#ffdc70]">
          OPERATOR SETTING
        </p>
        <h1 className="mt-3 text-2xl font-black text-[#ffdc70]">세팅 삭제</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          이 오퍼레이터 세팅을 삭제하시겠습니까? 삭제한 세팅은 복구할 수 없습니다.
        </p>

        {message ? (
          <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200">
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <Link
            href="/settings"
            className="rounded-xl border border-white/10 bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:text-yellow-300"
          >
            취소
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm font-black text-red-100 transition hover:bg-red-500/30 disabled:cursor-wait disabled:opacity-60"
          >
            {deleting ? "삭제 중..." : "삭제하기"}
          </button>
        </div>
      </section>
    </main>
  );
}
