"use client";

import { useEffect, useMemo, useState } from "react";

export type HomeBannerKind =
  | "operator"
  | "weapon"
  | "notice"
  | "event"
  | "news";

export type HomeBannerItem = {
  id: string;
  title: string;
  href: string;
  image: string;
  startAt?: string;
  endAt?: string;
  endLabel?: string;
  kind: HomeBannerKind;
};

const FALLBACK_NEWS_URL = "https://endfield.gryphline.com/ko-kr/news";

function format(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getDate(item: HomeBannerItem) {
  const start = format(item.startAt);
  const end = format(item.endAt);

  if (start && end) return `${start} ~ ${end}`;
  if (start && item.endLabel) return `${start} ~ ${item.endLabel}`;
  if (start) return start;
  if (item.endLabel) return item.endLabel;
  return "";
}

function getLabel(item: HomeBannerItem) {
  if (item.kind === "operator") return "PICK UP OPERATOR";
  if (item.kind === "weapon") return "PICK UP WEAPON";
  if (item.kind === "notice") return "NOTICE";
  if (item.kind === "news") return "NEWS";
  return "EVENT";
}

export default function HomeBannerHubPanel({
  items,
}: {
  items: HomeBannerItem[];
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!items.length) {
      setIdx(0);
      return;
    }

    if (idx >= items.length) {
      setIdx(0);
    }
  }, [idx, items.length]);

  useEffect(() => {
    if (items.length <= 1) return;

    const t = setInterval(() => {
      setIdx((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(t);
  }, [items.length]);

  const safeIndex = useMemo(() => {
    if (!items.length) return 0;
    return Math.min(idx, items.length - 1);
  }, [idx, items.length]);

  if (!items.length) {
    return (
      <div className="flex h-[360px] w-full items-center justify-center rounded-[24px] border border-yellow-500/15 bg-black text-sm text-zinc-500">
        표시할 배너가 없습니다.
      </div>
    );
  }

  const cur = items[safeIndex];

  if (!cur) {
    return (
      <div className="flex h-[360px] w-full items-center justify-center rounded-[24px] border border-yellow-500/15 bg-black text-sm text-zinc-500">
        표시할 배너가 없습니다.
      </div>
    );
  }

  const targetHref = cur.href?.trim() ? cur.href : FALLBACK_NEWS_URL;
  const linkLabel = cur.href?.trim() ? "바로 가기 →" : "공식 뉴스 보기 →";

  const movePrev = () => {
    setIdx((prev) => (prev - 1 + items.length) % items.length);
  };

  const moveNext = () => {
    setIdx((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[24px] border border-yellow-500/15 bg-black">
      <img
        src={cur.image}
        alt={cur.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading={safeIndex === 0 ? "eager" : "lazy"}
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.62)_35%,rgba(0,0,0,0.18)_70%,transparent_100%)]" />

      <button
        type="button"
        onClick={movePrev}
        className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500/25 bg-black/55 text-yellow-300 transition hover:bg-yellow-500/15 hover:text-white"
        aria-label="이전 배너"
      >
        ←
      </button>

      <button
        type="button"
        onClick={moveNext}
        className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-yellow-500/25 bg-black/55 text-yellow-300 transition hover:bg-yellow-500/15 hover:text-white"
        aria-label="다음 배너"
      >
        →
      </button>

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            {items.map((item, dotIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIdx(dotIndex)}
                className={`h-2.5 rounded-full transition ${
                  dotIndex === safeIndex
                    ? "w-8 bg-yellow-400"
                    : "w-2.5 bg-white/25 hover:bg-white/45"
                }`}
                aria-label={`${dotIndex + 1}번 배너 보기`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-[520px]">
          <p className="text-xs tracking-[0.25em] text-yellow-400/80">
            {getLabel(cur)}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">{cur.title}</h3>

          <p className="mt-1 text-sm text-zinc-300">{getDate(cur)}</p>

          <a
            href={targetHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-5 py-2 text-sm font-medium text-yellow-300 transition hover:bg-yellow-500/20"
          >
            {linkLabel}
          </a>
        </div>
      </div>
    </div>
  );
}