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

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gear = getGearDetailBySlug(slug);

  if (!gear) notFound();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-white md:px-6">
      <div className="mx-auto max-w-[1840px]">
        <header
          className="mb-6 rounded-[24px] bg-[#05070b] p-5 shadow-[0_0_30px_rgba(250,204,21,0.04)]"
          style={{ border: `1px solid ${YELLOW_BORDER}` }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.35em]"
                style={{ color: YELLOW_TEXT }}
              >
                ENDFIELD SUPPORT PLATFORM
              </p>

              <h1
                className="mt-2 text-4xl font-black tracking-tight"
                style={{ color: YELLOW_TEXT }}
              >
                GEAR
              </h1>

              <p className="mt-1 text-sm text-zinc-500">Gear Detail</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/gear"
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                목록으로
              </Link>

              <Link
                href="/"
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-[#0b1018]"
                style={{ border: `1px solid ${YELLOW_BORDER_SOFT}` }}
              >
                홈으로
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-5">
          <GearHeroPanel
            gear={gear}
            categoryLabel={categoryLabelMap[gear.category]}
          />

          <div
            className={
              gear.ability2
                ? "grid gap-5 xl:grid-cols-3"
                : "grid gap-5 xl:grid-cols-2"
            }
          >
            <GearAbilityPanel title="능력치 1" block={gear.ability1} />

            {gear.ability2 ? (
              <GearAbilityPanel title="능력치 2" block={gear.ability2} />
            ) : null}

            <GearAttributePanel block={gear.attribute} />
          </div>

          <GearUpgradeComparePanel gear={gear} />
        </div>
      </div>
    </main>
  );
}