"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
  enName: string;
  borderColor: string;
};

const panelClipPath =
  "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)";

const navButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "44px",
  height: "44px",
  border: "1px solid rgba(255,210,74,0.18)",
  background: "rgba(10,13,18,0.72)",
  color: "#f8fafc",
  fontSize: "22px",
  fontWeight: 900,
  lineHeight: 1,
  cursor: "pointer",
  zIndex: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  clipPath:
    "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
};

export default function HeroSlider({
  images,
  alt,
  enName,
  borderColor,
}: Props) {
  const validImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!validImages.length) return null;

  const currentImage = validImages[currentIndex];

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      style={{
        clipPath: panelClipPath,
        position: "relative",
        height: "min(70vw, 860px)",
        border: `1px solid ${borderColor}`,
        overflow: "hidden",
        marginBottom: "18px",
        background: "#000",
      }}
    >
      <Image
        src={currentImage}
        alt={alt}
        fill
        priority
        style={{
          objectFit: "cover",
          filter: "blur(16px) brightness(0.25)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={currentImage}
          alt={alt}
          fill
          priority
          style={{
            objectFit: "contain",
          }}
        />
      </div>

      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 이미지"
            style={{
              ...navButtonStyle,
              left: "14px",
            }}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="다음 이미지"
            style={{
              ...navButtonStyle,
              right: "14px",
            }}
          >
            ›
          </button>
        </>
      )}

      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: "clamp(56px, 6vw, 110px)",
            fontWeight: 900,
            textShadow: "0 8px 20px rgba(0,0,0,0.8)",
            color: "#fff",
          }}
        >
          {alt}
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#dbe4f0",
            textShadow: "0 4px 12px rgba(0,0,0,0.7)",
            marginTop: "6px",
          }}
        >
          {enName}
        </div>
      </div>
    </section>
  );
}