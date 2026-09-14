// NAFE — Hub (home) page

function HubPage({ accent, cardVariant, onNav }) {
  window.store.useVersion();
  const roster = window.store.getPlayersByTeam("valorant");
  const live = window.store.getLiveMatch();
  const trophies = window.store.trophies.list().length;

  const [tweets, setTweets] = React.useState(window.DEFAULT_TWEETS || []);

  React.useEffect(() => {
    fetch("/api/tweets")
      .then(r => r.json())
      .then(d => {
        if (d.tweets && d.tweets.length > 0) setTweets(d.tweets);
      })
      .catch(() => {
        if (window.DEFAULT_TWEETS) setTweets(window.DEFAULT_TWEETS);
      });
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

      </section>

      {/* SECTION DERNIERS TWEETS @NAFEOFFICIEL */}
      <section className="nafe-hub-tweets">
        <div className="nafe-hub-tweets__head">
          <div>
            <span className="nafe-eyebrow" style={{ color: accent }}>FLUX OFFICIEL · 𝕏 TWITTER</span>
            <h2 className="nafe-display nafe-hub-tweets__title">
              DERNIERS TWEETS<span style={{ color: accent }}>.</span>
            </h2>
          </div>
          <div className="nafe-hub-tweets__actions">
            <button className="nafe-btn nafe-btn--ghost nafe-clip-card" onClick={() => onNav("#/news")}>
              Toute l'actu →
            </button>
            <a 
              href="https://x.com/NafeOfficiel" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nafe-btn nafe-btn--accent nafe-clip-card" 
              style={{ background: "#1d9bf0", textDecoration: "none" }}
            >
              Suivre @NafeOfficiel 𝕏
            </a>
          </div>
        </div>

        <div className="nafe-hub-tweets__grid">
          {tweets.slice(0, 3).map(tweet => {
            const date = new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase();
            return (
              <a
                key={tweet.id}
                href={`https://x.com/NafeOfficiel/status/${tweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nafe-hub-tweet-card nafe-clip-card"
              >
                <div className="nafe-hub-tweet-card__top">
                  <div className="nafe-hub-tweet-card__avatar">
                    <img src={window.NAFE_TWITTER_AVATAR || "https://pbs.twimg.com/profile_images/2089748890027196416/5diWkPDV_400x400.png"} alt="NAFE" />
                  </div>
                  <div className="nafe-hub-tweet-card__author">
                    <span className="nafe-hub-tweet-card__name">NAFE</span>
                    <span className="nafe-mono nafe-hub-tweet-card__handle">@NafeOfficiel · {date}</span>
                  </div>
                  <span className="nafe-hub-tweet-card__x">𝕏</span>
                </div>

                <p className="nafe-hub-tweet-card__text">{tweet.text}</p>

                {tweet.media && tweet.media.length > 0 && (
                  <div className="nafe-hub-tweet-card__media">
                    <img src={tweet.media[0].url} alt="Tweet media" />
                  </div>
                )}

                <div className="nafe-hub-tweet-card__foot nafe-mono">
                  <div className="nafe-hub-tweet-card__stats">
                    <span>♥ {tweet.public_metrics?.like_count || 0}</span>
                    <span>↺ {tweet.public_metrics?.retweet_count || 0}</span>
                  </div>
                  <span className="nafe-hub-tweet-card__link">VOIR SUR 𝕏 →</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <style>{`
        .nafe-hub-tweets { margin: 80px 0 60px; }
        .nafe-hub-tweets__head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
        .nafe-hub-tweets__title { font-size: clamp(28px, 4vw, 44px); margin-top: 6px; }
        .nafe-hub-tweets__actions { display: flex; gap: 12px; }
        .nafe-hub-tweets__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
        .nafe-hub-tweet-card { 
          background: rgba(255, 255, 255, 0.02); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          padding: 24px; 
          display: flex; 
          flex-direction: column; 
          text-decoration: none; 
          color: inherit;
          transition: all 0.3s ease;
        }
        .nafe-hub-tweet-card:hover { 
          border-color: rgba(29, 155, 240, 0.4); 
          background: rgba(255, 255, 255, 0.04); 
          transform: translateY(-3px); 
        }
        .nafe-hub-tweet-card__top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .nafe-hub-tweet-card__avatar { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.15); flex-shrink: 0; }
        .nafe-hub-tweet-card__avatar img { width: 100%; height: 100%; object-fit: cover; }
        .nafe-hub-tweet-card__author { flex: 1; min-width: 0; }
        .nafe-hub-tweet-card__name { font-weight: 700; font-size: 14px; color: #fff; display: block; }
        .nafe-hub-tweet-card__handle { font-size: 11px; color: #71767b; }
        .nafe-hub-tweet-card__x { font-weight: 700; color: #1d9bf0; font-size: 16px; }
        .nafe-hub-tweet-card__text { font-size: 14px; line-height: 1.55; color: rgba(255, 255, 255, 0.9); margin-bottom: 16px; white-space: pre-wrap; flex: 1; }
        .nafe-hub-tweet-card__media { border-radius: 8px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 16px; max-height: 220px; }
        .nafe-hub-tweet-card__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .nafe-hub-tweet-card__foot { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 11px; }
        .nafe-hub-tweet-card__stats { color: #71767b; display: flex; gap: 16px; }
        .nafe-hub-tweet-card__link { color: #1d9bf0; font-weight: 700; }
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
