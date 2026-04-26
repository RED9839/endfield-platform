import Link from "next/link";
import { notFound } from "next/navigation";
import { getGearDetailBySlug } from "@/data/gear-detail-data";
import type { GearDetail } from "@/data/gear-types";
import GearHeroPanel from "./GearHeroPanel";
import GearAbilityPanel from "./GearAbilityPanel";
import GearAttributePanel from "./GearAttributePanel";
import GearUpgradeComparePanel from "./GearUpgradeComparePanel";

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

  if (!gear) {
    notFound();
  }

  const ability2 = gear.ability2;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255,170,40,0.08), transparent 18%), #000",
        color: "#fff",
        padding: "24px 28px 40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1840px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
            borderBottom: "1px solid rgba(247,166,0,0.28)",
            paddingBottom: "16px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.28em",
              color: "rgba(255,210,90,0.75)",
            }}
          >
            ENDFIELD SUPPORT PLATFORM
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: 900,
                  color: "#ffcc4d",
                  letterSpacing: "-0.02em",
                }}
              >
                GEAR
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#9ca3af",
                }}
              >
                Gear Detail
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/gear"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "38px",
                  padding: "0 14px",
                  background: "#000000",
                  color: "#f3f4f6",
                  border: "1px solid rgba(247,166,0,0.28)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 800,
                }}
              >
                목록으로
              </Link>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "38px",
                  padding: "0 14px",
                  background: "#000000",
                  color: "#f3f4f6",
                  border: "1px solid rgba(247,166,0,0.28)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 800,
                }}
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <GearHeroPanel
            gear={gear}
            categoryLabel={categoryLabelMap[gear.category]}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: ability2 ? "1fr 1fr 1fr" : "1fr 1fr",
              gap: "18px",
            }}
          >
            <GearAbilityPanel
              title="능력치 1"
              block={gear.ability1}
            />

            {ability2 ? (
              <GearAbilityPanel
                title="능력치 2"
                block={ability2}
              />
            ) : null}

            <GearAttributePanel
              block={gear.attribute}
            />
          </div>

          <GearUpgradeComparePanel gear={gear} />
        </div>
      </div>
    </div>
  );
}