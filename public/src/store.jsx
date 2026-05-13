// NAFE — localStorage-backed CRUD store
// Source unique de vérité pour tout contenu visible côté user.
// L'espace /admin manipule ces données, les pages publiques les lisent.

(function () {
  const KEYS = {
    players:  "nafe:players",
    matches:  "nafe:matches",
    news:     "nafe:news",
    scores:   "nafe:scores",
    trophies: "nafe:trophies",
    subteams: "nafe:subteams",
    users:    "nafe:users",
    session:  "nafe:session",
    posts:    "nafe:posts",
    socials:  "nafe:socials",
    comments: "nafe:comments",
    shop:     "nafe:shop",
    predictions: "nafe:predictions",
    badges:   "nafe:badges",
  };

  const uid = (p) =>
    `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  function read(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }

  function write(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent("store:update", { detail: { key } }));
  }

  function crud(key, prefix) {
    return {
      list: () => read(key),
      get: (id) => read(key).find((x) => x.id === id),
      add: (item) => {
        const all = read(key);
        const id = item.id || uid(prefix);
        const row = { ...item, id, createdAt: item.createdAt || Date.now() };
        all.push(row);
        write(key, all);
        return row;
      },
      update: (id, patch) => {
        const all = read(key).map((x) => (x.id === id ? { ...x, ...patch } : x));
        write(key, all);
      },
      remove: (id) => {
        write(
          key,
          read(key).filter((x) => x.id !== id)
        );
      },
      clear: () => write(key, []),
    };
  }

  const players  = crud(KEYS.players,  "pl");
  const matches  = crud(KEYS.matches,  "mt");
  const news     = crud(KEYS.news,     "nw");
  const scores   = crud(KEYS.scores,   "sc");
  const trophies = crud(KEYS.trophies, "tr");
  const subteams = crud(KEYS.subteams, "st");
  const users    = crud(KEYS.users,    "us");
  const posts    = crud(KEYS.posts,    "po");
  const socials  = crud(KEYS.socials,  "sl");
  const comments = crud(KEYS.comments, "cm");
  const shop     = crud(KEYS.shop,     "sh");
  const predictions = crud(KEYS.predictions, "pr");
  const badges      = crud(KEYS.badges,      "bd");

  // --- Session (single object, not a list) ---
  const session = {
    get: () => {
      try {
        const raw = localStorage.getItem(KEYS.session);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    set: (val) => {
      if (val === null) localStorage.removeItem(KEYS.session);
      else localStorage.setItem(KEYS.session, JSON.stringify(val));
      window.dispatchEvent(new CustomEvent("store:update", { detail: { key: KEYS.session } }));
    },
    clear: () => session.set(null),
  };

  const store = {
    KEYS,
    uid,
    players,
    matches,
    news,
    scores,
    trophies,
    subteams,
    users,
    posts,
    socials,
    comments,
    shop,
    predictions,
    badges,
    session,

    // --- queries croisées utilisées par les pages publiques ---
    getPlayersByTeam: (team, subteamId) => {
      const all = players.list().filter((p) => p.team === team);
      if (subteamId === undefined) return all;
      if (subteamId === null || subteamId === "") return all.filter((p) => !p.subteam);
      return all.filter((p) => p.subteam === subteamId);
    },

    getSubteamsByTeam: (team) =>
      subteams.list().filter((s) => s.parent === team),

    getTrophiesByTeam: (team) =>
      trophies.list().filter((t) => t.team === team),

    // --- Auth helpers ---
    currentUser: () => {
      const s = session.get();
      if (!s) return null;
      return users.list().find((u) => u.id === s.userId) || null;
    },

    isAdmin: () => {
      const u = store.currentUser && store.currentUser();
      return !!(u && u.role === "admin");
    },

    register: ({ email, username, password }) => {
      const list = users.list();
      if (list.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Un compte existe déjà avec cet email.");
      }
      if (list.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error("Ce nom d'utilisateur est déjà pris.");
      }
      // Premier compte enregistré → admin automatique (bootstrap)
      const role = list.length === 0 ? "admin" : "user";
      const user = users.add({
        email: email.trim(),
        username: username.trim(),
        // NOTE : hash volontairement simpliste (prototype local, pas de backend).
        // À remplacer par un vrai hash côté serveur quand on brancha Supabase/Next API.
        passwordHash: btoa(unescape(encodeURIComponent(password))),
        role,
        xp: 0,
        badges: [],
      });
      session.set({ userId: user.id });
      return user;
    },

    login: ({ email, password }) => {
      const hash = btoa(unescape(encodeURIComponent(password)));
      const user = users.list().find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash
      );
      if (!user) throw new Error("Email ou mot de passe incorrect.");
      session.set({ userId: user.id });
      return user;
    },

    logout: () => session.clear(),

    promoteToAdmin: (id) => users.update(id, { role: "admin" }),
    demoteToUser:   (id) => users.update(id, { role: "user" }),

    // --- XP & Gamification ---
    addXp: (userId, amount) => {
      const u = users.get(userId);
      if (!u) return;
      users.update(userId, { xp: (u.xp || 0) + amount });
    },

    getLevel: (xp) => {
      // Level formula: floor(sqrt(xp / 50)) + 1
      // Level 1 = 0 xp, Level 2 = 50 xp, Level 3 = 200 xp, etc.
      return Math.floor(Math.sqrt((xp || 0) / 50)) + 1;
    },

    getNextLevelXp: (level) => {
      return Math.pow(level, 2) * 50;
    },

    grantBadge: (userId, badgeId) => {
      const u = users.get(userId);
      if (!u) return;
      const b = badges.get(badgeId);
      if (!b) return;
      const current = u.badges || [];
      if (current.includes(badgeId)) return;
      users.update(userId, { badges: [...current, badgeId] });
      // Granting a badge gives 100 XP
      store.addXp(userId, 100);
    },

    // --- Predictions ---
    votePrediction: (predictionId, userId, optionId) => {
      const p = predictions.get(predictionId);
      if (!p) return;
      const votes = p.votes || [];
      // Remove previous vote by same user if any
      const nextVotes = votes.filter(v => v.userId !== userId);
      nextVotes.push({ userId, optionId, createdAt: Date.now() });
      predictions.update(predictionId, { votes: nextVotes });
      // Voting gives 10 XP
      store.addXp(userId, 10);
    },

    getUserPredictions: (userId) => {
      return predictions.list().filter(p => 
        (p.votes || []).some(v => v.userId === userId)
      );
    },

    getLiveMatch: () =>
      matches.list().find((m) => m.status === "live"),

    getUpcomingMatches: (limit = 8) =>
      matches
        .list()
        .filter((m) => m.status === "soon" || m.status === "live")
        .sort((a, b) =>
          `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
        )
        .slice(0, limit),

    getFeaturedNews: () =>
      news.list().find((n) => n.featured) ||
      news.list().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0],

    // --- seed de démonstration facultatif ---
    seedDemo: () => {
      if (players.list().length > 0) return;
      players.add({ team: "valorant", name: "Exemple",  tag: "exemple",  role: "Duelist", jersey: 7, kd: 0, country: "FR", hs: 0, acs: 0 });
      matches.add({ date: new Date().toISOString().slice(0,10), time: "20:00", game: "VAL", event: "Événement exemple", opp: "Adversaire", result: "À venir", status: "soon", loc: "En ligne" });
      news.add({ date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(), cat: "Annonce", game: "CLUB", title: "Premier post de test", lede: "Crée, modifie ou supprime cette actu depuis l'espace Admin.", author: "Staff", readTime: "1 min", featured: true });
    },

    // Migration : renomme les clés de jeu obsolètes dans les collections existantes
    migrate: () => {
      const RENAMES = { lol: "rl" }; // ancien slug → nouveau slug
      let dirty = false;
      [players, matches, trophies, subteams].forEach((col) => {
        const all = col.list();
        const patched = all.map((x) => {
          const next = RENAMES[x.team];
          if (next) { dirty = true; return { ...x, team: next }; }
          const nextParent = RENAMES[x.parent];
          if (nextParent) { dirty = true; return { ...x, parent: nextParent }; }
          const nextGame = RENAMES[x.game?.toLowerCase()];
          if (nextGame) { dirty = true; return { ...x, game: x.game?.toUpperCase?.() === "LOL" ? "RL" : x.game }; }
          return x;
        });
        if (dirty) col.clear && patched.forEach((r) => { /* handled below */ });
      });
      // Écriture directe pour éviter d'émettre des events inutiles
      [
        [KEYS.players,  players.list()],
        [KEYS.matches,  matches.list()],
        [KEYS.trophies, trophies.list()],
        [KEYS.subteams, subteams.list()],
      ].forEach(([key, all]) => {
        const patched = all.map((x) => {
          if (RENAMES[x.team])   return { ...x, team:   RENAMES[x.team] };
          if (RENAMES[x.parent]) return { ...x, parent: RENAMES[x.parent] };
          return x;
        });
        const changed = patched.some((p, i) => p !== all[i]);
        if (changed) localStorage.setItem(key, JSON.stringify(patched));
      });
    },

    wipeAll: () => {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      window.dispatchEvent(new CustomEvent("store:update", { detail: { key: "*" } }));
    },

    subscribe: (cb) => {
      window.addEventListener("store:update", cb);
      return () => window.removeEventListener("store:update", cb);
    },

    // Hook React : force un re-render à chaque update du store
    useVersion: () => {
      const [v, setV] = React.useState(0);
      React.useEffect(() => {
        const cb = () => setV((x) => x + 1);
        window.addEventListener("store:update", cb);
        return () => window.removeEventListener("store:update", cb);
      }, []);
      return v;
    },
  };

  window.store = store;
})();
