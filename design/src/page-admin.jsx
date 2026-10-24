// NAFE — Admin console (localStorage CRUD UI)
// Routes gérées : /admin, /admin/players, /admin/matches, /admin/news, /admin/scores, /admin/trophies

const { useState: useAdminState, useEffect: useAdminEffect } = React;

const ADMIN_TABS = [
  { k: "players",   label: "Joueurs",             icon: "◈" },
  { k: "subteams",  label: "Sous-équipes",        icon: "◇" },
  { k: "matches",   label: "Matchs & calendrier", icon: "▦" },
  { k: "news",      label: "Actualités",          icon: "▤" },
  { k: "scores",    label: "Ticker scores",       icon: "▲" },
  { k: "trophies",    label: "Palmarès",            icon: "✦" },
  { k: "sponsors",    label: "Sponsors",            icon: "★" },
  { k: "association", label: "L'Association",       icon: "⚑" },
  { k: "socials",     label: "Réseaux sociaux",     icon: "●" },
  { k: "community", label: "Communauté",          icon: "◆" },
  { k: "users",     label: "Utilisateurs",        icon: "⚙" },
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
                    ⚡ Se connecter
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
              ⚡ Déverrouiller la console admin (AdminNAFE)
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
              ⚡ Promouvoir mon compte "{user.username}" en Admin
            </button>
            <button
              className="nafe-btn nafe-btn--ghost"
              onClick={() => window.store.loginAsAdmin("admin@nafe.gg")}
            >
              ⚡ Basculer sur AdminNAFE
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
                placeholder="Ex: Rezpaaan (si Duo ou Trio)"
              />
            </Field>
            <Field label="Power Ranking (PR)">
              <input
                type="number"
                value={draft.pr || 0}
                onChange={(e) => setDraft({ ...draft, pr: e.target.value })}
                placeholder="Ex: 12450"
              />
            </Field>
            <Field label="Meilleure Perf / Classement">
              <input
                value={draft.bestRank || ""}
                onChange={(e) => setDraft({ ...draft, bestRank: e.target.value })}
                placeholder="Ex: Top 42 EU - FNCS Div 1"
              />
            </Field>
          </>
        )}
        <Field label="Numéro">
          <input type="number" min={0} max={99} value={draft.jersey}
            onChange={(e) => setDraft({ ...draft, jersey: e.target.value })} />
        </Field>
        <Field label="Nom de scène">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ex: Derke ou Twigz" />
        </Field>
        <Field label="Pseudo (@tag)">
          <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} placeholder="Ex: derke ou twigzfn" />
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
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Ex: NAFE VALORANT : LE DOCUMENTAIRE" />
          </Field>

          {isVideo && (
            <Field label="Lien Vidéo (URL)" span={2}>
              <input value={draft.url || ""} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
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
          { key: "url", label: "URL", flex: 1, render: (r) => r.url ? <a href={r.url} target="_blank" style={{ color: accent }}>Lien ↗</a> : "—" },
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
//  Association Admin (Page Simple Unifiée : Titre, Textes, Images PNG)
// ============================================================
function AssociationAdmin({ accent }) {
  window.store.useVersion();
  const settings = (window.store.association_settings && window.store.association_settings.get()) || {};

  // État local du formulaire de la page
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
    donationButtonText: settings.donationButtonText || settings.donationButtonLabel || "Soutenir l'Association (HelloAsso) ↗",
    donationNote: settings.donationNote || settings.donationDesc || "",
  });

  // État pour ajouter une nouvelle image PNG
  const [newImage, setNewImage] = useAdminState({
    url: "",
    caption: "",
    layout: "center", // "banner" | "center" | "grid"
  });

  // État pour ajouter une section de texte complémentaire (ex: Termes, Règlement...)
  const [newSection, setNewSection] = useAdminState({
    title: "",
    text: "",
  });

  const [saveSuccess, setSaveSuccess] = useAdminState(false);

  // Synchroniser si le store change (ex: suite à un seed ou clear)
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
      donationButtonText: settings.donationButtonText || settings.donationButtonLabel || "Soutenir l'Association (HelloAsso) ↗",
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
      {/* Barre d'action et d'en-tête */}
      <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 className="nafe-display" style={{ margin: 0, fontSize: 18 }}>
              PAGE ASSOCIATION (LOI 1901)
            </h3>
            <p className="nafe-empty__text" style={{ margin: "4px 0 0", fontSize: 13 }}>
              Page unique et directe : configurez le titre, rédigez vos textes, placez vos images PNG et activez le bouton de don.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="#/association"
              target="_blank"
              rel="noreferrer"
              className="nafe-btn nafe-btn--ghost nafe-btn--sm"
            >
              ↗ Voir la page publique
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
              ⚡ Charger un exemple complet
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
              🗑 Vider toute la page
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
            ✓ Modifications de la page Association enregistrées avec succès !
          </div>
        )}
      </div>

      <form onSubmit={saveAll}>
        {/* 1. TITRE ET EN-TÊTE DE LA PAGE */}
        <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            1. TITRE ET EN-TÊTE DE LA PAGE
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            <Field label="Surtitre / Badge">
              <input
                value={draft.badge}
                onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                placeholder="Ex: ASSOCIATION LOI 1901"
              />
            </Field>

            <Field label="Titre Principal de la page">
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Ex: L'ASSOCIATION NAFE"
              />
            </Field>

            <Field label="Sous-titre / Slogan" span={2}>
              <input
                value={draft.subtitle}
                onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                placeholder="Ex: Structure esportive associative & communauté compétitive"
              />
            </Field>

            <Field label="Image Bannière PNG (en haut de page)" span={2}>
              <input
                value={draft.bannerImage}
                onChange={(e) => setDraft({ ...draft, bannerImage: e.target.value })}
                placeholder="URL de l'image PNG (ex: assets/brand/banner_nafe.png ou https://...)"
              />
              {draft.bannerImage && (
                <div style={{ marginTop: 10, maxHeight: 140, overflow: "hidden", borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.4)", textAlign: "center" }}>
                  <img
                    src={draft.bannerImage}
                    alt="Aperçu bannière"
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
            Rédigez ici la présentation de l'association, son histoire et ses objectifs. Les doubles retours à la ligne créent des paragraphes nets. Les lignes débutant par <code>•</code> créent des puces et les lignes avec <code>## Titre</code> créent des sous-titres.
          </p>

          <Field label="Contenu du texte principal">
            <textarea
              rows={8}
              value={draft.mainText}
              onChange={(e) => setDraft({ ...draft, mainText: e.target.value })}
              placeholder="Rédigez la présentation de l'association..."
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
            Ajoutez des images PNG (logos, affiches, photos d'équipe découpées) qui seront disposées élégamment sur la page.
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
                  placeholder="https://... ou assets/brand/..."
                />
              </Field>

              <Field label="Légende / Description">
                <input
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  placeholder="Ex: Logo officiel de l'association"
                />
              </Field>

              <Field label="Disposition">
                <select
                  value={newImage.layout}
                  onChange={(e) => setNewImage({ ...newImage, layout: e.target.value })}
                >
                  <option value="center">Centré / Format standard</option>
                  <option value="banner">Pleine largeur (Bannière)</option>
                  <option value="grid">Grille côte à côte</option>
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

            {/* Prévisualisation immédiate lors de la saisie */}
            {newImage.url && (
              <div style={{ marginTop: 12, padding: 10, background: "rgba(0,0,0,0.5)", borderRadius: 4, textAlign: "center" }}>
                <span className="nafe-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>
                  Aperçu de l'image :
                </span>
                <img
                  src={newImage.url}
                  alt="Aperçu"
                  style={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain" }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Liste des images déjà placées */}
          {draft.images.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px 0", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              Aucune image PNG placée pour le moment.
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
                      {img.layout === "banner" ? "Pleine largeur" : img.layout === "grid" ? "Grille" : "Centré"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                    style={{ borderColor: "rgba(255,82,82,0.4)", color: "#FF5252", fontSize: 11, width: "100%" }}
                  >
                    ✕ Retirer l'image
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. SECTIONS DE TEXTE SUPPLÉMENTAIRES (Termes, Statuts, Règlement...) */}
        <div className="nafe-admin__card" style={{ marginBottom: 20 }}>
          <h4 className="nafe-display" style={{ margin: "0 0 16px", fontSize: 16, color: accent }}>
            4. SECTIONS DE TEXTE COMPLÉMENTAIRES (Termes, Règlement, etc.) ({draft.textSections.length})
          </h4>
          <p className="nafe-empty__text" style={{ fontSize: 12, margin: "0 0 16px" }}>
            Ajoutez d'autres parties de texte avec leur titre (par exemple pour détailler les termes légaux ou les modalités d'adhésion).
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
                  placeholder="Ex: TERMES ET CONDITIONS / RÈGLEMENT INTÉRIEUR"
                />
              </Field>
              <Field label="Texte de la section">
                <textarea
                  rows={4}
                  value={newSection.text}
                  onChange={(e) => setNewSection({ ...newSection, text: e.target.value })}
                  placeholder="Contenu de la section (accepte retours à la ligne et puces •)..."
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
                ✕ Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* 5. BOUTON DE SOUTIEN FINANCIER (DON HELLOASSO) */}
        <div className="nafe-admin__card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h4 className="nafe-display" style={{ margin: 0, fontSize: 16, color: accent }}>
              5. BOUTON DE SOUTIEN FINANCIER (DON LOI 1901)
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
                placeholder="https://www.helloasso.com/associations/..."
              />
            </Field>

            <Field label="Libellé du bouton de soutien">
              <input
                value={draft.donationButtonText}
                onChange={(e) => setDraft({ ...draft, donationButtonText: e.target.value })}
                placeholder="Ex: Soutenir l'Association (HelloAsso) ↗"
              />
            </Field>

            <Field label="Note explicative sous le bouton">
              <input
                value={draft.donationNote}
                onChange={(e) => setDraft({ ...draft, donationNote: e.target.value })}
                placeholder="Ex: Association à but non lucratif · 100% réinvesti dans nos équipes"
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
            💾 Enregistrer les modifications de la page Association
          </button>
        </div>
      </form>
    </div>
  );
}


window.AdminPage = AdminPage;

