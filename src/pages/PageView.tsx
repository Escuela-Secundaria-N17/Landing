import { useEffect, useRef } from 'react';
import { SectionRenderer } from '@/sections/SectionRenderer';
import type { PageConfig } from './types';

type PageViewProps = {
  page: PageConfig;
  siteName: string;
  /** Hash de la URL (ej. "#inscripcion") para scrollear al llegar. */
  hash: string;
};

/**
 * Monta una página: título de la pestaña, scroll al llegar y foco
 * para lectores de pantalla (anuncian la página nueva).
 */
export function PageView({ page, siteName, hash }: PageViewProps) {
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    document.title = page.path === '/' ? siteName : `${page.title} · ${siteName}`;
  }, [page, siteName]);

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      target.scrollIntoView();
    } else if (!firstRender.current) {
      window.scrollTo(0, 0);
    }
    if (!firstRender.current) {
      mainRef.current?.focus({ preventScroll: true });
    }
    firstRender.current = false;
  }, [page, hash]);

  return (
    <main ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
