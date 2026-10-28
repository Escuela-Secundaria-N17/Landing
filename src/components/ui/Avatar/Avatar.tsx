import { cx } from '@/lib/cx';
import styles from './Avatar.module.css';

type AvatarProps = {
  name: string;
  src?: string;
  size?: 'sm' | 'md';
  className?: string;
};

/** Avatar redondo; sin foto muestra iniciales. */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span className={cx(styles.avatar, styles[size], className)} title={name}>
      {src ? <img src={src} alt={name} className={styles.img} /> : <span aria-hidden="true">{initials}</span>}
      {!src && <span className="visually-hidden">{name}</span>}
    </span>
  );
}
