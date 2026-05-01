"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    // On appelle une petite route d'API pour set le cookie de façon sécurisée (HttpOnly, etc.)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/shop");
      router.refresh(); // Pour s'assurer que le layout et les composants côté serveur prennent en compte le cookie
    } else {
      setError("Mot de passe incorrect.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="nafe-clip-card bg-nafe-surface/60 border border-white/5 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-steel-grey block mb-2">
            Zone Sécurisée
          </span>
          <h1 className="font-display font-black text-3xl">Accès Admin</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-mono text-xs text-steel-grey mb-2 uppercase">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-nafe-blue outline-none font-sans" 
              placeholder="••••••••" 
            />
          </div>

          {error && <p className="text-red-500 font-mono text-xs">{error}</p>}

          <button 
            type="submit" 
            className="w-full nafe-clip-card bg-white text-black font-display uppercase tracking-widest px-8 py-4 hover:bg-white/90 transition-colors"
          >
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
}
