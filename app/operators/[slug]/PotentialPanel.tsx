import Image from "next/image";
import type { ReactNode } from "react";
import type { PotentialDetail } from "@/data/operators-detail-data";

const ACCENT = "#ffd24a";
const CUT = {
  clipPath:
    "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
};
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
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

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <span key={index} className="font-black" style={{ color: ACCENT }}>
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
    <section className="border border-ef-line bg-ef-card2 p-4" style={CUT}>
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
    <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-ef-line bg-ef-card" style={CUT_SM}>
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
      <div className="grid gap-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-ef-line bg-ef-card px-3.5 py-3"
            style={CUT}
          >
            <div className="grid items-start gap-3" style={{ gridTemplateColumns: "56px 1fr" }}>
              <PotentialIcon
                src={getPotentialIcon(i)}
                alt={item.title}
              />

              <div>
                <div className="mb-1 text-base font-black text-ef-ink">
                  {item.title}
                </div>

                <div className="break-keep leading-7 text-ef-muted">
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
