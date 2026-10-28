import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Chip, Section } from '@/components/ui';
import type { Tramite } from '@/domain/tramites';
import type { SectionBaseProps } from '../types';
import { ProcedureDetail } from './ProcedureDetail';
import styles from './Procedures.module.css';

export type ProceduresProps = SectionBaseProps & {
  /** El primero se muestra por defecto. */
  items: Tramite[];
};

const hashId = () => decodeURIComponent(window.location.hash.slice(1));

/**
 * Trámites como pestañas: los filtros quedan arriba y se muestra
 * el detalle del elegido. La URL refleja la selección (/tramites#sage),
 * así cada trámite se puede compartir o enlazar desde otras páginas.
 */
export function Procedures({ id, items }: ProceduresProps) {
  const uid = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const findIndex = (target: string) => Math.max(0, items.findIndex((t) => t.id === target));
  const [active, setActive] = useState(() => findIndex(hashId()));

  // Links externos a /tramites#algo mientras ya estamos en la página
  useEffect(() => {
    const onHash = () => setActive(findIndex(hashId()));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const select = (index: number, focus = false) => {
    setActive(index);
    window.history.replaceState(window.history.state, '', `#${items[index].id}`);
    if (focus) tabRefs.current[index]?.focus();
  };

  // Teclado del patrón "tabs": flechas, Inicio y Fin
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      select(moves[e.key], true);
    }
  };

  const current = items[active];
  if (!current) return null;

  return (
    <Section id={id} label="Trámites">
      <div className={styles.tabs} role="tablist" aria-label="Tipo de trámite" onKeyDown={onKeyDown}>
        {items.map((t, i) => (
          <Chip
            key={t.id}
            mode="tab"
            selected={i === active}
            id={`${uid}-tab-${t.id}`}
            aria-controls={t.id}
            ref={(el: HTMLButtonElement | null) => {
              tabRefs.current[i] = el;
            }}
            onClick={() => select(i)}
          >
            {t.filtro}
          </Chip>
        ))}
      </div>

      <ProcedureDetail key={current.id} tramite={current} panelId={current.id} labelledBy={`${uid}-tab-${current.id}`} />
    </Section>
  );
}
