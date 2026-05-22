import type { TrustBonus } from "@/data/operators-detail-data";

const YELLOW_MAIN = "#ffd24a";

function highlightAllNumbers(text: string): React.ReactNode {
  const matches = [...text.matchAll(/([+\-x×]?\s*\d+(?:\.\d+)?%?)/gi)];
  if (!matches.length) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const value = match[0];
    const start = match.index ?? 0;
    const end = start + value.length;

    if (start > lastIndex) parts.push(text.slice(lastIndex, start));

    parts.push(
      <span key={index} style={{ color: YELLOW_MAIN }} className="font-black">
        {value.replace(/\s+/g, "")}
      </span>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function TrustBonusPanel({ items }: { items: TrustBonus[] }) {
  if (!items.length) return null;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[22px] border border-yellow-500/15 bg-[#05070b] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.24)] sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,210,74,0.09),transparent_30%)]" />

      <div className="relative grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.level}
            className="min-w-0 rounded-[18px] border border-white/10 bg-black/25 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
          >
            <div className="text-[11px] font-black tracking-[0.14em] text-zinc-500">
              TRUST BONUS
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-sm font-black text-zinc-400">Lv.{item.level}</span>
              <span className="break-keep text-lg font-black text-yellow-200">
                {highlightAllNumbers(item.label)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
