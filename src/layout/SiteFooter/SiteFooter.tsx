import { Container, Text } from '@/components/ui';
import { Mascot, Wordmark } from '@/components/blocks';
import type { SiteConfig } from '@/content/site';
import styles from './SiteFooter.module.css';

type SiteFooterProps = {
  site: SiteConfig;
};

export function SiteFooter({ site }: SiteFooterProps) {
  return (
    <footer id="contacto" className={styles.footer}>
      <Container>
        <div className={styles.columns}>
          {site.footer.columns.map((col, i) => (
            <div key={col.title ?? i} className={styles.column}>
              {col.title && (
                <Text size="xs" tone="muted" as="h3">
                  {col.title}
                </Text>
              )}
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={styles.link}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className={styles.brand}>
        <Mascot size={320} className={styles.mascot} />
        <Wordmark text={site.shortName} tone="solid" />
      </div>

      <Container>
        <Text size="xs" tone="subtle" className={styles.legal}>
          © {new Date().getFullYear()} {site.name} · {site.footer.legal}
        </Text>
      </Container>
    </footer>
  );
}
