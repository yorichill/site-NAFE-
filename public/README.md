# Prototype Claude Design

Export autonome du design validé sur claude.ai/design (artifact `466afe93`).

React 18 + Babel standalone — **aucune étape de build**. Ouvre `index.html`
directement dans un navigateur moderne (ou sers le dossier avec n'importe
quel serveur statique).

```bash
# depuis la racine du repo
npx serve design
# ou
python -m http.server --directory design 8080
```

## Contenu

| Fichier                  | Rôle                                     |
| ------------------------ | ---------------------------------------- |
| `index.html`             | Shell React + routing par hash           |
| `src/nafe.css`           | Tous les styles (tokens, anims, layouts) |
| `src/data.jsx`           | Données (rosters, news, calendrier)      |
| `src/shell.jsx`          | Sidebar + Header + ScoreTicker           |
| `src/playercard.jsx`     | Carte joueur                             |
| `src/page-hub.jsx`       | `/`                                      |
| `src/page-team.jsx`      | `/teams/:game`                           |
| `src/page-club.jsx`      | `/club`                                  |
| `src/page-live.jsx`      | `/live`                                  |
| `src/page-news.jsx`      | `/news`                                  |
| `src/page-calendar.jsx`  | `/calendar`                              |

## Prochaine étape

Ce prototype est la référence visuelle. Le scaffold Next.js à la racine
(`app/`, `components/`, `lib/`) est la cible de production — les composants
seront portés progressivement depuis `design/src/*.jsx` vers TSX typé.
