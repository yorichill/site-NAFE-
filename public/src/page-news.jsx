// NAFE — News / Actualités page

const { useState: useNewsState, useEffect: useNewsEffect } = React;

const TWEETS_API = "http://localhost:3000/api/tweets";
const CATS = ["Tout", "Twitter", "Compétition", "Annonce", "Transfert", "Analyse", "Structure", "Partenariat", "Académie"];

function TweetCard({ tweet }) {
  const date = new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase();
  const likes = tweet.public_metrics?.like_count ?? 0;
  const rts   = tweet.public_metrics?.retweet_count ?? 0;
  return (
    <a
      href={`https://x.com/NafeOfficiel/status/${tweet.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="nafe-news__card"
      style={{ textDecoration: "none", display: "flex", flexDirection: "column", cursor: "pointer" }}
    >
      <div style={{ padding: "14px 18px 6px", borderBottom: "1px solid rgba(29,155,240,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#1d9bf0", fontWeight: 700, fontSize: 14, fontFamily: "JetBrains Mono, monospace", letterSpacing: 1 }}>𝕏</span>
        <span className="nafe-mono" style={{ color: "#1d9bf0", fontSize: 11 }}>@NAFEOFFICIEL</span>
        <span className="nafe-mono" style={{ opacity: 0.4, fontSize: 11, marginLeft: "auto" }}>{date}</span>
      </div>
      <div className="nafe-news__cardBody" style={{ flex: 1 }}>
        <p className="nafe-news__cardLede" style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.88)" }}>
          {tweet.text}
        </p>
        <div className="nafe-news__cardFoot" style={{ marginTop: "auto" }}>
          <span className="nafe-mono" style={{ opacity: 0.5, fontSize: 11 }}>♥ {likes} · ↺ {rts}</span>
          <span className="nafe-mono" style={{ color: "#1d9bf0", fontSize: 11 }}>Voir →</span>
        </div>
      </div>
    </a>
  );
}

function NewsPage({ accent }) {
  window.store.useVersion();
  const all = window.store.news.list()
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const [cat, setCat]             = useNewsState("Tout");
  const [tweets, setTweets]       = useNewsState([]);
  const [tweetsErr, setTweetsErr] = useNewsState(false);

  useNewsEffect(() => {
    fetch(TWEETS_API)
      .then(r => r.json())
      .then(d => setTweets(d.tweets || []))
      .catch(() => setTweetsErr(true));
  }, []);

  const showTweets = (cat === "Tout" || cat === "Twitter") && tweets.length > 0;
  const filtered   = cat === "Tout" || cat === "Twitter"
    ? all
    : all.filter(n => n.cat === cat);
  const featured   = cat !== "Twitter" && (filtered.find(n => n.featured) || filtered[0]);
  const rest       = cat !== "Twitter" ? filtered.filter(n => (featured ? n.id !== featured.id : true)) : [];

  const hasContent = all.length > 0 || tweets.length > 0;

  return (
    <div className="nafe-page">
      <section className="nafe-news__hero">
        <span className="nafe-eyebrow" style={{ color: accent }}>
          Actualité · NAFE TEAM
        </span>
        <h1 className="nafe-display nafe-team__title">ACTU<span style={{ color: accent }}>.</span></h1>
        <p className="nafe-team__lede">
          Tout ce qui fait bouger NAFE TEAM — matchs, transferts, annonces structure
          et drops. Curation par la rédaction interne.
        </p>
      </section>

      {!hasContent ? (
        <div className="nafe-empty nafe-empty--panel">
          <span className="nafe-mono" style={{ color: accent }}>AUCUN ARTICLE</span>
          <p className="nafe-empty__text">
            {window.store.isAdmin()
              ? "La rédaction n'a encore rien posté. Crée ta première dépêche depuis l'espace admin."
              : "Les premières dépêches arrivent très bientôt — reste connecté."}
          </p>
          {window.store.isAdmin() && (
            <a className="nafe-btn nafe-btn--accent" style={{ background: accent }} href="#/admin/news">
              → Poster une actu
            </a>
          )}
        </div>
      ) : (
        <>
          {/* Category filter */}
          <section className="nafe-news__filter">
            {CATS.map(c => (
              <button
                key={c}
                className={`nafe-news__chip ${cat === c ? "is-active" : ""}`}
                style={cat === c
                  ? { background: c === "Twitter" ? "#1d9bf0" : accent, color: "#fff", borderColor: c === "Twitter" ? "#1d9bf0" : accent }
                  : {}}
                onClick={() => setCat(c)}
              >
                <span className="nafe-mono">{c.toUpperCase()}</span>
                {c === "Twitter" && tweets.length > 0 && (
                  <span className="nafe-news__chipN nafe-mono">{tweets.length}</span>
                )}
                {c !== "Tout" && c !== "Twitter" && (
                  <span className="nafe-news__chipN nafe-mono">
                    {all.filter(n => n.cat === c).length}
                  </span>
                )}
              </button>
            ))}
          </section>

          {/* Tweets */}
          {showTweets && (
            <section className="nafe-section" style={{ marginTop: 48 }}>
              <header className="nafe-section__head" style={{ marginBottom: 24 }}>
                <div>
                  <span className="nafe-eyebrow" style={{ color: "#1d9bf0" }}>X · @NafeOfficiel</span>
                  <h2 className="nafe-display nafe-section__title">Derniers tweets</h2>
                </div>
                <a
                  href="https://x.com/NafeOfficiel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nafe-mono"
                  style={{ color: "#1d9bf0", fontSize: 12, opacity: 0.85 }}
                >
                  VOIR LE PROFIL →
                </a>
              </header>
              <div className="nafe-news__grid">
                {tweets.map(t => <TweetCard key={t.id} tweet={t} />)}
              </div>
            </section>
          )}

          {/* Articles — masqués si filtre Twitter actif */}
          {cat !== "Twitter" && all.length > 0 && (
            <>
              {featured && (
                <section className="nafe-news__featured nafe-clip-card" style={{ marginTop: showTweets ? 60 : 0 }}>
                  <div className="nafe-news__featImg" style={{ borderColor: accent }}>
                    <FeaturedPlaceholder accent={accent} seed={featured.id} />
                    <span className="nafe-news__featTag" style={{ background: accent }}>À LA UNE</span>
                  </div>
                  <div className="nafe-news__featBody">
                    <div className="nafe-news__meta">
                      <span className="nafe-mono" style={{ color: accent }}>{(featured.cat || "").toUpperCase()}</span>
                      <span className="nafe-mono">· {featured.game}</span>
                      <span className="nafe-mono">· {featured.date}</span>
                    </div>
                    <h2 className="nafe-display nafe-news__featTitle">{featured.title}</h2>
                    <p className="nafe-news__featLede">{featured.lede}</p>
                    <div className="nafe-news__featFoot">
                      <span className="nafe-mono">PAR {(featured.author || "").toUpperCase()}</span>
                      <span className="nafe-mono">{(featured.readTime || "").toUpperCase()}</span>
                      <span className="nafe-news__featRead" style={{ color: accent }}>LIRE →</span>
                    </div>
                  </div>
                </section>
              )}

              {rest.length > 0 && (
                <section className="nafe-section" style={{ marginTop: 60 }}>
                  <header className="nafe-section__head">
                    <div>
                      <span className="nafe-eyebrow">{cat === "Tout" ? "Toutes les dépêches" : cat}</span>
                      <h2 className="nafe-display nafe-section__title">Archive</h2>
                    </div>
                    <span className="nafe-mono nafe-section__count">
                      {String(rest.length).padStart(2, "0")} ARTICLE{rest.length > 1 ? "S" : ""}
                    </span>
                  </header>
                  <div className="nafe-news__grid">
                    {rest.map((n) => (
                      <article key={n.id} className="nafe-news__card">
                        <div className="nafe-news__cardImg">
                          <ArticlePlaceholder accent={accent} seed={n.id} />
                        </div>
                        <div className="nafe-news__cardBody">
                          <div className="nafe-news__meta">
                            <span className="nafe-mono" style={{ color: accent }}>{(n.cat || "").toUpperCase()}</span>
                            <span className="nafe-mono">· {n.date}</span>
                          </div>
                          <h3 className="nafe-display nafe-news__cardTitle">{n.title}</h3>
                          <p className="nafe-news__cardLede">{n.lede}</p>
                          <div className="nafe-news__cardFoot">
                            <span className="nafe-mono">{n.game} · {n.readTime}</span>
                            <span className="nafe-mono" style={{ color: accent }}>→</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function FeaturedPlaceholder({ accent, seed }) {
  const s = String(seed || "n");
  return (
    <svg viewBox="0 0 600 340" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`fs-${s}`} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-28)">
          <rect width="8" height="8" fill="#0B1228" />
          <line x1="0" y1="0" x2="0" y2="8" stroke={accent} strokeOpacity="0.25" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="600" height="340" fill={`url(#fs-${s})`} />
      <rect x="40" y="260" width="200" height="40" fill={accent} opacity="0.9" />
      <text x="52" y="286" fontFamily="JetBrains Mono, monospace" fontSize="14" fill="#fff" letterSpacing="3">
        [ PLACEHOLDER ]
      </text>
      <text x="40" y="60" fontFamily="JetBrains Mono, monospace" fontSize="10" fill={accent} letterSpacing="4">
        IMAGE · ÉDITORIAL
      </text>
      <g opacity="0.6">
        {[0,1,2,3,4].map(i => (
          <line key={i} x1={40 + i*18} y1="80" x2={40 + i*18} y2="240" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
        ))}
      </g>
    </svg>
  );
}

function ArticlePlaceholder({ accent, seed }) {
  const s = String(seed || "n");
  return (
    <svg viewBox="0 0 300 180" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`ap-${s}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(35)">
          <rect width="6" height="6" fill="#0B1228" />
          <line x1="0" y1="0" x2="0" y2="6" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="300" height="180" fill={`url(#ap-${s})`} />
      <rect x="16" y="140" width="120" height="22" fill={accent} opacity="0.85" />
      <text x="22" y="156" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#fff" letterSpacing="2">
        [IMAGE·{s.slice(0,5).toUpperCase()}]
      </text>
    </svg>
  );
}

window.NewsPage = NewsPage;
