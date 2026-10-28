import type { ReactNode } from 'react';
import { Heading, Text } from '@/components/ui';
import { cx } from '@/lib/cx';
import styles from './SectionHeader.module.css';

export type SectionHeaderProps = {
  /** Cada string es una línea, como los títulos en dos renglones del diseño. */
  title?: string | string[];
  description?: ReactNode;
  /** Botones a la derecha. Sin título, la cabecera queda sólo con las acciones. */
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  if (!title && !description && !action) return null;
  const lines = title === undefined ? [] : Array.isArray(title) ? title : [title];

  return (
    <header className={cx(styles.header, !title && styles.actionsOnly, className)}>
      {(title || description) && (
        <div className={styles.copy}>
          {lines.length > 0 && (
            <Heading level={2} size="xl">
              {lines.map((line, i) => (
                <span key={i} className={styles.line}>
                  {line}
                </span>
              ))}
            </Heading>
          )}
          {description && (
            <Text tone="muted" className={styles.description}>
              {description}
            </Text>
          )}
        </div>
      )}
      {action && <div className={styles.action}>{action}</div>}
    </header>
  );
}
