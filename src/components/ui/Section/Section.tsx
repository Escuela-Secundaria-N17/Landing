import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Container } from '../Container/Container';
import styles from './Section.module.css';

export type SectionSpacing = 'default' | 'none' | 'compact';

export type SectionProps = {
  id?: string;
  /** Nombre accesible de la sección (lo usan lectores de pantalla). */
  label?: string;
  spacing?: SectionSpacing;
  /** `flush` no envuelve en Container: para marquees o bloques a sangre. */
  flush?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Envoltorio base de TODAS las secciones de la página.
 * Centraliza el ritmo vertical y el ancho, así cada sección nueva
 * hereda el espaciado correcto sin repetir CSS.
 */
export function Section({ id, label, spacing = 'default', flush = false, className, children }: SectionProps) {
  return (
    <section id={id} aria-label={label} className={cx(styles.section, styles[spacing], className)}>
      {flush ? children : <Container>{children}</Container>}
    </section>
  );
}
