// NAFE — Association page (Page simple unifiée)
// Personnalisable depuis la console /admin : Titre, Textes, Images PNG et Bouton de don.
// Ne comporte plus de blocs séparés complexes : tout est fluide sur une seule page.

function AssociationPage({ accent }) {
  window.store.useVersion();
  const settings = (window.store.association_settings && window.store.association_settings.get()) || {};
  const isAdmin = window.store.isAdmin();

  // Extraction des données de la page simple
  const title = settings.title || settings.heroTitle || "";
  const badge = settings.badge || settings.heroBadge || "";
  const subtitle = settings.subtitle || settings.heroLede || "";
  const bannerImage = settings.bannerImage || "";
  const mainText = settings.mainText || "";
  const images = Array.isArray(settings.images) ? settings.images : [];
  const textSections = Array.isArray(settings.textSections) ? settings.textSections : [];
  
  // Bouton de soutien financier / don
  const donationActive = settings.donationActive !== false && (settings.donationUrl || settings.donationButtonText || settings.donationButtonLabel);
  const donationUrl = settings.donationUrl || "https://www.helloasso.com";
  const donationButtonText = settings.donationButtonText || settings.donationButtonLabel || "Soutenir l'Association (HelloAsso) ";
  const donationNote = settings.donationNote || settings.donationDesc || "NAFE ESPORT est une association régie par la loi du 1er juillet 1901. Vos dons sont réinvestis dans le projet sportif et les déplacements en LAN de nos joueurs.";

  // Vérifier si la page a du contenu
  const hasContent = !!(
    (title && title.trim()) ||
    (mainText && mainText.trim()) ||
    (bannerImage && bannerImage.trim()) ||
    images.length > 0 ||
    textSections.length > 0
  );

  const handleSupportRedirect = () => {
    window.open(donationUrl, "_blank", "noopener,noreferrer");
  };

  // Helper pour formater les paragraphes de texte
  const renderFormattedParagraphs = (rawText) => {
    if (!rawText) return null;
    const paras = rawText.split(/\n\s*\n/);
    return paras.map((p, idx) => {
      const lines = p.split("\n");
      return (
        <div key={idx} className="nafe-association-paragraph" style={{ marginBottom: 18 }}>
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            // Ligne avec puce
            if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
              return (
                <div key={lIdx} style={{ display: "flex", gap: 10, alignItems: "flex-start", margin: "6px 0 6px 12px" }}>
                  <span style={{ color: accent || "var(--nafe-water-blue)", fontWeight: "bold" }}>◈</span>
                  <span style={{ color: "#E1F2FB", lineHeight: 1.7, fontSize: 15 }}>
                    {trimmed.replace(/^[•\-\*]\s*/, "")}
                  </span>
                </div>
              );
            }
            // Sous-titre dans le texte (commence par ## ou #)
            if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
              return (
                <h3 key={lIdx} className="nafe-display" style={{ fontSize: 20, color: "#fff", margin: "22px 0 8px", letterSpacing: "0.02em" }}>
                  {trimmed.replace(/^#+\s*/, "")}
                </h3>
              );
            }
            // Paragraphe normal
            return (
              <p key={lIdx} style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.8, margin: "0 0 10px" }}>
                {line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="nafe-page nafe-association-page" style={{ maxWidth: 1100, marginInline: "auto", paddingBottom: 80 }}>
      {/* Barre d'administration pour accès rapide si connecté */}
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <a
            href="#/admin/association"
            className="nafe-btn nafe-btn--ghost nafe-btn--sm nafe-clip-card"
            style={{ borderColor: accent || "var(--nafe-water-blue)", color: accent || "var(--nafe-water-blue)" }}
          >
            Modifier la page Association (Admin)
          </a>
        </div>
      )}

      {/* Écran d'attente / vide si rien n'a été publié */}
      {!hasContent ? (
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 40, textAlign: "center", padding: "60px 24px" }}>
          <span className="nafe-mono" style={{ color: accent || "var(--nafe-water-blue)", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em" }}>
            STRUCTURE ASSOCIATIVE
          </span>
          <h2 className="nafe-display" style={{ fontSize: "clamp(28px, 4vw, 42px)", margin: "14px 0 12px" }}>
            PAGE EN COURS DE RÉDACTION<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
          </h2>
          <p className="nafe-empty__text" style={{ maxWidth: 580, marginInline: "auto", fontSize: 15, lineHeight: 1.7 }}>
            Les informations, textes et images PNG de l'association n'ont pas encore été publiés.
            {isAdmin ? " En tant qu'administrateur, utilisez la console admin pour saisir votre titre, rédiger vos textes et placer vos images PNG." : " Revenez très prochainement pour découvrir la structure NAFE."}
          </p>
          {isAdmin && (
            <div style={{ marginTop: 28 }}>
              <a
                href="#/admin/association"
                className="nafe-btn nafe-btn--accent"
                style={{ background: accent || "var(--nafe-water-blue)", padding: "12px 28px", fontSize: 14 }}
              >
                + Rédiger la page Association dans l'Admin
              </a>
            </div>
          )}
        </div>
      ) : (
        /* PAGE UNIQUE SIMPLE ET FLUIDE */
        <article className="nafe-association-article">
          {/* 1. EN-TÊTE : Surtitre, Titre principal & Bouton de don rapide */}
          <header className="nafe-association-header" style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 18 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                {badge && (
                  <div style={{ marginBottom: 10 }}>
                    <span
                      className="nafe-mono"
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.14em",
                        color: accent || "var(--nafe-water-blue)",
                        background: "rgba(2, 136, 209, 0.1)",
                        border: "1px solid rgba(2, 136, 209, 0.3)",
                        padding: "4px 10px",
                        borderRadius: 3,
                        textTransform: "uppercase"
                      }}
                    >
                      {badge}
                    </span>
                  </div>
                )}

                <h1 className="nafe-display" style={{ fontSize: "clamp(34px, 5.5vw, 64px)", margin: "0 0 12px", lineHeight: 1.05 }}>
                  {title || "L'ASSOCIATION NAFE"}
                  <span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
                </h1>

                {subtitle && (
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.6, margin: 0, maxWidth: 820 }}>
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Bouton de don en haut à droite s'il est actif */}
              {donationActive && (
                <div style={{ alignSelf: "center" }}>
                  <button
                    type="button"
                    onClick={handleSupportRedirect}
                    className="nafe-btn nafe-btn--accent nafe-clip-card"
                    style={{
                      background: accent || "var(--nafe-water-blue)",
                      padding: "12px 22px",
                      fontSize: 13,
                      boxShadow: "0 0 20px rgba(2, 136, 209, 0.25)"
                    }}
                  >
                    {donationButtonText}
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* 2. IMAGE PNG PRINCIPALE / BANNIÈRE SUPÉRIEURE (Optionnelle) */}
          {bannerImage && (
            <div
              className="nafe-association-banner-wrapper nafe-clip-card"
              style={{
                marginBottom: 36,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(115, 190, 222, 0.2)",
                background: "linear-gradient(180deg, rgba(19, 24, 33, 0.8) 0%, rgba(11, 14, 20, 0.95) 100%)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            >
              <img
                src={bannerImage}
                alt={title || "Bannière Association NAFE"}
                style={{
                  width: "100%",
                  maxHeight: 460,
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                  padding: 10
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* 3. TEXTE PRINCIPAL DE L'ASSOCIATION */}
          {mainText && (
            <section
              className="nafe-association-text-card nafe-clip-card"
              style={{
                background: "rgba(19, 24, 33, 0.6)",
                border: "1px solid rgba(115, 190, 222, 0.15)",
                padding: "32px 36px",
                marginBottom: 36,
                backdropFilter: "blur(10px)"
              }}
            >
              <div style={{ maxWidth: 900 }}>
                {renderFormattedParagraphs(mainText)}
              </div>
            </section>
          )}

          {/* 4. IMAGES PNG PLACÉES SUR LA PAGE */}
          {images.length > 0 && (
            <section className="nafe-association-images-section" style={{ marginBottom: 40 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: images.length === 1 ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 24,
                  alignItems: "stretch"
                }}
              >
                {images.map((img, iIdx) => {
                  const isFull = img.layout === "banner" || img.layout === "full";
                  return (
                    <div
                      key={img.id || iIdx}
                      className="nafe-association-image-card nafe-clip-card"
                      style={{
                        gridColumn: isFull ? "1 / -1" : "auto",
                        background: "rgba(19, 24, 33, 0.5)",
                        border: "1px solid rgba(115, 190, 222, 0.18)",
                        borderRadius: 6,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        transition: "border-color 0.2s, transform 0.2s"
                      }}
                    >
                      <div style={{ width: "100%", textAlign: "center", overflow: "hidden", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src={img.url}
                          alt={img.caption || `Image association ${iIdx + 1}`}
                          style={{
                            maxWidth: "100%",
                            maxHeight: isFull ? 420 : 300,
                            objectFit: "contain",
                            display: "inline-block"
                          }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      {img.caption && (
                        <div style={{ marginTop: 12, textAlign: "center", width: "100%", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                          <span className="nafe-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>
                            ◈ {img.caption}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 5. SECTIONS DE TEXTE COMPLÉMENTAIRES (Termes, Statuts, Règlement...) */}
          {textSections.length > 0 && (
            <section className="nafe-association-sections" style={{ marginBottom: 36 }}>
              {textSections.map((sec, sIdx) => (
                <div
                  key={sec.id || sIdx}
                  className="nafe-association-section-card nafe-clip-card"
                  style={{
                    background: "rgba(19, 24, 33, 0.5)",
                    border: "1px solid rgba(115, 190, 222, 0.14)",
                    padding: "28px 32px",
                    marginBottom: 20
                  }}
                >
                  {sec.title && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <span style={{ width: 4, height: 22, background: accent || "var(--nafe-water-blue)" }} />
                      <h2 className="nafe-display" style={{ fontSize: 22, margin: 0, letterSpacing: "0.02em" }}>
                        {sec.title}
                      </h2>
                    </div>
                  )}
                  {sec.text && (
                    <div style={{ maxWidth: 900 }}>
                      {renderFormattedParagraphs(sec.text)}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* 6. MODULE SOUTIEN FINANCIER & DON ASSOCIATIF (HelloAsso / Loi 1901) */}
          {donationActive && (
            <section
              className="nafe-association-donation-card nafe-clip-card"
              style={{
                marginTop: 40,
                background: "linear-gradient(135deg, rgba(2, 136, 209, 0.12) 0%, rgba(19, 24, 33, 0.85) 100%)",
                border: "1px solid rgba(2, 136, 209, 0.35)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <span className="nafe-mono" style={{ color: accent || "var(--nafe-water-blue)", fontSize: 12, letterSpacing: "0.15em", marginBottom: 8 }}>
                // SOUTIEN ASSOCIATIF & FINANCIER
              </span>
              <h2 className="nafe-display" style={{ fontSize: "clamp(24px, 3.5vw, 36px)", margin: "0 0 14px" }}>
                SOUTENEZ L'ASSOCIATION NAFE ESPORT<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
              </h2>
              <p style={{ maxWidth: 680, color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" }}>
                {donationNote}
              </p>
              <button
                type="button"
                onClick={handleSupportRedirect}
                className="nafe-btn nafe-btn--accent nafe-clip-card"
                style={{
                  background: accent || "var(--nafe-water-blue)",
                  padding: "14px 34px",
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: "0 0 25px rgba(2, 136, 209, 0.35)"
                }}
              >
                {donationButtonText}
              </button>
              <span className="nafe-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 14 }}>
                Paiement direct et sécurisé via HelloAsso · Association à but non lucratif
              </span>
            </section>
          )}
        </article>
      )}
    </div>
  );
}

window.AssociationPage = AssociationPage;
