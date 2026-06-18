import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  getWeaponDetailBySlug,
  getWeaponStatTags,
  weaponDetails,
  type WeaponRarity,
} from "@/data/weapons-detail-data";
import WeaponSkillsTabs from "./WeaponSkillsTabs";

// ===== 오퍼레이터 상세/목록과 통일한 디자인 토큰 =====
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

const rarityLabelMap: Record<WeaponRarity, string> = { 6: "6성", 5: "5성", 4: "4성", 3: "3성" };
const rarityIconMap: Record<WeaponRarity, string> = {
  3: "/icons/rarity/3star.webp",
  4: "/icons/rarity/4star.webp",
  5: "/icons/rarity/5star.webp",
  6: "/icons/rarity/6star.webp",
};
const weaponTypeLabelMap: Record<string, string> = {
  sword: "한손검", artsunit: "아츠 유닛", artsUnit: "아츠 유닛",
  greatsword: "양손검", polearm: "장병기", handcannon: "권총",
};
const weaponTypeIconMap: Record<string, string> = {
  sword: "/icons/weapons/sword.webp", artsunit: "/icons/weapons/artsunit.webp", artsUnit: "/icons/weapons/artsunit.webp",
  greatsword: "/icons/weapons/greatsword.webp", polearm: "/icons/weapons/polearm.webp", handcannon: "/icons/weapons/handcannon.webp",
};

const TABLE_LEVELS = [1, 20, 40, 60, 80, 90];

function materialIcon(name: string, icon?: string) {
  return icon || `/materials/${encodeURIComponent(name)}.webp`;
}

// 설명 내 수치(+12%, x1.5, 30 등) 노란색 강조.
function highlightNums(text: string): ReactNode {
  const matches = [...text.matchAll(/([+\-x×]?\s*\d+(?:\.\d+)?%?)/gi)];
  if (!matches.length) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  matches.forEach((m, i) => {
    const v = m[0];
    const s = m.index ?? 0;
    if (s > last) parts.push(text.slice(last, s));
    parts.push(<span key={i} className="font-black" style={{ color: ACCENT }}>{v.replace(/\s+/g, "")}</span>);
    last = s + v.length;
  });
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function SectionLabel({ en, action }: { en: string; action?: ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="h-4 w-1" style={{ background: PRIMARY }} />
      <span className="font-mono text-[13px] font-black uppercase tracking-[0.2em] text-white">{en}</span>
      <span className="ml-2 hidden h-px flex-1 bg-gradient-to-r from-ef-line to-transparent sm:block" />
      {action ? <span className="ml-auto">{action}</span> : null}
    </div>
  );
}

function Badge({ children, icon, tone = "muted" }: { children: ReactNode; icon?: string; tone?: "muted" | "accent" }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[11px] font-black uppercase tracking-wide"
      style={
        tone === "accent"
          ? { ...CUT_SM, borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }
          : { ...CUT_SM, borderColor: "#2a2a2a", background: "#0b0b0b", color: "#cfcfcf" }
      }
    >
      {icon ? <span className="relative h-3.5 w-3.5 shrink-0"><Image src={icon} alt="" fill sizes="14px" className="object-contain" /></span> : null}
      {children}
    </span>
  );
}

export function generateStaticParams() {
  return weaponDetails.map((weapon) => ({ slug: weapon.slug }));
}

