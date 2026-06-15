import { cache } from "react";

import { auth } from "@/auth";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  nickname: string | null;
  role: string | null;
} | null;

// auth.ts 의 jwt/session 콜백이 세션에 id/nickname/role/hasDbUser 를 부착한다.
type SessionUserExtras = {
  id?: string;
  name?: string | null;
  email?: string | null;
  nickname?: string | null;
  role?: string;
  hasDbUser?: boolean;
};

// 세션(JWT)이 이미 표시에 필요한 필드를 담고 있어 별도 DB 조회 없이 구성한다.
// nickname/role 은 jwt 콜백의 동기화 주기(5분)만큼 stale 할 수 있다.
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const session = await auth();
  const user = session?.user as SessionUserExtras | undefined;

  if (!user?.id || user.hasDbUser === false) return null;

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? null,
    nickname: user.nickname ?? null,
    role: user.role ?? "USER",
  };
});

// id 만 필요한 소유권/레이트리밋 경로용 경량 헬퍼(DB 조회 없음).
export const getSessionUserId = cache(async (): Promise<string | null> => {
  const session = await auth();
  const id = session?.user?.id;
  return id ? String(id).trim() : null;
});
