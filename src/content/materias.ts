import type { Materia } from '@/domain/materias';
import generated from './materias.generated.json';

/**
 * Bibliografía por materia.
 *
 * La fuente real es Google Drive: `npm run sync:drive` (y el deploy, en cada
 * publicación) recorre la carpeta "Bibliografía" y escribe
 * `materias.generated.json`. No editar ese archivo a mano. Ver DEPLOY.md.
 *
 * Los ejemplos de abajo sólo se ven en `npm run dev` mientras no haya datos
 * reales: nunca llegan al sitio publicado.
 */
const DRIVE = 'https://drive.google.com/';

const devExamples: Materia[] = [
  // ── Ciclo Básico ───────────────────────────────────────────────
  {
    id: 'lengua-1',
    nombre: 'Lengua y Literatura',
    area: 'Lengua',
    anio: 1,
    docentes: ['[COMPLETAR]'],
    materiales: [
      { tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 },
      { tipo: 'cuadernillo', titulo: 'Cuadernillo de lectura: poesía entrerriana', href: DRIVE },
      { tipo: 'pautas', titulo: 'Pautas para examen regular y previo', href: DRIVE },
    ],
  },
  {
    id: 'matematica-1',
    nombre: 'Matemática',
    area: 'Matemática',
    anio: 1,
    materiales: [
      { tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 },
      { tipo: 'cuadernillo', titulo: 'Cuadernillo de ejercitación: números enteros', href: DRIVE },
    ],
  },
  {
    id: 'cs-sociales-1',
    nombre: 'Ciencias Sociales',
    area: 'Ciencias Sociales',
    anio: 1,
    materiales: [{ tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 }],
  },
  {
    id: 'ingles-1',
    nombre: 'Inglés',
    area: 'Lenguas Extranjeras',
    anio: 1,
    materiales: [],
  },
  {
    id: 'lengua-2',
    nombre: 'Lengua y Literatura',
    area: 'Lengua',
    anio: 2,
    materiales: [
      { tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 },
      { tipo: 'libro', titulo: 'Antología de cuentos (selección de cátedra)', href: DRIVE },
    ],
  },
  {
    id: 'biologia-2',
    nombre: 'Biología',
    area: 'Ciencias Naturales',
    anio: 2,
    materiales: [
      { tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 },
      { tipo: 'enlace', titulo: 'Simuladores de célula y genética', href: 'https://phet.colorado.edu/es/' },
    ],
  },
  {
    id: 'historia-3',
    nombre: 'Historia',
    area: 'Ciencias Sociales',
    anio: 3,
    materiales: [
      { tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 },
      { tipo: 'pautas', titulo: 'Pautas para examen previo', href: DRIVE },
    ],
  },
  {
    id: 'fisica-3',
    nombre: 'Física',
    area: 'Ciencias Naturales',
    anio: 3,
    materiales: [],
  },

  // ── Ciclo Orientado ────────────────────────────────────────────
  {
    id: 'literatura-4',
    nombre: 'Literatura',
    area: 'Lengua',
    anio: 4,
    orientacion: 'Ciencias Sociales',
    materiales: [
      { tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 },
      { tipo: 'cuadernillo', titulo: 'Juan L. Ortiz: lectura y contexto', href: DRIVE },
    ],
  },
  {
    id: 'economia-4',
    nombre: 'Economía',
    area: 'Ciencias Sociales',
    anio: 4,
    orientacion: 'Economía y Administración',
    materiales: [{ tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 }],
  },
  {
    id: 'sociologia-5',
    nombre: 'Sociología',
    area: 'Ciencias Sociales',
    anio: 5,
    orientacion: 'Ciencias Sociales',
    materiales: [
      { tipo: 'programa', titulo: 'Programa 2026', href: DRIVE, ciclo: 2026 },
      { tipo: 'libro', titulo: 'Introducción a la sociología (capítulos 1 a 3)', href: DRIVE },
    ],
  },
  {
    id: 'contabilidad-5',
    nombre: 'Sistemas de Información Contable',
    area: 'Economía',
    anio: 5,
    orientacion: 'Economía y Administración',
    materiales: [],
  },
  {
    id: 'proyecto-6',
    nombre: 'Proyecto de Investigación',
    area: 'Ciencias Sociales',
    anio: 6,
    orientacion: 'Ciencias Sociales',
    materiales: [{ tipo: 'pautas', titulo: 'Guía para la presentación del proyecto final', href: DRIVE }],
  },
];

const real = generated.materias as Materia[];

export const materias: Materia[] = real.length > 0 || !import.meta.env.DEV ? real : devExamples;

/** Cuándo se sincronizó Drive por última vez (ISO), o null si nunca. */
export const materiasSyncedAt: string | null = generated.syncedAt;
