import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KW6L7MGS');`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 text-white font-sans">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KW6L7MGS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
