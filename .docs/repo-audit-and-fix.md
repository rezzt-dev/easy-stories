# Easy Stories — auditoría y corrección completa del repositorio

> fichero de trabajo para un agente de ia que opera en el clon local de la web estática
> `easy-stories` (html, css y javascript sin dependencias ni build). contiene todo lo necesario
> para auditar y corregir seguridad, documentación, aspectos legales, higiene del repositorio y
> publicación en una sola pasada. `.docs/` está versionado en este repositorio.
>
> cómo usarlo: abre el agente en la raíz de este repositorio y escribe
> `lee .docs/repo-audit-and-fix.md y ejecútalo de principio a fin`.

---

## 0. PROMPT DE LANZAMIENTO

```text
Eres el agente responsable de dejar el repositorio Easy Stories (web estática que genera
imágenes de canciones de Spotify para Instagram Stories) profesional, segura, completa y
consistente con la web publicada en https://easy-stories.rezzt.dev, en inglés y castellano.
Sigue este documento fase por fase, en orden. No es asesoría legal: todo texto legal que redactes
se marca para revisión de un abogado.

Reglas de ejecución:
1. Fase 1 es de solo lectura. Al terminarla, haz TODAS las preguntas de la sección 3 en una sola
   interacción (agrupadas) y espera. No preguntes nada más después, salvo bloqueo real.
   Lo que no se responda se resuelve con el valor "por defecto" de la sección 3 y se anota como
   TODO(owner) en el informe final.
2. Lee antes `claude.md`, `agents.md`, `.docs/manager.md` y las guías de `.docs/-github-guides/`.
   Son la fuente de verdad: si contradicen este documento, gana el repositorio y lo indicas en el
   informe.
3. Nunca ejecutes sin confirmación expresa: push (menos aún forzado), reescritura de historial,
   mover o borrar tags, crear/editar/publicar releases, cambiar ajustes del repo en GitHub,
   desplegar la web, rotar credenciales en el panel de Spotify. Prepara el comando o el paso
   exacto y lístalo en el informe final.
4. Verifica toda afirmación contra el código y contra GitHub (`gh`). No inventes datos legales,
   técnicos, cifras ni capturas. Si falta un dato: `TODO(owner): <qué falta>`.
5. Nunca copies, muestres ni muevas a otro fichero las credenciales de Spotify que hay en
   `js/main.js`; refiérete a ellas por su ubicación.
6. Trabaja en una rama nueva `changes/repo-audit-and-fix` creada desde `main`.
   Commits pequeños y temáticos según la sección 6. Sin push ni PR hasta que yo lo apruebe.
7. Todo documento nuevo o modificado debe existir en inglés y en castellano con paridad exacta.
8. Termina con el informe de la sección 8.
```

---

## 1. CONTEXTO VERIFICADO (a 2026-11-06)

hechos comprobados con `git` y `gh`. el agente debe **re-verificarlos**, no darlos por buenos.

