import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/app/components/auth/AuthButtons";
import type { ReactNode } from "react";

import HeroPanel from "@/app/components/home/HeroPanel";
import QuickAccessPanel, {
  type QuickAccessItem,
} from "@/app/components/home/QuickAccessPanel";
import OperatorHighlightPanel from "@/app/components/home/OperatorHighlightPanel";

import {
  defaultHomeFeaturedOperator,
  findHomeFeaturedOperatorFromTitle,
} from "@/lib/home/featured-operators";
import {
  getHomeData,
  type HomeApiResponse,
} from "@/lib/home/get-home-data";
import { getCurrentUser } from "@/lib/auth/get-current-user";

import BannerSection from "./components/home/BannerSection";

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

const navigationItems = [
  { label: "오퍼레이터", shortLabel: "오퍼", href: "/operators" },
  { label: "무기", shortLabel: "무기", href: "/weapons" },
  { label: "장비", shortLabel: "장비", href: "/gear" },
  { label: "성장 시뮬레이션", shortLabel: "성장", href: "/simulator" },
  { label: "재화 파밍 계산기", shortLabel: "파밍", href: "/farming" },
  { label: "오퍼레이터 세팅", shortLabel: "세팅", href: "/settings" },
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
  role?: string | null;
} | null;

function SideNav({ user }: { user?: AccountUser }) {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-yellow-500/15 bg-black px-5 py-6 lg:flex">
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.35em] text-yellow-500/70">
          엔드필드
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-wide text-white">
          데이터 허브
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          오퍼레이터, 무기, 장비, 시뮬레이션, 세팅 기능을 한곳에서
          확인하는 메인 화면
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
                  href="/profile"
                  className="rounded-lg bg-[#ffd24a] px-4 py-2 text-center text-sm font-black text-black transition hover:brightness-110"
                >
                  마이페이지
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm font-black text-red-300 transition hover:bg-red-500/20"
                  >
                    관리자 페이지
                  </Link>
                )}

                <SignOutButton />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-black tracking-[0.28em] text-yellow-400">
                ACCOUNT
              </p>

              <p className="mt-2 text-sm leading-5 text-zinc-400">
                Google 계정으로 로그인하고 세팅을 저장합니다.
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

function MobileTopBar({ user }: { user?: AccountUser }) {
  return (
    <header className="sticky top-0 z-40 border-b border-yellow-500/15 bg-black/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="min-w-0">
          <p className="text-[10px] font-black tracking-[0.28em] text-yellow-400/75">
            ENDFIELD
          </p>

          <h1 className="truncate text-lg font-black text-white">
            데이터 허브
          </h1>
        </Link>

        <div className="shrink-0">
          {user ? (
            <Link
              href="/profile"
              className="block max-w-[44vw] truncate rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-3 py-2 text-xs font-black text-yellow-200"
            >
              마이페이지
            </Link>
          ) : (
            <Link
              href="/login"
              className="block rounded-xl bg-[#ffd24a] px-4 py-2 text-xs font-black text-black shadow-[0_0_18px_rgba(255,210,74,0.18)]"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-yellow-500/15 bg-black/90 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-6 gap-1">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-yellow-500/10 bg-[#05070b] px-1 py-2 text-center text-[11px] font-black text-zinc-300 active:border-yellow-400/40 active:text-yellow-300"
          >
            {item.shortLabel}
          </Link>
        ))}
      </div>
    </nav>
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
    <section className="relative overflow-hidden rounded-[20px] border border-yellow-500/12 bg-[#05070b] p-3 sm:p-4 lg:rounded-[22px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,204,21,0.03),transparent_20%)]" />

      <div className="relative">
        <div className="mb-3 border-b border-yellow-500/12 pb-3 sm:mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-white sm:text-base">
            {title}
          </h2>

          {subTitle ? (
            <p className="mt-1 text-xs leading-5 text-zinc-500 sm:text-sm">
              {subTitle}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}

function resolveFeaturedOperator(data: HomeApiResponse | null) {
  const merged: SimpleHomeItem[] = [
    ...((data?.latest ?? []) as SimpleHomeItem[]),
    ...((data?.notice ?? []) as SimpleHomeItem[]),
    ...((data?.event ?? []) as SimpleHomeItem[]),
    ...((data?.news ?? []) as SimpleHomeItem[]),
  ];

  const pickup = merged.find(
    (item) =>
      typeof item?.title === "string" &&
      item.title.includes("헤드헌팅"),
  );

  if (pickup?.title) {
    return findHomeFeaturedOperatorFromTitle(pickup.title) ?? defaultHomeFeaturedOperator;
  }

  return defaultHomeFeaturedOperator;
}

export default async function HomePage() {
  const accountUserPromise = getCurrentUser();
  const homePayloadPromise = getHomeData();
  const accountUser = await accountUserPromise;

  if (accountUser && !accountUser.nickname?.trim()) {
    redirect("/setup-profile");
  }

  const homePayload = await homePayloadPromise;
  const homeData = homePayload.ok ? homePayload : null;
  const featuredOperator = resolveFeaturedOperator(homeData);

  const heroFeaturedData = {
    name: featuredOperator.name,
    enName: featuredOperator.enName,
    slug: featuredOperator.slug,
    href: featuredOperator.href,
    heroImage: featuredOperator.heroImage,
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <MobileTopBar user={accountUser} />

      <div className="mx-auto grid max-w-[1820px] grid-cols-1 gap-4 px-3 pb-24 pt-3 sm:px-4 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 lg:py-6">
        <SideNav user={accountUser} />

        <section className="min-w-0">
          <div className="flex flex-col gap-4 lg:gap-6">
            <div className="grid min-w-0 gap-4 lg:h-[380px] lg:grid-cols-[minmax(0,1.55fr)_minmax(420px,0.9fr)] lg:gap-6">
              <div className="min-h-[330px] min-w-0 overflow-hidden sm:min-h-[380px] lg:min-h-0">
                <HeroPanel featured={heroFeaturedData} />
              </div>

              <div className="min-h-[260px] min-w-0 overflow-hidden sm:min-h-[320px] lg:min-h-0">
                <BannerSection initialData={homeData} />
              </div>
            </div>

            <SectionFrame
              title="빠른 이동"
              subTitle="모바일에서는 필요한 기능만 빠르게 이동할 수 있도록 최적화했습니다."
            >
              <QuickAccessPanel
                items={quickAccessItems}
                compact
              />
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

      <MobileBottomNav />
    </main>
  );
}
