"use client";

import Image from "next/image";
import { useState } from "react";
import { MessageSquare, Settings, X } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/contact";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  rodado: string | null;
  velocidades: string | null;
  frenos: string | null;
};

type ProductShowcaseProps = {
  bicycles: Product[];
  accessories: Product[];
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getWhatsAppLink(productName: string, price: number) {
  return getWhatsAppUrl(
    `¡Hola! Estoy interesado en la ${productName} que vi en la web con precio de ${formatPrice(price)}. Me gustaría recibir asesoramiento.`
  );
}

function ProductCard({ product, onDetails, index }: { product: Product; onDetails: () => void; index: number }) {
  const fallbackImage = product.category === "BICICLETA" ? "/images/firebird.jpeg" : "/images/smart-kassel.jpg";

  return (
    <article
      className="product-card-enter bg-brand-dark border border-neutral-900 hover:border-neutral-800 transition-all duration-300 flex flex-col group rounded-sm overflow-hidden"
      style={{ animationDelay: `${Math.min(index * 80, 400)}ms` }}
    >
      <button
        type="button"
        onClick={onDetails}
        className="relative w-full aspect-[16/11] md:aspect-[4/3] bg-neutral-950 overflow-hidden border-b border-neutral-900/60 rounded-t-sm text-left cursor-pointer"
        aria-label={`Ver detalles de ${product.name}`}
      >
        <Image
          src={product.imageUrl || fallbackImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-transparent pointer-events-none" />
        {product.stock <= 2 && product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-brand-orange/95 text-white font-title text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
            ÚLTIMAS UNIDADES
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center text-white font-title font-bold tracking-widest text-sm">
            SIN STOCK / CONSULTAR
          </span>
        )}
        <span className="absolute right-3 bottom-3 md:right-4 md:bottom-4 bg-neutral-950/80 backdrop-blur border border-white/10 text-white font-title text-[10px] tracking-widest px-3 py-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
          VER DETALLES
        </span>
      </button>

      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>{product.brand}</span>
            {product.rodado && <span>RODADO {product.rodado}</span>}
          </div>

          <h3 className="font-title text-lg md:text-xl font-bold text-white tracking-wide uppercase mt-2 group-hover:text-brand-orange transition-colors">
            {product.name}
          </h3>

          {(product.velocidades || product.frenos) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400 mt-3 pt-3 border-t border-neutral-900/60">
              {product.velocidades && <span>{product.velocidades} Vel.</span>}
              {product.frenos && <span>Frenos: {product.frenos}</span>}
            </div>
          )}
        </div>

        <div className="mt-5 md:mt-6 pt-4 border-t border-neutral-900/60 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Precio Especial</p>
            <p className="font-title text-xl md:text-2xl font-black text-white">{formatPrice(product.price)}</p>
          </div>
          <button
            type="button"
            onClick={onDetails}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider transition-colors rounded-sm cursor-pointer"
          >
            DETALLES
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const fallbackImage = product.category === "BICICLETA" ? "/images/firebird.jpeg" : "/images/smart-kassel.jpg";

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm p-0 md:p-4 flex items-end md:items-center justify-center" role="dialog" aria-modal="true">
      <div className="modal-enter relative w-full max-w-5xl max-h-[96svh] md:max-h-[92vh] overflow-y-auto bg-neutral-950 border border-white/10 rounded-t-2xl md:rounded-sm shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 bg-neutral-950/80 border border-white/10 text-white hover:text-brand-orange rounded-sm transition-colors cursor-pointer"
          aria-label="Cerrar detalles"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-[560px] bg-neutral-900 overflow-hidden">
            <Image
              src={product.imageUrl || fallbackImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-transparent" />
          </div>

          <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 md:gap-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-orange uppercase">
                {product.brand} / {product.category}
              </span>
              <h2 className="font-title text-3xl sm:text-5xl font-extrabold text-white uppercase italic mt-3 leading-none">
                {product.name}
              </h2>
              <p className="font-title text-3xl md:text-4xl font-black text-white mt-5 md:mt-6">{formatPrice(product.price)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-gray border border-neutral-800 p-3 md:p-4 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Stock</p>
                <p className="text-white font-title text-2xl font-bold mt-1">{product.stock}</p>
              </div>
              {product.rodado && (
                <div className="bg-brand-gray border border-neutral-800 p-3 md:p-4 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Rodado</p>
                  <p className="text-white font-title text-2xl font-bold mt-1">{product.rodado}</p>
                </div>
              )}
              {product.velocidades && (
                <div className="bg-brand-gray border border-neutral-800 p-3 md:p-4 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Velocidades</p>
                  <p className="text-white font-title text-2xl font-bold mt-1">{product.velocidades}</p>
                </div>
              )}
              {product.frenos && (
                <div className="bg-brand-gray border border-neutral-800 p-3 md:p-4 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Frenos</p>
                  <p className="text-white font-title text-xl font-bold mt-1">{product.frenos}</p>
                </div>
              )}
            </div>

            <a
              href={getWhatsAppLink(product.name, product.price)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-sm font-semibold tracking-wider transition-colors rounded-sm"
            >
              <MessageSquare className="w-5 h-5" />
              CONSULTAR POR WHATSAPP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductShowcase({ bicycles, accessories }: ProductShowcaseProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <section id="bicicletas" className="bg-neutral-950 py-14 md:py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-orange uppercase border-l-2 border-brand-orange pl-3">
                CATÁLOGO EXCLUSIVO
              </span>
              <h2 className="font-title text-3xl sm:text-5xl font-extrabold tracking-wide uppercase italic text-white mt-3">
                NUESTRAS <span className="text-brand-orange">BICICLETAS</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-400 max-w-md mt-4 md:mt-0 font-light leading-relaxed">
              Modelos seleccionados para MTB, recreación y deporte. Tocá una bicicleta para verla en detalle.
            </p>
          </div>

          {bicycles.length === 0 ? (
            <div className="text-center py-16 bg-brand-gray/30 border border-neutral-900 rounded-sm">
              <Settings className="w-8 h-8 mx-auto text-neutral-600 animate-spin mb-4" />
              <p className="text-neutral-500">Pronto cargaremos nuevas bicicletas. ¡Consultanos por WhatsApp!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {bicycles.map((bike, index) => (
                <ProductCard key={bike.id} product={bike} index={index} onDetails={() => setSelectedProduct(bike)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="accesorios" className="bg-neutral-900/60 py-14 md:py-24 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-orange uppercase border-l-2 border-brand-orange pl-3">
                EQUIPAMIENTO & SEGURIDAD
              </span>
              <h2 className="font-title text-3xl sm:text-5xl font-extrabold tracking-wide uppercase italic text-white mt-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {accessories.map((accessory, index) => (
                <ProductCard key={accessory.id} product={accessory} index={index} onDetails={() => setSelectedProduct(accessory)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
}
