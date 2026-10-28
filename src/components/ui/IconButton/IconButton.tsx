import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './IconButton.module.css';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Texto accesible obligatorio: el botón sólo muestra un ícono. */
  label: string;
  variant?: 'primary' | 'outline';
  children: ReactNode;
};

export function IconButton({ label, variant = 'outline', className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(styles.iconButton, styles[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
