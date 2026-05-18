"use client";

import { useState } from "react";

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
      className={[
        "rounded-xl border px-4 py-2 text-sm font-black transition disabled:opacity-60",
        liked
          ? "border-yellow-300/50 bg-yellow-300/20 text-yellow-200 hover:bg-yellow-300/25"
          : "border-white/10 bg-black text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300",
      ].join(" ")}
    >
      추천 {likeCount.toLocaleString()}
    </button>
  );
}
