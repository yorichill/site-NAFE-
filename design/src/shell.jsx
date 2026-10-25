// NAFE — layout shell: ticker, sidebar, sticky header, background layers

const { useState, useEffect, useRef } = React;

// ========== ScoreTicker ==========
function ScoreTicker() {
  window.store.useVersion();
  const scores = window.store.scores.list();

  useEffect(() => {
    if (scores.length > 0) {
      document.body.classList.add("has-ticker");
    } else {
      document.body.classList.remove("has-ticker");
    }
    return () => document.body.classList.remove("has-ticker");
  }, [scores.length]);

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

// ========== LatestTweetHeader ==========
function LatestTweetHeader() {
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = () => {
      fetch("/api/tweets")
        .then(r => r.json())
        .then(d => {
          if (d.tweets && d.tweets.length > 0) setTweet(d.tweets[0]);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    fetchLatest();
    const timer = setInterval(fetchLatest, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

  if (loading || !tweet) return null;

  return (
    <a 
      href={`https://x.com/NafeOfficiel/status/${tweet.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="nafe-header__tweet"
    >
      <span className="nafe-header__tweet-x nafe-mono">X</span>
      <span className="nafe-header__tweet-text">{tweet.text}</span>
    </a>
  );
}

// ========== NafeSymbol (Official Phoenix Icon from Brand Guide) ==========
function NafeSymbol({ size = 30, className = "" }) {
  return (
    <img 
      src="assets/brand/nafe-symbol.png" 
      alt="NAFE"
      className={`nafe-phoenix-symbol ${className}`}
      style={{ height: size, width: "auto", objectFit: "contain", display: "inline-block", verticalAlign: "middle" }}
    />
  );
}

// ========== NafeLogo (Official Full Logo with Lettering from Brand Guide) ==========
function NafeLogo({ height = 42, className = "" }) {
  return (
    <img 
      src="assets/brand/nafe-logo.png" 
      alt="NAFE ESPORT"
      className={`nafe-phoenix-logo ${className}`}
      style={{ height: height, width: "auto", objectFit: "contain", display: "inline-block", verticalAlign: "middle" }}
    />
  );
}

// ========== StickyHeader with Mobile Navigation Drawer ==========
function StickyHeader({ route, onNav, onLogin, onRegister, accent }) {
  const [shrunk, setShrunk] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = window.store.isAdmin();
  const user = window.store.currentUser();

  useEffect(() => {
    const scroller = document.querySelector(".nafe-main");
    if (!scroller) return;
    const onScroll = () => setShrunk(scroller.scrollTop > 80);
    scroller.addEventListener("scroll", onScroll);
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileNav = (href) => {
    onNav(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`nafe-header ${shrunk ? "is-shrunk" : ""}`}>
        <div className="nafe-header__left">
          <button
            className="nafe-header__mobile-burger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Ouvrir le menu mobile"
          >
            <span>{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
          <a href="#/" onClick={(e) => { e.preventDefault(); onNav("#/"); }} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }} title="NAFE ESPORT">
            <NafeSymbol size={shrunk ? 30 : 38} />
          </a>
        </div>
        <nav className="nafe-header__nav">
          <a href="#/teams/fortnite" onClick={(e) => { e.preventDefault(); onNav("#/teams/fortnite"); }}
             className={route.startsWith("/teams") ? "is-active" : ""}>Roster</a>
          <a href="#/sponsors" onClick={(e) => { e.preventDefault(); onNav("#/sponsors"); }}
             className={route === "/sponsors" ? "is-active" : ""}>Sponsors</a>
          <a href="#/association" onClick={(e) => { e.preventDefault(); onNav("#/association"); }}
             className={route === "/association" ? "is-active" : ""}>L'Association</a>
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
          <a href="#/shop" onClick={(e) => { e.preventDefault(); onNav("#/shop"); }}
             className={route === "/shop" ? "is-active" : ""}>Shop</a>
          <UserPill onLogin={onLogin} onRegister={onRegister} onNav={onNav} accent={accent} />
        </nav>
        <div className="nafe-header__mobile-right">
          {user ? (
            <button
              className="nafe-header__mobile-user-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Mon profil"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0 }}
            >
              <span
                className="nafe-userPill__avatar"
                style={{
                  background: isAdmin ? accent : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  width: 32,
                  height: 32,
                  fontSize: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%"
                }}
              >
                {(user.username || user.email)[0]?.toUpperCase() || "?"}
              </span>
            </button>
          ) : (
            <button
              className="nafe-btn nafe-btn--accent nafe-btn--sm"
              style={{ background: accent, padding: "6px 12px", fontSize: 11 }}
              onClick={onLogin}
            >
              Connexion
            </button>
          )}
        </div>
      </header>

      {/* Drawer navigation mobile plein écran */}
      {mobileMenuOpen && (
        <div className="nafe-mobile-drawer">
          <div className="nafe-mobile-drawer__overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="nafe-mobile-drawer__content nafe-clip-card">
            <div className="nafe-mobile-drawer__head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <NafeSymbol size={30} />
                <span className="nafe-display" style={{ fontSize: 18, color: "#fff" }}>NAFE ESPORT</span>
              </div>
              <button
                className="nafe-mobile-drawer__close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="nafe-mobile-drawer__links">
              <a href="#/" onClick={(e) => { e.preventDefault(); handleMobileNav("#/"); }}
                 className={`nafe-mobile-drawer__link ${route === "/" ? "is-active" : ""}`}>
                <span className="nafe-mono">01 //</span> Accueil Hub
              </a>
              <a href="#/teams/fortnite" onClick={(e) => { e.preventDefault(); handleMobileNav("#/teams/fortnite"); }}
                 className={`nafe-mobile-drawer__link ${route.startsWith("/teams") ? "is-active" : ""}`}>
                <span className="nafe-mono">02 //</span> Rosters (Fortnite / Valorant / RL)
              </a>
              <a href="#/sponsors" onClick={(e) => { e.preventDefault(); handleMobileNav("#/sponsors"); }}
                 className={`nafe-mobile-drawer__link ${route === "/sponsors" ? "is-active" : ""}`}>
                <span className="nafe-mono" style={{ color: accent }}>03 //</span> Nos Sponsors
              </a>
              <a href="#/association" onClick={(e) => { e.preventDefault(); handleMobileNav("#/association"); }}
                 className={`nafe-mobile-drawer__link ${route === "/association" ? "is-active" : ""}`}>
                <span className="nafe-mono" style={{ color: "var(--nafe-green-peas)" }}>04 //</span> L'Association & Don
              </a>
              <a href="#/live" onClick={(e) => { e.preventDefault(); handleMobileNav("#/live"); }}
                 className={`nafe-mobile-drawer__link ${route === "/live" ? "is-active" : ""}`}>
                <span className="nafe-mono">05 //</span> Matchs en direct
              </a>
              <a href="#/calendar" onClick={(e) => { e.preventDefault(); handleMobileNav("#/calendar"); }}
                 className={`nafe-mobile-drawer__link ${route === "/calendar" ? "is-active" : ""}`}>
                <span className="nafe-mono">06 //</span> Calendrier
              </a>
              <a href="#/news" onClick={(e) => { e.preventDefault(); handleMobileNav("#/news"); }}
                 className={`nafe-mobile-drawer__link ${route === "/news" ? "is-active" : ""}`}>
                <span className="nafe-mono">07 //</span> Dernières actus
              </a>
              <a href="#/community" onClick={(e) => { e.preventDefault(); handleMobileNav("#/community"); }}
                 className={`nafe-mobile-drawer__link ${route === "/community" ? "is-active" : ""}`}>
                <span className="nafe-mono">08 //</span> Espace Communauté
              </a>
              <a href="#/contact" onClick={(e) => { e.preventDefault(); handleMobileNav("#/contact"); }}
                 className={`nafe-mobile-drawer__link ${route === "/contact" ? "is-active" : ""}`}>
                <span className="nafe-mono">09 //</span> Réseaux & Contact
              </a>
              <a href="#/shop" onClick={(e) => { e.preventDefault(); handleMobileNav("#/shop"); }}
                 className={`nafe-mobile-drawer__link ${route === "/shop" ? "is-active" : ""}`}>
                <span className="nafe-mono">10 //</span> Shop officiel
              </a>
              {isAdmin && (
                <a href="#/admin" onClick={(e) => { e.preventDefault(); handleMobileNav("#/admin"); }}
                   className="nafe-mobile-drawer__link" style={{ color: accent, borderColor: accent }}>
                  <span className="nafe-mono">◈ //</span> Console Admin
                </a>
              )}
            </div>

            <div className="nafe-mobile-drawer__foot">
              {user ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="nafe-mono" style={{ fontSize: 12 }}>Connecté : <strong>{user.username}</strong></span>
                  <button className="nafe-btn nafe-btn--ghost nafe-btn--sm" onClick={() => { window.store.logout(); setMobileMenuOpen(false); }}>
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="nafe-btn nafe-btn--ghost nafe-btn--sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onLogin(); setMobileMenuOpen(false); }}>
                    Connexion
                  </button>
                  <button className="nafe-btn nafe-btn--accent nafe-btn--sm" style={{ flex: 1, justifyContent: "center", background: accent }} onClick={() => { onRegister(); setMobileMenuOpen(false); }}>
                    S'inscrire
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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
      { label: "Fortnite", href: "#/teams/fortnite" },
      { label: "Valorant", href: "#/teams/valorant" },
      { label: "Rocket League", href: "#/teams/rl" },
    ],
    sponsors: [{ label: "Nos partenaires officiels", href: "#/sponsors" }],
    association: [
      { label: "Présentation Loi 1901", href: "#/association" },
      { label: "Termes & Statuts", href: "#/association" },
      { label: "Soutenir l'Association", href: "#/association" },
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
      { label: "Page de garde",      href: "#/admin/home" },
      { label: "Joueurs",            href: "#/admin/players" },
      { label: "Sponsors",           href: "#/admin/sponsors" },
      { label: "L'Association",      href: "#/admin/association" },
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
      <div className="nafe-sidebar__mark" onClick={() => onNav("#/")} title="NAFE ESPORT — Accueil">
        <NafeSymbol size={28} />
      </div>
      {items.map((item) => {
        const active =
          (item.key === "teams"       && route.startsWith("/teams")) ||
          (item.key === "admin"       && route.startsWith("/admin")) ||
          (item.key === "home"        && route === "/") ||
          (item.key === "sponsors"    && route === "/sponsors") ||
          (item.key === "association" && route === "/association") ||
          (item.key === "community"   && route === "/community") ||
          (item.key === "contact"     && route === "/contact") ||
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

Object.assign(window, { ScoreTicker, StickyHeader, Sidebar, UserPill, SocialOverlay, NafeSymbol, NafeLogo });
