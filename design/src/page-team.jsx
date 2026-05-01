// NAFE — Team page with Valorant / LoL / CS2 tab switch + sub-team tabs

const { useState: useTeamState, useEffect: useTeamEffect } = React;

function TeamPage({ accent, cardVariant, initialGame = "valorant" }) {
  window.store.useVersion();
  const [game, setGame] = useTeamState(initialGame);
  const [subteam, setSubteam] = useTeamState("all"); // "all" | subteam.id | "" (sans sous-équipe)

  useTeamEffect(() => {
    setSubteam("all");
  }, [game]);

  const meta = window.TEAMS_META[game];
  if (!meta) return null;

  const subteams = window.store.getSubteamsByTeam(game);
  const gameColor = meta.color || accent;
  const activeColor =
    subteam === "all" || subteam === ""
      ? gameColor
      : subteams.find((s) => s.id === subteam)?.color || gameColor;

  // "all" = roster principal (joueurs sans sous-équipe)
  // st.id = uniquement les joueurs de cette sous-équipe
  const roster =
    subteam === "all"
      ? window.store.getPlayersByTeam(game, "")
      : window.store.getPlayersByTeam(game, subteam);

  const trophies = window.store.getTrophiesByTeam(game);

  const GAME_KEY = { valorant: "VAL", rl: "RL", cs2: "CS2" };
  const gameKey = GAME_KEY[game];
  const recordWins   = window.store.matches.list().filter(m => m.status === "won"  && m.game === gameKey).length;
  const recordLosses = window.store.matches.list().filter(m => m.status === "lost" && m.game === gameKey).length;
  const record = `${recordWins}–${recordLosses}`;

  return (
    <div className="nafe-page">
      <section className="nafe-team__hero">
        <span className="nafe-eyebrow" style={{ color: activeColor }}>
          {meta.region} · Roster officiel
        </span>
        <h1 className="nafe-display nafe-team__title">{meta.game}</h1>
        <p className="nafe-team__lede">
          L'effectif complet de {meta.title} — statistiques, palmarès et
          équipement signature. Bilan {meta.game}&nbsp;: <strong>{record}</strong>.
        </p>

        {/* Game tab switch */}
        <div className="nafe-tabs" role="tablist">
          {Object.entries(window.TEAMS_META).map(([k, t], i) => (
            <button
              key={k}
              role="tab"
              className={`nafe-tab ${game === k ? "is-active" : ""}`}
              style={game === k ? { borderColor: t.color, color: "#fff" } : {}}
              onClick={() => setGame(k)}
            >
              <span className="nafe-mono nafe-tab__num">0{i + 1}</span>
              <span className="nafe-display nafe-tab__label">{t.game}</span>
              <span className="nafe-mono nafe-tab__meta">
                {t.region} · {window.store.getPlayersByTeam(k).length} joueur(s)
              </span>
              {game === k && <span className="nafe-tab__bar" style={{ background: t.color }} />}
            </button>
          ))}
        </div>

        {/* Sub-team chips (avec teintes dérivées) */}
        {subteams.length > 0 && (
          <div className="nafe-subteams">
            <span className="nafe-mono nafe-subteams__label">SOUS-ÉQUIPES {meta.game}</span>
            <div className="nafe-subteams__list">
              <button
                className={`nafe-subteam ${subteam === "all" ? "is-active" : ""}`}
                style={subteam === "all" ? { borderColor: gameColor, background: `${gameColor}22`, color: "#fff" } : { color: gameColor, borderColor: `${gameColor}55` }}
                onClick={() => setSubteam("all")}
              >
                <span className="nafe-subteam__dot" style={{ background: gameColor }} />
                <span className="nafe-mono">PRINCIPALE</span>
                <span className="nafe-subteam__count nafe-mono">
                  {window.store.getPlayersByTeam(game, "").length}
                </span>
              </button>
              {subteams.map((st) => {
                const active = subteam === st.id;
                return (
                  <button
                    key={st.id}
                    className={`nafe-subteam ${active ? "is-active" : ""}`}
                    style={active
                      ? { borderColor: st.color, background: `${st.color}22`, color: "#fff" }
                      : { color: st.color, borderColor: `${st.color}55` }}
                    onClick={() => setSubteam(st.id)}
                  >
                    <span className="nafe-subteam__dot" style={{ background: st.color }} />
                    <span className="nafe-mono">{st.name.toUpperCase()}</span>
                    <span className="nafe-subteam__count nafe-mono">
                      {window.store.getPlayersByTeam(game, st.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Roster */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Effectif</span>
            <h2 className="nafe-display nafe-section__title">
              {subteam === "all"
                ? "Roster global"
                : subteams.find((s) => s.id === subteam)?.name || "Roster"}
            </h2>
          </div>
          <span className="nafe-mono nafe-section__count">
            {String(roster.length).padStart(2, "0")} JOUEUR{roster.length > 1 ? "S" : ""}
          </span>
        </header>
        {roster.length === 0 ? (
          <div className="nafe-empty nafe-empty--panel">
            <span className="nafe-mono" style={{ color: activeColor }}>AUCUN JOUEUR</span>
            <p className="nafe-empty__text">
              {window.store.isAdmin()
                ? "Aucun joueur dans cette sélection. Ajoute un joueur (et rattache-le éventuellement à une sous-équipe) depuis l'espace admin."
                : "Le roster sera bientôt dévoilé. Reviens vite !"}
            </p>
            {window.store.isAdmin() && (
              <a className="nafe-btn nafe-btn--ghost" href="#/admin/players">→ Admin joueurs</a>
            )}
          </div>
        ) : (
          <div className={`nafe-roster nafe-roster--${cardVariant}`}>
            {roster.map((p) => (
              <window.PlayerCard key={p.id || p.tag} p={p} accent={activeColor} variant={cardVariant} />
            ))}
          </div>
        )}
      </section>

      {/* Palmarès */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Palmarès</span>
            <h2 className="nafe-display nafe-section__title">Trophées</h2>
          </div>
          <span className="nafe-mono nafe-section__count">
            {String(trophies.length).padStart(2, "0")} ENTRÉE{trophies.length > 1 ? "S" : ""}
          </span>
        </header>
        {trophies.length === 0 ? (
          <div className="nafe-empty nafe-empty--panel">
            <span className="nafe-mono" style={{ color: activeColor }}>AUCUN TROPHÉE</span>
            <p className="nafe-empty__text">
              {window.store.isAdmin()
                ? "Ajoute un résultat historique depuis l'espace admin."
                : "Le palmarès sera publié après les premières compétitions officielles."}
            </p>
            {window.store.isAdmin() && (
              <a className="nafe-btn nafe-btn--ghost" href="#/admin/trophies">→ Admin palmarès</a>
            )}
          </div>
        ) : (
          <div className="nafe-trophies">
            {trophies
              .slice()
              .sort((a, b) => (b.year || 0) - (a.year || 0))
              .map((t) => (
                <div key={t.id} className="nafe-trophy nafe-clip-card">
                  <span className="nafe-mono nafe-trophy__year" style={{ color: activeColor }}>
                    {t.year}
                  </span>
                  <span className="nafe-display nafe-trophy__event">{t.event}</span>
                  <span className="nafe-mono nafe-trophy__place">{t.place}</span>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

window.TeamPage = TeamPage;
