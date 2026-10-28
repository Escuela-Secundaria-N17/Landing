import { cx } from '@/lib/cx';
import styles from './Media.module.css';

export type MediaTone = 'violet' | 'dusk' | 'ember' | 'ocean' | 'forest' | 'night';
export type MediaRatio = '1/1' | '4/3' | '3/2' | '16/9' | '3/4' | '4/5' | 'auto';

export type MediaProps = {
  /** Si no hay `src`, se muestra un placeholder con gradiente y el `alt` como guía. */
  src?: string;
  alt: string;
  ratio?: MediaRatio;
  tone?: MediaTone;
  rounded?: boolean;
  /** Mostrar el `alt` sobre el placeholder (útil mientras faltan fotos). */
  showPlaceholderCaption?: boolean;
  className?: string;
};

/**
 * Imagen con relación de aspecto fija. Mientras no haya fotos reales,
 * el placeholder deja ver qué foto va en cada lugar.
 */
export function Media({
  src,
  alt,
  ratio = '4/3',
  tone = 'violet',
  rounded = true,
  showPlaceholderCaption = true,
  className,
}: MediaProps) {
  const style = ratio === 'auto' ? undefined : { aspectRatio: ratio };

  return (
    <figure className={cx(styles.media, rounded && styles.rounded, className)} style={style}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" className={styles.img} />
      ) : (
        <div className={cx(styles.placeholder, styles[tone])} role="img" aria-label={alt}>
          {showPlaceholderCaption && <span className={styles.caption}>{alt}</span>}
        </div>
      )}
    </figure>
  );
}
