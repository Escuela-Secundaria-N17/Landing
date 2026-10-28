import type { CSSProperties } from 'react';
import { Card, Media, Text } from '@/components/ui';
import type { MediaProps } from '@/components/ui';
import styles from './BentoGrid.module.css';

type Span = { cols?: 1 | 2; rows?: 1 | 2 };

export type BentoItem =
  | ({ kind: 'media'; media: MediaProps } & Span)
  | ({ kind: 'note'; title: string; body: string; variant?: 'outline' | 'primary' } & Span);

type BentoGridProps = {
  items: BentoItem[];
};

/**
 * Grilla bento de 4 columnas (2 en mobile). Cada ítem define su span,
 * así el contenido decide el layout sin tocar CSS.
 */
export function BentoGrid({ items }: BentoGridProps) {
  return (
    <ul className={styles.grid}>
      {items.map((item, i) => {
        const style = {
          '--cols': item.cols ?? 1,
          '--rows': item.rows ?? 1,
        } as CSSProperties;

        return (
          <li key={i} className={styles.cell} style={style}>
            {item.kind === 'media' ? (
              <Media {...item.media} ratio="auto" className={styles.fill} />
            ) : (
              <Card variant={item.variant ?? 'outline'} padding="lg" className={styles.note}>
                <Text weight="medium" size="md">{item.title}</Text>
                <Text tone={item.variant === 'primary' ? 'default' : 'muted'}>{item.body}</Text>
              </Card>
            )}
          </li>
        );
      })}
    </ul>
  );
}
