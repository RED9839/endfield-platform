import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/app/components/auth/AuthButtons";
import { auth } from "@/auth";
import { getSessionUserId } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/prisma";

// ===== Endfield SF 디자인 토큰 =====
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
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg px-3 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-ef-ink sm:px-5 sm:py-8">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative z-10 mx-auto max-w-[1180px]">
        <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3" style={{ background: PRIMARY }} />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">
                My Page
              </p>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
              마이페이지
            </h1>
          </div>

          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center border border-ef-line bg-ef-card px-4 text-xs font-black text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft sm:px-5 sm:text-sm"
            style={CUT_SM}
          >
            홈으로
          </Link>
        </header>

        {errorMessage ? <Notice tone="error">{errorMessage}</Notice> : null}
        {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}

        <section className="relative overflow-hidden border border-ef-line bg-ef-card2 p-5 sm:p-7" style={CUT}>
          <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center border border-ef-line bg-ef-card text-2xl font-black sm:h-20 sm:w-20 sm:text-3xl" style={{ ...CUT_SM, color: ACCENT }}>
                {profileInitial}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">반갑습니다</p>
                <h2 className="mt-1 truncate text-2xl font-black text-white sm:text-3xl">
                  {displayName}
                </h2>
                <p className="mt-1 truncate text-sm text-ef-muted">
                  {user.email ?? "연결된 이메일 없음"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Link
                href="/settings/party"
                className="flex min-h-11 items-center justify-center px-4 text-xs font-black text-black transition hover:brightness-110 sm:text-sm"
                style={{ ...CUT_SM, background: ACCENT }}
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
            <section className="relative overflow-hidden border border-ef-line bg-ef-card2 p-4 sm:p-6" style={CUT}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-1" style={{ background: PRIMARY }} />
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                      Activity
                    </p>
                  </div>
                  <h3 className="mt-1.5 text-lg font-black text-white">
                    최근 작성 세팅
                  </h3>
                </div>
                <Link
                  href="/settings"
                  className="font-mono text-xs font-black uppercase tracking-wide text-ef-accent-soft transition hover:brightness-125"
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
                      className="group border border-ef-line bg-ef-card p-4 transition hover:border-ef-accent/40"
                      style={CUT_SM}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="truncate font-black text-white group-hover:text-ef-accent-soft">
                            {setting.title}
                          </h4>
                          <p className="mt-1 line-clamp-1 text-xs text-ef-muted">
                            {setting.description || "설명 없이 등록된 세팅"}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[10px] font-bold text-ef-muted">
                          {setting.updatedAt.toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-3 font-mono text-[11px] font-bold tabular-nums text-ef-muted">
                        <span>추천 {setting.likeCount}</span>
                        <span>조회 {setting.viewCount}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-4 border border-dashed border-ef-line bg-ef-card px-5 py-10 text-center" style={CUT_SM}>
                  <p className="text-sm font-bold text-ef-muted">
                    아직 작성한 세팅이 없습니다.
                  </p>
                  <Link
                    href="/settings/party"
                    className="mt-4 inline-flex min-h-11 items-center px-5 text-xs font-black text-black"
                    style={{ ...CUT_SM, background: ACCENT }}
                  >
                    첫 세팅 만들기
                  </Link>
                </div>
              )}
            </section>

            <section className="relative overflow-hidden border border-ef-line bg-ef-card2 p-4 sm:p-6" style={CUT}>
              <div className="flex items-center gap-2">
                <span className="h-4 w-1" style={{ background: PRIMARY }} />
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                  Shortcuts
                </p>
              </div>
              <h3 className="mt-1.5 text-lg font-black text-white">자주 쓰는 기능</h3>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Shortcut href="/simulator" label="성장 계산" detail="필요 재화" />
                <Shortcut href="/farming" label="파밍 계산" detail="파밍 경로" />
                <Shortcut href="/settings" label="세팅 탐색" detail="유저 세팅" />
                <Shortcut href="/operators" label="오퍼레이터" detail="상세 정보" />
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-4">
            <section className="relative overflow-hidden border border-ef-line bg-ef-card2 p-4 sm:p-6" style={CUT}>
              <div className="flex items-center gap-2">
                <span className="h-4 w-1" style={{ background: PRIMARY }} />
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">
                  Profile
                </p>
              </div>
              <h3 className="mt-1.5 text-lg font-black text-white">프로필 설정</h3>
              <p className="mt-2 text-sm leading-6 text-ef-muted">
                세팅과 커뮤니티에 표시되는 닉네임을 변경합니다.
              </p>

              <form action={updateProfile} className="mt-5 grid gap-3">
                <label className="grid gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ef-muted">닉네임</span>
                  <input
                    name="nickname"
                    required
                    minLength={2}
                    maxLength={16}
                    defaultValue={user.nickname ?? ""}
                    placeholder="닉네임 입력"
                    className="h-12 border border-ef-line bg-ef-card px-4 text-sm font-bold text-white outline-none transition placeholder:text-ef-muted/70 focus:border-ef-accent/50"
                    style={CUT_SM}
                  />
                </label>
                <button
                  type="submit"
                  className="h-12 text-sm font-black text-black transition hover:brightness-110"
                  style={{ ...CUT_SM, background: ACCENT }}
                >
                  변경사항 저장
                </button>
              </form>

              <dl className="mt-5 grid gap-2 border-t border-ef-line pt-5">
                <InfoRow label="연결 계정" value={user.email ?? "-"} />
                <InfoRow
                  label="가입일"
                  value={user.createdAt.toLocaleDateString("ko-KR")}
                />
              </dl>
            </section>

            <details className="group border border-red-500/20 bg-red-500/[0.03] p-4 sm:p-5" style={CUT}>
              <summary className="cursor-pointer list-none text-sm font-black text-red-300">
                계정 관리
                <span className="float-right text-ef-muted transition group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-xs leading-5 text-ef-muted">
                탈퇴하면 저장한 세팅과 계정 데이터가 삭제됩니다. 되돌릴 수 없습니다.
              </p>
              <form action={deleteAccount} className="mt-4 grid gap-3">
                <input
                  name="confirmText"
                  placeholder="탈퇴합니다"
                  className="h-11 border border-red-500/30 bg-ef-card px-3 text-sm font-bold text-white outline-none placeholder:text-ef-muted/70 focus:border-red-400/50"
                  style={CUT_SM}
                />
                <button
                  type="submit"
                  className="h-11 border border-red-400/40 bg-red-500/10 text-xs font-black text-red-200 transition hover:bg-red-500/20"
                  style={CUT_SM}
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
      className={`mb-4 border px-4 py-3 text-sm font-bold ${
        tone === "error"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-green-500/30 bg-green-500/10 text-green-300"
      }`}
      style={CUT_SM}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border border-ef-line bg-ef-card2 p-3 sm:p-4" style={CUT_SM}>
      <p className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">
        {label}
      </p>
      <p className="mt-2 truncate font-mono text-xl font-black tabular-nums sm:text-2xl" style={{ color: ACCENT }}>
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
      className="border border-ef-line bg-ef-card p-4 transition hover:border-ef-accent/40"
      style={CUT_SM}
    >
      <p className="font-black text-white">{label}</p>
      <p className="mt-1 text-xs text-ef-muted">{detail}</p>
    </Link>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs">
      <dt className="shrink-0 font-mono font-bold uppercase tracking-wide text-ef-muted">{label}</dt>
      <dd className="min-w-0 break-all text-right font-bold text-ef-ink">
        {value}
      </dd>
    </div>
  );
}
