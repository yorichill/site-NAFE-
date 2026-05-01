// NAFE — player cards. Three styles: tilt3d (orig), idcard, statdense

const { useState: usePCState } = React;

// Shared SVG placeholder "mugshot" — striped brand-appropriate monogram
function MugPlaceholder({ tag, size = 160, accent }) {
  const seed = tag.charCodeAt(0) + tag.charCodeAt(tag.length - 1);
  const rot = (seed % 9) - 4;
  return (
    <svg viewBox="0 0 160 200" width={size} height={(size / 160) * 200} className="nafe-mug">
      <defs>
        <pattern id={`stripes-${tag}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform={`rotate(${rot + 35})`}>
          <rect width="6" height="6" fill="#0B1228" />
          <line x1="0" y1="0" x2="0" y2="6" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="160" height="200" fill={`url(#stripes-${tag})`} />
      {/* Silhouette */}
      <ellipse cx="80" cy="78" rx="30" ry="34" fill="#050814" opacity="0.85" />
      <path d="M20 200 Q20 130 80 130 Q140 130 140 200 Z" fill="#050814" opacity="0.85" />
      {/* Tag strip */}
      <rect x="0" y="172" width="160" height="18" fill={accent} opacity="0.9" />
      <text x="8" y="185" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#fff" letterSpacing="2">
        @{tag.toUpperCase()}
      </text>
      {/* Crosshair */}
      <g opacity="0.5">
        <line x1="80" y1="10" x2="80" y2="22" stroke={accent} strokeWidth="1" />
        <line x1="80" y1="120" x2="80" y2="132" stroke={accent} strokeWidth="1" />
        <line x1="10" y1="80" x2="22" y2="80" stroke={accent} strokeWidth="1" />
        <line x1="138" y1="80" x2="150" y2="80" stroke={accent} strokeWidth="1" />
      </g>
    </svg>
  );
}

// Barcode SVG
function Barcode({ seed = "NAFE", accent = "#1E4FD8", width = 120, height = 30 }) {
  const bars = [];
  let x = 0;
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) & 0xffff;
  let state = s || 9731;
  while (x < width) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const w = 1 + (state % 4);
    const fill = (state & 1) === 0;
    if (fill) bars.push(<rect key={x} x={x} y="0" width={w} height={height - 10} fill="#E8F0FF" />);
    x += w + 1;
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="nafe-barcode">
      {bars}
      <text x="0" y={height - 1} fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#E8F0FF" opacity="0.7">
        {seed.toUpperCase()} · 0427 · NAFE/26
      </text>
    </svg>
  );
}

// ========== Card style: Tilt 3D (original DNA) ==========
function PlayerCardTilt({ p, accent }) {
  const [hover, setHover] = usePCState(false);
  const style = {
    "--accent": accent,
    transform: hover ? "translateY(-8px) rotateX(4deg) rotateY(-4deg)" : "none",
  };
  return (
    <article
      className="nafe-card nafe-card--tilt nafe-clip-card"
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="nafe-card__jersey">{String(p.jersey).padStart(2, "0")}</span>
      <div className="nafe-card__head">
        <span className="nafe-eyebrow">{p.role}</span>
        <span className="nafe-pulse" />
      </div>
      <div className="nafe-card__mug">
        <MugPlaceholder tag={p.tag} size={150} accent={accent} />
      </div>
      <div className="nafe-card__body">
        <h3 className="nafe-display nafe-card__name">{p.name}</h3>
        <p className="nafe-mono nafe-card__tag">@{p.tag}</p>
      </div>
      <div className="nafe-card__foot">
        <div>
          <span className="nafe-card__statLabel">K/D</span>
          <p className="nafe-card__statVal">{p.kd.toFixed(2)}</p>
        </div>
        <button className="nafe-card__cta">Profil →</button>
      </div>
    </article>
  );
}

