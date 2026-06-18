import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/components/auth/AuthButtons";
import { getCurrentUser } from "@/lib/auth/get-current-user";

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

export function DesktopAccountFallback() {
  return (
    <div className="mt-5 min-h-[150px] animate-pulse border border-ef-line bg-ef-card2 p-4" style={CUT}>
      <div className="h-3 w-20 bg-ef-line" />
      <div className="mt-4 h-4 w-32 bg-ef-line" />
      <div className="mt-3 h-9 bg-ef-line" style={CUT_SM} />
    </div>
  );
}

export function MobileAccountFallback() {
  return <div className="h-9 w-20 animate-pulse bg-ef-card2" style={CUT_SM} />;
}

export async function HomeHeaderAccountPanel() {
  const user = await getCurrentUser();

  if (user && !user.nickname?.trim()) redirect("/setup-profile");

  return (
    <div className="ml-auto flex shrink-0 items-center gap-2">
      {user?.role === "ADMIN" ? (
        <Link
          href="/admin"
          className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500/20"
          style={CUT_SM}
        >
          관리자 페이지
        </Link>
      ) : null}

      <Link
        href={user ? "/profile" : "/login"}
        className="px-4 py-2 text-xs font-black text-black transition hover:brightness-110"
        style={{ ...CUT_SM, background: ACCENT }}
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
    <div className="relative mt-5 overflow-hidden border border-ef-line bg-ef-card2 p-4" style={CUT}>
      <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
      {user ? (
        <div className="grid gap-3">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-ef-muted">
              ACCOUNT
            </p>
            <p className="mt-2 truncate text-sm font-black text-white">
              {user.nickname ?? user.name ?? "로그인 사용자"}
            </p>
            <p className="mt-1 truncate text-xs text-ef-muted">{user.email}</p>
          </div>

          <div className="grid gap-2">
            <Link
              href="/profile"
              className="px-4 py-2 text-center text-sm font-black text-black transition hover:brightness-110"
              style={{ ...CUT_SM, background: ACCENT }}
            >
              마이페이지
            </Link>

            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm font-black text-red-300 transition hover:bg-red-500/20"
                style={CUT_SM}
              >
                관리자 페이지
              </Link>
            ) : null}

            <SignOutButton />
          </div>
        </div>
      ) : (
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-ef-muted">
            ACCOUNT
          </p>
          <p className="mt-2 text-sm leading-5 text-ef-muted">
            Google 계정으로 로그인하고 설정을 저장합니다.
          </p>
          <Link
            href="/login"
            className="mt-3 block px-4 py-2 text-center text-sm font-black text-black transition hover:brightness-110"
            style={{ ...CUT_SM, background: ACCENT }}
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
          className="border border-red-500/30 bg-red-500/10 px-2.5 py-2 text-[10px] font-black text-red-300"
          style={CUT_SM}
        >
          관리자
        </Link>
      ) : null}

      <Link
        href={user ? "/profile" : "/login"}
        className="block max-w-[32vw] truncate px-3 py-2 text-xs font-black text-black"
        style={{ ...CUT_SM, background: ACCENT }}
      >
        {user ? "마이페이지" : "로그인"}
      </Link>
    </div>
  );
}
