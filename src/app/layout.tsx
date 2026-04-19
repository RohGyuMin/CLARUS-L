import type { Metadata } from "next";
import "./globals.css";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CLARUS-N",
  alternateName: ["클라루스앤", "클라루스엔", "클라루스-엔"],
  url: "https://www.clarusn.com",
  logo: "https://www.clarusn.com/logo.png",
  sameAs: [],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clarusn.com"),
  title: {
    default: "CLARUS-N (클라루스앤) | 뇌혈관 신경영상 AI — Brain MRI, MRA, DWI, CT",
    template: "%s | CLARUS-N",
  },
  description:
    "클라루스앤(CLARUS-N)은 신경외과 전문의 어노테이션 기반 뇌혈관 AI 솔루션입니다. 뇌 MRI·MRA·DWI·CT 영상 분석, 뇌동맥류 탐지, 협착 분석, 임상 의사결정 지원. Neurosurgeon-annotated AI for neuroimaging, aneurysm detection, and cerebrovascular analysis.",
  keywords: [
    "CLARUS-N", "클라루스앤", "클라루스엔", "클라루스-엔",
    "neuroimaging", "AI", "brain MRI", "cerebrovascular", "aneurysm detection",
    "뇌혈관 AI", "뇌 MRI AI", "뇌혈관 분석", "AI 진단", "뇌동맥류", "뇌졸중 AI",
    "신경영상 AI", "뇌 CT AI", "뇌 MRA", "의료 AI", "뇌혈관 질환"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CLARUS-N (클라루스앤) | 뇌혈관 신경영상 AI — Brain MRI, MRA, DWI, CT",
    description:
      "클라루스앤(CLARUS-N) — 신경외과 전문의 어노테이션 기반 뇌혈관 AI. 뇌 MRI·MRA·DWI·CT 분석, 뇌동맥류 탐지, 협착 분석.",
    url: "https://www.clarusn.com",
    siteName: "CLARUS-N",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLARUS-N (클라루스앤) | 뇌혈관 신경영상 AI",
    description:
      "클라루스앤(CLARUS-N) — 뇌혈관 AI 솔루션. 뇌 MRI·MRA·DWI·CT 분석, 뇌동맥류 탐지.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="a319b3216518dc55fbda5e9610361fbd22ec0a26"
        />
        <meta
          name="google-site-verification"
          content="J2_9YWUjcxx47wH-m04ULpCNZ-Vf9-S6dxgyXKhJ9u4"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
