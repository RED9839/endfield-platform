"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export type HomeSearchItem = {
  id: string;
  name: string;
  subName: string;
  image: string;
  href: string;
  category: "operator" | "weapon" | "gear";
};

const categoryLabels = {
  operator: "오퍼레이터",
  weapon: "무기",
  gear: "장비",
};

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, "");
}

export default function HomeSearchPanel({
  items,
}: {
  items: HomeSearchItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const keyword = normalize(query);
    if (!keyword) return [];

    return items
      .filter((item) => {
        return (
          normalize(item.name).includes(keyword) ||
          normalize(item.subName).includes(keyword)
        );
      })
      .slice(0, 6);
  }, [items, query]);

  const submit = () => {
    if (results[0]) {
      router.push(results[0].href);
      return;
    }
    router.push("/operators");
  };

  return (
    <div className="relative max-w-[620px]">
      <div className="flex h-14 items-center rounded-2xl border border-white/15 bg-black/70 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition focus-within:border-yellow-300/45">
        <Search className="ml-3 h-5 w-5 shrink-0 text-yellow-200/70" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder="오퍼레이터, 무기, 장비를 검색하세요"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-white outline-none placeholder:text-zinc-500"
          aria-label="통합 데이터 검색"
        />
        <button
          type="button"
          onClick={submit}
          className="h-full shrink-0 rounded-xl bg-[#ffd24a] px-4 text-xs font-black text-black transition hover:brightness-110 sm:px-5"
        >
          검색
        </button>
      </div>

      {focused && query.trim() ? (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-yellow-300/20 bg-[#07090d]/98 p-2 shadow-2xl backdrop-blur-xl">
          {results.length ? (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => router.push(item.href)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/6"
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black text-white">
                    {item.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-zinc-500">
                    {item.subName}
                  </span>
                </span>
                <span className="rounded-full border border-yellow-300/15 bg-yellow-300/7 px-2 py-1 text-[9px] font-black text-yellow-200/80">
                  {categoryLabels[item.category]}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-center text-xs font-bold text-zinc-500">
              일치하는 데이터가 없습니다.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
