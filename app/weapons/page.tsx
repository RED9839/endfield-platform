"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import {
  weaponDetails,
  type WeaponDetail,
  type WeaponType,
  type WeaponRarity,
} from "@/data/weapons-detail-data";

type WeaponAttributeFilter =
  | "all"
  | "attack"
  | "hp"
  | "physical"
  | "heat"
  | "electric"
  | "cryo"
  | "nature"
  | "critRate"
  | "originiumArts"
  | "ultimateEfficiency"
  | "artsDamage"
  | "healEfficiency";

type WeaponSeriesFilter =
  | "all"
  | "heavyStrike"
  | "suppression"
  | "pursuit"
  | "crush"
  | "morale"
  | "technique"
  | "brutality"
  | "pain"
  | "medical"
  | "fracture"
  | "discharge"
  | "darkness"
  | "flow"
  | "efficiency";

type WeaponAbilityFilter =
  | "all"
  | "strength"
  | "agility"
  | "intelligence"
  | "will"
  | "mainStat";

const weaponLabelMap: Record<WeaponType, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const rarityBorderMap: Record<WeaponRarity, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
};

const rarityIconMap: Record<WeaponRarity, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const weaponIconMap: Record<WeaponType, string> = {
  sword: "/icons/weapons/sword.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
  artsunit: "/icons/weapons/artsunit.webp",
};

const panelClip: CSSProperties["clipPath"] =
  "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)";

const buttonClip: CSSProperties["clipPath"] =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

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
    borderBottom: "1px solid rgba(247,166,0,0.28)",
    paddingBottom: "16px",
  },
  subTitle: {
    fontSize: "11px",
    letterSpacing: "0.28em",
    color: "rgba(255,210,90,0.75)",
  },
  title: {
    marginTop: "8px",
    fontSize: "42px",
    fontWeight: 900,
    color: "#ffcc4d",
    letterSpacing: "-0.02em",
  },
  desc: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#9ca3af",
  },
  headerTopRow: {
    marginTop: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
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
    border: "1px solid rgba(247,166,0,0.28)",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 800,
    clipPath: buttonClip,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "280px minmax(0, 1fr)",
    gap: "28px",
    alignItems: "start",
  },
  sidebar: {
    width: "100%",
    background: "#000000",
    border: "1px solid rgba(247,166,0,0.26)",
    padding: "16px",
    position: "sticky",
    top: "18px",
    clipPath: panelClip,
    boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
    maxHeight: "calc(100vh - 36px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
  content: {
    minWidth: 0,
    paddingRight: "8px",
  },
  sectionTitle: {
    marginBottom: "10px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: "#ffcc4d",
  },
  inputWrap: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8b98ad",
    fontSize: "12px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    height: "38px",
    background: "#000000",
    color: "#fff",
    border: "1px solid #3a4250",
    padding: "0 12px 0 34px",
    fontSize: "13px",
    outline: "none",
    clipPath: buttonClip,
  },
  buttonList: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  toolbar: {
    marginBottom: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    padding: "0 4px",
  },
  resultBar: {
    fontSize: "13px",
    color: "#9ca3af",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(168px, 168px))",
    gap: "14px",
    alignItems: "start",
    justifyContent: "start",
    padding: "2px 4px 0",
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  card: {
    width: "168px",
    minHeight: "340px",
    background: "#000000",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    clipPath: panelClip,
    boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },
  imageWrap: {
    position: "relative",
    width: "168px",
    height: "200px",
    background: "#000000",
    overflow: "hidden",
    flexShrink: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.20), rgba(0,0,0,0))",
    pointerEvents: "none",
  },
  info: {
    background: "#000000",
    padding: "8px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  },
  name: {
    fontSize: "17px",
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.1,
    minHeight: "20px",
  },
  enName: {
    marginTop: "2px",
    fontSize: "11px",
    color: "#cbd5e1",
    lineHeight: 1.2,
    minHeight: "13px",
  },
  cardBadgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "6px",
  },
  cardSingleRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "4px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    maxWidth: "100%",
    minHeight: "22px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: 1.1,
    border: "1px solid #444",
    background: "#000000",
    color: "#fff",
    gap: "4px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    clipPath: buttonClip,
    flex: "0 0 auto",
  },
  badgeIconWrap: {
    position: "relative",
    width: "11px",
    height: "11px",
    flexShrink: 0,
  },
  filterButton: {
    width: "100%",
    minHeight: "40px",
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "13px",
    background: "#000000",
    color: "#d4d4d8",
    border: "1px solid #3f3f46",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    clipPath: buttonClip,
  },
  filterIconWrap: {
    position: "relative",
    width: "16px",
    height: "16px",
    flexShrink: 0,
  },
  filterLabel: {
    flex: 1,
    minWidth: 0,
  },
};

