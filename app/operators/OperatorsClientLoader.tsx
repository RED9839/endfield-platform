"use client";

import dynamic from "next/dynamic";

function OperatorsPageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-center text-sm font-semibold text-zinc-500">
      오퍼레이터 목록을 불러오는 중입니다...
    </main>
  );
}

const OperatorsPageClient = dynamic(
  () => import("./_components/OperatorsPageClient"),
  {
    ssr: false,
    loading: OperatorsPageLoading,
  },
);

export default function OperatorsClientLoader() {
  return <OperatorsPageClient />;
}
