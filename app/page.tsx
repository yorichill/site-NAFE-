

export default function HomePage() {
  return (
    <div className="px-8 md:px-16 pb-32">
      <section className="relative pt-20 pb-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-nafe-blue mb-6">
          Season 2026 · Valorant Champions Tour
        </p>
        <h1 className="font-display font-black tracking-tighter text-7xl md:text-[10rem] leading-[0.85]">
          FNATIC
          <br />
          <span className="text-nafe-blue">× NAFE</span>
        </h1>
        <p className="mt-8 max-w-xl text-steel-grey text-lg">
          L'héritage compétitif rencontre la direction créative la plus affûtée
          du game. Nouvelle ère, même obsession : la victoire.
        </p>
        <div className="mt-10 flex gap-4">
          <button className="nafe-clip-card bg-nafe-blue text-white font-display uppercase tracking-widest px-8 py-4 hover:shadow-nafe-glow-lg transition-shadow">
            Rejoindre le club
          </button>
          <button className="nafe-clip-card border border-white/20 text-white font-display uppercase tracking-widest px-8 py-4 hover:bg-white/5 transition-colors">
            Voir le match live
          </button>
        </div>
      </section>

      <section className="mt-24">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-steel-grey">
              Shop · Nouveautés
            </p>
            <h2 className="font-display font-black text-5xl tracking-tighter mt-2">
              Boutique Officielle
            </h2>
          </div>
          <button className="text-xs uppercase tracking-wider text-steel-grey hover:text-nafe-blue transition-colors">
            Voir tout le shop →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="nafe-clip-card bg-nafe-surface/60 border border-white/5 p-6 hover:border-nafe-blue/40 transition-colors">
              <div className="aspect-square bg-black/50 mb-6 flex items-center justify-center">
                <span className="font-mono text-steel-grey">Image Produit {i}</span>
              </div>
              <p className="font-display text-2xl font-bold mb-2">Jersey Officiel 2026</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-mono text-nafe-blue">89.99 €</span>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <span key={size} className="text-[10px] font-mono border border-white/20 px-2 py-1">{size}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
