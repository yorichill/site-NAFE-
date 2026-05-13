// NAFE — Hub (home) page
function HubPage({ accent, cardVariant, onNav }) {
  window.store.useVersion();
  const roster = window.store.getPlayersByTeam("valorant");
  const live = window.store.getLiveMatch();
  const trophies = window.store.trophies.list().length;
  const [tweet, setTweet] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/tweets")
      .then(r => r.json())
      .then(d => { if (d.tweets && d.tweets.length > 0) setTweet(d.tweets[0]); })
      .catch(() => {});
  }, []);

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

        <div className="nafe-hero__layout">
          <div className="nafe-hero__content">
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
            </div>
          </div>

          {/* LARGE ANNOUNCEMENT TWEET */}
          <div className="nafe-hero__announcement">
            {tweet ? (
              <div className="nafe-hero__tweetCard nafe-clip-card" onClick={() => onNav("#/news")}>
                <div className="nafe-hero__tweetTag" style={{ background: accent }}>DERNIER TWEET</div>
                <div className="nafe-hero__tweetBody">
                  <p className="nafe-hero__tweetText">{tweet.text}</p>
                </div>
                <div className="nafe-hero__tweetFoot nafe-mono">
                  <span style={{ color: accent }}>𝕏 @NAFEOFFICIEL</span>
                  <span>{new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase()}</span>
                </div>
              </div>
            ) : (
              <div className="nafe-hero__tweetCard nafe-clip-card nafe-empty">
                <span className="nafe-mono" style={{ opacity: 0.3 }}>CHARGEMENT ACTU...</span>
              </div>
            )}
            
            {/* Live Match Card (moved inside announcement area or below) */}
            {live ? (
              <div className="nafe-hero__matchCard mt-4" onClick={() => onNav("#/live")}>
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
              </div>
            ) : (
              <div className="nafe-hero__matchCard nafe-empty nafe-empty--card mt-4">
                <span className="nafe-mono" style={{ color: accent }}>AUCUN MATCH LIVE</span>
              </div>
            )}
          </div>
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
          </div>
        </div>

      </section>

      <style>{`
        .nafe-hero__layout { display: grid; grid-template-columns: 1fr 480px; gap: 60px; margin-top: 40px; align-items: center; }
        .nafe-hero__announcement { display: flex; flex-direction: column; gap: 20px; }
        .nafe-hero__tweetCard { 
          background: rgba(255,255,255,0.02); 
          border: 1px solid rgba(255,255,255,0.08); 
          padding: 48px; 
          position: relative; 
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .nafe-hero__tweetCard:hover { border-color: var(--accent); background: rgba(var(--accent-rgb), 0.08); transform: scale(1.02); }
        .nafe-hero__tweetTag { 
          position: absolute; top: -12px; left: 48px; 
          padding: 6px 16px; font-size: 11px; font-family: 'JetBrains Mono', monospace; 
          color: #fff; font-weight: 700; letter-spacing: 2px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        .nafe-hero__tweetText { font-size: 26px; line-height: 1.3; font-weight: 600; margin: 20px 0 32px; color: #fff; }
        .nafe-hero__tweetFoot { display: flex; justify-content: space-between; font-size: 12px; opacity: 0.5; }
        .mt-4 { margin-top: 16px; }
        @media (max-width: 1200px) {
          .nafe-hero__layout { grid-template-columns: 1fr; }
          .nafe-hero__announcement { max-width: 600px; }
        }
      `}</style>

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
