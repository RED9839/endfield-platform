import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const RECENT_USER_CUTOFF = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const ADMIN_MENUS = [
  {
    title: "유저 관리",
    description: "가입 회원, 닉네임, 권한과 가입 현황을 확인합니다.",
    href: "/admin/users",
    eyebrow: "USERS",
  },
  {
    title: "세팅 관리",
    description: "사용자가 등록한 세팅을 검색하고 관리합니다.",
    href: "/admin/settings",
    eyebrow: "SETTINGS",
  },
];

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  const [userCount, adminCount, settingCount, recentUserCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.userOperatorSetting.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: RECENT_USER_CUTOFF,
          },
        },
      }),
    ]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#030405] px-3 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-white sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] text-red-300/70">
              ADMIN CONSOLE
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              관리자 허브
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              서비스 운영 기능만 모아둔 관리자 전용 공간입니다.
            </p>
          </div>

          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center rounded-xl border border-white/10 bg-black px-4 text-xs font-black text-zinc-300 transition hover:border-red-400/30 hover:text-white sm:px-5 sm:text-sm"
          >
            서비스로 돌아가기
          </Link>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <AdminStat label="전체 유저" value={userCount} />
          <AdminStat label="최근 7일 가입" value={recentUserCount} />
          <AdminStat label="등록 세팅" value={settingCount} />
          <AdminStat label="관리자" value={adminCount} />
        </section>

        <section className="mt-4 rounded-[24px] border border-red-500/15 bg-[#09090b] p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.24em] text-red-300/60">
                MANAGEMENT
              </p>
              <h2 className="mt-1 text-xl font-black text-white">관리 메뉴</h2>
            </div>
            <p className="text-xs font-bold text-zinc-600">
              {session.user.name ?? session.user.email}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ADMIN_MENUS.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-black/35 p-5 transition hover:border-red-400/35 hover:bg-red-500/[0.04] sm:p-6"
              >
                <div className="absolute right-4 top-3 text-4xl font-black text-white/[0.03] transition group-hover:text-red-400/[0.06]">
                  {menu.eyebrow}
                </div>
                <p className="text-[10px] font-black tracking-[0.22em] text-red-300/60">
                  {menu.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-black text-white transition group-hover:text-red-200">
                  {menu.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  {menu.description}
                </p>
                <span className="mt-5 inline-flex text-xs font-black text-red-300">
                  관리 화면 열기 →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-4 rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] px-4 py-3 text-xs leading-5 text-amber-100/60">
          관리자 화면은 관리자 권한을 가진 계정만 접근할 수 있습니다. 일반 사용자
          마이페이지와 데이터 관리 기능은 서로 분리되어 있습니다.
        </div>
      </div>
    </main>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09090b] p-3 sm:p-4">
      <p className="truncate text-[10px] font-black tracking-[0.14em] text-zinc-600">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-red-200 sm:text-2xl">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
