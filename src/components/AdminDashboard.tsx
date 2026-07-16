"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Edit, Trash2, Power, PowerOff, LogOut, Search, Filter, 
  Bike, ShieldAlert, Package, X, Check, Loader2, ArrowUpRight
} from "lucide-react";

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
  active: boolean;
};

type AdminDashboardProps = {
  initialProducts: Product[];
  initialSettings: SiteSettings;
};

type SiteSettings = {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine3: string;
  heroDescription: string;
  heroImageUrl: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function AdminDashboard({ initialProducts, initialSettings }: AdminDashboardProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [heroBadge, setHeroBadge] = useState(initialSettings.heroBadge);
  const [heroTitleLine1, setHeroTitleLine1] = useState(initialSettings.heroTitleLine1);
  const [heroTitleHighlight, setHeroTitleHighlight] = useState(initialSettings.heroTitleHighlight);
  const [heroTitleLine3, setHeroTitleLine3] = useState(initialSettings.heroTitleLine3);
  const [heroDescription, setHeroDescription] = useState(initialSettings.heroDescription);
  const [heroImageUrl, setHeroImageUrl] = useState(initialSettings.heroImageUrl);
  const [heroPrimaryCta, setHeroPrimaryCta] = useState(initialSettings.heroPrimaryCta);
  const [heroSecondaryCta, setHeroSecondaryCta] = useState(initialSettings.heroSecondaryCta);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("BICICLETA");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rodado, setRodado] = useState("");
  const [velocidades, setVelocidades] = useState("");
  const [frenos, setFrenos] = useState("");
  const [active, setActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroImageUploading, setHeroImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroMessage, setHeroMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setBrand("");
    setCategory("BICICLETA");
    setPrice("");
    setStock("");
    setImageUrl("");
    setRodado("29");
    setVelocidades("21");
    setFrenos("Disco Mecánico");
    setActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setImageUrl(product.imageUrl);
    setRodado(product.rodado || "");
    setVelocidades(product.velocidades || "");
    setFrenos(product.frenos || "");
    setActive(product.active);
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setImageUploading(true);

    try {
      const response = await fetch(`/api/uploads?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo subir la imagen");
      }

      setImageUrl(data.url);
    } catch (err) {
      setError(getErrorMessage(err, "Error al subir la imagen"));
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHeroMessage(null);
    setError(null);
    setHeroImageUploading(true);

    try {
      const response = await fetch(`/api/uploads?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo subir la imagen del hero");
      }

      setHeroImageUrl(data.url);
      setHeroMessage("Imagen subida. Guardá los cambios para publicarla.");
    } catch (err) {
      setError(getErrorMessage(err, "Error al subir la imagen del hero"));
    } finally {
      setHeroImageUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHeroMessage(null);
    setHeroSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroBadge,
          heroTitleLine1,
          heroTitleHighlight,
          heroTitleLine3,
          heroDescription,
          heroImageUrl,
          heroPrimaryCta,
          heroSecondaryCta,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo guardar el hero");
      }

      setHeroMessage("Hero actualizado correctamente.");
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, "Error al guardar el hero"));
    } finally {
      setHeroSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!imageUrl) {
      setError("Subí una imagen del producto antes de guardar");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      brand,
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imageUrl,
      rodado: category === "BICICLETA" ? rodado : null,
      velocidades: category === "BICICLETA" ? velocidades : null,
      frenos: category === "BICICLETA" ? frenos : null,
      active,
    };

    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al guardar el producto");
      }

      // Refresh list
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? data : p));
      } else {
        setProducts([data, ...products]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, "Error al conectar con el servidor"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active }),
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(products.map(p => p.id === product.id ? data : p));
        router.refresh();
      }
    } catch (err) {
      console.error("Error toggling product status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalBikes = products.filter(p => p.category === "BICICLETA").length;
  const totalAccs = products.filter(p => p.category === "ACCESORIO").length;
  const totalActive = products.filter(p => p.active).length;
  const lowStock = products.filter(p => p.stock <= 2).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      
      {/* Admin Navbar */}
      <header className="bg-brand-dark border-b border-neutral-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <span className="font-title text-2xl font-extrabold tracking-wider italic text-white">
                EMB<span className="text-brand-orange">ICI</span>ATE
              </span>
              <span className="bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-bold tracking-widest text-brand-orange px-2.5 py-1 rounded-sm">
                PANEL ADMIN
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Ver Sitio Público <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-neutral-800 hidden sm:inline">|</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-title font-semibold tracking-wider transition-colors border border-neutral-800 rounded-sm"
              >
                <LogOut className="w-4 h-4" />
                CERRAR SESIÓN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-brand-gray border border-neutral-900 p-5 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Bicicletas</p>
              <h3 className="font-title text-3xl font-extrabold text-white mt-1">{totalBikes}</h3>
            </div>
            <Bike className="w-8 h-8 text-brand-orange opacity-40 shrink-0" />
          </div>
          <div className="bg-brand-gray border border-neutral-900 p-5 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Accesorios</p>
              <h3 className="font-title text-3xl font-extrabold text-white mt-1">{totalAccs}</h3>
            </div>
            <Package className="w-8 h-8 text-brand-orange opacity-40 shrink-0" />
          </div>
          <div className="bg-brand-gray border border-neutral-900 p-5 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Productos Activos</p>
              <h3 className="font-title text-3xl font-extrabold text-white mt-1">{totalActive}</h3>
            </div>
            <Check className="w-8 h-8 text-green-500 opacity-40 shrink-0" />
          </div>
          <div className="bg-brand-gray border border-neutral-900 p-5 rounded-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Stock Bajo</p>
              <h3 className="font-title text-3xl font-extrabold text-white mt-1">{lowStock}</h3>
            </div>
            <ShieldAlert className="w-8 h-8 text-yellow-500 opacity-40 shrink-0" />
          </div>
        </div>

        {/* Hero Settings */}
        <form onSubmit={handleSaveHero} className="bg-brand-dark border border-neutral-900 p-5 sm:p-6 rounded-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-xs text-brand-orange font-bold uppercase tracking-widest">Portada del sitio</p>
              <h2 className="font-title text-2xl font-extrabold text-white mt-1">Editar Hero</h2>
              <p className="text-sm text-neutral-500 mt-1">Estos textos e imagen aparecen arriba de todo en la página principal.</p>
            </div>
            <button
              type="submit"
              disabled={heroSaving || heroImageUploading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider transition-all duration-200 rounded-sm disabled:bg-neutral-800"
            >
              {heroSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              GUARDAR HERO
            </button>
          </div>

          {heroMessage && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-sm">
              {heroMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Etiqueta chica</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Título 1</label>
                  <input
                    type="text"
                    value={heroTitleLine1}
                    onChange={(e) => setHeroTitleLine1(e.target.value)}
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Título naranja</label>
                  <input
                    type="text"
                    value={heroTitleHighlight}
                    onChange={(e) => setHeroTitleHighlight(e.target.value)}
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Título 3</label>
                  <input
                    type="text"
                    value={heroTitleLine3}
                    onChange={(e) => setHeroTitleLine3(e.target.value)}
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Descripción</label>
                <textarea
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Botón principal</label>
                  <input
                    type="text"
                    value={heroPrimaryCta}
                    onChange={(e) => setHeroPrimaryCta(e.target.value)}
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Botón secundario</label>
                  <input
                    type="text"
                    value={heroSecondaryCta}
                    onChange={(e) => setHeroSecondaryCta(e.target.value)}
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Imagen del Hero</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleHeroImageUpload}
                disabled={heroImageUploading}
                className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2 px-3 rounded-sm outline-none transition-colors file:mr-3 file:border-0 file:bg-brand-orange file:text-white file:text-xs file:font-bold file:px-3 file:py-1.5 file:rounded-sm disabled:opacity-60"
              />
              {heroImageUploading && (
                <p className="text-xs text-brand-orange flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Subiendo imagen...
                </p>
              )}
              <div className="min-h-64 bg-neutral-950 border border-neutral-900 p-4 flex items-center justify-center rounded-sm">
                {heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroImageUrl} alt="Vista previa del hero" className="object-contain max-w-full max-h-72" />
                ) : (
                  <p className="text-sm text-neutral-600 text-center">Sin imagen propia. La portada usará la bicicleta destacada.</p>
                )}
              </div>
              {heroImageUrl && (
                <button
                  type="button"
                  onClick={() => setHeroImageUrl("")}
                  className="text-xs text-neutral-400 hover:text-white underline underline-offset-4"
                >
                  Usar bicicleta destacada en vez de imagen propia
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Filters and Add button bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-brand-dark border border-neutral-900 p-4 rounded-sm">
          {/* Left search/filter */}
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre o marca..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-xs py-2.5 pl-9 pr-4 rounded-sm outline-none transition-colors"
              />
            </div>
            
            <div className="relative w-full sm:max-w-xs flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-600" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-brand-gray border border-neutral-900 text-white text-xs py-2.5 px-3 rounded-sm outline-none cursor-pointer focus:border-brand-orange"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="BICICLETA">Bicicletas</option>
                <option value="ACCESORIO">Accesorios</option>
              </select>
            </div>
          </div>

          {/* Right Action */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider transition-all duration-200 rounded-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            AGREGAR PRODUCTO
          </button>
        </div>

        {/* Product Table List */}
        <div className="bg-brand-dark border border-neutral-900 rounded-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              No se encontraron productos en el inventario.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 bg-brand-gray/50 text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                    <th className="py-4 px-6">Producto</th>
                    <th className="py-4 px-4">Marca / Categoría</th>
                    <th className="py-4 px-4">Precio</th>
                    <th className="py-4 px-4 text-center">Stock</th>
                    <th className="py-4 px-4 text-center">Estado</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-sm">
                  {filteredProducts.map((product) => (
                    <tr 
                      key={product.id} 
                      className={`hover:bg-brand-gray/30 transition-colors ${!product.active ? "opacity-60" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-neutral-950 border border-neutral-900 p-1 flex items-center justify-center rounded-sm shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="object-contain max-w-full max-h-full"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-white leading-tight">{product.name}</p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {product.category === "BICICLETA" 
                                ? `R${product.rodado} • ${product.velocidades} Vel • ${product.frenos}`
                                : "Accesorio / Repuesto"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-neutral-300 font-semibold">{product.brand}</span>
                        <span className="block text-[10px] text-neutral-500 uppercase font-bold mt-1">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(product.price)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-sm text-xs font-bold font-mono ${
                          product.stock === 0 
                            ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                            : product.stock <= 2 
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            : "bg-green-500/10 text-green-500 border border-green-500/20"
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(product)}
                          title={product.active ? "Desactivar de la web" : "Activar en la web"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold cursor-pointer border transition-colors ${
                            product.active 
                              ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" 
                              : "bg-neutral-800 text-neutral-500 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-300"
                          }`}
                        >
                          {product.active ? (
                            <>
                              <Power className="w-3.5 h-3.5" />
                              Activo
                            </>
                          ) : (
                            <>
                              <PowerOff className="w-3.5 h-3.5" />
                              Pausado
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-neutral-400 hover:text-white hover:bg-brand-gray border border-transparent hover:border-neutral-850 transition-colors rounded-sm"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors rounded-sm"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* CRUD Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-brand-dark border border-neutral-900 rounded-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-brand-gray border-b border-neutral-900 flex items-center justify-between">
              <h3 className="font-title text-lg font-bold uppercase tracking-wider text-white">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
              {error && (
                <div className="p-4 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-sm rounded-sm">
                  {error}
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Firebird Col Raiser R29"
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej: Firebird, Topmega, Raleigh"
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none cursor-pointer"
                  >
                    <option value="BICICLETA">Bicicleta</option>
                    <option value="ACCESORIO">Accesorio / Repuesto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Imagen del Producto
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2 px-3 rounded-sm outline-none transition-colors file:mr-3 file:border-0 file:bg-brand-orange file:text-white file:text-xs file:font-bold file:px-3 file:py-1.5 file:rounded-sm disabled:opacity-60"
                    />
                    {imageUploading && (
                      <p className="text-xs text-brand-orange flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Subiendo imagen...
                      </p>
                    )}
                    {imageUrl && (
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-neutral-950 border border-neutral-900 p-1 flex items-center justify-center rounded-sm shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imageUrl} alt="Vista previa" className="object-contain max-w-full max-h-full" />
                        </div>
                        <p className="text-xs text-neutral-500 break-all">{imageUrl}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Precio (en Pesos ARS)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ej: 299900"
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Ej: 5"
                    className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-sm py-2.5 px-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Specs Collapsible Section (Bicicleta only) */}
              {category === "BICICLETA" && (
                <div className="border border-neutral-900 p-4 bg-brand-gray/30 space-y-4 rounded-sm">
                  <h4 className="font-title text-xs font-extrabold uppercase tracking-widest text-brand-orange">
                    Especificaciones Técnicas (Bici)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Rodado
                      </label>
                      <input
                        type="text"
                        value={rodado}
                        onChange={(e) => setRodado(e.target.value)}
                        placeholder="Ej: 29"
                        className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-xs py-2 px-2.5 rounded-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Velocidades
                      </label>
                      <input
                        type="text"
                        value={velocidades}
                        onChange={(e) => setVelocidades(e.target.value)}
                        placeholder="Ej: 21"
                        className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-xs py-2 px-2.5 rounded-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Frenos
                      </label>
                      <input
                        type="text"
                        value={frenos}
                        onChange={(e) => setFrenos(e.target.value)}
                        placeholder="Ej: Disco Mecánico"
                        className="w-full bg-brand-gray border border-neutral-900 focus:border-brand-orange text-white text-xs py-2 px-2.5 rounded-sm outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-neutral-900 text-brand-orange focus:ring-brand-orange bg-brand-gray cursor-pointer"
                />
                <label 
                  htmlFor="active-toggle"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-400 cursor-pointer select-none"
                >
                  Publicar en la web inmediatamente
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-neutral-900 pt-6 flex items-center justify-end gap-4 bg-brand-dark">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-800 hover:border-neutral-700 text-xs font-title font-semibold tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={loading || imageUploading}
                  className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-title text-xs font-semibold tracking-wider rounded-sm transition-all duration-200 shadow-md shadow-brand-orange/15 disabled:bg-neutral-800 flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingProduct ? "GUARDAR CAMBIOS" : "CREAR PRODUCTO"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
