// NAFE — Auth modal : formulaires login / register
// Exposé via window.AuthModal. L'état ouvert/fermé est piloté par window.openAuth()
// / window.closeAuth() depuis le header.

const { useState: useAuthState } = React;

function AuthModal({ accent, mode, onClose, onSuccess }) {
  const [tab, setTab] = useAuthState(mode || "login");
  const [email, setEmail] = useAuthState("");
  const [username, setUsername] = useAuthState("");
  const [password, setPassword] = useAuthState("");
  const [error, setError] = useAuthState("");
  const [busy, setBusy] = useAuthState(false);

  const usersExist = window.store.users.list().length > 0;

  function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (tab === "register") {
        if (!email.trim() || !username.trim() || password.length < 4) {
          throw new Error("Email, nom d'utilisateur et mot de passe (4+ caractères) requis.");
        }
        const u = window.store.register({ email, username, password });
        onSuccess && onSuccess(u);
      } else {
        const u = window.store.login({ email, password });
        onSuccess && onSuccess(u);
      }
      onClose && onClose();
    } catch (err) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="nafe-modal__backdrop" onClick={onClose}>
      <div className="nafe-modal nafe-clip-card" onClick={(e) => e.stopPropagation()}>
        <button className="nafe-modal__close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="nafe-modal__tabs">
          <button
            className={`nafe-modal__tab ${tab === "login" ? "is-active" : ""}`}
            style={tab === "login" ? { borderColor: accent, color: "#fff" } : {}}
            onClick={() => { setTab("login"); setError(""); }}
          >
            <span className="nafe-mono">Connexion</span>
          </button>
          <button
            className={`nafe-modal__tab ${tab === "register" ? "is-active" : ""}`}
            style={tab === "register" ? { borderColor: accent, color: "#fff" } : {}}
            onClick={() => { setTab("register"); setError(""); }}
          >
            <span className="nafe-mono">Inscription</span>
          </button>
        </div>

        <h2 className="nafe-display nafe-modal__title">
          {tab === "login"
            ? <>BIENVENUE<span style={{ color: accent }}>.</span></>
            : <>REJOINS LE CLUB<span style={{ color: accent }}>.</span></>
          }
        </h2>
        <p className="nafe-modal__lede">
          {tab === "login"
            ? "Accède à ton dashboard, tes missions et ton XP fan."
            : !usersExist
              ? "Premier compte créé = administrateur. Toutes les inscriptions suivantes sont des comptes fan standards."
              : "Crée ton compte fan gratuit. XP, drops et accès aux événements club."}
        </p>

        <form className="nafe-modal__form" onSubmit={submit}>
          <label className="nafe-field">
            <span className="nafe-mono nafe-field__label">Email</span>
            <input type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          {tab === "register" && (
            <label className="nafe-field">
              <span className="nafe-mono nafe-field__label">Nom d'utilisateur</span>
              <input type="text" required autoComplete="username" minLength={3}
                value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
          )}

          <label className="nafe-field">
            <span className="nafe-mono nafe-field__label">Mot de passe</span>
            <input type="password" required minLength={4}
              autoComplete={tab === "register" ? "new-password" : "current-password"}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          {error && <p className="nafe-modal__error">⚠ {error}</p>}

          <button type="submit" className="nafe-btn nafe-btn--accent"
            style={{ background: accent, width: "100%", justifyContent: "center" }} disabled={busy}>
            {busy ? "Patiente..." : (tab === "login" ? "Se connecter" : "Créer mon compte")}
          </button>

          <button 
            type="button" 
            className="nafe-btn nafe-btn--ghost" 
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            onClick={() => {
              if (window.supabase) {
                window.supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: { redirectTo: window.location.origin }
                });
              } else {
                alert("Erreur: Supabase non initialisé");
              }
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 8 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <p className="nafe-modal__switch">
            {tab === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}
            {" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setTab(tab === "login" ? "register" : "login"); setError(""); }}>
              {tab === "login" ? "S'inscrire" : "Se connecter"}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

window.AuthModal = AuthModal;
