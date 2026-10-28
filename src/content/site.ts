import type { SiteAlert } from '@/layout/AlertBar/AlertBar';
import { contacto } from './contacto';
import { inscripcion } from './tramites';

/**
 * Datos institucionales globales (header, footer, metadatos).
 * Todo texto "de la escuela" que no pertenece a una sección vive acá.
 *
 * ⚠ Los valores marcados con [COMPLETAR] son placeholders: reemplazar
 *   por los datos oficiales antes de publicar.
 */
export type FooterColumn = {
  title?: string;
  links: { label: string; href: string }[];
};

/** Ruta del sitio que redirige a otra dirección (ej. /ESJA → Google Sites). */
export type SiteRedirect = {
  /** Rutas que redirigen (se comparan sin distinguir mayúsculas). */
  from: string[];
  to: string;
  /** Texto de la página intermedia (sólo se ve si el navegador no redirige solo). */
  label: string;
};

export type SiteConfig = {
  name: string;
  /** Dirección pública del sitio, sin barra final. */
  url: string;
  /** Nombre informal: se usa en el wordmark gigante. */
  shortName: string;
  tagline: [string, string];
  /** Botón destacado del header. `external` = abre en otra pestaña y muestra ↗. */
  cta: { label: string; href: string; description?: string; external?: boolean };
  /** Redirecciones: en la web (navegación interna) y como páginas estáticas en el build. */
  redirects: SiteRedirect[];
  /** Aviso urgente: aparece sobre el header mientras esté vigente. */
  alert?: SiteAlert;
  social: {
    instagram: { handle: string; url: string };
  };
  footer: {
    columns: FooterColumn[];
    legal: string;
  };
};

export const site: SiteConfig = {
  name: 'Escuela Secundaria N° 17 "Poeta Juan L. Ortiz"',
  url: 'https://secundaria17lapoeta.edu.ar',
  shortName: 'La Poeta',
  tagline: ['Escuela Secundaria N° 17', '"Poeta Juan L. Ortiz"'],
  cta: {
    label: 'ESJA',
    description: 'Sitio de la ESJA (se abre en otra pestaña)',
    href: '/ESJA',
    external: true,
  },
  // Provisorio: la ESJA tiene sus cosas en Google Sites. Cuando exista la página
  // propia, se borra esta redirección y se crea la página /esja.
  redirects: [
    {
      from: ['/ESJA', '/esja'],
      to: 'https://sites.google.com/view/lapoetamuestra/inicio',
      label: 'Sitio de la ESJA',
    },
  ],
  // La alerta usa la misma vigencia que el trámite: se apaga sola el día después del cierre.
  alert: {
    text: 'Inscripciones a 1er año, ciclo lectivo 2027: hasta el 31/10, de 14 a 17 h.',
    href: `/tramites#${inscripcion.id}`,
    linkLabel: 'Qué documentación llevar',
    until: inscripcion.vigencia?.hasta,
  },
  social: {
    instagram: { handle: '@escpoetaortiz17', url: 'https://www.instagram.com/escpoetaortiz17/' },
  },
  footer: {
    columns: [
      {
        title: 'Visitanos',
        links: [
          { label: contacto.direccion, href: contacto.mapa },
          { label: 'CUE 3001754', href: '#contacto' },
        ],
      },
      {
        title: 'Contacto',
        links: [
          { label: contacto.email, href: `mailto:${contacto.email}` },
          { label: contacto.telefono.texto, href: contacto.telefono.href },
        ],
      },
      {
        title: 'Estudiantes y familias',
        links: [
          { label: 'Trámites', href: '/tramites' },
          { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
          { label: 'Bibliografía de materias', href: '/materias' },
          { label: 'Centro de Estudiantes', href: '/centro-de-estudiantes' },
          { label: 'Concursos docentes', href: '/concursos-docentes' },
          { label: 'Consejo General de Educación', href: 'https://cge.entrerios.gov.ar' },
        ],
      },
    ],
    legal: 'Estación Parera · Paraná · Entre Ríos',
  },
};
