import { Section } from '@/components/ui';
import { ChatMessage, SectionHeader } from '@/components/blocks';
import type { ChatMessageData } from '@/components/blocks';
import { titleText } from '../types';
import type { SectionBaseProps, SectionTitle } from '../types';
import styles from './Conversation.module.css';

export type ConversationProps = SectionBaseProps & {
  title?: SectionTitle;
  description?: string;
  messages: ChatMessageData[];
};

/** Preguntas frecuentes contadas como un chat entre una familia y la escuela. */
export function Conversation({ id, title, description, messages }: ConversationProps) {
  return (
    <Section id={id} label={titleText(title)}>
      {title && <SectionHeader title={title} description={description} />}
      <div className={styles.thread} role="log" aria-live="off">
        {messages.map((message, i) => (
          <ChatMessage key={i} {...message} />
        ))}
      </div>
    </Section>
  );
}
