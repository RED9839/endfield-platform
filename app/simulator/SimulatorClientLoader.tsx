"use client";

import dynamic from "next/dynamic";

function SimulatorPageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#03060b] px-4 text-center text-sm font-semibold text-zinc-500">
      성장 시뮬레이션을 불러오는 중입니다...
    </main>
  );
}

const SimulatorPageClient = dynamic(() => import("./SimulatorPageClient"), {
  ssr: false,
  loading: SimulatorPageLoading,
});

export default function SimulatorClientLoader() {
  return <SimulatorPageClient />;
}
