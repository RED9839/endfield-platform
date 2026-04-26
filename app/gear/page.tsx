"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import { gearDetails } from "@/data/gear-detail-data";
import type {
  GearCategory,
  GearDetail,
  GearLevel,
  GearQuality,
  GearSetName,
  GearAbilityKey,
  GearAttributeKey,
} from "@/data/gear-types";

const categoryLabelMap: Record<GearCategory, string> = {
  armor: "방어구",
  gloves: "보호 장갑",
  kit: "부품",
};

const categoryOrderMap: Record<GearCategory, number> = {
  armor: 0,
  gloves: 1,
  kit: 2,
};

const qualityColorMap: Record<GearQuality, string> = {
  5: "#ffcc4d",
  4: "#a855f7",
  3: "#38bdf8",
  2: "#84cc16",
  1: "#9ca3af",
};

const qualityLabelMap: Record<GearQuality, string> = {
  5: "노란색 품질",
  4: "보라색 품질",
  3: "파란색 품질",
  2: "초록색 품질",
  1: "회색 품질",
};

const categoryIconMap: Record<GearCategory, string> = {
  armor: "/icons/gear/armor.webp",
  gloves: "/icons/gear/gloves.webp",
  kit: "/icons/gear/kit.webp",
};

const setTypeOptions: GearSetName[] = [
  "개척",
  "응룡 50식",
  "본 크러셔",
  "조류의 물결",
  "M. I. 경찰용",
  "열 작업용",
  "생체 보조",
  "검술사",
  "경량 초자연",
  "펄스식",
  "식양의 숨결",
  "순행 전달자",
  "아부레이의 메아리",
  "중장갑 전달자",
  "재앙 방호",
  "침식 방호",
  "침식 차단",
  "통합 중량형 모델",
  "통합 경량형 모델",
  "세트 없음",
];

const levelOptions: GearLevel[] = [70, 50, 36, 28, 20, 10];

const abilityOptions: Array<{ key: GearAbilityKey; label: string }> = [
  { key: "strength", label: "힘" },
  { key: "agility", label: "민첩" },
  { key: "intelligence", label: "지능" },
  { key: "will", label: "의지" },
];

const attributeOptions: Array<{ key: GearAttributeKey; label: string }> = [
  { key: "attack", label: "공격력" },
  { key: "hp", label: "생명력" },
  { key: "critRate", label: "치명타 확률" },
  { key: "originiumArts", label: "오리지늄 아츠 강도" },
  { key: "healEfficiency", label: "치유 효율 보너스" },
  { key: "physicalDamage", label: "물리 피해 보너스" },
  { key: "ultimateEfficiency", label: "궁극기 충전 효율" },
  { key: "normalAttack", label: "일반 공격 피해 보너스" },
  { key: "skillDamage", label: "배틀 스킬 피해 보너스" },
  { key: "comboSkillDamage", label: "연계 스킬 피해 보너스" },
  { key: "ultimateDamage", label: "궁극기 피해 보너스" },
  { key: "unbalancedTargetDamage", label: "불균형 목표에 주는 피해 보너스" },
  { key: "mainStat", label: "주요 능력치" },
  { key: "artsDamage", label: "아츠 피해 보너스" },
  { key: "cryoElectricDamage", label: "냉기와 전기 피해 보너스" },
  { key: "damageReduction", label: "모든 피해 감소" },
  { key: "subStat", label: "보조 능력치" },
  { key: "allSkillDamage", label: "모든 스킬 피해 보너스" },
  { key: "heatNatureDamage", label: "열기와 자연 피해 보너스" },
];

const panelClip: CSSProperties["clipPath"] =
  "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)";

