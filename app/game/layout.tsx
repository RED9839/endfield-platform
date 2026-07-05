// 던전 원정 라우트 전용 레이아웃 — 엔드필드 테크니컬 타이포(Chakra Petch UI + JetBrains Mono 수치).
// 폰트는 이 라우트에서만 쓰이므로 여기서 주입(플랫폼 나머지는 Arial 유지).
export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
