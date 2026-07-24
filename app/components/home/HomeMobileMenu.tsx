"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";

const PRIMARY = "#ff9a2f";
const CUT_SM = {
  clipPath:
    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

const NAV_ITEMS = [
  { label: "오퍼레이터", href: "/operators" },
  { label: "무기", href: "/weapons" },
  { label: "장비", href: "/gear" },
  { label: "성장 시뮬레이터", href: "/simulator" },
  { label: "파밍 계산기", href: "/farming" },
  { label: "유저 세팅", href: "/settings" },
  { label: "던전 원정", href: "/game" },
];

export function HomeMobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 드로어 열림 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center border border-ef-line bg-ef-card2 text-ef-muted transition active:scale-95"
        style={CUT_SM}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[78%] max-w-xs flex-col border-l border-ef-line bg-ef-bg px-4 py-4 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1" style={{ background: PRIMARY }} />
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ef-muted">
                  ENDFIELD · 메뉴
                </p>
              </div>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center border border-ef-line bg-ef-card2 text-ef-muted transition active:scale-95"
                style={CUT_SM}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border border-ef-line bg-ef-card2 px-4 py-3 text-sm font-bold tracking-wide text-ef-muted transition hover:border-ef-accent/40 hover:text-ef-accent-soft"
                  style={CUT_SM}
                >
                  {item.label}
                  <span className="text-xs text-ef-muted transition group-hover:text-ef-accent">
                    &gt;
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
