// NAFE — Sponsors page
// Tranche verticale des partenaires (master-detail) + fiches détaillées
// Lecture seule pour les visiteurs. Gestion (ajout/modif/suppression) réservée à l'espace /admin.

const { useState: useSponsorsState, useEffect: useSponsorsEffect } = React;

function SponsorsPage({ accent }) {
  window.store.useVersion();
  const rawSponsors = window.store.sponsors ? window.store.sponsors.list() : [];
  // Utiliser les sponsors du store, ou fallback sur DEFAULT_SPONSORS si vide
  const allSponsors = rawSponsors.length > 0 ? rawSponsors : (window.DEFAULT_SPONSORS || []);
  const activeSponsors = allSponsors.filter(s => s.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));

  const [selectedId, setSelectedId] = useSponsorsState(activeSponsors[0]?.id || null);
  const [copiedCode, setCopiedCode] = useSponsorsState(false);

  useSponsorsEffect(() => {
    if (!selectedId && activeSponsors.length > 0) {
      setSelectedId(activeSponsors[0].id);
    } else if (selectedId && !activeSponsors.some(s => s.id === selectedId) && activeSponsors.length > 0) {
      setSelectedId(activeSponsors[0].id);
    }
  }, [activeSponsors.length]);

  const currentSponsor = activeSponsors.find(s => s.id === selectedId) || activeSponsors[0] || null;
  const isAdmin = window.store.isAdmin();

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <div className="nafe-page nafe-sponsors-page">
      {/* Hero Section */}
      <section className="nafe-team__hero">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="nafe-eyebrow" style={{ color: accent || "var(--nafe-denim-blue)" }}>
              Écosystème & Partenariats Officiels
            </span>
            <h1 className="nafe-display nafe-team__title">
              NOS SPONSORS<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
            </h1>
            <p className="nafe-team__lede">
              Découvrez les marques et partenaires d'élite qui propulsent nos rosters vers les sommets.
            </p>
          </div>
          {isAdmin && (
            <div style={{ alignSelf: "center" }}>
              <a
                href="#/admin/sponsors"
                className="nafe-btn nafe-btn--ghost nafe-btn--sm nafe-clip-card"
                style={{ borderColor: accent, color: accent }}
              >
                ⚙ Gérer les sponsors (Admin)
              </a>
            </div>
          )}
        </div>
      </section>

      {activeSponsors.length === 0 ? (
        <div className="nafe-empty nafe-empty--panel">
          <span className="nafe-mono" style={{ color: accent }}>AUCUN PARTENAIRE</span>
          <p className="nafe-empty__text">
            {isAdmin
              ? "Aucun sponsor n'est enregistré. Rendez-vous dans la console admin pour en ajouter."
              : "La liste des partenaires officiels 2026 sera bientôt mise à jour."}
          </p>
          {isAdmin && (
            <a className="nafe-btn nafe-btn--accent" href="#/admin/sponsors" style={{ background: accent }}>
              → Ajouter un sponsor
            </a>
          )}
        </div>
      ) : (
        <div className="nafe-sponsors-container">
          {/* Tranche verticale des sponsors (Master) */}
          <aside className="nafe-sponsors-rail" aria-label="Liste des partenaires">
            <div className="nafe-sponsors-rail__header">
              <span className="nafe-mono nafe-sponsors-rail__tag">
                PARTENAIRES [{String(activeSponsors.length).padStart(2, "0")}]
              </span>
            </div>

            <div className="nafe-sponsors-rail__list" role="tablist">
              {activeSponsors.map((sp, idx) => {
                const isSelected = currentSponsor && currentSponsor.id === sp.id;
                return (
                  <button
                    key={sp.id}
                    role="tab"
                    aria-selected={isSelected}
                    className={`nafe-sponsor-tab nafe-clip-card ${isSelected ? "is-active" : ""}`}
                    style={isSelected ? { borderColor: accent, background: `${accent}18` } : {}}
                    onClick={() => setSelectedId(sp.id)}
                  >
                    <div className="nafe-sponsor-tab__num nafe-mono">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="nafe-sponsor-tab__avatar">
                      {sp.logo ? (
                        <img src={sp.logo} alt={sp.name} onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="nafe-sponsor-tab__avatar-fallback" style={{ background: accent }}>
                          {sp.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="nafe-sponsor-tab__meta">
                      <span className="nafe-display nafe-sponsor-tab__name">{sp.name}</span>
                      <span className="nafe-mono nafe-sponsor-tab__tier">{sp.tier || "Partenaire"}</span>
                    </div>
                    {isSelected && (
                      <span className="nafe-sponsor-tab__active-bar" style={{ background: accent }} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="nafe-sponsors-rail__cta nafe-clip-card">
              <span className="nafe-mono" style={{ color: accent, fontSize: 10 }}>DEVENEZ PARTENAIRE</span>
              <p style={{ fontSize: 12, margin: "6px 0 12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                Associez votre marque à l'esprit de conquête de NAFE ESPORT.
              </p>
              <a
                href="#/contact"
                className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                style={{ fontSize: 10, width: "100%", justifyContent: "center" }}
              >
                Dossier Partenariat →
              </a>
            </div>
          </aside>

          {/* Panneau d'affichage détaillé du sponsor sélectionné (Detail) */}
          {currentSponsor && (
            <main className="nafe-sponsor-detail nafe-clip-card">
              {/* Bannière grand format */}
              <div className="nafe-sponsor-banner">
                {currentSponsor.banner ? (
                  <img
                    src={currentSponsor.banner}
                    alt={`Bannière ${currentSponsor.name}`}
                    className="nafe-sponsor-banner__img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="nafe-sponsor-banner__overlay" />
                <div className="nafe-sponsor-banner__badge nafe-mono" style={{ background: accent }}>
                  {currentSponsor.tier || "OFFICIEL"}
                </div>
              </div>

              {/* Contenu principal de la fiche sponsor */}
              <div className="nafe-sponsor-detail__content">
                <div className="nafe-sponsor-detail__head">
                  <div className="nafe-sponsor-detail__brand">
                    <div className="nafe-sponsor-detail__logo-wrap">
                      {currentSponsor.logo ? (
                        <img
                          src={currentSponsor.logo}
                          alt={currentSponsor.name}
                          className="nafe-sponsor-detail__logo"
                        />
                      ) : (
                        <div
                          className="nafe-sponsor-detail__logo-placeholder nafe-display"
                          style={{ background: `${accent}22`, borderColor: accent }}
                        >
                          {currentSponsor.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="nafe-mono nafe-sponsor-detail__category">
                        {currentSponsor.category || "Partenariat d'Excellence"}
                      </span>
                      <h2 className="nafe-display nafe-sponsor-detail__title">
                        {currentSponsor.name}
                      </h2>
                    </div>
                  </div>

                  <div className="nafe-sponsor-detail__actions">
                    {currentSponsor.websiteUrl && (
                      <a
                        href={currentSponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nafe-btn nafe-btn--accent nafe-clip-card"
                        style={{ background: accent }}
                      >
                        Visiter le site →
                      </a>
                    )}
                  </div>
                </div>

                {/* Description complète */}
                <div className="nafe-sponsor-detail__body">
                  <h3 className="nafe-mono nafe-sponsor-detail__section-title">
                    // À PROPOS DU PARTENARIAT
                  </h3>
                  <p className="nafe-sponsor-detail__desc">
                    {currentSponsor.description}
                  </p>
                </div>

                {/* Offre / Code promo communauté */}
                {currentSponsor.promoCode && (
                  <div className="nafe-sponsor-promo nafe-clip-card">
                    <div className="nafe-sponsor-promo__info">
                      <span className="nafe-mono nafe-sponsor-promo__badge">AVANTAGE FAN NAFE</span>
                      <h4 className="nafe-display nafe-sponsor-promo__title">
                        Profitez d'une offre exclusive avec le code
                      </h4>
                      <p className="nafe-sponsor-promo__sub">
                        Valable sur la boutique partenaire lors de votre commande.
                      </p>
                    </div>
                    <div className="nafe-sponsor-promo__code-box">
                      <span className="nafe-mono nafe-sponsor-promo__code">
                        {currentSponsor.promoCode}
                      </span>
                      <button
                        className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                        onClick={() => handleCopy(currentSponsor.promoCode)}
                      >
                        {copiedCode ? "✓ Copié !" : "Copier"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Pied de fiche */}
                <div className="nafe-sponsor-detail__footer">
                  <span className="nafe-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                    PARTENARIAT SAISON 2026 · CERTIFIÉ NAFE ESPORT
                  </span>
                  {isAdmin && (
                    <a
                      href="#/admin/sponsors"
                      className="nafe-mono"
                      style={{ color: accent, textDecoration: "underline" }}
                    >
                      ✎ Modifier cette fiche dans l'Admin
                    </a>
                  )}
                </div>
              </div>
            </main>
          )}
        </div>
      )}
    </div>
  );
}

window.SponsorsPage = SponsorsPage;