function FilterButton({
  active,
  label,
  onClick,
  iconSrc,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  iconSrc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.filterButton,
        border: active ? "1px solid #f7a600" : "1px solid #3f3f46",
        background: active
          ? "linear-gradient(90deg, rgba(247,166,0,0.18), rgba(247,166,0,0.08))"
          : "#000000",
        color: active ? "#ffd873" : "#d4d4d8",
      }}
    >
      {iconSrc ? (
        <span style={styles.filterIconWrap}>
          <Image
            src={iconSrc}
            alt=""
            fill
            sizes="16px"
            style={{ objectFit: "contain" }}
          />
        </span>
      ) : (
        <span
          style={{
            width: "16px",
            height: "16px",
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: active ? "#ffd873" : "#6b7280",
          }}
        >
          ◆
        </span>
      )}
      <span style={styles.filterLabel}>{label}</span>
    </button>
  );
}

function Badge({
  label,
  iconSrc,
  borderColor,
}: {
  label: string;
  iconSrc?: string;
  borderColor?: string;
}) {
  return (
    <span
      style={{
        ...styles.badge,
        border: `1px solid ${borderColor ?? "#444"}`,
      }}
    >
      {iconSrc ? (
        <span style={styles.badgeIconWrap}>
          <Image
            src={iconSrc}
            alt=""
            fill
            sizes="11px"
            style={{ objectFit: "contain" }}
          />
        </span>
      ) : null}
      <span>{label}</span>
    </span>
  );
}

function normalizeSkillPrefix(value?: string) {
  return String(value ?? "").replace(/\s+/g, "").trim();
}

function extractSeriesName(value?: string) {
  if (!value) return "";
  const normalized = String(value).trim();
  if (normalized.includes("·")) return normalized.split("·")[0].trim();
  return normalized.slice(0, 2).trim();
}

function getAbilityFromSkillName(skillName?: string) {
  const v = normalizeSkillPrefix(skillName);

  if (v.startsWith("힘증가")) return "힘";
  if (v.startsWith("민첩증가")) return "민첩";
  if (v.startsWith("지능증가")) return "지능";
  if (v.startsWith("의지증가")) return "의지";
  if (v.startsWith("주요능력치증가")) return "주요 능력치";

  return "";
}

function getAttributeFromSkillName(skillName?: string) {
  const v = normalizeSkillPrefix(skillName);

  if (v.startsWith("공격력증가")) return "공격력";
  if (v.startsWith("생명력증가")) return "생명력";
  if (v.startsWith("물리피해증가")) return "물리 피해";
  if (v.startsWith("열기피해증가")) return "열기 피해";
  if (v.startsWith("전기피해증가")) return "전기 피해";
  if (v.startsWith("냉기피해증가")) return "냉기 피해";
  if (v.startsWith("자연피해증가")) return "자연 피해";
  if (v.startsWith("치명타확률증가")) return "치명타 확률";
  if (v.startsWith("오리지늄아츠강도증가")) return "오리지늄 아츠 강도";
  if (v.startsWith("오리지늄아츠증가")) return "오리지늄 아츠 강도";
  if (v.startsWith("궁극기충전효율증가")) return "궁극기 충전 효율";
  if (v.startsWith("궁극기획득효율증가")) return "궁극기 충전 효율";
  if (v.startsWith("아츠피해증가")) return "아츠 피해";
  if (v.startsWith("치유효율증가")) return "치유 효율";

  return "";
}

