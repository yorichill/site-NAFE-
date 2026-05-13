// NAFE — Admin console (localStorage CRUD UI)
// Routes gérées : /admin, /admin/players, /admin/matches, /admin/news, /admin/scores, /admin/trophies

const { useState: useAdminState, useEffect: useAdminEffect } = React;

const ADMIN_TABS = [
  { k: "shop",      label: "Boutique",            icon: "🛍️" },
  { k: "players",   label: "Joueurs",             icon: "👤" },
  { k: "subteams",  label: "Sous-équipes",        icon: "◈" },
  { k: "matches",   label: "Matchs & calendrier", icon: "📅" },
  { k: "news",      label: "Actualités",          icon: "📰" },
  { k: "scores",    label: "Ticker scores",       icon: "📊" },
  { k: "trophies",  label: "Palmarès",            icon: "🏆" },
  { k: "socials",   label: "Réseaux sociaux",     icon: "🔗" },
  { k: "community", label: "Communauté",          icon: "💬" },
  { k: "users",     label: "Utilisateurs",        icon: "👥" },
];

// Route helper : renvoie la sous-page courante depuis le hash
function adminRoute() {
  const h = location.hash.replace(/^#/, "");
  const parts = h.split("/").filter(Boolean); // ["admin", "players"?]
  return parts[1] || "players";
}

function AdminPage({ accent }) {
  window.store.useVersion();
  const [tab, setTab] = useAdminState(adminRoute());

  useAdminEffect(() => {
    const onHash = () => setTab(adminRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ---- Guard : seuls les admins connectés accèdent à la console ----
  const user = window.store.currentUser();
  if (!user) {
    return (
      <div className="nafe-page">
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 80 }}>
          <span className="nafe-mono" style={{ color: accent }}>ACCÈS RESTREINT</span>
          <p className="nafe-empty__text">
            La console admin est réservée au staff NAFE. Connecte-toi avec un compte admin
            pour continuer.
          </p>
          <button
            className="nafe-btn nafe-btn--accent"
            style={{ background: accent }}
            onClick={() => window.openAuth && window.openAuth("login")}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }
  if (user.role !== "admin") {
    return (
      <div className="nafe-page">
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 80 }}>
          <span className="nafe-mono" style={{ color: "#E53E3E" }}>ACCÈS REFUSÉ</span>
          <p className="nafe-empty__text">
            Tu es connecté en tant que <strong>{user.username}</strong> (rôle : fan).
            Cette console est réservée au staff. Un admin peut te promouvoir depuis
            l'onglet Utilisateurs.
          </p>
          <a className="nafe-btn nafe-btn--ghost" href="#/club">← Retour au dashboard</a>
        </div>
      </div>
    );
  }

  const counts = {
    shop:      window.store.shop ? window.store.shop.list().length : 0,
    players:   window.store.players.list().length,
    subteams:  window.store.subteams.list().length,
    matches:   window.store.matches.list().length,
    news:      window.store.news.list().length,
    scores:    window.store.scores.list().length,
    trophies:  window.store.trophies.list().length,
    socials:   window.store.socials.list().length,
    community: window.store.posts.list().length,
    users:     window.store.users.list().length,
    engagement: (window.store.predictions.list().length + window.store.badges.list().length),
  };

  return (
    <div className="nafe-page">
      <section className="nafe-team__hero">
        <span className="nafe-eyebrow" style={{ color: accent }}>
          Admin · Staff NAFE uniquement
        </span>
        <h1 className="nafe-display nafe-team__title">
          ADMIN<span style={{ color: accent }}>.</span>
        </h1>
        <p className="nafe-team__lede">
          Crée, modifie et supprime tout le contenu visible côté public.
        </p>


        <div className="nafe-admin__tabs">
          {ADMIN_TABS.map((t) => {
            const active = tab === t.k;
            return (
              <a
                key={t.k}
                href={`#/admin/${t.k}`}
                className={`nafe-admin__tab ${active ? "is-active" : ""}`}
                style={active ? { borderColor: accent, background: `${accent}22` } : {}}
              >
                <span className="nafe-admin__tabIcon">{t.icon}</span>
                <span className="nafe-display nafe-admin__tabLabel">{t.label}</span>
                <span className="nafe-mono nafe-admin__tabCount" style={active ? { color: accent } : {}}>
                  {String(counts[t.k]).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="nafe-admin__panel">
        {tab === "shop"      && <ShopAdmin      accent={accent} />}
        {tab === "players"   && <PlayersAdmin   accent={accent} />}
        {tab === "subteams"  && <SubteamsAdmin  accent={accent} />}
        {tab === "matches"   && <MatchesAdmin   accent={accent} />}
        {tab === "news"      && <NewsAdmin      accent={accent} />}
        {tab === "scores"    && <ScoresAdmin    accent={accent} />}
        {tab === "trophies"  && <TrophiesAdmin  accent={accent} />}
        {tab === "socials"   && <SocialsAdmin   accent={accent} />}
        {tab === "community" && <CommunityAdmin accent={accent} />}
        {tab === "users"     && <UsersAdmin     accent={accent} currentUser={user} />}
        {tab === "engagement" && <EngagementAdmin accent={accent} />}
      </section>
    </div>
  );
}

// ============================================================
//  Field + form helpers
// ============================================================
function Field({ label, children, span = 1 }) {
  return (
    <label className="nafe-field" style={{ gridColumn: `span ${span}` }}>
      <span className="nafe-mono nafe-field__label">{label}</span>
      {children}
    </label>
  );
}

function FormShell({ title, children, onSubmit, onCancel, submitLabel = "Enregistrer", accent }) {
  return (
    <form
      className="nafe-admin__form nafe-clip-card"
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    >
      <h3 className="nafe-display nafe-admin__formTitle">{title}</h3>
      <div className="nafe-admin__grid">{children}</div>
      <div className="nafe-admin__formActions">
        {onCancel && (
          <button type="button" className="nafe-btn nafe-btn--ghost" onClick={onCancel}>
            Annuler
          </button>
        )}
        <button type="submit" className="nafe-btn nafe-btn--accent" style={{ background: accent }}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function scrollToForm() {
  const form = document.querySelector(".nafe-admin__form");
  if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  const firstInput = form?.querySelector("input, select, textarea");
  if (firstInput) setTimeout(() => firstInput.focus(), 350);
}

function DataTable({ columns, rows, onEdit, onDelete, empty, accent }) {
  if (!rows.length) {
    return (
      <div className="nafe-admin__empty">
        <span className="nafe-mono" style={{ color: accent }}>VIDE</span>
        <p>{empty}</p>
      </div>
    );
  }
  return (
    <div className="nafe-admin__table">
      <div className="nafe-admin__tableHead">
        {columns.map((c) => (
          <span key={c.key} className="nafe-mono" style={{ flex: c.flex || 1 }}>{c.label}</span>
        ))}
        <span className="nafe-mono" style={{ flex: 0, minWidth: 140 }}>ACTIONS</span>
      </div>
      {rows.map((r) => (
        <div key={r.id} className="nafe-admin__tableRow">
          {columns.map((c) => (
            <span key={c.key} className="nafe-admin__tableCell" style={{ flex: c.flex || 1 }}>
              {typeof c.render === "function" ? c.render(r) : r[c.key]}
            </span>
          ))}
          <div className="nafe-admin__tableActions" style={{ flex: 0, minWidth: 140 }}>
            <button
              className="nafe-admin__iconBtn"
              onClick={() => { onEdit(r); scrollToForm(); }}
              title="Modifier"
            >✎</button>
            <button
              className="nafe-admin__iconBtn nafe-admin__iconBtn--danger"
              onClick={() => { if (confirm("Supprimer cette entrée ?")) onDelete(r.id); }}
              title="Supprimer"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
//  Players
// ============================================================
const ROLES = ["IGL", "Duelist", "Sentinel", "Initiator", "Controller", "Flex", "Coach", "Caster", "Analyst", "Manager", "CEO", "AWP", "Rifler", "Anchor", "Entry", "Attaquant", "Défenseur", "Pivot", "Rotateur"];

function PlayersAdmin({ accent }) {
  window.store.useVersion(); // réabonnement direct pour réagir à l'ajout de sous-équipes
  const list = window.store.players.list();
  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptyPlayer());

  function emptyPlayer() {
    return { team: "valorant", subteam: "", name: "", tag: "", role: "Duelist", jersey: 1, country: "FR", kd: 0, hs: 0, gear: { mouse: "", keyboard: "", headset: "" } };
  }

  // Sous-équipes : d'abord celles du jeu sélectionné, puis les autres en fallback
  const allSubteams      = window.store.subteams.list();
  const subteamsForTeam  = allSubteams.filter((s) => s.parent === draft.team);
  const subteamsOther    = allSubteams.filter((s) => s.parent !== draft.team);

  function startEdit(p) {
    setEditing(p.id);
    setDraft({ ...emptyPlayer(), ...p, gear: { ...emptyPlayer().gear, ...(p.gear || {}) } });
  }

  function submit() {
    if (!draft.name.trim()) return alert("Le nom est requis");
    if (!draft.tag.trim()) return alert("Le pseudo est requis");
    const payload = { ...draft, jersey: +draft.jersey || 0, kd: +draft.kd || 0, hs: +draft.hs || 0 };
    if (editing) {
      window.store.players.update(editing, payload);
    } else {
      window.store.players.add(payload);
    }
    setEditing(null);
    setDraft(emptyPlayer());
  }

  return (
    <div className="nafe-admin__section">
      <FormShell
        title={editing ? "Modifier le joueur" : "Nouveau joueur"}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptyPlayer()); } : null}
        submitLabel={editing ? "Mettre à jour" : "Ajouter le joueur"}
        accent={accent}
      >
        <Field label="Équipe" span={2}>
          <select value={draft.team} onChange={(e) => setDraft({ ...draft, team: e.target.value, subteam: "" })}>
            {Object.entries(window.TEAMS_META).map(([k, t]) => (
              <option key={k} value={k}>{t.game}</option>
            ))}
          </select>
        </Field>
        <Field label="Sous-équipe" span={2}>
          <select value={draft.subteam || ""} onChange={(e) => setDraft({ ...draft, subteam: e.target.value })}>
            <option value="">— Aucune —</option>
            {subteamsForTeam.length > 0 ? (
              subteamsForTeam.map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))
            ) : subteamsOther.length > 0 ? (
              <>
                <option disabled>── Autres jeux ──</option>
                {subteamsOther.map((st) => (
                  <option key={st.id} value={st.id}>
                    [{window.TEAMS_META[st.parent]?.game || st.parent}] {st.name}
                  </option>
                ))}
              </>
            ) : null}
          </select>
        </Field>
        <Field label="Numéro">
          <input type="number" min={0} max={99} value={draft.jersey}
            onChange={(e) => setDraft({ ...draft, jersey: e.target.value })} />
        </Field>
        <Field label="Nom de scène">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ex: Derke" />
        </Field>
        <Field label="Pseudo (@tag)">
          <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} placeholder="Ex: derke" />
        </Field>
        <Field label="Rôle">
          <select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Pays (ISO 2 lettres)">
          <input maxLength={3} value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value.toUpperCase() })} />
        </Field>
        <Field label="K/D">
          <input type="number" step="0.01" value={draft.kd} onChange={(e) => setDraft({ ...draft, kd: e.target.value })} />
        </Field>
        <Field label="HS %">
          <input type="number" min={0} max={100} value={draft.hs} onChange={(e) => setDraft({ ...draft, hs: e.target.value })} />
        </Field>
        <Field label="Souris">
          <input value={draft.gear.mouse} onChange={(e) => setDraft({ ...draft, gear: { ...draft.gear, mouse: e.target.value } })} />
        </Field>
        <Field label="Clavier">
          <input value={draft.gear.keyboard} onChange={(e) => setDraft({ ...draft, gear: { ...draft.gear, keyboard: e.target.value } })} />
        </Field>
        <Field label="Casque">
          <input value={draft.gear.headset} onChange={(e) => setDraft({ ...draft, gear: { ...draft.gear, headset: e.target.value } })} />
        </Field>
      </FormShell>

      <DataTable
        accent={accent}
        empty="Aucun joueur enregistré. Remplis le formulaire ci-dessus pour en ajouter un."
        columns={[
          { key: "jersey", label: "N°", flex: 0.3, render: (r) => String(r.jersey).padStart(2, "0") },
          { key: "name", label: "NOM", flex: 1 },
          { key: "tag", label: "PSEUDO", flex: 1, render: (r) => `@${r.tag}` },
          { key: "team", label: "ÉQUIPE", flex: 1, render: (r) => window.TEAMS_META[r.team]?.game || r.team },
          { key: "subteam", label: "SOUS-ÉQUIPE", flex: 0.9, render: (r) => {
            if (!r.subteam) return "—";
            const st = window.store.subteams.get(r.subteam);
            if (!st) return "—";
            return (
              <span>
                <span style={{ display: "inline-block", width: 8, height: 8, background: st.color, marginRight: 6, verticalAlign: "middle" }} />
                {st.name}
              </span>
            );
          }},
          { key: "role", label: "RÔLE", flex: 0.7 },
          { key: "country", label: "PAYS", flex: 0.4 },
          { key: "kd", label: "K/D", flex: 0.4 },
        ]}
        rows={list}
        onEdit={startEdit}
        onDelete={(id) => window.store.players.remove(id)}
      />
    </div>
  );
}

// ============================================================
//  Matches
// ============================================================
const GAMES = ["VAL", "LOL", "CS2", "DROP", "EVENT"];
const STATUSES = [
  { k: "soon",  label: "À venir" },
  { k: "live",  label: "En direct" },
  { k: "won",   label: "Victoire" },
  { k: "lost",  label: "Défaite" },
  { k: "drop",  label: "Drop" },
  { k: "event", label: "Événement" },
];

function MatchesAdmin({ accent }) {
  const list = window.store.matches.list()
    .slice()
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptyMatch());

  function emptyMatch() {
    return { date: new Date().toISOString().slice(0, 10), time: "20:00", game: "VAL", event: "", opp: "", result: "À venir", status: "soon", loc: "" };
  }

  function startEdit(m) {
    setEditing(m.id);
    setDraft({ ...emptyMatch(), ...m });
  }

  function submit() {
    if (!draft.date) return alert("Date requise");
    if (!draft.event.trim()) return alert("Compétition / événement requis");
    if (editing) {
      window.store.matches.update(editing, draft);
    } else {
      window.store.matches.add(draft);
    }
    setEditing(null);
    setDraft(emptyMatch());
  }

  return (
    <div className="nafe-admin__section">
      <FormShell
        title={editing ? "Modifier le match" : "Nouveau match / événement"}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptyMatch()); } : null}
        submitLabel={editing ? "Mettre à jour" : "Ajouter au calendrier"}
        accent={accent}
      >
        <Field label="Date">
          <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
        </Field>
        <Field label="Heure">
          <input type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
        </Field>
        <Field label="Jeu / type">
          <select value={draft.game} onChange={(e) => setDraft({ ...draft, game: e.target.value })}>
            {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Statut">
          <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Compétition / événement" span={2}>
          <input value={draft.event} onChange={(e) => setDraft({ ...draft, event: e.target.value })} placeholder="Ex: VCT EMEA Stage 2" />
        </Field>
        <Field label="Adversaire">
          <input value={draft.opp} onChange={(e) => setDraft({ ...draft, opp: e.target.value })} placeholder="Laisser vide pour un drop/event" />
        </Field>
        <Field label="Lieu">
          <input value={draft.loc} onChange={(e) => setDraft({ ...draft, loc: e.target.value })} placeholder="Ex: Berlin / En ligne" />
        </Field>
        <Field label="Résultat" span={2}>
          <input value={draft.result} onChange={(e) => setDraft({ ...draft, result: e.target.value })} placeholder='Ex: "13-9 / 13-7" ou "À venir"' />
        </Field>
      </FormShell>

      <DataTable
        accent={accent}
        empty="Aucun match programmé."
        columns={[
          { key: "date", label: "DATE", flex: 0.7 },
          { key: "time", label: "HEURE", flex: 0.4 },
          { key: "game", label: "JEU", flex: 0.4 },
          { key: "event", label: "COMPÉTITION", flex: 1.2 },
          { key: "opp", label: "ADVERSAIRE", flex: 1, render: (r) => r.opp || "—" },
          { key: "status", label: "STATUT", flex: 0.6, render: (r) => STATUSES.find((s) => s.k === r.status)?.label || r.status },
          { key: "result", label: "RÉSULTAT", flex: 0.8 },
        ]}
        rows={list}
        onEdit={startEdit}
        onDelete={(id) => window.store.matches.remove(id)}
      />
    </div>
  );
}

