import Link from "next/link";

import { MobileAccountClient } from "@/app/components/home/HomeAccountClient";
import { HomeMobileMenu } from "@/app/components/home/HomeMobileMenu";

const PRIMARY = "#ff9a2f";

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

        <div className="flex shrink-0 items-center gap-2">
          <MobileAccountClient />
          <HomeMobileMenu />
        </div>
      </div>
    </header>
  );
}
