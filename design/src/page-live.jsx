// NAFE — Live match / watch page

const { useState: useLiveState, useEffect: useLiveEffect } = React;

const TWITCH_CHANNEL = "nafe_officiel";

function TwitchPlayer({ autoplay = false }) {
  const parent = window.location.hostname || "localhost";
  const src = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${parent}&autoplay=${autoplay}`;
  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#0e0e10" }}>
      <iframe
        src={src}
        allowFullScreen
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
        title="NAFE Twitch"
      />
    </div>
  );
}

function LivePage({ accent }) {
  window.store.useVersion();
  const live = window.store.getLiveMatch();
  const upcoming = window.store.getUpcomingMatches(6).filter((m) => m.id !== live?.id);

  const [tick, setTick] = useLiveState(0);
  useLiveEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [live?.id]);

  if (!live) {
    return (
      <div className="nafe-page">
        <section className="nafe-team__hero">
          <span className="nafe-eyebrow" style={{ color: accent }}>Live · NAFE TEAM</span>
          <h1 className="nafe-display nafe-team__title">LIVE<span style={{ color: accent }}>.</span></h1>
          <p className="nafe-team__lede">
            Ici s'affichent le match en cours, le scoreboard et le stream du club.
          </p>
        </section>

        {/* Twitch player — toujours visible */}
        <section className="nafe-section" style={{ marginTop: 0 }}>
          <header className="nafe-section__head" style={{ marginBottom: 16 }}>
            <div>
              <span className="nafe-eyebrow" style={{ color: "#9147ff" }}>Twitch · {TWITCH_CHANNEL}</span>
              <h2 className="nafe-display nafe-section__title">Canal officiel</h2>
            </div>
            <a
              className="nafe-mono"
              href={`https://www.twitch.tv/${TWITCH_CHANNEL}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9147ff", opacity: 0.85, fontSize: 12 }}
            >
              OUVRIR SUR TWITCH →
            </a>
          </header>
          <TwitchPlayer autoplay={false} />
          <div className="nafe-empty" style={{ marginTop: 16, padding: "16px 0" }}>
            <span className="nafe-mono" style={{ color: accent }}>AUCUN MATCH EN DIRECT</span>
            <p className="nafe-empty__text" style={{ marginTop: 8 }}>
              {window.store.isAdmin()
                ? <>Passe un match en statut <strong>En direct</strong> depuis l'admin pour afficher le scoreboard ici.</>
                : "Aucune diffusion live en ce moment. Abonne-toi pour être notifié du prochain stream."}
            </p>
            {window.store.isAdmin() && (
              <a className="nafe-btn nafe-btn--accent" style={{ background: accent, marginTop: 12 }} href="#/admin/matches">
                → Admin matchs
              </a>
            )}
          </div>
        </section>

        {upcoming.length > 0 && (
          <section className="nafe-section">
            <header className="nafe-section__head">
              <div>
                <span className="nafe-eyebrow">À suivre</span>
                <h2 className="nafe-display nafe-section__title">Prochains matchs</h2>
              </div>
            </header>
            <div className="nafe-upnext">
              {upcoming.map((u) => (
                <div key={u.id} className="nafe-up">
                  <span className="nafe-mono nafe-up__when">{u.date} · {u.time}</span>
                  <div>
                    <p className="nafe-display nafe-up__title">NAFE vs {u.opp || "TBD"}</p>
                    <p className="nafe-mono nafe-up__event">{u.event} · {u.game}</p>
                  </div>
                  <span className="nafe-mono nafe-up__arrow">→</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  const [a, b] = String(live.result || "").split(/[-–]/).map(s => (s || "").trim());
  const seconds = tick % 60;
  const minutes = Math.floor(tick / 60) % 60;
  const timer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="nafe-page">
      <section className="nafe-live__hero">
        <div className="nafe-live__banner">
          <span className="nafe-mono nafe-live__tag" style={{ background: "#E53E3E" }}>
            <span className="nafe-pulse" /> EN DIRECT
          </span>
          <span className="nafe-mono nafe-live__event">{live.event}</span>
          <span className="nafe-live__spacer" />
          <span className="nafe-mono nafe-live__viewers">{live.loc}</span>
        </div>

        <div className="nafe-live__main">
          <div className="nafe-live__team nafe-live__team--home">
            <div className="nafe-live__logo" style={{ borderColor: accent, color: accent }}>
              NAFE
            </div>
            <div>
              <span className="nafe-mono nafe-live__teamMeta">{live.game}</span>
              <h2 className="nafe-display nafe-live__teamName">NAFE</h2>
              <span className="nafe-mono nafe-live__record">{live.event}</span>
            </div>
            <span className="nafe-display nafe-live__score" style={{ color: accent }}>{a || "—"}</span>
          </div>

          <div className="nafe-live__mid">
            <span className="nafe-mono nafe-live__map">{live.game}</span>
            <span className="nafe-display nafe-live__mapName">{live.event}</span>
            <span className="nafe-mono nafe-live__round">{live.loc}</span>
          </div>

          <div className="nafe-live__team nafe-live__team--away">
            <span className="nafe-display nafe-live__score">{b || "—"}</span>
            <div>
              <span className="nafe-mono nafe-live__teamMeta">ADV</span>
              <h2 className="nafe-display nafe-live__teamName">{live.opp || "TBD"}</h2>
              <span className="nafe-mono nafe-live__record">—</span>
            </div>
            <div className="nafe-live__logo">{(live.opp || "?").slice(0, 2).toUpperCase()}</div>
          </div>
        </div>

        <div className="nafe-live__cta">
          <a
            className="nafe-btn nafe-btn--ghost nafe-clip-card"
            href={`https://www.twitch.tv/${TWITCH_CHANNEL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ↗ Ouvrir sur Twitch
          </a>
          <span className="nafe-mono nafe-live__platforms">TWITCH · YT · KICK</span>
        </div>
      </section>

      {/* Stream embed */}
      <section className="nafe-section" style={{ marginTop: 0 }}>
        <TwitchPlayer autoplay={false} />
      </section>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="nafe-section">
          <header className="nafe-section__head">
            <div>
              <span className="nafe-eyebrow">À suivre</span>
              <h2 className="nafe-display nafe-section__title">Prochains matchs</h2>
            </div>
          </header>
          <div className="nafe-upnext">
            {upcoming.map((u) => (
              <div key={u.id} className="nafe-up">
                <span className="nafe-mono nafe-up__when">{u.date} · {u.time}</span>
                <div>
                  <p className="nafe-display nafe-up__title">NAFE vs {u.opp || "TBD"}</p>
                  <p className="nafe-mono nafe-up__event">{u.event} · {u.game}</p>
                </div>
                <span className="nafe-mono nafe-up__arrow">→</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

window.LivePage = LivePage;
