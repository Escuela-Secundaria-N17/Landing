import { Button, Icon, Pill, Section, Text } from '@/components/ui';
import { SectionHeader } from '@/components/blocks';
import { esReciente, fechaCorta } from '@/domain/concursos';
import type { Llamado } from '@/domain/concursos';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import styles from './Notices.module.css';

export type NoticesProps = SectionBaseProps & {
  title?: SectionTitle;
  description?: string;
  items: Llamado[];
  limit?: number;
  /** Fuente completa (ej. sección Concursos del CGE). */
  more?: { label: string; href: string };
  emptyText: string;
};

/** Publicaciones externas (ej. llamados del CGE), más nuevas primero. Abren en otra pestaña. */
export function Notices({ id, title, description, items, limit, more, emptyText }: NoticesProps) {
  const lista = limit ? items.slice(0, limit) : items;
  const action = more ? (
    <Button href={more.href} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
      {more.label}
      <Icon name="arrow" size={16} />
    </Button>
  ) : undefined;

  return (
    <Section id={id} label={titleText(title) ?? 'Publicaciones'}>
      <SectionHeader title={title} description={description} action={action} />
      {lista.length === 0 ? (
        <Text tone="muted" className={styles.empty}>
          {emptyText}
        </Text>
      ) : (
        <ul className={styles.list}>
          {lista.map((item) => {
            const { dia, mes } = fechaCorta(item.fecha);
            return (
              <li key={item.href} className={styles.row}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.inner}>
                  <time dateTime={item.fecha} className={styles.date}>
                    <span className={styles.day}>{dia}</span>
                    <span className={styles.month}>{mes}</span>
                  </time>
                  <span className={styles.title}>{item.titulo}</span>
                  <span className={styles.tags}>
                    {esReciente(item) && (
                      <Pill variant="magenta" size="sm">
                        Nuevo
                      </Pill>
                    )}
                    <Icon name="arrow" size={18} className={styles.arrow} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
