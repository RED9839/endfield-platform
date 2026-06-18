import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Calculator,
  Database,
  Gem,
  Pickaxe,
  Settings2,
  Shield,
  Swords,
  Users,
} from "lucide-react";

import { SessionProvider } from "next-auth/react";

import BannerSection, {
  type HomeApiResponse,
} from "@/app/components/home/BannerSection";
import {
  HomeHeaderAccountClient,
  HomeProfileGate,
} from "@/app/components/home/HomeAccountClient";
import { HomeMobileTopBar } from "@/app/components/home/HomeNavigation";
import HomeSearchPanel from "@/app/components/home/HomeSearchPanel";
import { gearSummaries } from "@/data/gear-summary-data";
import { operatorSummaries } from "@/data/operators-summary-data";
import { weaponSummaries } from "@/data/weapons-summary-data";
import { defaultHomeFeaturedOperator } from "@/lib/home/featured-operators";

// ===== 카탈로그 페이지와 통일한 Endfield SF 디자인 토큰 =====
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
      className="group relative min-h-[190px] overflow-hidden border border-ef-line bg-ef-card2 transition hover:-translate-y-1 hover:border-ef-accent/40"
      style={CUT}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-contain object-right p-3 opacity-65 transition duration-500 group-hover:scale-105 group-hover:opacity-85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0b0b_0%,rgba(11,11,11,0.94)_42%,rgba(11,11,11,0.12)_100%)]" />
      <div className="relative flex h-full max-w-[68%] flex-col p-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ef-muted">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-lg font-black text-white">{title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-ef-muted">
          {description}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black text-ef-accent-soft">
          자세히 보기
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const featured = defaultHomeFeaturedOperator;
  const featuredWeapon =
    weaponSummaries.find((weapon) => weapon.name === "적영") ??
    weaponSummaries[0];
  const featuredGear =
    gearSummaries.find((gear) => gear.setName === "고검의 잔향") ??
    gearSummaries[0];
  const featuredGearSet = "고검의 잔향";

  return (
    <SessionProvider>
      <HomeProfileGate />

      <main className="relative min-h-screen overflow-hidden bg-ef-bg text-ef-ink">
        <HomeMobileTopBar />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      <header className="relative z-30 hidden border-b border-ef-line bg-ef-bg/80 backdrop-blur-xl lg:block">
        <div className="mx-auto flex h-16 max-w-[1840px] items-center gap-5 px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="h-7 w-1" style={{ background: PRIMARY }} />
            <span>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-ef-muted">
                ENDFIELD
              </p>
              <p className="text-base font-black tracking-tight text-white">
                데이터 허브
              </p>
            </span>
          </Link>

          <div className="min-w-0 flex-1 max-w-[560px]">
            <HomeSearchPanel compact />
          </div>

          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-xs font-bold text-ef-muted transition hover:text-ef-accent-soft"
                style={CUT_SM}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <HomeHeaderAccountClient />
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1840px] px-3 pb-24 pt-3 sm:px-4 sm:pt-5 md:px-6 lg:pb-12 lg:pt-6">
        <div className="relative z-30 mb-3 lg:hidden">
          <HomeSearchPanel compact />
        </div>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(520px,1fr)]">
          <div className="relative min-h-[420px] overflow-hidden border border-ef-line bg-black sm:min-h-[460px] xl:min-h-[480px]" style={CUT}>
            <span className="absolute inset-x-0 top-0 z-20 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
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
            <div className="absolute bottom-6 left-6 z-10 sm:bottom-8 sm:left-8">
              <p className="text-2xl font-black text-white drop-shadow-lg sm:text-3xl">
                {featured.name}
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-ef-muted sm:text-sm">
                {featured.enName}
              </p>
            </div>
          </div>

          <div className="min-h-[300px] overflow-hidden sm:min-h-[380px] xl:min-h-[480px]" style={CUT}>
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
                className="group border border-ef-line bg-ef-card2 p-4 transition hover:-translate-y-0.5 hover:border-ef-accent/40"
                style={CUT_SM}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center border border-ef-line bg-ef-card text-ef-accent" style={CUT_SM}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-ef-muted transition group-hover:translate-x-1 group-hover:text-ef-accent" />
                </div>
                <h2 className="mt-4 text-sm font-black text-white">
                  {item.label}
                </h2>
                <p className="mt-1 line-clamp-1 text-[11px] text-ef-muted">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-9 w-1" style={{ background: PRIMARY }} />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ef-muted">
                  DISCOVER
                </p>
                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  지금 확인할 데이터
                </h2>
              </div>
            </div>
            <Link
              href="/operators"
              className="hidden items-center gap-2 text-xs font-black text-ef-muted transition hover:text-ef-accent-soft sm:inline-flex"
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
              title={featuredGearSet}
              description="고검의 잔향 세트 장비와 옵션 조합을 한 번에 확인하세요."
              image={featuredGear?.image ?? "/icons/placeholder.webp"}
              href={`/gear?set=${encodeURIComponent(featuredGearSet)}`}
            />
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="relative overflow-hidden border border-ef-line bg-ef-card2 p-6 sm:p-8" style={CUT}>
            <span className="absolute inset-x-0 top-0 block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center border border-ef-line bg-ef-card text-ef-accent" style={CUT_SM}>
                <Settings2 className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-2xl font-black">
                나만의 세팅을 등록하세요
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ef-muted">
                오퍼레이터, 무기, 장비와 스킬 사이클을 구성해 나만의 세팅을
                저장하고 다른 사용자와 공유할 수 있습니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/settings/party"
                  className="px-5 py-3 text-sm font-black text-black transition hover:brightness-110"
                  style={{ ...CUT_SM, background: ACCENT }}
                >
                  세팅 등록하기
                </Link>
              </div>
            </div>
          </div>

          <div className="border border-ef-line bg-ef-card2 p-6 sm:p-8" style={CUT}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-8 w-1" style={{ background: PRIMARY }} />
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-ef-muted">
                    DATABASE
                  </p>
                  <h2 className="mt-1 text-lg font-black">데이터 현황</h2>
                </div>
              </div>
              <Database className="h-6 w-6 text-ef-accent" />
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
                    className="border border-ef-line bg-ef-card p-3 text-center"
                    style={CUT_SM}
                  >
                    <StatIcon className="mx-auto h-4 w-4 text-ef-accent" />
                    <p className="mt-2 font-mono text-xl font-black tabular-nums" style={{ color: ACCENT }}>
                      {Number(count).toLocaleString()}
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wide text-ef-muted">
                      {String(label)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-3 border-t border-ef-line py-6 text-xs text-ef-muted sm:flex-row sm:items-center sm:justify-between">
          <p>엔드필드 데이터 허브</p>
          <div className="flex gap-4">
            <Link href="/operators" className="hover:text-ef-accent-soft">
              데이터 탐색
            </Link>
            <Link href="/settings" className="hover:text-ef-accent-soft">
              유저 세팅
            </Link>
          </div>
        </footer>
      </div>
      </main>
    </SessionProvider>
  );
}
