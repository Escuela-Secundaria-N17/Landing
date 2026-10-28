import type { PageConfig } from '@/pages/types';
import { centroEstudiantes } from '../centro-estudiantes';

export const centroEstudiantesPage: PageConfig = {
  path: '/centro-de-estudiantes',
  title: 'Centro de Estudiantes',
  nav: { label: 'Centro de Estudiantes', primary: true },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Participación',
        title: 'Centro de Estudiantes',
      },
    },
    {
      type: 'studentCouncil',
      id: 'centro-de-estudiantes',
      props: centroEstudiantes,
    },
  ],
};
