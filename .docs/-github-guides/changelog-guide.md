# GUIA DEL CHANGELOG

> como se escribe y se cierra `changelog.md` (raiz del repositorio). es la
> fuente de verdad de commits, pull requests, merges y releases: nada se
> redacta en paralelo, todo se extrae de aqui.

---

## 1. ESTRUCTURA

```
# CHANGELOG

## SIN PUBLICAR / UNRELEASED

## [x.y.z] - aaaa-mm-dd

### CASTELLANO

#### ANADIDO
- <cambio>

### ENGLISH

#### ADDED
- <change>
```

- la seccion `## SIN PUBLICAR / UNRELEASED` esta siempre arriba y recoge lo que aun no se ha publicado.
- las versiones cerradas van de la mas reciente a la mas antigua.
- cada version lleva `### CASTELLANO` y `### ENGLISH` con paridad exacta de items.
- el changelog se creo el 2026-11-06; el trabajo anterior (creacion de la web, temas, renombrado de saving food a easy stories) no tiene entradas y no se reconstruye.

---

## 2. CATEGORIAS (CERRADAS Y EN ESTE ORDEN)

| castellano | english | que va |
|---|---|---|
| `ANADIDO` | `ADDED` | funcionalidades, temas, ficheros o documentos nuevos |
| `CAMBIADO` | `CHANGED` | cambios en comportamiento, estructura o documentacion existente |
| `CORREGIDO` | `FIXED` | errores corregidos |
| `ELIMINADO` | `REMOVED` | codigo, ficheros o funciones retirados |
| `SEGURIDAD` | `SECURITY` | correcciones o endurecimiento con impacto de seguridad (por ejemplo, retirar credenciales del codigo) |

se omite la categoria que no tenga items. no se crean otras.

---

## 3. REGLAS DE ESTILO

- minusculas y sin acentos en el contenido; titulos y encabezados en mayusculas.
- un item por linea, en imperativo ("anadir", "corregir", "mover"), empezando por `-`.
- ficheros, rutas, comandos e identificadores entre backticks.
- explica el efecto visible o el motivo, no el detalle de implementacion linea a linea.
- sin menciones a herramientas de ia ni a quien escribio el item.

---

## 4. CUANDO SE ACTUALIZA

1. **en cada commit** con cambios visibles: se anaden los items a `## SIN PUBLICAR / UNRELEASED`, en los dos idiomas, en el mismo commit.
2. **al preparar una pr o un merge**: se comprueba que el changelog cubre todo el diff; si falta algo, se anade antes de abrirla.
3. **al cerrar una version**: ver seccion 5.

---

## 5. CERRAR UNA VERSION

1. comprobar que `## SIN PUBLICAR / UNRELEASED` esta completo y con paridad entre idiomas.
2. renombrarlo a `## [x.y.z] - aaaa-mm-dd` (fecha de cierre) y dejar debajo una seccion `## SIN PUBLICAR / UNRELEASED` vacia.
3. no hay version en codigo que subir; si en el futuro se anade un manifiesto con version, se sube en un commit `changes` antes de cerrar.
4. commit con prefijo `changelog`, en una rama `changes/release-<x.y.z>`:

```
changelog | cerrar la seccion de changelog para la version <x.y.z>
```

5. abrir la pr de version (ver `pr-merge-guide.md`) y, al fusionar en `main`, desplegar y crear la release (ver `release-guide.md`).

---

## 6. NUMERACION

- esquema `x.y.z`; la primera version la fija el propietario (no hay ninguna publicada).
- `x` cambia con rupturas grandes (por ejemplo, un cambio de flujo de autenticacion); `y` con funcionalidades o temas nuevos; `z` con correcciones.
- un numero publicado nunca se reutiliza.

---

## 7. LISTA DE COMPROBACION

- [ ] los dos idiomas tienen los mismos items.
- [ ] solo hay categorias de la lista cerrada.
- [ ] ningun item queda sin backticks en identificadores.
- [ ] la fecha de la version cerrada usa `aaaa-mm-dd`.
- [ ] no hay atribucion de ia.
