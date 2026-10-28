#!/usr/bin/env node
/**
 * Arma la Bibliografía a partir de una carpeta de Google Drive.
 *
 *   GOOGLE_API_KEY=xxx DRIVE_ROOT_FOLDER=<id o link> node scripts/sync-drive.mjs [--optional]
 *
 * Estructura que se lee (nombres de carpeta libres, salvo el número de año):
 *
 *   Bibliografía/                         ← DRIVE_ROOT_FOLDER
 *   ├── 1° año/
 *   │   ├── Lengua y Literatura/          ← una carpeta por materia
 *   │   │   ├── Programa 2026.pdf         ← cada archivo = un material
 *   │   │   └── Cuadernillo de lectura.pdf
 *   │   └── Matemática/
 *   ├── 4° año/
 *   │   ├── Orientación Economía/         ← opcional: agrupa materias de una orientación
 *   │   │   └── Economía/
 *   │   └── Educación Física/             ← materia común a todas las orientaciones
 *   └── …
 *
 * - El tipo de material sale del nombre del archivo: "Programa…", "Cuadernillo…",
 *   "Pautas…"/"Examen…"/"Previo…", "Libro…"/"Antología…". Si no, queda como "Documento".
 * - Un año (2026) en el nombre se toma como ciclo lectivo.
 * - Las subcarpetas dentro de una materia se recorren y su nombre se antepone al título.
 * - Los archivos tienen que estar compartidos como "Cualquier persona con el enlace"
 *   (lo heredan de la carpeta raíz) para que estudiantes y familias puedan abrirlos.
 *
 * Escribe src/content/materias.generated.json. Si Drive falla, sale con error sin tocar nada.
 * --optional: si faltan las variables, avisa y sale sin error (útil en CI antes de configurarlas).
 * Sin dependencias: Node 20+.
 */
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.SYNC_ROOT ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = (process.env.DRIVE_API_BASE ?? 'https://www.googleapis.com/drive/v3').replace(/\/$/, '');
const KEY = process.env.GOOGLE_API_KEY;
const ROOT_INPUT = process.env.DRIVE_ROOT_FOLDER ?? '';
const OUT_JSON = path.join(ROOT, 'src/content/materias.generated.json');
const OPTIONAL = process.argv.includes('--optional');
const FOLDER = 'application/vnd.google-apps.folder';
const SHORTCUT = 'application/vnd.google-apps.shortcut';
const MAX_DEPTH = 3; // subcarpetas dentro de una materia

const log = (...a) => console.log('[drive]', ...a);
const warn = (...a) => console.log('[drive] aviso:', ...a);
const fail = (m) => {
  console.error(`[drive] ERROR: ${m}`);
  process.exit(1);
};
const redact = (t) => (KEY ? String(t).split(KEY).join('***') : String(t));

/** Acepta el ID o el link completo de la carpeta (con o sin ?resourcekey=). */
export function parseFolder(input) {
  const s = input.trim();
  const id = s.match(/folders\/([\w-]+)/)?.[1] ?? s.match(/[?&]id=([\w-]+)/)?.[1] ?? (/^[\w-]{10,}$/.test(s) ? s : null);
  const resourceKey = s.match(/[?&]resourcekey=([\w-]+)/i)?.[1];
  return id ? { id, resourceKey } : null;
}

// Carpetas compartidas antes de 2021 pueden necesitar su "resource key" para listarse.
const resourceKeys = new Map();

async function list(folderId) {
  const files = [];
  let pageToken;
  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken,files(id,name,mimeType,webViewLink,resourceKey,shortcutDetails)',
      pageSize: '1000',
      orderBy: 'name_natural',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
      key: KEY,
    });
    if (pageToken) params.set('pageToken', pageToken);
    const headers = {};
    const rk = resourceKeys.get(folderId);
    if (rk) headers['X-Goog-Drive-Resource-Keys'] = `${folderId}/${rk}`;
    const res = await fetch(`${API}/files?${params}`, { headers });
    const body = await res.text();
    if (!res.ok) throw new Error(`${res.status} ${redact(body).slice(0, 300)}`);
    const data = JSON.parse(body);
    for (const f of data.files ?? []) if (f.resourceKey) resourceKeys.set(f.id, f.resourceKey);
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return files;
}

const isFolder = (f) => f.mimeType === FOLDER || (f.mimeType === SHORTCUT && f.shortcutDetails?.targetMimeType === FOLDER);
const folderTarget = (f) => (f.mimeType === SHORTCUT ? f.shortcutDetails.targetId : f.id);

