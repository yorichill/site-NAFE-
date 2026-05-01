import { notFound } from "next/navigation";
import Link from "next/link";
import { TEAMS } from "@/lib/rosters";

export function generateStaticParams() {
  return Object.keys(TEAMS).map((game) => ({ game }));
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  const team = TEAMS[game];
  if (!team) notFound();

  // For the prototype, we assume subteam="all"
  const roster = team.roster;
  const trophies = team.trophies;

  // Mock record
  const recordWins = 18;
  const recordLosses = 4;
  const record = `${recordWins}–${recordLosses}`;

  return (
    <div className="nafe-page">
      <section className="nafe-team__hero">
        <span className="nafe-eyebrow" style={{ color: "var(--accent)" }}>
          {team.region} · Roster officiel
        </span>
        <h1 className="nafe-display nafe-team__title">{team.game}</h1>
        <p className="nafe-team__lede">
          L'effectif complet de {team.title} — statistiques, palmarès et
          équipement signature. Bilan {team.game}&nbsp;: <strong>{record}</strong>.
        </p>

        {/* Game tab switch */}
        <div className="nafe-tabs" role="tablist">
          {Object.entries(TEAMS).map(([k, t], i) => (
            <Link
              key={k}
              href={`/teams/${k}`}
              role="tab"
              className={`nafe-tab ${game === k ? "is-active" : ""}`}
              style={game === k ? { borderColor: "var(--accent)", color: "#fff" } : {}}
            >
              <span className="nafe-mono nafe-tab__num">0{i + 1}</span>
              <span className="nafe-display nafe-tab__label">{t.game}</span>
              <span className="nafe-mono nafe-tab__meta">
                {t.region} · {t.roster.length} joueur(s)
              </span>
              {game === k && <span className="nafe-tab__bar" style={{ background: "var(--accent)" }} />}
            </Link>
          ))}
        </div>

        {/* Sub-team chips (Mocked for now) */}
        <div className="nafe-subteams mt-8">
          <span className="nafe-mono nafe-subteams__label">SOUS-ÉQUIPES {team.game}</span>
          <div className="nafe-subteams__list flex gap-3 mt-4">
            <button
              className="nafe-subteam is-active px-4 py-2 flex items-center gap-3 border text-xs"
              style={{ borderColor: "var(--accent)", background: "rgba(30, 79, 216, 0.13)", color: "#fff" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="nafe-mono font-bold tracking-widest">PRINCIPALE</span>
              <span className="nafe-subteam__count nafe-mono opacity-50">
                {roster.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Roster */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Effectif</span>
            <h2 className="nafe-display nafe-section__title">Roster global</h2>
          </div>
          <span className="nafe-mono nafe-section__count">
            {String(roster.length).padStart(2, "0")} JOUEUR{roster.length > 1 ? "S" : ""}
          </span>
        </header>
        
        {roster.length === 0 ? (
          <div className="nafe-empty nafe-empty--panel">
            <span className="nafe-mono" style={{ color: "var(--accent)" }}>AUCUN JOUEUR</span>
            <p className="nafe-empty__text">Le roster sera bientôt dévoilé. Reviens vite !</p>
          </div>
        ) : (
          <div className="nafe-roster nafe-roster--tilt mt-8">
            {roster.map((p) => (
              <div key={p.tag} className="nafe-card nafe-card--tilt nafe-clip-card">
                <div className="nafe-card__jersey">{String(p.jersey).padStart(2, "0")}</div>
                <div className="nafe-card__head">
                  <span className="nafe-mono nafe-eyebrow">{p.role}</span>
                  {p.country && <span className="text-xs uppercase font-bold">{p.country}</span>}
                </div>
                {/* SVG Avatar Placeholder since we don't have images */}
                <div className="nafe-card__mug w-48 h-48 mx-auto mt-4 mb-auto flex items-center justify-center">
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${p.tag}&backgroundColor=1E4FD8`} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <div className="nafe-card__body mt-6">
                  <h3 className="nafe-card__name font-display font-black text-3xl">{p.name}</h3>
                  <p className="nafe-card__tag font-mono text-xs opacity-60">@{p.tag}</p>
                </div>
                <div className="nafe-card__foot flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                  <div>
                    <p className="nafe-card__statLabel">K/D RATIO</p>
                    <p className="nafe-card__statVal">{p.kd}</p>
                  </div>
                  <span className="nafe-card__cta">VOIR PROFIL</span>
                </div>
              </div>
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
            <span className="nafe-mono" style={{ color: "var(--accent)" }}>AUCUN TROPHÉE</span>
            <p className="nafe-empty__text">Le palmarès sera publié après les premières compétitions officielles.</p>
          </div>
        ) : (
          <div className="nafe-trophies mt-8">
            {trophies
              .slice()
              .sort((a, b) => b.year - a.year)
              .map((t, i) => (
                <div key={i} className="nafe-trophy nafe-clip-card">
                  <span className="nafe-mono nafe-trophy__year" style={{ color: "var(--accent)" }}>
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
