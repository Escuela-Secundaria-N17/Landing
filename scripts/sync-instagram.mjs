#!/usr/bin/env node
/**
 * Sincroniza las últimas publicaciones de Instagram de la escuela.
 *
 *   INSTAGRAM_ACCESS_TOKEN=xxx node scripts/sync-instagram.mjs [--refresh]
 *
 * Qué hace:
 *   1. (opcional, --refresh) Renueva el token de larga duración (dura 60 días).
 *   2. Pide las últimas N publicaciones a la API de Instagram (Instagram API
 *      with Instagram Login; requiere cuenta profesional: Creador o Empresa).
 *   3. Descarga cada imagen a public/img/ig/<id>.jpg — las URLs del CDN de
 *      Instagram vencen, por eso no se enlazan directo.
 *   4. Escribe src/content/instagram.generated.json, que alimenta las tarjetas
 *      de Novedades. Sólo reescribe el archivo si algo cambió (no genera commits vacíos).
 *
 * Si la API falla, sale con error SIN tocar nada: el sitio sigue con lo último bueno.
 * Sin dependencias: Node 20+ (fetch nativo).
 * --optional: si falta el token, avisa y sale sin error (el sitio muestra "Seguinos en Instagram").
 *
 * Variables de entorno:
 *   INSTAGRAM_ACCESS_TOKEN   (obligatoria) token de larga duración
 *   INSTAGRAM_LIMIT          cantidad de publicaciones (default 12)
 *   INSTAGRAM_API_BASE       default https://graph.instagram.com/v26.0
 *   INSTAGRAM_TOKEN_OUT      si --refresh devuelve un token nuevo, se escribe en este archivo
 *   SYNC_ROOT                raíz del proyecto (default: la carpeta padre de scripts/)
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.SYNC_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = (process.env.INSTAGRAM_API_BASE ?? 'https://graph.instagram.com/v26.0').replace(/\/$/, '');
const LIMIT = Number(process.env.INSTAGRAM_LIMIT ?? 12);
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const IMG_DIR = path.join(ROOT, 'public/img/ig');
const IMG_URL = '/img/ig';
const OUT_JSON = path.join(ROOT, 'src/content/instagram.generated.json');
const TIME_ZONE = 'America/Argentina/Buenos_Aires';
const CAPTION_MAX = 160;
const TONES = ['violet', 'dusk', 'ocean', 'forest', 'ember', 'night'];

const log = (...args) => console.log('[instagram]', ...args);

function fail(message) {
  console.error(`[instagram] ERROR: ${message}`);
  process.exit(1);
}

/** Nunca mostrar el token en logs ni errores. */
const redact = (text) => (TOKEN ? String(text).split(TOKEN).join('***') : String(text));

async function getJson(url) {
  const res = await fetch(url);
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${redact(body).slice(0, 300)}`);
  return JSON.parse(body);
}

/** Primer párrafo del texto, sin hashtags sueltos al final, recortado a CAPTION_MAX. */
export function cleanCaption(raw = '') {
  const firstParagraph = raw.split(/\n\s*\n/)[0] ?? '';
  const text = firstParagraph
    .replace(/(\s*#[\p{L}\p{N}_]+)+\s*$/u, '') // hashtags al final
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= CAPTION_MAX) return text;
  return `${text.slice(0, CAPTION_MAX).replace(/\s+\S*$/, '')}…`;
}

/** "2026-10-07T23:30:00+0000" → fecha local argentina "2026-10-07". */
export function localDate(timestamp) {
  const date = new Date(timestamp.replace(/([+-]\d{2})(\d{2})$/, '$1:$2'));
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

async function refreshToken() {
  const url = `${API.replace(/\/v\d+\.\d+$/, '')}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(TOKEN)}`;
  try {
    const data = await getJson(url);
    const days = Math.round((data.expires_in ?? 0) / 86400);
    log(`token renovado: vence en ~${days} días`);
    if (data.access_token && data.access_token !== TOKEN && process.env.INSTAGRAM_TOKEN_OUT) {
      await writeFile(process.env.INSTAGRAM_TOKEN_OUT, data.access_token, { mode: 0o600 });
      log('la API devolvió un token nuevo: guardado para actualizar el secreto');
    }
  } catch (error) {
    // Meta sólo deja renovar tokens con más de 24 h: no es motivo para cortar la sincronización.
    log(`aviso: no se pudo renovar el token (${error.message}). Se sigue con el actual.`);
  }
}

async function fetchMedia() {
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `${API}/me/media?fields=${fields}&limit=${LIMIT}&access_token=${encodeURIComponent(TOKEN)}`;
  const data = await getJson(url);
  if (!Array.isArray(data.data)) throw new Error('respuesta inesperada de la API (falta "data")');
  return data.data.slice(0, LIMIT);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`imagen ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const toneFor = (id) => TONES[parseInt(createHash('md5').update(id).digest('hex').slice(0, 6), 16) % TONES.length];

async function main() {
  if (!TOKEN) {
    const msg = 'falta INSTAGRAM_ACCESS_TOKEN (ver DEPLOY.md → "Novedades desde Instagram")';
    if (process.argv.includes('--optional')) {
      log(`${msg}. Se omite la sincronización.`);
      return;
    }
    fail(msg);
  }

  if (process.argv.includes('--refresh')) await refreshToken();

  let media;
  try {
    media = await fetchMedia();
  } catch (error) {
    fail(`no se pudieron leer las publicaciones: ${error.message}`);
  }
  log(`${media.length} publicaciones recibidas`);

  await mkdir(IMG_DIR, { recursive: true });
  const posts = [];
  for (const item of media) {
    // Videos/reels: la miniatura. Carruseles: media_url ya es la primera imagen.
    const source = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
    const file = `${item.id}.jpg`;
    let image;
    if (source) {
      const dest = path.join(IMG_DIR, file);
      try {
        if (!existsSync(dest)) await download(source, dest);
        image = `${IMG_URL}/${file}`;
      } catch (error) {
        log(`aviso: sin imagen para ${item.id} (${error.message}); se usa un fondo de color`);
      }
    }
    posts.push({
      url: item.permalink,
      caption: cleanCaption(item.caption) || 'Ver publicación en Instagram',
      date: localDate(item.timestamp),
      ...(image ? { image } : { tone: toneFor(item.id) }),
    });
  }

  // Borrar imágenes de publicaciones que ya no se muestran
  const keep = new Set(posts.map((p) => p.image && path.basename(p.image)).filter(Boolean));
  for (const name of await readdir(IMG_DIR)) {
    if (/^\d+\.jpg$/.test(name) && !keep.has(name)) {
      await rm(path.join(IMG_DIR, name));
      log(`imagen vieja eliminada: ${name}`);
    }
  }

  const previous = existsSync(OUT_JSON) ? JSON.parse(await readFile(OUT_JSON, 'utf8')) : { posts: [] };
  if (JSON.stringify(previous.posts) === JSON.stringify(posts)) {
    log('sin cambios');
    return;
  }
  const out = { syncedAt: new Date().toISOString(), posts };
  await writeFile(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`);
  log(`actualizado ${path.relative(ROOT, OUT_JSON)} (${posts.length} publicaciones)`);
}

main();
