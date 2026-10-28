import type { PageConfig } from '@/pages/types';
import { agenda } from '../agenda';

export const agendaPage: PageConfig = {
  path: '/agenda',
  title: 'Agenda',
  nav: { label: 'Agenda', primary: true },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Calendario escolar',
        title: 'Agenda',
        description: 'Inscripciones, mesas de examen, actos y reuniones: todas las fechas en un solo lugar.',
        mascot: true,
      },
    },
    {
      type: 'agenda',
      id: 'fechas',
      props: { events: agenda, filters: true },
    },
  ],
};