| tema | hallazgo |
|---|---|
| repositorio | `https://github.com/rezzt-dev/easy-stories`, **público**. rama por defecto `main`; es la única rama remota. issues y wiki activados, sin topics. |
| descripción / homepage | "Web application for creating images of your favourite tracks optimised for Instagram Stories." / `https://easy-stories.rezzt.dev`. |
| **credenciales versionadas** | `js/main.js`, función `autofillCredentials` (botón "Autocompletar"), escribe en los campos un **Client ID y un Client Secret de Spotify reales en claro**. el repo es público, así que hay que darlas por expuestas: rotar el secret en el panel de Spotify y retirarlo del código. siguen en el historial aunque se borren. |
| flujo de autenticación | Client Credentials Flow desde el navegador (`btoa(clientId + ':' + clientSecret)` contra `accounts.spotify.com/api/token`): el secret viaja y vive en el cliente por diseño. no hay backend. |
| ramas e historial | solo `main`; 8 commits lineales, sin merges ni pr. el historial mezcla formatos (`update | ...`, `update`, mensajes de la web de GitHub). |
| tags / releases | ninguno. |
| versión | no hay versión en código (no existe `package.json` ni manifiesto). |
| licencia | `LICENSE` MIT, "Copyright (c) 2025 rezzt.dev". GitHub la detecta como `mit`. `README.md` coincide (MIT). |
| ficheros de comunidad | solo `README.md` y `LICENSE`. sin `security`, `contributing`, `code_of_conduct`, plantillas de issue/pr. community profile: 42 %. |
| changelog | no existía; se crea `changelog.md` en la raíz el 2026-11-06 solo con la sección `## SIN PUBLICAR / UNRELEASED`. |
| ci | no hay `.github/`. |
| `.gitignore` | no existe. |
| enlaces rotos | `README.md` y el pie de `index.html` enlazan a `github.com/rezzt-devc` (el usuario **no existe**; el real es `rezzt-dev`); "Live Demo" del README apunta a `#`. |
| idioma | interfaz y comentarios del código en castellano (`lang="es"`); `README.md` solo en inglés. |
| terceros | Google Fonts (Poppins) cargada desde `fonts.googleapis.com` (transfiere la ip del visitante a Google); api y logo de Spotify (`drawSpotifyLogo`) dibujado en la imagen exportada: revisar las condiciones de marca de Spotify. |
| código muerto | `js/spotify-api.js` expone `window.SpotifyAPI`, pero `js/main.js` repite su lógica con `fetch` propio y nadie lo usa. |
| despliegue | no es GitHub Pages (`gh api .../pages` → 404). `easy-stories.rezzt.dev` resuelve a la misma ip que `rezzt.dev`, pero el certificado tls **no cubre** ese subdominio (`curl` falla con "no alternative certificate subject name"). |
| modos de fichero | los 11 ficheros versionados son `100644`. la copia de trabajo del propietario tiene cambios de permisos sin commitear (no tocar). |

---

## 2. FASES

### Fase 1 — auditoría (solo lectura)

1. `git fetch --all --tags`; revisa `git log --oneline --graph --decorate --all` y `git ls-files -s`.
2. Confirma la exposición de credenciales: `git grep -n 'autofillCredentials'` y `git log -S autofillCredentials --oneline` (desde qué commit están). No imprimas los valores.
3. Inventario real: temas de `window.STYLES` en `js/config.js` frente a las `<option>` de `index.html` y la tabla de temas del `README.md`; recursos de `res/`; terceros cargados desde la red (`grep -n 'https://' index.html js/*.js styles/*.css`).
4. Estado del `README.md`: afirmaciones verificables (accesibilidad, "XSS prevention", "30+ temas"), enlaces, estructura del proyecto frente a `git ls-files`.
5. Busca otros secretos y datos personales (`git grep -nIE 'secret|token|password|@'`), ficheros de sistema o de editor versionados.
6. Comprueba la web publicada: certificado tls, qué commit está desplegado (`TODO(owner)` si no se puede saber).
7. Entrega el informe de hallazgos (confirmados / refutados / nuevos) y pasa a la sección 3.

### Fase 2 — seguridad e higiene del repositorio

- **Credenciales de Spotify:** preparar (sin ejecutar) la rotación del Client Secret en el panel de Spotify; retirar el botón "Autocompletar" y `autofillCredentials` o sustituir los valores por campos vacíos. Proponer, con su impacto (reescritura de historial, forks, clones), la purga del historial con `git filter-repo`; alternativa: solo rotar y dejar el historial.
- Proponer el cambio de flujo si se quiere publicar con credenciales propias: Authorization Code con PKCE (sin secret en el cliente) o un backend mínimo que guarde el secret. Documentar el riesgo actual en `agents.md`.
- Crear `.gitignore` mínimo (ficheros de sistema y de editor, `.env*`).
- Revisar `js/spotify-api.js`: eliminar o integrar (decisión de la sección 3).
- Asegurar que `claude.md`/`agents.md` siguen siendo autocontenidos.

### Fase 3 — documentos legales (EN + ES, cada uno con paridad)

formato bilingüe: un único fichero con inglés primero y castellano después, o `X.md` + `X.es.md` enlazados entre sí. elige uno, justifícalo en una línea y aplícalo a todos.

