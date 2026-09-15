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

  // Pinned tweet locking logic
  const pinnedSettingId = window.store.settings ? window.store.settings.getPinnedTweetId() : null;
  const pinnedTweet = (pinnedSettingId ? tweets.find(t => t.id === pinnedSettingId) : null)
    || tweets.find(t => t.pinned)
    || tweets[0];

  const regularTweets = tweets
    .filter(t => t.id !== pinnedTweet?.id)
    .slice(0, 2);

  // Position 0 is ALWAYS locked to the pinned tweet
  const displayTweets = pinnedTweet ? [pinnedTweet, ...regularTweets] : tweets.slice(0, 3);

  return (
    <div className="nafe-page">
      {/* HERO — brutalist typographic wall */}
      <section className="nafe-hero">
        <div className="nafe-hero__meta">
          <span className="nafe-eyebrow" style={{ color: accent || "var(--nafe-denim-blue)" }}>
            Saison 2026 · NAFE ESPORT
          </span>
          {live && (
            <span className="nafe-eyebrow nafe-hero__ts">
              <span className="nafe-pulse" style={{ background: "var(--nafe-green-peas)", boxShadow: "0 0 12px var(--nafe-green-peas)" }} /> EN DIRECT
            </span>
          )}
        </div>

        <div className="nafe-hero__logo-wrap">
          <h1 className="sr-only">NAFE ESPORT</h1>
          <img 
            src="assets/brand/nafe-logo.png" 
            alt="NAFE ESPORT" 
            className="nafe-hero__big-logo" 
          />
        </div>

        <div className="nafe-hero__grid">
          <p className="nafe-hero__lede">
            L'excellence au cœur du jeu. Bâtir une structure compétitive d'élite
            portée par l'exigence, l'ambition et le dépassement de soi. 
            Le phœnix ne meurt jamais.
          </p>

          {live ? (
            <div className="nafe-hero__matchCard" onClick={() => onNav("#/live")}>
              <div className="nafe-hero__matchHead">
                <span className="nafe-mono" style={{ color: "var(--nafe-green-peas)" }}>● LIVE</span>
                <span className="nafe-mono">{live.event}</span>
              </div>
              <div className="nafe-hero__matchBody">
                <div className="nafe-hero__side">
                  <span className="nafe-mono">NAFE</span>
                  <span className="nafe-display nafe-hero__matchScore" style={{ color: accent || "var(--nafe-water-blue)" }}>
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
              <span className="nafe-mono" style={{ color: accent || "var(--nafe-water-blue)" }}>AUCUN MATCH LIVE</span>
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
          <button className="nafe-btn nafe-btn--accent nafe-clip-card" style={{ background: accent || "var(--nafe-water-blue)" }} onClick={() => onNav("#/community")}>
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
              <p className="nafe-display nafe-hero__statV" style={{ color: accent || "var(--nafe-water-blue)" }}>
                {String(window.store.matches.list().length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION VALEURS OFFICIELLES */}
      <section className="nafe-values-section">
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 44px" }}>
          <span className="nafe-eyebrow" style={{ color: "var(--nafe-denim-blue)" }}>
            NOTRE PHILOSOPHIE
          </span>
          <h2 className="nafe-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: "8px 0 14px", color: "#FFFFFF" }}>
            NOS VALEURS<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
          </h2>
          <p style={{ opacity: 0.7, fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            Quatre piliers fondamentaux qui forgent l'exigence et l'esprit de conquête de NAFE ESPORT.
          </p>
        </div>

        <div className="nafe-values-grid">
          {(window.NAFE_VALUES || []).map((val) => (
            <div key={val.num} className="nafe-value-card nafe-clip-card">
              <div className="nafe-value-card__top">
                <span className="nafe-mono nafe-value-card__num">{val.num} // PILIER</span>
                <span className="nafe-value-card__dot" />
              </div>
              <h3 className="nafe-display nafe-value-card__title">{val.title}</h3>
              <p className="nafe-value-card__desc">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION DERNIERS TWEETS @NAFEOFFICIEL (AVEC ÉPINGLÉ FIXÉ À GAUCHE) */}
      <section className="nafe-hub-tweets">
        <div className="nafe-hub-tweets__head">
          <div>
            <span className="nafe-eyebrow" style={{ color: accent || "var(--nafe-denim-blue)" }}>FLUX OFFICIEL · TWITTER</span>
            <h2 className="nafe-display nafe-hub-tweets__title">
              DERNIERS TWEETS<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
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
              Suivre @NafeOfficiel
            </a>
          </div>
        </div>

        <div className="nafe-hub-tweets__grid">
          {displayTweets.map((tweet, idx) => {
            const isPinned = idx === 0 && Boolean(pinnedTweet && tweet.id === pinnedTweet.id);
            const date = new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase();
            return (
              <a
                key={tweet.id}
                href={`https://x.com/NafeOfficiel/status/${tweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`nafe-hub-tweet-card nafe-clip-card ${isPinned ? "nafe-hub-tweet-card--pinned" : ""}`}
              >
                {isPinned && (
                  <div className="nafe-pinned-badge">
                    <span>TWEET ÉPINGLÉ</span>
                  </div>
                )}
                <div className="nafe-hub-tweet-card__top">
                  <div className="nafe-hub-tweet-card__avatar">
                    <img src={window.NAFE_TWITTER_AVATAR || "https://pbs.twimg.com/profile_images/2089748890027196416/5diWkPDV_400x400.png"} alt="NAFE" />
                  </div>
                  <div className="nafe-hub-tweet-card__author">
                    <span className="nafe-hub-tweet-card__name">NAFE</span>
                    <span className="nafe-mono nafe-hub-tweet-card__handle">@NafeOfficiel · {date}</span>
                  </div>
                  <span className="nafe-hub-tweet-card__x nafe-mono">X</span>
                </div>

                <p className="nafe-hub-tweet-card__text">{tweet.text}</p>

                {tweet.media && tweet.media.length > 0 && (
                  <div className="nafe-hub-tweet-card__media">
                    <img src={tweet.media[0].url} alt="Tweet media" />
                  </div>
                )}

                <div className="nafe-hub-tweet-card__foot nafe-mono">
                  <div className="nafe-hub-tweet-card__stats">
                    <span>{tweet.public_metrics?.like_count || 0} LIKES</span>
                    <span>{tweet.public_metrics?.retweet_count || 0} RETWEETS</span>
                  </div>
                  <span className="nafe-hub-tweet-card__link">VOIR SUR TWITTER →</span>
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
