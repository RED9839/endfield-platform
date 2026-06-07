"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (!res.ok || !data.ok) {
          setError(data.message ?? "프로필 정보를 불러오지 못했습니다.");
          setLoading(false);
          return;
        }

        const currentNickname = String(data.user?.nickname ?? "");

        setNickname(currentNickname);
        setOriginalNickname(currentNickname);
      } catch {
        setError("프로필 정보를 불러오지 못했습니다.");
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function saveNickname() {
    const trimmed = nickname.trim();

    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (trimmed.length < 2 || trimmed.length > 12) {
      setError("닉네임은 2~12자 사이로 입력해주세요.");
      return;
    }

    if (trimmed === originalNickname) {
      setError("변경된 내용이 없습니다.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: trimmed,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message ?? "닉네임 저장에 실패했습니다.");
        setSaving(false);
        return;
      }

      setOriginalNickname(trimmed);
      setSuccess("닉네임이 변경되었습니다.");
    } catch {
      setError("닉네임 저장 중 오류가 발생했습니다.");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-sm font-bold text-zinc-500">
          프로필 불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-3 py-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-white sm:px-4 sm:py-10">
      <div className="mx-auto max-w-[520px] rounded-2xl border border-yellow-500/15 bg-[#070a0f] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-[-0.04em] text-[#ffdc70]">
              프로필 수정
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              사이트에서 표시되는 닉네임을 변경할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg border border-white/10 bg-black px-4 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-[#ffdc70]"
          >
            홈으로
          </button>
        </div>

        <label className="mt-6 grid gap-2">
          <span className="text-xs font-bold text-zinc-500">닉네임</span>

          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            maxLength={12}
            className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-zinc-600 focus:border-yellow-400/50"
          />
        </label>

        <div className="mt-2 flex items-center justify-between text-xs font-bold">
          <span className="text-zinc-600">
            2~12자 / 현재 {nickname.length}자
          </span>

          <span className="text-zinc-600">
            기존 닉네임: {originalNickname || "-"}
          </span>
        </div>

        {error ? (
          <p className="mt-3 text-sm font-bold text-red-400">{error}</p>
        ) : null}

        {success ? (
          <p className="mt-3 text-sm font-bold text-green-400">
            {success}
          </p>
        ) : null}

        <button
          type="button"
          onClick={saveNickname}
          disabled={saving}
          className="mt-5 w-full rounded-lg bg-[#ffd24a] px-5 py-3 text-sm font-black text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "저장 중..." : "닉네임 변경하기"}
        </button>
      </div>
    </main>
  );
}
