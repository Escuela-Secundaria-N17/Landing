#!/usr/bin/env node
/**
 * Trae del sitio del CGE (WordPress) los llamados a concurso de la escuela.
 *
 *   node scripts/sync-cge.mjs
 *
 * El buscador web del CGE no es confiable, así que:
 *   1. Busca con la API de WordPress (/wp-json/wp/v2/posts?search=…) y, si está
 *      deshabilitada, con el feed RSS de la búsqueda (/?s=…&feed=rss2).
 *   2. Se queda sólo con los títulos que identifican a la escuela:
 *        - el CUE (300-1754, 3001754, 300 1754…), o
 *        - "N° 17" (Nº17, N 17, Nro. 17…) junto con "Ortiz".
 *      Los títulos del CGE siguen el formato
 *      "Dptal.Pná.-LLAMADO A CONCURSO HORAS CÁTEDRAS – ESC.SEC.Nº17 "…" CUE 300-1754…".
 *
 * Escribe src/content/concursos.generated.json (sólo si cambió).
 * El CGE es un sitio externo: si falla, avisa y NO corta el deploy (el sitio se
 * publica con lo que haya). Con --strict sí sale con error (útil para probar).
 *
 * Variables opcionales: CGE_BASE, CGE_CUE (3001754), CGE_NUMERO (17), CGE_NOMBRE (Ortiz).
 * Sin dependencias: Node 20+.
 */
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.SYNC_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.CGE_BASE ?? 'https://cge.entrerios.gov.ar').replace(/\/$/, '');
const CUE = process.env.CGE_CUE ?? '3001754';
const NUMERO = process.env.CGE_NUMERO ?? '17';
const NOMBRE = process.env.CGE_NOMBRE ?? 'Ortiz';
const OUT_JSON = path.join(ROOT, 'src/content/concursos.generated.json');
const STRICT = process.argv.includes('--strict');
const MAX = 30;

const log = (...a) => console.log('[cge]', ...a);
const warn = (...a) => console.log('::warning::[cge]', ...a);

// ── Coincidencia ────────────────────────────────────────────────────────────
const sep = '[\\s.\\-–/]{0,3}';
const cueRe = new RegExp(`${CUE.slice(0, 3)}${sep}${CUE.slice(3)}(?!\\d)`);
const numeroRe = new RegExp(`\\bN(?:ro|ú?m(?:ero)?)?\\s*\\.?\\s*[°ºo]?\\s*\\.?\\s*${NUMERO}(?!\\d)`, 'i');
const nombreRe = new RegExp(NOMBRE, 'i');

export const esDeLaEscuela = (titulo) => cueRe.test(titulo) || (numeroRe.test(titulo) && nombreRe.test(titulo));

// ── Limpieza de títulos ─────────────────────────────────────────────────────
const ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', hellip: '…', ordm: 'º', deg: '°' };
export const decode = (s) =>
  String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();

/** Saca el prefijo administrativo ("Dptal.Pná.-") que no le dice nada a un docente. */
export const limpiarTitulo = (t) => decode(t).replace(/^dptal\.?\s*p[a-zá]*\.?\s*[-–]\s*/i, '');

const isoDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(date);
};

// ── Fuentes ─────────────────────────────────────────────────────────────────
const UA = { 'User-Agent': 'secundaria17lapoeta.edu.ar (sync de concursos)', Accept: '*/*' };

async function get(url) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20_000) });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} en ${url}`);
  return { body, type: res.headers.get('content-type') ?? '' };
}

async function viaRest(term) {
  const params = new URLSearchParams({ search: term, per_page: '100', orderby: 'date', order: 'desc', _fields: 'date,link,title' });
  const { body } = await get(`${BASE}/wp-json/wp/v2/posts?${params}`);
  const data = JSON.parse(body);
  if (!Array.isArray(data)) throw new Error('respuesta inesperada de la API');
  return data.map((p) => ({ titulo: p.title?.rendered ?? '', href: p.link, fecha: p.date }));
}

async function viaRss(term) {
  const { body } = await get(`${BASE}/?s=${encodeURIComponent(term)}&feed=rss2`);
  if (!body.includes('<item')) return [];
  return [...body.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    titulo: item.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '',
    href: decode(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? ''),
    fecha: item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? '',
  }));
}

/** Términos de búsqueda: los últimos 4 dígitos del CUE encuentran "300-1754" y "3001754". */
const TERMINOS = [CUE.slice(-4), CUE, NOMBRE];

async function buscar() {
  let fuente = 'api';
  const resultados = [];
  for (const term of TERMINOS) {
    if (fuente === 'rss') {
      resultados.push(...(await viaRss(term)));
      continue;
    }
    try {
      resultados.push(...(await viaRest(term)));
    } catch (error) {
      log(`API de WordPress no disponible (${error.message}); se usa el feed RSS`);
      fuente = 'rss';
      resultados.push(...(await viaRss(term)));
    }
  }
  return { fuente, resultados };
}

async function main() {
  let llamados;
  try {
    const { fuente, resultados } = await buscar();
    const vistos = new Set();
    llamados = resultados
      .map((r) => ({ titulo: limpiarTitulo(r.titulo), href: r.href, fecha: isoDate(r.fecha) }))
      .filter((r) => r.href && r.fecha && esDeLaEscuela(r.titulo))
      .filter((r) => !vistos.has(r.href) && vistos.add(r.href))
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, MAX)
      .map(({ fecha, titulo, href }) => ({ fecha, titulo, href }));
    log(`${resultados.length} resultados (${fuente}), ${llamados.length} de la escuela`);
  } catch (error) {
    const msg = `no se pudo consultar el CGE: ${error.message}`;
    if (STRICT) {
      console.error(`[cge] ERROR: ${msg}`);
      process.exit(1);
    }
    warn(`${msg}. Se publica sin cambios en los llamados.`);
    return;
  }

  const previous = existsSync(OUT_JSON) ? JSON.parse(await readFile(OUT_JSON, 'utf8')) : { llamados: [] };
  if (JSON.stringify(previous.llamados) === JSON.stringify(llamados)) {
    log('sin cambios');
    return;
  }
  await writeFile(OUT_JSON, `${JSON.stringify({ syncedAt: new Date().toISOString(), llamados }, null, 2)}\n`);
  log(`actualizado ${path.relative(ROOT, OUT_JSON)}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
