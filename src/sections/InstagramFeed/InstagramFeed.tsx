import { Button, Icon, Media, Section } from '@/components/ui';
import type { MediaTone } from '@/components/ui';
import { SectionHeader } from '@/components/blocks';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import styles from './InstagramFeed.module.css';

export type InstagramPost = {
  /** Link a la publicación (https://www.instagram.com/p/XXXX/). */
  url: string;
  caption: string;
  /** Miniatura guardada en /public/img/ig/. Sin imagen se usa un placeholder. */
  image?: string;
  tone?: MediaTone;
  /** ISO (AAAA-MM-DD). */
  date?: string;
  /** Fijada: va primero, sin importar la fecha. */
  pinned?: boolean;
};

export type InstagramFeedProps = SectionBaseProps & {
  title?: SectionTitle;
  handle: string;
  profileUrl: string;
  posts: InstagramPost[];
  /** Máximo de publicaciones (las más recientes). */
  limit?: number;
  /** Link a todas las publicaciones: muestra "Ver todas". */
  moreHref?: string;
};

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

/**
 * Novedades = publicaciones de Instagram, como tarjetas enlazadas.
 * No usa el embed oficial: carga más liviana y estética propia.
 * Se ordenan solas por fecha (más recientes primero).
 */
export function InstagramFeed({ id, title, handle, profileUrl, posts, limit, moreHref }: InstagramFeedProps) {
  const sorted = [...posts].sort(
    (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || (b.date ?? '').localeCompare(a.date ?? ''),
  );
  const visible = limit ? sorted.slice(0, limit) : sorted;

  return (
    <Section id={id} label={titleText(title) ?? 'Novedades'}>
      <SectionHeader
        title={title}
        action={
          <>
            {moreHref && sorted.length > visible.length && (
              <Button href={moreHref} variant="outline">
                Ver todas
              </Button>
            )}
            <Button href={profileUrl} variant="outline" target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" size={18} />
              Seguinos {handle}
            </Button>
          </>
        }
      />

      {visible.length === 0 && (
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={styles.empty}>
          <Icon name="instagram" size={28} />
          <span>
            Las novedades de la escuela se publican en Instagram. <strong>Seguinos en {handle}</strong>
          </span>
        </a>
      )}

      <ul className={styles.grid}>
        {visible.map((post) => (
          <li key={post.url + post.caption}>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.post}
              aria-label={`Ver en Instagram: ${post.caption}`}
            >
              <Media
                src={post.image}
                alt={post.caption}
                ratio="4/5"
                tone={post.tone ?? 'violet'}
                showPlaceholderCaption={false}
                className={styles.media}
              />
              <span className={styles.overlay} aria-hidden="true">
                <Icon name="instagram" size={20} className={styles.icon} />
                <span className={styles.meta}>
                  {post.date && <span className={styles.date}>{formatDate(post.date)}</span>}
                  <span className={styles.caption}>{post.caption}</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
