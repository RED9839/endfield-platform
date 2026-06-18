"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ===== Endfield SF 디자인 토큰 =====
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
      <main className="flex min-h-screen items-center justify-center bg-ef-bg text-ef-ink">
        <p className="font-mono text-sm font-bold text-ef-muted">
          프로필 불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-ef-ink sm:px-4 sm:py-10">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto mb-5 flex max-w-[520px] items-center gap-2">
        <span className="h-3 w-3" style={{ background: PRIMARY }} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Profile</span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">// 프로필 수정</span>
      </div>

      <div
        className="relative z-10 mx-auto max-w-[520px] overflow-hidden border border-ef-line bg-ef-card2 p-4 sm:p-6"
        style={CUT}
      >
        <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <h1 className="text-2xl font-black tracking-tight text-white">
                프로필 수정
              </h1>
            </div>

            <p className="mt-2 text-sm leading-6 text-ef-muted">
              사이트에서 표시되는 닉네임을 변경할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="border border-ef-line bg-ef-card px-4 py-2 text-xs font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT_SM}
          >
            홈으로
          </button>
        </div>

        <label className="mt-6 grid gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">닉네임</span>

          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임 입력"
            maxLength={12}
            className="w-full border border-ef-line bg-ef-card px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-ef-muted/70 focus:border-ef-accent/50"
            style={CUT_SM}
          />
        </label>

        <div className="mt-2 flex items-center justify-between font-mono text-xs font-bold">
          <span className="text-ef-muted">
            2~12자 / 현재 {nickname.length}자
          </span>

          <span className="text-ef-muted">
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
          className="mt-5 w-full px-5 py-3 text-sm font-black text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ ...CUT_SM, background: ACCENT }}
        >
          {saving ? "저장 중..." : "닉네임 변경하기"}
        </button>
      </div>
    </main>
  );
}
