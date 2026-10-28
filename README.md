# La Poeta — Escuela Secundaria N° 17 "Poeta Juan L. Ortiz"

Sitio en React + TypeScript + Vite. Estética inspirada en el shot "Bambambot" (fondo negro, violeta eléctrico, tipografía geométrica, wordmark gigante), con la caricatura de Juan L. Ortiz como mascota.

```bash
npm install
npm run dev          # desarrollo
npm run typecheck    # chequeo de tipos
npm run sync         # trae Drive e Instagram (si están las variables)
npm run build        # build de producción + una página por ruta (GitHub Pages)
```

**Publicar:** ver [DEPLOY.md](DEPLOY.md) (GitHub Pages, dominio, Drive, Instagram).

## Páginas

| Ruta | Página | En la barra de escritorio |
|---|---|---|
| `/` | Inicio: hero, accesos rápidos, talleres, últimas 4 novedades (Instagram), próximas 3 fechas | — (el logo y el nombre llevan al inicio) |
| `/materias` | Bibliografía por materia | ✓ |
| `/tramites` | Trámites con filtros: inscripción (datos del flyer 2027), constancias, mesas, SAGE, pases, netbooks | ✓ |
| `/proyectos` | Proyectos | ✓ |
| `/centro-de-estudiantes` | Centro de Estudiantes | ✓ |
| `/agenda` | Agenda: fechas próximas por mes, filtros por tipo, fechas pasadas | ✓ |
| `/novedades` | Novedades = publicaciones de Instagram | ✓ |
| `/preguntas-frecuentes` | Preguntas frecuentes en formato chat | menú mobile, footer y Trámites |
| `/concursos-docentes` | Llamados del CGE para la escuela (automático) + documentación para descargar | menú mobile, footer y Trámites |
| cualquier otra | 404 | — |

**Navegación:** en escritorio (≥ 1200 px) los links principales están siempre visibles en el header, con la página actual marcada. En mobile y tablet, menú hamburguesa con todas las páginas + Contacto.

### Sumar una página

1. Crear `src/content/pages/mi-pagina.ts` exportando un `PageConfig` (ruta, título, `nav` y secciones).
2. Agregarla al array de `src/content/pages/index.ts`. El orden del array es el orden del menú.

`nav.primary: true` la pone en la barra de escritorio; sin `primary` aparece sólo en el menú desplegable; sin `nav` no aparece en ningún menú (se llega por link).

### Router

`src/router/Router.tsx` es un router mínimo sobre la History API, sin dependencias. Intercepta los clicks en cualquier `<a>` interno, así los componentes siguen usando enlaces normales (`href="/materias"`, `href="/tramites#inscripciones"`) y no dependen del router. Si más adelante hacen falta rutas con parámetros (`/materias/:id`) o carga diferida por página, se reemplaza por react-router sin tocar las páginas.

