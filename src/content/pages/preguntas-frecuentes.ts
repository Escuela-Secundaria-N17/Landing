import type { PageConfig } from '@/pages/types';
import { contacto } from '../contacto';

/**
 * Preguntas frecuentes en formato chat.
 * Las de inscripción usan datos del flyer 2027; ⚠ las de SAGE, mesas y
 * netbooks son de ejemplo: validar con secretaría.
 */
const familia = { from: 'visitor', name: 'Laura Gómez' } as const;

export const preguntasFrecuentesPage: PageConfig = {
  path: '/preguntas-frecuentes',
  title: 'Preguntas frecuentes',
  nav: { label: 'Preguntas frecuentes' },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Ayuda',
        title: 'Preguntas frecuentes',
        description: 'Lo que más nos consultan las familias y los estudiantes.',
      },
    },
    {
      type: 'conversation',
      id: 'preguntas',
      props: {
        messages: [
          { ...familia, text: '¿Cuándo son las inscripciones a 1er año 2027?' },
          {
            from: 'school',
            text: `Del 7 al 31 de octubre, de 14 a 17 h, en la escuela: ${contacto.direccion}.`,
          },
          { ...familia, text: '¿Qué documentación tengo que llevar?' },
          {
            from: 'school',
            text: 'Del estudiante: partida de nacimiento, fotocopia de DNI y CUIL, constancia de alumno regular de 6° grado, foto carnet, carpeta de cuatro solapas y certificados de buena salud, vacunas y bucodental. Del adulto responsable: fotocopia de DNI y CUIL, y un teléfono y mail de referencia. En Trámites tenés la lista para ir tildando.',
          },
          { ...familia, text: 'Todavía no tengo el certificado oftalmológico, ¿puedo inscribirlo igual?' },
          {
            from: 'school',
            text: 'Sí. El certificado oftalmológico y auditivo no es excluyente: podés presentarlo más adelante.',
          },
          { ...familia, text: '¿Cómo valido mi cuenta de tutor en SAGE?' },
          {
            from: 'school',
            text: 'Con tu DNI y el código que te da preceptoría. Si no te llegó, pasá por la escuela o escribinos y te lo reenviamos.',
          },
          { ...familia, text: '¿Cómo saco la constancia de alumno regular?' },
          {
            from: 'school',
            text: 'La generás desde SAGE con tu usuario de tutor, la imprimís y la traés a la escuela para que la firmen y sellen.',
          },
          { ...familia, text: '¿Dónde veo las fechas de mesas de examen?' },
          {
            from: 'school',
            text: 'Están en la Agenda de la web y las anunciamos en Instagram antes de cada turno. La inscripción se hace en preceptoría.',
          },
          { ...familia, text: 'La netbook de mi hijo quedó bloqueada, ¿qué hago?' },
          {
            from: 'school',
            text: 'Acercate con la netbook y el DNI del estudiante: el referente técnico de la escuela gestiona el desbloqueo.',
          },
          { ...familia, text: '¿Cómo me comunico con la escuela?' },
          {
            from: 'school',
            text: `Escribinos a ${contacto.email} o llamanos al ${contacto.telefono.texto}.`,
          },
        ],
      },
    },
    {
      type: 'quickLinks',
      id: 'mas-ayuda',
      props: {
        label: 'Más ayuda',
        title: ['¿Necesitás', 'más ayuda?'],
        items: [
          {
            icon: 'check',
            label: 'Ver todos los trámites',
            description: 'Inscripciones, constancias, mesas, SAGE y más.',
            href: '/tramites',
          },
          { icon: 'mail', label: 'Escribinos', description: contacto.email, href: `mailto:${contacto.email}` },
          {
            icon: 'phone',
            label: 'Llamanos',
            description: contacto.telefono.texto,
            href: contacto.telefono.href,
          },
          { icon: 'pin', label: 'Cómo llegar', description: contacto.direccion, href: contacto.mapa },
        ],
      },
    },
  ],
};
