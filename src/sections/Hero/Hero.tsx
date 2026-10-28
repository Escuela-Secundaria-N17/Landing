import { Heading } from '@/components/ui';
import { Mascot, Wordmark } from '@/components/blocks';
import type { SectionBaseProps } from '../types';
import styles from './Hero.module.css';

export type HeroProps = SectionBaseProps & {
  /** Palabra gigante de fondo (nombre corto de la escuela). */
  wordmark: string;
  /** Título izquierdo, una línea por string. */
  leading: string[];
  /** Título derecho, una línea por string. */
  trailing: string[];
};

export function Hero({ id, wordmark, leading, trailing }: HeroProps) {
  return (
    <section id={id} className={styles.hero} aria-labelledby={id ? `${id}-title` : undefined}>
      <Wordmark text={wordmark} className={styles.wordmark} />

      <div className={styles.stage}>
        <Heading level={1} size="xl" className={styles.leading}>
          <span id={id ? `${id}-title` : undefined}>
            {leading.map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
          </span>
        </Heading>

        <Mascot size={560} priority className={styles.mascot} />

        <Heading level={2} size="xl" align="end" className={styles.trailing}>
          {trailing.map((line) => (
            <span key={line} className={styles.line}>
              {line}
            </span>
          ))}
        </Heading>
      </div>
    </section>
  );
}
