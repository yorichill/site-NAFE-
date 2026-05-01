import type { Metadata } from "next";
import "./globals.css";
import "./nafe.css";
import { displayFont, sansFont, monoFont } from "./fonts";
import { RadialSidebar } from "@/components/RadialSidebar";
import { StickyHeader } from "@/components/StickyHeader";
import { ScoreTicker } from "@/components/ScoreTicker";

export const metadata: Metadata = {
  title: "Fnatic × Nafe — Esport Premium",
  description:
    "L'écosystème Fnatic repensé sous la direction créative Nafe. Matchs live, rosters, statistiques et programme de fidélité.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`dark ${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body className="nafe-app">
        <div className="nafe-ambient" />
        <div className="nafe-ambient nafe-ambient--2" />
        
        <ScoreTicker />
        <StickyHeader />
        <RadialSidebar />
        
        <main className="nafe-main">
          {children}
        </main>

        <div className="nafe-scanlines" />
        <div className="nafe-grain" />
      </body>
    </html>
  );
}