| fichero | contenido mínimo |
|---|---|
| `LICENSE` | MIT actual; solo confirmar titular y año. no requiere traducción (el texto MIT se deja en inglés). |
| `privacy.md` | qué datos trata la web (credenciales que escribe el usuario, búsquedas enviadas a Spotify, ip enviada a Google Fonts), que no hay backend ni almacenamiento propio, terceros y sus políticas, contacto `contacto@rezzt.dev`. valorar alojar Poppins en local para no depender de Google Fonts. |
| `THIRD_PARTY_LICENSES.md` / `NOTICE` | Poppins (verificar licencia: SIL OFL 1.1), uso de la api y del logo de Spotify (condiciones de marca), iconos de `res/`. |
| `security.md` | alcance (web estática), canal privado de informe (preguntar; sugerir GitHub private vulnerability reporting), plazos. sin recompensas. |
| `contributing.md` | servidor local, convención de commits y changelog bilingüe (resumen de `.docs/-github-guides/`), cómo añadir un tema. |
| `.github/` | plantillas de issue y pr bilingües (opcional, preguntar). |

### Fase 4 — readme y changelog

- `README.md` EN + ES: corregir `rezzt-devc` → `rezzt-dev`, enlazar la demo real, quitar afirmaciones no verificables, explicar el riesgo de introducir un Client Secret en el navegador, estructura real del proyecto, licencia MIT.
- Corregir el enlace a GitHub del pie de `index.html` (cambio de código: commit `fix`).
- `changelog.md`: mantener `## SIN PUBLICAR / UNRELEASED` con los ítems de cada commit; cerrar la primera versión solo si el propietario la acuerda (commit `changelog`).

### Fase 5 — revisión técnica y documentación (EN + ES)

- `escapeHtml` en `js/main.js` y `js/spotify-api.js`: la url de la portada (`albumImage`) se interpola sin escapar en `innerHTML`; valorar construir el nodo con `createElement`.
- coherencia de temas: 30 en `window.STYLES`, 30 `<option>`; el `README.md` debe listar los mismos nombres.
- accesibilidad real (etiquetas, foco, contraste) frente a lo que dice el `README.md`.
- capturas: solo si puedes generarlas; si no, `TODO(owner): screenshot <pantalla>`.

### Fase 6 — versión y despliegue (solo preparar)

preparar, sin ejecutar:

1. número de la primera versión (sección 3) y cierre del changelog en `changes/release-<x.y.z>`.
2. texto de release en inglés: título `v<x.y.z> — <summary en minúsculas, sin acentos>`, cuerpo = bloque `### ENGLISH` del changelog con categorías `ADDED / CHANGED / FIXED / REMOVED / SECURITY` y la sección `#### LIVE`.
3. pasos de despliegue en `https://easy-stories.rezzt.dev` (`TODO(owner)`: cómo se sube hoy) y corrección del certificado tls del subdominio.
4. comandos `gh` exactos listos para pegar (tag, release), sin ejecutarlos.

### Fase 7 — metadatos de GitHub (lista para que los aplique el propietario)

descripción en inglés, homepage (comprobar que funciona con https), topics (`spotify`, `instagram-stories`, `canvas`, `javascript`), desactivar wiki si no se usa, private vulnerability reporting, protección de `main` (exigir pr), comandos `gh api` exactos.

---

## 3. DECISIONES A PREGUNTAR (una sola vez, tras la fase 1)

| # | pregunta | por defecto si no hay respuesta |
|---|---|---|
| 1 | qué hacer con las credenciales de Spotify del código | rotar el secret, eliminar `autofillCredentials` y el botón; no purgar el historial |
| 2 | flujo de autenticación a futuro | mantener Client Credentials con credenciales que introduce el usuario y avisar del riesgo |
| 3 | `js/spotify-api.js` sin uso | eliminarlo |
| 4 | número de la primera versión | `1.0.0` sobre el estado actual de `main` tras la auditoría |
| 5 | idioma y formato de los docs raíz | `X.md` bilingüe (EN primero, ES después) |
| 6 | alojar Poppins en local en vez de Google Fonts | `TODO(owner)`; documentar la transferencia en `privacy.md` |
| 7 | correo de contacto para privacidad y seguridad | `contacto@rezzt.dev`; sugerir GitHub private vulnerability reporting |
| 8 | cómo se despliega la web y quién mantiene el certificado | `TODO(owner)` |
| 9 | nombre de la entidad titular | "Juan García Cazallas (rezzt-dev)"; el `LICENSE` actual dice "rezzt.dev" |

---

## 4. REGLAS DE ESTILO

