# GUIA DE RAMAS

> ramas del repositorio, flujo de versiones y que rama es la base de cada pull
> request. sirve para decidir el destino de una pr sin tener que preguntarlo.
> sale del estado real a 2026-11-06: `git branch -a` solo muestra `main` y el
> historial es lineal, sin merges (todo se ha commiteado directamente en `main`).

---

## 1. RAMAS PERMANENTES

| rama | funcion |
|---|---|
| `main` | unica rama permanente y rama por defecto; codigo que se despliega en `https://easy-stories.rezzt.dev`; de aqui salen los tags `v<x.y.z>` |

---

## 2. RAMAS DE TRABAJO

nombre en minusculas, con barra y guiones:

| prefijo | uso | ejemplo |
|---|---|---|
| `feature/` | funcionalidad o tema nuevo | `feature/theme-picker` |
| `fix/` | correccion de error | `fix/empty-canvas-cover` |
| `changes/` | estructura, tooling, documentacion, cierre de version | `changes/repo-management-guides` |
| `hotfix/` | urgencia sobre la web publicada | `hotfix/spotify-token` |

- se crean siempre desde `main` actualizada (`git pull --ff-only`).
- una rama, un tema; si el tema crece, se divide.
- una rama de trabajo se borra (local y remota) en cuanto su pr esta fusionada.
- a partir de ahora no se commitea directamente en `main`: todo entra por pr.

---

## 3. FLUJO DE UNA VERSION

```
feature/* , fix/* , changes/* , hotfix/*   →   main   →   tag v<x.y.z> + release
```

| paso | origen | destino | tipo de pr | titulo |
|---|---|---|---|---|
| 1 | `feature/*`, `fix/*`, `changes/*`, `hotfix/*` | `main` | trabajo normal | `<prefijo> \| <resumen>` |
| 2 | `changes/release-<x.y.z>` (commit `changelog`) | `main` | version | `release version <x.y.z> - <resumen>` |
| 3 | `main` | — | despliegue y release de github | `v<x.y.z> — <resumen en ingles>` |

- todos los pasos se fusionan con "create a merge commit".
- antes de abrir una pr se comprueba que el destino no tiene commits que la rama no tenga: `git log <origen>..main`. si los tiene, se actualiza la rama primero (`git merge main`, sin rebase sobre ramas subidas).

---

## 4. CI

- no hay ci: el repositorio no tiene `.github/workflows/`.
- hasta que exista, antes de fusionar se prueba la web a mano con un servidor local (`python -m http.server 8000`) en un navegador de escritorio y uno movil.
- cuando exista ci, no se fusiona una pr con la ci en rojo.

---

## 5. LIMPIEZA

tras fusionar una pr de trabajo:

```
git checkout main
git pull --ff-only
git branch -d <rama>
git push origin --delete <rama>
```

`main` nunca se borra.
