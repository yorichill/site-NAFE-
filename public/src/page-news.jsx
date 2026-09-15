// NAFE — News / Actualités page
const { useState: useNewsState, useEffect: useNewsEffect } = React;

const TWEETS_API = "/api/tweets";
const CATS = ["Tout", "Twitter", "YouTube", "Twitch", "Compétition", "Annonce", "Transfert", "Analyse", "Structure", "Partenariat", "Académie"];

function TweetCard({ tweet, accent, isPinned }) {
  const date = new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return (
    <div className={`nafe-tweet-card nafe-clip-card ${isPinned ? "nafe-hub-tweet-card--pinned" : ""}`}>
      {isPinned && (
        <div className="nafe-pinned-badge">
          <span>TWEET ÉPINGLÉ</span>
        </div>
      )}
      <div className="nafe-tweet-header">
        <div className="nafe-tweet-avatar">
          <img src={window.NAFE_TWITTER_AVATAR || "https://pbs.twimg.com/profile_images/2089748890027196416/5diWkPDV_400x400.png"} alt="NAFE" />
        </div>
        <div className="nafe-tweet-info">
          <div className="nafe-tweet-user">
            <span className="nafe-tweet-name">NAFE</span>
            <span className="nafe-tweet-handle">@NafeOfficiel · {date}</span>
          </div>
          <div className="nafe-tweet-x nafe-mono">X</div>
        </div>
      </div>
      <div className="nafe-tweet-body">
        <p className="nafe-tweet-text">{tweet.text}</p>
        {tweet.media && tweet.media.length > 0 && (
          <div className="nafe-tweet-media">
            <img src={tweet.media[0].url} alt="Tweet media" className="nafe-tweet-img" />
          </div>
        )}
      </div>
      <div className="nafe-tweet-footer">
        <div className="nafe-tweet-stats nafe-mono">
          <span className="nafe-tweet-stat">{tweet.public_metrics.like_count} LIKES</span>
          <span className="nafe-tweet-stat">{tweet.public_metrics.retweet_count} RETWEETS</span>
        </div>
        <a href={`https://x.com/NafeOfficiel/status/${tweet.id}`} target="_blank" rel="noopener" className="nafe-tweet-link nafe-mono" style={{ color: "var(--nafe-denim-blue)" }}>
          VOIR SUR TWITTER →
        </a>
      </div>
    </div>
  );
}

