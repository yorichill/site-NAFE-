// NAFE — News / Actualités page
const { useState: useNewsState, useEffect: useNewsEffect } = React;

const TWEETS_API = "/api/tweets";
const CATS = ["Tout", "Twitter", "YouTube", "Twitch", "Compétition", "Annonce", "Transfert", "Analyse", "Structure", "Partenariat", "Académie"];

function TweetCard({ tweet, accent }) {
  const date = new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return (
    <div className="nafe-tweet-card nafe-clip-card">
      <div className="nafe-tweet-header">
        <div className="nafe-tweet-avatar">
          <img src="https://pbs.twimg.com/profile_images/1769830504746684416/Uu-L8v-Z_400x400.jpg" alt="NAFE" />
        </div>
        <div className="nafe-tweet-meta">
          <div className="nafe-tweet-user">
            <span className="nafe-tweet-name">NAFE</span>
            <span className="nafe-tweet-handle">@NafeOfficiel · {date}</span>
          </div>
          <div className="nafe-tweet-x">𝕏</div>
        </div>
      </div>
      <div className="nafe-tweet-body">
        <p className="nafe-tweet-text">{tweet.text}</p>
        {/* Placeholder for media if it looks like a roster reveal or similar */}
        {(tweet.text.includes("ROSTER") || tweet.text.includes("BIENVENUE")) && (
          <div className="nafe-tweet-media">
            <div className="nafe-tweet-media-placeholder" style={{ background: `linear-gradient(45deg, #050814, ${accent}22)` }}>
              <span className="nafe-mono" style={{ opacity: 0.3 }}>[ IMAGE / MEDIA 𝕏 ]</span>
            </div>
          </div>
        )}
      </div>
      <div className="nafe-tweet-footer">
        <a href={`https://x.com/NafeOfficiel/status/${tweet.id}`} target="_blank" rel="noopener" className="nafe-mono">VOIR SUR 𝕏 →</a>
      </div>
    </div>
  );
}

function VideoCard({ news, accent }) {
  const isYoutube = news.cat === "YouTube";
  const color = isYoutube ? "#FF0000" : "#9146FF";
  return (
    <div className="nafe-news__card nafe-video-card">
      <div className="nafe-video-thumb" style={{ background: '#050814', borderBottom: `1px solid ${color}33` }}>
        <div className="nafe-video-play" style={{ border: `1px solid ${color}44` }}>▶</div>
        <span className="nafe-video-tag" style={{ background: color }}>{news.cat.toUpperCase()}</span>
      </div>
      <div className="nafe-news__cardBody">
        <div className="nafe-news__meta">
          <span className="nafe-mono" style={{ color: color }}>NOUVEAU CONTENU</span>
          <span className="nafe-mono">· {news.date}</span>
        </div>
        <h3 className="nafe-display nafe-news__cardTitle" style={{ fontSize: 18 }}>{news.title}</h3>
        <p className="nafe-news__cardLede" style={{ fontSize: 13, opacity: 0.7 }}>{news.lede}</p>
        <div className="nafe-news__cardFoot">
          <a href={news.url} target="_blank" rel="noopener" className="nafe-mono" style={{ color: color, textDecoration: 'none' }}>
            REGARDER SUR {news.cat.toUpperCase()} →
          </a>
        </div>
      </div>
    </div>
  );
}

