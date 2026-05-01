export default function LivePage() {
  const TWITCH_CHANNEL = "nafe_officiel";
  const live = { event: "VALORANT CHAMPIONS", result: "13 - 11", opp: "T1", loc: "SEOUL · KR", game: "VALORANT" };
  const upcoming = [
    { id: 1, date: "12 AOU", time: "18:00", opp: "G2", event: "LEC Summer", game: "LoL" },
    { id: 2, date: "15 AOU", time: "21:00", opp: "NAVI", event: "IEM Cologne", game: "CS2" }
  ];

  const [a, b] = String(live.result || "").split(/[-–]/).map(s => (s || "").trim());

  return (
    <div className="nafe-page">
      <section className="nafe-live__hero mt-8">
        <div className="nafe-live__banner flex justify-between items-center bg-white/5 p-4 nafe-clip-card">
          <span className="nafe-mono nafe-live__tag text-red-500 font-bold flex items-center gap-2">
            <span className="nafe-pulse" /> EN DIRECT
          </span>
          <span className="nafe-mono nafe-live__event text-white/70">{live.event}</span>
          <span className="nafe-live__spacer flex-1" />
          <span className="nafe-mono nafe-live__viewers text-white/50">{live.loc}</span>
        </div>

        <div className="nafe-live__main grid grid-cols-[1fr_auto_1fr] gap-8 mt-8 items-center bg-white/5 p-8 nafe-clip-card">
          <div className="nafe-live__team nafe-live__team--home flex items-center gap-6">
            <div className="nafe-live__logo w-24 h-24 border border-nafe-blue text-nafe-blue flex items-center justify-center font-display text-2xl font-black">
              NAFE
            </div>
            <div>
              <span className="nafe-mono nafe-live__teamMeta text-white/50">{live.game}</span>
              <h2 className="nafe-display nafe-live__teamName text-5xl">NAFE</h2>
              <span className="nafe-mono nafe-live__record text-white/50">{live.event}</span>
            </div>
            <span className="nafe-display nafe-live__score text-nafe-blue text-8xl ml-auto">{a || "—"}</span>
          </div>

          <div className="nafe-live__mid flex flex-col items-center gap-2 px-8 border-l border-r border-white/10">
            <span className="nafe-mono nafe-live__map text-white/50">{live.game}</span>
            <span className="nafe-display nafe-live__mapName text-3xl">{live.event}</span>
            <span className="nafe-mono nafe-live__round text-white/50">{live.loc}</span>
          </div>

          <div className="nafe-live__team nafe-live__team--away flex items-center gap-6">
            <span className="nafe-display nafe-live__score text-8xl mr-auto">{b || "—"}</span>
            <div className="text-right">
              <span className="nafe-mono nafe-live__teamMeta text-white/50">ADV</span>
              <h2 className="nafe-display nafe-live__teamName text-5xl">{live.opp || "TBD"}</h2>
              <span className="nafe-mono nafe-live__record text-white/50">—</span>
            </div>
            <div className="nafe-live__logo w-24 h-24 bg-white/10 flex items-center justify-center font-display text-2xl font-black">
              {(live.opp || "?").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="nafe-live__cta flex justify-center items-center gap-6 mt-12">
          <a
            className="nafe-btn nafe-btn--ghost nafe-clip-card px-8 py-4 border border-white/20 hover:bg-white/5 transition-colors uppercase tracking-widest font-display font-bold"
            href={`https://www.twitch.tv/${TWITCH_CHANNEL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ↗ Ouvrir sur Twitch
          </a>
          <span className="nafe-mono nafe-live__platforms text-white/50">TWITCH · YT · KICK</span>
        </div>
      </section>

      {/* Stream embed */}
      <section className="nafe-section mt-16">
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#0e0e10" }} className="nafe-clip-card">
          <iframe
            src={`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=localhost&autoplay=false`}
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
            title="NAFE Twitch"
          />
        </div>
      </section>

      {/* Upcoming */}
      <section className="nafe-section mt-24">
        <header className="nafe-section__head mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="nafe-eyebrow text-white/50">À suivre</span>
            <h2 className="nafe-display nafe-section__title text-5xl mt-2">Prochains matchs</h2>
          </div>
        </header>
        <div className="nafe-upnext flex flex-col gap-4">
          {upcoming.map((u) => (
            <div key={u.id} className="nafe-up flex items-center gap-8 bg-white/5 p-6 nafe-clip-card hover:bg-white/10 transition-colors">
              <span className="nafe-mono nafe-up__when text-white/50 w-32">{u.date} · {u.time}</span>
              <div className="flex-1">
                <p className="nafe-display nafe-up__title text-2xl">NAFE vs {u.opp || "TBD"}</p>
                <p className="nafe-mono nafe-up__event text-white/50 mt-1">{u.event} · {u.game}</p>
              </div>
              <span className="nafe-mono nafe-up__arrow text-2xl text-white/30">→</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
