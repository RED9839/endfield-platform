"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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

    setSaving(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: trimmed }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setError(data.message ?? "닉네임 저장에 실패했습니다.");
      setSaving(false);
      return;
    }

    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-[520px] rounded-2xl border border-yellow-500/15 bg-[#070a0f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h1 className="text-2xl font-black tracking-[-0.04em] text-[#ffdc70]">
          홈페이지 닉네임 설정
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          구글 이름은 공개되지 않습니다. 사이트에서는 아래 닉네임만
          작성자로 표시됩니다.
        </p>

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

        {error ? (
          <p className="mt-3 text-sm font-bold text-red-400">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={saveNickname}
          disabled={saving}
          className="mt-5 w-full rounded-lg bg-[#ffd24a] px-5 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "저장 중..." : "닉네임 저장하고 시작하기"}
        </button>
      </div>
    </main>
  );
}