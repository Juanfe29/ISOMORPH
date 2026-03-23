import type { Metadata } from "next";
import { Figtree, Syne, DM_Mono, Barlow_Condensed, Bebas_Neue, Archivo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "ISOMORPH AI | Synthesize Chaos. Predict Control.",
  description: "Unified Data Intelligence & AI Forecasting for Enterprise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${figtree.variable} ${syne.variable} ${dmMono.variable} ${barlowCondensed.variable} ${bebasNeue.variable} ${archivo.variable} font-sans antialiased`}
      >
        {/* Three.js r134 — required by Vanta BIRDS (incompatible with r182 npm build) */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
