"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import {
  weaponDetails,
  type SourceWeaponDetail,
} from "@/data/weapons-detail-data";

const rarityBorderMap: Record<number, string> = {
  6: "#ff8a1f",
  5: "#f0c94a",
  4: "#9a63ff",
  3: "#4fa3ff",
  2: "#36c46f",
  1: "#9ca3af",
};

const rarityIconMap: Record<number, string> = {
  6: "/icons/rarity/6star.webp",
  5: "/icons/rarity/5star.webp",
  4: "/icons/rarity/4star.webp",
  3: "/icons/rarity/3star.webp",
};

const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검",
  greatsword: "양손검",
  polearm: "장병기",
  handcannon: "권총",
  artsunit: "아츠 유닛",
};

const weaponTypeIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp",
  greatsword: "/icons/weapons/greatsword.webp",
  polearm: "/icons/weapons/polearm.webp",
  handcannon: "/icons/weapons/handcannon.webp",
  artsunit: "/icons/weapons/artsunit.webp",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,212,74,0.05), transparent 25%), radial-gradient(circle at 80% 80%, rgba(255,212,74,0.04), transparent 25%), #050505",
    color: "#ededed",
    padding: "24px 28px 40px",
  },
  shell: {
    width: "100%",
    maxWidth: "1840px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
    background: "#05070b",
    border: "1px solid rgba(255,196,74,0.14)",
    borderRadius: "24px",
    padding: "18px 20px",
    boxShadow: "0 18px 44px rgba(0,0,0,0.28)",
    overflow: "hidden",
  },
  subTitle: {
    fontSize: "11px",
    letterSpacing: "0.28em",
    color: "rgba(255,220,112,0.78)",
  },
  title: {
    marginTop: "8px",
    fontSize: "42px",
    fontWeight: 900,
    color: "#ffd24a",
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
    background: "rgba(255,212,74,0.08)",
    color: "#ffdc70",
    border: "1px solid rgba(255,212,74,0.35)",
    borderRadius: "14px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 800,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "280px minmax(0, 1fr)",
    gap: "28px",
    alignItems: "start",
  },
  sidebar: {
    width: "100%",
    background: "#05070b",
    border: "1px solid rgba(255,196,74,0.14)",
    borderRadius: "24px",
    padding: "16px",
    position: "sticky",
    top: "18px",
    boxShadow: "0 18px 44px rgba(0,0,0,0.28)",
    overflow: "hidden",
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
    color: "#ffd24a",
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
    background: "#090d14",
    color: "#fff",
    border: "1px solid rgba(255,196,74,0.16)",
    borderRadius: "14px",
    padding: "0 12px 0 34px",
    fontSize: "13px",
    outline: "none",
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
    padding: "12px 16px",
    background: "#05070b",
    border: "1px solid rgba(255,196,74,0.14)",
    borderRadius: "20px",
  },
  resultBar: {
    fontSize: "13px",
    color: "#9ca3af",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 150px))",
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
    width: "150px",
    height: "auto",
    background: "#090d14",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    borderRadius: "20px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.32)",
    transition:
      "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
  },
  imageWrap: {
    position: "relative",
    width: "150px",
    height: "170px",
    background: "#05070b",
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
    background: "#090d14",
    padding: "7px 5px 8px",
    borderTop: "1px solid rgba(255,196,74,0.10)",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  name: {
    fontSize: "15px",
    fontWeight: 900,
    color: "#ffdc70",
    lineHeight: 1.15,
  },
  enName: {
    marginTop: "4px",
    fontSize: "10px",
    color: "#cbd5e1",
    lineHeight: 1.2,
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "6px",
    alignContent: "flex-start",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "21px",
    padding: "2px 5px",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: 1.1,
    border: "1px solid rgba(255,196,74,0.18)",
    background: "rgba(255,212,74,0.06)",
    color: "#fff",
    gap: "4px",
    boxSizing: "border-box",
    maxWidth: "100%",
    whiteSpace: "normal",
    wordBreak: "keep-all",
    borderRadius: "999px",
  },
  badgeIconWrap: {
    position: "relative",
    width: "11px",
    height: "11px",
    flexShrink: 0,
  },
  seriesBadge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    maxWidth: "95px",
    minHeight: "21px",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: 800,
    lineHeight: 1.1,
    border: "1px solid rgba(255,196,74,0.18)",
    background: "rgba(255,212,74,0.06)",
    color: "#ffffff",
    borderRadius: "999px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  filterButton: {
    width: "100%",
    minHeight: "40px",
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "13px",
    background: "#090d14",
    color: "#d4d4d8",
    border: "1px solid rgba(255,196,74,0.14)",
    borderRadius: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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

function getWeaponImage(weapon: SourceWeaponDetail) {
  const anyWeapon = weapon as any;
  if (typeof anyWeapon.image === "string" && anyWeapon.image.trim())
    return anyWeapon.image;
  if (typeof anyWeapon.avatar === "string" && anyWeapon.avatar.trim())
    return anyWeapon.avatar;
  return `/weapons/${weapon.slug}.webp`;
}

function getWeaponRarity(weapon: SourceWeaponDetail) {
  return Number((weapon as any).rarity ?? (weapon as any).quality ?? 0);
}

function getWeaponType(weapon: SourceWeaponDetail) {
  return String((weapon as any).weaponType ?? (weapon as any).type ?? "");
}

function getWeaponTypeLabel(weapon: SourceWeaponDetail) {
  const type = getWeaponType(weapon);
  return (
    weaponTypeLabelMap[type] ??
    String((weapon as any).typeLabel ?? (weapon as any).category ?? type ?? "무기")
  );
}

function getWeaponSeriesRaw(weapon: SourceWeaponDetail) {
  return String(
    (weapon as any).series ??
      (weapon as any).seriesName ??
      (weapon as any).seriesSkill?.name ??
      "기타",
  ).trim();
}

function normalizeWeaponSeries(value: string) {
  const text = String(value ?? "").trim();
  if (!text) return "기타";
  return text.split("·")[0]?.trim() || text;
}

function getWeaponSeries(weapon: SourceWeaponDetail) {
  return normalizeWeaponSeries(getWeaponSeriesRaw(weapon));
}

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
          ? `1px solid ${borderColor ?? "rgba(255,212,74,0.55)"}`
          : `1px solid ${
              borderColor ? `${borderColor}55` : "rgba(255,196,74,0.14)"
            }`,
        background: active
          ? `linear-gradient(90deg, ${
              borderColor ? `${borderColor}22` : "rgba(255,212,74,0.14)"
            }, rgba(255,212,74,0.05))`
          : "#090d14",
        color: active ? "#ffdc70" : "#d4d4d8",
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
        background: bg ?? "rgba(255,212,74,0.06)",
        color,
        border: `1px solid ${borderColor ?? "rgba(255,196,74,0.18)"}`,
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

function WeaponCard({ weapon }: { weapon: SourceWeaponDetail }) {
  const rarity = getWeaponRarity(weapon);
  const type = getWeaponType(weapon);
  const series = getWeaponSeries(weapon);

  return (
    <Link href={`/weapons/${weapon.slug}`} style={styles.cardLink}>
      <div
        style={{
          ...styles.card,
          border: "1px solid rgba(255,196,74,0.16)",
          boxShadow: "0 14px 34px rgba(0,0,0,0.32)",
        }}
      >
        <div style={styles.imageWrap}>
          <Image
            src={getWeaponImage(weapon)}
            alt={weapon.name}
            fill
            sizes="150px"
            style={{ objectFit: "contain", padding: "12px" }}
          />
          <div style={styles.overlay} />
        </div>

        <div style={styles.info}>
          <div style={styles.name}>{weapon.name}</div>
          <div style={styles.enName}>{(weapon as any).enName ?? weapon.slug}</div>

          <div style={styles.badgeRow}>
            <Badge
              label={rarity ? `${rarity}성` : "-"}
              bg="rgba(255,212,74,0.06)"
              color="#ffffff"
              borderColor="rgba(255,196,74,0.18)"
              iconSrc={rarityIconMap[rarity]}
            />
            <Badge label={getWeaponTypeLabel(weapon)} iconSrc={weaponTypeIconMap[type]} />
          </div>

          <div style={styles.badgeRow}>
            <span title={series} style={styles.seriesBadge}>
              {series}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function WeaponsPage() {
  const [keyword, setKeyword] = useState("");
  const [rarity, setRarity] = useState<number | "all">("all");
  const [weaponType, setWeaponType] = useState<string | "all">("all");
  const [series, setSeries] = useState<string | "all">("all");

  const rarityOptions = useMemo(() => {
    return Array.from(new Set(weaponDetails.map(getWeaponRarity).filter(Boolean))).sort(
      (a, b) => b - a,
    );
  }, []);

  const weaponTypeOptions = useMemo(() => {
    return Array.from(new Set(weaponDetails.map(getWeaponType).filter(Boolean))).sort(
      (a, b) =>
        getWeaponTypeLabel({ ...(weaponDetails[0] as any), weaponType: a }).localeCompare(
          getWeaponTypeLabel({ ...(weaponDetails[0] as any), weaponType: b }),
          "ko",
        ),
    );
  }, []);

  const seriesOptions = useMemo(() => {
    return Array.from(new Set(weaponDetails.map(getWeaponSeries).filter(Boolean))).sort(
      (a, b) => a.localeCompare(b, "ko"),
    );
  }, []);

  const sortedWeapons = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    const uniqueWeapons = Array.from(
      new Map(weaponDetails.map((weapon) => [String(weapon.slug ?? weapon.name), weapon])).values(),
    );

    return uniqueWeapons
      .filter((weapon) => {
        const weaponRarity = getWeaponRarity(weapon);
        const type = getWeaponType(weapon);
        const weaponSeries = getWeaponSeries(weapon);
        const rawWeaponSeries = getWeaponSeriesRaw(weapon);
        const name = String(weapon.name ?? "").toLowerCase();
        const enName = String((weapon as any).enName ?? "").toLowerCase();
        const slug = String(weapon.slug ?? "").toLowerCase();

        const matchesKeyword =
          q === "" ||
          name.includes(q) ||
          enName.includes(q) ||
          slug.includes(q) ||
          weaponSeries.toLowerCase().includes(q) ||
          rawWeaponSeries.toLowerCase().includes(q);

        return (
          matchesKeyword &&
          (rarity === "all" || weaponRarity === rarity) &&
          (weaponType === "all" || type === weaponType) &&
          (series === "all" || weaponSeries === series)
        );
      })
      .sort((a, b) => {
        const rarityDiff = getWeaponRarity(b) - getWeaponRarity(a);
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name, "ko");
      });
  }, [keyword, rarity, weaponType, series]);

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
                  placeholder="무기 이름 검색"
                  autoComplete="off"
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
                {rarityOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={rarity === value}
                    label={`${value}성`}
                    onClick={() => setRarity(value)}
                    iconSrc={rarityIconMap[value]}
                    borderColor={rarityBorderMap[value]}
                  />
                ))}
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
                {weaponTypeOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={weaponType === value}
                    label={weaponTypeLabelMap[value] ?? value}
                    onClick={() => setWeaponType(value)}
                    iconSrc={weaponTypeIconMap[value]}
                  />
                ))}
              </div>
            </div>

            <div>
              <div style={styles.sectionTitle}>시리즈</div>
              <div style={styles.buttonList}>
                <FilterButton
                  active={series === "all"}
                  label="전체"
                  onClick={() => setSeries("all")}
                />
                {seriesOptions.map((value) => (
                  <FilterButton
                    key={value}
                    active={series === value}
                    label={value}
                    onClick={() => setSeries(value)}
                  />
                ))}
              </div>
            </div>
          </aside>

          <main style={styles.content}>
            <div style={styles.toolbar}>
              <div style={styles.resultBar}>
                총{" "}
                <span style={{ color: "#ffd24a", fontWeight: 700 }}>
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