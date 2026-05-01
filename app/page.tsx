import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 0; // Disable cache for prototype

export default async function HomePage() {
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(3);

  // Mock live match for prototype
  const live = { event: "VALORANT CHAMPIONS", result: "13 - 11", opp: "T1", loc: "SEOUL · KR" };
  const trophies = 12;

  return (
    <div className="nafe-page">
      {/* HERO — brutalist typographic wall */}
      <section className="nafe-hero">
        <div className="nafe-hero__meta">
          <span className="nafe-eyebrow" style={{ color: "var(--accent)" }}>
            Saison 2026 · NAFE TEAM
          </span>
          {live && (
            <span className="nafe-eyebrow nafe-hero__ts">
              <span className="nafe-pulse" /> EN DIRECT
            </span>
          )}
        </div>

        <h1 className="nafe-hero__title nafe-display">
          NAFE
          <br />
          <span style={{ color: "var(--accent)" }}>TEAM<span className="nafe-hero__dot">.</span></span>
        </h1>

        <div className="nafe-hero__grid">
          <p className="nafe-hero__lede">
            L'héritage compétitif rencontre la direction créative la plus
            affûtée du game. Nouvelle ère, même obsession&nbsp;: la victoire.
          </p>

          {live ? (
            <Link href="/live" className="nafe-hero__matchCard block">
              <div className="nafe-hero__matchHead">
                <span className="nafe-mono" style={{ color: "var(--accent)" }}>● LIVE</span>
                <span className="nafe-mono">{live.event}</span>
              </div>
              <div className="nafe-hero__matchBody">
                <div className="nafe-hero__side">
                  <span className="nafe-mono">NAFE</span>
                  <span className="nafe-display nafe-hero__matchScore" style={{ color: "var(--accent)" }}>
                    {(live.result || "").split(/[-–]/)[0]?.trim() || "—"}
                  </span>
                </div>
                <span className="nafe-mono nafe-hero__matchSep">—</span>
                <div className="nafe-hero__side">
                  <span className="nafe-mono">{live.opp}</span>
                  <span className="nafe-display nafe-hero__matchScore">
                    {(live.result || "").split(/[-–]/)[1]?.trim() || "—"}
                  </span>
                </div>
              </div>
              <div className="nafe-hero__matchFoot">
                <span className="nafe-mono">{live.loc}</span>
                <span className="nafe-mono">REGARDER →</span>
              </div>
            </Link>
          ) : (
            <div className="nafe-hero__matchCard nafe-empty nafe-empty--card">
              <span className="nafe-mono" style={{ color: "var(--accent)" }}>AUCUN MATCH LIVE</span>
              <p className="nafe-empty__text">Aucun match en direct pour l'instant. Reviens plus tard !</p>
            </div>
          )}
        </div>

        <div className="nafe-hero__cta">
          <button className="nafe-btn nafe-btn--accent nafe-clip-card">
            Rejoindre le club
          </button>
          <Link href="/calendar" className="nafe-btn nafe-btn--ghost nafe-clip-card">
            Voir le planning
          </Link>
          <div className="nafe-hero__stats">
            <div>
              <p className="nafe-mono nafe-hero__statL">JOUEURS</p>
              <p className="nafe-display nafe-hero__statV">18</p>
            </div>
            <div>
              <p className="nafe-mono nafe-hero__statL">TROPHÉES</p>
              <p className="nafe-display nafe-hero__statV">
                {String(trophies).padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="nafe-mono nafe-hero__statL">MATCHS PROG.</p>
              <p className="nafe-display nafe-hero__statV" style={{ color: "var(--accent)" }}>04</p>
            </div>
          </div>
        </div>

        <div className="nafe-hero__rail">
          <span className="nafe-mono">N/T · 01</span>
          <span className="nafe-mono">·</span>
          <span className="nafe-mono">ISSUE #012</span>
          <span className="nafe-mono">·</span>
          <span className="nafe-mono">PARIS · EU</span>
        </div>
      </section>

      {/* Manifesto strip */}
      <section className="nafe-manifesto">
        <div className="nafe-manifesto__inner">
          <span className="nafe-eyebrow">Manifeste · 2026</span>
          <h2 className="nafe-display nafe-manifesto__title">
            Le skill, c'est la <span style={{ color: "var(--accent)" }}>constance</span>.<br/>
            Le style, c'est la <span style={{ color: "var(--accent)" }}>signature</span>.
          </h2>
          <div className="nafe-manifesto__columns">
            <div>
              <span className="nafe-mono nafe-manifesto__num" style={{ color: "var(--accent)" }}>01 ·</span>
              <h3 className="nafe-display nafe-manifesto__h3">Jouer fort</h3>
              <p>Une méthodologie d'entraînement importée du sport de haut niveau. Analyse vidéo, préparation mentale, S&C.</p>
            </div>
            <div>
              <span className="nafe-mono nafe-manifesto__num" style={{ color: "var(--accent)" }}>02 ·</span>
              <h3 className="nafe-display nafe-manifesto__h3">Créer plus fort</h3>
              <p>Un studio interne dédié au contenu long-format. Documentaires, podcasts, drops capsule co-signés.</p>
            </div>
            <div>
              <span className="nafe-mono nafe-manifesto__num" style={{ color: "var(--accent)" }}>03 ·</span>
              <h3 className="nafe-display nafe-manifesto__h3">Vivre ensemble</h3>
              <p>Un club de membres actifs. Events physiques, loot tangible, hospitality en finale.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="nafe-section">
        <div className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Shop · Nouveautés</span>
            <h2 className="nafe-display nafe-section__title">
              Boutique Officielle
            </h2>
          </div>
          <Link href="/shop" className="nafe-section__link">Voir tout le shop →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products && products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <p className="font-mono text-steel-grey">La boutique est actuellement vide. Ajoutez des produits depuis l'espace Admin.</p>
          )}
        </div>
      </section>
    </div>
  );
}
