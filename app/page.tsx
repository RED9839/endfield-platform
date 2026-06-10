import Image from "next/image";
import Link from "next/link";
import { Suspense, type ComponentType } from "react";
import {
  ArrowRight,
  Boxes,
  Calculator,
  Database,
  Gem,
  Pickaxe,
  Settings2,
  Shield,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";

import BannerSection, {
  type HomeApiResponse,
} from "@/app/components/home/BannerSection";
import {
  MobileAccountFallback,
  MobileAccountPanel,
} from "@/app/components/home/HomeAccountPanels";
import { HomeMobileTopBar } from "@/app/components/home/HomeNavigation";
import HomeSearchPanel, {
  type HomeSearchItem,
} from "@/app/components/home/HomeSearchPanel";
import { gearSummaries } from "@/data/gear-summary-data";
import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";
import { defaultHomeFeaturedOperator } from "@/lib/home/featured-operators";

const navigationItems = [
  { label: "오퍼레이터", href: "/operators" },
  { label: "무기", href: "/weapons" },
  { label: "장비", href: "/gear" },
  { label: "성장 시뮬레이터", href: "/simulator" },
  { label: "파밍 계산기", href: "/farming" },
  { label: "유저 세팅", href: "/settings" },
];

const quickAccessItems: {
  label: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    label: "오퍼레이터",
    description: "능력치와 스킬 데이터",
    href: "/operators",
    icon: Users,
  },
  {
    label: "무기",
    description: "무기 효과와 돌파 정보",
    href: "/weapons",
    icon: Swords,
  },
  {
    label: "장비",
    description: "세트와 옵션 조합",
    href: "/gear",
    icon: Shield,
  },
  {
    label: "성장 계산",
    description: "필요 재화 한 번에 계산",
    href: "/simulator",
    icon: Calculator,
  },
  {
    label: "파밍",
    description: "부족 재화 파밍 경로",
    href: "/farming",
    icon: Pickaxe,
  },
  {
    label: "유저 세팅",
    description: "검증된 빌드와 파티",
    href: "/settings",
    icon: Settings2,
  },
];

const initialHomeBannerData = {
  ok: false,
  weaponStack: [
    {
      id: "red-bond",
      title: "붉은 결속 신청",
      stack: 0,
      image:
        "https://web-static.hg-cdn.com/upload/image/20260602/67e065febebdb645ba6edfd503e798ba.jpg",
      href: "https://endfield.gryphline.com/ko-kr/news/4492",
    },
    {
      id: "hanghae",
      title: "항해 신청",
      stack: 1,
      image:
        "https://web-static.hg-cdn.com/upload/image/20260415/c08b7435381e80dba80b70453daf22d4.jpg",
      href: "https://endfield.gryphline.com/ko-kr/news/5212",
    },
  ],
} satisfies HomeApiResponse;

function getSearchItems(): HomeSearchItem[] {
  return [
    ...operatorSummaries.map((item) => ({
      id: `operator-${item.slug}`,
      name: item.name,
      subName: item.enName ?? item.slug,
      image: item.avatar ?? `/operators/${item.slug}/avatar.webp`,
      href: `/operators/${item.slug}`,
      category: "operator" as const,
    })),
    ...weaponSummaries.map((item) => ({
      id: `weapon-${item.slug}`,
      name: item.name,
      subName: item.enName ?? item.slug,
      image: item.image ?? `/weapons/${item.slug}/avatar.webp`,
      href: `/weapons/${item.slug}`,
      category: "weapon" as const,
    })),
    ...gearSummaries.map((item) => ({
      id: `gear-${item.slug}`,
      name: item.name,
      subName: item.enName ?? item.setName ?? item.slug,
      image: item.image ?? `/gear/${item.slug}.webp`,
      href: `/gear/${item.slug}`,
      category: "gear" as const,
    })),
  ];
}