/** "1° año", "1er año", "Primer año", "1" → 1 */
export function parseAnio(name) {
  const n = name.trim().toLowerCase();
  const digit = n.match(/^([1-6])(?!\d)/)?.[1];
  if (digit) return Number(digit);
  const words = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto'];
  const i = words.findIndex((w) => n.startsWith(w));
  return i >= 0 ? i + 1 : null;
}

export function tipoDe(nombre) {
  const n = nombre.toLowerCase();
  if (/\bprograma/.test(n)) return 'programa';
  if (/\bcuadernillo/.test(n)) return 'cuadernillo';
  if (/\b(pauta|examen|previo|recuperatorio)/.test(n)) return 'pautas';
  if (/\b(libro|antolog|manual)/.test(n)) return 'libro';
  return 'documento';
}

const sinExtension = (name) => name.replace(/\.(pdf|docx?|pptx?|xlsx?|odt|txt|jpe?g|png)$/i, '').trim();
const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function materiales(folderId, prefix = '', depth = 0) {
  const out = [];
  for (const f of await list(folderId)) {
    if (isFolder(f)) {
      if (depth < MAX_DEPTH) out.push(...(await materiales(folderTarget(f), `${prefix}${f.name} · `, depth + 1)));
      continue;
    }
    const titulo = `${prefix}${sinExtension(f.name)}`;
    const ciclo = Number(f.name.match(/\b(20\d{2})\b/)?.[1]) || undefined;
    const href = f.mimeType === SHORTCUT ? `https://drive.google.com/open?id=${f.shortcutDetails?.targetId}` : f.webViewLink;
    if (!href) continue;
    out.push({ tipo: tipoDe(f.name), titulo, href, ...(ciclo ? { ciclo } : {}) });
  }
  return out;
}

async function main() {
  if (!KEY || !ROOT_INPUT) {
    const msg = 'faltan GOOGLE_API_KEY y/o DRIVE_ROOT_FOLDER (ver DEPLOY.md → "Bibliografía desde Drive")';
    if (OPTIONAL) {
      log(`${msg}. Se omite la sincronización.`);
      return;
    }
    fail(msg);
  }
  const root = parseFolder(ROOT_INPUT);
  if (!root) fail('DRIVE_ROOT_FOLDER no es un ID ni un link de carpeta válido');
  if (root.resourceKey) resourceKeys.set(root.id, root.resourceKey);

  const materias = [];
  const ids = new Set();
  try {
    for (const yearFolder of (await list(root.id)).filter(isFolder)) {
      const anio = parseAnio(yearFolder.name);
      if (!anio) {
        warn(`"${yearFolder.name}" no parece un año (ej. "1° año"): se ignora`);
        continue;
      }
      const agregar = async (folder, orientacion) => {
        const nombre = folder.name.trim();
        let id = slug(`${nombre}-${anio}${orientacion ? `-${orientacion}` : ''}`);
        while (ids.has(id)) id += '-2';
        ids.add(id);
        const mats = await materiales(folderTarget(folder));
        materias.push({ id, nombre, area: '', anio, ...(orientacion ? { orientacion } : {}), materiales: mats });
      };
      for (const child of (await list(folderTarget(yearFolder))).filter(isFolder)) {
        const orient = child.name.match(/^orientaci[oó]n\s+(.+)$/i)?.[1]?.trim();
        if (orient) {
          for (const m of (await list(folderTarget(child))).filter(isFolder)) await agregar(m, orient);
        } else {
          await agregar(child);
        }
      }
    }
  } catch (error) {
    fail(`no se pudo leer Drive: ${error.message}`);
  }

  const total = materias.reduce((n, m) => n + m.materiales.length, 0);
  log(`${materias.length} materias, ${total} materiales`);
  if (materias.length === 0) warn('no se encontró ninguna materia: revisá la estructura de carpetas');

  const previous = existsSync(OUT_JSON) ? JSON.parse(await readFile(OUT_JSON, 'utf8')) : { materias: [] };
  if (JSON.stringify(previous.materias) === JSON.stringify(materias)) {
    log('sin cambios');
    return;
  }
  await writeFile(OUT_JSON, `${JSON.stringify({ syncedAt: new Date().toISOString(), materias }, null, 2)}\n`);
  log(`actualizado ${path.relative(ROOT, OUT_JSON)}`);
}

main();
