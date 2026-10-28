import { Container, Text } from '@/components/ui';
import { Mascot } from '@/components/blocks';
import type { SectionBaseProps } from '../types';
import styles from './PageIntro.module.css';

export type PageIntroProps = SectionBaseProps & {
  title: string;
  description?: string;
  /** Texto chico sobre el título (ej. "Espacio académico"). */
  kicker?: string;
  /** Mostrar la mascota a la derecha en escritorio. */
  mascot?: boolean;
};

/** Cabecera de las páginas internas: el equivalente "chico" del hero. */
export function PageIntro({ id, title, description, kicker, mascot = false }: PageIntroProps) {
  return (
    <section id={id} className={styles.intro} aria-labelledby={id ? `${id}-title` : undefined}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <nav aria-label="Ruta de navegación" className={styles.crumbs}>
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>
          {kicker && (
            <Text size="sm" tone="muted" className={styles.kicker}>
              {kicker}
            </Text>
          )}
          <h1 id={id ? `${id}-title` : undefined} className={styles.title}>
            {title}
          </h1>
          {description && (
            <Text size="md" tone="muted" className={styles.description}>
              {description}
            </Text>
          )}
        </div>
        {mascot && <Mascot size={300} animated className={styles.mascot} />}
      </Container>
    </section>
  );
}
