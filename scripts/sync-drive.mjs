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
 *
 * Además, si está DRIVE_CONCURSOS_FOLDER (link de otra carpeta, ej. "Concursos docentes"),
 * lista sus archivos como documentos para descargar en /concursos-docentes y escribe
 * src/content/documentos-concursos.generated.json. Los Google Docs se descargan como
 * Word (para completarlos), las Planillas como Excel y el resto tal cual.
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
const DOCS_INPUT = process.env.DRIVE_CONCURSOS_FOLDER ?? '';
const DOCS_JSON = path.join(ROOT, 'src/content/documentos-concursos.generated.json');
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

/** Link de descarga directa + formato, según el tipo de archivo de Drive. */
export function descarga(f) {
  const id = f.mimeType === SHORTCUT ? f.shortcutDetails?.targetId : f.id;
  const mime = f.mimeType === SHORTCUT ? f.shortcutDetails?.targetMimeType ?? '' : f.mimeType;
  if (mime === 'application/vnd.google-apps.document')
    return { href: `https://docs.google.com/document/d/${id}/export?format=docx`, formato: 'word' };
  if (mime === 'application/vnd.google-apps.spreadsheet')
    return { href: `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`, formato: 'planilla' };
  if (mime === 'application/vnd.google-apps.presentation')
    return { href: `https://docs.google.com/presentation/d/${id}/export/pdf`, formato: 'pdf' };
  if (mime.startsWith('application/vnd.google-apps.')) return null; // formularios, sitios, etc.
  const formato = /pdf/.test(mime)
    ? 'pdf'
    : /word|opendocument\.text|msword/.test(mime)
      ? 'word'
      : /sheet|excel|csv/.test(mime)
        ? 'planilla'
        : mime.startsWith('image/')
          ? 'imagen'
          : undefined;
  return { href: `https://drive.google.com/uc?export=download&id=${id}`, ...(formato ? { formato } : {}) };
}

async function documentos(folderId, prefix = '', depth = 0) {
  const out = [];
  for (const f of await list(folderId)) {
    if (isFolder(f)) {
      if (depth < MAX_DEPTH) out.push(...(await documentos(folderTarget(f), `${prefix}${f.name} · `, depth + 1)));
      continue;
    }
    const d = descarga(f);
    if (!d) {
      warn(`"${f.name}" no se puede descargar (tipo ${f.mimeType}): se omite`);
      continue;
    }
    out.push({ titulo: `${prefix}${sinExtension(f.name)}`, ...d, descarga: true });
  }
  return out;
}

async function writeIfChanged(file, key, value) {
  const previous = existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : {};
  if (JSON.stringify(previous[key] ?? []) === JSON.stringify(value)) {
    log(`${path.relative(ROOT, file)}: sin cambios`);
    return;
  }
  await writeFile(file, `${JSON.stringify({ syncedAt: new Date().toISOString(), [key]: value }, null, 2)}\n`);
  log(`actualizado ${path.relative(ROOT, file)}`);
}

async function syncDocumentos() {
  const folder = parseFolder(DOCS_INPUT);
  if (!folder) fail('DRIVE_CONCURSOS_FOLDER no es un ID ni un link de carpeta válido');
  if (folder.resourceKey) resourceKeys.set(folder.id, folder.resourceKey);
  let docs;
  try {
    docs = await documentos(folder.id);
  } catch (error) {
    fail(`no se pudo leer la carpeta de concursos: ${error.message}`);
  }
  log(`concursos: ${docs.length} documentos`);
  await writeIfChanged(DOCS_JSON, 'documentos', docs);
}

async function main() {
  if (KEY && DOCS_INPUT) await syncDocumentos();
  else log('sin DRIVE_CONCURSOS_FOLDER: se omiten los documentos de concursos');

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

  await writeIfChanged(OUT_JSON, 'materias', materias);
}

main();
