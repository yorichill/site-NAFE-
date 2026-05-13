// NAFE — Aggregated Social Feed
// Merges multiple sources into a "live" feel masonry or list.

function SocialFeed({ accent }) {
  window.store.useVersion();
  const [tweets, setTweets] = React.useState([]);
  const posts = window.store.posts.list().slice(0, 10);
  const news = window.store.news.list().slice(0, 5);

  React.useEffect(() => {
    fetch("/api/tweets")
      .then(r => r.json())
      .then(d => setTweets(d.tweets || []))
      .catch(() => {});
  }, []);

  // Combine and sort by date
  const combined = [
    ...tweets.map(t => ({ type: 'tweet', date: t.created_at, data: t })),
    ...posts.map(p => ({ type: 'post', date: p.createdAt, data: p })),
    ...news.map(n => ({ type: 'news', date: n.createdAt || n.date, data: n }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="nafe-social-feed">
      {combined.map((item, idx) => {
        if (item.type === 'tweet') return <TweetItem key={idx} tweet={item.data} accent={accent} />;
        if (item.type === 'post') return <PostItem key={idx} post={item.data} accent={accent} />;
        if (item.type === 'news') return <NewsItem key={idx} news={item.data} accent={accent} />;
        return null;
      })}
      
      <style>{`
        .nafe-social-feed { display: flex; flex-direction: column; gap: 20px; }
        .nafe-feed-item { 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.06); 
          padding: 24px; 
          position: relative;
          transition: all 0.3s;
        }
        .nafe-feed-item:hover { background: rgba(255,255,255,0.05); border-color: rgba(var(--accent-rgb), 0.3); }
        .nafe-feed-tag { 
          position: absolute; top: 0; right: 24px; 
          padding: 4px 10px; font-size: 9px; 
          background: rgba(255,255,255,0.1); color: #fff; 
          font-family: 'JetBrains Mono', monospace;
        }
        .nafe-feed-item__meta { margin-bottom: 12px; font-size: 11px; opacity: 0.5; display: flex; gap: 12px; }
        .nafe-feed-item__title { font-size: 20px; margin-bottom: 8px; }
        .nafe-feed-item__content { font-size: 14px; opacity: 0.8; line-height: 1.6; }
      `}</style>
    </div>
  );
}

function TweetItem({ tweet, accent }) {
  const date = new Date(tweet.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase();
  return (
    <div className="nafe-feed-item nafe-clip-card">
      <div className="nafe-feed-tag" style={{ background: '#1d9bf0' }}>𝕏 TWITTER</div>
      <div className="nafe-feed-item__meta nafe-mono">
        <span style={{ color: '#1d9bf0' }}>@NAFEOFFICIEL</span>
        <span>· {date}</span>
      </div>
      <p className="nafe-feed-item__content">{tweet.text}</p>
      <div style={{ marginTop: 16, fontSize: 11, opacity: 0.4 }} className="nafe-mono">
        ♥ {tweet.public_metrics?.like_count || 0} · ↺ {tweet.public_metrics?.retweet_count || 0}
      </div>
    </div>
  );
}

function PostItem({ post, accent }) {
  const date = new Date(post.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase();
  return (
    <div className="nafe-feed-item nafe-clip-card">
      <div className="nafe-feed-tag" style={{ background: accent }}>✦ COMMUNITY</div>
      <div className="nafe-feed-item__meta nafe-mono">
        <span style={{ color: accent }}>{post.authorName}</span>
        <span>· {date}</span>
      </div>
      <h4 className="nafe-display nafe-feed-item__title">{post.title}</h4>
      <p className="nafe-feed-item__content">{post.content}</p>
    </div>
  );
}

function NewsItem({ news, accent }) {
  const date = news.date;
  return (
    <div className="nafe-feed-item nafe-clip-card" style={{ borderLeft: `4px solid ${accent}` }}>
      <div className="nafe-feed-tag">✎ NEWS</div>
      <div className="nafe-feed-item__meta nafe-mono">
        <span>{news.cat}</span>
        <span>· {date}</span>
      </div>
      <h4 className="nafe-display nafe-feed-item__title">{news.title}</h4>
      <p className="nafe-feed-item__content">{news.lede}</p>
    </div>
  );
}

window.SocialFeed = SocialFeed;
