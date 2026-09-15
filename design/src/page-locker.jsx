// NAFE — Locker Page (Vestiaire)
// Displays user level, XP, badges and predictions history.

function LockerPage({ accent }) {
  window.store.useVersion();
  const user = window.store.currentUser();

  if (!user) {
    return (
      <div className="nafe-page">
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 100 }}>
          <span className="nafe-mono" style={{ color: accent }}>ACCÈS RESTREINT</span>
          <p className="nafe-empty__text">Connecte-toi pour accéder à ton vestiaire et voir ta progression.</p>
          <button className="nafe-btn nafe-btn--accent" style={{ background: accent }} onClick={() => window.openAuth?.("login")}>
            Se connecter →
          </button>
        </div>
      </div>
    );
  }

  const xp = user.xp || 0;
  const level = window.store.getLevel(xp);
  const nextXp = window.store.getNextLevelXp(level);
  const prevXp = window.store.getNextLevelXp(level - 1);
  const progress = ((xp - prevXp) / (nextXp - prevXp)) * 100;

  const userBadges = (user.badges || []).map(id => window.store.badges.get(id)).filter(Boolean);
  const userPredictions = window.store.getUserPredictions(user.id);

  return (
    <div className="nafe-page">
      <section className="nafe-team__hero">
        <span className="nafe-eyebrow" style={{ color: accent }}>Fan Profile · Niveau {level}</span>
        <h1 className="nafe-display nafe-team__title">LOCKER<span style={{ color: accent }}>.</span></h1>
        <p className="nafe-team__lede">Ton espace personnel. Suis ton engagement, tes badges et tes pronostics.</p>
      </section>

      <div className="nafe-locker__grid">
        {/* Left: XP & Stats */}
        <section className="nafe-section">
          <div className="nafe-clip-card" style={{ background: 'rgba(255,255,255,0.03)', padding: 40, display: 'flex', alignItems: 'center', gap: 40 }}>
            <ProgressRing value={progress} size={160} accent={accent} label={`LVL ${level}`} />
            <div>
              <h3 className="nafe-display" style={{ fontSize: 32, marginBottom: 8 }}>{user.username}</h3>
              <p className="nafe-mono" style={{ color: accent, marginBottom: 20 }}>{xp} / {nextXp} XP POUR NIVEAU {level + 1}</p>
              <div className="nafe-locker__stats">
                <div className="nafe-locker__stat">
                  <span className="nafe-mono">BADGES</span>
                  <span className="nafe-display">{userBadges.length}</span>
                </div>
                <div className="nafe-locker__stat">
                  <span className="nafe-mono">VOTES</span>
                  <span className="nafe-display">{userPredictions.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Badges */}
        <section className="nafe-section">
          <header className="nafe-section__head">
            <div>
              <span className="nafe-eyebrow">Collection</span>
              <h2 className="nafe-display nafe-section__title">Badges</h2>
            </div>
          </header>
          {userBadges.length === 0 ? (
            <div className="nafe-empty nafe-empty--panel">
              <p className="nafe-empty__text">Aucun badge pour le moment. Participe à la vie du club pour en gagner !</p>
            </div>
          ) : (
            <div className="nafe-badges-grid">
              {userBadges.map(badge => (
                <div key={badge.id} className="nafe-badge-card nafe-clip-card" title={badge.description}>
                  <div className="nafe-badge-icon" style={{ background: badge.color || accent }}>{badge.icon || '✦'}</div>
                  <span className="nafe-mono">{badge.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Predictions History */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Engagement</span>
            <h2 className="nafe-display nafe-section__title">Tes Pronostics</h2>
          </div>
        </header>
        {userPredictions.length === 0 ? (
          <div className="nafe-empty nafe-empty--panel">
            <p className="nafe-empty__text">Tu n'as pas encore voté sur des matchs.</p>
            <a href="#/calendar" className="nafe-btn nafe-btn--ghost nafe-btn--sm" style={{ marginTop: 20 }}>
              Voir les matchs →
            </a>
          </div>
        ) : (
          <div className="nafe-predictions-list">
            {userPredictions.map(p => {
              const userVote = (p.votes || []).find(v => v.userId === user.id);
              const option = (p.options || []).find(o => o.id === userVote?.optionId);
              const isResolved = p.status === 'resolved';
              const isCorrect = isResolved && p.winnerId === userVote?.optionId;

              return (
                <div key={p.id} className="nafe-prediction-item nafe-clip-card">
                  <div className="nafe-pred__info">
                    <span className="nafe-mono" style={{ opacity: 0.5 }}>{p.matchTitle || 'Match Match'}</span>
                    <h4 className="nafe-display">{p.title}</h4>
                  </div>
                  <div className="nafe-pred__vote">
                    <span className="nafe-mono">TON VOTE</span>
                    <span className="nafe-display" style={{ color: isCorrect ? '#B6F500' : isResolved ? '#FF4D4D' : accent }}>
                      {option?.label || 'Inconnu'}
                    </span>
                  </div>
                  <div className="nafe-pred__status">
                    <span className="nafe-mono" style={{ color: isCorrect ? '#B6F500' : isResolved ? '#FF4D4D' : '#fff' }}>
                      {isCorrect ? '+50 XP GAGNÉS' : isResolved ? 'PERDU' : 'EN ATTENTE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <style>{`
        .nafe-locker__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .nafe-locker__stats { display: flex; gap: 32px; }
        .nafe-locker__stat { display: flex; flex-direction: column; }
        .nafe-locker__stat .nafe-display { font-size: 24px; color: #fff; }
        .nafe-badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; }
        .nafe-badge-card { background: rgba(255,255,255,0.05); padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
        .nafe-badge-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 24px; border-radius: 50%; box-shadow: 0 0 15px rgba(0,0,0,0.3); }
        .nafe-predictions-list { display: flex; flex-direction: column; gap: 12px; }
        .nafe-prediction-item { background: rgba(255,255,255,0.03); padding: 24px; display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; border: 1px solid rgba(255,255,255,0.05); }
        .nafe-pred__vote, .nafe-pred__status { display: flex; flex-direction: column; align-items: flex-end; }
        @media (max-width: 1024px) {
          .nafe-locker__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function ProgressRing({ value, size = 120, accent, label }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={accent} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 8px ${accent}66)`, transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center', paddingTop: size*0.35 }}>
        <span className="nafe-display" style={{ fontSize: size*0.18, lineHeight: 1 }}>{label}</span>
        <span className="nafe-mono" style={{ fontSize: size*0.1, opacity: 0.5, marginTop: 4 }}>{Math.round(clamped)}%</span>
      </div>
    </div>
  );
}

window.LockerPage = LockerPage;
