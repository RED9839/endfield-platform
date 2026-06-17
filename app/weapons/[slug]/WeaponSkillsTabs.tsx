"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { WeaponSkillPanel } from "@/data/weapons-detail-data";

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

// 무기 스킬 분류는 typeLabel("무기 스킬")이 아니라 meta[0].label(능력치/속성/시리즈 스킬)에 들어있다.
const CATS = ["능력치", "속성", "시리즈 스킬"] as const;
const CAT_ORDER: Record<string, number> = { 능력치: 0, 속성: 1, "시리즈 스킬": 2 };
const CAT_DISPLAY: Record<string, string> = { 능력치: "능력치", 속성: "속성", "시리즈 스킬": "시리즈" };

function skillCategory(skill: WeaponSkillPanel): string {
  const m = (skill.meta ?? []).find((x) => CATS.includes(String(x.label) as (typeof CATS)[number]));
  return m ? String(m.label) : (skill.typeLabel ?? "");
}
function tabLabel(skill: WeaponSkillPanel) {
  const c = skillCategory(skill);
  return CAT_DISPLAY[c] ?? c ?? skill.name;
}

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

function SkillCard({ skill }: { skill: WeaponSkillPanel }) {
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
  const infoCells = isSeries
    ? maxStats.map((s) => ({ label: s.label, value: String(s.value) }))
    : [
        ...((skill.meta?.[0]?.value != null && String(skill.meta[0].value).trim() !== "") ? [{ label: "효과 대상", value: String(skill.meta[0].value) }] : []),
        ...(finalValue ? [{ label: "최종 수치", value: String(finalValue) }] : []),
      ];
  const metaRows = isSeries ? (skill.meta ?? []).filter((m) => String(m.value).trim() !== "") : [];

  return (
    <div className="flex flex-col border border-ef-line bg-ef-card2 p-2.5 sm:p-3" style={CUT}>
      <div className="flex items-center gap-2.5">
        {skill.icon ? <span className="relative h-10 w-10 shrink-0 overflow-hidden border border-ef-line bg-black"><Image src={skill.icon} alt="" fill sizes="40px" className="object-contain p-1" /></span> : null}
        <div className="min-w-0">
          {(() => { const c = skillCategory(skill); return c ? <span className="inline-flex items-center border px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wide" style={{ borderColor: `${PRIMARY}66`, background: `${PRIMARY}1a`, color: PRIMARY }}>{CAT_DISPLAY[c] ?? c}</span> : null; })()}
          <p className="mt-1 break-keep text-sm font-black text-ef-ink">{skill.name}</p>
        </div>
      </div>

      {effect ? (
        <div className="mt-2.5">
          <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ef-muted">효과 설명</p>
          <p className="whitespace-pre-line break-keep text-[13px] leading-6 text-ef-muted">{highlightNums(effect)}</p>
        </div>
      ) : null}

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
}

// 무기 스킬 탭 — 능력치 → 속성 → 시리즈 순. 기본 선택=시리즈(가장 중요).
export default function WeaponSkillsTabs({ skills }: { skills: WeaponSkillPanel[] }) {
  const ordered = [...skills].sort((a, b) => (CAT_ORDER[skillCategory(a)] ?? 9) - (CAT_ORDER[skillCategory(b)] ?? 9));
  const seriesIdx = ordered.findIndex((s) => skillCategory(s) === "시리즈 스킬");
  const [sel, setSel] = useState(seriesIdx >= 0 ? seriesIdx : Math.max(0, ordered.length - 1));
  if (!ordered.length) return null;
  const cur = Math.min(sel, ordered.length - 1);

  return (
    <div className="min-w-0">
      {/* 탭 — 선택된 스킬만 아래에 표시(세로 공간 절약). 모바일 줄바꿈 */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {ordered.map((s, i) => {
          const isSel = i === cur;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSel(i)}
              className="inline-flex items-center gap-1.5 border px-3 py-2 font-mono text-[11px] font-black uppercase tracking-wide transition duration-150"
              style={isSel
                ? { ...CUT_SM, borderColor: ACCENT, background: "rgba(255,210,74,0.2)", color: "#ffffff", boxShadow: "inset 0 -2px 0 0 #ff9a2f, 0 0 14px rgba(255,210,74,0.18)" }
                : { ...CUT_SM, borderColor: "#202020", background: "#0b0b0b", color: "#a0a0a0" }}
            >
              {s.icon ? <span className="relative h-3.5 w-3.5 shrink-0 overflow-hidden"><Image src={s.icon} alt="" fill sizes="14px" className="object-contain" /></span> : null}
              {tabLabel(s)}
            </button>
          );
        })}
      </div>
      <SkillCard skill={ordered[cur]} />
    </div>
  );
}
