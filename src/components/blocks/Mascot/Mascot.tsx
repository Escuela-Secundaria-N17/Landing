import { cx } from '@/lib/cx';
import styles from './Mascot.module.css';

/** Rutas de los recursos en /public. Cambiando acá se cambia en toda la web. */
const SOURCES = {
  full: { src: '/img/mascota.webp', width: 571, height: 1100 },
  face: { src: '/img/mascota-cara.webp', width: 240, height: 240 },
} as const;

type MascotProps = {
  /** `full` = cuerpo entero estilo sticker; `face` = cara en círculo para avatares. */
  variant?: keyof typeof SOURCES;
  /** Alto en px para `full`, lado en px para `face`. */
  size?: number;
  animated?: boolean;
  /**
   * Animación al pasar el mouse. Por defecto: `wiggle` (sacude la cabeza)
   * para la cara y `dance` (baila) para el cuerpo entero.
   */
  hover?: 'wiggle' | 'dance' | 'none';
  /** Vacío = decorativa. Pasar texto si la imagen aporta información. */
  alt?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Mascota de "La Poeta": caricatura de Juan L. Ortiz.
 * Se usa en el hero, el footer y como avatar de la escuela en el chat.
 */
export function Mascot({
  variant = 'full',
  size = 480,
  animated = true,
  hover,
  alt = '',
  priority = false,
  className,
}: MascotProps) {
  const source = SOURCES[variant];
  const hoverEffect = hover ?? (variant === 'face' ? 'wiggle' : 'dance');
  const height = size;
  const width = Math.round((size * source.width) / source.height);

  return (
    <img
      src={source.src}
      width={width}
      height={height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cx(
        styles.mascot,
        styles[variant],
        animated && styles.float,
        hoverEffect !== 'none' && styles[hoverEffect],
        className,
      )}
    />
  );
}
