import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/components/auth/AuthButtons";
import { auth } from "@/auth";
import { getSessionUserId } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";

type ProfilePageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "required") return "닉네임을 입력해 주세요.";
  if (error === "length") return "닉네임은 2~16자로 입력해 주세요.";
  if (error === "duplicate") return "이미 사용 중인 닉네임입니다.";
  if (error === "delete-confirm") return "회원탈퇴 확인 문구가 일치하지 않습니다.";
  return "";
}

function getSuccessMessage(success?: string) {
  if (success === "profile") return "프로필 정보가 저장되었습니다.";
  return "";
}

async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id && !session?.user?.email) return null;

  const sessionUserId = session.user?.id ? String(session.user.id).trim() : "";
  const sessionEmail = session.user?.email?.trim().toLowerCase();

  return prisma.user.findFirst({
    where: {
      OR: [
        ...(sessionUserId ? [{ id: sessionUserId }] : []),
        ...(sessionEmail
          ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
          : []),
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      nickname: true,
      createdAt: true,
    },
  });
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  async function updateProfile(formData: FormData) {
    "use server";

    // 세션에 이미 있는 id로 인증 확인(추가 DB 조회 없음).
    const userId = await getSessionUserId();
    if (!userId) redirect("/login");

    const nickname = String(formData.get("nickname") ?? "").trim();

    if (!nickname) redirect("/profile?error=required");
    if (nickname.length < 2 || nickname.length > 16) {
      redirect("/profile?error=length");
    }

    const duplicated = await prisma.user.findFirst({
      where: { nickname, NOT: { id: userId } },
      select: { id: true },
    });

    if (duplicated) redirect("/profile?error=duplicate");

    await prisma.user.update({
      where: { id: userId },
      data: { nickname },
    });

    redirect("/profile?success=profile");
  }

  async function deleteAccount(formData: FormData) {
    "use server";

    const userId = await getSessionUserId();
    if (!userId) redirect("/login");

    const confirmText = String(formData.get("confirmText") ?? "").trim();
    if (confirmText !== "탈퇴합니다") {
      redirect("/profile?error=delete-confirm");
    }

    await prisma.user.delete({ where: { id: userId } });
    redirect("/");
  }

  const settingOwnerWhere = {
    OR: [
      { userId: user.id },
      ...(user.nickname ? [{ nickname: user.nickname }] : []),
    ],
  };

  const [settingStats, recentSettings, materialCount] = await Promise.all([
    prisma.userOperatorSetting.aggregate({
      where: settingOwnerWhere,
      _count: { id: true },
      _sum: { likeCount: true, viewCount: true },
    }),
    prisma.userOperatorSetting.findMany({
      where: settingOwnerWhere,
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        likeCount: true,
        viewCount: true,
        updatedAt: true,
      },
    }),
    prisma.userMaterialInventory.count({
      where: { userId: user.id, quantity: { gt: 0 } },
    }),
  ]);

  const settingsCount = settingStats._count.id;
  const totalLikes = settingStats._sum.likeCount ?? 0;
  const totalViews = settingStats._sum.viewCount ?? 0;
  const errorMessage = getErrorMessage(params?.error);
  const successMessage = getSuccessMessage(params?.success);
  const displayName = user.nickname ?? user.name ?? "사용자";
  const profileInitial = displayName.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#030405] px-3 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-white sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <div className="min-w-0">
            <p className="text-[10px] font-black tracking-[0.3em] text-yellow-300/70">
              MY PAGE
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#ffdc70] sm:text-4xl">
              마이페이지
            </h1>
          </div>

          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center rounded-xl border border-white/10 bg-black px-4 text-xs font-black text-zinc-200 transition hover:border-yellow-400/40 hover:text-yellow-200 sm:px-5 sm:text-sm"
          >
            홈으로
          </Link>
        </header>

        {errorMessage ? <Notice tone="error">{errorMessage}</Notice> : null}
        {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}

        <section className="relative overflow-hidden rounded-[24px] border border-yellow-500/15 bg-[#080b10] p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-yellow-400/[0.07] blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-2xl font-black text-[#ffdc70] sm:h-20 sm:w-20 sm:text-3xl">
                {profileInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-500">반갑습니다</p>
                <h2 className="mt-1 truncate text-2xl font-black text-white sm:text-3xl">
                  {displayName}
                </h2>
                <p className="mt-1 truncate text-sm text-zinc-500">
                  {user.email ?? "연결된 이메일 없음"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Link
                href="/settings/party"
                className="flex min-h-11 items-center justify-center rounded-xl bg-[#ffd24a] px-4 text-xs font-black text-black transition hover:brightness-110 sm:text-sm"
              >
                세팅 만들기
              </Link>
              <SignOutButton />
            </div>
          </div>
        </section>

        <section className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-3">
          <StatCard label="작성한 세팅" value={settingsCount.toLocaleString()} />
          <StatCard label="받은 추천" value={totalLikes.toLocaleString()} />
          <StatCard label="누적 조회" value={totalViews.toLocaleString()} />
          <StatCard label="보유 재화" value={materialCount.toLocaleString()} />
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="grid gap-4">
            <section className="rounded-[22px] border border-white/10 bg-[#080b10] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black tracking-[0.24em] text-yellow-300/60">
                    ACTIVITY
                  </p>
                  <h3 className="mt-1 text-lg font-black text-white">
                    최근 작성 세팅
                  </h3>
                </div>
                <Link
                  href="/settings"
                  className="text-xs font-black text-yellow-200 transition hover:text-yellow-100"
                >
                  전체 보기
                </Link>
              </div>

              {recentSettings.length > 0 ? (
                <div className="mt-4 grid gap-2">
                  {recentSettings.map((setting) => (
                    <Link
                      key={setting.id}
                      href={`/settings/${setting.id}`}
                      className="group rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-yellow-400/30 hover:bg-black/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="truncate font-black text-white group-hover:text-yellow-200">
                            {setting.title}
                          </h4>
                          <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                            {setting.description || "설명 없이 등록된 세팅"}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-zinc-600">
                          {setting.updatedAt.toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-3 text-[11px] font-bold text-zinc-500">
                        <span>추천 {setting.likeCount}</span>
                        <span>조회 {setting.viewCount}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-10 text-center">
                  <p className="text-sm font-bold text-zinc-400">
                    아직 작성한 세팅이 없습니다.
                  </p>
                  <Link
                    href="/settings/party"
                    className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#ffd24a] px-5 text-xs font-black text-black"
                  >
                    첫 세팅 만들기
                  </Link>
                </div>
              )}
            </section>

            <section className="rounded-[22px] border border-white/10 bg-[#080b10] p-4 sm:p-6">
              <p className="text-[10px] font-black tracking-[0.24em] text-yellow-300/60">
                SHORTCUTS
              </p>
              <h3 className="mt-1 text-lg font-black text-white">자주 쓰는 기능</h3>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Shortcut href="/simulator" label="성장 계산" detail="필요 재화" />
                <Shortcut href="/farming" label="파밍 계산" detail="파밍 경로" />
                <Shortcut href="/settings" label="세팅 탐색" detail="유저 세팅" />
                <Shortcut href="/operators" label="오퍼레이터" detail="상세 정보" />
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-4">
            <section className="rounded-[22px] border border-white/10 bg-[#080b10] p-4 sm:p-6">
              <p className="text-[10px] font-black tracking-[0.24em] text-yellow-300/60">
                PROFILE
              </p>
              <h3 className="mt-1 text-lg font-black text-white">프로필 설정</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                세팅과 커뮤니티에 표시되는 닉네임을 변경합니다.
              </p>

              <form action={updateProfile} className="mt-5 grid gap-3">
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-zinc-500">닉네임</span>
                  <input
                    name="nickname"
                    required
                    minLength={2}
                    maxLength={16}
                    defaultValue={user.nickname ?? ""}
                    placeholder="닉네임 입력"
                    className="h-12 rounded-xl border border-white/10 bg-black px-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-700 focus:border-yellow-400/50"
                  />
                </label>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#ffd24a] text-sm font-black text-black transition hover:brightness-110"
                >
                  변경사항 저장
                </button>
              </form>

              <dl className="mt-5 grid gap-2 border-t border-white/10 pt-5">
                <InfoRow label="연결 계정" value={user.email ?? "-"} />
                <InfoRow
                  label="가입일"
                  value={user.createdAt.toLocaleDateString("ko-KR")}
                />
              </dl>
            </section>

            <details className="group rounded-[22px] border border-red-500/15 bg-red-500/[0.03] p-4 sm:p-5">
              <summary className="cursor-pointer list-none text-sm font-black text-red-300">
                계정 관리
                <span className="float-right text-zinc-600 transition group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-xs leading-5 text-zinc-500">
                탈퇴하면 저장한 세팅과 계정 데이터가 삭제됩니다. 되돌릴 수 없습니다.
              </p>
              <form action={deleteAccount} className="mt-4 grid gap-3">
                <input
                  name="confirmText"
                  placeholder="탈퇴합니다"
                  className="h-11 rounded-xl border border-red-500/20 bg-black px-3 text-sm font-bold text-white outline-none placeholder:text-zinc-700 focus:border-red-400/50"
                />
                <button
                  type="submit"
                  className="h-11 rounded-xl border border-red-400/30 bg-red-500/10 text-xs font-black text-red-200 transition hover:bg-red-500/20"
                >
                  회원탈퇴
                </button>
              </form>
            </details>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Notice({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
        tone === "error"
          ? "border-red-500/20 bg-red-500/10 text-red-300"
          : "border-green-500/20 bg-green-500/10 text-green-300"
      }`}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-[#080b10] p-3 sm:p-4">
      <p className="truncate text-[10px] font-black tracking-[0.14em] text-zinc-600">
        {label}
      </p>
      <p className="mt-2 truncate text-xl font-black text-[#ffdc70] sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function Shortcut({
  href,
  label,
  detail,
}: {
  href: string;
  label: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-yellow-400/35 hover:bg-yellow-400/[0.04]"
    >
      <p className="font-black text-white">{label}</p>
      <p className="mt-1 text-xs text-zinc-600">{detail}</p>
    </Link>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <dt className="shrink-0 font-bold text-zinc-600">{label}</dt>
      <dd className="min-w-0 break-all text-right font-bold text-zinc-300">
        {value}
      </dd>
    </div>
  );
}
