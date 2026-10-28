import type { Tramite } from '@/domain/tramites';
import { contacto } from './contacto';

/**
 * Trámites de la escuela.
 * - `inscripcion`: datos reales del flyer "Inscripciones abiertas — Ciclo lectivo 2027".
 * - El resto: ⚠ textos de ejemplo, validar con secretaría antes de publicar.
 *
 * Al cambiar de ciclo lectivo alcanza con actualizar `etiqueta` y `vigencia`:
 * el estado (abierta / cerrada / próxima) se calcula solo.
 */
export const inscripcion: Tramite = {
  id: 'inscripcion',
  filtro: 'Inscripciones',
  titulo: 'Inscripción a 1er año',
  etiqueta: 'Ciclo lectivo 2027',
  resumen: 'Presentate en la escuela con la documentación del estudiante y del adulto responsable.',
  vigencia: { desde: '2026-10-07', hasta: '2026-10-31' },
  horario: 'De 14 a 17 h',
  lugar: { texto: contacto.direccion, mapa: contacto.mapa },
  requisitos: [
    {
      titulo: 'Del estudiante',
      items: [
        { texto: 'Partida de nacimiento' },
        { texto: 'Fotocopia de DNI y CUIL' },
        { texto: 'Constancia de alumno regular de 6° grado' },
        { texto: 'Foto carnet' },
        { texto: 'Carpeta de cuatro solapas' },
        { texto: 'Certificado de buena salud' },
        { texto: 'Certificado de vacunas' },
        { texto: 'Certificado bucodental' },
        { texto: 'Certificado oftalmológico y auditivo', opcional: true },
      ],
    },
    {
      titulo: 'Del padre, madre o tutor/a',
      items: [{ texto: 'Fotocopia de DNI y CUIL' }, { texto: 'Teléfono y mail de referencia' }],
    },
  ],
  enlaces: [
    { label: contacto.email, href: `mailto:${contacto.email}` },
    { label: contacto.telefono.texto, href: contacto.telefono.href },
  ],
};

export const otrosTramites: Tramite[] = [
  {
    id: 'constancia-alumno-regular',
    filtro: 'Constancias',
    titulo: 'Constancia de alumno regular',
    resumen: 'Para ANSES, becas, obra social, boleto estudiantil y otros trámites.',
    pasos: [
      'Pedila en secretaría con el DNI del estudiante.',
      'Indicá para qué organismo es, si te la piden con un destino específico.',
      'Retirala en el día o el siguiente día hábil.',
    ],
  },
  {
    id: 'mesas-de-examen',
    filtro: 'Mesas de examen',
    titulo: 'Inscripción a mesas de examen',
    resumen: 'Para rendir materias previas, libres o en condición de equivalencia.',
    pasos: [
      'Consultá las fechas en la Agenda: se publican antes de cada turno.',
      'Inscribite en preceptoría dentro del plazo publicado.',
      'Revisá el programa y las pautas de examen en Bibliografía.',
    ],
    enlaces: [
      { label: 'Ver la agenda', href: '/agenda' },
      { label: 'Ir a Bibliografía', href: '/materias' },
    ],
  },
  {
    id: 'sage',
    filtro: 'SAGE',
    titulo: 'Cuenta de tutor en SAGE',
    resumen: 'Para ver asistencia y calificaciones del estudiante desde el celular.',
    pasos: [
      'Pedí en preceptoría el código de validación del tutor.',
      'Ingresá a SAGE con tu DNI y validá la cuenta con ese código.',
      'Si el código no llega o venció, avisá en la escuela y te lo regeneran.',
    ],
  },
  {
    id: 'pase',
    filtro: 'Pases',
    titulo: 'Pase de escuela',
    resumen: 'Para estudiantes que ingresan desde otra escuela o se van a otra.',
    pasos: [
      'Solicitá el pase en la secretaría de la escuela de origen.',
      'Consultá disponibilidad de vacante en el curso que corresponda.',
      'Presentá el pase y la documentación personal del estudiante.',
    ],
  },
  {
    id: 'netbook',
    filtro: 'Netbooks',
    titulo: 'Netbook bloqueada',
    resumen: 'Si la netbook escolar muestra la pantalla de bloqueo.',
    pasos: [
      'Acercate con la netbook y el DNI del estudiante.',
      'El referente técnico de la escuela gestiona el código de desbloqueo.',
    ],
  },
];

/** Orden de los filtros en /tramites: el primero se muestra por defecto. */
export const tramites: Tramite[] = [inscripcion, ...otrosTramites];
