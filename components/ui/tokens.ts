// Endfield 디자인 토큰(JS 접근용). globals.css @theme 와 동일한 값.
export const ef = {
  bg: "#050505",
  card: "#0b0b0b",
  card2: "#111111",
  line: "#202020",
  accent: "#ffd24a",
  accentSoft: "#ffdc70",
  ink: "#ffffff",
  muted: "#a0a0a0",
  danger: "#ff6b6b",
  success: "#3ecf8e",
} as const;

export type EfColor = keyof typeof ef;
