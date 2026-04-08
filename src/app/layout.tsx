import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLARUS-N | AI for Unlocking Neuroimages",
  description: "뇌혈관 질환 진단을 위한 AI 솔루션. MRA, DWI, CT 기반 혈관 재구성, 동맥류 탐지, 협착 분석을 제공합니다.",
  keywords: ["CLARUS-N", "neuroimaging", "AI", "brain MRI", "cerebrovascular", "aneurysm detection", "뇌혈관", "AI 진단"],
  openGraph: {
    title: "CLARUS-N | AI for Unlocking Neuroimages",
    description: "뇌혈관 질환 진단을 위한 AI 솔루션",
    url: "https://clarus-n.web.app",
    siteName: "CLARUS-N",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
