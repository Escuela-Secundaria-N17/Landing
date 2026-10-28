import type { ComponentType } from 'react';
import { sectionRegistry } from './registry';
import type { SectionConfig } from './registry';

type SectionRendererProps = {
  sections: SectionConfig[];
};

/** Recorre la configuración de una página y monta cada sección registrada. */
export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections
        .filter((section) => !section.hidden)
        .map((section) => {
          // La unión discriminada garantiza que props coincide con el componente;
          // acá sólo hace falta ensanchar el tipo para poder indexar el registro.
          const Component = sectionRegistry[section.type] as ComponentType<Record<string, unknown>>;
          return <Component key={section.id} id={section.id} {...section.props} />;
        })}
    </>
  );
}
