import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Prata } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  preload: false,
});

const prata = Prata({
  variable: "--font-prata",
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Мой личный косметолог",
  description: "Персонализированные AI-рекомендации по уходу за кожей",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${ibmPlexSans.variable} ${prata.variable} font-sans antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
