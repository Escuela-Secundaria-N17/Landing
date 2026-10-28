import { Section } from '@/components/ui';
import { Marquee } from '@/components/blocks';
import type { MarqueeItem } from '@/components/blocks';
import type { SectionBaseProps } from '../types';
import styles from './TagMarquee.module.css';

export type TagMarqueeProps = SectionBaseProps & {
  label: string;
  /** Cada fila es una cinta; las filas alternan dirección y velocidad. */
  rows: MarqueeItem[][];
};

export function TagMarquee({ id, label, rows }: TagMarqueeProps) {
  return (
    <Section id={id} label={label} spacing="compact" flush>
      <div className={styles.rows}>
        {rows.map((items, i) => (
          <Marquee key={i} items={items} offset={i * 2} reverse={i % 2 === 1} duration={45 + i * 12} label={label} />
        ))}
      </div>
    </Section>
  );
}
