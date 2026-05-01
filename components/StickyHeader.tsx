"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function StickyHeader() {
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 200], [96, 56]);
  const bg = useTransform(
    scrollY,
    [0, 200],
    ["rgba(5,8,20,0)", "rgba(5,8,20,0.85)"]
  );

  return (
    <motion.header
      style={{ height, backgroundColor: bg }}
      className="fixed top-6 left-16 right-0 z-30 backdrop-blur-xl border-b border-white/5 flex items-center px-8"
    >
      <motion.span
        className="font-display font-black text-xl tracking-tighter"
        style={{ letterSpacing: useTransform(scrollY, [0, 200], ["-0.02em", "-0.05em"]) }}
      >
        FN<span className="text-nafe-blue">/</span>NAFE
      </motion.span>

      <nav className="ml-auto flex items-center gap-8 text-xs uppercase tracking-widest font-mono text-white/70">
        <a href="/teams/valorant" className="hover:text-nafe-blue transition-colors">Esport</a>
        <a href="/club/dashboard" className="hover:text-nafe-blue transition-colors">Club</a>
        <a href="/shop" className="hover:text-nafe-blue transition-colors">Shop</a>
        <a href="/teams/valorant" className="hover:text-nafe-blue transition-colors">Roster</a>
        <button className="nafe-clip-card bg-nafe-blue text-white px-5 py-2 hover:shadow-nafe-glow transition-shadow">
          S'inscrire
        </button>
      </nav>
    </motion.header>
  );
}
