"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type BreakthroughMaterial = {
  name: string;
  icon?: string;
  count: string | number;
};

type BreakthroughStage = {
  stage: number;
  requiredLevel: number;
  materials: BreakthroughMaterial[];
  bonuses: string[];
};

const UNIFIED_YELLOW = "#ffd24a";
const PANEL_BORDER = "rgba(255,196,74,0.14)";
const PANEL_BORDER_SOFT = "rgba(255,196,74,0.12)";
const PANEL_BORDER_FAINT = "rgba(255,196,74,0.08)";

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
        border: `1px solid ${PANEL_BORDER_SOFT}`,
        background: "#0a0d12",
        borderRadius: "16px",
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
        <span style={{ color: UNIFIED_YELLOW }}>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen ? (
        <div style={{ borderTop: `1px solid ${PANEL_BORDER_SOFT}` }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function makeMaterialIconPath(name: string) {
  return `/materials/${encodeURIComponent(name)}.webp`;
}

function MaterialIcon({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const resolvedSrc = src || makeMaterialIconPath(alt);

  return (
    <div
      style={{
        position: "relative",
        width: "34px",
        height: "34px",
        flexShrink: 0,
      }}
    >
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes="34px"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

export default function WeaponBreakthroughPanel({
  breakthrough,
}: {
  breakthrough: BreakthroughStage[];
  accentColor?: string;
}) {
  const stages = useMemo(() => breakthrough ?? [], [breakthrough]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = stages[selectedIndex] ?? stages[0];

  if (!current) return null;

  return (
    <section
      style={{
        borderRadius: "20px",
        background: "#06080c",
        border: `1px solid ${PANEL_BORDER}`,
        padding: "16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
      }}
    >
      <div>
        <div
          style={{
            color: UNIFIED_YELLOW,
            fontSize: "30px",
            fontWeight: 900,
          }}
        >
          튜닝 {current.stage}단계
        </div>

        <div
          style={{
            marginTop: "10px",
            color: "#d1d5db",
            fontSize: "15px",
            lineHeight: 1.8,
          }}
        >
          레벨 요구:{" "}
          <span style={{ color: UNIFIED_YELLOW, fontWeight: 900 }}>
            {current.requiredLevel}
          </span>
        </div>

        {!!current.bonuses.length && (
          <div
            style={{
              marginTop: "10px",
              display: "grid",
              gap: "6px",
            }}
          >
            {current.bonuses.map((bonus, index) => (
              <div
                key={`${current.stage}-bonus-${index}`}
                style={{
                  color: "#e5e7eb",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {bonus}
              </div>
            ))}
          </div>
        )}
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
                  ? `1px solid ${UNIFIED_YELLOW}`
                  : `1px solid ${PANEL_BORDER_SOFT}`,
                background: active ? "rgba(255,210,74,0.14)" : "#0c1016",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                borderRadius: "14px",
              }}
            >
              {stage.stage}
            </button>
          );
        })}
      </div>

      <FoldSection title="튜닝 재료" defaultOpen={false}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            padding: "10px",
            alignItems: "start",
          }}
        >
          {stages.map((stage) => (
            <div
              key={stage.stage}
              style={{
                borderLeft: `1px solid ${PANEL_BORDER_SOFT}`,
                paddingLeft: "10px",
                minHeight: "100%",
              }}
            >
              <div
                style={{
                  color: UNIFIED_YELLOW,
                  fontSize: "13px",
                  fontWeight: 900,
                  marginBottom: "8px",
                }}
              >
                {stage.stage}단계
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
                        border: `1px solid ${PANEL_BORDER_FAINT}`,
                        background: "#0e131b",
                        padding: "6px 8px",
                        display: "grid",
                        gridTemplateColumns: "34px 1fr auto",
                        gap: "8px",
                        alignItems: "center",
                        borderRadius: "12px",
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
                          color: UNIFIED_YELLOW,
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