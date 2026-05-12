import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "../public/fonts/Geist/static/Geist-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Geist/static/Geist-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Geist/static/Geist-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Geist/static/Geist-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "../public/fonts/Geist_Mono/static/GeistMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Geist_Mono/static/GeistMono-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Geist_Mono/static/GeistMono-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Geist_Mono/static/GeistMono-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

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
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#ededed]">
        {children}
      </body>
    </html>
  );
}
