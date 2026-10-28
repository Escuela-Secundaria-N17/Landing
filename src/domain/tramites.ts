/**
 * Modelo de un trámite escolar, independiente de React.
 * Si tiene `vigencia`, su estado (próximo / abierto / cerrado) se calcula solo.
 */
export type Requisito = {
  texto: string;
  /** No excluyente: se puede presentar después. */
  opcional?: boolean;
};

export type GrupoRequisitos = {
  /** Ej.: "Del estudiante", "Del padre, madre o tutor/a". */
  titulo: string;
  items: Requisito[];
};

export type Tramite = {
  /** Único y estable: es el ancla (/tramites#inscripcion). */
  id: string;
  /** Texto corto del filtro (ej. "Inscripciones"). */
  filtro: string;
  titulo: string;
  resumen: string;
  /** Etiqueta corta destacada (ej. "Ciclo lectivo 2027"). */
  etiqueta?: string;
  /** Fechas ISO (AAAA-MM-DD), ambas inclusive. */
  vigencia?: { desde?: string; hasta?: string };
  horario?: string;
  lugar?: { texto: string; mapa?: string };
  requisitos?: GrupoRequisitos[];
  pasos?: string[];
  nota?: string;
  enlaces?: { label: string; href: string }[];
};

export type EstadoTramite =
  | { tipo: 'permanente' }
  | { tipo: 'proximo'; desde: string }
  | { tipo: 'abierto'; hasta?: string }
  | { tipo: 'cerrado' };

const toDate = (iso: string, endOfDay = false) => {
  const [y, m, d] = iso.split('-').map(Number);
  return endOfDay ? new Date(y, m - 1, d, 23, 59, 59) : new Date(y, m - 1, d);
};

export function estadoTramite(tramite: Tramite, hoy = new Date()): EstadoTramite {
  const { vigencia } = tramite;
  if (!vigencia) return { tipo: 'permanente' };
  if (vigencia.desde && hoy < toDate(vigencia.desde)) return { tipo: 'proximo', desde: vigencia.desde };
  if (vigencia.hasta && hoy > toDate(vigencia.hasta, true)) return { tipo: 'cerrado' };
  return { tipo: 'abierto', hasta: vigencia.hasta };
}

/** "2026-10-31" → "31/10". */
export const diaMes = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
};

export function etiquetaEstado(estado: EstadoTramite): string | undefined {
  switch (estado.tipo) {
    case 'proximo':
      return `Abre el ${diaMes(estado.desde)}`;
    case 'abierto':
      return estado.hasta ? `Abierta hasta el ${diaMes(estado.hasta)}` : 'Abierta';
    case 'cerrado':
      return 'Cerrada';
    default:
      return undefined;
  }
}
