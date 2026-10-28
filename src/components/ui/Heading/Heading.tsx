import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Heading.module.css';

type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = 'md' | 'lg' | 'xl';

type HeadingProps = {
  level?: HeadingLevel;
  /** El tamaño visual es independiente del nivel semántico. */
  size?: HeadingSize;
  uppercase?: boolean;
  align?: 'start' | 'end';
  className?: string;
  children: ReactNode;
};

export function Heading({
  level = 2,
  size = 'xl',
  uppercase = true,
  align = 'start',
  className,
  children,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={cx(styles.heading, styles[size], uppercase && styles.upper, styles[align], className)}>
      {children}
    </Tag>
  );
}
