import type { PageConfig } from '@/pages/types';
import { contacto } from '../contacto';
import { tramites } from '../tramites';

export const tramitesPage: PageConfig = {
  path: '/tramites',
  title: 'Trámites',
  nav: { label: 'Trámites', primary: true },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Familias y estudiantes',
        title: 'Trámites',
        description: 'Elegí el trámite y te mostramos fechas, documentación y los pasos a seguir.',
        mascot: true,
      },
    },
    {
      type: 'procedures',
      id: 'tramites',
      props: { items: tramites },
    },
    {
      type: 'quickLinks',
      id: 'dudas',
      props: {
        label: '¿Te quedó alguna duda?',
        title: ['¿Te quedó', 'alguna duda?'],
        items: [
          {
            icon: 'question',
            label: 'Preguntas frecuentes',
            description: 'Las consultas que más nos hacen, respondidas.',
            href: '/preguntas-frecuentes',
          },
          {
            icon: 'mail',
            label: 'Escribinos',
            description: contacto.email,
            href: `mailto:${contacto.email}`,
          },
          {
            icon: 'phone',
            label: 'Llamanos',
            description: contacto.telefono.texto,
            href: contacto.telefono.href,
          },
          {
            icon: 'pin',
            label: 'Vení a la escuela',
            description: contacto.direccion,
            href: contacto.mapa,
          },
        ],
      },
    },
  ],
};
