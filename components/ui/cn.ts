// 가벼운 className 결합 유틸(외부 의존성 없음).
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
