import { useMemo, useState } from 'react';
import { Button, Chip, Section, Text } from '@/components/ui';
import { SectionHeader } from '@/components/blocks';
import { TIPO_EVENTO_LABEL, agruparPorMes, pasados, proximos } from '@/domain/agenda';
import type { Evento, TipoEvento } from '@/domain/agenda';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import { EventRow } from './EventRow';
import styles from './Agenda.module.css';

export type AgendaProps = SectionBaseProps & {
  title?: SectionTitle;
  events: Evento[];
  /** Máximo de próximas fechas (portada). */
  limit?: number;
  /** Link a la agenda completa: muestra "Ver agenda". */
  moreHref?: string;
  /** Filtros por tipo y acceso a fechas pasadas (página /agenda). */
  filters?: boolean;
};

export function Agenda({ id, title, events, limit, moreHref, filters = false }: AgendaProps) {
  const [tipo, setTipo] = useState<TipoEvento | undefined>();
  const [verPasados, setVerPasados] = useState(false);

  const tiposPresentes = useMemo(
    () => (Object.keys(TIPO_EVENTO_LABEL) as TipoEvento[]).filter((t) => events.some((e) => e.tipo === t)),
    [events],
  );

  const lista = useMemo(() => {
    const base = verPasados ? pasados(events) : proximos(events);
    const filtrada = tipo ? base.filter((e) => e.tipo === tipo) : base;
    return limit ? filtrada.slice(0, limit) : filtrada;
  }, [events, tipo, verPasados, limit]);

  const action = moreHref ? (
    <Button href={moreHref} variant="outline" size="sm">
      Ver agenda completa
    </Button>
  ) : undefined;

  return (
    <Section id={id} label={titleText(title) ?? 'Agenda'}>
      {title && <SectionHeader title={title} action={action} />}

      {filters && (
        <div className={styles.filters}>
          <div className={styles.chips} role="group" aria-label="Filtrar por tipo">
            <Chip selected={tipo === undefined} onClick={() => setTipo(undefined)}>
              Todo
            </Chip>
            {tiposPresentes.map((t) => (
              <Chip key={t} selected={tipo === t} onClick={() => setTipo(t)}>
                {TIPO_EVENTO_LABEL[t]}
              </Chip>
            ))}
          </div>
          <Chip selected={verPasados} onClick={() => setVerPasados((v) => !v)}>
            Fechas pasadas
          </Chip>
        </div>
      )}

      {lista.length === 0 ? (
        <Text tone="muted" className={styles.empty}>
          {verPasados ? 'No hay fechas pasadas para mostrar.' : 'No hay fechas próximas cargadas por ahora.'}
        </Text>
      ) : filters ? (
        agruparPorMes(lista).map((grupo) => (
          <div key={grupo.mes} className={styles.group}>
            <h3 className={styles.monthTitle}>{grupo.mes}</h3>
            <ul className={styles.list}>
              {grupo.eventos.map((e) => (
                <EventRow key={e.fecha + e.titulo} evento={e} />
              ))}
            </ul>
          </div>
        ))
      ) : (
        <ul className={styles.list}>
          {lista.map((e) => (
            <EventRow key={e.fecha + e.titulo} evento={e} />
          ))}
        </ul>
      )}
    </Section>
  );
}
