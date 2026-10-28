import type { PageConfig } from '@/pages/types';
import { materias } from '../materias';

export const materiasPage: PageConfig = {
  path: '/materias',
  title: 'Bibliografía',
  nav: { label: 'Bibliografía', primary: true },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Espacio académico',
        title: 'Bibliografía',
        description:
          'Elegí el año, buscá tu materia y descargá el programa, los cuadernillos y las pautas de examen.',
      },
    },
    {
      type: 'library',
      id: 'bibliografia',
      props: { materias },
    },
  ],
};
