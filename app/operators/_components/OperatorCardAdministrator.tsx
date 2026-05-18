"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  enName: string;
};

export default function OperatorCardAdministrator({
  slug,
  name,
  enName,
}: Props) {
  return (
    <Link
      href={`/operators/${slug}`}
      style={{
        display: "block",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          overflow: "hidden",
          background: "#06080c",
          border: "1px solid rgba(255,196,74,0.14)",
          borderRadius: "20px",
        }}
      >
        {/* 왼쪽 이미지 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(0 0, 58% 0, 42% 100%, 0 100%)",
          }}
        >
          <Image
            src={`/operators/${slug}/avatar1.webp`}
            alt={`${name}-1`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* 오른쪽 이미지 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)",
          }}
        >
          <Image
            src={`/operators/${slug}/avatar2.webp`}
            alt={`${name}-2`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* 🔥 대각선 경계선 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(100deg, transparent 48%, rgba(255,210,74,0.95) 49%, rgba(255,210,74,0.95) 51%, transparent 52%)",
          }}
        />

        {/* 어두운 오버레이 (가독성용) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))",
          }}
        />

        {/* 텍스트 */}
        <div
          style={{
            position: "absolute",
            left: "12px",
            bottom: "12px",
            right: "12px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>

          <div
            style={{
              marginTop: "2px",
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >
            {enName}
          </div>
        </div>
      </div>
    </Link>
  );
}