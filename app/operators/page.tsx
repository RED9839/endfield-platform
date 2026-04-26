"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import {
  operatorDetails,
  type OperatorDetail,
  type OperatorRarity,
  type OperatorElement,
  type OperatorClass,
  type WeaponType,
} from "@/data/operators-detail-data";

const elementLabelMap: Record<OperatorElement, string> = {
  physical: "물리",
  cryo: "냉기",
  heat: "열기",
  nature: "자연",
  electric: "전기",
};

const classLabelMap: Record<OperatorClass, string> = {
  vanguard: "뱅가드",
  guard: "가드",
  defender: "디펜더",
  supporter: "서포터",
  caster: "캐스터",
  striker: "스트라이커",
};

const weaponLabelMap: Record<WeaponType, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const rarityBorderMap: Record<OperatorRarity, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
};

const rarityIconMap: Record<OperatorRarity, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
};

const elementIconMap: Record<OperatorElement, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};

const classIconMap: Record<OperatorClass, string> = {
  vanguard: "/icons/classes/vanguard.webp",
  guard: "/icons/classes/guard.webp",
  defender: "/icons/classes/defender.webp",
  supporter: "/icons/classes/supporter.webp",
  caster: "/icons/classes/caster.webp",
  striker: "/icons/classes/striker.webp",
};

const weaponIconMap: Record<WeaponType, string> = {
  sword: "/icons/weapons/sword.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
  artsunit: "/icons/weapons/artsunit.webp",
};

const elementColorMap: Record<OperatorElement, string> = {
  physical: "#808080",
  cryo: "#20c0c0",
  heat: "#f06040",
  nature: "#90d020",
  electric: "#f0b000",
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
    height: "356px",
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
    height: "228px",
    background: "#000000",
    overflow: "hidden",
    flexShrink: 0,
  },
  adminLayer: {
    position: "absolute",
    inset: 0,
  },
  adminLeft: {
    position: "absolute",
    inset: 0,
    clipPath: "polygon(0 0, 62% 0, 42% 100%, 0 100%)",
  },
  adminRight: {
    position: "absolute",
    inset: 0,
    clipPath: "polygon(58% 0, 100% 0, 100% 100%, 38% 100%)",
  },
  adminDiagonalLine: {
    position: "absolute",
    top: "-20%",
    left: "50%",
    width: "2px",
    height: "150%",
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 0 10px rgba(255,255,255,0.5)",
    transform: "translateX(-50%) rotate(26deg)",
    transformOrigin: "center",
    pointerEvents: "none",
  },
  adminGlow: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0), rgba(255,255,255,0.04))",
    pointerEvents: "none",
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
    padding: "9px 9px 8px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  },
  name: {
    fontSize: "18px",
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.15,
    minHeight: "22px",
  },
  enName: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#cbd5e1",
    lineHeight: 1.2,
    minHeight: "15px",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "7px",
    minHeight: "24px",
    alignContent: "flex-start",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
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
    maxWidth: "100%",
    whiteSpace: "normal",
    wordBreak: "keep-all",
    clipPath: buttonClip,
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
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.filterButton,
        border: active
          ? `1px solid ${borderColor ?? "#f7a600"}`
          : `1px solid ${borderColor ?? "#3f3f46"}`,
        background: active
          ? `linear-gradient(90deg, ${borderColor ? `${borderColor}26` : "rgba(247,166,0,0.18)"}, rgba(247,166,0,0.08))`
          : "#000000",
        color: active ? "#ffd873" : "#d4d4d8",
      }}
    >
      {iconSrc ? (
        <span style={styles.filterIconWrap}>
          <Image src={iconSrc} alt="" fill sizes="16px" style={{ objectFit: "contain" }} />
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
  color = "#fff",
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
        border: `1px solid ${borderColor ?? "#444"}`,
      }}
    >
      {iconSrc ? (
        <span style={styles.badgeIconWrap}>
          <Image src={iconSrc} alt="" fill sizes="11px" style={{ objectFit: "contain" }} />
        </span>
      ) : null}
      <span>{label}</span>
    </span>
  );
}

