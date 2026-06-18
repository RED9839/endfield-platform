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

const ACCENT = "#ffd24a";
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

const categoryLabels = {
  operator: "오퍼레이터",
  weapon: "무기",
  gear: "장비",
};

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, "");
}

// 검색 인덱스(정적 JSON)를 검색 사용 시점에만 한 번 가져온다.
// 모듈 스코프 프라미스로 데스크톱/모바일 두 패널이 동일 요청을 공유한다.
let searchIndexPromise: Promise<HomeSearchItem[]> | null = null;

function loadSearchIndex(): Promise<HomeSearchItem[]> {
  if (!searchIndexPromise) {
    searchIndexPromise = fetch("/api/search-index")
      .then((response) => (response.ok ? response.json() : []))
      .catch(() => []);
  }

  return searchIndexPromise;
}

export default function HomeSearchPanel({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [items, setItems] = useState<HomeSearchItem[]>([]);

  // 검색창에 처음 진입할 때 인덱스를 지연 로딩한다.
  const ensureIndexLoaded = () => {
    if (items.length === 0) {
      loadSearchIndex().then(setItems);
    }
  };

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
    <div className={compact ? "relative w-full" : "relative max-w-[620px]"}>
      <div
        className={[
          "flex items-center border border-ef-line bg-ef-card backdrop-blur-xl transition focus-within:border-ef-accent/50",
          compact ? "h-10 p-1" : "h-14 p-1.5",
        ].join(" ")}
        style={CUT_SM}
      >
        <Search
          className={[
            "shrink-0 text-ef-accent",
            compact ? "ml-2.5 h-4 w-4" : "ml-3 h-5 w-5",
          ].join(" ")}
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setFocused(true);
            ensureIndexLoaded();
          }}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder="오퍼레이터, 무기, 장비를 검색하세요"
          className={[
            "min-w-0 flex-1 bg-transparent font-bold text-white outline-none placeholder:text-ef-muted/70",
            compact ? "px-2.5 text-xs" : "px-3 text-sm",
          ].join(" ")}
          aria-label="통합 데이터 검색"
        />
        <button
          type="button"
          onClick={submit}
          className={[
            "h-full shrink-0 font-black text-black transition hover:brightness-110",
            compact ? "px-3 text-[11px]" : "px-4 text-xs sm:px-5",
          ].join(" ")}
          style={{ ...CUT_SM, background: ACCENT }}
        >
          검색
        </button>
      </div>

      {focused && query.trim() ? (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden border border-ef-line bg-ef-card2/98 p-2 backdrop-blur-xl" style={CUT_SM}>
          {results.length ? (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => router.push(item.href)}
                className="flex w-full items-center gap-3 p-2 text-left transition hover:bg-white/[0.04]"
                style={CUT_SM}
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden border border-ef-line bg-black" style={CUT_SM}>
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
                  <span className="mt-0.5 block truncate text-[11px] text-ef-muted">
                    {item.subName}
                  </span>
                </span>
                <span className="border border-ef-line bg-ef-card px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-ef-accent-soft" style={CUT_SM}>
                  {categoryLabels[item.category]}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-4 text-center text-xs font-bold text-ef-muted">
              일치하는 데이터가 없습니다.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