- commits, changelog, pr y release: guías de `.docs/-github-guides/`. changelog en minúsculas y sin acentos; fechas `aaaa-mm-dd`.
- documentación y readme: castellano e inglés con acentos normales; mismo orden, mismos títulos traducidos, mismas tablas y cifras.
- nombres de ficheros, rutas, comandos e identificadores entre backticks.
- sin emojis decorativos, sin superlativos de marketing, sin afirmaciones de "seguro" o "infalible".
- Easy Stories no está afiliada a Spotify ni a Instagram: reflejarlo donde se nombren.

---

## 5. COMPROBACIONES (ejecutar y pegar resultados en el informe)

```bash
# enlaces relativos de todos los markdown
git ls-files '*.md' | while read f; do grep -oE '\]\((\./|\.\./)?[^)#h][^)]*\)' "$f" \
  | sed -E 's/^\]\(|\)$//' | while read l; do
    [ -e "$(dirname "$f")/$l" ] || echo "ROTO: $f -> $l"; done; done

# enlaces al usuario inexistente (debe salir vacío al terminar)
git grep -n 'rezzt-devc'

# credenciales en el código (debe salir vacío al terminar; no imprimir los valores)
git grep -nE "clientSecretInput\.value = '[^']+'" -- js/

# temas definidos vs opciones del selector (deben coincidir)
diff <(grep -oE "^  '[a-z0-9-]+': \{" js/config.js | grep -oE "[a-z0-9-]+" | sort) \
     <(grep -oE 'option value="[a-z0-9-]+"' index.html | grep -oE '"[a-z0-9-]+"' | tr -d '"' | sort)

# acentos en items del changelog (debe salir vacío en las listas)
grep -nP '^- .*[áéíóúñÁÉÍÓÚ]' changelog.md

# sintaxis de los scripts
for f in js/*.js; do node --check "$f" || echo "FALLA: $f"; done

# prueba manual: servidor local y flujo conectar → buscar → personalizar → descargar
python -m http.server 8000
```

---

## 6. PLAN DE COMMITS (rama `changes/repo-audit-and-fix`)

orden sugerido; ajusta al estado real del repo.

1. `fix | retirar las credenciales de spotify escritas en el codigo`
2. `changes | anadir el gitignore y eliminar el modulo spotify-api sin uso` (solo si se acordó)
3. `fix | corregir los enlaces a github del pie y del readme`
4. `update | anadir la politica de privacidad y los avisos de terceros`
5. `update | anadir security y contributing en ingles y castellano`
6. `update | rehacer el readme bilingue con datos verificados`
7. `changelog | cerrar la seccion de changelog para la version <x.y.z>` (solo si se acordó)

cada cuerpo: lista `-` de una línea por ítem, qué y por qué, sin ninguna línea de atribución.

---

## 7. DEFINICIÓN DE HECHO

- [ ] ningún hallazgo de la sección 1 queda sin resolver, propuesto o anotado como `TODO(owner)`
- [ ] no queda ningún Client Secret en el código y la rotación está hecha o lista para el propietario
- [ ] `privacy.md`, `security.md`, `contributing.md`, avisos de terceros y `README.md` existen en EN y ES con paridad
- [ ] no queda ningún enlace a `rezzt-devc` ni a `#` como demo
- [ ] las comprobaciones de la sección 5 pasan o sus fallos están explicados
- [ ] `changelog.md` al día, bilingüe, con categorías de la lista cerrada
- [ ] propuesta de primera release en inglés y pasos de despliegue listos
- [ ] ninguna acción prohibida de la sección 0 se ha ejecutado sin confirmación

---

## 8. INFORME FINAL (formato de entrega)

1. **resumen**: qué se hizo, en cinco líneas como máximo.
2. **hallazgos**: tabla confirmado / refutado / nuevo, con evidencia (comando o ruta).
3. **ficheros**: creados, modificados y eliminados del índice.
4. **decisiones aplicadas**: las respondidas y las resueltas por defecto.
5. **`TODO(owner)`**: lista numerada de datos que faltan.
6. **para revisión legal**: puntos concretos que debe revisar un abogado.
7. **acciones pendientes de mi confirmación**: comandos o pasos exactos (rotación en Spotify, push, PR, tag, release, despliegue, ajustes de GitHub, purga de historial).
8. **título y descripción de la PR** en el formato del repositorio, en bloques de código separados.
