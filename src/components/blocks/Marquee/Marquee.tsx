import type { CSSProperties } from 'react';
import { Pill } from '@/components/ui';
import type { PillVariant } from '@/components/ui';
import styles from './Marquee.module.css';

/** Ciclo de colores por defecto (paleta de la escuela). */
const CYCLE: PillVariant[] = ['deep', 'magenta', 'primary', 'turquoise'];

export type MarqueeItem = { label: string; variant?: PillVariant };

type MarqueeProps = {
  items: MarqueeItem[];
  /** Corre el ciclo de colores: filas consecutivas no arrancan igual. */
  offset?: number;
  /** Segundos por vuelta completa. */
  duration?: number;
  reverse?: boolean;
  /** Etiqueta accesible para la lista. */
  label?: string;
};

/**
 * Cinta infinita de pills. Duplica la lista para que el loop no tenga saltos;
 * la copia queda oculta para lectores de pantalla.
 */
export function Marquee({ items, offset = 0, duration = 40, reverse = false, label }: MarqueeProps) {
  const style = { '--marquee-duration': `${duration}s` } as CSSProperties;

  const renderTrack = (hidden: boolean) => (
    <ul className={styles.track} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item.label}-${i}`}>
          <Pill variant={item.variant ?? CYCLE[(i + offset) % CYCLE.length]}>{item.label}</Pill>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.marquee} data-reverse={reverse || undefined} style={style} aria-label={label}>
      <div className={styles.inner}>
        {renderTrack(false)}
        {renderTrack(true)}
      </div>
    </div>
  );
}