// ============================================================
//  News
// ============================================================
const NEWS_CATS = ["Compétition", "Annonce", "Transfert", "Analyse", "Structure", "Partenariat", "Académie", "YouTube", "Twitch"];

function NewsAdmin({ accent }) {
  const list = window.store.news.list()
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptyNews());

  function emptyNews() {
    const d = new Date();
    const fr = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase().replace(/\./g, "");
    return { date: fr, cat: "Annonce", game: "CLUB", title: "", lede: "", author: "Rédaction NAFE", featured: false, url: "" };
  }

  function startEdit(n) {
    setEditing(n.id);
    setDraft({ ...emptyNews(), ...n });
  }

  function submit() {
    if (!draft.title.trim()) return alert("Titre requis");
    if (!draft.lede.trim()) return alert("Chapeau / lede requis");
    if (editing) {
      window.store.news.update(editing, draft);
    } else {
      window.store.news.add(draft);
    }
    setEditing(null);
    setDraft(emptyNews());
  }

  const isVideo = draft.cat === "YouTube" || draft.cat === "Twitch";

  return (
    <div className="nafe-admin__section">
      <FormShell
        title={editing ? "Modifier l'article" : "Poster une nouvelle actu"}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptyNews()); } : null}
        submitLabel={editing ? "Mettre à jour" : "Publier"}
        accent={accent}
      >
        <Field label="Date (libellé affiché)">
          <input value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
        </Field>
        <Field label="Catégorie">
          <select value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })}>
            {NEWS_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Jeu / rubrique">
          <select value={draft.game} onChange={(e) => setDraft({ ...draft, game: e.target.value })}>
            {["CLUB", "VALORANT", "LOL", "CS2", "AUTRE"].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Titre" span={2}>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </Field>
        {isVideo && (
          <Field label="Lien Vidéo (URL YouTube ou Twitch)" span={2}>
            <input value={draft.url || ""} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://..." />
          </Field>
        )}
        <Field label="Chapeau / résumé" span={2}>
          <textarea rows={3} value={draft.lede} onChange={(e) => setDraft({ ...draft, lede: e.target.value })} />
        </Field>
        <Field label="Auteur">
          <input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
        </Field>
        <Field label="À la une">
          <label className="nafe-field__checkbox">
            <input type="checkbox" checked={!!draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
            <span>Épingler comme article à la une</span>
          </label>
        </Field>
      </FormShell>

      <DataTable
        accent={accent}
        empty="Aucun article publié. Remplis le formulaire ci-dessus pour poster ta première actu."
        columns={[
          { key: "date", label: "DATE", flex: 0.7 },
          { key: "cat", label: "CAT", flex: 0.7 },
          { key: "title", label: "TITRE", flex: 2 },
          { key: "author", label: "AUTEUR", flex: 0.8 },
          { key: "featured", label: "UNE", flex: 0.3, render: (r) => r.featured ? "★" : "" },
        ]}
        rows={list}
        onEdit={startEdit}
        onDelete={(id) => window.store.news.remove(id)}
      />
    </div>
  );
}

// ============================================================
//  Scores ticker
// ============================================================
function ScoresAdmin({ accent }) {
  const list = window.store.scores.list();
  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptyScore());

  function emptyScore() {
    return { game: "VALORANT", match: "", score: "", live: false };
  }

  function startEdit(s) { setEditing(s.id); setDraft({ ...emptyScore(), ...s }); }
  function submit() {
    if (!draft.match.trim()) return alert("Match requis");
    if (editing) window.store.scores.update(editing, draft);
    else window.store.scores.add(draft);
    setEditing(null);
    setDraft(emptyScore());
  }

  return (
    <div className="nafe-admin__section">
      <FormShell
        title={editing ? "Modifier l'entrée ticker" : "Nouvelle entrée ticker"}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptyScore()); } : null}
        submitLabel={editing ? "Mettre à jour" : "Ajouter au ticker"}
        accent={accent}
      >
        <Field label="Jeu / rubrique">
          <input value={draft.game} onChange={(e) => setDraft({ ...draft, game: e.target.value })} placeholder="Ex: VALORANT" />
        </Field>
        <Field label="Match">
          <input value={draft.match} onChange={(e) => setDraft({ ...draft, match: e.target.value })} placeholder="Ex: NAFE vs KOVA" />
        </Field>
        <Field label="Score / libellé">
          <input value={draft.score} onChange={(e) => setDraft({ ...draft, score: e.target.value })} placeholder="Ex: 13-11 ou À VENIR" />
        </Field>
        <Field label="En direct">
          <label className="nafe-field__checkbox">
            <input type="checkbox" checked={!!draft.live}
              onChange={(e) => setDraft({ ...draft, live: e.target.checked })} />
            <span>Afficher un point rouge clignotant</span>
          </label>
        </Field>
      </FormShell>

      <DataTable
        accent={accent}
        empty="Aucune entrée dans le ticker. Le bandeau du haut de page reste masqué tant qu'il est vide."
        columns={[
          { key: "game", label: "JEU", flex: 0.8 },
          { key: "match", label: "MATCH", flex: 1.5 },
          { key: "score", label: "SCORE", flex: 0.8 },
          { key: "live", label: "LIVE", flex: 0.4, render: (r) => r.live ? "●" : "" },
        ]}
        rows={list}
        onEdit={startEdit}
        onDelete={(id) => window.store.scores.remove(id)}
      />
    </div>
  );
}

