import { useEffect, useState } from 'react';
import { Button, Icon, IconButton } from '@/components/ui';
import { Mascot } from '@/components/blocks';
import type { NavItem } from '@/pages/navigation';
import type { SiteConfig } from '@/content/site';
import { isActivePath } from '@/router/Router';
import { cx } from '@/lib/cx';
import { AlertBar, isAlertActive } from '../AlertBar/AlertBar';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './SiteHeader.module.css';

type SiteHeaderProps = {
  site: SiteConfig;
  nav: NavItem[];
  currentPath: string;
};

/**
 * Escritorio: links principales visibles en la barra.
 * Mobile/tablet: menú hamburguesa con todas las páginas.
 */
export function SiteHeader({ site, nav, currentPath }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const primary = nav.filter((item) => item.primary);
  const menuItems = [{ href: '/', label: 'Inicio', primary: false }, ...nav, { href: '#contacto', label: 'Contacto', primary: false }];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar el menú al cambiar de página
  useEffect(() => setOpen(false), [currentPath]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const ariaCurrent = (href: string) => (isActivePath(currentPath, href) ? ('page' as const) : undefined);

  return (
    <header className={cx(styles.header, (scrolled || open) && styles.solid)}>
      {isAlertActive(site.alert) && <AlertBar alert={site.alert} />}
      <div className={styles.bar}>
        <a href="/" className={styles.brand} aria-label={`${site.name}, ir al inicio`}>
          <Mascot variant="face" size={44} animated={false} priority className={styles.logo} />
          <span className={styles.tagline}>
            <span>{site.tagline[0]}</span>
            <span>{site.tagline[1]}</span>
          </span>
        </a>

        <nav className={styles.desktopNav} aria-label="Principal">
          <ul>
            {primary.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.navLink} aria-current={ariaCurrent(item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <Button
            href={site.cta.href}
            size="sm"
            className={styles.cta}
            title={site.cta.description}
            {...(site.cta.external ? { target: '_blank', rel: 'noopener' } : {})}
          >
            {site.cta.label}
            {site.cta.external && <Icon name="arrow" size={14} />}
          </Button>
          <IconButton
            label={open ? 'Cerrar menú' : 'Abrir menú'}
            variant="primary"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className={styles.menuButton}
          >
            <span className={cx(styles.burger, open && styles.burgerOpen)} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </IconButton>
        </div>
      </div>

      <nav id="site-menu" className={cx(styles.menu, open && styles.menuOpen)} aria-label="Menú" hidden={!open}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.href.startsWith('#') ? undefined : ariaCurrent(item.href)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