function OperatorCard({
  operator,
}: {
  operator: OperatorDetail & {
    avatarSecondary?: string;
  };
}) {
  const isAdminSplit =
    operator.slug === "endministrator" && !!operator.avatarSecondary;

  const elementBorder = elementColorMap[operator.element];

  return (
    <Link href={`/operators/${operator.slug}`} style={styles.cardLink}>
      <div
        style={{
          ...styles.card,
          border: `2px solid ${rarityBorderMap[operator.rarity]}`,
        }}
      >
        <div style={styles.imageWrap}>
          {isAdminSplit ? (
            <>
              <div style={styles.adminLeft}>
                <div style={styles.adminLayer}>
                  <Image
                    src={operator.avatar}
                    alt={`${operator.name} left`}
                    fill
                    sizes="168px"
                    style={{ objectFit: "cover", objectPosition: "left center" }}
                  />
                </div>
              </div>

              <div style={styles.adminRight}>
                <div style={styles.adminLayer}>
                  <Image
                    src={operator.avatarSecondary!}
                    alt={`${operator.name} right`}
                    fill
                    sizes="168px"
                    style={{ objectFit: "cover", objectPosition: "right center" }}
                  />
                </div>
              </div>

              <div style={styles.adminDiagonalLine} />
              <div style={styles.adminGlow} />
            </>
          ) : (
            <Image
              src={operator.avatar}
              alt={operator.name}
              fill
              sizes="168px"
              style={{ objectFit: "cover" }}
            />
          )}

          <div style={styles.overlay} />
        </div>

        <div style={styles.info}>
          <div style={styles.name}>{operator.name}</div>
          <div style={styles.enName}>{operator.enName}</div>

          <div style={styles.badgeRow}>
            <Badge
              label={`${operator.rarity}성`}
              bg="#000000"
              color="#ffffff"
              borderColor="#444"
              iconSrc={rarityIconMap[operator.rarity]}
            />
            <Badge
              label={classLabelMap[operator.class]}
              iconSrc={classIconMap[operator.class]}
            />
          </div>

          <div style={styles.badgeRow}>
            <Badge
              label={elementLabelMap[operator.element]}
              iconSrc={elementIconMap[operator.element]}
              bg="#000000"
              color="#ffffff"
              borderColor={elementBorder}
            />
            <Badge
              label={weaponLabelMap[operator.weapon]}
              iconSrc={weaponIconMap[operator.weapon]}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function OperatorsPage() {
  const [keyword, setKeyword] = useState("");
  const [rarity, setRarity] = useState<OperatorRarity | "all">("all");
  const [element, setElement] = useState<OperatorElement | "all">("all");
  const [operatorClass, setOperatorClass] = useState<OperatorClass | "all">("all");
  const [weapon, setWeapon] = useState<WeaponType | "all">("all");

  const filteredOperators = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return operatorDetails.filter((operator) => {
      const matchesKeyword =
        q === "" ||
        operator.name.toLowerCase().includes(q) ||
        operator.enName.toLowerCase().includes(q);

      return (
        matchesKeyword &&
        (rarity === "all" || operator.rarity === rarity) &&
        (element === "all" || operator.element === element) &&
        (operatorClass === "all" || operator.class === operatorClass) &&
        (weapon === "all" || operator.weapon === weapon)
      );
    });
  }, [keyword, rarity, element, operatorClass, weapon]);

  const sortedOperators = useMemo(() => {
    return [...filteredOperators].sort((a, b) => {
      if (b.rarity !== a.rarity) return b.rarity - a.rarity;
      return a.name.localeCompare(b.name, "ko");
    });
  }, [filteredOperators]);

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.subTitle}>ENDFIELD SUPPORT PLATFORM</div>

          <div style={styles.headerTopRow}>
            <div>
              <div style={styles.title}>OPERATORS</div>
              <div style={styles.desc}>오퍼레이터 목록</div>
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
                <FilterButton active={rarity === "all"} label="전체" onClick={() => setRarity("all")} />
                <FilterButton active={rarity === 6} label="6성" onClick={() => setRarity(6)} iconSrc={rarityIconMap[6]} />
                <FilterButton active={rarity === 5} label="5성" onClick={() => setRarity(5)} iconSrc={rarityIconMap[5]} />
                <FilterButton active={rarity === 4} label="4성" onClick={() => setRarity(4)} iconSrc={rarityIconMap[4]} />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>속성</div>
              <div style={styles.buttonList}>
                <FilterButton active={element === "all"} label="전체" onClick={() => setElement("all")} />
                <FilterButton active={element === "physical"} label="물리" onClick={() => setElement("physical")} iconSrc={elementIconMap.physical} borderColor={elementColorMap.physical} />
                <FilterButton active={element === "cryo"} label="냉기" onClick={() => setElement("cryo")} iconSrc={elementIconMap.cryo} borderColor={elementColorMap.cryo} />
                <FilterButton active={element === "heat"} label="열기" onClick={() => setElement("heat")} iconSrc={elementIconMap.heat} borderColor={elementColorMap.heat} />
                <FilterButton active={element === "nature"} label="자연" onClick={() => setElement("nature")} iconSrc={elementIconMap.nature} borderColor={elementColorMap.nature} />
                <FilterButton active={element === "electric"} label="전기" onClick={() => setElement("electric")} iconSrc={elementIconMap.electric} borderColor={elementColorMap.electric} />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <div style={styles.sectionTitle}>클래스</div>
              <div style={styles.buttonList}>
                <FilterButton active={operatorClass === "all"} label="전체" onClick={() => setOperatorClass("all")} />
                <FilterButton active={operatorClass === "vanguard"} label="뱅가드" onClick={() => setOperatorClass("vanguard")} iconSrc={classIconMap.vanguard} />
                <FilterButton active={operatorClass === "guard"} label="가드" onClick={() => setOperatorClass("guard")} iconSrc={classIconMap.guard} />
                <FilterButton active={operatorClass === "defender"} label="디펜더" onClick={() => setOperatorClass("defender")} iconSrc={classIconMap.defender} />
                <FilterButton active={operatorClass === "supporter"} label="서포터" onClick={() => setOperatorClass("supporter")} iconSrc={classIconMap.supporter} />
                <FilterButton active={operatorClass === "caster"} label="캐스터" onClick={() => setOperatorClass("caster")} iconSrc={classIconMap.caster} />
                <FilterButton active={operatorClass === "striker"} label="스트라이커" onClick={() => setOperatorClass("striker")} iconSrc={classIconMap.striker} />
              </div>
            </div>

            <div>
              <div style={styles.sectionTitle}>무기</div>
              <div style={styles.buttonList}>
                <FilterButton active={weapon === "all"} label="전체" onClick={() => setWeapon("all")} />
                <FilterButton active={weapon === "sword"} label="한손검" onClick={() => setWeapon("sword")} iconSrc={weaponIconMap.sword} />
                <FilterButton active={weapon === "greatsword"} label="양손검" onClick={() => setWeapon("greatsword")} iconSrc={weaponIconMap.greatsword} />
                <FilterButton active={weapon === "polearm"} label="장병기" onClick={() => setWeapon("polearm")} iconSrc={weaponIconMap.polearm} />
                <FilterButton active={weapon === "handcannon"} label="권총" onClick={() => setWeapon("handcannon")} iconSrc={weaponIconMap.handcannon} />
                <FilterButton active={weapon === "artsunit"} label="아츠 유닛" onClick={() => setWeapon("artsunit")} iconSrc={weaponIconMap.artsunit} />
              </div>
            </div>
          </aside>

          <main style={styles.content}>
            <div style={styles.toolbar}>
              <div style={styles.resultBar}>
                총 <span style={{ color: "#ffcc4d", fontWeight: 700 }}>{sortedOperators.length}</span>명
              </div>
            </div>

            <div style={styles.grid}>
              {sortedOperators.map((operator) => (
                <OperatorCard
                  key={operator.slug}
                  operator={operator as OperatorDetail & { avatarSecondary?: string }}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}