**Deploy:** como es una SPA, el hosting tiene que responder `index.html` para cualquier ruta.
- GitHub Pages: resuelto con `scripts/prerender.mjs` (un `index.html` por ruta + `404.html`).
- Vercel: `vercel.json` con `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.
- Apache: `FallbackResource /index.html` en `.htaccess`.
- Nginx: `try_files $uri /index.html;`.

## Novedades y Agenda

- **Novedades** son las publicaciones de Instagram (`src/content/instagram.ts`). No hay otra lista de noticias: lo que se publica allá es lo que se ve acá.
- **Agenda** son sólo fechas (`src/content/agenda.ts`): inscripciones, mesas, actos, reuniones, feriados. Lo vencido se oculta solo y queda en "Fechas pasadas"; lo que está en curso se marca en violeta.

### Datos externos: Instagram y Drive

Las Novedades (Instagram) y la Bibliografía (Drive) se traen **en cada deploy**, antes de compilar. No se commitean datos: el workflow `deploy.yml` corre cada 6 horas y en cada push.

```
Instagram API ─┐                         ┌─▶ instagram.generated.json + public/img/ig/*.jpg
               ├─▶ deploy.yml (build) ───┤
Google Drive ──┘                         └─▶ materias.generated.json
                         vite build + rutas ──▶ GitHub Pages
```

- `scripts/sync-instagram.mjs`: últimas 12 publicaciones; descarga las imágenes (las URLs de Instagram vencen); videos usan su miniatura, carruseles la primera foto; texto recortado y sin hashtags.
- `scripts/sync-cge.mjs`: busca en el sitio del CGE (API de WordPress, o RSS si está apagada) y se queda con los títulos que nombran a la escuela: CUE 300-1754, o "N° 17" + "Ortiz". Si el CGE no responde, avisa y el deploy sigue.
- Documentos de concursos: si existe la variable `DRIVE_CONCURSOS_FOLDER`, `sync-drive.mjs` lista esa carpeta como descargas (Google Docs → Word, Planillas → Excel).
- `scripts/sync-drive.mjs`: recorre `Bibliografía/<año>/[Orientación X/]<materia>/archivos` y arma las materias. Estructura y reglas en [DEPLOY.md](DEPLOY.md#5-bibliografía-desde-drive).
- Con `--optional` (como corren en el deploy), si falta la credencial se omiten y la sección muestra su estado vacío. Si la credencial está y la API falla, el deploy se corta y queda online la versión anterior.
- `src/content/instagram.ts` combina lo sincronizado con `manualPosts` (para fijar una publicación con `pinned: true`).
- Los `*.generated.json` del repo están vacíos a propósito; los ejemplos de colores sólo aparecen en `npm run dev`.
- Credenciales: secretos de GitHub, nunca en el código ni en el navegador.

**Probar en local:** `GOOGLE_API_KEY=xxx DRIVE_ROOT_FOLDER=<link> npm run sync:drive` · `INSTAGRAM_ACCESS_TOKEN=xxx npm run sync:instagram` (no commitear los JSON resultantes).

## Header

- Logo: la cara de Juan L. (`public/img/mascota-cara.webp`) + nombre de la escuela. En pantallas < 400 px queda sólo la cara.
- Botón destacado: `site.cta` en `src/content/site.ts`. Hoy es **ESJA** → `/ESJA` (otra pestaña, con ↗).
- Redirecciones (`site.redirects`): `/ESJA` y `/esja` llevan al Google Sites de la ESJA. Funcionan escribiendo la dirección (el build genera una página de redirección) y navegando dentro del sitio. Cuando exista la página propia de la ESJA, se borra la redirección.

## Mascota, favicon e íconos

- `Mascot` (`src/components/blocks/Mascot`) tiene animación al pasar el mouse: la cara sacude la cabeza (`wiggle`) y el cuerpo entero baila (`dance`). Se cambia con la prop `hover` (`'wiggle' | 'dance' | 'none'`). Se apaga sola con "reducir movimiento" del sistema.
- Favicon e íconos (`public/`): `favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`, `icon-192/512.png` y `site.webmanifest` (permite "Agregar a inicio" en el celular). Son la cara de Juan L. con aro violeta.

## Trámites

Cada trámite es un objeto en `src/content/tramites.ts` (modelo en `src/domain/tramites.ts`). La página muestra un filtro por trámite y el detalle del elegido; cada bloque aparece sólo si el dato existe:

- `vigencia` → fechas y estado calculado solo (*Abre el…* / *Abierta hasta el…* / *Cerrada*).
- `horario`, `lugar` → tarjetas de información.
- `requisitos` → documentación tildable; se recuerda en el navegador de cada familia.
- `pasos`, `nota`, `enlaces`.

Cada trámite tiene link propio: `/tramites#sage`, `/tramites#inscripcion`. La alerta del header y el botón "Inscripciones" toman la fecha de cierre de la inscripción, así que se apagan solos.

Datos de contacto (dirección, email, teléfono): `src/content/contacto.ts`, una sola fuente para footer, trámites y FAQ.

## Colores de acento

Además del violeta de marca, magenta y turquesa (los del flyer institucional), en `src/styles/tokens.css`:

| Token | Uso | Texto encima |
|---|---|---|
| `--color-magenta` `#d9267a` | "En curso", íconos de trámites, accesos | blanco (4.7:1) |
| `--color-turquoise` `#2fd6e0` | estado "Abierta", pasos, tildes | `--color-on-turquoise` oscuro (9.7:1) |
| `--color-accent-text` | turquesa como **texto** (kicker de páginas) | cambia por tema para mantener contraste |

`Pill` acepta `variant="magenta"` y `variant="turquoise"`. Los títulos de sección llevan una barrita magenta→turquesa.

## Modo claro / oscuro

- Botón sol/luna en el header. El oscuro es el tema por defecto; la elección se guarda en el navegador.
- Colores en `src/styles/tokens.css`: `:root` es el oscuro y `[data-theme='light']` redefine sólo los colores.
- Texto sobre violeta o sobre fotos: usar siempre `--color-on-primary` / `--color-on-media`, nunca `--color-text`.
- Un script en `index.html` aplica el tema antes de que cargue React (sin parpadeo). Lógica en `src/theme/theme.ts`.

## Arquitectura

```
src/
├── styles/            tokens.css (diseño) + global.css (reset)
├── components/
│   ├── ui/            Capa 1 · primitivos sin dominio: Button, Chip, Pill, Card, Media, Icon, SearchField…
│   └── blocks/        Capa 2 · composiciones: Marquee, FeatureRow, ChatMessage, Mascot, SectionHeader…
├── sections/          Capa 3 · secciones + registry + renderer
├── pages/             Tipo PageConfig, render de página, menú derivado
├── router/            Router liviano
├── layout/            Header (con alerta) y Footer, comunes a todas las páginas
├── domain/            Modelos y lógica sin React (materias, trámites, agenda)
└── content/           Datos editables
    ├── pages/         Una página por archivo
    └── *.ts           Datos compartidos (site, contacto, materias, trámites, agenda, instagram, CE)
```

**Reglas de dependencia** (no se rompen):

- `ui/` no importa de `blocks/` ni de `sections/`.
- `blocks/` importa sólo de `ui/`.
- `sections/` importa de `blocks/` y `ui/`. Los subcomponentes propios de una sección viven en su carpeta (ej. `Library/SubjectCard.tsx`).
- El texto y las fotos viven en `content/`, nunca hardcodeados en componentes.

## Dónde se carga cada contenido

| Qué | Archivo |
|---|---|
| Nombre, alerta urgente, Instagram, footer | `src/content/site.ts` |
| Qué secciones tiene cada página | `src/content/pages/*.ts` |
| Bibliografía por materia | `src/content/materias.ts` (modelo en `src/domain/materias.ts`) |
| Agenda (portada y `/agenda`) | `src/content/agenda.ts` (modelo en `src/domain/agenda.ts`) |
| Novedades / Instagram (portada y `/novedades`) | automático: `instagram.generated.json` (no editar) · manual: `manualPosts` en `src/content/instagram.ts` |
| Centro de Estudiantes | `src/content/centro-estudiantes.ts` |
| Mascota | `public/img/mascota.webp` y `mascota-cara.webp` |

Todo lo marcado `[COMPLETAR]` o `⚠` es un placeholder o texto de ejemplo a reemplazar antes de publicar.

La **alerta** del header se muestra sola mientras `until` no haya pasado; para sacarla antes, borrar `alert`.

## Cada página es configuración

Una página es una lista ordenada de secciones:

```ts
{ type: 'library', id: 'bibliografia', props: { materias } }
```

- **Reordenar**: mover la entrada.
- **Ocultar**: `hidden: true`.
- **Anclas**: el `id` permite links directos como `/tramites#inscripciones`.
- **Tipado**: `SectionConfig` es una unión discriminada; con `type: 'library'`, `props` sólo acepta las props de `Library`. Si falta un campo, no compila.

Las páginas internas arrancan con `pageIntro` (breadcrumb + título grande) en lugar del hero.

## Sumar una sección nueva

1. Crear `src/sections/Calendario/Calendario.tsx` exportando el componente y su tipo de props (`SectionBaseProps & {...}`).
2. Armarla con `<Section>` + bloques existentes. Si necesita algo nuevo y reutilizable, crearlo en `blocks/` (o en `ui/` si es un primitivo).
3. Registrarla en `src/sections/registry.ts`: `calendario: Calendario,`.
4. Usarla en la página que corresponda dentro de `content/pages/`.

## Fotos

`Media` muestra un placeholder con gradiente y el `alt` como guía mientras no haya `src`. Para usar fotos reales, ponelas en `public/img/` y completá `src: '/img/feria.jpg'`.

## Próximos pasos sugeridos

- Ficha por materia (`/materias/:id`) y por proyecto (`/proyectos/:slug`): ahí conviene pasar a react-router.
- Cargar materias y novedades desde un Google Sheet publicado, para que docentes y preceptoría editen sin tocar código.
- Animaciones de entrada al hacer scroll.
