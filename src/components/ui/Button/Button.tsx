import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'deep' | 'outline';
export type ButtonSize = 'sm' | 'md';

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

type AsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = AsButton | AsLink;

/** Botón pill. Si recibe `href` se renderiza como <a>, si no como <button>. */
export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const classes = cx(styles.button, styles[variant], styles[size], className);

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
