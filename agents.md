# EASY-STORIES: REPOSITORY GUIDE

browser application producing shareable music story images from spotify data. this guide covers the repository; nested agent instructions apply within their own folders.

## PROJECT OVERVIEW

| property | verified value |
| --- | --- |
| repository | `rezzt-dev/easy-stories` |
| active source | `./` |
| development base for this change | `main` |
| remote default branch | `main` |
| version source | no application version manifest exists |
| continuous integration | no tracked github actions workflows |

## TECHNOLOGY STACK

- no dependency manifest is present; inspect the source files directly and do not assume an install command

## PROJECT STRUCTURE

- `LICENSE`
- `README.md`
- `changelog.md`
- `index.html`
- `js/`
- `res/`
- `styles/`

management documentation lives in `.docs/manager.md`, `.docs/-github-guides/` and `.docs/repo-audit-and-fix.md`. keep this file and `claude.md` consistent.

## BUILD, RUN AND TEST COMMANDS

no automated repository-wide verification command is configured. serve static content locally when changing the site; validate changed javascript with `node --check <file>` and php with `php -l <file>` where applicable.

## CODE STYLE AND ARCHITECTURAL DECISIONS

escape remote data before inserting html; preserve oauth redirects and story canvas dimensions; do not publish tokens. follow the existing formatter and naming of the changed module. verify manifest versions when dependencies change.

## TESTING STRATEGY

documentation-only changes require `git diff --check`, existing-path checks and a review of the staged file list. run module checks for application changes, with disposable data. report unavailable tooling and failed checks; never claim a check passed without running it.

## SECURITY AND DEPLOYMENT

keep credentials, local configuration, signing material and user data out of commits. do not print secret values while auditing. inspect configuration names and code references instead.

existing legal and community files: `LICENSE`. when changing dependencies, permissions, storage or network services, review those files against the implementation. record missing policies as audit work; do not invent licence terms or ownership decisions.

deployment, signing, store publication, migrations against hosted databases and repository settings require their own explicit request. this documentation task prepares management instructions and pull requests.

## COMMON TASKS

1. read the relevant module and its nearest agent instructions
2. inspect the working tree and choose the smallest change that solves the request
3. update the affected documentation and changelog with evidence from the diff
4. run checks appropriate to the changed module and report their actual results
5. for git operations, follow the manager and the digest below

## EXISTING PROJECT CONVENTIONS

the following project-specific context is retained from the previous guide. paths are relative to the active module when stated. for git operations, the manager and final digest supersede previous workflow examples.

## EASY STORIES — AGENT GUIDE

> **easy stories** is a static, client-only web app that turns a spotify track into a 1080 × 1920 png for instagram stories. the user enters spotify app credentials, searches a track, picks one of 30 visual themes, adds an optional caption (max 50 characters) and downloads the image rendered with the canvas api. there is no backend, no build step and no dependency manager.
>
> **git workflow (commits, prs, merges, releases):** when asked for a commit, pr, merge or release title/description, read `.docs/manager.md` first and follow the guides in `.docs/-github-guides/`; the last section of this file ("commit, pr, merge & release guidelines") is the self-contained digest. never add ai attribution of any kind.

---

## PROJECT OVERVIEW

| property | value |
|----------|-------|
| **repository** | `rezzt-dev/easy-stories` (public), single branch `main` |
| **live site** | `https://easy-stories.rezzt.dev` (deployment method: `TODO(owner)`) |
| **version** | none in code; no tags or releases yet (version lives only in `changelog.md` and future `v<x.y.z>` tags) |
| **languages** | html5, css3, vanilla javascript (es2020+: optional chaining, `async`/`await`) |
| **ui language** | spanish (`<html lang="es">`); `README.md` is in english |
| **license** | mit (`LICENSE`, © 2025 rezzt.dev) |
| **ci** | none (no `.github/`) |

---

## TECHNOLOGY STACK

- **no framework, no bundler, no `package.json`.** four classic `<script>` tags (not es modules) loaded at the end of `index.html` in this order: `js/config.js` → `js/spotify-api.js` → `js/canvas-generator.js` → `js/main.js`. order matters: later files read globals defined by earlier ones.
- **spotify web api** — client credentials flow (`POST https://accounts.spotify.com/api/token` with `Basic base64(clientId:clientSecret)`), then `GET /v1/search?type=track&limit=10&market=ES`. the access token is kept only in memory (`STATE.accessToken` in `js/main.js`); nothing is stored in `localStorage`, cookies or a server.
- **canvas 2d api** — all image composition (`js/canvas-generator.js`), exported with `canvas.toDataURL('image/png')`.
- **google fonts** — poppins 300–700 from `fonts.googleapis.com`; the canvas also draws with `Poppins, sans-serif`.

---

## PROJECT STRUCTURE

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

