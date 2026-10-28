import { useState } from 'react';
import { Icon } from '@/components/ui';
import styles from './AlertBar.module.css';

export type SiteAlert = {
  text: string;
  href?: string;
  linkLabel?: string;
  /** Fecha ISO (AAAA-MM-DD). Pasado ese día la alerta deja de mostrarse sola. */
  until?: string;
};

/** ¿La alerta sigue vigente hoy? Se compara por día, en hora local. */
export function isAlertActive(alert: SiteAlert | undefined, today = new Date()): alert is SiteAlert {
  if (!alert) return false;
  if (!alert.until) return true;
  const [y, m, d] = alert.until.split('-').map(Number);
  const lastDay = new Date(y, m - 1, d, 23, 59, 59);
  return today <= lastDay;
}

/** Franja de aviso urgente sobre el header. El usuario puede cerrarla. */
export function AlertBar({ alert }: { alert: SiteAlert }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={styles.bar} role="status">
      <Icon name="megaphone" size={18} className={styles.icon} />
      <p className={styles.text}>
        {alert.text}
        {alert.href && (
          <>
            {' '}
            <a href={alert.href} className={styles.link}>
              {alert.linkLabel ?? 'Ver más'}
            </a>
          </>
        )}
      </p>
      <button type="button" className={styles.close} onClick={() => setDismissed(true)} aria-label="Cerrar aviso">
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