// ============================================================
//  Trophies
// ============================================================
function TrophiesAdmin({ accent }) {
  const list = window.store.trophies.list()
    .slice()
    .sort((a, b) => (b.year || 0) - (a.year || 0));
  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptyTrophy());

  function emptyTrophy() {
    return { team: "valorant", year: new Date().getFullYear(), event: "", place: "Champion" };
  }

  function startEdit(t) { setEditing(t.id); setDraft({ ...emptyTrophy(), ...t }); }
  function submit() {
    if (!draft.event.trim()) return alert("Événement requis");
    const payload = { ...draft, year: +draft.year || new Date().getFullYear() };
    if (editing) window.store.trophies.update(editing, payload);
    else window.store.trophies.add(payload);
    setEditing(null);
    setDraft(emptyTrophy());
  }

  return (
    <div className="nafe-admin__section">
      <FormShell
        title={editing ? "Modifier le trophée" : "Ajouter au palmarès"}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptyTrophy()); } : null}
        submitLabel={editing ? "Mettre à jour" : "Ajouter"}
        accent={accent}
      >
        <Field label="Équipe">
          <select value={draft.team} onChange={(e) => setDraft({ ...draft, team: e.target.value })}>
            {Object.entries(window.TEAMS_META).map(([k, t]) => (
              <option key={k} value={k}>{t.game}</option>
            ))}
          </select>
        </Field>
        <Field label="Année">
          <input type="number" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
        </Field>
        <Field label="Événement" span={2}>
          <input value={draft.event} onChange={(e) => setDraft({ ...draft, event: e.target.value })} placeholder="Ex: VCT EMEA Stage 1" />
        </Field>
        <Field label="Placement">
          <input value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })} placeholder="Ex: Champion / Finaliste / Top 4" />
        </Field>
      </FormShell>

      <DataTable
        accent={accent}
        empty="Aucun trophée enregistré."
        columns={[
          { key: "year", label: "ANNÉE", flex: 0.5 },
          { key: "team", label: "ÉQUIPE", flex: 0.8, render: (r) => window.TEAMS_META[r.team]?.game || r.team },
          { key: "event", label: "ÉVÉNEMENT", flex: 1.8 },
          { key: "place", label: "PLACEMENT", flex: 0.8 },
        ]}
        rows={list}
        onEdit={startEdit}
        onDelete={(id) => window.store.trophies.remove(id)}
      />
    </div>
  );
}

