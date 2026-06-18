"use client";

import { useState } from "react";

const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

export default function OperatorSettingLikeButton({
  settingId,
  initialLiked = false,
  initialLikeCount = 0,
}: {
  settingId: string;
  initialLiked?: boolean;
  initialLikeCount?: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [pending, setPending] = useState(false);

  async function toggleLike() {
    if (pending) return;

    setPending(true);

    try {
      const response = await fetch(`/api/operator-settings/${settingId}/like`, {
        method: "POST",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        alert(data?.message ?? "추천 처리에 실패했습니다.");
        return;
      }

      setLiked(Boolean(data.liked));
      setLikeCount(Number(data.likeCount ?? 0));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={toggleLike}
      style={CUT_SM}
      className={[
        "border px-4 py-2 font-mono text-sm font-black uppercase tracking-wide transition disabled:opacity-60",
        liked
          ? "border-ef-accent bg-[rgba(255,210,74,0.2)] text-white"
          : "border-ef-line bg-ef-card text-ef-muted hover:border-ef-accent/40 hover:text-ef-accent-soft",
      ].join(" ")}
    >
      추천 {likeCount.toLocaleString()}
    </button>
  );
}
