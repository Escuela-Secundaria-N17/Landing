import type { SectionConfig } from '@/sections/registry';

/**
 * Una página del sitio = ruta + metadatos + lista de secciones.
 * Agregar una página es crear su archivo en content/pages y sumarlo al índice.
 */
export type PageConfig = {
  /** Ruta absoluta, sin barra final (ej. "/materias"). */
  path: string;
  /** Título para la pestaña del navegador y el breadcrumb. */
  title: string;
  description?: string;
  nav?: {
    label: string;
    /** `primary` = visible en la barra de escritorio. El resto sólo en el menú. */
    primary?: boolean;
  };
  sections: SectionConfig[];
};
