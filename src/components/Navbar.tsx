"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Menu, X } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/contact";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappUrl = getWhatsAppUrl("¡Hola! Vi el sitio web de Embiciate y me gustaría consultar por una bicicleta.");

  const navLinks = [
    { name: "INICIO", href: "#inicio" },
    { name: "BICICLETAS", href: "#bicicletas" },
    { name: "ACCESORIOS", href: "#accesorios" },
    { name: "CONTACTO", href: "#contacto" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 py-2 md:py-3 shadow-lg"
          : "bg-transparent py-3 md:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#inicio" className="flex items-center gap-2">
              <span className="font-title text-xl sm:text-3xl font-extrabold tracking-wider italic text-white">
                EMB<span className="text-brand-orange">ICI</span>ATE
              </span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-title text-sm tracking-widest text-neutral-300 hover:text-brand-orange transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-orange text-white font-title text-sm font-semibold tracking-wider hover:bg-brand-orange-hover hover:scale-105 active:scale-95 transition-all duration-200 rounded-sm"
            >
              <MessageSquare className="w-4 h-4" />
              ESCRIBINOS
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-neutral-950 border-b border-neutral-900 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-80 opacity-100 py-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-3 font-title text-base tracking-widest text-neutral-300 hover:text-brand-orange transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 w-11/12 py-3 bg-brand-orange text-white font-title font-semibold tracking-widest hover:bg-brand-orange-hover transition-colors rounded-sm"
          >
            <MessageSquare className="w-5 h-5" />
            ESCRIBINOS
          </a>
        </div>
      </div>
    </nav>
  );
}
