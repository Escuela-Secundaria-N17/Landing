/**
 * Modelo de datos del espacio académico.
 * Es independiente de React: lo puede consumir la web, un script
 * que lea un Google Sheet o, más adelante, un bot.
 */
export type Anio = 1 | 2 | 3 | 4 | 5 | 6;

export type TipoMaterial = 'programa' | 'cuadernillo' | 'libro' | 'pautas' | 'documento' | 'enlace';

export type Material = {
  tipo: TipoMaterial;
  titulo: string;
  href: string;
  autor?: string;
  /** Año lectivo al que corresponde (ej. 2026). */
  ciclo?: number;
};

export type Materia = {
  /** Único y estable: sirve como clave y para futuras URLs (/materias/[id]). */
  id: string;
  nombre: string;
  area: string;
  anio: Anio;
  /** Sólo ciclo orientado (4° a 6°). */
  orientacion?: string;
  docentes?: string[];
  materiales: Material[];
};

export const TIPO_LABEL: Record<TipoMaterial, string> = {
  programa: 'Programa',
  cuadernillo: 'Cuadernillo',
  libro: 'Libro',
  pautas: 'Pautas de examen',
  documento: 'Documento',
  enlace: 'Enlace',
};

export const cicloDe = (anio: Anio): 'Básico' | 'Orientado' => (anio <= 3 ? 'Básico' : 'Orientado');

/** Normaliza para buscar sin importar tildes ni mayúsculas. */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export type FiltroMaterias = {
  anio?: Anio;
  orientacion?: string;
  query?: string;
};

export function filtrarMaterias(materias: Materia[], { anio, orientacion, query }: FiltroMaterias): Materia[] {
  const q = query ? normalize(query.trim()) : '';

  return materias
    .filter((m) => (anio ? m.anio === anio : true))
    .filter((m) => (orientacion ? m.orientacion === orientacion : true))
    .filter((m) => {
      if (!q) return true;
      const haystack = [m.nombre, m.area, ...(m.docentes ?? []), ...m.materiales.flatMap((x) => [x.titulo, x.autor ?? ''])];
      return haystack.some((text) => normalize(text).includes(q));
    })
    .sort((a, b) => a.anio - b.anio || a.nombre.localeCompare(b.nombre, 'es'));
}

export function orientacionesDe(materias: Materia[]): string[] {
  return [...new Set(materias.map((m) => m.orientacion).filter((o): o is string => Boolean(o)))].sort();
}
