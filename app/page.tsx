import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/app/components/auth/AuthButtons";
import type { ReactNode } from "react";
import HeroPanel from "@/app/components/home/HeroPanel";
import QuickAccessPanel, {
  type QuickAccessItem,
} from "@/app/components/home/QuickAccessPanel";
import OperatorHighlightPanel from "@/app/components/home/OperatorHighlightPanel";
import { getOperatorDetailByName } from "@/data/operators-detail-data";
import BannerSection, {
  type HomeApiResponse,
} from "./components/home/BannerSection";

type SimpleHomeItem = {
  id?: string;
  title?: string;
  date?: string;
  type?: string;
  href?: string;
  image?: string;
  detailImage?: string;
  bannerImage?: string;
  articleImage?: string;
  thumbnail?: string;
};

const defaultFeaturedOperatorName = "장방이";

const TOP_HERO_HEIGHT = "380px";
const TOP_GRID_COLUMNS = "minmax(0,1.55fr) minmax(420px,0.9fr)";

const navigationItems = [
  { label: "오퍼레이터", href: "/operators" },
  { label: "무기", href: "/weapons" },
  { label: "장비", href: "/gear" },
  { label: "성장 시뮬레이션", href: "/simulator" },
  { label: "재화 파밍 계산기", href: "/farming" },
  { label: "오퍼레이터 세팅", href: "/settings" },
];

const quickAccessItems: QuickAccessItem[] = [
  {
    label: "오퍼레이터",
    href: "/operators",
    description: "오퍼레이터 목록과 상세 데이터를 탐색합니다.",
  },
  {
    label: "무기",
    href: "/weapons",
    description: "무기 데이터와 시리즈 스킬을 확인합니다.",
  },
  {
    label: "장비",
    href: "/gear",
    description: "장비 및 세트 데이터를 확인합니다.",
  },
  {
    label: "성장 시뮬레이션",
    href: "/simulator",
    description: "오퍼레이터와 무기의 성장 재화를 계산합니다.",
  },
  {
    label: "재화 파밍 계산기",
    href: "/farming",
    description: "부족 재화를 기준으로 추천 파밍 경로를 계산합니다.",
  },
  {
    label: "오퍼레이터 세팅",
    href: "/settings",
    description: "오퍼레이터별 무기, 스킬, 장비 세팅을 저장합니다.",
  },
];

type AccountUser = {
  name?: string | null;
  email?: string | null;
  nickname?: string | null;
} | null;

