import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '@/lib/cx';
import styles from './Chip.module.css';

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'role'> & {
  selected?: boolean;
  /**
   * `toggle` (filtro que se prende/apaga) expone aria-pressed.
   * `tab` (una opción entre varias que cambia el panel) expone role="tab" + aria-selected.
   */
  mode?: 'toggle' | 'tab';
  /** React 19: `ref` llega como prop común y se reenvía al <button>. */
  ref?: Ref<HTMLButtonElement>;
  children: ReactNode;
};

export function Chip({ selected = false, mode = 'toggle', className, children, ...rest }: ChipProps) {
  const a11y =
    mode === 'tab'
      ? { role: 'tab' as const, 'aria-selected': selected, tabIndex: selected ? 0 : -1 }
      : { 'aria-pressed': selected };

  return (
    <button type="button" {...a11y} className={cx(styles.chip, selected && styles.selected, className)} {...rest}>
      {children}
    </button>
  );
}
