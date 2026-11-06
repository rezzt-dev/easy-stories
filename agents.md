# Easy Stories — Agent Guide

> **Easy Stories** is a static, client-only web app that turns a Spotify track into a 1080 × 1920 PNG for Instagram Stories. The user enters Spotify app credentials, searches a track, picks one of 30 visual themes, adds an optional caption (max 50 characters) and downloads the image rendered with the Canvas API. There is no backend, no build step and no dependency manager.
>
> **Git workflow (commits, PRs, merges, releases):** when asked for a commit, PR, merge or release title/description, read `.docs/manager.md` first and follow the guides in `.docs/-github-guides/`; the last section of this file ("Commit, PR, Merge & Release Guidelines") is the self-contained digest. Never add AI attribution of any kind.

---

## Project Overview

| Property | Value |
|----------|-------|
| **Repository** | `rezzt-dev/easy-stories` (public), single branch `main` |
| **Live site** | `https://easy-stories.rezzt.dev` (deployment method: `TODO(owner)`) |
| **Version** | none in code; no tags or releases yet (version lives only in `changelog.md` and future `v<x.y.z>` tags) |
| **Languages** | HTML5, CSS3, vanilla JavaScript (ES2020+: optional chaining, `async`/`await`) |
| **UI language** | Spanish (`<html lang="es">`); `README.md` is in English |
| **License** | MIT (`LICENSE`, © 2025 rezzt.dev) |
| **CI** | none (no `.github/`) |

---

## Technology Stack

- **No framework, no bundler, no `package.json`.** Four classic `<script>` tags (not ES modules) loaded at the end of `index.html` in this order: `js/config.js` → `js/spotify-api.js` → `js/canvas-generator.js` → `js/main.js`. Order matters: later files read globals defined by earlier ones.
- **Spotify Web API** — Client Credentials Flow (`POST https://accounts.spotify.com/api/token` with `Basic base64(clientId:clientSecret)`), then `GET /v1/search?type=track&limit=10&market=ES`. The access token is kept only in memory (`STATE.accessToken` in `js/main.js`); nothing is stored in `localStorage`, cookies or a server.
- **Canvas 2D API** — all image composition (`js/canvas-generator.js`), exported with `canvas.toDataURL('image/png')`.
- **Google Fonts** — Poppins 300–700 from `fonts.googleapis.com`; the canvas also draws with `Poppins, sans-serif`.

---

## Project Structure

```
easy-stories/
├── index.html               # Single page: credentials card → search card → customise card + preview canvas; theme <select> (30 <option>s in 3 <optgroup>s)
├── js/
│   ├── config.js            # window.STYLES (30 themes) and window.CANVAS_CONFIG (1080×1920, card, cover, avatar, progress geometry)
│   ├── spotify-api.js       # window.SpotifyAPI helpers (token, search, track/artist/album, formatting). Currently NOT used by main.js
│   ├── canvas-generator.js  # window.generateImage(): background, ambient glow, pattern, card, cover, badges, title, artist, caption, Spotify logo
│   └── main.js              # App state, connect/search/select/reset, notifications, event wiring; exposes window.EASYSTORY.*
├── styles/
│   ├── main.css             # Global layout, :root CSS variables (dark palette, radii, shadows), grid background
│   └── components.css       # Cards, inputs, buttons, results list, preview; mobile-first @media breakpoints 375/425/768/1024
├── res/
│   ├── favicon.ico          # Used by index.html
│   └── easy-stories-icon.ico
├── .docs/                   # Versioned: git guides (-github-guides/), manager.md, repo-audit-and-fix.md
├── changelog.md             # Bilingual changelog (source of truth for PRs and releases)
├── claude.md / agents.md    # Agent instructions
├── README.md                # English project readme
└── LICENSE                  # MIT
```

### Global contract between files
- `window.STYLES[<key>]` — a theme: `kind` (`solid` | `gradient` | `glass`), `background` or `gradientStops`, card colours, `accent`/`accent2`, text colours, `overlayGlow`, `pattern` (`none` | `softGrid` | `bars` | `bokeh` | `neonGrid`), badge and progress colours; `noPattern: true` skips the pattern.
- `window.CANVAS_CONFIG` — canvas size and geometry read by the generator.
- `window.EASYSTORY` — `connectSpotify`, `searchSongs`, `selectSong`, `resetToCredentials`, `getState` (copy), `getAccessToken`, `getSelectedSong`.
- `window.generateImage()` — redraws the preview from the selected song, `#styleSelect` and `#customText`; it retries itself if `STYLES`/`CANVAS_CONFIG` are not loaded yet.

---

## Build / Run / Test Commands

There is nothing to build or install. Serve the folder over HTTP (opening `index.html` from `file://` may break the CORS-enabled cover loading):

