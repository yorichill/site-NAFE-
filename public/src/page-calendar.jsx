// NAFE — Calendar / Calendrier page

const { useState: useCalState, useMemo } = React;

const GAME_FILTERS = [
  { k: "ALL",  label: "Tout" },
  { k: "VAL",  label: "Valorant" },
  { k: "RL",   label: "Rocket League" },
  { k: "CS2",  label: "CS2" },
  { k: "DROP", label: "Drops & Events" },
];

const STATUS_LABEL = {
  won:   { label: "VICTOIRE",  color: "#00D68F" },
  lost:  { label: "DÉFAITE",   color: "#E53E3E" },
  live:  { label: "EN DIRECT", color: "#E53E3E" },
  soon:  { label: "À VENIR",   color: null },
  drop:  { label: "DROP",      color: null },
  event: { label: "ÉVÉNEMENT", color: null },
};

function CalendarPage({ accent }) {
  window.store.useVersion();
  const FIXTURES = window.store.matches.list();
  const [game, setGame] = useCalState("ALL");
  const [view, setView] = useCalState("month");
  const today = new Date();
  const [cursor, setCursor] = useCalState(new Date(today.getFullYear(), today.getMonth(), 1));

  const filtered = useMemo(() => {
    if (game === "ALL") return FIXTURES;
    if (game === "DROP") return FIXTURES.filter(f => f.game === "DROP" || f.game === "EVENT");
    return FIXTURES.filter(f => f.game === game);
  }, [game, FIXTURES]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const evts = filtered.filter(f => f.date === iso);
    cells.push({ d, iso, evts });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const stats = {
    matches: filtered.filter(f => ["VAL", "LOL", "CS2"].includes(f.game)).length,
    wins: filtered.filter(f => f.status === "won").length,
    live: filtered.filter(f => f.status === "live").length,
  };

  return (
    <div className="nafe-page">
      <section className="nafe-team__hero">
        <span className="nafe-eyebrow" style={{ color: accent }}>
          Saison 2026 · Toutes compétitions
        </span>
        <h1 className="nafe-display nafe-team__title">CALENDRIER<span style={{ color: accent }}>.</span></h1>
        <p className="nafe-team__lede">
          Matchs officiels, drops, événements club — une source unique pour
          suivre NAFE TEAM au jour le jour.
        </p>
      </section>

      <>
          <section className="nafe-cal__stats">
            <div className="nafe-cal__stat">
              <span className="nafe-mono nafe-cal__statL">MATCHS AFFICHÉS</span>
              <span className="nafe-display nafe-cal__statV">{String(stats.matches).padStart(2, "0")}</span>
            </div>
            <div className="nafe-cal__stat">
              <span className="nafe-mono nafe-cal__statL">VICTOIRES</span>
              <span className="nafe-display nafe-cal__statV" style={{ color: "#00D68F" }}>{String(stats.wins).padStart(2, "0")}</span>
            </div>
            <div className="nafe-cal__stat">
              <span className="nafe-mono nafe-cal__statL">EN DIRECT</span>
              <span className="nafe-display nafe-cal__statV" style={{ color: accent }}>{String(stats.live).padStart(2, "0")}</span>
            </div>
            <div className="nafe-cal__stat">
              <span className="nafe-mono nafe-cal__statL">MOIS AFFICHÉ</span>
              <span className="nafe-display nafe-cal__statV" style={{ textTransform: "uppercase", fontSize: 24 }}>
                {monthName}
              </span>
            </div>
          </section>

          <section className="nafe-cal__toolbar">
            <div className="nafe-cal__filters">
              {GAME_FILTERS.map(f => (
                <button
                  key={f.k}
                  className={`nafe-news__chip ${game === f.k ? "is-active" : ""}`}
                  style={game === f.k ? { background: accent, color: "#fff", borderColor: accent } : {}}
                  onClick={() => setGame(f.k)}
                >
                  <span className="nafe-mono">{f.label.toUpperCase()}</span>
                  <span className="nafe-news__chipN nafe-mono">
                    {f.k === "ALL" ? FIXTURES.length
                      : f.k === "DROP" ? FIXTURES.filter(x => x.game === "DROP" || x.game === "EVENT").length
                      : FIXTURES.filter(x => x.game === f.k).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="nafe-cal__viewToggle">
              <button
                className={`nafe-tweaks__seg ${view === "month" ? "is-active" : ""}`}
                style={view === "month" ? { background: accent } : {}}
                onClick={() => setView("month")}
              >MOIS</button>
              <button
                className={`nafe-tweaks__seg ${view === "list" ? "is-active" : ""}`}
                style={view === "list" ? { background: accent } : {}}
                onClick={() => setView("list")}
              >LISTE</button>
            </div>
          </section>

          {view === "month" ? (
            <section className="nafe-cal__grid">
              <div className="nafe-cal__gridHead">
                <button className="nafe-cal__navBtn" onClick={() => setCursor(new Date(year, month - 1, 1))}>←</button>
                <span className="nafe-display nafe-cal__gridTitle">{monthName}</span>
                <button className="nafe-cal__navBtn" onClick={() => setCursor(new Date(year, month + 1, 1))}>→</button>
              </div>
              <div className="nafe-cal__dow">
                {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map(d => (
                  <span key={d} className="nafe-mono">{d}</span>
                ))}
              </div>
              <div className="nafe-cal__cells">
                {cells.map((c, i) => (
                  <div key={i} className={`nafe-cal__cell ${!c ? "is-empty" : ""} ${c?.evts?.length ? "has-evt" : ""}`}>
                    {c && (
                      <>
                        <span className="nafe-mono nafe-cal__cellDay">{String(c.d).padStart(2, "0")}</span>
                        <div className="nafe-cal__cellList">
                          {c.evts.map((e, j) => (
                            <div
                              key={j}
                              className={`nafe-cal__evt nafe-cal__evt--${(e.game || "").toLowerCase()} nafe-cal__evt--${e.status}`}
                              style={e.status === "live" ? { borderColor: accent, background: `${accent}22` } : {}}
                            >
                              <span className="nafe-mono nafe-cal__evtGame">{e.game}</span>
                              <span className="nafe-cal__evtText">
                                {e.opp ? `vs ${e.opp}` : e.event}
                              </span>
                              <span className="nafe-mono nafe-cal__evtTime">{e.time}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="nafe-cal__list">
              {filtered.length === 0 && (
                <div className="nafe-empty">
                  <span className="nafe-mono" style={{ color: accent }}>AUCUN MATCH</span>
                  <p className="nafe-empty__text">
                    {window.store.isAdmin()
                      ? "Aucun match programmé pour cette période."
                      : "Le calendrier des prochains matchs sera publié sous peu."}
                  </p>
                  {window.store.isAdmin() && (
                    <a className="nafe-btn nafe-btn--accent" style={{ background: accent }} href="#/admin/matches">
                      → Ajouter un match
                    </a>
                  )}
                </div>
              )}
              {filtered.map((e) => {
                const dObj = new Date(e.date);
                const day = dObj.getDate();
                const dow = dObj.toLocaleDateString("fr-FR", { weekday: "short" }).toUpperCase();
                const mo = dObj.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
                const status = STATUS_LABEL[e.status] || { label: e.status, color: null };
                return (
                  <div key={e.id} className="nafe-cal__row">
                    <div className="nafe-cal__rowDate">
                      <span className="nafe-mono nafe-cal__rowDow">{dow}</span>
                      <span className="nafe-display nafe-cal__rowDay">{String(day).padStart(2, "0")}</span>
                      <span className="nafe-mono nafe-cal__rowMo">{mo}</span>
                    </div>
                    <div className="nafe-cal__rowGame" data-game={e.game}>
                      <span className="nafe-mono">{e.game}</span>
                    </div>
                    <div className="nafe-cal__rowMain">
                      <p className="nafe-display nafe-cal__rowOpp">
                        {e.opp ? `NAFE vs ${e.opp}` : e.event}
                      </p>
                      <p className="nafe-mono nafe-cal__rowEvent">
                        {e.opp ? e.event : ""} {e.opp && "·"} {e.loc}
                      </p>
                    </div>
                    <span className="nafe-mono nafe-cal__rowTime">{e.time}</span>
                    <span
                      className="nafe-mono nafe-cal__rowStatus"
                      style={{ color: status.color || (e.status === "live" ? accent : "rgba(255,255,255,0.65)") }}
                    >
                      {e.status === "live" && <span className="nafe-pulse" style={{ marginRight: 8 }} />}
                      {status.label}
                    </span>
                    <span className="nafe-mono nafe-cal__rowResult">{e.result}</span>
                  </div>
                );
              })}
            </section>
          )}
      </>
    </div>
  );
}

window.CalendarPage = CalendarPage;
