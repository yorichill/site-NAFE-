// NAFE — Association page
// Entièrement personnalisable depuis la console /admin (store.association_settings et store.association_blocks)
// Tous les blocs de texte par défaut ont été vidés au profit de données dynamiques modulaires.

const { useState: useAssoState } = React;

function AssociationPage({ accent }) {
  window.store.useVersion();
  const settings = (window.store.association_settings && window.store.association_settings.get()) || {};
  const rawBlocks = window.store.association_blocks ? window.store.association_blocks.list() : [];
  const blocks = rawBlocks
    .filter(b => b.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const isAdmin = window.store.isAdmin();

  // State pour le module de don
  const pledges = settings.donationPledges && settings.donationPledges.length > 0 ? settings.donationPledges : [];
  const [selectedPledge, setSelectedPledge] = useAssoState(pledges[0]?.id || "custom");
  const [customAmount, setCustomAmount] = useAssoState(25);

  const handleSupportRedirect = () => {
    const targetUrl = settings.donationUrl || "https://www.helloasso.com";
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const hasContent = !!(
    settings.heroTitle ||
    settings.heroLede ||
    settings.donationActive ||
    blocks.length > 0
  );

  return (
    <div className="nafe-page nafe-association-page">
      {/* Hero Section dynamique */}
      {settings.heroTitle || settings.heroLede || isAdmin ? (
        <section className="nafe-team__hero">
          <div className="nafe-association-hero">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                {settings.heroBadge && (
                  <div className="nafe-association-hero__badge">
                    <span className="nafe-mono" style={{ color: accent || "var(--nafe-water-blue)" }}>
                      {settings.heroBadge}
                    </span>
                  </div>
                )}
                <h1 className="nafe-display nafe-team__title" style={{ fontSize: "clamp(34px, 5vw, 64px)" }}>
                  {settings.heroTitle || "L'ASSOCIATION NAFE"}<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
                </h1>
                {settings.heroLede && (
                  <p className="nafe-team__lede" style={{ maxWidth: 840 }}>
                    {settings.heroLede}
                  </p>
                )}
              </div>

              {isAdmin && (
                <div style={{ alignSelf: "center" }}>
                  <a
                    href="#/admin/association"
                    className="nafe-btn nafe-btn--ghost nafe-btn--sm nafe-clip-card"
                    style={{ borderColor: accent, color: accent }}
                  >
                    ⚙ Gérer l'Association (Admin)
                  </a>
                </div>
              )}
            </div>

            {(settings.statutLegal || settings.devise || settings.transparence) && (
              <div className="nafe-association-meta-strip">
                {settings.statutLegal && (
                  <div className="nafe-association-meta-item">
                    <span className="nafe-mono nafe-association-meta-label">STATUT LÉGAL</span>
                    <span className="nafe-display nafe-association-meta-val">{settings.statutLegal}</span>
                  </div>
                )}
                {settings.devise && (
                  <div className="nafe-association-meta-item">
                    <span className="nafe-mono nafe-association-meta-label">DEVISE</span>
                    <span className="nafe-display nafe-association-meta-val" style={{ color: accent }}>{settings.devise}</span>
                  </div>
                )}
                {settings.transparence && (
                  <div className="nafe-association-meta-item">
                    <span className="nafe-mono nafe-association-meta-label">TRANSPARENCE</span>
                    <span className="nafe-display nafe-association-meta-val">{settings.transparence}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* État vide si aucun contenu n'a encore été créé par l'admin */}
      {!hasContent ? (
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 40 }}>
          <span className="nafe-mono" style={{ color: accent }}>STRUCTURE ASSOCIATIVE</span>
          <h2 className="nafe-display" style={{ fontSize: 24, margin: "12px 0 8px" }}>
            {isAdmin ? "AUCUN BLOC ASSOCIATIF CRÉÉ." : "PAGE EN COURS DE MISE À JOUR."}
          </h2>
          <p className="nafe-empty__text" style={{ maxWidth: 540 }}>
            {isAdmin
              ? "Tous les blocs de texte statiques ont été vidés. Vous avez carte blanche pour composer cette page (Présentation, Module de don, Piliers, Statuts, Blocs de texte) depuis la console admin."
              : "La présentation officielle de l'association NAFE ESPORT et de ses statuts sera disponible très prochainement."}
          </p>
          {isAdmin && (
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <a className="nafe-btn nafe-btn--accent" href="#/admin/association" style={{ background: accent }}>
                + Créer les blocs de l'Association
              </a>
            </div>
          )}
        </div>
      ) : null}

      {/* SECTION SOUTIEN FINANCIER DYNAMIQUE (Si activée dans l'admin) */}
      {settings.donationActive && (settings.donationTitle || settings.donationDesc) && (
        <section className="nafe-section nafe-support-section nafe-clip-card">
          <div className="nafe-support-box">
            <div className="nafe-support-box__left">
              {settings.donationEyebrow && (
                <span className="nafe-eyebrow" style={{ color: "var(--nafe-denim-blue)" }}>
                  {settings.donationEyebrow}
                </span>
              )}
              <h2 className="nafe-display nafe-support-box__title">
                {settings.donationTitle || "SOUTENIR L'ASSOCIATION"}<br />
                <span style={{ color: accent || "var(--nafe-water-blue)" }}>FINANCIÈREMENT.</span>
              </h2>
              {settings.donationDesc && (
                <p className="nafe-support-box__desc">
                  {settings.donationDesc}
                </p>
              )}

              {/* Barres d'impact budgétaire */}
              {settings.donationImpact && settings.donationImpact.length > 0 && (
                <div className="nafe-support-impact-grid">
                  {settings.donationImpact.map((f, i) => (
                    <div key={i} className="nafe-impact-item">
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span className="nafe-mono" style={{ fontSize: 11, fontWeight: 700 }}>{f.label}</span>
                        <span className="nafe-mono" style={{ fontSize: 11, color: accent }}>{f.pct}%</span>
                      </div>
                      <div className="nafe-statbar__track" style={{ height: 6, margin: "4px 0 6px" }}>
                        <div className="nafe-statbar__fill" style={{ width: `${f.pct}%`, background: accent }} />
                      </div>
                      {f.desc && <span style={{ fontSize: 11, opacity: 0.6, display: "block" }}>{f.desc}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="nafe-support-box__right nafe-clip-card">
              <h3 className="nafe-display nafe-support-action__title">Faire un don au club</h3>
              <p className="nafe-support-action__subtitle">
                Paiement 100% sécurisé via notre formulaire officiel HelloAsso.
              </p>

              {pledges.length > 0 && (
                <div className="nafe-pledge-selector">
                  {pledges.map((p) => {
                    const isSelected = selectedPledge === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`nafe-pledge-btn ${isSelected ? "is-selected" : ""}`}
                        style={isSelected ? { borderColor: accent, background: `${accent}22` } : {}}
                        onClick={() => setSelectedPledge(p.id)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                          <span className="nafe-mono nafe-pledge-label">{p.label}</span>
                          <span className="nafe-display nafe-pledge-amount" style={isSelected ? { color: accent } : {}}>
                            {p.id === "custom" ? "Montant libre" : `${p.amount} €`}
                          </span>
                        </div>
                        {p.perk && <span className="nafe-pledge-perk">{p.perk}</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedPledge === "custom" && (
                <div style={{ margin: "14px 0" }}>
                  <span className="nafe-mono" style={{ fontSize: 11, display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)" }}>
                    Indiquez votre montant (€) :
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Math.max(1, +e.target.value))}
                    className="nafe-field"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${accent}`,
                      color: "#fff",
                      padding: "10px 14px",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 16
                    }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleSupportRedirect}
                className="nafe-btn nafe-btn--accent nafe-clip-card nafe-support-cta"
                style={{ background: accent, width: "100%", justifyContent: "center", marginTop: 12 }}
              >
                {settings.donationButtonLabel || "Accéder au formulaire de don sécurisé ↗"}
              </button>
              <span className="nafe-mono nafe-support-notice">
                {settings.donationNotice || "Redirection sécurisée vers HelloAsso · Reçu et attestation fournis"}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* RENDU DES BLOCS DYNAMIQUES MODULAIRES CRÉÉS PAR L'ADMIN */}
      {blocks.map((block) => {
        // Bloc 1 : Piliers / Missions
        if (block.type === "pillars") {
          return (
            <section key={block.id} className="nafe-section">
              <header className="nafe-section__head">
                <div>
                  {block.eyebrow && <span className="nafe-eyebrow">{block.eyebrow}</span>}
                  <h2 className="nafe-display nafe-section__title">{block.title}</h2>
                </div>
                {block.subtitle && <span className="nafe-mono nafe-section__count">{block.subtitle}</span>}
              </header>

              {block.content && (
                <p style={{ opacity: 0.8, fontSize: 15, marginBottom: 20 }}>{block.content}</p>
              )}

              <div className="nafe-association-pillars-grid">
                {(block.items || []).map((item, idx) => (
                  <div key={idx} className="nafe-association-pillar-card nafe-clip-card">
                    <span className="nafe-mono nafe-pillar-num" style={{ color: accent }}>
                      {item.num || `0${idx + 1} //`}
                    </span>
                    <h3 className="nafe-display nafe-pillar-title">{item.title}</h3>
                    <p className="nafe-pillar-desc">{item.desc || item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // Bloc 2 : Termes & Statuts
        if (block.type === "terms") {
          return (
            <section key={block.id} className="nafe-section">
              <header className="nafe-section__head">
                <div>
                  {block.eyebrow && <span className="nafe-eyebrow">{block.eyebrow}</span>}
                  <h2 className="nafe-display nafe-section__title">{block.title}</h2>
                </div>
                {block.subtitle && <span className="nafe-mono nafe-section__count">{block.subtitle}</span>}
              </header>

              <div className="nafe-terms-container">
                {block.content && (
                  <p style={{ opacity: 0.75, fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                    {block.content}
                  </p>
                )}

                <div className="nafe-terms-grid">
                  {(block.items || []).map((t, idx) => (
                    <div key={idx} className="nafe-term-card nafe-clip-card">
                      <div className="nafe-term-card__header">
                        <span className="nafe-mono nafe-term-num" style={{ color: accent }}>{t.num || `Article ${idx + 1}`}</span>
                        <span className="nafe-display nafe-term-title">{t.title}</span>
                      </div>
                      <p className="nafe-term-card__text">{t.text || t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // Bloc 3 : Chiffres Clés / Statistiques
        if (block.type === "stats") {
          return (
            <section key={block.id} className="nafe-section">
              <header className="nafe-section__head">
                <div>
                  {block.eyebrow && <span className="nafe-eyebrow">{block.eyebrow}</span>}
                  <h2 className="nafe-display nafe-section__title">{block.title}</h2>
                </div>
                {block.subtitle && <span className="nafe-mono nafe-section__count">{block.subtitle}</span>}
              </header>

              <div className="nafe-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {(block.items || []).map((st, idx) => (
                  <div key={idx} className="nafe-clip-card" style={{ padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="nafe-display" style={{ fontSize: "clamp(32px, 4vw, 48px)", color: accent, marginBottom: 4 }}>
                      {st.stat || st.num || "—"}
                    </div>
                    <div className="nafe-mono" style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                      {st.label || st.title}
                    </div>
                    {st.desc && (
                      <p style={{ fontSize: 12, opacity: 0.65, margin: 0, lineHeight: 1.4 }}>{st.desc}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        // Bloc 4 : Texte libre / Éditorial
        if (block.type === "text") {
          return (
            <section key={block.id} className="nafe-section nafe-clip-card" style={{ padding: "32px 36px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {block.eyebrow && (
                <span className="nafe-eyebrow" style={{ color: accent }}>{block.eyebrow}</span>
              )}
              {block.title && (
                <h2 className="nafe-display" style={{ fontSize: "clamp(24px, 3.5vw, 36px)", margin: "8px 0 16px" }}>
                  {block.title}
                </h2>
              )}
              {block.subtitle && (
                <p className="nafe-mono" style={{ color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
                  {block.subtitle}
                </p>
              )}
              {block.content && (
                <div style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.85, whiteSpace: "pre-line", maxWidth: 900 }}>
                  {block.content}
                </div>
              )}
              {block.buttonLabel && (
                <div style={{ marginTop: 24 }}>
                  <a
                    href={block.buttonUrl || "#/"}
                    className="nafe-btn nafe-btn--accent nafe-clip-card"
                    style={{ background: accent }}
                  >
                    {block.buttonLabel}
                  </a>
                </div>
              )}
            </section>
          );
        }

        // Bloc 5 : CTA / Appel à l'action / Recrutement
        if (block.type === "cta") {
          return (
            <section key={block.id} className="nafe-manifesto" style={{ marginTop: 60 }}>
              <div className="nafe-manifesto__inner" style={{ textAlign: "center" }}>
                {block.eyebrow && (
                  <span className="nafe-eyebrow" style={{ color: accent }}>{block.eyebrow}</span>
                )}
                <h2 className="nafe-display nafe-manifesto__title" style={{ margin: "14px 0 20px" }}>
                  {block.title}
                </h2>
                {block.content && (
                  <p style={{ maxWidth: 640, margin: "0 auto 28px", opacity: 0.8, fontSize: 16 }}>
                    {block.content}
                  </p>
                )}
                <div style={{ display: "inline-flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                  {block.buttonLabel && (
                    <a href={block.buttonUrl || "#/contact"} className="nafe-btn nafe-btn--accent nafe-clip-card" style={{ background: accent }}>
                      {block.buttonLabel}
                    </a>
                  )}
                  {block.button2Label && (
                    <a href={block.button2Url || "https://www.helloasso.com"} target="_blank" rel="noopener noreferrer" className="nafe-btn nafe-btn--ghost nafe-clip-card">
                      {block.button2Label}
                    </a>
                  )}
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}

window.AssociationPage = AssociationPage;
