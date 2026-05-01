"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StickyHeader() {
  const [shrunk, setShrunk] = useState(false);
  const route = usePathname();

  useEffect(() => {
    const scroller = document.querySelector(".nafe-main") || window;
    const onScroll = () => {
      const top = (scroller as Element).scrollTop || window.scrollY;
      setShrunk(top > 80);
    };
    scroller.addEventListener("scroll", onScroll);
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nafe-header ${shrunk ? "is-shrunk" : ""}`}>
      <Link href="/" className="nafe-logo">
        NAFE<span className="nafe-logo__slash">/</span>TEAM
      </Link>
      <nav className="nafe-header__nav">
        <Link href="/shop" className={route === "/shop" ? "is-active" : ""}>Shop</Link>
        <Link href="/teams/valorant" className={route.startsWith("/teams") ? "is-active" : ""}>Roster</Link>
        <Link href="/live" className={route === "/live" ? "is-active" : ""}>Live</Link>
        <Link href="/calendar" className={route === "/calendar" ? "is-active" : ""}>Calendrier</Link>
        <Link href="/news" className={route === "/news" ? "is-active" : ""}>Actu</Link>
        <Link href="/community" className={route === "/community" ? "is-active" : ""}>Community</Link>
        <Link href="/contact" className={route === "/contact" ? "is-active" : ""}>Contact</Link>
        
        {/* Simple Login button for now */}
        <div className="nafe-auth ml-4">
          <button className="nafe-btn nafe-btn--ghost nafe-btn--sm">
            Se connecter
          </button>
          <button className="nafe-btn nafe-btn--accent nafe-btn--sm">
            S'inscrire
          </button>
        </div>
      </nav>
    </header>
  );
}
