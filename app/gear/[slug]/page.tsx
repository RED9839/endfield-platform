import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { gearDetails, getGearDetailBySlug } from "@/data/gear-detail-data";
import type { GearDetail, GearStatLine } from "@/data/gear-types";

// ===== 오퍼레이터/무기 상세와 통일한 디자인 토큰 =====
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

const categoryLabelMap: Record<GearDetail["category"], string> = {
  armor: "방어구",
  gloves: "보호 장갑",
  kit: "부품",
};
const categoryIconMap: Record<GearDetail["category"], string> = {
  armor: "/icons/Gear/armor.webp",
  gloves: "/icons/Gear/gloves.webp",
  kit: "/icons/Gear/kit.webp",
};
const qualityColorMap: Record<number, string> = { 5: "#f0c94a", 4: "#9a63ff", 3: "#4fa3ff", 2: "#84cc16", 1: "#9ca3af" };
const qualityLabelMap: Record<number, string> = { 5: "노란색 품질", 4: "보라색 품질", 3: "파란색 품질", 2: "초록색 품질", 1: "회색 품질" };

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

// 능력치/속성 한 줄 — 라벨 + 강화 단계별 수치(기본/+1/+2/+3)
function StatLineCard({ line }: { line: GearStatLine }) {
  const steps = [
    { label: "기본", value: line.values.base },
    { label: "+1", value: line.values.level1 },
    { label: "+2", value: line.values.level2 },
    { label: "+3", value: line.values.level3 },
  ].filter((s) => s.value != null && String(s.value).trim() !== "");
  const finalValue = steps.length ? steps[steps.length - 1].value : "";
  return (
    <div className="flex flex-col border border-ef-line bg-ef-card2 p-3.5" style={CUT}>
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 break-keep text-base font-black text-ef-ink">{line.label}</p>
        {finalValue ? <span className="shrink-0 font-mono text-xl font-black tabular-nums" style={{ color: ACCENT }}>{finalValue}</span> : null}
      </div>
      {steps.length > 1 ? (
        <div className="mt-3 grid gap-1.5 border-t border-ef-line pt-3" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => {
            const isFinal = i === steps.length - 1;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-1 border px-1 py-2"
                style={isFinal
                  ? { ...CUT_SM, borderColor: `${ACCENT}55`, background: `${ACCENT}14` }
                  : { ...CUT_SM, borderColor: "#222", background: "#0b0b0b" }}
              >
                <span className="font-mono text-[12px] font-bold uppercase tracking-wide text-ef-muted">{s.label}</span>
                <span className="break-keep text-center font-mono text-[15px] font-black leading-none tabular-nums" style={{ color: ACCENT }}>{s.value}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function generateStaticParams() {
  return gearDetails.map((gear) => ({ slug: gear.slug }));
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gear = getGearDetailBySlug(slug);
  if (!gear) notFound();

  const typeLabel = categoryLabelMap[gear.category];
  const typeIcon = categoryIconMap[gear.category];
  const qColor = qualityColorMap[gear.quality] ?? "#9ca3af";
  const statLines: GearStatLine[] = [gear.ability1, ...(gear.ability2 ? [gear.ability2] : []), gear.attribute];

  return (
    <main className="relative min-h-screen overflow-x-clip bg-ef-bg text-ef-ink">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] [background-image:radial-gradient(circle,#ffd24a_1px,transparent_1px)] [background-size:22px_22px]" />

      {/* TOP HUD */}
      <div className="relative z-30 mx-auto flex max-w-[1280px] items-center justify-between px-3 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3" style={{ background: PRIMARY }} />
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ef-muted">Gear File</span>
          <span className="hidden font-mono text-[11px] tracking-[0.2em] text-ef-muted/60 sm:inline">{`// ID:${gear.slug.toUpperCase()}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/gear" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>목록</Link>
          <Link href="/" className="inline-flex min-h-9 items-center border border-ef-line bg-black/55 px-3 text-xs font-bold text-ef-muted backdrop-blur transition hover:border-ef-accent/40 hover:text-ef-accent-soft" style={CUT}>홈</Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-3 px-3 pb-16 sm:gap-4 sm:px-6">
        {/* ===== 요약 패널 — 좌 이미지 / 우 정보 ===== */}
        <section className="overflow-hidden border border-ef-line bg-ef-card2" style={CUT}>
          <span className="block h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${qColor}, transparent 55%)` }} />
          <div className="grid gap-4 p-3 sm:p-4 md:grid-cols-[240px_minmax(0,1fr)] md:gap-5 md:p-5">
            {/* 이미지 */}
            <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden border bg-black md:mx-0 md:max-w-[240px]" style={{ ...CUT, borderColor: `${qColor}66` }}>
              <Image src={gear.image} alt={gear.name} fill priority sizes="(max-width:768px) 90vw, 240px" className="object-contain p-3" />
              <span className="pointer-events-none absolute left-2 top-2 h-6 w-6 border-l-2 border-t-2" style={{ borderColor: `${qColor}cc` }} />
              <span className="pointer-events-none absolute bottom-2 right-2 h-6 w-6 border-b-2 border-r-2" style={{ borderColor: `${qColor}88` }} />
            </div>

            {/* 정보 */}
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-ef-muted">{gear.enName}</p>
              <h1 className="mt-1 break-keep text-2xl font-black leading-[0.95] tracking-tight text-white sm:text-4xl">{gear.name}</h1>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="accent">{qualityLabelMap[gear.quality]}</Badge>
                <Badge icon={typeIcon}>{typeLabel}</Badge>
                <Badge>Lv {gear.level}</Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {gear.setName && gear.setName !== "세트 없음" ? (
                  <Link href={`/gear?set=${encodeURIComponent(gear.setName)}`} className="border border-ef-line bg-ef-card p-2.5 transition hover:border-ef-accent/50" style={CUT_SM}>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">세트</p>
                    <p className="mt-0.5 truncate text-sm font-black" style={{ color: PRIMARY }}>{gear.setName}</p>
                  </Link>
                ) : null}
                {gear.baseStat?.label ? (
                  <div className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ef-muted">{gear.baseStat.label}</p>
                    <p className="mt-0.5 truncate text-sm font-black" style={{ color: ACCENT }}>{gear.baseStat.value}</p>
                  </div>
                ) : null}
              </div>

              {gear.summary || gear.description ? (
                <p className="mt-3 break-keep text-xs leading-6 text-ef-muted">{gear.summary || gear.description}</p>
              ) : null}

              {/* 세트 효과 — 설명칸 안으로 이동 */}
              {gear.setEffects?.length ? (
                <div className="mt-3 border-t border-ef-line pt-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-3.5 w-1" style={{ background: PRIMARY }} />
                    <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-white">Set Effect</span>
                    {gear.setName && gear.setName !== "세트 없음" ? (
                      <Link href={`/gear?set=${encodeURIComponent(gear.setName)}`} className="ml-auto font-mono text-[10px] font-black uppercase tracking-wide text-ef-accent-soft transition hover:brightness-125">{gear.setName} →</Link>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    {gear.setEffects.map((eff, i) => (
                      <div key={i} className="border border-ef-line bg-ef-card p-2.5" style={CUT_SM}>
                        <span className="inline-flex w-fit items-center border px-2 py-0.5 font-mono text-[11px] font-black uppercase tracking-wide" style={{ borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>{eff.pieces}세트</span>
                        <p className="mt-2 break-keep text-xs leading-6 text-ef-muted">{eff.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* ===== 능력치 / 속성 (강화 단계별 수치) ===== */}
        {statLines.length ? (
          <section className="min-w-0">
            <SectionLabel en="Stats" />
            <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {statLines.map((line, i) => <StatLineCard key={i} line={line} />)}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