function normalizeAttributeValue(value?: string) {
  const v = (value ?? "").replace(/\s+/g, "").toLowerCase();

  if (v.includes("공격력")) return "attack";
  if (v.includes("생명력") || v.includes("체력") || v.includes("hp")) return "hp";
  if (v.includes("물리피해")) return "physical";
  if (v.includes("열기피해")) return "heat";
  if (v.includes("전기피해")) return "electric";
  if (v.includes("냉기피해")) return "cryo";
  if (v.includes("자연피해")) return "nature";
  if (v.includes("치명타확률")) return "critRate";
  if (v.includes("오리지늄아츠강도") || v.includes("오리지늄아츠")) return "originiumArts";
  if (v.includes("궁극기충전효율") || v.includes("궁극기획득효율")) return "ultimateEfficiency";
  if (v.includes("아츠피해")) return "artsDamage";
  if (v.includes("치유효율")) return "healEfficiency";

  return "";
}

function normalizeSeriesValue(value?: string) {
  const v = extractSeriesName(value).replace(/\s+/g, "").toLowerCase();

  if (v === "강공") return "heavyStrike";
  if (v === "억제") return "suppression";
  if (v === "추격") return "pursuit";
  if (v === "분쇄") return "crush";
  if (v === "사기") return "morale";
  if (v === "기예") return "technique";
  if (v === "잔혹") return "brutality";
  if (v === "고통") return "pain";
  if (v === "의료") return "medical";
  if (v === "골절") return "fracture";
  if (v === "방출") return "discharge";
  if (v === "어둠") return "darkness";
  if (v === "흐름") return "flow";
  if (v === "효율") return "efficiency";

  return "";
}

function getWeaponAbilityText(weapon: WeaponDetail) {
  const skillBased = weapon.skills
    ?.map((skill) => getAbilityFromSkillName(skill.name))
    ?.find(Boolean);

  if (skillBased) return skillBased;

  const main = weapon.mainStatLabel?.trim();
  if (main) return main;

  const sub = weapon.subStatLabel?.trim();
  if (sub) return sub;

  return "-";
}

function getWeaponAttributeText(weapon: WeaponDetail) {
  const skillBased = weapon.skills
    ?.map((skill) => getAttributeFromSkillName(skill.name))
    ?.find(Boolean);

  if (skillBased) return skillBased;

  const directMeta = weapon.skills
    ?.flatMap((skill) => skill.meta ?? [])
    ?.find((meta) => String(meta.label).trim() === "속성");

  if (directMeta?.value) return String(directMeta.value);

  const fuzzyMeta = weapon.skills
    ?.flatMap((skill) => skill.meta ?? [])
    ?.find((meta) => String(meta.label).replace(/\s+/g, "").includes("속성"));

  if (fuzzyMeta?.value) return String(fuzzyMeta.value);

  return "-";
}

function getWeaponSeriesSkillFullText(weapon: WeaponDetail) {
  const seriesMeta = weapon.skills.find((skill) =>
    skill.meta?.some((meta) => String(meta.label).includes("시리즈 스킬"))
  );
  return seriesMeta?.name ?? "-";
}

function getWeaponSeriesSkillDisplayText(weapon: WeaponDetail) {
  return extractSeriesName(getWeaponSeriesSkillFullText(weapon)) || "-";
}

function getWeaponSeriesKey(weapon: WeaponDetail) {
  return normalizeSeriesValue(getWeaponSeriesSkillFullText(weapon));
}

function getWeaponAttributeKey(weapon: WeaponDetail) {
  return normalizeAttributeValue(getWeaponAttributeText(weapon));
}

function getWeaponAbilityKey(weapon: WeaponDetail): WeaponAbilityFilter | "" {
  const value = getWeaponAbilityText(weapon).replace(/\s+/g, "");

  if (value.includes("주요능력치")) return "mainStat";
  if (value.includes("힘")) return "strength";
  if (value.includes("민첩")) return "agility";
  if (value.includes("지능")) return "intelligence";
  if (value.includes("의지")) return "will";

  return "";
}

