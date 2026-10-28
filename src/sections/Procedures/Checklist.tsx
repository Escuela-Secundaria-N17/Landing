import { useEffect, useId, useState } from 'react';
import { Pill } from '@/components/ui';
import type { GrupoRequisitos } from '@/domain/tramites';
import styles from './Procedures.module.css';

type ChecklistProps = {
  /** Clave para recordar lo tildado en este navegador. */
  storageKey: string;
  groups: GrupoRequisitos[];
};

const load = (key: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]');
  } catch {
    return [];
  }
};

/**
 * Lista de documentación tildable: las familias marcan lo que ya tienen.
 * Se recuerda en el navegador (es una comodidad, no un registro).
 */
export function Checklist({ storageKey, groups }: ChecklistProps) {
  const uid = useId();
  const [checked, setChecked] = useState<Set<string>>(() => new Set(load(storageKey)));
  const required = groups.flatMap((g) => g.items.filter((i) => !i.opcional).map((i) => `${g.titulo}::${i.texto}`));
  const done = required.filter((k) => checked.has(k)).length;

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...checked]));
    } catch {
      /* sin almacenamiento: la lista funciona igual, sólo no se recuerda */
    }
  }, [checked, storageKey]);

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className={styles.checklist}>
      <div className={styles.checklistHead}>
        <h4 className={styles.checklistTitle}>Documentación a presentar</h4>
        <span className={styles.progress} aria-live="polite">
          {done} de {required.length} listos
        </span>
      </div>
      <div className={styles.groups}>
        {groups.map((group) => (
          <fieldset key={group.titulo} className={styles.group}>
            <legend className={styles.groupTitle}>{group.titulo}</legend>
            {group.items.map((item, i) => {
              const key = `${group.titulo}::${item.texto}`;
              const inputId = `${uid}-${group.titulo}-${i}`;
              return (
                <label key={key} htmlFor={inputId} className={styles.check}>
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={checked.has(key)}
                    onChange={() => toggle(key)}
                    className={styles.checkInput}
                  />
                  <span className={styles.checkBox} aria-hidden="true" />
                  <span className={styles.checkText}>
                    {item.texto}
                    {item.opcional && (
                      <Pill variant="outline" size="sm" className={styles.optional}>
                        No excluyente
                      </Pill>
                    )}
                  </span>
                </label>
              );
            })}
          </fieldset>
        ))}
      </div>
    </div>
  );
}
