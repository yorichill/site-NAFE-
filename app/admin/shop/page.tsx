export default function AdminShopPage() {
  return (
    <div className="px-8 md:px-16 pb-32 pt-20">
      <h1 className="font-display font-black tracking-tighter text-5xl mb-8">
        Admin Shop
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-nafe-surface/60 border border-white/5 p-8 nafe-clip-card">
          <h2 className="font-display font-black text-2xl mb-6">Ajouter un Produit</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">Nom du Produit</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="Ex: Jersey Officiel 2026" />
            </div>
            
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">Prix (€)</label>
              <input type="number" step="0.01" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="Ex: 89.99" />
            </div>
            
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">Tailles Disponibles</label>
              <div className="flex gap-4">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <label key={size} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-nafe-blue" defaultChecked />
                    <span className="font-mono text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">URL de l'Image</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" placeholder="https://..." />
            </div>

            <button type="button" className="w-full nafe-clip-card bg-nafe-blue text-white font-display uppercase tracking-widest px-8 py-4 hover:shadow-nafe-glow transition-shadow mt-4">
              Enregistrer le produit
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-display font-black text-2xl mb-6">Produits Existants</h2>
          <div className="space-y-4">
            <div className="bg-black/30 border border-white/10 p-4 flex justify-between items-center">
              <div>
                <p className="font-display font-bold">Jersey Officiel 2026</p>
                <p className="font-mono text-xs text-steel-grey">89.99 € · Tailles: S, M, L, XL</p>
              </div>
              <button className="text-xs font-mono text-nafe-blue hover:underline">Modifier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
