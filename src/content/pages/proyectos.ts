import type { PageConfig } from '@/pages/types';

export const proyectosPage: PageConfig = {
  path: '/proyectos',
  title: 'Proyectos',
  nav: { label: 'Proyectos', primary: true },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Vida escolar',
        title: 'Proyectos',
        description: 'Lo que hacen los cursos dentro y fuera del aula.',
      },
    },
    {
      type: 'features',
      id: 'proyectos',
      // ⚠ Proyectos de ejemplo: reemplazar por los reales.
      props: {
        items: [
          {
            title: 'Ciclo "Leer a Juan L."',
            body: 'Cada año los cursos leen, recitan y reescriben la obra del poeta que le da nombre a la escuela.',
            details: [
              { label: 'Qué hacen:', text: 'Lecturas en voz alta, intervenciones en el patio y producciones propias.' },
              { label: 'Con quién:', text: 'Lengua, Artística y la biblioteca escolar.' },
            ],
            media: { alt: 'Foto: lectura de poesía en el patio', ratio: '3/2', tone: 'violet' },
            mediaPosition: 'start',
            mediaSize: 'lg',
          },
          {
            title: 'Radio escolar: cada viernes al aire',
            media: { alt: 'Foto: estudiantes en la radio', ratio: '1/1', tone: 'night' },
            mediaPosition: 'end',
            mediaSize: 'sm',
          },
          {
            title: 'Huerta escolar',
            body: 'Biología, química y economía en un mismo proyecto. Lo cosechado va al comedor.',
            media: { alt: 'Foto: estudiantes trabajando en la huerta', ratio: '3/2', tone: 'forest' },
            mediaPosition: 'end',
            mediaSize: 'lg',
          },
        ],
      },
    },
  ],
};
