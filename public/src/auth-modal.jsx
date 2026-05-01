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
            style={{ background: accent }} disabled={busy}>
            {busy ? "Patiente..." : (tab === "login" ? "Se connecter" : "Créer mon compte")}
          </button>

          <p className="nafe-modal__switch">
            {tab === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}
            {" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setTab(tab === "login" ? "register" : "login"); setError(""); }}>
              {tab === "login" ? "S'inscrire" : "Se connecter"}
            </a>
          </p>
        </form>

        <p className="nafe-modal__disclaimer nafe-mono">
          ⓘ Prototype local — les comptes sont stockés dans ton navigateur uniquement.
        </p>
      </div>
    </div>
  );
}

window.AuthModal = AuthModal;
