import Link from "next/link";
import { Suspense } from "react";

import {
  DesktopAccountFallback,
  DesktopAccountPanel,
  MobileAccountFallback,
  MobileAccountPanel,
} from "@/app/components/home/HomeAccountPanels";

type NavigationItem = {
  label: string;
  shortLabel: string;
  href: string;
};

export function HomeSideNav({ items }: { items: NavigationItem[] }) {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-yellow-500/15 bg-black px-5 py-6 lg:flex">
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.35em] text-yellow-500/70">
          ENDFIELD
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-wide text-white">
          데이터 허브
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          오퍼레이터, 무기, 장비, 시뮬레이터와 설정 기능을 한곳에서 확인합니다.
        </p>

        <Suspense fallback={<DesktopAccountFallback />}>
          <DesktopAccountPanel />
        </Suspense>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-yellow-500/10 bg-[#05070b] px-4 py-3 text-sm tracking-wide text-zinc-300 transition hover:border-yellow-500/30 hover:bg-[#0b1018] hover:text-white"
          >
            <span className="flex items-center justify-between">
              {item.label}
              <span className="text-xs text-zinc-600 transition group-hover:text-yellow-400">
                &gt;
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function HomeMobileTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-yellow-500/15 bg-black/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.28em] text-yellow-400/75">
            ENDFIELD
          </p>
          <h1 className="truncate text-lg font-black text-white">데이터 허브</h1>
        </Link>

        <div className="shrink-0">
          <Suspense fallback={<MobileAccountFallback />}>
            <MobileAccountPanel />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
