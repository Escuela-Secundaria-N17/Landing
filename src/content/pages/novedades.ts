import type { PageConfig } from '@/pages/types';
import { instagramPosts } from '../instagram';
import { site } from '../site';

/** Novedades = lo que la escuela publica en Instagram. Las fechas van en /agenda. */
export const novedadesPage: PageConfig = {
  path: '/novedades',
  title: 'Novedades',
  nav: { label: 'Novedades', primary: true },
  sections: [
    {
      type: 'pageIntro',
      id: 'intro',
      props: {
        kicker: 'Desde nuestro Instagram',
        title: 'Novedades',
        description: 'Lo que pasa en la escuela, tal como lo compartimos en Instagram.',
      },
    },
    {
      type: 'instagram',
      id: 'novedades',
      props: {
        handle: site.social.instagram.handle,
        profileUrl: site.social.instagram.url,
        posts: instagramPosts,
      },
    },
  ],
};