// ============================================================
//  Sub-teams
// ============================================================
function SubteamsAdmin({ accent }) {
  const list = window.store.subteams.list();
  const [editing, setEditing] = useAdminState(null);
  const [team, setTeam] = useAdminState("valorant");
  const [draft, setDraft] = useAdminState(emptySubteam("valorant"));

  function emptySubteam(parent) {
    const base = window.TEAMS_META[parent]?.color || "#1E4FD8";
    const siblings = window.store.getSubteamsByTeam(parent);
    const palette = window.tintPalette(base, 8);
    // Pioche la prochaine teinte non déjà prise
    const taken = new Set(siblings.map((s) => (s.color || "").toLowerCase()));
    const next = palette.find((c) => !taken.has(c.toLowerCase())) || palette[siblings.length % palette.length];
    return { parent, name: "", color: next };
  }

  function startEdit(st) {
    setEditing(st.id);
    setTeam(st.parent);
    setDraft({ ...emptySubteam(st.parent), ...st });
  }

  function submit() {
    if (!draft.name.trim()) return alert("Nom de sous-équipe requis");
    const payload = { ...draft, parent: team };
    if (editing) window.store.subteams.update(editing, payload);
    else window.store.subteams.add(payload);
    setEditing(null);
    setDraft(emptySubteam(team));
  }

  const palette = window.tintPalette(window.TEAMS_META[team]?.color || accent, 8);
  const filtered = list.filter((s) => s.parent === team);

  return (
    <div className="nafe-admin__section">
      <div className="nafe-admin__filter">
        <span className="nafe-mono nafe-field__label">ÉQUIPE PARENTE</span>
        <div className="nafe-admin__filterBtns">
          {Object.entries(window.TEAMS_META).map(([k, t]) => (
            <button
              key={k}
              className={`nafe-news__chip ${team === k ? "is-active" : ""}`}
              style={team === k ? { background: t.color, color: "#fff", borderColor: t.color } : { borderColor: `${t.color}55`, color: t.color }}
              onClick={() => { setTeam(k); setDraft(emptySubteam(k)); setEditing(null); }}
            >
              <span className="nafe-mono">{t.game}</span>
              <span className="nafe-news__chipN nafe-mono">
                {list.filter((s) => s.parent === k).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <FormShell
        title={editing ? "Modifier la sous-équipe" : `Nouvelle sous-équipe · ${window.TEAMS_META[team]?.game}`}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptySubteam(team)); } : null}
        submitLabel={editing ? "Mettre à jour" : "Créer la sous-équipe"}
        accent={accent}
      >
        <Field label="Nom" span={2}>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                 placeholder="Ex: Main, Academy, Female, Challengers..." />
        </Field>
        <Field label="Couleur (hex)">
          <input value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                 placeholder="#FF4655" />
        </Field>
        <Field label="Aperçu">
          <div className="nafe-admin__colorPreview" style={{ background: draft.color, borderColor: draft.color }}>
            <span className="nafe-mono">{draft.color.toUpperCase()}</span>
          </div>
        </Field>
        <Field label="Teintes suggérées (dérivées de la couleur du jeu)" span={4}>
          <div className="nafe-admin__swatches">
            {palette.map((c) => (
              <button
                type="button"
                key={c}
                className={`nafe-admin__swatch ${draft.color.toLowerCase() === c.toLowerCase() ? "is-active" : ""}`}
                style={{ background: c, borderColor: draft.color.toLowerCase() === c.toLowerCase() ? "#fff" : "transparent" }}
                onClick={() => setDraft({ ...draft, color: c })}
                title={c}
              />
            ))}
          </div>
        </Field>
      </FormShell>

      <DataTable
        accent={accent}
        empty={`Aucune sous-équipe pour ${window.TEAMS_META[team]?.game}. Crée la première ci-dessus.`}
        columns={[
          { key: "color", label: "TEINTE", flex: 0.4, render: (r) => (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-block", width: 20, height: 20, background: r.color, border: "1px solid rgba(255,255,255,0.15)" }} />
              <span className="nafe-mono" style={{ fontSize: 11 }}>{r.color}</span>
            </span>
          )},
          { key: "name", label: "NOM", flex: 1.2 },
          { key: "parent", label: "PARENT", flex: 0.8, render: (r) => window.TEAMS_META[r.parent]?.game || r.parent },
          { key: "count", label: "JOUEURS", flex: 0.5, render: (r) => window.store.getPlayersByTeam(r.parent, r.id).length },
        ]}
        rows={filtered}
        onEdit={startEdit}
        onDelete={(id) => {
          // détache les joueurs rattachés avant suppression
          window.store.players.list()
            .filter((p) => p.subteam === id)
            .forEach((p) => window.store.players.update(p.id, { subteam: "" }));
          window.store.subteams.remove(id);
        }}
      />
    </div>
  );
}

// ============================================================
//  Users
// ============================================================
function UsersAdmin({ accent, currentUser }) {
  const list = window.store.users.list()
    .slice()
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

  return (
    <div className="nafe-admin__section">

      <DataTable
        accent={accent}
        empty="Aucun utilisateur."
        columns={[
          { key: "username", label: "PSEUDO", flex: 1 },
          { key: "email", label: "EMAIL", flex: 1.4 },
          { key: "role", label: "RÔLE", flex: 0.5, render: (r) => (
            <span className="nafe-mono" style={{ color: r.role === "admin" ? accent : "rgba(255,255,255,0.6)" }}>
              {r.role === "admin" ? "ADMIN" : "FAN"}
            </span>
          )},
          { key: "xp", label: "XP", flex: 0.4, render: (r) => r.xp || 0 },
          { key: "createdAt", label: "INSCRIT LE", flex: 0.8, render: (r) =>
            r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—"
          },
          { key: "actions2", label: "RÔLE ACTION", flex: 0.9, render: (r) =>
            r.id === currentUser.id ? (
              <span className="nafe-mono" style={{ color: "rgba(255,255,255,0.4)" }}>(toi)</span>
            ) : r.role === "admin" ? (
              <button className="nafe-admin__iconBtn" onClick={() => window.store.demoteToUser(r.id)}>
                Rétrograder
              </button>
            ) : (
              <button className="nafe-admin__iconBtn" style={{ borderColor: accent, color: accent }}
                      onClick={() => window.store.promoteToAdmin(r.id)}>
                Promouvoir admin
              </button>
            )
          },
        ]}
        rows={list}
        onEdit={() => alert("Édition manuelle désactivée — utilise les boutons de rôle.")}
        onDelete={(id) => {
          if (id === currentUser.id) return alert("Tu ne peux pas supprimer ton propre compte.");
          window.store.users.remove(id);
        }}
      />
    </div>
  );
}

// ============================================================
//  Socials (réseaux sociaux)
// ============================================================
const PLATFORM_OPTIONS = ["discord","twitch","youtube","twitter","instagram","tiktok","kick","snapchat"];

function SocialsAdmin({ accent }) {
  const list = window.store.socials.list();
  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptySocial());

  function emptySocial() {
    return { platform: "discord", handle: "", url: "", description: "" };
  }
  function startEdit(s) { setEditing(s.id); setDraft({ ...emptySocial(), ...s }); }
  function submit() {
    if (!draft.handle.trim()) return alert("Le handle / nom est requis");
    if (!draft.url.trim()) return alert("L'URL est requise");
    if (editing) window.store.socials.update(editing, draft);
    else window.store.socials.add(draft);
    setEditing(null);
    setDraft(emptySocial());
  }

  const meta = window.PLATFORM_META?.[draft.platform];
  const previewColor = meta?.bg || meta?.color || accent;

  return (
    <div className="nafe-admin__section">
      <div className="nafe-admin__note">
        <span className="nafe-mono" style={{ color: accent }}>ⓘ RÉSEAUX</span>
        <p>Ajoute ici les liens vers vos réseaux sociaux. Ils s'affichent sur la page <strong>Contact</strong>.
        Discord bénéficie d'une carte héro mise en avant.</p>
      </div>
      <FormShell
        title={editing ? "Modifier le réseau" : "Ajouter un réseau social"}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptySocial()); } : null}
        submitLabel={editing ? "Mettre à jour" : "Ajouter"}
        accent={accent}
      >
        <Field label="Plateforme">
          <select value={draft.platform} onChange={(e) => setDraft({ ...draft, platform: e.target.value })}>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </Field>
        <Field label="Aperçu logo">
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0" }}>
            <div style={{ width:40, height:40, background: previewColor, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {window.PlatformIcon && <window.PlatformIcon platform={draft.platform} size={24} />}
            </div>
            <span className="nafe-mono" style={{ color: previewColor, fontSize:11 }}>{draft.platform.toUpperCase()}</span>
          </div>
        </Field>
        <Field label="Handle / Nom affiché" span={2}>
          <input value={draft.handle} onChange={(e) => setDraft({ ...draft, handle: e.target.value })}
                 placeholder="Ex: NAFE Officiel, @NafeOfficiel" />
        </Field>
        <Field label="URL du lien" span={2}>
          <input type="url" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                 placeholder="https://discord.gg/xxx" />
        </Field>
        <Field label="Description (optionnel)" span={4}>
          <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                 placeholder="Ex: Le serveur Discord officiel — merch drops, Q&A, events" />
        </Field>
      </FormShell>
      <DataTable
        accent={accent}
        empty="Aucun réseau configuré. Ajoute le premier ci-dessus."
        columns={[
          { key: "platform", label: "PLATEFORME", flex: 0.7, render: (r) => {
            const m = window.PLATFORM_META?.[r.platform];
            const c = m?.bg || m?.color || accent;
            return (
              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:20, height:20, background:c, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {window.PlatformIcon && <window.PlatformIcon platform={r.platform} size={12} />}
                </span>
                <span className="nafe-mono" style={{ color:c, fontSize:11 }}>{r.platform.toUpperCase()}</span>
              </span>
            );
          }},
          { key: "handle",      label: "HANDLE",      flex: 1 },
          { key: "url",         label: "URL",         flex: 1.4, render: (r) => <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: accent, wordBreak:"break-all", fontSize:11 }}>{r.url}</a> },
          { key: "description", label: "DESCRIPTION", flex: 1.5 },
        ]}
        rows={list}
        onEdit={startEdit}
        onDelete={(id) => window.store.socials.remove(id)}
      />
    </div>
  );
}

