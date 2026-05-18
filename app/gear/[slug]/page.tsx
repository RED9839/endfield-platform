import Link from "next/link";
import { notFound } from "next/navigation";
import { getGearDetailBySlug } from "@/data/gear-detail-data";
import type { GearDetail } from "@/data/gear-types";
import GearHeroPanel from "./GearHeroPanel";
import GearAbilityPanel from "./GearAbilityPanel";
import GearAttributePanel from "./GearAttributePanel";
import GearUpgradeComparePanel from "./GearUpgradeComparePanel";

const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

const categoryLabelMap: Record<GearDetail["category"], string> = {
  armor: "방어구",
  gloves: "보호 장갑",
  kit: "부품",
};

function DetailSection({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group scroll-mt-24 overflow-hidden rounded-[20px] border border-yellow-500/15 bg-[#05070b] shadow-[0_0_30px_rgba(250,204,21,0.035)] lg:rounded-[24px]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
        <span
          className="text-base font-black tracking-tight lg:text-[22px]"
          style={{ color: YELLOW_TEXT }}
        >
          {title}
        </span>

        <span className="shrink-0 text-lg font-black text-yellow-300 transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>

      <div
        className="px-3 pb-4 lg:px-5 lg:pb-5"
        style={{ borderTop: `1px solid ${YELLOW_BORDER_SOFT}` }}
      >
        {children}
      </div>
    </details>
  );
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gear = getGearDetailBySlug(slug);

  if (!gear) notFound();

  const sectionLinks = [
    { href: "#summary", label: "요약" },
    { href: "#ability", label: "능력치" },
    { href: "#upgrade", label: "강화 비교" },
  ];

  return (
    <main className="min-h-screen bg-[#050505] px-3 py-3 text-white sm:px-4 md:px-6 md:py-5">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-3 rounded-[20px] bg-[#05070b] p-4 shadow-[0_0_30px_rgba(250,204,21,0.04)] sm:mb-5 sm:rounded-[24px] sm:p-5"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold tracking-[0.28em] sm:text-[11px] sm:tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                엔드필드 지원 플랫폼
              </p>

              <h1
                className="mt-2 text-2xl font-black tracking-tight sm:text-4xl"
                style={{ color: YELLOW_TEXT }}
              >
                장비
              </h1>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                장비 상세 정보
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Link
                href="/gear"
                className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                목록
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-zinc-200 transition hover:bg-[#0b1018] sm:px-4 sm:text-sm"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                홈
              </Link>
            </div>
          </div>
        </header>

        <nav className="sticky top-2 z-30 mb-3 rounded-[18px] border border-yellow-500/15 bg-black/90 p-2 backdrop-blur lg:top-5 lg:hidden">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sectionLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-xl border border-yellow-500/15 bg-[#05070b] px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-200 sm:text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="grid gap-3 lg:gap-5">
          <section id="summary" className="scroll-mt-24">
            <GearHeroPanel
              gear={gear}
              categoryLabel={categoryLabelMap[gear.category]}
            />
          </section>

          <DetailSection id="ability" title="능력치 / 속성" defaultOpen>
            <div
              className={
                gear.ability2
                  ? "grid gap-3 lg:gap-5 xl:grid-cols-3"
                  : "grid gap-3 lg:gap-5 xl:grid-cols-2"
              }
            >
              <GearAbilityPanel title="능력치 1" block={gear.ability1} />

              {gear.ability2 ? (
                <GearAbilityPanel title="능력치 2" block={gear.ability2} />
              ) : null}

              <GearAttributePanel block={gear.attribute} />
            </div>
          </DetailSection>

          <DetailSection id="upgrade" title="강화 비교">
            <GearUpgradeComparePanel gear={gear} />
          </DetailSection>
        </div>
      </div>
    </main>
  );
}