/**
 * Contrato común de todas las secciones.
 * El renderer inyecta `id` desde la configuración de la página,
 * por eso ninguna sección lo define en su contenido.
 */
export type SectionBaseProps = {
  id?: string;
};

/** Título de sección: un string o una línea por elemento. */
export type SectionTitle = string | string[];

/** Texto plano del título, para aria-label. */
export const titleText = (title?: SectionTitle): string | undefined =>
  Array.isArray(title) ? title.join(' ') : title;
