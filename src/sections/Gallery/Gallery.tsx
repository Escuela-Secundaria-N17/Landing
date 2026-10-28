import { Section } from '@/components/ui';
import { BentoGrid, SectionHeader } from '@/components/blocks';
import type { BentoItem } from '@/components/blocks';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';

export type GalleryProps = SectionBaseProps & {
  title?: SectionTitle;
  items: BentoItem[];
};

export function Gallery({ id, title, items }: GalleryProps) {
  return (
    <Section id={id} label={titleText(title)}>
      {title && <SectionHeader title={title} />}
      <BentoGrid items={items} />
    </Section>
  );
}
