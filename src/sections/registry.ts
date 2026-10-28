import type { ComponentProps, ComponentType } from 'react';
import { Agenda } from './Agenda/Agenda';
import { Conversation } from './Conversation/Conversation';
import { Features } from './Features/Features';
import { Gallery } from './Gallery/Gallery';
import { Hero } from './Hero/Hero';
import { InstagramFeed } from './InstagramFeed/InstagramFeed';
import { Library } from './Library/Library';
import { PageIntro } from './PageIntro/PageIntro';
import { Procedures } from './Procedures/Procedures';
import { QuickLinks } from './QuickLinks/QuickLinks';
import { StudentCouncil } from './StudentCouncil/StudentCouncil';
import { TagMarquee } from './TagMarquee/TagMarquee';

/**
 * Registro de secciones disponibles.
 * Para sumar una sección nueva: crearla en sections/<Nombre>/ y agregarla acá.
 * El tipo SectionConfig se actualiza solo y TypeScript valida el contenido.
 */
export const sectionRegistry = {
  hero: Hero,
  pageIntro: PageIntro,
  quickLinks: QuickLinks,
  tags: TagMarquee,
  library: Library,
  procedures: Procedures,
  features: Features,
  studentCouncil: StudentCouncil,
  instagram: InstagramFeed,
  conversation: Conversation,
  gallery: Gallery,
  agenda: Agenda,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<string, ComponentType<any>>;

export type SectionType = keyof typeof sectionRegistry;

type PropsOf<K extends SectionType> = Omit<ComponentProps<(typeof sectionRegistry)[K]>, 'id'>;

/**
 * Una entrada de la página. Es una unión discriminada por `type`:
 * si ponés `type: 'gallery'`, `props` sólo acepta las props de Gallery.
 */
export type SectionConfig = {
  [K in SectionType]: {
    type: K;
    /** Ancla (#id) de la sección: permite links como /tramites#inscripcion. */
    id: string;
    /** Ocultar sin borrar la configuración. */
    hidden?: boolean;
    props: PropsOf<K>;
  };
}[SectionType];
