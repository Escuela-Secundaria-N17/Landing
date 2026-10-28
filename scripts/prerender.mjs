#!/usr/bin/env node
/**
 * Post-build para GitHub Pages (corre después de `vite build`).
 *
 * GitHub Pages sólo sirve archivos: sin esto, recargar /materias da 404.
 * Por cada página de src/content/pages genera dist/<ruta>/index.html (copia
 * del index con su <title>, descripción y metadatos para compartir), más:
 *   - dist/404.html   → rutas inexistentes: la SPA muestra "No encontramos esta página"
 *   - dist/<ruta>/index.html por cada redirección de site.redirects (ej. /ESJA)
 *   - dist/sitemap.xml y dist/robots.txt
 *
 *   node scripts/prerender.mjs        (dominio: site.url, o SITE_URL para pisarlo)
 *
 * Lee la lista de páginas del mismo código que usa el sitio (vía esbuild),
 * así nunca hay que mantener una lista aparte.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = process.env.PRERENDER_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, process.env.PRERENDER_DIST ?? 'dist');
let SITE_URL = '';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function loadContent() {
  const out = path.join(os.tmpdir(), `prerender-${process.pid}.mjs`);
  await build({
    stdin: {
      contents: "export { pages } from './src/content/pages/index.ts';\nexport { site } from './src/content/site.ts';",
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: out,
    alias: { '@': path.join(ROOT, 'src') },
    define: { 'import.meta.env.DEV': 'false' },
    logLevel: 'error',
  });
  try {
    return await import(pathToFileURL(out).href);
  } finally {
    await rm(out, { force: true });
  }
}

/** La descripción de una página: la suya, o la de su cabecera (pageIntro). */
function describe(page, fallback) {
  if (page.description) return page.description;
  const intro = page.sections.find((s) => s.type === 'pageIntro');
  return intro?.props?.description ?? fallback;
}

function render(template, { title, description, url, noindex }) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:locale" content="es_AR" />`,
    noindex ? `<meta name="robots" content="noindex" />` : '',
    url ? `<meta property="og:url" content="${esc(url)}" />` : '',
    url ? `<link rel="canonical" href="${esc(url)}" />` : '',
    SITE_URL ? `<meta property="og:image" content="${esc(SITE_URL)}/icon-512.png" />` : '',
  ].filter(Boolean);
  return html.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`);
}

async function main() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const fallback = template.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const { pages, site } = await loadContent();
  SITE_URL = (process.env.SITE_URL || site.url || '').replace(/\/$/, '');
  const siteTitle = `${site.shortName} · ${site.name}`;

  const routes = pages.filter((p) => p.path.startsWith('/'));
  for (const page of routes) {
    const title = page.path === '/' ? siteTitle : `${page.title} · ${siteTitle}`;
    const url = SITE_URL ? `${SITE_URL}${page.path === '/' ? '/' : `${page.path}/`}` : '';
    const dir = path.join(DIST, page.path);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), render(template, { title, description: describe(page, fallback), url }));
  }

  // Redirecciones: página mínima que funciona aunque no haya JavaScript
  for (const r of site.redirects ?? []) {
    const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(r.label)} · ${esc(siteTitle)}</title>
    <meta http-equiv="refresh" content="0; url=${esc(r.to)}" />
    <meta name="robots" content="noindex" />
    <link rel="canonical" href="${esc(r.to)}" />
    <script>location.replace(${JSON.stringify(r.to)});</script>
    <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000;color:#fff;font:16px system-ui,sans-serif}a{color:#2fd6e0}</style>
  </head>
  <body><p>Te llevamos al <a href="${esc(r.to)}">${esc(r.label)}</a>…</p></body>
</html>
`;
    for (const from of r.from) {
      const dir = path.join(DIST, from);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, 'index.html'), html);
    }
  }

  await writeFile(
    path.join(DIST, '404.html'),
    render(template, { title: `Página no encontrada · ${siteTitle}`, description: fallback, noindex: true }),
  );

  if (SITE_URL) {
    const urls = routes.map((p) => `  <url><loc>${SITE_URL}${p.path === '/' ? '/' : `${p.path}/`}</loc></url>`).join('\n');
    await writeFile(
      path.join(DIST, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
    await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  } else {
    console.log('[prerender] aviso: sin SITE_URL no se generan sitemap.xml, robots.txt ni URLs canónicas');
  }

  const redirs = (site.redirects ?? []).flatMap((r) => r.from).join(', ');
  console.log(`[prerender] ${routes.length} rutas + 404.html${redirs ? ` + redirecciones (${redirs})` : ''}${SITE_URL ? ` + sitemap.xml (${SITE_URL})` : ''}`);
}

main().catch((error) => {
  console.error('[prerender] ERROR:', error.message);
  process.exit(1);
});