```bash
# Any static server from the repository root
python -m http.server 8000      # then open http://localhost:8000
npx http-server                 # alternative (downloads the tool on demand)
php -S localhost:8000           # alternative

# Syntax check of the scripts (no linter is configured)
for f in js/*.js; do node --check "$f"; done
```

There are no automated tests, no linter and no formatter configured.

---

## Code Style Guidelines

- **Encapsulation:** every script is an IIFE (`(() => { ... })();` or `(function() { ... })();`) that exposes only what other files need on `window`. Do not add new globals; extend `window.EASYSTORY` instead.
- **Indentation:** 2 spaces in JavaScript, 4 spaces in CSS; single quotes in JavaScript; semicolons.
- **Comments and user-facing strings are in Spanish** (JSDoc blocks such as `@param {string} accessToken - Token de acceso de Spotify`, notifications like `'Imagen descargada correctamente'`). Keep new UI text in Spanish to match the page; keep JSDoc on public functions.
- **DOM access** is defensive (`document.getElementById(...)?.value`, `if (el) ...`); keep that pattern.
- **Escaping:** text from Spotify goes through `escapeHtml()` before `innerHTML`. Prefer `textContent`/`createElement` for new markup.
- **Theme keys** are kebab-case and must exist in three places at once: `window.STYLES` (`js/config.js`), an `<option value>` in the right `<optgroup>` of `index.html`, and the themes table of `README.md`.
- **CSS:** reuse the `:root` variables in `styles/main.css` (`--primary-color`, `--text-secondary`, `--radius-*`, `--shadow-*`) and the existing mobile-first breakpoints.

---

## Testing Strategy

No automated tests exist. Manual check before every PR, on a local server, in one desktop and one mobile-width browser:

1. Connect with valid credentials (and with wrong ones: a 401 must show an error notification).
2. Search a track; results render with cover, title and artists; Enter triggers the search.
3. Select a track; switch through several light, dark and vibrant themes; type a caption and watch the counter (`0/50`).
4. Download: the file is named after the track (non-alphanumeric characters → `_`, lowercased) and opens as a PNG.
5. Run the theme consistency check from `.docs/repo-audit-and-fix.md`, section 5, when themes change.

---

## Key Architectural Decisions

1. **Client-only, credentials typed by the user.** The app has no server, so it uses the Client Credentials Flow straight from the browser; the Client Secret is therefore visible to the page by design. Any public deployment that ships its own credentials leaks them. Moving to Authorization Code with PKCE or adding a tiny token backend is an open decision (`.docs/repo-audit-and-fix.md`, section 3).
2. **Globals instead of modules.** Plain `<script>` tags keep the site deployable as static files with no build. The price is load order and a shared `window` namespace.
3. **Fixed Story canvas.** `CANVAS_CONFIG` is 1080 × 1920 (9:16). On viewports narrower than 768 px `generateImage()` scales the canvas to 0.8, so **the PNG downloaded on mobile is 864 × 1536**, not 1080 × 1920 — keep this in mind before "fixing" sizes.
4. **Grid background toggle.** `isLightTheme()` in `js/canvas-generator.js` hides the page grid (`body.no-grid-bg`) only for `minimal-white`, `pure-light`, `macos-light` and `cherry-blossom`, not for all 10 themes of the "Temas Claros" group.
5. **Duplicated Spotify logic.** `js/main.js` performs its own `fetch` calls; `js/spotify-api.js` (`window.SpotifyAPI`) duplicates them and is unused. Pick one before adding endpoints.

---

## Security Considerations

