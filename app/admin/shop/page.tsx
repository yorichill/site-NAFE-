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
    <div className="px-8 md:px-16 pb-32 pt-20">
      <h1 className="font-display font-black tracking-tighter text-5xl mb-8">
        Admin Shop
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-nafe-surface/60 border border-white/5 p-8 nafe-clip-card">
          <h2 className="font-display font-black text-2xl mb-6">Ajouter un Produit</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">Nom du Produit</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="Ex: Jersey Officiel 2026" />
            </div>
            
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">Prix (€)</label>
              <input type="number" required step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="Ex: 89.99" />
            </div>
            
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">Tailles Disponibles</label>
              <div className="flex gap-4">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.sizes.includes(size)} onChange={() => handleSizeToggle(size)} className="accent-nafe-blue" />
                    <span className="font-mono text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">URL de l'Image</label>
              <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="https://..." />
            </div>

            <button type="submit" className="w-full nafe-clip-card bg-nafe-blue text-white font-display uppercase tracking-widest px-8 py-4 hover:shadow-nafe-glow transition-shadow mt-4">
              Enregistrer le produit
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-display font-black text-2xl mb-6">Produits Existants</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-steel-grey font-mono text-sm">Chargement...</p>
            ) : products.length === 0 ? (
              <p className="text-steel-grey font-mono text-sm">Aucun produit dans la base de données.</p>
            ) : (
              products.map(p => (
                <div key={p.id} className="bg-black/30 border border-white/10 p-4 flex justify-between items-center">
                  <div>
                    <p className="font-display font-bold">{p.name}</p>
                    <p className="font-mono text-xs text-steel-grey">{p.price} € · Tailles: {p.sizes.join(', ')}</p>
                  </div>
                  <button className="text-xs font-mono text-nafe-blue hover:underline" onClick={async () => {
                    if (confirm("Supprimer ce produit ?")) {
                      await supabase.from("products").delete().eq("id", p.id);
                      fetchProducts();
                    }
                  }}>Supprimer</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
