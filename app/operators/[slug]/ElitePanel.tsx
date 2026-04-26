"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type EliteMaterial = {
  name: string;
  icon?: string;
  count: string | number;
};

type EliteStage = {
  stage: string;
  description: string;
  materials: EliteMaterial[];
};

const YELLOW_MAIN = "#ffd24a";
const YELLOW_TEXT = "#ffdc70";
const YELLOW_BORDER = "rgba(255,196,74,0.14)";
const YELLOW_BORDER_SOFT = "rgba(255,196,74,0.10)";
const YELLOW_BORDER_FAINT = "rgba(255,196,74,0.08)";

function FoldSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        marginTop: "14px",
        border: `1px solid ${YELLOW_BORDER}`,
        background: "#0a0d12",
        clipPath:
          "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "13px 14px",
          background: "transparent",
          border: "none",
          color: "#edf2f7",
          fontSize: "13px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          cursor: "pointer",
        }}
      >
        <span>{title}</span>
        <span style={{ color: YELLOW_MAIN }}>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div style={{ borderTop: `1px solid ${YELLOW_BORDER_SOFT}` }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function getEliteStageIcon(stage: string) {
  if (stage.includes("IV")) return "/icons/elite/4.webp";
  if (stage.includes("III")) return "/icons/elite/3.webp";
  if (stage.includes("II")) return "/icons/elite/2.webp";
  if (stage.includes("I")) return "/icons/elite/1.webp";
  return "/icons/elite/1.webp";
}

function MaterialIcon({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return (
      <div
        style={{
          width: "26px",
          height: "26px",
          border: `1px solid ${YELLOW_BORDER_SOFT}`,
          background: "#05070b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "8px",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        I
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "26px",
        height: "26px",
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="26px"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

export default function ElitePanel({ elite }: { elite: EliteStage[] }) {
  const stages = useMemo(() => elite ?? [], [elite]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = stages[selectedIndex] ?? stages[0];

  if (!current) return null;

  return (
    <section
      style={{
        clipPath:
          "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)",
        background: "#06080c",
        border: `1px solid ${YELLOW_BORDER}`,
        padding: "16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          gap: "14px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            border: `1px solid ${YELLOW_BORDER}`,
            background: "#0c1016",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            clipPath:
              "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
          }}
        >
          <div style={{ position: "relative", width: "64px", height: "64px" }}>
            <Image
              src={getEliteStageIcon(current.stage)}
              alt={current.stage}
              fill
              sizes="64px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div>
          <div
            style={{
              color: YELLOW_TEXT,
              fontSize: "30px",
              fontWeight: 900,
            }}
          >
            {current.stage}
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "#d1d5db",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            {current.description}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        {stages.map((stage, index) => {
          const active = selectedIndex === index;

          return (
            <button
              key={stage.stage}
              onClick={() => setSelectedIndex(index)}
              style={{
                padding: "6px 12px",
                border: active
                  ? `1px solid ${YELLOW_MAIN}`
                  : `1px solid ${YELLOW_BORDER}`,
                background: active ? "rgba(255,196,74,0.14)" : "#0c1016",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                clipPath:
                  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
              }}
            >
              {stage.stage}
            </button>
          );
        })}
      </div>

      <FoldSection title="업그레이드 재료" defaultOpen={false}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "10px",
            padding: "10px",
            alignItems: "start",
          }}
        >
          {stages.map((stage) => (
            <div
              key={stage.stage}
              style={{
                borderLeft: `1px solid ${YELLOW_BORDER}`,
                paddingLeft: "10px",
                minHeight: "100%",
              }}
            >
              <div
                style={{
                  color: YELLOW_TEXT,
                  fontSize: "13px",
                  fontWeight: 900,
                  marginBottom: "8px",
                }}
              >
                {stage.stage}
              </div>

              {stage.materials.length ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {stage.materials.map((material, index) => (
                    <div
                      key={`${stage.stage}-${index}`}
                      style={{
                        border: `1px solid ${YELLOW_BORDER_FAINT}`,
                        background: "#0e131b",
                        padding: "6px 8px",
                        display: "grid",
                        gridTemplateColumns: "26px 1fr auto",
                        gap: "8px",
                        alignItems: "center",
                        clipPath:
                          "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
                      }}
                    >
                      <MaterialIcon src={material.icon} alt={material.name} />

                      <div
                        style={{
                          color: "#f3f4f6",
                          fontSize: "11px",
                          lineHeight: 1.3,
                          wordBreak: "keep-all",
                        }}
                      >
                        {material.name}
                      </div>

                      <div
                        style={{
                          color: YELLOW_MAIN,
                          fontSize: "11px",
                          fontWeight: 900,
                          whiteSpace: "nowrap",
                          paddingLeft: "6px",
                        }}
                      >
                        {material.count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                  재료 데이터 없음
                </div>
              )}
            </div>
          ))}
        </div>
      </FoldSection>
    </section>
  );
}