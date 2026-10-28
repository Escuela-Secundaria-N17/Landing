/**
 * Concursos docentes: modelos sin React.
 * - Documento: algo para descargar o consultar antes de presentarse.
 * - Llamado: una publicación del CGE que menciona a la escuela.
 */
export type FormatoDocumento = 'pdf' | 'word' | 'planilla' | 'imagen' | 'link';

export type Documento = {
  titulo: string;
  descripcion?: string;
  href: string;
  formato?: FormatoDocumento;
  /** El link baja el archivo directo (Drive con export/descarga). */
  descarga?: boolean;
};

export type Llamado = {
  /** ISO AAAA-MM-DD. */
  fecha: string;
  titulo: string;
  href: string;
};

export const FORMATO_LABEL: Record<FormatoDocumento, string> = {
  pdf: 'PDF',
  word: 'Word',
  planilla: 'Planilla',
  imagen: 'Imagen',
  link: 'Sitio web',
};

/** Publicado en los últimos `dias` días (para marcar "Nuevo"). */
export function esReciente(llamado: Llamado, dias = 10, hoy = new Date()): boolean {
  const [y, m, d] = llamado.fecha.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  return (hoy.getTime() - fecha.getTime()) / 86_400_000 <= dias;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2026-10-28" → { dia: "28", mes: "oct 2026" } */
export function fechaCorta(iso: string): { dia: string; mes: string } {
  const [y, m, d] = iso.split('-');
  return { dia: String(Number(d)), mes: `${MESES[Number(m) - 1]} ${y}` };
}
