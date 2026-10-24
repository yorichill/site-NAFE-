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
    sponsors: "nafe:sponsors",
    sponsors_settings: "nafe:sponsors_settings",
    association_settings: "nafe:association_settings",
    association_blocks: "nafe:association_blocks",
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

  function single(key, defaultVal = {}) {
    return {
      get: () => {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return { ...defaultVal };
          const v = JSON.parse(raw);
          return (typeof v === "object" && v !== null && !Array.isArray(v)) ? { ...defaultVal, ...v } : { ...defaultVal };
        } catch {
          return { ...defaultVal };
        }
      },
      set: (val) => {
        localStorage.setItem(key, JSON.stringify(val));
        window.dispatchEvent(new CustomEvent("store:update", { detail: { key } }));
      },
      update: (patch) => {
        const cur = single(key, defaultVal).get();
        const next = { ...cur, ...patch };
        localStorage.setItem(key, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("store:update", { detail: { key } }));
        return next;
      },
      clear: () => {
        localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent("store:update", { detail: { key } }));
      }
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
  const sponsors    = crud(KEYS.sponsors,    "sp");
  const association_blocks = crud(KEYS.association_blocks, "ab");

  const sponsors_settings    = single(KEYS.sponsors_settings, {});
  const association_settings = single(KEYS.association_settings, {});

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

  const DEFAULT_SPONSORS_SETTINGS = {
    heroEyebrow: "Écosystème & Partenariats Officiels",
    heroTitle: "NOS SPONSORS",
    heroLede: "Découvrez les marques et partenaires d'élite qui propulsent nos rosters vers les sommets.",
    ctaTitle: "DEVENEZ PARTENAIRE",
    ctaDesc: "Associez votre marque à l'esprit de conquête de NAFE ESPORT.",
    ctaButtonLabel: "Dossier Partenariat →",
    ctaButtonUrl: "#/contact",
    footerNotice: "PARTENARIAT SAISON 2026 · CERTIFIÉ NAFE ESPORT"
  };

  const DEFAULT_ASSOCIATION_SETTINGS = {
    heroBadge: "STRUCTURE ASSOCIATIVE OFFICIELLE",
    heroTitle: "L'ASSOCIATION NAFE",
    heroLede: "NAFE ESPORT est une association française régie par la loi du 1er juillet 1901. Fondée par des passionnés, notre mission est de structurer, former et accompagner les talents de l'esport.",
    statutLegal: "Loi 1901",
    devise: "Le Phœnix ne meurt jamais",
    transparence: "100% Réinvesti",
    donationActive: true,
    donationEyebrow: "// IMPACT DIRECT & SOLIDAIRE",
    donationTitle: "SOUTENIR L'ASSOCIATION FINANCIÈREMENT",
    donationDesc: "NAFE ESPORT fonctionne grâce à la passion de ses bénévoles et à la générosité de ses supporters. Vos contributions permettent directement de financer les déplacements en LAN, les maillots et les entraînements.",
    donationUrl: "https://www.helloasso.com",
    donationButtonLabel: "Accéder au formulaire de don sécurisé ↗",
    donationNotice: "Paiement 100% sécurisé via HelloAsso · Reçu et attestation fournis",
    donationPledges: [
      { id: "p1", amount: 10, label: "Supporter", perk: "Badge Discord exclusif & accès aux salons privés" },
      { id: "p2", amount: 25, label: "Adhérent", perk: "Pack stickers officiels + vote consultatif assemblée" },
      { id: "p3", amount: 50, label: "Bienfaiteur", perk: "Nom crédité au générique des vidéos + jersey dédicacé" },
      { id: "custom", amount: 25, label: "Don libre", perk: "Chaque euro contribue directement aux déplacements" }
    ],
    donationImpact: [
      { label: "Déplacements LAN", desc: "Transport & hébergement pour les compétitions physiques", pct: 45 },
      { label: "Équipement & Maillots", desc: "Jerseys officiels personnalisés & matériel gaming", pct: 30 },
      { label: "Infrastructures & Serveurs", desc: "Serveurs d'entraînement, scrims & outils", pct: 15 },
      { label: "Vie du Club", desc: "Animation de la communauté, tournois ouverts & streams", pct: 10 }
    ]
  };

  const DEFAULT_ASSOCIATION_BLOCKS = [
    {
      id: "ab_pillars",
      order: 1,
      active: true,
      type: "pillars",
      eyebrow: "Objectifs 2026",
      title: "NOS MISSIONS",
      subtitle: "4 PILIERS ASSOCIATIFS",
      content: "",
      items: [
        { num: "01 //", title: "Encadrement & Pédagogie", desc: "Suivi personnalisé de chaque joueur : analyse tactique, préparation mentale et équilibre de vie face aux écrans." },
        { num: "02 //", title: "Accès à la Compétition", desc: "Financement des inscriptions aux tournois majeurs, frais de déplacement et logistique lors des LANs physiques en France et en Europe." },
        { num: "03 //", title: "Matériel & Infrastructure", desc: "Mise à disposition de maillots officiels, serveurs d'entraînement dédiés et accompagnement pour les joueurs méritants." },
        { num: "04 //", title: "Transparence & Gestion", desc: "100% des fonds perçus (cotisations, dons, gains de tournois réinvestis) sont alloués au projet sportif et au bien-être de nos membres." }
      ]
    },
    {
      id: "ab_terms",
      order: 2,
      active: true,
      type: "terms",
      eyebrow: "Règlement Intérieur & Statuts",
      title: "TERMES DE L'ASSOCIATION",
      subtitle: "CHARTE LOI 1901",
      content: "Toute adhésion, partenariat ou participation aux activités de NAFE ESPORT implique l'adhésion pleine et entière à notre charte éthique et à nos statuts déposés.",
      items: [
        { num: "Article 1", title: "Engagement & Esprit Sportif", text: "Tout membre représentant NAFE s'engage à respecter les principes du fair-play, de courtoisie et de respect mutuel en jeu et sur les réseaux sociaux. Aucune forme de toxicité, harcèlement ou discrimination n'est tolérée." },
        { num: "Article 2", title: "Transparence Financière", text: "L'association garantit la stricte affectation de chaque euro perçu au développement de la structure, des joueurs et des événements du club. Les comptes sont approuvés annuellement en assemblée générale." },
        { num: "Article 3", title: "Statut des Joueurs & Staff", text: "Les membres associatifs contribuent bénévolement à la vie du club. Les gains obtenus en compétition sont redistribués selon la charte d'équipe approuvée avant chaque saison sportive." },
        { num: "Article 4", title: "Adhésion & Révocation", text: "L'adhésion est ouverte à toute personne partageant les valeurs du club. Le bureau directeur se réserve le droit d'exclure tout membre manquant gravement au règlement intérieur de l'association." }
      ]
    },
    {
      id: "ab_cta",
      order: 3,
      active: true,
      type: "cta",
      eyebrow: "Rejoindre l'aventure",
      title: "Envie de vous investir comme bénévole ou membre ?",
      subtitle: "",
      content: "Coachs, managers, casters, graphistes et bénévoles : notre association recrute constamment pour développer ses projets esportifs.",
      buttonLabel: "Nous Contacter →",
      buttonUrl: "#/contact",
      button2Label: "Faire un don à l'association ↗",
      button2Url: "https://www.helloasso.com",
      items: []
    }
  ];

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
    sponsors,
    sponsors_settings,
    association_blocks,
    association_settings,
    session,

    // Modèles configurables
    DEFAULT_SPONSORS_SETTINGS,
    DEFAULT_ASSOCIATION_SETTINGS,
    DEFAULT_ASSOCIATION_BLOCKS,

    seedSponsorsTemplate: () => {
      sponsors.clear();
      sponsors_settings.set(DEFAULT_SPONSORS_SETTINGS);
      if (window.DEFAULT_SPONSORS) {
        window.DEFAULT_SPONSORS.forEach(sp => sponsors.add(sp));
      }
    },
    clearSponsors: () => {
      sponsors.clear();
      sponsors_settings.clear();
    },
    seedAssociationTemplate: () => {
      association_blocks.clear();
      association_settings.set(DEFAULT_ASSOCIATION_SETTINGS);
      DEFAULT_ASSOCIATION_BLOCKS.forEach(b => association_blocks.add(b));
    },
    clearAssociation: () => {
      association_blocks.clear();
      association_settings.clear();
    },

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

    // --- Auth helpers & Injected Admins ---
    DEFAULT_ADMINS: [
      {
        id: "us_admin_nafe",
        email: "admin@nafe.gg",
        username: "AdminNAFE",
        password: "admin2026",
        role: "admin",
        title: "Administrateur Principal",
        xp: 12500,
        badges: ["Premier Pas", "Staff NAFE", "Pronostiqueur", "Fidèle"]
      },
      {
        id: "us_staff_nafe",
        email: "staff@nafe.gg",
        username: "StaffNAFE",
        password: "staff2026",
        role: "admin",
        title: "Staff & Modération",
        xp: 8500,
        badges: ["Premier Pas", "Staff NAFE"]
      },
      {
        id: "us_direction_nafe",
        email: "direction@nafe.gg",
        username: "Mathia",
        password: "nafe2026",
        role: "admin",
        title: "Direction & Fondateur",
        xp: 15000,
        badges: ["Premier Pas", "Staff NAFE", "Fondateur"]
      }
    ],

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
        passwordHash: btoa(unescape(encodeURIComponent(password))),
        role,
        xp: 0,
        badges: [],
      });
      session.set({ userId: user.id });
      return user;
    },

    seedAdmins: () => {
      const currentUsers = users.list();
      const accounts = store.DEFAULT_ADMINS || [];
      accounts.forEach((adm) => {
        const hash = btoa(unescape(encodeURIComponent(adm.password)));
        const idx = currentUsers.findIndex(
          (u) =>
            u.id === adm.id ||
            u.email.toLowerCase() === adm.email.toLowerCase() ||
            u.username.toLowerCase() === adm.username.toLowerCase()
        );
        if (idx === -1) {
          users.add({
            id: adm.id,
            email: adm.email,
            username: adm.username,
            passwordHash: hash,
            role: "admin",
            xp: adm.xp,
            badges: adm.badges,
            createdAt: Date.now() - 30 * 86400000,
          });
        } else {
          const existing = currentUsers[idx];
          if (existing.role !== "admin" || !existing.passwordHash) {
            users.update(existing.id, { role: "admin", passwordHash: hash });
          }
        }
      });
    },

    loginAsAdmin: (adminEmail = "admin@nafe.gg") => {
      store.seedAdmins();
      const lower = (adminEmail || "").toLowerCase().trim();
      let adm = users.list().find(
        (u) =>
          (u.email.toLowerCase() === lower ||
           u.username.toLowerCase() === lower ||
           u.id === lower) &&
          u.role === "admin"
      );
      if (!adm) adm = users.list().find((u) => u.role === "admin");
      if (adm) {
        session.set({ userId: adm.id });
        return adm;
      }
      return null;
    },

    login: ({ email, password }) => {
      store.seedAdmins();
      const hash = btoa(unescape(encodeURIComponent(password)));
      const lower = (email || "").toLowerCase().trim();

      // Recherche par email OU par nom d'utilisateur (ex: "AdminNAFE", "admin", "Mathia", "StaffNAFE")
      let user = users.list().find(
        (u) =>
          (u.email.toLowerCase() === lower || u.username.toLowerCase() === lower) &&
          u.passwordHash === hash
      );

      // Tolérance et raccourcis pour les comptes admin injectés
      if (!user) {
        if (
          (lower === "admin@nafe.gg" || lower === "adminnafe" || lower === "admin") &&
          (password === "admin" || password === "admin123" || password === "admin2026")
        ) {
          user = users.list().find((u) => u.email.toLowerCase() === "admin@nafe.gg" || u.username.toLowerCase() === "adminnafe");
        } else if (
          (lower === "staff@nafe.gg" || lower === "staffnafe" || lower === "staff") &&
          (password === "staff" || password === "staff2026")
        ) {
          user = users.list().find((u) => u.email.toLowerCase() === "staff@nafe.gg" || u.username.toLowerCase() === "staffnafe");
        } else if (
          (lower === "direction@nafe.gg" || lower === "mathia" || lower === "direction") &&
          (password === "direction" || password === "nafe2026" || password === "mathia")
        ) {
          user = users.list().find((u) => u.email.toLowerCase() === "direction@nafe.gg" || u.username.toLowerCase() === "mathia");
        }
      }

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
      // Seed initial Fortnite players if none exist
      const fnPlayers = players.list().filter(p => p.team === "fortnite");
      if (fnPlayers.length === 0 && window.DEFAULT_FORTNITE_ROSTER) {
        window.DEFAULT_FORTNITE_ROSTER.forEach(p => players.add(p));
      }

      if (players.list().length > 0) return;
      players.add({ team: "valorant", name: "Exemple",  tag: "exemple",  role: "Duelist", jersey: 7, kd: 0, country: "FR", hs: 0, acs: 0 });
      matches.add({ date: new Date().toISOString().slice(0,10), time: "20:00", game: "VAL", event: "Événement exemple", opp: "Adversaire", result: "À venir", status: "soon", loc: "En ligne" });
      news.add({ date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(), cat: "Annonce", game: "CLUB", title: "Premier post de test", lede: "Crée, modifie ou supprime cette actu depuis l'espace Admin.", author: "Staff", readTime: "1 min", featured: true });
    },

    // Migration : renomme les clés de jeu obsolètes dans les collections existantes
    migrate: () => {
      const RENAMES = { lol: "rl", cs2: "fortnite", cs: "fortnite" }; // ancien slug → nouveau slug
      const GAME_RENAMES = { lol: "RL", cs2: "FN", cs: "FN" };
      let dirty = false;
      [players, matches, trophies, subteams].forEach((col) => {
        const all = col.list();
        const patched = all.map((x) => {
          const next = RENAMES[x.team];
          if (next) { dirty = true; return { ...x, team: next }; }
          const nextParent = RENAMES[x.parent];
          if (nextParent) { dirty = true; return { ...x, parent: nextParent }; }
          const nextGame = GAME_RENAMES[x.game?.toLowerCase()];
          if (nextGame) { dirty = true; return { ...x, game: nextGame }; }
          return x;
        });
        if (dirty) {
          col.clear();
          patched.forEach(item => col.add(item));
        }
      });
      // Migration v2 : vide les blocs pré-remplis de sponsors et d'association pour personnalisation totale par l'admin
      if (!localStorage.getItem("nafe:migrated_v2_empty_custom")) {
        sponsors.clear();
        sponsors_settings.clear();
        association_blocks.clear();
        association_settings.clear();
        localStorage.setItem("nafe:migrated_v2_empty_custom", "true");
      }

      const fnPlayers = players.list().filter(p => p.team === "fortnite");
      if (fnPlayers.length === 0 && window.DEFAULT_FORTNITE_ROSTER) {
        window.DEFAULT_FORTNITE_ROSTER.forEach(p => players.add(p));
      }
      // Inject admin accounts and ensure session if none is active
      store.seedAdmins();
      if (!session.get()) {
        store.loginAsAdmin("admin@nafe.gg");
      }
    },

    settings: {
      getPinnedTweetId: () => {
        try {
          return localStorage.getItem("nafe:pinned_tweet_id") || "2098488608801935761";
        } catch {
          return "2098488608801935761";
        }
      },
      setPinnedTweetId: (id) => {
        try {
          localStorage.setItem("nafe:pinned_tweet_id", id);
          window.dispatchEvent(new CustomEvent("store:update", { detail: { key: "settings" } }));
        } catch (e) {
          console.error(e);
        }
      }
    },

    wipeAll: () => {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem("nafe:pinned_tweet_id");
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
  try {
    store.seedAdmins();
  } catch (e) {
    console.warn("NAFE: seedAdmins auto-init:", e);
  }
})();
