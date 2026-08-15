import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cekcelah.vercel.app"),
  title: {
    default: "CekCelah — Web Security, Quality & Health Scanner",
    template: "%s | CekCelah",
  },
  description:
    "CekCelah adalah scanner keamanan, kualitas, dan kesehatan website native berkecepatan tinggi, didukung backend C++ dan Next.js.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "CekCelah — Web Security, Quality & Health Scanner",
    description: "Scanner web native C++ + Next.js untuk audit keamanan, kualitas, dan kesehatan website.",
    url: "/",
    siteName: "CekCelah",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CekCelah" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CekCelah — Web Security Scanner",
    description: "Native C++ + Next.js. Temukan celah, ukur kualitas, cek kesehatan website.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen grid-bg">{children}</body>
    </html>
  );
}
