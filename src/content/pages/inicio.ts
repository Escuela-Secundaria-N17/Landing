import type { PageConfig } from '@/pages/types';
import { agenda } from '../agenda';
import { instagramPosts } from '../instagram';
import { site } from '../site';

/**
 * Portada: sólo lo esencial. Cada tema tiene su página;
 * acá se llega a ellas por los accesos rápidos y el menú.
 */
export const inicio: PageConfig = {
  path: '/',
  title: 'Inicio',
  sections: [
    {
      type: 'hero',
      id: 'top',
      props: {
        wordmark: site.shortName,
        leading: ['Escuela', 'Secundaria', 'N° 17'],
        trailing: ['Poeta', 'Juan L.', 'Ortiz'],
      },
    },
    {
      type: 'quickLinks',
      id: 'accesos',
      props: {
        label: 'Accesos rápidos',
        items: [
          {
            icon: 'book',
            label: 'Bibliografía',
            description: 'Programas, cuadernillos y pautas de cada materia.',
            href: '/materias',
          },
          {
            icon: 'check',
            label: 'Inscripciones y trámites',
            description: 'Inscripción, SAGE, mesas de examen y netbooks.',
            href: '/tramites',
          },
          {
            icon: 'users',
            label: 'Centro de Estudiantes',
            description: 'Quiénes somos y cómo mandar tu propuesta.',
            href: '/centro-de-estudiantes',
          },
          {
            icon: 'sparkle',
            label: 'Proyectos',
            description: 'Lo que hacen los cursos dentro y fuera del aula.',
            href: '/proyectos',
          },
        ],
      },
    },
    {
      type: 'tags',
      id: 'talleres',
      props: {
        label: 'Talleres y actividades',
        rows: [
          [
            { label: 'Taller de poesía' },
            { label: 'Radio escolar' },
            { label: 'Teatro' },
            { label: 'Huerta' },
            { label: 'Ajedrez' },
            { label: 'Murga' },
          ],
          [
            { label: 'Fútbol' },
            { label: 'Vóley' },
            { label: 'ESI' },
            { label: 'Feria de ciencias' },
            { label: 'Fotografía' },
            { label: 'Salidas educativas' },
          ],
        ],
      },
    },
    {
      type: 'instagram',
      id: 'novedades',
      props: {
        title: ['Novedades'],
        handle: site.social.instagram.handle,
        profileUrl: site.social.instagram.url,
        posts: instagramPosts,
        limit: 4,
        moreHref: '/novedades',
      },
    },
    {
      type: 'agenda',
      id: 'agenda',
      props: {
        title: ['Próximas', 'fechas'],
        events: agenda,
        limit: 3,
        moreHref: '/agenda',
      },
    },
  ],
};