export default async function WeaponDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const weapon = getWeaponDetailBySlug(slug);
  if (!weapon) notFound();

  const heroImage = `/weapons/${weapon.slug}.webp`;
  const typeLabel = weaponTypeLabelMap[weapon.weaponType] ?? weapon.weaponType;
  const typeIcon = weaponTypeIconMap[weapon.weaponType];
  const rarityIcon = rarityIconMap[weapon.rarity];

  const levelStats = weapon.levelStats ?? [];
  const sortedLevels = [...levelStats].sort((a, b) => a.level - b.level);
  const maxAttack = sortedLevels.length ? sortedLevels[sortedLevels.length - 1].attack : 0;
  const tableRows = TABLE_LEVELS.map((lv) => {
    const exact = sortedLevels.find((r) => r.level === lv);
    return { level: lv, attack: exact?.attack };
  }).filter((r) => r.attack !== undefined);

  const skills = weapon.skills ?? [];
  const breakthrough = [...(weapon.breakthrough ?? [])].sort((a, b) => a.stage - b.stage);
  const { attribute: attrStat, ability: abilityStat } = getWeaponStatTags(weapon);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto flex max-w-[1280px] items-center justify-between px-3 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Weapon File</span>
          <span className="hidden font-mono text-[11px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ID:${weapon.slug.toUpperCase()}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/weapons" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>목록</Link>
          <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>홈</Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-3 px-3 pb-16 sm:gap-4 sm:px-6">
        {/* ===== 요약 패널 — 좌 이미지 / 우 정보 (모바일: 이미지 위, 정보 아래) ===== */}
        <section className="overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
          <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY}, transparent 55%)` }} />
          <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[260px_minmax(0,1fr)] md:gap-5 md:p-5">
            {/* 이미지 — 정보보다 작게(최대 260px) */}
            <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden border border-ef-line bg-black md:mx-0 md:max-w-[260px]" style={CUT}>
              <Image src={heroImage} alt={weapon.name} fill priority sizes="(max-width:768px) 90vw, 320px" className="object-contain p-3" />
              <span className="pointer-events-none absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2" style={{ borderColor: `${PRIMARY}aa` }} />
              <span className="pointer-events-none absolute bottom-2 right-2 h-6 w-6 border-b-2 border-r-2" style={{ borderColor: `${PRIMARY}66` }} />
            </div>

            {/* 정보 */}
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ef-muted">{weapon.enName}</p>
              <h1 className="mt-1 break-keep text-2xl font-black leading-[0.95] tracking-tight text-white sm:text-4xl">{weapon.name}</h1>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge icon={rarityIcon} tone="accent">{rarityLabelMap[weapon.rarity]}</Badge>
              </div>

              {/* 정보 카드 — 무기 유형 → 능력치 → 속성 → 시리즈 순 */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  {typeIcon ? <span className="relative h-5 w-5 shrink-0"><Image src={typeIcon} alt="" fill sizes="20px" className="object-contain" /></span> : null}
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">무기 유형</span>
                    <span className="mt-0.5 block truncate text-sm font-black text-ef-ink">{typeLabel}</span>
                  </span>
                </div>
                <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">능력치</p>
                  <p className="mt-0.5 truncate text-sm font-black text-ef-ink">{abilityStat || "-"}</p>
                </div>
                <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">속성</p>
                  <p className="mt-0.5 truncate text-sm font-black" style={{ color: ACCENT }}>{attrStat || "-"}</p>
                </div>
                <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">시리즈</p>
                  <p className="mt-0.5 truncate text-sm font-black" style={{ color: PRIMARY }}>{weapon.series ?? "-"}</p>
                </div>
              </div>

              {weapon.summary || weapon.description ? (
                <p className="mt-3 break-keep text-xs leading-6 text-ef-muted">{weapon.summary || weapon.description}</p>
              ) : null}
            </div>
          </div>
        </section>

        {/* ===== 능력치 패널 — 무기 공격력 + 레벨별 표(1/20/40/60/80/90) ===== */}
        {tableRows.length ? (
          <section className="min-w-0">
            <SectionLabel en="Weapon Stats" />
            <div className="overflow-hidden border border-ef-line bg-ef-card2 p-3 sm:p-4" style={CUT}>
              {/* 공격력 / 무기 유형 / 능력치 / 속성 / 시리즈 — 5개 스탯 카드(압축) */}
              <div className="mb-2.5 grid grid-cols-2 gap-1.5 border-b border-ef-line pb-2.5 min-[520px]:grid-cols-3 lg:grid-cols-5">
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">공격력 · Lv.90</p>
                  <p className="font-mono text-xl font-black leading-tight sm:text-2xl" style={{ color: PRIMARY }}>{maxAttack}</p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">무기 유형</p>
                  <p className="flex items-center gap-1 break-keep text-sm font-black leading-tight text-ef-ink">
                    {typeIcon ? <span className="relative h-4 w-4 shrink-0"><Image src={typeIcon} alt="" fill sizes="16px" className="object-contain" /></span> : null}
                    {typeLabel}
                  </p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">능력치</p>
                  <p className="break-keep text-sm font-black leading-tight text-ef-ink">{abilityStat || "-"}</p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">속성</p>
                  <p className="break-keep text-sm font-black leading-tight" style={{ color: ACCENT }}>{attrStat || "-"}</p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">시리즈</p>
                  <p className="break-keep text-sm font-black leading-tight" style={{ color: PRIMARY }}>{weapon.series ?? "-"}</p>
                </div>
              </div>

              {/* 레벨별 능력치 표 */}
              <div className="overflow-hidden border border-ef-line" style={CUT_SM}>
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-black">
                      <th className="border-b border-ef-line px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>Lv</th>
                      <th className="border-b border-ef-line px-3 py-1.5 text-right font-mono text-[11px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>공격력</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, i) => (
                      <tr key={row.level} className={i % 2 ? "bg-ef-card" : "bg-ef-card2"}>
                        <td className="border-b border-ef-line/60 px-3 py-1 font-mono text-xs font-black text-ef-ink tabular-nums">{row.level}</td>
                        <td className="border-b border-ef-line/60 px-3 py-1 text-right font-mono text-sm font-black tabular-nums" style={{ color: ACCENT }}>{row.attack}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== 무기 스킬 패널 ===== */}
        {skills.length ? (
          <section className="min-w-0">
            <SectionLabel en="Weapon Skills" />
            {/* 탭 구조(클라이언트) — 선택된 스킬만 표시. 기본=시리즈 스킬. 동시 펼침 방지로 세로 공간 절약 */}
            <WeaponSkillsTabs skills={skills} />
          </section>
        ) : null}

        {/* ===== 돌파 패널 — 0~4단계, 기본 접힘. 0단계=기본 상태 ===== */}
        {breakthrough.length ? (
          <section className="min-w-0">
            <SectionLabel en="Breakthrough" />
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {breakthrough.map((stage) => {
                const isBase = stage.stage === 0;
                const hasMats = stage.materials.length > 0;
                return (
                  <details key={stage.stage} open={isBase} className="group overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex h-6 min-w-[42px] items-center justify-center border px-1.5 font-mono text-[11px] font-black" style={{ ...CUT_SM, borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>
                        {isBase ? "기본" : `T${stage.stage}`}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-black text-ef-ink">{isBase ? "기본 상태" : `${stage.stage}단계 돌파`}</span>
                        <span className="font-mono text-[11px] uppercase tracking-wide text-ef-muted">필요 Lv.{stage.requiredLevel}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] font-black text-ef-muted transition-transform group-open:rotate-180" style={{ color: PRIMARY }}>▼</span>
                    </summary>
                    <div className="border-t border-ef-line px-3 py-3">
                      {stage.bonuses.length ? (
                        <ul className="flex flex-col gap-1">
                          {stage.bonuses.map((b, i) => (
                            <li key={i} className="flex gap-2 break-keep text-xs leading-5 text-ef-muted">
                              <span className="mt-1 h-1 w-1 shrink-0" style={{ background: PRIMARY }} />
                              <span>{highlightNums(b)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {hasMats ? (
                        <div className="mt-2.5 grid grid-cols-2 gap-1.5 border-t border-ef-line pt-2.5 min-[420px]:grid-cols-3 lg:grid-cols-4">
                          {stage.materials.map((m, i) => (
                            <div key={i} className="flex items-center gap-1.5 border border-ef-line bg-ef-card px-1.5 py-1" style={CUT_SM}>
                              <span className="relative h-8 w-8 shrink-0 overflow-hidden border border-ef-line bg-black">
                                <Image src={materialIcon(m.name, m.icon)} alt="" fill sizes="32px" className="object-contain p-0.5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[11px] font-bold text-ef-ink">{m.name}</span>
                                <span className="block font-mono text-[11px] font-black" style={{ color: PRIMARY }}>×{m.count}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
