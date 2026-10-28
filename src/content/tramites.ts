import type { Tramite } from '@/domain/tramites';
import { requisitosConcurso } from './concursos';
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

const SAGE = 'https://sage.entrerios.gov.ar/';

export const otrosTramites: Tramite[] = [
  {
    id: 'constancia-alumno-regular',
    filtro: 'Constancias',
    titulo: 'Constancia de alumno regular',
    resumen:
      'Se genera desde SAGE y después se firma y sella en la escuela. Sirve para ANSES, becas, obra social, boleto estudiantil y otros trámites.',
    pasos: [
      'Ingresá a SAGE con tu usuario de tutor/a (si no tenés, mirá el trámite "Usuario de SAGE").',
      'Generá e imprimí la constancia de alumno regular del estudiante.',
      'Llevala a la escuela para que la firmen y sellen: sin firma no tiene validez.',
    ],
    nota: '⚠ Validar con secretaría el horario para la firma.',
    enlaces: [{ label: 'Ir a SAGE', href: SAGE }],
  },
  {
    id: 'sage',
    filtro: 'Usuario de SAGE',
    titulo: 'Usuario de SAGE para familias',
    resumen:
      'Con el usuario de tutor/a ves asistencia y calificaciones y generás constancias. Todo se hace por el sistema.',
    pasos: [
      'Pedí en preceptoría que te den de alta como tutor/a del estudiante.',
      'Ingresá a SAGE con tu DNI y validá la cuenta con el código que te dan.',
      'Si olvidaste la contraseña o el código venció, avisá en la escuela y te lo regeneran.',
    ],
    enlaces: [{ label: 'Ir a SAGE', href: SAGE }],
  },
  {
    id: 'pase',
    filtro: 'Pases',
    titulo: 'Pase de escuela',
    resumen: 'Para estudiantes que ingresan desde otra escuela o se van a otra.',
    pasos: [
      'Antes que nada, consultá en la escuela si hay banco (vacante) en el año y turno que necesitás.',
      'Si hay banco, pedí el pase en la secretaría de la escuela de origen.',
      'Presentá el pase y la documentación personal del estudiante en nuestra secretaría.',
    ],
    enlaces: [
      { label: contacto.telefono.texto, href: contacto.telefono.href },
      { label: contacto.email, href: `mailto:${contacto.email}` },
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
    id: 'netbook',
    filtro: 'Netbooks',
    titulo: 'Netbook bloqueada',
    resumen: 'Si la netbook escolar muestra la pantalla de bloqueo.',
    pasos: [
      'Acercate con la netbook y el DNI del estudiante.',
      'El referente técnico de la escuela gestiona el código de desbloqueo.',
    ],
  },
  {
    id: 'concursos-docentes',
    filtro: 'Concursos docentes',
    titulo: 'Presentarse a un concurso docente',
    resumen:
      'Los llamados de la escuela los publica el CGE. La inscripción es presencial, en la escuela, el día y la hora del llamado.',
    requisitos: [{ titulo: 'Qué llevar', items: requisitosConcurso }],
    enlaces: [{ label: 'Ver llamados y descargar documentación', href: '/concursos-docentes' }],
  },
];

/** Orden de los filtros en /tramites: el primero se muestra por defecto. */
export const tramites: Tramite[] = [inscripcion, ...otrosTramites];
