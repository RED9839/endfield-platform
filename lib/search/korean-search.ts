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

function normalizeSearchText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export function getHangulInitials(value: unknown) {
  return String(value ?? "")
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

export function searchTextMatches(keyword: unknown, ...targets: unknown[]) {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) return true;

  const keywordInitials = getHangulInitials(normalizedKeyword);

  return targets.some((target) => {
    const normalizedTarget = normalizeSearchText(target);
    if (!normalizedTarget) return false;

    const targetInitials = getHangulInitials(normalizedTarget);

    return (
      normalizedTarget.includes(normalizedKeyword) ||
      targetInitials.includes(normalizedKeyword) ||
      targetInitials.includes(keywordInitials)
    );
  });
}
