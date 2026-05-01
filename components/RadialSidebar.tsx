"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { key: "home", label: "Home", icon: "◉", href: "/" },
  { key: "teams", label: "Teams", icon: "▣", href: "/teams/valorant" },
  { key: "live", label: "Live", icon: "▶", href: "/live" },
  { key: "club", label: "Club", icon: "✦", href: "/club" },
  { key: "shop", label: "Shop", icon: "⊞", href: "/shop" },
  { key: "admin", label: "Admin", icon: "⎈", href: "/admin/shop" },
];

const SECTIONS: Record<string, { label: string; href: string }[]> = {
  home: [{ label: "Accueil", href: "/" }],
  teams: [
    { label: "Valorant", href: "/teams/valorant" },
    { label: "Rocket League", href: "/teams/rl" },
    { label: "CS2", href: "/teams/cs2" },
  ],
  live: [{ label: "Match en cours", href: "/live" }],
  calendar: [{ label: "Mois & liste", href: "/calendar" }],
  news: [{ label: "Dernières dépêches", href: "/news" }],
  community: [{ label: "Posts & discussions", href: "/community" }],
  admin: [
    { label: "Boutique", href: "/admin/shop" },
    { label: "Déconnexion", href: "/admin/login" },
  ],
  shop: [{ label: "Boutique Officielle", href: "/shop" }],
};

export function RadialSidebar() {
  const [hover, setHover] = useState<string | null>(null);
  const route = usePathname();

  return (
    <aside className="nafe-sidebar">
      <div className="nafe-sidebar__mark">N</div>
      {NAV.map((item) => {
        const active =
          (item.key === "teams" && route.startsWith("/teams")) ||
          (item.key === "admin" && route.startsWith("/admin")) ||
          (item.key === "home" && route === "/") ||
          (item.key !== "teams" && item.key !== "admin" && item.key !== "home" && route.startsWith(`/${item.key}`));

        return (
          <div
            key={item.key}
            className="nafe-sidebar__item"
            onMouseEnter={() => setHover(item.key)}
            onMouseLeave={() => setHover(null)}
          >
            <Link href={item.href} className={`nafe-sidebar__btn ${active ? "is-active" : ""}`} aria-label={item.label}>
              <span>{item.icon}</span>
            </Link>
            {hover === item.key && (
              <div className="nafe-sidebar__flyout">
                <span className="nafe-sidebar__flyoutLabel">{item.label}</span>
                {(SECTIONS[item.key] || []).map((s) => (
                  <Link key={s.label} href={s.href}>
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="nafe-sidebar__foot">
        <span>FR</span>
        <span>/</span>
        <span>EN</span>
      </div>
    </aside>
  );
}
