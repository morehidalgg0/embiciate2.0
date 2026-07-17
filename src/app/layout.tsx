import type { Metadata } from "next";
import { Outfit, Oswald } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Embiciate | Bicicletas y Accesorios en Mar del Plata",
  description: "La bici que buscás está acá. Venta de bicicletas de las mejores marcas (Topmega, Firebird, Raleigh, South, Venzo, SLP) y accesorios en Mar del Plata, Argentina. Hasta 12 cuotas fijas. Asesoramiento y venta directa por WhatsApp.",
  keywords: ["bicicletas", "mar del plata", "comprar bicicleta", "cuotas fijas", "raleigh", "firebird", "venzo", "topmega", "embiciate"],
  authors: [{ name: "Embiciate" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Embiciate | Bicicletas y Accesorios en Mar del Plata",
    description: "La bici que buscás está acá. Venta de bicicletas de las mejores marcas y accesorios en Mar del Plata. Hasta 12 cuotas fijas.",
    url: "https://embiciate.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-white font-sans">
        {children}
      </body>
    </html>
  );
}
