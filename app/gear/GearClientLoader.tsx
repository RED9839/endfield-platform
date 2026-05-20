"use client";

import dynamic from "next/dynamic";

function GearPageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-center text-sm font-semibold text-zinc-500">
      장비 목록을 불러오는 중입니다...
    </main>
  );
}

const GearPageClient = dynamic(() => import("./_components/GearPageClient"), {
  ssr: false,
  loading: GearPageLoading,
});

export default function GearClientLoader() {
  return <GearPageClient />;
}
