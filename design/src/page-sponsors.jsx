// NAFE — Sponsors page
// Tranche des partenaires (master-detail) + fiches détaillées
// Contenu entièrement administrable depuis la console /admin (store.sponsors et store.sponsors_settings)

const { useState: useSponsorsState, useEffect: useSponsorsEffect } = React;

function SponsorsPage({ accent }) {
  window.store.useVersion();
  const rawSponsors = window.store.sponsors ? window.store.sponsors.list() : [];
  const activeSponsors = rawSponsors
    .filter(s => s.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const settings = (window.store.sponsors_settings && window.store.sponsors_settings.get()) || {};
  const isAdmin = window.store.isAdmin();

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

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const hasContent = activeSponsors.length > 0 || settings.heroTitle || settings.heroLede;

  return (
    <div className="nafe-page nafe-sponsors-page">
      {/* Hero Section dynamique */}
      <section className="nafe-team__hero">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            {settings.heroEyebrow && (
              <span className="nafe-eyebrow" style={{ color: accent || "var(--nafe-denim-blue)" }}>
                {settings.heroEyebrow}
              </span>
            )}
            <h1 className="nafe-display nafe-team__title">
              {settings.heroTitle || "NOS SPONSORS"}<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
            </h1>
            {settings.heroLede && (
              <p className="nafe-team__lede">
                {settings.heroLede}
              </p>
            )}
          </div>
          {isAdmin && (
            <div style={{ alignSelf: "center" }}>
              <a
                href="#/admin/sponsors"
                className="nafe-btn nafe-btn--ghost nafe-btn--sm nafe-clip-card"
                style={{ borderColor: accent, color: accent }}
              >
                Gérer les sponsors & blocs (Admin)
              </a>
            </div>
          )}
        </div>
      </section>

      {!hasContent || activeSponsors.length === 0 ? (
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 40 }}>
          <span className="nafe-mono" style={{ color: accent }}>ESPACE PARTENAIRES</span>
          <h2 className="nafe-display" style={{ fontSize: 24, margin: "12px 0 8px" }}>
            {isAdmin ? "AUCUN SPONSOR OU BLOC ENREGISTRÉ." : "PAGE EN COURS DE MISE À JOUR."}
          </h2>
          <p className="nafe-empty__text" style={{ maxWidth: 540 }}>
            {isAdmin
              ? "Tous les blocs de texte par défaut ont été vidés. Vous pouvez créer les fiches partenaires, définir les paliers et configurer l'en-tête de la page depuis la console admin."
              : "La liste officielle des partenaires et sponsors du club sera bientôt mise en ligne."}
          </p>
          {isAdmin && (
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <a className="nafe-btn nafe-btn--accent" href="#/admin/sponsors" style={{ background: accent }}>
                + Créer un sponsor dans l'Admin
              </a>
            </div>
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
                          {(sp.name || "SP").slice(0, 2).toUpperCase()}
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

            {/* Bloc CTA personnalisé par l'admin (si configuré) */}
            {(settings.ctaTitle || settings.ctaDesc || isAdmin) && (
              <div className="nafe-sponsors-rail__cta nafe-clip-card">
                <span className="nafe-mono" style={{ color: accent, fontSize: 10 }}>
                  {settings.ctaTitle || (isAdmin ? "DEVENEZ PARTENAIRE" : "")}
                </span>
                {settings.ctaDesc && (
                  <p style={{ fontSize: 12, margin: "6px 0 12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                    {settings.ctaDesc}
                  </p>
                )}
                <a
                  href={settings.ctaButtonUrl || "#/contact"}
                  className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                  style={{ fontSize: 10, width: "100%", justifyContent: "center" }}
                >
                  {settings.ctaButtonLabel || "Dossier Partenariat →"}
                </a>
              </div>
            )}
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
                          {(currentSponsor.name || "SP").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      {currentSponsor.category && (
                        <span className="nafe-mono nafe-sponsor-detail__category">
                          {currentSponsor.category}
                        </span>
                      )}
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

                {/* Description complète configurée */}
                {currentSponsor.description && (
                  <div className="nafe-sponsor-detail__body">
                    <h3 className="nafe-mono nafe-sponsor-detail__section-title">
                      // PRÉSENTATION DU PARTENARIAT
                    </h3>
                    <p className="nafe-sponsor-detail__desc">
                      {currentSponsor.description}
                    </p>
                  </div>
                )}

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
                        {copiedCode ? "Copié !" : "Copier"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Pied de fiche configurable */}
                <div className="nafe-sponsor-detail__footer">
                  <span className="nafe-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {settings.footerNotice || "PARTENARIAT SAISON 2026 · CERTIFIÉ NAFE ESPORT"}
                  </span>
                  {isAdmin && (
                    <a
                      href="#/admin/sponsors"
                      className="nafe-mono"
                      style={{ color: accent, textDecoration: "underline" }}
                    >
                      Modifier cette fiche dans l'Admin
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
