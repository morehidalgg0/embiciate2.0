import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { getSiteSettings } from "@/lib/site-settings";
import { MessageSquare, ShieldCheck, CreditCard, ChevronRight, Zap, Settings, Star } from "lucide-react";

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
    const phoneNumber = "5492235517857";
    const text = encodeURIComponent(
      `¡Hola! Estoy interesado en la ${productName} que vi en la web con precio de ${formatPrice(price)}. Me gustaría recibir asesoramiento.`
    );
    return `https://wa.me/${phoneNumber}?text=${text}`;
  };

  const brands = ["TOPMEGA", "FIREBIRD", "RALEIGH", "SOUTH", "VENZO", "SLP"];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex flex-col justify-between pt-24 lg:pt-32 pb-12 overflow-hidden bg-neutral-950">
        
        {/* Background Image / Overlay Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,76,0,0.14),transparent_32%),linear-gradient(135deg,rgba(255,76,0,0.08),transparent_42%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 rounded-sm text-brand-orange text-xs font-semibold tracking-wider uppercase">
              <Star className="w-3.5 h-3.5 fill-current" />
              {settings.heroBadge}
            </div>
            
            <h1 className="font-title text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-white uppercase italic">
              {settings.heroTitleLine1} <br />
              <span className="text-brand-orange">{settings.heroTitleHighlight}</span> <br />
              {settings.heroTitleLine3}
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-400 max-w-lg leading-relaxed font-light">
              {settings.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={getWhatsAppLink(featuredBike.name, featuredBike.price)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-base font-semibold tracking-wider transition-all duration-300 rounded-sm shadow-lg shadow-brand-orange/20"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                {settings.heroPrimaryCta}
              </a>
              <a
                href="#bicicletas"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-title text-base font-semibold tracking-wider transition-all duration-300 rounded-sm"
              >
                {settings.heroSecondaryCta}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Micro Specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-900 max-w-md">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <CreditCard className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Hasta 12 Cuotas</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Garantía Oficial</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Zap className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Armado Gratis</span>
              </div>
            </div>
          </div>

          {/* Hero Right Image & Specs Box */}
          <div className="lg:col-span-6 relative">
            <div className="relative min-h-[520px] overflow-hidden rounded-sm border border-neutral-800 bg-brand-dark shadow-2xl">
              <div className="absolute inset-0">
                <Image
                  src={settings.heroImageUrl || featuredBike.imageUrl || "/images/firebird.jpeg"}
                  alt={featuredBike.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/45 via-transparent to-transparent" />
              </div>

              <div className="absolute left-5 top-5 bg-neutral-950/80 backdrop-blur border border-white/10 px-3 py-2 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400 font-bold">Destacada</p>
                <p className="font-title text-sm text-white font-bold tracking-wider">{featuredBike.brand}</p>
              </div>

              <div className="absolute right-5 top-5 bg-brand-orange px-4 py-2 rounded-sm shadow-lg shadow-black/30">
                <p className="font-title text-sm font-black text-white tracking-widest">12 CUOTAS</p>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="bg-neutral-950/88 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-sm shadow-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-brand-orange uppercase">
                        {featuredBike.brand} ALUMINIO &gt;&gt;
                      </span>
                      <h3 className="font-title text-2xl sm:text-4xl font-extrabold text-white mt-1">
                        {formatPrice(featuredBike.price)}
                      </h3>
                    </div>
                    <a
                      href={getWhatsAppLink(featuredBike.name, featuredBike.price)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider transition-colors rounded-sm"
                    >
                      CONSULTAR
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-wider uppercase text-neutral-300">
                    {featuredBike.rodado && (
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        RODADO {featuredBike.rodado}&apos;
                      </span>
                    )}
                    {featuredBike.velocidades && (
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        {featuredBike.velocidades} VELOCIDADES
                      </span>
                    )}
                    {featuredBike.frenos && (
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                        FRENOS {featuredBike.frenos}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brands footer (Matches Reference Image) */}
        <div className="w-full border-t border-neutral-900/60 pt-10 mt-12 bg-neutral-950/40 backdrop-blur-sm z-10">
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

      {/* Bicycles Grid Section */}
      <section id="bicicletas" className="bg-neutral-950 py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-orange uppercase border-l-2 border-brand-orange pl-3">
                CATÁLOGO EXCLUSIVO
              </span>
              <h2 className="font-title text-4xl sm:text-5xl font-extrabold tracking-wide uppercase italic text-white mt-3">
                NUESTRAS <span className="text-brand-orange">BICICLETAS</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-400 max-w-md mt-4 md:mt-0 font-light leading-relaxed">
              Modelos seleccionados para MTB, recreación y deporte. Cada bicicleta incluye armado técnico inicial bonificado.
            </p>
          </div>

          {bicycles.length === 0 ? (
            <div className="text-center py-16 bg-brand-gray/30 border border-neutral-900 rounded-sm">
              <Settings className="w-8 h-8 mx-auto text-neutral-600 animate-spin mb-4" />
              <p className="text-neutral-500">Pronto cargaremos nuevas bicicletas. ¡Consultanos por WhatsApp!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bicycles.map((bike) => (
                <div
                  key={bike.id}
                  className="bg-brand-dark border border-neutral-900 hover:border-neutral-800 transition-all duration-300 flex flex-col group rounded-sm"
                >
                  {/* Image wrapper */}
                  <div className="relative w-full aspect-[4/3] bg-neutral-950 overflow-hidden border-b border-neutral-900/60 rounded-t-sm">
                    <Image
                      src={bike.imageUrl || "/images/firebird.jpeg"}
                      alt={bike.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/35 via-transparent to-transparent pointer-events-none" />
                    {bike.stock <= 2 && bike.stock > 0 && (
                      <span className="absolute top-4 left-4 bg-brand-orange/95 text-white font-title text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                        ÚLTIMAS UNIDADES
                      </span>
                    )}
                    {bike.stock === 0 && (
                      <span className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center text-white font-title font-bold tracking-widest text-sm">
                        SIN STOCK / CONSULTAR
                      </span>
                    )}
                  </div>

                  {/* Info Wrapper */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 font-bold uppercase tracking-wider">
                        <span>{bike.brand}</span>
                        {bike.rodado && <span>RODADO {bike.rodado}</span>}
                      </div>
                      
                      <h3 className="font-title text-xl font-bold text-white tracking-wide uppercase mt-2 group-hover:text-brand-orange transition-colors">
                        {bike.name}
                      </h3>

                      {/* Specs badges inline */}
                      {(bike.velocidades || bike.frenos) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 mt-3 pt-3 border-t border-neutral-900/60">
                          {bike.velocidades && <span>{bike.velocidades} Vel.</span>}
                          {bike.frenos && <span>Frenos: {bike.frenos}</span>}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-900/60 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Precio Especial</p>
                        <p className="font-title text-2xl font-black text-white">{formatPrice(bike.price)}</p>
                      </div>
                      <a
                        href={getWhatsAppLink(bike.name, bike.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider transition-colors rounded-sm"
                      >
                        CONSULTAR
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Accessories Grid Section */}
      <section id="accesorios" className="bg-neutral-900/60 py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-orange uppercase border-l-2 border-brand-orange pl-3">
                EQUIPAMIENTO & SEGURIDAD
              </span>
              <h2 className="font-title text-4xl sm:text-5xl font-extrabold tracking-wide uppercase italic text-white mt-3">
                ACCESORIOS <span className="text-brand-orange">DESTACADOS</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-400 max-w-md mt-4 md:mt-0 font-light leading-relaxed">
              Cascos, sistemas antirrobo, luces y todo lo necesario para rodar con seguridad por la ciudad y senderos.
            </p>
          </div>

          {accessories.length === 0 ? (
            <div className="text-center py-16 bg-brand-gray/30 border border-neutral-900 rounded-sm">
              <p className="text-neutral-500">Pronto cargaremos nuevos accesorios. ¡Escribinos por WhatsApp!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {accessories.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-brand-dark border border-neutral-900 hover:border-neutral-800 transition-all duration-300 flex flex-col group rounded-sm"
                >
                  {/* Image wrapper */}
                  <div className="relative w-full aspect-[4/3] bg-neutral-950 overflow-hidden border-b border-neutral-900/60 rounded-t-sm">
                    <Image
                      src={acc.imageUrl || "/images/smart-kassel.jpg"}
                      alt={acc.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/35 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Info Wrapper */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider block">
                        {acc.brand}
                      </span>
                      <h3 className="font-title text-lg font-bold text-white tracking-wide uppercase mt-2 group-hover:text-brand-orange transition-colors">
                        {acc.name}
                      </h3>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-900/60 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold font-sans">Precio Especial</p>
                        <p className="font-title text-xl font-bold text-white">{formatPrice(acc.price)}</p>
                      </div>
                      <a
                        href={getWhatsAppLink(acc.name, acc.price)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider transition-colors rounded-sm"
                      >
                        COMPRAR
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />
      <WhatsAppCTA />
    </div>
  );
}