function VideoCard({ news, accent }) {
  const isYoutube = news.cat === "YouTube";
  const color = isYoutube ? "#FF0000" : "#9146FF";
  return (
    <div className="nafe-news__card nafe-video-card nafe-clip-card">
      <div className="nafe-video-thumb">
        <div className="nafe-video-play">▶</div>
        <span className="nafe-video-tag" style={{ background: color }}>{news.cat.toUpperCase()}</span>
      </div>
      <div className="nafe-news__cardBody">
        <div className="nafe-news__meta">
          <span className="nafe-mono" style={{ color: color }}>NOUVEAU CONTENU</span>
          <span className="nafe-mono">· {news.date}</span>
        </div>
        <h3 className="nafe-display nafe-news__cardTitle">{news.title}</h3>
        <p className="nafe-news__cardLede">{news.lede}</p>
        <div className="nafe-news__cardFoot">
          <a href={news.url} target="_blank" rel="noopener" className="nafe-mono" style={{ color: color, textDecoration: 'none', fontWeight: 700 }}>
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
  const [tweets, setTweets]       = useNewsState(window.DEFAULT_TWEETS || []);

  useNewsEffect(() => {
    fetch(TWEETS_API)
      .then(r => r.json())
      .then(d => {
        if (d.tweets && d.tweets.length > 0) {
          setTweets(d.tweets);
        }
      })
      .catch(() => {
        if (window.DEFAULT_TWEETS) setTweets(window.DEFAULT_TWEETS);
      });
  }, []);

  // Pinned tweet logic for NewsPage
  const pinnedSettingId = window.store.settings ? window.store.settings.getPinnedTweetId() : null;
  const pinnedTweet = (pinnedSettingId ? tweets.find(t => t.id === pinnedSettingId) : null)
    || tweets.find(t => t.pinned)
    || tweets[0];
  const sortedTweets = pinnedTweet
    ? [pinnedTweet, ...tweets.filter(t => t.id !== pinnedTweet.id)]
    : tweets;

  const filteredNews = cat === "Tout" ? allNews : allNews.filter(n => n.cat === cat);
  
  const showTweets = cat === "Tout" || cat === "Twitter";
  const showVideos = cat === "Tout" || cat === "YouTube" || cat === "Twitch";
  const showArticles = cat !== "Twitter" && cat !== "YouTube" && cat !== "Twitch";

  return (
    <div className="nafe-page">
      <section className="nafe-news__hero">
        <span className="nafe-eyebrow" style={{ color: accent || "var(--nafe-denim-blue)" }}>Actualité · NAFE ESPORT</span>
        <h1 className="nafe-display nafe-team__title">ACTU<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span></h1>
        <p className="nafe-team__lede">Les derniers tweets officiels, vidéos compétitives et annonces du club.</p>
      </section>

      <section className="nafe-news__filter">
        {CATS.map(c => (
          <button
            key={c}
            className={`nafe-news__chip ${cat === c ? "is-active" : ""}`}
            style={cat === c ? { background: accent || "var(--nafe-water-blue)", color: "#fff", borderColor: accent || "var(--nafe-water-blue)" } : {}}
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

        {/* TWEETS SECTION (PINNED FIRST) */}
        {showTweets && sortedTweets.length > 0 && (
          <div className="nafe-tweet-grid" style={{ marginTop: 40 }}>
            {sortedTweets.map((t, idx) => (
              <TweetCard 
                key={t.id} 
                tweet={t} 
                accent={accent} 
                isPinned={idx === 0 && Boolean(pinnedTweet && t.id === pinnedTweet.id)}
              />
            ))}
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
        .nafe-tweet-card { background: #000; border: 1px solid #1a1a1a; padding: 24px; position: relative; }
        .nafe-tweet-header { display: flex; gap: 12px; margin-bottom: 16px; align-items: flex-start; }
        .nafe-tweet-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1px solid #333; flex-shrink: 0; }
        .nafe-tweet-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .nafe-tweet-info { flex: 1; display: flex; justify-content: space-between; }
        .nafe-tweet-user { display: flex; flex-direction: column; }
        .nafe-tweet-name { font-weight: 700; color: #fff; font-size: 15px; }
        .nafe-tweet-handle { color: #71767b; font-size: 14px; }
        .nafe-tweet-x { color: #fff; font-weight: 700; font-size: 14px; opacity: 0.8; }
        .nafe-tweet-text { font-size: 15px; line-height: 1.5; color: #e7e9ea; margin-bottom: 16px; white-space: pre-wrap; }
        .nafe-tweet-media { border-radius: 12px; overflow: hidden; border: 1px solid #2f3336; margin-bottom: 16px; }
        .nafe-tweet-img { width: 100%; display: block; }
        .nafe-tweet-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #1a1a1a; }
        .nafe-tweet-stats { display: flex; gap: 20px; color: #71767b; font-size: 12px; }
        .nafe-tweet-link { color: #1d9bf0; text-decoration: none; font-size: 11px; font-weight: 700; }
        
        .nafe-video-thumb { aspect-ratio: 16/9; background: #000; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .nafe-video-play { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-size: 24px; transition: all 0.3s; }
        .nafe-video-card:hover .nafe-video-play { background: #fff; color: #000; transform: scale(1.1); }
        .nafe-video-tag { position: absolute; top: 12px; right: 12px; padding: 6px 12px; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #fff; }
        
        .nafe-news__cardTitle { font-size: 24px; margin: 12px 0; }
        .nafe-news__cardLede { opacity: 0.6; font-size: 14px; margin-bottom: 24px; }
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