const buttonClip: CSSProperties["clipPath"] =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#000000",
    color: "#ffffff",
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
    color: "#ffcc4d",
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
    color: "#ffffff",
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
  gridOuter: {
    width: "100%",
    maxWidth: "1500px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(168px, 168px))",
    gap: "14px",
    alignItems: "start",
    justifyContent: "start",
    padding: "2px 4px 0",
  },
  emptyState: {
    minHeight: "240px",
    border: "1px solid rgba(247,166,0,0.18)",
    background: "#05070b",
    clipPath: panelClip,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: "14px",
    textAlign: "center",
    padding: "24px",
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  card: {
    width: "168px",
    height: "370px",
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
    background: "rgba(0,0,0,0.16)",
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
    color: "#ffffff",
    lineHeight: 1.15,
    minHeight: "40px",
    maxHeight: "40px",
    overflow: "hidden",
    wordBreak: "keep-all",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  enName: {
    marginTop: "3px",
    fontSize: "11px",
    color: "#cbd5e1",
    lineHeight: 1.2,
    minHeight: "26px",
    maxHeight: "26px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word",
  },
  cardBadgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "6px",
    minHeight: "24px",
    maxHeight: "48px",
    alignContent: "flex-start",
    overflow: "hidden",
  },
  cardSingleRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "4px",
    minHeight: "24px",
    maxHeight: "24px",
    alignContent: "flex-start",
    overflow: "hidden",
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
    border: "1px solid #444444",
    background: "#000000",
    color: "#ffffff",
    gap: "4px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
  borderColor,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  iconSrc?: string;
  borderColor?: string;
}) {
  const resolvedBorderColor = borderColor;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.filterButton,
        border: active
          ? `1px solid ${resolvedBorderColor ?? "#f7a600"}`
          : `1px solid ${resolvedBorderColor ?? "#3f3f46"}`,
        background: active ? "rgba(247,166,0,0.12)" : "#000000",
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
  bg,
  color = "#ffffff",
  borderColor,
}: {
  label: string;
  iconSrc?: string;
  bg?: string;
  color?: string;
  borderColor?: string;
}) {
  return (
    <span
      style={{
        ...styles.badge,
        background: bg ?? "#000000",
        color,
        border: `1px solid ${borderColor ?? "#444444"}`,
      }}
      title={label}
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

function getPrimaryAttributeText(item: GearDetail) {
  if (!item.attributeTypes || item.attributeTypes.length === 0) return "-";

  const match = attributeOptions.find((option) =>
    item.attributeTypes.includes(option.key)
  );

  return match?.label ?? item.attribute.label ?? "-";
}

function GearCard({ item }: { item: GearDetail }) {
  const qualityColor = qualityColorMap[item.quality];

  return (
    <Link href={`/gear/${item.slug}`} style={styles.cardLink}>
      <div
        style={{
          ...styles.card,
          border: `2px solid ${qualityColor}`,
        }}
      >
        <div style={styles.imageWrap}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="168px"
            style={{ objectFit: "cover" }}
          />
          <div style={styles.overlay} />
        </div>

        <div style={styles.info}>
          <div style={styles.name}>{item.name}</div>
          <div style={styles.enName}>{item.enName}</div>

          <div style={styles.cardBadgeRow}>
            <Badge
              label={`${categoryLabelMap[item.category]} · Lv.${item.level}`}
              borderColor={qualityColor}
            />
            <Badge label={item.ability1.label} />
            {item.ability2 ? <Badge label={item.ability2.label} /> : null}
          </div>

          <div style={styles.cardSingleRow}>
            <Badge
              label={getPrimaryAttributeText(item)}
              borderColor={qualityColor}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function GearPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<GearCategory | "all">("all");
  const [setName, setSetName] = useState<GearSetName | "all">("all");
  const [attributeFilter, setAttributeFilter] =
    useState<GearAttributeKey | "all">("all");
  const [abilityFilter, setAbilityFilter] =
    useState<GearAbilityKey | "all">("all");
  const [quality, setQuality] = useState<GearQuality | "all">("all");
  const [level, setLevel] = useState<GearLevel | "all">("all");

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return gearDetails.filter((item) => {
      const matchesKeyword =
        q === "" ||
        item.name.toLowerCase().includes(q) ||
        item.enName.toLowerCase().includes(q) ||
        item.setName.toLowerCase().includes(q);

      const matchesCategory = category === "all" || item.category === category;
      const matchesSet = setName === "all" || item.setName === setName;
      const matchesAttribute =
        attributeFilter === "all" ||
        item.attributeTypes.includes(attributeFilter);
      const matchesAbility =
        abilityFilter === "all" || item.abilityTypes.includes(abilityFilter);
      const matchesQuality = quality === "all" || item.quality === quality;
      const matchesLevel = level === "all" || item.level === level;

      return (
        matchesKeyword &&
        matchesCategory &&
        matchesSet &&
        matchesAttribute &&
        matchesAbility &&
        matchesQuality &&
        matchesLevel
      );
    });
  }, [keyword, category, setName, attributeFilter, abilityFilter, quality, level]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (b.quality !== a.quality) return b.quality - a.quality;
      if (categoryOrderMap[a.category] !== categoryOrderMap[b.category]) {
        return categoryOrderMap[a.category] - categoryOrderMap[b.category];
      }
      const setCompare = a.setName.localeCompare(b.setName, "ko");
      if (setCompare !== 0) return setCompare;
      if (b.level !== a.level) return b.level - a.level;
      return a.name.localeCompare(b.name, "ko");
    });
  }, [filteredItems]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.subTitle}>ENDFIELD SUPPORT PLATFORM</div>

          <div style={styles.headerTopRow}>
            <div>
              <div style={styles.title}>GEAR</div>
              <div style={styles.desc}>Gear List</div>
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
                  placeholder="이름 / 세트 검색"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>장비 유형</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={category === "all"}
                  label="전체"
                  onClick={() => setCategory("all")}
                />
                <FilterButton
                  active={category === "armor"}
                  label="방어구"
                  iconSrc={categoryIconMap.armor}
                  onClick={() => setCategory("armor")}
                />
                <FilterButton
                  active={category === "gloves"}
                  label="보호 장갑"
                  iconSrc={categoryIconMap.gloves}
                  onClick={() => setCategory("gloves")}
                />
                <FilterButton
                  active={category === "kit"}
                  label="부품"
                  iconSrc={categoryIconMap.kit}
                  onClick={() => setCategory("kit")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>세트 유형</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={setName === "all"}
                  label="전체"
                  onClick={() => setSetName("all")}
                />
                {setTypeOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={setName === value}
                    label={value}
                    onClick={() => setSetName(value)}
                  />
                ))}
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
                {attributeOptions.map((option) => (
                  <FilterButton
                    key={option.key}
                    active={attributeFilter === option.key}
                    label={option.label}
                    onClick={() => setAttributeFilter(option.key)}
                  />
                ))}
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
                {abilityOptions.map((option) => (
                  <FilterButton
                    key={option.key}
                    active={abilityFilter === option.key}
                    label={option.label}
                    onClick={() => setAbilityFilter(option.key)}
                  />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>품질</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={quality === "all"}
                  label="전체"
                  onClick={() => setQuality("all")}
                />
                {[5, 4, 3, 2, 1].map((value) => (
                  <FilterButton
                    key={value}
                    active={quality === value}
                    label={qualityLabelMap[value as GearQuality]}
                    borderColor={qualityColorMap[value as GearQuality]}
                    onClick={() => setQuality(value as GearQuality)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div style={styles.sectionTitle}>장비 레벨</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={level === "all"}
                  label="전체"
                  onClick={() => setLevel("all")}
                />
                {levelOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={level === value}
                    label={`Lv. ${value}`}
                    onClick={() => setLevel(value)}
                  />
                ))}
              </div>
            </div>
          </aside>

          <main style={styles.content}>
            <div style={styles.toolbar}>
              <div style={styles.resultBar}>
                총{" "}
                <span style={{ color: "#ffcc4d", fontWeight: 700 }}>
                  {sortedItems.length}
                </span>
                개
              </div>
            </div>

            {sortedItems.length > 0 ? (
              <div style={styles.gridOuter}>
                <div style={styles.grid}>
                  {sortedItems.map((item) => (
                    <GearCard key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                등록된 Gear 데이터가 없습니다.
                <br />
                gear-detail-data.ts에 Gear를 추가하면 여기에 표시됩니다.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}