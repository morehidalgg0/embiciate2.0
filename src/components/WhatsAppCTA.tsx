"use client";

import React from "react";
import { getWhatsAppUrl } from "@/lib/contact";

export default function WhatsAppCTA() {
  const whatsappUrl = getWhatsAppUrl("¡Hola! Vi el sitio web de Embiciate y me gustaría consultar por una bicicleta.");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hidden md:flex items-center justify-center w-14 h-14 bg-brand-orange text-white rounded-full shadow-2xl hover:bg-brand-orange-hover hover:scale-110 transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75 animate-ping group-hover:hidden"></span>
      
      {/* Icon SVG */}
      <svg
        className="w-7 h-7 relative z-10 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.07 .953 11.47.953c-5.447 0-9.875 4.372-9.88 9.802-.002 1.722.459 3.401 1.333 4.888L1.966 21.6l6.081-1.58c.001.002.001.002.001.002zM17.11 14.15c-.279-.14-1.654-.816-1.91-.908-.255-.093-.442-.14-.627.14-.186.28-.718.908-.88 1.093-.162.186-.324.21-.603.07-.279-.14-1.18-.435-2.247-1.387-.83-.74-1.39-1.653-1.553-1.933-.163-.28-.018-.431.122-.571.125-.126.279-.327.419-.49.14-.164.186-.28.279-.467.094-.187.047-.35-.023-.49-.07-.14-.627-1.511-.86-2.072-.226-.546-.453-.472-.627-.48l-.533-.008c-.186 0-.489.07-.745.35-.256.28-.977.956-.977 2.333s1.002 2.709 1.14 2.9c.14.19 1.972 3.01 4.777 4.22.667.288 1.19.46 1.597.59.67.213 1.28.183 1.761.11.537-.08 1.654-.675 1.888-1.328.232-.653.232-1.213.162-1.328-.07-.11-.256-.21-.535-.35z" />
      </svg>
    </a>
  );
}
