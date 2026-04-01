import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLARUS-N | AI for Unlocking Neuroimages",
  description: "Advanced AI solution for neuroimaging analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
