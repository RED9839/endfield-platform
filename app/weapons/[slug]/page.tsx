import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  getWeaponDetailBySlug,
  weaponDetails,
  type WeaponRarity,
} from "@/data/weapons-detail-data";
import { operatorSummaries } from "@/data/operators-summary-data";

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

// 스킬 분류 라벨 — 오퍼레이터 톤에 맞춰 표기 통일.
const skillTypeDisplayMap: Record<string, string> = {
  능력치: "무기 효과",
  속성: "속성 효과",
  "시리즈 스킬": "시리즈 스킬",
};

// 사용 오퍼레이터 카드용 — 속성/클래스 라벨·색.
const elementIconMap: Record<string, string> = {
  physical: "/icons/elements/physical.webp",
  cryo: "/icons/elements/cryo.webp",
  heat: "/icons/elements/heat.webp",
  nature: "/icons/elements/nature.webp",
  electric: "/icons/elements/electric.webp",
};
const classIconMap: Record<string, string> = {
  vanguard: "/icons/classes/vanguard.webp",
  guard: "/icons/classes/guard.webp",
  defender: "/icons/classes/defender.webp",
  supporter: "/icons/classes/supporter.webp",
  caster: "/icons/classes/caster.webp",
  striker: "/icons/classes/striker.webp",
};
const classLabelMap: Record<string, string> = {
  vanguard: "뱅가드", guard: "가드", defender: "디펜더",
  supporter: "서포터", caster: "캐스터", striker: "스트라이커",
};

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
      className="inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-wide"
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
  // 사용 오퍼레이터 — 무기→오퍼레이터 직접 연결 데이터가 없어 동일 무기 유형으로 연결(없으면 섹션 숨김).
  const relatedOperators = operatorSummaries
    .filter((o) => o.weapon === weapon.weaponType)
    .sort((a, b) => b.rarity - a.rarity);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto flex max-w-[1280px] items-center justify-between px-3 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ef-muted">Weapon File</span>
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ID:${weapon.slug.toUpperCase()}`}</span>
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

              {/* 정보 카드 — 주/부 능력치 + 무기 유형 + 시리즈(뱃지 → 카드로 존재감 강화) */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">주 능력치</p>
                  <p className="mt-0.5 truncate text-sm font-black" style={{ color: ACCENT }}>{weapon.mainStatLabel ?? "-"}</p>
                </div>
                <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">부 능력치</p>
                  <p className="mt-0.5 truncate text-sm font-black text-ef-ink">{weapon.subStatLabel ?? "-"}</p>
                </div>
                <div className="flex items-center gap-2 border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  {typeIcon ? <span className="relative h-5 w-5 shrink-0"><Image src={typeIcon} alt="" fill sizes="20px" className="object-contain" /></span> : null}
                  <span className="min-w-0">
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">무기 유형</span>
                    <span className="mt-0.5 block truncate text-sm font-black text-ef-ink">{typeLabel}</span>
                  </span>
                </div>
                <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">시리즈</p>
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
              {/* 공격력 / 주 / 부 / 무기 유형 / 시리즈 — 5개 스탯 카드(압축) */}
              <div className="mb-2.5 grid grid-cols-2 gap-1.5 border-b border-ef-line pb-2.5 min-[520px]:grid-cols-3 lg:grid-cols-5">
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">공격력 · Lv.90</p>
                  <p className="font-mono text-xl font-black leading-tight sm:text-2xl" style={{ color: PRIMARY }}>{maxAttack}</p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">주 능력치</p>
                  <p className="break-keep text-sm font-black leading-tight" style={{ color: ACCENT }}>{weapon.mainStatLabel ?? "-"}</p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">부 능력치</p>
                  <p className="break-keep text-sm font-black leading-tight text-ef-ink">{weapon.subStatLabel ?? "-"}</p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">무기 유형</p>
                  <p className="flex items-center gap-1 break-keep text-sm font-black leading-tight text-ef-ink">
                    {typeIcon ? <span className="relative h-4 w-4 shrink-0"><Image src={typeIcon} alt="" fill sizes="16px" className="object-contain" /></span> : null}
                    {typeLabel}
                  </p>
                </div>
                <div className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">시리즈</p>
                  <p className="break-keep text-sm font-black leading-tight" style={{ color: PRIMARY }}>{weapon.series ?? "-"}</p>
                </div>
              </div>

              {/* 레벨별 능력치 표 */}
              <div className="overflow-hidden border border-ef-line" style={CUT_SM}>
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-black">
                      <th className="border-b border-ef-line px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>Lv</th>
                      <th className="border-b border-ef-line px-3 py-1.5 text-right font-mono text-[10px] font-black uppercase tracking-wide" style={{ color: PRIMARY }}>공격력</th>
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
            {/* items-start: 카드가 내용 길이에 맞춰 자연 높이 → 단순/시리즈 카드 간 빈 공간·불균형 제거 */}
            <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-2">
              {skills.map((skill) => {
                const levelValues = skill.levelValues ?? [];
                const lastDesc = [...levelValues].reverse().find((l) => l.description)?.description?.trim() ?? "";
                const effect = (skill.description?.trim() || "") || ((lastDesc.includes("\n") || lastDesc.length > 24) ? lastDesc : "");
                const ranks = levelValues
                  .map((lv) => ({ rank: lv.rank, value: lv.stats?.[0]?.value ?? (lv.description?.match(/[+\-]?\d+(?:\.\d+)?%?/)?.[0] ?? "") }))
                  .filter((r) => r.value !== "");
                const compareRows = (skill.compareRows ?? []).filter((row) => row.values?.length);
                const maxStats = ([...levelValues].reverse().find((l) => l.stats?.length)?.stats ?? []).filter((s) => s.value !== undefined && s.value !== null && String(s.value).trim() !== "");
                const finalValue = ranks.length ? ranks[ranks.length - 1].value : "";
                const isSeries = compareRows.length > 1 || maxStats.length > 1;
                // 효과 정보 셀 — 시리즈: 최대랭크 라벨별 수치 / 단순: 효과 대상 + 최종 수치 (데이터 기반, 생성 없음)
                const infoCells = isSeries
                  ? maxStats.map((s) => ({ label: s.label, value: String(s.value) }))
                  : [
                      ...((skill.meta?.[0]?.value != null && String(skill.meta[0].value).trim() !== "") ? [{ label: "효과 대상", value: String(skill.meta[0].value) }] : []),
                      ...(finalValue ? [{ label: "최종 수치", value: String(finalValue) }] : []),
                    ];
                // 메타 텍스트 행(시리즈 보조: 속성/시리즈 등) — 시리즈 카드에서만, 수치 셀과 중복 방지
                const metaRows = isSeries ? (skill.meta ?? []).filter((m) => String(m.value).trim() !== "") : [];
                return (
                  <div key={skill.key} className="flex flex-col border border-ef-line bg-ef-card2 p-2.5 sm:p-3" style={CUT}>
                    <div className="flex items-center gap-2.5">
                      {skill.icon ? <span className="relative h-10 w-10 shrink-0 overflow-hidden border border-ef-line bg-black"><Image src={skill.icon} alt="" fill sizes="40px" className="object-contain p-1" /></span> : null}
                      <div className="min-w-0">
                        {skill.typeLabel ? <span className="inline-flex items-center border px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wide" style={{ borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>{skillTypeDisplayMap[skill.typeLabel] ?? skill.typeLabel}</span> : null}
                        <p className="mt-1 break-keep text-sm font-black text-ef-ink">{skill.name}</p>
                      </div>
                    </div>

                    {/* 효과 설명(프로즈) — 데이터 있을 때만 */}
                    {effect ? (
                      <div className="mt-2.5">
                        <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">효과 설명</p>
                        <p className="whitespace-pre-line break-keep text-[13px] leading-6 text-ef-muted">{highlightNums(effect)}</p>
                      </div>
                    ) : null}

                    {/* 효과 정보 — 라벨별 수치 셀(시리즈: 다중 / 단순: 효과 대상·최종 수치) */}
                    {infoCells.length ? (
                      <div className={`mt-2.5 grid gap-1.5 ${infoCells.length >= 3 ? "grid-cols-2 min-[420px]:grid-cols-3" : "grid-cols-2"}`}>
                        {infoCells.map((c, i) => (
                          <div key={i} className="border border-ef-line bg-ef-card px-2 py-1.5" style={CUT_SM}>
                            <p className="truncate font-mono text-[9px] font-bold uppercase tracking-wide text-ef-muted">{c.label}</p>
                            <p className="mt-0.5 break-keep font-mono text-sm font-black tabular-nums" style={{ color: ACCENT }}>{c.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* 메타(시리즈 보조 텍스트) */}
                    {metaRows.length ? (
                      <div className="mt-2.5 flex flex-col gap-1 border-t border-ef-line pt-2.5">
                        {metaRows.map((mt, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
                            <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wide text-ef-muted">{mt.label}</span>
                            <span className="min-w-0 truncate text-right font-black" style={{ color: ACCENT }}>{mt.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* 강화 수치 — 시리즈: 라벨별 R1~Rn / 단순: 한 줄. 자동 줄바꿈 */}
                    {compareRows.length > 1 ? (
                      <div className="mt-2.5 flex flex-col gap-2 border-t border-ef-line pt-2.5">
                        {compareRows.map((row, ri) => (
                          <div key={ri}>
                            <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">{row.label} · 강화 수치</p>
                            <div className="flex flex-wrap gap-1">
                              {row.values.map((v, i) => (
                                <span key={i} className="inline-flex items-center gap-1 border border-ef-line bg-ef-card px-1.5 py-0.5 font-mono text-[10px] leading-none" style={CUT_SM}>
                                  <span className="text-ef-muted">R{i + 1}</span>
                                  <span className="font-black tabular-nums" style={{ color: ACCENT }}>{v}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : ranks.length ? (
                      <div className="mt-2.5 border-t border-ef-line pt-2.5">
                        <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">강화 수치 · R1~R{ranks.length}</p>
                        <div className="flex flex-wrap gap-1">
                          {ranks.map((r, i) => (
                            <span key={i} className="inline-flex items-center gap-1 border border-ef-line bg-ef-card px-1.5 py-0.5 font-mono text-[10px] leading-none" style={CUT_SM}>
                              <span className="text-ef-muted">R{r.rank}</span>
                              <span className="font-black tabular-nums" style={{ color: ACCENT }}>{r.value}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
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
                        <span className="font-mono text-[10px] uppercase tracking-wide text-ef-muted">필요 Lv.{stage.requiredLevel}</span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] font-black text-ef-muted transition-transform group-open:rotate-180" style={{ color: PRIMARY }}>▼</span>
                    </summary>
                    <div className="border-t border-ef-line px-3 py-3">
                      {stage.bonuses.length ? (
                        <ul className="flex flex-col gap-1">
                          {stage.bonuses.map((b, i) => (
                            <li key={i} className="flex gap-2 break-keep text-[11px] leading-5 text-ef-muted">
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

        {/* ===== 사용 오퍼레이터 — 동일 무기 유형 연결(데이터 없으면 숨김) ===== */}
        {relatedOperators.length ? (
          <section className="min-w-0">
            <SectionLabel en="Operators" action={<span className="font-mono text-[10px] font-black uppercase tracking-wide text-ef-muted">{typeLabel} · {relatedOperators.length}</span>} />
            <div className="overflow-hidden border border-ef-line bg-ef-card2 p-3 sm:p-4" style={CUT}>
              {/* 오퍼레이터 목록 카드와 동일 스타일: avatar + 이름 + 레어도 + 속성 + 클래스 */}
              <div className="grid grid-cols-3 items-stretch gap-2 min-[480px]:grid-cols-4 sm:grid-cols-5 lg:grid-cols-6">
                {relatedOperators.map((o) => {
                  const elIcon = elementIconMap[o.element];
                  const clsIcon = classIconMap[o.class];
                  return (
                    <Link
                      key={o.slug}
                      href={`/operators/${o.slug}`}
                      className="group flex flex-col overflow-hidden border border-ef-line bg-ef-card transition duration-200 hover:-translate-y-0.5 hover:border-[#ffd24a]/70 hover:shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
                      style={CUT_SM}
                    >
                      <div className="relative aspect-square w-full overflow-hidden border-b border-ef-line bg-black">
                        <Image src={o.avatar} alt={o.name} fill sizes="120px" className="object-cover object-top transition duration-300 group-hover:scale-105" />
                        <span className="absolute right-1 top-1 rounded-[3px] border-[0.5px] px-1 font-mono text-[8px] font-bold leading-tight backdrop-blur-[3px]" style={{ background: "rgba(0,0,0,0.8)", borderColor: "rgba(255,210,74,0.35)", color: ACCENT }}>{o.rarity}★</span>
                      </div>
                      <div className="flex min-w-0 flex-col gap-1 p-1.5">
                        <span className="truncate text-[11px] font-black leading-tight" style={{ color: ACCENT }}>{o.name}</span>
                        <div className="flex items-center gap-1">
                          {elIcon ? <span className="relative h-3.5 w-3.5 shrink-0"><Image src={elIcon} alt="" fill sizes="14px" className="object-contain" /></span> : null}
                          {clsIcon ? <span className="relative h-3.5 w-3.5 shrink-0"><Image src={clsIcon} alt="" fill sizes="14px" className="object-contain" /></span> : null}
                          <span className="truncate font-mono text-[8px] font-bold uppercase tracking-wide text-ef-muted">{classLabelMap[o.class] ?? o.class}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
