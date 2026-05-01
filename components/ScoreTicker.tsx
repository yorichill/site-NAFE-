const SCORES = [
  { match: "FNC vs T1", score: "13-11", game: "VALORANT", live: true },
  { match: "FNC vs G2", score: "2-1", game: "LEC", live: false },
  { match: "FNC vs NAVI", score: "16-14", game: "CS2", live: true },
  { match: "FNC vs GEN", score: "Upcoming", game: "VALORANT", live: false },
];

export function ScoreTicker() {
  const doubled = [...SCORES, ...SCORES];

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
