import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Container.module.css';

type ContainerProps = {
  as?: ElementType;
  /** `wide` ocupa todo el ancho con gutter; `default` limita a --container-max. */
  size?: 'default' | 'wide';
  className?: string;
  children: ReactNode;
};

export function Container({ as: Tag = 'div', size = 'default', className, children }: ContainerProps) {
  return <Tag className={cx(styles.container, styles[size], className)}>{children}</Tag>;
}
