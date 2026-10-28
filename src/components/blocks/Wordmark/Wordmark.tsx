import { cx } from '@/lib/cx';
import styles from './Wordmark.module.css';

type WordmarkProps = {
  text: string;
  /** `ghost` = gris de fondo (hero); `solid` = blanco (footer). */
  tone?: 'ghost' | 'solid';
  className?: string;
};

/** Palabra gigante de borde a borde, decorativa. */
export function Wordmark({ text, tone = 'ghost', className }: WordmarkProps) {
  return (
    <div className={cx(styles.wordmark, styles[tone], className)} aria-hidden="true">
      {text}
    </div>
  );
}
