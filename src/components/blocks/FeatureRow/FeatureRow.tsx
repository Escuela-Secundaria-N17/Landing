import { Media, Text } from '@/components/ui';
import type { MediaProps } from '@/components/ui';
import { cx } from '@/lib/cx';
import styles from './FeatureRow.module.css';

export type FeatureDetail = { label: string; text: string };

export type FeatureRowProps = {
  media: MediaProps;
  title: string;
  body?: string;
  /** Pares etiqueta/texto (en el diseño: "Antes:" / "Después:"). */
  details?: FeatureDetail[];
  /** Lado de la imagen. */
  mediaPosition?: 'start' | 'end';
  /** `lg` = imagen protagonista; `sm` = imagen chica con texto al pie. */
  mediaSize?: 'lg' | 'sm';
};

/** Fila imagen + texto. Alternando `mediaPosition` se arma el zig-zag del diseño. */
export function FeatureRow({
  media,
  title,
  body,
  details,
  mediaPosition = 'start',
  mediaSize = 'lg',
}: FeatureRowProps) {
  return (
    <article className={cx(styles.row, styles[`media-${mediaPosition}`], styles[`size-${mediaSize}`])}>
      <div className={styles.media}>
        <Media {...media} />
      </div>
      <div className={styles.content}>
        <Text weight="medium">{title}</Text>
        {body && <Text tone="muted">{body}</Text>}
        {details?.map((d) => (
          <div key={d.label} className={styles.detail}>
            <Text weight="medium">{d.label}</Text>
            <Text tone="muted">{d.text}</Text>
          </div>
        ))}
      </div>
    </article>
  );
}
