// NAFE — Admin console (localStorage CRUD UI)
// Routes gérées : /admin, /admin/players, /admin/matches, /admin/news, /admin/scores, /admin/trophies

const { useState: useAdminState, useEffect: useAdminEffect } = React;

const ADMIN_TABS = [
  { k: "home",        label: "Page de garde",       icon: "◉" },
  { k: "players",     label: "Joueurs",             icon: "◈" },
  { k: "subteams",    label: "Sous-équipes",        icon: "◇" },
  { k: "matches",     label: "Matchs & calendrier", icon: "▦" },
  { k: "news",        label: "Actualités",          icon: "▤" },
  { k: "scores",      label: "Ticker scores",       icon: "▲" },
  { k: "trophies",    label: "Palmarès",            icon: "★" },
  { k: "sponsors",    label: "Sponsors",            icon: "✦" },
  { k: "association", label: "L'Association",       icon: "◈" },
  { k: "socials",     label: "Réseaux sociaux",     icon: "●" },
  { k: "community",   label: "Communauté",          icon: "◆" },
  { k: "users",       label: "Utilisateurs",        icon: "■" },
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
    try { window.store.seedAdmins(); } catch (e) {}
    const onHash = () => setTab(adminRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ---- Guard : seuls les admins connectés accèdent à la console ----
  const user = window.store.currentUser();
  const defaultAdmins = window.store.DEFAULT_ADMINS || [];

  if (!user) {
    return (
      <div className="nafe-page">
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 60, maxWidth: 700, marginInline: "auto" }}>
          <span className="nafe-mono" style={{ color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}>
            ACCÈS RESTREINT · STAFF NAFE
          </span>
          <h2 className="nafe-display" style={{ fontSize: 28, margin: "10px 0 6px" }}>
            AUTHENTIFICATION REQUISE<span style={{ color: accent }}>.</span>
          </h2>
          <p className="nafe-empty__text" style={{ maxWidth: 560, marginInline: "auto" }}>
            La console admin est réservée aux administrateurs NAFE. Des comptes admin avec accès complet ont été injectés dans le système :
          </p>

          {/* Cartes des identifiants admin injectés */}
          <div className="nafe-injected-admin-card nafe-clip-card" style={{ marginTop: 22, textAlign: "left", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span className="nafe-mono" style={{ fontSize: 11, color: accent, letterSpacing: "0.1em" }}>
                ◈ COMPTES ADMINISTRATEURS INJECTÉS
              </span>
              <span className="nafe-badge nafe-badge--sm" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                3 Comptes Prêts
              </span>
            </div>

            <div className="nafe-injected-admin-grid">
              {defaultAdmins.map((adm) => (
                <div key={adm.id} className="nafe-injected-admin-item">
                  <div className="nafe-injected-admin-item__info">
                    <span className="nafe-injected-admin-item__title">{adm.title}</span>
                    <strong className="nafe-injected-admin-item__user">{adm.username}</strong>
                    <span className="nafe-mono nafe-injected-admin-item__cred">
                      {adm.email} · <span style={{ color: accent }}>{adm.password}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="nafe-btn nafe-btn--sm nafe-btn--accent"
                    style={{ background: accent }}
                    onClick={() => window.store.loginAsAdmin(adm.email)}
                    title={`Connexion immédiate en tant que ${adm.username}`}
                  >
                    Se connecter
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="nafe-btn nafe-btn--accent"
              style={{ background: accent }}
              onClick={() => window.store.loginAsAdmin("admin@nafe.gg")}
            >
              Déverrouiller la console admin (AdminNAFE)
            </button>
            <button
              className="nafe-btn nafe-btn--ghost"
              onClick={() => window.openAuth && window.openAuth("login")}
            >
              Formulaire de connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="nafe-page">
        <div className="nafe-empty nafe-empty--panel" style={{ marginTop: 60, maxWidth: 640, marginInline: "auto" }}>
          <span className="nafe-mono" style={{ color: "#E53E3E", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}>
            ACCÈS REFUSÉ · RÔLE INSUFFISANT
          </span>
          <h2 className="nafe-display" style={{ fontSize: 26, margin: "10px 0 6px" }}>
            COMPTE FAN ACTIF<span style={{ color: "#E53E3E" }}>.</span>
          </h2>
          <p className="nafe-empty__text">
            Tu es actuellement connecté avec <strong>{user.username}</strong> (rôle : {user.role}).
            Pour administrer le site, promeus ce compte ou bascule sur l'un des comptes admin injectés.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="nafe-btn nafe-btn--accent"
              style={{ background: accent }}
              onClick={() => window.store.promoteToAdmin(user.id)}
            >
              Promouvoir mon compte "{user.username}" en Admin
            </button>
            <button
              className="nafe-btn nafe-btn--ghost"
              onClick={() => window.store.loginAsAdmin("admin@nafe.gg")}
            >
              Basculer sur AdminNAFE
            </button>
            <a className="nafe-btn nafe-btn--ghost" href="#/">
              ← Accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  const counts = {
    home:        4,
    players:   window.store.players.list().length,
    subteams:  window.store.subteams.list().length,
    matches:   window.store.matches.list().length,
    news:      window.store.news.list().length,
    scores:    window.store.scores.list().length,
    trophies:    window.store.trophies.list().length,
    sponsors:    window.store.sponsors ? window.store.sponsors.list().length : 0,
    association: window.store.association_blocks ? window.store.association_blocks.list().length : 0,
    socials:     window.store.socials.list().length,
    community:   window.store.posts.list().length,
    users:       window.store.users.list().length,
    engagement:  (window.store.predictions.list().length + window.store.badges.list().length),
  };

  return (
    <div className="nafe-page">
      <section className="nafe-team__hero">
        <div className="nafe-admin-session-bar">
          <div className="nafe-admin-session-bar__left">
            <span className="nafe-eyebrow" style={{ color: accent || "var(--nafe-denim-blue)", margin: 0 }}>
              ● Admin Actif : <strong>{user.username}</strong> ({user.email})
            </span>
          </div>
          <div className="nafe-admin-session-bar__right">
            <span className="nafe-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              Basculer vers :
            </span>
            {defaultAdmins.filter(a => a.id !== user.id).map(a => (
              <button
                key={a.id}
                type="button"
                className="nafe-admin-switcher-btn"
                onClick={() => window.store.loginAsAdmin(a.email)}
                title={`Passer sur ${a.username}`}
              >
                {a.username}
              </button>
            ))}
            <button
              type="button"
              className="nafe-admin-switcher-btn nafe-admin-switcher-btn--logout"
              onClick={() => window.store.logout()}
            >
              Déconnexion
            </button>
          </div>
        </div>

        <h1 className="nafe-display nafe-team__title">
          CONSOLE ADMIN<span style={{ color: accent || "var(--nafe-water-blue)" }}>.</span>
        </h1>
        <p className="nafe-team__lede">
          Gérez l'ensemble des rosters, sponsors, l'association, matchs, trophées, actus et le flux officiel de la structure.
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
                  {String(counts[t.k] || 0).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="nafe-admin__panel">
        {tab === "home"        && <HomeAdmin        accent={accent} />}
        {tab === "players"     && <PlayersAdmin     accent={accent} />}
        {tab === "subteams"    && <SubteamsAdmin    accent={accent} />}
        {tab === "matches"     && <MatchesAdmin     accent={accent} />}
        {tab === "news"        && <NewsAdmin        accent={accent} />}
        {tab === "scores"      && <ScoresAdmin      accent={accent} />}
        {tab === "trophies"    && <TrophiesAdmin    accent={accent} />}
        {tab === "sponsors"    && <SponsorsAdmin    accent={accent} />}
        {tab === "association" && <AssociationAdmin accent={accent} />}
        {tab === "socials"     && <SocialsAdmin     accent={accent} />}
        {tab === "community"   && <CommunityAdmin   accent={accent} />}
        {tab === "users"       && <UsersAdmin       accent={accent} currentUser={user} />}
        {tab === "engagement"  && <EngagementAdmin  accent={accent} />}
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
            ></button>
            <button
              className="nafe-admin__iconBtn nafe-admin__iconBtn--danger"
              onClick={() => { if (confirm("Supprimer cette entrée ?")) onDelete(r.id); }}
              title="Supprimer"
            >
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
    return {
      team: "fortnite",
      subteam: "",
      name: "",
      tag: "",
      role: "Fragger",
      format: "Duo",
      partner: "",
      pr: 0,
      bestRank: "",
      jersey: 1,
      country: "FR",
      kd: 0,
      hs: 0,
      gear: { mouse: "", keyboard: "", headset: "" }
    };
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
    const payload = {
      ...draft,
      jersey: +draft.jersey || 0,
      kd: +draft.kd || 0,
      hs: +draft.hs || 0,
      pr: +draft.pr || 0
    };
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
        {draft.team === "fortnite" && (
          <>
            <Field label="Format Fortnite (Solo / Duo / Trio)">
              <select value={draft.format || "Duo"} onChange={(e) => setDraft({ ...draft, format: e.target.value })}>
                <option value="Solo">Solo</option>
                <option value="Duo">Duo</option>
                <option value="Trio">Trio</option>
              </select>
            </Field>
            <Field label="Coéquipier(s) / Lineup">
              <input
                value={draft.partner || ""}
                onChange={(e) => setDraft({ ...draft, partner: e.target.value })}
                
              />
            </Field>
            <Field label="Power Ranking (PR)">
              <input
                type="number"
                value={draft.pr || 0}
                onChange={(e) => setDraft({ ...draft, pr: e.target.value })}
                
              />
            </Field>
            <Field label="Meilleure Perf / Classement">
              <input
                value={draft.bestRank || ""}
                onChange={(e) => setDraft({ ...draft, bestRank: e.target.value })}
                
              />
            </Field>
          </>
        )}
        <Field label="Numéro">
          <input type="number" min={0} max={99} value={draft.jersey}
            onChange={(e) => setDraft({ ...draft, jersey: e.target.value })} />
        </Field>
        <Field label="Nom de scène">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}  />
        </Field>
        <Field label="Pseudo (@tag)">
          <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })}  />
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
          { key: "team", label: "ÉQUIPE", flex: 0.9, render: (r) => window.TEAMS_META[r.team]?.game || r.team },
          { key: "subteam", label: "SOUS-ÉQUIPE / FORMAT", flex: 1.1, render: (r) => {
            if (r.team === "fortnite") {
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span className="nafe-mono" style={{ fontSize: 10, padding: "2px 6px", background: "rgba(139, 92, 246, 0.2)", color: "#C084FC", border: "1px solid rgba(139, 92, 246, 0.4)", borderRadius: 2 }}>
                    {(r.format || "SOLO").toUpperCase()}
                  </span>
                  {r.partner && <span style={{ fontSize: 11, opacity: 0.8 }}>({r.partner})</span>}
                </div>
              );
            }
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
const GAMES = ["VAL", "RL", "FN", "DROP", "EVENT"];
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
          <input value={draft.event} onChange={(e) => setDraft({ ...draft, event: e.target.value })}  />
        </Field>
        <Field label="Adversaire">
          <input value={draft.opp} onChange={(e) => setDraft({ ...draft, opp: e.target.value })}  />
        </Field>
        <Field label="Lieu">
          <input value={draft.loc} onChange={(e) => setDraft({ ...draft, loc: e.target.value })}  />
        </Field>
        <Field label="Résultat" span={2}>
          <input value={draft.result} onChange={(e) => setDraft({ ...draft, result: e.target.value })}  />
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 30 }}>
        <FormShell
          title={editing ? "Modifier l'actualité" : "Poster une nouvelle actu"}
          onSubmit={submit}
          onCancel={editing ? () => { setEditing(null); setDraft(emptyNews()); } : null}
          submitLabel={editing ? "Mettre à jour" : "Publier"}
          accent={accent}
        >
          <Field label="Type de contenu">
            <select value={isVideo ? "video" : "article"} onChange={(e) => {
              const val = e.target.value;
              setDraft({ ...draft, cat: val === "video" ? "YouTube" : "Annonce" });
            }}>
              <option value="article">Article / Annonce</option>
              <option value="video">Vidéo (YouTube/Twitch)</option>
            </select>
          </Field>

          {isVideo ? (
            <Field label="Plateforme">
              <select value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })}>
                <option value="YouTube">YouTube</option>
                <option value="Twitch">Twitch</option>
              </select>
            </Field>
          ) : (
            <Field label="Catégorie">
              <select value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })}>
                {NEWS_CATS.filter(c => c !== "YouTube" && c !== "Twitch").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          )}

          <Field label="Date (libellé)">
            <input value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          </Field>
          
          <Field label="Titre" span={2}>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}  />
          </Field>

          {isVideo && (
            <Field label="Lien Vidéo (URL)" span={2}>
              <input value={draft.url || ""} onChange={(e) => setDraft({ ...draft, url: e.target.value })}  />
            </Field>
          )}

          <Field label="Résumé / Chapeau" span={2}>
            <textarea rows={3} value={draft.lede} onChange={(e) => setDraft({ ...draft, lede: e.target.value })} />
          </Field>

          <Field label="À la une">
            <label className="nafe-field__checkbox">
              <input type="checkbox" checked={!!draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} />
              <span>Épingler en haut de page</span>
            </label>
          </Field>
        </FormShell>

        {/* LIVE PREVIEW */}
        <div className="nafe-admin__preview">
          <p className="nafe-mono" style={{ marginBottom: 15, opacity: 0.5 }}>APERÇU DU DESIGN</p>
          <div style={{ pointerEvents: 'none', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
            {isVideo ? (
              <div className="nafe-news__card nafe-video-card nafe-clip-card" style={{ width: 450 }}>
                <div className="nafe-video-thumb" style={{ background: '#000', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="nafe-video-play" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>▶</div>
                  <span className="nafe-video-tag" style={{ position: 'absolute', top: 12, right: 12, background: draft.cat === "YouTube" ? "#FF0000" : "#9146FF", padding: '6px 12px', color: '#fff', fontSize: 10, fontWeight: 800 }}>{draft.cat.toUpperCase()}</span>
                </div>
                <div className="nafe-news__cardBody" style={{ padding: 24, background: '#050814' }}>
                  <div className="nafe-news__meta" style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 12 }}>
                    <span className="nafe-mono" style={{ color: draft.cat === "YouTube" ? "#FF0000" : "#9146FF" }}>NOUVEAU CONTENU</span>
                    <span className="nafe-mono" style={{ opacity: 0.5 }}>· {draft.date}</span>
                  </div>
                  <h3 className="nafe-display" style={{ fontSize: 22, margin: '10px 0' }}>{draft.title || "TITRE DE LA VIDÉO"}</h3>
                  <div style={{ marginTop: 20, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="nafe-mono" style={{ color: draft.cat === "YouTube" ? "#FF0000" : "#9146FF", fontSize: 11, fontWeight: 700 }}>
                      REGARDER SUR {draft.cat.toUpperCase()} →
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="nafe-news__card nafe-clip-card" style={{ width: 450, background: '#050814' }}>
                <div style={{ height: 180, background: '#111' }}></div>
                <div style={{ padding: 24 }}>
                   <div style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 12 }}>
                    <span className="nafe-mono" style={{ color: accent }}>{draft.cat.toUpperCase()}</span>
                    <span className="nafe-mono" style={{ opacity: 0.5 }}>· {draft.date}</span>
                  </div>
                  <h3 className="nafe-display" style={{ fontSize: 22 }}>{draft.title || "TITRE DE L'ARTICLE"}</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DataTable
        accent={accent}
        empty="Aucun article publié. Remplis le formulaire ci-dessus pour poster ta première actu."
        columns={[
          { key: "date", label: "DATE", flex: 0.7 },
          { key: "cat", label: "CAT", flex: 0.7 },
          { key: "title", label: "TITRE", flex: 2, render: (r) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {(r.cat === "YouTube" || r.cat === "Twitch") && <span style={{ color: r.cat === "YouTube" ? "#FF0000" : "#9146FF" }}>▶</span>}
              {r.title}
            </div>
          )},
          { key: "url", label: "URL", flex: 1, render: (r) => r.url ? <a href={r.url} target="_blank" style={{ color: accent }}>Lien </a> : "—" },
          { key: "author", label: "AUTEUR", flex: 0.8 },
          { key: "featured", label: "UNE", flex: 0.3, render: (r) => r.featured ? "" : "" },
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
          <input value={draft.game} onChange={(e) => setDraft({ ...draft, game: e.target.value })}  />
        </Field>
        <Field label="Match">
          <input value={draft.match} onChange={(e) => setDraft({ ...draft, match: e.target.value })}  />
        </Field>
        <Field label="Score / libellé">
          <input value={draft.score} onChange={(e) => setDraft({ ...draft, score: e.target.value })}  />
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
          <input value={draft.event} onChange={(e) => setDraft({ ...draft, event: e.target.value })}  />
        </Field>
        <Field label="Placement">
          <input value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })}  />
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
                  />
        </Field>
        <Field label="Couleur (hex)">
          <input value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                  />
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

  const defaultAdmins = window.store.DEFAULT_ADMINS || [];

  return (
    <div className="nafe-admin__section">
      <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 className="nafe-display" style={{ margin: 0, fontSize: 18 }}>
              COMPTES ADMINISTRATEURS INJECTÉS<span style={{ color: accent }}>.</span>
            </h3>
            <p className="nafe-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>
              3 comptes officiels injectés dans le store (AdminNAFE, StaffNAFE, Mathia).
            </p>
          </div>
          <button
            type="button"
            className="nafe-btn nafe-btn--sm nafe-btn--accent"
            style={{ background: accent }}
            onClick={() => {
              window.store.seedAdmins();
              alert("Comptes administrateurs vérifiés et réinjectés avec succès !");
            }}
          >
            Réinjecter / Synchroniser les Admins
          </button>
        </div>
      </div>

      <DataTable
        accent={accent}
        empty="Aucun utilisateur."
        columns={[
          { key: "username", label: "PSEUDO", flex: 0.9 },
          { key: "email", label: "EMAIL", flex: 1.2 },
          { key: "role", label: "RÔLE", flex: 0.5, render: (r) => (
            <span className="nafe-mono" style={{ color: r.role === "admin" ? accent : "rgba(255,255,255,0.6)" }}>
              {r.role === "admin" ? "ADMIN" : "FAN"}
            </span>
          )},
          { key: "xp", label: "XP", flex: 0.4, render: (r) => r.xp || 0 },
          { key: "createdAt", label: "INSCRIT LE", flex: 0.7, render: (r) =>
            r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—"
          },
          { key: "actions2", label: "RÔLE ACTION", flex: 1.2, render: (r) =>
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
//  Pinned Tweet Manager (Gestion du tweet épinglé à gauche)
// ============================================================
function PinnedTweetManager({ accent }) {
  window.store.useVersion();
  const [tweets, setTweets] = useAdminState(window.DEFAULT_TWEETS || []);
  const [pinnedId, setPinnedId] = useAdminState(
    window.store.settings ? window.store.settings.getPinnedTweetId() : "2098488608801935761"
  );
  const [customId, setCustomId] = useAdminState("");

  useAdminEffect(() => {
    fetch("/api/tweets")
      .then(r => r.json())
      .then(d => {
        if (d.tweets && d.tweets.length > 0) setTweets(d.tweets);
      })
      .catch(() => {});
  }, []);

  const currentPinned = tweets.find(t => t.id === pinnedId) || tweets[0];

  function handlePin(id) {
    if (!id) return;
    if (window.store.settings) {
      window.store.settings.setPinnedTweetId(id);
      setPinnedId(id);
    }
  }

  return (
    <div className="nafe-admin-pinned-panel nafe-clip-card">
      <div className="nafe-admin-pinned-panel__head">
        <div>
          <span className="nafe-eyebrow" style={{ color: "var(--nafe-denim-blue)" }}>Twitter · Position Gauche Verrouillée</span>
          <h3 className="nafe-display" style={{ margin: "6px 0 0", fontSize: 22, color: "#FFFFFF" }}>
            TWEET ÉPINGLÉ SUR L'ACCUEIL
          </h3>
        </div>
        <span className="nafe-pinned-badge">
          <span>POSITION GAUCHE VERROUILLÉE</span>
        </span>
      </div>

      <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.5, margin: "0 0 20px" }}>
        Le tweet sélectionné ci-dessous reste verrouillé en première position (à gauche) sur l'accueil. Si Nafe publie un nouveau tweet épinglé, choisissez-le ci-dessous pour qu'il prenne immédiatement sa place.
      </p>

      {/* Tweet actuellement épinglé */}
      {currentPinned && (
        <div style={{
          background: "linear-gradient(135deg, rgba(2, 136, 209, 0.12) 0%, rgba(51, 51, 51, 0.35) 100%)",
          border: "1px solid var(--nafe-denim-blue)",
          padding: 20,
          marginBottom: 20
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="nafe-mono" style={{ color: "var(--nafe-denim-blue)", fontSize: 11, fontWeight: 700 }}>
              ACTUELLEMENT AFFICHÉ À GAUCHE (ID: {currentPinned.id})
            </span>
            <span className="nafe-mono" style={{ opacity: 0.5, fontSize: 11 }}>
              {new Date(currentPinned.created_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#fff", whiteSpace: "pre-wrap" }}>{currentPinned.text}</p>
        </div>
      )}

      {/* Remplacer par un autre tweet */}
      <div style={{ marginTop: 20 }}>
        <h4 className="nafe-display" style={{ fontSize: 15, margin: "0 0 12px", color: "var(--nafe-denim-blue)" }}>
          Changer le tweet fixé à gauche :
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 240, overflowY: "auto", paddingRight: 8 }}>
          {tweets.map(t => {
            const isThisPinned = t.id === currentPinned?.id;
            return (
              <div 
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: isThisPinned ? "rgba(2, 136, 209, 0.15)" : "rgba(255,255,255,0.02)",
                  border: isThisPinned ? "1px solid var(--nafe-denim-blue)" : "1px solid rgba(255,255,255,0.06)",
                  gap: 16
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nafe-mono" style={{ fontSize: 10, opacity: 0.5, marginBottom: 2 }}>
                    {new Date(t.created_at).toLocaleDateString("fr-FR")} · ID: {t.id}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.9 }}>
                    {t.text}
                  </p>
                </div>
                {isThisPinned ? (
                  <span className="nafe-mono" style={{ color: "var(--nafe-denim-blue)", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                    ACTIF
                  </span>
                ) : (
                  <button 
                    className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                    style={{ whiteSpace: "nowrap", padding: "6px 12px", fontSize: 10 }}
                    onClick={() => handlePin(t.id)}
                  >
                    Fixer à gauche
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Option saisie manuelle d'un ID de tweet */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <input 
            type="text" 
             
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            style={{ flex: 1, padding: "10px 14px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "JetBrains Mono", fontSize: 12 }}
          />
          <button 
            className="nafe-btn nafe-btn--accent nafe-btn--sm"
            style={{ background: accent || "var(--nafe-water-blue)" }}
            onClick={() => {
              if (!customId.trim()) return alert("Veuillez saisir un ID de tweet valide");
              handlePin(customId.trim());
              setCustomId("");
            }}
          >
            Définir comme épinglé
          </button>
        </div>
      </div>
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
      {/* Panneau de verrouillage du Tweet Épinglé */}
      <PinnedTweetManager accent={accent} />

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
                  />
        </Field>
        <Field label="URL du lien" span={2}>
          <input type="url" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                  />
        </Field>
        <Field label="Description (optionnel)" span={4}>
          <input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
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
        via le bouton . Les fans gèrent eux-mêmes la création depuis la page Community.</p>
      </div>
      <DataTable
        accent={accent}
        empty="Aucun post publié pour l'instant."
        columns={[
          { key: "authorName", label: "AUTEUR",  flex: 0.7 },
          { key: "title",      label: "TITRE",   flex: 1.4 },
          { key: "content",    label: "CONTENU", flex: 2,   render: (r) => r.content?.slice(0, 80) + (r.content?.length > 80 ? "…" : "") },
          { key: "likes",      label: "LIKES",   flex: 0.3, render: (r) => r.likes || 0 },
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
    window.store.badges.add({ name: "Premier Pas", description: "Inscrit sur le portail NAFE", icon: "", color: "#B6F500" });
    window.store.badges.add({ name: "Pronostiqueur", description: "A voté sur son premier match", icon: "◈", color: "#1E4FD8" });
    window.store.badges.add({ name: "Fidèle", description: "Membre actif de la communauté", icon: "▲", color: "#E11D74" });
    
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
//  Sponsors
// ============================================================
const SPONSOR_TIERS = [
  "Partenaire Titre",
  "Partenaire Majeur",
  "Équipementier Officiel",
  "Partenaire Infrastructure",
  "Partenaire Textile",
  "Partenaire Média",
  "Supporter Officiel",
  "Partenaire Technique"
];

function emptySponsor() {
  return {
    name: "",
    tier: "Partenaire Majeur",
    category: "",
    logo: "",
    banner: "",
    description: "",
    websiteUrl: "",
    promoCode: "",
    order: 1,
    active: true,
  };
}

function SponsorsAdmin({ accent }) {
  window.store.useVersion();
  const list = window.store.sponsors ? window.store.sponsors.list() : [];
  const settings = (window.store.sponsors_settings && window.store.sponsors_settings.get()) || {};

  const [editing, setEditing] = useAdminState(null);
  const [draft, setDraft] = useAdminState(emptySponsor());
  const [settingsDraft, setSettingsDraft] = useAdminState({
    heroEyebrow: settings.heroEyebrow || "",
    heroTitle: settings.heroTitle || "",
    heroLede: settings.heroLede || "",
    ctaTitle: settings.ctaTitle || "",
    ctaDesc: settings.ctaDesc || "",
    ctaButtonLabel: settings.ctaButtonLabel || "",
    ctaButtonUrl: settings.ctaButtonUrl || "",
    footerNotice: settings.footerNotice || "",
  });

  const [activeSection, setActiveSection] = useAdminState("sponsors"); // "sponsors" | "header"

  function startEdit(s) {
    setEditing(s.id);
    setDraft({ ...emptySponsor(), ...s });
    setActiveSection("sponsors");
  }

  function submitSponsor() {
    if (!draft.name.trim()) return alert("Le nom du sponsor est requis");
    const payload = {
      ...draft,
      order: +draft.order || 1,
      active: draft.active !== false
    };
    if (editing) {
      window.store.sponsors.update(editing, payload);
    } else {
      window.store.sponsors.add(payload);
    }
    setEditing(null);
    setDraft(emptySponsor());
  }

  function saveSettings(e) {
    e.preventDefault();
    window.store.sponsors_settings.set(settingsDraft);
    alert("Textes de la page Sponsors enregistrés avec succès !");
  }

  return (
    <div className="nafe-admin__section">
      {/* Barre d'action rapide */}
      <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 className="nafe-display" style={{ margin: 0, fontSize: 18 }}>
              ESPACE SPONSORS & PARTENAIRES<span style={{ color: accent }}>.</span>
            </h3>
            <p className="nafe-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>
              Tous les blocs et fiches partenaires sont entièrement configurables et dynamiques.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="nafe-btn nafe-btn--sm nafe-btn--accent"
              style={{ background: accent }}
              onClick={() => {
                if (confirm("Charger les exemples de sponsors et de textes par défaut ?")) {
                  window.store.seedSponsorsTemplate();
                  setSettingsDraft(window.store.sponsors_settings.get());
                }
              }}
            >
              Charger un modèle d'exemple
            </button>
            <button
              type="button"
              className="nafe-btn nafe-btn--sm nafe-btn--ghost"
              style={{ borderColor: "#FF5252", color: "#FF8A80" }}
              onClick={() => {
                if (confirm("Voulez-vous vraiment vider TOUS les sponsors et textes de la page ?")) {
                  window.store.clearSponsors();
                  setSettingsDraft({
                    heroEyebrow: "", heroTitle: "", heroLede: "",
                    ctaTitle: "", ctaDesc: "", ctaButtonLabel: "", ctaButtonUrl: "", footerNotice: ""
                  });
                }
              }}
            >
              Vider tous les sponsors & textes
            </button>
          </div>
        </div>

        {/* Sous-onglets */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            type="button"
            className={`nafe-btn nafe-btn--sm ${activeSection === "sponsors" ? "nafe-btn--accent" : "nafe-btn--ghost"}`}
            style={activeSection === "sponsors" ? { background: accent } : {}}
            onClick={() => setActiveSection("sponsors")}
          >
            Fiches Partenaires ({list.length})
          </button>
          <button
            type="button"
            className={`nafe-btn nafe-btn--sm ${activeSection === "header" ? "nafe-btn--accent" : "nafe-btn--ghost"}`}
            style={activeSection === "header" ? { background: accent } : {}}
            onClick={() => setActiveSection("header")}
          >
            Textes d'en-tête & CTA Partenaire
          </button>
        </div>
      </div>

      {activeSection === "header" ? (
        <form onSubmit={saveSettings} className="nafe-admin__card" style={{ marginBottom: 24 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16 }}>
            PERSONNALISATION DES TEXTES DE LA PAGE SPONSORS
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <Field label="Surtitre Hero (Eyebrow)" span={2}>
              <input
                value={settingsDraft.heroEyebrow}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, heroEyebrow: e.target.value })}
                
              />
            </Field>
            <Field label="Titre Principal">
              <input
                value={settingsDraft.heroTitle}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, heroTitle: e.target.value })}
                
              />
            </Field>
            <Field label="Légende de bas de page (Footer notice)">
              <input
                value={settingsDraft.footerNotice}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, footerNotice: e.target.value })}
                
              />
            </Field>
            <Field label="Introduction / Lede du Hero" span={2}>
              <textarea
                rows={2}
                value={settingsDraft.heroLede}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, heroLede: e.target.value })}
                
              />
            </Field>

            <Field label="Titre du bloc 'Devenir Partenaire'">
              <input
                value={settingsDraft.ctaTitle}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, ctaTitle: e.target.value })}
                
              />
            </Field>
            <Field label="Label du bouton CTA">
              <input
                value={settingsDraft.ctaButtonLabel}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, ctaButtonLabel: e.target.value })}
                
              />
            </Field>
            <Field label="Lien du bouton CTA">
              <input
                value={settingsDraft.ctaButtonUrl}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, ctaButtonUrl: e.target.value })}
                
              />
            </Field>
            <Field label="Description du bloc 'Devenir Partenaire'" span={2}>
              <textarea
                rows={2}
                value={settingsDraft.ctaDesc}
                onChange={(e) => setSettingsDraft({ ...settingsDraft, ctaDesc: e.target.value })}
                
              />
            </Field>
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="nafe-btn nafe-btn--accent" style={{ background: accent }}>
              Enregistrer les textes de la page Sponsors
            </button>
          </div>
        </form>
      ) : (
        <>
          <FormShell
            title={editing ? "Modifier la fiche sponsor" : "Créer une nouvelle fiche sponsor"}
            onSubmit={submitSponsor}
            onCancel={editing ? () => { setEditing(null); setDraft(emptySponsor()); } : null}
            submitLabel={editing ? "Mettre à jour" : "Ajouter le sponsor"}
            accent={accent}
          >
            <Field label="Nom du sponsor / Marque" span={2}>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                
              />
            </Field>
            <Field label="Palier de partenariat">
              <select
                value={draft.tier}
                onChange={(e) => setDraft({ ...draft, tier: e.target.value })}
              >
                {SPONSOR_TIERS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Secteur / Catégorie">
              <input
                value={draft.category || ""}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                
              />
            </Field>
            <Field label="URL de la bannière (grande image)" span={2}>
              <input
                value={draft.banner || ""}
                onChange={(e) => setDraft({ ...draft, banner: e.target.value })}
                
              />
              {draft.banner && (
                <div style={{ marginTop: 8, height: 70, overflow: "hidden", borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <img src={draft.banner} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </Field>
            <Field label="URL du logo / Icône">
              <input
                value={draft.logo || ""}
                onChange={(e) => setDraft({ ...draft, logo: e.target.value })}
                
              />
            </Field>
            <Field label="Lien du site officiel">
              <input
                value={draft.websiteUrl || ""}
                onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })}
                
              />
            </Field>
            <Field label="Code promo communautaire (optionnel)">
              <input
                value={draft.promoCode || ""}
                onChange={(e) => setDraft({ ...draft, promoCode: e.target.value })}
                
              />
            </Field>
            <Field label="Ordre d'affichage">
              <input
                type="number"
                min={1}
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: e.target.value })}
              />
            </Field>
            <Field label="Statut actif" span={2}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#fff" }}>
                <input
                  type="checkbox"
                  checked={draft.active !== false}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                  style={{ width: 18, height: 18 }}
                />
                <span>Afficher ce sponsor publiquement sur la page Sponsors</span>
              </label>
            </Field>
            <Field label="Description détaillée du partenariat" span={2}>
              <textarea
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                
              />
            </Field>
          </FormShell>

          <DataTable
            accent={accent}
            empty="Aucun sponsor enregistré. Utilisez le formulaire ci-dessus pour créer vos partenaires."
            columns={[
              { key: "order", label: "N°", flex: 0.3, render: (r) => `#${r.order || 1}` },
              { key: "logo", label: "LOGO", flex: 0.5, render: (r) => (
                r.logo ? <img src={r.logo} alt={r.name} style={{ width: 28, height: 28, objectFit: "contain" }} onError={(e) => { e.target.style.display = 'none'; }} /> : "—"
              )},
              { key: "name", label: "NOM", flex: 1.2 },
              { key: "tier", label: "PALIER", flex: 1, render: (r) => (
                <span className="nafe-mono" style={{ color: accent, fontSize: 11 }}>{r.tier}</span>
              )},
              { key: "promoCode", label: "CODE PROMO", flex: 0.8, render: (r) => r.promoCode ? <span className="nafe-mono" style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px" }}>{r.promoCode}</span> : "—" },
              { key: "active", label: "STATUT", flex: 0.6, render: (r) => (
                <span style={{ color: r.active !== false ? "var(--nafe-green-peas)" : "#FF5252" }}>
                  {r.active !== false ? "● Actif" : "○ Inactif"}
                </span>
              )},
            ]}
            rows={list.sort((a, b) => (a.order || 0) - (b.order || 0))}
            onEdit={startEdit}
            onDelete={(id) => window.store.sponsors.remove(id)}
          />
        </>
      )}
    </div>
  );
}

