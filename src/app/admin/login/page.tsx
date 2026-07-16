"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al iniciar sesión");
      }

      // Success, redirect to dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas o error de conexión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 relative">
      
      {/* Background decoration */}
      <div className="absolute w-64 h-64 rounded-full bg-brand-orange/5 blur-[85px] pointer-events-none -z-10" />

      {/* Back to Home link */}
      <a
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors group font-title tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        VOLVER AL SITIO
      </a>

      <div className="w-full max-w-md bg-brand-dark border border-neutral-900 p-8 rounded-sm shadow-2xl relative">
        <div className="text-center mb-8">
          <span className="font-title text-2xl font-extrabold tracking-wider italic text-white block">
            EMB<span className="text-brand-orange">ICI</span>ATE
          </span>
          <h1 className="font-title text-lg tracking-widest text-neutral-400 uppercase mt-2">
            PANEL DE CONTROL
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-sm rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@embiciate.com"
                className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-3 pl-11 pr-4 rounded-sm outline-none transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-3 pl-11 pr-4 rounded-sm outline-none transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-neutral-800 text-white font-title text-sm font-semibold tracking-wider transition-colors rounded-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                INGRESANDO...
              </>
            ) : (
              "INGRESAR AL PANEL"
            )}
          </button>
        </form>
      </div>
      
      <p className="text-xs text-neutral-600 mt-6 tracking-wide">
        Acceso restringido únicamente para administradores autorizados.
      </p>
    </div>
  );
}
