"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
  enName: string;
};

const HERO_IMAGE_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1280px) 62vw, 1120px";

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
  borderRadius: "20px",
};

export default function HeroSlider({ images, alt, enName }: Props) {
  const validImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!validImages.length) return null;

  const currentImage = validImages[currentIndex];

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1,
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="relative h-full w-full">
      <Image
        src={currentImage}
        alt={alt}
        fill
        priority
        sizes={HERO_IMAGE_SIZES}
        className="object-contain object-bottom drop-shadow-[0_24px_42px_rgba(0,0,0,0.68)]"
      />

      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 이미지"
            style={{ ...navButtonStyle, left: "calc(10% + 14px)" }}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="다음 이미지"
            style={{ ...navButtonStyle, right: "calc(10% + 14px)" }}
          >
            ›
          </button>
        </>
      )}

      <div className="pointer-events-none absolute left-[10%] bottom-12 z-[2] max-w-[70%] sm:bottom-16 lg:bottom-24">
        <div className="break-keep text-[clamp(54px,9vw,104px)] font-black leading-none tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]">
          {alt}
        </div>

        <div className="mt-4 break-words text-base font-bold text-zinc-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)] sm:text-xl">
          {enName}
        </div>
      </div>
    </div>
  );
}
