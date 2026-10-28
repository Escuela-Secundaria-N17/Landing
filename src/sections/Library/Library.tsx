import { useMemo, useState } from 'react';
import { Chip, Section, SearchField, Text } from '@/components/ui';
import { SectionHeader } from '@/components/blocks';
import { filtrarMaterias, orientacionesDe } from '@/domain/materias';
import type { Anio, Materia } from '@/domain/materias';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import { SubjectCard } from './SubjectCard';
import styles from './Library.module.css';

export type LibraryProps = SectionBaseProps & {
  title?: SectionTitle;
  description?: string;
  materias: Materia[];
};

const ANIOS: Anio[] = [1, 2, 3, 4, 5, 6];

/**
 * Bibliografía por materia: filtro por año (y orientación en el ciclo
 * orientado) + búsqueda libre por materia, docente o título.
 */
export function Library({ id, title, description, materias }: LibraryProps) {
  const [anio, setAnio] = useState<Anio | undefined>();
  const [orientacion, setOrientacion] = useState<string | undefined>();
  const [query, setQuery] = useState('');

  const orientaciones = useMemo(
    () => (anio && anio >= 4 ? orientacionesDe(materias.filter((m) => m.anio === anio)) : []),
    [materias, anio],
  );

  const resultados = useMemo(
    () => filtrarMaterias(materias, { anio, orientacion, query }),
    [materias, anio, orientacion, query],
  );

  const totalMateriales = resultados.reduce((acc, m) => acc + m.materiales.length, 0);

  const selectAnio = (value: Anio | undefined) => {
    setAnio(value);
    setOrientacion(undefined);
  };

  if (materias.length === 0) {
    return (
      <Section id={id} label={titleText(title)}>
        {title && <SectionHeader title={title} description={description} />}
        <div className={styles.empty}>
          <Text tone="muted">
            Estamos cargando la bibliografía de cada materia. Mientras tanto, consultá a tus docentes o en
            preceptoría.
          </Text>
        </div>
      </Section>
    );
  }

  return (
    <Section id={id} label={titleText(title)}>
      {title && <SectionHeader title={title} description={description} />}

      <div className={styles.controls}>
        <div className={styles.chips} role="group" aria-label="Filtrar por año">
          <Chip selected={anio === undefined} onClick={() => selectAnio(undefined)}>
            Todos
          </Chip>
          {ANIOS.map((a) => (
            <Chip key={a} selected={anio === a} onClick={() => selectAnio(a)}>
              {a}° año
            </Chip>
          ))}
        </div>
        <SearchField
          value={query}
          onChange={setQuery}
          label="Buscar materia, docente o material"
          placeholder="Buscar materia, docente o material…"
          className={styles.search}
        />
      </div>

      {orientaciones.length > 1 && (
        <div className={styles.chips} role="group" aria-label="Filtrar por orientación">
          <Chip selected={orientacion === undefined} onClick={() => setOrientacion(undefined)}>
            Todas las orientaciones
          </Chip>
          {orientaciones.map((o) => (
            <Chip key={o} selected={orientacion === o} onClick={() => setOrientacion(o)}>
              {o}
            </Chip>
          ))}
        </div>
      )}

      <Text size="xs" tone="muted" className={styles.summary} as="p">
        <span aria-live="polite">
          {resultados.length} {resultados.length === 1 ? 'materia' : 'materias'} · {totalMateriales}{' '}
          {totalMateriales === 1 ? 'material' : 'materiales'}
        </span>
      </Text>

      {resultados.length > 0 ? (
        <div className={styles.grid}>
          {resultados.map((m) => (
            <SubjectCard key={m.id} materia={m} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Text tone="muted">No encontramos materias con ese filtro.</Text>
          <Chip
            onClick={() => {
              selectAnio(undefined);
              setQuery('');
            }}
          >
            Limpiar filtros
          </Chip>
        </div>
      )}
    </Section>
  );
}
