"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const ACCENT = "#ffd24a";
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

// 홈을 정적(CDN 캐시)으로 유지하기 위해 로그인 의존 UI만 클라이언트 조각으로 분리한다.
// 세션 JWT가 nickname/role 을 담고 있어 별도 DB 조회 없이 useSession 만으로 충분하다.
type HomeSessionUser = {
  nickname?: string | null;
  role?: string | null;
};

function useHomeUser() {
  const { data, status } = useSession();
  const loading = status === "loading";
  const user =
    status === "authenticated"
      ? ((data?.user ?? null) as HomeSessionUser | null)
      : null;

  return { user, loading };
}

// 닉네임이 없는 로그인 사용자를 프로필 설정으로 보낸다(기존 서버 redirect 대체).
export function HomeProfileGate() {
  const { user } = useHomeUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.nickname?.trim()) {
      router.replace("/setup-profile");
    }
  }, [user, router]);

  return null;
}

export function HomeHeaderAccountClient() {
  const { user, loading } = useHomeUser();

  if (loading) {
    return (
      <div className="ml-auto h-9 w-20 animate-pulse bg-ef-card2" style={CUT_SM} />
    );
  }

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

export function MobileAccountClient() {
  const { user, loading } = useHomeUser();

  if (loading) {
    return <div className="h-9 w-20 animate-pulse bg-ef-card2" style={CUT_SM} />;
  }

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
