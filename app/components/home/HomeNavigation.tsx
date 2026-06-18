import Link from "next/link";
import { Suspense } from "react";

import { MobileAccountClient } from "@/app/components/home/HomeAccountClient";
import {
  DesktopAccountFallback,
  DesktopAccountPanel,
} from "@/app/components/home/HomeAccountPanels";

const PRIMARY = "#ff9a2f";
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

type NavigationItem = {
  label: string;
  shortLabel: string;
  href: string;
};

export function HomeSideNav({ items }: { items: NavigationItem[] }) {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-ef-line bg-ef-bg px-5 py-6 lg:flex">
      <div className="mb-8">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.35em] text-ef-muted">
          ENDFIELD
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">
          데이터 허브
        </h1>
        <p className="mt-2 text-sm leading-6 text-ef-muted">
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
            className="group border border-ef-line bg-ef-card2 px-4 py-3 text-sm tracking-wide text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
            style={CUT_SM}
          >
            <span className="flex items-center justify-between">
              {item.label}
              <span className="text-xs text-ef-muted transition group-hover:text-ef-accent">
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
    <header className="safe-top sticky top-0 z-40 border-b border-ef-line bg-ef-bg/95 px-3 py-2.5 backdrop-blur lg:hidden sm:px-4 sm:py-3">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="h-7 w-1 shrink-0" style={{ background: PRIMARY }} />
          <span className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ef-muted">
              ENDFIELD
            </p>
            <h1 className="truncate text-lg font-black text-white">데이터 허브</h1>
          </span>
        </Link>

        <div className="shrink-0">
          <MobileAccountClient />
        </div>
      </div>
    </header>
  );
}
