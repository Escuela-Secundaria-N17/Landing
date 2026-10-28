/**
 * Agenda escolar: fechas con día (inscripciones, mesas, actos, feriados…).
 * Las novedades y noticias van en Instagram; acá sólo lo que tiene fecha.
 */
export type TipoEvento = 'inscripcion' | 'examen' | 'acto' | 'feriado' | 'reunion' | 'actividad';

export type Evento = {
  /** ISO (AAAA-MM-DD). */
  fecha: string;
  /** Para eventos de varios días (ej. período de inscripción). Inclusive. */
  hasta?: string;
  titulo: string;
  tipo: TipoEvento;
  hora?: string;
  lugar?: string;
  /** Link a más info (un trámite, una publicación…). */
  href?: string;
};

export const TIPO_EVENTO_LABEL: Record<TipoEvento, string> = {
  inscripcion: 'Inscripciones',
  examen: 'Mesas de examen',
  acto: 'Actos',
  feriado: 'Feriados y recesos',
  reunion: 'Reuniones',
  actividad: 'Actividades',
};

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LARGOS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const parse = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const toDate = (iso: string) => {
  const { y, m, d } = parse(iso);
  return new Date(y, m - 1, d);
};

export type EstadoEvento = 'en-curso' | 'proximo' | 'pasado';

export function estadoEvento(e: Evento, hoy = new Date()): EstadoEvento {
  const today = startOfDay(hoy);
  const inicio = toDate(e.fecha);
  const fin = toDate(e.hasta ?? e.fecha);
  if (today > fin) return 'pasado';
  if (today >= inicio) return 'en-curso';
  return 'proximo';
}

/** Bloque de fecha para mostrar: "16" + "oct", o "07–31" + "oct" para rangos. */
export function bloqueFecha(e: Evento): { dia: string; mes: string } {
  const a = parse(e.fecha);
  if (!e.hasta) return { dia: String(a.d).padStart(2, '0'), mes: MESES[a.m - 1] };
  const b = parse(e.hasta);
  const dd = (n: number) => String(n).padStart(2, '0');
  if (a.m === b.m) return { dia: `${dd(a.d)}–${dd(b.d)}`, mes: MESES[a.m - 1] };
  return { dia: `${dd(a.d)}/${dd(a.m)}–${dd(b.d)}/${dd(b.m)}`, mes: '' };
}

export const etiquetaMes = (iso: string) => {
  const { y, m } = parse(iso);
  return `${MESES_LARGOS[m - 1]} ${y}`;
};

/** Próximos y en curso, del más cercano al más lejano. */
export function proximos(eventos: Evento[], hoy = new Date()): Evento[] {
  return eventos
    .filter((e) => estadoEvento(e, hoy) !== 'pasado')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

/** Pasados, del más reciente al más viejo. */
export function pasados(eventos: Evento[], hoy = new Date()): Evento[] {
  return eventos
    .filter((e) => estadoEvento(e, hoy) === 'pasado')
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/** Agrupa por mes de inicio, respetando el orden recibido. */
export function agruparPorMes(eventos: Evento[]): Array<{ mes: string; eventos: Evento[] }> {
  const grupos: Array<{ mes: string; eventos: Evento[] }> = [];
  for (const e of eventos) {
    const mes = etiquetaMes(e.fecha);
    const last = grupos[grupos.length - 1];
    if (last && last.mes === mes) last.eventos.push(e);
    else grupos.push({ mes, eventos: [e] });
  }
  return grupos;
}
