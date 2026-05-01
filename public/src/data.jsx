// NAFE — configuration statique de l'organisation (non éditable côté user)
// Tout le contenu dynamique (joueurs, matchs, actus, scores, palmarès)
// vit dans window.store (cf. store.jsx). Vide par défaut — rempli via /admin.

const TEAMS_META = {
  valorant: { slug: "valorant", game: "VALORANT",          title: "NAFE Valorant", region: "EMEA", color: "#FF4655" },
  rl:       { slug: "rl",       game: "ROCKET LEAGUE",      title: "NAFE Rocket League", region: "RLCS", color: "#1B9EF0" },
  cs2:      { slug: "cs2",      game: "COUNTER-STRIKE 2",  title: "NAFE CS2",      region: "EU",   color: "#F5A623" },
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
  { key: "home",      label: "Hub",        icon: "◉", href: "#/" },
  { key: "teams",     label: "Teams",      icon: "▣", href: "#/teams/valorant" },
  { key: "live",      label: "Live",       icon: "▶", href: "#/live" },
  { key: "calendar",  label: "Calendrier", icon: "▤", href: "#/calendar" },
  { key: "news",      label: "Actu",       icon: "✎", href: "#/news" },
  { key: "community", label: "Community",  icon: "✦", href: "#/community" },
  { key: "contact",   label: "Contact",    icon: "⊙", href: "#/contact" },
  { key: "admin",     label: "Admin",      icon: "⚙", href: "#/admin" },
];

Object.assign(window, { TEAMS_META, getTeam, MISSIONS, REWARDS, NAV, tintPalette, hexToHsl, hslToHex });
