"use client";

import Image from "next/image";
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
  if (kind === "version") return "버전 업데이트";
  if (kind === "news") return "뉴스";
  return "공지";
}

function getBannerKey(item: HomeBannerItem, index: number) {
  return `${item.id}-${index}-${item.kind}-${item.title}-${item.image}`;
}

function getItemsSignature(items: HomeBannerItem[]) {
  return items.map((item) => `${item.id}:${item.title}:${item.image}`).join("|");
}

export default function HomeBannerHubPanel({
  items,
}: {
  items: HomeBannerItem[];
}) {
  const [selection, setSelection] = useState({ signature: "", index: 0 });
  const [imageFailedKey, setImageFailedKey] = useState("");
  const [loadedKey, setLoadedKey] = useState("");

  const itemsSignature = useMemo(() => getItemsSignature(items), [items]);
  const idx =
    selection.signature === itemsSignature ? selection.index : 0;

  const safeIndex = useMemo(() => {
    if (!items.length) return 0;
    return Math.min(idx, items.length - 1);
  }, [idx, items.length]);

  const cur = items[safeIndex];
  const curKey = cur ? getBannerKey(cur, safeIndex) : "";
  const labelText = cur ? getLabel(cur.kind) : "";

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setSelection((prev) => {
        const currentIndex =
          prev.signature === itemsSignature ? prev.index : 0;
        return {
          signature: itemsSignature,
          index: (currentIndex + 1) % items.length,
        };
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [items.length, itemsSignature]);

  const movePrev = () => {
    if (!items.length) return;
    setSelection({
      signature: itemsSignature,
      index: (safeIndex - 1 + items.length) % items.length,
    });
  };

  const moveNext = () => {
    if (!items.length) return;
    setSelection({
      signature: itemsSignature,
      index: (safeIndex + 1) % items.length,
    });
  };

  if (!cur) {
    return (
      <section
        className={`flex h-full w-full items-center justify-center rounded-[24px] border ${YELLOW_BORDER} ${PANEL_BG} text-sm text-zinc-400`}
      >
        배너 없음
      </section>
    );
  }

  const href = cur.href?.trim() || "https://endfield.gryphline.com/ko-kr/news";
  const imageFailed = imageFailedKey === curKey;
  const isLoaded = loadedKey === curKey;

  return (
    <section className="grid h-full w-full grid-rows-[52px_minmax(0,1fr)] gap-2 overflow-hidden">
      <div
        className={`flex min-h-0 items-center justify-between overflow-hidden rounded-[18px] border ${YELLOW_BORDER} ${PANEL_BG} px-4`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
          <span
            title={labelText}
            className="max-w-[150px] shrink-0 truncate text-sm font-black text-yellow-300"
          >
            {labelText}
          </span>

          <span className="h-5 w-px shrink-0 bg-yellow-400/35" />

          <h2
            title={cur.title}
            className="min-w-0 flex-1 truncate text-sm font-black text-yellow-300"
          >
            {cur.title}
          </h2>
        </div>

        {items.length > 1 ? (
          <div className="ml-3 flex shrink-0 items-center gap-2 text-sm font-black">
            <button
              type="button"
              onClick={movePrev}
              className="text-yellow-300 transition hover:text-yellow-100"
              aria-label="이전 배너"
            >
              &lt;
            </button>

            <span className="min-w-[48px] text-center text-zinc-400">
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

      <div
        className={`relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-[20px] border ${YELLOW_BORDER} bg-black`}
      >
        {!imageFailed ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="block h-full w-full"
            title={cur.title}
          >
            {!isLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black text-sm text-zinc-500">
                배너 이미지를 불러오는 중입니다.
              </div>
            ) : null}

            <Image
              key={curKey}
              src={cur.image}
              alt={cur.title}
              fill
              quality={68}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className={`block h-full w-full object-cover object-center transition-opacity duration-200 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoadedKey(curKey)}
              onError={() => setImageFailedKey(curKey)}
            />
          </a>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black text-sm text-zinc-500">
            이미지를 불러오지 못했습니다.
          </div>
        )}
      </div>
    </section>
  );
}
