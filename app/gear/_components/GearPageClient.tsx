"use client";

import Link from "next/link";

export default function GearPageClient() {
  return (
    <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1840px]">
        <header className="mb-3 rounded-[20px] border border-yellow-500/15 bg-[#05070b] p-4 shadow-[0_0_30px_rgba(250,204,21,0.04)] sm:mb-5 sm:rounded-[24px] sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-[#ffdc70] sm:text-[11px] sm:tracking-[0.35em]">
                엔드필드 지원 플랫폼
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#ffdc70] sm:text-4xl">
                장비
              </h1>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                장비 목록을 불러오는 중입니다.
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 rounded-xl border border-yellow-500/10 bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] hover:text-yellow-300 sm:px-4 sm:text-sm"
            >
              홈으로
            </Link>
          </div>
        </header>

        <section className="flex min-h-[260px] items-center justify-center rounded-[20px] border border-yellow-500/10 bg-[#05070b] p-6 text-center text-sm text-zinc-500 lg:rounded-[24px]">
          장비 목록 컴포넌트를 준비 중입니다.
        </section>
      </div>
    </main>
  );
}
