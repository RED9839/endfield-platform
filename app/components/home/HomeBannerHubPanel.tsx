"use client";

import { useEffect, useMemo, useState } from "react";

export type HomeBannerKind =
  | "operator"
  | "weapon"
  | "notice"
  | "event"
  | "news"
  | "version";

export type HomeBannerItem = {
  id: string;
  title: string;
  href?: string;
  image: string;
  kind: HomeBannerKind;
  isExternalLinkEnabled?: boolean;
};

const YELLOW_BORDER = "border-yellow-500/15";
const PANEL_BG = "bg-[#05070b]";

function getLabel(kind: HomeBannerKind) {
  if (kind === "operator") return "특별 허가 헤드헌팅";
  if (kind === "weapon") return "무기 신청";
  if (kind === "event") return "이벤트";
  if (kind === "version") return "버전 업데이트 설명";
  if (kind === "news") return "뉴스";
  return "공지";
}

export default function HomeBannerHubPanel({
  items,
}: {
  items: HomeBannerItem[];
}) {
  const [idx, setIdx] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const safeIndex = useMemo(() => {
    if (!items.length) return 0;
    return Math.min(idx, items.length - 1);
  }, [idx, items.length]);

  const cur = items[safeIndex];

  useEffect(() => {
    if (!items.length) return;
    if (idx >= items.length) setIdx(0);
  }, [idx, items.length]);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    setImageFailed(false);
  }, [safeIndex]);

  const movePrev = () => {
    if (!items.length) return;
    setIdx((prev) => (prev - 1 + items.length) % items.length);
  };

  const moveNext = () => {
    if (!items.length) return;
    setIdx((prev) => (prev + 1) % items.length);
  };

  if (!cur) {
    return (
      <section
        className={`flex h-full min-h-[280px] items-center justify-center rounded-[24px] border ${YELLOW_BORDER} ${PANEL_BG} text-sm text-zinc-400`}
      >
        배너 없음
      </section>
    );
  }

  const canOpenLink =
    cur.isExternalLinkEnabled &&
    typeof cur.href === "string" &&
    cur.href.trim();

  const labelText = getLabel(cur.kind);

  return (
    <section className="grid h-full min-h-[280px] w-full grid-rows-[64px_minmax(0,1fr)] gap-3">
      <div
        className={`flex min-h-0 items-center justify-between rounded-[18px] border ${YELLOW_BORDER} ${PANEL_BG} px-5`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {canOpenLink ? (
            <a
              href={cur.href}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-base font-black text-yellow-300 transition hover:text-yellow-100"
            >
              {labelText}
            </a>
          ) : (
            <span className="shrink-0 text-base font-black text-yellow-300">
              {labelText}
            </span>
          )}

          <span className="h-5 w-px shrink-0 bg-yellow-400/35" />

          <h2 className="truncate text-base font-black text-yellow-300">
            {cur.title}
          </h2>
        </div>

        {items.length > 1 ? (
          <div className="flex shrink-0 items-center gap-3 text-sm font-black">
            <button
              type="button"
              onClick={movePrev}
              className="text-yellow-300 transition hover:text-yellow-100"
              aria-label="이전 배너"
            >
              &lt;
            </button>

            <span className="min-w-[64px] text-center text-zinc-400">
              <span className="text-yellow-300">{safeIndex + 1}</span>
              <span className="mx-1 text-zinc-600">/</span>
              <span>{items.length}</span>
            </span>

            <button
              type="button"
              onClick={moveNext}
              className="text-yellow-300 transition hover:text-yellow-100"
              aria-label="다음 배너"
            >
              &gt;
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 items-center justify-center">
        <div
          className={`relative h-full max-h-[210px] w-full overflow-hidden rounded-[20px] border ${YELLOW_BORDER} bg-black`}
        >
          {!imageFailed ? (
            <img
              src={cur.image}
              alt={cur.title}
              className="h-full w-full object-cover object-center"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black text-sm text-zinc-500">
              이미지를 불러오지 못했습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}