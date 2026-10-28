import { Icon, Pill } from '@/components/ui';
import { TIPO_EVENTO_LABEL, bloqueFecha, estadoEvento } from '@/domain/agenda';
import type { Evento } from '@/domain/agenda';
import { cx } from '@/lib/cx';
import styles from './Agenda.module.css';

/** Una fila de la agenda: bloque de fecha, título, detalles y tipo. */
export function EventRow({ evento }: { evento: Evento }) {
  const { dia, mes } = bloqueFecha(evento);
  const estado = estadoEvento(evento);
  const meta = [evento.hora, evento.lugar].filter(Boolean).join(' · ');

  const content = (
    <>
      <time dateTime={evento.fecha} className={cx(styles.date, estado === 'en-curso' && styles.dateLive)}>
        <span className={styles.day}>{dia}</span>
        {mes && <span className={styles.month}>{mes}</span>}
      </time>
      <span className={styles.body}>
        <span className={styles.title}>{evento.titulo}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </span>
      <span className={styles.tags}>
        {estado === 'en-curso' && (
          <Pill variant="magenta" size="sm">
            En curso
          </Pill>
        )}
        <Pill variant="outline" size="sm" className={styles.type}>
          {TIPO_EVENTO_LABEL[evento.tipo]}
        </Pill>
        {evento.href && <Icon name="arrow" size={18} className={styles.arrow} />}
      </span>
    </>
  );

  return (
    <li className={cx(styles.row, estado === 'pasado' && styles.past)}>
      {evento.href ? (
        <a href={evento.href} className={styles.inner}>
          {content}
        </a>
      ) : (
        <div className={styles.inner}>{content}</div>
      )}
    </li>
  );
}
