import { Section } from '@/components/ui';
import { FeatureRow, SectionHeader } from '@/components/blocks';
import type { FeatureRowProps } from '@/components/blocks';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import styles from './Features.module.css';

export type FeaturesProps = SectionBaseProps & {
  title?: SectionTitle;
  items: FeatureRowProps[];
};

export function Features({ id, title, items }: FeaturesProps) {
  return (
    <Section id={id} label={titleText(title)}>
      {title && <SectionHeader title={title} />}
      <div className={styles.list}>
        {items.map((item) => (
          <FeatureRow key={item.title} {...item} />
        ))}
      </div>
    </Section>
  );
}
