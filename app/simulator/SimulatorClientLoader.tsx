"use client";

import dynamic from "next/dynamic";

function SimulatorPageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ef-bg px-4 text-center text-sm font-semibold text-ef-muted">
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
