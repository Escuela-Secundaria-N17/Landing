import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Text.module.css';

type TextProps = {
  as?: ElementType;
  size?: 'xs' | 'sm' | 'md';
  tone?: 'default' | 'muted' | 'subtle';
  weight?: 'regular' | 'medium';
  className?: string;
  children: ReactNode;
};

export function Text({
  as: Tag = 'p',
  size = 'sm',
  tone = 'default',
  weight = 'regular',
  className,
  children,
}: TextProps) {
  return <Tag className={cx(styles.text, styles[size], styles[tone], styles[weight], className)}>{children}</Tag>;
}
