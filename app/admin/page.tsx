import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ===== 카탈로그 상세와 통일한 Endfield SF 디자인 토큰 =====
const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

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
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-ef-ink sm:px-5 sm:py-8">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto mb-3 flex max-w-[1180px] items-center gap-2">
        <span className="h-3 w-3" style={{ background: PRIMARY }} />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">
          Admin Console
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-ef-muted/60">
          // 관리자
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ef-muted">
              ADMIN CONSOLE
            </p>
            <h1 className="mt-1 break-keep text-2xl font-black leading-[0.95] tracking-tight text-white sm:text-4xl">
              관리자 허브
            </h1>
            <p className="mt-2 text-sm text-ef-muted">
              서비스 운영 기능만 모아둔 관리자 전용 공간입니다.
            </p>
          </div>

          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center border border-ef-line bg-ef-card px-4 text-xs font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft sm:px-5 sm:text-sm"
            style={CUT_SM}
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

        <section
          className="relative mt-4 overflow-hidden border border-ef-line bg-ef-card2 p-4 sm:p-6"
          style={CUT}
        >
          <span
            className="absolute inset-x-0 top-0 block h-0.5 w-full"
            style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }}
          />
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ef-line pb-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1" style={{ background: PRIMARY }} />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                  MANAGEMENT
                </p>
                <h2 className="mt-0.5 text-xl font-black tracking-tight text-white">관리 메뉴</h2>
              </div>
            </div>
            <p className="font-mono text-xs font-bold text-ef-muted">
              {session.user.name ?? session.user.email}
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ADMIN_MENUS.map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                className="group relative overflow-hidden border border-ef-line bg-ef-card p-5 transition hover:border-ef-accent/40 hover:bg-ef-card2 sm:p-6"
                style={CUT}
              >
                <div className="absolute right-4 top-3 font-mono text-4xl font-black text-white/[0.03] transition group-hover:text-ef-accent/[0.08]">
                  {menu.eyebrow}
                </div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ef-muted">
                  {menu.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-black text-white transition group-hover:text-ef-accent-soft">
                  {menu.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-ef-muted">
                  {menu.description}
                </p>
                <span
                  className="mt-5 inline-flex font-mono text-xs font-black uppercase tracking-wide"
                  style={{ color: PRIMARY }}
                >
                  관리 화면 열기 →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div
          className="mt-4 border border-ef-line bg-ef-card px-4 py-3 text-xs leading-5 text-ef-muted"
          style={CUT_SM}
        >
          관리자 화면은 관리자 권한을 가진 계정만 접근할 수 있습니다. 일반 사용자
          마이페이지와 데이터 관리 기능은 서로 분리되어 있습니다.
        </div>
      </div>
    </main>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ef-line bg-ef-card2 p-3 sm:p-4" style={CUT_SM}>
      <p className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">
        {label}
      </p>
      <p
        className="mt-2 font-mono text-xl font-black tabular-nums sm:text-2xl"
        style={{ color: ACCENT }}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}
