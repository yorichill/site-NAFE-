// NAFE — layout shell: ticker, sidebar, sticky header, background layers

const { useState, useEffect, useRef } = React;

// ========== ScoreTicker ==========
function ScoreTicker() {
  window.store.useVersion();
  const scores = window.store.scores.list();
  if (!scores.length) return null;
  const doubled = [...scores, ...scores];
  return (
    <div className="nafe-ticker">
      <div className="nafe-ticker__track">
        {doubled.map((s, i) => (
          <span key={i} className="nafe-ticker__item">
            {s.live && <span className="nafe-ticker__dot" />}
            <span className="nafe-ticker__game">{s.game}</span>
            <span className="nafe-ticker__match">{s.match}</span>
            <span className="nafe-ticker__score">{s.score}</span>
            <span className="nafe-ticker__sep">//</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ========== UserPill (header right side) ==========
function UserPill({ onLogin, onRegister, onNav, accent }) {
  window.store.useVersion();
  const user = window.store.currentUser();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!e.target.closest?.(".nafe-userPill")) setOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  if (!user) {
    return (
      <div className="nafe-auth">
        <button className="nafe-btn nafe-btn--ghost nafe-btn--sm" onClick={onLogin}>
          Se connecter
        </button>
        <button
          className="nafe-btn nafe-btn--accent nafe-btn--sm"
          style={{ background: accent }}
          onClick={onRegister}
        >
          S'inscrire
        </button>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const initial = (user.username || user.email)[0]?.toUpperCase() || "?";

  return (
    <div className="nafe-userPill">
      <button className="nafe-userPill__btn" onClick={() => setOpen((o) => !o)}>
        <span
          className="nafe-userPill__avatar"
          style={{ background: isAdmin ? accent : "rgba(255,255,255,0.08)", color: isAdmin ? "#fff" : "rgba(255,255,255,0.85)" }}
        >
          {initial}
        </span>
        <span className="nafe-userPill__meta">
          <span className="nafe-userPill__name">{user.username}</span>
          <span className="nafe-mono nafe-userPill__role" style={{ color: isAdmin ? accent : "rgba(255,255,255,0.5)" }}>
            {isAdmin ? "ADMIN" : `FAN · ${user.xp || 0} XP`}
          </span>
        </span>
        <span className="nafe-userPill__chevron">▾</span>
      </button>
      {open && (
        <div className="nafe-userPill__menu nafe-clip-card">
          <a href="#/club" onClick={(e) => { e.preventDefault(); onNav("#/club"); setOpen(false); }}>
            Mon dashboard
          </a>
          {isAdmin && (
            <a href="#/admin" onClick={(e) => { e.preventDefault(); onNav("#/admin"); setOpen(false); }}>
              Console admin
            </a>
          )}
          <button
            className="nafe-userPill__logout"
            onClick={() => { window.store.logout(); setOpen(false); }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

// ========== StickyHeader ==========
function StickyHeader({ route, onNav, onLogin, onRegister, accent }) {
  const [shrunk, setShrunk] = useState(false);
  useEffect(() => {
    const scroller = document.querySelector(".nafe-main");
    if (!scroller) return;
    const onScroll = () => setShrunk(scroller.scrollTop > 80);
    scroller.addEventListener("scroll", onScroll);
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nafe-header ${shrunk ? "is-shrunk" : ""}`}>
      <a href="#/" onClick={(e) => { e.preventDefault(); onNav("#/"); }} className="nafe-logo">
        NAFE<span className="nafe-logo__slash">/</span>TEAM
      </a>
      <nav className="nafe-header__nav">
        <a href="#/shop" onClick={(e) => { e.preventDefault(); onNav("#/shop"); }}
           className={route === "/shop" ? "is-active" : ""}>Shop</a>
        <a href="#/teams/valorant" onClick={(e) => { e.preventDefault(); onNav("#/teams/valorant"); }}
           className={route.startsWith("/teams") ? "is-active" : ""}>Roster</a>
        <a href="#/live" onClick={(e) => { e.preventDefault(); onNav("#/live"); }}
           className={route === "/live" ? "is-active" : ""}>Live</a>
        <a href="#/calendar" onClick={(e) => { e.preventDefault(); onNav("#/calendar"); }}
           className={route === "/calendar" ? "is-active" : ""}>Calendrier</a>
        <a href="#/news" onClick={(e) => { e.preventDefault(); onNav("#/news"); }}
           className={route === "/news" ? "is-active" : ""}>Actu</a>
        <a href="#/community" onClick={(e) => { e.preventDefault(); onNav("#/community"); }}
           className={route === "/community" ? "is-active" : ""}>Community</a>
        <a href="#/contact" onClick={(e) => { e.preventDefault(); onNav("#/contact"); }}
           className={route === "/contact" ? "is-active" : ""}>Contact</a>
        <TwitterToggle />
        <UserPill onLogin={onLogin} onRegister={onRegister} onNav={onNav} accent={accent} />
      </nav>
    </header>
  );
}

function TwitterToggle() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button 
        className="nafe-twitter-toggle" 
        onClick={() => setOpen(!open)}
        title="Flux Twitter"
      >
        𝕏
      </button>
      {open && <SocialOverlay onClose={() => setOpen(false)} />}
    </>
  );
}

function SocialOverlay({ onClose }) {
  useEffect(() => {
    if (window.twttr) window.twttr.widgets.load();
  }, []);

  return (
    <div className="nafe-twitter-overlay nafe-clip-card">
      <div className="nafe-twitter-overlay__head">
        <span className="nafe-mono" style={{ fontSize: 10, color: "#1d9bf0" }}>LIVE FEED @NAFEOFFICIEL</span>
        <button onClick={onClose} style={{ opacity: 0.5, fontSize: 18 }}>×</button>
      </div>
      <div className="nafe-twitter-overlay__body">
        <a className="twitter-timeline" data-theme="dark" data-chrome="noheader nofooter noborders transparent" data-height="600" href="https://twitter.com/NafeOfficiel?ref_src=twsrc%5Etfw">Tweets by NafeOfficiel</a>
      </div>
    </div>
  );
}

// ========== Sidebar ==========
function Sidebar({ route, onNav }) {
  window.store.useVersion();
  const [hover, setHover] = useState(null);
  const isAdmin = window.store.isAdmin();

  const sections = {
    home: [{ label: "Accueil", href: "#/" }],
    teams: [
      { label: "Valorant", href: "#/teams/valorant" },
      { label: "Rocket League", href: "#/teams/rl" },
      { label: "CS2", href: "#/teams/cs2" },
    ],
    live: [{ label: "Match en cours", href: "#/live" }],
    calendar: [{ label: "Mois & liste", href: "#/calendar" }],
    news:      [{ label: "Dernières dépêches", href: "#/news" }],
    community: [{ label: "Posts & discussions", href: "#/community" }],
    contact:   [
      { label: "Discord",   href: "#/contact" },
      { label: "Twitch",    href: "#/contact" },
      { label: "YouTube",   href: "#/contact" },
      { label: "Twitter/X", href: "#/contact" },
    ],
    admin: [
      { label: "Joueurs",            href: "#/admin/players" },
      { label: "Sous-équipes",       href: "#/admin/subteams" },
      { label: "Matchs & calendrier",href: "#/admin/matches" },
      { label: "Actualités",         href: "#/admin/news" },
      { label: "Ticker scores",      href: "#/admin/scores" },
      { label: "Palmarès",           href: "#/admin/trophies" },
      { label: "Réseaux sociaux",    href: "#/admin/socials" },
      { label: "Utilisateurs",       href: "#/admin/users" },
    ],
    shop: [{ label: "Bientôt", href: "#/shop" }],
  };

  // Filtre la nav : l'onglet admin n'apparaît que pour les admins
  const items = window.NAV.filter((n) => n.key !== "admin" || isAdmin);

  return (
    <aside className="nafe-sidebar">
      <div className="nafe-sidebar__mark">N</div>
      {items.map((item) => {
        const active =
          (item.key === "teams"     && route.startsWith("/teams")) ||
          (item.key === "admin"     && route.startsWith("/admin")) ||
          (item.key === "home"      && route === "/") ||
          (item.key === "community" && route === "/community") ||
          (item.key === "contact"   && route === "/contact") ||
          (item.key !== "teams" && item.key !== "admin" && item.key !== "home" && route === `/${item.key}`);
        return (
          <div
            key={item.key}
            className="nafe-sidebar__item"
            onMouseEnter={() => setHover(item.key)}
            onMouseLeave={() => setHover(null)}
          >
            <button
              className={`nafe-sidebar__btn ${active ? "is-active" : ""}`}
              onClick={() => onNav(item.href)}
              aria-label={item.label}
            >
              <span>{item.icon}</span>
            </button>
            {hover === item.key && (
              <div className="nafe-sidebar__flyout">
                <span className="nafe-sidebar__flyoutLabel">{item.label}</span>
                {(sections[item.key] || []).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    onClick={(e) => { e.preventDefault(); onNav(s.href); }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="nafe-sidebar__foot">
        <span>FR</span>
        <span>/</span>
        <span>EN</span>
      </div>
    </aside>
  );
}

Object.assign(window, { ScoreTicker, StickyHeader, Sidebar, UserPill, SocialOverlay });
