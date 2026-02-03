import type { Metadata } from "next";
import { Noto_Sans, Tenor_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin", "cyrillic"],
  weight: "400",
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
        className={`${notoSans.variable} ${tenorSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
