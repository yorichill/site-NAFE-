// NAFE — Club dashboard

const { useState: useClubState } = React;

function ProgressRing({ value, size = 140, accent }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r}
        stroke={accent} strokeWidth={stroke} fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          filter: `drop-shadow(0 0 10px ${accent}99)`,
          transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}
        fill="#fff" fontSize={size / 6}>
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

function ClubPage({ accent }) {
  const [missions, setMissions] = useClubState(window.MISSIONS);
  const [xpBase] = useClubState(1230);
  const bonus = missions.reduce((a, m) => a + (m.done && !window.MISSIONS.find(x => x.title === m.title).done ? m.xp : 0), 0);
  const xp = xpBase + bonus;
  const currentTier = window.REWARDS.filter((r) => xp >= r.need).pop();
  const nextTier = window.REWARDS.find((r) => r.need > xp);
  const progress = nextTier
    ? ((xp - currentTier.need) / (nextTier.need - currentTier.need)) * 100
    : 100;

  const toggle = (idx) => {
    setMissions((ms) => ms.map((m, i) => i === idx ? { ...m, done: !m.done } : m));
  };

  return (
    <div className="nafe-page">
      <section className="nafe-club__hero">
        <div className="nafe-club__heroTop">
          <span className="nafe-eyebrow" style={{ color: accent }}>
            Club · Membre actif
          </span>
          <span className="nafe-mono nafe-club__id">
            ID · 0427 · {currentTier.tier.toUpperCase()} · SAISON 2026
          </span>
        </div>
        <h1 className="nafe-display nafe-club__title">
          Salut, <span style={{ color: accent }}>Fan #0427</span>
        </h1>
        <p className="nafe-club__lede">
          Ton tableau de bord — XP, streak, drops à venir et paliers débloqués.
        </p>
      </section>

      <div className="nafe-club__grid">
        <div className="nafe-clip-card nafe-club__card nafe-club__card--rank">
          <div className="nafe-club__rankInner">
            <ProgressRing value={progress} accent={accent} />
            <div>
              <p className="nafe-mono nafe-club__k">Rang actuel</p>
              <p className="nafe-display nafe-club__tier">{currentTier.tier}</p>
              <p className="nafe-mono nafe-club__xp" style={{ color: accent }}>
                {xp.toLocaleString("fr-FR")} XP
              </p>
              {nextTier && (
                <p className="nafe-mono nafe-club__next">
                  {(nextTier.need - xp).toLocaleString("fr-FR")} XP → {nextTier.tier}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="nafe-clip-card nafe-club__card">
          <p className="nafe-mono nafe-club__k">Streak de connexion</p>
          <p className="nafe-display nafe-club__big" style={{ color: accent }}>
            12<span className="nafe-club__unit">j</span>
          </p>
          <div className="nafe-streak">
            {[...Array(14)].map((_, i) => (
              <span key={i} className={`nafe-streak__day ${i < 12 ? "is-done" : ""}`}
                style={i < 12 ? { background: accent } : {}}>
                {i + 1}
              </span>
            ))}
          </div>
          <p className="nafe-club__note">Bonus x2 dès le jour 14 · reste <strong>2j</strong>.</p>
        </div>

        <div className="nafe-clip-card nafe-club__card">
          <p className="nafe-mono nafe-club__k">Prochain drop</p>
          <p className="nafe-display nafe-club__big">Jersey 2026</p>
          <div className="nafe-drop">
            <div className="nafe-drop__row">
              <span className="nafe-mono">LIVRAISON</span>
              <span className="nafe-mono">J-04 · 12:00 CET</span>
            </div>
            <div className="nafe-drop__row">
              <span className="nafe-mono">ÉDITION</span>
              <span className="nafe-mono">LIMITÉE · 500 EX.</span>
            </div>
            <div className="nafe-drop__row">
              <span className="nafe-mono">PRIORITÉ</span>
              <span className="nafe-mono" style={{ color: accent }}>VETERAN+</span>
            </div>
          </div>
          <button className="nafe-btn nafe-btn--ghost nafe-btn--sm nafe-drop__cta">
            Rappel · Notifier J-1
          </button>
        </div>
      </div>

      {/* Missions */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Missions</span>
            <h2 className="nafe-display nafe-section__title">Semaine 17</h2>
          </div>
          <span className="nafe-mono nafe-section__count">
            {missions.filter(m => m.done).length}/{missions.length} COMPLÉTÉES
          </span>
        </header>
        <div className="nafe-missions">
          {missions.map((m, i) => (
            <button
              key={i}
              className={`nafe-mission nafe-clip-card ${m.done ? "is-done" : ""}`}
              style={m.done ? { borderColor: accent, background: `${accent}15` } : {}}
              onClick={() => toggle(i)}
            >
              <span className={`nafe-mission__box ${m.done ? "is-done" : ""}`}
                style={m.done ? { background: accent, borderColor: accent } : {}}>
                {m.done && "✓"}
              </span>
              <span className="nafe-mission__title">{m.title}</span>
              <span className="nafe-mono nafe-mission__xp" style={{ color: accent }}>
                +{m.xp} XP
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Fidélité</span>
            <h2 className="nafe-display nafe-section__title">Paliers 2026</h2>
          </div>
          <span className="nafe-mono nafe-section__count">
            {window.REWARDS.filter(r => xp >= r.need).length}/{window.REWARDS.length} DÉBLOQUÉS
          </span>
        </header>
        <div className="nafe-tiers">
          {window.REWARDS.map((r) => {
            const unlocked = xp >= r.need;
            return (
              <div key={r.tier}
                className={`nafe-tier nafe-clip-card ${unlocked ? "is-unlocked" : ""}`}
                style={unlocked ? { borderColor: accent, boxShadow: `0 0 40px ${accent}40` } : {}}
              >
                <div className="nafe-tier__head">
                  <span className="nafe-mono">{r.need.toLocaleString("fr-FR")} XP</span>
                  {unlocked && <span className="nafe-mono" style={{ color: accent }}>✓ DÉBLOQUÉ</span>}
                </div>
                <p className="nafe-display nafe-tier__name">{r.tier}</p>
                <p className="nafe-tier__perk">{r.perk}</p>
                <div className="nafe-tier__bar">
                  <div className="nafe-tier__fill"
                    style={{
                      width: `${Math.max(0, Math.min(100, ((xp - r.need) / 500) * 100))}%`,
                      background: unlocked ? accent : "rgba(255,255,255,0.2)"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

window.ClubPage = ClubPage;