### GLOBAL CONTRACT BETWEEN FILES
- `window.STYLES[<key>]` — a theme: `kind` (`solid` | `gradient` | `glass`), `background` or `gradientStops`, card colours, `accent`/`accent2`, text colours, `overlayGlow`, `pattern` (`none` | `softGrid` | `bars` | `bokeh` | `neonGrid`), badge and progress colours; `noPattern: true` skips the pattern.
- `window.CANVAS_CONFIG` — canvas size and geometry read by the generator.
- `window.EASYSTORY` — `connectSpotify`, `searchSongs`, `selectSong`, `resetToCredentials`, `getState` (copy), `getAccessToken`, `getSelectedSong`.
- `window.generateImage()` — redraws the preview from the selected song, `#styleSelect` and `#customText`; it retries itself if `STYLES`/`CANVAS_CONFIG` are not loaded yet.

---

## BUILD / RUN / TEST COMMANDS

there is nothing to build or install. serve the folder over http (opening `index.html` from `file://` may break the cors-enabled cover loading):

```bash
# Any static server from the repository root
python -m http.server 8000      # then open http://localhost:8000
npx http-server                 # alternative (downloads the tool on demand)
php -S localhost:8000           # alternative

# Syntax check of the scripts (no linter is configured)
for f in js/*.js; do node --check "$f"; done
```

there are no automated tests, no linter and no formatter configured.

---

## CODE STYLE GUIDELINES

- **encapsulation:** every script is an iife (`(() => { ... })();` or `(function() { ... })();`) that exposes only what other files need on `window`. do not add new globals; extend `window.EASYSTORY` instead.
- **indentation:** 2 spaces in javascript, 4 spaces in css; single quotes in javascript; semicolons.
- **comments and user-facing strings are in spanish** (jsdoc blocks such as `@param {string} accessToken - Token de acceso de Spotify`, notifications like `'Imagen descargada correctamente'`). keep new ui text in spanish to match the page; keep jsdoc on public functions.
- **dom access** is defensive (`document.getElementById(...)?.value`, `if (el) ...`); keep that pattern.
- **escaping:** text from spotify goes through `escapeHtml()` before `innerHTML`. prefer `textContent`/`createElement` for new markup.
- **theme keys** are kebab-case and must exist in three places at once: `window.STYLES` (`js/config.js`), an `<option value>` in the right `<optgroup>` of `index.html`, and the themes table of `README.md`.
- **css:** reuse the `:root` variables in `styles/main.css` (`--primary-color`, `--text-secondary`, `--radius-*`, `--shadow-*`) and the existing mobile-first breakpoints.

---

## TESTING STRATEGY

no automated tests exist. manual check before every pr, on a local server, in one desktop and one mobile-width browser:

1. connect with valid credentials (and with wrong ones: a 401 must show an error notification).
2. search a track; results render with cover, title and artists; enter triggers the search.
3. select a track; switch through several light, dark and vibrant themes; type a caption and watch the counter (`0/50`).
4. download: the file is named after the track (non-alphanumeric characters → `_`, lowercased) and opens as a png.
5. run the theme consistency check from `.docs/repo-audit-and-fix.md`, section 5, when themes change.

---

## KEY ARCHITECTURAL DECISIONS

1. **client-only, credentials typed by the user.** the app has no server, so it uses the client credentials flow straight from the browser; the client secret is therefore visible to the page by design. any public deployment that ships its own credentials leaks them. moving to authorization code with pkce or adding a tiny token backend is an open decision (`.docs/repo-audit-and-fix.md`, section 3).
2. **globals instead of modules.** plain `<script>` tags keep the site deployable as static files with no build. the price is load order and a shared `window` namespace.
3. **fixed story canvas.** `CANVAS_CONFIG` is 1080 × 1920 (9:16). on viewports narrower than 768 px `generateImage()` scales the canvas to 0.8, so **the png downloaded on mobile is 864 × 1536**, not 1080 × 1920 — keep this in mind before "fixing" sizes.
4. **grid background toggle.** `isLightTheme()` in `js/canvas-generator.js` hides the page grid (`body.no-grid-bg`) only for `minimal-white`, `pure-light`, `macos-light` and `cherry-blossom`, not for all 10 themes of the "temas claros" group.
5. **duplicated spotify logic.** `js/main.js` performs its own `fetch` calls; `js/spotify-api.js` (`window.SpotifyAPI`) duplicates them and is unused. pick one before adding endpoints.

---

## SECURITY CONSIDERATIONS