// ============================================================
//  Association Admin (Page Simple Unifiee : Titre, Textes, Images PNG)
// ============================================================
function AssociationAdmin({ accent }) {
  window.store.useVersion();
  const settings = (window.store.association_settings && window.store.association_settings.get()) || {};

  // Etat local du formulaire de la page
  const [draft, setDraft] = useAdminState({
    badge: settings.badge || settings.heroBadge || "",
    title: settings.title || settings.heroTitle || "",
    subtitle: settings.subtitle || settings.heroLede || "",
    bannerImage: settings.bannerImage || "",
    mainText: settings.mainText || "",
    images: Array.isArray(settings.images) ? settings.images : [],
    textSections: Array.isArray(settings.textSections) ? settings.textSections : [],
    donationActive: settings.donationActive !== false,
    donationUrl: settings.donationUrl || "https://www.helloasso.com",
    donationButtonText: settings.donationButtonText || settings.donationButtonLabel || "Soutenir l'Association (HelloAsso)",
    donationNote: settings.donationNote || settings.donationDesc || "",
  });

  // Etat pour ajouter une nouvelle image PNG
  const [newImage, setNewImage] = useAdminState({
    url: "",
    caption: "",
    layout: "center", // "banner" | "center" | "grid"
  });

  // Etat pour ajouter une section de texte complementaire (Termes, Reglement...)
  const [newSection, setNewSection] = useAdminState({
    title: "",
    text: "",
  });

  const [saveSuccess, setSaveSuccess] = useAdminState(false);

  // Synchroniser si le store change
  React.useEffect(() => {
    setDraft({
      badge: settings.badge || settings.heroBadge || "",
      title: settings.title || settings.heroTitle || "",
      subtitle: settings.subtitle || settings.heroLede || "",
      bannerImage: settings.bannerImage || "",
      mainText: settings.mainText || "",
      images: Array.isArray(settings.images) ? settings.images : [],
      textSections: Array.isArray(settings.textSections) ? settings.textSections : [],
      donationActive: settings.donationActive !== false,
      donationUrl: settings.donationUrl || "https://www.helloasso.com",
      donationButtonText: settings.donationButtonText || settings.donationButtonLabel || "Soutenir l'Association (HelloAsso)",
      donationNote: settings.donationNote || settings.donationDesc || "",
    });
  }, [
    settings.title, settings.heroTitle,
    settings.badge, settings.heroBadge,
    settings.mainText, settings.bannerImage,
    JSON.stringify(settings.images || []),
    JSON.stringify(settings.textSections || [])
  ]);

  function saveAll(e) {
    if (e && e.preventDefault) e.preventDefault();
    window.store.association_settings.set(draft);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  function handleAddImage() {
    if (!newImage.url.trim()) return alert("Veuillez renseigner l'URL de l'image PNG.");
    const item = {
      id: "img_" + Date.now(),
      url: newImage.url.trim(),
      caption: newImage.caption.trim(),
      layout: newImage.layout || "center",
    };
    const nextImages = [...draft.images, item];
    const nextDraft = { ...draft, images: nextImages };
    setDraft(nextDraft);
    window.store.association_settings.set(nextDraft);
    setNewImage({ url: "", caption: "", layout: "center" });
  }

  function handleRemoveImage(imgId) {
    const nextImages = draft.images.filter(img => img.id !== imgId);
    const nextDraft = { ...draft, images: nextImages };
    setDraft(nextDraft);
    window.store.association_settings.set(nextDraft);
  }

  function handleAddSection() {
    if (!newSection.title.trim() && !newSection.text.trim()) {
      return alert("Veuillez renseigner au moins un titre ou du texte pour cette section.");
    }
    const item = {
      id: "ts_" + Date.now(),
      title: newSection.title.trim(),
      text: newSection.text.trim(),
    };
    const nextSections = [...draft.textSections, item];
    const nextDraft = { ...draft, textSections: nextSections };
    setDraft(nextDraft);
    window.store.association_settings.set(nextDraft);
    setNewSection({ title: "", text: "" });
  }

  function handleRemoveSection(secId) {
    const nextSections = draft.textSections.filter(sec => sec.id !== secId);
    const nextDraft = { ...draft, textSections: nextSections };
    setDraft(nextDraft);
    window.store.association_settings.set(nextDraft);
  }

  return (
    <div className="nafe-admin__section">
      {/* Barre d'action et d'en-tete */}
      <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 className="nafe-display" style={{ margin: 0, fontSize: 18 }}>
              PAGE ASSOCIATION (LOI 1901)
            </h3>
            <p className="nafe-empty__text" style={{ margin: "4px 0 0", fontSize: 13 }}>
              Page unique et directe : configurez le titre, redigez vos textes, placez vos images PNG et activez le bouton de don.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="#/association"
              target="_blank"
              rel="noreferrer"
              className="nafe-btn nafe-btn--ghost nafe-btn--sm"
            >
              Voir la page publique
            </a>
            <button
              type="button"
              className="nafe-btn nafe-btn--accent nafe-btn--sm"
              style={{ background: accent }}
              onClick={() => {
                window.store.seedAssociationTemplate();
                const fresh = (window.store.association_settings && window.store.association_settings.get()) || {};
                setDraft({ ...fresh });
              }}
            >
              Charger un exemple complet
            </button>
            <button
              type="button"
              className="nafe-btn nafe-btn--ghost nafe-btn--sm"
              style={{ borderColor: "rgba(255, 82, 82, 0.4)", color: "#FF5252" }}
              onClick={() => {
                window.store.clearAssociation();
                setDraft({
                  badge: "", title: "", subtitle: "", bannerImage: "",
                  mainText: "", images: [], textSections: [],
                  donationActive: false, donationUrl: "", donationButtonText: "", donationNote: ""
                });
              }}
            >
              Vider toute la page
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "rgba(139, 195, 74, 0.15)",
              border: "1px solid var(--nafe-green-peas)",
              color: "var(--nafe-green-peas)",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600
            }}
          >
            Modifications de la page Association enregistrees avec succes !
          </div>
        )}
      </div>

      <form onSubmit={saveAll}>
        {/* 1. TITRE ET EN-TETE DE LA PAGE */}
        <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            1. TITRE ET EN-TETE DE LA PAGE
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <Field label="Surtitre / Badge">
              <input
                value={draft.badge}
                onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
              />
            </Field>

            <Field label="Titre Principal de la page">
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>

            <Field label="Sous-titre / Slogan" span={2}>
              <input
                value={draft.subtitle}
                onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
              />
            </Field>

            <Field label="Image Banniere PNG (en haut de page)" span={2}>
              <input
                value={draft.bannerImage}
                onChange={(e) => setDraft({ ...draft, bannerImage: e.target.value })}
              />
              {draft.bannerImage && (
                <div style={{ marginTop: 10, maxHeight: 140, overflow: "hidden", borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.4)", textAlign: "center" }}>
                  <img
                    src={draft.bannerImage}
                    alt="Apercu banniere"
                    style={{ maxWidth: "100%", maxHeight: 140, objectFit: "contain" }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </Field>
          </div>
        </div>

        {/* 2. TEXTE PRINCIPAL DE L'ASSOCIATION */}
        <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            2. TEXTE PRINCIPAL DE L'ASSOCIATION
          </h4>
          <p className="nafe-empty__text" style={{ fontSize: 12, margin: "0 0 12px" }}>
            Redigez ici la presentation de l'association, son histoire et ses objectifs.
          </p>

          <Field label="Contenu du texte principal">
            <textarea
              rows={8}
              value={draft.mainText}
              onChange={(e) => setDraft({ ...draft, mainText: e.target.value })}
              style={{ fontSize: 14, lineHeight: 1.6 }}
            />
          </Field>
        </div>

        {/* 3. PLACER DES IMAGES PNG SUR LA PAGE */}
        <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h4 className="nafe-display" style={{ margin: 0, fontSize: 16, color: accent }}>
              3. PLACER DES IMAGES PNG SUR LA PAGE ({draft.images.length})
            </h4>
          </div>

          <p className="nafe-empty__text" style={{ fontSize: 12, margin: "0 0 16px" }}>
            Ajoutez des images PNG qui seront disposees sur la page.
          </p>

          {/* Formulaire d'ajout rapide d'image PNG */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(115, 190, 222, 0.25)",
              borderRadius: 6,
              padding: 16,
              marginBottom: 20
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, alignItems: "flex-end" }}>
              <Field label="URL de l'image PNG">
                <input
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                />
              </Field>

              <Field label="Legende / Description">
                <input
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                />
              </Field>

              <Field label="Disposition">
                <select
                  value={newImage.layout}
                  onChange={(e) => setNewImage({ ...newImage, layout: e.target.value })}
                >
                  <option value="center">Centre / Format standard</option>
                  <option value="banner">Pleine largeur (Banniere)</option>
                  <option value="grid">Grille cote a cote</option>
                </select>
              </Field>

              <div>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="nafe-btn nafe-btn--accent"
                  style={{ background: accent, width: "100%", padding: "10px 16px" }}
                >
                  + Placer cette image PNG
                </button>
              </div>
            </div>

            {/* Previsualisation immediate lors de la saisie */}
            {newImage.url && (
              <div style={{ marginTop: 12, padding: 10, background: "rgba(0,0,0,0.5)", borderRadius: 4, textAlign: "center" }}>
                <span className="nafe-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>
                  Apercu de l'image :
                </span>
                <img
                  src={newImage.url}
                  alt="Apercu"
                  style={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain" }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Liste des images deja placees */}
          {draft.images.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px 0", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              Aucune image PNG placee pour le moment.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {draft.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="nafe-clip-card"
                  style={{
                    background: "rgba(19, 24, 33, 0.7)",
                    border: "1px solid rgba(115, 190, 222, 0.18)",
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <div style={{ height: 110, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", borderRadius: 4, overflow: "hidden" }}>
                    <img
                      src={img.url}
                      alt={img.caption || "Image"}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div style={{ margin: "8px 0 10px", width: "100%", textAlign: "center" }}>
                    <span className="nafe-mono" style={{ fontSize: 11, color: "#fff", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {img.caption || "Image " + (idx + 1)}
                    </span>
                    <span className="nafe-mono" style={{ fontSize: 10, color: accent }}>
                      {img.layout === "banner" ? "Pleine largeur" : img.layout === "grid" ? "Grille" : "Centre"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                    style={{ borderColor: "rgba(255,82,82,0.4)", color: "#FF5252", fontSize: 11, width: "100%" }}
                  >
                    Retirer l'image
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. SECTIONS DE TEXTE SUPPLEMENTAIRES */}
        <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            4. SECTIONS DE TEXTE COMPLEMENTAIRES ({draft.textSections.length})
          </h4>
          <p className="nafe-empty__text" style={{ fontSize: 12, margin: "0 0 16px" }}>
            Ajoutez d'autres parties de texte avec leur titre.
          </p>

          {/* Formulaire pour ajouter une section */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(115, 190, 222, 0.25)",
              borderRadius: 6,
              padding: 16,
              marginBottom: 16
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              <Field label="Titre de la section">
                <input
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                />
              </Field>
              <Field label="Texte de la section">
                <textarea
                  rows={4}
                  value={newSection.text}
                  onChange={(e) => setNewSection({ ...newSection, text: e.target.value })}
                />
              </Field>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handleAddSection}
                className="nafe-btn nafe-btn--accent"
                style={{ background: accent, padding: "8px 20px" }}
              >
                + Ajouter cette section de texte
              </button>
            </div>
          </div>

          {/* Liste des sections existantes */}
          {draft.textSections.map((sec, idx) => (
            <div
              key={sec.id || idx}
              className="nafe-clip-card"
              style={{
                background: "rgba(19, 24, 33, 0.6)",
                border: "1px solid rgba(115, 190, 222, 0.15)",
                padding: "16px 18px",
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16
              }}
            >
              <div style={{ flex: 1 }}>
                <strong className="nafe-display" style={{ fontSize: 16, color: "#fff", display: "block", marginBottom: 6 }}>
                  {sec.title || "Section " + (idx + 1)}
                </strong>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                  {sec.text}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSection(sec.id)}
                className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                style={{ borderColor: "rgba(255,82,82,0.4)", color: "#FF5252", fontSize: 11 }}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* 5. BOUTON DE SOUTIEN FINANCIER */}
        <div className="nafe-admin__card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h4 className="nafe-display" style={{ margin: 0, fontSize: 16, color: accent }}>
              5. BOUTON DE SOUTIEN FINANCIER
            </h4>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#fff" }}>
              <input
                type="checkbox"
                checked={draft.donationActive}
                onChange={(e) => setDraft({ ...draft, donationActive: e.target.checked })}
                style={{ width: 18, height: 18 }}
              />
              <span className="nafe-mono" style={{ fontSize: 12 }}>Activer le bouton de don</span>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <Field label="URL de redirection (HelloAsso / Stripe / Cagnotte)" span={2}>
              <input
                value={draft.donationUrl}
                onChange={(e) => setDraft({ ...draft, donationUrl: e.target.value })}
              />
            </Field>

            <Field label="Libelle du bouton de soutien">
              <input
                value={draft.donationButtonText}
                onChange={(e) => setDraft({ ...draft, donationButtonText: e.target.value })}
              />
            </Field>

            <Field label="Note explicative sous le bouton">
              <input
                value={draft.donationNote}
                onChange={(e) => setDraft({ ...draft, donationNote: e.target.value })}
              />
            </Field>
          </div>
        </div>

        {/* Bouton Enregistrer Principal */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
          <button
            type="submit"
            className="nafe-btn nafe-btn--accent"
            style={{ background: accent, padding: "14px 36px", fontSize: 15, fontWeight: 700 }}
          >
            Enregistrer les modifications de la page Association
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================
//  HomeAdmin — Modification des textes de la page de garde (Accueil)
// ============================================================
function HomeAdmin({ accent }) {
  window.store.useVersion();
  const initial = (window.store && window.store.home_settings)
    ? { ...(window.store.DEFAULT_HOME_SETTINGS || {}), ...(window.store.home_settings.get() || {}) }
    : (window.store?.DEFAULT_HOME_SETTINGS || {});

  const [form, setForm] = useAdminState(initial);
  const [toast, setToast] = useAdminState(null);

  useAdminEffect(() => {
    const cur = (window.store && window.store.home_settings)
      ? { ...(window.store.DEFAULT_HOME_SETTINGS || {}), ...(window.store.home_settings.get() || {}) }
      : (window.store?.DEFAULT_HOME_SETTINGS || {});
    setForm(cur);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleValueChange = (idx, field, val) => {
    setForm((prev) => {
      const arr = [...(prev.values || [])];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...prev, values: arr };
    });
  };

  const handleManifestoChange = (idx, field, val) => {
    setForm((prev) => {
      const arr = [...(prev.manifestoItems || [])];
      arr[idx] = { ...arr[idx], [field]: val };
      return { ...prev, manifestoItems: arr };
    });
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (window.store && window.store.home_settings) {
      window.store.home_settings.set(form);
      showToast("Modifications de la page de garde enregistrees avec succes.");
    }
  };

  const handleReset = () => {
    if (window.store && window.store.resetHomeSettings) {
      window.store.resetHomeSettings();
      setForm(window.store.DEFAULT_HOME_SETTINGS);
      showToast("Textes par defaut de la page d'accueil retablis.");
    }
  };

  return (
    <div className="nafe-admin-section">
      <div className="nafe-admin__head" style={{ marginBottom: 20 }}>
        <div>
          <span className="nafe-mono" style={{ color: accent, fontSize: 11, letterSpacing: "0.1em" }}>
            PANEL DE GESTION · PAGE DE GARDE
          </span>
          <h2 className="nafe-display" style={{ fontSize: 24, margin: "4px 0 6px" }}>
            MODIFICATION DES TEXTES DE L'ACCUEIL<span style={{ color: accent }}>.</span>
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Modifiez directement le contenu de chaque texte pose sur la page d'accueil sans alterer sa structure.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <a
            href="#/"
            className="nafe-btn nafe-btn--ghost nafe-btn--sm"
          >
            Voir la page d'accueil
          </a>
          <button
            type="button"
            className="nafe-btn nafe-btn--ghost nafe-btn--sm"
            onClick={handleReset}
          >
            Retablir les textes d'origine
          </button>
          <button
            type="button"
            className="nafe-btn nafe-btn--accent nafe-btn--sm"
            style={{ background: accent }}
            onClick={handleSave}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>

      {toast && (
        <div
          className="nafe-clip-card"
          style={{
            background: "rgba(2, 136, 209, 0.15)",
            border: `1px solid ${accent}`,
            padding: "12px 18px",
            marginBottom: 20,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600
          }}
        >
          {toast}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* 1. SECTION HERO & EN-TETE */}
        <div className="nafe-admin__card" style={{ marginBottom: 24 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            1. SECTION HERO & EN-TETE
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Field label="Surtitre / Saison" span={2}>
              <input
                value={form.heroEyebrow || ""}
                onChange={(e) => handleField("heroEyebrow", e.target.value)}
              />
            </Field>

            <Field label="Texte d'accroche principal (Lede)" span={2}>
              <textarea
                rows={3}
                value={form.heroLede || ""}
                onChange={(e) => handleField("heroLede", e.target.value)}
              />
            </Field>

            <Field label="Intitule du bouton principal (CTA 1)">
              <input
                value={form.heroCtaPrimary || ""}
                onChange={(e) => handleField("heroCtaPrimary", e.target.value)}
              />
            </Field>

            <Field label="Intitule du bouton secondaire (CTA 2)">
              <input
                value={form.heroCtaSecondary || ""}
                onChange={(e) => handleField("heroCtaSecondary", e.target.value)}
              />
            </Field>

            <Field label="Libelle Statistique 1">
              <input
                value={form.heroStat1Label || ""}
                onChange={(e) => handleField("heroStat1Label", e.target.value)}
              />
            </Field>

            <Field label="Libelle Statistique 2">
              <input
                value={form.heroStat2Label || ""}
                onChange={(e) => handleField("heroStat2Label", e.target.value)}
              />
            </Field>

            <Field label="Libelle Statistique 3">
              <input
                value={form.heroStat3Label || ""}
                onChange={(e) => handleField("heroStat3Label", e.target.value)}
              />
            </Field>

            <Field label="Titre encart quand aucun match live n'est en cours">
              <input
                value={form.emptyLiveTitle || ""}
                onChange={(e) => handleField("emptyLiveTitle", e.target.value)}
              />
            </Field>

            <Field label="Message public quand aucun match live n'est en cours" span={2}>
              <input
                value={form.emptyLiveTextUser || ""}
                onChange={(e) => handleField("emptyLiveTextUser", e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* 2. SECTION PHILOSOPHIE & LES 4 PILIERS */}
        <div className="nafe-admin__card" style={{ marginBottom: 24 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            2. SECTION PHILOSOPHIE & LES 4 PILIERS DE VALEURS
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            <Field label="Surtitre de section">
              <input
                value={form.valuesEyebrow || ""}
                onChange={(e) => handleField("valuesEyebrow", e.target.value)}
              />
            </Field>

            <Field label="Titre principal">
              <input
                value={form.valuesTitle || ""}
                onChange={(e) => handleField("valuesTitle", e.target.value)}
              />
            </Field>

            <Field label="Sous-titre descriptif" span={2}>
              <textarea
                rows={2}
                value={form.valuesSubtitle || ""}
                onChange={(e) => handleField("valuesSubtitle", e.target.value)}
              />
            </Field>
          </div>

          <span className="nafe-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 12 }}>
            LES 4 PILIERS OFFICIELS
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {(form.values || []).map((val, idx) => (
              <div
                key={idx}
                className="nafe-clip-card"
                style={{
                  background: "rgba(19, 24, 33, 0.6)",
                  border: "1px solid rgba(115, 190, 222, 0.15)",
                  padding: "16px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span className="nafe-mono" style={{ fontSize: 11, color: accent }}>
                    PILIER {val.num || ("0" + (idx + 1))}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Field label="Titre du pilier">
                    <input
                      value={val.title || ""}
                      onChange={(e) => handleValueChange(idx, "title", e.target.value)}
                    />
                  </Field>
                  <Field label="Description du pilier">
                    <textarea
                      rows={3}
                      value={val.desc || ""}
                      onChange={(e) => handleValueChange(idx, "desc", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SECTION FIL TWITTER / X */}
        <div className="nafe-admin__card" style={{ marginBottom: 24 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            3. SECTION RESEAUX SOCIAUX & FIL D'ACTUALITES
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <Field label="Surtitre">
              <input
                value={form.tweetsEyebrow || ""}
                onChange={(e) => handleField("tweetsEyebrow", e.target.value)}
              />
            </Field>

            <Field label="Titre principal">
              <input
                value={form.tweetsTitle || ""}
                onChange={(e) => handleField("tweetsTitle", e.target.value)}
              />
            </Field>

            <Field label="Intitule du bouton vers les actualites">
              <input
                value={form.tweetsCtaNews || ""}
                onChange={(e) => handleField("tweetsCtaNews", e.target.value)}
              />
            </Field>

            <Field label="Intitule du bouton suivre sur Twitter / X">
              <input
                value={form.tweetsCtaFollow || ""}
                onChange={(e) => handleField("tweetsCtaFollow", e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* 4. SECTION MANIFESTE (BAS DE PAGE) */}
        <div className="nafe-admin__card" style={{ marginBottom: 24 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            4. SECTION MANIFESTE (BAS DE PAGE)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
            <Field label="Surtitre du manifeste">
              <input
                value={form.manifestoEyebrow || ""}
                onChange={(e) => handleField("manifestoEyebrow", e.target.value)}
              />
            </Field>

            <Field label="Titre - Premiere phrase">
              <input
                value={form.manifestoTitleLine1 || ""}
                onChange={(e) => handleField("manifestoTitleLine1", e.target.value)}
              />
            </Field>

            <Field label="Titre - Deuxieme phrase" span={2}>
              <input
                value={form.manifestoTitleLine2 || ""}
                onChange={(e) => handleField("manifestoTitleLine2", e.target.value)}
              />
            </Field>
          </div>

          <span className="nafe-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 12 }}>
            LES 3 POINTS DU MANIFESTE
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {(form.manifestoItems || []).map((item, idx) => (
              <div
                key={idx}
                className="nafe-clip-card"
                style={{
                  background: "rgba(19, 24, 33, 0.6)",
                  border: "1px solid rgba(115, 190, 222, 0.15)",
                  padding: "16px"
                }}
              >
                <div style={{ marginBottom: 10 }}>
                  <span className="nafe-mono" style={{ fontSize: 11, color: accent }}>
                    POINT {item.num || ("0" + (idx + 1))}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Field label="Titre">
                    <input
                      value={item.title || ""}
                      onChange={(e) => handleManifestoChange(idx, "title", e.target.value)}
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={item.desc || ""}
                      onChange={(e) => handleManifestoChange(idx, "desc", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton Enregistrer Principal */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <button
            type="button"
            className="nafe-btn nafe-btn--ghost"
            onClick={handleReset}
          >
            Retablir les textes d'origine
          </button>
          <button
            type="submit"
            className="nafe-btn nafe-btn--accent"
            style={{ background: accent, padding: "14px 36px", fontSize: 15, fontWeight: 700 }}
          >
            Enregistrer toutes les modifications
          </button>
        </div>
      </form>
    </div>
  );
}


window.AdminPage = AdminPage;
