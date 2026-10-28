import type { PageConfig } from '@/pages/types';
import { agendaPage } from './agenda';
import { centroEstudiantesPage } from './centro-estudiantes';
import { inicio } from './inicio';
import { materiasPage } from './materias';
import { novedadesPage } from './novedades';
import { preguntasFrecuentesPage } from './preguntas-frecuentes';
import { proyectosPage } from './proyectos';
import { tramitesPage } from './tramites';

/**
 * Todas las páginas del sitio. El orden define el orden del menú.
 * Para sumar una: crear su archivo en esta carpeta y agregarla acá.
 */
export const pages: PageConfig[] = [
  inicio,
  materiasPage,
  tramitesPage,
  agendaPage,
  novedadesPage,
  proyectosPage,
  centroEstudiantesPage,
  preguntasFrecuentesPage,
];

/** Página para rutas inexistentes. */
export const notFoundPage: PageConfig = {
  path: '*',
  title: 'Página no encontrada',
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Error 404',
        title: 'No encontramos esta página',
        description: 'Puede que el enlace haya cambiado. Volvé al inicio o usá el menú.',
        mascot: true,
      },
    },
  ],
};
