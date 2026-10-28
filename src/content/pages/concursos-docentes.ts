import type { PageConfig } from '@/pages/types';
import { contacto } from '../contacto';
import { CGE_CONCURSOS, documentosConcurso, llamados } from '../concursos';

export const concursosDocentesPage: PageConfig = {
  path: '/concursos-docentes',
  title: 'Concursos docentes',
  nav: { label: 'Concursos docentes' },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Docentes',
        title: 'Concursos docentes',
        description:
          'Los llamados de la escuela que publica el CGE y la documentación que tenés que llevar para presentarte.',
      },
    },
    {
      type: 'notices',
      id: 'llamados',
      props: {
        title: ['Llamados', 'de la escuela'],
        description:
          'Publicaciones del CGE que mencionan a la Escuela Secundaria N° 17 (CUE 300-1754). La inscripción es presencial, en la fecha y hora de cada llamado.',
        items: llamados,
        limit: 12,
        more: { label: 'Sitio del CGE', href: CGE_CONCURSOS },
        emptyText: 'No hay llamados publicados por ahora. Los nuevos aparecen acá solos cuando el CGE los publica.',
      },
    },
    {
      type: 'documents',
      id: 'documentacion',
      props: {
        title: ['Documentación', 'para presentarte'],
        description:
          'Credencial de puntaje vigente, formulario unificado, DNI (original y copia), constancia de antigüedad de SAGE y, si sos personal de la escuela, la constancia correspondiente.',
        items: documentosConcurso,
      },
    },
    {
      type: 'quickLinks',
      id: 'consultas',
      props: {
        label: 'Consultas',
        title: ['¿Tenés', 'dudas?'],
        items: [
          { icon: 'mail', label: 'Escribinos', description: contacto.email, href: `mailto:${contacto.email}` },
          { icon: 'phone', label: 'Llamanos', description: contacto.telefono.texto, href: contacto.telefono.href },
          { icon: 'pin', label: 'Dónde se hace', description: contacto.direccion, href: contacto.mapa },
        ],
      },
    },
  ],
};