function DataCard({
  eyebrow,
  title,
  description,
  image,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative min-h-[190px] overflow-hidden rounded-[22px] border border-white/8 bg-[#080b10] transition hover:-translate-y-1 hover:border-yellow-300/30"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-contain object-right p-3 opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#080b10_0%,rgba(8,11,16,0.94)_42%,rgba(8,11,16,0.12)_100%)]" />
      <div className="relative flex h-full max-w-[68%] flex-col p-5">
        <p className="text-[10px] font-black tracking-[0.24em] text-yellow-300/70">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-lg font-black text-white">{title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
          {description}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black text-yellow-200">
          자세히 보기
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featured = defaultHomeFeaturedOperator;
  const searchItems = getSearchItems();
  const featuredWeapon = weaponSummaries[0];
  const featuredGear = gearSummaries[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#030405] text-white">
      <HomeMobileTopBar />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(250,204,21,0.08),transparent_35%)]" />

      <header className="relative z-30 hidden border-b border-white/8 bg-black/80 backdrop-blur-xl lg:block">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-8 px-6">
          <Link href="/" className="mr-auto">
            <p className="text-[9px] font-black tracking-[0.35em] text-yellow-300/60">
              ENDFIELD
            </p>
            <p className="text-base font-black tracking-tight text-white">
              데이터 허브
            </p>
          </Link>

          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-xs font-bold text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Suspense fallback={<MobileAccountFallback />}>
            <MobileAccountPanel />
          </Suspense>
        </div>
      </header>

      <div className="relative mx-auto max-w-[1500px] px-3 pb-24 pt-3 sm:px-5 sm:pt-5 lg:px-6 lg:pb-12 lg:pt-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.72fr)]">
          <div className="relative min-h-[500px] overflow-hidden rounded-[28px] border border-yellow-300/15 bg-black sm:min-h-[560px] xl:min-h-[520px]">
            <Image
              src={featured.heroImage}
              alt={featured.name}
              fill
              priority
              quality={78}
              sizes="(max-width: 1280px) 100vw, 68vw"
              className="object-cover object-[62%_35%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.82)_38%,rgba(0,0,0,0.26)_72%,rgba(0,0,0,0.12)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.82),transparent_48%)]" />

            <div className="relative z-10 flex min-h-[500px] max-w-[720px] flex-col justify-center p-5 sm:min-h-[560px] sm:p-10 xl:min-h-[520px] xl:p-12">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-300/20 bg-black/45 px-3 py-1.5 text-[10px] font-black tracking-[0.22em] text-yellow-200 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                ENDFIELD DATA PLATFORM
              </div>

              <h1 className="mt-6 text-3xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-[56px]">
                필요한 데이터를
                <br />
                <span className="text-[#ffda61]">가장 빠르게.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base sm:leading-7">
                오퍼레이터부터 무기, 장비, 성장 재화와 유저 세팅까지
                한곳에서 검색하고 비교하세요.
              </p>

              <div className="mt-7">
                <HomeSearchPanel items={searchItems} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/simulator"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#ffd24a] px-5 text-sm font-black text-black transition hover:brightness-110"
                >
                  성장 계산 시작
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/settings/party"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-black/55 px-5 text-sm font-black text-white backdrop-blur transition hover:border-yellow-300/35 hover:bg-white/8"
                >
                  세팅 만들기
                </Link>
                <Link
                  href={featured.href}
                  className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-zinc-300 transition hover:text-yellow-200"
                >
                  픽업 {featured.name} 보기
                </Link>
              </div>
            </div>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-[28px] xl:min-h-[520px]">
            <BannerSection initialData={initialHomeBannerData} />
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[18px] border border-white/8 bg-[#07090d] p-4 transition hover:-translate-y-0.5 hover:border-yellow-300/25 hover:bg-[#0b0e14]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-300/15 bg-yellow-300/8 text-yellow-200">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-yellow-200" />
                </div>
                <h2 className="mt-4 text-sm font-black text-white">
                  {item.label}
                </h2>
                <p className="mt-1 line-clamp-1 text-[11px] text-zinc-500">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.25em] text-yellow-300/60">
                DISCOVER
              </p>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                지금 확인할 데이터
              </h2>
            </div>
            <Link
              href="/operators"
              className="hidden items-center gap-2 text-xs font-black text-zinc-400 transition hover:text-yellow-200 sm:inline-flex"
            >
              전체 데이터 둘러보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <DataCard
              eyebrow="FEATURED OPERATOR"
              title={featured.name}
              description="현재 픽업 오퍼레이터의 스킬, 성장 재화와 추천 세팅을 확인하세요."
              image={featured.avatar}
              href={featured.href}
            />
            <DataCard
              eyebrow="WEAPON DATABASE"
              title={featuredWeapon?.name ?? "무기 데이터"}
              description="레벨과 돌파 단계별 능력치, 시리즈 스킬 효과를 비교하세요."
              image={featuredWeapon?.image ?? "/icons/placeholder.webp"}
              href={featuredWeapon ? `/weapons/${featuredWeapon.slug}` : "/weapons"}
            />
            <DataCard
              eyebrow="GEAR DATABASE"
              title={featuredGear?.name ?? "장비 데이터"}
              description="장비 세트, 주 능력치와 추천 옵션 조합을 빠르게 확인하세요."
              image={featuredGear?.image ?? "/icons/placeholder.webp"}
              href={featuredGear ? `/gear/${featuredGear.slug}` : "/gear"}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="relative overflow-hidden rounded-[24px] border border-yellow-300/15 bg-[#090b0f] p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-300/6 blur-3xl" />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-300/15 bg-yellow-300/8 text-yellow-200">
                <Boxes className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-2xl font-black">
                내 성장 계획을 한눈에
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                목표 레벨과 돌파 단계를 설정하고 필요한 재화, 현재 보유량,
                부족한 파밍 수량을 이어서 계산할 수 있습니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/simulator"
                  className="rounded-xl bg-[#ffd24a] px-5 py-3 text-sm font-black text-black"
                >
                  성장 시뮬레이터
                </Link>
                <Link
                  href="/farming"
                  className="rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-black text-white"
                >
                  파밍 계산기
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-[#07090d] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] text-yellow-300/60">
                  DATABASE
                </p>
                <h2 className="mt-1 text-lg font-black">데이터 현황</h2>
              </div>
              <Database className="h-6 w-6 text-yellow-200/70" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                ["오퍼레이터", operatorSummaries.length, Users],
                ["무기", weaponSummaries.length, Gem],
                ["장비", gearSummaries.length, Shield],
              ].map(([label, count, Icon]) => {
                const StatIcon = Icon as ComponentType<{ className?: string }>;
                return (
                  <div
                    key={String(label)}
                    className="rounded-2xl border border-white/7 bg-black/40 p-3 text-center"
                  >
                    <StatIcon className="mx-auto h-4 w-4 text-yellow-200/60" />
                    <p className="mt-2 text-xl font-black text-white">
                      {Number(count).toLocaleString()}
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-zinc-500">
                      {String(label)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-3 border-t border-white/8 py-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>엔드필드 데이터 허브</p>
          <div className="flex gap-4">
            <Link href="/operators" className="hover:text-zinc-300">
              데이터 탐색
            </Link>
            <Link href="/settings" className="hover:text-zinc-300">
              유저 세팅
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
