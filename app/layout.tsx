import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "엔드필드 데이터 허브",
  description:
    "엔드필드 오퍼레이터, 무기, 장비, 재화 파밍 및 성장 시뮬레이션을 제공하는 통합 데이터 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#050505] text-[#ededed]">
        {children}
      </body>
    </html>
  );
}
