# GUIA DE COMMITS

> como redactar el titulo y la descripcion de un commit. se aplica siempre que
> se pida algo equivalente a "sacame el titulo y la descripcion del commit con
> los cambios desde el ultimo commit" y cada vez que se vaya a crear un commit.
> lee antes `agent-rules.md`: el commit no lleva ningun rastro de ia.

---

## 1. TITULO

```
<prefijo> | <resumen corto en imperativo>
```

- separador fijo: espacio, barra vertical, espacio.
- maximo 72 caracteres; sin punto final; todo en minusculas y sin acentos.
- el resumen describe el conjunto del commit, no un fichero concreto.
- el historial antiguo tiene commits sin formato (`update`, `Rename project ...`); no se reescriben, pero los nuevos siguen esta guia.

### prefijos (cerrados, no se inventan otros)

| prefijo | cuando usarlo |
|---|---|
| `update` | trabajo normal hacia adelante: anade o mejora funcionalidad, temas, contenido o documentacion. es el prefijo por defecto |
| `fix` | corrige un error detectado durante el desarrollo, sin urgencia de publicacion |
| `hotfix` | corrige algo urgente que afecta a la web publicada o bloquea el trabajo |
| `changes` | cambios estructurales o no funcionales: mover o renombrar ficheros, configuracion, tooling, recursos |
| `changelog` | el unico proposito del commit es editar `changelog.md` |

si un commit mezcla un fix y una mejora, se divide en dos. si no es posible, gana el prefijo del cambio principal.

### ejemplos

```
update | anadir el tema nord a los temas oscuros
fix | evitar que el canvas quede vacio si la portada no carga
hotfix | restaurar la busqueda tras el cambio del token de spotify
changes | mover las utilidades de spotify a un unico modulo
changelog | cerrar la seccion de la version 1.0.0
```

---

## 2. DESCRIPCION

- lista de markdown no numerada: cada item empieza por `-`; nunca parrafos sueltos ni listas numeradas.
- cada item es una sola linea continua en imperativo, sin saltos internos y sin lineas en blanco entre items.
- explica el que y el por que, no el detalle linea a linea.
- entre 2 y 6 items; si hacen falta mas, el commit es demasiado grande.
- ficheros, rutas, comandos e identificadores siempre entre backticks.
- no termina con ninguna linea de atribucion, firma ni `co-authored-by` (ver `agent-rules.md`).

ejemplo:

```
- anadir el tema `nord` a `window.STYLES` en `js/config.js` con su patron y colores de insignia
- anadir la opcion al grupo de temas oscuros de `#styleSelect` en `index.html`
- documentar el nuevo tema en la tabla de temas del `README.md`
```

---

## 3. CHANGELOG

todo commit con cambios visibles para usuarios o desarrolladores actualiza `changelog.md` (raiz del repositorio) en el mismo commit, dentro de `## SIN PUBLICAR / UNRELEASED`, en castellano e ingles. las reglas estan en `changelog-guide.md`. solo se exceptuan los commits `changelog` (que ya son el cambio) y los que no tocan nada publicable (por ejemplo, ajustes de `.gitignore` locales).

---

## 4. COMO SE ENTREGA

tres bloques separados, en este orden:

1. titulo del commit.
2. descripcion del commit.
3. fragmento de changelog que se anade (bloque `### CASTELLANO` y bloque `### ENGLISH`, solo con los items nuevos).

nunca se juntan el titulo y la descripcion en el mismo bloque.

---

## 5. COMANDO

si se pide crear el commit, se usa un archivo temporal o dos `-m` (titulo y descripcion), sin plantillas ni pies automaticos:

```
git add <ficheros>
git commit -m "<titulo>" -m "<descripcion>"
```

se anaden los ficheros por nombre, nunca `git add -A` a ciegas; se comprueba antes con `git status` que no entran ficheros ignorados, credenciales ni ficheros de sistema. el repositorio no tiene `.gitignore`, asi que la revision es manual.

---

## 6. LISTA DE COMPROBACION

- [ ] el prefijo es uno de los cinco.
- [ ] el titulo cabe en 72 caracteres y esta en imperativo.
- [ ] cada item ocupa una sola linea y empieza por `-`.
- [ ] el changelog esta actualizado en los dos idiomas.
- [ ] no hay atribucion de ia ni `co-authored-by`.
