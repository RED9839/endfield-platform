// DD 원정(닼던식) 라우트 전용 레이아웃 — 고딕 각인체(Cinzel) + 고문서 세리프(EB Garamond) 로드.
// 폰트는 이 라우트에서만 쓰이므로 여기서 주입(플랫폼 나머지는 Arial 유지).
export default function DDLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
