"use client";

import React from "react";
import { MapPin, Phone, Clock, MessageSquare, ShieldCheck, CreditCard, Truck } from "lucide-react";
import { branches, getWhatsAppUrl } from "@/lib/contact";

export default function Footer() {
  const whatsappUrl = getWhatsAppUrl("¡Hola! Vi el sitio web de Embiciate y me gustaría consultar por una bicicleta.");

  return (
    <footer id="contacto" className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-neutral-900 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-gray rounded-sm text-brand-orange">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-title text-white text-base tracking-wider">HASTA 12 CUOTAS FIJAS</h4>
              <p className="text-sm mt-1 text-neutral-400">Comprá con todas las tarjetas de crédito bancarias.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-gray rounded-sm text-brand-orange">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-title text-white text-base tracking-wider">ENVÍOS A TODO EL PAÍS</h4>
              <p className="text-sm mt-1 text-neutral-400">Coordinamos la entrega de tu bici armada o en caja.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-gray rounded-sm text-brand-orange">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-title text-white text-base tracking-wider">GARANTÍA Y TALLER</h4>
              <p className="text-sm mt-1 text-neutral-400">Servicio post-venta oficial y taller especializado.</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Col */}
          <div>
            <span className="font-title text-3xl font-extrabold tracking-wider italic text-white block mb-4">
              EMB<span className="text-brand-orange">ICI</span>ATE
            </span>
            <p className="text-sm leading-relaxed mb-6">
              Showroom exclusivo de bicicletas de alta gama en Mar del Plata. Distribuidores oficiales de Topmega, Firebird, Raleigh, South, Venzo y SLP.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-sm tracking-widest font-semibold transition-colors rounded-sm"
            >
              <MessageSquare className="w-4 h-4" />
              ESCRIBINOS POR WHATSAPP
            </a>
          </div>

          {/* Branches Col */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {branches.map((branch) => (
              <div key={branch.name} className="bg-brand-gray/50 border border-neutral-900/60 p-6 rounded-sm">
                <h4 className="font-title text-white text-lg tracking-wider mb-4 border-l-2 border-brand-orange pl-3">
                  {branch.name}
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neutral-300">{branch.address}</p>
                      <a
                        href={branch.gmaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-orange hover:underline mt-1 block"
                      >
                        Ver en Google Maps →
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                    <a href={`tel:${branch.whatsapp}`} className="text-neutral-300 hover:text-white transition-colors">
                      {branch.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <p className="text-neutral-300">{branch.hours}</p>
                  </li>
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-900 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Embiciate Mar del Plata. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/admin" className="hover:text-white transition-colors">Panel Admin</a>
            <span>•</span>
            <span className="text-neutral-600">Desarrollado con Next.js & Tailwind</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
