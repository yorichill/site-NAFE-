// NAFE — News / Actualités page
const { useState: useNewsState, useEffect: useNewsEffect } = React;

const TWEETS_API = "/api/tweets";
const CATS = ["Tout", "Twitter", "YouTube", "Twitch", "Compétition", "Annonce", "Transfert", "Analyse", "Structure", "Partenariat", "Académie"];

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
    >
      <div className="nafe-news__card-x-head">
        <span style={{ color: "#1d9bf0", fontWeight: 700 }}>𝕏</span>
        <span className="nafe-mono" style={{ color: "#1d9bf0", fontSize: 11 }}>@NAFEOFFICIEL</span>
        <span className="nafe-mono" style={{ opacity: 0.4, fontSize: 11, marginLeft: "auto" }}>{date}</span>
      </div>
      <div className="nafe-news__cardBody">
        <p className="nafe-news__cardLede" style={{ fontSize: 14 }}>{tweet.text}</p>
        <div className="nafe-news__cardFoot">
          <span className="nafe-mono" style={{ opacity: 0.5, fontSize: 11 }}>♥ {likes} · ↺ {rts}</span>
          <span className="nafe-mono" style={{ color: "#1d9bf0", fontSize: 11 }}>VOIR →</span>
        </div>
      </div>
    </a>
  );
}

function LatestTweetCard({ tweet, accent }) {
  if (!tweet) return null;
  const date = new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase();
  return (
    <div className="nafe-news__latest-tweet nafe-clip-card">
      <div className="nafe-news__lt-icon">𝕏</div>
      <div className="nafe-news__lt-content">
        <div className="nafe-news__lt-head">
          <span className="nafe-mono" style={{ color: "#1d9bf0" }}>@NAFEOFFICIEL</span>
          <span className="nafe-mono" style={{ opacity: 0.4 }}>{date}</span>
        </div>
        <p className="nafe-news__lt-text" style={{ fontSize: 20 }}>{tweet.text}</p>
        <div className="nafe-news__lt-foot">
          <span className="nafe-mono" style={{ color: "#1d9bf0" }}>DERNIÈRE ACTUALITÉ SUR X</span>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ type, id, title, accent }) {
  const isYoutube = type === "YouTube";
  const color = isYoutube ? "#FF0000" : "#9146FF";
  return (
    <div className="nafe-news__card nafe-video-card">
      <div className="nafe-video-thumb" style={{ background: '#050814', borderBottom: `1px solid ${color}33` }}>
        <div className="nafe-video-play" style={{ border: `1px solid ${color}44` }}>▶</div>
        <span className="nafe-video-tag" style={{ background: color }}>{type.toUpperCase()}</span>
      </div>
      <div className="nafe-news__cardBody">
        <div className="nafe-news__meta">
          <span className="nafe-mono" style={{ color: color }}>NOUVEAU CONTENU</span>
          <span className="nafe-mono">· {new Date().toLocaleDateString()}</span>
        </div>
        <h3 className="nafe-display nafe-news__cardTitle" style={{ fontSize: 18 }}>{title}</h3>
        <div className="nafe-news__cardFoot">
          <span className="nafe-mono" style={{ color: color }}>REGARDER SUR {type.toUpperCase()} →</span>
        </div>
      </div>
    </div>
  );
}

function NewsPage({ accent }) {
  window.store.useVersion();
  const all = window.store.news.list().slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const [cat, setCat]             = useNewsState("Tout");
  const [tweets, setTweets]       = useNewsState([]);

  useNewsEffect(() => {
    const fetchTweets = () => {
      fetch(TWEETS_API)
        .then(r => r.json())
        .then(d => setTweets(d.tweets || []))
        .catch(() => {});
    };
    fetchTweets();
    const timer = setInterval(fetchTweets, 60000);
    return () => clearInterval(timer);
  }, []);

  const latestTweet = tweets[0];
  const filtered = cat === "Tout" ? all : all.filter(n => n.cat === cat);
  
  // Fake video data for demonstration as requested
  const videos = [
    { type: "YouTube", title: "NAFE VALORANT : LE DOCUMENTAIRE (TEASER)", id: "y1" },
    { type: "Twitch", title: "BEST OF STREAM : SEMAINE 19", id: "t1" }
  ];

  const showTweets = cat === "Tout" || cat === "Twitter";
  const showYoutube = cat === "Tout" || cat === "YouTube";
  const showTwitch = cat === "Tout" || cat === "Twitch";
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
        {/* LATEST TWEET ALWAYS VISIBLE IN "TOUT" OR "TWITTER" */}
        {showTweets && latestTweet && <LatestTweetCard tweet={latestTweet} accent={accent} />}

        {/* VIDEOS GRID */}
        {(showYoutube || showTwitch) && (
          <div className="nafe-news__grid" style={{ marginTop: 40 }}>
            {videos.filter(v => cat === "Tout" || v.type === cat).map(v => (
              <VideoCard key={v.id} {...v} accent={accent} />
            ))}
          </div>
        )}

        {/* ARTICLES GRID */}
        {showArticles && all.length > 0 && (
          <div className="nafe-news__grid" style={{ marginTop: 40 }}>
            {filtered.map(n => (
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
        
        {/* REMAINING TWEETS */}
        {cat === "Twitter" && tweets.slice(1).length > 0 && (
          <div className="nafe-news__grid" style={{ marginTop: 40 }}>
            {tweets.slice(1).map(t => <TweetCard key={t.id} tweet={t} />)}
          </div>
        )}
      </div>

      <style>{`
        .nafe-news__card-x-head { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 8px; }
        .nafe-video-thumb { aspect-ratio: 16/9; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .nafe-video-play { width: 50px; height: 50px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.3s; }
        .nafe-video-card:hover .nafe-video-play { background: #fff; color: #000; transform: scale(1.1); }
        .nafe-video-tag { position: absolute; top: 12px; right: 12px; padding: 4px 10px; font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #fff; font-weight: 700; }
        .nafe-news__latest-tweet { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 40px; display: flex; gap: 40px; margin-top: 40px; }
        .nafe-news__lt-icon { width: 60px; height: 60px; background: #1d9bf0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #fff; flex-shrink: 0; }
        .nafe-news__lt-content { flex: 1; }
        .nafe-news__lt-head { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .nafe-news__lt-text { line-height: 1.4; margin-bottom: 20px; }
        .nafe-news__lt-foot { font-size: 11px; opacity: 0.5; }
        @media (max-width: 768px) {
          .nafe-news__latest-tweet { flex-direction: column; padding: 24px; gap: 20px; }
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
