import Image from "next/image";
import type { ReactNode } from "react";
import type { PotentialDetail } from "@/data/operators-detail-data";

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";

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
        borderRadius: "20px",
        background: "#06080c",
        border: `1px solid ${YELLOW_BORDER}`,
        padding: "16px",
      }}
    >
      {children}
    </section>
  );
}

function getPotentialIcon(index: number) {
  return `/icons/potential/${index + 1}.webp`;
}

function PotentialIcon({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div
      style={{
        width: "56px",
        height: "56px",
        position: "relative",
        border: `1px solid ${YELLOW_BORDER}`,
        background: "#0c1016",
        overflow: "hidden",
        flexShrink: 0,
        borderRadius: "20px",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="56px"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

export default function PotentialPanel({
  items,
}: {
  items: PotentialDetail[];
}) {
  if (!items.length) return null;

  return (
    <CardShell>
      <div style={{ display: "grid", gap: "10px" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              padding: "12px 14px",
              border: `1px solid ${YELLOW_BORDER}`,
              background: "#0a0d12",
              borderRadius: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: "12px",
                alignItems: "start",
              }}
            >
              <PotentialIcon
                src={getPotentialIcon(i)}
                alt={item.title}
              />

              <div>
                <div
                  style={{
                    fontWeight: 900,
                    color: YELLOW_TEXT,
                    marginBottom: "4px",
                    fontSize: "16px",
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color: "#e5e7eb",
                    lineHeight: 1.7,
                  }}
                >
                  {highlightAllNumbers(item.description)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}