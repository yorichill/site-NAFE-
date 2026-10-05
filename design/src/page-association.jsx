// NAFE — Association page
// Présentation de l'association loi 1901, charte, termes et module de soutien financier

const { useState: useAssoState } = React;

function AssociationPage({ accent }) {
  window.store.useVersion();
  const data = window.NAFE_ASSOCIATION_DATA || {};
  const [selectedPledge, setSelectedPledge] = useAssoState("custom");
  const [customAmount, setCustomAmount] = useAssoState(25);

  const PLEDGES = [
    { id: "p1", amount: 10, label: "Supporter", perk: "Badge Discord exclusif & accès aux salons privés" },
    { id: "p2", amount: 25, label: "Adhérent", perk: "Pack stickers officiels + vote consultatif assemblée" },
    { id: "p3", amount: 50, label: "Bienfaiteur", perk: "Nom crédité au générique des vidéos + jersey dédicacé" },
    { id: "custom", amount: customAmount, label: "Don libre", perk: "Chaque euro contribue directement aux déplacements" }
  ];

  const handleSupportRedirect = () => {
    // Redirection vers HelloAsso ou plateforme officielle de l'association
    const targetUrl = data.donationUrl || "https://www.helloasso.com";
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="nafe-page nafe-association-page">
      {/* Hero Section */}
      <section className="nafe-team__hero">
        <div className="nafe-association-hero">
          <div className="nafe-association-hero__badge">
            <span className="nafe-mono" style={{ color: accent || "var(--nafe-water-blue)" }}>
              STRUCTURE ASSOCIATIVE OFFICIELLE
            </span>
          </div>
          <h1 className="nafe-display nafe-team__title" style={{ fontSize: "clamp(34px, 5vw, 64px)" }}>
            L'ASSOCIATION NAFE<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
          </h1>
          <p className="nafe-team__lede" style={{ maxWidth: 840 }}>
            {data.intro}
          </p>

          <div className="nafe-association-meta-strip">
            <div className="nafe-association-meta-item">
              <span className="nafe-mono nafe-association-meta-label">STATUT LÉGAL</span>
              <span className="nafe-display nafe-association-meta-val">Loi 1901</span>
            </div>
            <div className="nafe-association-meta-item">
              <span className="nafe-mono nafe-association-meta-label">DEVISE</span>
              <span className="nafe-display nafe-association-meta-val" style={{ color: accent }}>Le Phœnix ne meurt jamais</span>
            </div>
            <div className="nafe-association-meta-item">
              <span className="nafe-mono nafe-association-meta-label">TRANSPARENCE</span>
              <span className="nafe-display nafe-association-meta-val">100% Réinvesti</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION SOUTIEN FINANCIER (PRIORITAIRE) */}
      <section className="nafe-section nafe-support-section nafe-clip-card">
        <div className="nafe-support-box">
          <div className="nafe-support-box__left">
            <span className="nafe-eyebrow" style={{ color: "var(--nafe-denim-blue)" }}>
              // IMPACT DIRECT & SOLIDAIRE
            </span>
            <h2 className="nafe-display nafe-support-box__title">
              SOUTENIR L'ASSOCIATION<br />
              <span style={{ color: accent || "var(--nafe-water-blue)" }}>FINANCIÈREMENT.</span>
            </h2>
            <p className="nafe-support-box__desc">
              NAFE ESPORT fonctionne grâce à la passion de ses bénévoles et à la générosité de ses supporters. Vos contributions permettent directement de financer les déplacements de nos équipes en LAN physique, de fournir des maillots personnalisés à chaque compétiteur et de maintenir des infrastructures d'entraînement de premier ordre.
            </p>

            <div className="nafe-support-impact-grid">
              {(data.fundingImpact || []).map((f, i) => (
                <div key={i} className="nafe-impact-item">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="nafe-mono" style={{ fontSize: 11, fontWeight: 700 }}>{f.label}</span>
                    <span className="nafe-mono" style={{ fontSize: 11, color: accent }}>{f.pct}%</span>
                  </div>
                  <div className="nafe-statbar__track" style={{ height: 6, margin: "4px 0 6px" }}>
                    <div className="nafe-statbar__fill" style={{ width: `${f.pct}%`, background: accent }} />
                  </div>
                  <span style={{ fontSize: 11, opacity: 0.6, display: "block" }}>{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="nafe-support-box__right nafe-clip-card">
            <h3 className="nafe-display nafe-support-action__title">Faire un don au club</h3>
            <p className="nafe-support-action__subtitle">
              Paiement 100% sécurisé via notre page officielle HelloAsso.
            </p>

            <div className="nafe-pledge-selector">
              {PLEDGES.map((p) => {
                const isSelected = selectedPledge === p.id;
                return (
                  <button
                    key={p.id}
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
                    <span className="nafe-pledge-perk">{p.perk}</span>
                  </button>
                );
              })}
            </div>

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
              onClick={handleSupportRedirect}
              className="nafe-btn nafe-btn--accent nafe-clip-card nafe-support-cta"
              style={{ background: accent, width: "100%", justifyContent: "center", marginTop: 12 }}
            >
              Accéder au formulaire de don sécurisé ↗
            </button>
            <span className="nafe-mono nafe-support-notice">
              Redirection sécurisée vers HelloAsso · Reçu et attestation fournis
            </span>
          </div>
        </div>
      </section>

      {/* SECTION NOS MISSIONS & VALEURS */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Objectifs 2026</span>
            <h2 className="nafe-display nafe-section__title">NOS MISSIONS</h2>
          </div>
          <span className="nafe-mono nafe-section__count">4 PILIERS ASSOCIATIFS</span>
        </header>

        <div className="nafe-association-pillars-grid">
          {(data.pillars || []).map((pil, idx) => (
            <div key={idx} className="nafe-association-pillar-card nafe-clip-card">
              <span className="nafe-mono nafe-pillar-num" style={{ color: accent }}>0{idx + 1} //</span>
              <h3 className="nafe-display nafe-pillar-title">{pil.title}</h3>
              <p className="nafe-pillar-desc">{pil.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION TERMES & STATUTS ASSOCIATIFS */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Règlement Intérieur & Statuts</span>
            <h2 className="nafe-display nafe-section__title">TERMES DE L'ASSOCIATION</h2>
          </div>
          <span className="nafe-mono nafe-section__count">CHARTE LOI 1901</span>
        </header>

        <div className="nafe-terms-container">
          <p style={{ opacity: 0.75, fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
            Toute adhésion, partenariat ou participation aux activités de NAFE ESPORT implique l'adhésion pleine et entière à notre charte éthique et à nos statuts déposés.
          </p>

          <div className="nafe-terms-grid">
            {(data.terms || []).map((t, idx) => (
              <div key={idx} className="nafe-term-card nafe-clip-card">
                <div className="nafe-term-card__header">
                  <span className="nafe-mono nafe-term-num" style={{ color: accent }}>{t.num}</span>
                  <span className="nafe-display nafe-term-title">{t.title}</span>
                </div>
                <p className="nafe-term-card__text">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA REJOINDRE OU CONTACTER */}
      <section className="nafe-manifesto" style={{ marginTop: 80 }}>
        <div className="nafe-manifesto__inner" style={{ textAlign: "center" }}>
          <span className="nafe-eyebrow" style={{ color: accent }}>Rejoindre l'aventure</span>
          <h2 className="nafe-display nafe-manifesto__title" style={{ margin: "14px 0 20px" }}>
            Envie de vous investir comme bénévole ou membre ?
          </h2>
          <p style={{ maxWidth: 640, margin: "0 auto 28px", opacity: 0.8, fontSize: 16 }}>
            Coachs, managers, casters, graphistes et bénévoles : notre association recrute constamment pour développer ses projets esportifs.
          </p>
          <div style={{ display: "inline-flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#/contact" className="nafe-btn nafe-btn--accent nafe-clip-card" style={{ background: accent }}>
              Nous Contacter →
            </a>
            <button onClick={handleSupportRedirect} className="nafe-btn nafe-btn--ghost nafe-clip-card">
              Faire un don à l'association ↗
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

window.AssociationPage = AssociationPage;
