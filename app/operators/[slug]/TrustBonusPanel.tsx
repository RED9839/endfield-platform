import type { ReactNode } from "react";
import type { TrustBonus } from "@/data/operators-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";

function highlightAllNumbers(text: string): React.ReactNode {
  const matches = [...text.matchAll(/([+\-x×]?\s*\d+(?:\.\d+)?%?)/gi)];
  if (!matches.length) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const value = match[0];
    const start = match.index ?? 0;
    const end = start + value.length;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <span
        key={index}
        style={{
          color: YELLOW_MAIN,
          fontWeight: 900,
        }}
      >
        {value.replace(/\s+/g, "")}
      </span>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function CardShell({ children }: { children: ReactNode }) {
  return (
    <section
      style={{
        clipPath:
          "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
        background: "#06080c",
        border: `1px solid ${YELLOW_BORDER}`,
        padding: "16px",
      }}
    >
      {children}
    </section>
  );
}

export default function TrustBonusPanel({
  items,
}: {
  items: TrustBonus[];
}) {
  if (!items.length) return null;

  return (
    <CardShell>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "12px",
        }}
      >
        {items.map((item) => (
          <div
            key={item.level}
            style={{
              border: `1px solid ${YELLOW_BORDER}`,
              background: "#0a0d12",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              clipPath:
                "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "20px",
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              <span style={{ color: "#9fb3c8" }}>
                Lv.{item.level}
              </span>

              <span style={{ color: YELLOW_MAIN }}>
                {highlightAllNumbers(item.label)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}