// ========== Card style: ID Card (dossier, credentials, barcode) ==========
function PlayerCardID({ p, accent }) {
  return (
    <article className="nafe-card nafe-card--id" style={{ "--accent": accent }}>
      <header className="nafe-id__band">
        <span className="nafe-mono">NAFE / ROSTER ID</span>
        <span className="nafe-mono">№ {String(p.jersey).padStart(3, "0")}</span>
      </header>
      <div className="nafe-id__body">
        <div className="nafe-id__mugWrap">
          <MugPlaceholder tag={p.tag} size={132} accent={accent} />
          <span className="nafe-id__flag nafe-mono">{p.country}</span>
        </div>
        <div className="nafe-id__fields">
          <div className="nafe-id__row">
            <span className="nafe-id__label">NOM</span>
            <span className="nafe-id__value nafe-display">{p.name}</span>
          </div>
          <div className="nafe-id__row">
            <span className="nafe-id__label">ALIAS</span>
            <span className="nafe-id__value nafe-mono">@{p.tag}</span>
          </div>
          <div className="nafe-id__row">
            <span className="nafe-id__label">RÔLE</span>
            <span className="nafe-id__value nafe-mono">{p.role}</span>
          </div>
          <div className="nafe-id__row">
            <span className="nafe-id__label">CLEAR.</span>
            <span className="nafe-id__value nafe-mono">AAA/26</span>
          </div>
        </div>
      </div>
      <footer className="nafe-id__foot">
        <Barcode seed={p.tag} accent={accent} />
        <div className="nafe-id__stampWrap">
          <div className="nafe-id__stamp">
            <span className="nafe-mono">CERTIFIÉ</span>
            <span className="nafe-mono">NAFE/26</span>
          </div>
        </div>
      </footer>
    </article>
  );
}

// ========== Card style: Stat Dense (trading card) ==========
function PlayerCardStat({ p, accent }) {
  return (
    <article className="nafe-card nafe-card--stat nafe-clip-card" style={{ "--accent": accent }}>
      <div className="nafe-stat__top">
        <div>
          <span className="nafe-eyebrow">{p.role}</span>
          <h3 className="nafe-display nafe-stat__name">{p.name}</h3>
          <p className="nafe-mono nafe-stat__tag">@{p.tag} · {p.country}</p>
        </div>
        <span className="nafe-stat__jersey nafe-display">{String(p.jersey).padStart(2, "0")}</span>
      </div>
      <div className="nafe-stat__grid">
        <StatBar label="K/D" value={p.kd} max={2} accent={accent} />
        {p.hs > 0 && <StatBar label="HS%" value={p.hs} max={60} accent={accent} suffix="%" />}
        {p.acs > 0 && <StatBar label="ACS" value={p.acs} max={300} accent={accent} />}
      </div>
      <div className="nafe-stat__foot">
        <MugPlaceholder tag={p.tag} size={80} accent={accent} />
        <div className="nafe-stat__meta">
          <p className="nafe-mono">SAISON 2026</p>
          <p className="nafe-mono">ROSTER TITULAIRE</p>
          <p className="nafe-mono">·································</p>
        </div>
      </div>
    </article>
  );
}

function StatBar({ label, value, max, accent, suffix = "" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="nafe-statbar">
      <div className="nafe-statbar__head">
        <span className="nafe-mono">{label}</span>
        <span className="nafe-mono nafe-statbar__val" style={{ color: accent }}>{value}{suffix}</span>
      </div>
      <div className="nafe-statbar__track">
        <div className="nafe-statbar__fill" style={{ width: `${pct}%`, background: accent }} />
        {[...Array(10)].map((_, i) => (
          <span key={i} className="nafe-statbar__tick" />
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ p, accent, variant }) {
  if (variant === "id") return <PlayerCardID p={p} accent={accent} />;
  if (variant === "stat") return <PlayerCardStat p={p} accent={accent} />;
  return <PlayerCardTilt p={p} accent={accent} />;
}

Object.assign(window, { PlayerCard, MugPlaceholder, Barcode });
