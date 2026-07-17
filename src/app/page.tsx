import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ProductShowcase from "@/components/ProductShowcase";
import { getSiteSettings } from "@/lib/site-settings";
import { getWhatsAppUrl } from "@/lib/contact";
import { MessageSquare, ShieldCheck, CreditCard, ChevronRight, Zap, Star } from "lucide-react";

export const revalidate = 0; // Disable static rendering cache so admin changes reflect immediately

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    }),
    getSiteSettings(),
  ]);

  const bicycles = products.filter((p) => p.category === "BICICLETA");
  const accessories = products.filter((p) => p.category === "ACCESORIO");
  const catalogBicycles = bicycles.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl,
    rodado: p.rodado,
    velocidades: p.velocidades,
    frenos: p.frenos,
  }));
  const catalogAccessories = accessories.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl,
    rodado: p.rodado,
    velocidades: p.velocidades,
    frenos: p.frenos,
  }));

  // Select the featured bike for the Hero (prefer Firebird Col Raiser if available, otherwise first bike)
  const featuredBike =
    bicycles.find((b) => b.name.toLowerCase().includes("firebird")) ||
    bicycles[0] ||
    {
      name: "Firebird Col Raiser R29",
      brand: "Firebird",
      price: 299900,
      imageUrl: "/images/firebird.jpeg",
      rodado: "29",
      velocidades: "21",
      frenos: "Disco Mecánico",
    };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getWhatsAppLink = (productName: string, price: number) => {
    return getWhatsAppUrl(
      `¡Hola! Estoy interesado en la ${productName} que vi en la web con precio de ${formatPrice(price)}. Me gustaría recibir asesoramiento.`
    );
  };

  const brands = ["TOPMEGA", "FIREBIRD", "RALEIGH", "SOUTH", "VENZO", "SLP"];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex flex-col justify-between pt-24 lg:pt-32 pb-10 overflow-hidden bg-neutral-950">
        
        {/* Full-bleed hero image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.heroImageUrl || featuredBike.imageUrl || "/images/firebird.jpeg"}
            alt={featuredBike.name}
            fill
            priority
            className="object-cover hero-image-enter"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/78 to-neutral-950/18" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,76,0,0.24),transparent_28%)]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
          
          {/* Hero Content */}
          <div className="max-w-3xl space-y-6 text-left hero-content-enter">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-950/60 backdrop-blur border border-brand-orange/40 rounded-sm text-brand-orange text-xs font-semibold tracking-wider uppercase">
              <Star className="w-3.5 h-3.5 fill-current" />
              {settings.heroBadge}
            </div>
            
            <h1 className="font-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.86] text-white uppercase italic drop-shadow-2xl">
              {settings.heroTitleLine1} <br />
              <span className="text-brand-orange">{settings.heroTitleHighlight}</span> <br />
              {settings.heroTitleLine3}
            </h1>
            
            <p className="text-base sm:text-xl text-neutral-200 max-w-2xl leading-relaxed font-light drop-shadow-md">
              {settings.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={getWhatsAppLink(featuredBike.name, featuredBike.price)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-base font-semibold tracking-wider transition-all duration-300 rounded-sm shadow-xl shadow-brand-orange/25"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                {settings.heroPrimaryCta}
              </a>
              <a
                href="#bicicletas"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-950/65 backdrop-blur border border-white/15 hover:border-white/30 text-white font-title text-base font-semibold tracking-wider transition-all duration-300 rounded-sm"
              >
                {settings.heroSecondaryCta}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Micro Specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md">
              <div className="flex items-center gap-2 text-xs text-neutral-200">
                <CreditCard className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Hasta 12 Cuotas</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-200">
                <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Garantía Oficial</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-200">
                <Zap className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Armado Gratis</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 mt-10 hero-content-enter" style={{ animationDelay: "180ms" }}>
          <div className="bg-neutral-950/72 backdrop-blur-md border border-white/10 rounded-sm p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <span className="text-xs font-semibold tracking-wider text-brand-orange uppercase">
                {featuredBike.brand} ALUMINIO &gt;&gt;
              </span>
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 mt-1">
                <h3 className="font-title text-3xl sm:text-4xl font-extrabold text-white">
                  {formatPrice(featuredBike.price)}
                </h3>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-wider uppercase text-neutral-300 pb-1">
                  {featuredBike.rodado && <span>Rodado {featuredBike.rodado}&apos;</span>}
                  {featuredBike.velocidades && <span>{featuredBike.velocidades} velocidades</span>}
                  {featuredBike.frenos && <span>Frenos {featuredBike.frenos}</span>}
                </div>
              </div>
            </div>
            <a
              href={getWhatsAppLink(featuredBike.name, featuredBike.price)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider transition-colors rounded-sm"
            >
              CONSULTAR DESTACADA
            </a>
          </div>
        </div>

        {/* Brands footer (Matches Reference Image) */}
        <div className="w-full border-t border-white/10 pt-8 mt-10 bg-neutral-950/35 backdrop-blur-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-40 hover:opacity-75 transition-opacity duration-300">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="font-title font-extrabold tracking-widest text-white text-lg sm:text-xl md:text-2xl italic select-none"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

      </section>

      <ProductShowcase bicycles={catalogBicycles} accessories={catalogAccessories} />

      <Footer />
      <WhatsAppCTA />
    </div>
  );
}
