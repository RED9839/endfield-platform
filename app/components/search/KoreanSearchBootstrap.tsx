"use client";

import { useEffect } from "react";

const HANGUL_START_CODE = 0xac00;
const HANGUL_END_CODE = 0xd7a3;
const HANGUL_INITIALS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
] as const;

const INITIAL_PATTERN = /^[ㄱ-ㅎ]+$/;
const PATCH_KEY = "__endfieldKoreanInitialSearchPatched__";

declare global {
  interface StringConstructor {
    [PATCH_KEY]?: boolean;
  }
}

function getHangulInitials(value: string) {
  return value
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code < HANGUL_START_CODE || code > HANGUL_END_CODE) {
        return char.toLowerCase();
      }

      const initialIndex = Math.floor((code - HANGUL_START_CODE) / 588);
      return HANGUL_INITIALS[initialIndex] ?? char;
    })
    .join("")
    .replace(/\s+/g, "");
}

function shouldUseInitialSearch(searchString: string) {
  const normalizedSearch = searchString.trim().toLowerCase().replace(/\s+/g, "");
  return INITIAL_PATTERN.test(normalizedSearch);
}

function enableKoreanInitialIncludes() {
  if (String[PATCH_KEY]) return;

  const originalIncludes = String.prototype.includes;

  Object.defineProperty(String.prototype, "includes", {
    configurable: true,
    writable: true,
    value(this: string, searchString: string, position?: number) {
      const originalMatched = originalIncludes.call(this, searchString, position);
      if (originalMatched) return true;

      if (typeof searchString !== "string" || position) {
        return false;
      }

      if (!shouldUseInitialSearch(searchString)) {
        return false;
      }

      const normalizedSearch = searchString.trim().toLowerCase().replace(/\s+/g, "");
      const targetInitials = getHangulInitials(String(this).toLowerCase());

      return originalIncludes.call(targetInitials, normalizedSearch);
    },
  });

  String[PATCH_KEY] = true;
}

export default function KoreanSearchBootstrap() {
  useEffect(() => {
    enableKoreanInitialIncludes();
  }, []);

  return null;
}
