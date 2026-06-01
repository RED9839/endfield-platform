import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ADMIN_MENUS = [
  {
    title: "유저 관리",
    description: "회원 정보 및 권한 관리",
    href: "/admin/users",
  },
  {
    title: "세팅 관리",
    description: "오퍼레이터 세팅 조회 및 삭제",
    href: "/admin/settings",
  },
  {
    title: "홈으로 이동",
    description: "메인 페이지 바로가기",
    href: "/",
  },
];

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#050505] p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#ffdc70]">
            관리자 패널
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            엔드필드 플랫폼 관리자 전용 페이지
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ADMIN_MENUS.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="group rounded-2xl border border-yellow-500/20 bg-black/30 p-6 transition hover:border-yellow-500/50 hover:bg-black/50"
            >
              <h2 className="text-xl font-black text-[#ffdc70] transition group-hover:text-yellow-300">
                {menu.title}
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                {menu.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/30 p-5">
          <div className="text-sm text-zinc-400">
            현재 로그인:
          </div>

          <div className="mt-1 font-bold text-white">
            {session.user.name ?? session.user.email}
          </div>
        </div>
      </div>
    </main>
  );
}
