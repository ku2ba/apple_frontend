import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const akony = localFont({
  src: "../../public/fonts/akony/AKONY.woff2",
  variable: "--font-akony",
  display: "swap",
  weight: "700",
});

const charito = localFont({
  src: "../../public/fonts/charito/Charito.ttf",
  variable: "--font-charito",
  display: "swap",
  weight: "400",
});

const etudeNoire = localFont({
  src: "../../public/fonts/etude_noire/Etude Noire Regular.ttf",
  variable: "--font-etude",
  display: "swap",
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Loom Store — Apple техника",
  description: "iPhone, MacBook, iPad и аксессуары Apple с гарантией и быстрой доставкой",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${akony.variable} ${charito.variable} ${etudeNoire.variable} ${montserrat.variable} font-sans flex min-h-screen flex-col antialiased bg-white text-[#221f1f]`}
      >
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
