import { Avatar, Button, Card, Icon, Pill, Section, Text } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { SectionHeader } from '@/components/blocks';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import styles from './StudentCouncil.module.css';

export type CouncilMember = { role: string; name: string; curso?: string; photo?: string };

export type CouncilInitiative = {
  title: string;
  text: string;
  status: 'propuesta' | 'en-curso' | 'realizada';
};

export type CouncilLink = { label: string; href: string; icon?: IconName };

export type StudentCouncilProps = SectionBaseProps & {
  title?: SectionTitle;
  intro: string;
  /** Período de la comisión (ej. "2026–2027"). */
  period?: string;
  members: CouncilMember[];
  initiatives: CouncilInitiative[];
  links: CouncilLink[];
};

const STATUS_LABEL: Record<CouncilInitiative['status'], string> = {
  propuesta: 'Propuesta',
  'en-curso': 'En curso',
  realizada: 'Realizada',
};

export function StudentCouncil({ id, title, intro, period, members, initiatives, links }: StudentCouncilProps) {
  return (
    <Section id={id} label={titleText(title)}>
      {title && <SectionHeader title={title} />}

      <div className={styles.top}>
        <Card variant="primary" padding="lg" className={styles.intro}>
          <span className={styles.introIcon}>
            <Icon name="users" size={26} />
          </span>
          <Text size="md">{intro}</Text>
          <div className={styles.links}>
            {links.map((link, i) => (
              <Button
                key={link.href + link.label}
                href={link.href}
                variant={i === 0 ? 'deep' : 'outline'}
                size="sm"
                {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.icon && <Icon name={link.icon} size={16} />}
                {link.label}
              </Button>
            ))}
          </div>
        </Card>

        <div className={styles.membersWrap}>
          {period && (
            <Text size="xs" tone="muted" className={styles.period}>
              Comisión directiva {period}
            </Text>
          )}
          <ul className={styles.members}>
            {members.map((m) => (
              <li key={m.role} className={styles.member}>
                <Avatar name={m.name} src={m.photo} />
                <span className={styles.memberText}>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={styles.memberRole}>
                    {m.role}
                    {m.curso && ` · ${m.curso}`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className={styles.subheading}>Lo que estamos haciendo</h3>
      <ul className={styles.initiatives}>
        {initiatives.map((item) => (
          <li key={item.title}>
            <Card variant="outline" className={styles.initiative}>
              <Pill size="sm" variant={item.status === 'en-curso' ? 'primary' : item.status === 'realizada' ? 'deep' : 'outline'}>
                {STATUS_LABEL[item.status]}
              </Pill>
              <Text weight="medium" size="md">
                {item.title}
              </Text>
              <Text tone="muted">{item.text}</Text>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
