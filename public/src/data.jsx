// NAFE — configuration statique de l'organisation (non éditable côté user)
// Tout le contenu dynamique (joueurs, matchs, actus, scores, palmarès)
// vit dans window.store (cf. store.jsx). Vide par défaut — rempli via /admin.

const TEAMS_META = {
  valorant: { slug: "valorant", game: "VALORANT",       title: "NAFE Valorant",       region: "EMEA", color: "#FF4655" },
  rl:       { slug: "rl",       game: "ROCKET LEAGUE",   title: "NAFE Rocket League",  region: "RLCS", color: "#1B9EF0" },
  fortnite: { slug: "fortnite", game: "FORTNITE",        title: "NAFE Fortnite",       region: "EU · FNCS", color: "#8B5CF6", formats: ["Solo", "Duo", "Trio"] },
};

// Helpers HSL pour dériver des teintes à partir de la couleur signature du jeu
function hexToHsl(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hh = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hh = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hh = (b - r) / d + 2; break;
      default: hh = (r - g) / d + 4;
    }
    hh *= 60;
  }
  return { h: hh, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)      { r = c; g = x; }
  else if (h < 120){ r = x; g = c; }
  else if (h < 180){ g = c; b = x; }
  else if (h < 240){ g = x; b = c; }
  else if (h < 300){ r = x; b = c; }
  else             { r = c; b = x; }
  const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

// Génère n teintes distinctes dérivées de la couleur de base
// (variations de luminosité + léger shift de teinte)
function tintPalette(baseHex, n = 6) {
  const { h, s, l } = hexToHsl(baseHex);
  const out = [baseHex];
  const shifts = [
    [0, 0, 14],   [0, 0, -14],  [12, -10, 8],
    [-18, -6, -4], [24, -20, 12], [-28, -12, 18],
    [8, 0, 28],   [-8, 0, -24],
  ];
  for (let i = 0; i < Math.min(n - 1, shifts.length); i++) {
    const [dh, ds, dl] = shifts[i];
    out.push(hslToHex(h + dh, s + ds, l + dl));
  }
  return out;
}

// getTeam(slug) — merge méta + contenu dynamique du store
function getTeam(slug) {
  const meta = TEAMS_META[slug];
  if (!meta) return null;
  const roster = window.store.getPlayersByTeam(slug);
  const trophies = window.store.getTrophiesByTeam(slug);
  return { ...meta, roster, trophies };
}

// Missions & paliers club — structure de programme, non liée à des joueurs
const MISSIONS = [
  { title: "Regarde 3 matchs live",        xp: 150 },
  { title: "Vote ton MVP de la semaine",   xp: 80  },
  { title: "Invite un ami au club",        xp: 300 },
  { title: "Achète un jersey officiel",    xp: 500 },
  { title: "Partage un highlight sur X",   xp: 120 },
];

const REWARDS = [
  { tier: "Rookie",  need: 0,     perk: "Badge digital + ticker perso" },
  { tier: "Starter", need: 1000,  perk: "Meet & greet virtuel trimestriel" },
  { tier: "Veteran", need: 5000,  perk: "Drop exclusif jersey numéroté" },
  { tier: "Legend",  need: 15000, perk: "Finale offline + hospitalité VIP" },
];

const NAV = [
  { key: "home",        label: "Hub",           icon: "◉", href: "#/" },
  { key: "teams",       label: "Teams",         icon: "▣", href: "#/teams/valorant" },
  { key: "sponsors",    label: "Sponsors",      icon: "★", href: "#/sponsors" },
  { key: "association", label: "L'Association", icon: "⚑", href: "#/association" },
  { key: "live",        label: "Live",          icon: "▶", href: "#/live" },
  { key: "calendar",    label: "Calendrier",    icon: "▦", href: "#/calendar" },
  { key: "news",        label: "Actu",          icon: "▤", href: "#/news" },
  { key: "community",   label: "Community",     icon: "✦", href: "#/community" },
  { key: "contact",     label: "Contact",       icon: "⊙", href: "#/contact" },
  { key: "admin",       label: "Admin",         icon: "⚙", href: "#/admin" },
];

const NAFE_TWITTER_AVATAR = "https://pbs.twimg.com/profile_images/2089748890027196416/5diWkPDV_400x400.png";

