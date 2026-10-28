import { Icon, Pill, Text } from '@/components/ui';
import { TIPO_LABEL, cicloDe } from '@/domain/materias';
import type { Materia } from '@/domain/materias';
import styles from './Library.module.css';

/** Tarjeta de una materia con su material. Privada de la sección Library. */
export function SubjectCard({ materia }: { materia: Materia }) {
  const { nombre, area, anio, orientacion, docentes, materiales } = materia;

  return (
    <article className={styles.subject}>
      <header className={styles.subjectHeader}>
        <span className={styles.year} aria-label={`${anio}° año`}>
          {anio}°
        </span>
        <div className={styles.subjectTitle}>
          <h3 className={styles.subjectName}>{nombre}</h3>
          <Text size="xs" tone="muted">
            {[area, `Ciclo ${cicloDe(anio)}`, orientacion].filter(Boolean).join(' · ')}
          </Text>
        </div>
      </header>

      {docentes && docentes.length > 0 && (
        <Text size="xs" tone="muted">
          Docente{docentes.length > 1 ? 's' : ''}: {docentes.join(', ')}
        </Text>
      )}

      {materiales.length > 0 ? (
        <ul className={styles.materials}>
          {materiales.map((m) => (
            <li key={`${m.tipo}-${m.titulo}`}>
              <a href={m.href} target="_blank" rel="noopener noreferrer" className={styles.material}>
                <Pill variant="outline" size="sm" className={styles.materialType}>
                  {TIPO_LABEL[m.tipo]}
                </Pill>
                <span className={styles.materialTitle}>
                  {m.titulo}
                  {m.autor && <span className={styles.materialAuthor}> — {m.autor}</span>}
                </span>
                <Icon name={m.tipo === 'enlace' ? 'arrow' : 'download'} size={18} className={styles.materialIcon} />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <Text size="sm" tone="subtle" className={styles.noMaterial}>
          Todavía no hay material cargado.
        </Text>
      )}
    </article>
  );
}
