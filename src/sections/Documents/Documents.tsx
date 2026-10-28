import { Icon, Pill, Section, Text } from '@/components/ui';
import { SectionHeader } from '@/components/blocks';
import { FORMATO_LABEL } from '@/domain/concursos';
import type { Documento } from '@/domain/concursos';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import styles from './Documents.module.css';

export type DocumentsProps = SectionBaseProps & {
  title?: SectionTitle;
  description?: string;
  items: Documento[];
  /** Texto si no hay documentos (ej. la carpeta de Drive todavía está vacía). */
  emptyText?: string;
};

/** Lista de documentos para descargar o consultar. */
export function Documents({ id, title, description, items, emptyText }: DocumentsProps) {
  return (
    <Section id={id} label={titleText(title) ?? 'Documentos'}>
      <SectionHeader title={title} description={description} />
      {items.length === 0 ? (
        emptyText && <Text tone="muted">{emptyText}</Text>
      ) : (
        <ul className={styles.grid}>
          {items.map((doc) => {
            const external = doc.href.startsWith('http');
            return (
              <li key={doc.href + doc.titulo}>
                <a
                  href={doc.href}
                  className={styles.card}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className={styles.icon}>
                    <Icon name={doc.descarga ? 'download' : 'arrow'} size={22} />
                  </span>
                  <span className={styles.copy}>
                    <span className={styles.title}>{doc.titulo}</span>
                    {doc.descripcion && <span className={styles.description}>{doc.descripcion}</span>}
                  </span>
                  <span className={styles.meta}>
                    {doc.formato && (
                      <Pill variant="outline" size="sm">
                        {FORMATO_LABEL[doc.formato]}
                      </Pill>
                    )}
                    <span className={styles.action}>{doc.descarga ? 'Descargar' : 'Abrir'}</span>
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
