import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import {
  getOperatorDetailBySlug,
  type OperatorRarity,
} from "@/data/operators-detail-data";

import HeroSlider from "./HeroSlider";
import OperatorLevelPanel from "./OperatorLevelPanel";
import InteractiveSkillPanel from "./InteractiveSkillPanel";
import ElitePanel from "./ElitePanel";
import TalentPanel from "./TalentPanel";
import InfrastructureSkillPanel from "./InfrastructureSkillPanel";
import TrustBonusPanel from "./TrustBonusPanel";
import PotentialPanel from "./PotentialPanel";

const panelClip: CSSProperties["clipPath"] =
  "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)";

const buttonClip: CSSProperties["clipPath"] =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

const rarityBorderMap: Record<OperatorRarity, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
};

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(255,170,40,0.08), transparent 18%), #000",
    color: "#fff",
    padding: "24px 28px 40px",
  },
  shell: {
    width: "100%",
    maxWidth: "1840px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
    borderBottom: `1px solid ${YELLOW_BORDER}`,
    paddingBottom: "16px",
  },
  subTitle: {
    fontSize: "11px",
    letterSpacing: "0.28em",
    color: "rgba(255,210,90,0.75)",
  },
  headerTopRow: {
    marginTop: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    marginTop: "8px",
    fontSize: "42px",
    fontWeight: 900,
    color: YELLOW_TEXT,
    letterSpacing: "-0.02em",
  },
  desc: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#9ca3af",
  },
  headerButtonRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  topLinkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "38px",
    padding: "0 14px",
    background: "#000000",
    color: "#f3f4f6",
    border: `1px solid ${YELLOW_BORDER}`,
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 800,
    clipPath: buttonClip,
  },
  heroWrap: {
    position: "relative",
    height: "min(70vw, 860px)",
    overflow: "hidden",
    marginBottom: "18px",
    background: "#000",
    clipPath: panelClip,
    boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.28), rgba(0,0,0,0.08))",
    pointerEvents: "none",
  },
  heroTextWrap: {
    position: "absolute",
    left: 24,
    bottom: 24,
    zIndex: 2,
  },
  heroName: {
    fontSize: "clamp(56px, 6vw, 110px)",
    fontWeight: 900,
    color: "#fff",
    textShadow: "0 8px 20px rgba(0,0,0,0.8)",
    lineHeight: 0.95,
  },
  heroEnName: {
    marginTop: "8px",
    fontSize: "22px",
    color: "#dbe4f0",
    textShadow: "0 4px 12px rgba(0,0,0,0.7)",
  },
  sectionTitle: {
    marginTop: "18px",
    marginBottom: "12px",
    fontSize: "22px",
    fontWeight: 900,
    color: YELLOW_TEXT,
    letterSpacing: "-0.01em",
  },
};

function PageSectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={styles.sectionTitle}>{children}</div>;
}

export default async function OperatorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const operator = getOperatorDetailBySlug(slug);

  if (!operator) notFound();

  const heroBorderColor = rarityBorderMap[operator.rarity];
  const panelAccentColor = YELLOW_MAIN;
  const heroImage = operator.fullImage || operator.avatar;

  const isAdminHeroSlider = operator.name === "관리자";

  const adminHeroSlides = [
    operator.fullImage,
    operator.fullImageSecondary,
  ].filter((item): item is string => !!item);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.subTitle}>ENDFIELD SUPPORT PLATFORM</div>

          <div style={styles.headerTopRow}>
            <div>
              <div style={styles.title}>OPERATORS</div>
              <div style={styles.desc}>{operator.name} 상세 정보</div>
            </div>

            <div style={styles.headerButtonRow}>
              <Link href="/" style={styles.topLinkButton}>
                홈으로
              </Link>
              <Link href="/operators" style={styles.topLinkButton}>
                목록으로
              </Link>
            </div>
          </div>
        </header>

        {isAdminHeroSlider && adminHeroSlides.length > 1 ? (
          <div
            style={{
              ...styles.heroWrap,
              border: `2px solid ${heroBorderColor}`,
            }}
          >
            <HeroSlider
              images={adminHeroSlides}
              alt={operator.name}
              enName={operator.enName}
              borderColor={heroBorderColor}
            />
          </div>
        ) : (
          <section
            style={{
              ...styles.heroWrap,
              border: `2px solid ${heroBorderColor}`,
            }}
          >
            <Image
              src={heroImage}
              alt={operator.name}
              fill
              style={{
                objectFit: "cover",
                filter: "blur(16px) brightness(0.25)",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={heroImage}
                alt={operator.name}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <div style={styles.heroOverlay} />

            <div style={styles.heroTextWrap}>
              <div style={styles.heroName}>{operator.name}</div>
              <div style={styles.heroEnName}>{operator.enName}</div>
            </div>
          </section>
        )}

        <OperatorLevelPanel
          name={operator.name}
          enName={operator.enName}
          element={operator.element}
          operatorClass={operator.class}
          weapon={operator.weapon}
          rarity={operator.rarity}
          mainStatLabel={operator.mainStatLabel ?? ""}
          subStatLabel={operator.subStatLabel ?? ""}
          levelStats={operator.levelStats}
        />

        <PageSectionTitle>전투 스킬</PageSectionTitle>

        <InteractiveSkillPanel
          skill={operator.skills.normalAttack}
          accentColor={panelAccentColor}
        />
        <InteractiveSkillPanel
          skill={operator.skills.battleSkill}
          accentColor={panelAccentColor}
        />
        <InteractiveSkillPanel
          skill={operator.skills.comboSkill}
          accentColor={panelAccentColor}
        />
        <InteractiveSkillPanel
          skill={operator.skills.ultimate}
          accentColor={panelAccentColor}
        />

        {!!operator.elite.length && (
          <>
            <PageSectionTitle>정예화</PageSectionTitle>
            <ElitePanel elite={operator.elite} />
          </>
        )}

        {!!operator.talents.length && (
          <>
            <PageSectionTitle>재능</PageSectionTitle>
            <TalentPanel items={operator.talents} accentColor={panelAccentColor} />
          </>
        )}

        {!!operator.infrastructureSkills.length && (
          <>
            <PageSectionTitle>인프라 스킬</PageSectionTitle>
            <InfrastructureSkillPanel
              groups={operator.infrastructureSkills}
              accentColor={panelAccentColor}
            />
          </>
        )}

        {!!operator.trustBonus.length && (
          <>
            <PageSectionTitle>신뢰도 보너스</PageSectionTitle>
            <TrustBonusPanel items={operator.trustBonus} />
          </>
        )}

        {!!operator.potential.length && (
          <>
            <PageSectionTitle>잠재능력</PageSectionTitle>
            <PotentialPanel items={operator.potential} />
          </>
        )}
      </div>
    </div>
  );
}