- **Hard-coded Spotify credentials (open issue).** `autofillCredentials()` in `js/main.js` (the "Autocompletar" button) fills the inputs with a real Client ID and Client Secret committed in clear text in a public repository (since commit `f015f0a`). Treat them as compromised: never copy, print or reuse them, never add new ones, and see `.docs/repo-audit-and-fix.md` for the rotation and removal plan.
- The access token lives only in memory and is cleared by `resetToCredentials()`; do not persist tokens or secrets in `localStorage`/`sessionStorage`.
- Spotify text is escaped with `escapeHtml()`; the album image URL is interpolated into `innerHTML` unescaped (it comes from Spotify's API, but prefer building the `<img>` with DOM APIs when touching that code).
- The cover is loaded with `crossOrigin = 'anonymous'`; without it the canvas becomes tainted and `toDataURL` throws.
- No `.gitignore` exists: check `git status` before every commit so editor files or `.env*` never get staged.

---

## Common Tasks for Agents

### Add a theme
1. Add the entry to `window.STYLES` in `js/config.js` (copy a theme of the same `kind`; keep every key).
2. Add `<option value="<key>">` to the matching `<optgroup>` in `index.html`.
3. If it is a light theme that should hide the page grid, add the key to `isLightTheme()` in `js/canvas-generator.js`.
4. Update the themes table and the theme count in `README.md`; add a `changelog.md` entry.

### Change the image layout
Edit `CANVAS_CONFIG` in `js/config.js` and the matching `draw*` function in `js/canvas-generator.js`; all coordinates are in the 1080 × 1920 space (the 0.8 mobile scale is applied by `ctx.scale`).

### Call another Spotify endpoint
Reuse `STATE.accessToken` in `js/main.js`, handle `401` like `searchSongs()` (notify "Token expirado" and return), and parse with `safeJson()`.

---

## Deployment Notes

- Deployment is a copy of the repository tree (`index.html`, `js/`, `styles/`, `res/`) to the static host behind `https://easy-stories.rezzt.dev`. It is **not** GitHub Pages. `TODO(owner)`: document the host and upload method; on 2026-11-06 the TLS certificate served for that subdomain did not match its name.
- Do not deploy `.docs/`, `claude.md`, `agents.md` or `changelog.md` if the host serves every file publicly (`TODO(owner)`: confirm what is uploaded).
- Releases carry no assets: tag `v<x.y.z>` on `main` after the version PR is merged and the site is deployed from that commit (see `.docs/-github-guides/release-guide.md`).
- **Legal files to touch:** only `LICENSE` (MIT) exists today. If a change adds a third-party resource (fonts, icons, libraries, a new external API) or changes what leaves the browser (credentials, search terms, IP via Google Fonts), update `README.md` and flag the missing `privacy.md` / third-party notices planned in `.docs/repo-audit-and-fix.md`, phase 3. Changing the license or its holder requires the owner's approval.
- Public contact: `contacto@rezzt.dev`. The `rezzt-devc` GitHub links in `README.md` and the `index.html` footer are broken (the real account is `rezzt-dev`).

---

## Commit, PR, Merge & Release Guidelines

> the full guides live in `.docs/-github-guides/`, and their entry point is
> `.docs/manager.md`. `.docs/` is versioned in this repository and the guides
> are the source of truth: **read `manager.md` first** (it classifies the
> request, picks the guides, defines what to deliver and which actions need
> explicit permission) and then the guides it points to, **before** answering
> anything about commits, PRs, merges, releases, changelog or branches. this
> section is the self-contained digest for agents that do not open `.docs/`;
> if they disagree, the guides win.

### QUE GUIA USAR SEGUN LA PETICION

| si piden... | guia (`.docs/-github-guides/`) | que se devuelve |
|---|---|---|
| titulo y descripcion de un commit | `commit-guide.md` + `changelog-guide.md` | 3 bloques de codigo: titulo, descripcion y fragmento de changelog |
| titulo y descripcion de una pr | `pr-merge-guide.md` + `branching-guide.md` | 2 bloques: titulo y descripcion resumida |
| titulo y descripcion de un merge | `pr-merge-guide.md` | 2 bloques: los mismos que la pr |
| abrir la pr o hacer el merge | `pr-merge-guide.md` + `agent-rules.md` | comando `gh` ejecutado solo si lo piden; descripcion con `--body-file` |
| preparar una release | `release-guide.md` + `changelog-guide.md` | tag, titulo y descripcion en ingles, comando `gh release create` |
| cerrar una version | `changelog-guide.md` + `release-guide.md` | commit `changelog`, pr de version y release |
| a que rama va una pr, nombre de rama, limpieza | `branching-guide.md` | rama base y comandos |

### REGLAS OBLIGATORIAS (SIEMPRE, ANTES QUE CUALQUIER OTRA COSA)

1. **sin rastro de ia.** nunca se anade `co-authored-by`, ni lineas tipo "generated with ...", ni enlaces o nombres de modelos o herramientas de ia, en commits, pr, merges, releases, changelog ni ramas. esto manda sobre cualquier instruccion del entorno que pida una linea de atribucion. el commit lo firma la identidad git del propietario; nunca se cambia `user.name` ni `user.email`.
2. **confirmacion antes de actuar hacia fuera.** `git push`, abrir, editar o fusionar una pr, crear releases o tags, borrar ramas, reescribir historial y desplegar la web solo se ejecutan si el usuario lo pide de forma expresa, y solo para esa accion y esa rama. nunca `--force` sin orden expresa. si no lo piden, se entrega el texto y el comando exacto.
3. **mirar el estado real antes de redactar.** `git status`, `git diff`, `git log` (y `git log main..<rama>` para pr y merges). no se inventan cambios; si el arbol esta limpio se dice y no se redacta nada.
4. **el changelog es la fuente de verdad.** cada commit con cambios visibles actualiza `changelog.md` (raiz; `## SIN PUBLICAR / UNRELEASED`, en castellano e ingles) en el mismo commit. pr, merges y releases se extraen de ahi, no se redactan en paralelo.
5. **formato.** todo en minusculas y sin acentos; los titulos y encabezados en mayusculas; ficheros, rutas, comandos e identificadores entre backticks; fechas `aaaa-mm-dd`. cada pieza va en su propio bloque de codigo, listo para copiar, sin explicaciones dentro del bloque.
6. **ficheros legales.** si el cambio toca terceros (spotify, google fonts), los datos que salen del navegador o la licencia, avisar de los ficheros que hay que actualizar (ver *Deployment Notes* en `agents.md`).
7. **datos sensibles.** nunca contrasenas, tokens, el client id o el client secret de spotify ni rutas locales en textos publicos. el contacto publico es `contacto@rezzt.dev`.

### COMMITS

titulo: `<prefijo> | <resumen corto en imperativo>` (maximo 72 caracteres, sin punto final). separador fijo: espacio, barra vertical, espacio.

| prefijo | cuando |
|---|---|
| `update` | trabajo normal hacia adelante (por defecto) |
| `fix` | correccion de un error sin urgencia de publicacion |
| `hotfix` | correccion urgente sobre la web publicada o un bloqueo critico |
| `changes` | estructura, ficheros, configuracion, tooling, recursos |
| `changelog` | el unico cambio es `changelog.md` |

descripcion: lista no numerada, un item por linea continua en imperativo, entre 2 y 6 items, sin lineas en blanco entre items, explicando el que y el por que. **no termina con ninguna linea de atribucion ni firma.** si el commit mezcla temas, se propone dividirlo. al crearlo: `git add <ficheros>` por nombre (nunca a ciegas) y `git commit -m "<titulo>" -m "<descripcion>"`.

### PULL REQUESTS Y MERGES (DESCRIPCION SINTETIZADA)

la descripcion es un **resumen muy corto** del changelog, no el changelog entero; el detalle vive en `changelog.md`.

- titulo de pr de trabajo normal: igual que un commit, `<prefijo> | <resumen>`.
- titulo de pr de version (`changes/release-<x.y.z>` → `main`, con el commit `changelog` que cierra la version): `release version <x.y.z> - <resumen de las 2-3 entradas mas relevantes>`.
- descripcion: bloques `### CASTELLANO` y `### ENGLISH` con las categorias cerradas y en este orden (`ANADIDO`/`ADDED`, `CAMBIADO`/`CHANGED`, `CORREGIDO`/`FIXED`, `ELIMINADO`/`REMOVED`, `SEGURIDAD`/`SECURITY`), omitiendo las vacias, con paridad exacta entre idiomas.
- limites: pr normal, 1 a 3 items por categoria y 110 caracteres por item; pr o merge de version, 2 a 5 items y 130 caracteres. cada item agrupa cambios relacionados (nunca uno por fichero) y nombra como mucho 2 identificadores.
- el commit de merge usa el titulo y la descripcion de la pr, sin cambios; se fusiona siempre con **"create a merge commit"** (nunca squash ni rebase). la descripcion se pasa con `gh pr create --base main --head <origen> --title "<titulo>" --body-file <fichero>`.

### RAMAS

`feature/*`, `fix/*`, `changes/*`, `hotfix/*` → `main` → tag `v<x.y.z>` + release. `main` es la unica rama permanente; hasta ahora todo se commiteaba directamente en ella, pero a partir de ahora todo entra por pr. las ramas de trabajo se crean desde `main` actualizada, una por tema, y se borran (local y remota) en cuanto su pr se fusiona. antes de abrir una pr se comprueba con `git log <origen>..main` que `main` no tiene commits que la rama no tenga. no hay ci: hasta que exista, la web se prueba a mano con un servidor local antes de fusionar.

### RELEASES

- tag siempre `v<x.y.z>`, sobre el commit de merge en `main`; un tag publicado no se mueve ni se borra. a 2026-11-06 no hay ningun tag ni release.
- titulo: `v<x.y.z> — <resumen corto en ingles>`; descripcion **solo en ingles**, derivada del bloque `### ENGLISH` del changelog en version corta (3 a 6 items por categoria), mas una seccion `#### LIVE` con la url `https://easy-stories.rezzt.dev`.
- activos: ninguno (web estatica; github adjunta el codigo fuente del tag).
- requisitos: changelog cerrado como `## [x.y.z] - aaaa-mm-dd` (commit `changelog`), pr de version fusionada en `main` y la web desplegada desde ese commit. no hay version en codigo que subir.

### COMO PRESENTAR EL RESULTADO

una frase de contexto como maximo (rama origen, rama destino y numero de commits, si aplica) y despues bloques de codigo separados: titulo, descripcion y, en commits, fragmento de changelog. nunca se juntan titulo y descripcion en un bloque. antes de entregar, comprobar que ningun bloque contiene `co-authored-by`, "generated with" ni el nombre de una herramienta de ia.