// ============================================================
//  Community (modération des posts)
// ============================================================
function CommunityAdmin({ accent }) {
  const list = window.store.posts.list()
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="nafe-admin__section">
      <div className="nafe-admin__note">
        <span className="nafe-mono" style={{ color: accent }}>ⓘ MODÉRATION</span>
        <p>Voici tous les posts publiés par les fans. Tu peux supprimer un post inapproprié
        via le bouton ✕. Les fans gèrent eux-mêmes la création depuis la page Community.</p>
      </div>
      <DataTable
        accent={accent}
        empty="Aucun post publié pour l'instant."
        columns={[
          { key: "authorName", label: "AUTEUR",  flex: 0.7 },
          { key: "title",      label: "TITRE",   flex: 1.4 },
          { key: "content",    label: "CONTENU", flex: 2,   render: (r) => r.content?.slice(0, 80) + (r.content?.length > 80 ? "…" : "") },
          { key: "likes",      label: "♥",       flex: 0.3, render: (r) => r.likes || 0 },
          { key: "createdAt",  label: "DATE",    flex: 0.7, render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—" },
        ]}
        rows={list}
        onEdit={() => {}}
        onDelete={(id) => { if (confirm("Supprimer ce post ?")) window.store.posts.remove(id); }}
      />
    </div>
  );
}

