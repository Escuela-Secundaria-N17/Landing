import { Avatar, Media } from '@/components/ui';
import type { MediaProps } from '@/components/ui';
import { Mascot } from '../Mascot/Mascot';
import { cx } from '@/lib/cx';
import styles from './ChatMessage.module.css';

export type ChatAuthor = 'school' | 'visitor';

export type ChatMessageData = {
  from: ChatAuthor;
  text?: string;
  media?: MediaProps;
  /** Nombre del visitante para el avatar. */
  name?: string;
};

/**
 * Mensaje de la conversación simulada.
 * - `visitor`: burbuja pill violeta alineada a la derecha con avatar.
 * - `school`: tarjeta (texto o imagen) a la izquierda con la mascota.
 */
export function ChatMessage({ from, text, media, name = 'Familia' }: ChatMessageData) {
  if (from === 'visitor') {
    return (
      <div className={cx(styles.message, styles.visitor)}>
        <p className={styles.bubble}>{text}</p>
        <Avatar name={name} size="md" />
      </div>
    );
  }

  return (
    <div className={cx(styles.message, styles.school)}>
      <Mascot variant="face" size={40} animated={false} className={styles.badge} />
      <div className={styles.card}>
        {media && <Media {...media} />}
        {text && <p className={styles.schoolText}>{text}</p>}
      </div>
    </div>
  );
}
