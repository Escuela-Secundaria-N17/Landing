import type { PageConfig } from './types';

export type NavItem = { href: string; label: string; primary: boolean };

/** El menú se deriva de las páginas: una página con `nav` aparece sola. */
export function getNavItems(pages: PageConfig[]): NavItem[] {
  return pages
    .filter((p) => p.nav)
    .map((p) => ({ href: p.path, label: p.nav!.label, primary: Boolean(p.nav!.primary) }));
}

export function findPage(pages: PageConfig[], path: string, fallback: PageConfig): PageConfig {
  return pages.find((p) => p.path === path) ?? fallback;
}