- **hard-coded spotify credentials (open issue).** `autofillCredentials()` in `js/main.js` (the "autocompletar" button) fills the inputs with a real client id and client secret committed in clear text in a public repository (since commit `f015f0a`). treat them as compromised: never copy, print or reuse them, never add new ones, and see `.docs/repo-audit-and-fix.md` for the rotation and removal plan.
- the access token lives only in memory and is cleared by `resetToCredentials()`; do not persist tokens or secrets in `localStorage`/`sessionStorage`.
- spotify text is escaped with `escapeHtml()`; the album image url is interpolated into `innerHTML` unescaped (it comes from spotify's api, but prefer building the `<img>` with dom apis when touching that code).
- the cover is loaded with `crossOrigin = 'anonymous'`; without it the canvas becomes tainted and `toDataURL` throws.
- no `.gitignore` exists: check `git status` before every commit so editor files or `.env*` never get staged.

---

## COMMON TASKS FOR AGENTS

### ADD A THEME
1. add the entry to `window.STYLES` in `js/config.js` (copy a theme of the same `kind`; keep every key).
2. add `<option value="<key>">` to the matching `<optgroup>` in `index.html`.
3. if it is a light theme that should hide the page grid, add the key to `isLightTheme()` in `js/canvas-generator.js`.
4. update the themes table and the theme count in `README.md`; add a `changelog.md` entry.

### CHANGE THE IMAGE LAYOUT
edit `CANVAS_CONFIG` in `js/config.js` and the matching `draw*` function in `js/canvas-generator.js`; all coordinates are in the 1080 × 1920 space (the 0.8 mobile scale is applied by `ctx.scale`).

### CALL ANOTHER SPOTIFY ENDPOINT
reuse `STATE.accessToken` in `js/main.js`, handle `401` like `searchSongs()` (notify "token expirado" and return), and parse with `safeJson()`.

---

## DEPLOYMENT NOTES

- deployment is a copy of the repository tree (`index.html`, `js/`, `styles/`, `res/`) to the static host behind `https://easy-stories.rezzt.dev`. it is **not** github pages. `TODO(owner)`: document the host and upload method; on 2026-11-06 the tls certificate served for that subdomain did not match its name.
- do not deploy `.docs/`, `claude.md`, `agents.md` or `changelog.md` if the host serves every file publicly (`TODO(owner)`: confirm what is uploaded).
- releases carry no assets: tag `v<x.y.z>` on `main` after the version pr is merged and the site is deployed from that commit (see `.docs/-github-guides/release-guide.md`).
- **legal files to touch:** only `LICENSE` (mit) exists today. if a change adds a third-party resource (fonts, icons, libraries, a new external api) or changes what leaves the browser (credentials, search terms, ip via google fonts), update `README.md` and flag the missing `privacy.md` / third-party notices planned in `.docs/repo-audit-and-fix.md`, phase 3. changing the license or its holder requires the owner's approval.
- public contact: `contacto@rezzt.dev`. the `rezzt-devc` github links in `README.md` and the `index.html` footer are broken (the real account is `rezzt-dev`).

---

## ADDITIONAL ENTRY-POINT CONVENTIONS

## Easy Stories — claude.md

> This file exists so any AI agent always has the git workflow rules of this
> repository at hand. For the project overview, structure, run commands and
> code style, see [`agents.md`](./agents.md) — this file only carries the
> commit / PR / merge / release conventions.
>
> **When the user asks for a commit, PR, merge or release title/description,
> follow the section below first. Never add AI attribution of any kind.**
>
> repository layout: static site with no build step. `index.html` at the root,
> scripts in `js/`, styles in `styles/`, icons in `res/`. `changelog.md`,
> `LICENSE` (MIT) and `README.md` live at the root; there are no community
> files (`security`, `contributing`, `code_of_conduct`), no `.github/` and no CI.
> `.docs/` is versioned and holds the git guides and the audit plan.
>
> **security warning:** `js/main.js` (`autofillCredentials`) contains real
> Spotify credentials in clear text. Never copy, quote or extend them; see
> `.docs/repo-audit-and-fix.md`, section 1.

## COMMIT, PR, MERGE & RELEASE GUIDELINES

read `.docs/manager.md` first, then the selected guide in `.docs/-github-guides/`. these files are versioned; this digest also works without opening them.

| request | guide |
| --- | --- |
| commit title, body and changelog | `commit-guide.md`, `changelog-guide.md` |
| pull request or merge | `pr-merge-guide.md`, `branching-guide.md` |
| version and release | `release-guide.md`, `changelog-guide.md` |
| permissions and sensitive data | `agent-rules.md` |

- inspect `git status`, both diffs and recent history before describing changes
- use `<prefix> | <imperative summary>` with `update`, `fix`, `hotfix`, `changes` or `changelog`; keep titles within 72 characters
- write commit bodies as 2 to 6 markdown bullets, one logical change per line, with literal paths in backticks
- never add authorship footers, automated attribution, signatures or generation notices; preserve the configured git identity
- update `changelog.md` under `## SIN PUBLICAR / UNRELEASED` in matching `### CASTELLANO` and `### ENGLISH` sections
- use the existing changelog category vocabulary and preserve language parity; describe only changes in the actual diff
- summarize pull requests in 1 to 3 bullets per category and language, at most 110 characters per bullet
- documentation and repository-management work targets `main`; the remote default is `main`; do not silently promote development work to the default branch
- the authorization for a requested action remains valid throughout that task; creating a pull request includes pushing its branch, but does not authorize merging or publishing
- use merge commits when a merge is requested; never force-push, rewrite published history or remove branches without an explicit instruction
- releases use the approved version and an immutable tag on the verified release commit, with english notes from the closed changelog; do not create a release for documentation work
- deliver requested titles, bodies and changelog fragments in separate code blocks; report executed actions with their commit hash or pull request link
