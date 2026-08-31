import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AstroLife — Una guía entre tanto caos",
  description:
    "Horóscopo diario, carta natal y una guía astrológica conversacional. Astrid te acompaña entre tanto caos.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#100a1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-bg shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
