import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Card.module.css';

export type CardVariant = 'surface' | 'outline' | 'primary' | 'bare';

type CardProps = {
  as?: ElementType;
  variant?: CardVariant;
  padding?: 'none' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
};

/** Contenedor redondeado. Las imágenes, el código y las burbujas grandes se apoyan en él. */
export function Card({ as: Tag = 'div', variant = 'surface', padding = 'md', className, children }: CardProps) {
  return <Tag className={cx(styles.card, styles[variant], styles[`pad-${padding}`], className)}>{children}</Tag>;
}
