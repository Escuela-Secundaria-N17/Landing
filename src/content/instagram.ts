import type { InstagramPost } from '@/sections/InstagramFeed/InstagramFeed';
import generated from './instagram.generated.json';

/**
 * Novedades = publicaciones de Instagram. De acá sale lo que muestran las
 * tarjetas de la portada (últimas 4) y de /novedades (todas).
 *
 * Hay dos fuentes, y se combinan:
 *
 * 1. AUTOMÁTICA — `instagram.generated.json`
 *    La escribe `npm run sync:instagram` (o la GitHub Action programada).
 *    No editar a mano: se pisa en cada sincronización. Ver README.
 *
 * 2. MANUAL — `manualPosts`, abajo
 *    Para fijar una publicación arriba de todo (`pinned: true`) o sumar algo
 *    que no está en la cuenta. Si una URL también llega por la sincronización,
 *    gana la versión manual.
 *
 * Lo que tiene fecha a futuro (inscripciones, mesas, actos) va en content/agenda.ts.
 */
const manualPosts: InstagramPost[] = [
  // Ejemplo de publicación fijada:
  // {
  //   url: 'https://www.instagram.com/p/XXXXXXXX/',
  //   caption: 'Inscripciones abiertas a 1er año 2027: del 7 al 31 de octubre.',
  //   image: '/img/ig/inscripciones-2027.jpg',
  //   date: '2026-10-07',
  //   pinned: true,
  // },
];

/**
 * Ejemplos para ver el diseño mientras se desarrolla.
 * Sólo se usan en `npm run dev` y sólo si todavía no hay publicaciones reales:
 * nunca llegan al sitio publicado.
 */
const devExamples: InstagramPost[] = [
  { url: 'https://www.instagram.com/', caption: 'Inscripciones abiertas a 1er año 2027: del 7 al 31 de octubre, de 14 a 17 h.', date: '2026-10-07', tone: 'violet' },
  { url: 'https://www.instagram.com/', caption: 'Muestra anual de proyectos: gracias a todas las familias que nos visitaron.', date: '2026-10-03', tone: 'dusk' },
  { url: 'https://www.instagram.com/', caption: 'Ciclo de lectura en la biblioteca: leemos a Juan L. Ortiz junto al río.', date: '2026-09-29', tone: 'ocean' },
  { url: 'https://www.instagram.com/', caption: 'Semana de la primavera organizada por el Centro de Estudiantes.', date: '2026-09-21', tone: 'forest' },
  { url: 'https://www.instagram.com/', caption: 'Arrancó el taller de radio: cada viernes al aire.', date: '2026-09-10', tone: 'night' },
  { url: 'https://www.instagram.com/', caption: 'Salida educativa de 5° año al Museo Histórico.', date: '2026-09-05', tone: 'ember' },
];

function merge(manual: InstagramPost[], synced: InstagramPost[]): InstagramPost[] {
  const manualUrls = new Set(manual.map((p) => p.url));
  return [...manual, ...synced.filter((p) => !manualUrls.has(p.url))];
}

const real = merge(manualPosts, generated.posts as InstagramPost[]);

export const instagramPosts: InstagramPost[] = real.length > 0 || !import.meta.env.DEV ? real : devExamples;

/** Cuándo se sincronizó por última vez (ISO), o null si nunca. */
export const instagramSyncedAt: string | null = generated.syncedAt;
