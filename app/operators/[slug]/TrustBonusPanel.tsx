import type { TrustBonus } from "@/data/operators-detail-data";

const PRIMARY = "#ff9a2f";
const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};

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
      <span key={index} style={{ color: ACCENT }} className="font-black">
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
    <div className="grid grid-cols-2 items-stretch gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.level}
          className="relative flex min-h-[88px] flex-col justify-center gap-1.5 overflow-hidden border border-ef-line bg-ef-card2 p-3 pl-4 text-center"
          style={CUT}
        >
          <span className="absolute left-0 top-0 h-full w-1" style={{ background: PRIMARY }} />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-ef-muted">
            Trust Lv.{item.level}
          </span>
          <span className="break-keep text-base font-black text-ef-ink">
            {highlightAllNumbers(item.label)}
          </span>
        </div>
      ))}
    </div>
  );
}
