import { useId } from 'react';
import { cx } from '@/lib/cx';
import { Icon } from '../Icon/Icon';
import styles from './SearchField.module.css';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
};

export function SearchField({ value, onChange, label, placeholder, className }: SearchFieldProps) {
  const id = useId();
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <Icon name="search" size={18} className={styles.icon} />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        autoComplete="off"
      />
    </div>
  );
}