const DEFAULT_TWEETS = [
  {
    "id": "2098488608801935761",
    "text": "LE ROSTER ARRIVE.\n\nDemain, NAFE dévoile officiellement sa line-up Valorant.\n\n@BoostahVLR • @KyMeVLR • @Yeezerr • @Piou888 • @GlassySkyvlr \n\nUne nouvelle page s’ouvre.\nLe travail commence maintenant.\n\nLe phœnix ne meurt jamais.\n\n#NAFE #Valorant #Esport #RosterAnnounce",
    "created_at": "2026-09-11T19:07:27.000Z",
    "pinned": true,
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 2
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HR9UQ2zWsAUFkGo?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2099222410150949257",
    "text": "@Twigzfn est qual top 4000 !!! \nRetrouvez le sur https://twitch.tv/nafetv à 22 h",
    "created_at": "2026-09-13T19:43:18.000Z",
    "public_metrics": {
      "like_count": 11,
      "retweet_count": 5
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/card_img/2096281822317490176/H4TrRFoW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2099216140211822679",
    "text": "@Rezpaaan qual top 4000\n22h on https://twitch.tv/nafetv",
    "created_at": "2026-09-13T19:18:24.000Z",
    "public_metrics": {
      "like_count": 12,
      "retweet_count": 2
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/card_img/2096281822317490176/H4TrRFoW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098784287843590387",
    "text": "SPIKE TOUR — RESULTS\n\nNAFE continue son parcours sur le Spike Tour.\n\nMatch 3 : NAFE 5-13 @Brezelit \nMatch 4 : NAFE 13-5 #SBR\n\nAprès un match compliqué, l’équipe a su réagir avec une victoire solide sur le quatrième match.\n\nLe phœnix ne meurt jamais.\n\n#NAFE #Valorant #SpikeTour #Esport #NAFEWIN",
    "created_at": "2026-09-12T14:42:22.000Z",
    "public_metrics": {
      "like_count": 15,
      "retweet_count": 5
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSBhLzDXAAg2eOM?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098746389786145143",
    "text": "SPIKE TOUR — RESULTS\n\nDéfaite pour NAFE sur cette rencontre face aux Zinzins de l’Espace et Tapis Volant.\n\nMatch 1 : NAFE 4-13 Les Zinzins de l’Espace\nMatch 2 : NAFE 11-13 Tapis Volant\n\nUn premier match compliqué, mais une vraie réaction sur la deuxième map avec un score beaucoup plus serré.\n\nLe phœnix ne meurt jamais.\n\n#NAFE #Valorant #SpikeTour #Esport #NAFEWIN",
    "created_at": "2026-09-12T12:11:46.000Z",
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSA-tzsWQAUKck2?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098738354363801644",
    "text": "Après ce premier match nous voici contre les #tapisvolant pour cette deuxième manche du #spiketour !! \nOn croit en vous #nafewin",
    "created_at": "2026-09-12T11:39:51.000Z",
    "public_metrics": {
      "like_count": 16,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSA3aIUbQAAqL1K?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2098700841964151061",
    "text": "Pour débuter cette journée de spike tour   NAFE va jouer contre #leszinzindelespace a 12h . \nOn vous attends nombreux sur la chaîne pour les supporter toute la journée . \nhttps://twitch.tv/nafetv",
    "created_at": "2026-09-12T09:10:47.000Z",
    "public_metrics": {
      "like_count": 12,
      "retweet_count": 4
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HSAVSJvXIAEVzgV?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096575094654910466",
    "text": "@vexskifn réalise une belle semaine avec de bons résultats sous les couleurs de NAFE.\n\nÀ retenir :\n\nTop 130 EU en FNCS Division 1 Practice\nTop 9743 en Reload Victory Cup\nTop 573 en Fortnite Performance Evaluation\n\nUne semaine de plus pour progresser et continuer à représenter l’équipe.\nLe phœnix ne meurt jamais.\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T12:23:49.000Z",
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRiH7shbQAAuyOA?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096554929477255549",
    "text": "@KsawiiFN poursuit sa progression avec une semaine encourageante sous le tag NAFE.\n\nCette semaine :\n\nTop 326 EU en FNCS Division 2 Practice\nTop 508 en Fortnite Performance Evaluation\nTop 7069 en Solo Victory Cup\n\nLe chemin continue, et le travail paie petit à petit.\nLe phœnix ne meurt jamais.\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T11:03:41.000Z",
    "public_metrics": {
      "like_count": 12,
      "retweet_count": 5
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRh1mBhXQAAku4J?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096539231766114515",
    "text": "@Twigzfn continue d’avancer avec une semaine solide sous les couleurs de NAFE.\n\nSes résultats cette semaine :\n\nTop 550 EU en FNCS Division 1 Practice\nTop 937 en Reload Duos Victory Cup\nTop 188 en Fortnite Performance Evaluation\nQualifié en Solo Victory Cup\n\nDe la régularité, de l’envie et une vraie progression.\nLe phœnix ne meurt jamais.\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T10:01:19.000Z",
    "public_metrics": {
      "like_count": 9,
      "retweet_count": 1
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRhnUV3W4AEKppA?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096524086805426196",
    "text": "@Rezpaaan signe une très belle première semaine sous les couleurs de NAFE.\n\nParmi ses résultats :\n\nTop 42 EU en FNCS Division 1 Practice\nTop 846 en Reload Victory Cup\nTop 919 en Fortnite Performance Evaluation\nTop 7300 en Solo Victory Cup\n\nLe travail continue et la progression est là.\nLe phœnix ne meurt jamais.\n\n#NAFEWIN #NAFE #Fortnite #FNCS #Esport",
    "created_at": "2026-09-06T09:01:08.000Z",
    "public_metrics": {
      "like_count": 15,
      "retweet_count": 3
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRhZir1W4AMUsBW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096340852524335455",
    "text": "NAFE WEEKLY RECAP\n\nCette semaine, nos joueurs Fortnite ont porté les couleurs de NAFE sur plusieurs cups compétitives.\n\nLes performances arrivent, le travail continue, et chaque résultat nous rapproche de nos objectifs.\n\nRendez-vous demain pour découvrir les récapitulatifs individuels de nos joueurs.\n\nLe phœnix ne meurt jamais.\n#nafeWIN #nafe #Fortnite #Esport #FNCS #FortniteCompetitive",
    "created_at": "2026-09-05T20:53:02.000Z",
    "public_metrics": {
      "like_count": 14,
      "retweet_count": 1
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRey5JtXMAQkNPk?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096266371432681694",
    "text": "Top 11 pour @Twigzfn\nSi proche du but !! \n\nLast game NOW on https://twitch.tv/nafetv\n\nWe’re proud of you !!!",
    "created_at": "2026-09-05T15:57:04.000Z",
    "public_metrics": {
      "like_count": 10,
      "retweet_count": 1
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/card_img/2096281822317490176/H4TrRFoW?format=webp&name=medium",
        "type": "photo"
      }
    ]
  },
  {
    "id": "2096262665563750530",
    "text": "1 ère game pour @Twigzfn TOP 29 \nKeep pushing",
    "created_at": "2026-09-05T15:42:20.000Z",
    "public_metrics": {
      "like_count": 8,
      "retweet_count": 1
    }
  },
  {
    "id": "2096252945364901896",
    "text": "@Twigzfn doit gagner pour repartir avec du cashprize. \nMake us proud\n\nEn live ici https://twitch.tv/nafetv",
    "created_at": "2026-09-05T15:03:43.000Z",
    "public_metrics": {
      "like_count": 7,
      "retweet_count": 2
    },
    "media": [
      {
        "url": "https://pbs.twimg.com/media/HRdi8Q9XwAUBsY2?format=webp&name=medium",
        "type": "photo"
      }
    ]
  }
];

// NAFE ESPORT — Données d'identité de marque
const NAFE_VALUES = [
  { num: "01", title: "Exigence", desc: "L'excellence au quotidien dans la préparation, la discipline et la rigueur compétitive." },
  { num: "02", title: "Ambition", desc: "Conquérir les sommets et s'imposer comme structure majeure sur Valorant et Rocket League." },
  { num: "03", title: "Suivi", desc: "Coaching dédié, staff stratégique et accompagnement holistique pour révéler chaque talent." },
  { num: "04", title: "Dépassement", desc: "Repousser sans cesse ses limites pour sublimer le collectif. Le phœnix ne meurt jamais." },
];

const NAFE_VISION = {
  headline: "L'excellence au cœur du jeu",
  body: "Chez NAFE Esport, nous bâtissons une structure compétitive d'élite. L'exigence, le professionnalisme et l'expérience sont les piliers de notre projet. Nous créons un écosystème de performance optimal, conçu pour permettre à chaque joueur de repousser ses limites et d'exprimer son plein potentiel.",
  ambition: "Conquérir les sommets — S'imposer comme une structure majeure et incontournable sur les circuits compétitifs de Valorant et Rocket League."
};

const NAFE_MISSION = {
  headline: "Ton talent, notre infrastructure",
  body: "Nous avons pour mission de placer nos joueurs dans les meilleures conditions de réussite possibles. En associant un accompagnement stratégique par des coachs dédiés et un agenda riche en tournois et événements, nous créons un espace où chaque membre de NAFE Esport peut se surpasser et révéler son plein potentiel."
};

const BRAND_COLORS = {
  waterBlue: { name: "Water blue", hex: "#0288D1", rgb: "2, 136, 209" },
  denimBlue: { name: "Denim blue", hex: "#73BEDE", rgb: "115, 190, 222" },
  dune:      { name: "Dune",       hex: "#333333", rgb: "51, 51, 51" },
  greenPeas: { name: "Green Peas", hex: "#8BC34A", rgb: "139, 195, 74" },
  wattle:    { name: "Wattle",     hex: "#CDDC39", rgb: "205, 220, 57" },
  white:     { name: "White",      hex: "#FFFFFF", rgb: "255, 255, 255" }
};

// DEFAULT SPONSORS — Partenaires officiels NAFE
const DEFAULT_SPONSORS = [
  {
    id: "sp_1",
    name: "AERO PERFORMANCE",
    tier: "Partenaire Titre",
    category: "Nutrition & Énergie",
    logo: "assets/brand/nafe-symbol.png",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80",
    description: "Aero Performance accompagne tous les athlètes de NAFE ESPORT au quotidien avec des solutions de nutrition et d'hydratation spécialement conçues pour l'endurance cognitive, la précision des réflexes et la récupération après les sessions compétitives intenses.",
    websiteUrl: "https://nafe.gg",
    promoCode: "NAFE20",
    order: 1,
    active: true
  },
  {
    id: "sp_2",
    name: "CYBERPULSE GEAR",
    tier: "Équipementier Officiel",
    category: "Périphériques Gaming",
    logo: "assets/brand/nafe-symbol.png",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80",
    description: "Fournisseur exclusif des claviers mécaniques ultra-réactifs et des casques audio spatialisés de nos rosters Valorant, Rocket League et Fortnite. Chaque produit est testé et validé par nos compétiteurs pour garantir des performances optimales en tournoi.",
    websiteUrl: "https://nafe.gg",
    promoCode: "PULSENAFE",
    order: 2,
    active: true
  },
  {
    id: "sp_3",
    name: "NEXUS CLOUD SERVERS",
    tier: "Partenaire Infrastructure",
    category: "Hébergement & Réseau",
    logo: "assets/brand/nafe-symbol.png",
    banner: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
    description: "Nexus Cloud assure la stabilité et la très faible latence de tous nos serveurs de scrimmage (scrims), bootcamps virtuels et bots d'automatisation communautaires. Une infrastructure fiable sans compromis pour nos joueurs d'élite.",
    websiteUrl: "https://nafe.gg",
    promoCode: "NEXUS15",
    order: 3,
    active: true
  },
  {
    id: "sp_4",
    name: "PHOENIX APPAREL",
    tier: "Partenaire Textile",
    category: "Vêtements & Merch",
    logo: "assets/brand/nafe-symbol.png",
    banner: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=80",
    description: "Confectionneur des maillots officiels 2026 de NAFE ESPORT et de la gamme streetwear club. Matières respirantes haute performance conçues pour la scène LAN et le confort quotidien de la communauté.",
    websiteUrl: "https://nafe.gg",
    promoCode: "PHOENIX10",
    order: 4,
    active: true
  }
];

// DEFAULT FORTNITE ROSTER (tiré des annonces et perfs officielles de NAFE)
const DEFAULT_FORTNITE_ROSTER = [
  {
    id: "pl_fn_twigz",
    team: "fortnite",
    subteam: "",
    name: "Twigz",
    tag: "Twigzfn",
    role: "Fragger",
    format: "Duo",
    partner: "Rezpaaan",
    pr: 12450,
    bestRank: "Top 11 Solo · Top 4000 EU",
    jersey: 12,
    country: "FR",
    kd: 3.42,
    hs: 48,
    gear: { mouse: "Logitech G Pro X Superlight", keyboard: "Wooting 60HE", headset: "HyperX Cloud II" }
  },
  {
    id: "pl_fn_rezpaaan",
    team: "fortnite",
    subteam: "",
    name: "Rezpaaan",
    tag: "Rezpaaan",
    role: "Tarper / IGL",
    format: "Duo",
    partner: "Twigz",
    pr: 11800,
    bestRank: "Top 42 EU - FNCS Div 1 Practice",
    jersey: 14,
    country: "FR",
    kd: 3.15,
    hs: 44,
    gear: { mouse: "Razer Viper V2 Pro", keyboard: "Apex Pro Mini", headset: "Sennheiser HD 560S" }
  },
  {
    id: "pl_fn_vexski",
    team: "fortnite",
    subteam: "",
    name: "Vexski",
    tag: "vexskifn",
    role: "Soloist",
    format: "Solo",
    partner: "Solo",
    pr: 9940,
    bestRank: "Top 130 EU - FNCS Div 1",
    jersey: 21,
    country: "FR",
    kd: 2.92,
    hs: 42,
    gear: { mouse: "Finalmouse Starlight", keyboard: "Wooting 60HE", headset: "Logitech G Pro X" }
  },
  {
    id: "pl_fn_ksawii",
    team: "fortnite",
    subteam: "",
    name: "Ksawii",
    tag: "KsawiiFN",
    role: "Anchor / Support",
    format: "Trio",
    partner: "Lineup Trio",
    pr: 8750,
    bestRank: "Top 326 EU - FNCS Div 2",
    jersey: 77,
    country: "FR",
    kd: 2.68,
    hs: 39,
    gear: { mouse: "Glorious Model O", keyboard: "Ducky One 3 Mini", headset: "SteelSeries Arctis Nova 7" }
  }
];

// ASSOCIATION NAFE — Présentation, Termes, Missions et Soutien
const NAFE_ASSOCIATION_DATA = {
  name: "NAFE ESPORT",
  legalType: "Association Loi 1901 à but non lucratif",
  creationYear: "2024",
  rnaNumber: "W922018472",
  motto: "L'excellence au cœur du jeu · Le phœnix ne meurt jamais",
  intro: "NAFE ESPORT est une association française régie par la loi du 1er juillet 1901. Fondée par des passionnés de compétition vidéoludique, notre mission est de structurer, former et accompagner les talents de l'esport amateur et semi-professionnel dans un cadre éthique, performant et bienveillant.",
  pillars: [
    {
      title: "Encadrement & Pédagogie",
      desc: "Suivi personnalisé de chaque joueur : analyse tactique, préparation mentale, ergonomie et équilibre de vie face aux écrans."
    },
    {
      title: "Accès à la Compétition",
      desc: "Financement des inscriptions aux tournois majeurs, frais de déplacement et logistique lors des finales et LANs physiques partout en France et en Europe."
    },
    {
      title: "Matériel & Infrastructure",
      desc: "Mise à disposition de maillots officiels, serveurs d'entraînement dédiés et accompagnement matériel pour les joueurs méritants."
    },
    {
      title: "Transparence & Gestion Associative",
      desc: "100% des fonds perçus (cotisations, dons, gains de tournois réinvestis) sont alloués au projet sportif et au bien-être de nos membres."
    }
  ],
  terms: [
    {
      num: "Article 1",
      title: "Engagement & Esprit Sportif",
      text: "Tout membre représentant NAFE s'engage à respecter les principes du fair-play, de courtoisie et de respect mutuel en jeu et sur les réseaux sociaux. Aucune forme de toxicité, harcèlement ou discrimination n'est tolérée."
    },
    {
      num: "Article 2",
      title: "Transparence Financière",
      text: "L'association garantit la stricte affectation de chaque euro perçu au développement de la structure, des joueurs et des événements du club. Les comptes sont approuvés annuellement en assemblée générale."
    },
    {
      num: "Article 3",
      title: "Statut des Joueurs & Staff",
      text: "Les membres associatifs contribuent bénévolement à la vie du club. Les gains obtenus en compétition sont redistribués selon la charte d'équipe approuvée avant chaque saison sportive."
    },
    {
      num: "Article 4",
      title: "Adhésion & Révocation",
      text: "L'adhésion est ouverte à toute personne partageant les valeurs du club. Le bureau directeur se réserve le droit d'exclure tout membre manquant gravement au règlement intérieur de l'association."
    }
  ],
  fundingImpact: [
    { label: "Déplacements LAN", desc: "Transport & hébergement pour les compétitions physiques", pct: 45 },
    { label: "Équipement & Maillots", desc: "Jerseys officiels personnalisés & matériel gaming", pct: 30 },
    { label: "Infrastructures & Serveurs", desc: "Serveurs d'entraînement, scrims & outils de tracking", pct: 15 },
    { label: "Vie du Club & Événements", desc: "Animation de la communauté, tournois ouverts & streams", pct: 10 }
  ],
  donationUrl: "https://www.helloasso.com" // Lien HelloAsso ou plateforme officielle
};

Object.assign(window, { 
  TEAMS_META, 
  getTeam, 
  MISSIONS, 
  REWARDS, 
  NAV, 
  tintPalette, 
  hexToHsl, 
  hslToHex, 
  DEFAULT_TWEETS, 
  NAFE_TWITTER_AVATAR,
  NAFE_VALUES,
  NAFE_VISION,
  NAFE_MISSION,
  BRAND_COLORS,
  DEFAULT_SPONSORS,
  DEFAULT_FORTNITE_ROSTER,
  NAFE_ASSOCIATION_DATA
});
