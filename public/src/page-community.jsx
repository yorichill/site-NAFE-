// NAFE — Community page : posts / discussions entre fans

const { useState: useCmState } = React;

/* ---- Utilitaire date ---- */
function fmtDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  }).toUpperCase();
}

/* ---- Formulaire de commentaire (inline dans le post) ---- */
function CommentForm({ postId, user, accent }) {
  const [text, setText] = useCmState("");
  const [busy, setBusy] = useCmState(false);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    window.store.comments.add({
      postId,
      content:    text.trim(),
      authorId:   user.id,
      authorName: user.username,
    });
    setText("");
    setBusy(false);
  }

  return (
    <form className="nafe-comment-form" onSubmit={submit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Répondre en tant que ${user.username}…`}
        required
      />
      <button
        type="submit"
        className="nafe-btn nafe-btn--accent nafe-btn--sm"
        style={{ background: accent }}
        disabled={busy}
      >
        {busy ? "…" : "Répondre →"}
      </button>
    </form>
  );
}

/* ---- Page principale ---- */
function CommunityPage({ accent }) {
  window.store.useVersion();
  const user  = window.store.currentUser();
  const posts = window.store.posts.list()
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const [title,     setTitle]     = useCmState("");
  const [content,   setContent]   = useCmState("");
  const [busy,      setBusy]      = useCmState(false);
  const [openPosts, setOpenPosts] = useCmState(new Set());

  function toggleComments(id) {
    setOpenPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function submitPost(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setBusy(true);
    window.store.posts.add({
      title:      title.trim(),
      content:    content.trim(),
      authorId:   user.id,
      authorName: user.username,
      likes: 0,
    });
    setTitle("");
    setContent("");
    setBusy(false);
  }

  function like(post) {
    window.store.posts.update(post.id, { likes: (post.likes || 0) + 1 });
  }

  return (
    <div className="nafe-page">
      {/* Hero */}
      <section className="nafe-team__hero">
        <span className="nafe-eyebrow" style={{ color: accent }}>NAFE · Fan Zone</span>
        <h1 className="nafe-display nafe-team__title">
          COMMUNITY<span style={{ color: accent }}>.</span>
        </h1>
        <p className="nafe-team__lede">
          Espace d'échange officiel de la communauté NAFE. Partage tes analyses,
          réactions et questions directement avec les autres fans.
        </p>
      </section>

      {/* Créer un post */}
      <section className="nafe-section">
        {user ? (
          <form className="nafe-post-form nafe-clip-card" onSubmit={submitPost}>
            <h3 className="nafe-display nafe-post-form__title">
              NOUVEAU POST<span style={{ color: accent }}>.</span>
            </h3>
            <label className="nafe-field">
              <span className="nafe-mono nafe-field__label">Titre du post</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Que pensez-vous du dernier match ?"
                required
              />
            </label>
            <label className="nafe-field">
              <span className="nafe-mono nafe-field__label">Contenu</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Partage ton avis, ton analyse, ta question…"
                required
                rows={4}
              />
            </label>
            <div className="nafe-post-form__foot">
              <span className="nafe-mono" style={{ color: accent, fontSize: 11 }}>
                Posté en tant que <strong>{user.username}</strong>
              </span>
              <button
                type="submit"
                className="nafe-btn nafe-btn--accent"
                style={{ background: accent }}
                disabled={busy}
              >
                {busy ? "Publication…" : "Publier →"}
              </button>
            </div>
          </form>
        ) : (
          <div className="nafe-empty nafe-empty--panel">
            <span className="nafe-mono" style={{ color: accent }}>REJOINS LA DISCUSSION</span>
            <p className="nafe-empty__text">
              Connecte-toi pour publier un post et participer aux discussions de la communauté.
            </p>
            <button
              className="nafe-btn nafe-btn--accent"
              style={{ background: accent }}
              onClick={() => window.openAuth && window.openAuth("login")}
            >
              Se connecter →
            </button>
          </div>
        )}
      </section>

      {/* Feed de posts */}
      <section className="nafe-section">
        <header className="nafe-section__head">
          <div>
            <span className="nafe-eyebrow">Discussions</span>
            <h2 className="nafe-display nafe-section__title">Posts récents</h2>
          </div>
          <span className="nafe-mono nafe-section__count">
            {String(posts.length).padStart(2, "0")} POST{posts.length !== 1 ? "S" : ""}
          </span>
        </header>

        {posts.length === 0 ? (
          <div className="nafe-empty nafe-empty--panel">
            <span className="nafe-mono" style={{ color: accent }}>AUCUN POST</span>
            <p className="nafe-empty__text">Sois le premier à lancer une discussion !</p>
          </div>
        ) : (
          <div className="nafe-posts">
            {posts.map((post) => {
              const postComments = window.store.comments
                .list()
                .filter((c) => c.postId === post.id)
                .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
              const isOpen = openPosts.has(post.id);

              return (
                <article key={post.id} className="nafe-post nafe-clip-card">
                  {/* En-tête auteur / date / supprimer */}
                  <div className="nafe-post__head">
                    <div className="nafe-post__meta">
                      <span className="nafe-mono nafe-post__author" style={{ color: accent }}>
                        {post.authorName}
                      </span>
                      <span className="nafe-mono nafe-post__date">{fmtDate(post.createdAt)}</span>
                    </div>
                    {window.store.isAdmin() && (
                      <button
                        className="nafe-post__del"
                        title="Supprimer le post"
                        onClick={() => {
                          if (confirm("Supprimer ce post et tous ses commentaires ?")) {
                            // supprimer les commentaires liés
                            window.store.comments.list()
                              .filter((c) => c.postId === post.id)
                              .forEach((c) => window.store.comments.remove(c.id));
                            window.store.posts.remove(post.id);
                          }
                        }}
                      >✕</button>
                    )}
                  </div>

                  <h3 className="nafe-display nafe-post__title">{post.title}</h3>
                  <p className="nafe-post__content">{post.content}</p>

                  {/* Pied : likes + toggle commentaires */}
                  <div className="nafe-post__foot">
                    <button
                      className="nafe-post__like"
                      onClick={() => like(post)}
                      style={{ color: accent }}
                    >
                      <span>♥</span>
                      <span className="nafe-mono">{post.likes || 0}</span>
                    </button>
                    <button
                      className="nafe-post__toggle"
                      onClick={() => toggleComments(post.id)}
                      style={{ color: isOpen ? accent : "rgba(255,255,255,0.4)" }}
                    >
                      <span>💬</span>
                      <span className="nafe-mono">
                        {postComments.length} réponse{postComments.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: 10, opacity: 0.6 }}>{isOpen ? "▲" : "▼"}</span>
                    </button>
                  </div>

                  {/* Section commentaires (dépliée) */}
                  {isOpen && (
                    <div className="nafe-comments">
                      {postComments.length > 0 ? (
                        postComments.map((c) => (
                          <div key={c.id} className="nafe-comment">
                            <div className="nafe-comment__head">
                              <span className="nafe-mono nafe-comment__author" style={{ color: accent }}>
                                {c.authorName}
                              </span>
                              <span className="nafe-mono nafe-comment__date">{fmtDate(c.createdAt)}</span>
                              {window.store.isAdmin() && (
                                <button
                                  className="nafe-post__del nafe-post__del--sm"
                                  title="Supprimer"
                                  onClick={() => {
                                    if (confirm("Supprimer ce commentaire ?"))
                                      window.store.comments.remove(c.id);
                                  }}
                                >✕</button>
                              )}
                            </div>
                            <p className="nafe-comment__content">{c.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="nafe-comment__empty">Aucune réponse pour l'instant.</p>
                      )}

                      {/* Formulaire de réponse */}
                      {user ? (
                        <CommentForm postId={post.id} user={user} accent={accent} />
                      ) : (
                        <div className="nafe-comment__login">
                          <button
                            className="nafe-btn nafe-btn--ghost nafe-btn--sm"
                            onClick={() => window.openAuth?.("login")}
                          >
                            Se connecter pour répondre →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

window.CommunityPage = CommunityPage;
