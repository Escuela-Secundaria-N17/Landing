import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Pill.module.css';

export type PillVariant = 'primary' | 'deep' | 'magenta' | 'turquoise' | 'outline';

type PillProps = {
  variant?: PillVariant;
  /** `md` para el marquee; `sm` para etiquetas dentro de tarjetas. */
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
};

/** Etiqueta pill no interactiva (tags, chips del marquee, tipos de material). */
export function Pill({ variant = 'deep', size = 'md', className, children }: PillProps) {
  return <span className={cx(styles.pill, styles[variant], styles[size], className)}>{children}</span>;
}