function NewsPage({ accent }) {
  window.store.useVersion();
  const allNews = window.store.news.list().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const [cat, setCat]             = useNewsState("Tout");
  const [tweets, setTweets]       = useNewsState([]);

  useNewsEffect(() => {
    fetch(TWEETS_API)
      .then(r => r.json())
      .then(d => setTweets(d.tweets || []))
      .catch(() => {});
  }, []);

  const filteredNews = cat === "Tout" ? allNews : allNews.filter(n => n.cat === cat);
  
  const showTweets = cat === "Tout" || cat === "Twitter";
  const showVideos = cat === "Tout" || cat === "YouTube" || cat === "Twitch";
  const showArticles = cat !== "Twitter" && cat !== "YouTube" && cat !== "Twitch";

  return (
    <div className="nafe-page">
      <section className="nafe-news__hero">
        <span className="nafe-eyebrow" style={{ color: accent }}>Actualité · NAFE TEAM</span>
        <h1 className="nafe-display nafe-team__title">ACTU<span style={{ color: accent }}>.</span></h1>
        <p className="nafe-team__lede">Les derniers tweets, vidéos et articles de la structure.</p>
      </section>

      <section className="nafe-news__filter">
        {CATS.map(c => (
          <button
            key={c}
            className={`nafe-news__chip ${cat === c ? "is-active" : ""}`}
            style={cat === c ? { background: accent, color: "#fff", borderColor: accent } : {}}
            onClick={() => setCat(c)}
          >
            <span className="nafe-mono">{c.toUpperCase()}</span>
          </button>
        ))}
      </section>

      <div className="nafe-news__layout">
        
        {/* VIDEOS SECTION */}
        {showVideos && (
          <div className="nafe-news__grid" style={{ marginTop: 40 }}>
            {allNews.filter(n => (n.cat === "YouTube" || n.cat === "Twitch") && (cat === "Tout" || n.cat === cat)).map(v => (
              <VideoCard key={v.id} news={v} accent={accent} />
            ))}
          </div>
        )}

        {/* TWEETS SECTION */}
        {showTweets && tweets.length > 0 && (
          <div className="nafe-tweet-grid" style={{ marginTop: 40 }}>
            {tweets.map(t => <TweetCard key={t.id} tweet={t} accent={accent} />)}
          </div>
        )}

        {/* ARTICLES SECTION */}
        {showArticles && filteredNews.filter(n => n.cat !== "YouTube" && n.cat !== "Twitch").length > 0 && (
          <div className="nafe-news__grid" style={{ marginTop: 40 }}>
            {filteredNews.filter(n => n.cat !== "YouTube" && n.cat !== "Twitch").map(n => (
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .nafe-tweet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }
        .nafe-tweet-card { background: #000; border: 1px solid #333; padding: 20px; transition: border-color 0.3s; }
        .nafe-tweet-card:hover { border-color: #555; }
        .nafe-tweet-header { display: flex; gap: 12px; margin-bottom: 12px; }
        .nafe-tweet-avatar { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: #222; }
        .nafe-tweet-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .nafe-tweet-meta { flex: 1; display: flex; justify-content: space-between; align-items: flex-start; }
        .nafe-tweet-user { display: flex; flex-direction: column; }
        .nafe-tweet-name { font-weight: 700; font-size: 15px; color: #fff; }
        .nafe-tweet-handle { font-size: 14px; color: #71767b; }
        .nafe-tweet-x { color: #fff; font-weight: 700; font-size: 16px; }
        .nafe-tweet-text { font-size: 15px; line-height: 1.5; color: #e7e9ea; white-space: pre-wrap; margin-bottom: 16px; }
        .nafe-tweet-media { margin-top: 12px; border-radius: 16px; overflow: hidden; border: 1px solid #333; }
        .nafe-tweet-media-placeholder { aspect-ratio: 1.91/1; display: flex; align-items: center; justify-content: center; }
        .nafe-tweet-footer { margin-top: 16px; padding-top: 12px; border-top: 1px solid #333; }
        .nafe-tweet-footer a { color: #1d9bf0; font-size: 12px; text-decoration: none; font-weight: 700; }
        
        .nafe-video-thumb { aspect-ratio: 16/9; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .nafe-video-play { width: 50px; height: 50px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.3s; }
        .nafe-video-card:hover .nafe-video-play { background: #fff; color: #000; transform: scale(1.1); }
        .nafe-video-tag { position: absolute; top: 12px; right: 12px; padding: 4px 10px; font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #fff; font-weight: 700; }
        
        @media (max-width: 600px) {
          .nafe-tweet-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
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
    </svg>
  );
}

window.NewsPage = NewsPage;
