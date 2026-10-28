import { Icon, Section } from '@/components/ui';
import { SectionHeader } from '@/components/blocks';
import type { IconName } from '@/components/ui';
import type { SectionBaseProps, SectionTitle } from '../types';
import styles from './QuickLinks.module.css';

export type QuickLink = {
  icon: IconName;
  label: string;
  description: string;
  href: string;
};

export type QuickLinksProps = SectionBaseProps & {
  label: string;
  /** Título visible (opcional). En la portada no se usa: los accesos hablan solos. */
  title?: SectionTitle;
  items: QuickLink[];
};

/** Accesos rápidos "tipo app" a lo que más se busca. Ideal: 4 ítems. */
export function QuickLinks({ id, label, title, items }: QuickLinksProps) {
  return (
    <Section id={id} label={label} spacing={title ? 'default' : 'compact'}>
      {title && <SectionHeader title={title} />}
      <ul className={styles.grid}>
        {items.map((item) => {
          const external = item.href.startsWith('http');
          return (
            <li key={item.label}>
              <a
                href={item.href}
                className={styles.card}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className={styles.icon}>
                  <Icon name={item.icon} size={22} />
                </span>
                <span className={styles.copy}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.description}>{item.description}</span>
                </span>
                <Icon name="arrow" size={18} className={styles.arrow} />
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
