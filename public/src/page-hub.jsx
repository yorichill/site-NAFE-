// NAFE — Hub (home) page

function HubPage({ accent, cardVariant, onNav }) {
  window.store.useVersion();
  const roster = window.store.getPlayersByTeam("valorant");
  const live = window.store.getLiveMatch();
  const trophies = window.store.trophies.list().length;

  return (
    <div className="nafe-page">
      {/* HERO — brutalist typographic wall */}
      <section className="nafe-hero">
        <div className="nafe-hero__meta">
          <span className="nafe-eyebrow" style={{ color: accent }}>
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
          <span style={{ color: accent }}>TEAM<span className="nafe-hero__dot">.</span></span>
        </h1>

        <div className="nafe-hero__grid">
          <p className="nafe-hero__lede">
            L'héritage compétitif rencontre la direction créative la plus
            affûtée du game. Nouvelle ère, même obsession&nbsp;: la victoire.
          </p>

          {live ? (
            <div className="nafe-hero__matchCard" onClick={() => onNav("#/live")}>
              <div className="nafe-hero__matchHead">
                <span className="nafe-mono" style={{ color: accent }}>● LIVE</span>
                <span className="nafe-mono">{live.event}</span>
              </div>
              <div className="nafe-hero__matchBody">
                <div className="nafe-hero__side">
                  <span className="nafe-mono">NAFE</span>
                  <span className="nafe-display nafe-hero__matchScore" style={{ color: accent }}>
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
            </div>
          ) : (
            <div className="nafe-hero__matchCard nafe-empty nafe-empty--card">
              <span className="nafe-mono" style={{ color: accent }}>AUCUN MATCH LIVE</span>
              <p className="nafe-empty__text">
                {window.store.isAdmin()
                  ? "Programme un match depuis l'espace admin pour qu'il apparaisse ici en temps réel."
                  : "Aucun match en direct pour l'instant. Reviens plus tard !"}
              </p>
              {window.store.isAdmin() && (
                <button className="nafe-mono nafe-empty__cta" onClick={() => onNav("#/admin/matches")}>
                  → ADMIN MATCHS
                </button>
              )}
            </div>
          )}
        </div>

        <div className="nafe-hero__cta">
          <button className="nafe-btn nafe-btn--accent nafe-clip-card" style={{ background: accent }}>
            Rejoindre le club
          </button>
          <button className="nafe-btn nafe-btn--ghost nafe-clip-card" onClick={() => onNav("#/calendar")}>
            Voir le planning
          </button>
          <div className="nafe-hero__stats">
            <div>
              <p className="nafe-mono nafe-hero__statL">JOUEURS</p>
              <p className="nafe-display nafe-hero__statV">
                {String(window.store.players.list().length).padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="nafe-mono nafe-hero__statL">TROPHÉES</p>
              <p className="nafe-display nafe-hero__statV">
                {String(trophies).padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="nafe-mono nafe-hero__statL">MATCHS PROG.</p>
              <p className="nafe-display nafe-hero__statV" style={{ color: accent }}>
                {String(window.store.matches.list().length).padStart(2, "0")}
              </p>
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
            Le skill, c'est la <span style={{ color: accent }}>constance</span>.<br/>
            Le style, c'est la <span style={{ color: accent }}>signature</span>.
          </h2>
          <div className="nafe-manifesto__columns">
            <div>
              <span className="nafe-mono nafe-manifesto__num" style={{ color: accent }}>01 ·</span>
              <h3 className="nafe-display nafe-manifesto__h3">Jouer fort</h3>
              <p>Une méthodologie d'entraînement importée du sport de haut niveau. Analyse vidéo, préparation mentale, S&C.</p>
            </div>
            <div>
              <span className="nafe-mono nafe-manifesto__num" style={{ color: accent }}>02 ·</span>
              <h3 className="nafe-display nafe-manifesto__h3">Créer plus fort</h3>
              <p>Un studio interne dédié au contenu long-format. Documentaires, podcasts, drops capsule co-signés.</p>
            </div>
            <div>
              <span className="nafe-mono nafe-manifesto__num" style={{ color: accent }}>03 ·</span>
              <h3 className="nafe-display nafe-manifesto__h3">Vivre ensemble</h3>
              <p>Un club de membres actifs. Events physiques, loot tangible, hospitality en finale.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

window.HubPage = HubPage;
