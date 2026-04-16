import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clarusn.com"),
  title: {
    default: "CLARUS-N | Neuroimaging AI for Brain MRI, MRA, DWI, and CT",
    template: "%s | CLARUS-N",
  },
  description:
    "CLARUS-N develops neurosurgeon-annotated AI for neuroimaging. Explore brain MRI, MRA, DWI, and CT reconstruction, aneurysm detection, stenosis analysis, and clinical decision support.",
  keywords: ["CLARUS-N", "neuroimaging", "AI", "brain MRI", "cerebrovascular", "aneurysm detection", "뇌혈관", "AI 진단"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CLARUS-N | Neuroimaging AI for Brain MRI, MRA, DWI, and CT",
    description:
      "CLARUS-N develops neurosurgeon-annotated AI for neuroimaging, including brain MRI, MRA, DWI, and CT workflows.",
    url: "https://www.clarusn.com",
    siteName: "CLARUS-N",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLARUS-N | Neuroimaging AI for Brain MRI, MRA, DWI, and CT",
    description:
      "CLARUS-N develops neurosurgeon-annotated AI for neuroimaging workflows.",
    images: ["/og-image.png"],
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
      </head>
      <body>{children}</body>
    </html>
  );
}
