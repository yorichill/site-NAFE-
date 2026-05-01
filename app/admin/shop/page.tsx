"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  image_url: string;
};

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    sizes: ["S", "M", "L", "XL"],
    imageUrl: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([
      {
        name: formData.name,
        price: parseFloat(formData.price),
        sizes: formData.sizes,
        image_url: formData.imageUrl
      }
    ]);
    if (error) {
      alert("Erreur lors de l'ajout du produit : " + error.message);
    } else {
      alert("Produit ajouté !");
      setFormData({ name: "", price: "", sizes: ["S", "M", "L", "XL"], imageUrl: "" });
      fetchProducts();
    }
  }

  function handleSizeToggle(size: string) {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  }

  return (
    <div className="nafe-page">
      <section className="nafe-club__hero mt-8">
        <div className="nafe-club__heroTop">
          <span className="nafe-eyebrow" style={{ color: "var(--accent)" }}>Console Admin</span>
          <span className="nafe-club__id">v2.0</span>
        </div>
        <h1 className="nafe-display nafe-club__title">Boutique</h1>
      </section>

      {/* Tabs mockup */}
      <div className="nafe-tabs mt-8">
        <div className="nafe-tab is-active" style={{ borderColor: "var(--accent)", color: "#fff" }}>
          <span className="nafe-mono nafe-tab__num">01</span>
          <span className="nafe-display nafe-tab__label">Shop</span>
          <span className="nafe-mono nafe-tab__meta">Produits · Commandes</span>
          <span className="nafe-tab__bar" style={{ background: "var(--accent)" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <section className="nafe-section mt-0">
          <header className="nafe-section__head">
            <div>
              <span className="nafe-eyebrow">Catalogue</span>
              <h2 className="nafe-display nafe-section__title text-4xl">Ajouter Produit</h2>
            </div>
          </header>
          
          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <div>
              <label className="block nafe-mono text-xs text-steel-grey mb-2">NOM DU PRODUIT</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="Ex: Jersey Officiel 2026" />
            </div>
            
            <div>
              <label className="block nafe-mono text-xs text-steel-grey mb-2">PRIX (€)</label>
              <input type="number" required step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="Ex: 89.99" />
            </div>
            
            <div>
              <label className="block nafe-mono text-xs text-steel-grey mb-2">TAILLES DISPONIBLES</label>
              <div className="flex gap-4">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.sizes.includes(size)} onChange={() => handleSizeToggle(size)} className="accent-nafe-blue" />
                    <span className="nafe-mono text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block nafe-mono text-xs text-steel-grey mb-2">URL DE L'IMAGE</label>
              <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="https://..." />
            </div>

            <button type="submit" className="nafe-btn nafe-btn--accent nafe-clip-card w-full mt-4 justify-center">
              Enregistrer le produit
            </button>
          </form>
        </section>

        <section className="nafe-section mt-0">
          <header className="nafe-section__head">
            <div>
              <span className="nafe-eyebrow">Base de données</span>
              <h2 className="nafe-display nafe-section__title text-4xl">Inventaire</h2>
            </div>
            <span className="nafe-mono nafe-section__count">
              {String(products.length).padStart(2, "0")} PRODUIT{products.length > 1 ? "S" : ""}
            </span>
          </header>

          <div className="space-y-4 mt-8">
            {loading ? (
              <p className="nafe-mono text-sm text-steel-grey">Chargement...</p>
            ) : products.length === 0 ? (
              <div className="nafe-empty nafe-empty--panel">
                <span className="nafe-mono" style={{ color: "var(--accent)" }}>AUCUN PRODUIT</span>
                <p className="nafe-empty__text">L'inventaire est vide. Ajoutez des produits via le formulaire.</p>
              </div>
            ) : (
              products.map(p => (
                <div key={p.id} className="bg-white/5 border border-white/10 p-4 flex justify-between items-center nafe-clip-card">
                  <div>
                    <p className="font-display font-bold text-xl">{p.name}</p>
                    <p className="nafe-mono text-[10px] uppercase tracking-widest text-steel-grey mt-1">{p.price} € · Tailles: {p.sizes.join(', ')}</p>
                  </div>
                  <button className="nafe-btn nafe-btn--ghost nafe-btn--sm" onClick={async () => {
                    if (confirm("Supprimer ce produit ?")) {
                      await supabase.from("products").delete().eq("id", p.id);
                      fetchProducts();
                    }
                  }}>X</button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