function EngagementAdmin({ accent }) {
  const [subTab, setSubTab] = useAdminState("predictions");
  
  function seed() {
    if (window.store.badges.list().length > 0) return alert("Données déjà présentes.");
    window.store.badges.add({ name: "Premier Pas", description: "Inscrit sur le portail NAFE", icon: "🌱", color: "#B6F500" });
    window.store.badges.add({ name: "Pronostiqueur", description: "A voté sur son premier match", icon: "🎯", color: "#1E4FD8" });
    window.store.badges.add({ name: "Fidèle", description: "Membre actif de la communauté", icon: "👑", color: "#E11D74" });
    
    const match = window.store.matches.list()[0];
    if (match) {
      window.store.predictions.add({ 
        title: "Qui remportera la map 1 ?", 
        matchId: match.id, 
        matchTitle: `${match.opp} (${match.date})`,
        status: "active", 
        options: [{ id: "o1", label: "NAFE" }, { id: "o2", label: match.opp }] 
      });
    }
    alert("Données d'engagement générées !");
  }

  return (
    <div className="nafe-admin__section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div className="nafe-admin__filterBtns" style={{ marginBottom: 0 }}>
          <button className={`nafe-news__chip ${subTab === 'predictions' ? 'is-active' : ''}`} onClick={() => setSubTab('predictions')}>
            <span className="nafe-mono">PRÉDICTIONS</span>
          </button>
          <button className={`nafe-news__chip ${subTab === 'badges' ? 'is-active' : ''}`} onClick={() => setSubTab('badges')}>
            <span className="nafe-mono">BADGES</span>
          </button>
        </div>
        <button className="nafe-btn nafe-btn--ghost nafe-btn--sm" onClick={seed}>
          Seed Engagement Data
        </button>
      </div>
      
      {subTab === 'predictions' ? <PredictionsAdmin accent={accent} /> : <BadgesAdmin accent={accent} />}
    </div>
  );
}