function WeaponCard({ weapon }: { weapon: WeaponDetail }) {
  const abilityText = getWeaponAbilityText(weapon);
  const attributeText = getWeaponAttributeText(weapon);
  const seriesSkillText = getWeaponSeriesSkillDisplayText(weapon);
  const rarityColor = rarityBorderMap[weapon.rarity];
  const weaponImageSrc = `/weapons/${weapon.slug}.webp`;

  return (
    <Link href={`/weapons/${weapon.slug}`} style={styles.cardLink}>
      <div
        style={{
          ...styles.card,
          border: `2px solid ${rarityColor}`,
        }}
      >
        <div style={styles.imageWrap}>
          <Image
            src={weaponImageSrc}
            alt={weapon.name}
            fill
            sizes="168px"
            style={{ objectFit: "cover" }}
          />
          <div style={styles.overlay} />
        </div>

        <div style={styles.info}>
          <div style={styles.name}>{weapon.name}</div>
          <div style={styles.enName}>{weapon.enName}</div>

          <div style={styles.cardBadgeRow}>
            <Badge
              label={`${weapon.rarity}성`}
              borderColor={rarityColor}
              iconSrc={rarityIconMap[weapon.rarity]}
            />
            <Badge
              label={weaponLabelMap[weapon.weaponType]}
              iconSrc={weaponIconMap[weapon.weaponType]}
            />
          </div>

          <div style={styles.cardBadgeRow}>
            <Badge label={abilityText} />
            <Badge label={seriesSkillText} />
          </div>

          <div style={styles.cardSingleRow}>
            <Badge label={attributeText} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function WeaponsPage() {
  const [keyword, setKeyword] = useState("");
  const [rarity, setRarity] = useState<WeaponRarity | "all">("all");
  const [weaponType, setWeaponType] = useState<WeaponType | "all">("all");
  const [abilityFilter, setAbilityFilter] =
    useState<WeaponAbilityFilter>("all");
  const [attributeFilter, setAttributeFilter] =
    useState<WeaponAttributeFilter>("all");
  const [seriesFilter, setSeriesFilter] =
    useState<WeaponSeriesFilter>("all");

  const filteredWeapons = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return weaponDetails.filter((weapon) => {
      const matchesKeyword =
        q === "" ||
        weapon.name.toLowerCase().includes(q) ||
        weapon.enName.toLowerCase().includes(q);

      const matchesRarity = rarity === "all" || weapon.rarity === rarity;
      const matchesWeaponType =
        weaponType === "all" || weapon.weaponType === weaponType;

      const weaponAbilityKey = getWeaponAbilityKey(weapon);
      const weaponAttributeKey = getWeaponAttributeKey(weapon);
      const weaponSeriesKey = getWeaponSeriesKey(weapon);

      const matchesAbility =
        abilityFilter === "all" || weaponAbilityKey === abilityFilter;

      const matchesAttribute =
        attributeFilter === "all" || weaponAttributeKey === attributeFilter;

      const matchesSeries =
        seriesFilter === "all" || weaponSeriesKey === seriesFilter;

      return (
        matchesKeyword &&
        matchesRarity &&
        matchesWeaponType &&
        matchesAbility &&
        matchesAttribute &&
        matchesSeries
      );
    });
  }, [keyword, rarity, weaponType, abilityFilter, attributeFilter, seriesFilter]);

  const sortedWeapons = useMemo(() => {
    return [...filteredWeapons].sort((a, b) => {
      if (b.rarity !== a.rarity) return b.rarity - a.rarity;
      return a.name.localeCompare(b.name, "ko");
    });
  }, [filteredWeapons]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.subTitle}>ENDFIELD SUPPORT PLATFORM</div>

          <div style={styles.headerTopRow}>
            <div>
              <div style={styles.title}>WEAPONS</div>
              <div style={styles.desc}>무기 목록</div>
            </div>

            <div style={styles.headerButtonRow}>
              <Link href="/" style={styles.topLinkButton}>
                홈으로
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>검색</div>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>⌕</span>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="이름 검색"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>레어도</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={rarity === "all"}
                  label="전체"
                  onClick={() => setRarity("all")}
                />
                <FilterButton
                  active={rarity === 6}
                  label="6성"
                  onClick={() => setRarity(6)}
                  iconSrc={rarityIconMap[6]}
                />
                <FilterButton
                  active={rarity === 5}
                  label="5성"
                  onClick={() => setRarity(5)}
                  iconSrc={rarityIconMap[5]}
                />
                <FilterButton
                  active={rarity === 4}
                  label="4성"
                  onClick={() => setRarity(4)}
                  iconSrc={rarityIconMap[4]}
                />
                <FilterButton
                  active={rarity === 3}
                  label="3성"
                  onClick={() => setRarity(3)}
                  iconSrc={rarityIconMap[3]}
                />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>무기 타입</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={weaponType === "all"}
                  label="전체"
                  onClick={() => setWeaponType("all")}
                />
                <FilterButton
                  active={weaponType === "sword"}
                  label="한손검"
                  onClick={() => setWeaponType("sword")}
                  iconSrc={weaponIconMap.sword}
                />
                <FilterButton
                  active={weaponType === "greatsword"}
                  label="양손검"
                  onClick={() => setWeaponType("greatsword")}
                  iconSrc={weaponIconMap.greatsword}
                />
                <FilterButton
                  active={weaponType === "polearm"}
                  label="장병기"
                  onClick={() => setWeaponType("polearm")}
                  iconSrc={weaponIconMap.polearm}
                />
                <FilterButton
                  active={weaponType === "handcannon"}
                  label="권총"
                  onClick={() => setWeaponType("handcannon")}
                  iconSrc={weaponIconMap.handcannon}
                />
                <FilterButton
                  active={weaponType === "artsunit"}
                  label="아츠 유닛"
                  onClick={() => setWeaponType("artsunit")}
                  iconSrc={weaponIconMap.artsunit}
                />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>능력치</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={abilityFilter === "all"}
                  label="전체"
                  onClick={() => setAbilityFilter("all")}
                />
                <FilterButton
                  active={abilityFilter === "agility"}
                  label="민첩 증가"
                  onClick={() => setAbilityFilter("agility")}
                />
                <FilterButton
                  active={abilityFilter === "strength"}
                  label="힘 증가"
                  onClick={() => setAbilityFilter("strength")}
                />
                <FilterButton
                  active={abilityFilter === "will"}
                  label="의지 증가"
                  onClick={() => setAbilityFilter("will")}
                />
                <FilterButton
                  active={abilityFilter === "intelligence"}
                  label="지능 증가"
                  onClick={() => setAbilityFilter("intelligence")}
                />
                <FilterButton
                  active={abilityFilter === "mainStat"}
                  label="주요 능력치 증가"
                  onClick={() => setAbilityFilter("mainStat")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>속성</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={attributeFilter === "all"}
                  label="전체"
                  onClick={() => setAttributeFilter("all")}
                />
                <FilterButton
                  active={attributeFilter === "attack"}
                  label="공격력 증가"
                  onClick={() => setAttributeFilter("attack")}
                />
                <FilterButton
                  active={attributeFilter === "hp"}
                  label="생명력 증가"
                  onClick={() => setAttributeFilter("hp")}
                />
                <FilterButton
                  active={attributeFilter === "physical"}
                  label="물리 피해 증가"
                  onClick={() => setAttributeFilter("physical")}
                />
                <FilterButton
                  active={attributeFilter === "heat"}
                  label="열기 피해 증가"
                  onClick={() => setAttributeFilter("heat")}
                />
                <FilterButton
                  active={attributeFilter === "electric"}
                  label="전기 피해 증가"
                  onClick={() => setAttributeFilter("electric")}
                />
                <FilterButton
                  active={attributeFilter === "cryo"}
                  label="냉기 피해 증가"
                  onClick={() => setAttributeFilter("cryo")}
                />
                <FilterButton
                  active={attributeFilter === "nature"}
                  label="자연 피해 증가"
                  onClick={() => setAttributeFilter("nature")}
                />
                <FilterButton
                  active={attributeFilter === "critRate"}
                  label="치명타 확률 증가"
                  onClick={() => setAttributeFilter("critRate")}
                />
                <FilterButton
                  active={attributeFilter === "originiumArts"}
                  label="오리지늄 아츠 강도"
                  onClick={() => setAttributeFilter("originiumArts")}
                />
                <FilterButton
                  active={attributeFilter === "ultimateEfficiency"}
                  label="궁극기 충전 효율"
                  onClick={() => setAttributeFilter("ultimateEfficiency")}
                />
                <FilterButton
                  active={attributeFilter === "artsDamage"}
                  label="아츠 피해 증가"
                  onClick={() => setAttributeFilter("artsDamage")}
                />
                <FilterButton
                  active={attributeFilter === "healEfficiency"}
                  label="치유 효율 증가"
                  onClick={() => setAttributeFilter("healEfficiency")}
                />
              </div>
            </div>

            <div>
              <div style={styles.sectionTitle}>시리즈 스킬</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={seriesFilter === "all"}
                  label="전체"
                  onClick={() => setSeriesFilter("all")}
                />
                <FilterButton
                  active={seriesFilter === "heavyStrike"}
                  label="강공"
                  onClick={() => setSeriesFilter("heavyStrike")}
                />
                <FilterButton
                  active={seriesFilter === "suppression"}
                  label="억제"
                  onClick={() => setSeriesFilter("suppression")}
                />
                <FilterButton
                  active={seriesFilter === "pursuit"}
                  label="추격"
                  onClick={() => setSeriesFilter("pursuit")}
                />
                <FilterButton
                  active={seriesFilter === "crush"}
                  label="분쇄"
                  onClick={() => setSeriesFilter("crush")}
                />
                <FilterButton
                  active={seriesFilter === "morale"}
                  label="사기"
                  onClick={() => setSeriesFilter("morale")}
                />
                <FilterButton
                  active={seriesFilter === "technique"}
                  label="기예"
                  onClick={() => setSeriesFilter("technique")}
                />
                <FilterButton
                  active={seriesFilter === "brutality"}
                  label="잔혹"
                  onClick={() => setSeriesFilter("brutality")}
                />
                <FilterButton
                  active={seriesFilter === "pain"}
                  label="고통"
                  onClick={() => setSeriesFilter("pain")}
                />
                <FilterButton
                  active={seriesFilter === "medical"}
                  label="의료"
                  onClick={() => setSeriesFilter("medical")}
                />
                <FilterButton
                  active={seriesFilter === "fracture"}
                  label="골절"
                  onClick={() => setSeriesFilter("fracture")}
                />
                <FilterButton
                  active={seriesFilter === "discharge"}
                  label="방출"
                  onClick={() => setSeriesFilter("discharge")}
                />
                <FilterButton
                  active={seriesFilter === "darkness"}
                  label="어둠"
                  onClick={() => setSeriesFilter("darkness")}
                />
                <FilterButton
                  active={seriesFilter === "flow"}
                  label="흐름"
                  onClick={() => setSeriesFilter("flow")}
                />
                <FilterButton
                  active={seriesFilter === "efficiency"}
                  label="효율"
                  onClick={() => setSeriesFilter("efficiency")}
                />
              </div>
            </div>
          </aside>

          <main style={styles.content}>
            <div style={styles.toolbar}>
              <div style={styles.resultBar}>
                총{" "}
                <span style={{ color: "#ffcc4d", fontWeight: 700 }}>
                  {sortedWeapons.length}
                </span>
                개
              </div>
            </div>

            <div style={styles.grid}>
              {sortedWeapons.map((weapon) => (
                <WeaponCard key={weapon.slug} weapon={weapon} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}