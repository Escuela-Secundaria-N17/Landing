import type { Evento } from '@/domain/agenda';
import { contacto } from './contacto';
import { inscripcion } from './tramites';

/**
 * Agenda escolar. Sólo fechas: las noticias se publican en Instagram.
 * Los eventos pasados se ocultan solos (se pueden ver con "Fechas pasadas").
 *
 * ⚠ Salvo la inscripción (datos del flyer), son ejemplos: reemplazar.
 */
export const agenda: Evento[] = [
  {
    fecha: inscripcion.vigencia!.desde!,
    hasta: inscripcion.vigencia!.hasta,
    titulo: 'Inscripción a 1er año, ciclo lectivo 2027',
    tipo: 'inscripcion',
    hora: '14 a 17 h',
    lugar: contacto.direccion,
    href: `/tramites#${inscripcion.id}`,
  },
  { fecha: '2026-11-06', titulo: 'Reunión de familias de 6° año', tipo: 'reunion', hora: '18 h' },
  { fecha: '2026-12-01', hasta: '2026-12-04', titulo: 'Inscripción a mesas de examen de diciembre', tipo: 'examen', href: '/tramites#mesas-de-examen' },
  { fecha: '2026-12-07', hasta: '2026-12-11', titulo: 'Mesas de examen de diciembre', tipo: 'examen' },
  { fecha: '2026-12-15', titulo: 'Acto de colación de 6° año', tipo: 'acto', hora: '19 h' },
  // Pasados (se muestran con el filtro "Fechas pasadas")
  { fecha: '2026-09-21', titulo: 'Jornada de puertas abiertas para familias', tipo: 'actividad' },
  { fecha: '2026-07-13', hasta: '2026-07-24', titulo: 'Receso invernal', tipo: 'feriado' },
  { fecha: '2026-06-20', titulo: 'Acto del Día de la Bandera', tipo: 'acto' },
];