// ============================================================
//  Shop (Supabase)
// ============================================================
function ShopAdmin({ accent }) {
  const [list, setList] = useAdminState([]);
  const [loading, setLoading] = useAdminState(true);
  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptyProduct());

  useAdminEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    if (!window.supabase) return;
    const { data, error } = await window.supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setList(data);
    }
    setLoading(false);
  }

  function emptyProduct() {
    return { name: "", price: "", sizes: "S, M, L, XL", imageUrl: "" };
  }

  function startEdit(p) {
    setEditing(p.id);
    setDraft({ 
      name: p.name, 
      price: p.price, 
      sizes: Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes, 
      imageUrl: p.image_url || "" 
    });
  }

  async function submit() {
    if (!draft.name.trim()) return alert("Le nom est requis");
    const adminPassword = prompt("Mot de passe Admin requis pour modifier la base de données réelle :");
    if (!adminPassword) return;

    const payload = { 
      name: draft.name, 
      price: +draft.price || 0,
      sizes: draft.sizes.split(",").map(s => s.trim()),
      imageUrl: draft.imageUrl,
      adminPassword
    };

    try {
      let res;
      if (editing) {
        // Not implemented in API yet, but we'll fall back to recreate for prototype simplicity
        alert("L'édition via API n'est pas supportée dans ce prototype. Créez un nouveau produit.");
        return;
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur serveur");
      }

      alert("Opération réussie !");
      setEditing(null);
      setDraft(emptyProduct());
      fetchProducts();
    } catch (e) {
      alert("Erreur: " + e.message);
    }
  }

  async function deleteProduct(id) {
    const adminPassword = prompt("Mot de passe Admin requis pour supprimer :");
    if (!adminPassword) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminPassword}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur serveur");
      }
      fetchProducts();
    } catch (e) {
      alert("Erreur: " + e.message);
    }
  }

  return (
    <div className="nafe-admin__section">
      <FormShell
        title={editing ? "Modifier le produit" : "Nouveau produit (Supabase)"}
        onSubmit={submit}
        onCancel={editing ? () => { setEditing(null); setDraft(emptyProduct()); } : null}
        submitLabel={editing ? "Mettre à jour" : "Ajouter le produit"}
        accent={accent}
      >
        <Field label="Nom du Produit" span={2}>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ex: Jersey Officiel 2026" />
        </Field>
        <Field label="Prix (€)">
          <input type="number" step="0.01" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="Ex: 89.99" />
        </Field>
        <Field label="Tailles (séparées par virgule)">
          <input value={draft.sizes} onChange={(e) => setDraft({ ...draft, sizes: e.target.value })} placeholder="Ex: S, M, L, XL" />
        </Field>
        <Field label="URL de l'Image" span={2}>
          <input value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} placeholder="https://..." />
        </Field>
      </FormShell>

      {loading ? (
        <div className="nafe-admin__empty"><span className="nafe-mono">Chargement des produits Supabase...</span></div>
      ) : (
        <DataTable
          accent={accent}
          empty="Aucun produit dans la base de données Supabase."
          columns={[
            { key: "name", label: "NOM DU PRODUIT", flex: 2 },
            { key: "price", label: "PRIX", flex: 1, render: (r) => `${r.price} €` },
            { key: "sizes", label: "TAILLES", flex: 1, render: (r) => Array.isArray(r.sizes) ? r.sizes.join(", ") : r.sizes },
          ]}
          rows={list}
          onEdit={startEdit}
          onDelete={deleteProduct}
        />
      )}
    </div>
  );
}

window.AdminPage = AdminPage;