function SideNav({ user }: { user?: AccountUser }) {
  return (
    <aside className="sticky top-0 flex h-screen flex-col border-r border-yellow-500/15 bg-black px-5 py-6">
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.35em] text-yellow-500/70">
          엔드필드
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-wide text-white">
          데이터 허브
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          오퍼레이터, 무기, 장비, 성장 시뮬레이션, 세팅 기능을 한곳에서 확인하는 허브 화면
        </p>

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
                <p className="mt-1 truncate text-xs text-zinc-500">
                  {user.email}
                </p>
              </div>

              <div className="grid gap-2">
                <Link
                  href="/account"
                  className="rounded-lg bg-[#ffd24a] px-4 py-2 text-center text-sm font-black text-black transition hover:brightness-110"
                >
                  프로필 수정
                </Link>
                <SignOutButton />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-black tracking-[0.28em] text-yellow-400">
                ACCOUNT
              </p>
              <p className="mt-2 text-sm leading-5 text-zinc-400">
                Google 계정으로 로그인하면 세팅을 저장하고 동기화할 수 있습니다.
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
      </div>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group rounded-xl border border-yellow-500/10 bg-[#05070b] px-4 py-3 text-sm tracking-wide text-zinc-300 transition hover:border-yellow-500/30 hover:bg-[#0b1018] hover:text-white"
          >
            <span className="flex items-center justify-between">
              {item.label}
              <span className="text-xs text-zinc-600 transition group-hover:text-yellow-400">
                →
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function SectionFrame({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-yellow-500/12 bg-[#05070b] p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,204,21,0.03),transparent_20%)]" />
      <div className="relative">
        <div className="mb-4 border-b border-yellow-500/12 pb-3">
          <h2 className="text-base font-semibold tracking-wide text-white">
            {title}
          </h2>
          {subTitle ? (
            <p className="mt-1 text-sm text-zinc-500">{subTitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function guessOperatorNameFromTitle(title: string) {
  if (title.includes("장방이")) return "장방이";
  if (title.includes("로시")) return "로시";
  if (title.includes("샤이닝")) return "샤이닝";
  if (title.includes("라스트 라이트")) return "라스트 라이트";
  return defaultFeaturedOperatorName;
}

function resolveFeaturedOperatorName(data: HomeApiResponse | null) {
  const merged: SimpleHomeItem[] = [
    ...((data?.latest ?? []) as SimpleHomeItem[]),
    ...((data?.notice ?? []) as SimpleHomeItem[]),
    ...((data?.event ?? []) as SimpleHomeItem[]),
    ...((data?.news ?? []) as SimpleHomeItem[]),
  ];

  const pickup = merged.find(
    (item) =>
      typeof item?.title === "string" && item.title.includes("헤드헌팅"),
  );

  if (pickup?.title) return guessOperatorNameFromTitle(pickup.title);

  return defaultFeaturedOperatorName;
}

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  if (!host) return "http://localhost:3000";

  return `${protocol}://${host}`;
}

async function getHomeData(): Promise<HomeApiResponse | null> {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/home`, {
      next: { revalidate: 300 },
    });

    const data = (await response.json()) as HomeApiResponse;

    if (!response.ok || !data?.ok) return null;

    return data;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const session = await auth();

  const sessionEmail = session?.user?.email?.trim().toLowerCase();

  const accountUser = session?.user?.id
    ? await prisma.user.findFirst({
        where: {
          OR: [
            { id: session.user.id },
            ...(sessionEmail
              ? [{ email: { equals: sessionEmail, mode: "insensitive" as const } }]
              : []),
          ],
        },
        select: {
          name: true,
          email: true,
          nickname: true,
        },
      })
    : null;

  if (session?.user?.id && !accountUser?.nickname) {
    redirect("/setup-profile");
  }

  const homeData = await getHomeData();

  const featuredOperatorName = resolveFeaturedOperatorName(homeData);

  const featuredOperator =
    getOperatorDetailByName(featuredOperatorName) ??
    getOperatorDetailByName(defaultFeaturedOperatorName) ??
    getOperatorDetailByName("라스트 라이트") ??
    getOperatorDetailByName("lastrite") ??
    null;

  const heroFeaturedData = featuredOperator
    ? {
        name: featuredOperator.name,
        enName: featuredOperator.enName ?? featuredOperator.slug,
        slug: featuredOperator.slug,
        href: `/operators/${featuredOperator.slug}`,
        heroImage: `/operators/${featuredOperator.slug}/full.webp`,
      }
    : {
        name: "장방이",
        enName: "Zhuang Fangyi",
        slug: "zhuang-fangyi",
        href: "/operators/zhuang-fangyi",
        heroImage: "/operators/zhuang-fangyi/full.webp",
      };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto grid max-w-[1820px] grid-cols-[260px_minmax(0,1fr)] gap-6 px-4 py-6 md:px-6">
        <SideNav
          user={
            session?.user
              ? {
                  name: accountUser?.name ?? session.user.name,
                  email: accountUser?.email ?? session.user.email,
                  nickname: accountUser?.nickname ?? null,
                }
              : null
          }
        />

        <section className="min-w-0">
          <div className="flex flex-col gap-6">
            <div
              className="grid gap-6"
              style={{
                height: TOP_HERO_HEIGHT,
                gridTemplateColumns: TOP_GRID_COLUMNS,
              }}
            >
              <div className="min-h-0 min-w-0 overflow-hidden">
                <HeroPanel featured={heroFeaturedData} />
              </div>

              <div className="min-h-0 min-w-0 overflow-hidden">
                <BannerSection initialData={homeData} />
              </div>
            </div>

            <SectionFrame title="빠른 이동">
              <QuickAccessPanel items={quickAccessItems} compact />
            </SectionFrame>

            <OperatorHighlightPanel
              operator={featuredOperator}
              title="추천 오퍼레이터"
              description="현재 픽업과 함께 확인하면 좋은 오퍼레이터 정보를 빠르게 확인할 수 있습니다."
              href="/operators"
            />
          </div>
        </section>
      </div>
    </main>
  );
}