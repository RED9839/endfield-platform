import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/components/auth/AuthButtons";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export function DesktopAccountFallback() {
  return (
    <div className="mt-5 min-h-[150px] animate-pulse rounded-2xl border border-yellow-500/15 bg-[#05070b] p-4">
      <div className="h-3 w-20 rounded bg-yellow-500/10" />
      <div className="mt-4 h-4 w-32 rounded bg-white/5" />
      <div className="mt-3 h-9 rounded-lg bg-white/5" />
    </div>
  );
}

export function MobileAccountFallback() {
  return <div className="h-9 w-20 animate-pulse rounded-xl bg-white/5" />;
}

export async function HomeHeaderAccountPanel() {
  const user = await getCurrentUser();

  if (user && !user.nickname?.trim()) redirect("/setup-profile");

  return (
    <div className="ml-auto flex shrink-0 items-center gap-2">
      {user?.role === "ADMIN" ? (
        <Link
          href="/admin"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500/20"
        >
          관리자 페이지
        </Link>
      ) : null}

      <Link
        href={user ? "/profile" : "/login"}
        className="rounded-lg bg-[#ffd24a] px-4 py-2 text-xs font-black text-black shadow-[0_0_18px_rgba(255,210,74,0.18)] transition hover:brightness-110"
      >
        {user ? "마이페이지" : "로그인"}
      </Link>
    </div>
  );
}

export async function DesktopAccountPanel() {
  const user = await getCurrentUser();

  if (user && !user.nickname?.trim()) redirect("/setup-profile");

  return (
    <div className="mt-5 rounded-2xl border border-yellow-500/15 bg-[#05070b] p-4">
      {user ? (
        <div className="grid gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[0.28em] text-yellow-400">
              ACCOUNT
            </p>
            <p className="mt-2 truncate text-sm font-black text-white">
              {user.nickname ?? user.name ?? "로그인 사용자"}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-500">{user.email}</p>
          </div>

          <div className="grid gap-2">
            <Link
              href="/profile"
              className="rounded-lg bg-[#ffd24a] px-4 py-2 text-center text-sm font-black text-black transition hover:brightness-110"
            >
              마이페이지
            </Link>

            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm font-black text-red-300 transition hover:bg-red-500/20"
              >
                관리자 페이지
              </Link>
            ) : null}

            <SignOutButton />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-[11px] font-black tracking-[0.28em] text-yellow-400">
            ACCOUNT
          </p>
          <p className="mt-2 text-sm leading-5 text-zinc-400">
            Google 계정으로 로그인하고 설정을 저장합니다.
          </p>
          <Link
            href="/login"
            className="mt-3 block rounded-lg bg-[#ffd24a] px-4 py-2 text-center text-sm font-black text-black transition hover:brightness-110"
          >
            로그인 / 회원가입
          </Link>
        </div>
      )}
    </div>
  );
}

export async function MobileAccountPanel() {
  const user = await getCurrentUser();

  if (user && !user.nickname?.trim()) redirect("/setup-profile");

  return (
    <div className="flex items-center gap-1.5">
      {user?.role === "ADMIN" ? (
        <Link
          href="/admin"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-2 text-[10px] font-black text-red-300"
        >
          관리자
        </Link>
      ) : null}

      <Link
        href={user ? "/profile" : "/login"}
        className="block max-w-[32vw] truncate rounded-xl bg-[#ffd24a] px-3 py-2 text-xs font-black text-black shadow-[0_0_18px_rgba(255,210,74,0.18)]"
      >
        {user ? "마이페이지" : "로그인"}
      </Link>
    </div>
  );
}
