import type { ReactNode } from 'react';
import { Button, Icon, Pill, Text } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { diaMes, estadoTramite, etiquetaEstado } from '@/domain/tramites';
import type { Tramite } from '@/domain/tramites';
import { Checklist } from './Checklist';
import styles from './Procedures.module.css';

function InfoTile({ icon, label, children }: { icon: IconName; label: string; children: ReactNode }) {
  return (
    <div className={styles.tile}>
      <span className={styles.tileIcon}>
        <Icon name={icon} size={20} />
      </span>
      <div className={styles.tileCopy}>
        <span className={styles.tileLabel}>{label}</span>
        <span className={styles.tileValue}>{children}</span>
      </div>
    </div>
  );
}

function rangoFechas({ desde, hasta }: NonNullable<Tramite['vigencia']>): string {
  if (desde && hasta) return `Del ${diaMes(desde)} al ${diaMes(hasta)}`;
  if (hasta) return `Hasta el ${diaMes(hasta)}`;
  return `Desde el ${diaMes(desde!)}`;
}

const linkIcon = (href: string): IconName =>
  href.startsWith('mailto:') ? 'mail' : href.startsWith('tel:') ? 'phone' : 'arrow';

/**
 * Detalle completo de un trámite. Cada bloque aparece sólo si el dato existe:
 * fechas/horario/lugar, documentación tildable, pasos, nota y enlaces.
 */
export function ProcedureDetail({ tramite, panelId, labelledBy }: { tramite: Tramite; panelId: string; labelledBy: string }) {
  const estado = estadoTramite(tramite);
  const estadoLabel = etiquetaEstado(estado);
  const hasTiles = Boolean(tramite.vigencia || tramite.horario || tramite.lugar);

  return (
    <article id={panelId} role="tabpanel" aria-labelledby={labelledBy} className={styles.detail}>
      <header className={styles.detailHeader}>
        {(tramite.etiqueta || estadoLabel) && (
          <div className={styles.badges}>
            {tramite.etiqueta && (
              <Pill variant="outline" size="sm" className={styles.onViolet}>
                {tramite.etiqueta}
              </Pill>
            )}
            {estadoLabel && (
              <Pill variant={estado.tipo === 'abierto' ? 'turquoise' : 'deep'} size="sm">
                {estadoLabel}
              </Pill>
            )}
          </div>
        )}
        <h2 className={styles.detailTitle}>{tramite.titulo}</h2>
        <Text size="md" className={styles.detailSummary}>
          {tramite.resumen}
        </Text>
      </header>

      {hasTiles && (
        <div className={styles.tiles}>
          {tramite.vigencia && (
            <InfoTile icon="calendar" label="Cuándo">
              {rangoFechas(tramite.vigencia)}
            </InfoTile>
          )}
          {tramite.horario && (
            <InfoTile icon="clock" label="Horario">
              {tramite.horario}
            </InfoTile>
          )}
          {tramite.lugar && (
            <InfoTile icon="pin" label="Dónde">
              {tramite.lugar.texto}
              {tramite.lugar.mapa && (
                <a href={tramite.lugar.mapa} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                  Ver en el mapa
                </a>
              )}
            </InfoTile>
          )}
        </div>
      )}

      {tramite.requisitos && <Checklist storageKey={`checklist:${tramite.id}`} groups={tramite.requisitos} />}

      {tramite.pasos && (
        <div className={styles.stepsBlock}>
          <h3 className={styles.blockTitle}>Cómo se hace</h3>
          <ol className={styles.steps}>
            {tramite.pasos.map((paso, i) => (
              <li key={paso} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {i + 1}
                </span>
                <span>{paso}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {tramite.nota && (
        <Text size="sm" className={styles.note}>
          {tramite.nota}
        </Text>
      )}

      {tramite.enlaces && tramite.enlaces.length > 0 && (
        <footer className={styles.detailFooter}>
          {tramite.enlaces.map((link) => (
            <Button key={link.href} href={link.href} variant="deep" size="sm">
              <Icon name={linkIcon(link.href)} size={16} />
              {link.label}
            </Button>
          ))}
        </footer>
      )}
    </article>
  );
}
